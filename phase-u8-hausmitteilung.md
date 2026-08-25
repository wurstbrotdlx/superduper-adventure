## U8: Die Hausmitteilung — ERLEDIGT

Der Wunsch war ein Satz: ein Popup mit den Updates von heute vorschalten, das kurz sagt, was
es gibt und wo es ist.

Das ist keine Oberflächenphase im Sinn von U1 bis U7. Die haben das Spiel umgeräumt; diese
hier sagt, dass umgeräumt wurde. Sie fasst nichts an, was im Dienst passiert: keine
Kampfwerte, keinen Katalog, keine Weltdatei, kein Panel aus `PANEL_REGISTER`, keinen
Speicherschlüssel des Spielstands. Sie fasst genau drei Dinge an — sechs CSS-Regeln unter
`#overlay`, einen Block im Skript vor `showStartScreen()`, und die eine Zeile am Ende der
Ladekette, die bisher `showStartScreen()` hieß.

---

### Der Anlass: das Haus baut schneller, als jemand hinsieht

Am 25.08.2026 sind drei Dinge ausgeliefert worden, die man alle drei übersehen kann:

* **U7** hat die Bedienschicht neu sortiert. Wer das Spiel kennt, sucht Leben und Mana dort,
  wo sie gestern lagen — unten in der Mitte, auf dem Telefon als zwei senkrechte Röhren an
  den Bildrändern. Sie liegen jetzt oben links.
* **K1-13** hat fünfundvierzig Kartenbilder an die Zulagen gehängt. Sie liegen hinter einem
  Knopf, den man drücken müsste, um zu merken, dass es sie gibt.
* **K1-10** hat die Karte in eine Sammelkarte verwandelt. Dasselbe Problem, derselbe Knopf.

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
zweite Zeile ist die eigentliche. „Die Zulagen haben Bilder" ist eine Nachricht; „Gürtel 🗂️
Zulagen, auf der Tastatur Taste Z" ist die Fundstelle, und ohne sie bleibt die Nachricht
folgenlos. Die Wo-Zeile trägt deshalb eine eigene Farbe und ein 📍 und steht in jedem Punkt.

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
Prüflauf ändert. Verlassen wird sich darauf trotzdem nicht — `menue-pruef` (39), `zulagen-pruef`
(45), `speicher-pruef` (34), `empfang-pruef` (59) und `steuerung-pruef` sind nach dem Umbau
gelaufen und stehen unverändert.

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
so bleibt der letzte Knopf des Startbilds derselbe wie vor U8.

---

### Was wo steht

| Ort | Was |
|---|---|
| `<style>`, unter `#overlay button:hover` | sechs Regeln: `.neuListe`, `.neuPunkt`, dessen `b` und `p`, `.neuWo`, `.neuFuss`. Linksbündig gegen das zentrierende `.panel` |
| `<style>`, im 480px-Breakpoint | vier engere Fassungen davon, damit die Mitteilung samt Knopf auf 390x844 in eine Bildhöhe passt |
| Skript, vor `showStartScreen()` | `NEUERUNGEN` (Stand, Datum, Punkte), `NEUERUNGEN_KEY`, `neuerungenStandLesen/Stempeln/Faellig`, `showNeuerungen`, `neuerungenWeg` |
| Skript, in `showStartScreen()` | der Knopf „Was ist neu", vor der Dienstanweisung |
| Skript, Ende der Ladekette | `if(neuerungenFaellig()) showNeuerungen(); else showStartScreen();` |

**Eine Runde eintragen** heißt: `NEUERUNGEN.punkte` neu füllen, `stand` und `datum` auf den
Tag setzen. Alles andere bleibt stehen. Wer die Punkte leert, schaltet die Mitteilung ab —
auch den Knopf im Startbild.

---

### Prüfprotokoll

`tools/mitteilung-pruef.mjs`, im echten Browser, Bauform wie `menue-pruef`. **26 von 26**
am 25.08.2026:

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
* **Auf 390x844 und 360x640** steht sie, der Knopf ist erreichbar, nichts läuft seitlich
  hinaus, und er führt ins Startbild.
* **Konsole still** in allen drei Formaten.

Ohne Regression, nach dem Umbau gelaufen: `menue-pruef` 39/39, `zulagen-pruef` 45/45,
`speicher-pruef` 34/34, `empfang-pruef` 59/59, `steuerung-pruef` „Alles in Ordnung".

**Abnahme:** Wer die Mitteilung wegklickt, spielt das Spiel unverändert. Sie greift in nichts
ein, sie hält nichts auf, sie läuft nicht von selbst ab und sie verschwindet nicht von selbst.
Kein neuer Speicherschlüssel im Spielstand, kein neues Panel, kein neuer Guard — der Prüflauf
steht in `tools/`, aus demselben Grund wie bei U7: was nur im Bild und über zwei Ladevorgänge
wahr ist, kann ein Guard auf Skriptebene nicht messen.
