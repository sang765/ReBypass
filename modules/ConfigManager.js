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

    /**
     * Loads domain classifications from the remote JSON file.
     * Falls back to empty object if fetch fails.
     */
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

    /**
     * Gets the category for a given domain.
     * @param {string} domain - The domain to categorize.
     * @returns {string} The category or 'default'.
     */
    static getDomainCategory(domain) {
        for (const [cat, domains] of Object.entries(this.classifications)) {
            if (domains.includes(domain)) {
                return cat;
            }
        }
        return 'default';
    }

    /**
     * Retrieves configuration from GM storage with defaults.
     * @returns {object} Configuration object.
     */
    static getConfig() {
        return {
            advancedMode: GM_getValue('advancedMode', true),
            globalTime: GM_getValue('globalTime', 25),
            key: GM_getValue('key', ''),
            safeMode: GM_getValue('safeMode', true),
            stealthMode: GM_getValue('stealthMode', false),
            theme: GM_getValue('theme', 'dark'), // New: UI theme
            autoProceed: GM_getValue('autoProceed', false) // New: Auto-click proceed after countdown
        };
    }

    /**
     * Saves configuration to GM storage.
     * @param {object} config - Configuration object to save.
     */
    static saveConfig(config) {
        GM_setValue('advancedMode', config.advancedMode);
        GM_setValue('globalTime', config.globalTime);
        GM_setValue('key', config.key);
        GM_setValue('safeMode', config.safeMode);
        GM_setValue('stealthMode', config.stealthMode);
        GM_setValue('theme', config.theme);
        GM_setValue('autoProceed', config.autoProceed);
    }

    /**
     * Gets wait times from GM storage with defaults.
     * @returns {object} Wait times object.
     */
    static getWaitTimes() {
        return GM_getValue('waitTimes', this.DEFAULT_WAIT_TIMES);
    }

    /**
     * Saves wait times to GM storage.
     * @param {object} waitTimes - Wait times object to save.
     */
    static saveWaitTimes(waitTimes) {
        GM_setValue('waitTimes', waitTimes);
    }

    /**
     * Registers menu commands for settings.
     */
    static registerMenuCommands() {
        GM_registerMenuCommand('Toggle Advanced Time Mode', () => {
            const current = GM_getValue('advancedMode', true);
            GM_setValue('advancedMode', !current);
            alert(`Advanced Time Mode ${!current ? 'enabled' : 'disabled'}. Reload the page to apply.`);
        });

        GM_registerMenuCommand('Toggle Stealth Mode', () => {
            const current = GM_getValue('stealthMode', false);
            GM_setValue('stealthMode', !current);
            alert(`Stealth Mode ${!current ? 'enabled' : 'disabled'}. Reload the page to apply.`);
        });

        GM_registerMenuCommand('Set Global Wait Time', () => {
            const time = prompt('Enter global wait time in seconds:', GM_getValue('globalTime', 25));
            if (time !== null) {
                const t = parseInt(time);
                if (!isNaN(t) && t > 0) {
                    GM_setValue('globalTime', t);
                    alert(`Global wait time set to ${t} seconds. Reload the page to apply.`);
                } else {
                    alert('Invalid time. Must be a positive number.');
                }
            }
        });
    }

    // Thêm phương thức mới
    static getCurrentDomain() {
        return window.location.hostname;
    }
}

// Export cho môi trường userscript
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConfigManager;
}