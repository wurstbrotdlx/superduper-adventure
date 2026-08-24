// Fehlversuch zu steinbruchAssert() (Bauabschnitt G12).
//
//   python3 serve.py &
//   node tools/steinbruch-fehlversuch.mjs [URL]
//
// Ein Guard, der immer schweigt, beweist nichts (M2-Lehre, s.
// tools/monster-fehlversuch.mjs). Dieser Lauf setzt nacheinander je einen
// Fehler in die gesetzte Welt, ruft steinbruchAssert() auf und schaut nach, ob
// der Guard ihn meldet. Danach wird der Eingriff zurueckgenommen, und am Ende
// muss die unveraenderte Welt gruen sein.
//
// Anders als beim Monsterkatalog steht hier keine Tabelle zum Verbiegen: der
// Guard misst die WELT. Also wird die Welt verbogen — ein Vogel an Land, eine
// Seerose ans Ufer, ein Kapybara an den Rand.
//
// "gemeldet" ist das gewuenschte Ergebnis. "DURCHGELASSEN" heisst, dass die
// betreffende Regel nicht greift, und ist ein Befund.
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const browser = await pw.chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage();
const seitenfehler = [];
page.on('pageerror', e => seitenfehler.push(String(e).slice(0, 200)));
await page.goto(process.argv[2] || 'http://127.0.0.1:8378/index.html', { waitUntil: 'load' });
await page.waitForFunction(() => typeof frameNo !== 'undefined' && frameNo > 0, null, { timeout: 60000 });

const proben = await page.evaluate(() => {
  const raus = [];
  const echt = console.error; console.error = function(){};
  const probe = (name, hin, zurueck) => { hin(); const ok = steinbruchAssert(); zurueck(); raus.push([name, ok]); };

  // Eine Landkachel und eine offene Wasserkachel suchen, auf die verschoben wird.
  const b = BUCHTEN[0];
  let land = null, offen = null, rand = null;
  for(let j=-8; j<=8 && !(land && offen && rand); j++) for(let i=-8; i<=8; i++){
    const tx = b.tx+i, ty = b.ty+j;
    if(!land && walkT(tx, ty)) land = [tx, ty];
    if(T(tx, ty) !== G_OCEAN) continue;
    const amRand = !wasserT(tx+1,ty) || !wasserT(tx-1,ty) || !wasserT(tx,ty+1) || !wasserT(tx,ty-1);
    if(amRand){ if(!rand) rand = [tx, ty]; }
    else if(!offen) offen = [tx, ty];
  }
  if(!land || !offen || !rand) return [['Vorbereitung: Land, offenes Wasser und Randkachel gefunden', false]];

  const vogel = critters.find(c => c.lebensraum === 'wasser' && !c.kapy);
  probe('Wasservogel an Land gesetzt',
        () => { vogel._x = vogel.x; vogel._y = vogel.y; vogel.x = land[0]*TS+16; vogel.y = land[1]*TS+16; },
        () => { vogel.x = vogel._x; vogel.y = vogel._y; });
  probe('Wasservogel ohne Revier',
        () => { vogel._r = vogel.revier; vogel.revier = null; },
        () => { vogel.revier = vogel._r; });

  const frosch = critters.find(c => c.lebensraum === 'ufer');
  probe('Ufertier vom Wasser weggesetzt',
        () => { frosch._x = frosch.x; frosch._y = frosch.y;
                // eine Landkachel ohne Wasser ringsum suchen
                for(let j=-30; j<=30; j++) for(let i=-30; i<=30; i++){
                  const tx = Math.floor(frosch._x/TS)+i, ty = Math.floor(frosch._y/TS)+j;
                  if(!walkT(tx, ty)) continue;
                  if(wasserT(tx+1,ty) || wasserT(tx-1,ty) || wasserT(tx,ty+1) || wasserT(tx,ty-1)) continue;
                  frosch.x = tx*TS+16; frosch.y = ty*TS+16; return;
                } },
        () => { frosch.x = frosch._x; frosch.y = frosch._y; });

  const kapy = critters.find(c => c.kapy);
  probe('Kapybara an den Buchtrand gesetzt',
        () => { kapy._x = kapy.x; kapy._y = kapy.y; kapy.x = rand[0]*TS+16; kapy.y = rand[1]*TS+16; },
        () => { kapy.x = kapy._x; kapy.y = kapy._y; });

  const rose = decos.find(d => d.sheet && d.sheet.startsWith('cfwp_rose'));
  probe('Seerose ans Ufer gelegt',
        () => { rose._x = rose.x; rose._y = rose.y; rose.x = rand[0]*TS + TS/2; rose.y = (rand[1]+1)*TS; },
        () => { rose.x = rose._x; rose.y = rose._y; });

  const schilf = decos.find(d => d.sheet && d.sheet.startsWith('cfwp_schilf'));
  probe('Schilf ins offene Wasser gestellt',
        () => { schilf._x = schilf.x; schilf._y = schilf.y; schilf.x = offen[0]*TS + TS/2; schilf.y = (offen[1]+1)*TS; },
        () => { schilf.x = schilf._x; schilf.y = schilf._y; });

  probe('Wasserpflanze an Land gestellt',
        () => { schilf._x = schilf.x; schilf._y = schilf.y; schilf.x = land[0]*TS + TS/2; schilf.y = (land[1]+1)*TS; },
        () => { schilf.x = schilf._x; schilf.y = schilf._y; });

  probe('zwei Buchten uebereinandergeschoben',
        () => { BUCHTEN[1]._x = BUCHTEN[1].tx; BUCHTEN[1]._y = BUCHTEN[1].ty;
                BUCHTEN[1].tx = BUCHTEN[0].tx + 3; BUCHTEN[1].ty = BUCHTEN[0].ty; },
        () => { BUCHTEN[1].tx = BUCHTEN[1]._x; BUCHTEN[1].ty = BUCHTEN[1]._y; });

  raus.push(['unveraenderte Welt (muss gruen sein)', steinbruchAssert()]);
  console.error = echt;
  return raus;
});

let durchgelassen = 0;
for(const [name, ok] of proben){
  const letzte = name.startsWith('unveraenderte');
  const gut = letzte ? ok === true : ok === false;
  if(!gut) durchgelassen++;
  console.log(`${gut ? (letzte ? 'gruen       ' : 'gemeldet    ') : 'DURCHGELASSEN'} ${name}`);
}
if(seitenfehler.length) console.log(`\n(Seitenfehler: ${seitenfehler[0]})`);
await browser.close();
if(durchgelassen){ console.error(`\n${durchgelassen} Probe(n) nicht gemeldet.`); process.exit(1); }
console.log(`\n${proben.length - 1} Eingriffe, alle gemeldet, Welt danach gruen.`);
