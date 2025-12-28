class Utils {
    /**
     * Generates a random ID for UI elements to avoid detection.
     * @returns {string} Random ID string.
     */
    static randomId() {
        return 'a' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Checks if the current page has CAPTCHA elements.
     * @returns {boolean} True if CAPTCHA is detected.
     */
    static hasCaptcha() {
        const captchaSelectors = [
            '[class*="captcha"]',
            '[id*="captcha"]',
            '[id*="cf-"]',
            '.recaptcha',
            '#recaptcha',
            '.hcaptcha',
            '#hcaptcha',
            'iframe[src*="recaptcha"]',
            'iframe[src*="hcaptcha"]',
            'iframe[src*="cloudflare"]',
            '[data-sitekey]',
            '.cf-browser-verification'
        ];
        for (const selector of captchaSelectors) {
            if (document.querySelector(selector)) return true;
        }
        return false;
    }

    /**
     * Validates if a string is a valid URL.
     * @param {string} url - The URL to validate.
     * @returns {boolean} True if valid URL.
     */
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Checks if a URL contains a 'hash' parameter.
     * @param {string} url - The URL to check.
     * @returns {boolean} True if hash parameter exists.
     */
    static hasHash(url) {
        try {
            return new URL(url).searchParams.has('hash') || url.includes('hash=');
        } catch {
            return url.includes('hash=');
        }
    }

    /**
     * Checks if the current site is bypass.vip/userscript.
     * @returns {boolean} True if on bypass site.
     */
    static isBypassSite() {
        return window.location.hostname === 'bypass.vip' && window.location.pathname.includes('userscript');
    }

    /**
     * Generates a randomized wait time with jitter for anti-detection.
     * @param {number} baseTime - Base wait time in seconds.
     * @returns {number} Randomized wait time, minimum 1 second.
     */
    static randomizeWaitTime(baseTime) {
        return Math.max(1, baseTime + Math.floor(Math.random() * 6) - 3);
    }

    // Thêm các utilities mới
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    static sanitizeUrl(url) {
        try {
            const urlObj = new URL(url);
            // Loại bỏ các tham số tracking phổ biến
            const blacklistedParams = ['utm_', 'fbclid', 'gclid', 'ref'];
            for (const param of blacklistedParams) {
                urlObj.searchParams.forEach((value, key) => {
                    if (key.startsWith(param)) {
                        urlObj.searchParams.delete(key);
                    }
                });
            }
            return urlObj.toString();
        } catch {
            return url;
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}