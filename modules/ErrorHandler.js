class ErrorHandler {
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
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorHandler;
}