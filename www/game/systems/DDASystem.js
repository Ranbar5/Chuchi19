/* ============================================
   DDA SYSTEM — Dynamic Difficulty Adjustment
   Keeps player in the "flow zone"
   ============================================ */

class DDASystem {
    constructor() {
        this.playerProfile = {
            skillLevel: 0.5,     // 0.0 (beginner) to 1.0 (expert)
            recentErrors: 0,
            consecutiveErrors: 0,
            consecutiveSuccesses: 0,
            totalAttempts: 0,
            avgSolveTime: 0,
            frustrationLevel: 0, // 0.0 to 1.0
            lastAdjustment: Date.now(),
        };
        this.history = [];
        this.mode = 'story'; // story | challenge | reflection
        this.load();
    }

    // --- Record performance ---
    recordAttempt(success, solveTimeMs, metadata = {}) {
        const entry = {
            timestamp: Date.now(),
            success,
            solveTimeMs,
            ...metadata,
        };
        this.history.push(entry);
        this.playerProfile.totalAttempts++;

        if (success) {
            this.playerProfile.consecutiveErrors = 0;
            this.playerProfile.consecutiveSuccesses++;
            this.playerProfile.recentErrors = Math.max(0, this.playerProfile.recentErrors - 1);
            this.playerProfile.frustrationLevel = Math.max(0, this.playerProfile.frustrationLevel - 0.15);
            // Adjust skill upward
            this.playerProfile.skillLevel = Math.min(1, this.playerProfile.skillLevel + 0.03);
        } else {
            this.playerProfile.consecutiveErrors++;
            this.playerProfile.consecutiveSuccesses = 0;
            this.playerProfile.recentErrors++;
            this.playerProfile.frustrationLevel = Math.min(1, this.playerProfile.frustrationLevel + 0.2);
            // Adjust skill downward
            this.playerProfile.skillLevel = Math.max(0, this.playerProfile.skillLevel - 0.05);
        }

        // Update average solve time
        const recentTimes = this.history.filter(h => h.success).slice(-5).map(h => h.solveTimeMs);
        if (recentTimes.length > 0) {
            this.playerProfile.avgSolveTime = recentTimes.reduce((a, b) => a + b, 0) / recentTimes.length;
        }

        this.save();
    }

    // --- Check frustration triggers ---
    shouldTriggerBreathing() {
        return this.playerProfile.consecutiveErrors >= 3 || this.playerProfile.frustrationLevel >= 0.7;
    }

    resetFrustration() {
        this.playerProfile.consecutiveErrors = 0;
        this.playerProfile.frustrationLevel = Math.max(0, this.playerProfile.frustrationLevel - 0.4);
        this.save();
    }

    // --- Get adjusted parameters ---
    getAdjustedParams(baseParams) {
        const skill = this.playerProfile.skillLevel;
        const modeMultiplier = LEVELS.modes[this.mode]?.ddaMultiplier || 1.0;
        const adjusted = { ...baseParams };

        // Time limit: more time for struggling players, less for skilled
        if (adjusted.baseTimeLimit) {
            const timeFactor = 1 + (0.5 - skill) * 0.6; // 0.7x to 1.3x
            adjusted.timeLimit = Math.round(adjusted.baseTimeLimit * timeFactor / modeMultiplier);
            // Reflection mode: no timer
            if (this.mode === 'reflection') adjusted.timeLimit = Infinity;
        }

        // Grid size for mazes
        if (adjusted.baseGridSize !== undefined) {
            const sizeDelta = Math.round((skill - 0.5) * 2);
            adjusted.gridSize = Math.max(
                adjusted.minGridSize || 3,
                Math.min(adjusted.maxGridSize || 8, adjusted.baseGridSize + sizeDelta)
            );
        }

        // Speed for shooter
        if (adjusted.baseSpeed !== undefined) {
            const speedFactor = 0.6 + skill * 0.8; // 0.6x to 1.4x
            adjusted.speed = Math.max(
                adjusted.minSpeed || 0.3,
                Math.min(adjusted.maxSpeed || 3.0, adjusted.baseSpeed * speedFactor * modeMultiplier)
            );
        }

        // BPM for coordination
        if (adjusted.baseBPM !== undefined) {
            const bpmFactor = 0.7 + skill * 0.6;
            adjusted.bpm = Math.max(
                adjusted.minBPM || 30,
                Math.min(adjusted.maxBPM || 150, Math.round(adjusted.baseBPM * bpmFactor * modeMultiplier))
            );
        }

        // Hint frequency
        if (adjusted.baseHintFrequency !== undefined) {
            const hintFactor = 1.5 - skill; // More hints for struggling players
            adjusted.hintFrequency = Math.round(adjusted.baseHintFrequency * hintFactor);
            if (this.mode === 'challenge') adjusted.hintFrequency *= 3;
            if (this.mode === 'reflection') adjusted.hintFrequency *= 0.5;
        }

        // Distractors count
        adjusted.distractorCount = Math.max(2, Math.min(5, 2 + Math.round(skill * 3)));

        // Narrator help level
        adjusted.narratorHelp = LEVELS.modes[this.mode]?.narratorHelp || 'full';

        return adjusted;
    }

    // --- Get difficulty label ---
    getDifficultyLabel() {
        const s = this.playerProfile.skillLevel;
        if (s < 0.3) return 'Fácil';
        if (s < 0.6) return 'Normal';
        if (s < 0.8) return 'Difícil';
        return 'Experto';
    }

    // --- Get performance rating ---
    getRating(errors, timeMs, expectedTimeMs) {
        const errorPenalty = errors * 0.3;
        const timePenalty = timeMs > expectedTimeMs ? (timeMs - expectedTimeMs) / expectedTimeMs * 0.5 : 0;
        const score = Math.max(0, 1 - errorPenalty - timePenalty);

        if (score >= 0.85) return 'perfect';
        if (score >= 0.5) return 'good';
        return 'okay';
    }

    // --- Get stars (1-3) ---
    getStars(rating) {
        return rating === 'perfect' ? 3 : rating === 'good' ? 2 : 1;
    }

    // --- Mode ---
    setMode(mode) {
        this.mode = mode;
        this.save();
    }

    // --- Persistence ---
    save() {
        try {
            localStorage.setItem('felipe19_dda', JSON.stringify({
                profile: this.playerProfile,
                mode: this.mode,
            }));
        } catch (e) { /* quota exceeded */ }
    }

    load() {
        try {
            const data = JSON.parse(localStorage.getItem('felipe19_dda'));
            if (data) {
                Object.assign(this.playerProfile, data.profile || {});
                this.mode = data.mode || 'story';
            }
        } catch (e) { /* corrupted */ }
    }

    reset() {
        this.playerProfile = {
            skillLevel: 0.5,
            recentErrors: 0,
            consecutiveErrors: 0,
            consecutiveSuccesses: 0,
            totalAttempts: 0,
            avgSolveTime: 0,
            frustrationLevel: 0,
            lastAdjustment: Date.now(),
        };
        this.history = [];
        this.save();
    }
}

const ddaSystem = new DDASystem();
