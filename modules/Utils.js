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

    static async checkLinkvertisePremium() {
        try {
            const response = await fetch('https://linkvertise.com/account', { credentials: 'include' });
            if (!response.ok) return false;
            const finalUrl = response.url;
            if (finalUrl === 'https://linkvertise.com/' || finalUrl === 'https://linkvertise.com') {
                return false; // Not logged in
            }
            const html = await response.text();
            if (html.includes('Direct Access. No Interruptions.')) {
                return false; // Logged in but no Premium
            }
            if (html.includes('Linkvertise Premium') && html.includes('State: Active')) {
                // Check next payment date
                const match = html.match(/Next payment:\s*(\d{2}\/\d{2}\/\d{4})/);
                if (match) {
                    const nextPaymentStr = match[1];
                    const [month, day, year] = nextPaymentStr.split('/').map(Number);
                    const nextPayment = new Date(year, month - 1, day);
                    const now = new Date();
                    if (nextPayment > now) {
                        return true; // Active Premium
                    }
                }
            }
            return false;
        } catch (error) {
            console.warn('Failed to check Linkvertise Premium:', error);
            return false; // On error, assume no Premium
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}