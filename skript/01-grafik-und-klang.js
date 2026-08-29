// skript/01-grafik-und-klang.js - Teil 1 von 7 des einen Spielskripts.
// Inhalt: Massstab, Sprite-Engine, Held und Garderobe, Rigs, Deko, Innenraumblaetter, Portraets, Audio, Welt-Startwert.
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
// 'use strict' steht hier als erste Anweisung des Schnitts selbst: es war die
// erste Zeile des alten Blocks.
// --- Ab hier unveraendert aus index.html geschnitten (Teilung vom 29.08.2026). ---
'use strict';

const TS = 32, MW = 320, MH = 320;   // W-Groß: Kante x4 (80 -> 320), Fläche x16

// === G7 Maßstab: EIN Vergrößerungsfaktor für die ganze Welt =================
// Die Cute-Fantasy-Bibliothek ist durchgehend 16-Pixel-Kunst: eine Bodenkachel
// misst 16x16, ein Haus 96x128 (also 6x8 Kacheln), ein Palisadenpfahl 16x32.
// Der Bodenbacker rechnet das seit G4 um (bakeTile/bakeDunTile ziehen 16 Quell-
// pixel auf TS), und G1 zeichnet Tore, Druckplatten und Treppen ebenfalls mit 2.
// Damit steht der Faktor fest: TS/16. Wer ein Objekt aus dieser Bibliothek in
// die Welt stellt, nimmt WELT_SC, sonst passt es nicht zum Boden, auf dem es
// steht — genau das war der Befund, der G7 ausgelöst hat (Häuser halb so groß
// wie der Boden unter ihnen, Bäume kniehoch neben dem Helden).
//
// NICHT betroffen sind die Figuren: PLAYER_SC (1,8), NPC_SC und die sc/psc-Werte
// in MONDEF sind in G2/G3 und im Monsterkatalog M1 gegeneinander geeicht worden
// und tragen die Kampfwahrnehmung. Sie liegen dicht an WELT_SC (der Held ist mit
// 1,8 rund zehn Prozent unter der Bibliotheksgröße), und diese zehn Prozent sind
// eine gewachsene Entscheidung, kein Fehler. G7 fasst sie deshalb nicht an.
const WELT_SC = TS / 16;

// Ein Ort für die Biombänder. Ersetzt acht Kopien der Literale 26/54 plus drei
// abweichende Randtabellen (W-Groß, Umsetzungsnotizen). Proportionen exakt wie
// beim alten MH=80 (Schneegrenze 25, Sandgrenze 55), nur an MH gekoppelt statt
// fest verdrahtet — eine Kartenvergrößerung muss hier nichts anfassen.
// Monsterkatalog M1: aus drei Bändern werden fünf. Der Katalog verlangt Wald,
// Sumpf, Wüste, Höhle und Ruine; Höhle ist kein Band, sondern die Kammer (s.
// KAM_WAECHTER weiter unten), die anderen vier liegen als Streifen auf der Karte.
// Die Reihenfolge ist kein Zufall, sondern die Schwierigkeitskurve: das Dorf
// liegt in der Kartenmitte im Wald, und mit jedem Schritt nach Süden (Sumpf,
// Wüste) oder nach Norden (Eisablage, Altbestand) steigt die Sollstufe. Wer
// nicht weiß, wo er ist, sieht es am Boden.
//
//   Zeile 0                                    Der Altbestand   (Sollstufe 8-10)
//         64                                   Die Eisablage    (unverändert)
//        128   <- Dorf bei Zeile 153 bis 167   Ablage A, Wald   (Sollstufe 1-3)
//        192                                   Die Nassablage   (Sollstufe 3-5)
//        240 bis 319                           Der Brandabschnitt (Sollstufe 4-7)
const RUIN_Y1  = Math.round(MH * 0.20) - 1;    // 63  bei MH=320
const SNOW_Y1  = Math.round(MH * 0.40) - 1;    // 127
const GRAS_Y1  = Math.round(MH * 0.60) - 1;    // 191, Dorfband
const SUMPF_Y1 = Math.round(MH * 0.75) - 1;    // 239
const SAND_Y0  = SUMPF_Y1 + 1;                 // 240
const BIOME_BANDS = [
  {key:'ruine', y0:0,          y1:RUIN_Y1},
  {key:'snow',  y0:RUIN_Y1+1,  y1:SNOW_Y1},
  {key:'grass', y0:SNOW_Y1+1,  y1:GRAS_Y1},
  {key:'sumpf', y0:GRAS_Y1+1,  y1:SUMPF_Y1},
  {key:'sand',  y0:SAND_Y0,    y1:MH-1},
];
// Zeile -> Band als Tabelle statt als Ternärkette: biomeAtT läuft im Kartenbau
// über 102400 Zellen und zusätzlich im Frame-Pfad (Zonenanzeige, Wetter,
// Zutaten-Biom). Fünf Bänder wären als Kette fünf Vergleiche, hier ist es
// ein Feldzugriff. Die Tabelle wird aus BIOME_BANDS gebaut, nie von Hand, die
// einzige Kartenwahrheit bleibt BIOME_BANDS (s. auftragAssertBrett, Punkt 0b).
const BAND_KEYS = BIOME_BANDS.map(b => b.key);
const BAND_VON_ZEILE = new Uint8Array(MH);
for(let i = 0; i < BIOME_BANDS.length; i++)
  for(let y = BIOME_BANDS[i].y0; y <= BIOME_BANDS[i].y1; y++) BAND_VON_ZEILE[y] = i;
const biomeAtT  = ty => BAND_KEYS[BAND_VON_ZEILE[(ty < 0 ? 0 : (ty >= MH ? MH-1 : ty)) | 0]];
const biomeAtPx = y  => biomeAtT(Math.floor(y / TS));
// Zeilenbereich eines Biombands, eingerückt nur an der ÄUSSEREN Weltkante (y=0
// bzw. y=MH-1) — genau das Muster, das auftragOrtBand() bisher von Hand trug
// ([4,25] Schnee / [26,54] Gras / [55,MH-5] Sand): Gras berührt keine Weltkante
// und bleibt unverändert, Schnee/Sand rücken am Kartenrand ab. Bewusst NICHT
// symmetrisch eingerückt — die innere Bandgrenze bleibt exakt, weil sie schon
// die Biomgrenze ist.
const bandRange = (key, edgeInset) => {
  const b = BIOME_BANDS.find(z => z.key === key);
  const y0 = b.y0 === 0    ? b.y0 + edgeInset : b.y0;
  const y1 = b.y1 === MH-1 ? b.y1 - edgeInset : b.y1;
  return [y0, y1];
};
// Kammertür-Bänder: eigene, ungleiche Einrückung je Seite (aus den bisherigen
// Handwerten [4,24]/[28,52]/[56,76] zurückgerechnet), NICHT das Edge-Muster
// von bandRange() — Türen halten überall Abstand zur Biomgrenze, nicht nur
// zum Kartenrand, damit ein Tür-Vordergrund nie im Nachbarbiom steht.
const TUER_BAND_INSET = {ruine:[4,1], snow:[2,2], grass:[2,2], sumpf:[2,2], sand:[1,3]};   // [oben, unten]
const tuerBandRange = key => {
  const b = BIOME_BANDS.find(z => z.key === key), [top, bot] = TUER_BAND_INSET[key];
  return [b.y0 + top, b.y1 - bot];
};

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d', {alpha: false}); // Performance!

// Boden- und Minimap-Cache: siehe computeTile()/bakeChunk()/bakeMinimap() weiter
// unten, direkt bei refreshFloor(). Bis W-Groß gab es hier ein einziges
// MW*TS-Quadrat-Canvas ("floorCanvas") — bei Kante x4 wären das 10240x10240px
// (~419MB), über dem Canvas-Limit von Safari/iOS. Ersetzt durch einen Chunk-
// Cache (256x256px-Kacheln), der nur das Sichtfenster hält.

// ===========================================================================
//  Sprite-Engine — Cute Fantasy (Kenmi, itch.io) seit G5 ausnahmslos. Bis G4
//  liefen Held/Gegner/Welt schrittweise um (siehe Umsetzungsnotizen G0-G4 in
//  superduper-grafik-prompt.md), G5 hat die letzten zwei Sunnyside-Sheets
//  (glint/alert) sowie den nur dafür gebrauchten 'char'-Lademodus abgelöst.
// ===========================================================================
const ASSETS = 'assets/';
// Cute-Fantasy-Frisuren (Phase G2): 6 Style x 1 Farbe, damit die Zufallsvielfalt
// der 6 Sunnyside-Frisuren erhalten bleibt, ohne alle 30 Style/Farb-Kombis zu laden.
// P1: art ist die Lesart der Frisur, nicht die Wahrheit über die Person. Sie
// entscheidet allein, welche Gestalten der Einstellungsvordruck beim Schichtantritt
// noch zur Auswahl stellt (siehe GESTALT_WAHL unten). Vergeben ist sie an der
// Silhouette der sechs Blätter, gegen die echten PNGs angesehen und nicht aus dem
// Dateinamen geraten: 1 Kurzhaarschnitt, 2 kurze Tolle, 3 Undercut, 4 langer
// Seitenscheitel, 5 langes offenes Haar, 6 hochgesteckter Knoten. Wer eine Zuordnung
// anders liest, ändert genau einen Buchstaben in dieser Tabelle; gestaltAssert()
// unten hält nur fest, dass beide Lesarten überhaupt besetzt bleiben.
const CF_HAIR = [
  {key:'h1', file:'Head/Hair_1/Hair_1_Brown.png',  art:'m'},
  {key:'h2', file:'Head/Hair_2/Hair_2_Blonde.png', art:'m'},
  {key:'h3', file:'Head/Hair_3/Hair_3_Black.png',  art:'m'},
  {key:'h4', file:'Head/Hair_4/Hair_4_Ginger.png', art:'w'},
  {key:'h5', file:'Head/Hair_5/Hair_5_Grey.png',   art:'w'},
  {key:'h6', file:'Head/Hair_6/Hair_6_Brown.png',  art:'w'},
];
const HAIRS = CF_HAIR.map(h => h.key);

// P1: Die Haarfarben des Außendienstes. Sie stehen bewusst neben den fünf
// Naturtönen des Pakets und nicht in ihrer Reihe: der Spieler soll sich auf einem
// vollen Dorfplatz und in einer Horde in einem Blick selbst finden. Das Blatt wird
// dafür nicht ausgetauscht (das Grafikpaket hat diese Farben nicht), sondern
// umgefärbt, siehe farbBlatt() weiter unten.
// Die Namen sind Bürobedarf. Das ist kein Gag am Rand: das Haus benennt nichts
// nach dem, wonach es aussieht, sondern nach dem, wo es herkommt.
const CF_HAARTON = [
  {key:'warn',   name:'Warnorange',        hex:'#ff7a18'},
  {key:'sirene', name:'Sirenenrot',        hex:'#ff2d55'},
  {key:'durch',  name:'Durchschlagrosa',   hex:'#ff3ecb'},
  {key:'deckel', name:'Aktendeckelviolett',hex:'#a855f7'},
  {key:'stempel',name:'Stempelblau',       hex:'#2f7bff'},
  {key:'kanzlei',name:'Kanzleitürkis',     hex:'#16e0d8'},
  {key:'ablage', name:'Ablagegrün',        hex:'#39e13a'},
  {key:'marker', name:'Leuchtmarkergelb',  hex:'#d8ff1f'},   // ins Grüne gezogen: reines Gelb käme Blond zu nahe
];
const HAARTOENE = CF_HAARTON.map(t => t.key);
const haarTonDef = key => CF_HAARTON.find(t => t.key === key) || CF_HAARTON[0];
const haarHex = key => haarTonDef(key).hex;

// P1: Die drei Antworten auf die einzige Frage, die der Einstellungsvordruck dem
// Spieler stellt. 'egal' ist der Auslieferungszustand und steht deshalb zuletzt:
// wer nichts angibt, hat nichts abgewählt.
const GESTALT_WAHL = [
  {key:'m',    kurz:'männlich',  feld:'männlich gelesen'},
  {key:'w',    kurz:'weiblich',  feld:'weiblich gelesen'},
  {key:'egal', kurz:'darauf lege ich keinen Wert', feld:'ohne Angabe'},
];
const GESTALT_STD = 'egal';
const gestaltDef = k => GESTALT_WAHL.find(g => g.key === k) || GESTALT_WAHL[GESTALT_WAHL.length - 1];
// Die Frisuren, die zu einer Wahl passen. Läuft eine Lesart leer, weil jemand
// CF_HAIR umgeschrieben hat, fällt sie auf alle zurück statt auf nichts: eine
// Schicht ohne Kopf wäre ein Fehler, keine Aussage. gestaltAssert() meldet es.
function haareNach(wahl){
  if(wahl !== 'm' && wahl !== 'w') return HAIRS;
  const l = CF_HAIR.filter(h => h.art === wahl).map(h => h.key);
  return l.length ? l : HAIRS;
}

// Einzeldatei-Build: `node tools/build-single.mjs` ersetzt genau die nächste Zeile
// durch eine Tabelle Pfad -> data:-URI und schreibt das Ergebnis nach dist/.
// Im Quellbaum bleibt sie null, dann lädt das Spiel wie bisher aus assets/.
// Grund: Cute Fantasy darf nicht als Dateisammlung weitergegeben werden, wohl aber
// im fertigen Spiel stecken — der Build ist ein Spiel, kein Asset-Paket.
const ASSET_BLOBS = null; /*BUILD:ASSET_BLOBS*/

const SHEETS = {};                 // key -> {img, cols, n, fw, fh, ax, ay}
const SHEET_LIST = [];             // [key, url, n, mode]
let assetsReady = false, assetsLoaded = 0;

// mode: 'strip' = n Frames nebeneinander, Anker Fußmitte | 'raw' = ein Bild,
//       Anker oben links | 'grid' = festes fw/fh aus opt, freier Anker
//       (Cute-Fantasy-Dungeon-/Rig-/UI-Sheets). Jeder Aufruf übergibt seinen
//       Modus explizit (G5: der 'char'-Fallback für Sunnyside-Charaktersheets
//       ist mit den letzten zwei Sheets entfallen).
function addSheet(key, path, n, mode, opt){ SHEET_LIST.push([key, ASSETS + path, n, mode, opt]); }

// ===========================================================================
//  Held: Cute-Fantasy-Player-System (Phase G2). Player_Base + 130 Ausrüstungs-
//  Layer teilen sich EIN 9x56-Raster à 64x64 (per Alpha-Bounding-Box-Analyse
//  gegen die echten PNGs verifiziert, nicht aus dem G0-Manifest übernommen —
//  die Heuristik tippt bei Animationssheets daneben, siehe G1-Lektion).
//
//  Row-Zuordnung (Regressionsregel 7: hart im Code, nie aus Dateinamen):
//    idle=1, walk=9, run=45  echte Seitenreihen (mittlere von je 3 Richtungs-
//    zeilen down/side/up, am Kopfprofil erkannt, gegen 6 Vergrößerungen geprüft).
//    attack=18, cast=24, hurt=15: der Player-Rig ist ein Farming-Sim-Rig ohne
//    Kampfanimation — im ganzen 56-Zeilen-Blatt existiert kein Hieb-, Zauber-,
//    Treffer- oder Sterbe-Frame (nur Idle/Walk/Run/Sprung/Rolle/Werkzeug-Idles).
//    Ersatzregel (dokumentiert, nicht stillschweigend improvisiert):
//      attack nutzt die Seitenreihe der Rolle (18) — einzige Zeile mit echtem
//        Armausschlag; der reale Treffereindruck kommt ohnehin vom Klingenbogen
//        in drawPlayer(), der unabhängig vom Body-Frame gezeichnet wird.
//      cast nutzt die kleine 5-Frame-Gestenreihe (24) — Zauberwirkung kommt vom
//        Partikel-/Projektil-Effekt, nicht vom Körper-Sprite.
//      hurt nutzt die einzige echte Stolper-/Rückweich-Bewegung im Blatt (15,
//        nur eine Richtung vorhanden — gilt für beide Blickrichtungen).
//      death hat keine eigene Zeile: showDead() blendet synchron mit hp<=0 auf
//        den Overlay um, der Held ist im Death-Frame praktisch nie sichtbar;
//        death teilt sich deshalb die hurt-Zeile (Cast/Hurt/Death laufen ohnehin
//        nicht-loopend und klemmen aufs letzte Frame).
const CF_HERO_ANIMS = [
  ['idle', 1, 6], ['run', 45, 9],
  ['attack', 18, 8], ['cast', 24, 5], ['hurt', 15, 4],
];
const CF_ANCHOR = {ax:32, ay:40};             // Fußlinie, per Bounding-Box gegen alle Anim-Reihen geprüft (botY≈40)
function addCfHeroLayer(prefix, file, optional){
  for(const [anim, row, n] of CF_HERO_ANIMS)
    addSheet(`${prefix}_${anim}`, `cf/player/${file}`, n, 'grid', {fw:64, fh:64, ax:CF_ANCHOR.ax, ay:CF_ANCHOR.ay, rowStart:row, optional});
}
addCfHeroLayer('cfbody', 'Player_Base/Player_Base_animations.png');
addCfHeroLayer('cfhands', 'Hands/Hands_1_Bare.png');
for(const h of CF_HAIR) addCfHeroLayer(`cfhair_${h.key}`, h.file);

// Rüstungs-Slot (5 Qualitätsstufen aus CRAFT_BASE.armor) -> Chest+Legs-Datei.
// Blau/Grün/Braun bewusst amtlich-nüchtern gewählt, Plate-Varianten ab Stufe 3.
const CF_ARMOR_FILES = [
  {chest:'Chest/OG_Shirt/Shirt_1_Red.png',              legs:'Legs/OG_Pants/Pants_1_Red.png'},
  {chest:'Chest/Farmer_Shirt/Farmer_Shirt_1_Green.png', legs:'Legs/Farmer_Pants/Farmer_Pants_1_Green.png'},
  {chest:'Chest/Royal_Shirt/Royal_Shirt_1_Blue.png',    legs:'Legs/Royal_Pants/Royal_Pants_1_Blue.png'},
  {chest:'Chest/Plate_Chest/Plate_Chest_Iron.png',      legs:'Legs/Plate_Legs/Plate_Legs_Iron.png'},
  {chest:'Chest/Plate_Chest/Plate_Chest_Gold.png',      legs:'Legs/Plate_Legs/Plate_Legs_Gold.png'},
];
CF_ARMOR_FILES.forEach((t, i) => { addCfHeroLayer(`cfchest_${i}`, t.chest); addCfHeroLayer(`cflegs_${i}`, t.legs); });

// Stiefel-Slot (5 Qualitätsstufen aus CRAFT_BASE.boots) -> Feet-Farbe. Braun/Weiß
// verschwanden am winzigen Chibi-Fuß gegen Hautton bzw. Schatten-Ellipse (per
// Nahaufnahme geprüft) — Orange/Pink ersetzen sie, Sichtbarkeit vor Farbthema.
const CF_BOOT_FILES = [
  'Feet/Shoes_1_Orange.png', 'Feet/Shoes_1_Black.png', 'Feet/Shoes_1_Blue.png',
  'Feet/Shoes_1_Purple.png', 'Feet/Shoes_1_Pink.png',
];
CF_BOOT_FILES.forEach((f, i) => addCfHeroLayer(`cffeet_${i}`, f));

// ===========================================================================
//  G9: Die Garderobe der Dorffiguren.
//
//  Bis G8 drückte eine Dorffigur ihre Kleidung als Rüstungsstufe aus:
//  gestalt.chest war 0 bis 4, dieselben Keys, die am Spieler an CRAFT_BASE.armor
//  hängen. Das war nie gemeint, es war nur das, was dalag — und es hat sich
//  gerächt. Vorblatt trug einen goldenen Plattenpanzer, weil „Mantel" in diesem
//  Vokabular nicht vorkam. Eine Registratorin in Stufe 2 zu kleiden sagt über
//  ihr Kleid nichts aus.
//
//  Die Garderobe ersetzt die Stufe durch den Namen des Kleidungsstücks. Der
//  Spieler behält seine fünf Stufen unangetastet (CF_ARMOR_FILES oben, das ist
//  seine Ausrüstung und keine Garderobe); die Figuren bekommen ihre eigene.
//
//  Was hier steht, ist an `assets/cf/manifest.json` abgelesen und nicht geraten.
//  Das Pack liefert fünf Hemdformen, vier Hosenformen, neun Schuhfarben, sechs
//  Frisuren in je fünf Naturtönen und — bis G9 ungenutzt — eine Kopfbedeckung
//  und zwei Helme. Alle liegen auf demselben 9x56-Raster à 64x64 wie
//  Player_Base, sind also Drop-ins für addCfHeroLayer().
//
//  Je Form steht genau EINE Datei. Das ist kein Sparen, sondern eine Folge der
//  Rechnung in farbBlatt(): sie normiert die Helligkeitsspanne des Blattes auf
//  ein Band um die Zielfarbe und legt deren Farbton und Sättigung auf jeden
//  Pixel. Der Farbton der Quelle überlebt das nicht. Ob wir von
//  Lumberjack_Shirt_1_Green oder _Red ausgehen, ändert am Ergebnis nichts —
//  dieselbe Zeichnung, dieselbe Helligkeitsverteilung. Die Farbvarianten des
//  Packs sind für uns Dubletten; die Form ist die Auswahl.
//
//  Die Namen sind deutsch und beschreiben das Kleidungsstück, nicht die Datei:
//  wer hier eine Figur einkleidet, soll ihr Porträt ansehen und nicht das
//  Grafikpaket.
// ===========================================================================
const CF_GARDEROBE = {
  hemd: {
    hemd:   'Chest/OG_Shirt/Shirt_1_Red.png',                           // schlicht, offener Kragen
    kittel: 'Chest/Farmer_Shirt/Farmer_Shirt_1_Green.png',              // Arbeitskittel mit Trägern
    karo:   'Chest/Lumberjack_Shirt/Lumberjack_Shirt_1_Green.png',      // G9 neu: offenes Arbeitshemd
    hof:    'Chest/Royal_Shirt/Royal_Shirt_1_Blue.png',                 // hoher Kragen, Borte
    panzer: 'Chest/Plate_Chest/Plate_Chest_Iron.png',                   // trägt im Dorf niemand, steht der Vollständigkeit halber
  },
  hose: {
    hose:   'Legs/OG_Pants/Pants_1_Red.png',
    latz:   'Legs/Farmer_Pants/Farmer_Pants_1_Green.png',
    hof:    'Legs/Royal_Pants/Royal_Pants_1_Blue.png',
    panzer: 'Legs/Plate_Legs/Plate_Legs_Iron.png',
  },
  // Schwarz statt Orange als einzige Schuhform: im Dorf ist Sichtbarkeit kein
  // Argument (die fünf Spielerfarben stehen weiter oben und bleiben), und wer
  // eine andere Farbe will, gibt schuhFarbe an.
  schuh: {
    schuh: 'Feet/Shoes_1_Black.png',
  },
  // G9 neu. Farmer_Hat_1 ist die einzige echte Kopfbedeckung des Packs; die
  // beiden Helme sind Rüstung und stehen hier nur, damit niemand sie noch
  // einmal suchen muss. Der Hut wird NACH dem Haar gezeichnet und deckt es zu —
  // genau das, was Trepps und Nieselbecks Porträt zeigt.
  hut: {
    muetze:     'Accessories/Farmer_Hat_1.png',
    helm:       'Head/Plate_Helmet_1/Plate_Helmet_1_Iron.png',
    helmSchwer: 'Head/Plate_Helmet_2/Heavy_Plate_Helmet_1_Iron.png',
  },
};
// G9-Nachtrag: Was gezeichnet wird, wenn eine Form nicht im Grafikpaket liegt.
//
// Der Fund, der diesen Nachtrag erzwungen hat: G9 hat die Garderobe an vier
// Dateien gehaengt, die nie nach assets/cf/player/ kopiert wurden — das
// Karohemd, die Muetze und die beiden Helme. Sie standen seither als vier
// `Sprite fehlt`-Gruppen in jeder Konsole, und dahinter steckte kein Rauschen,
// sondern Wirt Fass und Herr Lott ohne Hemd: blitFarbFrame() kehrt bei einem
// fehlenden Key still um, uebrig blieb der nackte Koerper aus hautBlatt().
// Dieselbe Sorte Fund wie die fuenf unsichtbaren Dorffiguren aus G6, und
// derselbe Weg heraus: eine erwartete Luecke ist keine Warnung, sie bekommt
// einen Ersatz und eine Zeile, die sagt, was Sache ist.
//
// Ersetzt wird nur, wo der Ersatz die Figur nicht verfaelscht. Fuers Karohemd
// ist das `hemd` (schlicht, offener Kragen): dieselbe Silhouette, und die Farbe
// kommt ohnehin aus farbBlatt() und nicht aus der Datei. Fuer die Muetze gibt es
// keinen — das Pack hat genau eine Kopfbedeckung, und ein Helm auf dem Zusteller
// waere eine andere Figur. Wer die Muetze fehlt, steht mit Haar da, also so wie
// vor G9. Die beiden Helme traegt niemand; sie stehen in der Garderobe, damit
// sie niemand noch einmal sucht.
const CF_GARDEROBE_ERSATZ = {
  hemd: {karo: 'hemd'},
  hose: {},
  schuh: {},
  hut:  {},
};
// optional:true, weil sie fehlen duerfen: garderobeBlatt() hat den Ersatzweg und
// garderobeAssert() meldet gesammelt, was fehlt und wen es trifft.
for(const slot in CF_GARDEROBE)
  for(const form in CF_GARDEROBE[slot])
    addCfHeroLayer(`cf${slot}_${form}`, CF_GARDEROBE[slot][form], true);

// Welches Blatt eine Garderobenform wirklich bekommt: das eigene, sonst das des
// Ersatzes, sonst keins. Rein und ohne Nebenwirkung — der Bericht darueber
// entsteht in garderobeAssert() und nicht hier, damit ein Backlauf ihn nicht
// vervielfacht.
function garderobeBlatt(slot, form, anim){
  const key = `cf${slot}_${form}_${anim}`;
  if(SHEETS[key]) return key;
  const e = (CF_GARDEROBE_ERSATZ[slot] || {})[form];
  const eKey = e && `cf${slot}_${e}_${anim}`;
  return eKey && SHEETS[eKey] ? eKey : null;
}

// Waffen-Slot: das Pack liefert kein eigenes Anim-Rig fürs Tools-Layer (Iron_Sword.png
// ist ein eigenständiges 4x9-Sheet, inkompatibles Raster zum Player_Base-Blatt) —
// ein einzelnes Klingen-Frame ersetzt das bisherige Emoji-Icon, per Tint nach
// Waffengattung eingefärbt (Dolch/Schwert/Kriegsaxt teilen sich dieselbe Klinge).
addSheet('cftool_sword', 'cf/player/Tools/Iron/Iron_Sword.png', 1, 'grid', {fw:64, fh:64, ax:32, ay:32, rowStart:2});

// ===========================================================================
//  G3: Monster-Rigs Cute Fantasy. Ein Eintrag pro Rig-PNG, sieben Anim-Keys
//  (idle/walk/run/attack/cast/hurt/death) als [row,n] — Zeilen hart im Code
//  (Regressionsregel 7), gemessen per `node tools/sheet-audit.mjs --rig <Pfad>`
//  gegen die echten Bilder, NIE aus assets/cf/manifest.json übernommen: dessen
//  unionBBox/anchorSuggested sind über die Angriffszeile gebildet (Waffe/Zauber
//  ragt weit über den Körper hinaus) und bis zu 13px/88% daneben. ax/ay hier
//  stammen ausschließlich aus der Idle-Seitenzeile, siehe G3-Umsetzungsnotizen.
//  Bestätigte Seiten-Regel (2 Idle/Walk/Hurt-Triplets + 3 Cast-Triplets per
//  Bildvergleich geprüft, siehe tools/sheet-audit.overrides.json _rigTable):
//  in jedem Down/Side/Up-Dreier ist die MITTLERE Zeile die Seitenansicht —
//  idle=1, walk=4, attack/cast=7, hurt=11 (death=9, Einzelzeile, kein Dreier).
//  run hat kein eigenes Rig-Pendant, aliast auf walk (wie zuvor skel_run).
//  Kein `psc`/`deathFps` hier — das ist Schritt 3, hier nur Registrierung.
// ===========================================================================
const CF_RIGS = {
  goblin_maceman:    { file:'Goblins/Goblin_Maceman.png', fw:32, fh:32, ax:16, ay:25,
    anims:{ idle:[1,4], walk:[4,6], run:[4,6], attack:[7,6], cast:[7,6], hurt:[11,4], death:[9,4] } },
  goblin_thief:      { file:'Goblins/Goblin_Thief.png', fw:32, fh:32, ax:16, ay:25,
    anims:{ idle:[1,4], walk:[4,6], run:[4,6], attack:[7,6], cast:[7,6], hurt:[11,4], death:[9,4] } },
  skeleton_bowman:   { file:'Skeleton_Bowman/Skeleton_Bowman.png', fw:32, fh:32, ax:15, ay:25,
    anims:{ idle:[1,6], walk:[4,6], run:[4,6], attack:[7,6], cast:[7,6], hurt:[11,4], death:[9,4] } },   // mummy
  skeleton_mage:     { file:'Skeleton/Skeleton_Mage.png', fw:32, fh:32, ax:15, ay:25,
    anims:{ idle:[1,6], walk:[4,6], run:[4,6], attack:[7,8], cast:[7,8], hurt:[11,4], death:[9,4] } },   // frostmage
  knights_swordman:  { file:'Knights/Swordman.png', fw:48, fh:48, ax:22, ay:41,
    anims:{ idle:[1,6], walk:[4,6], run:[4,6], attack:[7,6], cast:[7,6], hurt:[11,2], death:[9,4] } },   // frostgolem + stalfos
  knights_spearman:  { file:'Knights/Spearman.png', fw:48, fh:48, ax:22, ay:33,
    anims:{ idle:[1,6], walk:[4,6], run:[4,6], attack:[7,6], cast:[7,6], hurt:[11,2], death:[9,4] } },   // golem
  knights_templar:   { file:'Knights/Templar.png', fw:48, fh:48, ax:22, ay:33,
    anims:{ idle:[1,6], walk:[4,6], run:[4,6], attack:[7,6], cast:[7,6], hurt:[11,2], death:[9,4] } },   // boss Schattenfürst
  knights_archer:    { file:'Knights/Archer.png', fw:48, fh:48, ax:22, ay:41,
    anims:{ idle:[1,6], walk:[4,6], run:[4,6], attack:[7,6], cast:[7,6], hurt:[11,2], death:[9,4] } },   // bossgeneric Alter Schrecken
  cowling_1:         { file:'Volcano/Cowling_1.png', fw:48, fh:48, ax:24, ay:32,
    anims:{ idle:[1,4], walk:[4,6], run:[4,6], attack:[7,4], cast:[7,4], hurt:[11,2], death:[9,4] } },   // demon
  cowling_2:         { file:'Volcano/Cowling_2.png', fw:48, fh:48, ax:24, ay:32,
    anims:{ idle:[1,4], walk:[4,6], run:[4,6], attack:[7,4], cast:[7,4], hurt:[11,2], death:[9,4] } },   // crab
  cowling_mage_1:    { file:'Volcano/Cowling_Mage_1.png', fw:48, fh:48, ax:24, ay:32,
    anims:{ idle:[1,4], walk:[4,6], run:[4,6], attack:[7,6], cast:[7,6], hurt:[11,2], death:[9,4] } },   // sandmage
  cowling_mage_2:    { file:'Volcano/Cowling_Mage_2.png', fw:48, fh:48, ax:24, ay:32,
    anims:{ idle:[1,4], walk:[4,6], run:[4,6], attack:[7,6], cast:[7,6], hurt:[11,2], death:[9,4] } },   // greenmage
  angel_1:           { file:'Angels/Angel_1.png', fw:64, fh:64, ax:28, ay:41,
    anims:{ idle:[1,6], walk:[4,6], run:[4,6], attack:[7,8], cast:[7,8], hurt:[11,4], death:[9,4] } },   // mage (Irrlichtmagier)
  angel_2:           { file:'Angels/Angel_2.png', fw:64, fh:64, ax:26, ay:41,
    anims:{ idle:[1,6], walk:[4,6], run:[4,6], attack:[7,8], cast:[7,8], hurt:[11,4], death:[9,4] } },   // shadowmage
  blue_shroomling:   { file:'ShroomLands/Blue_Shroomling.png', fw:16, fh:32, ax:8, ay:32,
    anims:{ idle:[1,2], walk:[4,6], run:[4,6], attack:[7,6], cast:[7,6], hurt:[11,4], death:[9,4] } },   // spider (Ersatz-Rig)
  slime_small_green: { file:'Slime/Slime_Small_Green.png', fw:16, fh:16, ax:8, ay:15,
    // Nur 4 Zeilen: 0 idle-Bounce, 1 Sprung(8f)=walk/run, 2 fast idle-identisch=attack
    // (Slime-Ramme), 3 Huelle-Flacker solid/hohl=hurt UND death (kein Extra-Frame).
    anims:{ idle:[0,4], walk:[1,8], run:[1,8], attack:[2,4], cast:[2,4], hurt:[3,4], death:[3,4] } },    // slime
  slime_small_blue:  { file:'Slime/Slime_Small_Blue.png', fw:16, fh:16, ax:8, ay:15,
    anims:{ idle:[0,4], walk:[1,8], run:[1,8], attack:[2,4], cast:[2,4], hurt:[3,4], death:[3,4] } },    // shadow
  // M3 Stollen: die Schleimfamilie in drei Groessen. Big und Medium teilen sich das
  // 8x4-Raster des verbauten Slime_Small (0 Idle, 1 Sprung=walk/run, 2 Ramme=attack,
  // 3 Huelle-Flacker=hurt UND death). Mit --rig gegen alle drei PNGs gemessen: die
  // Zeilenstruktur ist identisch, nur fw/fh und die Fusslinie wachsen mit. Einzige
  // Abweichung: Big hat in der Angriffszeile 8 statt 4 Frames.
  slime_big:         { file:'Slime/Slime_Big_Blue.png', fw:64, fh:64, ax:32, ay:42,
    anims:{ idle:[0,4], walk:[1,8], run:[1,8], attack:[2,8], cast:[2,8], hurt:[3,4], death:[3,4] } },
  slime_medium:      { file:'Slime/Slime_Medium_Blue.png', fw:32, fh:32, ax:16, ay:22,
    anims:{ idle:[0,4], walk:[1,8], run:[1,8], attack:[2,4], cast:[2,4], hurt:[3,4], death:[3,4] } },
  // Die Schnecke bricht das Down/Side/Up-Schema des Packs, und zwar nachweisbar:
  // Zeile 0 misst 21px Breite (Seitenansicht mit Haus), die Zeilen 1 und 2 nur 10px
  // (Front und Rueck). Zeile 3 ist dieselbe Seitenansicht in Bewegung. Nur diese
  // beiden Zeilen sind verbaut; Angriff, Treffer und Tod aliasen darauf wie beim
  // bat (F17) — ein eigenes Sterbebild hat das Blatt nicht.
  snail:             { file:'Snails/Snail_1.png', fw:32, fh:32, ax:16, ay:28,
    anims:{ idle:[0,2], walk:[3,2], run:[3,2], attack:[3,2], cast:[3,2], hurt:[0,2], death:[0,2] } },
  // W-Lager: die Gruenhaut-Wachen. Beide Blaetter sind 48x48 im 6x13-Raster und
  // damit zeilengleich mit dem laengst verbauten Goblin_Maceman — das Manifest
  // fuehrte sie auf 32x32, was schon an der Arithmetik scheitert: 624 ist durch
  // 32 nicht teilbar. Mit --rig unter beiden Annahmen gegen das PNG gemessen.
  goblin_spearman:   { file:'Goblins/Goblin_Spearman.png', fw:48, fh:48, ax:24, ay:35,
    anims:{ idle:[1,4], walk:[4,6], run:[4,6], attack:[7,6], cast:[7,6], hurt:[11,2], death:[9,4] } },
  goblin_archer:     { file:'Goblins/Goblin_Archer.png', fw:48, fh:48, ax:24, ay:41,
    anims:{ idle:[1,4], walk:[4,6], run:[4,6], attack:[7,6], cast:[7,6], hurt:[11,2], death:[9,4] } },
  // Das Ork-Blatt mischt DREI Raster uebereinander, und genau daran ist die
  // G0-Heuristik gescheitert (G3-Notiz: "Raster-Konfidenz zu niedrig, ungeprueft"):
  //   y   0..192  6 Zeilen a 32x32, je 6 Frames  -> Idle (0-2), Lauf (3-5)
  //   y 192..384  3 Zeilen a 64x64, je 8 Frames  -> Angriff Down/Seite/Hoch
  //   y 384..512  4 Zeilen a 32x32, je 4 Frames  -> Zeile 12 der Sturz (death),
  //                                                 13-15 das Treffer-Aufblitzen
  // Die Angriffszeile braucht die doppelte Zelle, weil der Waffenbogen ueber den
  // Koerper hinausreicht; der Ork selbst bleibt gleich gross (Koerper 20-24px in
  // beiden Rastern), es waechst nur der Rahmen. Deshalb die Anim-Ausnahme statt
  // eines zweiten Rigs. Alle drei Bloecke mit --rig gegen das PNG gemessen.
  orc_chief:         { file:'Orcs/Orc_Chief.png', fw:32, fh:32, ax:16, ay:30,
    anims:{ idle:[1,6], walk:[4,6], run:[4,6],
            attack:[4,8,{fw:64, fh:64, ax:30, ay:46}],
            cast:  [4,8,{fw:64, fh:64, ax:30, ay:46}],
            hurt:[14,4], death:[12,4] } },
  flying_skull:      { file:'Volcano/Flying_Skull.png', fw:32, fh:16, ax:16, ay:16,
    // Kein Down/Side/Up-Schema (8 Zeilen, Framezahl 6,6,3,3,2,2,6,6). Per Bildvergleich:
    // 0 Flug-Idle, 2 Flatter-Variante, 4 kompakte Tauch-Pose, 6+7 Schädel-Bruchstücke
    // auseinanderfliegend (hurt bzw. death). Kein cast (ghost/shadowghost sind Nahkampf).
    anims:{ idle:[0,6], walk:[2,3], run:[2,3], attack:[4,2], cast:[4,2], hurt:[6,6], death:[7,6] } },    // ghost + shadowghost
  bat:               { file:'Halloween/Bat.png', fw:16, fh:16, ax:8, ay:11,
    // Nur eine Zeile im ganzen Sheet, alle 7 Anims aliasen darauf. Bewusster Kompromiss
    // (F17): flying_skull als Ersatz verworfen, dessen hurt/death (zerberstende
    // Schädel-Bruchstücke) widersprächen Name, Drop 'Fledermausflügel' und dem
    // Weltbibel-Eintrag 'Der Umlauf'. Treffer/Tod bleiben über Blitz-Tint und
    // Konfetti-Leiche sichtbar, nur ohne eigene Pose.
    anims:{ idle:[0,6], walk:[0,6], run:[0,6], attack:[0,6], cast:[0,6], hurt:[0,6], death:[0,6] } },    // bat
};
for(const rig in CF_RIGS){
  const r = CF_RIGS[rig];
  for(const anim in r.anims){
    const [row, n] = r.anims[anim];
    // W-Lager: ein Blatt darf pro Anim ein abweichendes Raster tragen. Gebraucht
    // hat das erst das Ork-Blatt, das drei Raster uebereinander mischt (s. dort).
    // Ohne Ausnahme faellt der Eintrag auf das Rig-Raster zurueck, alle bisherigen
    // Rigs bleiben also unveraendert.
    const o = r.anims[anim][2];
    addSheet(`${rig}_${anim}`, `cf/enemies/${r.file}`, n, 'grid',
      {fw:(o&&o.fw)||r.fw, fh:(o&&o.fh)||r.fh, ax:(o&&o.ax)||r.ax, ay:(o&&o.ay)||r.ay, rowStart:row});
  }
}

// Sunnyside-Gegner-Rigs (Goblin/Skelett) sind mit G3 entfernt — alle MONDEF-Typen
// laufen auf CF_RIGS oben. Die PNGs selbst sind mit G5 ("Sunnyside-Abschied") aus
// dem Repo, s. Umsetzungsnotizen G3/G5 in superduper-grafik-prompt.md.

// --- Welt: Tileset, Deko, VFX (Phase G4, Cute Fantasy) -----------------------
// Boden-UVs per Pixel-Varianzscan gemessen (nicht die Bounding-Box-Heuristik aus
// sheet-audit.mjs — die taugt bei voll opaken Flächen-Tiles nichts), Details und
// Messwerte in tools/sheet-audit.overrides.json unter _g4Tiles. Gesucht wurden
// Zellen mit Varianz 0 bzw. minimal = nahtlos wiederholbare Flächenfarbe.
addSheet('cfgrass1', 'cf/tiles/Grass_1_Middle.png', 1, 'raw');
addSheet('cfgrass2', 'cf/tiles/Grass_2_Middle.png', 1, 'raw');
addSheet('cfgrass3', 'cf/tiles/Grass_3_Middle.png', 1, 'raw');
addSheet('cfgrass4', 'cf/tiles/Grass_4_Middle.png', 1, 'raw');
addSheet('cfpath', 'cf/tiles/Path_Middle.png', 1, 'raw');
addSheet('cfwater', 'cf/tiles/Water_Middle.png', 1, 'raw');
addSheet('cfvolcano_tiles', 'cf/tiles/Volcano_Tiles.png', 1, 'raw');
addSheet('cfshroom_tiles', 'cf/tiles/ShroomLands_Grass_Purple_Tiles.png', 1, 'raw');
// Bäume: 3-Spalten-Sheets (Spalte 0 ist ein Baumstumpf, keine Baumvariante — beim
// Zeichnen übersprungen), kein Sway-Frame im Pack vorhanden (Nutzerentscheidung:
// kein Code-Sway nachrüsten, s. Umsetzungsnotizen G4).
addSheet('cftree_oak', 'cf/deco/Trees/Big_Oak_Tree.png', 3, 'strip');
addSheet('cftree_birch', 'cf/deco/Trees/Big_Birch_Tree.png', 3, 'strip');
addSheet('cftree_spruce', 'cf/deco/Trees/Big_Spruce_tree.png', 3, 'strip');
// G_CACTUS-Ersatz — kein Kaktus im Pack, thematisch passende Vulkanpflanze (Nutzerentscheidung).
addSheet('cfvolcplant', 'cf/deco/Volcano_Plants.png', 4, 'grid', {fw:16, fh:16, ax:8, ay:15});
// Der Anker liegt auf der Steinunterkante, NICHT auf der Zellunterkante.
// 'strip' setzt ihn auf die Fussmitte der Zelle, und das stimmt nur, solange die
// Zeichnung die Zelle auch ausfuellt — beim Zaun aus G11 tut sie das, hier nicht:
// gemessen (sheet-audit --rig) sitzt der Stein in den Zeilen 5 bis 11 von 16, es
// bleiben vier leere Zeilen darunter. Bei WELT_SC sind das acht Weltpixel Luft
// zwischen Stein und Anker — und der Schatten wird auf den Anker gemalt. Ergebnis
// war ein Stein, der ueber seinem eigenen Schatten schwebte, seit G4.
// Dieselbe Korrektur wie beim Boot in G11 (Anker auf der Wasserlinie y45 statt
// auf der Blattunterkante), nur faellt sie hier auf, weil ein Schatten darunter
// liegt: Baeume haben denselben Rand und bekamen ihn in G7 als BAUM_DY verrechnet.
addSheet('cfrock', 'cf/deco/Rock_1_Anim.png', 8, 'grid', {fw:16, fh:16, ax:8, ay:12});
// Neu in G4: hohes Gras bekommt erstmals ein Sprite (Nutzerentscheidung, war bis G3 unsichtbar).
addSheet('cftallgrass', 'cf/deco/Grass_1_Anim.png', 8, 'strip');
addSheet('cfmush1', 'cf/deco/muschroom_1_Anim.png', 6, 'strip');
addSheet('cfmush2', 'cf/deco/muschroom_2_Anim.png', 6, 'strip');
// Leuchtende Pilze fürs Schattenland (Prompt-Wunsch).
addSheet('cfmush_shadow', 'cf/deco/Mushrooms_Purple.png', 4, 'grid', {fw:32, fh:32, ax:16, ay:30});
// Landmarke: nur Rumpf, kein Sail-Overlay (separates Layer, eigene Rotationsachse
// nötig — für eine reine Deko-Landmarke nicht gerechtfertigt, Nutzerentscheidung).
// n:1 erzwingt Spalte 0 (die 2. Spalte ist nur eine zweite Gebäude-Skin, keine
// Animation) — mit 'strip' und n:2 hätte der bestehende DRAW_DECO-Aufruf
// (animFrame mit 9fps) zwischen beiden 9x/s hin- und hergeflackert.
addSheet('cfwindmill', 'cf/deco/Windmill.png', 1, 'grid', {fw:64, fh:112, ax:32, ay:110});
addSheet('fire1', 'cf/deco/Torch_Anim.png', 8, 'strip');
addSheet('fire2', 'cf/deco/Campfire_Anim.png', 8, 'strip');
// G3 Schritt 6: Hoftiere auf Cute Fantasy (Animals). Kein Down/Side/Up-Schema
// nötig (nur Idle/Lauf) — Zeilen aus
// tools/sheet-audit.overrides.json _rigTable (cf_animal_*), Ankerhöhe an der
// jeweiligen Idle-Seitenzeile gemessen (Regel wie bei CF_RIGS oben).
// G12: acht Arten dazu, und mit ihnen ein Feld, das es vorher nicht brauchte.
// Bis hierher lief jedes Ambiente-Tier auf begehbarem Grund und prallte an allem
// ab — eine einzige Bauart, fuenfmal benutzt. Eine Ente braucht das Gegenteil von
// walkPx(), ein Falter gar keine Bodenpruefung. `lebensraum` sagt, welche:
//
//   'land'   wie bisher: reachbar(), Abprallen an Baum, Fels und Wasser
//   'wasser' nur G_OCEAN, und zwar genau umgekehrt geprueft
//   'ufer'   steht auf Land am Wasser und geht nie weg (der Frosch hat gar
//            keine Laufzeile, s. unten)
//   'luft'   fliegt ueber allem, keine Bodenpruefung
//
// Alle Zeilen sind am PNG gemessen (node tools/sheet-audit.mjs --rig), nicht aus
// assets/cf/manifest.json genommen: dessen Heuristik tippt bei Frog_01 auf 40
// Spalten in 320 Pixeln — das waeren vierzig Frames fuer einen Frosch. Wahr sind
// 10x4 zu 32x32.
const CF_ANIMALS = {
  chicken: {file:'Animals/Chicken_01.png', fw:32, fh:32, ax:16, ay:24, idle:[0,2], walk:[2,8], lebensraum:'land'},
  sheep:   {file:'Animals/Sheep_01.png',   fw:32, fh:32, ax:16, ay:24, idle:[1,2], walk:[4,8], lebensraum:'land'},
  cow:     {file:'Animals/Cow_01.png',     fw:32, fh:32, ax:16, ay:27, idle:[1,2], walk:[4,8], lebensraum:'land'},
  pig:     {file:'Animals/Pig_01.png',     fw:32, fh:32, ax:16, ay:24, idle:[1,2], walk:[4,8], lebensraum:'land'},
  // Ente und Schwan tragen ihre Wasserzeilen SELBST: Zeile 7 ist die Ruhe im
  // Wasser, Zeile 8 das Schwimmen, beide mit gemalter Wasserlinie unter dem
  // Tier. Zeile 0/1 waeren dieselben Voegel an Land, ohne Linie. Das steht in
  // keiner Rasterzahl, das sieht man erst im Kontaktbogen.
  duck:    {file:'Animals/Duck_01.png',    fw:32, fh:32, ax:16, ay:24, idle:[7,2], walk:[8,4], lebensraum:'wasser'},
  swan:    {file:'Animals/Swan_01.png',    fw:32, fh:32, ax:16, ay:24, idle:[7,2], walk:[8,3], lebensraum:'wasser'},
  // Die Gans hat KEINE Wasserzeilen — acht Zeilen je Blickrichtung, keine davon
  // mit Wasserlinie. Sie ist im Pack ein Landvogel und wird hier einer.
  goose:   {file:'Animals/Goose_01.png',   fw:32, fh:32, ax:16, ay:24, idle:[0,2], walk:[1,6], lebensraum:'land'},
  mouse:   {file:'Animals/Mouse_01.png',   fw:32, fh:32, ax:16, ay:22, idle:[0,6], walk:[1,6], lebensraum:'land'},
  // Der Frosch hat vier Zeilen und keine davon laeuft: Blinzeln (2), Quaken (8),
  // Zunge (10), Treffer (4). Deshalb 'ufer' und beide Keys auf das Quaken —
  // er sitzt und atmet, und das ist genau richtig fuer ein Tier am Ufer.
  frog:    {file:'Animals/Frog_01.png',    fw:32, fh:32, ax:16, ay:22, idle:[1,8], walk:[1,8], lebensraum:'ufer'},
  // Butterfly.png ist 16x64: zwei Frames Fluegelschlag in acht FARBEN, eine je
  // Zeile. Drei davon werden gesetzt, damit nicht alle Falter dieselben sind.
  // Der Anker liegt bei den Fliegern bewusst UEBER der Zellmitte (ay groesser als
  // fh/2): er ist die Stelle im Blatt, die auf der Standposition landet, und was
  // fliegt, steht nicht auf ihr. Zehn Blattpixel ueber der Mitte sind bei WELT_SC
  // zwanzig Weltpixel Flughoehe — genug, dass ein Falter ueber dem Gras schwebt
  // statt darin zu sitzen. Denselben Kniff nutzt das Boot aus G11 fuer seine
  // Wasserlinie, nur in die andere Richtung.
  falter1: {file:'Animals/Butterfly.png',  fw:8,  fh:8,  ax:4,  ay:14, idle:[0,2], walk:[0,2], lebensraum:'luft'},
  falter2: {file:'Animals/Butterfly.png',  fw:8,  fh:8,  ax:4,  ay:14, idle:[2,2], walk:[2,2], lebensraum:'luft'},
  falter3: {file:'Animals/Butterfly.png',  fw:8,  fh:8,  ax:4,  ay:14, idle:[4,2], walk:[4,2], lebensraum:'luft'},
  biene:   {file:'Animals/Bee_Flying_Animation.png', fw:16, fh:16, ax:8, ay:22, idle:[0,4], walk:[1,4], lebensraum:'luft'},
};
for(const a in CF_ANIMALS){
  const ad = CF_ANIMALS[a];
  addSheet(`cf${a}_idle`, `cf/deco/${ad.file}`, ad.idle[1], 'grid', {fw:ad.fw, fh:ad.fh, ax:ad.ax, ay:ad.ay, rowStart:ad.idle[0]});
  addSheet(`cf${a}_walk`, `cf/deco/${ad.file}`, ad.walk[1], 'grid', {fw:ad.fw, fh:ad.fh, ax:ad.ax, ay:ad.ay, rowStart:ad.walk[0]});
}

// G12: Wasserpflanzen. Acht Blaetter, alle 128x16 mit acht Frames zu 16x16 —
// die einzigen dieser Runde, deren Raster das Manifest glaubwuerdig kennt
// (Konfidenz 1), und am PNG bestaetigt. ay:16 legt die Zellunterkante auf die
// Kachelunterkante, wie beim Zaun aus G11; bei WELT_SC deckt eine Zelle damit
// genau eine Kachel. Die Seerose sitzt mittig in ihrer Zelle (Alpha-Box x2-12,
// y5-13) und braucht deshalb keinen eigenen Anker.
const CF_WASSERPFLANZEN = {
  schilf1: 'Cattail_1_Anim.png',      schilf2: 'Cattail_2_Anim.png',   schilf3: 'Cattail_3_Anim.png',
  rose1:   'Lillypad_Green_1_Anim.png', rose2: 'Lillypad_Green_2_Anim.png', rose3: 'Lillypad_Green_3_Anim.png',
  wgras1:  'Water_Grass_1_Anim.png',  wgras2:  'Water_Grass_2_Anim.png',
};
for(const k in CF_WASSERPFLANZEN)
  addSheet(`cfwp_${k}`, `cf/deco/Outdoor/${CF_WASSERPFLANZEN[k]}`, 8, 'grid', {fw:16, fh:16, ax:8, ay:16});

// G12: Das Kapybara, das einzige Ambiente-Tier mit einem Zustandswechsel — es
// taucht ab, blubbert unten und kommt wieder hoch. Vier Blaetter statt Zeilen
// eines Rigs, denn so liegt es im Pack.
//
// Klein geschrieben, weil veraendert: die Originale bringen einen DECKENDEN
// Wasserhintergrund mit (rgb 0,149,233 — Pixel fuer Pixel der Ton aus
// Water_Middle.png), und der Ozean wird getoent gebacken. Ungetoent darauf waere
// das ein zwei Kacheln breites helles Rechteck. tools/kapybara-freistellen.mjs
// nimmt genau diesen Ton weg und laesst die Wellenringe stehen; die Begruendung
// steht im Kopf des Werkzeugs, der Schnitt ist mit --pruef nachrechenbar.
for(const [k, datei, n] of [['idle','kapybara_idle.png',9], ['dive','kapybara_dive.png',9],
                            ['bubbles','kapybara_bubbles.png',25], ['emerge','kapybara_emerge.png',10]])
  addSheet(`cfkapy_${k}`, `cf/deco/Animals/${datei}`, n, 'grid', {fw:32, fh:32, ax:16, ay:24});
// G5: glint/alert-Ersatz aus UI_Icons.png (Sunnyside-Abschied). 'grid' kennt keinen
// Spaltenversatz (nur rowStart), deshalb wie in G1 bei crate/pot/cobweb: die
// gebrauchten Zellen pixelgenau in eigene Dateien geschnitten (Quellkoordinaten
// unten), Originaldatei bleibt unangetastet in Graphics/. glint_strip.png ist ein
// 3-Zellen-Streifen (voller/halber/leerer blauer Stern, UI_Icons.png Zeile 3
// Spalten 9-11) — animFrame lässt daraus ein Zwinker-Funkeln laufen statt der
// alten 6-Frame-Sunnyside-Animation, im Pack gibt es keine mehrframige Funkel-
// Animation (gleiche Lücke wie der fehlende Kaktus in G4). alert.png ist eine
// Einzelzelle (Ausrufezeichen, Zeile 2 Spalte 12), wie das Original ein
// Ein-Frame-Sprite.
addSheet('glint', 'cf/ui/glint_strip.png', 3, 'strip');
addSheet('alert', 'cf/ui/alert.png', 1, 'strip');
// G3 Schritt 6: Zauber-Projektil für alle 5 Magier statt gezeichnetem Farbkreis,
// getönt nach bolt.color. Zentrierter Anker (kein Fußpunkt, das Bolt-Objekt trägt
// x/y als Mittelpunkt, s. enemyBolts-Draw).
addSheet('cf_bolt', 'cf/deco/Other/Skeleton_Mage_Projectile.png', 8, 'grid', {fw:16, fh:16, ax:8, ay:8});

// ===========================================================================
//  G5: Dorf — Gebäude, NPC-Staffage, Wetter (Cute Fantasy, Kenmi).
// ===========================================================================
// Gebäude sind reine 'big'-Decos wie cfwindmill: ein Frame, Fußanker unten-mittig,
// Maße per Node-PNG-Header gemessen (kein sheet-audit.mjs — das Werkzeug ist für
// Sprite-Raster gebaut, nicht für monolithische Einzelbilder, s. G4-Lektion für
// Flächentexturen, hier trifft dieselbe Einschränkung sinngemäß zu).
// G6: Maße, Anker UND die gemessene Deckfläche stehen ab hier genau einmal, in
// CF_BLD, und werden von drei Seiten gelesen: addSheet() registriert daraus das
// Blatt, VILLAGE_BUILDINGS hängt den Fußabdruck dran, dorfSichtAssert() rechnet
// damit nach, ob eine Fassade eine Dorffigur zudeckt. Zwei getrennte Tabellen
// wären die F1-Falle, eine Zahl an zwei Orten.
// deck = die undurchsichtige Fläche des PNG, relativ zum Fußanker (links, rechts,
// oben, unten). Nicht das Frame-Rechteck: die Blätter haben teils breite leere
// Ränder (Inn_Blue 10px links, Barn 13px), und mit dem vollen Rechteck gerechnet
// meldet der Guard Verdeckungen, die es auf dem Schirm nicht gibt. Werte per
// Alpha-Bounding-Box am PNG gemessen, gleiche Methode wie überall sonst hier.
// IN1: tuerDx ist der Versatz der GEMALTEN Tür gegenüber dem Fußanker, in
// Blattpixeln. Er steht nur bei den drei Häusern, die man betreten kann, und er
// ist gemessen und nicht gemittelt: die drei Blätter setzen ihre Tür an drei
// verschiedene Stellen (Inn links der Mitte, House_2 weit links, House_3 rechts).
// Wer stattdessen die Mitte des Fußabdrucks nimmt, lässt den Spieler durch die
// Hauswand gehen, während die gemalte Tür daneben zu bleibt. Gemessen am
// gerasterten Blatt, nachgerechnet von `tools/innen-tuer-messlauf.mjs`.
const CF_BLD = {
  amt:     {file:'Inn_Blue.png',              fw:240, fh:192, ax:120, ay:190, deck:{l:-110, r:120, o:-186, u:-11}, tuerDx:-16},
  haus1:   {file:'House_1_Wood_Base_Red.png', fw:96,  fh:128, ax:48,  ay:126, deck:{l:-35,  r:35,  o:-125, u:-11}},
  haus2:   {file:'House_2_Wood_Base_Blue.png',fw:144, fh:128, ax:72,  ay:126, deck:{l:-59,  r:61,  o:-125, u:-11}, tuerDx:-33},
  haus3:   {file:'House_3_Stone_Base_Blue.png',fw:144,fh:128, ax:72,  ay:126, deck:{l:-61,  r:59,  o:-125, u:-11}, tuerDx:17},
  markt:   {file:'Market_Stalls.png',         fw:192, fh:48,  ax:96,  ay:46,  deck:{l:-95,  r:95,  o:-36,  u:2}},
  scheune: {file:'Barn_Base_Red.png',         fw:128, fh:144, ax:64,  ay:142, deck:{l:-51,  r:51,  o:-128, u:-11}},
};
for(const bk in CF_BLD){
  const b = CF_BLD[bk];
  addSheet(`cfbld_${bk}`, `cf/deco/Buildings/${b.file}`, 1, 'grid', {fw:b.fw, fh:b.fh, ax:b.ax, ay:b.ay});
}

// NPC-Staffage: 64x64-Raster wie Angel_1/2 (CF_RIGS oben), idle=Zeile1/walk=Zeile4
// per Crop bestätigt (mittlere mittlere Down/Side/Up-Zeile = Seitenansicht, gleiche
// Regel wie bei den Monster-Rigs aus G3). Nur Idle/Lauf gebraucht, keine Kampf-Anims.
// Fußlinie ist CF_ANCHOR.ay (40), nicht 60: die Blätter teilen sich das Raster mit dem
// Helden, die Bounding-Box endet in allen zwölf geprüften Reihen bei y=40. Mit ay:60
// hing die Figur 20 Pixel über ihrem eigenen Schatten und wurde von allem verdeckt,
// was nach ihr sortiert wird. npcAnkerAssert() unten hält das fest.
// Die Blätter sind unterschiedlich groß (384x448 bis 576x832, Fin hat 9 Spalten statt 6),
// deshalb kommen cols und rows aus der Bildbreite, nicht aus einer Annahme.
const CF_NPCS = {
  bob:   {file:'NPCs/Farmer_Bob.png',      fw:64, fh:64, ax:32, ay:CF_ANCHOR.ay},
  katy:  {file:'NPCs/Bartender_Katy.png',  fw:64, fh:64, ax:32, ay:CF_ANCHOR.ay},
  mike:  {file:'NPCs/Miner_Mike.png',      fw:64, fh:64, ax:32, ay:CF_ANCHOR.ay},
  bruno: {file:'NPCs/Bartender_Bruno.png', fw:64, fh:64, ax:32, ay:CF_ANCHOR.ay},
  chloe: {file:'NPCs/Chef_Chloe.png',      fw:64, fh:64, ax:32, ay:CF_ANCHOR.ay},
  buba:  {file:'NPCs/Farmer_Buba.png',     fw:64, fh:64, ax:32, ay:CF_ANCHOR.ay},
  jack:  {file:'NPCs/Lumberjack_Jack.png', fw:64, fh:64, ax:32, ay:CF_ANCHOR.ay},
  fin:   {file:'NPCs/Fisherman_Fin.png',   fw:64, fh:64, ax:32, ay:CF_ANCHOR.ay},
};
for(const nkey in CF_NPCS){
  const nd = CF_NPCS[nkey];
  // G6: optional. Fünf der acht Dateien liegen nicht im Grafikpaket, und das ist
  // seit G6 ein vorgesehener Zustand statt eines stillen Fehlers: npcBlaetter()
  // gibt diesen Figuren ein Held-Komposit. Ohne die Marke meldete loadAssets()
  // dafür zehn Warnungen bei jedem Start.
  addSheet(`cfnpc_${nkey}_idle`, `cf/deco/${nd.file}`, 6, 'grid', {fw:nd.fw, fh:nd.fh, ax:nd.ax, ay:nd.ay, rowStart:1, optional:true});
  addSheet(`cfnpc_${nkey}_walk`, `cf/deco/${nd.file}`, 6, 'grid', {fw:nd.fw, fh:nd.fh, ax:nd.ax, ay:nd.ay, rowStart:4, optional:true});
}

// Wetter, rein optisch. Wolken: 4 Varianten im 2x2-Raster, zentrierter Anker (kein
// Fußpunkt, treiben über dem Boden). Wind: 14-Frame-Strip, Fußpunkt egal (waagerecht
// über den Bildschirm, s. Wetter-Update).
// W-Lager: die Ausstattung des Lagers. Raster je Blatt an den leeren Spalten und
// Zeilen des PNG gemessen, nicht aus der Heuristik uebernommen — die taugt bei
// Requisitenblaettern so wenig wie bei Flaechen-Tiles (G4-Lektion).
// palisade_run.png ist eine handgeschnittene Einzelzelle (Quelle 32,48 16x32),
// weil addSheet's 'grid' keinen Spaltenversatz kennt. Gleiche Ausnahme wie
// crate/pot/cobweb aus G1 und die vier UI-Zellen aus G5.
addSheet('camp_palisade', 'cf/deco/Camp/palisade_run.png', 1, 'grid', {fw:16, fh:32, ax:8, ay:31});
addSheet('camp_gate',   'cf/deco/Camp/Palisade_Gate_Anim.png', 1, 'grid', {fw:48, fh:64, ax:24, ay:62});
addSheet('camp_tent',   'cf/deco/Camp/Military_Tents.png', 1, 'grid', {fw:80, fh:96, ax:40, ay:83});
addSheet('camp_tower',  'cf/deco/Camp/Lookout_Towers.png', 1, 'grid', {fw:72, fh:128, ax:36, ay:126, rowStart:1});
addSheet('camp_banner', 'cf/deco/Camp/Banners_Anim.png', 4, 'grid', {fw:32, fh:32, ax:16, ay:30});
addSheet('camp_pot',    'cf/deco/Camp/Campfire_Pot_Anim.png', 5, 'grid', {fw:48, fh:32, ax:24, ay:30});

// G11: Koppel, Schild und Boot. Sechs handgeschnittene Zaunzellen aus
// `Outdoor decoration/Fences.png`, ein Schild aus `Signs.png`, ein Boot als
// fertiges Anim-Blatt.
//
// Warum geschnitten und nicht als Blatt registriert: ein Deko-Eintrag zeichnet
// immer `animFrame(sheet, ...)` und damit bei n:1 das Frame 0 seiner Zeile. Die
// Spalte ist so nicht adressierbar, und der Zaun braucht sechs verschiedene
// Spalten aus zwei Zeilen. Dieselbe Lage wie bei crate/pot/cobweb aus G1, also
// derselbe Weg: je Zelle eine Datei, dokumentiert in assets/cf/README.md.
//
// Welche Zelle was ist, steht nicht im Dateinamen des Packs, sondern in der
// Alpha-Bounding-Box je Zelle, gemessen wie bei den G4-Böden von Hand:
//   fence_h  (2,0) x0-15,y3-13  Riegel durch die ganze Zelle, kein Pfosten
//   fence_v  (0,1) x5-10,y0-15  Pfostenreihe durch die ganze Zelle, kein Riegel
//   fence_tl (1,1) x5-15,y3-15  Pfosten mit Riegel nach rechts und Pfosten nach unten
//   fence_tr (3,1) x0-10,y3-15  dasselbe gespiegelt
//   fence_bl (1,3) x5-15,y0-13  Pfosten von oben, Riegel nach rechts
//   fence_br (3,3) x0-10,y0-13  dasselbe gespiegelt
// Der Pfosten sitzt in jeder dieser Zellen bei x5-10, die Zellen fluchten also
// ueber Ecken und Kanten hinweg. ay:16 legt die Zellunterkante auf die
// Kachelunterkante, bei WELT_SC deckt eine Zelle damit genau eine Kachel.
for(const k of ['h', 'v', 'tl', 'tr', 'bl', 'br'])
  addSheet(`cffence_${k}`, `cf/deco/Outdoor/fence_${k}.png`, 1, 'grid', {fw:16, fh:16, ax:8, ay:16});
// Das Schild ist 16x32 und steht auf seinem Fuss, wie die Palisade.
addSheet('cfsign', 'cf/deco/Outdoor/sign_post.png', 1, 'grid', {fw:16, fh:32, ax:8, ay:32});
// Boat_Anim.png: 192x48, und die vier Frames sind 48 breit, nicht 16 — gemessen
// ueber die leeren Spalten (2-41, 50-90, 98-138, 146-186), nicht dem Manifest
// geglaubt, das hier wie bei jedem Flaechenblatt auf 16x16 tippt. Der Anker
// liegt auf der Wasserlinie (y45) und nicht an der Blattunterkante.
addSheet('cfboat', 'cf/deco/Outdoor/Boat_Anim.png', 4, 'grid', {fw:48, fh:48, ax:24, ay:45});
addSheet('cfcloud', 'cf/deco/Weather/Clouds.png', 4, 'grid', {fw:64, fh:64, ax:32, ay:32});
addSheet('cfwind', 'cf/deco/Weather/Wind_Anim.png', 14, 'strip');

// G5: UI-Skin. Zwei pixelgenau aus UI_Frames.png/UI_Buttons.png geschnittene
// Einzelzellen (Quellkoordinaten unten, gleiche Methode wie glint/alert oben und
// die G1-Dungeon-Objekte) — 'raw' lädt sie unverändert, kein Sheet-Raster nötig.
// bakeUiSkin() unten liest ihre data:/Pfad-URL über SHEETS[key].img.src (nach dem
// Laden identisch aufgelöst, egal ob Dev-Server oder ASSET_BLOBS-Build) und trägt
// sie als border-image/background-image in den DOM ein — kein CSS-url() auf eine
// Datei, das würde der Build nicht miteinbacken (s. Umsetzungsnotizen G5).
addSheet('cfui_frame', 'cf/ui/frame_brown.png', 1, 'raw');   // UI_Frames.png, Zelle (0,0), 48x48
addSheet('cfui_round', 'cf/ui/round_brown.png', 1, 'raw');   // UI_Buttons.png, x96-111 y0-15, 16x16
// U2: vier weitere Zellen aus demselben Pack. Geschnitten von tools/ui-zellen.mjs,
// das die Koordinaten als Tabelle fuehrt und mit --pruef nachrechnet — anders als
// die vier oben, die von Hand geschnitten und nur in einer README notiert sind.
// optional:true, weil sie fehlen duerfen: bakeUiSkin() setzt dann die zugehoerige
// CSS-Variable nicht, und die Regeln fallen auf ihren Ersatzwert zurueck (der
// U1-Anstrich aus reinem CSS). Ohne das Flag stuende hier eine Warnung je Zelle
// bei jedem, der das Repo ohne Grafiklizenz klont.
addSheet('cfui_slot',  'cf/ui/slot_dark.png',  1, 'raw', {optional:true});  // UI_Buttons.png  (129,17) 14x14
addSheet('cfui_x',     'cf/ui/btn_close.png',  1, 'raw', {optional:true});  // UI_Buttons.png  (721,33) 14x14
addSheet('cfui_pill',  'cf/ui/btn_pill.png',   1, 'raw', {optional:true});  // UI_Buttons.png  (1,17)   30x14
addSheet('cfui_sel',   'cf/ui/sel_white.png',  1, 'raw', {optional:true});  // UI_Selectors.png (11,10) 26x28

// U11: die Sinnbilder der Bedienknoepfe, acht Zellen zu 16x16. Sie ersetzen die
// System-Emoji, die bis dahin als einzige Grafik des Spiels nicht aus dem Pack
// stammten. Dieselbe Zellentabelle wie die vier darueber (tools/ui-zellen.mjs,
// --pruef rechnet nach), dieselbe Begruendung fuer optional:true — und hier
// wiegt sie schwerer, weil der Ersatzwert diesmal kein CSS-Anstrich ist,
// sondern das Emoji selbst: ohne Zelle bleibt es im Knopf stehen (s. .ico im
// <style> und body.cfuiIco in bakeUiSkin).
addSheet('ico_schlag',    'cf/ui/ico_schlag.png',    1, 'raw', {optional:true});  // UI_Icons.png      (112,16)
addSheet('ico_trank',     'cf/ui/ico_trank.png',     1, 'raw', {optional:true});  // Food_Icons (o. Outline) (112,128)
addSheet('ico_zauber',    'cf/ui/ico_zauber.png',    1, 'raw', {optional:true});  // UI_Icons.png      (144,48)
addSheet('ico_rucksack',  'cf/ui/ico_rucksack.png',  1, 'raw', {optional:true});  // UI_Icons.png      (144,32)
addSheet('ico_charakter', 'cf/ui/ico_charakter.png', 1, 'raw', {optional:true});  // UI_Icons.png      (192,16)
addSheet('ico_ziel',      'cf/ui/ico_ziel.png',      1, 'raw', {optional:true});  // UI_Crosshairs.png (0,128)
addSheet('ico_sperre',    'cf/ui/ico_sperre.png',    1, 'raw', {optional:true});  // UI_Icons.png      (208,80)
addSheet('ico_abbruch',   'cf/ui/ico_abbruch.png',   1, 'raw', {optional:true});  // UI_Icons.png      (176,80)
addSheet('ico_hand',      'cf/ui/ico_hand.png',      1, 'raw', {optional:true});  // UI_Icons.png      (48,224)

// U12: der Rest der Bedienoberflaeche — Panelkoepfe, Reiterband, Befaehigung und
// die Fundstuecke im Bild. Sie stehen groesstenteils auf DUNKLEM Panelgrund und
// nicht auf dem hellen Achteck; welche Zelle das aushaelt, zeigt seit U12 die
// rechte Haelfte von tools/ui-icon-kontaktbogen.mjs.
addSheet('ico_gold',       'cf/ui/ico_gold.png',       1, 'raw', {optional:true});  // (96,0)
addSheet('ico_zahnrad',    'cf/ui/ico_zahnrad.png',    1, 'raw', {optional:true});  // (32,16)
addSheet('ico_ton',        'cf/ui/ico_ton.png',        1, 'raw', {optional:true});  // (160,64)
addSheet('ico_ton_aus',    'cf/ui/ico_ton_aus.png',    1, 'raw', {optional:true});  // (176,64)
addSheet('ico_schrift',    'cf/ui/ico_schrift.png',    1, 'raw', {optional:true});  // UI_Button_Icons (160,32)
addSheet('ico_speicher',   'cf/ui/ico_speicher.png',   1, 'raw', {optional:true});  // (144,16)
addSheet('ico_kladde',     'cf/ui/ico_kladde.png',     1, 'raw', {optional:true});  // (176,16)
addSheet('ico_akten',      'cf/ui/ico_akten.png',      1, 'raw', {optional:true});  // (208,16)
addSheet('ico_ruestung',   'cf/ui/ico_ruestung.png',   1, 'raw', {optional:true});  // (192,0)
addSheet('ico_schluessel', 'cf/ui/ico_schluessel.png', 1, 'raw', {optional:true});  // (208,48)
addSheet('ico_brief',      'cf/ui/ico_brief.png',      1, 'raw', {optional:true});  // (224,16)
addSheet('ico_kraft',      'cf/ui/ico_kraft.png',      1, 'raw', {optional:true});  // (16,16)
addSheet('ico_herz',       'cf/ui/ico_herz.png',       1, 'raw', {optional:true});  // (0,0)
addSheet('ico_blitz',      'cf/ui/ico_blitz.png',      1, 'raw', {optional:true});  // (144,0)
addSheet('ico_amtskunde',  'cf/ui/ico_amtskunde.png',  1, 'raw', {optional:true});  // (160,16)
addSheet('ico_werte',      'cf/ui/ico_werte.png',      1, 'raw', {optional:true});  // (48,16)
addSheet('ico_dienst',     'cf/ui/ico_dienst.png',     1, 'raw', {optional:true});  // (64,16)
addSheet('ico_zettel',     'cf/ui/ico_zettel.png',     1, 'raw', {optional:true});  // (0,16)
addSheet('ico_kessel',     'cf/ui/ico_kessel.png',     1, 'raw', {optional:true});  // Food_Icons (16,64)

// ===========================================================================
//  Kammer-Interieur — Cute Fantasy Dungeons (Kenmi, itch.io), Phase G1.
//  Werte per Alpha-Bounding-Box/Komponentenanalyse am PNG gemessen (nicht aus
//  Dateinamen geraten, Regressionsregel 7/12). Dungeon_3 existiert nicht (G0-
//  Korrektur) — 2 Sets, Schwierigkeit 1-2 nutzt Set 0, 3-5 nutzt Set 1.
// ===========================================================================
for(const n of [1, 2]){
  addSheet(`dun${n}_tiles`, `cf/dungeon/Dungeon_${n}/Dungeon_${n}.png`, 1, 'raw');
  addSheet(`dun${n}_gate`, `cf/dungeon/Dungeon_${n}/Dungeon_${n}_Gate_Closed.png`, 1, 'grid', {fw:32, fh:32, ax:16, ay:32});
  addSheet(`dun${n}_gateAnim`, `cf/dungeon/Dungeon_${n}/Dungeon_${n}_Gate_anim.png`, 26, 'grid', {fw:32, fh:32, ax:16, ay:32});
  addSheet(`dun${n}_pillar`, `cf/dungeon/Dungeon_${n}/Dungeon_${n}_Pillars.png`, 3, 'grid', {fw:16, fh:48, ax:8, ay:46});
  addSheet(`dun${n}_plate`, `cf/dungeon/Dungeon_${n}/Dungeon_${n}_Pressure_Plate.png`, 6, 'grid', {fw:16, fh:16, ax:8, ay:8});
}
// M3: der dritte Kammersatz, der Stollen. Cute Fantasy liefert kein Dungeon_3 —
// der Ordner im Pack ist leer (G0-Korrektur oben gilt weiter). Deshalb ein Hybrid:
// Boden und sichtbarer Wandring kommen aus Tiles/Cave, waehrend Tor, Saeule, Platte
// und Treppe die von Dungeon_2 bleiben. Der Cave-Satz hat keine solchen Objekte.
addSheet('dun3_walls', 'cf/dungeon/Dungeon_3/Cave_Walls.png', 1, 'raw');
addSheet('dun3_floor', 'cf/dungeon/Dungeon_3/Cave_Floor_1.png', 1, 'raw');
// M4: die Leiter, die M3 ausdruecklich liegen gelassen hat ("eine Leiter ohne
// zweite Ebene waere eine Behauptung, keine Mechanik"). Sie ist kein Sprite mit
// Rand, sondern eine volle 16x16-Bodenkachel: ein Loch im Hoehlenboden samt
// Sprossen, im Braunton von Cave_Floor_1. Deshalb Mittelanker wie die Treppen
// und Zeichnung mit Faktor 2 — sie deckt genau ihre Kachel und keinen Pixel mehr.
addSheet('dun3_ladder', 'cf/dungeon/Dungeon_3/Cave_Floor_Ladder.png', 1, 'grid', {fw:16, fh:16, ax:8, ay:8});
addSheet('dun1_stairsDown', 'cf/dungeon/Dungeon_1/Stairs_Down_SingleFrame.png', 1, 'grid', {fw:16, fh:16, ax:8, ay:8});
addSheet('dun2_stairsDown', 'cf/dungeon/Dungeon_2/Dungeon_2_Stairs_Down.png', 1, 'grid', {fw:16, fh:16, ax:8, ay:8});
addSheet('dun_chest', 'cf/dungeon/Objects/Chest_anim.png', 8, 'grid', {fw:32, fh:32, ax:16, ay:30});
addSheet('dun_crate', 'cf/dungeon/Objects/crate.png', 1, 'grid', {fw:20, fh:26, ax:10, ay:25});
addSheet('dun_pot', 'cf/dungeon/Objects/pot.png', 1, 'grid', {fw:14, fh:16, ax:7, ay:15});
addSheet('dun_cobweb', 'cf/dungeon/Objects/cobweb.png', 1, 'grid', {fw:18, fh:16, ax:9, ay:0});

// ===========================================================================
//  IN1-Nachlese: die echten Innenraumblaetter.
// ===========================================================================
// IN1 hat die drei Raeume ohne sie gebaut, weil sie im Repo nicht lagen (das
// Pack hat sie, `assets/cf/` traegt aber nur, was das Spiel laedt, und die
// Rohbibliothek liegt aus Lizenzgruenden nirgends). Boden und Wand waren
// deshalb warm ueberfaerbte Kammerblaetter, die Moebel gezeichnet wie der
// Kessel. Seit die Blaetter vorliegen, schneidet sie `tools/innen-zellen.mjs`
// nach `assets/cf/innen/` — zwoelf Dateien, zusammen 7 KB.
//
// **Alle zwoelf sind optional.** Das ist kein Sicherheitsnetz aus Vorsicht,
// sondern eine Reihenfolgefrage: die lizenzierte Grafik kommt im Pages-Build
// aus einem zweiten Repo, und bis die zwoelf Dateien dort liegen, gibt es sie
// im ausgelieferten Spiel nicht. `opt.optional` sagt loadAssets(), dass die
// Luecke erwartet ist (sonst stuenden zwoelf `Sprite fehlt`-Zeilen in jeder
// Konsole, und davor warnt G6 ausdruecklich), und drawInnenMoebel() faellt
// dann auf die gezeichnete Fassung zurueck. Wer die Dateien hat, sieht das
// Pack; wer sie nicht hat, sieht IN1 wie am ersten Tag.
const INN_OPT = {optional: true};
addSheet('innen_boden',       'cf/innen/boden.png',       1, 'raw',  INN_OPT);
addSheet('innen_wand_holz',   'cf/innen/wand_holz.png',   1, 'raw',  INN_OPT);
addSheet('innen_wand_stein',  'cf/innen/wand_stein.png',  1, 'raw',  INN_OPT);
addSheet('innen_wand_ziegel', 'cf/innen/wand_ziegel.png', 1, 'raw',  INN_OPT);
addSheet('innen_regale',      'cf/innen/regale.png',      1, 'raw',  INN_OPT);
addSheet('innen_kamin',       'cf/innen/kamin.png',       1, 'raw',  INN_OPT);
// Die geschnittenen Einzelmoebel als 'grid' mit einem Frame: Anker Fussmitte,
// damit drawSprite() sie wie jedes andere Moebel auf seine Fusslinie stellt.
addSheet('innen_tisch',        'cf/innen/tisch.png',        1, 'grid', {fw:34, fh:33, ax:17, ay:33, optional:true});
addSheet('innen_stuhl',        'cf/innen/stuhl.png',        1, 'grid', {fw:12, fh:23, ax:6,  ay:23, optional:true});
addSheet('innen_pult',         'cf/innen/pult.png',         1, 'grid', {fw:32, fh:21, ax:16, ay:21, optional:true});
addSheet('innen_schreibtisch', 'cf/innen/schreibtisch.png', 1, 'grid', {fw:32, fh:21, ax:16, ay:21, optional:true});
addSheet('innen_kommode',      'cf/innen/kommode.png',      1, 'grid', {fw:32, fh:21, ax:16, ay:21, optional:true});
addSheet('innen_pflanze',      'cf/innen/pflanze.png',      1, 'grid', {fw:16, fh:30, ax:8,  ay:30, optional:true});
// Zweite Nachlese, auf die Frage nach mehr Deko fuer den Letzten Stempel. Das
// Fass und die Bank standen im Ordner "Outdoor decoration" — deshalb hat der
// erste Durchgang durch die Innenraumordner sie nicht gefunden, und deshalb
// stand im Phasendokument, das Pack habe keine Wirtshausbank. Es hat eine.
addSheet('innen_fass',         'cf/innen/fass.png',         1, 'grid', {fw:15, fh:19, ax:7,  ay:19, optional:true});
addSheet('innen_bank',         'cf/innen/bank.png',         1, 'grid', {fw:31, fh:21, ax:15, ay:21, optional:true});
addSheet('innen_hocker',       'cf/innen/hocker.png',       1, 'grid', {fw:9,  fh:13, ax:4,  ay:13, optional:true});
// Zwei Auflagen, keine Moebel: sie stehen auf einem Tisch oder auf der Theke.
addSheet('innen_kerze',        'cf/innen/kerze.png',        1, 'grid', {fw:6,  fh:11, ax:3,  ay:11, optional:true});
addSheet('innen_flasche',      'cf/innen/flasche.png',      1, 'grid', {fw:7,  fh:11, ax:3,  ay:11, optional:true});
// Fenster und Standuhr: die zwei Blaetter, die aus einem Kasten mit Moebeln
// einen Raum machen. Das Fenster haengt in der Wand, die Uhr steht am Boden.
addSheet('innen_fenster',      'cf/innen/fenster.png',      1, 'grid', {fw:14, fh:21, ax:7,  ay:21, optional:true});
addSheet('innen_standuhr',     'cf/innen/standuhr.png',     1, 'grid', {fw:14, fh:30, ax:7,  ay:30, optional:true});
addSheet('innen_scheit',       'cf/innen/scheit.png',       1, 'grid', {fw:25, fh:11, ax:12, ay:11, optional:true});

// --- Zwei Schnittfehler aus G1 ausbessern -----------------------------------
// Drei Requisiten sind in G1 von Hand aus Dungeon_Objects.png geschnitten
// worden: crate, pot, cobweb. Zwei der drei Schnitte haben am Rand ein paar
// Pixel des Nachbarobjekts mitgenommen. Gemessen an der Alphamaske der beiden
// Dateien, nicht geschätzt:
//
//   crate.png   Spalte 19, Zeilen 0..5    sechs Pixel
//   cobweb.png  Spalte 0,  Zeilen 11..15  fünf Pixel
//
// Im Bild standen sie als dunkler Strich neben jeder Kiste und jeder
// Spinnwebe — im Verlies genauso wie in den Innenräumen. Gefunden beim
// Aufräumen der Schankstube: erst sah es aus wie ein Zeichenfehler von IN1,
// dann lag es in der Datei.
//
// Ausgebessert wird hier und nicht in der Datei, und zwar mit Absicht. Die
// lizenzierte Grafik liegt in einem zweiten Repo; ein von Hand nachgemaltes
// PNG wäre genau die Sorte Änderung, die später niemand mehr nachrechnen kann.
// Diese vier Zahlen kann man nachrechnen — tools/innen-pruef.mjs tut es.
const SCHNITT_FLICKEN = {
  dun_crate:  [[19, 0, 1, 6]],
  dun_cobweb: [[0, 11, 1, 5]],
};
function schnittSaeubern(){
  for(const key in SCHNITT_FLICKEN){
    const s = SHEETS[key];
    if(!s || !s.img) continue;
    try {
      const c = document.createElement('canvas');
      c.width = s.img.width; c.height = s.img.height;
      const g = c.getContext('2d');
      g.drawImage(s.img, 0, 0);
      for(const [x, y, w, h] of SCHNITT_FLICKEN[key]) g.clearRect(x, y, w, h);
      s.img = c;
    } catch(e){ console.warn('schnittSaeubern:', key, 'nicht ausbesserbar (' + e.name + ')'); }
  }
}

// ===========================================================================
//  U5: Die Figurenportraets. Seit U4 zeigt die obere Tafelhaelfte einen
//  Ausschnitt aus dem laufenden Sprite, weil das Grafikpack keine Portraets
//  hat. Das Ensemble hat seit dem Bilderlauf vom 22.08. eigene: gemalt, nicht
//  aus dem Pack, und deshalb ohne Lizenzfrage im Repo (assets/figuren/README).
//
//  Was hier geladen wird, ist NICHT die Fassung aus assets/figuren/ — die ist
//  auf 1024 hochskaliert, damit man sie ansehen kann, und wiegt als Satz
//  3.091 KB. Geladen wird die echte 128er-Rechnung aus assets/portraets/,
//  erzeugt mit `python3 tools/figuren-px.py --tafel`: derselbe Bildinhalt in
//  65 KB. assets/figuren bleibt in SKIP_DIRS von build-single.mjs, dieser
//  Ordner steht nicht darin und wird eingebacken.
//
//  'raw', weil jede Datei ein einzelnes Bild ist und kein Blatt mit Frames.
//
//  optional:true ist kein Schoenheitsfehler, sondern die Zusage: fehlt eine
//  Datei, zeichnet gespraechPortrait() weiter den Sprite-Ausschnitt aus U4.
//  Eine erwartete Luecke ist keine Warnung — dieselbe Regel wie bei den fuenf
//  Pack-Blaettern, die nie geliefert wurden.
//
//  Der Schluessel ist der aus DORF_FIGUREN, damit Bild und Figur ohne
//  Zwischentabelle zusammenfinden; portraetAssert() rechnet nach, dass beide
//  Listen sich decken. Knoeterich steht dabei, obwohl er nicht im Dorf steht:
//  er fuehrt den Empfang und damit die Tafel (szeneSprecherKnoeterich).
//
//  G10: Lott und Pahl kommen dazu, und zwar BEIDE mit demselben Bild. U5 hatte
//  sie ausgelassen, weil Motiv 11 ein Doppelportraet ist und ein Zuschnitt dem
//  jeweils anderen die Haare mit ins Bild zoege. Der Zuschnitt bleibt unmoeglich
//  — nur ist das Doppelbild fuer beide die bessere Antwort und nicht die
//  schlechtere. Die zwei sitzen seit W3 auf derselben Bank und sind in jedem
//  ihrer Saetze ein Paar; wer den einen anspricht, sieht beide grinsen, und wer
//  danach den anderen anspricht, sieht dasselbe Bild noch einmal. Das ist der
//  Witz, nicht der Mangel.
//
//  PORTRAET_DATEI haengt beide Schluessel an dieselbe Datei. Sie bekommen je
//  einen eigenen SHEETS-Eintrag (die Tafel sucht ueber figur.key), aber
//  loadAssets() bringt das Bild an einer URL nur einmal — zwei bytegleiche
//  Dateien waeren 7 KB umsonst im Build.
// ===========================================================================
//  T3: 'anlage2' steht am Ende und ist der einzige Eintrag, der keine Person
//  zeigt. Das Portraet ist bis auf Weiteres selbst gezeichnet
//  (tools/anlage2-portraet.py, Motiv nach Bildprompt 21) und wird ersetzt,
//  sobald ein gemaltes vorliegt. Es ist wichtiger als die anderen, nicht
//  unwichtiger: die uebrigen fuenfzehn Figuren haben einen Sprite in der Welt,
//  auf den gespraechPortrait() zurueckfaellt, wenn die Datei fehlt. Anlage 2
//  hat keinen. Sie ist ein Schriftstueck und laeuft nicht im Dorf herum.
const PORTRAET_FIGUREN = ['knoeterich', 'zwirn', 'bramsche', 'zapf', 'lisbeth', 'trepp',
                          'noergel', 'milb', 'pommer', 'fass', 'lott', 'pahl',
                          'nieselbeck', 'umlauf', 'vorblatt', 'anlage2'];
const PORTRAET_DATEI = {lott: 'lott-pahl', pahl: 'lott-pahl'};
const portraetBlatt = k => 'portraet_' + k;
for(const k of PORTRAET_FIGUREN)
  addSheet(portraetBlatt(k), `portraets/${PORTRAET_DATEI[k] || k}.png`, 1, 'raw', {optional:true});

// G3: mehrere SHEET_LIST-Eintraege (ein Anim je Rig-Zeile) zeigen oft auf dieselbe
// Datei (rowStart unterscheidet sie) — ein Image pro url statt pro Key laden,
// sonst dekodiert der Browser dasselbe PNG bis zu 7x.
function loadAssets(){
  const imgPromises = new Map(); // url -> Promise<Image|null>
  function loadImage(src){
    let p = imgPromises.get(src);
    if(!p){
      p = new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });
      imgPromises.set(src, p);
    }
    return p;
  }
  return Promise.all(SHEET_LIST.map(([key, url, n, mode, opt]) => {
    // G6: Im Einzeldatei-Build ist ASSET_BLOBS die vollständige Liste dessen, was
    // build-single.mjs unter assets/ gefunden hat. Was dort fehlt, gibt es nicht,
    // und ein Ladeversuch wäre ein sicherer 404 in der Konsole des Spielers.
    // Im Quellbaum (ASSET_BLOBS null) wird geladen wie bisher.
    const src = ASSET_BLOBS ? ASSET_BLOBS[url] : url;
    return (src ? loadImage(src) : Promise.resolve(null)).then(img => {
      // opt.optional heißt: dieses Blatt darf fehlen, der Aufrufer hat einen
      // Ersatzweg. Bisher meldete jedes fehlende Blatt eine Warnung, und die
      // fünf, die im Paket nie lagen, standen seit W3 dauerhaft in der Konsole.
      // Eine erwartete Lücke ist keine Warnung; gemeldet wird sie trotzdem,
      // gesammelt und einmal, von bakeAllNpcSheets().
      if(!img){ if(!(opt && opt.optional)) console.warn('Sprite fehlt:', url); assetsLoaded++; return; }
      let fw, fh, cols, ax, ay;
      let rowStart = 0;
      if(mode === 'raw'){ fw = img.width; fh = img.height; cols = 1; ax = 0; ay = 0; }
      else if(mode === 'grid'){ fw = opt.fw; fh = opt.fh; cols = Math.max(1, Math.round(img.width/fw)); ax = opt.ax; ay = opt.ay; rowStart = opt.rowStart || 0; }
      else { fw = img.width/n; fh = img.height; cols = n; ax = fw/2; ay = fh; }
      SHEETS[key] = {img, cols, n, fw, fh, ax, ay, rowStart};
      assetsLoaded++;
    });
  }));
}

// Eingefärbte Kopie eines Sheets — einmalig gebacken, danach aus dem Cache.
// source-atop färbt nur sichtbare Pixel, alpha<1 lässt die Schattierung durch.
// G3: nur die Zeilen backen, die dieser Key tatsächlich benutzt (rowStart..+rows),
// nicht das ganze PNG — bei den großen CF-Rig-Sheets (bis 512x832, 7 Anim-Keys pro
// Datei) wäre ein Ganz-Sheet-Bake pro Tint ~172 MB Canvas und ein Mehr-ms-Hänger
// beim ersten Treffer mitten im Frame. Zeilenweise sind es ~16 MB, siehe G3-Notizen.
// R6/F30: Der Cache-Schlüssel war key+'|'+color+'|'+alpha, also eine Stringallokation
// pro getöntem Sprite pro Frame — die einzige Allokation im Renderpfad, die mit der
// Hordengröße skaliert (gemessen 37 Aufrufe/Frame bei 45 Monstern in der Horde).
// Dreistufig über Maps kostet dieselben drei Vergleiche ohne Allokation.
const TINT_CACHE = new Map();
function tintedSheet(key, color, alpha){
  const byColor = TINT_CACHE.get(key);
  if(byColor !== undefined){
    const byAlpha = byColor.get(color);
    if(byAlpha !== undefined){
      const hit = byAlpha.get(alpha);
      if(hit !== undefined) return hit;
    }
  }
  const s = SHEETS[key]; if(!s) return null;
  const rows = Math.max(1, Math.ceil(s.n / s.cols));
  const srcY = (s.rowStart||0) * s.fh;
  const c = document.createElement('canvas');
  c.width = s.img.width; c.height = rows * s.fh;
  const cc = c.getContext('2d');
  cc.drawImage(s.img, 0, srcY, c.width, c.height, 0, 0, c.width, c.height);
  cc.globalCompositeOperation = 'source-atop';
  cc.globalAlpha = alpha;
  cc.fillStyle = color;
  cc.fillRect(0, 0, c.width, c.height);
  let bc = TINT_CACHE.get(key); if(bc === undefined){ bc = new Map(); TINT_CACHE.set(key, bc); }
  let ba = bc.get(color);       if(ba === undefined){ ba = new Map(); bc.set(color, ba); }
  ba.set(alpha, c);
  return c;
}

// ===========================================================================
//  P1: Haar in einer Farbe, die es im Grafikpaket nicht gibt.
// ===========================================================================
// Nicht als Tönung: tintedSheet() legt mit 'source-atop' eine halbdurchsichtige
// Fläche auf und lässt die Grundfarbe durchscheinen. Aus Schwarz (Hair_3) und
// Grün wird dabei Dunkelgrün, aus Orange (Hair_4) und Blau ein Grau. Genau die
// Unterscheidbarkeit, um die es hier geht, ginge damit verloren.
//
// Auch nicht über die Blendmodi 'screen' und 'color'. Das war der erste Bau und
// funktionierte für vier der sechs Frisuren: 'color' setzt Farbton und Sättigung
// und lässt die Helligkeit des Blattes stehen — und die Blätter sind eben nicht
// gleich hell. Hair_3 ist schwarz, Hair_2 ist blond. Dasselbe Warnorange ergab
// auf dem einen ein dunkles Braun und auf dem anderen ein blasses Pfirsich, und
// blass war genau das, was hier nicht sein soll.
//
// Also pixelweise und mit gemessener Spanne. Je Blatt wird einmal ermittelt, wie
// dunkel sein dunkelster und wie hell sein hellster undurchsichtiger Pixel ist.
// Diese Spanne wird auf ein festes Band um die Helligkeit der Zielfarbe gelegt:
// die Schattierung des Blattes bleibt in ihrer Abstufung erhalten (heller Pixel
// bleibt heller Pixel), aber Ausgangslage und Umfang sind für alle sechs
// Frisuren dieselben. Das Ergebnis ist auf jedem Blatt dieselbe Farbe.
//
// Einmal je Blatt und Farbe gebacken, danach aus dem Cache. Gebacken werden nur
// die Zeilen, die der Key wirklich benutzt (gleiche Regel wie tintedSheet), das
// sind bei den Haar-Layern 576x64 statt 576x3584.
//
// G8: die Rechnung hieß bis hierher haarBlatt() und konnte immer schon mehr, als
// ihr Name zugab — sie kennt keine Frisur, sie kennt ein Blatt und eine
// Zielfarbe. Seit G8 laufen auch Hemd und Hose darüber, damit die Dorffiguren
// die Farben ihres gemalten Porträts tragen können und nicht die fünf, die das
// Grafikpaket mitbringt. Deshalb heißt sie jetzt farbBlatt(); an der Rechnung
// hat sich nichts geändert.
//
// merken=false umgeht den Cache. Der Spieler wechselt Haar und Rüstung im
// laufenden Spiel und backt deshalb immer wieder dieselben Kombinationen — für
// ihn ist der Cache der ganze Sinn. Die Dorffiguren werden genau einmal beim
// Laden gebacken; ihre 69 umgefärbten Blätter blieben danach für immer im
// Speicher liegen, ohne je wieder gelesen zu werden. Nachgezählt und nicht
// geschätzt: 69 Blätter zu je 576x64 sind 9,7 MB.
const FARB_CACHE = new Map();
const FARB_BAND = 0.22;      // halbe Breite des Helligkeitsbands um die Zielfarbe

// #rrggbb -> {h, s, l}. Klein gehalten und nur hier gebraucht: es gibt im ganzen
// Spiel sonst keine Farbrechnung, eine allgemeine Farbbibliothek wäre Ballast.
function hexHsl(hex){
  const r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b), l = (max+min)/2, d = max-min;
  if(!d) return {h:0, s:0, l};
  const s = l > 0.5 ? d/(2-max-min) : d/(max+min);
  const h = max === r ? ((g-b)/d + (g < b ? 6 : 0)) : max === g ? (b-r)/d + 2 : (r-g)/d + 4;
  return {h: h/6, s, l};
}
function hslKanal(p, q, t){
  if(t < 0) t += 1; if(t > 1) t -= 1;
  if(t < 1/6) return p + (q-p)*6*t;
  if(t < 1/2) return q;
  if(t < 2/3) return p + (q-p)*(2/3 - t)*6;
  return p;
}

function farbBlatt(key, hex, merken){
  const ck = key + '|' + hex;
  if(merken !== false){ const hit = FARB_CACHE.get(ck); if(hit !== undefined) return hit; }
  const s = SHEETS[key]; if(!s || !s.img) return null;
  const rows = Math.max(1, Math.ceil(s.n / s.cols));
  const c = document.createElement('canvas');
  c.width = s.img.width; c.height = rows * s.fh;
  const cc = c.getContext('2d', {willReadFrequently:true});
  cc.drawImage(s.img, 0, (s.rowStart||0)*s.fh, c.width, c.height, 0, 0, c.width, c.height);

  let bild;
  // getImageData wirft bei einem fremdorigin geladenen Blatt. Dann bleibt das
  // Haar in seinem Naturton (blitFarbFrame fällt auf blitLayerFrame zurück),
  // statt dass ein Wurf auf Skriptebene den Rest mitreißt. Gleiche Vorsicht wie
  // in npcAnkerAssert().
  try { bild = cc.getImageData(0, 0, c.width, c.height); }
  catch(e){ FARB_CACHE.set(ck, null); console.warn('farbBlatt: Blatt nicht lesbar', key, e.name); return null; }

  const d = bild.data;
  let lo = 1, hi = 0;
  for(let i = 0; i < d.length; i += 4){
    if(d[i+3] <= 8) continue;
    const l = (Math.max(d[i], d[i+1], d[i+2]) + Math.min(d[i], d[i+1], d[i+2])) / 510;
    if(l < lo) lo = l;
    if(l > hi) hi = l;
  }
  const ziel = hexHsl(hex);
  const l0 = Math.max(0.06, ziel.l - FARB_BAND), l1 = Math.min(0.94, ziel.l + FARB_BAND);
  const spanne = hi - lo;
  for(let i = 0; i < d.length; i += 4){
    if(d[i+3] <= 8) continue;
    const l = (Math.max(d[i], d[i+1], d[i+2]) + Math.min(d[i], d[i+1], d[i+2])) / 510;
    const t = spanne > 0.001 ? (l - lo) / spanne : 0.5;
    const L = l0 + t * (l1 - l0);
    const q = L < 0.5 ? L * (1 + ziel.s) : L + ziel.s - L * ziel.s, p = 2*L - q;
    d[i]   = Math.round(hslKanal(p, q, ziel.h + 1/3) * 255);
    d[i+1] = Math.round(hslKanal(p, q, ziel.h) * 255);
    d[i+2] = Math.round(hslKanal(p, q, ziel.h - 1/3) * 255);
  }
  cc.putImageData(bild, 0, 0);
  if(merken !== false) FARB_CACHE.set(ck, c);
  return c;
}

// G8: Hose aus Hemd. Die Porträts enden an der Brust, eine gemessene Hosenfarbe
// gibt es also für niemanden. Statt fünfzehn Werte zu erfinden, wird sie
// abgeleitet: derselbe Farbton, um ein Viertel abgedunkelt. Das ist die
// Beobachtung an den Porträts selbst — Zapfs Latzhose ist dunkler als sein
// Hemd, Vorblatts Mantel dunkler als sein Kragen — und es hält die Figur in
// einer Farbfamilie, statt sie zweifarbig auseinanderfallen zu lassen.
const HOSE_DUNKLER = 0.72;
function dunkler(hex, f){
  if(!hex) return hex;
  const z = n => Math.max(0, Math.min(255, Math.round(parseInt(hex.slice(n, n+2), 16) * f)));
  return '#' + [1, 3, 5].map(n => z(n).toString(16).padStart(2, '0')).join('');
}

// ===========================================================================
//  G9: Haut umfärben, und zwar nur die Haut.
//
//  Nörgel ist ein Kobold. Seit W3 bekam er dafür eine Tönung über die ganze
//  Figur — grün lag dann auch auf seinem Hemd, seiner Hose und seinen Schuhen,
//  und damit die Tönung das Bild nicht zukleisterte, musste sie schwach bleiben
//  (0.22). Das Ergebnis war ein Mensch mit einem Grünstich, kein Kobold.
//
//  farbBlatt() taugt hier nicht. Sie legt die Helligkeitsspanne des ganzen
//  Blattes auf ein Band um die Zielfarbe und färbt jeden Pixel — auf dem
//  Körperblatt sitzen aber Gesicht, Augen und Kontur. Aus zwei Augen und einem
//  Mund würde eine grüne Fläche.
//
//  Diese Rechnung geht deshalb andersherum vor: sie sucht die Haut und lässt
//  alles andere in Ruhe. Ein Pixel gilt als Haut, wenn sein Farbton im warmen
//  Fenster liegt (HAUT_VON bis HAUT_BIS, über den Rot-Nullpunkt hinweg) und er
//  bunt genug ist (HAUT_SAT). Augen, Zähne, Weißes und die dunklen Konturen
//  sind unbunt oder liegen außerhalb und bleiben unangetastet.
//
//  Was ein Hautpixel behält, ist seine eigene Helligkeit. Nur Farbton und
//  Sättigung kommen von der Zielfarbe. Damit bleibt die gesamte Schattierung
//  des Gesichts erhalten — die Figur wird grün, nicht flach.
//
//  Die drei Konstanten sind am Cute-Fantasy-Hautton angesetzt (ein warmes
//  Orange) und bewusst weit gefasst: lieber ein Schattenrand zu viel mitgefärbt
//  als eine Wange zu wenig. Wer sie nachziehen will, misst sie mit
//  `node tools/figuren-kontaktbogen.mjs` am Bild nach.
// ===========================================================================
const HAUT_VON = 0.94, HAUT_BIS = 0.14;   // Farbtonfenster über den Rot-Nullpunkt hinweg
const HAUT_SAT = 0.12;                     // darunter ist ein Pixel unbunt (Auge, Kontur, Weißes)

function hautBlatt(key, hex, merken){
  const ck = 'haut|' + key + '|' + hex;
  if(merken !== false){ const hit = FARB_CACHE.get(ck); if(hit !== undefined) return hit; }
  const s = SHEETS[key]; if(!s || !s.img) return null;
  const rows = Math.max(1, Math.ceil(s.n / s.cols));
  const c = document.createElement('canvas');
  c.width = s.img.width; c.height = rows * s.fh;
  const cc = c.getContext('2d', {willReadFrequently:true});
  cc.drawImage(s.img, 0, (s.rowStart||0)*s.fh, c.width, c.height, 0, 0, c.width, c.height);

  let bild;
  // Gleiche Vorsicht wie in farbBlatt(): ein fremdorigin geladenes Blatt wirft
  // hier, und dann bleibt die Haut in ihrem Naturton statt dass der Wurf den
  // Rest mitreisst.
  try { bild = cc.getImageData(0, 0, c.width, c.height); }
  catch(e){ FARB_CACHE.set(ck, null); console.warn('hautBlatt: Blatt nicht lesbar', key, e.name); return null; }

  const d = bild.data;
  const ziel = hexHsl(hex);
  for(let i = 0; i < d.length; i += 4){
    if(d[i+3] <= 8) continue;
    const r = d[i]/255, g = d[i+1]/255, b = d[i+2]/255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), dd = mx - mn;
    if(!dd) continue;                                   // reines Grau: Kontur oder Auge
    const l = (mx + mn) / 2;
    const sat = l > 0.5 ? dd/(2-mx-mn) : dd/(mx+mn);
    if(sat < HAUT_SAT) continue;                        // zu blass für Haut
    let h = mx === r ? ((g-b)/dd + (g < b ? 6 : 0)) : mx === g ? (b-r)/dd + 2 : (r-g)/dd + 4;
    h /= 6;
    if(!(h >= HAUT_VON || h <= HAUT_BIS)) continue;     // nicht im warmen Fenster
    // Eigene Helligkeit behalten, Farbton und Sättigung von der Zielfarbe.
    const q = l < 0.5 ? l * (1 + ziel.s) : l + ziel.s - l * ziel.s, pp = 2*l - q;
    d[i]   = Math.round(hslKanal(pp, q, ziel.h + 1/3) * 255);
    d[i+1] = Math.round(hslKanal(pp, q, ziel.h) * 255);
    d[i+2] = Math.round(hslKanal(pp, q, ziel.h - 1/3) * 255);
  }
  cc.putImageData(bild, 0, 0);
  if(merken !== false) FARB_CACHE.set(ck, c);
  return c;
}

// Wie blitFarbFrame, nur mit der Hautrechnung. Ohne hex derselbe gewöhnliche Weg.
function blitHautFrame(destCtx, key, hex, frame, dx, dy, merken){
  if(!hex) return blitLayerFrame(destCtx, key, frame, dx, dy);
  const s = SHEETS[key]; if(!s || !s.img) return;
  const src = hautBlatt(key, hex, merken); if(!src) return blitLayerFrame(destCtx, key, frame, dx, dy);
  const i = ((frame|0) % s.n + s.n) % s.n;
  destCtx.drawImage(src, (i % s.cols)*s.fw, ((i/s.cols)|0)*s.fh, s.fw, s.fh, dx, dy, s.fw, s.fh);
}

// Zeichnet Frame mit Anker im aktuellen Transform-Ursprung (für exotische Skalierung).
function drawSpriteAt(key, frame, tint, tintA){
  const s = SHEETS[key]; if(!s) return;
  const n = s.n, i = ((frame|0) % n + n) % n;
  const localRow = (i/s.cols)|0;
  const src = tint ? (tintedSheet(key, tint, tintA == null ? 0.55 : tintA) || s.img) : s.img;
  // Die getönte Kopie enthält nur die Zeilen ab rowStart, deshalb dort ohne Offset lesen.
  const row = tint ? localRow : (s.rowStart||0) + localRow;
  ctx.drawImage(src, (i % s.cols)*s.fw, row*s.fh, s.fw, s.fh, -s.ax, -s.ay, s.fw, s.fh);
}

function drawSprite(key, frame, x, y, scale, flip, tint, tintA){
  const s = SHEETS[key]; if(!s) return;
  ctx.save();
  ctx.translate(x, y);
  if(scale && scale !== 1) ctx.scale(scale, scale);
  if(flip) ctx.scale(-1, 1);
  drawSpriteAt(key, frame, tint, tintA);
  ctx.restore();
}

// U12: ein Sinnbild ins Bild malen, mittig auf (x,y). Vier Dinge im Dorf waren
// bis U12 Emoji, die ctx.fillText mit einer Serifenschrift gezeichnet hat: der
// Muenzhaufen, der Trank, das Symbolschloss und die Aktentafel. Sie lagen damit
// als glaenzende Systemgrafik zwischen lauter Pixelkunst, und anders als im
// Menue stand daneben kein Text, der es erklaert haette.
//
// Der Ersatzweg ist derselbe wie bei den Knoepfen und aus demselben Grund: ohne
// Zelle wird das Emoji gezeichnet, das der Aufrufer mitgibt. Deshalb steht die
// Schriftgroesse hier auch nicht im Aufrufer — wer 17px Serife will, bekommt
// eine Kantenlaenge von 16 mit derselben Zahl, und beide Wege treffen dieselbe
// Stelle im Bild.
function zeichneIco(key, ersatz, x, y, kante){
  const s = SHEETS['ico_' + key];
  if(s && s.img && s.img.complete && s.img.naturalWidth){
    const k = kante || 16;
    // Ganzzahlige Kante und ganzzahlige Ecke: eine Zelle von 16 auf 17 gedehnt
    // waere hier derselbe Fehler wie der auf dem Schlagknopf in U10.
    ctx.drawImage(s.img, Math.round(x - k/2), Math.round(y - k/2), k, k);
    return;
  }
  ctx.fillText(ersatz, x, y + (kante || 16) * 0.36);
}

// Frameindex aus Laufzeit. loop=false klemmt am letzten Frame fest.
function animFrame(key, t, fps, loop){
  const s = SHEETS[key]; if(!s) return 0;
  const f = Math.floor(t * fps);
  return (loop === false) ? Math.min(f, s.n - 1) : f % s.n;
}
function animLen(key, fps){ const s = SHEETS[key]; return s ? s.n / fps : 0; }

// ===========================================================================
//  Held-Komposit (Phase G2, Regressionsregel 10/12): Legs/Feet/Body/Chest/Haar/
//  Hände werden EINMAL pro Ausrüstungswechsel auf ein Offscreen-Canvas gebacken
//  (SHEETS['hero_baked']), damit drawPlayer() im Frame nur noch einen einzigen
//  Sprite blittet statt 5 Layer einzeln zu zeichnen.
// ===========================================================================
let BAKED_HERO_ANIM = null;                 // {idle:{offset,n}, walk:{...}, ...}
let bakedFor = null;                        // Dirty-Check: 'armorTier|bootsTier|hair'

function blitLayerFrame(destCtx, key, frame, dx, dy){
  const s = SHEETS[key]; if(!s || !s.img) return;
  const i = ((frame|0) % s.n + s.n) % s.n;
  const row = (s.rowStart||0) + ((i/s.cols)|0);
  destCtx.drawImage(s.img, (i % s.cols)*s.fw, row*s.fh, s.fw, s.fh, dx, dy, s.fw, s.fh);
}

// P1: dasselbe für die umgefärbte Kopie. Sie enthält nur die Zeilen ab rowStart,
// deshalb wird hier ohne den Zeilenversatz gelesen (gleiche Regel wie bei den
// getönten Kopien in drawSpriteAt). hex leer heißt Naturton, dann läuft es über
// den gewöhnlichen Weg — so bleibt eine Figur ohne eigene Farbe unangetastet.
function blitFarbFrame(destCtx, key, hex, frame, dx, dy, merken){
  if(!hex) return blitLayerFrame(destCtx, key, frame, dx, dy);
  const s = SHEETS[key]; if(!s || !s.img) return;
  const src = farbBlatt(key, hex, merken); if(!src) return blitLayerFrame(destCtx, key, frame, dx, dy);
  const i = ((frame|0) % s.n + s.n) % s.n;
  destCtx.drawImage(src, (i % s.cols)*s.fw, ((i/s.cols)|0)*s.fh, s.fw, s.fh, dx, dy, s.fw, s.fh);
}

function bakeHeroSheet(){
  if(!assetsReady) return;                  // Assets noch nicht da — recalc() bäckt nach dem Laden nach
  const armorTier = player.equip.armor ? clamp(player.equip.armor.base.tier||0, 0, 4) : -1;
  const bootsTier  = player.equip.boots ? clamp(player.equip.boots.base.tier||0, 0, 4)  : -1;
  const dirtyKey = `${armorTier}|${bootsTier}|${player.hair}|${player.haarTon}`;
  if(dirtyKey === bakedFor) return;
  bakedFor = dirtyKey;

  const totalFrames = CF_HERO_ANIMS.reduce((s, [,,n]) => s+n, 0);
  const canvas = document.createElement('canvas');
  canvas.width = totalFrames * 64; canvas.height = 64;
  const bctx = canvas.getContext('2d');

  const anims = {};
  let offset = 0;
  for(const [anim, , n] of CF_HERO_ANIMS){
    anims[anim] = {offset, n};
    for(let f=0; f<n; f++){
      const dx = (offset+f)*64;
      if(armorTier >= 0) blitLayerFrame(bctx, `cflegs_${armorTier}_${anim}`, f, dx, 0);
      if(bootsTier >= 0) blitLayerFrame(bctx, `cffeet_${bootsTier}_${anim}`, f, dx, 0);
      blitLayerFrame(bctx, `cfbody_${anim}`, f, dx, 0);
      if(armorTier >= 0) blitLayerFrame(bctx, `cfchest_${armorTier}_${anim}`, f, dx, 0);
      blitFarbFrame(bctx, `cfhair_${player.hair}_${anim}`, haarHex(player.haarTon), f, dx, 0);
      blitLayerFrame(bctx, `cfhands_${anim}`, f, dx, 0);
    }
    offset += n;
  }
  anims.death = anims.hurt;   // kein eigenes Sterbe-Frame, siehe CF_HERO_ANIMS-Kommentar oben
  BAKED_HERO_ANIM = anims;
  SHEETS['hero_baked'] = {img:canvas, cols:totalFrames, n:totalFrames, fw:64, fh:64, ax:CF_ANCHOR.ax, ay:CF_ANCHOR.ay, rowStart:0};
  TINT_CACHE.delete('hero_baked');   // getönte Kopien des alten Bakes verwerfen (Haar/Rüstung geändert)
  renderHudPortrait();               // U7: das Lichtbild oben links haengt am selben Bake
}

// U7: Das Lichtbild der Statuskarte. Derselbe Ausschnitt wie im Dienstausweis
// (renderAusweisFoto, s. dort fuer die Herkunft der vier Zahlen) und aus
// demselben Blatt — also traegt es Haarton, Frisur und Ruestungsstufe der
// laufenden Schicht, ohne dass hier eine Zeile davon weiss.
//
// Gerufen aus bakeHeroSheet() und nicht aus updateHUD(): das Bild aendert sich
// genau dann, wenn das Blatt neu gebacken wird (Ausruestung, Haar, Schichtstart),
// und bakeHeroSheet() hat dafuer schon seinen Dirty-Check. Ein drawImage je
// Frame waere derselbe Fehler, den R6/F32 an anderer Stelle abgestellt hat.
function renderHudPortrait(){
  const cv = el('hudPortrait'); if(!cv) return;
  const c = cv.getContext('2d');
  c.imageSmoothingEnabled = false;
  c.clearRect(0, 0, cv.width, cv.height);
  const sh = SHEETS['hero_baked'];
  if(!sh || !BAKED_HERO_ANIM) return;   // vor loadAssets(): leerer Ring, kein Fehler
  const sx = BAKED_HERO_ANIM.idle.offset * 64 + 24;
  // 1:1 in eine 16x18-Flaeche: die Vergroesserung macht CSS mit
  // image-rendering:pixelated, also nearest neighbour bei JEDER Ringgroesse.
  // Ein groesserer Puffer haette bei 52 Pixeln Ring krumm skaliert.
  c.drawImage(sh.img, sx, 20, 16, 18, 0, 0, cv.width, cv.height);
}

// ===========================================================================
//  W3: NPC-Komposit aus dem Helden-Rig (Bramsche, Lott, Pahl), gleiches Prinzip
//  wie bakeHeroSheet(), aber genau einmal gebacken — diese Figuren wechseln nie
//  die Kleidung, ein Dirty-Check wäre Ballast.
//
//  G6: nicht mehr nur Idle. Eine Figur, die wandert, braucht auch die Laufreihe,
//  sonst schliddert sie im Standbild über den Platz. Welche Reihe wie viele
//  Frames hat, steht in CF_HERO_ANIMS und wird von dort gelesen statt hier noch
//  einmal behauptet.
//
//  G8: das Komposit trägt jetzt Farbe. Bis hierher konnte eine Figur nur unter
//  dem wählen, was das Grafikpaket geschnitten hat: sechs Frisuren in ihrer
//  Auslieferungsfarbe, fünf Hemden, fünf Hosen, fünf Paar Schuhe. Bramsches
//  Turmknoten musste deshalb schwarz sein, weil Blatt 3 schwarz ist, und
//  Knöterich trug Frisur 5, weil das die graue war — die Silhouette folgte der
//  Farbe statt umgekehrt.
//
//  Über farbBlatt() ist das aufgehoben: haarFarbe, hemdFarbe und hoseFarbe sind
//  freie Hexwerte, und die Frisur wird nach ihrer Form gewählt. Die Werte sind
//  an den Porträts gemessen (`python3 tools/portraet-farben.py`, Einzelheiten
//  in phase-g8-figurenfarben.md), nicht ausgesucht.
//
//  G9 hebt zwei Beschränkungen von G8 auf. Die Kleidung heißt nicht mehr nach
//  einer Rüstungsstufe, sondern nach dem Kleidungsstück (CF_GARDEROBE), und es
//  ist eine Kopfbedeckung dazugekommen. Und der Körper bleibt nicht länger
//  außen vor: hautBlatt() sucht die Haut und lässt Augen und Konturen stehen,
//  Nörgel ist damit ein grüner Kobold statt eines Menschen mit Grünstich.
//
//  Die Hose ist weiterhin der einzige abgeleitete Wert (aus dem Hemd, siehe
//  HOSE_DUNKLER), weil die Porträts an der Brust enden.
// ===========================================================================
const HERO_ANIM_N = {};
for(const [anim, , n] of CF_HERO_ANIMS) HERO_ANIM_N[anim] = n;

function bakeNpcSheet(key, gestalt, anim){
  const n = HERO_ANIM_N[anim] || 6;
  // Ohne hemdFarbe bleibt auch die Hose auf ihrer Paketfarbe: eine abgedunkelte
  // Ableitung aus nichts wäre nichts, und dunkler() gibt hex unverändert zurück.
  const hoseFarbe = gestalt.hoseFarbe || dunkler(gestalt.hemdFarbe, HOSE_DUNKLER);
  // G9: Der Hut nimmt die Kopffarbe, wenn er keine eigene hat. Bei Trepp und
  // Nieselbeck ist die gemessene Scheitelfarbe ohnehin die Mütze — sie sitzt
  // jetzt auf der Mütze statt auf einer Frisur, die eine sein sollte.
  const hutFarbe = gestalt.hutFarbe || gestalt.haarFarbe;
  const canvas = document.createElement('canvas');
  canvas.width = n * 64; canvas.height = 64;
  const bctx = canvas.getContext('2d');
  // G9-Nachtrag: nicht mehr der Formname direkt, sondern das Blatt, das es
  // wirklich gibt. Ohne diesen Umweg blieb bei einer fehlenden Datei einfach
  // eine Ebene weg, und die Figur stand ohne sie da (s. CF_GARDEROBE_ERSATZ).
  // Einmal je Blatt und nicht je Frame: die Auswahl haengt am Anim, nicht am f.
  const hoseB  = gestalt.hose  && garderobeBlatt('hose',  gestalt.hose,  anim);
  const schuhB = gestalt.schuh && garderobeBlatt('schuh', gestalt.schuh, anim);
  const hemdB  = gestalt.hemd  && garderobeBlatt('hemd',  gestalt.hemd,  anim);
  const hutB   = gestalt.hut   && garderobeBlatt('hut',   gestalt.hut,   anim);
  for(let f = 0; f < n; f++){
    const dx = f * 64;
    // merken:false — diese Blätter werden genau einmal gebraucht, hier. Siehe
    // den Kommentar bei FARB_CACHE.
    if(hoseB)  blitFarbFrame(bctx, hoseB,  hoseFarbe,          f, dx, 0, false);
    if(schuhB) blitFarbFrame(bctx, schuhB, gestalt.schuhFarbe, f, dx, 0, false);
    // Körper und Hände sind beide Haut und bekommen denselben Ton — ein Kobold
    // mit grünem Gesicht und rosa Händen wäre ein neuer Fehler.
    blitHautFrame(bctx, `cfbody_${anim}`, gestalt.hautFarbe, f, dx, 0, false);
    if(hemdB) blitFarbFrame(bctx, hemdB, gestalt.hemdFarbe, f, dx, 0, false);
    blitFarbFrame(bctx, `cfhair_${gestalt.hair}_${anim}`, gestalt.haarFarbe, f, dx, 0, false);
    if(hutB)  blitFarbFrame(bctx, hutB,  hutFarbe,           f, dx, 0, false);
    blitHautFrame(bctx, `cfhands_${anim}`, gestalt.hautFarbe, f, dx, 0, false);
  }
  SHEETS[key] = {img:canvas, cols:n, n, fw:64, fh:64, ax:CF_ANCHOR.ax, ay:CF_ANCHOR.ay, rowStart:0};
}

// G6: Welches Blatt eine Dorffigur wirklich bekommt.
//
// Der Fund, der diesen Abschnitt erzwungen hat: fünf der acht in CF_NPCS
// eingetragenen Blätter liegen gar nicht im Grafikpaket (Chef_Chloe,
// Bartender_Bruno, Fisherman_Fin, Lumberjack_Jack, Farmer_Buba). loadAssets()
// meldet sie als "Sprite fehlt", SHEETS bleibt für sie leer, drawSprite() kehrt
// bei einem fehlenden Key still um — Zapf, Lisbeth, Trepp, Milb und Fass standen
// also unsichtbar im Dorf. Ansprechbar, mit Blase, mit Namen über dem Kopf, aber
// ohne Körper. Kein Guard hat das gemeldet, weil bis dahin nur Zeilenzahl und
// Registrierung geprüft wurden.
//
// Statt sie an ein fremdes Blatt zu hängen (dann liefen zwei Figuren mit
// demselben Gesicht herum), bekommen sie dasselbe Held-Komposit wie Bramsche,
// Lott und Pahl, nur zusätzlich mit Laufreihe. Jede Figur trägt dafür in
// gestalt:{} ihr eigenes Aussehen. Legt jemand die Blätter später ins Paket,
// greift der erste Zweig hier von selbst wieder auf sie zu, ohne dass eine
// Zeile zurückgebaut werden muss.
//
// G8: genau dieses Zurückgreifen ist jetzt das Problem. Ein Paketblatt zeigt
// Farmer Bob, Bartender Katy und Miner Mike — fertige Figuren, an denen sich
// nichts einstellen lässt. Seit die Porträts da sind, ist das der sichtbare
// Bruch: Bürgermeister Zwirn ist auf seinem Bild ein feister Amtsträger mit
// Ordenskette und im Dorf ein Bauer, Herr Pommer ist auf seinem Bild ein
// hagerer Mann mit Halbmondbrille und im Dorf eine Wirtin.
//
// komposit:true entscheidet das je Figur zugunsten des Porträts. Es ist eine
// Zeile in DORF_FIGUREN und keine Weiche im Code: wer das Paketblatt für die
// bessere Figur hält, streicht das Flag bei ihr und bekommt es zurück. Die
// acht Blätter bleiben deshalb geladen und CF_NPCS steht unverändert.
function npcBlaetter(nd){
  // G10: ein Monsterrig schlaegt alles. Nicht jede Figur des Ensembles ist ein
  // Mensch — Noergel ist ein Kobold, und das Helden-Rig hat keine spitzen Ohren.
  // Statt sie ihm anzumalen, bekommt er das Blatt, auf dem sie schon sind.
  // CF_RIGS traegt sieben Voelker, die im Kessel ohnehin geladen werden; ein
  // Rig kostet hier also keine Datei, nur eine Zeile.
  //
  // Kein 'else': faellt das Rigblatt aus (im Quellbaum ohne Grafikpaket), greift
  // darunter derselbe Weg wie bisher, und die Figur steht als Komposit da.
  if(nd.rig && (!assetsReady || SHEETS[`${nd.rig}_idle`]))
    return {idle:`${nd.rig}_idle`, walk:`${nd.rig}_walk`};
  if(nd.opt !== 'fest' && !nd.komposit && (!assetsReady || SHEETS[`cfnpc_${nd.sheet}_idle`]))
    return {idle:`cfnpc_${nd.sheet}_idle`, walk:`cfnpc_${nd.sheet}_walk`};
  if(nd.opt === 'fest') return {idle:`npc_baked_${nd.key}`, walk:`npc_baked_${nd.key}`};
  return {idle:`npc_baked_${nd.key}`, walk:`npc_baked_${nd.key}_lauf`};
}

function bakeAllNpcSheets(){
  const ersetzt = [];
  // G8: Knöterich steht nicht in DORF_FIGUREN (er ist älter als die Tabelle),
  // trägt aber dasselbe Komposit. Vorher buk ihn erst der Empfang, und die
  // Weltfigur zeichnete daneben Körper und Haar einzeln — zwei Wege zu einem
  // Aussehen. Jetzt gibt es nur diesen, und drawAlter() blittet ein Sprite.
  bakeNpcSheet(EMPFANG_BLATT, KN_GESTALT, 'idle');
  for(const f of DORF_FIGUREN){
    if(f.opt === 'fest'){ bakeNpcSheet(`npc_baked_${f.key}`, f.gestalt, 'idle'); continue; }
    // komposit:true heißt: das Porträt hat gegen das Paketblatt entschieden, es
    // wird gebacken, auch wenn das Blatt daliegt (siehe npcBlaetter()).
    if(!f.komposit && SHEETS[`cfnpc_${f.sheet}_idle`]) continue;   // eigenes Blatt ist da, kein Ersatz nötig
    bakeNpcSheet(`npc_baked_${f.key}`, f.gestalt, 'idle');
    bakeNpcSheet(`npc_baked_${f.key}_lauf`, f.gestalt, 'run');
    if(!f.komposit) ersetzt.push(f.key);
  }
  // Eine Zeile statt zehn Warnungen, und sie sagt, was Sache ist: nicht "kaputt",
  // sondern "nicht im Paket, Ersatz steht". Wer die Blätter lizenziert und nach
  // assets/cf/deco/NPCs/ legt, sieht die Zeile beim nächsten Start verschwinden.
  if(ersetzt.length) console.log(`G6 Dorfsicht: ${ersetzt.length} von ${Object.keys(CF_NPCS).length} NPC-Blättern`
    + ` liegen nicht im Grafikpaket, diese Figuren laufen als Held-Komposit: ${ersetzt.join(', ')}.`);

  // G10: die Gegenprobe, und sie ist der eigentliche Befund dieses Abschnitts.
  // Die Zeile darüber nennt, wer auf ein Komposit AUSWEICHT — wer auf einem
  // Paketblatt LÄUFT, stand nirgends. Deshalb ist drei Bauabschnitte lang
  // niemandem aufgefallen, dass milb, pommer und fass ihr komposit:true nie
  // bekommen haben: Milb lief als Farmer_Buba mit Strohhut durchs Dorf, Pommer
  // als Bartender_Katy, und das Phasendokument von G8 behauptete derweil, alle
  // acht Wandernden trügen das Flag. Gefunden hat es ein Blick aufs Telefon.
  //
  // Ohne Grafikpaket schweigt die Zeile, weil dann niemand auf einem Paketblatt
  // läuft — sie ist kein Fehler, sondern eine Bestandsaufnahme.
  const aufPaket = DORF_FIGUREN.filter(f => !f.rig && !f.komposit && f.opt !== 'fest'
                                            && SHEETS[`cfnpc_${f.sheet}_idle`]).map(f => f.key);
  if(aufPaket.length) console.log(`G6 Dorfsicht: ${aufPaket.length} Figuren laufen auf ihrem Paketblatt`
    + ` statt auf dem Komposit ihres Porträts: ${aufPaket.join(', ')}.`);
}

// Die Blätter stehen auf den npcs-Einträgen, und die entstehen in genMap() beim
// Skriptstart, lange bevor SHEETS gefüllt ist. Nach dem Laden wird deshalb
// einmal nachgezogen. Ein zweiter Aufruf ist harmlos, npcBlaetter() ist rein.
function npcBlaetterNachziehen(){
  for(const n of npcs){
    const b = npcBlaetter(n.figur);
    n.sheetIdle = b.idle; n.sheetWalk = b.walk;
  }
}

// DOM-Cache: getElementById war im Renderloop einer der teuersten Posten.
const DOM = {};
const el = id => DOM[id] || (DOM[id] = document.getElementById(id));
// Schreibt nur bei echter Änderung — spart Style-Recalcs und, wichtiger, verhindert
// dass Kindknoten während einer laufenden Touch-Geste ausgetauscht werden.
const LAST = {};
// R6/F73: setStyle baute seinen Cache-Schlüssel als id+'|'+prop, also eine
// Stringallokation pro Aufruf (gemessen 11 Aufrufe/Frame). Zweistufig gleich teuer,
// aber ohne Allokation. setAttr ist neu und schließt den letzten HUD-Schreibpfad
// ohne Dirty-Check (R6/F29, Regressionsregel 1).
const LAST_STYLE = {}, LAST_ATTR = {};
function setTxt(id, v){ if(LAST[id] === v) return; LAST[id] = v; el(id).textContent = v; }
function setHTML(id, v){ if(LAST[id] === v) return; LAST[id] = v; el(id).innerHTML = v; }
function setStyle(id, prop, v){ const m = LAST_STYLE[id] || (LAST_STYLE[id] = {}); if(m[prop] === v) return; m[prop] = v; el(id).style[prop] = v; }
function setAttr(id, name, v){ const m = LAST_ATTR[id] || (LAST_ATTR[id] = {}); if(m[name] === v) return; m[name] = v; el(id).setAttribute(name, v); }

const clamp = (v,a,b)=> v<a?a:(v>b?b:v);
const lerp = (a,b,t)=> a+(b-a)*t;
// Math.hypot ist wegen Overflow-Schutz ~5x langsamer als der direkte Weg und läuft
// hier zehntausendfach pro Frame. sqDist vermeidet die Wurzel ganz, wo nur verglichen wird.
const dist = (ax,ay,bx,by)=>{ const dx=ax-bx, dy=ay-by; return Math.sqrt(dx*dx+dy*dy); };
const sqDist = (ax,ay,bx,by)=>{ const dx=ax-bx, dy=ay-by; return dx*dx+dy*dy; };
const angDiff = (a,b)=>{ let d=(a-b)%(Math.PI*2); if(d>Math.PI)d-=Math.PI*2; if(d<-Math.PI)d+=Math.PI*2; return Math.abs(d); };

// R6/F73: Array- und Zeichenkettenliterale, die im Renderpfad standen, einmal statt
// pro Frame (Regressionsregel 4: keine neuen Objekt-Allokationen im Renderpfad).
const DASH_5_4 = [5,4], DASH_6_6 = [6,6], DASH_AUS = [];
const DOLCH_OFFS = [-0.35, 0.35];                                  // zwei Schlitze des Dolchhiebs
const SCHILD_FONT = ['13px serif','14px serif','15px serif','16px serif','17px serif'];   // Stufe 0..4

function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
// Startwert W-Groß bewusst gebumpt (war 20260721): die Karte ist mit MW=MH=320,
// verschobenem Dorf und dem Wegfall des toten Pfadlaufs ohnehin eine andere Welt.
// Ein unveränderter Startwert würde nur die falsche Erwartung wecken, es käme
// dieselbe Karte heraus wie vorher.
const rng = mulberry32(20260805);
const R = (a,b)=> a+rng()*(b-a);
const ri = (a,b)=> Math.floor(R(a,b+1));
const rr = (a,b)=> a+Math.random()*(b-a);
const rri = (a,b)=> Math.floor(rr(a,b+1));

function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; ctx.imageSmoothingEnabled = false; }
window.addEventListener('resize', resize); resize();
window.addEventListener('orientationchange', () => setTimeout(resize, 100));
if(window.visualViewport) window.visualViewport.addEventListener('resize', resize);

let currentLevel = 1;
let schattenlandActive = false;
let shadowKills = 0;
let portal = null;
let shakeT = 0, shakeInt = 0, hitStopT = 0;

function addShake(intensity, time){ shakeInt = Math.max(shakeInt, intensity); shakeT = Math.max(shakeT, time); }
function addHitStop(time){ hitStopT = Math.max(hitStopT, time); }

// --- AUDIO SYSTEM ---
// Ein Motiv, sechs Arrangements (Oberwelt/Schattenland/Kammer/Dorf/Amt/Boss), zur Laufzeit
// gebacken per Web Audio, 0 Byte Assets. Lookahead-Scheduler statt setTimeout-Takt (der driftet
// hörbar). Zonen folgen currentLevel automatisch (siehe update(dt)); sfx.*-API unverändert,
// jeder bestehende Aufrufer bleibt unangetastet.

const SEMI = {C:-9,'C#':-8,Db:-8,D:-7,'D#':-6,Eb:-6,E:-5,F:-4,'F#':-3,Gb:-3,G:-2,'G#':-1,Ab:-1,A:0,'A#':1,Bb:1,B:2};
function freq(name, oct){ return 440*Math.pow(2,(SEMI[name]+(oct-4)*12)/12); }
const CHORD_IV = {'':[0,4,7], 'm':[0,3,7]};
function chordToneFreq(chord, idx, octAdd=0){
  const iv = CHORD_IV[chord.q][idx % 3];
  const rootSemi = SEMI[chord.root] + (chord.oct + octAdd - 4)*12;
  return 440*Math.pow(2,(rootSemi+iv)/12);
}

// --- Bus-Graph: Quellen -> toFx -> lowpass(Muffle) -> {dry, reverbSend, delaySend} -> master
let AC=null, master=null, compressor=null;
let toFx=null, lowpass=null, dry=null, reverbSend=null, convolver=null, reverbWet=null;
let delayNode=null, delayFeedback=null, delaySend=null, delayWet=null;
let musicBus=null, sfxBus=null, kampfGain=null, gefahrGain=null, zoneDroneGain=null, swellGain=null;
let musicMuted=false, musicVolTarget=0.45, muffled=false;
let ovMuffle=false;   // Dämpfungswunsch der #overlay-Screens; die offenen Panels kommen in MUS.muffle() dazu

function makeImpulse(duration, decay){
  const rate=AC.sampleRate, len=Math.floor(rate*duration);
  const buf=AC.createBuffer(2, len, rate);
  for(let ch=0; ch<2; ch++){
    const d=buf.getChannelData(ch);
    for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/len, decay);
  }
  return buf;
}

function initAudio(){
  if(!AC){
    try{
      AC = new (window.AudioContext||window.webkitAudioContext)();
      master = AC.createGain(); master.gain.value = 0.85;
      compressor = AC.createDynamicsCompressor();
      compressor.threshold.value=-18; compressor.knee.value=24; compressor.ratio.value=4;
      compressor.attack.value=0.003; compressor.release.value=0.25;
      master.connect(compressor); compressor.connect(AC.destination);

      toFx = AC.createGain(); toFx.gain.value = 1;
      lowpass = AC.createBiquadFilter(); lowpass.type='lowpass'; lowpass.frequency.value=20000;
      toFx.connect(lowpass);

      dry = AC.createGain(); dry.gain.value = 1; lowpass.connect(dry); dry.connect(master);

      convolver = AC.createConvolver(); convolver.buffer = makeImpulse(2.4, 2.1);
      reverbSend = AC.createGain(); reverbSend.gain.value = 0.1;
      reverbWet = AC.createGain(); reverbWet.gain.value = 1;
      lowpass.connect(reverbSend); reverbSend.connect(convolver); convolver.connect(reverbWet); reverbWet.connect(master);

      delayNode = AC.createDelay(1.0); delayNode.delayTime.value = 0.3;
      delayFeedback = AC.createGain(); delayFeedback.gain.value = 0.26;
      delaySend = AC.createGain(); delaySend.gain.value = 0.12;
      delayWet = AC.createGain(); delayWet.gain.value = 1;
      lowpass.connect(delaySend); delaySend.connect(delayNode);
      delayNode.connect(delayFeedback); delayFeedback.connect(delayNode);
      delayNode.connect(delayWet); delayWet.connect(master);

      musicBus = AC.createGain(); musicBus.gain.value = 0; musicBus.connect(toFx);
      kampfGain = AC.createGain(); kampfGain.gain.value = 0; kampfGain.connect(musicBus);
      gefahrGain = AC.createGain(); gefahrGain.gain.value = 0; gefahrGain.connect(musicBus);
      zoneDroneGain = AC.createGain(); zoneDroneGain.gain.value = 0; zoneDroneGain.connect(musicBus);
      swellGain = AC.createGain(); swellGain.gain.value = 0; swellGain.connect(musicBus);

      sfxBus = AC.createGain(); sfxBus.gain.value = 0.22; sfxBus.connect(master);

      startDrone();
      applyZoneSends();
      applyMusicGain();
      scheduler.start();
      // Der Ladebildschirm hat längst muffle(true) gesetzt, nur ohne AC. Hall und Pegel
      // holen sich das oben aus muffled, der frische Lowpass steht aber auf 20000. Ohne
      // Argument leitet muffle() den Sollzustand neu ab (R2/F36), setzt also keinen zweiten
      // Wahrheitsträger neben ovMuffle.
      MUS.muffle();
    }catch(e){ AC = null; }
  }
  if(AC && AC.state === 'suspended') AC.resume();
}

function applyMusicGain(){
  if(!AC) return;
  const base = musicMuted ? 0 : musicVolTarget;
  musicBus.gain.setTargetAtTime(muffled ? base*0.6 : base, AC.currentTime, 0.1);
}
function toggleMusic(){
  musicMuted = !musicMuted;
  document.getElementById('musicBtn').innerHTML = musicMuted ? '<i class="ico ico-ton_aus">🔇</i> Aus' : '<i class="ico ico-ton">🎵</i> Musik';
  applyMusicGain();
}

// --- SFX: API unverändert, Ziel jetzt sfxBus statt masterGain ---
function playTone(hz, type, duration, startVol=0.5, endVol=0.01, slideFreq=null){
  if(!AC) return;
  const o = AC.createOscillator(), g = AC.createGain();
  o.type = type; o.frequency.setValueAtTime(hz, AC.currentTime);
  if(slideFreq) o.frequency.exponentialRampToValueAtTime(Math.max(20, slideFreq), AC.currentTime + duration);
  g.gain.setValueAtTime(startVol, AC.currentTime);
  g.gain.exponentialRampToValueAtTime(endVol, AC.currentTime + duration);
  o.connect(g); g.connect(sfxBus);
  o.start(); o.stop(AC.currentTime + duration + 0.02);
}

const sfx = {
  swing: (heavy)=> playTone(heavy?120:280, 'sawtooth', heavy?0.15:0.08, 0.4, 0.01, heavy?40:120),
  hit:   (heavy)=> playTone(heavy?60:150, 'square', heavy?0.2:0.08, heavy?0.9:0.4, 0.01, 20),
  crit:  ()=> { playTone(120, 'square', 0.22, 0.8, 0.01, 20); playTone(60, 'sawtooth', 0.3, 0.9, 0.01, 10); },
  hurt:  ()=> playTone(100, 'square', 0.15, 0.6, 0.01, 40),
  die:   ()=> playTone(150, 'sawtooth', 0.2, 0.5, 0.01, 20),
  gold:  ()=> playTone(900, 'sine', 0.07, 0.4, 0.01, 1400),
  potion:()=> playTone(300, 'sine', 0.2, 0.5, 0.01, 620),
  level: ()=> { playTone(440, 'square', 0.1); setTimeout(()=>playTone(554, 'square', 0.1), 100); setTimeout(()=>playTone(659, 'square', 0.2), 200); },
  shoot: ()=> playTone(500, 'triangle', 0.06, 0.3, 0.01, 150),
  magic: ()=> playTone(800, 'sine', 0.25, 0.5, 0.01, 300),
  zap:   ()=> playTone(1000, 'sawtooth', 0.15, 0.4, 0.01, 200),
  warp:  ()=> { playTone(150, 'sawtooth', 0.6, 1.0, 0.01, 800); setTimeout(()=>playTone(800, 'sine', 0.8, 1.0, 0.01, 200), 200); },
  brew:  ()=> { playTone(170, 'triangle', 0.3, 0.45, 0.01, 90); setTimeout(()=>playTone(520, 'sine', 0.3, 0.4, 0.01, 980), 170); }
};

// --- Instrumente: alles gebacken zur Laufzeit ---
function pluck(time, f, dur, dest, vel=0.5){
  const o=AC.createOscillator(), g=AC.createGain(), fl=AC.createBiquadFilter();
  o.type='sawtooth'; o.frequency.setValueAtTime(f,time);
  fl.type='lowpass'; fl.Q.value=1.1;
  fl.frequency.setValueAtTime(f*7, time);
  fl.frequency.exponentialRampToValueAtTime(Math.max(f*1.1,80), time+dur*0.7);
  g.gain.setValueAtTime(0,time); g.gain.linearRampToValueAtTime(vel, time+0.006);
  g.gain.exponentialRampToValueAtTime(0.001, time+dur*0.92);
  o.connect(fl); fl.connect(g); g.connect(dest);
  o.start(time); o.stop(time+dur+0.05);
}
function harp(time, f, dur, dest, vel=0.4){
  const o=AC.createOscillator(), g=AC.createGain();
  o.type='triangle'; o.frequency.setValueAtTime(f,time);
  g.gain.setValueAtTime(0,time); g.gain.linearRampToValueAtTime(vel, time+0.01);
  g.gain.exponentialRampToValueAtTime(0.001, time+dur*1.1);
  o.connect(g); g.connect(dest);
  o.start(time); o.stop(time+dur+0.15);
}
function marimba(time, f, dur, dest, vel=0.5){
  const o1=AC.createOscillator(), o2=AC.createOscillator(), g=AC.createGain(), g2=AC.createGain();
  o1.type='sine'; o1.frequency.value=f;
  o2.type='sine'; o2.frequency.value=f*4; g2.gain.value=0.12;
  g.gain.setValueAtTime(vel,time); g.gain.exponentialRampToValueAtTime(0.001, time+Math.min(dur,0.55));
  o1.connect(g); o2.connect(g2); g2.connect(g); g.connect(dest);
  o1.start(time); o1.stop(time+dur+0.1); o2.start(time); o2.stop(time+0.2);
}
function flute(time, f, dur, dest, vel=0.32){
  const o=AC.createOscillator(), g=AC.createGain(), lfo=AC.createOscillator(), lfoG=AC.createGain();
  o.type='sine'; o.frequency.setValueAtTime(f,time);
  lfo.type='sine'; lfo.frequency.value=5.2; lfoG.gain.value=f*0.008;
  lfo.connect(lfoG); lfoG.connect(o.frequency);
  g.gain.setValueAtTime(0,time); g.gain.linearRampToValueAtTime(vel, time+0.09);
  g.gain.setValueAtTime(vel, time+Math.max(dur-0.12,0.09));
  g.gain.linearRampToValueAtTime(0.001, time+dur+0.1);
  o.connect(g); g.connect(dest);
  lfo.start(time); lfo.stop(time+dur+0.15);
  o.start(time); o.stop(time+dur+0.15);
}
function bassoon(time, f, dur, dest, vel=0.42){
  const o=AC.createOscillator(), g=AC.createGain(), bp=AC.createBiquadFilter();
  o.type='sawtooth'; o.frequency.setValueAtTime(f*0.98,time);
  o.frequency.linearRampToValueAtTime(f, time+0.035);
  bp.type='bandpass'; bp.frequency.value=f*2.2; bp.Q.value=3.2;
  g.gain.setValueAtTime(0,time); g.gain.linearRampToValueAtTime(vel, time+0.012);
  g.gain.exponentialRampToValueAtTime(0.001, time+dur*0.75);
  o.connect(bp); bp.connect(g); g.connect(dest);
  o.start(time); o.stop(time+dur+0.05);
}
function brass(time, f, dur, dest, vel=0.5){
  const o1=AC.createOscillator(), o2=AC.createOscillator(), g=AC.createGain(), bp=AC.createBiquadFilter();
  o1.type='sawtooth'; o1.frequency.setValueAtTime(f,time);
  o2.type='square'; o2.frequency.setValueAtTime(f*1.003,time);
  bp.type='bandpass'; bp.frequency.value=f*3; bp.Q.value=1.4;
  g.gain.setValueAtTime(0,time); g.gain.linearRampToValueAtTime(vel, time+0.018);
  g.gain.exponentialRampToValueAtTime(0.001, time+dur*0.8);
  o1.connect(bp); o2.connect(bp); bp.connect(g); g.connect(dest);
  o1.start(time); o1.stop(time+dur+0.05); o2.start(time); o2.stop(time+dur+0.05);
}
function choir(time, f, dur, dest, vel=0.28){
  const detunes=[-6,0,7]; const g=AC.createGain();
  g.gain.setValueAtTime(0,time); g.gain.linearRampToValueAtTime(vel, time+0.3);
  g.gain.setValueAtTime(vel, time+Math.max(dur-0.4,0.3));
  g.gain.linearRampToValueAtTime(0.001, time+dur+0.4);
  g.connect(dest);
  detunes.forEach(ct=>{
    const o=AC.createOscillator(); o.type='sawtooth';
    o.frequency.setValueAtTime(f,time); o.detune.value=ct;
    const lp=AC.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=f*3;
    o.connect(lp); lp.connect(g);
    o.start(time); o.stop(time+dur+0.5);
  });
}
function timpani(time, f, dur, dest, vel=0.55){
  const o=AC.createOscillator(), g=AC.createGain();
  o.type='sine'; o.frequency.setValueAtTime(f*1.6,time);
  o.frequency.exponentialRampToValueAtTime(Math.max(f*0.85,20), time+0.18);
  g.gain.setValueAtTime(vel,time); g.gain.exponentialRampToValueAtTime(0.001, time+dur);
  o.connect(g); g.connect(dest);
  o.start(time); o.stop(time+dur+0.1);
  noiseHit(time, 0.04, vel*0.4, dest, 400, 'lowpass');
}
function bassPatch(time, f, dur, dest, vel=0.4){
  const o=AC.createOscillator(), g=AC.createGain();
  o.type='triangle'; o.frequency.setValueAtTime(f,time);
  g.gain.setValueAtTime(vel,time); g.gain.exponentialRampToValueAtTime(0.001, time+dur*0.88);
  o.connect(g); g.connect(dest);
  o.start(time); o.stop(time+dur+0.05);
}
function noiseHit(time, dur, vel, dest, filterFreq=1800, type='bandpass'){
  const n = Math.max(1, Math.floor(AC.sampleRate*dur));
  const buf = AC.createBuffer(1, n, AC.sampleRate);
  const d = buf.getChannelData(0);
  for(let i=0;i<n;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/n,2);
  const src=AC.createBufferSource(); src.buffer=buf;
  const fl=AC.createBiquadFilter(); fl.type=type; fl.frequency.value=filterFreq;
  const g=AC.createGain(); g.gain.value=vel;
  src.connect(fl); fl.connect(g); g.connect(dest);
  src.start(time);
}
function shakerHit(time, dest, vel=0.16){ noiseHit(time, 0.045, vel, dest, 6500, 'highpass'); }
function snareHit(time, dest, vel=0.4){
  noiseHit(time, 0.11, vel, dest, 1800, 'bandpass');
  const o=AC.createOscillator(), g=AC.createGain();
  o.type='triangle'; o.frequency.value=190;
  g.gain.setValueAtTime(vel*0.5,time); g.gain.exponentialRampToValueAtTime(0.001,time+0.05);
  o.connect(g); g.connect(dest); o.start(time); o.stop(time+0.08);
}
function stampHit(time, dest, vel=0.6){
  noiseHit(time, 0.05, vel, dest, 300, 'lowpass');
  const o=AC.createOscillator(), g=AC.createGain();
  o.type='sine'; o.frequency.setValueAtTime(110,time); o.frequency.exponentialRampToValueAtTime(45,time+0.12);
  g.gain.setValueAtTime(vel,time); g.gain.exponentialRampToValueAtTime(0.001,time+0.16);
  o.connect(g); g.connect(dest); o.start(time); o.stop(time+0.2);
}
const INSTR = {pluck,harp,marimba,flute,bassoon,brass,choir,timpani,bass:bassPatch};

// --- Song: ein Motiv, sechs Arrangements ---
const STEPS_PER_BEAT = 4;
function everyN(total,n,offset=0){ const out=[]; for(let s=offset;s<total;s+=n) out.push(s); return out; }
function perBar(bars, stepsPerBar, offs){ const out=[]; for(let b=0;b<bars;b++) offs.forEach(o=>out.push(b*stepsPerBar+o)); return out; }

const ZONES = {
  overworld:{
    label:'Oberwelt', bpm:112, meter:[4,4], bars:4,
    leadInstr:'pluck', bassInstr:'bass',
    lead:[[0,'A',4,4],[4,'E',5,4],[8,'D',5,2],[10,'C',5,2],[12,'B',4,4],
          [16,'A',4,6],[24,'G',4,4],[28,'A',4,4],
          [32,'A',4,4],[36,'E',5,4],[40,'D',5,2],[42,'C',5,2],[44,'D',5,4],
          [48,'E',5,8]],
    bass:[[0,'A',2,4],[4,'E',3,4],[8,'A',3,4],[12,'E',3,4],
          [16,'G',2,4],[20,'D',3,4],[24,'G',3,4],[28,'D',3,4],
          [32,'D',2,4],[36,'A',2,4],[40,'D',3,4],[44,'A',2,4],
          [48,'A',2,4],[52,'E',3,4],[56,'A',3,4],[60,'E',3,4]],
    chords:[{root:'A',oct:3,q:'m'},{root:'G',oct:3,q:''},{root:'D',oct:3,q:''},{root:'A',oct:3,q:'m'}],
    chordStabOffsets:[2,6,10,14], chordInstr:'pluck',
    perc:{shakerEvery:2},
    reverbSend:0.10, delaySend:0.16, droneLevel:0,
    tonic:'A', scale:[0,2,3,5,7,9,10]
  },
  shadowland:{
    label:'Schattenland', bpm:100, meter:[4,4], bars:4,
    leadInstr:'pluck', bassInstr:'bass',
    lead:[[0,'A',4,4],[4,'E',5,4],[8,'D',5,2],[10,'C',5,2],[12,'Bb',4,4],
          [16,'A',4,6],[24,'G',4,4],[28,'A',4,4],
          [32,'A',4,4],[36,'E',5,4],[40,'D',5,2],[42,'C',5,2],[44,'D',5,4],
          [48,'E',5,8]],
    bass:[[0,'A',2,8],[16,'G',2,8],[32,'D',2,8],[48,'A',2,8]],
    chords:[{root:'A',oct:3,q:'m'},{root:'G',oct:3,q:''},{root:'D',oct:3,q:''},{root:'A',oct:3,q:'m'}],
    chordStabOffsets:[], chordInstr:'pluck',
    perc:{shakerEvery:4},
    reverbSend:0.22, delaySend:0.22, droneLevel:0.13,
    tonic:'A', scale:[0,1,3,5,7,8,10]   // phrygisch: b2 = Bb, wie im Lead oben. Kammer und Boss sind planmäßig äolisch
  },
  chamber:{
    label:'Kammer', bpm:76, meter:[4,4], bars:4,
    leadInstr:'marimba', bassInstr:'bass',
    lead:[[0,'A',3,4],[4,'E',4,4],[8,'D',4,2],[10,'C',4,2],[12,'B',3,4],
          [16,'A',3,6],[24,'G',3,4],[28,'A',3,4],
          [32,'A',3,4],[36,'E',4,4],[40,'D',4,2],[42,'C',4,2],[44,'D',4,4],
          [48,'E',4,8]],
    bass:[[0,'A',2,4],[8,'A',2,4],[16,'G',2,4],[24,'G',2,4],
          [32,'D',2,4],[40,'D',2,4],[48,'A',2,4],[56,'A',2,4]],
    chords:[{root:'A',oct:3,q:'m'},{root:'G',oct:3,q:''},{root:'D',oct:3,q:''},{root:'A',oct:3,q:'m'}],
    chordStabOffsets:[], chordInstr:'pluck',
    perc:{timpaniDownbeat:true, choirPad:true},
    reverbSend:0.42, delaySend:0.05, droneLevel:0,
    tonic:'A', scale:[0,2,3,5,7,8,10]
  },
  village:{
    label:'Dorf', bpm:92, meter:[3,4], bars:4,
    leadInstr:'flute', bassInstr:'bass',
    lead:[[0,'F',4,4],[4,'C',5,4],[8,'Bb',4,2],[10,'A',4,2],[12,'G',4,4],[16,'F',4,8],
          [24,'F',4,4],[28,'C',5,4],[32,'Bb',4,2],[34,'A',4,2],[36,'A',4,4],[40,'C',5,8]],
    bass:[[0,'F',2,4],[12,'C',2,4],[24,'D',2,4],[36,'Bb',1,4]],
    chords:[{root:'F',oct:3,q:''},{root:'C',oct:3,q:''},{root:'D',oct:3,q:'m'},{root:'Bb',oct:2,q:''}],
    chordStabOffsets:[], chordInstr:'pluck',
    perc:{harpArpeggio:true},
    reverbSend:0.20, delaySend:0.10, droneLevel:0,
    tonic:'F', scale:[0,2,4,5,7,9,11]
  },
  office:{
    label:'Amt', bpm:104, meter:[2,4], bars:4,
    leadInstr:'bassoon', bassInstr:'bass',
    lead:[[0,'F',3,2],[2,'F',3,2],[4,'C',4,4],
          [8,'Bb',3,2],[10,'A',3,2],[12,'G',3,4],
          [16,'F',3,2],[18,'F',3,2],[20,'C',4,4],
          [24,'A',3,2],[26,'Bb',3,2]],
    bass:[[0,'F',1,4],[8,'Bb',1,4],[16,'F',1,4],[24,'A',1,4]],
    chords:[{root:'F',oct:3,q:''},{root:'C',oct:3,q:''},{root:'D',oct:3,q:'m'},{root:'Bb',oct:2,q:''}],
    chordStabOffsets:[], chordInstr:'pluck',
    perc:{snareOffbeat:true, stampAt:[28]},
    reverbSend:0.07, delaySend:0, droneLevel:0,
    tonic:'F', scale:[0,2,4,5,7,9,11]
  },
  boss:{
    label:'Boss', bpm:140, meter:[4,4], bars:4,
    leadInstr:'brass', bassInstr:'bass',
    lead:[[0,'A',2,4],[4,'E',3,4],[8,'D',3,2],[10,'C',3,2],[12,'B',2,4],
          [16,'A',2,6],[24,'G',2,4],[28,'A',2,4],
          [32,'A',2,4],[36,'E',3,4],[40,'D',3,2],[42,'C',3,2],[44,'D',3,4],
          [48,'E',3,8]],
    bass:[],
    chords:[{root:'A',oct:3,q:'m'},{root:'G',oct:3,q:''},{root:'D',oct:3,q:''},{root:'A',oct:3,q:'m'}],
    chordStabOffsets:[], chordInstr:'pluck',
    perc:{timpaniEveryBeat:true, bassOstinatoEvery:2, snareOffbeat:true},
    reverbSend:0.30, delaySend:0.08, droneLevel:0,
    tonic:'A', scale:[0,2,3,5,7,8,10]
  }
};

function prepareZone(z){
  if(z._ready) return z;
  z._stepsPerBar = z.meter[0]*STEPS_PER_BEAT;
  z._totalSteps = z._stepsPerBar*z.bars;
  z._leadByStep = {}; z.lead.forEach(([s,n,o,l])=>{ z._leadByStep[s]=[n,o,l]; });
  z._bassByStep = {}; z.bass.forEach(([s,n,o,l])=>{ z._bassByStep[s]=[n,o,l]; });
  z._chordStabs = z.chordStabOffsets.length ? perBar(z.bars, z._stepsPerBar, z.chordStabOffsets) : [];
  z._shaker = z.perc.shakerEvery ? everyN(z._totalSteps, z.perc.shakerEvery) : [];
  z._snare = z.perc.snareOffbeat ? everyN(z._totalSteps, STEPS_PER_BEAT, STEPS_PER_BEAT/2) : [];
  z._timpani = z.perc.timpaniDownbeat ? everyN(z._totalSteps, z._stepsPerBar, 0)
             : z.perc.timpaniEveryBeat ? everyN(z._totalSteps, STEPS_PER_BEAT, 0) : [];
  z._stamp = z.perc.stampAt || [];
  z._choir = z.perc.choirPad ? everyN(z._totalSteps, z._stepsPerBar, 0) : [];
  z._harp = z.perc.harpArpeggio ? perBar(z.bars, z._stepsPerBar, [4,8]) : [];
  z._bassOsti = z.perc.bassOstinatoEvery ? everyN(z._totalSteps, z.perc.bassOstinatoEvery) : [];
  z._ready = true;
  return z;
}
Object.keys(ZONES).forEach(k=>prepareZone(ZONES[k]));
function barChord(z, step){ return z.chords[Math.floor(step/z._stepsPerBar) % z.chords.length]; }
function zoneForLevel(level){ return level===2 ? 'shadowland' : level===3 ? 'chamber' : 'overworld'; }

// --- Scheduler: Lookahead statt setTimeout, taktgenauer Zonenwechsel ---
const LOOKAHEAD_MS = 25, HORIZON_SEC = 0.12;
let currentZoneKey = 'overworld', requestedZone = 'overworld', overtimeFactor = 0;
function currentZone(){ return ZONES[currentZoneKey]; }

const scheduler = (function(){
  let stepIdx=0, nextStepTime=0, timer=null, running=false, pendingZone=null;

  function secPerStep(){
    const z = currentZone();
    const bpm = z.bpm * (1 - overtimeFactor*0.14);
    return 60/bpm/STEPS_PER_BEAT;
  }

  function doStep(step, time){
    const z = currentZone();
    const local = step % z._totalSteps;

    if(z._leadByStep[local]){
      const [n,o,len] = z._leadByStep[local];
      INSTR[z.leadInstr](time, freq(n,o), len*secPerStep(), musicBus, z.leadInstr==='flute'?0.34:0.5);
    }
    if(z._bassByStep[local]){
      const [n,o,len] = z._bassByStep[local];
      INSTR[z.bassInstr](time, freq(n,o), len*secPerStep(), musicBus, 0.38);
    }
    if(z._bassOsti.includes(local)){
      const ch = barChord(z, local);
      bassPatch(time, chordToneFreq(ch,0,-2), 2*secPerStep()*0.9, musicBus, 0.4);
    }
    if(z._chordStabs.includes(local)){
      const ch = barChord(z, local);
      for(let i=0;i<3;i++) INSTR[z.chordInstr](time, chordToneFreq(ch,i,0), 2*secPerStep(), musicBus, 0.20);
    }
    if(z._choir.includes(local)){
      const ch = barChord(z, local);
      for(let i=0;i<3;i++) choir(time, chordToneFreq(ch,i,-1), z._stepsPerBar*secPerStep(), musicBus, 0.22);
    }
    if(z._timpani.includes(local)){
      const ch = barChord(z, local);
      timpani(time, chordToneFreq(ch,0,-2), 0.5, musicBus, 0.5);
    }
    if(z._harp.includes(local)){
      const ch = barChord(z, local);
      [0,2,1,2].forEach((iv,i)=> harp(time+i*0.055, chordToneFreq(ch,iv,0), 0.5, musicBus, 0.28));
    }
    if(z._shaker.includes(local)) shakerHit(time, musicBus, 0.14);
    if(z._snare.includes(local)) snareHit(time, kampfGain.gain.value>0.05?kampfGain:musicBus, 0.32);
    if(z._stamp.includes(local)) stampHit(time, musicBus, 0.55);

    // Kampf-Layer: eigener Bus, nur Lautstärke faded -> kein Trackwechsel beim Ein-/Ausblenden
    if(local % STEPS_PER_BEAT === 0) snareHit(time, kampfGain, 0.3);
    if(local % 2 === 0) shakerHit(time, kampfGain, 0.22);
  }

  function tick(){
    if(!running) return;
    while(nextStepTime < AC.currentTime + HORIZON_SEC){
      const z = currentZone();
      // Taktgrenze, nicht Viertakt-Phrase: _totalSteps hätte den Wechsel bis zu 12,6s
      // aufgehalten (Kammer; Oberwelt 8,6s, Dorf 7,8s, in den Überstunden bis 14 Prozent
      // mehr). Gefahrlos, weil die neue Zone weiterhin bei stepIdx 0 einsetzt und damit
      // jedes in prepareZone() gebackene Raster an seinem Kopf beginnt. Verkürzt wird nur
      // die abgehende Zone, die dafür am Taktstrich schneidet statt am Phrasenende.
      if(stepIdx % z._stepsPerBar === 0 && pendingZone){
        currentZoneKey = pendingZone; pendingZone = null; stepIdx = 0;
        duckToFx(180, 0.5);
        applyZoneSends();
      }
      doStep(stepIdx, nextStepTime);
      nextStepTime += secPerStep();
      stepIdx++;
    }
    timer = setTimeout(tick, LOOKAHEAD_MS);
  }

  return {
    start(){ if(running) return; running=true; stepIdx=0; nextStepTime=AC.currentTime+0.05; tick(); },
    // Hin und wieder zurück über die Dorfgrenze hebt den Wunsch auf, statt an der Taktgrenze
    // einen Duck auf eine unveränderte Zone zu legen. Danach gilt: pendingZone gesetzt genau
    // dann, wenn requestedZone und currentZoneKey auseinanderliegen. Der Vergleich gehört
    // hierher und nicht in MUS.goto: dort stünde requestedZone auf der abbestellten Zone und
    // der Idempotenz-Guard schluckte jeden weiteren Wechsel zurück.
    gotoZone(key){ pendingZone = (key === currentZoneKey) ? null : key; }
  };
})();

function applyZoneSends(){
  if(!AC) return;
  const z = currentZone();
  const now = AC.currentTime;
  reverbSend.gain.setTargetAtTime(muffled? z.reverbSend*2.2 : z.reverbSend, now, 0.2);
  delaySend.gain.setTargetAtTime(z.delaySend, now, 0.2);
  delayNode.delayTime.setTargetAtTime(Math.min(0.9, 60/z.bpm*0.75), now, 0.2);
  zoneDroneGain.gain.setTargetAtTime(z.droneLevel, now, 0.4);
}

function duckToFx(ms=200, depth=0.45){
  if(!AC) return;
  const now = AC.currentTime;
  toFx.gain.cancelScheduledValues(now);
  toFx.gain.setValueAtTime(toFx.gain.value, now);
  toFx.gain.linearRampToValueAtTime(depth, now+0.03);
  toFx.gain.linearRampToValueAtTime(1, now + ms/1000);
}

// --- Dauer-Drone: läuft immer mit Gain 0, Layer regeln nur die Lautstärke ---
function startDrone(){
  const mk = (semi, dest)=>{
    const o=AC.createOscillator(), g=AC.createGain();
    o.type='sawtooth'; o.frequency.value=freq('A',2)*Math.pow(2,semi/12);
    g.gain.value=0; o.connect(g); g.connect(dest);
    o.start();
  };
  mk(0, gefahrGain); mk(6, gefahrGain);   // Tritonus
  mk(0, zoneDroneGain); mk(7, zoneDroneGain);
}

// --- MUS: öffentliche Steuerung, an bestehende Spiel-Hooks angeschlossen (siehe update(dt),
// showDorf/showJahresgespraech, knDisplayZettel/knAbbruchKammer, die 10 #overlay-Stellen) ---
const layerState = {kampf:false, gefahr:false};
const MUS = {
  goto(key){
    if(!ZONES[key] || key === requestedZone) return;   // idempotent: pro Frame gefahrlos aufrufbar
    requestedZone = key;
    if(!AC){ currentZoneKey = key; return; }
    scheduler.gotoZone(key);
  },
  layer(name, on){
    if(layerState[name] === on) return;
    layerState[name] = on;
    if(!AC) return;
    const g = name==='kampf'? kampfGain : name==='gefahr'? gefahrGain : null;
    if(!g) return;
    g.gain.setTargetAtTime(on?0.9:0, AC.currentTime, 0.35);
  },
  swell(){
    if(!AC) return;
    const z = currentZone();
    const now = AC.currentTime;
    swellGain.gain.cancelScheduledValues(now);
    swellGain.gain.setValueAtTime(swellGain.gain.value, now);
    swellGain.gain.linearRampToValueAtTime(0.8, now+1.4);
    swellGain.gain.linearRampToValueAtTime(0, now+3.6);
    const ch = {root:z.tonic, oct:4, q:''};
    choir(now, chordToneFreq(ch,0,-1), 3.6, swellGain, 0.5);
    choir(now, chordToneFreq(ch,2,-1), 3.6, swellGain, 0.4);
  },
  sting(name){
    if(!AC || muffled) return;   // Knöterich bleibt stumm, während ein Panel offen ist
    const z = currentZone();
    const degs = name==='gespraechig' ? [6,5,3] : name==='dienstlich' ? [3,3] : [3,5,7];
    const now = AC.currentTime;
    let t = now;
    degs.forEach(d=>{
      const oct = 4 + Math.floor(d/z.scale.length);
      const deg = z.scale[d % z.scale.length];
      const semi = SEMI[z.tonic] + deg + (oct-4)*12;
      bassoon(t, 440*Math.pow(2, semi/12), 0.32, musicBus, 0.28);
      t += name==='dienstlich' ? 0.34 : 0.19;
    });
    duckToFx(name==='dienstlich'?500:650, 0.55);
  },
  // Kein Zähler, sondern abgeleiteter Sollzustand: mit Argument setzt ein #overlay-Screen
  // seinen Wunsch, ohne Argument wird nach jedem Öffnen/Schließen eines Panels nur neu
  // abgeleitet. Doppeltes Öffnen und ein Schließweg auf ein längst geschlossenes Panel
  // sind dadurch harmlos. Nur bei Zustandswechsel aufrufen, nie pro Frame, der Aufruf
  // schreibt drei Audioparameter (goto/layer haben dafür eigene Guards, muffle nicht).
  muffle(on){
    if(on !== undefined) ovMuffle = on;
    // Die fünf Panels liegen unter dem Overlay (z-index 20 bis 22 gegen 50): solange ein
    // Overlay-Screen steht, zählt allein dessen Wunsch (showDorf will trotz eines noch
    // offenen Inventars klar klingen), sonst dämpft jedes offene Panel. Achtung: showDorf
    // und showJahresgespraech rufen muffle(false) in ihrer ersten Zeile und setzen das
    // Overlay erst in ihrer letzten, sie funktionieren nur, weil jeder Aufrufer es schon
    // auf 'flex' stehen hat. Wer einen neuen Aufrufer ergänzt, muss das mitprüfen.
    muffled = ovMuffle || (el('overlay').style.display !== 'flex'
              && (invOpen || charakterOpen || spellTreeOpen || kesselOpen || optionenOpen || schlossOpen || amtFensterOpen));
    if(!AC) return;
    // Aus-Zweig: im Spiel gilt weiter die Überstunden-Kurve aus setOvertime. Dessen
    // q-Guard schreibt erst beim nächsten 1/50-Schritt nach (in den Überstunden bis zu
    // 2,4 s), ein flaches 20000 beim Panel-Zu risse den Filter so lange ganz auf. Auf den
    // Overlay-Screens läuft update() nicht, dort ist overtimeFactor nur ein Restwert.
    lowpass.frequency.setTargetAtTime(muffled ? 600 : (state === 'play' ? 20000 - overtimeFactor*14000 : 20000), AC.currentTime, 0.15);
    applyZoneSends();
    applyMusicGain();
  },
  setOvertime(f){
    const q = Math.round(f*50)/50;
    if(q === overtimeFactor) return;
    overtimeFactor = q;
    if(AC) lowpass.frequency.setTargetAtTime(muffled?600:(20000-q*14000), AC.currentTime, 1.5);
  }
};

// G4: G_WATER war deklariert, aber nie geschrieben (kein Teich-Feature nutzte es) —
// umgewidmet zu G_LAVA für die Aschewüste. Reine Optik, begehbar wie die Eisteiche
// (Nutzerentscheidung, s. Umsetzungsnotizen G4), deshalb in WALKABLE unten dabei.
// W-Groß bringt mit G_OCEAN wieder Wasser auf die Karte, bewusst unter neuem
// Namen: G_WATER zurückzuholen würde die obige Umwidmungs-Historie zur Lüge machen.
const G_GRASS=0, G_PATH=1, G_LAVA=2, G_TREE=3, G_ROCK=4, G_TALL=5, G_SAND=6, G_SNOW=7, G_ICE=8, G_CACTUS=9, G_ICE_TREE=10;
// Nur in Kammern (Phase 2): Wand, geschobener Block, eingebrochene Bodenplatte.
// Alle drei sind nicht begehbar — WALKABLE ist eine Whitelist, sie stehen einfach nicht drin.
const G_WALL=11, G_BLOCK=12, G_GAP=13;
// W-Groß: offenes Meer rund um die Landmasse ("Die Tilgung"). Nicht begehbar,
// steht schlicht nicht in der WALKABLE-Whitelist.
const G_OCEAN=14;
// W-Groß: Strandsaum am Meer. Eigener Typ und nicht einfach G_SAND, weil der
// Boden-Bake die Oberwelt nach BAND einfärbt und nicht nach Kacheltyp: G_SAND im
// Grasband käme sonst als Gras heraus (G_SAND kam vor der Küste nur im Sandband
// vor, deshalb fiel das nie auf). Begehbar wie jeder andere Untergrund.
const G_BEACH=15;
// Kammer-Zustand steht bewusst hier oben: computeTile() läuft schon beim
// Kartenbau und fragt `kammer` ab — eine spätere let-Deklaration wäre ein TDZ-Fehler.
let kammer = null;      // aktive Kammer oder null (Oberwelt)
let owSave = null;      // eingefrorene Oberwelt, solange eine Kammer läuft
// IN1: derselbe Grund, dieselbe Stelle. innen wird von computeTile() und
// miniColor() gelesen, und beide laufen schon beim Kartenbau. Der Innenraum ist
// bewusst NICHT als Kammer gebaut: eine Kammer hat Module, Tore und Wächter, ein
// Wohnzimmer hat Möbel. Was beide teilen, ist der Trick — Oberwelt einfrieren,
// Karte überschreiben, beim Hinausgehen zurückholen.
let innen = null;       // betretener Innenraum oder null
let innenSave = null;   // eingefrorene Oberwelt, solange ein Innenraum offen ist
// AN2: Wer im Raum steht, ist normalerweise eine Frage der Uhr — figDrinnen()
// liest innenZeit(), und die sagt "Feierabend oder nicht". Fuer den Anfang
// trifft das zweimal daneben, und A0 hat beide Male gemessen: vor dem
// Dienstantritt stand Noergel da, obwohl er nicht soll, und seit AN1 steht
// niemand da, obwohl einer soll.
//
// Statt einer Sonderregel in betreteHaus() eine ANGABE: wer hier etwas
// hineinlegt, besetzt den naechsten betretenen Raum damit und die Uhr
// schweigt. Genau eine Stelle setzt es (empfangStarten) und genau eine nimmt
// es zurueck (dienstAntritt), so wie beim state des Anfangs.
//
// Es traegt fertige npcs-Eintraege und keine Schluessel, denn der Anfang
// braucht Knoeterich, und der steht nicht in DORF_FIGUREN — er ist KN_FIGUR,
// eine eigene Groesse mit eigenem Blatt und eigenem Baum. Ueber Schluessel
// waere er hier nicht zu erreichen.
let innenBesetzung = null;
const map = new Uint8Array(MW*MH);
const inB = (x,y)=> x>=0 && y>=0 && x<MW && y<MH;
const T = (x,y)=> map[x+y*MW];
const setT = (x,y,v)=>{ if(inB(x,y)) map[x+y*MW]=v; };
const WALKABLE = t => t===G_GRASS||t===G_PATH||t===G_TALL||t===G_SAND||t===G_SNOW||t===G_ICE||t===G_LAVA||t===G_BEACH;
const walkT = (x,y)=> inB(x,y) && WALKABLE(T(x,y));
// W-Groß: gehört die Kachel zur Hauptlandmasse (Flutfüllung ab SPAWN, s. genMap)?
// Und: liegt sie auf einer reinen Deko-Insel, die kein Setzer bespielen darf?
const landmasse = new Uint8Array(MW*MH);
const inselMaske = new Uint8Array(MW*MH);
// Setz-Prädikat für ALLE Spawner (Monster, Kammertüren, Viecher, Deko, Horde).
// Begehbar allein genügt seit der Küste nicht mehr: eine begehbare Kachel kann
// auf einer unerreichbaren Insel liegen. In der Kammer entfällt die Prüfung, dort
// ist die Karte komplett überschrieben und die Landmassen-Maske bedeutungslos.
const reachbar = (tx,ty)=> kammer ? walkT(tx,ty) : (walkT(tx,ty) && landmasse[tx+ty*MW] === 1);
const reachbarPx = (x,y)=> reachbar(Math.floor(x/TS), Math.floor(y/TS));
const walkPx = (x,y)=> walkT(Math.floor(x/TS), Math.floor(y/TS));
// G12: das Gegenstück für alles, was schwimmt. Eine Ente prüft nicht, ob sie
// gehen kann, sondern ob sie noch im Wasser ist — und G_ICE zählt bewusst nicht
// mit: die Eisteiche im Frostkamm sind begehbarer Boden, kein Gewässer.
const wasserT = (tx,ty)=> inB(tx,ty) && T(tx,ty) === G_OCEAN;
const wasserPx = (x,y)=> wasserT(Math.floor(x/TS), Math.floor(y/TS));
// Grenzrahmen in Weltpixeln {x0,y0,x1,y1} oder null. Als Funktion auf Modulebene
// und nicht als Closure in der Schleife: die lief pro Tier und Bild einmal neu
// (Regressionsregel 4, keine Allokation im heißen Pfad).
const imRahmen = (k,x,y)=> !k || (x >= k.x0 && x <= k.x1 && y >= k.y0 && y <= k.y1);
// Welcher Grund trägt dieses Tier? Der Lebensraum entscheidet, nicht der Ort.
const critterGrund = (c,x,y)=> c.lebensraum === 'wasser' ? wasserPx(x,y)
                             : c.lebensraum === 'luft'   ? true
                             : walkPx(x,y);
function circleWalkable(x,y,r){ return walkPx(x-r,y-r)&&walkPx(x+r,y-r)&&walkPx(x-r,y+r)&&walkPx(x+r,y+r); }

// W-Groß: Das Dorf wandert in die Kartenmitte. Alle Tabellen unten bleiben im
// alten 80er-Raster geschrieben (Dorfmitte lag bei (15,40)) — DORF_DX/DORF_DY
// verschiebt sie genau EINMAL, direkt an ihrer Definitionsstelle. Nicht an den
// 15+ Lesestellen (Quest-Reservierungen, Kammertür-Sperrzone, sichere Zone,
// NPC-Wanderleine, Windmühle, Viecher-/Wolkenband, ...) — eine übersehene Stelle
// hätte sonst einen NPC oder eine Quest-Reservierung mitten im Nirgendwo gelassen.
// Bei MW=MH=80 ist die Verschiebung 0, das alte Layout bliebe also bitgleich.
const DORF_DX = Math.round(MW/2) - 15;
const DORF_DY = Math.round(MH/2) - 40;

const SPAWN = {x:(12.5+DORF_DX)*TS, y:(40.5+DORF_DY)*TS};
// Schattenland-Sprungziel (loadLevel2()) — bewusst NICHT dorf-relativ, sondern
// ein eigener Platz Richtung Kartenrand, sonst läge die Massenvorgang-Arena direkt
// neben dem Dorf. Begehbarkeit wird nach genMap() geprüft und bei Bedarf auf die
// nächste begehbare Kachel nachgezogen (s. nudgeToWalkable-Aufruf nach genMap()).
const ARENA = {x: Math.round(MW*0.72), y: Math.round(MH/2)};
// Kessel am Dorfanger neben dem Startpunkt. Reine Landmarke: bedienbar ist er
// über die Taste K, damit niemand mit vollem Beutel zurücklaufen muss.
const KESSEL_T = {x:15+DORF_DX, y:41+DORF_DY};
const KESSEL = {x:KESSEL_T.x*TS + TS/2, y:KESSEL_T.y*TS + TS - 4};
// Phase 5: Knöterichs Standort, vorgezogen aus dem großen Knöterich-Block weiter unten
// (sda_knoeterich_v1), weil placeMonsters() gleich beim Laden einmal synchron läuft
// und die Kachel schon dabei aussparen muss (TDZ sonst bei const weiter unten).
const KN_T = {x: KESSEL_T.x - 2, y: KESSEL_T.y};
const KN_POS = {x: KN_T.x*TS + TS/2, y: KN_T.y*TS + TS - 4};

// G5: Dorf-Rechteck um Kessel/Spawn/Knöterich, in Kacheln (inklusive Grenzen).
// Deckt beide Gebäude-Cluster inklusive Fassadenhöhe ab, damit genMap() dort gar
// nicht erst Bäume/Felsen streut (Streuung läuft vor der Freiräumung, s. genMap).
// G7: aus 19x15 werden 38x35 Kacheln. Das ist keine Vergrößerung des Dorfes,
// sondern dieselbe Ansammlung Häuser in ihrer richtigen Größe: das Amt allein
// misst jetzt 15 statt 8 Kacheln in der Breite. Kessel (15/41), Spawn (12,5/40,5)
// und Knöterich (13/41) bleiben, wo sie waren — das Dorf wächst um sie herum.
// Die Grenzen sind aus den Gebäuden abgeleitet, nicht geschätzt: y0 liegt auf
// der Dachkante des Amts (Fußlinie 34 minus 12 Kacheln Fassade), y1 zwei Reihen
// unter der Südzeile, damit die vier Figuren davor (Zapf, Pommer, Lott, Pahl)
// noch im Rechteck stehen.
const VILLAGE = {x0:-3+DORF_DX, y0:22+DORF_DY, x1:34+DORF_DX, y1:56+DORF_DY};
function inVillageT(tx, ty){ return tx >= VILLAGE.x0 && tx <= VILLAGE.x1 && ty >= VILLAGE.y0 && ty <= VILLAGE.y1; }
function inVillagePx(x, y){ return inVillageT(Math.floor(x/TS), Math.floor(y/TS)); }

// Gebäude-Footprints: {x0,y0,w,h} = blockierte Kacheln (Fußabdruck, nicht die volle
// Sprite-Höhe — die Fassade ragt optisch darüber hinaus, wie bei cfwindmill schon
// seit G4 üblich). sheet zeigt auf die oben registrierten 'big'-Decos. amt:true
// markiert das Gebäude, das scanAktion()/AKT_AMT anbietet. Literale bewusst im
// alten 80er-Raster belassen (vgl. figuren-dorf.md) — die Schleife danach
// verschiebt sie einmalig um DORF_DX/DORF_DY, bevor bldTuer() daraus die
// Türpunkte ableitet.
// G6: bld zeigt auf den Eintrag in CF_BLD, der Maße, Anker und Deckfläche hält.
// sheet bleibt als Zeichenschlüssel stehen und wird daraus abgeleitet, damit
// nirgends ein Gebäudename zweimal getippt steht.
// === W-Lager: Das Lager der Beschwerden ===================================
// Das siebte Katalogbiom, und das einzige, das ein einzelner Ort ist statt eines
// Bandes oder einer Tuer. Die Gegenseite hat ihre Vertragsausfertigung nie
// bekommen (Weltbibel Kapitel 2) und steht seither hinter einer Palisade. Sie
// greift nicht an, sie wartet — deshalb tragen alle drei Bewohner lagerwache:true.
// Literale wie ueberall hier im alten 80er-Raster, per DORF_DX/DORF_DY verschoben.
// G7: um zehn Kacheln nach Osten gerückt. Das Lager selbst ist unverändert (seine
// Requisiten standen schon im richtigen Maßstab, s. WELT_SC oben) — aber das Dorf
// reicht jetzt bis x=34, und Palisade auf Dorfplatz wäre keine Grenze mehr. Der
// Abstand zwischen Dorfkante und Palisade bleibt exakt der alte: zehn Kacheln,
// also weiterhin innerhalb von DORF_BANN, damit dort auch weiterhin kein
// Streumonster zwischen den Zelten steht.
const LAGER = {x0:44+DORF_DX, y0:34+DORF_DY, x1:62+DORF_DX, y1:46+DORF_DY};
// Das Tor sitzt mittig in der Suedwand und ist drei Kacheln breit, also genau die
// 48 Pixel des Torblatts. Es ist der einzige Weg hinein.
const LAGER_TOR_X = Math.round((LAGER.x0 + LAGER.x1) / 2) - 1;
// Das Lager ist wie das Dorf von der Monsterstreuung ausgenommen: seine Besatzung
// steht fest (setzeLager()), und ein Chuchu, das zwischen den Zelten sitzt, waere
// weder eine Wache noch ein Eindringling, sondern ein Setzfehler.
const imLager = (tx,ty)=> tx >= LAGER.x0-1 && tx <= LAGER.x1+1 && ty >= LAGER.y0-1 && ty <= LAGER.y1+1;

// G7: Breite und Höhe sind keine Schätzung mehr, sondern die Sprite-Maße in
// Kacheln — w = CF_BLD.fw * WELT_SC / TS, also fw/16. Das Amt ist 240 Pixel breit
// und deckt damit 15 Kacheln, nicht 8. h (die blockierten Sockelreihen) verdoppelt
// sich mit dem Sprite, damit der Anteil aus G5 erhalten bleibt: gesperrt ist das
// untere Drittel der Fassade, der Rest ragt begehbar darüber (die Figur läuft
// dahinter und wird verdeckt, wie bei der Windmühle seit G4).
// dorfMassstabAssert() unten rechnet w gegen CF_BLD nach, damit die beiden
// Zahlen nicht auseinanderlaufen können.
//
// Anordnung wie seit G5: Nordzeile (Haus, Amt, Marktstände) mit gemeinsamer
// Fußlinie auf y=34, Südzeile (zwei Häuser, Scheune) auf y=52, dazwischen der
// Anger mit Kessel und Knöterich. Zwischen den Gebäuden bleibt je eine Kachel
// Durchgang, damit man das Dorf nicht nur an den Enden verlassen kann.
// IN1: `innen` nennt den Raum hinter der Tür (Schlüssel in INN_RAEUME weiter
// unten). Drei von sechs Gebäuden haben einen, und welche drei, ist keine
// Geschmacksfrage: die Weltgeschichte nennt genau diese drei Orte in einem Satz,
// als der Postregen fällt — "Sie kommen im Amt an, im Gasthaus, in der
// Registratur, auf dem Dorfplatz." Der Dorfplatz war immer da. Die anderen drei
// waren bis hier Text.
const VILLAGE_BUILDINGS = [
  {bld:'amt',     x0:5,  y0:30, w:15, h:4, amt:true, innen:'amt'},
  {bld:'haus1',   x0:-2, y0:30, w:6,  h:4},
  {bld:'markt',   x0:21, y0:32, w:12, h:2},
  {bld:'haus2',   x0:1,  y0:48, w:9,  h:4, innen:'registratur'},
  {bld:'haus3',   x0:12, y0:48, w:9,  h:4, innen:'wirtshaus'},
  {bld:'scheune', x0:23, y0:48, w:8,  h:4},
];
for(const b of VILLAGE_BUILDINGS){ b.x0 += DORF_DX; b.y0 += DORF_DY; b.sheet = `cfbld_${b.bld}`; }
// IN1: Fußpunkt der gemalten Tür, in Weltpixeln. x kommt aus CF_BLD.tuerDx (dem
// gemessenen Versatz im Blatt, siehe dort), y ist die Fußlinie des Gebäudes.
// Die zwei Pixel Abzug sind dieselben wie bei AMT_TUER seit G5: der Punkt soll
// vor der Schwelle liegen und nicht auf ihr.
function bldTuer(b){
  const g = CF_BLD[b.bld], mitte = (b.x0 + b.w/2)*TS;
  return {x: mitte + (g.tuerDx || 0)*WELT_SC, y: (b.y0 + b.h)*TS - 2};
}
// AMT_TUER stand hier seit G5 und war der Fußpunkt der Amt-Tür für die
// Kontextaktion — berechnet als Mitte der Südkante des Fußabdrucks. Seit IN1
// gibt es ihn nicht mehr, und zwar aus zwei Gründen: die Tür ist keine
// Sonderregel des Amts mehr (drei Häuser haben eine, alle über bldTuer), und
// die Mitte der Südkante war ohnehin daneben. Das Amt ist fünfzehn Kacheln
// breit, seine gemalte Tür sitzt zwei Kacheln links der Mitte. Aufgefallen ist
// das nie, weil ein Panel keine Schwelle hat, durch die man danebengehen kann.
// G6: Wo das Gebäudesprite auf der Karte wirklich Farbe hat, in Weltpixeln, und
// bei welchem y es einsortiert wird. Eine Figur ist genau dann von diesem Haus
// verdeckt, wenn ihr Sprite hier hineinragt UND ihr eigenes y kleiner ist als
// anker (dann zeichnet der nach y sortierte Renderer das Haus nach ihr).
// Dieselbe Rechnung, die auch die Deko-Position in genMap() setzt.
// G7: deck ist in Blattpixeln gemessen, gezeichnet wird mit WELT_SC — der Faktor
// muss also mit, sonst rechnet der Guard weiter mit der halben Fassade und meldet
// eine freie Sicht, die es nicht gibt.
function bldDeckung(b){
  const g = CF_BLD[b.bld], px = (b.x0 + b.w/2)*TS, py = (b.y0 + b.h)*TS - 2;
  return {l: px + g.deck.l*WELT_SC, r: px + g.deck.r*WELT_SC,
          o: py + g.deck.o*WELT_SC, u: py + g.deck.u*WELT_SC, anker: py};
}

