class ErrorHandler {
    static showCriticalError(message) {
        // Initialize i18n if not already done
        if (!window.i18n) {
            console.error('i18n not initialized. Error:', message);
            this.showFallbackError(message);
            return;
        }

        if (document.body) {
            document.body.innerHTML = `
                <div style="color: #ff4d4d; text-align: center; padding: 40px; background: #121212; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif;">
                    <h2 style="margin-bottom:10px;">${window.i18n.t('errors.bypassScriptError')}</h2>
                    <p style="font-size: 1.1em; background: #1e1e1e; padding: 15px; border-radius: 8px; border: 1px solid #333;">${message}</p>
                    <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                        <button onclick="location.reload()" style="padding:10px 20px; background:#1E88E5; color:white; border:none; border-radius:5px; cursor:pointer;">${window.i18n.t('errors.reloadPage')}</button>
                        <button onclick="this.parentElement.parentElement.style.display='none'" style="padding:10px 20px; background:#555; color:white; border:none; border-radius:5px; cursor:pointer;">${window.i18n.t('ui.close')}</button>
                    </div>
                </div>`;
        }
        console.error('Userscript error:', message);
    }

    static showFallbackError(message) {
        if (document.body) {
            document.body.innerHTML = `
                <div style="color: #ff4d4d; text-align: center; padding: 40px; background: #121212; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif;">
                    <h2 style="margin-bottom:10px;">Bypass Script Error</h2>
                    <p style="font-size: 1.1em; background: #1e1e1e; padding: 15px; border-radius: 8px; border: 1px solid #333;">${message}</p>
                    <button onclick="location.reload()" style="margin-top:20px; padding:10px 20px; background:#1E88E5; color:white; border:none; border-radius:5px; cursor:pointer;">Reload Page</button>
                </div>`;
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorHandler;
}