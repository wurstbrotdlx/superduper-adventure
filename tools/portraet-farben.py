#!/usr/bin/env python3
"""Misst die Haar- und Kleiderfarben der Figurenportraets.

    python3 tools/portraet-farben.py            die Tabelle
    python3 tools/portraet-farben.py --breit    dazu die haeufigsten Einzelfarben
    python3 tools/portraet-farben.py --pruef    Soll-Ist gegen DORF_FIGUREN

Grundlage fuer G8 (phase-g8-figurenfarben.md): die Dorffiguren sollen im Dorf
dieselben Farben tragen wie ihr gemaltes Portraet in der Gespraechstafel. Was
dieser Lauf ausgibt, steht als haarFarbe und hemdFarbe in DORF_FIGUREN - die
Hexwerte dort sind gemessen und nicht gewaehlt, und dieser Aufruf ist der Beleg.

Drei Zonen je Bild, im 128er-Raster der Spielfassung (assets/portraets/):

  Haar       oberstes Fuenftel, mittlere 56 Prozent der Breite. Bei Trepp und
             Nieselbeck ist das die Dienstmuetze ueber dem Haar - beides sitzt
             im Spiel auf demselben Haar-Layer, die Muetze ist also kein
             Messfehler, sondern das Ziel.
  Gesicht    mittleres Viertel. Gebraucht nur fuer den Hautton (Noergel ist ein
             gruener Kobold), sonst nachrichtlich.
  Hemd       unterstes Sechstel, aber nur die beiden aeusseren Drittel. Die
             Mitte faellt weg, dort sitzen Kinnschatten, Amtskette und
             Taschenriemen statt Stoff.

Zwei Sorten Pixel zaehlen nirgends mit: der Grund (die haeufigste der vier
Bildecken, je Bild neu bestimmt - er streut ueber die Sammlung, siehe
assets/figuren/README.md) und Umrisspixel unter Helligkeit UMRISS.

Ausgegeben wird je Zone nicht die haeufigste Einzelfarbe, sondern der Mittelton
ihrer Farbfamilie: alle Pixel der Zone, deren Farbton hoechstens FAMILIE von der
haeufigsten abweicht, gemittelt. Grund ist die Rechnung in farbBlatt(): sie legt
ein Helligkeitsband um die Zielfarbe, die Zielfarbe ist dessen Mitte. Ein
Glanzlicht oder ein Schattenrand als Ziel zoege das ganze Blatt mit sich.

Was hier nicht gemessen wird, weil die Portraets an der Brust enden: Hose und
Schuhe. Die Hose leitet bakeNpcSheet() aus hemdFarbe ab (dunkler), die Schuhe
bleiben auf ihrer Paketfarbe.

--pruef liest die haarFarbe- und hemdFarbe-Werte aus index.html zurueck und
haelt sie gegen die Messung. Damit ist die Zusage von G8 pruefbar und nicht nur
behauptet: die Farben im Spiel sind die der Portraets. Exit-Code 1 bei der
ersten Abweichung, wie bei den uebrigen Pruefwerkzeugen.
"""
import os, sys
from collections import Counter
from PIL import Image

HIER     = os.path.dirname(os.path.abspath(__file__))
PORTRAET = os.path.join(HIER, '..', 'assets', 'portraets')
FIGUREN  = os.path.join(HIER, '..', 'assets', 'figuren')

UMRISS   = 0.05   # Helligkeit, unterhalb derer ein Pixel als Kontur gilt
DUNKEL   = 0.09   # Helligkeit, auf die ein zu dunkler Mittelton angehoben wird
NEUTRAL  = 8      # RGB-Spanne, unterhalb derer ein Ton als unbunt gilt
GRUND_TOL= 54     # Manhattan-Abstand im RGB, ab dem eine Farbe nicht mehr Grund ist
FAMILIE  = 0.055  # halbe Breite des Farbtonfensters um die haeufigste Farbe

# Die Standardzonen. x0, x1, y0, y1 als Anteil der Bildkante, dazu ein
# Mittelfenster, das ausgespart wird.
ZONEN = {
    'haar':    (0.22, 0.78, 0.02, 0.20, None),
    'gesicht': (0.36, 0.64, 0.40, 0.62, None),
    'hemd':    (0.04, 0.96, 0.84, 1.00, (0.34, 0.66)),
}

# Sonderfaelle. Wo die Standardzone etwas anderes trifft als das, was sie treffen
# soll, steht hier das eigene Fenster und der Grund dafuer. Jeder Eintrag ist ein
# Befund am Bild, keine Geschmacksentscheidung.
SONDER = {
    ('knoeterich', 'haar'): ((0.10, 0.90, 0.04, 0.14, None), UMRISS,
        'gescheiteltes Haar ueber hoher Stirn - die Standardzone misst die Stirn, '
        'gemessen wird der Streifen ueber den Schlaefen'),
    ('milb', 'haar'): ((0.05, 0.28, 0.35, 0.75, None), UMRISS,
        'Hochstirn. Sein langes graues Haar faellt seitlich zum Kragen; nur die '
        'linke Seite, er steht im Halbprofil und rechts ist Haut'),
    ('vorblatt', 'haar'): ((0.25, 0.75, 0.02, 0.14, None), 0.0,
        'glattes schwarzes Haar, dunkler als die Umrissgrenze - ohne sie faellt '
        'die Zone leer aus und die Messung rutscht auf die Stirn'),
    ('vorblatt', 'hemd'): (ZONEN['hemd'], 0.0,
        'derselbe Grund: der Mantel ist so dunkel wie seine Kontur. Mit der '
        'Grenze bliebe nur die Goldbordüre stehen, und die ist nicht der Mantel'),
}

# Lott und Pahl haben kein eigenes Portraet - Motiv 11 ist ein Doppelportraet und
# laesst sich nicht in zwei Gesichter schneiden (assets/portraets/README.md).
# Fuer die Farbe reicht es trotzdem: jeder von beiden fuellt seine Bildhaelfte,
# und gemessen wird hier nur Haar und Mantel, nicht das Gesicht.
# Der Zuschnitt ist ein anderer als bei den Einzelportraets: beide Koepfe setzen
# erst bei knapp einem Siebtel Bildhoehe an, die Standardzone traefe darueber nur
# Grund. Deshalb ein eigenes Haarfenster fuer diese beiden.
DOPPEL_ZONEN = dict(ZONEN, haar=(0.22, 0.78, 0.16, 0.34, None))
DOPPEL = {
    'lott': (os.path.join(FIGUREN, '11-lott-pahl-px.png'), 0.02, 0.46),
    'pahl': (os.path.join(FIGUREN, '11-lott-pahl-px.png'), 0.52, 0.96),
}

def hexv(c):  return '#%02x%02x%02x' % tuple(int(round(v)) for v in c)
def hell(c):  return (max(c) + min(c)) / 510.0
def istGrund(a, b): return abs(a[0]-b[0]) + abs(a[1]-b[1]) + abs(a[2]-b[2]) < GRUND_TOL

def farbton(c):
    r, g, b = c[0]/255, c[1]/255, c[2]/255
    mx, mn = max(r, g, b), min(r, g, b)
    d = mx - mn
    if not d: return None
    h = ((g-b)/d + (6 if g < b else 0)) if mx == r else ((b-r)/d + 2 if mx == g else (r-g)/d + 4)
    return h/6

def tonNah(a, b):
    # Grau hat keinen Farbton. Zwei graue Toene gehoeren zusammen, ein grauer und
    # ein bunter nie - sonst zoege Zapfs Bart seine Latzhose ins Mittel.
    ta, tb = farbton(a), farbton(b)
    if ta is None or tb is None: return (ta is None) == (tb is None)
    d = abs(ta - tb)
    return min(d, 1 - d) <= FAMILIE

def brauchbar(c):
    """Haelt einen gemessenen Mittelton als Zielfarbe brauchbar.

    Zwei Faelle, beide an Bramsches Knoten und Vorblatts Mantel aufgefallen:

    Nahezu Schwarz. farbBlatt() legt ein Helligkeitsband von plus/minus 0.22 um
    die Zielfarbe und klemmt es unten bei 0.06. Ein Ziel bei Helligkeit 0.01
    faellt also fast ganz auf die Klemme, das Blatt verliert seine Schattierung
    und wird eine Flaeche. Deshalb wird auf DUNKEL angehoben: die Figur bleibt
    schwarz und behaelt ihre Zeichnung.

    Falscher Farbton. Bei #010204 liegen zwei Zahlenschritte zwischen den
    Kanaelen; die HSL-Rechnung liest daraus eine Saettigung von 0.6 und faerbte
    das halbe Blatt blau. Unter NEUTRAL Schritten Spanne ist der Ton
    Quantisierungsrauschen und kein Farbton - der Mittelton wird grau genommen.
    """
    r, g, b = (max(0.0, min(255.0, v)) for v in c)
    if max(r, g, b) - min(r, g, b) < NEUTRAL:
        r = g = b = (max(r, g, b) + min(r, g, b)) / 2
    l = hell((r, g, b))
    if l <= 0: return (DUNKEL*255, DUNKEL*255, DUNKEL*255)
    if l < DUNKEL:
        f = DUNKEL / l
        r, g, b = min(255.0, r*f), min(255.0, g*f), min(255.0, b*f)
    return (r, g, b)

def messeZone(px, w, h, grund, fenster, umriss, xoff=0.0, xspan=1.0):
    x0, x1, y0, y1, luecke = fenster
    # Bei einer Bildhaelfte (Lott, Pahl) wird das Fenster in sie hineingerechnet.
    x0, x1 = xoff + x0*xspan, xoff + x1*xspan
    lk = (int(w*(xoff + luecke[0]*xspan)), int(w*(xoff + luecke[1]*xspan))) if luecke else None
    treffer = []
    for y in range(int(h*y0), int(h*y1)):
        for x in range(int(w*x0), int(w*x1)):
            if lk and lk[0] <= x < lk[1]: continue
            c = px[x, y]
            if istGrund(c, grund) or hell(c) < umriss: continue
            treffer.append(c)
    if not treffer: return None, []
    haeufig = Counter(treffer).most_common(3)
    fam = [c for c in treffer if tonNah(c, haeufig[0][0])]
    mittel = brauchbar(tuple(sum(c[i] for c in fam)/len(fam) for i in range(3)))
    return mittel, [c for c, _ in haeufig]

def messen(key, pfad, xoff=0.0, xspan=1.0):
    im = Image.open(pfad).convert('RGB')
    w, h = im.size
    px = im.load()
    grund = Counter([px[0,0], px[w-1,0], px[0,h-1], px[w-1,h-1]]).most_common(1)[0][0]
    aus = {'groesse': f'{w}x{h}', 'grund': grund}
    for name, fenster in (DOPPEL_ZONEN if key in DOPPEL else ZONEN).items():
        f, u, _ = SONDER.get((key, name), (fenster, UMRISS, None))
        aus[name] = messeZone(px, w, h, grund, f, u, xoff, xspan)
    return aus

def ausIndex():
    """haarFarbe/hemdFarbe je Figurenschluessel aus index.html.

    Gelesen wird mit einem Ausdruck und nicht mit einem Parser: die Tabelle ist
    JavaScript in einer HTML-Datei, und der einzige Teil, auf den es ankommt,
    steht in einer Zeile. Knoeterich steht nicht in DORF_FIGUREN, sondern in
    KN_GESTALT; beide haben dieselbe Form und werden hier gleich gelesen.
    """
    import re
    pfad = os.path.join(HIER, '..', 'index.html')
    text = open(pfad, encoding='utf-8').read()
    aus = {}
    for m in re.finditer(r"\{key:'([a-z0-9]+)',[^\n]*?\n(?:\s*//[^\n]*\n)*\s*gestalt:\{([^}]*)\}", text):
        aus[m.group(1)] = m.group(2)
    kn = re.search(r'const KN_GESTALT = \{([^}]*)\}', text)
    if kn: aus['knoeterich'] = kn.group(1)
    werte = {}
    for key, roh in aus.items():
        e = {}
        for feld in ('haarFarbe', 'hemdFarbe'):
            t = re.search(feld + r":\s*'(#[0-9a-fA-F]{6})'", roh)
            if t: e[feld] = t.group(1).lower()
        werte[key] = e
    return werte

def pruefen(reihen):
    imCode = ausIndex()
    if not imCode:
        print('index.html liefert keine Gestalt-Zeilen - Ausdruck oder Tabelle geaendert?', file=sys.stderr)
        return 1
    fehl = 0
    print(f'{"Figur":<12} {"Feld":<10} {"gemessen":<10} {"im Code":<10} Urteil')
    for key, pfad, xoff, xspan in reihen:
        m = messen(key, pfad, xoff, xspan)
        for feld, name in (('haar', 'haarFarbe'), ('hemd', 'hemdFarbe')):
            soll = m[feld][0]
            ist = imCode.get(key, {}).get(name)
            if soll is None: continue
            sollHex = hexv(soll)
            gut = ist == sollHex
            if not gut: fehl += 1
            print(f'{key:<12} {name:<10} {sollHex:<10} {ist or "-":<10} {"ok" if gut else "ABWEICHUNG"}')
    fehlt = [k for k in imCode if k not in {r[0] for r in reihen}]
    if fehlt: print(f'\nOhne Portraet und deshalb ungeprueft: {", ".join(sorted(fehlt))}')
    print(f'\n{"Kein Unterschied" if not fehl else str(fehl) + " Abweichungen"} '
          f'zwischen Messung und Tabelle.')
    return 1 if fehl else 0

def main():
    breit = '--breit' in sys.argv
    reihen = []
    if os.path.isdir(PORTRAET):
        for n in sorted(os.listdir(PORTRAET)):
            if n.endswith('.png'): reihen.append((n[:-4], os.path.join(PORTRAET, n), 0.0, 1.0))
    for key, (pfad, a, b) in DOPPEL.items():
        if os.path.exists(pfad): reihen.append((key, pfad, a, b - a))
    if not reihen:
        print('Keine Portraets gefunden.', file=sys.stderr); return 1
    reihen.sort()
    if '--pruef' in sys.argv: return pruefen(reihen)

    b = 30 if breit else 9
    print(f'{"Figur":<12} {"Grund":<9} {"haarFarbe":<{b}} {"Gesicht":<{b}} {"hemdFarbe"}')
    for key, pfad, xoff, xspan in reihen:
        m = messen(key, pfad, xoff, xspan)
        def f(name):
            mittel, top = m[name]
            if mittel is None: return '  -  '
            return hexv(mittel) + (('  ' + ' '.join(hexv(c) for c in top[:2])) if breit else '')
        stern = '*' if any(k == key for k, _ in SONDER) else ' '
        print(f'{key + stern:<12} {hexv(m["grund"]):<9} {f("haar"):<{b}} {f("gesicht"):<{b}} {f("hemd")}')

    print(f'\n{len(reihen)} Figuren gemessen.')
    if breit: print('Je Zone: Mittelton der Farbfamilie, dahinter die zwei haeufigsten Einzelfarben.')
    if SONDER:
        print('\n* eigenes Messfenster:')
        for (key, name), (_, _, grund) in SONDER.items():
            print(f'  {key}.{name}: {grund}')
    return 0

if __name__ == '__main__':
    sys.exit(main())
