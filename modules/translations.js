/**
 * Translation files for ReBypass
 * Supports multiple languages through the i18n module
 */

// Define translations object in global scope for userscript environment
window.ReBypassTranslations = {
    en: {
        // Toast messages
        toast: {
            startingBypass: 'BYPASS.VIP: STARTING BYPASS...',
            captchaRequired: 'Please complete captcha first!'
        },

        // GM_notification
        gm: {
            beforeBypass: 'REBYPASS: Hey, do you wanna bypass this link?'
        },

        // UI Labels
        ui: {
            settings: '⚙️ Settings',
            proceed: 'PROCEED',
            cancel: 'Cancel',
            save: 'Save',
            toggleVisibility: 'Toggle Container Visibility',
            clickToCopy: 'Click to copy',
            close: 'Close',
            settingsSaved: 'Settings saved. Changes applied immediately.',
            confirmCancel: 'Are you sure you want to cancel and reload?',
            hashCountdown: 'YOU HAVE EXACTLY ${time} SECONDS TO CLICK THE BUTTON BEFORE YOUR HASH EXPIRES',
            hashExpired: 'HASH EXPIRED. RETRYING...',
            languageChanged: 'Language changed. The page will reload to apply changes.'
        },

        // Settings panel
        settings: {
            advancedTimeMode: 'Advanced Time Mode',
            askBeforeBypass: 'Ask Before Bypass',
            clientSideWorkinkBypass: 'Client-Side Workink Bypass',
            clientSideLootlabsBypass: 'Client-Side Lootlabs Bypass',
            globalTime: 'Global Time (seconds):',
            apiKey: 'API Key:',
            advancedWaitTimes: 'Advanced Wait Times (seconds):'
        },

        // Countdowns and timers
        countdown: {
            waitingFor: 'Waiting ${seconds} seconds...',
            ready: 'Ready to proceed!'
        },

        // Info messages
        info: {
            bypassInfo: 'CLICK THE URL TO COPY:',
            copied: 'Copied!'
        },

        // Error messages
        errors: {
            initializationFailed: 'Initialization failed: ${error}',
            bypassScriptError: 'Bypass Script Error',
            reloadPage: 'Reload Page',
            failedToProceed: 'Failed to proceed to the target URL',
            invalidUrl: 'Invalid URL provided',
            noBypassNeeded: 'This page does not need bypassing',
            apiError: 'API error: ${message}',
            redirectFailed: 'Redirect failed. Please copy and open the link manually'
        },

        // Bypass reasons/categories
        categories: {
            url_shortener: 'URL Shortener',
            social_unlock: 'Social Unlock',
            redirect_hub: 'Redirect Hub',
            lootlabs_ecosystem: 'Lootlabs Ecosystem',
            mega_hub: 'Mega Hub',
            leak_nsfw_hub: 'Leak NSFW Hub',
            paste_text_host: 'Paste Text Host',
            community_discord: 'Community Discord',
            random_obfuscated: 'Random Obfuscated',
            default: 'Default'
        }
    },

    vi: {
        // Thông báo toast
        toast: {
            startingBypass: 'BYPASS.VIP: ĐANG BẮT ĐẦU BYPASS...',
            captchaRequired: 'Vui lòng hoàn thành captcha trước!'
        },

        // GM_notification
        gm: {
            beforeBypass: 'Này, bạn có muốn bypass link này không?'
        },

        // Nhãn UI
        ui: {
            settings: '⚙️ Cài đặt',
            proceed: 'TIẾP TỤC',
            cancel: 'Hủy',
            save: 'Lưu',
            toggleVisibility: 'Bật/Tắt hiển thị',
            clickToCopy: 'Nhấn để sao chép',
            close: 'Đóng',
            settingsSaved: 'Cài đặt đã được lưu. Thay đổi được áp dụng ngay lập tức.',
            confirmCancel: 'Bạn có chắc chắn muốn hủy và tải lại trang?',
            hashCountdown: 'BẠN CÓ CHÍNH XÁC ${time} GIÂY ĐỂ NHẤN NÚT TRƯỚC KHI HASH HẾT HẠN',
            hashExpired: 'HASH ĐÃ HẾT HẠN. ĐANG TÁI CẤP...',
            languageChanged: 'Ngôn ngữ đã được thay đổi. Trang sẽ tải lại để áp dụng thay đổi.'
        },

        // Bảng cài đặt
        settings: {
            advancedTimeMode: 'Chế độ Thời gian Nâng cao',
            askBeforeBypass: 'Hỏi Trước Khi Bypass',
            clientSideWorkinkBypass: 'Bypass Workink Phía Client',
            clientSideLootlabsBypass: 'Bypass Lootlabs Phía Client',
            globalTime: 'Thời gian Toàn cục (giây):',
            apiKey: 'Khóa API:',
            advancedWaitTimes: 'Thời gian Chờ Nâng cao (giây):'
        },

        // Bộ đếm ngược và bộ hẹn giờ
        countdown: {
            waitingFor: 'Chờ ${seconds} giây...',
            ready: 'Sẵn sàng để tiếp tục!'
        },

        // Thông tin
        info: {
            bypassInfo: 'NHẤN VÀO URL ĐỂ SAO CHÉP:',
            copied: 'Đã sao chép!'
        },

        // Thông báo lỗi
        errors: {
            initializationFailed: 'Khởi tạo thất bại: ${error}',
            bypassScriptError: 'Lỗi Bypass Script',
            reloadPage: 'Tải lại Trang',
            failedToProceed: 'Không thể tiếp tục tới URL đích',
            invalidUrl: 'URL được cung cấp không hợp lệ',
            noBypassNeeded: 'Trang này không cần bypass',
            apiError: 'Lỗi API: ${message}',
            redirectFailed: 'Chuyển hướng thất bại. Vui lòng sao chép và mở liên kết theo cách thủ công'
        },

        // Danh mục bypass
        categories: {
            url_shortener: 'Rút gọn URL',
            social_unlock: 'Mở Khóa Mạng Xã Hội',
            redirect_hub: 'Trung tâm Chuyển hướng',
            lootlabs_ecosystem: 'Hệ sinh thái Lootlabs',
            mega_hub: 'Mega Hub',
            leak_nsfw_hub: 'Hub Rò rỉ NSFW',
            paste_text_host: 'Lưu trữ Dán Văn bản',
            community_discord: 'Cộng đồng Discord',
            random_obfuscated: 'Ngẫu nhiên Che khuất',
            default: 'Mặc định'
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.ReBypassTranslations;
}
