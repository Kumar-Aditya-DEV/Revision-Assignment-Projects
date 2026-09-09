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
    playFlip() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(700, this.ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    }
    playMatch() {
        if (!this.enabled) return;
        this.init();
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
            gain.gain.setValueAtTime(0.25, this.ctx.currentTime + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.08 + 0.15);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(this.ctx.currentTime + idx * 0.08);
            osc.stop(this.ctx.currentTime + idx * 0.08 + 0.15);
        });
    }
    playMismatch() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    }
}

const sound = new SoundEngine();

// Card Theme Packs
const themes = {
    food: ['🍕', '🍔', '🍟', '🍩', '🍦', '🌮', '🍣', '🍓', '🥑'],
    tech: ['💻', '📱', '🎮', '🚀', '🤖', '⚡', '💡', '🔒', '🎧'],
    animals: ['🦁', '🦊', '🐯', '🐼', '🐵', '🦉', '🐬', '🦄', '🐝']
};

// DOM Elements
const board = document.getElementById('board');
const movesEl = document.getElementById('moves');
const pairsEl = document.getElementById('pairs');
const timeEl = document.getElementById('timeLeft');
const bestScoreEl = document.getElementById('bestScore');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const resetBtn = document.getElementById('resetBtn');
const statusMsgEl = document.getElementById('statusMsg');
const soundToggleBtn = document.getElementById('soundToggleBtn');
const themeBtns = document.querySelectorAll('.theme-btn');

// State
let selectedTheme = 'food';
let firstCard = null;
let secondCard = null;
let isBusy = false;
let isPlaying = false;
let moves = 0;
let matchedPairs = 0;
const totalPairs = 9;
let timeLeft = 60;
let timerId = null;
let bestMoves = parseInt(localStorage.getItem('memoryBestMoves') || '0', 10);

function init() {
    bestScoreEl.textContent = bestMoves > 0 ? `${bestMoves} moves` : '-';
    setupEventListeners();
    buildBoard();
}

function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function createCard(item) {
    const card = document.createElement('div');
    card.className = 'card';

    // Standard valid HTML <div> instead of invalid <inner> tag
    const inner = document.createElement('div');
    inner.className = 'inner';

    const front = document.createElement('div');
    front.className = 'front';

    const back = document.createElement('div');
    back.className = 'back';
    back.textContent = item;

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    card.addEventListener('click', () => flipCard(card));
    return card;
}

function buildBoard() {
    board.innerHTML = '';
    firstCard = null;
    secondCard = null;
    isBusy = false;
    moves = 0;
    matchedPairs = 0;

    movesEl.textContent = '0';
    pairsEl.textContent = `0 / ${totalPairs}`;

    const items = themes[selectedTheme];
    const deck = shuffle([...items, ...items]);

    deck.forEach(item => {
        const card = createCard(item);
        board.appendChild(card);
    });
}

function startGame() {
    if (isPlaying) return;

    isPlaying = true;
    timeLeft = 60;
    timeEl.textContent = `${timeLeft}s`;
    statusMsgEl.textContent = '🧠 Find all matching card pairs!';

    buildBoard();

    timerId = setInterval(() => {
        timeLeft--;
        timeEl.textContent = `${timeLeft}s`;

        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

function flipCard(card) {
    if (!isPlaying || isBusy) return;
    if (card === firstCard || card.classList.contains('flipped') || card.classList.contains('matched')) return;

    sound.playFlip();
    card.classList.add('flipped');

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    moves++;
    movesEl.textContent = moves;
    isBusy = true;

    const valA = firstCard.querySelector('.back').textContent;
    const valB = secondCard.querySelector('.back').textContent;

    if (valA === valB) {
        sound.playMatch();
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        matchedPairs++;
        pairsEl.textContent = `${matchedPairs} / ${totalPairs}`;

        firstCard = null;
        secondCard = null;
        isBusy = false;

        if (matchedPairs === totalPairs) {
            endGame(true);
        }
    } else {
        sound.playMismatch();
        firstCard.classList.add('mismatch');
        secondCard.classList.add('mismatch');

        setTimeout(() => {
            if (firstCard && secondCard) {
                firstCard.classList.remove('flipped', 'mismatch');
                secondCard.classList.remove('flipped', 'mismatch');
            }
            firstCard = null;
            secondCard = null;
            isBusy = false;
        }, 750);
    }
}

function endGame(isWin) {
    clearInterval(timerId);
    isPlaying = false;

    if (isWin) {
        if (bestMoves === 0 || moves < bestMoves) {
            bestMoves = moves;
            localStorage.setItem('memoryBestMoves', bestMoves);
            bestScoreEl.textContent = `${bestMoves} moves`;
            statusMsgEl.textContent = `🎉 AMAZING! NEW BEST RECORD: ${moves} MOVES!`;
        } else {
            statusMsgEl.textContent = `🏆 VICTORY! Cleared in ${moves} moves!`;
        }
    } else {
        statusMsgEl.textContent = '⌛ Time expired! Try again!';
    }
}

function setupEventListeners() {
    startBtn.addEventListener('click', startGame);

    restartBtn.addEventListener('click', () => {
        clearInterval(timerId);
        isPlaying = false;
        startGame();
    });

    resetBtn.addEventListener('click', () => {
        if (confirm('Reset best moves record?')) {
            bestMoves = 0;
            localStorage.removeItem('memoryBestMoves');
            bestScoreEl.textContent = '-';
        }
    });

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isPlaying) return;
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedTheme = btn.dataset.theme;
            buildBoard();
        });
    });

    soundToggleBtn.addEventListener('click', () => {
        sound.enabled = !sound.enabled;
        soundToggleBtn.textContent = sound.enabled ? '🔊 Sound: ON' : 'Muted';
    });
}

init();