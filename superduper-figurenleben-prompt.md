# Bauabschnitt F1: Figurenleben — OFFEN

Der Prompt für die Hintergrundgeschichten aller Figuren, für die Dialoge, die daraus
entstehen, und für die Gesprächsbäume, in denen sich der Spieler verlaufen darf. Er ist so
geschrieben, dass eine frische Sitzung ihn allein ausführen kann: alles, was sie wissen
muss, steht hier oder ist von hier aus mit einer Zeilenangabe auffindbar.

**Ziel in vier Sätzen.** Jede ansprechbare Figur bekommt eine Hintergrundgeschichte, die
fundiert ist (jede Tatsache belegt oder widerspruchsfrei anschlussfähig), spannend (sie
hält etwas zurück, das später fällt) und komisch im Ton dieses Hauses. Aus dieser
Geschichte werden Dialogzeilen abgeleitet, die im Gesprächsfenster erscheinen: manche
ohne Bedingung, andere nach Dienstzeit, nach einem Ereignis, nach der Stufe des Spielers
oder nach seiner Skillung. Wer weiterfragt, landet nicht in einer Zeilenschleife, sondern
in einem Gesprächsbaum mit Verzweigungen, Wahlmöglichkeiten und Sackgassen. Quer durch
alles läuft ein Gag über Abkürzungen, der über fünf Akte steigt statt sich zu wiederholen.
Am Ende soll das Dorf nicht mehr aus vierzehn Sprechautomaten bestehen, sondern aus
vierzehn Leuten, die etwas mitbekommen und mit denen sich ein Gespräch führen lässt.

**Das Spiel bekommt dabei kein neues System.** Die Zeilen hängen an den Feldern, die
`DORF_FIGUREN` schon hat. Die Bäume laufen auf der Szenenmaschine, die SZ1 und SZ2 gebaut
haben. Was dazukommt, sind Schalter an bestehenden Blöcken und Einträge in bestehenden
Tabellen.

---

## 0. Wie dieser Prompt benutzt wird

Er läuft in fünf Lieferungen, jede für sich abnehmbar und jede ein eigener Commit:

| Lieferung | Inhalt | Datei |
|---|---|---|
| **F1a** | Hintergrundgeschichten, alle Figuren, dazu die Abkürzungstabelle. Kein Code | `figuren-leben.md` |
| **F1b** | Die neuen Auslöser im Code plus `ABKUERZUNGEN` und ihr Guard, ohne eine einzige neue Zeile Text | `index.html` |
| **F1c** | Die Dialogzeilen, gegengezählt, figurenweise | `figuren-leben.md`, `index.html` |
| **F1d** | Die Gesprächsbäume, Inhalt und Einbau | `figuren-baeume.md`, `index.html` |
| **F1e** | Phasendokument, README-Zeile, Weltbibel-Zuwachs | `phase-f1-figurenleben.md`, `README.md`, `superduper-weltbibel.md` |

**F1a vor allem anderen, ohne Ausnahme.** Wer die Zeilen vor der Geschichte schreibt,
bekommt Sprüche statt Figuren. Der Zweck der Reihenfolge ist, dass jede Zeile und jeder
Knoten auf einen Absatz in F1a zeigen kann. Kann er das nicht, ist er gestrichen.

**F1b vor F1c**, weil ein Auslöser, den es noch nicht gibt, sich beim Schreiben beliebig
biegen lässt und beim Einbauen dann nicht passt.

**F1d zuletzt vor der Doku**, weil ein Baum die Hintergrundgeschichte voraussetzt und die
Auslöser mitbenutzt.

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
4. Die Phasendokumente `phase-w3`, `phase-w11`, `phase-w-noergel`, `phase-sz1`,
   `phase-sz2`, `phase-u3`, `phase-u4`, `phase-e1`, `phase-anrede` — sie erklären, warum
   etwas so gebaut ist. Datierte Dokumente werden nicht rückwirkend umgeschrieben; wo
   eines der Weltbibel widerspricht, gilt die Weltbibel.
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

* **Humor-Grundgesetz**, elf Regeln, `superduper-weltbibel.md` Kapitel 13. **Zwei davon sind
  am 23.08.2026 geändert worden**, beide vom Verbot zur Dosis: Regel 7 (Popkultur) und
  Regel 1 (die Welt findet sich selbst normal). Beide neuen Fassungen stehen ausgeschrieben
  in Abschnitt 4 unten. Die anderen neun stehen unverändert, und **Regel 4 (nie über
  Menschen lachen), Regel 8 (kein Zynismus) und Regel 9 (Wärme) hängen an Regel 1**: was
  dort erlaubt ist, ist es nur, solange diese drei unangetastet bleiben.
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

Der Auftrag sagt „LucasArts-Humor", und das ist zuerst eine Handwerksanweisung. Acht
Handgriffe:

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

### Popkultur und Zitate: erlaubt, dosiert

Die alte Regel 7 („keine Meta-Witze, keine Popkultur, keine Anspielungen") ist am
23.08.2026 gestrichen und ersetzt worden, die neue Fassung steht in der Weltbibel. Für F1
heißt sie ausgeschrieben:

* **Erlaubt sind Anspielungen und Zitate, die jeder kennt.** Die Schwelle ist nicht
  „Kenner erkennen es", sondern „eine Zehnjährige und eine Neunundneunzigjährige haben es
  beide schon einmal gehört". Alles Speziellere ist ein Zwinkern unter Eingeweihten und
  bleibt draußen.
* **Die Zeile muss ohne die Anspielung vollständig sein.** Wer sie nicht erkennt, darf
  nichts vermissen und merkt nicht, dass ihm etwas entgeht. Wer sie erkennt, bekommt einen
  zweiten Boden. Das ist dieselbe Bauart wie Grundgesetz 6, nur eine Etage höher.
* **Dosis, verbindlich für F1:** **höchstens fünf Anspielungen über die gesamte
  Lieferung**, höchstens eine je Figur, und in keinem Gesprächsbaum mehr als eine. Sie
  werden im Lieferdokument einzeln aufgeführt, mit Figur und Fundstelle, damit die Zahl
  nachzählbar ist und nicht geschätzt.
* **Die Welt erkennt sie nicht als Zitat.** Regel 1 gilt unverändert: niemand zwinkert,
  niemand weiß, dass er komisch ist, keine Figur sagt einen Satz „in Anführungszeichen".
  Eine Anspielung funktioniert hier nur, wenn sie im Amtsdeutsch dieser Welt aufgeht und
  eine Figur sie völlig ernst meint. **Meta-Witze bleiben verboten**, aber nicht mehr über
  Regel 7, sondern über Regel 1.
* **Kein Verfallsdatum.** Was in fünfzehn Jahren erklärt werden muss, wird heute nicht
  eingebaut. Keine Tagesnachricht, keine Mode, kein Name, der nächstes Jahr niemandem mehr
  etwas sagt.
* **Im Zweifel weglassen.** Eine Anspielung ist ein Bonus, nie die Pointe. Wo sie die
  Pointe trägt, ist die Zeile falsch gebaut, und zwar unabhängig von der Anspielung.

### Die vierte Wand: erlaubt, gezählt

Regel 1 lautete „niemand im Spiel weiß, dass er komisch ist" und ist am 23.08.2026
ebenfalls von einem Verbot zu einer Dosis geworden. Für F1 heißt das:

* **Eine Figur darf einmal herausschauen.** Sie darf den Spieler als das ansprechen, was
  er ist, sie darf trocken bemerken, dass an ihrer Lage etwas nicht stimmt, sie darf
  merken, dass sie zum vierten Mal dieselbe Frage beantwortet. Das ist der Witz, den eine
  Behörde von selbst hergibt: wer Formulare ausfüllt, ahnt irgendwann, dass er in einem
  Verfahren steckt und nicht in einem Leben.
* **Höchstens ein Zwinkern je Figur über das ganze Spiel**, nie zwei im selben Gespräch,
  und **nie zwei Figuren im selben Baum**. Wie bei den Anspielungen wird gezählt und im
  Lieferdokument aufgeführt. Der Richtwert für F1: **höchstens sechs im ganzen Ensemble**,
  also weniger als die Hälfte der Figuren bekommt eins.
* **Das Zwinkern gehört der Figur, nicht dem Spiel.** Es bleibt in ihrer Sprachmarke und
  in ihrem Amtsdeutsch. Kein Erzähler mischt sich ein, keine Figur nennt Tasten, Menüs,
  Spielstände oder Bildschirme, keine sagt „Spieler". Sie darf ahnen, dass sie beobachtet
  wird. Sie darf nicht wissen, womit.
* **Nie dort, wo es weh tut.** Nicht im warmen Moment (Regel 9), nicht in der Fanfare
  (Regel 10), nicht in einer Szene, die etwas trägt. Ein Zwinkern kostet dort mehr, als
  jeder Gag einbringt. Die stillen zwei Zeilen bei der Gießkanne bleiben still.
* **Die Welt als Ganzes bleibt normal.** Erlaubt ist die einzelne Figur, die kurz
  herausschaut. Nicht erlaubt ist ein Spiel, das sich insgesamt für einen Witz hält:
  Regel 4 und Regel 8 stehen unverändert, und ohne sie kippt das Ganze in Hohn.

**Fünf Verbote, die den Ton kaputtmachen:** Sarkasmus gegen eine Person. Zynismus über
das Amt selbst. Eine Anspielung, die nur als Anspielung funktioniert. Ein Zwinkern, das
über die Dosis hinausgeht oder aus dem Spiel statt aus der Figur kommt. Und Blut, Sterben,
Ketten, Grausamkeit in jeder Form.

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
| **Die eine neue Tatsache** | Genau eine harte Tatsache, die es vorher nicht gab und die ab jetzt gilt. Sie wandert nach F1e als Absatz *(Zuwachs F1)* in Weltbibel Kapitel 8. |
| **Der Gesprächsstoff** | Drei bis fünf Themen, über die diese Figur reden kann, ohne ihr Geheimnis zu verraten. Das ist die Vorlage für ihren Baum in F1d. |
| **Belege** | Liste der Fundstellen, Datei und Kapitel oder Zeile. Neue Tatsachen als **neu** markiert. |

**Kontingent:** genau eine neue harte Tatsache je Figur. Nicht zwei. Wer mehr braucht,
hat die Figur nicht verstanden, sondern nachgelegt.

**Vier Sonderfälle:**

* **Knöterich.** Sein Geheimnis steht schon fest und ist das größte des Spiels: er hat
  den Vorgang 1 vollständig gelesen und darf nichts sagen. Seine Hintergrundgeschichte
  wird geschrieben, **seine Zeilen aber nicht angetastet**: er erklärt Tasten, nie
  Zusammenhänge. Er bekommt in F1d auch keinen Baum. Was für ihn entsteht, sind höchstens
  Randnotizen im bestehenden `RANDNOTIZ`-Format.
* **Lott und Pahl** teilen sich einen Abschnitt und ein Porträt. Ihre Geschichte ist eine
  Geschichte, erzählt aus zwei Sesseln derselben Bank. Ihr Baum in F1d ist einer, mit
  Sprecherwechsel (`wer`) statt zwei Bäumen. Ob sie Vorgänge sind, bleibt offen
  (Weltbibel Kapitel 16) und wird auch von F1 nicht entschieden.
* **Anlage 3** bekommt einen halben Abschnitt und keine Zeile. Er ist ein Kater. Auf
  Reichspapier gelesen ist er der dritte Sohn eines Adelshauses, und das bleibt ein
  stiller Gag.
* **Sturz und Nachtrag** bekommen ihre Abschnitte, weil das halbe Dorf über sie spricht,
  aber keine eigenen Dialogzeilen und keinen Baum. Was über sie gesagt wird, sagen andere.

---

## 6. Teil B: Die Dialogzeilen

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

**Neu in F1b, weitere Schalter derselben Bauart:**

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
   `anlass`-Schlüssel, den nichts auslöst: alles meldet der Guard.
3. **Im freien Spiel ohne Schichten ist alles offen**, was an Schichten, Akten oder Rang
   hängt. Das ist die Regel von `serieFrei()` und `figDa()`, und sie gilt weiter.
4. **Auslöser staffeln, nicht stapeln.** Über alle Figuren hinweg soll in jeder Schicht
   irgendwo etwas Neues fallen. Eine Tabelle im Lieferdokument zeigt, welcher Auslöser bei
   welcher Figur wann greift; wo drei Figuren dieselbe Schwelle tragen, wird gespreizt.
5. **Ereigniszeilen sind Kommentar, nie Auskunft.** Wer gerade kritisch getroffen hat,
   bekommt keine Geschichte erzählt, sondern einen Satz.
6. **Keine Zeile hängt an zwei Bedingungen.** Wer das braucht, hat einen Langvorgang
   gebaut, und Langvorgänge sind in Kapitel 10 abschließend aufgezählt. Für zwei
   Bedingungen gibt es ab F1d den Baum: dort ist die zweite Bedingung der Weg dorthin.

---

## 8. Teil C: Die Gesprächsbäume

Das ist der Teil, der aus dem Dorf ein Rollenspiel macht. Bisher ist ein Dorfgespräch eine
Zeilenschleife: drücken, Satz, drücken, nächster Satz. Ab F1d kann der Spieler bei jeder
Figur einen Faden aufnehmen, sich für eine Richtung entscheiden, dabei etwas verpassen und
sich verlaufen.

### Die Maschine steht schon

**Es wird keine zweite Dialogmaschine gebaut.** SZ1 und SZ2 haben eine, und sie kann
alles, was ein Baum braucht (`index.html`, Szenenmaschine ab Zeile 14681, Tabelle `SZENEN` ab Zeile 14868):

| Feld | Was es tut |
|---|---|
| `knoten` | `{key: {z1, z2, opts(), hub, wer}}`, die Knoten des Baums |
| `opts()` | die Antwortliste eines Knotens, jede mit `zu` (Ziel) oder `tun` (Wirkung) und optional `wenn` (Bedingung) |
| `fragen` | Fragenliste mit `frei` (Voraussetzung) und `nach` (Wartezahl), der Treppeneffekt |
| `hub` / `hubAusgang` | der Knoten, zu dem alles zurückführt, plus sein Ausgang |
| `sicht` | wie viele offene Fragen gleichzeitig auf der Tafel stehen, Auslieferung 3 |
| `wer` | Sprecherwechsel mitten im Baum, Porträt und Namensschild wechseln mit |
| `sperre` | Wortliste, die in diesem Baum nicht vorkommen darf |
| `wenn` / `figur` | wann der Baum fällig ist und an welcher Figur er hängt (`szeneFaellig()`) |
| `haeltDieWelt` | ob die Welt stehen bleibt, solange geredet wird |

Ein Figurenbaum ist damit ein Eintrag in `SZENEN` mit drei Unterschieden zu den drei
bestehenden Szenen:

1. **`haeltDieWelt:false`.** Ein Dorfgespräch ist keine Staatsaktion. Die Schichtuhr läuft
   weiter, die Monster bleiben in Bewegung. Wer währenddessen angegriffen wird, hat eben
   im Freien geplaudert. **Das ist die einzige Stelle, an der F1d das Verhalten der
   Maschine anfasst**, und sie ist ein bestehendes Feld, kein neuer Pfad.
2. **Wiederbetretbar.** Die drei bestehenden Szenen laufen genau einmal und setzen dabei
   einen Merker. Ein Figurenbaum setzt keinen, sondern prüft in `wenn()` seine Auslöser.
   Wer zweimal kommt, kommt wieder hinein. Was sich beim zweiten Mal ändert, steht unten.
3. **Einstieg über die Tafel.** Der Baum wird nicht durch das Ansprechen ausgelöst (das
   bleibt der Zeilenkreislauf), sondern über eine eigene Antwortzeile, siehe Abschnitt 10.

### Aufbau eines Baums

Je Figur **ein** Baum, **acht bis vierzehn Knoten**, gebaut nach diesem Muster:

* **Ein Hub.** Von dort gehen drei bis fünf Stränge ab, plus der Ausgang. Auf der Tafel
  stehen nach `sicht:3` immer die drei obersten offenen Stränge und der Ausgang: vier
  Zeilen, genau die Breite, die U3 gebaut hat und die `szeneAssert()` erzwingt.
* **Je Strang zwei bis vier Knoten.** Ein Strang, der nach einem Knoten zurückführt, ist
  eine Auskunft und kein Strang.
* **Mindestens eine echte Verzweigung je Baum**, also eine Stelle, an der zwei Antworten
  zu verschiedenen Knoten führen und **nicht** wieder zusammenlaufen.
* **Mindestens eine Sackgasse je Baum**, siehe unten.
* **Der Ausgang führt zurück in den Kreislauf**, nicht ins Nichts: nach dem Baum steht der
  Spieler wieder vor derselben Figur mit denselben Grundzeilen.

### Was „richtig RPG" hier heißt, und was es nicht heißt

* **Eine Wahl kostet etwas.** Mindestens einmal je Baum schließt eine Antwort eine andere
  aus. Wer Bramsche nach dem Brandabschnitt fragt, bekommt an diesem Tag nichts mehr über
  Hochablage. Ohne Kosten ist eine Verzweigung nur eine Reihenfolge.
* **Die Belohnung ist Wissen und Zugang, niemals Gold oder Erfahrung.** Ein Baum darf
  einen Fundort verraten, eine zusätzliche Frage bei Bramsche freischalten, einen Merker
  setzen, eine Zusatzzeile bei einer anderen Figur öffnen. Er darf **nichts** ausschütten,
  was sich wiederholen lässt: sonst wird Reden zum Farmen, und das erste, was die Spieler
  dann tun, ist das Gespräch wegzuklicken.
* **Der Spieler wird nie bestraft.** Keine Sackgasse kostet Leben, Gold, Zeit oder eine
  Wertung. Sie kostet höchstens eine Auskunft, die er heute nicht mehr bekommt.
* **Kein Gesinnungssystem, keine Punkte, keine Beziehungswerte.** Die Figuren merken sich
  Ereignisse (Merker), keine Sympathien. Diese Welt führt Akten, keine Gefühlslisten.
* **Niemand wird ausgefragt.** Jede Figur darf jederzeit höflich nicht antworten. Das ist
  in diesem Haus keine Sperre, sondern Charakterzeichnung.

### Sackgassen, und der Unterschied zwischen zwei Sorten

**Eine strukturelle Sackgasse ist ein Fehler.** `szeneAssert()` meldet jeden Knoten ohne
Ausgang („Knoten ohne Ausgang"), und das bleibt so: aus jedem Knoten führt eine Antwort
heraus, immer. Ein Spieler, der nicht mehr weiterklicken kann, hat keinen Baum gefunden,
sondern einen Bug.

**Eine erzählerische Sackgasse ist das Ziel.** Vier zugelassene Bauarten, jede mindestens
einmal über die ganze Lieferung:

| Bauart | Was passiert | Was der Spieler mitnimmt |
|---|---|---|
| **Die höfliche Wand** | Die Figur antwortet mit einem Satz, der nichts sagt, und der Strang endet am Hub. | Die Gewissheit, dass hier etwas ist. |
| **Die verbrannte Frage** | Wer A fragt, bekommt B in dieser Schicht nicht mehr (`frei`, `nach`, oder ein Merker). | Eine Entscheidung, die er beim nächsten Mal anders trifft. |
| **Der Umweg** | Drei Knoten, die ausführlich zum Hub zurückführen und dabei eine Kleinigkeit hinterlassen. | Eine Beobachtung, die bei einer anderen Figur später zählt. |
| **Der falsche Faden** | Eine Auskunft, die stimmt und nicht weiterhilft. | Ein Lacher, und kein Spott über ihn. |

**Die Regel dahinter:** eine Sackgasse ist eine Antwort, die zu Ende erzählt ist, und
niemals eine, die verschluckt wird. Der Spieler soll denken „ich hätte etwas anderes
fragen sollen", nicht „das Spiel hat mich rausgeworfen".

### Auslöser im Baum

Die Schalter aus Abschnitt 7 gelten auch hier, und hier zahlen sie sich doppelt aus:

* **Ein ganzer Baum** hängt an `wenn()` in seinem `SZENEN`-Eintrag. Vor Schicht 3 hat
  niemand etwas zu erzählen.
* **Ein einzelner Strang** hängt an `wenn` in `opts()`. Das ist die Stelle, an der die
  Skillung Richtungen bekommt: wer den Frostzweig gelernt hat, kann Nieselbeck etwas
  fragen, das ein Nahkämpfer nie zu Gesicht bekommt, und umgekehrt.
* **Eine Nachfrage** hängt an `frei` (erst nach Frage X) oder `nach` (erst ab der N-ten
  gestellten Frage). Das ist der Treppeneffekt aus dem Empfang, und er ist die billigste
  Art, Tiefe zu erzeugen.

**Jede dieser Bedingungen muss erreichbar sein**, und der Guard rechnet das nach. Ein
Strang hinter einer Skillung, die es nicht gibt, ist ein toter Ast.

### Umfang und Sonderfälle

* **Zwölf Bäume**, einer je ansprechbarer Dorffigur außer Lott und Pahl, die sich einen
  teilen (mit `wer`-Wechsel zwischen den beiden, das ist der Witz der Bank).
* **Bramsche** behält ihren Fragenkanal unverändert: eine Frage pro Schicht, abgewiesen
  wie bisher. Ihr Baum läuft daneben und rührt den Zähler nicht an, weil er über sie redet
  und nicht über die Welt. Wer Auskunft will, stellt einen Antrag. Wer sie kennenlernen
  will, geht in den Baum.
* **Vorblatt** darf in seinem Baum nie Nein sagen und nie drohen (Reichsregel 3). Sein
  Baum ist der freundlichste des ganzen Spiels, und das ist der Grund, warum er der
  unangenehmste ist.
* **Knöterich bekommt keinen Baum.** Er erklärt Tasten, nie Zusammenhänge.

---

## 9. Teil D: Der laufende Gag über die Kurzform

Behörden lieben Abkürzungen, und diese hier kürzt ab, seit es sie gibt. F1 macht daraus
einen Gag, der über fünf Akte läuft. **Er wird nicht erfunden, er wird freigelegt:** drei
Wurzeln stehen längst im Bestand, und zwei davon tragen bereits das halbe Spiel.

### Die drei Wurzeln im Bestand

| Kürzel | Wo es steht | Warum es schon ein Gag ist |
|---|---|---|
| **N. N.** | Zwei Türen im Haus, die Amtsleitung, das Dorffest (Weltbibel Kapitel 4) | Eine Abkürzung, die eine Person geworden ist. Alle begründen ihre Entscheidungen mit ihr. Die Weltbibel nennt sie den stabilsten Running Gag des Spiels. |
| **a. D.** | Knöterichs Titel | Sie stimmt nicht. Seine Entpflichtung ist nie bearbeitet worden. Die einzige Abkürzung im Spiel, die ihrer Figur widerspricht, und er weiß es. |
| **zu Händen** | Vorblatts Name (Weltgeschichte Kapitel 6) | Die Abkürzung, die ausgeschrieben wird. Im Reich kürzt man Hohe nicht ab. Er trägt sie als Namen und merkt es nicht. |

**Die Regel dahinter, und sie ist der doppelte Boden (Grundgesetz 6): abgekürzt wird, was
nicht wichtig genug ist, um ausgeschrieben zu werden.** Kinder sehen komische Buchstaben,
Erwachsene sehen eine Rangordnung. Wer im Reich einen vollen Namen bekommt, ist wer. Wer
zwei Buchstaben bekommt, ist ein Vorgang. **Das ist der Grund, aus dem dieser Gag über
fünfzig Schichten trägt und nicht nach drei Zeilen verbraucht ist.**

### Die Eskalation über die fünf Akte

Ein Running Gag, der jedes Mal dasselbe tut, ist eine Wiederholung. Dieser hier steigt:

| Akt | Stufe | Was passiert |
|---|---|---|
| **I** | **Das gewöhnliche Kürzel** | Figuren benutzen Kürzel, die sich aus dem Zusammenhang ergeben. Der Spieler lernt beiläufig, dass hier abgekürzt wird. Nichts daran ist komisch, und genau deshalb funktioniert alles Spätere. |
| **II** | **Die Abkürzung der Abkürzung** | Ein Kürzel ist jemandem zu lang geworden und hat selbst ein kürzeres bekommen. Milb ist stolz darauf. Niemand widerspricht. |
| **III** | **Die Kollision** | Zwei Stellen benutzen dasselbe Kürzel für Verschiedenes, und beide haben recht. Vordermühl meint das eine, Hochablage das andere. Es merkt nur der Spieler, und es wird nie aufgeklärt. |
| **IV** | **Die verlorene Langform** | Jemand wird nach der Langform gefragt und kennt sie nicht mehr. Das Kürzel hat die Sache überlebt, um die es ging. Hier kippt der Gag ins Stille, und das ist Absicht (Regel 9). |
| **V** | **Die Sache, die niemand abgekürzt hat** | Der Vorgang 1 trägt in vierhundert Jahren kein Kürzel. Nicht, weil er zu wichtig wäre. Sondern weil ihn nie jemand oft genug erwähnt hat, als dass sich das Abkürzen gelohnt hätte. Das ist die Pointe des ganzen Gags, sie gehört Akt V, und sie fällt in genau einer Zeile. |

**Die Stufen hängen an `abAkt`**, dem Schalter, den es schon gibt. Kein neuer Mechanismus,
keine eigene Zählung.

### Wer den Gag trägt

Nicht alle. Ein Gag, den jede Figur macht, ist ein Tick des Autors und keine Welt.

| Figur | Ihre Rolle im Gag |
|---|---|
| **Milb**, Gutachter | Erfindet Kürzel und ist stolz darauf. Kürzt in Akt II eine Abkürzung ab. Kürzt am Ende seinen eigenen Titel. |
| **Bramsche**, Registratur | Kennt jede Langform und gibt sie nur auf Antrag heraus. **Sie ist die Auflösestelle des ganzen Gags**, und damit der Grund, warum das Kürzel nie zur Wand wird. |
| **Lisbeth**, Praktikantin | Fragt nach, was es heißt. Sie ist die Gerade (Regel 11) und die Einzige, die fragen darf, ohne begriffsstutzig zu wirken. Sie fragt einmal zu viel, und das ist ihr bester Moment. |
| **Nörgel**, auf Probe | Kürzt falsch ab. Niemand korrigiert ihn. In Akt IV stellt sich heraus, dass sein falsches Kürzel inzwischen von zwei anderen benutzt wird. |
| **Vorblatt**, Reich | Kürzt Menschen ab, ausgesprochen höflich. Wer bei ihm zwei Buchstaben hat, ist ein Vorgang. **Hier hat der Gag Zähne**, und er droht dabei nie (Reichsregel 3). |
| **Trepp**, Zusteller | Liest Kürzel von Umschlägen ab, ohne sie zu verstehen, und stellt trotzdem zu. |
| **Zwirn**, Bürgermeister | Hat für das Dorffest ein Kürzel und benutzt es, als wäre das Fest dadurch ein Vorhaben. |
| **Lott und Pahl** | Kürzen nichts ab. Sie haben Zeit. Ihr Kommentar von der Bank ist die Gegenstimme, ohne die der Gag ein Selbstläufer würde. |
| **Knöterich** | Benutzt kein Kürzel, das er nicht auflösen darf. Sein `a. D.` ist das einzige, das ihm gehört, und es stimmt nicht. Er sagt dazu nichts. |

### Grenzen, ohne die der Gag zur Zumutung wird

1. **Jede Abkürzung ist im Spiel auflösbar.** Wer fragt, bekommt die Langform, spätestens
   bei Bramsche. Ein Kürzel, das nirgends aufgeht, ist kein Gag, sondern eine verschlossene
   Tür. **Das ist zugleich der beste Strang, den ein Gesprächsbaum haben kann:** „Was heißt
   das?" ist eine Frage, die ein Spieler von selbst stellt.
2. **Kein Satz braucht die Langform, um verstanden zu werden.** Die Situation trägt, das
   Kürzel ist die zweite Etage. Wer es nicht auflöst, verliert nichts.
3. **Höchstens eine unerklärte Abkürzung je Gespräch.** Zwei sind Fachsprache, drei sind
   eine Wand.
4. **Höchstens zwölf Kürzel im ganzen Spiel**, die drei bestehenden mitgezählt. Je Akt
   höchstens eines neu.
5. **Nie ein Kürzel, um den Zeichendeckel zu erreichen.** Ein Kürzel, das nur dasteht, weil
   die Zeile sonst 51 Zeichen hätte, ist ein Formfehler und kein Gag. Dann wird die Zeile
   umgeschrieben, nicht abgekürzt.
6. **Keine Abkürzung fasst Kesselgrammatik zusammen.** Der Sperrvermerk gilt für Kürzel
   genauso, und ein Kürzel ist die verführerischste Art, ihn zu brechen.

### Was geliefert wird

Eine **Abkürzungstabelle**, in `figuren-leben.md` als Tabelle und im Code als Konstante
`ABKUERZUNGEN`, mit je Kürzel: Langform, wer es benutzt, ab welchem Akt, wo es auflösbar
ist, und welche Stufe der Eskalation es trägt. Sie ist die einzige Stelle, an der die
Langformen stehen; keine zweite Liste.

**Der Guard dazu** (in `knAssertCaps()`, F1b): jedes Kürzel, das in einem Figurentext
vorkommt, steht in `ABKUERZUNGEN`; jedes Kürzel in `ABKUERZUNGEN` hat eine Auflösung, die
erreichbar ist; kein Zeilenpaar trägt zwei unerklärte Kürzel. Erkannt wird über zwei
Muster (Großbuchstabenfolgen ab zwei Zeichen und Punktkürzel der Form `X. Y.`) plus eine
kurze Ausnahmeliste für Wörter, die keine Kürzel sind. **Der Guard ist der Punkt, an dem
dieser Gag aufhört, Fleißarbeit zu sein:** eine dreizehnte Abkürzung fällt beim nächsten
Start auf, und nicht erst der Spielerin in Akt IV.

## 10. Der Code, den F1 kostet

Klein halten, das ist Bedingung. Erwartet werden genau diese Eingriffe:

**Aus F1b, die Auslöser:**

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

* **`ABKUERZUNGEN`**, die Tabelle aus Abschnitt 9, als Konstante neben `RANDNOTIZ`, plus
  ihre Prüfung in `knAssertCaps()`: jedes Kürzel im Figurentext steht in der Tabelle, jedes
  Kürzel in der Tabelle ist im Spiel auflösbar, kein Zeilenpaar trägt zwei unerklärte. Die
  Erkennung läuft über zwei Muster und eine Ausnahmeliste, beides im Kommentar begründet.
* **Die Zählwerke bleiben Papier.** Anspielungen (höchstens fünf), Zwinkern (höchstens
  sechs) und die Dosis je Figur werden im Lieferdokument gezählt und **nicht** im Code
  geprüft. Ein Guard, der Witze zählt, wäre eine Behauptung über Geschmack; ein Guard, der
  Kürzel auflöst, ist eine Prüfung auf Vollständigkeit. Der Unterschied ist die Grenze
  dieses Abschnitts.

**Aus F1d, die Bäume:**

* **Die Einstiegszeile.** `gespraechOptionen()` (Zeile 8667) liefert heute vier feste
  Antworten, `gespraechAssert()` (Zeile 8958) verlangt genau vier. Neu: hat die Figur
  einen fälligen Baum (`szeneFaellig()` mit den Auslösern aus Abschnitt 7), erscheint als
  vorletzte Antwort **„Erzählen Sie von früher."** (24 Zeichen, Deckel 28) und öffnet ihn;
  der Abschied bleibt die letzte. Der Guard prüft dann vier **oder** fünf Antworten, dass
  die letzte immer der Abschied ist, und dass die fünfte nur steht, wenn ein Baum fällig
  ist. **Innerhalb** eines Baums bleibt es bei höchstens vier Antworten je Knoten, wie
  `szeneAssert()` es heute erzwingt. Die Asymmetrie ist Absicht: die Figurenliste ist ein
  Menü, ein Baumknoten ist ein Gespräch.
* **`szeneFaellig()`** (Zeile 15328) darf mehrere Bäume je Figur unterscheiden und nimmt
  dafür den ersten, dessen `wenn()` zutrifft. Das kann sie heute schon; was fehlt, ist
  eine Ordnung, in der der speziellere Baum vor dem allgemeineren steht. Eine Zeile
  Kommentar dazu genügt, aber sie muss dastehen.
* **`szeneAssert()`** (Zeile 15530) zählt die Figurenbäume mit. Neue Prüfungen: jeder Baum
  hat einen Ausgang, der in den Kreislauf zurückführt; jeder Strang ist erreichbar; kein
  `wenn` hängt an einer Bedingung, die es nicht gibt; kein Baum setzt einen Merker, den
  der Spielstand nicht kennt; und die Anspielungszahl aus Abschnitt 4 steht als Zahl im
  Lieferdokument, nicht im Code.
* **Kein neues Speicherfeld**, wo eine Ableitung reicht. Stufe, Rang, Schicht und Skillung
  stehen bereits im Spielstand; sie werden gelesen und nicht gespiegelt. Das ist die
  W5/W6-Doktrin: zwei Felder für denselben Zustand sind zwei Wahrheiten, und die zweite
  driftet. Was ein Baum sich merken **muss** (eine verbrannte Frage, eine getroffene
  Wahl), wird ein Merker in `kn.flags` und steht damit im Spielstand, den es schon gibt.

---

## 11. Ausgabeformat

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

**`figuren-baeume.md`** bekommt je Figur erst eine **Landkarte** des Baums (Hub, Stränge,
wo die Verzweigung liegt, wo die Sackgasse liegt, was eine Wahl kostet), dann die Knoten
als Tabelle mit gegengezählten Zeichen, dann den Codeblock im `SZENEN`-Format. Die
Landkarte ist keine Zierde: an ihr sieht man in zehn Sekunden, ob der Baum eine Form hat
oder nur eine Liste ist.

Die Zahlen in Klammern sind **gezählt, nicht geschätzt**. Wer schätzt, produziert den
Fehler, den `knAssertCaps()` beim nächsten Start meldet, und verliert die Runde damit
zweimal.

---

## 12. Selbstprüfung, drei Durchgänge

Dasselbe Verfahren, das die elf Figuren der Serie 1 sauber gemacht hat, und es hat
damals zwei Funde gehabt:

1. **Entwurf** je Figur, aus der Hintergrundgeschichte heraus.
2. **Zweiter Durchgang, unabhängig:** gegen Sperrvermerk, Humor-Grundgesetz, Formregeln,
   Zeichendeckel, Kaiser-Präsens, und seit F1 zusätzlich gegen die drei Dosen: Anspielungen
   (höchstens fünf), Zwinkern (höchstens sechs), unerklärte Kürzel (höchstens eines je
   Gespräch). Alle drei werden **gezählt und als Liste ins Lieferdokument geschrieben**,
   nicht überschlagen. Repariert wird hier, nicht später.
3. **Dritter Durchgang, wieder unabhängig, nur eine Frage:** leckt irgendeine Zeile
   Kesselgrammatik? Das ist der Durchgang, der bei Serie 1 zwei fertige Formulierungen
   gekippt hat.

Für die Bäume kommt ein vierter dazu, und er wird geklickt und nicht gelesen: **jeden
Strang einmal bis zum Ende gehen**, jede Sackgasse betreten, jede Verzweigung beide Male
nehmen. Am Ende steht je Figur eine **Prüfnotiz** im Lieferdokument, auch wenn sie „kein
Fund" lautet.

---

## 13. Abnahme und Prüfprotokoll

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
* `knAssertCaps()` jede benutzte Abkürzung in `ABKUERZUNGEN` wiederfindet und schweigt,
* `szeneAssert()` die Figurenbäume mitzählt und seine Zeile um deren Zahl erweitert,
* eine Figur mit jedem neuen Schaltertyp im laufenden Spiel nachweislich ihre Zeile sagt
  und **ein vollständiger Baum im laufenden Spiel durchgeklickt ist**, samt Sackgasse
  (Messlauf unter `tools/`, Vorbild `tools/spaziergang-messlauf.mjs`); beides steht mit
  Ausgabe im Phasendokument,
* `node tools/build-single.mjs` durchläuft und die entstandene `dist/index.html` per
  `file://` dasselbe zeigt.

Eine Warnung, die immer da steht, ist keine. Wer eine Meldung sieht, die „schon immer" da
war, hat einen Fund und keine Tapete.

---

## 14. Was ausdrücklich nicht passiert

* Keine bestehende Zeile aus `figuren-dorf.md` wird geändert. F1 ist Zuwachs.
* Keine Kesselgrammatik, in keiner Andeutung, von keiner Figur.
* Kein Monster bekommt einen Titel. Ausnahme bleibt Fürst Nachtrag.
* Der Kaiser wird nirgends in der Vergangenheit erwähnt.
* Popkultur ja, Zwinkern ja, beides nur nach der Dosis aus Abschnitt 4 und beides gezählt.
  Kein Erzähler, der sich einmischt; keine Figur, die Tasten, Menüs oder Spielstände nennt.
* Kein Zwinkern und keine Anspielung im warmen Moment, in der Fanfare oder in einer Szene,
  die etwas trägt.
* Keine dreizehnte Abkürzung, kein Kürzel ohne Auflösung, kein Kürzel für Kesselgrammatik,
  und keines, das nur den Zeichendeckel rettet.
* Kein Blut, kein Sterben, kein Zynismus. Konfetti und Feierabend.
* Knöterich erklärt weiterhin Tasten und keine Zusammenhänge, und bekommt keinen Baum.
* Keine zweite Dialogmaschine neben `SZENEN`, kein achter Langvorgang, kein neues
  Speicherfeld für ableitbaren Zustand.
* Kein Knoten ohne Ausgang, keine Belohnung aus einem Baum, die sich wiederholen lässt.
* Kein Statusmarker bleibt stehen: jede Überschrift trägt `— ERLEDIGT` oder `— OFFEN`,
  nachgezogen im selben Commit.

---

## 15. Der Kurzprompt zum Kopieren

Für eine frische Sitzung, wenn das lange Dokument nicht in den Kontext soll:

> Lies `superduper-weltbibel.md` (Kapitel 7, 8, 9, 13, 17, 19), `weltgeschichte.md`
> (Kapitel 3, 6, 12), `figuren-dorf.md` und in `index.html` den Block `DORF_FIGUREN` samt
> `npcCycle()`, `npcSprechen()`, `figZusatz()`, `knAssertCaps()`, `gespraechOptionen()`
> sowie den Szenenblock `SZENEN` mit `szeneOptionen()`, `szeneKnoten()`, `szeneFaellig()`
> und `szeneAssert()`. Arbeite dann `superduper-figurenleben-prompt.md` ab, Lieferung F1a
> bis F1e in dieser Reihenfolge, je ein Commit.
>
> F1a: schreib für jede der vierzehn Dorffiguren, für Knöterich, Sturz, Nachtrag und
> Anlage 3 eine Hintergrundgeschichte von 500 bis 800 Wörtern nach der Gliederung in
> Abschnitt 5 (Besessenheit, Hindernis, Sprachmarke, Herkunft, Riss, Geheimnis, blinder
> Fleck, drei Verhältnisse, was sie nie sagt, die eine neue Tatsache, Gesprächsstoff,
> Belege). Fundiert heißt: jede Tatsache belegt oder als neu markiert und gegen die
> Chronik abgeglichen. Humor nach Abschnitt 4: der Gerade und der Trockene, Dreierregel
> mit Kippsatz, Rückruf, die konsequent befolgte Regel, die höfliche Katastrophe,
> Untertreibung, voller Einsatz für die falsche Sache, Wärme unten drunter. Popkultur ist
> erlaubt, aber nur allgemein bekannte, höchstens fünf Anspielungen in der ganzen
> Lieferung, höchstens eine je Figur, und jede Zeile muss ohne sie vollständig sein. Auch
> die vierte Wand darf gezählt fallen: höchstens ein Zwinkern je Figur, höchstens sechs im
> ganzen Ensemble, immer aus der Figur heraus und nie im warmen Moment. Liefere beide
> Zählungen als Liste mit.
>
> Dazu der laufende Gag über Abkürzungen (Abschnitt 9): freilegen, nicht erfinden. Die drei
> Wurzeln sind N. N., a. D. und zu Händen. Die Regel dahinter ist, dass abgekürzt wird, was
> nicht wichtig genug ist, um ausgeschrieben zu werden. Fünf Stufen über die Akte
> (gewöhnliches Kürzel, Abkürzung der Abkürzung, Kollision, verlorene Langform, und in Akt
> V die Sache, die nie ein Kürzel bekommen hat: Vorgang 1). Höchstens zwölf Kürzel im
> Spiel, jedes bei Bramsche auflösbar, höchstens eines unerklärt je Gespräch. Tabelle
> `ABKUERZUNGEN` plus Guard in `knAssertCaps()`.
>
> F1b: bau die neuen Schaltertypen für `zusatz` ein (`abSchicht`, `phase`, `abStufe`,
> `abRang`, `skill`+`ab`, `zauber`/`zweig`), genau einer je Block, alles aus vorhandenem
> Zustand abgeleitet, `knAssertCaps()` erweitert, keine neue Textzeile.
>
> F1c: leite je Figur zwölf neue Zeilenpaare plus Ereigniszeilen aus der
> Hintergrundgeschichte ab, jede Zeile mit Verweis auf ihr Feld, Zeichen gegengezählt,
> Deckel 48/32/44/28.
>
> F1d: bau je Figur einen Gesprächsbaum als Eintrag in `SZENEN` mit `haeltDieWelt:false`,
> acht bis vierzehn Knoten, ein Hub, drei bis fünf Stränge, mindestens eine echte
> Verzweigung und mindestens eine erzählerische Sackgasse (höfliche Wand, verbrannte
> Frage, Umweg oder falscher Faden). Struktureller Knoten ohne Ausgang ist ein Fehler und
> bleibt einer. Eine Wahl muss einmal je Baum etwas kosten. Belohnung ist Wissen und
> Zugang, nie Gold oder Erfahrung. Einstieg über eine fünfte Antwortzeile „Erzählen Sie
> von früher.", der Abschied bleibt letzte Zeile, im Baum höchstens vier Antworten je
> Knoten. Lott und Pahl teilen sich einen Baum mit Sprecherwechsel, Knöterich bekommt
> keinen. Mindestens drei Bäume tragen einen Strang „Was heißt das?" auf ein Kürzel, und
> mindestens einer davon endet als höfliche Wand.
>
> F1e: Phasendokument, README-Zeile, Weltbibel-Zuwachs, Statusmarker.
>
> Prüf in drei Durchgängen wie in Abschnitt 12, für die Bäume in vier. Abnahme wie in
> Abschnitt 13: `node --check`, Browser mit stiller Konsole, ein Messlauf je neuem
> Schaltertyp und ein vollständig durchgeklickter Baum. Nichts gilt als fertig, was nur
> behauptet ist.
