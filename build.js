const fs = require('fs');
const path = require('path');

// Read metadata from scripts/metadata.json
const info = JSON.parse(fs.readFileSync('scripts/metadata.json', 'utf8'));

// Sync version to package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
packageJson.version = info.version;
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
console.log('Synced version to package.json');
let metadata = '// ==UserScript==\n';
metadata += `// @name          ${info.name}\n`;
metadata += `// @namespace     ${info.namespace}\n`;
metadata += `// @version       ${info.version}\n`;
metadata += `// @author        ${info.author}\n`;
metadata += `// @description   ${info.description}\n`;
for (let grant of info.grants) {
    metadata += `// @grant         ${grant}\n`;
}
for (let match of info.matches) {
    metadata += `// @match         ${match}\n`;
}
for (let customMatch of info.custom_matches) {
    metadata += `// @match         ${customMatch}\n`;
}
for (let exclude of info.excludes) {
    metadata += `// @exclude       ${exclude}\n`;
}
metadata += `// @downloadURL   ${info.downloadURL}\n`;
metadata += `// @updateURL     ${info.updateURL}\n`;
metadata += `// @homepageURL   ${info.homepageURL}\n`;
metadata += `// @icon          ${info.icon}\n`;
metadata += `// @run-at        ${info["run-at"]}\n`;
for (let req of info.requires || []) {
    metadata += `// @require       ${req}\n`;
}
metadata += '// ==/UserScript==\n\n';

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

// Clean matches (remove regular matches but keep custom matches)
info.matches = [];
fs.writeFileSync('scripts/metadata.json', JSON.stringify(info, null, 2));
console.log('Cleaned match patterns from metadata.json');