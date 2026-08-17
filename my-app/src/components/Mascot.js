import './Mascot.css';

// Mascota amigable (búho) que reacciona al estado del juego.
export default function Mascot({ mood = 'happy', size = 72 }) {
  const faces = {
    happy: '🦉',
    excited: '🦉',
    thinking: '🦉',
  };
  return (
    <div className={`mascot mascot-${mood}`} style={{ fontSize: size }} aria-hidden="true">
      {faces[mood] || faces.happy}
    </div>
  );
}
