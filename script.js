/* ================================================
   TOMY LA TORTUGA Y LAS PERLAS MÁGICAS
   script.js - Lógica principal del juego
   Versión 1.0.0
   ================================================
   ÍNDICE DE SECCIONES:
   1. CONFIGURACIÓN DEL JUEGO
   2. DATOS: MUNDOS Y PREGUNTAS
   3. DATOS: ANIMALES DE LA COLECCIÓN
   4. DATOS: LOGROS
   5. GESTIÓN DE PROGRESO (localStorage)
   6. SISTEMA DE NAVEGACIÓN / UI
   7. SISTEMA DE MUNDOS Y NIVELES
   8. SISTEMA DE PREGUNTAS (Mundo 1: Multiplicaciones)
   9. SISTEMA DE PREGUNTAS (Mundo 2: Divisiones)
   10. SISTEMA DE PREGUNTAS (Mundo 3: Fracciones)
   11. SISTEMA DE PREGUNTAS (Mundo 4: Mixto)
   12. SISTEMA DE RECOMPENSAS
   13. COLECCIÓN DE ANIMALES
   14. PANTALLA DE PROGRESO Y LOGROS
   15. EFECTOS VISUALES Y CELEBRACIONES
   16. INICIALIZACIÓN
   ================================================ */

'use strict';

// ================================================
// 1. CONFIGURACIÓN DEL JUEGO
// ================================================
const CONFIG = {
  LEVELS_PER_WORLD: 5,
  PEARLS_PER_CORRECT: 1,
  STARS_PER_LEVEL: 1,
  MEDALS_PER_WORLD: 1,
  STORAGE_KEY: 'tomy_game_v1',
  // Cuántas estrellas necesita cada mundo para desbloquear el siguiente
  UNLOCK_THRESHOLD: 3
};

// Mensajes de refuerzo positivo de Tomy
const TOMY_MESSAGES = {
  start: [
    '¡Hola! Soy Tomy. ¡Vamos a aprender juntos! 🌊',
    '¡Puedo ver muchos peces hoy! ¿Me ayudas a contarlos? 🐟',
    '¡Tú puedes lograrlo! Yo estaré aquí contigo. 🐢',
    '¡Juntos somos el mejor equipo del océano! 🤝'
  ],
  correct: [
    '¡EXCELENTE trabajo! ¡Eres increíble! 🌟',
    '¡Tomy está muy feliz! ¡Lo lograste! 🎉',
    '¡Has encontrado una Perla Mágica! ✨',
    '¡Eres un explorador del océano INCREÍBLE! 🌊',
    '¡Superaste el reto! ¡El océano te celebra! 🐠',
    '¡Asombroso! ¡Eres muy inteligente! 🧠✨'
  ],
  encouragement: [
    '¡Inténtalo de nuevo! ¡Tú puedes! 💪',
    '¡El océano te anima! ¡Sigue adelante! 🌊',
    '¡Casi lo tienes! ¡Una vez más! 🐢',
    '¡Tomy confía en ti! ¡Vamos! 💙'
  ],
  world_complete: [
    '¡Completaste el mundo! ¡Eres un campeón! 🏆',
    '¡Tomy está muy orgulloso de ti! ¡Fantástico! 🌟',
    '¡Eres el mejor explorador del océano! 🌊🎉'
  ]
};

// ================================================
// 2. DATOS: MUNDOS Y PREGUNTAS
// ================================================

// ----- Mundo 1: Banco de Peces (Multiplicaciones) -----
const WORLD1_QUESTIONS = [
  {
    id: 'w1l1',
    type: 'multiplication',
    groups: 2, itemsPerGroup: 3, emoji: '🐟',
    question: '¿Cuántos peces hay en total?',
    answer: 6, options: [4, 6, 9],
    hint: '¡Cuenta 2 grupos con 3 peces cada uno!'
  },
  {
    id: 'w1l2',
    type: 'multiplication',
    groups: 3, itemsPerGroup: 2, emoji: '🐠',
    question: '¿Cuántos peces de colores hay en total?',
    answer: 6, options: [5, 6, 8],
    hint: '¡Tienes 3 grupos con 2 peces de colores cada uno!'
  },
  {
    id: 'w1l3',
    type: 'multiplication',
    groups: 2, itemsPerGroup: 5, emoji: '🐡',
    question: '¿Cuántos peces globo hay en total?',
    answer: 10, options: [7, 10, 12],
    hint: '¡2 grupos con 5 peces globo cada uno!'
  },
  {
    id: 'w1l4',
    type: 'multiplication',
    groups: 3, itemsPerGroup: 4, emoji: '🐟',
    question: '¿Cuántos peces hay en todos los grupos?',
    answer: 12, options: [9, 12, 15],
    hint: '¡3 grupos × 4 peces = ...!'
  },
  {
    id: 'w1l5',
    type: 'multiplication',
    groups: 4, itemsPerGroup: 3, emoji: '🐠',
    question: '¡El último reto! ¿Cuántos peces de colores hay?',
    answer: 12, options: [10, 12, 16],
    hint: '¡4 grupos con 3 peces de colores = ...!'
  }
];

// ----- Mundo 2: El Cangrejo Repartidor (Divisiones) -----
const WORLD2_QUESTIONS = [
  {
    id: 'w2l1',
    type: 'division',
    totalItems: 6, groups: 2,
    itemEmoji: '🐚', animalEmojis: ['🐢', '🐠'],
    question: 'Reparte 6 conchas entre 2 amigos.',
    answer: 3,
    hint: '¿Cuántas conchas le toca a cada uno?'
  },
  {
    id: 'w2l2',
    type: 'division',
    totalItems: 8, groups: 2,
    itemEmoji: '🌟', animalEmojis: ['🦀', '🐙'],
    question: 'Reparte 8 estrellas entre 2 animales.',
    answer: 4,
    hint: '¿Cuántas estrellas le toca a cada animal?'
  },
  {
    id: 'w2l3',
    type: 'division',
    totalItems: 9, groups: 3,
    itemEmoji: '🐚', animalEmojis: ['🐟', '🦈', '🐡'],
    question: 'Reparte 9 conchas entre 3 peces.',
    answer: 3,
    hint: '¡3 peces tienen que recibir la misma cantidad!'
  },
  {
    id: 'w2l4',
    type: 'division',
    totalItems: 12, groups: 3,
    itemEmoji: '🌟', animalEmojis: ['🦭', '🐬', '🐋'],
    question: 'Reparte 12 estrellas entre 3 animales marinos.',
    answer: 4,
    hint: '¡12 ÷ 3 = ... estrellas para cada uno!'
  },
  {
    id: 'w2l5',
    type: 'division',
    totalItems: 12, groups: 4,
    itemEmoji: '🐚', animalEmojis: ['🐢', '🐠', '🦀', '🐙'],
    question: '¡Reto final! Reparte 12 conchas entre 4 amigos.',
    answer: 3,
    hint: '12 conchas ÷ 4 amigos = ¿cuántas?'
  }
];

// ----- Mundo 3: El Pulpo Constructor (Fracciones) -----
const WORLD3_QUESTIONS = [
  {
    id: 'w3l1',
    type: 'fraction',
    shape: 'circle',
    filled: 1, total: 2,
    question: '¿Qué parte de la figura está pintada?',
    answer: '1/2', options: ['1/2', '1/3', '1/4'],
    hint: '¡La figura está dividida en 2 partes y 1 está pintada!',
    color: '#ff6b6b'
  },
  {
    id: 'w3l2',
    type: 'fraction',
    shape: 'square',
    filled: 1, total: 4,
    question: '¿Qué fracción del cuadrado está coloreada?',
    answer: '1/4', options: ['1/2', '1/3', '1/4'],
    hint: '¡El cuadrado tiene 4 partes iguales, 1 está coloreada!',
    color: '#9b59b6'
  },
  {
    id: 'w3l3',
    type: 'fraction',
    shape: 'circle',
    filled: 1, total: 3,
    question: '¿Qué fracción del círculo está pintada?',
    answer: '1/3', options: ['1/2', '1/3', '1/4'],
    hint: '¡El círculo tiene 3 partes iguales, 1 está pintada!',
    color: '#00d4aa'
  },
  {
    id: 'w3l4',
    type: 'fraction',
    shape: 'triangle',
    filled: 1, total: 2,
    question: '¿Qué parte del triángulo está coloreada?',
    answer: '1/2', options: ['1/4', '1/2', '1/3'],
    hint: '¡El triángulo tiene 2 partes, 1 está coloreada!',
    color: '#ffd700'
  },
  {
    id: 'w3l5',
    type: 'fraction',
    shape: 'square',
    filled: 1, total: 3,
    question: '¡Difícil! ¿Qué fracción del rectángulo está pintada?',
    answer: '1/3', options: ['1/4', '1/2', '1/3'],
    hint: '¡3 partes iguales, 1 pintada = 1/3!',
    color: '#e67e22'
  }
];

// ----- Mundo 4: Reino de las Ballenas (Mixto) -----
const WORLD4_QUESTIONS = [
  {
    id: 'w4l1',
    type: 'multiplication',
    groups: 3, itemsPerGroup: 3, emoji: '🐟',
    question: '¿Cuántos peces hay en el Reino de las Ballenas?',
    answer: 9, options: [6, 9, 12],
    hint: '¡3 grupos × 3 peces cada uno!'
  },
  {
    id: 'w4l2',
    type: 'division',
    totalItems: 10, groups: 2,
    itemEmoji: '🌟', animalEmojis: ['🐋', '🦭'],
    question: 'Reparte 10 tesoros entre la ballena y la foca.',
    answer: 5,
    hint: '10 ÷ 2 = ¿cuántos tesoros?'
  },
  {
    id: 'w4l3',
    type: 'fraction',
    shape: 'circle',
    filled: 1, total: 4,
    question: '¿Qué parte de la perla mágica está iluminada?',
    answer: '1/4', options: ['1/2', '1/3', '1/4'],
    hint: '¡La perla tiene 4 partes, 1 brilla!',
    color: '#9b59b6'
  },
  {
    id: 'w4l4',
    type: 'multiplication',
    groups: 4, itemsPerGroup: 4, emoji: '🐠',
    question: '¿Cuántos peces de colores viven en el reino?',
    answer: 16, options: [12, 16, 20],
    hint: '¡4 grupos × 4 peces de colores!'
  },
  {
    id: 'w4l5',
    type: 'division',
    totalItems: 15, groups: 3,
    itemEmoji: '🔮', animalEmojis: ['🐋', '🐬', '🦭'],
    question: '¡Reto final! Reparte 15 perlas mágicas entre 3 animales.',
    answer: 5,
    hint: '¡15 perlas ÷ 3 animales = ...!'
  }
];

const WORLDS_DATA = [
  {
    id: 1,
    name: 'Banco de Peces',
    emoji: '🐟',
    theme: 'Multiplicaciones',
    color: '#1e8bc3',
    questions: WORLD1_QUESTIONS,
    unlockAnimal: 'dolphin',
    description: 'Aprende a multiplicar contando grupos de peces'
  },
  {
    id: 2,
    name: 'El Cangrejo Repartidor',
    emoji: '🦀',
    theme: 'Divisiones',
    color: '#e67e22',
    questions: WORLD2_QUESTIONS,
    unlockAnimal: 'crab',
    description: 'Aprende a dividir repartiendo tesoros del mar'
  },
  {
    id: 3,
    name: 'El Pulpo Constructor',
    emoji: '🐙',
    theme: 'Fracciones',
    color: '#9b59b6',
    questions: WORLD3_QUESTIONS,
    unlockAnimal: 'octopus',
    description: 'Aprende fracciones con figuras mágicas'
  },
  {
    id: 4,
    name: 'Reino de las Ballenas',
    emoji: '🐋',
    theme: 'Retos Mixtos',
    color: '#00d4aa',
    questions: WORLD4_QUESTIONS,
    unlockAnimal: 'whale',
    description: '¡El gran reto final con todo lo aprendido!'
  }
];

// ================================================
// 3. DATOS: ANIMALES DE LA COLECCIÓN
// ================================================
const ANIMALS_DATA = {
  turtle: {
    emoji: '🐢',
    name: 'Tomy la Tortuga',
    description: 'Tu compañero de aventuras. ¡Siempre está contigo en el océano!',
    unlockCondition: 'Siempre desbloqueado',
    unlocked: true // Siempre disponible
  },
  dolphin: {
    emoji: '🐬',
    name: 'Dory el Delfín',
    description: 'El delfín más veloz del océano. ¡Le encanta saltar y jugar!',
    unlockCondition: 'Completa el Mundo 1',
    unlocked: false
  },
  crab: {
    emoji: '🦀',
    name: 'Carlos el Cangrejo',
    description: 'El cangrejo repartidor. ¡Siempre justo y generoso con sus conchas!',
    unlockCondition: 'Completa el Mundo 2',
    unlocked: false
  },
  octopus: {
    emoji: '🐙',
    name: 'Pablo el Pulpo',
    description: 'El pulpo constructor. ¡Tiene 8 brazos para construir cualquier cosa!',
    unlockCondition: 'Completa el Mundo 3',
    unlocked: false
  },
  seahorse: {
    emoji: '🦭',
    name: 'Simón el Caballito de Mar',
    description: '¡El animal más elegante del océano! Nada muy despacio pero con estilo.',
    unlockCondition: 'Gana 10 Perlas Mágicas',
    unlocked: false
  },
  clownfish: {
    emoji: '🐠',
    name: 'Nemo el Pez Payaso',
    description: '¡El pez más gracioso del arrecife! Siempre está de buen humor.',
    unlockCondition: 'Responde 15 preguntas correctas',
    unlocked: false
  },
  whale: {
    emoji: '🐋',
    name: 'Wanda la Ballena',
    description: '¡La reina del océano! Su canto llega a todos los rincones del mar.',
    unlockCondition: 'Completa el Mundo 4',
    unlocked: false
  },
  starfish: {
    emoji: '⭐',
    name: 'Stella la Estrella de Mar',
    description: 'Brilla en el fondo del océano. ¡Colecciona estrellas para encontrarla!',
    unlockCondition: 'Gana 9 estrellas totales',
    unlocked: false
  }
};

// ================================================
// 4. DATOS: LOGROS
// ================================================
const ACHIEVEMENTS_DATA = [
  { id: 'first_pearl', icon: '🔮', name: 'Primera Perla', desc: 'Ganar tu primera Perla Mágica', condition: p => p.totalPearls >= 1 },
  { id: 'pearl_collector', icon: '💎', name: 'Coleccionista', desc: 'Ganar 10 Perlas Mágicas', condition: p => p.totalPearls >= 10 },
  { id: 'pearl_master', icon: '👑', name: 'Maestro de Perlas', desc: 'Ganar 20 Perlas Mágicas', condition: p => p.totalPearls >= 20 },
  { id: 'world1_complete', icon: '🐟', name: 'Domador de Peces', desc: 'Completar el Mundo 1', condition: p => p.worldsCompleted.includes(1) },
  { id: 'world2_complete', icon: '🦀', name: 'Gran Repartidor', desc: 'Completar el Mundo 2', condition: p => p.worldsCompleted.includes(2) },
  { id: 'world3_complete', icon: '🐙', name: 'Constructor de Fracciones', desc: 'Completar el Mundo 3', condition: p => p.worldsCompleted.includes(3) },
  { id: 'world4_complete', icon: '🐋', name: 'Rey del Océano', desc: 'Completar el Mundo 4', condition: p => p.worldsCompleted.includes(4) },
  { id: 'all_worlds', icon: '🏆', name: '¡Explorador Total!', desc: 'Completar todos los mundos', condition: p => p.worldsCompleted.length >= 4 },
  { id: 'sharp_mind', icon: '🧠', name: 'Mente Aguda', desc: 'Responder 20 preguntas correctas', condition: p => p.totalCorrect >= 20 },
  { id: 'star_collector', icon: '⭐', name: 'Coleccionista Estelar', desc: 'Ganar 9 estrellas', condition: p => p.totalStars >= 9 }
];

// ================================================
// 5. GESTIÓN DE PROGRESO (localStorage)
// ================================================
const Progress = (() => {
  // Estado inicial del progreso
  const defaultState = () => ({
    totalPearls: 0,
    totalStars: 0,
    totalMedals: 0,
    totalCorrect: 0,
    worldsCompleted: [],
    worldStars: { 1: 0, 2: 0, 3: 0, 4: 0 },
    worldProgress: { 1: 0, 2: 0, 3: 0, 4: 0 },
    unlockedAnimals: ['turtle'],
    earnedAchievements: [],
    gameCompleted: false
  });

  let state = defaultState();

  /** Cargar el progreso guardado desde localStorage */
  function load() {
    try {
      const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        state = { ...defaultState(), ...parsed };
      }
    } catch (e) {
      console.warn('No se pudo cargar el progreso:', e);
      state = defaultState();
    }
  }

  /** Guardar el progreso actual en localStorage */
  function save() {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('No se pudo guardar el progreso:', e);
    }
  }

  /** Obtener el estado actual */
  function get() { return state; }

  /** Actualizar el progreso con nuevos datos */
  function update(changes) {
    state = { ...state, ...changes };
    save();
  }

  /** Agregar perlas */
  function addPearls(n) {
    state.totalPearls += n;
    save();
  }

  /** Agregar estrellas */
  function addStars(n) {
    state.totalStars += n;
    save();
  }

  /** Agregar medallas */
  function addMedal() {
    state.totalMedals += 1;
    save();
  }

  /** Incrementar respuestas correctas */
  function addCorrect() {
    state.totalCorrect += 1;
    save();
  }

  /** Marcar mundo como completado con estrellas ganadas */
  function completeWorld(worldId, stars) {
    if (!state.worldsCompleted.includes(worldId)) {
      state.worldsCompleted.push(worldId);
    }
    // Guardar la mejor puntuación
    if ((state.worldStars[worldId] || 0) < stars) {
      state.worldStars[worldId] = stars;
    }
    state.worldProgress[worldId] = 100;
    save();
  }

  /** Actualizar el progreso de un mundo */
  function setWorldProgress(worldId, percent) {
    state.worldProgress[worldId] = Math.min(100, percent);
    save();
  }

  /** Desbloquear un animal */
  function unlockAnimal(animalKey) {
    if (!state.unlockedAnimals.includes(animalKey)) {
      state.unlockedAnimals.push(animalKey);
      save();
      return true; // Recién desbloqueado
    }
    return false;
  }

  /** Verificar y otorgar logros */
  function checkAchievements() {
    const newlyEarned = [];
    ACHIEVEMENTS_DATA.forEach(ach => {
      if (!state.earnedAchievements.includes(ach.id) && ach.condition(state)) {
        state.earnedAchievements.push(ach.id);
        newlyEarned.push(ach);
      }
    });
    if (newlyEarned.length > 0) save();
    return newlyEarned;
  }

  /** Verificar si un animal debe desbloquearse */
  function checkAnimalUnlocks() {
    const p = state;
    const unlocked = [];
    // Por perlas
    if (p.totalPearls >= 10 && !p.unlockedAnimals.includes('seahorse')) {
      if (unlockAnimal('seahorse')) unlocked.push('seahorse');
    }
    // Por respuestas correctas
    if (p.totalCorrect >= 15 && !p.unlockedAnimals.includes('clownfish')) {
      if (unlockAnimal('clownfish')) unlocked.push('clownfish');
    }
    // Por estrellas
    if (p.totalStars >= 9 && !p.unlockedAnimals.includes('starfish')) {
      if (unlockAnimal('starfish')) unlocked.push('starfish');
    }
    return unlocked;
  }

  /** Reiniciar todo el progreso */
  function reset() {
    state = defaultState();
    save();
  }

  return { load, save, get, update, addPearls, addStars, addMedal, addCorrect,
           completeWorld, setWorldProgress, unlockAnimal, checkAchievements,
           checkAnimalUnlocks, reset };
})();

// ================================================
// 6. SISTEMA DE NAVEGACIÓN / UI
// ================================================

/** Estado actual de la pantalla activa */
let currentScreen = 'screen-home';

/**
 * Navegar a una pantalla específica
 * @param {string} screenId - ID del elemento de pantalla
 */
function showScreen(screenId) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(s => s.classList.remove('active'));

  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    currentScreen = screenId;

    // Actualizar contenido al entrar en cada pantalla
    if (screenId === 'screen-home') updateHomeStats();
    if (screenId === 'screen-worldmap') updateWorldMap();
    if (screenId === 'screen-collection') renderCollection();
    if (screenId === 'screen-progress') renderProgress();
  }
}

/** Actualizar estadísticas de la pantalla de inicio */
function updateHomeStats() {
  const p = Progress.get();
  const el = (id) => document.getElementById(id);
  el('home-pearls').textContent = p.totalPearls;
  el('home-stars').textContent = p.totalStars;
}

/** Actualizar el mapa de mundos según el progreso */
function updateWorldMap() {
  const p = Progress.get();

  WORLDS_DATA.forEach((world, index) => {
    const card = document.getElementById(`world-card-${world.id}`);
    const starsEl = document.getElementById(`world-stars-${world.id}`);
    const statusEl = document.getElementById(`world-status-${world.id}`);

    if (!card) return;

    const stars = p.worldStars[world.id] || 0;
    const isCompleted = p.worldsCompleted.includes(world.id);

    // Determinar si está desbloqueado
    let isUnlocked = world.id === 1; // Mundo 1 siempre disponible
    if (world.id > 1) {
      const prevWorldStars = p.worldStars[world.id - 1] || 0;
      isUnlocked = p.worldsCompleted.includes(world.id - 1);
    }

    // Actualizar estrellas
    const starStr = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    starsEl.textContent = starStr;

    // Actualizar estado y clases
    if (isUnlocked) {
      card.classList.remove('locked');
      if (statusEl) {
        if (isCompleted) {
          statusEl.textContent = `⭐ Completado`;
          statusEl.style.background = 'rgba(255, 215, 0, 0.2)';
          statusEl.style.borderColor = 'rgba(255, 215, 0, 0.4)';
          statusEl.style.color = 'var(--gold)';
        } else {
          statusEl.textContent = '¡Disponible!';
          statusEl.style.background = '';
          statusEl.style.borderColor = '';
          statusEl.style.color = '';
        }
      }
    } else {
      card.classList.add('locked');
      if (statusEl) statusEl.textContent = '🔒 Bloqueado';
    }
  });

  // Progreso global
  const completedCount = p.worldsCompleted.length;
  const totalPercent = Math.round((completedCount / WORLDS_DATA.length) * 100);
  const fillEl = document.getElementById('global-progress-fill');
  const labelEl = document.getElementById('global-progress-label');
  if (fillEl) fillEl.style.width = `${totalPercent}%`;
  if (labelEl) labelEl.textContent = `${totalPercent}%`;
}

// ================================================
// 7. SISTEMA DE MUNDOS Y NIVELES
// ================================================

/** Estado del juego activo */
let gameState = {
  world: null,
  questions: [],
  currentQuestionIndex: 0,
  correctAnswers: 0,
  pearlsEarned: 0,
  starsEarned: 0
};

/**
 * Iniciar un mundo específico
 * @param {number} worldId - ID del mundo a iniciar
 */
function startWorld(worldId) {
  const p = Progress.get();
  const worldIndex = worldId - 1;

  // Verificar si está bloqueado
  if (worldId > 1 && !p.worldsCompleted.includes(worldId - 1)) {
    showSparkle('🔒', window.innerWidth / 2, window.innerHeight / 2);
    speakTomy('¡Primero completa el mundo anterior! Tomy confía en ti. 💪');
    return;
  }

  const world = WORLDS_DATA[worldIndex];
  if (!world) return;

  // Inicializar estado del juego
  gameState = {
    world: world,
    questions: shuffleArray([...world.questions]),
    currentQuestionIndex: 0,
    correctAnswers: 0,
    pearlsEarned: 0,
    starsEarned: 0
  };

  // Actualizar HUD
  document.getElementById('hud-world-name').textContent = `${world.emoji} ${world.name}`;
  updateLevelHUD();

  // Ir a la pantalla del juego
  showScreen('screen-game');

  // Cargar la primera pregunta
  setTimeout(() => {
    loadQuestion();
    speakTomy(randomItem(TOMY_MESSAGES.start));
  }, 400);
}

/** Actualizar la barra de progreso del nivel en el HUD */
function updateLevelHUD() {
  const { currentQuestionIndex, questions } = gameState;
  const total = questions.length;
  const percent = (currentQuestionIndex / total) * 100;

  document.getElementById('hud-level-num').textContent = currentQuestionIndex + 1;
  document.getElementById('level-progress-bar').style.width = `${percent}%`;

  const p = Progress.get();
  document.getElementById('hud-pearls').textContent = p.totalPearls;
  document.getElementById('hud-stars').textContent = p.totalStars;
}

/** Cargar la pregunta actual */
function loadQuestion() {
  const { questions, currentQuestionIndex } = gameState;
  if (currentQuestionIndex >= questions.length) {
    endWorld();
    return;
  }

  const question = questions[currentQuestionIndex];
  const qZone = document.getElementById('question-zone');
  const aZone = document.getElementById('answers-zone');

  // Limpiar zonas
  qZone.innerHTML = '';
  aZone.innerHTML = '';

  // Actualizar HUD
  updateLevelHUD();

  // Renderizar según tipo de pregunta
  switch (question.type) {
    case 'multiplication': renderMultiplication(question, qZone, aZone); break;
    case 'division':       renderDivision(question, qZone, aZone);       break;
    case 'fraction':       renderFraction(question, qZone, aZone);       break;
  }
}

/** Avanzar a la siguiente pregunta o terminar el mundo */
function nextQuestion() {
  document.getElementById('result-overlay').classList.add('hidden');

  gameState.currentQuestionIndex++;

  if (gameState.currentQuestionIndex < gameState.questions.length) {
    loadQuestion();
    speakTomy(randomItem(TOMY_MESSAGES.encouragement));
  } else {
    endWorld();
  }
}

/** Manejar respuesta del jugador */
function handleAnswer(isCorrect, clickedElement = null) {
  const question = gameState.questions[gameState.currentQuestionIndex];

  // Deshabilitar todos los botones de respuesta
  document.querySelectorAll('.answer-btn').forEach(btn => {
    btn.disabled = true;
  });

  if (isCorrect) {
    // Respuesta correcta
    if (clickedElement) clickedElement.classList.add('correct');

    Progress.addPearls(CONFIG.PEARLS_PER_CORRECT);
    Progress.addCorrect();
    gameState.correctAnswers++;
    gameState.pearlsEarned += CONFIG.PEARLS_PER_CORRECT;

    // Verificar desbloqueos
    Progress.checkAnimalUnlocks();
    const newAchievements = Progress.checkAchievements();

    // Celebración de Tomy
    celebrateTomy();
    showSparkle('🔮', Math.random() * window.innerWidth, Math.random() * window.innerHeight * 0.5);

    // Mostrar overlay de resultado
    showResultOverlay(true, question);

  } else {
    // Respuesta incorrecta (mostrar ayuda positiva)
    if (clickedElement) clickedElement.classList.add('wrong');
    speakTomy(randomItem(TOMY_MESSAGES.encouragement));

    // Permitir reintentar después de 1.5s
    setTimeout(() => {
      document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('wrong');
      });
    }, 1500);
  }
}

/** Mostrar el overlay de resultado correcto */
function showResultOverlay(isCorrect, question) {
  const overlay = document.getElementById('result-overlay');
  const msgs = TOMY_MESSAGES.correct;

  document.getElementById('result-emoji').textContent = '🎉';
  document.getElementById('result-title').textContent = '¡Correcto!';
  document.getElementById('result-msg').textContent = randomItem(msgs);

  const rewardsDiv = document.getElementById('result-rewards');
  rewardsDiv.innerHTML = `
    <div class="reward-badge">🔮 +${CONFIG.PEARLS_PER_CORRECT} Perla</div>
  `;

  // Hint/tip de la pregunta
  if (question.hint) {
    document.getElementById('result-msg').textContent += ` ${question.hint}`;
  }

  overlay.classList.remove('hidden');
  speakTomy(randomItem(TOMY_MESSAGES.correct));
  launchConfetti();
}

/** Terminar el mundo actual */
function endWorld() {
  const { world, correctAnswers, questions } = gameState;
  const total = questions.length;

  // Calcular estrellas (1 por cada ~33% de aciertos)
  let stars = 1;
  if (correctAnswers === total) stars = 3;
  else if (correctAnswers >= Math.ceil(total * 0.6)) stars = 2;

  gameState.starsEarned = stars;

  // Guardar progreso
  Progress.completeWorld(world.id, stars);
  Progress.addStars(stars);
  Progress.addMedal();

  // Desbloquear animal del mundo
  const animalKey = world.unlockAnimal;
  const isNewAnimal = Progress.unlockAnimal(animalKey);

  // Verificar desbloqueos adicionales
  Progress.checkAnimalUnlocks();
  Progress.checkAchievements();

  // Actualizar pantalla de world complete
  document.getElementById('complete-title').textContent = `¡${world.name} Completado!`;
  document.getElementById('complete-subtitle').textContent = randomItem(TOMY_MESSAGES.world_complete);
  document.getElementById('complete-correct').textContent = correctAnswers;
  document.getElementById('complete-pearls').textContent = gameState.pearlsEarned;

  // Mostrar estrellas con animación
  for (let i = 1; i <= 3; i++) {
    const starEl = document.getElementById(`star-${i}`);
    if (starEl) {
      starEl.textContent = i <= stars ? '⭐' : '☆';
      starEl.classList.remove('show');
      setTimeout(() => starEl.classList.add('show'), i * 200 + 300);
    }
  }

  // Mostrar animal desbloqueado si es nuevo
  const animalUnlockDiv = document.getElementById('new-animal-unlock');
  const animalPreviewDiv = document.getElementById('unlocked-animal-preview');
  if (isNewAnimal && ANIMALS_DATA[animalKey]) {
    animalUnlockDiv.classList.remove('hidden');
    animalPreviewDiv.textContent = ANIMALS_DATA[animalKey].emoji;
    animalPreviewDiv.setAttribute('title', ANIMALS_DATA[animalKey].name);
  } else {
    animalUnlockDiv.classList.add('hidden');
  }

  // Verificar si se completaron todos los mundos
  const p = Progress.get();
  if (p.worldsCompleted.length >= WORLDS_DATA.length && !p.gameCompleted) {
    Progress.update({ gameCompleted: true });
    setTimeout(() => showFinalScreen(), 3000);
  }

  showScreen('screen-world-complete');
  launchConfetti(60);
}

/** Salir del juego actual y volver al mapa */
function exitGame() {
  document.getElementById('result-overlay').classList.add('hidden');
  showScreen('screen-worldmap');
}

// ================================================
// 8. SISTEMA DE PREGUNTAS: MULTIPLICACIONES (Mundo 1)
// ================================================

/**
 * Renderizar una pregunta de multiplicación
 * @param {object} q - Objeto de pregunta
 * @param {HTMLElement} qZone - Zona de la pregunta
 * @param {HTMLElement} aZone - Zona de respuestas
 */
function renderMultiplication(q, qZone, aZone) {
  // Título de la pregunta
  const title = document.createElement('div');
  title.className = 'question-text';
  title.innerHTML = `<span style="color:var(--gold);">${q.groups} × ${q.itemsPerGroup}</span><br>${q.question}`;
  qZone.appendChild(title);

  // Visual: Grupos de peces
  const visual = document.createElement('div');
  visual.className = 'question-visual';

  for (let g = 0; g < q.groups; g++) {
    const group = document.createElement('div');
    group.className = 'fish-group';
    group.innerHTML = '';

    for (let i = 0; i < q.itemsPerGroup; i++) {
      const fish = document.createElement('span');
      fish.className = 'fish-item';
      fish.textContent = q.emoji;
      fish.style.animationDelay = `${(g * q.itemsPerGroup + i) * 0.15}s`;
      group.appendChild(fish);
    }

    const label = document.createElement('span');
    label.className = 'group-label';
    label.textContent = `Grupo ${g + 1}`;

    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.alignItems = 'center';
    wrapper.appendChild(group);
    wrapper.appendChild(label);
    visual.appendChild(wrapper);
  }

  qZone.appendChild(visual);

  // Botones de respuesta
  const shuffledOptions = shuffleArray([...q.options]);
  shuffledOptions.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = opt;
    btn.setAttribute('id', `answer-${opt}`);
    btn.onclick = function() {
      handleAnswer(opt === q.answer, btn);
    };
    aZone.appendChild(btn);
  });
}

// ================================================
// 9. SISTEMA DE PREGUNTAS: DIVISIONES (Mundo 2)
// ================================================

/** Estado de la actividad de división */
let divisionState = {
  buckets: [],
  totalItems: 0,
  groups: 0,
  correctPerGroup: 0,
  itemEmoji: '🐚'
};

/**
 * Renderizar una pregunta de división (arrastrar y soltar)
 * @param {object} q - Objeto de pregunta
 * @param {HTMLElement} qZone - Zona de la pregunta
 * @param {HTMLElement} aZone - Zona de respuestas
 */
function renderDivision(q, qZone, aZone) {
  divisionState = {
    buckets: Array(q.groups).fill(0),
    totalItems: q.totalItems,
    groups: q.groups,
    correctPerGroup: q.answer,
    itemEmoji: q.itemEmoji,
    question: q
  };

  // Título
  const title = document.createElement('div');
  title.className = 'question-text';
  title.textContent = q.question;
  qZone.appendChild(title);

  // Área de división
  const divArea = document.createElement('div');
  divArea.className = 'division-area';

  // Pool de items
  const poolTitle = document.createElement('p');
  poolTitle.style.cssText = 'font-weight:700;color:var(--turquoise-light);margin-bottom:0.3rem;font-size:0.9rem;';
  poolTitle.textContent = `¡Arrastra los ${q.itemEmoji} a cada animal!`;
  divArea.appendChild(poolTitle);

  const shellsPool = document.createElement('div');
  shellsPool.className = 'shells-pool';
  shellsPool.id = 'shells-pool';

  for (let i = 0; i < q.totalItems; i++) {
    const shell = document.createElement('span');
    shell.className = 'shell-item';
    shell.textContent = q.itemEmoji;
    shell.draggable = true;
    shell.dataset.index = i;
    shell.addEventListener('dragstart', onShellDragStart);
    shell.addEventListener('touchstart', onShellTouchStart, { passive: true });
    shellsPool.appendChild(shell);
  }
  divArea.appendChild(shellsPool);

  // Contenedores de animales
  const animalsDiv = document.createElement('div');
  animalsDiv.className = 'animals-containers';

  q.animalEmojis.forEach((animalEmoji, idx) => {
    const bucket = document.createElement('div');
    bucket.className = 'animal-bucket';
    bucket.id = `bucket-${idx}`;
    bucket.dataset.index = idx;
    bucket.innerHTML = `
      <div class="bucket-animal">${animalEmoji}</div>
      <div class="bucket-shells" id="bucket-shells-${idx}"></div>
      <div class="bucket-count" id="bucket-count-${idx}">0</div>
    `;

    bucket.addEventListener('dragover', e => {
      e.preventDefault();
      bucket.classList.add('over');
    });
    bucket.addEventListener('dragleave', () => bucket.classList.remove('over'));
    bucket.addEventListener('drop', e => onShellDrop(e, idx));

    // Touch support
    bucket.addEventListener('touchend', e => onShellTouchEnd(e, idx));

    animalsDiv.appendChild(bucket);
  });
  divArea.appendChild(animalsDiv);

  qZone.appendChild(divArea);

  // Botón de verificar
  const checkBtn = document.createElement('button');
  checkBtn.className = 'btn-check-division';
  checkBtn.textContent = '✅ ¡Listo! Verificar reparto';
  checkBtn.onclick = checkDivision;
  aZone.appendChild(checkBtn);
}

// Variables para drag & drop
let draggedShell = null;
let touchStartEl = null;
let touchTargetBucket = null;

function onShellDragStart(e) {
  draggedShell = e.target;
  draggedShell.classList.add('dragging');
}

function onShellTouchStart(e) {
  touchStartEl = e.target;
}

function onShellTouchEnd(e, bucketIdx) {
  if (touchStartEl && touchStartEl.classList.contains('shell-item')) {
    placeShellInBucket(touchStartEl, bucketIdx);
    touchStartEl = null;
  }
}

function onShellDrop(e, bucketIdx) {
  e.preventDefault();
  const bucket = document.getElementById(`bucket-${bucketIdx}`);
  if (bucket) bucket.classList.remove('over');

  if (draggedShell) {
    placeShellInBucket(draggedShell, bucketIdx);
    draggedShell.classList.remove('dragging');
    draggedShell = null;
  }
}

/** Colocar un item en un cubo */
function placeShellInBucket(shellEl, bucketIdx) {
  // Remover del pool
  shellEl.remove();

  // Agregar al cubo visualmente
  const bucketShells = document.getElementById(`bucket-shells-${bucketIdx}`);
  const miniShell = document.createElement('span');
  miniShell.textContent = divisionState.itemEmoji;
  miniShell.style.fontSize = '1rem';
  bucketShells.appendChild(miniShell);

  // Actualizar contador
  divisionState.buckets[bucketIdx]++;
  document.getElementById(`bucket-count-${bucketIdx}`).textContent = divisionState.buckets[bucketIdx];
}

/** Verificar si la división es correcta */
function checkDivision() {
  const { buckets, correctPerGroup, groups, question } = divisionState;

  // Verificar que todos los items fueron repartidos
  const poolRemaining = document.querySelectorAll('#shells-pool .shell-item').length;
  if (poolRemaining > 0) {
    speakTomy('¡Todavía quedan ' + poolRemaining + ' ' + divisionState.itemEmoji + ' sin repartir! ¡Continúa! 💪');
    return;
  }

  // Verificar que cada cubo tiene la cantidad correcta
  const allCorrect = buckets.every(count => count === correctPerGroup);

  if (allCorrect) {
    handleAnswer(true, null);
  } else {
    speakTomy('¡Casi! Asegúrate de que cada animal reciba la misma cantidad. ¡Tú puedes! 🐢');
    // Resaltar los cubos incorrectos
    buckets.forEach((count, idx) => {
      const bucket = document.getElementById(`bucket-${idx}`);
      if (bucket && count !== correctPerGroup) {
        bucket.style.borderColor = '#ff6b6b';
        setTimeout(() => { if (bucket) bucket.style.borderColor = ''; }, 1500);
      }
    });
  }
}

// ================================================
// 10. SISTEMA DE PREGUNTAS: FRACCIONES (Mundo 3)
// ================================================

/**
 * Renderizar una pregunta de fracción
 * @param {object} q - Objeto de pregunta
 * @param {HTMLElement} qZone - Zona de la pregunta
 * @param {HTMLElement} aZone - Zona de respuestas
 */
function renderFraction(q, qZone, aZone) {
  // Título
  const title = document.createElement('div');
  title.className = 'question-text';
  title.textContent = q.question;
  qZone.appendChild(title);

  // Figura visual SVG
  const svgWrap = document.createElement('div');
  svgWrap.style.margin = '0.8rem auto';
  svgWrap.innerHTML = createFractionSVG(q.shape, q.filled, q.total, q.color);
  qZone.appendChild(svgWrap);

  // Texto descriptivo de la fracción
  const fractionHint = document.createElement('p');
  fractionHint.style.cssText = 'font-size:0.9rem;color:rgba(255,255,255,0.7);font-weight:600;margin-top:0.3rem;';
  fractionHint.textContent = `Figura dividida en ${q.total} partes iguales. ${q.filled} parte(s) pintada(s).`;
  qZone.appendChild(fractionHint);

  // Botones de respuesta con fracciones
  const shuffledOptions = shuffleArray([...q.options]);
  shuffledOptions.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.innerHTML = formatFraction(opt);
    btn.style.minWidth = '90px';
    btn.setAttribute('id', `frac-${opt.replace('/', '-')}`);
    btn.onclick = function() {
      handleAnswer(opt === q.answer, btn);
    };
    aZone.appendChild(btn);
  });
}

/**
 * Crear SVG visual para una fracción
 * @param {string} shape - 'circle', 'square', 'triangle'
 * @param {number} filled - Partes coloreadas
 * @param {number} total - Total de partes
 * @param {string} color - Color de relleno
 * @returns {string} HTML del SVG
 */
function createFractionSVG(shape, filled, total, color) {
  const size = 130;
  const cx = size / 2;
  const cy = size / 2;
  const r = 55;
  let svgContent = '';

  if (shape === 'circle') {
    // Círculo dividido en sectores
    for (let i = 0; i < total; i++) {
      const startAngle = (i / total) * 2 * Math.PI - Math.PI / 2;
      const endAngle = ((i + 1) / total) * 2 * Math.PI - Math.PI / 2;
      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);
      const largeArc = (1 / total) > 0.5 ? 1 : 0;
      const fillClr = i < filled ? color : 'rgba(255,255,255,0.1)';
      svgContent += `
        <path d="M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 ${largeArc},1 ${x2},${y2} Z"
              fill="${fillClr}" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>`;
    }
  } else if (shape === 'square') {
    // Cuadrado dividido en columnas
    const sW = 100;
    const sH = 90;
    const sX = (size - sW) / 2;
    const sY = (size - sH) / 2;
    const partW = sW / total;
    for (let i = 0; i < total; i++) {
      const fillClr = i < filled ? color : 'rgba(255,255,255,0.1)';
      svgContent += `
        <rect x="${sX + i * partW}" y="${sY}" width="${partW}" height="${sH}"
              fill="${fillClr}" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" rx="2"/>`;
    }
  } else if (shape === 'triangle') {
    // Triángulo partido por la mitad
    const pts = `${cx},${cy - 55} ${cx - 55},${cy + 40} ${cx + 55},${cy + 40}`;
    if (total === 2) {
      // Izquierda (relleno) y derecha
      svgContent += `
        <polygon points="${cx},${cy - 55} ${cx - 55},${cy + 40} ${cx},${cy + 40}"
                 fill="${filled >= 1 ? color : 'rgba(255,255,255,0.1)'}" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
        <polygon points="${cx},${cy - 55} ${cx},${cy + 40} ${cx + 55},${cy + 40}"
                 fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>`;
    } else {
      svgContent += `<polygon points="${pts}" fill="${color}" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>`;
    }
  }

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" 
               style="filter:drop-shadow(0 0 12px ${color}88);">
    ${svgContent}
  </svg>`;
}

/**
 * Formatear una fracción como HTML
 * @param {string} frac - Fracción en formato "1/2"
 * @returns {string} HTML de la fracción
 */
function formatFraction(frac) {
  const parts = frac.split('/');
  if (parts.length === 2) {
    return `<span style="display:flex;flex-direction:column;align-items:center;line-height:1.1;">
      <span>${parts[0]}</span>
      <span style="width:100%;height:2px;background:white;border-radius:2px;margin:2px 0;"></span>
      <span>${parts[1]}</span>
    </span>`;
  }
  return frac;
}

// ================================================
// 11. SISTEMA DE PREGUNTAS: MIXTO (Mundo 4)
// (usa los renderizadores de los mundos 1, 2 y 3)
// ================================================
// Ya implementado: renderMultiplication, renderDivision, renderFraction
// Los tipos se seleccionan dinámicamente en loadQuestion()

// ================================================
// 12. SISTEMA DE RECOMPENSAS
// ================================================

/** Hacer que Tomy celebre visualmente */
function celebrateTomy() {
  const tomy = document.getElementById('tomy-game-char');
  if (!tomy) return;
  tomy.classList.remove('celebrate');
  void tomy.offsetWidth; // Forzar reflow para reiniciar animación
  tomy.classList.add('celebrate');
  setTimeout(() => tomy.classList.remove('celebrate'), 1000);
}

/**
 * Hacer que Tomy diga algo en su burbuja
 * @param {string} message - Mensaje a mostrar
 */
function speakTomy(message) {
  const bubble = document.getElementById('tomy-speech');
  if (!bubble) return;
  bubble.style.opacity = '0';
  bubble.style.transform = 'scale(0.8)';
  setTimeout(() => {
    bubble.textContent = message;
    bubble.style.opacity = '1';
    bubble.style.transform = 'scale(1)';
    bubble.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
  }, 200);
}

// ================================================
// 13. COLECCIÓN DE ANIMALES
// ================================================

/** Renderizar la colección de animales */
function renderCollection() {
  const p = Progress.get();
  const grid = document.getElementById('collection-grid');
  if (!grid) return;
  grid.innerHTML = '';

  Object.entries(ANIMALS_DATA).forEach(([key, animal]) => {
    const isUnlocked = p.unlockedAnimals.includes(key);

    const card = document.createElement('div');
    card.className = `animal-card ${isUnlocked ? 'unlocked' : 'locked-card'}`;
    card.id = `animal-${key}`;

    card.innerHTML = `
      <span class="animal-emoji">${animal.emoji}</span>
      <div class="animal-name">${animal.name}</div>
      <div class="animal-desc">${isUnlocked ? animal.description : animal.unlockCondition}</div>
      ${!isUnlocked ? '<div class="animal-locked-badge">🔒 Bloqueado</div>' : ''}
    `;

    grid.appendChild(card);
  });
}

// ================================================
// 14. PANTALLA DE PROGRESO Y LOGROS
// ================================================

/** Renderizar la pantalla de progreso completa */
function renderProgress() {
  const p = Progress.get();

  // Estadísticas generales
  setTextContent('prog-pearls', p.totalPearls);
  setTextContent('prog-stars', p.totalStars);
  setTextContent('prog-medals', p.totalMedals);
  setTextContent('prog-correct', p.totalCorrect);

  // Lista de progreso por mundo
  const worldList = document.getElementById('world-progress-list');
  if (worldList) {
    worldList.innerHTML = '';
    WORLDS_DATA.forEach(world => {
      const stars = p.worldStars[world.id] || 0;
      const percent = p.worldProgress[world.id] || 0;
      const isCompleted = p.worldsCompleted.includes(world.id);

      const item = document.createElement('div');
      item.className = 'world-progress-item';
      item.innerHTML = `
        <div class="wpi-icon">${world.emoji}</div>
        <div class="wpi-info">
          <div class="wpi-name">${world.name}</div>
          <div class="wpi-stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
        </div>
        <div class="wpi-bar-wrap">
          <div class="wpi-bar" style="width:${percent}%"></div>
        </div>
        <span style="font-size:0.85rem;font-weight:700;color:${isCompleted ? 'var(--gold)' : 'rgba(255,255,255,0.5)'}">
          ${isCompleted ? '✅' : '⏳'}
        </span>
      `;
      worldList.appendChild(item);
    });
  }

  // Logros
  const achGrid = document.getElementById('achievements-grid');
  if (achGrid) {
    achGrid.innerHTML = '';
    ACHIEVEMENTS_DATA.forEach(ach => {
      const earned = p.earnedAchievements.includes(ach.id);
      const badge = document.createElement('div');
      badge.className = `achievement-badge ${earned ? 'earned' : 'locked-achievement'}`;
      badge.id = `ach-${ach.id}`;
      badge.innerHTML = `
        <div class="achievement-icon">${earned ? ach.icon : '🔒'}</div>
        <div class="achievement-name">${earned ? ach.name : '???'}</div>
      `;
      badge.setAttribute('title', earned ? ach.desc : 'Logro bloqueado');
      achGrid.appendChild(badge);
    });
  }
}

/** Mostrar la pantalla de estadísticas finales */
function showFinalScreen() {
  const p = Progress.get();
  setTextContent('final-pearls', p.totalPearls);
  setTextContent('final-stars', p.totalStars);
  setTextContent('final-medals', p.totalMedals);
  setTextContent('final-animals', p.unlockedAnimals.length);
  showScreen('screen-final');
  launchConfetti(100);
}

// ================================================
// 15. EFECTOS VISUALES Y CELEBRACIONES
// ================================================

/**
 * Lanzar confetti
 * @param {number} count - Número de piezas de confetti
 */
function launchConfetti(count = 40) {
  const container = document.getElementById('confetti-container');
  if (!container) return;

  const colors = ['#ff6b6b', '#ffd700', '#00d4aa', '#9b59b6', '#ff8c00', '#00bfff', '#ff69b4'];

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.width = `${Math.random() * 12 + 6}px`;
      piece.style.height = `${Math.random() * 12 + 6}px`;
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      piece.style.setProperty('--drift', `${(Math.random() - 0.5) * 200}px`);
      const dur = Math.random() * 2 + 2;
      piece.style.animationDuration = `${dur}s`;
      piece.style.animationDelay = `${Math.random() * 0.5}s`;
      container.appendChild(piece);

      setTimeout(() => piece.remove(), (dur + 0.5) * 1000);
    }, i * 30);
  }
}

/**
 * Mostrar un sparkle/partícula especial en una posición
 * @param {string} emoji - Emoji a mostrar
 * @param {number} x - Posición X
 * @param {number} y - Posición Y
 */
function showSparkle(emoji, x, y) {
  const el = document.createElement('div');
  el.className = 'sparkle';
  el.textContent = emoji;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

// ================================================
// MODALES Y DIÁLOGOS
// ================================================

function confirmReset() {
  document.getElementById('modal-confirm').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal-confirm').classList.add('hidden');
}

function resetProgress() {
  Progress.reset();
  closeModal();
  showScreen('screen-home');
  updateHomeStats();
}

// ================================================
// FUNCIONES UTILITARIAS
// ================================================

/**
 * Mezclar un arreglo (Fisher-Yates)
 * @param {Array} arr - Arreglo a mezclar
 * @returns {Array} Arreglo mezclado
 */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Obtener un elemento aleatorio de un arreglo
 * @param {Array} arr - Arreglo de origen
 * @returns {*} Elemento aleatorio
 */
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Establecer el contenido de texto de un elemento por ID
 * @param {string} id - ID del elemento
 * @param {string|number} text - Texto a establecer
 */
function setTextContent(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// ================================================
// 16. INICIALIZACIÓN DEL JUEGO
// ================================================

/** Inicializar el juego cuando el DOM esté listo */
document.addEventListener('DOMContentLoaded', () => {
  // Cargar progreso guardado
  Progress.load();

  // Verificar desbloqueos de animales (por si el progreso ya los tiene)
  const p = Progress.get();
  // Sincronizar estado de animales desbloqueados
  Object.keys(ANIMALS_DATA).forEach(key => {
    if (p.unlockedAnimals.includes(key)) {
      ANIMALS_DATA[key].unlocked = true;
    }
  });

  // Mostrar pantalla inicial
  showScreen('screen-home');
  updateHomeStats();

  // Animar la tortuga de la pantalla inicial con delays
  const tomy = document.getElementById('tomy-idle');
  if (tomy) {
    setTimeout(() => {
      tomy.style.transition = 'transform 0.5s ease';
    }, 500);
  }

  // Si el juego ya fue completado antes, actualizar el mapa
  if (p.worldsCompleted.length > 0) {
    updateWorldMap();
  }

  console.log('🐢 Tomy la Tortuga y las Perlas Mágicas - ¡Juego iniciado!');
  console.log('📊 Progreso cargado:', p);
});

// Cerrar modal al hacer clic fuera
document.getElementById('modal-confirm').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
