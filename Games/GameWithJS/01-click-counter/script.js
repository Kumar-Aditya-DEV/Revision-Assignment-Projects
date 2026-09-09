// Web Audio Synthesizer Engine
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }
    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
    }
    playClick() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }
    playBeep(freq = 600) {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }
    playWin() {
        if (!this.enabled) return;
        this.init();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.1);
            gain.gain.setValueAtTime(0.3, this.ctx.currentTime + idx * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.1 + 0.25);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(this.ctx.currentTime + idx * 0.1);
            osc.stop(this.ctx.currentTime + idx * 0.1 + 0.25);
        });
    }
}

const sound = new SoundEngine();

// DOM Elements
const currentScoreEl = document.getElementById('currentScore');
const cpsScoreEl = document.getElementById('cpsScore');
const highScoreEl = document.getElementById('highScore');
const timerEl = document.getElementById('timer');
const timerProgressEl = document.getElementById('timerProgress');
const clickBtn = document.getElementById('clickButton');
const startBtn = document.getElementById('startButton');
const pauseBtn = document.getElementById('pauseButton');
const resetBtn = document.getElementById('resetButton');
const statusMsgEl = document.getElementById('statusMessage');
const soundToggleBtn = document.getElementById('soundToggleBtn');
const playerDisplayEl = document.getElementById('playerDisplay');
const editNameBtn = document.getElementById('editNameBtn');

// Modal Elements
const nameModal = document.getElementById('nameModal');
const playerNameInput = document.getElementById('playerNameInput');
const saveNameBtn = document.getElementById('saveNameBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const timeOptBtns = document.querySelectorAll('.time-opt-btn');

// State Variables
let selectedDuration = 5;
let currentScore = 0;
let highScore = 0;
let timeLeft = selectedDuration;
let timerInterval = null;
let isPlaying = false;
let isPaused = false;
let playerName = localStorage.getItem('clickerPlayerName') || 'Speedster';

function init() {
    playerDisplayEl.textContent = playerName;
    loadHighScore();
    updateDisplay();
    setupEventListeners();
}

function loadHighScore() {
    const saved = localStorage.getItem(`clickerHighScore_${selectedDuration}s`);
    highScore = saved ? parseInt(saved, 10) : 0;
    highScoreEl.textContent = highScore;
}

function updateDisplay() {
    currentScoreEl.textContent = currentScore;
    highScoreEl.textContent = highScore;
    timerEl.textContent = timeLeft.toFixed(1) + 's';
    
    const elapsed = selectedDuration - timeLeft;
    const cps = elapsed > 0 ? (currentScore / elapsed).toFixed(1) : (0).toFixed(1);
    cpsScoreEl.textContent = cps;

    const progressPct = (timeLeft / selectedDuration) * 100;
    timerProgressEl.style.width = `${progressPct}%`;
}

function setStatus(msg, type = '') {
    statusMsgEl.textContent = msg;
    statusMsgEl.style.borderColor = type === 'win' ? 'var(--success-color)' : (type === 'warn' ? 'var(--warning-color)' : 'rgba(255, 255, 255, 0.1)');
}

function startGame() {
    isPlaying = true;
    isPaused = false;
    currentScore = 0;
    timeLeft = selectedDuration;
    
    clickBtn.disabled = false;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    pauseBtn.textContent = '⏸️ Pause';

    timeOptBtns.forEach(btn => btn.disabled = true);

    setStatus('🔥 Tap as fast as you can!', 'win');
    updateDisplay();

    timerInterval = setInterval(() => {
        if (!isPaused) {
            timeLeft -= 0.1;
            if (timeLeft <= 0) {
                timeLeft = 0;
                endGame();
            } else if (timeLeft <= 3 && Math.floor(timeLeft * 10) % 10 === 0) {
                sound.playBeep(800);
            }
            updateDisplay();
        }
    }, 100);
}

function endGame() {
    clearInterval(timerInterval);
    isPlaying = false;
    isPaused = false;

    clickBtn.disabled = true;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    startBtn.textContent = '🔄 Play Again';

    timeOptBtns.forEach(btn => btn.disabled = false);

    const finalCps = (currentScore / selectedDuration).toFixed(1);

    if (currentScore > highScore) {
        highScore = currentScore;
        localStorage.setItem(`clickerHighScore_${selectedDuration}s`, highScore);
        updateDisplay();
        sound.playWin();
        setStatus(`🎉 NEW RECORD! ${playerName} achieved ${currentScore} clicks (${finalCps} CPS)!`, 'win');
    } else {
        setStatus(`🏁 Time's up! ${currentScore} clicks (${finalCps} CPS). Best: ${highScore}`, 'warn');
    }
}

function pauseGame() {
    if (!isPlaying) return;
    if (isPaused) {
        isPaused = false;
        pauseBtn.textContent = '⏸️ Pause';
        clickBtn.disabled = false;
        setStatus('⚡ Resumed! Keep clicking!');
    } else {
        isPaused = true;
        pauseBtn.textContent = '▶️ Resume';
        clickBtn.disabled = true;
        setStatus('⏸️ Game Paused', 'warn');
    }
}

function resetHighScore() {
    if (confirm(`Reset high score for ${selectedDuration}s mode?`)) {
        localStorage.removeItem(`clickerHighScore_${selectedDuration}s`);
        highScore = 0;
        updateDisplay();
        setStatus('High score reset to 0.');
    }
}

function setupEventListeners() {
    clickBtn.addEventListener('click', () => {
        if (isPlaying && !isPaused) {
            currentScore++;
            sound.playClick();
            updateDisplay();
        }
    });

    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', pauseGame);
    resetBtn.addEventListener('click', resetHighScore);

    timeOptBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isPlaying) return;
            timeOptBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedDuration = parseInt(btn.dataset.time, 10);
            timeLeft = selectedDuration;
            loadHighScore();
            updateDisplay();
        });
    });

    soundToggleBtn.addEventListener('click', () => {
        sound.enabled = !sound.enabled;
        soundToggleBtn.textContent = sound.enabled ? '🔊 Sound: ON' : 'Muted';
    });

    // Player Name Modal
    editNameBtn.addEventListener('click', () => {
        playerNameInput.value = playerName;
        nameModal.classList.add('open');
    });

    closeModalBtn.addEventListener('click', () => nameModal.classList.remove('open'));

    saveNameBtn.addEventListener('click', () => {
        const val = playerNameInput.value.trim();
        if (val) {
            playerName = val;
            localStorage.setItem('clickerPlayerName', playerName);
            playerDisplayEl.textContent = playerName;
        }
        nameModal.classList.remove('open');
    });
}

init();