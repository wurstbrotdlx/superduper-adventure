// Schneidet die in U2 gebrauchten Einzelzellen aus den Cute_Fantasy_UI-Blaettern.
//
//   node tools/ui-zellen.mjs          schreibt nach assets/cf/ui/
//   node tools/ui-zellen.mjs --pruef  schneidet nichts, vergleicht nur
//
// Braucht Playwright (wie die Messlaeufe) und die lizenzierte Rohbibliothek unter
// Graphics/ — beides liegt nicht im Repo, siehe README und CREDITS.md.
//
// WARUM ES DIESES WERKZEUG GIBT
//
// G5 hat vier Zellen von Hand geschnitten und die Koordinaten in
// assets/cf/README.md notiert. Das ging bei vier Zellen. Der Grund fuer das
// Schneiden ueberhaupt steht dort ebenfalls: addSheet()s 'grid'-Modus kennt nur
// rowStart, keinen Spaltenversatz — eine Zelle aus der Mitte eines Blattes
// braucht deshalb eine eigene Datei. Und CSS kann ohnehin keinen Ausschnitt
// adressieren: border-image und background-image nehmen immer die ganze Datei.
//
// Von Hand geschnitten heisst aber: nicht nachpruefbar. Wer wissen will, ob
// ui/btn_pill.png wirklich aus UI_Buttons.png bei (1,17) stammt, muss es glauben.
// Hier steht die Tabelle im Quelltext, und `--pruef` rechnet nach. Das ist
// dieselbe Haltung wie bei tools/sheet-audit.mjs: gemessen, nicht geraten.
//
// WIE DIE KOORDINATEN ENTSTANDEN SIND
//
// Nicht aus dem Rastermass geteilt — die Blaetter sind gemischt gerastert
// (UI_Frames 48er, UI_Buttons 16er, UI_Premade gar nicht) und die Zellen sitzen
// nicht buendig in ihren Kaesten. Gemessen wurde je Zelle per Alpha-Bounding-Box
// ueber ein Fenster, das mit einer Leerspalten-Suche gefunden wurde: eine Spalte,
// in der jedes Pixel alpha=0 hat, trennt zwei Zellen. Wo eine Zelle in einer
// Flaeche sitzt statt frei zu stehen, kam eine Pixelsonde entlang einer Zeile und
// einer Spalte dazu, die die Farben unterscheidet.
//
// Die Sonde ist auch der Grund, warum der Beutel-Slot aus UI_Premade wieder
// rausflog: sie hat den Panel-Grund (228,166,114) in den vier Ecken gefunden,
// aber erst der Einbau hat gezeigt, was das heisst. Siehe die Notiz bei
// slot_dark.png unten — eine gemessene Koordinate ist noch keine passende Zelle.
//
// Der Browser ist hier nur Bilddecoder. Node bringt keinen mit, und ein eigener
// PNG-Leser waere mehr Code als dieses ganze Werkzeug.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// U11: die Wurzel der Rohbibliothek statt eines einzelnen Blattordners. Der
// Trank kommt aus Cute_Fantasy/Icons, alles andere aus Cute_Fantasy_UI/UI —
// seit es zwei Packs sind, traegt jede Zeile ihren Pfad selbst.
const QUELLE = resolve(WURZEL, 'Graphics');
const ZIEL   = resolve(WURZEL, 'assets/cf/ui');
const PRUEF  = process.argv.includes('--pruef');
const UI     = 'Cute_Fantasy_UI/UI';

// [Zieldatei, Quellblatt, x, y, w, h, wofuer]
// Die Reihenfolge ist die des Phasendokuments phase-u2-menuegrafik.md.
const ZELLEN = [
  ['slot_dark.png', `${UI}/UI_Buttons.png`, 129, 17, 14, 14,
   'Beutel-, Ausruestungs-, Zutaten- und Symbolfelder. Abgerundetes Rechteck, '
   + 'dunkle Tonstufe: dunkler Kern, heller Rand. Ohne fill, also bleibt nur '
   + 'der helle Rand und der dunkle Grund des Panels steht weiter unter dem '
   + 'Text.\n'
   + '   Der naheliegende Kandidat war UI_Premade (113,33) 18x18 — das Feld aus '
   + 'der fertigen Beuteltafel des Packs. Er ist verworfen, und zwar nach dem '
   + 'ersten Einbau: dieses Feld ist fuer eine HELLE Tafel gezeichnet. Seine vier '
   + 'abgerundeten Ecken zeigen deren Grund (228,166,114), und auf dem dunklen '
   + 'Panel des Ministeriums leuchten daraus vier lachsfarbene Eckpunkte. '
   + 'Dieselbe Falle steckt in allen UI_Frames-Zellen: helle Kacheln fuer helle '
   + 'Oberflaechen. Was auf dunklem Grund traegt, sind die dunklen Tonstufen der '
   + 'Knopffamilie — die hier.'],

  ['btn_close.png', `${UI}/UI_Buttons.png`, 737, 33, 14, 14,
   'Schliessknopf der Panels. Runde Form mit eingepraegtem X, dieselbe '
   + 'Zellenfamilie wie round_brown.png aus G5 (x=96) — nur die Spaltengruppe '
   + 'mit dem X-Symbol und die Zeile mit der runden Form.\n'
   + '   Von den drei Tonstufen der Gruppe (721 hell, 737 mittel, 753 dunkel) '
   + 'ist es die mittlere, und das ist eine Kontrastentscheidung, keine '
   + 'Geschmacksfrage: das X ist in allen dreien dasselbe blockige Kreuz, aber '
   + 'nur bei 737 steht es braun auf einer breiten cremefarbenen Flaeche. Bei '
   + '721 liegt es fast tongleich auf der Scheibe, bei 753 dunkel auf dunkel. '
   + 'Auf 28px heruntergerechnet las sich 721 als Scheibe ohne Zeichen.'],

  ['btn_pill.png', `${UI}/UI_Buttons.png`, 1, 17, 30, 14,
   'Breite Knoepfe: Kessel-Kochknopf, Overlay-Knoepfe, Steigern-Knoepfe. '
   + 'Abgerundetes Rechteck, Tonstufe hell. Waagerecht dehnbar, weil die Mitte '
   + 'flach ist (border-image 5 7 6 7 fill).'],

  ['sel_white.png', `${UI}/UI_Selectors.png`, 11, 10, 26, 28,
   'Auswahlrahmen (gestrichelt) fuer das ausgeruestete Teil und den aktiven '
   + 'Zauber. Ersetzt den blauen CSS-Rand, der aus keiner Grafik stammte.'],

  // -------------------------------------------------------------------
  // U11 — die Sinnbilder der Bedienknoepfe.
  //
  // Bis U11 trugen sie System-Emoji: Apples glaenzende Farbgrafik auf
  // Pixelkunst, am Finger bei 22 bis 31 Pixeln. U10 hat die KNOPFFORM in
  // Ordnung gebracht und den Stilbruch dadurch nur deutlicher gemacht.
  //
  // Alle acht sind 16x16 und werden auf ein ganzzahliges Vielfaches
  // gezeichnet (16 am Schirm, 32 am Finger, 48 auf dem Schlagknopf) — dieselbe
  // Rechnung wie bei den Rundknoepfen in U10, aus demselben Grund.
  //
  // Zur Auswahl: sie ist gemessen worden, wo es etwas zu messen gab, und
  // sonst gesehen. tools/ui-icon-kontaktbogen.mjs stellt jeden Kandidaten auf
  // das echte Achteck in der echten Anzeigegroesse, und genau dort sind zwei
  // naheliegende Zellen durchgefallen: die duennen Zielkreuze aus den ersten
  // Zeilen von UI_Crosshairs (weisse Einzelpunkte, die auf dem hellen Achteck
  // zu Streuseln zerfallen) und der Rucksack in seiner zweiten, flacheren
  // Fassung bei x=160.
  // -------------------------------------------------------------------

  ['ico_schlag.png', `${UI}/UI_Icons.png`, 112, 16, 16, 16,
   'Schlagknopf. Gekreuzte Klingen — die eindeutigste Silhouette des ganzen '
   + 'Blattes und auf 48 Pixeln noch als zwei Klingen zu lesen. Das einzelne '
   + 'Schwert bei x=16 ist die naheliegende Alternative und faellt aus einem '
   + 'Grund weg, der nichts mit Geschmack zu tun hat: es steht schraeg und '
   + 'fuellt die Zelle diagonal, also wirkt es auf dem Achteck kleiner als die '
   + 'Kreuzform, obwohl es dieselben 16 Pixel hat.'],

  ['ico_trank.png', 'Cute_Fantasy/Icons/No Outline/Food_Icons_NO_Outline.png', 112, 128, 16, 16,
   'Trankknopf. Die einzige Zelle dieser Auswahl, die nicht aus dem UI-Pack '
   + 'stammt: UI_Icons.png hat Herz, Muenze, Blitz und Schild, aber keine '
   + 'Flasche. Diese hier ist der Rundkolben mit Korken aus den Speise-Icons '
   + 'des Hauptpacks.\n'
   + '   Ausdruecklich die Fassung OHNE Outline, obwohl der Ordner "No Outline" '
   + 'heisst: die traegt naemlich denselben DUNKLEN Rand wie alle UI_Icons, '
   + 'waehrend die Fassung im Ordner "Outline" einen zusaetzlichen CREMEFARBENEN '
   + 'Rand darum legt. Auf dem hellen Achteck verschwaende der, und im selben '
   + 'Fenster stuenden zwei verschiedene Randfarben nebeneinander.'],

  ['ico_zauber.png', `${UI}/UI_Icons.png`, 144, 48, 16, 16,
   'Zauberbaum. Blauer Stern. Der goldene Stern bei (48,0) waere der '
   + 'naheliegende, und er ist verworfen: genau dieses Zeichen brennt als '
   + 'Sternchen an den Knoepfen, sobald es freie Punkte oder eine offene '
   + 'Vorlage gibt (#spBadge, #skillBadge). Ein goldener Stern IM Knopf und '
   + 'ein goldener Sternchen AM Knopf sind zwei Auskuenfte in einem Zeichen.'],

  ['ico_rucksack.png', `${UI}/UI_Icons.png`, 144, 32, 16, 16,
   'Rucksack. Braun auf hellbraunem Achteck ist der schwaechste Kontrast '
   + 'dieser Auswahl, und die Zelle traegt ihn trotzdem: der dunkle Rand haelt '
   + 'die Form, und ein Rucksack ist nun einmal braun. Die zweite Fassung bei '
   + 'x=160 ist flacher gezeichnet und faellt auf dem Achteck weiter ab.'],

  ['ico_charakter.png', `${UI}/UI_Icons.png`, 192, 16, 16, 16,
   'Charakterfenster. Ein rotes Buch, keine Figur — und das ist eine '
   + 'Entscheidung ueber die Welt und nicht ueber die Grafik. Im Pack gibt es '
   + 'ueberhaupt keine Personen-Zelle, und in diesem Haus waere sie auch die '
   + 'falsche: hinter dem Knopf stehen Lichtbild, Amtsbezeichnung, Befaehigung '
   + 'und Ausruestung, also die Personalakte. Rot, weil es der hoechste '
   + 'Kontrast gegen das Achteck ist; die blaue Fassung bei x=160 liest sich '
   + 'daneben als Zauberbuch.'],

  ['ico_ziel.png', `${UI}/UI_Crosshairs.png`, 0, 128, 16, 16,
   'Zielwahl. Vier Dreiecke, die nach innen auf eine Mitte zeigen. Die '
   + 'Zielkreuze aus den ersten Zeilen desselben Blattes sind durchgefallen: '
   + 'sie bestehen aus einzelnen weissen Punkten, und auf dem hellen Achteck '
   + 'zerfallen die zu Streuseln statt zu einem Fadenkreuz. Diese Zeile ist '
   + 'die einzige mit geschlossenen Flaechen.'],

  ['ico_sperre.png', `${UI}/UI_Icons.png`, 208, 80, 16, 16,
   'Gesperrter Zauber, gesperrtes Ultimate. Ein rotes Verbotsschild statt '
   + 'eines Schlosses — das Pack hat kein Schloss, und das Schild ist hier '
   + 'ohnehin das richtigere Zeichen: gesperrt ist der Zauber nicht durch ein '
   + 'Schloss, sondern durch die fehlende Zauberbefugnis (Z2).'],

  ['ico_hand.png', `${UI}/UI_Icons.png`, 48, 224, 16, 16,
   'Kontextknopf ("Ansprechen", "Hebel", "Oeffnen"). Die Zeigehand aus der '
   + 'Mauszeiger-Zeile — das Blatt hat keine andere Hand, und diese ist die '
   + 'richtige: der Knopf heisst "hier anfassen". Weiss, weil sie als einzige '
   + 'des Satzes nicht auf dem hellen Achteck sitzt, sondern auf der dunklen '
   + 'Pille des Kontextknopfes.'],

  ['ico_abbruch.png', `${UI}/UI_Icons.png`, 176, 80, 16, 16,
   'Kammer verlassen. Rotes Kreuz. Die weisse Fahne, die es ersetzt, gibt es '
   + 'im Pack nicht, und ein Abbruch ist ohnehin kein Aufgeben.'],
];

if(!existsSync(QUELLE)){
  console.error(`Rohbibliothek fehlt: ${QUELLE}`);
  console.error('Cute_Fantasy und Cute_Fantasy_UI aus der eigenen Lizenz nach Graphics/ legen (s. README).');
  process.exit(1);
}

const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const browser = await pw.chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage();

let abweichungen = 0;
for(const [ziel, blatt, x, y, w, h, wofuer] of ZELLEN){
  const quellPfad = resolve(QUELLE, blatt);
  if(!existsSync(quellPfad)){ console.error(`fehlt: ${blatt}`); abweichungen++; continue; }

  const dataUrl = 'data:image/png;base64,' + readFileSync(quellPfad).toString('base64');
  const roh = await page.evaluate(async ({dataUrl, x, y, w, h}) => {
    const img = new Image();
    await new Promise((ok, weg) => { img.onload = ok; img.onerror = weg; img.src = dataUrl; });
    if(x + w > img.width || y + h > img.height)
      return {fehler: `Ausschnitt ${x},${y},${w},${h} liegt ausserhalb von ${img.width}x${img.height}`};
    const cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    const c = cv.getContext('2d');
    c.imageSmoothingEnabled = false;
    c.drawImage(img, x, y, w, h, 0, 0, w, h);
    // Deckungsgrad mitmelden: eine versehentlich leere oder randlose Zelle faellt
    // sonst erst im Spiel auf, und dort als "die Grafik ist irgendwie weg".
    const d = c.getImageData(0, 0, w, h).data;
    let deckung = 0;
    for(let i = 3; i < d.length; i += 4) if(d[i] > 0) deckung++;
    return {png: cv.toDataURL('image/png'), deckung: deckung / (w * h)};
  }, {dataUrl, x, y, w, h});

  if(roh.fehler){ console.error(`${ziel}: ${roh.fehler}`); abweichungen++; continue; }
  if(roh.deckung < 0.10){
    console.error(`${ziel}: nur ${(roh.deckung*100).toFixed(0)}% der Zelle ist deckend — Koordinate pruefen`);
    abweichungen++; continue;
  }

  const bytes = Buffer.from(roh.png.split(',')[1], 'base64');
  const zielPfad = resolve(ZIEL, ziel);
  const alt = existsSync(zielPfad) ? readFileSync(zielPfad) : null;
  const gleich = alt && alt.equals(bytes);

  if(PRUEF){
    if(!alt){ console.error(`${ziel}: fehlt in assets/cf/ui/`); abweichungen++; }
    else if(!gleich){ console.error(`${ziel}: weicht vom Schnitt ab`); abweichungen++; }
    else console.log(`ok    ${ziel.padEnd(16)} ${blatt.split('/').pop()} (${x},${y}) ${w}x${h}, ${(roh.deckung*100).toFixed(0)}% deckend`);
    continue;
  }

  mkdirSync(ZIEL, {recursive: true});
  writeFileSync(zielPfad, bytes);
  console.log(`${gleich ? 'gleich' : 'neu   '} ${ziel.padEnd(16)} ${blatt.split('/').pop()} (${x},${y}) ${w}x${h}, `
            + `${(roh.deckung*100).toFixed(0)}% deckend, ${bytes.length} B`);
  console.log(`       ${wofuer.replace(/\s+/g, ' ')}`);
}

await browser.close();

if(abweichungen){
  console.error(`\n${abweichungen} Abweichung(en).`);
  process.exit(1);
}
console.log(`\n${ZELLEN.length} Zellen ${PRUEF ? 'geprueft' : 'geschnitten'}.`);
