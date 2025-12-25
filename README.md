<div align="center">

<img src=".github/assets/favicon-nobg-dark.png" alt="Logo" width="200">

<h1>BYPASS.VIP Userscript (Remake)</h1>

![GitHub stars](https://img.shields.io/github/stars/sang765/ReBypass)  
![GitHub forks](https://img.shields.io/github/forks/sang765/ReBypass)  
![GitHub issues](https://img.shields.io/github/issues/sang765/ReBypass)
![GitHub pull requests](https://img.shields.io/github/issues-pr/sang765/ReBypass)

</div>

![Star History Chart](https://api.star-history.com/svg?repos=sang765/ReBypass&type=Date)

## Description

This is a remake of the official userscript for [bypass.vip](https://bypass.vip), a service that allows you to bypass ad-links and get directly to your destination without ads. The userscript automates the process by integrating with the bypass.vip API, providing a seamless experience on supported websites.

**Note:** This is a fork/remake of the original [bypass.vip/userscript](https://github.com/bypass-vip/userscript).

## Features

- Automatic bypass of ad-links on supported sites
- Countdown timer for hash-based links to prevent expiration
- Safe mode to ensure reliable redirects
- Customizable wait time and API key support
- Dark-themed overlay interface for better user experience

## Installation

1. Install a userscript manager extension for your browser:
   - [Tampermonkey](https://www.tampermonkey.net/) (recommended for Chrome, Firefox, Safari, Edge)
   - [Greasemonkey](https://www.greasespot.net/) (for Firefox)
   - [Violentmonkey](https://violentmonkey.github.io/) (alternative option)

2. Once installed, click on the userscript manager icon in your browser toolbar and select "Create a new script" or "Add new script".

3. Copy and paste the contents of [`bypass-vip.user.js`](bypass-vip.user.js) into the editor.

4. Save the script. The userscript will now be active on supported websites.

Alternatively, you can install directly from the raw GitHub URL: [Install Script](https://raw.githubusercontent.com/sang765/ReBypass/main/bypass-vip.user.js)

## Usage

- Visit any supported website listed below.
- The userscript will automatically detect the link and redirect you through bypass.vip.
- If a hash is present, a countdown will appear; click "Next" before it expires.
- The script will handle the bypass and redirect you to the final destination.

## Supported Sites

You can check in **[userscript](./bypass-vip.user.js)** file or in **[this](https://sang765.github.io/ReBypass/)**

## Configuration

You can customize the script behavior by editing the `config` object at the top of the script:

- `time`: Wait time in seconds (default: 10)
- `key`: API key if required (default: '')
- `safeMode`: Enable safe mode for redirects (default: true)

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Created by [sang765](https://github.com/sang765)

## Repository

[GitHub Repository](https://github.com/sang765/ReBypass)
