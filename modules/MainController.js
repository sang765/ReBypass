let classifications = {};
let cfg;
let wt;

async function loadClassifications() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/sang765/ReBypass/refs/heads/main/domains-classification.json');
        if (response.ok) {
            classifications = await response.json();
        } else {
            throw new Error('Failed to fetch classifications');
        }
    } catch (e) {
        console.warn('Failed to load domain classifications, using default times:', e);
    }
}

function getDomainCategory(domain) {
    for (const [cat, domains] of Object.entries(classifications)) {
        if (domains.includes(domain)) {
            return cat;
        }
    }
    return 'default';
}

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
        await loadClassifications();

        // Menu commands for settings
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

        cfg = {
            advancedMode: GM_getValue('advancedMode', true),
            globalTime: GM_getValue('globalTime', 25),
            key: GM_getValue('key', ''),
            safeMode: GM_getValue('safeMode', true),
            stealthMode: GM_getValue('stealthMode', false)
        };

        wt = GM_getValue('waitTimes', {
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
        });

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.runScript(), { once: true });
        } else {
            this.runScript();
        }
    }

    static runScript() {
        const urlParams = new URLSearchParams(window.location.search);

        const currentDomain = window.location.hostname;
        const category = getDomainCategory(currentDomain);
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
            GM_setValue('advancedMode', advancedMode);
            GM_setValue('stealthMode', stealthMode);
            GM_setValue('globalTime', globalTime);
            GM_setValue('key', key);
            GM_setValue('waitTimes', waitTimesNew);
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

        container.addEventListener('click', (e) => {
            if (e.target && e.target.id === 'nextBtn') return;
        });

        try {
            newBtn.setAttribute('aria-label', 'Proceed to link');
            newBtn.tabIndex = 0;
        } catch (err) { /* silent */ }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MainController;
}