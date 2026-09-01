/* ============================================
   NUMBER MAZE SCENE — Numberlink puzzle minigame
   ============================================ */

class NumberMazeScene {
    constructor(game) {
        this.game = game;
        this.grid = [];
        this.gridSize = 4;
        this.cellSize = 60;
        this.offsetX = 0;
        this.offsetY = 0;
        this.numbers = [];
        this.walls = [];
        this.path = [];
        this.currentNumber = 1;
        this.maxNumber = 0;
        this.isDragging = false;
        this.errors = 0;
        this.startTime = 0;
        this.timeLimit = 120;
        this.completed = false;
        this.vaultUnlock = null;
        this.vaultUnlocked = false;
        this.animTimer = 0;
        this.config = {};
        this.isTutorial = false;
        this.tutorialShown = false;
    }

    enter(config = {}) {
        this.config = config;
        this.animTimer = 0;
        this.completed = false;
        this.errors = 0;
        this.path = [];
        this.currentNumber = 1;
        this.isDragging = false;
        this.vaultUnlocked = false;
        this.isTutorial = config.isTutorial || false;
        this.tutorialShown = false;

        // Get DDA-adjusted params
        const ddaParams = ddaSystem.getAdjustedParams(config.dda || {});

        // Resolve puzzle or procedurally generate
        const puzzleKey = config.puzzleKey || '';
        const parts = puzzleKey.split('.');
        let puzzle = PUZZLES;
        for (const p of parts) puzzle = puzzle?.[p];

        this.gridSize = ddaParams.gridSize || puzzle?.size || 4;

        if (puzzle) {
            this.numbers = JSON.parse(JSON.stringify(puzzle.numbers || []));
            this.walls = JSON.parse(JSON.stringify(puzzle.walls || []));
            this.vaultUnlock = puzzle.vaultUnlock || null;
            this.timeLimit = ddaParams.timeLimit || puzzle.timeLimit || 120;
        } else {
            // Generación procedural básica
            this.timeLimit = ddaParams.timeLimit || 120;
            this.numbers = [];
            this.walls = [];
            
            // Colocar N números aleatoriamente (ej. grid 4x4 = max 4 numeros, grid 6x6 = max 6 numeros)
            const numPoints = Math.min(this.gridSize, 6);
            let availableCells = [];
            for(let r=0; r<this.gridSize; r++){
                for(let c=0; c<this.gridSize; c++){
                    availableCells.push({row: r, col: c});
                }
            }
            
            // Shuffle and pick
            for(let i=availableCells.length-1; i>0; i--){
                const j = Math.floor(Math.random() * (i+1));
                [availableCells[i], availableCells[j]] = [availableCells[j], availableCells[i]];
            }
            
            for(let i=1; i<=numPoints; i++){
                const cell = availableCells.pop();
                this.numbers.push({row: cell.row, col: cell.col, value: i});
            }
        }
        
        this.maxNumber = Math.max(...this.numbers.map(n => n.value));

        // Check vault unlock
        if (this.vaultUnlock && vaultSystem.hasItem(this.vaultUnlock.itemId)) {
            // Remove the wall
            this.walls = this.walls.filter(w =>
                !(w.row === this.vaultUnlock.removeWall.row && w.col === this.vaultUnlock.removeWall.col)
            );
            this.vaultUnlocked = true;
            vaultSystem.useVaultItem(this.vaultUnlock.itemId);
        }

        // Build grid
        this._buildGrid();

        // Calculate positioning
        const maxCellSize = Math.min(
            (this.game.width - 40) / this.gridSize,
            (this.game.height - 200) / this.gridSize
        );
        this.cellSize = Math.min(65, maxCellSize);
        this.offsetX = (this.game.width - this.gridSize * this.cellSize) / 2;
        this.offsetY = (this.game.height - this.gridSize * this.cellSize) / 2 + 50;

        // Start
        this.startTime = Date.now();
        hud.show();
        if (this.timeLimit !== Infinity) {
            hud.startTimer(this.timeLimit, () => this._onTimeout());
        }

        audioManager.startMusic('gameplay');

        // Tutorial / vault unlock message
        if (this.vaultUnlocked) {
            setTimeout(() => {
                narratorSystem.say([{ speaker: 'guia', text: this.vaultUnlock.message }]);
            }, 500);
        } else if (this.isTutorial && !this.tutorialShown) {
            this.tutorialShown = true;
            const hint = (puzzle && puzzle.hint) || 'Conecta los números en orden trazando una línea.';
            setTimeout(() => {
                narratorSystem.say([{ speaker: 'guia', text: hint }]);
            }, 500);
        }
    }

    _buildGrid() {
        this.grid = [];
        for (let r = 0; r < this.gridSize; r++) {
            this.grid[r] = [];
            for (let c = 0; c < this.gridSize; c++) {
                const isWall = this.walls.some(w => w.row === r && w.col === c);
                const numObj = this.numbers.find(n => n.row === r && n.col === c);
                this.grid[r][c] = {
                    row: r,
                    col: c,
                    isWall,
                    number: numObj ? numObj.value : null,
                    inPath: false,
                    pathIndex: -1,
                };
            }
        }
    }

    update(dt) {
        this.animTimer += dt;
        if (!this.completed && this.timeLimit !== Infinity) {
            hud.updateTimer(dt);
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
        ctx.fillText(this.config.title || 'Laberinto Numérico', w / 2, 75);
        ctx.font = '13px "Quicksand", sans-serif';
        ctx.fillStyle = '#9fa8da';
        ctx.fillText(`Conecta del 1 al ${this.maxNumber}`, w / 2, 95);

        // Draw grid
        for (let r = 0; r < this.gridSize; r++) {
            for (let c = 0; c < this.gridSize; c++) {
                const cell = this.grid[r][c];
                const x = this.offsetX + c * this.cellSize;
                const y = this.offsetY + r * this.cellSize;

                // Cell background
                if (cell.isWall) {
                    ctx.fillStyle = '#1a1a3e';
                    ctx.fillRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2);
                    // Wall pattern
                    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
                    ctx.lineWidth = 1;
                    for (let i = 0; i < this.cellSize; i += 8) {
                        ctx.beginPath();
                        ctx.moveTo(x + i, y);
                        ctx.lineTo(x, y + i);
                        ctx.stroke();
                    }
                } else if (cell.inPath) {
                    const pathGrad = ctx.createRadialGradient(
                        x + this.cellSize / 2, y + this.cellSize / 2, 0,
                        x + this.cellSize / 2, y + this.cellSize / 2, this.cellSize / 2
                    );
                    pathGrad.addColorStop(0, 'rgba(0, 229, 255, 0.25)');
                    pathGrad.addColorStop(1, 'rgba(0, 229, 255, 0.08)');
                    ctx.fillStyle = pathGrad;
                    ctx.fillRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2);
                } else {
                    ctx.fillStyle = 'rgba(26, 32, 80, 0.6)';
                    ctx.fillRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2);
                }

                // Cell border
                ctx.strokeStyle = 'rgba(74, 124, 255, 0.2)';
                ctx.lineWidth = 1;
                ctx.strokeRect(x + 0.5, y + 0.5, this.cellSize - 1, this.cellSize - 1);

                // Number
                if (cell.number !== null) {
                    const isNext = cell.number === this.currentNumber;
                    const isCollected = cell.inPath;

                    ctx.save();
                    if (isNext && !isCollected) {
                        // Pulse animation for next number
                        const pulse = 1 + Math.sin(this.animTimer * 4) * 0.1;
                        ctx.translate(x + this.cellSize / 2, y + this.cellSize / 2);
                        ctx.scale(pulse, pulse);
                        ctx.translate(-(x + this.cellSize / 2), -(y + this.cellSize / 2));

                        // Glow
                        ctx.shadowColor = '#00e5ff';
                        ctx.shadowBlur = 15;
                    }

                    // Number circle
                    ctx.fillStyle = isCollected ? '#2ed573' :
                        isNext ? '#00e5ff' : '#4a7cff';
                    ctx.beginPath();
                    ctx.arc(x + this.cellSize / 2, y + this.cellSize / 2, this.cellSize * 0.3, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.shadowBlur = 0;

                    // Number text
                    ctx.font = `bold ${this.cellSize * 0.35}px "Fredoka One", cursive`;
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(cell.number, x + this.cellSize / 2, y + this.cellSize / 2);

                    ctx.restore();
                }
            }
        }

        // Draw path line
        if (this.path.length > 1) {
            ctx.strokeStyle = '#00e5ff';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.shadowColor = '#00e5ff';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            for (let i = 0; i < this.path.length; i++) {
                const { row, col } = this.path[i];
                const px = this.offsetX + col * this.cellSize + this.cellSize / 2;
                const py = this.offsetY + row * this.cellSize + this.cellSize / 2;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        // Completion overlay
        if (this.completed) {
            ctx.fillStyle = 'rgba(46, 213, 115, 0.1)';
            ctx.fillRect(0, 0, w, h);
        }
    }

    handleInput(type, x, y) {
        if (this.completed) return;
        if (narratorSystem.isBusy()) return;

        const col = Math.floor((x - this.offsetX) / this.cellSize);
        const row = Math.floor((y - this.offsetY) / this.cellSize);

        if (row < 0 || row >= this.gridSize || col < 0 || col >= this.gridSize) return;

        const cell = this.grid[row]?.[col];
        if (!cell || cell.isWall) return;

        if (type === 'mousedown' || type === 'touchstart') {
            // Start path from number 1 or continue
            if (this.path.length === 0) {
                if (cell.number === 1) {
                    this._addToPath(cell);
                    this.isDragging = true;
                }
            } else {
                // Allow restarting
                this._resetPath();
                if (cell.number === 1) {
                    this._addToPath(cell);
                    this.isDragging = true;
                }
            }
        } else if ((type === 'mousemove' || type === 'touchmove') && this.isDragging) {
            if (!cell.inPath && this.path.length > 0) {
                // Check adjacency
                const last = this.path[this.path.length - 1];
                const dr = Math.abs(cell.row - last.row);
                const dc = Math.abs(cell.col - last.col);
                if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
                    // Check if this cell has the next number or no number
                    if (cell.number === null || cell.number === this.currentNumber) {
                        this._addToPath(cell);
                    } else if (cell.number !== this.currentNumber) {
                        // Wrong number
                        this._onError();
                    }
                }
            }
        } else if (type === 'mouseup' || type === 'touchend') {
            this.isDragging = false;
        }
    }

    _addToPath(cell) {
        cell.inPath = true;
        cell.pathIndex = this.path.length;
        this.path.push({ row: cell.row, col: cell.col });

        if (cell.number === this.currentNumber) {
            audioManager.playCorrect();
            this.currentNumber++;

            if (this.currentNumber > this.maxNumber) {
                this._onComplete();
            }
        } else {
            audioManager.playTap();
        }
    }

    _resetPath() {
        this.path.forEach(p => {
            const cell = this.grid[p.row][p.col];
            cell.inPath = false;
            cell.pathIndex = -1;
        });
        this.path = [];
        this.currentNumber = 1;
    }

    _onError() {
        this.errors++;
        audioManager.playWrong();
        ddaSystem.recordAttempt(false, 0, { type: 'maze_error' });

        // Frustration check
        if (ddaSystem.shouldTriggerBreathing()) {
            narratorSystem.sayFrustration('moderate');
            // Could trigger breathing scene, but for now just show message
        } else if (this.errors >= 2) {
            narratorSystem.sayFrustration('mild');
        }

        this._resetPath();
    }

    _onTimeout() {
        this.completed = true;
        hud.stopTimer();
        const elapsed = (Date.now() - this.startTime) / 1000;
        ddaSystem.recordAttempt(false, elapsed * 1000, { type: 'maze_timeout' });

        narratorSystem.say([{
            speaker: 'guia',
            text: '¡Se acabó el tiempo! No te preocupes, cada intento te hace más fuerte. ¿Lo intentamos de nuevo?'
        }], () => {
            // Restart level
            this.game.restartLevel();
        });
    }

    _onComplete() {
        this.completed = true;
        this.isDragging = false;
        hud.stopTimer();

        const elapsed = (Date.now() - this.startTime) / 1000;
        const rating = ddaSystem.getRating(this.errors, elapsed * 1000, this.timeLimit * 1000);
        const stars = ddaSystem.getStars(rating);
        ddaSystem.recordAttempt(true, elapsed * 1000, { type: 'maze_complete', errors: this.errors });

        // Apply emotion rewards
        const rewards = this.config.rewards || {};
        const emotionChanges = {};
        for (const [emotion, values] of Object.entries(rewards)) {
            const change = values[rating] || 0;
            if (change > 0) {
                emotionChanges[emotion] = change;
            }
        }
        if (Object.keys(emotionChanges).length > 0) {
            emotionTracker.modify(emotionChanges, 'Completó laberinto numérico');
        }

        narratorSystem.saySuccess(rating);

        setTimeout(() => {
            hud.showLevelComplete({
                title: '¡Laberinto Completado!',
                stars,
                stats: [
                    { label: 'Tiempo', value: `${Math.round(elapsed)}s` },
                    { label: 'Errores', value: this.errors },
                    { label: 'Dificultad', value: ddaSystem.getDifficultyLabel() },
                ],
                emotionChanges,
            });
        }, 2000);
    }

    exit() {
        hud.stopTimer();
        audioManager.stopMusic();
    }
}
