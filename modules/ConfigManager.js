class ConfigManager {
    static DOMAIN_CLASSIFICATIONS_URL = 'https://raw.githubusercontent.com/sang765/ReBypass/refs/heads/main/domains-classification.json';

    static DEFAULT_WAIT_TIMES = {
        url_shortener: 20,
        social_unlock: 5,
        redirect_hub: 0,
        lootlabs_ecosystem: 20,
        mega_hub: 18,
        leak_nsfw_hub: 25,
        paste_text_host: 8,
        community_discord: 10,
        random_obfuscated: 15,
        default: 25
    };

    static classifications = {};

    // Storage wrapper with fallback to localStorage
    static getValue(key, defaultValue) {
        if (typeof GM_getValue === 'function') {
            return GM_getValue(key, defaultValue);
        } else {
            const value = localStorage.getItem('ReBypass_' + key);
            if (value === null) return defaultValue;
            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        }
    }

    static setValue(key, value) {
        if (typeof GM_setValue === 'function') {
            GM_setValue(key, value);
        } else {
            localStorage.setItem('ReBypass_' + key, JSON.stringify(value));
        }
    }

    static registerMenuCommand(name, callback) {
        if (typeof GM_registerMenuCommand === 'function') {
            GM_registerMenuCommand(name, callback);
        }
    }

    static setClipboard(text) {
        if (typeof GM_setClipboard === 'function') {
            GM_setClipboard(text);
        } else {
            navigator.clipboard.writeText(text).catch(() => {
                // Fallback: create temporary textarea
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            });
        }
    }

    static async loadClassifications() {
        try {
            const response = await fetch(this.DOMAIN_CLASSIFICATIONS_URL);
            if (response.ok) {
                this.classifications = await response.json();
            } else {
                throw new Error('Failed to fetch classifications');
            }
        } catch (e) {
            console.warn('Failed to load domain classifications, using default times:', e);
        }
    }

    static getDomainCategory(domain) {
        for (const [cat, domains] of Object.entries(this.classifications)) {
            if (domains.includes(domain)) {
                return cat;
            }
        }
        return 'default';
    }

    static getConfig() {
        return {
            timeMode: this.getValue('timeMode', 'advanced'),
            globalTime: this.getValue('globalTime', 25),
            key: this.getValue('key', ''),
            safeMode: this.getValue('safeMode', true),
            stealthMode: this.getValue('stealthMode', false),
            randomTimeMin: this.getValue('randomTimeMin', 5),
            randomTimeMax: this.getValue('randomTimeMax', 30)
        };
    }

    static getWaitTimes() {
        return this.getValue('waitTimes', this.DEFAULT_WAIT_TIMES);
    }

    static getTimeModeConfig() {
        return {
            mode: this.getValue('timeMode', 'advanced'),
            minTime: this.getValue('randomTimeMin', 5),
            maxTime: this.getValue('randomTimeMax', 30)
        };
    }

    static isRandomTimeValid() {
        const config = this.getTimeModeConfig();
        return config.mode === 'random' &&
               typeof config.minTime === 'number' &&
               typeof config.maxTime === 'number' &&
               config.minTime > 0 &&
               config.maxTime > config.minTime;
    }

    static getRandomWaitTime() {
        const config = this.getTimeModeConfig();
        if (!this.isRandomTimeValid()) {
            return config.minTime || 5; // Fallback to default min time
        }

        const randomValue = Math.random() * (config.maxTime - config.minTime) + config.minTime;
        return Math.floor(randomValue);
    }

    static registerMenuCommands() {
        this.registerMenuCommand('Set Time Mode to Classic', () => {
            this.setValue('timeMode', 'classic');
            alert('Time Mode set to Classic. Reload the page to apply.');
        });

        this.registerMenuCommand('Set Time Mode to Advanced', () => {
            this.setValue('timeMode', 'advanced');
            alert('Time Mode set to Advanced. Reload the page to apply.');
        });

        this.registerMenuCommand('Set Time Mode to Random', () => {
            this.setValue('timeMode', 'random');
            alert('Time Mode set to Random. Reload the page to apply.');
        });

        this.registerMenuCommand('Toggle Stealth Mode', () => {
            const current = this.getValue('stealthMode', false);
            this.setValue('stealthMode', !current);
            alert(`Stealth Mode ${!current ? 'enabled' : 'disabled'}. Reload the page to apply.`);
        });

        this.registerMenuCommand('Set Global Wait Time', () => {
            const time = prompt('Enter global wait time in seconds:', this.getValue('globalTime', 25));
            if (time !== null) {
                const t = parseInt(time);
                if (!isNaN(t) && t > 0) {
                    this.setValue('globalTime', t);
                    alert(`Global wait time set to ${t} seconds. Reload the page to apply.`);
                } else {
                    alert('Invalid time. Must be a positive number.');
                }
            }
        });

        this.registerMenuCommand('Configure Random Time', () => {
            const current = this.getTimeModeConfig();
            const minTime = prompt('Enter minimum wait time in seconds:', current.minTime);
            if (minTime !== null) {
                const min = parseInt(minTime);
                if (!isNaN(min) && min > 0) {
                    const maxTime = prompt('Enter maximum wait time in seconds:', current.maxTime);
                    if (maxTime !== null) {
                        const max = parseInt(maxTime);
                        if (!isNaN(max) && max > min) {
                            this.setValue('randomTimeMin', min);
                            this.setValue('randomTimeMax', max);
                            alert(`Random Time configured!\nMin: ${min}s, Max: ${max}s\nReload the page to apply.`);
                        } else {
                            alert('Invalid maximum time. Must be greater than minimum time.');
                        }
                    }
                } else {
                    alert('Invalid minimum time. Must be a positive number.');
                }
            }
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConfigManager;
}