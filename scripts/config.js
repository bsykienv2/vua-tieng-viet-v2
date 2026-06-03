/**
 * ============================================================
 * VUA TIẾNG VIỆT — CẤU HÌNH KẾT NỐI GOOGLE SHEETS
 * ============================================================
 * Thay đổi các giá trị dưới đây sau khi deploy Google Apps Script
 */
const CLOUD_CONFIG = {
    // URL Web App từ Google Apps Script (thay bằng URL thật sau khi deploy)
    API_URL: 'https://script.google.com/macros/s/AKfycbz_XAiVtxb8e7IBsA02SBp2TwPUyiK3yF7qfelDI9t5I4DXTYCjnClD2URcXDiYede2/exec',

    // API Key (phải khớp với CONFIG.API_KEY trong Code.gs)
    API_KEY: 'VuaTiengViet_@2024_Secret_Key_abc123',

    // Bật/tắt cloud sync (set false để chơi offline thuần localStorage)
    ENABLED: true,

    // Timeout cho mỗi request (ms)
    TIMEOUT: 10000,
};

/**
 * ============================================================
 * CLOUD DATABASE MODULE
 * ============================================================
 */
const CloudDB = {
    // Player ID — unique per browser
    _playerId: null,

    getPlayerId() {
        if (this._playerId) return this._playerId;
        let id = localStorage.getItem('vtv_player_id');
        if (!id) {
            id = 'vtv_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
            localStorage.setItem('vtv_player_id', id);
        }
        this._playerId = id;
        return id;
    },

    // Generic API caller with timeout and error handling
    async _call(action, payload = {}) {
        if (!CLOUD_CONFIG.ENABLED || CLOUD_CONFIG.API_URL.includes('YOUR_')) {
            console.warn('[CloudDB] API URL not configured. Operating in offline mode.');
            return null;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CLOUD_CONFIG.TIMEOUT);

        try {
            const response = await fetch(CLOUD_CONFIG.API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({
                    action: action,
                    apiKey: CLOUD_CONFIG.API_KEY,
                    clientId: this.getPlayerId(),
                    ...payload
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            // Google Apps Script redirects, fetch follows automatically
            const text = await response.text();
            try {
                return JSON.parse(text);
            } catch {
                console.error('[CloudDB] Invalid JSON response:', text.substring(0, 200));
                return null;
            }
        } catch (err) {
            clearTimeout(timeoutId);
            if (err.name === 'AbortError') {
                console.warn('[CloudDB] Request timed out');
            } else {
                console.warn('[CloudDB] Network error:', err.message);
            }
            return null;
        }
    },

    /**
     * Gửi điểm số lên Google Sheets
     */
    async submitScore(scoreData) {
        const result = await this._call('submitScore', {
            playerId: this.getPlayerId(),
            name: scoreData.name || 'Người Chơi',
            score: scoreData.score || 0,
            mode: scoreData.mode || 'solo',
            rank: scoreData.rank || 'Thường Dân',
            combo: scoreData.combo || 0,
            questionsCorrect: scoreData.questionsCorrect || 0,
            questionsTotal: scoreData.questionsTotal || 0,
            duration: scoreData.duration || 0,
            achievements: JSON.stringify(unlockedAch || []),
            dailyStreak: (getDailyData && getDailyData().streak) || 0
        });

        if (result && result.success) {
            console.log('[CloudDB] ✅ Score submitted');
            this._showSyncToast('success', 'Đã đồng bộ điểm!');
        } else {
            console.warn('[CloudDB] ❌ Score submit failed:', result?.error);
            this._showSyncToast('offline', 'Lưu offline (không có mạng)');
        }
        return result;
    },

    /**
     * Lấy bảng xếp hạng toàn cầu
     */
    async getLeaderboard(mode = 'all', limit = 20) {
        const result = await this._call('getLeaderboard', { mode, limit });
        if (result && result.success) {
            return result.leaderboard || [];
        }
        return null; // Fallback to local
    },

    /**
     * Lấy thông tin người chơi
     */
    async getPlayerStats() {
        const result = await this._call('getPlayerStats', {
            playerId: this.getPlayerId()
        });
        if (result && result.success) {
            return result.player;
        }
        return null;
    },

    /**
     * Lấy danh sách câu hỏi từ Google Sheets
     */
    async getQuestions() {
        const result = await this._call('getQuestions');
        if (result && result.success) {
            return result.questions || [];
        }
        return null;
    },

    /**
     * Xác thực admin qua cloud
     */
    async adminLogin(password) {
        const result = await this._call('adminLogin', { password });
        if (result && result.success) {
            sessionStorage.setItem('vtv_admin_token', result.token);
            return true;
        }
        return false;
    },

    /**
     * Kiểm tra kết nối
     */
    async ping() {
        const result = await this._call('ping');
        return result && result.success;
    },

    /**
     * Hiển thị toast đồng bộ nhỏ gọn
     */
    _showSyncToast(type, message) {
        const existing = document.querySelector('.sync-toast');
        if (existing) existing.remove();

        const colors = {
            success: 'from-emerald-500 to-green-600',
            offline: 'from-gray-500 to-gray-600',
            error: 'from-red-500 to-red-600'
        };
        const icons = {
            success: '☁️',
            offline: '📴',
            error: '⚠️'
        };

        const toast = document.createElement('div');
        toast.className = 'sync-toast';
        toast.innerHTML = `
            <div class="fixed bottom-4 right-4 bg-gradient-to-r ${colors[type]} text-white px-4 py-2 rounded-full shadow-lg text-xs font-bold flex items-center gap-2 z-[9999] animate-fade-in-up">
                <span>${icons[type]}</span>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
};
