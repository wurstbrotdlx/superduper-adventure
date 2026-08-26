#!/usr/bin/env python3
"""Pixelkur fuer die Figurenportraets.

Midjourney gibt hochaufloesendes JPEG aus, das grobe Pixel nur imitiert: an
schraegen Kanten sitzen Zwischenpixel, und die Farbzahl liegt drei Groessen-
ordnungen ueber den 32 aus dem Prompt. Dieses Skript setzt beides durch.

    python3 tools/figuren-px.py assets/figuren/06-trepp.jpg

Ergebnis liegt daneben als *-px.png. Ohne Argument laeuft es ueber jedes
Original in assets/figuren/, dem die -px-Fassung fehlt.

    python3 tools/figuren-px.py --tafel

schreibt zusaetzlich die Spielfassung nach assets/portraets/. Das ist dieselbe
Rechnung, nur ohne den letzten Schritt: die -px-Datei wird am Ende auf 1024
hochskaliert, damit man sie ansehen kann, die Tafelfassung bleibt bei 128. Der
Unterschied ist kein Detail, sondern der Grund, warum die Bilder ueberhaupt in
den Build duerfen — 19 Motive wiegen als 1024er 3.091 KB und als echte 128er
96,8 KB (U5-Notiz). Der Dateiname ist der Figurenschluessel aus DORF_FIGUREN
und nicht die Prompt-Nummer: index.html sucht das Blatt ueber den Schluessel.

Lott und Pahl stehen bewusst nicht in der Tabelle. Ihr Motiv (11) ist ein
Doppelportraet; jedes der beiden Gesichter fuellt die halbe Breite bei voller
Hoehe, ein Zuschnitt zoege dem jeweils anderen die Haare mit ins Bild. Beide
bleiben deshalb auf dem Sprite-Ausschnitt, den gespraechPortrait() ohnehin als
Rueckfallweg behaelt.
"""
import sys, pathlib
from PIL import Image

RASTER = 128   # Kantenlaenge der echten Pixelfassung
FARBEN = 32    # Palettengrenze aus dem Prompt
AUSGABE = 1024 # Anzeigegroesse, ganzzahliges Vielfaches von RASTER

# Figurenschluessel (index.html) -> Grundname des Motivs (assets/figuren/).
# Wer hier fehlt, hat in der Tafel kein gemaltes Bild und bekommt den
# Sprite-Ausschnitt; gespraechAssert() zaehlt beides nach.
TAFEL = {
    'knoeterich': '01-knoeterich',
    'zwirn':      '02-zwirn',
    'bramsche':   '03-bramsche',
    'zapf':       '04-zapf',
    'lisbeth':    '05-lisbeth',
    'trepp':      '06-trepp',
    'noergel':    '07-noergel',
    'milb':       '08-milb',
    'pommer':     '09-pommer',
    'fass':       '10-fass',
    # G10: Lott und Pahl bekommen BEIDE das Doppelportraet, Motiv 11. Das ist
    # kein Notbehelf, sondern der Witz: wer den einen anspricht, sieht beide
    # grinsen, und wer danach den anderen anspricht, sieht dasselbe Bild noch
    # einmal. Die zwei sitzen seit W3 nebeneinander auf derselben Bank und sind
    # in jedem ihrer Saetze ein Paar; ein Einzelportraet haette sie getrennt.
    # Die Datei heisst deshalb nach beiden und nicht nach einem: index.html
    # haengt ueber PORTRAET_DATEI beide Figurenschluessel an dasselbe Blatt, und
    # loadAssets() laedt es an einer URL genau einmal. Zwei bytegleiche Dateien
    # waeren 7 KB umsonst im Build.
    'lott-pahl':  '11-lott-pahl',
    'nieselbeck': '12-nieselbeck',
    'umlauf':     '13-umlauf',
    'vorblatt':   '14-vorblatt',
    # T4-Nachlese: Anlage 2 ist die letzte Figur, die hier dazukommt, und die
    # einzige ohne Sprite. Bis hierher war ihr Portraetfeld ein Platzhalter aus
    # tools/anlage2-portraet.py, denn ohne Datei haette gespraechPortrait()
    # nichts zum Zurueckfallen und das Feld bliebe dunkel.
    'anlage2':    '21-anlage2',
}

def raster(quelle: pathlib.Path) -> Image.Image:
    """Das eigentliche Bild: 128x128, 32 Farben, kein Dithering."""
    im = Image.open(quelle).convert("RGB")
    # BOX statt NEAREST: mittelt den JPEG-Dreck weg, statt ihn zu treffen
    klein = im.resize((RASTER, RASTER), Image.BOX)
    return klein.quantize(colors=FARBEN, method=Image.MEDIANCUT,
                          dither=Image.Dither.NONE)

def kur(quelle: pathlib.Path) -> pathlib.Path:
    ziel = quelle.with_name(quelle.stem + "-px.png")
    raster(quelle).convert("RGB").resize((AUSGABE, AUSGABE), Image.NEAREST).save(ziel)
    return ziel

def tafel(ordner: pathlib.Path) -> list:
    ziel_ordner = ordner.parent / "portraets"
    ziel_ordner.mkdir(exist_ok=True)
    geschrieben = []
    for schluessel, grund in sorted(TAFEL.items()):
        quelle = ordner / (grund + ".jpg")
        if not quelle.exists():
            print(f"FEHLT: {quelle} — {schluessel} bekaeme den Sprite-Ausschnitt")
            continue
        ziel = ziel_ordner / (schluessel + ".png")
        # optimize=True kostet nichts an Bildinhalt und rund 8 Prozent Datei.
        raster(quelle).save(ziel, optimize=True)
        geschrieben.append(ziel)
    return geschrieben

def main(argv):
    ordner = pathlib.Path(__file__).resolve().parent.parent / "assets" / "figuren"
    if "--tafel" in argv:
        argv = [a for a in argv if a != "--tafel"]
        ziele = tafel(ordner)
        summe = sum(z.stat().st_size for z in ziele)
        for z in ziele:
            print(f"{z}  {z.stat().st_size} B")
        print(f"{len(ziele)} Tafelfassungen, zusammen {summe/1024:.1f} KB")
        if not argv:
            return
    if argv:
        quellen = [pathlib.Path(a) for a in argv]
    else:
        quellen = [p for p in sorted(ordner.glob("*.jpg"))
                   if not p.with_name(p.stem + "-px.png").exists()]
        if not quellen:
            print("nichts zu tun, jedes Original hat seine -px-Fassung")
            return
    for q in quellen:
        print(kur(q))

if __name__ == "__main__":
    main(sys.argv[1:])
