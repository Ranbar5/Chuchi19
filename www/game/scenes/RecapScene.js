/* ============================================
   RECAP SCENE — End of Act summary
   ============================================ */

class RecapScene {
    constructor(game) {
        this.game = game;
        this.animTimer = 0;
        this.state = 'entering'; // entering | showing | tips | closing
        this.recapData = null;
        this.tipIndex = 0;
        this.stars = [];
    }

    enter() {
        this.animTimer = 0;
        this.state = 'entering';
        this.tipIndex = 0;
        hud.hide();
        audioManager.startMusic('recap');

        this.recapData = emotionTracker.getRecapData();

        // Stars
        this.stars = [];
        for (let i = 0; i < 40; i++) {
            this.stars.push({
                x: Math.random() * this.game.width,
                y: Math.random() * this.game.height,
                size: Math.random() * 2 + 0.5,
                brightness: Math.random(),
            });
        }

        // Start recap dialogue
        setTimeout(() => {
            this.state = 'showing';
            const recap = DIALOGUES.recap;
            const recapDialogues = [{ speaker: 'guia', text: recap.intro }];

            // Add emotion-specific feedback
            const categories = this.recapData.categories;
            for (const [emotion, category] of Object.entries(categories)) {
                const segment = recap.segments[emotion]?.[category];
                if (segment) {
                    recapDialogues.push({ speaker: 'guia', text: segment });
                }
            }

            narratorSystem.say(recapDialogues, () => {
                this.state = 'tips';
                this._showTips();
            });
        }, 1500);
    }

    _showTips() {
        const tips = DIALOGUES.recap.realLife;
        const tipDialogues = tips.map(tip => ({ speaker: 'guia', text: tip }));
        tipDialogues.push({ speaker: 'guia', text: DIALOGUES.recap.closing });

        narratorSystem.say(tipDialogues, () => {
            this.state = 'closing';
            // Show final screen with button
        });
    }

    update(dt) {
        this.animTimer += dt;
        this.stars.forEach(s => {
            s.brightness = 0.3 + Math.sin(this.animTimer * 1.5 + s.x * 0.05) * 0.5;
        });
    }

    render(ctx) {
        const w = this.game.width;
        const h = this.game.height;

        // Background
        const bg = ctx.createRadialGradient(w / 2, h / 3, 50, w / 2, h / 3, Math.max(w, h));
        bg.addColorStop(0, '#1a2050');
        bg.addColorStop(1, '#0a0e27');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);

        // Stars
        this.stars.forEach(s => {
            ctx.fillStyle = `rgba(200, 220, 255, ${s.brightness})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // Title
        ctx.save();
        const titleAlpha = Math.min(1, this.animTimer * 2);
        ctx.globalAlpha = titleAlpha;
        ctx.font = 'bold 24px "Fredoka One", cursive';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffc107';
        ctx.shadowColor = 'rgba(255, 193, 7, 0.3)';
        ctx.shadowBlur = 15;
        ctx.fillText('🏆 Acto I Completado', w / 2, 45);
        ctx.shadowBlur = 0;

        ctx.font = '13px "Quicksand", sans-serif';
        ctx.fillStyle = '#9fa8da';
        ctx.fillText('Autocontrol e Impulsividad', w / 2, 70);
        ctx.restore();

        // Emotion summary bars
        if (this.recapData && this.animTimer > 1) {
            const barAlpha = Math.min(1, (this.animTimer - 1) * 2);
            ctx.save();
            ctx.globalAlpha = barAlpha;

            const emotions = [
                { key: 'clarity', icon: '🧠', label: 'Claridad Emocional', color: '#a855f7' },
                { key: 'patience', icon: '⏳', label: 'Paciencia', color: '#06b6d4' },
                { key: 'responsibility', icon: '🎯', label: 'Responsabilidad', color: '#f59e0b' },
            ];

            const barStartY = h * 0.15;
            const barW = w * 0.65;
            const barX = (w - barW) / 2;

            emotions.forEach((em, i) => {
                const y = barStartY + i * 55;
                const val = this.recapData.emotions[em.key];

                // Label
                ctx.font = '12px "Quicksand", sans-serif';
                ctx.fillStyle = '#9fa8da';
                ctx.textAlign = 'left';
                ctx.fillText(`${em.icon} ${em.label}`, barX, y);

                // Bar track
                ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
                this._roundRect(ctx, barX, y + 8, barW, 14, 7);
                ctx.fill();

                // Bar fill (animated)
                const fillW = Math.min(barW, barW * (val / 100) * Math.min(1, (this.animTimer - 1) * 0.8));
                const grad = ctx.createLinearGradient(barX, 0, barX + fillW, 0);
                grad.addColorStop(0, em.color);
                grad.addColorStop(1, em.color + '88');
                ctx.fillStyle = grad;
                this._roundRect(ctx, barX, y + 8, fillW, 14, 7);
                ctx.fill();

                // Value text
                ctx.font = 'bold 12px "Quicksand", sans-serif';
                ctx.fillStyle = '#e8eaf6';
                ctx.textAlign = 'right';
                ctx.fillText(`${val}%`, barX + barW + 30, y + 19);
            });

            // Overall
            ctx.font = 'bold 14px "Fredoka One", cursive';
            ctx.fillStyle = '#00e5ff';
            ctx.textAlign = 'center';
            ctx.fillText(`Desarrollo General: ${this.recapData.overall}%`, w / 2, barStartY + 180);

            // Vault stats
            const vaultStats = vaultSystem.getStats();
            ctx.font = '11px "Quicksand", sans-serif';
            ctx.fillStyle = '#ffc107';
            ctx.fillText(
                `🔒 Bóveda: ${vaultStats.totalStored} guardados | ${vaultStats.totalUsedLater} usados después`,
                w / 2, barStartY + 205
            );
            const ratio = Math.round(vaultStats.delayedGratificationRatio * 100);
            ctx.fillStyle = '#9fa8da';
            ctx.fillText(`Índice de Gratificación Diferida: ${ratio}%`, w / 2, barStartY + 225);

            ctx.restore();
        }

        // "Return to Menu" button when closing
        if (this.state === 'closing') {
            const btnW = 200;
            const btnH = 48;
            const btnX = w / 2 - btnW / 2;
            const btnY = h - 100;

            const grad = ctx.createLinearGradient(btnX, btnY, btnX + btnW, btnY + btnH);
            grad.addColorStop(0, '#4a7cff');
            grad.addColorStop(1, '#00e5ff');
            ctx.fillStyle = grad;
            ctx.shadowColor = 'rgba(74, 124, 255, 0.5)';
            ctx.shadowBlur = 15;
            this._roundRect(ctx, btnX, btnY, btnW, btnH, 14);
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.font = 'bold 16px "Quicksand", sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🏠 Menú Principal', w / 2, btnY + btnH / 2);

            this._menuBtn = { x: btnX, y: btnY, w: btnW, h: btnH };
        }
    }

    handleInput(type, x, y) {
        if (type !== 'click' && type !== 'touchend') return;

        if (this.state === 'closing' && this._menuBtn) {
            const btn = this._menuBtn;
            if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
                audioManager.playClick();
                this.game.goToMenu();
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
