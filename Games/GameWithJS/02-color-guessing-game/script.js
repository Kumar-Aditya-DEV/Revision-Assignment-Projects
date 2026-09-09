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
    playCorrect() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, this.ctx.currentTime + 0.15); // E5
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
    }
    playWrong() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
    }
}

const sound = new SoundEngine();

// DOM Elements
const colorDisplay = document.getElementById('colorDisplay');
const messageDisplay = document.getElementById('message');
const currentStreakDisplay = document.getElementById('currentStreak');
const bestStreakDisplay = document.getElementById('bestStreak');
const colorBoxContainer = document.getElementById('colorBoxContainer');
const newRoundBtn = document.getElementById('newRoundBtn');
const resetStreakBtn = document.getElementById('resetStreakBtn');
const soundToggleBtn = document.getElementById('soundToggleBtn');
const fmtBtns = document.querySelectorAll('.fmt-btn');
const diffBtns = document.querySelectorAll('.diff-btn');

// State
let colors = [];
let correctColor = '';
let currentStreak = 0;
let bestStreak = parseInt(localStorage.getItem('colorGameBestStreak') || '0', 10);
let numColors = 6;
let colorFormat = 'RGB'; // RGB or HEX
let isRoundOver = false;

function init() {
    bestStreakDisplay.textContent = bestStreak;
    setupEventListeners();
    setupGame();
}

function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function generateRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return { r, g, b, rgbStr: `rgb(${r}, ${g}, ${b})`, hexStr: rgbToHex(r, g, b).toUpperCase() };
}

function generateColors(num) {
    const arr = [];
    for (let i = 0; i < num; i++) {
        arr.push(generateRandomColor());
    }
    return arr;
}

function setupGame() {
    isRoundOver = false;
    colors = generateColors(numColors);
    const pickedObj = colors[Math.floor(Math.random() * colors.length)];
    correctColor = pickedObj.rgbStr;

    colorDisplay.textContent = colorFormat === 'HEX' ? pickedObj.hexStr : pickedObj.rgbStr.toUpperCase();
    messageDisplay.textContent = 'Pick a color tile!';
    messageDisplay.style.color = 'var(--text-light)';

    colorBoxContainer.innerHTML = '';
    colorBoxContainer.className = `color-grid count-${numColors}`;

    colors.forEach(colorObj => {
        const box = document.createElement('div');
        box.className = 'color-box';
        box.style.backgroundColor = colorObj.rgbStr;
        box.dataset.rgb = colorObj.rgbStr;

        box.addEventListener('click', () => handleColorClick(box, colorObj.rgbStr));
        colorBoxContainer.appendChild(box);
    });

    newRoundBtn.textContent = '🎲 New Round';
}

function handleColorClick(box, clickedColor) {
    if (isRoundOver) return;

    if (clickedColor === correctColor) {
        isRoundOver = true;
        sound.playCorrect();
        currentStreak++;
        
        if (currentStreak > bestStreak) {
            bestStreak = currentStreak;
            localStorage.setItem('colorGameBestStreak', bestStreak);
            messageDisplay.textContent = '🎉 CORRECT! NEW BEST STREAK!';
            messageDisplay.style.color = '#34d399';
        } else {
            messageDisplay.textContent = '✨ CORRECT! GOOD JOB!';
            messageDisplay.style.color = '#38bdf8';
        }

        updateStreakDisplay();

        const allBoxes = document.querySelectorAll('.color-box');
        allBoxes.forEach(b => {
            b.style.backgroundColor = correctColor;
            b.classList.remove('fade');
        });

        newRoundBtn.textContent = '🚀 Next Round';
    } else {
        sound.playWrong();
        currentStreak = 0;
        updateStreakDisplay();
        box.classList.add('fade');
        box.classList.add('shake');
        messageDisplay.textContent = '❌ Wrong! Try another...';
        messageDisplay.style.color = '#f87171';
    }
}

function updateStreakDisplay() {
    currentStreakDisplay.textContent = currentStreak;
    bestStreakDisplay.textContent = bestStreak;
}

function setupEventListeners() {
    newRoundBtn.addEventListener('click', setupGame);

    resetStreakBtn.addEventListener('click', () => {
        if (confirm('Reset your best streak record?')) {
            bestStreak = 0;
            currentStreak = 0;
            localStorage.removeItem('colorGameBestStreak');
            updateStreakDisplay();
            messageDisplay.textContent = 'Streak reset!';
        }
    });

    fmtBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            fmtBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            colorFormat = btn.dataset.fmt;
            setupGame();
        });
    });

    diffBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            diffBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            numColors = parseInt(btn.dataset.count, 10);
            setupGame();
        });
    });

    soundToggleBtn.addEventListener('click', () => {
        sound.enabled = !sound.enabled;
        soundToggleBtn.textContent = sound.enabled ? '🔊 Sound: ON' : 'Muted';
    });
}

init();