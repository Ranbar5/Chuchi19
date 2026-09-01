/* ============================================
   MATH SHOOTER SCENE — Shoot the correct answer
   Galaga-style: the ship fires projectiles that
   travel toward your aim point and collide with
   the descending answer targets.
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
        this.pointerActive = false;
        this.pointerX = 0;
        this.pointerY = 0;
        this.muzzleFlash = 0;
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
        this.pointerActive = false;

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
        this.shipY = this.game.height - 70;

        this.startTime = Date.now();
        hud.show();
        audioManager.startMusic('gameplay');

        // Tutorial
        if (config.isTutorial) {
            setTimeout(() => {
                narratorSystem.say([{
                    speaker: 'guia',
                    text: '¡Hora del Shooter Matemático! Desliza para mover la nave, apunta con calma al objetivo con la respuesta correcta y dispara. ¡Tu puntería también entrena la paciencia! 🎯'
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
        let attempts = 0;
        for (let i = 0; i < numDistractors; i++) {
            let fake;
            do {
                fake = ans + Math.floor(Math.random() * 10) - 5;
                attempts++;
                if (attempts > 50) { fake = ans + i + 1; break; }
            } while (fake === ans || fake < 0 || answers.includes(fake));
            answers.push(fake);
        }

        this._shuffle(answers);

        const targetCount = answers.length;
        const spacing = this.game.width / (targetCount + 1);

        answers.forEach((val, i) => {
            const isCorrect = val === ans;
            this.targets.push({
                x: spacing * (i + 1),
                y: -40 - Math.random() * 60,
                value: val,
                isCorrect: isCorrect,
                radius: 30,
                speed: this.targetSpeed * (0.7 + Math.random() * 0.3),
                angle: Math.random() * Math.PI * 2,
                alive: true,
                hitAnim: 0,
                wobble: Math.random() * Math.PI * 2,
                // Descent path: correct answer drifts slightly to keep it honest
                drift: Math.random() * Math.PI * 2,
            });
        });
    }

    _shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    _fire(x, y) {
        // Direction from ship to aim point
        const dx = x - this.shipX;
        const dy = y - this.shipY;
        const len = Math.hypot(dx, dy) || 1;
        const speed = 850;
        this.projectiles.push({
            x: this.shipX,
            y: this.shipY - 24,
            vx: (dx / len) * speed,
            vy: (dy / len) * speed,
            life: 2.5,
            fromX: this.shipX,
            fromY: this.shipY - 24,
        });
        this.muzzleFlash = 1;
        audioManager.playShoot();
    }

    update(dt) {
        if (this.state !== 'playing') return;
        this.animTimer += dt;
        this.muzzleFlash = Math.max(0, this.muzzleFlash - dt * 6);

        // Stars scroll
        this.stars.forEach(s => {
            s.y += s.speed * dt;
            if (s.y > this.game.height) {
                s.y = -5;
                s.x = Math.random() * this.game.width;
            }
        });

        // Move targets (descend slowly, wobble horizontally)
        this.targets.forEach(t => {
            if (!t.alive) {
                t.hitAnim += dt * 5;
                return;
            }
            t.y += t.speed * 26 * dt;
            t.wobble += dt * 2;
            t.drift += dt * 0.8;
            t.x += Math.sin(t.wobble) * 0.6;

            // Keep inside screen
            if (t.x < t.radius) t.x = t.radius;
            if (t.x > this.game.width - t.radius) t.x = this.game.width - t.radius;

            // If target reaches bottom, miss
            if (t.y > this.shipY - 20) {
                this._onMiss();
            }
        });

        // Move projectiles and detect collisions
        this.projectiles = this.projectiles.filter(p => {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt;

            // Collision with targets
            for (const t of this.targets) {
                if (!t.alive) continue;
                const r = t.radius + 8;
                const dx = p.x - t.x;
                const dy = p.y - t.y;
                if (dx * dx + dy * dy < r * r) {
                    this._shootTarget(t);
                    return false; // projectile consumed
                }
            }

            return p.life > 0 && p.y > -30 && p.x > -30 && p.x < this.game.width + 30;
        });

        // Update particles
        this.particles = this.particles.filter(p => {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt;
            p.vy += 220 * dt; // gravity
            return p.life > 0;
        });
    }

    render(ctx) {
        const w = this.game.width;
        const h = this.game.height;

        // Space background
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#050820');
        bg.addColorStop(0.6, '#0a0e27');
        bg.addColorStop(1, '#0d1438');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);

        // Stars
        this.stars.forEach(s => {
            ctx.fillStyle = `rgba(200, 220, 255, 0.6)`;
            ctx.fillRect(s.x, s.y, s.size, s.size * 2);
        });

        // Problem display
        if (this.currentProblem) {
            ctx.save();
            const boxW = 220;
            const boxH = 52;
            const boxX = w / 2 - boxW / 2;
            const boxY = 60;

            ctx.fillStyle = 'rgba(26, 32, 80, 0.92)';
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.45)';
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
            ctx.fillText(`${this.currentProblem.text} = ?`, w / 2, boxY + boxH / 2);
            ctx.shadowBlur = 0;

            ctx.font = '12px "Quicksand", sans-serif';
            ctx.fillStyle = '#9fa8da';
            ctx.fillText(`Ronda ${this.currentRound}/${this.totalRounds}`, w / 2, boxY - 10);

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

        // Targets (enemy ships)
        this.targets.forEach(t => {
            if (!t.alive) {
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
            this._drawEnemyShip(ctx, t);
        });

        // Aim line while aiming
        if (this.pointerActive) {
            ctx.save();
            ctx.setLineDash([4, 8]);
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.25)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.shipX, this.shipY - 20);
            ctx.lineTo(this.pointerX, this.pointerY);
            ctx.stroke();
            ctx.restore();
        }

        // Projectiles (laser bolts)
        this.projectiles.forEach(p => {
            ctx.save();
            const len = Math.hypot(p.vx, p.vy) || 1;
            const nx = p.vx / len;
            const ny = p.vy / len;
            ctx.strokeStyle = '#7ff3ff';
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.shadowColor = '#00e5ff';
            ctx.shadowBlur = 14;
            ctx.beginPath();
            ctx.moveTo(p.x - nx * 16, p.y - ny * 16);
            ctx.lineTo(p.x + nx * 6, p.y + ny * 6);
            ctx.stroke();
            ctx.shadowBlur = 0;
            // Core
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
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

    _drawEnemyShip(ctx, t) {
        ctx.save();
        ctx.translate(t.x, t.y);

        // Hostile aura for wrong answers, calm cyan for correct
        const main = t.isCorrect ? '#2e6fd8' : '#7a4a9a';
        const glint = t.isCorrect ? 'rgba(0,229,255,0.35)' : 'rgba(255,105,180,0.35)';

        ctx.shadowColor = t.isCorrect ? '#00e5ff' : '#ff6f91';
        ctx.shadowBlur = 14;

        // Saucer body
        const grad = ctx.createLinearGradient(0, -22, 0, 22);
        grad.addColorStop(0, main);
        grad.addColorStop(1, '#141a3a');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(0, 0, t.radius, t.radius * 0.72, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        // Dome
        ctx.fillStyle = 'rgba(160, 230, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(0, -6, t.radius * 0.42, Math.PI, 0);
        ctx.fill();

        // Blinking lights
        const blink = Math.sin(t.wobble * 1.4) * 0.5 + 0.5;
        ctx.fillStyle = t.isCorrect ? `rgba(46,213,115,${0.4 + blink * 0.6})` : `rgba(255,71,87,${0.4 + blink * 0.6})`;
        for (let i = 0; i < 3; i++) {
            const lx = -t.radius * 0.6 + i * t.radius * 0.6;
            ctx.beginPath();
            ctx.arc(lx, t.radius * 0.28, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // Number on the target
        ctx.font = 'bold 20px "Fredoka One", cursive';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 4;
        ctx.fillText(t.value, 0, 2);
        ctx.shadowBlur = 0;

        // Ring highlight
        ctx.strokeStyle = glint;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, t.radius + 6, t.radius * 0.72 + 6, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    }

    _drawShip(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.sin(this.animTimer * 1.5) * 0.04);

        // Engine glow (pulsing)
        const pulse = 6 + Math.sin(this.animTimer * 10) * 3;
        ctx.save();
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 20;
        ctx.fillStyle = 'rgba(0, 229, 255, 0.5)';
        ctx.beginPath();
        ctx.ellipse(0, 22, 7, pulse + 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Engine flame
        const flame = 12 + Math.sin(this.animTimer * 14) * 4;
        ctx.fillStyle = '#ffd166';
        ctx.beginPath();
        ctx.moveTo(-5, 18);
        ctx.lineTo(0, 18 + flame);
        ctx.lineTo(5, 18);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.beginPath();
        ctx.moveTo(-2, 18);
        ctx.lineTo(0, 18 + flame * 0.4);
        ctx.lineTo(2, 18);
        ctx.closePath();
        ctx.fill();

        // Rear wings
        const bodyGrad = ctx.createLinearGradient(-30, 0, 30, 0);
        bodyGrad.addColorStop(0, '#242a6e');
        bodyGrad.addColorStop(0.5, '#3d66d8');
        bodyGrad.addColorStop(1, '#242a6e');

        // Back fins
        ctx.fillStyle = '#1c2a6e';
        ctx.beginPath();
        ctx.moveTo(-16, -4);
        ctx.lineTo(-30, 16);
        ctx.lineTo(-14, 18);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(16, -4);
        ctx.lineTo(30, 16);
        ctx.lineTo(14, 18);
        ctx.closePath();
        ctx.fill();

        // Main body (sleek dart)
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.moveTo(0, -30);
        ctx.lineTo(-8, -12);
        ctx.lineTo(-14, 16);
        ctx.lineTo(-6, 20);
        ctx.lineTo(6, 20);
        ctx.lineTo(14, 16);
        ctx.lineTo(8, -12);
        ctx.closePath();
        ctx.fill();

        // Nose accent
        ctx.fillStyle = '#7ff3ff';
        ctx.beginPath();
        ctx.moveTo(0, -30);
        ctx.lineTo(-5, -14);
        ctx.lineTo(5, -14);
        ctx.closePath();
        ctx.fill();

        // Cockpit dome
        ctx.save();
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 12;
        const cock = ctx.createLinearGradient(0, -18, 0, -4);
        cock.addColorStop(0, '#ccffff');
        cock.addColorStop(1, '#0a6aff');
        ctx.fillStyle = cock;
        ctx.beginPath();
        ctx.ellipse(0, -10, 5, 9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Side engine pods
        ctx.fillStyle = '#2a3a9a';
        ctx.beginPath();
        ctx.ellipse(-12, 14, 4, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(12, 14, 4, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#00e5ff';
        ctx.beginPath();
        ctx.arc(-12, 16, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(12, 16, 2, 0, Math.PI * 2);
        ctx.fill();

        // Wingtip lights
        ctx.save();
        ctx.shadowColor = '#ffd166';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#ffd166';
        ctx.beginPath();
        ctx.arc(-30, 16, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(30, 16, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Muzzle flash
        if (this.muzzleFlash > 0) {
            ctx.fillStyle = `rgba(127, 243, 255, ${this.muzzleFlash})`;
            ctx.beginPath();
            ctx.arc(0, -30, 6 * this.muzzleFlash + 3, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    handleInput(type, x, y) {
        if (this.state !== 'playing') return;
        if (this.completed) return;
        if (narratorSystem.isBusy()) return;

        if (type === 'mousedown' || type === 'touchstart') {
            this.pointerActive = true;
            this.pointerX = x;
            this.pointerY = y;
            // Ship follows your aim horizontally
            this.shipX = Math.max(24, Math.min(this.game.width - 24, x));
        } else if (type === 'mousemove' || type === 'touchmove') {
            this.pointerX = x;
            this.pointerY = y;
            this.shipX = Math.max(24, Math.min(this.game.width - 24, x));
        } else if (type === 'click' || type === 'touchend') {
            this.pointerActive = false;
            this._fire(x, y);
        }
    }

    _shootTarget(target) {
        target.alive = false;
        target.hitAnim = 0;

        // Spawn particles
        const color = target.isCorrect ? '#2ed573' : '#ff4757';
        for (let i = 0; i < 14; i++) {
            this.particles.push({
                x: target.x,
                y: target.y,
                vx: (Math.random() - 0.5) * 320,
                vy: (Math.random() - 0.5) * 320 - 80,
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
            this.targets.forEach(t => { if (t.alive) t.alive = false; });
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
        narratorSystem.clear();
        audioManager.stopMusic();
    }
}