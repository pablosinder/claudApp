import { useEffect } from 'react';
import Mascot from '../components/Mascot';
import { playLevelUpSound } from '../utils/sounds';
import './LevelCompleteScreen.css';

export default function LevelCompleteScreen({ level, score, onContinue }) {
  useEffect(() => {
    playLevelUpSound();
  }, []);

  return (
    <div className="level-complete-screen">
      <Mascot mood="excited" size={100} />
      <h2 className="level-complete-title">שלב {level} הושלם! 🎊</h2>
      <p className="level-complete-subtitle">פתחת אות חדשה ללמידה!</p>
      <div className="level-complete-score">⭐ {score} נקודות</div>
      <button className="big-button big-button-primary" onClick={onContinue}>
        המשך משחק ➡️
      </button>
    </div>
  );
}
