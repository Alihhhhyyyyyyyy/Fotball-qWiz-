// بيانات اللاعبين
let players = [
    {
        id: 1,
        name: "ليونيل ميسي",
        image: "images/messi.jpg",
        club: "إنتر ميامي",
        nationality: "الأرجنتين",
        position: "مهاجم",
        level: 1
    },
    {
        id: 2,
        name: "كريستيانو رونالدو",
        image: "images/ronaldo.jpg",
        club: "النصر",
        nationality: "البرتغال",
        position: "مهاجم",
        level: 1
    },
    {
        id: 3,
        name: "كيليان مبابي",
        image: "images/mbappe.jpg",
        club: "باريس سان جيرمان",
        nationality: "فرنسا",
        position: "مهاجم",
        level: 1
    },
    {
        id: 4,
        name: "إيرلينغ هالاند",
        image: "images/haaland.jpg",
        club: "مانشستر سيتي",
        nationality: "النرويج",
        position: "مهاجم",
        level: 1
    },
    {
        id: 5,
        name: "محمد صلاح",
        image: "images/salah.jpg",
        club: "ليفربول",
        nationality: "مصر",
        position: "جناح",
        level: 2
    },
    {
        id: 6,
        name: "نيمار جونيور",
        image: "images/neymar.jpg",
        club: "الهلال",
        nationality: "البرازيل",
        position: "جناح",
        level: 2
    }
];

// متغيرات اللعبة
let currentScreen = 'splash';
let currentPlayer = null;
let score = 0;
let streak = 0;
let currentLevel = 1;
let hintsUsed = 0;
let coins = 0;
let timerInterval = null;
let timeLeft = 15;
let soundsEnabled = true;
let darkMode = false;
const totalLevels = 20;
const maxHints = 10;

// إحصائيات
let stats = {
    correctAnswers: 0,
    totalScore: 0,
    maxStreak: 0,
    hintsUsed: 0,
    maxLevel: 1,
    unlockedAchievements: []
};

// الإنجازات
const achievements = [
    {
        id: 1,
        name: "بداية قوية",
        desc: "احصل على أول إجابة صحيحة",
        icon: "🎯",
        condition: (s) => s.correctAnswers >= 1,
        progress: (s) => Math.min(100, (s.correctAnswers / 1) * 100)
    },
    {
        id: 2,
        name: "سلسلة ذهبية",
        desc: "احصل على 3 إجابات متتالية",
        icon: "🔥",
        condition: (s) => s.maxStreak >= 3,
        progress: (s) => Math.min(100, (s.maxStreak / 3) * 100)
    },
    {
        id: 3,
        name: "جامع النقاط",
        desc: "اجمع 100 نقطة",
        icon: "💰",
        condition: (s) => s.totalScore >= 100,
        progress: (s) => Math.min(100, (s.totalScore / 100) * 100)
    }
];

// تهيئة اللعبة
document.addEventListener('DOMContentLoaded', () => {
    loadGameData();
    loadStats();
    
    setTimeout(() => {
        showScreen('main');
    }, 2000);
    
    document.getElementById('total-levels').textContent = totalLevels;
});

// إظهار الشاشات
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId + '-screen').classList.add('active');
    currentScreen = screenId;
    
    if (screenId === 'main') updateUI();
    else if (screenId === 'game') startLevel();
    else if (screenId === 'levels') renderLevels();
    else if (screenId === 'achievements') renderAchievements();
    else if (screenId === 'leaderboard') renderLeaderboard();
    else if (screenId === 'settings') loadSettings();
}

// تحديث الواجهة
function updateUI() {
    document.getElementById('coin-count').textContent = coins;
    document.getElementById('current-score').textContent = score;
    document.getElementById('streak-count').textContent = streak;
    document.getElementById('hint-count').textContent = maxHints - hintsUsed;
}

// العودة للرئيسية
function goBack() {
    if (currentScreen === 'game') clearTimer();
    showScreen('main');
}

// بدء اللعبة
function startGame() {
    currentLevel = 1;
    score = 0;
    streak = 0;
    hintsUsed = 0;
    coins = 0;
    showScreen('game');
}

// بدء مستوى
function startLevel() {
    clearTimer();
    
    const availablePlayers = players.filter(p => p.level <= currentLevel);
    if (availablePlayers.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * availablePlayers.length);
    currentPlayer = availablePlayers[randomIndex];
    
    const playerImage = document.getElementById('player-image');
    playerImage.style.backgroundImage = `url('${currentPlayer.image}')`;
    playerImage.classList.add('blurred');
    playerImage.classList.remove('revealed');
    
    generateOptions();
    
    document.getElementById('current-level').textContent = currentLevel;
    document.getElementById('current-score').textContent = score;
    document.getElementById('hint-display').innerHTML = '';
    document.getElementById('hint-btn').disabled = false;
    document.getElementById('hint-count').textContent = maxHints - hintsUsed;
    
    startTimer(15);
}

// إنشاء الخيارات
function generateOptions() {
    let options = [currentPlayer.name];
    const otherPlayers = players.filter(p => p.id !== currentPlayer.id);
    
    while (options.length < 4 && otherPlayers.length > 0) {
        const randomIndex = Math.floor(Math.random() * otherPlayers.length);
        const randomName = otherPlayers[randomIndex].name;
        
        if (!options.includes(randomName)) {
            options.push(randomName);
        }
        otherPlayers.splice(randomIndex, 1);
    }
    
    options = shuffleArray(options);
    
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    
    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.onclick = () => checkAnswer(option);
        container.appendChild(btn);
    });
}

// خلط المصفوفة
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// بدء المؤقت
function startTimer(seconds) {
    timeLeft = seconds;
    document.getElementById('timer-text').textContent = timeLeft;
    document.getElementById('timer-bar').style.width = '100%';
    document.getElementById('timer-bar').style.background = '#4CAF50';
    
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer-text').textContent = timeLeft;
        document.getElementById('timer-bar').style.width = (timeLeft / seconds) * 100 + '%';
        
        if (timeLeft <= 5) {
            document.getElementById('timer-bar').style.background = '#f44336';
        }
        
        if (timeLeft <= 0) {
            clearTimer();
            showResult('timeout');
        }
    }, 1000);
}

// إيقاف المؤقت
function clearTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// التحقق من الإجابة
function checkAnswer(selected) {
    clearTimer();
    
    const options = document.querySelectorAll('.option-btn');
    let pointsEarned = 0;
    
    if (selected === currentPlayer.name) {
        streak++;
        pointsEarned = 10;
        
        stats.correctAnswers++;
        stats.totalScore += pointsEarned;
        if (streak > stats.maxStreak) stats.maxStreak = streak;
        
        if (streak % 3 === 0) {
            pointsEarned += 20;
            showBonusMessage('🔥 سلسلة! +20 نقطة!');
        }
        
        score += pointsEarned;
        coins += 5;
        
        options.forEach(btn => {
            btn.disabled = true;
            btn.classList.add('disabled');
            if (btn.textContent === currentPlayer.name) btn.classList.add('correct');
        });
        
        document.getElementById('player-image').classList.remove('blurred');
        document.getElementById('player-image').classList.add('revealed');
        
        showResult('correct', pointsEarned);
    } else {
        streak = 0;
        
        options.forEach(btn => {
            btn.disabled = true;
            btn.classList.add('disabled');
            if (btn.textContent === selected) btn.classList.add('wrong');
            if (btn.textContent === currentPlayer.name) btn.classList.add('correct');
        });
        
        document.getElementById('player-image').classList.remove('blurred');
        document.getElementById('player-image').classList.add('revealed');
        
        showResult('wrong');
    }
    
    if (currentLevel > stats.maxLevel) stats.maxLevel = currentLevel;
    
    updateUI();
    checkAchievements();
    saveGameData();
    saveStats();
}

// إظهار رسالة مكافأة
function showBonusMessage(message) {
    const div = document.createElement('div');
    div.className = 'bonus-message';
    div.textContent = message;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 2000);
}

// إظهار النتيجة
function showResult(type, points = 0) {
    const resultCard = document.getElementById('result-card');
    const resultScreen = document.getElementById('result-screen');
    
    let icon, message, pointsText;
    
    if (type === 'correct') {
        icon = '🎉';
        message = 'إجابة صحيحة!';
        pointsText = `+${points} نقطة`;
        resultCard.className = 'result-card correct';
    } else if (type === 'wrong') {
        icon = '😞';
        message = 'إجابة خاطئة!';
        pointsText = `الإجابة: ${currentPlayer.name}`;
        resultCard.className = 'result-card wrong';
    } else {
        icon = '⏰';
        message = 'انتهى الوقت!';
        pointsText = `الإجابة: ${currentPlayer.name}`;
        resultCard.className = 'result-card wrong';
    }
    
    resultCard.innerHTML = `
        <div class="result-icon">${icon}</div>
        <div class="result-message">${message}</div>
        <div class="result-points">${pointsText}</div>
        <button class="result-next-btn" onclick="nextLevel()">التالي</button>
    `;
    
    resultScreen.classList.add('active');
}

// المستوى التالي
function nextLevel() {
    document.getElementById('result-screen').classList.remove('active');
    
    if (currentLevel < totalLevels) {
        currentLevel++;
        startLevel();
    } else {
        alert('🎉 مبروك! أكملت جميع المستويات!');
        showScreen('main');
    }
}

// استخدام تلميح
function useHint() {
    if (hintsUsed >= maxHints) {
        alert('😞 استنفدت جميع التلميحات!');
        return;
    }
    
    hintsUsed++;
    stats.hintsUsed++;
    
    const hints = [
        `النادي: ${currentPlayer.club}`,
        `البلد: ${currentPlayer.nationality}`,
        `المركز: ${currentPlayer.position}`
    ];
    
    const randomHint = hints[Math.floor(Math.random() * hints.length)];
    
    document.getElementById('hint-display').innerHTML = `<div class="hint">💡 ${randomHint}</div>`;
    document.getElementById('hint-count').textContent = maxHints - hintsUsed;
    
    if (hintsUsed >= maxHints) {
        document.getElementById('hint-btn').disabled = true;
    }
    
    checkAchievements();
    saveGameData();
    saveStats();
}

// عرض المستويات
function showLevels() {
    showScreen('levels');
}

// رسم المستويات
function renderLevels() {
    const grid = document.getElementById('levels-grid');
    grid.innerHTML = '';
    
    for (let i = 1; i <= totalLevels; i++) {
        const item = document.createElement('div');
        item.className = 'level-item';
        
        if (i < currentLevel) {
            item.classList.add('completed');
            item.innerHTML = `<span>${i}</span><div class="level-stars">⭐⭐⭐</div>`;
        } else if (i === currentLevel) {
            item.classList.add('current');
            item.innerHTML = `<span>${i}</span>`;
        } else {
            item.classList.add('locked');
            item.innerHTML = `<span>🔒 ${i}</span>`;
        }
        
        item.onclick = () => {
            if (i <= currentLevel) {
                currentLevel = i;
                showScreen('game');
            }
        };
        
        grid.appendChild(item);
    }
}

// عرض الإنجازات
function showAchievements() {
    showScreen('achievements');
}

// رسم الإنجازات
function renderAchievements() {
    const grid = document.getElementById('achievements-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    achievements.forEach(a => {
        const unlocked = stats.unlockedAchievements.includes(a.id);
        const progress = a.progress(stats);
        
        const item = document.createElement('div');
        item.className = `achievement-item ${unlocked ? 'unlocked' : 'locked'}`;
        item.innerHTML = `
            ${unlocked ? '<div class="achievement-badge">✅</div>' : ''}
            <div class="achievement-icon">${a.icon}</div>
            <div class="achievement-name">${a.name}</div>
            <div class="achievement-desc">${a.desc}</div>
            <div class="achievement-progress">
                <div class="progress-bar" style="width: ${progress}%"></div>
            </div>
        `;
        
        grid.appendChild(item);
    });
}

// التحقق من الإنجازات
function checkAchievements() {
    achievements.forEach(a => {
        if (!stats.unlockedAchievements.includes(a.id) && a.condition(stats)) {
            stats.unlockedAchievements.push(a.id);
            showNewAchievement(a);
        }
    });
    saveStats();
}

// إظهار إنجاز جديد
function showNewAchievement(a) {
    const div = document.createElement('div');
    div.className = 'new-achievement';
    div.innerHTML = `
        <div style="font-size: 60px;">${a.icon}</div>
        <h2>إنجاز جديد! 🎉</h2>
        <p style="font-size: 20px;">${a.name}</p>
        <p>${a.desc}</p>
    `;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

// عرض أفضل اللاعبين
function showLeaderboard() {
    showScreen('leaderboard');
}

// رسم أفضل اللاعبين
function renderLeaderboard() {
    const list = document.getElementById('leaderboard-list');
    
    const leaderboard = [
        { rank: 1, name: 'أحمد محمد', score: 1250 },
        { rank: 2, name: 'عمر حسن', score: 1100 },
        { rank: 3, name: 'سارة أحمد', score: 950 }
    ];
    
    list.innerHTML = leaderboard.map(p => `
        <div class="leaderboard-item">
            <div class="leaderboard-rank">#${p.rank}</div>
            <div class="leaderboard-name">${p.name}</div>
            <div class="leaderboard-score">${p.score}</div>
        </div>
    `).join('');
}

// عرض الإعدادات
function showSettings() {
    showScreen('settings');
}

// تحميل الإعدادات
function loadSettings() {
    document.getElementById('sound-effect').checked = soundsEnabled;
    document.getElementById('dark-mode').checked = darkMode;
    
    document.body.style.background = darkMode ? '#333' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
}

// إعادة تعيين التقدم
function resetProgress() {
    if (confirm('⚠️ هل أنت متأكد؟')) {
        score = 0;
        streak = 0;
        currentLevel = 1;
        hintsUsed = 0;
        coins = 0;
        
        stats = {
            correctAnswers: 0,
            totalScore: 0,
            maxStreak: 0,
            hintsUsed: 0,
            maxLevel: 1,
            unlockedAchievements: []
        };
        
        saveGameData();
        saveStats();
        updateUI();
        alert('✅ تم إعادة التعيين');
        showScreen('main');
    }
}

// تحميل الإحصائيات
function loadStats() {
    const saved = localStorage.getItem('gameStats');
    if (saved) stats = JSON.parse(saved);
}

// حفظ الإحصائيات
function saveStats() {
    localStorage.setItem('gameStats', JSON.stringify(stats));
}

// حفظ البيانات
function saveGameData() {
    const data = { score, streak, currentLevel, hintsUsed, coins, soundsEnabled, darkMode };
    localStorage.setItem('gameData', JSON.stringify(data));
}

// تحميل البيانات
function loadGameData() {
    try {
        const saved = localStorage.getItem('gameData');
        if (saved) {
            const data = JSON.parse(saved);
            score = data.score || 0;
            streak = data.streak || 0;
            currentLevel = data.currentLevel || 1;
            hintsUsed = data.hintsUsed || 0;
            coins = data.coins || 0;
            soundsEnabled = data.soundsEnabled !== false;
            darkMode = data.darkMode || false;
        }
    } catch (e) {
        console.log('لا توجد بيانات محفوظة');
    }
}
