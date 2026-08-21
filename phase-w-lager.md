## W-Lager: Das Lager der Beschwerden — ERLEDIGT

Ein umzäuntes Lager im Grasland, östlich des Dorfes. Drei neue Vorgangsarten, das
siebte Katalogbiom, und der erste Gegner des Spiels, der nie zuerst angreift.

### Warum ein Lager überhaupt in diese Welt passt

`GRAFIK-BESTAND-2026-08-21.md` hat `Cute_Fantasy_MilitaryCamp` unter „Was liegen
bleiben sollte" abgelegt, mit einem guten Grund: „das Monstralministerium führt keinen
Krieg, es bearbeitet Vorgänge. Die Weltbibel würde das kassieren, bevor es gebaut ist."

Das stimmt, und das Lager widerspricht dem nicht. **Es ist nicht das Lager des Amtes.**

Die Weltbibel, Kapitel 2: der Krieg ist nicht beendet, er ist *ausgesetzt bis zur
abschließenden Bearbeitung*. Das Vertragswerk wurde in dreifacher Ausfertigung
aufgesetzt, die dritte ging an die Gegenseite, und Zusteller Trepp konnte die Adresse
nicht lesen. Sie liegt bis heute in seinem Sack. Die Gegenseite hat also nie erfahren,
dass Frieden angeboten wurde.

Was diese Seite seither tut, steht ebenfalls schon in der Weltbibel, in Lisbeths
Sprachmarke, wörtlich: **„Und wenn er einfach nur wartet?"** Das Lager ist die Antwort
auf ihre Frage, und zwar zum Anfassen. Es macht die Kosten der Nichtzustellung zum
ersten Mal sichtbar, ohne dem Finale etwas wegzunehmen.

Katapult und Kanone bleiben deshalb im Pack. Belagerungsgerät behauptet, dass etwas
passiert. Der Witz ist, dass seit vierhundert Jahren nichts passiert.

### Die Figur am Tor, und warum sie keinen Titel trägt

Der erste Entwurf für diese Runde war, dem Lager einen Häuptling zu geben, der die
dritte Vertragsausfertigung hält. **Der Entwurf war falsch, und die Weltbibel sagt
warum.** Kapitel 18.10:

> Monster haben keine Titel. Deshalb sind sie Monster. Das ist die stille, hässliche
> Logik dieser Welt. Genau eine Ausnahme, und sie trägt das Finale: Fürst Nachtrag.

Ein Häuptling mit Rang bräche die Regel doppelt: er bekäme einen Titel, den die Welt
Monstern verweigert, und er nähme dem Finale seinen einzigen Sonderfall.

Gebaut ist deshalb eine Figur **ohne Titel**, die nur eine Vorgangsart hat wie jedes
andere Monster auch:

> **Das Empfangsbekenntnis.** Liegt seit vierhundert Jahren bereit, unterschrieben von
> niemandem. Es kann nichts tun, außer warten, dass ihm etwas übergeben wird.

Ein Empfangsbekenntnis ist das Formular, das eine Zustellung bestätigt und zurückgeht.
Ohne Dokument ist es nichts. Damit ist die Pointe des ganzen Ortes eine Verfahrensregel:
**das Lager kann nicht zugestellt werden, weil niemand darin empfangsberechtigt ist.**
Der Einzige, der es wäre, heißt Nachtrag, ist Fürst, und ist unbenachrichtigt — das
steht seit vierhundert Jahren als Bestandteil seines Titels da und hat nie jemand
gelesen.

### Die drei Vorgangsarten

| Monster | Vorgangsart | Warum es sich so verhält |
|---|---|---|
| Der Vorbehalt | Der Vorbehalt | Hält dich auf Abstand, lässt nichts an sich heran. Er hat nicht vor, dich zu verletzen, er hat vor, dich nicht durchzulassen. |
| Die Zwischennachricht | Die Zwischennachricht | Kommt von weit her, sagt nichts Neues, trifft trotzdem. Seit vierhundert Jahren derselbe Wortlaut. |
| Das Empfangsbekenntnis | Das Empfangsbekenntnis | Liegt seit vierhundert Jahren bereit, unterschrieben von niemandem. |

Alle drei gehören zum Goblin-Rig der Weltbibel, „Inhalt ohne Form": Beschwerden,
Widersprüche, Nachforderungen. Grünhaut heißt im Bestiarium seit jeher *Die Beschwerde:
laut, kurz, zahlreich, und im Grunde hat sie recht.* Das Lager ist dieselbe Aussage,
nur mit Palisade darum.

### Sie greifen nie zuerst an

Alle drei tragen `lagerwache:true`, und die Aggro-Prüfung im Monster-Update nimmt sie
von der Näheregel aus:

```js
if(!m.aggro && !m.def.lagerwache && m.leashT <= 0 && !imDorf && pd < m.def.aggro * …) m.aggro = true;
```

Aggressiv werden sie ausschließlich dadurch, getroffen zu werden — `hurtMon()` setzt
`m.aggro`, dieser Pfad nicht. **Wer am Tor vorbeigeht, geht vorbei. Wer zuschlägt, hat
angefangen.** Das ist keine Bequemlichkeit für den Spieler, das ist der Inhalt des
Ortes, und es ist die einzige Stelle im Spiel, an der die Frage „muss man das
eigentlich?" nicht von einer Figur gestellt wird, sondern von der Steuerung.

### Ein Blatt mit drei Rastern

Die Orks lagen seit G3 mit dem Vermerk „Raster-Konfidenz zu niedrig, ungeprüft" auf
Eis. Der Vermerk war berechtigt, und der Grund ist ungewöhnlich genug, ihn
aufzuschreiben: **`Orc_Chief.png` mischt drei Raster in einer Datei.**

| Bereich | Raster | Frames je Zeile | Inhalt |
|---|---|---|---|
| y 0..192 | 32×32 | 6 | Idle (Zeilen 0–2), Lauf (3–5), je Down/Seite/Hoch |
| y 192..384 | **64×64** | **8** | Angriff, Down/Seite/Hoch |
| y 384..512 | 32×32 | 4 | Zeile 12 der Sturz, 13–15 das Treffer-Aufblitzen |

Die Angriffszeile braucht die doppelte Zelle, weil der Waffenbogen über den Körper
hinausreicht. Der Ork selbst bleibt dabei gleich groß — sein Körper misst in beiden
Rastern 20 bis 24 Pixel, es wächst nur der Rahmen. Genau daran ist die G0-Heuristik
gescheitert: bei 32×32 spannen die Angriffszeilen in *jedem* Frame die volle Zellbreite,
dieselbe Signatur, an der schon das falsche Raster von `Fisherman_Fin` aufgefallen ist.

**Eingriff.** `CF_RIGS` erlaubt jetzt eine Raster-Ausnahme je Anim: ein dritter Eintrag
`[row, n, {fw, fh, ax, ay}]` überschreibt das Rig-Raster für diese eine Animation. Ohne
Ausnahme fällt der Eintrag auf das Rig-Raster zurück, **alle bisherigen Rigs bleiben
unverändert**. Vier Zeilen in der Registrierungsschleife.

Nebenbei fielen zwei weitere Blätter aus dem Manifest: `Goblin_Archer` und
`Goblin_Spearman` sind 48×48 im 6×13-Raster, nicht 32×32. Das scheitert schon an der
Arithmetik — 624 ist durch 32 nicht teilbar. Beide sind damit zeilengleich mit dem seit
G3 verbauten `Goblin_Maceman`.

### Der Ort

`LAGER` ist ein Rechteck von 19×13 Kacheln im Grasband, Literale wie überall hier im
alten 80er-Raster und per `DORF_DX`/`DORF_DY` einmal verschoben. Die Innenfläche wird
freigeräumt und die Palisade blockiert, beides an derselben Stelle im Ablauf und aus
demselben Grund wie beim Dorf-Rechteck: vor dem Baum- und Deko-Streuloop, sonst wächst
ein Baum ins Zelt.

Das Tor sitzt mittig in der Südwand und ist drei Kacheln breit, also genau die 48 Pixel
des Torblatts. Es ist der einzige Weg hinein.

**Skalierung 2, und warum.** Die MilitaryCamp-Blätter sind 16-Pixel-Kunst wie die
Tiles-Sätze — der Palisadenring misst 3×5 Kacheln in 48×80 Pixeln. Die Dorf-Gebäude aus
G5 liegen dagegen schon in 32 Pixeln je Kachel vor und stehen deshalb auf 1. Ohne die 2
steht die Palisade mit einer halben Kachel Lücke je Pfahl, und genau so stand sie im
ersten Durchgang.

Die Besatzung steht auf festen Plätzen statt gestreut — ein Lager, dessen Wachen jedes
Mal woanders stehen, ist kein Lager, sondern eine Lichtung mit Zaun. `imLager()` nimmt
das Rechteck zusätzlich aus der gewöhnlichen Monsterstreuung, wie `nahDorf()` es für das
Dorf tut: ein Chuchu zwischen den Zelten wäre weder Wache noch Eindringling, sondern ein
Setzfehler.

### Prüfprotokoll

Live im Browser, nicht nachgerechnet. `python3 serve.py`, Chromium über Playwright.

| Prüfung | Ergebnis |
|---|---|
| `tools/monsterkatalog.py` | **28 Gegner, 0 Verletzungen** (vorher 25, 0) |
| `monsterAssert()` beim Start | „28 Gegner geprueft, alle Baender eingehalten" |
| `tools/monster-fehlversuch.mjs` | alle Regeln greifen, unveränderter Katalog grün |
| Konsole, Quellbaum und Einzeldatei-Build | **je 0 Warnungen, 0 fehlende Assets** |
| Grafikdateien | 118 |
| Besatzung im Bild | 6 Wachen auf ihren festen Plätzen |
| **Spieler steht 4 s mitten im Lager** | **0 von 6 werden aggressiv** |
| Gewöhnliche Gegner im Lagerrechteck | 0 |

Messlauf, drei Läufe je Gegner und Richtung:

| Typ | Klasse | Sollstufe | TTK ist/soll | Überleben ist/soll |
|---|---|---|---|---|
| Der Vorbehalt | A2 | 5 | 12,0 / 11,5 s | 16,2 / 18,2 s |
| Die Zwischennachricht | A3 | 6 | 14,2 / 13,5 s | 7,6 / 6,6 s |

Beide im Band (A2: 8 bis 15 s und 15 bis 25 s, A3: 12 bis 25 s und 6 bis 10 s). Das
Empfangsbekenntnis fehlt in der Tabelle, weil seine Sollroute `magie` ist und der
Messlauf Zauberrouten überspringt — dieselbe Lücke wie bei Steingolem, Moorbescheid und
Dienstweg. Sein Band belegt `monsterAssert()` im laufenden Spiel.

### Drei Fehler, die erst der Blick aufs Bild gefunden hat

Alle drei standen schon im Spiel und wären in einer Zahlentabelle nicht aufgefallen:

1. **Die Besatzung war unsichtbar, weil es sie nicht gab.** `setzeLager()` lief vor
   `placeMonsters()`, und dessen erste Zeile ist `monsters.length = 0`. Sechs Wachen
   wurden erzeugt und stillschweigend wieder abgeräumt, bei jedem Kartenaufbau. Der
   Aufruf steht jetzt am Ende von `placeMonsters()` und überlebt damit auch jeden
   Neuaufbau.
2. **Die Palisade hatte Lücken** (Skalierung, s. oben).
3. **Das Empfangsbekenntnis stand hinter seinem eigenen Tor.** Das Torblatt ist bei
   Skalierung 2 rund 124 Pixel hoch, sortiert nach ihm und schnitt ihm die Beine ab.
   Zwei Kacheln weiter innen steht er davor.

### Bewusst offen

- **Man kann dem Lager nichts übergeben.** Es gibt keine Zustellung ans Lager, keinen
  Dialog am Tor, keine Möglichkeit, die Sache aufzulösen. Das ist Absicht für diese
  Runde: die Zustellung ist der Hauptstrang und gehört Trepp und Fürst Nachtrag. Das
  Lager stellt die Frage und beantwortet sie nicht.
- **Nörgel weiß nichts davon.** Er ist die Grünhaut auf Probe im Amt, seine Leute stehen
  zwölf Kacheln östlich hinter einer Palisade, und im Spiel verbindet die beiden nichts.
  Das ist die offensichtlichste Fortsetzung und braucht Figurentext, nicht Code.
- **Die drei übrigen Orks bleiben ungenutzt.** `Orc_Grunt`, `Orc_Archer` und `Orc_Peon`
  sind mit derselben Messung jetzt nutzbar — das Raster ist geklärt, es fehlt nur die
  Vorgangsart. Ohne die gibt es kein Monster, so schreibt es die Weltbibel vor.
- **Katapult, Kanone, Zielscheiben und Waffenständer liegen weiter im Pack.** Die ersten
  beiden aus dem oben genannten Grund, die anderen beiden, weil ein Lager, das seit
  vierhundert Jahren wartet, nicht übt.
