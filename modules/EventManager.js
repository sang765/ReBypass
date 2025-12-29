class EventManager {
    constructor(redirectUrl) {
        this.redirectUrl = redirectUrl;
        this.isRedirecting = false;
    }

    setupButtonEvents() {
        const btn = document.getElementById(UIManager.ids.nextBtn);
        const cancelBtn = document.getElementById(UIManager.ids.cancelBtn);

        if (btn) {
            // Click
            btn.addEventListener('click', (e) => this.handleProceedClick(e));

            // Touch
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleProceedClick(e);
            });

            // Keyboard
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleProceedClick(e);
                }
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to cancel and reload?')) {
                    location.reload();
                }
            });
        }
    }

    setupSettingsEvents() {
        const settingsBtn = document.getElementById(UIManager.ids.settingsBtn);
        const settingsDropdown = document.getElementById(UIManager.ids.settingsDropdown);

        if (settingsBtn && settingsDropdown) {
            settingsBtn.addEventListener('click', () => {
                const isVisible = settingsDropdown.style.display === 'block';
                settingsDropdown.style.display = isVisible ? 'none' : 'block';
            });

            // Close dropdown khi click ra ngoài
            document.addEventListener('click', (e) => {
                if (!settingsBtn.contains(e.target) && !settingsDropdown.contains(e.target)) {
                    settingsDropdown.style.display = 'none';
                }
            });
        }
    }

    handleProceedClick(e) {
        e.preventDefault();
        e.stopPropagation();

        if (this.isRedirecting || !this.redirectUrl) return;

        this.isRedirecting = true;
        UIManager.disableProceedButton();
        UIManager.showSpinner();

        this.performRedirect();
    }

    performRedirect() {
        const randomDelay = Math.random() * 200 + 60;

        setTimeout(() => {
            try {
                window.location.assign(this.redirectUrl);
            } catch (err) {
                try {
                    window.location.href = this.redirectUrl;
                } catch (err2) {
                    ErrorHandler.handleRedirectFailure(this.redirectUrl);
                    this.isRedirecting = false;
                    UIManager.enableProceedButton();
                    UIManager.hideSpinner();
                }
            }
        }, randomDelay);
    }

    setupHashCountdown() {
        if (!Utils.hasHash(this.redirectUrl)) return;

        let time = 8;
        const interval = setInterval(() => {
            UIManager.updateCountdown(
                `YOU HAVE EXACTLY ${time} SECONDS TO CLICK THE BUTTON BEFORE YOUR HASH EXPIRES`,
                '#ff4d4d'
            );

            time--;
            if (time < 0) {
                clearInterval(interval);
                UIManager.updateCountdown('HASH EXPIRED. RETRYING...');
                UIManager.disableProceedButton();
                UIManager.showSpinner();

                setTimeout(() => {
                    location.replace(location.href.split('?')[0]);
                }, 3500);
            }
        }, 1000);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventManager;
}