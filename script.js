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
        name: "محمد صلاح",
        image: "images/salah.jpg",
        club: "ليفربول",
        nationality: "مصر",
        position: "جناح",
        level: 1
    }
];

// متغيرات اللعبة
let currentPlayer = null;
let score = 0;
let streak = 0;
let currentLevel = 1;
let hintsUsed = 0;
let coins = 0;
let timerInterval = null;
let timeLeft = 15;
const totalLevels = 10;

// تشغيل اللعبة
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        showScreen('main');
    }, 2000);
    document.getElementById('total-levels').textContent = totalLevels;
});

// إظهار الشاشات
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId + '-screen').classList.add('active');
    
    if (screenId === 'game') {
        startLevel();
    } else if (screenId === 'levels') {
        renderLevels();
    } else if (screenId === 'leaderboard') {
        renderLeaderboard();
    }
}

// العودة للرئيسية
function goBack() {
    if (timerInterval) clearInterval(timerInterval);
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
    if (timerInterval) clearInterval(timerInterval);
    
    let levelPlayers = players.filter(p => p.level <= currentLevel);
    let randomIndex = Math.floor(Math.random() * levelPlayers.length);
    currentPlayer = levelPlayers[randomIndex];
    
    let playerImage = document.getElementById('player-image');
    playerImage.style.backgroundImage = `url('${currentPlayer.image}')`;
    playerImage.classList.add('blurred');
    playerImage.classList.remove('revealed');
    
    generateOptions();
    
    document.getElementById('current-level').textContent = currentLevel;
    document.getElementById('current-score').textContent = score;
    document.getElementById('streak-count').textContent = streak;
    document.getElementById('hint-display').innerHTML = '';
    
    startTimer(15);
}

// إنشاء الخيارات
function generateOptions() {
    let options = [currentPlayer.name];
    let otherPlayers = players.filter(p => p.id !== currentPlayer.id);
    
    while (options.length < 4 && otherPlayers.length > 0) {
        let randomIndex = Math.floor(Math.random() * otherPlayers.length);
        let randomName = otherPlayers[randomIndex].name;
        if (!options.includes(randomName)) {
            options.push(randomName);
        }
        otherPlayers.splice(randomIndex, 1);
    }
    
    // خلط الخيارات
    options.sort(() => Math.random() - 0.5);
    
    let container = document.getElementById('options-container');
    container.innerHTML = '';
    
    options.forEach(option => {
        let btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.onclick = () => checkAnswer(option);
        container.appendChild(btn);
    });
}

// بدء المؤقت
function startTimer(seconds) {
    timeLeft = seconds;
    document.getElementById('timer-text').textContent = timeLeft;
    document.getElementById('timer-bar').style.width = '100%';
    
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer-text').textContent = timeLeft;
        document.getElementById('timer-bar').style.width = (timeLeft / seconds) * 100 + '%';
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showResult('timeout');
        }
    }, 1000);
}

// التحقق من الإجابة
function checkAnswer(selected) {
    clearInterval(timerInterval);
    
    let options = document.querySelectorAll('.option-btn');
    let pointsEarned = 0;
    
    if (selected === currentPlayer.name) {
        streak++;
        pointsEarned = 10;
        score += pointsEarned;
        coins += 5;
        
        options.forEach(btn => {
            btn.disabled = true;
            btn.classList.add('disabled');
            if (btn.textContent === currentPlayer.name) {
                btn.classList.add('correct');
            }
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
    
    document.getElementById('current-score').textContent = score;
    document.getElementById('streak-count').textContent = streak;
    document.getElementById('coin-count').textContent = coins;
}

// إظهار النتيجة
function showResult(type, points = 0) {
    let resultCard = document.getElementById('result-card');
    let resultScreen = document.getElementById('result-screen');
    
    if (type === 'correct') {
        resultCard.className = 'result-card correct';
        resultCard.innerHTML = `
            <div class="result-icon">🎉</div>
            <div class="result-message">إجابة صحيحة!</div>
            <div class="result-points">+${points} نقطة</div>
            <button class="result-next-btn" onclick="nextLevel()">التالي</button>
        `;
    } else if (type === 'wrong') {
        resultCard.className = 'result-card wrong';
        resultCard.innerHTML = `
            <div class="result-icon">😞</div>
            <div class="result-message">إجابة خاطئة!</div>
            <div class="result-points">الإجابة: ${currentPlayer.name}</div>
            <button class="result-next-btn" onclick="nextLevel()">التالي</button>
        `;
    } else {
        resultCard.className = 'result-card wrong';
        resultCard.innerHTML = `
            <div class="result-icon">⏰</div>
            <div class="result-message">انتهى الوقت!</div>
            <div class="result-points">الإجابة: ${currentPlayer.name}</div>
            <button class="result-next-btn" onclick="nextLevel()">التالي</button>
        `;
    }
    
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
    if (hintsUsed >= 3) {
        alert('لا توجد تلميحات متاحة!');
        return;
    }
    
    hintsUsed++;
    
    let hints = [
        `النادي: ${currentPlayer.club}`,
        `البلد: ${currentPlayer.nationality}`,
        `المركز: ${currentPlayer.position}`
    ];
    
    let randomHint = hints[Math.floor(Math.random() * hints.length)];
    document.getElementById('hint-display').innerHTML = `<div class="hint">💡 ${randomHint}</div>`;
}

// عرض المستويات
function showLevels() {
    showScreen('levels');
}

// رسم المستويات
function renderLevels() {
    let grid = document.getElementById('levels-grid');
    grid.innerHTML = '';
    
    for (let i = 1; i <= totalLevels; i++) {
        let item = document.createElement('div');
        item.className = 'level-item';
        
        if (i < currentLevel) {
            item.classList.add('completed');
            item.innerHTML = `<span>${i}</span>`;
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

// عرض أفضل اللاعبين
function showLeaderboard() {
    showScreen('leaderboard');
}

// رسم أفضل اللاعبين
function renderLeaderboard() {
    let list = document.getElementById('leaderboard-list');
    list.innerHTML = `
        <div class="leaderboard-item"><span>#1</span><span>أحمد</span><span>500</span></div>
        <div class="leaderboard-item"><span>#2</span><span>محمد</span><span>450</span></div>
        <div class="leaderboard-item"><span>#3</span><span>علي</span><span>400</span></div>
    `;
}

// عرض الإعدادات
function showSettings() {
    showScreen('settings');
}

// إعادة تعيين التقدم
function resetProgress() {
    if (confirm('هل أنت متأكد؟')) {
        score = 0;
        streak = 0;
        currentLevel = 1;
        hintsUsed = 0;
        coins = 0;
        alert('تم إعادة التعيين');
        showScreen('main');
    }
}
