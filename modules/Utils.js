class Utils {
    static randomId() {
        return 'a' + Math.random().toString(36).substr(2, 9);
    }

    static isBypassSite() {
        return window.location.hostname === 'bypass.vip' && window.location.pathname.includes('userscript');
    }

    static hasCaptcha() {
        const captchaSelectors = [
            '[class*="captcha"]',
            '[id*="captcha"]',
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

    static hasWorkinkChallenge() {
        const workinkDomains = ['work.ink', 'workink.net', 'workink.me', 'workink.one'];
        if (!workinkDomains.includes(window.location.hostname)) return false;
        const challengeDiv = document.querySelector('.challenge-wrapper');
        return challengeDiv && challengeDiv.textContent.trim() === 'Solve the challenge to access this site.';
    }

    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}