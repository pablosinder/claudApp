import { useCallback, useEffect, useState } from 'react';
import LETTERS from '../data/letters';

const STORAGE_KEY = 'hebrew-writing-game-progress';
const WORDS_PER_LEVEL = 4; // cuántas palabras correctas para subir de nivel / desbloquear letra

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // localStorage no disponible (modo privado, etc.) - seguimos con progreso en memoria
  }
  return { score: 0, streak: 0, level: 1, completedWordIds: [] };
}

export default function useGameProgress() {
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignorar si no se puede persistir
    }
  }, [progress]);

  const unlockedLetterCount = Math.min(
    LETTERS.length,
    2 + (progress.level - 1) * 2
  );
  const unlockedLetters = LETTERS.filter((l) => l.order <= unlockedLetterCount).map((l) => l.char);

  const registerCorrectAnswer = useCallback((wordId) => {
    setProgress((prev) => {
      const alreadyDone = prev.completedWordIds.includes(wordId);
      const newStreak = prev.streak + 1;
      const bonus = newStreak > 0 && newStreak % 3 === 0 ? 15 : 0;
      const newScore = prev.score + 10 + bonus;
      const newCompleted = alreadyDone
        ? prev.completedWordIds
        : [...prev.completedWordIds, wordId];
      const shouldLevelUp = newCompleted.length > 0 && newCompleted.length % WORDS_PER_LEVEL === 0 && !alreadyDone;

      return {
        ...prev,
        score: newScore,
        streak: newStreak,
        completedWordIds: newCompleted,
        level: shouldLevelUp ? prev.level + 1 : prev.level,
      };
    });
  }, []);

  const registerMiss = useCallback(() => {
    setProgress((prev) => ({ ...prev, streak: 0 }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({ score: 0, streak: 0, level: 1, completedWordIds: [] });
  }, []);

  return {
    progress,
    unlockedLetters,
    registerCorrectAnswer,
    registerMiss,
    resetProgress,
    wordsPerLevel: WORDS_PER_LEVEL,
  };
}
