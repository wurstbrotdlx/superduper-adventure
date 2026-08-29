# DT: Das eine Skript wird sieben Dateien

Stand 29.08.2026. Anlass war ein Architekturdurchgang mit einer einfachen Frage:
trägt die Einzeldatei-Bauweise noch? Die Antwort war zweimal ja und einmal nein.
Ja für die Auslieferung (eine Datei, ein Link, kein Build), ja für die Prüfkultur
(das geprüfte Ding ist das ausgelieferte Ding), nein für die Arbeit daran: jede
Änderung fasst dieselbe Datei an, und zwei Stränge nebeneinander kollidieren
fast sicher. Diese Phase zieht die Trennung ein, ohne die beiden Ja aufzugeben.

Nichts ist umgezogen, nichts umbenannt, nichts umgeschrieben. Der Schnitt ist
mechanisch, und das ist nachgewiesen (s. **Der Beweis**).

## Was jetzt wo liegt

`index.html` behält HTML und CSS (2646 Zeilen) und lädt am Ende sieben klassische
Skriptdateien. Der `<script>`-Block, der dort bis heute stand, ist weg; sein
Inhalt liegt unverändert in `skript/`.

| Datei | Zeilen | Inhalt |
|---|---:|---|
| `skript/01-grafik-und-klang.js` | 2355 | Maßstab, Sprite-Engine, Held und Garderobe, Rigs, Deko, Innenraumblätter, Porträts, Audio, Welt-Startwert. Hier steht auch der `ASSET_BLOBS`-Marker. |
| `skript/02-dorf-und-welt.js` | 2592 | Dorffiguren, Böden und Kacheln, Chunk-Cache, Koppel und Steinbruch |
| `skript/03-akten-und-katalog.js` | 2374 | Zutaten, Zulagen-Katalog, Aktenfunde, Vorgangsbestand, Befähigungszahlen, Touch-Zustand, Monsterkatalog |
| `skript/04-magie-und-zulagen.js` | 2085 | Zauberbefugnis, Zulagen-Maschine, Angriffe mit Vorwarnung, Kammern mit Preisschild, Knöterich |
| `skript/05-buehne-und-kammern.js` | 2782 | Die zweite Bühne, Stopfen, Türen und Kammern, Innenräume, Rätselmodule, Aktionen |
| `skript/06-gespraech-dienst-und-szenen.js` | 10640 | Gesprächsfenster, `update()` und `frameNo`, Dienst und Spielstand, Rang, Anrede, Vorgang, Brett, Langvorgänge, Anfang, Empfang, Szenen und Gesprächsbäume |
| `skript/07-tafeln-und-start.js` | 2228 | Anrisstafeln, Dienstgestalt, Wiedereinsetzung, Steuerung, `loop()`, UI-Skin, Ladekette |

Zusammen 25.056 Zeilen, genau die Zeilen 2640 bis 27695 der alten `index.html`.

**Die Reihenfolge der Tags ist Programmtext.** Klassische Skriptdateien teilen
sich eine globale lexikalische Umgebung; `const` aus Datei 01 steht in Datei 07,
aber nur, weil 01 vorher lief. Wer die Tags umsortiert oder eine Datei
dazwischenhängt, ändert das Programm. Deshalb kein `type="module"` (eigene
Scopes, das wäre ein Umbau statt eines Schnitts) und kein `defer`.

`'use strict'` gilt pro Datei, nicht pro Seite. Jede Datei ab 02 trägt es
deshalb erneut im Kopf; in 01 ist es die erste Zeile des Schnitts selbst.

## Warum Datei 6 aus der Reihe fällt

Sie ist mit 10.640 Zeilen viermal so groß wie ihre Nachbarn, und das ist kein
Versäumnis, sondern gemessen. `gespraechAssert()` ruft sich auf Skriptebene
selbst auf und liest dabei `baumFaellig()`. Der Aufruf steht in der alten
Zählung bei Zeile 14938, die Funktion bei 25415. In **einem** Skript trug die
Funktionshochziehung das über zehntausend Zeilen hinweg; über Dateigrenzen
hinweg trägt sie nicht mehr, denn Datei 07 hat noch nicht gelaufen, wenn Datei
06 ihre Guards ausführt.

Jeder Schnitt zwischen diesen beiden Stellen macht das Spiel kaputt. Also gibt
es dort keinen. Das ist die eigentliche Grenze dieser Phase, und sie ist
benennbar: **eine einzige Abhängigkeit hält 42 Prozent des Codes zusammen.** Wer
Datei 6 weiter teilen will, löst zuerst diese Abhängigkeit auf und sucht dann
die Kante, nicht umgekehrt.

Dasselbe in klein bei `bauPlatten` (benutzt bei 12507, deklariert bei 14266) und
bei `STOPFEN`; beide liegen jetzt innerhalb einer Datei.

## Die Kanten sind gemessen, nicht ausgesucht

Der erste Anlauf schnitt an sieben schön gelegenen Abschnittsbannern und lief
sofort in vier `ReferenceError`. Danach ist jede Kante einzeln geprüft worden:
Zweiteilung an genau dieser Zeile, Seite im Browser laden, auf `pageerror`
sehen. Eine Kante ohne `pageerror` ist sauber, und sie bleibt es auch in einer
Teilung mit mehreren Schnitten — ein Verweis, der die Kante nicht kreuzt, kreuzt
sie auch neben anderen Schnitten nicht.

| Kante | Ergebnis |
|---|---|
| 4995, 7587, 9961, 12046 | sauber |
| 14259 | kreuzt (`bauPlatten`, `STOPFEN`) |
| 14557, 14828 | sauber |
| 17959 | kreuzt (`baumFaellig`) |
| 22512 | kreuzt (`baumFaellig`) |
| 25468, 26065, 26938 | sauber |

Genommen sind 4995, 7587, 9961, 12046, 14828, 25468. Die drei übrigen sauberen
Kanten (14557, 26065, 26938) hätten nur Splitter von wenigen hundert Zeilen
ergeben und sind liegengeblieben; wer sie braucht, kann sie ziehen, sie sind
geprüft.

## Der Beweis

Zweimal, weil das eine das andere nicht sieht.

**Byte-Gleichheit.** Die sieben Dateien ohne ihre Köpfe, aneinandergehängt,
gegen die Zeilen 2640 bis 27695 der alten `index.html`: `cmp` schweigt, 25.056
Zeilen. Der Schnitt hat kein Zeichen angefasst. Die Kopfzeilen sind an der
Sentinel-Zeile `// --- Ab hier unveraendert ... ---` maschinell abtrennbar,
genau dafür steht sie da.

**Laufzeit-Gleichheit.** Byte-Gleichheit beweist nur, dass der Text derselbe
ist, nicht dass er sich gleich verhält — die Hochziehungsgrenze oben ist genau
so ein Fall. Also ein zweiter Nachweis: Konsolentranskript der Seite vor und
nach der Teilung, gefiltert um die Sprite-Warnungen (ihre Reihenfolge ist ohne
Grafik Netz-Timing und wechselt zwischen zwei Läufen derselben Datei). Vorher
wie nachher 799 Zeilen, die Guard-Meldungen in identischer Reihenfolge, das
ganze Transkript als Multimenge identisch, kein `pageerror`. `frameNo` läuft
(479 nach acht Sekunden). Dasselbe gilt für die gebaute `dist/index.html`.

## Was der Build jetzt tut

`tools/build-single.mjs` backt weiter genau eine Datei, nur mit einem Schritt
davor: es liest die `script src`-Tags aus `index.html`, hängt die genannten
Dateien in **dieser** Reihenfolge aneinander und setzt sie als einen Block ein.
Die Reihenfolge kommt aus der `index.html` und nicht aus einem `sort()` über das
Verzeichnis — sonst stünden zwei Wahrheiten nebeneinander, und die Dateinamen
wären plötzlich Programmtext.

Die wiederholten `'use strict'`-Zeilen bleiben stehen. Nach der ersten sind sie
wirkungslose String-Literale, und der Build bleibt damit eine stumpfe
Verkettung statt einer Umformung, die man falsch bauen kann.

Zwei neue Abbrüche: verstreute `script src`-Tags außerhalb des zusammenhängenden
Laufs (die wären stillschweigend nicht eingebacken und zeigten in `dist/` ins
Leere), und ein schließendes `script`-Tag im Text einer Skriptdatei, auch im
Kommentar (im gemeinsamen Block beendet es den Block mitten im Satz, die Seite
lädt, und der Rest des Spiels steht als Text im Dokument). Aus demselben Grund
umschreiben die Dateiköpfe das Wort, statt es in spitze Klammern zu setzen.

`.github/workflows/pages.yml` bleibt unverändert. Das Pages-Artefakt ist
weiterhin `dist/` allein, und es ist selbsttragend, gerade weil der Build die
Teile einbackt.

## Werkzeuge, die den Quelltext lesen

Drei lesen das Skript als Text und nicht über den Browser. Sie sind mitgezogen:

- `tools/wasser-messlauf.mjs` schrieb den Welt-Startwert in der Antwort der
  Seite um und brach ab, wenn das Literal nicht genau einmal vorkam. Es kommt
  in `index.html` **zweimal** vor: der Aufruf und ein Kommentar weiter unten,
  der ihn zitiert. Der Riegel hätte also schon vor dieser Phase abgebrochen —
  ein Fund nebenbei. Die Teilung trennt beide (Aufruf in 01, Kommentar in 06),
  und der Lauf hängt jetzt an `skript/01`. Auf der gebackenen Datei stehen sie
  wieder zusammen; dieser Lauf gehört auf die Quelle.
- `tools/portraet-farben.py` und `tools/zulagen-bild.py` lesen ihre Tabellen
  jetzt aus allen `skript/*.js` verkettet statt aus `index.html`. Bewusst alle
  und nicht die eine Datei, in der die Tabelle heute steht: welche das ist, ist
  eine Schnittfrage und keine Zusage. Beide liefern dasselbe wie vorher
  (16 Figuren, 15 Zulagenfamilien, gegen `HEAD` gegengelesen).

Für die übrigen rund vierzig Werkzeuge ändert sich nichts: sie fahren die Seite
über `http://127.0.0.1:8378/index.html`, und für sie ist die Teilung unsichtbar.

## Kein Punkt in der Hausmitteilung, und das ist Absicht

Die Regel lautet, dass jeder Bauabschnitt einen Punkt in `NEUERUNGEN` bekommt.
Dieser hier bekommt keinen, und der Grund steht hier, damit die Auslassung
begründet ist statt stillschweigend: DT ändert kein Wort, keine Zahl und kein
Bild des Spiels. Wer spielt, sieht dieselbe Seite wie vorher, und ein Punkt
namens „das Skript liegt jetzt in sieben Dateien" wäre eine Mitteilung an
niemanden. Die Hausmitteilung gehört den Spielern, nicht der Werkbank.

Das ist ausdrücklich keine Regel für Fehlerbehebungen: `KAMMERAUSGANG-2026-08-27.md`
hat eine weggelassene Zeile am selben Tag nachgetragen, weil der Fehler sichtbar
war und wer ihn gesehen hat lesen können soll, dass er weg ist. Sichtbar ist das
Kriterium, nicht die Größe der Änderung.

## Was das kostet

Eine neue Fehlerklasse, die es vorher nicht gab: eine falsche Ladereihenfolge.
Sie ist leise, wenn man sie nicht sucht, und der Browser sagt dazu nur
`ReferenceError`. Deshalb kommt der Ladelauf aus DT2 im selben Zug — er ist der
Prüfer für genau diese Klasse und läuft bei jedem Push.
