/* ============================================
   COORDINATION SCENE — Bimanual coordination + mental agility
   ============================================ */

class CoordinationScene {
    constructor(game) {
        this.game = game;
        this.config = {};
        this.state = 'intro'; // intro | pattern | mental | complete
        this.patterns = [];
        this.currentPatternIndex = 0;
        this.currentStepIndex = 0;
        this.mentalProblems = [];
        this.currentMentalIndex = 0;
        this.score = 0;
        this.errors = 0;
        this.startTime = 0;
        this.animTimer = 0;
        this.beatTimer = 0;
        this.bpm = 60;
        this.beatInterval = 1000;
        this.showingBeat = false;
        this.leftActive = false;
        this.rightActive = false;
        this.leftFlash = 0;
        this.rightFlash = 0;
        this.completed = false;
        this.phaseIndex = 0; // alternates pattern/mental
        this.totalPhases = 0;
        this.mentalAnswer = null;
        this.mentalOptions = [];
    }

    enter(config = {}) {
        this.config = config;
        this.animTimer = 0;
        this.completed = false;
        this.score = 0;
        this.errors = 0;
        this.phaseIndex = 0;
        this.currentPatternIndex = 0;
        this.currentStepIndex = 0;
        this.currentMentalIndex = 0;
        this.leftFlash = 0;
        this.rightFlash = 0;

        // DDA
        const ddaParams = ddaSystem.getAdjustedParams(config.dda || {});
        this.bpm = ddaParams.bpm || 60;
        this.beatInterval = 60000 / this.bpm;

        // Resolve puzzle
        const puzzleKey = config.puzzleKey || 'coordination.level4';
        const parts = puzzleKey.split('.');
        let puzzle = PUZZLES;
        for (const p of parts) puzzle = puzzle?.[p];

        if (!puzzle) {
            this.game.nextLevel();
            return;
        }

        this.patterns = puzzle.patterns || [];
        this.mentalProblems = puzzle.mentalProblems || [];
        // Phases: pattern, mental, pattern, mental, pattern...
        this.totalPhases = this.patterns.length + Math.min(this.mentalProblems.length, this.patterns.length);

        this.startTime = Date.now();
        hud.show();
        hud.setObjective('Sigue el ritmo: toca el lado que se ilumina');
        audioManager.startMusic('gameplay');

        this.state = 'intro';
        setTimeout(() => {
            narratorSystem.say([{
                speaker: 'guia',
                text: '¡Hora de coordinar mente y cuerpo! Sigue el patrón: toca el lado izquierdo 👈 o derecho 👉 cuando se ilumine. ¡Mantén el ritmo!'
            }], () => {
                this._startNextPhase();
            });
        }, 500);
    }

    _startNextPhase() {
        if (this.phaseIndex >= this.totalPhases) {
            this._onComplete();
            return;
        }

        // Alternate between pattern and mental
        if (this.phaseIndex % 2 === 0) {
            // Pattern phase
            const patIdx = Math.floor(this.phaseIndex / 2);
            if (patIdx < this.patterns.length) {
                this.currentPatternIndex = patIdx;
                this.currentStepIndex = 0;
                this.beatTimer = 0;
                this.bpm = this.patterns[patIdx].bpm || this.bpm;
                this.beatInterval = 60000 / this.bpm;
                this.state = 'pattern';
            } else {
                this.phaseIndex++;
                this._startNextPhase();
            }
        } else {
            // Mental problem
            const menIdx = Math.floor(this.phaseIndex / 2);
            if (menIdx < this.mentalProblems.length) {
                this.currentMentalIndex = menIdx;
                this.state = 'mental';
                this.mentalAnswer = null;
                const prob = this.mentalProblems[menIdx];
                this.mentalOptions = [...prob.options];
            } else {
                this.phaseIndex++;
                this._startNextPhase();
            }
        }
    }

    update(dt) {
        this.animTimer += dt;
        this.leftFlash = Math.max(0, this.leftFlash - dt * 4);
        this.rightFlash = Math.max(0, this.rightFlash - dt * 4);

        if (this.state === 'pattern') {
            this.beatTimer += dt * 1000;
            if (this.beatTimer >= this.beatInterval) {
                this.beatTimer -= this.beatInterval;
                this.currentStepIndex++;

                const pattern = this.patterns[this.currentPatternIndex];
                if (this.currentStepIndex >= pattern.sequence.length) {
                    // Pattern done, move to next phase
                    this.phaseIndex++;
                    setTimeout(() => this._startNextPhase(), 500);
                    this.state = 'intro'; // brief pause
                } else {
                    // Flash the required sides
                    const step = pattern.sequence[this.currentStepIndex];
                    if (step.left) this.leftActive = true;
                    if (step.right) this.rightActive = true;
                    this.showingBeat = true;
                    audioManager.playTap();

                    setTimeout(() => {
                        this.showingBeat = false;
                        this.leftActive = false;
                        this.rightActive = false;
                    }, this.beatInterval * 0.6);
                }
            }
        }
    }

    render(ctx) {
        const w = this.game.width;
        const h = this.game.height;

        // Background
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#0a0e27');
        bg.addColorStop(1, '#1a2050');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);

        // Title
        ctx.font = 'bold 18px "Fredoka One", cursive';
        ctx.fillStyle = '#e8eaf6';
        ctx.textAlign = 'center';
        ctx.fillText('Coordinación y Agilidad', w / 2, 35);

        if (this.state === 'pattern') {
            this._renderPatternPhase(ctx, w, h);
        } else if (this.state === 'mental') {
            this._renderMentalPhase(ctx, w, h);
        }

        // Score
        ctx.font = 'bold 14px "Quicksand", sans-serif';
        ctx.fillStyle = '#ffc107';
        ctx.textAlign = 'right';
        ctx.fillText(`⭐ ${this.score}`, w - 15, h - 15);
    }

    _renderPatternPhase(ctx, w, h) {
        const halfW = w / 2;
        const pattern = this.patterns[this.currentPatternIndex];

        // Pattern name
        ctx.font = '14px "Quicksand", sans-serif';
        ctx.fillStyle = '#9fa8da';
        ctx.textAlign = 'center';
        ctx.fillText(`Patrón: ${pattern?.name || 'Desconocido'}`, w / 2, 60);

        // BPM indicator
        ctx.font = '11px "Quicksand", sans-serif';
        ctx.fillStyle = '#5c6bc0';
        ctx.fillText(`♪ ${this.bpm} BPM`, w / 2, 80);

        // Left zone
        const leftColor = this.leftActive ? '#00e5ff' : 
            this.leftFlash > 0 ? `rgba(46, 213, 115, ${this.leftFlash})` : 'rgba(74, 124, 255, 0.15)';
        ctx.fillStyle = leftColor;
        ctx.fillRect(10, h * 0.25, halfW - 20, h * 0.5);
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, h * 0.25, halfW - 20, h * 0.5);

        // Left hand icon
        ctx.font = '48px serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = this.leftActive ? '#ffffff' : '#9fa8da';
        ctx.fillText('👈', halfW / 2, h * 0.5);
        ctx.font = '14px "Quicksand", sans-serif';
        ctx.fillText('Izquierda', halfW / 2, h * 0.5 + 40);

        // Right zone
        const rightColor = this.rightActive ? '#ffc107' :
            this.rightFlash > 0 ? `rgba(46, 213, 115, ${this.rightFlash})` : 'rgba(255, 193, 7, 0.1)';
        ctx.fillStyle = rightColor;
        ctx.fillRect(halfW + 10, h * 0.25, halfW - 20, h * 0.5);
        ctx.strokeStyle = 'rgba(255, 193, 7, 0.3)';
        ctx.strokeRect(halfW + 10, h * 0.25, halfW - 20, h * 0.5);

        // Right hand icon
        ctx.font = '48px serif';
        ctx.fillStyle = this.rightActive ? '#ffffff' : '#9fa8da';
        ctx.fillText('👉', halfW + halfW / 2, h * 0.5);
        ctx.font = '14px "Quicksand", sans-serif';
        ctx.fillText('Derecha', halfW + halfW / 2, h * 0.5 + 40);

        // Progress
        if (pattern) {
            ctx.font = '11px "Quicksand", sans-serif';
            ctx.fillStyle = '#5c6bc0';
            ctx.textAlign = 'center';
            ctx.fillText(`Paso ${this.currentStepIndex + 1}/${pattern.sequence.length}`, w / 2, h * 0.82);
        }
    }

    _renderMentalPhase(ctx, w, h) {
        const prob = this.mentalProblems[this.currentMentalIndex];
        if (!prob) return;

        // Question
        ctx.font = 'bold 16px "Quicksand", sans-serif';
        ctx.fillStyle = '#e8eaf6';
        ctx.textAlign = 'center';
        ctx.fillText('🧠 Problema Rápido', w / 2, h * 0.25);

        ctx.font = '18px "Quicksand", sans-serif';
        ctx.fillStyle = '#00e5ff';
        ctx.fillText(prob.question, w / 2, h * 0.35);

        // Options
        const optW = 140;
        const optH = 45;
        const startY = h * 0.45;
        const gap = 55;

        this.mentalOptions.forEach((opt, i) => {
            const optX = w / 2 - optW / 2;
            const optY = startY + i * gap;

            ctx.fillStyle = 'rgba(26, 32, 80, 0.8)';
            ctx.strokeStyle = 'rgba(74, 124, 255, 0.3)';
            ctx.lineWidth = 1;
            this._roundRect(ctx, optX, optY, optW, optH, 10);
            ctx.fill();
            ctx.stroke();

            ctx.font = '16px "Quicksand", sans-serif';
            ctx.fillStyle = '#e8eaf6';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(opt, w / 2, optY + optH / 2);

            // Store for click detection
            if (!this._mentalBtns) this._mentalBtns = [];
            this._mentalBtns[i] = { x: optX, y: optY, w: optW, h: optH, value: opt };
        });
    }

    handleInput(type, x, y) {
        if (this.completed) return;
        if (narratorSystem.isBusy()) return;
        if (type !== 'click' && type !== 'touchend') return;

        if (this.state === 'pattern') {
            const halfW = this.game.width / 2;
            const pattern = this.patterns[this.currentPatternIndex];
            const step = pattern?.sequence[this.currentStepIndex];

            if (!step) return;

            const tappedLeft = x < halfW;
            const tappedRight = x >= halfW;

            const correctLeft = step.left && tappedLeft;
            const correctRight = step.right && tappedRight;
            const wrongLeft = !step.left && tappedLeft;
            const wrongRight = !step.right && tappedRight;

            if ((step.left && tappedLeft) || (step.right && tappedRight)) {
                this.score += 5;
                if (tappedLeft) this.leftFlash = 1;
                if (tappedRight) this.rightFlash = 1;
                audioManager.playCorrect();
                ddaSystem.recordAttempt(true, 0, { type: 'coord_tap' });
            } else {
                this.errors++;
                audioManager.playWrong();
                ddaSystem.recordAttempt(false, 0, { type: 'coord_tap' });
            }
        } else if (this.state === 'mental' && this._mentalBtns) {
            const prob = this.mentalProblems[this.currentMentalIndex];
            for (const btn of this._mentalBtns) {
                if (!btn) continue;
                if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
                    if (btn.value === prob.answer) {
                        this.score += 15;
                        audioManager.playCorrect();
                        ddaSystem.recordAttempt(true, 0, { type: 'mental_correct' });
                    } else {
                        this.errors++;
                        audioManager.playWrong();
                        ddaSystem.recordAttempt(false, 0, { type: 'mental_wrong' });
                    }
                    this._mentalBtns = [];
                    this.phaseIndex++;
                    setTimeout(() => this._startNextPhase(), 800);
                    return;
                }
            }
        }
    }

    _onComplete() {
        if (this.completed) return;
        this.completed = true;
        this.state = 'complete';

        const elapsed = (Date.now() - this.startTime) / 1000;
        const rating = ddaSystem.getRating(this.errors, elapsed * 1000, this.totalPhases * 10000);
        const stars = ddaSystem.getStars(rating);
        ddaSystem.recordAttempt(true, elapsed * 1000, { type: 'coord_complete' });

        const rewards = this.config.rewards || {};
        const emotionChanges = {};
        for (const [emotion, values] of Object.entries(rewards)) {
            const change = values[rating] || 0;
            if (change > 0) emotionChanges[emotion] = change;
        }
        if (Object.keys(emotionChanges).length > 0) {
            emotionTracker.modify(emotionChanges, 'Completó coordinación');
        }

        narratorSystem.saySuccess(rating);

        setTimeout(() => {
            hud.showLevelComplete({
                title: '¡Coordinación Completada!',
                stars,
                stats: [
                    { label: 'Puntuación', value: this.score },
                    { label: 'Errores', value: this.errors },
                    { label: 'BPM alcanzado', value: this.bpm },
                ],
                emotionChanges,
            });
        }, 2000);
    }

    _roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    exit() {
        hud.clearObjective();
        audioManager.stopMusic();
    }
}
