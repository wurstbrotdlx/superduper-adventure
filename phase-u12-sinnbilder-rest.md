## U12: Der Rest der Sinnbilder — ERLEDIGT

Bauabschnitt U12, 25.08.2026. Fortsetzung von U11 auf Zuruf: „gerne auch alle anderen
Icons, die Emojis sind, ersetzen".

U11 hat die neun Bedienknöpfe erledigt. U12 nimmt sich den Rest der Bedienoberfläche
vor — Panelköpfe, Reiterband, Befähigung, Kopfband und die Fundstücke, die im Bild
liegen. Vierundzwanzig weitere Zellen, zweiunddreißig insgesamt.

### Zuerst gezählt, dann entschieden

Eine Suche über die ganze Datei findet **110 verschiedene Emoji-Folgen an 224
Fundstellen**. Das ist keine Liste, das ist ein Fass, und der erste Schritt war
deshalb, es zu sortieren. Die Trennlinie, die dabei entstanden ist, gilt seither:

| | | |
|---|---|---|
| **Knopfmöbel** | Panelköpfe, Reiter, Abschnitte, Knöpfe, Fundstücke | wird ersetzt |
| **Inhalt** | Zutaten, Monster, Zauber, Ausrüstungsteile | bleibt Emoji |

Der Grund steht in der Sache und nicht im Aufwand: **das Pack hat kein Chuchu-Gallert.**
`ZUTAT_NOUNS` führt vierzig Zutaten, eine je Monstertyp, und jede ist ein Ding aus
dieser Welt — Goblin-Zeh, Schamanenbart, Ruferzunge, Urschrift-Siegel. `SPELLS` führt
elf Zauber über Feuer, Frost und Arkan. Für nichts davon gibt es eine Entsprechung, und
eine erfundene wäre schlechter als das Emoji. Dieselbe Linie hat U11 schon für die
Zauber gezogen; U12 zieht sie einmal für alles.

### Fund 1: die fertigen Icon-Knöpfe tragen die falschen Zeichen

Vor der Auswahl stand die naheliegende Abkürzung: `UI_Buttons.png` hat ab x=144
Achtecke mit **eingelegtem** Sinnbild, in jeder Tonstufe, und `UI_ALL.png` hat
Hunderte davon. Beide sind unbrauchbar, und zwar wegen des Inhalts: die eingelegten
Zeichen sind Steuersymbole — Pause, Wiedergabe, Note, Ein/Aus, Lautstärke, Haus,
Ausrufezeichen, Fragezeichen, Pfeile, Buchstaben. Kein Schwert, kein Trank, kein
Rucksack, kein Buch.

`UI_Button_Icons.png` trägt trotz seines Namens Gamepad- und Tastaturglyphen (A, B, X,
Y, R1, L1, LT, RT) in vierzehn Farbfassungen. Genau eine Zelle daraus ist am Ende
gebraucht worden: das große **A** für den Schrift-Abschnitt.

Die Spiel-Sinnbilder liegen in `UI_Icons.png` und müssen aufgelegt werden — also genau
die Bauart aus U11. *(Dieser Satz stand hier zuerst mit dem Wort ausschliesslich. Er war
falsch, und die Berichtigung steht im Nachtrag: `UI_Bars.png` traegt den Balkenstapel.)*

### Fund 2: der Grund entscheidet, nicht die Zelle

U11 hat jede Zelle auf dem **hellen Achteck** geprüft. U12 hat es zum ersten Mal mit
Sinnbildern zu tun, die auf **dunklem Panelgrund** stehen (`rgba(20,14,24,.96)`), und
das ist eine andere Frage.

Es ist dieselbe, an der in U2 der Beutel-Slot aus `UI_Premade` gescheitert ist: helle
Zellen sind für helle Oberflächen gezeichnet. Umgekehrt gilt es genauso — der
Lautsprecher-Umriss bei (144,64) steht auf dem Achteck ordentlich und zerfällt auf dem
Panel zu einem grauen Winkel.

`tools/ui-icon-kontaktbogen.mjs` zeigt seit U12 deshalb **jede Zelle zweimal**: links im
Knopf auf dem Achteck, rechts auf dem Panelgrund in Kopfzeilengröße. Ohne die rechte
Hälfte wäre der falsche Lautsprecher eingebaut worden.

### Die Auswahl

Vierundzwanzig Zellen: zweiundzwanzig aus `UI_Icons.png`, je eine aus
`UI_Button_Icons.png`, `UI_Bars.png` und den Speise-Icons des Hauptpacks.

| Ort | war | ist |
|---|---|---|
| Beute im Kopfband, Amtskasse, Bankguthaben, Münzen im Feld | 💰 | Münze |
| Reiter Optionen | ⚙️ | Zahnrad |
| Reiter Kochen, Kesselknopf, drei Abschnittsköpfe | 🍲 | **Einmachglas** |
| Reiter Kladde, Abschnitt Kladde | 📓 | grünes Buch |
| Reiter Akten, Abschnitt Akten | 🗄 | oranges Buch |
| Abschnitt Ton, Musikknopf an / aus | 🎵 / 🔇 | Lautsprecher / Lautsprecher mit Kreuz |
| Abschnitt Schrift | 🔠 | großes A |
| Abschnitt Spielstand | 💾 | Diskette |
| Abschnitt Im Dienst, Dienstausweis | 🪪 | Krone |
| Abschnitt Werte | 📐 | Balkenstapel *(erst Schraubenschlüssel, s. Nachtrag)* |
| Abschnitt Ausrüstung | 🛡️ | Schild |
| Kraft, Zähigkeit, Behändigkeit, Amtskunde | 💪 ❤️ ⚡ 🧠 | Schwert, Herz, Blitz, blaues Buch |
| Symbolschloss (Panel und im Feld) | 🔐 | Schlüsselbund |
| Aktentafel im Feld | 📜 | Brief |
| Trank im Feld | 🧪 | Rundkolben (aus U11) |
| Dienstzettel, Dienstbericht | 🧑‍💼 | Sprechblase |

Die Entscheidungen, die keine Geschmacksfragen sind:

- **Der Kessel ist ein Einmachglas.** Das Pack hat keinen Kessel. Es ist trotzdem keine
  Verlegenheit: dieses Haus verarbeitet Monsterteile zu abgefüllten Tränken, und ein
  Einmachglas ist genau das Ergebnis. Der Rundkolben war vergeben (`ico_trank`), und
  zwei Fenster mit demselben Zeichen wären ein Fenster zu wenig.
- **Die vier Bücher tragen die ganze Unterscheidung über die Farbe.** Blau, grün, rot
  und orange sind im Pack dieselbe Zeichnung. Also: rot ist die Personalakte (U11),
  grün die Kladde, orange die Akten, blau die Amtskunde. Wer eines davon verschiebt,
  verschiebt alle vier.
- **Im Dienst trägt eine Krone.** Hinter dem Abschnitt und hinter dem Ausweis steht die
  Amtsbezeichnung samt Rang, und der Rang ist das, was die Krone meint. Einen Ausweis
  gibt es im Pack nicht.
- **Kraft ist ein einzelnes Schwert.** Es steht neben den gekreuzten Klingen des
  Schlagknopfes und ist von ihnen zu unterscheiden — das war in U11 schon der Grund,
  für den Knopf die Kreuzform zu nehmen.
- **Die Diskette darf eine Diskette sein.** Der Spielstand-Kasten ist der einzige des
  Hauses, der Technik statt Amtsdeutsch redet (SP), und die Diskette ist genau das.
- **Der Musikknopf hat zwei Schreiber im Code**, und beide setzen den ganzen
  Knopfinhalt neu. Ohne eigene Zelle für „aus" stünde dort mal ein Sinnbild und mal ein
  Emoji, je nachdem, wer zuletzt geschrieben hat. Also zwei Zellen.

Die schwächste Zuordnung ist ausdrücklich benannt: **der Schraubenschlüssel für WERTE.**
Gemeint sind die abgeleiteten Werte, und das Pack hat weder Winkel noch Maßband. Der
Schraubenschlüssel ist das einzige Zeichen darin, das „gerechnet, nicht gewürfelt" sagt.
*(Nachtrag vom selben Tag: es war nicht das einzige — der Fehler war, nur ein Blatt
abzusuchen. Siehe den letzten Abschnitt.)*

### Fund 3: vier Schreiber hätten die Sinnbilder wieder ausradiert

`setTxt()` setzt `textContent`, `innerText` erst recht. Beide hätten das `<i>` im Knopf
beim nächsten Aufruf entfernt und durch Text ersetzt — und zwar erst zur Laufzeit, also
nicht beim Einbau, sondern beim Spielen.

Betroffen waren vier Stellen: `goldTxt` (jeder `updateHUD()`), der Musikknopf zweimal
(Umschalten und Entstummen beim ersten Griff) und das Bankguthaben. Alle vier schreiben
jetzt `innerHTML` mit dem Sinnbild darin.

Dazu kamen vier Gold-Beträge in Berichtstexten (Amtskasse im Ausweis, Beuteaufkommen im
Dienstbericht, zwei Gebührenbuchungen), die die erste Zählung übersehen hatte, weil sie
mitten in Fließtext stehen.

### Fund 4: vier Dinge im Dorf waren gemalte Emoji

Der Münzhaufen, der Trank, das Symbolschloss und die Aktentafel wurden mit
`ctx.fillText()` in einer Serifenschrift **ins Bild** gezeichnet. Sie lagen damit als
glänzende Systemgrafik zwischen lauter Pixelkunst — und anders als im Menü stand daneben
kein Text, der es erklärt hätte.

Dafür gibt es jetzt `zeichneIco(key, ersatz, x, y, kante)`. Es zeichnet die Zelle mit
ganzzahliger Kante auf ganzzahliger Ecke — bei 17 Pixeln wäre das derselbe Fehler wie
der auf dem Schlagknopf in U10 — und fällt ohne Zelle auf `fillText` mit dem
mitgegebenen Emoji zurück.

### Was Emoji bleibt, und warum

**Weil das Pack keine Zelle dafür hat** (sechs Stellen der Bedienoberfläche):

| | |
|---|---|
| 📍 Ortszeile und Kammer-Ort | keine Standortnadel im Pack |
| ⏱ Dienstuhr | keine Uhr |
| 🧺 Zutaten und Beutel | kein Korb, und der zweite Rucksack wäre vom ersten nicht zu unterscheiden |
| 🗺️ Karte | keine Karte |
| 🏛 Amtsstube | kein Gebäude-Sinnbild |
| 🔵🟡🟢🔴🟣 Kartenlegende | fünf Farbpunkte, die die Farben der Karte benennen — ein gezeichnetes Sinnbild würde hier die Auskunft ersetzen, nicht verbessern |

**Weil es Inhalt ist und kein Knopfmöbel** (der große Rest):

- **40 Zutaten** (`ZUTAT_NOUNS`), eine je Monstertyp
- **11 Zauber** (`SPELLS`, `ULT_SPELL`) samt den drei Zweigen 🔥 Feuer, ❄️ Frost,
  ⚡ Arkan
- **die Ausrüstungsteile** (`item.base.icon`) und ihre Ersatzwerte 📦 und 🛡️
- Emoji in Fließtext, Dienstzetteln und der Hausmitteilung

### Abnahme

- Jede Stelle der Bedienoberfläche, für die das Pack eine Zelle hat, trägt sie —
  am Schirm, am Finger und im Bild. ✓
- Jedes Bild ist ein ganzzahliges Vielfaches von 16. ✓
- Kein Laufzeit-Schreiber radiert ein Sinnbild aus. ✓
- Fehlt eine der zweiunddreißig Zellen, stehen **alle** Emoji wieder da, mit einer
  Warnung, die die fehlende benennt. ✓
- Keine Tastfläche und keine Geometrie hat sich geändert. ✓

### Prüfprotokoll

| Lauf | Ergebnis |
|---|---|
| `node --check` über den Skriptblock | Syntax ok |
| Konsole beim Laden | **22 Meldungen, keine Warnung, kein PAGEERROR**; `cfuiIco`, `cfuiRund`, `cfuiX` gesetzt |
| Konsole mit einer beiseitegelegten Zelle | genau eine benannte Warnung, kein Fehler, Emoji stehen |
| `tools/ui-zellen.mjs --pruef` | **32 Zellen**, keine Abweichung |
| `tools/steuerung-pruef.mjs` | vier Formate, **Alles in Ordnung** |
| `tools/menue-pruef.mjs` | **78 von 78** |
| Vier Großfenster am Schirm, 1440×900 | Reiterband, Köpfe und Befähigung tragen Zellen; keine Warnung |
| Fundstücke im Bild, DPR 3 | Münzen und Tränke als Zellen gezeichnet |
| `tools/build-single.mjs` | **243 Dateien** (215 vor U11) |

---

## Nachtrag: die Werte tragen jetzt Balken

Noch am 25.08.2026, unmittelbar nach dem Bau.

U12 hat den Schraubenschlüssel für den WERTE-Abschnitt selbst als **schwächste
Zuordnung des ganzen Satzes** ausgewiesen und die Begründung gleich mitgeliefert: das
Pack habe weder Winkel noch Maßband, also sei er das einzige Zeichen, das „gerechnet,
nicht gewürfelt" sage.

Der zweite Halbsatz war falsch, und der Fehler steht schon im ersten: **es wurde nur ein
Blatt abgesucht.** `UI_Icons.png` hat tatsächlich nichts. `UI_Bars.png` trägt in seiner
ersten Zeile den **Balkenstapel** — dasselbe Bauteil, mit dem dieses Spiel seit jeher
Leben, Mana und Erfahrung anzeigt, samt der verzierten linken Kappe, die auch in der
Statuskarte oben links sitzt.

Das ist nicht bloß das hübschere Zeichen, es ist das richtige: der Kasten unter der
Überschrift listet **vier gemessene Werte** (Schaden, Rüstung, Max HP, Max Mana), und
Balken sind die eigene Bildsprache des Hauses dafür. Ein Werkzeug sagt „reparieren",
nicht „messen".

`ico_werte.png` kommt seither aus `UI_Bars.png` (0,0) statt aus `UI_Icons.png` (48,16).
Eine Zeile in der Zellentabelle, keine Codeänderung.

**Die Lehre, die über diesen einen Knopf hinausgeht:** `tools/ui-icon-kontaktbogen.mjs`
hat in U11 und U12 dreimal einen Fehler gefunden, aber immer nur unter den Kandidaten,
die jemand eingetragen hatte. Gegen ein Blatt, das gar nicht erst aufgeschlagen wurde,
hilft er nicht. Die Kandidatentabelle im Werkzeug führt seit diesem Nachtrag deshalb
auch die Balken-Zellen — samt der beiden, die verloren haben.

### Prüfprotokoll des Nachtrags

| Lauf | Ergebnis |
|---|---|
| `node --check` | Syntax ok |
| Konsole | 22 Meldungen, keine Warnung, kein PAGEERROR; `cfuiIco`/`cfuiRund`/`cfuiX` gesetzt |
| `tools/ui-zellen.mjs --pruef` | 32 Zellen, keine Abweichung |
| `tools/steuerung-pruef.mjs` | vier Formate, Alles in Ordnung |
| `tools/menue-pruef.mjs` | 78 von 78 |
| `tools/build-single.mjs` | 243 Dateien, unverändert |
| Charakterfenster, 1440×900 bei DPR 3 | Balken stehen in der Kopfzeile über den vier Werten |
