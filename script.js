// ==================== بيانات اللاعبين ====================
let players = [];

// ==================== متغيرات اللعبة ====================
let currentPlayer = {};
let currentInfoIndex = 0;
let score = 0;
let cash = 100;
let streak = 0;
let bestStreak = 0;
let usedPlayerIndices = [];
let totalXp = 0;
let powerupsUsedCount = 0;
let questionTimer;
let timeLeft = 20;

// ==================== متغيرات الأوضاع الخاصة ====================
let gameMode = 'normal';
let bossMode = {
    active: false,
    stage: 1,
    bosses: [
        { name: "المرحلة 1: أساطير الستينات", players: ["بيليه", "أوزيبيو", "يوهان كرويف"] },
        { name: "المرحلة 2: أساطير الثمانينات", players: ["مارادونا", "بلاتيني", "رومينيغه"] },
        { name: "المرحلة 3: أساطير التسعينات", players: ["رونالدو", "زيدان", "باجيو"] },
        { name: "المرحلة 4: الأساطير الحديثة", players: ["ميسي", "رونالدو", "مودريتش"] }
    ]
};

let blindMode = {
    active: false,
    hints: 3
};

// ==================== نظام الأندية ====================
let clubs = {
    "ريال مدريد": { points: 0, fans: 0, color: "#FFFFFF" },
    "برشلونة": { points: 0, fans: 0, color: "#A50044" },
    "ليفربول": { points: 0, fans: 0, color: "#C8102E" },
    "مانشستر سيتي": { points: 0, fans: 0, color: "#6CABDD" },
    "بايرن ميونخ": { points: 0, fans: 0, color: "#DC052D" },
    "ميلان": { points: 0, fans: 0, color: "#FB090B" },
    "إنتر": { points: 0, fans: 0, color: "#0054A5" },
    "يوفنتوس": { points: 0, fans: 0, color: "#000000" },
    "أياكس": { points: 0, fans: 0, color: "#DD2E2E" },
    "تشيلسي": { points: 0, fans: 0, color: "#034694" }
};

// ==================== نظام الصعوبات ====================
const DIFFICULTY = {
    easy: { name: 'سهل', time: 30, pointsMultiplier: 1, cashMultiplier: 1, infoCount: 1, wrongPenalty: 0 },
    medium: { name: 'متوسط', time: 20, pointsMultiplier: 1.5, cashMultiplier: 1.2, infoCount: 2, wrongPenalty: 2 },
    hard: { name: 'صعب', time: 15, pointsMultiplier: 2, cashMultiplier: 1.5, infoCount: 3, wrongPenalty: 5 },
    expert: { name: 'خبير', time: 10, pointsMultiplier: 3, cashMultiplier: 2, infoCount: 4, wrongPenalty: 10 },
    legend: { name: 'أسطورة', time: 8, pointsMultiplier: 5, cashMultiplier: 3, infoCount: 5, wrongPenalty: 20 }
};

let currentDifficulty = 'medium';
let difficultyLevel = DIFFICULTY[currentDifficulty];

// ==================== نظام المستويات ====================
const LEVELS = [
    { name: "برونزي", minXp: 0, multiplier: 1, star: "🥉" },
    { name: "فضي", minXp: 500, multiplier: 1.2, star: "🥈" },
    { name: "ذهبي", minXp: 1500, multiplier: 1.5, star: "🥇" },
    { name: "بلاتيني", minXp: 3000, multiplier: 1.8, star: "💎" },
    { name: "أسطوري", minXp: 5000, multiplier: 2, star: "👑" }
];

// ==================== نظام الإنجازات ====================
let achievements = JSON.parse(localStorage.getItem('achievements') || '[]');

// ==================== سوق الانتقالات ====================
let playerMarket = [
    { name: "بيليه", price: 5000, rating: 99, sold: false },
    { name: "مارادونا", price: 5000, rating: 99, sold: false },
    { name: "ميسي 2012", price: 4000, rating: 98, sold: false },
    { name: "رونالدو 2014", price: 4000, rating: 98, sold: false },
    { name: "زيدان 1998", price: 3500, rating: 97, sold: false },
    { name: "رونالدو 2002", price: 3500, rating: 97, sold: false },
    { name: "صلاح 2018", price: 2000, rating: 95, sold: false },
    { name: "مبابي 2022", price: 2500, rating: 96, sold: false },
    { name: "هالاند 2023", price: 2200, rating: 95, sold: false },
    { name: "نيمار 2015", price: 1800, rating: 94, sold: false }
];

let myCollection = JSON.parse(localStorage.getItem('myCollection') || '[]');

// ==================== قاعة المشاهير ====================
let hallOfFame = JSON.parse(localStorage.getItem('hallOfFame') || '[]');

// ==================== إعدادات الصوت ====================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let isSoundMuted = false;
let isVibrationMuted = false;

// ==================== عناصر DOM ====================
const startScreen = document.getElementById('start-screen');
const gameContainer = document.getElementById('game-container');
const endScreen = document.getElementById('end-screen');
const settingsModal = document.getElementById('settings-modal');
const leaderboardModal = document.getElementById('leaderboard-modal');
const hallOfFameModal = document.getElementById('hall-of-fame-modal');
const collectionModal = document.getElementById('collection-modal');
const loadingSpinner = document.getElementById('loading-spinner');

const playBtn = document.getElementById('play-btn');
const settingsBtn = document.getElementById('settings-btn');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const closeLeaderboardBtn = document.getElementById('close-leaderboard-btn');
const closeHallOfFameBtn = document.getElementById('close-hall-of-fame-btn');
const closeCollectionBtn = document.getElementById('close-collection-btn');
const openMarketBtn = document.getElementById('open-market-btn');

const soundToggle = document.getElementById('sound-toggle');
const vibrationToggle = document.getElementById('vibration-toggle');
const themeSelect = document.getElementById('theme-select');
const resetGameDataBtn = document.getElementById('reset-game-data');

const scoreDisplay = document.getElementById('score-display');
const cashDisplay = document.getElementById('game-cash-display');
const cashDisplayStart = document.getElementById('cash-display');
const highscoreDisplay = document.getElementById('highscore-display');
const potentialPointsDisplay = document.getElementById('potential-points-display');
const infoBox = document.getElementById('info-box');
const choicesEl = document.getElementById('choices');
const resultOverlay = document.getElementById('result-overlay');
const resultText = document.getElementById('result-text');
const timerBar = document.getElementById('timer-bar');
const streakDisplay = document.getElementById('streak-display');
const playerLevelText = document.getElementById('player-level-text');
const xpProgressBar = document.getElementById('xp-progress-bar');
const xpProgressText = document.getElementById('xp-progress-text');
const xpBarFill = document.getElementById('xp-bar-fill');
const levelBadge = document.getElementById('level-badge');

const finalScoreDisplay = document.getElementById('final-score-display');
const finalCashDisplay = document.getElementById('final-cash-display');
const finalStreakDisplay = document.getElementById('final-streak-display');
const finalBestStreakDisplay = document.getElementById('final-best-streak-display');
const finalXpDisplay = document.getElementById('final-xp-display');
const finalLevelDisplay = document.getElementById('final-level-display');
const finalPowerupsUsedDisplay = document.getElementById('final-powerups-used-count');

const restartBtn = document.getElementById('restart-btn');
const shareBtn = document.getElementById('share-btn');
const backToMenuBtnGame = document.getElementById('back-to-menu-btn-game');
const backToMenuBtnEnd = document.getElementById('back-to-menu-btn-end');

const nextInfoBtn = document.getElementById('next-info-btn');
const powerup5050 = document.getElementById('powerup-5050');
const powerupNation = document.getElementById('powerup-nation');
const powerupClub = document.getElementById('powerup-club');
const powerupHint = document.getElementById('powerup-hint');
const powerupSwap = document.getElementById('powerup-swap');
const powerupBlindHint = document.getElementById('powerup-blind-hint');

const normalModeBtn = document.getElementById('normal-mode-btn');
const challengeModeBtn = document.getElementById('challenge-mode-btn');
const bossModeBtn = document.getElementById('boss-mode-btn');
const blindModeBtn = document.getElementById('blind-mode-btn');
const challengeTimerContainer = document.getElementById('challenge-timer-container');
const challengeTimerDisplay = document.getElementById('challenge-timer');

const claimGiftBtn = document.getElementById('claim-gift-btn');
const playerImageContainer = document.getElementById('playerImageContainer');
const playerImage = document.getElementById('playerImage');
const clubStandings = document.getElementById('club-standings');
const achievementUnlock = document.getElementById('achievement-unlock');
const achievementName = document.getElementById('achievement-name');

// ==================== دوال الصوت والاهتزاز ====================
function playSound(type) {
    if (!audioCtx || isSoundMuted) return;
    try {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        switch (type) {
            case 'correct':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
                break;
            case 'wrong':
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
                break;
            case 'click':
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
                break;
            case 'powerup':
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
                break;
            case 'levelUp':
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(1500, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
                break;
            case 'achievement':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
                break;
            default:
                return;
        }

        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
        console.log('Sound error:', e);
    }
}

function vibrate(duration) {
    if (isVibrationMuted) return;
    if (navigator.vibrate) {
        navigator.vibrate(duration);
    }
}

// ==================== دوال التحميل ====================
function showLoading(show) {
    if (loadingSpinner) {
        loadingSpinner.classList.toggle('hidden', !show);
    }
}

async function loadPlayersData() {
    showLoading(true);
    try {
        const response = await fetch('players.json');
        if (!response.ok) throw new Error('فشل تحميل الملف');
        players = await response.json();
        console.log('✅ تم تحميل', players.length, 'لاعب');
    } catch (error) {
        console.error('❌ خطأ في تحميل البيانات:', error);
        players = getBackupPlayers();
    } finally {
        showLoading(false);
        initGame();
    }
}

function getBackupPlayers() {
    return [
        { name: "ليونيل ميسي", infos: ["فزت بالكرة الذهبية 8 مرات"], nationality: "الأرجنتين", mainClub: "برشلونة", difficulty: "medium", rating: 99 },
        { name: "كريستيانو رونالدو", infos: ["فزت بدوري أبطال أوروبا 5 مرات"], nationality: "البرتغال", mainClub: "ريال مدريد", difficulty: "medium", rating: 99 },
        { name: "محمد صلاح", infos: ["فزت بالحذاء الذهبي 3 مرات"], nationality: "مصر", mainClub: "ليفربول", difficulty: "easy", rating: 95 }
    ];
}

// ==================== دالة تغيير الصعوبة ====================
function setDifficulty(level) {
    currentDifficulty = level;
    difficultyLevel = DIFFICULTY[level];
    
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.difficulty === level) {
            btn.classList.add('active');
        }
    });
    
    localStorage.setItem('preferredDifficulty', level);
    playSound('click');
}

// ==================== دوال المستويات ====================
function getCurrentLevel(xp) {
    return LEVELS.filter(level => xp >= level.minXp).pop() || LEVELS[0];
}

function updatePlayerLevel() {
    const currentLevel = getCurrentLevel(totalXp);
    const previousLevel = localStorage.getItem('currentLevel');
    if (previousLevel && previousLevel !== currentLevel.name) {
        playSound('levelUp');
        showAchievement(`🎊 ترقية! وصلت لمستوى ${currentLevel.name} ${currentLevel.star}`);
    }
    localStorage.setItem('currentLevel', currentLevel.name);
}

// ==================== دوال الإنجازات ====================
function checkAchievements() {
    let newAchievement = null;
    
    if (!achievements.includes('firstWin') && score > 0) {
        achievements.push('firstWin');
        cash += 100;
        newAchievement = '🏆 أول فوز +100 كاش';
    }
    
    if (!achievements.includes('streak5') && streak >= 5) {
        achievements.push('streak5');
        cash += 200;
        newAchievement = '🔥 5 إجابات متتالية +200 كاش';
    }
    
    if (!achievements.includes('streak10') && streak >= 10) {
        achievements.push('streak10');
        cash += 500;
        newAchievement = '⚡ 10 إجابات متتالية +500 كاش';
    }
    
    if (!achievements.includes('cash1000') && cash >= 1000) {
        achievements.push('cash1000');
        cash += 200;
        newAchievement = '💰 مليونير +200 كاش';
    }
    
    if (!achievements.includes('xp5000') && totalXp >= 5000) {
        achievements.push('xp5000');
        cash += 1000;
        newAchievement = '👑 أسطورة حقيقية +1000 كاش';
    }
    
    if (newAchievement) {
        playSound('achievement');
        showAchievement(newAchievement);
        localStorage.setItem('achievements', JSON.stringify(achievements));
    }
}

function showAchievement(text) {
    achievementName.textContent = text;
    achievementUnlock.classList.remove('hidden');
    setTimeout(() => achievementUnlock.classList.add('hidden'), 3000);
}

// ==================== دوال قاعة المشاهير ====================
function addToHallOfFame() {
    let playerName = prompt("ادخل اسمك لدخول قاعة المشاهير:");
    if (!playerName) playerName = "لاعب";
    
    hallOfFame.push({
        name: playerName,
        score: score,
        level: getCurrentLevel(totalXp).name,
        date: new Date().toLocaleDateString()
    });
    
    hallOfFame.sort((a, b) => b.score - a.score);
    hallOfFame = hallOfFame.slice(0, 10);
    
    localStorage.setItem('hallOfFame', JSON.stringify(hallOfFame));
    displayHallOfFame();
}

function displayHallOfFame() {
    let html = '<h3>🏆 أفضل 10 لاعبين</h3>';
    hallOfFame.forEach((entry, index) => {
        let medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📋';
        html += `<div style="padding: 8px; margin: 5px 0; background: rgba(255,255,255,0.1); border-radius: 8px;">
            ${medal} ${entry.name} - ${entry.score} نقطة (${entry.level})
        </div>`;
    });
    document.getElementById('hall-of-fame-content').innerHTML = html;
}

// ==================== دوال مجموعتي وسوق الانتقالات ====================
function displayCollection() {
    let html = '<h3>📚 مجموعتي</h3>';
    if (myCollection.length === 0) {
        html += '<p>لا تملك أي لاعب بعد. اذهب للسوق!</p>';
    } else {
        myCollection.forEach((item, index) => {
            html += `<div style="padding: 8px; margin: 5px 0; background: rgba(255,255,255,0.1); border-radius: 8px;">
                ⭐ ${item.name} | تقييم: ${item.rating} | سعر الشراء: ${item.price}
            </div>`;
        });
    }
    document.getElementById('collection-content').innerHTML = html;
}

function openMarket() {
    let marketHtml = '<h3>🏪 سوق الانتقالات</h3>';
    playerMarket.forEach((player, index) => {
        if (!player.sold) {
            marketHtml += `<div style="padding: 10px; margin: 5px 0; background: rgba(255,255,255,0.1); border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>⭐ ${player.name} (تقييم: ${player.rating})</span>
                    <span>💰 ${player.price}</span>
                    <button onclick="buyPlayer(${index})" class="market-buy-btn" style="background: gold; color: black; border: none; padding: 5px 10px; border-radius: 5px;">شراء</button>
                </div>
            </div>`;
        }
    });
    
    let marketDiv = document.createElement('div');
    marketDiv.className = 'modal-content';
    marketDiv.innerHTML = marketHtml;
    marketDiv.querySelectorAll('.market-buy-btn').forEach(btn => btn.onclick = btn.onclick);
    
    let marketModal = document.createElement('div');
    marketModal.className = 'modal-overlay';
    marketModal.id = 'market-modal';
    marketModal.appendChild(marketDiv);
    document.body.appendChild(marketModal);
}

window.buyPlayer = function(index) {
    let player = playerMarket[index];
    if (cash >= player.price && !player.sold) {
        cash -= player.price;
        player.sold = true;
        myCollection.push({ name: player.name, rating: player.rating, price: player.price });
        localStorage.setItem('myCollection', JSON.stringify(myCollection));
        alert(`✅ اشتريت ${player.name} بنجاح!`);
        updateUI();
        displayCollection();
        document.getElementById('market-modal').remove();
    } else if (player.sold) {
        alert('❌ هذا اللاعب تم بيعه بالفعل');
    } else {
        alert('💰 الكاش غير كافي');
    }
};

// ==================== دوال تحديث ترتيب الأندية ====================
function updateClubStandings(player) {
    if (player && player.mainClub && clubs[player.mainClub]) {
        clubs[player.mainClub].points += 10;
        clubs[player.mainClub].fans++;
    }
    
    let sorted = Object.entries(clubs).sort((a, b) => b[1].points - a[1].points);
    let html = '<h4>🏆 ترتيب الأندية</h4>';
    sorted.slice(0, 5).forEach(([club, data]) => {
        html += `<div style="color: ${data.color}; margin: 3px 0;">
            ${club}: ${data.points} نقطة (${data.fans} لاعب)
        </div>`;
    });
    
    clubStandings.innerHTML = html;
    clubStandings.classList.remove('hidden');
}

// ==================== دوال الهدية اليومية ====================
function checkDailyGift() {
    let lastGift = localStorage.getItem('lastGiftDate');
    let today = new Date().toDateString();
    
    if (lastGift !== today) {
        claimGiftBtn.disabled = false;
        claimGiftBtn.textContent = '🎁 هدية اليوم متاحة!';
    } else {
        claimGiftBtn.disabled = true;
        claimGiftBtn.textContent = '🎁 عد غداً للهدية';
    }
}

claimGiftBtn.addEventListener('click', function() {
    let gifts = [
        { type: 'cash', amount: 50 },
        { type: 'cash', amount: 100 },
        { type: 'cash', amount: 150 },
        { type: 'xp', amount: 100 },
        { type: 'xp', amount: 200 }
    ];
    
    let gift = gifts[Math.floor(Math.random() * gifts.length)];
    
    if (gift.type === 'cash') {
        cash += gift.amount;
        alert(`🎁 هدية اليوم: ${gift.amount} كاش!`);
    } else {
        totalXp += gift.amount;
        alert(`🎁 هدية اليوم: ${gift.amount} XP!`);
    }
    
    localStorage.setItem('lastGiftDate', new Date().toDateString());
    updateUI();
    saveGame();
    checkDailyGift();
});

// ==================== دوال الثيمات ====================
function applyTheme(theme) {
    const themes = {
        classic: { bg: "#141E30", accent: "#F7B733", text: "#FFFFFF" },
        dark: { bg: "#0a0f1e", accent: "#00ff00", text: "#00ff00" },
        red: { bg: "#8b0000", accent: "#ffd700", text: "#ffffff" },
        blue: { bg: "#00008b", accent: "#87ceeb", text: "#ffffff" },
        gold: { bg: "#4a3c1a", accent: "#ffd700", text: "#ffd700" }
    };
    
    let t = themes[theme] || themes.classic;
    document.documentElement.style.setProperty('--bg-color', t.bg);
    document.documentElement.style.setProperty('--accent-color', t.accent);
    document.documentElement.style.setProperty('--text-color', t.text);
    localStorage.setItem('preferredTheme', theme);
}

// ==================== دوال مشاركة النتيجة ====================
shareBtn.addEventListener('click', function() {
    let text = `🎮 لعبة اعرف اللاعب\n🏆 نتيجتي: ${score}\n💰 الكاش: ${cash}\n🔥 أطول سلسلة: ${bestStreak}\n⭐ المستوى: ${getCurrentLevel(totalXp).name}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'نتيجتي في لعبة اعرف اللاعب',
            text: text
        });
    } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
    }
});

// ==================== دوال بدء اللعبة الأساسية ====================
function initGame() {
    loadGame();
    startScreen.classList.remove('hidden');
    gameContainer.classList.add('hidden');
    endScreen.classList.add('hidden');
    checkDailyGift();
    displayHallOfFame();
    displayCollection();
    updateUI();
}

function startGame() {
    if (!players || players.length === 0) {
        alert('⚠️ لم يتم تحميل البيانات بعد، انتظر قليلاً');
        return;
    }
    
    score = 0;
    streak = 0;
    usedPlayerIndices = [];
    powerupsUsedCount = 0;
    
    if (gameMode === 'challenge') {
        cash = 50;
        startChallengeMode();
    } else if (gameMode === 'boss') {
        cash = 100;
        bossMode.active = true;
        bossMode.stage = 1;
        alert(`🔥 معركة النجوم: ${bossMode.bosses[0].name}`);
    } else if (gameMode === 'blind') {
        cash = 100;
        blindMode.active = true;
        blindMode.hints = 3;
        playerImageContainer.style.display = 'block';
        infoBox.style.display = 'none';
        alert('🕶️ الوضع الأعمى: خمن اللاعب من الصورة فقط! لديك 3 تلميحات');
    } else {
        cash = 100;
    }
    
    startScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    endScreen.classList.add('hidden');
    loadQuestion();
    updateUI();
}

function loadQuestion() {
    clearTimeout(questionTimer);
    if (timerBar) timerBar.style.width = '100%';
    timeLeft = difficultyLevel.time;
    
    let availablePlayers;
    
    if (bossMode.active) {
        let stage = bossMode.bosses[bossMode.stage - 1];
        availablePlayers = players.filter(p => stage.players.includes(p.name));
        if (availablePlayers.length === 0) {
            if (bossMode.stage < bossMode.bosses.length) {
                bossMode.stage++;
                alert(`🎉 انتقلت للمرحلة ${bossMode.stage}: ${bossMode.bosses[bossMode.stage-1].name}`);
                availablePlayers = players.filter(p => bossMode.bosses[bossMode.stage-1].players.includes(p.name));
            } else {
                alert('🏆 أكملت معركة النجوم!');
                endGame();
                return;
            }
        }
    } else {
        availablePlayers = players.filter((_, index) => !usedPlayerIndices.includes(index));
    }
    
    if (availablePlayers.length === 0) {
        usedPlayerIndices = [];
        availablePlayers = players;
    }

    const randomIndex = Math.floor(Math.random() * availablePlayers.length);
    currentPlayer = availablePlayers[randomIndex];
    usedPlayerIndices.push(players.indexOf(currentPlayer));

    currentInfoIndex = 0;
    
    if (blindMode.active) {
        playerImage.src = currentPlayer.image || 'default.jpg';
        playerImageContainer.style.display = 'block';
        infoBox.style.display = 'none';
    } else {
        playerImageContainer.style.display = 'none';
        infoBox.style.display = 'block';
        infoBox.innerHTML = '';
        for (let i = 0; i < difficultyLevel.infoCount; i++) {
            if (i < currentPlayer.infos.length) {
                displayInfo(currentPlayer.infos[i]);
            }
        }
    }
    
    createChoices();
    updateUI();
    startQuestionTimer();

    document.querySelectorAll('.powerup-btn').forEach(btn => btn.disabled = false);
}

function displayInfo(infoText) {
    const info = document.createElement('p');
    info.textContent = `• ${infoText}`;
    infoBox.appendChild(info);
}

function createChoices() {
    let choices = [currentPlayer.name];
    let otherPlayers = players.filter(p => p.name !== currentPlayer.name);
    
    while (choices.length < 4 && otherPlayers.length > 0) {
        let randomIndex = Math.floor(Math.random() * otherPlayers.length);
        let decoy = otherPlayers.splice(randomIndex, 1)[0].name;
        if (!choices.includes(decoy)) {
            choices.push(decoy);
        }
    }

    choices.sort(() => Math.random() - 0.5);

    if (choicesEl) {
        choicesEl.innerHTML = '';
        choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.textContent = choice;
            button.onclick = () => checkAnswer(choice);
            choicesEl.appendChild(button);
        });
    }
}

function checkAnswer(selectedAnswer) {
    clearTimeout(questionTimer);
    let timeSpent = difficultyLevel.time - timeLeft;
    
    if (selectedAnswer === currentPlayer.name) {
        playSound('correct');
        vibrate(100);
        
        let infoBonus = (difficultyLevel.infoCount - currentInfoIndex) * 10;
        let timeBonus = Math.floor((timeLeft / difficultyLevel.time) * 20);
        let streakBonus = Math.floor(streak / 3) * 5;
        
        let pointsEarned = Math.floor((10 + infoBonus + timeBonus + streakBonus) * difficultyLevel.pointsMultiplier);
        
        score += pointsEarned;
        cash += Math.floor(5 * difficultyLevel.cashMultiplier);
        streak++;
        
        if (streak > bestStreak) bestStreak = streak;
        
        totalXp += XP_PER_CORRECT_ANSWER * difficultyLevel.pointsMultiplier;
        updatePlayerLevel();
        
        // تحديث ترتيب الأندية
        updateClubStandings(currentPlayer);
        
        resultText.textContent = `✅ صحيح! +${pointsEarned} نقطة`;
        resultText.style.color = difficultyLevel.color || '#28a745';
        
        if (bossMode.active && streak >= 3) {
            bossMode.stage++;
            alert(`🎉 انتقلت للمرحلة ${bossMode.stage}`);
        }
        
        checkAchievements();
    } else {
        playSound('wrong');
        vibrate(200);
        streak = 0;
        cash = Math.max(0, cash - difficultyLevel.wrongPenalty);
        
        resultText.textContent = `❌ خطأ! اللاعب هو ${currentPlayer.name}`;
        resultText.style.color = '#dc3545';
        
        if (bossMode.active) {
            bossMode.active = false;
            alert('💔 خسرت معركة النجوم');
        }
        
        if (blindMode.active) {
            blindMode.active = false;
            playerImageContainer.style.display = 'none';
            infoBox.style.display = 'block';
        }
    }
    
    showResult();
    updateUI();
    saveGame();
}

function showResult() {
    resultOverlay.classList.remove('hidden');
    setTimeout(() => {
        resultOverlay.classList.add('hidden');
        loadQuestion();
    }, 1500);
}

function startQuestionTimer() {
    timeLeft = difficultyLevel.time;
    if (timerBar) timerBar.style.width = '100%';
    
    questionTimer = setInterval(() => {
        timeLeft--;
        if (timerBar) {
            timerBar.style.width = `${(timeLeft / difficultyLevel.time) * 100}%`;
        }
        
        if (timeLeft <= 0) {
            clearInterval(questionTimer);
            checkAnswer('');
        }
    }, 1000);
}

function startChallengeMode() {
    let challengeTime = 60;
    challengeTimerContainer.classList.remove('hidden');
    
    let challengeTimer = setInterval(() => {
        challengeTime--;
        challengeTimerDisplay.textContent = challengeTime;
        
        if (challengeTime <= 0) {
            clearInterval(challengeTimer);
            challengeTimerContainer.classList.add('hidden');
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearTimeout(questionTimer);
    gameContainer.classList.add('hidden');
    endScreen.classList.remove('hidden');
    
    finalScoreDisplay.textContent = score;
    finalCashDisplay.textContent = cash;
    finalStreakDisplay.textContent = streak;
    finalBestStreakDisplay.textContent = bestStreak;
    finalXpDisplay.textContent = totalXp;
    finalLevelDisplay.textContent = getCurrentLevel(totalXp).name;
    finalPowerupsUsedDisplay.textContent = powerupsUsedCount;
    
    let currentHighscore = parseInt(localStorage.getItem('highscore') || '0');
    if (score > currentHighscore) {
        localStorage.setItem('highscore', score);
        highscoreDisplay.textContent = score;
        alert('🏆 رقم قياسي جديد!');
    }
    
    if (score > 0) {
        addToHallOfFame();
    }
    
    if (bossMode.active) bossMode.active = false;
    if (blindMode.active) {
        blindMode.active = false;
        playerImageContainer.style.display = 'none';
        infoBox.style.display = 'block';
    }
    
    saveGame();
}

// ==================== دوال تحديث الواجهة ====================
function updateUI() {
    if (scoreDisplay) scoreDisplay.textContent = score;
    if (cashDisplay) cashDisplay.textContent = cash;
    if (cashDisplayStart) cashDisplayStart.textContent = cash;
    if (streakDisplay) streakDisplay.textContent = `🔥 ${streak}`;
    
    let currentLevel = getCurrentLevel(totalXp);
    if (playerLevelText) playerLevelText.textContent = `${currentLevel.name} ${currentLevel.star}`;
    if (levelBadge) levelBadge.textContent = currentLevel.name;
    
    let nextLevel = LEVELS[LEVELS.indexOf(currentLevel) + 1];
    if (nextLevel) {
        let xpNeeded = nextLevel.minXp - currentLevel.minXp;
        let xpIntoCurrent = totalXp - currentLevel.minXp;
        let progress = (xpIntoCurrent / xpNeeded) * 100;
        if (xpProgressBar) xpProgressBar.style.width = `${progress}%`;
        if (xpBarFill) xpBarFill.style.width = `${progress}%`;
        if (xpProgressText) xpProgressText.textContent = `${xpIntoCurrent}/${xpNeeded} XP`;
    } else {
        if (xpProgressBar) xpProgressBar.style.width = '100%';
        if (xpBarFill) xpBarFill.style.width = '100%';
        if (xpProgressText) xpProgressText.textContent = 'أقصى مستوى!';
    }
    
    let highscore = Math.max(score, parseInt(localStorage.getItem('highscore') || '0'));
    if (highscoreDisplay) highscoreDisplay.textContent = highscore;
    
    // تحديث أسعار الـ power-ups
    document.getElementById('powerup-5050-cost').textContent = '15';
    document.getElementById('powerup-nation-cost').textContent = '20';
    document.getElementById('powerup-club-cost').textContent = '25';
    document.getElementById('powerup-hint-cost').textContent = '30';
    document.getElementById('powerup-swap-cost').textContent = '35';
    document.getElementById('powerup-blind-cost').textContent = '40';
}

// ==================== دوال حفظ وتحميل اللعبة ====================
function saveGame() {
    localStorage.setItem('score', score);
    localStorage.setItem('cash', cash);
    localStorage.setItem('bestStreak', bestStreak);
    localStorage.setItem('totalXp', totalXp);
}

function loadGame() {
    score = parseInt(localStorage.getItem('score') || '0');
    cash = parseInt(localStorage.getItem('cash') || '100');
    bestStreak = parseInt(localStorage.getItem('bestStreak') || '0');
    totalXp = parseInt(localStorage.getItem('totalXp') || '0');
}

// ==================== دوال الـ Power-ups ====================
function activatePowerup(btn, cost, action) {
    if (cash >= cost) {
        cash -= cost;
        powerupsUsedCount++;
        playSound('powerup');
        vibrate(50);
        
        btn.classList.add('powerup-active');
        setTimeout(() => btn.classList.remove('powerup-active'), 500);
        
        btn.disabled = true;
        action();
    } else {
        playSound('fail');
        vibrate(100);
        alert('💰 الكاش غير كافي');
    }
    updateUI();
    saveGame();
}

powerup5050.addEventListener('click', () => {
    activatePowerup(powerup5050, 15, () => {
        let buttons = Array.from(document.querySelectorAll('.choice-btn'));
        let wrongAnswers = buttons.filter(b => b.textContent !== currentPlayer.name);
        let toRemove = Math.min(2, wrongAnswers.length);
        
        for (let i = 0; i < toRemove; i++) {
            if (wrongAnswers[i]) {
                wrongAnswers[i].style.opacity = '0.3';
                wrongAnswers[i].disabled = true;
            }
        }
    });
});

powerupNation.addEventListener('click', () => {
    activatePowerup(powerupNation, 20, () => {
        if (blindMode.active) {
            alert(`🌍 جنسية اللاعب: ${currentPlayer.nationality}`);
        } else {
            displayInfo(`🌍 الجنسية: ${currentPlayer.nationality}`);
        }
    });
});

powerupClub.addEventListener('click', () => {
    activatePowerup(powerupClub, 25, () => {
        if (blindMode.active) {
            alert(`👕 النادي: ${currentPlayer.mainClub}`);
        } else {
            displayInfo(`👕 النادي: ${currentPlayer.mainClub}`);
        }
    });
});

powerupHint.addEventListener('click', () => {
    activatePowerup(powerupHint, 30, () => {
        if (blindMode.active) {
            alert(`🔤 أول حرف: ${currentPlayer.name[0]}`);
        } else {
            displayInfo(`🔤 أول حرف: ${currentPlayer.name[0]}`);
        }
    });
});

powerupSwap.addEventListener('click', () => {
    activatePowerup(powerupSwap, 35, () => {
        usedPlayerIndices.push(players.indexOf(currentPlayer));
        loadQuestion();
        if (blindMode.active) {
            alert(`🔄 تم تبديل اللاعب!`);
        } else {
            displayInfo(`🔄 تم تبديل اللاعب!`);
        }
    });
});

powerupBlindHint.addEventListener('click', () => {
    if (!blindMode.active) {
        alert('هذا الـ power-up يعمل فقط في الوضع الأعمى');
        return;
    }
    
    activatePowerup(powerupBlindHint, 40, () => {
        let hints = [
            `الجنسية: ${currentPlayer.nationality}`,
            `النادي: ${currentPlayer.mainClub}`,
            `أول حرف: ${currentPlayer.name[0]}`,
            `عدد الحروف: ${currentPlayer.name.length}`,
            `التقييم: ${currentPlayer.rating || '?'}`
        ];
        let hint = hints[Math.floor(Math.random() * hints.length)];
        alert(`🔍 تلميح: ${hint}`);
    });
});

// ==================== أحداث الأزرار ====================
playBtn.addEventListener('click', () => {
    playSound('click');
    startGame();
});

nextInfoBtn.addEventListener('click', () => {
    if (currentInfoIndex < currentPlayer.infos.length - 1) {
        currentInfoIndex++;
        displayInfo(currentPlayer.infos[currentInfoIndex]);
        if (currentInfoIndex >= currentPlayer.infos.length - 1) {
            nextInfoBtn.disabled = true;
        }
    }
});

settingsBtn.addEventListener('click', () => {
    playSound('click');
    settingsModal.classList.remove('hidden');
});

leaderboardBtn.addEventListener('click', () => {
    playSound('click');
    displayHallOfFame();
    hallOfFameModal.classList.remove('hidden');
});

openMarketBtn.addEventListener('click', () => {
    openMarket();
});

closeSettingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
});

closeLeaderboardBtn.addEventListener('click', () => {
    leaderboardModal.classList.add('hidden');
});

closeHallOfFameBtn.addEventListener('click', () => {
    hallOfFameModal.classList.add('hidden');
});

closeCollectionBtn.addEventListener('click', () => {
    collectionModal.classList.add('hidden');
});

backToMenuBtnGame.addEventListener('click', () => {
    playSound('click');
    clearTimeout(questionTimer);
    gameContainer.classList.add('hidden');
    startScreen.classList.remove('hidden');
    if (blindMode.active) {
        blindMode.active = false;
        playerImageContainer.style.display = 'none';
        infoBox.style.display = 'block';
    }
    if (bossMode.active) bossMode.active = false;
});

backToMenuBtnEnd.addEventListener('click', () => {
    playSound('click');
    endScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
});

restartBtn.addEventListener('click', () => {
    playSound('click');
    startGame();
});

soundToggle.addEventListener('change', (e) => {
    isSoundMuted = !e.target.checked;
});

vibrationToggle.addEventListener('change', (e) => {
    isVibrationMuted = !e.target.checked;
});

themeSelect.addEventListener('change', (e) => {
    applyTheme(e.target.value);
});

resetGameDataBtn.addEventListener('click', () => {
    if (confirm('هل أنت متأكد من حذف كل البيانات؟')) {
        localStorage.clear();
        alert('✅ تم إعادة تعيين البيانات');
        location.reload();
    }
});

normalModeBtn.addEventListener('click', () => {
    gameMode = 'normal';
    normalModeBtn.classList.add('active');
    challengeModeBtn.classList.remove('active');
    bossModeBtn.classList.remove('active');
    blindModeBtn.classList.remove('active');
});

challengeModeBtn.addEventListener('click', () => {
    gameMode = 'challenge';
    challengeModeBtn.classList.add('active');
    normalModeBtn.classList.remove('active');
    bossModeBtn.classList.remove('active');
    blindModeBtn.classList.remove('active');
});

bossModeBtn.addEventListener('click', () => {
    gameMode = 'boss';
    bossModeBtn.classList.add('active');
    normalModeBtn.classList.remove('active');
    challengeModeBtn.classList.remove('active');
    blindModeBtn.classList.remove('active');
});

blindModeBtn.addEventListener('click', () => {
    gameMode = 'blind';
    blindModeBtn.classList.add('active');
    normalModeBtn.classList.remove('active');
    challengeModeBtn.classList.remove('active');
    bossModeBtn.classList.remove('active');
});

document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        setDifficulty(e.target.dataset.difficulty);
    });
});

// ==================== إعدادات أولية ====================
const savedDifficulty = localStorage.getItem('preferredDifficulty');
if (savedDifficulty) {
    setDifficulty(savedDifficulty);
}

const savedTheme = localStorage.getItem('preferredTheme');
if (savedTheme) {
    applyTheme(savedTheme);
    themeSelect.value = savedTheme;
}

// ==================== بدء التحميل ====================
window.onload = function() {
    loadPlayersData();
    checkDailyGift();
    displayHallOfFame();
    displayCollection();
};
