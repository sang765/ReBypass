'use client';

export default function Home() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <section className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">
          BYPASS.VIP Userscript (Remake)
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Bypass ad-links using the bypass.vip API and get to your destination without ads!
        </p>
        <a
          href="https://raw.githubusercontent.com/sang765/ReBypass/main/bypass-vip.user.js"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Install Userscript
        </a>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Description</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          This is a remake of the official userscript for <a href="https://bypass.vip" className="text-blue-600 dark:text-blue-400 hover:underline">bypass.vip</a>, a service that allows you to bypass ad-links and get directly to your destination without ads. The userscript automates the process by integrating with the bypass.vip API, providing a seamless experience on supported websites.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Note:</strong> This is a fork/remake of the original <a href="https://github.com/bypass-vip/userscript" className="text-blue-600 dark:text-blue-400 hover:underline">bypass.vip/userscript</a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Features</h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
          <li>Automatic bypass of ad-links on supported sites</li>
          <li>Countdown timer for hash-based links to prevent expiration</li>
          <li>Safe mode to ensure reliable redirects</li>
          <li>Customizable wait time and API key support</li>
          <li>Dark-themed overlay interface for better user experience</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Installation</h2>
        <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2">
          <li>Install a userscript manager extension for your browser:</li>
          <ul className="list-disc list-inside ml-6 space-y-1">
            <li><a href="https://www.tampermonkey.net/" className="text-blue-600 dark:text-blue-400 hover:underline">Tampermonkey</a> (recommended for Chrome, Firefox, Safari, Edge)</li>
            <li><a href="https://www.greasespot.net/" className="text-blue-600 dark:text-blue-400 hover:underline">Greasemonkey</a> (for Firefox)</li>
            <li><a href="https://violentmonkey.github.io/" className="text-blue-600 dark:text-blue-400 hover:underline">Violentmonkey</a> (alternative option)</li>
          </ul>
          <li>Once installed, click on the userscript manager icon in your browser toolbar and select "Create a new script" or "Add new script".</li>
          <li>Copy and paste the contents of <a href="https://raw.githubusercontent.com/sang765/ReBypass/main/bypass-vip.user.js" className="text-blue-600 dark:text-blue-400 hover:underline">bypass-vip.user.js</a> into the editor.</li>
          <li>Save the script. The userscript will now be active on supported websites.</li>
        </ol>
        <p className="text-gray-700 dark:text-gray-300 mt-4">
          Alternatively, you can install directly from the raw GitHub URL: <a href="https://raw.githubusercontent.com/sang765/ReBypass/main/bypass-vip.user.js" className="text-blue-600 dark:text-blue-400 hover:underline">Install Script</a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Usage</h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
          <li>Visit any supported website listed below.</li>
          <li>The userscript will automatically detect the link and redirect you through bypass.vip.</li>
          <li>If a hash is present, a countdown will appear; click "Next" before it expires.</li>
          <li>The script will handle the bypass and redirect you to the final destination.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Configuration</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          You can customize the script behavior by editing the <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">config</code> object at the top of the script:
        </p>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
          <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">time</code>: Wait time in seconds (default: 25)</li>
          <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">key</code>: API key if required (default: '')</li>
          <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">safeMode</code>: Enable safe mode for redirects (default: true)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Contributing</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Contributions are welcome! Please fork the repository and submit a pull request.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">License</h2>
        <p className="text-gray-700 dark:text-gray-300">
          This project is licensed under the MIT License - see the <a href="https://github.com/sang765/ReBypass/blob/main/LICENSE" className="text-blue-600 dark:text-blue-400 hover:underline">LICENSE</a> file for details.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Author</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Created by <a href="https://github.com/sang765" className="text-blue-600 dark:text-blue-400 hover:underline">sang765</a>
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Repository</h2>
        <p className="text-gray-700 dark:text-gray-300">
          <a href="https://github.com/sang765/ReBypass" className="text-blue-600 dark:text-blue-400 hover:underline">GitHub Repository</a>
        </p>
      </section>
    </div>
  );
}
