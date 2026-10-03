# Bauabschnitt RL6: Der Anfang in Raten — ERLEDIGT

Sechster Abschnitt der Release-Reihe, und der erste, der den Anfang selbst
anfasst. Auftrag des Projektinhabers: den Anfang kürzen, ohne den Humor zu
kürzen; die Spieler sollen ins Spiel und das Wissen, das bis dahin eine Wand
aus Text war, im Spiel bekommen. Das ist Wort für Wort die Leitentscheidung
des Masterplans vom 27.08.2026: **„Gestrichen wird nichts, umgehängt wird
alles."** Gebaut sind hier die zwei Bauabschnitte, die davon noch offen waren
(AN6, die Chronik als Erstbelehrung) und die eine Zeile, die AN4 als
Abweichung notiert hatte (Anlage 2 an den Bedarf statt an die Tür), dazu der
Weg am Anfang vorbei an der Stelle, an die er gehört.

Datum der Messungen: 03.10.2026, `tools/intro-pruef.mjs`, ohne Grafik.

---

## 1. Gemessen, vorher gegen nachher

| Route | vorher | nachher | |
|---|---|---|---|
| **Pflicht** (kürzester Weg, die Hauptzahl) | **1174** | **806** | −31 % |
| Vordruck | 1276 | 908 | −29 % |
| Vielleser (alles, was angeboten wird) | 1539 | 1171 | −24 % |
| Springer | 917 | 664 | −28 % |
| Nachlauf hinter dem ersten freien Schritt (Vielleser) | 787 | 0 | |
| Anfang insgesamt bis frei im Dorf (Vielleser) | 2326 | 1171 | −50 % |
| Längster Leseblock ohne echte Wahl | 575 (Empfang bis Intro, 10 Stufen) | 529 (Ernennung, 6 Stufen) | |
| Erklärstücke vor dem ersten freien Schritt | 3 (Empfang, Intro, Ernennung) | 2 (Empfang, Ernennung) | |
| Echte Wahlen auf dem Pflichtweg | 3 | 4 | |
| Erste echte Wahl auf Stufe | 10 | 1 | |

Der Zielwert des Masterplans (unter 400) ist nicht erreicht, und das steht
hier mit Grund: **der Rest ist die Ernennung** (529 Wörter, sechs Blätter,
keine Wahl). Sie ist die Beförderungszeremonie aus Weltbibel 18.12, Stolzregel
0 verlangt sie vor dem ersten Schritt, und ihre Länge ist ihr Witz („Zwirn
liest jede Zeile laut vor"). Wer unter 400 will, kürzt die Zeremonie, und das
ist genau der Schnitt, den der Auftrag ausgeschlossen hat. Was ohne diesen
Schnitt noch ginge, steht unter „Offen".

## 2. Was gebaut ist

**Die Chronik fällt in Raten (AN6).** Die vier Chronikblätter hingen seit T5d
mitten in der Vorstellung, zwischen Knöterichs sechstem Zug und dem Gruß: 386
Wörter, keine Wahl. Jetzt fällt am Morgen der Schichten 2 bis 5 je eines, in
der Reihenfolge der Chronik, am Knopf NÄCHSTE SCHICHT ANTRETEN
(`schichtAntreten()` → `erstbelehrungZeigen()`). Es ist dieselbe Tabelle
(`INTRO_BLAETTER`), derselbe Apparat (`szeneTafeln`), und die Kladde hakt es
ab wie seit AN5 jedes gelesene Blatt des Anfangs; wer die Chronik aus einem
älteren Stand kennt, bekommt nichts, der Merker ist derselbe. Die Fußzeile
zählt „Blatt II von IV" (`opt.blattzahl`, die einzige Erweiterung am
Tafelstapel), weil es das zweite von vier ist und kein Requisit. Gehängt an den
Knopf und nicht an `startShift()`, weil `startShift()` auch beim Einlösen eines
Spielstands läuft und ein Mittag kein Morgen ist.

Knöterich sagt es selbst, im sechsten Zug: „Warum es dieses Haus gibt,
bekommen Sie in Raten, ein Blatt je Morgen. Heute nur eins: der Satz über der
Tür." Damit trägt die Vorstellung den Zeiger auf die Tafel, den bis hierher
das vierte Chronikblatt trug (AN3); das Blatt selbst zeigt seit RL6 „wenn Sie
das nächste Mal hineingehen", denn wer es liest, steht draußen.

**Anlage 2 kommt an den Bedarf.** AN4 hatte ihren Erstkontakt an den Schritt
vor die Tür gehängt und die Abweichung vom Masterplan („frühestens Schicht 2,
an Bedarf gehängt") samt der einen Zeile notiert, an der sie hängt. Gemessen
lagen hinter dem ersten freien Schritt 787 Wörter auf sechs Lesestufen, und
das war nach dem Umbau der größte Block, der einem neuen Spieler noch vor dem
Spielen stand. `ernennungEnde()` setzt den Merker nicht mehr; der Bedarf ist
der erste Griff zur Tasche (`anlage2Nachholen`, seit T3), in jeder Schicht,
auf jedem Weg. `anlage2VorDemHaus()` bleibt stehen und ist ohne Merker ein
Leerlauf; die AN4-Fassung ist eine Zeile entfernt.

**Der Weg am Anfang vorbei steht am ersten Knoten.** ÜBERSPRINGEN stand auf
dem ersten Chronikblatt, also nach sechs Zügen; seit die Chronik nicht mehr in
der Kette hängt, steht er als zweite Zeile am ersten Knoten: „Kenne ich. Den
Vordruck." Für den Messlauf ist das die erste echte Wahl des Spiels, auf
Stufe 1 statt Stufe 10. Der Springer schlägt damit kein Blatt des Anfangs mehr
auf (vorher eines, weil ÜBERSPRINGEN auf einem Blatt stand).

## 3. Entscheidungen

* **Die Ernennung bleibt, wie sie ist.** Siehe oben.
* **Die Vorstellung bleibt sechs Züge.** Der Masterplan deckelt den Erstlauf
  bei fünf bis sechs Fragen; sie liegt am Deckel. Jeder Zug trägt eine Pointe
  („Fünf Beschäftigte, ein Kater, ein Schild aus Pappe"), und die Pointe
  braucht ihren Takt (E1).
* **Ein Blatt je Morgen, nicht alle am ersten.** Papers-Please-Prinzip aus dem
  Masterplan: kein Regelwerk, jeden Morgen ein Blatt. Wer Schicht 3 nicht
  liest, bekommt in Schicht 4 Blatt III und nicht Blatt II; die Reihe folgt
  dem Kalender, die Kladde hält den Rest.
* **Kein Absender auf dem Blatt.** Der Masterplan sagt „mit Absender". Die
  Blätter tragen Knöterichs Stimme schon in sich (`{wer:'Knöterich'}`), und
  ein Kopf darüber wäre erfundener Text. Wer ihn will, hat ihn mit einer Zeile.

## 4. Was die Prüfläufe gelernt haben

* `empfang-pruef.mjs`: der Anriss-Abschnitt prüft jetzt den hub statt vier
  Tafeln, der Erstkontakt an der Tür wurde zum Erstkontakt an der Tasche, der
  Springer wählt am ersten Knoten, die Kladde-Zahlen stehen auf null von zehn,
  und ein eigener Abschnitt prüft die Erstbelehrung (Blatt I bis IV, Abhaken,
  kein zweites Mal, sechste Schicht leer, Spielstand ohne Morgenblatt, freies
  Spiel ohne Erstbelehrung). 150 Prüfungen, war 131.
* `intro-pruef.mjs`: die Route Springer nimmt am ersten Knoten die letzte
  Zeile. Alles andere misst unverändert, und die Zahlen oben sind seine.
* Ein Fund beim Bauen: der Antwortdeckel der Szenen (`ANTWORT_DECKEL`) liegt
  unter 31 Zeichen. „Ich kenne das Haus. Den Vordruck, bitte." (40) fiel,
  „Ich kenne das Haus. Den Vordruck." (33) auch, „Kenne ich. Den Vordruck,
  bitte." (31) ebenfalls; gebaut ist „Kenne ich. Den Vordruck." (24). Der
  Guard hat jede Fassung gemeldet, bevor ein Lauf lief, und zwar als
  Konsolenzeile in jedem Lauf, der die Konsole prüft.

## 5. Abnahme

Siehe Prüfprotokoll unten; die Reihe aller 17 Läufe nach dem Umbau steht dort
mit Datum.

## Offen

* **Unter 400 geht nur über die Ernennung.** Die zwei Blätter ohne Rechtsakt
  (Zwirns Auftritt, 74 Wörter; Trepp mit dem Postsack, 82) wären 156 Wörter
  und ließen 650; der Rest ist Urkunde, Aushändigung, „Auf die Form!" und der
  Auftrag. Das ist eine Entscheidung des Projektinhabers über die Zeremonie,
  keine Umhängung.
* **AN7, die Hausmitteilung als Tagesträger** (eine Regel je Morgen), bleibt
  offen; die Erstbelehrung benutzt denselben Morgen und wäre ihr erster Fall.
* Die drei Kanon-Entscheidungen des Masterplans sind weiter nicht getroffen.
