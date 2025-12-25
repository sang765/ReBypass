'use client';

import { useState } from 'react';
import Image from 'next/image';
import ThemeToggle from '../components/ThemeToggle';

const DOMAINS = [
  "mega-guy.com",
  "loot-link.com",
  "best-links.org",
  "loot-links.com",
  "megaspremium.com",
  "lootdest.com",
  "direct-links.net",
  "risquemega.com",
  "onlyfriends.club",
  "onepiecered.co",
  "multileaks.com",
  "luvsquad-links.com",
  "lootdest.org",
  "free-leaks.com",
  "goldmega.online",
  "realiukzemydre.com",
  "kmendation.com",
  "lootlinks.co",
  "onlyshare.info",
  "leakplugs.com",
  "nswfbox.com",
  "eofmukindwo.com",
  "op-packs.com",
  "thedetective.online",
  "forlinkmeg.com",
  "thegoatpack.org",
  "of-leaks.xyz",
  "links.spacebin.in",
  "supermeg.com",
  "onlyfanessereloaded.com",
  "fanzleaks.com",
  "cemendemons.com",
  "premiummegaz.com",
  "thepremium.online",
  "pasteebins.com",
  "baddiezcentral.com",
  "megazone.website",
  "leak-pragmatic.com",
  "megadumpz.com",
  "thhaven.net",
  "meg4fans.com",
  "depravityweb.co",
  "discordlink.cc",
  "megashub.co",
  "streamergirls.org",
  "your-leaks.com",
  "onlylinksmegas.xyz",
  "pypy.spacebin.in",
  "pypy.in",
  "luvsquad-links.cmo",
  "beast.net.in",
  "hook.beast.net.in",
  "all-fans.online",
  "fansmega.com",
  "worldpacks.co",
  "night-hub.online",
  "dailyofleaks.com",
  "pkofs.com",
  "offree90.com",
  "megadropz.com",
  "onlyfunlink.com",
  "direct-links.org",
  "leaks4you.com",
  "onlylinksmegas.com",
  "direct-link.net",
  "downbadleaks.com",
  "onlyfanscloud.com",
  "missleakz.com",
  "leakszone.online",
  "links-loot.com",
  "holyfanslinks.com",
  "utopianleaks.com",
  "megavip.store",
  "drlinker.com",
  "baddiesheaven.com",
  "of4lm-links.com",
  "holedonly.store",
  "lootlinks.com",
  "free-content.pro",
  "milky-center.com",
  "megaofs.com",
  "bleleadersto.com",
  "link-target.org",
  "daughablelea.com",
  "mymegalinks.com",
  "heroslut.com",
  "tonordersitye.com",
  "vip-linknetwork.com",
  "birdbiss.com",
  "loot-labs.com",
  "lootlabs.com",
  "link-hub.net",
  "locconnect.com",
  "premiumstashdrop.com",
  "lootdest.info",
  "of-area.com",
  "link-target.net",
  "megalnk.com",
  "lootlink.org",
  "nsfwcherry.com",
  "cherrypacks.online",
  "hotstars-leaks.com",
  "onlymega.co",
  "hanimeturks.com",
  "dailyleakz.com",
  "content-hub.club",
  "dailyadultmegas.com",
  "oui-chu.com",
  "megalinks.one",
  "starleakz.com",
  "babeslink.click",
  "ofgirls3x.com",
  "pnp-drops.me",
  "nsfw-paradise.club",
  "key-access.co",
  "leaksmix.com",
  "sensual-leaks.com",
  "ofhub-leaks.com",
  "onlyforfan.online",
  "sweetjuice-mega.com",
  "crip-hub.com",
  "leaksfreeday.com",
  "thotshaven.online",
  "mega-leaked.com",
  "beautifulgirls.social",
  "tavernleaks.com",
  "nudeleaksteenz.com",
  "slutywet.com",
  "leakutopia.site",
  "secret-packs.com",
  "attiktok22.com",
  "pancakes-leaks.com",
  "diamond-leaks.com",
  "lewd-leaks.com",
  "ftbleaks.net",
  "thepytheaven.org",
  "of-region.online",
  "admiregirls-byme.com",
  "mzehoney12.com",
  "herplace.online",
  "megaplugleaks.com",
  "of-kingdom.com",
  "onlyfansmegafolder.com",
  "adfoc.us",
  "boost.ink",
  "cuty.io",
  "cety.app",
  "linkvertise.com",
  "mboost.me",
  "bst.gg",
  "booo.st",
  "mendmentforc.info",
  "paster.so",
  "paster.gg",
  "rekonise.com",
  "social-unlock.com",
  "socialwolvez.com",
  "sub2get.com",
  "sub2unlock.com",
  "sub2unlock.io",
  "sub2unlock.net",
  "sub2unlock.online",
  "sub2unlock.top",
  "sub4unlock.pro",
  "sub4unlock.com",
  "sub4unlock.io",
  "subfinal.com",
  "unlocknow.net",
  "v.gd",
  "work.ink",
  "workink.net",
  "workink.one",
  "workink.me",
  "ytsubme.com",
  "esohasl.net",
  "rbscripts.net"
];

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="text-gray-200 min-h-screen">
      <header className="bg-black/20 dark:bg-white/20 shadow-md backdrop-blur-md sticky top-0 z-20">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">BYPASS.VIP Userscript</h1>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-4 6h4" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className={`fixed top-0 right-0 h-full bg-black/80 dark:bg-white/80 backdrop-blur-lg w-64 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-30`} onClick={(e) => { if (e.target === e.currentTarget) setIsMenuOpen(false); }}>
        <div className="p-5 flex flex-col space-y-4">
            <button onClick={toggleMenu} className="self-end text-white p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <a href="#" onClick={(e) => { e.preventDefault(); toggleMenu(); }} className="text-white hover:text-blue-400 text-lg py-2">Home</a>
            <a href="https://raw.githubusercontent.com/sang765/ReBypass/main/bypass-vip.user.js" className="text-white hover:text-blue-400 text-lg py-2">Install</a>
            <button onClick={() => handleScrollTo('supported-domains')} className="text-left text-white hover:text-blue-400 text-lg py-2">Domain Support List</button>
            <a href="https://github.com/sang765/ReBypass" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400 text-lg py-2">GitHub</a>
        </div>
      </div>

      <main className="container mx-auto p-8">
        <section className="text-center mb-12">
          <h2 id="supported-domains" className="text-5xl font-extrabold text-blue-400 mb-4 scroll-mt-24">
            Supported Domains
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            The userscript automatically bypasses ad-links on the following domains:
          </p>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {DOMAINS.map(domain => (
            <div key={domain} className="bg-black/20 dark:bg-white/20 p-4 rounded-lg shadow-lg flex items-center space-x-4 backdrop-blur-md">
              <Image src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`} alt={`${domain} logo`} width={24} height={24} className="w-6 h-6"/>
              <p className="text-white font-semibold">{domain}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-black/20 dark:bg-white/20 py-6 mt-12 backdrop-blur-md">
        <div className="container mx-auto text-center text-gray-400">
          <p>Created by <a href="https://github.com/sang765" className="text-blue-400 hover:underline">sang765</a></p>
          <p>Licensed under the MIT License.</p>
        </div>
      </footer>
    </div>
  );
}
