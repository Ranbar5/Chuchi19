# Diseño integral de videojuego 2D para decisiones responsables, paciencia e inteligencia emocional

## 1. Introducción y objetivos

Este informe presenta el diseño integral de un videojuego 2D para Android orientado a fomentar toma de decisiones responsable, paciencia, pensamiento creativo y regulación emocional, integrando evidencia científica sobre serious games, aprendizaje socioemocional (SEL), retraso de gratificación y autorregulación.[^1][^2][^3]
El documento combina la investigación previa, las bases psicológicas, referencias bibliográficas, y una planificación detallada de mecánicas de juego: laberintos numéricos, búsqueda de objetos con bóveda, shooter matemático con pausas de respiración, y ejercicios de agilidad mental y coordinación física.[^4][^5][^6]

## 2. Bases científicas y marcos teóricos

### 2.1 Inteligencia emocional y programas basados en juego

Modelos de habilidad de inteligencia emocional (Mayer–Salovey, Caruso) definen la IE como la capacidad de percibir, comprender y regular emociones propias y ajenas, usando la información emocional para guiar pensamiento y acción.[^2][^7]
Programas como EmoTIC y League of Emotions Learners (LoEL) han demostrado que juegos digitales pueden mejorar autoestima, balance afectivo, síntomas emocionales y problemas de conducta al trabajar atención emocional, claridad y reparación (regulación) a través de misiones y minijuegos con reflexión guiada.[^8][^5][^2]

### 2.2 Aprendizaje socioemocional (SEL)

El marco SEL propone cinco competencias centrales: autoconciencia, autogestión, conciencia social, habilidades de relación y toma responsable de decisiones.[^1]
Serious games de SEL combinan narrativa, retos y feedback para entrenar estrategias de afrontamiento, reestructuración cognitiva, comunicación y resolución de conflictos, mostrando efectos positivos sobre bienestar y ajuste socioemocional en jóvenes.[^9][^1]

### 2.3 Autorregulación, funciones ejecutivas y retraso de gratificación

La autorregulación implica supervisar y modular emociones e impulsos para alcanzar metas a largo plazo, apoyándose en funciones ejecutivas como inhibición, memoria de trabajo y flexibilidad cognitiva.[^3][^10]
Estudios con juegos de mesa y serious games han mostrado que se puede incrementar el retraso de gratificación y el control de impulsos mediante tareas de esperar recompensas mayores, entrenamientos go/no‑go y misiones con recursos limitados, aunque la transferencia amplia a la vida diaria requiere puentes explícitos.[^11][^12][^4]

### 2.4 Juegos, toma de decisiones y dificultad adaptativa

Simulaciones de negocio y serious games en formación financiera han demostrado que el juego estructurado con feedback sobre sesgos, emociones y consecuencias mejora la calidad percibida de las decisiones y el pensamiento sistémico.[^13][^14][^15]
En juegos educativos, el uso de ajuste dinámico de dificultad (Dynamic Difficulty Adjustment, DDA) mantiene a los jugadores en la “zona de flujo”, evitando tanto aburrimiento como frustración y apoyando la motivación y el aprendizaje.[^16][^17][^18]

### 2.5 Pausas, respiración y coordinación física

Recursos educativos sobre autorregulación recomiendan pausas breves (“brain breaks”), juegos de respiración y actividades de interocepción para reducir estrés, mejorar atención y favorecer decisiones más reflexivas.[^19][^20][^21]
Investigaciones sobre entrenamiento de coordinación bimanual sugieren que ejercicios complejos de manos y brazos pueden beneficiar mecanismos de inhibición y control, con posibles transferencias a tareas motoras y cognitivas no practicadas directamente.[^22]

## 3. Concepto general del videojuego

### 3.1 Género y plataforma

El juego es una aventura 2D con elementos de puzzle, toma de decisiones y minijuegos de autorregulación, diseñado como app móvil para Android (motores recomendados: Unity o Godot por su soporte 2D y despliegue móvil).[^23][^24]
Las sesiones de juego se planifican para durar entre 5 y 10 minutos por misión, en línea con buenas prácticas de juegos educativos móviles que balancean inmersión y carga cognitiva.[^24][^16]

### 3.2 Objetivos educativos

- Toma de decisiones responsable: evaluar alternativas con consecuencias a corto y largo plazo, manejando emociones asociadas.[^14][^1]
- Paciencia y retraso de gratificación: entrenar la capacidad de esperar recompensas mayores y de invertir esfuerzo en misiones cuyos efectos aparecen varios niveles después.[^12][^4]
- Inteligencia emocional: reconocer, etiquetar y regular emociones propias y ajenas durante el juego, con ayuda de un guía/narrador.[^5][^2]
- Pensamiento fuera de la caja: resolver puzzles y misiones con múltiples soluciones válidas, explorando rutas no obvias y alternativas creativas.[^25][^26]

### 3.3 Objetivos de diseño de juego

- Mantener al jugador en la zona de flujo, ajustando dificultad de forma dinámica mediante DDA (velocidad, complejidad, tiempo límite, ayudas).[^17][^16]
- Ofrecer rejugabilidad mediante modos desafío y reflexión, donde los mismos niveles se repiten con parámetros más duros o con foco en análisis de decisiones.[^27][^25]

## 4. Estructura narrativa y de niveles

### 4.1 Actos y temas emocionales

El juego se estructura en tres actos narrativos:

- **Acto I – Autocontrol e impulsividad**: se introducen conceptos de control de respuesta, respiración y pausas conscientes, con retos sencillos de laberintos y shooter matemático.[^28][^11]
- **Acto II – Paciencia y planificación**: misiones con recursos limitados y laberintos numéricos donde las decisiones presentes afectan futuras rutas y recompensas diferidas.[^4][^27]
- **Acto III – Decisiones complejas y empatía**: dilemas con NPCs y misiones encadenadas que muestran el impacto social de decisiones responsables o impulsivas.[^29][^1]

Cada acto contiene 4–6 niveles jugables, intercalados con escenas de interludio donde el guía/narrador ayuda a reflexionar sobre decisiones y emociones, siguiendo la lógica de programas como EmoTIC y LoEL.[^2][^5]

### 4.2 Tipos de pantallas

- Pantallas de misión (gameplay principal: laberintos, búsqueda de objetos, shooter matemático).  
- Pantallas de decisión clave (dilemas narrativos con consecuencias diferidas).  
- Pantallas de pausa consciente (actividades de respiración, interocepción y coordinación física).  
- Pantallas de recapitulación (resumen de decisiones y efectos, con comentarios del guía).[^15][^1]

## 5. Personajes y colaboración

### 5.1 Protagonista

El protagonista es el personaje controlado por el jugador, que recorre el mundo 2D y toma decisiones en misiones y dilemas.  
Tiene indicadores visibles que reflejan su desarrollo socioemocional: claridad emocional, paciencia y responsabilidad, inspirados en métricas usadas en juegos de inteligencia emocional.[^30][^5]

### 5.2 Guía/Narrador

El guía es un personaje que acompaña al jugador todo el tiempo, actuando como narrador y facilitador socioemocional:

- Explica mecánicas, plantea preguntas (“¿cómo te sentiste cuando fallaste?”) y contextualiza las misiones como oportunidades de aprendizaje emocional.[^1][^2]
- Señala las consecuencias diferidas (“gracias a que guardaste esa llave, ahora esta ruta se abre”) reforzando la conexión entre decisiones anteriores y resultados actuales.[^14][^4]

### 5.3 Colaboración simbólica

Aunque el jugador controla solo al protagonista, el guía funciona como co‑decisor simbólico: sugiere estrategias, invita a pausar y reflexionar, pero deja claro que la decisión final es del jugador, fomentando autonomía responsable.[^2][^1]

## 6. Tipos de minijuegos y mecánicas

### 6.1 Laberinto numérico tipo Numberlink/Zip

#### 6.1.1 Reglas básicas

El minijuego se inspira en puzzles de camino tipo Numberlink:[^31][^32]

- Cuadrícula 2D con celdas numeradas (1, 2, 3, … n).  
- El jugador traza una línea continua que pasa por los números en orden creciente (1→2→3→…).  
- Cada celda solo se puede usar una vez; la línea no puede cruzarse ni ocupar dos veces la misma celda.[^32][^33]
- Existen obstáculos (muros, celdas bloqueadas) que impiden conectar directamente ciertas celdas, obligando a buscar rutas alternativas.

#### 6.1.2 Dificultad y DDA

La dificultad se ajusta mediante:

- Tamaño de la cuadrícula (4×4, 6×6, 8×8…).  
- Cantidad de números y densidad de obstáculos.  
- Tiempo límite (modo historia vs. modo desafío).[^34][^27]

El sistema DDA observa tiempo de solución, número de backtracks y cantidad de intentos fallidos para aumentar o reducir complejidad, siguiendo enfoques de generación adaptativa de puzzles de ruta.[^18][^16][^27]

### 6.2 Minijuego de búsqueda de objetos con bóveda

#### 6.2.1 Búsqueda de objetos

En determinadas escenas (habitaciones, paisajes, ciudades) el jugador debe encontrar objetos específicos entre muchos elementos del entorno, en línea con juegos de búsqueda tradicionales.[^35][^26]
Algunos objetos son consumibles (se usan en el momento) y otros se consideran “objetos clave” que se guardan en una bóveda/inventario para uso diferido.[^36]

#### 6.2.2 Bóveda e integración con otros minijuegos

La bóveda muestra los objetos clave y sus posibles usos futuros:

- Por ejemplo, una llave encontrada en un nivel de búsqueda puede revelar pistas o desbloquear rutas en un laberinto posterior, reforzando el vínculo entre atención pasada y facilitación futura.[^32][^4]
- Diseñar objetivos con valor a largo plazo (llaves, notas, símbolos) y objetos “ruido” con gratificación inmediata pero poco impacto ayuda a entrenar la capacidad de distinguir lo importante de lo superficial.[^26][^36]

### 6.3 Shooter matemático con láser

#### 6.3.1 Mecánica

El minijuego se inspira en shooters educativos donde se debe disparar al resultado correcto de una operación:[^6][^28]

- La pantalla muestra una operación (p.ej. 7+5, 3×4+2) y varios objetivos con números posibles.  
- El jugador controla un láser o nave y debe disparar solo al objetivo con el resultado correcto.  
- Aciertos destruyen el objetivo y permiten avanzar; errores se registran y se ofrece un nuevo intento.[^37][^38]

#### 6.3.2 Dificultad y pausas por error

La dificultad crece pasando de sumas/restas simples a multiplicaciones, divisiones básicas y expresiones encadenadas.[^38][^39]
Tras varios errores consecutivos, el sistema activa una **pausa de regulación**: el reto se detiene y el narrador guía al jugador a una actividad de respiración o descompresión antes de reintentar, siguiendo recomendaciones de recursos de autorregulación.[^20][^21]

### 6.4 Ejercicios de agilidad mental

Cada cierto número de misiones, se activan minijuegos breves de agilidad mental:

- Seriaciones rápidas (patrones numéricos simples).  
- Micro problemas lógicos de 30 segundos.  
- Tareas de identificación de patrones o símbolos.

La literatura sobre andamiaje en game‑based learning sugiere que intercalar tareas distintas sostiene atención y motivación, además de reforzar transferencia de habilidades.[^40][^41][^42]

### 6.5 Ejercicios de coordinación física (manos alternadas)

Se incorporan minijuegos de coordinación bimanual donde el jugador sigue patrones de manos alternadas (por ejemplo, una mano abierta y la otra en puño; luego cambiar de forma rápida y mantener ritmo), representados visualmente en pantalla.[^22]
Este tipo de entrenamiento se vincula con mejora potencial de mecanismos de inhibición y control motor, alineado con los objetivos de autocontrol y autorregulación del juego.[^22]

## 7. Pausas conscientes y actividades de respiración

### 7.1 Pausas programadas y adaptativas

El juego incluye dos tipos de pausas conscientes:

- **Pausas programadas**: cada cierto número de misiones o tras completar un acto, el juego propone actividades de respiración y atención corporal para “resetear” y consolidar lo aprendido.[^19][^20]
- **Pausas adaptativas**: cuando se detectan múltiples errores consecutivos o frustración (por ejemplo, numerosos reintentos en un laberinto), el narrador sugiere parar, realizar ejercicios de respiración o escuchar una canción antes de seguir.[^43][^44]

### 7.2 Juegos de respiración

Basados en recursos de regulación y mindfulness para niños y jóvenes:[^45][^46]

- Respiración en caja (inhalar–sostener–exhalar–sostener).  
- “Flor y vela”: inhalar como si se oliera una flor, exhalar suave como soplando una vela.  
- “Dragón”: inhalar como si se tomara aire de fuego y exhalar largo expulsándolo.

Estas actividades se integran como minijuegos cortos con animaciones y guías verbales, reforzando el vínculo entre autocuidado y claridad mental antes de tomar decisiones.[^21][^20]

## 8. Sistema de dificultad dinámica (DDA) y rejugabilidad

### 8.1 Parámetros de DDA

Inspirado en investigaciones sobre ajuste dinámico en juegos educativos y serious games:[^16][^17][^18]

- Tiempo límite de misión.  
- Número de distractores visuales.  
- Complejidad de las decisiones (cantidad de opciones, información disponible).  
- Frecuencia de ayudas del narrador y de pausas sugeridas.

El sistema ajusta estos parámetros según desempeño reciente del jugador, manteniendo el reto en un rango de dificultad que favorece aprendizaje sin frustración excesiva.[^23][^27]

### 8.2 Modos de juego

- **Modo historia**: dificultad base, con narrativa completa y ayudas del guía.  
- **Modo desafío**: parámetros más exigentes (menos tiempo, más obstáculos, mayor complejidad de operaciones matemáticas) y menos ayudas directas.[^47][^25]
- **Modo reflexión**: sin límite de tiempo, con comentarios extensos del narrador y recapitulaciones detalladas de decisiones.

### 8.3 Rejugabilidad

Los mismos niveles y minijuegos pueden rejugarse en modos distintos y con parámetros aumentados, permitiendo al jugador experimentar cómo su estilo de decisión cambia con el tiempo y practicar estrategias de regulación y planificación.[^25][^27]

## 9. Integración cultural: gaman y sisu

### 9.1 Gaman (Japón)

El concepto japonés de *gaman* se refiere a soportar dificultades con paciencia, autocontrol y dignidad, y está profundamente arraigado en la cultura y en prácticas educativas.[^48][^49][^50]
Integrar *gaman* en la narrativa significa valorar misiones largas, esfuerzo silencioso y perseverancia sin recompensas inmediatas, reconociendo el mérito de seguir adelante con calma ante retos frustrantes.[^51][^52][^53]

### 9.2 Sisu (Finlandia)

*Sisu* describe una forma de fuerza interior, perseverancia extraordinaria y coraje para avanzar más allá del punto en que parece razonable ceder.[^54][^55][^56]
El juego puede incorporar personajes o misiones que encarnen *sisu*, donde el jugador aprende a aceptar la incomodidad y a avanzar paso a paso, reinterpretando fracasos como datos para aprender, más que como motivos para rendirse.[^56][^54]

## 10. Limitaciones y cuidados

### 10.1 Transferencia a la vida real

La evidencia indica que entrenar funciones ejecutivas e inhibición mediante juegos mejora tareas similares, pero no garantiza cambios amplios en conducta cotidiana sin apoyo adicional.[^57][^10][^3]
Por tanto, el diseño incluye recapitulaciones y puentes explícitos hacia la vida diaria (ejemplos concretos, sugerencias de aplicación fuera del juego) para aumentar la probabilidad de transferencia.[^29][^1]

### 10.2 Riesgo de refuerzo de patrones adictivos

Una baja capacidad de retrasar gratificación se relaciona con mayor riesgo de uso problemático de tecnologías y juegos, por lo que se evita apoyarse en recompensas aleatorias constantes tipo “loot box”; se priorizan recompensas de progreso significativo y reconocimiento cualitativo del esfuerzo.[^58][^4]

### 10.3 Entrenamiento sin contexto

Entrenar inhibición de forma aislada (sin narrativa ni contenido significativo) tiene impacto limitado sobre bienestar; por ello, en este diseño la inhibición y la paciencia siempre se entrenan ligadas a historias, dilemas y objetivos emocionalmente relevantes para el jugador.[^57][^1]

## 11. Conclusiones y próximos pasos

La planificación presentada integra evidencia científica sobre IE, SEL, retraso de gratificación, autorregulación, dificultad adaptativa y coordinación bimanual para diseñar un videojuego 2D Android que combina diversión con aprendizaje socioemocional profundo.[^16][^1][^2]
Los siguientes pasos técnicos consisten en construir el Game Design Document (GDD) detallado con tablas de niveles (laberintos, búsqueda de objetos, shooter matemático), parámetros de DDA, guiones del narrador y especificaciones de UI, y posteriormente iterar el diseño mediante pruebas piloto con usuarios para validar impacto emocional y de toma de decisiones.[^59][^40]

## 12. Referencias seleccionadas

- De la Barrera, U. et al. (2021). EmoTIC: Impact of a game-based social-emotional programme on adolescents. *PLOS ONE*.[^2]
- Montoya-Castilla, I. et al. (2021). Serious game to promote socioemotional learning and mental health (emoTIC): study protocol.[^60][^61]
- Papoutsi, C. et al. (2021). Developing Emotional Intelligence with a Game: The League of Emotions Learners Approach.[^5]
- Barrera, U. et al. (2025). Game-Based Social-Emotional Learning for Youth.[^1]
- Gilis, L. et al. (2020). Evaluating a Board Game Designed to Promote Young Children's Delay of Gratification.[^4]
- Boendermaker, W. J. (2017). Training Behavioral Control in Adolescents Using a Serious Game (The Fling).[^11]
- Romer, D. (2010). Delay of gratification in the development of control over risk taking.[^12]
- Fenton-O’Creevy, M. et al. (2015). A game-based approach to improve traders’ decision-making.[^13]
- Rhodes, R. E. et al. (2017). Teaching Decision Making With Serious Games.[^15]
- Krath, J. et al. (2025). Gamified scaffolding in formal education: A scoping review.[^41]
- Aponte, M. V. et al. (2013). The effectiveness of adaptive difficulty adjustments in educational computer games.[^16]
- Víteková, L. (2026). Dynamic Difficulty Adjustment in Serious Games.[^18]
- BBC Mundo. Los beneficios (y peligros) del «gaman».[^49]
- Artículos sobre *sisu* como concepto finlandés de fuerza interior.[^55][^54][^56]
- Recursos sobre actividades de respiración y autorregulación infantil.[^46][^20][^45]

---

## References

1. [Game-Based Social-Emotional Learning for Youth - PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12289224/) - Adverse childhood experiences such as violence, substance use, and family disruption disproportionat...

2. [EmoTIC: Impact of a game-based social-emotional programme on adolescents](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0250384) - Introduction Technologies provide a brilliant opportunity to promote social-emotional competences, w...

3. [The effectiveness of serious games for training of attention ...](https://www.frontiersin.org/journals/child-and-adolescent-psychiatry/articles/10.3389/frcha.2026.1801077/full) - por V Tommasi · 2026 — The results showed a significant larger gain in the EG compared to the CG, wi...

4. [Evaluating a Board Game Designed to Promote Young Children's Delay ...](https://pmc.ncbi.nlm.nih.gov/articles/PMC7686572/) - Delay of gratification, or the extent to which one can resist the temptation of an immediate reward ...

5. [[PDF] Developing Emotional Intelligence with a Game: The League of ...](https://gilt.isep.ipp.pt/wp-content/uploads/2021/11/Developing-Emotional-Intelligence-with-a-Game.pdf)

6. [Math Shooter - Apps on Google Play](https://play.google.com/store/apps/details?id=com.royals.mathshootergame&hl=en_CA) - Master math while defending the galaxy Solve equation and become a math champion

7. [Developing Emotional Intelligence with a Game: The League of Emotions Learners Approach](https://www.mdpi.com/2073-431X/10/8/97) - Being able to understand, express, and communicate emotions is widely recognized as a fundamental co...

8. [Impact of a game-based social-emotional programme on ...](https://pmc.ncbi.nlm.nih.gov/articles/PMC8051799/) - Technologies provide a brilliant opportunity to promote social-emotional competences, well-being and...

9. [Serious games y educación emocional para adolescentes: Una revisión sistemática](https://openaccess.uoc.edu/bitstream/10609/146873/3/amoreno1024TFM0622memoria.pdf)

10. [Association of Affected Neurocircuitry With Deficit of Response ...](https://pmc.ncbi.nlm.nih.gov/articles/PMC6305413/) - The neural networks that constitute corticostriatothalamocortical circuits between prefrontal cortex...

11. [Training Behavioral Control in Adolescents Using a Serious ...](https://dspace.library.uu.nl/server/api/core/bitstreams/1e93159d-4065-46d8-85ee-925bad688bd6/content) - por WJ Boendermaker · 2017 · Mencionado por 32 — The goal of this study was to develop and evaluate ...

12. [Can adolescents learn self-control? Delay of gratification in ...](https://khu.elsevierpure.com/en/publications/can-adolescents-learn-self-control-delay-of-gratification-in-the--2/) - por D Romer · 2010 · Mencionado por 470 — Recent findings from developmental neuroscience suggest th...

13. [A GAME BASED APPROACH TO IMPROVE TRADERS’ DECISION-MAKING](https://oro.open.ac.uk/44856/1/Fentonocreevy2015-gamification-aston_paper-final.pdf)

14. [Game-based learning enhances business decision-making learning for on-the-job MBA students: A case study of dynamic systems-thinking course](https://www.sciencedirect.com/science/article/abs/pii/S1472811725000102) - This study examines the impact of game-based learning on business decision-making skills among worki...

15. [Teaching Decision Making With Serious Games - Rebecca E. Rhodes, Jonathon Kopecky, Nathan Bos, Jennifer McKneely, Abigail Gertner, Franklin Zaromb, Alexander Perrone, Jason Spitaletta, 2017](https://journals.sagepub.com/doi/10.1177/1555412016686642) - Game-based training may have different characteristics than other forms of instruction. The independ...

16. [The effectiveness of adaptive difficulty adjustments on students' motivation and learning in an educational computer game](https://www.sciencedirect.com/science/article/abs/pii/S0360131513001711) - Computer games that adaptively adjust difficulty are used to continuously challenge players accordin...

17. [Fuzzy-based dynamic difficulty adjustment of an educational ...](https://link.springer.com/article/10.1007/s11042-023-14515-w) - por K Chrysafiadi · 2023 · Mencionado por 52 — The proposed fuzzy-based DDA mechanism can be used by...

18. [Dynamic Difficulty Adjustment in Serious Games](https://www.mdpi.com/2078-2489/17/1/96) - por L Víteková · 2026 · Mencionado por 4 — Due to the dynamic learning and adaptation achievable by ...

19. [15+ Classroom Practices to Build Self-Regulation Skills](https://www.thepathway2success.com/15-classroom-practices-to-build-self-regulation-skills/) - Share via: Facebook 0 Twitter Print Email More Self-regulation skills are one of the biggest keys fo...

20. [Get ready to learn: 39 interoception activities to develop self-regulation](https://studentwellbeinghub.edu.au/media/erkfigg4/swh_getreadytolearn_selfregulationresource-2023.pdf)

21. [Grounding & Self Regulation Tools](https://vtrac.org/wp-content/uploads/2025/05/Emotional-Regulation-Mindfulness.pdf)

22. [Does bimanual coordination training benefit inhibitory function in ...](https://ouci.dntb.gov.ua/en/works/73waJ227/) - <jats:sec>IntroductionWhether complex movement training benefits inhibitory functions and transfers ...

23. [Dynamic Difficulty Adjustment Using Reinforcement ...](https://jurnal.unsur.ac.id/index.php/mjinformatika/article/view/6106) - The development of educational games holds significant potential for interactively instilling enviro...

24. [Dynamic difficulty adjustment technique-based mobile ...](https://www.sciencedirect.com/science/article/abs/pii/S1875952122000192) - por SM Shohieb · 2022 · Mencionado por 39 — This article describes the design, implementation, and e...

25. [Learning curves: analysing pace and challenge in four successful puzzle games](https://dl.acm.org/doi/10.1145/2658537.2658695) - The pace at which challenges are introduced in a game has long been identified as a key determinant ...

26. [Hierarchy of challenges – Game Design & Development 2021](https://ecampusontario.pressbooks.pub/gamedesigndevelopmenttextbook/chapter/hierarchy-of-challenges/) - a textbook created by students based on research in variety of areas related to game design and deve...

27. [A Demonstration of Pathfinding-Based Puzzle Generation ...](https://cspages.ucalgary.ca/~richard.zhao1/publications/2025aiide-adaptive_difficulty_game_demo.pdf) - por M McConnell · 2025 — In this demonstration paper, we showcase an adaptive puzzle- generation gam...

28. [Math Shooter - Educational Games For Kids](https://games.forkids.education/math-shooter/) - Look at the math problem what it says, and then click the right answer to shoot it and score. You mu...

29. [How Game-Based Learning Enhances Real-Life Decision ...](https://expoganados.com/en/how-game-based-learning-enhances-real-life-decision-making-skills/)

30. [Digital games and emotional competences: a study using ...](https://rodin.uca.es/bitstream/handle/10498/39792/Articulo+1.pdf?sequence=1)

31. [Number Paths | Numberlink Rules, Variants, and Solving Tips](https://quietpuzzle.com/en/number_paths/) - Learn the actual rules used in this Number Paths build, how it differs from other Numberlink variant...

32. [Numberlink - Wikipedia](https://en.wikipedia.org/wiki/Numberlink)

33. [Play Numberlink Online | Free Numberlink Puzzles](https://logic-puzzles-online.com/numberlink/) - Play Numberlink online for free with 5x5, 7x7 and 9x9 grids, easy, medium and hard difficulty, full-...

34. [Finding All Solutions and Instances of Numberlink and Slitherlink by ZDDs](https://www.mdpi.com/1999-4893/5/2/176) - Link puzzles involve finding paths or a cycle in a grid that satisfy given local and global properti...

35. [Game Architecture in Transmedia Education (GATE)](https://journal.seriousgamessociety.org/index.php/IJSG/article/download/1115/669/7656)

36. [Learning with serious games in economics education a ...](https://www.sciencedirect.com/science/article/abs/pii/S0883035522001094)

37. [Math Fact Shoot Out - Educational Games For Kids](https://games.forkids.education/math-fact-shoot-out/) - Math Facts Shoot Out is an exciting online game that combines math practice with basketball fun. The...

38. [Mathematic Adventures on Steam](https://store.steampowered.com/app/1630010/Mathematic_Adventures/) - Mathematic Adventures is a First Person Shooter Educational Game. There are over 15 million possible...

39. [MATH FPS: Solve or Die — Educational Math Shooter Game ...](https://mathfps.netlify.app/) - A sci-fi FPS developed by Fyros Games Studio and published by Crosse Studios, where math is your amm...

40. [The Design of Scaffolding in Game-Based Learning: A Formative Evaluation.](https://eric.ed.gov/?id=EJ996648) - Instructional games fluctuate between

41. [Gamified scaffolding in formal education: A scoping review](https://aisel.aisnet.org/cgi/viewcontent.cgi?article=1271&context=hicss-57)

42. [Scaffolding game-based learning: Impact on ...](https://www.sciencedirect.com/science/article/abs/pii/S0360131513002224) - por S Barzilai · 2014 · Mencionado por 639 — Adding the scaffold before the game led to better probl...

43. [Is it me or the music? Stress reduction and the role of regulation strategies and music - Margarida Baltazar, Daniel Västfjäll, Erkin Asutay, Lina Koppel, Suvi Saarikallio, 2019](https://journals.sagepub.com/doi/10.1177/2059204319844161) - Music is a common resource for the regulation of emotions, moods, and stress. This study aimed at de...

44. [12 Breathing Exercises for Kids: Easy Mindful Moments](https://preschoolbrightstart.com/breathing-exercises-for-kids/) - Introduce preschoolers to mindfulness with simple breathing exercises that support emotional regulat...

45. [Breathing Exercises for Kids: 7 Games That Beat "Just Breathe"](https://cognizenkids.com/blog/breathing-exercises-kids-games) - Discover 7 game-framed breathing exercises for kids that actually stick — no yoga mats needed. Pract...

46. [Calming breathing games for children - Blissful Kids](https://blissfulkids.com/calming-breathing-games-for-children-1-2/) - Engaging breathing games make it easy for children to learn self-regulation, mindfulness, and focusi...

47. [Significance of Dynamic Difficulty Adjustment in Delivering ...](https://dl.acm.org/doi/10.1145/3345120.3345168) - This study aims to verify the existence of conceptual thinking improvements via an educational game ...

48. [The art of perseverance: How gaman defined Japan](https://www.bbc.com/worklife/article/20190319-the-art-of-perseverance-how-gaman-defined-japan) - Every child in Japan is taught to gaman: to patiently persevere in tough times. Is this the way to c...

49. [Los beneficios (y los peligros) del "gaman", el arte de la paciencia y la perseverancia que define a la sociedad de Japón - BBC News Mundo](https://www.bbc.com/mundo/vert-cap-47970098) - En Japón, la paciencia y la resistencia ante las condiciones adversas son un valor social con nombre...

50. [Gaman (term)](https://en.wikipedia.org/wiki/Gaman_(term)) - Gaman (我慢) is a Japanese term of Zen Buddhist origin which means "enduring the seemingly unbearable ...

51. [Gaman Meaning: The Japanese Art of Enduring With Dignity](https://japaneserituals.com/gaman/) - Gaman (我慢) means to endure something difficult with patience and dignity. The two kanji combine ga (...

52. [Embracing Patience and Resilience in Japanese Culture](https://wabisabi-jp.com/blogs/wabi-sabi-journal/gaman) - Discover the Japanese concept of Gaman, a powerful practice of patience, endurance, and quiet streng...

53. [Japanese mindset Gaman: What it is, why it still matters and life lessons for everyday challenges](https://economictimes.indiatimes.com/news/international/us/japanese-mindset-gaman-what-it-is-why-it-still-matters-and-life-lessons-for-everyday-challenges/articleshow/132462165.cms) - Japanese mindset Gaman teaches people to face difficult situations with patience, dignity, and quiet...

54. [The Psychology of Sisu — Find Finland's Hidden Strength](https://behaviorfacts.com/the-psychology-of-sisu-finlands-hidden-strength/) - Explore the psychology behind Finland’s concept of sisu — a powerful mindset of courage, perseveranc...

55. [Sisu: The Finnish Secret of Inner Strength and Resilience](https://www.psychologytoday.com/gb/blog/the-quiet-joy-of-being/202303/sisu-the-finnish-secret-of-inner-strength-and-resilience) - Sisu is deeply embodied in the Finnish culture and national identity and is usually seen as somethin...

56. [Sisu: The Finnish Concept of Inner Strength and Resilience](https://scandification.com/sisu-the-finnish-concept-of-inner-strength-and-resilience/) - Finland's untranslatable word for grit and resilience — sisu — has shaped a nation and inspired the ...

57. [Beyond the Marshmallow Test: Rethinking Delayed Gratification](https://www.psychologytoday.com/us/blog/insight-therapy/202407/beyond-the-marshmallow-test-rethinking-delayed-gratification) - Cognitive control develops gradually during childhood, The question for psychologists and policymake...

58. [The Prediction Role of Delay of Gratification on Game ...](https://files.eric.ed.gov/fulltext/EJ1294997.pdf)

59. [Toward a Mid-Range Design Theory for Developing ...](https://www.tandfonline.com/doi/full/10.1080/10580530.2023.2267762) - Serious games (SGs) represent promising digital learning tools. However, SG design frameworks freque...

60. [Serious game to promote socioemotional learning and mental health (emoTIC): a study protocol for randomised controlled trial - PubMed](https://pubmed.ncbi.nlm.nih.gov/34972764/) - University of Valencia. Principal investigator: Inmaculada Montoya-Castilla.

61. [Serious Game To Promote Socioemotional | PDF | Emotions - Scribd](https://www.scribd.com/document/863594023/Serious-game-to-promote-socioemotional) - The document outlines a study protocol for a randomized controlled trial of the emoTIC program, a se...

