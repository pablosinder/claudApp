// Envoltorio sobre SpeechSynthesis para pronunciar letras y palabras en hebreo.
// Mejora progresiva: si el navegador no soporta voz en hebreo, simplemente no habla
// (el juego sigue funcionando con feedback visual y sonidos).
let cachedVoice = null;
let voicesLoaded = false;

function loadVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) voicesLoaded = true;
  return voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('he')) || null;
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  cachedVoice = loadVoice();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = loadVoice();
  };
}

export function isSpeechSupported() {
  return typeof window !== 'undefined' && !!window.speechSynthesis;
}

export function speak(text, { rate = 0.85 } = {}) {
  if (!isSpeechSupported() || !text) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'he-IL';
  utterance.rate = rate;
  if (cachedVoice) utterance.voice = cachedVoice;
  window.speechSynthesis.speak(utterance);
}

export function speakLetter(char) {
  speak(char, { rate: 0.7 });
}

export function speakWord(word) {
  speak(word, { rate: 0.8 });
}

export function voicesReady() {
  return voicesLoaded;
}
