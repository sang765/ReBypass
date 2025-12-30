const https = require('https');
const fs = require('fs');
const path = require('path');

const URL = 'https://raw.githubusercontent.com/bypass-vip/userscript/main/bypass-vip.user.js';
const JSON_FILE = path.join(__dirname, 'metadata.json');

function fetchUserscript() {
    return new Promise((resolve, reject) => {
        https.get(URL, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

function extractMatches(content) {
    const matches = [];
    const lines = content.split('\n');
    for (const line of lines) {
        const match = line.match(/^\/\/ @match\s+(.+)$/);
        if (match) {
            matches.push(match[1]);
        }
    }
    return matches;
}

async function main() {
    try {
        console.log('Fetching latest bypass-vip.user.js...');
        const content = await fetchUserscript();

        console.log('Extracting match patterns...');
        const matches = extractMatches(content);

        console.log(`Found ${matches.length} match patterns.`);

        // Read current JSON
        const jsonPath = JSON_FILE;
        const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

        // Update matches
        jsonData.matches = matches;

        // Write back
        fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
        console.log('Updated metadata.json with new match patterns.');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();