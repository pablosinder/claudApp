import Mascot from '../components/Mascot';
import './HomeScreen.css';

export default function HomeScreen({ onStart }) {
  return (
    <div className="home-screen">
      <Mascot mood="happy" size={110} />
      <h1 className="home-title">לומדים לכתוב עברית</h1>
      <p className="home-subtitle">צייר את האות החסרה עם האצבע! ✍️</p>
      <button className="big-button big-button-primary" onClick={onStart}>
        🎮 בואו נשחק!
      </button>
    </div>
  );
}
