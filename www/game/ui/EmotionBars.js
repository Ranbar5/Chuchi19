/* ============================================
   EMOTION BARS — Visual emotion indicators in HUD
   ============================================ */

class EmotionBarsUI {
    constructor() {
        this.container = document.getElementById('emotion-bars-container');
        this.bars = {};
        this.changeIndicators = [];
        this._onEmotionChange = this._onEmotionChange.bind(this);
        this.init();
    }

    _onEmotionChange(emotions, delta) {
        this.update(emotions, delta);
    }

    init() {
        if (!this.container) return;

        const emotions = [
            { key: 'clarity', icon: '🧠', label: 'Claridad', colorClass: 'clarity' },
            { key: 'patience', icon: '⏳', label: 'Paciencia', colorClass: 'patience' },
            { key: 'responsibility', icon: '🎯', label: 'Responsab.', colorClass: 'responsibility' },
        ];

        this.container.innerHTML = '';
        emotions.forEach(({ key, icon, label, colorClass }) => {
            const bar = document.createElement('div');
            bar.className = 'emotion-bar';
            bar.innerHTML = `
                <span class="emotion-icon">${icon}</span>
                <div class="emotion-track">
                    <div class="emotion-fill ${colorClass}" id="emotion-fill-${key}" style="width: 20%"></div>
                </div>
                <span class="emotion-label" id="emotion-label-${key}">${label}</span>
            `;
            this.container.appendChild(bar);
            this.bars[key] = document.getElementById(`emotion-fill-${key}`);
        });

        // Listen for emotion changes
        emotionTracker.onChange(this._onEmotionChange);

        // Initial update
        this.update(emotionTracker.get(), {});
    }

    destroy() {
        emotionTracker.offChange(this._onEmotionChange);
    }

    update(emotions, delta) {
        for (const [key, value] of Object.entries(emotions)) {
            const fill = this.bars[key];
            if (fill) {
                fill.style.width = value + '%';
            }
        }

        // Show change indicators
        if (delta) {
            for (const [key, change] of Object.entries(delta)) {
                if (change !== 0) {
                    this.showChange(key, change);
                }
            }
        }
    }

    showChange(key, change) {
        const fill = this.bars[key];
        if (!fill) return;

        const indicator = document.createElement('span');
        indicator.className = `emotion-change ${change > 0 ? 'positive' : 'negative'}`;
        indicator.textContent = (change > 0 ? '+' : '') + change;
        indicator.style.position = 'absolute';
        indicator.style.right = '0';
        indicator.style.top = '-12px';
        indicator.style.zIndex = '100';

        const parent = fill.parentElement;
        parent.style.position = 'relative';
        parent.appendChild(indicator);

        setTimeout(() => {
            indicator.style.transition = 'opacity 0.5s, transform 0.5s';
            indicator.style.opacity = '0';
            indicator.style.transform = 'translateY(-15px)';
            setTimeout(() => indicator.remove(), 500);
        }, 1200);
    }
}
