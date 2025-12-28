class ErrorHandler {
    /**
     * Shows a critical error and replaces the page content.
     * @param {string} message - Error message.
     */
    static showCriticalError(message) {
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

    /**
     * Handles redirect failures with user feedback.
     * @param {string} redirectUrl - The URL that failed to redirect.
     */
    static handleRedirectFailure(redirectUrl) {
        UIManager.showError('Redirect failed. Please copy and open the link manually: ' + redirectUrl);
    }

    static logError(context, error) {
        console.error(`[ReBypass Error] ${context}:`, {
            error: error.message,
            stack: error.stack,
            url: window.location.href,
            timestamp: new Date().toISOString()
        });
    }

    static showToast(message, type = 'error') {
        const colors = {
            error: '#ff4d4d',
            warning: '#ff9800',
            info: '#2196f3',
            success: '#4caf50'
        };

        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px;
            background: ${colors[type]}; color: white;
            padding: 12px 20px; border-radius: 6px;
            z-index: 2147483647; font-family: sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorHandler;
}