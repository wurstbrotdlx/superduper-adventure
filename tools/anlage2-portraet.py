#!/usr/bin/env python3
"""Zeichnet das Platzhalter-Portraet fuer Anlage 2 (T3).

Warum es dieses Werkzeug gibt: die achtzehn gemalten Portraets des Spiels
stammen aus Midjourney und werden mit tools/figuren-px.py auf 128x128 und 32
Farben gebracht. Anlage 2 ist mit T3 als siebzehnte Figur dazugekommen, ihr
Bildprompt steht als Nummer 21 in figuren-bildprompts.md, und bis ein Motiv
daraus vorliegt, braucht die Gespraechstafel trotzdem ein Bild. Ohne Datei
faellt gespraechPortrait() auf den Sprite-Ausschnitt zurueck, und Anlage 2 hat
keinen Sprite: sie ist ein Schriftstueck und laeuft nicht im Dorf herum.

Der Platzhalter ist deshalb kein Notbehelf, sondern dasselbe Motiv in derselben
Palette, nur geometrisch statt gemalt: ein vergilbtes Blatt mit Eselsohr, eine
Messingklammer oben links, darunter der Fetzen eines zweiten Blattes. Gezeichnet
wird auf 64x64 und verdoppelt, damit die Pixel so grob sind wie im uebrigen
Bestand.

Die Farben sind nicht erfunden, sondern aus assets/portraets/bramsche.png
abgelesen: derselbe Grund, dieselben Papiertoene, dieselbe Umrisslinie.

    python3 tools/anlage2-portraet.py

Schreibt assets/portraets/anlage2.png. Wird das Midjourney-Bild geliefert,
ersetzt der uebliche Weg diese Datei und dieses Werkzeug wird nicht mehr
gebraucht.
"""

import os
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit('Pillow fehlt. python3 -m pip install Pillow')

GRUND   = (0x24, 0x2d, 0x2a)   # derselbe dunkle Grund wie bei den gemalten Portraets
PAPIER  = (0xce, 0xb6, 0x99)   # vergilbtes Blatt, Lichtseite
PAPIER_S= (0xa0, 0x80, 0x63)   # Schattenseite, fuer Dither und Knick
PAPIER_T= (0x6a, 0x58, 0x56)   # tiefster Schatten, Eselsohr-Unterseite
FETZEN  = (0x8e, 0x7e, 0x66)   # der Rest des zweiten Blattes unter der Klammer
MESSING = (0xb8, 0x91, 0x3f)   # Heftklammer, Lichtseite
MESSING_S=(0x7a, 0x5f, 0x28)   # Heftklammer, Schatten
LINIE   = (0x10, 0x13, 0x15)   # Umrisslinie, wie im Bestand

N = 64          # Zeichenraster, wird am Ende verdoppelt
GROESSE = 128   # was portraetAssert() erwartet


def dither(x, y):
    """Geordnetes 2x2-Muster. Flache Fuellungen mit hartem Raster statt Verlauf."""
    return (x + y) % 2 == 0


def main():
    hier = os.path.dirname(os.path.abspath(__file__))
    ziel = os.path.join(os.path.dirname(hier), 'assets', 'portraets', 'anlage2.png')

    im = Image.new('RGB', (N, N), GRUND)
    px = im.load()

    # Das Blatt. Rechteckig, mit einem umgeknickten Eck oben rechts: das
    # Eselsohr ist die Diagonale von OHR_X auf der Oberkante bis OHR_Y auf der
    # rechten Kante. Was rechts oberhalb dieser Linie liegt, ist nicht mehr
    # Blatt, sondern Grund; was knapp darunter liegt, ist die umgeschlagene
    # Rueckseite und deshalb dunkler.
    oben, unten, links, rechts = 6, 58, 12, 52
    OHR = 11                       # Kantenlaenge des umgeknickten Ecks
    for y in range(oben, unten):
        for x in range(links, rechts):
            eck = (x - (rechts - OHR)) - (y - oben)   # > 0 heisst oberhalb der Diagonale
            if eck > 0:
                continue                              # weggeknickte Ecke, Grund bleibt stehen
            if eck > -3:
                px[x, y] = PAPIER_T                   # die umgeschlagene Rueckseite
                continue
            # Schattenseite rechts und unten, als Dither statt als Verlauf.
            rand = (x - links < 2) or (rechts - x < 4) or (unten - y < 3)
            px[x, y] = PAPIER_S if (rand and dither(x, y)) else PAPIER

        # Umrisslinie links, und rechts nur unterhalb des Eselsohrs
        px[links - 1, y] = LINIE
        if y - oben >= OHR:
            px[rechts, y] = LINIE

    # Umrisslinie oben (bis zum Ohr), unten, und die Knickkante des Ohrs selbst
    for x in range(links - 1, rechts - OHR + 1):
        px[x, oben - 1] = LINIE
    for x in range(links - 1, rechts + 1):
        px[x, unten] = LINIE
    for i in range(OHR + 1):
        px[rechts - OHR + i, oben + i] = LINIE

    # Der Knick quer ueber das Blatt. Ein Blatt, das jahrzehntelang beigefuegt
    # war, ist einmal gefaltet worden und erinnert sich daran.
    for x in range(links + 1, rechts - 1):
        y = 36 + (x - links) // 24
        px[x, y] = PAPIER_S
        if dither(x, y):
            px[x, y + 1] = PAPIER_S

    # Der Fetzen des zweiten Blattes, unter der Klammer, oben links. Das ist
    # der Rest der Hauptsache: was von ihr blieb, als man sie abgeheftet hat.
    for y in range(3, 13):
        for x in range(8, 20 - (y - 3) // 3):
            px[x, y] = FETZEN if not dither(x, y) else PAPIER_S
    for x in range(8, 20):
        px[x, 2] = LINIE

    # Die Heftklammer. Sie ist absichtlich zu gross fuer das Blatt: sie ist die
    # Figur, nicht das Papier.
    for x in range(9, 22):
        px[x, 7] = MESSING
        px[x, 8] = MESSING_S
    for y in range(7, 15):          # linker Schenkel
        px[9, y] = MESSING
        px[10, y] = MESSING_S
    for y in range(7, 13):          # rechter Schenkel, kuerzer, weil verbogen
        px[20, y] = MESSING
        px[21, y] = MESSING_S
    for x in range(9, 22):          # Umrisslinie oben
        px[x, 6] = LINIE
    px[8, 14] = LINIE
    px[22, 12] = LINIE

    im.resize((GROESSE, GROESSE), Image.NEAREST).convert(
        'P', palette=Image.ADAPTIVE, colors=32).save(ziel)
    print('geschrieben:', ziel)


if __name__ == '__main__':
    main()
