(async () => {
    'use strict';

    if (window.top !== window.self) return;

    try {
        await MainController.init();
    } catch (error) {
        console.error('Failed to initialize ReBypass:', error);
        ErrorHandler.showCriticalError('Initialization failed: ' + error.message);
    }
})();