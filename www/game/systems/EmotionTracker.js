/* ============================================
   EMOTION TRACKER — Socioemotional indicators
   ============================================ */

class EmotionTracker {
    constructor() {
        this.emotions = {
            clarity: 20,        // 🧠 Claridad Emocional (0-100)
            patience: 20,       // ⏳ Paciencia (0-100)
            responsibility: 20, // 🎯 Responsabilidad (0-100)
        };
        this.history = [];
        this.listeners = [];
        this.load();
    }

    // --- Modify emotions ---
    modify(changes, reason = '') {
        const delta = {};
        for (const [key, value] of Object.entries(changes)) {
            if (this.emotions[key] !== undefined) {
                const before = this.emotions[key];
                this.emotions[key] = Math.max(0, Math.min(100, this.emotions[key] + value));
                delta[key] = this.emotions[key] - before;
            }
        }

        this.history.push({
            timestamp: Date.now(),
            changes: delta,
            reason,
        });

        // Notify listeners
        this.listeners.forEach(fn => fn(this.emotions, delta, reason));
        this.save();
        return delta;
    }

    // --- Get current values ---
    get() {
        return { ...this.emotions };
    }

    // --- Get overall level ---
    getOverall() {
        const { clarity, patience, responsibility } = this.emotions;
        return Math.round((clarity + patience + responsibility) / 3);
    }

    // --- Get level category for each emotion ---
    getCategory(emotionKey) {
        const v = this.emotions[emotionKey];
        if (v >= 70) return 'high';
        if (v >= 40) return 'mid';
        return 'low';
    }

    // --- Subscribe to changes ---
    onChange(callback) {
        this.listeners.push(callback);
    }

    // --- Get recap data ---
    getRecapData() {
        return {
            emotions: this.get(),
            categories: {
                clarity: this.getCategory('clarity'),
                patience: this.getCategory('patience'),
                responsibility: this.getCategory('responsibility'),
            },
            overall: this.getOverall(),
            history: this.history,
        };
    }

    // --- Persistence ---
    save() {
        try {
            localStorage.setItem('felipe19_emotions', JSON.stringify(this.emotions));
        } catch (e) {}
    }

    load() {
        try {
            const data = JSON.parse(localStorage.getItem('felipe19_emotions'));
            if (data) {
                Object.assign(this.emotions, data);
            }
        } catch (e) {}
    }

    reset() {
        this.emotions = { clarity: 20, patience: 20, responsibility: 20 };
        this.history = [];
        this.save();
    }
}

const emotionTracker = new EmotionTracker();
