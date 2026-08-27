// Pruefprotokoll zu Bauabschnitt U1 (phase-u1-menue.md).
//
//   python3 serve.py &
//   node tools/menue-pruef.mjs [URL]
//
// Braucht Playwright und einen Chromium, wie die uebrigen Messlaeufe. Geprueft
// wird das, was U1 versprochen hat, im echten Browser statt in einer Behauptung:
//
//   Klick daneben   jedes der hier geprueften sieben Panels geht zu, wenn
//                   neben es geklickt oder getippt wird
//   kein Angriff    derselbe Griff fuehrt keinen Schlag aus und startet keinen
//                   Joystick. Das ist die eigentliche Falle: die Angriffe
//                   haengen an canvas.mousedown/touchstart, ein Panel liegt nur
//                   darueber
//   Inseln          HUD, Guertel und Daumenfaecher behalten ihre Wirkung, auch
//                   mit offenem Panel — der mobile Breakpoint laesst unten
//                   bewusst Platz dafuer, ein modaler Vorhang haette ihn
//                   kassiert
//   Esc             schliesst weiterhin eine Ebene je Druck, nicht alles
//   Kopfband        der Schliessknopf bleibt beim Scrollen im Bild
//
// U8 — WAS SICH FUER DIESEN LAUF GEAENDERT HAT
//
// Die vier Menuefenster (Charakter, Rucksack, Kochen, Zauber) sind seit U8
// Grossfenster: sie stehen nicht mehr neben dem Spiel, sondern fuellen den
// Schirm bis auf die Streifen, in denen die Bedienschicht liegt. Drei Dinge
// folgen daraus fuer diesen Lauf, und alle drei sind hier nachgezogen:
//
//   1. "daneben" liegt woanders. Auf 1280x800 laeuft das Fenster von x=144
//      bis x=1136 und von y=136 bis y=722. Die alten Klickpunkte (300/400,
//      660/400, 160/300) liegen seither MITTEN im Fenster. Geklickt wird
//      jetzt links davon.
//   2. Zwei Grossfenster koennen nicht mehr gleichzeitig offen stehen. Sie
//      liegen an derselben Stelle; ein Stapel waere kein Stapel, sondern ein
//      Fenster, das aussieht wie ein anderes. Der Guertelknopf WECHSELT
//      seither, statt ein zweites danebenzustellen — und genau das wird hier
//      geprueft, mit derselben Strenge wie vorher das Nebeneinander.
//   3. Gerollt wird das Rollfeld (.gfBody), nicht das Fenster. Der
//      Schliessknopf sitzt im Kopf darueber und kann gar nicht mehr
//      wegscrollen; geprueft wird trotzdem beides, weil "kann nicht" eine
//      Behauptung ueber CSS ist und dieser Lauf Behauptungen misst.
//
// Neu dazu kommt das Reiterband: vier Reiter in jedem Fenster, ein Griff
// darauf wechselt das Fenster.
//
// PANEL_REGISTER haelt inzwischen neun Eintraege. Sieben davon stehen hier, die
// beiden anderen werden in ihrem eigenen Lauf geprueft, weil dort auch der Rest
// ihres Bauabschnitts steht und ein Lauf je Bauabschnitt leichter zu lesen ist:
// das Gespraechsfenster aus U3 in tools/gespraech-pruef.mjs, die Kartenmappe
// aus K1 in tools/zulagen-pruef.mjs (seit U8 das zweite Blatt des
// Charakterfensters). Beide haengen im selben Register und folgen denselben
// Regeln; wer hier eine Zeile ergaenzt, ergaenzt sie dort mit.
//
// Anders als monster-messlauf.mjs misst dieser Lauf nichts, er stellt fest:
// jede Zeile ist ein Soll-Ist-Vergleich, der Exit-Code ist 1, sobald eine
// Zeile nicht stimmt. Damit taugt er fuer CI, sollte das Repo je eines haben.
//
// Angriffe werden nicht geraten, sondern gezaehlt: tryAttack() ist der einzige
// Weg zu einem Schlag, der Lauf legt sich davor.
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const { chromium } = pw;

const URL = process.argv[2] || 'http://127.0.0.1:8378/index.html';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });

const zeilen = [];
let fehl = 0;

// RIEGEL (27.08.2026, INTRO-MESSUNG Pruefung 4): Das Protokoll gehoert dem Lauf
// und nicht seinem guten Ende. Bis hierher stand der Druck ganz unten, und eine
// ungefangene Ausnahme mittendrin nahm ihn mit -- Exit-Code 1, ein Stapelabzug,
// und keine Zeile darueber, was geprueft wurde und was nicht. Nachgestellt:
// null von 96 Zeilen, wenn der Lauf vor seinem Ende stirbt.
//
// Der ABBRUCH-Hinweis ist dabei nicht die Zierde, sondern der Kern. Ohne ihn
// meldet ein abgebrochener Lauf "40 von 40 Pruefungen bestanden", und das liest
// sich wie ein sauberer Durchlauf, obwohl der ganze Rest nie gelaufen ist.
let berichtet = false, fertig = false;
function bericht(){
  if(berichtet) return;
  berichtet = true;
  console.log(zeilen.join('\n'));
  console.log(`\n${zeilen.length - fehl} von ${zeilen.length} Pruefungen bestanden.`);
  if(!fertig) console.log(
      'ABBRUCH: der Lauf ist vor seinem Ende gestorben. Die Zeile darueber zaehlt nur,\n'
    + 'was bis dahin lief -- alles danach ist UNGEPRUEFT und nicht etwa in Ordnung.\n'
    + 'Die Ursache steht als Ausnahme darunter.');
}
process.on('exit', bericht);

function pruef(name, ist, soll){
  const ok = JSON.stringify(ist) === JSON.stringify(soll);
  if(!ok) fehl++;
  zeilen.push(`${ok ? 'ok  ' : 'FEHL'}  ${name.padEnd(56)} ist=${JSON.stringify(ist)} soll=${JSON.stringify(soll)}`);
}

// Startet das Spiel und klickt den W8-Einstellungsvordruck durch, bis das
// Overlay weg ist — mit stehendem Overlay (z-index 50) laege ueber allem ein
// Klickfaenger, und der Lauf pruefte nur ihn.
async function spiel(ctxOpt){
  const ctx = await browser.newContext(ctxOpt);
  const page = await ctx.newPage();
  const laut = [];
  page.on('pageerror', e => laut.push('pageerror: ' + String(e).slice(0, 200)));
  page.on('console', m => {
    if(m.type() !== 'error') return;
    // Ein fehlendes Sprite-Blatt ist ein Fehlstand des Grafikpakets, kein Fund
    // dieses Laufs: wer das Repo ohne vollstaendige Lizenz klont, soll daran
    // keine Menue-Pruefung scheitern sehen. Das Spiel meldet solche Luecken
    // ohnehin selbst und einmal (s. loadAssets/bakeAllNpcSheets).
    if(m.text().includes('404')) return;
    laut.push('console: ' + m.text().slice(0, 200));
  });
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForFunction(() => assetsReady === true, null, { timeout: 30000 });
  await page.evaluate(() => startGame());
  await page.waitForTimeout(300);
  // E2: startGame() oeffnet nicht mehr das Overlay, sondern den Empfang in der
  // Gespraechstafel auf schwarzem Grund. Die Schleife darunter wartet auf ein
  // sichtbares Overlay und waere sofort ausgestiegen, mitten im Anfang. Ein
  // Sprung auf den Vordruck bringt den Lauf auf den Weg, den er kennt.
  await page.evaluate(() => { if(typeof empfangAktiv !== 'undefined' && empfangAktiv) empfangUeberspringen(); });
  await page.waitForTimeout(200);
  // E2: Der Vordruck blaettert seit E2 nach gemessener Hoehe und hat je nach
  // Fenster und Schriftstufe bis zu fuenfzehn Seiten statt drei. Zwoelf Runden
  // reichten nicht mehr bis zur Unterschrift, der Lauf blieb im Vordruck
  // stehen und alles danach fiel aus.
  for(let i = 0; i < 60; i++){
    const offen = await page.evaluate(() => document.getElementById('overlay').style.display === 'flex');
    if(!offen) break;
    const btn = page.locator('#overlay button').last();
    if(await btn.count() === 0) break;
    await btn.click({ force: true });
    await page.waitForTimeout(200);
  }
  // T3: Dieser Lauf geht über den Vordruck und sieht die Ernennung deshalb
  // nicht, und mit ihr nicht das erste Treffen mit Anlage 2. Das wird beim
  // ersten Griff zur Tasche nachgeholt (toggleInventory), und dieser Lauf
  // greift danach mehrfach zur Tasche, um das Menü zu prüfen. Einmal vorweg
  // durchgeklickt, damit er das Menü prüft und nicht den Anfang. Die
  // Einführung selbst steht in empfang-pruef.mjs und anlage2-pruef.mjs.
  await page.evaluate(() => toggleInventory());
  await page.waitForTimeout(300);
  const weggeklickt = await stapelWegklicken(page);
  // RIEGEL (27.08.2026, INTRO-MESSUNG Pruefung 4): DAS ist die Zeile, die den
  // ganzen Fall gefangen haette, und sie fehlte. Der Zweck dieser Schleife ist,
  // dass die Tafel danach WEG ist -- geprueft wurde das nie. Findet sie ihren
  // Knopf nicht, blieb der Stapel stehen, und der Lauf prueft das Menue durch
  // ein Modalfenster hindurch. Ob das auffaellt, hing davon ab, was die
  // naechste Pruefung zufaellig anfasst; nachgestellt lief er in einen
  // Zeitablauf auf #bagGrid, und der nennt die Ursache nicht.
  if(await page.evaluate(() => document.getElementById('overlay').style.display === 'flex'))
    throw new Error(`stapelWegklicken: nach ${weggeklickt} Tafel(n) steht das Overlay immer noch. `
      + `Alles, was dieser Lauf danach prueft, saehe das Menue durch eine Tafel hindurch.`);
  await page.evaluate(() => { if(invOpen) toggleInventory(); });
  await page.waitForTimeout(200);

  await page.evaluate(() => {
    window.__schlaege = 0;
    const alt = tryAttack;
    window.tryAttack = tryAttack = function(...a){ window.__schlaege++; return alt.apply(this, a); };
  });
  return { page, ctx, laut };
}

// Den Tafelstapel wegklicken, der vor dem Menue steht.
//
// RIEGEL (27.08.2026): Das war bis hierher eine namenlose Schleife mitten im
// Aufbau -- kein Name, kein Rueckgabewert, keine Pruefung, nur `if(!weiter)
// break;`. Sie ist die stillste Stelle beider Pruefstaende gewesen: ALLE 78
// Pruefungen dieses Laufs haengen an ihr, und keine einzige lief vor ihr.
//
// Sie trennt jetzt dieselben zwei Lagen wie durchDenStapel() in
// empfang-pruef.mjs: Overlay zu heisst fertig, Overlay offen ohne passenden
// Knopf heisst Fund und wirft.
async function stapelWegklicken(page){
  let tafeln = 0;
  for(let i = 0; i < 8; i++){
    const r = await page.evaluate(() => {
      if(document.getElementById('overlay').style.display !== 'flex') return {lage:'zu'};
      // T6: LESEN kommt dazu, sonst bleibt der Lauf an der Scheinwahl der
      // Anlage 2 haengen und kaeme nie bis zum Menue. Gleichheit statt
      // Vorkommen, denn "Nicht lesen" steht als zweiter Knopf daneben.
      const knoepfe = [...document.querySelectorAll('#ovPanel button')];
      const b = knoepfe.find(x => ['WEITER', 'EINSTECKEN', 'LESEN'].includes(x.textContent.trim()));
      if(!b) return {lage:'kein-knopf', da: knoepfe.map(x => x.textContent.trim())};
      b.click(); return {lage:'weiter'};
    });
    if(r.lage === 'zu') break;
    if(r.lage === 'kein-knopf')
      throw new Error(`stapelWegklicken: die Tafel steht, aber kein Weiterknopf passt. `
        + `Gesucht wurde WEITER, EINSTECKEN oder LESEN; auf der Tafel steht `
        + `${JSON.stringify(r.da)}. Nach ${tafeln} Blatt/Blaettern.`);
    tafeln++;
    await page.waitForTimeout(200);
  }
  return tafeln;
}

const stand = p => p.evaluate(() => ({
  inv: invOpen, zauber: spellTreeOpen, kessel: kesselOpen, ausweis: ausweisOpen,
  karte: fullmapOpen, schloss: schlossOpen, amt: amtFensterOpen,
  charakter: charakterOpen, optionen: optionenOpen,
  schleier: document.body.classList.contains('panelOffen'),
  schlaege: window.__schlaege,
}));

// U8: Ein Punkt, der garantiert NEBEN jedem Grossfenster liegt. Er wird nicht
// geraten, sondern aus der linken Fensterkante gelesen — sonst wandert er beim
// naechsten Mass mit und niemand merkt es.
const danebenPunkt = async p => p.evaluate(() => {
  const r = document.getElementById('inv').getBoundingClientRect();
  return { x: Math.max(6, Math.round(r.left / 2)), y: Math.round(innerHeight / 2) };
});

// ---------------------------------------------------------------- Desktop
{
  const { page, ctx, laut } = await spiel({ viewport: { width: 1280, height: 800 } });

  await page.evaluate(() => toggleInventory());
  pruef('Inventar offen -> Schleier an', (await stand(page)).schleier, true);
  const dn = await danebenPunkt(page);
  await page.mouse.click(dn.x, dn.y);
  let z = await stand(page);
  pruef('Klick auf die Welt schliesst das Inventar', z.inv, false);
  pruef('und fuehrt dabei keinen Angriff', z.schlaege, 0);
  pruef('Schleier wieder aus', z.schleier, false);

  await page.mouse.click(dn.x, dn.y);
  pruef('Klick ohne offenes Panel schlaegt weiter zu', (await stand(page)).schlaege, 1);

  await page.evaluate(() => { window.__schlaege = 0; toggleInventory(); });
  await page.locator('#bagGrid').click({ force: true });
  z = await stand(page);
  pruef('Klick INS Panel laesst es offen', z.inv, true);
  pruef('Klick ins Panel schlaegt nicht zu', z.schlaege, 0);

  // U8: Der Guertelknopf wechselt das Fenster, statt ein zweites danebenzu-
  // stellen. Beides zugleich waere seit U8 ein Stapel an derselben Stelle.
  await page.locator('#spellsBtn').click();
  z = await stand(page);
  pruef('Guertelknopf oeffnet den Zauberbaum', z.zauber, true);
  pruef('und raeumt dabei den Rucksack weg', z.inv, false);

  // U8: Das Reiterband. Ein Griff wechselt das Fenster. Seit dem dritten
  // Nachtrag sind es fuenf Reiter — die Optionen sind dazugekommen und haben
  // als einziges Fenster keinen Guertelknopf, das Band ist ihr Weg.
  pruef('fuenf Reiter im Band', await page.locator('#spellTree .gfReiter').count(), 5);
  await page.locator('#spellTree .gfReiter[data-ziel="charakter"]').click();
  z = await stand(page);
  pruef('Reiter fuehrt ins Charakterfenster', [z.charakter, z.zauber], [true, false]);
  await page.locator('#charakter .gfReiter[data-ziel="kessel"]').click();
  z = await stand(page);
  pruef('und von dort in den Kessel', [z.kessel, z.charakter], [true, false]);
  // Die Optionen sind ueber das Band UND ueber die Taste erreichbar, sonst
  // gaebe es am Finger keinen Weg zu ihnen: sie haben keinen Guertelknopf.
  await page.locator('#kessel .gfReiter[data-ziel="optionen"]').click();
  z = await stand(page);
  pruef('und weiter in die Optionen', [z.optionen, z.kessel], [true, false]);
  pruef('Lautstaerke und Spielstand stehen dort', await page.evaluate(() =>
    !!document.querySelector('#optionen #musicVol') && !!document.querySelector('#optionen #spSpeichern')), true);
  pruef('und nicht mehr im Rucksack', await page.evaluate(() =>
    !document.querySelector('#inv #musicVol') && !document.querySelector('#inv #spSpeichern')), true);
  await page.keyboard.press('o');
  pruef('Taste O schliesst sie wieder', (await stand(page)).optionen, false);
  await page.keyboard.press('o');
  pruef('und macht sie wieder auf', (await stand(page)).optionen, true);
  // Genau EINES, nicht keines: die Zeile zaehlt alle fuenf und haelt damit
  // beide Haelften der Zusage fest — kein Stapel, und auch kein Fenster, das
  // beim Wechsel verlorengeht.
  pruef('immer nur ein Grossfenster', [z.inv, z.zauber, z.charakter, z.kessel, z.optionen].filter(Boolean).length, 1);
  pruef('das Band wechselt ohne Schlag', z.schlaege, 0);

  await page.mouse.click(dn.x, dn.y);
  z = await stand(page);
  pruef('Klick daneben raeumt das gewechselte Fenster', [z.kessel, z.charakter], [false, false]);
  pruef('und schlaegt dabei nicht zu', z.schlaege, 0);

  for(const [name, feld, auf] of [
    ['Kessel',       'kessel',  'toggleKessel()'],
    ['Ausweis',      'ausweis', 'toggleAusweis()'],
    ['Karte',        'karte',   'toggleFullmap()'],
    ['Amtsstube',    'amt',     'amtFensterOeffnen()'],
    ['Symbolschloss','schloss', "schlossAuf({code:['a','b','c'], fertig:false})"],
  ]){
    await page.evaluate(q => { window.__schlaege = 0; eval(q); }, auf);
    pruef(`${name} offen`, (await stand(page))[feld], true);
    await page.mouse.click(dn.x, dn.y);
    z = await stand(page);
    pruef(`Klick neben ${name} schliesst`, z[feld], false);
    pruef(`Klick neben ${name} ohne Angriff`, z.schlaege, 0);
  }

  // U8: Zwei Grossfenster gehen nicht mehr uebereinander, ein Grossfenster und
  // ein kleines Panel schon — und dafuer gilt die Esc-Regel unveraendert: eine
  // Ebene je Druck, in der Reihenfolge des Registers (Rucksack vor Schloss).
  await page.evaluate(() => { toggleInventory(); schlossAuf({code:['a','b','c'], fertig:false}); });
  await page.keyboard.press('Escape');
  z = await stand(page);
  pruef('Esc schliesst weiterhin nur eine Ebene', [z.inv, z.schloss], [false, true]);
  await page.keyboard.press('Escape');
  pruef('Esc schliesst dann die zweite', (await stand(page)).schloss, false);

  // U8: Gerollt wird das Rollfeld. Geprueft wird, dass es das ueberhaupt kann
  // (sonst ist der Inhalt abgeschnitten statt erreichbar) und dass Kopf und
  // Reiterband dabei stehenbleiben.
  await page.evaluate(() => {
    toggleInventory();
    // Genug Inhalt, damit ueberhaupt etwas zu rollen da ist. Die Paare kommen
    // aus den echten Tabellen, damit der Lauf nicht an einem erfundenen
    // Zutatennamen scheitert statt an dem, was er misst.
    player.pouch = [];
    Object.keys(ZUTAT_NOUNS).forEach((n, i) => addZutat(n, ZUTAT_ADJ[i % ZUTAT_ADJ.length].a, 1));
    renderInventory();
  });
  await page.waitForTimeout(150);
  const kopf = await page.evaluate(() => {
    const f = document.getElementById('inv');
    const b = f.querySelector('.gfBody');
    b.scrollTop = b.scrollHeight;
    const x = document.getElementById('closeInvBtn').getBoundingClientRect();
    const r = f.getBoundingClientRect();
    return { rollt: b.scrollHeight > b.clientHeight + 4,
             fensterRolltNicht: f.scrollTop === 0 && f.scrollHeight <= f.clientHeight + 1,
             drin: x.top >= r.top - 1 && x.bottom <= r.bottom + 1,
             band: f.querySelectorAll('.gfReiter').length };
  });
  pruef('das Rollfeld des Rucksacks rollt', kopf.rollt, true);
  pruef('das Fenster selbst rollt nicht', kopf.fensterRolltNicht, true);
  pruef('Schliessknopf bleibt beim Scrollen im Bild', kopf.drin, true);
  pruef('das Reiterband bleibt beim Scrollen stehen', kopf.band, 5);
  await page.evaluate(() => toggleInventory());

  pruef('Konsole still (Desktop)', laut, []);
  await ctx.close();
}

// ------------------------------------------------------------------ Touch
//
// AM FINGER GILT SEIT DEM U8-NACHTRAG ETWAS ANDERES ALS AUF DEM SCHIRM, und
// dieser Abschnitt ist die Stelle, an der das nachgerechnet wird.
//
// Bis dahin galten hier dieselben drei Zusagen aus U1 wie oben: der Guertel
// wirkt, der Angriffsknopf wirkt, ein Tipp daneben wischt weg. Auf einem
// Telefon war der Preis dafuer ein Fenster von 300 mal 483 Pixeln — ein
// Drittel der Bildflaeche, in dem drei Zeilen Kopf und eine Kachel standen.
// Der Projektinhaber hat den Tausch ausdruecklich angeordnet: Vollbild, "vor
// mir aus ohne Guertel".
//
// Also wird hier jetzt das GEGENTEIL geprueft, und zwar genauso streng:
//
//   Vollbild      das Fenster fuellt den Schirm wirklich, in beiden Lagen
//   Ausgang       der Schliessknopf ist da, im Daumenmass, und er schliesst
//   Reiterband    der Wechsel von Fenster zu Fenster geht ohne den Guertel
//   Puls          was der zugedeckte Lebensbalken nicht mehr sagen kann,
//                 sagt #schadensPuls — und zwar UEBER dem Fenster und ohne
//                 einen einzigen Griff abzufangen
//
// Was NICHT geprueft wird, weil es am Finger nicht mehr gilt: der Tipp
// daneben. Es gibt kein Daneben mehr. Auf dem Schirm gibt es eines, und dort
// steht die Pruefung unveraendert.
{
  const { page, ctx, laut } = await spiel({ viewport: { width: 390, height: 844 },
                                            deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  await page.evaluate(() => document.body.classList.add('touch'));

  await page.evaluate(() => toggleInventory());
  await page.waitForTimeout(120);
  let z = await stand(page);
  const voll = await page.evaluate(() => {
    const r = document.getElementById('inv').getBoundingClientRect();
    return { l: Math.round(r.left), t: Math.round(r.top),
             b: Math.round(innerWidth - r.right), u: Math.round(innerHeight - r.bottom) };
  });
  pruef('das Fenster fuellt den Schirm', voll, { l: 0, t: 0, b: 0, u: 0 });

  // Der Ausgang. Am Finger der einzige, deshalb beides: Daumenmass und Wirkung.
  const zuKnopf = await page.evaluate(() => {
    const r = document.getElementById('closeInvBtn').getBoundingClientRect();
    return [Math.round(r.width), Math.round(r.height)];
  });
  pruef('der Schliessknopf liegt im Daumenmass', zuKnopf.every(v => v >= 44), true);
  await page.locator('#closeInvBtn').tap();
  z = await stand(page);
  pruef('und schliesst das Fenster', z.inv, false);
  pruef('ohne dabei zuzuschlagen', z.schlaege, 0);

  // Das Band ersetzt den Guertel als Weg von Fenster zu Fenster — der liegt
  // jetzt darunter, also muss es das allein koennen.
  await page.evaluate(() => { window.__schlaege = 0; toggleInventory(); });
  await page.waitForTimeout(120);
  await page.locator('#inv .gfReiter[data-ziel="spellTree"]').tap();
  z = await stand(page);
  pruef('das Band fuehrt in den Zauberbaum', [z.zauber, z.inv], [true, false]);
  pruef('auch ohne Guertel und ohne Schlag', z.schlaege, 0);

  // Der Puls. Er ist am Finger die einzige Anzeige, die ein Vollbildmenue
  // nicht zudeckt, also wird alles daran geprueft, woran er scheitern kann:
  // dass er ueberhaupt aufleuchtet, dass er ueber dem Fenster liegt, dass er
  // wieder verschwindet und dass er keinen Griff abfaengt.
  const puls = await page.evaluate(async () => {
    const e = document.getElementById('schadensPuls');
    const f = document.getElementById('spellTree');
    hurtPlayer(30);
    await new Promise(r => setTimeout(r, 90));
    const hell = +getComputedStyle(e).opacity;
    const drueber = +getComputedStyle(e).zIndex > +getComputedStyle(f).zIndex;
    const durchlaessig = document.elementFromPoint(innerWidth / 2, innerHeight / 2) !== e;
    await new Promise(r => setTimeout(r, 700));
    return { leuchtet: hell > 0.2, drueber, durchlaessig, danachAus: +getComputedStyle(e).opacity === 0 };
  });
  pruef('der Schadenspuls leuchtet auf', puls.leuchtet, true);
  pruef('und liegt ueber dem Vollbildfenster', puls.drueber, true);
  pruef('faengt dabei keinen Griff ab', puls.durchlaessig, true);
  pruef('und ist danach wieder weg', puls.danachAus, true);

  await page.evaluate(() => toggleSpellTree());
  pruef('Konsole still (Touch)', laut, []);
  await ctx.close();
}

// ------------------------------------------------------- U8: kein Querlauf
//
// Ein Grossfenster ist so breit wie sein Platz und keinen Pixel breiter. Das
// ist keine Selbstverstaendlichkeit, sondern eine Zusage, die CSS zweimal
// gebrochen hat:
//
//   1. Ein Rasterfeld steht von Haus aus auf min-width:auto. Eine Kachel mit
//      einem Raster darin (Zauberbaum, Beutel) wird damit so breit, wie ihr
//      Inhalt MINDESTENS braucht — auf 390 Pixeln stand der Zauberbaum 376
//      Pixel breit in einem 294 Pixel breiten Rollfeld.
//   2. Eine Medienregel weiss nichts ueber die Breite eines FENSTERS. Auf
//      einem liegenden Telefon ist der Schirm 844 Pixel breit und das Fenster
//      318; jede Regel, die auf max-width hoert, geht dort daneben.
//
// Beides sah auf dem Entwicklungsschirm richtig aus. Deshalb wird es hier
// gemessen und nicht begutachtet: in vier Formaten, mit gefuellten Fenstern
// (leere Raster laufen nirgends ueber), fuer jedes der vier Grossfenster und
// fuer beide Blaetter des Charakterfensters.
for(const vp of [
  { name: 'Telefon stehend', w: 390, h: 844, touch: true },
  { name: 'Telefon klein',   w: 360, h: 640, touch: true },
  { name: 'Telefon liegend', w: 844, h: 390, touch: true },
  { name: 'Schirm',          w: 1440, h: 900, touch: false },
]){
  const { page, ctx } = await spiel({ viewport: { width: vp.w, height: vp.h },
                                      ...(vp.touch ? { deviceScaleFactor: 2, hasTouch: true, isMobile: true } : {}) });
  if(vp.touch) await page.evaluate(() => document.body.classList.add('touch'));
  // Volle Fenster: ein leeres Raster laeuft nirgends ueber, ein volles schon.
  await page.evaluate(() => {
    player.level = 15; player.skillPoints = 3; player.spellPoints = 2;
    player.zulagenZiehungen = 1; zulagenAngebotSicherstellen();
    player.zulagenKartei = Object.keys(ZULAGE).slice(0, 8)
      .map((f, i) => ({ familie: f, stufe: (i % 3) + 1, angelegt: i < 2 }));
    player.pouch = [];
    Object.keys(ZUTAT_NOUNS).forEach((n, i) => addZutat(n, ZUTAT_ADJ[i % ZUTAT_ADJ.length].a, 1));
    recalc(); updateHUD();
  });
  for(const [was, auf] of [
    ['Charakter, Werte',  'toggleCharakter("werte")'],
    ['Charakter, Mappe',  'toggleCharakter("mappe")'],
    ['Rucksack',          'toggleInventory()'],
    ['Kessel',            'toggleKessel()'],
    ['Zauberbaum',        'toggleSpellTree()'],
    ['Optionen',          'toggleOptionen()'],
  ]){
    await page.evaluate(q => eval(q), auf);
    await page.waitForTimeout(120);
    const m = await page.evaluate(() => {
      const f = [...document.querySelectorAll('.grossFenster')].find(e => getComputedStyle(e).display !== 'none');
      if(!f) return { offen: false };
      const b = f.querySelector('.gfBody'), r = f.getBoundingClientRect();
      return {
        offen: true,
        quer: b.scrollWidth > b.clientWidth + 1,
        ueberRand: [...b.querySelectorAll('*')].filter(e => e.getBoundingClientRect().right > r.right + 1).length,
        imBild: r.left >= -1 && r.right <= innerWidth + 1 && r.top >= -1 && r.bottom <= innerHeight + 1,
        seite: document.documentElement.scrollWidth <= innerWidth + 1,
      };
    });
    pruef(`${vp.name}: ${was} laeuft nicht quer`, [m.offen, m.quer, m.ueberRand, m.imBild, m.seite],
                                                  [true,    false,  0,           true,     true]);
  }
  await ctx.close();
}

await browser.close();
fertig = true;
bericht();
process.exit(fehl ? 1 : 0);
