// skript/03-akten-und-katalog.js - Teil 3 von 7 des einen Spielskripts.
// Inhalt: Zutaten, Zulagen-Katalog, Aktenfunde, Vorgangsbestand, Befaehigungszahlen, Touch-Zustand, Monsterkatalog.
//
// Mechanisch an gemessenen Kanten geschnitten: nichts umgezogen, nichts
// umbenannt, nichts umgeschrieben. Klassische Skriptdateien teilen sich EINE
// globale lexikalische Umgebung, deshalb ist die Reihenfolge der Tags in
// index.html Programmtext und keine Sortierung. Wer eine Datei dazwischen
// haengt oder die Reihenfolge dreht, aendert das Programm.
//
// Kein Wort dieser Datei darf ein schliessendes script-Tag enthalten, auch
// nicht im Kommentar: build-single.mjs backt alle sieben in EINEN Block, und
// dort beendet diese Zeichenfolge das Skript mitten im Satz. Der Build prueft
// das und bricht ab, damit es nicht erst im Browser auffaellt.
//
// 'use strict' gilt pro Datei, nicht pro Seite, darum steht es in jeder erneut.
// Beim Ruecklauf in EINEN Block (tools/build-single.mjs) sind die Wiederholungen
// wirkungslose String-Literale.
'use strict';
// --- Ab hier unveraendert aus index.html geschnitten (Teilung vom 29.08.2026). ---
// ===========================================================================
//  ZUTATEN-GRAMMATIK  (Phase 1)
//
//  Monster droppen keine fertige Ausrüstung mehr, nur noch Zutaten.
//  Eine Zutat ist Adjektiv + Substantiv:
//      Substantiv  <- Monstertyp. Bestimmt den Ausrüstungs-Slot.
//      Adjektiv    <- beim Drop gewürfelt (Biom + Monster-Seltenheit).
//                     Bestimmt die Wirkung.
//  Am Kessel ergeben drei Zutaten ein Ausrüstungsteil:
//      Slot     = häufigstes Substantiv, bei Gleichstand die seltenste Zutat
//      Wirkung  = häufigstes Adjektiv; 2x gleich verstärkt, 3x gleich = Unikat
//      Qualität = Summe der Zutaten-Seltenheiten
//
//  Diese Regeln stehen absichtlich NIRGENDS im Spiel. Kein Rezeptbuch, keine
//  Vorschau. Die Kladde füllt sich nur mit dem, was wirklich beobachtet wurde.
//  Ablauf-Code liest ausschließlich Felder aus diesen Tabellen und kennt keinen
//  einzigen Namen; neue Zutaten sind reine Tabellenarbeit.
// ===========================================================================

const SLOT_DE = {weapon:'Waffe', armor:'Rüstung', shield:'Schild', boots:'Stiefel'};
// Fugenform für die Kladde: "im Waffen-Slot" statt "im Waffe-Slot"
const SLOT_FUGE = {weapon:'Waffen', armor:'Rüstungs', shield:'Schild', boots:'Stiefel'};

// Alle 21 Monstertypen aus MONDEF haben genau ein Substantiv.
//   g    = Genus, nur für die Adjektiv-Endung (klebriger / klebrige / klebriges)
//   slot = Ausrüstungs-Slot, den dieses Substantiv mitbringt
//   rar  = Grundseltenheit der Zutat
const ZUTAT_NOUNS = {
  // Grasland
  slime:       {n:'Chuchu-Gallert',    g:'n', slot:'shield', rar:0, icon:'🫧'},
  goblin:      {n:'Goblin-Zeh',        g:'m', slot:'boots',  rar:0, icon:'🦶'},
  greenmage:   {n:'Schamanenbart',     g:'m', slot:'weapon', rar:1, icon:'🌿'},
  // Frostkamm
  ghost:       {n:'Geisterschleier',   g:'m', slot:'armor',  rar:1, icon:'👻'},
  frostgolem:  {n:'Frostgolem-Brocken',g:'m', slot:'shield', rar:2, icon:'🧊'},
  frostmage:   {n:'Schneemagier-Auge', g:'n', slot:'weapon', rar:2, icon:'❄️'},
  // Aschewüste
  crab:        {n:'Krabbenschere',     g:'f', slot:'weapon', rar:1, icon:'🦀'},
  scorpion:    {n:'Skorpionstachel',   g:'m', slot:'weapon', rar:1, icon:'🦂'},
  sandmage:    {n:'Priesterquaste',    g:'f', slot:'armor',  rar:2, icon:'🏵️'},
  // Schattenland
  shadow:      {n:'Schattenfetzen',    g:'m', slot:'armor',  rar:0, icon:'🕸️'},
  demon:       {n:'Hundszahn',         g:'m', slot:'weapon', rar:1, icon:'🦷'},
  shadowghost: {n:'Spuknebel',         g:'m', slot:'boots',  rar:1, icon:'💨'},
  shadowmage:  {n:'Ruferzunge',        g:'f', slot:'weapon', rar:2, icon:'👅'},
  boss:        {n:'Fürstenkrone',      g:'f', slot:'armor',  rar:4, icon:'👑'},
  // Monsterkatalog M1: die zehn neuen Typen. Der Slot folgt der Loot-Signatur
  // seines Bioms (Wald Stiefel und Schilde, Nassablage Rüstungen, Brandabschnitt
  // Waffen, Untere Registratur Schilde, Altbestand arkane Waffen), die
  // Grundseltenheit folgt der Ertragsklasse: Fleiß 0 bis 1, Geduld 2, Risiko 2,
  // Meisterschaft 3 bis 4.
  ablagestapel:    {n:'Loseblattbündel',  g:'n', slot:'shield', rar:1, icon:'📄'},
  zustellbote:     {n:'Botensohle',       g:'f', slot:'boots',  rar:3, icon:'👞'},
  blubberakte:     {n:'Sumpfgallert',     g:'n', slot:'armor',  rar:0, icon:'💧'},
  moorbescheid:    {n:'Moorbinde',        g:'f', slot:'armor',  rar:2, icon:'🌿'},
  amtsschimmel:    {n:'Schimmelquaste',   g:'f', slot:'armor',  rar:2, icon:'🍄'},
  fristlaeufer:    {n:'Fristfunke',       g:'m', slot:'weapon', rar:3, icon:'⏳'},
  skarabaeus:      {n:'Panzerspan',       g:'m', slot:'weapon', rar:1, icon:'🪲'},
  sammelmahnung:   {n:'Mahnsiegel',       g:'n', slot:'shield', rar:2, icon:'📜'},
  aktenbote:       {n:'Botenmappe',       g:'f', slot:'weapon', rar:1, icon:'📬'},
  sammelverfuegung:{n:'Urschrift-Siegel', g:'n', slot:'weapon', rar:4, icon:'🗝️'},
  // Kammerwächter (Phase 2 verdrahtet die Roster)
  mummy:       {n:'Mumienbinde',       g:'f', slot:'armor',  rar:2, icon:'🧻'},
  golem:       {n:'Golem-Splitter',    g:'m', slot:'shield', rar:3, icon:'🪨'},
  spider:      {n:'Spinnenbein',       g:'n', slot:'boots',  rar:1, icon:'🕷️'},
  bat:         {n:'Fledermausflügel',  g:'m', slot:'boots',  rar:1, icon:'🦇'},
  stalfos:     {n:'Skelettknöchel',    g:'m', slot:'boots',  rar:2, icon:'🦴'},
  mage:        {n:'Irrlicht-Funke',    g:'m', slot:'weapon', rar:2, icon:'🔹'},
  bossgeneric: {n:'Schreckensklaue',   g:'f', slot:'shield', rar:4, icon:'🦅'},
  // M3: die Sperrablage. Ihre Signatur ist Ruestung, und aus ihrem einen
  // Risiko-Gegner faellt die Waffe. Grundseltenheit nach Ertragsklasse wie bei M1.
  teilbescheid:{n:'Teilbescheid-Gallert', g:'n', slot:'armor',  rar:1, icon:'🫧'},
  dienstweg:   {n:'Schneckenhaus',      g:'n', slot:'armor',  rar:2, icon:'🐌'},
  teilabhilfe: {n:'Teilabhilfe-Kern',   g:'m', slot:'weapon', rar:3, icon:'🔷'},
  // W-Lager: Schild, Waffe und Rüstung, alle drei vor demselben Tor. Das ist die
  // Signatur des Ortes — wer dorthin geht, holt sich eine Ausstattung, nicht eine Zutat.
  vorbehalt:        {n:'Speerspitze',    g:'f', slot:'shield', rar:2, icon:'🔱'},
  zwischennachricht:{n:'Pfeilschaft',    g:'m', slot:'weapon', rar:2, icon:'🏹'},
  empfangsbekenntnis:{n:'Lagerpetschaft',g:'f', slot:'armor',  rar:4, icon:'🕯️'},
};

// Wirkungen: name = wie die Kladde sie nennt, fx = Aggregat-Schlüssel für die
// Code-Hooks, satz = Anzeigetext je Stufe (1x / 2x verstärkt / Unikat).
// In der Anzeige stehen nur ganze Sätze. Gerechnet wird intern.
const WIRKUNG = {
  zaeh:         {name:'Verlangsamung', fx:'slow',   unikat:'Amtssiegel der Zähflüssigkeit',
    satz:['Deine Treffer machen Gegner zäh.', 'Getroffene Gegner werden auffällig schwerfällig.', 'Was du triffst, kommt praktisch nicht mehr vorwärts.']},
  wucht:        {name:'Wucht', fx:'crit', unikat:'Beschwerdehammer',
    satz:['Ab und zu triffst du unangemessen hart.', 'Du triffst oft unangemessen hart.', 'Fast jeder Schlag ist eine Zumutung.']},
  zorn:         {name:'Nachdruck', fx:'dmg', unikat:'Dienstanweisung mit Stiel',
    satz:['Deine Schläge tragen mehr Nachdruck.', 'Deine Schläge tragen deutlich mehr Nachdruck.', 'Deine Schläge sind reiner Nachdruck.']},
  panzer:       {name:'Panzerung', fx:'armor', unikat:'Schutzvorschrift in Blech',
    satz:['Du steckst mehr weg.', 'Du steckst erheblich mehr weg.', 'An dir beißt sich alles die Zähne aus.']},
  flink:        {name:'Eile', fx:'speed', unikat:'Kurierschuhe der Fristwahrung',
    satz:['Du bist schneller unterwegs.', 'Du bist deutlich schneller unterwegs.', 'Du huschst, statt zu gehen.']},
  gemurmel:     {name:'Manafluss', fx:'mana', unikat:'Murmelnde Aktenmappe',
    satz:['Dein Mana kehrt schneller zurück.', 'Dein Mana kehrt spürbar schneller zurück.', 'Mana sprudelt beinahe von selbst.']},
  quelle:       {name:'Selbstheilung', fx:'regen', unikat:'Feuchte Bescheinigung',
    satz:['Kleine Wunden schließen sich von selbst.', 'Wunden schließen sich zügig von selbst.', 'Du heilst, als hätte es nie wehgetan.']},
  genau:        {name:'Genauigkeit', fx:'exact', unikat:'Pedantenknüppel',
    satz:['Dein Schaden schwankt nicht mehr.', 'Dein Schaden schwankt nicht und liegt höher.', 'Dein Schaden ist auf die Zweitstelle genau und ziemlich hoch.']},
  amtsschimmel: {name:'Goldsegen', fx:'gold', unikat:'Beglaubigter Geldbeutel',
    satz:['Gold fällt reichlicher an.', 'Gold fällt deutlich reichlicher an.', 'Gold fällt an, als wäre Haushaltsende.']},
  aktenkunde:   {name:'Aktenkunde', fx:'xp', unikat:'Laufmappe der Erkenntnis',
    satz:['Du lernst schneller aus Vorfällen.', 'Du lernst deutlich schneller aus Vorfällen.', 'Jeder Vorfall ist eine Fortbildung.']},
  rueckstoss:   {name:'Rückstoß', fx:'knock', unikat:'Zugluftkeule',
    satz:['Getroffene Gegner fliegen weiter.', 'Getroffene Gegner fliegen erheblich weiter.', 'Getroffene Gegner verlassen die Gegend.']},
  trankgueltig: {name:'Trankwirkung', fx:'potion', unikat:'Gestempelte Feldflasche',
    satz:['Tränke wirken kräftiger.', 'Tränke wirken deutlich kräftiger.', 'Ein Schluck genügt für alles.']},
  weitschweifig:{name:'Reichweite', fx:'arc', unikat:'Ausschweifende Stange',
    satz:['Dein Hieb greift weiter aus.', 'Dein Hieb greift deutlich weiter aus.', 'Dein Hieb nimmt den halben Vorplatz mit.']},
  beutelaune:   {name:'Beutelaune', fx:'beute', unikat:'Festliche Sammelbüchse',
    satz:['Monster lassen häufiger Zutaten liegen.', 'Monster lassen deutlich häufiger Zutaten liegen.', 'Monster hinterlassen fast immer etwas Brauchbares.']},
  // Phase 3: zehn weitere Wirkungen, damit alle 24 Vorteile über die Grammatik erreichbar sind.
  zehrend:      {name:'Zehrung', fx:'leech', unikat:'Beitragsbescheid mit Klinge',
    satz:['Wer dich ärgert, zahlt einen kleinen Beitrag an deine Gesundheit.', 'Der Beitrag fällt spürbar höher aus.', 'Du finanzierst dich vollständig aus fremdem Unglück.']},
  beschwoerend: {name:'Zauberkraft', fx:'zauber', unikat:'Vorlesungsstab',
    satz:['Deine Zauber tragen mehr Gewicht.', 'Deine Zauber tragen deutlich mehr Gewicht.', 'Deine Zauber sind eine amtliche Ansage.']},
  haushaltend:  {name:'Sparsamkeit', fx:'sparsam', unikat:'Haushaltssperre am Gürtel',
    satz:['Zauber gehen sparsamer mit deinem Mana um.', 'Zauber gehen deutlich sparsamer mit deinem Mana um.', 'Dein Mana reicht für fast alles.']},
  hastig:       {name:'Schlagzahl', fx:'tempo', unikat:'Stechuhr mit Griff',
    satz:['Du schlägst schneller zu.', 'Du schlägst deutlich schneller zu.', 'Du schlägst, als wäre gleich Dienstschluss.']},
  wohlgenaehrt: {name:'Leibesfülle', fx:'leben', unikat:'Zweites Frühstück in Blech',
    satz:['Du hältst mehr aus.', 'Du hältst deutlich mehr aus.', 'Du bist praktisch nicht kleinzukriegen.']},
  anziehend:    {name:'Anziehung', fx:'magnet', unikat:'Zuständigkeitsmagnet',
    satz:['Beute kommt dir ein Stück entgegen.', 'Beute kommt dir deutlich weiter entgegen.', 'Beute sucht dich förmlich auf.']},
  einschuechternd:{name:'Einschüchterung', fx:'schreck', unikat:'Vorladung mit Stiel',
    satz:['Getroffene Gegner zögern kurz.', 'Getroffene Gegner zögern spürbar länger.', 'Getroffene Gegner überlegen sich alles noch einmal.']},
  abweisend:    {name:'Abweisung', fx:'bollwerk', unikat:'Ablehnungsbescheid',
    satz:['Schläge auf dich verlieren an Wirkung.', 'Schläge auf dich verlieren deutlich an Wirkung.', 'Schläge auf dich gelten als unbegründet.']},
  nachfuellend: {name:'Nachschlag', fx:'nachschlag', unikat:'Bodenlose Feldflasche',
    satz:['Manchmal bleibt im Fläschchen noch etwas übrig.', 'Oft bleibt im Fläschchen noch etwas übrig.', 'Das Fläschchen wird einfach nicht leer.']},
  gut_unterrichtet:{name:'Aktenlage', fx:'karte', unikat:'Beglaubigter Lageplan',
    satz:['Verschlossene Türen stehen dir auf der Karte.', 'Türen und Truhen stehen dir auf der Karte.', 'Auf deiner Karte ist nichts mehr geheim.']},
};

// ===========================================================================
//  K1: DIE ZULAGEN — was die Personalstelle nach jedem Aufstieg vorlegt
//
//  Die Fiktion (Weltbibel Kapitel 5): das Haus zahlt keine Erfahrung aus, es
//  genehmigt sie. Mit jedem Aufstieg legt die Personalstelle drei Zulagen vor,
//  eine wird bewilligt, die anderen beiden gelten als nicht beantragt. Getragen
//  wird in der Dienstmappe, und die fasst wenig: ein Fach bis Stufe 5, zwei bis
//  Stufe 15, drei darueber. Was nicht eingelegt ist, liegt in der Kartei und
//  laesst sich ausserhalb des Gefechts umstecken.
//
//  Der Bezeichner heisst ueberall zulage*, nie karte*: FX.karte ist seit
//  Phase 3 die Wirkung 'Aktenlage' und 'Karte' im Anzeigetext ist die Weltkarte.
//  'Befugnis' war auch vergeben, das ist seit Z2 die Zaubererlaubnis ab Stufe 4.
//
//  Aufbau je Familie, absichtlich derselbe Schnitt wie WIRKUNG oben:
//    name       Amtsname der Karte
//    icon       Sinnbild, steht nur auf der Karte, nie im Satz
//    fx         Aggregat-Schluessel in FX. Entweder ein bestehender (dann erbt
//               die Karte den Hook der Kessel-Wirkung) oder einer der sechs
//               neuen aus K1 (Waffengattung, Zauberzweig).
//    wert       Zaehlerpunkte je Stufe I/II/III. Stufe I ist genau ein
//               Wirkungsrang, Stufe III liegt einen Punkt ueber dem Unikat der
//               Ausruestung. Das ist der Kracher, und er braucht keine zweite
//               Formel: alle Deckel (Bollwerk 40, Sparsamkeit 55, Crit 75) sind
//               Math.min an ihrer Fundstelle und fangen jede Summe.
//    stapelbar  ob zwei gleiche Karten gleichzeitig in der Mappe liegen duerfen
//    unikat     Name der Stufe III, wie bei WIRKUNG
//    modus      nur mit dieser Waffengattung wirksam (dagger/sword/doubleaxe)
//    zweig      nur fuer diesen Zauberzweig wirksam (0 Feuer, 1 Frost, 2 Arkan)
//    satz       Anzeigetext je Stufe. Ganze Saetze, KEINE Zahlen, keine
//               Gedankenstriche (Weltbibel Kapitel 13). Gerechnet wird intern,
//               zulagenAssert() prueft beides bei jedem Laden nach.
//    bild       (freiwillig) Feld aus bis zu drei Pfaden, EINES JE STUFE. Die
//               drei Stufen zeigen dieselbe Sache in drei Haertegraden, und
//               diese Eskalation ist der Sammelanreiz. Luecken sind erlaubt,
//               dann steht dort das Sinnbild. Ein einzelner Pfad gilt fuer
//               alle drei. Siehe zulagen-bildprompts.md.
//
//  Zu den &shy; in den Namen: das sind weiche Trennstellen an den Fugen der
//  Komposita. Sie gehen durch innerHTML und werden dort zum unsichtbaren
//  U+00AD, das nur dann als Trennstrich erscheint, wenn die Zeile wirklich
//  bricht. Sie stehen hier, weil eine Kartenspalte rund hundertzehn Pixel
//  breit ist und 'Unerschoepflichkeitsklausel' in keine davon passt; ohne sie
//  bricht der Browser mitten im Wort. hyphens:auto im CSS macht dasselbe,
//  aber nur dort, wo ein deutsches Trennwoerterbuch mitgeliefert ist, und
//  darauf ist kein Verlass. Wer einen Namen aendert, setzt die Fugen mit.
//
//  Diese Tabelle steht VOR recalc() (das noch auf Skriptebene laeuft) und vor
//  player. Das ist dieselbe TDZ-Disziplin wie bei den S1-Konstanten weiter unten.
// ===========================================================================
const ZULAGE = {
  // Das bild-Feld traegt einen Pfad je Stufe. Die Dateinamen sind nicht frei
  // gewaehlt, sondern Schluessel plus Stufe: zulagenAssert() rechnet sie aus
  // dem Katalog nach, damit ein Zahlendreher oder eine vertauschte Familie
  // nicht still das falsche Bild auf die Karte legt. Erzeugt werden sie mit
  // tools/zulagen-bild.py aus den Midjourney-Vorlagen.
  // --- Waffengattung. Bis K1 war w.base.mode reine Animationswahl. ----------
  stichprobe: {name:'Stichprobe', icon:'🔪', fx:'dolch', modus:'dagger',
    bild:['assets/zulagen/stichprobe-1.jpg', 'assets/zulagen/stichprobe-2.jpg',
          'assets/zulagen/stichprobe-3.jpg'],
    wert:[1,2,4], stapelbar:true, unikat:'Stichprobe ohne Vor&shy;ankündigung',
    satz:['Dein Dolch nimmt Stichproben.',
          'Deine Stichproben fallen gründlich aus.',
          'Jede Stichprobe gilt als vollständige Prüfung.']},
  klingenzulage: {name:'Klingen&shy;zulage', icon:'⚔️', fx:'schwert', modus:'sword',
    bild:['assets/zulagen/klingenzulage-1.jpg', 'assets/zulagen/klingenzulage-2.jpg',
          'assets/zulagen/klingenzulage-3.jpg'],
    wert:[1,2,4], stapelbar:true, unikat:'Hoheitliche Klingen&shy;führung',
    satz:['Dein Schwert liegt besser in der Hand.',
          'Dein Schwert liegt deutlich besser in der Hand.',
          'Dein Schwert gilt amtlich als Argument.']},
  pauschalabfertigung: {name:'Pauschal&shy;abfertigung', icon:'🪓', fx:'axt', modus:'doubleaxe',
    bild:['assets/zulagen/pauschalabfertigung-1.jpg', 'assets/zulagen/pauschalabfertigung-2.jpg',
          'assets/zulagen/pauschalabfertigung-3.jpg'],
    wert:[1,2,4], stapelbar:true, unikat:'Spaltung letzter Instanz',
    satz:['Deine Axt fertigt gründlicher ab.',
          'Deine Axt fertigt erheblich gründlicher ab.',
          'Was deine Axt trifft, ist abschließend geteilt.']},
  // --- Zauberzweig. Blitz ist im Haus kein eigenes Element, sondern Arkan. --
  brandschutzausnahme: {name:'Brandschutz&shy;ausnahme', icon:'🔥', fx:'feuer', zweig:0,
    bild:['assets/zulagen/brandschutzausnahme-1.jpg', 'assets/zulagen/brandschutzausnahme-2.jpg',
          'assets/zulagen/brandschutzausnahme-3.jpg'],
    wert:[1,2,4], stapelbar:true, unikat:'Groß&shy;brand&shy;verfügung',
    satz:['Deine Feuerzauber dürfen heißer brennen.',
          'Deine Feuerzauber dürfen deutlich heißer brennen.',
          'Deine Feuerzauber gelten als angeordnetes Großfeuer.']},
  kaltverfuegung: {name:'Kalt&shy;verfügung', icon:'❄️', fx:'frost', zweig:1,
    bild:['assets/zulagen/kaltverfuegung-1.jpg', 'assets/zulagen/kaltverfuegung-2.jpg',
          'assets/zulagen/kaltverfuegung-3.jpg'],
    wert:[1,2,4], stapelbar:true, unikat:'Kalt&shy;verfügung mit sofortiger Voll&shy;ziehbarkeit',
    satz:['Deine Frostzauber beißen kälter.',
          'Deine Frostzauber beißen deutlich kälter.',
          'Wen deine Frostzauber treffen, der ist kaltgestellt.']},
  blitzbeschluss: {name:'Blitz&shy;beschluss', icon:'⚡', fx:'arkan', zweig:2,
    bild:['assets/zulagen/blitzbeschluss-1.jpg', 'assets/zulagen/blitzbeschluss-2.jpg',
          'assets/zulagen/blitzbeschluss-3.jpg'],
    wert:[1,2,4], stapelbar:true, unikat:'Unanfechtbarer Blitz&shy;beschluss',
    satz:['Deine Arkanzauber schlagen härter ein.',
          'Deine Arkanzauber schlagen deutlich härter ein.',
          'Gegen deine Arkanzauber gibt es keinen Widerspruch.']},
  // --- Allgemein. Erben die Hooks der Kessel-Wirkungen. ---------------------
  vollzugszulage: {name:'Vollzugs&shy;zulage', icon:'🔨', fx:'dmg',
    bild:['assets/zulagen/vollzugszulage-1.jpg', 'assets/zulagen/vollzugszulage-2.jpg',
          'assets/zulagen/vollzugszulage-3.jpg'],
    wert:[1,2,4], stapelbar:true, unikat:'Sofort&shy;vollzug',
    satz:['Deine Angriffe tragen zusätzliche Härte.',
          'Deine Angriffe tragen erhebliche zusätzliche Härte.',
          'Deine Angriffe werden sofort vollzogen. Die Anhörung entfällt.']},
  erschwerniszulage: {name:'Erschwernis&shy;zulage', icon:'⛑️', fx:'leben',
    bild:['assets/zulagen/erschwerniszulage-1.jpg', 'assets/zulagen/erschwerniszulage-2.jpg',
          'assets/zulagen/erschwerniszulage-3.jpg'],
    wert:[1,2,4], stapelbar:true, unikat:'Volle Belastungs&shy;stufe',
    satz:['Du bist für Erschwernisse eingestuft. Du hältst mehr aus.',
          'Deine Einstufung steigt. Du hältst deutlich mehr aus.',
          'Du bist für die höchste Belastung zugelassen.']},
  haertefallregelung: {name:'Härtefall&shy;regelung', icon:'🛡️', fx:'bollwerk',
    bild:['assets/zulagen/haertefallregelung-1.jpg', 'assets/zulagen/haertefallregelung-2.jpg',
          'assets/zulagen/haertefallregelung-3.jpg'],
    wert:[1,2,4], stapelbar:false, unikat:'Bestands&shy;schutz',
    satz:['Schläge treffen dich milder. Du giltst als Härtefall.',
          'Schläge treffen dich deutlich milder.',
          'Du genießt Bestandsschutz. Vieles prallt einfach ab.']},
  gebuehrenbefreiung: {name:'Gebühren&shy;befreiung', icon:'🧾', fx:'sparsam',
    bild:['assets/zulagen/gebuehrenbefreiung-1.jpg', 'assets/zulagen/gebuehrenbefreiung-2.jpg',
          'assets/zulagen/gebuehrenbefreiung-3.jpg'],
    wert:[1,2,4], stapelbar:false, unikat:'Schwarze Null',
    satz:['Deine Zauber sind teilweise von der Gebühr befreit.',
          'Deine Zauber sind weitgehend von der Gebühr befreit.',
          'Deine Zauber kosten beinahe nichts. Die Gebührenstelle schweigt.']},
  pruefvermerk: {name:'Prüfvermerk', icon:'🔍', fx:'crit',
    bild:['assets/zulagen/pruefvermerk-1.jpg', 'assets/zulagen/pruefvermerk-2.jpg',
          'assets/zulagen/pruefvermerk-3.jpg'],
    wert:[1,2,4], stapelbar:false, unikat:'Beanstandung mit Folgen',
    satz:['Ab und zu findest du eine empfindliche Stelle.',
          'Du findest auffällig oft eine empfindliche Stelle.',
          'Fast jede deiner Prüfungen endet mit einer Beanstandung.']},
  eilverfahren: {name:'Eilverfahren', icon:'⏱️', fx:'tempo',
    bild:['assets/zulagen/eilverfahren-1.jpg', 'assets/zulagen/eilverfahren-2.jpg',
          'assets/zulagen/eilverfahren-3.jpg'],
    wert:[1,2,4], stapelbar:false, unikat:'Eilverfahren wegen Gefahr im Verzug',
    satz:['Deine Schläge werden bevorzugt bearbeitet.',
          'Deine Schläge überholen den Dienstweg.',
          'Deine Schläge sind erledigt, bevor der Vorgang angelegt ist.']},
  dienstweg: {name:'Dienstweg', icon:'🥾', fx:'speed',
    bild:['assets/zulagen/dienstweg-1.jpg', 'assets/zulagen/dienstweg-2.jpg',
          'assets/zulagen/dienstweg-3.jpg'],
    wert:[1,2,4], stapelbar:false, unikat:'Abkürzung, beglaubigt',
    satz:['Du kennst die kürzeren Flure.',
          'Du kennst die deutlich kürzeren Flure.',
          'Dein Dienstweg ist amtlich abgekürzt.']},
  // Die letzten beiden tragen auf Stufe III bewusst einen Punkt weniger.
  // Manaregeneration und Erfahrungsgewinn wirken dauernd und verstaerken sich
  // selbst; der volle Kracher waere hier der Zauberspam aus der Zeit vor Z2
  // beziehungsweise eine Stufenleiter, die sich selbst ueberholt.
  laufender_bezug: {name:'Laufender Bezug', icon:'☕', fx:'mana',
    bild:['assets/zulagen/laufender_bezug-1.jpg', 'assets/zulagen/laufender_bezug-2.jpg',
          'assets/zulagen/laufender_bezug-3.jpg'],
    wert:[1,2,3], stapelbar:false, unikat:'Unerschöpf&shy;lichkeits&shy;klausel',
    satz:['Dein Mana kommt als laufender Bezug.',
          'Dein laufender Bezug fällt üppiger aus.',
          'Dein Vorrat gilt als unerschöpflich. Fast.']},
  dienstalterszulage: {name:'Dienstalters&shy;zulage', icon:'🗓️', fx:'xp',
    bild:['assets/zulagen/dienstalterszulage-1.jpg', 'assets/zulagen/dienstalterszulage-2.jpg',
          'assets/zulagen/dienstalterszulage-3.jpg'],
    wert:[1,2,3], stapelbar:false, unikat:'Altgedient',
    satz:['Dein Dienstalter wächst schneller als der Kalender.',
          'Dein Dienstalter wächst deutlich schneller als der Kalender.',
          'Du giltst als altgedient. Seit heute Morgen.']},
};

// Die Faecher der Dienstmappe. Absteigend, damit find() die erste passende
// Zeile nimmt. Das ist die einzige Stelle, an der die Schwellen stehen.
const ZULAGE_FAECHER = [{abStufe:15, n:3}, {abStufe:5, n:2}, {abStufe:1, n:1}];
const zulageSlots = st => ZULAGE_FAECHER.find(f => st >= f.abStufe).n;
const ZULAGE_MAPPE_NAME = ['Mappe', 'Doppelmappe', 'Ordner'];
const ZULAGE_STAPEL_MAX = 2;   // stapelbar heisst zweimal, nicht dreimal
const ZULAGE_ROEMISCH = ['I', 'II', 'III'];
// Laengstes Stueck ohne Trennstelle, das auf die Namensleiste passt. Gemessen
// im Browser an der schmalsten Kartenspalte (Kartei, rund hundertzehn Pixel)
// bei der groessten Schriftstufe. Das laengste im Katalog ist 'Unanfechtbarer'
// mit vierzehn; der Deckel laesst zwei Zeichen Luft und faellt vorher auf.
const ZULAGE_WORT_MAX = 16;

// Stufengewichte der Ziehung in Prozent, absteigend nach abStufe. w2/w3 sind
// die Chancen auf Stufe II und III, der Rest ist Stufe I. Vor Stufe 5 gibt es
// keinen Kracher: ein Unikat in der ersten Minute entwertet die ganze Leiter.
const ZULAGE_STUFEN_GEWICHT = [
  {abStufe:15, w2:45, w3:40},
  {abStufe:10, w2:50, w3:20},
  {abStufe:5,  w2:40, w3:5},
  {abStufe:1,  w2:20, w3:0},
];

// Adjektive: w = Biom-Gewicht, minMon = nötige Monster-Seltenheit (0..3).
// Mehrere Adjektive dürfen auf dieselbe Wirkung zeigen; genau das macht die
// Kladde interessant.
// fl = Fluch bei Stufe 1, fl2 = Fluch ab Stufe 2 (verstärkt/Unikat), optional.
// Verstärken macht den Fluch schlimmer statt nur den Vorteil stärker.
const ZUTAT_ADJ = [
  {a:'klebrig',            wirk:'zaeh',         fl:'kurzarm',                          rar:0, minMon:0, w:{grass:6,   snow:1,   sand:2,   shadow:2, sumpf:5, hoehle:2, ruine:1}},
  {a:'durchgefroren',      wirk:'zaeh',         fl:'langsame_zunge',                   rar:1, minMon:0, w:{grass:0.5, snow:6,   sand:0.2, shadow:1, sumpf:0.5, hoehle:2, ruine:1}},
  {a:'empört',             wirk:'wucht',        fl:'fehlschlag', fl2:'zerplatzer',     rar:0, minMon:0, w:{grass:3,   snow:2,   sand:2,   shadow:3, sumpf:2, hoehle:2, ruine:2}},
  {a:'leicht verkohlt',    wirk:'zorn',         fl:'steuer',                           rar:0, minMon:0, w:{grass:1,   snow:0.3, sand:4,   shadow:2, sumpf:0.5, hoehle:1, ruine:2}},
  {a:'glühend',            wirk:'zorn',         fl:'zutatenschwund', fl2:'blutmagie',  rar:1, minMon:1, w:{grass:1,   snow:0.5, sand:5,   shadow:2, sumpf:0.3, hoehle:1, ruine:1.5}},
  {a:'störrisch',          wirk:'panzer',       fl:'standfest',                        rar:0, minMon:0, w:{grass:3,   snow:3,   sand:2,   shadow:1, sumpf:2, hoehle:6, ruine:2}},
  {a:'übermütig',          wirk:'flink',        fl:'zappel',                           rar:0, minMon:0, w:{grass:4,   snow:1,   sand:2,   shadow:3, sumpf:1, hoehle:1, ruine:1}},
  {a:'zugig',              wirk:'rueckstoss',   fl:'schleuder',                        rar:0, minMon:0, w:{grass:2,   snow:4,   sand:2,   shadow:1, sumpf:1, hoehle:2, ruine:2}},
  {a:'unangenehm feucht',  wirk:'quelle',       fl:'duenn',                            rar:1, minMon:0, w:{grass:3,   snow:2,   sand:0.4, shadow:1, sumpf:6, hoehle:2, ruine:0.5}},
  {a:'murmelnd',           wirk:'gemurmel',     fl:'manatot',                          rar:1, minMon:1, w:{grass:2,   snow:2,   sand:1,   shadow:3, sumpf:1, hoehle:2, ruine:6}},
  {a:'frisch gestempelt',  wirk:'trankgueltig', fl:'hektik', fl2:'nuechtern',          rar:1, minMon:1, w:{grass:2,   snow:2,   sand:2,   shadow:1, sumpf:2, hoehle:1, ruine:1}},
  {a:'ausschweifend',      wirk:'weitschweifig',fl:'geschwaetzig', fl2:'einzelziel',   rar:1, minMon:1, w:{grass:2,   snow:1,   sand:2,   shadow:2, sumpf:1, hoehle:2, ruine:2}},
  {a:'pedantisch',         wirk:'genau',        fl:'stumpf', fl2:'amtsschweigen',      rar:2, minMon:2, w:{grass:2,   snow:2,   sand:2,   shadow:2, sumpf:1, hoehle:4, ruine:2}},
  {a:'amtlich beglaubigt', wirk:'amtsschimmel', fl:'goldschwund', fl2:'goldzauber',    rar:2, minMon:2, w:{grass:2,   snow:1,   sand:1,   shadow:1, sumpf:1, hoehle:2, ruine:2}},
  {a:'verwaltungserfahren',wirk:'aktenkunde',   fl:'stille_zahlen',                    rar:2, minMon:2, w:{grass:1.5, snow:1.5, sand:1.5, shadow:2, sumpf:1, hoehle:1.5, ruine:5}},
  {a:'feierlich',          wirk:'beutelaune',   fl:'blindbalken', fl2:'gruss',         rar:2, minMon:3, w:{grass:1,   snow:1,   sand:1,   shadow:2, sumpf:1, hoehle:1, ruine:2}},
  // Phase 3: zehn neue Adjektive, je eins pro neuer Wirkung. Fluch ist bewusst die
  // Kehrseite desselben Adjektivs (z.B. macht "gut unterrichtet" die Karte lesbar,
  // aber blendet die Lebensbalken aus).
  {a:'zehrend',            wirk:'zehrend',         fl:'zerplatzer',       rar:1, minMon:1, w:{grass:2,   snow:2,   sand:2,   shadow:3, sumpf:3, hoehle:1, ruine:2}},
  {a:'raunend',            wirk:'beschwoerend',    fl:'blutmagie',        rar:2, minMon:2, w:{grass:1.5, snow:1.5, sand:1.5, shadow:3, sumpf:1, hoehle:1.5, ruine:5}},
  {a:'genügsam',           wirk:'haushaltend',     fl:'steuer',           rar:1, minMon:1, w:{grass:3,   snow:2,   sand:2,   shadow:1, sumpf:2, hoehle:2, ruine:4}},
  {a:'aufgeregt',          wirk:'hastig',          fl:'zappel',           rar:0, minMon:0, w:{grass:3,   snow:2,   sand:3,   shadow:2, sumpf:2, hoehle:2, ruine:1}},
  {a:'gut gepolstert',     wirk:'wohlgenaehrt',    fl:'standfest',        rar:1, minMon:0, w:{grass:2,   snow:3,   sand:1,   shadow:1, sumpf:5, hoehle:3, ruine:1}},
  {a:'magnetisch',         wirk:'anziehend',       fl:'geschwaetzig',     rar:1, minMon:1, w:{grass:2,   snow:1,   sand:2,   shadow:2, sumpf:1, hoehle:3, ruine:2}},
  {a:'grimmig',            wirk:'einschuechternd', fl:'schnelle_bolzen',  rar:0, minMon:0, w:{grass:2,   snow:2,   sand:2,   shadow:3, sumpf:2, hoehle:2, ruine:3}},
  {a:'abgestempelt',       wirk:'abweisend',       fl:'nuechtern',        rar:1, minMon:1, w:{grass:1,   snow:2,   sand:2,   shadow:1, sumpf:5, hoehle:2, ruine:1}},
  {a:'randvoll',           wirk:'nachfuellend',    fl:'duenn',            rar:1, minMon:1, w:{grass:2,   snow:1,   sand:1,   shadow:1, sumpf:3, hoehle:1, ruine:1}},
  {a:'gut unterrichtet',   wirk:'gut_unterrichtet',fl:'blindbalken',      rar:2, minMon:2, w:{grass:1,   snow:1,   sand:1,   shadow:2, sumpf:1, hoehle:5, ruine:2}},
];
const ADJ_BY_KEY = {};
for(const d of ZUTAT_ADJ) ADJ_BY_KEY[d.a] = d;

// ===========================================================================
//  FLUCH-ÖKONOMIE  (Phase 3)
//  Jedes Kessel-Item trägt neben der Wirkung genau einen Fluch, deutscher Satz,
//  keine Zahl. cfx = Aggregat-Schlüssel in CFX, hart = zählt gegen das Budget
//  aus recalc() (höchstens zwei harte Flüche gleichzeitig wirksam).
//
//  Sechs bewusste Wechselwirkungen:
//   - zappel x standfest: Stehenbleiben kostet Leben, Rüstung wirkt nur im Stehen.
//     Härteste Kombination, aber beide sind 'hart' und das Budget lässt nur zwei zu.
//   - blutmagie x manatot heben sich auf: wer eh kein Mana regeneriert, verliert
//     durch Blutmagie kaum noch etwas.
//   - blutmagie x nuechtern verstärkt sich: Leben ist Zauberressource und im
//     Kampf nicht nachfüllbar. nuechtern greift deshalb nur oberhalb 30% maxHp.
//   - gruss x zappel: Grüßen ist ein Tastendruck ohne Stehzwang, frisst aber den
//     Moment vor dem Zuschlagen.
//   - goldzauber x goldschwund verstärkt sich: das Zauberbudget verdunstet doppelt.
//   - blindbalken x stille_zahlen: vollständige Informationssperre über Kampfstand.
const FLUCH = {
  fehlschlag:      {cfx:'fehl',     kurz:'Fehlschlag',        satz:'Jeder dritte Schlag geht daneben.'},
  einzelziel:      {cfx:'einzel',   kurz:'Einzelzuständigkeit', satz:'Dein Hieb erfasst nur einen Gegner. Für den Rest ist jemand anderes zuständig.'},
  stumpf:          {cfx:'stumpf',   kurz:'Stumpfheit',        satz:'Deine Waffe kennt keine Ausnahmen mehr. Nichts trifft mehr besonders hart.'},
  kurzarm:         {cfx:'kurzarm',  kurz:'Kurzarm',           satz:'Dein Hieb bleibt dicht am Körper. Man muss schon sehr nah heran.'},
  gruss:           {cfx:'gruss',    kurz:'Grußpflicht', hart:true, satz:'Gegner müssen erst gegrüßt werden.'},
  zappel:          {cfx:'zappel',   kurz:'Zappeln', hart:true, satz:'Du kannst nicht mehr stehenbleiben.'},
  standfest:       {cfx:'stand',    kurz:'Standpflicht', hart:true, satz:'Deine Rüstung wirkt nur im Stehen. Wer läuft, ist ungeschützt.'},
  schleuder:       {cfx:'schleuder',kurz:'Schleuderrückstoß', satz:'Jeder Zauber schleudert dich rückwärts. Man tritt zurück, wenn man etwas anordnet.'},
  blutmagie:       {cfx:'blut',     kurz:'Eigenanteil', hart:true, satz:'Deine Zauber kosten Leben statt Mana.'},
  manatot:         {cfx:'manatot',  kurz:'Manastopp', hart:true, satz:'Dein Mana kehrt nicht mehr von selbst zurück. Es muss beantragt werden.'},
  goldzauber:      {cfx:'goldz',    kurz:'Verwaltungsgebühr', satz:'Zaubern kostet zusätzlich Gold. Verwaltungsgebühr.'},
  langsame_zunge:  {cfx:'zunge',    kurz:'Langsame Zunge',    satz:'Zwischen zwei Zaubern liegt ein Dienstweg.'},
  goldschwund:     {cfx:'goldweg',  kurz:'Goldschwund',       satz:'Gold verfällt langsam in deiner Tasche.'},
  zutatenschwund:  {cfx:'zutweg',   kurz:'Zutatenschwund',    satz:'Zutaten zerfallen dir unter den Fingern.'},
  amtsschweigen:   {cfx:'schweigen',kurz:'Amtsschweigen',     satz:'Die Kladde schweigt, solange du das trägst.'},
  steuer:          {cfx:'steuer',   kurz:'Fundsteuer',        satz:'Auf Fundgold wird ein Anteil einbehalten.'},
  duenn:           {cfx:'duenn',    kurz:'Verdünnung',        satz:'Deine Tränke sind gestreckt.'},
  hektik:          {cfx:'hektik',   kurz:'Hektik',            satz:'Tränke wirken sofort. Sie schmecken nach Konfetti und machen kurz hektisch.'},
  nuechtern:       {cfx:'nuecht',   kurz:'Nüchternheitsgebot', hart:true, satz:'Im laufenden Vorgang wird nicht getrunken.'},
  blindbalken:     {cfx:'blind',    kurz:'Aktenblindheit',    satz:'Du siehst keine Lebensbalken mehr.'},
  stille_zahlen:   {cfx:'stille',   kurz:'Stille Zahlen',     satz:'Schadenszahlen werden nachgereicht. Irgendwann.'},
  geschwaetzig:    {cfx:'laut',     kurz:'Geschwätzigkeit',   satz:'Deine Ausrüstung ist geschwätzig. Gegner aggroen auf doppelte Entfernung.'},
  schnelle_bolzen: {cfx:'bolz',     kurz:'Vorfahrt',          satz:'Gegnergeschosse haben Vorfahrt.'},
  zerplatzer:      {cfx:'platz',    kurz:'Zerplatzer',        satz:'Erledigte Gegner platzen dir ins Gesicht.'},
};

// Ausrüstung, die am Kessel entsteht. Index = Qualitätsstufe 0..4.
// Zahlen sind interne Rechengrößen und tauchen in keinem Tooltip auf.
const CRAFT_BASE = {
  // S1: Die drei schweren Klingen tragen einen Kraftbedarf. Wer den Siegelbrecher
  // erbraut und ihn nicht heben kann, hat den staerksten Grund der Welt, beim
  // naechsten Aufstieg auf Kraft zu gehen. Genau dafuer steht er da.
  weapon: [
    {name:'Behelfsklinge',      mode:'dagger',    dmg:[4,7],   aps:1.7,  kraft:0,  icon:'🗡️'},
    {name:'Amtsklinge',         mode:'sword',     dmg:[8,13],  aps:1.35, kraft:0,  icon:'🗡️'},
    {name:'Dienstschwert',      mode:'sword',     dmg:[15,23], aps:1.3,  kraft:4,  icon:'⚔️'},
    {name:'Vorschriftsspalter', mode:'doubleaxe', dmg:[28,46], aps:0.8,  kraft:8,  icon:'🪓'},
    {name:'Siegelbrecher',      mode:'doubleaxe', dmg:[42,66], aps:0.9,  kraft:12, icon:'🪓'},
  ],
  armor: [
    {name:'Dienstkittel',   armor:3,  icon:'👕'},
    {name:'Aktenweste',     armor:7,  icon:'👕'},
    {name:'Amtsharnisch',   armor:13, icon:'🧥'},
    {name:'Bearbeitungspanzer', armor:20, icon:'🧥'},
    {name:'Ordnungsrüstung',armor:29, icon:'🧥'},
  ],
  shield: [
    {name:'Deckelschild',      armor:2,  icon:'🛡️'},
    {name:'Klemmbrett',        armor:5,  icon:'🛡️'},
    {name:'Amtsschild',        armor:9,  icon:'🛡️'},
    {name:'Prüfsiegelschild',  armor:15, icon:'🛡️'},
    {name:'Widerspruchsschild',armor:22, icon:'🛡️'},
  ],
  boots: [
    {name:'Filzlatschen',  spd:8,  armor:1, icon:'🥾'},
    {name:'Dienststiefel', spd:14, armor:2, icon:'🥾'},
    {name:'Kurierstiefel', spd:20, armor:3, icon:'🥾'},
    {name:'Eilstiefel',    spd:27, armor:5, icon:'🥾'},
    {name:'Botenstiefel',  spd:34, armor:7, icon:'🥾'},
  ],
};

// --- Zutaten: Namen, Beutel, Würfeln ---------------------------------------
// Starke Adjektivbeugung im Nominativ: der/die/das -> er/e/es am letzten Wort.
const adjForm = (a, g)=> a + (g === 'm' ? 'er' : g === 'f' ? 'e' : 'es');
function zutatName(z){ const nd = ZUTAT_NOUNS[z.noun]; return adjForm(z.adj, nd.g) + ' ' + nd.n; }
function zutatRar(z){ return clamp(ZUTAT_NOUNS[z.noun].rar + ADJ_BY_KEY[z.adj].rar, 0, 4); }
const zutatIcon = z => ZUTAT_NOUNS[z.noun].icon;

// Monster-Seltenheit aus der bestehenden MONDEF-Tabelle ableiten, damit ein
// neuer Monstertyp keine zweite Pflegestelle bekommt.
function monRar(d){ return d.boss ? 3 : (d.xp >= 30 ? 2 : (d.xp >= 18 ? 1 : 0)); }

function pickAdj(biome, mr){
  let total = 0;
  for(const d of ZUTAT_ADJ){ if(d.minMon <= mr) total += (d.w[biome] || 0.5); }
  let roll = Math.random() * total;
  for(const d of ZUTAT_ADJ){
    if(d.minMon > mr) continue;
    roll -= (d.w[biome] || 0.5);
    if(roll <= 0) return d.a;
  }
  return ZUTAT_ADJ[0].a;
}

function pouchTotal(){ let s = 0; for(const z of player.pouch) s += z.count; return s; }
function addZutat(noun, adj, n){
  if(!kn.pending.zutat1 && !kn.seen.zutat1){ kn.pending.zutat1 = true; saveKn(); }   // erste Zutat aufgenommen
  for(const z of player.pouch) if(z.noun === noun && z.adj === adj){ z.count += n; auftragEreignis('zutat'); return z; }
  const z = {noun, adj, count:n}; player.pouch.push(z); auftragEreignis('zutat'); return z;   // W4
}
function takeZutat(noun, adj){
  for(let i=0; i<player.pouch.length; i++){
    const z = player.pouch[i];
    if(z.noun === noun && z.adj === adj){
      if(--z.count <= 0) player.pouch.splice(i, 1);
      return true;
    }
  }
  return false;
}

// ===========================================================================
//  KESSEL-KLADDE
//  Füllt sich ausschließlich mit beobachteten Zusammenhängen. Regeln, die noch
//  nie ausgelöst haben, stehen nicht drin. Überlebt bewusst schon jetzt jeden
//  Neustart (localStorage): in Phase 4 ist Wissen der eigentliche Fortschritt.
// ===========================================================================
// ===========================================================================
//  AKTENFUNDE (Phase W2, erweitert um Serie C-F, seit SZ3 um Serie I)
//  54 Blätter, sieben Serien. Fundwege sind dreigeteilt: A/B/C/D fallen aus
//  Kammertruhen (truheOeffnen(), Filter unten prüft minDiff bzw. biome).
//  E/F gibt es nur im Schattenland, wo es keine Kammern gibt — eigener
//  Dropkanal in killMon() (currentLevel === 2). Siehe phase-w-blaetter-cf.md
//  für die Begründung, warum E/F kein biome-Feld bekommen haben.
//  Serie I ist der dritte Weg und der einzige, der an einem EREIGNIS haengt
//  statt an einem Ort: sie faellt ueberall, aber erst nachdem der Stopfen
//  gezogen ist (SZ3, blattFaelltAusRohr()). Vorher gibt es sie nicht, weil
//  vorher nichts durchkommt.
//  Kein Blatt verrät Kesselgrammatik oder eine Fluch-Ableitung, siehe
//  Sperrvermerk. Reihenfolge beim Fund ist absichtlich egal.
//  Zusagen-Bilanz 2026-08-04: a1/a5 verorteten den Vorgang fälschlich in
//  Zuständigkeitsbereich VI, den die Weltbibel als abgeschlossen führt
//  (Kapitel 3/9/15). Die Welt selbst ist Bereich VII. Auf VII korrigiert,
//  synchron mit blaetter-serie-a-b.md und phase-w2-aktenfunde.md.
// ===========================================================================
const BLAETTER = {
  a1:  {serie:'A', n:1,  minDiff:3, lines:['Aktenzeichen 1-0-2.',
        'Der Zuständigkeitsbereich VII meldet Waffenstillstandsbruch.',
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
        'Gründungsverfügung der Stelle für den Zuständigkeitsbereich VII.',
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
  c1:  {serie:'C', n:1, biome:'sand', lines:['Aktenzeichen 9-[verkohlt].',
        'Anweisung zur ordnungsgemäßen Aktenvernichtung, Bereich VII.',
        'Betroffen: sämtliche Unterlagen zu einem einzelnen Vorgang.',
        'Welcher Vorgang, ist nicht mehr zu ermitteln. Der Rand ist verbrannt.']},
  c2:  {serie:'C', n:2, biome:'sand', lines:['Ohne lesbares Aktenzeichen, Rand verkohlt.',
        'Vernichtungsprotokoll, unterschrieben mit Kürzel statt Namen.',
        'Grund der Vernichtung laut Formular: „ordnungsgemäß".',
        'Der Rest des Formulars ist Asche.']},
  c3:  {serie:'C', n:3, biome:'sand', lines:['Aktenzeichen 9-1-[Rest fehlt].',
        'Vermerk eines Feuerwehrmanns, der nicht zuständig war.',
        'Zitat: „Das war kein Unfall. Das war ordentlich gestapelt."',
        'Der Vermerk wurde selbst zu den Akten genommen. Und verbrannte mit.']},
  c4:  {serie:'C', n:4, biome:'sand', lines:['Aktenzeichen 9-2-1, teilweise erhalten.',
        'Liste der zu vernichtenden Vorgänge, Punkt eins bis sieben lesbar.',
        'Punkt acht: nur noch der Buchstabe N.',
        'Punkt neun bis Ende: Asche.']},
  c5:  {serie:'C', n:5, biome:'sand', lines:['Ohne Aktenzeichen.',
        'Ein Brandmeldeprotokoll, das den Brand erst drei Tage später meldet.',
        'Begründung für die Verspätung: „Dienstweg."',
        'Der Dienstweg ist länger als der Brand gedauert hat.']},
  c6:  {serie:'C', n:6, biome:'sand', lines:['Aktenzeichen 9-2-[unleserlich].',
        'Randnotiz, andere Handschrift, halb verkohlt: „Nicht al[...]s Feuer ist Zufall."',
        'Der Rest der Notiz lässt sich nicht mehr rekonstruieren.',
        'Die Akte, auf die sich die Notiz bezog, ebenfalls nicht.']},
  c7:  {serie:'C', n:7, biome:'sand', lines:['Aktenzeichen 9-3-1.',
        'Inventarliste des Brandabschnitts, angelegt nach dem Brand.',
        'Eintrag: „Eine Truhe, verschlossen, Herkunft unbekannt, überstand das Feuer."',
        'Verbleib der Truhe: siehe Anlage. Die Anlage ist verbrannt.']},
  c8:  {serie:'C', n:8, biome:'sand', lines:['Aktenzeichen 9-3-2, letztes lesbares Blatt der Serie.',
        'Abschlussvermerk: die Aktenvernichtung gilt als vollständig durchgeführt.',
        'Nachprüfung nicht vorgesehen, da nichts mehr zu prüfen ist.',
        'Zuständig bleibt trotzdem jemand. Das steht so im Organigramm.']},
  d1:  {serie:'D', n:1, biome:'snow', lines:['Aktenzeichen 4-0-1.',
        'Vorgang zurückgestellt zur Klärung einer einzelnen Frage.',
        'Die Frage lautet: Ist der Antragsteller derselbe wie in Zeile drei?',
        'Antwort steht aus.']},
  d2:  {serie:'D', n:2, biome:'snow', lines:['Aktenzeichen 4-0-1, erste Erinnerung.',
        'Rückfrage erneut versandt, wegen ausbleibender Antwort.',
        'Bearbeitungsstand: unverändert zurückgestellt.',
        'Frist zur Beantwortung: zwei Wochen. Verstrichen seit: einhundertsiebzig Jahre.']},
  d3:  {serie:'D', n:3, biome:'snow', lines:['Aktenzeichen 4-0-2.',
        'Vorgang betrifft eine Grenzmarkierung im Schnee.',
        'Die Markierung wurde seither mehrfach weggeweht und immer wieder neu gesetzt.',
        'Immer an derselben Stelle. Das gilt als Bestätigung.']},
  d4:  {serie:'D', n:4, biome:'snow', lines:['Aktenzeichen 4-1-1.',
        'Zwei Zeilen fehlen zur vollständigen Klärung des Vorgangs.',
        'Welche zwei Zeilen das sind, ist selbst Gegenstand eines offenen Vorgangs.',
        'Zuständig dafür: eine noch zu benennende Stelle.']},
  d5:  {serie:'D', n:5, biome:'snow', lines:['Aktenzeichen 4-1-2.',
        'Der Antragsteller ist zwischenzeitlich verzogen, neue Anschrift unbekannt.',
        'Die Klärung wartet auf denselben Antragsteller unter derselben Anschrift.',
        'Beides gleichzeitig ist unwahrscheinlich.']},
  d6:  {serie:'D', n:6, biome:'snow', lines:['Aktenzeichen 4-1-3.',
        'Randnotiz, andere Handschrift: „Vielleicht ist die Frage falsch gestellt."',
        'Antwort darunter, dritte Handschrift: „Dann stellen wir sie eben richtig. Später."',
        '„Später" ist nicht terminiert.']},
  d7:  {serie:'D', n:7, biome:'snow', lines:['Aktenzeichen 4-2-1.',
        'Zwischenbericht: der Vorgang wurde geprüft und für weiterhin ungeklärt befunden.',
        'Die Prüfung selbst gilt als abgeschlossen.',
        'Das Ergebnis der Prüfung nicht.']},
  d8:  {serie:'D', n:8, biome:'snow', lines:['Aktenzeichen 4-2-2, jüngster Stand.',
        'Die zwei fehlenden Zeilen aus Blatt vier wurden gefunden.',
        'Sie beantworten eine andere Frage als die gestellte.',
        'Der Vorgang bleibt zurückgestellt, jetzt aus einem neuen Grund.']},
  e1:  {serie:'E', n:1, lines:['Ohne Aktenzeichen. Erster Bericht.',
        'Ankunft in Ablage V wie geplant. Der Empfang war förmlich.',
        'Der Empfänger war nicht anwesend. Ich warte.',
        'Weiterer Bericht folgt nach Rücksprache.']},
  e2:  {serie:'E', n:2, lines:['Zweiter Bericht.',
        'Der Empfänger lässt bitten, sich zu gedulden.',
        'Die Gastfreundschaft ist über jeden Zweifel erhaben.',
        'Ein Rückweg ist mir bislang nicht angeboten worden.']},
  e3:  {serie:'E', n:3, lines:['Dritter Bericht.',
        'Ich habe nach der Uhrzeit gefragt. Man konnte sie mir nicht nennen.',
        'Das scheint hier niemanden zu beunruhigen.',
        'Mich auch nicht. Noch nicht.']},
  e4:  {serie:'E', n:4, lines:['Vierter Bericht.',
        'Der Brief liegt noch immer bei mir, ungeöffnet, wie es sich gehört.',
        'Man hat mich nicht danach gefragt.',
        'Ich finde das bemerkenswert höflich oder bemerkenswert etwas anderes.']},
  e5:  {serie:'E', n:5, lines:['Fünfter Bericht.',
        'Ich bitte erneut um eine Antwort auf meine letzten vier Berichte.',
        'Die Post hier ist zuverlässig. Von hier weg, vermutlich auch.',
        'Vermutlich.']},
  e6:  {serie:'E', n:6, lines:['Sechster Bericht.',
        'Man hat mir einen eigenen Schreibtisch eingerichtet. Ohne dass ich darum gebeten hätte.',
        'Das nehme ich nicht als gutes Zeichen.',
        'Ich nehme es trotzdem an. Es ist ein guter Schreibtisch.']},
  e7:  {serie:'E', n:7, lines:['Siebter Bericht.',
        'Ich habe um einen Termin für die Übergabe gebeten. Fünfmal.',
        'Die Antwort ist jedes Mal dieselbe Höflichkeit.',
        'Höflichkeit ist keine Antwort. Das würde ich gern jemandem hier sagen.']},
  e8:  {serie:'E', n:8, lines:['Achter Bericht.',
        'Ich schreibe nicht mehr jede Woche. Es ändert nichts an der Antwort.',
        'Der Tee hier ist tatsächlich gut.',
        'Das schreibe ich, weil es stimmt, nicht weil es beruhigen soll.']},
  e9:  {serie:'E', n:9, lines:['Neunter Bericht.',
        'Ich warte weiter. Das ist inzwischen die ganze Nachricht.',
        'Sagen Sie Zwirn, der Antrag war richtig gestellt.',
        'Das war er.']},
  e10: {serie:'E', n:10, lines:['Ohne Aktenzeichen.',
        'Der Tee ist gut. Antworten Sie bitte.']},
  f1:  {serie:'F', n:1, lines:['Ohne Absender vermerkt, Handschrift fremd.',
        'Man hört, ein Bote sei unterwegs. Das freut mich aufrichtig.',
        'Nehmen Sie sich Zeit. Ich habe reichlich davon.',
        'Mit vorzüglicher Hochachtung, der Empfänger.']},
  f2:  {serie:'F', n:2, lines:['Ohne Absender vermerkt.',
        'Ihr Bote hat heute den Postweg um den Brandabschnitt herum genommen.',
        'Eine gute Wahl. Ich habe zugesehen.',
        'Grüßen Sie die Poststelle von mir. Sie wissen nicht, dass ich sie kenne.']},
  f3:  {serie:'F', n:3, lines:['Ohne Absender vermerkt.',
        'Man sagt mir, es gebe inzwischen einen neuen Außendienstler.',
        'Ich freue mich auf die Bekanntschaft. Wirklich.',
        'Kommen Sie vorbei, wann immer es Ihnen passt. Ich warte ohnehin.']},
  f4:  {serie:'F', n:4, lines:['Ohne Absender vermerkt.',
        'Ich habe den Tisch gedeckt. Für den Fall, dass diesmal jemand kommt.',
        'Bislang kam niemand. Das rechne ich niemandem an.',
        'Mit vorzüglicher Hochachtung, und aufrichtiger Geduld, der Empfänger.']},
  // SZ3: Serie I, aus der Röhre. Der einzige Fundweg, der nicht an einem Ort
  // hängt, sondern an einem Ereignis: sie fällt überall und erst, nachdem der
  // Stopfen gezogen ist. Vorher gibt es sie nicht, weil vorher nichts durchkommt.
  //
  // Alle sechs sind an jemanden gerichtet, den es im Haus gibt, und keines ist
  // beantwortet worden. Das ist der ganze Inhalt der Serie: nicht dass Post
  // liegen blieb, sondern an wen sie gerichtet war.
  i1:  {serie:'I', n:1, lines:['An die Amtsleitung, Zuständigkeitsbereich VII. Im Jahr 863.',
        'Ist dort noch jemand?',
        'Um Nachricht wird gebeten.']},
  i2:  {serie:'I', n:2, lines:['An die Amtsleitung, Zuständigkeitsbereich VII. Im Jahr 901.',
        'Wir haben lange nichts von Ihnen gehört.',
        'Sollte der Bereich abgeschlossen sein, teilen Sie es uns bitte mit.']},
  i3:  {serie:'I', n:3, lines:['An das Ministerium für Monsterangelegenheiten. Im Jahr 934.',
        'Betrifft: Niederschlag im Zuständigkeitsbereich VII.',
        'Die Zurückstellung aus dem Jahr achthundertsiebenundneunzig wäre zu überprüfen.',
        'Wir bitten um Sachstand.',
        'Am Rand: „Vierter Versuch."']},
  i4:  {serie:'I', n:4, lines:['An den Wetterbeauftragten des Bereichs VII, persönlich. Im Jahr 969.',
        'Sehr geehrter Herr Vorgänger.',
        'Wir wissen, dass Sie warten.',
        'Wir wissen nicht, wie wir helfen sollen.']},
  i5:  {serie:'I', n:5, lines:['Bewilligung. Im Jahr 1004.',
        'Das Dorffest zu Vordermühl an der Ablage wird bewilligt.',
        'Zur Kenntnis: die Amtsleitung.']},
  i6:  {serie:'I', n:6, lines:['Beileidsschreiben. Im Jahr 612.',
        'Zum Ableben Seiner Majestät sprechen wir unser tiefes Beileid aus.',
        'Anschrift: An Seine Majestät den Kaiser, persönlich.',
        'Rückvermerk: Empfänger im Termin.']},
};
const BLAETTER_KEYS = Object.keys(BLAETTER);

// GW20: Gemeinsame Pruefvokabeln aller acht Guards. Die Sperrliste stand bis
// hierher fuenfmal, der Emoji-Bereich sechsmal als identische Kopie im File.
// Sie waren deckungsgleich, aber jede Kopie ist eine Gelegenheit zu driften,
// ohne dass es jemand bemerkt. Eine Quelle, ein Ort, vor dem ersten Guard.
const PRUEF_EMOJI  = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u;
// E1: Begriffe, die dem Anfang nicht gehoeren. Sie stand bis E1 als lokale
// Liste in dienstAssert() und gilt seither fuer zwei Texte statt fuer einen
// (Vordruck und Empfang), also steht sie hier oben bei den uebrigen
// Prueflisten und nicht in einem der beiden Guards. Zwei Stellen, die
// dasselbe behaupten, waeren die F1-Falle.
const AKTE_SPERRE = ['Nachtrag', 'Ausfertigung', 'Zustell', 'Krieg', 'Frieden', 'Vertrag',
                     'Trepp', 'Sturz', 'Schattenfürst', 'Anschrift', 'Vorgang 1', 'Amtsleiterin'];
const PRUEF_GEHEIM = ['Substantiv', 'Adjektiv', 'Seltenheit', 'drei gleiche', 'dreimal',
                      'Slot', 'ergibt', 'bewirkt', 'Wirkung entsteht', 'Fluch entsteht', 'Alter'];

// Guard, Bauform wie knAssertCaps()/auftragAssertBrett() weiter unten. Beweist
// beim Start, dass keine Serie "still vorhanden" ist, d.h. in BLAETTER_KEYS
// mitgezählt wird (Zählzeile "N von 54"), aber über keinen Fundweg erreichbar
// ist. TRUHE_SERIEN fällt in truheOeffnen() (Kammer, biome bzw. minDiff),
// SCHATTEN_SERIEN fällt in killMon() (Schattenland, kein biome-Feld). Biome-
// Liste hier bewusst als Literal, nicht aus BIOME_MOBS/BIOM_AMT gelesen: beide
// werden erst deutlich weiter unten deklariert, ein Zugriff hier liefe in die
// TDZ, siehe Übergabe-Falle.
// GW24: Funktionsdeklaration statt IIFE. Als benannter Funktionsausdruck
// existierte der Name nur im eigenen Rumpf — der Guard lief genau einmal beim
// Laden und liess sich danach nie wieder aufrufen. Ausgerechnet der Guard mit
// der vollstaendigsten Pruefdimension war damit der einzige, den eine spaetere
// Gegenprobe nicht befragen konnte. Verhalten identisch, nur nachpruefbar.
function blaetterAssert(){
  const TRUHE_SERIEN = ['A', 'B', 'C', 'D'];
  const SCHATTEN_SERIEN = ['E', 'F'];
  // SZ3: der dritte Fundweg. Serie I faellt nicht an einem Ort, sondern nach
  // einem Ereignis — ueberall, und erst wenn der Stopfen gezogen ist. Deshalb
  // ein eigener Eintrag und kein Anhaengen an eine der beiden Listen: die
  // Pruefungen darunter fragen nach Ort (biome, minDiff), und die hat Serie I
  // zu Recht nicht.
  const ROHR_SERIEN = ['I'];
  const TRUHE_BIOME = BIOME_BANDS.map(b => b.key);
  const SOLL = {A:12, B:6, C:8, D:8, E:10, F:4, I:6};
  const EMOJI = PRUEF_EMOJI;
  const GEHEIM = PRUEF_GEHEIM;
  let ok = true;
  const fehler = (m, ...r) => { ok = false; console.error('Aktenfunde:', m, ...r); };

  const gesehen = {};
  for(const id of BLAETTER_KEYS){
    const b = BLAETTER[id];
    if(!SOLL[b.serie]) { fehler('Serie ohne Sollzahl', id, b.serie); continue; }
    if(TRUHE_SERIEN.indexOf(b.serie) < 0 && SCHATTEN_SERIEN.indexOf(b.serie) < 0
       && ROHR_SERIEN.indexOf(b.serie) < 0){
      fehler('Serie ohne bekannten Fundweg (weder Truhe noch Schattenland noch Roehre)', id, b.serie);
    }
    // SZ3: Serie I traegt weder biome noch minDiff, und das ist die Zusicherung.
    // Ein Ortsfeld an ihr waere eine Behauptung, die kein Fundweg einloest.
    if(ROHR_SERIEN.indexOf(b.serie) >= 0 && (b.biome || typeof b.minDiff === 'number'))
      fehler('Serie aus der Roehre traegt ein Ortsfeld, faellt aber ueberall', id);
    if(b.serie === 'A' && typeof b.minDiff !== 'number') fehler('Serie A ohne minDiff', id);
    if((b.serie === 'B' || b.serie === 'C' || b.serie === 'D')){
      if(!b.biome) fehler('Kammer-Serie ohne biome-Feld', id);
      else if(TRUHE_BIOME.indexOf(b.biome) < 0) fehler('biome-Feld auf unbekanntes Biom', id, b.biome);
    }
    if((b.serie === 'E' || b.serie === 'F') && b.biome) fehler('Schattenland-Serie hat ein biome-Feld, kann nie droppen', id);
    if(!b.lines || !b.lines.length) fehler('Blatt ohne Text', id);
    else if(b.lines.length > 6) fehler('Mehr als sechs Zeilen', id, b.lines.length);
    for(const l of (b.lines || [])){
      if(/[—–]/.test(l)) fehler('Gedankenstrich statt Interpunkt', id, l);
      if(EMOJI.test(l)) fehler('Emoji im Blatttext', id, l);
      for(const g of GEHEIM) if(l.indexOf(g) >= 0) fehler('Sperrvermerk: Kesselgrammatik im Text', id, g, l);
    }
    gesehen[b.serie] = (gesehen[b.serie] || 0) + 1;
  }
  for(const s in SOLL) if(gesehen[s] !== SOLL[s]) fehler('Serie hat falsche Blattzahl', s, 'ist', gesehen[s] || 0, 'soll', SOLL[s]);
  if(BLAETTER_KEYS.length !== 54) fehler('Gesamtzahl ist nicht 54', BLAETTER_KEYS.length);
  if(!ok) console.error('Aktenfunde: Guard fehlgeschlagen, siehe obige Zeilen.');
  return ok;
}
blaetterAssert();

const KLADDE_KEY = 'sda_kladde_v1';
const kladde = {crafts:0, adj:{}, noun:{}, unikate:{}, fl:{}, blaetter:{}, vorgang:{}, lang:{},
                // AN5: was vom Anfang gelesen wurde. Ein Schluessel je Tafel,
                // 'intro:0' bis 'ernennung:5'. Der Eimer traegt das Gelesene
                // und nicht das Ungelesene: der Bestand steht fest (ANFANG_
                // BESTAND), gezaehlt wird die Gegenprobe. Ein Eimer, der das
                // Ungelesene traegt, muesste beim Kuerzen eines Stapels
                // aufgeraeumt werden -- dieser nicht.
                anfang:{}};
(function loadKladde(){
  try{
    const raw = localStorage.getItem(KLADDE_KEY); if(!raw) return;
    const o = JSON.parse(raw);
    if(o && typeof o === 'object'){
      kladde.crafts = o.crafts | 0;
      if(o.adj) kladde.adj = o.adj;
      if(o.noun) kladde.noun = o.noun;
      if(o.unikate) kladde.unikate = o.unikate;
      if(o.fl) kladde.fl = o.fl;    // additiv: alte Speicherstände ohne fl laden ohne Fehler
      if(o.blaetter) kladde.blaetter = o.blaetter;
      if(o.vorgang) kladde.vorgang = o.vorgang;   // W5: additiv wie fl
      if(o.lang) kladde.lang = o.lang;            // W7: additiv wie fl, fehlender Schlüssel liest sich als 0
      if(o.anfang) kladde.anfang = o.anfang;      // AN5: additiv wie fl, ein alter Stand liest sich als "nichts gelesen"
    }
  }catch(_){}
})();
function saveKladde(){ try{ localStorage.setItem(KLADDE_KEY, JSON.stringify(kladde)); }catch(_){} }
function noteKladde(bucket, key, value){
  if(CFX.schweigen) return;   // Fluch 'Amtsschweigen': die Kladde lernt nichts Neues dazu
  const b = kladde[bucket];
  const e = b[key] || (b[key] = {});
  e[value] = (e[value] | 0) + 1;
}
// Bewusst kein CFX.schweigen-Guard: Aktenfunde werden am Fundort gefunden,
// nicht am Kessel beobachtet. Siehe phase-w2-aktenfunde.md.
function findeBlatt(id){
  if(kladde.blaetter[id]) return false;   // schon gefunden, kein Doppelfund
  kladde.blaetter[id] = true;
  saveKladde();
  return true;
}

// ===========================================================================
//  W5: DER VORGANGS-BESTAND — Weltbibel Kapitel 9, Akt IV. Vier Adresszeilen,
//  bewusst getrennt von BLAETTER: blaetterAssert()s Sollzahl 54 und die
//  Zählzeile "N von 54" (renderBlaetter()) bleiben dadurch unberührt. Drei
//  Zeilen liegen in Sonderkammern (ein Biom je Zeile, siehe setzeKammerTueren()
//  und drawKammerTuer()), die vierte fällt in Ablage V (killMon()), weil es
//  dort keine Kammern gibt, siehe A. Genau wie findeBlatt(): kein
//  CFX.schweigen-Guard, eine Adresszeile wird am Fundort gefunden, nicht am
//  Kessel beobachtet.
const ADRESS_ZEILEN = {
  1: {biome:'snow', lines:['Der erste Streifen der Anschrift, wasserfleckig aus der Eisablage.',
      'Zu lesen: "An". Mehr nicht. Nörgel bestätigt die Schrift.',
      'Trepp fragt, an wen. Niemand antwortet ihr.']},
  2: {biome:'grass', lines:['Der zweite Streifen, aus einer Kammerakte in Ablage A.',
      'Zu lesen: "Fürst Nachtrag". Bramsche wird sehr still.',
      'Zwirn sagt, den Namen habe er noch nie gehört. Das stimmt nicht.']},
  3: {biome:'sand', lines:['Der dritte Streifen, angesengt aus dem Brandabschnitt.',
      'Zu lesen: "zu Händen, persönlich". Nörgel liest es zweimal.',
      'Eine Anschrift ohne Ort. Nur eine Person.']},
  4: {biome:null, lines:['Der letzte Streifen, gefunden in Ablage V selbst.',
      'Er trägt kein Wort. Nur ein Siegel, das niemand kennt.',
      'Die Anschrift ist vollständig. Sie führt hierher und nirgendwo sonst hin.']},
};
const VORGANG_ANSCHRIFT = 'An Fürst Nachtrag, zu Händen, persönlich.';
function findeAdresszeile(id){
  if(kladde.vorgang[id]) return false;   // schon gefunden, kein Doppelfund
  kladde.vorgang[id] = true;
  saveKladde();
  return true;
}
const vorgangHat = id => !!kladde.vorgang[id];
const vorgangDreiZeilen = () => vorgangHat(1) && vorgangHat(2) && vorgangHat(3);
const vorgangAusfertigung = () => vorgangDreiZeilen() && vorgangHat(4);

const MAL = ['', 'einmal', 'zweimal', 'dreimal', 'viermal', 'fünfmal'];
const malWort = n => MAL[n] || (n + '-mal');

const keysDown = {w:false, a:false, s:false, d:false};
const PLAYER_SC = 1.8;                                   // Skalierung des CF-Helden (hero_baked), G3s psc-Grundwert (1,2) ist PLAYER_SC/1,5
// Dorffiguren: eine Skalierung für alle elf, egal ob Held-Komposit (Bramsche, Lott,
// Pahl) oder CF_NPCS-Blatt. Vorher bekamen nur die drei Komposite PLAYER_SC*0.92, die
// acht Blatt-Figuren standen auf 1 und waren damit halb so groß wie der Held, an dem
// sie vorbeiliefen. 0.92 bleibt: Staffage eine Spur kleiner als der Spieler.
const NPC_SC = PLAYER_SC * 0.92;
// Wanderleine der Dorf-Staffage in Pixeln, rund 1,25 Kacheln. Stand bis G6 in
// update() und wird jetzt auch von dorfSichtAssert() gelesen, der nachrechnet,
// ob eine Figur auf ihrem Rundgang hinter einer Fassade verschwindet.
const NPC_HOME_R = 40, NPC_HOME_R2 = NPC_HOME_R * NPC_HOME_R;
const player = {
  x:SPAWN.x, y:SPAWN.y, r:10, hp:70, mana:40, maxMana:40, level:1, xp:0, gold:0, potions:2,
  dir:0, faceLeft:false, mvx:0, mvy:0, attackCd:0, swingT:0, swingDir:0, attackMode:'sword', hurtT:0, dead:false,
  anim:'idle', animT:0, castT:0, hair:HAIRS[Math.floor(Math.random()*HAIRS.length)],
  // P1: Der Ton wird wie das Haar je Schicht neu gewuerfelt (startShift). Der
  // Wert hier traegt nur den Bruchteil einer Sekunde zwischen Skriptstart und
  // erstem Schichtantritt, amt ist an dieser Stelle noch nicht deklariert und
  // die Dienstgestalt-Wahl damit noch nicht lesbar.
  haarTon:HAARTOENE[Math.floor(Math.random()*HAARTOENE.length)],
  skills:{str:0, vit:0, agi:0, int:0}, skillPoints:0,
  spellPoints:0, spellsKnown:{}, spellCd:0,
  equip:{weapon:null, armor:null, shield:null, boots:null},
  bag:new Array(24).fill(null),
  pouch:[],                      // Zutaten stapeln sich hier: [{noun, adj, count}]
  // Fluch-Zustand (Phase 3): stillT = Zappel-Timer, hektikT = Trank-Tempobonus,
  // kampfT = Sperrfenster für Nüchternheitsgebot, platzCd = Zerplatzer-Bremse,
  // schlagN = Zähler für Fehlschlag.
  stillT:0, hektikT:0, kampfT:0, platzCd:0, schlagN:0,
  // Monsterkatalog M1: was Gegner am Spieler anrichten können, ohne Leben zu
  // nehmen. langsamT bremst, haltT hält fest (Klammergriff), trankSperreT
  // sperrt das Fläschchen (Faulgas, Siegelstaub), sichtT trübt kurz die Sicht.
  langsamT:0, haltT:0, trankSperreT:0, sichtT:0,
  // Z5: Sperrzeit der Manaregeneration nach einem Zauber (s. update).
  zauberRuhT:0,
  // K1: Die Zulagen. zulagenKartei traegt ALLE bewilligten Karten der Schicht,
  // die eingelegten tragen angelegt:true — die Dienstmappe ist also eine Sicht
  // auf dieses eine Feld, kein zweites Array (ein Feld zu spiegeln reicht den
  // Guards). zulagenZiehungen sind offene Vorlagen, zulagenAngebot die drei,
  // die gerade offen liegen, oder null. Alles je Schicht: persoenliche
  // Qualifikation ist nicht uebertragbar (Weltbibel Kapitel 5), startShift()
  // setzt zurueck, nichts davon geht nach localStorage.
  zulagenKartei:[], zulagenZiehungen:0, zulagenAngebot:null,
};
player.equip.weapon = {base:BASES[1], rar:1, affixes:[{k:'dmg',v:2,def:AFFIXES[0]}], name:'Magisches Kurzschwert'};

// Phase 4: "Amt für Monsterangelegenheiten" — überlebt jede Schicht in localStorage.
// Muss vor dem ersten recalc() weiter unten existieren, deshalb schon hier deklariert;
// die persistierten Werte lädt loadAmt() erst beim CONFIG-Block nach.
let amt = {bankGold:0, schichten:0,
  ausbauten:{startLevel:0, kontingent:0, tueren:0, vermutungen:false, startFluchUnlocked:false, startFluch:null},
  bonusManaRegen:0, bonusSpeed:0, bonusPotions:0, bonusStartGold:0, bonusNachwachsen:0,
  // W4: brett = die drei gewürfelten Aushänge der laufenden Schicht {schicht, liste:[a,a,a]}.
  // auftrag = der angenommene Aushang, ohne Fortschritt (der läuft in shiftT-Laufzeitfeldern
  // unten, nicht hier — sonst wäre jeder Kill ein localStorage-Schreibvorgang).
  // GW26b: auftraegeErfuellt ersatzlos gestrichen. Wurde geschrieben, gespeichert
  // und geladen, aber von W5, W6 und W7 nie gelesen. Ein Feld, das nur sich selbst
  // zählt, ist kein Erzählsignal, sondern ein Migrationsrisiko.
  brett:null, auftrag:null,
  // W10: wiederZahl = Zahl der bereits bewilligten Anträge auf Wiedereinsetzung,
  // treibt allein den Wiederholungszuschlag der Gebühr. wiedereinsetzung = der
  // bewilligte, noch nicht eingelöste Antrag {stand, haar} oder null; startShift()
  // löst ihn ein und leert ihn im selben Zug. Beides ist echter Zustand und
  // nicht ableitbar, anders als Rang und Aktstand.
  wiederZahl:0, wiedereinsetzung:null,
  // SZ3: Wann der Stopfen gezogen wurde und wann die vierte Adresszeile kam,
  // beide als Schichtnummer und beide 1-basiert, damit 0 "nie" heisst und kein
  // zweites Feld dafuer noetig ist. Aus ihnen leitet vorblattFaellig() ab, wann
  // der Wagen auf dem Dorfplatz steht — der Preis des Stopfens ist der Abstand
  // zwischen diesen beiden Zahlen. Echter Zustand, nicht ableitbar: welche
  // Schicht es war, weiss danach niemand mehr.
  stopfenSchicht:0, adressSchicht:0,
  // SP2: Was am Gürtel die Nacht übersteht, {gold, zutaten:[{noun,adj,count}]}
  // oder null. War bis hierher ein Paar Laufzeitvariablen (pendingCarryGold,
  // pendingCarryPouch), die startGame() bei jedem Seitenaufruf genullt hat — wer
  // im Dorf zwischen Dienstbericht und Antritt den Browser schloss, verlor
  // beides, obwohl der Bericht "mitgenommen" druckte. W10 hat für den Antrag im
  // selben Panel längst das Gegenteil begründet: ein Aktenvorgang überlebt die
  // Nacht, und abgerechnetes Gold ist einer. endShift() schreibt, startShift()
  // löst ein und leert im selben Zug, Bauform wie wiedereinsetzung.
  uebertrag:null,
  // P1: Die eine Angabe, die der Einstellungsvordruck vom Spieler entgegennimmt
  // (Blatt 1, Feld "Anrede der Person"). 'm', 'w' oder 'egal'. Sie entscheidet,
  // aus welchen Frisuren der Schichtantritt die Gestalt des Tages zieht, und
  // sonst nichts: kein Wert, kein Bonus, keine andere Zeile im Spiel hängt daran.
  // 'egal' ist der Auslieferungszustand, nicht die dritte Option von zweien.
  gestalt:GESTALT_STD};
// W3: Aktstand aus der bestehenden Schichtzahl abgeleitet, nichts Neues
// gespeichert. Deckt sich mit Kapitel 9: Akt I = Schicht 1-10 (amt.schichten
// 0-9), ... Akt V ab Schicht 41 (amt.schichten >= 40), gedeckelt bei 5.
// W5: hierher vorgezogen (Original stand bei aktStand-Zeigerkommentar weiter
// unten), weil setzeKammerTueren() bei Zeile ~5116 auf Skriptebene läuft und
// die Adresskammer-Markierung aktStand() lesen muss. TDZ-Falle, siehe Übergabe.
const aktStand = () => Math.min(5, Math.floor(amt.schichten / 10) + 1);
// W11: Steht diese Dorffigur schon im Dorf? Ohne abAkt immer. Die Klammer um
// CONFIG.schichtModus ist dieselbe wie in serieFrei() weiter unten: im freien
// Spiel gibt es keine Akte, und was an einen Akt geknüpft ist, ist dort offen.
// SZ3: dazu die zweite Bedingung. Vorblatt steht nicht deshalb im Dorf, weil ein
// Akt angebrochen ist, sondern weil er angekommen IST — Szene 6 ist seine
// Ankunft. Ein Gegenspieler, der schon dasteht, wenn seine Ankunft erzaehlt
// wird, waere derselbe Fehler wie eine Leiter ohne zweite Ebene.
const figDa = fig => !fig || !CONFIG.schichtModus
  || ((!fig.abAkt || aktStand() >= fig.abAkt) && (!fig.daWenn || fig.daWenn()));
// Laufzeitzustand der aktuellen Schicht (nur relevant bei CONFIG.schichtModus).
let shiftT=0, shiftEndPending=false, overtimeT=0,
    // SP2: pendingCarryGold/pendingCarryPouch sind hier ersatzlos entfallen. Der
    // Übertrag ist kein Laufzeitzustand der Schicht, sondern das Ergebnis der
    // vorigen, und steht seither als amt.uebertrag in der Akte.
    shiftKillsByType={}, shiftKillsTotal=0,
    // W4: Fortschritt des laufenden Aushangs. Bedeutung typabhängig, siehe AUFTRAG_TYPEN[].stand.
    // Reset in startShift(), neben shiftKillsByType. auftragSoll/auftragOrtSoll sind die
    // Weltgarantie-Kontingente für placeMonsters(), ebenfalls dort gesetzt.
    auftragStand=0, auftragVerletzt=false, auftragFertig=false, auftragSoll=0, auftragOrtSoll=0;

const stats = {kills:0};
let derived = {};
let goldRotT = 0;   // Sekundentakt für Fluch 'Goldschwund'

// Aggregierte Wirkungen der getragenen Kessel-Ausrüstung. Schlüssel = fx-Feld der
// Wirkung, Wert = Summe der Stufen. Wird nur in recalc() neu gerechnet, nie pro
// Frame; die Hooks unten lesen bloß Zahlen aus diesem festen Objekt.
const FX = {slow:0, crit:0, dmg:0, armor:0, speed:0, mana:0, regen:0, exact:0,
            gold:0, xp:0, knock:0, potion:0, arc:0, beute:0,
            leech:0, zauber:0, sparsam:0, tempo:0, leben:0, magnet:0, schreck:0, bollwerk:0, nachschlag:0, karte:0,
            // K1: die sechs Schluessel ohne WIRKUNG-Gegenstueck. Sie werden nur
            // von Zulagen gefuellt und nur an zwei Stellen gelesen: die drei
            // Gattungen in recalc(), die drei Zweige in castSpell().
            dolch:0, schwert:0, axt:0, feuer:0, frost:0, arkan:0};

// Aggregierte Flüche der getragenen Ausrüstung, 0 oder 1 (mehrfach gleicher Fluch
// wirkt nicht stärker). Fluchbudget in recalc(): höchstens zwei harte Flüche
// gleichzeitig, weitere ruhen (item.fluchRuht). Das verhindert die Kombination
// aus stumpf+nuechtern+blutmagie+manatot, die sonst keine Nachfüllquelle mehr hätte.
const CFX = {fehl:0, einzel:0, stumpf:0, kurzarm:0, gruss:0, zappel:0, stand:0, schleuder:0,
             blut:0, manatot:0, goldz:0, zunge:0, goldweg:0, zutweg:0, schweigen:0, steuer:0,
             duenn:0, hektik:0, nuecht:0, blind:0, stille:0, laut:0, bolz:0, platz:0};

// ===========================================================================
//  S1: DIE BEFAEHIGUNG — die Zahlen, aus denen der Koerper besteht
//
//  Bauabschnitt S1 (phase-s1-befaehigung.md) hat nichts erschwert, sondern
//  umgeschichtet. Vorher kam der groesste Teil der Spielerstaerke aus der
//  Stufe selbst und war damit geschenkt; die vier Befaehigungen waren eine
//  Beigabe, die man uebersehen konnte, ohne dass es auffiel. Jetzt kommt sie
//  aus den Punkten, und die Stufe ist im Wesentlichen die Erlaubnis, welche
//  zu vergeben.
//
//  Die Eichung: der Referenzspieler des Monsterkatalogs steigert je Stufe
//  einen Punkt Kraft und einen Punkt Zaehigkeit. Er soll nach der Umschichtung
//  ungefaehr dastehen wie vorher, damit die Baender aus M1 halten (monsterAssert
//  rechnet sie bei jedem Laden nach). Wer nicht steigert, faellt heraus.
//  befaehigungAssert() weiter unten belegt beide Haelften mit Zahlen.
//
//  Diese Konstanten stehen VOR recalc(), weil recalc() noch auf Skriptebene
//  laeuft (s. die Zeile unter der Funktion). Das ist die TDZ-Falle aus der
//  README, und sie hat in diesem Projekt schon zugeschlagen.
// ===========================================================================
const HP_BASIS       = 63;   // Leben auf Stufe 1 ohne jeden Punkt (vorher 70)
const HP_JE_STUFE    = 2;    // Leben je Aufstieg, geschenkt (vorher 12)
const ZAEH_HP        = 27;   // Leben je Punkt Zaehigkeit (vorher 20)
const MANA_BASIS     = 26;   // Mana auf Stufe 1 ohne jeden Punkt (vorher 40)
const MANA_JE_STUFE  = 2;    // Mana je Aufstieg, geschenkt (vorher 8)
const KUNDE_MANA     = 22;   // Mana je Punkt Amtskunde (vorher 15)
const KRAFT_DMG      = [3, 5];  // Schaden je Punkt Kraft, min und max (vorher 3 und 4)
const TEMPO_BASIS    = 126;  // Grundtempo (vorher 135 — schneller als jedes Monster im Spiel)
const BEHAEND_TEMPO  = 8;    // Tempo je Punkt Behaendigkeit (vorher 5)
const PUNKTE_JE_STUFE = 2;   // Befaehigungspunkte je Aufstieg, unveraendert

function recalc(){
  const e=player.equip, w=e.weapon;
  player.attackMode = w ? w.base.mode : 'sword';
  let dmgBonus = 0, armorBonus = 0, hpBonus = 0, spdBonus = 0;
  for(const k in FX) FX[k] = 0;
  for(const k in CFX) CFX[k] = 0;
  let hartN = 0;
  for(const k in e){
    const item = e[k];
    if(item){
      if(item.base.armor) armorBonus += item.base.armor;
      if(item.base.spd) spdBonus += item.base.spd;
      for(const aff of item.affixes){
        if(aff.k === 'dmg') dmgBonus += aff.v;
        if(aff.k === 'armor') armorBonus += aff.v;
        if(aff.k === 'hp') hpBonus += aff.v;
      }
      // Kessel-Ausrüstung trägt genau eine Wirkung, deren Stufe sich aufsummiert
      if(item.effect){ const wk = WIRKUNG[item.effect.k]; if(wk) FX[wk.fx] += item.effect.stufe; }
      // Fluchbudget: höchstens zwei harte Flüche gleichzeitig wirksam, der Rest
      // ruht (item.fluchRuht). Gleicher Fluch zählt einmal, nie additiv.
      item.fluchRuht = false;
      if(item.fluch){
        const fd = FLUCH[item.fluch];
        if(fd){
          // Derselbe Fluch auf zwei Slots darf das Budget nicht doppelt belasten.
          const schonAktiv = CFX[fd.cfx] === 1;
          if(fd.hart && !schonAktiv && hartN >= 2) item.fluchRuht = true;
          else { if(fd.hart && !schonAktiv) hartN++; CFX[fd.cfx] = 1; }
        }
      }
    }
  }
  // K1: Die eingelegten Zulagen zahlen in dieselben Aggregate ein wie die
  // Kessel-Wirkungen darueber. Eine dritte Quelle neben Ausruestung und Fluch,
  // mit demselben Rechenweg: Stufe rein, Zaehlerpunkte drauf. Was in der Kartei
  // liegt und nicht in der Mappe, wirkt nicht.
  for(const zk of player.zulagenKartei){
    if(!zk.angelegt) continue;
    const zf = ZULAGE[zk.familie];
    if(zf) FX[zf.fx] += zf.wert[zk.stufe - 1];
  }
  // S1: Die Stufe schenkt fast nichts mehr, der Punkt traegt alles. Herleitung
  // und Messung in phase-s1-befaehigung.md, die Kurzfassung: der Referenzspieler
  // des Katalogs steigert je Stufe einen Punkt Kraft und einen Punkt Zaehigkeit
  // (s. monsterAssert), und GENAU der bleibt, wo er war. Wer nicht steigert,
  // faellt jetzt heraus, statt wie bisher fast mitzukommen.
  //   Leben  vorher 70 + 12 je Stufe + 20 je Punkt  ->  63 + 2 je Stufe + 27 je Punkt
  //   Mana   vorher 40 +  8 je Stufe + 15 je Punkt  ->  26 + 2 je Stufe + 22 je Punkt
  //   Schaden vorher +3/+4 je Punkt Kraft           ->  +3/+5, dafuer schwaechere Klingen
  // Der Punkt ist in beiden Faellen das Zehn- bis Vierzehnfache der Stufe. Eine
  // Stufe ohne Steigerung ist damit fast nur noch die Erlaubnis, zu steigern.
  // K1: Zuschlag der Gattungszulagen. player.attackMode steht oben in dieser
  // Funktion und kam bis K1 nur in der Zeichnung vor; hier bekommt die Wahl
  // zwischen Dolch, Schwert und Doppelaxt zum ersten Mal eine Zahl. Etwas mehr
  // je Punkt als das gattungsfreie FX.dmg, weil eine Gattungskarte mit der
  // naechsten Waffe wertlos werden kann.
  const gattung = {dagger:FX.dolch, sword:FX.schwert, doubleaxe:FX.axt}[player.attackMode] || 0;
  let dmgMin = (w? w.base.dmg[0] : 1) + player.skills.str*KRAFT_DMG[0] + dmgBonus + FX.dmg*4 + gattung*5;
  let dmgMax = (w? w.base.dmg[1] : 2) + player.skills.str*KRAFT_DMG[1] + dmgBonus + FX.dmg*6 + gattung*7;
  let aps = (w? w.base.aps : 1.3) * (1 + player.skills.agi*0.05) * (1 + FX.tempo*0.10);   // Wirkung 'Schlagzahl'
  let hpB = player.skills.vit*ZAEH_HP + hpBonus;
  const maxHp = HP_BASIS + (player.level-1)*HP_JE_STUFE + hpB + FX.leben*18;   // Wirkung 'Leibesfülle'
  derived = {dmgMin, dmgMax, aps, armor:armorBonus + FX.armor*5, maxHp,
             maxMana: MANA_BASIS + (player.level-1)*MANA_JE_STUFE + player.skills.int*KUNDE_MANA,
             speed:TEMPO_BASIS + player.skills.agi*BEHAEND_TEMPO + spdBonus + FX.speed*10 + (amt.bonusSpeed||0),
             range:70 + FX.arc*14, arc:1.6 + FX.arc*0.16,
             crit:Math.min(0.75, 0.25 + FX.crit*0.07)};
  // S1: Kraftbedarf. Eine Klinge, fuer die die Kraft nicht reicht, laesst sich
  // gar nicht erst anlegen (equipItemFromBag). Diese Klemme hier ist die zweite
  // Haelfte derselben Sperre: ein Spielstand, ein Guard-Testpfad oder ein
  // Fluch koennte eine zu schwere Waffe in der Hand halten, und dann soll sie
  // sich anfuehlen wie das, was sie ist.
  if(w && (w.base.kraft||0) > player.skills.str){
    derived.dmgMin = Math.round(derived.dmgMin * 0.45);
    derived.dmgMax = Math.round(derived.dmgMax * 0.45);
    derived.aps    = derived.aps * 0.6;
    derived.zuSchwer = true;
  }
  if(CFX.stumpf) derived.crit = 0;                                          // Fluch 'Stumpfheit'
  if(CFX.kurzarm) derived.range = Math.max(44, derived.range * 0.62);       // Fluch 'Kurzarm'
  // Untergrenzen: keine Fluchkombination darf Nahkampf oder Bewegung auf 0 drücken.
  derived.dmgMin = Math.max(1, derived.dmgMin);
  derived.dmgMax = Math.max(derived.dmgMin, derived.dmgMax);
  derived.range  = Math.max(44, derived.range);
  derived.speed  = Math.max(60, derived.speed);
  player.hp = Math.min(player.hp, maxHp);
  player.maxMana = derived.maxMana;
  bakeHeroSheet();
}
recalc(); player.hp = derived.maxHp;

const monsters=[], drops=[], floaters=[], projectiles=[], magicEffects=[], particles=[], enemyBolts=[];
let boss=null, state='menu', gameT=0, invOpen=false;
const cam={x:0,y:0}, mouse={x:0,y:0, wx:0, wy:0, moved:false};
// Kamera ohne Nachlauf auf den Spieler setzen. Der normale Lauf lerpt mit 0.1 pro
// Frame (s. update()) — das war auf der alten 80er-Karte ein kaum sichtbarer
// Ruck über ~1300px, seit W-Groß aber ein mehrsekündiger Schwenk quer über 5000px,
// jedes Mal wenn der Spieler gesetzt (statt gelaufen) wird: Spielstart, Schicht-
// beginn, Wiedereinstieg nach dem Tod, Sprung ins Schattenland. betreteKammer()
// machte genau das schon immer von Hand (:4703), jetzt brauchen es alle.
//
// "Alle" heißt ausdrücklich auch die beiden WEGE ZURÜCK, und dort ist der
// Schwenk nicht nur lästig: verlasseKammer() und verlasseHaus() setzen den
// Spieler von einem Innenraum an eine Tür, die irgendwo auf der Karte steht.
// Was die Kamera dabei überstreicht, bäckt der Chunk-Cache Block für Block als
// eigenes 256er-Canvas (getChunk()), und zwar für nichts: gezeigt wird davon
// kein einziger Frame lang etwas, das jemand ansehen will. Auf dem Schirm ist
// das verschenkte Arbeit, auf Android-Chrome ist es der Fehler — dort ist der
// Canvas-Speicher der Seite gedeckelt, eine misslungene Allokation liefert ein
// LEERES Canvas statt eines Fehlers, und dieses leere Canvas landet im Cache.
// Wer so aus einer Kammer kommt, steht danach in einer schwarzen Welt und
// bekommt sie erst beim nächsten refreshFloor() zurück. Gemessen in
// tools/kammerausgang-messlauf.mjs.
function camSnap(){ cam.x = player.x - canvas.width/2; cam.y = player.y - canvas.height/2; }

// Zielpunkt für Tastatur/Klick: solange die Maus nie bewegt wurde (reines WASD-Spiel),
// zielt das Spiel automatisch auf den nächsten Gegner statt in die Bildschirmecke.
// Weltkoordinaten werden hier frisch aus der Kamera gerechnet — sonst zeigt das Ziel
// beim Laufen dorthin, wo der Cursor vor der Kamerafahrt war.
function aimPoint(){
  if(mouse.moved){ mouse.wx = mouse.x + cam.x; mouse.wy = mouse.y + cam.y; return mouse; }
  const t = pickTarget('closest', 420);
  if(t) return {wx:t.x, wy:t.y};
  return {wx: player.x + Math.cos(player.dir)*100, wy: player.y + Math.sin(player.dir)*100};
}
const aimAngle = ()=>{ const a = aimPoint(); return Math.atan2(a.wy - player.y, a.wx - player.x); };

// --- TOUCH STATE (mobil) ---
let touchMode = false;
const touchMove = {x:0, y:0, active:false};              // analoger Stick-Vektor, |v| <= 1
const joy = {id:null, baseX:0, baseY:0, curX:0, curY:0, R:60, DEAD:8};
// U7: Wo der Ring liegt, solange niemand ihn anfasst. Unten links, ein Ring-
// radius plus Rand von der Ecke weg — das ist die Stelle, an der der linke
// Daumen von selbst zu liegen kommt.
//
// Die beiden Zahlen sind keine Geschmacksfrage, an ihnen haengt die Knopfspalte:
// die Oberkante des Rings liegt damit immer 188 Pixel ueber der Unterkante des
// Bildes (R+68 Sockel plus R Radius), und genau darauf rechnet die max-height
// von #beltRow im <style>. Wer hier etwas aendert, aendert dort mit.
// 16 statt 26 am linken Rand: bei 26 stiess der Ring auf einem 360 Pixel breiten
// Telefon an den Kontextknopf.
const joyRuhe = () => ({ x: 16 + joy.R, y: canvas.height - (joy.R + 68) });
let attackTouch = null;                                   // {id, sx, sy} Screen-Koordinaten

// --- Touch-Kampf (Wild-Rift-Stil) ---
let targetPriority = 'closest';                    // 'closest' | 'lowhp'
try{ const v = localStorage.getItem('sda_targetPriority');
     if(v === 'lowhp' || v === 'closest') targetPriority = v; }catch(_){}
let lockedTarget = null;                           // Monster-Referenz oder null
let atkBtnHeld = false;                            // Attack-Button gehalten (Dauerfeuer)
const spellAim = {active:false, sp:null, nx:1, ny:0, d:0, cancel:false}; // Richtung+Distanz, Weltziel wird live berechnet
const lockAim  = {active:false, wx:0, wy:0};       // Fadenkreuz beim Lock-Drag (absolute Weltposition)

function pickTarget(prio, maxRange, fx = player.x, fy = player.y){
  let best = null, bestV = Infinity;
  for(const m of monsters){
    if(m.dead) continue;
    const d = dist(fx, fy, m.x, m.y);
    if(d > maxRange) continue;
    const v = (prio === 'lowhp') ? m.hp : d;       // absolute HP vs. Distanz
    if(v < bestV){ bestV = v; best = m; }
  }
  return best;
}
function validateLock(){
  if(lockedTarget && (lockedTarget.dead || dist(player.x, player.y, lockedTarget.x, lockedTarget.y) > 350))
    lockedTarget = null;
  return lockedTarget;
}
function spellReach(sp){                           // Aim-/Preview-Reichweite pro Typ
  if(!sp) return 0;
  if(sp.type === 'bolt')       return sp.speed * 0.9;   // Lifetime 2s -> ~speed*0.9 als ehrliche Ziellinie
  if(sp.type === 'aoe_target') return 320;              // Touch-Cap (Desktop-Maus bleibt unbegrenzt)
  if(sp.type === 'chain')      return sp.range;         // 270, auto-target
  return sp.radius || 0;                                // nova / slow_field
}
function spellAimWorld(){                          // Weltziel folgt dem Spieler (Joystick + Aim gleichzeitig)
  return {x: player.x + spellAim.nx * spellAim.d, y: player.y + spellAim.ny * spellAim.d};
}
function enterTouchMode(){ touchMode = true; document.body.classList.add('touch'); }

// Optik-Felder: rig (CF_RIGS-Key), tint/tintA (eingefärbte Sheet-Kopie),
// sc (Skalierung), scx (extra Breite), alpha, fly (Schwebe-Bob statt Lauf-Bob).
// G3 (Schritt 3): psc skaliert zusätzlich zu sc, gleicht die CF-Rig-Pixelgröße
// an den Helden an (psc=1.2 entspricht PLAYER_SC bei sc:1.5, s. drawMon/drawCorpse).
// Fehlt psc, gilt 1. deathFps ersetzt die feste 11
// in killMon/drawCorpse, damit kurze CF-Death-Zeilen (4 statt 9 Frames) nicht
// doppelt so schnell durchlaufen und dann einfrieren; fehlt deathFps, gilt 11.
const MONDEF = {
  // --- Wald / Ablage A ---
  slime: {name:'Chuchu', art:'Der Formfehler', rig:'slime_small_green', sc:1.15, psc:1.2, deathFps:5, r:11,
    kat:{klasse:'A1', stufe:1, biom:'Wald', route:'physisch', typen:'B1'},
    hp:20, dmg:[2,4], xp:10, speed:38, aggro:130, atkCd:1.2, atkRange:26, gold:[4,8],
    res:{physisch:0, feuer:-0.25, eis:0, gift:0.2, magie:0},
    muster:[{name:'Anlehnen', warn:300, art:'nah'},
             {name:'Formfehler abgeben', warn:350, art:'kegel', jede:4, reich:44}]},
  goblin: {name:'Grünhaut', art:'Die Beschwerde', rig:'goblin_maceman', sc:1.5, psc:1.2, deathFps:5, r:11,
    kat:{klasse:'A1', stufe:2, biom:'Wald', route:'physisch', typen:'B7'},
    hp:42, dmg:[3,5], xp:20, speed:78, aggro:95, atkCd:0.9, atkRange:26, gold:[7,15],
    res:{physisch:0, feuer:-0.2, eis:0.1, gift:0, magie:0.1},
    hinterhalt:true,
    muster:[{name:'Lautstark vortragen', warn:280, art:'nah'},
             {name:'Aus dem hohen Gras', warn:420, art:'nah', wucht:2.0, eroeffnung:true, reich:34}]},
  ablagestapel: {name:'Wandelnder Ablagestapel', art:'Der Posteingang', rig:'knights_spearman', tint:'#c9b98a', tintA:0.66, sc:1.9, psc:1.2, deathFps:5, r:14,
    kat:{klasse:'A2', stufe:2, biom:'Wald', route:'physisch', typen:'B2'},
    hp:105, dmg:[7,11], xp:107, speed:32, aggro:140, atkCd:1.6, atkRange:30, gold:[16,34],
    res:{physisch:0.35, feuer:-0.4, eis:0.1, gift:0.3, magie:0},
    muster:[{name:'Umkippen', warn:420, art:'nah', ruhe:0.6},
             {name:'Loseblattlawine', warn:600, art:'kegel', jede:3, reich:90, ruhe:0.6}]},
  greenmage: {name:'Waldschamane', art:'Der Widerspruch', rig:'cowling_mage_2', tint:'#2f8f4a', tintA:0.5, sc:1.5, psc:1.2, deathFps:5, r:11,
    kat:{klasse:'A3', stufe:3, biom:'Wald', route:'physisch', typen:'B3'},
    hp:345, dmg:[25,35], xp:251, speed:44, aggro:170, atkCd:1.9, atkRange:130, gold:[34,71],
    res:{physisch:-0.2, feuer:0, eis:0, gift:0.2, magie:0.4},
    ranged:true, bolt:{dmg:[25,35], speed:190, color:'#6aff8f', r:7},
    muster:[{name:'Widerspruchsbolzen', warn:420, art:'fern'},
             {name:'Anlage zum Schreiben', warn:520, art:'fern', jede:3, wucht:1.35}]},
  zustellbote: {name:'Der Zustellbote', art:'Der Zustellversuch', rig:'goblin_thief', tint:'#8fa8c9', tintA:0.6, sc:1.45, psc:1.2, deathFps:5, r:11,
    kat:{klasse:'A4', stufe:3, biom:'Wald', route:'physisch', typen:'B4'},
    hp:270, dmg:[30,42], xp:682, speed:126, aggro:170, atkCd:1.1, atkRange:26, gold:[54,113],
    res:{physisch:0.55, feuer:0.2, eis:-0.3, gift:0, magie:0.2},
    kiter:{zurueck:0.28, tempo:1.15}, fenster:{alle:6, dauer:1.4, art:'offen'},
    muster:[{name:'Zustellversuch', warn:380, art:'nah'}]},

  // --- Sumpf / Die Nassablage ---
  blubberakte: {name:'Blubberakte', art:'Der Rücklauf', rig:'slime_small_blue', tint:'#4e7a3a', tintA:0.6, sc:1.25, psc:1.2, deathFps:5, r:11,
    kat:{klasse:'A1', stufe:3, biom:'Sumpf', route:'physisch', typen:'B1+B7'},
    hp:53, dmg:[5,7], xp:23, speed:46, aggro:90, atkCd:1.3, atkRange:24, gold:[11,23],
    res:{physisch:0, feuer:-0.3, eis:0.1, gift:0.8, magie:0},
    hinterhalt:true,
    muster:[{name:'Schmatzen', warn:300, art:'nah', slow:1.2},
             {name:'Auftauchen', warn:400, art:'nah', wucht:1.6, eroeffnung:true, reich:28}]},
  moorbescheid: {name:'Der Moorbescheid', art:'Der durchweichte Bescheid', rig:'cowling_1', tint:'#5a6b4a', tintA:0.62, sc:1.5, psc:1.2, deathFps:5, r:12,
    kat:{klasse:'A2', stufe:4, biom:'Sumpf', route:'feuer', typen:'B5'},
    // S1: Die drei Gegner mit Zauber-Sollroute rechnen ueber KAT_ZAUBER_DPS, und
    // die ist mit den neuen Zauberpreisen von 23,04 auf 12,0 gefallen. Ihre
    // Lebenspunkte fallen im selben Verhaeltnis, sonst waere ihre eigene Route
    // aus dem Band. Damit die Weichstelle eine Weichstelle bleibt, steigt zugleich
    // die Papierdicke gegen die Waffe: der Abstand zwischen Sollroute und
    // Waffenroute ist danach derselbe wie vorher (2,0-fach). Herleitung in
    // phase-s1-befaehigung.md, nachgerechnet vom Generator.
    hp:180, dmg:[16,24], xp:161, speed:26, aggro:140, atkCd:2.0, atkRange:30, gold:[31,65],
    res:{physisch:0.73, feuer:-0.5, eis:0.15, gift:0.9, magie:0.15},
    muster:[{name:'Durchweichen', warn:450, art:'nah'},
             {name:'Faulgasstoß', warn:550, art:'kegel', jede:3, reich:70, sperre:4}]},
  amtsschimmel: {name:'Der Amtsschimmel', art:'Die Fristverlängerung', rig:'angel_2', tint:'#d8e0c0', tintA:0.55, sc:1.5, psc:1.2, deathFps:5, r:11,
    kat:{klasse:'A3', stufe:5, biom:'Sumpf', route:'physisch', typen:'B4+B6'},
    hp:550, dmg:[63,91], xp:436, speed:118, aggro:180, atkCd:1.8, atkRange:28, gold:[54,113],
    res:{physisch:0.15, feuer:-0.3, eis:0.1, gift:0.5, magie:0.3},
    kiter:{zurueck:0.35, tempo:1.0}, zielRange:150,
    muster:[{name:'Ausweichschritt', warn:350, art:'nah'},
             {name:'Wiedervorlage', warn:500, art:'stuetz', jede:3, reich:150, wert:0.12, stand:1.2}]},
  fristlaeufer: {name:'Der Fristläufer', art:'Die Fristsetzung', rig:'flying_skull', tint:'#9ad6a0', tintA:0.6, alpha:0.72, fly:true, sc:1.5, psc:1.2, deathFps:7, r:11,
    kat:{klasse:'A4', stufe:5, biom:'Sumpf', route:'physisch', typen:'B3+B4'},
    hp:470, dmg:[144,208], xp:823, speed:132, aggro:190, atkCd:2.0, atkRange:170, gold:[85,178],
    res:{physisch:0.5, feuer:0.3, eis:-0.35, gift:0.4, magie:0.1},
    ranged:true, bolt:{dmg:[144,208], speed:210, color:'#9ad6a0', r:8},
    muster:[{name:'Fristablauf', warn:650, art:'fern'},
             {name:'Verwehen', warn:400, art:'zu', jede:3, dauer:1.2}]},

  // --- Frostkamm / Die Eisablage: vom Katalog M1 nicht angefasst -----------
  // Das Schneeband steht nicht im Monsterkatalog (der Auftrag nannte fünf
  // andere Biome). Es behält deshalb Werte und Verhalten von vorher und ist
  // zugleich die Vergleichsprobe: hier sieht man, wie sich das Spiel ohne die
  // Katalogwerte anfühlt.
  ghost:      {name:'Frostgeist', art:'Der ruhende Antrag', rig:'flying_skull', tint:'#8fd8ff', tintA:0.6, alpha:0.62, fly:true, sc:1.45, psc:1.2, deathFps:7, r:10, hp:20, dmg:[3,6],  xp:18, speed:52, aggro:150, atkCd:1.0, atkRange:24, gold:[6,14]},
  frostgolem: {name:'Frostgolem', art:'Die Sammelakte auf Eis', rig:'knights_swordman', tint:'#4ab5e8', tintA:0.62, sc:2.1, psc:1.2, deathFps:5, r:14, hp:60, dmg:[8,14], xp:34, speed:30, aggro:150, atkCd:1.4, atkRange:30, gold:[14,26]},
  frostmage:  {name:'Eismagier',  art:'Die Rückfrage', rig:'skeleton_mage', tint:'#5ac8ff', tintA:0.62, sc:1.5, psc:1.2, deathFps:5, r:11, hp:20, dmg:[5,9],  xp:28, speed:42, aggro:180, atkCd:1.8, atkRange:140, gold:[10,22],
              ranged:true, bolt:{dmg:[5,9], speed:220, color:'#7ad6ff', r:7}},

  // --- Wüste / Der Brandabschnitt ---
  skarabaeus: {name:'Papierstaub-Skarabäus', art:'Die Aktenvernichtung', rig:'blue_shroomling', tint:'#c9a227', tintA:0.7, sc:1.0, psc:1.2, deathFps:5, r:9,
    kat:{klasse:'A1', stufe:4, biom:'Wüste', route:'physisch', typen:'B5'},
    hp:41, dmg:[6,8], xp:29, speed:92, aggro:150, atkCd:1.0, atkRange:22, gold:[14,29],
    res:{physisch:0.5, feuer:0.85, eis:-0.4, gift:0.3, magie:0},
    muster:[{name:'Anrempeln', warn:300, art:'nah'},
             {name:'Staubwolke', warn:400, art:'kegel', jede:4, reich:40, sicht:1.0}]},
  crab: {name:'Klippkrabbe', art:'Die Aktenklammer', rig:'cowling_2', tint:'#ff5a2a', tintA:0.6, sc:1.4, scx:1.35, psc:1.2, deathFps:5, r:12,
    kat:{klasse:'A2', stufe:5, biom:'Wüste', route:'physisch', typen:'B2+B5'},
    hp:560, dmg:[16,24], xp:220, speed:36, aggro:140, atkCd:1.4, atkRange:28, gold:[37,78],
    res:{physisch:-0.2, feuer:1, eis:1, gift:0.2, magie:1},
    muster:[{name:'Klammern', warn:400, art:'nah', halt:0.5},
             {name:'Zangengriff', warn:550, art:'nah', jede:3, wucht:0.7, reich:32, halt:1.0}]},
  scorpion: {name:'Sandskorpion', art:'Die Nachforderung', rig:'goblin_thief', tint:'#e8c46a', tintA:0.6, sc:1.3, psc:1.2, deathFps:5, r:10,
    kat:{klasse:'A3', stufe:6, biom:'Wüste', route:'physisch', typen:'B3'},
    hp:650, dmg:[117,169], xp:469, speed:96, aggro:170, atkCd:2.4, atkRange:28, gold:[64,134],
    res:{physisch:0.1, feuer:0.3, eis:0.1, gift:0.7, magie:-0.2},
    folgeschlag:true,
    muster:[{name:'Nachforderung', warn:450, art:'nah'},
             {name:'Zweite Nachforderung', warn:350, art:'nah', wucht:0.5, folge:true}]},
  sandmage: {name:'Dünenpriester', art:'Die Verfügung', rig:'cowling_mage_1', tint:'#ff9f2a', tintA:0.55, sc:1.5, psc:1.2, deathFps:5, r:11,
    kat:{klasse:'A4', stufe:7, biom:'Wüste', route:'physisch', typen:'B4+B6'},
    hp:840, dmg:[191,275], xp:1246, speed:104, aggro:180, atkCd:2.0, atkRange:130, gold:[115,242],
    res:{physisch:0.45, feuer:0.5, eis:-0.3, gift:0.2, magie:0.2},
    ranged:true, bolt:{dmg:[191,275], speed:200, color:'#ffb04a', r:7}, kiter:{zurueck:0.3, tempo:1.0},
    muster:[{name:'Sandwurf', warn:400, art:'fern'},
             {name:'Verfügung', warn:900, art:'stuetz', jede:3, reich:160, dauer:6, stand:2.4}]},

  // --- Höhle / Die Untere Registratur, Kammerwachen ---
  bat: {name:'Fledermaus', art:'Der Umlauf', rig:'bat', tint:'#6b5a4a', tintA:0.65, sc:1.0, psc:1.2, deathFps:7, fly:true, r:9,
    kat:{klasse:'A1', stufe:6, biom:'Höhle', route:'physisch', typen:'B1'},
    hp:90, dmg:[7,11], xp:29, speed:134, aggro:200, atkCd:0.9, atkRange:20, gold:[20,42],
    res:{physisch:0, feuer:-0.2, eis:-0.1, gift:0.3, magie:0},
    reserved:true,
    muster:[{name:'Vorbeiflug', warn:250, art:'nah'},
             {name:'Umlaufmappe', warn:300, art:'nah', jede:4, sicht:1.5}]},
  spider: {name:'Höhlenspinne', art:'Der Querverweis', rig:'blue_shroomling', tint:'#2a0f3a', tintA:0.7, sc:1.35, psc:1.2, deathFps:5, r:11,
    kat:{klasse:'A2', stufe:7, biom:'Höhle', route:'physisch', typen:'B2+B7'},
    hp:465, dmg:[28,40], xp:292, speed:52, aggro:95, atkCd:1.7, atkRange:30, gold:[51,107],
    res:{physisch:0.3, feuer:-0.3, eis:0.2, gift:0.3, magie:0.15},
    hinterhalt:true, reserved:true,
    muster:[{name:'Nachfassen', warn:400, art:'nah', zieht:26},
             {name:'Fallenlassen', warn:550, art:'nah', wucht:2.0, eroeffnung:true, reich:34}]},
  sammelmahnung: {name:'Die Sammelmahnung', art:'Die Mahnstufe', rig:'knights_spearman', tint:'#c9b98a', tintA:0.6, sc:1.5, psc:1.2, deathFps:5, r:11,
    kat:{klasse:'A3', stufe:8, biom:'Höhle', route:'physisch', typen:'B1+B3'},
    hp:690, dmg:[111,159], xp:485, speed:74, aggro:180, atkCd:2.3, atkRange:30, gold:[83,174],
    res:{physisch:0.2, feuer:0, eis:0.1, gift:0.4, magie:-0.3},
    reserved:true,
    muster:[{name:'Mahnstufe', warn:500, art:'nah'},
             {name:'Gleichlaut', warn:600, art:'nah', jede:3, gleich:120}]},
  mage: {name:'Irrlichtmagier', art:'Die Fußnote', rig:'angel_1', tint:'#8fa8c9', tintA:0.6, sc:1.5, psc:1.2, deathFps:5, r:11,
    kat:{klasse:'A3', stufe:8, biom:'Höhle', route:'physisch', typen:'B3'},
    hp:870, dmg:[98,140], xp:426, speed:46, aggro:180, atkCd:2.2, atkRange:140, gold:[83,174],
    res:{physisch:-0.15, feuer:0.2, eis:0.2, gift:0.3, magie:0.5},
    ranged:true, bolt:{dmg:[98,140], speed:210, color:'#bcd8ff', r:7}, reserved:true,
    muster:[{name:'Fußnote', warn:500, art:'fern'},
             {name:'Verweis', warn:380, art:'fern', jede:3, wucht:0.6}]},
  golem: {name:'Steingolem', art:'Die Bestandskraft', rig:'knights_templar', tint:'#8a8a8a', tintA:0.7, sc:2.4, psc:1.2, deathFps:5, r:16,
    kat:{klasse:'A4', stufe:9, biom:'Höhle', route:'magie', typen:'B2+B5'},
    hp:570, dmg:[204,294], xp:1648, speed:28, aggro:150, atkCd:2.6, atkRange:36, gold:[144,302],
    res:{physisch:0.95, feuer:0, eis:0, gift:0.6, magie:-0.4},   // S1: s. Moorbescheid, Abstand bleibt 4,9-fach
    reserved:true,
    muster:[{name:'Faustschlag', warn:700, art:'nah'},
             {name:'Unanfechtbar', warn:900, art:'ring', jede:3, reich:130, ruhe:3.0}]},

  // --- Lager / Das Lager der Beschwerden, ein einzelner Ort im Grasband ---
  // Werte aus tools/monsterkatalog.py. Alle drei tragen lagerwache:true — sie
  // greifen nie von sich aus an (s. makeMon und die Aggro-Pruefung). Das ist
  // keine Bequemlichkeit, sondern der Inhalt des Ortes: die Gegenseite wartet
  // seit vierhundert Jahren auf eine Zustellung und hat keinen Grund, jemanden
  // anzufallen, der ihr endlich etwas bringen koennte.
  vorbehalt: {name:'Der Vorbehalt', art:'Der Vorbehalt', rig:'goblin_spearman', sc:1.7, psc:1.2, deathFps:5, r:11,
    kat:{klasse:'A2', stufe:5, biom:'Lager', route:'physisch', typen:'B2+B7'},
    hp:290, dmg:[17,25], xp:210, speed:52, aggro:150, atkCd:1.6, atkRange:38, gold:[37,78],
    res:{physisch:0.35, feuer:-0.2, eis:0.1, gift:0.1, magie:0.15},
    reserved:true, lagerwache:true,
    muster:[{name:'Auf Abstand halten', warn:420, art:'nah', reich:38},
             {name:'Vorbehalten', warn:560, art:'nah', jede:3, reich:44, wucht:1.4}]},
  zwischennachricht: {name:'Die Zwischennachricht', art:'Die Zwischennachricht', rig:'goblin_archer', sc:1.7, psc:1.2, deathFps:5, r:11,
    kat:{klasse:'A3', stufe:6, biom:'Lager', route:'physisch', typen:'B3+B4'},
    hp:700, dmg:[75,107], xp:395, speed:64, aggro:190, atkCd:2.0, atkRange:150, gold:[64,134],
    res:{physisch:-0.15, feuer:-0.1, eis:0.1, gift:0.2, magie:0.3},
    ranged:true, bolt:{dmg:[75,107], speed:230, color:'#d8c89a', r:5}, kiter:{zurueck:0.3, tempo:1.0},
    reserved:true, lagerwache:true,
    muster:[{name:'Zwischennachricht', warn:460, art:'fern'},
             {name:'Sachstand unverändert', warn:380, art:'fern', jede:3, wucht:0.6}]},
  empfangsbekenntnis: {name:'Das Empfangsbekenntnis', art:'Das Empfangsbekenntnis', rig:'orc_chief', sc:2.3, psc:1.2, deathFps:5, glow:'#c9b98a', r:16,
    kat:{klasse:'A4', stufe:7, biom:'Lager', route:'magie', typen:'B2+B5'},
    hp:375, dmg:[144,206], xp:1004, speed:34, aggro:170, atkCd:2.5, atkRange:40, gold:[115,242],
    res:{physisch:0.7, feuer:0.1, eis:0.1, gift:0.4, magie:-0.3},
    reserved:true, lagerwache:true,
    muster:[{name:'Zurückweisen', warn:700, art:'nah', reich:40},
             {name:'Nicht empfangsberechtigt', warn:900, art:'ring', jede:3, reich:120, ruhe:2.5}]},

  // --- Stollen / Die Sperrablage, nur hinter dem teuersten Gebuehrenbescheid ---
  // M3. Werte aus tools/monsterkatalog.py, nicht von Hand gesetzt: dort stehen
  // Zielkampfzeit und Zielgefahrenbudget, hp/dmg/xp/gold fallen daraus. Wer hier
  // eine Zahl aendert, aendert sie dort und erzeugt neu.
  teilbescheid: {name:'Der Teilbescheid', art:'Der Teilbescheid', rig:'slime_medium', sc:1.3, psc:1.2, deathFps:5, r:10,
    kat:{klasse:'A1', stufe:9, biom:'Stollen', route:'physisch', typen:'B1'},
    hp:145, dmg:[16,22], xp:44, speed:44, aggro:140, atkCd:1.3, atkRange:24, gold:[29,61],
    res:{physisch:0.1, feuer:-0.3, eis:0, gift:0.25, magie:0},
    reserved:true,
    muster:[{name:'Im Übrigen', warn:320, art:'nah'},
             {name:'Anlage beigefügt', warn:380, art:'kegel', jede:4, reich:38}]},
  dienstweg: {name:'Der Dienstweg', art:'Der Dienstweg', rig:'snail', tint:'#6a7f4a', tintA:0.35, sc:1.5, psc:1.2, deathFps:5, r:11,
    kat:{klasse:'A2', stufe:9, biom:'Stollen', route:'magie', typen:'B5+B2'},
    hp:180, dmg:[39,57], xp:291, speed:18, aggro:90, atkCd:2.4, atkRange:24, gold:[64,134],
    res:{physisch:0.6, feuer:0, eis:0.2, gift:0.35, magie:-0.35},
    reserved:true,
    muster:[{name:'Anhörung', warn:520, art:'nah'},
             {name:'Über den Dienstweg', warn:650, art:'nah', jede:3, wucht:1.6, ruhe:0.8}]},
  teilabhilfe: {name:'Die Teilabhilfe', art:'Die Teilabhilfe', rig:'slime_big', sc:1.6, psc:1.2, deathFps:5, r:15,
    kat:{klasse:'A3', stufe:10, biom:'Stollen', route:'physisch', typen:'B2+B7'},
    hp:710, dmg:[98,142], xp:636, speed:30, aggro:160, atkCd:1.8, atkRange:34, gold:[102,214],
    res:{physisch:0.4, feuer:-0.3, eis:0.15, gift:0.35, magie:0.1},
    hinterhalt:true, reserved:true,
    // Der ganze Witz der Vorgangsart steht in dieser einen Zeile: wer ihr abhilft,
    // hat danach zwei kleinere Vorgaenge statt keinem. killMon() liest sie.
    zerfaellt:{typ:'teilbescheid', n:2},
    muster:[{name:'Abhilfe', warn:560, art:'nah'},
             {name:'Im Übrigen zurückgewiesen', warn:700, art:'kegel', jede:3, reich:70, ruhe:0.8}]},

  // --- Ruine / Der Altbestand ---
  aktenbote: {name:'Der Aktenbote', art:'Der Zuschlag', rig:'cowling_1', tint:'#e0d0a0', tintA:0.6, sc:1.3, psc:1.2, deathFps:5, r:10,
    kat:{klasse:'A1', stufe:8, biom:'Ruine', route:'physisch', typen:'B1+B6'},
    hp:135, dmg:[25,35], xp:38, speed:88, aggro:170, atkCd:1.4, atkRange:24, gold:[26,55],
    res:{physisch:0, feuer:-0.2, eis:0, gift:0.2, magie:0.1},
    zielRange:120,
    muster:[{name:'Aktenkante', warn:300, art:'nah'},
             {name:'Zuschlag', warn:400, art:'stuetz', jede:3, reich:120, dauer:5}]},
  mummy: {name:'Mumie', art:'Die versiegelte Akte', rig:'cowling_2', tint:'#d8c9a0', tintA:0.55, sc:1.45, psc:1.2, deathFps:5, r:11,
    kat:{klasse:'A2', stufe:9, biom:'Ruine', route:'physisch', typen:'B2+B5'},
    hp:1190, dmg:[44,64], xp:366, speed:26, aggro:150, atkCd:2.1, atkRange:30, gold:[64,134],
    res:{physisch:-0.25, feuer:1, eis:1, gift:0.9, magie:1},
    muster:[{name:'Verschnüren', warn:500, art:'nah', slow:2.0},
             {name:'Siegelstaub', warn:600, art:'kegel', jede:3, reich:80, sperre:5}]},
  stalfos: {name:'Knochenritter', art:'Die Dienstvorschrift', rig:'knights_swordman', sc:1.6, psc:1.2, deathFps:5, r:11,
    kat:{klasse:'A3', stufe:9, biom:'Ruine', route:'physisch', typen:'B7+B3'},
    hp:920, dmg:[153,219], xp:674, speed:82, aggro:105, atkCd:2.5, atkRange:34, gold:[92,193],
    res:{physisch:0.25, feuer:0.1, eis:-0.25, gift:0.6, magie:0.1},
    hinterhalt:true, folge:{n:3, pause:1.6},
    muster:[{name:'Dienstweg', warn:450, art:'nah'},
             {name:'Aus der Nische', warn:600, art:'nah', wucht:1.8, eroeffnung:true, reich:40}]},
  sammelverfuegung: {name:'Die Sammelverfügung', art:'Der Sammelbescheid', rig:'knights_templar', tint:'#c9a227', tintA:0.55, sc:2.6, psc:1.2, deathFps:5, glow:'#f4d97a', r:18,
    kat:{klasse:'A4', stufe:10, biom:'Ruine', route:'feuer', typen:'B4+B5'},
    hp:580, dmg:[267,385], xp:1853, speed:112, aggro:200, atkCd:2.2, atkRange:30, gold:[159,334],
    res:{physisch:0.85, feuer:-0.35, eis:0.45, gift:0.6, magie:0.45},   // S1: s. Moorbescheid, Abstand bleibt 1,45-fach
    bolt:{dmg:[267,385], speed:230, color:'#f4d97a', r:9}, kiter:{zurueck:0.35, tempo:1.0}, zielRange:180,
    muster:[{name:'Zurückverweisen', warn:400, art:'nah', stoesst:40},
             {name:'Anhörung', warn:800, art:'fern', jede:3, wucht:1.2},
             {name:'Aktenmantel', warn:500, art:'mantel', jede:5, dauer:2.5}]},

  // --- Schattenland / Ablage V: vom Katalog M1 nicht angefasst -------------
  // Die Horde ist kein Biom im Sinne des Katalogs, sondern eine Massenszene mit
  // eigener Regel (130 gleichzeitig, 500 Kills). Katalogwerte würden sie
  // unspielbar machen.
  shadow:      {name:'Schattenling',  art:'Der gelöschte Eintrag', rig:'slime_small_blue', tint:'#3a0d5c', tintA:0.72, sc:1.2, psc:1.2, deathFps:5, r:10, hp:12, dmg:[1,3], xp:5,  speed:95, aggro:600, atkCd:1.5, atkRange:22, gold:[1,3]},
  demon:       {name:'Schattenhund',  art:'Die Mahnung', rig:'cowling_1', tint:'#8a0f2a', tintA:0.68, sc:1.5, psc:1.2, deathFps:5, r:12, hp:24, dmg:[3,6], xp:10, speed:110,aggro:600, atkCd:1.2, atkRange:26, gold:[2,6]},
  shadowghost: {name:'Schattenspukt', art:'Das Erinnerungsschreiben', rig:'flying_skull', tint:'#a855f7', tintA:0.62, alpha:0.6, fly:true, sc:1.45, psc:1.2, deathFps:7, r:11, hp:18, dmg:[2,5], xp:8,  speed:120,aggro:600, atkCd:1.3, atkRange:24, gold:[2,6]},
  shadowmage:  {name:'Schattenrufer', art:'Die Vorladung', rig:'angel_2', tint:'#c77dff', tintA:0.62, sc:1.5, psc:1.2, deathFps:5, r:11, hp:20, dmg:[5,9], xp:14, speed:70, aggro:600, atkCd:1.6, atkRange:130, gold:[3,8],
              ranged:true, bolt:{dmg:[5,9], speed:230, color:'#c77dff', r:7}},
  boss:        {name:'Schattenfürst', art:'Fürst Nachtrag', rig:'knights_templar', tint:'#6b1fa8', tintA:0.6, sc:4.5, psc:1.2, deathFps:5, glow:'#c77dff', r:22, hp:1500,dmg:[18,30],xp:500,speed:75, aggro:600, atkCd:1.0, atkRange:50, gold:[300,500], boss:true},

  // --- Reserve: fertig definiert, in keinem Roster -------------------------
  bossgeneric: {name:'Alter Schrecken', art:'Der Sammelvorgang', rig:'knights_swordman', tint:'#c9a227', tintA:0.55, sc:4.0, psc:1.2, deathFps:5, glow:'#f4d97a', reserved:true, boss:true, r:20, hp:1200, dmg:[16,26], xp:400, speed:70, aggro:600, atkCd:1.1, atkRange:48, gold:[250,450]},
};

// Animationssatz je Rig. G3: die Sunnyside-Rigs (goblin/skel) sind entfernt, alle
// 21 MONDEF-Typen tragen jetzt ein explizites CF_RIGS-rig-Feld. Die Tabelle wird
// aus CF_RIGS generiert (Key = Rigname, Wert = Sheet-Key je Anim) — monAnim()
// bleibt eine reine Tabellensuche, im Frame-Pfad wird nie ein Key per Template-
// String zusammengesetzt (130 Mobs x 60 fps, Regressionsregel 4).
const RIG_ANIM = {};
for(const rig in CF_RIGS){
  const anims = {};
  for(const anim in CF_RIGS[rig].anims) anims[anim] = `${rig}_${anim}`;
  RIG_ANIM[rig] = anims;
}
const monAnim = (d, name)=> RIG_ANIM[d.rig][name];

// === Monsterkatalog M1: Schadensarten, Resistenzen, Vorwarnzeit ==============
// Der Katalog (monsterkatalog-stufe-1-10.md) rechnet mit EHP statt HP:
//     EHP = HP / (1 - Resistenz)
// Eine negative Resistenz ist eine Verwundbarkeit. Fünf Arten, aber nur vier
// davon kann der Spieler überhaupt austeilen: physisch aus der Waffe, Feuer,
// Eis und Magie aus den drei Zauberzweigen. Gift steht in den Tabellen und
// wirkt bislang nur gegen den Spieler (Trankwirkung sperren), deshalb hängt
// auch keine einzige Weichstelle eines Resistenz-Gates an Gift, sonst wäre das
// Gate unlösbar. Das Ultimate kennt keine Resistenz, so wie es schon die
// Kammerregeln nicht kennt.
const SCHADENSART = ['feuer', 'eis', 'magie'];              // Index = Zauberzweig, s. SPELL_BRANCHES
const RES_NULL = {physisch:0, feuer:0, eis:0, gift:0, magie:0};
function schadensArt(quelle){
  if(typeof quelle === 'number') return SCHADENSART[quelle] || 'magie';
  return quelle === 'ult' ? null : 'physisch';
}
// Weichstelle = die Art mit der niedrigsten Resistenz. Wird einmal beim Laden je
// MONDEF-Eintrag gebacken, nicht pro Treffer gesucht: hurtMon liegt im Cleave-Pfad.
function backeWeichstelle(d){
  const r = d.res || RES_NULL;
  let weich = 'physisch', min = Infinity;
  for(const art in r) if(art !== 'gift' && r[art] < min){ min = r[art]; weich = art; }
  return weich;
}
// Resistenz eines Monsters gegen eine Art, inklusive der beiden Zeitfenster, die
// der Katalog kennt: das Abgabefenster des Zustellboten (Resistenz fällt auf 0)
// und der Aktenmantel der Sammelverfuegung (alles außer der Weichstelle auf 0,8).
function monRes(m, art){
  if(m.offenT > 0) return 0;                               // B4-Fenster: alles trifft voll
  const r = (m.def.res || RES_NULL)[art] || 0;
  if(m.mantelT > 0 && art !== m.def.weich) return Math.max(r, 0.8);
  return r;
}

function makeMon(type,x,y){
  const d = MONDEF[type];
  const m = { type, def: d, x, y, r: d.r, hp: d.hp, maxHp: d.hp, aggro: false, atkT: rr(0,0.5), flash: 0, dead: false, kx: 0, ky: 0,
    bobPhase: rr(0, Math.PI*2), wanderT: rr(0,2), wanderDx:0, wanderDy:0, slowT: 0, facingLeft:false,
    animT: rr(0,1), anim:'idle', actT:0, alertT:0, moving:false,
    // W-Groß: Heimatpunkt und Leinen-Zähler für die Aufgabe-Regel weiter unten.
    homeX: x, homeY: y, leashT: 0, stuckT: 0,
    regel: null, faceAng: 0, gruss: false,   // regel: Kammer-Sonderregel (Phase 2); gruss: Fluch 'Grußpflicht' (Phase 3)
    // --- Monsterkatalog M1 -------------------------------------------------
    // teleT   laufende Vorwarnung in Sekunden, > 0 heißt "holt sichtbar aus"
    // teleMus Index des angekündigten Musters in def.muster
    // offenT  Fenster, in dem alle Resistenzen auf 0 fallen (Meisterschaft)
    // zuT     Unverwundbarkeit (Verwehen), währenddessen prallt alles ab
    // mantelT Aktenmantel: alles außer der Weichstelle auf 0,8
    // buffT   Schadensbuff durch einen Unterstützer
    // ruheT   Erschöpfung nach einem schweren Muster, kein Angriff
    // haltT   Klammergriff: der Spieler steckt fest
    // lauert  Hinterhalt: wartet unsichtbar, bis der Spieler nah genug ist
    // folgeAn nächster Angriff ist der Folgeschlag (zweite Nachforderung)
    // schlagN Zähler für starre Schlagfolgen (Dienstweg: drei, dann Pause)
    // elite  M2: null oder der Name des Sonderprüfers. Wird nur in setzeMon()
    //        gesetzt, nie im Frame-Pfad; alle Aufwertungen lesen dieses eine Feld.
    elite: null,
    teleT: 0, teleMus: 0, teleAng: 0, offenT: 0, zuT: 0, mantelT: 0, buffT: 0,
    ruheT: 0, rueckT: 0, folgeAn: false, eroeffnet: !d.hinterhalt, schlagN: 0,
    zyklusT: d.fenster && d.fenster.alle ? rr(1, d.fenster.alle) : 0 };
  monsters.push(m);
  if(d.boss) boss=m;
  return m;
}

// Leichen spielen die Sterbe-Animation zu Ende und verschwinden dann.
const corpses = [];

// Biom-Rosters. Monsterkatalog M1: jedes Katalogbiom trägt drei bis fünf Typen
// aus mindestens drei Ertragsklassen. Die Häufigkeit steckt in der Wiederholung
// (so war es hier schon immer: 'ghost','ghost' heißt doppelt so häufig), nur
// wird sie jetzt als Gewicht geschrieben statt von Hand ausgeschrieben:
//     Fleiß 5, Geduld 3, Risiko 2, Meisterschaft 1
// Damit ist jeder zwölfte bis sechzehnte Gegner eines Bandes ein A4, und ein
// Spaziergang durch den Wald trifft im Schnitt einen Zustellboten alle 16
// Begegnungen. Ohne diese Staffel stünden 120 Mini-Bosse auf der Karte.
const mobRoster = w => { const a = []; for(const t in w) for(let i = 0; i < w[t]; i++) a.push(t); return a; };
const BIOME_MOBS = {
  ruine: mobRoster({aktenbote:5, mummy:3, stalfos:2, sammelverfuegung:1}),
  snow:  ['ghost','ghost','frostgolem','frostmage'],          // vom Katalog nicht angefasst
  grass: mobRoster({slime:5, goblin:5, ablagestapel:3, greenmage:2, zustellbote:1}),
  sumpf: mobRoster({blubberakte:5, moorbescheid:3, amtsschimmel:2, fristlaeufer:1}),
  sand:  mobRoster({skarabaeus:5, crab:3, scorpion:2, sandmage:1}),
};

// W4: die einzigen Monstertypen, auf die ein Dienstauftrag lauten darf. Wird aus
// BIOME_MOBS abgeleitet und nie von Hand gepflegt: wer den Roster ändert, ändert
// automatisch die Aushänge mit. Jeder der neun Typen kommt in genau einem Biom vor,
// deshalb ist AUFTRAG_BIOM eine eindeutige Rückabbildung (von auftragAssertBrett geprüft).
const AUFTRAG_MOBS = [], AUFTRAG_BIOM = {};
for(const b in BIOME_MOBS) for(const t of BIOME_MOBS[b]){
  if(AUFTRAG_MOBS.indexOf(t) < 0){ AUFTRAG_MOBS.push(t); AUFTRAG_BIOM[t] = b; }
}
// Amtliche Biomnamen aus W1 (phase-w1-terminologie.md), Nominativ für Titel, Dativ für Sätze.
const BIOM_AMT = {
  ruine: {nom:'Der Altbestand',     dat:'im Altbestand'},
  snow:  {nom:'Die Eisablage',      dat:'in der Eisablage'},
  grass: {nom:'Ablage A',           dat:'in Ablage A'},
  sumpf: {nom:'Die Nassablage',     dat:'in der Nassablage'},
  sand:  {nom:'Der Brandabschnitt', dat:'im Brandabschnitt'},
};
// Die Untere Registratur ist kein Band, sondern die Kammer. Sie taucht deshalb
// weder in BIOME_BANDS noch in BIOME_MOBS auf, hat aber eine eigene
// Loot-Signatur (s. zutatBiome) und einen eigenen amtlichen Namen.
const HOEHLE_AMT = {nom:'Die Untere Registratur', dat:'in der Unteren Registratur'};

// W4: Weltgarantie. Die Oberwelt wächst nicht nach (placeMonsters läuft genau einmal
// je Schicht) — ein Aushang auf einen seltenen Typ wie 'crab' träfe ohne diesen Eingriff
// nur den Anteil, den der Zufall ihm im Roster seines Bandes zuteilt (bei 600 Monstern
// auf drei Bänder und vier Roster-Einträge rund 50 Stück, aber verstreut über die ganze
// Karte). Deshalb reserviert der laufende Aushang Plätze in der bestehenden
// Setzschleife: dieselbe makeMon-Zeile, nur mit gelenkter Typ- bzw. Bandwahl und
// zusätzlich in eine Scheibe ums Dorf gezwungen (AUFTRAG_NAH), bis das Soll steht.
// Kein neuer Spawner, kein Frame-Aufwand.
// Bewusst TDZ-sicher: liest ausschließlich amt.auftrag und BIOME_MOBS, nie AUFTRAG_TYPEN —
// placeMonsters() läuft schon beim Skriptstart, lange vor der Tabelle weiter unten.
function auftragTypBevorzugen(typ, biome){
  // GW5: auftragSoll ZUERST. Der Zähler steht oben bei den Modulvariablen und ist
  // beim Skriptstart 0 — erst startShift() setzt ihn, und das läuft lange nach
  // CONFIG. Damit ist der CONFIG-Zugriff unten aus dem Skriptstart-Aufruf von
  // placeMonsters() heraus unerreichbar und die Funktion bleibt TDZ-sicher.
  if(auftragSoll <= 0) return typ;
  const a = CONFIG.schichtModus ? amt.auftrag : null;   // Inertheit, Muster auftragEreignis()
  if(!a) return typ;
  if(a.typ !== 'menge' && a.typ !== 'sammlung') return typ;
  if(!BIOME_MOBS[biome] || BIOME_MOBS[biome].indexOf(a.par) < 0) return typ;
  auftragSoll--; return a.par;
}
function auftragOrtBand(){
  if(auftragOrtSoll <= 0) return null;                  // GW5: TDZ-sicher, siehe oben
  const a = CONFIG.schichtModus ? amt.auftrag : null;
  if(!a || a.typ !== 'ort') return null;
  return bandRange(a.par, 4);
}

// W-Groß: Zielzahl gesetzter Oberwelt-Monster. Die alte Schleife lief 55 Mal und
// zählte VERSUCHE, nicht Treffer — jedes continue (Wasser, Dorf, Knöterichs Kachel,
// Spawn-Ring) verbrannte einen Platz, die echte Bevölkerung lag bei rund 49.
// 600 auf ~84000 Landkacheln entspricht ungefähr der alten Dichte von 49/6400.
const ZIEL_MOBS = 600;
// Monsterfreier Gürtel um das DORFRECHTECK, in Kacheln. Vorher war es ein
// Pixelkreis von 8 Kacheln um den Punkt SPAWN — falsche Form und zu klein: sicher
// sein muss das Dorf als Fläche, nicht ein Punkt darin.
// M2: von 40 auf 12 Kacheln. 40 waren rund zehn Sekunden Fußweg BIS ZUM ERSTEN
// GEGNER, und weil dahinter der volle Roster gleichverteilt lag, konnte der erste
// Gegner nach diesem Marsch ein Zustellbote sein. Zwölf Kacheln sind drei
// Sekunden: das Dorf bleibt als Fläche sicher, der erste Kampf beginnt aber im
// Blickfeld des Dorfes und ist nach der Zonenstaffel unten garantiert ein
// leichter. Wer sich sicher fühlen will, geht zwölf Kacheln zurück.
const DORF_BANN = 12;
// Deckel für den 'menge'-Aushang. Er ist das Minimum aus ZWEI Grenzen, und das
// ist der eigentliche Befund von W-Groß: bis hierher war die bindende Grenze die
// Zahl der Spawns (der alte Handwert 11 stand neben dem Satz "ein Biom trägt
// rund 15 bis 18"). Mit 600 Monstern trägt ein Biom rund 50 Stück eines Typs,
// die Spawn-Grenze bindet also gar nicht mehr — die bindende Grenze ist jetzt
// die UHR. Beide Grenzen stehen deshalb ausgeschrieben da, statt dass eine von
// ihnen unbemerkt wirkungslos wird:
//   Weltgrenze: 600 Monster / 3 Bänder / 4 Roster-Einträge, mal 0.6 für
//               Ablehnungen und für Kartenecken, die niemand abläuft.
//   Uhrgrenze:  der alte, im Spiel erprobte Wert 11, angehoben im Verhältnis der
//               Schichtdauer (900 -> 1500 s). Damit bleibt das Zeitbudget JE KILL
//               erhalten: früher 11 Kills in 900 s (82 s je Stück), jetzt bis 18
//               in 1500 s (83 s je Stück). Ohne diese Grenze würde der Deckel bei
//               30 liegen und nie binden — der Aushang wäre stillschweigend
//               schwerer geworden, ohne dass es jemand entschieden hätte.
//               (Korrektur 06.08.2026: hier stand "bis 17" und "88 s je Stück".
//               Math.round(11*1500/900) ist 18 — der Kommentar widersprach dem
//               Ausdruck zwei Zeilen unter ihm. Die Absicht des Werts stimmt
//               weiter: 82 s je Kill vorher, 83 s nachher.)
const MENGE_WELT = Math.floor(ZIEL_MOBS / 3 / 4 * 0.6);
const MENGE_UHR  = Math.round(11 * 1500 / 900);
const MENGE_DECKEL = Math.max(4, Math.min(MENGE_WELT, MENGE_UHR));
// Umkreis ums Dorf (Kacheln), in dem die Weltgarantie ihre reservierten Monster
// setzt. Weit genug für Abwechslung, nah genug für eine Schicht Fußweg.
const AUFTRAG_NAH = 90;
// Abstand einer Kachel zum DORFRECHTECK, in Kacheln, als Schachbrettabstand
// (Maximum der beiden Achsen). Damit ist eine "Entfernung vom Dorf" dieselbe
// Rechteckform, die auch der Bannkreis hat — ein Kreis um den Dorfmittelpunkt
// wäre an den langen Seiten des Dorfes enger als an den kurzen.
const dorfAbstand = (tx,ty)=> Math.max(VILLAGE.x0-tx, tx-VILLAGE.x1, 0,
                                       VILLAGE.y0-ty, ty-VILLAGE.y1, 0);
const nahDorf = (tx,ty)=> dorfAbstand(tx,ty) < DORF_BANN;

// === M2: Schwierigkeit wächst mit der Entfernung ===========================
// Befund aus dem Spielbericht: die Bevölkerung lag GLEICHVERTEILT über die
// Karte. Direkt hinter dem Bannkreis stand mit derselben Wahrscheinlichkeit ein
// Formfehler (A1, zwei Sekunden Kampf) wie ein Zustellbote (A4, halbe Minute
// und Meisterschaft) — der erste Kampf einer Schicht war ein Würfelwurf. Der
// Katalog staffelt die Gegner nach Ertragsklassen, die KARTE tat es nicht.
//
// Jetzt ist der Abstand zum Dorf die Schwierigkeitsachse:
//   Zone 0  Nahfeld   (Bann bis NAHFELD_R):  nur Fleiß (A1), dreifache Dichte
//   Zone 1  Übergang  (bis UEBERG_R):        Fleiß und Geduld, kein A3, kein A4
//   Zone 2  Ferne     (darüber):             der volle Roster wie bisher
// Die Klassen kommen aus MONDEF[t].kat.klasse, nicht aus einer zweiten Liste:
// wer einen Gegner umklassifiziert, verschiebt ihn damit automatisch mit.
const NAHFELD_R = 44;         // Kacheln ab Dorfkante: rund zwölf Sekunden Fußweg
const UEBERG_R  = 96;
const NAHFELD_SOLL = 260;     // zusätzlich zu ZIEL_MOBS, ausschließlich im Nahfeld
const zoneVon = (tx,ty)=>{ const a = dorfAbstand(tx,ty); return a < NAHFELD_R ? 0 : a < UEBERG_R ? 1 : 2; };

// Roster je Zone und Band, einmal beim Laden gefiltert. Im Setzpfad ist das
// danach derselbe Feldzugriff wie vorher, kein Filter pro Monster.
// Das Schneeband steht nicht im Katalog (keine kat-Felder, s. MONDEF): dort ist
// der billigste Eintrag des Bandes der Fleiß-Ersatz, damit auch die Nordseite
// des Dorfes ein Nahfeld bekommt statt einer Lücke.
const katKlasse = t => (MONDEF[t].kat && MONDEF[t].kat.klasse) || null;
const ZONEN_MOBS = [{}, {}, {}];
for(const b in BIOME_MOBS){
  const voll = BIOME_MOBS[b];
  const a1 = voll.filter(t => katKlasse(t) === 'A1');
  const a12 = voll.filter(t => katKlasse(t) === 'A1' || katKlasse(t) === 'A2');
  const billigster = voll.slice().sort((x,y) => MONDEF[x].xp - MONDEF[y].xp)[0];
  ZONEN_MOBS[0][b] = a1.length  ? a1  : [billigster];
  ZONEN_MOBS[1][b] = a12.length ? a12 : voll;
  ZONEN_MOBS[2][b] = voll;
}

// W-Groß: bildschirmnahe Monster. Ein Rand von 320px über den Bildschirm hinaus,
// damit nichts sichtbar "aufwacht" — Monster sollen bereits laufen, wenn sie ins
// Bild kommen. Die Liste wird pro Frame in update() gefüllt und nie neu allokiert.
const NAH_RAND = 320;
const nahListe = [];
const nahAmBild = m => m.x > cam.x - NAH_RAND && m.x < cam.x + canvas.width + NAH_RAND
                    && m.y > cam.y - NAH_RAND && m.y < cam.y + canvas.height + NAH_RAND;
// Aufgabe-Regel für Verfolger: zu weit weg vom Spieler ODER zu weit vom eigenen
// Heimatpunkt. Beides nötig — die erste Grenze löst den Verfolger, die zweite
// verhindert, dass eine lange Jagd das halbe Biom leerräumt.
const LEASH_PX = 620, LEASH_HOME = 1400;

// === M2: Der Sonderprüfer ===================================================
// Wunsch aus dem Spielbericht: "ab und an ein gut erkennbarer harter Gegner".
// Ein Sonderprüfer ist KEIN eigener Katalogeintrag und keine Zahlenaufblähung
// ins Blaue, sondern eine Aufwertung genau einer Ertragsklasse nach einer
// festen, geprüften Regel:
//   * nur aus Fleiß (A1). Ein aufgewerteter A4 wäre an seiner Sollstufe nicht
//     mehr ohne Verbrauchsgegenstände zu schaffen, und genau das verbietet der
//     Katalog. Aus A1 aufgewertet spielt er sich wie ein Risiko-Gegner: er lebt
//     lange, er trifft hart, aber sein Gefahrenbudget bleibt über dem A3-Boden.
//   * die Vorwarnung wird LÄNGER, nicht kürzer. Ein Gegner, der härter trifft,
//     muss besser lesbar sein, sonst ist er nicht schwer, sondern unfair.
//   * er zahlt den A3-Ertragssatz. ELITE.xp ist deshalb nicht frei gewählt,
//     sondern hp mal dem Verhältnis der Klassenfaktoren (2.0 / 1.0 = 2), also
//     4.0 * 2 = 8.0. monsterAssert() rechnet das nach, damit es nicht driftet.
//   * er ist auf den ersten Blick zu erkennen: anderthalbfache Größe, ein
//     magentafarbener Schein, den sonst kein Gegner trägt, und ein eigener Name
//     über dem Kopf.
// warnMin: harter Boden fuer die Vorwarnung, in Millisekunden. Der Faktor allein
// reicht nicht — die Fledermaus warnt 250 ms vor, mal 1,35 sind 338 ms, und der
// Katalog verlangt ab A3 mindestens 350. Der Sonderpruefer trifft wie ein
// Risiko-Gegner, also warnt er auch wie einer. (Genau diesen Fall hat
// monsterAssert() beim ersten Lauf gemeldet, er stand nicht vorher im Plan.)
const ELITE = {hp:4.0, dmg:2.4, warn:1.35, warnMin:350, tempo:0.9, xp:8.0, gold:6, sc:1.6, r:1.35, glow:'#ff5ad6'};
// Rund jeder fünfzigste Fleiß-Gegner. Bei 260 Nahfeld-Monstern sind das etwa
// fünf im Ring ums Dorf: oft genug, dass man sie kennenlernt, selten genug,
// dass sie ein Ereignis bleiben.
const ELITE_CHANCE = 0.02;
const ELITE_TITEL = ['Oberamtsrat','Amtsrätin','Regierungsdirektor','Hauptsachbearbeiterin',
                     'Oberinspektor','Ministerialrätin','Aktenvorsteher','Registraturleiterin',
                     'Oberrevisor','Prüfstellenleiterin'];
const ELITE_NAME  = ['Grimmig','Aktenberg','Siegel','Stempelmann','Vordrucker','Nachtrag',
                     'Krähwinkel','Bürzel','Klammer','Randnotiz','Umlauf','Vermerk',
                     'Schnarrwinkel','Doppelbogen'];
// rng() statt Math.random(): der Weltzufall ist gesetzt, also steht auf demselben
// Startwert derselbe Sonderprüfer an derselben Stelle. Das macht einen Bericht
// wie "der Große bei den drei Bäumen" überhaupt erst nachvollziehbar.
const eliteName = ()=> ELITE_TITEL[Math.floor(rng()*ELITE_TITEL.length)] + ' ' +
                       ELITE_NAME[Math.floor(rng()*ELITE_NAME.length)];
function eliteMachen(m){
  m.elite = eliteName();
  m.maxHp = Math.round(m.maxHp * ELITE.hp);
  m.hp = m.maxHp;
  m.r = Math.round(m.r * ELITE.r);
  return m;
}

function placeMonsters(){
  monsters.length = 0; boss = null; lockedTarget = null;
  if(currentLevel === 1){
    // Treffer zählen statt Versuche. Die Versuchsschranke ist Pflicht, nicht Zierde:
    // ein ungünstiger Küsten-Startwert darf das Laden nicht aufhängen.
    let gesetzt = 0, versuche = 0;
    while(gesetzt < ZIEL_MOBS && versuche++ < ZIEL_MOBS*40){
      const band = auftragOrtBand();                                       // W4
      // W-Groß: reservierte Plätze (Weltgarantie für den laufenden Aushang)
      // werden zusätzlich in eine Scheibe ums Dorf gezwungen. auftragOrtBand()
      // erzwingt nur das y-BAND — ein garantiertes Ziel konnte damit 300 Kacheln
      // seitlich liegen und war in einer Schicht nicht erreichbar. Der Aushang
      // ist nur dann eine Garantie, wenn er auch ablaufbar ist.
      const reserviert = !!band || auftragSoll > 0;
      const tx = reserviert
        ? ri(Math.max(4, VILLAGE.x0-AUFTRAG_NAH), Math.min(MW-5, VILLAGE.x1+AUFTRAG_NAH))
        : ri(4, MW-5);
      const ty = band ? ri(band[0], band[1])
               : reserviert ? clamp(ri(VILLAGE.y0-AUFTRAG_NAH, VILLAGE.y1+AUFTRAG_NAH), 4, MH-5)
               : ri(4, MH-5);
      if(!reachbar(tx,ty)) continue;
      if(nahDorf(tx,ty) || imLager(tx,ty)) continue;   // G5/W-Groß: Dorf samt Umland bleibt monsterfrei; W-Lager: das Lager auch
      if(tx===KN_T.x && ty===KN_T.y) continue;   // Knöterichs Kachel bleibt frei von Monstern
      const biome = biomeAtT(ty);
      // M2: der Roster hängt jetzt an der Zone, nicht mehr allein am Band.
      const roster = ZONEN_MOBS[zoneVon(tx,ty)][biome];
      setzeMon(auftragTypBevorzugen(roster[Math.floor(rng()*roster.length)], biome), tx, ty);  // W4
      gesetzt++;
      if(band) auftragOrtSoll--;                 // W4: erst zählen, wenn wirklich gesetzt
    }
    if(gesetzt < ZIEL_MOBS) console.warn('Weltform: nur', gesetzt, 'von', ZIEL_MOBS, 'Monstern gesetzt');

    // --- M2: das Nahfeld ------------------------------------------------
    // Die Schleife oben streut über die ganze Karte; der Ring ums Dorf ist
    // darin nur ein Prozent der Fläche und bekäme rund sechs Monster. Das
    // Nahfeld wird deshalb GESONDERT gefüllt, mit erzwungenen Koordinaten im
    // Ring. Ergebnis ist die dreifache Dichte der übrigen Karte, ausschließlich
    // aus Fleiß-Gegnern: wer aus dem Dorf tritt, hat sofort etwas zu tun und
    // gewinnt es auch.
    let nah = 0, nversuche = 0;
    while(nah < NAHFELD_SOLL && nversuche++ < NAHFELD_SOLL*40){
      const tx = ri(Math.max(4, VILLAGE.x0-NAHFELD_R), Math.min(MW-5, VILLAGE.x1+NAHFELD_R));
      const ty = ri(Math.max(4, VILLAGE.y0-NAHFELD_R), Math.min(MH-5, VILLAGE.y1+NAHFELD_R));
      if(dorfAbstand(tx,ty) >= NAHFELD_R) continue;    // Rechteckecken liegen außerhalb des Rings
      if(!reachbar(tx,ty) || nahDorf(tx,ty) || imLager(tx,ty)) continue;
      if(tx===KN_T.x && ty===KN_T.y) continue;
      const roster = ZONEN_MOBS[0][biomeAtT(ty)];
      setzeMon(roster[Math.floor(rng()*roster.length)], tx, ty);
      nah++;
    }
    if(nah < NAHFELD_SOLL) console.warn('Weltform: Nahfeld nur', nah, 'von', NAHFELD_SOLL);
    // W-Lager: die Besatzung zuletzt, damit sie jeden Neuaufbau ueberlebt. Sie
    // stand zwischenzeitlich VOR placeMonsters() und wurde von dessen
    // monsters.length = 0 jedes Mal stillschweigend wieder abgeraeumt.
    setzeLager();
  }
}

// Eine Setzstelle für beide Schleifen. Hier und nur hier entscheidet sich, ob aus
// einem gewöhnlichen Vorgang ein Sonderprüfer wird (s. ELITE weiter unten).
function setzeMon(typ, tx, ty){
  const m = makeMon(typ, tx*TS+16, ty*TS+16);
  if(katKlasse(typ) === 'A1' && rng() < ELITE_CHANCE) eliteMachen(m);
  return m;
}
// W-Lager: die Besatzung. Feste Plaetze statt Streuung — ein Lager, dessen Wachen
// jedes Mal woanders stehen, ist kein Lager, sondern eine Lichtung mit Zaun. Die
// Torfigur steht innen vor dem Tor, die Speere flankieren sie, die Schuetzen
// stehen bei den Tuermen. reserved:true haelt alle drei aus jedem Bandroster
// heraus, sie entstehen also ausschliesslich hier.
function setzeLager(){
  const mitte = Math.round((LAGER.x0 + LAGER.x1) / 2);
  // Zwei Kacheln weiter innen als das Tor: das Torblatt ist bei Skalierung 2 rund
  // 124 Pixel hoch, sortiert nach ihm und schnitt ihm sonst die Beine ab.
  setzeMon('empfangsbekenntnis', LAGER_TOR_X + 1, LAGER.y1 - 4);
  setzeMon('vorbehalt', LAGER_TOR_X - 2, LAGER.y1 - 3);
  setzeMon('vorbehalt', LAGER_TOR_X + 4, LAGER.y1 - 3);
  // Die Schuetzen an die Seitenwaende, nicht unter die Tuerme: die Zelte sind
  // 192 Pixel hoch und deckten sie dort vollstaendig zu.
  setzeMon('zwischennachricht', LAGER.x0 + 2, LAGER.y0 + 9);
  setzeMon('zwischennachricht', LAGER.x1 - 2, LAGER.y0 + 9);
  setzeMon('vorbehalt', mitte, LAGER.y0 + 9);
}
placeMonsters();

function loadLevel2(){
  currentLevel = 2; schattenlandActive = true;
  sfx.warp(); addShake(25, 1.0);
  // Kachel-MITTE, nicht Kachelecke: ARENA.x*TS landete auf dem Eckpunkt, wodurch
  // der Kollisionskreis (player.r) in vier Kacheln gleichzeitig griff. War eine
  // Kachel davon blockiert, saß der Spieler im Schattenland unbeweglich fest —
  // ohne Ausweg, weil moveEnt() jede Richtung verweigert. SPAWN umgeht das seit
  // jeher über seine .5-Koordinaten; ARENA tat es nicht.
  player.x = tileMid(ARENA.x); player.y = tileMid(ARENA.y); camSnap();
  monsters.length = 0; drops.length = 0; lockedTarget = null;
  refreshFloor(); // Map ändert sich optisch in Schatten-Biom
  floaters.push({x:player.x, y:player.y-40, txt:'MASSENVORGANG ERÖFFNET', col:'#ff0055', t:4.0, big:true});
  auftragEreignis('ablage');   // W4
  // T4: Ablage V, der ungeleerte Papierkorb. Hier unten steht keine Dorffigur,
  // anlage2Allein() gibt auf dieser Ebene deshalb ohne Messung wahr zurueck.
  anlage2Notiz('ebene');
  anlage2Umschlag('ersteEbene');
}

function moveEnt(e,dx,dy){
  if(dx!==0){ const nx=e.x+dx; if(circleWalkable(nx,e.y,e.r)) e.x=nx; }
  if(dy!==0){ const ny=e.y+dy; if(circleWalkable(e.x,ny,e.r)) e.y=ny; }
}

// Buntes Konfetti (kein Rot)
const CONFETTI = ['#ffd54a','#4ad6ff','#6aff8f','#c77dff','#ff9f4a','#4affd6','#ffe14d','#7da0ff','#ff8fe0','#a0ff5a'];
const confettiCol = ()=> CONFETTI[Math.floor(Math.random()*CONFETTI.length)];

// color=null => pro Partikel eine zufällige Konfettifarbe (mit Rotation + Schwerkraft)
const MAX_PARTICLES = 900;               // Ultimate + Horde erzeugten sonst tausende Sprites
function spawnImpactParticles(x, y, count=12, color='#ffd700'){
  const confetti = color === null;
  count = Math.min(count, MAX_PARTICLES - particles.length);
  for(let i=0; i<count; i++){
    const angle = rr(0, Math.PI*2), speed = rr(80, 280);
    particles.push({x, y, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed - (confetti?60:0),
      size: rr(2, 5), life: confetti?rr(0.5,1.0):rr(0.2,0.45), maxLife: confetti?1.0:0.45,
      color: confetti?confettiCol():color, confetti,
      rot: rr(0, Math.PI*2), spin: rr(-12, 12), w: rr(3, 6), h: rr(5, 9)});
  }
}

// Dauerhaftes Konfetti-Krümel (statt Blut) — landet jetzt im Ringpuffer aus
// refreshFloor() (decalX/Y/W/H/Col), nicht mehr in einer gecachten Bodenebene.
// Verhalten unverändert: gleiche Menge, gleiche Streuung, gleiche Farbpalette.
function splatConfetti(x, y, isSchatten){
  const amount = rri(3, 8);
  for(let i=0; i<amount; i++){
    const idx = decalHead;
    decalX[idx] = x + rr(-18, 18); decalY[idx] = y + rr(-18, 18);
    decalW[idx] = rr(2, 4); decalH[idx] = rr(2, 4);
    decalCol[idx] = Math.floor(Math.random() * CONFETTI.length);
    decalHead = (decalHead + 1) % DECAL_MAX;
    if(decalN < DECAL_MAX) decalN++;
  }
}

function tryAttack(dir){
  if(player.attackCd>0) return;
  player.attackCd = 1/derived.aps;
  player.swingT = 0.25; player.swingDir = dir; player.dir = dir;
  player.kampfT = 3;      // Fluch 'Nüchternheitsgebot': Kampf sperrt kurz das Trinken

  // Fluch 'Fehlschlag': jeder dritte Schlag geht daneben, ohne Cooldown zu sparen
  if(CFX.fehl && (++player.schlagN % 3) === 0){
    sfx.swing(false);
    floaters.push({x:player.x, y:player.y-28, txt:'daneben', col:'#9a8a5f', t:0.6});
    return;
  }

  sfx.swing(false);
  let hitCount = 0;

  for(const m of monsters){
    if(m.dead) continue;
    const dToMon = dist(player.x, player.y, m.x, m.y);
    const mAngle = Math.atan2(m.y - player.y, m.x - player.x);
    // Erweiteter Cleave Arc (1.6 Rad = sehr breit), Wirkung 'Reichweite' öffnet ihn weiter
    if(dToMon < derived.range && angDiff(mAngle, dir) < derived.arc){
      // Wirkung 'Genauigkeit': kein Würfeln mehr, immer der obere Wert
      const dmg = FX.exact ? Math.round(derived.dmgMax * (1 + (FX.exact-1)*0.1))
                           : rri(derived.dmgMin, derived.dmgMax);
      hurtMon(m, dmg, Math.random() < derived.crit, mAngle, 'nah');
      hitCount++;
      if(CFX.einzel) break;     // Fluch 'Einzelzuständigkeit': nur ein Gegner pro Hieb
    }
  }

  if(hitCount > 0){
    sfx.hit(hitCount > 2);
    addHitStop(Math.min(0.15, hitCount * 0.02)); // Je mehr Hits, desto fetter der Stop!
    addShake(Math.min(25, hitCount * 4), 0.2);
    if(FX.leech) player.hp = Math.min(derived.maxHp, player.hp + FX.leech * Math.min(3, hitCount) * 0.5);   // Wirkung 'Zehrung'
    // Z2: Mana entsteht bei der Arbeit. EINMAL je Schwung, nicht je Getroffenem
    // (ein Cleave durch fuenf Chuchus waere sonst ein Manabrunnen), und mit
    // Absicht auch unter dem Fluch 'Manastopp': der sperrt wortgetreu nur das
    // Mana, das "von selbst" zurueckkehrt. Erarbeitetes kehrt nicht von selbst
    // zurueck — damit hat der bisher haerteste Fluch zum ersten Mal einen
    // Konter, der zu seiner eigenen Formulierung passt.
    if(player.mana < derived.maxMana){
      player.mana = Math.min(derived.maxMana, player.mana + MANA_JE_TREFFER);
      spawnImpactParticles(player.x, player.y - 14, 2, '#7ad6ff');
    }
  }
}

let lastCritSfx = -1, lastDieSfx = -1, lastAbprallSfx = -1;
// quelle: 'nah' (Waffe), 0..2 (Zauberzweig) oder 'ult'. Nur Kammerwachen mit
// Sonderregel schauen überhaupt hin, alle anderen Aufrufe ignorieren das Feld.
function hurtMon(m, d, crit, hitAngle, quelle){
  if(m.dead) return;          // Cleave + AoE im selben Frame trafen sonst doppelt: doppelte Beute, doppeltes XP
  if(m.regel && !kamTrefferOk(m, quelle === undefined ? 'nah' : quelle, hitAngle)){
    m.flash = 0.1; m.aggro = true;
    if(gameT - lastAbprallSfx > 0.3){                     // gleiche Bremse wie bei Crit/Sterbe-Sound
      lastAbprallSfx = gameT;
      floaters.push({x: m.x, y: m.y - m.r - 10, txt: m.regel.txt, col:'#9a8a5f', t: 0.9});
    }
    return;
  }
  // Fluch 'Grußpflicht': nur Nahkampf gattet, nie Kammerwachen mit Sonderregel
  // (die sind oben schon durchgelassen oder abgewiesen).
  if(CFX.gruss && !m.gruss && !m.regel && quelle === 'nah'){
    m.flash = 0.1; m.aggro = true;
    if(gameT - lastAbprallSfx > 0.3){
      lastAbprallSfx = gameT;
      floaters.push({x: m.x, y: m.y - m.r - 10, txt: 'ungegrüßt', col:'#9a8a5f', t: 0.9});
    }
    return;
  }
  // Monsterkatalog M1: Unverwundbarkeitsfenster. Das Verwehen des Fristlaeufers
  // ist kein Ausweichen, sondern eine angesagte Auszeit, sie prallt sichtbar ab
  // und läuft danach in ein offenes Fenster (s. monsterZyklus).
  if(m.zuT > 0 && quelle !== 'ult'){
    m.flash = 0.1; m.aggro = true;
    if(gameT - lastAbprallSfx > 0.3){
      lastAbprallSfx = gameT;
      floaters.push({x: m.x, y: m.y - m.r - 10, txt: 'verweht', col:'#9a8a5f', t: 0.9});
    }
    return;
  }
  // Monsterkatalog M1: Schadensart gegen Resistenz. Gerechnet wird auf dem
  // Rohschaden, VOR dem Crit, sonst hänge die Wirkung einer Resistenz an der
  // Crit-Wahrscheinlichkeit statt am Gegner.
  const art = schadensArt(quelle === undefined ? 'nah' : quelle);
  let hart = 0;
  if(art){
    hart = monRes(m, art);
    if(hart >= 0.999){
      m.flash = 0.1; m.aggro = true;
      if(gameT - lastAbprallSfx > 0.3){
        lastAbprallSfx = gameT;
        // M2: der Hinweis sagt, WAS zu tun ist, nicht nur dass es nicht ging.
        floaters.push({x: m.x, y: m.y - m.r - 10,
                       txt: m.def.zauberfest ? 'versiegelt · nimm die Waffe' : 'wirkungslos',
                       col:'#9a8a5f', t: 1.2});
      }
      return;
    }
    d = Math.max(1, Math.round(d * (1 - hart)));
  }
  if(crit) d = Math.round(d * 1.7);
  m.hp -= d; m.flash = 0.15; m.aggro = true;
  if(FX.schreck) m.atkT = Math.max(m.atkT, FX.schreck*0.22);       // Wirkung 'Einschüchterung'
  if(FX.slow) m.slowT = Math.max(m.slowT, 0.5 + FX.slow*0.4);      // Wirkung 'Verlangsamung'
  const knock = (crit?180:100) * (1 + FX.knock*0.5);                // Wirkung 'Rückstoß'
  m.kx = Math.cos(hitAngle) * knock; m.ky = Math.sin(hitAngle) * knock;
  spawnImpactParticles(m.x, m.y, crit ? 25 : 10, null);

  // Flächenzauber markieren jeden Treffer als Crit — ohne Bremse wären das dutzende
  // Oszillatoren im selben Frame (hörbares Knacken, unnötige Last).
  if(crit && gameT - lastCritSfx > 0.07){ lastCritSfx = gameT; sfx.crit(); anlage2Notiz('crit'); }
  // Die Zahl sagt selbst, ob die gewählte Schadensart taugt: stumpfes Grau bei
  // Resistenz, Grün bei Verwundbarkeit. Kein Tooltip, keine Tabelle im Spiel.
  const zahlCol = crit ? '#ffe14d' : (hart >= 0.35 ? '#9a8a5f' : (hart <= -0.1 ? '#6aff8f' : '#ffffff'));
  if(!CFX.stille) floaters.push({x:m.x+rr(-8,8), y:m.y-m.r-10, txt:String(d), col:zahlCol, t:0.8, big:crit});   // Fluch 'Stille Zahlen'
  if(m.hp <= 0) killMon(m);
}

// Biom für die Adjektiv-Gewichtung: gleiche Bänder wie genMap/Zonenanzeige.
function zutatBiome(y){
  // Monsterkatalog M1: in der Kammer zählt nicht mehr das Band der Tür, sondern
  // die Untere Registratur selbst. Genau das macht sie zum eigenen Fundort: nur
  // unter Tage fällt häufig, was Panzerung und Aktenlage trägt. Für die
  // Aktenfund-Serien B, C und D bleibt kammer.biome maßgeblich (s.
  // truheOeffnen), die hängen an der Tür, nicht am Zutatenwurf.
  if(kammer) return 'hoehle';
  if(currentLevel === 2) return 'shadow';
  return biomeAtPx(y);
}
// name/rar werden beim Drop einmal gebacken: der Renderpfad zeichnet sie jeden
// Frame und darf dafür keine Strings zusammensetzen.
function dropZutat(m, x, y){
  const noun = ZUTAT_NOUNS[m.type] ? m.type : 'goblin';
  const z = {kind:'zutat', noun, adj:pickAdj(zutatBiome(m.y), monRar(m.def)), x, y};
  z.name = zutatName(z); z.rar = zutatRar(z);
  drops.push(z);
}

function killMon(m){
  m.dead = true; stats.kills++; knIdleT = 0;   // Kill zählt als "echte Aktion" (Steckenbleib/Untätigkeit)
  if(CONFIG.schichtModus){ shiftKillsByType[m.type] = (shiftKillsByType[m.type]||0) + 1; shiftKillsTotal++; }
  auftragEreignis('kill', m);   // W4
  // Leiche spielt die Sterbe-Animation zu Ende und blendet dann aus
  const dKey = monAnim(m.def, 'death');
  corpses.push({x:m.x, y:m.y, def:m.def, key:dKey, t:0, dur:animLen(dKey, m.def.deathFps || 11) + 1.4, flip:m.facingLeft});
  if(corpses.length > 24) corpses.shift();
  if(currentLevel === 2) shadowKills++;
  // Aktenfund Serie E/F (Ablage V): einziger Fundweg für diese Serien, denn im
  // Schattenland gibt es keine Kammern und damit keine Kammertruhe. Höchstens
  // ein Blatt pro Kill. F zuerst und mit eigener, sehr kleiner Chance geprüft —
  // sonst würde ein gemeinsamer Pool mit E das "sehr selten" aus der Weltbibel
  // wegmitteln, sobald wenige F-Blätter noch offen sind. Siehe truheOeffnen()
  // für dasselbe Prinzip bei den Kammer-Serien.
  if(currentLevel === 2){
    const kandF = serieFrei('F') ? BLAETTER_KEYS.filter(id => BLAETTER[id].serie === 'F' && !kladde.blaetter[id]) : [];
    const kandE = serieFrei('E') ? BLAETTER_KEYS.filter(id => BLAETTER[id].serie === 'E' && !kladde.blaetter[id]) : [];
    let blattId = null;
    if(kandF.length && Math.random() < 0.006) blattId = kandF[Math.floor(Math.random() * kandF.length)];
    else if(kandE.length && Math.random() < 0.04) blattId = kandE[Math.floor(Math.random() * kandE.length)];
    if(blattId && findeBlatt(blattId)){
      floaters.push({x:m.x, y:m.y-40, txt:'+ Aktenfund', col:'#c9b98a', t:2.8, big:true});
    }
    // W5: vierte Adresszeile. Kein eigener Wurf, kein neuer Kanal: sie fällt beim
    // ersten Kill in Ablage V, sobald die drei Kammerzeilen im Bestand sind.
    if(vorgangAdressAkt() && vorgangDreiZeilen() && findeAdresszeile(4)){
      floaters.push({x:m.x, y:m.y-40, txt:'+ Adresszeile', col:'#f4d97a', t:3.2, big:true});
      // SZ3: der zweite Weg zu Vorblatt. Kordula Umlauf erzaehlt Oben, dass hier
      // etwas in Bewegung kommt, und zwei Schichten spaeter steht der Wagen da.
      // Nur der erste Fund zaehlt, deshalb die Klammer.
      if(!amt.adressSchicht){ amt.adressSchicht = amt.schichten + 1; saveAmt(); }
    }
  }
  // SZ3: Serie I, aus der Roehre. Der dritte Fundweg, und der einzige, der weder
  // an einem Ort noch an einer Kammer haengt: er faellt ueberall, sobald der
  // Stopfen gezogen ist. Das ist woertlich die Weltgeschichte ("ueberall, aber
  // erst nach dem Stopfen") und mechanisch der Grund, warum der Strang sich
  // lohnt: sechs Blaetter, die es vorher nicht gab.
  //
  // Die Chance liegt zwischen E (0,04) und F (0,006): die Post ist nicht selten,
  // sie war nur unzustellbar. Wer den Stopfen zieht, findet die Serie im Lauf
  // weniger Schichten.
  if(blattFaelltAusRohr() && findeBlatt(blattAusRohr())){
    floaters.push({x:m.x, y:m.y-40, txt:'+ Aktenfund aus der Röhre', col:'#7ad6ff', t:3.0, big:true});
  }
  // M3: Teilabhilfe. Der Zerfall haengt an der Tabelle, nicht am Typnamen, damit
  // eine zweite zerfallende Vorgangsart keine zweite Codestelle braucht. Er
  // terminiert von selbst: der Teilbescheid traegt kein zerfaellt. Die Kinder
  // erben die Elite-Eigenschaft nicht — ein Sonderpruefer ist namentlich
  // gezeichnet, und eine Unterschrift teilt sich nicht.
  if(m.def.zerfaellt && !m.zerfallen){
    const z = m.def.zerfaellt;
    for(let i = 0; i < z.n; i++){
      const w = (i / z.n) * Math.PI * 2 + rr(0, 1.2), d = 18 + rr(0, 8);
      let kx = m.x + Math.cos(w) * d, ky = m.y + Math.sin(w) * d;
      // Nicht in die Wand setzen: notfalls bleibt das Kind auf dem Elternpunkt,
      // dort stand der Vorgaenger ja auch.
      if(!walkT(Math.floor(kx / TS), Math.floor(ky / TS))){ kx = m.x; ky = m.y; }
      const kind = makeMon(z.typ, kx, ky);
      if(kind){ kind.zerfallen = true; kind.aggro = true; }
    }
    floaters.push({x:m.x, y:m.y-44, txt:'Teilabhilfe · im Übrigen zurückgewiesen', col:'#9fd8ff', t:2.6, big:true});
  }
  if(gameT - lastDieSfx > 0.07){ lastDieSfx = gameT; sfx.die(); }   // Massensterben nicht 30x gleichzeitig
  spawnImpactParticles(m.x, m.y, 40, null);
  splatConfetti(m.x, m.y, currentLevel===2);
  gainXP(m.elite ? Math.round(m.def.xp * ELITE.xp) : m.def.xp);
  // Fluch 'Zerplatzer': sterbende Gegner in der Nähe treffen zurück. 0.6s-Bremse ist
  // zwingend, sonst löst ein Ultimate im Schattenland hurtPlayer() bis zu 130x im
  // selben Frame aus (Sofort-Tod, Sound-Knacken, Floater-Überlauf).
  if(CFX.platz && player.platzCd <= 0 && !player.dead && dist(player.x, player.y, m.x, m.y) < 70){
    player.platzCd = 0.6; hurtPlayer(Math.min(6 + player.level, Math.round(derived.maxHp*0.08)));
  }

  // Beute: Gold, Tränke und Zutaten. Fertige Ausrüstung fällt nicht mehr an,
  // die entsteht ausschließlich am Kessel.
  if(currentLevel === 2){
    if(Math.random()<0.55) drops.push({kind:'gold', amt:rri(m.def.gold[0], m.def.gold[1])*2, x:m.x, y:m.y});
    if(Math.random()<0.14) drops.push({kind:'potion', x:m.x, y:m.y});
  } else {
    // M2: der Sonderprüfer zahlt immer aus, sonst wäre der lange Kampf ein
    // Wurf auf nichts. Der Trank ist dabei der eigentliche Lohn: er ersetzt
    // genau das, was der Kampf gekostet hat.
    if(m.elite || Math.random()<0.4) drops.push({kind:'gold', amt:rri(m.def.gold[0], m.def.gold[1])*(m.elite?ELITE.gold:1), x:m.x, y:m.y});
    if(Math.random() < (m.elite ? 0.85 : 0.05)) drops.push({kind:'potion', x:m.x, y:m.y});
  }
  const mr = monRar(m.def);
  // Horde im Schattenland fällt reihenweise, deshalb dort deutlich seltener.
  // Fluch 'Zutatenschwund' halbiert die Chance.
  let zCount = m.def.boss ? 3
             : (Math.random() < ((currentLevel === 2 ? 0.22 : 0.5) + mr*0.06 + FX.beute*0.08) * (CFX.zutweg ? 0.5 : 1) ? 1 : 0);
  if(zCount && mr >= 2 && Math.random() < 0.25) zCount++;
  for(let i=0; i<zCount; i++) dropZutat(m, m.x + rr(-10,10), m.y + rr(-10,10));

  // Performance-Limit. while, nicht if: ein Kill lässt jetzt bis zu 5 Sachen fallen
  // (Gold, Trank, mehrere Zutaten), ein einzelnes shift() hielte die Liste nicht.
  while(drops.length > 90) drops.shift();

  // Portal Event Logic: erscheint zufällig irgendwann zwischen Spieler-Level 5 und 11
  if(currentLevel === 1 && !portal && player.level >= 5){
    // W4: mit laufendem Reise-Aushang ist das Portal ab Stufe 5 garantiert.
    const chance = (player.level >= 11 || (amt.auftrag && amt.auftrag.typ === 'reise')) ? 1
                 : 0.05 + (player.level-5)*0.03;
    if(Math.random() < chance){
      // Immer mit Abstand: früher landete das Portal im Fallback exakt auf dem Spieler,
      // der dann ungefragt im selben Frame ins Schattenland gesogen wurde.
      portal = null;
      for(let a=0; a<12 && !portal; a++){
        const ang = a * (Math.PI/6) - Math.PI/2;
        const cx = player.x + Math.cos(ang)*100, cy = player.y + Math.sin(ang)*100;
        if(walkPx(cx, cy)) portal = {x:cx, y:cy};
      }
      if(!portal) portal = {x: player.x, y: player.y - 100};   // notfalls trotzdem auf Abstand
      addShake(15, 1.0);
      sfx.warp();
      floaters.push({x:portal.x, y:portal.y-40, txt:'SCHATTEN-PORTAL ERSCHIENEN', col:'#c77dff', t:5.0, big:true});
      if(!kn.pending.portal1 && !kn.seen.portal1){ kn.pending.portal1 = true; saveKn(); }
    }
  }

  // Nur der Schattenfürst beendet das Spiel. Der Alte Schrecken bewacht bloß eine
  // Schatzkammer und darf keinen Siegesbildschirm auslösen.
  // MUS.swell() hing bis hierher ohne Aufrufer im Code. Der Bosssieg ist der einzige der drei
  // vorgesehenen Anlässe, der selten genug ist: killMon() läuft hinter dem Tot-Guard in hurtMon()
  // und feuert deshalb höchstens einmal je Boss, der !kammer-Zweig hält den Alten Schrecken raus.
  // Die Vertagung (Entscheidung vom 20.08.2026). Solange die Ausfertigung im
  // Bestand liegt und noch nicht zugestellt werden darf, endet der Kampf-Tod
  // nicht das Spiel: der Fürst ist der Nachtrag zu Vorgang 1, und ein offener
  // Vorgang lässt sich nicht erschlagen. Anlass war GW10 — seit die Zustellung
  // an Akt V hängt, liegen zehn Schichten zwischen "Ausfertigung vollständig"
  // und "Zustellen wird angeboten", und wer den Fürsten in diesem Fenster legt,
  // bekam zwingend den kleineren Ausgang. Der Kampf selbst bleibt unverändert,
  // der Boss stirbt, die Beute fällt; es entfällt allein der Siegbildschirm.
  // Die Zeilen nennen den Zustand, nicht den Weg dorthin: ein Hinweis auf die
  // Zustellung wäre ein Questmarker, siehe den Kommentar an winGame().
  if(m.def.boss && !kammer){
    el('bossbar').style.display='none'; MUS.swell();
    // T4: der einzige Sieg, den dieses Haus kennt. Der Umschlag wird nur
    // vermerkt und faellt spaeter: hier laeuft gerade eine Fanfare, und wer in
    // eine Fanfare hineinspricht, hat die Bremse nicht verstanden.
    anlage2Notiz('bosssieg');
    anlage2Umschlag('ersterBosssieg');
    if(vorgangVertagt()){
      floaters.push({x:m.x, y:m.y-46, txt:VERTAGT_ZEILEN[0], col:'#ff0055', t:4.5, big:true});
      floaters.push({x:m.x, y:m.y-24, txt:VERTAGT_ZEILEN[1], col:'#c9b98a', t:5.0});
      floaters.push({x:m.x, y:m.y-8,  txt:VERTAGT_ZEILEN[2], col:'#c9b98a', t:5.5});
    } else setTimeout(()=>{ if(state==='play') winGame(); }, 2000);
  }
}

// S1: Die Stufenleiter. Vorher 35 * Stufe^1,35 — im Messlauf stand nach drei
// Minuten Stufe 7 und nach fuenf Minuten Stufe 8, ohne dass ein einziger Punkt
// vergeben worden waere. Eine Stufe, die alle zwanzig Sekunden kommt, ist kein
// Ereignis, und was kein Ereignis ist, wird nicht bedient. Jetzt 48 * Stufe^1,6:
// rund die halbe Geschwindigkeit, mit Abstand nach oben wachsend.
const XP_FAKTOR = 48, XP_EXPONENT = 1.6;
const xpFuerStufe = st => XP_FAKTOR * Math.pow(st, XP_EXPONENT);

function gainXP(x){
  player.xp += Math.round(x * (1 + FX.xp*0.2));                      // Wirkung 'Aktenkunde'
  let need = xpFuerStufe(player.level);
  while(player.xp >= need){
    player.xp -= need; player.level++; player.skillPoints += PUNKTE_JE_STUFE;
    // K1: Jeder Aufstieg legt eine Vorlage bereit. Sie draengt nicht: das Panel
    // oeffnet sich nicht von selbst, ein Fenster mitten im Gefecht waere eine
    // Zumutung (Panels halten das Spiel nicht an, s. U1). Gemeldet wird ueber
    // den Floater unten und das Sternchen am Guertel, gewaehlt wird, wann es
    // passt. Mehrere Aufstiege in einem Zug stapeln den Zaehler.
    player.zulagenZiehungen++; zulagenAngebotSicherstellen();
    // Z2: Zauberpunkte gibt es erst mit der Befugnis. Die Punkte der Stufen 2
    // und 3 entfallen ersatzlos (kein Aufsparen): Zauber sind dadurch insgesamt
    // seltener, und das Ultimate rueckt von Stufe 11 auf Stufe 13.
    if(player.level >= ZAUBER_AB_STUFE) player.spellPoints += 1;
    // S1: KEIN Vollheilen mehr. Der Aufstieg war bisher nebenbei ein Gratistrank,
    // und bei einer Stufe alle zwanzig Sekunden war das die eigentliche Heilquelle
    // im Spiel — man konnte sich durch jede Gefahr hindurchleveln. Das Leben
    // bleibt jetzt stehen, wo es steht; der hoehere Deckel macht es relativ
    // sogar weniger. Geheilt wird aus dem Fläschchen, wie bei allen anderen auch.
    recalc();
    floaters.push({x:player.x, y:player.y-30, txt:'STUFENAUFSTIEG', col:'#a855f7', t:1.5, big:true});
    // S1: Der Aufstieg sagt jetzt, was er bringt, und wo es liegt. Der alte
    // Aufstieg meldete nur sich selbst — die zwei Punkte lagen still im
    // Inventar, und der Spielbericht sagt woertlich, dass kaum auffiel, dass
    // es sie gibt.
    floaters.push({x:player.x, y:player.y-52, txt:'+' + PUNKTE_JE_STUFE + ' Befähigungspunkte' + (touchMode ? ' · Rucksack' : ' · [I]'), col:'#f4d97a', t:2.6});
    if(player.level === ZAUBER_AB_STUFE)
      floaters.push({x:player.x, y:player.y-74, txt:'ZAUBERBEFUGNIS ERTEILT', col:'#c77dff', t:3.0, big:true});
    if(player.level >= ZAUBER_AB_STUFE)
      floaters.push({x:player.x, y:player.y-96, txt:'+1 Zauberpunkt', col:'#c77dff', t:1.5});
    // K1: dieselbe Lesart wie die Befaehigungspunkte zwei Zeilen hoeher — sagen,
    // was es gibt, und wo es liegt.
    floaters.push({x:player.x, y:player.y-118, txt:'Zulage zur Wahl' + (touchMode ? ' · Gürtel' : ' · [Z]'), col:'#5ac8ff', t:2.6});
    sfx.level(); addShake(10, 0.4);
    kn.counters.levelUps = (kn.counters.levelUps||0) + 1;
    if(kn.counters.levelUps >= 2) anlage2Notiz('levelup');
    saveKn();
    need = xpFuerStufe(player.level);
  }
}

// U8-Nachtrag: Der rote Rand bei einem Treffer. Er ist die Antwort auf den
// Preis, den das Vollbildmenue am Finger kostet: der Lebensbalken liegt dann
// darunter, die Monster nicht.
//
// Die Staerke haengt an zwei Dingen und nicht an einem. Am Schaden, damit ein
// Kratzer nicht aussieht wie ein Treffer, der die Schicht beendet — und am
// verbliebenen Leben, denn dieselben acht Punkte sind bei 60 eine Notiz und
// bei 9 eine Nachricht. Der Zuschlag bei offenem Fenster kommt oben drauf:
// dort ist der Puls der EINZIGE Kanal, und was allein steht, darf lauter sein.
//
// element.animate() statt einer Klasse: ein zweiter Treffer waehrend des
// ersten bricht die laufende Animation sauber ab (cancel), ohne dass jemand
// einen erzwungenen Umbruch braucht, um sie neu zu starten. Und es steht
// nichts im Renderpfad — der Puls kostet je Treffer, nicht je Bild.
let pulsLauf = null;
function schadensPuls(schaden){
  const e = el('schadensPuls'); if(!e || !e.animate) return;
  const anteil = Math.min(1, schaden / Math.max(1, derived.maxHp));
  const knapp  = player.hp / Math.max(1, derived.maxHp);
  const zugedeckt = panelOffenIrgendwo() ? 0.22 : 0;
  const staerke = Math.min(0.92, 0.26 + anteil * 1.1 + (knapp < 0.3 ? 0.22 : 0) + zugedeckt);
  // Anschlag hart, Abklang lang: so liest sich der Puls als Schlag und nicht
  // als Blinken. Bei "Bewegung reduzieren" bleibt er sichtbar und wird nur
  // ruhiger — eine Warnung wegzulassen waere keine Ruecksicht.
  const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(pulsLauf) pulsLauf.cancel();
  pulsLauf = e.animate(
    [{opacity:0}, {opacity:staerke, offset:ruhig ? 0.25 : 0.08}, {opacity:0}],
    {duration: ruhig ? 620 : 460, easing:'ease-out'});
}

function hurtPlayer(raw){
  if(player.dead) return;
  player.kampfT = 3;      // Fluch 'Nüchternheitsgebot': Kampf sperrt kurz das Trinken
  // Fluch 'Standpflicht': Rüstung wirkt nur, solange man steht
  const armorNow = (CFX.stand && player.moving) ? 0 : derived.armor;
  const red = armorNow/(armorNow+30);
  const bollwerk = FX.bollwerk ? Math.min(0.4, FX.bollwerk*0.08) : 0;   // Wirkung 'Abweisung'
  const d = Math.max(1, Math.round(raw*(1-Math.min(0.6,red))*(1-bollwerk)));
  player.hp -= d; player.hurtT = 0.25;
  addShake(12, 0.2); sfx.hurt(); schadensPuls(d);
  floaters.push({x:player.x, y:player.y-24, txt:String(d), col:'#ffe14d', t:0.8, big:true});
  if(player.hp<=0){
    player.hp=0; player.dead=true;
    // T4: Anlage 2 sagt hier nichts, und das ist die Entscheidung, nicht die
    // Beschraenkung. Zwei Gruende, und der zweite ist der wichtigere:
    // technisch liegt in diesem Moment ein Overlay ueber dem Band und
    // knLineErlaubt() sperrt bei player.dead ohnehin; menschlich redet man
    // niemandem in sein Scheitern hinein. Vermerkt wird der Anlass trotzdem,
    // ausgeliefert beim Wiederantritt (knTick, unten). Das Muster ist
    // kn.pending.feierabend1 aus der Schichtuebergabe, und es traegt hier noch
    // mehr: der Vermerk ueberlebt sogar, wenn jemand den Browser auf dem
    // Feierabendbildschirm schliesst.
    kn.pending.niederlage = true;
    anlage2Umschlag('ersterTod');
    saveKn();
    if(CONFIG.schichtModus){ state='feierabend'; endShift('tod'); }
    else { state='dead'; showDead(); }
  }
}

function drinkPotion(){
  if(state !== 'play' || player.potions<=0 || player.dead || player.hp>=derived.maxHp) return;
  // Fluch 'Nüchternheitsgebot': im Kampf gesperrt, außer unter 30% maxHp (Gnadenklausel,
  // sonst wäre Nachheilen im Notfall unmöglich)
  // Monsterkatalog M1: Faulgasstoß und Siegelstaub sperren das Fläschchen. Anders
  // als der Fluch 'Nüchternheitsgebot' gibt es hier KEINE Gnadenklausel, genau
  // deshalb rechnet der Katalog das Gefahrenbudget dieser beiden Gegner ohne
  // Heilung, und genau deshalb bleiben sie trotzdem im A2-Band.
  if(player.trankSperreT > 0){
    floaters.push({x:player.x, y:player.y-30, txt:'Fläschchen verklebt', col:'#9a8a5f', t:1.2});
    return;
  }
  if(CFX.nuecht && player.kampfT > 0 && player.hp > derived.maxHp*0.3){
    floaters.push({x:player.x, y:player.y-30, txt:'Nicht im Dienst', col:'#9a8a5f', t:0.8});
    return;
  }
  // Fluch 'Verdünnung' halbiert die Heilung, Wirkung 'Nachschlag' spart manchmal den Trank
  if(!(FX.nachschlag && Math.random() < Math.min(0.5, FX.nachschlag*0.16))) player.potions--;
  player.hp = Math.min(derived.maxHp, player.hp + Math.max(15, Math.round(60 * (1 + FX.potion*0.35) * (CFX.duenn ? 0.5 : 1))));
  if(CFX.hektik){ player.hektikT = 3; spawnImpactParticles(player.x, player.y, 14, null); }   // Fluch 'Hektik'
  sfx.potion(); updateHUD();
  kn.counters.traenke = (kn.counters.traenke||0) + 1;
  if(KN_TRAENKE_GAGS[kn.counters.traenke]) knShowLineGated('traenke', KN_TRAENKE_GAGS[kn.counters.traenke]);
  saveKn();
  auftragEreignis('trank');   // W4
}

