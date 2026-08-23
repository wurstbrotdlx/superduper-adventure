# Bauabschnitt F1: Figurenleben — ERLEDIGT

Ausgeführt nach `superduper-figurenleben-prompt.md`, in fünf Lieferungen. Was hier steht,
sind die Entscheidungen, die Funde und das Prüfprotokoll. Die Inhalte selbst stehen in
`figuren-leben.md`, der Code in `index.html`.

**Was F1 gebracht hat, in Zahlen:** achtzehn Hintergrundgeschichten mit siebzehn neuen
harten Tatsachen (Lott und Pahl teilen sich eine), eine Abkürzungstabelle mit zwölf
Einträgen, rund 170 neue Zeilenpaare an vierzehn Dorffiguren, acht neue Fragen bei
Bramsche, dreizehn Gesprächsbäume mit zusammen 78 Fragen und 32 Knoten, acht neue
Schaltertypen für Zusatzblöcke und sechs neue Prüfungen in den Guards.

---

## Die vier Entscheidungen, die den Abschnitt geprägt haben

### 1. Eine Tabelle für beide Seiten, nicht zwei Listen

`figZusatz()` entscheidet, ob ein Zusatzblock offen ist, `knAssertCaps()` prüft, ob sein
Schalter überhaupt existiert. Vor F1 stand die Logik zweimal da, einmal als Ternär und
einmal als zwei `if`. Mit acht Schaltern wäre das achtmal doppelt gewesen.

Beide lesen jetzt `ZUSATZ_SCHALTER`. Jeder Eintrag hat `frei(w, z)` für die Laufzeit und
`pruef(w, z)` für den Start. Ein neunter Schalter kostet damit vier Zeilen an einer Stelle,
und die Prüfung kommt von selbst mit.

**Die Feinheit dabei:** `pruef` läuft auf Skriptebene und darf deshalb nichts anfassen, was
weiter unten deklariert ist. `frei` darf es, weil es erst zur Laufzeit gerufen wird. Das
steht als Kommentar über der Tabelle, weil es beim nächsten Schalter wieder gilt.

### 2. Ein Block ohne Schalter bleibt zu

Naheliegend wäre gewesen: kein Schalter, also keine Bedingung, also offen. Genau umgekehrt
ist es richtig. Ein Block ohne Schalter ist ein Fehler, den der Guard meldet, und bis er
behoben ist, sollen die Zeilen nicht im Spiel stehen. Ein Fehler ist kein Freibrief.

### 3. Der Baum gehört der Tafel, nicht der F-Taste

Die drei Szenen aus SZ2 fallen über den Spieler her, sobald er die Figur anspricht, laufen
genau einmal und halten die Welt an. Ein Gesprächsbaum tut nichts davon: er wartet als
fünfte Zeile in der Antwortliste, er läuft, so oft jemand mag, und die Schichtuhr läuft
weiter.

Getrennt sind die beiden durch ein Feld: `baum:true`. `szeneFaellig()` überspringt es,
`baumFaellig()` sucht danach. Dieselbe Maschine, zwei Türen. Die F-Taste tut weiter, was sie
seit W3 tut.

### 4. Wo der Guard aufhört

Kürzel werden im Code geprüft, Witze nicht. `ABKUERZUNGEN` ist vollständig prüfbar: jedes
Kürzel im Text muss einen Eintrag haben, jeder Eintrag eine Figur, bei der er aufgeht. Die
Dosen für Anspielungen (höchstens fünf) und Zwinkern (höchstens sechs) stehen dagegen
gezählt im Lieferdokument und nicht im Code. Ein Guard, der Witze zählt, wäre eine
Behauptung über Geschmack; ein Guard, der Kürzel auflöst, ist eine Prüfung auf
Vollständigkeit.

Verbraucht sind zwei Anspielungen und zwei Zwinkern. Der Rest bleibt stehen.

---

## Fünf Funde, die nur das Laufenlassen gefunden hat

### Fund 1: `\b` ist in JavaScript ASCII-basiert

Die Abkürzungserkennung stand zuerst mit Wortgrenzen da. Beim ersten Lauf meldete sie **117
Treffer**, darunter `Tü` aus „Tür" und `Fü` aus „Fürst". Der Grund: zwischen `T` und `ü`
liegt für JavaScript eine Wortgrenze, weil `\b` nur ASCII kennt. Für deutschen Text ist
`\b` damit unbrauchbar.

Das Muster arbeitet jetzt mit Lookarounds über eine Zeichenklasse, die die Umlaute kennt.
Danach blieb genau ein Treffer übrig, und er war berechtigt: `WASD` in Knöterichs
Tastenerklärung. Eine Taste ist keine Abkürzung dieser Welt, sie steht begründet in der
Ausnahmeliste.

### Fund 2: Ein ReferenceError, den `node --check` nicht sieht

`gespraechAssert()` läuft auf Skriptebene und ruft `gespraechOptionen()`. Seit F1d fragt
die über `baumFaellig()` die Szenentabelle. `const SZENEN = {}` stand aber weiter unten:
**Temporal Dead Zone, Absturz beim Laden, `frameNo` blieb 0, die Seite hing im
Ladebildschirm.** Genau der Fehler, den das README als häufigsten dieses Projekts nennt.

Die Deklaration steht jetzt oben bei `szeneAktiv`, aus demselben Grund, aus dem `szeneAktiv`
dort steht. Der Kommentar dazu nennt die Messung, damit sie niemand zurückschiebt.

### Fund 3: `szene.gefragt` war nie allgemein angelegt

Der Fragen-Satz einer Szene wurde ausschließlich in `empfangStarten()` gesetzt. Das ist
vier Szenen lang gutgegangen, weil die drei aus SZ2 gar keine Fragenliste haben und
`szeneOffen()` bei ihnen nie läuft. Ein Baum hat eine, und damit war das `null` ein
Absturz beim Öffnen.

`szeneOeffnen()` legt den Satz jetzt selbst an. Das ist zugleich die Wiederbetretbarkeit:
wer zum zweiten Mal in einen Baum geht, findet alle Fragen wieder vor. **Gefunden hat das
kein Guard, sondern der erste Klick.**

### Fund 4: „dreimal" steht auf der Sperrliste

Zapf sagte in einem Entwurf „Steht da schon dreimal." über die Daten auf der Rückseite des
Provisorium-Schildes. `dreimal` steht in `PRUEF_GEHEIM`, weil drei gleiche Zutaten die
dreifache Ausfertigung ergeben. Die Zeile heißt jetzt „Zum dritten Mal inzwischen."

Dasselbe traf später Vorblatt: sein Stempel hatte „sehr viel bewirkt", und `bewirkt` steht
ebenfalls auf der Liste. Er hat jetzt viel aufgehalten, was ohnehin genauer ist.

**Konsequenz:** der Generator, der die Zeilen erzeugt, liest die Sperrliste seither
wortgleich aus `index.html`. Zweimal derselbe Fund ist einmal zu viel.

### Fund 5: `opts` gilt nur an Knoten, nie an Fragen

Schon beim Schreiben des Musterbaums im Prompt aufgefallen und hier bestätigt:
`szeneOptionen()` liest `opts` ausschließlich an Einträgen aus `knoten`. Eine Frage aus
`fragen` kehrt nach ihrer Antwort immer an den Hub zurück, ganz gleich, was man ihr
anhängt.

Die Wahl in jedem Baum hängt deshalb am `hubAusgang`, dem einzigen frei formulierbaren
Eintrag der Hub-Liste: wer die tiefste Frage gestellt hat, bekommt einen anderen Abschied,
und dahinter liegt die Entscheidung. Das ist nicht nur die Stelle, die funktioniert, es ist
auch die richtige: ein Beamter spricht so etwas beim Hinausgehen an.

---

## Was die Bäume können, und was nicht

**Bauform, dreizehnmal gleich:** ein Hub, sechs Fragen (drei frei, zwei mit Voraussetzung,
eine ab der dritten gestellten Frage), ein Ausgang, der umschaltet, und dahinter eine Wahl
mit zwei Enden. Zehn Knoten je Baum, nie mehr als vier Antworten auf einer Tafel.

**Die Wahl kostet etwas.** In jedem Baum schließt eine Antwort die andere aus, für diesen
Besuch. In drei Bäumen setzt sie zusätzlich einen Merker, und jeder dieser Merker öffnet
bei einer **anderen** Figur zwei Zeilen: Nieselbecks Antrag kommt bei Bramsche an,
Bramsches Heft erreicht Pommer, Lisbeths Seite zwei erreicht Nörgel. Das ist die Belohnung,
die ein Baum geben darf. Gold und Erfahrung darf er nicht geben, sonst wird Reden zum
Farmen und die Spieler klicken Gespräche weg.

**Erzählerische Sackgassen** gibt es in jedem Baum: die höfliche Wand bei Nieselbeck
(„Die Meldung ist täglich." / „Das Wetter nicht."), den falschen Faden bei Milb, den Umweg
bei Zapf. Eine **strukturelle** Sackgasse gibt es nirgends, und `szeneAssert()` würde sie
melden.

**Der Baum der Bank** ist der einzige mit Sprecherwechsel. Die zwei Fragen über Hintermühl
und das gute Ende gehören Pahl, alles andere Lott.

---

## Berichtigung am Prompt

Der Prompt sprach an mehreren Stellen von **zwölf** Bäumen. Es sind **dreizehn**: vierzehn
Dorffiguren minus die geteilte Bank. Die Zahl war falsch gerechnet und ist im Prompt
korrigiert. Der Rest der Vorgaben ist unverändert eingehalten.

---

## Prüfprotokoll

**Baseline vor dem ersten Eingriff**, damit jede spätere Messung einen Vergleich hat:
15 Konsolenmeldungen, alle „in Ordnung", `frameNo` 154. Die vier `Sprite fehlt`-Warnungen
für `Lumberjack_Shirt_1_Green`, `Farmer_Hat_1` und die zwei Plate-Helme sind Bestand: die
Dateien liegen nicht im Grafikpaket, sie sind kein Befund dieser Runde.

**Nach jedem Block** gelaufen: Skript aus `index.html` schneiden, `node --check`, Server,
Browser, Konsole lesen, auf `frameNo > 0` warten statt auf `assetsReady`.

| Messung | Ergebnis |
|---|---|
| `node --check` | fehlerfrei nach jedem Block |
| Konsole am Ende | 15 Meldungen, dieselben wie in der Baseline, keine zusätzliche |
| `knAssertCaps()` | still über rund 170 neue Zeilenpaare |
| `gespraechAssert()` | „14 Namensschilder, vier oder fünf Antworten" |
| `szeneAssert()` | „17 Szenen, 9 Introblätter, 90 Fragen, 79 Knoten" (vorher: 4, 9, 12, 27) |
| `frameNo` | zwischen 151 und 155 in jedem Lauf |

**Die sechs neuen Prüfungen sind einzeln ausgelöst worden**, jede mit einer Verletzung, die
danach zurückgenommen wurde. Wortlaut aus der Konsole:

```
Figur zwirn hat einen Zusatzblock mit 2 Schaltern statt genau einem
Figur zapf nennt eine Stufe, die niemand erreicht: 99
Figur zapf hat ein ab ohne skill
Figur pommer wartet auf einen Anlass, den nichts auslöst: unsinn
Abkürzung ohne Eintrag in ABKUERZUNGEN: XYZ in Frag beim XYZ nach.
Abkürzung ohne Auflösestelle: PRB verweist auf niemand
```

Danach Konsole wieder still. Eine Prüfung, die noch nie etwas gemeldet hat, ist nicht
geprüft, sondern nur vorhanden.

**Funktionslauf über alle zehn Schaltertypen**, jeder einmal geschlossen und einmal offen,
und ein Block ohne Schalter bleibt geschlossen:

```
abSchicht:5: zu=0 offen=1     zauber funke: zu=0 offen=1
abStufe:8:  zu=0 offen=1      zweig 1:      zu=0 offen=1
abRang:4:   zu=0 offen=1      phase feierabend/antritt: zu=0 offen=1
skill int 5: zu=0 offen=1     merker/abAkt: zu=0 offen=1
ohne Schalter: 0
```

**Zwei Bäume vollständig durchgeklickt.** Bei Nieselbeck: vier Antworten vor Schicht 3,
fünf danach, drei Fragen plus Ausgang am Hub, Nachfragen erscheinen gestaffelt, der Ausgang
schaltet nach der tiefsten Frage um, die Wahl setzt den Merker, der Abschied schließt
sauber. Bei der Bank zusätzlich: der Sprecher wechselt bei der richtigen Frage auf Pahl und
bleibt bis zum Ende, ein zweiter Besuch findet alle Fragen wieder vor und beginnt wieder
bei Lott. Alle dreizehn Bäume lassen sich öffnen, keiner wirft.

---

## Was offen bleibt

* Die vier weiteren Kürzel der Tabelle (`GA` teilweise, `ZB`, `T.`, `V. u. g.`) stehen im
  Code und gehen in den Bäumen von Milb, Zapf und Bramsche auf. `MfM` und `n. O.` lösen
  sich bei Bramsche auf. Die Eskalationsstufen IV und V des Gags stehen inhaltlich, aber
  Stufe V hängt an Akt V und damit an Szenen, die es noch nicht gibt.
* Knöterich hat eine Hintergrundgeschichte und keine neue Zeile. Das ist Absicht: er
  erklärt Tasten, nie Zusammenhänge.
* Sturz, Fürst Nachtrag und Anlage 3 haben Abschnitte und keine Zeilen. Sie sind das Maß
  für das, was andere über sie sagen.
