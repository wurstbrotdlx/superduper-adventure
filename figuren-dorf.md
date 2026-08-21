## Dorf-Figuren, Serie 1: elf Ensemble-Mitglieder, vollständig ausformuliert — ERLEDIGT (eingebaut mit W3)

Inhaltslieferung zu Bauabschnitt **W3** ("Das Dorf spricht") aus `superduper-weltbibel.md`, Kapitel 8 (Das Ensemble), Kapitel 9 (Der Hauptvorgang, fünf Akte) und Kapitel 14. Elf der zwölf im Auftrag genannten Figuren stehen hier: alle ansprechbaren Ensemble-Mitglieder außer Knöterich (existiert bereits im Code) und dem Kater Anlage 3 (bekommt kein eigenes Zeilenkontingent, wird nur bei Bramsche erwähnt und ohne Sprite gezeichnet).

**Entstehung:** jede Figur wurde einzeln entworfen, dann von einem zweiten Durchgang gegen Sperrvermerk/Humor-Grundgesetz/Formregeln/Zeichendeckel geprüft und repariert, dann von einem dritten, unabhängigen Durchgang ausschließlich auf Kesselgrammatik-Lecks gegengeprüft. Bei zwei Figuren (Pommer, ein Grundzeilenpaar bei Lott/Pahl im fluch-Block) hat die zweite Stufe Sperrvermerk-nahe Formulierungen ersetzt, dokumentiert unten je Figur. Alle elf Figuren stehen am Ende mit `ok:true`, kein Fund in der dritten Stufe.

**Sperrvermerk, unverändert aus Kapitel 7, hier auf alle elf Figuren angewandt:** keine Figur erklärt oder deutet an, wie die Beglaubigung im Kessel rechnet (Substantiv=Slot, Adjektiv=Wirkung, Seltenheit=Alter des Aktenzeichens, drei Zutaten=dreifache Ausfertigung, Fluch=Bewilligung+Auflage im selben Bescheid, zwei harte Flüche=Verhältnismäßigkeit). Figuren dürfen über Akten, den Krieg, das Amt, ihre eigene Lage und den Vorgang 1 reden, nie über die Zutaten-Mechanik.

**Formregeln, unverändert aus Kapitel 13:** keine Gedankenstriche, keine Emojis, kurze Sätze. **Zeichendeckel:** Dialogzeile 1 (`z1`) höchstens 48 Zeichen, Zeile 2 (`z2`) höchstens 32 Zeichen, einzeilige Aktzeile höchstens 44 Zeichen. Alle Werte unten sind gegengezählt, nicht geschätzt.

**Zwei Optik-Gruppen für den Einbau** (Entscheidung, keine Erfindung neuer Assets — siehe Plan zu W3):

* **Acht Figuren aus vorhandenen NPC-Sprites** (wandern wie die bisherigen drei Dorf-Staffage-NPCs): Zwirn, Zapf, Lisbeth, Trepp, Nörgel, Milb, Pommer, Fass.
* **Drei Figuren als Held-Komposit** (stehen fest wie Knöterich, kein Wandern): Bramsche, Lott, Pahl — passend, weil alle drei ortsgebunden sind (Registratur, Bank).

**Die elf Gestalten sind gegeneinander gesetzt, nicht einzeln gewählt.** Frisur und Oberteil bilden über alle elf Figuren ein eindeutiges Paar, sonst stünden zwei Beschäftigte mit demselben Gesicht und demselben Hemd nebeneinander (Trepp und Fass hatten das zuerst, Zapf und Lisbeth trugen beide Grün). Wer eine Gestalt ändert, prüft die Tabelle als Ganzes.

**Nachtrag G6** (siehe `phase-g6-dorfsicht.md`): Von den acht NPC-Sprites liegen nur drei im Grafikpaket (Farmer_Bob, Bartender_Katy, Miner_Mike). Zapf, Lisbeth, Trepp, Milb und Fass hatten deshalb überhaupt kein Sprite und standen unsichtbar im Dorf; sie laufen jetzt ebenfalls als Held-Komposit, zusätzlich mit Laufreihe. Jede der elf Figuren trägt dafür eine eigene Gestalt (Frisur, Oberteil, Hose, Schuhe), unten je Figur vermerkt. Kommen die fehlenden Blätter ins Paket, greift der Code von selbst wieder darauf zu. Fünf Heimatanker sind in derselben Phase gewandert, weil sie hinter Gebäudefassaden lagen; die neuen Werte stehen unten, die alten daneben.

---

**Nachtrag W-Nörgel** (siehe `phase-w-noergel.md`): Nörgel bekommt vier Zusatzzeilen, die
erst erscheinen, nachdem der Spieler selbst am Lager der Beschwerden war. Sie stehen unten
in seinem Abschnitt. Die sechs Grundzeilen und die fünf Aktzeilen bleiben unverändert.

## Zwirn — Bürgermeister Alfons Zwirn

Optik: `cfnpc_bob` (Farmer_Bob, wandert). Heimatanker: Kachel (16, 38), vor dem Amt. **G6:** Anker von (14, 34) verschoben, dort stand er vollständig hinter der Amtsfassade; nicht auf (14, 38), weil er sonst die Kontextaktion der Amtstür überstimmt. Ersatzgestalt, falls das Blatt fehlt: Haar h1, Oberteil/Hose Stufe 2, Schuhe Stufe 2.

### Grundzeilen (Kreislauf bei wiederholtem Ansprechen)

1. „Das Dorffest kommt. Seit elf Jahren.“ (36) / „Vordermühl hatte noch nie eins.“ (31)
2. „Eine Genehmigung fehlt uns noch.“ (32) / „Da bin ich dran.“ (16)
3. „Wir werden das angehen.“ (23) / „Noch dieses Jahr, vielleicht.“ (29)
4. „Schön, dass Sie da sind! Wirklich.“ (34) / „Ihr Jahresgespräch führe ich.“ (29)
5. „Zuständig wäre die Amtsleitung.“ (31) / „Nur weiß ich nicht, wer sie ist.“ (32)
6. „Konfetti habe ich schon bestellt.“ (33) / „Nur die Genehmigung fehlt noch.“ (31)

### Aktzeilen

I. „Elf Jahre Vorfreude, noch mehr Händedruck.“ (42)
II. „Wer zuständig ist? Klären wir noch.“ (35)
III. „Der Schreibtisch ist leer. Ich weiß warum.“ (42)
IV. „Ich habe gestanden. Das Fest steht noch aus.“ (44)
V. „Wir werden das Fest feiern. Irgendwann.“ (39)

**Prüfnotiz:** kein Fund in der Kesselgrammatik-Stufe. Der Text bleibt durchgehend beim Dorffest-Genehmigungsverfahren und Zwirns persönlicher Verlegenheit.

---

## Bramsche — Registratorin Ottilie Bramsche

Optik: Held-Komposit (`gestalt`: Haar h3 schwarz, Oberteil/Hose Stufe 2 Königsblau), stehend. Heimatanker: Kachel (18, 37). Der Kater Anlage 3 wird als einfache liegende Form direkt neben ihr gezeichnet, kein eigener Sprite, keine eigene Kontextaktion.

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

### Abweisung (wenn die Frage der Schicht schon verbraucht ist)

* „Eine Frage pro Schicht.“ (23) / „Die Ihre ist verbraucht.“ (24)
* „In welcher Sache?“ (17) / „Das hatten wir schon.“ (21)
* „Antrag für heute erledigt.“ (26) / „Morgen wieder.“ (14)

**Prüfnotiz:** kein Fund in der Kesselgrammatik-Stufe. Besonders geprüft: „Anlage Drei“ (generischer Aktenanhang, keine Verbindung zu „drei Zutaten“), „Ausfertigung“ bei Ablage V (einzelnes Zutrittsdokument, nicht die dreifache Beglaubigung). Alle Antworten nennen ausschließlich Fundorte/Zusammenhänge, nie Mechanik.

---

## Zapf — Hausmeister Reinhold Zapf

Optik: `cfnpc_jack` (Lumberjack_Jack, wandert). Heimatanker: Kachel (16, 47). **G6:** Anker eine Kachel nach Süden, sonst wanderte er hinter Haus 3. Das Blatt liegt nicht im Grafikpaket, er läuft als Held-Komposit: Haar h1 (kurz braun), Oberteil/Hose Stufe 1 (grün, Arbeitszeug), Schuhe Stufe 0.

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

**Prüfnotiz:** kein Fund. Zapfs Weltbibel-Pflichtsatz über den Kessel („Der Kessel ist kein Kessel. Der Kessel ist ein Kopierer.“) ist bewusst **nicht** in den Grundzeilen-Kreislauf übernommen — er steht bereits wörtlich in Kapitel 8 als seine Signaturzeile, gehört aber dorthin, wo er einmalig trifft, nicht in einen Kreislauf, der sich abnutzt. Bleibt als offene Option für einen späteren, gezielten Einbau (z. B. eine Aktzeile), hier nicht spekulativ vorgebaut.

---

## Lisbeth — Praktikantin Lisbeth Fuhr

Optik: `cfnpc_chloe` (Chef_Chloe, wandert). Heimatanker: Kachel (8, 40). **G6:** Anker von (10, 42) verschoben, dort war sie am Stand schon zu 46 Prozent von Haus 2 verdeckt. Das Blatt liegt nicht im Grafikpaket, sie läuft als Held-Komposit: Haar h6 (Knoten), Oberteil Stufe 1 (grün), Hose Stufe 0 (rot), Schuhe Stufe 3.

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

**Prüfnotiz:** kein Fund.

---

## Trepp — Zusteller Emil Trepp der Siebte

Optik: `cfnpc_fin` (Fisherman_Fin, wandert, 9-spaltiges Sheet). Heimatanker: Kachel (22, 40). **G6:** Anker eine Kachel nach Norden, sonst wanderte er hinter die Scheune. Das Blatt liegt nicht im Grafikpaket, er läuft als Held-Komposit: Haar h2 (blonde Tolle), Oberteil Stufe 2 (blau, wie eine Zustelluniform), Hose Stufe 0 (rot), Schuhe Stufe 1.

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

**Prüfnotiz:** kein Fund. Trepps feste Sprachmarke („Wenn ich kurz stören darf.“) wiederholt sich bewusst als z1 in allen sechs Grundzeilen — das ist seine Sprachmarke, keine Textarmut.

---

## Nörgel — Sachbearbeiter auf Probe

Optik: `cfnpc_mike` (Miner_Mike, wandert, leichte grüne Tönung). Heimatanker: Kachel (8, 38). Ersatzgestalt, falls das Blatt fehlt: Haar h1, Oberteil/Hose Stufe 0, Schuhe Stufe 3.

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

**Prüfnotiz:** kein Fund. Dass Nörgel die Dienstbericht-Bemerkungen schreibt (Kapitel 8, „Die Auflösung“), wird hier nicht ausgesprochen — das bleibt der Spielbeobachtung überlassen, kein Text erklärt es.

---

## Milb — Gutachter Dr. phil. Milb

Optik: `cfnpc_buba` (Farmer_Buba, wandert, neutral/ungetönt). Heimatanker: Kachel (11, 39). Das Blatt liegt nicht im Grafikpaket, er läuft als Held-Komposit: Haar h5 (lang grau), Oberteil/Hose Stufe 2 (blau), Schuhe Stufe 1.

### Grundzeilen (Kreislauf)

1. „Das würde ich mit Drei ansetzen.“ (32) / „Höchstens.“ (10)
2. „Diese Kammer würde ich einstufen.“ (33) / „Ungefragt, versteht sich.“ (25)
3. „Manche Kammern fühlen sich falsch an.“ (37) / „Das beunruhigt mich.“ (20)
4. „Meine Zahlen stimmen immer. Fast.“ (33) / „Nur wo, weiß ich nicht.“ (23)
5. „Ein Gutachten ist nie fertig.“ (29) / „Nur eingestellt.“ (16)
6. „Andere raten. Ich stufe ein.“ (28) / „Das ist ein Unterschied.“ (24)

### Aktzeilen

I. „Die neue Kraft schätze ich auf Zwei.“ (36)
II. „Ohne Freigabe stufe ich das niedrig ein.“ (40)
III. „Ein leerer Stuhl lässt sich nicht bewerten.“ (43)
IV. „Diese Schrift verweigert sich der Note.“ (39)
V. „Diesmal setze ich keine Note mehr an.“ (37)

**Prüfnotiz:** kein Fund. Die Zahlwörter „Drei“ und „Zwei“ wurden gezielt gegengeprüft (Nähe zu „drei Zutaten“/„zwei harte Flüche“) — es sind Milbs eigene Schulnoten für unspezifische Objekte (Kraft, Kammer als Amtsraum), keine Bezugnahme auf Zutatenzahl oder Fluch-Obergrenze.

---

## Pommer — Materialausgabe Herr Pommer

Optik: `cfnpc_katy` (Bartender_Katy, wandert). Heimatanker: Kachel (13, 47). **G6:** Anker zwei Kacheln nach Süden, sonst wanderte er hinter Haus 3. Ersatzgestalt, falls das Blatt fehlt: Haar h2, Oberteil Stufe 1, Hose Stufe 0, Schuhe Stufe 4.

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

**Prüfnotiz:** Erste Reparaturstufe fand zwei Sperrvermerk-nahe Formulierungen im Entwurf und ersetzte sie. Original-Grundzeile 1 spielte mit Groß-/Kleinschreibung „Schild“/„schild“ — strukturell nah an „Substantiv bestimmt den Slot“, zumal Schild selbst ein Ausrüstungsgegenstand ist. Ersetzt durch die Eimer/Kanne-Fassung oben. Original-Grundzeile 2 ließ Pommer ein Adjektiv („scharf“) wie ein Material ausgeben — strukturell identisch mit „Adjektiv bestimmt die Wirkung“. Ersetzt durch die Montag/heute-Fassung oben. Die dritte, unabhängige Stufe fand in der reparierten Fassung keinen weiteren Fund.

---

## Fass — Wirt Bruno Fass, Gasthaus „Zum Letzten Stempel“

Optik: `cfnpc_bruno` (Bartender_Bruno, wandert). Heimatanker: Kachel (20, 39). Das Blatt liegt nicht im Grafikpaket, er läuft als Held-Komposit: Haar h3 (kurz schwarz), Oberteil Stufe 0 (rot), Hose Stufe 2 (blau), Schuhe Stufe 2.

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

**Prüfnotiz:** kein Fund. Der Hausname „Zum Letzten Stempel“ bleibt reiner Ortsname und klingt in Grundzeile 2 nur an, wird nie erklärt — genau wie Kapitel 8 es verlangt.

---

## Lott — auf der Bank am Dorfplatz

Optik: Held-Komposit (`gestalt`: Haar h1 braun, keine Rüstungs-Layer wie Knöterich), stehend/sitzend fest. Heimatanker: Kachel (9, 47), neben Pahl.

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

**Prüfnotiz:** kein Fund. Besonders geprüft: „Direkt ins Aktenzeichen“ (kein Bezug zu Alter/Seltenheit), „Jede Gabe hat einen Haken. Amtlich.“ (sagt nur DASS, nie WARUM/WIE, kein Bescheid-Bezug).

---

## Pahl — auf der Bank am Dorfplatz

Optik: Held-Komposit (`gestalt`: Haar h4 ingwerfarben, keine Rüstungs-Layer), stehend/sitzend fest. Heimatanker: Kachel (11, 47), neben Lott.

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

**Prüfnotiz:** kein Fund. „Ob ich ein Vorgang bin? Unhöflich.“ bleibt reine Abwehr der Frage (Kapitel 16: „wird nie geklärt“), ohne jede Erklärung.

---

## Zusammenfassung Zeichendeckel-Nachweis

Alle 11 Figuren × (6 Grundzeilenpaare + 5 Aktzeilen) plus Bramsches 8 Fragen/Antworten und 3 Abweisungen plus Lotts und Pahls je 21 Anlass-Zeilen**paare** (7 Anlässe × 3 Paare = 42 Zeilen je Figur) wurden gegengezählt: kein `z1` über 48, kein `z2` über 32, keine Aktzeile über 44 Zeichen.

*(Korrektur GW23: der Satz stimmte in zwei Punkten nicht. Erstens sind es Zeilen**paare**, also 84 Zeilen statt 42. Zweitens stehen die Klammerwerte **nicht** hinter jeder Zeile: 209 von 293 tragen einen, alle 84 Lott/Pahl-Anlasszeilen nicht. Die Zählung kann für diese 84 in der beschriebenen Form nicht stattgefunden haben. Sachlich halten sie den Deckel — unabhängig nachgerechnet, Maxima 40 und 32.)*

*(Korrektur GW22: die dreistufige Prüfung galt unter der Bedingung „solange kein Text umformuliert wird“. W5 hat drei Aktzeilen umformuliert (siehe oben). Sie sind gegen Sperrvermerk und Formregeln nachgeprüft: sauber. Seit GW14 prüft `knAssertCaps()` beides ohnehin maschinell mit, die Bedingung hängt also nicht mehr an einer einmaligen Sitzung.)*
