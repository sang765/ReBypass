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

function extractDomains(matches) {
    const domains = [];
    for (const match of matches) {
        const domainMatch = match.match(/:\/\/([^\/]+)/);
        if (domainMatch) {
            domains.push(domainMatch[1]);
        }
    }
    return domains;
}

async function main() {
    const args = process.argv.slice(2);
    const hasSync = args.includes('--sync');
    const hasPrint = args.includes('--print');
    const hasExport = args.includes('--export');

    if (!hasSync && !hasPrint && !hasExport) {
        console.log('Usage: node sync-matches.js [--sync] [--print] [--export]');
        console.log('--sync: Update metadata.json with match patterns');
        console.log('--print: Print match patterns to terminal');
        console.log('--export: Export domains without * to terminal');
        process.exit(1);
    }

    try {
        console.log('Fetching latest bypass-vip.user.js...');
        const content = await fetchUserscript();

        console.log('Extracting match patterns...');
        const matches = extractMatches(content);

        console.log(`Found ${matches.length} match patterns.`);

        if (hasPrint) {
            console.log('Match patterns:');
            matches.forEach(match => console.log(match));
        }

        if (hasExport) {
            const domains = extractDomains(matches);
            console.log('Domains:');
            domains.forEach(domain => console.log(domain));
        }

        if (hasSync) {
            // Read current JSON
            const jsonPath = JSON_FILE;
            const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

            // Update matches
            jsonData.matches = matches;

            // Write back
            fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
            console.log('Updated metadata.json with new match patterns.');
        }
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();