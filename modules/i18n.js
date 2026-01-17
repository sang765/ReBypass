/**
 * i18n Module - Internationalization support for ReBypass
 * Provides translation management and language switching functionality
 */

class i18n {
    static DEFAULT_LANGUAGE = 'en';
    static SUPPORTED_LANGUAGES = ['en', 'vi'];
    static TRANSLATIONS = {};

    /**
     * Initialize i18n with translations
     */
    static init() {
        // Default translations will be loaded from translations module
        this.loadLanguage(this.getCurrentLanguage());
    }

    /**
     * Get current language from storage or detect from browser
     * Supports language variants (e.g., vi-VN, en-US) and intelligent fallback
     */
    static getCurrentLanguage() {
        const stored = this.getStoredLanguage();
        if (stored && this.SUPPORTED_LANGUAGES.includes(stored)) {
            return stored;
        }

        // Detect browser language with improved variant handling
        const detected = this.detectBrowserLanguage();
        if (detected) {
            return detected;
        }

        return this.DEFAULT_LANGUAGE;
    }

    /**
     * Detect browser language with fallback support for language variants
     * Handles cases like 'vi-VN', 'en-US', 'en-GB', etc.
     * @returns {string|null} Detected language code or null
     */
    static detectBrowserLanguage() {
        // Get all available language preferences from navigator
        const languages = this.getBrowserLanguages();

        // Try to find exact match or base language match
        for (const lang of languages) {
            // Normalize language code
            const normalized = lang.toLowerCase().split(/[-_]/)[0];

            // Check for exact match first
            if (this.SUPPORTED_LANGUAGES.includes(lang.toLowerCase())) {
                return lang.toLowerCase();
            }

            // Check for base language match (e.g., 'vi' from 'vi-VN')
            if (this.SUPPORTED_LANGUAGES.includes(normalized)) {
                return normalized;
            }
        }

        return null;
    }

    /**
     * Get array of browser language preferences
     * Supports navigator.languages (standard) and navigator.language (fallback)
     * @returns {string[]} Array of language codes
     */
    static getBrowserLanguages() {
        const languages = [];

        // Modern browsers - navigator.languages is array of preferences
        if (navigator.languages && navigator.languages.length > 0) {
            languages.push(...navigator.languages);
        }

        // Fallback for older browsers
        if (navigator.language) {
            languages.push(navigator.language);
        }

        // Another fallback
        if (navigator.userLanguage) {
            languages.push(navigator.userLanguage);
        }

        return [...new Set(languages)].filter(lang => lang); // Remove duplicates and empty values
    }

    /**
     * Get stored language preference
     */
    static getStoredLanguage() {
        if (typeof GM_getValue === 'function') {
            return GM_getValue('ReBypass_language', null);
        } else {
            return localStorage.getItem('ReBypass_language');
        }
    }

    /**
     * Set language preference
     */
    static setLanguage(language) {
        if (!this.SUPPORTED_LANGUAGES.includes(language)) {
            console.warn(`Language ${language} not supported`);
            return;
        }

        if (typeof GM_setValue === 'function') {
            GM_setValue('ReBypass_language', language);
        } else {
            localStorage.setItem('ReBypass_language', language);
        }

        this.loadLanguage(language);
    }

    /**
     * Load translations for a specific language
     */
    static loadLanguage(language) {
        if (!window.ReBypassTranslations || !window.ReBypassTranslations[language]) {
            console.warn(`Translations for ${language} not found, falling back to ${this.DEFAULT_LANGUAGE}`);
            language = this.DEFAULT_LANGUAGE;
        }

        this.TRANSLATIONS = window.ReBypassTranslations[language] || {};
    }

    /**
     * Get translated string with variable substitution
     * @param {string} key - Translation key (dot notation supported)
     * @param {object} variables - Variables to substitute in the translation
     * @returns {string} Translated string
     */
    static t(key, variables = {}) {
        let translation = this.getNestedValue(this.TRANSLATIONS, key);

        if (!translation) {
            console.warn(`Translation key not found: ${key}`);
            return key; // Return key as fallback
        }

        // Replace variables in translation
        Object.keys(variables).forEach(varKey => {
            translation = translation.replace(new RegExp(`\\$\\{${varKey}\\}`, 'g'), variables[varKey]);
        });

        return translation;
    }

    /**
     * Get nested value from object using dot notation
     * @private
     */
    static getNestedValue(obj, key) {
        return key.split('.').reduce((acc, part) => acc?.[part], obj);
    }

    /**
     * Get list of supported languages
     */
    static getLanguages() {
        return this.SUPPORTED_LANGUAGES;
    }

    /**
     * Get language name in native language
     */
    static getLanguageName(lang) {
        const names = {
            'en': 'English',
            'vi': 'Tiếng Việt'
        };
        return names[lang] || lang;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = i18n;
}
