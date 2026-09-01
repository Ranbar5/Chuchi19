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

        // Draw Felipe (simple character)
        this._drawFelipe(ctx, w * 0.3, h * 0.45);

        // Draw Guide creature
        this._drawGuide(ctx, this.guideX, this.guideY + this.guideBounce);

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

    _drawFelipe(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);
        
        // We want to draw a circular crop of the image
        const radius = 45;
        
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.closePath();
        
        // Add a nice border/glow
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#00e5ff';
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        ctx.clip(); // clip to circle
        
        // Draw image
        const img = this.game.assets.characters;
        if (img && img.complete) {
            // Source crop for Felipe in characters.jpg: left side
            const sx = img.width * 0.18;
            const sy = img.height * 0.15;
            const sw = img.width * 0.35;
            const sh = img.height * 0.35;
            ctx.drawImage(img, sx, sy, sw, sh, -radius, -radius, radius * 2, radius * 2);
        }
        ctx.restore();
    }

    _drawGuide(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);

        const radius = 55;
        
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.closePath();
        
        // Glow and border
        ctx.shadowColor = '#3366ff';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#3366ff';
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        ctx.clip();

        // Draw image
        const img = this.game.assets.guide;
        if (img && img.complete) {
            // Guide is centered in guide.jpg
            const sx = img.width * 0.25;
            const sy = img.height * 0.20;
            const sw = img.width * 0.50;
            const sh = img.height * 0.50;
            ctx.drawImage(img, sx, sy, sw, sh, -radius, -radius, radius * 2, radius * 2);
        }
        ctx.restore();
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
