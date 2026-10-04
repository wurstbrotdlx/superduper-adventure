# Bauabschnitt AN7: Die Hausordnung kommt in Raten — ERLEDIGT

Der letzte Bauabschnitt des Masterplans vom 27.08.2026 (`intro-masterplan.md`,
„Akt I: verteilt wird die Hausordnung, nicht der Fall"). Mit ihm ist die Reihe
`A0 → AN1 → AN5 → AN2 → AN3 → AN4 → AN6 → AN7` vollständig; AN6 war RL6.

Datum: 04.10.2026, gebaut und geprüft mit der lizenzierten Grafik im
Container (RL7).

---

## 1. Was der Masterplan wollte, und was gebaut ist

Der Plan, wörtlich: „Träger ist die Hausmitteilung (U9), pro Schicht genau
eine neue Regel, vier Zeilen. Direkte Übernahme des Papers-Please-Prinzips:
kein Regelwerk, jeden Morgen ein Blatt."

**Die Hausordnung ist die Dienstanweisung.** Blatt 2 des Vordrucks A 1 trägt
elf Punkte (Erledigung, Sachbestand, Beglaubigung, Nebenbestimmungen,
Verschlossene Vorgänge, Aushang, Dienstschluss, Amtsvermögen, Qualifikation,
Befähigung, Zauberbefugnis), und das sind die Regeln dieses Hauses. Seit AN1
liegt der Vordruck nicht mehr auf dem Pflichtweg: wer den Empfang nimmt und am
ersten Knoten nicht „Kenne ich. Den Vordruck." sagt, hat die elf Punkte nie
gesehen und findet sie nur, wenn er am Pult oder im Startbild selbst danach
greift. `intro-pruef` zählt auf dem Pflichtweg null Vordruckseiten.

Jetzt kommen sie zu ihm: **ab der sechsten Schicht je Morgen ein Punkt**, am
Knopf NÄCHSTE SCHICHT ANTRETEN (`schichtAntreten()` → `hausordnungZeigen()`),
in der Reihenfolge des Vordrucks und in dessen Wortlaut (`DIENSTBLATT`, die
Tabelle, die `dienstAssert()` seit W8 gegen Formregeln und Sperrvermerk
prüft). Elf Morgen, von der sechsten bis zur sechzehnten Schicht. Kein neuer
Text; der Vordruck bleibt am Pult und im Startbild. Umgehängt, nicht
gestrichen.

**Die Form ist der Umlauf aus U9**, wie der Plan es sagt: HAUSMITTEILUNG,
Betreff mit der Schicht, ein Punkt mit Namen und Text, eine Fundstelle, ein
Knopf. Vier Zeilen:

> Umlauf zur 6. Schicht · zur Kenntnis
> **Erledigung**
> Was draußen umherläuft, ist unbearbeitet. Wer zuschlägt, schließt ab. Es fällt Aktenkonfetti.
> Hausordnung, Punkt 1 von 11. Alle Punkte stehen in der Dienstanweisung, am Pult im Amt und auf dem Startbild.

Die Fundstelle redet normales Deutsch (Formregel „Das Register hängt am
Ort"), der Punkt selbst ist Werkzeugtext des Vordrucks und bleibt, wie er ist.

## 2. Der Kalender

| Schicht | Morgen |
|---|---|
| 1 | der Empfang |
| 2 bis 5 | je ein Blatt der Chronik (Erstbelehrung, RL6) |
| 6 bis 16 | je ein Punkt der Hausordnung, Punkt 1 bis 11 |
| ab 17 | nichts |

**Nicht beides am selben Morgen stapeln** war die Ansage, und die Chronik war
zuerst da. `schichtAntreten()` ruft die Erstbelehrung und, nur wenn die nichts
gebracht hat, die Hausordnung; `hausordnungIndex()` liefert für die Schichten
1 bis 5 ohnehin −1, und `anfangAssert()` zählt das beim Laden durch (jeder
Punkt an genau einem Morgen, keiner an einem Morgen der Chronik oder des
Empfangs).

**Die Reihe folgt dem Kalender, nicht dem Lesen.** Wer die siebte Schicht ohne
Blick auf den Umlauf antritt, bekommt in der achten Punkt 3 und nicht Punkt
2; dieselbe Entscheidung wie bei der Chronik (RL6), aus demselben Grund: ein
Morgen gehört zu einem Tag. Was verpasst ist, steht vollständig im Vordruck,
und die Kladde sagt, wie viele umgelaufen sind.

**Das reicht über Akt I hinaus** (Schicht 10), und das ist belassen, nicht
übersehen. Mit fünf freien Morgen in Akt I wären es fünf Punkte gewesen, und
„Amtsvermögen", „Qualifikation", „Befähigung" und „Zauberbefugnis" hätten
keinen Morgen gehabt, obwohl der Spieler sie ab Stufe 4 braucht. Kapitel 9
sperrt in Akt I den **Fall**, nicht das Haus (Kanon-Entscheidung 1 des
Masterplans, noch nicht getroffen; AN7 setzt sie nicht voraus, die Chronik hat
seit RL6 dieselbe Lesart).

## 3. Was in der Kladde steht

Der Schlüssel `hausordnung:n` liegt in `kladde.anfang` neben `intro:n` und
`ernennung:n`, gesetzt beim Zeigen („gelesen heißt gezeigt", AN5). Er zählt
**nicht** in den Bestand „DER ANFANG": die Dienstanweisung hat dort seit AN5
einen Verweis und keinen Leser („Die Dienstanweisung liegt am Pult im Amt und
auf dem Startbild"), und das bleibt so. Der Verweis bekommt einen Nachsatz,
sobald der erste Punkt umgelaufen ist: „Ihre Punkte laufen ab der 6. Schicht
je Morgen einzeln als Hausmitteilung um: 2 von 11 zur Kenntnis genommen."

Kein neues `amt`-Feld, kein neuer Speicherschlüssel, kein neuer Apparat.

## 4. Ein Fund beim Bauen: die Musik blieb gedämpft

`szeneTafel()` dämpft die Musik mit `MUS.muffle(true)`, und `MUS.muffle()`
merkt sich diesen Wunsch in `ovMuffle`, bis jemand `muffle(false)` sagt. Die
Abschlüsse der Erstbelehrung (RL6), des Wandstücks (`requisitAnsehen()`, AN3)
und des Blattes aus der Kladde (`anfangAufschlagen()`, AN5) blenden das Overlay
aus und rufen `szeneAus()`, sagen aber nichts zur Musik. Gemessen am
04.10.2026, nach dem ersten Chronikblatt: `ovMuffle` true, `muffled` true,
`state` play. **Der Dienst lief nach jedem Morgenblatt gedämpft weiter**, bis
das nächste Overlay den Wunsch überschrieb; die Fensterknöpfe helfen nicht,
sie rufen `muffle()` ohne Argument und rechnen mit dem stehengebliebenen
Wunsch. Behoben an allen drei Stellen und beim neuen Umlauf; `empfang-pruef`
misst es seither nach dem Chronikblatt und nach dem Umlauf.

## 5. Entscheidungen

* **Die elf Punkte, nicht eine neue Liste.** Eine „Hausordnung" mit eigenem
  Text wäre ein viertes Erklärstück gewesen, und der Masterplan ist gegen die
  Zählung angetreten, nicht gegen die Länge.
* **Ab Schicht 6, nicht verschränkt mit der Chronik.** Verschränkt hieße an
  einem Morgen zwei Blätter oder eine Chronik, die bis Schicht 9 dauert.
  Beides war ausgeschlossen.
* **Die Form aus U9, nicht die Urkunde.** Der Plan nennt den Träger. Und eine
  Urkunde für „Es fällt Aktenkonfetti" wäre Prunk ohne Gegenstand (Grundgesetz
  10, die Gegenprobe).
* **Kein Absender, keine Unterschrift.** Wie bei der Chronik (RL6): ein Kopf
  „gez. N. N." wäre erfundener Text, und die Pointe mit der Leitung gehört
  den Figuren, die sie aussprechen.
* **Die Hausmitteilung des Spiels (U9) und der Umlauf des Hauses teilen die
  Form und nichts sonst.** Der eine sagt, was am Spiel neu ist, der andere, was
  im Haus gilt. Dass beides HAUSMITTEILUNG heißt, ist die Vorgabe des Plans und
  im Haus kein Widerspruch: dieselbe Behörde macht beides so.

## 6. Abnahme

| Prüfung | Ergebnis |
|---|---|
| `node --check` über sieben Dateien | still |
| `tools/empfang-pruef.mjs` | 173 von 173 (war 150; 26 Zusagen zur Hausordnung dazu, eine aus RL6 umgeschrieben) |
| `tools/szene-pruef.mjs` | 50 von 50 |
| `tools/mitteilung-pruef.mjs` | 32 von 32 (Stempel `2026-10-04-an7`) |
| `tools/menue-pruef.mjs` | 78 von 78 |
| `tools/speicher-pruef.mjs` | 38 von 38 |
| `tools/anlage2-pruef.mjs` | 123 von 123 |
| `tools/ladelauf-pruef.mjs` | still, 12x „in Ordnung", 0 Warnungen, mit Grafik |
| `tools/intro-pruef.mjs` | Pflichtweg 804, unverändert (der Umlauf liegt hinter dem ersten freien Schritt) |
| Abzug der Hausmitteilung auf 390×844, 844×390, 1280×720 (Punkt 1 und 10) und des Akten-Reiters | im Bild, ein Knopf, nichts rollt; angesehen |

`empfang-pruef` prüft seit AN7 einen eigenen Abschnitt (26 Zusagen: Vorrang
der Chronik, der sechste Morgen, Form und Knopf, Welt steht, Musik frei,
Kladde, kein zweites Mal, Kalender, sechzehnter und siebzehnter Morgen,
Spielstand, freies Spiel, Telefon) und misst in RL6s Abschnitt den sechsten
Morgen neu: kein Chronikblatt mehr, sondern der Umlauf.

## Offen

* Die drei Kanon-Entscheidungen des Masterplans sind weiter nicht getroffen;
  AN7 hängt an der ersten nur insofern, als er dieselbe Lesart benutzt wie RL6.
* Papers, Please lässt die Regel des Tages den Tag verändern. Hier sagt sie
  nur, was gilt. Ob ein Punkt am Morgen seines Umlaufs etwas auslösen soll
  (ein Aushang am Tag des Aushangs, ein Kessel am Tag der Beglaubigung), ist
  eine Entscheidung über den Akt I und keine Zeile im Vorbeigehen.
