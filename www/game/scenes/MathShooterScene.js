/* ============================================
   MATH SHOOTER SCENE — Shoot the correct answer
   ============================================ */

class MathShooterScene {
    constructor(game) {
        this.game = game;
        this.config = {};
        this.problems = [];
        this.currentProblem = null;
        this.currentRound = 0;
        this.totalRounds = 8;
        this.targets = [];
        this.projectiles = [];
        this.particles = [];
        this.errors = 0;
        this.consecutiveErrors = 0;
        this.score = 0;
        this.startTime = 0;
        this.completed = false;
        this.state = 'playing'; // playing | breathing | complete
        this.stars = [];
        this.animTimer = 0;
        this.shipX = 0;
        this.shipY = 0;
        this.targetSpeed = 1;
        this.comboCount = 0;
    }

    enter(config = {}) {
        this.config = config;
        this.animTimer = 0;
        this.completed = false;
        this.state = 'playing';
        this.errors = 0;
        this.consecutiveErrors = 0;
        this.score = 0;
        this.currentRound = 0;
        this.comboCount = 0;
        this.projectiles = [];
        this.particles = [];

        // DDA
        const ddaParams = ddaSystem.getAdjustedParams(config.dda || {});
        this.targetSpeed = ddaParams.speed || 1.0;
        const difficulty = ddaParams.baseDifficulty || config.config?.difficulty || 'easy';
        this.totalRounds = config.config?.rounds || 8;
        this.frustrationThreshold = config.config?.frustrationThreshold || 3;

        // Get problems
        this.problems = [...(PUZZLES.mathProblems[difficulty] || PUZZLES.mathProblems.easy)];
        this._shuffle(this.problems);

        // Stars
        this.stars = [];
        for (let i = 0; i < 70; i++) {
            this.stars.push({
                x: Math.random() * this.game.width,
                y: Math.random() * this.game.height,
                size: Math.random() * 1.5 + 0.3,
                speed: Math.random() * 30 + 10,
            });
        }

        // Ship position
        this.shipX = this.game.width / 2;
        this.shipY = this.game.height - 100;

        this.startTime = Date.now();
        hud.show();
        audioManager.startMusic('gameplay');

        // Tutorial
        if (config.isTutorial) {
            setTimeout(() => {
                narratorSystem.say([{
                    speaker: 'guia',
                    text: '¡Hora del Shooter Matemático! Resuelve la operación y toca el objetivo con la respuesta correcta. ¡Apunta bien! 🎯'
                }], () => {
                    this._nextRound();
                });
            }, 500);
        } else {
            this._nextRound();
        }
    }

    _nextRound() {
        if (this.currentRound >= this.totalRounds) {
            this._onComplete();
            return;
        }

        this.currentRound++;

        // Generar problema procedimental
        const minO = this.config.dda?.minOperand || 1;
        const maxO = this.config.dda?.maxOperand || 5;
        const numDistractors = this.config.dda?.distractors || 2;
        
        const a = Math.floor(Math.random() * (maxO - minO + 1)) + minO;
        const b = Math.floor(Math.random() * (maxO - minO + 1)) + minO;
        
        let operator = '+';
        let ans = a + b;
        if (maxO > 15) {
            const roll = Math.random();
            if (roll > 0.6) { operator = '-'; ans = a - Math.min(a, b); }
            else if (roll > 0.3) { operator = 'x'; ans = Math.min(a, 10) * Math.min(b, 10); }
        }

        this.currentProblem = { 
            text: `${operator === '-' ? Math.max(a, b) : a} ${operator} ${operator === '-' ? Math.min(a, b) : b}`, 
            answer: ans 
        };

        // Create targets
        this.targets = [];
        const answers = [ans];
        for (let i = 0; i < numDistractors; i++) {
            let fake;
            do {
                fake = ans + Math.floor(Math.random() * 10) - 5;
            } while (fake === ans || fake < 0 || answers.includes(fake));
            answers.push(fake);
        }
        
        this._shuffle(answers);

        const targetCount = answers.length;
        const spacing = this.game.width / (targetCount + 1);

        answers.forEach((val, i) => {
            this.targets.push({
                x: spacing * (i + 1),
                y: -40 - Math.random() * 60,
                value: val,
                isCorrect: val === ans,
                radius: 28,
                speed: this.targetSpeed * (0.8 + Math.random() * 0.4),
                angle: Math.random() * Math.PI * 2,
                alive: true,
                hitAnim: 0,
                wobble: Math.random() * Math.PI * 2,
            });
        });
    }

    _shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    update(dt) {
        if (this.state !== 'playing') return;
        this.animTimer += dt;

        // Stars scroll
        this.stars.forEach(s => {
            s.y += s.speed * dt;
            if (s.y > this.game.height) {
                s.y = -5;
                s.x = Math.random() * this.game.width;
            }
        });

        // Move targets (float down slowly, wobble horizontally)
        this.targets.forEach(t => {
            if (!t.alive) {
                t.hitAnim += dt * 5;
                return;
            }
            t.y += t.speed * 30 * dt;
            t.wobble += dt * 2;
            t.x += Math.sin(t.wobble) * 0.5;

            // Bounce at edges
            if (t.x < t.radius) t.x = t.radius;
            if (t.x > this.game.width - t.radius) t.x = this.game.width - t.radius;

            // If target reaches bottom, reset round
            if (t.y > this.game.height - 60) {
                this._onMiss();
            }
        });

        // Update projectiles
        this.projectiles = this.projectiles.filter(p => {
            p.y -= 600 * dt;
            p.life -= dt;
            return p.life > 0 && p.y > -20;
        });

        // Update particles
        this.particles = this.particles.filter(p => {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt;
            p.vy += 200 * dt; // gravity
            return p.life > 0;
        });
    }

    render(ctx) {
        const w = this.game.width;
        const h = this.game.height;

        // Space background
        ctx.fillStyle = '#050820';
        ctx.fillRect(0, 0, w, h);

        // Stars
        this.stars.forEach(s => {
            ctx.fillStyle = `rgba(200, 220, 255, 0.6)`;
            ctx.fillRect(s.x, s.y, s.size, s.size * 2);
        });

        // Problem display
        if (this.currentProblem) {
            ctx.save();
            // Problem box
            const boxW = 200;
            const boxH = 50;
            const boxX = w / 2 - boxW / 2;
            const boxY = 70;

            ctx.fillStyle = 'rgba(26, 32, 80, 0.9)';
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
            ctx.lineWidth = 2;
            this._roundRect(ctx, boxX, boxY, boxW, boxH, 12);
            ctx.fill();
            ctx.stroke();

            ctx.font = 'bold 24px "Fredoka One", cursive';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = '#00e5ff';
            ctx.shadowBlur = 10;
            ctx.fillText(`${this.currentProblem.question} = ?`, w / 2, boxY + boxH / 2);
            ctx.shadowBlur = 0;

            // Round counter
            ctx.font = '12px "Quicksand", sans-serif';
            ctx.fillStyle = '#9fa8da';
            ctx.fillText(`Ronda ${this.currentRound}/${this.totalRounds}`, w / 2, boxY - 10);

            // Combo
            if (this.comboCount > 1) {
                ctx.font = 'bold 16px "Fredoka One", cursive';
                ctx.fillStyle = '#ffc107';
                ctx.shadowColor = 'rgba(255,193,7,0.5)';
                ctx.shadowBlur = 10;
                ctx.fillText(`🔥 x${this.comboCount} Combo!`, w / 2, boxY + boxH + 25);
                ctx.shadowBlur = 0;
            }

            ctx.restore();
        }

        // Targets
        this.targets.forEach(t => {
            if (!t.alive) {
                // Explosion animation
                if (t.hitAnim < 1) {
                    ctx.save();
                    ctx.globalAlpha = 1 - t.hitAnim;
                    ctx.fillStyle = t.isCorrect ? '#2ed573' : '#ff4757';
                    ctx.beginPath();
                    ctx.arc(t.x, t.y, t.radius * (1 + t.hitAnim * 2), 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
                return;
            }

            ctx.save();
            // Target glow
            ctx.shadowColor = t.isCorrect ? 'rgba(0,229,255,0.3)' : 'rgba(255,255,255,0.1)';
            ctx.shadowBlur = 12;

            // Target circle
            const grad = ctx.createRadialGradient(t.x - 5, t.y - 5, 2, t.x, t.y, t.radius);
            grad.addColorStop(0, '#3a5ccc');
            grad.addColorStop(1, '#1a2050');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
            ctx.fill();

            // Border
            ctx.strokeStyle = 'rgba(74, 124, 255, 0.6)';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.shadowBlur = 0;

            // Number on target
            ctx.font = 'bold 18px "Fredoka One", cursive';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(t.value, t.x, t.y);

            ctx.restore();
        });

        // Projectiles (lasers)
        this.projectiles.forEach(p => {
            ctx.save();
            ctx.strokeStyle = '#00e5ff';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#00e5ff';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x, p.y + 15);
            ctx.stroke();
            ctx.restore();
        });

        // Particles
        this.particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // Ship
        this._drawShip(ctx, this.shipX, this.shipY);

        // Score
        ctx.font = 'bold 14px "Quicksand", sans-serif';
        ctx.fillStyle = '#ffc107';
        ctx.textAlign = 'right';
        ctx.fillText(`⭐ ${this.score}`, w - 15, h - 15);
    }

    _drawShip(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);

        // Engine glow
        ctx.fillStyle = 'rgba(0, 229, 255, 0.2)';
        ctx.beginPath();
        ctx.ellipse(0, 20, 8, 15 + Math.sin(this.animTimer * 8) * 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillStyle = '#4a7cff';
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(-15, 15);
        ctx.lineTo(-5, 10);
        ctx.lineTo(-5, 20);
        ctx.lineTo(5, 20);
        ctx.lineTo(5, 10);
        ctx.lineTo(15, 15);
        ctx.closePath();
        ctx.fill();

        // Cockpit
        ctx.fillStyle = '#00e5ff';
        ctx.beginPath();
        ctx.ellipse(0, -5, 5, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    handleInput(type, x, y) {
        if (this.state !== 'playing') return;
        if (this.completed) return;
        if (narratorSystem.isBusy()) return;

        if (type === 'click' || type === 'touchend') {
            // Check if tapped a target
            for (const t of this.targets) {
                if (!t.alive) continue;
                const dx = x - t.x;
                const dy = y - t.y;
                if (dx * dx + dy * dy <= t.radius * t.radius * 1.5) {
                    this._shootTarget(t, x, y);
                    return;
                }
            }

            // Fire projectile toward tap position
            this.projectiles.push({
                x: this.shipX,
                y: this.shipY - 20,
                life: 0.5,
            });
            audioManager.playShoot();
        }

        if (type === 'mousemove' || type === 'touchmove') {
            this.shipX = x;
        }
    }

    _shootTarget(target, tapX, tapY) {
        target.alive = false;
        target.hitAnim = 0;

        // Spawn particles
        const color = target.isCorrect ? '#2ed573' : '#ff4757';
        for (let i = 0; i < 12; i++) {
            this.particles.push({
                x: target.x,
                y: target.y,
                vx: (Math.random() - 0.5) * 300,
                vy: (Math.random() - 0.5) * 300 - 100,
                size: Math.random() * 4 + 2,
                color,
                life: 1,
            });
        }

        if (target.isCorrect) {
            audioManager.playExplosion();
            audioManager.playCorrect();
            this.score += 10 * (1 + this.comboCount);
            this.comboCount++;
            this.consecutiveErrors = 0;
            ddaSystem.recordAttempt(true, 0, { type: 'shooter_correct' });

            // Clear remaining targets and next round
            this.targets.forEach(t => t.alive = false);
            setTimeout(() => this._nextRound(), 800);
        } else {
            audioManager.playWrong();
            this.errors++;
            this.consecutiveErrors++;
            this.comboCount = 0;
            ddaSystem.recordAttempt(false, 0, { type: 'shooter_wrong' });

            // Frustration check
            if (this.consecutiveErrors >= this.frustrationThreshold) {
                this.state = 'breathing';
                narratorSystem.sayFrustration('severe');
                // After message, trigger breathing
                setTimeout(() => {
                    this.game.insertBreathing('boxBreathing', () => {
                        this.state = 'playing';
                        this.consecutiveErrors = 0;
                        ddaSystem.resetFrustration();
                    });
                }, 3000);
            } else if (this.consecutiveErrors >= 2) {
                narratorSystem.sayFrustration('mild');
            }
        }
    }

    _onMiss() {
        // Target reached bottom without being shot
        this.errors++;
        this.consecutiveErrors++;
        this.comboCount = 0;
        ddaSystem.recordAttempt(false, 0, { type: 'shooter_miss' });
        audioManager.playWrong();
        this.targets.forEach(t => t.alive = false);
        setTimeout(() => this._nextRound(), 500);
    }

    _onComplete() {
        this.completed = true;
        this.state = 'complete';

        const elapsed = (Date.now() - this.startTime) / 1000;
        const rating = ddaSystem.getRating(this.errors, elapsed * 1000, this.totalRounds * 5000);
        const stars = ddaSystem.getStars(rating);

        const rewards = this.config.rewards || {};
        const emotionChanges = {};
        for (const [emotion, values] of Object.entries(rewards)) {
            const change = values[rating] || 0;
            if (change > 0) emotionChanges[emotion] = change;
        }
        if (Object.keys(emotionChanges).length > 0) {
            emotionTracker.modify(emotionChanges, 'Completó shooter matemático');
        }

        narratorSystem.saySuccess(rating);

        setTimeout(() => {
            hud.showLevelComplete({
                title: '¡Shooter Completado!',
                stars,
                stats: [
                    { label: 'Puntuación', value: this.score },
                    { label: 'Errores', value: this.errors },
                    { label: 'Combo máx.', value: this.comboCount },
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
        audioManager.stopMusic();
    }
}
