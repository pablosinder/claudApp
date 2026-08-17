import './WordCard.css';

// Muestra la palabra con un hueco en la posición de la letra que falta. `children`
// (el TraceCanvas) se dibuja exactamente en ese hueco, para que el niño escriba la
// letra en el lugar donde falta dentro de la palabra misma, no en un panel aparte.
export default function WordCard({ word, missingIndex, children }) {
  const letters = word.split('');
  return (
    <div className="word-card-letters" dir="rtl">
      {letters.map((letter, i) =>
        i === missingIndex ? (
          <span key={i} className="word-card-blank-slot">
            {children}
          </span>
        ) : (
          <span key={i} className="word-card-letter">
            {letter}
          </span>
        )
      )}
    </div>
  );
}
