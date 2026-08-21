// Messlauf zur Zauberbalance (phase-z1-zauberbalance.md).
//
//   python3 serve.py &
//   node tools/zauber-messlauf.mjs [URL]
//
// Beantwortet eine einzige Frage: was kostet es den Spieler, aus der Distanz zu
// zaubern, statt in den Nahkampf zu gehen? Je Gegnergruppe laufen drei Proben am
// echten update() des Spiels:
//
//   Nahkampf     hinlaufen und zuschlagen
//   Funke        Abstand halten, mit der Maus zielen, den billigsten Zauber spammen
//   Kettenblitz  dasselbe mit dem Gruppenzauber
//
// Die Zeit allein sagt wenig. Die Spalte, auf die es ankommt, ist der genommene
// Schaden: stand dort ueberall eine Null, war Abstand gratis, und das war er vor
// Z1 in neun von neun Faellen.
//
// Drei Dinge faelscht der Lauf bewusst, damit er ueberhaupt misst:
// hurtPlayer zaehlt den Schaden statt ihn abzuziehen (ein Tod bricht die Schicht
// ab und baut die Welt neu), gainXP und auftragEreignis sind stillgelegt, und die
// Schichtuhr steht (sonst kehrt update() frueh zurueck, sobald kein Gegner mehr
// im 220-Pixel-Kreis steht, und friert Abklingzeit, Mana und Geschosse ein).
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const browser = await pw.chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage();
const fehler = [];
page.on('pageerror', e => fehler.push(String(e).split('\n')[0]));
await page.goto(process.argv[2] || 'http://127.0.0.1:8378/index.html', { waitUntil: 'load' });
await page.waitForTimeout(3500);

const ergebnis = await page.evaluate(() => {
  const DT = 1/60, REF = {1:[2,0],2:[2,3],3:[2,5],4:[5,10],5:[5,10],6:[5,13],7:[5,13],8:[8,17],9:[8,17],10:[8,20]};
  const ALLE = ['funke','feuerball','meteor','eissplitter','frostnova','blizzard','blitzfunke','kettenblitz','arkankugel','zeitriss'];
  startGame();
  gainXP = function(){}; auftragEreignis = function(){};
  // Die Schichtuhr steht im Messlauf still. Ohne das laeuft sie sofort ab
  // (startGame setzt shiftT nicht), und update() kehrt ab dem Moment jede Frame
  // frueh zurueck, in dem kein Gegner mehr im 220-Pixel-Kreis steht. Genau das
  // trifft den Fernkampf und nur den: eingefrorene Abklingzeit, kein Mana, keine
  // Geschossbewegung. Das ist ein Fehler der Messung, nicht des Spiels.
  CONFIG.schichtModus = false;
  let schaden = 0;
  hurtPlayer = function(raw){
    const red = Math.min(0.6, derived.armor/(derived.armor+30));
    schaden += Math.max(1, Math.round(raw * (1 - red)));
  };
  // Z2: Arena VOR dem Dorf, nicht darin. Seit M2 gilt auf der Dorfflaeche das
  // Hausrecht (Monster verlieren dort sofort die Aggro und gehen heim), und der
  // Startpunkt des Spielers liegt mitten im Dorf. Eine Messung dort misst also
  // Gegner, die gar nicht kaempfen duerfen. Die Arena wandert deshalb nach
  // Osten, bis sie hinter dem Bannguertel auf begehbarem Boden steht.
  // Und zwar auf einer LICHTUNG: ein einzelner begehbarer Punkt reicht nicht,
  // Kiter und Fernkaempfer laufen sonst in die erstbeste Baumkante und die
  // Messung misst das Gelaende statt den Gegner. Verlangt wird ein freies
  // Rechteck von 16 x 7 Kacheln.
  // 12 x 5 Kacheln, nicht groesser: eine 16 x 7-Lichtung existiert auf der
  // erzeugten Karte schlicht nirgends (nachgemessen), die Suche liefe dann bis
  // zur Ostkante ins Wasser und die Messung saehe nur noch -1/0.
  const frei = (x0, y0) => {
    for(let yy = y0 - 2; yy <= y0 + 2; yy++)
      for(let xx = x0 - 2; xx <= x0 + 9; xx++)
        if(!reachbar(xx, yy)) return false;
    return true;
  };
  let ax = Math.floor(player.x / TS), ay = Math.floor(player.y / TS), gefunden = false;
  suche: for(; ax < MW - 20; ax++)
    for(let dy = 0; dy <= 40; dy++) for(const vz of [1, -1]){
      const yy = Math.floor(player.y / TS) + dy * vz;
      if(dorfAbstand(ax, yy) >= DORF_BANN + 8 && frei(ax, yy)){ ay = yy; gefunden = true; break suche; }
    }
  if(!gefunden) console.warn('Messlauf: keine Lichtung gefunden, Arena evtl. unsauber');
  const px = ax * TS + 16, py = ay * TS + 16;

  function refBuild(stufe){
    const [affix, armor] = REF[stufe];
    player.level = stufe; player.skills = {str:stufe-1, vit:stufe-1, agi:0, int:0};
    player.equip = {weapon:{base:BASES[1], rar:1, affixes:[{k:'dmg', v:affix, def:AFFIXES[0]}], name:'R'},
      armor: armor ? {base:{t:'armor',name:'R',tier:1,armor}, rar:0, affixes:[]} : null, shield:null, boots:null};
    player.spellsKnown = {};
    for(const id of ALLE) player.spellsKnown[id] = true;
    recalc();
    player.hp = derived.maxHp; player.mana = derived.maxMana;
    player.dead = false; player.spellCd = 0; player.attackCd = 0;
  }

  function lauf(typ, n, art, zauberId){
    const d = MONDEF[typ];
    // Z2: unter der Befugnisstufe gibt es die Zauberroute schlicht nicht. Die
    // Zeile sagt das dann, statt eine bedeutungslose Zahl zu zeigen.
    if(art !== 'nah' && d.kat.stufe < ZAUBER_AB_STUFE) return {t: -2, schaden: 0};
    refBuild(d.kat.stufe);
    monsters.length = 0; enemyBolts.length = 0; projectiles.length = 0; magicEffects.length = 0;
    drops.length = 0; boss = null; state = 'play'; schaden = 0;
    player.x = px; player.y = py; mouse.moved = false;
    // Kamera mitziehen. nahAmBild() liest cam, und die Trefferpruefung der
    // Geschosse laeuft ueber nahListe: eine haengengebliebene Kamera aus dem
    // vorigen Durchgang laesst jeden Zauber ins Leere gehen.
    camSnap();
    const sp = zauberId && SPELLS.find(s => s.id === zauberId);
    for(let i = 0; i < n; i++){
      const m = makeMon(typ, px + 200 + i*22, py + (i%2 ? 18 : -18));
      m.aggro = true; m.eroeffnet = true; m.leashT = 0;
    }
    let t = 0;
    for(let i = 0; i < 60 * 60; i++){
      const leb = monsters.filter(m => !m.dead);
      if(!leb.length) return {t, schaden};
      let nah = leb[0], nd = 1e9;
      for(const m of leb){ const dd = Math.hypot(m.x-player.x, m.y-player.y); if(dd < nd){ nd = dd; nah = m; } }
      for(const m of leb) m.leashT = 0;            // Aggro haelt, sonst misst man nur die Leine
      if(art === 'nah' || art === 'mix'){
        const a = Math.atan2(nah.y - player.y, nah.x - player.x);
        if(nd > derived.range * 0.75){
          moveEnt(player, Math.cos(a) * Math.min(derived.speed*DT, nd), Math.sin(a) * Math.min(derived.speed*DT, nd));
        }
        tryAttack(a);
        // Z2, die gewollte Spielweise: der Nahkampf erarbeitet das Mana, der
        // Spruch ist der Payoff, sobald er bezahlt ist. Kein Ausweichen, kein
        // Kiten, einfach beides im selben Kampf.
        if(art === 'mix' && sp && player.mana >= sp.mana) castSpell(sp, {wx: nah.x, wy: nah.y});
      } else {
        if(nd < 180){                               // Abstand halten, wie im echten Spiel
          // Ueber moveEnt und mit derselben Zauberbremse wie im Spiel: wer die
          // Bremse im Messlauf umgeht, misst wieder den alten Zustand.
          const a = Math.atan2(player.y - nah.y, player.x - nah.x);
          const mul = player.castT > 0 ? 0.15 : 1;
          moveEnt(player, Math.cos(a) * derived.speed * mul * DT, Math.sin(a) * derived.speed * mul * DT);
        }
        castSpell(sp, {wx: nah.x, wy: nah.y});      // Maus liegt auf dem Gegner
      }
      update(DT); camSnap(); t += DT; state = 'play';
      // Kaefig: die Lichtung ist 12 x 5 Kacheln, und wer aus ihr hinausflieht
      // (Kiter, Fernkaempfer), steckt ohne Wegfindung in der ersten Baumkante
      // fest. Dann misst der Lauf das Gelaende, nicht den Gegner. Am Rand der
      // Lichtung ist Schluss, wie in einer Arena.
      for(const m of monsters) if(!m.dead){
        if(m.x < px - 60)  m.x = px - 60;
        if(m.x > px + 280) m.x = px + 280;
        if(m.y < py - 70)  m.y = py - 70;
        if(m.y > py + 70)  m.y = py + 70;
      }
      // Auch der Spieler bleibt in der Arena. Sonst zieht sich der Abstands-
      // lauf westwaerts aus dem Kaefig zurueck, waehrend die Gegner an dessen
      // Rand haengen, und die Spalte "genommener Schaden" zeigt eine Null, die
      // nichts bedeutet. In der Arena gilt: wer dauerzaubert, steht praktisch
      // (Z4-Bremse), und wer steht, wird eingeholt. Genau das soll die Messung
      // zeigen duerfen.
      if(player.x < px - 60)  player.x = px - 60;
      if(player.x > px + 280) player.x = px + 280;
      if(player.y < py - 70)  player.y = py - 70;
      if(player.y > py + 70)  player.y = py + 70;
    }
    return {t: -1, schaden};
  }

  const raus = [];
  for(const [typ, n] of [['slime',5],['goblin',4],['ablagestapel',2],['greenmage',2],
                         ['crab',2],['scorpion',2],['spider',2],['mummy',1],['stalfos',1]]){
    const nah  = lauf(typ, n, 'nah');
    const funk = lauf(typ, n, 'fern', 'funke');
    const kett = lauf(typ, n, 'fern', 'kettenblitz');
    const mixL = lauf(typ, n, 'mix', 'funke');
    raus.push({typ, n, stufe: MONDEF[typ].kat.stufe, maxHp: derived.maxHp,
      nahT:+nah.t.toFixed(1), nahS:nah.schaden, funkT:+funk.t.toFixed(1), funkS:funk.schaden,
      kettT:+kett.t.toFixed(1), kettS:kett.schaden, mixT:+mixL.t.toFixed(1), mixS:mixL.schaden});
  }
  return raus;
});

console.log('Gegner            Soll  Leiste |   Nahkampf    |  Funke aus Distanz |  Kettenblitz     |  Nahkampf+Funke');
console.log('                              |  s / Schaden  |    s / Schaden     |   s / Schaden    |   s / Schaden');
for(const r of ergebnis){
  const f=(t,s)=> t === -2 ? '  keine Befugnis' : `${String(t).padStart(5)} / ${String(s).padStart(4)}`;
  console.log(`${(r.typ+' x'+r.n).padEnd(17)} ${String(r.stufe).padEnd(4)} ${String(r.maxHp).padStart(4)}   | ${f(r.nahT,r.nahS)}  |   ${f(r.funkT,r.funkS)}    |  ${f(r.kettT,r.kettS)}   |  ${f(r.mixT,r.mixS)}`);
}
if(fehler.length) console.log('(Seitenfehler:', fehler[0] + ' — fehlende Grafik, vor dieser Phase vorhanden)');
await browser.close();
