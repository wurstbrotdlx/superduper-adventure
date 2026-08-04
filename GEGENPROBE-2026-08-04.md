# Adversariale Gegenprobe zu F10 bis F83

**Prüfstand:** Commit `22c4a73` auf `main`, Arbeitsbaum sauber bis auf untracked `.claude/`. `index.html` rund 8500 Zeilen. Datum 04.08.2026.

**Es wurde nichts geändert, nichts committet, nichts gepusht.** Dieser Bericht ist eine Prüfung, kein Reparaturlauf.

## Warum es diesen Bericht gibt

`ABGLEICH-2026-07-27.md` war zweistufig geplant: erst die Prüfung, dann je Fund eine unabhängige Instanz, die ihn zu widerlegen versucht. Die zweite Stufe ist nie gelaufen. Der Bericht sagt es selbst (`ABGLEICH-2026-07-27.md:441`): „Die adversariale Gegenprobe ist ausgefallen", alle 80 Gegenproben seien am Sitzungslimit gescheitert. Selbst gegengeprüft wurden nur F1 bis F9 plus F10, F24, F25, F26, F28 und F33.

Alles unterhalb von „bricht etwas" stand seither als **Einzelmeldung ohne zweite Meinung** im Repo. Genau diese Lücke schließt dieser Bericht: F10 bis F83, 74 Funde, jeder von einer eigenen Instanz mit ausdrücklichem **Widerlegungsauftrag** gegen den heutigen Code geprüft.

## Ampel

**Der Abgleichbericht hat sich gut gehalten, ist aber zu drei Vierteln überholt.** 57 der 74 Funde beschreiben einen Zustand, den es nicht mehr gibt — die Reparaturrunden R1 bis R9 und die Bauabschnitte W3 bis W7 haben sie abgeräumt, meist ohne dass jemand sie im Bericht abgehakt hätte.

**Vier Funde treffen unverändert zu.** Zwei davon sind Balance- und Wirtschaftsfragen, die eine Entscheidung brauchen, keine Reparatur: die Gold-Doppelbuchung (F19) und die Ausbaukosten (F20). Zwei sind kosmetisch (F53, F74).

**Zwölf Funde sind teilweise berechtigt** — in fast allen Fällen stimmt der Codebefund, aber die Wertung oder eine Nebenbehauptung trägt nicht.

**Ein Fund war schon am 27.07.2026 falsch** (F56): er behauptet, eine Ausnahme sei nirgends dokumentiert, obwohl sie in der damals geprüften Fassung des Plans stand.

Das ist der eigentliche Ertrag dieser Gegenprobe: sie hat nicht nur den Code geprüft, sondern den Bericht. In neun der zwölf „teilweise"-Fälle steckt eine Behauptung, die nie stimmte — falsche Quantifizierungen (F82), ein Schadensfall, den die z-index-Ordnung ausschließt (F10), ein NPC-Zeichenpfad, der schon damals im richtigen Block stand (F64).

## Methodik

15 unabhängige Instanzen, je fünf Funde, ohne Kenntnis der Ergebnisse der anderen. Auftrag war ausdrücklich, den Fund zu **widerlegen**, nicht ihn nachzuerzählen; ein Verdikt „bestätigt" musste mit einer Codestelle belegt werden, die die Behauptung trägt.

Die Zeilennummern im Abgleichbericht sind Stand `073c127`. `index.html` ist seither um rund 1700 Zeilen gewachsen (W3, W4, W5, W6, W2-Serien C-F, Anrede-Nachzug, W7). Alle Instanzen hatten Anweisung, ausschließlich nach Bezeichnern zu suchen. Mehrere haben zusätzlich per `git show` gegen den Berichtsstand (`55d33b7`, `5d7c0b4`, `efe5437`) gegengeprüft, um zwischen „stimmte damals, ist behoben" und „stimmte nie" zu unterscheiden.

**Urteilsvokabular:** **bestätigt** = trifft am heutigen Code unverändert zu · **teilweise** = Codebefund trifft zu, Wertung oder eine Nebenbehauptung nicht · **überholt** = stimmte damals, ist behoben oder der Code existiert nicht mehr · **widerlegt** = stimmte schon 2026-07-27 nicht.

## Zählung

| Verdikt | Anzahl |
|---|---|
| überholt | 57 |
| teilweise | 12 |
| bestätigt | 4 |
| widerlegt | 1 |
| **Summe** | **74** |

Kein Fund blieb unbeurteilt, kein Verdikt lautet „nicht prüfbar".

## Alle 74 Funde

| Nr. | Fund | Verdikt | Schwere heute |
|---|---|---|---|
| F10 | G5-Amtsfenster fehlt in allen Panel-Registern der Phasen 4, 5 und 6 | **teilweise** | kosmetisch |
| F11 | Randnotiz-Anlass untaetigkeit wird nie ausgelöst | überholt | . |
| F12 | Zweiter Steckenbleib-Schubs nach 25 Sekunden ohne Spieleraktion | überholt | . |
| F13 | unequipItem() ruft knCheckFluchEquipped() nicht, Flankendetektor bleibt blind | überholt | . |
| F14 | Knöterichs Kopf steht auch im Jahresgespräch | überholt | . |
| F15 | G0-Manifest falsche Raster bei Gate_anim/Gate_Closed/Pillars, keine Overrides | überholt | . |
| F16 | Waffe und Schild erreichen das Helden-Sprite nicht | **teilweise** | kosmetisch |
| F17 | Fledermaus-Rig aliast alle sieben Anims auf eine Sheet-Zeile | **teilweise** | kosmetisch |
| F18 | UI-Skin macht runde Touch-Knöpfe eckig | überholt | . |
| F19 | Gold-Doppelbuchung: Uebertrag geht gleichzeitig an Folgeschicht und Bank | **bestätigt** | weicht ab |
| F20 | Ausbau-Kosten eine Größenordnung unter den Schichteinnahmen | **bestätigt** | weicht ab |
| F21 | MUS.duck(ms) steht in der Schnittstellenliste, existiert aber nicht | überholt | . |
| F22 | W1 und W2 tragen in keinem Plandokument einen Statusmarker | überholt | . |
| F23 | Drei Planabschnitte beschreiben einen von G5 überholten Zustand | überholt | . |
| F24 | Kammerschild sagt weiterhin KAMMER | überholt | . |
| F25 | Spieltitel in zwei Schreibweisen auf Lade- und Startbildschirm | **teilweise** | kosmetisch |
| F26 | Alter Bossname Abaddon, roter Einblender ABADDON ERWACHT! | überholt | . |
| F27 | Siegesbildschirm winGame() im vor-W1-Register | überholt | . |
| F28 | Vier Gedankenstriche in dauerhaft sichtbaren HUD-Zeichenketten | überholt | . |
| F29 | updateHUD schreibt zwei title-Attribute pro Frame ohne Dirty-Check | überholt | . |
| F30 | tintedSheet() baut pro getöntem Sprite pro Frame einen Cache-Key-String | überholt | . |
| F31 | Dungeon-Sheet-Keys werden pro Frame per Template-Literal zusammengebaut | überholt | . |
| F32 | Zwei Closures werden pro Frame neu allokiert (vis, SPELLS.find) | überholt | . |
| F33 | G5-Amtsfenster zeigt die Schichtnummer um eins zu niedrig | überholt | . |
| F34 | G5-UI-Skin skaliert 16- und 48-px-Pixelkunst ohne pixelated-Rendering | überholt | . |
| F35 | Zonenwechsel wartet bis zu vier Takte, nicht bis zur nächsten Taktgrenze | überholt | . |
| F36 | "Alle Panels dämpfen die Musik" gilt nur für die Overlay-Screens | überholt | . |
| F37 | Die Dorf-Gebäude überragen die Cull-Ränder | überholt | . |
| F38 | Gebäude-Fußabdrücke ragen als andersfarbige Rechtecke unter den Häusern hervor | überholt | . |
| F39 | Der gebackene Boden ist ein regelmäßiges Schachbrett, nicht gestreut | überholt | . |
| F40 | Zwei Wege ins Amt mit unterschiedlichem Funktionsumfang | überholt | . |
| F41 | Math.hypot läuft an sechs Stellen im Frame-Pfad | überholt | . |
| F42 | G1-Abnahme verweist auf eine nicht existierende Zusicherungs-Suite | überholt | . |
| F43 | Manifest hat keine Anim-Zuordnung (885 von 886 anims: null) | überholt | . |
| F44 | .gitignore und Plan widersprechen sich beim Pages-Build | überholt | . |
| F45 | stats.goldTotal deklariert und nie gelesen | überholt | . |
| F46 | shiftElapsedT hochgezählt, nie gelesen | überholt | . |
| F47 | stats.kills ohne Reset und ohne Persistenz | **teilweise** | kosmetisch |
| F48 | MUS.swell() ohne Aufrufer | überholt | . |
| F49 | Zonenwechsel duckt auch ohne Zonenwechsel | überholt | . |
| F50 | initAudio() trägt Muffle-Zustand nicht in den frischen Lowpass ein | überholt | . |
| F51 | shadowland.scale äolisch statt phrygisch | überholt | . |
| F52 | fluchRuht bleibt an abgelegten Stücken stehen | **teilweise** | kosmetisch |
| F53 | Kammer-Verlassen über die Kontextaktion zählt nicht als Abbruch | **bestätigt** | kosmetisch |
| F54 | knRandnotiz() zieht den Textpool vor dem Zeitvergleich | überholt | . |
| F55 | knAssertCaps() dupliziert Beat- und Steckenbleib-Literale | **teilweise** | kosmetisch |
| F56 | Regler stummt den Dienstzettel-Sting, angeblich undokumentiert | widerlegt | . |
| F57 | Emoji-Kopf ohne Stempel, Kanäle nur durch italic unterschieden | überholt | . |
| F58 | Knöterichs vierte Namensform 'Amt für Monsterangelegenheiten' | überholt | . |
| F59 | Blut- und Sterbe-Vokabular in 'Blutmagie' und 'zerplatzer' | überholt | . |
| F60 | Totenkopf-Emoji und senkrechter Strich im Schattenland-HUD | überholt | . |
| F61 | Zonen-HUD-Zweig 'Dorf' ohne amtliche Bezeichnung | überholt | . |
| F62 | 'Level' und 'Stufe' nebeneinander in AUSBAU_DEFS und im #zone-Ladezustand | überholt | . |
| F63 | Kommentar am Level-1-Zeichenblock zählt drei statt fünf Dinge auf | überholt | . |
| F64 | Dorf im Schattenland in Tagfarben, NPCs angeblich ohne Level-Prüfung gezeichnet | **teilweise** | kosmetisch |
| F65 | Kommentar über KAM_WAECHTER nennt sieben Typen, Array hat sechs | überholt | . |
| F66 | AFFIXES.fmt ist toter Code seit der Tooltip-Umstellung | überholt | . |
| F67 | Lokales kn in hurtMon beschattet das globale Knöterich-Objekt | überholt | . |
| F68 | walk-Animation des Helden wird gebacken, aber nie gezeigt | überholt | . |
| F69 | Druckplatten laden die statische PNG statt der im Plan genannten _Anim-Datei | überholt | . |
| F70 | Set-Mapping-Abweichung steht längst an der Planzeile | überholt | . |
| F71 | CREDITS.md: unbenutzte Packs raus, Zeile-3-Vorwurf war ein Denkfehler | überholt | . |
| F72 | Minimap-Glättung bestätigt, aber nicht alle übrigen Kontexte stehen auf false | **teilweise** | kosmetisch |
| F73 | Alle sechs Renderpfad-Allokationen sind seit R6 beseitigt | überholt | . |
| F74 | Zahl im Zutaten-Tooltip steht unverändert, Item-Tooltip weiterhin zahlfrei | **bestätigt** | kosmetisch |
| F75 | Ausbau "Vermutungen" gibt Kesselgrammatik preis, Ausgabe angeblich immer korrekt | **teilweise** | kosmetisch |
| F76 | Weltbibel verbietet Minimap-Marker, die Wirkung Aktenlage zeichnet | überholt | . |
| F77 | Kommentar an zutatenMitnahmeBasis spricht von Stapeln statt Stücken | überholt | . |
| F78 | Drei unvereinbare Statusmarker-Konventionen, kein Ort mit dem Gesamtstand | überholt | . |
| F79 | Regel "ein Commit pro Phase" systematisch abgewichen | überholt | . |
| F80 | docs/index.html als 1,34-MB-Base64-Blob in der History | überholt | . |
| F81 | serve.py gitignored, kein README, kein LICENSE | **teilweise** | kosmetisch |
| F82 | Vier von 15 Commits ohne Co-Authored-By-Trailer | **teilweise** | kosmetisch |
| F83 | W1-Abnahmeliste ortsbasiert, showLoading übersehen, F24 offen | überholt | . |

## Die siebzehn Funde, die nicht einfach überholt sind

#### F10 · G5-Amtsfenster fehlt in allen Panel-Registern der Phasen 4, 5 und 6

**Verdikt:** **teilweise** (kosmetisch)

Der Kern ist überholt: alle drei Flag-Listen führen heute amtFensterOpen (3947, 4147, 1596), und amtFensterOeffnen ruft MUS.muffle(). Weiter zutreffend ist nur, dass knIdleT beim Oeffnen nicht genullt wird (anders als 5328 Inventar, 3559 Zauberbaum, 5651 Kessel) - schlossAuf (5049) tut das allerdings ebenfalls nicht, das Vorbild ist also nicht einheitlich. Zwei Teilbehauptungen waren schon 2026-07-27 falsch: die Schichtuhr war nie eine Liste der vier Flags, sie prüft seit jeher nur !kampfNah && !kammer && !schlossOpen (55d33b7:4718), und der Schadensfall Dienstzettel knallt über das Panel existiert nicht, #knZettel liegt auf z-index 12, #amtFenster auf 22.

*Beleg:* index.html:3947 (knSperrzone), index.html:4147 (knNachfragen), index.html:1596 (MUS.muffle-Liste), index.html:4997-5003 (amtFensterOeffnen), index.html:5760 (Schichtuhr-Guard), index.html:168 gegen index.html:212 (z-index); Gegenprobe 55d33b7:index.html:4718

#### F16 · Waffe und Schild erreichen das Helden-Sprite nicht

**Verdikt:** **teilweise** (kosmetisch)

Der Codebefund trifft unverändert zu: bakeHeroSheet kennt nur armor und boots, der Waffen-Slot bleibt ein einziges getintetes Iron_Sword-Sprite, der Schild ein fillText-Emoji. Falsch ist die Zuspitzung des Titels "ändern den Helden gar nicht" — beide Slots erzeugen sichtbare, an player.x/y gekoppelte Elemente, deren Größe und Leuchten mit der Stufe skalieren (index.html:6529, :6544); nicht geändert wird das Helden-Sprite, nicht das Bild. Der eigentliche Mangel des Fundes, die zu viel versprechende Abnahmeformulierung, ist behoben: superduper-grafik-prompt.md:129 beschreibt die Slot-Tiefen jetzt einzeln und markiert die Richtigstellung mit R8/F16.

*Beleg:* index.html:953-983 (bakeHeroSheet backt nur legs/feet/body/chest/hair/hands, dirtyKey nur aus armorTier|bootsTier|hair), index.html:6514-6547 (Waffe = schwebendes 'cftool_sword' für alle drei Gattungen, Schild = ctx.fillText mit sh.base.icon), superduper-grafik-prompt.md:129 und :348

#### F17 · Fledermaus-Rig aliast alle sieben Anims auf eine Sheet-Zeile

**Verdikt:** **teilweise** (kosmetisch)

Der technische Kern gilt unverändert: Halloween/Bat.png ist eine Zeile, alle sieben Anim-Keys zeigen auf [0,6], es gibt weder eigene Angriffs- noch Hurt- noch Death-Pose; dasselbe gilt für slime/shadow, wo hurt und death auf Zeile 3 zusammenfallen (index.html:670-675). Widerlegt ist der Grund, aus dem der Fund zählte: der Kompromiss ist inzwischen sauber nachgetragen — die G3-Abnahme superduper-grafik-prompt.md:145 nennt bat und slime/shadow ausdrücklich als Ausnahmen mit R8/F17-Marker, und :497-502 begründet, warum der vom Bericht vorgeschlagene flying_skull verworfen wurde (zerberstende Schädel-Bruchstücke widersprechen Name, Drop 'Fledermausflügel' und Weltbibel-Eintrag). Der Codekommentar index.html:682-686 trägt dieselbe Begründung.

*Beleg:* index.html:681-687 (CF_RIGS.bat, anims idle/walk/run/attack/cast/hurt/death alle [0,6]), index.html:3128 (MONDEF.bat rig:'bat'), superduper-grafik-prompt.md:145 und :497-502

#### F19 · Gold-Doppelbuchung: Uebertrag geht gleichzeitig an Folgeschicht und Bank

**Verdikt:** **bestätigt** (weicht ab)

Unverändert: derselbe carryGold-Betrag wird in aufeinanderfolgenden Anweisungen zweimal verbucht — einmal als Startguthaben der Folgeschicht (über pendingCarryGold, eingelöst in :6904) und einmal auf amt.bankGold. In Summe überleben 100 Prozent, obwohl goldUebertragAnteil 0.5 heisst, und der Bericht beschriftet das weiterhin als "Beuteanteil nach Abzug". Neu hinzugekommene Einnahmen (Auftragslohn, index.html:8614-8615) gehen an der Bank vorbei am selben Muster nichts ändern. Nicht tragfähig ist das dritte Nebenargument des Berichts, player.gold habe während der Schicht keine Ausgabestelle: die Flüche 'Verwaltungsgebühr' (index.html:3622) und 'Goldschwund' (:5795-5797) ziehen laufend ab — und beide standen schon in 073c127 (dort Zeilen 2972 und 4899), der Denkfehler war also bereits am 27.07. einer.

*Beleg:* index.html:6952 (const carryGold = Math.round(player.gold * CONFIG.goldUebertragAnteil), CONFIG.goldUebertragAnteil = 0.5 in :3711), index.html:6963-6964 (pendingCarryGold = carryGold; amt.bankGold += carryGold), index.html:6904 (player.gold = pendingCarryGold + bonusStartGold), index.html:7000 ("Beuteanteil nach Abzug")

#### F20 · Ausbau-Kosten eine Größenordnung unter den Schichteinnahmen

**Verdikt:** **bestätigt** (weicht ab)

Jede Einzelzahl des Fundes trägt am heutigen Code unverändert: Vollausbau 3850 (1800+1650+240+100+60), erste Kaufrunde aller fünf Posten 40+30+80+100+60 = 310, Truhen-EV 240, sechs gleichzeitig offene Türen bei 120s Nachwachszeit gegen 900s Schicht. Es gibt weiterhin keine einzige weitere Goldsenke: die drei Vorkommen von 'bankGold -=' sind genau buyAusbau, buyVermutungen und buyStartfluch, 'player.gold -=' existiert nirgends. W4 hat die Lage sogar verschärft statt entschärft, weil auftragZahle() pro Schicht zusätzlich 150 bis 400 Gold direkt in die Bank bucht (und laut Kommentar bewusst am 50-Prozent-Abzug vorbei). Einzige Abschwächung: die Folgerung 'der Dorf-Hub ist tot' gilt so nicht mehr, W3 bis W7 haben dem Dorf Inhalt gegeben, der nicht an Gold hängt. Die Behauptung des Titels bleibt davon unberührt, ebenso 'im Plan als Schätzung markiert' (superduper-gameplay-prompt.md:246).

*Beleg:* index.html:6861-6868 (AUSBAU_DEFS: startLevel max 9 cost 40*(l+1) = 1800, kontingent max 10 cost 30*(l+1) = 1650, tueren max 2 cost 80*(l+1) = 240); index.html:7784-7785 (buyVermutungen, 100) und index.html:7788-7789 (Startfluch, 60) -> Vollausbau 3850; index.html:4489-4490 (rri(40,80)*(1+k.diff)) mit index.html:4210 wuerfleTuer t.diff=rri(1,5) -> EV 60*4 = 240; index.html:3707-3710 (kammerTueren 2, kammerNachwachsen 120, schichtDauer 900); index.html:4230-4231 (drei Bänder x CONFIG.kammerTueren = 6 Türen); index.html:8613-8614 (amt.bankGold += a.lohn) mit index.html:7915 (auftragLohn 150..400); index.html:7010 (Jahresgespräch erst bei amt.schichten % 10 === 0)

#### F25 · Spieltitel in zwei Schreibweisen auf Lade- und Startbildschirm

**Verdikt:** **teilweise** (kosmetisch)

Der Codebefund stimmt unverändert: showLoading() und showStartScreen() schreiben nacheinander in dasselbe #ovPanel, einmal zusammen, einmal getrennt. Der gemeldete Mangel ist jedoch überholt, denn genau dieser Zustand wurde zu F25 entschieden und in den Quellen nachgezogen (Startbildschirm zählt als gesetztes Logo, Ladebildschirm und Tab schreiben zusammen); der beanstandete Quellenwiderspruch existiert nicht mehr. Neu und nicht vom Bericht erfasst: die mit W6 hinzugekommene Urkunde trägt in index.html:7108 die getrennte Form in einem Fließtext-Spielstring, was weltbibel:868 verbietet und von der Logo-Ausnahme nicht gedeckt ist.

*Beleg:* index.html:6 (<title>Das Monstralministerium</title>), index.html:8986 (showLoading: <h1>Das Monstralministerium</h1>), index.html:6763 (showStartScreen: <h1>DAS MONSTRAL MINISTERIUM</h1>), index.html:7108 (RANG_URKUNDE: 'Gemäß Geschäftsordnung des Monstral Ministeriums'), superduper-weltbibel.md:868, phase-w1-terminologie.md:23, superduper-reparatur-prompt.md:56

#### F47 · stats.kills ohne Reset und ohne Persistenz

**Verdikt:** **teilweise** (kosmetisch)

Die beiden Tatsachenbehauptungen stimmen unverändert: stats.kills wird nirgends zurückgesetzt und nirgends gespeichert. Die Wertung dagegen trägt nicht. Der Vergleich mit F1 (angekündigter Dauerbonus geht beim Reload verloren) greift nicht, weil bei stats.kills nichts Dauerhaftes zugesagt ist und beide Konsumenten genau einen Sitzungs-/Lifetime-Zähler wollen: die per-Schicht-Zahl im Dienstbericht kommt aus shiftKillsTotal, und der Knöterich-Beat beat2 ist über das persistierte kn.beats ohnehin einmalig. Die als Fix vorgeschlagene Reset-Zeile in startShift() würde keinen sichtbaren Wert korrigieren.

*Beleg:* Zutreffend: index.html:2950 (Deklaration), :3360 (`stats.kills++`), startShift() index.html:6881-6943 enthält keinen Reset, kein saveAmt/saveKn/saveKladde serialisiert `stats`. Nicht zutreffend (kein Schaden): Schichtbericht liest shiftKillsTotal (index.html:6997, Reset :6926), showDead()/`Monster erledigt: ${stats.kills}` (index.html:6771, :6776) ist bei CONFIG.schichtModus=true (index.html:3709) unerreichbar, weil hurtPlayer bei hp<=0 nach endShift('tod') verzweigt (index.html:3480). Einziger echter Leser: der Lifetime-Gate kn.beats.beat2 (index.html:4113).

#### F52 · fluchRuht bleibt an abgelegten Stücken stehen

**Verdikt:** **teilweise** (kosmetisch)

Zwei der drei Ablegepfade sind inzwischen repariert und tragen sogar den Kommentar 'Budget-Flag gilt nur im Equip-Slot, nicht in der Tasche'. Der vierte Equip-Schreiber, den der Kommentar bei index.html:4061-4064 selbst als 'Rechtsklick-Ablegepfad in renderInventory()' aufführt, wirft das getragene Stück direkt auf den Boden und setzt fluchRuht nicht zurück; recalc() danach iteriert nur noch über player.equip und erreicht das Stück nicht mehr (index.html:2976-2990). Nach dem Aufheben behauptet der Tooltip für dieses Stück weiter 'Dieser Fluch ruht'. Mechanisch weiter harmlos, weil CFX in recalc() vollständig genullt wird.

*Beleg:* behoben: index.html:5343 (equipItemFromBag setzt currentEquipped.fluchRuht=false) und index.html:5353 (unequipItem setzt item.fluchRuht=false). Offen: index.html:5379 (Rechtsklick-Ablegepfad im Equip-Slot: player.equip[key]=null; dropItemToFloor(item); recalc(); ohne fluchRuht-Reset), Falschaussage sichtbar über index.html:5279 in buildTooltip, das den Hinweis unabhängig von isEquipped rendert

#### F53 · Kammer-Verlassen über die Kontextaktion zählt nicht als Abbruch

**Verdikt:** **bestätigt** (kosmetisch)

Der Sachverhalt ist am heutigen Code unverändert: fuehreAktion() ruft bei AKT_AUSGANG direkt verlasseKammer(), der Zähler hängt allein an knAbbruchKammer (Exit-Knopf index.html:5724 und Escape-Pfad index.html:8732). kn.counters.kammerAbbrueche zählt also weiterhin nur das ausdrückliche Aufgeben. Neu ist ein Kommentar in index.html:5712-5717, der das als bewusst akzeptierte Abweichung mit Begründung festhält (sonst feuerte MUS.sting('spitz') bei fast jedem beutelosen Ausstieg). Wirkung bleibt kosmetisch, weil kammerAbbrueche ausser der Initialisierung in index.html:3763 und dem Inkrement keinen Leser hat.

*Beleg:* index.html:4918 (case AKT_AUSGANG: verlasseKammer(); break;) gegen index.html:5709-5722 (knAbbruchKammer erhöht kn.counters.kammerAbbrueche); Ausgangsrune und geöffnete Truhe bieten die Aktion an: index.html:4900-4902

#### F55 · knAssertCaps() dupliziert Beat- und Steckenbleib-Literale

**Verdikt:** **teilweise** (kosmetisch)

Die Hauptbehauptung trägt weiter: die sechs Zeilenpaare stehen unverändert als handkopierte Zweitfassung im Rumpf, Beat 1 sogar dreifach (Assert, Blase 4098/4099, Fallback 4118). Ein Skriptabgleich aller 17 Literale aus 3877-3882 gegen den Rumpf ergibt 17x identisch, kein Drift, kein Deckelverstoß. Überholt ist der Nebensatz zum Rekord-Suffix: das prüft seit dem Anrede-Nachzug anredeAssert() bei 7455-7476 mit, und knAssertCaps begründet die Auslassung dort jetzt ausdrücklich (TDZ-Falle). Der Jahresgespräch-Satz ('Ich habe alles mitgeschrieben.', index.html:7764) ist weiterhin nicht abgedeckt, ist aber Panel-Freitext ohne Deckel. Zusatzbefund: die Schichtbegrüßungs-Zeile bei 3902 prüft heute nur noch den letzten Notfallboden, den anredeAssert bei 7469 ausdrücklich verbietet.

*Beleg:* index.html:3873-3910 (knAssertCaps); Handkopien 3877 vs. 4098/4099 und 4118, 3878 vs. 4114, 3879 vs. 4116, 3880 vs. 3962, 3881 vs. 3964, 3882 vs. 3966, 3902 vs. 4052; Gegenbeleg zur Nebenbehauptung: index.html:3894-3897 (Kommentar) und 7455-7476 (anredeAssert prüft knBegruessungLine inkl. Rekord-Suffix über 0/99 und beide Giesskannen-Zustände)

#### F56 · Regler stummt den Dienstzettel-Sting, angeblich undokumentiert

**Verdikt:** widerlegt

Die Reglerprüfung am Sting ist kein Widerspruch zu gameplay:411, sondern genau das, was der Plan im Stinger-Abschnitt (552) und in der Abnahme Phase 6 ('schweigt bei Reglerstellung Schweigt') verlangt; 411 regelt den Zettel selbst, der auch bei 'schweigt' erscheint, nur lautlos. Die Aussage 'nirgends dokumentiert' war damit schon am 27.07. falsch, denn gameplay:552 stand in der geprüften Fassung bereits so da. Inzwischen ist die Ausnahme zusätzlich im Code kommentiert (4188-4191, mit Verweis 411 gegen 552). Es bleibt kein Fund übrig.

*Beleg:* superduper-gameplay-prompt.md:552 (schon in der Fassung von efe5437, per git show geprüft): 'Sting prüft selbst muffled ... und kn.regler !== schweigt'; Abnahme Phase 6 ebd.:556; Code: index.html:3972; Kommentar heute index.html:4188-4191

#### F64 · Dorf im Schattenland in Tagfarben, NPCs angeblich ohne Level-Prüfung gezeichnet

**Verdikt:** **teilweise** (kosmetisch)

Der Gebäude-Teil stimmte: am Berichtsstand rief der else-Zweig drawSprite ohne Tint auf, big-Decos blieben im Schattenland in Tagfarben. Heute übergibt derselbe Zweig für `currentLevel === 2 && o.big` den Tint '#4a1866' bei 0.72 — behoben. Der NPC-Teil war schon am 27.07.2026 falsch: die vom Bericht selbst zitierte Zeile :5212 (`for(const n of npcs) … pushDraw(n.y, DRAW_NPC, n)`) steht innerhalb von `if(currentLevel === 1){`, exakt im selben Block wie der Knöterich-Eintrag, den der Bericht als 'korrekt ausgeblendet' bezeichnet — beide sind gleich gegated, ein 'volles Dorf samt Bewohnern' war nie sichtbar. Zutreffend bleibt nur, dass die Wanderlogik (index.html:6110, damals :5057) ohne Level-Prüfung weiterläuft; das ist unsichtbar und rein Rechenzeit.

*Beleg:* Gebäude-Teil überholt: index.html:6293-6303 (`(currentLevel === 2 && o.big) ? '#4a1866' : null, 0.72`), Fix in 37d7324 (r8), vorher 5d7c0b4:index.html:5234-5238 ohne Tint-Argument. NPC-Teil widerlegt: index.html:6273-6275, am Berichtsstand identisch 5d7c0b4:index.html:5210-5212

#### F72 · Minimap-Glättung bestätigt, aber nicht alle übrigen Kontexte stehen auf false

**Verdikt:** **teilweise** (kosmetisch)

Der Kern trifft zu: `bakeMinimap()` ist die einzige Stelle, die Glättung einschaltet, der Anzeigepfad `renderMinimap()` bleibt auf false, und ein erklärender Halbsatz fehlt bis heute (R6 hat F72 bewusst unter 'ausdrücklich nicht anfassen' geführt). Die Nebenbehauptung 'alle übrigen Kontexte stehen auf false' stimmt nicht: drei der acht 2D-Kontexte (index.html:896 Tint-Backer, :964 und :995 Helden-/Ausweis-Backer) setzen das Flag gar nicht und laufen damit auf dem Default true - harmlos, weil sie 1:1 ohne Skalierung blitten, aber die Aufzählung im Bericht ist so nicht richtig.

*Beleg:* index.html:6683 (`c.imageSmoothingEnabled = true`) und :6689 (Anzeigepfad false); false gesetzt an :1048, :2006, :2049, :2088, :5678; ohne jede Setzung: :896, :964, :995

#### F74 · Zahl im Zutaten-Tooltip steht unverändert, Item-Tooltip weiterhin zahlfrei

**Verdikt:** **bestätigt** (kosmetisch)

Beide Hälften der Beobachtung treffen am heutigen Code zu. `buildZutatTooltip()` schreibt die Bestandsmenge weiter aus (index.html:5297), und `buildTooltip()` für Ausrüstung enthält keine einzige sichtbare Zahl: gezeigt werden nur SLOT_DE, RARITY-Name, der Zusatz 'Unikat', `wk.satz[...]`, `fd.satz` und `a.def.satz` - `item.effect.stufe` dient ausschliesslich als Array-Index. Kein Verstoss, nur der vom Bericht gewünschte Merkposten, dass die Zahl Absicht ist.

*Beleg:* index.html:5297 (`· ${z.count} im Beutel` in buildZutatTooltip); index.html:5267-5288 (buildTooltip)

#### F75 · Ausbau "Vermutungen" gibt Kesselgrammatik preis, Ausgabe angeblich immer korrekt

**Verdikt:** **teilweise** (kosmetisch)

Der Kern trifft heute unverändert zu: der gekaufte Ausbau listet für jedes nie gekochte Adjektiv Wirkung und Fluch direkt aus ZUTAT_ADJ, und die Wertung "kein Verstoss, weil bezahlter Phase-4-Ausbau" bleibt richtig. Falsch ist die Nebenbehauptung "die Ausgabe ist immer korrekt": die Vermutung zeigt stets d.fl, während das Brauen ab Stufe 2 bei sieben der 26 Adjektive den Zweitfluch d.fl2 einsetzt (empört, glühend, frisch gestempelt, ausschweifend, pedantisch, amtlich beglaubigt, feierlich). Für diese Fälle ist das Wort "vermutlich" keine blosse Absicherung, sondern sachlich verdient. Der Nebensatz "die 18 Blätter sind sauber" ist zahlenmäßig überholt (heute 48, index.html:2832), inhaltlich aber weiter richtig: keines der Blatt-Texte nennt eines der 26 Adjektive.

*Beleg:* index.html:5559-5570 (Vermutungen-Block, unverändert), index.html:5485 (fluchKey = stufe>=2 && ad.fl2 ? ad.fl2 : ad.fl), index.html:2413,2415,2421,2422,2423,2424,2426 (sieben Adjektive mit fl2), superduper-reparatur-prompt.md:233 (F75 ausdrücklich als kein Handlungsbedarf abgelegt)

#### F81 · serve.py gitignored, kein README, kein LICENSE

**Verdikt:** **teilweise** (kosmetisch)

Der Kern des Fundes ist behoben: serve.py liegt im Repo, der Ignore-Eintrag ist weg, und die von F81 vermisste Startanleitung steht seit 22c4a73 in der README, die genau auf serve.py verweist. Einzig der Nebensatz zum fehlenden LICENSE trifft am heutigen Stand noch zu.

*Beleg:* serve.py ist getrackt (`git ls-files serve.py`, hinzugefügt in 7444d93 als R4-Nachzug zu F81); .gitignore:1-25 enthält keine serve.py-Zeile mehr; README.md existiert und nennt `python3 serve.py` samt Port-Aufruf http://localhost:8378/adventure/ (README.md:13-19). Weiterhin offen: `git ls-files | grep -i licen` liefert nichts, es gibt kein LICENSE im Root

#### F82 · Vier von 15 Commits ohne Co-Authored-By-Trailer

**Verdikt:** **teilweise** (kosmetisch)

Die vier namentlich genannten Commits stimmen und tragen den Trailer bis heute nicht. Die Rahmung stimmt nicht: weder waren es 15 Commits noch war der Trailer sonst durchgängig, sechs ältere Phasencommits fehlten schon damals, und die Lücke reisst nach dem Bericht mit ad72e37 erneut auf. Auch die Schlussfolgerung 'nicht reparabel ohne History-Rewrite' ist überholt, denn ein Rewrite hat faktisch stattgefunden (docs/-Purge, 1b47e8e wurde zu 5d7c0b4), ohne dass dabei Trailer nachgezogen wurden.

*Beleg:* 6c116d0, 4864154, b4a6bef, 116d164 sind vom HEAD erreichbar und haben keinen Co-Authored-By-Trailer (bestätigt). Falsch ist die Quantifizierung: beim Berichtscommit 55d33b7 hatte das Repo 37 Commits, davon 10 ohne Trailer (zusätzlich 3ac94dd, 7dcf819, 34f6096, 011e23b, 55236b8, 9633b8c). Heute 12 von 60, neu dazugekommen ad72e37 (W6)


## Die 57 überholten Funde

F11, F12, F13, F14, F15, F18, F21, F22, F23, F24, F26, F27, F28, F29, F30, F31, F32, F33, F34, F35, F36, F37, F38, F39, F40, F41, F42, F43, F44, F45, F46, F48, F49, F50, F51, F54, F57, F58, F59, F60, F61, F62, F63, F65, F66, F67, F68, F69, F70, F71, F73, F76, F77, F78, F79, F80, F83

Sie werden hier nicht einzeln ausgeführt. Wer einen davon wieder aufmachen will, findet die Begründung im Journal des Prüflaufs; die Kurzfassung steht in der Tabelle oben. Der gemeinsame Nenner: R1 bis R9 haben deutlich mehr abgeräumt, als die Reparaturdokumente behaupten, und die Bauabschnitte W3 bis W7 haben nebenbei weitere Funde erledigt, ohne sie zu benennen.

## Vorschlagsliste

### Entscheiden, nicht reparieren

**F19, Gold-Doppelbuchung.** `endShift()` verbucht denselben `carryGold`-Betrag zweimal: einmal als Startguthaben der Folgeschicht, einmal auf `amt.bankGold`. In Summe überleben 100 Prozent, obwohl die Konstante `goldUebertragAnteil` 0.5 heißt und der Plan von „Beuteanteil nach Abzug" spricht. Das ist kein Bug im engeren Sinn, sondern eine Zusage, die der Code großzügiger auslegt als der Text. Zwei saubere Auflösungen: entweder die Doppelbuchung ist gewollt, dann muss die Konstante anders heißen und der Plan es sagen, oder sie ist es nicht, dann ist es eine Zeile.

**F20, Ausbaukosten.** Der komplette Ausbau aller fünf Posten kostet 3850 Gold, die erste Kaufrunde 310. Es gibt weiterhin keine einzige weitere Goldsenke; W4 hat die Lage verschärft, weil der Auftragslohn an der Bank vorbei direkt auf `amt.bankGold` geht. Das ist eine Balance-Entscheidung, keine Reparatur, und sie hängt an der Frage, ob das Spiel überhaupt Knappheit will.

### Billig mitnehmen

**F81, `LICENSE`.** Der einzige Rest des Fundes. `serve.py` ist getrackt, die README existiert seit `22c4a73`. Eine Rechtsentscheidung, keine Textarbeit.

**F75, Vermutungen zeigen den falschen Fluch.** Der Ausbau listet stets `d.fl`, während das Brauen ab Stufe 2 bei sieben von 26 Adjektiven `d.fl2` einsetzt. Für diese sieben ist die bezahlte Vermutung schlicht falsch. Der Fund hat das nicht bemerkt, die Gegenprobe schon.

**F52, `fluchRuht` am Rechtsklick-Ablegepfad.** Zwei der drei Ablegepfade sind repariert und tragen sogar einen Kommentar dazu. Der vierte Equip-Schreiber, den derselbe Kommentar selbst auflistet, wurde vergessen.

**F82, fehlende Commit-Trailer.** Die vier genannten Commits stimmen, die Rahmung nicht. Die Lücke ist nach dem Bericht mit `ad72e37` erneut aufgerissen. Wenn der Trailer eine Regel sein soll, gehört er in einen Hook, nicht in die Disziplin.

### Nicht anfassen

F53 und F74 sind bestätigt und kosmetisch, beide inzwischen im Code kommentiert und damit bewusste Abweichungen. F10, F16, F17, F25, F47, F55, F64 und F72 sind teilweise berechtigt, aber ihr berechtigter Teil ist jeweils dokumentiert oder folgenlos. F56 ist widerlegt und sollte im Abgleichbericht als solcher markiert werden.

## Ungeprüft

Dieser Bericht prüft ausschließlich F10 bis F83. **Nicht** Gegenstand: F1 bis F9 (im Juli behoben und damals gegengeprüft), die 15 Funde aus `ZUSAGEN-BILANZ-2026-08-04.md`, sowie alles, was seit dem 27.07.2026 neu gebaut wurde — W3, W4, W5, W6, der Anrede-Nachzug und W7 haben ihre eigenen Phasendokumente mit eigener Abnahme, aber keine unabhängige Gegenprobe.

Statische Prüfung am Quelltext. Nicht gemessen: Bank-Balance im echten Spielverlauf, Frame-Budget, GitHub-Pages-Livestand, Touch-Optik am Gerät, Audio-Wahrnehmung.
