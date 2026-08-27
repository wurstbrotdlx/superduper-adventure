# Bauabschnitt AN2: die Amtsstube ist die Bühne

Der Empfang spielt im Raum statt auf Schwarz. Knöterich steht darin. Der erste freie Schritt ist der Schritt aus der Amtsstube hinaus.

Wie AN1 ändert AN2 **keine Zeile Text und kein Blatt**. Die Zahlen aus `tools/intro-pruef.mjs` stehen unverändert: 2342 Wörter, 28 Lesestufen, 13 Tafeln ohne Wahl. Gekürzt wird in AN3 und AN4.

## Warum der Raum und nicht Schwarz

Der Masterplan begründet es damit, dass Knöterich dort **zeigen kann statt zu erzählen** — die Tafel über der Tür trägt das Weltgesetz, die Karte an der Wand die Ablage, ein Aktenschrank ist deutlich zu groß für fünf Leute. Diese Requisiten sind AN3. AN2 stellt die Bühne, auf der sie später stehen können.

**E2 wird dabei nicht aufgegeben, sondern anders eingelöst.** E2 verlangt „die Tafel ist das Einzige im Bild", und die Bedingung ist erfüllt, weil der Raum **stillsteht**: `state` ist `'szene'`, `update(dt)` steigt in Zeile zwei aus, niemand läuft, die Uhr geht nicht. Ein Raum, in dem sich nichts bewegt, ist kein Hintergrundrauschen, sondern ein Bild. Genau diese Bedingung hatte AN1 vorbereitet.

**Die Ernennung bleibt auf Schwarz.** `empfangErnennung()` ruft weiter `buehneAn()`, und das ist T2 und wird nicht angetastet: *„es ist ein Rechtsakt des Hauses, und das Haus macht keinen Rechtsakt vor laufender Weltkulisse."* Der Ablauf ist damit: Raum (Vorstellung) → Raum mit Tafeln (Intro) → Raum (Empfang) → Schwarz (Ernennung, Anlage 2) → Raum → hinaus.

**Über die Wortwahl des Masterplans hinaus, und das steht hier offen:** der Plan sagt „für den Empfang wird die Bühne der Raum". Gebaut ist, dass **der ganze Anfang bis zur Ernennung** im Raum spielt, also auch der Kachelstapel und der übersprungene Vordruck. Anders ginge es nur mit einem Hin und Her zwischen Raum und Schwarz, und die Kacheln verschwinden in AN3 ohnehin.

## Die vier geänderten Stellen

**`innenBesetzung`**, eine Angabe statt einer Sonderregel. Wer im Raum steht, ist normalerweise eine Frage der Uhr — `figDrinnen()` liest `innenZeit()`. Für den Anfang trifft das zweimal daneben, und A0 hat beide Male gemessen: vor dem Dienstantritt stand Nörgel da, obwohl er nicht soll, und seit AN1 steht niemand da, obwohl einer soll.

Das Feld trägt **fertige `npcs`-Einträge und keine Schlüssel**. Der Grund ist Knöterich: er steht nicht in `DORF_FIGUREN`, aus der `betreteHaus()` seine Leute zieht. Er ist `KN_FIGUR`, eine eigene Größe mit eigenem Blatt (`EMPFANG_BLATT`) und eigenem Baum, und über einen Schlüssel wäre er dort nicht zu erreichen. Der fertige Eintrag `knNpc` liegt bereits im Code — er wird kopiert, nicht verändert, denn draußen benutzt `scanAktion()` dasselbe Objekt.

Gesetzt wird es an genau einer Stelle (`empfangStarten`) und zurückgenommen an genau einer (`dienstAntritt`), so wie der `state` des Anfangs seit AN1.

**`betreteHaus()`** liest die Angabe: liegt sie vor, gilt sie und die Uhr schweigt.

**`empfangStarten()`** ruft `betreteHaus()` statt `buehneAn()`. Der harte Schnitt ist Absicht und kein Sparzug — kein Weg zur Tür, kein Suchspiel. `betreteHaus()` wird **gerufen und nicht angeboten**, das ginge auch gar nicht: `scanAktion()` steht still, solange die Szene läuft.

**`dienstAntritt()`** nimmt die Besetzung zurück. Der Spieler bleibt, wo er ist.

## Nörgel steht nicht da, und das ist eine Entscheidung

Genau einer steht im Raum, und es ist der, der spricht. Zu Dienstbeginn sitzt Nörgel nicht auf Feierabend, und eine zweite Gestalt im Bild wäre das Rauschen, gegen das E2 gebaut wurde. Wer das anders entscheidet, legt ihn in `innenBesetzung` dazu und sonst nirgends — das ist der ganze Zweck des Feldes.

## Gemessen: der erste freie Schritt

Am laufenden Spiel, durchgeklickt bis ans Ende:

| | |
|---|---|
| beim Empfang | `state 'szene'`, `innen 'amt'`, `currentLevel 4`, `npcs ['knoeterich']`, Bühne aus |
| am ersten freien Schritt | `state 'play'`, weiter in der Amtsstube, Besetzung zurückgenommen |
| **die erste angebotene Aktion** | **`aktArt 16` = `AKT_HAUSAUS`, „Hinausgehen"** |
| nach dem Hinausgehen | `currentLevel 1`, (5008, 4958) vor der Amtstür, 14 Dorffiguren und 8019 Bäume zurück |

Damit ist eingelöst, was der Masterplan als Ziel formuliert hat: *„Der erste freie Schritt ist der Schritt aus der Amtsstube hinaus ins Dorf."*

## Anlage 2 schweigt in seiner Gegenwart, auch drinnen

`anlage2Allein()` trug den Kommentar *„Knöterich bleibt draußen, deshalb wird er drinnen nicht gefragt"*. Seit AN2 stimmt die Prämisse nicht mehr. **Die Rechnung trägt es trotzdem, und zwar ohne Zutun:** er liegt drinnen als `npcs`-Eintrag, `figHier()` lässt ihn bei gesetztem `innen` durch, und die Schleife findet ihn.

Nachgemessen am laufenden Spiel — direkt neben ihm und vierhundert Pixel quer durch den Raum, beide Male **„nicht allein"**. Der Raum ist kleiner als der Hörweitenradius von 450 Pixeln, der ganze Raum zählt also als Hörweite, und das ist für einen Raum richtig. Der Kommentar steht berichtigt.

## Ein Fehler, den AN2 freigelegt hat und der nie AN2s war

`gespraech-pruef` meldete nach dem Umbau *„keine Seite des Vordrucks läuft über"* — zwei Seiten von Blatt 1 liefen über. Deterministisch: **dreimal von drei Läufen, gegen null von drei davor.**

Die Ursache liegt in `showDienstblatt()` und ist älter als AN2. Die Funktion misst die Seitenhöhen mit `dienstblattSeiten()` und setzt `document.body.classList.add('vordruckOffen')` **erst als letzte Zeile** — also hinter der Messung. Die Klasse ist aber genau die, die das Blatt breit macht:

```css
body.introBuehne #overlay .panel,
body.vordruckOffen #overlay .panel{ width:min(760px,92vw); … }
```

Ohne sie misst die Waage gegen ein schmaleres Blatt, der Text bricht seltener um, jede Blockhöhe fällt zu klein aus, und es passt zu viel auf eine Seite. Genau diese Falle steht im Kommentar der CSS-Regel bereits beschrieben — für einen anderen Fall.

**Die falsche Reihenfolge war gedeckt, solange zufällig eine zweite Klasse dasselbe tat.** Die Regel steht doppelt, `body.introBuehne` trägt dieselbe Breite, und der Vordruck lief bis hierher immer auf der schwarzen Bühne. Seit der Empfang in der Amtsstube spielt, fällt diese Deckung weg.

Behoben, indem die Klasse vor die Waage rückt. Danach 0 von 3.

## Was die Prüfläufe gelernt haben

Fünf Läufe kürzen den Anfang ab und wollen danach im Dorf stehen. Sie standen ab AN2 in der Amtsstube — `map` trägt dort den Grundriss und `npcs` die Leute des Raumes, also traf jede Weltmessung den falschen Ort. Sie gehen jetzt den Schritt hinaus, wie ein Spieler ihn geht: `anlage2-pruef`, `szene-pruef`, `gespraech-pruef`, `ebene-pruef`, `stopfen-pruef`.

In `empfang-pruef` sind drei Zusagen umgeschrieben statt gestrichen. Wo „die Bühne steht" und „das Dorf ist verdeckt" stand, steht jetzt das **strengere** Versprechen: die Amtsstube ist die Bühne, das Dorf ist nicht im Bild, Knöterich steht darin, und der Raum steht still. Eine schwarze Fläche konnte nur da sein; ein stillstehender Raum muss vier Dinge zugleich einhalten. Aus einer Prüfung wurden vier, der Lauf steht auf 100.

## Geprüft

| Lauf | |
|---|---|
| `empfang-pruef` | **100/100** (war 98, eine Zusage wurde zu vier) |
| `anlage2-pruef` | 123/123 |
| `szene-pruef` | 50/50 (war 49, plus „und zwar im Dorf, nicht mehr im Haus") |
| `menue-pruef` | 78/78 |
| `stopfen-pruef` | 43/43 |
| `zulagen-pruef` | 50/50 |
| `versuchung-pruef` | 67/67 |
| `speicher-pruef` | 38/38 |
| `mitteilung-pruef` | 32/32 |
| beide `fehlversuch` | grün |
| `intro-pruef` | alle vier Routen, Exit 0, Zahlen unverändert |

Weiterhin nicht grün, unverändert gegenüber dem Stand vor AN2 und in beiden Fällen die fehlende Grafik (`assets/cf/` liegt in diesem Klon nicht vor): `gespraech-pruef` 87/89, `ebene-pruef` 53/54, `innen-pruef` 16/18 mit Abbruch.

## Offen

* **AN3** macht die Kacheln zu Requisiten. Erst dann trägt der Raum, was er zeigen soll, und erst dann fallen die 13 Lesetafeln.
* Der Kaltstart und die Titelkarte aus dem Masterplan (Schritte 1 und 2 des neuen Ablaufs) sind nicht gebaut. `buehneAn()` liefert die Titelkarte heute nur noch für die Ernennung.
* Ob Nörgel im Anfang doch dastehen soll, ist eine Kanon-Frage und in `innenBesetzung` mit einer Zeile zu drehen.
