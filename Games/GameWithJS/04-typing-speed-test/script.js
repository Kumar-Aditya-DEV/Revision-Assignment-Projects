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
    playKey() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
    }
    playError() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    }
}

const sound = new SoundEngine();

// Text Collections
const passageBank = {
    quotes: [
        "The quick brown fox jumps over the lazy dog in a sunny field.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "Code is like humor. When you have to explain it, it is bad.",
        "Simplicity is the soul of efficiency and the key to master software craftsmanship."
    ],
    code: [
        "const calculateWPM = (chars, seconds) => Math.round((chars / 5) / (seconds / 60));",
        "function handleEvent(event) { event.preventDefault(); console.log('Action logged'); }",
        "array.reduce((acc, curr) => acc + curr, 0);",
        "document.addEventListener('DOMContentLoaded', () => { initApp(); });"
    ],
    tech: [
        "Artificial intelligence and quantum computing are revolutionizing modern software engineering.",
        "Cloud architectures rely on scalable microservices, containerization, and automated CI/CD pipelines.",
        "Cybersecurity mandates zero trust policies, robust encryption standards, and continuous auditing."
    ]
};

// DOM Elements
const typingArea = document.getElementById('typingArea');
const textDisplay = document.getElementById('textDisplay');
const timerEl = document.getElementById('timer');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const bestWPMElem = document.getElementById('bestWPM');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const encouragementEl = document.getElementById('encouragement');
const soundToggleBtn = document.getElementById('soundToggleBtn');
const secBtns = document.querySelectorAll('.sec-btn');
const catBtns = document.querySelectorAll('.cat-btn');

// State
let selectedCategory = 'quotes';
let selectedTime = 60;
let timeLeft = selectedTime;
let currentPassage = '';
let isTestActive = false;
let startTime = null;
let timerInterval = null;
let bestWPM = parseInt(localStorage.getItem('typingBestWPM') || '0', 10);
let lastCharLength = 0;

function init() {
    bestWPMElem.textContent = bestWPM;
    timerEl.textContent = `${selectedTime}s`;
    setupEventListeners();
    resetTest();
}

function resetTest() {
    clearInterval(timerInterval);
    isTestActive = false;
    startTime = null;
    timeLeft = selectedTime;
    lastCharLength = 0;

    typingArea.value = '';
    typingArea.disabled = true;
    startBtn.disabled = false;

    wpmEl.textContent = '0';
    accuracyEl.textContent = '100%';
    timerEl.textContent = `${selectedTime}s`;

    const bank = passageBank[selectedCategory];
    currentPassage = bank[Math.floor(Math.random() * bank.length)];
    textDisplay.textContent = currentPassage;

    encouragementEl.textContent = 'Click "Start Test" to begin!';
}

function startTest() {
    isTestActive = true;
    typingArea.disabled = false;
    typingArea.value = '';
    typingArea.focus();
    startBtn.disabled = true;

    startTime = Date.now();
    encouragementEl.textContent = '⚡ Type away!';

    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `${timeLeft}s`;

        if (timeLeft <= 0) {
            endTest();
        }
    }, 1000);
}

function handleTyping() {
    if (!isTestActive) return;

    const typed = typingArea.value;
    
    if (typed.length > lastCharLength) {
        // Sound feedback
        const lastIdx = typed.length - 1;
        if (typed[lastIdx] === currentPassage[lastIdx]) {
            sound.playKey();
        } else {
            sound.playError();
        }
    }
    lastCharLength = typed.length;

    // Render formatted text stream
    let html = '';
    let correctCount = 0;

    for (let i = 0; i < currentPassage.length; i++) {
        if (i < typed.length) {
            if (typed[i] === currentPassage[i]) {
                html += `<span class="correct">${currentPassage[i]}</span>`;
                correctCount++;
            } else {
                html += `<span class="incorrect">${currentPassage[i]}</span>`;
            }
        } else if (i === typed.length) {
            html += `<span class="current">${currentPassage[i]}</span>`;
        } else {
            html += currentPassage[i];
        }
    }
    textDisplay.innerHTML = html;

    // Calculate metrics
    const elapsedMinutes = (Date.now() - startTime) / 60000;
    const wordsTyped = typed.length / 5;
    const wpm = elapsedMinutes > 0 ? Math.round(wordsTyped / elapsedMinutes) : 0;
    const accuracy = typed.length > 0 ? Math.round((correctCount / typed.length) * 100) : 100;

    wpmEl.textContent = wpm;
    accuracyEl.textContent = `${accuracy}%`;

    // Auto complete if passage finished
    if (typed.length >= currentPassage.length) {
        endTest();
    }
}

function endTest() {
    clearInterval(timerInterval);
    isTestActive = false;
    typingArea.disabled = true;
    startBtn.disabled = false;

    const finalWPM = parseInt(wpmEl.textContent, 10);

    if (finalWPM > bestWPM) {
        bestWPM = finalWPM;
        localStorage.setItem('typingBestWPM', bestWPM);
        bestWPMElem.textContent = bestWPM;
        encouragementEl.textContent = `🎉 NEW BEST WPM RECORD: ${finalWPM} WPM!`;
    } else {
        encouragementEl.textContent = `🏁 Test finished! Your speed: ${finalWPM} WPM.`;
    }
}

function setupEventListeners() {
    startBtn.addEventListener('click', startTest);
    resetBtn.addEventListener('click', resetTest);
    typingArea.addEventListener('input', handleTyping);

    secBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isTestActive) return;
            secBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedTime = parseInt(btn.dataset.time, 10);
            resetTest();
        });
    });

    catBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isTestActive) return;
            catBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedCategory = btn.dataset.cat;
            resetTest();
        });
    });

    soundToggleBtn.addEventListener('click', () => {
        sound.enabled = !sound.enabled;
        soundToggleBtn.textContent = sound.enabled ? '🔊 Sound: ON' : 'Muted';
    });
}

init();