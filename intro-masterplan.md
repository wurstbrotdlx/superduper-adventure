# Intro- und Akt-I-Masterplan, Fassung 2

**Konzept, kein Kanon.** Entstanden am 27.08.2026 in einer reinen
Konzeptsitzung, nichts gebaut, nichts committet. Quelle: Projektnotiz
`Privat/Projekt_SuperDuper_Adventure.md`, Abschnitt „Stand 27.08.2026 (3)".
Die Notiz hält selbst fest, dass dieses Dokument ins Repo gehört, neben die
`phase-*.md`, unter dem Namen `intro-und-akt1-masterplan.md`.

**Zur Nummerierung:** der Plan schreibt `A0` bis `A7`. Bauabschnitt A0 hat
gegengeprüft, dass `A1` ff. im Repo doppelt belegt sind (Aktenblätter der Serie
A **und** Monsterklassen in `index.html`, zusammen 227 Treffer), und die Reihe
deshalb in `AN1` bis `AN7` umbenannt. `A0` bleibt `A0`. Gebaut sind AN1, AN2
und AN3.

---

## Der Befund und die Diagnose

**Rückmeldung der Tester:** Inhalt gut, Humor kommt an, aber Intro +
Kachelstapel + Anlage-2-Erstkontakt + Dienstanweisung sind zusammen zu viel
Text.

**Diagnose, und sie ist der Kern der ganzen Sitzung:** Das Problem ist nicht,
dass ein Stück zu lang ist, sondern dass es **vier** sind. Jedes um ein Drittel
kürzen ergibt vier kürzere Erklärstücke und dieselbe Rückmeldung. Die
**Zählung** ist der Hebel, nicht die Länge.

**Zweiter Befund, teuerster Einzelposten:** Das Weltgesetz fällt dreimal in fünf
Minuten – Kacheln (T5d), Vordruck (W8), Anlage 2 wortwörtlich (T5b). Die Ansage
vom 26.08.2026, dass Doppelung gewollt ist, bleibt richtig, trägt aber nur **mit
Abstand**. Drei Wiederholungen im Eingangstrichter sind kein Sicherheitsnetz,
sondern die Ursache. [Wahrscheinlich]

**Leitentscheidung:** Gestrichen wird nichts, umgehängt wird alles. Eins bleibt
vorne, drei bekommen später einen Anlass.

## Der neue Ablauf

1. **Kaltstart draußen**, null Wörter: ein Vorgang, erledigt, Konfetti mit
   Zahlen, niemand sagt etwas dazu. Trägt die E2-Bühne auf Schwarz.
2. **Titelkarte** (E2-Optik, nur hinter die erste Handlung versetzt). Der
   Untertitel wird damit von einer Behauptung zur Bestätigung.
3. **Harter Schnitt in die Amtsstube**, kein Weg zur Tür, kein Suchspiel.
4. **Der Empfang**, das einzige Erklärstück vor dem ersten freien Schritt.
   Deckel bei fünf bis sechs Fragen im Erstlauf, Rest bleibt anwählbar. **Der
   Raum steht still**: keine Bewegungsfreiheit während der Szene, sonst kehrt
   genau das Hintergrundrauschen zurück, gegen das E2 gebaut wurde.
5. **Ernennung** (T2, Titel wird verliehen), dann Kontrollübergabe. **Der erste
   freie Schritt ist der Schritt aus der Amtsstube hinaus ins Dorf.**

## Warum die Amtsstube und nicht Schwarz

Knöterich kann dort **zeigen statt erzählen**. Jedes Requisit ersetzt Lesetext
durch einen Blick: Tafel über der Tür (Weltgesetz), Karte an der Wand
(Landschaft ist Ablage), zwei Türen mit N. N. nebeneinander, Pappschild, ein
Aktenschrank deutlich zu groß für fünf Leute, das Pult mit dem Vordruck. Alles
bereits Kanon (Kapitel 4) oder Baustand (IN1).

**Faustregel:** Trägt ein Gegenstand eine Tatsache, darf der Text sie nicht mehr
aussprechen. Sonst ist die Doppelung nur vom Stapel in den Raum gewandert.

## Was wohin wandert

| Stück | bisher | neu |
|---|---|---|
| Kachel Tafel über der Tür | Blatt im Stapel | Requisit im Raum |
| Kachel Karte | Blatt im Stapel | Requisit im Raum |
| Kachel Einstellungsformular | Blatt im Stapel | Antwort auf eine Empfangsfrage |
| Kacheln Chronik, vier Stück | Blatt im Stapel | Erstbelehrung, je ein Blatt in Akt I mit Absender |
| Vordruck / Dienstanweisung | Station im Ablauf | liegt am Pult, plus Kladde |
| Anlage 2 Erstkontakt | Station im Ablauf | frühestens Schicht 2, an Bedarf gehängt |
| Empfangsfragen 6–14 | Pflichtstrecke | optional |

## Regel, die sich als falsch geschnitten erwiesen hat

„Nie zwei Lesetafeln hintereinander" war wirkungslos, solange Weiterblättern als
Eingabe zählt. **Neu: eine Eingabe zählt nur, wenn sie eine Wahl ist.** Ein Tipp
auf WEITER ist eine Umblätterhilfe. Das erklärt, warum sieben blätterbare
Kacheln sich wie eine Wand anfühlen, obwohl der Spieler siebenmal getippt hat.

Dazu zwei neue Regeln: genau ein Erklärstück vor dem ersten freien Schritt, und
dieselbe Tatsache höchstens einmal vor Schicht 5.

## Akt I: verteilt wird die Hausordnung, nicht der Fall

Träger ist die **Hausmitteilung** (U9), pro Schicht genau eine neue Regel, vier
Zeilen. Direkte Übernahme des Papers-Please-Prinzips: kein Regelwerk, jeden
Morgen ein Blatt. `AKTE_SPERRE` gilt in Akt I lückenlos. Damit bleibt Kapitel 9
in der Sache unangetastet, denn die Funkstille galt immer dem Fall, nicht dem
Amt.

## Vier Prüfungen vor der ersten Zeile Code

1. **Der Rückweg von `betreteKammer()`.** Der Trick friert die Oberwelt ein und
   holt sie beim Hinausgehen zurück. Im Intro gäbe es beim Betreten nichts
   einzufrieren und beim Hinausgehen nichts zurückzuholen. [Wahrscheinlich] der
   einzige echte Neubau des Umbaus. Ersatzweg, falls er nicht trägt: Oberwelt
   still im Hintergrund aufbauen, sichtbar erst beim Hinausgehen.
2. **`phase:'feierabend'`** entscheidet, wer im Haus steht. Das Intro läuft
   nicht im Feierabend – ohne Ausnahme steht Knöterich nicht da, oder Nörgel
   steht da, obwohl er nicht soll.
3. **`AMT_TUER` und `tuerDx`** (gemessen −16, −33, +17 in IN1) müssen für den
   umgekehrten Weg genauso stimmen.
4. **`durchDenStapel`** in `empfang-pruef.mjs` und `menue-pruef.mjs` sucht den
   Weiterknopf am Wortlaut. Werden Kacheln zu Requisiten und Antworten, ändert
   sich der Weg durch den Stapel und der Lauf bricht still, ohne rot zu werden.
   Bekannte Falle aus T6, hier wieder scharf.

## Bauabschnitte, Risiko-Reihenfolge

`A0` Messlauf `intro-pruef.mjs` → `A1` Reihenfolge → `A5` Kladde
(Ungelesen-Zähler, Skip-Auffangbecken) → `A2` Amtsstube als Bühne → `A3`
Kacheln werden Requisiten → `A4` Anlage 2 raus aus der Kette → `A6`
Erstbelehrung nach Akt I → `A7` Hausmitteilung als Tagesträger.

**A0 zuerst und ohne Ausnahme.** Ohne Ausgangszahl ist jeder Schnitt eine
Behauptung. Zielwert: **unter 400 Wörter bis zum ersten freien Schritt im
Dorf**, Ist [Vermutung] 1200 bis 2000.

[Vermutung] Kürzel `A1` ff. können im Repo kollidieren, T5 musste schon einmal
zu T6 umbenannt werden. Vor Vergabe gegenprüfen.

## Kanon-Entscheidungen, die anstehen (noch nicht getroffen)

1. **Weltbibel Kapitel 9, Akt I** – der Satz, dass niemand aufgreift, was das
   Intro zeigte, muss präzisiert werden: er gilt dem **Fall**, nicht dem
   **Haus**.
2. **T5d wird teilweise zurückgenommen** – Karte und Tafel über der Tür bleiben
   inhaltlich vollständig, verlassen aber den Stapel und werden Gegenstände.
   Die gewollte Doppelung mit Anlage 2 bleibt, sie beginnt nur später.
3. **E2 „Der Anfang läuft auf Schwarz"** gilt weiter für Kaltstart und
   Titelkarte. Für den Empfang wird die Bühne der Raum, unter der Bedingung,
   dass er stillsteht. E2s Begründung (die Tafel ist das Einzige im Bild) bleibt
   damit erfüllt.

## Recherchegrundlage

Vierzehn Muster aus best bewerteten Anfängen und Fachliteratur, u. a. Half-Life
(Steuerung vor Erzählung), Half-Life 2 (Welt steckt im Gegenstand), World 1-1
und Hayashidas Vierer, Mega Man X (vorführen statt beschreiben), **Papers,
Please** als engster Verwandter (Pope: Regeln ändern sich von Tag zu Tag, um
Druck aufzubauen und die Geschichte zu lenken), Outer Wilds (Wissen ist der
Fortschritt), Disco Elysium (Kurvitz lehnte das Dialogfenster an Twitter-Feeds
an, weil Form das Lesen erträglich macht, nicht Kürzung), Jenkins (Raum als
Gedächtnispalast). Vollständige Quellenliste im Masterplan-Dokument.

## Ablageorte

- Masterplan Fassung 2, vollständig: Deliverable aus der Claude-Sitzung vom
  27.08.2026, gehört ins Repo neben die `phase-*.md`, Vorschlag
  `intro-und-akt1-masterplan.md`.
- Fassung 1 überholt, Unterschiede in Fassung 1 Kapitel 0 dokumentiert.

## Offen (Stand der Konzeptsitzung)

- [ ] Prüfung 1 (`betreteKammer()`-Rückweg) klären, davon hängt der ganze
      Ablauf ab
- [ ] `A0` Messlauf bauen, Ist-Spalte füllen
- [ ] Die drei Kanon-Entscheidungen treffen und in `superduper-weltbibel.md`
      nachziehen
- [ ] Kürzel-Kollision `A1` ff. im Repo gegenprüfen
- [ ] T5e bleibt unverändert offen

---

## Nachtrag der Ablage, 27.08.2026 (AN4)

Dieses Dokument ist **wie erhalten abgelegt** und wird nicht nachgeführt; was
seither entschieden oder gebaut wurde, steht in den `phase-*.md`. Abgelegt
wurde es unter `intro-masterplan.md` und nicht unter dem oben vorgeschlagenen
`intro-und-akt1-masterplan.md`, weil die Übergabe an AN4 diesen Namen nennt.

**Warum die Ablage überhaupt ein Bauschritt war.** A0 bis AN3 zitieren den Plan
durchgehend, und bis heute war kein einziges dieser Zitate aus dem Repo heraus
prüfbar. Beim Nachlesen fällt eine Abweichung auf, und sie steht hier, weil
dieses Projekt Berichtigungen aufschreibt statt sie zu glätten:

* **Die Requisitenregel ist eine Paraphrase, kein Zitat.** AN3 führt sie als
  *„was ein Gegenstand trägt, darf der Text nicht mehr aussprechen"*. Der Plan
  schreibt: *„Trägt ein Gegenstand eine Tatsache, darf der Text sie nicht mehr
  aussprechen."* In der Sache dasselbe, in Anführungszeichen nicht. AN4 zitiert
  ab hier den Wortlaut.
* Geprüft und **wörtlich richtig** zitiert sind dagegen: der Zielwert („unter
  400 Wörter bis zum ersten freien Schritt im Dorf"), A0s Begründung („Ohne
  Ausgangszahl ist jeder Schnitt eine Behauptung"), die Zählregel („eine
  Eingabe zählt nur, wenn sie eine Wahl ist"), AN2s Zielsatz („Der erste freie
  Schritt ist der Schritt aus der Amtsstube hinaus ins Dorf") und die Reihe der
  Bauabschnitte.
