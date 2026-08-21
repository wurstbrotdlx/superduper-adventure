// Maßstab-Messlauf (Bauabschnitt G7).
//
//   python3 serve.py &
//   node tools/massstab-messlauf.mjs [URL]
//
// Die Frage, die diesen Bauabschnitt ausgeloest hat, lautete: "die Haeuser und
// Baeume sind nicht in scale zu den Charakteren". Das ist eine Frage nach einem
// Verhaeltnis, und ein Verhaeltnis kann man messen statt ansehen.
//
// Gemessen wird nicht das Blatt und nicht die Skalierungszahl im Quelltext,
// sondern das, was am Ende auf dem Schirm steht: die Alpha-Bounding-Box des
// gezeichneten Frames mal der Skalierung, mit der das Spiel ihn wirklich
// gezeichnet hat. Beides faengt der Messlauf an genau einer Stelle ab, naemlich
// in drawSpriteAt() — das ist der Flaschenhals, durch den jedes Sprite geht,
// egal ob der Aufrufer drawSprite() benutzt (Baeume, Deko, Gebaeude) oder die
// Skalierung selbst in die Transformationsmatrix schreibt (Held, Monster,
// Leichen). Die Skala steht dann in der Matrix und wird dort abgelesen.
// Deshalb steht in dieser Datei keine zweite Skalentabelle, die neben der im
// Spiel veralten koennte.
//
// Zwei Spalten sind die Antwort:
//   Kachel   = Hoehe des Objekts in Kacheln (TS = 32 Pixel).
//   zum Held = Hoehe des Objekts, geteilt durch die Hoehe des Helden.
// Ein Haus mit "zum Held 1,5" ist anderthalb Helden hoch, und genau das war der
// Befund vor G7: ein Wohnhaus stand mit 114 Blattpixeln bei Skalierung 1 gegen
// einen Helden von 28 Blattpixeln bei 1,8 — 2,3 statt der 4,5 Kacheln, die das
// Blatt meint. Die Palisade des Lagers stand daneben richtig, weil W-Lager als
// einziger Bauabschnitt mit 2 gerechnet hat.
//
// Ohne lizenziertes Grafikpaket in assets/cf/ gibt es keine Bilder und damit
// keine Bounding-Boxen. Der Messlauf sagt das dann und misst nur noch die
// Skalierungen — die haengen nicht an den Dateien, und schon sie beantworten die
// Frage, ob noch irgendwo Weltkunst mit einer eigenen Zahl gezeichnet wird.
const URL = process.argv[2] || 'http://127.0.0.1:8378/index.html';
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const browser = await pw.chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage();
const fehler = [];
page.on('pageerror', e => fehler.push(String(e).slice(0, 200)));
await page.goto(URL, { waitUntil: 'load' });
await page.waitForTimeout(3500);

// drawSpriteAt mitschreiben. Die Funktion ist eine Top-Level-Deklaration im
// Inline-Skript, liegt also als globale Bindung vor und laesst sich ersetzen —
// auch fuer die Aufrufe aus dem Spiel heraus, die sie ueber denselben Namen
// aufloesen. Der Wrapper reicht durch und zaehlt nur mit.
await page.evaluate(() => {
  window.__massstab = new Map();
  const echt = window.drawSpriteAt;
  window.drawSpriteAt = function(key, frame, tint, tintA){
    const m = ctx.getTransform();
    let e = window.__massstab.get(key);
    if(!e){ e = {n: 0, skalen: new Set()}; window.__massstab.set(key, e); }
    e.n++; e.skalen.add(Math.round(Math.abs(m.a) * 1000) / 1000);
    return echt(key, frame, tint, tintA);
  };
});

// Ein Spaziergang, damit moeglichst viel gezeichnet wird: erst im Dorf stehen
// (Gebaeude, Staffage, Hoftiere), dann nach Sueden ins Feld (Baeume, Fels, Deko,
// Gegner) und zurueck. Reine Tastendruecke, kein Eingriff in den Spielzustand.
await page.evaluate(() => { if(typeof startGame === 'function') startGame(); });
await page.waitForTimeout(1500);
for(const [taste, ms] of [['KeyD', 2500], ['KeyS', 4000], ['KeyA', 3000], ['KeyW', 2500]]){
  await page.keyboard.down(taste); await page.waitForTimeout(ms); await page.keyboard.up(taste);
}
await page.waitForTimeout(800);

const mess = await page.evaluate(() => {
  const c = document.createElement('canvas'); c.width = 512; c.height = 512;
  const cx = c.getContext('2d', {willReadFrequently: true});
  // Alpha-Bounding-Box des ersten genutzten Frames. Gleiche Methode wie
  // npcAnkerAssert()/dorfSichtAssert() im Spiel, nur ohne Ankerbezug.
  function box(key){
    const s = SHEETS[key]; if(!s || !s.img) return null;
    if(s.fw > 512 || s.fh > 512) return null;
    try {
      cx.clearRect(0, 0, s.fw, s.fh);
      cx.drawImage(s.img, 0, (s.rowStart||0)*s.fh, s.fw, s.fh, 0, 0, s.fw, s.fh);
      const d = cx.getImageData(0, 0, s.fw, s.fh).data;
      let l = s.fw, r = -1, o = s.fh, u = -1;
      for(let py = 0; py < s.fh; py++) for(let px = 0; px < s.fw; px++)
        if(d[(py*s.fw+px)*4+3] > 8){
          if(px < l) l = px; if(px > r) r = px;
          if(py < o) o = py; if(py > u) u = py;
        }
      return r < 0 ? null : {w: r - l + 1, h: u - o + 1};
    } catch(e){ return null; }
  }
  // Monster tragen ihre Skala in MONDEF (sc/psc) und sind im Monsterkatalog M1
  // gegen den Referenzspieler geeicht. Ihre Blattnamen entstehen aus dem Rig,
  // also wird die Rig-Liste hier aus dem Spiel geholt statt in den Messlauf
  // getippt (dieselbe Regel wie ueberall sonst: eine Zahl an einem Ort).
  const rigs = [...new Set(Object.values(MONDEF).map(d => d.rig))];
  const zeilen = [];
  for(const [key, e] of window.__massstab){
    const s = SHEETS[key], b = box(key);
    zeilen.push({key, n: e.n, skalen: [...e.skalen].sort((a, z) => a - z),
                 figur: rigs.some(r => key.startsWith(r + '_')),
                 fw: s ? s.fw : null, fh: s ? s.fh : null, bh: b ? b.h : null});
  }
  return {WELT_SC, TS, PLAYER_SC, NPC_SC, zeilen,
          bauten: VILLAGE_BUILDINGS.map(b => ({bld: b.bld, w: b.w, h: b.h})),
          dorf: {x: VILLAGE.x1 - VILLAGE.x0 + 1, y: VILLAGE.y1 - VILLAGE.y0 + 1}};
});

const {WELT_SC, TS, PLAYER_SC} = mess;
const held = mess.zeilen.find(z => z.key === 'hero_baked');
const heldH = held && held.bh ? held.bh * held.skalen[held.skalen.length - 1] : null;

console.log(`Maßstab-Messlauf — WELT_SC ${WELT_SC}, TS ${TS}, PLAYER_SC ${PLAYER_SC}`);
console.log(heldH ? `Held: ${(heldH / TS).toFixed(2)} Kacheln hoch.`
                  : 'Kein lesbares Heldenblatt (Grafikpaket fehlt?) — nur Skalierungen, keine Größen.');
console.log('');
console.log('Blatt                          Aufrufe  Skalierung   Kachel  zum Held');
const sortiert = mess.zeilen.sort((a, z) => z.n - a.n);
for(const z of sortiert){
  const sk = z.skalen.map(s => String(s).replace('.', ',')).join('/');
  const hoehe = z.bh ? z.bh * z.skalen[z.skalen.length - 1] : null;
  console.log(`${z.key.padEnd(30)} ${String(z.n).padStart(7)}  ${sk.padEnd(11)} ` +
              `${(hoehe ? (hoehe / TS).toFixed(2) : '—').padStart(6)}  ` +
              `${(hoehe && heldH ? (hoehe / heldH).toFixed(2) : '—').padStart(8)}`);
}

// Die eine Zusicherung, die der Messlauf selbst faellen kann: Weltkunst wird mit
// WELT_SC gezeichnet. Die Ausnahmen stehen hier namentlich, mit Grund — wer eine
// neue hinzufuegt, muss sie begruenden, statt sie stillschweigend durchzulassen.
const AUSNAHMEN = {
  hero_baked:   'Held, eigene in G2 geeichte Skala',
  cftool_sword: 'Klingenbogen am Helden, Skala haengt an der Waffenstufe',
  cfcloud:      'Wolkenschatten, liegt ueber der Welt statt in ihr',
  cf_bolt:      'Zauberprojektil, Lesbarkeit vor Maßstab (G3)',
  glint:        'Fundmarke, kein Weltobjekt',
  alert:        'Aufmerksamkeitsmarke ueber dem Gegner, kein Weltobjekt',
  fire1:        'Flammeneffekt mit von Hand gesetztem Versatz',
  fire2:        'Flammeneffekt mit von Hand gesetztem Versatz',
};
const abweichler = sortiert.filter(z =>
  !AUSNAHMEN[z.key] && !z.figur &&
  !/^(cfnpc_|npc_baked_|cfbody|cfhands|cfhair)/.test(z.key) &&
  z.skalen.some(s => Math.abs(s - WELT_SC) > 0.001));
console.log('');
if(abweichler.length === 0) console.log(`Alle gezeichneten Weltblätter laufen auf WELT_SC (${WELT_SC}).`);
else {
  console.log('Weltblätter mit eigener Skalierung (jedes ist ein Befund):');
  for(const z of abweichler) console.log(`  ${z.key}: ${z.skalen.join('/')}`);
}
console.log('');
console.log(`Dorf: ${mess.dorf.x}x${mess.dorf.y} Kacheln,`, JSON.stringify(mess.bauten));
console.log('Seitenfehler:', fehler.length);
for(const f of fehler.slice(0, 5)) console.log('  ', f);
await browser.close();
