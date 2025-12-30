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
            advancedMode: this.getValue('advancedMode', true),
            globalTime: this.getValue('globalTime', 25),
            key: this.getValue('key', ''),
            safeMode: this.getValue('safeMode', true)
        };
    }

    static getWaitTimes() {
        return this.getValue('waitTimes', this.DEFAULT_WAIT_TIMES);
    }

    static registerMenuCommands() {
        this.registerMenuCommand('Toggle Advanced Time Mode', () => {
            const current = this.getValue('advancedMode', true);
            this.setValue('advancedMode', !current);
            alert(`Advanced Time Mode ${!current ? 'enabled' : 'disabled'}. Reload the page to apply.`);
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
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConfigManager;
}