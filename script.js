
// --- JavaScript with Timer and Coins ---

// --- Database (Truncated for brevity) ---
const db = [
    { name: "ليونيل ميسي", infos: ["فزت بالكرة الذهبية 8 مرات.", "قُدت الأرجنتين للفوز بكأس العالم 2022.", "أنا الهداف التاريخي لنادي برشلونة."], decoys: ["كريستيانو رونالدو", "نيمار جونيور"], mainClub: "برشلونة", nationality: "🇦🇷" },
    { name: "كريستيانو رونالدو", infos: ["أنا الهداف التاريخي لكرة القدم.", "فزت بدوري الأبطال 5 مرات.", "فزت ببطولة أمم أوروبا 2016."], decoys: ["ليونيل ميسي", "لويس فيغو"], mainClub: "ريال مدريد", nationality: "🇵🇹" },
    { name: "محمد صلاح", infos: ["فزت بالحذاء الذهبي للدوري الإنجليزي 3 مرات.", "فزت بدوري الأبطال مع ليفربول 2019.", "بدأت مسيرتي الأوروبية في بازل."], decoys: ["رياض محرز", "حكيم زياش"], mainClub: "ليفربول", nationality: "🇪🇬" },
    // ... Paste the full 50-player list here
];

// --- Config ---
const levels = [ { name: "مبتدئ", minScore: 0 }, { name: "هاوٍ", minScore: 500 }, { name: "محترف", minScore: 1500 }, { name: "خبير", minScore: 4000 }, { name: "أسطورة", minScore: 10000 } ];
const POWERUP_COSTS = { '5050': 15, 'nation': 20, 'club': 25, 'hint': 30 };
const INITIAL_COINS = 100;
const QUESTION_TIME = 20; // 20 seconds

// --- Game State ---
let currentQuestion = {}, currentInfoIndex = 0, score = 0, potentialPoints = 30, streak = 0, highScore = 0, coins = 0;
let usedPlayerIndices = [];
let timerInterval;

// --- DOM Elements ---
const startScreen = document.getElementById('start-screen'), gameContainer = document.getElementById('game-container'), endScreen = document.getElementById('end-screen');
const scoreEl = document.getElementById('score'), coinsDisplay = document.getElementById('coins-display'), potentialPointsEl = document.getElementById('potential-points');
const infoBoxEl = document.getElementById('info-box'), nextInfoBtn = document.getElementById('next-info-btn'), choicesEl = document.getElementById('choices');
const resultOverlayEl = document.getElementById('result-overlay'), resultTextEl = document.getElementById('result-text');
const finalScoreEl = document.getElementById('final-score'), startBtn = document.getElementById('start-btn'), restartBtn = document.getElementById('restart-btn');
const highScoreDisplay = document.getElementById('high-score-display'), highScoreEndDisplay = document.getElementById('high-score-end-display');
const playerLevelEl = document.getElementById('player-level'), progressBarEl = document.getElementById('progress-bar');
const timerBar = document.getElementById('timer-bar');
const powerups = {
    '5050': document.getElementById('powerup-5050'), 'nation': document.getElementById('powerup-nation'),
    'club': document.getElementById('powerup-club'), 'hint': document.getElementById('powerup-hint')
};

// --- Game Logic ---
function initGame() {
    highScore = localStorage.getItem('knowThePlayerHighScore') || 0;
    highScoreDisplay.textContent = highScore;
    Object.entries(powerups).forEach(([key, btn]) => btn.setAttribute('data-cost', POWERUP_COSTS[key]));
    startScreen.classList.remove('hidden');
    gameContainer.classList.add('hidden');
    endScreen.classList.add('hidden');
}

function startGame() {
    score = 0; streak = 0; usedPlayerIndices = []; coins = INITIAL_COINS;
    startScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    loadQuestion();
}

function endGame(reason) {
    clearInterval(timerInterval);
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('knowThePlayerHighScore', highScore);
    }
    finalScoreEl.textContent = score;
    highScoreEndDisplay.textContent = highScore;
    gameContainer.classList.add('hidden');
    endScreen.classList.remove('hidden');
}

function startTimer() {
    clearInterval(timerInterval);
    let timeLeft = QUESTION_TIME;
    timerBar.style.transition = 'none';
    timerBar.style.width = '100%';
    
    setTimeout(() => {
        timerBar.style.transition = `width ${QUESTION_TIME}s linear`;
        timerBar.style.width = '0%';
    }, 100);

    timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showResult(false, `انتهى الوقت! اللاعب هو: ${currentQuestion.name}`);
            setTimeout(() => { resultOverlayEl.style.display = 'none'; endGame(); }, 2500);
        }
    }, 1000);
}

function loadQuestion() {
    if (usedPlayerIndices.length === db.length) usedPlayerIndices = [];
    let playerIndex;
    do { playerIndex = Math.floor(Math.random() * db.length); } while (usedPlayerIndices.includes(playerIndex));
    usedPlayerIndices.push(playerIndex);
    currentQuestion = db[playerIndex];
    resetQuestionUI();
    displayInfo();
    createChoices();
    startTimer();
}

function resetQuestionUI() {
    currentInfoIndex = 0; potentialPoints = 30;
    infoBoxEl.innerHTML = ''; choicesEl.innerHTML = '';
    nextInfoBtn.disabled = false;
    updateUI();
}

function displayInfo(infoText) {
    const info = document.createElement('p');
    info.innerHTML = infoText || `- ${currentQuestion.infos[currentInfoIndex]}`;
    infoBoxEl.appendChild(info);
}

function createChoices() {
    const choices = [...currentQuestion.decoys, currentQuestion.name].sort(() => Math.random() - 0.5);
    choicesEl.innerHTML = '';
    choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice;
        button.onclick = () => checkAnswer(choice);
        choicesEl.appendChild(button);
    });
}

function checkAnswer(selectedChoice) {
    clearInterval(timerInterval);
    let isCorrect = selectedChoice === currentQuestion.name;
    if (isCorrect) {
        let bonusPoints = streak * 10;
        let earnedCoins = Math.floor(potentialPoints / 10);
        score += potentialPoints + bonusPoints;
        coins += earnedCoins;
        streak++;
        let resultMsg = `إجابة صحيحة! +${potentialPoints} نقطة | +${earnedCoins} عملة`;
        showResult(true, resultMsg);
        setTimeout(() => { resultOverlayEl.style.display = 'none'; loadQuestion(); }, 2000);
    } else {
        streak = 0;
        showResult(false, `إجابة خاطئة! اللاعب هو: ${currentQuestion.name}`);
        setTimeout(() => { resultOverlayEl.style.display = 'none'; endGame(); }, 2500);
    }
}

function showResult(isCorrect, text) {
    resultTextEl.textContent = text;
    resultOverlayEl.className = isCorrect ? 'result-overlay correct' : 'result-overlay wrong';
    resultOverlayEl.style.display = 'flex';
}

function updateUI() {
    scoreEl.textContent = `النقاط: ${score}`;
    coinsDisplay.textContent = `💰 ${coins}`;
    potentialPointsEl.textContent = `النقاط: ${potentialPoints}`;
    
    Object.entries(powerups).forEach(([key, btn]) => {
        btn.disabled = coins < POWERUP_COSTS[key];
    });
    
    let currentLevel = levels.filter(l => score >= l.minScore).pop() || levels[0];
    let nextLevel = levels[levels.indexOf(currentLevel) + 1];
    playerLevelEl.textContent = currentLevel.name;
    if (nextLevel) {
        let scoreInLevel = score - currentLevel.minScore;
        let levelScoreRange = nextLevel.minScore - currentLevel.minScore;
        progressBarEl.style.width = `${(scoreInLevel / levelScoreRange) * 100}%`;
    } else {
        progressBarEl.style.width = '100%';
    }
}

// --- Event Listeners ---
nextInfoBtn.addEventListener('click', () => {
    currentInfoIndex++;
    if (currentInfoIndex < currentQuestion.infos.length) {
        displayInfo();
        potentialPoints = (currentInfoIndex === 1) ? 20 : 10;
        updateUI();
        if (currentInfoIndex === 2) nextInfoBtn.disabled = true;
    }
});

Object.entries(powerups).forEach(([key, btn]) => {
    btn.addEventListener('click', () => {
        const cost = POWERUP_COSTS[key];
        if (coins >= cost) {
            coins -= cost;
            btn.disabled = true;
            switch (key) {
                case '5050':
                    const buttons = Array.from(choicesEl.children);
                    const wrongChoice = buttons.find(b => b.textContent !== currentQuestion.name);
                    if(wrongChoice) wrongChoice.disabled = true;
                    break;
                case 'nation':
                    displayInfo(`<b>تلميح:</b> جنسية اللاعب هي ${currentQuestion.nationality}`);
                    break;
                case 'club':
                    displayInfo(`<b>تلميح:</b> من أبرز الأندية التي لعب لها ${currentQuestion.mainClub}`);
                    break;
                case 'hint':
                    displayInfo(`<b>تلميح:</b> اسم اللاعب يبدأ بحرف '${currentQuestion.name[0]}'`);
                    break;
            }
            updateUI();
        }
    });
});

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

// --- Initial Load ---
initGame();
