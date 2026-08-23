# Bauabschnitt G10 — Ein Monsterrig für Nörgel, ein Bild für zwei — ERLEDIGT

Vier Eingriffe, alle vier von außen angestoßen und alle vier klein. Der erste
hebt eine Grenze auf, die G9 noch als endgültig notiert hatte.

## G10-1. Nörgel steht auf einem Monsterrig

G9 hat Nörgel grüne Haut gegeben und im selben Atemzug festgehalten, was nicht
geht: *„Spitze Ohren. Das Helden-Rig hat keine. Nörgels Haut ist alles, was ohne
neue Grafik geht."*

Das war richtig und trotzdem die falsche Frage. Ohne neue Grafik ging mehr — nur
nicht auf diesem Rig. `CF_RIGS` führt seit G3 sieben Völker, darunter vier
Goblins und einen Ork, und das Ork-Blatt steht seit W-Lager im Spiel: darauf
läuft im Lager der Beschwerden das Empfangsbekenntnis. Die Ohren waren die
ganze Zeit da, nur zwei Tabellen weiter.

```
rig:'orc_chief', rigSc:1.9,
```

Zwei Felder auf der Figurenzeile, kein neuer Ladepfad. `npcBlaetter()` bekommt
einen Zweig davor: ein Rig schlägt Paketblatt und Komposit. Kein `else` — fehlt
das Rigblatt (im Quellbaum ohne Grafikpaket), greift darunter alles wie bisher,
und die Figur steht als grünhäutiges Komposit da. `gestalt` bleibt deshalb
stehen und ist ab hier der Rückfallweg.

**`rigSc` ist gerechnet, nicht geraten — aber ungeprüft.** Die Rigs haben eigene
Zellmaße (orc_chief 32x32 gegen 64x64 beim Komposit), ein gemeinsamer Faktor
stellte die Figur halb so groß daneben. Die Rechnung: der Ork-Körper misst 20
bis 24 Pixel (Messung in `CF_RIGS`), das Held-Komposit rund 32 bei `NPC_SC`
1,656, also 53 Pixel im Bild. 22 mal 1,9 sind 42 — Nörgel steht damit rund vier
Fünftel so hoch wie die Menschen um ihn herum. Das ist die Absicht: ein kleiner
Sachbearbeiter, kein Häuptling. Das Empfangsbekenntnis steht auf 2,3 und bleibt
der Größere.

Was das kostet: Nörgel sieht aus wie der Gegner im Lager. Das ist hier kein
Fehler, sondern die Auskunft — es ist dasselbe Volk. Wer die beiden auseinander
haben will, hat `tint` zur Hand; ich habe bewusst keinen gesetzt, weil man das
erst sehen sollte.

## G10-2. Lott und Pahl bekommen beide dasselbe Bild

U5 hatte die zwei ausgelassen, mit einer Begründung, die stimmt: Motiv 11 ist
ein Doppelporträt, jedes Gesicht füllt die halbe Breite bei voller Höhe, und ein
Zuschnitt zöge dem jeweils anderen die Haare mit ins Bild. Seither standen sie
als einzige auf dem Sprite-Ausschnitt aus U4.

Der Zuschnitt bleibt unmöglich. Nur ist das Doppelbild für beide die **bessere**
Antwort und nicht die schlechtere. Die zwei sitzen seit W3 auf derselben Bank
und sind in jedem ihrer Sätze ein Paar; wer den einen anspricht, sieht beide
grinsen, und wer danach den anderen anspricht, sieht dasselbe Bild noch einmal.
Das ist der Witz, nicht der Mangel.

`PORTRAET_DATEI` hängt beide Figurenschlüssel an dieselbe Datei. Sie bekommen je
einen eigenen `SHEETS`-Eintrag (die Tafel sucht über `figur.key`), aber
`loadAssets()` bringt das Bild an einer URL nur einmal — zwei bytegleiche
Dateien wären 7 KB umsonst im Build. In `tools/figuren-px.py` heißt der Eintrag
deshalb `lott-pahl` und nicht nach einem der beiden.

Nebenwirkung, und eine gute: **jede Dorffigur hat jetzt ein gemaltes Porträt.**
Der Sprite-Ausschnitt aus U4 ist damit ein Rückfallweg, den niemand mehr geht —
`U5 Porträts: 15 gemalte Bilder zugeordnet, Sprite-Ausschnitt für niemanden.`

## G10-3. Pommer ist blond

Sein Porträt zeigt kurzes blondes Haar; im Code stand `#b48651`, ein Braun. Der
Fehler saß in der Messung, nicht im Auge: die Standardzone reicht bis auf seine
hohe Stirn, und **Blond und Haut sind derselbe Farbton**. Der Familientest, der
sonst Zapfs Bart von seiner Latzhose trennt, kann die beiden nicht trennen — er
mittelt sie.

Zwei Änderungen am Messfenster, beide als Sonderfall in
`tools/portraet-farben.py` dokumentiert:

* **Fenster auf das oberste Sechzehntel** verengt, wo nur Haar ist.
* **Lichtton statt Familienmittel.** Auf 64 Pixeln liest sich Haar an seinem
  Licht, nicht an seinem Flächenmittel — das Mittel wiegt den Schatten unter dem
  Pony mit und zieht jedes Blond ins Braune.

Ergebnis `#e1ac62`. Der zweite Punkt ist als vierter Eintrag `haeufigste` im
Sonderfall-Eintrag verallgemeinert und steht damit dem nächsten Blondschopf
bereit.

## G10-4. Milb hat keinen Hut

Hatte er nie. `hut:` steht bei genau zwei Figuren, Trepp und Nieselbeck, beide
mit Dienstmütze auf dem Porträt. Milbs Zeile trägt `hair:'h5'` und sonst nichts
am Kopf.

Was an ihm auffallen kann und kein Hut ist: **h5 ist langes offenes Haar**, sein
Porträt zeigt aber eine hohe Glatze mit grauem Haar nur an den Seiten. Das Pack
hat keine Frisur „kahl mit Seitenhaar"; h5 legt ihm eine volle Haarmasse auf den
Kopf, und die kann auf 42 Pixeln als Kappe durchgehen. Das ist die Stelle, an
der zu drehen wäre — nicht der Hut.

## Die Guards

`figurenFarbenAssert()` prüft eine achte Sache: **das Rig gibt es, und es kann
laufen.** Ein `rig:'ork'` ohne Eintrag in `CF_RIGS` liefe still ins Leere und die
Figur stünde als Komposit da — sichtbar nur dem, der genau diese Figur ansieht.
Und ein Rig ohne `walk`-Reihe schlitterte im Standbild über den Anger. Dazu:
`rigSc` ohne `rig` ist wirkungslos und wird gemeldet.

`npcAnkerAssert()` brauchte nichts: er vergleicht die gemessene Fußlinie gegen
`s.ay` des Blattes selbst und nicht gegen einen festen Wert — für ein Rig mit
`ay:30` prüft er gegen 30. Das war schon immer richtig gebaut.

Zwei Nachzüge an `tools/portraet-farben.py`:

* Der Ausdruck in `ausIndex()` erlaubte zwischen Kopfzeile und `gestalt` nur
  Kommentare. Nörgels neue `rig:`-Zeile ließ ihn durchfallen, und `--pruef`
  meldete zwei Abweichungen, die keine waren. Jetzt darf dort beliebiges stehen,
  nicht-gierig bis zum ersten `gestalt`, mit Abbruch am nächsten `{key:`.
* `... | head` warf einen `BrokenPipeError` samt Traceback. Sieht aus wie ein
  Fehler, ist keiner, abgefangen.

## Abnahme

```
U5 Porträts: 15 gemalte Bilder zugeordnet, Sprite-Ausschnitt für niemanden.
G10 Figurenfarben: 15 Figuren eingekleidet, 2 mit Kopfbedeckung, 1 mit eigenem
Hautton, 1 auf einem Monsterrig.
```

| Lauf | Ergebnis |
|---|---|
| `python3 tools/portraet-farben.py --pruef` | 30 von 30 |
| `node tools/figurenfarben-messlauf.mjs` | 10 von 10 |
| `node tools/gespraech-pruef.mjs` | 58 von 60 (dieselben zwei wie auf `main` ohne Grafikpaket) |
| `node tools/szene-pruef.mjs` | 32 von 32 |
| `node tools/empfang-pruef.mjs` | 59 von 59 |
| `node tools/menue-pruef.mjs` | 39 von 39 |
| `node tools/reich-pruef.mjs` | 35 von 35 |
| `node tools/build-single.mjs` | läuft, 1036 KB (vorher 1023) |
| `node tools/figuren-kontaktbogen.mjs` | 15 Figuren, **15 mit Porträt** (vorher 13) |

**Am Bild geprüft:** der Kontaktbogen zeigt Lott und Pahl beide mit dem
Doppelbild — der Gag trägt — und Pommers Haar ist auf seinem Porträt
unverkennbar blond.

**Was weiter nicht belegt ist:** die Sprite-Seite, und bei G10 mehr als vorher.
`rigSc` 1,9 ist eine Rechnung ohne Bild; ob Nörgel neben Lisbeth stimmig steht
oder zu klein wirkt, entscheidet der erste Blick. Dasselbe gilt für die
Fußlinie: `orc_chief` hat `ay:30`, gemessen im Kessel und nicht im Dorf.

## Was offen bleibt

- **Ein Lauf mit Grafikpaket.** `node tools/figuren-kontaktbogen.mjs` neben dem
  Assets-Repo. Vier Punkte: Nörgels Größe, seine Fußlinie, ob die Mütze bei
  Trepp und Nieselbeck auf dem Kopf sitzt, und Vorblatts fast schwarzer Mantel.
- **Milbs Frisur.** Siehe G10-4. Braucht eine Entscheidung am Bild, keine
  Messung.
- **Nörgel und das Empfangsbekenntnis** teilen sich ein Blatt. Wenn das zu nah
  aneinander liegt, trennt sie ein `tint` auf Nörgels Zeile.
- **Die anderen Völker.** `CF_RIGS` hat vier Goblins, Skelette, Ritter und
  Engel. Nörgel ist die einzige Figur des Ensembles, die kein Mensch ist — aber
  der Weg steht jetzt für jede offen, die es später nicht mehr ist.
