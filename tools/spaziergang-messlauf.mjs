// Spaziergang aus dem Dorf (Phase M2).
//
//   python3 serve.py &
//   node tools/spaziergang-messlauf.mjs [Sekunden] [URL]
//
// Die anderen Messlaeufe stellen je einen Gegner neben den Referenzspieler.
// Dieser hier tut das Gegenteil: er setzt eine frische Stufe 1 an den echten
// Startpunkt und laesst sie in der echten Welt losgehen, immer auf den
// naechsten sichtbaren Gegner zu. Gemessen wird der Verlauf einer Schicht:
// wann faellt der erste Gegner, wie viele in drei Minuten, welche Stufe steht
// am Ende, und wie oft war es knapp.
//
// Das beantwortet die Frage, die keine Einzelmessung beantworten kann: fuehlt
// sich der Anfang gut an oder frustrierend. Ein Spaziergang, der 40 Sekunden
// nach dem ersten Gegner sucht, ist genauso ein Befund wie einer, der in der
// zweiten Minute stirbt.
const SEK = Number(process.argv[2] || 180);
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const browser = await pw.chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage();
const fehler = [];
page.on('pageerror', e => fehler.push(String(e).slice(0, 200)));
await page.goto(process.argv[3] || 'http://127.0.0.1:8378/index.html', { waitUntil: 'load' });
await page.waitForTimeout(3500);

const lauf = await page.evaluate((SEK) => {
  const DT = 1/60;
  startGame();
  // Gleiche Stilllegungen wie im Monster-Messlauf: die Schichtuhr steht nach
  // startGame() bereits abgelaufen da und wuerde update() frueh abbrechen,
  // und der Dienstauftrag ist fuer eine Messung nur Rauschen. Stufenaufstiege
  // bleiben AN, sie sind hier gerade der Messwert.
  CONFIG.schichtModus = false;
  auftragEreignis = function(){};
  camSnap();

  const anfang = {x: player.x, y: player.y};
  const getroffen = {}, erstKill = {};
  let kills = 0, ersterKillT = -1, schadenSumme = 0, tiefstesLeben = 1, gestorben = -1;
  let eliteGesehen = 0, eliteGetoetet = 0;
  const echterHurt = hurtPlayer;
  hurtPlayer = function(raw){ const vor = player.hp; echterHurt(raw); schadenSumme += Math.max(0, vor - player.hp); };
  const echterKill = killMon;
  killMon = function(m){
    kills++;
    if(ersterKillT < 0) ersterKillT = t;
    getroffen[m.type] = (getroffen[m.type] || 0) + 1;
    if(erstKill[m.type] === undefined) erstKill[m.type] = Math.round(t);
    if(m.elite) eliteGetoetet++;
    return echterKill(m);
  };

  let t = 0, ziel = null;
  for(let i = 0; i < 60 * SEK; i++){
    if(player.dead || player.hp <= 0){ gestorben = t; break; }
    // Ziel: der naechste lebende Gegner in Sichtweite. Kein Aussuchen nach
    // Schwierigkeit — der Lauf soll nehmen, was ihm begegnet.
    if(!ziel || ziel.dead) ziel = pickTarget('near', 900);
    if(ziel){
      const dx = ziel.x - player.x, dy = ziel.y - player.y;
      const a = Math.atan2(dy, dx), dd = Math.hypot(dx, dy);
      if(dd > derived.range * 0.7){
        player.x += Math.cos(a) * Math.min(derived.speed * DT, dd);
        player.y += Math.sin(a) * Math.min(derived.speed * DT, dd);
      }
      tryAttack(a);
    } else {
      player.x += derived.speed * DT;             // niemand da: weiter nach Osten
    }
    if(player.potions > 0 && player.hp < derived.maxHp * 0.35) drinkPotion();
    update(DT); camSnap(); state = 'play';
    tiefstesLeben = Math.min(tiefstesLeben, player.hp / derived.maxHp);
    t += DT;
  }
  for(const m of monsters) if(m.elite && Math.hypot(m.x-anfang.x, m.y-anfang.y) < 60*TS) eliteGesehen++;
  hurtPlayer = echterHurt; killMon = echterKill;
  return {t: Math.round(t), kills, ersterKillT: +ersterKillT.toFixed(1), gestorben,
          stufe: player.level, xp: Math.round(player.xp), gold: player.gold,
          schaden: Math.round(schadenSumme), leben: Math.round(player.hp) + '/' + derived.maxHp,
          tiefstes: Math.round(tiefstesLeben*100) + '%',
          weite: Math.round(Math.hypot(player.x-anfang.x, player.y-anfang.y)/TS),
          eliteImRing: eliteGesehen, eliteGetoetet,
          arten: Object.entries(getroffen).sort((a,b)=>b[1]-a[1]).map(([k,v]) => `${MONDEF[k].name} ${v}x (ab ${erstKill[k]} s)`)};
}, SEK);

console.log(`Spaziergang ueber ${lauf.t} s, ${lauf.weite} Kacheln vom Start entfernt geendet.`);
console.log(`  erster Kill nach   ${lauf.ersterKillT} s`);
console.log(`  Kills gesamt       ${lauf.kills}  (davon Sonderpruefer ${lauf.eliteGetoetet})`);
console.log(`  Stufe am Ende      ${lauf.stufe}   Gold ${lauf.gold}`);
console.log(`  Leben am Ende      ${lauf.leben}, tiefster Stand ${lauf.tiefstes}, Schaden gesamt ${lauf.schaden}`);
console.log(`  gestorben          ${lauf.gestorben < 0 ? 'nein' : 'ja, nach ' + Math.round(lauf.gestorben) + ' s'}`);
console.log(`  Sonderpruefer im Umkreis von 60 Kacheln um den Start: ${lauf.eliteImRing}`);
console.log('  getroffene Arten:');
for(const a of lauf.arten) console.log('    ' + a);
if(fehler.length) console.log('\n(Seitenfehler: ' + fehler[0] + ' — fehlende Grafik, vor dieser Phase vorhanden)');
await browser.close();
