## Aktenfunde: Serie C bis F, die restlichen 30 Blätter — ERLEDIGT

Fortsetzung von W2 (`superduper-weltbibel.md`, Kapitel 12 und 14). W2 selbst ist als `— ERLEDIGT` markiert, deckte aber laut eigenem Text nur „erst 18 Blätter (Serien A und B), dann den Rest" ab. Diese Phase liefert den Rest: Serie C (Der Brandabschnitt, 8), Serie D (Die Eisablage, 8), Serie E (Berichte einer Dienstreise, 10), Serie F (Post von drüben, 4). Zusammen mit A/B ergibt das 48 Blätter, die Sollzahl aus Kapitel 12.

Alle unten genannten Bezeichner und Zeilennummern wurden gegen den Stand nach Commit `cfd62a4` geprüft, plus die Änderungen dieser Phase. Zeilennummern verschieben sich beim Arbeiten, die Bezeichner nicht: such nach dem Bezeichner, nimm die Zeile nur als Wegweiser.

### Grundsatz: was diese Phase nicht ist

Kein neues Panel, kein neuer `localStorage`-Schlüssel, kein neuer Reitermechanismus. Aktenfunde bleiben, was sie in W2 waren: ein Zufallsfund, kein Questsystem. Diese Phase erweitert nur die bestehende Tabelle `BLAETTER` und ihre zwei Fundwege, sie erfindet keinen dritten.

### Sperrvermerk, unverändert aus Kapitel 12

Kein Blatt darf Kesselgrammatik oder eine Fluch-Ableitung enthalten. Nicht als Regel, nicht als Andeutung, nicht als Rätsel. Ein Blatt darf beschreiben, dass beglaubigt wurde. Nie, wie. Geprüft strukturell und textuell über `blaetterAssert()` (Abschnitt „Der Guard" unten), nicht in einer separaten Prüfsession.

### Der Befund vor dem Bau: Serie E und F haben keinen Fundort

W2 hat Aktenfunde ausschließlich an die Kammertruhe gehängt (`truheOeffnen()`, `index.html:4340`), und Kammern gibt es nur bei `currentLevel === 1` (`betreteKammer()`, `index.html:4168`: `if(kammer || currentLevel !== 1 || tuer.cd > 0) return;`; die Türbänder in `setzeKammerTueren()` decken nur `snow`/`grass`/`sand` ab, `index.html:4098`). Die Weltbibel-Tabelle in Kapitel 12 verortet Serie E und F aber in „Ablage V" — das ist das Schattenland, `currentLevel === 2`. Dort gibt es keine Kammer, keine Truhe und laut `index.html:3979` (`if(currentLevel === 2) return;`) nicht einmal den normalen Zettelkanal für Nörgels Randnotizen. Wer C/D/E/F alle über ein `biome`-Feld wie Serie B verdrahtet hätte, hätte zwei Serien gebaut, die nie droppen — im laufenden Betrieb erst nach Stunden auffällig, weil `BLAETTER_KEYS` sie trotzdem in der Zählzeile „N von 48" mitzählt.

Lösung: C und D bleiben beim bestehenden Weg (Kammertruhe, `biome` auf `sand` bzw. `snow`). E und F bekommen einen eigenen Dropkanal in `killMon()`, dem einzigen wiederkehrenden Ereignis im Schattenland — `shadowKills` wird dort bereits gezählt (`index.html:3233`), das ist der natürliche Anschlusspunkt.

### `truheOeffnen()`-Filter um Serie C/D erweitert (`index.html:4359`–`4365`)

```js
const kandidaten = BLAETTER_KEYS.filter(id => {
  if(kladde.blaetter[id]) return false;
  const b = BLAETTER[id];
  if(b.serie === 'A') return k.diff >= b.minDiff;
  if(b.serie === 'B' || b.serie === 'C' || b.serie === 'D') return k.biome === b.biome;
  return false;
});
```

Serie C (`biome:'sand'`) und D (`biome:'snow'`) verhalten sich exakt wie B (`biome:'grass'`), deshalb eine gemeinsame Zeile statt drei fast identischer. Die restliche Truhen-Logik (höchstens ein Blatt pro Truhe, Chance `0.18 + k.diff*0.04`) ist unverändert aus W2 übernommen, nicht angefasst.

### Neuer Dropkanal für Serie E/F in `killMon()` (`index.html:3279`–`3294`)

```js
if(currentLevel === 2) shadowKills++;
// Aktenfund Serie E/F (Ablage V): einziger Fundweg für diese Serien, denn im
// Schattenland gibt es keine Kammern und damit keine Kammertruhe. Höchstens
// ein Blatt pro Kill. F zuerst und mit eigener, sehr kleiner Chance geprüft —
// sonst würde ein gemeinsamer Pool mit E das "sehr selten" aus der Weltbibel
// wegmitteln, sobald wenige F-Blätter noch offen sind.
if(currentLevel === 2){
  const kandF = BLAETTER_KEYS.filter(id => BLAETTER[id].serie === 'F' && !kladde.blaetter[id]);
  const kandE = BLAETTER_KEYS.filter(id => BLAETTER[id].serie === 'E' && !kladde.blaetter[id]);
  let blattId = null;
  if(kandF.length && Math.random() < 0.006) blattId = kandF[Math.floor(Math.random() * kandF.length)];
  else if(kandE.length && Math.random() < 0.04) blattId = kandE[Math.floor(Math.random() * kandE.length)];
  if(blattId && findeBlatt(blattId)){
    floaters.push({x:m.x, y:m.y-40, txt:'+ Aktenfund', col:'#c9b98a', t:2.8, big:true});
  }
}
```

Zwei unabhängige Rolls statt einem gemeinsamen Pool: `truheOeffnen()` darf combined würfeln, weil A und B beide „normal selten" sind (0.18 bis 0.34 Trefferchance je Truhe). F ist laut Kapitel 12 „sehr selten" — ein gemeinsamer Pool mit E hätte F umso wahrscheinlicher gemacht, je weniger E-Blätter noch offen sind (die Falle, vor der die Übergabe warnt). Mit getrennten Rolls (0.006 für F, 0.04 für E, F zuerst geprüft) bleibt F's Rate konstant unabhängig vom Fortschritt bei E. `shadowKills++` bleibt unverändert eine Zeile darüber, kein Doppelzweck.

### Beschädigungs-Darstellung Serie C: Text statt Rendercode

Kapitel 12 verlangt für Serie C „angekokelt und teilweise unleserlich, das ist Absicht und muss auch so aussehen." `renderBlaetter()` (`index.html:5233`+) mappt `lines` unverändert auf `<p>`-Tags, ohne Schadensdarstellung — das anzufassen wäre ein neues Rendersystem für einen Effekt gewesen, den man auch im Text selbst erzeugen kann. Gelöst über Textinhalt: Aktenzeichen mit `[verkohlt]`/`[unleserlich]`/`[Rest fehlt]` statt echter Ziffern, an zwei Stellen ein mitten im Satz abgebrochenes Wort (`c6`: „Nicht al[...]s Feuer ist Zufall."). Kein Code geändert, `renderBlaetter()` unangetastet.

### Die 30 Texte: `BLAETTER`-Erweiterung `c1`–`c8`, `d1`–`d8`, `e1`–`e10`, `f1`–`f4` (`index.html:2537`ff)

* **C, Der Brandabschnitt** (`biome:'sand'`): was wirklich gebrannt hat, offiziell ordnungsgemäße Aktenvernichtung, inoffiziell nie ganz geklärt. Bleibt am Ende bewusst offen (Kapitel 16: „was wirklich gebrannt hat" ist kein Rätsel mit Auflösung).
* **D, Die Eisablage** (`biome:'snow'`): zurückgestellte Vorgänge, absurd kleine Klärungsfragen, seit Jahrzehnten unbeantwortet.
* **E, Berichte einer Dienstreise** (kein `biome`-Feld, nur `serie`): Sturz' Berichte aus Ablage V, Bogen sachlich (`e1`–`e4`) über gereizt (`e5`–`e7`) zu still (`e8`–`e9`). `e10` ist wörtlich der Musterttext aus Kapitel 12 (`Ohne Aktenzeichen. Der Tee ist gut. Antworten Sie bitte.`), wie schon `a4` in W2 aus dem gleichen Kapitel übernommen wurde. `e9` verweist auf Zwirns Dienstreiseantrag (Kapitel 15, „Der Riss"), ohne die Verbindung selbst auszusprechen.
* **F, Post von drüben** (kein `biome`-Feld): vier Briefe des Fürsten, eskalierend höflich, keine einzige direkte Drohung — die Unheimlichkeit kommt aus `f2` („Ich habe zugesehen.") und `f4` („Ich habe den Tisch gedeckt."), nicht aus Gewalt oder Zynismus (Humor-Grundgesetz Regel 8).

Alle 30 Texte maximal vier bis fünf Zeilen (Sperrvermerk-Deckel: höchstens sechs), keine Gedankenstriche, keine Emojis, keine Kesselgrammatik-Wörter — die vier Punkte, die `blaetterAssert()` maschinell prüft.

### Der Guard: `blaetterAssert()` (`index.html:2754`), Bauform wie `knAssertCaps()`/`auftragAssertBrett()`

```js
(function blaetterAssert(){
  const TRUHE_SERIEN = ['A', 'B', 'C', 'D'];
  const SCHATTEN_SERIEN = ['E', 'F'];
  const TRUHE_BIOME = ['grass', 'snow', 'sand'];
  const SOLL = {A:12, B:6, C:8, D:8, E:10, F:4};
  ...
})();
```

Läuft als IIFE direkt an Ort und Stelle, nicht als später aufgerufene Funktion wie `auftragAssertBrett()` — bewusst so, weil er anders als der W4-Guard keine spät deklarierten Tabellen (`BIOME_MOBS`, `BIOM_AMT`) braucht. Die Biom-Liste steht deshalb als Literal `['grass','snow','sand']` im Guard, nicht aus `BIOM_AMT` gelesen: `BIOM_AMT` wird erst deutlich weiter unten im Skript deklariert (nach der Aushang-Tabelle), ein Zugriff an dieser Stelle wäre ein TDZ-`ReferenceError` — exakt die Falle, vor der die Übergabe warnt. Der Guard prüft:

* **Reichbarkeit** — jede Serie in `BLAETTER_KEYS` ist entweder in `TRUHE_SERIEN` (braucht `minDiff` bei A bzw. ein gültiges `biome` bei B/C/D) oder in `SCHATTEN_SERIEN` (E/F, darf **kein** `biome`-Feld haben — sonst wäre das genau der stumme Zweig, den die Übergabe als teuerste Falle nennt).
* **Sollzahl** — jede Serie hat exakt die Blattzahl aus der Weltbibel-Tabelle (A12/B6/C8/D8/E10/F4), Gesamtzahl exakt 48.
* **Text** — jedes Blatt hat mindestens eine Zeile, höchstens sechs, keine Gedankenstriche, keine Emojis, keine Kesselgrammatik-Begriffsliste (identische Liste wie in `auftragAssertBrett()`).

Ein Fehler schreibt `console.error('Aktenfunde: ...', ...)` und setzt `ok = false`, bricht das Spiel aber nicht ab — gleiche Haltung wie die bestehenden Guards.

## Was ausdrücklich nicht angefasst wird

* Serie A und B, `truheOeffnen()`s Grundlogik (Chance, „höchstens ein Blatt pro Truhe"), `findeBlatt()`, `renderBlaetter()`, die Kladde-Persistenz — alles unverändert aus W2.
* Kein neues Rendersystem für die Beschädigungsdarstellung von Serie C (siehe oben, gelöst über Textinhalt).
* Kein Gewichtsfeld für Serie F — „sehr selten" kommt aus einer eigenen, kleinen, von E unabhängigen Rollchance, nicht aus einem Datenfeld.
* Kein Eingriff in `zutatBiome()`, obwohl dort `shadow` als Adjektiv-Gewichtsbiom bereits existiert (`index.html:3091`) — das ist ein anderes System (Zutatenfärbung), zufällig derselbe Name, hier nicht berührt.

## Abnahme

* `BLAETTER_KEYS.length === 48`, `blaetterAssert()` läuft beim Laden ohne Konsolenmeldung.
* Kladde, dritter Reiter, zeigt „0 von 48 Blättern gefunden" auf einem frischen Spielstand, nach Fund korrekt „N von 48" (live geprüft).
* Serie C/D droppen ausschließlich aus Kammern im passenden Biom, Serie E/F ausschließlich aus Kills im Schattenland (live geprüft, siehe unten).
* Kein Blatt verrät Kesselgrammatik, geprüft Blatt für Blatt über den Guard, nicht nur stichprobenartig.
* `renderBlaetter()` zeigt die neuen Serien ohne Änderung am Rendercode korrekt an, inklusive der Textschäden von Serie C.

## Bewusst offen für spätere Bauabschnitte

* W5 kann eine „freigeschaltete Blattserie pro Akt" nur für Serien lesen, die es gibt — C bis F sind jetzt verfügbar, eine Akt-Kopplung ist hier nicht gebaut.
* Die Rollchancen (0.04 für E, 0.006 für F, unverändert 0.18+diff*0.04 für A/B/C/D) sind eine Setzung dieser Phase, keine aus dem Spiel abgeleitete Zahl, ebenso wie die W4-Lohnstaffel keine war.

## Live geprüft

Node-Syntaxcheck über den extrahierten Skriptblock nach jedem Bauschritt, danach live im Browser (`preview_start` auf Port 8378), Prüfungen per Konsole:

* Start: keine Konsolenfehler, `blaetterAssert()` und `auftragAssertBrett()` beide stumm (= bestanden).
* Kessel-Reiter „Akten": „Noch keine Aktenfunde" auf frischem Stand, nach manuellem `findeBlatt('c1')`/`findeBlatt('d1')`/`findeBlatt('e10')`/`findeBlatt('f4')` korrekt „4 von 48 Blättern gefunden", alle vier Titel gelistet, `c1` aufgeklappt zeigt den verkohlten Text lesbar inklusive `[verkohlt]`-Markierung.
* Truhen-Filter isoliert geprüft: `c1` matcht `{biome:'sand'}`, nicht `{biome:'snow'}`; `d1` matcht `{biome:'snow'}`, nicht `{biome:'sand'}`.
* Schattenland-Dropkanal end-to-end geprüft: `currentLevel` auf 2 gesetzt, `Math.random` auf `() => 0` gezwungen (garantiert den F-Zweig), echten `killMon()` mit einem Schattenland-`MONDEF`-Eintrag aufgerufen — `f1` landet korrekt in `kladde.blaetter`, keine Exception. Zustand danach zurückgesetzt (`currentLevel`, `Math.random`, `kladde.blaetter`).
* Konsole blieb über alle Prüfungen leer, keine einzige Exception.
