## Monsterkatalog, Sollstufe 1 bis 10: 25 Gegner in 6 Biomen — ERLEDIGT (eingebaut mit M1, erweitert mit M3)

Inhaltslieferung zu Kapitel 3 (Geographie) und Kapitel 6 (Bestiarium) der
`superduper-weltbibel.md`, eingebaut in `index.html`. 25 Gegner, 6 Biome, vier
Ertragsklassen, feste Werte. Der Katalog sagt, welche Zahl ein Gegner trägt und warum, und
er rechnet den Grund mit. Autorität für Welt, Namen und Ton bleibt die Weltbibel.

**Der Katalog liegt auf dem Bestiarium, er ersetzt es nicht.** 12 der 25 Einträge sind
Monster, die es im Spiel schon gab: sie behalten Namen, Vorgangsart und Rig und haben nur
gerechnete Werte bekommen. Zehn sind neu. Kein Monster ist verschwunden, und die beiden
Bänder, die der Auftrag nicht nannte (Eisablage und Ablage V), sind unangetastet geblieben.

**Erzeugt von** `tools/monsterkatalog.py`. Das Skript rechnet jede Zahl aus der Rechenbasis
und prüft alle harten Invarianten. Von Hand geändert wird hier nichts, geändert wird das
Skript. Im Spiel prüft `monsterAssert()` dieselben Bänder ein zweites Mal, dort aber gegen
die echten Formeln aus `recalc()` statt gegen eine Abschrift davon.

**Formregeln, unverändert aus Kapitel 13:** keine Gedankenstriche im Fließtext, keine Emojis,
kurze Sätze. Die Markierung in der Überschrift folgt der Repo-Regel aus der README und ist
kein Fließtext.

Zwei Vorgaben waren im Auftrag offen und sind hier gesetzt, weil ohne sie nichts zu rechnen
ist: **N = 25 Gegner** und **X = Sollstufe 10**. 6 Biome zu drei bis fünf Gegnern, jedes
mit allen vier Ertragsklassen.

## 1. Rechenbasis

### 1.1 Referenzspieler

Die Referenzwerte sind nicht gesetzt, sondern aus `index.html` abgeleitet, damit der Katalog
gegen das Spiel rechnet und nicht gegen eine Fantasie. Quellen sind `recalc()`, `hurtPlayer()`,
`drinkPotion()` und `gainXP()`.

Angenommener Referenzbuild: je Stufenaufstieg ein Punkt in Kraft und ein Punkt in Zähigkeit,
kein Punkt in Amtskunde. Ausrüstung im üblichen Fundfenster der Stufe, keine Kesselwirkungen,
keine Flüche.

Seit Bauabschnitt S1 (`phase-s1-befaehigung.md`) ist dieser Build keine Nebenannahme mehr,
sondern die Voraussetzung. Die Stufe schenkt fast nichts (2 Leben, 2 Mana), das Meiste hängt
am Punkt (27 Leben, 22 Mana, 3 bis 5 Schaden). Für genau diesen Referenzspieler bleiben die
Bänder unverändert; wer nicht steigert, liegt weit darunter und ist von diesem Katalog nicht
gedeckt. Das ist Absicht und der ganze Zweck von S1.

```
maxHp     = 63 + (Stufe-1)*2 + ZÄH*27                      (recalc)
dmgAvg    = (Waffe_min + Waffe_max)/2 + KRAFT*4,0 + Affix  (recalc)
DPS       = dmgAvg * 1,175 * Angriffe je Sekunde           (Crit 25 % zu Faktor 1,7)
Minderung = Rüstung/(Rüstung+30), gedeckelt bei 0,6        (hurtPlayer)
Trank     = 60 Leben je Fläschchen                         (drinkPotion)
```

Referenzklinge ist das Kurzschwert aus `BASES`, seit S1 mit 3 bis 6 Grundschaden statt 5 bis 9.

| Sollstufe | Spieler-HP | Rüstung | Minderung | Spieler-DPS | Heilung je Minute |
|---|---|---|---|---|---|
| 1 | 63 | 0 | 0,00 | 9,9 | 60 |
| 2 | 92 | 3 | 0,09 | 16,0 | 60 |
| 3 | 121 | 5 | 0,14 | 22,1 | 60 |
| 4 | 150 | 10 | 0,25 | 32,8 | 90 |
| 5 | 179 | 10 | 0,25 | 39,0 | 90 |
| 6 | 208 | 13 | 0,30 | 45,1 | 90 |
| 7 | 237 | 13 | 0,30 | 51,2 | 90 |
| 8 | 266 | 17 | 0,36 | 61,9 | 120 |
| 9 | 295 | 17 | 0,36 | 68,0 | 120 |
| 10 | 324 | 20 | 0,40 | 74,1 | 120 |

Heilung je Minute ist die Felddauerleistung, nicht der Vorrat: ein Fläschchen je Minute bis
Sollstufe 3, anderthalb bis Sollstufe 7, zwei ab Sollstufe 8. Tränke sind damit Teil der
Rechnung, aber kein Gegner braucht sie (siehe 3.4).

### 1.2 Zauberleistung

Mana entsteht seit Z2 nicht mehr beim Warten, sondern bei der Arbeit: 2 je Sekunde passiv plus
4 je Waffenschwung, bei 1,3 Schwüngen je Sekunde also 7,2 je Kampfsekunde. Seit S1 kostet der
Funke 12 Mana für 20 Schaden statt 5 für 16. Die Dauerleistung eines Zauberers ist damit
manabegrenzt, stufenunabhängig und knapp halb so groß wie vor S1:

```
Zauber-DPS (Dauer)  = 7,2/12,0 * 20,0 = 12,0   (vor S1: 23,04, vor Z2: 25,6)
Zauber-DPS (Fenster) ~ 43,0        solange der Manapool reicht
```

Das ist der Grund, warum Resistenz-Gates in diesem Katalog nie an reiner Zahlengröße hängen:
ein Gate verschiebt den Spieler von rund 74 DPS auf 12 DPS, und das allein ist schon Faktor 6.
Weil die Zauberleistung mit S1 gefallen ist, sind die drei Gegner mit Zauber-Sollroute im
selben Verhältnis leichter geworden und zugleich dicker gegen die Waffe: der Abstand zwischen
Sollroute und Waffenroute ist derselbe geblieben (Moorbescheid 2,0-fach, Steingolem 4,9-fach,
Sammelverfügung 1,45-fach).

### 1.3 Formeln des Katalogs

```
EHP             = HP / (1 - Resistenz)          negative Resistenz = Verwundbarkeit
TTK             = EHP(Sollroute) / DPS(Sollroute)
Eingehender DPS = Schaden je Treffer * (1 - Minderung) / Angriffsintervall
Gefahrenbudget  = Spieler-HP / (eingehender DPS - Heilung je Minute / 60)
XP              = TTK * Klassenfaktor * Basisrate(Sollstufe)
Basisrate(L)    = 5 * L^0,6      XP je effektiver Kampfsekunde für A1
Gold            = 4 * L^0,9 * Klassenfaktor Gold,  Obergrenze das 2,1fache
```

Klassenfaktor XP: A1 = 1,0 · A2 = 1,4 · A3 = 2,0 · A4 = 2,6. Klassenfaktor Gold:
A1 = 1,0 · A2 = 2,2 · A3 = 3,2 · A4 = 5,0.

Die Basisrate ist am ausgelieferten Spiel geeicht: der Chuchu gibt dort 10 XP und stirbt auf
Sollstufe 1 in rund zwei Sekunden, das sind die 5 XP je Kampfsekunde. Der Exponent 0,6 wächst
bewusst langsamer als die Stufenkurve `35 * Stufe^1,35`, damit späte Stufen nicht billiger
werden als frühe.

### 1.4 Konventionen, die im Katalog gelten

1. **Sonderangriffe ersetzen den Grundtreffer, sie kommen nicht obendrauf.** Deshalb genügt
   ein Wertepaar aus `schaden_pro_treffer` und `angriffsintervall_s`, um das Gefahrenbudget
   ehrlich zu rechnen. Ein Gegner wird gefährlicher, indem sein Muster schwerer zu lesen ist,
   nicht indem heimlich eine zweite Schadensquelle mitläuft.
2. **Das Gefahrenbudget gilt je Gegner.** Für Schwarmtypen ist der Rudelwert zusätzlich
   ausgewiesen. Er darf unter dem Klassenband liegen, denn der Schwarm ist der
   Anforderungstyp, nicht die Ertragsklasse.
3. **Gift ist derzeit einseitig.** Der Spieler hat keine Giftquelle, weder Waffe noch Zauber.
   Gift steht deshalb nur als Widerstand in den Tabellen, nie als Weichstelle eines Gates, und
   giftfarbene Angriffe sperren Heilung, statt Schaden über Zeit zu ticken.
4. **Gates sind stark resistent, nicht unbesiegbar.** Die Nebenroute darf zwei bis drei Mal so
   lange dauern, sie darf nie unmöglich sein. Zwei Gates weichen davon bewusst ab, beide in
   3.3 nachgerechnet: der Steingolem der Bestandskraft steht mit 0,9 gegen physisch praktisch
   außerhalb des Nahkampfs, ist dafür aber gegen alle drei Zauberschulen offen. Und der
   Papierstaub-Skarabäus kostet auf Feuer das Viereinhalbfache, weil genau das die Falle
   seines Bioms ist: Stahl und Eis bleiben bei ihm beide unter drei Sekunden.
5. **Keine Levelskalierung.** Jeder Wert im Katalog ist fest. Ein Gegner der Sollstufe 4 bleibt
   auf Sollstufe 9 derselbe Gegner, nur langweiliger, und genau das ist die Bremse für Fleiß.

### 1.5 Ortsbindung und Loot-Signatur

Fünf Biome, je drei bis fünf Gegner, je alle vier Ertragsklassen. Vier davon sind Bänder auf
der Karte, das fünfte liegt hinter jeder Kammertür. Wer ein bestimmtes Ausrüstungsteil bauen
will, hat keine Wahl, wohin er geht:

| Biom | Amtlicher Name | Wo | Signatur in einem Satz | Sollstufen |
|---|---|---|---|---|
| Wald | Ablage A | Band um das Dorf, Zeile 128 bis 191 | Der Wald gibt Stiefel und Schilde, und seine Adjektive zeigen auf Tempo und Verlangsamung. | 1 bis 3 |
| Sumpf | Die Nassablage | Band südlich davon, 192 bis 239 | Im Sumpf liegen Rüstungszutaten mit feuchten Adjektiven, also alles für Selbstheilung und Abweisung. | 3 bis 5 |
| Wüste | Der Brandabschnitt | Band ganz im Süden, 240 bis 319 | Der Brandabschnitt liefert Waffenzutaten mit glühenden Adjektiven, also Nachdruck und Wucht, und legt jedem Fund einen teuren Fluch bei. | 4 bis 7 |
| Höhle | Die Untere Registratur | hinter jeder Kammertür, kein Band | Unter Tage fällt, was Panzerung und Aktenlage trägt, und nur dort. | 6 bis 9 |
| Stollen | Die Sperrablage | hinter der teuersten Kammertür, kein Band | Eine Ebene unter der Registratur liegt, was niemand mehr anfassen sollte, und zahlt es in Rüstung und Waffe. | 9 bis 10 |
| Ruine | Der Altbestand | Band ganz im Norden, 0 bis 63 | Der Altbestand ist die Quelle für Manafluss, Zauberkraft und Aktenkunde, und zahlt sie mit den härtesten Gegnern des Katalogs. | 8 bis 10 |

Die Signatur steckt nicht im Substantiv, sondern im Adjektiv: das Substantiv einer Zutat
bestimmt den Ausrüstungs-Slot, das Adjektiv die Wirkung, und die Adjektiv-Gewichte in
`ZUTAT_ADJ` sind je Biom verschieden. Deshalb ist die Untere Registratur ein eigener Fundort,
obwohl ihre Kammern in allen Bändern liegen: `zutatBiome()` gibt dort `hoehle` zurück, nicht
das Band der Tür.

Zwischen Wald und Altbestand liegt weiterhin die Eisablage. Sie steht nicht im Auftrag und
behält Werte und Verhalten von vorher. Das ist kein Rest, sondern die Vergleichsprobe: dort
sieht man im selben Spiel, wie sich Kämpfe ohne Katalogwerte anfühlen.

### 1.6 Besetzung der Achsen

| Ertragsklasse | Gegner | Anforderungstypen |
|---|---|---|
| A1 Fleiß | 7 | B1, B5, B6, B7 |
| A2 Geduld | 6 | B2, B5, B7 |
| A3 Risiko | 7 | B1, B2, B3, B4, B6, B7 |
| A4 Meisterschaft | 5 | B2, B3, B4, B5, B6 |

| Anforderungstyp | kommt vor in |
|---|---|
| B1 Schwarm | A1, A3 |
| B2 Schadensschwamm | A2, A3, A4 |
| B3 Glaskanone | A3, A4 |
| B4 Kiter | A3, A4 |
| B5 Resistenz-Gate | A1, A2, A4 |
| B6 Unterstützer | A1, A3, A4 |
| B7 Hinterhalt | A1, A2, A3 |

Kein Anforderungstyp gehört einer einzigen Ertragsklasse. Der Papierstaub-Skarabäus ist
ausdrücklich A1 und trotzdem ein Resistenz-Gate: billig, schnell, häufig, und trotzdem eine
Frage, die man beantworten muss.

### 1.7 Vorgangsart je Gegner

Kapitel 6 der Weltbibel hat dazu eine Regel: erst die Vorgangsart erfinden, dann das Monster,
nie umgekehrt. Wer eine Vorgangsart nicht in einem Satz erklären kann, hat kein Monster.
12 der 25 tragen eine Vorgangsart, die schon im Bestiarium steht, 13 sind neu.

| Gegner | Vorgangsart | Warum es sich so verhält | Im Bestiarium |
|---|---|---|---|
| Chuchu | Der Formfehler | Ausgelaufene Tinte, formlos im Wortsinn. Sie will nichts von dir außer einer Unterschrift, notfalls mit Gewalt. | bekannt |
| Grünhaut | Die Beschwerde | Laut, kurz, zahlreich, und im Grunde hat sie recht. Das macht es nicht angenehmer. | bekannt |
| Wandelnder Ablagestapel | Der Posteingang | Zwölf Jahre unbearbeiteter Posteingang, jetzt mit Beinen. Feuer wäre gnädig, für beide Seiten. | neu |
| Waldschamane | Der Widerspruch | Er greift aus der Entfernung an, weil ein Widerspruch schriftlich erhoben wird. Der Bolzen ist die Anlage zum Schreiben. | bekannt |
| Der Zustellbote | Der Zustellversuch | Er war da. Du warst leider nicht da, wo er war. Der Zettel im Baum sagt, du sollst es beim Amt versuchen. | neu |
| Blubberakte | Der Rücklauf | Was einmal untergegangen ist, kommt wieder hoch, sobald jemand am Ufer steht. Noch immer nass, noch immer unbearbeitet. | neu |
| Der Moorbescheid | Der durchweichte Bescheid | Unlesbar geworden und trotzdem in Kraft. Lesbarkeit ist keine Wirksamkeitsvoraussetzung. | neu |
| Der Amtsschimmel | Die Fristverlängerung | Er entscheidet nichts, er verlängert. Alles, was er anschaut, bekommt eine neue Frist und dadurch neue Gesundheit. | neu |
| Der Fristläufer | Die Fristsetzung | Er setzt Fristen, die niemand beantragt hat, und ist weg, bevor jemand widersprechen kann. Sehr amtlich. | neu |
| Papierstaub-Skarabäus | Die Aktenvernichtung | Er lebt von dem, was nach dem Brand uebrig blieb, und ist gegen Feuer deshalb gleichgueltig. Im Brandabschnitt ist das eine Karriere. | neu |
| Klippkrabbe | Die Aktenklammer | Zwei Zangen, hält alles zusammen, geht nicht wieder ab. Was geklammert ist, ist geklammert, da hilft keine Beschwoerung. | bekannt |
| Sandskorpion | Die Nachforderung | Kommt schnell, kommt hinterher, sticht genau einmal. Der erste Bescheid war zu niedrig, sagt er, und stellt das sofort richtig. | bekannt |
| Dünenpriester | Die Verfügung | Er ordnet aus sicherer Entfernung an, dass andere es tun. Sein Stab hat mehr Dienstjahre als das Amt. | bekannt |
| Fledermaus | Der Umlauf | Kreist, landet nie, kommt bei jedem einmal vorbei. Was in der Mappe ist, weiß seit Jahren niemand mehr. | bekannt |
| Höhlenspinne | Der Querverweis | Spinnt Faeden zwischen Dingen, die nichts miteinander zu tun haben, und wartet darüber auf jemanden, der zuständig ist. | bekannt |
| Die Sammelmahnung | Die Mahnstufe | Dieselbe Sache, dreimal, gleichlautend. Einzeln sind sie Papier, zu dritt sind sie ein Vollstreckungstitel. | neu |
| Irrlichtmagier | Die Fußnote | Leuchtet, verweist, fuehrt nirgendwohin. Wer ihm folgt, steht am Ende vor einer weiteren Fußnote. | bekannt |
| Steingolem | Die Bestandskraft | Eine Entscheidung, gegen die kein Rechtsmittel mehr geht. Ein Schwert ist keines, Magie schon. | bekannt |
| Der Dienstweg | Der Dienstweg | Nimmt den laengstmoeglichen Weg, kommt an, ist nicht zu beschleunigen. Wer ihn abkuerzen will, faengt von vorne an. | neu |
| Der Teilbescheid | Der Teilbescheid | Was nach der Teilabhilfe uebrig bleibt. Einzeln kaum der Rede wert, und genau deshalb kommen sie zu viert. | neu |
| Die Teilabhilfe | Die Teilabhilfe | Man hilft ihr teilweise ab, und was uebrig bleibt, läuft als eigener Vorgang weiter. Zweimal. | neu |
| Der Aktenbote | Der Zuschlag | Er trägt nichts Eigenes bei außer der Mitteilung, dass ab jetzt alle härter zuschlagen dürfen. Daran hält sich hier jeder. | neu |
| Mumie | Die versiegelte Akte | Banderole drum, Siegel drauf, nie geöffnet. Ein Siegel ist genau dazu da, dass niemand von aussen hineinwirkt, auch nicht mit Feuer. | bekannt |
| Knochenritter | Die Dienstvorschrift | Reine Form, bewaffnet, korrekt, unbeirrbar. Er hält sich auch beim Töten an die Reihenfolge, und die Pause ist dein Rechtsmittel. | bekannt |
| Die Sammelverfügung | Der Sammelbescheid | Alles, was je gegen dich lief, zusammengefasst und in einem Mantel aus Papier vorgetragen. Papier. | neu |

## 2. JSON-Katalog

```json
[
  {
    "id": "slime",
    "name": "Chuchu",
    "biom": "Wald",
    "sollstufe": 1,
    "ertragsklasse": "A1",
    "anforderungstyp": [
      "B1"
    ],
    "hp": 20,
    "resistenzen": {
      "physisch": 0,
      "feuer": -0.25,
      "eis": 0,
      "gift": 0.2,
      "magie": 0
    },
    "schaden_pro_treffer": 3,
    "angriffsintervall_s": 1.2,
    "tempo": 38,
    "angriffsmuster": [
      {
        "name": "Anlehnen",
        "vorwarnzeit_ms": 300,
        "reichweite": "nah (26)",
        "effekt": "Grundtreffer, schiebt leicht zurück"
      },
      {
        "name": "Formfehler abgeben",
        "vorwarnzeit_ms": 350,
        "reichweite": "nah (30)",
        "effekt": "ersetzt jeden vierten Grundtreffer, breiter Klecks statt Stoss"
      }
    ],
    "berechnete_ttk_s": 2.0,
    "xp": 10,
    "gold_min": 4,
    "gold_max": 8,
    "loot": [
      {
        "item": "Chuchu-Gallert",
        "chance": 0.35
      },
      {
        "item": "Kupfermünzen",
        "chance": 0.6
      }
    ],
    "konter_in_einem_satz": "Einfach draufhalten, aber nie stehen bleiben, wo drei von ihnen zusammenlaufen.",
    "flavor_de": "Ausgelaufene Tinte, formlos im Wortsinn. Sie will nichts von dir außer einer Unterschrift, notfalls mit Gewalt."
  },
  {
    "id": "goblin",
    "name": "Grünhaut",
    "biom": "Wald",
    "sollstufe": 2,
    "ertragsklasse": "A1",
    "anforderungstyp": [
      "B7"
    ],
    "hp": 42,
    "resistenzen": {
      "physisch": 0,
      "feuer": -0.2,
      "eis": 0.1,
      "gift": 0,
      "magie": 0.1
    },
    "schaden_pro_treffer": 4,
    "angriffsintervall_s": 0.9,
    "tempo": 78,
    "angriffsmuster": [
      {
        "name": "Lautstark vortragen",
        "vorwarnzeit_ms": 280,
        "reichweite": "nah (26)",
        "effekt": "Grundtreffer, schnell und ungeduldig"
      },
      {
        "name": "Aus dem hohen Gras",
        "vorwarnzeit_ms": 420,
        "reichweite": "nah (34)",
        "effekt": "Eröffnung aus der Deckung, doppelte Wucht auf den ersten Treffer"
      }
    ],
    "berechnete_ttk_s": 2.6,
    "xp": 20,
    "gold_min": 7,
    "gold_max": 15,
    "loot": [
      {
        "item": "Goblin-Zeh",
        "chance": 0.35
      },
      {
        "item": "Beschwerdeschrift",
        "chance": 0.2
      }
    ],
    "konter_in_einem_satz": "Hohes Gras nicht blind durchqueren, wer sie kommen sieht, hat schon gewonnen.",
    "flavor_de": "Laut, kurz, zahlreich, und im Grunde hat sie recht. Das macht es nicht angenehmer."
  },
  {
    "id": "ablagestapel",
    "name": "Wandelnder Ablagestapel",
    "biom": "Wald",
    "sollstufe": 2,
    "ertragsklasse": "A2",
    "anforderungstyp": [
      "B2"
    ],
    "hp": 105,
    "resistenzen": {
      "physisch": 0.35,
      "feuer": -0.4,
      "eis": 0.1,
      "gift": 0.3,
      "magie": 0
    },
    "schaden_pro_treffer": 9,
    "angriffsintervall_s": 1.6,
    "tempo": 32,
    "angriffsmuster": [
      {
        "name": "Umkippen",
        "vorwarnzeit_ms": 420,
        "reichweite": "nah (30)",
        "effekt": "Grundtreffer, danach 0,6 s wehrlos am Boden"
      },
      {
        "name": "Loseblattlawine",
        "vorwarnzeit_ms": 600,
        "reichweite": "Kegel (90)",
        "effekt": "ersetzt jeden dritten Grundtreffer, trifft breit statt hart"
      }
    ],
    "berechnete_ttk_s": 10.1,
    "xp": 107,
    "gold_min": 16,
    "gold_max": 34,
    "loot": [
      {
        "item": "Loseblattbündel",
        "chance": 0.35
      },
      {
        "item": "Chuchu-Gallert",
        "chance": 0.15
      }
    ],
    "konter_in_einem_satz": "Von der Seite schlagen und die 0,6 s nach dem Umkippen zum Nachsetzen nutzen.",
    "flavor_de": "Zwölf Jahre unbearbeiteter Posteingang, jetzt mit Beinen. Feuer wäre gnädig, für beide Seiten."
  },
  {
    "id": "greenmage",
    "name": "Waldschamane",
    "biom": "Wald",
    "sollstufe": 3,
    "ertragsklasse": "A3",
    "anforderungstyp": [
      "B3"
    ],
    "hp": 345,
    "resistenzen": {
      "physisch": -0.2,
      "feuer": 0,
      "eis": 0,
      "gift": 0.2,
      "magie": 0.4
    },
    "schaden_pro_treffer": 30,
    "angriffsintervall_s": 1.9,
    "tempo": 44,
    "angriffsmuster": [
      {
        "name": "Widerspruchsbolzen",
        "vorwarnzeit_ms": 420,
        "reichweite": "fern (130)",
        "effekt": "Bolzen, der Stab leuchtet vorher sichtbar auf"
      },
      {
        "name": "Anlage zum Schreiben",
        "vorwarnzeit_ms": 520,
        "reichweite": "fern (130)",
        "effekt": "ersetzt jeden dritten Bolzen, laengere Ansage, dafür schwerer"
      }
    ],
    "berechnete_ttk_s": 13.0,
    "xp": 251,
    "gold_min": 34,
    "gold_max": 71,
    "loot": [
      {
        "item": "Schamanenbart",
        "chance": 0.4
      },
      {
        "item": "Widerspruchsformular",
        "chance": 0.2
      }
    ],
    "konter_in_einem_satz": "Sofort die Distanz schließen, im Nahkampf ist er aus Papier.",
    "flavor_de": "Er greift aus der Entfernung an, weil ein Widerspruch schriftlich erhoben wird. Der Bolzen ist die Anlage zum Schreiben."
  },
  {
    "id": "zustellbote",
    "name": "Der Zustellbote",
    "biom": "Wald",
    "sollstufe": 3,
    "ertragsklasse": "A4",
    "anforderungstyp": [
      "B4"
    ],
    "hp": 270,
    "resistenzen": {
      "physisch": 0.55,
      "feuer": 0.2,
      "eis": -0.3,
      "gift": 0,
      "magie": 0.2
    },
    "schaden_pro_treffer": 36,
    "angriffsintervall_s": 1.1,
    "tempo": 126,
    "angriffsmuster": [
      {
        "name": "Zustellversuch",
        "vorwarnzeit_ms": 380,
        "reichweite": "nah (26)",
        "effekt": "Antippen im Vorbeilaufen, danach sofort wieder Abstand"
      },
      {
        "name": "Abgabefenster",
        "vorwarnzeit_ms": 700,
        "reichweite": "nah (34)",
        "effekt": "alle 6 s bleibt er 1,4 s stehen und quittiert, in dieser Zeit fällt jede Resistenz auf 0"
      }
    ],
    "berechnete_ttk_s": 27.1,
    "xp": 682,
    "gold_min": 54,
    "gold_max": 113,
    "loot": [
      {
        "item": "Botensohle",
        "chance": 0.3
      },
      {
        "item": "Benachrichtigungszettel",
        "chance": 0.45
      }
    ],
    "konter_in_einem_satz": "Nicht hinterherlaufen, sondern das Abgabefenster abwarten und dort allen Schaden hineinlegen.",
    "flavor_de": "Er war da. Du warst leider nicht da, wo er war. Der Zettel im Baum sagt, du sollst es beim Amt versuchen."
  },
  {
    "id": "blubberakte",
    "name": "Blubberakte",
    "biom": "Sumpf",
    "sollstufe": 3,
    "ertragsklasse": "A1",
    "anforderungstyp": [
      "B1",
      "B7"
    ],
    "hp": 53,
    "resistenzen": {
      "physisch": 0,
      "feuer": -0.3,
      "eis": 0.1,
      "gift": 0.8,
      "magie": 0
    },
    "schaden_pro_treffer": 6,
    "angriffsintervall_s": 1.3,
    "tempo": 46,
    "angriffsmuster": [
      {
        "name": "Schmatzen",
        "vorwarnzeit_ms": 300,
        "reichweite": "nah (24)",
        "effekt": "Grundtreffer, verlangsamt kurz um die Haelfte"
      },
      {
        "name": "Auftauchen",
        "vorwarnzeit_ms": 400,
        "reichweite": "nah (28)",
        "effekt": "Blasen an der Oberfläche sind die Vorwarnung, dann der Erstschlag"
      }
    ],
    "berechnete_ttk_s": 2.4,
    "xp": 23,
    "gold_min": 11,
    "gold_max": 23,
    "loot": [
      {
        "item": "Sumpfgallert",
        "chance": 0.35
      },
      {
        "item": "Aufgeweichtes Blatt",
        "chance": 0.25
      }
    ],
    "konter_in_einem_satz": "Auf die Blasen achten und nicht über offenes Wasser laufen, dann kommen sie einzeln.",
    "flavor_de": "Was einmal untergegangen ist, kommt wieder hoch, sobald jemand am Ufer steht. Noch immer nass, noch immer unbearbeitet."
  },
  {
    "id": "moorbescheid",
    "name": "Der Moorbescheid",
    "biom": "Sumpf",
    "sollstufe": 4,
    "ertragsklasse": "A2",
    "anforderungstyp": [
      "B5"
    ],
    "hp": 180,
    "resistenzen": {
      "physisch": 0.73,
      "feuer": -0.5,
      "eis": 0.15,
      "gift": 0.9,
      "magie": 0.15
    },
    "schaden_pro_treffer": 20,
    "angriffsintervall_s": 2.0,
    "tempo": 26,
    "angriffsmuster": [
      {
        "name": "Durchweichen",
        "vorwarnzeit_ms": 450,
        "reichweite": "nah (30)",
        "effekt": "schwerer, langsamer Grundtreffer"
      },
      {
        "name": "Faulgasstoß",
        "vorwarnzeit_ms": 550,
        "reichweite": "Kegel (70)",
        "effekt": "ersetzt jeden dritten Grundtreffer, sperrt 4 s lang die Trankwirkung"
      }
    ],
    "berechnete_ttk_s": 10.0,
    "xp": 161,
    "gold_min": 31,
    "gold_max": 65,
    "loot": [
      {
        "item": "Moorbinde",
        "chance": 0.4
      },
      {
        "item": "Versiegelte Zweitschrift",
        "chance": 0.15
      }
    ],
    "konter_in_einem_satz": "Anzünden. Nass gewordenes Papier hält Stahl aus, aber keine Flamme.",
    "flavor_de": "Unlesbar geworden und trotzdem in Kraft. Lesbarkeit ist keine Wirksamkeitsvoraussetzung."
  },
  {
    "id": "amtsschimmel",
    "name": "Der Amtsschimmel",
    "biom": "Sumpf",
    "sollstufe": 5,
    "ertragsklasse": "A3",
    "anforderungstyp": [
      "B4",
      "B6"
    ],
    "hp": 550,
    "resistenzen": {
      "physisch": 0.15,
      "feuer": -0.3,
      "eis": 0.1,
      "gift": 0.5,
      "magie": 0.3
    },
    "schaden_pro_treffer": 77,
    "angriffsintervall_s": 1.8,
    "tempo": 118,
    "angriffsmuster": [
      {
        "name": "Ausweichschritt",
        "vorwarnzeit_ms": 350,
        "reichweite": "nah (28)",
        "effekt": "Grundtreffer im Zurückweichen, er bleibt nie stehen"
      },
      {
        "name": "Wiedervorlage",
        "vorwarnzeit_ms": 500,
        "reichweite": "fern (150)",
        "effekt": "heilt jeden dritten Takt einen Nachbarn um 12 Prozent und steht dabei 1,2 s offen"
      }
    ],
    "berechnete_ttk_s": 16.6,
    "xp": 436,
    "gold_min": 54,
    "gold_max": 113,
    "loot": [
      {
        "item": "Schimmelquaste",
        "chance": 0.45
      },
      {
        "item": "Wiedervorlagemappe",
        "chance": 0.2
      }
    ],
    "konter_in_einem_satz": "Zuerst ihn, nicht die Geheilten, und ihn nur an der Wand oder im Wasser stellen.",
    "flavor_de": "Er entscheidet nichts, er verlängert. Alles, was er anschaut, bekommt eine neue Frist und dadurch neue Gesundheit."
  },
  {
    "id": "fristlaeufer",
    "name": "Der Fristläufer",
    "biom": "Sumpf",
    "sollstufe": 5,
    "ertragsklasse": "A4",
    "anforderungstyp": [
      "B3",
      "B4"
    ],
    "hp": 470,
    "resistenzen": {
      "physisch": 0.5,
      "feuer": 0.3,
      "eis": -0.35,
      "gift": 0.4,
      "magie": 0.1
    },
    "schaden_pro_treffer": 176,
    "angriffsintervall_s": 2.0,
    "tempo": 132,
    "angriffsmuster": [
      {
        "name": "Fristablauf",
        "vorwarnzeit_ms": 650,
        "reichweite": "fern (170)",
        "effekt": "schwerer Fernschlag, der Countdown über dem Kopf ist die Vorwarnung"
      },
      {
        "name": "Verwehen",
        "vorwarnzeit_ms": 400,
        "reichweite": "kein Schaden",
        "effekt": "jeder dritte Takt: 1,2 s unverwundbar, danach 2 s offen"
      }
    ],
    "berechnete_ttk_s": 24.1,
    "xp": 823,
    "gold_min": 85,
    "gold_max": 178,
    "loot": [
      {
        "item": "Fristfunke",
        "chance": 0.4
      },
      {
        "item": "Fristsetzungsbescheid",
        "chance": 0.3
      }
    ],
    "konter_in_einem_satz": "Schlagen, sobald das Verwehen endet, und in der Fristablauf-Vorwarnung seitlich heraus.",
    "flavor_de": "Er setzt Fristen, die niemand beantragt hat, und ist weg, bevor jemand widersprechen kann. Sehr amtlich."
  },
  {
    "id": "skarabaeus",
    "name": "Papierstaub-Skarabäus",
    "biom": "Wüste",
    "sollstufe": 4,
    "ertragsklasse": "A1",
    "anforderungstyp": [
      "B5"
    ],
    "hp": 41,
    "resistenzen": {
      "physisch": 0.5,
      "feuer": 0.85,
      "eis": -0.4,
      "gift": 0.3,
      "magie": 0
    },
    "schaden_pro_treffer": 7,
    "angriffsintervall_s": 1.0,
    "tempo": 92,
    "angriffsmuster": [
      {
        "name": "Anrempeln",
        "vorwarnzeit_ms": 300,
        "reichweite": "nah (22)",
        "effekt": "Grundtreffer im Vorbeihuschen"
      },
      {
        "name": "Staubwolke",
        "vorwarnzeit_ms": 400,
        "reichweite": "nah (40)",
        "effekt": "ersetzt jeden vierten Grundtreffer, nimmt 1 s lang Sicht statt Leben"
      }
    ],
    "berechnete_ttk_s": 2.5,
    "xp": 29,
    "gold_min": 14,
    "gold_max": 29,
    "loot": [
      {
        "item": "Panzerspan",
        "chance": 0.35
      },
      {
        "item": "Sandiger Vordruck",
        "chance": 0.25
      }
    ],
    "konter_in_einem_satz": "Eis, notfalls Stahl. Wer hier Feuer wirft, bezahlt zehn Sekunden für nichts.",
    "flavor_de": "Er lebt von dem, was nach dem Brand uebrig blieb, und ist gegen Feuer deshalb gleichgueltig. Im Brandabschnitt ist das eine Karriere."
  },
  {
    "id": "crab",
    "name": "Klippkrabbe",
    "biom": "Wüste",
    "sollstufe": 5,
    "ertragsklasse": "A2",
    "anforderungstyp": [
      "B2",
      "B5"
    ],
    "hp": 560,
    "resistenzen": {
      "physisch": -0.2,
      "feuer": 1.0,
      "eis": 1.0,
      "gift": 0.2,
      "magie": 1.0
    },
    "schaden_pro_treffer": 20,
    "angriffsintervall_s": 1.4,
    "tempo": 36,
    "angriffsmuster": [
      {
        "name": "Klammern",
        "vorwarnzeit_ms": 400,
        "reichweite": "nah (28)",
        "effekt": "Grundtreffer, hält dich 0,5 s fest statt dich wegzustossen"
      },
      {
        "name": "Zangengriff",
        "vorwarnzeit_ms": 550,
        "reichweite": "nah (32)",
        "effekt": "ersetzt jeden dritten Grundtreffer, doppelte Haltezeit, dafür weniger Wucht"
      }
    ],
    "berechnete_ttk_s": 12.0,
    "xp": 220,
    "gold_min": 37,
    "gold_max": 78,
    "loot": [
      {
        "item": "Krabbenschere",
        "chance": 0.4
      },
      {
        "item": "Verkohlte Klammer",
        "chance": 0.2
      }
    ],
    "konter_in_einem_satz": "Die Waffe nehmen, nicht den Stab: Zauber perlen an der Klammer ab, der Panzer dagegen ist muerbe.",
    "flavor_de": "Zwei Zangen, hält alles zusammen, geht nicht wieder ab. Was geklammert ist, ist geklammert, da hilft keine Beschwoerung."
  },
  {
    "id": "scorpion",
    "name": "Sandskorpion",
    "biom": "Wüste",
    "sollstufe": 6,
    "ertragsklasse": "A3",
    "anforderungstyp": [
      "B3"
    ],
    "hp": 650,
    "resistenzen": {
      "physisch": 0.1,
      "feuer": 0.3,
      "eis": 0.1,
      "gift": 0.7,
      "magie": -0.2
    },
    "schaden_pro_treffer": 143,
    "angriffsintervall_s": 2.4,
    "tempo": 96,
    "angriffsmuster": [
      {
        "name": "Nachforderung",
        "vorwarnzeit_ms": 450,
        "reichweite": "nah (28)",
        "effekt": "sehr harter Einzelstich, der Stachel hebt sichtbar an"
      },
      {
        "name": "Zweite Nachforderung",
        "vorwarnzeit_ms": 350,
        "reichweite": "nah (28)",
        "effekt": "folgt nur, wenn der erste Stich getroffen hat, halbe Wucht"
      }
    ],
    "berechnete_ttk_s": 16.0,
    "xp": 469,
    "gold_min": 64,
    "gold_max": 134,
    "loot": [
      {
        "item": "Skorpionstachel",
        "chance": 0.45
      },
      {
        "item": "Nachforderungsbescheid",
        "chance": 0.25
      }
    ],
    "konter_in_einem_satz": "Nach jedem gehobenen Stachel einen Schritt heraus, dann fällt die zweite Nachforderung weg.",
    "flavor_de": "Kommt schnell, kommt hinterher, sticht genau einmal. Der erste Bescheid war zu niedrig, sagt er, und stellt das sofort richtig."
  },
  {
    "id": "sandmage",
    "name": "Dünenpriester",
    "biom": "Wüste",
    "sollstufe": 7,
    "ertragsklasse": "A4",
    "anforderungstyp": [
      "B4",
      "B6"
    ],
    "hp": 840,
    "resistenzen": {
      "physisch": 0.45,
      "feuer": 0.5,
      "eis": -0.3,
      "gift": 0.2,
      "magie": 0.2
    },
    "schaden_pro_treffer": 233,
    "angriffsintervall_s": 2.0,
    "tempo": 104,
    "angriffsmuster": [
      {
        "name": "Sandwurf",
        "vorwarnzeit_ms": 400,
        "reichweite": "fern (130)",
        "effekt": "Grundtreffer aus sicherer Entfernung"
      },
      {
        "name": "Verfügung",
        "vorwarnzeit_ms": 900,
        "reichweite": "fern (160)",
        "effekt": "gibt jeden dritten Takt einem Nachbarn 25 Prozent mehr Schaden und steht dabei 2,4 s offen"
      }
    ],
    "berechnete_ttk_s": 29.8,
    "xp": 1246,
    "gold_min": 115,
    "gold_max": 242,
    "loot": [
      {
        "item": "Priesterquaste",
        "chance": 0.45
      },
      {
        "item": "Verfügung in Abschrift",
        "chance": 0.3
      }
    ],
    "konter_in_einem_satz": "Das Verfügungsfenster ist die einzige Gelegenheit, ihn einzuholen, alles andere ist Hinterherlaufen.",
    "flavor_de": "Er ordnet aus sicherer Entfernung an, dass andere es tun. Sein Stab hat mehr Dienstjahre als das Amt."
  },
  {
    "id": "bat",
    "name": "Fledermaus",
    "biom": "Höhle",
    "sollstufe": 6,
    "ertragsklasse": "A1",
    "anforderungstyp": [
      "B1"
    ],
    "hp": 90,
    "resistenzen": {
      "physisch": 0,
      "feuer": -0.2,
      "eis": -0.1,
      "gift": 0.3,
      "magie": 0
    },
    "schaden_pro_treffer": 9,
    "angriffsintervall_s": 0.9,
    "tempo": 134,
    "angriffsmuster": [
      {
        "name": "Vorbeiflug",
        "vorwarnzeit_ms": 250,
        "reichweite": "nah (20)",
        "effekt": "Grundtreffer im Durchflug, danach dreht sie sofort ab"
      },
      {
        "name": "Umlaufmappe",
        "vorwarnzeit_ms": 300,
        "reichweite": "nah (20)",
        "effekt": "ersetzt jeden vierten Grundtreffer, hängt dir 1,5 s Sichtbehinderung an"
      }
    ],
    "berechnete_ttk_s": 2.0,
    "xp": 29,
    "gold_min": 20,
    "gold_max": 42,
    "loot": [
      {
        "item": "Fledermausflügel",
        "chance": 0.4
      },
      {
        "item": "Umlaufmappe",
        "chance": 0.2
      }
    ],
    "konter_in_einem_satz": "Breit schlagen statt zielen, der Schwarm fällt an einem einzigen guten Hieb.",
    "flavor_de": "Kreist, landet nie, kommt bei jedem einmal vorbei. Was in der Mappe ist, weiß seit Jahren niemand mehr."
  },
  {
    "id": "spider",
    "name": "Höhlenspinne",
    "biom": "Höhle",
    "sollstufe": 7,
    "ertragsklasse": "A2",
    "anforderungstyp": [
      "B2",
      "B7"
    ],
    "hp": 465,
    "resistenzen": {
      "physisch": 0.3,
      "feuer": -0.3,
      "eis": 0.2,
      "gift": 0.3,
      "magie": 0.15
    },
    "schaden_pro_treffer": 34,
    "angriffsintervall_s": 1.7,
    "tempo": 52,
    "angriffsmuster": [
      {
        "name": "Nachfassen",
        "vorwarnzeit_ms": 400,
        "reichweite": "nah (30)",
        "effekt": "Grundtreffer, zieht dich ein Stück zu sich"
      },
      {
        "name": "Fallenlassen",
        "vorwarnzeit_ms": 550,
        "reichweite": "nah (34)",
        "effekt": "der Schatten am Boden ist die Vorwarnung, Eröffnung mit doppelter Wucht"
      }
    ],
    "berechnete_ttk_s": 13.0,
    "xp": 292,
    "gold_min": 51,
    "gold_max": 107,
    "loot": [
      {
        "item": "Spinnenbein",
        "chance": 0.4
      },
      {
        "item": "Deckenprotokoll",
        "chance": 0.15
      }
    ],
    "konter_in_einem_satz": "Vor dem Betreten nach oben schauen, danach ist sie nur noch langsam und dick.",
    "flavor_de": "Spinnt Faeden zwischen Dingen, die nichts miteinander zu tun haben, und wartet darüber auf jemanden, der zuständig ist."
  },
  {
    "id": "sammelmahnung",
    "name": "Die Sammelmahnung",
    "biom": "Höhle",
    "sollstufe": 8,
    "ertragsklasse": "A3",
    "anforderungstyp": [
      "B1",
      "B3"
    ],
    "hp": 690,
    "resistenzen": {
      "physisch": 0.2,
      "feuer": 0,
      "eis": 0.1,
      "gift": 0.4,
      "magie": -0.3
    },
    "schaden_pro_treffer": 135,
    "angriffsintervall_s": 2.3,
    "tempo": 74,
    "angriffsmuster": [
      {
        "name": "Mahnstufe",
        "vorwarnzeit_ms": 500,
        "reichweite": "nah (30)",
        "effekt": "harter Grundtreffer, jede Mahnung schlägt einzeln und versetzt"
      },
      {
        "name": "Gleichlaut",
        "vorwarnzeit_ms": 600,
        "reichweite": "nah (30)",
        "effekt": "jeder dritte Takt: alle Mahnungen im Umkreis von 120 sagen denselben Schlag an und fuehren ihn gleichzeitig aus"
      }
    ],
    "berechnete_ttk_s": 13.9,
    "xp": 485,
    "gold_min": 83,
    "gold_max": 174,
    "loot": [
      {
        "item": "Mahnsiegel",
        "chance": 0.35
      },
      {
        "item": "Mahnbescheid, dritte Stufe",
        "chance": 0.3
      }
    ],
    "konter_in_einem_satz": "Aufbrechen und einzeln erledigen, ein gleichlautender Dreierschlag kostet die halbe Leiste.",
    "flavor_de": "Dieselbe Sache, dreimal, gleichlautend. Einzeln sind sie Papier, zu dritt sind sie ein Vollstreckungstitel."
  },
  {
    "id": "mage",
    "name": "Irrlichtmagier",
    "biom": "Höhle",
    "sollstufe": 8,
    "ertragsklasse": "A3",
    "anforderungstyp": [
      "B3"
    ],
    "hp": 870,
    "resistenzen": {
      "physisch": -0.15,
      "feuer": 0.2,
      "eis": 0.2,
      "gift": 0.3,
      "magie": 0.5
    },
    "schaden_pro_treffer": 119,
    "angriffsintervall_s": 2.2,
    "tempo": 46,
    "angriffsmuster": [
      {
        "name": "Fußnote",
        "vorwarnzeit_ms": 500,
        "reichweite": "fern (140)",
        "effekt": "Bolzen, der beim Einschlag hell aufleuchtet"
      },
      {
        "name": "Verweis",
        "vorwarnzeit_ms": 380,
        "reichweite": "fern (140)",
        "effekt": "ersetzt jeden dritten Bolzen, schneller angesagt, dafür halbe Wucht"
      }
    ],
    "berechnete_ttk_s": 12.2,
    "xp": 426,
    "gold_min": 83,
    "gold_max": 174,
    "loot": [
      {
        "item": "Irrlicht-Funke",
        "chance": 0.4
      },
      {
        "item": "Randbemerkung",
        "chance": 0.25
      }
    ],
    "konter_in_einem_satz": "Er leuchtet, verweist und hält nichts aus, also hin und zuschlagen.",
    "flavor_de": "Leuchtet, verweist, fuehrt nirgendwohin. Wer ihm folgt, steht am Ende vor einer weiteren Fußnote."
  },
  {
    "id": "golem",
    "name": "Steingolem",
    "biom": "Höhle",
    "sollstufe": 9,
    "ertragsklasse": "A4",
    "anforderungstyp": [
      "B2",
      "B5"
    ],
    "hp": 570,
    "resistenzen": {
      "physisch": 0.95,
      "feuer": 0,
      "eis": 0,
      "gift": 0.6,
      "magie": -0.4
    },
    "schaden_pro_treffer": 249,
    "angriffsintervall_s": 2.6,
    "tempo": 28,
    "angriffsmuster": [
      {
        "name": "Faustschlag",
        "vorwarnzeit_ms": 700,
        "reichweite": "nah (36)",
        "effekt": "sehr schwerer Grundtreffer, der Arm hebt weit sichtbar an"
      },
      {
        "name": "Unanfechtbar",
        "vorwarnzeit_ms": 900,
        "reichweite": "Ring (130)",
        "effekt": "ersetzt jeden dritten Grundtreffer, Druckwelle rundum, danach 3 s Erschöpfung ohne Angriff"
      }
    ],
    "berechnete_ttk_s": 33.9,
    "xp": 1648,
    "gold_min": 144,
    "gold_max": 302,
    "loot": [
      {
        "item": "Golem-Splitter",
        "chance": 0.5
      },
      {
        "item": "Unanfechtbarer Beschluss",
        "chance": 0.12
      }
    ],
    "konter_in_einem_satz": "Stahl prallt ab, also Manapool leeren, in der Erschöpfung nachladen und den Kreislauf fahren, bis er fällt.",
    "flavor_de": "Eine Entscheidung, gegen die kein Rechtsmittel mehr geht. Ein Schwert ist keines, Magie schon."
  },
  {
    "id": "dienstweg",
    "name": "Der Dienstweg",
    "biom": "Stollen",
    "sollstufe": 9,
    "ertragsklasse": "A2",
    "anforderungstyp": [
      "B5",
      "B2"
    ],
    "hp": 180,
    "resistenzen": {
      "physisch": 0.6,
      "feuer": 0,
      "eis": 0.2,
      "gift": 0.35,
      "magie": -0.35
    },
    "schaden_pro_treffer": 48,
    "angriffsintervall_s": 2.4,
    "tempo": 18,
    "angriffsmuster": [
      {
        "name": "Anhoeren",
        "vorwarnzeit_ms": 520,
        "reichweite": "nah (24)",
        "effekt": "Grundtreffer, kommt langsam und kuendigt sich lange an"
      },
      {
        "name": "Ueber den Dienstweg",
        "vorwarnzeit_ms": 650,
        "reichweite": "nah (24)",
        "effekt": "ersetzt jeden dritten Grundtreffer, er zieht sich erst ganz ins Haus zurück und faehrt dann schwerer wieder aus"
      }
    ],
    "berechnete_ttk_s": 11.1,
    "xp": 291,
    "gold_min": 64,
    "gold_max": 134,
    "loot": [
      {
        "item": "Schneckenhaus",
        "chance": 0.4
      },
      {
        "item": "Laufzettel",
        "chance": 0.25
      }
    ],
    "konter_in_einem_satz": "Das Haus hält Stahl aus, der Zauber nicht. Wer kein Mana hat, geht einfach weiter.",
    "flavor_de": "Nimmt den laengstmoeglichen Weg, kommt an, ist nicht zu beschleunigen. Wer ihn abkuerzen will, faengt von vorne an."
  },
  {
    "id": "teilbescheid",
    "name": "Der Teilbescheid",
    "biom": "Stollen",
    "sollstufe": 9,
    "ertragsklasse": "A1",
    "anforderungstyp": [
      "B1"
    ],
    "hp": 145,
    "resistenzen": {
      "physisch": 0.1,
      "feuer": -0.3,
      "eis": 0,
      "gift": 0.25,
      "magie": 0
    },
    "schaden_pro_treffer": 19,
    "angriffsintervall_s": 1.3,
    "tempo": 44,
    "angriffsmuster": [
      {
        "name": "Im Uebrigen",
        "vorwarnzeit_ms": 320,
        "reichweite": "nah (24)",
        "effekt": "Grundtreffer, kurz und ohne Begruendung"
      },
      {
        "name": "Anlage beigefuegt",
        "vorwarnzeit_ms": 380,
        "reichweite": "nah (28)",
        "effekt": "ersetzt jeden vierten Grundtreffer, breiter Klecks statt Stoss"
      }
    ],
    "berechnete_ttk_s": 2.4,
    "xp": 44,
    "gold_min": 29,
    "gold_max": 61,
    "loot": [
      {
        "item": "Teilbescheid-Gallert",
        "chance": 0.35
      },
      {
        "item": "Kupfermünzen",
        "chance": 0.5
      }
    ],
    "konter_in_einem_satz": "Breit schlagen, sie stehen ohnehin zu nah beieinander.",
    "flavor_de": "Was nach der Teilabhilfe uebrig bleibt. Einzeln kaum der Rede wert, und genau deshalb kommen sie zu viert."
  },
  {
    "id": "teilabhilfe",
    "name": "Die Teilabhilfe",
    "biom": "Stollen",
    "sollstufe": 10,
    "ertragsklasse": "A3",
    "anforderungstyp": [
      "B2",
      "B7"
    ],
    "hp": 710,
    "resistenzen": {
      "physisch": 0.4,
      "feuer": -0.3,
      "eis": 0.15,
      "gift": 0.35,
      "magie": 0.1
    },
    "schaden_pro_treffer": 120,
    "angriffsintervall_s": 1.8,
    "tempo": 30,
    "angriffsmuster": [
      {
        "name": "Abhilfe",
        "vorwarnzeit_ms": 560,
        "reichweite": "nah (34)",
        "effekt": "schwerer Grundtreffer, sie wirft ihr ganzes Volumen nach vorn"
      },
      {
        "name": "Im Uebrigen zurueckgewiesen",
        "vorwarnzeit_ms": 700,
        "reichweite": "Kegel (70)",
        "effekt": "ersetzt jeden dritten Grundtreffer, breite Welle, danach 0,8 s wehrlos"
      }
    ],
    "berechnete_ttk_s": 16.0,
    "xp": 636,
    "gold_min": 102,
    "gold_max": 214,
    "loot": [
      {
        "item": "Teilabhilfe-Kern",
        "chance": 0.45
      },
      {
        "item": "Abhilfebescheid",
        "chance": 0.2
      }
    ],
    "konter_in_einem_satz": "Wer ihr abhilft, hat zwei Teilbescheide am Hals. Erst Platz schaffen, dann teilen.",
    "flavor_de": "Man hilft ihr teilweise ab, und was uebrig bleibt, läuft als eigener Vorgang weiter. Zweimal."
  },
  {
    "id": "aktenbote",
    "name": "Der Aktenbote",
    "biom": "Ruine",
    "sollstufe": 8,
    "ertragsklasse": "A1",
    "anforderungstyp": [
      "B1",
      "B6"
    ],
    "hp": 135,
    "resistenzen": {
      "physisch": 0,
      "feuer": -0.2,
      "eis": 0,
      "gift": 0.2,
      "magie": 0.1
    },
    "schaden_pro_treffer": 30,
    "angriffsintervall_s": 1.4,
    "tempo": 88,
    "angriffsmuster": [
      {
        "name": "Aktenkante",
        "vorwarnzeit_ms": 300,
        "reichweite": "nah (24)",
        "effekt": "Grundtreffer, schmal und schnell"
      },
      {
        "name": "Zuschlag",
        "vorwarnzeit_ms": 400,
        "reichweite": "fern (120)",
        "effekt": "gibt jeden dritten Takt einem Nachbarn 25 Prozent mehr Schaden, kein eigener Schaden"
      }
    ],
    "berechnete_ttk_s": 2.2,
    "xp": 38,
    "gold_min": 26,
    "gold_max": 55,
    "loot": [
      {
        "item": "Botenmappe",
        "chance": 0.35
      },
      {
        "item": "Zuschlagsverfügung",
        "chance": 0.25
      }
    ],
    "konter_in_einem_satz": "Zuerst die Boten, dann alles andere, sie sind so weich wie ihr Zuschlag hart ist.",
    "flavor_de": "Er trägt nichts Eigenes bei außer der Mitteilung, dass ab jetzt alle härter zuschlagen dürfen. Daran hält sich hier jeder."
  },
  {
    "id": "mummy",
    "name": "Mumie",
    "biom": "Ruine",
    "sollstufe": 9,
    "ertragsklasse": "A2",
    "anforderungstyp": [
      "B2",
      "B5"
    ],
    "hp": 1190,
    "resistenzen": {
      "physisch": -0.25,
      "feuer": 1.0,
      "eis": 1.0,
      "gift": 0.9,
      "magie": 1.0
    },
    "schaden_pro_treffer": 54,
    "angriffsintervall_s": 2.1,
    "tempo": 26,
    "angriffsmuster": [
      {
        "name": "Verschnüren",
        "vorwarnzeit_ms": 500,
        "reichweite": "nah (30)",
        "effekt": "Grundtreffer, halbiert 2 s lang dein Tempo"
      },
      {
        "name": "Siegelstaub",
        "vorwarnzeit_ms": 600,
        "reichweite": "Kegel (80)",
        "effekt": "ersetzt jeden dritten Grundtreffer, sperrt 5 s lang die Trankwirkung"
      }
    ],
    "berechnete_ttk_s": 14.0,
    "xp": 366,
    "gold_min": 64,
    "gold_max": 134,
    "loot": [
      {
        "item": "Mumienbinde",
        "chance": 0.45
      },
      {
        "item": "Versiegelte Akte",
        "chance": 0.18
      }
    ],
    "konter_in_einem_satz": "Die Klinge an die Binden, kein Zauber kommt durch das Siegel, und während der Siegelstaub-Sperre gar nicht erst auf den Trank hoffen.",
    "flavor_de": "Banderole drum, Siegel drauf, nie geöffnet. Ein Siegel ist genau dazu da, dass niemand von aussen hineinwirkt, auch nicht mit Feuer."
  },
  {
    "id": "stalfos",
    "name": "Knochenritter",
    "biom": "Ruine",
    "sollstufe": 9,
    "ertragsklasse": "A3",
    "anforderungstyp": [
      "B7",
      "B3"
    ],
    "hp": 920,
    "resistenzen": {
      "physisch": 0.25,
      "feuer": 0.1,
      "eis": -0.25,
      "gift": 0.6,
      "magie": 0.1
    },
    "schaden_pro_treffer": 186,
    "angriffsintervall_s": 2.5,
    "tempo": 82,
    "angriffsmuster": [
      {
        "name": "Dienstweg",
        "vorwarnzeit_ms": 450,
        "reichweite": "nah (34)",
        "effekt": "Grundtreffer, immer exakt drei Schläge, dann 1,6 s Pause"
      },
      {
        "name": "Aus der Nische",
        "vorwarnzeit_ms": 600,
        "reichweite": "nah (40)",
        "effekt": "Eröffnung aus der Wand, weit ausholender Bogen"
      }
    ],
    "berechnete_ttk_s": 18.0,
    "xp": 674,
    "gold_min": 92,
    "gold_max": 193,
    "loot": [
      {
        "item": "Skelettknöchel",
        "chance": 0.45
      },
      {
        "item": "Dienstvorschrift, Randfassung",
        "chance": 0.2
      }
    ],
    "konter_in_einem_satz": "Den drei Schlaegen des Dienstwegs ausweichen und in der Pause zuschlagen, er weicht davon nie ab.",
    "flavor_de": "Reine Form, bewaffnet, korrekt, unbeirrbar. Er hält sich auch beim Töten an die Reihenfolge, und die Pause ist dein Rechtsmittel."
  },
  {
    "id": "sammelverfuegung",
    "name": "Die Sammelverfügung",
    "biom": "Ruine",
    "sollstufe": 10,
    "ertragsklasse": "A4",
    "anforderungstyp": [
      "B4",
      "B5"
    ],
    "hp": 580,
    "resistenzen": {
      "physisch": 0.85,
      "feuer": -0.35,
      "eis": 0.45,
      "gift": 0.6,
      "magie": 0.45
    },
    "schaden_pro_treffer": 326,
    "angriffsintervall_s": 2.2,
    "tempo": 112,
    "angriffsmuster": [
      {
        "name": "Zurückverweisen",
        "vorwarnzeit_ms": 400,
        "reichweite": "nah (30)",
        "effekt": "Grundtreffer, stößt dich weit zurück und sie zieht sich nach"
      },
      {
        "name": "Anhörung",
        "vorwarnzeit_ms": 800,
        "reichweite": "fern (180)",
        "effekt": "jeder dritte Takt: schwerer Fernschlag, sie bleibt dafür stehen"
      },
      {
        "name": "Aktenmantel",
        "vorwarnzeit_ms": 500,
        "reichweite": "kein Schaden",
        "effekt": "jeder fuenfte Takt: 2,5 s lang alle Resistenzen auf 0,8, das Blatt darunter bleibt brennbar"
      }
    ],
    "berechnete_ttk_s": 35.8,
    "xp": 1853,
    "gold_min": 159,
    "gold_max": 334,
    "loot": [
      {
        "item": "Urschrift-Siegel",
        "chance": 0.4
      },
      {
        "item": "Ruferzunge",
        "chance": 0.2
      }
    ],
    "konter_in_einem_satz": "Nur während der Anhörung stehen bleiben und Feuer legen, im Aktenmantel gar nicht erst schlagen.",
    "flavor_de": "Alles, was je gegen dich lief, zusammengefasst und in einem Mantel aus Papier vorgetragen. Papier."
  }
]
```

## 3. Selbstprüfung

Gerechnet mit `tools/monsterkatalog.py`, nicht von Hand. Sollwerte in Klammern.

### 3.1 Kernprüfung

| Gegner | Soll | Klasse | Route | TTK (Band) | XP | XP je Kampfsekunde (Soll) | Gefahrenbudget (Band) | Befund |
|---|---|---|---|---|---|---|---|---|
| Chuchu | 1 | A1 | physisch | 2,0 s (1 bis 3) | 10 | 4,95 (5,0) | 42,0 s (über 30) | ok |
| Grünhaut | 2 | A1 | physisch | 2,6 s (1 bis 3) | 20 | 7,62 (7,58) | 30,3 s (über 30) | ok |
| Wandelnder Ablagestapel | 2 | A2 | physisch | 10,1 s (8 bis 15) | 107 | 10,6 (10,61) | 22,4 s (15 bis 25) | ok |
| Waldschamane | 3 | A3 | physisch | 13,0 s (12 bis 25) | 251 | 19,29 (19,33) | 8,6 s (6 bis 10) | ok |
| Der Zustellbote | 3 | A4 | physisch | 27,1 s (20 bis 40) | 682 | 25,12 (25,13) | 4,5 s (3 bis 6) | ok |
| Blubberakte | 3 | A1 | physisch | 2,4 s (1 bis 3) | 23 | 9,59 (9,67) | 40,9 s (über 30) | ok |
| Der Moorbescheid | 4 | A2 | feuer | 10,0 s (8 bis 15) | 161 | 16,1 (16,08) | 20,0 s (15 bis 25) | ok |
| Der Amtsschimmel | 5 | A3 | physisch | 16,6 s (12 bis 25) | 436 | 26,28 (26,27) | 9,0 s (6 bis 10) | ok |
| Der Fristläufer | 5 | A4 | physisch | 24,1 s (20 bis 40) | 823 | 34,15 (34,14) | 4,2 s (3 bis 6) | ok |
| Papierstaub-Skarabäus | 4 | A1 | physisch | 2,5 s (1 bis 3) | 29 | 11,6 (11,49) | 40,0 s (über 30) | ok |
| Klippkrabbe | 5 | A2 | physisch | 12,0 s (8 bis 15) | 220 | 18,39 (18,39) | 22,0 s (15 bis 25) | ok |
| Sandskorpion | 6 | A3 | physisch | 16,0 s (12 bis 25) | 469 | 29,29 (29,3) | 7,0 s (6 bis 10) | ok |
| Dünenpriester | 7 | A4 | physisch | 29,8 s (20 bis 40) | 1246 | 41,77 (41,78) | 4,5 s (3 bis 6) | ok |
| Fledermaus | 6 | A1 | physisch | 2,0 s (1 bis 3) | 29 | 14,53 (14,65) | 38,0 s (über 30) | ok |
| Höhlenspinne | 7 | A2 | physisch | 13,0 s (8 bis 15) | 292 | 22,51 (22,5) | 19,0 s (15 bis 25) | ok |
| Die Sammelmahnung | 8 | A3 | physisch | 13,9 s (12 bis 25) | 485 | 34,81 (34,82) | 7,5 s (6 bis 10) | ok |
| Irrlichtmagier | 8 | A3 | physisch | 12,2 s (12 bis 25) | 426 | 34,86 (34,82) | 9,5 s (6 bis 10) | ok |
| Steingolem | 9 | A4 | magie | 33,9 s (20 bis 40) | 1648 | 48,57 (48,58) | 5,0 s (3 bis 6) | ok |
| Der Dienstweg | 9 | A2 | magie | 11,1 s (8 bis 15) | 291 | 26,19 (26,16) | 22,2 s (15 bis 25) | ok |
| Der Teilbescheid | 9 | A1 | physisch | 2,4 s (1 bis 3) | 44 | 18,57 (18,69) | 40,3 s (über 30) | ok |
| Die Teilabhilfe | 10 | A3 | physisch | 16,0 s (12 bis 25) | 636 | 39,83 (39,81) | 8,5 s (6 bis 10) | ok |
| Der Aktenbote | 8 | A1 | physisch | 2,2 s (1 bis 3) | 38 | 17,42 (17,41) | 37,4 s (über 30) | ok |
| Mumie | 9 | A2 | physisch | 14,0 s (8 bis 15) | 366 | 26,14 (26,16) | 18,0 s (15 bis 25) | ok |
| Knochenritter | 9 | A3 | physisch | 18,0 s (12 bis 25) | 674 | 37,36 (37,37) | 6,5 s (6 bis 10) | ok |
| Die Sammelverfügung | 10 | A4 | feuer | 35,8 s (20 bis 40) | 1853 | 51,76 (51,75) | 4,0 s (3 bis 6) | ok |

Alle zwanzig Zeilen liegen in ihren Bändern. Die XP-Rate weicht nirgends mehr als ein Prozent
vom Sollwert ab, der Rest ist Rundung auf ganze XP.

### 3.2 Rudelwerte und Vorwarnzeiten

| Gegner | Klasse | Rudelgröße | Gefahrenbudget einzeln | Gefahrenbudget im Rudel | kürzeste Vorwarnung | Mindestvorwarnung |
|---|---|---|---|---|---|---|
| Chuchu | A1 | 5 | 42,0 s | 5,5 s | 300 ms | 250 ms |
| Grünhaut | A1 | 3 | 30,3 s | 8,3 s | 280 ms | 250 ms |
| Wandelnder Ablagestapel | A2 | 1 | 22,4 s | 22,4 s | 420 ms | 250 ms |
| Waldschamane | A3 | 1 | 8,6 s | 8,6 s | 420 ms | 350 ms |
| Der Zustellbote | A4 | 1 | 4,5 s | 4,5 s | 380 ms | 350 ms |
| Blubberakte | A1 | 4 | 40,9 s | 8,2 s | 300 ms | 250 ms |
| Der Moorbescheid | A2 | 1 | 20,0 s | 20,0 s | 450 ms | 250 ms |
| Der Amtsschimmel | A3 | 1 | 9,0 s | 9,0 s | 350 ms | 350 ms |
| Der Fristläufer | A4 | 1 | 4,2 s | 4,2 s | 400 ms | 350 ms |
| Papierstaub-Skarabäus | A1 | 3 | 40,0 s | 10,5 s | 300 ms | 250 ms |
| Klippkrabbe | A2 | 1 | 22,0 s | 22,0 s | 400 ms | 250 ms |
| Sandskorpion | A3 | 1 | 7,0 s | 7,0 s | 350 ms | 350 ms |
| Dünenpriester | A4 | 1 | 4,5 s | 4,5 s | 400 ms | 350 ms |
| Fledermaus | A1 | 6 | 38,0 s | 5,2 s | 250 ms | 250 ms |
| Höhlenspinne | A2 | 1 | 19,0 s | 19,0 s | 400 ms | 250 ms |
| Die Sammelmahnung | A3 | 3 | 7,5 s | 2,4 s | 500 ms | 350 ms |
| Irrlichtmagier | A3 | 1 | 9,5 s | 9,5 s | 380 ms | 350 ms |
| Steingolem | A4 | 1 | 5,0 s | 5,0 s | 700 ms | 350 ms |
| Der Dienstweg | A2 | 2 | 22,2 s | 10,3 s | 520 ms | 250 ms |
| Der Teilbescheid | A1 | 4 | 40,3 s | 8,4 s | 320 ms | 250 ms |
| Die Teilabhilfe | A3 | 1 | 8,5 s | 8,5 s | 560 ms | 350 ms |
| Der Aktenbote | A1 | 4 | 37,4 s | 7,7 s | 300 ms | 250 ms |
| Mumie | A2 | 1 | 18,0 s | 18,0 s | 500 ms | 250 ms |
| Knochenritter | A3 | 1 | 6,5 s | 6,5 s | 450 ms | 350 ms |
| Die Sammelverfügung | A4 | 1 | 4,0 s | 4,0 s | 400 ms | 350 ms |

Die Mindestvorwarnung von 350 ms gilt laut Auftrag für A3 und A4 und ist überall eingehalten.
Für A1 und A2 ist 250 ms als Hausregel gesetzt, damit kein Angriff ohne Ankündigung existiert.
Alle 9 Gegner mit Rudelgröße über 1 fallen als Gruppe unter ihr Klassenband, am
deutlichsten die Sammelmahnung mit 2,4 s. Das ist gewollt und der Grund, warum diese
Gegner überhaupt Schwarm heißen: das Klassenband beschreibt den einzelnen Vorgang, der Rudelwert
beschreibt den Fehler, mehrere davon gleichzeitig aufzumachen. Der Konter steht in derselben
Zeile des Katalogs und lautet je nach Gegner, die Gruppe zu trennen, sie gar nicht erst
zusammenlaufen zu lassen oder sie umgekehrt mit einem einzigen breiten Hieb gemeinsam zu
nehmen.

### 3.3 Nebenrouten der Resistenz-Gates

TTK in Sekunden je Schadensart. Fett ist die Sollroute, aus der die Werte des Katalogs
abgeleitet sind.

| Gegner | physisch | Feuer | Eis | Gift | Magie |
|---|---|---|---|---|---|
| Der Moorbescheid | 20,3 s | **10,0 s** | 17,6 s | 150,0 s * | 17,6 s |
| Papierstaub-Skarabäus | **2,5 s** | 22,8 s | 2,4 s | 4,9 s * | 3,4 s |
| Klippkrabbe | **12,0 s** | wirkungslos | wirkungslos | 58,3 s * | wirkungslos |
| Steingolem | 167,6 s | 47,5 s | 47,5 s | 118,8 s * | **33,9 s** |
| Der Dienstweg | 6,6 s | 15,0 s | 18,8 s | 23,1 s * | **11,1 s** |
| Mumie | **14,0 s** | wirkungslos | wirkungslos | 991,7 s * | wirkungslos |
| Die Sammelverfügung | 52,2 s | **35,8 s** | 87,9 s | 120,8 s * | 87,9 s |

\* Giftwerte sind rechnerisch mitgeführt, aber nicht erreichbar: der Spieler hat keine
Giftquelle. Sie stehen hier, damit ein späterer Kesseltrank nicht neu gegen die Tabelle
gerechnet werden muss.

Die langen Nebenrouten sind kein Verstoß, sie sind die Funktion. Der Skarabäus mit 11,2 s auf
Feuer ist die teuerste Fehlentscheidung im Katalog, und sie steht in der Wüste, wo Feuer die
naheliegende Wahl ist. Wer stattdessen zuschlägt, ist nach 2,5 s fertig.

### 3.4 Prüfung der harten Invarianten

| Invariante | Ergebnis |
|---|---|
| Keine Levelskalierung | erfüllt, alle Werte fest, kein Feld hängt an der Spielerstufe |
| EHP statt HP gerechnet | erfüllt, `EHP = HP / (1 - Resistenz)`, negative Werte als Verwundbarkeit |
| Referenzwerte abgeleitet | erfüllt, aus `recalc()`, `hurtPlayer()`, `drinkPotion()`, `gainXP()` |
| Kampfzeitbänder | erfüllt, siehe 3.1 |
| XP-Ertragsleiter 1,0 / 1,4 / 2,0 / 2,6 | erfüllt, Abweichung unter einem Prozent |
| Gefahrenbudget je Klasse | erfüllt einzeln, Rudelwerte bewusst darunter, siehe 3.2 |
| Vorwarnung sichtbar, mindestens 350 ms bei A3 und A4 | erfüllt, kürzester Wert bei A3/A4 ist 350 ms |
| Ohne Verbrauchsgegenstände besiegbar | erfüllt, siehe unten |
| Jeder Gegner hat einen Konter | erfüllt, ein Satz je Gegner, keiner davon lautet "mehr Schaden" |
| Keine reine Zahlenaufblähung | erfüllt, siehe 3.5 |

Zur Besiegbarkeit ohne Verbrauchsgegenstände: das Gefahrenbudget rechnet Heilung bereits mit,
und für die beiden Gegner mit Heilsperre (Moorbescheid, Mumie) ist es ohne jede Heilung
gerechnet, also mit 0 statt 60 bis 120 Leben je Minute. Beide bleiben trotzdem im A2-Band.
Tränke machen jeden Kampf schneller, keiner macht ihn erst möglich.

### 3.5 Messlauf im laufenden Spiel

Die Tabellen oben rechnen. Diese hier misst. `tools/monster-messlauf.mjs` startet das Spiel
im Browser, baut je Gegner den Referenzspieler seiner Sollstufe und laesst dann das echte
`update()` laufen: einmal mit einem Spieler, der zuschlaegt, einmal mit einem, der nur
dasteht. Drei Laeufe je Gegner und Richtung, Mittelwert.

| Gegner | Klasse | Kampfzeit gemessen | gerechnet | Ueberleben gemessen | gerechnet |
|---|---|---|---|---|---|
| Chuchu | A1 | 1,9 s | 2,0 s | 28,7 s | 28,0 s |
| Grünhaut | A1 | 3,0 s | 2,6 s | 22,8 s | 25,2 s |
| Wandelnder Ablagestapel | A2 | 10,6 s | 10,1 s | 18,1 s | 18,0 s |
| Waldschamane | A3 | 14,2 s | 13,0 s | 9,4 s | 9,0 s |
| Der Zustellbote | A4 | 22,3 s | 26,8 s | 5,3 s | 4,3 s |
| Blubberakte | A1 | 2,5 s | 2,4 s | 34,0 s | 33,9 s |
| Der Amtsschimmel | A3 | 15,8 s | 16,6 s | 7,8 s | 5,6 s |
| Der Fristläufer | A4 | 25,8 s | 23,9 s | 3,5 s | 2,7 s |
| Papierstaub-Skarabäus | A1 | 2,5 s | 2,5 s | 27,6 s | 27,7 s |
| Klippkrabbe | A2 | 11,5 s | 12,0 s | 18,4 s | 16,8 s |
| Sandskorpion | A3 | 16,6 s | 16,0 s | 5,6 s | 5,0 s |
| Dünenpriester | A4 | 30,2 s | 29,9 s | 3,1 s | 2,9 s |
| Fledermaus | A1 | 1,9 s | 2,0 s | 29,4 s | 29,7 s |
| Höhlenspinne | A2 | 13,4 s | 13,0 s | 16,7 s | 17,3 s |
| Die Sammelmahnung | A3 | 14,4 s | 14,1 s | 6,1 s | 7,1 s |
| Irrlichtmagier | A3 | 11,5 s | 12,3 s | 10,0 s | 7,7 s |
| Der Aktenbote | A1 | 1,6 s | 2,2 s | 29,0 s | 20,2 s |
| Mumie | A2 | 13,6 s | 14,0 s | 17,8 s | 17,9 s |
| Knochenritter | A3 | 18,0 s | 18,1 s | 5,7 s | 6,3 s |

Alle gemessenen Kampfzeiten liegen in ihrem Klassenband. Drei Dinge liest man aus den
Abweichungen heraus, und alle drei sind gewollt:

1. **Der Zustellbote stirbt schneller als gerechnet** (22,3 statt 26,8 s), weil der Messlauf
   sein Abgabefenster perfekt nutzt. Genau dafuer ist es da. Die gerechnete Zahl ist der
   Spieler, der es verschlaeft; beide liegen im A4-Band.
2. **Unterstuetzer und Kiter halten laenger durch, als das Modell sagt** (Amtsschimmel 7,8
   statt 5,6 s), weil sie einen Teil ihrer Takte mit Heilen oder Zurueckweichen verbringen.
   Das Modell rechnet den Ausfall zwar mit (Abschnitt 1.3, mittlere Wucht), aber nicht die
   Wege.
3. **Kurze Kaempfe schwanken.** Bei zwei bis drei Schlaegen ist ein guter Wurf ein ganzer
   Treffer Unterschied. Deshalb drei Laeufe, und deshalb liegt keine A1-Sollzeit mehr am
   Bandrand.

Die Zauberrouten (Steingolem gegen Magie, Moorbescheid und Sammelverfuegung gegen Feuer)
stehen nicht in der Tabelle: der Messlauf fuehrt keinen Zauberer. Ihre Wirkung ist stattdessen
direkt geprueft, mit 100 Rohschaden je Art auf denselben Gegner:

| Gegner | physisch | Feuer | Eis | Magie | im offenen Fenster |
|---|---|---|---|---|---|
| Steingolem | 10 | 100 | 100 | 140 | 100 |
| Papierstaub-Skarabäus | 50 | 15 | 140 | 100 | 100 |
| Der Moorbescheid | 50 | 150 | 85 | 85 | 100 |
| Die Sammelverfügung | 30 | 135 | 55 | 55 | 100 |

Der Steingolem nimmt von hundert Punkten Stahl zehn und von hundert Punkten Magie
hundertvierzig. Im Aktenmantel der Sammelverfuegung faellt Stahl von 30 auf 20, Feuer bleibt
bei 135: das Blatt unter dem Mantel bleibt brennbar.

### 3.6 Prüfung gegen Kopien mit größeren Zahlen

Der Verbotstest lautet: gibt es zwei Gegner, die dieselbe Frage stellen und sich nur in der
Größe der Antwort unterscheiden? Die vier Paare, die sich am nächsten kommen:

| Paar | Warum es keine Kopie ist |
|---|---|
| Wandelnder Ablagestapel und Klippkrabbe, beide A2 und Schadensschwamm | Der Stapel ist reine Geduld mit einem Kegel, den man umläuft. Die Krabbe hält fest, statt wegzustoßen: bei ihr entscheidet nicht Ausdauer, sondern ob man aus dem Griff heraus ist, bevor er zugeht. |
| Der Zustellbote und der Dünenpriester, beide A4 und Kiter | Der Bote öffnet sein Fenster selbst, alle sechs Sekunden, und man muss nur warten können. Der Priester öffnet seins nur, wenn er andere buffen will, also erzwingt er, dass man den Schwarm überhaupt erst stehen lässt. |
| Waldschamane und Irrlichtmagier, beide A3 und Glaskanone auf Distanz | Der Schamane hat 380 Leben auf Sollstufe 3 und fällt im Nahkampf sofort. Der Irrlichtmagier hat auf Sollstufe 8 die halbe Kammer um sich und kann sich Zeit lassen. Gegen den einen hilft Zulaufen, gegen den anderen Aufräumen. |
| Chuchu und Fledermaus, beide A1 und Schwarm | Der Chuchu steht und sammelt sich, die Fledermaus fliegt durch und dreht ab. Der eine belohnt einen breiten Hieb an der richtigen Stelle, der andere Timing im Durchflug. |

Zwei Paare tragen denselben Anforderungstyp in derselben Klasse und werden trotzdem nicht
verwechselt, weil ihr Konter gegenteilig ist. Genau das ist der Unterschied zwischen einer
Variante und einer Kopie.

### 3.7 Was die Prüfung gefunden und der Katalog korrigiert hat

Neun Befunde, alle vor dieser Ausgabe behoben. Fuenf davon hat erst der Messlauf im
laufenden Spiel gefunden, nicht die Rechnung:

1. **Das Irrlicht traf für 186 bei 198 Spieler-HP.** Rechnerisch im Band, praktisch ein
   Sofort-Tod aus dem Nichts. Intervall von 2,6 auf 2,0 s, Treffer auf 130.
2. **Der Sandskorpion stand mit Rudelgröße 2 im Roster**, obwohl er kein Schwarmtyp ist.
   Sein Gruppenbudget lag unter dem A3-Band, ohne dass ein Typ das gerechtfertigt hätte.
3. **Die Höhlenspinne war gegen Gift verwundbar.** Gift kann der Spieler nicht wirken, die
   Weichstelle war totes Blatt. Jetzt gegen Feuer.
4. **Eis war fast jede zweite Weichstelle.** Amtsschimmel und Skorpion auf Feuer und Magie
   umgestellt. Die Verteilung folgt jetzt ungefähr der Reihenfolge, in der ein Spieler die
   Zauberzweige aufmacht.
5. **Gold hing an der XP.** Aus dem XP-Wert abgeleitet hätte die Sammelverfügung mehr Gold
   getragen als der Schattenfürst. Gold hängt jetzt an Sollstufe und Klasse.
6. **Der Aushang sprengte seinen Zeichendeckel.** Die erste Vorgangsart der Sammelverfügung
   war "Der Sammelvorgang in Verfügungsform", und damit wurde der Aushangsatz 68 Zeichen
   lang statt 60. Gefunden hat das nicht der Katalog, sondern `auftragAssertBrett()` beim
   ersten Laden. Jetzt heißt sie "Der Sammelbescheid".
7. **Die zweite Nachforderung löste sich selbst aus.** Nach dem Folgeschlag stand der Zähler
   wieder auf Folgeschlag, der Skorpion schlug also dauerhaft mit halber Wucht statt einmal.
   Ein echter Fehler im Kampfcode, gefunden beim Nachrechnen der mittleren Wucht.
8. **Muster ohne Schaden fehlten im Gefahrenbudget.** Ein Unterstützer, der jeden dritten
   Takt heilt statt zu schlagen, macht ein Drittel weniger Schaden als das Modell annahm.
   Seit dieser Ausgabe rechnen Dokument und Guard mit der mittleren Wucht über einen ganzen
   Zyklus, und die Grundtreffer sind entsprechend höher.
9. **Die Kiter zogen sich zu lange zurück.** Rückzug plus Rückweg plus Vorwarnung passten
   nicht mehr in ihr Angriffsintervall, sie schlugen also seltener zu als versprochen. Der
   Rückzug ist jetzt kürzer als die halbe Vorwarnungslücke.

Dazu zwei Feinjustierungen aus dem Messlauf: der Amtsschimmel steht während seiner
Wiedervorlage offen und fiel dadurch unter das A3-Band (Sollzeit hoch), und die Fledermaus lag
mit 1,6 s so nah am Bandboden, dass ein guter Wurf sie unter eine Sekunde drückte (Sollzeit
auf 2,0 s).

### 3.8 Was offen bleibt

Drei Punkte, die dieses Dokument benennt und nicht löst:

1. **Ein A4-Kill auf Sollstufe 10 trägt rund 1857 XP, ein Stufenaufstieg kostet dort 784.**
   Das folgt zwingend aus der Ertragsleiter: 2,6 mal Ertrag bei 16 mal Kampfzeit. Ein Kill an
   der Sammelverfügung trägt so viel wie 48 Kills am Aktenboten. Wenn das zu schnell ist,
   gehört nicht der Katalog angefasst, sondern ein einziger Faktor auf alle XP-Werte oder die
   Stufenkurve `35 * Stufe^1,35`. Die Verhältnisse zwischen den Klassen bleiben davon
   unberührt.
2. **Die zehn neuen Gegner tragen kein eigenes Sprite.** Sie benutzen Rigs aus dem Bestand,
   umgefärbt, wie es das Spiel bei Frostgolem und Schattenling schon immer tut. Wer eigene
   Grafik will, tauscht `rig` und `tint` im MONDEF-Eintrag, nicht die Zahlen.
3. **Der Frostkamm bleibt ungerechnet.** Er stand nicht im Auftrag. Solange das so ist, ist
   er die Vergleichsprobe im selben Spiel; wenn er dazukommen soll, gehören seine drei Typen
   in `tools/monsterkatalog.py` und bekommen dort ein `kat`-Feld wie alle anderen.

### 3.9 Nachtrag M2: zwei versiegelte Gegner

Aus dem Spielbericht: sobald Magie zur Verfügung steht, lässt sich aus der Distanz
spammen. Der erste Teil der Antwort steht in `phase-z1-zauberbalance.md` (Zaubern kostet
wieder Bewegung und Rhythmus). Der zweite Teil steht hier: **zwei der 25 Gegner sind gegen
alle drei Zauberzweige immun.** Sie sind der Ort, an dem die Waffe die einzige Antwort ist.

| Gegner | Sollstufe | Klasse | Weichstelle | Sollzeit |
|---|---|---|---|---|
| Klippkrabbe | 5 | A2 | physisch -0,20 | 12,0 s |
| Mumie | 9 | A2 | physisch -0,25 | 14,0 s |

Beide sind mit Absicht **A2 und langsam** (Tempo 36 und 26 gegen 135 beim Spieler). Wer
sie im Nahkampf annimmt, kann jederzeit wieder weggehen. Die Sperre kostet also Zeit und
Aufmerksamkeit, nie das Leben. Beide sind gegen die Waffe ausdrücklich VERWUNDBAR, nicht
bloß unresistent: der Umweg über den Nahkampf ist schneller als jeder Zauber es je war.
Und beide stehen weit vom Dorf entfernt, in Wüste und Ruine, also dort, wo ein Spieler
seine Zauber längst kennt. Sichtbar sind sie an einem gestrichelten weißen Siegelring am
Boden, der dauerhaft leuchtet und nicht erst nach dem ersten verlorenen Zauber.

Drei Bedingungen prüfen dieses Skript und `monsterAssert()` unabhängig voneinander nach:
die Sollroute ist physisch, die Waffe ist Weichstelle, und die Klasse ist nicht A4. Dazu
kommt die Sackgassenprüfung, die für ALLE Gegner gilt: kein Gegner darf gegen alle vier
spielbaren Arten zugleich immun sein.

Nicht in diesem Katalog stehen die beiden anderen Neuerungen aus M2, weil sie keine
Katalogeinträge sind: die Staffel der Bevölkerung nach Entfernung vom Dorf und der
Sonderprüfer, eine seltene Aufwertung EINER Instanz eines A1-Gegners. Beides sind
Eigenschaften der Karte und der Instanz, nicht der Vorgangsart. Sie stehen in
`phase-m2-nahfeld-und-namen.md` und werden von `monsterAssert()` gegen dieselben Bänder
gerechnet wie alles andere hier.

### 3.10 Nachtrag Z2: die Zauberbefugnis und die neue Manarechnung

Mit Z2 (`phase-z2-zauberbefugnis.md`) gilt: der erste Zauberpunkt kommt beim Aufstieg
auf Stufe 4, die passive Manaregeneration faellt von 8 auf 2 je Sekunde, und jeder
Waffenschwung mit mindestens einem Treffer laedt 4 Mana. Fuer diesen Katalog folgt daraus
eine neue Zauberleistung:

    Manarate im Kampf = 2 + 4 * 1,3 Schwuenge/s = 7,2 Mana/s
    ZAUBER_DPS        = 7,2 / 5 * 16 = 12.00 (vorher 25,6)

Die Rechnung nimmt an, dass der Spieler das Mana AM GEGNER erarbeitet. Das traegt auch
beim Steingolem, dessen Sollroute Magie ist: die Treffer-Ladung haengt am Treffer, nicht
am Schaden, seine 0,9 Physisch-Resistenz aendert an der Manarechnung nichts. Die drei
Gegner mit Zauber-Sollroute (Moorbescheid, Steingolem, Sammelverfuegung) haben dadurch
rund zehn Prozent weniger Lebenspunkte, ihre Sollzeiten sind unveraendert. Reines
Zauberspammen aus der Distanz liegt bei 6,4 Schaden je Sekunde und ist damit gegen
nichts oberhalb eines Formfehlers eine Route. Genau das war der Auftrag.

Zwei Stufen des Katalogs (1 bis 3) liegen jetzt VOR der Befugnis. Fuer sie existiert
keine Zauberroute, und der Messlauf schreibt in diese Zellen "keine Befugnis" statt
einer Zahl. Kein Eintrag dieser Stufen hat eine Zauber-Sollroute, der Katalog bleibt
also in sich geschlossen; die Kopplung der Konstanten prueft `zauberAssert()` in
`index.html` bei jedem Laden.

