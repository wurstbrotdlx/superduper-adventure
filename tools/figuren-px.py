#!/usr/bin/env python3
"""Pixelkur fuer die Figurenportraets.

Midjourney gibt hochaufloesendes JPEG aus, das grobe Pixel nur imitiert: an
schraegen Kanten sitzen Zwischenpixel, und die Farbzahl liegt drei Groessen-
ordnungen ueber den 32 aus dem Prompt. Dieses Skript setzt beides durch.

    python3 tools/figuren-px.py assets/figuren/06-trepp.jpg

Ergebnis liegt daneben als *-px.png. Ohne Argument laeuft es ueber jedes
Original in assets/figuren/, dem die -px-Fassung fehlt.
"""
import sys, pathlib
from PIL import Image

RASTER = 128   # Kantenlaenge der echten Pixelfassung
FARBEN = 32    # Palettengrenze aus dem Prompt
AUSGABE = 1024 # Anzeigegroesse, ganzzahliges Vielfaches von RASTER

def kur(quelle: pathlib.Path) -> pathlib.Path:
    ziel = quelle.with_name(quelle.stem + "-px.png")
    im = Image.open(quelle).convert("RGB")
    # BOX statt NEAREST: mittelt den JPEG-Dreck weg, statt ihn zu treffen
    klein = im.resize((RASTER, RASTER), Image.BOX)
    q = klein.quantize(colors=FARBEN, method=Image.MEDIANCUT,
                       dither=Image.Dither.NONE).convert("RGB")
    q.resize((AUSGABE, AUSGABE), Image.NEAREST).save(ziel)
    return ziel

def main(argv):
    if argv:
        quellen = [pathlib.Path(a) for a in argv]
    else:
        ordner = pathlib.Path(__file__).resolve().parent.parent / "assets" / "figuren"
        quellen = [p for p in sorted(ordner.glob("*.jpg"))
                   if not p.with_name(p.stem + "-px.png").exists()]
        if not quellen:
            print("nichts zu tun, jedes Original hat seine -px-Fassung")
            return
    for q in quellen:
        print(kur(q))

if __name__ == "__main__":
    main(sys.argv[1:])
