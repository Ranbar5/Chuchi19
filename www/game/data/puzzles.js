/* ============================================
   PUZZLES — Maze, Math, Search, Coordination data
   ============================================ */

const PUZZLES = {
    // --- NUMBER MAZES ---
    numberMazes: {
        // Level 1 — Tutorial (4x4)
        level1: {
            size: 4,
            numbers: [
                { row: 0, col: 0, value: 1 },
                { row: 0, col: 3, value: 2 },
                { row: 2, col: 1, value: 3 },
                { row: 3, col: 3, value: 4 },
            ],
            walls: [
                { row: 1, col: 1 },
                { row: 1, col: 2 },
            ],
            timeLimit: 120,
            hint: 'Conecta los números del 1 al 4 trazando una línea continua. ¡No puedes pasar por las paredes!',
        },
        // Level 5 — Advanced (6x6), uses vault key
        level5: {
            size: 6,
            numbers: [
                { row: 0, col: 0, value: 1 },
                { row: 0, col: 5, value: 2 },
                { row: 2, col: 3, value: 3 },
                { row: 3, col: 0, value: 4 },
                { row: 4, col: 4, value: 5 },
                { row: 5, col: 2, value: 6 },
            ],
            walls: [
                { row: 1, col: 1 }, { row: 1, col: 2 },
                { row: 2, col: 4 }, { row: 2, col: 5 },
                { row: 3, col: 2 }, { row: 3, col: 3 },
                { row: 4, col: 1 },
            ],
            // The crystal key unlocks shortcut at row:3, col:3
            vaultUnlock: {
                itemId: 'crystal_key',
                removeWall: { row: 3, col: 3 },
                message: '¡La Llave Cristal que guardaste brilla! Un muro se ha desbloqueado. 🗝️✨',
            },
            timeLimit: 180,
            hint: 'Este laberinto es más grande. Recuerda: planificar la ruta antes de trazar te ahorrará tiempo.',
        },
        // Extra mazes for DDA variations
        easy: {
            size: 4,
            numbers: [
                { row: 0, col: 0, value: 1 },
                { row: 1, col: 2, value: 2 },
                { row: 3, col: 3, value: 3 },
            ],
            walls: [{ row: 2, col: 1 }],
            timeLimit: 150,
        },
        medium: {
            size: 5,
            numbers: [
                { row: 0, col: 0, value: 1 },
                { row: 0, col: 4, value: 2 },
                { row: 2, col: 2, value: 3 },
                { row: 4, col: 0, value: 4 },
                { row: 4, col: 4, value: 5 },
            ],
            walls: [
                { row: 1, col: 1 }, { row: 1, col: 3 },
                { row: 3, col: 1 }, { row: 3, col: 3 },
            ],
            timeLimit: 150,
        },
        hard: {
            size: 7,
            numbers: [
                { row: 0, col: 0, value: 1 }, { row: 0, col: 6, value: 2 },
                { row: 2, col: 3, value: 3 }, { row: 3, col: 6, value: 4 },
                { row: 4, col: 0, value: 5 }, { row: 5, col: 4, value: 6 },
                { row: 6, col: 1, value: 7 }, { row: 6, col: 6, value: 8 },
            ],
            walls: [
                { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 },
                { row: 3, col: 1 }, { row: 3, col: 2 }, { row: 3, col: 4 },
                { row: 5, col: 1 }, { row: 5, col: 5 },
            ],
            timeLimit: 240,
        },
    },

    // --- MATH SHOOTER ---
    mathProblems: {
        easy: [
            { question: '3 + 4', answer: 7, distractors: [5, 8, 12] },
            { question: '6 + 2', answer: 8, distractors: [4, 10, 7] },
            { question: '5 + 5', answer: 10, distractors: [8, 11, 15] },
            { question: '9 + 1', answer: 10, distractors: [8, 11, 91] },
            { question: '7 + 3', answer: 10, distractors: [9, 11, 4] },
            { question: '2 + 8', answer: 10, distractors: [6, 28, 12] },
            { question: '4 + 6', answer: 10, distractors: [2, 46, 11] },
            { question: '8 + 5', answer: 13, distractors: [12, 14, 85] },
            { question: '6 + 7', answer: 13, distractors: [11, 14, 67] },
            { question: '9 + 4', answer: 13, distractors: [12, 14, 94] },
        ],
        medium: [
            { question: '15 - 7', answer: 8, distractors: [6, 9, 22] },
            { question: '12 - 5', answer: 7, distractors: [6, 8, 17] },
            { question: '20 - 8', answer: 12, distractors: [10, 14, 28] },
            { question: '3 × 4', answer: 12, distractors: [7, 11, 34] },
            { question: '5 × 3', answer: 15, distractors: [8, 12, 53] },
            { question: '6 × 2', answer: 12, distractors: [8, 14, 62] },
            { question: '4 × 5', answer: 20, distractors: [9, 16, 45] },
            { question: '7 × 3', answer: 21, distractors: [18, 24, 73] },
            { question: '8 × 2', answer: 16, distractors: [10, 18, 82] },
            { question: '9 × 3', answer: 27, distractors: [24, 29, 93] },
        ],
        hard: [
            { question: '6 × 7', answer: 42, distractors: [36, 48, 67] },
            { question: '8 × 6', answer: 48, distractors: [42, 54, 86] },
            { question: '12 ÷ 4', answer: 3, distractors: [2, 4, 8] },
            { question: '15 ÷ 3', answer: 5, distractors: [3, 6, 12] },
            { question: '7 × 8', answer: 56, distractors: [48, 63, 78] },
            { question: '3 × 4 + 2', answer: 14, distractors: [10, 18, 34] },
            { question: '5 × 2 + 3', answer: 13, distractors: [10, 16, 25] },
            { question: '20 ÷ 5 + 3', answer: 7, distractors: [4, 8, 23] },
            { question: '9 × 4', answer: 36, distractors: [32, 40, 94] },
            { question: '6 × 6 - 1', answer: 35, distractors: [30, 36, 66] },
        ],
    },

    // --- OBJECT SEARCH ---
    objectSearch: {
        level3: {
            sceneName: 'Laboratorio Estelar',
            background: 'lab',
            objects: [
                // Key items (go to vault)
                { id: 'crystal_key', name: 'Llave Cristal', icon: '🔑', x: 0.72, y: 0.45, isKey: true, futureUse: 'Puede abrir puertas secretas en laberintos', points: 0 },
                { id: 'star_map', name: 'Mapa Estelar', icon: '🗺️', x: 0.15, y: 0.3, isKey: true, futureUse: 'Revela caminos ocultos en futuras misiones', points: 0 },
                { id: 'emotion_lens', name: 'Lente Emocional', icon: '🔍', x: 0.55, y: 0.7, isKey: true, futureUse: 'Permite ver las emociones de los NPCs en el Acto II', points: 0 },
                // Consumable items (instant gratification)
                { id: 'coin1', name: 'Moneda Brillante', icon: '🪙', x: 0.3, y: 0.5, isKey: false, points: 10 },
                { id: 'coin2', name: 'Moneda Brillante', icon: '🪙', x: 0.85, y: 0.25, isKey: false, points: 10 },
                { id: 'candy1', name: 'Dulce Espacial', icon: '🍬', x: 0.4, y: 0.15, isKey: false, points: 15 },
                { id: 'candy2', name: 'Dulce Espacial', icon: '🍬', x: 0.65, y: 0.85, isKey: false, points: 15 },
                { id: 'gem1', name: 'Gema Pequeña', icon: '💎', x: 0.2, y: 0.75, isKey: false, points: 25 },
                { id: 'star1', name: 'Estrella Fugaz', icon: '⭐', x: 0.9, y: 0.6, isKey: false, points: 20 },
                { id: 'potion1', name: 'Poción de Velocidad', icon: '🧪', x: 0.1, y: 0.55, isKey: false, points: 15 },
            ],
            requiredKeys: 2, // must find at least 2 key items
            timeLimit: 90,
        },
    },

    // --- COORDINATION ---
    coordination: {
        level4: {
            patterns: [
                // Each pattern: array of {left, right} where true = tap required
                { name: 'Básico', sequence: [
                    { left: true, right: false },
                    { left: false, right: true },
                    { left: true, right: false },
                    { left: false, right: true },
                ], bpm: 60 },
                { name: 'Cruzado', sequence: [
                    { left: true, right: true },
                    { left: false, right: false },
                    { left: true, right: false },
                    { left: false, right: true },
                    { left: true, right: true },
                    { left: false, right: false },
                ], bpm: 72 },
                { name: 'Rápido', sequence: [
                    { left: true, right: false },
                    { left: false, right: true },
                    { left: true, right: true },
                    { left: false, right: true },
                    { left: true, right: false },
                    { left: true, right: true },
                    { left: false, right: false },
                    { left: true, right: false },
                ], bpm: 90 },
            ],
            // Mental agility problems interspersed
            mentalProblems: [
                { type: 'sequence', question: '¿Qué número sigue? 2, 4, 6, 8, ...', answer: '10', options: ['10', '9', '12'] },
                { type: 'sequence', question: '¿Qué número sigue? 1, 3, 5, 7, ...', answer: '9', options: ['8', '9', '10'] },
                { type: 'pattern', question: '¿Cuál no pertenece al grupo? 🔴🔴🔴🔵', answer: '🔵', options: ['🔴', '🔵', '🟢'] },
                { type: 'logic', question: 'Si hoy es martes, ¿qué día fue ayer?', answer: 'Lunes', options: ['Lunes', 'Miércoles', 'Domingo'] },
                { type: 'sequence', question: '¿Qué número sigue? 3, 6, 9, 12, ...', answer: '15', options: ['14', '15', '18'] },
            ],
        },
    },
};
