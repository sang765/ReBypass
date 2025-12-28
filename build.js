const fs = require('fs');
const path = require('path');

// Read metadata from main.js
const metadata = fs.readFileSync('main.js', 'utf8').split('\n').slice(0, -3).join('\n') + '\n// ==/UserScript==\n\n';

// Add module
const modules = [
    'modules/ConfigManager.js',
    'modules/Utils.js',
    'modules/UIManager.js',
    'modules/ErrorHandler.js',
    'modules/EventManager.js',
    'modules/MainController.js'
];

let bundled = metadata;

modules.forEach(modulePath => {
    const content = fs.readFileSync(modulePath, 'utf8');
    // Remove export/import statements
    const cleaned = content
        .replace(/if \(typeof module !== 'undefined' && module.exports\) \{[\s\S]*?\}/g, '')
        .replace(/module\.exports = .*?;/g, '');
    bundled += '\n\n' + cleaned;
});

// Add main execution code
bundled += `

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
`;

// Create package file
fs.writeFileSync('ReBypass.user.js', bundled);
console.log('Build completed!');