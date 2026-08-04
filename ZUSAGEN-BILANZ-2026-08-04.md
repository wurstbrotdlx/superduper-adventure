# Zusagen-Bilanz, 04.08.2026

**190 nachrechenbare Zusagen aus sechs Plandokumenten einzeln gegen `index.html` geprüft, Stand `073c127` (Arbeitsbaum sauber).**
**16 weichen ab, 6 sind nicht statisch prüfbar, 3 betreffen offene Bauabschnitte. 165 stimmen.**
Kein einziger Fund liegt im Code. Alle 16 Abweichungen sind veraltete oder in sich widersprüchliche Planangaben, elf davon als direkte Folge der Reparaturphasen R1 bis R9, die den Code korrigiert und die Plandateien nicht nachgezogen haben. Der teuerste Posten ist nicht eine falsche Zahl, sondern eine Falle, die der Plan als bestehend beschreibt, obwohl sie seit R2 behoben ist.

---

## Lesehilfe

Fundort-Kürzel: `gameplay:N` = `superduper-gameplay-prompt.md`, Zeile N. Ebenso `grafik:`, `weltbibel:`, `w1:` (`phase-w1-terminologie.md`), `w2:` (`phase-w2-aktenfunde.md`), `blaetter:` (`blaetter-serie-a-b.md`). Alle `index.html`-Zeilen sind selbst gelesen, nicht aus `ABGLEICH-2026-07-27.md` übernommen.

Urteile: **stimmt** · **weicht ab** · **nicht auffindbar** · **überholt** (spätere Phase hat bewusst ersetzt) · **nicht prüfbar**.

Nachgerechnet wurde mit Node gegen die aus `index.html` extrahierten Tabellen (Auswertung im `vm`-Kontext, keine Schätzung): Tabellenlängen gezählt, Summen gebildet, Textgleichheit zeichenweise verglichen, Zeichendeckel unabhängig von `knAssertCaps()` neu berechnet, PNG-Maße direkt aus den IHDR-Kopfdaten der Dateien in `assets/cf/` gelesen.

---

## Z1: Kessel-Grammatik, Gameplay Phasen 1 bis 3

| Zusage | Fundort im Plan | Erwartet | Gefunden | index.html | Urteil |
|---|---|---|---|---|---|
| `ZUTAT_NOUNS` Länge | gameplay:92 | 21 | 21 | 1958 | stimmt |
| `ZUTAT_ADJ` Länge | gameplay:174 | 26 | 26 | 2047 | stimmt |
| `WIRKUNG` Länge | gameplay:174 | 24 | 24 | 1990 | stimmt |
| `FLUCH` Länge | gameplay:153, 174 | 24 | 24 | 2098 | stimmt |
| `CRAFT_BASE` Aufbau | gameplay:92 | 4 Slots x 5 Stufen | 4 x 5, alle 20 mit `name` und `icon` | 2127 | stimmt |
| Seltenheitsstufen mit Farbe | gameplay:72 | 5 Stufen | 5, je `name`+`col` (Gewöhnlich bis Einzigartig) | 1907 | stimmt |
| Qualität = Summe der Seltenheiten | gameplay:72 | Summe der drei Zutaten | `qual = zutatRar(0)+zutatRar(1)+zutatRar(2)` | 4640 | stimmt |
| Stufenabbildung der Summe | (kein Planwert) | Ermessen | `qual<=1:0, <=3:1, <=5:2, <=8:3, sonst 4` | 4641 | stimmt |
| Slot = häufigstes Substantiv | gameplay:70 | ja | `topNoun` per Zählung | 4618 bis 4625 | stimmt |
| Gleichstand entscheidet die seltenste Zutat | gameplay:70 | ja | `if(nTie) topNoun = rarest.noun` | 4624 | stimmt |
| Wirkung = häufigstes Adjektiv | gameplay:71 | ja | `topAdj` per Zählung | 4626 bis 4632 | stimmt |
| Zweimal gleich verstärkt, dreimal gleich ergibt Unikat | gameplay:71 | Stufe 1/2/3 | `stufe = aTie ? 1 : topA`, `stufe>=3` setzt Unikatnamen | 4633, 4646 | stimmt |
| Taschenplätze | gameplay:94, 334 | 24 | `new Array(24)` an beiden Stellen | 2345, 5974 | stimmt |
| Drop-Deckel | gameplay:99 | `while(drops.length > 90) drops.shift()` | wortgleich | 2772 | stimmt |
| Bis zu fünf Sachen je Kill | gameplay:99 | 5 | Boss: 1 Gold + 1 Trank + 3 Zutaten = 5 | 2755 bis 2771 | stimmt |
| Jedes Substantiv hat ein Icon | Z1-Auftrag | 21/21 | 21/21 | 1958 | stimmt |
| Jedes Adjektiv trägt `wirk` und `fl` | gameplay:174 | 26/26 | 26/26, zusätzlich 7 mit `fl2` | 2047 | stimmt |
| Jeder Fluch hat einen Anzeigesatz | gameplay:151 | 24/24 | 24/24 (`kurz` + `satz`) | 2098 | stimmt |
| Jede Wirkung hat drei Stufensätze und einen Unikatnamen | gameplay:71 | 24/24 | 24/24, `satz` je 3 Einträge | 1990 | stimmt |
| `CFX` deckungsgleich mit `FLUCH.cfx` | gameplay:175 | vollständig | 24 Schlüssel, keiner überzählig, keiner fehlt | 2379 | stimmt |
| Alle 48 Hooks greifen | gameplay:170 | 24 + 24 | 24 `FX.<fx>`- und 24 `CFX.<cfx>`-Lesestellen, keine bei 0 | über die Datei verteilt | stimmt |
| Fluchbudget höchstens zwei harte | gameplay:176 | 2 | `hartN`-Zähler in `recalc()` | 2402 bis 2411 | stimmt |
| Sechs harte Flüche | gameplay:176 | 6 | `gruss, zappel, standfest, blutmagie, manatot, nuechtern` | 2098 | stimmt |
| Derselbe Fluch belastet das Budget einmal | gameplay:178 | ja | `schonAktiv`-Prüfung | 2409 | stimmt |
| Sechs Wechselwirkungen als Kommentarblock über `FLUCH` | gameplay:179 | 6 | 6, einzeln benannt | 2084 bis 2097 | stimmt |
| Kladde-Schlüssel | gameplay:96 | `sda_kladde_v1` | identisch | 2302 | stimmt |
| Portal zwischen Spielerstufe 5 und 11 | gameplay:23 | 5 bis 11 | `player.level >= 5`, Chance 1 ab 11 | 2776 bis 2777 | stimmt |

26 Zusagen, alle bestätigt. Die von der Vorgeschichte nie nachgezählten Tabellenlängen (21/26/24/24) stimmen exakt.

---

## Z2: Amt und Wirtschaft, Gameplay Phase 4

| Zusage | Fundort im Plan | Erwartet | Gefunden | index.html | Urteil |
|---|---|---|---|---|---|
| `AUSBAU_DEFS` Umfang | gameplay:206 bis 212 | 3 Käufe plus 2 Sonderposten | 3 Einträge, 2 Sonderposten daneben | 5934 | stimmt |
| Höhere Anfangsstufe | gameplay:207 | Kosten steigen je Stufe | `max:9`, `cost: l => 40*(l+1)` | 5935 | stimmt |
| Größeres Kontingent | gameplay:208 | dito | `max:10`, `cost: l => 30*(l+1)` | 5937 | stimmt |
| Mehr Kammertüren | gameplay:210 | dito | `max:2`, `cost: l => 80*(l+1)` | 5939 | stimmt |
| Sonderposten Vermutungen | gameplay:336 (Z2) | 100 | 100 | 6083 bis 6084 | stimmt |
| Sonderposten Startfluch | gameplay:336 (Z2) | 60 | 60 | 6087 bis 6088 | stimmt |
| Vollausbau-Summe (F20) | Z2-Auftrag | 3850 | 1800 + 1650 + 240 + 100 + 60 = **3850** | 5934 bis 5941 | stimmt |
| Bankanteil | gameplay:200 | 50 Prozent | `goldUebertragAnteil: 0.5` | 3060 | stimmt |
| Schichtlänge | gameplay:193 | grob 15 Minuten | `schichtDauer: 900` Sekunden | 3059 | stimmt |
| Jahresgespräch alle 10 Schichten | gameplay:216, 238 | `% 10 === 0` | wortgleich | 6057 | stimmt |
| Bonus-Index | gameplay:238 | `(floor(n/10)-1) % len` | wortgleich | 6062 | stimmt |
| `JAHRES_BONI` Umfang | gameplay:238 | läuft im Kreis | 5 Einträge, Modulo darüber | 5943 | stimmt |
| Überstunden-Obergrenze | gameplay:234 | 60 Sekunden | `overtimeT >= 60` | 4864 | stimmt |
| Zutaten-Kontingent | gameplay:235 | `Basis + kontingent*2` | `CONFIG.zutatenMitnahmeBasis + amt.ausbauten.kontingent*2`, Basis 5 | 3061, 6007 | stimmt |
| `CONFIG.kammerTueren` an zwei Stellen | gameplay:240 | `+=` beim Laden, Zuweisung in `startShift()` | `+= amt.ausbauten.tueren` / `= 2 + amt.ausbauten.tueren` | 3081, 5982 | stimmt |
| Amt-Schlüssel | gameplay:232 | `sda_amt_v1` | identisch | 3065 | stimmt |
| `STARTFLUCH_WAHL` nur milde Flüche | gameplay:182, 241 | kein harter Fluch | 6 Einträge, keiner mit `hart:true` | 5932 | stimmt |
| `endShift(reason)` kennt drei Anlässe | gameplay:229 | `tod`, `zeit`, `amt` | genau diese drei | 6002, 6042 bis 6045 | stimmt |
| `amt.schichten` zählt abgeschlossene Schichten | gameplay:229 | Erhöhung vor dem Panel | `amt.schichten++` vor dem `innerHTML` | 6018 | stimmt |
| Startwaffe hart in `startShift()` | gameplay:242 | `BASES[1]` + `AFFIXES[0]` | vorhanden, Startfluch hängt daran | 5979 | stimmt |
| Frisur pro Schicht neu | gameplay:243 | ja | in `startShift()` gewürfelt | 5973 | stimmt |
| **Jahresbonus Dienstsiegel schreibt in `CONFIG.kammerNachwachsen`** | gameplay:239 | `CONFIG`, überlebt den Reload nicht | schreibt `amt.bonusNachwachsen`, wird geladen und gespeichert | 5947, 3077, 3754 | **weicht ab** (Fund 1) |
| **`stats.goldTotal` deklariert und tot** | gameplay:237, gameplay:393 | Feld existiert | Feld existiert nicht mehr, `stats = {kills:0}` | 2364 | **weicht ab** (Fund 2) |
| Bankzugang 1000 bis 1500 Gold je Schicht (F20) | Z2-Auftrag | Vergleichswert | statisch nicht ableitbar | . | nicht prüfbar |

22 Zusagen, 2 Abweichungen, 1 nicht prüfbar.

---

## Z3: Knöterich, Gameplay Phase 5

| Zusage | Fundort im Plan | Erwartet | Gefunden | index.html | Urteil |
|---|---|---|---|---|---|
| Zeichendeckel Zettel/Blase | gameplay:286 | Zeile 1 max. 48, Zeile 2 max. 32 | `rows.push([h.z1,48],[h.z2,32],[h.z2t,32])` | 3208 | stimmt |
| Zeichendeckel Randnotiz | gameplay:286 | 44 | `rows.push([l,44])` | 3216 | stimmt |
| Deckel tatsächlich eingehalten | gameplay:454 | keine Überschreitung | eigene Nachrechnung über alle Tabellen: 0 Verstöße, längste z1 = 43, längste Randnotiz = 43 | 3124, 3169, 3187, 3201 | stimmt |
| Globaler Cooldown | gameplay:352 | 25 Sekunden | `gameT - knLastZettelT < 25` | 3432 | stimmt |
| Budget | gameplay:356 | 3 Zettel in 2 Minuten | `< 120` und `knBudgetShown >= 3` | 3433 | stimmt |
| Beats zählen nicht mit | gameplay:310, 356 | `exempt` | `if(!winner.exempt)` klammert beide Schranken aus | 3430 bis 3433 | stimmt |
| Blasenradius | gameplay:278 | 150 Pixel, `sqDist < 22500` | `(dx*dx+dy*dy) < 22500`, kein `Math.hypot` | 3378 | stimmt |
| Sperrzone aggro-Monster | gameplay:355 | 220 Pixel, `< 48400` | `dx*dx+dy*dy < 48400` | 3262 | stimmt |
| Vier Sperrzonen | gameplay:355 | Panel, Modul, Boss, Monster | alle vier, plus `#overlay` | 3254 bis 3264 | stimmt |
| Steckenbleib-Schwelle | gameplay:340 | 50 Sekunden | `knIdleT < 50` sperrt | 3268 | stimmt |
| Randnotiz-Taktung | gameplay:403 | 40 Sekunden | `gameT - knLastRandnotizT < 40` | 3323 | stimmt |
| Untätigkeit | gameplay:374 | 25 Sekunden | `knIdleT < 25` | 3477 | stimmt |
| Trank-Schwellen | gameplay:386 | 3, 7, 12, 20 | `KN_TRAENKE_GAGS` mit genau diesen vier | 3201 | stimmt |
| Prio-Werte des Katalogs | gameplay:320 bis 332 | 90, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25 | alle 11 Einträge stimmen der Reihe nach | 3124 bis 3164 | stimmt |
| Beats-Prio | gameplay:310 | 100 | 100 für beat2, beat3, beat1fb | 3399 bis 3411 | stimmt |
| Steckenbleib-Prio | gameplay:346 | 20 | 20 in allen drei Zweigen | 3267 bis 3276 | stimmt |
| Prüftakt | gameplay:428 | alle 15 Frames | `(knFrameCtr++ % 15) === 0` | 3470 | stimmt |
| Auto-Ausblenden Zettel | gameplay:357 | 6 Sekunden | `knZettelHideAt = gameT + 6` | 3285 | stimmt |
| Randnotiz-Dauer | gameplay:274 | 3 Sekunden | `knRandHideAt = gameT + 3` | 3315 | stimmt |
| Zettelband oben | gameplay:430 | `top: 46px` | `top:46px` | 154 | stimmt |
| Zettelband bei Bossbar | gameplay:430 | `top: 78px` | `body.bossvis #knZettel,#knRandnotiz{top:78px}` | 173 | stimmt |
| `z-index` | gameplay:430 | 12 | `z-index:12` | 155 | stimmt |
| Breitenbegrenzung | gameplay:430 | `min(420px, calc(100vw - 200px))` | zeichengleich | 155 | stimmt |
| `pointer-events:none` | gameplay:431 | ja | vorhanden | 155 | stimmt |
| `AKT_NACHFRAGE` | gameplay:415 | 9 | 9, direkt hinter `AKT_GRUSS=8` | 4113 | stimmt |
| Wiederholtiefe | gameplay:417, 483 | 3 Zettel, neuester zuerst, zyklisch | `history`-Cap 3, `n-1-knNfIdx` | 3299, 3443 | stimmt |
| `localStorage`-Schlüssel | gameplay:433 | `sda_knoeterich_v1` | identisch | 3090 | stimmt |
| Katalogumfang | gameplay:320 bis 332 | 11 Einträge | 11 | 3124 | stimmt |
| `varB` für sechs IDs | gameplay:348, 478 | beat3, zutat3, hp30, tuer1, ult1, amt1 | `ESCALATE_DEFS` mit genau diesen 6 | 3169 | stimmt |
| Randnotiz-Pools | gameplay:366 bis 374 | 7 Anlässe, je mindestens 4 Zeilen | 7 Anlässe, je genau 4 | 3187 | stimmt |
| Beat-Zustellung als Blase | gameplay:312 | nach 2 Sekunden zugestellt | `gameT - knBubble.enterT >= 2` | 3393 | stimmt |
| Fünf-Sekunden-Sperre | gameplay:338, 476 | frühestens 5 s nach `state==='play'` | `gameT - knPlayStartT >= 5` bei `feierabend1` und `amt1` | 3156, 3161 | stimmt |
| Regler mit drei Stellungen | gameplay:405 | Gesprächig/Dienstlich/Schweigt, Standard Gesprächig | `regler:'gespraechig'`, drei Zweige in `knLineErlaubt()` | 3100, 3319 bis 3322 | stimmt |
| Dienstzettel laufen in jeder Reglerstellung | gameplay:411 | ja | Regler wirkt nur auf Randnotiz und Sting | 3278 bis 3280, 3319 | stimmt |
| Blase zeigt ausschließlich Beat 1 | gameplay:477 | ja | `else { knBubble.visible = false; }` | 3395 | stimmt |
| Zettelkanal schweigt im Schattenland | gameplay:360 | `currentLevel === 2` stumm | `if(currentLevel === 2) return` | 3401 | stimmt |
| Weltfigur nur in der Oberwelt | gameplay:264, 494 | `currentLevel === 1 && !kammer` | Push im Level-1-Block, Blase mit demselben Guard | 5380, 3374 | stimmt |
| Knöterichs Kachel bleibt monsterfrei | gameplay:258 | ja | `if(tx===KN_T.x && ty===KN_T.y) continue` | 2589 | stimmt |
| Beziehung: Blasenradius > Spawn-Abstand | gameplay:278, 460 | 150 > Abstand | 150 > 105,6 (Kessel) und > 54,4 (Knöterich) | 1561 bis 1571 | stimmt |
| Beziehung: Randnotiz-Taktung < Steckenbleib | gameplay:380 | 40 < 50 | 40 < 50 | 3323, 3268 | stimmt |
| Vollständigkeit: Touch-Fassung für jede tastenbehaftete Zeile | gameplay:456 | lückenlos | 11 Katalog-, 6 Eskalations- und 3 Steckenbleib-Zeilen, alle mit Touch-Zweig | 3124, 3169, 3267 | stimmt |
| Vollständigkeit: `knAssertCaps()` deckt alle Tabellen | Z3-Auftrag | lückenlos | Katalog, Eskalation, 3 Beats, 3 Steckenbleib-Zeilen, alle Randnotizen, Trank-Gags, Begrüßung n=1..12 | 3206 bis 3227 | stimmt |
| **Abstand Spawn zu Kessel** | gameplay:260, 460 | rund 97 Pixel | 105,6 px zum Zeichenanker, 101,2 px zur Kachelmitte | 1561, 1566 | **weicht ab** (Fund 6) |
| **Spieler startet außerhalb des 58-Pixel-Radius der Kontextaktion** | gameplay:260 | außerhalb | 54,4 px zu `KN_POS`, also innerhalb; `AKT_NACHFRAGE` wird am Spawn angeboten | 1571, 4128, 4140 | **weicht ab** (Fund 6) |

38 Zusagen, 2 Abweichungen. Das dichteste Paket ist gleichzeitig das sauberste: jede einzelne Zahl aus der Phase-5-Spezifikation liegt unverändert im Code.

---

## Z4: Audio, Gameplay Phase 6

| Zusage | Fundort im Plan | Erwartet | Gefunden | index.html | Urteil |
|---|---|---|---|---|---|
| Zonenzahl | gameplay:511 | 6 | 6 | 1235 | stimmt |
| `bars` je Zone | gameplay:507 | einheitlich | 4 in allen sechs Zonen | 1235 | stimmt |
| Schritte pro Takt | gameplay:507 | `STEPS_PER_BEAT = 4` | 4 | 1231 | stimmt |
| BPM aller sechs Zonen | gameplay:515 bis 520 | 112, 100, 76, 92, 104, 140 | alle sechs identisch | 1235 | stimmt |
| Taktarten | gameplay:515 bis 520 | 4/4, 4/4, 4/4, 3/4, 2/4, 4/4 | alle sechs identisch | 1235 | stimmt |
| Skalen und Modusnamen | gameplay:515 bis 520 | dorisch, phrygisch, äolisch, Dur, Dur, äolisch | Intervalle nachgerechnet: `[0,2,3,5,7,9,10]`, `[0,1,3,5,7,8,10]`, `[0,2,3,5,7,8,10]`, `[0,2,4,5,7,9,11]` (2x), `[0,2,3,5,7,8,10]` | 1235 | stimmt |
| Tonika | gameplay:515 bis 520 | A, A, A, F, F, A | identisch | 1235 | stimmt |
| Lead-Instrumente | gameplay:515 bis 520 | Pluck, Pluck, Marimba, Flöte, Fagott, Blech | identisch | 1235 | stimmt |
| Wechsel nur an der Taktgrenze | gameplay:508 | `stepIdx % z._stepsPerBar === 0` | wortgleich | 1410 | stimmt |
| `MUS` hat sechs Methoden | gameplay:509 | `goto, layer, sting, swell, muffle, setOvertime` | genau diese sechs, keine weitere | 1467 bis 1539 | stimmt |
| `duck(ms)` existiert nicht | gameplay:509 | nicht vorhanden | nur `duckToFx()`, audiointern | 1443 | stimmt |
| `duckToFx` nur aus dem Audioblock | gameplay:509 | Zonenwechsel und Sting-Ende | genau zwei Aufrufer, beide im Audioblock | 1412, 1507 | stimmt |
| Duck-Tiefen | Z4-Auftrag | kein Planwert | Zonenwechsel 180 ms / 0,5; Sting 500 bzw. 650 ms / 0,55; Vorgabe 200 ms / 0,45 | 1412, 1443, 1507 | nicht prüfbar (Plan nennt keine Zahl) |
| 70-ms-Bremse | gameplay:41, 561 | Crit und Sterben | `gameT - lastCritSfx > 0.07`, `gameT - lastDieSfx > 0.07` | 2713, 2742 | stimmt |
| Scheduler-Lookahead | gameplay:508 | 25 ms Tick, 120 ms Horizont | `LOOKAHEAD_MS = 25, HORIZON_SEC = 0.12` | 1347 | stimmt |
| `zoneForLevel()` | gameplay:534 | 1 overworld, 2 shadowland, 3 chamber | wortgleich | 1344 | stimmt |
| Boss-Zone nur bei `currentLevel === 2` | gameplay:536 | ja | `bossFight && currentLevel === 2` | 4879 | stimmt |
| Dorf-Zone über `inVillagePx` | gameplay:542 | vor `zoneForLevel` | `currentLevel===1 && !kammer && inVillagePx(...)` | 4878 | stimmt |
| Amt und Jahresgespräch: `office` plus `muffle(false)` | gameplay:548 | beide Aufrufe, in dieser Kombination | in beiden Funktionen, jeweils erste Zeile | 6061, 6096 | stimmt |
| Sieben `#ovPanel`-Stellen | gameplay:266, 546 | 7 | 7 `innerHTML`-Stellen, 7 `display='flex'` | 5848, 5860, 5891, 6040, 6064, 6118, 6398 | stimmt |
| Panel-Dämpfung | gameplay:546 | `muffle(true)` beim Öffnen, `(false)` beim Schließen | vorhanden, seit R2/F36 zusätzlich für die fünf Panels abgeleitet | 1514, 5854, 5884 | stimmt (erweitert) |
| Tempoabfall in den Überstunden | gameplay:564 | bis 14 Prozent | `z.bpm * (1 - overtimeFactor*0.14)` | 1356 | stimmt |
| Quantisierung | gameplay:564 | 50 Stufen | `Math.round(f*50)/50` | 1534 | stimmt |
| Gain-Stellschrauben | gameplay:563 | 0,45 / 0,22 / 0,85 | `musicVolTarget=0.45`, `sfxBus.gain=0.22`, `master.gain=0.85` | 1009, 1057, 1026 | stimmt |
| `sfx`-API mit 13 Methoden | gameplay:560 | 13 | 13 Methoden, 13 verschiedene aufgerufen (40 Aufrufstellen) | 1096 | stimmt (Formulierung siehe Fund 12) |
| Stinger nur an Zettel und Kammerabbruch | gameplay:552 | Randnotiz bekommt keinen | `MUS.sting` nur in `knDisplayZettel()` und `knAbbruchKammer()` | 3280 | stimmt |

22 Zusagen, keine Abweichung, 1 ohne Planwert.

---

## Z5: Grafik, G0 bis G5

| Zusage | Fundort im Plan | Erwartet | Gefunden | index.html / Datei | Urteil |
|---|---|---|---|---|---|
| Kachelgröße | grafik:53, 84 | 16 px | `drawImage(..., 16, 16, 0, 0, TS, TS)`, `Grass_1_Middle.png` ist 16x16 | 1655 | stimmt |
| Boden-Canvas | grafik:74 | 2560 x 2560 | `MW*TS = 80*32 = 2560`, quadratisch | 466, 471 bis 472 | stimmt |
| Cull-Rand nach R8 | Z5-Auftrag | `BIG_PAD = 190` | 190 | 5263 | stimmt |
| Minimap Desktop | gameplay:430 | 128 px | `width:128px;height:128px`, Canvas 128 | 36, 361 | stimmt |
| Minimap mobil | gameplay:430 | 88 px | `#minimap{width:88px;height:88px}` | 278 | stimmt |
| Schattenland-Tönung | Z5-Auftrag | 0,72 | 0,72 an allen drei Stellen (Deko, Baumsilhouette, `shadow`-Rig) | 5406, 5689, 2528 | stimmt |
| Manifest-Umfang | grafik:196 | 886 Sheets, 0 Fehler | 886, 0 Fehler-Einträge | `assets/cf/manifest.json` | stimmt |
| Manifest-Einträge mit Anim-Zuordnung | Z5-Auftrag (R8) | 52 von 886 | 52, Rest `anims:null` | manifest.json | stimmt |
| `Player_Base_animations.png` | grafik:187 | 576x3584, 9 x 56 à 64x64 | IHDR 576x3584, Raster geht auf | Datei | stimmt |
| `Iron_Sword.png` | grafik:310 | eigenständiges 4x9-Sheet, 256x576 | IHDR 256x576, 4 Spalten x 9 Zeilen | Datei | stimmt |
| `Dungeon_1.png` / `Dungeon_2.png` | grafik:53, 227 | 208x208 / 208x192 | IHDR bestätigt beide | Datei | stimmt |
| `Dungeon_1_Gate_anim.png` | grafik:225 | 26 Frames à 32x32 | IHDR 832x32, also genau 26 | Datei, 778 | stimmt |
| `Grass_Tiles_1.png` | grafik:53 | 256x160 | Manifest 256x160 @16x16 | manifest.json | stimmt |
| `Skeleton.png` | grafik:54, 205 | 192x320, 6x10 à 32x32 | Manifest identisch | manifest.json | stimmt |
| `Skeleton_Swordman.png` | grafik:54, 431 | 256x512, 16 Zeilen à 64x32 | Manifest 256x512 @64x32, 4x16 | manifest.json | stimmt |
| `Templar.png` | grafik:206 | 6x13 à 48x48 | 288x624, Raster geht auf | Datei | stimmt |
| `Witch.png` | grafik:208 | 6x9 à 32x32 | Manifest identisch | manifest.json | stimmt |
| `Slime_Small_Blue.png` | grafik:207 | 8x4 à 16x16 | 128x64, Raster geht auf | Datei | stimmt |
| `Bat.png` als Ein-Zeilen-Rig | grafik:493 | 96x16, 6 Frames | IHDR 96x16, 6 Spalten x 1 Zeile | Datei, 595 | stimmt |
| `CF_RIGS` Umfang | grafik:458, 524 | 19 Rigs | 19 | 595 | stimmt |
| Alle 21 `MONDEF`-Typen tragen ein CF-Rig | grafik:530 | 21/21 | 21/21, 19 verschiedene Rigs | 2505 | stimmt |
| Anker `ax`/`ay` je Rig von Hand gemessen | grafik:450 bis 454 | vorhanden | alle 19 mit `ax`/`ay`; Held `CF_ANCHOR = {ax:32, ay:40}` | 595, 545 | stimmt |
| Alle Sheet-Registrierungen zeigen auf existierende Dateien | grafik:75 (Regel 12) | lückenlos | 312 von 312 Dateien vorhanden, jedes deklarierte Raster teilt die echten PNG-Maße restlos, kein `rowStart` außerhalb des Blatts | 507 bis 787 | stimmt |
| Frames überschreiten die Spaltenzahl nur bewusst | grafik:718 | nur `dun1_plate`/`dun2_plate` | drei Sheets: `dun1_plate`, `dun2_plate`, **`cfcloud`** (2x2, seit G5); alle drei korrekt, weil `drawSpriteAt` über `cols` umbricht | 780, 756, 863 | stimmt (Plan nennt nur zwei, siehe Fund 13) |
| Dorf: 6 Gebäude, 3 NPCs | grafik:787, 804 | 6 / 3 | 6 / 3 | 1584, 1600 | stimmt |
| Wetter-Sub-Caps | grafik:855 | 40 / 6 | `WEATHER_SNOW_CAP=40, WEATHER_WIND_CAP=6` | 1616 | stimmt |
| Wolkenzahl | grafik:923 | 5 | `for(let i=0;i<5;i++)` | 1899 | stimmt |
| glint-Ersatz | grafik:847 | 3-Zellen-Ausschnitt | `addSheet('glint', ..., 3, 'strip')`, Datei 48x16 | 718, Datei | stimmt |
| Build-Dateizahl | grafik:926 | 99 Dateien | 99 verschiedene URLs in `SHEET_LIST` | 507 ff. | stimmt |
| **Held: 6 Anims, 36 gebackene Frames, `walk=9`** | grafik:302, 320 bis 324 | 6 / 36 | 5 Anims, 32 Frames; `walk` in R9/F68 entfernt | 541, 912 | **weicht ab** (Fund 3) |
| **Ladeliste** | grafik:915 (G5), grafik:718 (G4) | 335 bzw. 319 | 312 | 507 ff. | **weicht ab** (Fund 9) |
| **Sheets mit niedriger Confidence** | grafik:217 | 447 von 886, Rest 418 | 442, Rest 413 | manifest.json | **weicht ab** (Fund 8) |
| **`_castTable` Umfang** | grafik:195, 210 | 29 Einträge | 30 | `sheet-audit.overrides.json` | **weicht ab** (Fund 7) |
| **Ungeprüfte Prioritätsrigs (`checked:false`)** | grafik:215 | 8 von 29 | 10; die Aufzählung im selben Satz nennt 11 | overrides.json | **weicht ab** (Fund 7) |
| **`_rigTable` Umfang** | grafik:516 | 19 Rigs + 4 Tiere + Projektil = 24 | 51 Einträge (Held-Layer und NPCs kamen dazu) | overrides.json | überholt |
| **Dorf-Rechteck** | grafik:781 | 18 x 15 Kacheln | `inVillageT` ist beidseitig inklusiv, also 19 x 15 | 1576 bis 1577 | **weicht ab** (Fund 10) |
| Frame-Budget, Bake-Zeiten, Soak-Läufe | grafik:80, 269 bis 271, 924 | Messwerte | nicht statisch belegbar | . | nicht prüfbar |

31 Zusagen, 6 Abweichungen, 1 überholt, 1 nicht prüfbar. Das zahlenreichste Paket ist auch das mit der größten Drift, aber ausschließlich in den Notizen, nie im Code.

---

## Z6: Welt und Terminologie, Weltbibel plus W1, W2, Blätter

| Zusage | Fundort im Plan | Erwartet | Gefunden | index.html | Urteil |
|---|---|---|---|---|---|
| `BLAETTER` Umfang | w2:260 | 18 | 18 | 2211 | stimmt |
| Serienaufteilung | blaetter:13, 89 | A = 12, B = 6 | 12 / 6 | 2211 | stimmt |
| Text zeichengleich mit dem Quelldokument | w2:260 | zeichengleich | 18 von 18 Blättern, jede Zeile strikt identisch, inklusive der typografischen Anführungszeichen | 2211 | stimmt |
| Serie A: `minDiff` statt Biom | w2:117 | 3, kein Biomfilter | alle 12 mit `minDiff:3`, kein `biome` | 2211 | stimmt |
| Serie B: Biom statt `minDiff` | w2:117 | `grass`, kein `minDiff` | alle 6 mit `biome:'grass'`, keins mit `minDiff` | 2211 | stimmt |
| Höchstens sechs Zeilen je Blatt | blaetter:7 | max. 6 | 4 oder 5, nie mehr | 2211 | stimmt |
| Fundchance | w2:163 | `0.18 + k.diff*0.04` | wortgleich; Stufe 3 = 0,30, Stufe 5 = 0,38 | 3769 | stimmt |
| Ein Fund je Truhe | w2:177 | genau einer, außerhalb der Zutatenschleife | ein Block, `if(kandidaten.length && ...)` | `truheOeffnen` | stimmt |
| Kein Doppelfund | w2:140 | `findeBlatt` gibt `false` zurück | wortgleich umgesetzt | 2327 | stimmt |
| Kladde-Erweiterung additiv | w2:126 | fünftes Feld `blaetter` | `{crafts, adj, noun, unikate, fl, blaetter}` | 2303 | stimmt |
| Kein `CFX.schweigen`-Guard bei Aktenfunden | w2:148 | bewusst keiner | Kommentar und Code stimmen überein | 2325 | stimmt |
| Dritter Reiter | w2:264 | „🗄 Akten" mit Zählzeile | vorhanden, `switchKesselTab` dreifach | 431 ff., 4779 | stimmt |
| `MONDEF.art` vollständig | w1:145 | 21 Felder, wortgleich mit Kapitel 6 | 21/21, alle 21 Zeichenketten wortgleich mit der W1-Tabelle | 2505 | stimmt |
| Bossleiste zeigt Name und Vorgangsart | w1:103, 146 | `name + ' · ' + art` | wortgleich, Interpunkt | 5099 | stimmt |
| Dienstbericht-Killliste | w1:104 | `name (art)` | wortgleich, `killLines.join(' · ')` unverändert | 6027, 6045 | stimmt |
| Browser-Tab | w1:45 | `Das Monstralministerium` | identisch | 6 | stimmt |
| Startbildschirm-`h1` | w1:38 | `DAS MONSTRAL MINISTERIUM` | identisch, getrennt | 5849 | stimmt |
| Startbildschirm-`h3` | w1:39 | `Erledigen. Beglaubigen. Feierabend.` | identisch | 5850 | stimmt |
| Startknopf | w1:41 | `Dienst antreten` | identisch | 5852 | stimmt |
| Ladebildschirm | w1:163 (F83) | zusammengeschriebene Form | `Das Monstralministerium` | 6399 | stimmt |
| Zonen-HUD, drei Zweige | w1:63 bis 65, 144 | Ablage A, Die Eisablage, Der Brandabschnitt | alle drei wortgleich, plus Dorf-Zweig aus G5 | 4947 bis 4950 | stimmt |
| `#zone`-Initialtext | w1:71 | mitgezogen | `📍 Grasland, Ablage A (Stufe 1)` | 360 | stimmt |
| 5921 | w1:149 | 6 Einträge, Zeile 4 umformuliert | 6 Einträge, `Ausrüstung verbleibt aktenkundig beim Amt.` | 5921 | stimmt |
| Keine Gedankenstriche in Spieltexten | weltbibel Kap. 13, blaetter:7 | 0 | Scan aller Stringliterale: 0 Treffer für `–` und `—` | ganze Datei | stimmt |
| Keine Emojis in Knöterich-Texten | gameplay:256 | 0 | Scan über Katalog, Eskalation, Randnotizen, Trank-Gags: 0 | 3124 bis 3204 | stimmt |
| Kein Blut | gameplay:288 | 0 | kein Vorkommen in Spieltexten | ganze Datei | stimmt |
| Keine Preisgabe der Kesselgrammatik | gameplay:284, weltbibel Kap. 19 | 0 | alle 11 Katalogzeilen, 6 Eskalationszeilen, 3 Beats, 3 Schubs-Zeilen, 28 Randnotizen und 18 Blätter einzeln gelesen: kein Verweis auf Slot-, Wirkungs- oder Fluchableitung | 3124 ff., 2211 | stimmt |
| Serienplan der Aktenfunde | weltbibel:454 | rund 48 Blätter | Tabellensumme 12+6+8+8+10+4 = 48, exakt | . | stimmt |
| **Bauabschnitts-Zahl der ersten Lieferung** | weltbibel:529 | „Erst 16 Blätter (Serien A und B)" | Serien A und B sind 18; in `blaetter:3` als Zählfehler erkannt, an der Quelle nie korrigiert | 2211 | **weicht ab** (Fund 11) |
| **Zuständigkeitsbereich des Vorgangs** | weltbibel:80, 389, 574 gegen blaetter:18, 40 | Welt = Bereich VII, Bereich VI gilt als abgeschlossen | Blätter A1 und A5 verorten Gründung und Waffenstillstandsbruch im Bereich **VI**, wortgleich im Code | 2213, 2231 | **weicht ab** (Fund 5) |
| Rangsystem und Laufbahnstufen | weltbibel 18.3 | 11 Stufen plus 8 Fortsetzungen | im Code kein einziger Rangbegriff; W3 bis W5 stehen als OFFEN | . | nicht anwendbar |
| Ensemble | weltbibel Kap. 8 | 13 Figuren | im Code nur Knöterich; der Bürgermeister erscheint namenlos | 6060 ff. | nicht anwendbar |
| Serien C bis F | w2:254 | ausdrücklich später | nicht vorhanden, wie vorgesehen | . | nicht anwendbar |

25 Zusagen, 2 Abweichungen, 3 nicht anwendbar.

---

## Z7: Regressionsschutz als Zahlenwerk

| Zusage | Fundort im Plan | Erwartet | Gefunden | index.html | Urteil |
|---|---|---|---|---|---|
| Partikel-Cap | gameplay:37, grafik:65 | 900 | `MAX_PARTICLES = 900`, vor jedem Spawn geprüft | 2618, 2621 | stimmt |
| Floater-Cap | gameplay:37, grafik:65 | 70 | `if(floaters.length > 70) floaters.splice(...)` | 5232 | stimmt |
| Sound-Bremse | gameplay:41 | 70 ms | 0,07 s auf Crit und Sterben | 2713, 2742 | stimmt |
| Minimap-Blit | gameplay:40 | alle 4 Frames | `if((frameNo++ & 3) === 0) renderMinimap()` | 5488 | stimmt |
| Boden-Canvas einmal pro Level | grafik:74 | kein Bake im Frame | `initFloorGraphics()` nur an Level-, Kammer- und Schichtwechseln (7 Aufrufstellen), keine im Renderpfad | 1903, 2604, 3646, 3729, 5883, 5986, 6492 | stimmt |
| Tot-Guard in `hurtMon()` | gameplay:38 | vorhanden | `if(m.dead) return` als erste Zeile, Kammerregel direkt dahinter | 2683 bis 2685 | stimmt |
| Kein `Math.hypot` in Hot Paths | gameplay:35 | keine | 6 Vorkommen: 2 in `genMap()` (einmalig), 4 in Touch-Gesten. Keins im Frame-Renderpfad | 1796, 1809, 6171, 6254, 6263, 6331 | stimmt |
| Wetter umgeht den 900er-Deckel nicht | grafik:853 | eigene Sub-Caps | eigene Arrays und eigene Deckel, kein zweiter `particles[]`-Producer | 1613 bis 1616, 5021 | stimmt |
| Frame-Budget-Referenz | grafik:80 | 0,6 ms | Messwert, statisch nicht belegbar | . | nicht prüfbar |

9 Zusagen, keine Abweichung, 1 nicht prüfbar.

---

## Z8: Eingaben

### Plan gegen Code

| Zusage | Fundort im Plan | Erwartet | Gefunden | index.html | Urteil |
|---|---|---|---|---|---|
| Bewegung | gameplay:26 | WASD | `w`, `a`, `s`, `d` | 6130 bis 6131 | stimmt |
| Angriff Maus | gameplay:26, 296 | linke Taste | `mousedown` mit `e.button !== 0` als Ausschluss | 6162 bis 6165 | stimmt |
| Angriff Taste | gameplay:26, 296 | Leertaste | `e.code === 'Space'`, mit `preventDefault()` | 6132 | stimmt |
| Trank | gameplay:26 | Q | `k === 'q'` | 6133 | stimmt |
| Zauber | gameplay:26 | E | `k === 'e'` | 6134 | stimmt |
| Ultimate | gameplay:25, 26 | R | `k === 'r'` | 6135 | stimmt |
| Inventar | gameplay:26 | I | `k === 'i'` | 6136 | stimmt |
| Zauberbaum | gameplay:26 | T | `k === 't'` | 6136 | stimmt |
| Kessel | gameplay:66 | K | `k === 'k'` | 6137 | stimmt |
| Kontextaktion | gameplay:143 | F | `k === 'f'` | 6138 | stimmt |
| Esc-Schließreihenfolge | Z8-Auftrag | Inventar, Zauberbaum, Kessel, Schloss, Amtsfenster, Kammerabbruch | genau diese sechs, in dieser Reihenfolge | 6139 bis 6146 | stimmt |
| Esc schließt außerhalb der Kammer nur Panels | gameplay:432 | ja | Kammerabbruch steht als letzter `else if` | 6145 | stimmt |
| Touch: Joystick links, Kampf-Cluster rechts | gameplay:26 | ja | `#touchCluster` mit `#attackBtn`, Joystick über `updateJoyVec()` | 384, 6171 | stimmt |
| Touch-Entsprechung je Taste | gameplay:456 | lückenlos | Q → `#potionBtn`, E → `#spellBtn`, R → `#ultBtn`, T → `#spellsBtn`, I → `#invBtn`, F → `#aktionBtn`, Esc-Kammer → `#kamExitBtn`, K → `#kesselBtn` (im Inventar), M → `#musicBtn` (im Inventar) | 368 bis 375, 388, 414 | stimmt |
| Touch-Texte passen zu den Knöpfen | gameplay:302 bis 344 | konsistent | „Das Fläschchen" (🧪), „Der Stern im Gürtel" (✨★), „Die Hand im Gürtel" (🖐️), „Rucksack, dann Kessel" (Kessel liegt im Inventar) | 3124 ff. gegen 368 bis 388 | stimmt |
| Zauberbaum-Umfang | gameplay:25 | 11 Sprüche, 3 Zweige | 11 Einträge, `branch` 0/1/2 | 2858 | stimmt |
| **Skillpunkte je Level-Up** | gameplay:25 gegen gameplay:314 | 1 Skillpunkt (Kontext) gegen `skillPoints += 2; spellPoints += 1` (Phase 5) | Code: `+2` Skillpunkte, `+1` Zauberpunkt | 2806 | **weicht ab** (Fund 4) |

### Gegenrichtung: Code gegen Plan

| Belegung | im Plan | Code | Urteil |
|---|---|---|---|
| `1` als Zweitbelegung für den Trank | in keiner Plandatei, weder Kontext noch Abnahme | `if(k === 'q' \|\| k === '1') drinkPotion()` (6133) | **weicht ab** (Fund 14) |
| `m` für `toggleMusic()` | `gameplay:26` nennt „M Musik" im Kontext, aber keine Abnahmeliste | `if(k === 'm') toggleMusic()` (6136) | stimmt (Abnahmelücke, Fund 14) |
| Weitere Belegungen | . | keine. Der Handler kennt exakt: w, a, s, d, Space, q, 1, e, r, i, t, m, k, f, Escape | stimmt |

17 Zusagen, 2 Abweichungen.

---

## Funde, nach Schwere

### 1. Der Plan beschreibt eine Falle, die seit R2 behoben ist (Plan falsch)

**Was.** `gameplay:239` warnt unter Phase 4: „Der Jahresbonus Dienstsiegel schreibt in `CONFIG.kammerNachwachsen`, aber `saveAmt()` serialisiert nur `amt`, nicht `CONFIG`. Der Bonus überlebt den Reload nicht und wird bei jedem fünften Jahresgespräch erneut vergeben."

**Wo.** Der Code schreibt seit R2/F1 nach `amt.bonusNachwachsen` (`index.html:5947`), lädt den Wert (`:3077`) und verbraucht ihn als `Math.max(40, CONFIG.kammerNachwachsen - amt.bonusNachwachsen)` (`:3754`). Die Obergrenze liegt bei 80, die Untergrenze der Nachwachszeit damit bei 40 Sekunden.

**Warum es zählt.** Dies ist der einzige Fund, den ein Leser aktiv zum Schaden verwenden kann. Der Absatz ist als Handlungsanweisung formuliert („Wer das repariert, muss den Wert nach `amt` ziehen") und schickt die nächste Session in eine Reparatur, die es schon gibt. Wer sie ausführt, baut mit hoher Wahrscheinlichkeit einen zweiten Wahrheitsträger.

**Korrekturkosten.** Ein Absatz in `superduper-gameplay-prompt.md`, etwa vier Zeilen. Kein Code.

### 2. `stats.goldTotal` steht an drei Planstellen als bestehende Falle (Plan falsch)

**Was.** `gameplay:237`, die Zählertabelle in `gameplay:393` und `weltbibel:547` führen `stats.goldTotal` als deklariertes, aber totes Feld.

**Wo.** R9/F45 hat die Deklaration ersatzlos entfernt. Heute steht dort `const stats = {kills:0};` (`index.html:2364`), das Feld existiert nicht mehr.

**Warum es zählt.** Dieselbe Mechanik wie Fund 1, nur harmloser: die Warnung ist gegenstandslos, kostet aber jeder Session eine Suche. Die Zählertabelle in Phase 5 ist außerdem die Stelle, an der jemand nach einem Lebenszeit-Goldzähler sucht.

**Korrekturkosten.** Drei Zeilen in zwei Dateien. Kein Code.

### 3. Der Held bäckt 5 Animationen, der Plan nennt 6 (Plan veraltet)

**Was.** `grafik:302` nennt „für alle 6 Anims verwendet (idle=1, walk=9, run=45, attack=18, cast=24, hurt=15)", `grafik:320` „ein Offscreen-Canvas mit allen 36 benötigten Frames (6 Anims)".

**Wo.** `CF_HERO_ANIMS` (`index.html:541`) enthält fünf Einträge, Summe 32 Frames. R9/F68 hat `['walk', 9, 4]` entfernt, weil `player.anim` für Bewegung nur `run` kennt. 32 + 4 = 36, die alte Zahl war also korrekt und ist es nicht mehr.

**Warum es zählt.** Die Zahlen 6 und 36 sind in den G2-Notizen die einzige Beschreibung dessen, was `bakeHeroSheet()` tut. Wer den Bake anfasst, rechnet mit einem Frame-Streifen, der vier Frames breiter ist als der echte.

**Korrekturkosten.** Zwei Sätze in `superduper-grafik-prompt.md`. Kein Code.

### 4. Zwei Planstellen widersprechen sich bei den Skillpunkten (Plan gegen Plan)

**Was.** `gameplay:25` sagt „1 Skillpunkt pro Level-Up". `gameplay:314` zitiert den Code korrekt mit `player.skillPoints += 2; player.spellPoints += 1;`.

**Wo.** `index.html:2806`: `player.level++; player.skillPoints += 2; player.spellPoints += 1;`

**Warum es zählt.** Der Kontextblock ganz oben ist das, was eine frische Session zuerst liest. Er beschreibt die Progression um den Faktor zwei falsch. Phase 5 hat den Widerspruch bereits bemerkt, ohne die Quelle zu korrigieren.

**Korrekturkosten.** Eine Zeile in `superduper-gameplay-prompt.md`. Kein Code.

### 5. Serie A verortet den Vorgang im falschen Zuständigkeitsbereich (Plan gegen Plan, im Code materialisiert)

**Was.** Blatt A1 („Der Zuständigkeitsbereich VI meldet Waffenstillstandsbruch") und Blatt A5 („Gründungsverfügung der Stelle für den Zuständigkeitsbereich VI") setzen den Hauptvorgang in Bereich VI. Die Weltbibel führt die Spielwelt an drei Stellen als **Zuständigkeitsbereich VII** (`weltbibel:80`, `:574`) und Bereich VI ausdrücklich als abgeschlossen und als Material für New Game Plus (`weltbibel:389`: „Vorgang 2 ist der Zuständigkeitsbereich VI. Der gilt als abgeschlossen.").

**Wo.** `index.html:2213` und `:2231`, wortgleich aus `blaetter-serie-a-b.md:18` und `:40` übernommen. W2 hat korrekt keinen Satz erfunden, sondern den Fehler mitgeliefert.

**Warum es zählt.** Es ist der einzige Fund, der im ausgelieferten Spiel sichtbar ist. Zwei von zwölf Blättern der wichtigsten Serie stellen die Hintergrundgeschichte in einen Bereich, den dieselbe Weltbibel als erledigt und als Stoff eines zweiten Spiels führt. Wer Serie A vollständig sammelt, liest eine Gründungsurkunde für das falsche Ressort.

**Korrekturkosten.** Zwei Zeichenketten im Code, zwei Zeilen in `blaetter-serie-a-b.md`, zwei in `phase-w2-aktenfunde.md`. Etwa zehn Minuten. **Welche Seite gilt, ist eine Entscheidung über den Kanon und gehört nicht in diesen Bericht.** Die dritte Möglichkeit wäre, VI stehen zu lassen und die Weltbibel anzupassen; dagegen spricht nur, dass Kapitel 16 „Bereiche I bis VI" als geschlossene Menge braucht.

### 6. Der Spawn-Abstand stimmt nicht, die daraus abgeleitete Aussage auch nicht (Plan falsch, Wirkung null)

**Was.** `gameplay:260` und `gameplay:460` nennen „rund 97 Pixel" Abstand zwischen `SPAWN` und dem Kessel und leiten daraus ab: „Der Spieler steht beim Start also außerhalb des 58-Pixel-Radius der Kontextaktion."

**Wo.** `SPAWN = {x:400, y:1296}` (`:1561`), `KESSEL = {x:496, y:1340}` (`:1566`). Gerechnet: **105,60 px** zum Zeichenanker, 101,19 px zur Kachelmitte. `KN_POS = {x:432, y:1340}` (`:1571`) liegt **54,41 px** vom Spawn entfernt, also innerhalb des 58-Pixel-Radius aus `aktD2 = 58*58` (`:4128`) und damit innerhalb der Reichweite von `AKT_NACHFRAGE` (`:4140`).

**Warum es zählt.** Die eigentliche Zusage („Blasenradius 150 muss größer sein als der Spawn-Abstand") hält mit großem Abstand, die Einführung funktioniert. Aber die Ableitung ist seit der Platzierung von `KN_T` zwei Kacheln links des Kessels falsch: ab der zweiten Schicht, sobald `kn.history` gefüllt ist, wird die Nachfragen-Aktion schon im Startframe angeboten. Das ist kein Fehler, nur nicht das, was der Plan behauptet.

**Korrekturkosten.** Zwei Sätze im Plan. Kein Code.

### 7. Die Cast-Tabelle ist gewachsen, und ihre Handprüfungs-Bilanz war nie stimmig (Plan falsch)

**Was.** `grafik:195` und `:210` nennen „eine `_castTable` mit 29 Einträgen" beziehungsweise „vollständig für alle 29 Prioritätsrigs". `grafik:215` sagt „8 von 29 Prioritätsrigs wurden nicht selbst am Bild geprüft" und zählt im selben Satz **elf** auf: Slime_Big, Goblin_Spearman, Goblin_Thief, drei Knights, Orc_Grunt, Orc_Peon, Angel_2, Cowling_2, Cowling_Mage_2.

**Wo.** `tools/sheet-audit.overrides.json`, `_castTable`: heute **30** Einträge, davon **10** mit `checked:false`. Angel_2 steht inzwischen auf `checked:true`, passend zu G3s Auflösung des Angel-Flags.

**Warum es zählt.** Die Zahl 8 war schon bei ihrer Niederschrift falsch, sie widerspricht der eigenen Aufzählung. Wer die Rest-Handprüfung nachholen will („Vor produktivem Einsatz in G3 stichprobenartig gegenprüfen"), sucht nach 8 Sheets und findet 10.

**Korrekturkosten.** Zwei Zahlen in `superduper-grafik-prompt.md`. Kein Code.

### 8. Die Confidence-Bilanz des Manifests ist überholt (Plan veraltet)

**Was.** `grafik:217`: „Von den 886 Sheets sind 447 niedrige Confidence (< 0.15)", daraus abgeleitet „der Rest (418, Gebäude/Tiere/Deko)".

**Wo.** `assets/cf/manifest.json`, neu gezählt: **442** unter 0,15, Rest **413**. Ursache ist der Neulauf des Audits in R8 zusammen mit den in G1 bis G4 ergänzten Overrides.

**Warum es zählt.** Wenig. Die Zahl trägt keine Entscheidung. Sie steht hier, weil dieses Paket ausdrücklich fragt, ob Plan, Manifest und Overrides heute dasselbe sagen. Tun sie in der Geometrie, nicht in den Bilanzzahlen.

**Korrekturkosten.** Zwei Zahlen. Kein Code.

### 9. Die Ladelistengröße im Plan ist um genau die entfernte `walk`-Reihe veraltet (Plan veraltet)

**Was.** `grafik:915` protokolliert „335/335 Sheets geladen", `grafik:718` für G4 „319 Sheets in `SHEET_LIST`".

**Wo.** `SHEET_LIST` enthält heute **312** Einträge über 99 verschiedene Dateien. Die Differenz zu 335 ist exakt 23 und exakt erklärbar: `walk` wurde je einmal für Body, Hände, sechs Frisuren, fünf Chest-, fünf Legs- und fünf Feet-Dateien registriert. R9/F68 hat alle 23 mitentfernt.

**Warum es zählt.** Als Zahl gar nicht. Als Kontrollrechnung sehr: sie belegt, dass Fund 3 der einzige Eingriff in die Ladeliste seit G5 war. Die 99 Dateien decken sich weiterhin exakt mit der Build-Angabe aus `grafik:926`.

**Korrekturkosten.** Eine Zahl, oder besser eine Fußnote „Stand G5, seit R9/F68 sind es 312". Kein Code.

### 10. Das Dorf-Rechteck ist eine Kachel breiter als angeschrieben (Plan falsch)

**Was.** `grafik:781`: „Dorf-Rechteck `VILLAGE = {x0:6,y0:33,x1:24,y1:47}` (18x15 Kacheln)".

**Wo.** `inVillageT()` (`index.html:1577`) prüft beidseitig inklusiv (`tx >= x0 && tx <= x1`). Damit sind es 19 Kacheln in x und 15 in y.

**Warum es zählt.** Nur beim Nachbauen. Die Zahl entscheidet mit, wo Kammertüren ausgeschlossen werden (`:3529`), wo Monster nicht spawnen (`:2590`) und wo die Dorfmusik greift.

**Korrekturkosten.** Eine Zahl. Kein Code.

### 11. Die Weltbibel nennt weiterhin 16 Blätter für die erste Lieferung (Plan intern widersprüchlich)

**Was.** `weltbibel:529`: „Erst 16 Blätter (Serien A und B) bauen, testen, dann den Rest." Die Serientabelle in Kapitel 12 nennt für A zwölf und für B sechs.

**Wo.** `blaetter:3` hat den Widerspruch erkannt, als „Zählfehler im Ursprungsdokument" benannt und zugunsten von 18 aufgelöst. Der Code führt 18. Die Quelle wurde nie korrigiert.

**Warum es zählt.** Fast nicht, der Fall ist entschieden und dokumentiert. Er steht hier, weil eine Bilanz auch die abgehakten Widersprüche zeigen soll: solange die falsche Zahl an der Quelle steht, taucht sie beim nächsten Lesen der Weltbibel wieder auf.

**Korrekturkosten.** Eine Zahl.

### 12. „Die 13 Aufrufer" meint 13 Methoden (Plan missverständlich)

**Was.** `gameplay:560`: „kein einziger der 13 Aufrufer im Rest der Datei musste angefasst werden". `w2:253` erbt die Formulierung: „kein 14. Aufrufer kommt dazu".

**Wo.** `sfx` hat 13 Methoden, die an **40** Stellen aufgerufen werden. Gemeint sind offensichtlich die Methoden.

**Warum es zählt.** Kaum. Aber W2s Abnahmekriterium ist als Zählbedingung formuliert, und die Zahl, die man dabei zählt, ist die falsche.

**Korrekturkosten.** Ein Wort.

### 13. Ein drittes Sheet überschreitet die Spaltenzahl (Plan unvollständig)

**Was.** `grafik:718`: „einzige `n>cols`-Auffälligkeit ist `dun1_plate`/`dun2_plate`".

**Wo.** Statisch über alle 312 Registrierungen geprüft: `dun1_plate` (n=6, 3x2), `dun2_plate` (n=6, 3x2) und **`cfcloud`** (n=4, 2x2, seit G5). Alle drei sind korrekt, weil `drawSpriteAt()` über `localRow = (i/s.cols)|0` in die nächste Zeile umbricht (`index.html:863`); die Wolken sind laut G5s eigenem Kommentar bewusst „4 Varianten im 2x2-Raster".

**Warum es zählt.** Nur für die nächste Prüfung: `assertRigRegistrations()` warnt bei `n > cols`, läuft aber ausschließlich über `RIG_ANIM` und sieht keins der drei Sheets. Die Aussage „einzige Auffälligkeit" stammt also aus einer Handzählung, die G5 nicht wiederholt hat.

**Korrekturkosten.** Ein Halbsatz.

### 14. Zwei Tastenbelegungen fehlen in den Abnahmelisten (Plan unvollständig)

**Was.** Der `keydown`-Handler (`index.html:6133`) belegt `1` als Zweittaste für den Trank. Diese Belegung steht in **keiner** Plandatei, weder im Kontextblock noch in einer Abnahme. `m` für `toggleMusic()` (`:6136`) steht im Kontextblock (`gameplay:26`), aber in keiner Abnahmeliste.

**Warum es zählt.** `1` ist eine unsichtbare Zusatzfunktion. Sie ist harmlos und vermutlich bequem, aber sie steht nirgends, und die Ziffernreihe ist genau der Bereich, in den eine spätere Gürtel- oder Schnellwahlfunktion greifen würde. Dann kollidiert sie stumm.

**Korrekturkosten.** Eine Zeile im Kontextblock, oder ein Kommentar an der Codestelle. Kein Verhaltenswechsel nötig.

### 15. Nebenbefund: `dist2()` liefert keine quadrierte Distanz

`index.html:958` definiert `dist2` mit `Math.sqrt`, `sqDist` (`:959`) liefert das Quadrat. Der Name legt das Gegenteil nahe. Kein Fehler im Bestand, alle Vergleiche passen (geprüft an `placeMonsters()`, wo `dist2(...) <= 8*TS` tatsächlich acht Kacheln meint). Es kostet aber jede Prüfung dieser Art einen Umweg, und die Regressionsregel „kein `Math.hypot` in Hot Paths" lädt dazu ein, genau hier falsch abzubiegen.

---

## Ungeprüft

| Was | Grund |
|---|---|
| Bankzugang von 1000 bis 1500 Gold je Schicht (F20) | Braucht eine durchgespielte Schicht. Der Gegenwert steht fest: Vollausbau **3850** (1800 + 1650 + 240 + 100 + 60). Die Entscheidung, ob das Verhältnis stimmt, ist ausdrücklich nicht Teil dieses Auftrags. |
| Frame-Budget 0,6 ms, Bake-Zeiten, alle Soak-Läufe, Ladeliste live | Messwerte. Diese Session hat das Spiel nicht gestartet, keinen Server angefasst und nichts profiliert. Die Zahlen in den Verifikationstabellen von G1 bis G5 sind daher weder bestätigt noch widerlegt. |
| GitHub-Pages-Livestand | Nicht abgerufen. |
| Optik der Touch-Oberfläche (Gürtel eine Zeile, Daumen-Fächer frei) | Nur am Gerät beurteilbar. Geprüft wurde ausschließlich, dass für jede Taste ein Bedienelement existiert. |
| 873 der 886 Manifest-Zeilen | 13 Sheets wurden gegen die Planangaben geprüft, 9 davon direkt an den IHDR-Kopfdaten der Dateien. Der Rest ist die Aussage des Werkzeugs über sich selbst. Alle 99 tatsächlich geladenen Dateien sind dagegen vollständig geprüft: Existenz, Rasterteilbarkeit, `rowStart`-Grenzen. |
| Wirkungsstärken der Flüche und Wirkungen (Faktoren wie `0.62`, `*0.25`, `0.5`) | Der Plan verspricht für keinen dieser Werte eine Zahl, er verlangt nur „mechanisch echt". Alle 48 Hooks sind belegt, ihre Balance nicht. |
| Rangsystem, Ensemble, Serien C bis F | Gehören zu W3 bis W5, die als OFFEN geführt werden. Im Code erwartungsgemäß nicht vorhanden. |
| Adversariale Gegenprobe der R-Funde | Laut Auftrag weitgehend abgegolten und nicht Gegenstand dieser Session. Unterwegs sind keine Gegenbeispiele aufgefallen; die drei R9-Aufräumfunde (F45, F68, und F1 aus R2) haben sich im Gegenteil als Ursache für vier Planabweichungen bestätigt. |

---

## Vorschlagsliste

Keiner dieser Punkte wurde umgesetzt. Die Reihenfolge ist nach Schadenspotenzial sortiert, nicht nach Aufwand.

### Plan ändern

| # | Vorschlag | Datei | Aufwand |
|---|---|---|---|
| P1 | Die Dienstsiegel-Falle in Phase 4 durch die heutige Lage ersetzen: Bonus liegt in `amt.bonusNachwachsen`, wird persistiert, Deckel 80, Untergrenze 40 Sekunden. Behoben in R2/F1. | gameplay:239 | 5 Minuten |
| P2 | `stats.goldTotal` an allen drei Stellen streichen oder als „in R9/F45 entfernt" markieren. Die Zeile in der Zählertabelle ersatzlos. | gameplay:237, gameplay:393, weltbibel:547 | 5 Minuten |
| P3 | „1 Skillpunkt pro Level-Up" im Kontextblock auf „2 Skillpunkte und 1 Zauberpunkt" korrigieren. | gameplay:25 | 1 Minute |
| P4 | G2-Notiz auf 5 Anims und 32 Frames ziehen, mit Verweis auf R9/F68. | grafik:302, grafik:320 | 5 Minuten |
| P5 | Spawn-Abstand auf 105,6 px korrigieren und den Satz über den 58-Pixel-Radius streichen oder auf Knöterichs 54,4 px umschreiben. | gameplay:260, gameplay:460 | 5 Minuten |
| P6 | Dorf-Rechteck auf 19x15 korrigieren. | grafik:781 | 1 Minute |
| P7 | `_castTable` auf 30 Einträge und 10 ungeprüfte Rigs korrigieren; die Aufzählung im selben Satz stimmte nie mit der Zahl überein. | grafik:195, grafik:210, grafik:215 | 5 Minuten |
| P8 | Confidence-Bilanz auf 442/413 aktualisieren, Ladelisten-Zahlen als Standangaben kennzeichnen (335 = Stand G5, heute 312). | grafik:217, grafik:718, grafik:915 | 5 Minuten |
| P9 | „Erst 16 Blätter" auf 18 korrigieren, mit Verweis auf die bereits erfolgte Auflösung in `blaetter:3`. | weltbibel:529 | 1 Minute |
| P10 | `n>cols` um `cfcloud` ergänzen und den Grund notieren, dass `drawSpriteAt` über `cols` umbricht. | grafik:718 | 2 Minuten |
| P11 | „13 Aufrufer" zu „13 Methoden" schärfen, in beiden Dateien. | gameplay:560, w2:253 | 2 Minuten |
| P12 | Tastenbelegung `1` in den Kontextblock aufnehmen, `m` zusätzlich in eine Abnahmeliste. | gameplay:26 | 2 Minuten |

### Code ändern

| # | Vorschlag | Ort | Aufwand | Bemerkung |
|---|---|---|---|---|
| C1 | Zuständigkeitsbereich in den Blättern A1 und A5 von VI auf VII ziehen, falls die Weltbibel gilt. | index.html:2213, :2231 plus die beiden Plandateien | 10 Minuten | **Braucht eine Kanon-Entscheidung.** Der umgekehrte Weg (VI behalten, Weltbibel anpassen) ist genauso billig, aber teurer in der Fiktion: Kapitel 16 braucht „Bereiche I bis VI" als geschlossene Menge. |
| C2 | `dist2` in `dist()` umbenennen oder einen Kommentar an die Definition setzen. | index.html:958 | 10 Minuten, 12 Aufrufstellen | Reine Lesbarkeit. Wenn umbenannt, dann in einem eigenen Commit ohne weitere Änderung. |
| C3 | `assertRigRegistrations()` optional über die ganze `SHEET_LIST` laufen lassen statt nur über `RIG_ANIM`, und die `n>cols`-Warnung erst auslösen, wenn `n > cols*(rows-rowStart)`. | index.html:6430 | 15 Minuten | Nur sinnvoll, wenn noch Grafik-Arbeit kommt. Die heutige Warnung ist bei mehrzeiligen Rastern ein Fehlalarm und schweigt gleichzeitig bei allen Nicht-Rig-Sheets. |

Nichts davon ist dringend. Der Code steht; die Reparaturphasen R1 bis R9 haben ihre Arbeit getan und dabei nur vergessen, sie an vier Stellen in die Plandokumente zurückzuschreiben. Wenn nur ein Punkt umgesetzt wird, dann P1.
