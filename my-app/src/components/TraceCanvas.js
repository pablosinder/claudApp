import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import './TraceCanvas.css';

// Área de dibujo táctil. Acumula los puntos de uno o varios trazos (el niño puede
// levantar el dedo, p. ej. para letras con más de un trazo) hasta que el componente
// padre decide evaluarlos (botón "בדוק"). Expone clear()/getPoints() vía ref.
//
// El tamaño es el mayor cuadrado que cabe en el espacio que le da su contenedor
// (ancho Y alto), medido con ResizeObserver, en vez de un tamaño fijo en CSS. Así la
// pantalla de juego nunca necesita scroll: si el contenedor flexible que lo envuelve
// se queda con poco alto (pantallas bajas), el canvas simplemente se achica.
const MIN_SIZE = 70;
const MAX_SIZE = 170;

const TraceCanvas = forwardRef(function TraceCanvas({ targetChar, hintLevel = 0, showGuide = false }, ref) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const pointsRef = useRef([]);
  const drawingRef = useRef(false);
  const [hasInk, setHasInk] = useState(false);
  const [size, setSize] = useState(240);

  const getCanvasContext = () => canvasRef.current.getContext('2d');

  const resizeCanvasBitmap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    const ctx = getCanvasContext();
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // Trazo grueso para que sea fácil de ver y controlar con el dedo, pero acotado
    // para que quepa dentro del propio tamaño del canvas sin desbordar la forma de
    // la letra guía (si es demasiado grueso, el trazo se ve como un borrón).
    ctx.lineWidth = Math.min(20, Math.max(10, Math.round(rect.width * 0.08)));
    ctx.strokeStyle = '#5b3ee0';
  };

  useEffect(() => {
    const parent = wrapperRef.current?.parentElement;
    if (!parent) return undefined;

    const measure = () => {
      const rect = parent.getBoundingClientRect();
      const next = Math.floor(Math.min(rect.width, rect.height));
      setSize(Math.max(MIN_SIZE, Math.min(MAX_SIZE, next)));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(parent);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    resizeCanvasBitmap();
    pointsRef.current = [];
    setHasInk(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = getCanvasContext();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pointsRef.current = [];
    setHasInk(false);
  };

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetChar]);

  useImperativeHandle(ref, () => ({
    clear,
    getPoints: () => pointsRef.current,
    hasInk: () => pointsRef.current.length > 0,
  }));

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    canvasRef.current.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    const pos = getPos(e);
    pointsRef.current.push(pos);
    const ctx = getCanvasContext();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setHasInk(true);
  };

  const handlePointerMove = (e) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const pos = getPos(e);
    pointsRef.current.push(pos);
    const ctx = getCanvasContext();
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const handlePointerUp = (e) => {
    drawingRef.current = false;
    try {
      canvasRef.current.releasePointerCapture(e.pointerId);
    } catch {
      // el pointer puede ya no estar capturado, ignorar
    }
  };

  // La forma de la letra solo se ve si el jugador pidió ayuda a propósito (botón
  // 💡); no se muestra "gratis" por defecto. Una vez pedida, más intentos fallidos
  // la hacen algo más visible, igual que antes.
  const guideOpacity = !showGuide ? 0 : hintLevel === 0 ? 0.3 : hintLevel === 1 ? 0.4 : 0.55;

  return (
    <div
      ref={wrapperRef}
      className="trace-canvas-wrapper"
      style={{ width: size, height: size, '--canvas-size': `${size}px` }}
    >
      {showGuide && (
        <div className="trace-canvas-guide" style={{ opacity: guideOpacity }}>
          {targetChar}
        </div>
      )}
      {hintLevel >= 2 && <div className="trace-canvas-pointer-hint">👆</div>}
      <canvas
        ref={canvasRef}
        className="trace-canvas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
      {!hasInk && <div className="trace-canvas-empty-label">גע וצייר כאן ✍️</div>}
    </div>
  );
});

export default TraceCanvas;
