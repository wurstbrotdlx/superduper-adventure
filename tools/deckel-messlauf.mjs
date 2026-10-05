// Messlauf zu DZ1 (phase-dz1-zweite-zeile.md): wie lang darf die zweite Zeile
// einer Sprechblase sein, ohne dass Tafel oder Blase brechen?
//
//   python3 serve.py &
//   PLAYWRIGHT_PFAD=... CHROMIUM=... node tools/deckel-messlauf.mjs [URL]
//
// Er misst und prueft nichts: er stellt je Format (390x844, 844x390, 1280x720,
// dieselben drei wie RL7) und je Schriftstufe die laengste echte erste Zeile
// aus DORF_FIGUREN neben eine zweite Zeile von 32 bis 52 Zeichen und meldet:
//
//   Tafel   wie viele Textzeilen das Satzfeld braucht, ob es rollt (scrollHeight
//           ueber clientHeight), und ob die ganze Tafel noch ins Fenster passt
//   Blase   die Breite der Canvas-Blase in CSS-Pixeln gegen die Breite der
//           Leinwand; die Blase bricht nicht um, sie wird breiter
//
// Der Deckel der ersten Zeile steht seit W3 auf 48. Eine zweite Zeile bis 48
// macht die Blase deshalb nie breiter als der schlimmste Fall, der schon heute
// erlaubt ist. Was sich aendern kann, ist die Tafel.
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const { chromium } = pw;
const URL = process.argv[2] || 'http://127.0.0.1:8378/index.html';
const FORMATE = [[390, 844], [844, 390], [1280, 720]];
const LAENGEN = [32, 36, 40, 44, 48, 52];
// Ein echter Satz im Ton des Hauses, auf Laenge geschnitten. Courier New ist
// dicktengleich, die Zeichenwahl aendert die Breite also nicht, nur den Umbruch.
const SATZ = 'Vierzig Jahre auf Probe, und zwar mit Begründung, ordnungsgemäß vermerkt.';
const z2von = n => SATZ.slice(0, n);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const laut = [];
for(const [w, h] of FORMATE){
  const ctx = await browser.newContext({ viewport: {width: w, height: h}, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('pageerror', e => laut.push(`${w}x${h} pageerror: ${String(e).slice(0, 200)}`));
  await page.goto(URL, {waitUntil: 'load'});
  await page.evaluate(() => localStorage.clear());
  await page.goto(URL, {waitUntil: 'load'});
  await page.waitForFunction(() => typeof frameNo !== 'undefined' && frameNo > 0, null, {timeout: 60000});
  // Derselbe Weg ins Dorf wie in abzug-messlauf.mjs: Empfang, Ernennung,
  // Amtsstube, hinaus.
  await page.evaluate(() => startGame());
  await page.waitForTimeout(800);
  await page.evaluate(() => empfangErnennung());
  await page.waitForTimeout(300);
  await page.evaluate(() => { szeneTafelLauf = null; ernennungEnde(); });
  await page.waitForTimeout(600);
  await page.evaluate(() => verlasseHaus());
  await page.waitForTimeout(800);
  for(const stufe of [0, 1, 2]){
    for(const n of LAENGEN){
      const r = await page.evaluate(({stufe, z2}) => {
        schriftSetzen(stufe);
        const f = npcs.find(x => x.figur && x.key !== 'knoeterich');
        player.x = f.x + 20; player.y = f.y; camSnap();
        if(!gespraechOffen || gespraech.npc !== f) gespraechOeffnen(f);
        // die laengste echte erste Zeile, damit der Vergleich ehrlich ist
        let z1 = '';
        for(const fig of DORF_FIGUREN) for(const p of fig.grund) if(p.z1.length > z1.length) z1 = p.z1;
        gespraechSagen(z1, z2); gespraechFertigTippen();
        const feld = el('gespraechText'), tafel = el('gespraech');
        const lh = parseFloat(getComputedStyle(feld).lineHeight);
        const rect = tafel.getBoundingClientRect();
        // Blase: gleiche Rechnung wie drawBubble()
        ctx.save(); ctx.font = BLASE_FONT;
        const blase = Math.max(ctx.measureText(z1).width, ctx.measureText(z2).width) + 16;
        ctx.restore();
        const cv = document.querySelector('canvas');
        const css = cv.getBoundingClientRect().width / cv.width;   // Leinwandpixel -> CSS-Pixel
        return { z1len: z1.length, zeilen: Math.round(feld.scrollHeight / lh), rollt: feld.scrollHeight > feld.clientHeight + 1,
                 tafelUnten: Math.round(rect.bottom), fenster: innerHeight,
                 blaseCss: Math.round(blase * css), leinwandCss: Math.round(cv.getBoundingClientRect().width) };
      }, {stufe, z2: z2von(n)});
      console.log(`${w}x${h}  Stufe ${stufe}  z2=${String(n).padStart(2)}  Satzfeld ${r.zeilen} Zeilen${r.rollt ? ' ROLLT' : ''}  Tafel unten ${r.tafelUnten}/${r.fenster}${r.tafelUnten > r.fenster ? ' UEBER' : ''}  Blase ${r.blaseCss}/${r.leinwandCss} px${r.blaseCss > r.leinwandCss ? ' ZU BREIT' : ''}`);
    }
  }
  await ctx.close();
}
await browser.close();
if(laut.length) console.log('\nKonsole:\n' + laut.join('\n'));
