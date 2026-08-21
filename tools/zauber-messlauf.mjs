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
  const px = player.x, py = player.y;

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
      if(art === 'nah'){
        const a = Math.atan2(nah.y - player.y, nah.x - player.x);
        if(nd > derived.range * 0.75){
          moveEnt(player, Math.cos(a) * Math.min(derived.speed*DT, nd), Math.sin(a) * Math.min(derived.speed*DT, nd));
        }
        tryAttack(a);
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
    }
    return {t: -1, schaden};
  }

  const raus = [];
  for(const [typ, n] of [['slime',5],['goblin',4],['ablagestapel',2],['greenmage',2],
                         ['crab',2],['scorpion',2],['spider',2],['mummy',1],['stalfos',1]]){
    const nah  = lauf(typ, n, 'nah');
    const funk = lauf(typ, n, 'fern', 'funke');
    const kett = lauf(typ, n, 'fern', 'kettenblitz');
    raus.push({typ, n, stufe: MONDEF[typ].kat.stufe, maxHp: derived.maxHp,
      nahT:+nah.t.toFixed(1), nahS:nah.schaden, funkT:+funk.t.toFixed(1), funkS:funk.schaden,
      kettT:+kett.t.toFixed(1), kettS:kett.schaden});
  }
  return raus;
});

console.log('Gegner            Soll  Leiste |   Nahkampf    |  Funke aus Distanz |  Kettenblitz');
console.log('                              |  s / Schaden  |    s / Schaden     |   s / Schaden');
for(const r of ergebnis){
  const f=(t,s)=>`${String(t).padStart(5)} / ${String(s).padStart(4)}`;
  console.log(`${(r.typ+' x'+r.n).padEnd(17)} ${String(r.stufe).padEnd(4)} ${String(r.maxHp).padStart(4)}   | ${f(r.nahT,r.nahS)}  |   ${f(r.funkT,r.funkS)}    |  ${f(r.kettT,r.kettS)}`);
}
if(fehler.length) console.log('(Seitenfehler:', fehler[0] + ' — fehlende Grafik, vor dieser Phase vorhanden)');
await browser.close();
