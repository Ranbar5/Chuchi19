/* ============================================
   AUDIO MANAGER — Sound effects & music via Web Audio API
   ============================================ */

class AudioManager {
    constructor() {
        this.ctx = null;
        this.masterVolume = 0.7;
        this.musicVolume = 0.4;
        this.sfxVolume = 0.8;
        this.currentMusic = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch (e) {
            console.warn('AudioManager: Web Audio API not supported');
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // --- Synthesized Sound Effects ---
    _createOscillator(freq, type, duration, volume = 1) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(volume * this.sfxVolume * this.masterVolume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playCorrect() {
        this._createOscillator(523.25, 'sine', 0.15, 0.5); // C5
        setTimeout(() => this._createOscillator(659.25, 'sine', 0.15, 0.5), 100); // E5
        setTimeout(() => this._createOscillator(783.99, 'sine', 0.25, 0.5), 200); // G5
    }

    playWrong() {
        if (!this.ctx) return;
        this._createOscillator(200, 'sawtooth', 0.3, 0.3);
        setTimeout(() => this._createOscillator(180, 'sawtooth', 0.3, 0.2), 150);
    }

    playClick() {
        if (!this.ctx) return;
        this._createOscillator(800, 'sine', 0.05, 0.3);
    }

    playCollect() {
        this._createOscillator(880, 'sine', 0.1, 0.4);
        setTimeout(() => this._createOscillator(1100, 'sine', 0.15, 0.4), 80);
        setTimeout(() => this._createOscillator(1320, 'sine', 0.2, 0.3), 160);
    }

    playVaultStore() {
        const notes = [440, 554, 659, 880];
        notes.forEach((freq, i) => {
            setTimeout(() => this._createOscillator(freq, 'sine', 0.2, 0.3), i * 120);
        });
    }

    playLevelComplete() {
        const melody = [523, 587, 659, 784, 880, 1047];
        melody.forEach((freq, i) => {
            setTimeout(() => this._createOscillator(freq, 'sine', 0.25, 0.4), i * 150);
        });
    }

    playTypewriter() {
        this._createOscillator(600 + Math.random() * 200, 'sine', 0.03, 0.15);
    }

    playBreathIn() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(440, this.ctx.currentTime + 3);
        gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.15 * this.sfxVolume, this.ctx.currentTime + 2);
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 4);
    }

    playBreathOut() {
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * 4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.05;
        }
        const source = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        source.buffer = buffer;
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.1 * this.sfxVolume, this.ctx.currentTime + 1);
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 4);
        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        source.start();
        source.stop(this.ctx.currentTime + 4);
    }

    playShoot() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2 * this.sfxVolume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    }

    playExplosion() {
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * 0.5;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
        }
        const source = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();
        source.buffer = buffer;
        gain.gain.setValueAtTime(0.3 * this.sfxVolume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
        source.connect(gain);
        gain.connect(this.ctx.destination);
        source.start();
        source.stop(this.ctx.currentTime + 0.5);
    }

    playTap() {
        this._createOscillator(1000, 'sine', 0.04, 0.2);
    }

    // --- Background Music (simple generated ambient) ---
    startMusic(type = 'menu') {
        this.stopMusic();
        if (!this.ctx) return;

        const musicGain = this.ctx.createGain();
        musicGain.gain.setValueAtTime(this.musicVolume * this.masterVolume, this.ctx.currentTime);
        musicGain.connect(this.ctx.destination);

        const chords = {
            menu: [261, 329, 392],     // C major
            gameplay: [293, 349, 440], // D minor
            breathing: [261, 311, 392],// Cm
            recap: [349, 440, 523],    // F major
        };

        const notes = chords[type] || chords.menu;
        const oscs = notes.map(freq => {
            const osc = this.ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            const noteGain = this.ctx.createGain();
            noteGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
            osc.connect(noteGain);
            noteGain.connect(musicGain);
            osc.start();
            return osc;
        });

        this.currentMusic = { oscs, gain: musicGain };
    }

    stopMusic() {
        if (this.currentMusic) {
            try {
                this.currentMusic.oscs.forEach(o => o.stop());
            } catch (e) { /* already stopped */ }
            this.currentMusic = null;
        }
    }

    setMasterVolume(v) { this.masterVolume = Math.max(0, Math.min(1, v)); }
    setMusicVolume(v) { this.musicVolume = Math.max(0, Math.min(1, v)); }
    setSfxVolume(v) { this.sfxVolume = Math.max(0, Math.min(1, v)); }
}

const audioManager = new AudioManager();
