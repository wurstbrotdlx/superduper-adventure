## W2: Aktenfunde — Serien A und B als dritter Kladde-Reiter — ERLEDIGT

Umbau-Prompt zu Bauabschnitt W2 aus `superduper-weltbibel.md`, Kapitel 12 ("Aktenfunde: wie die Geschichte in den Spieler kommt") und Kapitel 14. Inhaltslieferung ist bereits fertig: `blaetter-serie-a-b.md` enthält alle 18 Blätter (Serie A, 12 Stück, und Serie B, 6 Stück) vollständig ausformuliert. Diese Phase verdrahtet sie, erfindet keinen einzigen neuen Satz.

Alle unten genannten Bezeichner und Zeilennummern wurden gegen den Stand nach Commit `a67c9c3` geprüft. Zeilennummern verschieben sich beim Arbeiten, die Bezeichner nicht: such nach dem Bezeichner, nimm die Zeile nur als Wegweiser.

### Grundsatz: was diese Phase nicht ist

Kein neues Persistenz-System, kein neuer Zeichenschritt, kein neuer Dienstzettel-Kanal. Ein dritter Reiter im bestehenden Kessel-Panel, ein Zusatzfeld im bestehenden Kladde-Objekt, ein zusätzlicher Zufallswurf in einer bestehenden Funktion. Wer hier ein neues Overlay, einen neuen `localStorage`-Schlüssel oder einen Knöterich-Hook baut, hat die Weltbibel nicht gelesen: „Kein neuer Persistenzweg, kein neues Panel, kein neuer Kanal" steht dort wörtlich in Kapitel 12.

**Sperrvermerk, unverändert aus Kapitel 12:** kein Blatt darf Kesselgrammatik oder eine Fluch-Ableitung verraten. Die 18 Blätter aus `blaetter-serie-a-b.md` sind bereits dagegen geprüft (siehe deren Kopfzeile). Wer den Text beim Einbau umformuliert oder kürzt, muss die Prüfung wiederholen, nicht nur den Zeichendeckel.

### Datentabelle `BLAETTER`

Neben `KLADDE_KEY` einsetzen (`index.html:1970`, direkt vor `const kladde = ...`), also **vor** dem ersten `noteKladde()`-Aufruf und vor `truheOeffnen()`. Gleiche TDZ-Regel wie bei allen bisherigen Datentabellen im Projekt (`ZUTAT_NOUNS`, `HINWEISE`, `ZONES`): Tabellen stehen vor ihrer ersten Verwendung, sonst Absturz beim Laden.

```js
// ===========================================================================
//  AKTENFUNDE (Phase W2)
//  18 Blätter, Serie A (Der Vorgang, alle Biome ab Kammerstufe 3) und Serie B
//  (Die Poststelle, nur Grasland). Text unverändert aus blaetter-serie-a-b.md
//  übernommen. Kein Blatt verrät Kesselgrammatik oder eine Fluch-Ableitung,
//  siehe Sperrvermerk dort. Reihenfolge beim Fund ist absichtlich egal.
// ===========================================================================
const BLAETTER = {
  a1:  {serie:'A', n:1,  minDiff:3, lines:['Aktenzeichen 1-0-2.',
        'Der Zuständigkeitsbereich VI meldet Waffenstillstandsbruch.',
        'Ursache: eine Grenzfrage, ungeklärt seit der Gründung.',
        'Gegenseite: Fürst Nachtrag, vertreten durch sich selbst.',
        'Weiteres Vorgehen wird nachgereicht.']},
  a2:  {serie:'A', n:2,  minDiff:3, lines:['Aktenzeichen 1-0-2, Anlage.',
        'Die Grenzfrage lässt sich nicht klären. Beide Seiten haben recht.',
        'Empfehlung: keine Entscheidung treffen, sondern eine Stelle einrichten, die die Frage verwaltet.',
        'Vermerk am Rand, andere Handschrift: „Das nennt man aufschieben, nicht lösen."']},
  a3:  {serie:'A', n:3,  minDiff:3, lines:['Aktenzeichen 1-0-2, Fortsetzung.',
        'Waffenstillstand unterzeichnet. Dauer: bis zur abschließenden Bearbeitung.',
        'Eine abschließende Bearbeitung ist nicht terminiert.',
        'Das ist im Vertragstext so gewollt.']},
  a4:  {serie:'A', n:4,  minDiff:3, lines:['Aktenzeichen 1-0-1.',
        'Der Krieg gilt als ausgesetzt bis zur abschließenden Bearbeitung.',
        'Für die abschließende Bearbeitung ist eine Stelle einzurichten.',
        'Die Stelle ist vorläufig.',
        'Vermerk am Rand, andere Handschrift: „Vorläufig seit wann?"']},
  a5:  {serie:'A', n:5,  minDiff:3, lines:['Aktenzeichen 1-0-3.',
        'Gründungsverfügung der Stelle für den Zuständigkeitsbereich VI.',
        'Personalstärke: fünf, zuzüglich Registratur.',
        'Amtssitz: Vordermühl, vorbehaltlich Bestätigung.',
        'Die Bestätigung steht noch aus.']},
  a6:  {serie:'A', n:6,  minDiff:3, lines:['Aktenzeichen 1-1-1.',
        'Beglaubigung erfolgt ab sofort in dreifacher Ausfertigung.',
        'Grund: Streitfälle mit drei Beteiligten, keiner davon neutral.',
        'Erste Ausfertigung: Gegenseite. Zweite: hiesige Registratur. Dritte: Verwahrung.',
        'Das Gerät dafür wurde bereits requiriert.']},
  a7:  {serie:'A', n:7,  minDiff:3, lines:['Aktenzeichen 1-1-2.',
        'Erste Ausfertigung auf dem Postweg an die Gegenseite.',
        'Der Bote meldet, der Weg führe durch den Brandabschnitt.',
        'Ankunft unbestätigt.',
        'Wiedervorlage in einem Jahr. Wiedervorlage in dreihundert Jahren.']},
  a8:  {serie:'A', n:8,  minDiff:3, lines:['Aktenzeichen 1-1-3.',
        'Zweite Ausfertigung verbleibt in der hiesigen Registratur.',
        'Fundort laut Ablageplan: Fach 6, zwischen Grenzfrage und Dorffest.',
        'Zustand bei letzter Prüfung: vollständig.',
        'Letzte Prüfung: siebenundzwanzig Jahre her.']},
  a9:  {serie:'A', n:9,  minDiff:3, lines:['Aktenzeichen 1-1-4.',
        'Dritte Ausfertigung zur dauerhaften Verwahrung an das Vervielfältigungsgerät.',
        'Das Gerät verwahrt gründlich. Das Gerät gibt ungern etwas heraus.',
        'Zugriff nur mit ordnungsgemäßem Antrag.',
        'Ein solcher Antrag liegt bislang nicht vor.']},
  a10: {serie:'A', n:10, minDiff:3, lines:['Aktenzeichen 1-2-1.',
        'Zur Person des Adressaten: kein Ort vermerkt, nur ein Name.',
        'Das ist kein Versehen. Manche Adressaten haben keinen Ort.',
        'Zustellung erfolgt, sobald jemand ihn trifft.',
        'Bislang hat ihn niemand getroffen.']},
  a11: {serie:'A', n:11, minDiff:3, lines:['Aktenzeichen 1-2-2.',
        'Bearbeiterwechsel, siebte Generation seit Gründung.',
        'Vorgänger: sämtlich im Ruhestand, verstorben oder unauffindbar.',
        'Der Vorgang selbst wechselt den Bearbeiter nicht. Nur die Bearbeiter wechseln den Vorgang.',
        'Übergabe erfolgt ohne besonderen Vermerk.']},
  a12: {serie:'A', n:12, minDiff:3, lines:['Aktenzeichen 1-2-3, jüngster Stand.',
        'Der Vorgang ist unverändert offen.',
        'Alle drei Ausfertigungen gelten als unzugestellt.',
        'Die Aussetzung läuft weiter, mangels Frist unbefristet.',
        'Nächste Prüfung: bei Gelegenheit.']},
  b1:  {serie:'B', n:1, biome:'grass', lines:['Ohne Aktenzeichen, Postvermerk.',
        'Der erste Trepp übernimmt den Weg zwischen Amt und Gegenseite.',
        'Sein Sohn übernimmt den Weg von ihm, ohne Übergabeprotokoll.',
        'Ein Protokoll war nicht vorgesehen. Der Weg war ohnehin nur einer.',
        'Beide sind seither Poststelle, nicht mehr Familie mit Beruf.']},
  b2:  {serie:'B', n:2, biome:'grass', lines:['Postvermerk, dritte Generation.',
        'Der Weg wurde um den Brandabschnitt herum verlegt, nach dem Brand.',
        'Länger, aber begehbar. Kürzer war seither keine Option.',
        'Vermerk: „Ein Umweg, der bleibt, ist irgendwann der Weg."']},
  b3:  {serie:'B', n:3, biome:'grass', lines:['Postvermerk, vierte Generation.',
        'Ein Brief ohne lesbare Adresse liegt seit heute in der Poststelle.',
        'Zustellung derzeit nicht möglich. Zurücksenden ebenfalls nicht.',
        'Verwahrt, bis sich das klärt.',
        'Das klärte sich bislang nicht.']},
  b4:  {serie:'B', n:4, biome:'grass', lines:['Postvermerk, fünfte Generation.',
        'Der Weg wird heute wie gestern gegangen, nur schneller.',
        'Der Brief aus Blatt 3 liegt noch immer im selben Fach.',
        'Man gewöhnt sich an einen Brief wie an ein Möbelstück.',
        'Er stört nicht mehr. Er wird nur noch abgestaubt.']},
  b5:  {serie:'B', n:5, biome:'grass', lines:['Postvermerk, sechste Generation.',
        'Der Nachfolger wird eingearbeitet. Er fragt nach dem alten Brief.',
        'Antwort: „Der geht nicht dich an. Der geht niemanden an. Noch nicht."',
        'Der Nachfolger fragt nicht weiter. Das ist die richtige Reaktion.',
        'Er übernimmt den Sack am Ende der Einarbeitung.']},
  b6:  {serie:'B', n:6, biome:'grass', lines:['Postvermerk, siebte Generation, von heute.',
        'Der Sack ist heute schwerer als sonst.',
        'Der alte Brief liegt noch immer zuoberst.',
        'Diesmal wird er geöffnet.',
        'Weiteres siehe Dienstweg.']},
};
const BLAETTER_KEYS = Object.keys(BLAETTER);
```

**Warum `minDiff` und `biome` statt einer festen Fundort-Zeichenkette:** Kapitel 12 nennt für Serie A „alle Biome, ab Kammerstufe 3" und für Serie B „Grasland", ohne Stufeneinschränkung. Ein Feld pro Bedingung reicht, mehr Struktur wäre für 18 Einträge Übergewicht. Serie B trägt bewusst kein `minDiff` (Bedingung entfällt einfach in der Filterfunktion), nicht `minDiff:1`, das wäre eine erfundene Angabe.

**Warum kein `text`-String mit `\n`, sondern `lines`-Array:** Die Leseansicht (siehe unten) rendert jede Zeile als eigenen Absatz, wie im Quelldokument mit `>` abgesetzt. Ein einzelner String mit eingebetteten Zeilenumbrüchen müsste beim Rendern wieder gesplittet werden, das Array spart diesen Schritt und hält sich näher am Ausgangsmaterial.

### Kladde-Erweiterung: `blaetter`-Bucket

`kladde`-Objekt (`index.html:1971`) und die zugehörigen Funktionen bekommen ein fünftes Feld, additiv wie `fl` es in Phase 3 schon vorgemacht hat (alte Speicherstände ohne das Feld laden weiterhin fehlerfrei):

```js
const kladde = {crafts:0, adj:{}, noun:{}, unikate:{}, fl:{}, blaetter:{}};
```

In `loadKladde()` (`index.html:1972`ff.) eine Zeile ergänzen, im selben additiven Stil wie die bestehende `fl`-Zeile:

```js
if(o.blaetter) kladde.blaetter = o.blaetter;
```

`blaetter` ist ein Objekt, kein Array (`{a4: true, b2: true, ...}`), aus demselben Grund, aus dem `unikate` schon ein Objekt ist: Lookup per Schlüssel (`kladde.blaetter[id]`) ist überall dort nötig, wo geprüft wird, ob ein Blatt schon gefunden wurde, ein Array bräuchte dafür `includes()` bei jedem Truhen-Öffnen.

Neue Funktion, direkt unter `noteKladde()` (`index.html:1986`ff.), gleiches Muster wie dort:

```js
function findeBlatt(id){
  if(kladde.blaetter[id]) return false;   // schon gefunden, kein Doppelfund
  kladde.blaetter[id] = true;
  saveKladde();
  return true;
}
```

**Bewusst kein `CFX.schweigen`-Guard hier**, anders als bei `noteKladde()`. Amtsschweigen sperrt laut Phase 3 „das Lernen der Kladde", also die Kessel-Beobachtungen. Aktenfunde sind eine andere Wissensart, gefunden am Fundort, nicht am Kessel erlernt. Die Weltbibel führt das nicht als Ausnahme, aber die bestehende Fluch-Doku (`CFX.schweigen` „sperrt das Lernen der Kladde, solange das Stück getragen wird") bezieht sich eindeutig auf `noteKladde()`-Beobachtungen. Wer hier trotzdem sperren will, muss zuerst mit Matthias klären, ob das gewollt ist, es steht in keiner der beiden Quellen.

### Drop-Mechanik: `truheOeffnen()` (`index.html:3362`)

Bestehende Funktion, ein zusätzlicher Block **nach** der Zutaten-Schleife (`index.html:3374`ff.), **vor** `if(invOpen) renderInventory();`:

```js
// Aktenfund (Phase W2): höchstens einer pro Truhe, unabhängig von den Zutaten.
const kandidaten = BLAETTER_KEYS.filter(id => {
  if(kladde.blaetter[id]) return false;
  const b = BLAETTER[id];
  if(b.serie === 'A') return k.diff >= b.minDiff;
  if(b.serie === 'B') return k.biome === b.biome;
  return false;
});
if(kandidaten.length && Math.random() < 0.18 + k.diff * 0.04){
  const id = kandidaten[Math.floor(Math.random() * kandidaten.length)];
  findeBlatt(id);
  floaters.push({x: k.truhe.x, y: k.truhe.y - 56 - n*16, txt: '+ Aktenfund',
                 col:'#c9b98a', t: 2.8, big: true});
}
```

**Warum ein eigener Wurf statt eine höhere Zutatenmenge:** Die Weltbibel nennt Blätter ausdrücklich als „zusätzlich" zum bestehenden Loot, nicht als Ersatz für einen Zutaten-Slot. `n` (Zutatenanzahl) bleibt unverändert `2 + k.diff`.

**Warum die Chance mit `k.diff` steigt:** Serie A verlangt ohnehin mindestens Stufe 3, dort ist die Grundchance real `0.18 + 3*0.04 = 0.30`. Stufe 5 (`0.38`) ist die verlässlichste Fundquelle, genau wie Kapitel 3 der Weltbibel es für seltene Zutaten schon festlegt („Schwere Kammern sind der einzige verlässliche Weg zu seltenen Zutaten"), hier übertragen auf Aktenfunde. Reine Ermessensentscheidung, da die Weltbibel keine Zahl vorgibt; bei zu seltenem oder zu häufigem Fund im Playtest hier zuerst justieren, nicht die Truhenlogik anfassen.

**Warum `kandidaten.length` vor dem Zufallswurf geprüft wird:** Ohne diese Prüfung würde `Math.random() < ...` bei leerem Pool weiterhin gelegentlich `true` werfen und dann versuchen, aus einem leeren Array zu wählen (`kandidaten[NaN]`), was `findeBlatt(undefined)` aufriefe. Reihenfolge ist deshalb Pflicht, nicht Stil.

**Ein Fund pro Truhe, nicht pro Zutat.** Der Block läuft einmal, außerhalb der `for`-Schleife über `n`. Zwei Blätter aus derselben Truhe wären ein zu schneller Nachschub für nur 18 Einträge insgesamt.

### Dritter Reiter im Kessel-Panel

**HTML** (`index.html:397`ff., innerhalb `#kesselTabs` und daneben):

```html
<div id="kesselTabs">
  <div class="kTab on" id="tabKessel">🍲 Kochen</div>
  <div class="kTab" id="tabKladde">📓 Kladde</div>
  <div class="kTab" id="tabBlaetter">🗄 Akten</div>
</div>
<div id="kesselPane">...</div>
<div id="kladdePane" style="display:none;"><div id="kladdeBox"></div></div>
<div id="blaetterPane" style="display:none;"><div id="blaetterBox"></div></div>
```

**`switchKesselTab()`** (`index.html:4315`ff.) wird von einem binären auf einen dreifachen Schalter erweitert, gleiches Grundmuster:

```js
function switchKesselTab(t){
  kesselTab = t;
  el('tabKessel').classList.toggle('on', t === 'kessel');
  el('tabKladde').classList.toggle('on', t === 'kladde');
  el('tabBlaetter').classList.toggle('on', t === 'blaetter');
  el('kesselPane').style.display = t === 'kessel' ? 'block' : 'none';
  el('kladdePane').style.display = t === 'kladde' ? 'block' : 'none';
  el('blaetterPane').style.display = t === 'blaetter' ? 'block' : 'none';
  if(t === 'kladde') renderKladde();
  else if(t === 'blaetter') renderBlaetter();
  else renderKesselPane();
}
el('tabBlaetter').onclick = () => switchKesselTab('blaetter');
```

`kesselTab` selbst (`index.html:4134`, `let kesselOpen = false, kesselTab = 'kessel';`) braucht keine Änderung, der dritte Wert ist nur eine weitere Zeichenkette, keine neue Variable.

### `renderBlaetter()`, direkt unter `renderKladde()` (`index.html:4247`ff.)

Liste bekannter Blätter, sortiert nach Fundzeitpunkt-Reihenfolge in der Tabelle (also Serie A vor Serie B, aufsteigend nach `n`), mit Klick-Aufklappen statt einem zweiten Overlay:

```js
let blaetterOffen = null;   // welche Blatt-ID gerade aufgeklappt ist, kein neues Panel dafür
function renderBlaetter(){
  const gefunden = BLAETTER_KEYS.filter(id => kladde.blaetter[id]);
  if(!gefunden.length){
    el('blaetterBox').innerHTML = '<div class="klEmpty">Noch keine Aktenfunde. Kammern durchsuchen.</div>';
    return;
  }
  const parts = [`<div style="font-size:10px;color:#9a8a5f;font-style:italic;margin-bottom:6px;">${gefunden.length} von ${BLAETTER_KEYS.length} Blättern gefunden.</div>`];
  for(const id of gefunden){
    const b = BLAETTER[id];
    const titel = `Serie ${b.serie}, Blatt ${b.n}`;
    parts.push(`<div class="ak" onclick="toggleBlatt('${id}')">${titel}${blaetterOffen === id
      ? '<div class="akText">' + b.lines.map(l => `<p>${l}</p>`).join('') + '</div>' : ''}</div>`);
  }
  el('blaetterBox').innerHTML = parts.join('');
}
function toggleBlatt(id){ blaetterOffen = blaetterOffen === id ? null : id; renderBlaetter(); }
```

**Warum Aufklappen statt Lesefenster:** Die Weltbibel verlangt kein eigenes Panel, nur einen dritten Reiter in der Kladde. Ein zusätzliches Overlay bräuchte einen eigenen `z-index`, eine eigene Schließen-Taste und eine Prüfung gegen den Touch-Watchdog (Regressionsschutz Punkt 2). Aufklappen im selben Reiter braucht nichts davon.

**CSS**, neben den bestehenden `#kladdeBox`-Regeln (`index.html:115`ff.) ergänzen:

```css
#blaetterBox{font-size:12px;line-height:1.6;}
#blaetterBox .ak{margin-bottom:8px;padding:6px 8px;cursor:pointer;border-left:2px solid #6b5a3a;}
#blaetterBox .ak:hover{background:rgba(255,255,255,0.04);}
#blaetterBox .akText{margin-top:4px;color:#d8cba8;font-style:italic;}
#blaetterBox .akText p{margin:0 0 4px;}
```

### Was in W2 ausdrücklich nicht angefasst wird

* Kein Knöterich-Hook. Kein neuer Dienstzettel, keine neue Randnotiz, kein neuer Zettel-Text, der einen Aktenfund ankündigt. Der bestehende Floater-Text „+ Aktenfund" ist die einzige Rückmeldung, analog zu den Zutaten-Floatern direkt daneben im selben Codeblock.
* Kein neuer Sound. Die Audio-Phase (Phase 6) gilt als abgeschlossen, `sfx.*` bleibt zu 100 % unverändert, kein 14. Aufrufer kommt dazu.
* Serien C bis F (Brandabschnitt, Eisablage, Berichte einer Dienstreise, Post von drüben) aus Kapitel 12 der Weltbibel. Die sind laut Kapitel 14 ausdrücklich „danach" dran, nicht Teil von W2.
* Kein Sperrvermerk-Refactor an `CFX.schweigen`. Siehe Begründung oben bei `findeBlatt()`.
* Keine Änderung an `rollKammerZutat()`, `k.tier` oder der Zutatenmenge `n`. Der Aktenfund läuft komplett daneben her.

### Abnahme W2

* Alle 18 Blätter sind in `BLAETTER` hinterlegt, Text zeichengleich mit `blaetter-serie-a-b.md`.
* Serie A droppt ausschließlich in Kammern ab Schwierigkeit 3, in allen drei Biomen sowie im Schattenland (kein Biom-Filter für Serie A). Serie B droppt ausschließlich im Grasland, unabhängig von der Schwierigkeit.
* Jede Truhe vergibt höchstens einen Aktenfund, nie zwei, nie ein bereits gefundenes Blatt erneut.
* Ist der Kandidatenpool leer (alle 18 gefunden oder keine Bedingung erfüllt), löst die Truhe trotzdem ihre normale Zutatenmenge aus, ohne Fehler in der Konsole.
* Der dritte Reiter „🗄 Akten" schaltet wie die bestehenden zwei Reiter um, zeigt eine Zähl-Zeile („N von 18 Blättern gefunden"), leere Liste zeigt den Platzhaltertext.
* Gefundene Blätter überstehen Tod, Schichtende und Reload, weil sie im selben `sda_kladde_v1`-Schlüssel liegen wie Kessel-Beobachtungen. Ein alter Speicherstand ohne `blaetter`-Feld lädt ohne Fehler, `kladde.blaetter` bleibt dann `{}`.
* Klick auf ein gefundenes Blatt klappt den Volltext auf, erneuter Klick klappt zu, kein zweites Panel öffnet sich dabei.
* Kein bestehendes Regressionsschutz-Kriterium verletzt: HUD-Dirty-Check unberührt (Aktenfund-Code läuft nicht im Renderpfad), keine neue Allokation pro Frame, Partikel-/Floater-Caps unverändert (`floaters.length > 70`-Deckel bleibt, ein zusätzlicher Floater pro Truhenöffnung ändert daran nichts), Tot-Guard und Sound-Bremsen unangetastet.
* 300 Frames mit Zaubern, offenem Kessel-Panel (alle drei Reiter durchgeschaltet) und mindestens einem ausgelösten Aktenfund ohne Exception, lokal und live.

### Bewusst offen für spätere Bauabschnitte

* **W3** (Dorf spricht) kann Bramsche später eine gezielte Frage zu einem bereits gefundenen Blatt anbieten, das ist hier nicht vorweggenommen.
* Ob ein vollständig gefundener Satz (alle 12 von Serie A, oder alle 6 von Serie B) einen eigenen Hinweis auslöst, entscheidet die Weltbibel nicht. Nicht spekulativ vorbauen, das wäre eine Erfindung ohne Textgrundlage.
