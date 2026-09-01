/* ============================================
   GAME ENGINE — Core game loop, scene management,
   input handling, canvas management
   ============================================ */

class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = 0;
        this.height = 0;
        this.paused = false;
        this.currentScene = null;
        this.currentSceneName = '';
        this.currentLevel = 0;
        this.saveData = null;
        this.lastTime = 0;
        this.running = false;

        // Assets
        this.assets = {
            characters: new Image(),
            guide: new Image()
        };

        // Scene registry
        this.scenes = {};

        // Bind methods
        this._gameLoop = this._gameLoop.bind(this);
        this._onResize = this._onResize.bind(this);
        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onTouchStart = this._onTouchStart.bind(this);
        this._onTouchMove = this._onTouchMove.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);
    }

    async init() {
        // Register scenes
        this.scenes = {
            MenuScene: () => new MenuScene(this),
            MapScene: () => new MapScene(this),
            IntroScene: () => new IntroScene(this),
            StoryScene: () => new StoryScene(this),
            NumberMazeScene: () => new NumberMazeScene(this),
            MathShooterScene: () => new MathShooterScene(this),
            ObjectSearchScene: () => new ObjectSearchScene(this),
            CoordinationScene: () => new CoordinationScene(this),
            MemoryScene: () => new MemoryScene(this),
            BreathingScene: () => new BreathingScene(this),
            RecapScene: () => new RecapScene(this),
            TardigradeScene: () => new TardigradeScene(this),
        };

        // Setup canvas
        this._onResize();
        window.addEventListener('resize', this._onResize);

        // Input listeners
        this.canvas.addEventListener('mousedown', this._onMouseDown);
        this.canvas.addEventListener('mousemove', this._onMouseMove);
        this.canvas.addEventListener('mouseup', this._onMouseUp);
        this.canvas.addEventListener('touchstart', this._onTouchStart, { passive: false });
        this.canvas.addEventListener('touchmove', this._onTouchMove, { passive: false });
        this.canvas.addEventListener('touchend', this._onTouchEnd, { passive: false });

        // Click anywhere to init audio
        const audioInit = () => {
            audioManager.init();
            audioManager.resume();
            document.removeEventListener('click', audioInit);
            document.removeEventListener('touchstart', audioInit);
        };
        document.addEventListener('click', audioInit);
        document.addEventListener('touchstart', audioInit);

        // Init UI
        hud = new HUD();
        new EmotionBarsUI();

        // Loading animation
        await this._simulateLoading();

        // Start game
        this.running = true;
        this.lastTime = performance.now();
        this.changeScene('MenuScene');
        requestAnimationFrame(this._gameLoop);
    }

    // --- Loading screen ---
    async _simulateLoading() {
        // Load images
        await Promise.all([
            new Promise(res => { this.assets.characters.onload = res; this.assets.characters.onerror = res; this.assets.characters.src = 'assets/characters.jpg'; }),
            new Promise(res => { this.assets.guide.onload = res; this.assets.guide.onerror = res; this.assets.guide.src = 'assets/guide.jpg'; })
        ]);

        const bar = document.getElementById('loading-bar');
        const text = document.getElementById('loading-text');
        const loadingScreen = document.getElementById('loading-screen');
        const particleContainer = document.getElementById('loading-particles');

        // Create floating particles
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDelay = Math.random() * 4 + 's';
            p.style.animationDuration = (3 + Math.random() * 3) + 's';
            particleContainer?.appendChild(p);
        }

        const steps = [
            { pct: 15, text: 'Preparando el universo...' },
            { pct: 35, text: 'Despertando al guía...' },
            { pct: 55, text: 'Cargando laberintos...' },
            { pct: 75, text: 'Calibrando emociones...' },
            { pct: 90, text: 'Casi listo...' },
            { pct: 100, text: '¡Listo!' },
        ];

        for (const step of steps) {
            await this._delay(400 + Math.random() * 300);
            if (bar) bar.style.width = step.pct + '%';
            if (text) text.textContent = step.text;
        }

        await this._delay(500);
        loadingScreen?.classList.add('fade-out');
        await this._delay(800);
        loadingScreen?.remove();
    }

    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // --- Canvas resize (maintains 9:16 aspect for mobile) ---
    _onResize() {
        const container = document.getElementById('game-container');
        const cw = container.clientWidth;
        const ch = container.clientHeight;

        // Target 9:16 aspect ratio (portrait mobile)
        const targetRatio = 9 / 16;
        let canvasW, canvasH;

        if (cw / ch < targetRatio) {
            canvasW = cw;
            canvasH = cw / targetRatio;
        } else {
            canvasH = ch;
            canvasW = ch * targetRatio;
        }

        // Set display size
        this.canvas.style.width = canvasW + 'px';
        this.canvas.style.height = canvasH + 'px';

        // Set internal resolution (2x for retina)
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = Math.round(canvasW * dpr);
        this.canvas.height = Math.round(canvasH * dpr);
        this.ctx.scale(dpr, dpr);

        this.width = canvasW;
        this.height = canvasH;

        // Position UI overlay to match canvas
        const overlay = document.getElementById('ui-overlay');
        if (overlay) {
            overlay.style.width = canvasW + 'px';
            overlay.style.height = canvasH + 'px';
            overlay.style.left = ((cw - canvasW) / 2) + 'px';
            overlay.style.top = ((ch - canvasH) / 2) + 'px';
        }
    }

    // --- Game loop ---
    _gameLoop(timestamp) {
        if (!this.running) return;

        const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05); // Cap at 50ms
        this.lastTime = timestamp;

        if (!this.paused && this.currentScene) {
            this.currentScene.update(dt);
        }

        // Clear and render
        this.ctx.clearRect(0, 0, this.width, this.height);
        if (this.currentScene) {
            this.currentScene.render(this.ctx);
        }

        requestAnimationFrame(this._gameLoop);
    }

    // --- Scene management ---
    changeScene(sceneName, config = {}) {
        if (this.currentScene && this.currentScene.exit) {
            this.currentScene.exit();
        }

        const factory = this.scenes[sceneName];
        if (!factory) {
            console.error('Scene not found:', sceneName);
            return;
        }

        this.currentSceneName = sceneName;
        this.currentScene = factory();
        if (this.currentScene.enter) {
            this.currentScene.enter(config);
        }

        this.saveProgress();
    }

    // --- Level progression ---
    loadLevel(levelIndex) {
        if (levelIndex < 0 || levelIndex >= LEVELS.length) {
            this.changeScene('MenuScene');
            return;
        }
        this.currentLevel = levelIndex;
        const entry = LEVELS[this.currentLevel];
        this.changeScene(entry.scene, entry.config);
    }

    nextLevel() {
        narratorSystem.clear();
        this.currentLevel = (this.currentLevel || 0) + 1;

        if (!this.saveData) this.saveData = { highestLevel: 0 };
        this.saveData.highestLevel = Math.max(this.saveData.highestLevel || 0, this.currentLevel);
        this.saveProgress();

        this.changeScene('MapScene');
    }

    restartLevel() {
        narratorSystem.clear();
        this.loadLevel(this.currentLevel);
    }

    goToMenu() {
        narratorSystem.clear();
        this.changeScene('MenuScene');
    }

    // --- Insert breathing exercise (from shooter frustration) ---
    insertBreathing(exerciseKey, onComplete) {
        const currentEntry = LEVELS[this.currentLevel];
        this.changeScene('BreathingScene', {
            exerciseKey,
            onComplete: () => {
                if (currentEntry) {
                    this.changeScene(currentEntry.scene, currentEntry.config);
                }
                if (onComplete) onComplete();
            },
        });
    }

    // --- Save/Load ---
    loadAndContinue() {
        const saved = this._loadProgress();
        if (saved) {
            this.saveData = saved;
            this.changeScene('MapScene');
        } else {
            this.currentLevel = 0;
            this.loadLevel(0);
        }
    }

    saveProgress() {
        try {
            if (!this.saveData) this.saveData = { highestLevel: 0 };
            localStorage.setItem('felipe19_progress', JSON.stringify(this.saveData));
        } catch (e) {}
    }

    _loadProgress() {
        try {
            const data = JSON.parse(localStorage.getItem('felipe19_progress'));
            if (data && data.highestLevel !== undefined) {
                this.saveData = data;
                return data;
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    // --- Input handling ---
    _getCanvasCoords(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
    }

    _onMouseDown(e) {
        const pos = this._getCanvasCoords(e.clientX, e.clientY);
        if (this.currentScene?.handleInput) {
            this.currentScene.handleInput('mousedown', pos.x, pos.y);
        }
    }

    _onMouseMove(e) {
        const pos = this._getCanvasCoords(e.clientX, e.clientY);
        if (this.currentScene?.handleInput) {
            this.currentScene.handleInput('mousemove', pos.x, pos.y);
        }
    }

    _onMouseUp(e) {
        const pos = this._getCanvasCoords(e.clientX, e.clientY);
        if (this.currentScene?.handleInput) {
            this.currentScene.handleInput('click', pos.x, pos.y);
            this.currentScene.handleInput('mouseup', pos.x, pos.y);
        }
    }

    _onTouchStart(e) {
        e.preventDefault();
        audioManager.resume();
        const touch = e.touches[0];
        if (touch) {
            const pos = this._getCanvasCoords(touch.clientX, touch.clientY);
            if (this.currentScene?.handleInput) {
                this.currentScene.handleInput('touchstart', pos.x, pos.y);
            }
        }
    }

    _onTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        if (touch) {
            const pos = this._getCanvasCoords(touch.clientX, touch.clientY);
            if (this.currentScene?.handleInput) {
                this.currentScene.handleInput('touchmove', pos.x, pos.y);
            }
        }
    }

    _onTouchEnd(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        if (touch) {
            const pos = this._getCanvasCoords(touch.clientX, touch.clientY);
            if (this.currentScene?.handleInput) {
                this.currentScene.handleInput('touchend', pos.x, pos.y);
                this.currentScene.handleInput('click', pos.x, pos.y);
            }
        }
    }
}

// --- Bootstrap ---
let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new Game();
    window.game = game;
    game.init();
});
