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

  // --- Z2: Proben gegen zauberAssert() -------------------------------------
  const zprobe = (name, hin, zurueck) => { hin(); const ok = zauberAssert(); zurueck(); raus.push([name, ok]); };
  zprobe('gainXP vergibt Punkte unter der Befugnisstufe',
        () => { window._eGainXP = gainXP;
                gainXP = function(x){ player.xp += x; let need = xpFuerStufe(player.level);
                  while(player.xp >= need){ player.xp -= need; player.level++; player.spellPoints += 1; need = xpFuerStufe(player.level); } }; },
        () => { gainXP = window._eGainXP; });
  zprobe('spellUnlockable ignoriert die Befugnisstufe',
        () => { window._eUnl = spellUnlockable;
                spellUnlockable = function(sp){ return !player.spellsKnown[sp.id] && player.spellPoints > 0 && sp.req.every(spellKnown); }; },
        () => { spellUnlockable = window._eUnl; });
  raus.push(['unveraenderte Zauberbefugnis (muss gruen sein)', zauberAssert()]);

  // --- S1: Proben gegen befaehigungAssert() --------------------------------
  // Vier Proben fuer die vier Zusagen von S1. Jede setzt genau den Zustand
  // wieder her, den der Bauabschnitt beseitigt hat — und der Guard muss ihn
  // wiedererkennen, sonst waere er nur Dekoration.
  const bprobe = (name, hin, zurueck) => { hin(); const ok = befaehigungAssert(); zurueck(); raus.push([name, ok]); };
  bprobe('die Stufe schenkt wieder mehr als der Punkt',
        () => { window._eRecalc = recalc;
                recalc = function(){ window._eRecalc(); derived.maxHp = 70 + (player.level-1)*12 + player.skills.vit*20; }; },
        () => { recalc = window._eRecalc; });
  bprobe('der Aufstieg heilt wieder voll',
        () => { window._eGain2 = gainXP;
                gainXP = function(x){ const vor = player.level; window._eGain2(x);
                  if(player.level > vor) player.hp = derived.maxHp; }; },
        () => { gainXP = window._eGain2; });
  bprobe('equipItemFromBag prueft den Kraftbedarf nicht mehr',
        () => { window._eEquip = equipItemFromBag;
                equipItemFromBag = function(idx){ const it = player.bag[idx]; if(!it) return;
                  player.equip[it.base.t] = it; player.bag[idx] = null; recalc(); }; },
        () => { equipItemFromBag = window._eEquip; });
  bprobe('der Grundpool traegt wieder beliebig viele Sprueche',
        () => { window._eFunke = SPELLS[0].mana; SPELLS[0].mana = 2; },
        () => { SPELLS[0].mana = window._eFunke; });
  raus.push(['unveraenderte Befaehigung (muss gruen sein)', befaehigungAssert()]);
  console.error = echt;
  return raus;
});

let offen = 0;
for(const [name, gruen] of proben){
  const letzte = name.startsWith('unveraenderte');
  const gut = letzte ? gruen : !gruen;
  if(!gut) offen++;
  console.log((gut ? 'ok       ' : 'BEFUND   ') + (letzte ? (gruen ? 'gruen    ' : 'ROT      ') : (gruen ? 'DURCHGELASSEN ' : 'gemeldet ')) + name);
}
console.log(offen ? `\n${offen} Regel(n) greifen nicht.` : '\nAlle Regeln greifen, der unveraenderte Katalog bleibt gruen.');
await browser.close();
