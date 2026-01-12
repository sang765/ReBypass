import { readFileSync, writeFileSync } from 'fs';

interface Metadata {
    name: string;
    namespace: string;
    version: string;
    author: string;
    description: string;
    grants: string[];
    excludes: string[];
    matches: string[];
    custom_matches: string[];
    requires?: string[];
    downloadURL: string;
    updateURL: string;
    source: string;
    icon: string;
    "run-at": string;
    tag: string;
}

interface PackageJson {
    version: string;
}

// Check for no-update flag
const isNoUpdate = process.argv.includes('no-update');

// Read package.json for version
const packageJson: PackageJson = JSON.parse(readFileSync('package.json', 'utf8'));

// Read metadata from scripts/metadata.json
const info: Metadata = JSON.parse(readFileSync('scripts/metadata.json', 'utf8'));

let metadata = '// ==UserScript==\n';
const scriptName = isNoUpdate ? `RB ${packageJson.version} (NO-UPDATE)` : info.name;
metadata += `// @name          ${scriptName}\n`;
metadata += `// @namespace     ${info.namespace}\n`;
metadata += `// @version       ${packageJson.version}\n`;
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
// Only add downloadURL and updateURL if not no-update
if (!isNoUpdate) {
    metadata += `// @downloadURL   ${info.downloadURL}\n`;
    metadata += `// @updateURL     ${info.updateURL}\n`;
}
metadata += `// @source   ${info.source}\n`;
metadata += `// @icon          ${info.icon}\n`;
metadata += `// @run-at        ${info["run-at"]}\n`;
metadata += `// @tag           ${info.tag}\n`;
for (let req of info.requires || []) {
    metadata += `// @require       ${req}\n`;
}
metadata += '// ==/UserScript==\n';

// Add module
const modules = [
    'modules/ConfigManager.js',
    'modules/Utils.js',
    'modules/UIManager.js',
    'modules/ErrorHandler.js',
    'modules/EventManager.js',
    'modules/ClientSideBypass.js',
    'modules/MainController.js'
];

let bundled = metadata;

modules.forEach(modulePath => {
    const content = readFileSync(modulePath, 'utf8');
    // Remove export/import statements
    let cleaned = content
        .replace(/if \(typeof module !== 'undefined' && module.exports\) \{[\s\S]*?\}/g, '')
        .replace(/module\.exports = .*?;/g, '');
    cleaned = cleaned.trim();
    bundled += '\n' + cleaned;
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
const outputFile = isNoUpdate ? 'ReBypass-No-Update.user.js' : 'ReBypass.user.js';
writeFileSync(outputFile, bundled);
console.log('Build completed!');

// Clean matches (remove regular matches but keep custom matches)
info.matches = [];
info.version = "";
info.name = "ReBypass"; // Reset name to original
writeFileSync('scripts/metadata.json', JSON.stringify(info, null, 2));
console.log('Cleaned match patterns from metadata.json');