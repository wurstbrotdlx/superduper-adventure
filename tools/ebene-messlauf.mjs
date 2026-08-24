// Messlauf zu Bauabschnitt M4 (phase-m4-zweite-ebene.md).
//
//   python3 serve.py &
//   node tools/ebene-messlauf.mjs [Laeufe] [URL]
//
// Die Welt-Erweiterung vom 24.08. hat die zweite Ebene als "Bauabschnitt mit
// Messlauf" ausgegeben, und zwar aus einem bestimmten Grund: die Schichtuhr ist
// das Spannungsmittel dieses Spiels, und eine Kammer, die laenger dauert, ist
// eine Kammer weniger je Schicht. KAMMER-MESSUNG-2026-08-20 rechnet den
// Bankzufluss aus genau dieser Groesse.
//
// Gemessen wird deshalb an wirklich gebauten Kammern statt an der Tabelle:
// Raeume, Raetselraeume, Waechter, deren Lebenssumme (der ehrlichste Anteil der
// Kammerzeit, den man ohne einen spielenden Menschen messen kann), das
// ausgezahlte Gold und die Zahl der Zutaten — je einmal fuer die obere und
// einmal fuer die untere Ebene derselben Kammer.
//
// Was der Lauf NICHT misst, ist die Raetselzeit. Die haengt am Menschen vor dem
// Bildschirm; KAMMER-MESSUNG hat sie deshalb als Parameter gefuehrt (180 s und
// 120 s) statt sie zu behaupten, und dieser Lauf haelt es genauso: er liefert
// die Zahl der Raetselraeume, mit der man sie hochrechnet.
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const { chromium } = pw;

const LAEUFE = parseInt(process.argv[2] || '40', 10);
const URL = process.argv[3] || 'http://127.0.0.1:8378/index.html';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

await page.goto(URL, { waitUntil: 'load' });
await page.waitForFunction(() => assetsReady === true, null, { timeout: 30000 });
await page.evaluate(() => startGame());
await page.waitForTimeout(300);
await page.evaluate(() => { if(typeof szeneAktiv !== 'undefined' && szeneAktiv === 'empfang') empfangUeberspringen(); });
await page.waitForTimeout(200);
for(let i = 0; i < 60; i++){
  const offen = await page.evaluate(() => document.getElementById('overlay').style.display === 'flex');
  if(!offen) break;
  const b = page.locator('#overlay button').last();
  if(await b.count() === 0) break;
  await b.click({ force: true });
  await page.waitForTimeout(150);
}

const roh = await page.evaluate(async n => {
  const zeilen = [];
  const stand = () => {
    const mon = monsters.filter(m => !m.dead);
    return {raeume: kammer.raeume.length, mods: kammer.mods.length,
            waechter: mon.length, hp: mon.reduce((s, m) => s + m.maxHp, 0),
            waechterOhneBoss: mon.filter(m => m.type !== 'bossgeneric').length};
  };
  const beutel = () => player.pouch.reduce((s, z) => s + z.count, 0);
  for(let i = 0; i < n; i++){
    if(kammer) verlasseKammer();
    const t = kammerTueren[i % kammerTueren.length];
    t.diff = 5; t.tier = 4; t.cd = 0;
    betreteKammer(t);
    const oben = stand();
    let g0 = player.gold, z0 = beutel();
    player.x = kammer.truhe.x; player.y = kammer.truhe.y;
    truheOeffnen();
    oben.gold = player.gold - g0; oben.zutaten = beutel() - z0;

    player.x = kammer.abstieg.x; player.y = kammer.abstieg.y;
    steigeAb();
    const unten = stand();
    g0 = player.gold; z0 = beutel();
    player.x = kammer.truhe.x; player.y = kammer.truhe.y;
    truheOeffnen();
    unten.gold = player.gold - g0; unten.zutaten = beutel() - z0;
    zeilen.push({oben, unten});
  }
  if(kammer) verlasseKammer();
  return zeilen;
}, LAEUFE);

await browser.close();

const mit = (f, w) => (roh.reduce((s, r) => s + f(r[w]), 0) / roh.length);
const zeile = (name, f) => {
  const o = mit(f, 'oben'), u = mit(f, 'unten');
  const q = o === 0 ? (u === 0 ? '0 %' : '—') : ((u / o) * 100).toFixed(0) + ' %';
  return `${name.padEnd(30)} ${o.toFixed(1).padStart(8)} ${u.toFixed(1).padStart(8)} ${q.padStart(9)}`;
};

console.log(`Kammern gemessen: ${roh.length}, alle Gebuehrenbescheid 5 (die Sperrablage)\n`);
console.log(`${''.padEnd(30)} ${'oben'.padStart(8)} ${'unten'.padStart(8)} ${'unten/oben'.padStart(9)}`);
console.log('-'.repeat(59));
console.log(zeile('Raeume', r => r.raeume));
console.log(zeile('Raetselraeume', r => r.mods));
console.log(zeile('Waechter (mit Altem Schrecken)', r => r.waechter));
console.log(zeile('Waechter (ohne)', r => r.waechterOhneBoss));
console.log(zeile('Lebenssumme der Waechter', r => r.hp));
console.log(zeile('Gold aus der Truhe', r => r.gold));
console.log(zeile('Zutaten aus der Truhe', r => r.zutaten));
console.log('');
const goldU = mit(r => r.gold, 'unten');
console.log(goldU === 0
  ? 'Der Goldkanal ist unveraendert: die untere Truhe zahlt in keinem Lauf ein einziges Gold.'
  : `ACHTUNG: die untere Truhe hat im Mittel ${goldU.toFixed(1)} Gold ausgezahlt — das greift in die Schichtoekonomie ein.`);
process.exit(goldU === 0 ? 0 : 1);
