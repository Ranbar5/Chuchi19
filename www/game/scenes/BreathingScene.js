/* ============================================
   BREATHING SCENE — Guided breathing exercises
   ============================================ */

class BreathingScene {
    constructor(game) {
        this.game = game;
        this.exerciseKey = 'boxBreathing';
        this.exercise = null;
        this.state = 'intro'; // intro | breathing | outro
        this.currentStep = 0;
        this.stepTimer = 0;
        this.stepDuration = 4000;
        this.totalCycles = 3;
        this.currentCycle = 0;
        this.animTimer = 0;
        this.breathProgress = 0;
        this.circleRadius = 0;
        this.targetRadius = 0;
        this.particles = [];
        this.isProgrammed = false;
        this.onComplete = null;
    }

    enter(config = {}) {
        this.exerciseKey = config.exerciseKey || 'boxBreathing';
        this.exercise = DIALOGUES.breathing[this.exerciseKey];
        this.isProgrammed = config.isProgrammed || false;
        this.onComplete = config.onComplete || null;
        this.animTimer = 0;
        this.currentStep = 0;
        this.currentCycle = 0;
        this.stepTimer = 0;
        this.circleRadius = 60;
        this.targetRadius = 60;
        this.particles = [];

        if (!this.exercise) {
            this.exercise = DIALOGUES.breathing.boxBreathing;
        }

        this.totalCycles = this.exerciseKey === 'boxBreathing' ? 3 : 2;

        hud.hide();
        audioManager.startMusic('breathing');

        // Intro
        this.state = 'intro';
        setTimeout(() => {
            narratorSystem.say([{ speaker: 'guia', text: this.exercise.intro }], () => {
                this.state = 'breathing';
                this._startStep();
            });
        }, 500);
    }

    _startStep() {
        if (this.currentStep >= this.exercise.steps.length) {
            this.currentStep = 0;
            this.currentCycle++;
            if (this.currentCycle >= this.totalCycles) {
                this._onComplete();
                return;
            }
        }

        const step = this.exercise.steps[this.currentStep];
        this.stepDuration = step.duration;
        this.stepTimer = 0;

        // Set target radius based on phase
        if (step.phase === 'inhale') {
            this.targetRadius = 120;
            audioManager.playBreathIn();
        } else if (step.phase === 'exhale') {
            this.targetRadius = 50;
            audioManager.playBreathOut();
        } else {
            // hold or rest - keep current
        }

        // Spawn calming particles
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: this.game.width / 2 + (Math.random() - 0.5) * 200,
                y: this.game.height / 2 + (Math.random() - 0.5) * 200,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.5) * 20 - 10,
                size: Math.random() * 4 + 2,
                life: 2 + Math.random() * 2,
                color: step.phase === 'inhale' ? '#00e5ff' :
                    step.phase === 'exhale' ? '#a855f7' : '#ffc107',
            });
        }
    }

    update(dt) {
        this.animTimer += dt;

        if (this.state === 'breathing') {
            this.stepTimer += dt * 1000;

            // Smooth circle radius transition
            this.circleRadius += (this.targetRadius - this.circleRadius) * 0.03;

            if (this.stepTimer >= this.stepDuration) {
                this.currentStep++;
                this._startStep();
            }
        }

        // Update particles
        this.particles = this.particles.filter(p => {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt;
            return p.life > 0;
        });
    }

    render(ctx) {
        const w = this.game.width;
        const h = this.game.height;
        const cx = w / 2;
        const cy = h / 2;

        // Calming gradient background
        const bg = ctx.createRadialGradient(cx, cy, 50, cx, cy, Math.max(w, h));
        bg.addColorStop(0, '#111640');
        bg.addColorStop(1, '#050820');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);

        // Particles
        this.particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = Math.min(1, p.life * 0.5);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        if (this.state === 'breathing') {
            const step = this.exercise.steps[this.currentStep];
            if (!step) return;

            // Breathing circle
            ctx.save();
            
            // Outer glow
            const glow = ctx.createRadialGradient(cx, cy, this.circleRadius * 0.8, cx, cy, this.circleRadius * 1.5);
            const glowColor = step.phase === 'inhale' ? 'rgba(0, 229, 255, 0.1)' :
                step.phase === 'exhale' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(255, 193, 7, 0.1)';
            glow.addColorStop(0, glowColor);
            glow.addColorStop(1, 'transparent');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(cx, cy, this.circleRadius * 1.5, 0, Math.PI * 2);
            ctx.fill();

            // Main circle
            const circleColor = step.phase === 'inhale' ? 'rgba(0, 229, 255, 0.3)' :
                step.phase === 'exhale' ? 'rgba(168, 85, 247, 0.3)' :
                step.phase === 'hold' ? 'rgba(255, 193, 7, 0.3)' : 'rgba(46, 213, 115, 0.3)';
            ctx.fillStyle = circleColor;
            ctx.beginPath();
            ctx.arc(cx, cy, this.circleRadius, 0, Math.PI * 2);
            ctx.fill();

            // Circle border
            const borderColor = step.phase === 'inhale' ? '#00e5ff' :
                step.phase === 'exhale' ? '#a855f7' :
                step.phase === 'hold' ? '#ffc107' : '#2ed573';
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 3;
            ctx.shadowColor = borderColor;
            ctx.shadowBlur = 15;
            ctx.stroke();
            ctx.shadowBlur = 0;

            ctx.restore();

            // Step text
            ctx.font = 'bold 20px "Fredoka One", cursive';
            ctx.fillStyle = '#e8eaf6';
            ctx.textAlign = 'center';
            ctx.fillText(step.text, cx, cy);

            // Timer
            const remaining = Math.ceil((this.stepDuration - this.stepTimer) / 1000);
            ctx.font = 'bold 32px "Fredoka One", cursive';
            ctx.fillStyle = borderColor;
            ctx.fillText(remaining, cx, cy + 45);

            // Cycle counter
            ctx.font = '12px "Quicksand", sans-serif';
            ctx.fillStyle = '#5c6bc0';
            ctx.fillText(`Ciclo ${this.currentCycle + 1}/${this.totalCycles}`, cx, h - 60);

            // Box visualization for box breathing
            if (this.exerciseKey === 'boxBreathing') {
                this._drawBox(ctx, cx, cy - 140, step.phase);
            }
        }

        // Title
        ctx.font = '14px "Quicksand", sans-serif';
        ctx.fillStyle = '#9fa8da';
        ctx.textAlign = 'center';
        ctx.fillText('🧘 Pausa Consciente', cx, 30);
    }

    _drawBox(ctx, cx, cy, phase) {
        const size = 40;
        const x = cx - size / 2;
        const y = cy - size / 2;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, size, size);

        // Highlight current side
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 8;

        const progress = this.stepTimer / this.stepDuration;

        ctx.beginPath();
        if (phase === 'inhale') {
            // Bottom to top (left side)
            ctx.moveTo(x, y + size);
            ctx.lineTo(x, y + size * (1 - progress));
        } else if (phase === 'hold' && this.currentStep === 1) {
            // Left to right (top)
            ctx.moveTo(x, y);
            ctx.lineTo(x + size * progress, y);
        } else if (phase === 'exhale') {
            // Top to bottom (right side)
            ctx.moveTo(x + size, y);
            ctx.lineTo(x + size, y + size * progress);
        } else {
            // Right to left (bottom)
            ctx.moveTo(x + size, y + size);
            ctx.lineTo(x + size * (1 - progress), y + size);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    handleInput(type, x, y) {
        // No direct input needed, breathing is automatic
    }

    _onComplete() {
        this.state = 'outro';
        narratorSystem.say([{ speaker: 'guia', text: this.exercise.outro }], () => {
            emotionTracker.modify({ clarity: 3, patience: 5 }, 'Completó ejercicio de respiración');
            
            if (this.onComplete) {
                this.onComplete();
            } else {
                this.game.nextLevel();
            }
        });
    }

    exit() {
        audioManager.stopMusic();
    }
}
