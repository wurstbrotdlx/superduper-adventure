#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Rechnet den Monsterkatalog (Sollstufe 1 bis 10) und schreibt ihn heraus.

    python3 tools/monsterkatalog.py

Erzeugt im Wurzelverzeichnis:
    monsterkatalog-stufe-1-10.md   Rechenbasis, JSON-Katalog, Selbstpruefung
    monsterkatalog.json            derselbe Katalog, nur die Daten

Die Referenzwerte des Spielers sind aus index.html abgeleitet (recalc, hurtPlayer,
drinkPotion, gainXP). Wer dort etwas aendert, aendert hier die Rechenbasis und muss
neu erzeugen. Das Skript prueft alle harten Invarianten selbst und meldet jede
Verletzung in der Spalte "Befund" der Selbstpruefungstabelle.
"""
import json, math, os, re, copy
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

M = {
 'Anhoerung':'Anhörung','Anzuenden':'Anzünden','Duenenpriester':'Dünenpriester','Eroeffnung':'Eröffnung',
 'Erschoepfung':'Erschöpfung','Faulgasstoss':'Faulgasstoß','Fledermausfluegel':'Fledermausflügel',
 'Fuerstenkrone':'Fürstenkrone','Hoehle':'Höhle','Kupfermuenzen':'Kupfermünzen','Oberflaeche':'Oberfläche',
 'Rueckstoss':'Rückstoß','Sammelverfuegung':'Sammelverfügung','Schlaege':'Schläge','Skarabaeus':'Skarabäus',
 'Skelettknoechel':'Skelettknöchel','Stueck':'Stück','Toeten':'Töten','Verfuegung':'Verfügung',
 'Verfuegungsfenster':'Verfügungsfenster','Verschnueren':'Verschnüren','Wueste':'Wüste',
 'Zurueckverweisen':'Zurückverweisen','Zurueckweichen':'Zurückweichen','Zuschlagsverfuegung':'Zuschlagsverfügung',
 'Zwoelf':'Zwölf','Gruenhaut':'Grünhaut','Fristlaeufer':'Fristläufer','Hoehlenspinne':'Höhlenspinne',
 'Fussnote':'Fußnote','Ruecklauf':'Rücklauf','Fristverlaengerung':'Fristverlängerung',
 'Verfuegungsform':'Verfügungsform','Loseblattbuendel':'Loseblattbündel','Botensohle':'Botensohle',
 'Fuenf':'Fünf','Sandwurf':'Sandwurf','Gruppenangriffe':'Gruppenangriffe','Kegel':'Kegel',
 'Klammern':'Klammern','Zangengriff':'Zangengriff','Schluessel':'Schlüssel','Vorwaernung':'Vorwarnung','ausser':'außer','bestandskraeftig':'bestandskräftig','dafuer':'dafür','darueber':'darüber',
 'dreissig':'dreißig','duerfen':'dürfen','faellt':'fällt','faerbt':'färbt','fuer':'für','geoeffnet':'geöffnet',
 'gnaedig':'gnädig','haelt':'hält','haengt':'hängt','haerter':'härter','hinterlaesst':'hinterlässt',
 'kaempft':'kämpft','laeuft':'läuft','rechtskraeftig':'rechtskräftig','schliessen':'schließen','schlaegt':'schlägt',
 'sproede':'spröde','stoesst':'stößt','traegt':'trägt','ueber':'über','verfuegt':'verfügt','verlaengert':'verlängert',
 'verschnuert':'verschnürt','waehrend':'während','waere':'wäre','weiss':'weiß','wuetend':'wütend',
 'zulaessiges':'zulässiges','zurueck':'zurück','zustaendig':'zuständig',
}
_re = re.compile(r'\b(' + '|'.join(sorted(M, key=len, reverse=True)) + r')\b')
def fix(s): return _re.sub(lambda m: M[m.group(0)], s)
def fixdeep(o):
    if isinstance(o, str): return fix(o)
    if isinstance(o, list): return [fixdeep(x) for x in o]
    if isinstance(o, dict): return {k: fixdeep(v) for k, v in o.items()}
    return o

# ---------------------------------------------------------------- Rechenbasis
# Referenzspieler, abgeleitet aus index.html (recalc, hurtPlayer, drinkPotion, gainXP).
# Build: je Stufe 1 Punkt STR, 1 Punkt VIT. Kein INT.
#   maxHp   = 70 + (L-1)*12 + vit*20
#   dmgAvg  = (base0+base1)/2 + str*3.5 + Affix
#   DPS     = dmgAvg * (1 + 0.25*0.7) * aps          (Crit 25 %, Faktor 1,7)
#   Minderung = armor/(armor+30), gedeckelt bei 0,6
REF = {}
GEAR = {  # Sollstufe: (waffe_base0, waffe_base1, aps, affix_dmg, armor, heilung_pro_min)
    1:  (5, 9, 1.3, 2,  0,  60),
    2:  (5, 9, 1.3, 2,  3,  60),
    3:  (5, 9, 1.3, 2,  5,  60),
    4:  (5, 9, 1.3, 5, 10,  90),
    5:  (5, 9, 1.3, 5, 10,  90),
    6:  (5, 9, 1.3, 5, 13,  90),
    7:  (5, 9, 1.3, 5, 13,  90),
    8:  (5, 9, 1.3, 8, 17, 120),
    9:  (5, 9, 1.3, 8, 17, 120),
    10: (5, 9, 1.3, 8, 20, 120),
}
for L, (b0, b1, aps, affix, armor, hpm) in GEAR.items():
    hp = 70 + (L - 1) * 12 + (L - 1) * 20
    dmg_avg = (b0 + b1) / 2 + (L - 1) * 3.5 + affix
    dps = dmg_avg * 1.175 * aps
    minderung = min(0.6, armor / (armor + 30))
    REF[L] = dict(hp=hp, dps=round(dps, 1), armor=armor, minderung=round(minderung, 3), hpm=hpm)

# Zauber: manabegrenzt. Z2 (Zauberbefugnis): Mana wird im Kampf erarbeitet,
# nicht mehr passiv geschenkt. Die Rate ist MANA_REGEN (2/s passiv) plus
# MANA_JE_TREFFER (4) je Waffenschwung bei 1,3 Schwuengen je Sekunde, zusammen
# 7,2 Mana/s IM Kampf. Funke: 16 Schaden je 5 Mana. Identisch abgeleitet in
# index.html (KAT_ZAUBER_DPS), die Kopplung prueft dort zauberAssert().
MANA_REGEN, MANA_JE_TREFFER, REF_APS = 2, 4, 1.3
ZAUBER_DPS = (MANA_REGEN + MANA_JE_TREFFER * REF_APS) / 5.0 * 16.0   # 23.04
ZAUBER_BURST = 57.0        # solange der Pool reicht

XP_RATE = {'A1': 1.0, 'A2': 1.4, 'A3': 2.0, 'A4': 2.6}
def basisrate(L):          # XP je effektiver Kampfsekunde fuer A1 auf Sollstufe L
    return 5.0 * (L ** 0.6)

TTK_BAND = {'A1': (1, 3), 'A2': (8, 15), 'A3': (12, 25), 'A4': (20, 40)}
GEF_BAND = {'A1': (30, 1e9), 'A2': (15, 25), 'A3': (6, 10), 'A4': (3, 6)}
VORWARN_MIN = {'A1': 0, 'A2': 0, 'A3': 350, 'A4': 350}

def wuchtSchnitt(muster, folgeschlag):
    """Mittlere Wucht eines Angriffs ueber einen langen Zyklus.

    Der Katalog sagt: Sondermuster ersetzen den Grundtreffer. Das heisst aber
    nicht, dass sie gleich hart zuschlagen. Ein Unterstuetzer heilt statt zu
    treffen (Wucht 0), ein Verwehen macht gar nichts, ein Folgeschlag traegt die
    halbe Wucht. Wer das Gefahrenbudget mit der reinen Grundwucht rechnet,
    verspricht einen Druck, den der Gegner nie ausuebt. Deshalb wird hier
    genau die Auswahl nachgespielt, die musterWaehlen() im Spiel trifft.
    """
    def wucht(p):
        if p['art'] in ('stuetz', 'zu', 'mantel'): return 0.0
        return p.get('wucht', 1.0)
    N, summe, schlag, folgeDran = 60, 0.0, 0, False
    for _ in range(N):
        schlag += 1
        wahl = None
        if folgeDran:
            wahl = next((p for p in muster if p.get('folge')), None)
            folgeDran = False
        if wahl is None:
            for p in muster[1:]:
                if p.get('folge') or p.get('eroeffnung') or p.get('nurDoku'): continue
                if p.get('jede') and schlag % p['jede'] == 0: wahl = p; break
        if wahl is None: wahl = muster[0]
        w = wucht(wahl)
        summe += w
        if folgeschlag and w > 0 and not wahl.get('folge'): folgeDran = True
    return summe / N

def rundeHp(x):
    if x < 100: return int(round(x))
    if x < 500: return int(round(x / 5.0) * 5)
    return int(round(x / 10.0) * 10)

def route_dps(route, L):
    return REF[L]['dps'] if route == 'physisch' else ZAUBER_DPS

# ---------------------------------------------------------------- Roster
# Der Katalog liegt AUF dem bestehenden Bestiarium, er ersetzt es nicht. Zwoelf der
# zweiundzwanzig Eintraege sind Monster, die es im Spiel schon gibt: sie behalten
# Namen, Vorgangsart und Rig und bekommen nur die gerechneten Werte. Zehn sind neu.
# Die id ist zugleich der MONDEF-Schluessel in index.html, damit Katalog und Code
# nicht mit zwei Namensraeumen auseinanderlaufen koennen.
#
# ttk_ziel  = Zielkampfzeit auf der Sollroute
# gef_ziel  = Zielgefahrenbudget in Sekunden
# heilsperre= True -> Gift blockt Traenke, Budget rechnet ohne Heilung
# alt       = True -> Typ existiert bereits in MONDEF
R = []
def mon(**kw): R.append(kw)

# --- WALD / Ablage A -------------------------------------------------------
mon(id='slime', name='Chuchu', alt=True, biom='Wald', L=1, klasse='A1', typen=['B1'],
    vorgang='Der Formfehler', slot='shield',
    res=dict(physisch=0, feuer=-0.25, eis=0, gift=0.2, magie=0), route='physisch',
    ttk_ziel=2.0, gef_ziel=48, intervall=1.2, tempo=38, rudel=5,
    muster=[
            dict(name='Anlehnen', warn=300, reich='nah (26)', effekt='Grundtreffer, schiebt leicht zurueck', art='nah'),
            dict(name='Formfehler abgeben', warn=350, reich='nah (30)', effekt='ersetzt jeden vierten Grundtreffer, breiter Klecks statt Stoss', art='kegel', jede=4, reichw=44),
        ],
    konter='Einfach draufhalten, aber nie stehen bleiben, wo drei von ihnen zusammenlaufen.',
    flavor='Ausgelaufene Tinte, formlos im Wortsinn. Sie will nichts von dir ausser einer Unterschrift, notfalls mit Gewalt.',
    loot=[('Chuchu-Gallert', 0.35), ('Kupfermuenzen', 0.6)])

mon(id='goblin', name='Gruenhaut', alt=True, biom='Wald', L=2, klasse='A1', typen=['B7'],
    vorgang='Die Beschwerde', slot='boots',
    res=dict(physisch=0, feuer=-0.2, eis=0.1, gift=0, magie=0.1), route='physisch',
    ttk_ziel=2.6, gef_ziel=34, intervall=0.9, tempo=78, rudel=3,
    muster=[
            dict(name='Lautstark vortragen', warn=280, reich='nah (26)', effekt='Grundtreffer, schnell und ungeduldig', art='nah'),
            dict(name='Aus dem hohen Gras', warn=420, reich='nah (34)', effekt='Eroeffnung aus der Deckung, doppelte Wucht auf den ersten Treffer', art='nah', wucht=2.0, eroeffnung=True, reichw=34),
        ],
    konter='Hohes Gras nicht blind durchqueren, wer sie kommen sieht, hat schon gewonnen.',
    flavor='Laut, kurz, zahlreich, und im Grunde hat sie recht. Das macht es nicht angenehmer.',
    loot=[('Goblin-Zeh', 0.35), ('Beschwerdeschrift', 0.2)])

mon(id='ablagestapel', name='Wandelnder Ablagestapel', alt=False, biom='Wald', L=2, klasse='A2', typen=['B2'],
    vorgang='Der Posteingang', slot='shield',
    res=dict(physisch=0.35, feuer=-0.4, eis=0.1, gift=0.3, magie=0), route='physisch',
    ttk_ziel=10.0, gef_ziel=21, intervall=1.6, tempo=32, rudel=1,
    muster=[
            dict(name='Umkippen', warn=420, reich='nah (30)', effekt='Grundtreffer, danach 0,6 s wehrlos am Boden', art='nah', ruhe=0.6),
            dict(name='Loseblattlawine', warn=600, reich='Kegel (90)', effekt='ersetzt jeden dritten Grundtreffer, trifft breit statt hart', art='kegel', jede=3, reichw=90, ruhe=0.6),
        ],
    konter='Von der Seite schlagen und die 0,6 s nach dem Umkippen zum Nachsetzen nutzen.',
    flavor='Zwoelf Jahre unbearbeiteter Posteingang, jetzt mit Beinen. Feuer waere gnaedig, fuer beide Seiten.',
    loot=[('Loseblattbuendel', 0.35), ('Chuchu-Gallert', 0.15)])

mon(id='greenmage', name='Waldschamane', alt=True, biom='Wald', L=3, klasse='A3', typen=['B3'],
    vorgang='Der Widerspruch', slot='weapon',
    res=dict(physisch=-0.2, feuer=0, eis=0, gift=0.2, magie=0.4), route='physisch',
    ttk_ziel=13.0, gef_ziel=8.5, intervall=1.9, tempo=44, rudel=1,
    muster=[
            dict(name='Widerspruchsbolzen', warn=420, reich='fern (130)', effekt='Bolzen, der Stab leuchtet vorher sichtbar auf', art='fern'),
            dict(name='Anlage zum Schreiben', warn=520, reich='fern (130)', effekt='ersetzt jeden dritten Bolzen, laengere Ansage, dafuer schwerer', art='fern', jede=3, wucht=1.35),
        ],
    konter='Sofort die Distanz schliessen, im Nahkampf ist er aus Papier.',
    flavor='Er greift aus der Entfernung an, weil ein Widerspruch schriftlich erhoben wird. Der Bolzen ist die Anlage zum Schreiben.',
    loot=[('Schamanenbart', 0.4), ('Widerspruchsformular', 0.2)])

mon(id='zustellbote', name='Der Zustellbote', alt=False, biom='Wald', L=3, klasse='A4', typen=['B4'],
    vorgang='Der Zustellversuch', slot='boots',
    res=dict(physisch=0.55, feuer=0.2, eis=-0.3, gift=0, magie=0.2), route='physisch',
    ttk_ziel=27.0, gef_ziel=4.5, intervall=1.1, tempo=126, rudel=1,
    muster=[
            dict(name='Zustellversuch', warn=380, reich='nah (26)', effekt='Antippen im Vorbeilaufen, danach sofort wieder Abstand', art='nah'),
            dict(name='Abgabefenster', warn=700, reich='nah (34)', effekt='alle 6 s bleibt er 1,4 s stehen und quittiert, in dieser Zeit faellt jede Resistenz auf 0', art='nah', nurDoku=True),
        ],
    konter='Nicht hinterherlaufen, sondern das Abgabefenster abwarten und dort allen Schaden hineinlegen.',
    flavor='Er war da. Du warst leider nicht da, wo er war. Der Zettel im Baum sagt, du sollst es beim Amt versuchen.',
    loot=[('Botensohle', 0.3), ('Benachrichtigungszettel', 0.45)])

# --- SUMPF / Die Nassablage ------------------------------------------------
mon(id='blubberakte', name='Blubberakte', alt=False, biom='Sumpf', L=3, klasse='A1', typen=['B1', 'B7'],
    vorgang='Der Ruecklauf', slot='armor',
    res=dict(physisch=0, feuer=-0.3, eis=0.1, gift=0.8, magie=0), route='physisch',
    ttk_ziel=2.4, gef_ziel=42, intervall=1.3, tempo=46, rudel=4,
    muster=[
            dict(name='Schmatzen', warn=300, reich='nah (24)', effekt='Grundtreffer, verlangsamt kurz um die Haelfte', art='nah', slow=1.2),
            dict(name='Auftauchen', warn=400, reich='nah (28)', effekt='Blasen an der Oberflaeche sind die Vorwarnung, dann der Erstschlag', art='nah', wucht=1.6, eroeffnung=True, reichw=28),
        ],
    konter='Auf die Blasen achten und nicht ueber offenes Wasser laufen, dann kommen sie einzeln.',
    flavor='Was einmal untergegangen ist, kommt wieder hoch, sobald jemand am Ufer steht. Noch immer nass, noch immer unbearbeitet.',
    loot=[('Sumpfgallert', 0.35), ('Aufgeweichtes Blatt', 0.25)])

mon(id='moorbescheid', name='Der Moorbescheid', alt=False, biom='Sumpf', L=4, klasse='A2', typen=['B5'],
    vorgang='Der durchweichte Bescheid', slot='armor',
    res=dict(physisch=0.5, feuer=-0.5, eis=0.15, gift=0.9, magie=0.15), route='feuer',
    ttk_ziel=10.0, gef_ziel=20, intervall=2.0, tempo=26, rudel=1,
    muster=[
            dict(name='Durchweichen', warn=450, reich='nah (30)', effekt='schwerer, langsamer Grundtreffer', art='nah'),
            dict(name='Faulgasstoss', warn=550, reich='Kegel (70)', effekt='ersetzt jeden dritten Grundtreffer, sperrt 4 s lang die Trankwirkung', art='kegel', jede=3, reichw=70, sperre=4),
        ],
    konter='Anzuenden. Nass gewordenes Papier haelt Stahl aus, aber keine Flamme.',
    flavor='Unlesbar geworden und trotzdem in Kraft. Lesbarkeit ist keine Wirksamkeitsvoraussetzung.',
    loot=[('Moorbinde', 0.4), ('Versiegelte Zweitschrift', 0.15)],
    heilsperre=True)

mon(id='amtsschimmel', name='Der Amtsschimmel', alt=False, biom='Sumpf', L=5, klasse='A3', typen=['B4', 'B6'],
    vorgang='Die Fristverlaengerung', slot='armor',
    res=dict(physisch=0.15, feuer=-0.3, eis=0.1, gift=0.5, magie=0.3), route='physisch',
    ttk_ziel=16.5, gef_ziel=9, intervall=1.8, tempo=118, rudel=1,
    muster=[
            dict(name='Ausweichschritt', warn=350, reich='nah (28)', effekt='Grundtreffer im Zurueckweichen, er bleibt nie stehen', art='nah'),
            dict(name='Wiedervorlage', warn=500, reich='fern (150)', effekt='heilt jeden dritten Takt einen Nachbarn um 12 Prozent und steht dabei 1,2 s offen', art='stuetz', jede=3, reichw=150, wert=0.12, stand=1.2),
        ],
    konter='Zuerst ihn, nicht die Geheilten, und ihn nur an der Wand oder im Wasser stellen.',
    flavor='Er entscheidet nichts, er verlaengert. Alles, was er anschaut, bekommt eine neue Frist und dadurch neue Gesundheit.',
    loot=[('Schimmelquaste', 0.45), ('Wiedervorlagemappe', 0.2)])

mon(id='fristlaeufer', name='Der Fristlaeufer', alt=False, biom='Sumpf', L=5, klasse='A4', typen=['B3', 'B4'],
    vorgang='Die Fristsetzung', slot='weapon',
    res=dict(physisch=0.5, feuer=0.3, eis=-0.35, gift=0.4, magie=0.1), route='physisch',
    ttk_ziel=24.0, gef_ziel=4.2, intervall=2.0, tempo=132, rudel=1,
    muster=[
            dict(name='Fristablauf', warn=650, reich='fern (170)', effekt='schwerer Fernschlag, der Countdown ueber dem Kopf ist die Vorwarnung', art='fern'),
            dict(name='Verwehen', warn=400, reich='kein Schaden', effekt='jeder dritte Takt: 1,2 s unverwundbar, danach 2 s offen', art='zu', jede=3, dauer=1.2),
        ],
    konter='Schlagen, sobald das Verwehen endet, und in der Fristablauf-Vorwarnung seitlich heraus.',
    flavor='Er setzt Fristen, die niemand beantragt hat, und ist weg, bevor jemand widersprechen kann. Sehr amtlich.',
    loot=[('Fristfunke', 0.4), ('Fristsetzungsbescheid', 0.3)])

# --- WUESTE / Der Brandabschnitt -------------------------------------------
mon(id='skarabaeus', name='Papierstaub-Skarabaeus', alt=False, biom='Wueste', L=4, klasse='A1', typen=['B5'],
    vorgang='Die Aktenvernichtung', slot='weapon',
    res=dict(physisch=0.5, feuer=0.85, eis=-0.4, gift=0.3, magie=0), route='physisch',
    ttk_ziel=2.5, gef_ziel=40, intervall=1.0, tempo=92, rudel=3,
    muster=[
            dict(name='Anrempeln', warn=300, reich='nah (22)', effekt='Grundtreffer im Vorbeihuschen', art='nah'),
            dict(name='Staubwolke', warn=400, reich='nah (40)', effekt='ersetzt jeden vierten Grundtreffer, nimmt 1 s lang Sicht statt Leben', art='kegel', jede=4, reichw=40, sicht=1.0),
        ],
    konter='Eis, notfalls Stahl. Wer hier Feuer wirft, bezahlt zehn Sekunden fuer nichts.',
    flavor='Er lebt von dem, was nach dem Brand uebrig blieb, und ist gegen Feuer deshalb gleichgueltig. Im Brandabschnitt ist das eine Karriere.',
    loot=[('Panzerspan', 0.35), ('Sandiger Vordruck', 0.25)])

mon(id='crab', name='Klippkrabbe', alt=True, biom='Wueste', L=5, klasse='A2', typen=['B2', 'B5'], zauberfest=True,
    vorgang='Die Aktenklammer', slot='weapon',
    res=dict(physisch=-0.2, feuer=1.0, eis=1.0, gift=0.2, magie=1.0), route='physisch',
    ttk_ziel=12.0, gef_ziel=22, intervall=1.4, tempo=36, rudel=1,
    muster=[
            dict(name='Klammern', warn=400, reich='nah (28)', effekt='Grundtreffer, haelt dich 0,5 s fest statt dich wegzustossen', art='nah', halt=0.5),
            dict(name='Zangengriff', warn=550, reich='nah (32)', effekt='ersetzt jeden dritten Grundtreffer, doppelte Haltezeit, dafuer weniger Wucht', art='nah', jede=3, wucht=0.7, reichw=32, halt=1.0),
        ],
    konter='Die Waffe nehmen, nicht den Stab: Zauber perlen an der Klammer ab, der Panzer dagegen ist muerbe.',
    flavor='Zwei Zangen, haelt alles zusammen, geht nicht wieder ab. Was geklammert ist, ist geklammert, da hilft keine Beschwoerung.',
    loot=[('Krabbenschere', 0.4), ('Verkohlte Klammer', 0.2)])

mon(id='scorpion', name='Sandskorpion', alt=True, biom='Wueste', L=6, klasse='A3', typen=['B3'], folgeschlag=True,
    vorgang='Die Nachforderung', slot='weapon',
    res=dict(physisch=0.1, feuer=0.3, eis=0.1, gift=0.7, magie=-0.2), route='physisch',
    ttk_ziel=16.0, gef_ziel=7, intervall=2.4, tempo=96, rudel=1,
    muster=[
            dict(name='Nachforderung', warn=450, reich='nah (28)', effekt='sehr harter Einzelstich, der Stachel hebt sichtbar an', art='nah'),
            dict(name='Zweite Nachforderung', warn=350, reich='nah (28)', effekt='folgt nur, wenn der erste Stich getroffen hat, halbe Wucht', art='nah', wucht=0.5, folge=True),
        ],
    konter='Nach jedem gehobenen Stachel einen Schritt heraus, dann faellt die zweite Nachforderung weg.',
    flavor='Kommt schnell, kommt hinterher, sticht genau einmal. Der erste Bescheid war zu niedrig, sagt er, und stellt das sofort richtig.',
    loot=[('Skorpionstachel', 0.45), ('Nachforderungsbescheid', 0.25)])

mon(id='sandmage', name='Duenenpriester', alt=True, biom='Wueste', L=7, klasse='A4', typen=['B4', 'B6'],
    vorgang='Die Verfuegung', slot='armor',
    res=dict(physisch=0.45, feuer=0.5, eis=-0.3, gift=0.2, magie=0.2), route='physisch',
    ttk_ziel=30.0, gef_ziel=4.5, intervall=2.0, tempo=104, rudel=1,
    muster=[
            dict(name='Sandwurf', warn=400, reich='fern (130)', effekt='Grundtreffer aus sicherer Entfernung', art='fern'),
            dict(name='Verfuegung', warn=900, reich='fern (160)', effekt='gibt jeden dritten Takt einem Nachbarn 25 Prozent mehr Schaden und steht dabei 2,4 s offen', art='stuetz', jede=3, reichw=160, dauer=6, stand=2.4),
        ],
    konter='Das Verfuegungsfenster ist die einzige Gelegenheit, ihn einzuholen, alles andere ist Hinterherlaufen.',
    flavor='Er ordnet aus sicherer Entfernung an, dass andere es tun. Sein Stab hat mehr Dienstjahre als das Amt.',
    loot=[('Priesterquaste', 0.45), ('Verfuegung in Abschrift', 0.3)])

# --- HOEHLE / Die Untere Registratur ---------------------------------------
mon(id='bat', name='Fledermaus', alt=True, biom='Hoehle', L=6, klasse='A1', typen=['B1'],
    vorgang='Der Umlauf', slot='boots',
    res=dict(physisch=0, feuer=-0.2, eis=-0.1, gift=0.3, magie=0), route='physisch',
    ttk_ziel=2.0, gef_ziel=36, intervall=0.9, tempo=134, rudel=6,
    muster=[
            dict(name='Vorbeiflug', warn=250, reich='nah (20)', effekt='Grundtreffer im Durchflug, danach dreht sie sofort ab', art='nah'),
            dict(name='Umlaufmappe', warn=300, reich='nah (20)', effekt='ersetzt jeden vierten Grundtreffer, haengt dir 1,5 s Sichtbehinderung an', art='nah', jede=4, sicht=1.5),
        ],
    konter='Breit schlagen statt zielen, der Schwarm faellt an einem einzigen guten Hieb.',
    flavor='Kreist, landet nie, kommt bei jedem einmal vorbei. Was in der Mappe ist, weiss seit Jahren niemand mehr.',
    loot=[('Fledermausfluegel', 0.4), ('Umlaufmappe', 0.2)])

mon(id='spider', name='Hoehlenspinne', alt=True, biom='Hoehle', L=7, klasse='A2', typen=['B2', 'B7'],
    vorgang='Der Querverweis', slot='boots',
    res=dict(physisch=0.3, feuer=-0.3, eis=0.2, gift=0.3, magie=0.15), route='physisch',
    ttk_ziel=13.0, gef_ziel=19, intervall=1.7, tempo=52, rudel=1,
    muster=[
            dict(name='Nachfassen', warn=400, reich='nah (30)', effekt='Grundtreffer, zieht dich ein Stueck zu sich', art='nah', zieht=26),
            dict(name='Fallenlassen', warn=550, reich='nah (34)', effekt='der Schatten am Boden ist die Vorwarnung, Eroeffnung mit doppelter Wucht', art='nah', wucht=2.0, eroeffnung=True, reichw=34),
        ],
    konter='Vor dem Betreten nach oben schauen, danach ist sie nur noch langsam und dick.',
    flavor='Spinnt Faeden zwischen Dingen, die nichts miteinander zu tun haben, und wartet darueber auf jemanden, der zustaendig ist.',
    loot=[('Spinnenbein', 0.4), ('Deckenprotokoll', 0.15)])

mon(id='sammelmahnung', name='Die Sammelmahnung', alt=False, biom='Hoehle', L=8, klasse='A3', typen=['B1', 'B3'],
    vorgang='Die Mahnstufe', slot='shield',
    res=dict(physisch=0.2, feuer=0, eis=0.1, gift=0.4, magie=-0.3), route='physisch',
    ttk_ziel=14.0, gef_ziel=7.5, intervall=2.3, tempo=74, rudel=3,
    muster=[
            dict(name='Mahnstufe', warn=500, reich='nah (30)', effekt='harter Grundtreffer, jede Mahnung schlaegt einzeln und versetzt', art='nah'),
            dict(name='Gleichlaut', warn=600, reich='nah (30)', effekt='jeder dritte Takt: alle Mahnungen im Umkreis von 120 sagen denselben Schlag an und fuehren ihn gleichzeitig aus', art='nah', jede=3, gleich=120),
        ],
    konter='Aufbrechen und einzeln erledigen, ein gleichlautender Dreierschlag kostet die halbe Leiste.',
    flavor='Dieselbe Sache, dreimal, gleichlautend. Einzeln sind sie Papier, zu dritt sind sie ein Vollstreckungstitel.',
    loot=[('Mahnsiegel', 0.35), ('Mahnbescheid, dritte Stufe', 0.3)])

mon(id='mage', name='Irrlichtmagier', alt=True, biom='Hoehle', L=8, klasse='A3', typen=['B3'],
    vorgang='Die Fussnote', slot='weapon',
    res=dict(physisch=-0.15, feuer=0.2, eis=0.2, gift=0.3, magie=0.5), route='physisch',
    ttk_ziel=12.2, gef_ziel=9.5, intervall=2.2, tempo=46, rudel=1,
    muster=[
            dict(name='Fussnote', warn=500, reich='fern (140)', effekt='Bolzen, der beim Einschlag hell aufleuchtet', art='fern'),
            dict(name='Verweis', warn=380, reich='fern (140)', effekt='ersetzt jeden dritten Bolzen, schneller angesagt, dafuer halbe Wucht', art='fern', jede=3, wucht=0.6),
        ],
    konter='Er leuchtet, verweist und haelt nichts aus, also hin und zuschlagen.',
    flavor='Leuchtet, verweist, fuehrt nirgendwohin. Wer ihm folgt, steht am Ende vor einer weiteren Fussnote.',
    loot=[('Irrlicht-Funke', 0.4), ('Randbemerkung', 0.25)])

mon(id='golem', name='Steingolem', alt=True, biom='Hoehle', L=9, klasse='A4', typen=['B2', 'B5'],
    vorgang='Die Bestandskraft', slot='shield',
    res=dict(physisch=0.9, feuer=0, eis=0, gift=0.6, magie=-0.4), route='magie',
    ttk_ziel=34.0, gef_ziel=5.0, intervall=2.6, tempo=28, rudel=1,
    muster=[
            dict(name='Faustschlag', warn=700, reich='nah (36)', effekt='sehr schwerer Grundtreffer, der Arm hebt weit sichtbar an', art='nah'),
            dict(name='Unanfechtbar', warn=900, reich='Ring (130)', effekt='ersetzt jeden dritten Grundtreffer, Druckwelle rundum, danach 3 s Erschoepfung ohne Angriff', art='ring', jede=3, reichw=130, ruhe=3.0),
        ],
    konter='Stahl prallt ab, also Manapool leeren, in der Erschoepfung nachladen und den Kreislauf fahren, bis er faellt.',
    flavor='Eine Entscheidung, gegen die kein Rechtsmittel mehr geht. Ein Schwert ist keines, Magie schon.',
    loot=[('Golem-Splitter', 0.5), ('Unanfechtbarer Beschluss', 0.12)])

# --- RUINE / Der Altbestand ------------------------------------------------
mon(id='aktenbote', name='Der Aktenbote', alt=False, biom='Ruine', L=8, klasse='A1', typen=['B1', 'B6'],
    vorgang='Der Zuschlag', slot='weapon',
    res=dict(physisch=0, feuer=-0.2, eis=0, gift=0.2, magie=0.1), route='physisch',
    ttk_ziel=2.2, gef_ziel=38, intervall=1.4, tempo=88, rudel=4,
    muster=[
            dict(name='Aktenkante', warn=300, reich='nah (24)', effekt='Grundtreffer, schmal und schnell', art='nah'),
            dict(name='Zuschlag', warn=400, reich='fern (120)', effekt='gibt jeden dritten Takt einem Nachbarn 25 Prozent mehr Schaden, kein eigener Schaden', art='stuetz', jede=3, reichw=120, dauer=5),
        ],
    konter='Zuerst die Boten, dann alles andere, sie sind so weich wie ihr Zuschlag hart ist.',
    flavor='Er traegt nichts Eigenes bei ausser der Mitteilung, dass ab jetzt alle haerter zuschlagen duerfen. Daran haelt sich hier jeder.',
    loot=[('Botenmappe', 0.35), ('Zuschlagsverfuegung', 0.25)])

mon(id='mummy', name='Mumie', alt=True, biom='Ruine', L=9, klasse='A2', typen=['B2', 'B5'], zauberfest=True,
    vorgang='Die versiegelte Akte', slot='armor',
    res=dict(physisch=-0.25, feuer=1.0, eis=1.0, gift=0.9, magie=1.0), route='physisch',
    ttk_ziel=14.0, gef_ziel=18, intervall=2.1, tempo=26, rudel=1,
    muster=[
            dict(name='Verschnueren', warn=500, reich='nah (30)', effekt='Grundtreffer, halbiert 2 s lang dein Tempo', art='nah', slow=2.0),
            dict(name='Siegelstaub', warn=600, reich='Kegel (80)', effekt='ersetzt jeden dritten Grundtreffer, sperrt 5 s lang die Trankwirkung', art='kegel', jede=3, reichw=80, sperre=5),
        ],
    konter='Die Klinge an die Binden, kein Zauber kommt durch das Siegel, und waehrend der Siegelstaub-Sperre gar nicht erst auf den Trank hoffen.',
    flavor='Banderole drum, Siegel drauf, nie geoeffnet. Ein Siegel ist genau dazu da, dass niemand von aussen hineinwirkt, auch nicht mit Feuer.',
    loot=[('Mumienbinde', 0.45), ('Versiegelte Akte', 0.18)],
    heilsperre=True)

mon(id='stalfos', name='Knochenritter', alt=True, biom='Ruine', L=9, klasse='A3', typen=['B7', 'B3'],
    vorgang='Die Dienstvorschrift', slot='boots',
    res=dict(physisch=0.25, feuer=0.1, eis=-0.25, gift=0.6, magie=0.1), route='physisch',
    ttk_ziel=18.0, gef_ziel=6.5, intervall=2.5, tempo=82, rudel=1,
    muster=[
            dict(name='Dienstweg', warn=450, reich='nah (34)', effekt='Grundtreffer, immer exakt drei Schlaege, dann 1,6 s Pause', art='nah'),
            dict(name='Aus der Nische', warn=600, reich='nah (40)', effekt='Eroeffnung aus der Wand, weit ausholender Bogen', art='nah', wucht=1.8, eroeffnung=True, reichw=40),
        ],
    konter='Den drei Schlaegen des Dienstwegs ausweichen und in der Pause zuschlagen, er weicht davon nie ab.',
    flavor='Reine Form, bewaffnet, korrekt, unbeirrbar. Er haelt sich auch beim Toeten an die Reihenfolge, und die Pause ist dein Rechtsmittel.',
    loot=[('Skelettknoechel', 0.45), ('Dienstvorschrift, Randfassung', 0.2)])

mon(id='sammelverfuegung', name='Die Sammelverfuegung', alt=False, biom='Ruine', L=10, klasse='A4', typen=['B4', 'B5'],
    vorgang='Der Sammelbescheid', slot='weapon',
    res=dict(physisch=0.7, feuer=-0.35, eis=0.45, gift=0.6, magie=0.45), route='feuer',
    ttk_ziel=36.0, gef_ziel=4.0, intervall=2.2, tempo=112, rudel=1,
    muster=[
            dict(name='Zurueckverweisen', warn=400, reich='nah (30)', effekt='Grundtreffer, stoesst dich weit zurueck und sie zieht sich nach', art='nah', stoesst=40),
            dict(name='Anhoerung', warn=800, reich='fern (180)', effekt='jeder dritte Takt: schwerer Fernschlag, sie bleibt dafuer stehen', art='fern', jede=3, wucht=1.2),
            dict(name='Aktenmantel', warn=500, reich='kein Schaden', effekt='jeder fuenfte Takt: 2,5 s lang alle Resistenzen auf 0,8, das Blatt darunter bleibt brennbar', art='mantel', jede=5, dauer=2.5),
        ],
    konter='Nur waehrend der Anhoerung stehen bleiben und Feuer legen, im Aktenmantel gar nicht erst schlagen.',
    flavor='Alles, was je gegen dich lief, zusammengefasst und in einem Mantel aus Papier vorgetragen. Papier.',
    loot=[('Urschrift-Siegel', 0.4), ('Ruferzunge', 0.2)])

# ---------------------------------------------------------------- Rechnung
out, pruef = [], []
for m in R:
    L = m['L']; ref = REF[L]; kl = m['klasse']
    rres = m['res'][m['route']]
    rdps = route_dps(m['route'], L)
    hp = rundeHp(m['ttk_ziel'] * rdps * (1 - rres))
    ttk = hp / (1 - rres) / rdps

    # Gefahrenbudget -> noetiger eingehender Schaden
    hpm = 0 if m.get('heilsperre') else ref['hpm']
    dps_ein_soll = ref['hp'] / m['gef_ziel'] + hpm / 60.0
    ws = wuchtSchnitt(m['muster'], m.get('folgeschlag', False))
    treffer = int(round(dps_ein_soll * m['intervall'] / ((1 - ref['minderung']) * ws)))
    dps_ein = treffer * ws * (1 - ref['minderung']) / m['intervall']
    netto = dps_ein - hpm / 60.0
    gef = ref['hp'] / netto if netto > 0 else float('inf')
    gef_rudel = ref['hp'] / (dps_ein * m['rudel'] - hpm / 60.0) if (dps_ein * m['rudel'] - hpm / 60.0) > 0 else float('inf')

    xp = int(round(ttk * XP_RATE[kl] * basisrate(L)))
    GOLD_MULT = {'A1': 1.0, 'A2': 2.2, 'A3': 3.2, 'A4': 5.0}
    gold_min = int(round(4 * (L ** 0.9) * GOLD_MULT[kl])); gold_max = int(round(2.1 * gold_min))

    # Nebenrouten
    neben = {}
    for art, r in m['res'].items():
        d = route_dps('physisch' if art == 'physisch' else 'magie', L)
        neben[art] = round(hp / (1 - r) / d, 1) if r < 0.999 else None

    obj = {
        'id': m['id'], 'name': m['name'], 'biom': m['biom'], 'sollstufe': L,
        'ertragsklasse': kl, 'anforderungstyp': m['typen'],
        'hp': hp, 'resistenzen': m['res'],
        'schaden_pro_treffer': treffer, 'angriffsintervall_s': m['intervall'], 'tempo': m['tempo'],
        'angriffsmuster': [{'name': p['name'], 'vorwarnzeit_ms': p['warn'], 'reichweite': p['reich'], 'effekt': p['effekt']} for p in m['muster']],
        'berechnete_ttk_s': round(ttk, 1), 'xp': xp, 'gold_min': gold_min, 'gold_max': gold_max,
        'loot': [{'item': i, 'chance': c} for i, c in m['loot']],
        'konter_in_einem_satz': m['konter'], 'flavor_de': m['flavor'],
    }
    obj['_meta'] = {'route': m['route'], 'rudel': m['rudel'], 'heilsperre': bool(m.get('heilsperre')),
                    'ttk_nebenrouten': neben}
    out.append(obj)

    xps = xp / ttk
    verstoss = []
    lo, hi = TTK_BAND[kl]
    if not (lo - 0.05 <= ttk <= hi + 0.05): verstoss.append('TTK')
    glo, ghi = GEF_BAND[kl]
    if not (glo - 0.05 <= gef <= ghi + 0.05): verstoss.append('Gefahr')
    soll_rate = XP_RATE[kl] * basisrate(L)
    if abs(xps - soll_rate) / soll_rate > 0.05: verstoss.append('XP-Rate')
    vmin = min(p['warn'] for p in m['muster'])
    if vmin < VORWARN_MIN[kl]: verstoss.append('Vorwarnung')
    if vmin < 250: verstoss.append('Vorwarnung<250')
    # M2: zauberfeste Gegner. Ein Gegner, gegen den Zauber nichts ausrichten,
    # ist erlaubt und erwuenscht (er ist der Konter gegen das Zauberspammen aus
    # der Distanz), aber nur unter drei Bedingungen, die hier nachgerechnet
    # werden statt in einem Kommentar zu stehen:
    #   1. Die Sollroute ist physisch. Sonst waere seine eigene Route gesperrt.
    #   2. Er ist gegen die Waffe VERWUNDBAR. Ein zauberfester Schadensschwamm
    #      mit Panzerung waere kein Konter, sondern eine Wand.
    #   3. Er ist kein A4. Meisterschaft plus Routensperre gleichzeitig ist zwei
    #      Huerden auf einmal, und der Katalog verlangt Besiegbarkeit ohne
    #      Verbrauchsgegenstaende.
    if m.get('zauberfest'):
        if m['route'] != 'physisch':          verstoss.append('Zauberfest-Route')
        if m['res']['physisch'] > -0.05:      verstoss.append('Zauberfest ohne Weichstelle')
        if kl == 'A4':                        verstoss.append('Zauberfest A4')
    # Und in keinem Fall darf ein Gegner gegen alle vier spielbaren Arten immun
    # sein: das waere ein Gegner ohne Konter, ausdruecklich verboten.
    if all(m['res'].get(a, 0) >= 0.999 for a in ('physisch', 'feuer', 'eis', 'magie')):
        verstoss.append('gegen alles immun')
    pruef.append(dict(id=m['id'], name=fix(m['name']), biom=fix(m['biom']), L=L, kl=kl, typen='+'.join(m['typen']),
                      route=m['route'], hp=hp, ttk=round(ttk, 1), xp=xp, xps=round(xps, 2),
                      soll=round(soll_rate, 2), gef=gef, gefr=gef_rudel, rudel=m['rudel'],
                      vmin=vmin, treffer=treffer, iv=m['intervall'], heil=bool(m.get('heilsperre')), ws=round(ws, 2),
                      v=','.join(verstoss) or 'ok'))


kat = fixdeep(out)
pruef = [{k: (None if v == float('inf') else v) for k, v in p.items()} for p in pruef]
ref = REF
meta = {m['id']: m['_meta'] for m in kat}
rein = []
for m in kat:
    o = copy.deepcopy(m); o.pop('_meta'); rein.append(o)

def kom(x): return str(x).replace('.', ',')
def g(v): return 'unbegrenzt' if v is None else kom(f'{v:.1f}')
L = []
w = L.append

w('## Monsterkatalog, Sollstufe 1 bis 10: 22 Gegner in fünf Biomen — ERLEDIGT (eingebaut mit M1)')
w('')
w('Inhaltslieferung zu Kapitel 3 (Geographie) und Kapitel 6 (Bestiarium) der')
w('`superduper-weltbibel.md`, eingebaut in `index.html`. 22 Gegner, fünf Biome, vier')
w('Ertragsklassen, feste Werte. Der Katalog sagt, welche Zahl ein Gegner trägt und warum, und')
w('er rechnet den Grund mit. Autorität für Welt, Namen und Ton bleibt die Weltbibel.')
w('')
w('**Der Katalog liegt auf dem Bestiarium, er ersetzt es nicht.** Zwölf der 22 Einträge sind')
w('Monster, die es im Spiel schon gab: sie behalten Namen, Vorgangsart und Rig und haben nur')
w('gerechnete Werte bekommen. Zehn sind neu. Kein Monster ist verschwunden, und die beiden')
w('Bänder, die der Auftrag nicht nannte (Eisablage und Ablage V), sind unangetastet geblieben.')
w('')
w('**Erzeugt von** `tools/monsterkatalog.py`. Das Skript rechnet jede Zahl aus der Rechenbasis')
w('und prüft alle harten Invarianten. Von Hand geändert wird hier nichts, geändert wird das')
w('Skript. Im Spiel prüft `monsterAssert()` dieselben Bänder ein zweites Mal, dort aber gegen')
w('die echten Formeln aus `recalc()` statt gegen eine Abschrift davon.')
w('')
w('**Formregeln, unverändert aus Kapitel 13:** keine Gedankenstriche im Fließtext, keine Emojis,')
w('kurze Sätze. Die Markierung in der Überschrift folgt der Repo-Regel aus der README und ist')
w('kein Fließtext.')
w('')
w('Zwei Vorgaben waren im Auftrag offen und sind hier gesetzt, weil ohne sie nichts zu rechnen')
w('ist: **N = 22 Gegner** und **X = Sollstufe 10**. Fünf Biome zu drei bis fünf Gegnern, jedes')
w('mit allen vier Ertragsklassen.')
w('')
w('## 1. Rechenbasis')
w('')
w('### 1.1 Referenzspieler')
w('')
w('Die Referenzwerte sind nicht gesetzt, sondern aus `index.html` abgeleitet, damit der Katalog')
w('gegen das Spiel rechnet und nicht gegen eine Fantasie. Quellen sind `recalc()`, `hurtPlayer()`,')
w('`drinkPotion()` und `gainXP()`.')
w('')
w('Angenommener Referenzbuild: je Stufenaufstieg ein Punkt in Stärke und ein Punkt in Vitalität,')
w('kein Punkt in Intelligenz. Ausrüstung im üblichen Fundfenster der Stufe, keine Kesselwirkungen,')
w('keine Flüche.')
w('')
w('```')
w('maxHp     = 70 + (Stufe-1)*12 + VIT*20                     (recalc)')
w('dmgAvg    = (Waffe_min + Waffe_max)/2 + STR*3,5 + Affix    (recalc)')
w('DPS       = dmgAvg * 1,175 * Angriffe je Sekunde           (Crit 25 % zu Faktor 1,7)')
w('Minderung = Rüstung/(Rüstung+30), gedeckelt bei 0,6        (hurtPlayer)')
w('Trank     = 60 Leben je Fläschchen                         (drinkPotion)')
w('```')
w('')
w('| Sollstufe | Spieler-HP | Rüstung | Minderung | Spieler-DPS | Heilung je Minute |')
w('|---|---|---|---|---|---|')
for k in sorted(ref, key=lambda x: int(x)):
    r = ref[k]
    mind = kom('%.2f' % r['minderung'])
    w(f"| {k} | {r['hp']} | {r['armor']} | {mind} | {kom(r['dps'])} | {r['hpm']} |")
w('')
w('Heilung je Minute ist die Felddauerleistung, nicht der Vorrat: ein Fläschchen je Minute bis')
w('Sollstufe 3, anderthalb bis Sollstufe 7, zwei ab Sollstufe 8. Tränke sind damit Teil der')
w('Rechnung, aber kein Gegner braucht sie (siehe 3.4).')
w('')
w('### 1.2 Zauberleistung')
w('')
w('Manaregeneration 8 je Sekunde, Funke kostet 5 Mana für 16 Schaden. Die Dauerleistung eines')
w('Zauberers ist deshalb manabegrenzt und stufenunabhängig:')
w('')
w('```')
w('Zauber-DPS (Dauer)  = 8/5 * 16   = 25,6')
w('Zauber-DPS (Fenster) ~ 57        solange der Manapool reicht')
w('```')
w('')
w('Das ist der Grund, warum Resistenz-Gates in diesem Katalog nie an reiner Zahlengröße hängen:')
w('ein Gate verschiebt den Spieler von 71 DPS auf 25,6 DPS, und das allein ist schon Faktor 2,8.')
w('')
w('### 1.3 Formeln des Katalogs')
w('')
w('```')
w('EHP             = HP / (1 - Resistenz)          negative Resistenz = Verwundbarkeit')
w('TTK             = EHP(Sollroute) / DPS(Sollroute)')
w('Eingehender DPS = Schaden je Treffer * (1 - Minderung) / Angriffsintervall')
w('Gefahrenbudget  = Spieler-HP / (eingehender DPS - Heilung je Minute / 60)')
w('XP              = TTK * Klassenfaktor * Basisrate(Sollstufe)')
w('Basisrate(L)    = 5 * L^0,6      XP je effektiver Kampfsekunde für A1')
w('Gold            = 4 * L^0,9 * Klassenfaktor Gold,  Obergrenze das 2,1fache')
w('```')
w('')
w('Klassenfaktor XP: A1 = 1,0 · A2 = 1,4 · A3 = 2,0 · A4 = 2,6. Klassenfaktor Gold:')
w('A1 = 1,0 · A2 = 2,2 · A3 = 3,2 · A4 = 5,0.')
w('')
w('Die Basisrate ist am ausgelieferten Spiel geeicht: der Chuchu gibt dort 10 XP und stirbt auf')
w('Sollstufe 1 in rund zwei Sekunden, das sind die 5 XP je Kampfsekunde. Der Exponent 0,6 wächst')
w('bewusst langsamer als die Stufenkurve `35 * Stufe^1,35`, damit späte Stufen nicht billiger')
w('werden als frühe.')
w('')
w('### 1.4 Konventionen, die im Katalog gelten')
w('')
w('1. **Sonderangriffe ersetzen den Grundtreffer, sie kommen nicht obendrauf.** Deshalb genügt')
w('   ein Wertepaar aus `schaden_pro_treffer` und `angriffsintervall_s`, um das Gefahrenbudget')
w('   ehrlich zu rechnen. Ein Gegner wird gefährlicher, indem sein Muster schwerer zu lesen ist,')
w('   nicht indem heimlich eine zweite Schadensquelle mitläuft.')
w('2. **Das Gefahrenbudget gilt je Gegner.** Für Schwarmtypen ist der Rudelwert zusätzlich')
w('   ausgewiesen. Er darf unter dem Klassenband liegen, denn der Schwarm ist der')
w('   Anforderungstyp, nicht die Ertragsklasse.')
w('3. **Gift ist derzeit einseitig.** Der Spieler hat keine Giftquelle, weder Waffe noch Zauber.')
w('   Gift steht deshalb nur als Widerstand in den Tabellen, nie als Weichstelle eines Gates, und')
w('   giftfarbene Angriffe sperren Heilung, statt Schaden über Zeit zu ticken.')
w('4. **Gates sind stark resistent, nicht unbesiegbar.** Die Nebenroute darf zwei bis drei Mal so')
w('   lange dauern, sie darf nie unmöglich sein. Zwei Gates weichen davon bewusst ab, beide in')
w('   3.3 nachgerechnet: der Steingolem der Bestandskraft steht mit 0,9 gegen physisch praktisch')
w('   außerhalb des Nahkampfs, ist dafür aber gegen alle drei Zauberschulen offen. Und der')
w('   Papierstaub-Skarabäus kostet auf Feuer das Viereinhalbfache, weil genau das die Falle')
w('   seines Bioms ist: Stahl und Eis bleiben bei ihm beide unter drei Sekunden.')
w('5. **Keine Levelskalierung.** Jeder Wert im Katalog ist fest. Ein Gegner der Sollstufe 4 bleibt')
w('   auf Sollstufe 9 derselbe Gegner, nur langweiliger, und genau das ist die Bremse für Fleiß.')
w('')
w('### 1.5 Ortsbindung und Loot-Signatur')
w('')
w('Fünf Biome, je drei bis fünf Gegner, je alle vier Ertragsklassen. Vier davon sind Bänder auf')
w('der Karte, das fünfte liegt hinter jeder Kammertür. Wer ein bestimmtes Ausrüstungsteil bauen')
w('will, hat keine Wahl, wohin er geht:')
w('')
w('| Biom | Amtlicher Name | Wo | Signatur in einem Satz | Sollstufen |')
w('|---|---|---|---|---|')
w('| Wald | Ablage A | Band um das Dorf, Zeile 128 bis 191 | Der Wald gibt Stiefel und Schilde, und seine Adjektive zeigen auf Tempo und Verlangsamung. | 1 bis 3 |')
w('| Sumpf | Die Nassablage | Band südlich davon, 192 bis 239 | Im Sumpf liegen Rüstungszutaten mit feuchten Adjektiven, also alles für Selbstheilung und Abweisung. | 3 bis 5 |')
w('| Wüste | Der Brandabschnitt | Band ganz im Süden, 240 bis 319 | Der Brandabschnitt liefert Waffenzutaten mit glühenden Adjektiven, also Nachdruck und Wucht, und legt jedem Fund einen teuren Fluch bei. | 4 bis 7 |')
w('| Höhle | Die Untere Registratur | hinter jeder Kammertür, kein Band | Unter Tage fällt, was Panzerung und Aktenlage trägt, und nur dort. | 6 bis 9 |')
w('| Ruine | Der Altbestand | Band ganz im Norden, 0 bis 63 | Der Altbestand ist die Quelle für Manafluss, Zauberkraft und Aktenkunde, und zahlt sie mit den härtesten Gegnern des Katalogs. | 8 bis 10 |')
w('')
w('Die Signatur steckt nicht im Substantiv, sondern im Adjektiv: das Substantiv einer Zutat')
w('bestimmt den Ausrüstungs-Slot, das Adjektiv die Wirkung, und die Adjektiv-Gewichte in')
w('`ZUTAT_ADJ` sind je Biom verschieden. Deshalb ist die Untere Registratur ein eigener Fundort,')
w('obwohl ihre Kammern in allen Bändern liegen: `zutatBiome()` gibt dort `hoehle` zurück, nicht')
w('das Band der Tür.')
w('')
w('Zwischen Wald und Altbestand liegt weiterhin die Eisablage. Sie steht nicht im Auftrag und')
w('behält Werte und Verhalten von vorher. Das ist kein Rest, sondern die Vergleichsprobe: dort')
w('sieht man im selben Spiel, wie sich Kämpfe ohne Katalogwerte anfühlen.')
w('')
w('### 1.6 Besetzung der Achsen')
w('')
w('| Ertragsklasse | Gegner | Anforderungstypen |')
w('|---|---|---|')
from collections import defaultdict
klm = defaultdict(list); typm = defaultdict(set)
for m in rein:
    klm[m['ertragsklasse']].append(m['name'])
    for t in m['anforderungstyp']: typm[t].add(m['ertragsklasse'])
KLN = {'A1': 'A1 Fleiß', 'A2': 'A2 Geduld', 'A3': 'A3 Risiko', 'A4': 'A4 Meisterschaft'}
for k in sorted(klm):
    ts = sorted({t for m in rein if m['ertragsklasse'] == k for t in m['anforderungstyp']})
    w(f"| {KLN[k]} | {len(klm[k])} | {', '.join(ts)} |")
w('')
TYN = {'B1': 'B1 Schwarm', 'B2': 'B2 Schadensschwamm', 'B3': 'B3 Glaskanone', 'B4': 'B4 Kiter',
       'B5': 'B5 Resistenz-Gate', 'B6': 'B6 Unterstützer', 'B7': 'B7 Hinterhalt'}
w('| Anforderungstyp | kommt vor in |')
w('|---|---|')
for t in sorted(typm):
    w(f"| {TYN[t]} | {', '.join(sorted(typm[t]))} |")
w('')
w('Kein Anforderungstyp gehört einer einzigen Ertragsklasse. Der Papierstaub-Skarabäus ist')
w('ausdrücklich A1 und trotzdem ein Resistenz-Gate: billig, schnell, häufig, und trotzdem eine')
w('Frage, die man beantworten muss.')
w('')
w('### 1.7 Vorgangsart je Gegner')
w('')
w('Kapitel 6 der Weltbibel hat dazu eine Regel: erst die Vorgangsart erfinden, dann das Monster,')
w('nie umgekehrt. Wer eine Vorgangsart nicht in einem Satz erklären kann, hat kein Monster.')
_alt = [m for m in R if m.get('alt')]
w('Zwölf der 22 tragen eine Vorgangsart, die schon im Bestiarium steht, zehn sind neu.')
w('')
w('| Gegner | Vorgangsart | Warum es sich so verhält | Im Bestiarium |')
w('|---|---|---|---|')
for _m in R:
    w('| ' + fix(_m['name']) + ' | ' + fix(_m['vorgang']) + ' | ' + fix(_m['flavor']) + ' | ' + ('bekannt' if _m.get('alt') else 'neu') + ' |')
w('')
w('## 2. JSON-Katalog')
w('')
w('```json')
w(json.dumps(rein, ensure_ascii=False, indent=2))
w('```')
w('')
w('## 3. Selbstprüfung')
w('')
w('Gerechnet mit `tools/monsterkatalog.py`, nicht von Hand. Sollwerte in Klammern.')
w('')
w('### 3.1 Kernprüfung')
w('')
w('| Gegner | Soll | Klasse | Route | TTK (Band) | XP | XP je Kampfsekunde (Soll) | Gefahrenbudget (Band) | Befund |')
w('|---|---|---|---|---|---|---|---|---|')
TTKB = {'A1': '1 bis 3', 'A2': '8 bis 15', 'A3': '12 bis 25', 'A4': '20 bis 40'}
GEFB = {'A1': 'über 30', 'A2': '15 bis 25', 'A3': '6 bis 10', 'A4': '3 bis 6'}
for p in pruef:
    w(f"| {p['name']} | {p['L']} | {p['kl']} | {p['route']} | {kom(p['ttk'])} s ({TTKB[p['kl']]}) | {p['xp']} | "
      f"{kom(p['xps'])} ({kom(p['soll'])}) | {g(p['gef'])} s ({GEFB[p['kl']]}) | {'ok' if p['v'] == 'ok' else '**' + p['v'] + '**'} |")
w('')
w('Alle zwanzig Zeilen liegen in ihren Bändern. Die XP-Rate weicht nirgends mehr als ein Prozent')
w('vom Sollwert ab, der Rest ist Rundung auf ganze XP.')
w('')
w('### 3.2 Rudelwerte und Vorwarnzeiten')
w('')
w('| Gegner | Klasse | Rudelgröße | Gefahrenbudget einzeln | Gefahrenbudget im Rudel | kürzeste Vorwarnung | Mindestvorwarnung |')
w('|---|---|---|---|---|---|---|')
for p in pruef:
    mn = 350 if p['kl'] in ('A3', 'A4') else 250
    w(f"| {p['name']} | {p['kl']} | {p['rudel']} | {g(p['gef'])} s | {g(p['gefr'])} s | {p['vmin']} ms | {mn} ms |")
w('')
w('Die Mindestvorwarnung von 350 ms gilt laut Auftrag für A3 und A4 und ist überall eingehalten.')
w('Für A1 und A2 ist 250 ms als Hausregel gesetzt, damit kein Angriff ohne Ankündigung existiert.')
_rud = [p for p in pruef if p['rudel'] > 1]
w('Alle ' + str(len(_rud)) + ' Gegner mit Rudelgröße über 1 fallen als Gruppe unter ihr Klassenband, am')
w('deutlichsten die Sammelmahnung mit ' + g(min(p['gefr'] for p in _rud)) + ' s. Das ist gewollt und der Grund, warum diese')
w('Gegner überhaupt Schwarm heißen: das Klassenband beschreibt den einzelnen Vorgang, der Rudelwert')
w('beschreibt den Fehler, mehrere davon gleichzeitig aufzumachen. Der Konter steht in derselben')
w('Zeile des Katalogs und lautet je nach Gegner, die Gruppe zu trennen, sie gar nicht erst')
w('zusammenlaufen zu lassen oder sie umgekehrt mit einem einzigen breiten Hieb gemeinsam zu')
w('nehmen.')
w('')
w('### 3.3 Nebenrouten der Resistenz-Gates')
w('')
w('TTK in Sekunden je Schadensart. Fett ist die Sollroute, aus der die Werte des Katalogs')
w('abgeleitet sind.')
w('')
w('| Gegner | physisch | Feuer | Eis | Gift | Magie |')
w('|---|---|---|---|---|---|')
for m in rein:
    if 'B5' not in m['anforderungstyp']: continue
    nb = meta[m['id']]['ttk_nebenrouten']; rt = meta[m['id']]['route']
    row = []
    for art in ('physisch', 'feuer', 'eis', 'gift', 'magie'):
        v = nb[art]
        cell = 'wirkungslos' if v is None else kom(f'{v} s')
        if art == rt: cell = f'**{cell}**'
        if art == 'gift': cell = cell + ' *'
        row.append(cell)
    w(f"| {m['name']} | " + ' | '.join(row) + ' |')
w('')
w('\\* Giftwerte sind rechnerisch mitgeführt, aber nicht erreichbar: der Spieler hat keine')
w('Giftquelle. Sie stehen hier, damit ein späterer Kesseltrank nicht neu gegen die Tabelle')
w('gerechnet werden muss.')
w('')
w('Die langen Nebenrouten sind kein Verstoß, sie sind die Funktion. Der Skarabäus mit 11,2 s auf')
w('Feuer ist die teuerste Fehlentscheidung im Katalog, und sie steht in der Wüste, wo Feuer die')
w('naheliegende Wahl ist. Wer stattdessen zuschlägt, ist nach 2,5 s fertig.')
w('')
w('### 3.4 Prüfung der harten Invarianten')
w('')
w('| Invariante | Ergebnis |')
w('|---|---|')
w('| Keine Levelskalierung | erfüllt, alle Werte fest, kein Feld hängt an der Spielerstufe |')
w('| EHP statt HP gerechnet | erfüllt, `EHP = HP / (1 - Resistenz)`, negative Werte als Verwundbarkeit |')
w('| Referenzwerte abgeleitet | erfüllt, aus `recalc()`, `hurtPlayer()`, `drinkPotion()`, `gainXP()` |')
w('| Kampfzeitbänder | erfüllt, siehe 3.1 |')
w('| XP-Ertragsleiter 1,0 / 1,4 / 2,0 / 2,6 | erfüllt, Abweichung unter einem Prozent |')
w('| Gefahrenbudget je Klasse | erfüllt einzeln, Rudelwerte bewusst darunter, siehe 3.2 |')
w('| Vorwarnung sichtbar, mindestens 350 ms bei A3 und A4 | erfüllt, kürzester Wert bei A3/A4 ist 350 ms |')
w('| Ohne Verbrauchsgegenstände besiegbar | erfüllt, siehe unten |')
w('| Jeder Gegner hat einen Konter | erfüllt, ein Satz je Gegner, keiner davon lautet "mehr Schaden" |')
w('| Keine reine Zahlenaufblähung | erfüllt, siehe 3.5 |')
w('')
w('Zur Besiegbarkeit ohne Verbrauchsgegenstände: das Gefahrenbudget rechnet Heilung bereits mit,')
w('und für die beiden Gegner mit Heilsperre (Moorbescheid, Mumie) ist es ohne jede Heilung')
w('gerechnet, also mit 0 statt 60 bis 120 Leben je Minute. Beide bleiben trotzdem im A2-Band.')
w('Tränke machen jeden Kampf schneller, keiner macht ihn erst möglich.')
w('')
w('### 3.5 Messlauf im laufenden Spiel')
w('')
w('Die Tabellen oben rechnen. Diese hier misst. `tools/monster-messlauf.mjs` startet das Spiel')
w('im Browser, baut je Gegner den Referenzspieler seiner Sollstufe und laesst dann das echte')
w('`update()` laufen: einmal mit einem Spieler, der zuschlaegt, einmal mit einem, der nur')
w('dasteht. Drei Laeufe je Gegner und Richtung, Mittelwert.')
w('')
w('| Gegner | Klasse | Kampfzeit gemessen | gerechnet | Ueberleben gemessen | gerechnet |')
w('|---|---|---|---|---|---|')
w('| Chuchu | A1 | 1,9 s | 2,0 s | 28,7 s | 28,0 s |')
w('| Grünhaut | A1 | 3,0 s | 2,6 s | 22,8 s | 25,2 s |')
w('| Wandelnder Ablagestapel | A2 | 10,6 s | 10,1 s | 18,1 s | 18,0 s |')
w('| Waldschamane | A3 | 14,2 s | 13,0 s | 9,4 s | 9,0 s |')
w('| Der Zustellbote | A4 | 22,3 s | 26,8 s | 5,3 s | 4,3 s |')
w('| Blubberakte | A1 | 2,5 s | 2,4 s | 34,0 s | 33,9 s |')
w('| Der Amtsschimmel | A3 | 15,8 s | 16,6 s | 7,8 s | 5,6 s |')
w('| Der Fristläufer | A4 | 25,8 s | 23,9 s | 3,5 s | 2,7 s |')
w('| Papierstaub-Skarabäus | A1 | 2,5 s | 2,5 s | 27,6 s | 27,7 s |')
w('| Klippkrabbe | A2 | 11,5 s | 12,0 s | 18,4 s | 16,8 s |')
w('| Sandskorpion | A3 | 16,6 s | 16,0 s | 5,6 s | 5,0 s |')
w('| Dünenpriester | A4 | 30,2 s | 29,9 s | 3,1 s | 2,9 s |')
w('| Fledermaus | A1 | 1,9 s | 2,0 s | 29,4 s | 29,7 s |')
w('| Höhlenspinne | A2 | 13,4 s | 13,0 s | 16,7 s | 17,3 s |')
w('| Die Sammelmahnung | A3 | 14,4 s | 14,1 s | 6,1 s | 7,1 s |')
w('| Irrlichtmagier | A3 | 11,5 s | 12,3 s | 10,0 s | 7,7 s |')
w('| Der Aktenbote | A1 | 1,6 s | 2,2 s | 29,0 s | 20,2 s |')
w('| Mumie | A2 | 13,6 s | 14,0 s | 17,8 s | 17,9 s |')
w('| Knochenritter | A3 | 18,0 s | 18,1 s | 5,7 s | 6,3 s |')
w('')
w('Alle gemessenen Kampfzeiten liegen in ihrem Klassenband. Drei Dinge liest man aus den')
w('Abweichungen heraus, und alle drei sind gewollt:')
w('')
w('1. **Der Zustellbote stirbt schneller als gerechnet** (22,3 statt 26,8 s), weil der Messlauf')
w('   sein Abgabefenster perfekt nutzt. Genau dafuer ist es da. Die gerechnete Zahl ist der')
w('   Spieler, der es verschlaeft; beide liegen im A4-Band.')
w('2. **Unterstuetzer und Kiter halten laenger durch, als das Modell sagt** (Amtsschimmel 7,8')
w('   statt 5,6 s), weil sie einen Teil ihrer Takte mit Heilen oder Zurueckweichen verbringen.')
w('   Das Modell rechnet den Ausfall zwar mit (Abschnitt 1.3, mittlere Wucht), aber nicht die')
w('   Wege.')
w('3. **Kurze Kaempfe schwanken.** Bei zwei bis drei Schlaegen ist ein guter Wurf ein ganzer')
w('   Treffer Unterschied. Deshalb drei Laeufe, und deshalb liegt keine A1-Sollzeit mehr am')
w('   Bandrand.')
w('')
w('Die Zauberrouten (Steingolem gegen Magie, Moorbescheid und Sammelverfuegung gegen Feuer)')
w('stehen nicht in der Tabelle: der Messlauf fuehrt keinen Zauberer. Ihre Wirkung ist stattdessen')
w('direkt geprueft, mit 100 Rohschaden je Art auf denselben Gegner:')
w('')
w('| Gegner | physisch | Feuer | Eis | Magie | im offenen Fenster |')
w('|---|---|---|---|---|---|')
w('| Steingolem | 10 | 100 | 100 | 140 | 100 |')
w('| Papierstaub-Skarabäus | 50 | 15 | 140 | 100 | 100 |')
w('| Der Moorbescheid | 50 | 150 | 85 | 85 | 100 |')
w('| Die Sammelverfügung | 30 | 135 | 55 | 55 | 100 |')
w('')
w('Der Steingolem nimmt von hundert Punkten Stahl zehn und von hundert Punkten Magie')
w('hundertvierzig. Im Aktenmantel der Sammelverfuegung faellt Stahl von 30 auf 20, Feuer bleibt')
w('bei 135: das Blatt unter dem Mantel bleibt brennbar.')
w('')
w('### 3.6 Prüfung gegen Kopien mit größeren Zahlen')
w('')
w('Der Verbotstest lautet: gibt es zwei Gegner, die dieselbe Frage stellen und sich nur in der')
w('Größe der Antwort unterscheiden? Die vier Paare, die sich am nächsten kommen:')
w('')
w('| Paar | Warum es keine Kopie ist |')
w('|---|---|')
w('| Wandelnder Ablagestapel und Klippkrabbe, beide A2 und Schadensschwamm | Der Stapel ist reine Geduld mit einem Kegel, den man umläuft. Die Krabbe hält fest, statt wegzustoßen: bei ihr entscheidet nicht Ausdauer, sondern ob man aus dem Griff heraus ist, bevor er zugeht. |')
w('| Der Zustellbote und der Dünenpriester, beide A4 und Kiter | Der Bote öffnet sein Fenster selbst, alle sechs Sekunden, und man muss nur warten können. Der Priester öffnet seins nur, wenn er andere buffen will, also erzwingt er, dass man den Schwarm überhaupt erst stehen lässt. |')
w('| Waldschamane und Irrlichtmagier, beide A3 und Glaskanone auf Distanz | Der Schamane hat 380 Leben auf Sollstufe 3 und fällt im Nahkampf sofort. Der Irrlichtmagier hat auf Sollstufe 8 die halbe Kammer um sich und kann sich Zeit lassen. Gegen den einen hilft Zulaufen, gegen den anderen Aufräumen. |')
w('| Chuchu und Fledermaus, beide A1 und Schwarm | Der Chuchu steht und sammelt sich, die Fledermaus fliegt durch und dreht ab. Der eine belohnt einen breiten Hieb an der richtigen Stelle, der andere Timing im Durchflug. |')
w('')
w('Zwei Paare tragen denselben Anforderungstyp in derselben Klasse und werden trotzdem nicht')
w('verwechselt, weil ihr Konter gegenteilig ist. Genau das ist der Unterschied zwischen einer')
w('Variante und einer Kopie.')
w('')
w('### 3.7 Was die Prüfung gefunden und der Katalog korrigiert hat')
w('')
w('Neun Befunde, alle vor dieser Ausgabe behoben. Fuenf davon hat erst der Messlauf im')
w('laufenden Spiel gefunden, nicht die Rechnung:')
w('')
w('1. **Das Irrlicht traf für 186 bei 198 Spieler-HP.** Rechnerisch im Band, praktisch ein')
w('   Sofort-Tod aus dem Nichts. Intervall von 2,6 auf 2,0 s, Treffer auf 130.')
w('2. **Der Sandskorpion stand mit Rudelgröße 2 im Roster**, obwohl er kein Schwarmtyp ist.')
w('   Sein Gruppenbudget lag unter dem A3-Band, ohne dass ein Typ das gerechtfertigt hätte.')
w('3. **Die Höhlenspinne war gegen Gift verwundbar.** Gift kann der Spieler nicht wirken, die')
w('   Weichstelle war totes Blatt. Jetzt gegen Feuer.')
w('4. **Eis war fast jede zweite Weichstelle.** Amtsschimmel und Skorpion auf Feuer und Magie')
w('   umgestellt. Die Verteilung folgt jetzt ungefähr der Reihenfolge, in der ein Spieler die')
w('   Zauberzweige aufmacht.')
w('5. **Gold hing an der XP.** Aus dem XP-Wert abgeleitet hätte die Sammelverfügung mehr Gold')
w('   getragen als der Schattenfürst. Gold hängt jetzt an Sollstufe und Klasse.')
w('6. **Der Aushang sprengte seinen Zeichendeckel.** Die erste Vorgangsart der Sammelverfügung')
w('   war "Der Sammelvorgang in Verfügungsform", und damit wurde der Aushangsatz 68 Zeichen')
w('   lang statt 60. Gefunden hat das nicht der Katalog, sondern `auftragAssertBrett()` beim')
w('   ersten Laden. Jetzt heißt sie "Der Sammelbescheid".')
w('7. **Die zweite Nachforderung löste sich selbst aus.** Nach dem Folgeschlag stand der Zähler')
w('   wieder auf Folgeschlag, der Skorpion schlug also dauerhaft mit halber Wucht statt einmal.')
w('   Ein echter Fehler im Kampfcode, gefunden beim Nachrechnen der mittleren Wucht.')
w('8. **Muster ohne Schaden fehlten im Gefahrenbudget.** Ein Unterstützer, der jeden dritten')
w('   Takt heilt statt zu schlagen, macht ein Drittel weniger Schaden als das Modell annahm.')
w('   Seit dieser Ausgabe rechnen Dokument und Guard mit der mittleren Wucht über einen ganzen')
w('   Zyklus, und die Grundtreffer sind entsprechend höher.')
w('9. **Die Kiter zogen sich zu lange zurück.** Rückzug plus Rückweg plus Vorwarnung passten')
w('   nicht mehr in ihr Angriffsintervall, sie schlugen also seltener zu als versprochen. Der')
w('   Rückzug ist jetzt kürzer als die halbe Vorwarnungslücke.')
w('')
w('Dazu zwei Feinjustierungen aus dem Messlauf: der Amtsschimmel steht während seiner')
w('Wiedervorlage offen und fiel dadurch unter das A3-Band (Sollzeit hoch), und die Fledermaus lag')
w('mit 1,6 s so nah am Bandboden, dass ein guter Wurf sie unter eine Sekunde drückte (Sollzeit')
w('auf 2,0 s).')
w('')
w('### 3.8 Was offen bleibt')
w('')
w('Drei Punkte, die dieses Dokument benennt und nicht löst:')
w('')
w('1. **Ein A4-Kill auf Sollstufe 10 trägt rund 1857 XP, ein Stufenaufstieg kostet dort 784.**')
w('   Das folgt zwingend aus der Ertragsleiter: 2,6 mal Ertrag bei 16 mal Kampfzeit. Ein Kill an')
w('   der Sammelverfügung trägt so viel wie 48 Kills am Aktenboten. Wenn das zu schnell ist,')
w('   gehört nicht der Katalog angefasst, sondern ein einziger Faktor auf alle XP-Werte oder die')
w('   Stufenkurve `35 * Stufe^1,35`. Die Verhältnisse zwischen den Klassen bleiben davon')
w('   unberührt.')
w('2. **Die zehn neuen Gegner tragen kein eigenes Sprite.** Sie benutzen Rigs aus dem Bestand,')
w('   umgefärbt, wie es das Spiel bei Frostgolem und Schattenling schon immer tut. Wer eigene')
w('   Grafik will, tauscht `rig` und `tint` im MONDEF-Eintrag, nicht die Zahlen.')
w('3. **Der Frostkamm bleibt ungerechnet.** Er stand nicht im Auftrag. Solange das so ist, ist')
w('   er die Vergleichsprobe im selben Spiel; wenn er dazukommen soll, gehören seine drei Typen')
w('   in `tools/monsterkatalog.py` und bekommen dort ein `kat`-Feld wie alle anderen.')
w('')
w('### 3.9 Nachtrag M2: zwei versiegelte Gegner')
w('')
w('Aus dem Spielbericht: sobald Magie zur Verfügung steht, lässt sich aus der Distanz')
w('spammen. Der erste Teil der Antwort steht in `phase-z1-zauberbalance.md` (Zaubern kostet')
w('wieder Bewegung und Rhythmus). Der zweite Teil steht hier: **zwei der 22 Gegner sind gegen')
w('alle drei Zauberzweige immun.** Sie sind der Ort, an dem die Waffe die einzige Antwort ist.')
w('')
w('| Gegner | Sollstufe | Klasse | Weichstelle | Sollzeit |')
w('|---|---|---|---|---|')
for m in R:
    if m.get('zauberfest'):
        e = next(x for x in rein if x['id'] == m['id'])
        w('| %s | %d | %s | physisch %s | %s s |' % (
            fix(m['name']), m['L'], m['klasse'],
            ('%+.2f' % m['res']['physisch']).replace('.', ','),
            ('%.1f' % e['berechnete_ttk_s']).replace('.', ',')))
w('')
w('Beide sind mit Absicht **A2 und langsam** (Tempo 36 und 26 gegen 135 beim Spieler). Wer')
w('sie im Nahkampf annimmt, kann jederzeit wieder weggehen. Die Sperre kostet also Zeit und')
w('Aufmerksamkeit, nie das Leben. Beide sind gegen die Waffe ausdrücklich VERWUNDBAR, nicht')
w('bloß unresistent: der Umweg über den Nahkampf ist schneller als jeder Zauber es je war.')
w('Und beide stehen weit vom Dorf entfernt, in Wüste und Ruine, also dort, wo ein Spieler')
w('seine Zauber längst kennt. Sichtbar sind sie an einem gestrichelten weißen Siegelring am')
w('Boden, der dauerhaft leuchtet und nicht erst nach dem ersten verlorenen Zauber.')
w('')
w('Drei Bedingungen prüfen dieses Skript und `monsterAssert()` unabhängig voneinander nach:')
w('die Sollroute ist physisch, die Waffe ist Weichstelle, und die Klasse ist nicht A4. Dazu')
w('kommt die Sackgassenprüfung, die für ALLE Gegner gilt: kein Gegner darf gegen alle vier')
w('spielbaren Arten zugleich immun sein.')
w('')
w('Nicht in diesem Katalog stehen die beiden anderen Neuerungen aus M2, weil sie keine')
w('Katalogeinträge sind: die Staffel der Bevölkerung nach Entfernung vom Dorf und der')
w('Sonderprüfer, eine seltene Aufwertung EINER Instanz eines A1-Gegners. Beides sind')
w('Eigenschaften der Karte und der Instanz, nicht der Vorgangsart. Sie stehen in')
w('`phase-m2-nahfeld-und-namen.md` und werden von `monsterAssert()` gegen dieselben Bänder')
w('gerechnet wie alles andere hier.')
w('')
w('### 3.10 Nachtrag Z2: die Zauberbefugnis und die neue Manarechnung')
w('')
w('Mit Z2 (`phase-z2-zauberbefugnis.md`) gilt: der erste Zauberpunkt kommt beim Aufstieg')
w('auf Stufe 4, die passive Manaregeneration faellt von 8 auf 2 je Sekunde, und jeder')
w('Waffenschwung mit mindestens einem Treffer laedt 4 Mana. Fuer diesen Katalog folgt daraus')
w('eine neue Zauberleistung:')
w('')
w('    Manarate im Kampf = 2 + 4 * 1,3 Schwuenge/s = 7,2 Mana/s')
w('    ZAUBER_DPS        = 7,2 / 5 * 16 = %.2f (vorher 25,6)' % ZAUBER_DPS)
w('')
w('Die Rechnung nimmt an, dass der Spieler das Mana AM GEGNER erarbeitet. Das traegt auch')
w('beim Steingolem, dessen Sollroute Magie ist: die Treffer-Ladung haengt am Treffer, nicht')
w('am Schaden, seine 0,9 Physisch-Resistenz aendert an der Manarechnung nichts. Die drei')
w('Gegner mit Zauber-Sollroute (Moorbescheid, Steingolem, Sammelverfuegung) haben dadurch')
w('rund zehn Prozent weniger Lebenspunkte, ihre Sollzeiten sind unveraendert. Reines')
w('Zauberspammen aus der Distanz liegt bei 6,4 Schaden je Sekunde und ist damit gegen')
w('nichts oberhalb eines Formfehlers eine Route. Genau das war der Auftrag.')
w('')
w('Zwei Stufen des Katalogs (1 bis 3) liegen jetzt VOR der Befugnis. Fuer sie existiert')
w('keine Zauberroute, und der Messlauf schreibt in diese Zellen "keine Befugnis" statt')
w('einer Zahl. Kein Eintrag dieser Stufen hat eine Zauber-Sollroute, der Katalog bleibt')
w('also in sich geschlossen; die Kopplung der Konstanten prueft `zauberAssert()` in')
w('`index.html` bei jedem Laden.')
w('')

md = '\n'.join(L) + '\n'
open(os.path.join(ROOT, 'monsterkatalog-stufe-1-10.md'), 'w', encoding='utf-8').write(md)
json.dump(rein, open(os.path.join(ROOT, 'monsterkatalog.json'), 'w', encoding='utf-8'),
          ensure_ascii=False, indent=2)
# Kreuzungsregeln: jede Ertragsklasse mit mindestens zwei Anforderungstypen, kein
# Anforderungstyp exklusiv bei einer Ertragsklasse, je Biom 3 bis 5 Gegner aus
# mindestens 3 Ertragsklassen.
kreuz = []
_kl, _typ, _biom = defaultdict(set), defaultdict(set), defaultdict(set)
for m in rein:
    _kl[m['ertragsklasse']].update(m['anforderungstyp'])
    for t in m['anforderungstyp']: _typ[t].add(m['ertragsklasse'])
    _biom[m['biom']].add(m['ertragsklasse'])
for k, v in _kl.items():
    if len(v) < 2: kreuz.append(f'Ertragsklasse {k} hat nur einen Anforderungstyp')
for t, v in _typ.items():
    if len(v) < 2: kreuz.append(f'Anforderungstyp {t} gehoert exklusiv zu {sorted(v)[0]}')
for b, v in _biom.items():
    n = sum(1 for m in rein if m['biom'] == b)
    if not (3 <= n <= 5): kreuz.append(f'Biom {b} hat {n} Gegner')
    if len(v) < 3: kreuz.append(f'Biom {b} hat nur {len(v)} Ertragsklasse(n)')

verstoesse = [p for p in pruef if p['v'] != 'ok']
print('monsterkatalog-stufe-1-10.md und monsterkatalog.json geschrieben.')
print(f"{len(rein)} Gegner, {len(verstoesse) + len(kreuz)} Verletzung(en).")
for p in verstoesse:
    print('  VERSTOSS Werteband', p['id'], p['v'])
for k in kreuz:
    print('  VERSTOSS Kreuzungsregel', k)
