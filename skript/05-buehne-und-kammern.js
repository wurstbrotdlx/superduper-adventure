// skript/05-buehne-und-kammern.js - Teil 5 von 7 des einen Spielskripts.
// Inhalt: Die zweite Buehne, Stopfen, Tueren und Kammern, Innenraeume, Raetselmodule, Aktionen.
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
// ===========================================================================
//  T4: die zweite Buehne. Unter vier Augen ist sie eine andere.
// ===========================================================================
//
// Steht hier unten und nicht bei der Schaltertabelle, weil sie npcs, figDa()
// und KN_POS liest und alle drei erst spaeter deklariert sind. Gerufen wird sie
// ausschliesslich zur Laufzeit (ZUSATZ_SCHALTER.allein.frei und der Umschlag),
// nie auf Skriptebene, und damit ist die Temporal Dead Zone kein Thema.
//
// Der Radius ist die Sichtweite ueber das Bildschirmband, dieselbe Groesse, mit
// der HINWEISE die Tuer des Amtes anmeldet. Quadriert verglichen, weil eine
// Wurzel je Dorffigur und Zeile Unsinn waere (dieselbe Regel wie im Wandern).
//
// Drei Faelle geben ohne Messung wahr zurueck, und alle drei sind keine
// Abkuerzung, sondern die Wahrheit: in einer Kammer ist npcs geleert, auf der
// zweiten Ebene wird das Dorf weder gezeichnet noch angeboten, und in beiden
// Faellen steht dort tatsaechlich niemand. Knoeterich steht ausserhalb von
// npcs und muss einzeln gefragt werden. Wer ihn vergisst, ist "allein" mitten
// auf dem Dorfplatz.
//
// Monster zaehlen nicht. Ein Vorgang ist kein Publikum.
const A2_ALLEIN_R2 = 450 * 450;
function anlage2Allein(){
  if(kammer) return true;
  // IN1: In einem Innenraum steht sehr wohl Publikum, es ist nur ein anderes.
  // npcs traegt drinnen die Leute des Raumes und draussen die des Dorfes.
  //
  // AN2-Berichtigung: hier stand "Knoeterich bleibt draussen, deshalb wird er
  // drinnen nicht gefragt". Das gilt seit AN2 nicht mehr -- im Anfang steht er
  // in der Amtsstube. Die Rechnung unten traegt es trotzdem, und zwar ohne
  // Zutun: er liegt dort als npcs-Eintrag, figHier() laesst ihn drinnen
  // durch, und die Schleife findet ihn. Nachgemessen am laufenden Spiel,
  // direkt neben ihm und quer durch den Raum: beide Male "nicht allein".
  // Die zwei KN_POS-Zeilen darunter bleiben, wofuer sie gebaut sind -- fuer
  // draussen, wo er kein npcs-Eintrag ist, sondern von drawAlter() gezeichnet
  // wird.
  if(!innen && currentLevel !== 1) return true;
  if(!innen && sqDist(player.x, player.y, KN_POS.x, KN_POS.y) < A2_ALLEIN_R2) return false;
  for(const n of npcs)
    if(figHier(n.figur) && sqDist(player.x, player.y, n.x, n.y) < A2_ALLEIN_R2) return false;
  return true;
}

// Eine Umschlagzeile scharf schalten. Gezeigt wird sie hier NICHT: der Moment,
// in dem sie faellig wird, ist fast nie der Moment, in dem sie gelesen werden
// kann (beim Tod liegt ein Overlay ueber dem Band, beim Bosssieg laeuft eine
// Fanfare, und in Hoerweite einer Dorffigur sagt sie sowieso nichts). Deshalb
// nur ein Vermerk, und die Auslieferung uebernimmt der Takt.
//
// Unbekannte ids sind ein No-Op und kein Fehler: das haelt kn.umschlag auf die
// Tabelle gedeckelt, auch wenn ein spaeterer Bauabschnitt eine Zeile umbenennt.
function anlage2Umschlag(id){
  if(!kn.flags.anlage2Da) return false;
  if(!ANLAGE2_UMSCHLAG.some(u => u.id === id)) return false;
  if(kn.umschlag[id]) return false;            // faellig oder laengst verbraucht
  kn.umschlag[id] = 1; saveKn();
  return true;
}

// Die Auslieferung, einmal je Takt. Sie nimmt den ersten faelligen Eintrag in
// Tabellenreihenfolge, und sie nimmt ihn nur, wenn niemand zuhoert.
//
// Die Bedingungen sind mit Absicht dieselben wie fuer jede andere Zeile
// (knLineErlaubt: Tonstellung, Spielzustand, Vierzig-Sekunden-Takt, kein
// Dienstzettel, kein laufendes Kammermodul) und eine mehr. Ein eigener,
// laxerer Weg waere bequemer und falsch: eine Zeile, die durch den Regler
// bricht, ist eine Zeile, die der Spieler abgestellt hat.
//
// letzterAnlass bleibt unberuehrt. Die Bank auf dem Dorfplatz kommentiert seit
// W3, was gerade bemerkt wurde, und ein Umschlag wird nicht bemerkt: er faellt
// nur, wenn niemand in der Naehe ist, und Lott und Pahl haetten sonst eine
// Meinung zu etwas, das sie nicht gehoert haben koennen.
function anlage2UmschlagTick(){
  if(!kn.flags.anlage2Da) return false;
  for(const u of ANLAGE2_UMSCHLAG){
    if(kn.umschlag[u.id] !== 1) continue;
    if(!knLineErlaubt('umschlag')) return false;
    if(!anlage2Allein()) return false;
    kn.umschlag[u.id] = 2; saveKn();
    knShowRandLine(u.z, 'u');
    return true;
  }
  return false;
}

// 18.5: Knöterich spricht immer vollständig, immer korrekt, immer inklusive
// "Herr oder Frau" an. Jedes Mal. GEMESSEN wird die Vorschrift nicht erfuellt:
// auf genau einem von 81 durchgerechneten Raengen erscheint "Herr oder Frau",
// weil anredeFormen() die kuerzere Klammerform davorsetzt und der 44er-Deckel
// ueberall sonst zuschlaegt. Das ist eine offene Entscheidung (Reihenfolge der
// Sprossen drehen ändert den Klang des Spiels), kein uebersehener Fehler.
// Drei Anlaeufe, nicht zwei, seit W7 die Giesskannen-Sprosse davorgesetzt hat:
// Anrede samt Schichtzähler, dann die Anrede allein. Die zweite passt immer,
// die längste Sprosse ohne Zähler ist 43 Zeichen lang — die alte Grundzeile
// bleibt nur als dritter Boden stehen, erreicht wird sie nie.
// Deckel ist 44 (Randnotiz-Kanal), nicht 48/32: das hier ist ein Einzeiler.
function knBegruessungLine(){
  const n = amt.schichten + 1;
  const st = rangStufe();
  // W7 Nr. 1: die einzige Belohnung der Gießkanne. Kein Bonus, kein Vermerk,
  // eine Spur wärmer. Sie steht als EIGENE Sprosse ganz oben und wird nicht
  // angehängt: der Schichtzähler frisst den Deckel sonst vollständig auf, und
  // die Belohnung wäre auf jedem Rang unsichtbar.
  // GW8: Suffix von 26 auf 20 Zeichen gekürzt. Mit dem alten Satz passte die
  // einzige Belohnung dieses Langvorgangs auf 7 von 19 Rängen unter den Deckel,
  // und ausgerechnet auf den Rängen 0 bis 2 nicht — also in den Schichten, in
  // denen der Strang typischerweise abgeschlossen wird. Jetzt sind es 15.
  let line = (langFertig('giesskanne') ? anredeVersuch(t => t + '. Gut, Sie zu sehen.', st, 44) : null)
             || anredeVersuch(t => t + '. ' + knOrdinal(n) + ' Schicht.', st, 44)
             || anredePunkt(st, 44)
             || (knOrdinal(n) + ' Schicht. Die Akte wird dick.');
  if(kn.counters.maxKillsSchicht > 0){
    const alt = line + ' Rekord ' + kn.counters.maxKillsSchicht + '.';
    if(alt.length <= 44) line = alt;
  }
  return line;
}

// Curse-Equip-Nachlauf: hinter jedem recalc(), das eine Ausrüstungsänderung begleitet.
// Das sind alle vier Equip-Schreiber: equipItemFromBag(), unequipItem(), der Rechtsklick-
// Ablegepfad in renderInventory() und startShift(). Reine Zustandsprüfung, löst nur auf der
// steigenden Flanke aus. Ablegen muss mitlaufen, obwohl es keinen Fluch anlegen kann: sonst
// bleibt knCurseWasOn true und verschluckt die nächste Anlage (Flanke statt Zustand).
function knCheckFluchEquipped(){
  const e = player.equip;
  const hasCurse = !!((e.weapon && e.weapon.fluch) || (e.armor && e.armor.fluch) || (e.shield && e.shield.fluch) || (e.boots && e.boots.fluch));
  if(hasCurse && !knCurseWasOn){
    if(!kn.pending.fluch1 && !kn.seen.fluch1) kn.pending.fluch1 = true;
    kn.counters.fluchAngelegt = (kn.counters.fluchAngelegt||0) + 1;
    if(kn.counters.fluchAngelegt >= 2) anlage2Notiz('fluch');
    saveKn();
  }
  knCurseWasOn = hasCurse;
}

// Weltfigur-Blase: reine Modulvariablen, keine Closure und keine Allokation pro
// Frame (siehe knBubble oben). Läuft jeden Frame, nicht nur alle 15, weil das
// Betreten/Verlassen des 150-Pixel-Radius sofort reagieren muss.
function knUpdateBubble(){
  const knVisible = currentLevel === 1 && !kammer && state === 'play';
  let inRange = false;
  if(knVisible){
    const dx = player.x - KN_POS.x, dy = player.y - KN_POS.y;
    inRange = (dx*dx + dy*dy) < 22500;   // 150 Pixel, kein Math.hypot
  }
  if(inRange && !knBubble.wasIn) knBubble.enterT = gameT;
  if(!inRange){
    if(knBubble.wasIn && !kn.beats.beat1 && !kn.pending.beat1Fallback){
      kn.pending.beat1Fallback = true; saveKn();   // Beat 1 wandert als Zettel hinterher
    }
    knBubble.visible = false; knBubble.wasIn = false;
    return;
  }
  knBubble.wasIn = true;
  if(!kn.beats.beat1 && !kn.pending.beat1Fallback){
    knBubble.visible = true;
    knBubble.text1 = 'Knöterich. Monstralministerium.';
    knBubble.text2 = touchMode ? 'Außendienst. Daumen links.' : 'Sie sind Außendienst. WASD.';
    if(gameT - knBubble.enterT >= 2){ kn.beats.beat1 = true; saveKn(); knBubble.visible = false; }   // gilt nach 2s als zugestellt
  } else {
    knBubble.visible = false;   // kein anderer Blaseninhalt vorgesehen
  }
}

function knEvaluateZettel(){
  if(state !== 'play' || player.dead) return;
  if(currentLevel === 2) return;                 // Schattenland: Zettelkanal schweigt ganz
  if(knZettel.active) return;
  if(knAllDone()) return;                        // Verstummen: alles durch, Schweigen ist verdient

  const cands = [];
  if(!kn.beats.beat2 && stats.kills >= 1) cands.push({id:'beat2', prio:100, exempt:true,
    z1:'Geht doch. Schellen zählt als Sachbearbeitung.', z2:'Aufheben, was liegt.'});
  if(!kn.beats.beat3 && player.spellPoints > 0) cands.push({id:'beat3', prio:100, exempt:true,
    z1:'Befugnis erteilt. Der Punkt liegt bereit.', z2: touchMode ? 'Der Stern im Gürtel.' : 'T. Aussuchen.'});
  if(kn.pending.beat1Fallback && !kn.beats.beat1) cands.push({id:'beat1fb', prio:100, exempt:true,
    z1:'Knöterich. Monstralministerium.', z2: touchMode ? 'Außendienst. Daumen links.' : 'Sie sind Außendienst. WASD.'});

  for(const h of HINWEISE){
    if(kn.seen[h.id]) continue;
    if(!h.wenn()) continue;
    cands.push({id:h.id, prio:h.prio, exempt:false, z1:h.z1, z2: (touchMode && h.z2t) ? h.z2t : h.z2});
  }
  for(const id in ESCALATE_DEFS){
    if(!kn.escReady[id] || kn.varB[id]) continue;
    const e = ESCALATE_DEFS[id];
    if(!e.wenn()) continue;
    cands.push({id, prio:e.prio, exempt:false, isVarB:true, z1:e.z1, z2: touchMode ? e.z2t : e.z2});
  }
  const stuck = knStuckCandidate(); if(stuck) cands.push(stuck);

  if(!cands.length) return;
  cands.sort((a,b) => b.prio - a.prio);
  const winner = cands[0];

  if(knSperrzone()) return;    // Verlierer werden verworfen, Gewinner an der Sperrzone auch
  if(!winner.exempt){
    if(gameT - knLastZettelT < 25) return;
    if((gameT - knSessionStart < 120) && knBudgetShown >= 3) return;
  }
  knDisplayZettel(winner);
}

// Der Nachschlag: der zuletzt gezeigte Dienstzettel noch einmal, bei jedem
// Aufruf einer weiter zurueck, hoechstens drei (Cap in kn.history).
//
// U6: Er liefert die Zeilen jetzt, statt sie selbst anzuzeigen. Bis hierher
// schrieb er sie ins obere Band (#knZettel) und war eine eigene Kontextaktion
// an der Weltfigur; seit Knoeterich eine Gespraechstafel hat, ist er eine
// Antwort darin ("Was stand da eben?") und der Satz laeuft ein wie jeder
// andere. Damit faellt auch die Sperrliste weg, die hier stand: bei offener
// Tafel ist ohnehin kein zweites Panel offen, und das Band anzusteuern,
// waehrend die Tafel darunter steht, war der Fall, den sie abfing.
// Liefert null, wenn noch kein Zettel gelaufen ist; die Antwort steht dann
// gar nicht erst in der Liste.
function knNachfragenZeile(){
  const n = kn.history.length;
  if(!n) return null;
  knNfIdx = (knNfIdx + 1) % n;
  return kn.history[n - 1 - knNfIdx];
}

// Zentraler Takt: Blase und Ausblenden laufen jeden Frame (billig), die teure
// Kandidatensuche nur alle 15 Frames (Vorbild: Minimap alle 4 Frames).
function knTick(dt){
  knIdleT = (state === 'play' && !player.dead) ? knIdleT + dt : 0;
  knUpdateBubble();

  // T4: der Wiederantritt nach einer Niederlage. Er steht VOR der Begruessung,
  // und die Reihenfolge ist eine Entscheidung: beide konkurrieren um denselben
  // Vierzig-Sekunden-Takt, und wer gerade gefallen ist, soll den Satz zu seiner
  // Niederlage hoeren und nicht die Begruessung zur neuen Schicht.
  //
  // Die fuenf Sekunden sind dieselbe Karenz wie beim Dienstzettel 'feierabend1':
  // wer eben erst wieder angetreten ist, laedt noch. knPlayStartT wird von
  // startShift() UND respawnPlayer() gesetzt, damit gilt das fuer beide
  // Rueckwege, den mit Schichtuhr und den ohne.
  if(kn.pending.niederlage && gameT - knPlayStartT >= 5 && anlage2Notiz('niederlage')){
    kn.pending.niederlage = false; saveKn();
  }

  // T7: die Ruecknahme eines Ausbruchs, und sie steht ganz vorn, weil sie eine
  // offene Klammer ist. Alles andere im Band faengt etwas an, sie beendet
  // etwas.
  //
  // Sie laeuft NICHT durch knLineErlaubt(), und das ist der einzige Weg im
  // ganzen Band, der das darf. Begruendung: sie ist kein zweiter Anlass,
  // sondern die zweite Haelfte derselben Aeusserung, und der Regler wurde beim
  // ersten Teil bereits gefragt. Der Vierzig-Sekunden-Takt haette sie sonst
  // sicher verschluckt, und ein Ausbruch ohne Ruecknahme ist die eine Fassung
  // dieser Figur, die es nicht geben darf.
  //
  // Was trotzdem gilt, steht hier ausdruecklich: wer den Regler waehrend des
  // Ausbruchs auf "Schweigt" stellt, hat das Nachwort abgestellt, und wer
  // gestorben ist oder einen Dienstzettel vor sich hat, hoert es nicht mehr.
  // In allen drei Faellen verfaellt sie, statt spaeter aus dem Zusammenhang zu
  // fallen.
  if(a2Nachklapp){
    if(kn.regler === 'schweigt' || state !== 'play' || player.dead || knZettel.active) a2Nachklapp = null;
    else if(gameT >= a2Nachklapp.at){ knShowRandLine(a2Nachklapp.z, 'a2'); a2Nachklapp = null; }
  }

  if(knBegruessungPending && knShowLineGated('begruessung', knBegruessungPending)) knBegruessungPending = null;

  if(knZettel.active && gameT >= knZettelHideAt){
    knZettel.active = false; el('knZettel').classList.remove('show'); knOnZettelClosed();
  }
  if(knRand.active && gameT >= knRandHideAt){
    knRand.active = false; el('knRandnotiz').classList.remove('show');
  }

  const bv = !!(boss && !boss.dead && boss.aggro);
  document.body.classList.toggle('bossvis', bv);

  if((knFrameCtr++ % 15) === 0) knEvaluateZettel();

  // W-Nörgel: der Merker fürs Lager. Die anderen vier kn.flags sitzen an ihrem
  // Ereignis (Zauber gewirkt, Kessel gekocht, Kammertür betreten, Punkt
  // vergeben); "der Spieler war am Lager" hat keins, weil Hingehen kein
  // Ereignis ist, sondern ein Zustand. Deshalb hier, im Takt,
  // der ohnehin jeden Frame läuft: einmal gesetzt, kostet die Zeile nur noch
  // die eine Boolean-Prüfung ganz vorn. Gemessen wird mit imLager(), nicht mit
  // einem zweiten Rechteck — eine Wahrheitsquelle, und der Kacheln-Rand von
  // imLager() ist genau richtig: wer an der Palisade entlanggeht, war am Lager.
  if(!kn.flags.hatLagerGesehen && state === 'play' && !kammer && currentLevel === 1
     && imLager((player.x / TS) | 0, (player.y / TS) | 0)){
    kn.flags.hatLagerGesehen = true; saveKn();
  }

  // Beide Merker werden aus knIdleT abgeleitet, das nur eine echte Aktion nullt. Damit
  // bleiben alle sechs vorhandenen knIdleT-Nullstellen unangetastet. Steht nach der
  // Zettelauswertung, damit ein im selben Frame fälliger Zettel Vorrang hat: knRandnotiz
  // sieht dann knZettel.active und verfällt, statt knLastRandnotizT zu verbrennen.
  if(knIdleT < 50) knStuckArmed = true;
  if(knIdleT < 25) knIdleNotizDone = false;
  else if(!knIdleNotizDone && anlage2Notiz('untaetigkeit')) knIdleNotizDone = true;

  // T4: der Umschlag ganz zuletzt, und das ist seine Rangfolge. Alles andere im
  // Band hat einen Anlass, der gerade eben passiert ist; eine Umschlagzeile
  // wartet ohnehin schon und kann eine Minute laenger warten. Sie prueft
  // zusaetzlich, dass niemand in der Naehe steht, und faellt deshalb an manchen
  // Tagen gar nicht. Auch das ist Absicht: was selten ist, wiegt.
  anlage2UmschlagTick();
}

// Regler im Inventar unter "Ton": Dienstzettel laufen in jeder Stellung, nur
// Randnotizen (inklusive Schichtbegrüßung bei 'schweigt') und die beiden Stinger
// reagieren darauf. Der Zettel selbst erscheint auch bei 'schweigt', nur lautlos
// (gameplay:411 gegen gameplay:552, wo die Reglerprüfung am Sting gefordert ist).
//
// T3: er steuert seit diesem Abschnitt beide Stimmen des Bandes und heisst
// deshalb im Menue nach dem Haus statt nach Knöterich. Die Stellungen bedeuten
// unverändert dasselbe: Gesprächig ist alles, Dienstlich ist nur das
// Dienstliche, Schweigt ist nichts. Anlage 2 kommentiert die Welt und schweigt
// deshalb ab "Dienstlich" mit.
function knApplyToneUI(){
  document.querySelectorAll('.knToneBtn').forEach(b => b.classList.toggle('on', b.dataset.v === kn.regler));
}
document.querySelectorAll('.knToneBtn').forEach(b => {
  b.onclick = () => { kn.regler = b.dataset.v; saveKn(); knApplyToneUI(); };
});
knApplyToneUI();

const KAM_W = 13, KAM_H = 15;      // Raumkantenlänge in Kacheln, Wände eingerechnet
// Linke obere Ecke des Korridors. Bewusst unabhängig von der Oberwelt-Anordnung:
// betreteKammer() sichert die Karte in owSave.mapCopy und macht dann map.fill(G_WALL),
// die Kammer überschreibt also ohnehin alles. Die Ecke muss nur so liegen, dass die
// sechs 13x15-Räume (3 + 5*12 + 12 = 75 Kacheln breit) ins map-Array passen.
const KAM_X0 = 3, KAM_Y0 = 33;
const KAM_TY = KAM_Y0 + 7;         // Zeile, in der alle Tore sitzen (Raummitte)
const KAM_SYM = ['◆','●','▲','■','✦','✚'];
const KAM_ZWEIG_COL = ['#ff9f4a', '#7ad6ff', '#c77dff'];
// Sechs der sieben bisher unverdrahteten Monstertypen bekommen hier ihren Dienst.
// Der siebte, bossgeneric, hängt woanders: Schatzkammer ab Schwierigkeit 5 und Zutaten-Pool ab Tier 4.
// Monsterkatalog M1: die Untere Registratur ist das fünfte Katalogbiom, und sie
// liegt nicht auf der Karte, sondern hinter jeder Kammertür. Ihre fünf Typen
// stehen in keinem Bandroster (reserved:true) und sind nach dem Gebührenbescheid
// an der Tür gestaffelt: Stufe 1 und 2 bekommen Umlauf und Querverweis, ab 3
// kommen Mahnstufe und Fußnote dazu, die Bestandskraft erst bei 5. Ohne diese
// Staffel stünde ein Steingolem mit 1220 Leben in einer Stufe-1-Kammer und das
// Schild vor der Tür wäre gelogen, und ein ehrliches Schild ist in dieser Welt
// eine kleine Sensation (Weltbibel, Kapitel 3).
const KAM_WAECHTER = ['bat','spider','sammelmahnung','mage','golem'];
const KAM_WAECHTER_STUFE = {bat:1, spider:1, sammelmahnung:3, mage:3, golem:4};
// M3: die Sperrablage (Katalogbiom Stollen) ist ein eigenes Roster, kein Zuwachs
// zur Unteren Registratur. Sonst stuenden bei Gebuehrenbescheid 5 acht Typen in
// einem Biom und die M1-Kreuzungsregel "je Biom 3 bis 5 Gegner" waere gebrochen.
// Deshalb teilen sich die beiden Roster die Staffel, statt sich zu ueberlagern:
// Bescheid 1 bis 4 ist die Untere Registratur, Bescheid 5 ist die Sperrablage.
// Der Steingolem rueckt dafuer von 5 auf 4 — er bliebe sonst unerreichbar, und
// Bescheid 4 verspricht auf dem Schild ohnehin eine schwere Kammer.
const KAM_STOLLEN = ['teilbescheid','dienstweg','teilabhilfe'];
const kamWaechter = diff => diff >= 5 ? KAM_STOLLEN
                                      : KAM_WAECHTER.filter(t => KAM_WAECHTER_STUFE[t] <= diff);
// M4: die zweite Ebene. Nur die Sperrablage hat eine, und das ist keine
// Baulaune, sondern ihre Signatur aus M1: "Eine Ebene unter der Registratur
// liegt, was niemand mehr anfassen sollte, und zahlt es in Ruestung und Waffe."
// Die Untere Registratur (Bescheid 1 bis 4) hat kanonisch nichts unter sich —
// sie IST das Untergeschoss des Hauses. Wer die Zahl hier hochsetzt, baut
// Stockwerke ohne Weltgrund; deshalb steht sie am Satz und nicht am Bescheid.
const KAM_EBENEN = [1, 1, 2];          // je Kammersatz: Dungeon_1, Dungeon_2, Stollen
// Die untere Ebene ist kurz und dicht: ein Raetselraum, dann die Kammer. Ein
// zweiter voller Korridor waere dieselbe Kammer noch einmal, und die Schichtuhr
// ist das Spannungsmittel dieses Spiels (KAMMER-MESSUNG-2026-08-20, Abschnitt 4).
const KAM_EBENE2_BUDGET = 3;
const KAM_EBENE2_WAECHTER = 2;         // Aufschlag je Raum gegenueber der oberen Ebene
const kamWaechterZufall = diff => { const p = kamWaechter(diff); return p[Math.floor(Math.random()*p.length)]; };

const kammerTueren = [];           // Türen in der Oberwelt
let schlossOpen = false;

const tileMid = t => t*TS + TS/2;
const spielerTx = ()=> Math.floor(player.x / TS);
const spielerTy = ()=> Math.floor(player.y / TS);

// --- Türen in der Oberwelt --------------------------------------------------
function wuerfleTuer(t, festDiff){
  t.diff = festDiff || rri(1, 5);   // W4: fester Wert erzwingt eine Kammergarantie, siehe setzeKammerTueren()
  t.tier = clamp(t.diff - 1, 0, 4);   // Beute liest t.tier; das SCHILD liest seit W7 den
                                      // abgeleiteten Anzeigewert aus langKammerWert()
  t.cd = 0;
  // R6/F31: Set-Wahl wie beim Betreten (diff 1-2 -> Set 0). Die Keys hängen allein
  // an diff und werden hier mitgewürfelt, statt in drawKammerTuer() pro Tür pro Frame.
  const dk = `dun${t.diff <= 2 ? 1 : 2}`;
  t.dkGate = dk + '_gate'; t.dkGateAnim = dk + '_gateAnim';
}

function setzeKammerTueren(){
  kammerTueren.length = 0;
  const baender = BIOME_BANDS.map(b => [b.key, ...tuerBandRange(b.key)]);
  for(const b of baender){
    let gesetzt = 0;
    for(let n = 0; n < CONFIG.kammerTueren; n++){
      // W-Groß: 800 statt 300 Versuche. Mit Meer, gekapptem Land und dem breiten
      // Dorfbann verwirft die Schleife jetzt deutlich mehr Kandidaten.
      for(let versuch = 0; versuch < 800; versuch++){
        // Die ERSTE Tür jedes Bandes wird nah ans Dorf gezwungen (~70 Kacheln
        // Umkreis, ins Band geklemmt). Ohne das kostet die erste Kammer einer
        // Schicht auf der großen Karte mehrere Minuten Fußweg — und der
        // Hauptvorgang (Adresszeilen 1-3) hängt an genau diesen Türen.
        const nahDran = n === 0 && versuch < 500;
        const tx = nahDran ? ri(Math.max(5, VILLAGE.x0-70), Math.min(MW-6, VILLAGE.x1+70)) : ri(5, MW-6);
        const ty = nahDran ? clamp(ri(VILLAGE.y0-70, VILLAGE.y1+70), b[1], b[2]) : ri(b[1], b[2]);
        if(!reachbar(tx, ty) || !reachbar(tx, ty+1)) continue;              // davor muss man stehen können
        if(nahDorf(tx, ty)) continue;                                       // W-Groß: gleiche Bannzone wie bei den Monstern
        // Mindestabstand W-Groß 12 -> 40 Kacheln (sqDist in KACHELN, nicht Pixeln):
        // auf der sechzehnfachen Fläche klumpten Türen sonst sichtbar zusammen.
        let zuNah = false;
        for(const d of kammerTueren) if(sqDist(tx, ty, d.tx, d.ty) < 1600){ zuNah = true; break; }
        if(zuNah) continue;
        const t = {tx, ty, x: tileMid(tx), y: ty*TS + TS - 2, biome: b[0], diff:1, tier:0, cd:0};
        wuerfleTuer(t);
        kammerTueren.push(t);
        gesetzt++;
        break;
      }
    }
    // Ein Band ohne Tür wäre kein Schönheitsfehler: markiereAdressTueren() braucht
    // je Biom mindestens eine, sonst ist der Hauptvorgang unerfüllbar.
    if(gesetzt === 0) console.error('Weltform: kein Platz für eine Kammertür im Band', b[0]);
  }
  // W4: Kammergarantie. Bei diff = rri(1,5) ist P(keine Tür mit Aufwand 5) =
  // (4/5)^Türzahl — bei den früheren sechs Türen 26 Prozent, bei den 15 seit
  // W-Groß noch 3,5 Prozent. Statistik reicht in beiden Fällen nicht für "nie
  // unerfüllbar", deshalb wird die höchste gewürfelte Tür notfalls auf das Ziel
  // hochgesetzt. TDZ-sicher (nur amt.auftrag), weil setzeKammerTueren() auch beim
  // Skriptstart läuft, lange vor AUFTRAG_TYPEN weiter unten.
  const auftragK = CONFIG.schichtModus ? amt.auftrag : null;   // GW5
  if(auftragK && auftragK.typ === 'kammer' && kammerTueren.length){
    let best = kammerTueren[0];
    for(const d of kammerTueren) if(d.diff > best.diff) best = d;
    if(best.diff < auftragK.ziel) wuerfleTuer(best, auftragK.ziel);
  }
  // W5: Adresskammern, Akt IV. Markiert je noch nicht gefundener Zeile 1-3 eine
  // zufällige Tür ihres Bioms mit t.adr. Nichts wird persistiert: kammerTueren
  // wird oben bei jedem Aufruf geleert, die Markierung entsteht bei jedem
  // Schichtstart neu aus kladde.vorgang. Math.random(), nicht ri()/R() — der
  // gesiegelte Weltgenerator-Strom darf hier nicht mitlaufen (Falle wie bei
  // auftragWuerfeln()). Eine Tür darf zugleich W4-Garantietür und
  // Adresskammer sein, deshalb erst hier, nach der Garantie oben.
  if(vorgangAdressAkt()) markiereAdressTueren(kammerTueren);
}

// GW16: Die Markierung steht als eigene Funktion da, damit vorgangAssert() genau
// den Code prueft, der auch im Spiel läuft, keine Abschrift davon. Sie schreibt
// ausschliesslich t.adr auf die uebergebene Liste, liest ADRESS_ZEILEN und
// vorgangHat(), und ruft weder saveKladde() noch den gesiegelten Weltstrom.
// Damit ist sie in einem Guard aufrufbar, der beim Laden läuft.
function markiereAdressTueren(tueren){
  for(const id in ADRESS_ZEILEN){
    const z = ADRESS_ZEILEN[id];
    if(!z.biome || vorgangHat(id)) continue;
    const kand = tueren.filter(t => t.biome === z.biome);
    if(kand.length) kand[Math.floor(Math.random() * kand.length)].adr = id;
  }
}

// --- Modulauswahl nach Schwierigkeitsbudget ---------------------------------
// kosten = Budgetanteil, moeglich() = darf das Modul überhaupt vorkommen
// (Fackeln brauchen beide Elementarzweige, sonst wäre der Raum unlösbar).
const KAM_MOD = {
  platten:  {kosten:1, bau:bauPlatten,  auf:aufPlatten},
  fackeln:  {kosten:1, bau:bauFackeln,  auf:aufFackeln,
             moeglich:()=> kenntZweig(0) && kenntZweig(1)},
  schloss:  {kosten:1, bau:bauSchloss},
  bloecke:  {kosten:2, bau:bauBloecke,  auf:aufBloecke},
  welle:    {kosten:2, bau:bauWelle,    auf:aufWelle},
  brechen:  {kosten:2, bau:bauBrechen,  auf:aufBrechen},
  schalter: {kosten:2, bau:bauSchalter, auf:aufSchalter},
  spiegel:  {kosten:3, bau:bauSpiegel},
};

function kenntZweig(b){
  for(const s of SPELLS) if(s.branch === b && !s.ultimate && player.spellsKnown[s.id]) return true;
  return false;
}

function waehleModule(diff){ return waehleModuleBudget([1, 2, 4, 6, 8][diff-1], 4); }
// M4: Budget und Raumzahl sind seit der zweiten Ebene zwei Angaben statt einer.
// waehleModule() bleibt der Weg fuer die obere Ebene und rechnet sie weiterhin
// aus der Schwierigkeit; die untere setzt beide selbst.
function waehleModuleBudget(budget, maxN){
  const alle = Object.keys(KAM_MOD).filter(k => !KAM_MOD[k].moeglich || KAM_MOD[k].moeglich());
  const out = [];
  while(out.length < maxN && budget > 0){
    // Jede Rätselart höchstens einmal je Kammer: zwei gleiche Räume hintereinander
    // sind kein Korridor, sondern eine Wiederholung.
    const passt = alle.filter(k => KAM_MOD[k].kosten <= budget && out.indexOf(k) < 0);
    if(!passt.length) break;
    const k = passt[Math.floor(Math.random() * passt.length)];
    out.push(k); budget -= KAM_MOD[k].kosten;
  }
  if(!out.length) out.push('platten');
  return out;
}

// ===========================================================================
//  SZ3: DIE BRUMMENDE STELLE IM STEINFELD
//
//  Die Weltgeschichte hat sie lange vor diesem Bauabschnitt gesaet, und zwar
//  als Wahrnehmung und nicht als Ziel:
//
//    "Es gibt im Steinfeld eine Stelle, an der der Boden brummt. Wer dort
//     stehen bleibt, hoert es. Lott und Pahl sagen, das sei schon immer so
//     gewesen."
//
//  Genau so ist sie gebaut. Es gibt keinen Marker auf der Karte, keinen Pfeil
//  und keinen Eintrag im Brett (Weltbibel, "Keine Questmarker"): der Ort meldet
//  sich nur, wenn jemand danebensteht, und er meldet sich mit einem Satz, der
//  nichts erklaert. Wer nie ins Steinfeld geht, erfaehrt nie, dass es ihn gibt,
//  und spielt das Spiel unveraendert zu Ende.
//
//  Der Ort wird GESUCHT und nicht gewuerfelt, aus demselben Grund wie die
//  Koppel in G11 und die Buchten in G12: `rng()` haette den Zufallsstrom fuer
//  alles Folgende verschoben. Er liegt einmal je Welt und bleibt liegen, wie
//  `decos`; die Kammertueren werden je Schicht neu gewuerfelt, dieser Ort nicht.
//  Eine Roehre, die jede Schicht woanders liegt, waere keine Roehre.
// ===========================================================================
const STOPFEN = {tx:0, ty:0, x:0, y:0, da:false};
// Wie nah man stehen muss, damit der Boden hoerbar wird. Grosszuegiger als die
// Kontaktaktion (58px), weil man das Brummen findet, indem man daran
// vorbeilaeuft, und nicht, indem man es sucht.
const STOPFEN_HOER_Q = 150*150;
let stopfenBrummT = 0;

function setzeStopfen(){
  STOPFEN.da = false;
  // Das Steinfeld ist das Ruinenband, also die oberen zwanzig Prozent der Karte.
  // Gesucht wird von seiner Unterkante nach oben und von der Mitte nach aussen:
  // die Unterkante ist die Seite, an der man ankommt, und was am Rand der Welt
  // liegt, findet niemand.
  const mitte = MW >> 1;
  for(let ty = RUIN_Y1 - 2; ty >= 6; ty--){
    for(let d = 0; d < mitte - 6; d++){
      for(const tx of (d === 0 ? [mitte] : [mitte - d, mitte + d])){
        if(tx < 6 || tx > MW - 7) continue;
        if(!reachbar(tx, ty)) continue;
        if(T(tx, ty) === G_PATH) continue;          // nicht auf den Weg: dort waere sie ausgetreten
        // Freie Nachbarschaft, damit man wirklich danebenstehen kann und die
        // Stelle nicht in einer Felsspalte klemmt.
        let frei = true;
        for(let dy = -1; dy <= 1 && frei; dy++) for(let dx = -1; dx <= 1; dx++)
          if(!reachbar(tx+dx, ty+dy)){ frei = false; break; }
        if(!frei) continue;
        STOPFEN.tx = tx; STOPFEN.ty = ty;
        STOPFEN.x = tileMid(tx); STOPFEN.y = tileMid(ty);
        STOPFEN.da = true;
        return;
      }
    }
  }
  // Kein Fehler, sondern ein Befund, wie bei den Buchten in G12: auf einer
  // Karte ohne begehbares Ruinenband gibt es die Stelle eben nicht. Der
  // Langvorgang bleibt dann unerreichbar, und das Spiel laeuft weiter.
  console.log('SZ3 Stopfen: im Steinfeld liegt keine freie Stelle, die Roehre fehlt auf dieser Karte.');
}

// Der Stand des Strangs als eine Zahl, damit Zeichnung, Kontaktaktion und Szene
// dieselbe Quelle lesen. 0 nichts, 1 nachgesehen, 2 freigelegt, 3 Zapf geholt,
// 4 erledigt (die Szene ist gelaufen).
const stopfenStand = () => langStufe('stopfen');
const stopfenGezogen = () => langFertig('stopfen');

// Serie I. Zwei Funktionen statt einer, damit killMon() im Normalfall nach der
// ersten Zeile wieder draussen ist: der Hot Path fragt eine Flagge, die Liste
// wird nur gebaut, wenn wirklich gewuerfelt wird.
let rohrKandidaten = [];
function blattFaelltAusRohr(){
  if(!stopfenGezogen() || !serieFrei('I')) return false;
  if(Math.random() >= 0.02) return false;
  rohrKandidaten = BLAETTER_KEYS.filter(id => BLAETTER[id].serie === 'I' && !kladde.blaetter[id]);
  return rohrKandidaten.length > 0;
}
const blattAusRohr = () => rohrKandidaten[Math.floor(Math.random() * rohrKandidaten.length)];

// Der Postregen. Drei Schichten lang faellt im Dorf Papier, und zwar aus dem
// Bauteil, das dafuer seit Phase 1 da ist: splatConfetti() malt Aktenkonfetti
// als Bodendekal. Kein neuer Partikel, kein neues Blatt, keine neue Schleife —
// die Weltgeschichte hat es selbst so vorgeschlagen ("ein Partikeleffekt aus dem
// vorhandenen Konfetti").
//
// Ausdruecklich NICHT der Postregen des Finales. Der gehoert laut Weltgeschichte
// ins Ende (vierhundert Jahre Post in einem Nachmittag, das Reich knietief in
// Konfetti) und faellt hier nicht: drei Schichten Papier im Dorf sind die
// Ankuendigung, nicht die Einloesung.
const POSTREGEN_SCHICHTEN = 3;
let postregenT = 0;
const postregenLaeuft = () => CONFIG.schichtModus && !!amt.stopfenSchicht
  && amt.schichten < (amt.stopfenSchicht - 1) + POSTREGEN_SCHICHTEN;
function postregen(dt){
  if(!postregenLaeuft() || kammer || currentLevel !== 1 || state !== 'play') return;
  if(!inVillagePx(player.x, player.y)) return;
  postregenT -= dt;
  if(postregenT > 0) return;
  postregenT = 0.35;
  splatConfetti(player.x + rr(-260, 260), player.y + rr(-200, 200), false);
}

// Steht der Spieler nah genug, dass der Boden sich meldet? Nur in der Oberwelt,
// nur im Dienst, und nur solange niemand nachgesehen hat.
// Das Brummen haengt AUSDRUECKLICH nicht am Akt, anders als das Angebot. Die
// Weltgeschichte fuehrt die Stelle als Saat und nicht als Aufgabe: "Es gibt im
// Steinfeld eine Stelle, an der der Boden brummt. Wer dort stehen bleibt, hoert
// es. Lott und Pahl sagen, das sei schon immer so gewesen." Wer in Akt I
// hinaufsteigt, hoert sie also und kann nichts damit anfangen — genau das ist
// gemeint. Der erste Prueflauf hat hier eine Sperre erwartet und keine
// gefunden; die Sperre waere der Fehler gewesen, nicht ihr Fehlen.
function stopfenBrummen(dt){
  if(!STOPFEN.da || kammer || currentLevel !== 1 || state !== 'play') return;
  if(stopfenStand() > 0) return;
  if(sqDist(player.x, player.y, STOPFEN.x, STOPFEN.y) > STOPFEN_HOER_Q){ stopfenBrummT = 0; return; }
  stopfenBrummT -= dt;
  if(stopfenBrummT > 0) return;
  stopfenBrummT = 6;
  floaters.push({x: STOPFEN.x, y: STOPFEN.y - 20, txt: 'Der Boden brummt.', col:'#9a8a5f', t: 3.0});
}

// Was die Kontextaktion an der Stelle gerade anbietet, oder '' fuer nichts.
// Eine Funktion und kein Feld, damit Angebot und Ausfuehrung dieselbe Quelle
// lesen — derselbe Grund wie bei kannAbsteigen() in M4.
function stopfenAktionText(){
  if(!STOPFEN.da || kammer || currentLevel !== 1) return '';
  if(!CONFIG.schichtModus || !LANGVORGAENGE.stopfen.wenn()) return '';
  const st = stopfenStand();
  if(st === 0) return 'Nachsehen';
  if(st === 1) return 'Freilegen';
  if(st === 3) return 'Die Röhre öffnen';
  return '';   // Stufe 2: hier fehlt Zapf, und der steht im Dorf
}

// Der Griff an der Stelle. Die beiden ersten Stufen sind Ortsschritte des
// Strangs, die vierte ist die Szene. Geschrieben wird auch hier nur ueber
// langEreignis(), nie an kladde.lang vorbei.
function stopfenGriff(){
  if(!stopfenAktionText()) return;
  const st = stopfenStand();
  if(st === 3){ szeneOeffnen('stopfen', SZENEN.stopfen.start); return; }
  const vorher = st;
  langEreignis('stopfenort', null);
  const neu = stopfenStand();
  if(neu <= vorher) return;
  const z = STOPFEN_BEATS[neu - 1];
  // Nachsehen und Freilegen sind zwei Griffe an derselben Stelle, und wer sie
  // hintereinander tut, hatte bis hierher vier Zeilen uebereinander stehen —
  // unlesbar, und im Bild gefunden statt im Guard. Die Zeilen des vorigen
  // Schritts weichen deshalb, sobald der naechste spricht.
  for(let i = floaters.length - 1; i >= 0; i--)
    if(STOPFEN_BEATS.some(b => b.z1 === floaters[i].txt || b.z2 === floaters[i].txt)) floaters.splice(i, 1);
  floaters.push({x: player.x, y: player.y - 44, txt: z.z1, col:'#c9b98a', t: 3.4});
  floaters.push({x: player.x, y: player.y - 26, txt: z.z2, col:'#9a8a5f', t: 3.4});
  sfx.level(); addShake(6, 0.3);
}

// Gezeichnet wird erst, was aufgedeckt ist. Vor dem ersten Nachsehen steht dort
// nichts: das Brummen ist die einzige Auskunft, und ein sichtbarer Huegel waere
// bereits der Questmarker, den die Weltbibel ausschliesst.
function drawStopfen(){
  if(!STOPFEN.da || kammer || currentLevel !== 1) return;
  const st = stopfenStand();
  if(st <= 0 || !vis(STOPFEN.x, STOPFEN.y)) return;
  const x = STOPFEN.x, y = STOPFEN.y;
  ctx.save();
  // Die aufgegrabene Stelle, in beiden Faellen dieselbe: dunkle Erde mit Rand.
  ctx.fillStyle = '#2b2119';
  ctx.beginPath(); ctx.ellipse(x, y + 4, 17, 10, 0, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#57422e'; ctx.lineWidth = 2; ctx.stroke();
  if(st >= 2){
    // Die Roehre: gebrannter Ton, armdick, quer in der Grube. Zwei Ringe, damit
    // sie als Rohr lesbar ist und nicht als Balken.
    ctx.fillStyle = '#8a5a3c';
    ctx.fillRect(x - 15, y - 2, 30, 9);
    ctx.fillStyle = '#a9704b';
    ctx.fillRect(x - 15, y - 2, 30, 3);
    ctx.strokeStyle = '#5d3b26'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x - 6, y - 2); ctx.lineTo(x - 6, y + 7);
    ctx.moveTo(x + 6, y - 2); ctx.lineTo(x + 6, y + 7); ctx.stroke();
  }
  if(st >= 4){
    // Gezogen: die Kapsel steckt wieder drin, und zwar andersherum. Ein heller
    // Strich am Rohrende ist alles, was man davon sieht.
    ctx.fillStyle = '#f4d97a';
    ctx.fillRect(x + 13, y - 1, 4, 7);
  } else if(stopfenAktionText()){
    // Solange hier etwas zu tun ist, atmet ein Ring. Er sagt "hier", nicht "was".
    ctx.strokeStyle = '#7ad6ff'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y, 20 + Math.sin(gameT*2.2)*2, 0, Math.PI*2); ctx.stroke();
  }
  ctx.restore();
}

// --- Kammer bauen -----------------------------------------------------------
function betreteKammer(tuer){
  if(kammer || currentLevel !== 1 || tuer.cd > 0) return;
  knIdleT = 0;
  if(!kn.flags.hatKammerBetreten){ kn.flags.hatKammerBetreten = true; saveKn(); }
  anlage2Umschlag('ersteKammer');   // T4
  owSave = {mapCopy: map.slice(), trees, decos: decos.slice(), critters: critters.slice(),
            npcs: npcs.slice(), monsters: monsters.slice(), drops: drops.slice(), boss, portal,
            level: currentLevel, px: player.x, py: player.y};

  // M3: drei Saetze. 1-2 Dungeon_1, 3-4 Dungeon_2, 5 der Stollen. Der Stollen erbt
  // seine Moebel von Dungeon_2, weil der Cave-Satz keine hat (s. addSheet oben) —
  // deshalb ist der Moebelindex nicht set+1, sondern bei Satz 2 wieder die 2.
  const set = tuer.diff <= 2 ? 0 : (tuer.diff <= 4 ? 1 : 2);
  const moebel = set === 2 ? 2 : set + 1;
  const k = {tuer, diff: tuer.diff, tier: tuer.tier, biome: tuer.biome, set,
             // M4: die Ebene, auf der man steht, und wie viele es hier gibt. Beide
             // Zahlen liegen an der Kammer und nicht global, weil verlasseKammer()
             // sie mitsamt der Kammer wegwirft — eine Ebene ueberlebt den Ausgang
             // so wenig wie ein geoeffnetes Tor.
             ebene: 0, ebenen: KAM_EBENEN[set], abstieg: null,
             mods: [], raeume: [], tore: [], props: [], idx: 0, geleert: false, truhe: null,
             // R6/F31: Sheet-Keys des Sets einmal beim Kammeraufbau, statt sie in
             // drawKammerObj()/drawProp() pro sichtbarem Objekt pro Frame neu zu bauen.
             dkGate: `dun${moebel}_gate`, dkGateAnim: `dun${moebel}_gateAnim`,
             dkPlate: `dun${moebel}_plate`, dkStairs: `dun${moebel}_stairsDown`,
             dkPillar: `dun${moebel}_pillar`};
  kammer = k;
  currentLevel = 3;
  baueEbene(k, waehleModule(tuer.diff));
  sfx.warp(); addShake(12, 0.5);
  floaters.push({x: player.x, y: player.y - 46, txt: 'KAMMER · SCHWIERIGKEIT ' + k.diff, col:'#f4d97a', t: 3.0, big: true});
}

// M4: der Korridorbau, aus betreteKammer() herausgeloest. Er lief dort als
// gerader Block und war damit genau einmal aufrufbar; die zweite Ebene braucht
// ihn ein zweites Mal an derselben Kammer. Alles, was eine Ebene ausmacht,
// wird hier zurueckgesetzt und neu gebaut — was die Kammer ausmacht (Tuer,
// Schwierigkeit, Biom, Satz, Blattschluessel), fasst er nicht an.
function baueEbene(k, kinds){
  const tief = k.ebene > 0;
  k.mods.length = 0; k.raeume.length = 0; k.tore.length = 0; k.props.length = 0;
  k.idx = 0; k.truhe = null; k.geleert = false; k.abstieg = null;
  // Muss vor dem Modulbau passieren: der ruft makeMon, und die Mobs der oberen
  // Ebene saessen sonst mit ihren alten Koordinaten in den frischen Waenden fest.
  monsters.length = 0; boss = null; lockedTarget = null;

  map.fill(G_WALL);
  const anzahl = kinds.length + 2;                       // Vorraum + Module + Schatzkammer
  for(let i = 0; i < anzahl; i++){
    const x0 = KAM_X0 + i*(KAM_W-1);
    const r = {x0, y0: KAM_Y0, x1: x0 + KAM_W - 1, y1: KAM_Y0 + KAM_H - 1};
    for(let y = r.y0+1; y < r.y1; y++) for(let x = r.x0+1; x < r.x1; x++) setT(x, y, G_PATH);
    k.raeume.push(r);
  }
  for(let i = 0; i < anzahl-1; i++){
    const tor = {kt:'tor', tx: k.raeume[i].x1, ty: KAM_TY, offen: false,
                 x: tileMid(k.raeume[i].x1), y: (KAM_TY+1)*TS};
    k.tore.push(tor); k.props.push(tor);
  }
  oeffneTor(0, true);                                    // Vorraum -> erstes Modul ist immer offen

  for(let i = 0; i < kinds.length; i++){
    const mod = {kind: kinds[i], raum: k.raeume[i+1], nr: i, fertig: false, begonnen: false, hinweis: ''};
    KAM_MOD[kinds[i]].bau(mod, k.raeume[i+1], k);
    k.mods.push(mod);
    if(!mod.keineWaechter) setzeWaechter(k.raeume[i+1], 1 + (k.diff >> 1) + (tief ? KAM_EBENE2_WAECHTER : 0), k);
  }

  // Schatzkammer: Truhe in der Mitte, ab Schwierigkeit 5 bewacht der Alte Schrecken sie
  const sk = k.raeume[anzahl-1];
  k.truhe = {kt:'truhe', x: tileMid(sk.x0+6), y: tileMid(sk.y0+7), auf: false};
  k.props.push(k.truhe);
  if(k.diff >= 5) makeMon('bossgeneric', tileMid(sk.x0+9), tileMid(sk.y0+7));

  // M4: der Abstieg liegt in der Schatzkammer, drei Kacheln neben der Truhe.
  // Nicht auf ihr: aktBiete() nimmt den naechsten Kandidaten, und ein Loch im
  // Boden direkt unter der Truhe haette den Ausgang verschluckt, den die
  // geoeffnete Truhe selbst anbietet. Er entsteht schon beim Bau und ist
  // trotzdem erst nach der Truhe nutzbar — sichtbar ist er von Anfang an,
  // denn ein Loch im Boden versteckt sich nicht.
  if(k.ebene + 1 < k.ebenen){
    k.abstieg = {kt:'abstieg', x: tileMid(sk.x0+3), y: tileMid(sk.y0+7)};
    k.props.push(k.abstieg);
  }

  // Ausgangsrune im Vorraum: der Weg zurück steht von Anfang an offen
  k.ausgang = {kt:'rune', x: tileMid(KAM_X0+2), y: tileMid(KAM_TY)};
  k.props.push(k.ausgang);
  k.start = {x: tileMid(KAM_X0+5), y: tileMid(KAM_TY)};   // Abstand zur Rune, sonst reist man beim ersten F zurück
  // Reine Bodendecke, kein Kontaktpunkt: der Einstieg zeigt, womit man
  // hereingekommen ist. Oben ist das die Treppe des Satzes, unten die Leiter,
  // die man in der Schatzkammer darueber genommen hat.
  k.props.push({kt:'treppe', x: k.start.x, y: k.start.y, leiter: tief});

  // Wandfelsen nur auf den Wänden, die an begehbaren Boden grenzen — das ist der
  // sichtbare Innenring. Der Rest der Karte bleibt gebackene Dunkelheit.
  baueWandProps();
  decos.length = 0; critters.length = 0; npcs.length = 0;
  drops.length = 0; corpses.length = 0; floaters.length = 0;
  projectiles.length = 0; enemyBolts.length = 0; magicEffects.length = 0;
  portal = null;

  player.x = k.start.x; player.y = k.start.y;
  cam.x = player.x - canvas.width/2; cam.y = player.y - canvas.height/2;
  refreshFloor();
  aktSperre = 0.5;                          // Tastenwiederholung soll nicht sofort zurückreisen
}

// M4: hinunter. Die Bedingung steht als eigene Funktion da, weil sie an zwei
// Stellen gebraucht wird — scanAktion() bietet den Abstieg an, steigeAb() fuehrt
// ihn aus, und eine Kontextaktion, die etwas anderes prueft als die Ausfuehrung,
// ist ein Fehler, der sich erst im Spiel zeigt.
// Die Truhe muss offen sein: erst der Vorgang, dann die Neugier. Wer die obere
// Ebene stehen laesst, holt sich die untere nicht als Abkuerzung.
function kannAbsteigen(){
  const k = kammer;
  return !!k && !!k.abstieg && !!k.truhe && k.truhe.auf && k.ebene + 1 < k.ebenen;
}
function steigeAb(){
  const k = kammer;
  if(!kannAbsteigen()) return;
  k.ebene++;
  // Eigenes Budget statt waehleModule(k.diff): unten steht ein Raetselraum und
  // nicht der halbe Korridor noch einmal. Das ist die Stellschraube, an der die
  // Schichtuhr haengt (s. phase-m4-zweite-ebene.md, Abschnitt Messung).
  const kinds = waehleModuleBudget(KAM_EBENE2_BUDGET, 1);
  baueEbene(k, kinds);
  anlage2Umschlag('ersteSperrablage');   // T4
  sfx.warp(); addShake(14, 0.6);
  floaters.push({x: player.x, y: player.y - 46, txt: 'DIE SPERRABLAGE · EBENE ' + (k.ebene + 1),
                 col:'#c77dff', t: 3.0, big: true});
  floaters.push({x: player.x, y: player.y - 26, txt: 'Hier wird nichts mehr bearbeitet, hier wird verwahrt.',
                 col:'#c9b98a', t: 4.0});
}

// Requisiten am sichtbaren Innenring: Pillars und vereinzelte Objekte stehen auf
// der Wandkachel selbst (Fuß auf ihrer Unterkante), Spinnweben hängen oben in
// die Kachel hinein. Bewusst sparsam (nur jede 5.-7. Kachel) — die Wandkachel
// trägt jetzt selbst echte Dungeon-Optik, anders als beim alten Felsenersatz,
// der die einzige Wanddarstellung war.
function baueWandProps(){
  const t2 = [];
  const r0 = kammer.raeume[0], rn = kammer.raeume[kammer.raeume.length-1];
  for(let y = r0.y0; y <= r0.y1; y++){
    for(let x = r0.x0; x <= rn.x1; x++){
      if(T(x,y) !== G_WALL) continue;
      if(!(walkT(x-1,y) || walkT(x+1,y) || walkT(x,y-1) || walkT(x,y+1))) continue;
      const h = tileHash(x,y);
      if(h % 6 === 0)
        t2.push({kt:'pillar', x: tileMid(x), y: y*TS + TS - 2, variant: (h>>>3) % 3});
      else if(h % 11 === 0)
        t2.push({kt:'pot', x: tileMid(x), y: y*TS + TS - 4});   // bewusst kein Kistensprite: Kisten sind die schiebbaren Blöcke
      else if(h % 13 === 0)
        t2.push({kt:'cobweb', x: tileMid(x), y: y*TS - TS/2});
    }
  }
  t2.sort((a,b)=>a.y-b.y);
  trees = t2;
}

function setzeWaechter(r, n, k){
  for(let i = 0; i < n; i++){
    const tx = rri(r.x0+2, r.x1-2), ty = rri(r.y0+2, r.y1-2);
    if(!walkT(tx, ty)) continue;
    makeMon(kamWaechterZufall(k.diff), tileMid(tx), tileMid(ty));
  }
}

// malBoden()/malBodenUmfeld() sind mit dem Chunk-Cache entfallen — ihr einziger
// Zweck war, einen Komplettbake (6400 drawImage) beim Türöffnen zu vermeiden.
// invalidateMoore() (bei computeTile()/bakeChunk()) übernimmt das jetzt über
// Chunk-Ungültigkeit statt über Neuzeichnen: billiger, und deckt exakt dieselbe
// Nachbarschaft ab (Wandkacheln lesen ihre Nachbarn für die Kantenmaske, auch
// diagonal — wer begehbar wird, ändert also die Optik der Wände ringsum).
function oeffneTor(i, still){
  const tor = kammer.tore[i]; if(!tor || tor.offen) return;
  tor.offen = true;
  tor.openT = gameT;
  for(let dy = -1; dy <= 1; dy++){ setT(tor.tx, tor.ty+dy, G_PATH); invalidateMoore(tor.tx, tor.ty+dy); }
  const tmx = tileMid(tor.tx), tmy = tor.ty*TS + TS - 2;
  trees = trees.filter(p => !(Math.abs(p.x - tmx) < 2 && Math.abs(p.y - tmy) < TS*1.6));
  bakeMinimap();
  if(!still){ sfx.level(); addShake(8, 0.35); }
}

// --- Verlassen --------------------------------------------------------------
function verlasseKammer(){
  if(!kammer || !owSave) return;
  const tuer = kammer.tuer;
  map.set(owSave.mapCopy);
  trees = owSave.trees;
  decos.length = 0; for(const d of owSave.decos) decos.push(d);
  critters.length = 0; for(const c of owSave.critters) critters.push(c);
  npcs.length = 0; for(const n of owSave.npcs) npcs.push(n);
  monsters.length = 0; for(const m of owSave.monsters) monsters.push(m);
  drops.length = 0; for(const d of owSave.drops) drops.push(d);
  corpses.length = 0; floaters.length = 0;
  projectiles.length = 0; enemyBolts.length = 0; magicEffects.length = 0;
  boss = owSave.boss; portal = owSave.portal;
  currentLevel = owSave.level; lockedTarget = null;
  player.x = tuer.x; player.y = tuer.y + TS;             // vor der Tür, nicht in ihr
  player.kampfT = 0;      // Nüchternheitsgebot darf nicht über den Kammerausgang hinaus wirken
  kammer = null; owSave = null; aktSperre = 0.5;
  if(schlossOpen) schlossZu();
  // Der Weg hinein schneidet (baueEbene setzt die Kamera dort von Hand), der Weg
  // hinaus muss es auch. Ohne diese Zeile lerpt die Kamera vom Kammervorraum
  // quer über die Karte zurück zur Tür — die Kammer liegt immer bei KAM_X0, die
  // Tür irgendwo in ihrem Band, das sind regelmäßig mehrere tausend Pixel. Was
  // dabei durchs Bild zieht, bäckt sich als Boden-Chunk fest; die Begründung,
  // warum das auf dem Telefon nicht nur Arbeit, sondern ein schwarzes Bild ist,
  // steht bei camSnap(). verlasseHaus() (IN1) hat die Zeile von Anfang an.
  camSnap();
  setStyle('bossbar', 'display', boss && !boss.dead ? 'block' : 'none');
  refreshFloor();
  sfx.warp();
}

// ===========================================================================
//  IN1: Innenräume — drei Türen, die aufgehen
// ===========================================================================
// Zwei Stellen im Kanon sind ausdrücklich als Notlösung notiert, und beide
// nennen denselben Grund:
//
//   weltgeschichte.md: "Ein Gasthaus als betretbares Gebäude gibt es nicht;
//   Fass und Umlauf stehen ohnehin nebeneinander im Dorf."
//   weltgeschichte.md: "Szene 3 hängt im Amtspanel, neben der Gießkanne, weil
//   die Amtsstube kein begehbares Inneres hat."
//
// Ab hier hat sie eins. Gebaut ist das mit dem Trick, den betreteKammer() seit
// G1 benutzt: die Oberwelt wird eingefroren, die Karte überschrieben, und beim
// Hinausgehen kommt alles zurück. Was hier NICHT von der Kammer kommt, ist der
// Rest — kein Modul, kein Tor, kein Wächter, keine Truhe. Ein Innenraum ist ein
// gezeichneter Grundriss mit Möbeln darin, und das ist absichtlich das ganze
// Verfahren: was man betreten kann, muss nichts von einem herrschen wollen.
//
// **Das Blattmaterial ist das, was da war.** Das Grafikpaket hat einen
// vollständigen Innenraumsatz (Houses_Interiors, House_Decor: Betten, Regale,
// Tische, Kamine, eine ganze Küche) — nur liegt davon keine einzige Datei im
// Repo, weil `assets/cf/` seit G5 ausschließlich trägt, was das Spiel lädt.
// Boden und Wand kommen deshalb aus den Kammerblättern, warm überfärbt, und
// die Möbel sind gezeichnet wie der Kessel und die Grube im Steinfeld: mit
// ctx-Grundformen, in den Farben des Hauses. Wer den Innenraumsatz eines Tages
// dazulegt, tauscht INN_SAETZE und die Möbelzeichner und lässt alles andere
// stehen. Bis dahin ist es nicht perfekt, aber es ist begehbar, und begehbar
// war der Punkt.

// Der Grundriss liegt an derselben Stelle der Karte wie eine Kammer — die Karte
// ist ohnehin komplett überschrieben, solange man drinnen ist.
const INN_X0 = 4, INN_Y0 = 34;

// Die Kachelsaetze. `boden` und `wand` nennen das geschnittene Blatt (siehe
// tools/innen-zellen.mjs) und die linke obere Zelle des 2x2-Musters darin;
// `ersatz` ist der Weg von IN1, als es die Blaetter noch nicht gab: ein
// Kammerblatt aus DUN_SET, warm ueberfaerbt.
//
// Warum je Raum ein anderes Paar: die drei Raeume sollen sich beim Betreten
// unterscheiden lassen, ohne dass jemand die Ortszeile liest. Und jedes Paar
// hat einen Grund. Das Amt bekommt den grauen Bruchstein, den auch der Sockel
// seines Blattes traegt, auf warmem Ziegelboden — kalt an den Waenden, warm
// unter den Fuessen. Das Wirtshaus ist rundum Holz. Die Registratur steht auf
// kaltem Stein zwischen roten Ziegeln, was ein Archiv sein darf.
//
// Die Boden-Zellen sind bewusst als 2x2-Muster gelesen und nicht per tileHash
// gestreut: das Blatt legt vier 16er-Zellen zu EINEM 32er-Muster zusammen, und
// eine gehashte Streuung zerschnitte den Verband, den sie bilden. Gestreut wird
// draussen, wo Gras Gras ist; drinnen liegt ein Boden.
const INN_SAETZE = {
  amt:         {boden:['innen_boden', 32,  0], wand:['innen_wand_stein'],
                ersatz:{satz:1, boden:['#b98f52', 0.42], wand:['#2b2119', 0.72]}},
  wirtshaus:   {boden:['innen_boden',  0, 32], wand:['innen_wand_holz'],
                ersatz:{satz:0, boden:['#a2622f', 0.46], wand:['#241610', 0.74]}},
  registratur: {boden:['innen_boden',  0, 64], wand:['innen_wand_ziegel'],
                ersatz:{satz:1, boden:['#9a8f6a', 0.44], wand:['#26221a', 0.72]}},
};
// Liegen die geschnittenen Blaetter ueberhaupt da? Einmal gefragt statt je
// Kachel: die Antwort aendert sich nach loadAssets() nicht mehr.
const innenBlattDa = k => !!(SHEETS[k] && SHEETS[k].img);

const INN_CACHE = {};
// Die Dunkelheit hinter der Wand. Eine einzige gebackene Kachel, kein Blatt:
// sie ist ueberall dieselbe und soll es auch sein.
let innenDunkelC = null;
function bakeInnenDunkel(){
  if(innenDunkelC) return innenDunkelC;
  const c = makeCanvas(TS, TS), cc = c.getContext('2d');
  cc.fillStyle = '#0d0a08'; cc.fillRect(0, 0, TS, TS);
  return (innenDunkelC = c);
}
// wand: die Fuellblaetter sind nahtlose Texturen. Gezeichnet wird deshalb nach
// Weltposition (x,y modulo Zellenzahl) und nicht nach Hash — sonst zerfaellt
// ein durchgehender Mauerverband in Flicken.
// schatten: eine Bodenkachel, ueber der eine Wand steht, bekommt oben einen
// weichen dunklen Saum. Das ist der billigste Trick, mit dem eine Wand von oben
// Hoehe bekommt, und er kostet eine gebackene Zweitfassung je Kachel.
function bakeInnenTile(raumKey, uv, wand, schatten){
  const ck = raumKey + ',' + uv[0] + ',' + uv[1] + ',' + (uv[2] || '') + (wand ? 'w' : 'b') + (schatten ? 's' : '');
  if(INN_CACHE[ck]) return INN_CACHE[ck];
  const satz = INN_SAETZE[raumKey];
  const echt = wand ? satz.wand[0] : satz.boden[0];
  const c = makeCanvas(TS, TS), cc = c.getContext('2d');
  cc.imageSmoothingEnabled = false;
  if(innenBlattDa(echt)){
    cc.drawImage(SHEETS[echt].img, uv[0], uv[1], 16, 16, 0, 0, TS, TS);
  } else {
    // Ersatzweg: dasselbe Kammerblatt und dieselbe Ueberfaerbung wie in IN1.
    const e = satz.ersatz;
    const sheet = SHEETS[uv[2] || DUN_SET[e.satz].key]; if(!sheet) return null;
    cc.drawImage(sheet.img, uv[0], uv[1], 16, 16, 0, 0, TS, TS);
    cc.globalCompositeOperation = 'source-atop';
    const t = wand ? e.wand : e.boden;
    cc.globalAlpha = t[1]; cc.fillStyle = t[0];
    cc.fillRect(0, 0, TS, TS);
    cc.globalCompositeOperation = 'source-over'; cc.globalAlpha = 1;
  }
  if(schatten){
    const g = cc.createLinearGradient(0, 0, 0, TS*0.4);
    g.addColorStop(0, 'rgba(0,0,0,0.42)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    cc.fillStyle = g; cc.fillRect(0, 0, TS, TS*0.4);
  }
  INN_CACHE[ck] = c;
  return c;
}
// Die Kachel fuer (x,y) im Innenraum.
function innenTile(x, y){
  const satz = INN_SAETZE[innen.key];
  const wand = T(x,y) === G_WALL;
  if(!wand){
    const untermWand = T(x, y-1) === G_WALL;
    // Der 2x2-Verband des Blattes, an der Weltposition festgemacht.
    if(innenBlattDa(satz.boden[0]))
      return bakeInnenTile(innen.key, [satz.boden[1] + (x & 1)*16, satz.boden[2] + (y & 1)*16], false, untermWand);
    const ds = DUN_SET[satz.ersatz.satz];
    return bakeInnenTile(innen.key, ds.floor[tileHash(x,y) % ds.floor.length], false, untermWand);
  }
  if(innenBlattDa(satz.wand[0])){
    // Mauerwerk bekommt genau der Rand, den der Grundriss selbst zeichnet; alles
    // ausserhalb seines Rechtecks bleibt dunkel. Das ist derselbe Satz, mit dem
    // baueWandProps() seit G1 die Kammer begrenzt ("Der Rest der Karte bleibt
    // gebackene Dunkelheit") — und der erste Lauf mit den echten Blaettern hat
    // gezeigt, warum er dort steht: eine Ziegeltextur ueber die ganze Karte
    // fuellt den Schirm, und ein Raum, dessen Wand bis zum Bildrand weitergeht,
    // ist kein Raum mehr, sondern ein Muster.
    const r = innen.raum;
    if(x < INN_X0 || y < INN_Y0 || x >= INN_X0 + r.w || y >= INN_Y0 + r.h) return bakeInnenDunkel();
    const s = SHEETS[satz.wand[0]];
    const sp = Math.max(1, Math.round(s.img.width / 16)), ze = Math.max(1, Math.round(s.img.height / 16));
    return bakeInnenTile(innen.key, [(((x % sp) + sp) % sp)*16, (((y % ze) + ze) % ze)*16], true, false);
  }
  // Ersatzweg: die Ringlogik der Kammer, die Kanten und Ecken kennt.
  const ds = DUN_SET[satz.ersatz.satz];
  const n = walkT(x,y-1), e = walkT(x+1,y), s = walkT(x,y+1), w = walkT(x-1,y);
  let uv = null;
  if(s && !n && !e && !w) uv = ds.edgeS;
  else if(n && !s && !e && !w) uv = ds.edgeN;
  else if(e && !n && !s && !w) uv = ds.edgeE;
  else if(w && !n && !s && !e) uv = ds.edgeW;
  else if(!n && !e && !s && !w){
    if(walkT(x+1,y+1)) uv = ds.eckSE;
    else if(walkT(x-1,y+1)) uv = ds.eckSW;
    else if(walkT(x+1,y-1)) uv = ds.eckNE;
    else if(walkT(x-1,y-1)) uv = ds.eckNW;
  }
  return bakeInnenTile(innen.key, uv || ds.wall[tileHash(x,y) % ds.wall.length], true, false);
}

// --- Die Möbel -------------------------------------------------------------
// Ein Zeichen im Grundriss ist ein Feld. Großbuchstabe = hier fängt ein Möbel
// an, Kleinbuchstabe desselben Zeichens = dasselbe Möbel geht weiter. Ein Tisch
// über zwei Felder heißt also 'Tt', und der Zeichner bekommt seine Breite
// mitgeteilt statt sie zu raten. Das ist die billigste Fassung, die keine
// zweite Tabelle braucht: der Grundriss IST die Tabelle, und zwei Möbel können
// nicht auf demselben Feld stehen, weil ein Feld ein Zeichen trägt.
//
// frei:true heißt begehbar. Das gilt für alles, was an der Wand hängt (Fackel,
// Spinnwebe — die Wand sperrt ohnehin) und für die Schwelle.
const INN_MOEBEL = {
  '.': {frei:true},
  '#': {},
  'A': {name:'Ausgang',        frei:true},
  'F': {name:'Fackel',         frei:true, wand:true},
  // AN3: die beiden Wandstuecke, die bis dahin Introblaetter waren. Sie haengen
  // (frei:true, die Wand sperrt ohnehin, und die Tafel haengt ueber dem Weg
  // hinaus, unter dem man durchgeht). akt:'requisit' sagt nur, DASS sie etwas
  // tragen; WAS sie tragen, steht in REQUISITEN und wird ueber requisit
  // nachgeschlagen -- eine Zeichenkette an zwei Orten waere die F1-Falle.
  //
  // 'K' waere der Buchstabe fuer Karte gewesen und ist seit IN1 die Kiste,
  // also bekommt sie 'C'. 'G' ist die Gesetzestafel.
  'G': {name:'Tafel über der Tür', frei:true, wand:true, akt:'requisit', requisit:'gesetz'},
  'C': {name:'Karte der Ablage',   frei:true, wand:true, akt:'requisit', requisit:'karte'},
  'W': {name:'Spinnwebe',      frei:true, wand:true},
  'N': {name:'Fenster',        frei:true, wand:true},
  'Q': {name:'Flaschenbord',   frei:true, wand:true},
  'R': {name:'Aktenregal'},
  'K': {name:'Kiste'},
  'O': {name:'Krug'},
  'D': {name:'Dienstpult',     akt:'pult'},
  'S': {name:'Schreibtisch der Amtsleitung', akt:'schublade'},
  'E': {name:'Schreibtisch'},
  'T': {name:'Tisch'},
  'B': {name:'Bank'},
  'U': {name:'Hocker'},
  'V': {name:'Fass'},
  'L': {name:'Holzscheite'},
  'P': {name:'Pendeluhr'},
  'X': {name:'Theke'},
  'H': {name:'Herdfeuer'},
  'Y': {name:'Aktenstapel'},
  'Z': {name:'Der freigehaltene Platz'},
};

// --- Die drei Grundrisse ---------------------------------------------------
// Jede Zeile ist eine Kachelreihe, alle gleich lang, Rand rundherum Wand, und
// genau ein Ausgang in der Südwand — dort, wo draußen die gemalte Tür sitzt.
// innenAssert() rechnet all das nach.
const INN_RAEUME = {
  // Die leere Stelle, jetzt mit Fußboden. Rechts steht der Schreibtisch von
  // Dr. Sturz, auf ihm die Pflanze, in ihm die zweite Schublade. Links das
  // Dienstpult, an dem man Feierabend nimmt. Dazwischen Platz, und das ist der
  // Punkt des Raumes: er ist zu groß für die zwei Leute, die noch da sind.
  //
  // AN3: an der Nordwand hängt zwischen den Regalen die Karte der Ablage, über
  // dem Weg hinaus die Tafel mit dem Weltgesetz. Beide standen bis dahin als
  // Introblätter da und wurden vorgelesen; jetzt hängen sie da und werden
  // gelesen, von dem, der hinsieht. Die Tafel hängt über der Tür und nicht
  // neben ihr, weil genau das ihr Satz ist: sie steht über der Tür des Hauses,
  // und jeder im Dienst geht auf dem Weg nach draußen darunter durch.
  amt: {
    name: 'Amtsstube',
    plan: [
      '#################',
      '#FRRRRRCcRRRRRRF#',
      '#...............#',
      '#.Dd.......Ss...#',
      '#...............#',
      '#.K............K#',
      '#...............#',
      '#..Ee.......O...#',
      '#...............#',
      '#......Gg.......#',
      '#######AA########',
    ],
    // Wer zum Feierabend hier drinsteht. Nörgel sitzt seit einundvierzig Jahren
    // auf Probe an diesem Schreibtisch; dass er der Letzte im Haus ist, muss
    // niemand sagen, man sieht es.
    leute: [{key:'noergel', tx:3, ty:8}],
  },
  // Zum Letzten Stempel. Die Theke, dahinter Fass, daneben der Platz, den er
  // freihält (Grundzeile 4: "Ich halte einen Platz frei."). Er ist ein Stuhl
  // und bleibt ein Stuhl; erklärt wird er nicht.
  //
  // Zweite Nachlese: drei Hocker an der Theke, damit der freigehaltene Platz
  // einer in einer Reihe ist statt der einzige Sitz im Raum — allein steht er
  // da wie ein Denkmal, in der Reihe fällt erst auf, dass auf ihm niemand
  // sitzt. Dahinter zwei Fässer, eins bei den Kisten; der Wirt heißt Fass, und
  // das Haus macht daraus kein Wortspiel, es stellt ihm nur welche hin.
  //
  // Dafür ist der dritte Tisch gegangen, und zwar gemessen, nicht aus Geschmack:
  // ein Möbel wird über seiner Fußlinie nach oben gezeichnet, ein Tisch zwei
  // Kacheln hoch. Die Hockerreihe in Zeile 4 verschwand vollständig hinter den
  // Tischen in Zeile 5. Zwischen Theke und Tischen liegt jetzt eine leere Reihe
  // — die Luft, die eine Schankstube ohnehin braucht, damit man an die Theke
  // treten kann, ohne über eine Bank zu steigen.
  //
  // Zwei Fenster in der Nordwand und eine Standuhr an der Ostwand. Die Fenster
  // zeigen Abend, weil man zum Feierabend hineingeht; die Uhr steht in einem
  // Haus, das "Zum Letzten Stempel" heißt, und sagt kein Wort dazu.
  wirtshaus: {
    name: 'Zum Letzten Stempel',
    plan: [
      '###############',
      '#FN.Qqq.W.##NF#',
      '#VV.......HhLl#',
      '#.Xxxxx.......#',
      '#..UUUZ......P#',
      '#.............#',
      '#..Tt....Tt...#',
      '#..Bb....Bb...#',
      '#.K.......V.K.#',
      '#.............#',
      '######AA#######',
    ],
    // Umlauf isst schnell und redet schneller, und die Weltgeschichte setzt das
    // ausdrücklich hierher: "Einmal in diesem Akt sitzt eine fremde Frau im
    // Letzten Stempel." Ab Akt II sitzt sie da, wo sie hingehört.
    leute: [{key:'fass', tx:3, ty:2}, {key:'umlauf', tx:9, ty:4}],
  },
  // Ordnung ist, was man wiederfindet. Sechs Regalblöcke, zwei Gänge, hinten
  // ein Pult und ein Stapel, auf dem Anlage 3 schläft.
  registratur: {
    name: 'Registratur',
    plan: [
      '#############',
      '#FRRRRRRRRRF#',
      '#...........#',
      '#.Rr.Rr.Rr..#',
      '#.Rr.Rr.Rr..#',
      '#...........#',
      '#.Rr.Rr.Rr..#',
      '#.Rr.Rr.Rr..#',
      '#...........#',
      '#.Ee.....Y..#',
      '#####AA######',
    ],
    leute: [{key:'bramsche', tx:2, ty:8}],
  },
};
// Breite und Höhe stehen nicht in der Tabelle, sie stehen im Grundriss. Eine
// zweite Zahl daneben wäre die F1-Falle: eine Zahl an zwei Orten.
for(const k in INN_RAEUME){
  const r = INN_RAEUME[k];
  r.key = k; r.w = r.plan[0].length; r.h = r.plan.length;
  r.zeichen = (rx, ry) => (r.plan[ry] || '')[rx] || '#';
}

// Welches Gebäude hat welchen Raum, und wo ist seine Schwelle in der Oberwelt?
const INN_HAEUSER = VILLAGE_BUILDINGS.filter(b => b.innen)
  .map(b => ({b, raum: INN_RAEUME[b.innen], tuer: bldTuer(b)}));

// --- Wer ist gerade drinnen? -----------------------------------------------
// Eine Figur steht in ihrem Haus, wenn Feierabend ist. Der Schalter ist nicht
// neu erfunden: es ist derselbe, den die Gesprächsbäume seit F1 als
// phase:'feierabend' benutzen — letztes Viertel der Schicht. Ohne Schichtuhr
// ist immer Feierabend, und das ist keine Ausrede, sondern die Wahrheit über
// das freie Spiel: dort hört kein Tag auf, also geht auch niemand mehr heim.
//
// Das ist der ganze Tagesablauf, den dieser Bauabschnitt hat. Er reicht für
// den Zweck: Fass steht tagsüber auf dem Anger und abends hinter seiner Theke,
// und niemand steht zweimal gleichzeitig irgendwo.
function innenZeit(){ return !CONFIG.schichtModus || shiftT < 0.25 * CONFIG.schichtDauer; }
const figDrinnen = fig => !!(fig && fig.innenHaus && innenZeit());
// Steht diese Figur da, wo der Spieler gerade ist? Draußen heißt das "nicht
// drinnen", drinnen heißt es "sie wurde beim Betreten hier hingestellt".
const figHier = fig => figDa(fig) && (!!innen || !figDrinnen(fig));
// Rückverweis von der Figur auf ihr Haus, einmal gesetzt statt bei jeder Frage
// über drei Tabellen gesucht.
for(const k in INN_RAEUME)
  for(const p of INN_RAEUME[k].leute){
    const f = DORF_FIGUREN.find(f => f.key === p.key);
    if(f) f.innenHaus = k;
  }

// --- Hinein ----------------------------------------------------------------
function betreteHaus(haus){
  if(innen || kammer || currentLevel !== 1) return;
  innenSave = {mapCopy: map.slice(), trees, decos: decos.slice(), critters: critters.slice(),
               npcs: npcs.slice(), monsters: monsters.slice(), drops: drops.slice(), boss, portal,
               level: currentLevel, px: player.x, py: player.y};
  const r = haus.raum;
  innen = {key: r.key, raum: r, haus, moebel: [], tuer: null};
  currentLevel = 4;

  map.fill(G_WALL);
  for(let ry = 0; ry < r.h; ry++) for(let rx = 0; rx < r.w; rx++){
    const z = r.zeichen(rx, ry), m = INN_MOEBEL[z.toUpperCase()] || {};
    const wx = INN_X0 + rx, wy = INN_Y0 + ry;
    if(z === '#') continue;                                   // Wand bleibt Wand
    // Begehbar ist der Boden; ein Möbel sperrt sein Feld als G_BLOCK. G_BLOCK
    // steht nicht in der WALKABLE-Whitelist, damit ist die Kollision erledigt,
    // und computeTile() malt es trotzdem als Boden — das Möbel liegt darüber.
    setT(wx, wy, (m.frei || z === '.') ? G_PATH : G_BLOCK);
    if(z !== z.toUpperCase()) continue;                        // Fortsetzung: kein zweites Möbel
    if(z === '.') continue;
    let breit = 1;
    while(r.zeichen(rx + breit, ry) === z.toLowerCase()) breit++;
    const o = {z, x: tileMid(wx) + (breit-1)*TS/2, y: (wy+1)*TS, breit, name: m.name, akt: m.akt,
               requisit: m.requisit};   // AN3: welches Blatt dieses Wandstueck traegt
    if(z === 'A'){ if(!innen.tuer) innen.tuer = o; continue; } // die Schwelle wird nicht gezeichnet
    innen.moebel.push(o);
  }
  innen.moebel.sort((a,b) => a.y - b.y);

  // Die Leute. Sie kommen aus DORF_FIGUREN, nicht aus einer zweiten Liste —
  // dieselbe Figur, dieselben Zeilen, derselbe Gesprächsbaum, nur an einem
  // anderen Ort. fest:true, weil ein Wirt hinter seiner Theke nicht wandert.
  npcs.length = 0;
  // AN2: Liegt eine Besetzung vor, gilt sie und die Uhr schweigt. Sie traegt
  // fertige Eintraege, hier wird nur noch die Kachel in Weltpixel gerechnet —
  // dieselbe Rechnung wie unten, damit die beiden Wege nicht auseinanderlaufen.
  if(innenBesetzung){
    for(const p of innenBesetzung)
      npcs.push({...p.npc, homeX:tileMid(INN_X0+p.tx), homeY:(INN_Y0+p.ty)*TS + TS - 6,
                 x:tileMid(INN_X0+p.tx), y:(INN_Y0+p.ty)*TS + TS - 6,
                 fest:true, flip:false, vx:0, vy:0, restT:0, phase:0});
  }
  else for(const p of r.leute){
    const fig = DORF_FIGUREN.find(f => f.key === p.key);
    if(!fig || !figDa(fig) || !figDrinnen(fig)) continue;
    const {idle, walk} = npcBlaetter(fig);
    npcs.push({key:fig.key, figur:fig, homeX:tileMid(INN_X0+p.tx), homeY:(INN_Y0+p.ty)*TS + TS - 6,
               x:tileMid(INN_X0+p.tx), y:(INN_Y0+p.ty)*TS + TS - 6, sheetIdle:idle, sheetWalk:walk,
               fest:true, tint:fig.tint||null, tintA:fig.tintA,
               flip:false, vx:0, vy:0, restT:0, phase:rr(0,10),
               bubbleIdx:-1, bubbleText1:'', bubbleText2:'', bubbleHideAt:0});
  }
  // Der Wald muss raus. trees und decos sind die Oberwelt und werden von der
  // Zeichenliste ohne Levelprüfung gelesen — die Kammer räumt sie seit G1 an
  // derselben Stelle (baueWandProps() setzt trees auf die Wandfelsen um). Wer
  // das vergisst, steht in einer Amtsstube voller Birken. Genau so stand sie
  // beim ersten Lauf da.
  trees = []; decos.length = 0; critters.length = 0;
  monsters.length = 0; boss = null; lockedTarget = null;
  drops.length = 0; corpses.length = 0; floaters.length = 0;
  projectiles.length = 0; enemyBolts.length = 0; magicEffects.length = 0;
  portal = null;
  // Eine Kachel über der Schwelle, nicht auf ihr: sonst führt der erste Druck
  // auf F sofort wieder hinaus (dieselbe Falle wie bei k.start in baueEbene).
  player.x = innen.tuer.x; player.y = innen.tuer.y - TS - 8;
  camSnap();
  setStyle('bossbar', 'display', 'none');
  refreshFloor();
  sfx.warp();
  aktSperre = 0.5;
  floaters.push({x: player.x, y: player.y - 46, txt: r.name.toUpperCase(), col:'#f4d97a', t: 2.6, big: true});
}

// --- Hinaus ----------------------------------------------------------------
function verlasseHaus(){
  if(!innen || !innenSave) return;
  const tuer = innen.haus.tuer;
  map.set(innenSave.mapCopy);
  trees = innenSave.trees;
  decos.length = 0; for(const d of innenSave.decos) decos.push(d);
  critters.length = 0; for(const c of innenSave.critters) critters.push(c);
  npcs.length = 0; for(const n of innenSave.npcs) npcs.push(n);
  monsters.length = 0; for(const m of innenSave.monsters) monsters.push(m);
  drops.length = 0; for(const d of innenSave.drops) drops.push(d);
  corpses.length = 0; floaters.length = 0;
  projectiles.length = 0; enemyBolts.length = 0; magicEffects.length = 0;
  boss = innenSave.boss; portal = innenSave.portal;
  currentLevel = innenSave.level; lockedTarget = null;
  player.x = tuer.x; player.y = tuer.y + TS;                  // vor der Tür, nicht in ihr
  player.kampfT = 0;
  innen = null; innenSave = null; aktSperre = 0.5;
  gespraechSchliessen();
  camSnap();
  setStyle('bossbar', 'display', boss && !boss.dead ? 'block' : 'none');
  refreshFloor();
  sfx.warp();
}

// --- Die Möbel zeichnen ----------------------------------------------------
// Gezeichnet wird wie der Kessel und die Grube im Steinfeld: ctx-Grundformen in
// den Farben des Hauses. Jedes Möbel steht auf seiner Fußlinie (y = Unterkante
// des Feldes) und geht damit in dieselbe y-Sortierung wie Spieler und Figuren —
// man läuft hinter einem Regal her und wird davon verdeckt.
// Die Holzleiter. Sie ist keine Erfindung, sie ist gemessen: `tools/`-Nachlese
// hat aus tisch.png, bank.png, fass.png und standuhr.png die Farbhistogramme
// gezogen, und alle vier benutzen dieselben sechs Werte. Wer daneben etwas in
// einem anderen Braun malt, malt in einem anderen Spiel — die erste Fassung der
// Theke war gelblich und stach neben dem Packtisch heraus wie ein Fremdkörper.
//
//   #3f2832  Kontur       #743f39  tiefster Schatten   #8a4836  Schatten
//   #91533b  Mittelton    #b86f50  hell                #bf6f4a  Deckfläche
//   #c78160  Glanzkante   #e69c69  Lichtkante
const INN_HOLZ = '#91533b', INN_HOLZ_HELL = '#bf6f4a', INN_HOLZ_DUNKEL = '#3f2832';
const INN_HOLZ_TIEF = '#743f39', INN_HOLZ_SCHATTEN = '#8a4836', INN_HOLZ_GLANZ = '#c78160';
// Eigener Schatten statt drawShadowEllipse(): der ist fuer Figuren auf Gras
// gebaut (35 % Schwarz, halbe Hoehe) und liest sich auf einem Dielenboden als
// Pfuetze. Drinnen faellt Licht von der Decke, also flacher und blasser.
function innenSchatten(x, y, rx){
  ctx.fillStyle = 'rgba(0,0,0,0.20)';
  ctx.beginPath(); ctx.ellipse(x, y, rx, rx*0.26, 0, 0, Math.PI*2); ctx.fill();
}
// Der Schein, den ein offenes Feuer auf den Boden davor wirft. Er atmet, aber
// langsam und flach (0.86 bis 1.00), sonst flackert der halbe Raum im Takt
// einer Kerze. Kein Schatten unter dem Kamin: was an der Wand steht und selbst
// leuchtet, wirft keinen Schatten nach vorn.
function innenFeuerschein(x, y, rx){
  const g = ctx.createRadialGradient(x, y, 0, x, y, rx);
  g.addColorStop(0,   'rgba(255,176,84,0.30)');
  g.addColorStop(0.5, 'rgba(255,150,66,0.13)');
  g.addColorStop(1,   'rgba(255,140,60,0)');
  ctx.save();
  ctx.globalAlpha = 0.86 + 0.14*Math.sin(gameT*2.1);
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.ellipse(x, y, rx, rx*0.60, 0, 0, Math.PI*2); ctx.fill();
  ctx.restore();
}
function innenBrett(x, y, w, h, oben, unten){
  ctx.fillStyle = unten; ctx.fillRect(x - w/2, y - h, w, h);
  ctx.fillStyle = oben;  ctx.fillRect(x - w/2, y - h, w, Math.max(2, h*0.34));
  ctx.strokeStyle = INN_HOLZ_DUNKEL; ctx.lineWidth = 1;
  ctx.strokeRect(Math.round(x - w/2) + 0.5, Math.round(y - h) + 0.5, Math.round(w) - 1, Math.round(h) - 1);
}
// Eine waagerechte Platte, von schraeg oben gesehen: die Flaeche oben hell, die
// Vorderkante darunter dunkel. Das ist der Unterschied zwischen einem Moebel und
// einem Rechteck — ohne die Kante liegt alles flach auf dem Boden.
function innenPlatte(x, y, w, dick, oben, kante){
  ctx.fillStyle = kante; ctx.fillRect(x - w/2, y - dick + 5, w, dick - 3);
  ctx.fillStyle = oben;  ctx.fillRect(x - w/2, y - dick, w, 6);
  ctx.strokeStyle = INN_HOLZ_DUNKEL; ctx.lineWidth = 1;
  ctx.strokeRect(Math.round(x - w/2) + 0.5, Math.round(y - dick) + 0.5, Math.round(w) - 1, dick + 1);
}
// Zwei oder vier Beine, je nachdem wie breit das Moebel ist. Sie stehen auf der
// Fusslinie und tragen die Platte, die darueber gezeichnet wird.
function innenBeine(x, y, spann, hoch, dick){
  ctx.fillStyle = INN_HOLZ_DUNKEL;
  ctx.fillRect(x - spann/2, y - hoch, dick, hoch);
  ctx.fillRect(x + spann/2 - dick, y - hoch, dick, hoch);
}
// Was auf einem Wirtshaustisch steht. Fest je Feld (tileHash statt
// Math.random), sonst raeumte die Schankstube bei jedem Bild ab und deckte neu
// ein. Beide Zeichenwege rufen dieselbe Hand: ein Tisch aus dem Pack und ein
// gemalter Tisch werden gleich gedeckt, nur auf verschiedener Hoehe.
//
// Der Krug bleibt gemalt — das Pack hat Flaschen und Kelche, aber keinen
// Tonkrug von oben. Die Kerze kommt aus dem Pack; fehlt ihr Blatt, steht auf
// dem Tisch eben keine, denn eine gemalte Kerze waere in diesem Massstab ein
// Strich mit einem Punkt darueber.
function innenGedeck(x, y, b, oben){
  const hh = tileHash(Math.round(x), Math.round(y));
  for(let i = 0; i < 2; i++){
    if((hh >> (i*2)) % 3 === 0) continue;                        // nicht jeder Tisch ist gedeckt
    const kx = x - b/4 + i*(b/2);
    ctx.fillStyle = '#d8c98f'; ctx.fillRect(kx - 4, oben, 8, 9);  // Krug
    ctx.fillStyle = '#b9a87a'; ctx.fillRect(kx - 4, oben, 8, 3);
    ctx.fillStyle = '#8a7a52'; ctx.fillRect(kx + 4, oben + 2, 2, 4);
  }
  if((hh >> 5) % 3 && innenBlattDa('innen_kerze'))
    drawSprite('innen_kerze', 0, x, oben + 9, WELT_SC);
}
// IN1-Nachlese: was das Pack hergibt, zeichnet das Pack. Was es nicht hergibt,
// zeichnet das Haus weiter selbst — die Theke einer Schankstube, ein
// Aktenstapel und eine Spinnwebe stehen in keinem Blatt, und ein Kuechenschrank
// ist keine Theke.
//
// Die Bank stand hier bis zur zweiten Nachlese in derselben Liste. Sie war
// nicht in den Innenraumordnern, sie war in "Outdoor decoration" — eine Bank
// ist eine Bank, drinnen wie draussen. Wer hier eine Zeile schreibt, die sagt
// "das Pack hat kein X", hat in genau einem Ordner nachgesehen.
//
// Jeder Eintrag hier ist ein Griff ins Blatt; fehlt das Blatt, faellt derselbe
// Buchstabe in drawInnenMoebelGezeichnet() zurueck. Der Ersatzweg ist keine
// Ruine: bis zur Nachlese war er die einzige Fassung, und er sieht so aus wie
// die Bilder im Phasendokument.
const INN_SPRITE = {
  R: 'innen_regale', T: 'innen_tisch', Z: 'innen_stuhl',
  D: 'innen_pult',   S: 'innen_schreibtisch', E: 'innen_kommode',
  H: 'innen_kamin',  B: 'innen_bank', U: 'innen_hocker', V: 'innen_fass',
  N: 'innen_fenster', P: 'innen_standuhr', L: 'innen_scheit',
};
function drawInnenMoebel(o){
  const blatt = INN_SPRITE[o.z];
  if(!blatt || !innenBlattDa(blatt)){ drawInnenMoebelGezeichnet(o); return; }
  const b = o.breit * TS;
  ctx.save();
  switch(o.z){
    case 'R': {  // Aktenregal. Das Blatt hat schmal (14x30) und breit (30x30),
                 // beide mit farbigen Ruecken. Ein Feld nimmt das schmale, zwei
                 // Felder das breite — die Registratur bekommt damit denselben
                 // Verband, den ihr Grundriss ohnehin zeichnet.
      innenSchatten(o.x, o.y - 2, b*0.38);
      const s = SHEETS.innen_regale;
      if(o.breit >= 2) ctx.drawImage(s.img, 17, 1, 30, 30, o.x - 30, o.y - 62, 60, 60);
      else             ctx.drawImage(s.img,  1, 1, 14, 30, o.x - 14, o.y - 62, 28, 60);
      break;
    }
    case 'H': {  // Herdfeuer: der mittlere der drei Kamine, brauner Ziegel. Die
                 // Flamme kommt weiter aus fire1 — der Kamin bringt eine dunkle
                 // Feuerstelle mit, aber keine Animation, und eine Flamme bleibt
                 // im ganzen Spiel dieselbe Flamme.
                 //
                 // Das Blatt ist 48 Pixel hoch und damit drei Kacheln: unten
                 // die Feuerstelle, darueber der Mantel, oben der Rauchfang.
                 // Der Rauchfang gehoert IN die Wand, nicht davor — deshalb
                 // steht der Kamin in Zeile 2, und die Nordwand springt in
                 // Zeile 1 um zwei Felder vor. Ein Rauchfang, der mitten im
                 // Raum endet, ist ein Ofenrohr.
      innenFeuerschein(o.x, o.y + 12, 46);
      ctx.drawImage(SHEETS.innen_kamin.img, 32, 0, 32, 48, o.x - 32, o.y - 96, 64, 96);
      drawSprite('fire1', animFrame('fire1', gameT, 10), o.x, o.y - 6, 1.3);
      break;
    }
    case 'T':
      innenSchatten(o.x, o.y - 3, b*0.34);
      drawSprite(blatt, 0, o.x, o.y, WELT_SC);
      if(innen.key === 'wirtshaus') innenGedeck(o.x, o.y, b, o.y - 44);
      break;
    case 'B':    // Bank. Das Blatt ist 31 Pixel breit und deckt damit genau die
                 // zwei Felder, die der Grundriss ihr gibt. Auf einem einzelnen
                 // Feld waere sie doppelt so breit wie das Feld — dort steht
                 // sie ungestreckt, statt in den Nachbarn hineinzuragen.
      innenSchatten(o.x, o.y - 3, b*0.30);
      drawSprite(blatt, 0, o.x, o.y, o.breit >= 2 ? WELT_SC : 1);
      break;
    case 'U':    // Barhocker: klein, rot gepolstert, drei nebeneinander an der
                 // Theke. Sie tragen den freigehaltenen Platz — allein steht er
                 // da wie ein Denkmal, in der Reihe faellt erst auf, dass auf
                 // ihm niemand sitzt.
      innenSchatten(o.x, o.y - 2, 8);
      drawSprite(blatt, 0, o.x, o.y, WELT_SC);
      break;
    case 'V':    // Fass. Der Wirt heisst Fass, und das Haus macht daraus kein
                 // Wortspiel: es stellt ihm nur welche in die Ecke.
      innenSchatten(o.x, o.y - 2, 12);
      drawSprite(blatt, 0, o.x, o.y, WELT_SC);
      break;
    case 'N':    // Fenster. Es haengt in der Wand, nicht im Raum: seine
                 // Fusslinie liegt eine Kachel ueber der eigenen, sonst stuende
                 // es auf dem Boden. Was dahinter zu sehen ist, ist Abend —
                 // hineingegangen wird zum Feierabend, und dann steht draussen
                 // genau diese Stunde.
      drawSprite(blatt, 0, o.x, o.y - TS + 8, WELT_SC);
      break;
    case 'P':    // Standuhr. Sie steht in einem Haus, das "Zum Letzten Stempel"
                 // heisst, und sagt kein Wort dazu.
      innenSchatten(o.x, o.y - 2, 10);
      drawSprite(blatt, 0, o.x, o.y, WELT_SC);
      break;
    case 'L':    // Holzscheite neben dem Kamin. Drei Stueck, zwei unten und
                 // eins quer darueber: so liegt Holz, das jemand abgelegt hat.
                 // Ein Kamin, neben dem kein Holz liegt, brennt aus sich selbst.
      innenSchatten(o.x, o.y - 3, b*0.32);
      drawSprite(blatt, 0, o.x - 7, o.y,      WELT_SC);
      drawSprite(blatt, 0, o.x + 7, o.y - 1,  WELT_SC);
      drawSprite(blatt, 0, o.x,     o.y - 17, WELT_SC);
      break;
    case 'Z':    // Der freigehaltene Platz. Der Schimmer darueber bleibt: er ist
                 // das Einzige an diesem Stuhl, was ihn von den anderen abhebt,
                 // und er wird nirgends erklaert.
      innenSchatten(o.x, o.y - 2, 9);
      drawSprite(blatt, 0, o.x, o.y, WELT_SC);
      ctx.globalAlpha = 0.10 + 0.06*Math.sin(gameT*0.9);
      ctx.fillStyle = '#f4d97a';
      ctx.beginPath(); ctx.ellipse(o.x, o.y - 26, 15, 10, 0, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
      break;
    case 'S': {  // Der Schreibtisch der Amtsleitung. Das Blatt bringt die zwei
                 // Schubladen mit, die IN1 von Hand malen musste; die untere ist
                 // die zweite. Darauf die Pflanze, am aeusseren Rand, wo sie
                 // jemand hinstellt, der sie giessen will.
      innenSchatten(o.x, o.y - 3, b*0.40);
      drawSprite(blatt, 0, o.x, o.y, WELT_SC);
      // Die Pflanze steht auf der Tischplatte, nicht dahinter: ihre Fusslinie
      // liegt auf der Oberkante des Schreibtischblattes (21 Pixel mal WELT_SC),
      // ein Stueck vom Rand weg, wo jemand sie hinstellt, der sie giessen will,
      // ohne sich dazwischenzudraengen.
      if(innenBlattDa('innen_pflanze'))
        drawSprite('innen_pflanze', 0, o.x + b/2 - 19, o.y - 21*WELT_SC + 4, WELT_SC);
      break;
    }
    case 'D':
    case 'E':
      innenSchatten(o.x, o.y - 3, b*0.40);
      drawSprite(blatt, 0, o.x, o.y, WELT_SC);
      if(o.z === 'D'){   // Klingel auf dem Dienstpult
        ctx.fillStyle = '#d8c98f';
        ctx.beginPath(); ctx.arc(o.x + b/2 - 11, o.y - 45, 4, Math.PI, 0); ctx.fill();
        ctx.fillStyle = '#a8925c'; ctx.fillRect(o.x + b/2 - 16, o.y - 45, 10, 2);
      } else {           // Papier auf dem Schreibtisch, an dem gearbeitet wird
        ctx.fillStyle = '#e6dcc0'; ctx.fillRect(o.x - b/2 + 8, o.y - 48, 13, 5);
        ctx.fillStyle = '#cfc3a0'; ctx.fillRect(o.x - b/2 + 10, o.y - 46, 13, 5);
      }
      break;
  }
  ctx.restore();
}

function drawInnenMoebelGezeichnet(o){
  const b = o.breit * TS;
  ctx.save();
  switch(o.z){
    case 'F':   // Wandfackel. Dieselbe Bauart wie in der Kammer, damit eine
                // Flamme im ganzen Spiel eine Flamme bleibt.
                //
                // Der Halter, den IN1 darunter gemalt hat, ist weg: das
                // fire1-Blatt bringt seinen eigenen mit, und darunter hat es
                // durchsichtigen Rand. Der gemalte Riegel hing deshalb einen
                // halben Kachelabstand unter der Fackel in der Luft.
      drawSprite('fire1', animFrame('fire1', gameT + o.x*0.01, 10), o.x, o.y - 22, 1.2);
      break;
    case 'W': {  // Spinnwebe, oben in der Wand statt unten auf den Dielen.
                 //
                 // Zwei Dinge sind hier gemessen. Erstens der Anker: das
                 // G1-Blatt traegt ay:0, seine Bezugslinie ist also die
                 // OBERkante. IN1 hat sie wie eine Fusslinie behandelt, und die
                 // Webe hing eine ganze Kachel zu tief — auf dem Boden, wo eine
                 // Spinnwebe wie ein Fleck aussieht. Zwei Kacheln hoch gesetzt
                 // sitzt sie im Wandband, mit ihrem Gespinst genau in der Ecke
                 // zwischen Wand und Diele.
                 //
                 // Der dunkelblaue Strich, der bis heute links neben jeder
                 // Webe stand, ist kein Zeichenfehler dieser Stelle: er lag im
                 // Blatt. schnittSaeubern() nimmt ihn beim Laden heraus.
      drawSprite('dun_cobweb', 0, o.x, o.y - 2*TS, WELT_SC);
      break;
    }
    case 'G': {  // AN3, die Tafel ueber der Tuer. Stein statt Holz: ein heller
                 // Block mit dunkler Fase, darauf eine Zeile, die als Zeile
                 // lesbar ist und nicht als Wort -- bei 32 Pixeln Kachelmass
                 // waere jeder echte Buchstabe ein Fleck. Was sie sagt, sagt
                 // sie beim Ansehen.
                 //
                 // Sie haengt ueber der Tuer, also ueber ihrer eigenen
                 // Fusslinie nach oben gezeichnet wie jedes Wandstueck. Der
                 // Bleistiftzusatz darunter ist der einzige helle Strich, der
                 // nicht mittig sitzt: nachgetragen, nicht gesetzt.
      const gb = Math.min(b - 6, 52), gx = o.x - gb/2, gy = o.y - 30;
      ctx.fillStyle = '#2b2118'; ctx.fillRect(gx - 2, gy - 2, gb + 4, 24);
      ctx.fillStyle = '#8d8577'; ctx.fillRect(gx, gy, gb, 20);
      ctx.fillStyle = '#a49b8b'; ctx.fillRect(gx + 1, gy + 1, gb - 2, 9);
      ctx.fillStyle = '#3c332a';
      ctx.fillRect(gx + 5, gy + 6, gb - 10, 2);
      ctx.fillRect(gx + 5, gy + 11, gb - 14, 2);
      ctx.fillStyle = '#d9cf9a'; ctx.fillRect(gx + 7, gy + 16, 9, 1);
      break;
    }
    case 'C': {  // AN3, die Karte der Ablage. Buettenpapier mit vier
                 // Reisszwecken, ein paar Flurgrenzen und die Buchstaben als
                 // Punkte -- dieselbe Ueberlegung wie bei der Tafel: eine Karte
                 // ist auf dieser Entfernung eine Flaeche mit Linien darauf,
                 // und was daraufsteht, steht beim Ansehen da.
                 //
                 // Sie haengt im Wandband wie das Fenster, also eine Kachel
                 // ueber der eigenen Fusslinie. Der dunkle Streifen unten ist
                 // die Legende; unten rechts bleibt eine leere Ecke, und das
                 // ist die, in der bei anderen Karten das Meer steht.
      const cb = b - 6, cx = o.x - cb/2, cy = o.y - TS - 30;
      ctx.fillStyle = '#2b2118'; ctx.fillRect(cx - 2, cy - 2, cb + 4, 42);
      ctx.fillStyle = '#cfc099'; ctx.fillRect(cx, cy, cb, 38);
      ctx.strokeStyle = '#8a7a52'; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx + 3, cy + 22);  ctx.lineTo(cx + 14, cy + 12); ctx.lineTo(cx + 26, cy + 17);
      ctx.moveTo(cx + 8, cy + 6);   ctx.lineTo(cx + 20, cy + 9);  ctx.lineTo(cx + cb - 5, cy + 5);
      ctx.stroke();
      ctx.fillStyle = '#6a5f44';                       // die Buchstaben, als Punkte
      const ch = tileHash(Math.round(o.x), Math.round(o.y));
      for(let i = 0; i < 7; i++)
        ctx.fillRect(cx + 4 + ((ch >> i) % 5) + i*7, cy + 8 + ((ch >> (i+3)) % 14), 2, 2);
      ctx.fillStyle = '#8a7a52'; ctx.fillRect(cx + 2, cy + 31, cb - 12, 2);   // Legende
      ctx.fillStyle = '#c8a35a';                                             // Reisszwecken
      for(const [px, py] of [[cx + 2, cy + 2], [cx + cb - 4, cy + 2],
                             [cx + 2, cy + 34], [cx + cb - 4, cy + 34]])
        ctx.fillRect(px, py, 2, 2);
      break;
    }
    case 'N': {  // Fenster, gemalt: ein Rahmen, dahinter der Abendhimmel als
                 // Verlauf, davor ein Sprossenkreuz. Dieselben drei Farben, die
                 // im Blatt uebereinanderliegen — Violett, Rosa, Orange.
      const fx = o.x - 14, fy = o.y - TS - 26, fb = 28, fh2 = 42;
      ctx.fillStyle = '#3a2a1e'; ctx.fillRect(fx - 2, fy - 2, fb + 4, fh2 + 4);
      const g = ctx.createLinearGradient(0, fy, 0, fy + fh2);
      g.addColorStop(0, '#8f7bb0'); g.addColorStop(0.55, '#e2a2a0'); g.addColorStop(1, '#f2cf9e');
      ctx.fillStyle = g; ctx.fillRect(fx, fy, fb, fh2);
      ctx.fillStyle = '#a9784a';
      ctx.fillRect(fx + fb/2 - 2, fy, 4, fh2); ctx.fillRect(fx, fy + fh2/2 - 2, fb, 4);
      break;
    }
    case 'P': {  // Standuhr, gemalt: hoher Kasten, helles Zifferblatt, ein
                 // Pendel, das steht. Es steht, weil das Blatt seines auch
                 // stehen laesst — zwei Fassungen desselben Moebels duerfen
                 // sich nicht darin unterscheiden, ob die Zeit laeuft.
      innenSchatten(o.x, o.y - 2, 10);
      ctx.fillStyle = '#3a2a20'; ctx.fillRect(o.x - 14, o.y - 60, 28, 58);
      ctx.fillStyle = '#7a4e26'; ctx.fillRect(o.x - 11, o.y - 57, 22, 52);
      ctx.fillStyle = '#e6dcc0';
      ctx.beginPath(); ctx.arc(o.x, o.y - 44, 9, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#3a2a20'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(o.x, o.y - 44); ctx.lineTo(o.x, o.y - 50);
      ctx.moveTo(o.x, o.y - 44); ctx.lineTo(o.x + 5, o.y - 42); ctx.stroke();
      ctx.fillStyle = '#5a3a1c'; ctx.fillRect(o.x - 8, o.y - 30, 16, 24);
      ctx.fillStyle = '#c8a35a';
      ctx.fillRect(o.x - 1, o.y - 28, 2, 14);
      ctx.beginPath(); ctx.arc(o.x, o.y - 12, 4, 0, Math.PI*2); ctx.fill();
      break;
    }
    case 'R': {  // Aktenregal: drei Böden, darauf Aktenrücken in den Farben des
                 // Hauses. Die Rücken stehen fest je Feld (tileHash statt
                 // Math.random), sonst flackerte die Registratur bei jedem Bild.
      innenSchatten(o.x, o.y - 2, b*0.40);
      innenBrett(o.x, o.y - 2, b - 4, 46, INN_HOLZ_HELL, INN_HOLZ);
      const h = tileHash(Math.round(o.x), Math.round(o.y));
      const farben = ['#b9a07a', '#8f6136', '#7a6a94', '#9a8a5f', '#a8523a'];
      for(let reihe = 0; reihe < 3; reihe++){
        const ry = o.y - 44 + reihe*14;
        ctx.fillStyle = INN_HOLZ_DUNKEL; ctx.fillRect(o.x - b/2 + 2, ry + 10, b - 4, 2);
        for(let i = 0; i < Math.round(b/5) - 1; i++){
          ctx.fillStyle = farben[(h >> (reihe*3 + i)) % farben.length];
          ctx.fillRect(o.x - b/2 + 4 + i*5, ry + 2 - (i % 3), 4, 8 + (i % 3));
        }
      }
      break;
    }
    case 'K':
      innenSchatten(o.x, o.y - 2, 12);
      drawSprite('dun_crate', 0, o.x, o.y, WELT_SC);
      break;
    case 'O':
      innenSchatten(o.x, o.y - 2, 8);
      drawSprite('dun_pot', 0, o.x, o.y - 2, WELT_SC);
      break;
    case 'H': {  // Herdfeuer mit dem Topf darüber. Das Blatt gibt es seit W-Lager
                 // (camp_pot), es hing bisher nur im Lager der Beschwerden.
                 //
                 // Auch die gemalte Fassung braucht seit dem Umzug an die Wand
                 // ihren Rauchfang: die Nordwand springt hier um zwei Felder
                 // vor, und ohne Mantel und Fang stünde dort eine Wandnase ohne
                 // Grund. Trapez nach oben, wie im Blatt.
      innenFeuerschein(o.x, o.y + 12, 46);
      ctx.fillStyle = '#7c4a2c';
      ctx.beginPath();
      ctx.moveTo(o.x - b/2 + 2, o.y - 30); ctx.lineTo(o.x + b/2 - 2, o.y - 30);
      ctx.lineTo(o.x + 13, o.y - 78);      ctx.lineTo(o.x - 13, o.y - 78);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#5e3720'; ctx.fillRect(o.x - 13, o.y - 96, 26, 18);
      ctx.fillStyle = '#9a6440'; ctx.fillRect(o.x - b/2 + 1, o.y - 34, b - 2, 7);
      ctx.fillStyle = '#4a4038'; ctx.fillRect(o.x - b/2 + 3, o.y - 27, b - 6, 25);
      ctx.fillStyle = '#2b2622'; ctx.fillRect(o.x - b/2 + 7, o.y - 23, b - 14, 21);
      drawSprite('fire1', animFrame('fire1', gameT, 10), o.x, o.y - 4, 1.4);
      drawSprite('camp_pot', animFrame('camp_pot', gameT, 6), o.x, o.y - 12, WELT_SC);
      break;
    }
    case 'Q': {  // Flaschenbord hinter der Theke. Es hängt an der Wand wie die
                 // Fackel: die Fußlinie liegt eine Kachel über der eigenen.
                 //
                 // Ein Brett mit Flaschen darauf ist das Zeichen, an dem ein
                 // Bild eine Schankstube von einer Stube unterscheidet — jede
                 // gemalte Schänke, die man kennt, hat eins hinter dem Wirt.
                 // Es bleibt gezeichnet: das Pack hat Regale mit Buchrücken,
                 // und ein Bücherregal hinter einer Theke ist eine Bibliothek.
                 // Die Flaschen darauf kommen aus dem Pack, wenn es da ist.
      const qy = o.y - TS + 4;
      innenBrett(o.x, qy, b - 8, 7, INN_HOLZ, INN_HOLZ_DUNKEL);
      const qh = tileHash(Math.round(o.x), Math.round(o.y));
      for(let i = 0; i < 5; i++){
        if((qh >> i) % 5 === 0) continue;          // nicht jeder Platz ist besetzt
        const bx = Math.round(o.x - b/2 + 12 + i*((b - 24)/4));
        if(innenBlattDa('innen_flasche')){ drawSprite('innen_flasche', 0, bx, qy - 4, WELT_SC); continue; }
        ctx.fillStyle = i % 2 ? '#8a3a30' : '#4a6a3a'; ctx.fillRect(bx - 3, qy - 22, 6, 15);
        ctx.fillStyle = '#e6dcc0';                  ctx.fillRect(bx - 3, qy - 18, 6, 4);
        ctx.fillStyle = i % 2 ? '#5f271f' : '#33492a'; ctx.fillRect(bx - 1, qy - 27, 2, 5);
      }
      break;
    }
    case 'X': {  // Theke. Sie bleibt gezeichnet, und zwar nicht aus Trotz: das
                 // Pack hat keinen Tresen von oben. Kitchen.png ist eine
                 // Frontansicht (Haengeschraenke, von vorn gesehen), und ein
                 // Kuechenschrank ist ohnehin keine Schankstube.
                 // Gewicht wie die Packmoebel: geschlossener Unterbau, kraeftige
                 // Platte, dunkle Kontur. Die duenne Fassung davor las sich neben
                 // einem echten Tisch als schwebendes Brett.
      innenSchatten(o.x, o.y - 2, b*0.44);
      // Unterbau: senkrechte Bretter, alle sechzehn Pixel eine Fuge, unten eine
      // Sockelleiste. Das ist der Unterschied zwischen einer Theke und einem
      // Brett auf Beinen — sie ist vorn zu, man sieht nicht darunter durch.
      ctx.fillStyle = INN_HOLZ_SCHATTEN; ctx.fillRect(o.x - b/2 + 1, o.y - 26, b - 2, 24);
      ctx.fillStyle = INN_HOLZ_TIEF;
      for(let i = 1; i*16 < b - 2; i++) ctx.fillRect(o.x - b/2 + i*16, o.y - 24, 2, 19);
      ctx.fillStyle = INN_HOLZ_TIEF;  ctx.fillRect(o.x - b/2 + 1, o.y - 6, b - 2, 4);
      ctx.fillStyle = INN_HOLZ;       ctx.fillRect(o.x - b/2 + 1, o.y - 7, b - 2, 2);
      innenPlatte(o.x, o.y - 26, b, 11, INN_HOLZ_HELL, INN_HOLZ_SCHATTEN);
      // Glanzkante auf der Deckfläche: eine Linie, und aus dem Rechteck wird
      // eine Platte, über die tausendmal ein Ärmel gewischt hat.
      ctx.fillStyle = INN_HOLZ_GLANZ; ctx.fillRect(o.x - b/2 + 2, o.y - 36, b - 4, 2);
      ctx.strokeStyle = INN_HOLZ_DUNKEL; ctx.lineWidth = 1;
      ctx.strokeRect(Math.round(o.x - b/2) + 0.5, Math.round(o.y - 26) + 0.5, Math.round(b) - 1, 25);
      // Auf der Theke stehen zwei Flaschen aus dem Pack, am rechten Ende — am
      // linken steht der Wirt. Ihre Fusslinie liegt auf der Deckflaeche der
      // Platte (o.y-26 minus 11 Pixel Dicke, plus die 6 Pixel Deckflaeche):
      // davor stuenden sie vor der Theke, dahinter in der Wand.
      //
      // Ohne Wuerfel, anders als beim Gedeck. Es gibt genau eine Theke im
      // Spiel, und ein tileHash ueber ein einziges Feld ist kein Zufall,
      // sondern eine Muenze, die einmal geworfen und dann fuer immer
      // liegengelassen wird. Der erste Anlauf warf sie und bekam eine
      // Schankstube ohne eine einzige Flasche.
      if(innenBlattDa('innen_flasche'))
        for(let i = 0; i < 2; i++)
          drawSprite('innen_flasche', 0, o.x + b/2 - 17 - i*15, o.y - 32, WELT_SC);
      break;
    }
    case 'T': {  // Tisch: Platte auf vier Beinen, hoch genug, dass man die Beine
                 // sieht. Der erste Anlauf war ein Brett mit einem Schatten
                 // darunter, und im Bild sah ein Tisch aus wie eine Bank und
                 // eine Bank wie ein Tisch. Von oben unterscheidet die beiden
                 // nicht die Breite, sondern die Höhe — und ein gedeckter
                 // Tisch sagt es in einem Blick.
      innenSchatten(o.x, o.y - 3, b*0.34);
      innenBeine(o.x, o.y - 3, b - 10, 18, 5);
      innenPlatte(o.x, o.y - 21, b - 4, 15, '#c08c47', '#7d5326');
      if(innen.key === 'wirtshaus') innenGedeck(o.x, o.y, b, o.y - 30);
      break;
    }
    case 'B':    // Bank: halb so hoch, schmaler, dunkler. Zwei Beine statt vier.
                 // Von oben unterscheidet eine Bank und einen Tisch nicht die
                 // Breite, sondern die Hoehe.
      innenSchatten(o.x, o.y - 3, b*0.30);
      innenBeine(o.x, o.y - 3, b - 16, 10, 5);
      innenPlatte(o.x, o.y - 13, b - 10, 9, '#9a7343', INN_HOLZ_DUNKEL);
      break;
    case 'U':    // Barhocker: rundes Polster auf einem Bein. Rot, weil das
                 // Polster im Blatt rot ist — der Ersatzweg zeigt dasselbe
                 // Wirtshaus wie das Pack, nur mit weniger Pixeln.
      innenSchatten(o.x, o.y - 2, 7);
      ctx.fillStyle = INN_HOLZ_DUNKEL; ctx.fillRect(o.x - 2, o.y - 14, 4, 12);
      ctx.fillStyle = '#8a3a30';
      ctx.beginPath(); ctx.ellipse(o.x, o.y - 15, 9, 5, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#b4544a';
      ctx.beginPath(); ctx.ellipse(o.x, o.y - 17, 8, 4, 0, 0, Math.PI*2); ctx.fill();
      break;
    case 'L': {  // Holzscheite, gemalt: drei Rollen mit heller Schnittflaeche.
      innenSchatten(o.x, o.y - 3, b*0.32);
      const legen = (lx, ly) => {
        ctx.fillStyle = INN_HOLZ_TIEF;     ctx.fillRect(lx - 22, ly - 20, 44, 18);
        ctx.fillStyle = INN_HOLZ;          ctx.fillRect(lx - 22, ly - 20, 44, 8);
        ctx.fillStyle = '#e6c79a';         ctx.fillRect(lx + 14, ly - 18, 8, 14);
        ctx.strokeStyle = INN_HOLZ_DUNKEL; ctx.lineWidth = 1;
        ctx.strokeRect(Math.round(lx - 22) + 0.5, Math.round(ly - 20) + 0.5, 43, 17);
      };
      legen(o.x - 7, o.y); legen(o.x + 7, o.y - 1); legen(o.x, o.y - 17);
      break;
    }
    case 'V':    // Fass: Daubenkoerper mit zwei Reifen, Deckel obendrauf.
                 // Bauchig heisst hier, dass die Mitte einen Strich breiter ist
                 // als Boden und Deckel; mehr braucht ein Fass nicht.
      innenSchatten(o.x, o.y - 2, 12);
      ctx.fillStyle = '#7a4e26'; ctx.fillRect(o.x - 12, o.y - 30, 24, 28);
      ctx.fillStyle = '#8f6136'; ctx.fillRect(o.x - 13, o.y - 24, 26, 16);
      ctx.fillStyle = '#5a3a1c';
      ctx.fillRect(o.x - 13, o.y - 26, 26, 3); ctx.fillRect(o.x - 13, o.y - 11, 26, 3);
      ctx.fillStyle = '#a9784a';
      ctx.beginPath(); ctx.ellipse(o.x, o.y - 30, 12, 5, 0, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = INN_HOLZ_DUNKEL; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(o.x, o.y - 30, 12, 5, 0, 0, Math.PI*2); ctx.stroke();
      break;
    case 'Z': {  // Der freigehaltene Platz. Ein Stuhl mit Lehne, ein Handbreit
                 // vom Tisch abgerückt, und darüber ein Schimmer, der kommt und
                 // geht. Er wird nirgends erklärt und nirgends benannt; wer ihn
                 // anspricht, bekommt Fass' vierte Grundzeile und sonst nichts.
      innenSchatten(o.x, o.y - 2, 10);
      ctx.fillStyle = INN_HOLZ_DUNKEL;
      ctx.fillRect(o.x - 8, o.y - 11, 3, 9); ctx.fillRect(o.x + 5, o.y - 11, 3, 9);
      innenBrett(o.x, o.y - 11, 20, 6, INN_HOLZ_HELL, INN_HOLZ);
      innenBrett(o.x, o.y - 17, 20, 14, INN_HOLZ, INN_HOLZ_DUNKEL);
      ctx.globalAlpha = 0.10 + 0.06*Math.sin(gameT*0.9);
      ctx.fillStyle = '#f4d97a';
      ctx.beginPath(); ctx.ellipse(o.x, o.y - 16, 15, 9, 0, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
      break;
    }
    case 'D':    // Dienstpult: Theke mit Klingel. Hier nimmt man Feierabend.
      innenSchatten(o.x, o.y - 2, b*0.41);
      ctx.fillStyle = '#4d3018'; ctx.fillRect(o.x - b/2 + 1, o.y - 22, b - 2, 20);
      innenPlatte(o.x, o.y - 22, b, 9, '#b09053', '#7d6234');
      ctx.fillStyle = '#d8c98f';
      ctx.beginPath(); ctx.arc(o.x + b/2 - 9, o.y - 29, 4, Math.PI, 0); ctx.fill();
      break;
    case 'E':    // Ein Schreibtisch, an dem gearbeitet wird: Papier drauf.
      innenSchatten(o.x, o.y - 2, b*0.40);
      innenBrett(o.x, o.y - 2, b - 2, 20, '#8f6136', INN_HOLZ);
      ctx.fillStyle = '#e6dcc0'; ctx.fillRect(o.x - b/2 + 6, o.y - 26, 13, 5);
      ctx.fillStyle = '#cfc3a0'; ctx.fillRect(o.x - b/2 + 8, o.y - 24, 13, 5);
      break;
    case 'S': {  // Der Schreibtisch der Amtsleitung. Unberührt seit vierzig
                 // Jahren, mit der Pflanze darauf, die lebt (Weltbibel: "Auf dem
                 // Schreibtisch steht eine Pflanze. Sie lebt."). Zwei Schubladen
                 // übereinander, und die untere ist die zweite. Sie steht einen
                 // Strich vor statt offen: sie klemmt.
      innenSchatten(o.x, o.y - 2, b*0.41);
      innenBrett(o.x, o.y - 2, b - 2, 26, '#a07a4a', '#6b4526');
      const sw = Math.round(b*0.42), sx0 = o.x - b/2 + 7;
      for(let i = 0; i < 2; i++){
        const sy = o.y - 21 + i*9;
        ctx.fillStyle = '#59391f'; ctx.fillRect(sx0 - (i ? 1 : 0), sy, sw + (i ? 2 : 0), 7);
        ctx.strokeStyle = INN_HOLZ_DUNKEL; ctx.lineWidth = 1;
        ctx.strokeRect(sx0 - (i ? 1 : 0) + 0.5, sy + 0.5, sw + (i ? 2 : 0) - 1, 6);
        ctx.fillStyle = '#d8c98f';                          // Griff
        ctx.fillRect(sx0 + sw/2 - 4, sy + 2, 8, 2);
      }
      // Die Pflanze, am äußersten Rand des Tisches: dort stellt sie jemand hin,
      // der sie gießen will, ohne sich dazwischenzudrängen. Sie atmet, weil sie
      // lebt, und das ist der einzige Satz, den dieser Raum über sie sagt.
      const px = o.x + b/2 - 13, py = o.y - 27;
      innenSchatten(px, o.y - 3, 7);
      ctx.fillStyle = '#8a5a3c'; ctx.fillRect(px - 7, py - 1, 14, 11);
      ctx.fillStyle = '#a9704b'; ctx.fillRect(px - 8, py - 3, 16, 4);
      ctx.strokeStyle = '#3f7a3c'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(px, py - 2); ctx.lineTo(px, py - 12); ctx.stroke();
      for(let i = 0; i < 5; i++){
        const a = -Math.PI/2 + (i-2)*0.62 + Math.sin(gameT*0.6 + i*1.3)*0.07;
        const bx = px + Math.cos(a)*9, by = py - 13 + Math.sin(a)*8;
        ctx.fillStyle = i % 2 ? '#4f9a4a' : '#63b355';
        ctx.beginPath(); ctx.ellipse(bx, by, 7, 3.4, a, 0, Math.PI*2); ctx.fill();
      }
      break;
    }
    case 'Y': {  // Aktenstapel, und darauf schläft Anlage 3. Sie schläft laut
                 // Bramsche "auf der richtigen Akte", und Bramsche weckt sie
                 // nicht. Hier wird sie auch nicht geweckt.
      innenSchatten(o.x, o.y - 2, 11);
      for(let i = 0; i < 5; i++){
        ctx.fillStyle = i % 2 ? '#e6dcc0' : '#cfc3a0';
        ctx.fillRect(o.x - 11 + (i % 2), o.y - 6 - i*4, 22, 4);
      }
      if(!npcs.some(n => n.key === 'bramsche')) drawAnlage3(o.x, o.y - 29);
      break;
    }
  }
  ctx.restore();
}

// Der Ausgang, flach auf dem Boden: eine Schwelle mit Licht von draußen. Sie
// geht nicht in die y-Sortierung, sie liegt darunter (dieselbe Regel wie bei
// drawStopfen()).
function drawInnenSchwelle(){
  const o = innen.tuer; if(!o || !vis(o.x, o.y)) return;
  const b = o.breit * TS, x0 = o.x - b/2, y0 = o.y - TS;
  ctx.save();
  // Der Durchgang selbst: Tageslicht von draußen, das auf der Schwelle liegt
  // und ein Stück in den Raum reicht. Es atmet leicht, damit die Tür nicht wie
  // ein Loch im Boden aussieht.
  const g = ctx.createLinearGradient(0, y0 + TS, 0, y0 - TS*1.2);
  g.addColorStop(0, 'rgba(250,232,182,0.42)');
  g.addColorStop(1, 'rgba(250,232,182,0)');
  ctx.globalAlpha = 0.85 + 0.15*Math.sin(gameT*1.3);
  ctx.fillStyle = g;
  ctx.fillRect(x0, y0 - TS*1.2, b, TS*2.2);
  ctx.globalAlpha = 1;
  // Pfosten und Schwellbrett. Zwei Striche, und aus dem Loch wird eine Tür.
  ctx.fillStyle = INN_HOLZ_DUNKEL;
  ctx.fillRect(x0 - 3, y0 - 4, 4, TS + 4);
  ctx.fillRect(x0 + b - 1, y0 - 4, 4, TS + 4);
  ctx.fillStyle = '#8a5a3c'; ctx.fillRect(x0 - 3, y0 + TS - 5, b + 6, 5);
  ctx.fillStyle = '#a9704b'; ctx.fillRect(x0 - 3, y0 + TS - 5, b + 6, 2);
  ctx.restore();
}

// ===========================================================================
//  IN1-Guard. Läuft auf Skriptebene wie dorfMassstabAssert(): alles, was er
//  misst, steht in den Tabellen und braucht kein einziges Bild.
//  Wirft nie, meldet nur.
// ===========================================================================
function innenAssert(){
  let ok = true;
  const warnen = (m, ...r) => { ok = false; console.warn('IN1 Innenraum:', m, ...r); };
  for(const h of INN_HAEUSER){
    const r = h.raum;
    if(!r){ warnen(`${h.b.bld} nennt einen Raum, den es nicht gibt: ${h.b.innen}`); continue; }
    // (1) Rechteckig? Ein Grundriss mit einer kurzen Zeile hat ein Loch in der
    //     Wand, und durch das Loch läuft man in eine Karte voller G_WALL.
    for(let ry = 0; ry < r.h; ry++)
      if(r.plan[ry].length !== r.w)
        warnen(`${r.key}: Zeile ${ry} ist ${r.plan[ry].length} Zeichen lang, der Raum ${r.w}`);
    // (2) Rundherum zu? Bis auf den Ausgang.
    for(let rx = 0; rx < r.w; rx++){
      if(r.zeichen(rx, 0) !== '#') warnen(`${r.key}: Nordwand hat bei ${rx} ein ${r.zeichen(rx,0)}`);
      const s = r.zeichen(rx, r.h-1);
      if(s !== '#' && s !== 'A') warnen(`${r.key}: Südwand hat bei ${rx} ein ${s}`);
    }
    for(let ry = 0; ry < r.h; ry++)
      if(r.zeichen(0, ry) !== '#' || r.zeichen(r.w-1, ry) !== '#')
        warnen(`${r.key}: Seitenwand offen in Zeile ${ry}`);
    // (3) Genau ein Ausgang, und er liegt in der Südwand.
    let tuerN = 0, tuerX = [];
    for(let ry = 0; ry < r.h; ry++) for(let rx = 0; rx < r.w; rx++)
      if(r.zeichen(rx, ry) === 'A'){
        tuerN++; tuerX.push(rx);
        if(ry !== r.h-1) warnen(`${r.key}: Ausgang liegt in Zeile ${ry} statt in der Südwand`);
      }
    if(!tuerN) warnen(`${r.key}: kein Ausgang, das ist eine Zelle`);
    if(tuerN && Math.max(...tuerX) - Math.min(...tuerX) !== tuerN - 1)
      warnen(`${r.key}: der Ausgang ist auf ${tuerN} Felder verteilt, die nicht nebeneinanderliegen`);
    // (4) Kennt der Grundriss nur Zeichen, für die es ein Möbel gibt?
    for(let ry = 0; ry < r.h; ry++) for(let rx = 0; rx < r.w; rx++){
      const z = r.zeichen(rx, ry);
      if(!INN_MOEBEL[z.toUpperCase()]) warnen(`${r.key}: unbekanntes Zeichen '${z}' bei ${rx},${ry}`);
      // Eine Fortsetzung ohne Anfang ist ein Möbel, das im Nichts beginnt.
      if(z !== z.toUpperCase() && r.zeichen(rx-1, ry).toUpperCase() !== z.toUpperCase())
        warnen(`${r.key}: '${z}' bei ${rx},${ry} setzt nichts fort`);
    }
    // (5) Steht jeder Hausbewohner auf begehbarem Boden, und gibt es ihn?
    for(const p of r.leute){
      const z = r.zeichen(p.tx, p.ty);
      const m = INN_MOEBEL[z.toUpperCase()] || {};
      if(!m.frei && z !== '.') warnen(`${r.key}: ${p.key} steht auf '${z}' bei ${p.tx},${p.ty}`);
      if(!DORF_FIGUREN.some(f => f.key === p.key)) warnen(`${r.key}: ${p.key} steht in keiner Figurentabelle`);
    }
    // (6) Sitzt die Schwelle unter der gemalten Tür? Gemessen wird der Abstand
    //     zwischen dem Türpunkt und der Mitte des Fußabdrucks — er MUSS von
    //     null verschieden sein, sonst steht wieder die geratene Mitte da.
    if(CF_BLD[h.b.bld].tuerDx === undefined)
      warnen(`${h.b.bld} ist betretbar, aber sein Blatt hat kein gemessenes tuerDx`);
    // (7) Liegt die Schwelle innerhalb des Fußabdrucks? Eine Tür neben dem Haus
    //     wäre eine Tür in die Wiese.
    const tx = Math.floor(h.tuer.x / TS);
    if(tx < h.b.x0 || tx >= h.b.x0 + h.b.w)
      warnen(`${h.b.bld}: die Tür liegt bei Kachel ${tx}, das Haus bei ${h.b.x0}..${h.b.x0+h.b.w-1}`);
  }
  // (8) Passt der größte Grundriss noch auf die Karte?
  for(const k in INN_RAEUME){
    const r = INN_RAEUME[k];
    if(INN_X0 + r.w >= MW || INN_Y0 + r.h >= MH) warnen(`${k} passt nicht auf die Karte`);
  }
  // (9) Trägt jede Figur mit innenHaus auch wirklich einen Raum, den es gibt?
  for(const f of DORF_FIGUREN)
    if(f.innenHaus && !INN_RAEUME[f.innenHaus]) warnen(`${f.key} wohnt in einem Haus, das es nicht gibt`);
  if(ok) console.log('IN1 Innenraum: in Ordnung (' + INN_HAEUSER.length + ' Türen).');
}
innenAssert();

// --- Belohnung: hängt ausschließlich am Tier des Schildes --------------------
// M4-Befund: der dritte Parameter fehlte, und deshalb zahlte die Sperrablage in
// Substantiven von Gegnern, die in ihr gar nicht stehen. `KAM_WAECHTER` ist das
// Roster der Unteren Registratur; seit M3 teilen sich die beiden Roster die
// Staffel, statt sich zu ueberlagern (Bescheid 1-4 Registratur, 5 Sperrablage).
// Die Truhe hat diese Teilung nie mitbekommen: bei Bescheid 5 fielen Fledermaus-
// fluegel und Golem-Splitter aus einer Kammer, in der weder Fledermaus noch
// Golem vorkommt, und die drei Substantive der Sperrablage konnten aus ihrer
// eigenen Truhe ueberhaupt nicht fallen. `kamWaechter(diff)` ist genau die
// Funktion, die M3 dafuer schon angelegt hat — sie stand nur nicht hier.
function rollKammerZutat(tier, biome, diff){
  const pool = BIOME_MOBS[biome].concat(kamWaechter(diff));   // Band plus das Roster DIESER Kammer
  if(tier >= 4) pool.push('bossgeneric');
  for(let i = 0; i < 40; i++){
    // Substantiv aus dem örtlichen Pool, Adjektiv aus der Unteren Registratur:
    // die Kammer trägt ihre eigene Wirkungs-Signatur, egal in welchem Band ihre
    // Tür steht (Monsterkatalog M1, s. zutatBiome).
    const z = {noun: pool[Math.floor(Math.random()*pool.length)], adj: pickAdj('hoehle', Math.min(3, tier))};
    if(zutatRar(z) >= tier) return z;
  }
  // Notnagel, damit das Preisschild nie mehr verspricht als die Truhe hergibt:
  // seltenstes Substantiv des Pools plus seltenstes zulässiges Adjektiv. Der Pool
  // ist so gewählt, dass diese Kombination jedes Tier sicher erreicht.
  let noun = pool[0];
  for(const n of pool) if(ZUTAT_NOUNS[n].rar > ZUTAT_NOUNS[noun].rar) noun = n;
  let adj = null;
  for(const a of ZUTAT_ADJ) if(a.minMon <= Math.min(3, tier) && (!adj || a.rar > adj.rar)) adj = a;
  return {noun, adj: adj.a};
}

function truheOeffnen(){
  const k = kammer; if(!k || k.truhe.auf) return;
  k.truhe.auf = true; k.geleert = true;
  // M4: was einmal je KAMMER gilt, darf nicht einmal je EBENE laufen. Eine
  // Kammer mit zwei Truhen ist trotzdem eine Kammer: der Auftrag zaehlt sie
  // einmal, die Tuer wachst einmal nach, und Knoeterichs erste Truhe ist die
  // erste Truhe. Wer diese drei Zeilen mitnimmt, macht aus jedem Abstieg einen
  // zweiten Kammerabschluss — das faellt in keinem Bild auf und in jeder
  // Auftragszaehlung.
  if(k.ebene === 0){
    auftragEreignis('kammer', k);   // W4
    k.tuer.cd = Math.max(40, CONFIG.kammerNachwachsen - amt.bonusNachwachsen);
  }
  // M4: die untere Ebene zahlt kein Gold, und das ist eine Entscheidung ueber
  // die Schichtuhr, keine Sparsamkeit. Die Kammern sind laut KAMMER-MESSUNG-
  // 2026-08-20 ohnehin der schnelle Geldkanal (rund 1190 Gold je Schicht gegen
  // 170 aus der Oberwelt); eine zweite Truhe mit Goldwurf haette den Vollausbau
  // von drei Schichten auf zwei gedrueckt, ohne dass jemand das beschlossen
  // haette. Unten liegt Material. "Was niemand mehr anfassen sollte, zahlt es
  // in Ruestung und Waffe" — die Signatur der Sperrablage sagt Ruestung und
  // Waffe und kein Wort von Gold.
  const gold = k.ebene > 0 ? 0 : rri(40, 80) * (1 + k.diff);
  if(gold){
    player.gold += Math.round(gold * (1 + FX.gold*0.25) * (CFX.steuer ? 0.6 : 1));   // Fluch 'Fundsteuer'
    if(gold >= 60) anlage2Notiz('goldfund');
  }
  if(k.ebene === 0 && !kn.pending.kammer1 && !kn.seen.kammer1){ kn.pending.kammer1 = true; saveKn(); }
  sfx.gold(); addShake(10, 0.5);
  if(gold) floaters.push({x: k.truhe.x, y: k.truhe.y - 40, txt: '+ ' + gold + ' Gold', col:'#f4d97a', t: 2.2, big: true});
  // Zwei Zutaten mehr und eine Stufe seltener: der ganze Lohn der unteren Ebene
  // steckt hier und nirgends sonst.
  const n = 2 + k.diff + (k.ebene > 0 ? 2 : 0);
  const tier = k.ebene > 0 ? Math.min(4, k.tier + 1) : k.tier;
  for(let i = 0; i < n; i++){
    const z = rollKammerZutat(tier, k.biome, k.diff);
    addZutat(z.noun, z.adj, 1);
    floaters.push({x: k.truhe.x + rr(-30,30), y: k.truhe.y - 56 - i*16, txt: '+ ' + zutatName(z),
                   col: RARITY[zutatRar(z)].col, t: 2.6});
  }
  // Aktenfund (Phase W2): höchstens einer pro Truhe, unabhängig von den Zutaten.
  const kandidaten = BLAETTER_KEYS.filter(id => {
    if(kladde.blaetter[id]) return false;
    const b = BLAETTER[id];
    if(!serieFrei(b.serie)) return false;   // W5: Aktgatter
    if(b.serie === 'A') return k.diff >= b.minDiff;
    if(b.serie === 'B' || b.serie === 'C' || b.serie === 'D') return k.biome === b.biome;
    return false;
  });
  if(kandidaten.length && Math.random() < 0.18 + k.diff * 0.04){
    const id = kandidaten[Math.floor(Math.random() * kandidaten.length)];
    findeBlatt(id);
    floaters.push({x: k.truhe.x, y: k.truhe.y - 56 - n*16, txt: '+ Aktenfund',
                   col:'#c9b98a', t: 2.8, big: true});
  }
  // W5: garantierter Adresszeilen-Fund, unabhängig vom Aktenfund-Wurf. k.tuer.adr
  // wird von setzeKammerTueren() gesetzt, wenn diese Tür eine Adresskammer ist.
  if(k.tuer.adr && findeAdresszeile(k.tuer.adr)){
    floaters.push({x: k.truhe.x, y: k.truhe.y - 56 - (n+1)*16, txt: '+ Adresszeile',
                   col:'#f4d97a', t: 3.2, big: true});
  }
  if(invOpen) renderInventory();
  if(kesselOpen) renderKesselPane();
  updateHUD();
}

// SZ3: der Guard zum Stopfen. Er prueft, was ohne Spielzug wahr sein muss; was
// sich erst im Spielen zeigt (Brummen, Reihenfolge, Szene, Postregen, Vorblatts
// Ankunft), prueft `tools/stopfen-pruef.mjs` im echten Browser.
function stopfenAssert(){
  let ok = true;
  const fehler = (m, ...r) => { ok = false; console.error('SZ3 Stopfen:', m, ...r); };

  // 1) Der Ort. Ohne ihn ist der Strang unerfuellbar statt optional, und das
  // waere ein Unterschied, den nur ein Guard bemerkt.
  if(!STOPFEN.da){
    console.log('SZ3 Stopfen: diese Karte hat keine freie Stelle im Steinfeld, die Roehre fehlt.');
  } else {
    if(STOPFEN.ty > RUIN_Y1) fehler('die Stelle liegt nicht im Steinfeld', STOPFEN.tx, STOPFEN.ty);
    if(!reachbar(STOPFEN.tx, STOPFEN.ty)) fehler('die Stelle ist nicht erreichbar', STOPFEN.tx, STOPFEN.ty);
    if(T(STOPFEN.tx, STOPFEN.ty) === G_PATH) fehler('die Stelle liegt auf dem Weg', STOPFEN.tx, STOPFEN.ty);
    for(let dy = -1; dy <= 1; dy++) for(let dx = -1; dx <= 1; dx++)
      if(!reachbar(STOPFEN.tx+dx, STOPFEN.ty+dy)) fehler('die Stelle klemmt, Nachbarkachel gesperrt', dx, dy);
  }

  // 2) Serie I haengt am Ereignis und nicht am Ort. Beides zu tragen waere eine
  // Zusicherung, die kein Fundweg einloest — blaetterAssert() prueft die
  // Tabellenseite, hier steht die Fundwegseite.
  const serieI = BLAETTER_KEYS.filter(id => BLAETTER[id].serie === 'I');
  if(serieI.length !== 6) fehler('Serie I hat nicht sechs Blaetter', serieI.length);
  if(!stopfenGezogen() && blattFaelltAusRohr())
    fehler('Serie I faellt, obwohl der Stopfen nicht gezogen ist');

  // 3) Die beiden Wege zu Vorblatt. Der Stopfen muss der schnellere sein
  // koennen, sonst kostet er nichts und die Weltgeschichte haette unrecht.
  const fig = DORF_FIGUREN.find(f => f.key === 'vorblatt');
  if(!fig) fehler('Vorblatt steht nicht in DORF_FIGUREN');
  else {
    if(fig.abAkt !== 4) fehler('Vorblatt steht nicht auf Akt IV', fig.abAkt);
    if(typeof fig.daWenn !== 'function') fehler('Vorblatt haengt an keiner Ankunft');
    if(fig.akt && fig.akt[2]) fehler('Vorblatt hat eine Aktzeile fuer einen Akt, in dem er nicht dasteht');
  }
  if(SZENE6_ABSTAND < 1) fehler('die Entklammerung kaeme ohne Abstand', SZENE6_ABSTAND);

  // 4) Der Strang selbst: vier Stufen, an Zapf gehaengt, und er hoert auf den
  // Ortsschritt. Ein Strang, der nur auf 'ansprechen' hoerte, waere ein
  // Gespraech und kein Ort.
  const d = LANGVORGAENGE.stopfen;
  if(!d) fehler('der Strang fehlt in LANGVORGAENGE');
  else {
    if(d.figur !== 'zapf') fehler('der Strang haengt an der falschen Figur', d.figur);
    if(d.stufen !== 4) fehler('der Strang hat nicht vier Stufen', d.stufen);
    if(d.hoert.indexOf('stopfenort') < 0) fehler('der Strang hoert nicht auf den Ortsschritt');
  }

  if(ok) console.log(`SZ3 Stopfen: die Stelle liegt bei (${STOPFEN.tx}, ${STOPFEN.ty}) im Steinfeld, `
    + `Serie I mit ${serieI.length} Blättern hängt am Ereignis, Vorblatt an seiner Ankunft.`);
  return ok;
}

// M4: der Guard zur zweiten Ebene. Er prueft, was ohne Spielzug wahr sein muss;
// was sich erst im Betreten zeigt (Angebot, Abstieg, Rueckweg, doppelte
// Auftragszaehlung), prueft `tools/ebene-pruef.mjs` im echten Browser.
//
// Die vierte Zeile ist die eigentliche: Die Signatur der Sperrablage steht seit
// M1 als Satz im Katalog ("zahlt es in Ruestung und Waffe") und war bis heute
// nirgends nachpruefbar. Jetzt ist sie eine Zusicherung an der Tabelle. Wer ein
// viertes Substantiv in die Sperrablage haengt und ihm Stiefel gibt, hoert es
// beim naechsten Start.
function stollenAssert(){
  let ok = true;
  const fehler = (m, ...r) => { ok = false; console.error('M4 Sperrablage:', m, ...r); };
  const satzVon = diff => diff <= 2 ? 0 : (diff <= 4 ? 1 : 2);

  // 1) Genau die Kammer mit zwei Ebenen ist die, die es kanonisch sein darf.
  // Gegen die Schwierigkeitszuordnung geprueft, nicht gegen sich selbst: die
  // Zuordnung steht in betreteKammer(), die Ebenenzahl hier, und die beiden
  // duerfen nicht auseinanderlaufen.
  for(let diff = 1; diff <= 5; diff++){
    const tief = KAM_EBENEN[satzVon(diff)] > 1;
    if(tief !== (diff === 5)) fehler(`Gebuehrenbescheid ${diff} fuehrt ${tief ? '' : 'nicht '}in eine zweite Ebene`);
  }
  if(KAM_EBENEN.length !== 3) fehler('KAM_EBENEN kennt nicht genau die drei Kammersaetze', KAM_EBENEN.length);

  // 2) Die beiden Roster teilen sich die Staffel, statt sich zu ueberlagern (M3).
  for(const t of KAM_STOLLEN) if(KAM_WAECHTER.indexOf(t) >= 0)
    fehler(`${t} steht in beiden Rostern — dann stuenden bei Bescheid 5 acht Typen in einem Biom`);

  // 3) Jedes Roster ist ueberhaupt eines.
  if(!KAM_STOLLEN.length) fehler('die Sperrablage hat kein Roster');
  for(const t of KAM_STOLLEN) if(!ZUTAT_NOUNS[t]) fehler(`${t} hat kein Substantiv`);

  // 4) Die Signatur, im Code statt im Klappentext: Ruestung und Waffe, beides,
  // und nichts anderes.
  const slots = {};
  for(const t of KAM_STOLLEN) if(ZUTAT_NOUNS[t]){
    const s = ZUTAT_NOUNS[t].slot; slots[s] = (slots[s]||0) + 1;
    if(s !== 'armor' && s !== 'weapon')
      fehler(`${t} zahlt in ${SLOT_DE[s]} — die Signatur der Sperrablage nennt Ruestung und Waffe`);
  }
  if(!slots.armor) fehler('kein Substantiv der Sperrablage zahlt in Ruestung');
  if(!slots.weapon) fehler('kein Substantiv der Sperrablage zahlt in Waffe');

  // 5) Die Truhe zahlt aus dem Roster DIESER Kammer. Gezogen statt gelesen,
  // weil der Fund von M4 genau darin bestand, dass die Ziehung ein anderes
  // Roster benutzte als der Kammerbau.
  const biome = Object.keys(BIOME_MOBS)[0];
  let ausStollen = 0;
  for(let i = 0; i < 400; i++){
    const z = rollKammerZutat(2, biome, 5);
    if(KAM_STOLLEN.indexOf(z.noun) >= 0) ausStollen++;
    else if(KAM_WAECHTER.indexOf(z.noun) >= 0)
      fehler(`die Truhe der Sperrablage zahlt in ${ZUTAT_NOUNS[z.noun].n} — der Gegner steht in dieser Kammer nicht`);
  }
  if(!ausStollen) fehler('in 400 Ziehungen kein einziges Substantiv der Sperrablage aus ihrer eigenen Truhe');
  for(let i = 0; i < 200; i++){
    const z = rollKammerZutat(2, biome, 4);
    if(KAM_STOLLEN.indexOf(z.noun) >= 0)
      fehler(`die Untere Registratur zahlt in ${ZUTAT_NOUNS[z.noun].n} — der Gegner steht dort nicht`);
  }

  // 6) Die untere Ebene ergibt einen Raetselraum. Ohne Modul stuende dort ein
  // Tor ohne Aufgabe, und der Korridor waere nicht zu Ende zu gehen.
  const unten = waehleModuleBudget(KAM_EBENE2_BUDGET, 1);
  if(unten.length !== 1) fehler('die untere Ebene bekommt keinen Raetselraum', unten.length);

  if(ok) console.log(`M4 Sperrablage: eine zweite Ebene an Satz ${KAM_EBENEN.indexOf(2)}, `
    + `${KAM_STOLLEN.length} eigene Waechter, Signatur Rüstung und Waffe, Truhe zahlt aus dem eigenen Roster.`);
  return ok;
}

// ===========================================================================
//  DIE ACHT RÄTSELMODULE
//  Jedes baut nur in seinen Raum, meldet über mod.fertig und rührt nichts an,
//  was außerhalb liegt. Kein Physikrätsel: alles ist Rasterlogik.
// ===========================================================================

// 1) Druckplatten in der richtigen Reihenfolge -------------------------------
function bauPlatten(mod, r){
  const syms = KAM_SYM.slice().sort(()=> Math.random()-0.5).slice(0,4);
  const orte = [[3,3],[9,3],[3,11],[9,11]];
  mod.platten = [];
  for(let i = 0; i < 4; i++)
    mod.platten.push({kt:'platte', tx: r.x0+orte[i][0], ty: r.y0+orte[i][1],
                      x: tileMid(r.x0+orte[i][0]), y: tileMid(r.y0+orte[i][1]), sym: syms[i], symIdx: i%3, an: false});
  mod.folge = [0,1,2,3].sort(()=> Math.random()-0.5);
  mod.schritt = 0; mod.steht = -1;
  for(const p of mod.platten) kammer.props.push(p);
  mod.tafel = tafel(r, mod, 'Reihenfolge', mod.folge.map(i => mod.platten[i].sym).join(' '));
  mod.hinweis = 'Vier Platten. Die Tafel kennt die Reihenfolge.';
}
function aufPlatten(mod){
  const tx = spielerTx(), ty = spielerTy();
  let auf = -1;
  for(let i = 0; i < 4; i++) if(mod.platten[i].tx === tx && mod.platten[i].ty === ty){ auf = i; break; }
  if(auf === mod.steht) return;
  mod.steht = auf;
  if(auf < 0) return;
  if(auf === mod.folge[mod.schritt]){
    mod.platten[auf].an = true; mod.schritt++;
    sfx.gold();
    if(mod.schritt >= 4) mod.fertig = true;
  } else {
    for(const p of mod.platten) p.an = false;
    mod.schritt = 0; sfx.hurt();
    floaters.push({x: player.x, y: player.y - 30, txt: 'Klemmt.', col:'#9a8a5f', t: 1.0});
  }
}

// 2) Schiebeblöcke auf Zielfelder (reine Rasterlogik, keine Physik) ----------
function bauBloecke(mod, r){
  mod.bloecke = []; mod.ziele = []; mod.cd = 0;
  const reihen = [r.y0+4, r.y0+10];
  for(let i = 0; i < 2; i++){
    const bx = r.x0 + 3, by = reihen[i], weit = rri(2,4);
    const b = {kt:'block', tx: bx, ty: by, sx: bx, sy: by, x: tileMid(bx), y: tileMid(by)};
    mod.bloecke.push(b); kammer.props.push(b);
    setT(bx, by, G_BLOCK);
    mod.ziele.push({tx: bx + weit, ty: by, x: tileMid(bx+weit), y: tileMid(by)});   // liegt flach im Bodenlayer
  }
  mod.rune = {kt:'reset', x: tileMid(r.x0+1), y: tileMid(r.y0+1)};
  kammer.props.push(mod.rune);
  mod.hinweis = 'Blöcke auf die Markierungen schieben. Rune links oben setzt zurück.';
}
function bloeckeZurueck(mod){
  for(const b of mod.bloecke){
    if(T(b.tx, b.ty) === G_BLOCK){ setT(b.tx, b.ty, G_PATH); invalidateMoore(b.tx, b.ty); }
  }
  for(const b of mod.bloecke){
    b.tx = b.sx; b.ty = b.sy; b.x = tileMid(b.tx); b.y = tileMid(b.ty);
    setT(b.tx, b.ty, G_BLOCK); invalidateMoore(b.tx, b.ty);
  }
  // Wer beim Zurücksetzen genau auf einem Startfeld steht, säße sonst im Block fest
  if(!circleWalkable(player.x, player.y, player.r)){ player.x = mod.rune.x; player.y = mod.rune.y; }
  sfx.warp();
}
function aufBloecke(mod, dt){
  if(mod.cd > 0) mod.cd -= dt;
  // Schieben: die dominante Laufrichtung entscheidet, damit diagonal nichts rutscht
  if(mod.cd <= 0 && player.moving){
    let dx = 0, dy = 0;
    if(Math.abs(player.mvx) > Math.abs(player.mvy)) dx = player.mvx > 0 ? 1 : -1;
    else if(player.mvy !== 0) dy = player.mvy > 0 ? 1 : -1;
    if(dx || dy){
      const tx = spielerTx() + dx, ty = spielerTy() + dy;
      if(T(tx, ty) === G_BLOCK){
        const nx = tx + dx, ny = ty + dy;
        if(walkT(nx, ny)){
          for(const b of mod.bloecke) if(b.tx === tx && b.ty === ty){
            setT(tx, ty, G_PATH); setT(nx, ny, G_BLOCK);
            invalidateMoore(tx, ty); invalidateMoore(nx, ny);
            b.tx = nx; b.ty = ny; b.x = tileMid(nx); b.y = tileMid(ny);
            mod.cd = 0.22; sfx.hit(false);
          }
        }
      }
    }
  }
  let gut = 0;
  for(const z of mod.ziele) for(const b of mod.bloecke) if(b.tx === z.tx && b.ty === z.ty){ gut++; break; }
  if(gut >= mod.ziele.length) mod.fertig = true;
}

// 3) Fackeln: Feuer zündet, Frost löscht ------------------------------------
function bauFackeln(mod, r){
  const orte = [[3,3],[9,3],[3,11],[9,11]];
  mod.fackeln = [];
  for(const o of orte){
    const f = {kt:'fackel', x: tileMid(r.x0+o[0]), y: tileMid(r.y0+o[1]), an: false, soll: false};
    mod.fackeln.push(f); kammer.props.push(f);
  }
  do { for(const f of mod.fackeln) f.soll = Math.random() < 0.5; }
  while(mod.fackeln.every(f=>!f.soll) || mod.fackeln.every(f=>f.soll));
  mod.tafel = tafel(r, mod, 'Soll-Bild', mod.fackeln.map(f => f.soll ? '●' : '○').join(' '));
  mod.hinweis = 'Feuer zündet, Frost löscht. Die Tafel zeigt das Soll-Bild.';
}
function aufFackeln(mod){
  for(const f of mod.fackeln) if(f.an !== f.soll) return;
  mod.fertig = true;
}
// Aufruf aus dem Zauberpfad. Rückgabe true = Geschoss hat sich verbraucht.
function kamFlamme(x, y, rad, zweig){
  if(!kammer || (zweig !== 0 && zweig !== 1)) return false;
  const mod = kammer.mods[kammer.idx];
  if(!mod || mod.kind !== 'fackeln' || mod.fertig) return false;
  const rr2 = (rad + 20) * (rad + 20);
  let traf = false;
  for(const f of mod.fackeln){
    if(sqDist(x, y, f.x, f.y - 10) > rr2) continue;
    if(zweig === 0 && !f.an){ f.an = true; traf = true; }
    else if(zweig === 1 && f.an){ f.an = false; traf = true; }
  }
  if(traf) sfx.magic();
  return traf;
}

// 4) Lichtstrahl über drehbare Spiegel --------------------------------------
function bauSpiegel(mod, r, k){
  // Aufbau ist konstruktiv lösbar: Strahl fällt von oben in Spalte A, wird nach
  // rechts umgelenkt, in Spalte B nach unten — beide Spiegel auf '\'.
  const ax = r.x0 + 2, bx = r.x0 + 9, zy = rri(r.y0+3, r.y0+11);
  mod.quelle = {kt:'quelle', tx: ax, ty: r.y0, x: tileMid(ax), y: tileMid(r.y0), dx: 0, dy: 1};
  mod.ziel   = {kt:'lziel', tx: bx, ty: r.y1, x: tileMid(bx), y: tileMid(r.y1)};
  mod.spiegel = [];
  const legeSpiegel = (tx, ty)=>{
    const s = {kt:'spiegel', tx, ty, x: tileMid(tx), y: tileMid(ty), st: rri(0,1), mod};
    mod.spiegel.push(s); kammer.props.push(s); return s;
  };
  legeSpiegel(ax, zy); legeSpiegel(bx, zy);
  if(k.diff >= 4){
    // Blender: darf auf keinem Abschnitt des Lösungswegs liegen, sonst ist der
    // konstruktiv garantierte Weg plötzlich blockiert.
    for(let versuch = 0; versuch < 40; versuch++){
      const tx = rri(r.x0+3, r.x1-3), ty = rri(r.y0+2, r.y1-2);
      if(tx === ax || tx === bx || ty === zy) continue;
      legeSpiegel(tx, ty); break;
    }
  }
  kammer.props.push(mod.quelle); kammer.props.push(mod.ziel);
  mod.pfad = [];
  strahlRechnen(mod);
  if(mod.fertig){ mod.spiegel[0].st ^= 1; strahlRechnen(mod); }   // nie schon gelöst starten
  mod.hinweis = 'Den Strahl mit den Spiegeln ins Ziel lenken. [F] dreht.';
}
function strahlRechnen(mod){
  const p = mod.pfad; p.length = 0;
  mod.fertig = false;
  let x = mod.quelle.tx, y = mod.quelle.ty, dx = mod.quelle.dx, dy = mod.quelle.dy;
  p.push(tileMid(x), tileMid(y));
  for(let i = 0; i < 80; i++){
    x += dx; y += dy;
    if(x === mod.ziel.tx && y === mod.ziel.ty){ p.push(tileMid(x), tileMid(y)); mod.fertig = true; return; }
    if(T(x, y) === G_WALL || !inB(x, y)){ p.push(tileMid(x), tileMid(y)); return; }
    let s = null;
    for(const sp of mod.spiegel) if(sp.tx === x && sp.ty === y){ s = sp; break; }
    if(s){
      p.push(tileMid(x), tileMid(y));
      if(s.st === 1){ const t = dx; dx = dy; dy = t; }        // '\' : rechts<->runter, links<->hoch
      else          { const t = dx; dx = -dy; dy = -t; }      // '/' : rechts<->hoch,  links<->runter
    }
  }
  p.push(tileMid(x), tileMid(y));
}

// 5) Gegnerwelle mit Sonderregel --------------------------------------------
function bauWelle(mod, r, k){
  const zweige = [0,1,2].filter(kenntZweig);
  const nutzeZweig = zweige.length > 0 && Math.random() < 0.5;
  const regel = nutzeZweig
    ? {typ:'zweig', zweig: zweige[Math.floor(Math.random()*zweige.length)], txt:'Prallt ab.'}
    : {typ:'ruecken', txt:'Nicht von vorn.'};
  regel.name = nutzeZweig ? 'nur ' + SPELL_BRANCHES[regel.zweig] : 'nur von hinten';
  mod.regel = regel; mod.mobs = []; mod.keineWaechter = true;
  const n = 3 + k.diff;
  for(let i = 0; i < n; i++){
    const tx = rri(r.x0+2, r.x1-2), ty = rri(r.y0+2, r.y1-2);
    if(!walkT(tx, ty)) continue;
    const m = makeMon(kamWaechterZufall(k.diff), tileMid(tx), tileMid(ty));
    m.regel = regel; m.faceAng = Math.PI;
    mod.mobs.push(m);
  }
  mod.hinweis = 'Wache mit Sonderregel: ' + regel.name + '.';
}
function aufWelle(mod){
  for(const m of mod.mobs) if(!m.dead) return;
  mod.fertig = true;
}
// Prüfung sitzt in hurtMon, direkt hinter dem Tot-Guard.
function kamTrefferOk(m, quelle, hitAngle){
  const r = m.regel;
  if(!r || quelle === 'ult') return true;
  if(r.typ === 'zweig') return quelle === r.zweig;
  if(r.typ === 'ruecken') return angDiff(hitAngle, m.faceAng) < 1.05;
  return true;
}

// 6) Symbolschloss -----------------------------------------------------------
function bauSchloss(mod, r){
  mod.code = [];
  for(let i = 0; i < 3; i++) mod.code.push(KAM_SYM[rri(0, KAM_SYM.length-1)]);
  mod.schloss = {kt:'schloss', x: tileMid(r.x1-1), y: tileMid(KAM_TY)};
  kammer.props.push(mod.schloss);
  mod.tafel = tafel(r, mod, 'Notiz der Aufsicht', mod.code.join(' '));
  mod.hinweis = 'Am Ausgang hängt ein Symbolschloss. Der Code steht irgendwo im Raum.';
}

// 7) Einbrechende Bodenplatten ----------------------------------------------
function bauBrechen(mod, r){
  // Der Plattengang ist der einzige Weg nach Osten: darüber und darunter Wand.
  const fx0 = r.x0+2, fx1 = r.x0+8, fy0 = r.y0+5, fy1 = r.y0+9;
  for(let x = fx0; x <= fx1; x++){
    for(let y = r.y0+1; y < fy0; y++) setT(x, y, G_WALL);
    for(let y = fy1+1; y < r.y1; y++) setT(x, y, G_WALL);
  }
  mod.fx0 = fx0; mod.fx1 = fx1; mod.fy0 = fy0; mod.fy1 = fy1;
  mod.pfad = [];
  let reihe = 2;
  for(let i = 0; i <= fx1-fx0; i++){
    mod.pfad.push(reihe);
    reihe = clamp(reihe + rri(-1, 1), 0, 4);
  }
  mod.start = {x: tileMid(fx0-1), y: tileMid(fy0 + mod.pfad[0])};
  mod.zeigT = 0; mod.kaputt = [];
  mod.keineWaechter = true;          // im Merkgang blockieren Wachen die einzige Spur
  mod.hinweis = 'Nur eine Spur trägt. Einprägen, dann laufen.';
}
function aufBrechen(mod, dt){
  if(mod.zeigT > 0) mod.zeigT -= dt;
  const tx = spielerTx(), ty = spielerTy();
  if(tx > mod.fx1){ mod.fertig = true; return; }
  if(tx < mod.fx0 || ty < mod.fy0 || ty > mod.fy1) return;
  if(mod.fy0 + mod.pfad[tx - mod.fx0] === ty) return;              // trägt
  setT(tx, ty, G_GAP); invalidateMoore(tx, ty);
  mod.kaputt.push({x: tileMid(tx), y: tileMid(ty)});
  player.x = mod.start.x; player.y = mod.start.y;
  mod.zeigT = 1.8;
  hurtPlayer(8 + kammer.diff*3);
  sfx.warp();
  floaters.push({x: player.x, y: player.y - 30, txt: 'Bricht ein.', col:'#9a8a5f', t: 1.2});
}

// 8) Schalterpaar mit Zeitfenster -------------------------------------------
function bauSchalter(mod, r, k){
  mod.fenster = Math.max(2.6, 5.2 - k.diff*0.4);
  mod.a = {kt:'hebel', x: tileMid(r.x0+2), y: tileMid(r.y0+2), an: false, mod};
  mod.b = {kt:'hebel', x: tileMid(r.x1-2), y: tileMid(r.y1-2), an: false, mod};
  kammer.props.push(mod.a); kammer.props.push(mod.b);
  mod.t = 0;
  mod.hinweis = 'Zwei Hebel, ein Zeitfenster von ' + mod.fenster.toFixed(1) + ' Sekunden.';
}
function hebelZiehen(h){
  const mod = h.mod;
  if(mod.fertig || h.an) return;
  h.an = true; sfx.hit(false);
  const anderer = h === mod.a ? mod.b : mod.a;
  if(anderer.an){ mod.fertig = true; return; }
  mod.t = mod.fenster;
}
function aufSchalter(mod, dt){
  if(mod.t > 0){
    mod.t -= dt;
    if(mod.t <= 0){
      mod.a.an = false; mod.b.an = false;
      sfx.hurt();
      floaters.push({x: player.x, y: player.y - 30, txt: 'Zu langsam.', col:'#9a8a5f', t: 1.2});
    }
  }
}

// Hinweistafel: steht an der Nordwand des Raums und ist nur aus der Nähe lesbar.
function tafel(r, mod, titel, txt){
  const t = {kt:'tafel', x: tileMid(r.x0+6), y: tileMid(r.y0+1), titel, txt};
  kammer.props.push(t);
  return t;
}

// Die Kammer ist deutlich kleiner als die Oberwelt. Ohne Begrenzung zeigt die
// Kamera an den Rändern nur gebackenes Schwarz; passt der Korridor komplett ins
// Bild, wird er stattdessen mittig gehalten.
function kammerKamera(){
  const k = kammer;
  const oben = KAM_Y0*TS - 24, unten = (KAM_Y0 + KAM_H)*TS + 24;
  const links = KAM_X0*TS - 24, rechts = (k.raeume[k.raeume.length-1].x1 + 1)*TS + 24;
  cam.y = (unten - oben) <= canvas.height ? (oben + unten - canvas.height)/2
                                          : clamp(cam.y, oben, unten - canvas.height);
  cam.x = (rechts - links) <= canvas.width ? (links + rechts - canvas.width)/2
                                           : clamp(cam.x, links, rechts - canvas.width);
}

// --- Kammer-Update ----------------------------------------------------------
function updateKammer(dt){
  const k = kammer;
  const mod = k.mods[k.idx];
  if(!mod) return;
  if(!mod.fertig){
    if(!mod.begonnen && player.x > mod.raum.x0*TS){
      mod.begonnen = true;
      if(mod.kind === 'brechen') mod.zeigT = 2.8;
      floaters.push({x: player.x, y: player.y - 44, txt: mod.hinweis, col:'#c9b98a', t: 4.0});
    }
    const f = KAM_MOD[mod.kind].auf;
    if(f && mod.begonnen) f(mod, dt);
  }
  // Getrennt geprüft: Spiegel und Symbolschloss melden ihr Ergebnis von außerhalb
  // des Update-Zweigs, ein verschachteltes if hätte sie nie abgeholt.
  if(mod.fertig) modulGeloest(k, mod);
}
function modulGeloest(k, mod){
  oeffneTor(mod.nr + 1);
  k.idx++;
  floaters.push({x: player.x, y: player.y - 44,
                 txt: k.idx >= k.mods.length ? 'Die Schatzkammer öffnet sich.' : 'Das Tor gibt nach.',
                 col:'#6aff8f', t: 2.4, big: true});
}

// --- Aktionen (Taste F / Kontext-Button) ------------------------------------
// Kein Closure-Bau pro Frame: der beste Kandidat landet in drei festen Feldern.
let aktArt = 0, aktObj = null, aktTxt = '', aktD2 = 0, aktSperre = 0;
// U6: AKT_NACHFRAGE (war 9) ist ersatzlos weg. Knoeterich wird jetzt ueber
// AKT_NPC angesprochen wie jede andere Figur; das Nachschlagen ist eine Antwort
// in seiner Tafel geworden. Die 9 bleibt frei und wird nicht nachbesetzt: die
// Zahlen sind Sprungmarken in einem switch und stehen in keinem Spielstand.
const AKT_TUER=1, AKT_SPIEGEL=2, AKT_HEBEL=3, AKT_SCHLOSS=4, AKT_TRUHE=5, AKT_AUSGANG=6, AKT_RESET=7, AKT_GRUSS=8, AKT_AMT=10, AKT_NPC=11, AKT_ZUSTELLEN=12, AKT_ABSTIEG=13, AKT_STOPFEN=14,
      // IN1: hinein, hinaus, und die zweite Schublade. AKT_AMT bleibt, was es
      // war — nur steht es seither am Dienstpult drinnen statt an der Fassade.
      AKT_HAUS=15, AKT_HAUSAUS=16, AKT_SCHUBLADE=17,
      // AN3: ein Wandstueck ansehen, das etwas traegt. Eine Zahl fuer beide
      // Requisiten und nicht eine je Stueck: was angesehen wird, steht am
      // Moebel (o.requisit), nicht an der Sprungmarke.
      AKT_REQUISIT=18;
function aktBiete(x, y, art, obj, txt){
  const d = sqDist(player.x, player.y, x, y);
  if(d < aktD2){ aktD2 = d; aktArt = art; aktObj = obj; aktTxt = txt; }
}
// Fluch 'Grußpflicht': hurtMon prüft m.regel separat (Wellen-Wachen sind ausgenommen),
// Grüßen selbst muss aber innerhalb und außerhalb der Kammer angeboten werden.
function gruessen(){
  let n = 0;
  for(const m of monsters){ if(m.dead || m.gruss) continue;
    if(sqDist(player.x, player.y, m.x, m.y) < 14400){ m.gruss = true; n++; } }
  if(n){ sfx.gold(); floaters.push({x:player.x, y:player.y-34, txt:'Guten Tag.', col:'#e8d9a8', t:1.2}); }
}
function scanAktion(dt){
  if(aktSperre > 0) aktSperre -= dt;
  aktArt = 0; aktObj = null; aktD2 = 58*58;
  if(state !== 'play' || player.dead || aktSperre > 0) return;
  // IN1: drinnen gibt es weder Monster noch Kammertüren noch das Schattenland.
  // Was es gibt, sind Leute, Möbel mit einer Aufschrift und der Weg hinaus.
  if(innen){
    aktBiete(innen.tuer.x, innen.tuer.y, AKT_HAUSAUS, null, 'Hinausgehen');
    for(const n of npcs) if(figDa(n.figur)) aktBiete(n.x, n.y, AKT_NPC, n, 'Ansprechen');
    for(const o of innen.moebel){
      if(o.akt === 'pult' && CONFIG.schichtModus) aktBiete(o.x, o.y, AKT_AMT, null, 'Amtsstube');
      // Die klemmende Schublade bietet sich nur an, solange sie klemmt. Die
      // Bedingung ist wörtlich dieselbe wie in schubladeBlock() — sie steht
      // nicht zweimal da, sie wird dort gelesen.
      if(o.akt === 'schublade' && schubladeBlock()) aktBiete(o.x, o.y, AKT_SCHUBLADE, null, 'Die zweite Schublade');
      // AN3: Ein Wandstueck ueber der Schwelle darf die Schwelle nicht
      // ueberbieten. Die Tafel haengt 36 Pixel ueber der Tuer, der Spieler
      // steht nach dem Dienstantritt 40 davor -- ohne diese Bedingung waere
      // "Ansehen" die erste Bedienmoeglichkeit seines Dienstes und nicht
      // "Hinausgehen", und der erste freie Schritt aus AN2 waere keiner mehr.
      // Gemessen, nicht befuerchtet: 17,9 Pixel gegen 40.
      //
      // Das ist dieselbe aktBiete-Falle, die W5 am Schattenfuersten gestellt
      // hat, und dieselbe Antwort: naeher gewinnt, und naeher ist hier das
      // Falsche. Wer die Tafel lesen will, tritt einen Schritt von der Tuer
      // zurueck, und das ist genau das, was man vor einem Schild ueber einer
      // Tuer ohnehin tut.
      if(o.akt === 'requisit' && aktArt !== AKT_HAUSAUS)
        aktBiete(o.x, o.y, AKT_REQUISIT, o, 'Ansehen');
    }
    return;
  }
  if(!kammer){
    // W5: "Zustellen" am Schattenfürsten. Vor dem Grußpflicht-Block geprüft: boss.x/
    // boss.y sind echte Weltkoordinaten (nie player.x/player.y — Distanz 0 schlägt
    // sonst jedes andere Angebot, die aktBiete()-Falle).
    if(currentLevel === 2 && boss && !boss.dead && vorgangZustellbar())
      aktBiete(boss.x, boss.y, AKT_ZUSTELLEN, null, 'Zustellen');
    // Nur anbieten, wenn tatsächlich ein ungegrüßtes Ziel in der Nähe ist, sonst würde
    // der Fluch dauerhaft jede Tür-/Truheninteraktion überstimmen (Distanz 0 gewinnt immer).
    // W5: zusätzlich aktArt !== AKT_ZUSTELLEN, sonst überstimmt die Grußpflicht in
    // Ablage V "Zustellen" bei bis zu 130 ungegrüßten Monstern dauerhaft.
    if(CFX.gruss){
      let near = false;
      for(const m of monsters){ if(!m.dead && !m.gruss && sqDist(player.x, player.y, m.x, m.y) < 8100){ near = true; break; } }
      if(near && aktArt !== AKT_ZUSTELLEN) aktBiete(player.x, player.y, AKT_GRUSS, null, 'Grüßen');
    }
    if(currentLevel !== 1) return;
    // Phase 5: Knöterich steht fest im Haus und wird von drawAlter() gezeichnet,
    // deshalb steht sein Angebot hier und nicht in der npcs-Schleife darunter.
    // U6: "Nachfragen" heißt jetzt "Ansprechen" und wird immer angeboten, nicht
    // erst ab dem ersten Dienstzettel. Was dahinter steht, ist keine Anzeige
    // mehr, sondern seine Gesprächstafel, und die hat er von Anfang an.
    aktBiete(KN_POS.x, KN_POS.y, AKT_NPC, knNpc, 'Ansprechen');
    // W3: eigene Weltposition je Figur. W11: wer erst ab einem spaeteren Akt im
    // Dorf steht, ist vorher auch nicht ansprechbar.
    for(const n of npcs) if(figHier(n.figur)) aktBiete(n.x, n.y, AKT_NPC, n, 'Ansprechen');
    for(const t of kammerTueren) if(t.cd <= 0) aktBiete(t.x, t.y, AKT_TUER, t, 'Betreten');
  // SZ3: die brummende Stelle. Sie bietet nur an, was gerade dran ist, und bei
  // Stufe 2 gar nichts — dort fehlt Zapf, und der steht im Dorf. Eine Aktion,
  // die anbietet, was sie nicht kann, ist schlimmer als keine.
  { const t = stopfenAktionText();
    if(t) aktBiete(STOPFEN.x, STOPFEN.y, AKT_STOPFEN, null, t); }
    // IN1: Die drei Türen. Sie stehen auch im freien Spiel offen — ein Haus zu
    // betreten hat mit der Schichtuhr nichts zu tun. Was drinnen an der Uhr
    // hängt (das Dienstpult, der Feierabend), prüft sie selbst.
    // Bis hierhin bot das Amt an dieser Stelle direkt sein Panel an. Das tut es
    // jetzt drinnen, am Dienstpult: der Weg zum Feierabend ist um drei Schritte
    // länger geworden, und dafür hat er einen Ort.
    for(const h of INN_HAEUSER) aktBiete(h.tuer.x, h.tuer.y, AKT_HAUS, h, 'Betreten');
    return;
  }
  const k = kammer;
  if(CFX.gruss){
    let near = false;
    for(const m of monsters){ if(!m.dead && !m.gruss && sqDist(player.x, player.y, m.x, m.y) < 8100){ near = true; break; } }
    if(near) aktBiete(player.x, player.y, AKT_GRUSS, null, 'Grüßen');
  }
  aktBiete(k.ausgang.x, k.ausgang.y, AKT_AUSGANG, null, 'Verlassen');
  if(k.truhe) aktBiete(k.truhe.x, k.truhe.y, k.truhe.auf ? AKT_AUSGANG : AKT_TRUHE, null,
                       k.truhe.auf ? 'Verlassen' : 'Öffnen');
  // M4: das Loch im Boden steht sichtbar da, sobald die Kammer gebaut ist, aber
  // es nimmt niemanden auf, solange die Truhe zu ist. Deshalb haengt das Angebot
  // an kannAbsteigen() und nicht an k.abstieg allein.
  if(kannAbsteigen()) aktBiete(k.abstieg.x, k.abstieg.y, AKT_ABSTIEG, null, 'Hinabsteigen');
  const mod = k.mods[k.idx];
  if(!mod || mod.fertig) return;
  if(mod.kind === 'spiegel') for(const s of mod.spiegel) aktBiete(s.x, s.y, AKT_SPIEGEL, s, 'Drehen');
  if(mod.kind === 'schalter'){ aktBiete(mod.a.x, mod.a.y, AKT_HEBEL, mod.a, 'Hebel'); aktBiete(mod.b.x, mod.b.y, AKT_HEBEL, mod.b, 'Hebel'); }
  if(mod.kind === 'schloss') aktBiete(mod.schloss.x, mod.schloss.y, AKT_SCHLOSS, mod, 'Schloss');
  if(mod.kind === 'bloecke') aktBiete(mod.rune.x, mod.rune.y, AKT_RESET, mod, 'Zurück');
}
function fuehreAktion(){
  if(state !== 'play') return;
  switch(aktArt){
    case AKT_TUER:    betreteKammer(aktObj); break;
    case AKT_SPIEGEL: aktObj.st ^= 1; sfx.hit(false); strahlRechnen(aktObj.mod); break;
    case AKT_HEBEL:   hebelZiehen(aktObj); break;
    case AKT_SCHLOSS: schlossAuf(aktObj); break;
    case AKT_TRUHE:   truheOeffnen(); break;
    case AKT_AUSGANG: verlasseKammer(); break;
    case AKT_ABSTIEG: steigeAb(); break;
    case AKT_STOPFEN: stopfenGriff(); break;
    case AKT_RESET:   bloeckeZurueck(aktObj); break;
    case AKT_GRUSS:   gruessen(); break;
    // U3: F oeffnet die Tafel; ein zweiter Druck redet darin weiter.
    // SZ2 hatte fuer Knoeterich einen zweiten Fall daneben, weil er keine
    // Dorffigur war und der Szenenhaken in gespraechOeffnen() sitzt. Seit U6
    // hat er einen Figureneintrag und geht denselben Weg: der Haken greift von
    // selbst, die Ausnahme ist weg.
    case AKT_NPC:     gespraechOeffnen(aktObj); break;
    case AKT_AMT:     amtFensterOeffnen(); break;
    case AKT_HAUS:    betreteHaus(aktObj); break;
    // AN4: Erst hinaus, dann meldet sich die Anlage 2 -- und nur beim ersten
    // Mal und nur auf diesem Weg. Der Merker steht in anlage2VorDemHaus().
    case AKT_HAUSAUS: verlasseHaus(); anlage2VorDemHaus(); break;
    case AKT_SCHUBLADE: schubladeOeffnen(); break;
    case AKT_REQUISIT:  requisitAnsehen(aktObj && aktObj.requisit); break;
    case AKT_ZUSTELLEN: zustellen(); break;
  }
}

// W-Nörgel: figureigene Zusatzzeilen. Dieselbe Wirkung wie langZusatz(), nur
// hängt der Schalter an einem Merker im Spielstand statt an einem Langvorgang:
// kein Strang, keine Stufen, kein Kladde-Eintrag, und vor allem kein achter
// Eintrag in einer Tabelle, deren sieben Stränge in Kapitel 10 der Weltbibel
// abschliessend aufgezählt sind. Der Merker steht als NAME in der Tabelle und
// nicht als Funktion — DORF_FIGUREN ist reine Daten, und knAssertCaps() kann so
// nachsehen, ob es den Merker überhaupt gibt. Sie hängen sich vor die
// Langvorgang-Zeilen: wer beides freigeschaltet hat, sieht das Neuere zuerst.
// W11: zweiter Schalter derselben Art. merker haengt an einem Merker im
// Spielstand (W-Noergel), abAkt am Aktstand. Jeder Block hat genau einen von
// beiden, knAssertCaps() rechnet das nach. Damit bekommt jede bestehende Figur
// ihren Zuwachs aus der Weltgeschichte, ohne dass eine ihrer Zeilen von 2026
// umgeschrieben werden muss: die neuen haengen sich hinten an.
function figZusatz(fig){
  if(!fig.zusatz) return [];
  let out = [];
  for(const z of fig.zusatz){
    // F1b: Der Schalter steht in ZUSATZ_SCHALTER, nicht hier. Genau ein Schlüssel
    // je Block ist die Regel, knAssertCaps() rechnet sie beim Start nach; findet
    // diese Schleife trotzdem keinen, bleibt der Block zu, statt von selbst
    // aufzugehen. Ein Block ohne Schalter ist ein Fehler und kein Freibrief.
    let frei = false;
    for(const k in ZUSATZ_SCHALTER){
      if(!(k in z)) continue;
      frei = !!ZUSATZ_SCHALTER[k].frei(z[k], z);
      break;
    }
    if(frei) out = out.concat(z.zeilen);
  }
  return out;
}

// W3: Dorf-Figuren ansprechen. Kein Dialogbaum, kein Menü — ein Tastendruck
// schaltet die Figur eine Zeile weiter (Grundzeilen-Kreislauf, zuletzt die
// Aktzeile, die sich mit aktStand() automatisch ändert), Bramsche und der
// Lott/Pahl-Chor weichen davon situativ ab, siehe unten.
function npcCycle(n, fig){
  // W7: Ein laufender Langvorgang rückt vor und spricht, ohne den Zeiger zu
  // bewegen — die Grundzeilen gehen dadurch nicht verloren, sie kommen später.
  const lv = langAnsprechen(fig.key);
  if(lv){ n.bubbleText1 = lv.z1; n.bubbleText2 = lv.z2; return; }
  // 18.5: Schritt 0 ist die Anredezeile. bubbleIdx startet bei -1, der erste
  // Tastendruck landet also darauf. Danach die unveränderten Grundzeilen plus
  // die freigeschalteten Zusatzzeilen (W-Nörgel: erst die figureigenen aus
  // einem Merker, dann die aus Langvorgängen), zuletzt die Aktzeile —
  // deshalb +2 statt +1 im Modulo. Das Modulo hält den Zeiger auch dann im
  // Bereich, wenn zus mitten im Zyklus wächst.
  const zus   = figZusatz(fig).concat(langZusatz(fig.key));
  const grund = zus.length ? fig.grund.concat(zus) : fig.grund;
  n.bubbleIdx = (n.bubbleIdx + 1) % (grund.length + 2);
  if(n.bubbleIdx === 0){
    const a = anredeZeile(fig.key);
    n.bubbleText1 = a.z1; n.bubbleText2 = a.z2;
  } else if(n.bubbleIdx <= grund.length){
    const p = grund[n.bubbleIdx - 1];
    n.bubbleText1 = p.z1; n.bubbleText2 = p.z2;
  } else {
    n.bubbleText1 = fig.akt[aktStand() - 1]; n.bubbleText2 = '';
  }
}
function npcSprechen(n){
  const fig = n.figur;
  if(fig.key === 'bramsche'){
    if(bramscheFragen > 0){
      let qa = fig.antworten[Math.floor(Math.random() * fig.antworten.length)];
      let guard = 0; while(qa === bramscheLastAntwort && guard++ < 8) qa = fig.antworten[Math.floor(Math.random() * fig.antworten.length)];
      bramscheLastAntwort = qa;
      n.bubbleText1 = qa.z1; n.bubbleText2 = qa.z2;
      bramscheFragen--; n.bramscheJustAsked = true;
    } else if(n.bramscheJustAsked){
      n.bramscheJustAsked = false;
      if(rangSchluessel()){          // W6: zweiter Schlüssel, ab höherem Dienst (18.7) — die Frage ist nie verbraucht, es gibt nichts abzuweisen
        bramscheFragen = 1;
        npcCycle(n, fig);
      } else {
        const ab = fig.abweisung[Math.floor(Math.random() * fig.abweisung.length)];
        n.bubbleText1 = ab.z1; n.bubbleText2 = ab.z2;
      }
    } else {
      npcCycle(n, fig);
    }
  } else if(fig.anlass){
    const pool = letzterAnlass ? fig.anlass[letzterAnlass] : null;
    if(pool && pool.length){
      const line = pool[Math.floor(Math.random() * pool.length)];
      n.bubbleText1 = line.z1; n.bubbleText2 = line.z2;
      letzterAnlass = null;   // Der Anlass ist verbraucht, der Chor kehrt in den Zyklus zurück
    } else {
      npcCycle(n, fig);
    }
  } else {
    npcCycle(n, fig);
  }
  n.bubbleHideAt = gameT + 4;
}

