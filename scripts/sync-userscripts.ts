import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const urls = [
  'https://trw.lat/install/userscript/u.user.js?v=latest',
  'https://raw.githubusercontent.com/bypass-vip/userscript/master/bypass-vip.user.js',
  'https://codeberg.org/gongchandang49/bypass-all-shortlinks-debloated/raw/branch/main/Bypass_All_Shortlinks.user.js'
];

const outputDir = 'output';

async function downloadFile(url: string, outputPath: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const content = await response.text();
    writeFileSync(outputPath, content, 'utf-8');
    console.log(`Downloaded and saved: ${outputPath}`);
  } catch (error) {
    console.error(`Error downloading ${url}:`, error);
  }
}

function getFilenameFromUrl(url: string): string {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  const filename = pathname.split('/').pop() || 'unknown.js';
  // Remove query params if any
  return filename.split('?')[0];
}

async function main() {
  // Create output directory if it doesn't exist
  mkdirSync(outputDir, { recursive: true });

  for (const url of urls) {
    const filename = getFilenameFromUrl(url);
    const outputPath = join(outputDir, filename);
    await downloadFile(url, outputPath);
  }
}

main().catch(console.error);