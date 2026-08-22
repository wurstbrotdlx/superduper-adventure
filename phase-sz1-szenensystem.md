# Bauabschnitt SZ1: Das Szenensystem und das Intro — ERLEDIGT

Die Szenenmaschine wird vom Empfang gelöst, und das Intro aus der Weltgeschichte ersetzt die fünf Anrisstafeln.

Dies ist der erste von vier Abschnitten, die die neun Szenen aus `weltgeschichte.md`, Kapitel 8, ins Spiel bringen. SZ1 baut die Maschine und die einfachste Szene darauf. SZ2 bis SZ4 bringen die übrigen acht.

---

## 1. Der Befund, mit dem alles anfing

Die Weltbibel verbietet in Kapitel 14 ausdrücklich: *"Keine Cutscene, kein Kamerafahrt-Skript, kein Standbild-Interlude."* Solange dieser Satz galt, waren die neun Szenen nicht baubar.

Beim Nachsehen im Code stellte sich heraus: **die Maschine, die dieser Satz verbietet, ist längst gebaut und ausgeliefert.** E1 und E2 haben sie im August 2026 gebaut, sie hieß nur nicht so:

* `EMPFANG_KNOTEN` ist ein Knotengraph. Jeder Knoten hat zwei Sprechzeilen und eine Antwortliste, die Antworten zeigen auf andere Knoten.
* `buehneAn()` / `buehneAus()` legen Schwarz unter den ganzen Vorgang und blenden die Welt aus.
* `empfangTafel(i)` blättert Standbilder in Urkundenoptik durch das Overlay, eins nach dem anderen, nur auf Tastendruck.
* Das Porträt, das Tippwerk und die vierzeilige Antwortliste kommen aus U3.
* Knöterichs Vorstellung, die fünf Züge zu Beginn des Spiels, **ist bereits eine gespielte Szene.**

Der Satz in Kapitel 14 ist damit auf demselben Weg überholt wie sein Nachbar *"Kein Dialogbaum. Keine Antwortauswahl. Kein Gesprächssystem."*, den U3 schon gestrichen hat. Beide beschreiben nicht mehr, was das Spiel nicht tut, sondern was es inzwischen kann.

**SZ1 baut deshalb fast nichts Neues. Es löst heraus.**

---

## 2. Was aus was geworden ist

Der Empfang ist der erste Eintrag einer Tabelle und hat sich dabei um kein Wort geändert.

| Vorher | Nachher |
|---|---|
| `empfangAktiv` (bool) | `szeneAktiv` (Szenenschlüssel oder `null`) |
| `EMPFANG_KNOTEN`, `EMPFANG_FRAGEN` | Felder `knoten` und `fragen` je Eintrag in `SZENEN` |
| `empfang = {knoten, gefragt}` | `szene = {knoten, gefragt}` |
| `empfangSzene()`, `empfangOptionen()`, `empfangOpt()` | `szeneKnoten()`, `szeneOptionen()`, `szeneOpt()` |
| `empfangKnoeterich()`, fest verdrahtet | `sprecher()` als Feld je Szene |
| `empfangTafel(i)` über `EMPFANG_TAFELN` | `szeneTafeln(liste, letzterKnopf, ende)` |
| `empfangAssert()` über eine Szene | `szeneAssert()` über jede eingetragene Szene |

Die Feldform einer Szene:

```js
SZENEN.empfang = {
  sprecher: () => szeneSprecherKnoeterich(),
  start:    'vorstellung1',
  knoten:   EMPFANG_KNOTEN,
  fragen:   EMPFANG_FRAGEN,
  sicht:    EMPFANG_FRAGEN_SICHT,
  sperre:   AKTE_SPERRE,
  hubAusgang: () => ({t:'Wo unterschreibe ich?', zu:'anrede'}),
  ende:     () => empfangEnde(),
};
```

### Warum `empfangAktiv` stehen geblieben ist

Nicht aus Bequemlichkeit, und es ist **kein zweites Feld.** Es ist eine abgeleitete Frage auf `szeneAktiv`:

```js
Object.defineProperty(globalThis, 'empfangAktiv', {get: () => szeneAktiv === 'empfang'});
```

Zwei Gründe. Erstens die W5/W6-Doktrin dieses Projekts: jede Ableitung wird gelesen, nicht gespeichert, weil zwei Felder für denselben Zustand mit der Zeit auseinanderlaufen und die zweite Wahrheit niemandem auffällt. Zweitens ganz praktisch: `tools/empfang-pruef.mjs` liest die Zeile an neun Stellen, und dadurch konnte der Prüflauf den Umbau unverändert überstehen. Genau das war der Zweck.

### Die zwei echten Erweiterungen

**Ein Knoten darf den Sprecher wechseln.** `szeneKnoten()` liest ein optionales `wer:` und setzt Porträt und Kopfzeile neu. Der Empfang braucht das nicht, er hat einen Sprecher. Szene 7, die Versuchung, steht und fällt damit: dort geht Vorblatt durch acht Leute hindurch, und ohne Porträtwechsel wäre eine Versammlung eine Wand aus Text.

**`szeneTafeln()` blättert einen beliebigen Stapel.** Liste, Beschriftung des letzten Knopfes und was danach geschieht sind Parameter statt Literale. Damit blättert dieselbe Optik heute das Intro und später den Abspann, ohne dass eine zweite Zeichenstelle entsteht.

---

## 3. Die geteilte Wortsperre

Das war die einzige Stelle, an der die Verallgemeinerung eine echte Entscheidung erzwungen hat.

`AKTE_SPERRE` verbietet dem Anfang zwölf Wörter: *Nachtrag, Ausfertigung, Zustell, Krieg, Frieden, Vertrag, Trepp, Sturz, Schattenfürst, Anschrift, Vorgang 1, Amtsleiterin*. Der Grund steht in E1 und ist gut: ein Anfang ist die verführerischste Stelle im ganzen Spiel, um kurz zu erklären, worum es eigentlich geht, und genau das darf er nicht.

**Das Intro kann diese Sperre nicht einhalten.** Es zeigt neun Dokumente, und die Dokumente sind: die Rückfrage, die Mahnungen, der Kriegsbericht, das Friedensabkommen, der unzustellbare Umschlag. Das ist der Inhalt, nicht ein Versehen.

Die Sperre für eine Szene abzuschalten wäre die faule Lösung gewesen. Stattdessen ist sie geteilt:

```js
const AKTE_SPERRE_NAMEN = ['Nachtrag', 'Trepp', 'Sturz', 'Schattenfürst', 'Amtsleiterin', 'Vorgang 1'];
```

**Das Intro darf die Papiere zeigen. Es darf niemanden beim Namen nennen.** Genau das tut die Weltgeschichte auch: sie sagt "Der Bote konnte die Anschrift nicht lesen", nicht "Trepp". Sie sagt "die andere Seite war nicht da", nicht "Fürst Nachtrag". `tools/szene-pruef.mjs` rechnet beides nach, in beide Richtungen: dass das Intro die Papiere wirklich zeigt und dass es wirklich keinen Namen nennt.

Zwei Wörter sind dafür trotzdem umformuliert worden, weil sie sonst nur eine Vokabel gewesen wären und keine Aussage: aus *Kriegsbericht* wurde "Ein Bericht, sehr sachlich, mit einer Tabelle", aus *Vertrag* "Ein Abkommen". Der Satz darunter sagt beide Male dasselbe.

---

## 4. Das Intro ersetzt die Anrisstafeln

Das war eine Nutzerentscheidung und sie ist die richtige.

Die Alternative wäre gewesen, das Intro **vor** die Vorstellung zu stellen. Dann stünden vor dem ersten Schritt des Spielers: fünf Züge Vorstellung, neun Blätter Intro, fünf Anrisstafeln, ein Empfang mit zwölf Fragen und ein dreiblättriger Vordruck. E1 ist an genau dieser Klasse Fehler schon einmal gescheitert; die Rückmeldung damals lautete, dass die Witze nicht tragen, und der Befund war nicht, dass sie fehlten, sondern dass sie ohne Takt dastanden.

Anrisstafeln und Intro erzählen dieselben vierhundert Jahre. Die Tafeln taten es in fünf Behauptungen, das Intro tut es in neun Dokumenten, und Dokumente sind das, was dieses Haus hat. **Der Anfang wird durch den Tausch nicht länger, nur genauer.**

Die Reihenfolge aus E2 trägt es zusätzlich: erst der Mann, dann seine Geschichte. Nach Knöterichs Vorstellung sind die neun Blätter nicht die Stimme eines Erzählers, sondern sein Bericht, und der Empfang setzt danach mit "So weit der Bestand" genau dort auf.

Die Optik ist die der Anrisstafeln: Siegel, gesperrte Versalien, Doppellinie, römische Blattzahl, `WEITER` und `ÜBERSPRINGEN`. Nur der Textkörper ist ein anderer, weil ein Dokument anders aussieht als ein Ausruf: eine kursive Regieangabe, was auf dem Tisch liegt, darunter die vorgelesenen Zeilen, darunter gegebenenfalls, was die Hand danach tut.

### Der Konflikt, der dabei entsteht, offen benannt

**Das Intro erzählt mehr, als Weltbibel Kapitel 9 dem ersten Akt erlaubt.** Dort steht: *"Der Spieler lernt den Job. Die Welt wirkt wie ein normales Fantasy-Spiel mit merkwürdigem Vokabular."* Wer das Intro gesehen hat, weiß ab Schicht 1, dass es einen Krieg gab, einen unvollständigen Frieden und einen Brief, den niemand zustellen konnte.

Das ist eine echte Änderung am Kanon und keine Kleinigkeit. Drei Gründe, warum sie trotzdem richtig ist:

1. **Das Intro nennt keine Namen und keine Zusammenhänge.** Der Spieler sieht Papiere. Er weiß nicht, dass der Umschlag heute noch in Trepps Sack liegt, nicht wer der Empfänger ist, nicht dass das Haus deshalb existiert. Er hat Bilder, keine Erklärung, und die Auflösung liegt weiterhin in den Akten III bis V.
2. **Die Anrisstafeln taten dasselbe, nur schlechter.** "VOR VIERHUNDERT JAHREN geschah etwas Ungeheuerliches" ist genau dieselbe Vorwegnahme, ohne den Gegenwert.
3. **Es beantwortet die Rückmeldung, die zu E1 geführt hat.** Wer nicht weiß, worum es geht, versteht auch die Witze nicht, die davon handeln.

Weltbibel Kapitel 9 trägt diesen Vorbehalt jetzt als Nachtrag. Wer die Entscheidung zurücknehmen will, tauscht eine Tabelle aus; die Maschine bleibt, wie sie ist.

---

## 5. Zwei Funde aus der Prüfung

Beide im Browser gefunden, keiner in einem Guard, und der zweite ist der interessantere.

### Der Sprecherwechsel tauschte das Porträt, aber nicht den Namen

`szeneSprecherSetzen()` setzte `gespraech.fig` und zeichnete das Porträt neu. Die Kopfzeile wird aber an einer anderen Stelle gefüllt, in `gespraechZeichnen()`, und die läuft erst beim nächsten Satz. Im Regelfall fällt das nicht auf, weil ein Wechsel fast immer von einem neuen Satz begleitet wird. Bei einem Wechsel ohne Satz stünde das falsche Schild über der richtigen Figur.

Der Wechsel setzt jetzt beides. Ein Sprecherwechsel **ist** Porträt plus Name; wenn die Hälfte davon an einem anderen Aufruf hängt, ist es keiner.

### Der Erreichbarkeitslauf brauchte einen Fixpunkt

Der neue Prüflauf soll beweisen, dass jeder Knoten jeder Szene vom Start aus erreichbar ist. Der erste Versuch nahm zwei Momentaufnahmen: einmal mit leerer Fragenmenge, einmal mit voller.

Damit sieht man genau die Fragen dazwischen nie. Der Empfang zeigt immer nur die ersten drei **offenen** Fragen, und eine Frage wird erst offen, wenn ihre Voraussetzung gestellt ist. Das ist der Treppeneffekt, von dem die Szene lebt, und er macht Erreichbarkeit zu einer Sache, die man laufen muss statt sie abzulesen.

Der Lauf läuft jetzt bis zum Fixpunkt: fragen, was angeboten wird, dann erneut hinsehen, bis nichts Neues mehr dazukommt. Dazu kommt, dass eine Antwort ihr Ziel auf zwei Arten nennen kann, als `zu:` in der Tabelle oder als `tun: () => szeneKnoten('x')`. Die zweite ist nur am Quelltext der Funktion zu erkennen, und der Lauf liest ihn. Das ist keine Spielerei: die Tabelle ist Daten, und ein Knoten, den nur eine Funktion nennt, wäre sonst als unerreichbar gemeldet, obwohl er es nicht ist.

---

## 6. Abnahme

### Die Guards beim Laden

Konsole still. Die neue Zeile:

```
SZ1 Szenen: 1 Szene(n), 9 Introblätter, 12 Fragen, 9 Knoten, Sperrvermerk und Antwortdeckel in Ordnung.
```

`szeneAssert()` ist an die Stelle von `empfangAssert()` getreten und prüft dasselbe, nur über jede eingetragene Szene: Formregeln auf jeder Zeile gegen die Wortsperre **dieser** Szene, Erreichbarkeit jeder Frage, kein Knoten ohne Ausgang, kein Ziel, das es nicht gibt, Vierzeiligkeit und Zeichendeckel der Antworten, und der Ausgang über `dienstAntritt()`. Neu dazu: jeder Tafelstapel trägt eine der beiden Lesarten vollständig, und ein Knoten, der den Sprecher wechselt, nennt einen, den es gibt.

### Der neue Prüflauf

`tools/szene-pruef.mjs`, 11 Prüfungen, Exit-Code 1 bei der ersten Abweichung.

```bash
python3 serve.py &
node tools/szene-pruef.mjs
```

Geprüft wird die Maschine, nicht die Erzählung: Tabellenform jeder Szene, Erreichbarkeit als Fixpunktlauf über den Knotengraphen, dass die Wortsperre an der Szene hängt und nicht mehr am Modul, dass `szeneAktiv` den Schlüssel trägt und danach auf `null` steht, dass der Sprecherwechsel Porträt und Kopfzeile tauscht, und dass jedes Introblatt auf 390x844 vollständig im Bild steht.

### Der bestehende Prüflauf, und was an ihm geändert wurde

`tools/empfang-pruef.mjs` läuft **59 von 59**. Zwei seiner Zusagen sind nachgezogen, und beide beschreiben Inhalt, der absichtlich ausgetauscht wurde:

| Vorher | Nachher |
|---|---|
| `der Anriss hat fuenf Tafeln` → 5 | `das Intro hat neun Blaetter` → 9 |
| `die erste Tafel steht` → enthält "VIERHUNDERT" | `das erste Introblatt steht` → enthält "zwölf Bereiche" |

**Die übrigen 57 stehen unverändert.** Das ist der Beweis, um den es hier geht: der Anfang hat den Umbau der Maschine unter sich überlebt, ohne dass eine einzige Zusage über sein Verhalten weicher gemacht werden musste. Als der Umbau fertig war und der Lauf zum ersten Mal wieder lief, meldete er genau diese zwei Abweichungen und keine dritte.

### Die übrigen Läufe

| Lauf | Ergebnis |
|---|---|
| `tools/szene-pruef.mjs` (neu) | 11 von 11 |
| `tools/empfang-pruef.mjs` | 59 von 59 |
| `tools/gespraech-pruef.mjs` | 44 von 44 |
| `tools/menue-pruef.mjs` | 39 von 39 |
| `tools/reich-pruef.mjs` | 35 von 35 |

Dazu `node tools/build-single.mjs` und die entstandene `dist/index.html` per `file://` geladen: Konsole still, alle Guards grün. Dieses Repo hat keine CI auf Pull Requests, `pages.yml` läuft erst auf `push` nach `main` — der Build muss vorher geprüft sein, sonst prüft ihn der Deploy.

### Im Bild

Alle neun Blätter angesehen, auf 1280x800 und auf 390x844. Kein Blatt rollt, beide Knöpfe stehen auf dem Telefon im Bild, die Regieangabe bricht sauber um. Der Übergang vom neunten Blatt (`ANKLOPFEN`) in den Empfang ist derselbe wie vorher.

---

## 7. Was als Nächstes kommt

| Abschnitt | Inhalt |
|---|---|
| **SZ2** | Szenen 2, 3 und 4: Kordula Umlauf im Gasthaus, die zweite Schublade, Knöterichs einer Satz. Alle drei auf bestehenden Figuren, fast nur Text. |
| **SZ3** | Szenen 5 und 6: der Stopfen im Steinfeld samt Serie I und Postregen, und Vorblatts Ankunft. Der einzige Abschnitt mit echter Weltmechanik. |
| **SZ4** | Szenen 7, 8 und 9: die Versuchung als Versammlung, die Zustellung als Ausbau von `vorgangPanel()`, der Abspann als Tafelstapel. |

Für SZ4 gilt ein zweiter Befund aus der Erkundung, der dort Arbeit spart: **die Szenen 8 und 9 existieren bereits in Kurzform.** `vorgangPanel(1..3)` spielt heute ZUSTELLUNG, DAS FINALE mit exakt den vier Puzzleteilen aus Szene 8 und einen auf sieben Zeilen eingedampften Abspann. Sie werden ausgebaut, nicht erfunden.
