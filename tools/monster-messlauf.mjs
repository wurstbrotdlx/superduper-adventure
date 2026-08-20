// Messlauf zum Monsterkatalog (monsterkatalog-stufe-1-10.md).
//
//   python3 serve.py &
//   node tools/monster-messlauf.mjs [URL]
//
// Braucht Playwright und einen Chromium. Der Lauf startet das Spiel, baut je
// Gegner den Referenzspieler seiner Sollstufe und misst zweierlei am echten
// update() des Spiels, nicht an einer Nachrechnung:
//
//   Kampfzeit   wie lange der Referenzspieler braucht, bis der Gegner faellt
//   Ueberleben  wie lange der Gegner braucht, bis eine volle Lebensleiste weg
//               waere, wenn der Spieler nur dasteht
//
// Drei Laeufe je Gegner und Richtung, Mittelwert. Kurze Kaempfe schwanken sonst
// um einen ganzen Treffer, und ein Einzelwert waere dann kein Messwert, sondern
// ein Wuerfelwurf. Der Lauf faelscht drei Dinge bewusst: hurtPlayer zaehlt den
// Schaden, statt ihn abzuziehen (der Tod wuerde die Schicht abbrechen und die
// Welt neu bauen), gainXP und auftragEreignis sind stillgelegt (Stufenaufstiege
// und Dienstauftraege sind fuer eine Messung nur Rauschen).
//
// Ohne die lizenzierte Grafik startet das Spiel seine eigene Schleife nie, es
// wartet auf assetsReady. Der Lauf ruft update() deshalb selbst und mit festem
// Zeitschritt. Das ist zugleich der Grund, warum er schnell ist: achtzig
// Kampfsekunden kosten keine achtzig Wartesekunden.
// Playwright wird dynamisch geladen, damit der Lauf auch dort geht, wo das Paket
// global statt im Projekt liegt: PLAYWRIGHT_PFAD zeigt dann auf dessen index.js.
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const { chromium } = pw;

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage();
const fehler = [];
page.on('pageerror', e => fehler.push(String(e).slice(0, 200)));
const URL = process.argv[2] || 'http://127.0.0.1:8378/index.html';
await page.goto(URL, { waitUntil: 'load' });
await page.waitForTimeout(3500);

const ergebnis = await page.evaluate(() => {
  const raus = [];
  const REF = {1:[2,0],2:[2,3],3:[2,5],4:[5,10],5:[5,10],6:[5,13],7:[5,13],8:[8,17],9:[8,17],10:[8,20]};
  const DT = 1/60;

  function refBuild(stufe){
    const [affix, armor] = REF[stufe];
    player.level = stufe;
    player.skills = {str: stufe-1, vit: stufe-1, agi:0, int:0};
    player.equip = {
      weapon: {base: BASES[1], rar:1, affixes:[{k:'dmg', v:affix, def:AFFIXES[0]}], name:'Referenzklinge'},
      armor: armor ? {base:{t:'armor', name:'Referenzpanzer', tier:1, armor}, rar:0, affixes:[]} : null,
      shield:null, boots:null };
    recalc();
    player.hp = derived.maxHp; player.mana = derived.maxMana; player.dead = false;
  }

  startGame();
  const px = player.x, py = player.y;

  // Der Tod wuerde die Schicht abbrechen und die Welt neu bauen, danach misst
  // der naechste Lauf Unsinn. Deshalb wird hurtPlayer eingeklinkt: der Schaden
  // wird gezaehlt und danach zurueckgegeben. Gemessen wird also, wie lange es
  // dauert, bis eine volle Leiste weg WAERE.
  // Der Tod wuerde die Schicht abbrechen und die Welt neu bauen, danach maesse der
  // naechste Lauf Unsinn. Deshalb wird hurtPlayer ersetzt: der Schaden wird nach
  // derselben Ruestungsformel gerechnet wie im Spiel, aber nur gezaehlt, nicht
  // abgezogen. Gemessen wird, wann eine volle Leiste weg WAERE.
  // Der Messlauf toetet dutzende Monster. Im Spiel haengt daran eine ganze Kette:
  // Stufenaufstieg, Schichtzaehler, Dienstauftrag, und irgendwann ein
  // Schichtende, das die Welt neu baut. Fuer eine Messung ist das Rauschen,
  // deshalb werden die beiden Trichter stillgelegt.
  gainXP = function(){};
  auftragEreignis = function(){};
  let schaden = 0;
  hurtPlayer = function(raw){
    const red = Math.min(0.6, derived.armor / (derived.armor + 30));
    schaden += Math.max(1, Math.round(raw * (1 - red)));
  };

  function kampf(typ, angreifen){
    const d = MONDEF[typ];
    refBuild(d.kat.stufe);
    monsters.length = 0; enemyBolts.length = 0; drops.length = 0; boss = null;
    player.x = px; player.y = py;
    player.attackCd = 0; player.langsamT = 0; player.haltT = 0; player.trankSperreT = 0;
    state = 'play'; schaden = 0;
    const voll = derived.maxHp;
    const m = makeMon(typ, px + (angreifen ? 34 : Math.min(22, d.atkRange - 4)), py);
    m.aggro = true; m.eroeffnet = true; m.leashT = 0;
    let t = 0;
    for(let i = 0; i < 60 * 80; i++){
      if(angreifen){
        if(m.dead) return {t};
        const dx = m.x - player.x, dy = m.y - player.y;
        const a = Math.atan2(dy, dx), dd = Math.hypot(dx, dy);
        if(dd > derived.range * 0.75){            // dem Kiter nachgehen, sonst misst man seine Flucht
          player.x += Math.cos(a) * Math.min(derived.speed * DT, dd);
          player.y += Math.sin(a) * Math.min(derived.speed * DT, dd);
        }
        tryAttack(a);
      } else {
        if(schaden >= voll) return {t, voll, armor: derived.armor, level: player.level, schaden};
        player.x = px; player.y = py;              // stehen bleiben, nicht ausweichen
      }
      update(DT); t += DT;
      state = 'play';
    }
    return {t: -1};
  }

  for(const typ in MONDEF){
    const d = MONDEF[typ];
    if(!d.kat) continue;
    if(d.kat.route !== 'physisch') continue;      // Zauberrouten misst der Guard, nicht dieser Lauf
    let ta = 0, tb = 0, letzte = null;
    const N = 3;
    // Ein Lauf, der in die Obergrenze laeuft, ist keine Messung, sondern ein
    // Aussetzer der Messschleife (die Kamera hat den Sprung des Spielers noch
    // nicht eingeholt, das Monster schlaeft). Solche Laeufe zaehlen nicht mit,
    // die Zahl der gueltigen Laeufe steht in der Ausgabe.
    const einzeln = [];
    let na = 0, nb = 0;
    for(let i = 0; i < N; i++){
      const A = kampf(typ, true), B = kampf(typ, false);
      if(A.t > 0){ ta += A.t; na++; }
      if(B.t > 0){ tb += B.t; nb++; }
      einzeln.push([+A.t.toFixed(1), +B.t.toFixed(1)]);
    }
    const a = {t: na ? ta / na : -1}, b = {t: nb ? tb / nb : -1};
    refBuild(d.kat.stufe);
    const dmgAvg = (d.dmg[0]+d.dmg[1])/2;
    const mind = Math.min(0.6, derived.armor/(derived.armor+30));
    const dps = ((derived.dmgMin+derived.dmgMax)/2)*(1+derived.crit*0.7)*derived.aps;
    raus.push({typ, klasse:d.kat.klasse, stufe:d.kat.stufe,
      ttkIst:+a.t.toFixed(1),
      ttkSoll:+(d.hp/(1-(d.res[d.kat.route]||0))/dps).toFixed(1),
      lebenIst:+b.t.toFixed(1),
      lebenSoll:+(derived.maxHp/(dmgAvg*(1-mind)/d.atkCd)).toFixed(1),
      laeufe: na + '/' + nb, pruef: einzeln});
  }
  return raus;
});

console.log('Typ                Kl  Soll   TTK ist/soll        Ueberleben ohne Gegenwehr ist/soll   Laeufe');
for(const r of ergebnis)
  console.log(`${r.typ.padEnd(18)} ${r.klasse}  ${String(r.stufe).padEnd(4)} ${String(r.ttkIst).padStart(6)} / ${String(r.ttkSoll).padStart(5)} s   ${String(r.lebenIst).padStart(6)} / ${String(r.lebenSoll).padStart(5)} s   ${r.laeufe}`);
for(const r of ergebnis) if(r.pruef) console.log('   ', r.typ, JSON.stringify(r.pruef));
if(fehler.length) console.log('SEITENFEHLER:', fehler.slice(0,3));
await browser.close();
