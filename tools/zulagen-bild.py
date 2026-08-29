#!/usr/bin/env python3
"""Rechnet Midjourney-Kartenkunst auf die Groesse, die die Karte braucht.

    python3 tools/zulagen-bild.py                      # alles aus assets/eingang/
    python3 tools/zulagen-bild.py assets/eingang/x.png # eine einzelne Datei
    python3 tools/zulagen-bild.py --pruefen            # nur nachsehen, nichts schreiben

Quelle ist assets/eingang/, Ziel ist assets/zulagen/. Nur das Ziel gehoert ins
Repo; der Eingang ist der Zweig, der weggeworfen wird.

Warum es dieses Skript gibt und nicht figuren-px.py mitbenutzt wird: das dort
ist eine Pixelkur (zweiunddreissig Farben, Raster 128) fuer die Amiga-Formel der
Figurenportraets. Die Kartenkunst steht seit K1-11 ausdruecklich auf dem
Gegenteil, gemalt und gesaettigt, an Referenzbildern nachgemessen drei- bis
viermal so bunt. Eine Quantisierung waere hier kein Stil, sondern ein Schaden.

Die Zahlen sind gemessen, nicht gewaehlt. Das Bildfenster der Karte misst
149 mal 112 Punkte; auf einem Schirm mit doppelter Punktdichte sind das
299 mal 225 echte Pixel, am Telefon 304 mal 229. RASTER liegt darueber und
laesst Luft fuer dreifache Punktdichte, ohne dass fuenfundvierzig Dateien den
Build sprengen.

JPEG und nicht WebP, und das ist kein Geschmack: die Zuordnung von Endung zu
Dateityp in tools/build-single.mjs kennt nur .png, .gif, .jpg und .jpeg, und
unbekannte Endungen werden dort STILLSCHWEIGEND uebersprungen. Eine .webp fiele
lautlos aus dem Build und die Karte bliebe im ausgelieferten Spiel leer.
"""
import sys, re, pathlib
from PIL import Image

WURZEL   = pathlib.Path(__file__).resolve().parent.parent
EINGANG  = WURZEL / 'assets' / 'eingang'
ZIEL     = WURZEL / 'assets' / 'zulagen'
RASTER   = (400, 300)      # vier zu drei, deckt 299x225 mit Luft nach oben
GUETEN   = [88, 85, 82, 78, 74]   # von oben nach unten, bis das Gewicht passt
DECKEL   = 1_800_000       # Byte fuer alle fuenfundvierzig zusammen
STUFEN   = (1, 2, 3)


def familien():
    """Die Familienschluessel aus dem Spielskript, nicht aus dem Kopf.

    Abgeschriebene Tabellen laufen auseinander. Diese hier kann es nicht:
    sie ist dieselbe Quelle, aus der das Spiel seine Karten baut.

    Seit der Teilung liegt das Skript in skript/01..07. Gelesen werden alle
    Teile verkettet und nicht der eine, in dem ZULAGE heute steht: welcher das
    ist, ist eine Schnittfrage und keine Zusage.
    """
    teile = sorted((WURZEL / 'skript').glob('*.js'))
    if not teile:
        raise SystemExit('Keine skript/*.js gefunden - steht das Werkzeug in tools/?')
    quelle = '\n'.join(p.read_text(encoding='utf-8') for p in teile)
    i = quelle.index('const ZULAGE')
    j = quelle.index('\n};', i)
    return re.findall(r'^  ([a-zA-Z_]+):\s*\{', quelle[i:j], re.M)


def zerlege(name, bekannt):
    """'stichprobe-3.jpg' -> ('stichprobe', 3). Sonst ein Satz, was fehlt."""
    stamm = pathlib.Path(name).stem
    treffer = re.fullmatch(r'(.+)-([123])', stamm)
    if not treffer:
        return None, 'Name passt nicht auf schluessel-stufe (erwartet z. B. stichprobe-3)'
    schluessel, stufe = treffer.group(1), int(treffer.group(2))
    if schluessel not in bekannt:
        return None, f'Familie "{schluessel}" steht nicht im Katalog'
    return (schluessel, stufe), None


def vierdrittel(bild):
    """Mittiger Zuschnitt auf vier zu drei.

    Ohne das schneidet object-fit:cover im Browser selbst zu, und zwar
    unkontrolliert: was aus dem Bild faellt, entscheidet dann die Karte statt
    dieses Laufs. Lieber hier, wo es nachvollziehbar ist.
    """
    b, h = bild.size
    soll = RASTER[0] / RASTER[1]
    if b / h > soll:
        neu = int(round(h * soll))
        links = (b - neu) // 2
        return bild.crop((links, 0, links + neu, h))
    neu = int(round(b / soll))
    oben = (h - neu) // 2
    return bild.crop((0, oben, b, oben + neu))


def rechne(pfad, guete):
    bild = Image.open(pfad)
    if bild.mode != 'RGB':
        bild = bild.convert('RGB')
    bild = vierdrittel(bild).resize(RASTER, Image.LANCZOS)
    return bild, guete


def lauf(quellen, schreiben=True):
    bekannt = familien()
    fehler, fertig = [], []

    paare = []
    for p in quellen:
        schluessel, grund = zerlege(p.name, bekannt)
        if grund:
            fehler.append(f'{p.name}: {grund}')
        else:
            paare.append((p, schluessel))

    # Doppelte Zuordnung faellt sonst erst auf, wenn eine Datei die andere
    # ueberschrieben hat und niemand weiss, welche gewonnen hat.
    gesehen = {}
    for p, sch in paare:
        gesehen.setdefault(sch, []).append(p.name)
    strittig = set()
    for sch, namen in gesehen.items():
        if len(namen) > 1:
            fehler.append(f'{sch[0]}-{sch[1]}: mehrfach belegt durch {", ".join(sorted(namen))}'
                          + ' — keine der beiden wird geschrieben')
            strittig.add(sch)
    # Strittige fliegen raus statt einander zu ueberschreiben. Eine Meldung, die
    # den Schaden trotzdem anrichtet, ist keine: nach dem Lauf stuende eine der
    # beiden Dateien im Ziel und niemand wuesste, welche gewonnen hat.
    paare = [(p, sch) for p, sch in paare if sch not in strittig]

    if fehler:
        print('Nicht zuzuordnen:')
        for f in sorted(fehler):
            print('  ' + f)
        print()

    if not paare:
        return fehler, fertig

    if schreiben:
        ZIEL.mkdir(parents=True, exist_ok=True)

    # Die Guete wird nicht gewaehlt, sondern gesucht: die hoechste, mit der
    # alle fuenfundvierzig zusammen unter den Deckel passen. Hochgerechnet
    # ueber den Schnitt dieses Laufs, damit auch ein Schub von drei Bildern
    # schon sagt, ob die ganze Serie passen wird.
    for guete in GUETEN:
        gewichte = {}
        for p, sch in paare:
            bild, _ = rechne(p, guete)
            ziel = ZIEL / f'{sch[0]}-{sch[1]}.jpg'
            bild.save(ziel, 'JPEG', quality=guete, optimize=True, progressive=True)
            gewichte[ziel] = ziel.stat().st_size
        schnitt = sum(gewichte.values()) / len(gewichte)
        hochgerechnet = schnitt * len(bekannt) * len(STUFEN)
        if hochgerechnet <= DECKEL or guete == GUETEN[-1]:
            break

    for ziel in sorted(gewichte):
        fertig.append(ziel)
        print(f'  {ziel.relative_to(WURZEL)}  {gewichte[ziel] / 1024:.1f} KB')

    print()
    print(f'Guete {guete}, Schnitt {schnitt / 1024:.1f} KB je Bild.')
    print(f'Hochgerechnet auf {len(bekannt) * len(STUFEN)} Bilder: '
          f'{hochgerechnet / 1024:.0f} KB (Deckel {DECKEL / 1024:.0f} KB)'
          + ('' if hochgerechnet <= DECKEL else '  ZU SCHWER'))

    # Was noch fehlt, gehoert in die Meldung. Ein Lauf, der nur sagt, was er
    # getan hat, laesst offen, wie weit die Serie ist.
    da = {tuple(f.stem.rsplit('-', 1)) for f in ZIEL.glob('*.jpg')} if ZIEL.exists() else set()
    da = {(s, int(n)) for s, n in da if n.isdigit()}
    offen = [(f, st) for f in bekannt for st in STUFEN if (f, st) not in da]
    print(f'Im Ziel liegen {len(da)} von {len(bekannt) * len(STUFEN)} Bildern.')
    if offen:
        print('Es fehlen noch: ' + ', '.join(f'{f}-{st}' for f, st in offen[:12])
              + (' und weitere' if len(offen) > 12 else ''))

    return fehler, fertig


if __name__ == '__main__':
    argumente = [a for a in sys.argv[1:] if not a.startswith('--')]
    schreiben = '--pruefen' not in sys.argv

    if argumente:
        quellen = [pathlib.Path(a) for a in argumente]
    elif EINGANG.is_dir():
        quellen = sorted(p for p in EINGANG.iterdir()
                         if p.suffix.lower() in ('.png', '.jpg', '.jpeg', '.webp'))
    else:
        print(f'Kein Eingang unter {EINGANG.relative_to(WURZEL)}.')
        sys.exit(1)

    if not quellen:
        print('Nichts zu tun: der Eingang ist leer.')
        sys.exit(0)

    fehler, fertig = lauf(quellen, schreiben)
    sys.exit(1 if fehler else 0)
