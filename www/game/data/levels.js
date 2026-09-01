/* ============================================
   LEVELS DATA — 100+ Procedural Levels
   ============================================ */

const LEVELS = (function generateLevels() {
    const levels = [];
    
    // Configuración base de dificultad
    const baseDifficulty = {
        NumberMaze: { gridSize: 4, timeLimit: 120 },
        MathShooter: { minOperand: 1, maxOperand: 5, timeLimit: 90, distractors: 2 },
        ObjectSearch: { itemsToFind: 3, timeLimit: 120 },
        Coordination: { speedMs: 1000, sequenceLength: 6 }
    };

    // Helper: Escalar dificultad según el nivel absoluto (1-100)
    function scaleDDA(levelIndex, base) {
        const factor = levelIndex / 100; // 0.0 to 1.0
        return {
            gridSize: Math.min(10, base.NumberMaze.gridSize + Math.floor(factor * 6)),
            mathMin: Math.max(1, base.MathShooter.minOperand + Math.floor(factor * 10)),
            mathMax: Math.max(5, base.MathShooter.maxOperand + Math.floor(factor * 20)),
            distractors: Math.min(6, base.MathShooter.distractors + Math.floor(factor * 4)),
            itemsToFind: Math.min(10, base.ObjectSearch.itemsToFind + Math.floor(factor * 7)),
            coordSpeed: Math.max(400, base.Coordination.speedMs - Math.floor(factor * 600))
        };
    }

    const totalLevels = 500;

    for (let i = 1; i <= totalLevels; i++) {
        const dda = scaleDDA(i, baseDifficulty);
        const act = i <= 166 ? 1 : i <= 333 ? 2 : 3;
        
        let sceneType, title, config = {};
        
        // Cada 10 niveles, hacer algo especial
        const pattern = i % 10;
        
        if (pattern === 1 || pattern === 6) {
            sceneType = 'StoryScene';
            title = `Reflexión - Acto ${act}`;
            config = { dialogueKey: `act${act}_reflection_${i}` };
        } else if (pattern === 0) {
            sceneType = 'BreathingScene';
            title = 'Pausa Consciente';
        } else {
            // Repartir en 5 actividades en lugar de 4
            const gameMod = i % 5;
            if (gameMod === 1) {
                sceneType = 'NumberMazeScene';
                title = `Laberinto Nivel ${i}`;
                config = { dda: { gridSize: dda.gridSize } };
            } else if (gameMod === 2) {
                sceneType = 'MathShooterScene';
                title = `Defensa Espacial Nivel ${i}`;
                config = { dda: { minOperand: dda.mathMin, maxOperand: dda.mathMax, distractors: dda.distractors } };
            } else if (gameMod === 3) {
                sceneType = 'ObjectSearchScene';
                title = `Búsqueda Nivel ${i}`;
                config = { dda: { itemsToFind: dda.itemsToFind } };
            } else if (gameMod === 4) {
                sceneType = 'CoordinationScene';
                title = `Coordinación Nivel ${i}`;
                config = { dda: { speedMs: dda.coordSpeed } };
            } else {
                sceneType = 'MemoryScene';
                title = `Memoria Nivel ${i}`;
                config = { dda: { sequenceLength: Math.min(10, 3 + Math.floor(i / 50)), speedMs: Math.max(300, 1000 - Math.floor(i / 100) * 100) } };
            }
        }
        
        levels.push({
            id: `level_${i}`,
            scene: sceneType,
            act: act,
            title: title,
            config: config
        });
    }

    // El primer nivel siempre es la intro
    levels[0] = {
        id: 'level_1_intro',
        scene: 'IntroScene',
        act: 1,
        title: 'El Encuentro',
        config: {}
    };

    // Agregar un nivel final de recapitulación
    levels.push({
        id: 'level_101_end',
        scene: 'RecapScene',
        act: 3,
        title: 'Recapitulación Final',
        config: {}
    });

    return levels;
})();
