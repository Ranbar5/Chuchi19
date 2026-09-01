/* ============================================
   NARRATOR SYSTEM — Guide dialogue controller
   ============================================ */

class NarratorSystem {
    constructor() {
        this.queue = [];
        this.isShowing = false;
        this.guideName = 'Guía';
        this.guideEmoji = '🔵';
        this.typeInterval = null;
        this.currentLine = null;
        this.isTyping = false;
        this._boundClickHandler = this._handleClick.bind(this);
    }

    // --- Enqueue dialogue lines ---
    say(dialogueLines, onComplete = null) {
        const lines = Array.isArray(dialogueLines) ? dialogueLines : [dialogueLines];
        lines.forEach(line => {
            this.queue.push({
                speaker: line.speaker || 'guia',
                text: line.text || line,
                choices: line.choices || null,
            });
        });
        if (onComplete) {
            this.queue.push({ _callback: onComplete });
        }
        if (!this.isShowing) {
            this._showNext();
        }
    }

    // --- Show contextual frustration message ---
    sayFrustration(level = 'mild') {
        const messages = DIALOGUES.frustration[level] || DIALOGUES.frustration.mild;
        const msg = messages[Math.floor(Math.random() * messages.length)];
        this.say([{ speaker: 'guia', text: msg }]);
    }

    // --- Show vault message ---
    sayVault(type) {
        const msg = DIALOGUES.vault[type];
        if (msg) {
            this.say([{ speaker: 'guia', text: msg }]);
        }
    }

    // --- Show success message ---
    saySuccess(rating) {
        const messages = DIALOGUES.success[rating] || DIALOGUES.success.okay;
        const msg = messages[Math.floor(Math.random() * messages.length)];
        this.say([{ speaker: 'guia', text: msg }]);
    }

    // --- Internal: show next line ---
    _showNext() {
        if (this.queue.length === 0) {
            this.isShowing = false;
            this._hideDialog();
            return;
        }

        const entry = this.queue.shift();

        // Callback entry
        if (entry._callback) {
            entry._callback();
            this._showNext();
            return;
        }

        this.isShowing = true;
        this._showDialog(entry);
    }

    // --- Show dialog box ---
    _showDialog(entry) {
        this.currentLine = entry;
        const box = document.getElementById('dialog-box');
        const portrait = document.getElementById('dialog-portrait');
        const nameEl = document.getElementById('dialog-name');
        const textEl = document.getElementById('dialog-text');
        const choicesEl = document.getElementById('dialog-choices');
        const continueEl = document.getElementById('dialog-continue');

        if (!box) return;

        // Clean previous event listener
        box.removeEventListener('click', this._boundClickHandler);
        box.classList.remove('hidden');

        // Set portrait
        if (entry.speaker === 'guia') {
            portrait.innerHTML = '<div class="portrait-frame">🛸</div>';
            nameEl.textContent = this.guideName;
        } else {
            portrait.innerHTML = '<div class="portrait-frame">📖</div>';
            nameEl.textContent = 'Narrador';
        }

        textEl.textContent = '';
        choicesEl.innerHTML = '';
        if (continueEl) continueEl.classList.add('hidden');

        if (this.typeInterval) clearInterval(this.typeInterval);

        let i = 0;
        const fullText = entry.text;
        this.isTyping = true;

        this.typeInterval = setInterval(() => {
            if (i < fullText.length) {
                textEl.textContent += fullText[i];
                audioManager.playTypewriter();
                i++;
            } else {
                this._finishTyping();
            }
        }, 30);

        box.addEventListener('click', this._boundClickHandler);
    }

    _finishTyping() {
        if (this.typeInterval) {
            clearInterval(this.typeInterval);
            this.typeInterval = null;
        }
        this.isTyping = false;

        const entry = this.currentLine;
        if (!entry) return;

        const textEl = document.getElementById('dialog-text');
        const choicesEl = document.getElementById('dialog-choices');
        const continueEl = document.getElementById('dialog-continue');

        if (textEl) textEl.textContent = entry.text;

        if (entry.choices && entry.choices.length > 0) {
            if (choicesEl) this._showChoices(entry.choices, choicesEl);
            if (continueEl) continueEl.classList.add('hidden');
        } else {
            if (continueEl) continueEl.classList.remove('hidden');
        }
    }

    _handleClick(e) {
        if (e && e.stopPropagation) e.stopPropagation();

        if (this.isTyping) {
            this._finishTyping();
        } else {
            if (this.currentLine && this.currentLine.choices && this.currentLine.choices.length > 0) {
                return;
            }
            const box = document.getElementById('dialog-box');
            if (box) box.removeEventListener('click', this._boundClickHandler);
            audioManager.playClick();
            this._showNext();
        }
    }

    // --- Allow screen / canvas click to advance dialogue ---
    advance() {
        if (this.isShowing) {
            this._handleClick();
        }
    }

    // --- Show choices ---
    _showChoices(choices, container) {
        container.innerHTML = '';
        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'dialog-choice-btn';
            btn.textContent = choice.text;
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                audioManager.playClick();
                if (choice.emotion) {
                    emotionTracker.modify(choice.emotion, `Eligió: "${choice.text}"`);
                }
                container.innerHTML = '';
                const box = document.getElementById('dialog-box');
                if (box) box.removeEventListener('click', this._boundClickHandler);
                this._showNext();
            });
            container.appendChild(btn);
        });
    }

    // --- Hide dialog ---
    _hideDialog() {
        if (this.typeInterval) {
            clearInterval(this.typeInterval);
            this.typeInterval = null;
        }
        this.isTyping = false;
        const box = document.getElementById('dialog-box');
        if (box) {
            box.removeEventListener('click', this._boundClickHandler);
            box.classList.add('hidden');
        }
    }

    // --- Check if busy ---
    isBusy() {
        return this.isShowing || this.queue.length > 0;
    }

    // --- Clear queue ---
    clear() {
        this.queue = [];
        this.isShowing = false;
        this._hideDialog();
    }
}

const narratorSystem = new NarratorSystem();
