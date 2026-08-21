// Messlauf zur Zonenstaffel (Phase M2, s. phase-m2-nahfeld-und-namen.md).
//
//   python3 serve.py &
//   node tools/nahfeld-messlauf.mjs [URL]
//
// Beantwortet die eine Frage, an der die Staffel haengt: WAS steht in welcher
// Entfernung vom Dorf. Gemessen wird an der wirklich gesetzten Bevoelkerung
// (monsters nach placeMonsters), nicht an der Absicht in den Konstanten.
//
// Ausgegeben je Zone: Zahl der Gegner, Dichte je 100 begehbaren Kacheln, die
// Verteilung ueber die Ertragsklassen und die Sonderpruefer. Eine Zone 0, in
// der ein A3 steht, ist ein Fehler und faellt hier sofort auf.
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const browser = await pw.chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage();
const fehler = [];
page.on('pageerror', e => fehler.push(String(e).slice(0, 200)));
await page.goto(process.argv[2] || 'http://127.0.0.1:8378/index.html', { waitUntil: 'load' });
await page.waitForTimeout(3500);

const mess = await page.evaluate(() => {
  const ZONE = ['Nahfeld', 'Uebergang', 'Ferne'];
  const zonen = ZONE.map(() => ({n: 0, kacheln: 0, klassen: {}, elite: 0, typen: {}}));
  // Begehbare Kacheln je Zone: ohne sie waere die Dichte nicht vergleichbar,
  // das Nahfeld ist ja nur ein Prozent der Kartenflaeche.
  for(let ty = 0; ty < MH; ty++)
    for(let tx = 0; tx < MW; tx++)
      if(reachbar(tx, ty) && !nahDorf(tx, ty)) zonen[zoneVon(tx, ty)].kacheln++;
  for(const m of monsters){
    const z = zonen[zoneVon((m.x/TS)|0, (m.y/TS)|0)];
    z.n++;
    if(m.elite) z.elite++;
    const k = katKlasse(m.type) || 'ohne Katalog';
    z.klassen[k] = (z.klassen[k] || 0) + 1;
    z.typen[m.type] = (z.typen[m.type] || 0) + 1;
  }
  // Was der Spieler auf den ersten Schritten trifft: der naechstgelegene Gegner
  // und die fuenf naechsten, mit ihrer Sollkampfzeit aus dem Katalog.
  const mitAbstand = monsters.map(m => ({
      typ: m.type, name: m.def.name, elite: m.elite || null,
      d: Math.round(Math.hypot(m.x - SPAWN.x, m.y - SPAWN.y) / TS),
      kl: (m.def.kat && m.def.kat.klasse) || '-' }))
    .sort((a, b) => a.d - b.d).slice(0, 8);
  return {zonen: ZONE.map((t, i) => ({zone: t, ...zonen[i]})), gesamt: monsters.length, erste: mitAbstand,
          grenzen: {bann: DORF_BANN, nah: NAHFELD_R, ueberg: UEBERG_R, soll: NAHFELD_SOLL, welt: ZIEL_MOBS}};
});

const g = mess.grenzen;
console.log(`Grenzen: Bann ${g.bann}, Nahfeld bis ${g.nah}, Uebergang bis ${g.ueberg} Kacheln`);
console.log(`Soll: ${g.soll} im Nahfeld plus ${g.welt} ueber der Karte, gesetzt ${mess.gesamt}\n`);
console.log('Zone        Gegner  Kacheln  je 100 Kacheln  Sonderpruefer  Ertragsklassen');
for(const z of mess.zonen){
  const dichte = z.kacheln ? (z.n / z.kacheln * 100).toFixed(2) : '-';
  const kl = Object.entries(z.klassen).sort().map(([k, v]) => `${k} ${v}`).join(', ');
  console.log(`${z.zone.padEnd(11)} ${String(z.n).padStart(5)} ${String(z.kacheln).padStart(8)} ${dichte.padStart(15)} ${String(z.elite).padStart(14)}  ${kl}`);
}
console.log('\nDie acht Gegner, die dem Startpunkt am naechsten stehen:');
for(const e of mess.erste)
  console.log(`  ${String(e.d).padStart(3)} Kacheln  ${e.kl}  ${e.elite ? e.elite + ' (' + e.name + ')' : e.name}`);
if(fehler.length) console.log('\n(Seitenfehler: ' + fehler[0] + ' — fehlende Grafik, vor dieser Phase vorhanden)');
await browser.close();
