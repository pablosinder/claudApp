// 50 palabras hebreas simples (2-5 letras) para principiantes, agrupadas por categoría.
// missingIndex: posición (0 = primera letra) de la letra que el jugador debe dibujar.
// Se eligió, para cada palabra, la letra "menos familiar" según el currículo de letters.js,
// de modo que cada palabra refuerce la letra más nueva que contiene.
const WORDS = [
  // חיות - animales
  { id: 'dog', word: 'כלב', emoji: '🐶', category: 'animals', missingIndex: 0 },
  { id: 'cat', word: 'חתול', emoji: '🐱', category: 'animals', missingIndex: 1 },
  { id: 'fish', word: 'דג', emoji: '🐟', category: 'animals', missingIndex: 1 },
  { id: 'cow', word: 'פרה', emoji: '🐄', category: 'animals', missingIndex: 2 },
  { id: 'horse', word: 'סוס', emoji: '🐴', category: 'animals', missingIndex: 0 },
  { id: 'bear', word: 'דוב', emoji: '🐻', category: 'animals', missingIndex: 2 },
  { id: 'lion', word: 'אריה', emoji: '🦁', category: 'animals', missingIndex: 3 },
  { id: 'tiger', word: 'נמר', emoji: '🐯', category: 'animals', missingIndex: 1 },
  { id: 'mouse', word: 'עכבר', emoji: '🐭', category: 'animals', missingIndex: 0 },
  { id: 'owl', word: 'ינשוף', emoji: '🦉', category: 'animals', missingIndex: 2 },
  { id: 'snake', word: 'נחש', emoji: '🐍', category: 'animals', missingIndex: 2 },
  { id: 'turtle', word: 'צב', emoji: '🐢', category: 'animals', missingIndex: 0 },
  { id: 'elephant', word: 'פיל', emoji: '🐘', category: 'animals', missingIndex: 0 },
  { id: 'monkey', word: 'קוף', emoji: '🐵', category: 'animals', missingIndex: 0 },
  { id: 'wolf', word: 'זאב', emoji: '🐺', category: 'animals', missingIndex: 0 },

  // צבעים - colores
  { id: 'red', word: 'אדום', emoji: '🔴', category: 'colors', missingIndex: 0 },
  { id: 'blue', word: 'כחול', emoji: '🔵', category: 'colors', missingIndex: 1 },
  { id: 'green', word: 'ירוק', emoji: '🟢', category: 'colors', missingIndex: 3 },
  { id: 'yellow', word: 'צהוב', emoji: '🟡', category: 'colors', missingIndex: 1 },
  { id: 'black', word: 'שחור', emoji: '⚫', category: 'colors', missingIndex: 0 },
  { id: 'white', word: 'לבן', emoji: '⚪', category: 'colors', missingIndex: 2 },
  { id: 'orange', word: 'כתום', emoji: '🟠', category: 'colors', missingIndex: 1 },
  { id: 'purple', word: 'סגול', emoji: '🟣', category: 'colors', missingIndex: 1 },
  { id: 'pink', word: 'ורוד', emoji: '🩷', category: 'colors', missingIndex: 1 },

  // מספרים - números
  { id: 'one', word: 'אחד', emoji: '1️⃣', category: 'numbers', missingIndex: 0 },
  { id: 'two', word: 'שתיים', emoji: '2️⃣', category: 'numbers', missingIndex: 1 },
  { id: 'three', word: 'שלוש', emoji: '3️⃣', category: 'numbers', missingIndex: 0 },
  { id: 'four', word: 'ארבע', emoji: '4️⃣', category: 'numbers', missingIndex: 0 },
  { id: 'five', word: 'חמש', emoji: '5️⃣', category: 'numbers', missingIndex: 2 },
  { id: 'six', word: 'שש', emoji: '6️⃣', category: 'numbers', missingIndex: 0 },
  { id: 'seven', word: 'שבע', emoji: '7️⃣', category: 'numbers', missingIndex: 0 },
  { id: 'eight', word: 'שמונה', emoji: '8️⃣', category: 'numbers', missingIndex: 4 },
  { id: 'nine', word: 'תשע', emoji: '9️⃣', category: 'numbers', missingIndex: 0 },
  { id: 'ten', word: 'עשר', emoji: '🔟', category: 'numbers', missingIndex: 1 },

  // משפחה - familia
  { id: 'mom', word: 'אמא', emoji: '👩', category: 'family', missingIndex: 0 },
  { id: 'dad', word: 'אבא', emoji: '👨', category: 'family', missingIndex: 0 },
  { id: 'grandpa', word: 'סבא', emoji: '👴', category: 'family', missingIndex: 2 },
  { id: 'grandma', word: 'סבתא', emoji: '👵', category: 'family', missingIndex: 3 },
  { id: 'brother', word: 'אח', emoji: '👦', category: 'family', missingIndex: 0 },
  { id: 'sister', word: 'אחות', emoji: '👧', category: 'family', missingIndex: 0 },
  { id: 'son', word: 'בן', emoji: '👶', category: 'family', missingIndex: 1 },
  { id: 'daughter', word: 'בת', emoji: '👧', category: 'family', missingIndex: 1 },
  { id: 'uncle', word: 'דוד', emoji: '🧑', category: 'family', missingIndex: 0 },
  { id: 'aunt', word: 'דודה', emoji: '👩‍🦱', category: 'family', missingIndex: 3 },

  // חפצים - objetos cotidianos
  { id: 'house', word: 'בית', emoji: '🏠', category: 'objects', missingIndex: 1 },
  { id: 'book', word: 'ספר', emoji: '📖', category: 'objects', missingIndex: 1 },
  { id: 'ball', word: 'כדור', emoji: '⚽', category: 'objects', missingIndex: 0 },
  { id: 'cup', word: 'כוס', emoji: '🥤', category: 'objects', missingIndex: 2 },
  { id: 'pen', word: 'עט', emoji: '✏️', category: 'objects', missingIndex: 0 },
  { id: 'door', word: 'דלת', emoji: '🚪', category: 'objects', missingIndex: 2 },
];

export const CATEGORIES = [
  { id: 'animals', label: 'חיות', emoji: '🐾' },
  { id: 'colors', label: 'צבעים', emoji: '🎨' },
  { id: 'numbers', label: 'מספרים', emoji: '🔢' },
  { id: 'family', label: 'משפחה', emoji: '👪' },
  { id: 'objects', label: 'חפצים', emoji: '🧸' },
];

export default WORDS;
