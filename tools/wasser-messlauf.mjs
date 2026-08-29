// Messlauf zum Wasser der Oberwelt (Bauabschnitt G12, s. phase-g12-steinbruch-rest.md).
//
//   python3 serve.py &
//   node tools/wasser-messlauf.mjs [URL] [--startwerte 20260805,20260806,...]
//
// Der Steinbruch aus GRAFIK-BESTAND-2026-08-21.md, Punkt 7, hat drei Posten, die
// im Wasser liegen: Wasserpflanzen, Wasservoegel und Bruecken. Ob und wo die
// hingehoeren, ist eine Frage an die Karte und nicht an die Dateiliste — also
// wird sie gemessen, bevor irgendetwas gesetzt wird (G11-Lehre: die Koppel stand
// im ersten Anlauf im Wald, weil niemand vorher nachgesehen hatte).
//
// Gemessen wird an der wirklich erzeugten Karte nach genMap(), nicht an den
// Konstanten der Weltform. Vier Fragen:
//
//   1. Wie viel Wasser liegt am Ufer, und wie viel davon sieht ein Spieler
//      ueberhaupt? Sichtbar heisst hier: an die Wasserkachel grenzt Land, das
//      reachbar() zulaesst. Wasser am Rand einer Deko-Insel zaehlt nicht mit,
//      dort kommt niemand hin.
//   2. Wie geborgen liegt dieses Uferwasser? Anteil Land im Umkreis von vier
//      Kacheln. Eine Seerose gehoert in eine Bucht und nicht in die offene
//      Tilgung; Schilf steht auch an gerader Kueste.
//   3. Wie weit ist das naechste Uferwasser vom Dorf entfernt? Die Deko, die
//      niemand sieht, ist gebaute Zeit ohne Ertrag.
//   4. Lohnt eine Bruecke? Gesucht sind Engen (Wasserstreifen bis sechs Kacheln
//      zwischen zwei erreichbaren Landkacheln) samt dem Umweg, den eine Bruecke
//      dort spart: Fussweg ueber Land von der einen Seite zur anderen, per
//      Flutfuellung ueber reachbar(). Eine Enge mit kurzem Umweg ist eine
//      Bruecke ueber nichts — dieselbe Behauptung wie Schienen ohne Lore (M3).
//
// Die Karte ist prozedural, der Startwert steht als Literal in index.html
// (mulberry32(20260805)). Ein Befund ueber eine einzige Karte waere geraten,
// deshalb schreibt der Lauf den Startwert beim Ausliefern der Seite um und misst
// mehrere Welten. Das ist derselbe Weg, auf dem die Bandgrenzen in W-Gross ueber
// sechs Startwerte belegt wurden, nur diesmal als Werkzeug statt von Hand.
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;

const argv = process.argv.slice(2);
const url = argv.find(a => !a.startsWith('--')) || 'http://127.0.0.1:8378/index.html';
const swIdx = argv.indexOf('--startwerte');
const STARTWERTE = swIdx >= 0 && argv[swIdx + 1]
  ? argv[swIdx + 1].split(',').map(s => s.trim())
  : ['20260805', '20260806', '20260807'];
const STANDARD = '20260805';                       // das Literal in index.html

const browser = await pw.chromium.launch({ executablePath: process.env.CHROMIUM || undefined });

// Im Seitenkontext ausgefuehrt. Alles, was hier steht, liest die gesetzte Welt.
const messen = () => {
  const idx = (x, y) => x + y * MW;
  const istMeer = (x, y) => T(x, y) === G_OCEAN;
  const N4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  let meer = 0, land = 0, strand = 0, eis = 0, insel = 0;
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
    if (inselMaske[idx(x, y)]) insel++;
    if (istMeer(x, y)) { meer++; continue; }
    land++;
    if (T(x, y) === G_BEACH) strand++;
    if (T(x, y) === G_ICE) eis++;
  }

  // (1)+(2) Uferwasser: Wasser mit erreichbarem Land als Nachbar, dazu die
  // Geborgenheit als Landanteil im Quadrat mit Radius 4 (81 Kacheln).
  const mx = (VILLAGE.x0 + VILLAGE.x1) / 2, my = (VILLAGE.y0 + VILLAGE.y1) / 2;
  const R = 4;
  let ufer = 0, uferSichtbar = 0, bucht = 0, offen = 0;
  let nahDorf60 = 0, buchtNah = 0, minAbstand = Infinity, minAbstandBucht = Infinity;
  const geborgenheiten = [];
  for (let y = 1; y < MH - 1; y++) for (let x = 1; x < MW - 1; x++) {
    if (!istMeer(x, y)) continue;
    let amLand = false, sichtbar = false;
    for (const [dx, dy] of N4) {
      if (istMeer(x + dx, y + dy)) continue;
      amLand = true;
      if (reachbar(x + dx, y + dy)) sichtbar = true;
    }
    if (!amLand) continue;
    ufer++;
    if (!sichtbar) continue;                       // Inselsaum: gesehen, nie betreten
    uferSichtbar++;
    let landRundum = 0, gesamt = 0;
    for (let j = -R; j <= R; j++) for (let i = -R; i <= R; i++) {
      const nx = x + i, ny = y + j;
      if (nx < 0 || ny < 0 || nx >= MW || ny >= MH) continue;
      gesamt++;
      if (!istMeer(nx, ny)) landRundum++;
    }
    const g = landRundum / gesamt;
    geborgenheiten.push(g);
    const d = Math.hypot(x - mx, y - my);
    if (d < minAbstand) minAbstand = d;
    if (d <= 60) nahDorf60++;
    if (g >= 0.5) {
      bucht++;
      if (d <= 60) buchtNah++;
      if (d < minAbstandBucht) minAbstandBucht = d;
    } else offen++;
  }
  geborgenheiten.sort((a, b) => a - b);
  const median = geborgenheiten.length ? geborgenheiten[geborgenheiten.length >> 1] : 0;

  // (4) Engen und ihr Umweg. Erst die Kandidaten sammeln: von einer erreichbaren
  // Landkachel gerade nach Osten oder Sueden ueber hoechstens sechs Wasserkacheln
  // auf erreichbares Land. Nur diese beiden Richtungen, sonst zaehlt jede Enge
  // doppelt.
  const kandidaten = [];
  for (let y = 2; y < MH - 2; y++) for (let x = 2; x < MW - 2; x++) {
    if (istMeer(x, y) || !reachbar(x, y)) continue;
    for (const [dx, dy] of [[1, 0], [0, 1]]) {
      let w = 0, cx = x + dx, cy = y + dy;
      while (w <= 6 && istMeer(cx, cy)) { w++; cx += dx; cy += dy; }
      if (w > 0 && w <= 6 && !istMeer(cx, cy) && reachbar(cx, cy))
        kandidaten.push({ x, y, zx: cx, zy: cy, w });
    }
  }

  // Der Umweg je Kandidat: Flutfuellung ueber erreichbares Land von der einen
  // Seite bis zur anderen, gedeckelt. Findet sie das Ziel nicht innerhalb des
  // Deckels, ist der Umweg mindestens so gross wie der Deckel — das reicht als
  // Aussage, eine genaue Zahl braucht niemand.
  const DECKEL = 40000;
  const marke = new Int32Array(MW * MH);
  let lauf = 0;
  const umweg = (a, b) => {
    lauf++;
    const dist = new Int32Array(0);                // nur Symbolik: Distanz steckt im Ring
    const ring = new Int32Array(DECKEL);
    const schritt = new Int32Array(DECKEL);
    let kopf = 0, ende = 0;
    ring[ende] = idx(a.x, a.y); schritt[ende++] = 0;
    marke[idx(a.x, a.y)] = lauf;
    const ziel = idx(b.x, b.y);
    while (kopf < ende) {
      const i = ring[kopf], s = schritt[kopf]; kopf++;
      if (i === ziel) return s;
      const x = i % MW, y = (i / MW) | 0;
      for (const [dx, dy] of N4) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= MW || ny >= MH) continue;
        const ni = idx(nx, ny);
        if (marke[ni] === lauf || !reachbar(nx, ny)) continue;
        if (ende >= DECKEL) return -1;             // Deckel erreicht, Umweg gross
        marke[ni] = lauf; ring[ende] = ni; schritt[ende++] = s + 1;
      }
    }
    return -1;                                     // gar kein Landweg gefunden
  };

  let ohneWeg = 0, langerUmweg = 0;
  let beste = null;
  const umwege = [];
  for (const k of kandidaten) {
    const u = umweg({ x: k.x, y: k.y }, { x: k.zx, y: k.zy });
    k.umweg = u;
    if (u < 0) { ohneWeg++; k.gewinn = Infinity; }
    else { k.gewinn = u - (k.w + 1); umwege.push(u); }
    if (u < 0 || k.gewinn >= 30) langerUmweg++;
    if (!beste || k.gewinn > beste.gewinn) beste = k;
  }
  umwege.sort((a, b) => a - b);

  // Was der Spieler wirklich ansteuert, sind die Wege. Uferwasser ohne Weg in
  // der Naehe sieht niemand, egal wie huebsch es bewachsen ist. Gemessen wird
  // der Abstand jeder sichtbaren Uferkachel zum naechsten G_PATH, per
  // Flutfuellung von allen Wegkacheln aus ueber die ganze Karte (einmal, statt
  // je Uferkachel zu suchen).
  const wegDist = new Int32Array(MW * MH).fill(-1);
  {
    const ring = new Int32Array(MW * MH);
    let kopf = 0, ende = 0;
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++)
      if (T(x, y) === G_PATH) { wegDist[idx(x, y)] = 0; ring[ende++] = idx(x, y); }
    while (kopf < ende) {
      const i = ring[kopf++], x = i % MW, y = (i / MW) | 0, d = wegDist[i];
      for (const [dx, dy] of N4) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= MW || ny >= MH) continue;
        const ni = idx(nx, ny);
        if (wegDist[ni] >= 0) continue;
        wegDist[ni] = d + 1; ring[ende++] = ni;
      }
    }
  }
  let wegNah8 = 0, wegNah16 = 0, wegMin = Infinity;
  for (let y = 1; y < MH - 1; y++) for (let x = 1; x < MW - 1; x++) {
    if (!istMeer(x, y)) continue;
    let sichtbar = false;
    for (const [dx, dy] of N4) if (!istMeer(x + dx, y + dy) && reachbar(x + dx, y + dy)) sichtbar = true;
    if (!sichtbar) continue;
    const d = wegDist[idx(x, y)];
    if (d < 0) continue;
    if (d <= 8) wegNah8++;
    if (d <= 16) wegNah16++;
    if (d < wegMin) wegMin = d;
  }

  // Wege sind aber nicht das, was den Spieler an die Kueste bringt: sie liegen um
  // das Dorf. Hinaus fuehren die Kammertueren — und die stehen bis an den
  // Strandsaum. Derselbe Abstand deshalb noch einmal, mit den Tueren als Bezug.
  const tueren = kammerTueren.map(t => [Math.floor(t.x / TS), Math.floor(t.y / TS)]);
  let tuerNah20 = 0, tuerNah40 = 0, tuerMin = Infinity;
  for (let y = 1; y < MH - 1; y++) for (let x = 1; x < MW - 1; x++) {
    if (!istMeer(x, y)) continue;
    let sichtbar = false;
    for (const [dx, dy] of N4) if (!istMeer(x + dx, y + dy) && reachbar(x + dx, y + dy)) sichtbar = true;
    if (!sichtbar) continue;
    let d = Infinity;
    for (const [tx, ty] of tueren) { const dd = Math.hypot(x - tx, y - ty); if (dd < d) d = dd; }
    if (d < tuerMin) tuerMin = d;
    if (d <= 20) tuerNah20++;
    if (d <= 40) tuerNah40++;
  }

  // Was G11 an dieser Kueste schon stehen hat: das Boot liegt auf der dem Dorf
  // naechsten Strandkachel. Wie weit das wirklich ist, hat damals niemand
  // gemessen — hier faellt es nebenbei mit ab.
  const boot = decos.find(d => d.sheet === 'cfboat');
  const bootAbstand = boot ? Math.round(Math.hypot(boot.x / TS - mx, boot.y / TS - my)) : null;

  // Abstand der naechsten Deko-Insel zum erreichbaren Land: eine Bruecke dorthin
  // waere ein Korridor, und Korridore sind in dieser Welt ausdruecklich verboten
  // (keine Wegfindung, s. genMap Schritt 3).
  let inselAbstand = Infinity;
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
    if (!inselMaske[idx(x, y)]) continue;
    for (let j = -14; j <= 14; j++) for (let i = -14; i <= 14; i++) {
      const nx = x + i, ny = y + j;
      if (nx < 0 || ny < 0 || nx >= MW || ny >= MH) continue;
      if (!reachbar(nx, ny)) continue;
      const d = Math.hypot(i, j);
      if (d < inselAbstand) inselAbstand = d;
    }
  }

  return {
    karte: { MW, MH, meer, land, strand, eis, insel },
    ufer: {
      gesamt: ufer, sichtbar: uferSichtbar, bucht, offen, median: +median.toFixed(2),
      nahDorf60, buchtNah,
      minAbstand: Math.round(minAbstand), minAbstandBucht: Math.round(minAbstandBucht),
    },
    engen: {
      n: kandidaten.length, ohneWeg, langerUmweg,
      medianUmweg: umwege.length ? umwege[umwege.length >> 1] : null,
      maxUmweg: umwege.length ? umwege[umwege.length - 1] : null,
      beste: beste ? { x: beste.x, y: beste.y, w: beste.w, umweg: beste.umweg,
                       gewinn: beste.gewinn === Infinity ? 'ohne Landweg' : beste.gewinn,
                       dDorf: Math.round(Math.hypot(beste.x - mx, beste.y - my)) } : null,
    },
    weg: { nah8: wegNah8, nah16: wegNah16, min: isFinite(wegMin) ? wegMin : null },
    tuer: { n: tueren.length, nah20: tuerNah20, nah40: tuerNah40,
            min: isFinite(tuerMin) ? Math.round(tuerMin) : null },
    bootAbstand,
    inselAbstand: isFinite(inselAbstand) ? +inselAbstand.toFixed(1) : null,
    dorf: { x0: VILLAGE.x0, y0: VILLAGE.y0, x1: VILLAGE.x1, y1: VILLAGE.y1 },
  };
};

const ergebnisse = [];
for (const sw of STARTWERTE) {
  const page = await browser.newPage();
  const fehler = [];
  page.on('pageerror', e => fehler.push(String(e).slice(0, 200)));
  if (sw !== STANDARD) {
    // Den Startwert der Welt beim Ausliefern umschreiben. Nur dieses eine
    // Literal, und der Lauf bricht ab, wenn es nicht genau einmal vorkommt —
    // eine stillschweigend wirkungslose Ersetzung waere schlimmer als keine.
    //
    // Seit der Teilung haengt das Muster an skript/01 und nicht mehr an der
    // Seite: in index.html stand das Literal zuletzt zweimal (der Aufruf und
    // ein Kommentar weiter unten, der ihn zitiert), und die Zaehlung haette den
    // Lauf abgebrochen. Die Teilung trennt beide, der Aufruf liegt in 01. Beim
    // Einzeldatei-Build (dist/index.html) stehen sie wieder zusammen — dieser
    // Lauf gehoert deshalb auf die Quelle, nicht auf die gebackene Datei.
    await page.route('**/skript/01-*.js', async route => {
      const antwort = await route.fetch();
      const text = await antwort.text();
      const treffer = text.split(`mulberry32(${STANDARD})`).length - 1;
      if (treffer !== 1) { console.error(`Startwert-Literal ${treffer}x gefunden, erwartet 1x`); process.exit(1); }
      route.fulfill({ response: antwort, body: text.replace(`mulberry32(${STANDARD})`, `mulberry32(${sw})`) });
    });
  }
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction(() => typeof frameNo !== 'undefined' && frameNo > 0, null, { timeout: 60000 });
  const m = await page.evaluate(messen);
  ergebnisse.push({ sw, ...m, fehler });
  await page.close();
}
await browser.close();

const p = (n, b) => b ? (n / b * 100).toFixed(1) + '%' : '-';
console.log(`Wasser der Oberwelt, ${ergebnisse.length} Startwert(e), Karte ${ergebnisse[0].karte.MW}x${ergebnisse[0].karte.MH}\n`);

console.log('Startwert   Meer   Land  Strand  Inselkacheln   Ufer  davon sichtbar  Bucht  offen  Median Geborgenheit');
for (const e of ergebnisse) {
  const k = e.karte, u = e.ufer;
  console.log(`${e.sw}  ${String(k.meer).padStart(5)} ${String(k.land).padStart(6)} ${String(k.strand).padStart(7)} ${String(k.insel).padStart(13)}  ${String(u.gesamt).padStart(5)} ${String(u.sichtbar).padStart(15)} ${String(u.bucht).padStart(6)} ${String(u.offen).padStart(6)} ${String(u.median).padStart(21)}`);
}

console.log('\nWas davon in Dorfnaehe liegt (Mitte des Dorfes als Bezug):');
console.log('Startwert   Uferwasser <=60 Kacheln   davon Bucht   naechstes Uferwasser   naechste Bucht');
for (const e of ergebnisse) {
  const u = e.ufer;
  console.log(`${e.sw}  ${String(u.nahDorf60).padStart(22)}  ${String(u.buchtNah).padStart(12)}  ${String(u.minAbstand).padStart(21)}  ${String(u.minAbstandBucht).padStart(15)}`);
}

console.log('\nWas davon an einem Weg liegt (Wege sind, wohin der Spieler laeuft):');
console.log('Startwert   Uferwasser <=8 vom Weg   <=16 vom Weg   naechstes Uferwasser am Weg   Boot aus G11 vom Dorf');
for (const e of ergebnisse) {
  const w = e.weg;
  console.log(`${e.sw}  ${String(w.nah8).padStart(21)}  ${String(w.nah16).padStart(12)}  ${String(w.min).padStart(27)}  ${String(e.bootAbstand).padStart(21)}`);
}

console.log('\nUnd an den Kammertueren (die fuehren aus dem Dorf hinaus, die Wege nicht):');
console.log('Startwert   Tueren   Uferwasser <=20 von einer Tuer   <=40   naechste Tuer am Uferwasser');
for (const e of ergebnisse) {
  const t = e.tuer, u = e.ufer;
  console.log(`${e.sw}  ${String(t.n).padStart(6)} ${String(t.nah20).padStart(31)} ${String(t.nah40).padStart(6)} ${String(t.min).padStart(29)}   (${(t.nah20 / (u.sichtbar || 1) * 100).toFixed(0)}% bzw. ${(t.nah40 / (u.sichtbar || 1) * 100).toFixed(0)}% des sichtbaren Uferwassers)`);
}

console.log('\nBrueckenfrage: Engen bis sechs Kacheln Wasser zwischen erreichbarem Land.');
console.log('Startwert   Engen   ohne Landweg   Umweg >=30   Median Umweg   groesster Umweg   beste Enge');
for (const e of ergebnisse) {
  const g = e.engen;
  const b = g.beste ? `(${g.beste.x},${g.beste.y}) Breite ${g.beste.w}, spart ${g.beste.gewinn}, ${g.beste.dDorf} vom Dorf` : '-';
  console.log(`${e.sw}  ${String(g.n).padStart(5)} ${String(g.ohneWeg).padStart(14)} ${String(g.langerUmweg).padStart(12)} ${String(g.medianUmweg).padStart(14)} ${String(g.maxUmweg).padStart(17)}   ${b}`);
}

console.log('\nDeko-Inseln: kuerzester Abstand zum erreichbaren Land (eine Bruecke dorthin waere ein Korridor).');
for (const e of ergebnisse) console.log(`${e.sw}  ${e.inselAbstand} Kacheln`);

const anteil = ergebnisse.map(e => e.ufer.sichtbar / (e.ufer.gesamt || 1));
console.log(`\nSichtbarer Anteil des Uferwassers ueber alle Startwerte: ${p(Math.min(...anteil), 1)} bis ${p(Math.max(...anteil), 1)}`);
for (const e of ergebnisse) if (e.fehler.length) console.log(`(Seitenfehler ${e.sw}: ${e.fehler[0]})`);
