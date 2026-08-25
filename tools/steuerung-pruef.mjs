// Pruefprotokoll zu Bauabschnitt U7 (phase-u7-steuerung.md).
//
//   python3 serve.py &
//   node tools/steuerung-pruef.mjs [URL]
//
// Braucht Playwright und einen Chromium, wie die uebrigen Messlaeufe.
//
// WARUM ES DIESES WERKZEUG GIBT
//
// U7 ordnet die Bedienschicht nach vier Ecken: Zustand oben links, Karte oben
// rechts, Daumenring unten links, Faecher unten rechts. Eine solche Ordnung ist
// keine Behauptung ueber Geschmack, sondern eine ueber GEOMETRIE — und Geometrie
// laesst sich nachrechnen statt begutachten. Genau das war der Fehler der
// Vorfassung: die zwei senkrechten Roehren am Bildschirmrand sahen auf dem
// Entwicklungsschirm richtig aus und lagen auf einem liegenden Telefon quer
// ueber der Minikarte und dem Faecher. Niemand hat es gemessen, also hat es
// niemand gesehen.
//
// Der Lauf oeffnet dieselbe Datei in vier Formaten und stellt drei Dinge fest:
//
//   Ueberschneidung  keine zwei Bedienflaechen liegen uebereinander. Ausnahmen
//                    stehen in ERLAUBT und sind einzeln begruendet.
//   Daumenmass       jede Flaeche, die man antippt, ist mindestens 44x44 gross
//                    (Apple HIG 2024, Android Material 48dp — 44 ist die
//                    kleinere der beiden Zahlen und damit die verbindliche).
//   im Bild          nichts steht ausserhalb des Fensters oder haengt an einer
//                    Kante ab.
//
// Der Daumenring ist keine HTML-Flaeche, er wird ins Canvas gemalt. Sein Kreis
// wird deshalb aus joyRuhe() und joy.R gelesen und als Quadrat mitgeprueft: er
// ist die groesste Flaeche der ganzen Schicht und diejenige, die in der
// Vorfassung ueberhaupt keine war.
//
// Exit-Code 1, sobald eine Zeile nicht stimmt — wie menue-pruef.mjs, und aus
// demselben Grund: das taugt fuer CI, sollte das Repo je eines haben.

const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const { chromium } = pw;

const URL = process.argv[2] || 'http://127.0.0.1:8378/index.html';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });

// Die vier Formate. Die drei Telefone decken die Bruchstellen der Regeln ab
// (max-width 480, max-width 380, max-height 460), der Schirm den Fall ohne
// Finger.
const FORMATE = [
  { name: 'Telefon stehend',  w: 390, h: 844, touch: true  },
  { name: 'Telefon liegend',  w: 844, h: 390, touch: true  },
  { name: 'Telefon klein',    w: 360, h: 640, touch: true  },
  { name: 'Schirm',           w: 1440, h: 810, touch: false },
];

// Was gemessen wird. 'tap' heisst: da wird hingetippt, also gilt das Daumenmass.
const FLAECHEN = [
  { sel: '#statusKarte', tap: false },
  { sel: '#zone',        tap: false },
  { sel: '#minimap',     tap: true  },
  { sel: '#statCol',     tap: false },
  { sel: '#attackBtn',   tap: true,  nurTouch: true },
  { sel: '#potionBtn',   tap: true  },
  { sel: '#spellBtn',    tap: true  },
  { sel: '#ultBtn',      tap: true  },
  { sel: '#spellsBtn',   tap: true  },
  { sel: '#charBtn',     tap: true  },
  { sel: '#invBtn',      tap: true  },
  { sel: '#prioBtn',     tap: true,  nurTouch: true },
  { sel: '#aktionBtn',   tap: true  },
];

// Erlaubte Ueberschneidungen. Jede braucht einen Grund, sonst steht sie nicht hier.
const ERLAUBT = [
  // Der Bossbalken deckt die Ortszeile zu, wenn beide zusammenkommen. Das ist
  // die Entscheidung aus U7 und keine Panne: waehrend eines Bosskampfes ist der
  // Name des Gegners die Auskunft, der des Feldes nicht.
  ['#zone', '#bossbar'],
];

const erlaubt = (a, b) => ERLAUBT.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

const schneidet = (r1, r2) =>
  r1.x < r2.x + r2.w && r2.x < r1.x + r1.w && r1.y < r2.y + r2.h && r2.y < r1.y + r1.h;

const ueberlappFlaeche = (r1, r2) =>
  Math.max(0, Math.min(r1.x + r1.w, r2.x + r2.w) - Math.max(r1.x, r2.x)) *
  Math.max(0, Math.min(r1.y + r1.h, r2.y + r2.h) - Math.max(r1.y, r2.y));

let fehler = 0;
const melde = (ok, text) => { if(!ok) fehler++; console.log(`${ok ? '  ok  ' : ' FEHL '} ${text}`); };

for(const f of FORMATE){
  console.log(`\n=== ${f.name} (${f.w}x${f.h}${f.touch ? ', Finger' : ''}) ===`);
  const ctx = await browser.newContext({
    viewport: { width: f.w, height: f.h }, hasTouch: f.touch, isMobile: f.touch,
  });
  const page = await ctx.newPage();
  const jsFehler = [];
  page.on('pageerror', e => jsFehler.push(String(e)));
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForFunction(() => window.assetsReady === true, null, { timeout: 40000 }).catch(() => {});

  // In den laufenden Dienst, ohne Empfang und ohne Szene: gemessen wird die
  // Bedienschicht, nicht der Vorspann.
  await page.evaluate(() => {
    try { localStorage.clear(); } catch(_){}
    try { kn.seen.einstellung = true; } catch(_){}
    startGame();
    if(typeof szeneAus === 'function') szeneAus();
    if(typeof gespraechSchliessen === 'function') gespraechSchliessen();
    document.body.classList.remove('szeneLaeuft', 'introBuehne', 'vordruckOffen');
    const ib = document.getElementById('introBuehne'); if(ib) ib.style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    state = 'play';
  });
  // Ein Zustand, in dem WIRKLICH alles dasteht: Zauber und Ultimate gelernt,
  // Traenke im Beutel, ein Kontext in Reichweite. Ein Knopf, der nur manchmal
  // da ist, faellt sonst durch die Messung.
  await page.evaluate(() => {
    player.level = 9; player.gold = 12345; player.potions = 3; player.skillPoints = 2;
    for(const sp of SPELLS) player.spellsKnown[sp.id] = true;
    player.spellsKnown[ULT_SPELL.id] = true;
    activeSpellId = SPELLS[0].id;
    shiftT = 1327;
    recalc();
    updateHUD();
    // Kontextknopf und Kammer-Abbruch von Hand sichtbar machen: beide haengen
    // sonst an einem Ort in der Welt, und der Lauf soll die Geometrie pruefen,
    // nicht den Spaziergang dorthin.
    document.getElementById('aktionBtn').style.display = 'flex';
    document.getElementById('kamExitBtn').style.display = 'flex';
  });
  if(f.touch) await page.evaluate(() => enterTouchMode());
  await page.waitForTimeout(250);

  const mass = await page.evaluate((flaechen) => {
    const box = sel => {
      const e = document.querySelector(sel);
      if(!e) return null;
      const cs = getComputedStyle(e);
      if(cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return null;
      const r = e.getBoundingClientRect();
      if(r.width === 0 || r.height === 0) return null;
      return { x: r.x, y: r.y, w: r.width, h: r.height };
    };
    const out = {};
    for(const fl of flaechen){ const b = box(fl.sel); if(b) out[fl.sel] = b; }
    // Der Daumenring als Quadrat um seinen Kreis.
    if(document.body.classList.contains('touch')){
      const h = joyRuhe();
      out['#joyRing'] = { x: h.x - joy.R, y: h.y - joy.R, w: joy.R * 2, h: joy.R * 2 };
    }
    return out;
  }, FLAECHEN);

  const keys = Object.keys(mass);

  // 1) Nichts liegt ausserhalb des Bildes.
  for(const k of keys){
    const r = mass[k];
    const drin = r.x >= -1 && r.y >= -1 && r.x + r.w <= f.w + 1 && r.y + r.h <= f.h + 1;
    melde(drin, `im Bild: ${k} (${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.w)}x${Math.round(r.h)})`);
  }

  // 2) Keine zwei Bedienflaechen liegen uebereinander.
  for(let i = 0; i < keys.length; i++){
    for(let j = i + 1; j < keys.length; j++){
      const a = keys[i], b = keys[j];
      if(erlaubt(a, b)) continue;
      const ueber = schneidet(mass[a], mass[b]);
      if(ueber) melde(false, `frei: ${a} × ${b} — ${Math.round(ueberlappFlaeche(mass[a], mass[b]))} px² Ueberschneidung`);
    }
  }
  melde(true, `frei: ${keys.length} Flaechen paarweise geprueft`);

  // 3) Daumenmass.
  for(const fl of FLAECHEN){
    if(fl.nurTouch && !f.touch) continue;
    if(!fl.tap) continue;
    const r = mass[fl.sel];
    if(!r) continue;                       // nicht sichtbar in diesem Format ist kein Fehler
    const gross = r.w >= 43.5 && r.h >= 43.5;
    melde(gross, `Daumenmass: ${fl.sel} ${Math.round(r.w)}x${Math.round(r.h)}`);
  }

  melde(jsFehler.length === 0, `kein Skriptfehler${jsFehler.length ? ': ' + jsFehler[0] : ''}`);
  await ctx.close();
}

await browser.close();
console.log(fehler === 0 ? '\nAlles in Ordnung.' : `\n${fehler} Beanstandung(en).`);
process.exit(fehler === 0 ? 0 : 1);
