// Fehlversuch zu monsterAssert() (Phase M2).
//
//   python3 serve.py &
//   node tools/monster-fehlversuch.mjs [URL]
//
// Ein Guard, der immer schweigt, beweist nichts. Dieser Lauf setzt nacheinander
// je einen Fehler in den Katalog, ruft monsterAssert() auf und schaut nach, ob
// der Guard ihn meldet. Danach wird der Fehler wieder zurueckgenommen, und am
// Ende muss der unveraenderte Katalog gruen sein.
//
// "gemeldet" ist das gewuenschte Ergebnis. "DURCHGELASSEN" heisst, dass die
// betreffende Regel nicht greift, und ist ein Befund.
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const browser = await pw.chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage();
await page.goto(process.argv[2] || 'http://127.0.0.1:8378/index.html', { waitUntil: 'load' });
await page.waitForTimeout(3500);

const proben = await page.evaluate(() => {
  const raus = [];
  // Der Guard schreibt seine Befunde nach console.error. Waehrend der Proben
  // wird das stillgelegt, sonst stuende die Konsole voll mit absichtlich
  // erzeugten Fehlern und der echte Befund ginge darin unter.
  const echt = console.error; console.error = function(){};
  const probe = (name, hin, zurueck) => { hin(); const ok = monsterAssert(); zurueck(); raus.push([name, ok]); };

  probe('Bogenmodell auf einem reinen Nahkaempfer',
        () => { MONDEF.slime._r = MONDEF.slime.rig; MONDEF.slime.rig = 'knights_archer'; },
        () => { MONDEF.slime.rig = MONDEF.slime._r; });
  probe('Nahkampfmodell auf einem Fernkaempfer',
        () => { MONDEF.mage._r = MONDEF.mage.rig; MONDEF.mage.rig = 'knights_swordman'; },
        () => { MONDEF.mage.rig = MONDEF.mage._r; });
  probe('Gegner gegen alle vier Arten immun',
        () => { MONDEF.crab._p = MONDEF.crab.res.physisch; MONDEF.crab.res.physisch = 1; },
        () => { MONDEF.crab.res.physisch = MONDEF.crab._p; });
  probe('zauberfest ohne Weichstelle gegen die Waffe',
        () => { MONDEF.mummy._p = MONDEF.mummy.res.physisch; MONDEF.mummy.res.physisch = 0.4; },
        () => { MONDEF.mummy.res.physisch = MONDEF.mummy._p; });
  probe('zauberfest und A4 zugleich',
        () => { MONDEF.golem._z = MONDEF.golem.zauberfest; MONDEF.golem.zauberfest = true; },
        () => { MONDEF.golem.zauberfest = MONDEF.golem._z; });
  probe('Sonderpruefer haelt laenger aus als ein A3',
        () => { ELITE._h = ELITE.hp; ELITE.hp = 20; },
        () => { ELITE.hp = ELITE._h; });
  probe('Sonderpruefer setzt staerker unter Druck als ein A3',
        () => { ELITE._d = ELITE.dmg; ELITE.dmg = 12; },
        () => { ELITE.dmg = ELITE._d; });
  probe('Ertragssatz des Sonderpruefers passt nicht zu A3',
        () => { ELITE._x = ELITE.xp; ELITE.xp = 3; },
        () => { ELITE.xp = ELITE._x; });
  probe('Sonderpruefer warnt kuerzer als 350 ms vor',
        () => { ELITE._w = ELITE.warnMin; ELITE._f = ELITE.warn; ELITE.warnMin = 100; ELITE.warn = 1.0; },
        () => { ELITE.warnMin = ELITE._w; ELITE.warn = ELITE._f; });
  probe('Sollroute wirkungslos (M1-Regel, Gegenprobe)',
        () => { MONDEF.slime._q = MONDEF.slime.res.physisch; MONDEF.slime.res.physisch = 1; },
        () => { MONDEF.slime.res.physisch = MONDEF.slime._q; });

  raus.push(['unveraenderter Katalog (muss gruen sein)', monsterAssert()]);
  console.error = echt;
  return raus;
});

let offen = 0;
for(const [name, gruen] of proben){
  const letzte = name.startsWith('unveraenderter');
  const gut = letzte ? gruen : !gruen;
  if(!gut) offen++;
  console.log((gut ? 'ok       ' : 'BEFUND   ') + (letzte ? (gruen ? 'gruen    ' : 'ROT      ') : (gruen ? 'DURCHGELASSEN ' : 'gemeldet ')) + name);
}
console.log(offen ? `\n${offen} Regel(n) greifen nicht.` : '\nAlle Regeln greifen, der unveraenderte Katalog bleibt gruen.');
await browser.close();
