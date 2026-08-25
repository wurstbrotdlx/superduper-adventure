## Dorf-Figuren, Serie 1: elf Ensemble-Mitglieder, vollständig ausformuliert — ERLEDIGT (eingebaut mit W3)

Inhaltslieferung zu Bauabschnitt **W3** ("Das Dorf spricht") aus `superduper-weltbibel.md`, Kapitel 8 (Das Ensemble), Kapitel 9 (Der Hauptvorgang, fünf Akte) und Kapitel 14. Elf der zwölf im Auftrag genannten Figuren stehen hier: alle ansprechbaren Ensemble-Mitglieder außer Knöterich (existiert bereits im Code) und dem Kater Anlage 3 (bekommt kein eigenes Zeilenkontingent, wird nur bei Bramsche erwähnt und ohne Sprite gezeichnet).

**Entstehung:** jede Figur wurde einzeln entworfen, dann von einem zweiten Durchgang gegen Sperrvermerk/Humor-Grundgesetz/Formregeln/Zeichendeckel geprüft und repariert, dann von einem dritten, unabhängigen Durchgang ausschließlich auf Kesselgrammatik-Lecks gegengeprüft. Bei zwei Figuren (Pommer, ein Grundzeilenpaar bei Lott/Pahl im fluch-Block) hat die zweite Stufe Sperrvermerk-nahe Formulierungen ersetzt, dokumentiert unten je Figur. Alle elf Figuren stehen am Ende mit `ok:true`, kein Fund in der dritten Stufe.

**Sperrvermerk, unverändert aus Kapitel 7, hier auf alle elf Figuren angewandt:** keine Figur erklärt oder deutet an, wie die Beglaubigung im Kessel rechnet (Substantiv=Slot, Adjektiv=Wirkung, Seltenheit=Alter des Aktenzeichens, drei Zutaten=dreifache Ausfertigung, Fluch=Bewilligung+Auflage im selben Bescheid, zwei harte Flüche=Verhältnismäßigkeit). Figuren dürfen über Akten, den Krieg, das Amt, ihre eigene Lage und den Vorgang 1 reden, nie über die Zutaten-Mechanik.

**Formregeln, unverändert aus Kapitel 13:** keine Gedankenstriche, keine Emojis, Länge nach Sprachmarke *(Stand T1, 25.08.2026; bis dahin stand hier „kurze Sätze" als Deckel für alle)*. **Zeichendeckel:** Dialogzeile 1 (`z1`) höchstens 48 Zeichen, Zeile 2 (`z2`) höchstens 32 Zeichen, einzeilige Aktzeile höchstens 44 Zeichen. Alle Werte unten sind gegengezählt, nicht geschätzt.

**Zwei Optik-Gruppen für den Einbau** (Entscheidung, keine Erfindung neuer Assets — siehe Plan zu W3):

* **Acht Figuren aus vorhandenen NPC-Sprites** (wandern wie die bisherigen drei Dorf-Staffage-NPCs): Zwirn, Zapf, Lisbeth, Trepp, Nörgel, Milb, Pommer, Fass.
* **Drei Figuren als Held-Komposit** (stehen fest wie Knöterich, kein Wandern): Bramsche, Lott, Pahl — passend, weil alle drei ortsgebunden sind (Registratur, Bank).

**Die elf Gestalten sind gegeneinander gesetzt, nicht einzeln gewählt.** Frisur und Oberteil bilden über alle elf Figuren ein eindeutiges Paar, sonst stünden zwei Beschäftigte mit demselben Gesicht und demselben Hemd nebeneinander (Trepp und Fass hatten das zuerst, Zapf und Lisbeth trugen beide Grün). Wer eine Gestalt ändert, prüft die Tabelle als Ganzes.

**Nachtrag G6** (siehe `phase-g6-dorfsicht.md`): Von den acht NPC-Sprites liegen nur drei im Grafikpaket (Farmer_Bob, Bartender_Katy, Miner_Mike). Zapf, Lisbeth, Trepp, Milb und Fass hatten deshalb überhaupt kein Sprite und standen unsichtbar im Dorf; sie laufen jetzt ebenfalls als Held-Komposit, zusätzlich mit Laufreihe. Jede der elf Figuren trägt dafür eine eigene Gestalt (Frisur, Oberteil, Hose, Schuhe), unten je Figur vermerkt. Kommen die fehlenden Blätter ins Paket, greift der Code von selbst wieder darauf zu. Fünf Heimatanker sind in derselben Phase gewandert, weil sie hinter Gebäudefassaden lagen; die neuen Werte stehen unten, die alten daneben.

**Nachtrag G7** (siehe `phase-g7-massstab.md`): Alle elf Heimatanker sind gewandert, und diesmal
liegt es nicht an den Figuren, sondern am Dorf. Die Gebäude werden seit G7 mit `WELT_SC` gezeichnet
und sind damit doppelt so groß wie vorher; die Nordzeile hat ihre Fußlinie auf Kachel 34, die
Südzeile auf 52, dazwischen liegt der Anger. Wer unter einer Fassade steht, bleibt entweder mit
ty zwischen 35 und 42 auf dem Anger oder mit ty ab 53 südlich vor der Südzeile — dort ist er wieder
der Nähere zur Kamera und wird nicht zugedeckt. Die Regel ist dieselbe wie in G6, nur die Zahlen
sind neue. `dorfSichtAssert()` bestätigt für alle elf freie Sicht, am Anker wie auf der Leine.

---

**Nachtrag W-Nörgel** (siehe `phase-w-noergel.md`): Nörgel bekommt vier Zusatzzeilen, die
erst erscheinen, nachdem der Spieler selbst am Lager der Beschwerden war. Sie stehen unten
in seinem Abschnitt. Die sechs Grundzeilen und die fünf Aktzeilen bleiben unverändert.

---

**Nachtrag W11** (siehe `phase-w11-reich-im-dorf.md`): Aus elf Figuren werden vierzehn, und
zehn der elf bekommen Zuwachs. Beides folgt der Weltgeschichte (`weltgeschichte.md`), und
beides ist ausdrücklich Zuwachs und kein Umbau: **keine bestehende Zeile dieser Datei ist
geändert worden.**

Was dazukommt, steht an drei Stellen:

* **Serie 2, ganz unten:** drei neue Figuren, vollständig ausformuliert wie die elf oben.
  Nieselbeck, Kordula Umlauf und Vorblatt. Ihre Zeilen stehen wörtlich in Kapitel 6 der
  Weltgeschichte und sind von dort übernommen, nicht neu erfunden.
* **Je ein Abschnitt „Zusatzzeilen (W11)" bei zehn der elf bestehenden Figuren.** Zwei
  Zeilenpaare je Figur, die den Fund aus der Zuwachs-Tabelle in Kapitel 6 der Weltgeschichte
  tragen. Sie hängen sich hinten an den Grundzeilen-Kreislauf, genau wie Nörgels Lagerzeilen.
* **Sieben zusätzliche Fragen in Bramsches Antworttabelle**, alle zum Reich.

**Der Schalter heißt `abAkt`.** Nörgels Lagerzeilen hängen an einem Merker im Spielstand
(„war der Spieler schon dort"). Die neuen Zeilen hängen stattdessen am Aktstand: `abAkt:3`
heißt, dass sie ab Akt III im Kreislauf stehen und vorher nicht. Dasselbe Feld entscheidet
bei den drei neuen Figuren darüber, ob sie überhaupt schon im Dorf stehen. Außerhalb des
Schichtmodus gibt es keine Akte; dort ist alles offen, so wie es `serieFrei()` mit den
Blattserien hält.

**Warum überhaupt gestaffelt.** Weil die Weltgeschichte es so vorgibt und weil es sonst nicht
funktioniert: Kordula Umlauf ist die Figur, über die der Spieler zum ersten Mal erfährt, dass
Oben ein Ort ist. Stünde sie ab Schicht 1 im Dorf, wäre die Pointe des zweiten Aktes an Tag
eins verschenkt. Vorblatt taucht auf, sobald der Spieler anfängt, gefährlich zu werden, und
nicht vorher. Nur Nieselbeck steht von Anfang an da, und das ist bei ihm der Witz.

---

**Nachtrag SZ2** (siehe `phase-sz2-gespraechsszenen.md`): Drei der neun Szenen aus Kapitel 8
der `weltgeschichte.md` sind gebaut. Zwei davon hinterlassen etwas bei Figuren, die es
schon gab, und deshalb wächst diese Datei noch einmal. Auch hier gilt: **keine bestehende
Zeile ist geändert worden.**

Es kommt an drei Stellen dazu:

* **Fass bekommt einen zweiten Zusatzblock.** Sein erster hängt an `abAkt:4`, der neue an
  einem Merker (`szeneUmlauf`). Der Unterschied ist inhaltlich: die alten Zeilen darf jeder
  hören, der weit genug ist, die neuen nur, wer Kordula Umlauf tatsächlich getroffen hat.
  Dass zwei Blöcke an derselben Figur nebeneinander laufen, ist seit W-Nörgel geklärt.
* **Lott und Pahl bekommen je zwei neue Anlässe**, `umlauf` und `hintermuehl`. Sie sind
  gebaut wie ihre bestehenden Anlass-Zeilen zu `crit` oder `goldfund`, hängen aber nicht an
  einem Kampfereignis, sondern am Ende einer Szene.
* **Die vierzig Zwischenbescheide der zweiten Schublade** stehen nicht hier, sondern im
  Code, weil sie kein Figurentext sind, sondern ein Blatt mit einem Jahreszähler.

**Der Nachklang fällt genau einmal.** `npcSprechen()` verbraucht `letzterAnlass` beim
Lesen. Wer nach der Szene zur Bank geht, hört die Zeile; wer ein zweites Mal fragt, hört
wieder die Grundzeilen. Das ist kein Sonderweg für die Szenen, sondern dasselbe Verhalten,
das die Bank seit jeher für jeden Anlass hat.

## Zwirn — Bürgermeister Alfons Zwirn

Optik: `cfnpc_bob` (Farmer_Bob, wandert). Heimatanker: Kachel (17, 37), vor dem Amt. **G6:** Anker von (14, 34) verschoben, dort stand er vollständig hinter der Amtsfassade; nicht auf (14, 38), weil er sonst die Kontextaktion der Amtstür überstimmt. Ersatzgestalt, falls das Blatt fehlt: Haar h1, Oberteil/Hose Stufe 2, Schuhe Stufe 2. **G7:** Anker von (16, 38) auf (17, 37), der Anger beginnt jetzt bei y=34, das Amt ist fünfzehn Kacheln breit.

### Grundzeilen (Kreislauf bei wiederholtem Ansprechen)

*Neu gefasst mit T1. Die Fassung davor steht unter den Aktzeilen.*

1. „Schön, dass Sie da sind! Wirklich schön.“ (40) / „Ihr Jahresgespräch führe ich.“ (29)
2. „Zum Rückblick: elf Jahre Dorffest.“ (34) / „Vordermühl hatte noch nie eins.“ (31)
3. „Zum Ausblick: wir werden das angehen.“ (37) / „Noch dieses Jahr, vielleicht.“ (29)
4. „Zum Dank: Konfetti ist längst bestellt.“ (39) / „Nur die Genehmigung fehlt noch.“ (31)
5. „Zuständig wäre die Amtsleitung.“ (31) / „Nur weiß ich nicht, wer sie ist.“ (32)
6. „Da bin ich dran. Seit elf Jahren dran.“ (38) / „Man darf nicht lockerlassen.“ (28)

### Aktzeilen

I. „Elf Jahre Vorfreude, noch mehr Händedruck.“ (42)
II. „Wer zuständig ist? Klären wir noch.“ (35)
III. „Der Schreibtisch ist leer. Ich weiß warum.“ (42)
IV. „Ich habe gestanden. Das Fest steht noch aus.“ (44)
V. „Wir werden das Fest feiern. Irgendwann.“ (39)

<details>
<summary>Die Fassung vor T1</summary>

1. „Das Dorffest kommt. Seit elf Jahren.“ (36) / „Vordermühl hatte noch nie eins.“ (31)
2. „Eine Genehmigung fehlt uns noch.“ (32) / „Da bin ich dran.“ (16)
3. „Wir werden das angehen.“ (23) / „Noch dieses Jahr, vielleicht.“ (29)
4. „Schön, dass Sie da sind! Wirklich.“ (34) / „Ihr Jahresgespräch führe ich.“ (29)
5. „Zuständig wäre die Amtsleitung.“ (31) / „Nur weiß ich nicht, wer sie ist.“ (32)
6. „Konfetti habe ich schon bestellt.“ (33) / „Nur die Genehmigung fehlt noch.“ (31)

I. „Elf Jahre Vorfreude, noch mehr Händedruck.“ (42)
II. „Wer zuständig ist? Klären wir noch.“ (35)
III. „Der Schreibtisch ist leer. Ich weiß warum.“ (42)
IV. „Ich habe gestanden. Das Fest steht noch aus.“ (44)
V. „Wir werden das Fest feiern. Irgendwann.“ (39)

</details>

### Zusatzzeilen (W11), ab Akt II

Die Bewilligung des Dorffestes ist im Jahr 1004 erteilt worden. Sie steckt seither in der Röhre unter dem Steinfeld (Weltgeschichte, Kapitel 3 und Serie I, Blatt 5). Zwirn hat seit acht Jahren recht und weiß es nicht. Er sagt deshalb nicht, dass die Genehmigung existiert, sondern nur, dass er damals gefragt hat.

* „Ich habe damals eine Anfrage geschickt.“ (39) / „Nach Oben. Vor acht Jahren.“ (27)
* „Vielleicht ist die Antwort unterwegs.“ (37) / „Post braucht eben ihre Zeit.“ (28)

**Prüfnotiz:** kein Fund in der Kesselgrammatik-Stufe. Der Text bleibt durchgehend beim Dorffest-Genehmigungsverfahren und Zwirns persönlicher Verlegenheit.

---

## Bramsche — Registratorin Ottilie Bramsche

Optik: Held-Komposit (`gestalt`: Haar h3 schwarz, Oberteil/Hose Stufe 2 Königsblau), stehend. Heimatanker: Kachel (21, 36). Der Kater Anlage 3 wird als einfache liegende Form direkt neben ihr gezeichnet, kein eigener Sprite, keine eigene Kontextaktion. **G7:** Anker von (18, 37) auf (21, 36), sie steht weiter am Ostrand des Amts, jetzt neben den Marktständen.

### Grundzeilen (Kreislauf)

1. „Ordnung ist, was man wiederfindet.“ (34) / „Alles andere ist Zufall.“ (24)
2. „In welcher Sache sprechen Sie mich an?“ (38) / „Ohne Antrag sage ich nichts.“ (28)
3. „Ein Antrag, korrekt gestellt, öffnet alles.“ (43) / „Fehlt er, bleibt alles zu.“ (26)
4. „Anlage Drei schläft auf der richtigen Akte.“ (43) / „Ich wecke sie nicht.“ (20)
5. „Einmal gab ich etwas ohne Antrag heraus.“ (40) / „Das war der Brandabschnitt.“ (27)
6. „Was nicht abgelegt ist, existiert nicht.“ (40) / „In welcher Sache also?“ (22)

### Aktzeilen

I. „Ein ruhiger Tag. Die Akten liegen richtig.“ (42)
II. „Neuerdings fragen alle nach der Amtsleitung.“ (44)
III. „Der Schreibtisch bleibt leer. Merkwürdig.“ (41)
IV. „Ein Sack ohne lesbare Anschrift. Seltsam.“ (41)
V. „Ablage V ist offen. Ich lege nichts mehr ab.“ (44)

### Antworttabelle (eine Frage pro Schicht, zufällig gewählt)

| Frage | Antwort |
|---|---|
| Was war der Vorgang 1? | „Vorgang 1 ist der Friedensvertrag.“ (34) / „Nie geschlossen, nur ausgesetzt.“ (32) |
| Wo ist die Amtsleitung? | „N.N. heißt nicht genannt.“ (25) / „Der Posten ist unbesetzt.“ (25) |
| Was ist der Brandabschnitt? | „Er liegt in Zuständigkeitsbereich VII.“ (38) / „Dort endete meine Ausnahme.“ (27) |
| Was ist Ablage V? | „Ablage V führt ins Schattenland.“ (32) / „Zugang nur mit Ausfertigung.“ (28) |
| Wer ist Fürst Nachtrag? | „Fürst Nachtrag ist Herr über Ablage V.“ (38) / „Er steht im Brief als Empfänger.“ (32) |
| Wer ist zuständig für das Dorffest? | „Zuständig wäre die Amtsleitung.“ (31) / „Diese Stelle ist unbesetzt.“ (27) |
| Was liegt in Ablage auf Eis? | „Ablage auf Eis führt nach Frostkamm.“ (36) / „Dort liegt seit Jahren Ruhe.“ (28) |
| Was ist Ablage A? | „Ablage A ist das Grasland.“ (26) / „Die harmloseste aller Ablagen.“ (30) |
| Was ist Hochablage? *(W11)* | „Hochablage ist eine Stadt im Norden.“ (36) / „Vier Tagesreisen. Ohne Straße.“ (30) |
| Wie wird der Rang gerechnet? *(W11)* | „Wie lange der älteste Vorgang offen ist.“ (40) / „Andere Maßstäbe gibt es nicht.“ (30) |
| Was ist ein Aktenhaus? *(W11)* | „Ein Aktenhaus ist eine Familie.“ (31) / „Benannt nach der Zuständigkeit.“ (31) |
| Warum regnet es hier nie? *(W11)* | „Der Niederschlag ist zurückgestellt.“ (36) / „Seit dem Jahr 897.“ (18) |
| Was brummt im Steinfeld? *(W11)* | „Unter dem Steinfeld liegt eine Röhre.“ (37) / „Die Rohrpost. Sie steht still.“ (30) |
| Wer ist der Kaiser? *(W11)* | „Ordinat der Vierte ist im Termin.“ (33) / „Seit dem Jahr 588.“ (18) |
| Was heißt zu Händen? *(W11)* | „Zu Händen schreibt man an Hohe.“ (31) / „Gewöhnliche bekommen nur Post.“ (30) |

**Zur Rang-Antwort (W11).** Die Weltgeschichte formuliert die Regel als „nach dem Alter seines ältesten offenen Vorgangs". Wortgetreu übernommen hat `knAssertCaps()` sie beim ersten Laden gemeldet: **Alter** steht auf der Sperrliste des Kapitels 7 (Seltenheit gleich Alter des Aktenzeichens). Die Auskunft ist dieselbe geblieben, sie kommt jetzt ohne das Wort aus. Das ist kein Schönheitsfehler, sondern genau der Fall, für den es diesen Guard gibt: eine Zeile, die inhaltlich harmlos ist und trotzdem eine gesperrte Vokabel mitbringt.

### Abweisung (wenn die Frage der Schicht schon verbraucht ist)

* „Eine Frage pro Schicht.“ (23) / „Die Ihre ist verbraucht.“ (24)
* „In welcher Sache?“ (17) / „Das hatten wir schon.“ (21)
* „Antrag für heute erledigt.“ (26) / „Morgen wieder.“ (14)

### Zusatzzeilen (W11), ab Akt III

Der Herr aus Hochablage von 985 (Weltgeschichte, Kapitel 2). Sie hält sich für schuldig am Brandabschnitt. In Wahrheit hat ihr Griff daneben die Archivausfertigung gerettet, und sie erfährt das nie. Die Zeilen sagen deshalb nur die Hälfte, die sie selbst kennt.

* „Damals kam ein Herr aus Hochablage.“ (35) / „Er war ausgesprochen höflich.“ (29)
* „Seitdem gebe ich nichts ohne Antrag.“ (36) / „Höflichkeit ist kein Antrag.“ (28)

**Prüfnotiz:** kein Fund in der Kesselgrammatik-Stufe. Besonders geprüft: „Anlage Drei“ (generischer Aktenanhang, keine Verbindung zu „drei Zutaten“), „Ausfertigung“ bei Ablage V (einzelnes Zutrittsdokument, nicht die dreifache Beglaubigung). Alle Antworten nennen ausschließlich Fundorte/Zusammenhänge, nie Mechanik.

---

## Zapf — Hausmeister Reinhold Zapf

Optik: `cfnpc_jack` (Lumberjack_Jack, wandert). Heimatanker: Kachel (17, 54). **G6:** Anker eine Kachel nach Süden, sonst wanderte er hinter Haus 3. Das Blatt liegt nicht im Grafikpaket, er läuft als Held-Komposit: Haar h1 (kurz braun), Oberteil/Hose Stufe 1 (grün, Arbeitszeug), Schuhe Stufe 0. **G7:** Anker von (16, 47) auf (17, 54), wieder vor der Südzeile, deren Fußlinie von 46 auf 52 gewandert ist.

### Grundzeilen (Kreislauf)

1. „Ich reparier das. Nicht fragen.“ (31) / „Weil sonst nichts läuft.“ (24)
2. „Das Regal wackelt. Ich keile es fest.“ (37) / „Sonst kippt hier alles um.“ (26)
3. „Ich habe Werkzeug dabei.“ (24) / „Immer. Für alle Fälle.“ (22)
4. „Kaffee tropft. Ich beseitige das.“ (33) / „Kaffee ist ein Betriebsrisiko.“ (30)
5. „Tür klemmt. Ich mach sie leise.“ (31) / „Damit niemand was merkt.“ (24)
6. „Registratur ruft schon wieder.“ (30) / „Ich hab aber nur zwei Hände.“ (28)

### Aktzeilen

I. „Neuer Außendienstler. Tür schon kaputt?“ (39)
II. „Fest oder nicht, Bühne muss stehen.“ (35)
III. „Leerer Stuhl. Quietscht trotzdem.“ (33)
IV. „Sack ist eingerissen. Ich nähe das.“ (35)
V. „Nichts kaputt. Komisches Gefühl.“ (32)

### Zusatzzeilen (W11), ab Akt IV

Der Stopfen unter dem Steinfeld (Weltgeschichte, Kapitel 2, Jahr 741, und Langvorgang 10). Zapf beendet damit den Krieg, und zwar mit Werkzeug. Kein Satz wird ihm dafür länger als sechs Wörter, das ist seine Sprachmarke aus Kapitel 8.

* „Im Steinfeld brummt der Boden.“ (30) / „Ich hole das Werkzeug.“ (22)
* „Ein Rohr. Verstopft. Sehr alt.“ (30) / „Kriegen wir auf.“ (16)

**Prüfnotiz:** kein Fund. Zapfs Weltbibel-Pflichtsatz über den Kessel („Der Kessel ist kein Kessel. Der Kessel ist ein Kopierer.“) ist bewusst **nicht** in den Grundzeilen-Kreislauf übernommen — er steht bereits wörtlich in Kapitel 8 als seine Signaturzeile, gehört aber dorthin, wo er einmalig trifft, nicht in einen Kreislauf, der sich abnutzt. Bleibt als offene Option für einen späteren, gezielten Einbau (z. B. eine Aktzeile), hier nicht spekulativ vorgebaut.

---

## Lisbeth — Praktikantin Lisbeth Fuhr

Optik: `cfnpc_chloe` (Chef_Chloe, wandert). Heimatanker: Kachel (3, 40). **G6:** Anker von (10, 42) verschoben, dort war sie am Stand schon zu 46 Prozent von Haus 2 verdeckt. Das Blatt liegt nicht im Grafikpaket, sie läuft als Held-Komposit: Haar h6 (Knoten), Oberteil Stufe 1 (grün), Hose Stufe 0 (rot), Schuhe Stufe 3. **G7:** Anker von (8, 40) auf (3, 40), Westseite des Angers; Haus 2 ist neun statt fünf Kacheln breit.

### Grundzeilen (Kreislauf)

1. „Man erledigt Monster nicht.“ (27) / „Man beantwortet sie.“ (20)
2. „Und wenn er einfach nur wartet?“ (31) / „Das fragt hier keiner gern.“ (27)
3. „Sechstes Jahr Praktikum, immer noch unbezahlt.“ (46) / „Es fehlt nur eine Unterschrift.“ (31)
4. „Es fehlt eine weisungsbefugte Person.“ (37) / „Es gibt sie einfach nicht.“ (26)
5. „Mein Traum: ein Amt für Monster.“ (32) / „Nicht gegen sie, für sie.“ (25)
6. „Ich stelle nur die Fragen, die stören.“ (38) / „Antworten fehlen meistens.“ (26)

### Aktzeilen

I. „Ich zähle mit, aber ich frage schon.“ (36)
II. „Jetzt fragt endlich jemand mit mir.“ (35)
III. „Ein leerer Stuhl. Genau mein Problem.“ (37)
IV. „Fragen Sie Nörgel. Er kann das lesen.“ (37)   *(W5, `45912f6`: umformuliert, siehe `phase-w5-vorgang.md`. Vorher: „Ich habe nur gefragt, wer lesen kann.“)*
V. „Ich komme mit. Ich habe ja gefragt.“ (35)   *(W5, `45912f6`. Vorher: „Vielleicht braucht er nur eine Antwort.“)*

### Zusatzzeilen (W11), ab Akt III

Sie hat als Einzige gemerkt, dass Fürst Nachtrag einen Titel trägt und die übrigen Vorgangsarten nicht (Weltgeschichte, Kapitel 6). Es steht auf Seite zwei ihres sechsten Praktikumsberichts. Niemand hat ihn je gelesen, und sie rechnet auch nicht damit.

* „Der Fürst hat einen Titel. Die anderen nicht.“ (45) / „Steht in meinem Bericht.“ (24)
* „Seite zwei. Hat nie jemand gelesen.“ (35) / „Ist vielleicht auch nichts.“ (27)

**Prüfnotiz:** kein Fund.

---

## Trepp — Zusteller Emil Trepp der Siebte

Optik: `cfnpc_fin` (Fisherman_Fin, wandert, 9-spaltiges Sheet). Heimatanker: Kachel (28, 40). **G6:** Anker eine Kachel nach Norden, sonst wanderte er hinter die Scheune. Das Blatt liegt nicht im Grafikpaket, er läuft als Held-Komposit: Haar h2 (blonde Tolle), Oberteil Stufe 2 (blau, wie eine Zustelluniform), Hose Stufe 0 (rot), Schuhe Stufe 1. **G7:** Anker von (22, 40) auf (28, 40), Ostseite des Angers, hinter den Marktständen vorbei.

### Grundzeilen (Kreislauf)

1. „Wenn ich kurz stören darf.“ (26) / „Sieben Generationen Trepp.“ (26)
2. „Wenn ich kurz stören darf.“ (26) / „Der Brief ist immer im Sack.“ (28)
3. „Wenn ich kurz stören darf.“ (26) / „Die Adresse ist unleserlich.“ (28)
4. „Wenn ich kurz stören darf.“ (26) / „Ich starre sie schon ewig an.“ (29)
5. „Wenn ich kurz stören darf.“ (26) / „Vielleicht heute lesbar?“ (24)
6. „Wenn ich kurz stören darf.“ (26) / „Zustellung bleibt Zustellung.“ (29)

### Aktzeilen

I. „Ein Brief im Sack, wie immer.“ (29)
II. „Alle reden vom Amt, ich trage den Brief.“ (40)
III. „Ein leerer Stuhl, ein Brief, der bleibt.“ (40)
IV. „Sieben Generationen, und es ist ein Name.“ (41)
V. „Sieben Generationen, jetzt oder nie.“ (36)

### Zusatzzeilen (W11), ab Akt III

Seine Amtsbezeichnung lautet Schattenlandzustellungsbevollmächtigter. Ein Bevollmächtigter ist im Reich ein Adelsamt (Weltgeschichte, Kapitel 6). Trepp ist von Amts wegen adelig und trägt Post aus, weil ihm das nie jemand gesagt hat. Er sagt es hier auch nicht, er liest nur seinen Ausweis vor.

* „Wenn ich kurz stören darf.“ (26) / „Meine Bezeichnung ist sehr lang.“ (32)
* „Schattenlandzustellungsbevollmächtigter.“ (40) / „Steht so im Ausweis. Ehrlich.“ (29)

**Prüfnotiz:** kein Fund. Trepps feste Sprachmarke („Wenn ich kurz stören darf.“) wiederholt sich bewusst als z1 in allen sechs Grundzeilen — das ist seine Sprachmarke, keine Textarmut.

---

## Nörgel — Sachbearbeiter auf Probe

Optik: `cfnpc_mike` (Miner_Mike, wandert, leichte grüne Tönung). Heimatanker: Kachel (1, 36). Ersatzgestalt, falls das Blatt fehlt: Haar h1, Oberteil/Hose Stufe 0, Schuhe Stufe 3. **G7:** Anker von (8, 38) auf (1, 36), Nordwestecke des Angers, neben Haus 1.

**Nachtrag G9/G10/U6 zur Optik.** Die Zeile oben ist überholt und bleibt als Stand stehen. G9 hat die Tönung durch einen eigenen Hautton ersetzt (`#949341`, färbt Gesicht und Hände statt der ganzen Figur), G10 hat ihn auf ein Monsterrig gestellt, weil er ein Kobold ist und das Helden-Rig keine spitzen Ohren hat, und U6 hat das Rig berichtigt: nicht `orc_chief`, sondern `goblin_maceman` im Maßstab der Grünhaut (`rigSc` 1,8 = `sc` 1,5 mal `psc` 1,2 aus `MONDEF.goblin`). Er trägt damit exakt das Sprite der Gegner, über die er unten sagt „Grünhaut. Wie ich.", und steht gut halb so hoch wie die Menschen um ihn herum. Das Komposit aus `gestalt` bleibt der Rückfallweg ohne Grafikpaket.

### Grundzeilen (Kreislauf)

1. „Vierzig Jahre Probezeit.“ (24) / „Nächstes Jahr wird entfristet.“ (30)
2. „Die Entfristung macht die Amtsleitung.“ (38) / „Die sieht man nie.“ (18)
3. „Ich habe mich damals beschwert.“ (31) / „Dann hat man mich eingestellt.“ (30)
4. „Ich trage eine Krawatte.“ (24) / „Fällt niemandem auf.“ (20)
5. „Ich beschwere mich auch über mich.“ (34) / „Berechtigt, wie meistens.“ (25)
6. „Das ist nicht meine Zuständigkeit.“ (34) / „Ich mache es trotzdem.“ (22)

### Aktzeilen

I. „Noch ein Formular, noch keine Antwort.“ (38)
II. „Jetzt braucht auch Zwirn die Amtsleitung.“ (41)
III. „Die Stelle ist leer, ich bin es nicht.“ (38)
IV. „Gelesen und gezeichnet. Ich bin im Dienst.“ (42)   *(W5, `45912f6`. Vorher: „Niemand fragt mich. Jetzt fragen alle.“)*
V. „Auch jetzt ist es nicht meine Zuständigkeit.“ (44)

### Zusatzzeilen, erst nach dem Lager (Nachtrag W-Nörgel)

Freigeschaltet von `kn.flags.hatLagerGesehen`, siehe `phase-w-noergel.md`. Sie hängen sich
hinten an den Kreislauf, wie die Probezeit-Hinweise aus W7 auch, und stehen dort vor diesen.
Ohne Lagerbesuch spricht Nörgel Zeile für Zeile wie vorher.

1. „Hinter der Palisade stehen meine Leute.“ (39) / „Grünhaut. Wie ich.“ (18)
2. „Die belagern nichts. Die warten.“ (32) / „Seit vierhundert Jahren.“ (24)
3. „Die schreiben. Nur liest es hier keiner.“ (40) / „Ich könnte. Fragt ja niemand.“ (29)
4. „Gehen Sie wieder hin. Ohne zu schlagen.“ (39) / „Dann sehen Sie es selbst.“ (25)

**Prüfnotiz:** kein Fund. Zeile 3 ist die einzige heikle: sie trägt die Pointe aus Kapitel 8
(„Man muss ihn nur fragen. In vierhundert Jahren hat niemand einen Goblin gefragt.“) bis an
den Rand und nicht darüber. Nörgel sagt nicht, was dort steht, sagt nicht, dass er den Brief
im Sack meint, und niemand kann ihn im Spiel danach fragen. Die Zustellung bleibt bei Trepp
und in Akt V. Ein erster Entwurf lautete „Am Tor hängt Schrift. Ich kann die lesen.“ und ist
gestrichen: am Torblatt hängen zwei Banner ohne Schrift, der Satz hätte etwas behauptet,
was im Bild nicht steht.

### Zusatzzeilen (W11), ab Akt IV

Vorblatt bietet Nörgel die Entfristung an, damit er die Anschrift auf dem Umschlag nicht liest (Weltgeschichte, Kapitel 6 und Szene 7). Vierzig Jahre Probezeit gegen ein Unterlassen. Nörgel sagt nicht, wie er sich entscheidet. Diese zwei Paare stehen neben den vier Lagerzeilen und stören sich nicht: der eine Block hängt am Merker, der andere am Akt.

* „Der Herr aus Oben hat mich angesprochen.“ (40) / „Er bietet mir die Entfristung.“ (30)
* „Ich soll dafür etwas nicht tun.“ (31) / „Vierzig Jahre. Und jetzt das.“ (29)

**Prüfnotiz:** kein Fund. Dass Nörgel die Dienstbericht-Bemerkungen schreibt (Kapitel 8, „Die Auflösung“), wird hier nicht ausgesprochen — das bleibt der Spielbeobachtung überlassen, kein Text erklärt es.

---

## Milb — Gutachter Dr. phil. Milb

Optik: `cfnpc_buba` (Farmer_Buba, wandert, neutral/ungetönt). Heimatanker: Kachel (8, 39). Das Blatt liegt nicht im Grafikpaket, er läuft als Held-Komposit: Haar h5 (lang grau), Oberteil/Hose Stufe 2 (blau), Schuhe Stufe 1. **G7:** Anker von (11, 39) auf (8, 39), Anger, westlich der Mitte.

### Grundzeilen (Kreislauf)

*Neu gefasst mit T1. Die Fassung davor steht unter den Aktzeilen.*

1. „Erstens der Gegenstand. Diese Kammer.“ (37) / „Ungefragt, versteht sich.“ (25)
2. „Zweitens der Maßstab. Der Vordruck.“ (35) / „Sechs Zeilen. Genügt seit je.“ (29)
3. „Das würde ich mit Drei ansetzen.“ (32) / „Höchstens. Das ist drittens.“ (28)
4. „Viertens der Vorbehalt. Meine Zahlen stimmen.“ (45) / „Nur wo, weiß ich nicht.“ (23)
5. „Ein Gutachten ist nie fertig.“ (29) / „Nur eingestellt.“ (16)
6. „Andere raten. Ich stufe ein.“ (28) / „Das ist ein Unterschied.“ (24)

### Aktzeilen

I. „Die neue Kraft schätze ich auf Zwei.“ (36)
II. „Ohne Freigabe stufe ich das niedrig ein.“ (40)
III. „Ein leerer Stuhl lässt sich nicht bewerten.“ (43)
IV. „Diese Schrift verweigert sich der Note.“ (39)
V. „Diesmal setze ich keine Note mehr an.“ (37)

<details>
<summary>Die Fassung vor T1</summary>

1. „Das würde ich mit Drei ansetzen.“ (32) / „Höchstens.“ (10)
2. „Diese Kammer würde ich einstufen.“ (33) / „Ungefragt, versteht sich.“ (25)
3. „Manche Kammern fühlen sich falsch an.“ (37) / „Das beunruhigt mich.“ (20)
4. „Meine Zahlen stimmen immer. Fast.“ (33) / „Nur wo, weiß ich nicht.“ (23)
5. „Ein Gutachten ist nie fertig.“ (29) / „Nur eingestellt.“ (16)
6. „Andere raten. Ich stufe ein.“ (28) / „Das ist ein Unterschied.“ (24)

I. „Die neue Kraft schätze ich auf Zwei.“ (36)
II. „Ohne Freigabe stufe ich das niedrig ein.“ (40)
III. „Ein leerer Stuhl lässt sich nicht bewerten.“ (43)
IV. „Diese Schrift verweigert sich der Note.“ (39)
V. „Diesmal setze ich keine Note mehr an.“ (37)

</details>

### Zusatzzeilen (W11), ab Akt II

Milb liegt auch bei der Hoheitsstufe des eigenen Hauses eine Stufe daneben, nach oben (Weltgeschichte, Kapitel 6). Ein Jahr reicht für Ritter der Vorlage, nicht für Freiherr. Er merkt es nicht, wie immer, und niemand rechnet nach.

* „Unser ältester Vorgang wird ein Jahr.“ (37) / „Das reicht für Freiherr. Knapp.“ (31)
* „Ich stelle mich als Freiherr vor.“ (33) / „Geschätzt, nicht geraten.“ (25)

**Prüfnotiz:** kein Fund. Die Zahlwörter „Drei“ und „Zwei“ wurden gezielt gegengeprüft (Nähe zu „drei Zutaten“/„zwei harte Flüche“) — es sind Milbs eigene Schulnoten für unspezifische Objekte (Kraft, Kammer als Amtsraum), keine Bezugnahme auf Zutatenzahl oder Fluch-Obergrenze.

---

## Pommer — Materialausgabe Herr Pommer

Optik: `cfnpc_katy` (Bartender_Katy, wandert). Heimatanker: Kachel (11, 54). **G6:** Anker zwei Kacheln nach Süden, sonst wanderte er hinter Haus 3. Ersatzgestalt, falls das Blatt fehlt: Haar h2, Oberteil Stufe 1, Hose Stufe 0, Schuhe Stufe 4. **G7:** Anker von (13, 47) auf (11, 54), wieder vor der Südzeile.

### Grundzeilen (Kreislauf)

1. „Auf dem Antrag steht Eimer. Nicht Kanne.“ (40) / „Eimer ist Eimer. Fertig.“ (24)
2. „Auf dem Antrag steht Montag. Nicht heute.“ (41) / „Kommen Sie am Montag wieder.“ (28)
3. „Wortlaut ist Wortlaut. Sonst nichts.“ (36) / „Ich lese nur vor.“ (17)
4. „Steht da leicht, geht leicht heraus.“ (36) / „Nicht schwer. Leicht.“ (21)
5. „Ich betone nur, was dasteht.“ (28) / „Manchmal falsch betont.“ (23)
6. „Kein Antrag, kein Material. So steht es.“ (40) / „So steht es.“ (12)

### Aktzeilen

I. „Antrag korrekt, Ausgabe korrekt. Nächster.“ (42)
II. „Zwirns Antrag fehlt. Kein Fest ohne Antrag.“ (43)
III. „Wer unterschreibt jetzt meine Freigaben?“ (40)
IV. „Ein Sack, kein Antrag dazu. Unglaublich.“ (40)
V. „Zustellen steht nicht in meinem Bestand.“ (40)

### Zusatzzeilen (W11), ab Akt II

Pommer führt eine Liste der Dinge, die er ausgegeben hat, ohne dass sie beantragt waren (Weltgeschichte, Kapitel 6). Die Liste ist leer. Er ist sehr stolz auf die Liste.

* „Ich führe eine Liste. Seit Jahren.“ (34) / „Sie ist leer. Das ist die Liste.“ (32)
* „Nichts ohne Antrag ausgegeben. Nie.“ (35) / „Steht alles nicht darin.“ (24)

**Prüfnotiz:** Erste Reparaturstufe fand zwei Sperrvermerk-nahe Formulierungen im Entwurf und ersetzte sie. Original-Grundzeile 1 spielte mit Groß-/Kleinschreibung „Schild“/„schild“ — strukturell nah an „Substantiv bestimmt den Slot“, zumal Schild selbst ein Ausrüstungsgegenstand ist. Ersetzt durch die Eimer/Kanne-Fassung oben. Original-Grundzeile 2 ließ Pommer ein Adjektiv („scharf“) wie ein Material ausgeben — strukturell identisch mit „Adjektiv bestimmt die Wirkung“. Ersetzt durch die Montag/heute-Fassung oben. Die dritte, unabhängige Stufe fand in der reparierten Fassung keinen weiteren Fund.

---

## Fass — Wirt Bruno Fass, Gasthaus „Zum Letzten Stempel“

Optik: `cfnpc_bruno` (Bartender_Bruno, wandert). Heimatanker: Kachel (24, 38). Das Blatt liegt nicht im Grafikpaket, er läuft als Held-Komposit: Haar h3 (kurz schwarz), Oberteil Stufe 0 (rot), Hose Stufe 2 (blau), Schuhe Stufe 2. **G7:** Anker von (20, 39) auf (24, 38), Ostseite, vor den Marktständen.

### Grundzeilen (Kreislauf)

1. „Wie war der Tag da draußen?“ (27) / „Setz dich. Bleib ein bisschen.“ (30)
2. „Zum Letzten Stempel schließt nie zu früh.“ (41) / „Bleib, so lang du willst.“ (25)
3. „Alle hauen ab, bevor der Käse kommt.“ (36) / „Schade eigentlich.“ (18)
4. „Einmal bleibt wer bis zum Schluss.“ (34) / „Das wär mal was.“ (16)
5. „Hier redet sich manches leichter.“ (33) / „Bei Suppe und Bier.“ (19)
6. „Kaum eingekehrt, schon wieder Dienst.“ (37) / „So ein Jammer.“ (14)

### Aktzeilen

I. „Ein neues Gesicht am Tresen heute.“ (34)
II. „Die Gespräche werden länger, die Krüge auch.“ (44)
III. „Der Stammtisch hat eine Lücke.“ (30)
IV. „Heute sitzen alle enger zusammen.“ (33)
V. „Es fühlt sich an wie ein letzter Abend.“ (39)

### Zusatzzeilen (W11), ab Akt IV

Der Wirt weiß, was der Hausname verspricht (Weltgeschichte, Kapitel 6). Er hat ihn vom Großvater, und der hatte ihn von jemandem, der es wusste. Erklärt wird er auch hier nicht, gesagt wird nur, woher er kommt. Die Du-Form bleibt, sie ist seine Sprachmarke.

* „Der Name kommt vom Großvater.“ (29) / „Der wusste, was er verspricht.“ (30)
* „Irgendwann setzt einer den letzten.“ (35) / „Dann trink noch einen.“ (22)

**Prüfnotiz:** kein Fund. Der Hausname „Zum Letzten Stempel“ bleibt reiner Ortsname und klingt in Grundzeile 2 nur an, wird nie erklärt — genau wie Kapitel 8 es verlangt.

### Zusatzzeilen (SZ2), nach Kordula Umlaufs Besuch

Zweiter Zusatzblock an derselben Figur. Er hängt nicht am Aktstand, sondern am Merker `szeneUmlauf`, also am Ende von Szene 2. Fass wirft in dieser Szene selbst eine Zeile ein („Oben ist eine Redensart“); danach hat er eine Meinung über die Botin, und die steht hier. Der Bäcker ist der Witz: Kordula Umlauf erzählt in der Szene von einem Bruno, der oben Brot backt, und Fass heißt selbst Bruno. Aufgelöst wird das nicht.

* „Die Botin war da. Hat viel geredet.“ (35) / „Und schnell gegessen.“ (21)
* „Sie kennt einen Bäcker. Bruno heißt er.“ (39) / „Wie ich. Merkwürdig.“ (20)

**Prüfnotiz:** kein Fund. „Oben“ bleibt auch hier unerklärt, der Namensgleichklang wird nur gesetzt, nie kommentiert.

---

## Lott — auf der Bank am Dorfplatz

Optik: Held-Komposit (`gestalt`: Haar h1 braun, keine Rüstungs-Layer wie Knöterich), stehend/sitzend fest. Heimatanker: Kachel (5, 54), neben Pahl. **G7:** Anker von (9, 47) auf (5, 54), die Bank steht weiter vor der Südzeile.

### Grundzeilen, Basis-Variante (wenn seit Schichtbeginn nichts Nennenswertes passiert ist)

1. „Der Neue. Schon wieder unterwegs.“ (33) / „Ich sitze. Zuständig für nichts.“ (32)
2. „Der Neue. Schlägt wieder alles kurz und klein.“ (46) / „Sauber. Nichts bleibt stehen.“ (29)
3. „Der Neue. Läuft, wo ich nur sitze.“ (34) / „Manche stehen auf. Ich nicht.“ (29)
4. „Der Neue. Mutig. Nicht mein Bereich.“ (36) / „Ich sag nur, was ich sehe.“ (26)
5. „Der Neue. Wieder klatschnass vom Kampf.“ (39) / „Ich bleibe trocken. Prinzip.“ (28)
6. „Der Neue. Frag lieber Herrn Pahl.“ (33) / „Der hat mehr Geduld als ich.“ (28)

### Aktzeilen

I. „Der Neue zählt Konfetti. Süß.“ (29)
II. „Krieg ausgesetzt. Ich sitze weiter.“ (35)
III. „N.N. Wenigstens fragt niemand nach mir.“ (39)
IV. „Ich lese keine Adressen. Ich sitze.“ (35)
V. „Der Neue zieht los. Kein Kommentar heut.“ (40)

### Anlass-Zeilen (kommentiert das jeweils letzte Ereignis, z2 spielt auf Pahl an)

**crit:** „Direkt ins Aktenzeichen.“ / „Pahl schweigt. Wie erwartet.“ — „Das war kein Zufall. Glaub ich.“ / „Pahl, klatsch doch mal mit.“ — „Ein Treffer für die Geschichtsbücher.“ / „Pahl nickt. Immerhin das.“

**levelup:** „Der Neue wird befördert. Von wem?“ / „Pahl weiß es auch nicht.“ — „Höher, weiter, immer noch sitzend hier.“ / „Pahl klatscht. Ich nicke.“ — „Stufe hoch. Bank bleibt gleich.“ / „Pahl, freu dich für ihn.“

**ultimate:** „Na sowas. Ganz schön viel Zauber.“ / „Pahl duckt sich schon mal.“ — „Das hat sicher eine Genehmigung. Oder?“ / „Pahl fragt nicht nach. Klug.“ — „So viel Licht. Meine Augen, meine Akte.“ / „Pahl blinzelt. Sonst nichts.“

**fluch:** „Neuer Fluch. Kleingedrucktes, wie immer.“ / „Pahl liest es. Ich nie.“ — „Jede Gabe hat einen Haken. Amtlich.“ / „Pahl nennt das gerecht.“ — „Noch ein Fluch. Passt zur Sammlung.“ / „Pahl seufzt fürs Protokoll.“

**goldfund:** „So viel Gold. Ich brauch keins.“ / „Pahl rechnet schon mit.“ — „Klingt nach Feierabend. Für dich.“ / „Pahl fragt: für wen sonst?“ — „Viel Gold. Wenig Aussicht auf Rente.“ / „Pahl lacht. Ich nicht.“

**kammerAbbruch:** „Nichts gefunden. Passiert den Besten.“ / „Pahl zählt trotzdem mit.“ — „Leere Kammer. Voller Rückweg.“ / „Pahl seufzt lauter als ich.“ — „Manchmal ist leer auch eine Antwort.“ / „Pahl widerspricht. Natürlich.“

**untaetigkeit:** „Der Neue steht. Wie ich. Interessant.“ / „Pahl findet das gruselig.“ — „Willkommen im Klub. Bank ist frei.“ / „Pahl rückt trotzdem nicht.“ — „Steh nicht so rum. Das ist mein Job.“ / „Pahl übernimmt notfalls.“

### Zusatzzeilen (W11), ab Akt III

Vordermühl steht in keinem Bestand (Weltgeschichte, Kapitel 5, und Serie G, Blatt 6). Wer nie geführt wurde, kann auch nicht abgeschlossen werden. Das ist der Grund, aus dem die beiden noch da sind, und es ist die freundlichste Zeile dieses Spiels.

* „Wir zwei standen nie in einem Bestand.“ (38) / „Pahl sagt, das sei ein Glück.“ (29)
* „Wer nicht geführt wird, bleibt da.“ (34) / „Pahl nickt. Ausnahmsweise.“ (26)

### Anlass-Zeilen (SZ2): der Nachklang der Szenen

Zwei neue Anlässe, gebaut wie die sieben darüber. `umlauf` fällt, nachdem der Spieler Szene 2 gesehen hat, `hintermuehl` nach Szene 4. Von den Zeilen der Quelle liegen zwei hier und zwei bei Pahl; wer beide anspricht, bekommt den vollständigen Wortwechsel, wer nur einen anspricht, die Hälfte. Das ist die Bank, wie sie immer war.

**umlauf:** „Die kommt alle achtzig Jahre.“ (29) / „Pahl merkt sich so etwas.“ (25) — „Eine Botin. Die hat es eilig.“ (29) / „Pahl hätte gern die Liste.“ (26)

**hintermuehl:** „Er hat es gesagt.“ (17) / „Nach vierzig Jahren.“ (20) — „Da war ein Wort. Ein einziges.“ (30) / „Pahl hat es auch gehört.“ (24)

**Prüfnotiz:** kein Fund. Besonders geprüft: „Direkt ins Aktenzeichen“ (kein Bezug zu Alter/Seltenheit), „Jede Gabe hat einen Haken. Amtlich.“ (sagt nur DASS, nie WARUM/WIE, kein Bescheid-Bezug).

---

## Pahl — auf der Bank am Dorfplatz

Optik: Held-Komposit (`gestalt`: Haar h4 ingwerfarben, keine Rüstungs-Layer), stehend/sitzend fest. Heimatanker: Kachel (8, 54), neben Lott. **G7:** Anker von (11, 47) auf (8, 54), die Bank steht weiter vor der Südzeile, neben Lott.

### Grundzeilen, Basis-Variante

1. „Der Neue. Wieder unterwegs.“ (27) / „Ich sehe zu. Das reicht mir.“ (28)
2. „Sie kämpfen. Ich sehe nur zu.“ (29) / „Zwei Berufe. Meiner ist leicht.“ (31)
3. „Die Bank ist warm. Ich bleibe.“ (30) / „Kommentieren wärmt genauso gut.“ (31)
4. „So nannte ich schon viele Neue.“ (31) / „Der Name bleibt. Sie wechseln.“ (30)
5. „Ob ich ein Vorgang bin? Unhöflich.“ (34) / „Fragen Sie das nicht noch mal.“ (30)
6. „Die Sonne dreht sich. Ich nicht.“ (32) / „Kommentar ist auch ein Beruf.“ (29)

### Aktzeilen

I. „Wieder einer, der alles ernst nimmt.“ (36)
II. „Ein Fest ohne Erlaubnis. Wie hübsch.“ (36)
III. „Ein Platz bleibt leer. Auffällig leer.“ (38)
IV. „Ein Brief, den keiner lesen will.“ (33)
V. „Es wird still. Auffällig still hier.“ (36)

### Anlass-Zeilen (z2 spielt auf Lott an)

**crit:** „Ein Treffer. Sauber getroffen.“ / „Lott hat sowas noch nie gesehen.“ — „Das saß. Sogar ich hab's gemerkt.“ / „Lott schläft schon wieder.“ — „Kritisch. Sehr kritisch sogar.“ / „Notieren Sie das, Lott.“

**levelup:** „Eine Stufe höher. Wie fein.“ / „Lott zählt bestimmt falsch.“ — „Sie wachsen. Ich sitze weiter.“ / „Lott klatscht schon wieder.“ — „Stufenaufstieg. Herzlichen Glückwunsch.“ / „Lott, klatschen Sie leiser.“

**ultimate:** „Das war groß. Richtig groß.“ / „Lott hat die Augen zugemacht.“ — „Ein großer Zauber. Beeindruckend.“ / „Lott, aufwachen. Das war gut.“ — „So viel Kraft für so wenig Feind.“ / „Lott findet das übertrieben.“

**fluch:** „Ein Fluch mehr. Passt zu Ihnen.“ / „Lott nennt das nur konsequent.“ — „Schon wieder ein Haken dabei.“ / „Lott freut sich klammheimlich.“ — „Ein Fluch. Man gewöhnt sich daran.“ / „Lott gewöhnt sich nie.“

**goldfund:** „So viel Gold. Alles echt?“ / „Lott zählt es heimlich mit.“ — „Ein Sack voll Glück. Kommt kaum vor.“ / „Lott will die Hälfte haben.“ — „Reich geworden. Vorübergehend.“ / „Lott nennt das Statistik.“

**kammerAbbruch:** „Nichts gefunden. Auch eine Leistung.“ / „Lott sieht das anders.“ — „Leer rausgekommen. Ehrlich immerhin.“ / „Lott nennt das Verschwendung.“ — „Keine Beute. Kommt öfter vor.“ / „Lott führt da eine Liste.“

**untaetigkeit:** „Der Neue steht. Ich sitze auch.“ / „Lott findet das gemütlich.“ — „Nichts passiert. Endlich Ruhe.“ / „Lott redet trotzdem weiter.“ — „Sie stehen nur. Ich auch.“ / „Lott hält das für Faulheit.“

### Zusatzzeilen (W11), ab Akt III

Hintermühl von der anderen Seite der Bank (Weltgeschichte, Kapitel 5). Das Dorf ist nicht niedergebrannt worden, es ist zugeklappt worden, und das ist das Stillste, was in dieser Welt passieren kann. Ob die beiden selbst Vorgänge sind, bleibt offen (Weltbibel, Kapitel 16).

* „Man hat unser Dorf zugeklappt.“ (30) / „Lott spricht nicht darüber.“ (27)
* „Kein Feuer. Ein Aktendeckel.“ (28) / „Lott war auch dabei.“ (20)

### Anlass-Zeilen (SZ2): die andere Seite der Bank

Dieselben zwei Anlässe wie bei Lott, mit den beiden übrigen Zeilen der Quelle. Pahl nennt in `hintermuehl` das Wort nicht, das Knöterich gesagt hat; er sagt nur, wie lange sie darauf gewartet haben. Ausgesprochen wird *Hintermühl* in Szene 4 genau einmal, und dabei bleibt es.

**umlauf:** „Sie sagt jedes Mal, es war nett.“ (32) / „Lott glaubt ihr das sogar.“ (26) — „Vierzehn Türme. Und sie läuft.“ (30) / „Lott würde den Aufzug nehmen.“ (29)

**hintermuehl:** „Wir haben ja gewartet.“ (22) / „Wir warten gut.“ (15) — „Vierzig Jahre für ein Wort.“ (27) / „Lott sagt gar nichts mehr.“ (26)

**Prüfnotiz:** kein Fund. „Ob ich ein Vorgang bin? Unhöflich.“ bleibt reine Abwehr der Frage (Kapitel 16: „wird nie geklärt“), ohne jede Erklärung.

---

---

## Dorf-Figuren, Serie 2: drei Figuren aus dem Reich — ERLEDIGT (eingebaut mit W11)

Inhaltslieferung zu Bauabschnitt **W11** ("Das Reich im Dorf"), Quelle ist Kapitel 6 der
`weltgeschichte.md`. Die Zeilen stehen dort ausgeschrieben und gegengezählt; sie sind von dort
übernommen und nicht neu erfunden. Was hier dazukommt, ist das, was der Code braucht und die
Weltgeschichte offenlässt: Heimatanker, Gestalt, Anredeform und der Akt, ab dem die Figur da ist.

**Alle drei sind Held-Komposite** (`opt:'fest'`, stehen fest wie Bramsche, Lott und Pahl). Der
Grund ist nicht Bequemlichkeit: die acht NPC-Blätter aus `CF_NPCS` sind an die elf Figuren der
Serie 1 vergeben, und zwei Figuren mit demselben Gesicht nebeneinander war in G6 genau der
Fehler, den wir nicht wollten. Frisur und Oberteil bilden auch mit den drei neuen über alle
vierzehn Figuren ein eindeutiges Paar.

**Zur vierten Figur aus Kapitel 6, Konrad zu Händen Aufschub:** Er steht bewusst nicht hier. Die
Weltgeschichte sagt über ihn, er erscheine nur, wenn das Spiel Hochablage zeigt, also im Intro,
in Serie H und im Abspann. Vordermühl zeigt Hochablage nie. Ihn ins Dorf zu stellen, hieße, ihn
aus der Schlange zu holen, in der er seit siebenundsechzig Jahren steht, und das ist die Figur.

### Nieselbeck — Wetterbeauftragter Ferdinand Nieselbeck

Ab **Akt I**, also von Anfang an. Optik: Held-Komposit (Haar h5 grau, Oberteil/Hose Stufe 1
Arbeitsgrün, Schuhe Stufe 0). Heimatanker: Kachel (21, 42), im Anger unter den Marktständen.
Schild über dem Kopf: „Herr Nieselbeck" (15).

*Er stand zuerst auf (12, 41). Das ist eine Kachel neben Knöterich, und die beiden Namensschilder
lagen im Bild übereinander. Der Ausweichsatz in `npcSchildFlush()` fängt gleiche Zeilen ab, nicht
zwei Figuren, die praktisch am selben Punkt stehen.*

Er steht, statt zu wandern, und das ist kein Zufall: er wartet seit dreiundvierzig Jahren auf
seinen ersten Arbeitstag.

#### Grundzeilen (Kreislauf)

*Neu gefasst mit T1: er meldet in Spalten. Die Fassung bis zum 25.08.2026 steht darunter.*

1. „Gemeldet wird: TNM negativ.“ (27) / „Wie gestern. Wie immer.“ (23)
2. „Mg. null. Da. entfällt. Ba. trocken.“ (36) / „Anm.: keine. Alles bereit.“ (26)
3. „Eimer: vorhanden. Messstab: vorhanden.“ (38) / „Für den Fall. Seit immer.“ (25)
4. „Stelle: nie unbesetzt. Dreiundvierzig Jahre.“ (44) / „Das sagt sonst niemand.“ (23)
5. „Wolken: vorhanden. Vlg.: fehlt.“ (31) / „Deshalb dürfen sie nicht.“ (25)
6. „Sie waren im Frostkamm? Dort liegt etwas.“ (41) / „Von mir. Auf Eis.“ (17)

#### Aktzeilen

I. „Willkommen. Wetterlage: unverändert schön.“ (42)
II. „Man fragt nach der Leitung. Ich melde nur.“ (42)
III. „Dreiundvierzig Jahre. Der Eimer hält.“ (37)
IV. „Wenn Sie hinauf müssen: bleibt schön.“ (37)
V. „Bereitschaft: hergestellt. Man weiß nie.“ (40)

<details>
<summary>Die Fassung vor T1</summary>

1. „Gemeldet wird: keine Niederschläge.“ (35) / „Wie gestern. Wie immer.“ (23)
2. „Ich habe einen Eimer. Für den Fall.“ (35) / „Der Eimer ist bereit.“ (21)
3. „Der Hut ist neu. Also fast neu.“ (31) / „Er wartet mit mir.“ (18)
4. „Wolken sind da. Sie dürfen nur nicht.“ (37) / „Es fehlt die Veranlassung.“ (26)
5. „Meine Stelle war nie unbesetzt.“ (31) / „Das sagt sonst niemand.“ (23)
6. „Sie waren im Frostkamm? Kalt dort.“ (34) / „Dort liegt etwas von mir.“ (25)

I. „Willkommen. Es bleibt schön. Wie immer.“ (39) · II. „Man fragt nach der Leitung. Ich melde nur.“ (42) · III. „Dreiundvierzig Jahre. Der Eimer hält.“ (37) · IV. „Wenn Sie hinauf müssen: Es wird schön.“ (38) · V. „Ich stehe bereit. Man weiß ja nie.“ (34)

</details>

#### Die Meldekürzel (T1)

Seine Tabelle hat vier Spalten, und er kürzt sie alle ab: `Mg.` Menge, `Da.` Dauer, `Ba.` Bodenart,
`Anm.` Anmerkungen, dazu `Vlg.` für die Veranlassung, auf die er wartet. Sie zählen gegen die zwölf
Kürzel aus Weltbibel Kapitel 13 als **eine** Position, und die Bedingung dafür steht im Code:
`szeneAssert()` prüft, dass jede Langform wörtlich in seinem eigenen Gesprächsbaum fällt, eine
Nachfrage entfernt. Die Auflösung ist die einzige Stelle im Spiel, an der Nieselbeck ins Erzählen
kommt, und sie läuft als Kaskade über drei Züge: „Die Spalten. Mg. ist die Menge. / Da. ist die
Dauer.“ → „Ba. ist die Bodenart, Anm. sind die Anmerkungen. / Vlg. ist die Veranlassung.“ →
„Anmerkungen. Da darf das Wetter erzählen. / Die Spalte ist noch leer.“

#### Anredeform (18.5)

Der volle Titel des Gegenübers, dann die Meldung: „Gemeldet wird: Sie sind da.“ (27)
Er meldet, statt zu reden. Das ist seine Sprachmarke aus Kapitel 6 und keine neue
Charakterisierung.

**Prüfnotiz:** kein Fund. Der Text bleibt durchgehend bei Wetter, Eimer und Zuständigkeit. Zeile 6
ist die einzige heikle, weil sie auf die zurückgestellte Veranlassung im Frostkamm zeigt; sie
nennt einen Fundort und keine Mechanik, genau wie Bramsches Antworten es dürfen.

---

### Umlauf — Reichsbotin Kordula Umlauf

Ab **Akt II**. Optik: Held-Komposit (Haar h4 rot, Oberteil/Hose Stufe 2 Königsblau, Schuhe
Stufe 4). Heimatanker: Kachel (26, 42), am Ostrand des Angers beim Gasthaus. Schild:
„Reichsbotin Umlauf" (18).

Sie ist die Figur, über die der Spieler zum ersten Mal erfährt, dass Oben ein Ort ist. Deshalb
steht sie nicht ab Schicht 1 im Dorf: sonst wäre die Pointe des zweiten Aktes an Tag eins
verschenkt. Ihre Aktzeile für Akt I ist folgerichtig leer, und `knAssertCaps()` verlangt das
inzwischen ausdrücklich so.

#### Grundzeilen (Kreislauf)

1. „Vierzehn Türme, ein Aufzug, neun Stockwerke.“ (44) / „Der Rest ist Treppe.“ (20)
2. „Ich bin im Umlauf. Seit einer Weile.“ (36) / „Man gewöhnt sich daran.“ (23)
3. „Oben ist es sauber. Sehr sauber.“ (32) / „Und sehr leise.“ (15)
4. „Elf Stellen noch. Auf der Rückseite.“ (36) / „Vorne war ich schon.“ (20)
5. „Die Rohrpost geht nicht. Seit immer.“ (36) / „Ich laufe. Geht auch.“ (21)
6. „Ich muss weiter. War nett bei Ihnen.“ (36) / „Wirklich. Sehr nett.“ (20)

#### Aktzeilen

I. (leer, sie steht in Akt I noch nicht im Dorf)
II. „Sie fragen nach Oben? Oben ist eine Stadt.“ (42)
III. „Ihre Stelle ist ausgeschrieben. Jedes Jahr.“ (43)
IV. „Ich habe erzählt, dass es hier vorangeht.“ (41)
V. „Diesmal komme ich mit. Nur bis zum Tor.“ (39)

#### Anredeform (18.5)

Der volle Titel, dann: „Notiert. Ich muss gleich weiter.“ (32)
Aufnehmen und weitermüssen im selben Atemzug, das ist sie.

**Prüfnotiz:** kein Fund. Ob sie ein Mensch oder ein Umlauf ist, wird hier so wenig geklärt wie
bei Lott und Pahl (Weltgeschichte, Kapitel 13). Zeile 2 spielt darauf an und beantwortet nichts.

---

### Vorblatt — Reichsministerialdirektor zu Händen Vorblatt

Ab **Akt III**. Optik: Held-Komposit (Haar h3 schwarz, Oberteil/Hose Stufe 4 Gold, Schuhe
Stufe 3). Heimatanker: Kachel (11, 37), vor der Amtstür. Schild: „zu Händen Vorblatt" (18).

Zwei Entscheidungen, beide begründet:

* **Der Anker liegt vor der Tür, nicht in ihr.** Ein Reichsministerialdirektor trägt vierzig Jahre
  offene Vorgänge am Leib und passt nicht durch die Tür des Provisoriums (Weltgeschichte,
  Kapitel 6). Er steht zwei Kacheln südlich der Türschwelle, damit er die Kontextaktion der
  Amtstür nicht überstimmt. Aus demselben Grund ist Zwirn in G6 gewandert.
* **Der volle Name ist gekürzt.** Die Weltgeschichte führt ihn als „Reichsministerialdirektor
  Hieronymus zu Händen Vorblatt". Im Personalverzeichnis des Gesprächsfensters steht
  „Reichsministerialdirektor zu Händen Vorblatt" (44 Zeichen), damit er dieselbe Kopfzeile füllt
  wie Fass und keine neue breiteste Zeile entsteht. Der Vorname fällt weg, der Adelspartikel
  bleibt. Er ist der Witz, nicht der Vorname.

Der Auftritt aus Szene 6 (die Entklammerung auf dem Dorfplatz) und die Versuchung aus Szene 7
sind hier **nicht** gebaut. Sie sind Szenen und keine Dorffigur; was sie brauchen, steht in der
Weltgeschichte, Kapitel 8, samt der Zeile „Mit Bordmitteln".

#### Grundzeilen (Kreislauf)

1. „Ihr Anliegen wird bearbeitet.“ (29) / „Das ist bereits sehr viel.“ (26)
2. „Nein sage ich grundsätzlich nicht.“ (34) / „Nein wäre eine Entscheidung.“ (28)
3. „Ich bin für Anhängiges zuständig.“ (33) / „Anhängig ist beinahe alles.“ (27)
4. „Hochablage grüßt Vordermühl.“ (28) / „Hochablage grüßt sehr gern.“ (27)
5. „Sie führen keinen Vorgang.“ (26) / „Das macht Sie sehr frei.“ (24)
6. „Ich habe Ihnen etwas mitgebracht.“ (33) / „Alle bekommen etwas.“ (20)

#### Aktzeilen

I. (leer)
II. (leer)
III. „Man hört wenig aus Ihrem Haus. Sehr gut.“ (40)
IV. „Ein Umschlag. Reizend. Geben Sie ihn mir.“ (41)
V. „Ich war zuständig. Nun bin ich hier.“ (36)

#### Anredeform (18.5)

Der vollständige Titel des Gegenübers, dann: „Und. Sie sind heute im Dienst.“ (30)
Kapitel 6 sagt: er benutzt konsequent den vollständigen Titel, auch bei Leuten, die keinen
haben, und macht davor eine winzige Pause, und die Pause ist die Beleidigung. Der Punkt hinter
dem „Und" ist diese Pause. Es ist die einzige Unhöflichkeit, die er sich leistet, und sie steht
in keinem Wort.

**Prüfnotiz:** kein Fund. Besonders geprüft, weil ein Gegenspieler die stärkste Versuchung ist,
ihn den Witz aussprechen zu lassen (Weltgeschichte, Kapitel 13): **er sagt nie Nein und er droht
nie.** Grundzeile 5 („Sie führen keinen Vorgang. / Das macht Sie sehr frei.") ist die Zeile, die
am nächsten an eine Drohung kommt, und sie ist wörtlich ein Kompliment. Genau darin liegt sie
richtig.

---

## Dorf-Figuren, Serie 3: Knöterich — ERLEDIGT (eingebaut mit U6)

Inhaltslieferung zu Bauabschnitt **U6** (`phase-u6-knoeterich-tafel.md`). Quelle ist Kapitel 8 der
Weltbibel, Abschnitt „Amtsrat a. D. Knöterich". Er ist die Figur, die diese Datei in ihrem ersten
Satz ausdrücklich ausgelassen hat („existiert bereits im Code"), und das war zwei Jahre lang
richtig: er hatte seine eigenen Kanäle und keine Tafel. Seit U6 hat er eine, und damit braucht er
dasselbe Zeilenkontingent wie die vierzehn anderen.

**Er steht trotzdem nicht in `DORF_FIGUREN`.** Sein Eintrag heißt `KN_FIGUR` und liegt in seinem
eigenen Block, weil er im Haus steht und nicht im Dorf. Für die Zeilen macht das keinen
Unterschied: `knAssertCaps()` prüft sie seit U6 in derselben Schleife, mit denselben Deckeln.

### Knöterich — Amtsrat a. D. Knöterich

Optik: Held-Komposit aus `KN_GESTALT` (Haar h1, Haarfarbe `#746a5a`, Hemd „hof" `#706150`, Hose
„hof", Schuhe), in der Welt grau getönt. Steht fest auf `KN_T` (zwei Kacheln westlich des
Kessels), gezeichnet von `drawAlter()` und nicht von `DRAW_NPC`. Schild über dem Kopf:
„Amtsrat a. D. Knöterich" (23). Porträt: `assets/portraets/knoeterich.png`, seit U5 geladen.

**Die Regel über allen Zeilen (Kapitel 8): er erklärt Tasten, nie Zusammenhänge.** Er ist der
letzte Mensch, der den Vorgang 1 vollständig gelesen hat. Er weiß alles und darf nichts sagen,
und die Amtsverschwiegenheit endet nicht mit der Pensionierung. Keine der elf Zeilen unten sagt,
was er weiß. Zwei sagen, dass er es nicht sagen darf, und eine sagt es, indem sie das Thema
wechselt.

#### Grundzeilen (Kreislauf)

1. „Ich führe Buch. Seit vierzig Jahren." (36) / „Auch über Sie." (14)
2. „Meine Entpflichtung liegt noch vor." (35) / „Sie wird bearbeitet." (20)
3. „Außer Dienst und im Dienst." (27) / „Beides steht in der Akte." (25)
4. „Fragen Sie mich nichts über Vorgänge." (37) / „Amtsverschwiegenheit." (21)
5. „Ich komme morgens früher als nötig." (35) / „Das steht nirgends." (19)
6. „Ich gieße. Mehr sage ich dazu nicht." (36) / „Es ist keine Dienstaufgabe." (27)

Zeile 1 ist seine Besessenheit, wörtlich aus Kapitel 8. Zeile 2 und 3 sind sein Hindernis: die
Entpflichtung wurde nie bearbeitet, er ist gleichzeitig außer Dienst und im Dienst. Zeile 4 ist
sein Geheimnis, von der einen Seite, von der er es zeigen darf. Zeile 5 und 6 sind die Gießkanne,
und sie sind der Grund, aus dem sie hier stehen dürfen: Kapitel 8 sagt über sie „Er sagt nichts
dazu", und genau das sagt er. Dass er kommt, ohne zu müssen, und gießt, ohne zuständig zu sein,
steht im Bild und nicht in einer Erklärung.

#### Aktzeilen

I. „Neuzugang vermerkt. Die Akte ist offen." (39)
II. „Der Posteingang wächst. Vermerkt." (33)
III. „Mehr Schriftverkehr als sonst. Notiert." (39)
IV. „Man fragt mich viel. Ich antworte nicht." (40)
V. „Meine Entpflichtung steht weiter aus." (37)

Die fünf halten sich absichtlich an seinen Schreibtisch. Die Dorffiguren kommentieren, was im
Dorf passiert; er kommentiert, was auf seinem Tisch davon ankommt. Akt IV nennt den Andrang und
nicht seinen Grund. Akt V nennt das Ende nicht: sein Vorgang ist der, der offen bleibt, bis er
in Kapitel 9 als vorletzte Amtshandlung bearbeitet wird.

#### Anredeform (18.5)

„Herr oder Frau &lt;Titel&gt;." (Deckel 48, gebaut wie bei den übrigen elf) / „Vollständig. Immer." (19)

Die zweite Zeile ist keine neue Charakterisierung, sondern seine Regel aus Kapitel 18.5,
wortkarg gesagt: „Immer vollständig, immer korrekt, immer inklusive Herr oder Frau. Jedes Mal."

#### Antwortliste

Vier Antworten wie bei allen, plus eine fünfte, die es nur bei ihm gibt und nur dann, wenn
schon ein Dienstzettel gelaufen ist:

1. „Und sonst?" (Kreislauf)
2. „Wie steht es im Haus?" (21) — bei allen anderen „Wie steht es im Dorf?". Er steht im Haus.
3. „Wie war noch mein Titel?" (Anredeform)
4. „Was stand da eben?" (18) — spielt die letzten Dienstzettel ab, einen je Griff, höchstens drei
5. „Auf Wiedersehen."

**Prüfnotiz:** kein Fund. Zeile 4 des Kreislaufs war die einzige heikle, und sie war zuerst
länger: ein Entwurf ließ ihn sagen, worüber er schweigt. Das ist genau die Grenze aus Kapitel 8.
Was jetzt dasteht, nennt den Grund und nicht den Gegenstand. Sein Zuwachs aus W11 (die Rangfolge
des Reiches, das erste Haus, die Pflanze der Frau, die es hätte anordnen können) steht hier
bewusst nicht — die Weltbibel lässt ihn ausdrücklich draußen, und U6 ändert daran nichts.

---

## Zusammenfassung Zeichendeckel-Nachweis

Alle 11 Figuren × (6 Grundzeilenpaare + 5 Aktzeilen) plus Bramsches 8 Fragen/Antworten und 3 Abweisungen plus Lotts und Pahls je 21 Anlass-Zeilen**paare** (7 Anlässe × 3 Paare = 42 Zeilen je Figur) wurden gegengezählt: kein `z1` über 48, kein `z2` über 32, keine Aktzeile über 44 Zeichen.

*(Korrektur GW23: der Satz stimmte in zwei Punkten nicht. Erstens sind es Zeilen**paare**, also 84 Zeilen statt 42. Zweitens stehen die Klammerwerte **nicht** hinter jeder Zeile: 209 von 293 tragen einen, alle 84 Lott/Pahl-Anlasszeilen nicht. Die Zählung kann für diese 84 in der beschriebenen Form nicht stattgefunden haben. Sachlich halten sie den Deckel — unabhängig nachgerechnet, Maxima 40 und 32.)*

**Nachtrag W11.** Dazugekommen sind 3 Figuren × (6 Grundzeilenpaare + 5 Aktzeilen, davon 3 leer),
10 Zusatzblöcke × 2 Zeilenpaare, 7 Fragen/Antworten bei Bramsche und 3 Anredeformen. Sie sind
gegengezählt und stehen mit ihrer Zeichenzahl da; die drei leeren Aktzeilen sind gewollt und
werden von `knAssertCaps()` genau dort und nur dort geduldet. Nachgemessen wird das nicht mehr
von Hand: `knAssertCaps()` prüft jede dieser Zeilen bei jedem Start gegen Deckel, Gedankenstrich,
Emoji und Sperrliste, und `tools/reich-pruef.mjs` prüft im Browser, dass sie zum richtigen Akt
erscheinen. Ein Fund gab es: siehe die Notiz zur Rang-Antwort bei Bramsche.

*(Korrektur GW22: die dreistufige Prüfung galt unter der Bedingung „solange kein Text umformuliert wird“. W5 hat drei Aktzeilen umformuliert (siehe oben). Sie sind gegen Sperrvermerk und Formregeln nachgeprüft: sauber. Seit GW14 prüft `knAssertCaps()` beides ohnehin maschinell mit, die Bedingung hängt also nicht mehr an einer einmaligen Sitzung.)*

**Nachtrag U6.** Dazugekommen ist eine zwölfte Figur mit 6 Grundzeilenpaaren, 5 Aktzeilen und
einer Anredeform: Knöterich. Sie sind gegengezählt und stehen mit ihrer Zeichenzahl da. Von Hand
nachgemessen wird auch das nicht mehr: `knAssertCaps()` liest seit U6
`DORF_FIGUREN.concat([KN_FIGUR])` und prüft seine Zeilen bei jedem Start mit, `anredeAssert()`
seine Anredeform über den ganzen Laufbahnverlauf, und `tools/gespraech-pruef.mjs` fährt seinen
Kreislauf im Browser einmal durch.
