# לומדים לכתוב עברית — Completa la letra hebrea

Documento de diseño del juego educativo de escritura hebrea táctil, implementado en `src/`.

## 1. Descripción general

Juego web (React, mobile-first, GitHub Pages) para niños y principiantes que están
aprendiendo el alfabeto hebreo. En cada ronda se muestra una palabra hebrea sencilla
con **una letra faltante** (p. ej. `ב_ת` para בית) junto a un emoji que la representa.
El jugador debe **dibujar con el dedo** la letra que falta sobre un lienzo táctil. El
juego reconoce el trazo y da feedback inmediato: éxito con sonido + animación + la
palabra pronunciada en voz alta, o un reintento con pista visual — nunca un mensaje
negativo.

## 2. Mecánica detallada

1. **Selección de contenido**: el jugador elige una categoría (חיות, צבעים, מספרים,
   משפחה, חפצים o "הכל"). Dentro de la categoría, las palabras se recorren en orden.
2. **Presentación**: se muestra el emoji de la palabra y la palabra con un hueco en la
   posición de la letra que se va a practicar. La letra elegida como "hueco" en cada
   palabra es siempre la menos familiar según el currículo (`src/data/letters.js`), de
   forma que cada palabra refuerza la letra más nueva que contiene.
3. **Trazo**: el jugador dibuja sobre `TraceCanvas`, que muestra un contorno guía muy
   tenue de la letra objetivo detrás del lienzo. Puede dibujar en varios trazos (subir
   y bajar el dedo) antes de pulsar **✓ בדוק** (comprobar).
4. **Reconocimiento**: el trazo se compara con la letra esperada mediante un algoritmo
   de comparación de formas por rejilla (ver sección técnica). Se calcula un puntaje
   0-100.
   - **Correcto** (`score ≥ 40`): animación + sonido de éxito, se pronuncia la palabra
     completa (Web Speech API, `he-IL`), se suman puntos y racha.
   - **Incorrecto**: mensaje positivo ("כמעט! נסה שוב"), sonido neutro (nunca de
     "error"), y la guía de fondo se vuelve más visible en el siguiente intento
     (pista progresiva). Tras 2 fallos aparece además un indicador 👆 animado.
5. **Progreso**: cada palabra correcta suma puntos (+10, +15 extra cada 3 aciertos
   seguidos = racha 🔥). Cada 4 palabras completadas sube de "שלב" (nivel) y se
   desbloquean 2 letras nuevas del currículo — se muestra una pantalla de celebración.
   El progreso se guarda en `localStorage` entre sesiones.
6. **Botones de apoyo**: 🔊 escuchar la letra, 🔁 limpiar el lienzo — siempre grandes,
   con ícono, sin texto imprescindible para que un niño de 5 años los use sin ayuda de
   un adulto que lea.

## 3. Ejemplos de pantalla

```
┌─────────────────────────┐   ┌─────────────────────────┐
│      🦉  (mascota)       │   │   ↩️      בחרו קטגוריה   │
│  לומדים לכתוב עברית      │   │  ┌─────────────────────┐│
│ צייר את האות החסרה       │   │  │  🌈      הכל         ││
│      עם האצבע! ✍️        │   │  └─────────────────────┘│
│                          │   │  ┌───────┐ ┌───────┐    │
│   ┌──────────────────┐   │   │  │ 🎨 צבעים│ │🐾 חיות│    │
│   │   🎮 בואו נשחק!   │   │   │  └───────┘ └───────┘    │
│   └──────────────────┘   │   │  ┌───────┐ ┌───────┐    │
└─────────────────────────┘   │  │👪משפחה │ │🔢מספרים│   │
     Pantalla de inicio       │  └───────┘ └───────┘    │
                               │       ┌───────┐          │
                               │       │🧸חפצים│          │
                               │       └───────┘          │
                               └─────────────────────────┘
                                 Selección de categoría

┌─────────────────────────┐   ┌─────────────────────────┐
│  🏆שלב1   ⭐0    ↩️      │   │  🏆שלב1  ⭐10  🔥3  ↩️   │
│  ▓▓▓▓▓░░░░░░░░░░░░░░░░  │   │  ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░  │
│          🐶              │   │          🐶              │
│        ל  ב  _           │   │        ל  ב  _           │
│  ╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄╮     │   │  ╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄╮     │
│  ┆                 ┆     │   │  ┆   🎉 (trazo כ)   ┆     │
│  ┆   (letra guía    ┆     │   │  ┆                 ┆     │
│  ┆    tenue: כ)     ┆     │   │  ┆                 ┆     │
│  ╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄╯     │   │  ╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄╯     │
│    גע וצייר כאן ✍️        │   │   🎉 כל הכבוד! ⭐        │
│  🔊     ✓ בדוק     🔁    │   │  🔊     ✓ בדוק     🔁    │
└─────────────────────────┘   └─────────────────────────┘
   Juego: antes de dibujar         Juego: después de un
                                        acierto
```

## 4. Contenido: 50 palabras hebreas iniciales

Cada palabra indica, entre paréntesis, la letra que el jugador practica dibujar en esa
palabra (la que aparece como hueco en el juego).

### חיות — Animales (15)
| Palabra | Emoji | Traducción | Letra a practicar |
|---|---|---|---|
| כלב | 🐶 | perro | כ |
| חתול | 🐱 | gato | ת |
| דג | 🐟 | pez | ג |
| פרה | 🐄 | vaca | ה |
| סוס | 🐴 | caballo | ס |
| דוב | 🐻 | oso | ב |
| אריה | 🦁 | león | ה |
| נמר | 🐯 | tigre | מ |
| עכבר | 🐭 | ratón | ע |
| ינשוף | 🦉 | búho | ש |
| נחש | 🐍 | serpiente | ש |
| צב | 🐢 | tortuga | צ |
| פיל | 🐘 | elefante | פ |
| קוף | 🐵 | mono | ק |
| זאב | 🐺 | lobo | ז |

### צבעים — Colores (9)
| Palabra | Emoji | Traducción | Letra a practicar |
|---|---|---|---|
| אדום | 🔴 | rojo | א |
| כחול | 🔵 | azul | ח |
| ירוק | 🟢 | verde | ק |
| צהוב | 🟡 | amarillo | ה |
| שחור | ⚫ | negro | ש |
| לבן | ⚪ | blanco | ן |
| כתום | 🟠 | naranja | ת |
| סגול | 🟣 | violeta | ג |
| ורוד | 🩷 | rosa | ר |

### מספרים — Números (10)
| Palabra | Emoji | Traducción | Letra a practicar |
|---|---|---|---|
| אחד | 1️⃣ | uno | א |
| שתיים | 2️⃣ | dos | ת |
| שלוש | 3️⃣ | tres | ש |
| ארבע | 4️⃣ | cuatro | א |
| חמש | 5️⃣ | cinco | ש |
| שש | 6️⃣ | seis | ש |
| שבע | 7️⃣ | siete | ש |
| שמונה | 8️⃣ | ocho | ה |
| תשע | 9️⃣ | nueve | ת |
| עשר | 🔟 | diez | ש |

### משפחה — Familia (10)
| Palabra | Emoji | Traducción | Letra a practicar |
|---|---|---|---|
| אמא | 👩 | mamá | א |
| אבא | 👨 | papá | א |
| סבא | 👴 | abuelo | א |
| סבתא | 👵 | abuela | א |
| אח | 👦 | hermano | א |
| אחות | 👧 | hermana | א |
| בן | 👶 | hijo | ן |
| בת | 👧 | hija | ת |
| דוד | 🧑 | tío | ד |
| דודה | 👩‍🦱 | tía | ה |

### חפצים — Objetos cotidianos (6)
| Palabra | Emoji | Traducción | Letra a practicar |
|---|---|---|---|
| בית | 🏠 | casa | י |
| ספר | 📖 | libro | פ |
| כדור | ⚽ | pelota | כ |
| כוס | 🥤 | vaso | ס |
| עט | ✏️ | lápiz | ע |
| דלת | 🚪 | puerta | ת |

## 5. Currículo de letras (orden de dificultad)

Definido en `src/data/letters.js`, de trazos simples a complejos:
ו · י · ל · ד · ר · ב · כ · ן · ם · ט · ח · ס · ע · פ · ף · נ · מ · ק · צ · ץ · ש · ת · א · ג · ז · ה · ך

Se desbloquean 2 letras nuevas cada vez que el jugador sube de nivel (cada 4 palabras
correctas).

## 6. Notas técnicas

- **Reconocimiento de trazo** (`src/utils/letterRecognition.js`): en vez de mantener
  plantillas dibujadas a mano por letra, la letra objetivo se renderiza con la
  tipografía hebrea real del navegador (`ctx.strokeText`) y se reduce a una rejilla
  booleana 22×22 normalizada por su propio bounding box. El trazo del jugador se
  reduce a una rejilla igual y se comparan por índice de Jaccard (intersección/unión),
  con tolerancia posicional (`DILATE_RADIUS`) para perdonar el temblor natural de una
  mano infantil. Esto cubre las 22 letras + formas finales automáticamente, sin
  plantillas manuales, 100% offline. Calibrado deliberadamente permisivo
  (`MATCH_THRESHOLD = 45`, con bastante tolerancia) para priorizar que un intento
  genuino gane, a costa de discriminar peor entre letras muy parecidas (p. ej. מ/ם,
  י/ו, ד/ר) — un compromiso explícito para un juego infantil, no un OCR de precisión
  clínica. Se exige sí un recorrido mínimo del trazo (no alcanza con tocar la
  pantalla) para que "ganar" siga requiriendo un intento real de escribir.
- **Voz** (`src/utils/speech.js`): usa `SpeechSynthesis` con voz `he-IL` si el
  navegador la tiene disponible; si no, el juego sigue funcionando solo con feedback
  visual y sonoro (mejora progresiva, no bloqueante).
- **Sonidos** (`src/utils/sounds.js`): generados con Web Audio API (osciladores), sin
  archivos de audio externos — mantiene el proyecto liviano para GitHub Pages.
- **Fotos de fondo** (`public/images/words/<id>.jpg`): cada tarjeta de palabra
  muestra de fondo una foto real relacionada (de [Pexels](https://www.pexels.com),
  uso libre sin atribución obligatoria), detrás del emoji con una capa
  semitransparente para mantener la legibilidad. Las 50 fotos se descargaron **una
  sola vez** con `scripts/fetch-pexels-images.js` y quedaron como archivos estáticos
  versionados en el repo — la app publicada en GitHub Pages nunca llama a la API de
  Pexels ni incluye ninguna API key, así que funciona igual con o sin conexión y sin
  depender de límites de la API en cada partida. Para renovar el set de fotos:
  `PEXELS_API_KEY=tu_api_key node scripts/fetch-pexels-images.js` (la key nunca se
  guarda en el repo, solo se usa en memoria para esa corrida).
- **Sin dependencias nuevas**: todo usa APIs nativas del navegador (Canvas, Pointer
  Events, SpeechSynthesis, WebAudio, localStorage), por lo que `npm run deploy`
  (gh-pages) sigue funcionando sin cambios en `package.json`.

## 7. Posibles mejoras futuras

- Nikud (vocalización) en las palabras para lectura más auténtica.
- Desbloqueo estricto de palabras según letras ya aprendidas (hoy todas las
  categorías están siempre accesibles).
- Grabación de la propia voz del niño pronunciando la letra.
- Modo "trazo guiado" con animación de la dirección de escritura, letra por letra.
