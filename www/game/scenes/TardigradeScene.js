/* ============================================
   TARDIGRADE SCENE — Embeds TardigradoExplorer
   inside the Felipe 19 app via an iframe overlay
   ============================================ */

class TardigradeScene {
    constructor(game) {
        this.game = game;
        this._boundClose = null;
    }

    enter() {
        hud.hide();
        audioManager.stopMusic();
        audioManager.playClick();

        const overlay = this._overlay();
        const frame = document.getElementById('tardigrade-frame');
        if (frame) {
            frame.src = 'tardigrade/index.html?t=' + Date.now();
        }
        overlay.classList.remove('hidden');

        if (!this._boundClose) {
            this._boundClose = () => this._close();
            document.getElementById('btn-close-tardigrade').addEventListener('click', this._boundClose);
        }
    }

    exit() {
        const overlay = this._overlay();
        if (overlay && !overlay.classList.contains('hidden')) {
            overlay.classList.add('hidden');
        }
    }

    update() {
        // The embedded game runs inside the iframe; nothing to update here.
    }

    render() {
        // Overlay DOM covers the canvas; nothing to draw.
    }

    handleInput() {
        // Ignore taps on the canvas background while the overlay is shown.
    }

    _overlay() {
        return document.getElementById('tardigrade-overlay');
    }

    _close() {
        this.game.changeScene('MenuScene');
    }
}