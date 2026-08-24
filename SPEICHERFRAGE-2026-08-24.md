# Gezielte Speicherung: erst die Vermessung, dann die Möglichkeiten — 24.08.2026

Entstanden aus der Frage: *„Was für Möglichkeiten der gezielten Speicherung
könnten wir umsetzen?"*

Die Antwort beginnt nicht bei den Möglichkeiten, sondern bei der Ablage, die es
schon gibt — denn die Vermessung hat zwei Funde ergeben, die keine Möglichkeiten
sind, sondern Reparaturen, und einer davon ist browser-gemessen: er kostet einem
Bestandsspielstand im schlimmsten Fall den Gegenspieler des Hauptvorgangs, für
immer.

Wie jeder datierte Bericht in diesem Repo ist das ein **Stand, kein Wegweiser**.
Nichts davon ist gebaut, nichts davon ist beschlossen. Nur das Prüfprotokoll
unten ist gelaufen.

---

## Kurz vorweg

| Vorschlag | Befund |
|---|---|
| **Vorher aber: zwei Funde** | `amt.stopfenSchicht` und `amt.adressSchicht` werden gespeichert und **nie geladen** — der nächste `saveAmt()` nach einem Neuladen überschreibt sie mit 0 (gemessen, siehe Protokoll). Und der Übertrag zwischen zwei Schichten ist eine Laufzeitvariable: wer zwischen Dienstbericht und Antritt den Browser schließt, verliert Gürtelgold und Kontingent, obwohl der Bericht „mitgenommen" druckt. |
| **Export und Import (Gerätewechsel, Sicherung)** | Die stärkste echte Möglichkeit: die **beglaubigte Abschrift** der drei Akten. Der Import validiert nicht selbst, sondern schreibt die Schlüssel und lädt die Seite neu — die vorhandenen Whitelists und beidseitigen Klemmen bleiben die eine Klemmstelle. |
| **Gezieltes Löschen (Neuanfang)** | Heute nur mit der Entwicklerkonsole möglich; im ganzen Skript steht kein `removeItem`. Kleiner Baustein, gehört zur Abschrift in einen Abschnitt. |
| **Die laufende Schicht speichern** | Die Schicht ist absichtlich flüchtig, und die Welt selbst wird je Sitzung neu gewürfelt (`genMap()` läuft ungeseedet). Die volle Konserve wäre ein Systembau. Gangbar ist eine enge **Wiedervorlage nur im Dorf**, als Einmal-Konserve nach dem Muster von `amt.wiedereinsetzung`. |
| **Mehrere Spielstände** | Registratur mit Aktenzeichen-Präfix; mittlerer Aufwand (zehn Zugriffsstellen durch eine Ablagefunktion). Erst auf Nachfrage. |

---

## 1. Der Bestand: drei Akten, zwei Bildschirmwerte, eine bewusste Lücke

### 1.1 Was die Ablage heute führt

| Schlüssel | Inhalt | geschrieben |
|---|---|---|
| `sda_amt_v1` | Amtsvermögen und Aktenvorgänge: `bankGold`, `schichten`, `ausbauten`, fünf Boni, `brett`, `auftrag`, `gestalt`, `wiederZahl`, `wiedereinsetzung` — und die zwei Zeitstempel aus Fund 1 | bei jeder Entscheidung: Schichtende, Ausbau, Antrag, Stopfen, Adresszeile |
| `sda_kladde_v1` | das Wissen: `crafts`, beobachtete Zusammenhänge, Aktenfunde (`blaetter`), der Vorgang (`vorgang`), die Langvorgänge (`lang`) | sofort beim Kochen und bei jedem Fund |
| `sda_knoeterich_v1` | das Gedächtnis: `seen`, `pending`, Zähler, `flags` (Szenen- und Baummerker), `wissensluecke`, `beats`, `regler`, `history` | bei Dienstzetteln, Szenenenden, Schichtende |

Daneben zwei **Bildschirmwerte**, `sda_targetPriority` und `sda_schrift`, und die
Trennung ist im Code bereits ausformuliert: *„er beschreibt den Bildschirm, an
dem gespielt wird, nicht die Laufbahn der Person des Tages."* Diese Trennung
trägt weiter unten das halbe Export-Design.

Geladen wird nach einem Muster, das sich das Haus über GW3, GW26b, P1 und W10
erarbeitet hat: **Feld-Whitelist, strukturell geprüft, beidseitig geklemmt,
additiv** — ein alter oder von Hand manipulierter Stand lädt ohne Fehler, ein
unbekanntes Feld räumt der nächste Save von selbst weg. Alle zehn
Zugriffsstellen stehen in `try{…}catch(_){}`: die Ablage darf scheitern, das
Spiel merkt es nicht (dazu Möglichkeit 4.3). Und wo es geht, wird abgeleitet
statt gespeichert: `aktStand()` und `rangStufe()` sind Eigenschaften der Zahl
`amt.schichten`, „kein neues amt-Feld, keine loadAmt()-Ladezeile, keine zweite
Wahrheitsquelle."

### 1.2 Die bewusste Lücke

Die laufende Schicht wird nirgends gespeichert, und das ist System: `startShift()`
baut Spieler, Feld und Uhr komplett neu, die Kladde begründet es selbst —
*„in Phase 4 ist Wissen der eigentliche Fortschritt."* Dazu kommt etwas, das man
leicht übersieht: **die Welt wird je Sitzung gewürfelt.** `genMap()` läuft
ungeseedet einmal beim Skriptstart; fest stehen Bänder und Dorf, neu fallen
Bäume, Deko und Bestückung. Der F1-Nachtrag heißt nicht zufällig „Prüfwerkzeuge,
die die Welt von gestern maßen" — die Welt von gestern gibt es wörtlich nicht
mehr. Jede Idee von Schichtkonserve muss daran vorbei.

Das gebaute Continue ist die **Wiedereinsetzung** (W10), und sie ist mit Absicht
eng: Stufe halbiert plus Gesicht, gegen Gebühr, als Aktenvorgang persistiert.
W10 hat dabei den Satz aufgeschrieben, an dem sich Fund 2 messen lassen muss:
*„Ein bewilligter Antrag ist ein Aktenvorgang, und Aktenvorgänge überleben die
Nacht."*

---

## 2. Fund 1 (browser-gemessen): zwei Zeitstempel, gespeichert und nie geladen

`amt.stopfenSchicht` und `amt.adressSchicht` (SZ3) tragen, wann der Stopfen
gezogen wurde und wann die vierte Adresszeile kam. Ihr eigener Kommentar sagt:
*„Echter Zustand, nicht ableitbar: welche Schicht es war, weiss danach niemand
mehr."* Der Satz ist wahrer als gemeint. `saveAmt()` schreibt beide in die
Ablage — aber die Feld-Whitelist von `loadAmt()` hat für sie keine Zeile. Nach
einem Neuladen stehen beide auf 0, und der nächste `saveAmt()` (jedes
Schichtende ist einer) **überschreibt die gespeicherten Werte mit 0**. Genau der
Mechanismus, den GW26b als Aufräumhilfe beschreibt („ein alter Stand mit dem
Feld wird schlicht nicht mehr gelesen; saveAmt() schreibt amt komplett neu"),
frisst hier zwei Felder, die leben sollten.

Gemessen am 24.08.2026, frische Sitzung, Werte gesetzt wie es
`stopfenGezogenEnde()` und der Adresszeilenfund tun, `bankGold` als
Kontrollfeld daneben:

| Messschritt | `stopfenSchicht` | `adressSchicht` | `bankGold` |
|---|---|---|---|
| gesetzt, `saveAmt()`, Ablage gelesen | 7 | 9 | 123 |
| Seite neu geladen — Ablage | 7 | 9 | 123 |
| Seite neu geladen — im Spiel | **0** | **0** | 123 |
| `vorblattFaellig()` bei `schichten = 40` (Akt IV) | **false** | | |
| nächster `saveAmt()` — Ablage | **0** | **0** | 123 |

Die Folgen, in drei Stufen:

1. **Immer** (jeder Neustart nach dem Stopfen): der Postregen endet mit der
   Sitzung statt nach `POSTREGEN_SCHICHTEN = 3`, und die Kapsel im Abspann
   fehlt — das Zustellungs-Panel liest `amt.stopfenSchicht` direkt. Der
   SZ4-Commit verspricht „Die Kapsel aus dem Rohr liegt im Finale nur, wenn SZ3
   gespielt wurde"; nach einem Neuladen liegt sie auch dann nicht.
2. **Im Fenster zwischen Stopfen (bzw. vierter Adresszeile) und Szene 6:** beide
   Wege in `vorblattFaellig()` sind tot, und beide Setzer sind verbrauchte
   Einmalpfade — `stopfenGezogenEnde()` läuft nie wieder (der Strang ist fertig,
   `langFertig('stopfen')`, Kladde), `findeAdresszeile(4)` gibt nie wieder true
   (`kladde.vorgang`, Kladde). Szene 6 wird nie fällig, `kn.flags.szeneVorblatt`
   bleibt false, **Vorblatt steht nie im Dorf** (`daWenn`), und die Versuchung
   (Szene 7) prüft genau diesen Merker und läuft nie. Das Fenster ist mindestens
   `SZENE6_ABSTAND = 2` Schichten zu je 25 Minuten (`schichtDauer: 1500`) — wer
   je Abend eine Schicht spielt, schließt den Browser mit Sicherheit darin.
3. **Nicht betroffen:** Serie I fällt weiter (`blattFaelltAusRohr()` liest
   `stopfenGezogen()` und damit die Kladde, nicht den Stempel), `szeneStopfen`
   selbst liegt in `kn`, der Strang in der Kladde.

Dass es nie aufgefallen ist, hat denselben Grund wie bei den fünf unsichtbaren
Dorffiguren aus G6: kein Prüfer sieht den Weg. Die Guards prüfen Zusagen im
laufenden Skript; den Rundweg Ablage → `loadAmt()` → Spiel misst keiner. In
einer Prüfschleife, die die Seite einmal lädt und die Konsole liest, ist dieser
Fehler unsichtbar — er braucht zwei Ladevorgänge.

**Reparatur:** zwei Ladezeilen in der Whitelist, beidseitig geklemmt nach der
GW3/W10-Lehre (0 heißt „nie", der Deckel ist eine Zusage weit über allem
Erreichbaren), plus ein Prüfabschnitt. Offen bleibt eine **Migrationsfrage** für
Bestandsakten, deren Stempel schon zu 0 überschrieben sind: heilbar wäre es
über die Kladde (`langFertig('stopfen')` bzw. `kladde.vorgang[4]` gesetzt, aber
Stempel 0 → Stempel auf `amt.schichten + 1` setzen). Vorblatt käme dann zwei
Schichten nach dem nächsten Antritt statt nach dem echten Stopfen — später als
erzählt, aber er käme. Ohne diese Entscheidung bleibt jeder Bestand, der im
Fenster geschlossen wurde, dauerhaft ohne Gegenspieler.

---

## 3. Fund 2: der Übertrag ist keine Akte

`pendingCarryGold` und `pendingCarryPouch` sind Laufzeitvariablen
(„Laufzeitzustand der aktuellen Schicht"), `startGame()` nullt sie bei jedem
Seitenaufruf, verbraucht werden sie erst in `startShift()`. Der Weg vom
Feierabend dorthin ist aber lang: Dienstbericht → WEITER → `nachSchicht()` →
Jahresgespräch (jede zehnte Schicht) oder `showDorf()` → Ausbauten → Antritt.
Das Dorf zwischen den Schichten ist genau der Bildschirm, auf dem ein Abend
endet — und wer dort schließt, verliert den Übertrag vollständig.

Der Widerspruch steht im Haus selbst, zweimal. W10 hat den bewilligten Antrag
genau deshalb persistiert: *„ein Neuladen zwischen Dienstbericht und nächster
Schicht dürfte den bezahlten Antrag nicht verschlucken."* Für den Übertrag im
selben Panel gilt derselbe Satz — nur eingelöst ist er nicht. Und der
Dienstbericht druckt „X mitgenommen": mitgenommen in eine Variable, die die
Nacht nicht überlebt.

Die Größenordnung ist keine Fußnote. Der Gürtel trägt die Hälfte der
Bruttobeute, und im eingeschwungenen Zustand gilt `carry = beute`
(`KAMMER-MESSUNG-2026-08-20.md`, Abschnitt 4): der Gürtel trägt eine **volle
Schichtbeute**. Aus den gemessenen Kassenzuflüssen (1190 bzw. 1690 Gold je
Schicht, seit der Drittelung 0,6 der Beute) überschlagen: **2000 bis 2800 Gold**
in den Kammer-Spielweisen — mehr als der halbe Vollausbau des Dorfes (3850).
Dazu das Zutatenkontingent (5 + 2 je Ausbaustufe), nach Seltenheit absteigend
gefüllt: es sind ausdrücklich die wertvollsten Stücke der Schicht.

Ein Randstück derselben Stelle: das Feierabend-Panel ist auch der einzige Ort,
an dem der Antrag auf Wiedereinsetzung gestellt werden kann (`wiederBlockHtml()`
hängt nur dort). Wer dort schließt, hat die Gelegenheit verwirkt — der bewilligte
Antrag überlebt die Nacht, die Gelegenheit nicht. Das kann Absicht sein, eine
Fristsache ist gut amtlich; dann sollte das Panel es sagen. Heute sagt es nichts.

**Reparatur:** `amt.uebertrag = {gold, zutaten}` — geschrieben in `endShift()`
(nach der Kappung, es ist der schon abgerechnete Übertrag), verbraucht in
`startShift()` nach der Bauform von `amt.wiedereinsetzung` („löst ihn ein und
leert ihn im selben Zug"), `startGame()` nullt dann keine Variablen mehr.
Whitelist-Zeile, Klemme, Prüfabschnitt. Klein.

---

## 4. Die Möglichkeiten

### 4.1 Die beglaubigte Abschrift (Export und Import) — die eigentliche Antwort

Die Ablage ist kündbar: Browserdaten löschen nimmt alles mit, ein Gerätewechsel
nimmt nichts mit, und Safari räumt skriptbeschreibbaren Speicher nach sieben
Tagen ohne Besuch von selbst. Für ein Spiel, dessen „eigentlicher Fortschritt
Wissen" ist, ist das der einzige Totalverlustkanal — und kein Guard kann ihn
sehen, weil er außerhalb des Skripts liegt. Gezielte Speicherung heißt hier
wörtlich: der eine Moment, in dem der **Spieler** speichert, statt dass das
Spiel es tut.

Bauform: ein Knopf im Einstellungsvordruck (der Ort existiert und ist aus
Szene, Startbild und Amt erreichbar). **Export:** ein JSON mit Versionszeile
und den drei Akten, als Datei (Blob-Download, geht auch im file://-Build) und
als Textblock zum Kopieren fürs Telefon. **Import:** Formprüfung nur auf
Gestalt (JSON, bekannte Schlüssel), dann die drei Schlüssel schreiben und
`location.reload()`. Der Punkt daran: der Import validiert nicht selbst. Die
vorhandenen Whitelists mit ihren beidseitigen Klemmen bleiben die **eine
Klemmstelle** — die W10-Lehre wörtlich genommen: was nicht am Loader
vorbeikommt, kommt auch als Import nicht an ihm vorbei. Kein zweiter Parser,
keine zweite Wahrheit, kein neuer Speicherschlüssel.

Was draußen bleibt: die Bildschirmwerte (die Abschrift ist die Akte, nicht der
Bildschirm — die Trennung steht schon im Code) und die laufende Schicht (die
Abschrift ist die Akte, nicht der Tag). Und sie ist **gebührenfrei**. Der Humor
gehört in den Stempeltext, nicht in den Preis: eine Spielgold-Gebühr auf eine
reale Datensicherung bestrafte den Spieler dafür, vorsichtig zu sein — das wäre
der Zynismus, den Grundgesetz 8 verbietet.

Aufwand: klein bis mittel. Ein Panel, zwei Wege, keine neue Speicherform.

### 4.2 Die Aktenvernichtung

Heute führt kein Weg im Spiel zu einem Neuanfang; im ganzen Skript steht kein
`removeItem`, wer neu anfangen will, braucht die Entwicklerkonsole. Ein
„Antrag auf Vernichtung der Personalakte" im selben Vordruck, zweistufige
Rückfrage (die zweite Stufe darf der Witz sein: auch die Vernichtung braucht
einen Vordruck), löscht die drei Akten und lässt die Bildschirmwerte stehen.
Reihenfolge als Fürsorge: erst die Abschrift anbieten, dann vernichten.
Winzig, und gehört mit 4.1 und 4.3 in einen Bauabschnitt.

### 4.3 Die Ablage-Meldung

Alle zehn Zugriffe schlucken ihr Scheitern. Im Privatmodus spielt man
wochenlang, verliert beim Schließen alles, und keine Zeile hat es je gesagt.
Eine Prüfzeile beim Start (Testschreiben auf einen Wegwerfschlüssel), und wenn
sie scheitert, genau eine Meldung — in der Konsole für die Abnahme, im
Startbild für den Spieler: „Die Registratur nimmt heute nichts an. Gespielt
wird trotzdem." Sie stünde nur, wenn es stimmt, und wäre damit keine Tapete —
das ist die G6-Lehre, auf die Ablage angewandt. Winzig.

### 4.4 Die Registratur (mehrere Akten)

Zielgruppe 10 bis 99 heißt am Küchentisch: zwei Geschwister, ein Gerät, eine
Akte. Bauform: ein Aktenzeichen-Präfix vor den drei Schlüsseln, alle zehn
Zugriffsstellen durch eine Ablagefunktion, Wahl am Startbild, die Bestandsakte
wird Aktenzeichen 1. Die Weltfrage ist klein: mehrere Außendienstler waren
immer wahr („Der nächste Trupp übernimmt"), und „Persönliche Qualifikation ist
nicht übertragbar" gilt je Akte erst recht. Mittlerer Aufwand — und erst nötig,
wenn jemand danach fragt.

### 4.5 Die Wiedervorlage (die Schicht unterbrechen) — die ehrliche Vermessung

Die Not ist real: 1500 Sekunden je Schicht plus Überstunden, und auf dem
Telefon wirft der Browser Hintergrund-Tabs weg. Ein Anruf in Minute 20 kostet
heute die ganze Schicht — ohne Feierabend, ohne Bericht, ohne Bankzufluss; die
Schicht hat dann nie stattgefunden (nur Kladde und Zettel überleben, die
speichern sich selbst).

Die volle Konserve ist trotzdem ein Systembau, kein Anbau: Spieler samt
Affixen und Flüchen, Feld (Monster, Drops, Truhen), Kammerinneres, Uhr,
Auftragsstand, `langSchicht` — und die Karte selbst, denn die wird je Sitzung
neu gewürfelt. Entweder die Karte wird mitkonserviert oder `genMap()` bekommt
einen gespeicherten Seed; beides ist ein eigener Bauabschnitt mit eigenem
Guard.

Der gangbare Schnitt ist enger: **Wiedervorlage nur im Dorf.** Auf Wunsch wird
der Dienststand im weiten Sinn (Stufe, XP, Trefferpunkte, Mana, Skill- und
Zauberpunkte, gelernte Zauber, Taschen, Ausrüstung samt Affixen und Flüchen,
Gold, Tränke, Uhr, Auftragsstand) als **Einmal-Konserve** in die Akte
geschrieben und beim nächsten Start verbraucht — Bauform `amt.wiedereinsetzung`,
eingelöst und geleert im selben Zug; das Feld wird neu gestellt wie bei jedem
Antritt. Nichts Offenes lässt sich einfrieren, vor keiner Truhe, vor keinem
Wurf: kein Save-Scumming. Der Name ist geschenkt — die Wiedervorlage ist der
Amtsbegriff dafür, dass eine Akte morgen wieder auf dem Tisch liegt. Die
Weltfrage muss ehrlich beantwortet werden (die Schicht ist ein Tag, Kapitel 5):
die Wiedervorlage unterbricht nicht den Tag, sie unterbricht das Spielen des
Tages, und die Uhr steht. Teuerste Stelle ist die Ausrüstungs-Serialisierung:
alles, was aus der Ablage kommt, wird gegen die Tabellen geprüft und beidseitig
geklemmt — die P1-Lehre, „gegen die Tabelle geprüft, nicht nur auf Typ".
Mittel bis groß.

---

## 5. Rangfolge

1. **Fund 1 reparieren.** Zwei Ladezeilen, Klemmen, Prüfabschnitt — und die
   Migrationsfrage entscheiden. Vor allem anderen: jeder Tag ohne die Zeilen
   produziert weitere Bestände ohne Gegenspieler.
2. **Fund 2 reparieren.** `amt.uebertrag`, klein. Dabei entscheiden, ob die
   Antragsgelegenheit eine Fristsache ist; wenn ja, sagt das Panel es.
3. **Ein Bauabschnitt „Die Registratur":** Abschrift + Vernichtung +
   Ablage-Meldung (4.1 bis 4.3). Danach gibt es gezielte Speicherung wörtlich:
   sichern, übertragen, vernichten — alles auf Antrag des Spielers, alles über
   die vorhandenen Loader.
4. **Die Wiedervorlage** in der Dorf-Fassung, wenn die Telefonspielzeit sie
   verlangt — die 25 Minuten sprechen dafür.
5. **Mehrfachakten** zuletzt, auf Nachfrage.

---

## Prüfprotokoll (Fund 1)

Websitzung vom 24.08.2026, Grafik aus `superduper-adventure-assets` nach
`assets/cf/` kopiert, `python3 serve.py`, Playwright-Chromium der Umgebung.
Ablauf: Seite laden, auf `frameNo > 0` warten (nicht auf `assetsReady`, siehe
README), dann in der Konsole `amt.stopfenSchicht = 7; amt.adressSchicht = 9;
amt.bankGold = 123; saveAmt();` — Ablage gelesen: `{stopfen: 7, adress: 9,
bank: 123}`. Seite neu geladen, wieder auf `frameNo > 0` gewartet: Ablage
unverändert `7/9/123`, im Spiel `amt.stopfenSchicht === 0`,
`amt.adressSchicht === 0`, `amt.bankGold === 123` (das Kontrollfeld beweist,
dass der Ladeweg selbst funktioniert). `vorblattFaellig()` bei
`amt.schichten = 40`: `false`. Ein weiterer `saveAmt()`: Ablage jetzt
`{stopfen: 0, adress: 0, bank: 123}` — der Wert ist zerstört, nicht nur
ignoriert. Keine Pageerrors, alle Guards still.
