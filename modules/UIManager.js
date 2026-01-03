const BYPASS_LOGO = GM_info.script.icon;

// --- OBFUSCATION UTILS ---
function randomId() {
    return 'a' + Math.random().toString(36).substr(2, 9);
}

// Dynamic IDs for UI elements to avoid detection
const toastId = randomId();
const containerId = randomId();
const settingsBtnId = randomId();
const settingsDropdownId = randomId();
const themeToggleBtnId = randomId();
const advancedModeInputId = randomId();
const timeInputId = randomId();
const keyInputId = randomId();
const iframeEnabledInputId = randomId();
const timeUrlShortenerId = randomId();
const timeSocialUnlockId = randomId();
const timeRedirectHubId = randomId();
const timeLootlabsEcosystemId = randomId();
const timeMegaHubId = randomId();
const timeLeakNsfwHubId = randomId();
const timePasteTextHostId = randomId();
const timeCommunityDiscordId = randomId();
const timeRandomObfuscatedId = randomId();
const timeDefaultId = randomId();
const saveSettingsId = randomId();
const nextBtnId = randomId();
const cancelBtnId = randomId();
const errorMsgId = randomId();
const spinnerId = randomId();
const clickToCopyUrlId = randomId();
const copyStatusId = randomId();
const countdownId = randomId();

// Map for time input IDs
const timeIdMap = {
    url_shortener: timeUrlShortenerId,
    social_unlock: timeSocialUnlockId,
    redirect_hub: timeRedirectHubId,
    lootlabs_ecosystem: timeLootlabsEcosystemId,
    mega_hub: timeMegaHubId,
    leak_nsfw_hub: timeLeakNsfwHubId,
    paste_text_host: timePasteTextHostId,
    community_discord: timeCommunityDiscordId,
    random_obfuscated: timeRandomObfuscatedId,
    default: timeDefaultId
};

class UIManager {
    static showBypassToast() {
        if (document.querySelector('.bypass-toast')) return;
        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = 'bypass-toast';
        toast.style.cssText = `
            position: fixed; top: 12px; left: 50%; transform: translateX(-50%);
            background: rgba(18, 18, 18, 0.6); color: white; padding: 8px 16px;
            border-radius: 30px; border: 1px solid #1E88E5; z-index: 2147483647;
            display: flex; align-items: center; font-family: 'Segoe UI', sans-serif;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5); font-size: 13px; font-weight: 500;
            pointer-events: none; backdrop-filter: blur(4px);
        `;
        const message = Utils.hasWorkinkChallenge() ? 'Please complete captcha first!' : 'BYPASS.VIP: STARTING BYPASS...';
        toast.innerHTML = `
            <img src="${BYPASS_LOGO}" style="width:18px; height:18px; margin-right:10px;">
            <span>${message}</span>
        `;
        (document.body || document.documentElement).appendChild(toast);
    }


    static injectBypassInfoUI(targetUrl) {
        const cfg = ConfigManager.getConfig();
        const container = document.querySelector('.highlights-container') || document.body;
        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = `background: rgba(30,30,30,0.8); border:1px solid #333; border-radius:12px; padding:15px; margin:20px auto; max-width:600px; color:#fff; font-family:sans-serif;`;
        infoDiv.innerHTML = `
            <div style="display:flex; align-items:center; margin-bottom:10px;">
                <img src="${BYPASS_LOGO}" style="width:20px; height:20px; margin-right:10px;">
                <span style="font-weight:bold; color:#1E88E5; font-size:13px; flex-grow:1;">CLICK THE URL TO COPY:</span>
                <span id="${copyStatusId}" style="color:#2ecc71; font-size:11px; opacity:0; transition:0.3s;">Copied!</span>
            </div>
            <div id="${clickToCopyUrlId}" style="background: rgba(0,0,0,0.8); padding:10px; border-radius:6px; word-break:break-all; font-family:monospace; font-size:12px; border:1px solid #444; color:#2ecc71; cursor:pointer;" aria-label="Click to copy" tabindex="0">${targetUrl}</div>
        `;
        container.insertBefore(infoDiv, container.firstChild);

        if (cfg.iframeEnabled) {
            const iframeDiv = document.createElement('div');
            iframeDiv.style.cssText = `margin:20px auto; max-width:600px;`;
            const iframeSrc = `https://bypass.vip/userscript${window.location.search}`;
            iframeDiv.innerHTML = `<iframe src="${iframeSrc}" style="width:100%; height:600px; border:none; border-radius:12px;"></iframe>`;
            container.insertBefore(iframeDiv, container.firstChild);
        }

        const urlBox = document.getElementById(clickToCopyUrlId);
        const status = document.getElementById(copyStatusId);
        urlBox.onclick = () => {
            ConfigManager.setClipboard(targetUrl);
            status.style.opacity = '1';
            setTimeout(() => { status.style.opacity = '0'; }, 1500);
        };
    }

    static createContainer() {
        // Hide any existing toast notification
        const existingToast = document.querySelector('.bypass-toast');
        if (existingToast) existingToast.remove();

        // Detect and set initial theme
        const currentTheme = this.detectTheme();
        this.setTheme(currentTheme);

        const container = document.createElement('div');
        container.id = containerId;
        container.className = `bypass-${currentTheme}`;
        container.style.cssText = `
            --primary-color: #1E88E5;
            --bg-color: rgba(18, 18, 18, 0.9);
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
            backdrop-filter: blur(8px);
        `;
        container.innerHTML = `
            <div style="position: absolute; top: 20px; right: 20px;">
                <button id="${settingsBtnId}" style="
                    background: var(--bg-color); border: 1px solid var(--primary-color); color: var(--primary-color);
                    padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 0.9em;
                    transition: all 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                ">⚙️ Settings</button>
                <div id="${settingsDropdownId}" style="
                    display: none; position: absolute; top: 40px; right: 0; background: rgba(30,30,30,0.8);
                    border: 1px solid #333; border-radius: 8px; padding: 15px; width: 250px; max-height: 500px; overflow-y: auto;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.5); z-index: 2147483648;
                ">
                    <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; color: var(--text-color); cursor: pointer;">
                        <input id="${advancedModeInputId}" type="checkbox" style="width: 18px; height: 18px; cursor: pointer;">
                        <span style="cursor: pointer;">Advanced Time Mode</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; color: var(--text-color); cursor: pointer;">
                        <input id="${iframeEnabledInputId}" type="checkbox" style="width: 18px; height: 18px; cursor: pointer;">
                        <span style="cursor: pointer;">Enable Iframe</span>
                    </label>
                    <label style="display: block; margin-bottom: 10px; color: var(--text-color);">
                        Global Time (seconds): <input id="${timeInputId}" type="number" style="width: 100%; padding: 5px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;">
                    </label>
                    <label style="display: block; margin-bottom: 10px; color: var(--text-color);">
                        API Key: <input id="${keyInputId}" type="text" style="width: 100%; padding: 5px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;">
                    </label>
                    <h4 style="margin: 10px 0 5px 0; color: var(--text-color); font-size: 0.9em;">Advanced Wait Times (seconds):</h4>
                    <label style="display: block; margin-bottom: 5px; color: var(--text-color); font-size: 0.8em;">url_shortener: <input id="${timeUrlShortenerId}" type="number" style="width: 50px; padding: 2px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;"></label>
                    <label style="display: block; margin-bottom: 5px; color: var(--text-color); font-size: 0.8em;">social_unlock: <input id="${timeSocialUnlockId}" type="number" style="width: 50px; padding: 2px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;"></label>
                    <label style="display: block; margin-bottom: 5px; color: var(--text-color); font-size: 0.8em;">redirect_hub: <input id="${timeRedirectHubId}" type="number" style="width: 50px; padding: 2px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;"></label>
                    <label style="display: block; margin-bottom: 5px; color: var(--text-color); font-size: 0.8em;">lootlabs_ecosystem: <input id="${timeLootlabsEcosystemId}" type="number" style="width: 50px; padding: 2px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;"></label>
                    <label style="display: block; margin-bottom: 5px; color: var(--text-color); font-size: 0.8em;">mega_hub: <input id="${timeMegaHubId}" type="number" style="width: 50px; padding: 2px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;"></label>
                    <label style="display: block; margin-bottom: 5px; color: var(--text-color); font-size: 0.8em;">leak_nsfw_hub: <input id="${timeLeakNsfwHubId}" type="number" style="width: 50px; padding: 2px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;"></label>
                    <label style="display: block; margin-bottom: 5px; color: var(--text-color); font-size: 0.8em;">paste_text_host: <input id="${timePasteTextHostId}" type="number" style="width: 50px; padding: 2px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;"></label>
                    <label style="display: block; margin-bottom: 5px; color: var(--text-color); font-size: 0.8em;">community_discord: <input id="${timeCommunityDiscordId}" type="number" style="width: 50px; padding: 2px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;"></label>
                    <label style="display: block; margin-bottom: 5px; color: var(--text-color); font-size: 0.8em;">random_obfuscated: <input id="${timeRandomObfuscatedId}" type="number" style="width: 50px; padding: 2px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;"></label>
                    <label style="display: block; margin-bottom: 5px; color: var(--text-color); font-size: 0.8em;">default: <input id="${timeDefaultId}" type="number" style="width: 50px; padding: 2px; background: #333; color: white; border: 1px solid #555; border-radius: 4px;"></label>
                    <button id="${saveSettingsId}" style="
                        width: 100%; padding: 8px; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer;
                        transition: background 0.3s;
                    ">Save</button>
                </div>
            </div>
            <img src="${BYPASS_LOGO}" style="width: 80px; height: 80px; margin-bottom: 20px;">
            <h2 style="font-size: 2.5em; margin-bottom: 15px; color: #ffffff; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">BYPASS.VIP</h2>
            <p style="margin-bottom: 30px; font-size: 1.1em; color: #b0b0b0; max-width: 600px;">Click the button below to proceed to the bypassed link.</p>
            <div id="${countdownId}" style="font-size: 1.3em; margin-bottom: 30px; padding: 15px; background: rgba(30,30,30,0.8); border-radius: 12px; width: 90%; max-width: 600px; border: 1px solid #333;"></div>
            <div style="display: flex; gap: 15px; flex-wrap: wrap; justify-content: center;">
                <button id="${nextBtnId}" type="button" style="
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
                <button id="${cancelBtnId}" type="button" style="
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
            <div id="${errorMsgId}" style="color: var(--error-color); margin-top: 30px; display: none; font-size: 1.1em; background: rgba(42,42,42,0.8); padding: 15px; border-radius: 8px; border: 1px solid #444; max-width: 600px;"></div>
            <div id="${spinnerId}" style="border: 5px solid #333333; border-top: 5px solid var(--primary-color); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; display: none; margin-top: 20px;"></div>
            <style>
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                #${nextBtnId}:hover { background-color: #1565C0; transform: translateY(-3px); box-shadow: 0 8px 16px rgba(0,0,0,0.5); }
                #${nextBtnId}:active { transform: translateY(0); }
                #${nextBtnId}:disabled {
                    pointer-events: none;
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                #${cancelBtnId}:hover { background-color: #999; transform: translateY(-3px); }
                #${cancelBtnId}:active { transform: translateY(0); }
                #${themeToggleBtnId}:hover { background: var(--primary-color); color: white; }
                #${settingsBtnId}:hover { background: var(--primary-color); color: white; }
                @media (max-width: 768px) {
                    #${containerId} {
                        padding: 10px;
                        font-size: 0.9em;
                    }
                    #${containerId} img {
                        width: 60px;
                        height: 60px;
                    }
                    #${containerId} h2 {
                        font-size: 2em;
                    }
                    #${countdownId} {
                        font-size: 1.1em;
                        padding: 10px;
                    }
                    #${nextBtnId} {
                        padding: 12px 24px;
                        font-size: 1em;
                    }
                    #${cancelBtnId} {
                        padding: 12px 24px;
                        font-size: 1em;
                    }
                    #${settingsDropdownId} { width: 200px; padding: 10px; }
                    #${timeInputId}, #${keyInputId} { font-size: 0.9em; }
                }
            </style>
        `;
        return container;
    }

    static detectTheme() {
        // Check for dark mode preference
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light';
    }

    static setTheme(theme) {
        // Apply theme-specific styles if needed
        // The container already uses CSS variables for theming
        // This method can be extended for more complex theme switching
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}