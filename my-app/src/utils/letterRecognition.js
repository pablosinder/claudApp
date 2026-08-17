// Reconocedor de trazos para letras hebreas basado en comparación de formas en una
// rejilla (bitmap matching): en vez de mantener plantillas dibujadas a mano para cada
// letra, renderizamos el carácter real con la tipografía hebrea del navegador y lo
// reducimos a una rejilla booleana normalizada por su propio bounding box; el trazo
// del jugador se reduce a una rejilla igual y se comparan por índice de Jaccard
// (intersección / unión). Cubre las 22 letras + formas finales automáticamente y con
// tipografía correcta, sin requerir orden ni dirección de trazo.
//
// Se probaron dos alternativas que resultaron peores: (1) nubes de puntos por vecino
// más cercano y (2) comparar la trayectoria punto-a-punto en orden — ambas dependían
// de "enderezar" los píxeles de la letra en un camino artificial (vecino más cercano)
// que zigzaguea de forma inestable dentro del propio grosor del trazo, dando falsos
// rechazos impredecibles en varias letras. La rejilla no depende de ningún orden ni
// camino artificial, así que es mucho más estable.

const RENDER_SIZE = 120; // lienzo oculto usado para "rasterizar" la letra
const GRID_SIZE = 22; // resolución de la rejilla de comparación
const DILATE_RADIUS = 2; // tolerancia posicional (celdas vecinas cuentan como "tinta")
const ALPHA_THRESHOLD = 100; // umbral de opacidad para considerar un píxel "tinta"

const targetGridCache = new Map();

function boundingBox(points) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, maxX, minY, maxY };
}

// Inserta puntos intermedios para que no queden huecos entre muestras consecutivas
// (los eventos pointermove pueden llegar espaciados a más de una celda de distancia).
function densify(points, maxStep) {
  if (points.length < 2) return points;
  const out = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const dist = Math.hypot(b.x - a.x, b.y - a.y);
    const steps = Math.ceil(dist / maxStep);
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
  }
  return out;
}

// Vuelca puntos ya densos (sin huecos) en una rejilla booleana GRID_SIZE x GRID_SIZE,
// normalizada por el propio bounding box de los puntos (preserva proporción).
function mapToGrid(points) {
  const { minX, maxX, minY, maxY } = boundingBox(points);
  const width = maxX - minX || 1;
  const height = maxY - minY || 1;
  const scale = Math.max(width, height) || 1;
  const cx = minX + width / 2;
  const cy = minY + height / 2;

  const grid = new Uint8Array(GRID_SIZE * GRID_SIZE);
  for (const p of points) {
    const nx = (p.x - cx) / scale + 0.5;
    const ny = (p.y - cy) / scale + 0.5;
    const gx = Math.min(GRID_SIZE - 1, Math.max(0, Math.floor(nx * GRID_SIZE)));
    const gy = Math.min(GRID_SIZE - 1, Math.max(0, Math.floor(ny * GRID_SIZE)));
    grid[gy * GRID_SIZE + gx] = 1;
  }
  return dilate(grid);
}

// Puntos del trazo del jugador: llegan en orden (un pointermove cada pocos ms), pero
// pueden quedar espaciados a más de una celda de distancia, así que se rellenan los
// huecos ANTES de mapear a la rejilla. Nunca usar densify() sobre el volcado de
// píxeles de la letra objetivo: ese conjunto no es un trazo conectado sino un barrido
// de imagen en orden de fila/columna, y "conectar los puntos consecutivos" dibujaría
// líneas falsas entre zonas del glifo que no están relacionadas, rellenando huecos
// internos que deben quedar vacíos (p. ej. el interior de ם, ס, ע).
function pointsToGrid(points) {
  const { minX, maxX, minY, maxY } = boundingBox(points);
  const scale = Math.max(maxX - minX, maxY - minY) || 1;
  const dense = densify(points, scale / (GRID_SIZE * 1.5));
  return mapToGrid(dense);
}

function dilate(grid) {
  if (DILATE_RADIUS <= 0) return grid;
  const out = new Uint8Array(grid.length);
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (!grid[y * GRID_SIZE + x]) continue;
      for (let dy = -DILATE_RADIUS; dy <= DILATE_RADIUS; dy++) {
        for (let dx = -DILATE_RADIUS; dx <= DILATE_RADIUS; dx++) {
          const ny = y + dy;
          const nx = x + dx;
          if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
            out[ny * GRID_SIZE + nx] = 1;
          }
        }
      }
    }
  }
  return out;
}

function jaccard(gridA, gridB) {
  let intersection = 0;
  let union = 0;
  for (let i = 0; i < gridA.length; i++) {
    const a = gridA[i];
    const b = gridB[i];
    if (a || b) union++;
    if (a && b) intersection++;
  }
  return union === 0 ? 0 : intersection / union;
}

// Renderiza el carácter con el contorno de su trazo (más parecido a un trazo real de
// dedo que un relleno sólido, que resulta demasiado "blob" y poco discriminante) y
// devuelve su rejilla normalizada. Se cachea por carácter.
function getTargetGrid(char) {
  if (targetGridCache.has(char)) return targetGridCache.get(char);

  const canvas = document.createElement('canvas');
  canvas.width = RENDER_SIZE;
  canvas.height = RENDER_SIZE;
  const ctx = canvas.getContext('2d');
  ctx.font = `${RENDER_SIZE * 0.75}px "Arial Hebrew", "Noto Sans Hebrew", Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = RENDER_SIZE * 0.025;
  ctx.strokeStyle = '#000';
  ctx.strokeText(char, RENDER_SIZE / 2, RENDER_SIZE / 2 + RENDER_SIZE * 0.05);

  const { data } = ctx.getImageData(0, 0, RENDER_SIZE, RENDER_SIZE);
  const inkPoints = [];
  for (let y = 0; y < RENDER_SIZE; y++) {
    for (let x = 0; x < RENDER_SIZE; x++) {
      if (data[(y * RENDER_SIZE + x) * 4 + 3] > ALPHA_THRESHOLD) inkPoints.push({ x, y });
    }
  }

  const grid = inkPoints.length >= 4 ? mapToGrid(inkPoints) : null;
  targetGridCache.set(char, grid);
  return grid;
}

export const MATCH_THRESHOLD = 45; // trazo aceptado como correcto (índice de Jaccard %)
export const CLOSE_THRESHOLD = 26; // trazo "casi", se ofrece pista en vez de fallo genérico
// Con tanta tolerancia posicional, un simple toque o un garabato mínimo podría
// alcanzar el puntaje mínimo por pura casualidad. Esto exige que el trazo haya
// recorrido una distancia real (en píxeles del lienzo) antes de evaluarlo, sin
// depender del puntaje de forma — un gesto demasiado corto nunca es "escribir la
// letra", sea cual sea su puntaje.
const MIN_STROKE_LENGTH = 40;

function strokeLength(points) {
  let length = 0;
  for (let i = 1; i < points.length; i++) {
    length += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  }
  return length;
}

// strokePoints: array de {x, y} en coordenadas del canvas de dibujo (cualquier escala).
// targetChar: la letra hebrea esperada.
export function recognizeLetter(strokePoints, targetChar) {
  if (!strokePoints || strokePoints.length < 4 || strokeLength(strokePoints) < MIN_STROKE_LENGTH) {
    return { score: 0, isMatch: false, isClose: false, reason: 'too-short' };
  }

  const targetGrid = getTargetGrid(targetChar);
  if (!targetGrid) {
    return { score: 0, isMatch: false, isClose: false, reason: 'no-template' };
  }

  const userGrid = pointsToGrid(strokePoints);
  const score = Math.round(jaccard(userGrid, targetGrid) * 100);

  return {
    score,
    isMatch: score >= MATCH_THRESHOLD,
    isClose: score >= CLOSE_THRESHOLD,
  };
}
