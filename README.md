# BYPASS.VIP Userscript (Remake)

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

The userscript supports a wide range of ad-link sites and link shorteners, including but not limited to:

### Ad-Link Sites
- mega-guy.com
- loot-link.com
- best-links.org
- loot-links.com
- megaspremium.com
- lootdest.com
- direct-links.net
- risquemega.com
- onlyfriends.club
- onepiecered.co
- multileaks.com
- luvsquad-links.com
- lootdest.org
- free-leaks.com
- goldmega.online
- realiukzemydre.com
- kmendation.com
- lootlinks.co
- onlyshare.info
- leakplugs.com
- nswfbox.com
- eofmukindwo.com
- op-packs.com
- thedetective.online
- forlinkmeg.com
- thegoatpack.org
- of-leaks.xyz
- links.spacebin.in
- supermeg.com
- onlyfanessereloaded.com
- fanzleaks.com
- cemendemons.com
- premiummegaz.com
- thepremium.online
- pasteebins.com
- baddiezcentral.com
- megazone.website
- leak-pragmatic.com
- megadumpz.com
- thhaven.net
- meg4fans.com
- depravityweb.co
- discordlink.cc
- megashub.co
- streamergirls.org
- your-leaks.com
- onlylinksmegas.xyz
- pypy.spacebin.in
- pypy.in
- luvsquad-links.cmo
- beast.net.in
- hook.beast.net.in
- all-fans.online
- fansmega.com
- worldpacks.co
- night-hub.online
- dailyofleaks.com
- pkofs.com
- offree90.com
- megadropz.com
- onlyfunlink.com
- direct-links.org
- leaks4you.com
- onlylinksmegas.com
- direct-link.net
- downbadleaks.com
- onlyfanscloud.com
- missleakz.com
- leakszone.online
- links-loot.com
- holyfanslinks.com
- utopianleaks.com
- megavip.store
- drlinker.com
- baddiesheaven.com
- of4lm-links.com
- holedonly.store
- lootlinks.com
- free-content.pro
- milky-center.com
- megaofs.com
- bleleadersto.com
- link-target.org
- daughablelea.com
- mymegalinks.com
- heroslut.com
- tonordersitye.com
- vip-linknetwork.com
- birdbiss.com
- loot-labs.com
- lootlabs.com
- link-hub.net
- locconnect.com
- premiumstashdrop.com
- lootdest.info
- of-area.com
- link-target.net
- megalnk.com
- lootlink.org
- nsfwcherry.com
- cherrypacks.online
- hotstars-leaks.com
- onlymega.co
- hanimeturks.com
- dailyleakz.com
- content-hub.club
- dailyadultmegas.com
- oui-chu.com
- megalinks.one
- starleakz.com
- babeslink.click
- ofgirls3x.com
- pnp-drops.me
- nsfw-paradise.club
- key-access.co
- leaksmix.com
- sensual-leaks.com
- ofhub-leaks.com
- onlyforfan.online
- sweetjuice-mega.com
- crip-hub.com
- leaksfreeday.com
- thotshaven.online
- mega-leaked.com
- beautifulgirls.social
- tavernleaks.com
- nudeleaksteenz.com
- slutywet.com
- leakutopia.site
- secret-packs.com
- attiktok22.com
- pancakes-leaks.com
- diamond-leaks.com
- lewd-leaks.com
- ftbleaks.net
- thepytheaven.org
- of-region.online
- admiregirls-byme.com
- mzehoney12.com
- herplace.online
- megaplugleaks.com
- of-kingdom.com
- onlyfansmegafolder.com

### Link Shorteners
- adfoc.us
- boost.ink
- cuty.io
- cety.app
- linkvertise.com
- mboost.me
- bst.gg
- booo.st
- mendmentforc.info
- paster.so
- paster.gg
- rekonise.com
- social-unlock.com
- socialwolvez.com
- sub2get.com
- sub2unlock.com
- sub2unlock.io
- sub2unlock.net
- sub2unlock.online
- sub2unlock.top
- sub4unlock.pro
- sub4unlock.com
- sub4unlock.io
- subfinal.com
- unlocknow.net
- v.gd
- work.ink
- workink.net
- workink.one
- workink.me
- ytsubme.com
- esohasl.net
- rbscripts.net

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
