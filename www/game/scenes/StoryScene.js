/* ============================================
   STORY SCENE — Narrative / reflection scenes
   ============================================ */

class StoryScene {
    constructor(game) {
        this.game = game;
        this.dialogueKey = '';
        this.stars = [];
        this.animTimer = 0;
        this.guideBounce = 0;
    }

    enter(config = {}) {
        hud.hide();
        this.dialogueKey = config.dialogueKey || '';
        this.animTimer = 0;

        // Stars
        this.stars = [];
        for (let i = 0; i < 50; i++) {
            this.stars.push({
                x: Math.random() * this.game.width,
                y: Math.random() * this.game.height,
                size: Math.random() * 2 + 0.5,
                brightness: Math.random(),
            });
        }

        // Resolve dialogue key
        const dialogues = this._resolveKey(this.dialogueKey);
        if (dialogues && dialogues.length > 0) {
            setTimeout(() => {
                narratorSystem.say(dialogues, () => {
                    this.game.nextLevel();
                });
            }, 800);
        } else {
            // No dialogues, skip
            setTimeout(() => this.game.nextLevel(), 500);
        }
    }

    _resolveKey(key) {
        const parts = key.split('.');
        let obj = DIALOGUES;
        for (const part of parts) {
            obj = obj?.[part];
        }
        return Array.isArray(obj) ? obj : null;
    }

    update(dt) {
        this.animTimer += dt;
        this.guideBounce = Math.sin(this.animTimer * 2) * 6;
        this.stars.forEach(s => {
            s.brightness = 0.3 + Math.sin(this.animTimer * 2 + s.x * 0.05) * 0.5;
        });
    }

    render(ctx) {
        const w = this.game.width;
        const h = this.game.height;

        // Background
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#0a0e27');
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

        // Draw guide in background
        this._drawGuideSmall(ctx, w * 0.5, h * 0.3 + this.guideBounce);

        // Subtle reflection label
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.font = '14px "Quicksand", sans-serif';
        ctx.fillStyle = '#9fa8da';
        ctx.textAlign = 'center';
        ctx.fillText('~ Momento de reflexión ~', w / 2, h * 0.12);
        ctx.restore();
    }

    _drawGuideSmall(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);

        const radius = 40;
        
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.closePath();
        
        ctx.shadowColor = '#3366ff';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#3366ff';
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        ctx.clip();

        const img = this.game.assets.guide;
        if (img && img.complete) {
            const sx = img.width * 0.25;
            const sy = img.height * 0.20;
            const sw = img.width * 0.50;
            const sh = img.height * 0.50;
            ctx.drawImage(img, sx, sy, sw, sh, -radius, -radius, radius * 2, radius * 2);
        }
        ctx.restore();
    }

    handleInput(type, x, y) {
        // Handled by narrator
    }

    exit() {
        narratorSystem.clear();
    }
}
