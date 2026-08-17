import './ScoreBar.css';

export default function ScoreBar({ score, streak, level }) {
  return (
    <div className="score-bar">
      <div className="score-pill score-pill-points">
        <span>⭐</span>
        <span>{score}</span>
      </div>
      <div className="score-pill score-pill-level">
        <span>🏆</span>
        <span>שלב {level}</span>
      </div>
      {streak >= 2 && (
        <div className="score-pill score-pill-streak">
          <span>🔥</span>
          <span>{streak}</span>
        </div>
      )}
    </div>
  );
}
