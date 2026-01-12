import { get } from 'https';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const URL = 'https://raw.githubusercontent.com/bypass-vip/userscript/main/bypass-vip.user.js';
const JSON_FILE = join(__dirname, 'metadata.json');

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

function fetchUserscript(): Promise<string> {
    return new Promise((resolve, reject) => {
        get(URL, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

function extractMatches(content: string): string[] {
    const matches: string[] = [];
    const lines = content.split('\n');
    for (const line of lines) {
        const match = line.match(/^\/\/ @match\s+(.+)$/);
        if (match) {
            matches.push(match[1]);
        }
    }
    return matches;
}

function extractDomains(matches: string[]): string[] {
    const domains: string[] = [];
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
        console.log('Usage: node sync-matches.ts [--sync] [--print] [--export]');
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
            const jsonData: Metadata = JSON.parse(readFileSync(jsonPath, 'utf8'));

            // Update matches
            jsonData.matches = matches;

            // Write back
            writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
            console.log('Updated metadata.json with new match patterns.');
        }
    } catch (error) {
        console.error('Error:', (error as Error).message);
        process.exit(1);
    }
}

main();