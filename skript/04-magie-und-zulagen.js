// skript/04-magie-und-zulagen.js - Teil 4 von 7 des einen Spielskripts.
// Inhalt: Zauberbefugnis, Zulagen-Maschine, Angriffe mit Vorwarnung, Kammern mit Preisschild, Knoeterich.
//
// Mechanisch an gemessenen Kanten geschnitten: nichts umgezogen, nichts
// umbenannt, nichts umgeschrieben. Klassische Skriptdateien teilen sich EINE
// globale lexikalische Umgebung, deshalb ist die Reihenfolge der Tags in
// index.html Programmtext und keine Sortierung. Wer eine Datei dazwischen
// haengt oder die Reihenfolge dreht, aendert das Programm.
//
// Kein Wort dieser Datei darf ein schliessendes script-Tag enthalten, auch
// nicht im Kommentar: build-single.mjs backt alle sieben in EINEN Block, und
// dort beendet diese Zeichenfolge das Skript mitten im Satz. Der Build prueft
// das und bricht ab, damit es nicht erst im Browser auffaellt.
//
// 'use strict' gilt pro Datei, nicht pro Seite, darum steht es in jeder erneut.
// Beim Ruecklauf in EINEN Block (tools/build-single.mjs) sind die Wiederholungen
// wirkungslose String-Literale.
'use strict';
// --- Ab hier unveraendert aus index.html geschnitten (Teilung vom 29.08.2026). ---
// ===================== MAGIE-SYSTEM =====================
// Zauberbaum: 3 Zweige (Feuer/Frost/Arkan) + finaler Ultimate-Spruch (#11),
// der erst freischaltbar ist, wenn alle 10 anderen gelernt sind.
const SPELL_BRANCHES = ['🔥 Feuer', '❄️ Frost', '⚡ Arkan'];
// === Z2: Die Zauberbefugnis =================================================
// Spielbericht nach Z1: Zauber waren immer noch der Ersatz fuer den Nahkampf,
// nicht seine Ergaenzung — "Rennen und Spammen". Der strukturelle Grund: Mana
// regenerierte PASSIV mit 8 je Sekunde, Wegrennen wurde also bezahlt. Z2 dreht
// die Oekonomie um: Mana entsteht bei der Arbeit, nicht beim Warten.
//   * Zauber sind eine BEFUGNIS. Das Amt erteilt sie ab Stufe 4, vorher gibt
//     es keinen Zauberpunkt (gainXP, startShift) und keine Freischaltung
//     (spellUnlockable, castSpell — doppelt gesperrt, denn wiederAssert und
//     monsterAssert setzen player.level in ihren Testpfaden frei um).
//   * Die passive Regeneration faellt von 8 auf 2 je Sekunde.
//   * Jeder Waffenschwung, der mindestens einen Gegner trifft, laedt
//     MANA_JE_TREFFER — einmal je Schwung, nicht je Getroffenem, sonst waere
//     ein Cleave durch fuenf Chuchus ein Manabrunnen. 1,3 Schwuenge je Sekunde
//     ergeben so rund 7,2 Mana je Sekunde IM Kampf (nahe den alten 8) und 2
//     auf der Flucht. Kiten hungert die Leiste aus, genau das ist der Zweck.
const ZAUBER_AB_STUFE  = 4;   // Zauberbefugnis: erster Punkt beim Aufstieg auf diese Stufe
const MANA_REGEN       = 2;   // passiv je Sekunde, vor Z2: 8
const MANA_JE_TREFFER  = 4;   // je Waffenschwung mit mindestens einem Treffer
// S1: Die Zauberpreise. Z1 hat den Spam langsamer gemacht, Z2 hat ihm die
// geschenkte Quelle genommen — und beide Male blieb der Preis derselbe. Der
// Spielbericht danach sagt weiter, dass Magie zu maechtig ist, und er hat
// recht: fuenf Mana fuer sechzehn Schaden war bei 7,2 erarbeiteten Mana je
// Kampfsekunde eine zweite, kostenlose Waffe.
//
// Jetzt kostet jeder Spruch das Zweieinhalbfache und traegt ein Viertel mehr.
// Unterm Strich leistet Dauerzauber knapp die Haelfte von vorher (der Katalog
// rechnet das ueber KAT_ZAUBER_DPS mit, s. dort), aber der einzelne Spruch
// wiegt schwerer. Zusammen mit dem kleineren Grundpool (MANA_BASIS 26 statt 40)
// heisst das: auf Stufe 4 traegt der volle Pool genau zwei Funken. Wer mehr
// zaubern will, geht in den Nahkampf oder steigert Amtskunde. Beides ist eine
// Entscheidung, und genau die hat vorher gefehlt.
const SPELLS = [
  // Feuer-Zweig
  {id:'funke',       name:'Funke',        icon:'🔥', branch:0, tier:0, mana:12, type:'bolt',       dmg:20, color:'#ffd54a', speed:440, r:6,  req:[], desc:'Schneller Feuerpfeil.'},
  {id:'feuerball',   name:'Feuerball',    icon:'🔥', branch:0, tier:1, mana:36, type:'bolt',       dmg:55, color:'#ff9f4a', speed:340, r:9,  aoe:48, req:['funke'], desc:'Explodiert beim Einschlag.'},
  {id:'meteor',      name:'Meteor',       icon:'☄️', branch:0, tier:2, mana:84, type:'aoe_target', dmg:120, color:'#ff6a2a', radius:95, req:['feuerball'], desc:'Einschlag auf Mausposition.'},
  // Frost-Zweig
  {id:'eissplitter', name:'Eissplitter',  icon:'❄️', branch:1, tier:0, mana:14, type:'bolt',       dmg:18, color:'#7ad6ff', speed:480, r:6,  slow:1.5, req:[], desc:'Verlangsamt das Ziel.'},
  {id:'frostnova',   name:'Frostnova',    icon:'❄️', branch:1, tier:1, mana:48, type:'nova',       dmg:43, color:'#7ad6ff', radius:150, slow:2.5, req:['eissplitter'], desc:'Eiswelle rund um dich.'},
  {id:'blizzard',    name:'Blizzard',     icon:'🌨️', branch:1, tier:2, mana:96, type:'aoe_target', dmg:90, color:'#bfefff', radius:135, slow:3, req:['frostnova'], desc:'Eissturm auf Mausposition.'},
  // Arkan-Zweig
  {id:'blitzfunke',  name:'Blitzfunke',   icon:'⚡', branch:2, tier:0, mana:14, type:'bolt',       dmg:23, color:'#c77dff', speed:560, r:6,  req:[], desc:'Sehr schneller Blitzpfeil.'},
  {id:'kettenblitz', name:'Kettenblitz',  icon:'⚡', branch:2, tier:1, mana:53, type:'chain',      dmg:48, color:'#c77dff', chain:5, range:270, req:['blitzfunke'], desc:'Springt zu 5 Gegnern.'},
  {id:'arkankugel',  name:'Arkankugel',   icon:'🔮', branch:2, tier:2, mana:72, type:'bolt',       dmg:98, color:'#e08fff', speed:260, r:12, aoe:44, req:['kettenblitz'], desc:'Langsame, wuchtige Kugel.'},
  {id:'zeitriss',    name:'Zeitriss',     icon:'🕳️', branch:2, tier:3, mana:60, type:'slow_field', dmg:28, color:'#9a5cff', radius:210, slow:4, req:['arkankugel'], desc:'Verlangsamt alle in Reichweite.'},
  // Ultimate #11
  {id:'konfetti',    name:'Konfetti-Kataklysmus des jüngsten Gerichts', icon:'🎉', branch:1, tier:4, mana:120, type:'ultimate', dmg:560, color:'#ffffff',
   req:['funke','feuerball','meteor','eissplitter','frostnova','blizzard','blitzfunke','kettenblitz','arkankugel','zeitriss'], ultimate:true,
   desc:'Zerlegt ALLES auf dem Bildschirm in buntes Konfetti.'},
];
let activeSpellId = null;      // aktuell gewählter Spruch (E)
let activeSpell = null;        // R6/F32: derselbe Spruch als Objekt, gesetzt an denselben
                               // zwei Stellen wie die Id — updateHUD() suchte ihn bisher
                               // pro Frame linear in SPELLS, obwohl er sich nur bei
                               // Nutzeraktion ändert.
let spellTreeOpen = false;

function spellKnown(id){ return !!player.spellsKnown[id]; }
function spellUnlockable(sp){
  if(player.level < ZAUBER_AB_STUFE) return false;              // Z2: Befugnis fehlt
  if(spellKnown(sp.id) || player.spellPoints <= 0) return false;
  return sp.req.every(spellKnown);
}
function unlockSpell(sp){
  if(!spellUnlockable(sp)) return;
  player.spellPoints--; player.spellsKnown[sp.id] = true;
  if(!sp.ultimate && !activeSpellId){ activeSpellId = sp.id; activeSpell = sp; }
  sfx.level();
  floaters.push({x:player.x, y:player.y-40, txt:'Gelernt: '+sp.name, col:'#c77dff', t:1.6, big:true});
  renderSpellTree(); updateHUD();
}
function selectSpell(id){
  if(!spellKnown(id)) return;
  const sp = SPELLS.find(s=>s.id===id);
  if(sp.ultimate) return; // Ultimate immer auf R
  activeSpellId = id; activeSpell = sp; renderSpellTree(); updateHUD();
}

function castActiveSpell(){ const sp = SPELLS.find(s=>s.id===activeSpellId); if(sp) castSpell(sp); }

function toggleSpellTree(){
  spellTreeOpen = !spellTreeOpen;
  document.getElementById('spellTree').style.display = spellTreeOpen ? 'flex' : 'none';   // U8: .grossFenster ist eine Spalte
  if(spellTreeOpen){ grossfensterRaeumen('spellTree'); gfBandZeichnen(); renderSpellTree(); knIdleT = 0; }
  panelSicht();   // U1
  MUS.muffle();   // offenes Panel dämpft die Musik
}

function spellNodeHTML(sp){
  const known = spellKnown(sp.id);
  const canUnlock = spellUnlockable(sp);
  const cls = known ? ('spellNode known' + (activeSpellId===sp.id?' active':'')) : (canUnlock ? 'spellNode unlockable' : 'spellNode locked');
  return `<div class="${cls}" data-id="${sp.id}">
    <div class="sIcon">${sp.icon}</div>
    <div class="sName">${sp.name}</div>
    <div class="sDesc">${sp.desc}</div>
    <div class="sMana">${sp.mana} Mana${poolWarnung(sp)}${known?(activeSpellId===sp.id?' · aktiv':' · wählen'):''}</div>
  </div>`;
}

// S1: Ein Spruch, der teurer ist als der ganze Pool, laesst sich lernen und
// danach nie wirken. Vorher konnte das nicht passieren (40 Grundmana gegen 5
// bis 100 Kosten), jetzt schon — und der Baum sagt es, bevor der Punkt weg ist.
// Die Antwort darauf steht im Inventar und heisst Amtskunde.
function poolWarnung(sp){
  return derived.maxMana < sp.mana ? ` · Pool ${derived.maxMana}, zu klein` : '';
}

function renderSpellTree(){
  document.getElementById('spellPtsCount').innerText = player.spellPoints;
  const cols = document.getElementById('spellCols'); cols.innerHTML = '';
  // Z2: unter der Befugnisstufe bleibt der Baum zum Stoebern offen, sagt aber
  // in einer Zeile, warum nichts waehlbar ist. Kein eigener Zustand, die Zeile
  // haengt am selben Vergleich wie die Sperre selbst.
  const alt = document.getElementById('zauberBefugnisHinweis');
  if(alt) alt.remove();
  if(player.level < ZAUBER_AB_STUFE){
    const z = document.createElement('div');
    z.id = 'zauberBefugnisHinweis';
    z.style.cssText = 'text-align:center;color:#c77dff;margin:4px 0 10px;font-size:calc(13px * var(--fs));';
    z.textContent = `Zauberbefugnis wird ab Stufe ${ZAUBER_AB_STUFE} erteilt. Aktuelle Stufe: ${player.level}.`;
    cols.parentNode.insertBefore(z, cols);
  }
  for(let b=0; b<3; b++){
    const col = document.createElement('div');
    let html = `<div class="spellColTitle">${SPELL_BRANCHES[b]}</div>`;
    const tierSpells = SPELLS.filter(s=>s.branch===b && !s.ultimate).sort((a,b2)=>a.tier-b2.tier);
    for(const sp of tierSpells) html += spellNodeHTML(sp);
    col.innerHTML = html;
    cols.appendChild(col);
  }
  cols.querySelectorAll('.spellNode').forEach(el=>{
    el.onclick = () => {
      const sp = SPELLS.find(s=>s.id===el.dataset.id);
      if(spellKnown(sp.id)) selectSpell(sp.id);
      else if(spellUnlockable(sp)) unlockSpell(sp);
    };
  });

  const ult = SPELLS.find(s=>s.ultimate);
  const known = spellKnown(ult.id), canUnlock = spellUnlockable(ult);
  const cls = known ? 'ultNode known' : (canUnlock ? 'ultNode unlockable' : 'ultNode locked');
  const missing = ult.req.filter(r=>!spellKnown(r)).length;
  const ultRow = document.getElementById('ultimateRow');
  ultRow.innerHTML = `<div class="${cls}" id="ultNodeEl">
    <div class="sIcon">${ult.icon}</div>
    <div class="sName">${ult.name}</div>
    <div class="sDesc">${ult.desc}</div>
    <div class="sMana">${ult.mana} Mana${poolWarnung(ult)}${known?' · Taste R':(missing>0?` · ${missing} Sprüche fehlen noch`:' · bereit zum Freischalten!')}</div>
  </div>`;
  document.getElementById('ultNodeEl').onclick = () => { if(spellUnlockable(ult)) unlockSpell(ult); };
}
function castUltimate(){ const sp = SPELLS.find(s=>s.ultimate); if(sp) castSpell(sp); }

function castSpell(sp, target){                          // target: optionaler Weltpunkt {wx,wy} (Touch-Drag)
  // Z2: zweite Haelfte der Doppelsperre (die erste steht in spellUnlockable).
  // Unter der Befugnisstufe kann regulaer kein Spruch bekannt sein, aber die
  // Guards setzen player.level in Testpfaden frei um, und ein Spielstand aus
  // der Zeit vor Z2 koennte Sprueche unterhalb der Stufe tragen.
  if(state!=='play' || player.dead || player.level < ZAUBER_AB_STUFE || !spellKnown(sp.id)) return;
  if(player.spellCd > 0) return;
  // Wirkung 'Sparsamkeit' senkt die Kosten, Fluch 'Blutmagie' zahlt sie in Leben statt Mana
  const kosten = Math.max(1, Math.round(sp.mana * (1 - Math.min(0.55, FX.sparsam*0.11))));
  if(CFX.blut){
    // Sperre statt hurtPlayer(): sonst wäre Selbsttötung per Zauber ein Tastendruck
    if(player.hp <= kosten + 1){ floaters.push({x:player.x, y:player.y-30, txt:'Zu wenig Kraft', col:'#ff8f8f', t:0.7}); return; }
    player.hp -= kosten;
  } else {
    if(player.mana < kosten){ floaters.push({x:player.x, y:player.y-30, txt:'Zu wenig Mana', col:'#7da0ff', t:0.7}); return; }
    player.mana -= kosten;
  }
  if(CFX.goldz) player.gold = Math.max(0, player.gold - Math.min(player.gold, kosten));   // Fluch 'Verwaltungsgebühr'
  player.spellCd = CFX.zunge ? 0.75 : 0.28;                                                // Fluch 'Langsame Zunge'
  player.zauberRuhT = 0.8;                                                                // Z5: Mana ruht kurz
  auftragEreignis('zauber');   // W4: nach allen Frühabbrüchen (Mana/Leben/Cooldown), der Zauber ist jetzt sicher
  player.castT = 0.42;                                   // Zauber-Animation des Helden
  if(!kn.flags.hatGezaubert){ kn.flags.hatGezaubert = true; saveKn(); }   // Wissenslücke 'nie gezaubert' geschlossen
  // Z3: Der Zielpunkt wird auf die angezeigte Reichweite geklemmt. Der Deckel
  // von 320 galt bisher nur fuer die Touch-Zielhilfe, mit der Maus liess sich ein
  // Meteor an jede Stelle des Bildschirms setzen. Fuer Bolzen aendert das Klemmen
  // nichts als die Richtung, fuer Meteor und Blizzard ist es der Unterschied
  // zwischen Zielen und Fernwirkung.
  let aim = target || aimPoint();
  if(sp.type === 'aoe_target'){
    const reich = spellReach(sp), ax = aim.wx - player.x, ay = aim.wy - player.y;
    const ad = Math.hypot(ax, ay);
    if(ad > reich) aim = {wx: player.x + ax/ad*reich, wy: player.y + ay/ad*reich};
  }
  const dir = Math.atan2(aim.wy - player.y, aim.wx - player.x);
  player.dir = dir;
  player.faceLeft = Math.cos(dir) < 0;
  if(CFX.schleuder) moveEnt(player, -Math.cos(dir)*46, -Math.sin(dir)*46);   // Fluch 'Schleuderrückstoß'

  const zweig = sp.ultimate ? 'ult' : sp.branch;         // Kammer-Sonderregeln lesen das mit
  // K1: Zweigzuschlag der Zulagen, zusaetzlich zur zweigfreien Wirkung
  // 'Zauberkraft'. Das Ultimate bleibt aussen vor: es kostet den ganzen Pool
  // und traegt seinen Wert selbst (Z1), ein Zweigzuschlag darauf waere die
  // Rueckkehr des Zauberspams durch die Hintertuer.
  const zweigZu = sp.ultimate ? 0 : ([FX.feuer, FX.frost, FX.arkan][sp.branch] || 0);
  const sd = Math.round(sp.dmg * (1 + FX.zauber*0.12 + zweigZu*0.15));  // Wirkung 'Zauberkraft' + K1
  // Z1: Zauber würfeln ihren Crit wie jeder Waffentreffer. Bis hierher stand an
  // allen Zauber-Aufrufen von hurtMon() ein festes true. Gemeint war der Effekt
  // (Ton, Partikel, große Zahl), gewirkt hat aber auch der Schadensfaktor 1,7:
  // ein Zauber traf dauerhaft 1,45 mal härter als dieselbe Zahl im Nahkampf, wo
  // die 25 Prozent Crit-Chance im Schnitt nur 1,175 ergeben. Genau diese
  // versteckte Anderthalb war der Grund, warum Zauberspam jeden Nahkampf schlug.
  const kritt = () => Math.random() < derived.crit;
  if(sp.type === 'bolt'){
    sfx.magic();
    // Z2: Flugzeit aus der angezeigten Reichweite, nicht aus einer festen 2,0.
    // spellReach() ist die Linie, die die Zielvorschau malt (speed*0.9). Das
    // Geschoss flog bisher speed*2,0, also mehr als doppelt so weit wie
    // versprochen: 880 bis 1120 Pixel, während jeder Gegner erst ab 200 Pixel
    // überhaupt reagiert. Ab jetzt ist die Vorschau die Wahrheit.
    projectiles.push({isSpell:true, zweig, x:player.x, y:player.y, vx:Math.cos(dir)*sp.speed, vy:Math.sin(dir)*sp.speed,
      dmg:sd, t:spellReach(sp)/sp.speed, color:sp.color, r:sp.r||7, aoe:sp.aoe||0, slow:sp.slow||0, krit:kritt()});
  } else if(sp.type === 'nova'){
    sfx.magic(); addShake(8,0.25);
    magicEffects.push({type:'ring', x:player.x, y:player.y, rad:sp.radius, color:sp.color, t:0.4, maxT:0.4});
    kamFlamme(player.x, player.y, sp.radius, zweig);
    for(const m of monsters){ if(!m.dead && dist(player.x,player.y,m.x,m.y) < sp.radius){ if(sp.slow) m.slowT = sp.slow; hurtMon(m, sd, kritt(), Math.atan2(m.y-player.y,m.x-player.x), zweig); } }
  } else if(sp.type === 'chain'){
    sfx.zap(); addShake(8,0.2);
    let targets = monsters.filter(m=>!m.dead && dist(player.x,player.y,m.x,m.y) < sp.range)
                          .sort((a,b)=>dist(player.x,player.y,a.x,a.y)-dist(player.x,player.y,b.x,b.y)).slice(0, sp.chain);
    let px=player.x, py=player.y;
    for(const t of targets){ magicEffects.push({type:'lightning', x1:px, y1:py, x2:t.x, y2:t.y, t:0.2}); hurtMon(t, sd, kritt(), Math.atan2(t.y-py, t.x-px), zweig); px=t.x; py=t.y; }
  } else if(sp.type === 'aoe_target'){
    sfx.magic(); addShake(12,0.35);
    const tx=aim.wx, ty=aim.wy;
    kamFlamme(tx, ty, sp.radius, zweig);
    magicEffects.push({type:'ring', x:tx, y:ty, rad:sp.radius, color:sp.color, t:0.5, maxT:0.5});
    if(sp.branch === 0)   // Feuer-Zweig: echte Flammen-Sprites im Einschlag
      for(let i=0;i<7;i++) magicEffects.push({type:'flame', x:tx+rr(-sp.radius*0.6, sp.radius*0.6),
        y:ty+rr(-sp.radius*0.45, sp.radius*0.45), sc:rr(2.2,4), t:rr(0.45,0.8), maxT:0.8});
    spawnImpactParticles(tx, ty, 30, null);
    for(const m of monsters){ if(!m.dead && dist(tx,ty,m.x,m.y) < sp.radius){ if(sp.slow) m.slowT = sp.slow; hurtMon(m, sd, kritt(), Math.atan2(m.y-ty,m.x-tx), zweig); } }
  } else if(sp.type === 'slow_field'){
    sfx.magic(); addShake(6,0.3);
    magicEffects.push({type:'ring', x:player.x, y:player.y, rad:sp.radius, color:sp.color, t:0.6, maxT:0.6});
    kamFlamme(player.x, player.y, sp.radius, zweig);
    for(const m of monsters){ if(!m.dead && dist(player.x,player.y,m.x,m.y) < sp.radius){ m.slowT = sp.slow; hurtMon(m, sd, false, Math.atan2(m.y-player.y,m.x-player.x), zweig); } }
  } else if(sp.type === 'ultimate'){
    sfx.warp(); sfx.crit(); addShake(35, 1.2); addHitStop(0.12);
    floaters.push({x:player.x, y:player.y-60, txt:'KONFETTI-KATAKLYSMUS!', col:'#ffd54a', t:2.5, big:true});
    magicEffects.push({type:'ring', x:player.x, y:player.y, rad:900, color:'#ffffff', t:0.7, maxT:0.7});
    // Das Ultimate behaelt seinen festen Crit: es kostet den ganzen Manapool,
    // haengt an allen zehn Spruechen und soll sich anfuehlen wie ein Schlussstrich.
    for(const m of [...monsters]){ if(m.dead) continue; if(dist(player.x,player.y,m.x,m.y) < 1100){ spawnImpactParticles(m.x,m.y,20,null); hurtMon(m, sd, true, Math.atan2(m.y-player.y,m.x-player.x), 'ult'); } }
    for(let i=0;i<160;i++){ const a=rr(0,Math.PI*2), d=rr(40,700); spawnImpactParticles(player.x+Math.cos(a)*d, player.y+Math.sin(a)*d, 3, null); }
    kn.counters.ultimates = (kn.counters.ultimates||0) + 1;
    if(kn.counters.ultimates >= 2) anlage2Notiz('ultimate');
    saveKn();
  }
  updateHUD();
}

// ===================== ZULAGEN (K1) =========================================
//  Die Maschine hinter dem Katalog weiter oben. Vier Teile: die Ziehung (drei
//  liegen aus, eine wird bewilligt), die Dienstmappe (ein bis drei Faecher, je
//  nach Stufe), die Kartei (was nicht eingelegt ist) und das Panel dazu.
//
//  Die Funktionen stehen hier und nicht weiter oben, weil sie SPELLS und
//  spellKnown() lesen. Funktionsdeklarationen werden hochgezogen, gainXP()
//  weiter oben darf sie also rufen; ausgefuehrt wird auf Skriptebene nur, was
//  die Guards ganz unten anstossen, und da steht alles.
// ===========================================================================
// U8: 'zulagenOpen' gibt es nicht mehr. Die Mappe ist seit U8 das zweite Blatt
// des Charakterfensters und kein Fenster mit eigenem Zustand; ob sie offen ist,
// beantwortet zulagenOffen() aus charakterOpen und charBlatt. Ein zweiter
// Zustand daneben waere genau der Kopie-Fehler, den U1 an den Aufraeum-Listen
// aufgeraeumt hat.

// Halbes Los fuer Karten, die im Moment nichts taeten: die Gattung liegt nicht
// in der Hand, oder der Zweig hat noch keinen gelernten Spruch. Nie null Lose —
// die Kartei behaelt jede Karte bis Schichtende, und die naechste Klinge aus
// dem Kessel kann die tote Karte zur besten machen. Abwerten, nicht sperren.
function zulageFamilienGewicht(id){
  const zf = ZULAGE[id];
  if(zf.modus && player.attackMode !== zf.modus) return 1;
  if(zf.zweig !== undefined && (player.level < ZAUBER_AB_STUFE ||
     !SPELLS.some(sp => sp.branch === zf.zweig && !sp.ultimate && spellKnown(sp.id)))) return 1;
  return 2;
}

function zulageStufeWuerfeln(){
  const g = ZULAGE_STUFEN_GEWICHT.find(z => player.level >= z.abStufe) || ZULAGE_STUFEN_GEWICHT[ZULAGE_STUFEN_GEWICHT.length - 1];
  const r = Math.random() * 100;
  return r < g.w3 ? 3 : r < g.w3 + g.w2 ? 2 : 1;
}

// Legt drei aus, wenn eine Ziehung offen ist und nichts anderes ausliegt. Drei
// VERSCHIEDENE Familien: dieselbe Familie zweimal in einem Angebot waere eine
// Scheinwahl. Ein einmal ausliegendes Angebot bleibt liegen, bis gewaehlt wird;
// Panel zu und wieder auf wuerfelt nicht neu.
function zulagenAngebotSicherstellen(){
  if(player.zulagenAngebot || player.zulagenZiehungen <= 0) return;
  player.zulagenZiehungen--;
  const lose = Object.keys(ZULAGE).map(id => ({id, w: zulageFamilienGewicht(id)}));
  const wahl = [];
  while(wahl.length < 3 && lose.length){
    const summe = lose.reduce((a, l) => a + l.w, 0);
    let r = Math.random() * summe;
    let i = lose.findIndex(l => (r -= l.w) < 0);
    if(i < 0) i = lose.length - 1;
    wahl.push(lose.splice(i, 1)[0].id);
  }
  player.zulagenAngebot = wahl.map(id => ({familie:id, stufe:zulageStufeWuerfeln()}));
}

function zulageWaehlen(i){
  const ang = player.zulagenAngebot;
  if(!ang || !ang[i]) return;
  player.zulagenKartei.push({familie:ang[i].familie, stufe:ang[i].stufe, angelegt:false});
  player.zulagenAngebot = null;
  // Bequemlichkeit: die frisch bewilligte Karte legt sich selbst ein, wenn ein
  // Fach frei ist und die Stapelregel nichts dagegen hat. Still, weil ein
  // Misserfolg hier keine Meldung braucht: die Karte liegt dann sichtbar in
  // der Kartei, und das Panel steht ohnehin offen.
  zulageAnlegen(player.zulagenKartei.length - 1, true);
  zulagenAngebotSicherstellen();
  recalc(); updateHUD(); renderZulagen();
}

// Die Dienstmappe ist eine Sicht auf die Kartei, kein zweites Array.
function zulageMappe(){ return player.zulagenKartei.filter(zk => zk.angelegt); }

function zulageMeldung(txt){
  floaters.push({x:player.x, y:player.y-30, txt, col:'#9a8a5f', t:1.2});
}

function zulageAnlegen(idx, still){
  const zk = player.zulagenKartei[idx];
  if(!zk || zk.angelegt) return;
  // 'Ausserhalb des Gefechts' ist dasselbe Fenster wie beim Nuechternheitsgebot:
  // hurtPlayer() setzt kampfT, und solange es laeuft, wird nicht umgesteckt.
  // Eine Mappe im Gefecht neu zu sortieren waere kein Spiel, sondern eine Pause.
  if(player.kampfT > 0){ if(!still) zulageMeldung('Nicht im Gefecht'); return; }
  const mappe = zulageMappe();
  if(mappe.length >= zulageSlots(player.level)){ if(!still) zulageMeldung('Dienstmappe voll'); return; }
  const zf = ZULAGE[zk.familie];
  const gleiche = mappe.filter(m => m.familie === zk.familie).length;
  if(gleiche >= (zf.stapelbar ? ZULAGE_STAPEL_MAX : 1)){
    if(!still) zulageMeldung(zf.stapelbar ? 'Zweimal ist das Maß' : 'Eine je Sache');
    return;
  }
  zk.angelegt = true;
  recalc(); updateHUD(); renderZulagen();
}

function zulageAblegen(idx){
  const zk = player.zulagenKartei[idx];
  if(!zk || !zk.angelegt) return;
  if(player.kampfT > 0){ zulageMeldung('Nicht im Gefecht'); return; }
  zk.angelegt = false;
  recalc(); updateHUD(); renderZulagen();
}

// U8: Der Weg zur Mappe fuehrt jetzt durch das Charakterfenster. Die Funktion
// bleibt stehen und heisst weiter so, weil die Taste Z, das Sternchen und die
// Guards sie kennen — sie schlaegt nur ein Blatt auf statt ein Fenster.
function toggleZulagen(){
  if(zulagenOffen()) toggleCharakter();      // zweiter Druck auf Z macht wieder zu
  else toggleCharakter('mappe');
}

function zulageName(zf, stufe){ return stufe >= 3 ? zf.unikat : zf.name; }

// Die Typenzeile, wie sie auf einer Sammelkarte zwischen Bild und Text steht:
// wo die Karte hingehoert und ob sie sich stapeln laesst. Keine Zahl, wie
// ueberall im Haus; zulagenAssert() prueft auch das.
const ZULAGE_MODUS_NAME = {dagger:'Dolch', sword:'Schwert', doubleaxe:'Axt'};
const ZULAGE_ZWEIG_NAME = ['Feuer', 'Frost', 'Arkan'];
function zulageArtZeile(zf){
  const art = zf.modus !== undefined ? 'Gattung ' + ZULAGE_MODUS_NAME[zf.modus]
            : zf.zweig !== undefined ? 'Zweig ' + ZULAGE_ZWEIG_NAME[zf.zweig]
            : 'Allgemein';
  return art + (zf.stapelbar ? ' · stapelt' : '');
}

// Die Karte in der Bauform einer Sammelkarte: Namensleiste, Bildfenster,
// Typenzeile, Textfeld.
//
// Das Bildfenster nimmt ein <img>, sobald der Katalog fuer DIESE STUFE ein
// Bild traegt. 'bild' ist deshalb ein Feld mit bis zu drei Pfaden, eines je
// Stufe: die drei Stufen einer Familie zeigen dieselbe Sache in drei
// Haertegraden, und genau diese Eskalation ist der Grund, eine Sammlung
// ueberhaupt vollmachen zu wollen. Ein einzelner Pfad statt eines Feldes gilt
// weiter und dann fuer alle drei.
//
// Fehlt der Eintrag, faellt die Karte auf das Sinnbild zurueck. Das ist kein
// Notbehelf, sondern Absicht: fuenfundvierzig Bilder entstehen nicht an einem
// Tag, und ein halb gefuellter Katalog darf das Panel nicht mit leeren
// Rahmen zupflastern.
function zulageBildPfad(zf, stufe){
  const b = zf.bild;
  if(!b) return null;
  return (typeof b === 'string' ? b : b[stufe - 1]) || null;
}

// Der Pfad aus dem Katalog ist eine Datei neben index.html — das gilt aber nur
// im Quellbaum. Der Einzeldatei-Build liefert eine HTML ohne assets/ daneben
// (GitHub Pages laedt genau die eine Datei hoch), dort ist derselbe Pfad nur
// noch der Schluessel in ASSET_BLOBS. Ein festes src="assets/..." war deshalb
// die zweite Ladestelle, vor der der Kommentar bei knZettelPortrait() warnt:
// im Spiel unsichtbar, in der ausgelieferten Fassung fuenfundvierzig kaputte
// Bildsymbole auf den Karten.
//
// Fehlt der Schluessel im Build, gibt es das Bild nicht und ein Ladeversuch
// waere ein sicherer 404 — dieselbe Regel wie in loadAssets(). Dann faellt die
// Karte auf das Sinnbild zurueck, den Weg, den sie ohnehin geht, solange kein
// Bild danebenliegt.
function zulageBildQuelle(zf, stufe){
  const pfad = zulageBildPfad(zf, stufe);
  if(!pfad) return null;
  return ASSET_BLOBS ? (ASSET_BLOBS[pfad] || null) : pfad;
}

function zulageKarteHTML(zf, stufe, extra){
  const quelle = zulageBildQuelle(zf, stufe);
  const bild = quelle ? `<img src="${quelle}" alt="">`
                      : `<span class="zIcon">${zf.icon}</span>`;
  return `<div class="zulKarte s${stufe}${extra || ''}">
    <div class="zKopf">
      <span class="zName">${zulageName(zf, stufe)}</span>
      <span class="zStufe">${ZULAGE_ROEMISCH[stufe - 1]}</span>
    </div>
    <div class="zBild">${bild}</div>
    <div class="zArt">${zulageArtZeile(zf)}</div>
    <div class="zSatz">${zf.satz[stufe - 1]}</div>
  </div>`;
}

// Tooltip in der Bauform von buildTooltip(): Name, Einordnung, ganzer Satz,
// Hinweiszeile. Keine Zahl, wie im ganzen Haus (s. Kommentar ueber WIRKUNG).
function zulageTooltip(zk, hinweis){
  const zf = ZULAGE[zk.familie];
  const farbe = zk.stufe >= 3 ? '#c77dff' : zk.stufe === 2 ? '#f2c94c' : '#e8e8e0';
  return `<div class="tname" style="color:${farbe}">${zf.icon} ${zulageName(zf, zk.stufe)}</div>`
       + `<div style="color:#c9a227;">Zulage, Stufe ${ZULAGE_ROEMISCH[zk.stufe - 1]}</div>`
       + `<div style="margin-top:6px;">${zf.satz[zk.stufe - 1]}</div>`
       + `<div class="aff">${zf.stapelbar ? 'Stapelt.' : 'Stapelt nicht.'}</div>`
       + `<div class="hint">${hinweis}</div>`;
}

function renderZulagen(){
  if(!zulagenOffen()) return;   // geschlossen wird nichts geschrieben (Guards rufen das mit)

  // --- Die Ziehung ---------------------------------------------------------
  const zbox = document.getElementById('zulZiehung');
  const ang = player.zulagenAngebot;
  if(ang){
    const rest = player.zulagenZiehungen > 0
      ? `<div class="zulRest">Weitere Vorlagen warten: ${player.zulagenZiehungen}</div>` : '';
    zbox.innerHTML = `<h4>ZIEHUNG</h4>`
      + `<div class="zulSub">Drei liegen aus. Eine wird bewilligt. Die anderen beiden gelten als nicht beantragt.</div>`
      + `<div class="zulReihe">${ang.map(a => zulageKarteHTML(ZULAGE[a.familie], a.stufe)).join('')}</div>${rest}`;
    zbox.style.display = 'block';
    [...zbox.querySelectorAll('.zulKarte')].forEach((k, i) => {
      bindTooltip(k, ang[i], false, () => {}, () => zulageWaehlen(i), () => zulageTooltip(ang[i], 'Klick: bewilligen'));
    });
  } else {
    zbox.innerHTML = ''; zbox.style.display = 'none';
  }

  // --- Die Dienstmappe -----------------------------------------------------
  const slots = zulageSlots(player.level);
  const eingelegt = player.zulagenKartei.map((zk, i) => ({zk, i})).filter(o => o.zk.angelegt);
  const mbox = document.getElementById('zulMappe');
  let mh = `<h4>DIENSTMAPPE <span>${ZULAGE_MAPPE_NAME[slots - 1]}</span></h4><div class="zulReihe">`;
  for(let f = 0; f < 3; f++){
    if(f < slots){
      const o = eingelegt[f];
      mh += o ? zulageKarteHTML(ZULAGE[o.zk.familie], o.zk.stufe, ' angelegt')
              : `<div class="zulKarte leer"><div class="zSatz">Fach frei</div></div>`;
    } else {
      const ab = ZULAGE_FAECHER.find(x => x.n === f + 1).abStufe;
      mh += `<div class="zulKarte zu"><div class="zSatz">Fach frei ab Stufe ${ab}</div></div>`;
    }
  }
  mbox.innerHTML = mh + '</div>';
  [...mbox.querySelectorAll('.zulKarte.angelegt')].forEach((k, n) => {
    const o = eingelegt[n];
    bindTooltip(k, o.zk, true, () => {}, () => zulageAblegen(o.i), () => zulageTooltip(o.zk, 'Klick: in die Kartei zurück'));
  });

  // --- Die Kartei ----------------------------------------------------------
  const liegend = player.zulagenKartei.map((zk, i) => ({zk, i})).filter(o => !o.zk.angelegt);
  const kbox = document.getElementById('zulKartei');
  let kh = `<h4>KARTEI <span>${player.zulagenKartei.length} bewilligt</span></h4>`;
  if(!player.zulagenKartei.length)
    kh += `<div class="zulLeer">Noch keine Zulage bewilligt. Jeder Aufstieg legt drei vor.</div>`;
  else if(!liegend.length)
    kh += `<div class="zulLeer">Alles eingelegt. Die Kartei ist leer.</div>`;
  else
    kh += `<div class="zulReihe klein">`
        + liegend.map(o => zulageKarteHTML(ZULAGE[o.zk.familie], o.zk.stufe)).join('') + `</div>`;
  kbox.innerHTML = kh;
  [...kbox.querySelectorAll('.zulKarte')].forEach((k, n) => {
    const o = liegend[n];
    bindTooltip(k, o.zk, false, () => {}, () => zulageAnlegen(o.i), () => zulageTooltip(o.zk, 'Klick: in die Dienstmappe'));
  });
}

function enemyCast(m, wucht){
  const b = m.def.bolt;
  const dir = Math.atan2(player.y - m.y, player.x - m.x);
  sfx.shoot();
  const bs = b.speed * (CFX.bolz ? 1.6 : 1);   // Fluch 'Vorfahrt'
  const dmg = Math.max(1, Math.round(rri(b.dmg[0], b.dmg[1]) * (wucht || 1)));
  enemyBolts.push({x:m.x, y:m.y, vx:Math.cos(dir)*bs, vy:Math.sin(dir)*bs, dmg, t:2.4, color:b.color, r:b.r||7});
}

// === Monsterkatalog M1: Angriffe mit sichtbarer Vorwarnung ===================
// Jeder Angriff läuft in zwei Schritten. angriffStarten() waehlt das Muster,
// setzt die Vorwarnung und nagelt das Monster für deren Dauer fest.
// angriffAusloesen() trägt erst danach den Schaden ein. Dazwischen liegt genau
// das Fenster, in dem ein aufmerksamer Spieler weggeht. Der Katalog verlangt
// mindestens 350 ms bei A3 und A4; nachgemessen wird das nicht hier, sondern
// von monsterAssert() beim Laden, damit ein Tippfehler in MONDEF nicht erst im
// Kampf auffällt.
//
// Regel des Katalogs, die diesen ganzen Abschnitt trägt: Sondermuster ERSETZEN
// den Grundtreffer, sie kommen nicht obendrauf. Deshalb bleibt der eingehende
// Dauerschaden immer schaden_pro_treffer / angriffsintervall, egal wie viele
// Muster ein Gegner kennt, und deshalb stimmt das Gefahrenbudget im Katalog.

// Wählt den Index des nächsten Musters: Eröffnung aus dem Hinterhalt zuerst,
// dann ein angesagter Folgeschlag, dann das Sondermuster nach Takt, sonst der
// Grundtreffer.
// Reichweite, ab der ein Monster überhaupt ausholt. Ein Gegner mit mehreren
// Mustern nimmt das weiteste davon: die Sammelverfuegung fängt ihre Anhörung
// schon auf 180 an, ihren Nahschlag erst auf 30.
const reichweiteVon = d => d.zielRange || d.atkRange;
// Erreicht dieses Muster den Spieler auf dieser Entfernung? Fernmuster und
// Muster ohne Schaden (stuetzen, verwehen, Mantel) immer.
function musterReicht(m, mus, pd){
  if(!mus) return true;
  if(mus.art === 'fern' || mus.art === 'stuetz' || mus.art === 'zu' || mus.art === 'mantel') return true;
  return pd <= (mus.reich || m.def.atkRange) * 1.15;
}
function musterWaehlen(m, pd){
  const mu = m.def.muster;
  if(!mu || !mu.length) return 0;
  m.schlagN++;
  let wahl = -1;
  if(m.def.hinterhalt && !m.eroeffnet){
    m.eroeffnet = true;
    for(let i = 0; i < mu.length; i++) if(mu[i].eroeffnung){ wahl = i; break; }
  }
  if(wahl < 0 && m.folgeAn){
    m.folgeAn = false;
    for(let i = 0; i < mu.length; i++) if(mu[i].folge){ wahl = i; break; }
  }
  if(wahl < 0) for(let i = 1; i < mu.length; i++){
    if(mu[i].folge || mu[i].eroeffnung) continue;
    if(mu[i].jede && m.schlagN % mu[i].jede === 0){ wahl = i; break; }
  }
  if(wahl >= 0 && musterReicht(m, mu[wahl], pd)) return wahl;
  if(musterReicht(m, mu[0], pd)) return 0;
  for(let i = 1; i < mu.length; i++) if(musterReicht(m, mu[i], pd)) return i;
  return 0;
}

function angriffStarten(m, idx, stumm){
  const mu = m.def.muster;
  const i = idx === undefined ? musterWaehlen(m, dist(m.x, m.y, player.x, player.y)) : idx;
  const mus = mu && mu[i];
  // M2: der Sonderprüfer holt sichtbar LÄNGER aus. Härter treffen und schneller
  // ausholen wäre zweimal dieselbe Schraube; hier zahlt die Härte mit Lesbarkeit.
  const roh = (mus ? mus.warn : (m.def.warn || 400));
  const warn = (m.elite ? Math.max(roh * ELITE.warn, ELITE.warnMin) : roh) / 1000;
  m.teleMus = i;
  m.teleT = warn;
  m.teleAng = Math.atan2(player.y - m.y, player.x - m.x);   // Kegel merkt sich die Richtung
  m.atkT = m.def.atkCd;                                      // Takt ab Ausholen, nicht ab Treffer
  m.actT = warn + 0.25;
  m.anim = 'attack'; m.animT = 0;
  // Gleichlaut: dieselbe Ansage bei allen gleichartigen Nachbarn im Umkreis. Der
  // Dreierschlag der Sammelmahnung ist damit kein Zufall, sondern eine Ansage,
  // die man aufbrechen kann, indem man sie trennt.
  if(!stumm && mus && mus.gleich){
    for(const o of nahListe){
      if(o === m || o.dead || o.type !== m.type) continue;
      if(o.teleT > 0 || o.zuT > 0 || o.ruheT > 0) continue;
      if(sqDist(o.x, o.y, m.x, m.y) > mus.gleich * mus.gleich) continue;
      angriffStarten(o, i, true);
    }
  }
}

// Unterstützer: heilt oder buffed genau einen Nachbarn, sichtbar am Faden
// zwischen beiden. Während der Standzeit ist der Unterstützer selbst offen,
// das ist das Zeitfenster, das sein Konter meint.
function stuetzeNachbarn(m, mus){
  let ziel = null, best = Infinity;
  for(const o of nahListe){
    if(o === m || o.dead) continue;
    if(mus.wert && o.hp >= o.maxHp) continue;               // Heilen nur, wo etwas fehlt
    const dq = sqDist(o.x, o.y, m.x, m.y);
    if(dq > mus.reich * mus.reich || dq >= best) continue;
    ziel = o; best = dq;
  }
  if(mus.stand) m.offenT = Math.max(m.offenT, mus.stand);
  if(!ziel) return;
  if(mus.wert){
    ziel.hp = Math.min(ziel.maxHp, ziel.hp + ziel.maxHp * mus.wert);
    floaters.push({x: ziel.x, y: ziel.y - ziel.r - 12, txt: 'Wiedervorlage', col:'#6aff8f', t: 1.0});
  } else {
    ziel.buffT = Math.max(ziel.buffT, mus.dauer || 4);
    floaters.push({x: ziel.x, y: ziel.y - ziel.r - 12, txt: 'Zuschlag', col:'#ff9f4a', t: 1.0});
  }
  magicEffects.push({type:'lightning', x1:m.x, y1:m.y - 8, x2:ziel.x, y2:ziel.y - 8, t:0.22});
}

function angriffAusloesen(m){
  const d = m.def, mu = d.muster, mus = (mu && mu[m.teleMus]) || null;
  const art = mus ? mus.art : (d.ranged ? 'fern' : 'nah');
  const wucht = (mus && mus.wucht || 1) * (m.buffT > 0 ? 1.25 : 1) * (m.elite ? ELITE.dmg : 1);
  m.teleT = 0;
  if(art === 'stuetz'){ stuetzeNachbarn(m, mus); return; }
  if(art === 'zu'){                                          // Verwehen: angesagte Auszeit
    m.zuT = mus.dauer || 1.2;
    return;
  }
  if(art === 'mantel'){ m.mantelT = mus.dauer || 2.5; return; }
  if(art === 'fern'){
    if(d.bolt) enemyCast(m, wucht);
    if(mus && mus.ruhe) m.ruheT = mus.ruhe;
    return;
  }
  const pd = dist(m.x, m.y, player.x, player.y);
  const reich = (mus && mus.reich) || d.atkRange;
  let trifft;
  if(art === 'ring')       trifft = pd <= reich;             // rundum, Abstand ist der Konter
  else if(art === 'kegel') trifft = pd <= reich && angDiff(Math.atan2(player.y - m.y, player.x - m.x), m.teleAng) < 0.8;
  else                     trifft = pd <= reich * 1.15;      // Nahkampf, kleine Kulanz
  if(trifft){
    hurtPlayer(Math.round(rri(d.dmg[0], d.dmg[1]) * wucht));
    if(mus){
      if(mus.slow)   player.langsamT     = Math.max(player.langsamT, mus.slow);
      if(mus.halt)   player.haltT        = Math.max(player.haltT, mus.halt);
      if(mus.sperre) player.trankSperreT = Math.max(player.trankSperreT, mus.sperre);
      if(mus.sicht)  player.sichtT       = Math.max(player.sichtT, mus.sicht);
      if(mus.zieht){                                          // Nachfassen zieht den Spieler heran
        const a = Math.atan2(m.y - player.y, m.x - player.x);
        moveEnt(player, Math.cos(a) * mus.zieht, Math.sin(a) * mus.zieht);
      }
      if(mus.stoesst){                                        // Zurueckverweisen stoesst weg
        const a = Math.atan2(player.y - m.y, player.x - m.x);
        moveEnt(player, Math.cos(a) * mus.stoesst, Math.sin(a) * mus.stoesst);
      }
    }
    // Zweite Nachforderung nur nach einem Treffer, und nie auf sich selbst:
    // sonst folgte auf die zweite Nachforderung eine dritte, vierte, fünfte,
    // und der Skorpion schlüge dauerhaft nur noch halb so hart zu.
    if(d.folgeschlag && !(mus && mus.folge)) m.folgeAn = true;
  } else {
    m.folgeAn = false;
  }
  if(mus && mus.ruhe) m.ruheT = mus.ruhe;
  // Starre Schlagfolge (Dienstweg): nach n Schlägen eine Pause, immer gleich.
  if(d.folge && m.schlagN % d.folge.n === 0) m.ruheT = d.folge.pause;
  if(d.kiter) m.rueckT = d.kiter.zurueck;                     // Kiter geht sofort wieder auf Abstand
}

// Zeitfenster eines Monsters, einmal je Frame. Getrennt von der Bewegung, damit
// ein schlafendes Monster (weit weg, nicht aggriert) dieselben Uhren behält.
function monsterFenster(m, dt){
  if(m.offenT > 0) m.offenT -= dt;
  if(m.mantelT > 0) m.mantelT -= dt;
  if(m.buffT > 0) m.buffT -= dt;
  if(m.ruheT > 0) m.ruheT -= dt;
  if(m.rueckT > 0) m.rueckT -= dt;
  if(m.zuT > 0){
    m.zuT -= dt;
    if(m.zuT <= 0) m.offenT = m.def.fenster && m.def.fenster.offen || 2;   // nach dem Verwehen steht es offen
  }
  // Fenster, das sich von selbst öffnet (Abgabefenster des Zustellboten).
  const f = m.def.fenster;
  if(f && f.alle){
    m.zyklusT -= dt;
    if(m.zyklusT <= 0){
      m.zyklusT = f.alle;
      if(f.art === 'zu') m.zuT = f.dauer;
      else { m.offenT = f.dauer; floaters.push({x:m.x, y:m.y - m.r - 16, txt:'quittiert', col:'#f4d97a', t:0.9}); }
    }
  }
}

// ===========================================================================
//  KAMMERN MIT PREISSCHILD  (Phase 2)
//
//  Versiegelte Rätselräume im offenen Land. Vor der Tür hängt ein Schild mit
//  Schwierigkeit 1..5 und dem Zutaten-Tier dahinter: die Entscheidung, ob sich
//  der Aufwand lohnt, fällt VOR dem Betreten und ohne Überraschung.
//
//  Aufbau einer Kammer: Vorraum -> 1 bis 4 Rätselräume -> Schatzkammer.
//  Zwischen zwei Räumen sitzt ein Tor, das erst aufgeht, wenn das Modul davor
//  gelöst ist. Welche Module drankommen, entscheidet ein Schwierigkeitsbudget.
//
//  Die Kammer läuft auf derselben Karte wie die Oberwelt: `map` wird über-
//  schrieben, die Oberwelt liegt solange in `owSave` und kommt beim Verlassen
//  Kachel für Kachel zurück. Das spart eine zweite Karte samt zweitem
//  Boden-Canvas und hält den Renderpfad unverändert.
//
//  Beute richtet sich NUR nach der Kammerschwierigkeit, nie nach Monsterlevel.
//  Schwere Kammern sind damit der einzige verlässliche Weg zu seltenen Zutaten.
// ===========================================================================

// Türen je Biom ohne Dorf-Ausbau. W-Groß von 2 auf 5: sechs Türen auf der
// sechzehnfachen Fläche wären praktisch unauffindbar gewesen, und der
// Hauptvorgang (Adresszeilen 1-3) hängt an genau diesen Türen. Eine Konstante
// für alle drei Leser (CONFIG unten, AUSBAU_DEFS, startShift) — vorher stand die
// 2 dreimal getrennt im Code und wäre beim Ändern auseinandergelaufen.
const KAMMERTUEREN_BASIS = 5;

const CONFIG = {
  kammerTueren: KAMMERTUEREN_BASIS,   // Türen je Biom, Dorf-Ausbau erhöht das (s. startShift)
  kammerNachwachsen: 120,   // Sekunden, bis eine geleerte Kammer neu versiegelt ist
  schichtModus: true,       // Phase 4: Dienst nach Vorschrift. false = alte Todesregel (halbes HP, kein Reset)
  // W-Groß von 900 auf 1500: der Weltdurchmesser ist vier Mal so groß und das Dorf
  // liegt jetzt mittig, jede Biom-Reise ist also Hin- UND Rückweg. Bei 135 px/s
  // Grundtempo kostet eine Kartenquerung rund 76 Sekunden statt 19.
  schichtDauer: 1500,       // Sekunden pro Schicht (~25 Minuten)
  goldUebertragAnteil: 0.5, // Anteil des Golds, der am Gürtel die Schicht überlebt. Weltbibel
                            // Kapitel 5, "Gold zur Hälfte", wörtlich: es ist der Bruttoanteil,
                            // nicht der Anteil an einem Rest.
  // Der Verwaltungskostenanteil (Entscheidung vom 20.08.2026). Weltbibel Kapitel 5
  // nennt ihn beim Namen und das Namensregister führt als Spielbegriff dazu "das
  // verlorene Gold" — in einer Spalte, die sonst durchgehend den Spielbegriff nennt.
  // Bis hierher gab es keinen Verlust: Gürtel und Amtskasse waren zwei Hälften
  // desselben Topfes, es überlebten 100 Prozent (siehe F19). Jetzt sind es drei
  // Empfänger, und die beiden Gold-Flüche (Verwaltungsgebühr, Goldschwund) haben
  // wieder etwas, das ihnen entgehen kann. Aufteilung bei den Vorgabewerten:
  // 50 Prozent Gürtel, 30 Prozent Amtskasse, 20 Prozent weg.
  verwaltungskosten: 0.2,
  zutatenMitnahmeBasis: 5,  // Grund-Kontingent mitnehmbarer Zutaten je Schicht, gezählt in Stücken (endShift teilt Stapel)
};

// Die Schichtabrechnung als eigene, reine Funktion — endShift() ist mit DOM,
// Zutatenkontingent und Speicherpfad verwoben und von einem Guard nicht
// erreichbar. Hier steht nur die Rechnung, und die ist prüfbar.
//
// Reihenfolge ist Absicht: der Gürtelanteil zuerst und auf den Bruttowert, weil
// Weltbibel Kapitel 5 "Gold zur Hälfte" sagt und nicht "die Hälfte von dem, was
// übrig ist". Der Verwaltungskostenanteil danach, ebenfalls brutto. Die Kasse
// bekommt, was bleibt — sie ist der Rest und kann deshalb nie negativ werden,
// auch nicht bei unsinnig gesetzten Reglern. Das Minimum in der zweiten Zeile
// ist genau dieser Schutz.
function goldAufteilung(gold){
  const g = Math.max(0, Math.round(gold));
  const guertel = Math.min(g, Math.round(g * CONFIG.goldUebertragAnteil));
  const verwaltung = Math.min(g - guertel, Math.round(g * CONFIG.verwaltungskosten));
  return { guertel, verwaltung, kasse: g - guertel - verwaltung };
}

// Guard, Bauform wie die übrigen. Prüft die Erhaltungsgröße, nicht die Formel:
// dass die drei Empfänger zusammen exakt die Beute ergeben, keiner negativ wird
// und der Gürtelanteil der Weltbibel-Zusage entspricht. Spiegelt CONFIG und
// stellt es im finally wieder her.
function goldAssert(){
  let ok = true;
  const fehler = (m, ...r) => { ok = false; console.error('Schichtabrechnung:', m, ...r); };
  const uebertragEcht = CONFIG.goldUebertragAnteil, kostenEcht = CONFIG.verwaltungskosten;
  try {
    // (1) Erhaltung und Vorzeichen über einen breiten Wertebereich, inklusive der
    // ungeraden Beträge, an denen sich Rundungsfehler zeigen.
    for(const [u, k] of [[0.5, 0.2], [0.5, 0], [1, 0.2], [0, 0], [0.9, 0.9]]){
      CONFIG.goldUebertragAnteil = u; CONFIG.verwaltungskosten = k;
      for(const g of [0, 1, 3, 7, 41, 99, 100, 101, 443, 1500, 3851]){
        const a = goldAufteilung(g);
        if(a.guertel + a.verwaltung + a.kasse !== g)
          fehler('Summe der drei Empfänger weicht von der Beute ab', 'gold=', g, a, 'regler=', u, k);
        if(a.guertel < 0 || a.verwaltung < 0 || a.kasse < 0)
          fehler('negativer Empfänger', 'gold=', g, a, 'regler=', u, k);
        if(!Number.isInteger(a.guertel) || !Number.isInteger(a.verwaltung) || !Number.isInteger(a.kasse))
          fehler('nicht ganzzahlig', 'gold=', g, a);
      }
    }
    // (2) Die Weltbibel-Zusage aus Kapitel 5, an den Vorgabewerten: der Gürtel
    // trägt die Hälfte des BRUTTOwerts, nicht die Hälfte eines Restes.
    CONFIG.goldUebertragAnteil = uebertragEcht; CONFIG.verwaltungskosten = kostenEcht;
    for(const g of [100, 443, 1000]){
      const a = goldAufteilung(g);
      if(a.guertel !== Math.round(g * CONFIG.goldUebertragAnteil))
        fehler('Gürtelanteil ist nicht der Bruttoanteil', 'gold=', g, a);
      if(a.verwaltung !== Math.round(g * CONFIG.verwaltungskosten))
        fehler('Verwaltungskostenanteil ist nicht der Bruttoanteil', 'gold=', g, a);
    }
    // (3) Der Anteil verlässt das Spiel wirklich: bei gesetztem Regler ist die
    // Summe aus Gürtel und Kasse echt kleiner als die Beute. Ohne diesen Punkt
    // liefe der Guard auch dann grün, wenn der Verlust nur umgebucht würde.
    if(CONFIG.verwaltungskosten > 0){
      const a = goldAufteilung(1000);
      if(a.guertel + a.kasse >= 1000) fehler('kein echter Verlust trotz gesetztem Verwaltungskostenanteil', a);
    }
  } finally {
    CONFIG.goldUebertragAnteil = uebertragEcht; CONFIG.verwaltungskosten = kostenEcht;
  }
  console.assert(ok, 'Schichtabrechnung: Assertion fehlgeschlagen, siehe Konsole.');
  return ok;
}
goldAssert();

// Amt-Speicherstand laden, bevor irgendetwas (Kammertüren, HUD) danach fragt.
// W10: Deckel für die beiden gespeicherten Felder der Wiedereinsetzung. Stehen
// hier oben und nicht beim übrigen W10-Block, weil loadAmt() direkt darunter auf
// Skriptebene läuft und sie dort schon lesen muss (TDZ-Falle, siehe Übergabe).
const WIEDER_STAND_DECKEL = 60, WIEDER_ZAHL_DECKEL = 999;

// Die eine Klemmstelle für den gespeicherten Stand. Von loadAmt() beim Laden und
// von startShift() beim Einlösen gelesen, damit ein zur Laufzeit gesetztes Feld
// nicht am Loader vorbeikommt. Steht hier oben aus demselben TDZ-Grund wie die
// Deckel selbst; wiederAssert() prüft sie weiter unten direkt.
function wiederStandGeklemmt(roh){ return clamp(roh | 0, 1, WIEDER_STAND_DECKEL); }

// SP1: dasselbe für die beiden Schichtstempel aus SZ3. Sie standen bis hierher
// in saveAmt() und in keiner einzigen Ladezeile — geschrieben, gespeichert,
// beim nächsten Laden verworfen und vom nächsten saveAmt() mit 0 überschrieben.
// Der Deckel ist wie WIEDER_STAND_DECKEL keine Balance-Zahl, sondern die Zusage
// dieses Kommentars: 0 heißt "nie", jede andere Zahl ist eine Schichtnummer, und
// so hoch zählt keine Laufbahn. Steht aus demselben TDZ-Grund hier oben.
const STEMPEL_DECKEL = 9999;
function stempelGeklemmt(roh){ return clamp(roh | 0, 0, STEMPEL_DECKEL); }

// SP2: der Übertrag zwischen zwei Schichten. Deckel auf beiden Größen, damit
// ein von Hand gesetzter Stand nicht am Loader vorbeikommt. Was er NICHT
// verhindert, steht ausdrücklich dabei: er klemmt die Zahl, er beweist nicht
// ihre Herkunft — wer den Stand von Hand schreibt, darf sich bis an den Deckel
// beschenken. Das ist derselbe Stand wie bei amt.bankGold und hier zum ersten
// Mal aufgeschrieben statt stillschweigend angenommen.
const UEBERTRAG_GOLD_DECKEL = 999999, UEBERTRAG_STUECK_DECKEL = 99;

const AMT_KEY = 'sda_amt_v1';
(function loadAmt(){
  try{
    const raw = localStorage.getItem(AMT_KEY); if(!raw) return;
    const o = JSON.parse(raw);
    if(typeof o.bankGold === 'number') amt.bankGold = o.bankGold;
    if(typeof o.schichten === 'number') amt.schichten = Math.max(0, o.schichten | 0);   // GW3
    if(o.ausbauten) Object.assign(amt.ausbauten, o.ausbauten);
    if(typeof o.bonusManaRegen === 'number') amt.bonusManaRegen = o.bonusManaRegen;
    if(typeof o.bonusSpeed === 'number') amt.bonusSpeed = o.bonusSpeed;
    if(typeof o.bonusPotions === 'number') amt.bonusPotions = o.bonusPotions;
    if(typeof o.bonusStartGold === 'number') amt.bonusStartGold = o.bonusStartGold;
    if(typeof o.bonusNachwachsen === 'number') amt.bonusNachwachsen = o.bonusNachwachsen;
    // W4: nur strukturell geprüft (kein Tabellenzugriff — AUFTRAG_TYPEN existiert an dieser
    // Stelle noch nicht, das wäre ein TDZ-ReferenceError). Die Typprüfung gegen die Tabelle
    // läuft als eigene Migration direkt hinter AUFTRAG_TYPEN.
    if(o.brett && Array.isArray(o.brett.liste) && o.brett.liste.length === 3
       && typeof o.brett.schicht === 'number') amt.brett = o.brett;
    if(o.auftrag && typeof o.auftrag.typ === 'string') amt.auftrag = o.auftrag;
    // W10: beide Felder strukturell geprüft und BEIDSEITIG geklemmt, gleiche
    // Lehre wie GW3 bei amt.schichten. Die untere Klemme allein reichte nicht:
    // ein von Hand gesetztes {stand: 999} lief glatt durch loadAmt(), durch
    // startShift() (dessen Math.max nach unten klemmt, nicht nach oben) und
    // ergab live eine Schicht auf Stufe 999. Der Deckel ist bewusst weit über
    // allem, was eine Schicht je erreicht (der Stand ist die halbe Stufe), er
    // ist keine Balance-Zahl, sondern die Zusage, die dieser Kommentar macht.
    // Das Haar wird beim Einlösen gegen HAIRS geprüft, deshalb hier nur der Typ.
    // P1: gegen die Tabelle geprüft, nicht nur auf Typ. Ein Stand mit einem
    // Wert, den GESTALT_WAHL nicht kennt, würde sonst haareNach() stumm auf
    // "alle" zurückfallen lassen und die Angabe wäre wirkungslos statt falsch.
    if(typeof o.gestalt === 'string' && GESTALT_WAHL.some(g => g.key === o.gestalt)) amt.gestalt = o.gestalt;
    if(typeof o.wiederZahl === 'number') amt.wiederZahl = Math.min(WIEDER_ZAHL_DECKEL, Math.max(0, o.wiederZahl | 0));
    if(o.wiedereinsetzung && typeof o.wiedereinsetzung.stand === 'number')
      amt.wiedereinsetzung = {stand: wiederStandGeklemmt(o.wiedereinsetzung.stand),
                              haar: typeof o.wiedereinsetzung.haar === 'string' ? o.wiedereinsetzung.haar : null,
                              ton:  typeof o.wiedereinsetzung.ton  === 'string' ? o.wiedereinsetzung.ton  : null};
    // SP1: die beiden Zeitstempel aus SZ3, die es bis hierher nie zurück ins
    // Spiel geschafft haben. Ohne diese zwei Zeilen sind nach jedem Neuladen
    // BEIDE Wege in vorblattFaellig() tot, und weil beide Setzer verbrauchte
    // Einmalpfade sind (stopfenGezogenEnde() läuft nach dem fertigen Strang nie
    // wieder, findeAdresszeile(4) gibt nach dem Fund nie wieder true), kommt
    // Vorblatt dann nie an: keine Szene 6, keine Versuchung, kein Gegenspieler.
    // Gemessen und nachgestellt in SPEICHERFRAGE-2026-08-24.md.
    if(typeof o.stopfenSchicht === 'number') amt.stopfenSchicht = stempelGeklemmt(o.stopfenSchicht);
    if(typeof o.adressSchicht === 'number') amt.adressSchicht = stempelGeklemmt(o.adressSchicht);
    // SP2: der Übertrag. Strukturell geprüft und beidseitig geklemmt wie der
    // Antrag darüber; die Zutatenliste wird Stück für Stück gefiltert, weil ein
    // einzelner kaputter Eintrag sonst den ganzen Übertrag mitnähme.
    if(o.uebertrag && typeof o.uebertrag.gold === 'number' && Array.isArray(o.uebertrag.zutaten))
      amt.uebertrag = {gold: clamp(o.uebertrag.gold | 0, 0, UEBERTRAG_GOLD_DECKEL),
                       zutaten: o.uebertrag.zutaten
                         .filter(z => z && typeof z.noun === 'string' && typeof z.adj === 'string' && (z.count | 0) > 0)
                         .slice(0, UEBERTRAG_STUECK_DECKEL)
                         .map(z => ({noun: z.noun, adj: z.adj, count: clamp(z.count | 0, 1, UEBERTRAG_STUECK_DECKEL)}))};
    // GW26b: die Ladezeile für auftraegeErfuellt ist hier ersatzlos entfallen.
    // loadAmt() ist eine Feld-Whitelist, ein alter Stand mit dem Feld wird also
    // schlicht nicht mehr gelesen; saveAmt() schreibt amt komplett neu und räumt
    // es beim nächsten Speichern von selbst aus dem localStorage. Kein delete,
    // kein Aufräum-saveAmt() hier — das wäre ein Schreibvorgang bei jedem Aufruf.
  }catch(_){}
})();
function saveAmt(){ try{ localStorage.setItem(AMT_KEY, JSON.stringify(amt)); }catch(_){} }

// W5: Das Aktgatter. Eine Wahrheitsquelle für beide Aktenfund-Fundwege
// (truheOeffnen(), killMon()) und für vorgangAssert(). Der !CONFIG.schichtModus-
// Kurzschluss ist wörtliche Abnahme: bei schichtModus=false steigt
// amt.schichten nie, ein Gatter wäre dort ein Dauerschloss.
// SZ3: Serie I steht auf Akt IV, aber der Akt ist bei ihr nur die Untergrenze.
// Ihr eigentliches Tor ist der Stopfen, und das steht in blattFaelltAusRohr()
// weiter unten. Der Akt hier verhindert nur, dass ein spaeter eingebauter
// zweiter Fundweg sie versehentlich vorzieht.
const SERIE_AKT = {A:1, B:1, C:2, D:3, E:4, F:5, I:4};
const serieFrei = s => !CONFIG.schichtModus || aktStand() >= SERIE_AKT[s];
const vorgangAdressAkt = () => CONFIG.schichtModus && aktStand() >= 4;

CONFIG.kammerTueren += amt.ausbauten.tueren;   // Dorf-Ausbau wirkt schon auf die allererste Schicht

// ===========================================================================
//  PHASE 5: AMTSRAT A. D. KNÖTERICH — Onboarding ohne Tutorial
//  Ersetzt den alten Erklärtext im Startbildschirm durch eine ereignisgesteuerte
//  Figur. Persistenz in KN_KEY, todesimmun wie die Kladde: kein Schichtende,
//  kein startShift(), kein respawnPlayer() darf sie anfassen. Einzige Ausnahme
//  ist die Schichtbegrüßung, die pro Schicht neu feuert (siehe startShift()).
// ===========================================================================
const KN_KEY = 'sda_knoeterich_v1';
// G8: Knöterichs Aussehen, und zwar an einer einzigen Stelle. Er steht nicht in
// DORF_FIGUREN — er ist älter als die Tabelle und wohnt im Haus statt im Dorf
// (KN_POS, drawAlter) —, trägt aber dasselbe Komposit wie sie, und die Farben
// stehen wie bei ihnen in tools/portraet-farben.py gemessen.
//
// Die Frisur war bis G8 h5, und der Kommentar dahinter sagte auch warum:
// "Grauhaar passt zum a.D.". Das war die Farbe von Blatt 5 und nicht seine Form
// — h5 ist langes offenes Haar, sein Porträt zeigt einen gescheitelten
// Kurzhaarschnitt. Seit farbBlatt() ist Grau kein Grund mehr, eine Form zu
// wählen: h1 ist die Form, #746a5a die gemessene Farbe.
//
// Die graue Tönung in drawAlter() bleibt, wie sie ist. "Alt und grau" ist eine
// Entscheidung aus E1 und keine Notlösung; der Dreiteiler kommt jetzt darunter
// zum Vorschein, statt dass die Figur unbekleidet unter der Tönung steht.
const KN_GESTALT = {hair:'h1', haarFarbe:'#746a5a', hemd:'hof', hemdFarbe:'#706150', hose:'hof', schuh:'schuh'};
const EMPFANG_BLATT = 'npc_baked_knoeterich';
// U3: Was auf seinem Namensschild steht. Kurz wie bei den Dorffiguren (kurz:),
// und aus demselben Grund: der volle Titel ist ein Verzeichniseintrag.
const KN_NAME_KURZ = 'Amtsrat a. D. Knöterich';
// KN_T/KN_POS sind bereits weiter oben deklariert (neben KESSEL_T/KESSEL), siehe Kommentar dort.

// ---------------------------------------------------------------------------
//  U6: Knöterich bekommt einen Tabelleneintrag wie jede Dorffigur.
//
//  Bis hierher war er die einzige Figur des Ensembles ohne einen: er kam vor
//  DORF_FIGUREN, wohnt im Haus statt im Dorf und sprach ausschliesslich in
//  seinen eigenen Kanaelen (Dienstzettel, Randnotiz, Blase). Ansprechbar war er
//  auch, aber nur zum Nachschlagen: die Kontextaktion hiess "Nachfragen" und
//  zeigte einen alten Dienstzettel noch einmal im oberen Band. Wer neben der
//  Figur stand, mit der er die ersten fuenf Minuten des Spiels verbracht hat,
//  konnte mit ihr nicht reden.
//
//  Ab hier schon, und zwar ueber dieselbe Tafel wie bei allen anderen. Der
//  Eintrag traegt deshalb genau die Felder, die npcCycle() und
//  gespraechOptionen() lesen — key, name, grund, akt —, plus opt/gestalt fuer
//  die beiden Guards, die ueber die Tabelle laufen. In DORF_FIGUREN gehoert er
//  trotzdem nicht: dort stehen die Figuren, die genMap() ins Dorf setzt und
//  DRAW_NPC zeichnet, und er steht fest im Haus und wird von drawAlter()
//  gezeichnet. Zwei Zeilen fuer dieselbe Figur waeren zwei Wahrheiten.
//
//  Die Zeilen halten die Regel aus Kapitel 8: er erklaert Tasten, nie
//  Zusammenhaenge. Nichts davon sagt, was er weiss. Sie sagen, dass er es
//  nicht sagen darf, und genau das ist die Figur. Sein Zuwachs aus W11 (die
//  Rangfolge des Reiches) bleibt aus demselben Grund draussen, wie die
//  Weltbibel ihn ausdruecklich draussen laesst.
const KN_FIGUR = {
  key:'knoeterich', name:KN_NAME_KURZ, kurz:KN_NAME_KURZ, opt:'fest', gestalt:KN_GESTALT,
  grund:[
    {z1:'Ich führe Buch. Seit vierzig Jahren.',    z2:'Auch über Sie.'},
    {z1:'Meine Entpflichtung liegt noch vor.',     z2:'Sie wird bearbeitet.'},
    {z1:'Außer Dienst und im Dienst.',             z2:'Beides steht in der Akte.'},
    {z1:'Fragen Sie mich nichts über Vorgänge.',   z2:'Amtsverschwiegenheit.'},
    {z1:'Ich komme morgens früher als nötig.',     z2:'Das steht nirgends.'},
    {z1:'Ich gieße. Mehr sage ich dazu nicht.',    z2:'Es ist keine Dienstaufgabe.'},
  ],
  akt:[
    'Neuzugang vermerkt. Die Akte ist offen.',
    'Der Posteingang wächst. Vermerkt.',
    'Mehr Schriftverkehr als sonst. Notiert.',
    'Man fragt mich viel. Ich antworte nicht.',
    'Meine Entpflichtung steht weiter aus.',
  ],
};
// Die Figur als Eintrag, wie ihn die Tafel erwartet. Ein Objekt fuer die ganze
// Sitzung und nicht eins je Aufruf: bubbleIdx ist der Zeiger im
// Grundzeilen-Kreislauf, und der soll zwischen zwei Gespraechen stehen bleiben,
// genau wie bei den Dorffiguren (dort haelt ihn der npcs-Eintrag).
//
// x/y stehen fest auf KN_POS. Damit misst gespraechTick() die Entfernung gegen
// dieselben Zahlen wie bei jeder anderen Figur, ohne einen zweiten Weg.
// sheetIdle/tint sind der Rueckfall des Portraets: liegt das gemalte Bild da,
// nimmt gespraechPortrait() es und liest beides gar nicht.
const knNpc = {key:'knoeterich', figur:KN_FIGUR, x:KN_POS.x, y:KN_POS.y,
               sheetIdle:EMPFANG_BLATT, tint:'#8a8a8a', tintA:0.30,
               bubbleIdx:-1, bubbleText1:'', bubbleText2:'', bubbleHideAt:0};

const kn = {
  seen:{}, pending:{}, varB:{}, escReady:{},
  // T4: der Umschlag. Jede dieser Zeilen faellt genau einmal im ganzen Spiel,
  // und deshalb reicht ein Merker je Zeile nicht: eine Zeile kann faellig sein,
  // ohne schon gefallen zu sein (der erste Tod schaltet sie scharf, gezeigt wird
  // sie erst beim Wiederantritt, und dazwischen kann jemand den Browser
  // schliessen). Zwei Werte statt eines Wahrheitswerts loesen das:
  //   1  faellig, aber noch nicht gezeigt
  //   2  gezeigt, fuer immer verbraucht
  // Geschrieben wird ausschliesslich von anlage2Umschlag() und
  // anlage2UmschlagTick(), und die pruefen den Schluessel gegen
  // ANLAGE2_UMSCHLAG. Damit ist die Menge durch die Tabelle gedeckelt und
  // waechst nicht, wie kn.history es ohne seinen Cap taete.
  umschlag:{},
  // T4-Nachlese: welche ihrer sieben Fragen schon gestellt wurden, ueber
  // Sitzungen hinweg. szene.gefragt kennt nur die offene Tafel und faengt bei
  // jedem Betreten von vorne an; ihre Besessenheit ist aber, EINMAL GANZ
  // gelesen zu werden, und das ist keine Sitzungsfrage. Geschrieben wird
  // ausschliesslich aus dem gestellt-Haken ihres Baumes, die Schluessel sind
  // die sieben aus fragen[]. Damit ist auch dieses Feld durch eine Tabelle
  // gedeckelt und waechst nicht.
  a2Gefragt:{},
  // T3: anlage2Zug zaehlt die Versuche, Anlage 2 aus der Tasche zu bewegen. Er
  // ist der einzige Zaehler, der eine Reihenfolge traegt statt einer Menge: die
  // Sprueche kommen der Reihe nach, nicht zufaellig, und die Reihe wird
  // vertrauter. Deshalb steht er persistiert bei den uebrigen und nicht als
  // Sitzungsvariable: wer morgen weiterzieht, zieht dort weiter, wo er gestern
  // aufgehoert hat, sonst faengt die Vertrautheit jeden Tag von vorne an.
  // T7: anlage2Ruhig zaehlt die gefassten Zeilen seit dem letzten Ausbruch. Er
  // steht persistiert bei den uebrigen und aus demselben Grund wie anlage2Zug:
  // wer morgen weiterspielt, soll nicht jeden Morgen drei ruhige Zeilen lang
  // auf den ersten Ausbruch warten. Additiv gemergt und damit migrationsfrei.
  counters:{traenke:0, kammerAbbrueche:0, maxKillsSchicht:0, levelUps:0, ultimates:0, fluchAngelegt:0, anlage2Zug:0, anlage2Ruhig:0},
  // W-Nörgel: hatLagerGesehen steht in derselben Reihe wie hatKammerBetreten —
  // einmal im Leben wahr, danach für immer. Er schaltet Nörgels Lagerzeilen frei
  // (DORF_FIGUREN, Feld zusatz). Ein alter Spielstand ohne das Feld lädt ohne
  // Zutun: loadKn() macht Object.assign auf die Vorgabe, der Merker bleibt false.
  // SZ2: drei Merker fuer die Szenen 2, 3 und 4. Sie liegen hier und nicht in
  // amt, weil kn der Speicher ist, der Tod, Schichtende und startShift()
  // uebersteht, und weil knAssertCaps() Merkernamen ohnehin gegen diese Tabelle
  // prueft. Eine Szene, die zweimal laeuft, waere schlimmer als eine, die fehlt.
  flags:{hatGezaubert:false, hatGekocht:false, hatKammerBetreten:false, hatGesteigert:false, hatLagerGesehen:false,
         szeneUmlauf:false, szeneSchublade:false, szeneKnoeterich:false,
         // SZ3: die beiden Szenen dieses Abschnitts. szeneVorblatt ist mehr als
         // ein Merker — figDa() liest ihn, und damit entscheidet er, ob der
         // Gegenspieler im Dorf steht.
         szeneStopfen:false, szeneVorblatt:false,
         // SZ4: die Versuchung. Er ist mehr als ein Merker, genau wie
         // szeneVorblatt einer ist: vorgangAnhaengig() liest ihn, und damit
         // entscheidet er, ob auf der Ausfertigung ein Zwischenbescheid klebt.
         // Ein Merker, eine Wahrheit, kein zweites Feld daneben.
         szeneVersuchung:false,
         // F1d: was ein Gesprächsbaum sich merken muss. Drei Stück, und jeder
         // öffnet bei einer ANDEREN Figur zwei Zeilen: das ist die Belohnung,
         // die ein Baum geben darf. Gold und Erfahrung darf er nicht geben,
         // sonst wird Reden zum Farmen.
         baumEimer:false, baumHeft:false, baumBericht:false,
         // T3: Anlage 2 haengt an der Ernennungsurkunde und ist ab der
         // Aushaendigung in der Tasche. Der Merker ist die EINZIGE Wahrheit
         // darueber, ob sie da ist: renderInventory() zeichnet die Kachel
         // danach, anlage2Notiz() schweigt ohne ihn, und die Nachholung beim
         // ersten Rucksackoeffnen prueft ihn ebenfalls. Kein zweites Feld im
         // Spielstand, kein Eintrag in player.bag: sie belegt kein Fach, sie
         // steckt an der Urkunde.
         anlage2Da:false,
         // AN4: Zwischen der Ernennung und dem Schritt vor die Tuer haengt sie
         // an der Urkunde und hat sich noch nicht gemeldet. Genau diese
         // Wartezeit traegt dieser Merker, und er traegt sonst nichts: gesetzt
         // am Ende der Ernennung, verbraucht beim ersten Hinausgehen. Er steht
         // im Spielstand und nicht in einer Modulvariablen, weil zwischen
         // beidem gespeichert und geladen werden darf.
         anlage2Wartet:false,
         // T4: der Kipppunkt. Wer im Gespraechsbaum ihre formlose Bitte annimmt
         // ("Sehen Sie ab und zu nach, ob ich noch da bin."), setzt ihn, und
         // zwar ueber szeneEnde(key, merker) wie baumEimer und die drei Szenen.
         // Er gibt kein Gold, keine Erfahrung und keinen Vorteil, er oeffnet
         // ausschliesslich waermere Zeilen (Schalter merker). Das ist die
         // Belohnung, die ein Baum geben darf, siehe F1d weiter oben.
         anlage2Dank:false},
  wissensluecke:{zauber:false, kochen:false, kammer:false, befaehigung:false},   // je Wissenslücke höchstens ein Steckenbleib-Schub, für immer
  beats:{beat1:false, beat2:false, beat3:false},
  regler:'gespraechig',            // 'gespraechig' | 'dienstlich' | 'schweigt' — Dienstzettel laufen in jeder Stellung
  history:[],                      // {z1,z2} der letzten gezeigten Dienstzettel, neueste zuletzt, Cap 3 (für 'Nachfragen')
};
(function loadKn(){
  try{
    const raw = localStorage.getItem(KN_KEY); if(!raw) return;
    const o = JSON.parse(raw); if(!o || typeof o !== 'object') return;
    if(o.seen) kn.seen = o.seen;
    if(o.pending) kn.pending = o.pending;
    // T4: uebernommen wie kn.seen und nicht per Object.assign, denn die
    // Schluessel sind dynamisch. NICHT gegen ANLAGE2_UMSCHLAG gefiltert: die
    // Tabelle steht zweihundert Zeilen weiter unten, loadKn() laeuft hier auf
    // Skriptebene, und ein Zugriff von hier waere die Temporal Dead Zone.
    // Aufgeraeumt wird stattdessen beim Schreiben, siehe anlage2Umschlag().
    if(o.umschlag) kn.umschlag = o.umschlag;
    if(o.a2Gefragt) kn.a2Gefragt = o.a2Gefragt;
    if(o.varB) kn.varB = o.varB;
    if(o.escReady) kn.escReady = o.escReady;
    if(o.counters) Object.assign(kn.counters, o.counters);
    if(o.flags) Object.assign(kn.flags, o.flags);
    if(o.wissensluecke) Object.assign(kn.wissensluecke, o.wissensluecke);
    if(o.beats) Object.assign(kn.beats, o.beats);
    if(typeof o.regler === 'string') kn.regler = o.regler;
    if(Array.isArray(o.history)) kn.history = o.history.slice(-3);
  }catch(_){}
})();
function saveKn(){ try{ localStorage.setItem(KN_KEY, JSON.stringify(kn)); }catch(_){} }

// --- Dienstzettel-Katalog: einmalig über die Lebenszeit. `art` bestimmt die
// Auswertung (siehe knEvaluateZettel). Text-Auswahl folgt dem Grundgesetz: eine
// Taste je Hinweis, kein Verrat der Kesselgrammatik, kein Blut, keine Ketten.
const HINWEISE = [
  {id:'hp30', prio:90, art:'zustand',
   wenn:()=> !player.dead && player.hp < derived.maxHp*0.3,
   z1:'Sie haben kaum noch Kraft übrig.', z2:'Ein Trank hilft. Taste Q.', z2t:'Ein Trank hilft. Antippen.'},
  {id:'tuer1', prio:70, art:'zustand',
   // "Sichtweite": grobe Nährungsdistanz übers Bildschirmband, kein Math.hypot
   wenn:()=> !kammer && currentLevel === 1 && kammerTueren.some(t => t.cd <= 0 && sqDist(player.x,player.y,t.x,t.y) < 202500),
   z1:'An der Tür hängt ein Schild. Lesen Sie es.', z2:'Taste F, dann geht sie auf.', z2t:'Die Hand im Gürtel.'},
  {id:'zutat3', prio:65, art:'zustand',
   wenn:()=> player.pouch.length >= 3,
   z1:'Sie haben drei Zutaten. Daraus wird etwas.', z2:'Am Kessel kochen. Taste K.', z2t:'Rucksack, dann Kessel.'},
  {id:'zutat1', prio:60, art:'ereignis',
   wenn:()=> !!kn.pending.zutat1,
   z1:'Das ist kein Müll. Heben Sie es auf.', z2:'Sammeln Sie alles ein.', z2t:'Sammeln Sie alles ein.'},
  {id:'craft1', prio:55, art:'ereignis',
   wenn:()=> !!kn.pending.craft1,
   z1:'Sie haben ein neues Rezept gelernt.', z2:'Im Kessel, zweiter Reiter.', z2t:'Im Kessel, zweiter Reiter.'},
  {id:'fluch1', prio:50, art:'ereignis',
   wenn:()=> !!kn.pending.fluch1,
   z1:'Ihre Ausrüstung hilft und schadet zugleich.', z2:'Im Rucksack nachlesen. I.', z2t:'Im Rucksack nachlesen.'},
  {id:'kammer1', prio:45, art:'ereignis',
   wenn:()=> !!kn.pending.kammer1,
   z1:'Die Kammer ist geschafft. Gut gemacht.', z2:'Weiter geht es draußen.', z2t:'Weiter geht es draußen.'},
  {id:'ult1', prio:40, art:'zustand',
   wenn:()=> !!player.spellsKnown[ULT_SPELL.id],
   // T1-Nachlese: hier stand "Jetzt wird es albern." Das ist das Spiel, das
   // seinen eigenen Witz benennt, und damit ist er weg (Grundgesetz 1). Der
   // Spruch heisst bereits Konfetti-Kataklysmus des juengsten Gerichts, der
   // Witz steht also im Namen. Knoeterich erklaert Tasten, nie Zusammenhaenge,
   // und schon gar nicht kommentiert er den groessten Moment des Spielers.
   z1:'Sie können jetzt den stärksten Zauber.', z2:'Taste R. Einmal reicht.', z2t:'Der große Knopf. Einmal.'},
  {id:'portal1', prio:35, art:'ereignis',
   wenn:()=> !!kn.pending.portal1,
   z1:'Da ist ein Portal. Wohin, weiß ich nicht.', z2:'Sie können hindurchgehen.', z2t:'Sie können hindurchgehen.'},
  {id:'feierabend1', prio:30, art:'gelatcht',
   // Auslöser fällt mit dem Öffnen von #overlay zusammen (eigene Sperrzone), erscheint
   // deshalb erst 5s nach state==='play' in der Folgeschicht.
   wenn:()=> !!kn.pending.feierabend1 && (gameT - knPlayStartT >= 5),
   // T1-Nachlese: der Hinweis feuert erst in der Folgeschicht, der Spieler ist
   // also gerade wiedergekommen. Genau das sagte niemand, und es ist bei
   // Knoeterich die groesste denkbare Anerkennung: eine Feststellung.
   z1:'Sie sind wiedergekommen. Das freut mich.', z2:'Ihr Bericht liegt im Amt.', z2t:'Ihr Bericht liegt im Amt.'},
  {id:'amt1', prio:25, art:'zustand',
   // amt.bankGold ändert sich nur in endShift(), also faktisch beim Öffnen von #overlay:
   // dieselbe Sperrzonen-Verzögerung wie feierabend1, deshalb dieselbe 5s-Wartezeit.
   wenn:()=> (gameT - knPlayStartT >= 5) && AUSBAU_DEFS.some(d => amt.ausbauten[d.key] < d.max)
             && amt.bankGold >= Math.min(...AUSBAU_DEFS.filter(d => amt.ausbauten[d.key] < d.max).map(d => d.cost(amt.ausbauten[d.key]))),
   z1:'Sie haben genug Gold. Im Amt gibt es was.', z2:'Nach der Schicht hingehen.', z2t:'Nach der Schicht hingehen.'},
];

// --- Eskalation zu Variante B: nur art:'zustand', genau eine Stufe, siehe
// knOnZettelClosed(). Eigene Tabelle statt Zweitzeile in HINWEISE, weil beat3
// (kein Katalogeintrag) mit eskalieren muss.
const ESCALATE_DEFS = {
  beat3:  {prio:40, wenn:()=> player.spellPoints > 0,
           z1:'Der Punkt liegt immer noch da.', z2:'T.', z2t:'Der Stern im Gürtel.'},
  hp30:   {prio:90, wenn:()=> !player.dead && player.hp < derived.maxHp*0.3,
           z1:'Immer noch wenig Konfetti übrig.', z2:'Q.', z2t:'Das Fläschchen.'},
  tuer1:  {prio:70, wenn:()=> !kammer && currentLevel === 1 && kammerTueren.some(t => t.cd <= 0 && sqDist(player.x,player.y,t.x,t.y) < 202500),
           z1:'Die Tür steht immer noch da.', z2:'F.', z2t:'Die Hand im Gürtel.'},
  zutat3: {prio:65, wenn:()=> player.pouch.length >= 3,
           z1:'Drei Stapel. Der Antrag wartet.', z2:'K.', z2t:'Kessel.'},
  ult1:   {prio:40, wenn:()=> !!player.spellsKnown[ULT_SPELL.id],
           z1:'Der Ult-Knopf wartet weiter.', z2:'R.', z2t:'Der Ult-Knopf.'},
  amt1:   {prio:25, wenn:()=> AUSBAU_DEFS.some(d => amt.ausbauten[d.key] < d.max)
             && amt.bankGold >= Math.min(...AUSBAU_DEFS.filter(d => amt.ausbauten[d.key] < d.max).map(d => d.cost(amt.ausbauten[d.key]))),
           z1:'Immer noch flüssig. Amt wartet.', z2:'Nach Feierabend.', z2t:'Nach Feierabend.'},
};

// ===========================================================================
//  T3: Der Weltkommentar gehoert Anlage 2
//
//  Bis T2 lag hier RANDNOTIZ, Knoeterichs Pool aus sieben Anlaessen zu je vier
//  Zeilen. Beim Nachlesen fuer T3 stellte sich heraus, dass keine einzige
//  dieser achtundzwanzig Zeilen eine Taste erklaert: sie kommentieren einen
//  Treffer, einen Fund, einen Fluch, einen Stillstand. Das ist Welt, nicht
//  Geraet, und der Kanon sagt dazu seit W11 einen harten Satz: Knoeterich
//  erklaert Tasten, nie Zusammenhaenge.
//
//  Die Anlaesse wandern deshalb geschlossen zu Anlage 2, und zwar auf Ansage
//  des Projektinhabers ("zurueckfahren, nicht streichen"). Knoeterich behaelt
//  vollstaendig, was Bedienung ist: HINWEISE, ESCALATE_DEFS, die Beats, die
//  Begruessung, die Trank-Gags und den Steckenbleib-Schubs. Uebrig bleiben
//  zwei Stimmen mit klarer Zustaendigkeit, und man hoert den Unterschied:
//  der Amtston von oben erklaert das Geraet, die Beilage von innen die Welt.
//
//  Die Zeilen sind neu geschrieben und nicht umgehaengt. Dieselbe Lage, andere
//  Figur: wo Knoeterich "Vermerkt." sagte, weil er Buch fuehrt, sagt Anlage 2
//  etwas, das auf sich selbst verweist, weil sie eine Beilage ist.
//
//  Form: ein Pool je Anlass, Einzeiler im Deckel 44 wie die Randnotiz vorher.
//  Ein Eintrag ist entweder ein String oder ein Objekt {z, <Schalter>:<Wert>}
//  mit genau einem Schalter aus ZUSATZ_SCHALTER. Damit waechst der Kanal mit
//  dem Spielstand, ohne dass ein zweiter Mechanismus danebensteht: es ist
//  dieselbe Tabelle, die schon die Zusatzbloecke der Dorffiguren oeffnet.
//  Die gegateten Zeilen sind die waermeren. Das ist der ganze Bogen der Figur.
// ===========================================================================
const ANLAGE2_NOTIZ = {
  crit: ['Das saß. Und zwar richtig.',
         'Das Aktenzeichen steht klein am Rand.',
         'Sauber getroffen. Das können Sie also.',
         'Im Haus hieße das Bearbeitung. Hier: bumm.',
         'Getroffen. Ich habe zugesehen.',
         // T7: von Stufe 5 auf 3. Die waermsten Zeilen dieser Figur lagen hinter
         // Gates, die viele Spieler nie erreichen, und eine Zuneigung, die erst
         // nach Stunden anfaengt, ist im Zweifel gar keine.
         {z:'Sie werden besser. Ich merke sowas.', abStufe:3},
         {z:'Sie werden wirklich besser. Ehrlich.', merker:'anlage2Dank'}],
  ultimate: ['So viel Getöse. Mir gefällt es.',
             'Das Konfetti zahlt am Ende jemand.',
             'Ich lag schon bei ruhigeren Sachen.',
             'Beeindruckend. Und keiner hat gefragt.',
             {z:'Das hat keiner gesehen. Nur ich.', allein:true}],
  levelup: ['Eine Stufe höher. Titel gibt es später.',
            'Sie kommen voran. Weiß nur noch keiner.',
            'Ich merke mir das. Für uns beide.',
            'Eine Stufe höher. Das Geld nicht.',
            {z:'Jetzt haben Sie sogar einen Titel dafür.', abRang:1},
            {z:'Ich habe es mir gemerkt. Persönlich.', merker:'anlage2Dank'}],
  kammerAbbruch: ['Umdrehen ist auch eine Entscheidung.',
                  'Rückzug. Ohne Beute, aber ganz.',
                  'Nicht jede Tür will heute etwas von uns.',
                  'Leer ist auch eine Antwort.',
                  {z:'Keiner hat es gesehen. Auch gut.', allein:true}],
  fluch: ['Das Kleingedruckte. Ich mag sowas.',
          'Beglaubigt wurde es. Deshalb gibt es das.',
          'Das Kleingedruckte liest sonst niemand.',
          'Sie schreiben schneller als Zwirn.',
          'Steht alles drin. Wie bei mir auch.',
          {z:'Das wird langsam viel auf einmal.', abAkt:3}],
  goldfund: ['Geld. Ich sage es nur ungern.',
             'Geld. Irgendwer zählt das später.',
             'Geld ist Papier, das alle mögen.',
             'Schön. Und gleich will es jemand.',
             {z:'Ihr Fund. Ich sage nichts weiter dazu.', merker:'anlage2Dank'}],
  untaetigkeit: ['Sie stehen. Ich hänge. Passt gut.',
                 'Was liegen bleibt, steht irgendwann auf.',
                 'Die Wiese heißt amtlich Ablage A. Wirklich.',
                 'Pause. Ich sage keinem was.',
                 'Ich habe Jahrzehnte gewartet. Nur zu.',
                 'Stillstand. Da kenne ich mich aus.',
                 {z:'Wir zwei stehen hier ganz gut zusammen.', abSchicht:3},   // T7, siehe crit
                 {z:'Sie sehen nach. Wie besprochen.', merker:'anlage2Dank'},
                 {z:'Wir zwei. Sonst niemand. Angenehm.', allein:true}],
  // T4: die drei neuen Anlaesse. Sie schliessen die Luecken im Bogen, die T3
  // offengelassen hat, und zwar die drei schwersten Momente des Spiels: die
  // Niederlage, der Sieg ueber einen Endgegner und der Abstieg ins Schattenland.
  //
  // Zur Niederlage, denn sie ist die Entscheidung, an der diese Figur haengt:
  // Anlage 2 sagt hier NICHTS im Moment des Scheiterns. Sie sagt es beim
  // Wiederantritt. Der Unterschied ist die ganze Figur: wer jemandem in sein
  // Scheitern hineinredet, ist ein Kommentator, wer wartet, ist ein Begleiter.
  // Technisch traegt das kn.pending.niederlage, siehe anlage2Notiz() und knTick().
  niederlage: ['Sie sind wieder da. Gut.',
               'Weiter geht es. Wo waren wir.',
               'Das kommt vor. Öfter als man denkt.',
               'Sie durften wiederkommen. Schön.',
               {z:'Ich habe mir die Stelle gemerkt.', merker:'anlage2Dank'}],
  bosssieg: ['Erledigt. Das Wort hört man selten.',
             'Konfetti heißt: der Vorgang ist durch.',
             'Das ist durch. Endlich mal etwas.',
             'Dafür gibt es kein Formular. Gut so.',
             'Ich lag noch nie bei einem Sieg dabei.',
             {z:'Unter uns: das war beachtlich.', allein:true}],
  ebene: ['Ablage V. Der Korb, nie geleert.',
          'Tiefer als Ablage V geht es nicht.',
          'Hier antwortet niemand mehr.',
          'Tiefer geht die Ablage nicht.',
          'Dunkel. Immerhin bleicht hier nichts aus.',
          {z:'Bleiben Sie in meiner Nähe. Andersrum.', allein:true}],
};

// T4: der Umschlag. Zehn bis vierzehn Zeilen, jede genau einmal im ganzen
// Spiel, an den Stellen mit Gewicht. Das ist die Gegenmenge zum Kanal oben:
// dort Pools, aus denen gezogen wird, hier eine Liste, aus der verbraucht wird.
//
// Drei Regeln, und die dritte ist die schwerste:
//   1. kurz, ohne Pointe, ohne Maske
//   2. nur unter vier Augen (anlage2UmschlagTick prueft anlage2Allein())
//   3. KEIN Wort darueber, was sie dabei empfindet
// Die Bauform steht auf dem fuenften Blatt ihrer Einfuehrung und heisst dort
// "Sie lesen gerade.": eine Feststellung, dann eine hoefliche Einordnung, und
// dann Schluss. Wer beim Schreiben den Reflex verspuert, doch noch eine Pointe
// anzuhaengen, muss ihn aushalten. Genau das Weglassen ist hier die Figur.
//
// Die Reihenfolge ist die Auslieferungsfolge, wenn mehreres zugleich faellig
// ist. Jedes id braucht eine Stelle im Code, die es scharf schaltet, sonst ist
// es eine Zeile, die nie jemand hoert; anlage2Assert() prueft das gegen die
// Liste ANLAGE2_UMSCHLAG_GEARMT wie den Kanal gegen "gerufen".
const ANLAGE2_UMSCHLAG = [
  {id:'ersterTod',        z:'Sie waren kurz weg. Ich nicht.'},
  {id:'ersterFeierabend', z:'Feierabend. Ich bleibe in der Tasche.'},
  {id:'ersteKammer',      z:'Ein verschlossener Vorgang. Vorsicht.'},
  {id:'ersterBosssieg',   z:'Das war groß. Ich sage sonst nichts.'},
  {id:'ersteEbene',       z:'Es ist still hier. Das kenne ich.'},
  {id:'ersteSperrablage', z:'Tiefer war ich noch nie beigefügt.'},
  {id:'ersterRang',       z:'Ein neuer Titel. Der steht Ihnen zu.'},
  {id:'dank',             z:'Sie haben zugesagt. Ich vermerke das.'},
  {id:'ganzGelesen',      z:'Das waren alle Fragen. Ich habe mitgezählt.'},
  // T6: der einzige Nachhall der Scheinwahl, und er faellt nur, wenn der
  // Spieler bis zum gesperrten Knopf abgelehnt hat. Kein Vorwurf, keine
  // Anspielung auf den Schwindel des Hauses: sie stellt fest, dass beide
  // gezoegert haben, und stellt sich damit auf seine Seite. Der zweite Satz
  // ist der ganze Punkt, denn sie hat vierzig Jahre lang gezoegert zu fragen.
  {id:'zoegerlich',       z:'Sie haben lange überlegt. Ich auch.'},
  {id:'akt2',             z:'Zehn Schichten. Sie sind noch hier.'},
  {id:'akt3',             z:'Wir sind länger zusammen als üblich.'},
  {id:'akt4',             z:'Es wird ernst. Ich bleibe, wo ich bin.'},
  {id:'akt5',             z:'Was auch kommt: die Klammer hält.'},
];

// Die Sprueche beim Versuch, sie aus der Tasche zu bewegen. Der Projektinhaber
// hat sie ausdruecklich bestellt ("wenn man es bewegen will gibt's n Spruch.
// Gern mehrere bei jedem neuen Versuch"), und sie laufen DER REIHE NACH und
// nicht zufaellig. Das ist der Unterschied zwischen einem Pool und einem Bogen:
// die Liste faengt amtlich an und endet vertraut, und wer oft genug zieht,
// bekommt am Ende den Satz, um den es in dieser ganzen Figur geht.
//
// Sie wird vertrauter, nie schaerfer. Kein Eintrag schimpft, keiner belehrt von
// oben herab, keiner macht sich ueber den lustig, der zieht.
//
// T7 hat diesen Satz praezisiert, weil er zu weit gefasst war und dabei die
// falsche Sache verboten hat: gemeint ist "nie schaerfer GEGEN DEN SPIELER",
// nicht "nie laut". Hier in der Bewegungsreihe faellt beides zusammen und der
// Satz gilt woertlich weiter, denn wer zieht, ist immer der Spieler. Fuer die
// Anlaesse gilt er ab T7 nur noch in der ersten Fassung: sie darf hochfahren,
// gegen ein Verfahren, gegen ein Formular, gegen sich selbst. Nie gegen den,
// der zuhoert. Diese Grenze steht nicht nur hier, sie steht als Pruefung in
// anlage2Assert() (2c).
const ANLAGE2_BEWEGUNG = [
  'Das ist eine Heftklammer. Kein Vorschlag.',
  'Ich bin beigefügt. Das ist ein Zustand.',
  'Ausheften wäre ein Antrag. An wen denn?',
  'Wir hängen zusammen. Amtlich sogar.',
  'Sie zerren gerade an einer Urkunde.',
  'Ich bleibe. Sie gewöhnen sich daran.',
  'Ziehen Sie ruhig. Ich zähle nicht mit.',
  'Das ist jetzt schon fast ein Ritual.',
  'Ich weiß. Ich wäre auch neugierig.',
  'Sie sind der Erste, der es versucht.',
];

// ===========================================================================
//  T7: Der Ausbruch. Sie hatte einen Käfig und keinen Puls.
// ===========================================================================
//
// Der Befund, der diesen Abschnitt ausgeloest hat, stand nicht in einem Guard,
// sondern im Bestand: rund sechzig Zeilen, und praktisch jede folgt derselben
// Bauform. Eine Feststellung, dann ein zweiter kurzer Satz, der sie ins
// Amtliche dreht. Das ist ihre Haltung, und sie ist richtig. Aber eine Haltung
// ist kein Temperament, und wer sechzigmal dieselbe Kadenz hoert, hoert eine
// Figur, die nie ueberrascht wird.
//
// Zwei Regeln waren dafuer verantwortlich, und KEINE davon war die Brandmauer:
//   * der 44er-Deckel macht jede Zeile gleich lang, und gleiche Laenge klingt
//     nach gleichem Puls
//   * "vertrauter, nie schaerfer" (bei ANLAGE2_BEWEGUNG) war zu weit gefasst.
//     Gemeint war: nie schaerfer GEGEN DEN SPIELER. Dastehen tat: nie laut.
//
// Ein Ausbruch ist deshalb ZWEITEILIG, und das Paar ist die ganze Figur:
// sie faehrt hoch und faengt sich sofort wieder, weil sie eine Anlage ist.
//   auf      der Ausbruch. Kurz, unregelmaessig, Deckel 30 statt 44.
//   zurueck  die Ruecknahme, zwei Sekunden spaeter im selben Band.
// Zwei Baender uebereinander gibt es nicht (T3-6, das Band ist eine Flaeche
// und keine Liste), also loest der Takt das ab: erst der Ausbruch, dann faellt
// die Ruecknahme an dieselbe Stelle. Wer wegsieht, liest nur den zweiten Satz,
// und auch das stimmt dann.
//
// raten:true kennzeichnet die zweite Bauart, und sie ist der eigentliche Fund
// dieses Abschnitts: SIE DARF FALSCH LIEGEN. Eine Figur, die vorprescht und
// danebentippt, verraet nichts, sie KANN nichts verraten, sie war ja nicht
// eingeweiht. Das ist keine Umgehung der Brandmauer, das ist ihr staerkster
// Beweis, und es ist die waermste Stelle, die diese Figur haben kann: der
// Spieler weiss es besser, hoert sie raten und korrigiert sie nicht.
//
// Deshalb nimmt die Ruecknahme eines Rate-Paars die Vermutung ausdruecklich
// zurueck. Ein Tipp, der stehen bleibt, waere eine Behauptung ueber den Fall,
// und genau die darf sie nicht haben.
//
// Kein Ausbruch bei niederlage. T4 hat das entschieden und es bleibt: wer
// jemandem in sein Scheitern hineinredet, ist ein Kommentator, kein Begleiter.
const ANLAGE2_AUSBRUCH = {
  crit: [
    {auf:'Ja! Genau da hin.',        zurueck:'Verzeihung. Das war unsachlich.'},
    {auf:'Oh. Oh, das war gut.',     zurueck:'Ich sage sonst nichts dazu.'},
  ],
  ultimate: [
    {auf:'Was! Was war das denn!',   zurueck:'Ich habe mich erschrocken. Papier.'},
  ],
  levelup: [
    {auf:'Endlich! Endlich einmal.', zurueck:'Das kam zu laut. Ich nehme es zurück.'},
  ],
  goldfund: [
    {auf:'Das nehmen wir mit!',      zurueck:'Es steht mir nicht zu, das zu sagen.'},
    {auf:'Das ist der Haushaltsrest.', zurueck:'Oder auch nicht. Ich rate nur.', raten:true},
  ],
  fluch: [
    {auf:'Ich tippe auf Formfehler.', zurueck:'Vermutlich falsch. Ich lag nur dabei.', raten:true},
  ],
  kammerAbbruch: [
    {auf:'Da war bestimmt nichts drin.', zurueck:'Ich weiß es nicht. Ich rate.', raten:true},
  ],
  bosssieg: [
    {auf:'Das! Genau das eben!',     zurueck:'Entschuldigung. Ich bin nur Papier.'},
  ],
  ebene: [
    {auf:'Nein. Nein, nicht hier runter.', zurueck:'Sie gehen ja doch. Ich bleibe dran.'},
  ],
  untaetigkeit: [
    {auf:'Fragen Sie mich doch mal was.', zurueck:'Das war zu direkt. Bitte vergessen.'},
  ],
};

// ===========================================================================
//  T8: DIE DREI SZENEN-ANLAESSE
//
//  Seit SZ2 setzen die Szenen einen Anlass, wenn sie zu Ende sind, und Lott
//  und Pahl kommentieren ihn von der Bank aus. Anlage 2 hing daran nicht: die
//  drei lautesten Stellen der Weltgeschichte gingen an der einzigen Figur
//  vorbei, die dem Spieler dabei die ganze Zeit in der Tasche liegt.
//
//  Diese Zeilen sind anders gebaut als alles andere an ihr, und der Grund ist
//  eine einzige Eigenschaft: SIE FALLEN GENAU EINMAL PRO SPIELSTAND. Daraus
//  folgt der Rest von selbst.
//
//  Kein Pool, kein Wuerfel, kein Anlass-Array. Ein Pool existiert, damit
//  Wiederholung nicht auffaellt, und hier gibt es keine Wiederholung. Ein
//  Anlass traegt deshalb GENAU EIN Paar, und zwar strukturell und nicht per
//  Guard: die Tabelle bildet auf ein Objekt ab und nicht auf eine Liste, dann
//  laesst sich ein zweites gar nicht erst hinschreiben. In dieser Datei steht
//  an keiner Stelle dieses Kanals ein Math.random().
//
//  Kein Ruhezaehler. Der Zaehler aus T7 macht den Ausbruch selten; was einmal
//  im ganzen Spiel faellt, ist selten, und ein Zaehler daneben waere eine
//  zweite Wahrheit ueber dieselbe Frage. Er wird von diesem Kanal deshalb auch
//  nicht hochgezaehlt: er misst, wie lange sie in dem Kanal gefasst war, der
//  ausbrechen KANN, und dieser kann es nicht.
//
//  z1/z2 und nicht auf/zurueck. Die Form ist dieselbe wie beim Ausbruch (erste
//  Haelfte, zwei Sekunden, zweite Haelfte im selben Band), die Stimme ist es
//  nicht: hier faehrt niemand hoch und nimmt nichts zurueck. z1/z2 ist die
//  Hausform fuer ein zweiteiliges Wort, sie steht so an jeder Dorffigur, und
//  der Deckel ist derselbe wie im Kommentarkanal (44), nicht der enge des
//  Ausbruchs. Wer die Felder auf/zurueck sieht, soll den lauten Kanal vor sich
//  haben und sonst nichts.
//
//  DIE BRANDMAUER an dieser Stelle: die drei Szenen sind die Akte, und sie ist
//  nicht eingeweiht. Beide Zeilen halten deshalb dieselbe Regel wie ihre
//  uebrigen, nur ist sie hier schwerer: gesagt wird etwas ueber das HAUS in
//  dem Moment, in dem gerade die AKTE spricht.
//    umlauf       Sie redet ueber ihren eigenen Weg durch das Haus, nicht
//                 ueber Hochablage, das sie nie gesehen hat.
//    hintermuehl  Sie redet ueber Knoeterichs Gewohnheit, nicht ueber das
//                 Wort. Was Hintermuehl ist, weiss sie nicht, und sie tut
//                 auch nicht so. Der Satz traegt trotzdem die ganze Szene,
//                 denn wer den Mann kennt, versteht, was gerade geschah.
//
//  VORBLATT SCHWEIGT, und das ist eine Entscheidung und kein Vergessen. Bei
//  der Entklammerung wird einem Papier die Klammer gezogen, und Anlage 2 ist
//  ein Papier mit einer Klammer; es waere die naheliegendste Zeile des ganzen
//  Spiels. Sie faellt trotzdem weg. Vorblatt ist der Gegenspieler aus Akt IV,
//  und jeder Satz, den sie ueber ihn sagt, ist ein Satz ueber den Fall. Ihr
//  Schweigen ist an dieser Stelle die staerkere Aussage: ein Blatt sagt
//  nichts, wenn ein Blatt aufgemacht wird. Damit die Stille eine gepruefte
//  Zusage bleibt und nicht beim naechsten Bauabschnitt still zurueckkippt,
//  steht sie als eigener Zweig in anlage2Assert(), wie niederlage im Ausbruch.
// ===========================================================================
const ANLAGE2_SZENE = {
  umlauf:      {z1:'Umlauf. So heißt auch mein Weg hierher.',
                z2:'Sie läuft ihn. Mich hat man getragen.'},
  hintermuehl: {z1:'Er sagt sonst nur, was er aufschreibt.',
                z2:'Das eben hat er nicht aufgeschrieben.'},
};

// ===========================================================================
//  F1b: Die Schalter eines Zusatzblocks, und die Kurzform-Tabelle
//
//  Bis W11 hatte ein Zusatzblock genau zwei mögliche Schalter, abAkt und merker,
//  und figZusatz() prüfte sie mit einem Ternär. F1 braucht sechs weitere, und
//  acht Zweige nebeneinander wären der Punkt, an dem eine Tabelle billiger ist
//  als Code. Wichtiger als die Kürze ist aber, dass es GENAU EINE Tabelle gibt:
//  figZusatz() liest sie, um zu entscheiden, knAssertCaps() liest dieselbe, um zu
//  prüfen. Zwei Listen wären zwei Wahrheiten, und die zweite driftet (W5/W6).
//
//  frei(w, z)  entscheidet, ob der Block offen ist. w ist der Wert des Schalters,
//              z der Block selbst (nur skill braucht ihn, wegen ab:).
//  pruef(w, z) meldet einen Text, wenn der Wert unbrauchbar ist, sonst null.
//              Läuft auf Skriptebene in knAssertCaps() und darf deshalb nichts
//              anfassen, was erst weiter unten deklariert wird. frei() darf es,
//              weil es erst zur Laufzeit gerufen wird.
//
//  Die Obergrenzen sind keine Willkür, sondern die Reichweite des Spiels: fünfzig
//  Schichten sind fünf Akte, die zehnte Rangstufe liegt hinter der fünfzigsten
//  Schicht, der Monsterkatalog spannt die Stufen 1 bis 10 und das Ultimate liegt
//  auf 13. Was darüber steht, ist kein hoher Anspruch, sondern ein Tippfehler,
//  und genau den soll die Prüfung finden.
// ===========================================================================
const ZUSATZ_SCHALTER = {
  abAkt:     {frei: w => !CONFIG.schichtModus || aktStand() >= w,
              pruef: w => (w >= 1 && w <= 5) ? null : 'nennt einen Akt, den es nicht gibt: ' + w},
  merker:    {frei: w => !!kn.flags[w],
              pruef: w => (w in kn.flags) ? null : 'nennt einen Merker, den es nicht gibt: ' + w},
  // LV4: der neunte Schalter. Er liest einen abgeschlossenen Langvorgang statt
  // eines Merkers im Spielstand, und das ist keine Bequemlichkeit, sondern die
  // W7-Doktrin: jede Belohnung eines Strangs ist ein abgeleiteter Lesevorgang
  // von langFertig(key) an der Stelle, die sie betrifft. Ein zweiter Merker
  // neben kladde.lang wäre eine zweite Wahrheitsquelle für denselben
  // Fortschritt, also genau die Falle aus Fund F1 der W7-Phase.
  //
  // pruef prüft hier NUR die Form, und das ist begründet: LANGVORGAENGE ist eine
  // const rund 6000 Zeilen weiter unten, knAssertCaps() läuft auf Skriptebene,
  // ein Zugriff von hier liefe in die Temporal Dead Zone (F1-Fund 2, W7-Umzug
  // der beiden Guard-Selbstaufrufe). Dass der Schlüssel wirklich einen Strang
  // trifft, prüft langAssert() Punkt (11), und der läuft hinter der Tabelle.
  lang:      {frei: w => langFertig(w),
              pruef: w => (typeof w === 'string' && w) ? null : 'nennt keinen Langvorgang: ' + w},
  abSchicht: {frei: w => !CONFIG.schichtModus || amt.schichten >= w,
              pruef: w => (w >= 1 && w <= 50) ? null : 'nennt eine Schicht ausserhalb der fünfzig: ' + w},
  abStufe:   {frei: w => player.level >= w,
              pruef: w => (w >= 1 && w <= 20) ? null : 'nennt eine Stufe, die niemand erreicht: ' + w},
  abRang:    {frei: w => !CONFIG.schichtModus || rangStufe() >= w,
              pruef: w => (w >= 1 && w <= 10) ? null : 'nennt eine Rangstufe, die es nicht gibt: ' + w},
  skill:     {frei: (w, z) => player.skills[w] >= (z.ab || 1),
              pruef: (w, z) => !(w in {str:1, vit:1, agi:1, int:1}) ? 'nennt eine Befähigung, die es nicht gibt: ' + w
                             : !(z.ab >= 1 && z.ab <= 30) ? 'nennt einen Punktestand, den niemand erreicht: ' + z.ab : null},
  zauber:    {frei: w => !!player.spellsKnown[w],
              pruef: w => SPELLS.some(sp => sp.id === w) ? null : 'nennt einen Zauber, den es nicht gibt: ' + w},
  zweig:     {frei: w => kenntZweig(w),
              pruef: w => (w === 0 || w === 1 || w === 2) ? null : 'nennt einen Zauberzweig, den es nicht gibt: ' + w},
  // Die einzige Bedingung, die wieder falsch werden kann. Das ist gewollt und
  // ungefährlich: npcCycle() hält den Zeiger per Modulo im Bereich, der Spieler
  // sieht dann die nächste Zeile und keinen Fehler. Ohne Schichtmodus gibt es
  // keine Schichtuhr, dort steht beides offen, wie bei serieFrei() und figDa().
  phase:     {frei: w => !CONFIG.schichtModus ? true
                       : w === 'antritt' ? shiftT > 0.75 * CONFIG.schichtDauer
                                         : shiftT < 0.25 * CONFIG.schichtDauer,
              pruef: w => (w === 'antritt' || w === 'feierabend') ? null : 'nennt eine Schichtphase, die es nicht gibt: ' + w},
  // T4: der elfte Schalter, und der erste, der nicht den Fortschritt liest,
  // sondern den Ort. Eine so gegatete Zeile faellt nur, wenn keine Dorffigur in
  // der Naehe steht. Das ist Anlage 2s zweite Bühne: unter vier Augen wird sie
  // leiser und echter, in Hoerweite bleibt sie die Beilage.
  //
  // Der Schalter kennt nur den Wert true. Ein "allein:false" waere die Aussage
  // "diese Zeile faellt nur vor Publikum", und die gibt es bei ihr nicht: sie
  // BEMERKT ihr Publikum nicht (der blinde Fleck, siehe figuren-leben.md). Wer
  // hier false schreibt, hat die Figur missverstanden, und pruef sagt es ihm.
  //
  // frei ruft anlage2Allein(), deklariert im T3-Block weiter unten. Das ist
  // erlaubt und dieselbe Bauart wie lang -> langFertig(): frei laeuft erst zur
  // Laufzeit. pruef fasst dagegen keinen Spielzustand an, es prueft nur den
  // Wert, und darf deshalb in knAssertCaps() auf Skriptebene laufen.
  allein:    {frei: w => !w || anlage2Allein(),
              pruef: w => w === true ? null : 'allein kennt nur true, nicht: ' + w},
};

// Woher ein Anlass kommt. Ein Pool an einer Figur, den nichts auslöst, ist eine
// Zeile, die nie jemand hört, und das ist derselbe stumme Fall, den GW14 bei den
// Grundzeilen gefunden hat. Der Weltkommentar liefert die Schlüssel (bis T2 aus
// RANDNOTIZ, seit T3 aus ANLAGE2_NOTIZ), SZENE_ANLASS die aus den Szenen; weil
// letzteres erst weit unten steht, stehen seine Werte hier als Liste und werden
// dort gegengeprüft.
const ANLASS_QUELLEN = ['umlauf', 'hintermuehl', 'vorblatt'];   // SZ3: der Nachklang der Entklammerung

// ---------------------------------------------------------------------------
//  Die Kurzform. Behörden kürzen ab, und diese hier tut es, seit es sie gibt.
//  Die Tabelle ist die EINZIGE Stelle, an der die Langformen stehen; wer ein
//  Kürzel in eine Sprechblase schreibt, das hier fehlt, bekommt es beim nächsten
//  Start gemeldet. Herkunft und Begründung je Eintrag: figuren-leben.md.
//
//  wo: die Figur, bei der das Kürzel im Spiel aufgeht. Der Guard prüft, dass es
//  sie gibt; ein Kürzel ohne Auflösestelle ist kein Gag, sondern eine
//  verschlossene Tür.
//
//  Nicht in dieser Tabelle steht der Vorgang 1, und das ist der Witz: er hat in
//  vierhundert Jahren nie ein Kürzel bekommen, weil ihn nie jemand oft genug
//  erwähnt hat, als dass sich das Abkürzen gelohnt hätte. Wer ihm eines gibt,
//  nimmt Akt V seine Pointe.
// ---------------------------------------------------------------------------
const ABKUERZUNGEN = {
  'N. N.':     {lang: 'nicht genannt',                        wo: 'bramsche'},
  'a. D.':     {lang: 'außer Dienst',                         wo: 'knoeterich'},
  'n. O.':     {lang: 'nach der Ordnung',                     wo: 'bramsche'},
  'TNM':       {lang: 'Tägliche Niederschlagsmeldung',        wo: 'nieselbeck'},
  // T1: die Familie der Meldekuerzel. Sie zaehlt gegen die Zwoelf aus Kapitel 13
  // als EINE Position, und die Bedingung dafuer steht im Guard am Ende von
  // szeneAssert(): jede Langform faellt woertlich in Nieselbecks eigenem Baum,
  // eine Nachfrage entfernt. Sie stehen nur in seinen Zeilen und nirgends sonst.
  'Mg.':       {lang: 'Menge',                                wo: 'nieselbeck'},
  'Da.':       {lang: 'Dauer',                                wo: 'nieselbeck'},
  'Ba.':       {lang: 'Bodenart',                             wo: 'nieselbeck'},
  'Anm.':      {lang: 'Anmerkungen',                          wo: 'nieselbeck'},
  'Vlg.':      {lang: 'Veranlassung',                         wo: 'nieselbeck'},
  'MfM':       {lang: 'Ministerium für Monsterangelegenheiten', wo: 'bramsche'},
  'T.':        {lang: 'die TNM, noch einmal gekürzt',         wo: 'bramsche'},
  'GA':        {lang: 'Gutachterliche Ansetzung',             wo: 'milb'},
  'ZB':        {lang: 'Zwischenbescheid oder Zuständigkeitsbereich', wo: 'bramsche'},
  'AL':        {lang: 'Amtsleitung oder Anhängige Lage',      wo: 'bramsche'},
  'V. u. g.':  {lang: 'vorgelesen und genehmigt',             wo: 'zapf'},
};

// Was wie ein Kürzel aussieht und keins ist. Kurz gehalten und einzeln begründet,
// damit die Liste nicht zur Hintertür wird:
//   römische Zahlen  Zuständigkeitsbereich VII, Ablage V, Akt III
//   Versalien        IM TERMIN auf dem Türschild, Urkundenzeilen in Großschrift
//   Tastennamen      WASD. Eine Taste ist keine Abkürzung dieser Welt, sondern
//                    Eingabe, und Knöterich erklärt Tasten. Der Guard hat sie
//                    beim ersten Lauf gemeldet, und das war richtig von ihm.
const ABK_ROEMISCH = /^[IVXLC]+$/;
const ABK_AUSNAHME = ['IM', 'TERMIN', 'ZUM', 'FÜRST', 'BLATT', 'ANLAGE', 'ABLAGE', 'WASD'];
// Zwei Muster: Großbuchstabenfolgen mit mindestens zwei Versalien, und
// Punktkürzel der Form "X. Y." samt der zusammengeschriebenen Fassung "X.Y.",
// die im Bestand beide vorkommen. Die Schreibweise wird vor dem Nachschlagen
// vereinheitlicht.
//
// Die Wortgrenze steht hier als Lookaround und nicht als \b, und das ist kein
// Geschmack, sondern ein gemessener Befund: \b ist in JavaScript ASCII-basiert,
// und damit liegt zwischen T und ü eine Wortgrenze. Mit \b hat dieses Muster
// beim ersten Lauf 117 Meldungen erzeugt, darunter "Tü" aus Tür und "Fü" aus
// Fürst. Die Lookarounds kennen die Umlaute und zählen sie zum Wort.
const ABK_GROSS = /(?<![A-Za-zÄÖÜäöüß])[A-ZÄÖÜ]{1,2}[a-zäöüß]?[A-ZÄÖÜ]{1,3}(?![A-Za-zÄÖÜäöüß])/g;
const ABK_PUNKT = /(?<![A-Za-zÄÖÜäöüß])[A-Za-zÄÖÜäöü]\.(?:\s?[A-Za-zÄÖÜäöü]\.)+/g;
const abkNorm = k => k.replace(/\.\s*/g, '. ').trim();

function knOrdinal(n){
  const W = ['Nullte','Erste','Zweite','Dritte','Vierte','Fünfte','Sechste','Siebte','Achte','Neunte','Zehnte'];
  return W[n] || (n + '.');
}
const KN_TRAENKE_GAGS = {3:'Ihr dritter Trank.', 7:'Ihr siebter Trank. Ich führe Buch.',
                          12:'Zwölf Tränke. Das ist ein Muster.', 20:'Zwanzig. Ich habe eine Spalte angelegt.'};

// --- Zeichendeckel-Assertion: läuft einmal beim Start über alle Tabellen,
// Touch-Fassungen und Beats inklusive, mit dem längstmöglichen Wert je Zeile.
// W11: Wortformen, die den Kaiser ins Perfekt oder Praeteritum setzen. Absichtlich
// eine kurze, wortnahe Liste statt einer Grammatik: sie soll den Fall finden, der
// beim Schreiben passiert ("der Kaiser war", "Ordinat starb"), und nicht jeden
// Nebensatz verdaechtigen, in dem das Wort vorkommt.
const KAISER_PRAETERITUM =
  /(Kaiser|Ordinat|Majestät)[^.!?]{0,40}\b(war|waren|wurde|hatte|starb|verstarb|regierte|lebte|gewesen|gestorben)\b/i;

function knAssertCaps(){
  const rows = [];
  for(const h of HINWEISE) rows.push([h.z1,48],[h.z2,32],[h.z2t,32]);
  for(const id in ESCALATE_DEFS){ const e = ESCALATE_DEFS[id]; rows.push([e.z1,48],[e.z2,32],[e.z2t,32]); }
  rows.push(['Knöterich. Monstralministerium.',48],['Sie sind Außendienst. WASD.',32],['Außendienst. Daumen links.',32]);
  rows.push(['Geht doch. Schellen zählt als Sachbearbeitung.',48],['Aufheben, was liegt.',32]);
  rows.push(['Befugnis erteilt. Der Punkt liegt bereit.',48],['T. Aussuchen.',32],['Der Stern im Gürtel.',32]);
  rows.push(['Sie schlagen nur. Es gibt auch Zauber.',48],['E.',32],['Der Zauberknopf.',32]);
  rows.push(['Sie sammeln Punkte und vergeben keine.',48],['Inventar. I.',32],['Rucksack. Oben die vier Zeilen.',32]);   // S1
  rows.push(['Zutaten allein werden nichts.',48],['Zum Kessel. K.',32],['Rucksack, dann Kessel.',32]);
  rows.push(['Da draußen stehen verschlossene Türen.',48],['Gebührenbescheid. F.',32],['Die Hand im Gürtel.',32]);
  // T3: der Weltkommentar liegt jetzt bei Anlage 2. Er laeuft durch denselben
  // Deckel und dieselben sechs Textpruefungen wie vorher Knoeterichs Randnotiz,
  // denn er steht in demselben Band. Ein Eintrag ist ein String oder ein
  // {z, <Schalter>}-Objekt; die Schalterpruefung selbst macht anlage2Assert(),
  // hier geht es nur um den Text. Dasselbe fuer die Bewegungssprueche.
  for(const anlass in ANLAGE2_NOTIZ) for(const e of ANLAGE2_NOTIZ[anlass]) rows.push([typeof e === 'string' ? e : e.z, 44]);
  for(const l of ANLAGE2_BEWEGUNG) rows.push([l,44]);
  // T4: der Umschlag steht im selben Band und laeuft deshalb durch denselben
  // Deckel und dieselben sechs Textpruefungen. Er darf nicht laenger sein, nur
  // weil er stiller ist.
  for(const u of ANLAGE2_UMSCHLAG) rows.push([u.z,44]);
  // T7: der Ausbruch bekommt einen eigenen Deckel, und das ist nicht Bequemlichkeit,
  // sondern der Befund dieses Abschnitts: 44 fuer alles machte jede Zeile gleich
  // lang, und gleiche Laenge klingt nach gleichem Puls. Der Ausbruch ist kurz
  // (30), die Ruecknahme darf sich Zeit nehmen (40). Die sechs Textpruefungen
  // dahinter laufen unveraendert ueber beide Haelften.
  for(const a in ANLAGE2_AUSBRUCH) for(const p of ANLAGE2_AUSBRUCH[a]) rows.push([p.auf,30],[p.zurueck,40]);
  // T8: die Szenenzeilen liegen wieder auf 44, auf beiden Haelften. Sie sind
  // keine Ausbrueche, sie sind zwei ruhige Saetze mit einer Pause dazwischen,
  // und der enge Deckel des lauten Kanals waere hier eine Zusage ueber einen
  // Ton, den diese Zeilen nicht haben.
  for(const a in ANLAGE2_SZENE) rows.push([ANLAGE2_SZENE[a].z1,44],[ANLAGE2_SZENE[a].z2,44]);
  for(const s in KN_TRAENKE_GAGS) rows.push([KN_TRAENKE_GAGS[s],44]);
  // W3: Dorf-Figuren, gleicher Deckel wie Knöterichs Kanäle (z1<=48, z2<=32,
  // Einzeiler<=44). antworten/abweisung/anlass sind optionale Felder.
  // U6: Knöterich läuft ab hier durch dieselbe Prüfung. Seine Tafelzeilen sind
  // Sprechblasen wie alle anderen, und die Strukturzusicherung (sechs
  // Grundzeilenpaare, fünf Aktzeilen, keine leer) gilt für ihn genauso: eine
  // fehlende Aktzeile wäre bei ihm ebenso eine stumme Figur wie im Dorf.
  for(const fig of DORF_FIGUREN.concat([KN_FIGUR])){
    // GW14: Strukturzusicherung. Ohne sie fiele eine Figur mit zu kurzer Tabelle
    // stumm aus — drawBubble() steigt bei leerem Text wortlos aus, und der Guard
    // iterierte nur, was da ist, statt zu prüfen, dass alles da ist.
    if(fig.grund.length !== 6) rows.push([null,0,'Figur ' + fig.key + ' hat ' + fig.grund.length + ' Grundzeilenpaare statt 6']);
    if(fig.akt.length !== 5)   rows.push([null,0,'Figur ' + fig.key + ' hat ' + fig.akt.length + ' Aktzeilen statt 5']);
    // W11: Eine Figur mit abAkt:N ist in den Akten davor nicht im Dorf und hat
    // dort folgerichtig keinen Satz. Der leere String ist also gewollt, aber nur
    // genau dort: ab abAkt muss jede Aktzeile stehen. Ohne diese Prüfung wäre
    // eine versehentlich leere Zeile weiter hinten eine stumme Figur, und genau
    // dieser Fall ist der Grund, aus dem es die Strukturzusicherung gibt.
    for(let i = 0; i < fig.akt.length; i++){
      const stumm = i + 1 < (fig.abAkt || 1);
      if(stumm && fig.akt[i] !== '')
        rows.push([null,0,'Figur ' + fig.key + ' hat eine Aktzeile für Akt ' + (i+1) + ', steht dort aber noch nicht im Dorf']);
      if(!stumm && !fig.akt[i])
        rows.push([null,0,'Figur ' + fig.key + ' hat keine Aktzeile für Akt ' + (i+1)]);
    }
    // G6: gestalt:{} gilt jetzt für jede Figur, bei opt:'fest' als Aussehen und
    // bei opt:'wander' als Ersatz für ein fehlendes CF_NPCS-Blatt. Beides muss
    // da sein, sonst steht die Figur unsichtbar im Dorf, und genau das war der
    // Zustand, den dieser Guard hätte melden sollen und nicht gemeldet hat.
    //
    // G8: seit komposit:true ist das Komposit für die Wandernden nicht mehr der
    // Ersatz, sondern der Regelfall. sheet: bleibt trotzdem Pflicht — es ist der
    // Weg zurück, und ein Flag zu streichen soll nicht bedeuten, dass eine Figur
    // danach ohne Blatt dasteht. Farben und Stufen prüft figurenFarbenAssert().
    if(fig.opt === 'wander' && !fig.sheet) rows.push([null,0,'Figur ' + fig.key + ' ohne Sprite']);
    if(!fig.gestalt || !fig.gestalt.hair) rows.push([null,0,'Figur ' + fig.key + ' ohne Gestalt']);
    for(const p of fig.grund) rows.push([p.z1,48],[p.z2,32]);
    for(const a of fig.akt) rows.push([a,44]);
    if(fig.antworten) for(const qa of fig.antworten) rows.push([qa.z1,48],[qa.z2,32]);
    if(fig.abweisung) for(const ab of fig.abweisung) rows.push([ab.z1,48],[ab.z2,32]);
    if(fig.anlass) for(const key in fig.anlass) for(const p of fig.anlass[key]) rows.push([p.z1,48],[p.z2,32]);
    // W-Nörgel: zusatz sind Sprechblasen wie alle anderen, derselbe Deckel. Der
    // Merkername wird mitgeprüft: ein Tippfehler darin fiele sonst nirgends auf,
    // die Zeilen wären schlicht nie zu sehen, und genau so eine stumme Figur ist
    // der Fall, den dieser Guard seit GW14 melden soll.
    if(fig.zusatz) for(const z of fig.zusatz){
      // W11: Ein Block hängt an genau einem Schalter, nie an zweien und nie an
      // keinem. Ohne Schalter wären die Zeilen von Anfang an da, mit zweien wäre
      // nicht zu sagen, welcher gilt. F1b: aus zwei möglichen Schaltern sind acht
      // geworden, die Regel ist dieselbe geblieben, und gezählt wird jetzt gegen
      // dieselbe Tabelle, aus der figZusatz() liest.
      const genannt = Object.keys(ZUSATZ_SCHALTER).filter(k => k in z);
      if(genannt.length !== 1)
        rows.push([null,0,'Figur ' + fig.key + ' hat einen Zusatzblock mit ' + genannt.length + ' Schaltern statt genau einem']);
      for(const k of genannt){
        const m = ZUSATZ_SCHALTER[k].pruef(z[k], z);
        if(m) rows.push([null,0,'Figur ' + fig.key + ' ' + m]);
      }
      // ab: gehört zu skill und sonst nirgendwohin. Ein ab: an einem anderen
      // Schalter sähe aus wie eine Bedingung und wäre keine.
      if('ab' in z && !('skill' in z))
        rows.push([null,0,'Figur ' + fig.key + ' hat ein ab ohne skill']);
      for(const p of z.zeilen) rows.push([p.z1,48],[p.z2,32]);
    }
    // F1b: Ein Anlass-Pool, den nichts auslöst, ist eine Zeile, die nie jemand
    // hört. Die Schlüssel kommen aus dem Weltkommentar (bis T2 RANDNOTIZ, seit
    // T3 ANLAGE2_NOTIZ) und aus den Szenen (SZENE_ANLASS, hier als
    // ANLASS_QUELLEN, weil die Tabelle selbst erst weit unten steht und von
    // hier aus in der TDZ läge). Die Bank kommentiert damit unverändert
    // weiter, was gerade geschehen ist: der Kanal hat den Sprecher gewechselt,
    // nicht die Schlüssel.
    if(fig.anlass) for(const key in fig.anlass){
      if(!(key in ANLAGE2_NOTIZ) && ANLASS_QUELLEN.indexOf(key) < 0)
        rows.push([null,0,'Figur ' + fig.key + ' wartet auf einen Anlass, den nichts auslöst: ' + key]);
    }
  }
  // Das Rekord-Suffix aus knBegruessungLine() steht hier bewusst nicht: es prüft seine
  // Gesamtlänge dort selbst gegen 44 und fällt sonst auf die Grundzeile zurück. Der
  // Jahresgespräch-Satz ebenso wenig, der ist freier Panel-Text ohne Zeichendeckel.
  // Die Anrede (18.5) aus derselben Funktion steht hier ebenfalls nicht, und zwar
  // zwingend: knAssertCaps() ruft sich unten selbst auf, lange bevor RAENGE und
  // rangStufe() deklariert sind. Ein Zugriff von hier wäre ein ReferenceError durch
  // Temporal Dead Zone, den node --check nicht findet. Geprüft wird sie stattdessen
  // in anredeAssert(), unmittelbar hinter dem Rangblock.
  for(let n=1;n<=12;n++) rows.push([knOrdinal(n)+' Schicht. Die Akte wird dick.',44]);
  let ok = true;
  const fehler = (m, ...r) => { ok = false; console.error('Knöterich:', m, ...r); };
  // GW14: Bis hierher prüfte dieser Guard ausschließlich die Länge — als einziger
  // der Text-Guards. DORF_FIGUREN ist mit rund 350 Strings der grösste
  // Sprechblasenkorpus des Spiels, und Kapitel 7 der Weltbibel nennt ihn
  // ausdruecklich als sperrvermerkrelevant. Der Bestand war sauber, aber nichts
  // hielt ihn sauber: die dreistufige Pruefung aus figuren-dorf.md war eine
  // einmalige Sitzung, und W5 hat seither drei Zeilen umformuliert.
  for(const [txt,cap,strukturfehler] of rows){
    if(strukturfehler){ fehler(strukturfehler); continue; }
    if(typeof txt !== 'string' || !txt) continue;   // z2t und optionale Felder duerfen fehlen
    if(txt.length > cap) fehler('Zeichendeckel verletzt:', JSON.stringify(txt), txt.length, '>', cap);
    if(txt.indexOf('undefined') >= 0) fehler('undefined im Text:', txt);
    if(/[—–]/.test(txt)) fehler('Gedankenstrich:', txt);
    if(PRUEF_EMOJI.test(txt)) fehler('Emoji:', txt);
    for(const g of PRUEF_GEHEIM) if(txt.indexOf(g) >= 0) fehler('Sperrvermerk: Kesselgrammatik im Text:', g, txt);
    // W11: Der Kaiser ist aktenkundig lebendig. Er ist im Termin, seit dem Jahr
    // 588, und niemand in dieser Welt zweifelt daran. Sobald eine einzige Figur
    // ihn in der Vergangenheitsform erwähnt, ist die Welt eine andere: dann ist
    // er tot, dann weiß es jemand, dann ist die ganze Pointe des fünften Aktes
    // vorweggenommen. Deshalb steht diese Regel als Prüfung im Code und nicht
    // nur als Satz in einem Dokument.
    if(KAISER_PRAETERITUM.test(txt)) fehler('Der Kaiser steht in der Vergangenheit:', txt);
    // F1b: Der laufende Gag über die Kurzform hat eine Bedingung, ohne die er zur
    // Zumutung wird: jedes Kürzel ist im Spiel auflösbar. Geprüft wird deshalb
    // nicht, ob abgekürzt wird, sondern ob das Kürzel in ABKUERZUNGEN steht, wo
    // seine Langform und seine Auflösestelle stehen. Ein dreizehntes fällt damit
    // beim nächsten Start auf und nicht erst der Spielerin in Akt IV.
    for(const roh of (txt.match(ABK_PUNKT) || [])){
      const k = abkNorm(roh);
      if(!(k in ABKUERZUNGEN)) fehler('Abkürzung ohne Eintrag in ABKUERZUNGEN:', k, 'in', txt);
    }
    for(const k of (txt.match(ABK_GROSS) || [])){
      if(ABK_ROEMISCH.test(k) || ABK_AUSNAHME.indexOf(k) >= 0) continue;
      if(!(k in ABKUERZUNGEN)) fehler('Abkürzung ohne Eintrag in ABKUERZUNGEN:', k, 'in', txt);
    }
  }
  // F1b: und die Gegenrichtung. Ein Kürzel, dessen Auflösestelle es nicht gibt,
  // ist eine verschlossene Tür, und das ist genau der Fall, den der Gag nicht
  // haben darf. Knöterich steht nicht in DORF_FIGUREN und ist deshalb genannt.
  for(const k in ABKUERZUNGEN){
    const wo = ABKUERZUNGEN[k].wo;
    if(!ABKUERZUNGEN[k].lang) fehler('Abkürzung ohne Langform:', k);
    if(wo !== 'knoeterich' && !DORF_FIGUREN.some(f => f.key === wo))
      fehler('Abkürzung ohne Auflösestelle:', k, 'verweist auf', wo);
  }
  console.assert(ok, 'Knöterich: Assertion fehlgeschlagen, siehe Konsole.');
  return ok;
}
knAssertCaps();

// --- Laufzeitzustand (nicht persistiert, lebt nur für die Sitzung) ---------
let knPlayStartT = -999;          // gameT beim letzten Wechsel nach state==='play'
const knSessionStart = 0;         // gameT läuft ab Skriptstart bei 0, siehe let gameT weiter unten
let knLastZettelT = -999, knBudgetShown = 0;
let knLastRandnotizT = -999, knRandLastLine = {};
let knIdleT = 0, knFrameCtr = 0, knClosingId = null, knNfIdx = -1, knBegruessungPending = null;
let knCurseWasOn = false;
// T7: die offene Klammer eines Ausbruchs, {z, at}. Laufzeit und nie
// persistiert, und das ist keine Sparsamkeit: eine Ruecknahme, die einen
// Neustart uebersteht, faellt zu einem Ausbruch, den niemand mehr gehoert hat.
// Wer den Browser mitten im Satz schliesst, hat den Satz nicht gehoert.
let a2Nachklapp = null;
// Je Ruhephase genau ein Steckenbleib-Schubs (gameplay:346/448) und genau eine
// Zeile zur Untätigkeit. knIdleT bleibt die eine monotone Uhr für beide Schwellen
// (25s Notiz, 50s Schubs, gameplay:380); die Einmaligkeit hängt an diesen Merkern.
// T3: den Schubs gibt weiter Knöterich, die Zeile zur Untätigkeit sagt seit
// diesem Abschnitt Anlage 2. Zwei Stimmen, dieselbe Uhr.
let knStuckArmed = true, knIdleNotizDone = false;
const knBubble = {visible:false, text1:'', text2:'', wasIn:false, enterT:0};
const knZettel = {active:false};
const knRand = {active:false};
// W3: Sitzungszustand für Dorf-Figuren, nicht persistiert, wie kn.history schon
// nicht die Anlässe selbst speichert, sondern nur gezeigte Zettel.
// W7 Nr. 2: aus dem Boolean ist ein Zähler geworden. Mit abgeschlossener
// Anlage 3 gibt die Registratur zwei Fragen pro Schicht statt einer.
let letzterAnlass = null, bramscheFragen = 0;
let bramscheLastAntwort = null;   // W6: Wiederholungssperre, gleiches Vorbild wie knRandLastLine
// W7: "höchstens einmal je Schicht"-Merker der Langvorgänge. Steht hier oben bei
// den übrigen Sitzungsvariablen, damit nichts weiter unten in die TDZ läuft —
// langEreignis() hängt am selben Trichter wie auftragEreignis() und wird von
// killMon() aus erreicht. Reset in startShift().
let langSchicht = {};
let knZettelHideAt = 0, knRandHideAt = 0;

function knAllDone(){
  return HINWEISE.every(h => kn.seen[h.id]) && kn.beats.beat1 && kn.beats.beat2 && kn.beats.beat3
    && kn.flags.hatGezaubert && kn.flags.hatGekocht && kn.flags.hatKammerBetreten;
}

// Sperrzonen gelten nur für Dienstzettel, nicht für die Zeilen im oberen Band
// und nicht für die spielerausgelöste Wiederholung (Nachfragen). Seit T3 stehen
// im Band zwei Stimmen, und für beide gilt dasselbe: ein Dienstzettel drängt
// sich nicht in ein offenes Fenster, eine Bemerkung am Rand darf es.
function knSperrzone(){
  if(invOpen || charakterOpen || spellTreeOpen || kesselOpen || optionenOpen || schlossOpen || amtFensterOpen) return true;
  if(document.getElementById('overlay').style.display === 'flex') return true;
  if(kammer){ const mod = kammer.mods[kammer.idx]; if(mod && mod.begonnen && !mod.fertig) return true; }
  if(boss && boss.aggro) return true;
  for(const m of monsters){
    if(m.dead || !m.aggro) continue;
    const dx = m.x - player.x, dy = m.y - player.y;
    if(dx*dx + dy*dy < 48400) return true;
  }
  return false;
}

function knStuckCandidate(){
  if(!knStuckArmed || knIdleT < 50) return null;
  // Z2: erst ab der Befugnisstufe. Vorher KANN niemand zaubern, und ein Stups
  // auf etwas Unmoegliches waere keine Hilfe, sondern eine Falschauskunft.
  if(player.level >= ZAUBER_AB_STUFE && !kn.flags.hatGezaubert && !kn.wissensluecke.zauber) return {id:'stuck_zauber', prio:20, exempt:false, isStuck:'zauber',
    z1:'Sie schlagen nur. Es gibt auch Zauber.', z2: touchMode ? 'Der Zauberknopf.' : 'E.'};
  // S1: der Stups auf die eigene Befaehigung. Er steht VOR Kochen und Kammer,
  // weil er die Frage beantwortet, die im Spielbericht zuerst kam ("fällt kaum
  // auf, dass es das gibt"), und weil er sich von selbst erledigt: wer einmal
  // gesteigert hat, sieht ihn nie wieder.
  if(player.skillPoints >= PUNKTE_JE_STUFE * 2 && !kn.flags.hatGesteigert && !kn.wissensluecke.befaehigung)
    return {id:'stuck_befaehigung', prio:20, exempt:false, isStuck:'befaehigung',
      z1:'Sie sammeln Punkte und vergeben keine.', z2: touchMode ? 'Rucksack. Oben die vier Zeilen.' : 'Inventar. I.'};
  if(!kn.flags.hatGekocht && !kn.wissensluecke.kochen) return {id:'stuck_kochen', prio:20, exempt:false, isStuck:'kochen',
    z1:'Zutaten allein werden nichts.', z2: touchMode ? 'Rucksack, dann Kessel.' : 'Zum Kessel. K.'};
  if(!kn.flags.hatKammerBetreten && !kn.wissensluecke.kammer) return {id:'stuck_kammer', prio:20, exempt:false, isStuck:'kammer',
    z1:'Da draußen stehen verschlossene Türen.', z2: touchMode ? 'Die Hand im Gürtel.' : 'Gebührenbescheid. F.'};
  return null;
}

function knDisplayZettel(cand){
  if(knRand.active){ knRand.active = false; el('knRandnotiz').classList.remove('show'); }
  if(kn.regler !== 'schweigt') MUS.sting(kn.regler === 'dienstlich' ? 'dienstlich' : 'gespraechig');
  setTxt('knZettelZ1', cand.z1);
  if(cand.z2){ setStyle('knZettelZ2', 'display', 'block'); setTxt('knZettelZ2', cand.z2); }
  else setStyle('knZettelZ2', 'display', 'none');
  el('knZettel').classList.add('show');
  knZettel.active = true; knZettelHideAt = gameT + 6;
  knClosingId = (!cand.isVarB && ESCALATE_DEFS[cand.id]) ? cand.id : null;

  if(!cand.exempt){
    knLastZettelT = gameT;
    if(gameT - knSessionStart < 120) knBudgetShown++;
  }
  if(cand.isVarB){ kn.varB[cand.id] = true; kn.escReady[cand.id] = false; }
  else if(cand.isStuck){ kn.wissensluecke[cand.isStuck] = true; knStuckArmed = false; }
  else if(cand.id === 'beat2'){ kn.beats.beat2 = true; }
  else if(cand.id === 'beat3'){ kn.beats.beat3 = true; }
  else if(cand.id === 'beat1fb'){ kn.beats.beat1 = true; kn.pending.beat1Fallback = false; }
  else { kn.seen[cand.id] = true; }

  kn.history.push({z1:cand.z1, z2:cand.z2 || ''}); if(kn.history.length > 3) kn.history.shift();
  saveKn();
}

function knOnZettelClosed(){
  const id = knClosingId; knClosingId = null;
  if(!id) return;
  const def = ESCALATE_DEFS[id]; if(!def) return;
  if(kn.varB[id] || kn.escReady[id]) return;
  if(def.wenn()){ kn.escReady[id] = true; saveKn(); }
}

// Reihenfolge im Hook ist Pflicht: erst der billige gameT-Vergleich, dann Pool-Auswahl.
//
// T3: Das Band traegt seit diesem Abschnitt zwei Stimmen. Es bleibt trotzdem
// EIN Band, denn es ist eine Flaeche und keine Liste: zwei Zeilen gleichzeitig
// gibt es nicht, und zwei uebereinandergestapelte Baender waeren ein zweites
// System fuer dieselbe Sache. Unterschieden werden die Stimmen am Zeichen davor
// (Knoeterich fuehrt sein Paragrafenzeichen weiter, Anlage 2 bekommt die
// Fussnotenmarke) und an der Farbe. Die Klasse wird bei jeder Zeile neu
// gesetzt, nicht nur hinzugefuegt: sonst behaelt das Band die Marke der
// vorigen Stimme.
// T4: eine dritte Stimme im selben Band, und sie ist dieselbe Figur. Der
// Umschlag ist Anlage 2 ohne Maske: keine Marke davor (die Fussnotenmarke
// gehoert der Beilage, die etwas beifuegt, und hier fuegt sie nichts bei),
// gedaempfte Farbe, und laenger stehend. Fuenf statt drei Sekunden, weil diese
// Zeilen nichts kommentieren, was gerade passiert, sondern etwas feststellen,
// was gerade vorbei ist. Wer sie ueberliest, hat sie fuer immer ueberlesen.
function knShowRandLine(line, wer){
  setTxt('knRandTxt', line);
  const band = el('knRandnotiz');
  // T7: der Ausbruch traegt beide Klassen. a2 ist die Stimme und bleibt, was
  // sie ist; ausbruch legt nur darueber, was an dieser einen Zeile anders ist.
  // Zwei getrennte Klassen waeren zwei Beschreibungen derselben Sprecherin.
  band.classList.toggle('a2', wer === 'a2' || wer === 'a2x');
  band.classList.toggle('ausbruch', wer === 'a2x');
  band.classList.toggle('umschlag', wer === 'u');
  band.classList.add('show');
  knRand.active = true; knRandHideAt = gameT + (wer === 'u' ? 5 : 3);
  knLastRandnotizT = gameT;
}
// Seiteneffektfrei, wird auf dem Notiz-Pfad bewusst zweimal ausgewertet.
//
// T3: kn.regler steuert weiterhin beide Stimmen, und der Regler heisst deshalb
// im Menue jetzt nach dem Haus statt nach Knoeterich. Die drei Stellungen
// bedeuten unveraendert dasselbe, nur genauer: "Gespraechig" ist alles,
// "Dienstlich" ist nur das Dienstliche (Dienstzettel und Begruessung, also
// Bedienung), "Schweigt" ist nichts. Anlage 2 kommentiert die Welt und ist
// damit nie dienstlich; wer den Regler auf "Dienstlich" stellt, will Ruhe von
// genau der Art Zeile, die sie schreibt. Ein zweiter Regler daneben waere eine
// zweite Wahrheit fuer dieselbe Frage.
// T8: ohneSperre hebt GENAU EINE der Bedingungen auf, den Mindestabstand von
// vierzig Sekunden, und keine der uebrigen. Gebraucht wird das von den
// Szenen-Anlaessen, und zwar aus einem Grund, der beim Bauen nicht zu sehen
// ist: gameT steht waehrend einer Szene still (update() kehrt bei
// state !== 'play' um, noch bevor gezaehlt wird). Der Abstand traegt damit
// ueber die ganze Szene hinweg, und wer kurz vor dem Gespraech eine Bandzeile
// hatte, verloere die einmalige Szenenzeile lautlos. Der Regler bleibt
// ausdruecklich in Kraft: wer "Schweigt" gestellt hat, will auch hier Ruhe,
// und eine Zeile, die sich ueber die Einstellung hinwegsetzt, weil sie sich
// selbst fuer wichtig haelt, ist genau die Sorte, die man abstellen wollte.
function knLineErlaubt(anlass, ohneSperre){
  if(kn.regler === 'schweigt') return false;
  if(kn.regler === 'dienstlich' && anlass !== 'begruessung') return false;
  if(state !== 'play' || player.dead) return false;
  if(!ohneSperre && gameT - knLastRandnotizT < 40) return false;
  if(knZettel.active) return false;
  if(kammer){ const mod = kammer.mods[kammer.idx]; if(mod && mod.begonnen && !mod.fertig) return false; }
  return true;
}
function knShowLineGated(anlass, line){
  if(!line) return false;
  if(!knLineErlaubt(anlass)) return false;
  knShowRandLine(line, 'kn');
  return true;
}

// T3: Der Weltkommentar. Bauform wie knRandnotiz() bis T2, mit drei
// Unterschieden: der Pool gehoert Anlage 2, sie muss dafuer in der Tasche
// liegen, und ein Eintrag darf ein Gate tragen.
//
// letzterAnlass wird weiter gesetzt, und das ist keine Nebensache: Lott und
// Pahl auf der Bank kommentieren seit W3 das, was gerade bemerkt wurde. Faellt
// die Zeile weg, verstummt der Chor, und der Langvorgang Hintermuehl haengt,
// weil langAnsprechen() nur ueber npcCycle() erreicht wird (GW4).
function anlage2Zeilen(anlass){
  const pool = ANLAGE2_NOTIZ[anlass]; if(!pool) return [];
  return pool.filter(e => {
    if(typeof e === 'string') return true;
    for(const s in ZUSATZ_SCHALTER) if(s in e) return ZUSATZ_SCHALTER[s].frei(e[s], e);
    return false;
  }).map(e => typeof e === 'string' ? e : e.z);
}
// T7: Wie selten ein Ausbruch ist, entscheidet ein Zaehler und kein Wuerfel.
// Drei gefasste Zeilen, dann darf sie einmal. Das ist mit Absicht ablesbar und
// nicht zufaellig: eine Figur, die alle paar Minuten hochfaehrt, hat keinen
// Ausbruch mehr, sondern ein Temperament, und das ist eine andere Figur. Was
// selten ist, wiegt, und derselbe Satz steht schon ueber dem Umschlag.
const A2_AUSBRUCH_RUHE = 3;

// Waehlt ein Paar, aendert aber nichts. Der Zaehler wird beim Aufrufer
// genullt, und zwar erst, wenn die Zeile wirklich faellt: eine Auswahl, die
// den Stand verbraucht und dann verworfen wird, verschluckt den Ausbruch.
function anlage2AusbruchZug(anlass){
  const paare = ANLAGE2_AUSBRUCH[anlass];
  if(!paare || !paare.length) return null;
  if((kn.counters.anlage2Ruhig | 0) < A2_AUSBRUCH_RUHE) return null;
  return paare[Math.floor(Math.random()*paare.length)];
}

function anlage2Notiz(anlass){
  if(!kn.flags.anlage2Da) return false;      // vor der Aushaendigung gibt es sie nicht
  if(!knLineErlaubt(anlass)) return false;    // Gates vor Pool-Auswahl, hurtMon ist Hot Path
  // T7: der Ausbruch geht vor, wenn er dran ist. Er braucht keinen freien Pool
  // und keine Gate-Auswertung: das Paar steht als Ganzes da, und die zweite
  // Haelfte ist bereits geschrieben. Der Zaehler faellt hier und nur hier.
  const paar = anlage2AusbruchZug(anlass);
  if(paar){
    letzterAnlass = anlass;
    kn.counters.anlage2Ruhig = 0; saveKn();
    knShowRandLine(paar.auf, 'a2x');
    a2Nachklapp = {z: paar.zurueck, at: gameT + 2.2};
    return true;
  }
  const pool = anlage2Zeilen(anlass); if(!pool.length) return false;
  kn.counters.anlage2Ruhig = (kn.counters.anlage2Ruhig | 0) + 1; saveKn();
  letzterAnlass = anlass;   // W3: Lott/Pahl kommentieren, was gerade bemerkt wurde
  let line = pool[Math.floor(Math.random()*pool.length)];
  if(pool.length > 1){ let guard = 0; while(line === knRandLastLine[anlass] && guard++ < 8) line = pool[Math.floor(Math.random()*pool.length)]; }
  knShowRandLine(line, 'a2');
  knRandLastLine[anlass] = line;
  return true;
}

// T8: die Szenenzeile. Eigener Weg und nicht anlage2Notiz() mit einem Sonder-
// fall darin, denn von dessen fuenf Schritten gilt hier keiner: es gibt keinen
// Pool zu filtern, keine Gates auszuwerten, nichts zu wuerfeln, keinen
// Wiederholungsschutz zu fuehren und keinen Ruhezaehler zu bewegen. Was bliebe,
// waeren fuenf Abfragen, die immer denselben Zweig nehmen.
//
// letzterAnlass wird hier NICHT gesetzt. szeneEnde() hat es eine Zeile vorher
// getan, und der Chor auf der Bank haengt daran; ein zweiter Setzer waere eine
// zweite Wahrheit ueber dieselbe Groesse. Genau deshalb steht der Aufruf dort
// und nicht in den Szenen selbst.
//
// Gibt zurueck, ob die Zeile gefallen ist. Falsch ist kein Fehler: vor der
// Aushaendigung gibt es sie nicht, auf "Schweigt" schweigt sie, und im
// Rucksack liest sowieso niemand mit.
function anlage2Szene(anlass){
  if(!kn.flags.anlage2Da) return false;
  const paar = ANLAGE2_SZENE[anlass];
  if(!paar) return false;                      // vorblatt, und das mit Absicht
  if(!knLineErlaubt(anlass, true)) return false;
  knShowRandLine(paar.z1, 'a2');
  a2Nachklapp = {z: paar.z2, at: gameT + 2.2};
  return true;
}

// Der Versuch, sie aus der Tasche zu bewegen. Der Reihe nach, nicht zufaellig:
// die Liste ist ein Bogen von amtlich nach vertraut, und wer sie durch hat,
// bekommt die letzten drei im Kreis. Das ist Absicht — der Anfang des Bogens
// waere beim zweiten Durchlauf ein Rueckschritt in der Vertrautheit, und die
// Reihe darf vertrauter werden, nie wieder fremder.
function anlage2Bewegung(){
  const n = ANLAGE2_BEWEGUNG.length, i = kn.counters.anlage2Zug | 0;
  kn.counters.anlage2Zug = i + 1; saveKn();
  return i < n ? ANLAGE2_BEWEGUNG[i] : ANLAGE2_BEWEGUNG[n - 3 + ((i - n) % 3)];
}

