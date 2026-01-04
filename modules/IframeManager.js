class IframeManager {
    static DEFAULT_CONFIG = {
        width: '90%',
        height: '80%',
        position: 'center', // center, top-left, top-right, bottom-left, bottom-right
        transparency: 0.95,
        zIndex: 2147483647,
        borderRadius: '12px',
        shadow: '0 8px 32px rgba(0,0,0,0.5)',
        enableResize: true,
        enableDrag: true,
        autoCloseOnSuccess: true,
        fallbackToTab: true,
        proxyUrl: 'https://cors-anywhere.herokuapp.com/', // Example proxy for X-Frame-Options bypass
        logActions: true
    };

    static activeIframes = new Map();

    /**
     * Detect if current page is a bypass site that needs iframe overlay
     */
    static isBypassPage() {
        const hostname = window.location.hostname.toLowerCase();
        const classifications = ConfigManager.classifications;

        for (const category in classifications) {
            if (classifications[category].some(domain => hostname.includes(domain))) {
                return true;
            }
        }
        return false;
    }

    /**
     * Generate random string for cache busting
     */
    static generateRnd() {
        return Math.random().toString(36).substr(2, 9);
    }

    /**
     * Build bypass URL with parameters
     */
    static buildBypassUrl(targetUrl, config) {
        const params = new URLSearchParams({
            url: encodeURIComponent(targetUrl),
            time: config.time || 20,
            key: config.key || '',
            safe: config.safeMode !== false,
            rnd: config.rnd || this.generateRnd()
        });

        return `https://bypass.vip/userscript?${params.toString()}`;
    }

    /**
     * Create iframe overlay element
     */
    static createIframeOverlay(bypassUrl, iframeConfig = {}) {
        const config = { ...this.DEFAULT_CONFIG, ...iframeConfig };
        const overlayId = 'bypass-iframe-overlay-' + Date.now();

        // Create overlay container
        const overlay = document.createElement('div');
        overlay.id = overlayId;
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, ${1 - config.transparency});
            backdrop-filter: blur(4px);
            z-index: ${config.zIndex - 1};
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Segoe UI', sans-serif;
        `;

        // Create iframe container
        const iframeContainer = document.createElement('div');
        iframeContainer.style.cssText = `
            position: relative;
            width: ${config.width};
            height: ${config.height};
            max-width: 95vw;
            max-height: 95vh;
            border-radius: ${config.borderRadius};
            box-shadow: ${config.shadow};
            overflow: hidden;
            background: white;
            z-index: ${config.zIndex};
        `;

        // Create iframe
        const iframe = document.createElement('iframe');
        iframe.src = bypassUrl;
        iframe.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
            border-radius: ${config.borderRadius};
        `;

        // Create controls bar
        const controlsBar = document.createElement('div');
        controlsBar.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 40px;
            background: rgba(30, 30, 30, 0.9);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 15px;
            z-index: ${config.zIndex + 1};
            border-radius: ${config.borderRadius} ${config.borderRadius} 0 0;
        `;

        // Controls content
        controlsBar.innerHTML = `
            <div style="color: white; font-size: 14px; font-weight: 500;">
                <img src="${GM_info.script.icon}" style="width: 20px; height: 20px; margin-right: 8px; vertical-align: middle;">
                BYPASS.VIP - Iframe Mode
            </div>
            <div>
                <button id="minimize-btn" style="
                    background: #666;
                    border: none;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-right: 5px;
                    font-size: 12px;
                ">−</button>
                <button id="close-btn" style="
                    background: #ff4d4d;
                    border: none;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                ">×</button>
            </div>
        `;

        // Assemble elements
        iframeContainer.appendChild(controlsBar);
        iframeContainer.appendChild(iframe);
        overlay.appendChild(iframeContainer);

        // Add event listeners
        this.addIframeEventListeners(overlay, iframe, iframeContainer, config);

        // Store reference
        this.activeIframes.set(overlayId, {
            overlay,
            iframe,
            config,
            bypassUrl,
            createdAt: Date.now()
        });

        return overlay;
    }

    /**
     * Add event listeners for iframe controls
     */
    static addIframeEventListeners(overlay, iframe, container, config) {
        const minimizeBtn = overlay.querySelector('#minimize-btn');
        const closeBtn = overlay.querySelector('#close-btn');

        // Minimize button
        minimizeBtn.addEventListener('click', () => {
            if (container.style.height === '40px') {
                // Restore
                container.style.height = config.height;
                iframe.style.display = 'block';
                minimizeBtn.textContent = '−';
            } else {
                // Minimize
                container.style.height = '40px';
                iframe.style.display = 'none';
                minimizeBtn.textContent = '+';
            }
        });

        // Close button
        closeBtn.addEventListener('click', () => {
            this.removeIframeOverlay(overlay.id);
        });

        // Handle iframe load errors (X-Frame-Options)
        iframe.addEventListener('load', () => {
            try {
                // Check if iframe loaded successfully
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (iframeDoc && iframeDoc.body && iframeDoc.body.innerHTML.includes('refused')) {
                    throw new Error('X-Frame-Options blocked');
                }
            } catch (error) {
                console.warn('Iframe load error:', error);
                this.handleIframeError(overlay.id, config);
            }
        });

        iframe.addEventListener('error', () => {
            this.handleIframeError(overlay.id, config);
        });

        // Make draggable if enabled
        if (config.enableDrag) {
            this.makeDraggable(container, overlay.querySelector('div:first-child'));
        }

        // Make resizable if enabled
        if (config.enableResize) {
            this.makeResizable(container);
        }

        // Log action if enabled
        if (config.logActions) {
            this.logAction('iframe_created', { bypassUrl: iframe.src, config });
        }
    }

    /**
     * Handle iframe loading errors
     */
    static handleIframeError(overlayId, config) {
        const iframeData = this.activeIframes.get(overlayId);
        if (!iframeData) return;

        if (config.fallbackToTab) {
            // Fallback to opening in new tab
            console.log('Iframe blocked, falling back to new tab');
            window.open(iframeData.bypassUrl, '_blank');

            // Show notification
            this.showFallbackNotification();

            // Remove iframe overlay
            this.removeIframeOverlay(overlayId);
        } else {
            // Show error in iframe container
            const container = iframeData.overlay.querySelector('div');
            container.innerHTML = `
                <div style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    color: #ff4d4d;
                    font-family: sans-serif;
                    text-align: center;
                    padding: 20px;
                ">
                    <h3>X-Frame-Options Blocked</h3>
                    <p>This site blocks iframe embedding.</p>
                    <button onclick="window.open('${iframeData.bypassUrl}', '_blank')"
                        style="
                            padding: 10px 20px;
                            background: #1E88E5;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            margin-top: 15px;
                        ">
                        Open in New Tab
                    </button>
                </div>
            `;
        }

        this.logAction('iframe_error', { overlayId, fallbackUsed: config.fallbackToTab });
    }

    /**
     * Show fallback notification
     */
    static showFallbackNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(30, 30, 30, 0.9);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            border-left: 4px solid #1E88E5;
            z-index: 2147483647;
            font-family: sans-serif;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            max-width: 300px;
        `;
        notification.innerHTML = `
            <div style="font-weight: 500; margin-bottom: 5px;">Bypass Opened in New Tab</div>
            <div style="font-size: 14px; opacity: 0.8;">Iframe was blocked by X-Frame-Options</div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    /**
     * Make element draggable
     */
    static makeDraggable(element, handle) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        handle.style.cursor = 'move';

        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = element.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            const newLeft = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, startLeft + deltaX));
            const newTop = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, startTop + deltaY));

            element.style.left = newLeft + 'px';
            element.style.top = newTop + 'px';
            element.style.position = 'fixed';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            document.body.style.userSelect = '';
        });
    }

    /**
     * Make element resizable
     */
    static makeResizable(element) {
        const resizeHandle = document.createElement('div');
        resizeHandle.style.cssText = `
            position: absolute;
            bottom: 0;
            right: 0;
            width: 20px;
            height: 20px;
            cursor: nw-resize;
            background: linear-gradient(-45deg, transparent 0%, transparent 40%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0.3) 60%, transparent 60%);
        `;
        element.appendChild(resizeHandle);

        let isResizing = false;
        let startX, startY, startWidth, startHeight;

        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = element.offsetWidth;
            startHeight = element.offsetHeight;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            const newWidth = Math.max(300, startWidth + (e.clientX - startX));
            const newHeight = Math.max(200, startHeight + (e.clientY - startY));

            element.style.width = newWidth + 'px';
            element.style.height = newHeight + 'px';
        });

        document.addEventListener('mouseup', () => {
            isResizing = false;
        });
    }

    /**
     * Remove iframe overlay
     */
    static removeIframeOverlay(overlayId) {
        const iframeData = this.activeIframes.get(overlayId);
        if (iframeData) {
            iframeData.overlay.remove();
            this.activeIframes.delete(overlayId);

            if (iframeData.config.logActions) {
                this.logAction('iframe_removed', { overlayId, lifetime: Date.now() - iframeData.createdAt });
            }
        }
    }

    /**
     * Log iframe actions
     */
    static logAction(action, data) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            action,
            data,
            url: window.location.href
        };

        console.log('[IframeManager]', logEntry);

        // Store in localStorage for persistence
        try {
            const logs = JSON.parse(localStorage.getItem('ReBypass_iframe_logs') || '[]');
            logs.push(logEntry);
            // Keep only last 100 entries
            if (logs.length > 100) logs.shift();
            localStorage.setItem('ReBypass_iframe_logs', JSON.stringify(logs));
        } catch (e) {
            console.warn('Failed to store iframe logs:', e);
        }
    }

    /**
     * Get iframe configuration from user settings
     */
    static getIframeConfig() {
        return {
            width: ConfigManager.getValue('iframeWidth', this.DEFAULT_CONFIG.width),
            height: ConfigManager.getValue('iframeHeight', this.DEFAULT_CONFIG.height),
            position: ConfigManager.getValue('iframePosition', this.DEFAULT_CONFIG.position),
            transparency: ConfigManager.getValue('iframeTransparency', this.DEFAULT_CONFIG.transparency),
            enableResize: ConfigManager.getValue('iframeEnableResize', this.DEFAULT_CONFIG.enableResize),
            enableDrag: ConfigManager.getValue('iframeEnableDrag', this.DEFAULT_CONFIG.enableDrag),
            autoCloseOnSuccess: ConfigManager.getValue('iframeAutoCloseOnSuccess', this.DEFAULT_CONFIG.autoCloseOnSuccess),
            fallbackToTab: ConfigManager.getValue('iframeFallbackToTab', this.DEFAULT_CONFIG.fallbackToTab),
            logActions: ConfigManager.getValue('iframeLogActions', this.DEFAULT_CONFIG.logActions)
        };
    }

    /**
     * Validate and sanitize URL for security
     */
    static validateUrl(url) {
        try {
            const parsedUrl = new URL(url);
            // Only allow HTTPS
            if (parsedUrl.protocol !== 'https:') {
                throw new Error('Only HTTPS URLs are allowed');
            }
            return url;
        } catch (e) {
            throw new Error('Invalid URL: ' + e.message);
        }
    }

    /**
     * Initialize iframe overlay for current page
     */
    static async initForCurrentPage() {
        if (!this.isBypassPage()) {
            return false;
        }

        try {
            const config = ConfigManager.getConfig();
            const iframeConfig = this.getIframeConfig();
            const currentUrl = window.location.href;

            // Validate current URL
            this.validateUrl(currentUrl);

            // Build bypass URL
            const bypassUrl = this.buildBypassUrl(currentUrl, {
                time: config.advancedMode ?
                    (ConfigManager.getWaitTimes()[ConfigManager.getDomainCategory(window.location.hostname)] || config.globalTime) :
                    config.globalTime,
                key: config.key,
                safeMode: config.safeMode
            });

            // Create and show iframe overlay
            const overlay = this.createIframeOverlay(bypassUrl, iframeConfig);
            document.body.appendChild(overlay);

            return true;
        } catch (error) {
            console.error('Failed to initialize iframe overlay:', error);
            ErrorHandler.showError('Iframe initialization failed: ' + error.message);
            return false;
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = IframeManager;
}