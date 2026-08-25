## U9: Die Hausmitteilung — ERLEDIGT

Der Wunsch war ein Satz: ein Popup mit den Updates von heute vorschalten, das kurz sagt, was
es gibt und wo es ist.

Das ist keine Oberflächenphase im Sinn von U1 bis U8. Die haben das Spiel umgeräumt; diese
hier sagt, dass umgeräumt wurde. Sie fasst nichts an, was im Dienst passiert: keine
Kampfwerte, keinen Katalog, keine Weltdatei, kein Panel aus `PANEL_REGISTER`, keinen
Speicherschlüssel des Spielstands. Sie fasst genau drei Dinge an — sechs CSS-Regeln unter
`#overlay`, einen Block im Skript vor `showStartScreen()`, und die eine Zeile am Ende der
Ladekette, die bisher `showStartScreen()` hieß.

**Zur Nummer.** Dieser Abschnitt hieß bis zur Auslieferung U8 und heißt seither U9. U8 ist die
zweite Schicht der Oberfläche (`phase-u8-menuefenster.md`); beide sind am 25.08.2026 gebaut
worden, ohne voneinander zu wissen, und trafen sich erst auf `main`. Textlich ging das ohne
Konflikt zusammen und alle Prüfläufe blieben grün — aber zwei Bauabschnitte mit derselben
Nummer sind kein Schaden, den ein Guard meldet, sondern einer, der erst in einem halben Jahr
weh tut, wenn jemand „siehe U8" liest. Die Nummer der später gemergten Arbeit weicht, nicht
die der früheren.

---

### Der Anlass: das Haus baut schneller, als jemand hinsieht

Am 25.08.2026 sind vier Dinge ausgeliefert worden, die man alle vier übersehen kann:

* **U8** hat aus acht Kästen neben dem Spiel vier Großfenster gemacht, mit einem Reiterband im
  Kopf. Der Rucksack trägt nur noch, was in ihm liegt; Befähigung, Ausrüstung und Ausweis
  stehen im neuen Charakterfenster.
* **U7** hat die Bedienschicht neu sortiert. Wer das Spiel kennt, sucht Leben und Mana dort,
  wo sie gestern lagen — unten in der Mitte, auf dem Telefon als zwei senkrechte Röhren an
  den Bildrändern. Sie liegen jetzt oben links.
* **K1-13** hat fünfundvierzig Kartenbilder an die Zulagen gehängt. Sie liegen hinter einem
  Griff, den man tun müsste, um zu merken, dass es sie gibt.
* **K1-10** hat die Karte in eine Sammelkarte verwandelt. Dasselbe Problem, derselbe Griff.

Das Haus hat für so etwas eine Form, und sie steht in der Welt schon da: eine Mitteilung, die
umläuft und zur Kenntnis genommen wird. Also heißt der Bildschirm **HAUSMITTEILUNG** und
nicht „Was ist neu (v1.4)". Kapitel 1 gilt hier wie überall — die Ausnahme ist der
Speicherkasten aus SP, und die bleibt die einzige.

---

### Entscheidung 1: davor, nicht darin

Das Startbild hat seit W8 eine Aufgabe, und sie heißt Dienst antreten. Es sagt in vier
Absätzen, in welcher Welt man landet, zeigt Rang, Schichten und Kasse, bietet die
unterbrochene Schicht an und führt hinein. Drei weitere Absätze über Statuskarten und
Kartenmotive hätten den Knopf nach unten geschoben und die Ansprache zerredet.

Die Mitteilung steht deshalb **vor** dem Startbild und ist mit einem Knopf durch. Danach
kommt das Startbild, unverändert, wie an jedem anderen Tag auch.

Der Preis ist ein zusätzlicher Klick zwischen Ladebildschirm und Spiel. Er wird genau einmal
je Stand bezahlt (Entscheidung 3), und es gibt keinen zweiten Weg, der das nicht auch kostet:
ein Zettel, der sich selbst nach fünf Sekunden schließt, wäre etwas, das von selbst abläuft,
und davon gibt es hier nichts.

### Entscheidung 2: zwei Zeilen je Punkt, und dann ist Schluss

Jeder Punkt der Mitteilung sagt **was** sich geändert hat und **wo** es zu sehen ist, und die
zweite Zeile ist die eigentliche. „Die Zulagen haben Bilder" ist eine Nachricht;
„Charakterfenster, zweites Blatt Kartenmappe — oder Taste Z" ist die Fundstelle, und ohne sie
bleibt die Nachricht folgenlos. Die Wo-Zeile trägt deshalb eine eigene Farbe und ein 📍 und
steht in jedem Punkt.

Der Baubericht steht in den Phasendokumenten. Hier steht nur, wohin man sieht.

### Entscheidung 3: drei Regeln, wann sie erscheint

1. **Wer zum ersten Mal hier ist, sieht sie nicht.** „Neu" ist eine Aussage über ein Vorher,
   und ein frisches Gerät hat keines. Es bekommt den Stand still gestempelt und geht durch —
   sonst begrüßte das Spiel einen neuen Spieler mit der Nachricht, dass etwas anders sei als
   vorher, ohne dass er ein Vorher gehabt hätte. Gemessen wird an den vier Schlüsseln aus
   `SPEICHER_SCHLUESSEL`: liegt einer davon im Speicher, war jemand da.
2. **Einmal zur Kenntnis genommen, bleibt sie weg** — bis `NEUERUNGEN.stand` sich ändert.
3. **Sie bleibt nachlesbar.** Das Startbild trägt seither den Knopf „Was ist neu", neben der
   Dienstanweisung und aus demselben Grund: die einzige Fassung eines Textes darf nicht die
   sein, die man gerade weggedrückt hat.

---

### Fund 1: der Stempel gehört dem Gerät, nicht dem Spielstand

`sda_neuerungen` steht in `localStorage`, aber **nicht** in `SPEICHER_SCHLUESSEL`. Das ist
keine Vergesslichkeit, sondern dieselbe Grenze, an der schon `sda_schrift` und
`sda_targetPriority` stehen: Export und Import fassen den Spielstand an, nicht die
Bildschirmgewohnheiten des Geräts.

Der Fall, an dem es hängt, ist der Gerätewechsel aus SP. Wer seinen Stand auf dem Telefon
exportiert und auf dem Rechner einliest, hat am Rechner die Mitteilung womöglich schon
gelesen. Stünde der Stempel in der Datei, überschriebe der Import ihn mit dem Stand des
Telefons, und die Mitteilung käme ein zweites Mal — eine importierte Akte darf nicht
bestimmen, was das Zielgerät schon gesehen hat.

### Fund 2: die Prüfläufe kommen an der Mitteilung vorbei, und zwar aus einem Grund

Dreizehn Läufe unter `tools/` starten das Spiel, und **alle** rufen dafür `startGame()`
direkt auf, statt den Knopf im Startbild zu drücken. Ein Bildschirm davor kann sie also gar
nicht aufhalten. Dazu kommt, dass sie in frischen Browser-Kontexten laufen: leerer Speicher,
also greift Regel 1 und die Mitteilung erscheint erst gar nicht.

Beides zusammen ist der Grund, warum diese Phase keine einzige Zeile in einem bestehenden
Prüflauf ändert. Verlassen wird sich darauf trotzdem nicht — `menue-pruef` (69),
`zulagen-pruef` (50), `speicher-pruef` (34) und `steuerung-pruef` sind nach dem Umbau gelaufen
und stehen unverändert.

Eine Stelle war nah dran: `speicher-pruef` löscht den Speicher, liest eine Exportdatei ein
und lädt neu. Danach hat das Gerät ein Vorher und wäre fällig. Es ist trotzdem still,
weil derselbe Lauf vorher schon einmal mit leerem Speicher geladen hat — und dabei nach
Regel 1 den Stempel bekommen hat. Der Lauf prüft das Startbild ohnehin über einen eigenen
`showStartScreen()`-Aufruf.

### Fund 3: der Knopf im Startbild steht nicht an letzter Stelle

Acht Prüfläufe klicken sich durch Blätterstrecken, indem sie den **letzten** Knopf im
Overlay drücken, bis das Overlay weg ist. Stünde „Was ist neu" hinter der Dienstanweisung,
wäre das für einen solchen Lauf ein Pendel: Startbild → Mitteilung → Startbild, sechzig
Runden lang. Kein Lauf gerät heute dorthin (Fund 2), aber die Reihenfolge kostet nichts, und
so bleibt der letzte Knopf des Startbilds derselbe wie vor U9.

### Fund 4: eine Wegbeschreibung veraltet, und kein Guard sieht es

Der Fund des Auslieferungstags, und er ist der eigentliche Grund für den Nachtrag. Die erste
Fassung nannte als Fundstelle der Sammelkarten „Gürtel 🗂️ Zulagen, auf der Tastatur Taste Z".
Das stimmte, als es geschrieben wurde. Zwischen dem Schreiben und dem Ausliefern ging U8 auf
den Hauptzweig und nahm den Zulagen ihr eigenes Fenster: aus `#zulagenBtn` wurde `#charBtn`,
aus dem Fenster das zweite Blatt des Charakterfensters. Der Satz zeigte damit auf einen Knopf,
den es nicht mehr gab — auf dem Bildschirm, dessen einzige Aufgabe es ist, den Weg zu zeigen.

Kein Guard hat etwas gesagt, und keiner konnte: die Guards auf Skriptebene lesen Tabellen,
Zeichenzahlen und Erreichbarkeit; ein Fließtext ist für sie ein Fließtext. Die Prüfläufe lasen
den Bildschirm, zählten drei Punkte und drei Wo-Zeilen und fanden alles in Ordnung. Gezählt
wurde, dass eine Zeile **da** ist, nie, dass sie **hinführt**.

**Eingriff.** `mitteilung-pruef` drückt seither, was die Wo-Zeilen nennen: `C` muss das
Charakterfenster öffnen, `Z` muss auf der Kartenmappe landen, den Knopf 🧍 muss es am Gürtel
geben, das Reiterband muss vier Reiter haben, und die vier Ecken der Bedienschicht müssen
stehen. Dazu die Gegenprobe, weil ein Wächter, der immer schweigt, nichts beweist: mit
entferntem `#charBtn`, entferntem Reiterband und der alten Zulagen-Zeile schlägt jede der drei
Prüfungen an (`false`, `0`, `[false, true, true]`).

Das ist keine vollständige Absicherung und wird als solche nicht behauptet — ein Satz kann
weiter falsch sein, während die Taste stimmt. Es sichert die eine Sorte Fehler, die hier
wirklich passiert ist: eine Fundstelle, die ein anderer Bauabschnitt umgeräumt hat.

**Die Regel dahinter** steht seither im Kopf von `NEUERUNGEN`: wer einen Bauabschnitt ändert,
der in einem Punkt genannt ist, ändert den Punkt mit. Ein Änderungshinweis ist die einzige
Textstelle des Spiels, die schneller altert als der Code, den sie beschreibt.

---

### Was wo steht

| Ort | Was |
|---|---|
| `<style>`, unter `#overlay button:hover` | sechs Regeln: `.neuListe`, `.neuPunkt`, dessen `b` und `p`, `.neuWo`, `.neuFuss`. Linksbündig gegen das zentrierende `.panel` |
| `<style>`, im 480px-Breakpoint | vier engere Fassungen davon, damit die Mitteilung samt Knopf auf 390x844 in eine Bildhöhe passt |
| Skript, vor `showStartScreen()` | `NEUERUNGEN` (Stand, Datum, Punkte), `NEUERUNGEN_KEY`, `neuerungenStandLesen/Stempeln/Faellig`, `showNeuerungen`, `neuerungenWeg` |
| Skript, in `showStartScreen()` | der Knopf „Was ist neu", vor der Dienstanweisung |
| Skript, Ende der Ladekette | `if(neuerungenFaellig()) showNeuerungen(); else showStartScreen();` |
| `tools/mitteilung-pruef.mjs` | der Lauf, 32 Zeilen, darunter seit Fund 4 die sechs, die die Wo-Zeilen wirklich drücken |

**Eine Runde eintragen** heißt: `NEUERUNGEN.punkte` neu füllen, `stand` und `datum` auf den
Tag setzen. Alles andere bleibt stehen. Wer die Punkte leert, schaltet die Mitteilung ab —
auch den Knopf im Startbild.

---

### Prüfprotokoll

`tools/mitteilung-pruef.mjs`, im echten Browser, Bauform wie `menue-pruef`. **32 von 32**
am 25.08.2026 (26 zur Auslieferung, sechs kamen mit Fund 4 dazu):

* **Das frische Gerät** sieht das Startbild, bekommt den Stand still gestempelt und trägt
  keinen „Was ist neu"-Knopf.
* **Das Gerät mit Vorgeschichte** sieht die Mitteilung zuerst: drei Punkte, drei Wo-Zeilen,
  genau ein Knopf, Zustand `menu`. Vor dem Klick steht kein Stempel.
* **Der Knopf** führt ins Startbild und stempelt. Das Startbild trägt danach drei Knöpfe in
  der Reihenfolge Dienst fortsetzen, Was ist neu, Dienstanweisung.
* **Das Nachlesen** zeigt dieselbe Mitteilung und geht zurück.
* **Nach dem Stempel** bleibt sie beim Neuladen weg; ein alter Stempel (`2026-08-01`) lässt
  sie wiederkommen.
* **`startGame()`** kommt an ihr vorbei, der Dienst läuft (Fund 2, gemessen statt behauptet).
* **Die Wegbeschreibung führt hin** (Fund 4): die Wo-Zeilen nennen `C`, `Z` und den Fächer,
  den Knopf 🧍 gibt es, `C` öffnet das Charakterfenster, `Z` landet auf der Kartenmappe, das
  Reiterband hat vier Reiter, und die vier Ecken der Bedienschicht stehen.
* **Auf 390x844 und 360x640** steht sie, der Knopf ist erreichbar, nichts läuft seitlich
  hinaus, und er führt ins Startbild.
* **Konsole still** in allen drei Formaten.

Dazu die Gegenprobe zu Fund 4 (kein Wächter, der nicht anschlagen kann): mit entferntem
`#charBtn`, entferntem Reiterband und der alten Zulagen-Zeile meldet jede der drei Prüfungen
den Fehlstand.

Ohne Regression, auf dem zusammengeführten Stand mit U8 und dem U8-Nachtrag gelaufen:
`menue-pruef` 69/69, `zulagen-pruef` 50/50, `speicher-pruef` 34/34, `steuerung-pruef` „Alles in
Ordnung". Dazu die Probe am Auslieferungsweg: `tools/build-single.mjs` gebaut und die
entstandene `dist/index.html` per `file://` geladen — Mitteilung, drei Punkte, Stempel,
Konsole still.

**Abnahme:** Wer die Mitteilung wegklickt, spielt das Spiel unverändert. Sie greift in nichts
ein, sie hält nichts auf, sie läuft nicht von selbst ab und sie verschwindet nicht von selbst.
Kein neuer Speicherschlüssel im Spielstand, kein neues Panel, kein neuer Guard — der Prüflauf
steht in `tools/`, aus demselben Grund wie bei U7: was nur im Bild und über zwei Ladevorgänge
wahr ist, kann ein Guard auf Skriptebene nicht messen.
