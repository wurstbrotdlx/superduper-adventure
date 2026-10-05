// Pruefprotokoll zu Bauabschnitt DZ1 (phase-dz1-zweite-zeile.md): der Deckel
// der zweiten Zeile, und die Blase, die ihn tragen muss.
//
//   python3 serve.py &
//   PLAYWRIGHT_PFAD=... CHROMIUM=... node tools/blase-pruef.mjs [URL]
//
// Drei Formate wie RL7 (390x844, 844x390, 1280x720), deviceScaleFactor 1.
// Geprueft wird, was ein Eingriff an drawBubble() oder am Deckel verstellen
// wuerde:
//
//   der Deckel      BLASE_Z2 steht auf 48, Knoeterichs Tastenhinweise
//                   bleiben bei 32 (Quelltext, nicht Laufzeit)
//   die Rechnung    blasenMass() fuer die laengste echte erste Zeile und eine
//                   zweite mit 48 Zeichen: auf jedem Format und jeder
//                   Schriftstufe so breit, dass sie mit Rand ins Bild passt;
//                   am Schirm bei Stufe Normal kein Umbruch (zwei Zeilen);
//                   Zeilenabstand mindestens die Schriftgroesse
//   das Bild        eine echte Blase im Dorf, gezeichnet in einem echten
//                   Frame: ihr Kasten liegt ganz in der Leinwand, sie wird
//                   nach den Namensschildern gezeichnet, und das Schild der
//                   sprechenden Figur steht ueber ihrer Oberkante
//   die Tafel       erste und zweite Zeile mit je 48 Zeichen rollt bei Stufe
//                   Normal und Mittel in keinem Format
//   Konsole still
//
// Der Lauf stellt fest statt zu messen; Exit-Code 1 bei einer Abweichung.
// Messen tut tools/deckel-messlauf.mjs.
import fs from 'node:fs';
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const { chromium } = pw;
const URL = process.argv[2] || 'http://127.0.0.1:8378/index.html';
const FORMATE = [[390, 844], [844, 390], [1280, 720]];
const Z2_48 = 'Vierzig Jahre auf Probe, mit Begründung, vermerk';   // 48 Zeichen
const zeilen = []; let fehl = 0;
function pruef(name, ist, soll){
  const ok = JSON.stringify(ist) === JSON.stringify(soll);
  if(!ok) fehl++;
  zeilen.push(`${ok ? 'ok  ' : 'FEHL'}  ${name.padEnd(64)} ist=${JSON.stringify(ist)} soll=${JSON.stringify(soll)}`);
}

// --- Quelltext -------------------------------------------------------------
const s04 = fs.readFileSync('skript/04-magie-und-zulagen.js', 'utf8');
pruef('BLASE_Z2 steht auf 48', /const BLASE_Z2 = 48;/.test(s04), true);
pruef('Grundzeilen der Figuren laufen ueber BLASE_Z2', s04.includes('for(const p of fig.grund) rows.push([p.z1,48],[p.z2,BLASE_Z2]);'), true);
pruef('Knoeterichs Tastenhinweise bleiben bei 32', s04.includes('for(const h of HINWEISE) rows.push([h.z1,48],[h.z2,32],[h.z2t,32]);'), true);
pruef('Pruefstring hat 48 Zeichen', Z2_48.length, 48);

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const laut = [];
for(const [w, h] of FORMATE){
  const ctx = await browser.newContext({ viewport: {width: w, height: h}, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('pageerror', e => laut.push(`${w}x${h} pageerror: ${String(e).slice(0, 200)}`));
  page.on('console', m => {
    if(m.type() !== 'error' && m.type() !== 'warning') return;
    if(m.text().includes('404') || m.text().includes('Sprite fehlt')) return;
    laut.push(`${w}x${h} ${m.type()}: ${m.text().slice(0, 200)}`);
  });
  await page.goto(URL, {waitUntil: 'load'});
  await page.evaluate(() => localStorage.clear());
  await page.goto(URL, {waitUntil: 'load'});
  await page.waitForFunction(() => typeof frameNo !== 'undefined' && frameNo > 0, null, {timeout: 60000});
  // Ins Dorf wie abzug-messlauf.mjs
  await page.evaluate(() => startGame());                               await page.waitForTimeout(800);
  await page.evaluate(() => empfangErnennung());                        await page.waitForTimeout(300);
  await page.evaluate(() => { szeneTafelLauf = null; ernennungEnde(); }); await page.waitForTimeout(600);
  await page.evaluate(() => verlasseHaus());                            await page.waitForTimeout(800);

  // --- die Rechnung, je Schriftstufe ---------------------------------------
  const rechnung = await page.evaluate((z2) => {
    let z1 = ''; for(const fig of DORF_FIGUREN) for(const p of fig.grund) if(p.z1.length > z1.length) z1 = p.z1;
    const out = [];
    for(const st of [0, 1, 2]){
      schriftSetzen(st);
      ctx.save(); ctx.font = BLASE_FONT;
      const m = blasenMass(z1, z2);
      ctx.restore();
      const px = parseFloat(BLASE_FONT.match(/([\d.]+)px/)[1]);
      out.push({st, passt: m.w <= canvas.width - 2 * BLASE_RAND, zeilen: m.zeilen.length, abstand: m.lh >= px, z1len: z1.length});
    }
    return out;
  }, Z2_48);
  for(const r of rechnung)
    pruef(`${w}x${h} Stufe ${r.st}: Blase passt ins Bild, Abstand >= Schrift`, [r.passt, r.abstand], [true, true]);
  if(w === 1280) pruef('1280x720 Stufe 0: am Schirm kein Umbruch', rechnung[0].zeilen, 2);
  if(w === 390)  pruef('390x844 Stufe 1: hochkant bricht die Blase um', rechnung[1].zeilen > 2, true);

  // --- das Bild: ein echter Frame -------------------------------------------
  const bild = await page.evaluate(async (z2) => {
    schriftSetzen(1);
    const f = npcs.find(x => x.figur && x.key === 'zwirn');
    player.x = f.x + 60; player.y = f.y + 60; camSnap();
    let z1 = ''; for(const fig of DORF_FIGUREN) for(const p of fig.grund) if(p.z1.length > z1.length) z1 = p.z1;
    f.bubbleText1 = z1; f.bubbleText2 = z2; f.bubbleHideAt = gameT + 999;
    // Mitschreiben, ohne etwas zu aendern: Reihenfolge der Ausgaben, der Kasten
    // der Blase (in Leinwandpixeln) und die Hoehe des Zwirn-Schildes.
    const spur = [], kasten = []; let schildY = null;
    const origFlush = npcSchildFlush, origBubble = drawBubble, origRR = ctx.roundRect, origFT = ctx.fillText;
    let inSchild = false;
    window.npcSchildFlush = function(){ spur.push('schild'); inSchild = true; try { return origFlush.apply(this, arguments); } finally { inSchild = false; } };
    window.drawBubble = function(){ spur.push('blase'); return origBubble.apply(this, arguments); };
    ctx.roundRect = function(x, y, bw, bh){ const t = ctx.getTransform(); kasten.push({l: x + t.e, r: x + bw + t.e, o: y + t.f, u: y + bh + t.f, oWelt: y}); return origRR.apply(this, arguments); };
    ctx.fillText = function(text, x, y){ if(inSchild && text === f.figur.kurz && ctx.fillStyle !== '#000000') schildY = y; return origFT.apply(this, arguments); };
    const n0 = frameNo;
    await new Promise(r => { const t = () => frameNo > n0 + 1 ? r() : requestAnimationFrame(t); t(); });
    window.npcSchildFlush = origFlush; window.drawBubble = origBubble; ctx.roundRect = origRR; ctx.fillText = origFT;
    f.bubbleHideAt = 0;
    const b = kasten[kasten.length - 1];
    return {spur: spur.slice(-2), drin: !!b && b.l >= 0 && b.r <= canvas.width && b.o >= 0 && b.u <= canvas.height,
            schildDrueber: !!b && schildY !== null && schildY < b.oWelt};
  }, Z2_48);
  pruef(`${w}x${h}: Blase nach den Schildern gezeichnet`, bild.spur, ['schild', 'blase']);
  pruef(`${w}x${h}: Kasten der Blase liegt ganz in der Leinwand`, bild.drin, true);
  pruef(`${w}x${h}: Schild der Figur steht ueber ihrer Blase`, bild.schildDrueber, true);

  // --- die Tafel --------------------------------------------------------------
  const tafel = await page.evaluate((z2) => {
    const f = npcs.find(x => x.figur && x.key === 'zwirn');
    player.x = f.x + 20; player.y = f.y; camSnap();
    gespraechOeffnen(f);
    let z1 = ''; for(const fig of DORF_FIGUREN) for(const p of fig.grund) if(p.z1.length > z1.length) z1 = p.z1;
    const out = [];
    for(const st of [0, 1]){
      schriftSetzen(st);
      gespraechSagen(z1, z2); gespraechFertigTippen();
      const feld = el('gespraechText');
      out.push(feld.scrollHeight > feld.clientHeight + 1);
    }
    gespraechSchliessen();
    return out;
  }, Z2_48);
  pruef(`${w}x${h}: Tafel rollt bei 48/48 nicht (Normal, Mittel)`, tafel, [false, false]);
  await ctx.close();
}
await browser.close();
pruef('Konsole still', laut, []);
console.log(zeilen.join('\n'));
console.log(`\n${zeilen.length - fehl} von ${zeilen.length} Pruefungen bestanden.`);
process.exit(fehl ? 1 : 0);
