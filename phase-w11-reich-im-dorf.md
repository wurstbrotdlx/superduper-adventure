# Bauabschnitt W11: Das Reich im Dorf — ERLEDIGT

Drei neue Dorffiguren, zehn Zuwächse bei den bestehenden, ein Feld namens `abAkt` und ein Guard, der auf den Kaiser aufpasst.

Dieses Dokument ist absichtlich ausführlich geschrieben. Die Phasendokumente dieses Projekts sind über die Zeit sehr knapp geworden, und knapp ist hier zulasten der Verständlichkeit gegangen: wer ein halbes Jahr später nachliest, warum eine Figur auf Kachel (21, 42) steht, findet in einem Halbsatz keine Antwort. Deshalb steht unten jeweils erst, was das Problem war, dann was entschieden wurde, und dann warum.

---

## 1. Die Ausgangslage

Im Juli und August 2026 ist neben der Weltbibel eine zweite große Textdatei entstanden, `weltgeschichte.md`. Sie erzählt die Vorgeschichte der Welt und bringt drei Dinge mit, die es vorher nicht gab:

1. **Ein zweites Weltgesetz.** Das erste sagt, warum Monster entstehen ("Ein Vorgang, den niemand abschließt, nimmt Gestalt an"). Das zweite sagt, warum Bürokraten in dieser Welt der Adel sind: *Wer für einen offenen Vorgang zuständig ist, ist jemand. Wer keinen hat, ist niemand.*
2. **Ein Reich.** Über Vordermühl gibt es ein Oben, und Oben ist keine Redensart, sondern eine Stadt mit einundvierzigtausend Einwohnern.
3. **Einen Preis für das Ende.** Wer den Vorgang 1 schließt, macht jeden Adeligen dieser Welt zu einem Niemand, einschließlich der fünf Beschäftigten, die man liebgewonnen hat.

Dazu kommen vier neue Figuren, drei Blattserien, vier Langvorgänge und neun ausgeschriebene Szenen.

**Im Code stand davon nichts.** Die elf Dorffiguren aus W3 reden weiterhin so, als sei Vordermühl allein auf der Welt. Das ist kein Fehler, es ist nur ein Stand: die Weltgeschichte ist Erzählstoff, sie fasst ausdrücklich keine Mechanik an. Irgendwann muss aber jemand die Brücke bauen, sonst hat das Projekt zwei Wahrheiten.

W11 baut diese Brücke, und zwar **nur für die Figurenebene**. Was der Abschnitt nicht anfasst, steht in Abschnitt 7.

---

## 2. Die Leitregel: Zuwachs, kein Umbau

Die Weltgeschichte sagt über sich selbst: *"Zuwachs und nicht Umbau: keine bestehende Figur wird umgeschrieben, keine bestehende Mechanik umgedeutet, kein Aktenzeichen verschoben."*

W11 hält sich daran wörtlich. **Keine einzige der 66 Grundzeilen, 55 Aktzeilen und 84 Anlasszeilen aus W3 ist geändert worden.** Das war keine Bequemlichkeit, sondern der einzige Weg, bei dem sich das Ergebnis überhaupt prüfen lässt: hätte man die bestehenden Zeilen umformuliert, wäre jede Prüfung auf Zeichendeckel, Sperrvermerk und Humor-Grundgesetz von vorn zu führen gewesen, und `figuren-dorf.md` wäre als Lieferdokument wertlos geworden.

Stattdessen hängt sich alles Neue **hinten an**:

* Neue Figuren kommen als neue Einträge in `DORF_FIGUREN` dazu.
* Neue Zeilen für bestehende Figuren kommen als `zusatz`-Blöcke dazu, also über denselben Mechanismus, den W-Nörgel für die vier Lagerzeilen schon gebaut hat.

---

## 3. Der Schalter: `abAkt`

### Das Problem

Zwei der drei neuen Figuren dürfen nicht von Anfang an im Dorf stehen.

**Kordula Umlauf** ist die Figur, über die der Spieler zum ersten Mal erfährt, dass Oben ein Ort ist. Die Weltgeschichte setzt das ausdrücklich in Akt II an. Stünde sie ab Schicht 1 am Gasthaus, wäre der Aha-Moment des zweiten Aktes an Tag eins verbraucht, und zwar an einen Spieler, der zu diesem Zeitpunkt noch gar nicht weiß, warum "Oben" interessant sein sollte.

**Vorblatt** ist der Gegenspieler. Er taucht auf, sobald der Spieler anfängt, gefährlich zu werden, und das ist laut Weltgeschichte ab Akt III. Ein Gegenspieler, der am ersten Tag freundlich neben dem Bürgermeister steht, ist keiner.

Die Weltgeschichte hat das übrigens selbst schon mitgedacht, ohne es zu benennen: Nieselbeck bekommt dort fünf Aktzeilen, Umlauf vier (II bis V) und Vorblatt drei (III bis V). Die fehlenden Zeilen sind kein Versehen, sie sind die Ansage.

### Die Entscheidung

Ein neues Feld in `DORF_FIGUREN`:

```js
{key:'umlauf', name:'Reichsbotin Kordula Umlauf', kurz:'Reichsbotin Umlauf',
 tx:26, ty:42, opt:'fest', abAkt:2, ...}
```

Daneben eine Funktion von einer Zeile, direkt hinter `aktStand()`:

```js
const figDa = fig => !fig || !fig.abAkt || !CONFIG.schichtModus || aktStand() >= fig.abAkt;
```

Sie wird an drei Stellen gelesen, und nur an dreien:

| Stelle | Wirkung, wenn die Figur noch nicht da ist |
|---|---|
| `scanAktion()` | Sie wird nicht als Kontextaktion angeboten, `F` findet sie nicht. |
| die Zeichenschleife | Sie wird nicht gezeichnet, und damit auch kein Namensschild und keine Sprechblase. |
| die Wanderschleife | Sie bewegt sich nicht. (Bei den drei neuen Figuren ohne Wirkung, alle stehen fest. Steht aus Konsistenz da.) |

### Warum genau so

**Warum kein eigener Speicherschlüssel.** Weil der Aktstand schon einer ist. `aktStand()` rechnet aus `amt.schichten`, das seit Phase 4 persistiert wird. Ein zweiter Zähler wäre ein zweiter Ort, an dem dasselbe steht, und der erste, der auseinanderläuft.

**Warum die Klammer um `CONFIG.schichtModus`.** Im freien Spiel gibt es keine Schichten und damit keine Akte. `aktStand()` liefert dort immer 1, und ohne die Klammer wären zwei Drittel der neuen Figuren im freien Spiel nie zu sehen. Die Doktrin dafür stand schon da: `serieFrei()` gibt die Blattserien außerhalb des Schichtmodus genauso frei. W11 erfindet keine neue Regel, es benutzt die vorhandene.

**Warum die Figur trotzdem angelegt wird.** `genMap()` legt alle Einträge aus `DORF_FIGUREN` als `npcs` an, auch die noch nicht sichtbaren. Das kostet drei Objekte und erspart jede Sonderbehandlung beim Aktwechsel: es gibt keinen Moment, in dem jemand eine Figur nachträglich in die Welt setzen müsste. Sie ist immer da, sie wird nur nicht gezeigt.

**Was daraus für die Aktzeilen folgt.** Eine Figur mit `abAkt:3` hat für die Akte I und II keinen Satz, weil sie in diesen Akten niemand ansprechen kann. Ihre ersten beiden Aktzeilen sind der leere String. Das ist gewollt, aber nur genau dort, und `knAssertCaps()` prüft seit W11 beides: leer unterhalb von `abAkt`, gefüllt ab `abAkt`. Ohne diese Prüfung wäre eine versehentlich leere Zeile weiter hinten in der Tabelle eine stumme Figur, und stumme Figuren sind in diesem Projekt schon einmal ein halbes Jahr lang unbemerkt herumgestanden (siehe G6).

---

## 4. Die drei neuen Figuren

Die Zeilen stehen wörtlich in `weltgeschichte.md`, Kapitel 6, und sind von dort übernommen. Was W11 dazu entschieden hat, ist das, was der Erzähltext offenlässt: Aussehen, Standort, Anredeform.

| Figur | Ab | Anker | Gestalt (Haar / Oberteil / Hose / Schuhe) |
|---|---|---|---|
| Wetterbeauftragter Ferdinand Nieselbeck | Akt I | (21, 42) | h5 grau / 1 / 1 / 0 |
| Reichsbotin Kordula Umlauf | Akt II | (26, 42) | h4 rot / 2 / 2 / 4 |
| Reichsministerialdirektor zu Händen Vorblatt | Akt III | (11, 37) | h3 schwarz / 4 Gold / 4 / 3 |

### Warum alle drei Held-Komposite sind

`CF_NPCS` führt acht NPC-Blätter aus dem Grafikpaket, und alle acht sind an die elf Figuren aus W3 vergeben. Eine neunte Figur an ein bereits benutztes Blatt zu hängen, hieße, zwei Leute mit demselben Gesicht nebeneinanderzustellen. Genau das war in G6 der Fehler, den wir nicht wollten, und dort ist auch die Lösung entstanden: `bakeNpcSheet()` setzt aus Körper, Frisur, Hemd, Hose und Schuhen ein eigenes Blatt zusammen. Die drei neuen Figuren benutzen sie. **Es kommt keine einzige neue Bilddatei ins Repo.**

Die Regel aus `figuren-dorf.md` gilt weiter: Frisur und Oberteil bilden über alle Figuren ein eindeutiges Paar. Mit den drei neuen sind es vierzehn, und das Paar ist weiterhin eindeutig.

### Ein Fund bei Nieselbeck

Er stand zuerst auf Kachel (12, 41). Das sah auf dem Papier gut aus: freies Feld im Anger, nah am Amt, dessen Wetterbeauftragter er ist. Alle Guards meldeten "in Ordnung", `dorfSichtAssert()` bescheinigte freie Sicht.

Der Bildschirmabzug zeigte etwas anderes. **(12, 41) ist eine Kachel neben Knöterich**, und die beiden Namensschilder lagen ineinander: "Amtsrat a. D. Knöterich" und "Herr Nieselbeck" überlappten sich zu einer unlesbaren Zeile.

Der Ausweichsatz in `npcSchildFlush()` fängt so etwas eigentlich ab, er legt jedes Schild auf die erste freie Zeile über dem Kopf. Er rechnet dabei aber mit der Weltposition der Figur, und zwei Figuren, die praktisch am selben Punkt stehen, bekommen zwar verschiedene Zeilen, deren Grundhöhen aber unterschiedlich sind. Das Ergebnis liegt trotzdem übereinander.

Der Anker liegt jetzt auf (21, 42), am Ostrand des Angers unter den Marktständen. **Der Fund ist der Grund, warum dieser Abschnitt Bildschirmabzüge hat und nicht nur Konsolenzeilen:** kein Guard dieses Projekts prüft, ob zwei Beschriftungen lesbar nebeneinanderpassen, und die Konsole war die ganze Zeit still.

### Warum Vorblatt vor der Amtstür steht und nicht davor

Genauer: zwei Kacheln südlich der Türschwelle statt auf ihr.

Er passt nicht durch diese Tür, das ist eine Tatsache der Weltgeschichte (ein Reichsministerialdirektor trägt vierzig Jahre offene Vorgänge am Leib, in Lagen). Der technische Grund für die zwei Kacheln ist ein anderer: `scanAktion()` bietet die Kontextaktion an, deren Ziel am nächsten liegt. Stünde er auf der Schwelle, überstimmte er die Amtsstube, und die Amtsstube wäre ab Akt III nicht mehr zu betreten. Aus genau demselben Grund ist Zwirn in G6 gewandert.

### Warum sein Name gekürzt ist

Die Weltgeschichte führt ihn als "Reichsministerialdirektor Hieronymus zu Händen Vorblatt", 54 Zeichen. Im Personalverzeichnis des Gesprächsfensters steht "Reichsministerialdirektor zu Händen Vorblatt", 44 Zeichen.

Der Grund ist gemessen und nicht geschätzt. Die Kopfzeile des Gesprächsfensters ist rund 522 Pixel breit. Der längste bestehende Name, "Wirt Bruno Fass, Gasthaus 'Zum Letzten Stempel'", misst 524 Pixel und überschießt sie um zwei. Er wird deshalb schon heute umgebrochen, was in Ordnung ist: die Kopfzeile hat `overflow-wrap:break-word`, sie schneidet nichts ab. Die volle Fassung von Vorblatt wäre aber der neue Schlechtestfall gewesen, und einen neuen Schlechtestfall einzuführen, während man an genau dieser Stelle arbeitet, ist schlechter Stil.

Weggefallen ist der Vorname. Geblieben ist "zu Händen", und darauf kommt es an: das ist der Adelspartikel des Reiches und die halbe Pointe der Figur.

---

## 5. Die zehn Zuwächse

Kapitel 6 der Weltgeschichte hat eine Tabelle "Was die bestehenden Figuren dazubekommen": je eine neue Tatsache pro Figur, die ab jetzt gilt. Zehn davon sind eingebaut, jede als zwei Zeilenpaare.

| Figur | Ab Akt | Was dazukommt |
|---|---|---|
| Zwirn | II | Die Bewilligung des Dorffestes ist 1004 erteilt worden und steckt in der Röhre. Er hat seit acht Jahren recht und weiß es nicht. |
| Milb | II | Er liegt auch bei der Hoheitsstufe des eigenen Hauses eine Stufe daneben, nach oben. |
| Pommer | II | Er führt eine Liste der Dinge, die er ohne Antrag ausgegeben hat. Die Liste ist leer. |
| Bramsche | III | Der Herr aus Hochablage von 985. Sie hält sich für schuldig und hat in Wahrheit das Beweisstück gerettet. |
| Lisbeth | III | Sie hat als Einzige gemerkt, dass Fürst Nachtrag einen Titel hat. Es steht auf Seite zwei ihres sechsten Berichts. |
| Trepp | III | Seine Amtsbezeichnung ist ein Adelsamt. Er ist von Amts wegen adelig und trägt Post aus. |
| Lott | III | Vordermühl steht in keinem Bestand. Wer nie geführt wurde, kann nicht abgeschlossen werden. |
| Pahl | III | Dasselbe von der anderen Seite der Bank: Hintermühl ist zugeklappt worden, nicht niedergebrannt. |
| Zapf | IV | Der Stopfen unter dem Steinfeld. Er beendet den Krieg mit Werkzeug. |
| Fass | IV | Der Wirt weiß, was der Hausname verspricht. Er hat ihn vom Großvater. |
| Nörgel | IV | Vorblatt bietet ihm die Entfristung an, damit er die Anschrift nicht liest. |

### Der Mechanismus

`zusatz` gab es schon, W-Nörgel hat es gebaut. Es sah so aus:

```js
zusatz:[{merker:'hatLagerGesehen', zeilen:[ ... ]}]
```

W11 erweitert es um einen zweiten Schaltertyp. Ein Block hängt jetzt **entweder** an einem Merker im Spielstand **oder** an einem Akt:

```js
zusatz:[{abAkt:2, zeilen:[ ... ]}]
```

`figZusatz()` wertet beides aus, `knAssertCaps()` verlangt genau einen der beiden Schalter je Block. Ohne Schalter wären die Zeilen von Anfang an da (dann bräuchte es `zusatz` nicht), mit zweien wäre nicht zu sagen, welcher gilt.

Nörgel hat als einzige Figur beides: die vier Lagerzeilen am Merker und zwei Vorblatt-Zeilen am Akt. Sie stören sich nicht, `figZusatz()` hängt beide Listen aneinander.

### Warum Knöterich nichts bekommen hat

Sein Zuwachs ist der größte von allen: er hat als Einziger im Haus die Rangfolge des Reiches nachgerechnet und weiß, dass er im ersten Haus des Reiches sitzt. Er ist trotzdem nicht eingebaut, und zwar aus der ältesten Designregel dieses Projekts: **Knöterich erklärt Tasten, nie Zusammenhänge.** Die Weltbibel begründet das über die Figur selbst, seine Amtsverschwiegenheit endet nicht mit der Pensionierung. Ausgerechnet den größten Zusammenhang des Spiels über ihn auszusprechen, hieße die Figur aufzugeben.

Er steht als Zuwachs in Kapitel 8 der Weltbibel und im Spiel nicht. Das ist eine Entscheidung und kein Vergessen.

---

## 6. Bramsche und das Reich

Bramsche ist der Hinweisgeber des Spiels: eine präzise Frage pro Schicht, wenn sie richtig gestellt ist. Ihre Antworttabelle hatte acht Einträge, alle zum Bereich VII und zum Vorgang 1. Über das Reich konnte sie nichts sagen, und damit war das Reich im Spiel eine Behauptung ohne Auskunftsstelle.

Sieben Antworten sind dazugekommen: Hochablage, die Rangrechnung, das Aktenhaus, das ausgesetzte Wetter, die Röhre unter dem Steinfeld, der Kaiser und "zu Händen". Alle nennen Fundorte und Zusammenhänge, keine nennt Mechanik. Das ist die Bedingung, unter der ihre Tabelle seit W3 steht.

### Der Fund

Die Antwort auf die Rangfrage lautete zunächst wortgetreu wie in der Weltgeschichte: *"Nach dem Alter des ältesten Vorgangs."*

Beim ersten Laden meldete `knAssertCaps()`:

```
Knöterich: Sperrvermerk: Kesselgrammatik im Text: Alter
    Nach dem Alter des ältesten Vorgangs.
```

Das ist richtig so. **Alter** steht auf der Sperrliste aus Kapitel 7 der Weltbibel, weil im Kessel die Seltenheit einer Zutat das Alter des Aktenzeichens bestimmt. Die Zeile hat mit dem Kessel nichts zu tun, sie bringt nur die gesperrte Vokabel mit, und der Guard kann das nicht unterscheiden. Er soll es auch nicht: eine Wortliste, die nur bei nachgewiesenem Vorsatz anschlägt, ist keine Wortliste.

Die Antwort lautet jetzt *"Wie lange der älteste Vorgang offen ist."* Dieselbe Auskunft, dasselbe Verständnis, ohne das Wort. Vierzig Zeichen, passt.

Das ist der Fall, für den es diesen Guard gibt, und er ist bei der ersten Gelegenheit eingetreten.

---

## 7. Der neue Guard: der Kaiser steht im Präsens

Die Weltgeschichte hat eine Regel, die stärker ist als alle anderen und leichter zu brechen als jede:

> Über den Kaiser wird ausschließlich im Präsens gesprochen. Von jeder Figur, jedem Blatt, jeder Urkunde. Wenn eine einzige Figur den Kaiser in der Vergangenheitsform erwähnt, ist der Witz kaputt und die Welt auch.

Der Grund ist keine Marotte. Kaiser Ordinat der Vierte ist seit dem Jahr 612 tot, aber sein Tod wurde nie eingetragen, und was nicht in den Akten ist, ist nicht in der Welt. Er ist **aktenkundig lebendig**, er regiert, jede Befugnis des Reiches leitet sich aus seinem Willen ab. Wer ihn in die Vergangenheit setzt, sagt damit, dass er tot ist, und nimmt dem fünften Akt seine Pointe: dass die Zustellung nebenbei den Tod des Kaisers einträgt und in derselben Sekunde jede Befugnis dieser Welt erlischt.

Eine Regel dieser Art in einem Dokument aufzuschreiben, hilft genau so lange, wie sich jemand daran erinnert. Deshalb steht sie jetzt im Code:

```js
const KAISER_PRAETERITUM =
  /(Kaiser|Ordinat|Majestät)[^.!?]{0,40}\b(war|waren|wurde|hatte|starb|verstarb|regierte|lebte|gewesen|gestorben)\b/i;
```

`knAssertCaps()` prüft damit jede Sprechblase, jede Aktzeile, jede Randnotiz und jeden Auftragstext beim Start. Die Liste ist absichtlich kurz und wortnah: sie soll den Fall finden, der beim Schreiben passiert ("der Kaiser war", "Ordinat starb"), und nicht jeden Nebensatz verdächtigen, in dem das Wort vorkommt. Der Bestand ist sauber, und er bleibt es jetzt von selbst.

---

## 8. Was W11 nicht baut

Ausdrücklich benannt, damit es nicht wie ein Versehen aussieht:

* **Die neun Szenen** aus Kapitel 8 der Weltgeschichte, einschließlich Intro und Abspann. Sie sind der größte Posten der Datei und hängen an einer Entscheidung, die noch aussteht: Kapitel 14 der Weltbibel schließt Zwischenspiele ausdrücklich aus, der Auftrag zur Weltgeschichte verlangt sie, und die Weltgeschichte hat beides bedient, indem jede Szene eine Zeile "Mit Bordmitteln" trägt. Diese Entscheidung ist keine, die ein Bauabschnitt nebenbei trifft.
* **Die Entklammerung auf dem Dorfplatz** (Szene 6) und **die Versuchung** (Szene 7). Vorblatt steht im Dorf und ist ansprechbar; sein Auftritt ist damit nicht erzählt. Das ist der Unterschied zwischen einer Figur und einer Szene.
* **Die Blattserien G, H und I.** Zwanzig Blätter, in Kapitel 9 ausgeschrieben. Der Einbauweg ist bekannt (`BLAETTER_KEYS`, `SERIE_AKT`, `TRUHE_SERIEN`), es ist Arbeit und keine Frage.
* **Die Langvorgänge 10 bis 13.** Sie stehen in Kapitel 10 der Weltgeschichte und jetzt auch in der Tabelle in Kapitel 10 der Weltbibel, als Entwurf gekennzeichnet. Einer von ihnen, "Der Stopfen", hat eine Eigenschaft, die es im Spiel noch nicht gibt: eine Belohnung mit Preis (er holt den Gegenspieler zwei Schichten früher ins Dorf). Das ist eine eigene Überlegung wert.
* **Konrad zu Händen Aufschub.** Er erscheint nur, wenn das Spiel Hochablage zeigt. Vordermühl zeigt Hochablage nie. Ihn ins Dorf zu stellen hieße, ihn aus der Schlange zu holen, in der er seit siebenundsechzig Jahren steht, und die Schlange ist die Figur.
* **Knöterichs Zuwachs.** Siehe Abschnitt 5.

---

## 9. Abnahme

### Die Guards beim Laden

Alle siebzehn Guards auf Skriptebene und die beiden hinter `loadAssets()` melden "in Ordnung", die Konsole ist im Übrigen still. Die beiden Zeilen, die W11 betreffen:

```
U3 Gespräch: 14 Namensschilder und je vier Antworten in Ordnung.
G6 Dorfsicht: 14 Dorffiguren haben ein Blatt und stehen im Bild.
```

Aus elf sind vierzehn geworden, und `dorfSichtAssert()` bestätigt für alle vierzehn freie Sicht am Heimatanker.

### Der neue Prüflauf

`tools/reich-pruef.mjs`, 35 Prüfungen im echten Browser, Exit-Code 1 bei der ersten Abweichung. Er stellt fest statt zu messen, wie `menue-pruef.mjs` und `gespraech-pruef.mjs`:

```bash
python3 serve.py &
node tools/reich-pruef.mjs
```

Geprüft wird:

* die Torschaltung für alle drei Figuren über alle fünf Akte und im freien Spiel (18 Prüfungen);
* die zehn Zuwachs-Blöcke, jeder einmal einen Akt zu früh und einmal im richtigen Akt (10);
* Nörgels beide Blöcke, mit und ohne Lagerbesuch (2);
* dass kein Grundzeilen-Kreislauf in eine leere Sprechblase läuft, über alle vierzehn Figuren und zwei volle Umläufe (1);
* Bramsches Tabelle auf doppelte Fragen und leere Antworten (2);
* dass kein Name aus W11 der neue breiteste ist und die Kopfzeile umbricht statt abzuschneiden (2).

### Die bestehenden Prüfläufe

Als Rückfallprobe, alle unverändert bestanden:

| Lauf | Ergebnis |
|---|---|
| `tools/gespraech-pruef.mjs` | 44 von 44 |
| `tools/menue-pruef.mjs` | 39 von 39 |
| `tools/empfang-pruef.mjs` | 59 von 59 |

### Im Bild

Die drei Figuren sind im laufenden Spiel angesehen worden, jede mit geöffnetem Gesprächsfenster, bei Schicht 35 (also Akt IV, damit alle drei da sind). Der Fund aus Abschnitt 4 stammt aus diesem Schritt und aus keinem Guard.

---

## 10. Was in den Dokumenten nachgezogen wurde

| Datei | Was |
|---|---|
| `figuren-dorf.md` | Serie 2 mit den drei neuen Figuren, vollständig ausformuliert und gegengezählt. Zehn Abschnitte "Zusatzzeilen (W11)" bei den bestehenden Figuren. Sieben Zeilen in Bramsches Antworttabelle. Ein Kopfabschnitt, der `abAkt` erklärt. **Keine bestehende Zeile geändert.** |
| `superduper-weltbibel.md` | Kapitel 8: vier Figuren "Aus dem Reich" und je ein Zuwachs-Absatz bei dreizehn bestehenden Einträgen, dazu einer für den Kater Anlage 3. Kapitel 10: die Langvorgänge 10 bis 13, als Entwurf gekennzeichnet. Kapitel 12: die Serien G, H und I, 48 Blätter werden 68. Kapitel 13: die sieben Regeln für alles, was im Reich spielt. Kapitel 14: dieser Abschnitt. Kapitel 15: zwölf neue Zeilen im Namensregister. Kapitel 16: vier neue offene Punkte und eine Liste dessen, was noch nicht gebaut ist. |
| `weltgeschichte.md` | Ein Absatz "Stand des Einbaus" in Kapitel 13, damit dort nachlesbar ist, was von der Datei im Spiel angekommen ist und was nicht. |
| `README.md` | Zeile in der Dokumententabelle, Zeile in der Werkzeugtabelle, Guard-Zahl. |

---

## 11. Der Zeichendeckel

Alle neuen Zeilen halten ihn, und zwar nachgezählt und nicht geschätzt: `z1` höchstens 48 Zeichen, `z2` höchstens 32, einzeilige Aktzeile höchstens 44. Die Zahlen stehen in `figuren-dorf.md` hinter jeder Zeile und sind gegen den Text gegengeprüft, es gibt keine Abweichung.

Nachgemessen wird das ab jetzt ohnehin nicht mehr von Hand. `knAssertCaps()` prüft jede dieser Zeilen bei jedem Start gegen Deckel, Gedankenstrich, Emoji, das Wort "undefined", die Sperrliste und seit W11 auch gegen den Kaiser im Präteritum.
