// Script de un solo uso: descarga una foto de Pexels por cada palabra del juego y la
// guarda en public/images/words/<id>.jpg. Se corre una sola vez en desarrollo (o cada
// vez que se quiera renovar el set de fotos) — la app publicada en GitHub Pages NUNCA
// llama a la API de Pexels ni incluye la API key, solo usa estos archivos estáticos.
//
// Uso:
//   PEXELS_API_KEY=tu_api_key node scripts/fetch-pexels-images.js
const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.PEXELS_API_KEY;
if (!API_KEY) {
  console.error('Falta PEXELS_API_KEY. Uso: PEXELS_API_KEY=xxx node scripts/fetch-pexels-images.js');
  process.exit(1);
}

const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'words');
fs.mkdirSync(OUT_DIR, { recursive: true });

// id de la palabra (words.js) -> término de búsqueda en inglés para Pexels.
const SEARCH_TERMS = {
  // animales
  dog: 'dog', cat: 'cat', fish: 'fish', cow: 'cow', horse: 'horse', bear: 'bear',
  lion: 'lion', tiger: 'tiger', mouse: 'mouse', owl: 'owl', snake: 'snake',
  turtle: 'turtle', elephant: 'elephant', monkey: 'monkey', wolf: 'wolf',
  // colores
  red: 'red color', blue: 'blue color', green: 'green color', yellow: 'yellow color',
  black: 'black color', white: 'white color', orange: 'orange color', purple: 'purple color',
  pink: 'pink color',
  // números
  one: 'number one', two: 'number two', three: 'number three', four: 'number four',
  five: 'number five', six: 'number six', seven: 'number seven', eight: 'number eight',
  nine: 'number nine', ten: 'number ten',
  // familia
  mom: 'mother', dad: 'father', grandpa: 'grandfather', grandma: 'grandmother',
  brother: 'brother', sister: 'sister', son: 'son', daughter: 'daughter',
  uncle: 'uncle', aunt: 'aunt',
  // objetos
  house: 'house', book: 'book', ball: 'ball', cup: 'cup', pen: 'pen', door: 'door',
};

function requestJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { Authorization: API_KEY } }, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 200)}`));
          return;
        }
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} al descargar imagen`));
        return;
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', reject);
    }).on('error', reject);
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchOne(id, query) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=square`;
  const data = await requestJson(url);
  const photo = data.photos && data.photos[0];
  if (!photo) {
    console.warn(`  ⚠ sin resultados para "${query}" (${id})`);
    return false;
  }
  const dest = path.join(OUT_DIR, `${id}.jpg`);
  await downloadFile(photo.src.medium, dest);
  console.log(`  ✓ ${id} <- "${query}" (foto de ${photo.photographer})`);
  return true;
}

async function main() {
  const entries = Object.entries(SEARCH_TERMS);
  let ok = 0;
  for (const [id, query] of entries) {
    try {
      const success = await fetchOne(id, query);
      if (success) ok++;
    } catch (err) {
      console.error(`  ✗ ${id}: ${err.message}`);
    }
    await sleep(300); // no golpear la API muy seguido, sin necesidad
  }
  console.log(`\nListo: ${ok}/${entries.length} imágenes descargadas en ${OUT_DIR}`);
}

main();
