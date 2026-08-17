import { CATEGORIES } from '../data/words';
import './CategoryScreen.css';

export default function CategoryScreen({ onSelect, onBack }) {
  return (
    <div className="category-screen">
      <button className="icon-button back-button" onClick={onBack} aria-label="חזרה">
        ↩️
      </button>
      <h2 className="category-title">בחרו קטגוריה</h2>
      <div className="category-grid">
        <button className="category-tile category-tile-all" onClick={() => onSelect('all')}>
          <span className="category-emoji">🌈</span>
          <span>הכל</span>
        </button>
        {CATEGORIES.map((cat) => (
          <button key={cat.id} className="category-tile" onClick={() => onSelect(cat.id)}>
            <span className="category-emoji">{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
