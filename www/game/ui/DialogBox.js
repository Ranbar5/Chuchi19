/* ============================================
   DIALOG BOX — Managed by NarratorSystem, 
   this file provides additional rendering helpers
   ============================================ */

class DialogBoxUI {
    constructor() {
        this.box = document.getElementById('dialog-box');
        this.portraitEl = document.getElementById('dialog-portrait');
        this.nameEl = document.getElementById('dialog-name');
        this.textEl = document.getElementById('dialog-text');
        this.choicesEl = document.getElementById('dialog-choices');
        this.continueEl = document.getElementById('dialog-continue');
    }

    show() {
        if (this.box) this.box.classList.remove('hidden');
    }

    hide() {
        if (this.box) this.box.classList.add('hidden');
    }

    isVisible() {
        return this.box && !this.box.classList.contains('hidden');
    }
}

const dialogBoxUI = new DialogBoxUI();
