// Gegenprobe zu stollenAssert() (Bauabschnitt M4, phase-m4-zweite-ebene.md).
//
//   python3 serve.py &
//   node tools/ebene-fehlversuch.mjs [URL]
//
// Nach dem Vorbild von tools/monster-fehlversuch.mjs und
// tools/steinbruch-fehlversuch.mjs: ein Guard, der immer schweigt, beweist
// nichts. Der Lauf setzt der Reihe nach Fehler in die Tabellen, die
// stollenAssert() bewacht, und prueft, ob er sie meldet — und ob er danach,
// mit zurueckgesetzter Tabelle, wieder still ist.
//
// Gesetzt wird ausschliesslich durch Veraenderung bestehender Tabellen und
// Funktionen, nie durch Neubindung der Konstanten selbst: `const` im
// Skript-Scope laesst sich nicht neu binden, ein Array-Element und eine
// Objekteigenschaft schon. Der letzte Eingriff ist der wichtigste — er stellt
// rollKammerZutat() auf den Stand vor M4 zurueck, also auf genau den Fehler,
// den M4 gefunden hat.
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const { chromium } = pw;

const URL = process.argv[2] || 'http://127.0.0.1:8378/index.html';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

const meldungen = [];
page.on('console', m => { if(m.type() === 'error') meldungen.push(m.text()); });
page.on('pageerror', e => meldungen.push('pageerror: ' + String(e).slice(0, 200)));

await page.goto(URL, { waitUntil: 'load' });
await page.waitForFunction(() => assetsReady === true, null, { timeout: 30000 });

const EINGRIFFE = [
  ['Sperrablage zahlt in Stiefeln',
   `ZUTAT_NOUNS.teilbescheid.slot = 'boots';`,
   `ZUTAT_NOUNS.teilbescheid.slot = 'armor';`],
  ['keine Waffe mehr im Roster',
   `window.__slot = ZUTAT_NOUNS.teilabhilfe.slot; ZUTAT_NOUNS.teilabhilfe.slot = 'armor';`,
   `ZUTAT_NOUNS.teilabhilfe.slot = window.__slot;`],
  ['ein Gegner steht in beiden Rostern',
   `KAM_STOLLEN.push('bat');`,
   `KAM_STOLLEN.pop();`],
  ['die Untere Registratur bekommt ein Untergeschoss',
   `KAM_EBENEN[1] = 2;`,
   `KAM_EBENEN[1] = 1;`],
  ['die Sperrablage verliert ihres',
   `KAM_EBENEN[2] = 1;`,
   `KAM_EBENEN[2] = 2;`],
  ['ein vierter Kammersatz',
   `KAM_EBENEN.push(1);`,
   `KAM_EBENEN.pop();`],
  ['die Sperrablage hat kein Roster',
   `window.__roster = KAM_STOLLEN.slice(); KAM_STOLLEN.length = 0;`,
   `KAM_STOLLEN.length = 0; for(const t of window.__roster) KAM_STOLLEN.push(t);`],
  ['die Truhe zahlt wieder aus der Unteren Registratur (der Stand vor M4)',
   `window.__roll = rollKammerZutat;
    window.rollKammerZutat = function(tier, biome){
      const pool = BIOME_MOBS[biome].concat(KAM_WAECHTER);
      if(tier >= 4) pool.push('bossgeneric');
      for(let i = 0; i < 40; i++){
        const z = {noun: pool[Math.floor(Math.random()*pool.length)], adj: pickAdj('hoehle', Math.min(3, tier))};
        if(zutatRar(z) >= tier) return z;
      }
      return {noun: pool[0], adj: ZUTAT_ADJ[0].a};
    };`,
   `window.rollKammerZutat = window.__roll;`],
];

const zeilen = [];
let fehl = 0;
function melde(name, ist, soll){
  const ok = ist === soll;
  if(!ok) fehl++;
  zeilen.push(`${ok ? 'ok  ' : 'FEHL'}  ${(ist ? 'gemeldet' : 'still   ')}  ${name}`);
}

// Ausgangslage: der unveraenderte Stand muss gruen sein, sonst misst der Lauf nichts.
meldungen.length = 0;
let gruen = await page.evaluate(() => stollenAssert());
melde('unveraenderter Stand (muss still sein)', !gruen || meldungen.length > 0, false);

for(const [name, setzen, zurueck] of EINGRIFFE){
  meldungen.length = 0;
  await page.evaluate(code => { (0, eval)(code); }, setzen);
  const ok = await page.evaluate(() => stollenAssert());
  melde(name, !ok && meldungen.length > 0, true);
  await page.evaluate(code => { (0, eval)(code); }, zurueck);
  meldungen.length = 0;
  const wieder = await page.evaluate(() => stollenAssert());
  melde(`  danach wieder gruen: ${name}`, !wieder || meldungen.length > 0, false);
}

await browser.close();
console.log(zeilen.join('\n'));
console.log(`\n${EINGRIFFE.length} Eingriffe, ${zeilen.length - fehl} von ${zeilen.length} Zeilen wie erwartet.`);
process.exit(fehl ? 1 : 0);
