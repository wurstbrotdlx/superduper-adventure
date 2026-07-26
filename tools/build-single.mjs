#!/usr/bin/env node
// ---------------------------------------------------------------------------
//  build-single.mjs — baut aus index.html + assets/ eine einzige HTML-Datei,
//  in der alle Grafiken als data:-URIs stecken.
//
//  Warum: Cute Fantasy (Kenmi) erlaubt kommerzielle Nutzung und Modifikation,
//  verbietet aber Weiterverteilung der Dateien, auch modifiziert. Ein Spiel
//  auszuliefern, in dem die Grafik steckt, ist der gekaufte Anwendungsfall;
//  original benannte PNGs in einem öffentlichen Repo abzulegen ist es nicht.
//  Deshalb liegt `assets/cf/` in der .gitignore und wird nur hier eingebacken.
//
//  Nebeneffekte, die unabhängig davon nützen: ein HTTP-Request statt ~96, das
//  Ergebnis läuft ohne Server per Doppelklick und ist als eine Datei
//  verschickbar (Beta-Test).
//
//  Aufruf:  node tools/build-single.mjs [--out dist/index.html]
//  Zero-dep, nur node:fs / node:path.
// ---------------------------------------------------------------------------
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'index.html');
const ASSET_DIR = join(ROOT, 'assets');

// Genau diese Zeile wird ersetzt. Fehlt sie, bricht der Build ab, statt still
// eine Datei ohne Grafik zu schreiben.
const MARKER = 'const ASSET_BLOBS = null; /*BUILD:ASSET_BLOBS*/';

const MIME = { '.png': 'image/png', '.gif': 'image/gif', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };

const argOut = process.argv.indexOf('--out');
const OUT = resolve(ROOT, argOut > -1 ? process.argv[argOut + 1] : 'dist/index.html');

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = walk(ASSET_DIR).filter(p => {
  const ext = p.slice(p.lastIndexOf('.')).toLowerCase();
  return MIME[ext] !== undefined;
});

if (!files.length) {
  console.error('FEHLER: keine Bilddateien unter assets/ gefunden.');
  process.exit(1);
}

// Schlüssel ist exakt der Pfad, den das Spiel baut (ASSETS + path), also
// "assets/..." mit Vorwärts-Schrägstrichen — auch auf Windows.
const blobs = {};
let raw = 0;
for (const p of files) {
  const key = relative(ROOT, p).split(/[\\/]/).join('/');
  const buf = readFileSync(p);
  const ext = p.slice(p.lastIndexOf('.')).toLowerCase();
  blobs[key] = `data:${MIME[ext]};base64,${buf.toString('base64')}`;
  raw += buf.length;
}

const src = readFileSync(SRC, 'utf8');
if (!src.includes(MARKER)) {
  console.error('FEHLER: Marker nicht in index.html gefunden:\n  ' + MARKER);
  console.error('Wurde die Zeile umformuliert? Ohne sie kann der Build die Assets nicht einsetzen.');
  process.exit(1);
}

// JSON.stringify erzeugt gültiges JS-Objektliteral. </script> kann in base64
// nicht vorkommen, ein Escape ist also nicht nötig — der Vollständigkeit halber
// trotzdem abgesichert, falls hier später Textdateien dazukommen.
const literal = 'const ASSET_BLOBS = ' + JSON.stringify(blobs).replace(/<\//g, '<\\/') + ';';
const out = src.replace(MARKER, literal);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, out);

const kb = n => (n / 1024).toFixed(0) + ' KB';
console.log(`eingebettet : ${files.length} Dateien, ${kb(raw)} roh -> ${kb(out.length - src.length)} als data:-URI`);
console.log(`Quelle      : ${kb(src.length)}`);
console.log(`Ergebnis    : ${relative(process.cwd(), OUT)}  ${kb(out.length)}`);
console.log('');
console.log('Prüfen: die Datei im Browser öffnen (auch per file:// ohne Server) und');
console.log('kontrollieren, dass die Konsole keine "Sprite fehlt"-Warnung zeigt.');
