// Currículo de letras hebreas: orden pensado para principiantes de 4-6 años,
// de trazos más simples (líneas rectas) a más complejos (formas compuestas).
const LETTERS = [
  { char: 'ו', name: 'וו', order: 1 },
  { char: 'י', name: 'יוד', order: 2 },
  { char: 'ל', name: 'למד', order: 3 },
  { char: 'ד', name: 'דלת', order: 4 },
  { char: 'ר', name: 'ריש', order: 5 },
  { char: 'ב', name: 'בית', order: 6 },
  { char: 'כ', name: 'כף', order: 7 },
  { char: 'ן', name: 'נון סופית', order: 8 },
  { char: 'ם', name: 'מם סופית', order: 9 },
  { char: 'ט', name: 'טית', order: 10 },
  { char: 'ח', name: 'חית', order: 11 },
  { char: 'ס', name: 'סמך', order: 12 },
  { char: 'ע', name: 'עין', order: 13 },
  { char: 'פ', name: 'פא', order: 14 },
  { char: 'ף', name: 'פא סופית', order: 15 },
  { char: 'נ', name: 'נון', order: 16 },
  { char: 'מ', name: 'מם', order: 17 },
  { char: 'ק', name: 'קוף', order: 18 },
  { char: 'צ', name: 'צדי', order: 19 },
  { char: 'ץ', name: 'צדי סופית', order: 20 },
  { char: 'ש', name: 'שין', order: 21 },
  { char: 'ת', name: 'תיו', order: 22 },
  { char: 'א', name: 'אלף', order: 23 },
  { char: 'ג', name: 'גימל', order: 24 },
  { char: 'ז', name: 'זין', order: 25 },
  { char: 'ה', name: 'הא', order: 26 },
  { char: 'ך', name: 'כף סופית', order: 27 },
];

export const LETTER_ORDER = LETTERS.reduce((acc, l) => {
  acc[l.char] = l.order;
  return acc;
}, {});

export default LETTERS;
