/* ============================================
   MENU SCENE — Title screen with mode selection
   ============================================ */

class MenuScene {
    constructor(game) {
        this.game = game;
        this.particles = [];
        this.stars = [];
        this.logoY = 0;
        this.logoScale = 0;
        this.selectedMode = 'story';
        this.buttons = [];
        this.animTimer = 0;
        this.state = 'animating'; // animating | ready
    }

    enter() {
        hud.hide();
        audioManager.startMusic('menu');

        // Generate background stars
        this.stars = [];
        for (let i = 0; i < 80; i++) {
            this.stars.push({
                x: Math.random() * this.game.width,
                y: Math.random() * this.game.height,
                size: Math.random() * 2 + 0.5,
                brightness: Math.random(),
                speed: Math.random() * 0.3 + 0.1,
            });
        }

        // Generate floating particles (atoms, DNA, etc.)
        this.particles = [];
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: Math.random() * this.game.width,
                y: Math.random() * this.game.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 20 + 10,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.02,
                type: ['atom', 'planet', 'dna'][Math.floor(Math.random() * 3)],
                opacity: Math.random() * 0.3 + 0.1,
            });
        }

        // Setup buttons
        const cx = this.game.width / 2;
        const btnW = 220;
        const btnH = 50;
        const startY = this.game.height * 0.52;

        this.buttons = [
            { id: 'new_game', label: '🚀 Nueva Aventura', x: cx - btnW / 2, y: startY, w: btnW, h: btnH, primary: true },
            { id: 'continue', label: '▶️ Continuar', x: cx - btnW / 2, y: startY + 65, w: btnW, h: btnH },
            { id: 'challenge', label: '⚡ Modo Desafío', x: cx - btnW / 2, y: startY + 130, w: btnW, h: btnH },
            { id: 'reflection', label: '🧘 Modo Reflexión', x: cx - btnW / 2, y: startY + 195, w: btnW, h: btnH },
        ];

        this.logoY = -100;
        this.logoScale = 0;
        this.animTimer = 0;
        this.state = 'animating';
    }

    update(dt) {
        this.animTimer += dt;

        // Animate logo entrance
        if (this.state === 'animating') {
            this.logoScale = Math.min(1, this.animTimer * 1.5);
            this.logoY = this.game.height * 0.18 + Math.sin(this.animTimer * 2) * 5;
            if (this.animTimer > 1.0) this.state = 'ready';
        } else {
            this.logoY = this.game.height * 0.18 + Math.sin(this.animTimer * 1.5) * 5;
        }

        // Update stars
        this.stars.forEach(s => {
            s.brightness = 0.3 + Math.sin(this.animTimer * s.speed * 5 + s.x) * 0.7;
        });

        // Update particles
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotSpeed;
            if (p.x < -50) p.x = this.game.width + 50;
            if (p.x > this.game.width + 50) p.x = -50;
            if (p.y < -50) p.y = this.game.height + 50;
            if (p.y > this.game.height + 50) p.y = -50;
        });
    }

    render(ctx) {
        const w = this.game.width;
        const h = this.game.height;

        // Background gradient
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#0a0e27');
        bg.addColorStop(0.5, '#111640');
        bg.addColorStop(1, '#0d1233');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);

        // Stars
        this.stars.forEach(s => {
            ctx.fillStyle = `rgba(200, 220, 255, ${s.brightness})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // Floating particles
        this.particles.forEach(p => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.globalAlpha = p.opacity;

            if (p.type === 'atom') {
                // Draw atom-like shape
                ctx.strokeStyle = '#4a7cff';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.ellipse(0, 0, p.size, p.size * 0.4, 0, 0, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();
                ctx.ellipse(0, 0, p.size, p.size * 0.4, Math.PI / 3, 0, Math.PI * 2);
                ctx.stroke();
                ctx.fillStyle = '#00e5ff';
                ctx.beginPath();
                ctx.arc(0, 0, 3, 0, Math.PI * 2);
                ctx.fill();
            } else if (p.type === 'planet') {
                // Draw planet
                const grad = ctx.createRadialGradient(-2, -2, 1, 0, 0, p.size * 0.5);
                grad.addColorStop(0, '#7ba4ff');
                grad.addColorStop(1, '#1a2050');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
                ctx.fill();
                // Ring
                ctx.strokeStyle = 'rgba(255, 193, 7, 0.4)';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.ellipse(0, 0, p.size * 0.8, p.size * 0.2, 0.3, 0, Math.PI * 2);
                ctx.stroke();
            } else {
                // DNA helix
                ctx.strokeStyle = '#00e5ff';
                ctx.lineWidth = 1.5;
                for (let i = 0; i < 6; i++) {
                    const yy = -p.size + i * (p.size / 3);
                    const xx = Math.sin(i * 1.2 + this.animTimer) * 6;
                    ctx.beginPath();
                    ctx.arc(xx, yy, 2, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }

            ctx.restore();
        });

        // Logo glow
        const cx = w / 2;
        ctx.save();
        ctx.translate(cx, this.logoY);
        ctx.scale(this.logoScale, this.logoScale);

        // Glow circle
        const glow = ctx.createRadialGradient(0, 0, 10, 0, 0, 120);
        glow.addColorStop(0, 'rgba(0, 229, 255, 0.15)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, 120, 0, Math.PI * 2);
        ctx.fill();

        // Title: FELIPE
        ctx.font = 'bold 48px "Fredoka One", cursive';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#e8eaf6';
        ctx.shadowColor = '#3366ff';
        ctx.shadowBlur = 30;
        ctx.fillText('FELIPE', -30, 10);

        // Title: 19
        ctx.font = 'bold 48px "Fredoka One", cursive';
        ctx.fillStyle = '#ffc107';
        ctx.shadowColor = 'rgba(255, 193, 7, 0.5)';
        ctx.shadowBlur = 20;
        ctx.textAlign = 'left';
        const felipeW = ctx.measureText('FELIPE').width;
        ctx.fillText('19', felipeW / 2 - 30 + 5, 10);

        // Subtitle
        ctx.shadowBlur = 0;
        ctx.font = '600 11px "Quicksand", sans-serif';
        ctx.fillStyle = '#00e5ff';
        ctx.textAlign = 'center';
        ctx.fillText('EXPLORO • APRENDO • DESCUBRO', 0, 40);

        ctx.restore();

        // Buttons
        if (this.state === 'ready') {
            this.buttons.forEach((btn, i) => {
                const alpha = Math.min(1, (this.animTimer - 1.0 - i * 0.15) * 3);
                if (alpha <= 0) return;

                ctx.save();
                ctx.globalAlpha = alpha;

                // Button background
                if (btn.primary) {
                    const grad = ctx.createLinearGradient(btn.x, btn.y, btn.x + btn.w, btn.y + btn.h);
                    grad.addColorStop(0, '#4a7cff');
                    grad.addColorStop(1, '#00e5ff');
                    ctx.fillStyle = grad;
                    ctx.shadowColor = 'rgba(74, 124, 255, 0.5)';
                    ctx.shadowBlur = 15;
                } else {
                    ctx.fillStyle = 'rgba(26, 32, 80, 0.8)';
                    ctx.strokeStyle = 'rgba(74, 124, 255, 0.3)';
                    ctx.lineWidth = 1;
                }

                // Rounded rect
                this._roundRect(ctx, btn.x, btn.y, btn.w, btn.h, 14);
                ctx.fill();
                if (!btn.primary) {
                    this._roundRect(ctx, btn.x, btn.y, btn.w, btn.h, 14);
                    ctx.stroke();
                }

                // Button text
                ctx.shadowBlur = 0;
                ctx.font = `${btn.primary ? 'bold ' : ''}16px "Quicksand", sans-serif`;
                ctx.fillStyle = btn.primary ? '#ffffff' : '#e8eaf6';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2);

                ctx.restore();
            });

            // Footer
            const footerAlpha = Math.min(1, (this.animTimer - 2.0) * 2);
            if (footerAlpha > 0) {
                ctx.save();
                ctx.globalAlpha = footerAlpha * 0.4;
                ctx.font = '11px "Quicksand", sans-serif';
                ctx.fillStyle = '#9fa8da';
                ctx.textAlign = 'center';
                ctx.fillText('Aventura de Inteligencia Emocional', cx, h - 30);
                ctx.restore();
            }
        }
    }

    handleInput(type, x, y) {
        if (this.state !== 'ready') return;
        if (type !== 'click' && type !== 'touchend') return;

        for (const btn of this.buttons) {
            if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
                audioManager.playClick();

                switch (btn.id) {
                    case 'new_game':
                        ddaSystem.reset();
                        emotionTracker.reset();
                        vaultSystem.reset();
                        ddaSystem.setMode('story');
                        if (this.game.saveData && this.game.saveData.highestLevel > 0) {
                            this.game.changeScene('MapScene');
                        } else {
                            this.game.currentLevel = 0;
                            this.game.loadLevel(0);
                        }
                        break;
                    case 'continue':
                        this.game.loadAndContinue();
                        break;
                    case 'challenge':
                        ddaSystem.reset();
                        emotionTracker.reset();
                        vaultSystem.reset();
                        ddaSystem.setMode('challenge');
                        this.game.currentLevel = 0;
                        this.game.changeScene('IntroScene');
                        break;
                    case 'reflection':
                        ddaSystem.reset();
                        emotionTracker.reset();
                        vaultSystem.reset();
                        ddaSystem.setMode('reflection');
                        this.game.currentLevel = 0;
                        this.game.changeScene('IntroScene');
                        break;
                }
                return;
            }
        }
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
