        /*******************************************************
         * 1. HỆ THỐNG DỮ LIỆU & TIỆN ÍCH
         *******************************************************/
        const RAW_QUESTIONS = [
            "GIA ĐÌNH|Tập hợp những người cùng chung sống và có quan hệ máu mủ.|THÔNG DỤNG",
            "BÁC SĨ|Người khám chữa bệnh|THÔNG DỤNG", 
            "GIÁO VIÊN|Người dạy học cho học sinh|THÔNG DỤNG",
            "KỸ SƯ|Người thiết kế và xây dựng các công trình|THÔNG DỤNG", 
            "NÔNG DÂN|Người làm việc trên cánh đồng|THÔNG DỤNG",
            "THỢ MỘC|Người có nghề chế tác các đồ dùng bằng gỗ|THÔNG DỤNG", 
            "XE ĐẠP|Phương tiện giao thông 2 bánh dùng sức người|THÔNG DỤNG",
            "MÁY BAY|Phương tiện di chuyển trên bầu trời|THÔNG DỤNG", 
            "LỰC HẤP DẪN|Lực hút giữa các vật có khối lượng|KHOA HỌC",
            "ĐIỆN TÍCH|Thuộc tính vật lý của vật chất trải qua lực điện từ|KHOA HỌC",
            "HỆ MẶT TRỜI|Hệ hành tinh gồm Mặt Trời và các thiên thể bay quanh|KHOA HỌC",
            "VI KHUẨN|Sinh vật đơn bào có kích thước rất nhỏ|KHOA HỌC",
            "OXY|Nguyên tố cần thiết cho sự hô hấp|KHOA HỌC",
            "TẾ BÀO|Đơn vị cấu tạo cơ bản của mọi sinh vật|KHOA HỌC",
            "CÁCH MẠNG|Sự thay đổi căn bản, đột ngột trong xã hội|LỊCH SỬ",
            "ĐÔNG SƠN|Nền văn hóa cổ đại ở Việt Nam nổi tiếng với trống đồng|LỊCH SỬ",
            "LÀNG SEN|Quê hương của Chủ tịch Hồ Chí Minh|LỊCH SỬ",
            "ĐIỆN BIÊN PHỦ|Trận chiến nổi tiếng năm 1954|LỊCH SỬ",
            "NAM KỲ KHỞI NGHĨA|Tên cuộc nổi dậy lớn ở miền Nam năm 1940|LỊCH SỬ",
            "CỔ LOA|Kinh đô của nhà nước Âu Lạc|LỊCH SỬ",
            "MỘT NẮNG HAI SƯƠNG|Chỉ sự vất vả, khó nhọc của người nông dân|THÀNH NGỮ",
            "MÈO MẢ GÀ ĐỒNG|Kẻ vô lại, lang thang, sống đầu đường xó chợ|THÀNH NGỮ",
            "ẾCH NGỒI ĐÁY GIẾNG|Chỉ người thiếu hiểu biết nhưng tự cao|THÀNH NGỮ",
            "UỐNG NƯỚC NHỚ NGUỒN|Lời nhắc nhở phải biết ơn người đã giúp mình|THÀNH NGỮ",
            "CÓ CÔNG MÀI SẮT|Câu tục ngữ khuyên kiên trì sẽ thành công|THÀNH NGỮ",
            "TÔN SƯ TRỌNG ĐẠO|Đạo lý kính trọng người thầy|THÀNH NGỮ",
            "TIẾN THOÁI LƯỠNG NAN|Hoàn cảnh tiến hay lùi đều khó khăn|THÀNH NGỮ"
        ];
        
        let ALL_QUESTIONS = RAW_QUESTIONS.map(str => {
            let parts = str.split('|');
            return { answer: parts[0], answerClean: parts[0].replace(/\s+/g, ''), hint: parts[1], cat: parts[2] || 'THÔNG DỤNG' };
        });

        const RANKS = ["Thường Dân", "Tú Tài", "Cử Nhân", "Tiến Sĩ", "Trạng Nguyên"];
        const ALPHABET = 'AĂÂBCDĐEÊGHIKLMNOÔƠPQRSTUƯVXY'.split('');

        /*******************************************************
         * ACHIEVEMENT SYSTEM
         *******************************************************/
        const ACHIEVEMENTS = [
            { id: 'first_win', name: 'Khởi Đầu', icon: '🌟', desc: 'Trả lời đúng câu đầu tiên' },
            { id: 'combo_3', name: 'Combo Nhỏ', icon: '🔥', desc: 'Đạt combo x1.5' },
            { id: 'combo_5', name: 'Combo King', icon: '👑', desc: 'Đạt combo x2.0' },
            { id: 'speed_3s', name: 'Tốc Chiến', icon: '⚡', desc: 'Trả lời đúng trong 3 giây' },
            { id: 'no_hint_10', name: 'Tự Lực', icon: '💪', desc: 'Hoàn thành 10 câu không dùng gợi ý' },
            { id: 'perfect_10', name: 'Hoàn Hảo', icon: '💯', desc: '10 câu đúng liên tiếp' },
            { id: 'rank_trang', name: 'Trạng Nguyên', icon: '🎓', desc: 'Đạt rank Trạng Nguyên' },
            { id: 'beat_ai', name: 'Hạ Gục AI', icon: '🤖', desc: 'Thắng AI Bot' },
            { id: 'daily_3', name: 'Chuyên Cần', icon: '📅', desc: 'Daily streak 3 ngày' },
            { id: 'daily_7', name: 'Kiên Trì', icon: '🔥', desc: 'Daily streak 7 ngày' },
            { id: 'score_500', name: 'Nửa Ngàn', icon: '🏆', desc: 'Đạt 500 điểm trong 1 ván' },
            { id: 'all_topics', name: 'Bách Khoa', icon: '📚', desc: 'Chơi qua tất cả chủ đề' },
        ];
        let unlockedAch = JSON.parse(localStorage.getItem('vtv_achievements') || '[]');
        let gameStats = JSON.parse(localStorage.getItem('vtv_stats') || '{"totalCorrect":0,"bestCombo":0,"usedHintThisGame":false,"perfectStreak":0,"topicsPlayed":[]}');

        function unlockAchievement(id) {
            if (unlockedAch.includes(id)) return;
            unlockedAch.push(id);
            localStorage.setItem('vtv_achievements', JSON.stringify(unlockedAch));
            let ach = ACHIEVEMENTS.find(a => a.id === id);
            if (ach) showAchToast(ach);
        }
        function showAchToast(ach) {
            let t = document.createElement('div');
            t.className = 'ach-toast';
            t.innerHTML = `<div class="glass rounded-2xl px-6 py-4 flex items-center gap-4 shadow-2xl border border-yellow-400/50">
                <span class="text-4xl">${ach.icon}</span>
                <div><div class="text-yellow-300 font-black text-sm uppercase tracking-widest">Thành Tựu Mới!</div>
                <div class="text-white font-bold text-lg">${ach.name}</div>
                <div class="text-purple-200 text-xs">${ach.desc}</div></div></div>`;
            document.body.appendChild(t);
            sfx.levelUp();
            setTimeout(() => t.remove(), 4000);
        }
        function checkAchievementsOnCorrect() {
            unlockAchievement('first_win');
            if (state.combo >= 3) unlockAchievement('combo_3');
            if (state.combo >= 5) unlockAchievement('combo_5');
            if (state.score >= 500) unlockAchievement('score_500');
            if (state.mode === 'solo' && state.currQIndex >= 20) unlockAchievement('rank_trang');
            let timeUsed = state.maxTimer - state.timer;
            if (timeUsed <= 3) unlockAchievement('speed_3s');
            gameStats.perfectStreak++;
            if (gameStats.perfectStreak >= 10) unlockAchievement('perfect_10');
            if (state.combo > gameStats.bestCombo) gameStats.bestCombo = state.combo;
            if (!gameStats.usedHintThisGame && state.currQIndex >= 9) unlockAchievement('no_hint_10');
            if (state.targetQ && state.targetQ.cat && !gameStats.topicsPlayed.includes(state.targetQ.cat)) {
                gameStats.topicsPlayed.push(state.targetQ.cat);
            }
            if (['THÔNG DỤNG','THÀNH NGỮ','KHOA HỌC','LỊCH SỬ'].every(t => gameStats.topicsPlayed.includes(t))) {
                unlockAchievement('all_topics');
            }
            gameStats.totalCorrect++;
            localStorage.setItem('vtv_stats', JSON.stringify(gameStats));
        }
        function resetAchievementGameTracking() {
            gameStats.usedHintThisGame = false;
            gameStats.perfectStreak = 0;
        }
        function showAchievements() {
            let html = '<div class="grid grid-cols-2 gap-3 mt-4 max-h-[60vh] overflow-y-auto">';
            ACHIEVEMENTS.forEach(a => {
                let u = unlockedAch.includes(a.id);
                html += `<div class="p-3 rounded-xl border ${u ? 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-500/40' : 'bg-white/5 border-white/10 opacity-50'} text-center">
                    <div class="text-3xl mb-1">${u ? a.icon : '🔒'}</div>
                    <div class="font-bold text-sm text-white">${a.name}</div>
                    <div class="text-[10px] text-purple-200 mt-1">${a.desc}</div></div>`;
            });
            html += `</div><div class="text-center mt-3 text-purple-200 text-sm font-bold">${unlockedAch.length}/${ACHIEVEMENTS.length} đã mở khóa</div>`;
            Swal.fire({ title: '🏅 Thành Tựu', html, width: 500 });
        }

        /*******************************************************
         * DAILY CHALLENGE SYSTEM
         *******************************************************/
        function getDailySeed() {
            let d = new Date(); return d.getFullYear()*10000 + (d.getMonth()+1)*100 + d.getDate();
        }
        function seededRandom(seed) {
            let s = seed;
            return function() { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
        }
        function getDailyQuestions() {
            let rng = seededRandom(getDailySeed());
            let pool = [...ALL_QUESTIONS];
            for (let i = pool.length - 1; i > 0; i--) {
                let j = Math.floor(rng() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]];
            }
            return pool.slice(0, 5);
        }
        function getDailyData() {
            return JSON.parse(localStorage.getItem('vtv_daily') || '{"lastDate":"","streak":0,"playedToday":false}');
        }
        function saveDailyData(data) { localStorage.setItem('vtv_daily', JSON.stringify(data)); }
        function updateDailyUI() {
            let dd = getDailyData();
            let today = new Date().toISOString().slice(0,10);
            let el = document.getElementById('daily-streak-display');
            let st = document.getElementById('daily-status');
            let btn = document.getElementById('btn-daily-start');
            if (el) el.innerHTML = dd.streak + ' 🔥';
            if (dd.lastDate === today && dd.playedToday) {
                if (st) st.innerHTML = '✅ Bạn đã hoàn thành thử thách hôm nay!';
                if (btn) { btn.innerText = 'ĐÃ HOÀN THÀNH'; btn.disabled = true; btn.classList.add('opacity-50'); }
            } else {
                if (st) st.innerHTML = '⏳ Thử thách hôm nay đang chờ bạn!';
                if (btn) { btn.innerHTML = 'BẮT ĐẦU <i class="fas fa-play ml-2"></i>'; btn.disabled = false; btn.classList.remove('opacity-50'); }
            }
        }
        function startDailyChallenge() {
            let dd = getDailyData();
            let today = new Date().toISOString().slice(0,10);
            if (dd.lastDate === today && dd.playedToday) {
                Swal.fire('Đã chơi', 'Bạn đã hoàn thành thử thách hôm nay. Quay lại vào ngày mai!', 'info');
                return;
            }
            let pName = document.getElementById('daily-name').value.trim() || 'Người Chơi';
            state.mode = 'daily';
            state.soloConfig = { topic: 'ALL', diff: 'normal' };
            state.playerName = pName;
            state.questionsQueue = getDailyQuestions();
            state.currQIndex = 0; state.score = 0; state.lives = 3; state.combo = 0;
            resetAchievementGameTracking();
            document.getElementById('hud-mode-text').innerText = 'Daily Challenge';
            document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
            document.getElementById('screen-game').classList.add('active');
            buildQuestionBoard();
        }
        function completeDailyChallenge() {
            let dd = getDailyData();
            let today = new Date().toISOString().slice(0,10);
            let yesterday = new Date(Date.now()-86400000).toISOString().slice(0,10);
            if (dd.lastDate === yesterday) { dd.streak++; }
            else if (dd.lastDate !== today) { dd.streak = 1; }
            dd.lastDate = today; dd.playedToday = true;
            saveDailyData(dd);
            if (dd.streak >= 3) unlockAchievement('daily_3');
            if (dd.streak >= 7) unlockAchievement('daily_7');
        }

        // utils
        const getRank = (idx) => RANKS[Math.min(Math.floor(idx/5), 4)];
        const shuffleArray = (array) => { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [array[i], array[j]] = [array[j], array[i]]; } return array; };
        function xoaDau(str) {
            str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
            str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
            str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
            str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
            str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
            str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
            str = str.replace(/đ/g, "d");
            str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
            str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
            str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
            str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
            str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
            str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
            str = str.replace(/Đ/g, "D");
            return str;
        }

        /*******************************************************
         * 2. WEBAUDIO, HAPTIC, TTS
         *******************************************************/
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        function playTone(freq, type, duration) {
            if(audioCtx.state === 'suspended') audioCtx.resume();
            try {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + duration);
            } catch(e){}
        }
        const audioFiles = {
            click: new Audio('assets/sounds/click.mp3'),
            select: new Audio('assets/sounds/select.mp3'),
            deselect: new Audio('assets/sounds/deselect.mp3'),
            correct: new Audio('assets/sounds/correct.mp3'),
            wrong: new Audio('assets/sounds/wrong.mp3'),
            levelUp: new Audio('assets/sounds/level-up.mp3')
        };
        
        function playAudioFile(key, fallbackFn) {
            if (audioFiles[key]) {
                audioFiles[key].currentTime = 0;
                audioFiles[key].play().catch(() => {
                    if(fallbackFn) fallbackFn();
                });
            } else if(fallbackFn) {
                fallbackFn();
            }
        }

        const sfx = {
            click: () => playAudioFile('click', () => playTone(600, 'sine', 0.1)),
            select: () => playAudioFile('select', () => playTone(800, 'sine', 0.1)),
            deselect: () => playAudioFile('deselect', () => playTone(400, 'sine', 0.1)),
            correct: () => playAudioFile('correct', () => { [523.25, 659.25, 783.99].forEach((f, i) => setTimeout(() => playTone(f, 'sine', 0.3), i*100)); }),
            wrong: () => playAudioFile('wrong', () => playTone(150, 'sawtooth', 0.4)),
            levelUp: () => playAudioFile('levelUp', () => { [440, 554.37, 659.25, 880].forEach((f, i) => setTimeout(() => playTone(f, 'triangle', 0.4), i*120)); })
        };
        const vibrate = (pattern) => { if (navigator.vibrate) navigator.vibrate(pattern); };
        const speak = (txt) => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance(txt);
                u.lang = 'vi-VN';
                u.rate = 1.0;
                window.speechSynthesis.speak(u);
            }
        };

        /*******************************************************
         * 3. GAME STATE MANAGER
         *******************************************************/
        let state = {
            mode: 'solo', // solo | challenge
            theme: localStorage.getItem('vtv_theme') || 'light',
            players: [],
            currPlayerIdx: 0,
            currQIndex: 0, 
            questionsQueue: [], 
            
            // Current match state
            lives: 3,
            score: 0,
            aiScore: 0,
            combo: 0,
            timer: 30,
            maxTimer: 30,
            timerInt: null,
            aiTimer: null,
            
            // Current board
            targetQ: null,
            slots: [],   // { char, srcIdx, locked }
            letters: [], // { char, used, locked }
        };

        /*******************************************************
         * 4. UI ROUTER & THEME
         *******************************************************/
        const router = {
            go: (screenId, params = {}) => {
                document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
                document.getElementById('screen-' + screenId).classList.add('active');
                
                if (screenId === 'home') {
                    // Update leaderboard list cache if exists
                }
                if (screenId === 'daily') {
                    updateDailyUI();
                }
                if (screenId === 'game' && params.mode === 'solo') {
                    startSoloRound();
                }
                if (screenId === 'game' && params.mode === 'challenge_turn') {
                    startTurnForPlayer();
                }
            }
        };

        // ------------------ SETTINGS & THEME -------------
        function openSettings() {
            document.getElementById('screen-settings').classList.add('active');
        }
        function closeSettings() {
            document.getElementById('screen-settings').classList.remove('active');
        }

        const themes = {
            purple: { bg1: '#4c1d95', bg2: '#6d28d9', bg3: '#8b5cf6' },
            blue: { bg1: '#1e3a8a', bg2: '#2563eb', bg3: '#60a5fa' },
            green: { bg1: '#14532d', bg2: '#16a34a', bg3: '#4ade80' },
            red: { bg1: '#7f1d1d', bg2: '#dc2626', bg3: '#f87171' }
        };

        function setThemeScheme(colorKey) {
            const t = themes[colorKey];
            if(t) {
                document.documentElement.style.setProperty('--bg-1', t.bg1);
                document.documentElement.style.setProperty('--bg-2', t.bg2);
                document.documentElement.style.setProperty('--bg-3', t.bg3);
                localStorage.setItem('vtv_color_theme', colorKey);
                
                // Update active button state
                document.querySelectorAll('.theme-btn').forEach(btn => {
                    btn.classList.remove('border-white', 'scale-110');
                    if (btn.dataset.theme === colorKey) {
                        btn.classList.add('border-white', 'scale-110');
                    }
                });
            }
        }
        // Load initial theme
        const savedTheme = localStorage.getItem('vtv_color_theme') || 'purple';
        setThemeScheme(savedTheme);

        // ------------------ ADMIN PANEL -------------
        function openAdminPanel() {
            Swal.fire({
                title: 'Đăng nhập Quản trị',
                html: `
                    <input type="password" id="admin-pass" class="swal2-input" placeholder="Mật khẩu quản trị">
                    <p class="text-xs text-gray-500 mt-2">🔒 Xác thực bảo mật qua Cloud</p>
                `,
                confirmButtonText: 'Đăng nhập',
                focusConfirm: false,
                showLoaderOnConfirm: true,
                preConfirm: async () => {
                    const pass = Swal.getPopup().querySelector('#admin-pass').value;
                    if (!pass) { Swal.showValidationMessage('Vui lòng nhập mật khẩu!'); return false; }
                    
                    // Thử cloud auth trước
                    if (typeof CloudDB !== 'undefined' && !CLOUD_CONFIG.API_URL.includes('YOUR_')) {
                        const ok = await CloudDB.adminLogin(pass);
                        if (ok) return { authenticated: true };
                        Swal.showValidationMessage('Mật khẩu không đúng!');
                        return false;
                    }
                    
                    // Fallback: SHA-256 hash check (offline)
                    const encoder = new TextEncoder();
                    const data = encoder.encode(pass);
                    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                    const OFFLINE_ADMIN_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'; // SHA-256 of 'admin'
                    if (hashHex === OFFLINE_ADMIN_HASH) return { authenticated: true };
                    
                    Swal.showValidationMessage('Mật khẩu không đúng!');
                    return false;
                },
                allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
                if (result.isConfirmed && result.value && result.value.authenticated) {
                    closeSettings();
                    document.getElementById('screen-admin').classList.add('active');
                    renderAdminList();
                    loadAdminConfig();
                }
            });
        }
        function closeAdminPanel() {
            document.getElementById('screen-admin').classList.remove('active');
        }

        let adminConfig = JSON.parse(localStorage.getItem('vtv_admin_config') || '{"timeEasy":30, "timeNormal":20, "timeHard": 10}');

        function loadAdminConfig() {
            document.getElementById('admin-time-easy').value = adminConfig.timeEasy || 30;
            document.getElementById('admin-time-normal').value = adminConfig.timeNormal || 20;
            document.getElementById('admin-time-hard').value = adminConfig.timeHard || 10;
            
            // update options in solo setup
            document.getElementById('opt-easy').innerText = `Dễ (${adminConfig.timeEasy || 30}s, ít chữ nhiễu)`;
            document.getElementById('opt-normal').innerText = `Trung bình (${adminConfig.timeNormal || 20}s, vừa chữ nhiễu)`;
            document.getElementById('opt-hard').innerText = `Khó (${adminConfig.timeHard || 10}s, nhiều chữ nhiễu)`;
        }
        
        loadAdminConfig(); // Init the labels payload

        function saveAdminConfig() {
            const tE = parseInt(document.getElementById('admin-time-easy').value) || 30;
            const tN = parseInt(document.getElementById('admin-time-normal').value) || 20;
            const tH = parseInt(document.getElementById('admin-time-hard').value) || 10;
            
            adminConfig = { timeEasy: tE, timeNormal: tN, timeHard: tH };
            localStorage.setItem('vtv_admin_config', JSON.stringify(adminConfig));
            
            loadAdminConfig(); // Refresh labels
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã lưu cấu hình!', showConfirmButton: false, timer: 1500 });
        }

        let userQuestions = JSON.parse(localStorage.getItem('vtv_questions') || '[]');
        let activeQuestions = ALL_QUESTIONS;
        if(userQuestions.length > 0) {
            activeQuestions = [...ALL_QUESTIONS, ...userQuestions];
        }

        // populate topic fields on app load
        document.addEventListener('DOMContentLoaded', () => {
            renderAdminList();
            updateDailyUI();

            // ☁️ Cloud connectivity check & Sync Questions
            if (typeof CloudDB !== 'undefined') {
                CloudDB.ping().then(async (ok) => {
                    const dot = document.getElementById('cloud-dot');
                    if (dot) {
                        dot.classList.toggle('online', ok);
                        dot.classList.toggle('offline', !ok);
                        dot.title = ok ? 'Cloud: Online ☁️' : 'Cloud: Offline 📴';
                    }

                    if (ok) {
                        // Có mạng: tải câu hỏi từ Google Sheets
                        const cloudQuestions = await CloudDB.getQuestions();
                        if (cloudQuestions && cloudQuestions.length > 0) {
                            ALL_QUESTIONS = cloudQuestions.map(q => {
                                return {
                                    answer: q.answer,
                                    answerClean: q.answer.replace(/\s+/g, ''),
                                    hint: q.hint,
                                    cat: q.cat || 'THÔNG DỤNG'
                                };
                            });
                            // Lưu cache cho lần offline sau
                            localStorage.setItem('vtv_cached_questions', JSON.stringify(ALL_QUESTIONS));
                        }
                    } else {
                        // Offline: tải từ cache nếu có
                        const cached = localStorage.getItem('vtv_cached_questions');
                        if (cached) {
                            try { ALL_QUESTIONS = JSON.parse(cached); } catch(e) {}
                        }
                    }
                    
                    // Cập nhật lại mảng câu hỏi đang hoạt động
                    activeQuestions = [...ALL_QUESTIONS, ...userQuestions];
                });
            } else {
                // Không cấu hình Cloud: check cache local
                const cached = localStorage.getItem('vtv_cached_questions');
                if (cached) {
                    try { ALL_QUESTIONS = JSON.parse(cached); } catch(e) {}
                }
                activeQuestions = [...ALL_QUESTIONS, ...userQuestions];
            }
        });

        function adminAddQuestion() {
            const w = document.getElementById('admin-word').value.trim().toUpperCase();
            const h = document.getElementById('admin-hint').value.trim();
            const t = document.getElementById('admin-topic-custom').value.trim().toUpperCase() || 'KHÁC';
            
            if(!w) return Swal.fire('Lỗi', 'Vui lòng nhập từ khóa!', 'error');

            const newQ = { answer: w, answerClean: w.replace(/\s+/g, ''), hint: h, cat: t, isCustom: true };
            userQuestions.push(newQ);
            localStorage.setItem('vtv_questions', JSON.stringify(userQuestions));
            activeQuestions = [...ALL_QUESTIONS, ...userQuestions];
            
            // clear form
            document.getElementById('admin-word').value = '';
            document.getElementById('admin-hint').value = '';
            
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã thêm thành công!', showConfirmButton: false, timer: 1500 });
            renderAdminList();
        }

        let currentManageTopic = '';
        function openTopicManager(topic) {
            currentManageTopic = topic;
            document.getElementById('topic-manager-title').innerText = 'Chủ đề: ' + topic;
            document.getElementById('modal-topic-manager').classList.remove('hidden');
            document.getElementById('modal-topic-manager').classList.add('flex');
            renderTopicManagerList();
        }

        function closeTopicManager() {
            document.getElementById('modal-topic-manager').classList.add('hidden');
            document.getElementById('modal-topic-manager').classList.remove('flex');
            renderAdminList(); // refresh count
        }

        function renderTopicManagerList() {
            const list = document.getElementById('topic-manager-list');
            let html = '';
            
            activeQuestions.forEach((q, idx) => {
                if(q.cat !== currentManageTopic) return;
                
                let isCustom = !!q.isCustom;
                
                html += `
                    <div class="bg-white/5 p-3 rounded-xl mb-3 flex justify-between items-center border border-white/10">
                        <div>
                            <div class="font-bold text-white text-lg">${q.answer}</div>
                            <div class="text-sm text-gray-300 italic">${q.hint}</div>
                        </div>
                        ${isCustom ? `
                        <button onclick="deleteTopicQuestion(${idx})" class="w-8 h-8 flex items-center justify-center bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-transform active:scale-95 shadow-md">
                            <i class="fas fa-trash"></i>
                        </button>
                        ` : '<span class="text-xs text-gray-500 font-bold px-2 whitespace-nowrap">Mặc định</span>'}
                    </div>
                `;
            });
            
            if(!html) html = '<div class="text-center text-gray-400 py-4">Chưa có câu hỏi nào</div>';
            list.innerHTML = html;
        }

        function topicManageAddQuestion() {
            const w = document.getElementById('topic-manage-word').value.trim().toUpperCase();
            const h = document.getElementById('topic-manage-hint').value.trim();
            const t = currentManageTopic;
            if(!w) return Swal.fire('Lỗi', 'Vui lòng nhập đáp án!', 'error');

            const newQ = { answer: w, answerClean: w.replace(/\s+/g, ''), hint: h, cat: t, isCustom: true };
            userQuestions.push(newQ);
            localStorage.setItem('vtv_questions', JSON.stringify(userQuestions));
            activeQuestions = [...ALL_QUESTIONS, ...userQuestions];
            
            document.getElementById('topic-manage-word').value = '';
            document.getElementById('topic-manage-hint').value = '';
            
            renderTopicManagerList();
        }

        function deleteTopicQuestion(globalIdx) {
            Swal.fire({
                title: 'Xóa câu này?',
                icon: 'warning',
                showCancelButton: true
            }).then(res => {
                if(res.isConfirmed) {
                    let customIdx = globalIdx - ALL_QUESTIONS.length;
                    userQuestions.splice(customIdx, 1);
                    localStorage.setItem('vtv_questions', JSON.stringify(userQuestions));
                    activeQuestions = [...ALL_QUESTIONS, ...userQuestions];
                    renderTopicManagerList();
                }
            });
        }

        function renderAdminList() {
            const list = document.getElementById('admin-list');
            document.getElementById('admin-count').innerText = activeQuestions.length + " câu";
            
            let grouped = {};
            activeQuestions.forEach((q, idx) => {
                if(!grouped[q.cat]) grouped[q.cat] = [];
                grouped[q.cat].push({ q, idx });
            });

            let html = '';
            let datalistOptions = '';
            let selectOptions = '<option value="ALL" class="text-black" id="opt-topic-all">Tất cả từ khóa</option>';

            for(let topic in grouped) {
                let count = grouped[topic].length;
                datalistOptions += `<option value="${topic}"></option>`;
                selectOptions += `<option value="${topic}" class="text-black">${topic}</option>`;
                
                html += `
                    <div class="bg-black/30 p-5 rounded-xl mb-4 border border-white/10">
                        <div class="flex justify-between items-center mb-4">
                            <div class="font-bold text-xl text-yellow-300"><i class="fas fa-folder-open text-purple-400 mr-2"></i>${topic}</div>
                            <div class="text-sm bg-blue-500 px-3 py-1 rounded-full font-bold">${count} câu</div>
                        </div>
                        <button onclick="openTopicManager('${topic}')" class="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg text-sm transition-colors text-white font-bold w-full md:w-auto">
                            <i class="fas fa-list-ul mr-2"></i> Danh sách Câu hỏi
                        </button>
                    </div>
                `;
            }

            list.innerHTML = html;

            let datalist = document.getElementById('admin-topic-list');
            if(datalist) datalist.innerHTML = datalistOptions;

            const soloTopicSel = document.getElementById('solo-topic');
            if(soloTopicSel) {
                // To preserve selected status or reset
                let oldVal = soloTopicSel.value;
                soloTopicSel.innerHTML = selectOptions;
                if(grouped[oldVal]) soloTopicSel.value = oldVal;
            }
        }

        function resetData() {
            Swal.fire({
                title: 'Khôi phục mọi thứ?',
                text: "Xóa toàn bộ câu hỏi tự tạo và lịch sử điểm số.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33'
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('vtv_questions');
                    localStorage.removeItem('vtv_leaderboard');
                    userQuestions = [];
                    activeQuestions = ALL_QUESTIONS;
                    Swal.fire('Thành công', 'Dữ liệu đã được khôi phục.', 'success');
                    closeSettings();
                }
            });
        }

        /*******************************************************
         * 5. CHƠI: SOLO & THÁCH ĐẤU LOGIC
         *******************************************************/
        
        // --- CHẾ ĐỘ THÁCH ĐẤU ---
        let prepChallengeNum = 2;
        function adjPlayers(v) {
            prepChallengeNum = Math.max(2, Math.min(5, prepChallengeNum + v));
            document.getElementById('player-count').innerText = prepChallengeNum;
            renderPlayerInputs();
            sfx.click();
        }
        function renderPlayerInputs() {
            const container = document.getElementById('player-names-container');
            container.innerHTML = '';
            for(let i=0; i<prepChallengeNum; i++) {
                container.innerHTML += `
                <div class="flex gap-2">
                    <input type="text" id="p-name-${i}" placeholder="Tên Đội / Bí danh ${i+1}" class="flex-1 bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-2xl px-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-purple-400">
                    <select id="p-icon-${i}" class="w-16 bg-white/10 text-white border border-white/20 rounded-2xl text-center text-xl appearance-none">
                        <option value="🦅">🦅</option>
                        <option value="🦁">🦁</option>
                        <option value="🐉">🐉</option>
                        <option value="🐺">🐺</option>
                        <option value="🐻">🐻</option>
                    </select>
                </div>`;
            }
        }
        renderPlayerInputs();

        function startChallengeProcess() {
            state.mode = 'challenge';
            state.players = [];
            for(let i=0; i<prepChallengeNum; i++) {
                let name = document.getElementById(`p-name-${i}`).value.trim() || `Đội ${i+1}`;
                let icon = document.getElementById(`p-icon-${i}`).value;
                state.players.push({ name: `${icon} ${name}`, score: 0 });
            }
            // Generate EXACT 10 identical questions setup
            let bank = shuffleArray([...activeQuestions]);
            state.challengeQSet = [];
            for(let i=0; i<10; i++) {
                let q = bank[i];
                let numDecoys = (i < 5) ? 1 : ((i < 8) ? 2 : 3); // Slightly different ramp for 10 Qs
                let lettersArr = q.answerClean.split('');
                for(let d=0; d<numDecoys; d++) lettersArr.push(ALPHABET[Math.floor(Math.random()*ALPHABET.length)]);
                state.challengeQSet.push({ 
                    answer: q.answer, answerClean: q.answerClean, hint: q.hint, 
                    lettersArr: shuffleArray(lettersArr) 
                });
            }
            
            state.currPlayerIdx = 0;
            prepareNextIntermission();
        }

        function prepareNextIntermission() {
            if (state.currPlayerIdx >= state.players.length) {
                // Kết thúc toàn bộ
                showPodium();
                return;
            }
            document.getElementById('intermission-player-name').innerText = state.players[state.currPlayerIdx].name;
            router.go('intermission');
        }

        function startTurnForPlayer() {
            state.questionsQueue = [...state.challengeQSet]; 
            // clone the challenge array for the player to consume
            state.currQIndex = 0;
            state.score = 0;
            state.lives = 3;
            state.combo = 0;
            
            document.getElementById('hud-mode-text').innerText = 'Câu (Thử thách)';
            buildQuestionBoard();
        }

        // --- CHẾ ĐỘ SOLO ---
        function startSoloProcess() {
            let topic = document.getElementById('solo-topic').value;
            let diff = document.getElementById('solo-diff').value;
            let pName = document.getElementById('solo-name').value.trim() || 'Cá Nhân';
            let pClass = document.getElementById('solo-class').value.trim();
            
            let filtered = topic === 'ALL' ? activeQuestions : activeQuestions.filter(q => q.cat === topic);
            if(filtered.length === 0) filtered = activeQuestions;
            
            let bank = shuffleArray([...filtered]).slice(0, 50);
            
            state.mode = 'solo';
            state.soloConfig = { topic, diff };
            state.playerName = pClass ? `${pName} (${pClass})` : pName;
            state.questionsQueue = bank;
            state.currQIndex = 0;
            state.score = 0;
            state.lives = 3;
            state.combo = 0;

            document.getElementById('hud-mode-text').innerText = 'Câu (Solo)';
            
            document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
            document.getElementById('screen-game').classList.add('active');
            
            buildQuestionBoard();
        }

        function startAIProcess() {
            let pName = document.getElementById('ai-name').value.trim() || 'Người Chơi';
            let pClass = document.getElementById('ai-class').value.trim();
            let aiLevel = document.getElementById('ai-level').value;
            let bank = shuffleArray([...activeQuestions]).slice(0, 10); // 10 câu
            
            state.mode = 'ai';
            state.aiConfig = { level: aiLevel };
            state.playerName = pClass ? `${pName} (${pClass})` : pName;
            state.questionsQueue = bank;
            state.currQIndex = 0;
            state.score = 0;
            state.aiScore = 0;
            state.lives = 999;
            state.combo = 0;
            state.players = [
                {name: 'Bạn', score: 0},
                {name: 'Bot AI', score: 0}
            ];

            document.getElementById('hud-mode-text').innerText = 'Câu (Vs AI)';
            
            document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
            document.getElementById('screen-game').classList.add('active');
            
            buildQuestionBoard();
        }

        /*******************************************************
         * 6. LUỒNG CHƠI CHÍNH (GAME LOOP)
         *******************************************************/

        function buildQuestionBoard() {
            if (state.lives <= 0) {
                finishGameSession("Hết mạng!");
                return;
            }
            if (state.currQIndex >= state.questionsQueue.length) {
                finishGameSession("Hoàn thành tuyệt đối!");
                return;
            }

            // Xử lý Popup lên cấp Solo
            if (state.mode === 'solo' && state.currQIndex > 0 && state.currQIndex % 5 === 0) {
                let rnk = getRank(state.currQIndex);
                Swal.fire({ title: 'Thăng Hạng!', text: `Chúc mừng bạn đạt danh hiệu ${rnk}!`, icon: 'success', confirmButtonText: 'Chiến tiếp' });
                sfx.levelUp();
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            }

            // Init data
            let q = state.questionsQueue[state.currQIndex];
            state.targetQ = q;
            
            let lettersArr = [];
            if (state.mode === 'challenge') {
                lettersArr = [...q.lettersArr]; // Dùng mảng đã chốt sẵn
            } else if (state.mode === 'ai') {
                let nD = 2; // Normal difficulty for AI game letters
                lettersArr = q.answerClean.split('');
                for(let d=0; d<nD; d++) lettersArr.push(ALPHABET[Math.floor(Math.random()*ALPHABET.length)]);
                lettersArr = shuffleArray(lettersArr);
            } else {
                // Solo mode => calculate decoys dynamically progressive or based on difficulty
                let nD = 0;
                let realIdx = state.currQIndex;
                let diff = state.soloConfig.diff;
                
                if (diff === 'easy') {
                    if (realIdx >= 10) nD = 1;
                    if (realIdx >= 30) nD = 2;
                } else if (diff === 'normal') {
                    nD = 1;
                    if (realIdx >= 10) nD = 2;
                    if (realIdx >= 20) nD = 3;
                } else if (diff === 'hard') {
                    nD = 2;
                    if (realIdx >= 10) nD = 3;
                    if (realIdx >= 20) nD = 4;
                }

                lettersArr = q.answerClean.split('');
                for(let d=0; d<nD; d++) lettersArr.push(ALPHABET[Math.floor(Math.random()*ALPHABET.length)]);
                lettersArr = shuffleArray(lettersArr);
            }

            state.slots = new Array(q.answerClean.length).fill().map(() => ({ char: null, srcIdx: null, locked: false }));
            state.letters = lettersArr.map((c) => ({ char: c, used: false, locked: false }));

            // Render State
            setMascot('🤔');
            renderHUD();
            renderBoard();
            
            // Timer reset
            clearInterval(state.timerInt);
            clearTimeout(state.aiTimer);
            
            
            // Set max timer based on config
            let adminCfg = JSON.parse(localStorage.getItem('vtv_admin_config') || '{"timeEasy":30, "timeNormal":20, "timeHard": 10}');
            let diff = 'easy';
            if (state.mode === 'solo' || state.mode === 'daily') diff = state.soloConfig.diff;
            if (state.mode === 'challenge') diff = state.challengeConfig?.diff || 'normal';
            if (state.mode === 'ai') diff = 'normal'; // AI default player time is normal, AI answers based on its own config

            let maxT = adminCfg.timeEasy || 30;
            if (diff === 'normal') maxT = adminCfg.timeNormal || 20;
            if (diff === 'hard') maxT = adminCfg.timeHard || 10;
            
            state.maxTimer = maxT;
            state.timer = maxT;
            
            updateTimerUI();
            
            if (state.mode === 'ai') setupAITurn();

            state.timerInt = setInterval(() => {
                state.timer--;
                updateTimerUI();
                if(state.timer <= 0) {
                    clearInterval(state.timerInt);
                    timeOutFail();
                }
            }, 1000);
        }

        function setupAITurn() {
            let waitTime = 5000;
            if (state.aiConfig.level === 'easy') waitTime = Math.random() * 10000 + 10000;
            if (state.aiConfig.level === 'normal') waitTime = Math.random() * 8000 + 5000;
            if (state.aiConfig.level === 'hard') waitTime = Math.random() * 5000 + 2000;
            
            state.aiTimer = setTimeout(() => {
                if (state.mode === 'ai') {
                    aiAnswersSuccessfully();
                }
            }, waitTime);
        }

        function aiAnswersSuccessfully() {
            clearInterval(state.timerInt);
            setMascot('🤖');
            sfx.wrong();
            vibrate(300);
            
            state.aiScore += 100;
            renderHUD();
            
            Swal.fire({title: 'Bot tốc độ!', text: `Bot đã giành trả lời đúng: ${state.targetQ.answer}`, icon: 'error', timer: 1800, showConfirmButton: false})
            .then(() => {
                state.currQIndex++;
                buildQuestionBoard();
            });
        }

        function updateTimerUI() {
            let tring = document.getElementById('timer-ring');
            let tt = document.getElementById('timer-text');
            tt.innerText = state.timer;
            
            let strokeDashoffset = 283 - (state.timer / state.maxTimer) * 283;
            tring.style.strokeDashoffset = strokeDashoffset;
            
            if (state.timer <= 5 && state.timer > 0) {
                tring.style.stroke = "#ef4444";
                tt.classList.add('text-red-500');
                if(!tt.parentElement.classList.contains('danger-pulse')) tt.parentElement.classList.add('danger-pulse');
            } else {
                tring.style.stroke = "#22c55e";
                tt.classList.remove('text-red-500');
                tt.parentElement.classList.remove('danger-pulse');
            }
        }

        function timeOutFail() {
            if (state.mode === 'ai') clearTimeout(state.aiTimer);
            setMascot('😵');
            sfx.wrong();
            vibrate(300);
            state.combo = 0;
            state.lives--;
            renderHUD();
            Swal.fire({title: 'Hết giờ!', text: `Đáp án: ${state.targetQ.answer}`, icon: 'error', timer: 1500, showConfirmButton: false})
            .then(() => {
                state.currQIndex++;
                buildQuestionBoard();
            });
        }

        function skipQuestion() {
            clearInterval(state.timerInt);
            if (state.mode === 'ai') clearTimeout(state.aiTimer);
            state.combo = 0;
            state.lives--;
            sfx.wrong();
            setMascot('😵');
            state.currQIndex++;
            buildQuestionBoard();
        }

        function confirmHome() {
            Swal.fire({
                title: 'Về trang chủ?',
                text: 'Trận đấu sẽ bị hủy bỏ.',
                icon: 'warning',
                background: 'rgba(255, 255, 255, 0.9)',
                backdrop: 'rgba(0,0,0,0.6)',
                showCancelButton: true,
                confirmButtonText: 'Đồng ý',
                cancelButtonText: 'Không',
                confirmButtonColor: '#ef4444'
            }).then((result) => {
                if (result.isConfirmed) {
                    clearInterval(state.timerInt);
                    if (state.mode === 'ai') clearTimeout(state.aiTimer);
                    document.getElementById('screen-game').classList.remove('active');
                    router.go('home');
                }
            });
        }

        function confirmStop() {
            Swal.fire({
                title: 'Dừng cuộc chơi?',
                text: 'Bạn sẽ kết thúc trận đấu và ghi nhận điểm số hiện tại.',
                icon: 'warning',
                background: 'rgba(255, 255, 255, 0.9)',
                backdrop: 'rgba(0,0,0,0.6)',
                showCancelButton: true,
                confirmButtonText: 'Dừng lại',
                cancelButtonText: 'Tiếp tục',
                confirmButtonColor: '#ef4444'
            }).then((result) => {
                if (result.isConfirmed) {
                    finishGameSession("Chủ động dừng");
                }
            });
        }

        function finishGameSession(reason) {
            clearInterval(state.timerInt);
            if (state.mode === 'ai') clearTimeout(state.aiTimer);
            
            if (state.mode === 'solo' || state.mode === 'daily') {
                // Lưu điểm vào LS (offline backup)
                let topScores = JSON.parse(localStorage.getItem('vtv_scores') || '[]');
                topScores.push({ name: state.playerName, score: state.score, rank: getRank(state.currQIndex), date: new Date().toLocaleDateString() });
                topScores.sort((a,b)=>b.score - a.score);
                if(topScores.length > 5) topScores = topScores.slice(0,5);
                localStorage.setItem('vtv_scores', JSON.stringify(topScores));
                
                // ☁️ Đồng bộ lên Google Sheets (async, không chặn UI)
                if (typeof CloudDB !== 'undefined') {
                    CloudDB.submitScore({
                        name: state.playerName,
                        score: state.score,
                        mode: state.mode,
                        rank: getRank(state.currQIndex),
                        combo: state.combo,
                        questionsCorrect: state.currQIndex,
                        questionsTotal: state.questionsQueue.length,
                        duration: 0
                    }).catch(err => console.warn('[CloudDB] Submit error:', err));
                }
                
                // Daily: mark completed & update streak
                if (state.mode === 'daily') completeDailyChallenge();
                
                // Hiển thị podium
                state.players = [{name: state.playerName, score: state.score}];
                showPodium();
            } else if (state.mode === 'ai') {
                state.players = [
                    {name: state.playerName, score: state.score},
                    {name: 'AI Bot', score: state.aiScore}
                ];
                // Check beat AI achievement
                if (state.score > state.aiScore) unlockAchievement('beat_ai');
                
                // ☁️ Đồng bộ kết quả AI lên cloud
                if (typeof CloudDB !== 'undefined') {
                    CloudDB.submitScore({
                        name: state.playerName,
                        score: state.score,
                        mode: 'ai',
                        rank: getRank(state.currQIndex),
                        combo: state.combo,
                        questionsCorrect: state.currQIndex,
                        questionsTotal: state.questionsQueue.length
                    }).catch(err => console.warn('[CloudDB] Submit error:', err));
                }
                showPodium();
            } else {
                // Challenge
                state.players[state.currPlayerIdx].score = state.score;
                state.currPlayerIdx++;
                prepareNextIntermission();
            }
        }

        function showPodium() {
            document.getElementById('podium-title').innerText = (state.mode === 'solo' || state.mode === 'daily') ? 'Thành Tích Của Bạn' : 'Kết Quả Thử Thách';
            if (state.mode === 'ai') document.getElementById('podium-title').innerText = 'Kết Quả Trận Đấu';
            if (state.mode === 'daily') document.getElementById('podium-title').innerText = '📅 Daily Challenge';
            
            let sorted = [...state.players].sort((a,b)=>b.score - a.score);
            let listHTML = '';
            sorted.forEach((p, i) => {
                let medal = i===0?'🥇':i===1?'🥈':i===2?'🥉':'👏';
                listHTML += `
                    <div class="flex justify-between items-center bg-white/10 border border-white/20 rounded-2xl p-4 shadow-sm">
                        <div class="flex items-center gap-3">
                            <span class="text-3xl">${medal}</span>
                            <span class="font-bold text-lg text-white">${p.name}</span>
                        </div>
                        <span class="font-black text-yellow-300 text-xl">${p.score} pt</span>
                    </div>
                `;
            });
            document.getElementById('podium-list').innerHTML = listHTML;
            router.go('podium');
            confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
        }

        async function showLeaderboard() {
            let listContainer = document.getElementById('leaderboard-list');
            listContainer.innerHTML = '<div class="text-white/60 p-4 text-center"><i class="fas fa-spinner fa-spin mr-2"></i>Đang tải...</div>';
            router.go('leaderboard');

            // Thử lấy từ cloud trước
            let cloudScores = null;
            if (typeof CloudDB !== 'undefined') {
                try { cloudScores = await CloudDB.getLeaderboard('all', 20); } catch(e) {}
            }

            let scoresToRender = [];
            let isCloud = false;

            if (cloudScores && cloudScores.length > 0) {
                scoresToRender = cloudScores.map(s => ({
                    name: s.name, score: s.score, rank: s.rank, date: '',
                    mode: s.mode, combo: s.combo
                }));
                isCloud = true;
            } else {
                // Fallback local
                scoresToRender = JSON.parse(localStorage.getItem('vtv_scores') || '[]');
            }

            if(scoresToRender.length === 0) {
                listContainer.innerHTML = '<div class="text-white/60 p-4 text-center">Chưa có dữ liệu. Hãy chơi để ghi điểm!</div>';
                return;
            }

            let html = isCloud ? '<div class="text-emerald-300 text-xs mb-3 font-bold text-center">☁️ Bảng xếp hạng toàn cầu</div>' : '<div class="text-gray-400 text-xs mb-3 font-bold text-center">📴 Dữ liệu offline</div>';
            scoresToRender.forEach((s, idx) => {
                let medal = idx===0?'🥇':idx===1?'🥈':idx===2?'🥉':`${idx+1}.`;
                let n = s.name || 'Người Chơi';
                let rnk = s.rank || 'N/A';
                let dt = s.date || '';
                let modeLabel = s.mode === 'daily' ? '📅' : s.mode === 'ai' ? '🤖' : '';
                html += `<div class="flex justify-between items-center bg-white/10 border border-white/20 rounded-2xl p-4 shadow-sm mb-3">
                    <div class="flex flex-col text-left gap-1 truncate min-w-0">
                        <span class="font-bold text-lg text-white truncate"><span class="w-8 inline-block">${medal}</span> ${n} ${modeLabel}</span>
                        <span class="text-xs font-normal text-white/60 pl-8 block">${rnk} ${dt ? '• ' + dt : ''}</span>
                    </div>
                    <span class="font-black text-yellow-300 text-xl shrink-0">${s.score}</span>
                </div>`;
            });
            listContainer.innerHTML = html;
        }

        function shareResult() {
            let txt = state.mode === 'solo' 
                ? `🏆 Tôi vừa đạt ${state.score} điểm, hạng ${getRank(state.currQIndex)} trong Vua Tiếng Việt!` 
                : state.mode === 'ai'
                    ? `🏆 Tôi vừa đối đầu với Bot AI trong Vua Tiếng Việt! Tỉ số: Bạn ${state.score} - Bot ${state.aiScore}.`
                    : `🏆 Thử thách Vua Tiếng Việt hoàn tất! Kẻ chiến thắng: ${[...state.players].sort((a,b)=>b.score-a.score)[0].name}!`;
            
            if (navigator.share) {
                navigator.share({ title: 'Vua Tiếng Việt', text: txt, url: window.location.href });
            } else {
                navigator.clipboard.writeText(txt);
                Swal.fire('Thành công', 'Đã copy kết quả vào Clipboard!', 'success');
            }
        }

        /*******************************************************
         * 7. RENDERING & INTERACTION DOM
         *******************************************************/

        function renderHUD() {
            document.getElementById('hud-score').innerText = state.score;
            document.getElementById('hud-rank').innerText = (state.mode==='solo'||state.mode==='daily') ? getRank(state.currQIndex) : state.players[state.currPlayerIdx].name;
            document.getElementById('hud-q-num').innerText = `${state.currQIndex + 1}/${state.questionsQueue.length}`;
            
            // Theo tỷ lệ tiến trình
            let wP = Math.floor((state.currQIndex / state.questionsQueue.length) * 100);
            document.getElementById('hud-progress').style.width = wP + '%';

            // Lives or AI Score
            if (state.mode === 'ai') {
                document.getElementById('hud-hearts').innerHTML = `
                    <div class="flex items-center gap-2 px-1">
                        <i class="fas fa-robot text-purple-200"></i> 
                        <span class="text-sm font-bold text-white">Bot: <span class="text-yellow-300 ml-1">${state.aiScore}</span></span>
                    </div>`;
            } else {
                let hHTML = '';
                for(let i=0; i<3; i++) hHTML += `<i class="${i < state.lives ? 'fas fa-heart' : 'far fa-heart'}"></i>`;
                document.getElementById('hud-hearts').innerHTML = hHTML;
            }

            // Combo
            let mult = getComboMultiplier();
            document.getElementById('hud-combo').innerText = `x${mult.toFixed(1)}`;
        }

        function getComboMultiplier() {
            if(state.combo >= 5) return 2.0;
            if(state.combo >= 3) return 1.5;
            return 1.0;
        }

        function setMascot(emoji) {
            let m = document.getElementById('mascot');
            m.innerText = emoji;
            m.classList.remove('anim-pop');
            void m.offsetWidth; // trgger reflow
            m.classList.add('anim-pop');
        }

        function renderBoard() {
            document.getElementById('question-hint').innerText = state.targetQ.hint;
            
            // Calculate scale to prevent jumping & to accommodate 90% zoom constraints
            let ansChars = state.targetQ.answerClean.length;
            let scaleVal = 1;
            if (ansChars > 9) scaleVal = 9 / ansChars;
            document.documentElement.style.setProperty('--tile-scale', Math.min(1, Math.max(0.65, scaleVal)));

            // Build Slots HTML
            let sHTML = '';
            let sIdx = 0;
            let words = state.targetQ.answer.split(' ');
            
            for (let w = 0; w < words.length; w++) {
                let word = words[w];
                sHTML += `<div class="flex flex-nowrap gap-1 md:gap-2 justify-center">`;
                for(let i=0; i<word.length; i++) {
                    let st = state.slots[sIdx];
                    let cls = 'slot-empty';
                    let cont = '';
                    if (st.char) { cls = st.locked ? 'char-tile locked' : 'char-tile slot-filled'; cont = st.char; }
                    else { cls = 'char-tile slot-empty'; cont = ''; }
                    let animCls = st.char ? ' anim-tile-flip' : '';
                    sHTML += `<div onclick="clkSlot(${sIdx})" class="${cls}${animCls}" style="animation-delay:${sIdx*0.05}s">${cont}</div>`;
                    sIdx++;
                }
                sHTML += `</div>`;
            }
            document.getElementById('board-slots').innerHTML = sHTML;

            // Build Letters HTML
            let lHTML = '';
            for(let i=0; i<state.letters.length; i++) {
                let lt = state.letters[i];
                if (lt.deleted) {
                    lHTML += `<div class="char-tile" style="visibility:hidden; width:0; margin:0; padding:0; border:none;"></div>`; 
                    // Hide completely without breaking grid just in case
                    continue;
                }
                let cls = 'char-tile letter-avail';
                if (lt.used || lt.locked) cls += ' letter-used';
                lHTML += `<div onclick="clkLetter(${i})" class="${cls}">${lt.char}</div>`;
            }
            document.getElementById('board-letters').innerHTML = lHTML;
        }

        function clkLetter(lIdx) {
            let lt = state.letters[lIdx];
            if (lt.used || lt.locked) return;
            
            // Find first empty slot
            let sIdx = state.slots.findIndex(s => s.char === null);
            if (sIdx !== -1) {
                state.slots[sIdx] = { char: lt.char, srcIdx: lIdx, locked: false };
                lt.used = true;
                sfx.select();
                vibrate(40);
                renderBoard();
                
                // Auto check when full
                if (state.slots.every(s => s.char !== null)) {
                    checkAnswer();
                }
            }
        }

        function clkSlot(sIdx) {
            let st = state.slots[sIdx];
            if (!st.char || st.locked) return;
            
            // Return to letters
            state.letters[st.srcIdx].used = false;
            state.slots[sIdx] = { char: null, srcIdx: null, locked: false };
            sfx.deselect();
            renderBoard();
        }

        function clearSlots() {
            sfx.deselect();
            for(let i=0; i<state.slots.length; i++) {
                if (!state.slots[i].locked && state.slots[i].char !== null) {
                    state.letters[state.slots[i].srcIdx].used = false;
                    state.slots[i] = { char: null, srcIdx: null, locked: false };
                }
            }
            renderBoard();
        }

        function revealOneTile() {
            if (state.score < 10) {
                Swal.fire('Oops', 'Bạn cần 10 điểm để Mở 1 ô!', 'warning');
                return;
            }
            
            let ansClean = state.targetQ.answerClean;
            // Find first wrong or empty slot
            let targetIdx = -1;
            for(let i=0; i<ansClean.length; i++) {
                if (state.slots[i].char !== ansClean[i]) { targetIdx = i; break; }
            }
            if (targetIdx === -1) return; // All correct?!

            state.score -= 10;
            sfx.click();

            // Clear current invalid char if exists
            if (state.slots[targetIdx].char !== null && !state.slots[targetIdx].locked) {
                state.letters[state.slots[targetIdx].srcIdx].used = false;
            }

            let neededChar = ansClean[targetIdx];
            // Find letter available
            let lIdx = state.letters.findIndex(l => l.char === neededChar && !l.locked && !l.used);
            if (lIdx === -1) {
                // Letter is stuck in another slot
                let conflictSlotIdx = state.slots.findIndex(s => s.srcIdx !== null && state.letters[s.srcIdx].char === neededChar && !state.letters[s.srcIdx].locked);
                if(conflictSlotIdx !== -1) {
                    state.letters[state.slots[conflictSlotIdx].srcIdx].used = false;
                    state.slots[conflictSlotIdx] = { char: null, srcIdx: null, locked: false };
                    lIdx = state.letters.findIndex(l => l.char === neededChar && !l.locked && !l.used);
                }
            }

            if (lIdx !== -1) {
                state.slots[targetIdx] = { char: neededChar, srcIdx: lIdx, locked: true };
                state.letters[lIdx].used = true;
                state.letters[lIdx].locked = true;
            }
            
            // Auto check when full
            if (state.slots.every(s => s.char !== null)) {
                setTimeout(checkAnswer, 300);
            }
            
            renderHUD();
            renderBoard();
        }

        function useHint() {
            if (state.score < 10) {
                Swal.fire('Oops', 'Bạn cần 10 điểm để dùng Gợi ý (Xóa 1 chữ nhiễu)!', 'warning');
                return;
            }

            // identify a noise letter
            let ansCleanArr = state.targetQ.answerClean.split('');
            let letterCounts = {};
            for (let c of ansCleanArr) {
                letterCounts[c] = (letterCounts[c] || 0) + 1;
            }

            let noiseLetterIdx = -1;
            for (let i = 0; i < state.letters.length; i++) {
                let l = state.letters[i];
                if (l.locked || l.deleted) continue; // Don't touch locked or already deleted
                
                if (!letterCounts[l.char]) {
                    noiseLetterIdx = i; // Not in answer at all
                    break;
                } else {
                    // Check if there are more copies of this letter than needed
                    let neededCount = letterCounts[l.char];
                    let currentCount = state.letters.filter((x, idx) => !x.deleted && x.char === l.char).length;
                    if (currentCount > neededCount) {
                        noiseLetterIdx = i;
                        break;
                    }
                }
            }

            if (noiseLetterIdx === -1) {
                Swal.fire('Tip', 'Không có chữ cái gây nhiễu nào trên bảng!', 'info');
                return;
            }

            state.score -= 10;
            sfx.click();
            gameStats.usedHintThisGame = true;

            // if it was placed on the board, return it so it can be deleted
            let slotIdx = state.slots.findIndex(s => s.srcIdx === noiseLetterIdx);
            if (slotIdx !== -1 && !state.slots[slotIdx].locked) {
                state.slots[slotIdx] = { char: null, srcIdx: null, locked: false };
            }

            state.letters[noiseLetterIdx].deleted = true; // Mark as completely deleted
            state.letters[noiseLetterIdx].used = true; // hide it from interaction
            state.letters[noiseLetterIdx].locked = true;

            renderHUD();
            renderBoard();
        }

        function checkAnswer() {
            let currentWordFormed = state.slots.map(s => s.char || ' ').join('');
            
            // Check full?
            if (currentWordFormed.includes(' ')) {
                document.getElementById('board-slots').classList.remove('anim-shake');
                void document.getElementById('board-slots').offsetWidth;
                document.getElementById('board-slots').classList.add('anim-shake');
                sfx.wrong();
                vibrate([30]);
                return;
            }

            clearInterval(state.timerInt);
            
            if (currentWordFormed === state.targetQ.answerClean) {
                if (state.mode === 'ai') clearTimeout(state.aiTimer);
                
                // Đúng
                state.combo++;
                setMascot('🤩');
                sfx.correct();
                speak(state.targetQ.answer);
                vibrate([100, 50, 100]);
                confetti({ zIndex: 100, particleCount: 50, origin: {y: 0.8} });
                
                // Tile glow animation
                document.querySelectorAll('#board-slots .char-tile').forEach((tile, i) => {
                    setTimeout(() => tile.classList.add('anim-correct-tile'), i * 80);
                });
                
                let pts = Math.floor(100 * getComboMultiplier());
                state.score += pts;
                renderHUD();
                checkAchievementsOnCorrect();

                // Chờ tí rồi qua câu
                setTimeout(() => {
                    state.currQIndex++;
                    buildQuestionBoard();
                }, 1800);

            } else {
                if (state.mode === 'ai') clearTimeout(state.aiTimer);
                
                // Sai
                setMascot('😵');
                state.combo = 0;
                gameStats.perfectStreak = 0;
                sfx.wrong();
                vibrate([300]);
                document.querySelectorAll('#board-slots .char-tile').forEach(t => t.classList.add('anim-wrong-tile'));
                document.getElementById('board-slots').classList.add('anim-shake');
                
                state.lives--;
                renderHUD();
                
                if (state.lives <= 0) {
                    Swal.fire({title: 'Game Over!', text: `Đã kết thúc. Đáp án: ${state.targetQ.answer}`, icon: 'error', confirmButtonText: 'Đóng'})
                    .then(() => { finishGameSession('HetMang'); });
                } else {
                    setTimeout(() => {
                        document.getElementById('board-slots').classList.remove('anim-shake');
                        setMascot('🤔');
                        // Reset timer automatically continuing this question? Hoặc qua luôn? 
                        // Yêu cầu "Trả lời sai/Hế giờ -> Chuyển câu, trừ mạng". (Dành cho Challenge).
                        // Vậy hãy chuyển câu luôn nếu sai.
                        Swal.fire({title: 'Sai rồi!', text: `Đáp án: ${state.targetQ.answer}`, icon: 'error', timer: 1500, showConfirmButton: false})
                        .then(() => {
                            state.currQIndex++;
                            buildQuestionBoard();
                        });
                    }, 500);
                }
            }
        }