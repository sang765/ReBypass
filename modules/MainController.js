let cfg;
let wt;

function showError(message) {
    if (document.body) {
        document.body.innerHTML = `
            <div style="color: #ff4d4d; text-align: center; padding: 40px; background: #121212; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif;">
                <h2 style="margin-bottom:10px;">Bypass Script Error</h2>
                <p style="font-size: 1.1em; background: #1e1e1e; padding: 15px; border-radius: 8px; border: 1px solid #333;">${message}</p>
                <button onclick="location.reload()" style="margin-top:20px; padding:10px 20px; background:#1E88E5; color:white; border:none; border-radius:5px; cursor:pointer;">Reload Page</button>
            </div>`;
    }
    console.error('Userscript error:', message);
}

function showStartingNotification() {
    UIManager.showBypassToast();
}

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

class MainController {
    static async init() {
        await ConfigManager.loadClassifications();

        // Menu commands for settings
        ConfigManager.registerMenuCommands();

        cfg = ConfigManager.getConfig();
        wt = ConfigManager.getWaitTimes();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.runScript(), { once: true });
        } else {
            this.runScript();
        }
    }

    static runScript() {
        const urlParams = new URLSearchParams(window.location.search);

        const currentDomain = window.location.hostname;
        const category = ConfigManager.getDomainCategory(currentDomain);
        let waitTime = cfg.advancedMode ? (wt[category] || wt.default) : cfg.globalTime;
        // Add randomization to avoid detection
        waitTime += Math.floor(Math.random() * 6) - 3; // Randomize -3 to +2 seconds
        waitTime = Math.max(1, waitTime); // Ensure at least 1 second

        if (Utils.isBypassSite()) {
            const targetUrl = urlParams.get('url');
            if (targetUrl) UIManager.injectBypassInfoUI(decodeURIComponent(targetUrl));
            return;
        }

        const rawRedirect = urlParams.get('redirect');

        if (!rawRedirect) {
            if (!cfg.stealthMode) {
                showStartingNotification();
            }
            const randomDelay = cfg.stealthMode ? Math.random() * 2000 + 500 : 800; // Randomize delay in stealth
            setTimeout(() => {
                const targetUrl = `https://bypass.vip/userscript.html?url=${encodeURIComponent(location.href)}&time=${waitTime}&key=${cfg.key}&safe=${cfg.safeMode}&rnd=${Math.random().toString(36).substr(2, 9)}`;
                location.replace(targetUrl);
            }, randomDelay);
            return;
        }

        let redirectUrl = rawRedirect;

        if (!isValidUrl(redirectUrl)) {
            try {
                const decoded = decodeURIComponent(rawRedirect);
                if (isValidUrl(decoded)) {
                    redirectUrl = decoded;
                } else {
                    throw new Error('Invalid redirect URL after decoding');
                }
            } catch (err) {
                showError('Error: Invalid or malformed redirect URL. Please try again.');
                return;
            }
        }

        if (document.body && document.body.hasAttribute('data-bypass-injected')) {
            return;
        }

        showStartingNotification();

        if (!Utils.hasWorkinkChallenge()) {
            const container = UIManager.createContainer();
            if (document.body) {
                document.body.appendChild(container);
                document.body.setAttribute('data-bypass-injected', 'true');
            } else {
                document.documentElement.appendChild(container);
                document.documentElement.setAttribute('data-bypass-injected', 'true');
            }

            // Semi-hide UI if captcha is detected
            if (Utils.hasCaptcha()) {
                container.style.opacity = '0.5';
                container.style.pointerEvents = 'none';
            }
            setTimeout(() => {
                if (Utils.hasCaptcha()) {
                    container.style.opacity = '0.5';
                    container.style.pointerEvents = 'none';
                }
            }, 2000);

            // Settings dropdown toggle
            const settingsBtn = container.querySelector(`#${settingsBtnId}`);
            const settingsDropdown = container.querySelector(`#${settingsDropdownId}`);
            settingsBtn.addEventListener('click', () => {
                settingsDropdown.style.display = settingsDropdown.style.display === 'none' ? 'block' : 'none';
            });

            const saveSettings = container.querySelector(`#${saveSettingsId}`);
            saveSettings.addEventListener('click', () => {
                const advancedMode = document.getElementById(advancedModeInputId).checked;
                const stealthMode = document.getElementById(stealthModeInputId).checked;
                const globalTime = parseInt(document.getElementById(timeInputId).value);
                const key = document.getElementById(keyInputId).value;
                const waitTimesNew = {};
                for (const cat of Object.keys(wt)) {
                    const val = parseInt(document.getElementById(timeIdMap[cat]).value);
                    waitTimesNew[cat] = isNaN(val) ? wt[cat] : val;
                }
                ConfigManager.setValue('advancedMode', advancedMode);
                ConfigManager.setValue('stealthMode', stealthMode);
                ConfigManager.setValue('globalTime', globalTime);
                ConfigManager.setValue('key', key);
                ConfigManager.setValue('waitTimes', waitTimesNew);
                settingsDropdown.style.display = 'none';
                alert('Settings saved. Reload the page to apply changes.');
            });

            // Cancel button
            const cancelBtn = container.querySelector(`#${cancelBtnId}`);
            cancelBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to cancel and reload?')) {
                    location.reload();
                }
            });

            const countdownEl = container.querySelector(`#${countdownId}`);
            const btn = container.querySelector(`#${nextBtnId}`);
            const spinner = container.querySelector(`#${spinnerId}`);

            const newBtn = btn; // element is controlled by us; no need to clone
            const hasHash = (url) => {
                try {
                    return new URL(url).searchParams.has('hash') || url.includes('hash=');
                } catch {
                    return url.includes('hash=');
                }
            };

            if (hasHash(redirectUrl)) {
                let time = 8;
                countdownEl.style.color = '#ff4d4d';
                countdownEl.style.fontWeight = 'bold';
                const interval = setInterval(() => {
                    countdownEl.textContent = `YOU HAVE EXACTLY ${time} SECONDS TO CLICK THE BUTTON BEFORE YOUR HASH EXPIRES`;
                    time--;
                    if (time < 0) {
                        clearInterval(interval);
                        countdownEl.textContent = 'HASH EXPIRED. RETRYING...';
                        countdownEl.style.color = '';
                        countdownEl.style.fontWeight = '';
                        newBtn.disabled = true;
                        spinner.style.display = 'block';
                        setTimeout(() => {
                            location.replace(location.href.split('?')[0]);
                        }, 3500);
                    }
                }, 1000);
            } else {
                countdownEl.style.display = 'none';
            }

            const performRedirect = () => {
                if (!redirectUrl || newBtn.disabled) return;
                try {
                    newBtn.disabled = true;
                    spinner.style.display = 'block';
                    const randomDelay = Math.random() * 200 + 60; // Randomize 60-260ms
                    setTimeout(() => {
                        try {
                            window.location.assign(redirectUrl);
                        } catch (err) {
                            window.location.href = redirectUrl;
                        }
                    }, randomDelay);
                } catch (err) {
                    showError('Redirect failed. Please copy and open the link manually: ' + redirectUrl);
                    newBtn.disabled = false;
                    spinner.style.display = 'none';
                }
            };

            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                performRedirect();
            }, { passive: false });

            newBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                performRedirect();
            }, { passive: false });

            // Prevent all pointer events from passing through to the underlying page
            const preventEventPropagation = (e) => {
                const interactiveIds = [nextBtnId, cancelBtnId, settingsBtnId, themeToggleBtnId, saveSettingsId];
                if (e.target && interactiveIds.includes(e.target.id)) return;
                e.preventDefault();
                e.stopPropagation();
            };

            // Use capture phase to intercept events before they reach targets
            const eventTypes = ['click', 'mousedown', 'mouseup', 'touchstart', 'touchmove', 'touchend', 'contextmenu'];
            eventTypes.forEach(eventType => {
                const isTouch = eventType.startsWith('touch');
                container.addEventListener(eventType, preventEventPropagation, { capture: true, passive: !isTouch });
            });

            try {
                newBtn.setAttribute('aria-label', 'Proceed to link');
                newBtn.tabIndex = 0;
            } catch (err) { /* silent */ }
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MainController;
}