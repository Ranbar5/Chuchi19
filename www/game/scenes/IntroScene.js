/* ============================================
   INTRO SCENE — Opening cinematic
   ============================================ */

class IntroScene {
    constructor(game) {
        this.game = game;
        this.dialogueIndex = 0;
        this.dialogues = DIALOGUES.intro;
        this.started = false;
        this.fadeAlpha = 1;
        this.animTimer = 0;
        this.guideX = 0;
        this.guideY = 0;
        this.guideBounce = 0;
        this.stars = [];
    }

    enter() {
        hud.hide();
        this.fadeAlpha = 1;
        this.animTimer = 0;
        this.started = false;

        // Stars
        this.stars = [];
        for (let i = 0; i < 60; i++) {
            this.stars.push({
                x: Math.random() * this.game.width,
                y: Math.random() * this.game.height,
                size: Math.random() * 2 + 0.5,
                brightness: Math.random(),
            });
        }

        this.guideX = this.game.width + 100;
        this.guideY = this.game.height * 0.4;

        // Start dialogues after fade in
        setTimeout(() => {
            this.started = true;
            narratorSystem.say(this.dialogues, () => {
                // After intro dialogues, advance to first level
                this.game.nextLevel();
            });
        }, 2000);
    }

    update(dt) {
        this.animTimer += dt;

        // Fade in
        if (this.fadeAlpha > 0) {
            this.fadeAlpha = Math.max(0, this.fadeAlpha - dt * 0.7);
        }

        // Guide entrance animation
        const targetX = this.game.width * 0.65;
        if (this.started) {
            this.guideX += (targetX - this.guideX) * 0.03;
        }
        this.guideBounce = Math.sin(this.animTimer * 2) * 8;

        // Stars twinkle
        this.stars.forEach(s => {
            s.brightness = 0.3 + Math.sin(this.animTimer * 3 + s.x * 0.1) * 0.7;
        });
    }

    render(ctx) {
        const w = this.game.width;
        const h = this.game.height;

        // Background
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#050820');
        bg.addColorStop(0.6, '#0a0e27');
        bg.addColorStop(1, '#111640');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);

        // Stars
        this.stars.forEach(s => {
            ctx.fillStyle = `rgba(200, 220, 255, ${s.brightness})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // Scene title
        if (this.animTimer > 0.5 && this.animTimer < 3) {
            const titleAlpha = this.animTimer < 1.5 ? (this.animTimer - 0.5) : Math.max(0, 3 - this.animTimer);
            ctx.save();
            ctx.globalAlpha = titleAlpha;
            ctx.font = 'bold 28px "Fredoka One", cursive';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#e8eaf6';
            ctx.shadowColor = '#3366ff';
            ctx.shadowBlur = 20;
            ctx.fillText('Acto I', w / 2, h * 0.15);
            ctx.font = '18px "Quicksand", sans-serif';
            ctx.fillStyle = '#00e5ff';
            ctx.shadowBlur = 10;
            ctx.fillText('Autocontrol e Impulsividad', w / 2, h * 0.15 + 35);
            ctx.restore();
        }

        // Draw Felipe (full-body cartoon)
        this._drawFelipe(ctx, w * 0.3, h * 0.76, Math.min(w, h) / 460, this.animTimer);

        // Draw Guide creature
        this._drawGuide(ctx, this.guideX, this.guideY + this.guideBounce, Math.min(w, h) / 480, this.animTimer);

        // Ground
        ctx.fillStyle = '#111640';
        ctx.fillRect(0, h * 0.75, w, h * 0.25);
        // Ground detail
        const groundGrad = ctx.createLinearGradient(0, h * 0.75, 0, h * 0.78);
        groundGrad.addColorStop(0, '#1a2050');
        groundGrad.addColorStop(1, '#111640');
        ctx.fillStyle = groundGrad;
        ctx.fillRect(0, h * 0.75, w, h * 0.03);

        // Fade overlay
        if (this.fadeAlpha > 0) {
            ctx.fillStyle = `rgba(10, 14, 39, ${this.fadeAlpha})`;
            ctx.fillRect(0, 0, w, h);
        }
    }

    _drawFelipe(ctx, x, y, scale, t) {
        // Full-body cartoon Felipe standing on the ground
        CharacterArt.drawFelipe(ctx, x, y, scale, t);
    }

    _drawGuide(ctx, x, y, scale, t) {
        // Full-body cartoon guide, floating
        CharacterArt.drawGuide(ctx, x, y, scale, t);
    }

    handleInput(type, x, y) {
        if (type === 'click' || type === 'touchstart') {
            if (narratorSystem.isShowing) {
                narratorSystem.advance();
            }
        }
    }

    exit() {}
}
