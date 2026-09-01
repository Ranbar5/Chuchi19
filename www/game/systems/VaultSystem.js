/* ============================================
   VAULT SYSTEM — Inventory for key items (delayed gratification)
   ============================================ */

class VaultSystem {
    constructor() {
        this.items = [];     // items stored in vault
        this.usedItems = []; // items that were used immediately
        this.maxSlots = 8;
        this.listeners = [];
        this.load();
    }

    // --- Store an item in the vault ---
    store(item) {
        if (this.items.length >= this.maxSlots) return false;
        if (this.items.find(i => i.id === item.id)) return false;

        this.items.push({
            id: item.id,
            name: item.name,
            icon: item.icon,
            futureUse: item.futureUse || '',
            foundAt: Date.now(),
            used: false,
        });

        // Storing = patience boost
        emotionTracker.modify({ patience: 5, responsibility: 2 }, `Guardó "${item.name}" en la bóveda`);
        this.listeners.forEach(fn => fn('store', item));
        this.save();
        return true;
    }

    // --- Use an item immediately (instant gratification) ---
    useImmediately(item) {
        this.usedItems.push({
            id: item.id,
            name: item.name,
            usedAt: Date.now(),
        });
        // Using immediately = less patience growth
        emotionTracker.modify({ patience: -1 }, `Usó "${item.name}" de inmediato`);
        this.listeners.forEach(fn => fn('useImmediate', item));
        this.save();
    }

    // --- Check if vault has a specific item ---
    hasItem(itemId) {
        return this.items.some(i => i.id === itemId && !i.used);
    }

    // --- Use a vault item (in a later level) ---
    useVaultItem(itemId) {
        const item = this.items.find(i => i.id === itemId && !i.used);
        if (!item) return null;
        item.used = true;
        item.usedAt = Date.now();

        // Using stored item later = big responsibility boost
        emotionTracker.modify(
            { responsibility: 5, patience: 3, clarity: 2 },
            `Usó "${item.name}" guardado previamente`
        );

        this.listeners.forEach(fn => fn('useVault', item));
        this.save();
        return item;
    }

    // --- Get all items ---
    getItems() {
        return [...this.items];
    }

    // --- Get available (unused) items ---
    getAvailable() {
        return this.items.filter(i => !i.used);
    }

    // --- Get stats for recap ---
    getStats() {
        return {
            totalStored: this.items.length,
            totalUsedLater: this.items.filter(i => i.used).length,
            totalUsedImmediately: this.usedItems.length,
            delayedGratificationRatio: this.items.length /
                Math.max(1, this.items.length + this.usedItems.length),
        };
    }

    // --- Subscribe to changes ---
    onChange(callback) {
        this.listeners.push(callback);
    }

    // --- Render vault UI ---
    renderToDOM() {
        const grid = document.getElementById('vault-grid');
        const hint = document.getElementById('vault-hint');
        if (!grid) return;

        grid.innerHTML = '';
        for (let i = 0; i < this.maxSlots; i++) {
            const item = this.items[i];
            const slot = document.createElement('div');
            slot.className = 'vault-slot' + (item ? ' filled' : '');

            if (item) {
                const iconSpan = document.createElement('span');
                iconSpan.className = 'item-icon';
                iconSpan.textContent = item.icon;
                slot.appendChild(iconSpan);

                const nameSpan = document.createElement('span');
                nameSpan.className = 'item-name';
                nameSpan.textContent = item.name;
                slot.appendChild(nameSpan);

                if (item.used) {
                    const usedSpan = document.createElement('span');
                    usedSpan.className = 'item-used';
                    usedSpan.textContent = '✓ Usado';
                    slot.appendChild(usedSpan);
                }
                slot.title = item.futureUse;
            } else {
                const iconSpan = document.createElement('span');
                iconSpan.className = 'item-icon';
                iconSpan.textContent = '?';
                iconSpan.style.opacity = '0.2';
                slot.appendChild(iconSpan);
            }
            grid.appendChild(slot);
        }

        if (hint) {
            const stats = this.getStats();
            if (stats.totalStored > 0) {
                hint.textContent = `${stats.totalStored} objeto(s) guardado(s). ${stats.totalUsedLater} usado(s) en misiones posteriores.`;
            }
        }
    }

    // --- Persistence ---
    save() {
        try {
            localStorage.setItem('felipe19_vault', JSON.stringify({
                items: this.items,
                usedItems: this.usedItems,
            }));
        } catch (e) {}
    }

    load() {
        try {
            const data = JSON.parse(localStorage.getItem('felipe19_vault'));
            if (data) {
                this.items = data.items || [];
                this.usedItems = data.usedItems || [];
            }
        } catch (e) {}
    }

    reset() {
        this.items = [];
        this.usedItems = [];
        this.save();
    }
}

const vaultSystem = new VaultSystem();
