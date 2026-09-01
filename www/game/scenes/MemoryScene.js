/* ============================================
   MEMORY SCENE — Simon Says Memory Game
   ============================================ */

class MemoryScene {
    constructor(game) {
        this.game = game;
        this.config = {};
        this.sequence = [];
        this.playerSequence = [];
        this.state = 'start'; // start | showing | playing | complete
        this.sequenceLength = 3;
        this.speedMs = 1000;
        
        this.nodes = [];
        this.activeNodeIndex = -1;
        this.showTimer = 0;
        this.stepIndex = 0;
        
        this.errors = 0;
        this.startTime = 0;
        this.timeLimit = 120;
        this.completed = false;
        
        this.colors = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#9b59b6', '#00e5ff'];
    }

    enter(config = {}) {
        this.config = config;
        this.completed = false;
        this.errors = 0;
        this.sequence = [];
        this.playerSequence = [];
        this.state = 'start';
        this.activeNodeIndex = -1;

        const ddaParams = ddaSystem.getAdjustedParams(config.dda || {});
        this.sequenceLength = ddaParams.sequenceLength || 4;
        this.speedMs = ddaParams.speedMs || 800;
        this.timeLimit = ddaParams.timeLimit || 120;

        // Generate nodes (buttons)
        this.nodes = [];
        const numNodes = Math.min(6, Math.max(3, Math.floor(this.sequenceLength / 2) + 2)); // 3 to 6 nodes
        
        const cx = this.game.width / 2;
        const cy = this.game.height / 2 + 20;
        const radius = Math.min(this.game.width, this.game.height) * 0.3;
        
        for (let i = 0; i < numNodes; i++) {
            const angle = (i / numNodes) * Math.PI * 2 - Math.PI / 2;
            this.nodes.push({
                id: i,
                x: cx + Math.cos(angle) * radius,
                y: cy + Math.sin(angle) * radius,
                color: this.colors[i % this.colors.length],
                r: 40
            });
        }

        // Generate sequence
        for (let i = 0; i < this.sequenceLength; i++) {
            this.sequence.push(Math.floor(Math.random() * numNodes));
        }

        this.startTime = Date.now();
        hud.show();
        hud.setObjective('Memoriza y repite la secuencia 🧠');
        if (this.timeLimit !== Infinity) {
            hud.startTimer(this.timeLimit, () => this._onTimeout());
        }
        
        audioManager.startMusic('gameplay');

        setTimeout(() => {
            this._startSequence();
        }, 1000);
    }

    _startSequence() {
        this.state = 'showing';
        this.playerSequence = [];
        this.stepIndex = 0;
        this.showTimer = 0;
        this.activeNodeIndex = -1;
    }

    update(dt) {
        if (this.completed) return;
        
        if (this.timeLimit !== Infinity) {
            hud.updateTimer(dt);
        }

        if (this.state === 'showing') {
            this.showTimer -= dt * 1000;
            
            if (this.showTimer <= 0) {
                if (this.activeNodeIndex !== -1) {
                    // Turn off current
                    this.activeNodeIndex = -1;
                    this.showTimer = this.speedMs * 0.3; // Pause between blips
                } else {
                    if (this.stepIndex < this.sequence.length) {
                        // Turn on next
                        this.activeNodeIndex = this.sequence[this.stepIndex];
                        audioManager.playTap();
                        this.stepIndex++;
                        this.showTimer = this.speedMs * 0.7; // Blip duration
                    } else {
                        // Finished showing
                        this.state = 'playing';
                        this.activeNodeIndex = -1;
                    }
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
        bg.addColorStop(1, '#111640');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);

        // Title
        ctx.font = 'bold 20px "Fredoka One", cursive';
        ctx.fillStyle = '#e8eaf6';
        ctx.textAlign = 'center';
        ctx.fillText(this.config.title || 'Memoria Secuencial', w / 2, 75);
        
        ctx.font = '13px "Quicksand", sans-serif';
        ctx.fillStyle = '#9fa8da';
        const msg = this.state === 'showing' ? 'Observa la secuencia...' : '¡Tu turno! Repite la secuencia.';
        ctx.fillText(msg, w / 2, 95);

        // Draw nodes
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const isActive = this.activeNodeIndex === i;
            
            ctx.save();
            ctx.beginPath();
            ctx.arc(node.x, node.y, isActive ? node.r * 1.1 : node.r, 0, Math.PI * 2);
            
            if (isActive) {
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = node.color;
                ctx.shadowBlur = 20;
            } else {
                ctx.fillStyle = node.color;
                ctx.globalAlpha = 0.6;
            }
            
            ctx.fill();
            
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#ffffff';
            ctx.globalAlpha = isActive ? 1 : 0.4;
            ctx.stroke();
            
            ctx.restore();
        }

        // Draw progress dots
        const dotY = this.game.height - 80;
        const startX = w / 2 - ((this.sequenceLength - 1) * 15);
        for (let i = 0; i < this.sequenceLength; i++) {
            ctx.beginPath();
            ctx.arc(startX + i * 30, dotY, 6, 0, Math.PI * 2);
            if (i < this.playerSequence.length) {
                ctx.fillStyle = '#2ed573';
            } else {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            }
            ctx.fill();
        }
    }

    handleInput(type, x, y) {
        if (this.state !== 'playing' || this.completed || narratorSystem.isBusy()) return;
        
        if (type === 'mousedown' || type === 'touchstart') {
            for (let i = 0; i < this.nodes.length; i++) {
                const node = this.nodes[i];
                const dx = node.x - x;
                const dy = node.y - y;
                if (dx * dx + dy * dy < node.r * node.r * 1.5) {
                    this._onNodeClick(i);
                    break;
                }
            }
        }
    }

    _onNodeClick(index) {
        audioManager.playTap();
        
        // Show active briefly
        this.activeNodeIndex = index;
        setTimeout(() => { if (this.activeNodeIndex === index) this.activeNodeIndex = -1; }, 200);

        this.playerSequence.push(index);
        
        // Check if correct so far
        const step = this.playerSequence.length - 1;
        if (this.playerSequence[step] !== this.sequence[step]) {
            this._onError();
            return;
        }

        // Check if completed
        if (this.playerSequence.length === this.sequence.length) {
            audioManager.playCorrect();
            this._onComplete();
        }
    }

    _onError() {
        this.errors++;
        audioManager.playWrong();
        ddaSystem.recordAttempt(false, 0, { type: 'memory_error' });

        if (ddaSystem.shouldTriggerBreathing()) {
            narratorSystem.sayFrustration('moderate');
        } else {
            narratorSystem.sayFrustration('mild');
        }

        // Restart sequence after delay
        this.state = 'start';
        setTimeout(() => {
            this._startSequence();
        }, 1500);
    }

    _onTimeout() {
        this.completed = true;
        hud.stopTimer();
        const elapsed = (Date.now() - this.startTime) / 1000;
        ddaSystem.recordAttempt(false, elapsed * 1000, { type: 'memory_timeout' });

        narratorSystem.say([{
            speaker: 'guia',
            text: '¡Se acabó el tiempo! No te preocupes, cada intento te hace más fuerte. ¿Lo intentamos de nuevo?'
        }], () => {
            this.game.restartLevel();
        });
    }

    _onComplete() {
        this.completed = true;
        hud.stopTimer();

        const elapsed = (Date.now() - this.startTime) / 1000;
        const rating = ddaSystem.getRating(this.errors, elapsed * 1000, this.timeLimit * 1000);
        const stars = ddaSystem.getStars(rating);
        ddaSystem.recordAttempt(true, elapsed * 1000, { type: 'memory_complete', errors: this.errors });

        const emotionChanges = { clarity: 1 };
        if (this.errors === 0) emotionChanges.patience = 2;
        emotionTracker.modify(emotionChanges, 'Completó memoria');

        narratorSystem.saySuccess(rating);

        setTimeout(() => {
            hud.showLevelComplete({
                title: '¡Memoria Superada!',
                stars,
                stats: [
                    { label: 'Tiempo', value: `${Math.round(elapsed)}s` },
                    { label: 'Errores', value: this.errors },
                ],
                emotionChanges,
            });
        }, 1500);
    }

    exit() {
        hud.stopTimer();
        hud.clearObjective();
        audioManager.stopMusic();
    }
}
