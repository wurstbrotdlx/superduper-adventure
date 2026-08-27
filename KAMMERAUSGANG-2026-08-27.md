# Befund: der Weg aus der Kammer heraus, und warum er auf dem Telefon schwarz wird

**Datum:** 27.08.2026
**Ausgangslage:** `main` stand auf `d3fae73`. Meldung vom Gerät, mit Bild: *„Auf Android mit Chrome gibt es den Bug nach dem Verlassen der Kammern."* Auf dem Bild steht die Bedienschicht vollständig da — Ortszeile, Minikarte, Gürtel, Fächer, Beute —, und die Welt dazwischen ist **schwarz**. Kein Boden, keine Figur, nur Wetterflocken und ein paar Krümel.
**Auftrag:** die Ursache benennen, nicht das Symptom wegdrücken.

---

## 1. Die eine fehlende Zeile

`verlasseKammer()` setzt den Spieler vom Kammervorraum zurück vor seine Tür:

```js
player.x = tuer.x; player.y = tuer.y + TS;             // vor der Tür, nicht in ihr
```

Der Vorraum liegt **immer** bei `KAM_X0`, die Tür irgendwo in ihrem Band. Zwischen beiden liegen regelmäßig mehrere tausend Pixel. Was an dieser Stelle fehlte, ist der Schnitt: `camSnap()`.

Ohne ihn fährt die Kamera den Weg ab, mit `lerp(..., 0.1)` je Frame, wie in `update()` für den normalen Lauf gedacht. Der Kommentar an `camSnap()` (seit W-Groß) zählt selbst auf, wer den Schnitt braucht — Spielstart, Schichtbeginn, Wiedereinstieg nach dem Tod, Sprung ins Schattenland — und schließt mit *„jetzt brauchen es alle"*. Der Kammerausgang stand nicht in der Liste. Er ist die einzige Stelle im Spiel, die den Spieler setzt und die Kamera stehen lässt: `betreteKammer()` schneidet über `baueEbene()` von Hand, `respawnPlayer()`, `startShift()`, der Schattenlandsprung und der Spielstand rufen `camSnap()`, und `betreteHaus()`/`verlasseHaus()` aus IN1 haben die Zeile von Anfang an.

## 2. Warum das nicht nur ein Schwenk ist

Sichtbar ist ein mehrsekündiger Kameraflug quer über eine Karte, die man gerade nicht ansehen will. Teuer ist der unsichtbare Teil.

Seit W-Groß hat das Spiel kein Vollkarten-Canvas mehr, sondern den Boden-Chunk-Cache: `getChunk()` bäckt jeden 8x8-Block, der ins Bild kommt, als eigenes **256x256-Canvas** und legt ihn in eine LRU-Karte mit `CHUNK_CAP = 96`. Das ist genau die richtige Rechnung für eine Kamera, die läuft. Für eine Kamera, die über die halbe Karte zieht, ist es eine Allokationslawine: jeder Frame des Schwenks schiebt ein neues Chunk-Gitter durchs Bild, und jedes davon wird gebacken, angesehen wird keines.

Auf dem Schirm ist das verschenkte Arbeit und fällt nicht auf. Auf Android-Chrome ist es der Fehler:

* der Canvas-Speicher einer Seite ist dort **gedeckelt**, deutlich enger als auf dem Schirm;
* eine misslungene Allokation liefert kein Fehlerobjekt, sondern ein **leeres Canvas**;
* `getChunk()` prüft das nicht — es kann es nicht ohne `getImageData()` je Block — und legt das leere Canvas in den Cache;
* dort bleibt es. Ein leerer Chunk wird nicht nachgebacken, er gilt als fertig.

Der Spieler steht danach in einer schwarzen Welt, und zwar so lange, bis irgendetwas `refreshFloor()` ruft — also bis zur nächsten Kammer, zum nächsten Tod oder zur nächsten Schicht. Genau das zeigt das gemeldete Bild.

**Was hier gemessen ist und was nicht:** gemessen ist die Lawine (Abschnitt 3). Der Schritt von der Lawine zum leeren Canvas ist bekanntes Verhalten von Chrome auf Android und hier **nicht** am Gerät nachgestellt worden — dafür fehlt das Gerät. Er muss auch nicht nachgestellt werden, um die Zeile zu setzen: der Schwenk ist in jedem Fall Speicher, der für nichts ausgegeben wird, und er ist in jedem Fall falsch.

## 3. Die Messung

`tools/kammerausgang-messlauf.mjs`, Telefon stehend (390x844), fünf Türen aus fünf Bändern, gezählt werden die 256er-Canvas in den zwei Sekunden nach dem Ausgang. Erlaubt ist das sichtbare Chunk-Gitter aus `render()` — je Achse `ceil(Kante / 256) + 3`, hier **35**.

| Band | Tür | Weg Vorraum → Tür | Nachlauf der Kamera | Chunk-Bake vorher | nachher |
|---|---|---|---|---|---|
| Altbestand | 231,62 | 7175 px | 7175 px → 0 px | 194 | **24** |
| Eisablage | 134,125 | 4890 px | 4890 px → 0 px | 156 | **24** |
| Ablage A | 211,189 | 8085 px | 8085 px → 0 px | 231 | **30** |
| Nassablage | 76,237 | 6712 px | 6712 px → 0 px | 169 | **30** |
| Brandabschnitt | 122,241 | 7435 px | 7435 px → 0 px | 204 | **35** |

(Die Türstufe steht nicht in der Tabelle: `wuerfleTuer()` würfelt sie je Lauf neu, die Türorte dagegen liegen im gesiegelten Kartenstrom und stehen in beiden Läufen auf derselben Kachel. Die Zahl, um die es geht, hängt am Ort und nicht an der Stufe.)

156 bis 231 Chunk-Canvas für einen einzigen Türgang. Bei 256x256x4 Byte sind das rund **40 bis 60 MB** Canvas-Grund, angefordert in rund zwei Sekunden, wovon der Cache 96 behält und der Rest sofort Müll ist. Nach dem Schnitt bleiben 24 bis 35 — das Bild, das wirklich dasteht, und sonst nichts.

Die Zahl reagiert erwartungsgemäß auf die Entfernung: die kürzeste Tür (4890 px) ist die billigste, die weiteste (8085 px) die teuerste. Das ist die Gegenprobe darauf, dass wirklich der Weg gezählt wird und nicht etwas anderes.

## 4. Die Berichtigung

Eine Zeile in `verlasseKammer()`, an derselben Stelle, an der `verlasseHaus()` sie hat:

```js
if(schlossOpen) schlossZu();
camSnap();
setStyle('bossbar', 'display', boss && !boss.dead ? 'block' : 'none');
refreshFloor();
```

Dazu der Kommentar an `camSnap()`, der die Wege **zurück** jetzt ausdrücklich mitnennt: die Aufzählung dort war eine Liste der Stellen, die den Schnitt brauchen, und sie war unvollständig. Eine unvollständige Liste ist schlimmer als keine, weil man sie liest und für vollständig hält — genau so ist der Kammerausgang durchgerutscht.

## 5. Was nicht geändert wurde

* **`CHUNK_CAP` bleibt bei 96.** Der Deckel war nicht das Problem; das sichtbare Gitter braucht auf dem Telefon 24 bis 35 Blöcke, der Deckel hat also weiterhin fast das Dreifache Luft. Wer ihn wegen dieses Fundes senkt, behandelt das Symptom.
* **Kein Bake-Budget je Frame.** Ein Deckel auf „so viele Chunks darf ein Frame backen" hätte dieselbe Lawine gebremst, aber jeden legitimen Schnitt — Schichtbeginn, Wiedereinstieg, Hauseingang — mit sichtbar nachwachsendem Boden bezahlt. Ein Schnitt, der einen Frame lang halb schwarz ist, ist kein Schnitt.
* **Keine Prüfung auf leere Chunk-Canvas.** Sie wäre ein `getImageData()` je Block, also genau die Sorte Kosten, wegen der es den Cache gibt.
* ~~Keine Zeile in `NEUERUNGEN`.~~ **Nachgetragen am selben Tag, nach dem Merge.** Der erste Stand dieses Berichts hat den Punkt zurückgestellt, weil ein neuer Stempel allen die ganze Mitteilung noch einmal vorlegt und eine Berichtigung kein Bauabschnitt ist. Das war die falsche Abwägung: der Fehler war sichtbar, er wurde gemeldet, und wer ihn gesehen hat, soll lesen können, dass er weg ist. Der Punkt heißt *„Der Weg aus der Kammer führt wieder ins Bild"*, der Stand steht auf `2026-08-27-kam`.

## 6. Eine Beobachtung zum gemeldeten Bild

Das Bild zeigt nicht den heutigen Stand. Zwei Merkmale datieren es **vor U7** (25.08.): die Ortszeile trägt noch `(Stufe 5)` und die Uhr als Anhängsel (`· ⏰ 17:54`), und Leben und Mana stehen als die zwei senkrechten Röhren an den Bildrändern, die U7 abgeräumt hat. Der Fund ist davon unberührt — die fehlende Zeile stand bis heute in `main`, und gemessen wurde an `d3fae73`, nicht am Bild. Wer nachsehen will, ob es dasselbe ist: nach dem Ausgang bleibt die Welt jetzt stehen, wo sie steht, statt heranzufliegen. Fliegt sie noch, ist es eine alte Fassung im Browser-Zwischenspeicher.
