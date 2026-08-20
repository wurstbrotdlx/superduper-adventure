## Monsterkatalog, Sollstufe 1 bis 10: zwanzig Gegner in fünf Biomen — OFFEN (Balancing-Lieferung, nicht eingebaut)

Inhaltslieferung zu Kapitel 3 (Geographie) und Kapitel 6 (Bestiarium) der
`superduper-weltbibel.md`. Zwanzig Gegner, fünf Biome, vier Ertragsklassen, feste Werte.
Der Katalog ist Balancing, kein Code: er sagt, welche Zahl ein Gegner tragen soll und warum,
und er rechnet den Grund mit. Autorität für Welt, Namen und Ton bleibt die Weltbibel; wo
dieser Katalog eine Zahl nennt, die im Code anders steht, ist der Code der Stand und dieses
Dokument der Vorschlag.

**Erzeugt von** `tools/monsterkatalog.py`. Das Skript rechnet jede Zahl aus der Rechenbasis,
prüft alle harten Invarianten und meldet jede Verletzung. Von Hand geändert wird hier nichts,
geändert wird das Skript.

**Formregeln, unverändert aus Kapitel 13:** keine Gedankenstriche im Fließtext, keine Emojis,
kurze Sätze. Die Markierung in der Überschrift folgt der Repo-Regel aus der README und ist
kein Fließtext.

Zwei Vorgaben waren im Auftrag offen und sind hier gesetzt, weil ohne sie nichts zu rechnen ist:
**N = 20 Gegner** und **X = Sollstufe 10**. Fünf Biome zu je vier Gegnern, das ist die kleinste
Zahl, mit der jedes Biom alle vier Ertragsklassen tragen kann.

## 1. Rechenbasis

### 1.1 Referenzspieler

Die Referenzwerte sind nicht gesetzt, sondern aus `index.html` abgeleitet, damit der Katalog
gegen das Spiel rechnet und nicht gegen eine Fantasie. Quellen sind `recalc()`, `hurtPlayer()`,
`drinkPotion()` und `gainXP()`.

Angenommener Referenzbuild: je Stufenaufstieg ein Punkt in Stärke und ein Punkt in Vitalität,
kein Punkt in Intelligenz. Ausrüstung im üblichen Fundfenster der Stufe, keine Kesselwirkungen,
keine Flüche.

```
maxHp     = 70 + (Stufe-1)*12 + VIT*20                     (recalc)
dmgAvg    = (Waffe_min + Waffe_max)/2 + STR*3,5 + Affix    (recalc)
DPS       = dmgAvg * 1,175 * Angriffe je Sekunde           (Crit 25 % zu Faktor 1,7)
Minderung = Rüstung/(Rüstung+30), gedeckelt bei 0,6        (hurtPlayer)
Trank     = 60 Leben je Fläschchen                         (drinkPotion)
```

| Sollstufe | Spieler-HP | Rüstung | Minderung | Spieler-DPS | Heilung je Minute |
|---|---|---|---|---|---|
| 1 | 70 | 0 | 0,00 | 13,7 | 60 |
| 2 | 102 | 3 | 0,09 | 19,1 | 60 |
| 3 | 134 | 5 | 0,14 | 24,4 | 60 |
| 4 | 166 | 10 | 0,25 | 34,4 | 90 |
| 5 | 198 | 10 | 0,25 | 39,7 | 90 |
| 6 | 230 | 13 | 0,30 | 45,1 | 90 |
| 7 | 262 | 13 | 0,30 | 50,4 | 90 |
| 8 | 294 | 17 | 0,36 | 60,3 | 120 |
| 9 | 326 | 17 | 0,36 | 65,7 | 120 |
| 10 | 358 | 20 | 0,40 | 71,0 | 120 |

Heilung je Minute ist die Felddauerleistung, nicht der Vorrat: ein Fläschchen je Minute bis
Sollstufe 3, anderthalb bis Sollstufe 7, zwei ab Sollstufe 8. Tränke sind damit Teil der
Rechnung, aber kein Gegner braucht sie (siehe 3.4).

### 1.2 Zauberleistung

Manaregeneration 8 je Sekunde, Funke kostet 5 Mana für 16 Schaden. Die Dauerleistung eines
Zauberers ist deshalb manabegrenzt und stufenunabhängig:

```
Zauber-DPS (Dauer)  = 8/5 * 16   = 25,6
Zauber-DPS (Fenster) ~ 57        solange der Manapool reicht
```

Das ist der Grund, warum Resistenz-Gates in diesem Katalog nie an reiner Zahlengröße hängen:
ein Gate verschiebt den Spieler von 71 DPS auf 25,6 DPS, und das allein ist schon Faktor 2,8.

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

Fünf Biome, je vier Gegner, je alle vier Ertragsklassen. Wer ein bestimmtes Ausrüstungsteil
bauen will, hat keine Wahl, wohin er geht:

| Biom | Amtlicher Name | Signatur in einem Satz | Sollstufen |
|---|---|---|---|
| Wald | Ablage A | Der Wald gibt Stiefel und Schilde und fast nur Adjektive, die auf Tempo und Verlangsamung zeigen. | 1 bis 3 |
| Sumpf | Die Nassablage | Im Sumpf liegen Rüstungszutaten mit feuchten Adjektiven, also alles für Selbstheilung und Abweisung, und sonst nichts. | 3 bis 5 |
| Wüste | Der Brandabschnitt | Der Brandabschnitt liefert Waffenzutaten mit glühenden Adjektiven, also Nachdruck und Wucht, und legt jedem Fund einen teuren Fluch bei. | 4 bis 7 |
| Höhle | Die Untere Registratur | Unter Tage kommen Schildzutaten mit steinernen Adjektiven, also Panzerung und Aktenlage, und nur dort. | 6 bis 9 |
| Ruine | Der Altbestand | Der Altbestand ist die einzige Quelle arkaner Waffenzutaten, also Manafluss, Zauberkraft und Aktenkunde, und zahlt sie mit den härtesten Gegnern des Katalogs. | 8 bis 10 |

Die Eisablage (`snow`) ist im Auftrag nicht genannt und bleibt unverändert bei ihrem heutigen
Roster.

### 1.6 Besetzung der Achsen

| Ertragsklasse | Gegner | Anforderungstypen |
|---|---|---|
| A1 Fleiß | 5 | B1, B5, B6, B7 |
| A2 Geduld | 5 | B2, B5, B7 |
| A3 Risiko | 5 | B1, B3, B4, B6, B7 |
| A4 Meisterschaft | 5 | B2, B3, B4, B5, B6 |

| Anforderungstyp | kommt vor in |
|---|---|
| B1 Schwarm | A1, A3 |
| B2 Schadensschwamm | A2, A4 |
| B3 Glaskanone | A3, A4 |
| B4 Kiter | A3, A4 |
| B5 Resistenz-Gate | A1, A2, A4 |
| B6 Unterstützer | A1, A3, A4 |
| B7 Hinterhalt | A1, A2, A3 |

Kein Anforderungstyp gehört einer einzigen Ertragsklasse. Der Papierstaub-Skarabäus ist
ausdrücklich A1 und trotzdem ein Resistenz-Gate: billig, schnell, häufig, und trotzdem eine
Frage, die man beantworten muss.

### 1.7 Vorgangsart je Gegner

Kapitel 6 der Weltbibel hat dazu eine Regel: erst die Vorgangsart erfinden, dann das
Monster, nie umgekehrt. Wer eine Vorgangsart nicht in einem Satz erklären kann, hat kein
Monster. Sieben der zwanzig übernehmen eine Vorgangsart, die schon im Bestiarium steht,
dreizehn sind neu.

| Gegner | Vorgangsart | Warum es sich so verhält |
|---|---|---|
| Vordruckling | Der Vordruck | Ein Formular, das nie ausgefüllt wurde und es deshalb selbst versucht. Vordrucke kommen nie einzeln. |
| Wandelnder Ablagestapel | Der Posteingang | Zwölf Jahre nicht abgearbeitet und inzwischen hoch genug, um zurückzufallen. |
| Waldschamane im Widerspruch | Der Widerspruch | Steht schon im Bestiarium: ein Widerspruch wird schriftlich erhoben, also aus der Entfernung. |
| Der Zustellbote | Der Zustellversuch | Er war da. Du warst nicht da. Ihn zu fassen ist grundsätzlich vorgesehen und praktisch nie möglich. |
| Blubberakte | Der Rücklauf | Was einmal untergegangen ist, kommt wieder hoch, sobald jemand am Ufer steht. |
| Der Moorbescheid | Der durchweichte Bescheid | Unlesbar geworden und trotzdem in Kraft. Lesbarkeit ist keine Wirksamkeitsvoraussetzung. |
| Der Amtsschimmel | Die Fristverlängerung | Er entscheidet nichts. Er verlängert, und was er verlängert, lebt länger. |
| Irrlicht der Fristsetzung | Die Fristsetzung | Setzt eine Frist, die niemand beantragt hat, und ist weg, bevor jemand widersprechen kann. |
| Papierstaub-Skarabäus | Die Aktenvernichtung | Er lebt von dem, was nach dem Brand übrig blieb, und ist gegen Feuer deshalb gleichgültig. |
| Der Steinbescheid | Die Rechtskraft | Nicht wütend, nur rechtskräftig. Dagegen hilft kein Argument, nur Temperatur. |
| Nachforderungsskorpion | Die Nachforderung | Steht schon im Bestiarium: kommt hinterher, sticht genau einmal. Hier zweimal, wenn der erste Stich sitzt. |
| Dünenpriester der Verfügung | Die Verfügung | Steht schon im Bestiarium: ordnet aus sicherer Entfernung an, dass andere es tun. |
| Umlauffledermaus | Der Umlauf | Steht schon im Bestiarium: kreist, landet nie, kommt bei jedem einmal vorbei. |
| Der Deckenlauerer | Die Zuständigkeitsvermutung | Hängt jahrelang über allem und fällt auf den Ersten, der sich als zuständig erweist. |
| Die Sammelmahnung | Die Mahnstufe | Dieselbe Sache, dreimal, gleichlautend. Einzeln Papier, zu dritt ein Titel. |
| Steingolem der Bestandskraft | Die Bestandskraft | Steht schon im Bestiarium: eine Entscheidung, gegen die kein Rechtsmittel mehr geht. Das Schwert ist keines. |
| Der Aktenbote | Der Zuschlag | Er trägt nichts Eigenes bei außer der Mitteilung, dass ab jetzt alle härter zuschlagen dürfen. |
| Mumie der versiegelten Akte | Die versiegelte Akte | Steht schon im Bestiarium: Banderole drum, Siegel drauf, nie geöffnet. |
| Knochenritter der Dienstvorschrift | Die Dienstvorschrift | Steht schon im Bestiarium: reine Form, bewaffnet, korrekt. Auch beim Töten hält er sich an die Reihenfolge. |
| Die Sammelverfügung | Der Sammelvorgang in Verfügungsform | Alles, was je gegen dich lief, zusammengefasst und in einem Mantel aus Papier vorgetragen. |

## 2. JSON-Katalog

```json
[
  {
    "id": "wa_vordruckling",
    "name": "Vordruckling",
    "biom": "Wald",
    "sollstufe": 1,
    "ertragsklasse": "A1",
    "anforderungstyp": [
      "B1"
    ],
    "hp": 27,
    "resistenzen": {
      "physisch": 0,
      "feuer": -0.25,
      "eis": 0,
      "gift": 0.2,
      "magie": 0
    },
    "schaden_pro_treffer": 3,
    "angriffsintervall_s": 1.2,
    "tempo": 40,
    "angriffsmuster": [
      {
        "name": "Anlehnen",
        "vorwarnzeit_ms": 300,
        "reichweite": "nah (26)",
        "effekt": "schiebt leicht zurück, kein Effekt darüber hinaus"
      },
      {
        "name": "Formfehler abgeben",
        "vorwarnzeit_ms": 350,
        "reichweite": "nah (26)",
        "effekt": "ersetzt den Grundtreffer, hinterlässt ein Blatt am Boden"
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
        "item": "Goblin-Zeh",
        "chance": 0.1
      },
      {
        "item": "Kupfermünzen",
        "chance": 0.6
      }
    ],
    "konter_in_einem_satz": "Einfach draufhalten, aber nie stehen bleiben, wo drei von ihnen zusammenlaufen.",
    "flavor_de": "Ein Stapel Formulare, der gelernt hat, beleidigt zu sein. Er will nichts von dir außer einer Unterschrift, notfalls mit Gewalt."
  },
  {
    "id": "wa_ablagestapel",
    "name": "Wandelnder Ablagestapel",
    "biom": "Wald",
    "sollstufe": 2,
    "ertragsklasse": "A2",
    "anforderungstyp": [
      "B2"
    ],
    "hp": 125,
    "resistenzen": {
      "physisch": 0.35,
      "feuer": -0.4,
      "eis": 0.1,
      "gift": 0.3,
      "magie": 0
    },
    "schaden_pro_treffer": 10,
    "angriffsintervall_s": 1.6,
    "tempo": 32,
    "angriffsmuster": [
      {
        "name": "Umkippen",
        "vorwarnzeit_ms": 420,
        "reichweite": "nah (30)",
        "effekt": "kurzer Rückstoß, danach 0,6 s wehrlos am Boden"
      },
      {
        "name": "Loseblattlawine",
        "vorwarnzeit_ms": 600,
        "reichweite": "Kegel (90)",
        "effekt": "ersetzt den Grundtreffer, trifft breit statt hart"
      }
    ],
    "berechnete_ttk_s": 10.1,
    "xp": 107,
    "gold_min": 16,
    "gold_max": 34,
    "loot": [
      {
        "item": "Chuchu-Gallert",
        "chance": 0.25
      },
      {
        "item": "Goblin-Zeh",
        "chance": 0.3
      },
      {
        "item": "Holzschild-Rohling",
        "chance": 0.12
      }
    ],
    "konter_in_einem_satz": "Von der Seite schlagen und die 0,6 s nach dem Umkippen zum Nachladen nutzen.",
    "flavor_de": "Zwölf Jahre unbearbeiteter Posteingang, jetzt mit Beinen. Feuer wäre gnädig, für beide Seiten."
  },
  {
    "id": "wa_schamane",
    "name": "Waldschamane im Widerspruch",
    "biom": "Wald",
    "sollstufe": 3,
    "ertragsklasse": "A3",
    "anforderungstyp": [
      "B3",
      "B7"
    ],
    "hp": 380,
    "resistenzen": {
      "physisch": -0.2,
      "feuer": 0,
      "eis": 0,
      "gift": 0.2,
      "magie": 0.4
    },
    "schaden_pro_treffer": 37,
    "angriffsintervall_s": 1.9,
    "tempo": 44,
    "angriffsmuster": [
      {
        "name": "Widerspruchsbolzen",
        "vorwarnzeit_ms": 420,
        "reichweite": "fern (130)",
        "effekt": "gerader Bolzen, sichtbares Aufleuchten vor dem Wurf"
      },
      {
        "name": "Aus dem Unterholz",
        "vorwarnzeit_ms": 500,
        "reichweite": "nah (40)",
        "effekt": "Eröffnung aus der Deckung, ersetzt den ersten Grundtreffer"
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
        "item": "Chuchu-Gallert",
        "chance": 0.15
      },
      {
        "item": "Widerspruchsformular",
        "chance": 0.2
      }
    ],
    "konter_in_einem_satz": "Sofort die Distanz schließen, im Nahkampf ist er aus Papier.",
    "flavor_de": "Er widerspricht allem, auch der Schwerkraft, aber nur schriftlich. Der Bolzen ist die Anlage zum Schreiben."
  },
  {
    "id": "wa_zustellbote",
    "name": "Der Zustellbote",
    "biom": "Wald",
    "sollstufe": 3,
    "ertragsklasse": "A4",
    "anforderungstyp": [
      "B4"
    ],
    "hp": 230,
    "resistenzen": {
      "physisch": 0.55,
      "feuer": 0.2,
      "eis": -0.3,
      "gift": 0,
      "magie": 0.2
    },
    "schaden_pro_treffer": 40,
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
        "effekt": "er bleibt 1,4 s stehen und quittiert, in dieser Zeit fällt seine Resistenz auf 0"
      }
    ],
    "berechnete_ttk_s": 20.9,
    "xp": 526,
    "gold_min": 54,
    "gold_max": 113,
    "loot": [
      {
        "item": "Kurierschuhe-Sohle",
        "chance": 0.3
      },
      {
        "item": "Goblin-Zeh",
        "chance": 0.25
      },
      {
        "item": "Benachrichtigungszettel",
        "chance": 0.45
      }
    ],
    "konter_in_einem_satz": "Nicht hinterherlaufen, sondern das 1,4 s lange Abgabefenster abwarten und dort den ganzen Schaden hineinlegen.",
    "flavor_de": "Er war da. Du warst nur leider nicht da, wo er war. Der Zettel im Baum sagt, du sollst es beim Amt versuchen."
  },
  {
    "id": "su_blubberakte",
    "name": "Blubberakte",
    "biom": "Sumpf",
    "sollstufe": 3,
    "ertragsklasse": "A1",
    "anforderungstyp": [
      "B1",
      "B7"
    ],
    "hp": 59,
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
        "name": "Auftauchen",
        "vorwarnzeit_ms": 400,
        "reichweite": "nah (24)",
        "effekt": "Blasen an der Oberfläche sind die Vorwarnung, dann der Erstschlag"
      },
      {
        "name": "Schmatzen",
        "vorwarnzeit_ms": 300,
        "reichweite": "nah (24)",
        "effekt": "Grundtreffer, verlangsamt kurz um ein Viertel"
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
        "item": "Geisterschleier",
        "chance": 0.08
      },
      {
        "item": "Aufgeweichtes Blatt",
        "chance": 0.25
      }
    ],
    "konter_in_einem_satz": "Auf die Blasen achten und nicht über offenes Wasser laufen, dann sind sie einzeln und harmlos.",
    "flavor_de": "Eine Akte, die im Moor lag, bis sie das Blubbern gelernt hat. Sie ist noch immer nass und noch immer nicht bearbeitet."
  },
  {
    "id": "su_moorbescheid",
    "name": "Der Moorbescheid",
    "biom": "Sumpf",
    "sollstufe": 4,
    "ertragsklasse": "A2",
    "anforderungstyp": [
      "B5"
    ],
    "hp": 385,
    "resistenzen": {
      "physisch": 0.5,
      "feuer": -0.5,
      "eis": 0.15,
      "gift": 0.9,
      "magie": 0.15
    },
    "schaden_pro_treffer": 22,
    "angriffsintervall_s": 2.0,
    "tempo": 26,
    "angriffsmuster": [
      {
        "name": "Durchweichen",
        "vorwarnzeit_ms": 450,
        "reichweite": "nah (30)",
        "effekt": "schwerer, langsamer Schlag, Grundtreffer"
      },
      {
        "name": "Faulgasstoß",
        "vorwarnzeit_ms": 550,
        "reichweite": "Kegel (70)",
        "effekt": "ersetzt den Grundtreffer, sperrt 4 s lang die Trankwirkung"
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
        "item": "Geisterschleier",
        "chance": 0.2
      },
      {
        "item": "Versiegelte Zweitschrift",
        "chance": 0.15
      }
    ],
    "konter_in_einem_satz": "Anzünden. Nass gewordenes Papier hält Stahl aus, aber keine Flamme.",
    "flavor_de": "Seit dreißig Jahren im Moor, seit dreißig Jahren bestandskräftig. Trocken wäre er nur ein Blatt."
  },
  {
    "id": "su_amtsschimmel",
    "name": "Der Amtsschimmel",
    "biom": "Sumpf",
    "sollstufe": 5,
    "ertragsklasse": "A3",
    "anforderungstyp": [
      "B4",
      "B6"
    ],
    "hp": 470,
    "resistenzen": {
      "physisch": 0.15,
      "feuer": -0.3,
      "eis": 0.1,
      "gift": 0.5,
      "magie": 0.3
    },
    "schaden_pro_treffer": 56,
    "angriffsintervall_s": 1.8,
    "tempo": 118,
    "angriffsmuster": [
      {
        "name": "Wiedervorlage",
        "vorwarnzeit_ms": 500,
        "reichweite": "fern (150)",
        "effekt": "heilt einen Nachbarn um 12 Prozent, sichtbarer Faden zwischen beiden"
      },
      {
        "name": "Ausweichschritt",
        "vorwarnzeit_ms": 350,
        "reichweite": "nah (28)",
        "effekt": "Grundtreffer im Zurückweichen, er bleibt nie stehen"
      }
    ],
    "berechnete_ttk_s": 13.9,
    "xp": 366,
    "gold_min": 54,
    "gold_max": 113,
    "loot": [
      {
        "item": "Schimmelquaste",
        "chance": 0.45
      },
      {
        "item": "Feuchte Bescheinigung",
        "chance": 0.18
      },
      {
        "item": "Wiedervorlagemappe",
        "chance": 0.2
      }
    ],
    "konter_in_einem_satz": "Zuerst ihn, nicht die Geheilten, und ihn nur an der Wand oder im Wasser stellen, wo er nicht ausweichen kann.",
    "flavor_de": "Er kämpft nicht, er verlängert. Alles, was er anschaut, bekommt eine neue Frist und dadurch neue Gesundheit."
  },
  {
    "id": "su_irrlicht",
    "name": "Irrlicht der Fristsetzung",
    "biom": "Sumpf",
    "sollstufe": 5,
    "ertragsklasse": "A4",
    "anforderungstyp": [
      "B3",
      "B4"
    ],
    "hp": 475,
    "resistenzen": {
      "physisch": 0.5,
      "feuer": 0.3,
      "eis": -0.35,
      "gift": 0.4,
      "magie": 0.1
    },
    "schaden_pro_treffer": 130,
    "angriffsintervall_s": 2.0,
    "tempo": 132,
    "angriffsmuster": [
      {
        "name": "Fristablauf",
        "vorwarnzeit_ms": 650,
        "reichweite": "fern (170)",
        "effekt": "schwerer Einzelschlag, der Countdown über dem Kopf ist die Vorwarnung"
      },
      {
        "name": "Verwehen",
        "vorwarnzeit_ms": 400,
        "reichweite": "kein Schaden",
        "effekt": "setzt 1,2 s aus und ist dabei unverwundbar, danach 2 s offen"
      }
    ],
    "berechnete_ttk_s": 23.9,
    "xp": 817,
    "gold_min": 85,
    "gold_max": 178,
    "loot": [
      {
        "item": "Irrlicht-Funke",
        "chance": 0.4
      },
      {
        "item": "Sumpfgallert",
        "chance": 0.2
      },
      {
        "item": "Fristsetzungsbescheid",
        "chance": 0.3
      }
    ],
    "konter_in_einem_satz": "Schlagen, sobald das Verwehen endet, und in der Fristablauf-Vorwarnung seitlich raus.",
    "flavor_de": "Es setzt Fristen, die niemand beantragt hat, und läuft dann weg, bevor man widersprechen kann. Sehr amtlich."
  },
  {
    "id": "wu_skarabaeus",
    "name": "Papierstaub-Skarabäus",
    "biom": "Wüste",
    "sollstufe": 4,
    "ertragsklasse": "A1",
    "anforderungstyp": [
      "B5"
    ],
    "hp": 43,
    "resistenzen": {
      "physisch": 0.5,
      "feuer": 0.85,
      "eis": -0.4,
      "gift": 0.3,
      "magie": 0
    },
    "schaden_pro_treffer": 8,
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
        "effekt": "ersetzt den Grundtreffer, nimmt 1 s lang Sicht statt Leben"
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
        "item": "Skorpionstachel",
        "chance": 0.1
      },
      {
        "item": "Sandiger Vordruck",
        "chance": 0.25
      }
    ],
    "konter_in_einem_satz": "Eis, notfalls Stahl. Wer hier Feuer wirft, bezahlt zehn Sekunden für nichts.",
    "flavor_de": "Er frisst Aktenstaub und hat davon einen Panzer bekommen, der nicht brennt. Das ist im Brandabschnitt eine Karriere."
  },
  {
    "id": "wu_steinbescheid",
    "name": "Der Steinbescheid",
    "biom": "Wüste",
    "sollstufe": 5,
    "ertragsklasse": "A2",
    "anforderungstyp": [
      "B2",
      "B5"
    ],
    "hp": 415,
    "resistenzen": {
      "physisch": 0.55,
      "feuer": 0.4,
      "eis": -0.35,
      "gift": 0.2,
      "magie": 0.1
    },
    "schaden_pro_treffer": 31,
    "angriffsintervall_s": 2.2,
    "tempo": 24,
    "angriffsmuster": [
      {
        "name": "Absetzen",
        "vorwarnzeit_ms": 500,
        "reichweite": "nah (34)",
        "effekt": "schwerer Grundtreffer, kurzer Bodenriss davor"
      },
      {
        "name": "Rechtskraft",
        "vorwarnzeit_ms": 800,
        "reichweite": "Ring (110)",
        "effekt": "ersetzt den Grundtreffer, Druckwelle rundum, weit sichtbar"
      }
    ],
    "berechnete_ttk_s": 12.0,
    "xp": 221,
    "gold_min": 37,
    "gold_max": 78,
    "loot": [
      {
        "item": "Golem-Splitter",
        "chance": 0.35
      },
      {
        "item": "Panzerspan",
        "chance": 0.25
      },
      {
        "item": "Beglaubigter Brocken",
        "chance": 0.15
      }
    ],
    "konter_in_einem_satz": "Frost macht den Stein spröde, danach reicht Geduld.",
    "flavor_de": "Er ist nicht besonders wütend, er ist nur rechtskräftig. Dagegen hilft kein Argument, nur Temperatur."
  },
  {
    "id": "wu_nachforderung",
    "name": "Nachforderungsskorpion",
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
    "schaden_pro_treffer": 118,
    "angriffsintervall_s": 2.4,
    "tempo": 96,
    "angriffsmuster": [
      {
        "name": "Nachforderung",
        "vorwarnzeit_ms": 450,
        "reichweite": "nah (28)",
        "effekt": "sehr harter Einzelstich, Stachel hebt sichtbar an"
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
        "item": "Krabbenschere",
        "chance": 0.15
      },
      {
        "item": "Nachforderungsbescheid",
        "chance": 0.25
      }
    ],
    "konter_in_einem_satz": "Nach jedem gehobenen Stachel einen Schritt raus, dann fällt die zweite Nachforderung weg.",
    "flavor_de": "Der erste Bescheid war zu niedrig, sagt er, und stellt das sofort richtig. Zweimal."
  },
  {
    "id": "wu_duenenpriester",
    "name": "Dünenpriester der Verfügung",
    "biom": "Wüste",
    "sollstufe": 7,
    "ertragsklasse": "A4",
    "anforderungstyp": [
      "B4",
      "B6"
    ],
    "hp": 830,
    "resistenzen": {
      "physisch": 0.45,
      "feuer": 0.5,
      "eis": -0.3,
      "gift": 0.2,
      "magie": 0.2
    },
    "schaden_pro_treffer": 171,
    "angriffsintervall_s": 2.0,
    "tempo": 104,
    "angriffsmuster": [
      {
        "name": "Verfügung",
        "vorwarnzeit_ms": 900,
        "reichweite": "fern (160)",
        "effekt": "gibt allen Skorpionen im Umkreis 25 Prozent mehr Schaden, 2,4 s Standzeit"
      },
      {
        "name": "Sandschritt",
        "vorwarnzeit_ms": 350,
        "reichweite": "nah (26)",
        "effekt": "Grundtreffer beim Zurückweichen, er hält Abstand von rund 140"
      }
    ],
    "berechnete_ttk_s": 29.9,
    "xp": 1251,
    "gold_min": 115,
    "gold_max": 242,
    "loot": [
      {
        "item": "Priesterquaste",
        "chance": 0.45
      },
      {
        "item": "Skorpionstachel",
        "chance": 0.2
      },
      {
        "item": "Verfügung in Abschrift",
        "chance": 0.3
      }
    ],
    "konter_in_einem_satz": "Das 2,4 s lange Verfügungsfenster ist die einzige Gelegenheit, ihn einzuholen, alles andere ist Hinterherlaufen.",
    "flavor_de": "Er kämpft nie selbst, er verfügt nur, dass andere es tun. Sein Stab hat mehr Dienstjahre als das Amt."
  },
  {
    "id": "ho_umlauf",
    "name": "Umlauffledermaus",
    "biom": "Höhle",
    "sollstufe": 6,
    "ertragsklasse": "A1",
    "anforderungstyp": [
      "B1"
    ],
    "hp": 72,
    "resistenzen": {
      "physisch": 0,
      "feuer": -0.2,
      "eis": -0.1,
      "gift": 0.3,
      "magie": 0
    },
    "schaden_pro_treffer": 10,
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
        "effekt": "ersetzt den Grundtreffer, hängt dir 2 s lang eine Sichtbehinderung an"
      }
    ],
    "berechnete_ttk_s": 1.6,
    "xp": 23,
    "gold_min": 20,
    "gold_max": 42,
    "loot": [
      {
        "item": "Fledermausflügel",
        "chance": 0.4
      },
      {
        "item": "Spinnenbein",
        "chance": 0.08
      },
      {
        "item": "Umlaufmappe",
        "chance": 0.2
      }
    ],
    "konter_in_einem_satz": "Breit schlagen statt zielen, der Schwarm stirbt an einem einzigen guten Hieb.",
    "flavor_de": "Sie trägt eine Mappe von A nach B und wieder zurück, seit niemand mehr weiß, was in der Mappe ist."
  },
  {
    "id": "ho_deckenlauerer",
    "name": "Der Deckenlauerer",
    "biom": "Höhle",
    "sollstufe": 7,
    "ertragsklasse": "A2",
    "anforderungstyp": [
      "B2",
      "B7"
    ],
    "hp": 460,
    "resistenzen": {
      "physisch": 0.3,
      "feuer": -0.3,
      "eis": 0.2,
      "gift": 0.3,
      "magie": 0.15
    },
    "schaden_pro_treffer": 37,
    "angriffsintervall_s": 1.7,
    "tempo": 52,
    "angriffsmuster": [
      {
        "name": "Fallenlassen",
        "vorwarnzeit_ms": 550,
        "reichweite": "nah (34)",
        "effekt": "Schatten am Boden ist die Vorwarnung, Eröffnung mit doppelter Wucht"
      },
      {
        "name": "Nachfassen",
        "vorwarnzeit_ms": 400,
        "reichweite": "nah (30)",
        "effekt": "Grundtreffer, zieht dich ein Stück zu sich"
      }
    ],
    "berechnete_ttk_s": 13.0,
    "xp": 293,
    "gold_min": 51,
    "gold_max": 107,
    "loot": [
      {
        "item": "Spinnenbein",
        "chance": 0.4
      },
      {
        "item": "Panzerspan",
        "chance": 0.2
      },
      {
        "item": "Deckenprotokoll",
        "chance": 0.15
      }
    ],
    "konter_in_einem_satz": "Vor dem Betreten nach oben schauen, danach ist er nur noch langsam und dick.",
    "flavor_de": "Er hängt seit Jahren an der Decke der Registratur und wartet auf jemanden, der zuständig ist. Du bist zuständig."
  },
  {
    "id": "ho_sammelmahnung",
    "name": "Die Sammelmahnung",
    "biom": "Höhle",
    "sollstufe": 8,
    "ertragsklasse": "A3",
    "anforderungstyp": [
      "B1",
      "B3"
    ],
    "hp": 680,
    "resistenzen": {
      "physisch": 0.2,
      "feuer": 0,
      "eis": 0.1,
      "gift": 0.4,
      "magie": -0.3
    },
    "schaden_pro_treffer": 149,
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
        "effekt": "stehen drei beieinander, schlagen sie gleichzeitig, Vorwarnung färbt alle drei"
      }
    ],
    "berechnete_ttk_s": 14.1,
    "xp": 491,
    "gold_min": 83,
    "gold_max": 174,
    "loot": [
      {
        "item": "Skelettknöchel",
        "chance": 0.35
      },
      {
        "item": "Irrlicht-Funke",
        "chance": 0.15
      },
      {
        "item": "Mahnbescheid, dritte Stufe",
        "chance": 0.3
      }
    ],
    "konter_in_einem_satz": "Aufbrechen und einzeln erledigen, ein gleichlautender Dreierschlag kostet die halbe Leiste.",
    "flavor_de": "Drei Mahnungen desselben Vorgangs, die sich einig sind. Einzeln sind sie Papier, zu dritt sind sie ein Vollstreckungstitel."
  },
  {
    "id": "ho_bestandskraft",
    "name": "Steingolem der Bestandskraft",
    "biom": "Höhle",
    "sollstufe": 9,
    "ertragsklasse": "A4",
    "anforderungstyp": [
      "B2",
      "B5"
    ],
    "hp": 1220,
    "resistenzen": {
      "physisch": 0.9,
      "feuer": 0,
      "eis": 0,
      "gift": 0.6,
      "magie": -0.4
    },
    "schaden_pro_treffer": 274,
    "angriffsintervall_s": 2.6,
    "tempo": 28,
    "angriffsmuster": [
      {
        "name": "Faustschlag",
        "vorwarnzeit_ms": 700,
        "reichweite": "nah (36)",
        "effekt": "sehr schwerer Grundtreffer, Arm hebt weit sichtbar an"
      },
      {
        "name": "Unanfechtbar",
        "vorwarnzeit_ms": 900,
        "reichweite": "Ring (130)",
        "effekt": "ersetzt den Grundtreffer, Druckwelle, danach 3 s Erschöpfung ohne Angriff"
      }
    ],
    "berechnete_ttk_s": 34.0,
    "xp": 1654,
    "gold_min": 144,
    "gold_max": 302,
    "loot": [
      {
        "item": "Golem-Splitter",
        "chance": 0.5
      },
      {
        "item": "Panzerspan",
        "chance": 0.25
      },
      {
        "item": "Unanfechtbarer Beschluss",
        "chance": 0.12
      }
    ],
    "konter_in_einem_satz": "Stahl prallt ab, also Manapool leeren, in der Erschöpfung nachladen und den Kreislauf so lange fahren, bis er fällt.",
    "flavor_de": "Er ist bestandskräftig geworden und weiß das. Schwerter sind gegen ihn kein zulässiges Rechtsmittel, Magie schon."
  },
  {
    "id": "ru_aktenbote",
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
    "schaden_pro_treffer": 21,
    "angriffsintervall_s": 1.4,
    "tempo": 88,
    "angriffsmuster": [
      {
        "name": "Zuschlag",
        "vorwarnzeit_ms": 400,
        "reichweite": "fern (120)",
        "effekt": "gibt einem Nachbarn 20 Prozent mehr Schaden, kein eigener Schaden"
      },
      {
        "name": "Aktenkante",
        "vorwarnzeit_ms": 300,
        "reichweite": "nah (24)",
        "effekt": "Grundtreffer, schmal und schnell"
      }
    ],
    "berechnete_ttk_s": 2.2,
    "xp": 39,
    "gold_min": 26,
    "gold_max": 55,
    "loot": [
      {
        "item": "Botenmappe",
        "chance": 0.35
      },
      {
        "item": "Schattenfetzen",
        "chance": 0.15
      },
      {
        "item": "Zuschlagsverfügung",
        "chance": 0.25
      }
    ],
    "konter_in_einem_satz": "Zuerst die Boten, dann alles andere, sie sind so weich wie ihr Zuschlag hart ist.",
    "flavor_de": "Er trägt nichts Eigenes bei außer der Nachricht, dass jetzt alle härter zuschlagen dürfen. Und daran hält sich hier jeder."
  },
  {
    "id": "ru_mumie",
    "name": "Mumie der versiegelten Akte",
    "biom": "Ruine",
    "sollstufe": 9,
    "ertragsklasse": "A2",
    "anforderungstyp": [
      "B2"
    ],
    "hp": 550,
    "resistenzen": {
      "physisch": 0.4,
      "feuer": -0.45,
      "eis": 0.2,
      "gift": 0.9,
      "magie": 0.1
    },
    "schaden_pro_treffer": 60,
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
        "effekt": "ersetzt den Grundtreffer, sperrt 5 s lang die Trankwirkung"
      }
    ],
    "berechnete_ttk_s": 14.0,
    "xp": 365,
    "gold_min": 64,
    "gold_max": 134,
    "loot": [
      {
        "item": "Mumienbinde",
        "chance": 0.45
      },
      {
        "item": "Geisterschleier",
        "chance": 0.2
      },
      {
        "item": "Versiegelte Akte",
        "chance": 0.18
      }
    ],
    "konter_in_einem_satz": "Feuer an die Binden und während der Siegelstaub-Sperre gar nicht erst auf den Trank hoffen.",
    "flavor_de": "Versiegelt, verschnürt, seit vierhundert Jahren nicht geöffnet. Sie hält das für Datenschutz."
  },
  {
    "id": "ru_knochenritter",
    "name": "Knochenritter der Dienstvorschrift",
    "biom": "Ruine",
    "sollstufe": 9,
    "ertragsklasse": "A3",
    "anforderungstyp": [
      "B7",
      "B3"
    ],
    "hp": 890,
    "resistenzen": {
      "physisch": 0.25,
      "feuer": 0.1,
      "eis": -0.25,
      "gift": 0.6,
      "magie": 0.1
    },
    "schaden_pro_treffer": 204,
    "angriffsintervall_s": 2.5,
    "tempo": 82,
    "angriffsmuster": [
      {
        "name": "Aus der Nische",
        "vorwarnzeit_ms": 600,
        "reichweite": "nah (40)",
        "effekt": "Eröffnung aus der Wand, weit ausholender Bogen"
      },
      {
        "name": "Dienstweg",
        "vorwarnzeit_ms": 450,
        "reichweite": "nah (34)",
        "effekt": "Grundtreffer, immer exakt drei Schläge, dann 1,6 s Pause"
      }
    ],
    "berechnete_ttk_s": 18.1,
    "xp": 675,
    "gold_min": 92,
    "gold_max": 193,
    "loot": [
      {
        "item": "Skelettknöchel",
        "chance": 0.45
      },
      {
        "item": "Hundszahn",
        "chance": 0.15
      },
      {
        "item": "Dienstvorschrift, Randfassung",
        "chance": 0.2
      }
    ],
    "konter_in_einem_satz": "Die drei Schläge des Dienstwegs ausweichen und in der Pause zuschlagen, er weicht davon nie ab.",
    "flavor_de": "Er hält sich an die Vorschrift, auch beim Töten: drei Schläge, dann Pause, dann Bericht. Die Pause ist dein Rechtsmittel."
  },
  {
    "id": "ru_sammelverfuegung",
    "name": "Die Sammelverfügung",
    "biom": "Ruine",
    "sollstufe": 10,
    "ertragsklasse": "A4",
    "anforderungstyp": [
      "B4",
      "B5"
    ],
    "hp": 1240,
    "resistenzen": {
      "physisch": 0.7,
      "feuer": -0.35,
      "eis": 0.45,
      "gift": 0.6,
      "magie": 0.45
    },
    "schaden_pro_treffer": 336,
    "angriffsintervall_s": 2.2,
    "tempo": 112,
    "angriffsmuster": [
      {
        "name": "Anhörung",
        "vorwarnzeit_ms": 800,
        "reichweite": "fern (180)",
        "effekt": "schwerer Fernschlag, sie bleibt dafür 1,8 s stehen"
      },
      {
        "name": "Zurückverweisen",
        "vorwarnzeit_ms": 400,
        "reichweite": "nah (30)",
        "effekt": "Grundtreffer, stößt dich weit zurück und sie zieht sich nach"
      },
      {
        "name": "Aktenmantel",
        "vorwarnzeit_ms": 500,
        "reichweite": "kein Schaden",
        "effekt": "zieht 2,5 s lang alle Resistenzen auf 0,8 hoch, das Blatt darunter bleibt aber brennbar"
      }
    ],
    "berechnete_ttk_s": 35.9,
    "xp": 1857,
    "gold_min": 159,
    "gold_max": 334,
    "loot": [
      {
        "item": "Fürstenkrone-Fragment",
        "chance": 0.1
      },
      {
        "item": "Ruferzunge",
        "chance": 0.3
      },
      {
        "item": "Sammelverfügung, Urschrift",
        "chance": 0.4
      }
    ],
    "konter_in_einem_satz": "Nur während der Anhörung stehen bleiben und Feuer legen, im Aktenmantel gar nicht erst schlagen.",
    "flavor_de": "Sie fasst alles zusammen, was je gegen dich lief, und trägt es in einem Mantel aus Papier vor sich her. Papier."
  }
]
```

## 3. Selbstprüfung

Gerechnet mit `tools/monsterkatalog.py`, nicht von Hand. Sollwerte in Klammern.

### 3.1 Kernprüfung

| Gegner | Soll | Klasse | Route | TTK (Band) | XP | XP je Kampfsekunde (Soll) | Gefahrenbudget (Band) | Befund |
|---|---|---|---|---|---|---|---|---|
| Vordruckling | 1 | A1 | physisch | 2,0 s (1 bis 3) | 10 | 5,07 (5,0) | 46,7 s (über 30) | ok |
| Wandelnder Ablagestapel | 2 | A2 | physisch | 10,1 s (8 bis 15) | 107 | 10,63 (10,61) | 21,8 s (15 bis 25) | ok |
| Waldschamane im Widerspruch | 3 | A3 | physisch | 13,0 s (12 bis 25) | 251 | 19,34 (19,33) | 8,5 s (6 bis 10) | ok |
| Der Zustellbote | 3 | A4 | physisch | 20,9 s (20 bis 40) | 526 | 25,11 (25,13) | 4,4 s (3 bis 6) | ok |
| Blubberakte | 3 | A1 | physisch | 2,4 s (1 bis 3) | 23 | 9,51 (9,67) | 45,3 s (über 30) | ok |
| Der Moorbescheid | 4 | A2 | feuer | 10,0 s (8 bis 15) | 161 | 16,06 (16,08) | 20,1 s (15 bis 25) | ok |
| Der Amtsschimmel | 5 | A3 | physisch | 13,9 s (12 bis 25) | 366 | 26,28 (26,27) | 9,1 s (6 bis 10) | ok |
| Irrlicht der Fristsetzung | 5 | A4 | physisch | 23,9 s (20 bis 40) | 817 | 34,14 (34,14) | 4,2 s (3 bis 6) | ok |
| Papierstaub-Skarabäus | 4 | A1 | physisch | 2,5 s (1 bis 3) | 29 | 11,6 (11,49) | 36,9 s (über 30) | ok |
| Der Steinbescheid | 5 | A2 | eis | 12,0 s (8 bis 15) | 221 | 18,4 (18,39) | 21,8 s (15 bis 25) | ok |
| Nachforderungsskorpion | 6 | A3 | physisch | 16,0 s (12 bis 25) | 469 | 29,29 (29,3) | 7,0 s (6 bis 10) | ok |
| Dünenpriester der Verfügung | 7 | A4 | physisch | 29,9 s (20 bis 40) | 1251 | 41,78 (41,78) | 4,5 s (3 bis 6) | ok |
| Umlauffledermaus | 6 | A1 | physisch | 1,6 s (1 bis 3) | 23 | 14,41 (14,65) | 36,8 s (über 30) | ok |
| Der Deckenlauerer | 7 | A2 | physisch | 13,0 s (8 bis 15) | 293 | 22,47 (22,5) | 19,1 s (15 bis 25) | ok |
| Die Sammelmahnung | 8 | A3 | physisch | 14,1 s (12 bis 25) | 491 | 34,83 (34,82) | 7,5 s (6 bis 10) | ok |
| Steingolem der Bestandskraft | 9 | A4 | magie | 34,0 s (20 bis 40) | 1654 | 48,59 (48,58) | 5,0 s (3 bis 6) | ok |
| Der Aktenbote | 8 | A1 | physisch | 2,2 s (1 bis 3) | 39 | 17,42 (17,41) | 38,8 s (über 30) | ok |
| Mumie der versiegelten Akte | 9 | A2 | physisch | 14,0 s (8 bis 15) | 365 | 26,16 (26,16) | 17,9 s (15 bis 25) | ok |
| Knochenritter der Dienstvorschrift | 9 | A3 | physisch | 18,1 s (12 bis 25) | 675 | 37,37 (37,37) | 6,5 s (6 bis 10) | ok |
| Die Sammelverfügung | 10 | A4 | feuer | 35,9 s (20 bis 40) | 1857 | 51,76 (51,75) | 4,0 s (3 bis 6) | ok |

Alle zwanzig Zeilen liegen in ihren Bändern. Die XP-Rate weicht nirgends mehr als ein Prozent
vom Sollwert ab, der Rest ist Rundung auf ganze XP.

### 3.2 Rudelwerte und Vorwarnzeiten

| Gegner | Klasse | Rudelgröße | Gefahrenbudget einzeln | Gefahrenbudget im Rudel | kürzeste Vorwarnung | Mindestvorwarnung |
|---|---|---|---|---|---|---|
| Vordruckling | A1 | 5 | 46,7 s | 6,1 s | 300 ms | 250 ms |
| Wandelnder Ablagestapel | A2 | 1 | 21,8 s | 21,8 s | 420 ms | 250 ms |
| Waldschamane im Widerspruch | A3 | 1 | 8,5 s | 8,5 s | 420 ms | 350 ms |
| Der Zustellbote | A4 | 1 | 4,4 s | 4,4 s | 380 ms | 350 ms |
| Blubberakte | A1 | 4 | 45,3 s | 9,0 s | 300 ms | 250 ms |
| Der Moorbescheid | A2 | 1 | 20,1 s | 20,1 s | 450 ms | 250 ms |
| Der Amtsschimmel | A3 | 1 | 9,1 s | 9,1 s | 350 ms | 350 ms |
| Irrlicht der Fristsetzung | A4 | 1 | 4,2 s | 4,2 s | 400 ms | 350 ms |
| Papierstaub-Skarabäus | A1 | 3 | 36,9 s | 10,1 s | 300 ms | 250 ms |
| Der Steinbescheid | A2 | 1 | 21,8 s | 21,8 s | 500 ms | 250 ms |
| Nachforderungsskorpion | A3 | 1 | 7,0 s | 7,0 s | 350 ms | 350 ms |
| Dünenpriester der Verfügung | A4 | 1 | 4,5 s | 4,5 s | 350 ms | 350 ms |
| Umlauffledermaus | A1 | 6 | 36,8 s | 5,1 s | 250 ms | 250 ms |
| Der Deckenlauerer | A2 | 1 | 19,1 s | 19,1 s | 400 ms | 250 ms |
| Die Sammelmahnung | A3 | 3 | 7,5 s | 2,4 s | 500 ms | 350 ms |
| Steingolem der Bestandskraft | A4 | 1 | 5,0 s | 5,0 s | 700 ms | 350 ms |
| Der Aktenbote | A1 | 4 | 38,8 s | 8,1 s | 300 ms | 250 ms |
| Mumie der versiegelten Akte | A2 | 1 | 17,9 s | 17,9 s | 500 ms | 250 ms |
| Knochenritter der Dienstvorschrift | A3 | 1 | 6,5 s | 6,5 s | 450 ms | 350 ms |
| Die Sammelverfügung | A4 | 1 | 4,0 s | 4,0 s | 400 ms | 350 ms |

Die Mindestvorwarnung von 350 ms gilt laut Auftrag für A3 und A4 und ist überall eingehalten.
Für A1 und A2 ist 250 ms als Hausregel gesetzt, damit kein Angriff ohne Ankündigung existiert.
Alle 6 Gegner mit Rudelgröße über 1 fallen als Gruppe unter ihr Klassenband, am
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
| Der Moorbescheid | 22,4 s | **10,0 s** | 17,7 s | 150,4 s * | 17,7 s |
| Papierstaub-Skarabäus | **2,5 s** | 11,2 s | 1,2 s | 2,4 s * | 1,7 s |
| Der Steinbescheid | 23,2 s | 27,0 s | **12,0 s** | 20,3 s * | 18,0 s |
| Steingolem der Bestandskraft | 185,7 s | 47,7 s | 47,7 s | 119,1 s * | **34,0 s** |
| Die Sammelverfügung | 58,2 s | **35,9 s** | 88,1 s | 121,1 s * | 88,1 s |

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

### 3.5 Prüfung gegen Kopien mit größeren Zahlen

Der Verbotstest lautet: gibt es zwei Gegner, die dieselbe Frage stellen und sich nur in der
Größe der Antwort unterscheiden? Die vier Paare, die sich am nächsten kommen:

| Paar | Warum es keine Kopie ist |
|---|---|
| Wandelnder Ablagestapel und Der Steinbescheid, beide A2 und Schwamm | Der Stapel ist ein reiner Geduldsgegner mit einem Kegel, den man umläuft. Der Steinbescheid ist zusätzlich Gate: gegen Stahl dauert er 22 s, gegen Frost 12 s. Der eine prüft Ausdauer, der andere Vorbereitung. |
| Der Zustellbote und Der Dünenpriester, beide A4 und Kiter | Der Bote hat ein Fenster, das er selbst öffnet und das man abwarten muss. Der Priester öffnet sein Fenster nur, wenn er andere buffen will, also erzwingt er, dass man den Schwarm überhaupt erst stehen lässt. |
| Waldschamane und Knochenritter, beide A3 mit Hinterhalt | Der Schamane bestraft Distanz und fällt im Nahkampf sofort. Der Ritter bestraft Nähe zum falschen Zeitpunkt und hat ein starres Muster aus drei Schlägen und Pause. Gegenteilige Konter. |
| Vordruckling und Umlauffledermaus, beide A1 und Schwarm | Der Vordruckling steht und sammelt sich, die Fledermaus fliegt durch und dreht ab. Der eine belohnt einen breiten Hieb an der richtigen Stelle, der andere Timing im Durchflug. |

### 3.6 Was die Prüfung gefunden und der Katalog korrigiert hat

Vier Befunde aus dem ersten Rechendurchlauf, alle vor dieser Ausgabe behoben:

1. **Irrlicht der Fristsetzung** traf für 186 Schaden bei 198 Spieler-HP. Rechnerisch im Band,
   praktisch ein Sofort-Tod aus dem Nichts. Intervall von 2,6 s auf 2,0 s, Treffer auf 130,
   Gefahrenbudget von 3,8 s auf 4,2 s. Zwei Fehler sind jetzt tödlich, einer nicht.
2. **Nachforderungsskorpion** stand mit Rudelgröße 2 im Roster, obwohl er kein Schwarmtyp ist.
   Sein Gruppenbudget lag bei 3,4 s und damit unter dem A3-Band, ohne dass ein Anforderungstyp
   das gerechtfertigt hätte. Rudelgröße auf 1.
3. **Der Deckenlauerer** war gegen Gift verwundbar. Gift kann der Spieler nicht wirken, die
   Weichstelle war also totes Blatt. Jetzt gegen Feuer verwundbar.
4. **Eis war die Weichstelle in fast jedem zweiten Eintrag.** Amtsschimmel und
   Nachforderungsskorpion wurden auf Feuer und Magie umgestellt. Die Verteilung der
   Verwundbarkeiten lautet jetzt Feuer 10, Eis 7, Magie 3, physisch 1, was ungefähr der
   Reihenfolge entspricht, in der ein Spieler die Zauberzweige aufmacht. Zwei Gegner tragen
   zwei Weichstellen, deshalb sind es 21 Einträge bei 20 Gegnern.

Zusätzlich wurde Gold von der XP entkoppelt. Aus dem XP-Wert abgeleitet hätte die
Sammelverfügung 557 bis 1114 Gold getragen, mehr als der Schattenfürst mit 300 bis 500. Gold
hängt jetzt an Sollstufe und Klasse und bleibt unter dem Bosswert.

### 3.7 Was offen bleibt

Drei Punkte, die dieser Katalog benennt und nicht löst:

1. **Ein A4-Kill auf Sollstufe 10 trägt rund 1857 XP, ein Stufenaufstieg kostet dort 784.** Das
   folgt zwingend aus den Vorgaben: 2,6 mal Ertrag bei 16 mal Kampfzeit. Ein Kill an der
   Sammelverfügung trägt so viel wie 48 Kills am Aktenboten, dem Fleiß-Gegner desselben
   Bioms. Wenn das zu schnell ist, gehört nicht der Katalog angefasst,
   sondern ein einziger Faktor k auf alle XP-Werte oder die Stufenkurve `35 * Stufe^1,35`. Die
   Verhältnisse zwischen den Klassen bleiben davon unberührt.
2. **Sumpf, Höhle und Ruine gibt es im Code noch nicht.** `BIOME_BANDS` kennt drei Bänder,
   `BIOM_AMT` und `BIOME_MOBS` je drei Einträge, und `ZUTAT_ADJ` gewichtet über die Schlüssel
   `grass`, `snow`, `sand` und `shadow`. Drei neue Schlüssel bedeuten drei neue Gewichte in
   jedem der Adjektive, sonst fällt die Loot-Signatur auf Null.
3. **Vier Muster brauchen Technik, die es noch nicht gibt**: Unverwundbarkeitsfenster
   (Irrlicht, Sammelverfügung), Heilen anderer Monster (Amtsschimmel), Schadensbuff auf
   Nachbarn (Aktenbote, Dünenpriester) und synchrone Gruppenangriffe (Sammelmahnung). Die
   Rückenregel und die Zweigregel aus `bauWelle()` zeigen, dass die Trefferprüfung in
   `hurtMon()` dafür der richtige Ort ist.

