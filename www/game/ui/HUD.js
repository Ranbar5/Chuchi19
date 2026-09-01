/* ============================================
   HUD — Top-level game interface manager
   ============================================ */

class HUD {
    constructor() {
        this.hud = document.getElementById('hud');
        this.timerEl = document.getElementById('hud-timer');
        this.timerText = document.getElementById('timer-text');
        this.timerFill = document.getElementById('timer-fill');
        this.btnVault = document.getElementById('btn-vault');
        this.btnPause = document.getElementById('btn-pause');
        this.pauseMenu = document.getElementById('pause-menu');
        this.levelComplete = document.getElementById('level-complete');
        this.vaultPanel = document.getElementById('vault-panel');

        this.timerDuration = 0;
        this.timerRemaining = 0;
        this.timerActive = false;
        this.timerCallback = null;

        this._bindEvents();
    }

    _bindEvents() {
        // Vault button
        this.btnVault?.addEventListener('click', () => {
            audioManager.playClick();
            this.toggleVault();
        });

        // Pause button
        this.btnPause?.addEventListener('click', () => {
            audioManager.playClick();
            this.togglePause();
        });

        // Resume
        document.getElementById('btn-resume')?.addEventListener('click', () => {
            audioManager.playClick();
            this.togglePause();
        });

        // Restart level
        document.getElementById('btn-restart-level')?.addEventListener('click', () => {
            audioManager.playClick();
            this.hidePause();
            if (window.game) game.restartLevel();
        });

        // Main menu
        document.getElementById('btn-main-menu')?.addEventListener('click', () => {
            audioManager.playClick();
            this.hidePause();
            if (window.game) game.goToMenu();
        });

        // Vault close
        document.getElementById('vault-close')?.addEventListener('click', () => {
            audioManager.playClick();
            this.hideVault();
        });

        // Next level
        document.getElementById('btn-next-level')?.addEventListener('click', () => {
            audioManager.playClick();
            this.hideLevelComplete();
            if (window.game) game.nextLevel();
        });
    }

    // --- Show/Hide ---
    show() { this.hud?.classList.remove('hidden'); }
    hide() { this.hud?.classList.add('hidden'); }

    // --- Timer ---
    startTimer(durationSec, onTimeout) {
        this.timerDuration = durationSec;
        this.timerRemaining = durationSec;
        this.timerActive = true;
        this.timerCallback = onTimeout;
        this.timerEl?.classList.remove('hidden');
        this._updateTimerDisplay();
    }

    stopTimer() {
        this.timerActive = false;
        this.timerEl?.classList.add('hidden');
    }

    updateTimer(dt) {
        if (!this.timerActive) return;
        this.timerRemaining -= dt;
        if (this.timerRemaining <= 0) {
            this.timerRemaining = 0;
            this.timerActive = false;
            this._updateTimerDisplay();
            if (this.timerCallback) this.timerCallback();
            return;
        }
        this._updateTimerDisplay();
    }

    _updateTimerDisplay() {
        if (!this.timerText || !this.timerFill) return;
        const secs = Math.ceil(this.timerRemaining);
        this.timerText.textContent = secs;

        const pct = (1 - this.timerRemaining / this.timerDuration) * 100;
        this.timerFill.style.strokeDashoffset = pct;

        // Color changes
        this.timerFill.classList.remove('warning', 'danger');
        if (this.timerRemaining < 10) {
            this.timerFill.classList.add('danger');
        } else if (this.timerRemaining < 30) {
            this.timerFill.classList.add('warning');
        }
    }

    getTimeRemaining() { return this.timerRemaining; }

    // --- Pause ---
    togglePause() {
        if (this.pauseMenu?.classList.contains('hidden')) {
            this.showPause();
        } else {
            this.hidePause();
        }
    }

    showPause() {
        this.pauseMenu?.classList.remove('hidden');
        if (window.game) game.paused = true;
    }

    hidePause() {
        this.pauseMenu?.classList.add('hidden');
        if (window.game) game.paused = false;
    }

    // --- Vault ---
    toggleVault() {
        if (this.vaultPanel?.classList.contains('hidden')) {
            this.showVault();
        } else {
            this.hideVault();
        }
    }

    showVault() {
        vaultSystem.renderToDOM();
        this.vaultPanel?.classList.remove('hidden');
    }

    hideVault() {
        this.vaultPanel?.classList.add('hidden');
    }

    // --- Level Complete ---
    showLevelComplete(data) {
        const starsEl = document.getElementById('complete-stars');
        const titleEl = document.getElementById('complete-title');
        const statsEl = document.getElementById('complete-stats');
        const emotionEl = document.getElementById('complete-emotion-change');

        if (starsEl) {
            const stars = data.stars || 1;
            starsEl.textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
        }

        if (titleEl) {
            titleEl.textContent = data.title || '¡Nivel Completado!';
        }

        if (statsEl) {
            statsEl.innerHTML = '';
            const rows = data.stats || [];
            rows.forEach(({ label, value }) => {
                const row = document.createElement('div');
                row.className = 'stat-row';
                row.innerHTML = `<span class="stat-label">${label}</span><span class="stat-value">${value}</span>`;
                statsEl.appendChild(row);
            });
        }

        if (emotionEl && data.emotionChanges) {
            emotionEl.innerHTML = '';
            const names = { clarity: '🧠 Claridad', patience: '⏳ Paciencia', responsibility: '🎯 Responsabilidad' };
            for (const [key, val] of Object.entries(data.emotionChanges)) {
                if (val !== 0) {
                    const span = document.createElement('span');
                    span.className = `emotion-change ${val > 0 ? 'positive' : 'negative'}`;
                    span.textContent = `${names[key] || key} ${val > 0 ? '+' : ''}${val}`;
                    span.style.display = 'inline-block';
                    span.style.margin = '4px';
                    emotionEl.appendChild(span);
                }
            }
        }

        audioManager.playLevelComplete();
        this.levelComplete?.classList.remove('hidden');
    }

    hideLevelComplete() {
        this.levelComplete?.classList.add('hidden');
    }
}

let hud;
