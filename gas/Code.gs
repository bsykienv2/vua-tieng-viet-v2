/**
 * ============================================================
 * VUA TIẾNG VIỆT — GOOGLE APPS SCRIPT BACKEND
 * ============================================================
 * Hướng dẫn triển khai:
 * 1. Truy cập https://script.google.com
 * 2. Tạo dự án mới, dán toàn bộ nội dung file này vào Code.gs
 * 3. Thay giá trị CONFIG.SHEET_ID bằng ID Google Sheet của bạn
 * 4. Thay CONFIG.API_KEY bằng khóa bảo mật tùy chọn (giữ bí mật)
 * 5. Thay CONFIG.ADMIN_PASSWORD_HASH bằng hash SHA-256 của mật khẩu admin
 *    (Tạo hash tại: https://emn178.github.io/online-tools/sha256.html)
 * 6. Deploy → New deployment → Web app → "Anyone" access
 * 7. Copy URL deployment và dán vào file scripts/config.js
 * ============================================================
 */

const CONFIG = {
  // === BẮT BUỘC THAY ĐỔI ===
  SHEET_ID: 'YOUR_GOOGLE_SHEET_ID_HERE',        // ID bảng tính Google Sheets
  API_KEY: 'vtv_game_secret_2024_CHANGE_ME',     // Khóa bảo mật API
  ADMIN_PASSWORD_HASH: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // SHA-256 của "admin" — THAY ĐỔI NGAY

  // === CẤU HÌNH ===
  MAX_LEADERBOARD: 50,                           // Số lượng tối đa bảng xếp hạng
  RATE_LIMIT_SECONDS: 3,                         // Giới hạn thời gian giữa các request
  ALLOWED_ORIGINS: ['*'],                        // Domain cho phép (dùng '*' cho dev, thay bằng domain thật khi deploy)
};

// ===================== SHEET HELPERS =====================

function getSheet(tabName) {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  let sheet = ss.getSheetByName(tabName);
  if (!sheet) {
    sheet = ss.insertSheet(tabName);
    if (tabName === 'Scores') {
      sheet.appendRow(['Timestamp', 'PlayerID', 'Name', 'Score', 'Mode', 'Rank', 'Combo', 'QuestionsCorrect', 'QuestionsTotal', 'Duration']);
      sheet.getRange(1, 1, 1, 10).setFontWeight('bold');
    } else if (tabName === 'Players') {
      sheet.appendRow(['PlayerID', 'Name', 'TotalGames', 'BestScore', 'BestRank', 'TotalCorrect', 'BestCombo', 'Achievements', 'DailyStreak', 'LastPlayed', 'CreatedAt']);
      sheet.getRange(1, 1, 1, 11).setFontWeight('bold');
    } else if (tabName === 'RateLimit') {
      sheet.appendRow(['IP', 'LastRequest']);
      sheet.getRange(1, 1, 1, 2).setFontWeight('bold');
    } else if (tabName === 'Questions') {
      sheet.appendRow(['Answer', 'Hint', 'Category', 'CreatedAt']);
      sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
      // Thêm một số câu hỏi mặc định khi mới tạo
      const defaults = [
        ["GIA ĐÌNH", "Tập hợp những người cùng chung sống và có quan hệ máu mủ.", "THÔNG DỤNG", new Date().toISOString()],
        ["BÁC SĨ", "Người khám chữa bệnh", "THÔNG DỤNG", new Date().toISOString()],
        ["MÁY BAY", "Phương tiện di chuyển trên bầu trời", "THÔNG DỤNG", new Date().toISOString()],
        ["LỰC HẤP DẪN", "Lực hút giữa các vật có khối lượng", "KHOA HỌC", new Date().toISOString()],
        ["ĐIỆN BIÊN PHỦ", "Trận chiến nổi tiếng năm 1954", "LỊCH SỬ", new Date().toISOString()],
        ["ẾCH NGỒI ĐÁY GIẾNG", "Chỉ người thiếu hiểu biết nhưng tự cao", "THÀNH NGỮ", new Date().toISOString()]
      ];
      sheet.getRange(2, 1, defaults.length, 4).setValues(defaults);
    }
  }
  return sheet;
}

// ===================== SECURITY =====================

function sha256(input) {
  const rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input);
  return rawHash.map(b => ('0' + ((b < 0 ? b + 256 : b)).toString(16)).slice(-2)).join('');
}

function validateApiKey(apiKey) {
  return apiKey === CONFIG.API_KEY;
}

function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '')           // Strip HTML tags
    .replace(/['"`;]/g, '')         // Strip quotes and semicolons
    .replace(/javascript:/gi, '')   // Strip JS injection
    .replace(/on\w+\s*=/gi, '')     // Strip event handlers
    .trim()
    .substring(0, 100);            // Max length
}

function checkRateLimit(clientId) {
  try {
    const sheet = getSheet('RateLimit');
    const data = sheet.getDataRange().getValues();
    const now = new Date().getTime();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === clientId) {
        const lastTime = new Date(data[i][1]).getTime();
        if (now - lastTime < CONFIG.RATE_LIMIT_SECONDS * 1000) {
          return false; // Rate limited
        }
        sheet.getRange(i + 1, 2).setValue(new Date());
        return true;
      }
    }
    // New client
    sheet.appendRow([clientId, new Date()]);
    return true;
  } catch (e) {
    return true; // Fail open for rate limit
  }
}

// ===================== CORS =====================

function setCorsHeaders() {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.JSON);
}

function doOptions(e) {
  return setCorsHeaders();
}

// ===================== MAIN ROUTER =====================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const apiKey = data.apiKey || '';
    const action = data.action || '';
    const clientId = data.clientId || 'unknown';

    // Validate API key
    if (!validateApiKey(apiKey)) {
      return jsonResponse({ success: false, error: 'Unauthorized: Invalid API key' }, 403);
    }

    // Rate limiting
    if (!checkRateLimit(clientId)) {
      return jsonResponse({ success: false, error: 'Rate limited. Please wait.' }, 429);
    }

    // Route actions
    switch (action) {
      case 'submitScore':
        return handleSubmitScore(data);
      case 'getLeaderboard':
        return handleGetLeaderboard(data);
      case 'getQuestions':
        return handleGetQuestions(data);
      case 'getPlayerStats':
        return handleGetPlayerStats(data);
      case 'adminLogin':
        return handleAdminLogin(data);
      case 'ping':
        return jsonResponse({ success: true, message: 'pong', timestamp: new Date().toISOString() });
      default:
        return jsonResponse({ success: false, error: 'Unknown action: ' + action }, 400);
    }
  } catch (err) {
    return jsonResponse({ success: false, error: 'Server error: ' + err.message }, 500);
  }
}

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'ping';
  const apiKey = (e && e.parameter && e.parameter.apiKey) || '';

  if (!validateApiKey(apiKey)) {
    return jsonResponse({ success: false, error: 'Unauthorized' }, 403);
  }

  if (action === 'getLeaderboard') {
    return handleGetLeaderboard({ limit: parseInt(e.parameter.limit || '10') });
  }

  if (action === 'getQuestions') {
    return handleGetQuestions({});
  }

  if (action === 'ping') {
    return jsonResponse({ success: true, message: 'VTV Backend is running', version: '2.0' });
  }

  return jsonResponse({ success: false, error: 'Unknown action' }, 400);
}

// ===================== HANDLERS =====================

function handleSubmitScore(data) {
  const sheet = getSheet('Scores');
  const playerSheet = getSheet('Players');

  // Sanitize inputs
  const playerId = sanitizeInput(data.playerId || generatePlayerId());
  const name = sanitizeInput(data.name || 'Người Chơi');
  const score = Math.max(0, Math.min(99999, parseInt(data.score) || 0));
  const mode = sanitizeInput(data.mode || 'solo');
  const rank = sanitizeInput(data.rank || 'Thường Dân');
  const combo = Math.max(0, Math.min(999, parseInt(data.combo) || 0));
  const questionsCorrect = Math.max(0, parseInt(data.questionsCorrect) || 0);
  const questionsTotal = Math.max(0, parseInt(data.questionsTotal) || 0);
  const duration = Math.max(0, parseInt(data.duration) || 0);

  // Validate mode
  const validModes = ['solo', 'daily', 'ai', 'challenge'];
  if (!validModes.includes(mode)) {
    return jsonResponse({ success: false, error: 'Invalid mode' }, 400);
  }

  // Save score
  sheet.appendRow([
    new Date().toISOString(),
    playerId,
    name,
    score,
    mode,
    rank,
    combo,
    questionsCorrect,
    questionsTotal,
    duration
  ]);

  // Update player profile
  updatePlayerProfile(playerSheet, playerId, name, score, rank, combo, questionsCorrect, data.achievements || '[]', data.dailyStreak || 0);

  return jsonResponse({
    success: true,
    message: 'Score submitted successfully',
    playerId: playerId
  });
}

function updatePlayerProfile(sheet, playerId, name, score, rank, combo, questionsCorrect, achievements, dailyStreak) {
  const data = sheet.getDataRange().getValues();
  let rowIdx = -1;

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === playerId) {
      rowIdx = i + 1;
      break;
    }
  }

  if (rowIdx === -1) {
    // New player
    sheet.appendRow([
      playerId,
      name,
      1,                              // TotalGames
      score,                          // BestScore
      rank,                           // BestRank
      questionsCorrect,               // TotalCorrect
      combo,                          // BestCombo
      achievements,                   // Achievements
      dailyStreak,                    // DailyStreak
      new Date().toISOString(),       // LastPlayed
      new Date().toISOString()        // CreatedAt
    ]);
  } else {
    // Existing player — update
    const row = data[rowIdx - 1];
    const totalGames = (row[2] || 0) + 1;
    const bestScore = Math.max(row[3] || 0, score);
    const bestRank = (score >= bestScore) ? rank : (row[4] || rank);
    const totalCorrect = (row[5] || 0) + questionsCorrect;
    const bestCombo = Math.max(row[6] || 0, combo);

    sheet.getRange(rowIdx, 2).setValue(name);
    sheet.getRange(rowIdx, 3).setValue(totalGames);
    sheet.getRange(rowIdx, 4).setValue(bestScore);
    sheet.getRange(rowIdx, 5).setValue(bestRank);
    sheet.getRange(rowIdx, 6).setValue(totalCorrect);
    sheet.getRange(rowIdx, 7).setValue(bestCombo);
    sheet.getRange(rowIdx, 8).setValue(achievements);
    sheet.getRange(rowIdx, 9).setValue(dailyStreak);
    sheet.getRange(rowIdx, 10).setValue(new Date().toISOString());
  }
}

function handleGetLeaderboard(data) {
  const sheet = getSheet('Scores');
  const allData = sheet.getDataRange().getValues();
  const limit = Math.min(data.limit || 10, CONFIG.MAX_LEADERBOARD);
  const mode = data.mode || 'all';

  // Skip header row, filter and sort
  let scores = [];
  for (let i = 1; i < allData.length; i++) {
    const row = allData[i];
    if (mode !== 'all' && row[4] !== mode) continue;
    scores.push({
      timestamp: row[0],
      name: row[2],
      score: row[3],
      mode: row[4],
      rank: row[5],
      combo: row[6],
      questionsCorrect: row[7],
      questionsTotal: row[8]
    });
  }

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);

  // Deduplicate — keep only best score per player name
  const seen = {};
  const unique = [];
  for (const s of scores) {
    if (!seen[s.name]) {
      seen[s.name] = true;
      unique.push(s);
    }
    if (unique.length >= limit) break;
  }

  return jsonResponse({ success: true, leaderboard: unique, total: scores.length });
}

function handleGetQuestions(data) {
  try {
    const sheet = getSheet('Questions');
    const allData = sheet.getDataRange().getValues();
    const questions = [];
    
    // Bỏ qua dòng tiêu đề
    for (let i = 1; i < allData.length; i++) {
      const row = allData[i];
      if (row[0] && row[0].toString().trim() !== '') {
        questions.push({
          answer: String(row[0]).trim().toUpperCase(),
          hint: String(row[1]).trim(),
          cat: String(row[2]).trim() || 'THÔNG DỤNG'
        });
      }
    }
    
    return jsonResponse({ success: true, questions: questions });
  } catch (e) {
    return jsonResponse({ success: false, error: e.message }, 500);
  }
}

function handleGetPlayerStats(data) {
  const playerId = sanitizeInput(data.playerId || '');
  if (!playerId) return jsonResponse({ success: false, error: 'Missing playerId' }, 400);

  const sheet = getSheet('Players');
  const allData = sheet.getDataRange().getValues();

  for (let i = 1; i < allData.length; i++) {
    if (allData[i][0] === playerId) {
      return jsonResponse({
        success: true,
        player: {
          playerId: allData[i][0],
          name: allData[i][1],
          totalGames: allData[i][2],
          bestScore: allData[i][3],
          bestRank: allData[i][4],
          totalCorrect: allData[i][5],
          bestCombo: allData[i][6],
          achievements: allData[i][7],
          dailyStreak: allData[i][8],
          lastPlayed: allData[i][9],
          createdAt: allData[i][10]
        }
      });
    }
  }

  return jsonResponse({ success: false, error: 'Player not found' }, 404);
}

function handleAdminLogin(data) {
  const passwordHash = sha256(data.password || '');
  if (passwordHash === CONFIG.ADMIN_PASSWORD_HASH) {
    // Generate a session token (simple approach)
    const token = Utilities.getUuid();
    const cache = CacheService.getScriptCache();
    cache.put('admin_token_' + token, 'valid', 3600); // 1 hour expiry
    return jsonResponse({ success: true, token: token });
  }
  return jsonResponse({ success: false, error: 'Invalid credentials' }, 401);
}

// ===================== UTILITY =====================

function generatePlayerId() {
  return 'vtv_' + Utilities.getUuid().replace(/-/g, '').substring(0, 12);
}

function jsonResponse(data, statusCode) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===================== SETUP (chạy 1 lần) =====================

function setupSheets() {
  getSheet('Scores');
  getSheet('Players');
  getSheet('RateLimit');
  getSheet('Questions');
  Logger.log('✅ All sheets created successfully!');
}
