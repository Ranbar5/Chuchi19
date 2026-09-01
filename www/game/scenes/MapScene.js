/* ============================================
   MAP SCENE — Level Selector for 100 levels
   ============================================ */

class MapScene {
    constructor(game) {
        this.game = game;
        this.config = {};
        this.nodes = [];
        this.scrollOffset = 0;
        this.targetScroll = 0;
        this.isDragging = false;
        this.lastY = 0;
    }

    enter(config = {}) {
        this.config = config;
        hud.show();
        hud.stopTimer();
        
        // Generate nodes based on total levels
        this.nodes = LEVELS.map((level, i) => {
            return {
                id: i,
                level: level,
                x: this.game.width / 2 + Math.sin(i * 0.5) * 100, // Snake pattern
                y: this.game.height - 150 - (i * 120),
                unlocked: i <= (this.game.saveData?.highestLevel || 0)
            };
        });

        // Center on highest level
        const current = this.game.saveData?.highestLevel || 0;
        if (this.nodes[current]) {
            this.targetScroll = -this.nodes[current].y + this.game.height / 2;
            this.scrollOffset = this.targetScroll;
        }

        // Add event listeners for scroll and click
        this.onDown = this._onDown.bind(this);
        this.onMove = this._onMove.bind(this);
        this.onUp = this._onUp.bind(this);

        this.game.canvas.addEventListener('mousedown', this.onDown);
        this.game.canvas.addEventListener('mousemove', this.onMove);
        this.game.canvas.addEventListener('mouseup', this.onUp);
        this.game.canvas.addEventListener('touchstart', this.onDown);
        this.game.canvas.addEventListener('touchmove', this.onMove);
        this.game.canvas.addEventListener('touchend', this.onUp);
    }

    exit() {
        this.game.canvas.removeEventListener('mousedown', this.onDown);
        this.game.canvas.removeEventListener('mousemove', this.onMove);
        this.game.canvas.removeEventListener('mouseup', this.onUp);
        this.game.canvas.removeEventListener('touchstart', this.onDown);
        this.game.canvas.removeEventListener('touchmove', this.onMove);
        this.game.canvas.removeEventListener('touchend', this.onUp);
    }

    _onDown(e) {
        this.isDragging = true;
        this.lastY = e.touches ? e.touches[0].clientY : e.clientY;
    }

    _onMove(e) {
        if (!this.isDragging) return;
        const y = e.touches ? e.touches[0].clientY : e.clientY;
        const dy = y - this.lastY;
        this.targetScroll += dy;
        this.lastY = y;
    }

    _onUp(e) {
        if (!this.isDragging) return;
        this.isDragging = false;

        // Check node clicks
        const rect = this.game.canvas.getBoundingClientRect();
        const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
        
        const scaleX = this.game.width / rect.width;
        const scaleY = this.game.height / rect.height;
        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;

        const worldY = y - this.scrollOffset;

        for (const node of this.nodes) {
            const dx = node.x - x;
            const dy = node.y - worldY;
            if (dx * dx + dy * dy < 40 * 40 && node.unlocked) {
                audioManager.playClick();
                this.game.currentLevel = node.id;
                this.game.loadLevel(node.id);
                break;
            }
        }
    }

    update(dt) {
        this.scrollOffset += (this.targetScroll - this.scrollOffset) * 10 * dt;
    }

    render(ctx) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, this.game.width, this.game.height);

        ctx.save();
        ctx.translate(0, this.scrollOffset);

        // Draw paths
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#334155';
        if (this.nodes.length > 0) {
            ctx.moveTo(this.nodes[0].x, this.nodes[0].y);
            for (let i = 1; i < this.nodes.length; i++) {
                ctx.lineTo(this.nodes[i].x, this.nodes[i].y);
            }
        }
        ctx.stroke();

        // Draw nodes
        for (const node of this.nodes) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, 30, 0, Math.PI * 2);
            const highest = this.game.saveData?.highestLevel || 0;
            ctx.fillStyle = node.unlocked ? (node.id === highest ? '#fbbf24' : '#38bdf8') : '#475569';
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#fff';
            ctx.stroke();

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 20px "Fredoka One"';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.id + 1, node.x, node.y);
        }

        ctx.restore();

        // Title overlay (opaque to hide nodes scrolling under HUD)
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, this.game.width, 90);
        // Gradient shadow below title
        const grad = ctx.createLinearGradient(0, 90, 0, 110);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 90, this.game.width, 20);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px "Fredoka One"';
        ctx.textAlign = 'center';
        ctx.fillText('Mapa Estelar', this.game.width / 2, 50);
    }
}
