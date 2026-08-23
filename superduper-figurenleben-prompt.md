# Bauabschnitt F1: Figurenleben — OFFEN

Der Prompt für die Hintergrundgeschichten aller Figuren und für die Dialoge, die daraus
entstehen. Er ist so geschrieben, dass eine frische Sitzung ihn allein ausführen kann:
alles, was sie wissen muss, steht hier oder ist von hier aus mit einer Zeilenangabe
auffindbar.

**Ziel in drei Sätzen.** Jede ansprechbare Figur bekommt eine Hintergrundgeschichte, die
fundiert ist (jede Tatsache belegt oder widerspruchsfrei anschlussfähig), spannend (sie
hält etwas zurück, das später fällt) und komisch im Ton dieses Hauses. Aus dieser
Geschichte werden Dialogzeilen abgeleitet, die im Gesprächsfenster erscheinen: manche
ohne Bedingung, andere nach Dienstzeit, nach einem Ereignis, nach der Stufe des Spielers
oder nach seiner Skillung. Am Ende soll das Dorf nicht mehr aus vierzehn Sprechautomaten
bestehen, sondern aus vierzehn Leuten, die etwas mitbekommen.

**Das Spiel bekommt dabei kein neues System.** Alles unten hängt an den Feldern, die
`DORF_FIGUREN` schon hat. Was dazukommt, sind Schalter an einem bestehenden Block und
Zeilen in einer bestehenden Tabelle.

---

## 0. Wie dieser Prompt benutzt wird

Er läuft in vier Lieferungen, jede für sich abnehmbar und jede ein eigener Commit:

| Lieferung | Inhalt | Datei |
|---|---|---|
| **F1a** | Hintergrundgeschichten, alle Figuren, kein Code | `figuren-leben.md` |
| **F1b** | Die neuen Auslöser im Code, ohne eine einzige neue Zeile Text | `index.html` |
| **F1c** | Die Dialogzeilen, gegengezählt, figurenweise | `figuren-leben.md`, `index.html` |
| **F1d** | Phasendokument, README-Zeile, Weltbibel-Zuwachs | `phase-f1-figurenleben.md`, `README.md`, `superduper-weltbibel.md` |

**F1a vor F1c, ohne Ausnahme.** Wer die Zeilen vor der Geschichte schreibt, bekommt
Sprüche statt Figuren. Der Zweck der Reihenfolge ist, dass jede Zeile in F1c auf einen
Absatz in F1a zeigen kann. Kann sie das nicht, ist sie gestrichen.

**F1b vor F1c**, weil ein Auslöser, den es noch nicht gibt, sich beim Schreiben beliebig
biegen lässt und beim Einbauen dann nicht passt.

---

## 1. Quellenlage und Rangfolge

Bei Widerspruch gewinnt die höhere Zeile:

1. `superduper-weltbibel.md` — die Autorität. Kapitel 8 (Ensemble), 9 (fünf Akte),
   13 (Humor-Grundgesetz und Formregeln), 19 (Prüfliste), 7 (Zutaten-Fiktion, daher der
   Sperrvermerk), 17 (Titel, Rang, Laufbahn).
2. `weltgeschichte.md` — der Erzählstoff: Chronik, Reich, Adel, Szenen. Zuwachs zur
   Weltbibel, nicht Ersatz.
3. `figuren-dorf.md` — die vorhandenen Figurentexte, Serie 1 (elf) und Serie 2 (drei),
   samt Zeichennachweis. **Keine ihrer Zeilen wird angefasst.**
4. Die Phasendokumente `phase-w3`, `phase-w11`, `phase-w-noergel`, `phase-sz2`,
   `phase-u3`, `phase-u4`, `phase-anrede` — sie erklären, warum etwas so gebaut ist.
5. `index.html` — der Bestand. Er ist Wahrheit über die Mechanik und niemals Autorität
   über die Welt.

**Fundiert heißt:** jede Tatsache in einer Hintergrundgeschichte steht entweder schon in
einer dieser Quellen (dann mit Fundstelle belegen) oder sie ist neu und passt
widerspruchsfrei dazwischen (dann als **neu** markieren und begründen, warum sie keiner
bestehenden Zeile widerspricht). Erfundene Jahreszahlen, Orte und Ämter brauchen einen
Abgleich mit der Chronik in `weltgeschichte.md`, Kapitel 3. Eine Figur darf nichts
wissen, was sie nicht wissen kann.

---

## 2. Der Bestand, den es zu erweitern gilt

Vierzehn ansprechbare Dorffiguren in `DORF_FIGUREN` (`index.html`, ab Zeile 3171), dazu
Knöterich als Begleitfigur mit eigenem Kanal. Jede Dorffigur hat heute:

* `grund` — sechs Zeilenpaare, Kreislauf bei wiederholtem Ansprechen
* `akt` — fünf Einzeiler, einer je Akt, gewählt über `aktStand()`
* `zusatz` — ein bis zwei Blöcke à zwei Zeilenpaare, geschaltet über `abAkt` oder `merker`
* `anlass` — nur Lott und Pahl: Pools zu neun Ereignisschlüsseln
* `antworten` / `abweisung` — nur Bramsche: fünfzehn Fragen, eine pro Schicht
* dazu die Anredezeile aus `anredeZeile()` und, wo vorhanden, Langvorgangs-Zeilen

Der Weg durch den Zyklus steht in `npcCycle()` (ab Zeile 8534): Schritt 0 ist die Anrede,
dann die Grundzeilen samt freigeschalteter Zusatzzeilen, zuletzt die Aktzeile. Das
Gesprächsfenster (U3/U4) zeigt oben den Satz und unten vier Antworten; die erste ruft
`npcSprechen()` auf, die drei anderen lesen nur.

**Die vierzehn Figuren und ihre Schlüssel:** `zwirn`, `bramsche`, `zapf`, `lisbeth`,
`trepp`, `noergel`, `milb`, `pommer`, `fass`, `lott`, `pahl`, `nieselbeck` (ab Akt I),
`umlauf` (ab Akt II), `vorblatt` (ab Akt III). Dazu **Knöterich** (eigener Kanal,
Sonderregeln unten) und die drei nicht ansprechbaren: **Dr. Wilhelmine Sturz**,
**Fürst Nachtrag**, der Kater **Anlage 3**. **Konrad zu Händen Aufschub** steht nur in
Hochablage und bleibt dort.

---

## 3. Das geltende Recht

Vor der ersten Zeile lesen und danach gegen jede Zeile halten:

* **Humor-Grundgesetz**, elf Regeln, `superduper-weltbibel.md` Kapitel 13.
* **Sieben Regeln für alles, was im Reich spielt**, ebenda, aus `weltgeschichte.md`
  Kapitel 12. Darunter die harte: **über den Kaiser wird ausschließlich im Präsens
  gesprochen.** `knAssertCaps()` prüft das bei jedem Start.
* **Sperrvermerk (Kapitel 7).** Keine Figur erklärt oder deutet an, wie die Beglaubigung
  im Kessel rechnet: Substantiv gleich Slot, Adjektiv gleich Wirkung, Seltenheit gleich
  Alter des Aktenzeichens, drei Zutaten gleich dreifache Ausfertigung, Fluch gleich
  Bewilligung plus Auflage im selben Bescheid, zwei harte Flüche gleich
  Verhältnismäßigkeit. Über Akten, Krieg, Amt, die eigene Lage und den Vorgang 1 darf
  jede Figur reden. Über die Zutaten-Mechanik niemand. **Achtung auf das Wort „Alter"**,
  es ist an dieser Stelle gesperrt und hat schon einmal eine fertige Zeile gekostet
  (siehe Bramsches Rangantwort in `figuren-dorf.md`).
* **Formregeln.** Keine Gedankenstriche in Spieltexten. Keine Emojis in Figurentexten.
  Kurze Sätze, zwei sind genug, drei sind zu viel. Höchstens eine Taste pro Hinweis.
* **Zeichendeckel, gegengezählt und nicht geschätzt:** `z1` höchstens 48 Zeichen,
  `z2` höchstens 32, Aktzeile (Einzeiler) höchstens 44, Namensschild höchstens 24
  (`SCHILD_DECKEL`), Antwortzeile im Gesprächsfenster höchstens 28 (`ANTWORT_DECKEL`).
* **Prüfliste Kapitel 19**, sieben Fragen, für jede Zeile einzeln.
* **Monster haben keine Titel** (Kapitel 18.10). Genau eine Ausnahme, und die trägt das
  Finale: Fürst Nachtrag. Keine Hintergrundgeschichte gibt einem Monster einen Rang.

---

## 4. Was LucasArts-Humor in diesem Haus heißt

Der Auftrag sagt „LucasArts-Humor", und das ist eine Handwerksanweisung und keine
Einladung zur Anspielung. **Regel 7 des Grundgesetzes bleibt in Kraft: keine Meta-Witze,
keine Popkultur, keine Zitate.** Niemand sagt einen Satz, der aus einem anderen Spiel
stammt. Was übernommen wird, sind die Handgriffe:

1. **Der Gerade und der Trockene.** Eine Figur sagt eine Auskunft, der Spieler fragt
   „wie bitte", und erst dadurch wird aus der Auskunft ein Gag (Grundgesetz 11). Bei
   jeder Figur mindestens eine Zeile, die eine Rückfrage geradezu verlangt.
2. **Die Dreierregel mit Kippsatz.** Zwei Zeilen bauen dieselbe Erwartung, die dritte
   kippt sie. In dieser Maschine steht die dritte oft hinter einem Auslöser, fällt also
   Schichten später. Das ist der beste Witz, den diese Bauart erlaubt.
3. **Der Rückruf.** Eine späte Zeile zahlt eine frühe aus. Bedingung: die frühe Zeile ist
   ohne die späte vollständig, sonst hat der Spieler zwischendurch nichts.
4. **Die konsequent zu Ende befolgte Regel.** Absurdes wird nicht kommentiert, es wird
   befolgt. Wenn Wolken eine Veranlassung brauchen, dann warten sie eben auf sie.
5. **Die höfliche Katastrophe.** Niemand ist böse, alle sind zuvorkommend, und genau das
   ist der Schrecken. Das Reich ist nicht drohend, es ist erleichtert.
6. **Untertreibung schlägt Zuspitzung.** „Das war der Brandabschnitt." ist der ganze Satz.
   Wer erklärt, hat verloren.
7. **Der volle Einsatz für die falsche Sache.** Niemand ist faul, jeder ist gründlich.
   Nicht über Menschen lachen, immer über Zuständigkeit.
8. **Wärme unten drunter.** Jede Figur versucht etwas, und am Ende gelingt es. Ohne diese
   Regel ist alles hier nur ein sehr langer Behördenwitz.

**Fünf Verbote, die den Ton kaputtmachen:** Sarkasmus gegen eine Person. Zynismus über
das Amt selbst. Eine Figur, die merkt, dass sie komisch ist. Ein Wortspiel, das nur auf
Deutsch der Gegenwart funktioniert. Und Blut, Sterben, Ketten, Grausamkeit in jeder Form.

---

## 5. Teil A: Die Hintergrundgeschichte

Je Figur ein Abschnitt in `figuren-leben.md`, **500 bis 800 Wörter**, mit dieser festen
Gliederung. Die ersten drei Felder stehen für die meisten Figuren schon in Weltbibel
Kapitel 8 und werden **übernommen, nicht neu erfunden**:

| Feld | Was hineingehört |
|---|---|
| **Besessenheit** | Was die Figur will, in einem Satz. Bestand, wo vorhanden. |
| **Hindernis** | Warum sie es nicht bekommt. Immer ein Verfahren, nie ein Charakterfehler. |
| **Sprachmarke** | Zwei bis drei Wendungen, an denen man sie blind erkennt. |
| **Herkunft** | Woher sie kommt, seit wann sie hier ist, was sie vorher tat. Mit Jahreszahl, abgeglichen gegen die Chronik. |
| **Der Riss** | Das eine Ereignis, das sie zu dem gemacht hat, was sie heute ist. |
| **Das Geheimnis** | Was sie weiß und nicht sagt. Jede Figur hat genau eins. Es darf niemals Kesselgrammatik sein. |
| **Der blinde Fleck** | Was sie über sich selbst falsch weiß. Hier sitzt die Wärme. |
| **Drei Verhältnisse** | Zu drei namentlich genannten anderen Figuren, je ein Satz. Sie müssen zusammenpassen: wenn A über B etwas sagt, muss B es aushalten. |
| **Was sie nie sagen wird** | Ausdrückliche Sperrliste je Figur, mindestens zwei Punkte. |
| **Die eine neue Tatsache** | Genau eine harte Tatsache, die es vorher nicht gab und die ab jetzt gilt. Sie wandert nach F1d als Absatz *(Zuwachs F1)* in Weltbibel Kapitel 8. |
| **Belege** | Liste der Fundstellen, Datei und Kapitel oder Zeile. Neue Tatsachen als **neu** markiert. |

**Kontingent:** genau eine neue harte Tatsache je Figur. Nicht zwei. Wer mehr braucht,
hat die Figur nicht verstanden, sondern nachgelegt.

**Vier Sonderfälle:**

* **Knöterich.** Sein Geheimnis steht schon fest und ist das größte des Spiels: er hat
  den Vorgang 1 vollständig gelesen und darf nichts sagen. Seine Hintergrundgeschichte
  wird geschrieben, **seine Zeilen aber nicht angetastet**: er erklärt Tasten, nie
  Zusammenhänge. Was in F1c für ihn entsteht, sind höchstens Randnotizen im bestehenden
  `RANDNOTIZ`-Format, keine Auskünfte.
* **Lott und Pahl** teilen sich einen Abschnitt und ein Porträt. Ihre Geschichte ist eine
  Geschichte, erzählt aus zwei Sesseln derselben Bank. Ob sie Vorgänge sind, bleibt offen
  (Weltbibel Kapitel 16) und wird auch von F1 nicht entschieden.
* **Anlage 3** bekommt einen halben Abschnitt und keine Zeile. Er ist ein Kater. Auf
  Reichspapier gelesen ist er der dritte Sohn eines Adelshauses, und das bleibt ein
  stiller Gag.
* **Sturz und Nachtrag** bekommen ihre Abschnitte, weil das halbe Dorf über sie spricht,
  aber keine eigenen Dialogzeilen. Was über sie gesagt wird, sagen andere.

---

## 6. Teil B: Die Dialoge

**Ableitungsregel, die alles trägt:** jede neue Zeile zeigt auf genau ein Feld der
Hintergrundgeschichte. Im Lieferdokument steht das als Klammer hinter der Zeile, etwa
*(Riss)* oder *(blinder Fleck)*. Eine Zeile ohne Feld ist ein Spruch und wird gestrichen.

**Kontingent je ansprechbarer Dorffigur, zwölf neue Zeilenpaare:**

| Anzahl | Auslöserklasse | Bemerkung |
|---|---|---|
| 2 | Dienstzeit (`abSchicht`) | Die Figur bemerkt, dass der Spieler noch da ist. |
| 2 | Stufe (`abStufe`) | Sie bemerkt, dass er anders aussieht als am ersten Tag. |
| 2 | Skillung (`skill` oder `zauber`) | Sie bemerkt, **wie** er arbeitet. Zwei Fassungen: eine für Kraft, eine für Kopf. |
| 2 | Rang (`abRang`) | Sie bemerkt, wie er angeredet wird. Muss zu `phase-anrede.md` passen. |
| 2 | Schichtphase (`phase`) | Antritt oder Feierabend. Hier liegt die Wärme. |
| 2 | Merker oder Akt | Der Rückruf auf ein Ereignis, das der Spieler ausgelöst hat. |

Dazu **Ereigniszeilen** (`anlass`): bisher haben nur Lott und Pahl welche. Neu bekommt
**jede Figur mindestens drei Ereignisschlüssel** mit je zwei Zeilen, ausgewählt danach,
was zu ihr passt. Milb begutachtet einen kritischen Treffer, Pommer rechnet den Goldfund
gegen die Materialausgabe, Zapf sieht nur den Schaden. Niemand kommentiert alles.

**Was ausdrücklich nicht wächst:** `grund` und `akt` bleiben, wie sie sind. Sechs
Grundzeilen und fünf Aktzeilen je Figur sind Bestand, und Bestand wird in diesem Projekt
nicht umgeschrieben, sondern ergänzt. Alles Neue kommt als `zusatz` oder `anlass` dazu.

**Bramsche** bekommt zusätzlich acht neue Fragen in ihrer Antworttabelle, alle aus den
Hintergrundgeschichten der anderen: sie ist der Hinweisgeber, und ab F1 lohnt es sich,
sie nach Leuten zu fragen statt nur nach Orten. Regel bleibt: Fundorte und Zusammenhänge,
niemals Mechanik.

**Der Zyklus darf wachsen und schrumpfen.** `npcCycle()` hält den Zeiger per Modulo im
Bereich; das ist geprüft und im Code kommentiert. Wer eine Bedingung baut, die wieder
falsch werden kann (Schichtphase), schreibt einen Satz darüber, was der Spieler dann
sieht: nämlich die nächste Zeile, und keinen Fehler.

---

## 7. Die Auslöser

**Bestand (nicht anfassen, nur benutzen):**

| Klasse | Feld | Bedingung im Code |
|---|---|---|
| ohne Bedingung | `grund` | immer, Kreislauf |
| Handlung | `zusatz:[{abAkt:N}]` | `!CONFIG.schichtModus \|\| aktStand() >= N` |
| Ereignis, dauerhaft | `zusatz:[{merker:'name'}]` | `kn.flags[name]`, siehe `kn.flags` (Zeile 7181) |
| Ereignis, einmalig | `anlass:{schluessel:[…]}` | `letzterAnlass`, wird beim Lesen verbraucht |

Vorhandene Merker: `hatGezaubert`, `hatGekocht`, `hatKammerBetreten`, `hatGesteigert`,
`hatLagerGesehen`, `szeneUmlauf`, `szeneSchublade`, `szeneKnoeterich`.
Vorhandene Anlässe (`RANDNOTIZ`, Zeile 7272): `crit`, `ultimate`, `levelup`,
`kammerAbbruch`, `fluch`, `goldfund`, `untaetigkeit`, dazu `umlauf` und `hintermuehl`
aus SZ2.

**Neu in F1b, vier Schalter derselben Bauart:**

| Klasse | Feld | Bedingung | Zustandsquelle |
|---|---|---|---|
| Zeit, Dienstalter | `zusatz:[{abSchicht:N}]` | `!CONFIG.schichtModus \|\| amt.schichten >= N` | `amt.schichten` |
| Zeit, Schichtphase | `zusatz:[{phase:'antritt'\|'feierabend'}]` | `shiftT > 0.75 * CONFIG.schichtDauer` bzw. `shiftT < 0.25 * CONFIG.schichtDauer`, im freien Spiel beide offen | `shiftT` |
| Stufe | `zusatz:[{abStufe:N}]` | `player.level >= N` | `player.level` |
| Rang | `zusatz:[{abRang:N}]` | `!CONFIG.schichtModus \|\| rangStufe() >= N` | `rangStufe()` (Zeile 11858) |
| Skillung, Punkte | `zusatz:[{skill:'str'\|'vit'\|'agi'\|'int', ab:N}]` | `player.skills[skill] >= N` | `player.skills` |
| Skillung, Zauber | `zusatz:[{zauber:'funke'}]` oder `{zweig:0\|1\|2}` | `player.spellsKnown[id]` bzw. `kenntZweig(b)` (Zeile 7862) | Zauberbaum |

**Sechs Regeln für die Auslöser, alle prüfbar:**

1. **Genau ein Schalter je Block.** Das gilt heute schon (`knAssertCaps()` meldet
   „Zusatzblock ohne genau einen Schalter") und wird in F1b von zwei auf die volle Liste
   erweitert. `skill` trägt `ab` als Beiwert, nicht als zweiten Schalter.
2. **Kein Auslöser darf unerreichbar sein.** Ein `abStufe` über der erreichbaren
   Höchststufe, ein `abSchicht` über fünfzig, ein Merker, den niemand setzt, ein
   `anlass`-Schlüssel, den nichts auslöst: alles drei meldet der Guard.
3. **Im freien Spiel ohne Schichten ist alles offen**, was an Schichten, Akten oder Rang
   hängt. Das ist die Regel von `serieFrei()` und `figDa()`, und sie gilt weiter.
4. **Auslöser staffeln, nicht stapeln.** Über alle Figuren hinweg soll in jeder Schicht
   irgendwo etwas Neues fallen. Eine Tabelle im Lieferdokument zeigt, welcher Auslöser bei
   welcher Figur wann greift; wo drei Figuren dieselbe Schwelle tragen, wird gespreizt.
5. **Ereigniszeilen sind Kommentar, nie Auskunft.** Wer gerade kritisch getroffen hat,
   bekommt keine Geschichte erzählt, sondern einen Satz.
6. **Keine Zeile hängt an zwei Bedingungen.** Wer das braucht, hat einen Langvorgang
   gebaut, und Langvorgänge sind in Kapitel 10 abschließend aufgezählt.

---

## 8. Der Code, den F1 kostet

Klein halten, das ist Bedingung. Erwartet werden genau diese Eingriffe:

* **`figZusatz()`** (Zeile 8519): aus zwei Zweigen werden acht. Eine Tabelle von
  Schaltername zu Prüffunktion, damit die Funktion kurz bleibt und `knAssertCaps()`
  dieselbe Tabelle lesen kann. Kein zweiter Ort, an dem die Namen stehen.
* **`knAssertCaps()`** (Zeile 7298): Deckel über alle neuen Zeilen, „genau ein Schalter"
  über die volle Schalterliste, Erreichbarkeit jeder Schwelle, und die Prüfung, dass jeder
  benutzte `anlass`-Schlüssel irgendwo gesetzt wird.
* **Neue Anlass-Schlüssel** brauchen eine Setzstelle (`letzterAnlass = '…'`) an der
  Stelle, wo das Ereignis passiert, und einen Eintrag in einer neuen Liste
  `ANLASS_QUELLEN`, gegen die der Guard prüft. Vorschlag, sparsam: `erstzustellung`,
  `rangaufstieg`, `dienstunfaehig`, `kesselErst`. Mehr nur mit Begründung.
* **Die fünfte Antwortzeile.** `gespraechOptionen()` liefert heute vier feste Antworten,
  `gespraechAssert()` verlangt genau vier. Neu: hat die Figur freigeschaltete
  Hintergrundzeilen, erscheint als vorletzte Antwort **„Erzählen Sie von früher."** (24
  Zeichen, Deckel 28), und der Abschied bleibt die letzte. Der Guard prüft dann vier oder
  fünf Antworten und dass die letzte immer der Abschied ist. **Begründung:** ohne diesen
  Kanal findet der Spieler die Hintergrundzeilen nur durch Zufall im Kreislauf, und
  Grundgesetz 11 verlangt, dass er fragen kann. Wer diesen Punkt streichen will, muss
  vorher zeigen, wie die Geschichte sonst absichtlich erreichbar wird.
* **Kein neues Speicherfeld**, wo eine Ableitung reicht. Stufe, Rang, Schicht und Skillung
  stehen bereits im Spielstand; sie werden gelesen und nicht gespiegelt. Das ist die
  W5/W6-Doktrin: zwei Felder für denselben Zustand sind zwei Wahrheiten, und die zweite
  driftet.

---

## 9. Ausgabeformat

**`figuren-leben.md`** wird gebaut wie `figuren-dorf.md`, weil das Format sich bewährt
hat: Kopf mit Auftrag, Entstehung und Sperrvermerk, dann je Figur ein Abschnitt, dann ein
Zeichennachweis am Ende. Zeilen stehen mit gegengezählter Länge in Klammern:

```
### Zusatzzeilen (F1), ab Stufe 8

* „Sie sind schwerer geworden.“ (27) / „Die Dielen sagen es mir.“ (24)   (blinder Fleck)
* „Ich habe nachgeölt. Vorsorglich.“ (32) / „Man weiß ja nie.“ (16)      (Besessenheit)
```

Und je Figur ein Codeblock, der wörtlich in `DORF_FIGUREN` passt:

```js
zusatz:[
  {abStufe:8, zeilen:[
    {z1:'Sie sind schwerer geworden.', z2:'Die Dielen sagen es mir.'},
    {z1:'Ich habe nachgeölt. Vorsorglich.', z2:'Man weiß ja nie.'},
  ]},
]
```

Die Zahlen in Klammern sind **gezählt, nicht geschätzt**. Wer schätzt, produziert den
Fehler, den `knAssertCaps()` beim nächsten Start meldet, und verliert die Runde damit
zweimal.

---

## 10. Selbstprüfung, drei Durchgänge

Dasselbe Verfahren, das die elf Figuren der Serie 1 sauber gemacht hat, und es hat
damals zwei Funde gehabt:

1. **Entwurf** je Figur, aus der Hintergrundgeschichte heraus.
2. **Zweiter Durchgang, unabhängig:** gegen Sperrvermerk, Humor-Grundgesetz, Formregeln,
   Zeichendeckel, Kaiser-Präsens. Repariert wird hier, nicht später.
3. **Dritter Durchgang, wieder unabhängig, nur eine Frage:** leckt irgendeine Zeile
   Kesselgrammatik? Das ist der Durchgang, der bei Serie 1 zwei fertige Formulierungen
   gekippt hat.

Am Ende steht je Figur eine **Prüfnotiz** im Lieferdokument, auch wenn sie „kein Fund"
lautet.

---

## 11. Abnahme und Prüfprotokoll

Nichts gilt als fertig, was nur behauptet ist. Die dritte Mitarbeitsregel des Repos meint
das wörtlich.

```bash
python3 -c "import re;h=open('index.html').read();m=re.search(r'<script>(.*)</script>',h,re.DOTALL);open('/tmp/c.js','w').write(m.group(1))" && node --check /tmp/c.js
```

Danach im Browser, mit `python3 serve.py` und dem Playwright-Chromium der Umgebung, wie im
README beschrieben. **Auf `frameNo > 0` warten, nicht auf `assetsReady`.**

Abgenommen ist F1, wenn:

* die Konsole **still** ist, alle Guards ihre Zeile „in Ordnung" melden und keiner
  zusätzlich etwas sagt,
* `knAssertCaps()` die neuen Zeilen, Schalter und Schwellen mitprüft und dabei schweigt,
* `gespraechAssert()` die vier oder fünf Antworten bestätigt,
* eine Figur mit jedem neuen Schaltertyp im laufenden Spiel nachweislich ihre Zeile sagt
  (Messlauf unter `tools/`, Vorbild `tools/spaziergang-messlauf.mjs`), und die Messung im
  Phasendokument steht,
* `node tools/build-single.mjs` durchläuft und die entstandene `dist/index.html` per
  `file://` dasselbe zeigt.

Eine Warnung, die immer da steht, ist keine. Wer eine Meldung sieht, die „schon immer" da
war, hat einen Fund und keine Tapete.

---

## 12. Was ausdrücklich nicht passiert

* Keine bestehende Zeile aus `figuren-dorf.md` wird geändert. F1 ist Zuwachs.
* Keine Kesselgrammatik, in keiner Andeutung, von keiner Figur.
* Kein Monster bekommt einen Titel. Ausnahme bleibt Fürst Nachtrag.
* Der Kaiser wird nirgends in der Vergangenheit erwähnt.
* Keine Popkultur, keine Anspielung auf das Jahr der Entstehung, kein Meta-Witz.
* Kein Blut, kein Sterben, kein Zynismus. Konfetti und Feierabend.
* Knöterich erklärt weiterhin Tasten und keine Zusammenhänge.
* Kein achter Langvorgang, kein neues System, kein neues Speicherfeld für ableitbaren
  Zustand.
* Kein Statusmarker bleibt stehen: jede Überschrift trägt `— ERLEDIGT` oder `— OFFEN`,
  nachgezogen im selben Commit.

---

## 13. Der Kurzprompt zum Kopieren

Für eine frische Sitzung, wenn das lange Dokument nicht in den Kontext soll:

> Lies `superduper-weltbibel.md` (Kapitel 7, 8, 9, 13, 17, 19), `weltgeschichte.md`
> (Kapitel 3, 6, 12), `figuren-dorf.md` und in `index.html` den Block `DORF_FIGUREN` samt
> `npcCycle()`, `npcSprechen()`, `figZusatz()`, `knAssertCaps()` und `gespraechOptionen()`.
> Arbeite dann `superduper-figurenleben-prompt.md` ab, Lieferung F1a bis F1d in dieser
> Reihenfolge, je ein Commit.
>
> F1a: schreib für jede der vierzehn Dorffiguren, für Knöterich, Sturz, Nachtrag und
> Anlage 3 eine Hintergrundgeschichte von 500 bis 800 Wörtern nach der Gliederung in
> Abschnitt 5 (Besessenheit, Hindernis, Sprachmarke, Herkunft, Riss, Geheimnis, blinder
> Fleck, drei Verhältnisse, was sie nie sagt, die eine neue Tatsache, Belege). Fundiert
> heißt: jede Tatsache belegt oder als neu markiert und gegen die Chronik abgeglichen.
> Humor nach Abschnitt 4: der Gerade und der Trockene, Dreierregel mit Kippsatz, Rückruf,
> die konsequent befolgte Regel, die höfliche Katastrophe, Untertreibung, voller Einsatz
> für die falsche Sache, Wärme unten drunter. Keine Anspielungen.
>
> F1b: bau die vier neuen Schaltertypen für `zusatz` ein (`abSchicht`, `phase`, `abStufe`,
> `abRang`, `skill`+`ab`, `zauber`/`zweig`), genau einer je Block, alles aus vorhandenem
> Zustand abgeleitet, `knAssertCaps()` erweitert, keine neue Textzeile.
>
> F1c: leite je Figur zwölf neue Zeilenpaare plus Ereigniszeilen aus der
> Hintergrundgeschichte ab, jede Zeile mit Verweis auf ihr Feld, Zeichen gegengezählt,
> Deckel 48/32/44/28. Drei Prüfdurchgänge wie in Abschnitt 10.
>
> F1d: Phasendokument, README-Zeile, Weltbibel-Zuwachs, Statusmarker.
>
> Abnahme wie in Abschnitt 11: `node --check`, Browser mit stiller Konsole, ein Messlauf
> je neuem Schaltertyp. Nichts gilt als fertig, was nur behauptet ist.
