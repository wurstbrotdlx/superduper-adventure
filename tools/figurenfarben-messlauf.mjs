// Pruefprotokoll zu Bauabschnitt G8 (phase-g8-figurenfarben.md).
//
//   python3 serve.py &
//   node tools/figurenfarben-messlauf.mjs [URL]
//
// Braucht Playwright und einen Chromium wie die uebrigen Laeufe; PLAYWRIGHT_PFAD
// und CHROMIUM werden gelesen, wenn das Paket nicht im Projekt liegt.
//
// Zwei Teile, und der Unterschied ist wichtig:
//
//   Teil 1, die Rechnung. Laeuft ohne Grafikpaket. Er legt ein eigenes Blatt an
//   (einen Graukeil von Helligkeit 0.05 bis 0.95), schickt es durch farbBlatt()
//   und misst nach, was herauskommt: der Farbton ist der der Zielfarbe, das
//   Helligkeitsband liegt dort, wo FARB_BAND es hinlegt, und die Abstufung
//   bleibt monoton - ein hellerer Pixel bleibt der hellere. Dazu die Ableitung
//   der Hose und die Zusage, dass die Figurenblaetter den Cache nicht fuellen.
//
//   Der Farbton wird nur dort geprueft, wo einer ablegbar ist: ab BUNT
//   Zahlenschritten Abstand zwischen dem groessten und kleinsten Kanal. Bei
//   Umlaufs Reiseumhang (#524b54, Saettigung 0.057) liegen die dunklen Pixel
//   des Bandes bei zwei Schritten Abstand, und zwei Schritte tragen keinen
//   Farbton mehr - dort misst man die Aufloesung von 8 Bit und nicht die
//   Rechnung. Dieselbe Grenze und derselbe Grund wie NEUTRAL in
//   tools/portraet-farben.py.
//
//   Teil 2, die Figuren. Braucht das Grafikpaket in assets/cf/. Er misst an den
//   wirklich gebackenen Blaettern, ob die Farben der Portraets im Sprite
//   ankommen: je Figur muss es Pixel im Farbton der haarFarbe und im Farbton
//   der hemdFarbe geben. Ohne Paket entfaellt dieser Teil mit einer Zeile statt
//   mit einem Fehlurteil - ein Lauf ohne Grafik kann darueber nichts sagen.
//
// Wie die uebrigen Laeufe: jede Zeile ist ein Soll-Ist-Vergleich, der Exit-Code
// ist 1 bei der ersten Abweichung.
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const { chromium } = pw;

const URL = process.argv[2] || 'http://127.0.0.1:8378/index.html';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });

let fehl = 0;
function pruef(name, ist, soll){
  const ok = JSON.stringify(ist) === JSON.stringify(soll);
  if(!ok) fehl++;
  console.log(`${ok ? 'ok  ' : 'FEHL'}  ${name}${ok ? '' : `\n        ist:  ${JSON.stringify(ist)}\n        soll: ${JSON.stringify(soll)}`}`);
}

const page = await browser.newPage();
const konsole = [];
page.on('console', m => { if(m.type() === 'error') konsole.push(m.text()); });
page.on('pageerror', e => konsole.push('pageerror: ' + e.message));
await page.goto(URL, { waitUntil: 'load' });
await page.waitForFunction(() => typeof assetsReady !== 'undefined' && assetsReady, null, { timeout: 30000 });

// --- Teil 1: die Rechnung ---------------------------------------------------
const rechnung = await page.evaluate(() => {
  // Ein eigenes Blatt, damit der Lauf nicht davon abhaengt, ob Cute Fantasy
  // daliegt: 9x1 Zellen a 64x64 wie die Haar-Blaetter, gefuellt mit einem
  // Graukeil ueber die volle Breite.
  const c = document.createElement('canvas');
  c.width = 576; c.height = 64;
  const cc = c.getContext('2d');
  for(let x = 0; x < 576; x++){
    const v = Math.round((0.05 + (x / 575) * 0.90) * 255);
    cc.fillStyle = `rgb(${v},${v},${v})`;
    cc.fillRect(x, 0, 1, 64);
  }
  SHEETS['pruef_keil'] = {img:c, cols:9, n:9, fw:64, fh:64, ax:32, ay:40, rowStart:0};

  const hsl = hex => hexHsl(hex);
  const lese = leinwand => {
    const g = leinwand.getContext('2d', {willReadFrequently:true});
    const d = g.getImageData(0, 0, leinwand.width, leinwand.height).data;
    const px = [];
    for(let i = 0; i < d.length; i += 4){
      if(d[i+3] <= 8) continue;
      const mx = Math.max(d[i], d[i+1], d[i+2]), mn = Math.min(d[i], d[i+1], d[i+2]);
      px.push({l:(mx + mn) / 510, bunt:mx - mn, t:mx === mn ? null : hexHsl('#' +
        [d[i], d[i+1], d[i+2]].map(v => v.toString(16).padStart(2, '0')).join('')).h});
    }
    return px;
  };

  // Alle Zielfarben, die im Spiel wirklich vorkommen.
  const ziele = [];
  const nimm = g => { if(g && g.haarFarbe) ziele.push(g.haarFarbe); if(g && g.hemdFarbe) ziele.push(g.hemdFarbe); };
  nimm(KN_GESTALT);
  for(const f of DORF_FIGUREN) nimm(f.gestalt);

  const BUNT = 8;   // Zahlenschritte Abstand, ab denen ein Pixel einen Farbton traegt
  const abw = {ton:0, unten:0, oben:0, monoton:0};
  for(const hex of ziele){
    const aus = farbBlatt('pruef_keil', hex, false);
    const px = lese(aus);
    const z = hsl(hex);
    const l0 = Math.max(0.06, z.l - FARB_BAND), l1 = Math.min(0.94, z.l + FARB_BAND);
    let min = 1, max = 0;
    for(const p of px){
      if(z.s > 0.05 && p.t !== null && p.bunt >= BUNT){
        const d = Math.abs(p.t - z.h);
        if(Math.min(d, 1 - d) > 0.02) abw.ton++;
      }
      if(p.l < min) min = p.l;
      if(p.l > max) max = p.l;
    }
    // Monotonie: der Keil wird nach rechts heller. Gemessen wird die erste
    // Zeile, nicht die Pixelfolge - die springt am Zeilenende zurueck an den
    // linken, dunklen Rand, und das waere kein Befund, sondern ein Umbruch.
    let letzte = -1, bruch = false;
    for(let x = 0; x < aus.width; x++){
      const p = px[x];
      if(p.l + 0.002 < letzte){ bruch = true; break; }
      letzte = p.l;
    }
    if(bruch) abw.monoton++;
    if(Math.abs(min - l0) > 0.03) abw.unten++;
    if(Math.abs(max - l1) > 0.03) abw.oben++;
  }

  // Der Cache: die Figurenblaetter duerfen ihn nicht fuellen, die des Spielers schon.
  const vorher = FARB_CACHE.size;
  farbBlatt('pruef_keil', '#123456', false);
  const nachFluechtig = FARB_CACHE.size;
  farbBlatt('pruef_keil', '#123456', true);
  const nachGemerkt = FARB_CACHE.size;
  FARB_CACHE.delete('pruef_keil|#123456');

  return {
    ziele: ziele.length,
    abw,
    hose: [dunkler('#aabbcc', HOSE_DUNKLER), dunkler('#ffffff', 0.5), dunkler(null, 0.5)],
    cache: [nachFluechtig - vorher, nachGemerkt - vorher],
  };
});

console.log(`\nTeil 1 — die Rechnung (${rechnung.ziele} Zielfarben durch einen Graukeil)\n`);
pruef('kein bunter Pixel faellt aus dem Farbton der Zielfarbe', rechnung.abw.ton, 0);
pruef('das Helligkeitsband beginnt, wo FARB_BAND es hinlegt', rechnung.abw.unten, 0);
pruef('das Helligkeitsband endet, wo FARB_BAND es hinlegt', rechnung.abw.oben, 0);
pruef('die Abstufung bleibt monoton', rechnung.abw.monoton, 0);
pruef('die Hose ist das abgedunkelte Hemd, ohne Hemd bleibt sie leer',
      rechnung.hose, ['#7a8793', '#808080', null]);
pruef('ein Figurenblatt fuellt den Cache nicht, ein gemerktes schon', rechnung.cache, [0, 1]);

// --- Teil 2: die Figuren ----------------------------------------------------
const figuren = await page.evaluate(() => {
  const ton = hex => hexHsl(hex);
  const blatt = key => {
    const s = SHEETS[key]; if(!s || !s.img) return null;
    const c = document.createElement('canvas');
    c.width = s.fw; c.height = s.fh;
    const g = c.getContext('2d', {willReadFrequently:true});
    g.drawImage(s.img, 0, 0, s.fw, s.fh, 0, 0, s.fw, s.fh);
    return g.getImageData(0, 0, s.fw, s.fh).data;
  };
  const trifft = (d, hex) => {
    if(!d) return false;
    const z = ton(hex);
    for(let i = 0; i < d.length; i += 4){
      if(d[i+3] <= 8) continue;
      const mx = Math.max(d[i], d[i+1], d[i+2]), mn = Math.min(d[i], d[i+1], d[i+2]);
      const l = (mx + mn) / 510;
      if(Math.abs(l - z.l) > FARB_BAND + 0.03) continue;
      if(z.s <= 0.05){ if(mx - mn <= 24) return true; continue; }
      if(mx === mn) continue;
      const h = hexHsl('#' + [d[i], d[i+1], d[i+2]].map(v => v.toString(16).padStart(2, '0')).join('')).h;
      const dd = Math.abs(h - z.h);
      if(Math.min(dd, 1 - dd) <= 0.06) return true;
    }
    return false;
  };

  // Traegt die Welt ueberhaupt Grafik? Ein Blatt des Helden-Rigs reicht als Probe.
  if(!SHEETS['cfbody_idle'] || !SHEETS['cfbody_idle'].img) return {grafik:false};

  const ohneHaar = [], ohneHemd = [], ohneBlatt = [];
  const alle = [{key:'knoeterich', blatt:EMPFANG_BLATT, gestalt:KN_GESTALT},
                ...DORF_FIGUREN.map(f => ({key:f.key, blatt:`npc_baked_${f.key}`, gestalt:f.gestalt}))];
  for(const f of alle){
    const d = blatt(f.blatt);
    if(!d){ ohneBlatt.push(f.key); continue; }
    if(f.gestalt.haarFarbe && !trifft(d, f.gestalt.haarFarbe)) ohneHaar.push(f.key);
    if(f.gestalt.hemdFarbe && !trifft(d, f.gestalt.hemdFarbe)) ohneHemd.push(f.key);
  }

  // Das komposit-Flag: es muss auch dann gelten, wenn das Paketblatt daliegt.
  // Dafuer wird eines untergeschoben und danach wieder entfernt.
  const wander = DORF_FIGUREN.filter(f => f.opt !== 'fest');
  const falsch = [];
  for(const f of wander){
    const k = `cfnpc_${f.sheet}_idle`;
    const merk = SHEETS[k];
    SHEETS[k] = SHEETS['cfbody_idle'];
    const b = npcBlaetter(f).idle;
    if(merk === undefined) delete SHEETS[k]; else SHEETS[k] = merk;
    const soll = f.komposit ? `npc_baked_${f.key}` : k;
    if(b !== soll) falsch.push(`${f.key}: ${b} statt ${soll}`);
  }
  return {grafik:true, ohneBlatt, ohneHaar, ohneHemd, falsch, figuren:alle.length,
          komposit:wander.filter(f => f.komposit).length, wander:wander.length};
});

if(!figuren.grafik){
  console.log('\nTeil 2 — die Figuren\n');
  console.log('  uebersprungen: assets/cf/ liegt nicht daneben, es gibt keine gebackenen');
  console.log('  Blaetter zu messen. Dieser Lauf faellt damit nicht durch, er sagt nur');
  console.log('  nichts ueber die Figuren. Mit Grafikpaket wiederholen.');
} else {
  console.log(`\nTeil 2 — die Figuren (${figuren.figuren} Komposite, ${figuren.komposit} von ${figuren.wander} Wandernden auf komposit:true)\n`);
  pruef('jede Figur hat ein gebackenes Blatt', figuren.ohneBlatt, []);
  pruef('die Haarfarbe des Portraets kommt im Sprite an', figuren.ohneHaar, []);
  pruef('die Hemdfarbe des Portraets kommt im Sprite an', figuren.ohneHemd, []);
  pruef('komposit:true schlaegt ein vorhandenes Paketblatt', figuren.falsch, []);
}

pruef('keine Fehlermeldung in der Konsole', konsole.filter(z => !/404|Failed to load resource/.test(z)), []);

await browser.close();
console.log(`\n${fehl ? fehl + ' Abweichungen' : 'Keine Abweichung'}.`);
process.exit(fehl ? 1 : 0);
