class UIManager {
    static BYPASS_LOGO = GM_info.script.icon;
    static ids = {
        toast: Utils.randomId(),
        container: Utils.randomId(),
        settingsBtn: Utils.randomId(),
        settingsDropdown: Utils.randomId(),
        advancedModeInput: Utils.randomId(),
        stealthModeInput: Utils.randomId(),
        timeInput: Utils.randomId(),
        keyInput: Utils.randomId(),
        themeInput: Utils.randomId(), // New
        autoProceedInput: Utils.randomId(), // New
        timeUrlShortener: Utils.randomId(),
        timeSocialUnlock: Utils.randomId(),
        timeRedirectHub: Utils.randomId(),
        timeLootlabsEcosystem: Utils.randomId(),
        timeMegaHub: Utils.randomId(),
        timeLeakNsfwHub: Utils.randomId(),
        timePasteTextHost: Utils.randomId(),
        timeCommunityDiscord: Utils.randomId(),
        timeRandomObfuscated: Utils.randomId(),
        timeDefault: Utils.randomId(),
        saveSettings: Utils.randomId(),
        nextBtn: Utils.randomId(),
        cancelBtn: Utils.randomId(),
        errorMsg: Utils.randomId(),
        spinner: Utils.randomId(),
        clickToCopyUrl: Utils.randomId(),
        copyStatus: Utils.randomId(),
        countdown: Utils.randomId()
    };

    static timeIdMap = {
        url_shortener: this.ids.timeUrlShortener,
        social_unlock: this.ids.timeSocialUnlock,
        redirect_hub: this.ids.timeRedirectHub,
        lootlabs_ecosystem: this.ids.timeLootlabsEcosystem,
        mega_hub: this.ids.timeMegaHub,
        leak_nsfw_hub: this.ids.timeLeakNsfwHub,
        paste_text_host: this.ids.timePasteTextHost,
        community_discord: this.ids.timeCommunityDiscord,
        random_obfuscated: this.ids.timeRandomObfuscated,
        default: this.ids.timeDefault
    };

    /**
     * Shows a top-center toast notification.
     */
    static showBypassToast() {
        if (document.querySelector('.bypass-toast')) return;
        const toast = document.createElement('div');
        toast.id = this.ids.toast;
        toast.className = 'bypass-toast';
        toast.style.cssText = `
            position: fixed; top: 12px; left: 50%; transform: translateX(-50%);
            background: rgba(18, 18, 18, 0.9); color: white; padding: 8px 16px;
            border-radius: 30px; border: 1px solid #1E88E5; z-index: 2147483647;
            display: flex; align-items: center; font-family: 'Segoe UI', sans-serif;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5); font-size: 13px; font-weight: 500;
            pointer-events: none; backdrop-filter: blur(4px);
        `;
        toast.innerHTML = `
            <img src="${this.BYPASS_LOGO}" style="width:18px; height:18px; margin-right:10px;">
            <span>BYPASS.VIP: STARTING BYPASS...</span>
        `;
        (document.body || document.documentElement).appendChild(toast);
    }

    /**
     * Injects bypass info UI on bypass.vip page.
     * @param {string} targetUrl - The URL to display for copying.
     */
    static injectBypassInfoUI(targetUrl) {
        const container = document.querySelector('.highlights-container') || document.body;
        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = `background:#1e1e1e; border:1px solid #333; border-radius:12px; padding:15px; margin:20px auto; max-width:600px; color:#fff; font-family:sans-serif;`;
        infoDiv.innerHTML = `
            <div style="display:flex; align-items:center; margin-bottom:10px;">
                <img src="${this.BYPASS_LOGO}" style="width:20px; height:20px; margin-right:10px;">
                <span style="font-weight:bold; color:#1E88E5; font-size:13px; flex-grow:1;">CLICK THE URL TO COPY:</span>
                <span id="${this.ids.copyStatus}" style="color:#2ecc71; font-size:11px; opacity:0; transition:0.3s;">Copied!</span>
            </div>
            <div id="${this.ids.clickToCopyUrl}" style="background:#000; padding:10px; border-radius:6px; word-break:break-all; font-family:monospace; font-size:12px; border:1px solid #444; color:#2ecc71; cursor:pointer;" aria-label="Click to copy" tabindex="0">${targetUrl}</div>
        `;
        container.insertBefore(infoDiv, container.firstChild);

        const urlBox = document.getElementById(this.ids.clickToCopyUrl);
        const status = document.getElementById(this.ids.copyStatus);
        urlBox.onclick = () => {
            GM_setClipboard(targetUrl);
            status.style.opacity = '1';
            setTimeout(() => status.style.opacity = '0', 1500);
        };
    }

    /**
     * Creates the main bypass container with settings and controls.
     * @param {object} config - Current configuration.
     * @param {object} waitTimes - Current wait times.
     * @returns {HTMLElement} The container element.
     */
    static createContainer(config, waitTimes) {
        const container = document.createElement('div');
        container.id = this.ids.container;
        const themeStyles = config.theme === 'light' ? `
            --bg-color: rgba(255, 255, 255, 0.9);
            --text-color: #333;
            --error-color: #d32f2f;
            --success-color: #388e3c;
            color: var(--text-color);
        ` : '';
        container.style.cssText = `
            --primary-color: #1E88E5;
            --bg-color: rgba(18, 18, 18, 0.7);
            --text-color: #e0e0e0;
            --error-color: #ff4d4d;
            --success-color: #2ecc71;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--bg-color);
            color: var(--text-color);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 20px;
            z-index: 2147483647;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            overflow: auto;
            box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
            pointer-events: auto;
            ${themeStyles}
        `;
        container.innerHTML = `
            <div style="position: absolute; top: 20px; right: 20px;">
                <button id="${this.ids.settingsBtn}" style="
                    background: var(--bg-color); border: 1px solid var(--primary-color); color: var(--primary-color);
                    padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 0.9em;
                    transition: all 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                ">⚙️ Settings</button>
                <div id="${this.ids.settingsDropdown}" style="
                    display: none; position: absolute; top: 40px; right: 0; background: #1e1e1e;
                    border: 1px solid #333; border-radius: 8px; padding: 15px; width: 280px; max-height: 500px; overflow-y: auto;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.5); z-index: 2147483648;
                ">
                    <label style="display: block; margin-bottom: 10px; color: var(--text-color);">
                        <input id="${this.ids.advancedModeInput}" type="checkbox" ${config.advancedMode ? 'checked' : ''}> Advanced Time Mode
                    </label>
                    <label style="display: block; margin-bottom: 10px; color: var(--text-color);">
                        <input id="${this.ids.stealthModeInput}" type="checkbox" ${config.stealthMode ? 'checked' : ''}> Stealth Mode (No UI)
                    </label>
                    <label style="display: block; margin-bottom: 10px; color: var(--text-color);">
                        <input id="${this.ids.themeInput}" type="checkbox" ${config.theme === 'light' ? 'checked' : ''}> Light Theme
                    </label>
                    <label style="display: block; margin-bottom: 10px; color: var(--text-color);">
                        <input id="${this.ids.autoProceedInput}" type="checkbox" ${config.autoProceed ? 'checked' : ''}> Auto-Proceed After Countdown
                    </label>
                    <label style="display: block; margin-bottom: 10px; color: var(--text-color);">
                        Global Time (seconds): <input id="${this.ids.timeInput}" type="number" value="${config.globalTime}" style="width: 100%; padding: 5px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;">
                    </label>
                    <label style="display: block; margin-bottom: 10px; color: var(--text-color);">
                        API Key: <input id="${this.ids.keyInput}" type="text" value="${config.key}" style="width: 100%; padding: 5px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;">
                    </label>
                    <h4 style="margin: 10px 0 5px 0; color: var(--text-color); font-size: 0.9em;">Advanced Wait Times (seconds):</h4>
                    <label style="display: block; margin-bottom: 5px; color: var(--text-color); font-size: 0.8em;">url_shortener: <input id="${this.ids.timeUrlShortener}" type="number" value="${waitTimes.url_shortener}" style="width: 50px; padding: 2px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;"></label>
                    <label style="display: block; margin-bottom: 5px; color: var(--text-color); font-size: 0.8em;">social_unlock: <input id="${this.ids.timeSocialUnlock}" type="number" value="${waitTimes.social_unlock}" style="width: 50px; padding: 2px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;"></label>
                    <label style="display: block; margin-bottom: 5px; color: var(--text-color); font-size: 0.8em;">redirect_hub: <input id="${this.ids.timeRedirectHub}" type="number" value="${waitTimes.redirect_hub}" style="width: 50px; padding: 2px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;"></label>
                    <label style="display: block; margin-bottom: 5px; color: var(--text-color); font-size: 0.8em;">lootlabs_ecosystem: <input id="${this.ids.timeLootlabsEcosystem}" type="number" value="${waitTimes.lootlabs_ecosystem}" style="width: 50px; padding: 2px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;"></label>
                    <label style="display: block; margin-bottom: 5px; color: var(--text-color); font-size: 0.8em;">mega_hub: <input id="${this.ids.timeMegaHub}" type="number" value="${waitTimes.mega_hub}" style="width: 50px; padding: 2px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;"></label>
                    <label style="display: block; margin-bottom: 5px; color: var(--text-color); font-size: 0.8em;">leak_nsfw_hub: <input id="${this.ids.timeLeakNsfwHub}" type="number" value="${waitTimes.leak_nsfw_hub}" style="width: 50px; padding: 2px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;"></label>
                    <label style="display: block; margin-bottom: 5px; color: var(--text-color); font-size: 0.8em;">paste_text_host: <input id="${this.ids.timePasteTextHost}" type="number" value="${waitTimes.paste_text_host}" style="width: 50px; padding: 2px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;"></label>
                    <label style="display: block; margin-bottom: 5px; color: var(--text-color); font-size: 0.8em;">community_discord: <input id="${this.ids.timeCommunityDiscord}" type="number" value="${waitTimes.community_discord}" style="width: 50px; padding: 2px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;"></label>
                    <label style="display: block; margin-bottom: 5px; color: var(--text-color); font-size: 0.8em;">random_obfuscated: <input id="${this.ids.timeRandomObfuscated}" type="number" value="${waitTimes.random_obfuscated}" style="width: 50px; padding: 2px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;"></label>
                    <label style="display: block; margin-bottom: 5px; color: var(--text-color); font-size: 0.8em;">default: <input id="${this.ids.timeDefault}" type="number" value="${waitTimes.default}" style="width: 50px; padding: 2px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;"></label>
                    <button id="${this.ids.saveSettings}" style="
                        width: 100%; padding: 8px; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer;
                        transition: background 0.3s;
                    ">Save</button>
                </div>
            </div>
            <img src="${this.BYPASS_LOGO}" style="width: 80px; height: 80px; margin-bottom: 20px;">
            <h2 style="font-size: 2.5em; margin-bottom: 15px; color: #ffffff; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">BYPASS.VIP</h2>
            <p style="margin-bottom: 30px; font-size: 1.1em; color: #b0b0b0; max-width: 600px;">Click the button below to proceed to the bypassed link.</p>
            <div id="${this.ids.countdown}" style="font-size: 1.3em; margin-bottom: 30px; padding: 15px; background: #1e1e1e; border-radius: 12px; width: 90%; max-width: 600px; border: 1px solid #333;"></div>
            <div style="display: flex; gap: 15px; flex-wrap: wrap; justify-content: center;">
                <button id="${this.ids.nextBtn}" type="button" style="
                    padding: 15px 30px;
                    background-color: var(--primary-color);
                    color: #ffffff;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-size: 1.2em;
                    box-shadow: 0 6px 12px rgba(0,0,0,0.4);
                    position: relative;
                    z-index: 2147483647;
                    pointer-events: auto;
                ">PROCEED</button>
                <button id="${this.ids.cancelBtn}" type="button" style="
                    padding: 15px 30px;
                    background-color: #666;
                    color: #ffffff;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-size: 1.2em;
                    box-shadow: 0 6px 12px rgba(0,0,0,0.4);
                ">Cancel</button>
            </div>
            <div id="${this.ids.errorMsg}" style="color: var(--error-color); margin-top: 30px; display: none; font-size: 1.1em; background: #2a2a2a; padding: 15px; border-radius: 8px; border: 1px solid #444; max-width: 600px;"></div>
            <div id="${this.ids.spinner}" style="border: 5px solid #333333; border-top: 5px solid var(--primary-color); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; display: none; margin-top: 20px;"></div>
            <style>
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                #${this.ids.nextBtn}:hover { background-color: #1565C0; transform: translateY(-3px); box-shadow: 0 8px 16px rgba(0,0,0,0.5); }
                #${this.ids.nextBtn}:active { transform: translateY(0); }
                #${this.ids.nextBtn}:disabled {
                    pointer-events: none;
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                #${this.ids.cancelBtn}:hover { background-color: #999; transform: translateY(-3px); }
                #${this.ids.cancelBtn}:active { transform: translateY(0); }
                #${this.ids.settingsBtn}:hover { background: var(--primary-color); color: white; }
                @media (max-width: 768px) {
                    #${this.ids.container} {
                        padding: 10px;
                        font-size: 0.9em;
                    }
                    #${this.ids.container} img {
                        width: 60px;
                        height: 60px;
                    }
                    #${this.ids.container} h2 {
                        font-size: 2em;
                    }
                    #${this.ids.countdown} {
                        font-size: 1.1em;
                        padding: 10px;
                    }
                    #${this.ids.nextBtn} {
                        padding: 12px 24px;
                        font-size: 1em;
                    }
                    #${this.ids.cancelBtn} {
                        padding: 12px 24px;
                        font-size: 1em;
                    }
                    #${this.ids.settingsDropdown} { width: 200px; padding: 10px; }
                    #${this.ids.timeInput}, #${this.ids.keyInput} { font-size: 0.9em; }
                }
            </style>
        `;
        return container;
    }

    /**
     * Shows an error message in the UI.
     * @param {string} message - Error message to display.
     */
    static showError(message) {
        const errorEl = document.getElementById(this.ids.errorMsg);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
        console.error(message);
    }

    /**
     * Hides the error message.
     */
    static hideError() {
        const errorEl = document.getElementById(this.ids.errorMsg);
        if (errorEl) {
            errorEl.style.display = 'none';
        }
    }

    static showSpinner() {
        const spinner = document.getElementById(this.ids.spinner);
        if (spinner) spinner.style.display = 'block';
    }

    static hideSpinner() {
        const spinner = document.getElementById(this.ids.spinner);
        if (spinner) spinner.style.display = 'none';
    }

    static disableProceedButton() {
        const btn = document.getElementById(this.ids.nextBtn);
        if (btn) btn.disabled = true;
    }

    static enableProceedButton() {
        const btn = document.getElementById(this.ids.nextBtn);
        if (btn) btn.disabled = false;
    }

    static updateCountdown(text, color = '') {
        const countdown = document.getElementById(this.ids.countdown);
        if (countdown) {
            countdown.textContent = text;
            if (color) countdown.style.color = color;
        }
    }

    static bindSettingsHandlers(onSave) {
        const saveBtn = document.getElementById(this.ids.saveSettings);
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const settings = this.getCurrentSettings();
                onSave(settings);
            });
        }
    }

    static getCurrentSettings() {
        // Implementation to extract from form
        return {};
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}