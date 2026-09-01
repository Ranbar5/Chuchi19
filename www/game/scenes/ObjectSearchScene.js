/* ============================================
   OBJECT SEARCH SCENE — Find hidden objects
   ============================================ */

// Pools of emoji icons (keep target/decoy pools disjoint)
const OBJECT_SEARCH_TARGET_POOL = [
    '🪙', '💎', '⭐', '🍬', '🧪', '🎈', '⚽', '📚', '🍎', '🌵',
    '🎸', '🧢', '🔮', '🕰️', '📦', '🌻', '🐚', '🍕', '⚙️', '✈️',
];
const OBJECT_SEARCH_KEY_POOL = ['🔑', '🗺️', '🔍', '🗝️', '🎯'];
const OBJECT_SEARCH_DECOY_POOL = [
    '🍌', '🥑', '🍩', '🧸', '✏️', '🖍️', '♟️', '🖱️', '⌚', '📷',
    '🎧', '🏓', '🍇', '🍊', '🧀', '🥨', '🍪', '🧁', '🥕', '🌽',
    '🥦', '🦋', '🐟', '🪴', '🧵', '🪀', '🥄', '🧃',
];

function _shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

class ObjectSearchScene {
    constructor(game) {
        this.game = game;
        this.config = {};
        this.objects = [];
        this.decoys = [];
        this.foundObjects = [];
        this.score = 0;
        this.errors = 0;
        this.startTime = 0;
        this.timeLimit = 90;
        this.completed = false;
        this.animTimer = 0;
        this.showVaultChoice = false;
        this.pendingItem = null;
        this.requiredKeys = 1;
        this.foundKeys = 0;
        this.sparkles = [];
    }

    enter(config = {}) {
        this.config = config;
        this.animTimer = 0;
        this.completed = false;
        this.foundObjects = [];
        this.decoys = [];
        this.score = 0;
        this.errors = 0;
        this.foundKeys = 0;
        this.showVaultChoice = false;
        this.pendingItem = null;
        this.sparkles = [];

        // DDA
        const ddaParams = ddaSystem.getAdjustedParams(config.dda || {});
        this.timeLimit = ddaParams.timeLimit || 90;

        // Objetivos: solo 5 o 6 (el DDA decide entre ambos)
        const targetCount = Math.min(6, Math.max(5, ddaParams.itemsToFind || 5));
        this.requiredKeys = 1;

        // Elegir íconos objetivo distintos al azar
        const pool = _shuffleArray([...OBJECT_SEARCH_TARGET_POOL]);
        const icons = pool.slice(0, targetCount);

        // Solo UNO es "especial" (se guarda en la bóveda)
        const specialIndex = Math.floor(Math.random() * targetCount);
        const specialIcons = _shuffleArray([...OBJECT_SEARCH_KEY_POOL]);

        this.objects = icons.map((icon, i) => {
            const isSpecial = i === specialIndex;
            const pos = this._pickSpot();
            return {
                id: `target_${i}`,
                name: isSpecial ? this._specialName(icon) : this._decoName(icon),
                icon: isSpecial ? specialIcons[0] : icon,
                x: pos.x,
                y: pos.y,
                screenX: pos.x * this.game.width,
                screenY: pos.y * this.game.height,
                isKey: isSpecial,
                futureUse: isSpecial ? this._specialFutureUse(specialIcons[0]) : null,
                points: isSpecial ? 0 : (13 + Math.floor(Math.random() * 13)),
                found: false,
                pulsePhase: Math.random() * Math.PI * 2,
            };
        });

        // Llenar la pantalla con objetos "señuelo" que NO hay que buscar
        const decoyCount = Math.min(30, 16 + targetCount * 2);
        const decoyPool = _shuffleArray([...OBJECT_SEARCH_DECOY_POOL]);
        for (let i = 0; i < decoyCount; i++) {
            const pos = this._pickSpot();
            this.decoys.push({
                id: `decoy_${i}`,
                icon: decoyPool[i % decoyPool.length],
                x: pos.x,
                y: pos.y,
                screenX: pos.x * this.game.width,
                screenY: pos.y * this.game.height,
                hitAnim: 0,
                scale: 0.7 + Math.random() * 0.5,
                alpha: 0.55 + Math.random() * 0.3,
            });
        }

        // Generate sparkles near target objects
        this.objects.forEach(obj => {
            for (let i = 0; i < 3; i++) {
                this.sparkles.push({
                    x: obj.screenX + (Math.random() - 0.5) * 40,
                    y: obj.screenY + (Math.random() - 0.5) * 40,
                    size: Math.random() * 3 + 1,
                    phase: Math.random() * Math.PI * 2,
                    objectId: obj.id,
                });
            }
        });

        this.startTime = Date.now();
        hud.show();
        this._updateObjective();
        if (this.timeLimit !== Infinity) {
            hud.startTimer(this.timeLimit, () => this._onTimeout());
        }
        audioManager.startMusic('gameplay');

        const sceneName = this.config.title || 'Laboratorio Estelar';
        setTimeout(() => {
            narratorSystem.say([{
                speaker: 'guia',
                text: `¡Bienvenido al ${sceneName}! La sala está llena de objetos… busca solo ${targetCount}. De ellos, SOLO UNO es especial: guárdalo en la bóveda. 🔍`
            }]);
        }, 500);
    }

    // --- Random spot (avoid top title band and bottom dock) ---
    _pickSpot() {
        return {
            x: 0.06 + Math.random() * 0.88,
            y: 0.13 + Math.random() * 0.70,
        };
    }

    _specialName(icon) {
        const names = {
            '🔑': 'Llave Cristal', '🗺️': 'Mapa Estelar', '🔍': 'Lente Emocional',
            '🗝️': 'Llave Dorada', '🎯': 'Punto Especial',
        };
        return names[icon] || 'Objeto Especial';
    }

    _specialFutureUse(icon) {
        const uses = {
            '🔑': 'Puede abrir puertas secretas en laberintos',
            '🗺️': 'Revela caminos ocultos en futuras misiones',
            '🔍': 'Permite ver las emociones de los NPCs en el Acto II',
            '🗝️': 'Abre el cofre de la paciencia en el Acto III',
            '🎯': 'Tu puntería emocional será clave en el Acto Final',
        };
        return uses[icon] || 'Podría servir después...';
    }

    _decoName(icon) {
        const map = {
            '🪙': 'Moneda Brillante', '💎': 'Gema Pequeña', '⭐': 'Estrella Fugaz',
            '🍬': 'Dulce Espacial', '🧪': 'Poción Misteriosa', '🎈': 'Globo Galáctico',
            '⚽': 'Balón Estelar', '📚': 'Libro Antiguo', '🍎': 'Manzana', '🌵': 'Cactus',
            '🎸': 'Guitarra', '🧢': 'Gorra', '🔮': 'Bola de Cristal', '🕰️': 'Reloj',
            '📦': 'Caja', '🌻': 'Girasol', '🐚': 'Caracola', '🍕': 'Pizza Espacial',
            '⚙️': 'Engranaje', '✈️': 'Nave Pequeña',
        };
        return map[icon] || 'Objeto';
    }

    _updateObjective() {
        const total = this.objects.length;
        const found = this.foundObjects.length;
        const icons = this.objects.map(o => o.found ? '✅' : o.icon).join(' ');
        const specialLeft = this.objects.some(o => o.isKey && !o.found);
        const specialTxt = specialLeft ? ' ¡Guarda el especial!🔒' : '';
        hud.setObjective(`Encuentra (${found}/${total}): ${icons}${specialTxt}`);
    }

    update(dt) {
        this.animTimer += dt;
        if (!this.completed && this.timeLimit !== Infinity) {
            hud.updateTimer(dt);
        }
        // Sparkle animation
        this.sparkles.forEach(s => {
            const obj = this.objects.find(o => o.id === s.objectId);
            if (obj && !obj.found) {
                s.phase += dt * 3;
            }
        });
        // Decoy shake decay
        this.decoys.forEach(d => {
            if (d.hitAnim > 0) d.hitAnim = Math.max(0, d.hitAnim - dt * 2);
        });
    }

    render(ctx) {
        const w = this.game.width;
        const h = this.game.height;

        // Lab background
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#111640');
        bg.addColorStop(0.5, '#1a2050');
        bg.addColorStop(1, '#0d1233');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);

        // Lab elements (shelves, tables, equipment)
        this._drawLabBackground(ctx, w, h);

        // Title
        ctx.font = 'bold 18px "Fredoka One", cursive';
        ctx.fillStyle = '#e8eaf6';
        ctx.textAlign = 'center';
        ctx.fillText(this.config.title || 'Búsqueda de Objetos', w / 2, 35);

        // Counter
        ctx.font = '12px "Quicksand", sans-serif';
        ctx.fillStyle = '#9fa8da';
        ctx.fillText(`Encontrados: ${this.foundObjects.length}/${this.objects.length} · Especial: ${this.foundKeys}/${this.requiredKeys}`, w / 2, 57);

        // Draw decoys (distractors — NOT findable)
        this.decoys.forEach(dec => {
            const shakeX = dec.hitAnim > 0 ? Math.sin(this.animTimer * 40) * 4 * dec.hitAnim : 0;
            ctx.save();
            ctx.globalAlpha = dec.alpha;
            ctx.font = `${Math.round(24 * dec.scale)}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(dec.icon, dec.screenX + shakeX, dec.screenY);
            ctx.restore();
        });

        // Draw target objects (hidden and found) — draw AFTER decoys so
        // targets (with their pulse/glow) stand out clearly
        this.objects.forEach(obj => {
            if (obj.found) {
                // Already found - dimmed
                ctx.save();
                ctx.globalAlpha = 0.3;
                ctx.font = '28px serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(obj.icon, obj.screenX, obj.screenY);
                ctx.restore();
            } else {
                // Hidden object - subtle pulse
                const pulse = 0.6 + Math.sin(this.animTimer * 2 + obj.pulsePhase) * 0.15;
                ctx.save();
                ctx.globalAlpha = pulse;
                ctx.font = '32px serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(obj.icon, obj.screenX, obj.screenY);
                ctx.restore();

                // Key items have subtle glow
                if (obj.isKey) {
                    ctx.save();
                    ctx.globalAlpha = 0.15 + Math.sin(this.animTimer * 3 + obj.pulsePhase) * 0.1;
                    const glow = ctx.createRadialGradient(obj.screenX, obj.screenY, 5, obj.screenX, obj.screenY, 30);
                    glow.addColorStop(0, 'rgba(255, 193, 7, 0.3)');
                    glow.addColorStop(1, 'transparent');
                    ctx.fillStyle = glow;
                    ctx.beginPath();
                    ctx.arc(obj.screenX, obj.screenY, 30, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            }
        });

        // Sparkles
        this.sparkles.forEach(s => {
            const obj = this.objects.find(o => o.id === s.objectId);
            if (obj && !obj.found) {
                ctx.save();
                ctx.globalAlpha = 0.3 + Math.sin(s.phase) * 0.3;
                ctx.fillStyle = '#ffd54f';
                ctx.beginPath();
                const cx = s.x;
                const cy = s.y;
                const size = s.size;
                for (let i = 0; i < 4; i++) {
                    const angle = (i * Math.PI) / 2 + s.phase * 0.5;
                    ctx.moveTo(cx, cy);
                    ctx.lineTo(cx + Math.cos(angle) * size, cy + Math.sin(angle) * size);
                }
                ctx.fill();
                ctx.restore();
            }
        });

        // Vault choice overlay
        if (this.showVaultChoice && this.pendingItem) {
            this._drawVaultChoice(ctx, w, h);
        }

        // Score
        ctx.font = 'bold 14px "Quicksand", sans-serif';
        ctx.fillStyle = '#ffc107';
        ctx.textAlign = 'right';
        ctx.fillText(`⭐ ${this.score}`, w - 15, h - 105);
    }

    _drawLabBackground(ctx, w, h) {
        // Shelves
        ctx.fillStyle = 'rgba(26, 32, 80, 0.5)';
        ctx.fillRect(20, h * 0.2, w * 0.3, 8);
        ctx.fillRect(w * 0.6, h * 0.35, w * 0.35, 8);
        ctx.fillRect(30, h * 0.6, w * 0.25, 8);

        // Table
        ctx.fillStyle = 'rgba(26, 32, 80, 0.7)';
        ctx.fillRect(w * 0.3, h * 0.7, w * 0.4, 10);

        // Flask decorations
        ctx.strokeStyle = 'rgba(74, 124, 255, 0.15)';
        ctx.lineWidth = 1;
        // Beaker
        ctx.beginPath();
        ctx.moveTo(w * 0.15, h * 0.5);
        ctx.lineTo(w * 0.12, h * 0.6);
        ctx.lineTo(w * 0.18, h * 0.6);
        ctx.closePath();
        ctx.stroke();

        // Test tubes
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.rect(w * 0.7 + i * 15, h * 0.15, 6, 30);
            ctx.stroke();
        }

        // Grid lines (subtle)
        ctx.strokeStyle = 'rgba(74, 124, 255, 0.05)';
        for (let x = 0; x < w; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
    }

    _drawVaultChoice(ctx, w, h) {
        // Darken background
        ctx.fillStyle = 'rgba(10, 14, 39, 0.8)';
        ctx.fillRect(0, 0, w, h);

        const item = this.pendingItem;
        const cx = w / 2;
        const cy = h / 2;

        // Card
        ctx.fillStyle = 'rgba(26, 32, 80, 0.95)';
        ctx.strokeStyle = 'rgba(255, 193, 7, 0.4)';
        ctx.lineWidth = 2;
        this._roundRect(ctx, cx - 140, cy - 120, 280, 240, 16);
        ctx.fill();
        ctx.stroke();

        // Icon
        ctx.font = '48px serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.icon, cx, cy - 60);

        // Name
        ctx.font = 'bold 18px "Fredoka One", cursive';
        ctx.fillStyle = '#ffc107';
        ctx.fillText(item.name, cx, cy - 15);

        // Question
        ctx.font = '14px "Quicksand", sans-serif';
        ctx.fillStyle = '#e8eaf6';
        ctx.fillText('¿Qué quieres hacer?', cx, cy + 15);

        if (item.isKey) {
            ctx.font = '11px "Quicksand", sans-serif';
            ctx.fillStyle = '#9fa8da';
            ctx.fillText(item.futureUse || 'Podría servir después...', cx, cy + 35);
        }

        // Buttons
        const btnY = cy + 60;
        // Store button
        ctx.fillStyle = 'rgba(255, 193, 7, 0.2)';
        ctx.strokeStyle = '#ffc107';
        ctx.lineWidth = 1;
        this._roundRect(ctx, cx - 130, btnY, 120, 40, 10);
        ctx.fill();
        ctx.stroke();
        ctx.font = '13px "Quicksand", sans-serif';
        ctx.fillStyle = '#ffc107';
        ctx.fillText('🔒 Guardar', cx - 70, btnY + 22);

        // Use button
        ctx.fillStyle = 'rgba(74, 124, 255, 0.2)';
        ctx.strokeStyle = '#4a7cff';
        this._roundRect(ctx, cx + 10, btnY, 120, 40, 10);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#7ba4ff';
        ctx.fillText('⚡ Usar ahora', cx + 70, btnY + 22);

        // Store the button rects for click detection
        this._vaultChoiceBtns = {
            store: { x: cx - 130, y: btnY, w: 120, h: 40 },
            use: { x: cx + 10, y: btnY, w: 120, h: 40 },
        };
    }

    handleInput(type, x, y) {
        if (this.completed) return;
        if (type !== 'click' && type !== 'touchend') return;

        // Handle vault choice BEFORE the narrator busy-check so the
        // Guardar/Usar buttons work even while the guide dialog is visible.
        if (this.showVaultChoice && this._vaultChoiceBtns) {
            const store = this._vaultChoiceBtns.store;
            const use = this._vaultChoiceBtns.use;

            if (x >= store.x && x <= store.x + store.w && y >= store.y && y <= store.y + store.h) {
                audioManager.playVaultStore();
                vaultSystem.store(this.pendingItem);
                this.showVaultChoice = false;
                this.pendingItem = null;
                narratorSystem.sayVault('itemStored');
                narratorSystem.advance();
                this._checkComplete();
                return;
            }
            if (x >= use.x && x <= use.x + use.w && y >= use.y && y <= use.y + use.h) {
                audioManager.playCollect();
                if (this.pendingItem.isKey) {
                    this.score += this.pendingItem.points || 20;
                    vaultSystem.useImmediately(this.pendingItem);
                    narratorSystem.sayVault('itemUsedImmediate');
                } else {
                    this.score += this.pendingItem.points || 10;
                }
                this.showVaultChoice = false;
                this.pendingItem = null;
                narratorSystem.advance();
                this._checkComplete();
                return;
            }
            return;
        }

        if (narratorSystem.isBusy()) return;

        // Check decoys first → wrong tap feedback
        for (const dec of this.decoys) {
            const dx = x - dec.screenX;
            const dy = y - dec.screenY;
            if (dx * dx + dy * dy < 34 * 34) {
                dec.hitAnim = 1;
                this.errors++;
                audioManager.playWrong();
                ddaSystem.recordAttempt(false, 0, { type: 'search_wrong_tap' });
                return;
            }
        }

        // Check object taps
        for (const obj of this.objects) {
            if (obj.found) continue;
            const dx = x - obj.screenX;
            const dy = y - obj.screenY;
            if (dx * dx + dy * dy < 38 * 38) {
                this._foundObject(obj);
                return;
            }
        }
    }

    _foundObject(obj) {
        obj.found = true;
        this.foundObjects.push(obj);
        audioManager.playCollect();
        this._updateObjective();

        if (obj.isKey) {
            this.foundKeys++;
            // Show vault choice
            this.pendingItem = obj;
            this.showVaultChoice = true;
            narratorSystem.sayVault('itemFound');
        } else {
            // Consumable - auto collect
            this.score += obj.points || 10;
            if (this.foundObjects.length === this.objects.length) {
                this._onComplete();
            }
        }
    }

    _checkComplete() {
        if (this.foundObjects.length === this.objects.length) {
            this._onComplete();
        }
    }

    _onTimeout() {
        this._onComplete(); // Still complete, just with fewer items
    }

    _onComplete() {
        if (this.completed) return;
        this.completed = true;
        hud.stopTimer();

        const elapsed = (Date.now() - this.startTime) / 1000;
        const keysFound = this.foundKeys;
        const rating = keysFound >= this.requiredKeys ? 
            (this.foundObjects.length === this.objects.length ? 'perfect' : 'good') : 'okay';
        const stars = ddaSystem.getStars(rating);
        ddaSystem.recordAttempt(true, elapsed * 1000, { type: 'search_complete' });

        const rewards = this.config.rewards || {};
        const emotionChanges = {};
        for (const [emotion, values] of Object.entries(rewards)) {
            const change = values[rating] || 0;
            if (change > 0) emotionChanges[emotion] = change;
        }
        if (Object.keys(emotionChanges).length > 0) {
            emotionTracker.modify(emotionChanges, 'Completó búsqueda de objetos');
        }

        narratorSystem.saySuccess(rating);

        setTimeout(() => {
            hud.showLevelComplete({
                title: '¡Búsqueda Completada!',
                stars,
                stats: [
                    { label: 'Objetos', value: `${this.foundObjects.length}/${this.objects.length}` },
                    { label: 'Claves guardadas', value: vaultSystem.getItems().length },
                    { label: 'Puntuación', value: this.score },
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
        hud.stopTimer();
        hud.clearObjective();
        audioManager.stopMusic();
    }
}
