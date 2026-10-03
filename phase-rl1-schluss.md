# Bauabschnitt RL1: Der geschlossene Vorgang bleibt geschlossen — ERLEDIGT

Erster Abschnitt der Release-Reihe (RL). Das Ende des Spiels war seit SZ4 gebaut
und hinterließ nichts: wer den Abspann gesehen und auf NEUEN VORGANG ANLEGEN
gedrückt hatte, stand in der nächsten Schicht vor demselben Fürsten, mit
derselben Ausfertigung im Beutel, und konnte noch einmal zustellen. Das stand
seit dem 05.08.2026 als Randnotiz in `GEGENPROBE-W-2026-08-05.md` und war nie
ein Bauabschnitt. Für eine Fassung, die an Spieler geht, ist es einer.

Datum der Messungen in diesem Dokument: 03.10.2026, ohne lizenzierte Grafik im
Container (siehe Prüfprotokoll).

---

## 1. Der Befund

Gemessen mit einer Playwright-Sitzung, nicht vermutet:

* `abspannStarten()` und `vorgangPanel(6)` schreiben nichts in `amt`, `kladde`
  oder `kn`. Es gab kein Feld, in dem ein Schluss hätte stehen können.
* `spielstandErlaubt()` verlangt `state === 'play'`; während der Zustellung steht
  `state` auf `'zustellung'`. Der `pagehide`-Weg speichert in diesem Zustand
  also nicht, und ein Neuladen mitten im Abspann hätte auch dann nichts
  hinterlassen, wenn es ein Feld gegeben hätte.
* Nach dem Neuladen: `vorgangZustellbar()` wahr, `vorgangBestandBlock()` sagt
  „Die Ausfertigung ist vollständig", `vorgangJahresBlock()` ab Schicht 60 „Der
  Vorgang läuft weiter", `winGame()` sagt „Vorgang 1 bleibt offen".
* Der Amtsmarsch lief im Abspann **vom ersten Bild an**, gedämpft, weil
  `szeneTafel()` jedes Blatt mit `MUS.muffle(true)` schließt. Die Weltgeschichte
  schreibt für Szene 9 „ohne Musik bis zum vorletzten Bild" und macht aus dem
  vierten Takt der Hymne den einzigen Moment, in dem im Spiel etwas zu Ende
  gespielt wird. Gebaut war davon der Satz auf Bild 12, nicht die Musik.

## 2. Was gebaut ist

**Ein Feld, ein Prädikat, vier Leser.** `amt.vorgangGeschlossen` ist die
Schichtnummer der Zustellung, 1-basiert wie `amt.stopfenSchicht`, 0 heißt „noch
offen". Es liegt in `amt` und nicht in `kladde` oder `kn`, weil es dieselbe
Klasse ist wie der Rang: Meta-Progression, die nie zurückgesetzt wird (Weltbibel
18.2). `loadAmt()` liest es mit derselben Klemme wie die beiden Stempel aus SZ3
(`stempelGeklemmt`, Deckel 9999, negativ wird 0).

`vorgangGeschlossen()` trägt das Modus-Gate wie `vorgangZustellbar()` und
`vorgangVertagt()`: im freien Spiel gilt der Stempel nichts. Gesetzt wird er
genau einmal, in `abspannStarten()`, mit sofortigem `saveAmt()`, und nie wieder
genullt.

Die Leser:

| Stelle | vorher | nachher |
|---|---|---|
| `vorgangZustellbar()` | drei Terme | vierter Term `!vorgangGeschlossen()`; der Fürst bekommt keinen zweiten Umschlag |
| `vorgangVertagt()` | zwei Terme | dritter Term; ohne ihn wäre der Fürst nach dem Abspann unsterblich (nicht zustellbar, also vertagt, also kein Ende) |
| `vorgangBestandBlock()` | „Die Ausfertigung ist vollständig" | „Zugestellt in Schicht N. Vorgang 1 ist geschlossen. Kein Widerspruch eingelegt."; der Zwischenbescheid verschwindet mit |
| `vorgangJahresBlock()` | „Der Vorgang läuft weiter" | `VORGANG_JAHRES_GESCHLOSSEN`: Zwirn hat den Umschlag mit Vorgang 2 nicht aufgemacht, zuständig wäre die Amtsleitung (derselbe Satz wie in Schicht 20, derselbe Mann) |
| `showStartScreen()` | Rang, Schichten, Kasse | dazu „Vorgang 1 geschlossen" |
| `winGame()` | ein Literal | `WIN_ZEILEN.offen` Wort für Wort das alte, `WIN_ZEILEN.geschlossen` heftet den Nachtrag zum Nachtrag ab |

**Die Stille.** `MUS.still(on)` ist ein zweiter Schalter neben `musicMuted`,
weil der eine dem Spieler gehört und der andere der Regie: wer den Musikknopf
auf Aus hat, soll ihn nach dem Abspann nicht umgekehrt vorfinden. `szeneTafeln()`
nimmt dafür `opt.beiBlatt(i)`, einen Rückruf je aufgeschlagenem Blatt, und der
Abspann schaltet damit ab Index `ABSPANN_HYMNE_BLATT` (11, also Bild 12) die
Stille aus und den Amtsmarsch ungedämpft ein. Der Rückruf steht in
`szeneTafel()` **hinter** `MUS.muffle(true)`, sonst stünde seine Aufhebung unter
der Dämpfung derselben Funktion. Der Sprung über ZUM LETZTEN BILD landet auf
Bild 13 und damit hinter der Schwelle.

## 3. Entscheidungen

* **Der Stempel fällt mit dem Abspann, nicht mit dem Schlusspanel.** „Der
  Vorgang 1 wird geschlossen" steht auf Schritt 5 des Finales, und der Abspann
  ist die Folge davon. Wer ihn beim ersten Bild per Neuladen verlässt, hat
  zugestellt.
* **Der Fürst steht nach dem Schluss weiter in Ablage V und stirbt wie jeder
  andere.** Die Weltbibel sagt, das Spiel endet nach dem Finale nicht (18.4),
  und sagt nichts über Ablage V danach. Ein zweites Welt-Design für die Zeit
  nach dem Schluss wäre ein neuer Bauabschnitt mit Kanon-Entscheidung; das hier
  ist der kleinste Schnitt, der die Lüge beseitigt.
* **NEUEN VORGANG ANLEGEN bleibt der Knopf.** Vor RL1 war er eine Behauptung
  ohne Wirkung (der alte Vorgang stand wieder da). Seit RL1 stimmt er wörtlich:
  der Umschlag mit Vorgang 2 liegt seit dem letzten Bild auf dem Tresen, und
  die nächste Schicht ist eine ohne Vorgang 1.
* **Kein Regen und kein Konfetti im Abspann.** Der Nebenbefund aus SZ4 bleibt
  offen; ein Partikeleffekt hinter einem Vollbild-Overlay wäre ohne Grafik im
  Container nicht abnehmbar.

## 4. Zwei Funde beim Bauen, beide aus dem Prüflauf und nicht aus dem Guard

1. **`vorgangAssert()` und `langAssert()` fielen nach dem Abspann bei jedem
   Laden.** Beide prüfen „Zustellen möglich bei Schicht 40 mit vollem Bestand",
   und auf einem Stand mit Stempel ist das zu Recht falsch. Gefunden von
   `schluss-pruef.mjs` beim Neuladen des Rundwegs: sechzehn Konsolenzeilen,
   Spieler hätten sie nie gesehen, die CI schon. Beide Guards nullen den Stempel
   jetzt für ihre Sweeps und spiegeln den echten Wert zurück (`vorgangAssert`
   im `finally` als siebter Spiegel, `langAssert` direkt an der Zeile).
2. **Das Sperrvermerk-Wort „ergibt".** Die erste Fassung der geschlossenen
   Kampf-Tod-Zeile enthielt „vergibt kein Aktenzeichen", und `PRUEF_GEHEIM`
   trifft Teilwörter. Umgeschrieben; der Guard hat getan, wofür er da ist.

Dazu ein Prüfprotokoll, das sich ändern musste: `versuchung-pruef.mjs` ruft
`abspannStarten()` sechsmal (für die Fenstermessung) und prüfte danach, dass
Zustellen weiter möglich ist. Seit RL1 ist das nach einem Abspann richtig
falsch; der Lauf nullt den Stempel vor dieser Zeile und sagt, warum.

## 5. Abnahme

| Prüfung | Ergebnis |
|---|---|
| `node --check` über sieben Dateien | still |
| `tools/ladelauf-pruef.mjs` | in Ordnung, 12x „in Ordnung", Konsole still (775 Sprite-Warnungen, ohne Grafik der Normalfall) |
| `tools/schluss-pruef.mjs` (neu) | **36 von 36** |
| `tools/versuchung-pruef.mjs` | 67 von 67 (vorher 66 von 67, siehe oben) |
| `tools/speicher-pruef.mjs` | 38 von 38 |
| `tools/langvorgang-pruef.mjs` | 58 von 58 |

`NEUERUNGEN` hat einen Punkt und den Stempel `2026-10-03-rl1`.

## 6. Prüfprotokoll

`tools/schluss-pruef.mjs` stellt fest, in dieser Reihenfolge: vor dem Schluss
ist alles wie seit W5 (zustellbar, nicht vertagt, nicht geschlossen, Musik an,
Startbild ohne Schluss); der Abspann setzt den Stempel auf Schicht+1 und
schreibt ihn sofort in den localStorage; Bild 1 bis 11 sind still, Bild 12 und
13 spielen `office` ungedämpft; das Schlusspanel steht danach mit Musik; der
Sprung ZUM LETZTEN BILD landet auf 13 mit Musik; danach ist nichts zustellbar
und nichts vertagt, Bestand, Jahresgespräch, Startbild und Kampf-Tod nennen den
Schluss, der Zwischenbescheid ist weg; der Stempel überlebt ein Neuladen, 999999
wird 9999, -5 wird 0; ohne Schichtmodus gilt nichts davon; Konsole still.

**Mit Grafik geprüft hat die CI**: `.github/workflows/pruef.yml` holt die
lizenzierten Blätter per Deploy Key und fährt den Ladelauf gegen Quelle und
Build. Für jeden Commit der Release-Reihe steht dort „Mit lizenzierter Grafik
geprüft", „0 Warnungen", „Konsole still" (Läufe 7 bis 10 vom 03.10.2026). Was
im Container ohne Blätter nicht abnehmbar war, ist damit zumindest für die
Ladekette und alle Guards abgenommen, nicht aber für das Bild.

**Baseline aller 17 Prüfläufe vor RL1** (03.10.2026, ohne Grafik): 11 grün, 6
rot, und alle sechs roten hängen an fehlenden Blättern (`ebene`: die Leiter ist
nicht geladen; `gespraech`: Porträt und Nörgels Blatt; `innen`: die
Innenraumblätter; `langvorgang`, `reich`, `szene`: nur Sprite-Warnungen in der
Konsole). `mitteilung-pruef` steht auf 32 von 32; die Angabe „29 von 32, seit
U10" in `phase-t2-anfang.md` ist überholt.

## Offen

* Regen und Konfetti im Abspann (Nebenbefund SZ4), mit Grafik abzunehmen.
* Was Ablage V nach dem Schluss ist, bleibt eine Kanon-Entscheidung für einen
  späteren Bauabschnitt. Bis dahin ist der Fürst dort ein Nachtrag zum Nachtrag.
