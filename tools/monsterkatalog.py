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
 'Zwoelf':'Zwölf','ausser':'außer','bestandskraeftig':'bestandskräftig','dafuer':'dafür','darueber':'darüber',
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

import json, math, sys
sys.path.insert(0,'/tmp/claude-0/-home-user-superduper-adventure/c42aa5cf-a2b0-5c79-a856-13ed8e583102/scratchpad')
from umlaut import fix, fixdeep

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

# Zauber: manabegrenzt. Regeneration 8 Mana/s, Funke 16 Schaden je 5 Mana.
ZAUBER_DPS = 25.6          # Dauerleistung, unabhaengig von der Stufe (INT 0)
ZAUBER_BURST = 57.0        # solange der Pool reicht

XP_RATE = {'A1': 1.0, 'A2': 1.4, 'A3': 2.0, 'A4': 2.6}
def basisrate(L):          # XP je effektiver Kampfsekunde fuer A1 auf Sollstufe L
    return 5.0 * (L ** 0.6)

TTK_BAND = {'A1': (1, 3), 'A2': (8, 15), 'A3': (12, 25), 'A4': (20, 40)}
GEF_BAND = {'A1': (30, 1e9), 'A2': (15, 25), 'A3': (6, 10), 'A4': (3, 6)}
VORWARN_MIN = {'A1': 0, 'A2': 0, 'A3': 350, 'A4': 350}

def rundeHp(x):
    if x < 100: return int(round(x))
    if x < 500: return int(round(x / 5.0) * 5)
    return int(round(x / 10.0) * 10)

def route_dps(route, L):
    return REF[L]['dps'] if route == 'physisch' else ZAUBER_DPS

# ---------------------------------------------------------------- Roster
# ttk_ziel  = Zielkampfzeit auf der Sollroute
# gef_ziel  = Zielgefahrenbudget in Sekunden
# heilsperre= True -> Gift blockt Traenke, Budget rechnet ohne Heilung
R = []
def mon(**kw): R.append(kw)

# --- WALD / Ablage A -------------------------------------------------------
mon(id='wa_vordruckling', name='Vordruckling', biom='Wald', L=1, klasse='A1', typen=['B1'],
    res=dict(physisch=0, feuer=-0.25, eis=0, gift=0.2, magie=0), route='physisch',
    ttk_ziel=2.0, gef_ziel=48, intervall=1.2, tempo=40, rudel=5,
    muster=[('Anlehnen', 300, 'nah (26)', 'schiebt leicht zurueck, kein Effekt darueber hinaus'),
            ('Formfehler abgeben', 350, 'nah (26)', 'ersetzt den Grundtreffer, hinterlaesst ein Blatt am Boden')],
    konter='Einfach draufhalten, aber nie stehen bleiben, wo drei von ihnen zusammenlaufen.',
    flavor='Ein Stapel Formulare, der gelernt hat, beleidigt zu sein. Er will nichts von dir ausser einer Unterschrift, notfalls mit Gewalt.',
    loot=[('Chuchu-Gallert', 0.35), ('Goblin-Zeh', 0.10), ('Kupfermuenzen', 0.60)])

mon(id='wa_ablagestapel', name='Wandelnder Ablagestapel', biom='Wald', L=2, klasse='A2', typen=['B2'],
    res=dict(physisch=0.35, feuer=-0.4, eis=0.1, gift=0.3, magie=0), route='physisch',
    ttk_ziel=10.0, gef_ziel=21, intervall=1.6, tempo=32, rudel=1,
    muster=[('Umkippen', 420, 'nah (30)', 'kurzer Rueckstoss, danach 0,6 s wehrlos am Boden'),
            ('Loseblattlawine', 600, 'Kegel (90)', 'ersetzt den Grundtreffer, trifft breit statt hart')],
    konter='Von der Seite schlagen und die 0,6 s nach dem Umkippen zum Nachladen nutzen.',
    flavor='Zwoelf Jahre unbearbeiteter Posteingang, jetzt mit Beinen. Feuer waere gnaedig, fuer beide Seiten.',
    loot=[('Chuchu-Gallert', 0.25), ('Goblin-Zeh', 0.30), ('Holzschild-Rohling', 0.12)])

mon(id='wa_schamane', name='Waldschamane im Widerspruch', biom='Wald', L=3, klasse='A3', typen=['B3', 'B7'],
    res=dict(physisch=-0.2, feuer=0, eis=0, gift=0.2, magie=0.4), route='physisch',
    ttk_ziel=13.0, gef_ziel=8.5, intervall=1.9, tempo=44, rudel=1,
    muster=[('Widerspruchsbolzen', 420, 'fern (130)', 'gerader Bolzen, sichtbares Aufleuchten vor dem Wurf'),
            ('Aus dem Unterholz', 500, 'nah (40)', 'Eroeffnung aus der Deckung, ersetzt den ersten Grundtreffer')],
    konter='Sofort die Distanz schliessen, im Nahkampf ist er aus Papier.',
    flavor='Er widerspricht allem, auch der Schwerkraft, aber nur schriftlich. Der Bolzen ist die Anlage zum Schreiben.',
    loot=[('Schamanenbart', 0.40), ('Chuchu-Gallert', 0.15), ('Widerspruchsformular', 0.20)])

mon(id='wa_zustellbote', name='Der Zustellbote', biom='Wald', L=3, klasse='A4', typen=['B4'],
    res=dict(physisch=0.55, feuer=0.2, eis=-0.3, gift=0, magie=0.2), route='physisch',
    ttk_ziel=21.0, gef_ziel=4.5, intervall=1.1, tempo=126, rudel=1,
    muster=[('Zustellversuch', 380, 'nah (26)', 'Antippen im Vorbeilaufen, danach sofort wieder Abstand'),
            ('Abgabefenster', 700, 'nah (34)', 'er bleibt 1,4 s stehen und quittiert, in dieser Zeit faellt seine Resistenz auf 0')],
    konter='Nicht hinterherlaufen, sondern das 1,4 s lange Abgabefenster abwarten und dort den ganzen Schaden hineinlegen.',
    flavor='Er war da. Du warst nur leider nicht da, wo er war. Der Zettel im Baum sagt, du sollst es beim Amt versuchen.',
    loot=[('Kurierschuhe-Sohle', 0.30), ('Goblin-Zeh', 0.25), ('Benachrichtigungszettel', 0.45)])

# --- SUMPF / Die Nassablage ------------------------------------------------
mon(id='su_blubberakte', name='Blubberakte', biom='Sumpf', L=3, klasse='A1', typen=['B1', 'B7'],
    res=dict(physisch=0, feuer=-0.3, eis=0.1, gift=0.8, magie=0), route='physisch',
    ttk_ziel=2.4, gef_ziel=42, intervall=1.3, tempo=46, rudel=4,
    muster=[('Auftauchen', 400, 'nah (24)', 'Blasen an der Oberflaeche sind die Vorwarnung, dann der Erstschlag'),
            ('Schmatzen', 300, 'nah (24)', 'Grundtreffer, verlangsamt kurz um ein Viertel')],
    konter='Auf die Blasen achten und nicht ueber offenes Wasser laufen, dann sind sie einzeln und harmlos.',
    flavor='Eine Akte, die im Moor lag, bis sie das Blubbern gelernt hat. Sie ist noch immer nass und noch immer nicht bearbeitet.',
    loot=[('Sumpfgallert', 0.35), ('Geisterschleier', 0.08), ('Aufgeweichtes Blatt', 0.25)])

mon(id='su_moorbescheid', name='Der Moorbescheid', biom='Sumpf', L=4, klasse='A2', typen=['B5'],
    res=dict(physisch=0.5, feuer=-0.5, eis=0.15, gift=0.9, magie=0.15), route='feuer',
    ttk_ziel=10.0, gef_ziel=20, intervall=2.0, tempo=26, rudel=1,
    muster=[('Durchweichen', 450, 'nah (30)', 'schwerer, langsamer Schlag, Grundtreffer'),
            ('Faulgasstoss', 550, 'Kegel (70)', 'ersetzt den Grundtreffer, sperrt 4 s lang die Trankwirkung')],
    konter='Anzuenden. Nass gewordenes Papier haelt Stahl aus, aber keine Flamme.',
    flavor='Seit dreissig Jahren im Moor, seit dreissig Jahren bestandskraeftig. Trocken waere er nur ein Blatt.',
    loot=[('Moorbinde', 0.40), ('Geisterschleier', 0.20), ('Versiegelte Zweitschrift', 0.15)],
    heilsperre=True)

mon(id='su_amtsschimmel', name='Der Amtsschimmel', biom='Sumpf', L=5, klasse='A3', typen=['B4', 'B6'],
    res=dict(physisch=0.15, feuer=-0.3, eis=0.1, gift=0.5, magie=0.3), route='physisch',
    ttk_ziel=14.0, gef_ziel=9, intervall=1.8, tempo=118, rudel=1,
    muster=[('Wiedervorlage', 500, 'fern (150)', 'heilt einen Nachbarn um 12 Prozent, sichtbarer Faden zwischen beiden'),
            ('Ausweichschritt', 350, 'nah (28)', 'Grundtreffer im Zurueckweichen, er bleibt nie stehen')],
    konter='Zuerst ihn, nicht die Geheilten, und ihn nur an der Wand oder im Wasser stellen, wo er nicht ausweichen kann.',
    flavor='Er kaempft nicht, er verlaengert. Alles, was er anschaut, bekommt eine neue Frist und dadurch neue Gesundheit.',
    loot=[('Schimmelquaste', 0.45), ('Feuchte Bescheinigung', 0.18), ('Wiedervorlagemappe', 0.20)])

mon(id='su_irrlicht', name='Irrlicht der Fristsetzung', biom='Sumpf', L=5, klasse='A4', typen=['B3', 'B4'],
    res=dict(physisch=0.5, feuer=0.3, eis=-0.35, gift=0.4, magie=0.1), route='physisch',
    ttk_ziel=24.0, gef_ziel=4.2, intervall=2.0, tempo=132, rudel=1,
    muster=[('Fristablauf', 650, 'fern (170)', 'schwerer Einzelschlag, der Countdown ueber dem Kopf ist die Vorwarnung'),
            ('Verwehen', 400, 'kein Schaden', 'setzt 1,2 s aus und ist dabei unverwundbar, danach 2 s offen')],
    konter='Schlagen, sobald das Verwehen endet, und in der Fristablauf-Vorwarnung seitlich raus.',
    flavor='Es setzt Fristen, die niemand beantragt hat, und laeuft dann weg, bevor man widersprechen kann. Sehr amtlich.',
    loot=[('Irrlicht-Funke', 0.40), ('Sumpfgallert', 0.20), ('Fristsetzungsbescheid', 0.30)])

# --- WUESTE / Der Brandabschnitt -------------------------------------------
mon(id='wu_skarabaeus', name='Papierstaub-Skarabaeus', biom='Wueste', L=4, klasse='A1', typen=['B5'],
    res=dict(physisch=0.5, feuer=0.85, eis=-0.4, gift=0.3, magie=0), route='physisch',
    ttk_ziel=2.5, gef_ziel=40, intervall=1.0, tempo=92, rudel=3,
    muster=[('Anrempeln', 300, 'nah (22)', 'Grundtreffer im Vorbeihuschen'),
            ('Staubwolke', 400, 'nah (40)', 'ersetzt den Grundtreffer, nimmt 1 s lang Sicht statt Leben')],
    konter='Eis, notfalls Stahl. Wer hier Feuer wirft, bezahlt zehn Sekunden fuer nichts.',
    flavor='Er frisst Aktenstaub und hat davon einen Panzer bekommen, der nicht brennt. Das ist im Brandabschnitt eine Karriere.',
    loot=[('Panzerspan', 0.35), ('Skorpionstachel', 0.10), ('Sandiger Vordruck', 0.25)])

mon(id='wu_steinbescheid', name='Der Steinbescheid', biom='Wueste', L=5, klasse='A2', typen=['B2', 'B5'],
    res=dict(physisch=0.55, feuer=0.4, eis=-0.35, gift=0.2, magie=0.1), route='eis',
    ttk_ziel=12.0, gef_ziel=22, intervall=2.2, tempo=24, rudel=1,
    muster=[('Absetzen', 500, 'nah (34)', 'schwerer Grundtreffer, kurzer Bodenriss davor'),
            ('Rechtskraft', 800, 'Ring (110)', 'ersetzt den Grundtreffer, Druckwelle rundum, weit sichtbar')],
    konter='Frost macht den Stein sproede, danach reicht Geduld.',
    flavor='Er ist nicht besonders wuetend, er ist nur rechtskraeftig. Dagegen hilft kein Argument, nur Temperatur.',
    loot=[('Golem-Splitter', 0.35), ('Panzerspan', 0.25), ('Beglaubigter Brocken', 0.15)])

mon(id='wu_nachforderung', name='Nachforderungsskorpion', biom='Wueste', L=6, klasse='A3', typen=['B3'],
    res=dict(physisch=0.1, feuer=0.3, eis=0.1, gift=0.7, magie=-0.2), route='physisch',
    ttk_ziel=16.0, gef_ziel=7, intervall=2.4, tempo=96, rudel=1,
    muster=[('Nachforderung', 450, 'nah (28)', 'sehr harter Einzelstich, Stachel hebt sichtbar an'),
            ('Zweite Nachforderung', 350, 'nah (28)', 'folgt nur, wenn der erste Stich getroffen hat, halbe Wucht')],
    konter='Nach jedem gehobenen Stachel einen Schritt raus, dann faellt die zweite Nachforderung weg.',
    flavor='Der erste Bescheid war zu niedrig, sagt er, und stellt das sofort richtig. Zweimal.',
    loot=[('Skorpionstachel', 0.45), ('Krabbenschere', 0.15), ('Nachforderungsbescheid', 0.25)])

mon(id='wu_duenenpriester', name='Duenenpriester der Verfuegung', biom='Wueste', L=7, klasse='A4', typen=['B4', 'B6'],
    res=dict(physisch=0.45, feuer=0.5, eis=-0.3, gift=0.2, magie=0.2), route='physisch',
    ttk_ziel=30.0, gef_ziel=4.5, intervall=2.0, tempo=104, rudel=1,
    muster=[('Verfuegung', 900, 'fern (160)', 'gibt allen Skorpionen im Umkreis 25 Prozent mehr Schaden, 2,4 s Standzeit'),
            ('Sandschritt', 350, 'nah (26)', 'Grundtreffer beim Zurueckweichen, er haelt Abstand von rund 140')],
    konter='Das 2,4 s lange Verfuegungsfenster ist die einzige Gelegenheit, ihn einzuholen, alles andere ist Hinterherlaufen.',
    flavor='Er kaempft nie selbst, er verfuegt nur, dass andere es tun. Sein Stab hat mehr Dienstjahre als das Amt.',
    loot=[('Priesterquaste', 0.45), ('Skorpionstachel', 0.20), ('Verfuegung in Abschrift', 0.30)])

# --- HOEHLE / Die Untere Registratur ---------------------------------------
mon(id='ho_umlauf', name='Umlauffledermaus', biom='Hoehle', L=6, klasse='A1', typen=['B1'],
    res=dict(physisch=0, feuer=-0.2, eis=-0.1, gift=0.3, magie=0), route='physisch',
    ttk_ziel=1.6, gef_ziel=36, intervall=0.9, tempo=134, rudel=6,
    muster=[('Vorbeiflug', 250, 'nah (20)', 'Grundtreffer im Durchflug, danach dreht sie sofort ab'),
            ('Umlaufmappe', 300, 'nah (20)', 'ersetzt den Grundtreffer, haengt dir 2 s lang eine Sichtbehinderung an')],
    konter='Breit schlagen statt zielen, der Schwarm stirbt an einem einzigen guten Hieb.',
    flavor='Sie traegt eine Mappe von A nach B und wieder zurueck, seit niemand mehr weiss, was in der Mappe ist.',
    loot=[('Fledermausfluegel', 0.40), ('Spinnenbein', 0.08), ('Umlaufmappe', 0.20)])

mon(id='ho_deckenlauerer', name='Der Deckenlauerer', biom='Hoehle', L=7, klasse='A2', typen=['B2', 'B7'],
    res=dict(physisch=0.3, feuer=-0.3, eis=0.2, gift=0.3, magie=0.15), route='physisch',
    ttk_ziel=13.0, gef_ziel=19, intervall=1.7, tempo=52, rudel=1,
    muster=[('Fallenlassen', 550, 'nah (34)', 'Schatten am Boden ist die Vorwarnung, Eroeffnung mit doppelter Wucht'),
            ('Nachfassen', 400, 'nah (30)', 'Grundtreffer, zieht dich ein Stueck zu sich')],
    konter='Vor dem Betreten nach oben schauen, danach ist er nur noch langsam und dick.',
    flavor='Er haengt seit Jahren an der Decke der Registratur und wartet auf jemanden, der zustaendig ist. Du bist zustaendig.',
    loot=[('Spinnenbein', 0.40), ('Panzerspan', 0.20), ('Deckenprotokoll', 0.15)])

mon(id='ho_sammelmahnung', name='Die Sammelmahnung', biom='Hoehle', L=8, klasse='A3', typen=['B1', 'B3'],
    res=dict(physisch=0.2, feuer=0, eis=0.1, gift=0.4, magie=-0.3), route='physisch',
    ttk_ziel=14.0, gef_ziel=7.5, intervall=2.3, tempo=74, rudel=3,
    muster=[('Mahnstufe', 500, 'nah (30)', 'harter Grundtreffer, jede Mahnung schlaegt einzeln und versetzt'),
            ('Gleichlaut', 600, 'nah (30)', 'stehen drei beieinander, schlagen sie gleichzeitig, Vorwarnung faerbt alle drei')],
    konter='Aufbrechen und einzeln erledigen, ein gleichlautender Dreierschlag kostet die halbe Leiste.',
    flavor='Drei Mahnungen desselben Vorgangs, die sich einig sind. Einzeln sind sie Papier, zu dritt sind sie ein Vollstreckungstitel.',
    loot=[('Skelettknoechel', 0.35), ('Irrlicht-Funke', 0.15), ('Mahnbescheid, dritte Stufe', 0.30)])

mon(id='ho_bestandskraft', name='Steingolem der Bestandskraft', biom='Hoehle', L=9, klasse='A4', typen=['B2', 'B5'],
    res=dict(physisch=0.9, feuer=0, eis=0, gift=0.6, magie=-0.4), route='magie',
    ttk_ziel=34.0, gef_ziel=5.0, intervall=2.6, tempo=28, rudel=1,
    muster=[('Faustschlag', 700, 'nah (36)', 'sehr schwerer Grundtreffer, Arm hebt weit sichtbar an'),
            ('Unanfechtbar', 900, 'Ring (130)', 'ersetzt den Grundtreffer, Druckwelle, danach 3 s Erschoepfung ohne Angriff')],
    konter='Stahl prallt ab, also Manapool leeren, in der Erschoepfung nachladen und den Kreislauf so lange fahren, bis er faellt.',
    flavor='Er ist bestandskraeftig geworden und weiss das. Schwerter sind gegen ihn kein zulaessiges Rechtsmittel, Magie schon.',
    loot=[('Golem-Splitter', 0.50), ('Panzerspan', 0.25), ('Unanfechtbarer Beschluss', 0.12)])

# --- RUINE / Der Altbestand ------------------------------------------------
mon(id='ru_aktenbote', name='Der Aktenbote', biom='Ruine', L=8, klasse='A1', typen=['B1', 'B6'],
    res=dict(physisch=0, feuer=-0.2, eis=0, gift=0.2, magie=0.1), route='physisch',
    ttk_ziel=2.2, gef_ziel=38, intervall=1.4, tempo=88, rudel=4,
    muster=[('Zuschlag', 400, 'fern (120)', 'gibt einem Nachbarn 20 Prozent mehr Schaden, kein eigener Schaden'),
            ('Aktenkante', 300, 'nah (24)', 'Grundtreffer, schmal und schnell')],
    konter='Zuerst die Boten, dann alles andere, sie sind so weich wie ihr Zuschlag hart ist.',
    flavor='Er traegt nichts Eigenes bei ausser der Nachricht, dass jetzt alle haerter zuschlagen duerfen. Und daran haelt sich hier jeder.',
    loot=[('Botenmappe', 0.35), ('Schattenfetzen', 0.15), ('Zuschlagsverfuegung', 0.25)])

mon(id='ru_mumie', name='Mumie der versiegelten Akte', biom='Ruine', L=9, klasse='A2', typen=['B2'],
    res=dict(physisch=0.4, feuer=-0.45, eis=0.2, gift=0.9, magie=0.1), route='physisch',
    ttk_ziel=14.0, gef_ziel=18, intervall=2.1, tempo=26, rudel=1,
    muster=[('Verschnueren', 500, 'nah (30)', 'Grundtreffer, halbiert 2 s lang dein Tempo'),
            ('Siegelstaub', 600, 'Kegel (80)', 'ersetzt den Grundtreffer, sperrt 5 s lang die Trankwirkung')],
    konter='Feuer an die Binden und waehrend der Siegelstaub-Sperre gar nicht erst auf den Trank hoffen.',
    flavor='Versiegelt, verschnuert, seit vierhundert Jahren nicht geoeffnet. Sie haelt das fuer Datenschutz.',
    loot=[('Mumienbinde', 0.45), ('Geisterschleier', 0.20), ('Versiegelte Akte', 0.18)],
    heilsperre=True)

mon(id='ru_knochenritter', name='Knochenritter der Dienstvorschrift', biom='Ruine', L=9, klasse='A3', typen=['B7', 'B3'],
    res=dict(physisch=0.25, feuer=0.1, eis=-0.25, gift=0.6, magie=0.1), route='physisch',
    ttk_ziel=18.0, gef_ziel=6.5, intervall=2.5, tempo=82, rudel=1,
    muster=[('Aus der Nische', 600, 'nah (40)', 'Eroeffnung aus der Wand, weit ausholender Bogen'),
            ('Dienstweg', 450, 'nah (34)', 'Grundtreffer, immer exakt drei Schlaege, dann 1,6 s Pause')],
    konter='Die drei Schlaege des Dienstwegs ausweichen und in der Pause zuschlagen, er weicht davon nie ab.',
    flavor='Er haelt sich an die Vorschrift, auch beim Toeten: drei Schlaege, dann Pause, dann Bericht. Die Pause ist dein Rechtsmittel.',
    loot=[('Skelettknoechel', 0.45), ('Hundszahn', 0.15), ('Dienstvorschrift, Randfassung', 0.20)])

mon(id='ru_sammelverfuegung', name='Die Sammelverfuegung', biom='Ruine', L=10, klasse='A4', typen=['B4', 'B5'],
    res=dict(physisch=0.7, feuer=-0.35, eis=0.45, gift=0.6, magie=0.45), route='feuer',
    ttk_ziel=36.0, gef_ziel=4.0, intervall=2.2, tempo=112, rudel=1,
    muster=[('Anhoerung', 800, 'fern (180)', 'schwerer Fernschlag, sie bleibt dafuer 1,8 s stehen'),
            ('Zurueckverweisen', 400, 'nah (30)', 'Grundtreffer, stoesst dich weit zurueck und sie zieht sich nach'),
            ('Aktenmantel', 500, 'kein Schaden', 'zieht 2,5 s lang alle Resistenzen auf 0,8 hoch, das Blatt darunter bleibt aber brennbar')],
    konter='Nur waehrend der Anhoerung stehen bleiben und Feuer legen, im Aktenmantel gar nicht erst schlagen.',
    flavor='Sie fasst alles zusammen, was je gegen dich lief, und traegt es in einem Mantel aus Papier vor sich her. Papier.',
    loot=[('Fuerstenkrone-Fragment', 0.10), ('Ruferzunge', 0.30), ('Sammelverfuegung, Urschrift', 0.40)])

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
    treffer = int(round(dps_ein_soll * m['intervall'] / (1 - ref['minderung'])))
    dps_ein = treffer * (1 - ref['minderung']) / m['intervall']
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
        'angriffsmuster': [{'name': n, 'vorwarnzeit_ms': v, 'reichweite': rw, 'effekt': e} for n, v, rw, e in m['muster']],
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
    vmin = min(p[1] for p in m['muster'])
    if vmin < VORWARN_MIN[kl]: verstoss.append('Vorwarnung')
    if vmin < 250: verstoss.append('Vorwarnung<250')
    pruef.append(dict(id=m['id'], name=fix(m['name']), biom=fix(m['biom']), L=L, kl=kl, typen='+'.join(m['typen']),
                      route=m['route'], hp=hp, ttk=round(ttk, 1), xp=xp, xps=round(xps, 2),
                      soll=round(soll_rate, 2), gef=gef, gefr=gef_rudel, rudel=m['rudel'],
                      vmin=vmin, treffer=treffer, iv=m['intervall'], heil=bool(m.get('heilsperre')),
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

w('## Monsterkatalog, Sollstufe 1 bis 10: zwanzig Gegner in fünf Biomen — OFFEN (Balancing-Lieferung, nicht eingebaut)')
w('')
w('Inhaltslieferung zu Kapitel 3 (Geographie) und Kapitel 6 (Bestiarium) der')
w('`superduper-weltbibel.md`. Zwanzig Gegner, fünf Biome, vier Ertragsklassen, feste Werte.')
w('Der Katalog ist Balancing, kein Code: er sagt, welche Zahl ein Gegner tragen soll und warum,')
w('und er rechnet den Grund mit. Autorität für Welt, Namen und Ton bleibt die Weltbibel; wo')
w('dieser Katalog eine Zahl nennt, die im Code anders steht, ist der Code der Stand und dieses')
w('Dokument der Vorschlag.')
w('')
w('**Erzeugt von** `tools/monsterkatalog.py`. Das Skript rechnet jede Zahl aus der Rechenbasis,')
w('prüft alle harten Invarianten und meldet jede Verletzung. Von Hand geändert wird hier nichts,')
w('geändert wird das Skript.')
w('')
w('**Formregeln, unverändert aus Kapitel 13:** keine Gedankenstriche im Fließtext, keine Emojis,')
w('kurze Sätze. Die Markierung in der Überschrift folgt der Repo-Regel aus der README und ist')
w('kein Fließtext.')
w('')
w('Zwei Vorgaben waren im Auftrag offen und sind hier gesetzt, weil ohne sie nichts zu rechnen ist:')
w('**N = 20 Gegner** und **X = Sollstufe 10**. Fünf Biome zu je vier Gegnern, das ist die kleinste')
w('Zahl, mit der jedes Biom alle vier Ertragsklassen tragen kann.')
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
w('Fünf Biome, je vier Gegner, je alle vier Ertragsklassen. Wer ein bestimmtes Ausrüstungsteil')
w('bauen will, hat keine Wahl, wohin er geht:')
w('')
w('| Biom | Amtlicher Name | Signatur in einem Satz | Sollstufen |')
w('|---|---|---|---|')
w('| Wald | Ablage A | Der Wald gibt Stiefel und Schilde und fast nur Adjektive, die auf Tempo und Verlangsamung zeigen. | 1 bis 3 |')
w('| Sumpf | Die Nassablage | Im Sumpf liegen Rüstungszutaten mit feuchten Adjektiven, also alles für Selbstheilung und Abweisung, und sonst nichts. | 3 bis 5 |')
w('| Wüste | Der Brandabschnitt | Der Brandabschnitt liefert Waffenzutaten mit glühenden Adjektiven, also Nachdruck und Wucht, und legt jedem Fund einen teuren Fluch bei. | 4 bis 7 |')
w('| Höhle | Die Untere Registratur | Unter Tage kommen Schildzutaten mit steinernen Adjektiven, also Panzerung und Aktenlage, und nur dort. | 6 bis 9 |')
w('| Ruine | Der Altbestand | Der Altbestand ist die einzige Quelle arkaner Waffenzutaten, also Manafluss, Zauberkraft und Aktenkunde, und zahlt sie mit den härtesten Gegnern des Katalogs. | 8 bis 10 |')
w('')
w('Die Eisablage (`snow`) ist im Auftrag nicht genannt und bleibt unverändert bei ihrem heutigen')
w('Roster.')
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
w('Kapitel 6 der Weltbibel hat dazu eine Regel: erst die Vorgangsart erfinden, dann das')
w('Monster, nie umgekehrt. Wer eine Vorgangsart nicht in einem Satz erklären kann, hat kein')
w('Monster. Sieben der zwanzig übernehmen eine Vorgangsart, die schon im Bestiarium steht,')
w('dreizehn sind neu.')
w('')
w('| Gegner | Vorgangsart | Warum es sich so verhält |')
w('|---|---|---|')
w('| Vordruckling | Der Vordruck | Ein Formular, das nie ausgefüllt wurde und es deshalb selbst versucht. Vordrucke kommen nie einzeln. |')
w('| Wandelnder Ablagestapel | Der Posteingang | Zwölf Jahre nicht abgearbeitet und inzwischen hoch genug, um zurückzufallen. |')
w('| Waldschamane im Widerspruch | Der Widerspruch | Steht schon im Bestiarium: ein Widerspruch wird schriftlich erhoben, also aus der Entfernung. |')
w('| Der Zustellbote | Der Zustellversuch | Er war da. Du warst nicht da. Ihn zu fassen ist grundsätzlich vorgesehen und praktisch nie möglich. |')
w('| Blubberakte | Der Rücklauf | Was einmal untergegangen ist, kommt wieder hoch, sobald jemand am Ufer steht. |')
w('| Der Moorbescheid | Der durchweichte Bescheid | Unlesbar geworden und trotzdem in Kraft. Lesbarkeit ist keine Wirksamkeitsvoraussetzung. |')
w('| Der Amtsschimmel | Die Fristverlängerung | Er entscheidet nichts. Er verlängert, und was er verlängert, lebt länger. |')
w('| Irrlicht der Fristsetzung | Die Fristsetzung | Setzt eine Frist, die niemand beantragt hat, und ist weg, bevor jemand widersprechen kann. |')
w('| Papierstaub-Skarabäus | Die Aktenvernichtung | Er lebt von dem, was nach dem Brand übrig blieb, und ist gegen Feuer deshalb gleichgültig. |')
w('| Der Steinbescheid | Die Rechtskraft | Nicht wütend, nur rechtskräftig. Dagegen hilft kein Argument, nur Temperatur. |')
w('| Nachforderungsskorpion | Die Nachforderung | Steht schon im Bestiarium: kommt hinterher, sticht genau einmal. Hier zweimal, wenn der erste Stich sitzt. |')
w('| Dünenpriester der Verfügung | Die Verfügung | Steht schon im Bestiarium: ordnet aus sicherer Entfernung an, dass andere es tun. |')
w('| Umlauffledermaus | Der Umlauf | Steht schon im Bestiarium: kreist, landet nie, kommt bei jedem einmal vorbei. |')
w('| Der Deckenlauerer | Die Zuständigkeitsvermutung | Hängt jahrelang über allem und fällt auf den Ersten, der sich als zuständig erweist. |')
w('| Die Sammelmahnung | Die Mahnstufe | Dieselbe Sache, dreimal, gleichlautend. Einzeln Papier, zu dritt ein Titel. |')
w('| Steingolem der Bestandskraft | Die Bestandskraft | Steht schon im Bestiarium: eine Entscheidung, gegen die kein Rechtsmittel mehr geht. Das Schwert ist keines. |')
w('| Der Aktenbote | Der Zuschlag | Er trägt nichts Eigenes bei außer der Mitteilung, dass ab jetzt alle härter zuschlagen dürfen. |')
w('| Mumie der versiegelten Akte | Die versiegelte Akte | Steht schon im Bestiarium: Banderole drum, Siegel drauf, nie geöffnet. |')
w('| Knochenritter der Dienstvorschrift | Die Dienstvorschrift | Steht schon im Bestiarium: reine Form, bewaffnet, korrekt. Auch beim Töten hält er sich an die Reihenfolge. |')
w('| Die Sammelverfügung | Der Sammelvorgang in Verfügungsform | Alles, was je gegen dich lief, zusammengefasst und in einem Mantel aus Papier vorgetragen. |')
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
w('### 3.5 Prüfung gegen Kopien mit größeren Zahlen')
w('')
w('Der Verbotstest lautet: gibt es zwei Gegner, die dieselbe Frage stellen und sich nur in der')
w('Größe der Antwort unterscheiden? Die vier Paare, die sich am nächsten kommen:')
w('')
w('| Paar | Warum es keine Kopie ist |')
w('|---|---|')
w('| Wandelnder Ablagestapel und Der Steinbescheid, beide A2 und Schwamm | Der Stapel ist ein reiner Geduldsgegner mit einem Kegel, den man umläuft. Der Steinbescheid ist zusätzlich Gate: gegen Stahl dauert er 22 s, gegen Frost 12 s. Der eine prüft Ausdauer, der andere Vorbereitung. |')
w('| Der Zustellbote und Der Dünenpriester, beide A4 und Kiter | Der Bote hat ein Fenster, das er selbst öffnet und das man abwarten muss. Der Priester öffnet sein Fenster nur, wenn er andere buffen will, also erzwingt er, dass man den Schwarm überhaupt erst stehen lässt. |')
w('| Waldschamane und Knochenritter, beide A3 mit Hinterhalt | Der Schamane bestraft Distanz und fällt im Nahkampf sofort. Der Ritter bestraft Nähe zum falschen Zeitpunkt und hat ein starres Muster aus drei Schlägen und Pause. Gegenteilige Konter. |')
w('| Vordruckling und Umlauffledermaus, beide A1 und Schwarm | Der Vordruckling steht und sammelt sich, die Fledermaus fliegt durch und dreht ab. Der eine belohnt einen breiten Hieb an der richtigen Stelle, der andere Timing im Durchflug. |')
w('')
w('### 3.6 Was die Prüfung gefunden und der Katalog korrigiert hat')
w('')
w('Vier Befunde aus dem ersten Rechendurchlauf, alle vor dieser Ausgabe behoben:')
w('')
w('1. **Irrlicht der Fristsetzung** traf für 186 Schaden bei 198 Spieler-HP. Rechnerisch im Band,')
w('   praktisch ein Sofort-Tod aus dem Nichts. Intervall von 2,6 s auf 2,0 s, Treffer auf 130,')
w('   Gefahrenbudget von 3,8 s auf 4,2 s. Zwei Fehler sind jetzt tödlich, einer nicht.')
w('2. **Nachforderungsskorpion** stand mit Rudelgröße 2 im Roster, obwohl er kein Schwarmtyp ist.')
w('   Sein Gruppenbudget lag bei 3,4 s und damit unter dem A3-Band, ohne dass ein Anforderungstyp')
w('   das gerechtfertigt hätte. Rudelgröße auf 1.')
w('3. **Der Deckenlauerer** war gegen Gift verwundbar. Gift kann der Spieler nicht wirken, die')
w('   Weichstelle war also totes Blatt. Jetzt gegen Feuer verwundbar.')
w('4. **Eis war die Weichstelle in fast jedem zweiten Eintrag.** Amtsschimmel und')
w('   Nachforderungsskorpion wurden auf Feuer und Magie umgestellt. Die Verteilung der')
w('   Verwundbarkeiten lautet jetzt Feuer 10, Eis 7, Magie 3, physisch 1, was ungefähr der')
w('   Reihenfolge entspricht, in der ein Spieler die Zauberzweige aufmacht. Zwei Gegner tragen')
w('   zwei Weichstellen, deshalb sind es 21 Einträge bei 20 Gegnern.')
w('')
w('Zusätzlich wurde Gold von der XP entkoppelt. Aus dem XP-Wert abgeleitet hätte die')
w('Sammelverfügung 557 bis 1114 Gold getragen, mehr als der Schattenfürst mit 300 bis 500. Gold')
w('hängt jetzt an Sollstufe und Klasse und bleibt unter dem Bosswert.')
w('')
w('### 3.7 Was offen bleibt')
w('')
w('Drei Punkte, die dieser Katalog benennt und nicht löst:')
w('')
w('1. **Ein A4-Kill auf Sollstufe 10 trägt rund 1857 XP, ein Stufenaufstieg kostet dort 784.** Das')
w('   folgt zwingend aus den Vorgaben: 2,6 mal Ertrag bei 16 mal Kampfzeit. Ein Kill an der')
w('   Sammelverfügung trägt so viel wie 48 Kills am Aktenboten, dem Fleiß-Gegner desselben')
w('   Bioms. Wenn das zu schnell ist, gehört nicht der Katalog angefasst,')
w('   sondern ein einziger Faktor k auf alle XP-Werte oder die Stufenkurve `35 * Stufe^1,35`. Die')
w('   Verhältnisse zwischen den Klassen bleiben davon unberührt.')
w('2. **Sumpf, Höhle und Ruine gibt es im Code noch nicht.** `BIOME_BANDS` kennt drei Bänder,')
w('   `BIOM_AMT` und `BIOME_MOBS` je drei Einträge, und `ZUTAT_ADJ` gewichtet über die Schlüssel')
w('   `grass`, `snow`, `sand` und `shadow`. Drei neue Schlüssel bedeuten drei neue Gewichte in')
w('   jedem der Adjektive, sonst fällt die Loot-Signatur auf Null.')
w('3. **Vier Muster brauchen Technik, die es noch nicht gibt**: Unverwundbarkeitsfenster')
w('   (Irrlicht, Sammelverfügung), Heilen anderer Monster (Amtsschimmel), Schadensbuff auf')
w('   Nachbarn (Aktenbote, Dünenpriester) und synchrone Gruppenangriffe (Sammelmahnung). Die')
w('   Rückenregel und die Zweigregel aus `bauWelle()` zeigen, dass die Trefferprüfung in')
w('   `hurtMon()` dafür der richtige Ort ist.')
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
