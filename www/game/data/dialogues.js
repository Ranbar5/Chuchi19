/* ============================================
   DIALOGUES — All narrator text in Spanish
   ============================================ */

const DIALOGUES = {
    // --- INTRO ---
    intro: [
        {
            speaker: 'narrador',
            text: '¡Hola, explorador! Bienvenido a un mundo donde tus decisiones tienen el poder de cambiar todo...',
        },
        {
            speaker: 'guia',
            text: '¡Hey! ¡Por aquí! ¡Estaba esperándote! Soy tu compañero en esta aventura. Juntos vamos a descubrir cosas increíbles sobre ti mismo.',
        },
        {
            speaker: 'guia',
            text: 'Cada misión que completemos te enseñará algo valioso sobre tus emociones y cómo controlarlas. ¿Listo para empezar?',
        },
        {
            speaker: 'guia',
            text: 'Ah, y una cosa importante: yo estaré aquí para ayudarte, pero las decisiones siempre serán tuyas. ¡Tú eres el héroe de esta historia! 🌟',
        },
    ],

    // --- ACT I: AUTOCONTROL E IMPULSIVIDAD ---
    act1: {
        title: 'Acto I: Autocontrol e Impulsividad',
        subtitle: 'Aprende a pausar, respirar y decidir con calma',
    },

    // --- REFLECTIONS BETWEEN LEVELS ---
    reflections: {
        afterLevel1: [
            {
                speaker: 'guia',
                text: '¡Bien hecho! Has completado tu primer laberinto. ¿Sabías que cuando piensas antes de actuar, tu cerebro construye caminos más fuertes? 🧠',
            },
            {
                speaker: 'guia',
                text: 'El autocontrol es como un músculo: cada vez que pausas y piensas antes de moverte, se hace más fuerte.',
            },
            {
                speaker: 'guia',
                text: 'A veces la ruta más rápida no es la mejor. ¿Notaste que buscar caminos alternativos te llevó a mejores resultados?',
                choices: [
                    { text: 'Sí, fue mejor pensar antes de actuar', emotion: { clarity: 5, patience: 3 } },
                    { text: 'Prefiero ir rápido y ver qué pasa', emotion: { clarity: 2, patience: -1 } },
                    { text: 'No estoy seguro todavía', emotion: { clarity: 3, patience: 1 } },
                ],
            },
        ],
        afterLevel2: [
            {
                speaker: 'guia',
                text: '¡Las matemáticas son poderosas! Pero lo más poderoso fue cómo manejaste la presión de responder rápido.',
            },
            {
                speaker: 'guia',
                text: 'Cuando sentimos presión, nuestro cuerpo quiere reaccionar de inmediato. Eso se llama "impulso". Aprender a controlar ese impulso es una superpotencia. 💪',
            },
            {
                speaker: 'guia',
                text: '¿Cómo te sentiste cuando cometiste un error durante el juego?',
                choices: [
                    { text: 'Me frustré un poco pero seguí adelante', emotion: { clarity: 5, responsibility: 3 } },
                    { text: 'Me enojé y quise rendirme', emotion: { clarity: 3, responsibility: 1 } },
                    { text: 'No me importó, intenté de nuevo', emotion: { clarity: 4, patience: 2 } },
                ],
            },
        ],
        afterLevel3: [
            {
                speaker: 'guia',
                text: '¡Excelente búsqueda! Encontrar objetos requiere paciencia y atención. Pero lo más interesante es lo que decidiste guardar...',
            },
            {
                speaker: 'guia',
                text: 'Algunos objetos brillan mucho ahora, pero los que guardaste en la bóveda podrían ser MUCHO más valiosos después. Eso se llama "gratificación diferida".',
            },
            {
                speaker: 'guia',
                text: 'Es como cuando decides estudiar hoy para un examen de la semana que viene: no se siente tan divertido ahora, pero el resultado futuro es genial. 📚',
            },
            {
                speaker: 'guia',
                text: '¿Prefieres tener una recompensa pequeña ahora o esperar por una más grande después?',
                choices: [
                    { text: 'Prefiero esperar por algo mejor', emotion: { patience: 8, responsibility: 3 } },
                    { text: 'Depende de la situación', emotion: { patience: 4, clarity: 4 } },
                    { text: 'Me cuesta esperar, quiero todo ya', emotion: { patience: 1, clarity: 5 } },
                ],
            },
        ],
        afterLevel4: [
            {
                speaker: 'guia',
                text: '¡Wow! Coordinar tus manos y pensar al mismo tiempo no es fácil. Tu cerebro está trabajando muy duro. 🧠✨',
            },
            {
                speaker: 'guia',
                text: 'La coordinación entre mente y cuerpo nos ayuda a tener mejor autocontrol. Cuando tu cuerpo está en calma, tu mente toma mejores decisiones.',
            },
        ],
        afterLevel5: [
            {
                speaker: 'guia',
                text: '¿Recuerdas los objetos que guardaste en la bóveda? ¡Mira cómo te ayudaron ahora! Tus decisiones pasadas te abrieron caminos nuevos. 🗝️',
            },
            {
                speaker: 'guia',
                text: 'Esto es igual en la vida real: las cosas que haces hoy afectan lo que puedes hacer mañana. Cada decisión cuenta.',
            },
        ],
    },

    // --- BREATHING EXERCISES ---
    breathing: {
        boxBreathing: {
            intro: '¡Es hora de una pausa consciente! Vamos a hacer la Respiración en Caja. Te ayudará a sentirte más calmado y enfocado.',
            steps: [
                { text: 'Inhala lentamente... 🌬️', phase: 'inhale', duration: 4000 },
                { text: 'Sostén el aire... ⏸️', phase: 'hold', duration: 4000 },
                { text: 'Exhala suavemente... 💨', phase: 'exhale', duration: 4000 },
                { text: 'Descansa... 🧘', phase: 'rest', duration: 4000 },
            ],
            outro: '¡Muy bien! ¿Sientes cómo tu mente está más clara ahora? Estás listo para continuar.',
        },
        flowerCandle: {
            intro: '¡Vamos a practicar "Flor y Vela"! Imagina que tienes una flor hermosa en una mano y una vela encendida en la otra.',
            steps: [
                { text: 'Huele la flor... inhala profundo 🌸', phase: 'inhale', duration: 4000 },
                { text: 'Ahora sopla la vela suavemente... 🕯️', phase: 'exhale', duration: 5000 },
            ],
            outro: '¡Perfecto! Cada vez que sientas estrés, puedes imaginar la flor y la vela para calmarte.',
        },
        dragon: {
            intro: '¡Hora del Dragón! Vas a respirar como un dragón poderoso pero sabio.',
            steps: [
                { text: 'Toma aire de fuego... inhala con fuerza 🐉🔥', phase: 'inhale', duration: 3000 },
                { text: 'Sostén el fuego dentro... ⏸️', phase: 'hold', duration: 2000 },
                { text: 'Exhala el fuego lentamente... sssshhhhh 🌬️', phase: 'exhale', duration: 6000 },
            ],
            outro: '¡Eres un dragón sabio! Puedes controlar tu fuego interior. Eso es verdadero poder.',
        },
    },

    // --- FRUSTRATION DETECTION ---
    frustration: {
        mild: [
            '¡No te preocupes! Los errores son parte del aprendizaje. Cada intento te acerca más a la solución. 💪',
            'Mmm, eso no salió como esperabas. ¿Qué tal si lo intentamos de otra manera?',
            '¡Tranquilo! Hasta los mejores exploradores necesitan varios intentos. Tú puedes.',
        ],
        moderate: [
            'Veo que este reto es difícil. ¿Quieres que hagamos una pausa para respirar juntos?',
            'A veces, cuando algo es difícil, lo mejor es parar un momento, respirar y volver con la mente fresca.',
            'Los japoneses tienen un concepto llamado "Gaman": aguantar con paciencia y dignidad. ¡Tú lo estás haciendo genial!',
        ],
        severe: [
            '¡Hey, está bien sentirse frustrado! Es una emoción normal. Vamos a hacer un ejercicio de respiración para calmarnos.',
            'En Finlandia existe una palabra, "Sisu", que significa tener fuerza interior para seguir adelante. ¡Tú tienes Sisu! Pero primero, respiremos.',
        ],
        afterBreathing: [
            '¿Te sientes mejor? A veces solo necesitamos un momento para recargar energías. ¡Vamos de nuevo! 🌟',
            '¡Excelente! Tu mente está más clara ahora. ¡A por ello!',
        ],
    },

    // --- VAULT COMMENTS ---
    vault: {
        itemFound: '¡Buen ojo! Has encontrado algo. ¿Lo usas ahora o lo guardas para después?',
        itemStored: '¡Guardado en la bóveda! Recuerda: la paciencia trae grandes recompensas. 🔒',
        itemUsed: '¡Ese objeto que guardaste antes te está ayudando ahora! Tus decisiones pasadas importan.',
        itemUsedImmediate: 'Usaste el objeto de inmediato. A veces eso está bien, pero recuerda que guardar puede traer sorpresas. 🤔',
    },

    // --- SUCCESS MESSAGES ---
    success: {
        perfect: [
            '¡INCREÍBLE! ¡Perfecto! Tu concentración y paciencia son de otro nivel. ⭐⭐⭐',
            '¡WOW! ¡Sin errores! Tu autocontrol es impresionante. ⭐⭐⭐',
        ],
        good: [
            '¡Muy bien hecho! Unos pocos errores, pero los superaste con calma. ⭐⭐',
            '¡Genial! Cada intento te hizo más fuerte. ⭐⭐',
        ],
        okay: [
            '¡Lo lograste! No fue fácil, pero no te rendiste. Eso es lo que importa. ⭐',
            '¡Completado! Recuerda que el esfuerzo es más valioso que la perfección. ⭐',
        ],
    },

    // --- RECAP ACT I ---
    recap: {
        intro: '¡Has completado el Acto I: Autocontrol e Impulsividad! Veamos cómo te fue...',
        segments: {
            clarity: {
                high: 'Tu claridad emocional creció mucho. Eres capaz de reconocer lo que sientes y por qué. ¡Eso es un superpoder! 🧠',
                mid: 'Tu claridad emocional está mejorando. Con práctica, reconocerás tus emociones cada vez más rápido.',
                low: 'Reconocer emociones puede ser difícil al principio. ¡No te preocupes! En el Acto II seguiremos practicando.',
            },
            patience: {
                high: '¡Tu paciencia es admirable! Entendiste que esperar puede traer mejores resultados. ¡Gaman y Sisu! ⏳',
                mid: 'Tu paciencia está en buen camino. Recuerda: las mejores cosas toman tiempo.',
                low: 'La paciencia es una habilidad que se entrena. Cada vez que esperas un poquito más, tu "músculo de paciencia" crece.',
            },
            responsibility: {
                high: '¡Tomas decisiones muy responsables! Piensas en las consecuencias y eso te hace un gran líder. 🎯',
                mid: 'Estás aprendiendo a pensar en las consecuencias de tus decisiones. ¡Sigue así!',
                low: 'Tomar buenas decisiones requiere práctica. Lo importante es que estás aquí, aprendiendo.',
            },
        },
        realLife: [
            '💡 Consejo para la vida real: Cuando sientas un impulso de reaccionar rápido, cuenta hasta 5 antes de actuar.',
            '💡 Consejo para la vida real: Si algo te frustra, practica la respiración en caja: inhala 4 segundos, sostén 4, exhala 4, espera 4.',
            '💡 Consejo para la vida real: Antes de tomar una decisión importante, pregúntate: "¿Cómo me sentiré mañana si hago esto?"',
        ],
        closing: '¡Eres un explorador emocional increíble! El Acto II te espera con nuevos desafíos. ¡Hasta pronto! 🚀',
    },
};
