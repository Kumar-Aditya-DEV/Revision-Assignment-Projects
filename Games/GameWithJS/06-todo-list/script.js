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
    playAdd() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }
    playCheck() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1000, this.ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    }
    playDelete() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.12);
    }
}

const sound = new SoundEngine();

// DOM Elements
const todoInput = document.getElementById('todo-input');
const prioritySelect = document.getElementById('priority-select');
const addButton = document.getElementById('add-button');
const searchInput = document.getElementById('search-input');
const filterTabs = document.querySelectorAll('.filter-tab');
const allTodosList = document.getElementById('all-todos');
const deleteSelectedButton = document.getElementById('delete-selected');
const deleteAllButton = document.getElementById('delete-all');
const cCountEl = document.getElementById('c-count');
const rCountEl = document.getElementById('r-count');
const soundToggleBtn = document.getElementById('soundToggleBtn');

// State
let todoList = JSON.parse(localStorage.getItem('taskMasterTodos') || '[]');
let currentFilter = 'all';
let searchQuery = '';

function init() {
    setupEventListeners();
    renderTodos();
}

function saveTodos() {
    localStorage.setItem('taskMasterTodos', JSON.stringify(todoList));
}

function updateCounts() {
    const completedCount = todoList.filter(item => item.complete).length;
    cCountEl.textContent = completedCount;
    rCountEl.textContent = todoList.length;
}

function addTask() {
    const taskText = todoInput.value.trim();
    if (!taskText) {
        alert('Please enter task content!');
        return;
    }

    const newTodo = {
        id: Date.now().toString(),
        content: taskText,
        priority: prioritySelect.value,
        complete: false
    };

    todoList.unshift(newTodo);
    saveTodos();
    sound.playAdd();

    todoInput.value = '';
    renderTodos();
}

function toggleComplete(id) {
    todoList = todoList.map(item => {
        if (item.id === id) {
            return { ...item, complete: !item.complete };
        }
        return item;
    });
    saveTodos();
    sound.playCheck();
    renderTodos();
}

function deleteTask(id) {
    todoList = todoList.filter(item => item.id !== id);
    saveTodos();
    sound.playDelete();
    renderTodos();
}

function deleteSelected() {
    if (confirm('Clear all completed tasks?')) {
        todoList = todoList.filter(item => !item.complete);
        saveTodos();
        sound.playDelete();
        renderTodos();
    }
}

function deleteAll() {
    if (confirm('Delete ALL tasks in list?')) {
        todoList = [];
        saveTodos();
        sound.playDelete();
        renderTodos();
    }
}

function renderTodos() {
    updateCounts();
    allTodosList.innerHTML = '';

    const filtered = todoList.filter(item => {
        const matchesFilter = currentFilter === 'all' ? true :
                             (currentFilter === 'active' ? !item.complete : item.complete);
        const matchesSearch = item.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
        allTodosList.innerHTML = `
            <li style="text-align: center; color: var(--text-muted); padding: 24px; font-weight: 500;">
                No tasks found! 🎉
            </li>
        `;
        return;
    }

    filtered.forEach(item => {
        const li = document.createElement('li');
        li.className = `todo-item ${item.complete ? 'completed' : ''}`;
        li.dataset.id = item.id;

        const pTagClass = item.priority === 'high' ? 'high' : (item.priority === 'low' ? 'low' : 'medium');
        const pTagText = item.priority.toUpperCase();

        li.innerHTML = `
            <div class="todo-content">
                <span class="priority-tag ${pTagClass}">${pTagText}</span>
                <span class="todo-text">${escapeHtml(item.content)}</span>
            </div>
            <div class="todo-actions">
                <button class="action-btn btn-complete" title="Toggle Complete">
                    <i class="bx ${item.complete ? 'bx-check-double' : 'bx-check'}"></i>
                </button>
                <button class="action-btn btn-delete" title="Delete Task">
                    <i class="bx bx-trash"></i>
                </button>
            </div>
        `;

        li.querySelector('.btn-complete').addEventListener('click', () => toggleComplete(item.id));
        li.querySelector('.btn-delete').addEventListener('click', () => deleteTask(item.id));

        allTodosList.appendChild(li);
    });
}

function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    })[m]);
}

function setupEventListeners() {
    addButton.addEventListener('click', addTask);

    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderTodos();
    });

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            renderTodos();
        });
    });

    deleteSelectedButton.addEventListener('click', deleteSelected);
    deleteAllButton.addEventListener('click', deleteAll);

    soundToggleBtn.addEventListener('click', () => {
        sound.enabled = !sound.enabled;
        soundToggleBtn.textContent = sound.enabled ? '🔊 Sound: ON' : 'Muted';
    });
}

init();