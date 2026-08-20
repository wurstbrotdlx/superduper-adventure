## M1: Der Monsterkatalog — ERLEDIGT

Bauabschnitt zum Monsterkatalog Stufe 1 bis 10. Die Lieferung selbst steht in
`monsterkatalog-stufe-1-10.md` (Rechenbasis, JSON, Selbstprüfung) und in
`monsterkatalog.json`. Dieses Dokument beschreibt den Einbau in `index.html`, die
Entscheidungen dahinter und das Prüfprotokoll.

Alle Bezeichner unten sind gegen den Stand nach dem Einbau geprüft. Zeilennummern stehen
bewusst keine da: such nach dem Bezeichner.

### Grundsatz: was diese Phase ist

Der Katalog gibt jedem Gegner eine **Ertragsklasse** (wie sich der Kampf auszahlt) und einen
oder zwei **Anforderungstypen** (was der Spieler können muss), und leitet daraus feste Werte
ab. Keine Levelskalierung, keine Zahl ohne Begründung, kein Angriff ohne sichtbare Vorwarnung,
kein Gegner ohne Konter.

### Grundsatz: was diese Phase nicht ist

Kein neues Sprite, kein neues Asset, kein Grafikbudget. Die zehn neuen Gegner benutzen Rigs
aus dem Bestand mit eigener Färbung, genau wie Frostgolem und Schattenling es immer schon
taten. Keine neue Währung, kein Statuseffekt-System mit Symbolleiste, keine Zahlen auf dem
Bildschirm außer denen, die es schon gab. Der Schattenfürst, der Alte Schrecken, die
Schattenhorde und der Frostkamm sind unverändert geblieben.

### Entscheidung: der Katalog liegt auf dem Bestiarium, er ersetzt es nicht

Der Auftrag nannte einen Katalog aus N Gegnern. Die naheliegende Lesart wäre gewesen, zwanzig
neue Monster neben die einundzwanzig bestehenden zu setzen. Dagegen sprach Kapitel 6 der
Weltbibel: dort haben alle einundzwanzig bereits eine Vorgangsart, und zwölf davon füllen eine
Katalogrolle so genau, dass ein zweites Monster daneben nur eine Dublette wäre. Der Skorpion
ist die Nachforderung, die kommt hinterher und sticht genau einmal: das **ist** eine
Glaskanone mit Folgeschlag.

Also: zwölf bestehende Typen haben gerechnete Werte bekommen und ihre Identität behalten, zehn
sind neu dazugekommen. Verschwunden ist keiner. `MONDEF` hat 31 statt 21 Einträge, 22 davon
tragen ein `kat`-Feld.

| Biom | Amtlich | Roster |
|---|---|---|
| Wald | Ablage A | Chuchu, Grünhaut, Wandelnder Ablagestapel, Waldschamane, Der Zustellbote |
| Sumpf | Die Nassablage | Blubberakte, Der Moorbescheid, Der Amtsschimmel, Der Fristläufer |
| Wüste | Der Brandabschnitt | Papierstaub-Skarabäus, Klippkrabbe, Sandskorpion, Dünenpriester |
| Höhle | Die Untere Registratur | Fledermaus, Höhlenspinne, Die Sammelmahnung, Irrlichtmagier, Steingolem |
| Ruine | Der Altbestand | Der Aktenbote, Mumie, Knochenritter, Die Sammelverfügung |

### Neue Technik in `index.html`

**Schadensarten und Resistenzen** (`SCHADENSART`, `monRes`, `hurtMon`). Der Nahkampf ist
physisch, die drei Zauberzweige tragen Feuer, Eis und Magie. `hurtMon()` rechnet den
Rohschaden gegen die Resistenz, und zwar **vor** dem Crit: sonst hinge die Wirkung einer
Resistenz an der Crit-Wahrscheinlichkeit statt am Gegner. Das Ultimate kennt keine Resistenz,
so wie es schon die Kammerregeln nicht kennt. Die Trefferzahl färbt sich selbst: stumpfes Grau
bei Resistenz, Grün bei Verwundbarkeit. Keine Tabelle im Spiel, kein Tooltip.

Gift steht in allen Resistenztabellen und wirkt trotzdem nur gegen den Spieler (Trankwirkung
sperren), weil er keine Giftquelle hat. Deshalb hängt keine einzige Weichstelle eines
Resistenz-Gates an Gift. `monsterAssert()` prüft genau das.

**Vorwarnung** (`angriffStarten`, `angriffAusloesen`, `musterWaehlen`). Ein Angriff läuft in
zwei Schritten: ausholen, dann treffen. Dazwischen steht das Monster still, und dazwischen kann
der Spieler weggehen. Der Takt hängt am Ausholen, nicht am Treffer, damit das
Angriffsintervall aus dem Katalog auch dann stimmt, wenn die Vorwarnung lang ist.

**Muster statt Sonderfälle.** Jeder Katalog-Gegner trägt eine Liste `muster`. Das erste ist der
Grundtreffer, die weiteren ersetzen ihn nach Takt (`jede:3`), nach Hinterhalt (`eroeffnung`)
oder nach einem gelandeten Treffer (`folge`). Ein Muster kennt `art` (nah, Kegel, Ring, fern,
stuetz, zu, mantel) und optional Wirkung auf den Spieler (`slow`, `halt`, `sperre`, `sicht`,
`zieht`, `stoesst`). Die Regel, die alles zusammenhält: **Sondermuster ersetzen den
Grundtreffer, sie kommen nicht obendrauf.**

**Zeitfenster** (`monsterFenster`). `offenT` heißt alle Resistenzen auf 0, `zuT` heißt
unverwundbar, `mantelT` hebt alles außer der Weichstelle auf 0,8, `ruheT` ist Erschöpfung nach
einem schweren Muster, `buffT` ist der Zuschlag eines Unterstützers. Alles davon wird gezeigt,
nicht erklärt: ein Ring, der sich füllt, ein gelber Ring am Boden, ein blasses Monster.

**Verhalten**: `hinterhalt` (lauert halb sichtbar, kleiner Aggroradius, doppelte Wucht auf den
ersten Treffer), `kiter` (zieht sich nach jedem Schlag zurück, kürzer als sein
Angriffsintervall), `fenster` (öffnet sich von selbst), `folge` (starre Schlagfolge mit Pause),
`folgeschlag` (zweite Nachforderung nur nach einem Treffer), `gleich` (alle gleichartigen
Nachbarn sagen denselben Schlag an).

### Fünf Biome: vier Bänder und eine Kammer

`BIOME_BANDS` hat statt drei jetzt fünf Einträge. Die Reihenfolge ist die Schwierigkeitskurve:
das Dorf liegt in der Mitte im Wald, und mit jedem Schritt nach Süden (Nassablage,
Brandabschnitt) oder nach Norden (Eisablage, Altbestand) steigt die Sollstufe.

`biomeAtT()` ist von einer Ternärkette auf eine Tabelle umgestellt (`BAND_VON_ZEILE`, aus
`BIOME_BANDS` gebaut). Fünf Bänder wären als Kette fünf Vergleiche gewesen, in einer Funktion,
die beim Kartenbau über 102400 Zellen läuft und zusätzlich im Frame-Pfad steht.

Sumpf und Altbestand haben wie der Frostkamm kein eigenes Tileset im Pack und entstehen als
eingefärbte Kopien (`TILE_TINT.sumpf`, `.moor`, `.ruine`). Die Tümpel im Sumpf sind derselbe
Kacheltyp wie die Eisteiche im Frostkamm; welche Farbe er bekommt, entscheidet das Band.

Die Untere Registratur ist kein Band, sondern die Kammer. Ihre fünf Typen stehen in keinem
Bandroster und sind nach dem Gebührenbescheid an der Tür gestaffelt: Stufe 1 und 2 bekommen
Umlauf und Querverweis, ab 3 kommen Mahnstufe und Fußnote dazu, die Bestandskraft erst bei 5.
Ohne diese Staffel stünde ein Steingolem mit 1220 Leben in einer Stufe-1-Kammer, und das Schild
vor der Tür wäre gelogen. Ein ehrliches Schild ist in dieser Welt eine kleine Sensation
(Weltbibel, Kapitel 3), das darf nicht der Katalog kaputt machen.

Die Loot-Signatur eines Bioms steckt im Adjektiv, nicht im Substantiv: alle 26 Einträge in
`ZUTAT_ADJ` haben Gewichte für `sumpf`, `hoehle` und `ruine` bekommen. `zutatBiome()` gibt in
der Kammer `hoehle` zurück statt des Bandes der Tür, und `rollKammerZutat()` würfelt das
Adjektiv ebenso. Damit ist die Kammer ein eigener Fundort, obwohl ihre Türen überall stehen.

### Korrektur an einem Guard: `anredeAssert()`

Dort stand „jedes Biom genau einmal" über alle `BIOME_BANDS`. Das war richtig, solange es genau
drei Bänder und genau drei Kammer-Adresszeilen gab, aber es meinte nie „alle Bänder": der
Hauptvorgang schickt den Spieler in **drei** Ablagen, nicht in jede. Mit fünf Bändern hätte der
Guard zwei Fehler gemeldet, die keine sind.

Geprüft wird jetzt ausgeschrieben, was gemeint war, und eine Spur mehr: drei verschiedene
Biome, jedes davon existiert, keines doppelt. Der Hauptvorgang selbst ist unverändert, Zeile 1
bis 3 stehen weiter in Eisablage, Ablage A und Brandabschnitt.

### Der achte Guard: `monsterAssert()`

Das Katalogdokument rechnet mit einer Abschrift der Spielformeln. Dieser Guard rechnet dieselbe
Probe mit den Formeln selbst: er sichert den Spielerzustand, setzt je Sollstufe die
Referenzausrüstung ein, ruft `recalc()`, misst, und stellt im `finally` alles zurück. Dieselbe
Spiegel-Technik wie in `auftragAssertBrett()` und `vorgangAssert()`.

Geprüft werden je Gegner mit `kat`-Feld: Kampfzeitband, XP je effektiver Kampfsekunde,
Gefahrenbudget, Mindestvorwarnung (350 ms bei A3 und A4), erreichbare Weichstelle, vorhandene
Zutat, vorhandene Muster. Wer `recalc()` ändert, sieht sofort, welche Gegner aus ihrem Band
gefallen sind, statt es im Kampf zu merken.

Der Guard wurde gegen zwei absichtlich eingebaute Fehler geprüft (doppelte Chuchu-Leben,
Vorwarnung des Golems auf 200 ms). Beide wurden gemeldet, danach zurückgebaut.

### Prüfprotokoll

| Prüfung | Werkzeug | Ergebnis |
|---|---|---|
| Syntax | `node --check` auf den extrahierten Skriptblock | ohne Befund |
| Die acht Guards | Chromium, Konsole beim Laden | still, nur die Weltform-Zeile und die Katalogzeile als Nachweis |
| Katalog gegen Rechenbasis | `tools/monsterkatalog.py` | 22 Gegner, 0 Verletzungen |
| Katalog im laufenden Spiel | `monsterAssert()` | 22 Gegner geprüft, alle Bänder eingehalten |
| Kampfzeit und Gefahrenbudget | `tools/monster-messlauf.mjs`, 3 Läufe je Gegner | 19 Gegner der physischen Route, alle im Band |
| Schadensarten | 100 Rohschaden je Art auf denselben Gegner | Steingolem 10 physisch gegen 140 magisch |
| Zeichenpfad | 841 Frames echtes `update()` plus `render()` mit allen 22 Typen | kein Fehler, alle Zustände mindestens einmal aktiv |

Zwei Dinge, die dabei zu wissen sind: ohne die lizenzierte Grafik startet das Spiel seine
eigene Schleife nie (es wartet auf `assetsReady`), deshalb ruft der Messlauf `update()` selbst.
Und `bakeUiSkin()` wirft in dieser Umgebung einen `TypeError`, weil `assets/cf/ui/` fehlt. Das
ist der Stand vor dieser Phase und unverändert, gegengeprüft am Commit davor.

### Was offen bleibt

Steht in Abschnitt 3.8 des Katalogdokuments: die XP-Kurve am oberen Ende, eigene Sprites für
die zehn Neuen, und der Frostkamm, der als einziges Band ungerechnet bleibt und dadurch die
Vergleichsprobe im selben Spiel ist.
