class MainController {
    static config;
    static waitTimes;

    /**
     * Initializes the script by loading classifications and running the main logic.
     */
    static async init() {
        try {
            await ConfigManager.loadClassifications();
            ConfigManager.registerMenuCommands();

            this.config = ConfigManager.getConfig();
            this.waitTimes = ConfigManager.getWaitTimes();

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded',
                    () => this.execute(),
                    { once: true }
                );
            } else {
                this.execute();
            }
        } catch (error) {
            ErrorHandler.logError('Initialization', error);
            throw error;
        }
    }

    static execute() {
        try {
            if (Utils.isBypassSite()) {
                this.handleBypassSite();
                return;
            }

            const redirectUrl = Utils.getQueryParam('redirect');
            if (!redirectUrl) {
                this.handleInitialRedirect();
                return;
            }

            this.handleRedirectPage(redirectUrl);
        } catch (error) {
            ErrorHandler.showCriticalError(`Execution error: ${error.message}`);
        }
    }

    static handleBypassSite() {
        const targetUrl = Utils.getQueryParam('url');
        if (targetUrl) {
            UIManager.injectBypassInfoUI(decodeURIComponent(targetUrl));
        }
    }

    static handleInitialRedirect() {
        if (!this.config.stealthMode) {
            UIManager.showBypassToast();
        }

        const randomDelay = this.config.stealthMode ?
            Math.random() * 2000 + 500 : 800;

        setTimeout(() => {
            const params = new URLSearchParams({
                url: encodeURIComponent(location.href),
                time: 20,
                key: ''
            });

            location.replace(`https://bypass.vip/userscript.html?${params}`);
        }, randomDelay);
    }

    static handleRedirectPage(rawRedirect) {
        const redirectUrl = this.validateAndDecodeUrl(rawRedirect);
        if (!redirectUrl) return;

        if (this.isAlreadyInjected()) return;

        UIManager.showBypassToast();
        this.injectUI(redirectUrl);
    }

    static validateAndDecodeUrl(url) {
        let candidateUrl = url;
        try {
            const decoded = decodeURIComponent(url);
            if (Utils.isValidUrl(decoded)) {
                candidateUrl = decoded;
            }
        } catch (err) {
            // decodeURIComponent failed, use original
        }

        if (Utils.isValidUrl(candidateUrl)) {
            return candidateUrl;
        } else {
            ErrorHandler.showCriticalError('Error: Invalid or malformed redirect URL. Please try again.');
            return null;
        }
    }

    static isAlreadyInjected() {
        return document.body && document.body.hasAttribute('data-bypass-injected');
    }

    static injectUI(redirectUrl) {
        const container = UIManager.createContainer(this.config, this.waitTimes);
        document.body.appendChild(container);
        document.body.setAttribute('data-bypass-injected', 'true');

        UIManager.bindSettingsHandlers((settings) => {
            ConfigManager.saveConfig(settings.config);
            ConfigManager.saveWaitTimes(settings.waitTimes);
            // Reload to apply settings
            location.reload();
        });

        this.setupEventListeners(redirectUrl);

        if (this.config.autoProceed && !Utils.hasHash(redirectUrl)) {
            this.setupAutoProceed(redirectUrl);
        }
    }

    static setupEventListeners(redirectUrl) {
        const eventManager = new EventManager(redirectUrl);
        eventManager.setupButtonEvents();
        eventManager.setupSettingsEvents();
        eventManager.setupHashCountdown();
    }

    static setupAutoProceed(redirectUrl) {
        let time = 3; // Auto-proceed after 3 seconds
        const interval = setInterval(() => {
            UIManager.updateCountdown(`AUTO-PROCEEDING IN ${time} SECONDS...`, '#2ecc71');
            time--;
            if (time < 0) {
                clearInterval(interval);
                // Auto-click the proceed button
                const btn = document.getElementById(UIManager.ids.nextBtn);
                if (btn && !btn.disabled) {
                    btn.click();
                }
            }
        }, 1000);
    }

    static getWaitTime() {
        const category = ConfigManager.getDomainCategory(ConfigManager.getCurrentDomain());
        let time = this.config.advancedMode ?
            (this.waitTimes[category] || this.waitTimes.default) :
            this.config.globalTime;
        return Utils.randomizeWaitTime(time);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MainController;
}