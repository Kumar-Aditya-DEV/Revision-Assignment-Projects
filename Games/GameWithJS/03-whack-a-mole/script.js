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
    playWhack() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }
    playGold() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    }
    playBomb() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
    }
}

const sound = new SoundEngine();

// DOM Elements
const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const scoreEl = document.getElementById('score');
const timeLeftEl = document.getElementById('timeLeft');
const hitsEl = document.getElementById('hits');
const maxScoreEl = document.getElementById('maxScore');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const statusMsgEl = document.getElementById('statusMsg');
const soundToggleBtn = document.getElementById('soundToggleBtn');
const diffBtns = document.querySelectorAll('.diff-btn');

// State
let score = 0;
let hits = 0;
let timeLeft = 30;
let maxScore = parseInt(localStorage.getItem('whackBestScore') || '0', 10);
let lastHole = null;
let gameTimer = null;
let moleTimer = null;
let isPlaying = false;
let isPaused = false;
let popSpeed = 750;

function init() {
    maxScoreEl.textContent = maxScore;
    setupEventListeners();
}

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    if (hole === lastHole) {
        return randomHole(holes);
    }
    lastHole = hole;
    return hole;
}

function popMole() {
    if (!isPlaying || isPaused) return;

    const hole = randomHole(holes);
    const mole = hole.querySelector('.mole');

    // Determine mole type: 70% normal, 15% gold, 15% bomb
    const rand = Math.random();
    mole.className = 'mole';
    if (rand > 0.85) {
        mole.classList.add('type-gold');
        mole.dataset.type = 'gold';
    } else if (rand > 0.70) {
        mole.classList.add('type-bomb');
        mole.dataset.type = 'bomb';
    } else {
        mole.dataset.type = 'normal';
    }

    mole.classList.add('up');
    const time = randomTime(popSpeed, popSpeed + 400);

    setTimeout(() => {
        mole.classList.remove('up');
        if (isPlaying && !isPaused) popMole();
    }, time);
}

function startGame() {
    if (isPlaying) return;

    score = 0;
    hits = 0;
    timeLeft = 30;
    isPlaying = true;
    isPaused = false;

    scoreEl.textContent = 0;
    hitsEl.textContent = 0;
    timeLeftEl.textContent = '30s';

    startBtn.disabled = true;
    pauseBtn.disabled = false;
    pauseBtn.textContent = '⏸️ Pause';
    statusMsgEl.textContent = '🔨 Whack those moles!';

    popMole();

    gameTimer = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            timeLeftEl.textContent = `${timeLeft}s`;

            if (timeLeft <= 0) {
                endGame();
            }
        }
    }, 1000);
}

function endGame() {
    clearInterval(gameTimer);
    isPlaying = false;
    isPaused = false;

    moles.forEach(m => m.classList.remove('up'));

    startBtn.disabled = false;
    pauseBtn.disabled = true;

    if (score > maxScore) {
        maxScore = score;
        localStorage.setItem('whackBestScore', maxScore);
        maxScoreEl.textContent = maxScore;
        statusMsgEl.textContent = `🎉 GAME OVER! NEW HIGH SCORE: ${score} pts!`;
        statusMsgEl.style.color = 'var(--gold-accent)';
    } else {
        statusMsgEl.textContent = `🏁 Game Over! Final Score: ${score} pts.`;
        statusMsgEl.style.color = 'var(--text-light)';
    }
}

function whack(e) {
    if (!e.isTrusted) return; // Prevent fake clicks
    const mole = e.target;

    if (!mole.classList.contains('up') || mole.classList.contains('whacked')) return;

    mole.classList.add('whacked');
    mole.classList.remove('up');

    const type = mole.dataset.type;

    if (type === 'gold') {
        sound.playGold();
        score += 25;
        hits++;
    } else if (type === 'bomb') {
        sound.playBomb();
        score = Math.max(0, score - 15);
    } else {
        sound.playWhack();
        score += 10;
        hits++;
    }

    scoreEl.textContent = score;
    hitsEl.textContent = hits;
}

function setupEventListeners() {
    moles.forEach(mole => mole.addEventListener('click', whack));

    startBtn.addEventListener('click', startGame);

    pauseBtn.addEventListener('click', () => {
        if (!isPlaying) return;
        if (isPaused) {
            isPaused = false;
            pauseBtn.textContent = '⏸️ Pause';
            statusMsgEl.textContent = '🔨 Game Resumed!';
            popMole();
        } else {
            isPaused = true;
            pauseBtn.textContent = '▶️ Resume';
            statusMsgEl.textContent = '⏸️ Game Paused';
        }
    });

    resetBtn.addEventListener('click', () => {
        if (confirm('Reset high score record?')) {
            maxScore = 0;
            localStorage.removeItem('whackBestScore');
            maxScoreEl.textContent = 0;
        }
    });

    diffBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isPlaying) return;
            diffBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            popSpeed = parseInt(btn.dataset.speed, 10);
        });
    });

    soundToggleBtn.addEventListener('click', () => {
        sound.enabled = !sound.enabled;
        soundToggleBtn.textContent = sound.enabled ? '🔊 Sound: ON' : 'Muted';
    });
}

init();