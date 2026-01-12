class ClientSideBypass {
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
            let consoleElement = null;
            let consoleMinimized = false;
            let turnstileReady = false;
            let turnstileToken = null;
            let messageQueue = [];
            let isProcessingQueue = false;
            let isFetchingTurnstile = false;

            function createFEAROverlay() {
                if (overlayCreated) return;
                overlayCreated = true;

                const e = document.createElement("style");
                e.textContent = '@import url(\'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;600&display=swap\');*{box-sizing:border-box}@keyframes fearFadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes fearBlink{0%,50%{opacity:1}51%,100%{opacity:0}}@keyframes fearSlideDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}@keyframes fearPulse{0%,100%{opacity:.6}50%{opacity:1}}#fear-overlay{position:fixed;top:0;left:0;width:100vw;height:100vh;background:linear-gradient(180deg,#000 0%,#0a0a0a 100%);color:#fff;font-family:"Roboto Mono","Consolas",monospace;display:flex;flex-direction:column;z-index:999999;overflow-y:auto;overflow-x:hidden}#fear-overlay::-webkit-scrollbar{width:10px}#fear-overlay::-webkit-scrollbar-track{background:#0a0a0a}#fear-overlay::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#333,#222);border-radius:5px;border:2px solid #0a0a0a}#fear-overlay::-webkit-scrollbar-thumb:hover{background:linear-gradient(180deg,#444,#333)}#fear-content{display:flex;flex-direction:column;align-items:center;width:100%;max-width:900px;padding:40px 20px 60px;margin:0 auto}#fear-header{text-align:center;margin-bottom:30px;animation:fearSlideDown .6s ease-out}#fear-title{font-size:clamp(2.5rem,10vw,4.5rem);margin:0;letter-spacing:clamp(4px,2vw,12px);color:#0066cc;font-weight:600;text-shadow:0 0 30px rgba(0,102,204,.3)}#fear-subtitle{font-size:clamp(.85rem,2.5vw,1.3rem);margin:10px 0 0;opacity:.65;letter-spacing:clamp(1px,0.5vw,3px);font-weight:400;color:#aaa}#fear-console{width:100%;max-width:700px;height:220px;background:#0c0c0c;border:1px solid #1a1a1a;border-radius:12px;font-family:"Consolas","Lucida Console","Courier New",monospace;box-shadow:0 8px 32px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.03),inset 0 1px 0 rgba(255,255,255,.02);display:flex;flex-direction:column;animation:fearFadeIn .5s ease-out;overflow:hidden;margin:0 auto 35px;flex-shrink:0}#fear-console.minimized{height:42px}#fear-console.minimized #fear-console-body,#fear-console.minimized #fear-console-input-line{display:none}#fear-console-header{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;background:linear-gradient(180deg,#1c1c1c 0%,#141414 100%);border-bottom:1px solid #252525;user-select:none;min-height:42px;flex-shrink:0}#fear-console-title{display:flex;align-items:center;gap:12px;color:#888;font-size:12px;letter-spacing:.5px}#fear-console-title-icon{width:18px;height:18px;background:linear-gradient(135deg,#00cc44 0%,#00aa33 100%);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;color:#000;font-weight:700;box-shadow:0 2px 8px rgba(0,200,70,.25)}#fear-console-status{font-size:10px;color:#555;display:flex;align-items:center;gap:6px}#fear-console-status::before{content:\'\';width:6px;height:6px;background:#00aa44;border-radius:50%;animation:fearPulse 2s infinite}#fear-console-controls{display:flex;gap:8px}.fear-console-btn{width:28px;height:28px;border-radius:6px;border:1px solid #2a2a2a;cursor:pointer;transition:all .2s ease;background:#1a1a1a;color:#666;font-size:14px;display:flex;align-items:center;justify-content:center}.fear-console-btn:hover{background:#2a2a2a;color:#fff;border-color:#3a3a3a;transform:scale(1.05)}.fear-console-btn:active{transform:scale(.95)}#fear-console-body{flex:1;overflow-y:auto;overflow-x:hidden;padding:14px 16px;font-size:12px;line-height:1.7;color:#bbb;background:#0c0c0c}#fear-console-body::-webkit-scrollbar{width:6px}#fear-console-body::-webkit-scrollbar-track{background:transparent}#fear-console-body::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:3px}#fear-console-body::-webkit-scrollbar-thumb:hover{background:#3a3a3a}.fear-console-line{margin-bottom:6px;animation:fearFadeIn .3s ease-out;word-wrap:break-word;padding:4px 10px;display:flex;align-items:flex-start;gap:12px;border-radius:4px;transition:background .15s}.fear-console-line:hover{background:rgba(0,170,0,.05)}.fear-console-prefix{color:#00cc44;font-weight:600;flex-shrink:0;font-size:14px}.fear-console-time{color:#3a3a3a;font-size:10px;flex-shrink:0;min-width:65px}.fear-console-text{flex:1;color:#ccc;word-break:break-word}.fear-console-waiting{display:flex;align-items:center;gap:12px;color:#555;padding:8px 10px;font-size:11px}.fear-console-waiting-dots::after{content:\'...\';animation:fearPulse 1s infinite}#fear-console-input-line{display:flex;align-items:center;padding:10px 16px;background:#111;border-top:1px solid #1a1a1a;color:#00cc44;font-size:12px;flex-shrink:0}#fear-console-input-line span{color:#666}.fear-console-cursor{display:inline-block;width:8px;height:15px;background:#00cc44;animation:fearBlink 1s step-end infinite;margin-left:4px}#fear-console-empty{color:#444;text-align:center;padding:30px 20px;font-size:12px;display:flex;flex-direction:column;align-items:center;gap:8px}#fear-console-empty::before{content:\'◦\';font-size:24px;opacity:.3}#fear-info{text-align:center;max-width:700px;margin:0 auto;animation:fearFadeIn .6s ease-out .2s both}#fear-description{font-size:clamp(.75rem,2vw,.9rem);line-height:1.7;color:#777;margin:0 0 25px;padding:0 10px;font-family:"Segoe UI",Arial,sans-serif}#fear-description a{color:#3399ff;text-decoration:none;font-weight:600;transition:color .2s}#fear-description a:hover{color:#66bbff;text-decoration:underline}#fear-status{font-size:clamp(.9rem,2.5vw,1.1rem);line-height:1.8;color:#999;margin:0 0 10px}#fear-status strong{display:block;font-size:clamp(1.1rem,3vw,1.4rem);color:#fff;margin-top:8px}#fear-counter{color:#0066cc;font-weight:600}#fear-redirect-btn{margin:35px 0;padding:18px 60px;font-size:clamp(1rem,3vw,1.3rem);font-weight:600;background:linear-gradient(180deg,#0077dd 0%,#0055aa 100%);border:none;border-radius:10px;color:#fff;cursor:pointer;transition:all .3s ease;display:none;box-shadow:0 4px 20px rgba(0,100,200,.3);letter-spacing:1px}#fear-redirect-btn:hover{background:linear-gradient(180deg,#0088ee 0%,#0066cc 100%);transform:translateY(-2px);box-shadow:0 6px 30px rgba(0,120,220,.4)}#fear-redirect-btn:active{transform:translateY(0)}@media(max-width:500px){#fear-content{padding:30px 15px 50px}#fear-console{height:200px;border-radius:8px}#fear-console-header{padding:8px 12px}#fear-console-body{padding:10px 12px;font-size:11px}#fear-console-input-line{padding:8px 12px}.fear-console-btn{width:32px;height:32px}.fear-console-time{display:none}.fear-console-line{padding:3px 8px;gap:8px}}';
                document.head.appendChild(e);

                const n = document.createElement("div");
                n.id = "fear-overlay";
                const o = document.createElement("div");
                o.id = "fear-content";
                const t = document.createElement("div");
                t.id = "fear-header";
                t.innerHTML = '<h1 id="fear-title">F.E.A.R</h1><p id="fear-subtitle">Forcefully Eliminating Advertising Redirects</p>';
                o.appendChild(t);

                const a = document.createElement("div");
                a.id = "fear-console";
                a.innerHTML = '<div id="fear-console-header"><div id="fear-console-title"><div id="fear-console-title-icon">F</div><span>Console Output</span><span id="fear-console-status">ACTIVE</span></div><div id="fear-console-controls"><button class="fear-console-btn minimize" title="Minimize/Expand">─</button></div></div><div id="fear-console-body"><div id="fear-console-empty">Awaiting server messages...</div></div><div id="fear-console-input-line"><span>FEAR://</span><span class="fear-console-cursor"></span></div>';
                o.appendChild(a);
                consoleElement = a;
                a.querySelector(".fear-console-btn.minimize").addEventListener("click", (e => {
                    consoleMinimized = !consoleMinimized;
                    a.classList.toggle("minimized", consoleMinimized);
                    e.target.textContent = consoleMinimized ? "□" : "─";
                }));

                const i = document.createElement("div");
                i.id = "fear-info";
                i.innerHTML = '<p id="fear-description">Made by ⃟⃞⃟⃞ -THE NOTORIUS W.O.Z ✟ ♥️ in 10 mins! <br><br>Having issues? Report them in our <a href="https://trw.lat/ds" target="_blank">Discord</a></p><p id="fear-status">Bypassing work.ink client-side...<strong>Requests completed: <span id="fear-counter">0/3 (aprox)</span></strong></p>';
                o.appendChild(i);

                const r = document.createElement("button");
                r.textContent = "Continue →";
                r.id = "fear-redirect-btn";
                r.onclick = () => {
                    if (unsafeWindow.wokeresponse) {
                        unsafeWindow.open(unsafeWindow.wokeresponse, "_blank");
                    }
                };
                o.appendChild(r);
                n.appendChild(o);
                document.body.appendChild(n);
            }

            function getCurrentTime() {
                return (new Date).toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
            }

            function addConsoleMessage(e) {
                if (!consoleElement) return;
                const n = consoleElement.querySelector("#fear-console-body");
                if (!n) return;
                const o = n.querySelector("#fear-console-empty");
                o && o.remove();
                const t = document.createElement("div");
                t.className = "fear-console-line";
                t.innerHTML = `<span class="fear-console-time">[${getCurrentTime()}]</span><span class="fear-console-prefix">›</span><span class="fear-console-text">${escapeHtml(e)}</span>`;
                n.appendChild(t);
                n.scrollTop = n.scrollHeight;
                consoleMinimized && (consoleElement.classList.remove("minimized"), consoleElement.querySelector(".fear-console-btn.minimize").textContent = "─", consoleMinimized = false);
            }

            function addWaitingIndicator() {
                if (!consoleElement) return null;
                const e = consoleElement.querySelector("#fear-console-body");
                if (!e) return null;
                const n = document.createElement("div");
                n.className = "fear-console-waiting";
                n.innerHTML = '<span>⏳ Waiting</span><span class="fear-console-waiting-dots"></span>';
                e.appendChild(n);
                e.scrollTop = e.scrollHeight;
                return n;
            }

            function escapeHtml(e) {
                const n = document.createElement("div");
                return n.textContent = e, n.innerHTML;
            }

            async function processToCMSGs(e) {
                if (Array.isArray(e) && 0 !== e.length) for (const n of e) if ("string" == typeof n) if (n.startsWith("USC:wait(")) {
                    const e = n.match(/USC:wait\((\d+(?:\.\d+)?)\)/);
                    if (e) {
                        const n = parseFloat(e[1]);
                        const o = addWaitingIndicator();
                        await new Promise(e => setTimeout(e, 1000 * n));
                        o && o.parentNode && o.remove();
                    }
                } else addConsoleMessage(n);
            }

            function updateWKestCount() {
                const e = document.getElementById("fear-counter");
                if (e) {
                    e.textContent = `${requestCount}/3 (approx)`;
                }
            }

            function showRedirectButton() {
                const e = document.getElementById("fear-redirect-btn");
                if (e) {
                    e.style.display = "inline-block";
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

            async function processWebSocketMessage(ws, rawData, originalSend) {
                try {
                    const encodedPayload = encodeURIComponent(rawData);
                    const userscriptVers = "ReBypass-v1.0";
                    const response = await unsafeWindow.fetch(`https://workink-bypass.site/api/clientSides/workink?payl=${encodedPayload}&pal=${encodeURIComponent(location.href)}&UVA=${encodeURIComponent(userscriptVers)}`, {
                        method: "GET",
                        headers: { Accept: "application/json" }
                    });

                    if (!response.ok) return;

                    requestCount++;
                    updateWKestCount();

                    let payloadsToSend = [rawData];
                    const json = await response.json();
                    if (json.ToCMSGs && Array.isArray(json.ToCMSGs) && json.ToCMSGs.length > 0 && await processToCMSGs(json.ToCMSGs), json.pyl && Array.isArray(json.pyl) && json.pyl.length > 0) {
                        const e = json.pyl;
                        for (const n of e) if ("string" == typeof n && n.startsWith("USC:setrep")) {
                            const e = n.match(/USC:setrep[ao]?\((.+)\)/);
                            if (e && e[1]) {
                                unsafeWindow.wokeresponse = e[1].trim();
                                showRedirectButton();
                                ws.close();
                            }
                        }
                        payloadsToSend = e;
                    }

                    for (const item of payloadsToSend) {
                        if ("string" == typeof item) {
                            if (item.startsWith("USC:wait(")) {
                                const e = item.match(/USC:wait\((\d+)\)/);
                                if (e) {
                                    const n = parseInt(e[1], 10);
                                    await new Promise(e => setTimeout(e, 1000 * n));
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
                                        console.error("Error en USC:eval:", e);
                                    }
                                    continue;
                                }
                            }
                        }
                        const toSend = "string" == typeof item ? item : JSON.stringify(item);
                        originalSend.call(ws, toSend);
                    }
                } catch (e) {
                    console.error("[ClientSideBypass] Error:", e);
                    originalSend.call(ws, rawData);
                }
            }

            async function processMessageQueue() {
                if (!isProcessingQueue && turnstileReady) {
                    for (isProcessingQueue = true; messageQueue.length > 0;) {
                        const { ws: e, rawData: n, originalSend: o } = messageQueue.shift();
                        await processWebSocketMessage(e, n, o);
                    }
                    isProcessingQueue = false;
                }
            }

            async function initializeTurnstile() {
                if (isFetchingTurnstile) return;
                isFetchingTurnstile = true;
                createFEAROverlay();
                turnstileToken = await getTurnstileToken();
                if ("valid_by_error" !== turnstileToken) {
                    await new Promise(e => setTimeout(e, 1000));
                }
                turnstileReady = true;
                processMessageQueue();
            }

            unsafeWindow.WebSocket = function(e, n) {
                console.log("[ClientSideBypass]: WebSocket hooked");
                const o = e.toString();
                let t = "";
                try {
                    t = new URL(o).hostname;
                } catch (e) {
                    t = o;
                }

                if (!t.includes("work.ink")) return new OriginalWebSocket(e, n);

                const a = new OriginalWebSocket(e, n);
                const i = ++wsCount;
                const r = a.send;

                return a.send = function(e) {
                    return r.call(this, e);
                }, a.addEventListener("message", async e => {
                    let n = e.data;
                    if ("string" == typeof n) return turnstileReady ? void await processWebSocketMessage(a, n, r) : (messageQueue.push({ ws: a, rawData: n, originalSend: r }), void initializeTurnstile());
                }), a;
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

            function createFEAROverlay() {
                if (overlayCreated) return;
                overlayCreated = true;

                const e = document.createElement("style");
                e.textContent = '@import url(\'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;600&display=swap\');*{box-sizing:border-box}@keyframes fearFadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes fearBlink{0%,50%{opacity:1}51%,100%{opacity:0}}@keyframes fearSlideDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}@keyframes fearPulse{0%,100%{opacity:.6}50%{opacity:1}}#fear-overlay{position:fixed;top:0;left:0;width:100vw;height:100vh;background:linear-gradient(180deg,#000 0%,#0a0a0a 100%);color:#fff;font-family:"Roboto Mono","Consolas",monospace;display:flex;flex-direction:column;z-index:2147483647;overflow-y:auto;overflow-x:hidden}#fear-overlay::-webkit-scrollbar{width:10px}#fear-overlay::-webkit-scrollbar-track{background:#0a0a0a}#fear-overlay::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#333,#222);border-radius:5px;border:2px solid #0a0a0a}#fear-overlay::-webkit-scrollbar-thumb:hover{background:linear-gradient(180deg,#444,#333)}#fear-content{display:flex;flex-direction:column;align-items:center;width:100%;max-width:900px;padding:40px 20px 60px;margin:0 auto}#fear-header{text-align:center;margin-bottom:30px;animation:fearSlideDown .6s ease-out}#fear-title{font-size:clamp(2.5rem,10vw,4.5rem);margin:0;letter-spacing:clamp(4px,2vw,12px);color:#0066cc;font-weight:600;text-shadow:0 0 30px rgba(0,102,204,.3)}#fear-subtitle{font-size:clamp(.85rem,2.5vw,1.3rem);margin:10px 0 0;opacity:.65;letter-spacing:clamp(1px,0.5vw,3px);font-weight:400;color:#aaa}#fear-console{width:100%;max-width:700px;height:220px;background:#0c0c0c;border:1px solid #1a1a1a;border-radius:12px;font-family:"Consolas","Lucida Console","Courier New",monospace;box-shadow:0 8px 32px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.03),inset 0 1px 0 rgba(255,255,255,.02);display:flex;flex-direction:column;animation:fearFadeIn .5s ease-out;overflow:hidden;margin:0 auto 35px;flex-shrink:0}#fear-console.minimized{height:42px}#fear-console.minimized #fear-console-body,#fear-console.minimized #fear-console-input-line{display:none}#fear-console-header{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;background:linear-gradient(180deg,#1c1c1c 0%,#141414 100%);border-bottom:1px solid #252525;user-select:none;min-height:42px;flex-shrink:0}#fear-console-title{display:flex;align-items:center;gap:12px;color:#888;font-size:12px;letter-spacing:.5px}#fear-console-title-icon{width:18px;height:18px;background:linear-gradient(135deg,#00cc44 0%,#00aa33 100%);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;color:#000;font-weight:700;box-shadow:0 2px 8px rgba(0,200,70,.25)}#fear-console-status{font-size:10px;color:#555;display:flex;align-items:center;gap:6px}#fear-console-status::before{content:\'\';width:6px;height:6px;background:#00aa44;border-radius:50%;animation:fearPulse 2s infinite}#fear-console-controls{display:flex;gap:8px}.fear-console-btn{width:28px;height:28px;border-radius:6px;border:1px solid #2a2a2a;cursor:pointer;transition:all .2s ease;background:#1a1a1a;color:#666;font-size:14px;display:flex;align-items:center;justify-content:center}.fear-console-btn:hover{background:#2a2a2a;color:#fff;border-color:#3a3a3a;transform:scale(1.05)}.fear-console-btn:active{transform:scale(.95)}#fear-console-body{flex:1;overflow-y:auto;overflow-x:hidden;padding:14px 16px;font-size:12px;line-height:1.7;color:#bbb;background:#0c0c0c}#fear-console-body::-webkit-scrollbar{width:6px}#fear-console-body::-webkit-scrollbar-track{background:transparent}#fear-console-body::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:3px}#fear-console-body::-webkit-scrollbar-thumb:hover{background:#3a3a3a}.fear-console-line{margin-bottom:6px;animation:fearFadeIn .3s ease-out;word-wrap:break-word;padding:4px 10px;display:flex;align-items:flex-start;gap:12px;border-radius:4px;transition:background .15s}.fear-console-line:hover{background:rgba(0,170,0,.05)}.fear-console-prefix{color:#00cc44;font-weight:600;flex-shrink:0;font-size:14px}.fear-console-time{color:#3a3a3a;font-size:10px;flex-shrink:0;min-width:65px}.fear-console-text{flex:1;color:#ccc;word-break:break-word}.fear-console-waiting{display:flex;align-items:center;gap:12px;color:#555;padding:8px 10px;font-size:11px}.fear-console-waiting-dots::after{content:\'...\';animation:fearPulse 1s infinite}#fear-console-input-line{display:flex;align-items:center;padding:10px 16px;background:#111;border-top:1px solid #1a1a1a;color:#00cc44;font-size:12px;flex-shrink:0}#fear-console-input-line span{color:#666}.fear-console-cursor{display:inline-block;width:8px;height:15px;background:#00cc44;animation:fearBlink 1s step-end infinite;margin-left:4px}#fear-console-empty{color:#444;text-align:center;padding:30px 20px;font-size:12px;display:flex;flex-direction:column;align-items:center;gap:8px}#fear-console-empty::before{content:\'◦\';font-size:24px;opacity:.3}#fear-info{text-align:center;max-width:700px;margin:0 auto;animation:fearFadeIn .6s ease-out .2s both}#fear-description{font-size:clamp(.75rem,2vw,.9rem);line-height:1.7;color:#777;margin:0 0 25px;padding:0 10px;font-family:"Segoe UI",Arial,sans-serif}#fear-description a{color:#3399ff;text-decoration:none;font-weight:600;transition:color .2s}#fear-description a:hover{color:#66bbff;text-decoration:underline}#fear-status{font-size:clamp(.9rem,2.5vw,1.1rem);line-height:1.8;color:#999;margin:0 0 10px}#fear-status strong{display:block;font-size:clamp(1.1rem,3vw,1.4rem);color:#fff;margin-top:8px}#fear-counter{color:#0066cc;font-weight:600}#fear-redirect-btn{margin:35px 0;padding:18px 60px;font-size:clamp(1rem,3vw,1.3rem);font-weight:600;background:linear-gradient(180deg,#0077dd 0%,#0055aa 100%);border:none;border-radius:10px;color:#fff;cursor:pointer;transition:all .3s ease;display:none;box-shadow:0 4px 20px rgba(0,100,200,.3);letter-spacing:1px;pointer-events:auto}#fear-redirect-btn:hover{background:linear-gradient(180deg,#0088ee 0%,#0066cc 100%);transform:translateY(-2px);box-shadow:0 6px 30px rgba(0,120,220,.4)}#fear-redirect-btn:active{transform:translateY(0)}@media(max-width:500px){#fear-content{padding:30px 15px 50px}#fear-console{height:200px;border-radius:8px}#fear-console-header{padding:8px 12px}#fear-console-body{padding:10px 12px;font-size:11px}#fear-console-input-line{padding:8px 12px}.fear-console-btn{width:32px;height:32px}.fear-console-time{display:none}.fear-console-line{padding:3px 8px;gap:8px}}';
                document.head.appendChild(e);

                const n = document.createElement("div");
                n.id = "fear-overlay";
                const o = document.createElement("div");
                o.id = "fear-content";
                const t = document.createElement("div");
                t.id = "fear-header";
                t.innerHTML = '<h1 id="fear-title">F.E.A.R</h1><p id="fear-subtitle">Forcefully Eliminating Advertising Redirects</p>';
                o.appendChild(t);

                const a = document.createElement("div");
                a.id = "fear-console";
                a.innerHTML = '<div id="fear-console-header"><div id="fear-console-title"><div id="fear-console-title-icon">F</div><span>Console Output</span><span id="fear-console-status">ACTIVE</span></div><div id="fear-console-controls"><button class="fear-console-btn minimize" title="Minimize/Expand">─</button></div></div><div id="fear-console-body"><div id="fear-console-empty">Awaiting server messages...</div></div><div id="fear-console-input-line"><span>FEAR://</span><span class="fear-console-cursor"></span></div>';
                o.appendChild(a);
                consoleElement = a;
                a.querySelector(".fear-console-btn.minimize").addEventListener("click", (e => {
                    consoleMinimized = !consoleMinimized;
                    a.classList.toggle("minimized", consoleMinimized);
                    e.target.textContent = consoleMinimized ? "□" : "─";
                }));

                const i = document.createElement("div");
                i.id = "fear-info";
                i.innerHTML = '<p id="fear-description">Made by ⃟⃞⃟⃞ -THE NOTORIUS W.O.Z ✟ ♥️ in 10 mins! <br><br>Having issues? Report them in our <a href="https://trw.lat/ds" target="_blank">Discord</a></p><p id="fear-status">Bypassing loot-links client-side...<strong>Requests completed: <span id="fear-counter">0/6</span></strong></p>';
                o.appendChild(i);

                const r = document.createElement("button");
                r.textContent = "Continue →";
                r.id = "fear-redirect-btn";
                r.onclick = () => {
                    if (unsafeWindow.wokeresponse) {
                        unsafeWindow.open(unsafeWindow.wokeresponse, "_blank");
                    }
                };
                o.appendChild(r);
                n.appendChild(o);
                document.body.appendChild(n);
                zIndexInterval = setInterval(() => {
                    n.style.zIndex = "2147483647";
                }, 500);
            }

            function updateWKestCount() {
                const e = document.getElementById("fear-counter");
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
                                    fetch("https://trw.lat/api/status?op=llbs");
                                    requestCount++;
                                    updateWKestCount();
                                }, 10000);
                            };
                            u.onmessage = async e => {
                                if (console.log("[ClientSideBypass]: MEOB", e.data), e.data.startsWith("r:")) {
                                    const t = e.data.replace("r:", "").trim().replace(/[^ -~]/g, "");
                                    const n = await fetch(`https://trw.lat/api/clientSides/lootlabs?payl=${encodeURIComponent(t)}&pal=${encodeURIComponent(location.href)}`);
                                    showRedirectButton((await n.json()).pyl);
                                    u.close();
                                }
                            };
                            navigator.sendBeacon(`https://${i}.${c}/st?uid=${e}&cat=${t}`);
                            fetch(o);
                            fetch(`https://${a}/td?ac=auto_complete&urid=${e}&cat=${t}&tid=${l}`);
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