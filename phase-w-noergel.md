## W-Nörgel: Nörgel und das Lager — ERLEDIGT

Vier Zeilen Figurentext, ein Merker im Spielstand und ein optionales Tabellenfeld. Kein
neuer Gegner, keine neue Quest, kein Zustellsystem, keine Zeile am Lager selbst geändert.

### Die offene Stelle

`phase-w-lager.md` hat sie unter „Bewusst offen" selbst benannt:

> **Nörgel weiß nichts davon.** Er ist die Grünhaut auf Probe im Amt, seine Leute stehen
> zwölf Kacheln östlich hinter einer Palisade, und im Spiel verbindet die beiden nichts.

Das Lager stand da und wartete, Nörgel stand im Dorf und beschwerte sich, und es gab
keinen Satz, der das eine mit dem anderen zu tun hatte. Gebaut ist jetzt genau dieser
Satz, viermal.

### Die Entscheidung: erst nach dem Lager, nicht immer

Die Frage aus dem Auftrag lautete, ob Nörgels neuer Text **immer** verfügbar sein soll
oder erst, **nachdem der Spieler das Lager gesehen hat**. Entschieden ist das Zweite.

Der Grund ist nicht nur der dramaturgische („er antwortet auf etwas, das der Spieler
mitbringt"), sondern ein handfester: **ungegattert wäre der Text eine Ortsbeschreibung.**
Ein Spieler, der nie im Grasland östlich war, bekäme von Nörgel vier Zeilen über eine
Palisade, die er nie gesehen hat. Das ist kein Figurentext mehr, das ist ein Reiseführer,
und es nimmt dem Lager seinen einzigen Effekt: dass man erst davorsteht und sich wundert,
warum niemand angreift. Gegattert dreht sich die Reihenfolge richtig herum: der Spieler
bringt die Frage mit, Nörgel hat die Antwort und wird nicht gefragt.

Der Preis ist bekannt und angenommen: wer nie am Lager war, sieht von diesem
Bauabschnitt nichts. Das ist derselbe Preis, den die fünf Probezeit-Hinweise aus W7 auch
zahlen.

### Welcher Merker, und warum nicht die anderen

Geprüft wurden die drei, die der Auftrag nennt, plus das Feld `anlass`:

| Kandidat | Warum nicht |
|---|---|
| `anlass` / `letzterAnlass` | **Verfällt.** Das Feld existiert bereits (Lott und Pahl), aber sein Schlüssel kommt aus `knRandnotiz()` und wird beim ersten Ansprechen wieder auf `null` gesetzt. Jeder Kritische Treffer, jeder Goldfund und jeder Stufenaufstieg auf dem Rückweg vom Lager würde ihn vorher überschreiben. Ein Spieler, der zwölf Kacheln weit läuft, hätte den Anlass mit hoher Wahrscheinlichkeit verloren, bevor er im Dorf ankommt. Für „war irgendwann einmal dort" ist ein Einweg-Anlass das falsche Gefäß. |
| `amt` | Ist der Dienststand (Schichten, Bankguthaben, Ausbauten, laufender Auftrag). Ein Ortsbesuch ist kein Dienststand, und `loadAmt()` ist eine Feld-Whitelist, jedes neue Feld kostet dort eine Zeile. |
| `kladde.lang` | Der Speicher der Langvorgänge, und damit die Frage, ob dies ein **achter Strang** werden soll. Nein, siehe unten. |
| **`kn.flags`** | **Genommen.** Steht schon für genau diese Sorte Wahrheit: `hatGezaubert`, `hatGekocht`, `hatKammerBetreten`, `hatGesteigert` — einmal im Leben wahr, danach für immer, todesimmun, schichtübergreifend. `hatLagerGesehen` ist die fünfte davon und liest sich neben `hatKammerBetreten` wie ein Zwilling. `loadKn()` macht `Object.assign` auf die Vorgabe: **ein alter Spielstand lädt ohne eine einzige Zeile Ladecode.** |

### Warum kein achter Langvorgang

Der naheliegende Weg wäre ein Eintrag in `LANGVORGAENGE` gewesen: das System kann genau
das, was hier gebraucht wird (`zusatz` hängt zusätzliche Grundzeilen an eine Figur, und
`fortschritt` liefert dazu eine einmalige Sprechblase im Moment der Freischaltung). Nörgels
fünf Probezeit-Hinweise laufen bereits so.

Er ist trotzdem nicht gegangen worden, und der Grund ist die Weltbibel: **Kapitel 10 zählt
die Langvorgänge abschließend auf, es sind sieben.** Ein achter wäre ein neuer Vorgang in
einer Tabelle, die dem Kanon gehört, für eine Aufgabe, die ausdrücklich Figurentext ist
und keine Quest. Die Weltbibel gewinnt, also gibt es keinen achten Strang.

Was dabei verloren geht, ist die einmalige Fortschrittszeile: der neue Text kündigt sich
nicht an, er steht ab dem Lagerbesuch im Kreislauf. Damit er nicht hinter den fünf
Probezeit-Hinweisen verschwindet, hängen die figureigenen Zeilen **vor** den
Langvorgang-Zeilen: wer beides freigeschaltet hat, sieht das Neuere zuerst.

### Der Eingriff, vollständig

Vier Stellen in `index.html`, zusammen rund dreißig Zeilen, davon acht Text.

1. **`kn.flags.hatLagerGesehen: false`** neben die vier bestehenden Merker. Kein
   Ladecode, `loadKn()` macht `Object.assign`.
2. **`knTick()` setzt ihn**, wenn der Spieler im Lager steht. Die anderen vier Merker
   sitzen an ihrem Ereignis (`drinkPotion`, Kessel, Kammertür); „war am Lager" hat kein
   Ereignis, weil Hingehen keins ist. Gemessen wird mit dem vorhandenen `imLager()`,
   nicht mit einem zweiten Rechteck — eine Wahrheitsquelle. Dessen Kachelrand ist dabei
   genau richtig: wer außen an der Palisade entlanggeht, war am Lager. Nach dem einen
   Mal kostet die Zeile nur noch die Boolean-Prüfung ganz vorn.
3. **`zusatz:[{merker, zeilen}]`** als neues optionales Feld in `DORF_FIGUREN`, benutzt
   von einer einzigen Figur. Der Merker steht als **Name**, nicht als Funktion: die
   Tabelle bleibt reine Daten, und der Guard kann nachsehen, ob es ihn gibt.
4. **`figZusatz()`**, sechs Zeilen, und ein geändertes Wort in `npcCycle()`. Alles
   Weitere (Modulo, Anrede, Aktzeile, Langvorgänge) bleibt unangetastet.

Dazu **`knAssertCaps()`**: das neue Feld wird mitgeprüft, Deckel wie überall (`z1` ≤ 48,
`z2` ≤ 32), plus der Merkername. Ein Tippfehler darin fiele sonst nirgends auf — die
Zeilen wären schlicht nie zu sehen, und genau diese stumme Figur ist der Fall, den der
Guard seit GW14 melden soll.

### Der Text, und warum er so klingt

| # | z1 | z2 |
|---|---|---|
| 1 | Hinter der Palisade stehen meine Leute. | Grünhaut. Wie ich. |
| 2 | Die belagern nichts. Die warten. | Seit vierhundert Jahren. |
| 3 | Die schreiben. Nur liest es hier keiner. | Ich könnte. Fragt ja niemand. |
| 4 | Gehen Sie wieder hin. Ohne zu schlagen. | Dann sehen Sie es selbst. |

Vier Zeilen, vier Aufgaben: **wer die sind** (1), **was sie tun** (2), **die Frage, die
niemand stellt** (3), **und zurück ans Tor** (4).

**Der Ton** ist an seinen bestehenden Zeilen abgenommen, nicht neu erfunden: kurze
Hauptsätze, der zweite Halbsatz nimmt dem ersten die Wucht („Ich trage eine Krawatte." /
„Fällt niemandem auf."). Zeile 3 ist nach demselben Muster gebaut wie seine Sprachmarke
aus Kapitel 8, „Das ist nicht meine Zuständigkeit." / „Ich mache es trotzdem." — Feststellung,
dann trockener Nachtritt. Kein Ausrufezeichen, kein Gedankenstrich, keine Erklärung.

**Zeile 2 ist die Antwort auf Lisbeth**, wörtlich und ohne sie zu nennen: ihre Sprachmarke
lautet „Und wenn er einfach nur wartet?", und Nörgel sagt, dass genau das der Fall ist.
Das ist die einzige Stelle im Spiel, an der jemand ihre Frage beantwortet.

**Zeile 3 ist die heikle**, und sie geht bis an den Rand und nicht darüber. Kapitel 8:
„Die Adresse ist nicht unleserlich. Sie ist in einer Schrift geschrieben, die nur jemand
aus Ablage V lesen kann. Nörgel kann sie lesen. Man muss ihn nur fragen. In vierhundert
Jahren hat niemand einen Goblin gefragt." Nörgel sagt hier: sie schreiben, hier liest es
keiner, ich könnte, es fragt nur niemand. Er sagt **nicht**, was dort steht, **nicht**,
dass er Trepps Umschlag meint, und **niemand kann ihn im Spiel danach fragen** — es gibt
keine Frage-Antwort-Maske für ihn, und das ist Absicht (der Code sagt an den
Probezeit-Hinweisen ausdrücklich: „Ausdrücklich KEIN zweites Frage-und-Antwort-System —
er braucht keinen Antrag"). Die Zustellung bleibt bei Trepp, der Adressat bleibt Fürst
Nachtrag, das Finale bleibt Akt V.

**Ein Entwurf ist gestrichen.** Zeile 3 lautete zuerst „Am Tor hängt Schrift. Ich kann
die lesen." Das ist gefallen, weil der Blick auf den Screenshot zeigt, was am Tor wirklich
hängt: zwei Banner ohne ein einziges Zeichen darauf. Der Satz hätte behauptet, was im Bild
nicht steht — derselbe Fehler, gegen den `dienstAssert()` seinen dritten Prüfpunkt hat.

**Die harten Grenzen sind eingehalten.** Kein Titel und kein Rang für das Lager oder seine
Bewohner (18.10, die eine Ausnahme trägt das Finale). Keine Übergabe, kein Dialog am Tor,
kein Empfangsberechtigter. Nörgel bleibt in der Probezeit, seine Entfristung kommt in
keiner der vier Zeilen vor.

### Prüfprotokoll

Live im Browser, nicht nachgerechnet. `python3 serve.py`, Chromium über Playwright,
gewartet auf `frameNo > 0` (nicht auf `assetsReady`, siehe README).

| Prüfung | Ergebnis |
|---|---|
| `python3 tools/monsterkatalog.py` | **28 Gegner, 0 Verletzungen**, Katalogdateien unverändert |
| Konsole im Quellbaum | **8 Guard-Zeilen, 0 Warnungen, 0 Fehler** |
| Konsole im Einzeldatei-Build (`file://`) | **8 Guard-Zeilen, 0 Warnungen, 0 Fehler** |
| `knAssertCaps()` | still, kein Zeichendeckel gerissen |
| `node --check` auf den Skriptblock | sauber |
| Grafikdateien | 118 |

**Der Gattertest**, ein Durchlauf, drei Feststellungen:

| Schritt | Feststellung |
|---|---|
| Frischer Dienst, vor dem Lager | `hatLagerGesehen` **false**; 11 Ansprachen ergeben **8 verschiedene** Zeilen (Anrede, 6 Grundzeilen, Aktzeile), davon **0** Lagerzeilen |
| Spieler steht im Lager | Merker **true**, und **im `localStorage` angekommen**; 6 Wachen im Bild, **0 davon aggressiv** |
| Zurück bei Nörgel, 14 Ansprachen | **4 von 4** neuen Zeilen im Bild, unmittelbar hinter den sechs Grundzeilen und vor der Aktzeile |
| Konsole während des ganzen Laufs | 0 Warnungen, 0 Fehler |

Derselbe Lauf **zweimal**: einmal gegen den Quellbaum über HTTP, einmal gegen
`dist/index.html` über `file://`. Gleiches Ergebnis, Zeile für Zeile.

**Der Guard wurde absichtlich zum Reden gebracht.** Ein Guard, der immer schweigt, beweist
nichts (Bauform `tools/monster-fehlversuch.mjs`). In einer verbogenen Kopie: ein `z1` auf
55 Zeichen verlängert, ein `z2` auf 37, und der Merkername zu `hatLagerGesehn`
verschrieben. Gemeldet wurden alle drei:

```
ERROR: Knöterich: Figur noergel nennt einen Merker, den es nicht gibt: hatLagerGesehn
ERROR: Knöterich: Zeichendeckel verletzt: "Die belagern hier ueberhaupt nichts, die warten nur ab." 55 > 48
ERROR: Knöterich: Zeichendeckel verletzt: "Seit vierhundert langen Jahren schon." 37 > 32
```

**Screenshots** (im Bauabschnitt entstanden, nicht im Repo — `assets/cf/*` und damit jeder
Bildschirmabzug mit Grafik darauf fällt unter die Lizenzgrenze aus `CREDITS.md`): das Lager
von innen mit sechs unbeteiligten Wachen, und je einer je neuer Zeile in der Sprechblase
über Nörgel.

### Zwei Fußnoten zum Bauzustand

- Dieser Bauabschnitt sitzt **auf `claude/grafik-durchgang-monstral-9mw2sy` auf**, nicht
  auf `main`: das Lager selbst steckt noch im offenen Entwurf `superduper-adventure#11`
  und ist nicht gemerged. Ohne es gäbe es hier nichts zu verbinden. Der Assets-Entwurf
  (`superduper-adventure-assets#2`) **ist** inzwischen gemerged, die neun Lagerblätter
  liegen also in `main` des Asset-Repos.
- Der Zweig kennt **U1 noch nicht** (Menü schließen, `phase-u1-menue.md`, auf `main`
  gemerged, nachdem dieser Zweig sein letztes Mal `main` gezogen hat). Das ist kein
  Konflikt mit diesem Bauabschnitt: U1 fasst Panels an, hier wird nur gesprochen.
  Beim Merge kommt U1 unverändert aus `main` mit.

### Bewusst offen

- **Der neue Text kündigt sich nicht an.** Ohne achten Langvorgang gibt es keine
  einmalige Sprechblase im Moment der Freischaltung; die vier Zeilen stehen ab dem
  Lagerbesuch einfach im Kreislauf und wollen erfragt werden. Wer Nörgel zweimal
  anspricht und weitergeht, sieht sie nicht. Mildernd: sie stehen vor den
  Probezeit-Hinweisen, also so früh im Kreislauf wie möglich. Wer das ändern will,
  braucht entweder Kapitel 10 der Weltbibel um einen Vorgang erweitert (dann ist die
  Fortschrittszeile geschenkt) oder eine Sonderregel im Zeiger, und beides ist größer
  als diese Aufgabe.
- **Keiner der anderen zehn Dorffiguren sagt etwas zum Lager.** Lisbeth wäre die
  nächstliegende — es ist ihre Frage, die dort beantwortet wird — und Trepp die zweite.
  Das Feld `zusatz` trägt beide ohne eine Zeile Code, es fehlt nur der Text. Bewusst
  nicht mitgebaut: der Auftrag hieß Nörgel.
- **Am Lager selbst ändert sich nichts.** Keine Übergabe, kein Dialog am Tor, kein
  Empfangsberechtigter. Unverändert die Absicht aus `phase-w-lager.md`: das Lager stellt
  die Frage und beantwortet sie nicht.
- **Der Merker greift auch außen an der Palisade.** `imLager()` zählt einen Kachelrand
  mit. Wer nur östlich vorbeiläuft, ohne durchs Tor zu gehen, schaltet Nörgels Zeilen
  frei. Das ist die billigere Wahrheit (eine Wahrheitsquelle statt zweier Rechtecke) und
  inhaltlich vertretbar: die Palisade ist von außen deutlicher als von innen.
