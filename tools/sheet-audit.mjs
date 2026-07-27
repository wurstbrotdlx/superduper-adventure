#!/usr/bin/env node
// G0 Audit-Werkzeug: bestimmt die WAHRE Frame-Aufteilung jedes Cute-Fantasy-Sheets
// per Alpha-Bounding-Box-Analyse. Zero-dep (nur node:fs, node:zlib, node:path).
//
// Lektion aus dem Sunnyside-Umzug: Dateinamen lügen (spr_idle_strip9.png ist 768x64 = 8
// Frames, nicht 9). Deshalb wird hier nichts aus Dateinamen geraten, sondern aus dem
// tatsächlichen Alphakanal des PNGs.
//
// Aufruf:
//   node tools/sheet-audit.mjs
//
// Liest:  Graphics/**.png            (ausgenommen Old_Sprites/, Player_Aseprite_Files/)
//         tools/sheet-audit.overrides.json   (Handkorrekturen, siehe dort)
// Schreibt: assets/cf/manifest.json
//           assets/cf/audit-report.md

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const GRAPHICS_DIR = path.join(REPO_ROOT, 'Graphics');
const OVERRIDES_PATH = path.join(__dirname, 'sheet-audit.overrides.json');
const MANIFEST_OUT = path.join(REPO_ROOT, 'assets', 'cf', 'manifest.json');
const REPORT_OUT = path.join(REPO_ROOT, 'assets', 'cf', 'audit-report.md');

const EXCLUDE_DIRS = new Set(['Old_Sprites', 'Player_Aseprite_Files']);

// Pfad-Fragmente, die per Regel (nicht per Inferenz) als 16x16-Tileraster gelten.
const TILE_RULE_HINTS = ['/Tiles/', '/Dungeons/', '/Outdoor decoration/', '/Dungeon_1/', '/Dungeon_2/', '/Dungeon_3/'];

const ALPHA_EMPTY_THRESHOLD = 8; // <= dieser Wert gilt als "leer" (toleriert leichtes AA-Rauschen)
const SIZE_PRIOR_SET = new Set([16, 32, 48, 64]);

// ---------------------------------------------------------------------------
// 1. PNG-Decode (nur Alphakanal wird behalten)
// ---------------------------------------------------------------------------

const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function readChunks(buf) {
  if (!buf.subarray(0, 8).equals(PNG_SIG)) throw new Error('kein PNG-Signatur-Header');
  const chunks = [];
  let off = 8;
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString('ascii', off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    chunks.push({ type, data });
    off += 8 + len + 4; // len + type + data + CRC
  }
  return chunks;
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

// Entfiltert alle Scanlines (Filtertypen 0-4) für bitDepth=8, beliebige Kanalzahl.
function unfilter(raw, width, height, channels) {
  const bpp = channels; // 1 Byte pro Kanal bei bitDepth 8
  const stride = width * channels;
  const out = Buffer.alloc(stride * height);
  let srcOff = 0;
  for (let y = 0; y < height; y++) {
    const filterType = raw[srcOff]; srcOff += 1;
    const rowOff = y * stride;
    const prevRowOff = rowOff - stride;
    for (let x = 0; x < stride; x++) {
      const raw_x = raw[srcOff + x];
      const a = x >= bpp ? out[rowOff + x - bpp] : 0;
      const b = y > 0 ? out[prevRowOff + x] : 0;
      const c = (x >= bpp && y > 0) ? out[prevRowOff + x - bpp] : 0;
      let val;
      switch (filterType) {
        case 0: val = raw_x; break;
        case 1: val = raw_x + a; break;
        case 2: val = raw_x + b; break;
        case 3: val = raw_x + ((a + b) >> 1); break;
        case 4: val = raw_x + paeth(a, b, c); break;
        default: throw new Error(`unbekannter Filtertyp ${filterType} in Zeile ${y}`);
      }
      out[rowOff + x] = val & 0xff;
    }
    srcOff += stride;
  }
  return out;
}

// Liefert {width, height, alpha:Uint8Array(width*height)} — nur der Alphakanal.
function decodePNGAlpha(filePath) {
  const buf = readFileSync(filePath);
  const chunks = readChunks(buf);
  const ihdr = chunks.find(c => c.type === 'IHDR');
  if (!ihdr) throw new Error('kein IHDR-Chunk');
  const width = ihdr.data.readUInt32BE(0);
  const height = ihdr.data.readUInt32BE(4);
  const bitDepth = ihdr.data.readUInt8(8);
  const colorType = ihdr.data.readUInt8(9);
  const interlace = ihdr.data.readUInt8(12);

  if (interlace !== 0) throw new Error(`Adam7-Interlace nicht unterstützt (${filePath})`);
  if (bitDepth !== 8) throw new Error(`Bittiefe ${bitDepth} nicht unterstützt, nur 8 (${filePath})`);

  let channels;
  switch (colorType) {
    case 0: channels = 1; break; // Graustufen
    case 2: channels = 3; break; // RGB
    case 3: channels = 1; break; // Palette
    case 4: channels = 2; break; // Grau+Alpha
    case 6: channels = 4; break; // RGBA
    default: throw new Error(`Farbtyp ${colorType} nicht unterstützt (${filePath})`);
  }

  const idatChunks = chunks.filter(c => c.type === 'IDAT').map(c => c.data);
  const idat = Buffer.concat(idatChunks);
  const raw = inflateSync(idat);
  const pixels = unfilter(raw, width, height, channels);

  const alpha = new Uint8Array(width * height);

  if (colorType === 6) {
    for (let i = 0, p = 0; i < width * height; i++, p += 4) alpha[i] = pixels[p + 3];
  } else if (colorType === 4) {
    for (let i = 0, p = 0; i < width * height; i++, p += 2) alpha[i] = pixels[p + 1];
  } else if (colorType === 3) {
    const plte = chunks.find(c => c.type === 'PLTE');
    const trns = chunks.find(c => c.type === 'tRNS');
    if (!plte) throw new Error(`Farbtyp 3 ohne PLTE (${filePath})`);
    if (trns) {
      const trnsAlpha = trns.data; // ein Byte Alpha pro Paletteneintrag, Rest = 255
      for (let i = 0; i < width * height; i++) {
        const idx = pixels[i];
        alpha[i] = idx < trnsAlpha.length ? trnsAlpha[idx] : 255;
      }
    } else {
      alpha.fill(255);
    }
  } else {
    // colorType 0 oder 2: kein Alphakanal im Datenstrom (tRNS-Farbschlüssel wird
    // bewusst ignoriert, siehe Plan) -> überall opak.
    alpha.fill(255);
  }

  return { width, height, alpha };
}

// ---------------------------------------------------------------------------
// 2. Rasterinferenz
// ---------------------------------------------------------------------------

function divisorsInRange(n, lo, hi) {
  const out = [];
  for (let d = lo; d <= hi && d <= n; d++) if (n % d === 0) out.push(d);
  return out;
}

// colEmpty[x] = true, wenn die gesamte Spalte x über alle Zeilen "leer" ist.
// rowEmpty[y] analog. O(W*H), einmal pro Bild.
function computeEmptyLines(alpha, width, height) {
  const colEmpty = new Uint8Array(width).fill(1);
  const rowEmpty = new Uint8Array(height).fill(1);
  for (let y = 0; y < height; y++) {
    const rowOff = y * width;
    for (let x = 0; x < width; x++) {
      if (alpha[rowOff + x] > ALPHA_EMPTY_THRESHOLD) {
        colEmpty[x] = 0;
        rowEmpty[y] = 0;
      }
    }
  }
  return { colEmpty, rowEmpty };
}

function gutterScore(emptyLine, size, cellSize, count) {
  if (count <= 1) return 1; // keine innere Grenze zu bewerten
  let clean = 0;
  for (let k = 1; k < count; k++) {
    const x = k * cellSize;
    const left = emptyLine[x - 1];
    const right = x < size ? emptyLine[x] : 1;
    if (left || right) clean++;
  }
  return clean / (count - 1);
}

// Erkennt "Inhalt - Lücke - Inhalt" innerhalb einer Zellspanne: das Kennzeichen einer
// Zelle, die in Wahrheit zwei gestapelte Frames zusammenfasst (z.B. fh=128 statt 64,
// wenn zwei Posen mit Kopf-/Fußfreiraum übereinanderliegen). Kopf-/Fußfreiraum allein
// (Lücke nur am Rand) ist normal und wird hier NICHT bestraft — nur eine Lücke, die
// Inhalt auf BEIDEN Seiten hat, ist verdächtig.
function bandHasInteriorGap(emptyLine, start, end) {
  let i = start;
  while (i < end && emptyLine[i]) i++;
  let j = end - 1;
  while (j >= i && emptyLine[j]) j--;
  if (i > j) return false; // ganze Spanne leer (Padding-Zeile/-Spalte), keine Aussage möglich
  for (let y = i; y <= j; y++) if (emptyLine[y]) return true;
  return false;
}

// Anteil der Zellspannen mit einer solchen inneren Lücke, unter den Spannen, die
// überhaupt Inhalt haben (leere Padding-Spannen zählen nicht mit).
function interiorGapPenalty(emptyLine, cellSize, count) {
  let withContent = 0, withGap = 0;
  for (let k = 0; k < count; k++) {
    const start = k * cellSize, end = start + cellSize;
    let allEmpty = true;
    for (let y = start; y < end; y++) if (!emptyLine[y]) { allEmpty = false; break; }
    if (allEmpty) continue;
    withContent++;
    if (bandHasInteriorGap(emptyLine, start, end)) withGap++;
  }
  return withContent > 0 ? withGap / withContent : 0;
}

// Bounding-Box des Alphakanals innerhalb einer Zelle (Zellkoordinaten, oder null wenn leer).
function cellBBox(alpha, width, cx, cy, fw, fh) {
  let minX = fw, minY = fh, maxX = -1, maxY = -1;
  const x0 = cx * fw, y0 = cy * fh;
  for (let y = 0; y < fh; y++) {
    const rowOff = (y0 + y) * width + x0;
    for (let x = 0; x < fw; x++) {
      if (alpha[rowOff + x] > ALPHA_EMPTY_THRESHOLD) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

function evaluateGrid(alpha, width, height, fw, fh, emptyLines) {
  const cols = Math.floor(width / fw);
  const rows = Math.floor(height / fh);
  const gScoreX = gutterScore(emptyLines.colEmpty, width, fw, cols);
  const gScoreY = gutterScore(emptyLines.rowEmpty, height, fh, rows);
  const gutter = (gScoreX + gScoreY) / 2;

  // Zusammengelegte Frames (fh/fw zu groß) verraten sich durch Inhalt-Lücke-Inhalt
  // innerhalb einer Zellspanne. Kräftiger, aber nicht absoluter Malus.
  const rowGapPenalty = interiorGapPenalty(emptyLines.rowEmpty, fh, rows);
  const colGapPenalty = interiorGapPenalty(emptyLines.colEmpty, fw, cols);
  const gapFactor = (1 - 0.85 * rowGapPenalty) * (1 - 0.85 * colGapPenalty);

  let occupiedCells = 0, alignedCells = 0;
  const rowFrames = new Array(rows).fill(0);
  const rowPrefixOk = new Array(rows).fill(true);
  const bboxes = []; // {row,col,bbox}

  for (let r = 0; r < rows; r++) {
    let sawGap = false;
    let countInRow = 0;
    for (let c = 0; c < cols; c++) {
      const bb = cellBBox(alpha, width, c, r, fw, fh);
      if (bb) {
        countInRow++;
        occupiedCells++;
        bboxes.push({ row: r, col: c, bbox: bb });
        const touchesLR = bb.x === 0 && (bb.x + bb.w) === fw;
        const touchesTB = bb.y === 0 && (bb.y + bb.h) === fh;
        if (!touchesLR && !touchesTB) alignedCells++;
        if (sawGap) rowPrefixOk[r] = false;
      } else {
        sawGap = true;
      }
    }
    rowFrames[r] = countInRow;
  }

  const bboxScore = occupiedCells > 0 ? alignedCells / occupiedCells : 0;
  const rowsWithContent = rowFrames.filter(n => n > 0).length;
  const occScore = rowsWithContent > 0
    ? rowFrames.reduce((sum, n, r) => sum + (n > 0 && rowPrefixOk[r] ? 1 : 0), 0) / rowsWithContent
    : 1;
  const sizePrior = (SIZE_PRIOR_SET.has(fw) ? 0.25 : 0) + (SIZE_PRIOR_SET.has(fh) ? 0.25 : 0);

  const score = (3 * gutter + 2 * bboxScore + 1 * occScore + 0.5 * sizePrior) * gapFactor;

  return { fw, fh, cols, rows, score, gutter, bboxScore, occScore, sizePrior, rowGapPenalty, colGapPenalty, rowFrames, bboxes };
}

function inferGrid(alpha, width, height) {
  const emptyLines = computeEmptyLines(alpha, width, height);
  const fwCandidates = divisorsInRange(width, 8, 128).filter(fw => width / fw <= 64);
  const fhCandidates = divisorsInRange(height, 8, 128).filter(fh => height / fh <= 64);

  const results = [];
  for (const fw of fwCandidates) {
    for (const fh of fhCandidates) {
      results.push(evaluateGrid(alpha, width, height, fw, fh, emptyLines));
    }
  }
  results.sort((a, b) => b.score - a.score);

  if (results.length === 0) {
    // Kein Kandidat im erlaubten Bereich (z.B. sehr kleine oder sehr große Sheets) ->
    // ganzes Bild als eine Zelle behandeln.
    return {
      best: evaluateGrid(alpha, width, height, width, height, emptyLines),
      alternatives: [],
      confidence: 1,
    };
  }

  const best = results[0];
  const second = results[1];
  const confidence = second ? (best.score - second.score) / (best.score || 1) : 1;
  return { best, alternatives: results.slice(1, 3), confidence };
}

// ---------------------------------------------------------------------------
// 3. Sheet-Auswertung (Grid -> Manifest-Eintrag)
// ---------------------------------------------------------------------------

function buildEntryFromGrid(relPath, width, height, alpha, gridEval, gridSource, confidence, alternatives) {
  const { fw, fh, cols, rows, rowFrames, bboxes } = gridEval;

  let unionX0 = fw, unionY0 = fh, unionX1 = -1, unionY1 = -1;
  for (const { bbox } of bboxes) {
    if (bbox.x < unionX0) unionX0 = bbox.x;
    if (bbox.y < unionY0) unionY0 = bbox.y;
    if (bbox.x + bbox.w > unionX1) unionX1 = bbox.x + bbox.w;
    if (bbox.y + bbox.h > unionY1) unionY1 = bbox.y + bbox.h;
  }
  const hasContent = unionX1 >= 0;
  const unionBBox = hasContent
    ? { x: unionX0, y: unionY0, w: unionX1 - unionX0, h: unionY1 - unionY0 }
    : { x: 0, y: 0, w: fw, h: fh };

  const anchorSuggested = { ax: Math.round(fw / 2), ay: hasContent ? unionY1 : fh };
  const totalFrames = rowFrames.reduce((a, b) => a + b, 0);

  return {
    path: relPath,
    w: width, h: height,
    fw, fh, cols, rows,
    gridSource,
    score: Math.round(gridEval.score * 1000) / 1000,
    confidence: Math.round(confidence * 1000) / 1000,
    alternatives: alternatives.map(a => ({ fw: a.fw, fh: a.fh, score: Math.round(a.score * 1000) / 1000 })),
    rowFrames,
    totalFrames,
    anchorSuggested,
    unionBBox,
    anims: null,
  };
}

function isTileRulePath(relPath) {
  const norm = '/' + relPath.replace(/\\/g, '/');
  return TILE_RULE_HINTS.some(hint => norm.includes(hint));
}

function auditFile(absPath, relPath) {
  const { width, height, alpha } = decodePNGAlpha(absPath);
  const emptyLines = computeEmptyLines(alpha, width, height);

  let gridEval, gridSource, confidence, alternatives;

  if (isTileRulePath(relPath)) {
    const fw = 16, fh = 16;
    gridEval = evaluateGrid(alpha, width, height, fw, fh, emptyLines);
    gridSource = 'rule';
    confidence = 1;
    alternatives = [];
    if (width % fw !== 0 || height % fh !== 0) {
      gridEval.note = `Maße nicht glatt durch 16 teilbar (${width}x${height}), cols/rows abgeschnitten`;
    }
  } else {
    const inferred = inferGrid(alpha, width, height);
    gridEval = inferred.best;
    gridSource = 'inferred';
    confidence = inferred.confidence;
    alternatives = inferred.alternatives;
  }

  const entry = buildEntryFromGrid(relPath, width, height, alpha, gridEval, gridSource, confidence, alternatives);
  if (gridEval.note) entry.note = gridEval.note;
  return entry;
}

// ---------------------------------------------------------------------------
// 4. Overrides
// ---------------------------------------------------------------------------

function loadOverrides() {
  if (!existsSync(OVERRIDES_PATH)) return {};
  return JSON.parse(readFileSync(OVERRIDES_PATH, 'utf8'));
}

function applyOverride(entry, absPath, override) {
  if (!override) return entry;
  if (override.fw && override.fh && (override.fw !== entry.fw || override.fh !== entry.fh)) {
    const { width, height, alpha } = decodePNGAlpha(absPath);
    const emptyLines = computeEmptyLines(alpha, width, height);
    const gridEval = evaluateGrid(alpha, width, height, override.fw, override.fh, emptyLines);
    const rebuilt = buildEntryFromGrid(entry.path, width, height, alpha, gridEval, 'override', 1, []);
    Object.assign(entry, rebuilt);
    entry.gridSource = 'override';
    if (override.note) entry.overrideNote = override.note;
  }
  if (override.anims) entry.anims = override.anims;
  return entry;
}

// ---------------------------------------------------------------------------
// 5. Verzeichnis-Walk
// ---------------------------------------------------------------------------

function walkPngs(dir, baseDir, out) {
  for (const name of readdirSync(dir).sort()) {
    if (name === '.DS_Store') continue;
    const abs = path.join(dir, name);
    const st = statSync(abs);
    if (st.isDirectory()) {
      if (path.relative(baseDir, dir) === '' && EXCLUDE_DIRS.has(name)) continue;
      walkPngs(abs, baseDir, out);
    } else if (name.toLowerCase().endsWith('.png')) {
      out.push(path.relative(baseDir, abs).split(path.sep).join('/'));
    }
  }
}

// ---------------------------------------------------------------------------
// 6. Rig-Verifikation (G3): per-Zeile Bounding-Box-Tabelle + ASCII-Render
// ---------------------------------------------------------------------------
//
// Aufruf:
//   node tools/sheet-audit.mjs --rig <Graphics/-relativer-Pfad> [--fw N --fh M]
//   node tools/sheet-audit.mjs --rig <...> --ascii <row>[,<col>]
//
// Ohne --fw/--fh wird das Raster aus assets/cf/manifest.json übernommen (falls
// vorhanden), sonst neu inferiert. --ascii rendert eine einzelne Zelle als
// Alphakanal-ASCII (Regel: nie aus Dateinamen raten, hier: nie aus Thumbnail-
// Eindruck raten, sondern am Pixel nachsehen).

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith('--')) { args[key] = next; i++; }
      else args[key] = true;
    }
  }
  return args;
}

function rowAggregateBBoxes(gridEval) {
  const { rows, cols, bboxes } = gridEval;
  const agg = new Array(rows).fill(null);
  for (const { row, col, bbox } of bboxes) {
    const a = agg[row] || (agg[row] = { n: 0, minX: bbox.x, minY: bbox.y, maxX: bbox.x + bbox.w, maxY: bbox.y + bbox.h, perFrame: [] });
    a.n++;
    a.minX = Math.min(a.minX, bbox.x); a.minY = Math.min(a.minY, bbox.y);
    a.maxX = Math.max(a.maxX, bbox.x + bbox.w); a.maxY = Math.max(a.maxY, bbox.y + bbox.h);
    a.perFrame[col] = bbox;
  }
  return agg;
}

function renderAsciiCell(alpha, width, cx, cy, fw, fh) {
  const lines = [];
  const x0 = cx * fw, y0 = cy * fh;
  for (let y = 0; y < fh; y++) {
    let line = '';
    const rowOff = (y0 + y) * width + x0;
    for (let x = 0; x < fw; x++) {
      const a = alpha[rowOff + x];
      line += a > ALPHA_EMPTY_THRESHOLD ? (a > 160 ? '#' : '+') : '.';
    }
    lines.push(line);
  }
  return lines.join('\n');
}

function auditRig(args) {
  const relPath = args.rig;
  const absPath = path.join(GRAPHICS_DIR, relPath);
  const { width, height, alpha } = decodePNGAlpha(absPath);
  const emptyLines = computeEmptyLines(alpha, width, height);

  let fw = args.fw ? Number(args.fw) : null;
  let fh = args.fh ? Number(args.fh) : null;
  if (!fw || !fh) {
    if (existsSync(MANIFEST_OUT)) {
      const manifest = JSON.parse(readFileSync(MANIFEST_OUT, 'utf8'));
      const entry = manifest.find(e => e.path === relPath);
      if (entry) { fw = entry.fw; fh = entry.fh; }
    }
  }
  if (!fw || !fh) {
    const inferred = inferGrid(alpha, width, height);
    fw = inferred.best.fw; fh = inferred.best.fh;
    console.log(`(kein Manifest-/CLI-Raster, inferiert: ${fw}x${fh})`);
  }

  const gridEval = evaluateGrid(alpha, width, height, fw, fh, emptyLines);
  console.log(`${relPath}  ${width}x${height}  Raster ${fw}x${fh}  ${gridEval.cols}x${gridEval.rows}  rowFrames=[${gridEval.rowFrames.join(',')}]`);

  const agg = rowAggregateBBoxes(gridEval);
  console.log('row  n   x0..x1     y0..y1     w   h');
  agg.forEach((a, r) => {
    if (!a) { console.log(`${String(r).padStart(3)}  0   (leer)`); return; }
    console.log(`${String(r).padStart(3)}  ${String(a.n).padStart(2)}  ${String(a.minX).padStart(3)}..${String(a.maxX).padStart(3)}   ${String(a.minY).padStart(3)}..${String(a.maxY).padStart(3)}   ${String(a.maxX - a.minX).padStart(3)} ${String(a.maxY - a.minY).padStart(3)}`);
  });

  if (args.ascii) {
    const [rowStr, colStr] = String(args.ascii).split(',');
    const row = Number(rowStr), col = colStr !== undefined ? Number(colStr) : 0;
    console.log(`\n-- ASCII row=${row} col=${col} --`);
    console.log(renderAsciiCell(alpha, width, col, row, fw, fh));
  }
}

// ---------------------------------------------------------------------------
// 7. Main
// ---------------------------------------------------------------------------

function main() {
  const t0 = Date.now();
  const relPaths = [];
  walkPngs(GRAPHICS_DIR, GRAPHICS_DIR, relPaths);

  const overrides = loadOverrides();
  // F43: die _rigTable spiegelt die im Code verbauten Rigs (CF_RIGS, CF_HERO_ANIMS,
  // CF_ANIMALS, CF_NPCS in index.html — der Code bleibt die Quelle, Regressionsregel 7).
  // Ihre anims/fw/fh wirken als Override je file-Pfad, damit die Zeilenwerte nicht ein
  // drittes Mal abgeschrieben werden. Direkte Pfad-Keys in der Datei schlagen die Tabelle.
  const rigAnims = {};
  for (const v of Object.values(overrides._rigTable || {}))
    if (v && typeof v === 'object' && v.file && v.anims) rigAnims[v.file] = { anims: v.anims, fw: v.fw, fh: v.fh };
  const manifest = [];
  const errors = [];

  for (const relPath of relPaths) {
    const absPath = path.join(GRAPHICS_DIR, relPath);
    try {
      let entry = auditFile(absPath, relPath);
      entry = applyOverride(entry, absPath, overrides[relPath] || rigAnims[relPath]);
      manifest.push(entry);
    } catch (err) {
      errors.push({ path: relPath, error: err.message });
    }
  }

  manifest.sort((a, b) => a.path.localeCompare(b.path));
  writeFileSync(MANIFEST_OUT, JSON.stringify(manifest, null, 2) + '\n');

  const lowConfidence = manifest.filter(e => e.gridSource === 'inferred' && e.confidence < 0.15);
  const priorityPaths = new Set((overrides._castTable || []).map(c => c.sheet));
  const lowConfidencePriority = lowConfidence.filter(e => priorityPaths.has(e.path));
  const lowConfidenceRest = lowConfidence.filter(e => !priorityPaths.has(e.path));
  const byPack = {};
  for (const e of manifest) {
    const pack = e.path.split('/')[0];
    (byPack[pack] ||= []).push(e);
  }

  const lines = [];
  lines.push('# Cute Fantasy Sheet-Audit');
  lines.push('');
  lines.push(`Erzeugt von \`tools/sheet-audit.mjs\`. ${manifest.length} Sheets ausgewertet, ${errors.length} Fehler, Laufzeit ${((Date.now() - t0) / 1000).toFixed(1)}s.`);
  lines.push('');
  lines.push('## Nach Pack');
  lines.push('');
  for (const pack of Object.keys(byPack).sort()) {
    const entries = byPack[pack];
    const rule = entries.filter(e => e.gridSource === 'rule').length;
    const inferred = entries.filter(e => e.gridSource === 'inferred').length;
    const override = entries.filter(e => e.gridSource === 'override').length;
    lines.push(`- **${pack}**: ${entries.length} Sheets (${inferred} inferiert, ${rule} per Regel, ${override} per Override)`);
  }
  lines.push('');
  lines.push('## Niedrige Confidence (< 0.15, gridSource=inferred)');
  lines.push('');
  lines.push(`${lowConfidence.length} von ${manifest.length} Sheets insgesamt unter der Schwelle (${lowConfidencePriority.length} davon G1-G3-Prioritätsrigs, siehe Cast-Tabelle unten). Confidence misst nur den Abstand zur zweitbesten Alternative — bei Sheets mit vielen Teilerharmonien (z.B. 32/16/64) bleibt er auch bei korrektem Raster niedrig, siehe G0-Umsetzungsnotizen. Volle Liste in \`assets/cf/manifest.json\` (Feld \`confidence\`).`);
  lines.push('');
  if (lowConfidencePriority.length > 0) {
    lines.push('### Davon Prioritätsrigs (per Hand gegen das PNG geprüft, siehe Cast-Tabelle für Ergebnis)');
    lines.push('');
    lines.push('| Pfad | Maße | bestes Raster | confidence | Alternativen |');
    lines.push('|---|---|---|---|---|');
    for (const e of lowConfidencePriority) {
      const alt = e.alternatives.map(a => `${a.fw}x${a.fh} (${a.score})`).join(', ') || '—';
      lines.push(`| ${e.path} | ${e.w}x${e.h} | ${e.fw}x${e.fh} (${e.cols}x${e.rows}) | ${e.confidence} | ${alt} |`);
    }
    lines.push('');
  }
  if (lowConfidenceRest.length > 0) {
    lines.push(`### Rest (${lowConfidenceRest.length}, nicht G1-G3-Priorität, ungeprüft)`);
    lines.push('');
    const restByPack = {};
    for (const e of lowConfidenceRest) {
      const pack = e.path.split('/')[0];
      (restByPack[pack] ||= []).push(e);
    }
    for (const pack of Object.keys(restByPack).sort()) {
      lines.push(`- **${pack}**: ${restByPack[pack].length} Sheets`);
    }
    lines.push('');
    lines.push('Diese werden erst geprüft, wenn eine spätere Phase sie tatsächlich braucht (nicht spekulativ in G0).');
  }
  lines.push('');
  lines.push('## Decode-Fehler');
  lines.push('');
  if (errors.length === 0) {
    lines.push('Keine.');
  } else {
    for (const e of errors) lines.push(`- \`${e.path}\`: ${e.error}`);
  }
  lines.push('');
  lines.push('## Rigs mit/ohne Cast-Animation');
  lines.push('');
  const castTable = overrides._castTable || [];
  if (castTable.length === 0) {
    lines.push('Noch nicht erfasst. Von Hand in `tools/sheet-audit.overrides.json` unter `_castTable` eintragen, dann diesen Bericht neu erzeugen.');
  } else {
    lines.push('Per Hand am PNG geprüft (`checked: true`) oder von einem geometrisch identischen Geschwister-Sheet übertragen (`checked: false`). Lektion aus dem Sunnyside-Umzug: Magier-Typen müssen zwingend auf einem Rig mit Cast laufen, nie auf einem Fallback-Rig ohne.');
    lines.push('');
    lines.push('| Rig | Sheet | Cast? | Geprüft | Notiz |');
    lines.push('|---|---|---|---|---|');
    for (const c of castTable) {
      lines.push(`| ${c.rig} | \`${c.sheet}\` | ${c.hasCast ? '**ja**' : 'nein'} | ${c.checked ? 'ja' : 'nein (Geschwister übertragen)'} | ${c.note} |`);
    }
    const castRigs = castTable.filter(c => c.hasCast).map(c => c.rig);
    lines.push('');
    lines.push(`**Cast-fähige Rigs für G3 (Magier-Typen ausschließlich hierauf mappen):** ${castRigs.join(', ') || '—'}.`);
  }
  lines.push('');

  writeFileSync(REPORT_OUT, lines.join('\n'));

  console.log(`Sheets: ${manifest.length}, Fehler: ${errors.length}, niedrige Confidence: ${lowConfidence.length}, Laufzeit: ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  if (errors.length > 0) {
    console.log('Fehler:');
    for (const e of errors) console.log(`  ${e.path}: ${e.error}`);
  }
}

const cliArgs = parseArgs(process.argv.slice(2));
if (cliArgs.rig) auditRig(cliArgs);
else main();
