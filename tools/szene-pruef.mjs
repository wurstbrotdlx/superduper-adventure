// Pruefprotokoll zu Bauabschnitt SZ1 (phase-sz1-szenensystem.md).
//
//   python3 serve.py &
//   node tools/szene-pruef.mjs [URL]
//
// Braucht Playwright und einen Chromium wie die uebrigen Laeufe; PLAYWRIGHT_PFAD
// und CHROMIUM werden gelesen, wenn das Paket nicht im Projekt liegt.
//
// Geprueft wird, was SZ1 zugesagt hat. tools/empfang-pruef.mjs prueft den
// Anfang als Erzaehlung; dieser Lauf prueft die Maschine darunter:
//
//   Tabelle       jede eingetragene Szene hat Sprecher, Knoten und ein Ende,
//                 und szeneAssert() meldet sie beim Laden als in Ordnung
//   Erreichbarkeit jeder Knoten jeder Szene ist von ihrem Start aus zu
//                 erreichen, und keiner ist eine Sackgasse
//   Sprecher      ein Knoten mit wer: tauscht Portraet und Kopfzeile
//   Schluss       szeneAktiv steht auf null, sobald die Szene vorbei ist, und
//                 traegt waehrenddessen den Schluessel, nicht nur ein Ja
//   Tafeln        jedes Introblatt steht auf 390x844 vollstaendig im Bild,
//                 nichts rollt, beide Knoepfe sind erreichbar
//   Sperre        die Wortsperre gilt je Szene: der Empfang darf die spaeteren
//                 Akte nicht nennen, das Intro darf die Papiere zeigen und
//                 trotzdem keinen Namen nennen
//
// Wie die uebrigen Laeufe stellt dieser fest statt zu messen: jede Zeile ist
// ein Soll-Ist-Vergleich, Exit-Code 1 bei der ersten Abweichung.
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const { chromium } = pw;

const URL = process.argv[2] || 'http://127.0.0.1:8378/index.html';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });

const zeilen = [];
let fehl = 0;
function pruef(name, ist, soll){
  const ok = JSON.stringify(ist) === JSON.stringify(soll);
  if(!ok) fehl++;
  zeilen.push(`${ok ? 'ok  ' : 'FEHL'}  ${name.padEnd(56)} ist=${JSON.stringify(ist)} soll=${JSON.stringify(soll)}`);
}

const laut = [];
async function frisch(opt){
  const ctx = await browser.newContext(opt);
  const page = await ctx.newPage();
  page.on('pageerror', e => laut.push('pageerror: ' + String(e).slice(0, 200)));
  page.on('console', m => {
    if(m.type() !== 'error' && m.type() !== 'warning') return;
    if(m.text().includes('404')) return;   // fehlendes Sprite-Blatt ist ein Lizenzstand
    laut.push(m.type() + ': ' + m.text().slice(0, 200));
  });
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForFunction(() => typeof frameNo !== 'undefined' && frameNo > 0, null, { timeout: 60000 });
  return { page, ctx };
}

// ------------------------------------------------------------- Tabelle und Graph
{
  const { page, ctx } = await frisch({ viewport: { width: 1100, height: 800 } });

  const form = await page.evaluate(() => {
    const raus = {};
    for(const k in SZENEN){
      const d = SZENEN[k];
      raus[k] = {
        sprecher: typeof d.sprecher === 'function',
        knoten:   d.knoten && typeof d.knoten === 'object' && Object.keys(d.knoten).length > 0,
        ende:     typeof d.ende === 'function',
        sperre:   Array.isArray(d.sperre),
      };
    }
    return raus;
  });
  for(const k in form) pruef(`${k}: Tabellenform vollstaendig`, form[k],
                             {sprecher:true, knoten:true, ende:true, sperre:true});

  // Erreichbarkeit als Graph. Gerechnet wird auf der Tabelle, nicht gespielt:
  // gespielt wird der Empfang schon von empfang-pruef.mjs, und ein Graph findet
  // auch die Knoten, an die kein Spielweg fuehrt.
  //
  // Gelaufen wird bis zum Fixpunkt und nicht in zwei Momentaufnahmen. Der Grund
  // ist der Treppeneffekt: ein hub zeigt immer nur die ersten drei OFFENEN
  // Fragen, und eine Frage wird erst offen, wenn ihre Voraussetzung gestellt
  // ist. Wer einmal mit leerer und einmal mit voller Fragenmenge hinsieht,
  // sieht genau die Fragen dazwischen nie.
  const graph = await page.evaluate(() => {
    const raus = {};
    const merkKey = szeneAktiv, merkKnoten = szene.knoten, merkGefragt = szene.gefragt;
    try {
      for(const k in SZENEN){
        const d = SZENEN[k];
        const alle = new Set(Object.keys(d.knoten));
        for(const f of (d.fragen || [])) alle.add(f.key);
        const istFrage = n => (d.fragen || []).some(f => f.key === n);
        szeneAktiv = k;

        // Eingaenge: der Startknoten und jeder hub. Ein hub ist ein erklaerter
        // Wiedereinstieg, die Szene kehrt dorthin zurueck. Der Weg dorthin
        // fuehrt durch Code und nicht durch die Tabelle: beim Empfang liegt
        // zwischen der Vorstellung und dem Gruss der ganze Tafelstapel. Ein
        // Graph auf den Daten kann das nicht sehen, und ein hub, den niemand
        // aufruft, waere ohnehin ein Fund fuer den Spielverlauf und nicht fuer
        // die Tabelle: dafuer gibt es empfang-pruef.mjs.
        const erreicht = new Set([d.start]);
        for(const n in d.knoten) if(d.knoten[n].hub) erreicht.add(n);
        const gefragt = new Set();
        // Eine Antwort nennt ihr Ziel auf zwei Arten: als zu: in der Tabelle
        // oder als tun: () => szeneKnoten('x'). Die zweite ist von aussen nur
        // am Quelltext der Funktion zu erkennen. Das ist keine Spielerei: die
        // Tabelle IST Daten, und ein Knoten, den nur eine Funktion nennt, waere
        // sonst als unerreichbar gemeldet, obwohl er es nicht ist.
        const nimm = o => {
          const zt = [];
          if(o.zu) zt.push(o.zu);
          if(o.tun) for(const m of String(o.tun).matchAll(/szeneKnoten\(\s*['"]([A-Za-z0-9_]+)['"]/g)) zt.push(m[1]);
          let neu = false;
          for(const z of zt){
            if(!erreicht.has(z)){ erreicht.add(z); neu = true; }
            if(istFrage(z) && !gefragt.has(z)){ gefragt.add(z); neu = true; }
          }
          return neu;
        };

        for(let runde = 0; runde < 200; runde++){
          let neu = false;
          for(const n of [...erreicht]){
            szene.knoten = n; szene.gefragt = new Set(gefragt);
            for(const o of szeneOptionen()) if(nimm(o)) neu = true;
            const roh = d.knoten[n];
            if(roh && roh.opts) for(const o of roh.opts()) if(nimm(o)) neu = true;
          }
          if(!neu) break;
        }
        raus[k] = [...alle].filter(n => !erreicht.has(n));
      }
    } finally { szeneAktiv = merkKey; szene.knoten = merkKnoten; szene.gefragt = merkGefragt; }
    return raus;
  });
  pruef('jeder Knoten ist vom Start aus erreichbar', graph, {empfang:[]});

  // Die Wortsperre haengt an der Szene und nicht mehr am Modul.
  const sperren = await page.evaluate(() => ({
    empfangHatVolleListe: SZENEN.empfang.sperre === AKTE_SPERRE,
    namenSindTeilmenge:   AKTE_SPERRE_NAMEN.every(n => AKTE_SPERRE.includes(n)),
    namenKuerzer:         AKTE_SPERRE_NAMEN.length < AKTE_SPERRE.length,
    // Das Intro zeigt Papiere und nennt keinen Namen. Beides gegengeprueft.
    introZeigtPapiere:    INTRO_BLAETTER.some(b => (b.stimme || []).some(z => z.includes('Ausfertigung'))),
    introNenntKeinenNamen: INTRO_BLAETTER.every(b =>
      [b.blatt, b.regie, ...(b.stimme || [])].filter(Boolean)
        .every(z => AKTE_SPERRE_NAMEN.every(n => !z.includes(n)))),
  }));
  pruef('die Wortsperre haengt an der Szene', sperren,
        {empfangHatVolleListe:true, namenSindTeilmenge:true, namenKuerzer:true,
         introZeigtPapiere:true, introNenntKeinenNamen:true});

  // Der Schluessel steht waehrend der Szene da und ist danach weg.
  await page.evaluate(() => startGame());
  await page.waitForTimeout(400);
  pruef('szeneAktiv traegt den Schluessel', await page.evaluate(() => szeneAktiv), 'empfang');
  pruef('empfangAktiv ist die abgeleitete Frage', await page.evaluate(() => empfangAktiv), true);

  // Ein Sprecherwechsel tauscht Portraet und Kopfzeile. Der Empfang braucht ihn
  // nicht, die Maschine muss ihn trotzdem koennen: Szene 7 steht und faellt damit.
  const wechsel = await page.evaluate(() => {
    const vorher = document.getElementById('gespraechNameTxt').textContent;
    // toDataURL statt getImageData: derselbe Vergleich, aber ohne die
    // Canvas2D-Warnung ueber wiederholte Rueckleseoperationen. Der Lauf zaehlt
    // jede Warnung als Fund, also darf er selbst keine erzeugen.
    const c = document.getElementById('gespraechPortrait');
    const vorherBild = c.toDataURL();
    szeneSprecherSetzen('noergel');
    const nachher = document.getElementById('gespraechNameTxt').textContent;
    const nachherBild = c.toDataURL();
    return {vorher, nachher, bildAnders: vorherBild !== nachherBild};
  });
  pruef('der Sprecherwechsel setzt den Namen', wechsel.nachher, 'Nörgel, Sachbearbeiter auf Probe');
  pruef('und zeichnet ein anderes Portraet', wechsel.bildAnders, true);
  pruef('vorher stand dort Knoeterich', wechsel.vorher, 'Amtsrat a. D. Knöterich');

  await ctx.close();
}

// ------------------------------------------------------------- Die Tafeln, Telefon
{
  const { page, ctx } = await frisch({ viewport: { width: 390, height: 844 }, isMobile: true,
                                       hasTouch: true, deviceScaleFactor: 2 });
  await page.evaluate(() => startGame());
  await page.waitForTimeout(300);
  for(let i = 0; i < 5; i++){
    await page.evaluate(() => { gespraechFertigTippen(); const o = szeneOptionen(); if(o.length) o[0].tun(); });
    await page.waitForTimeout(200);
  }
  await page.waitForTimeout(300);
  const anzahl = await page.evaluate(() => INTRO_BLAETTER.length);
  const ueber = [];
  for(let i = 1; i <= anzahl; i++){
    const m = await page.evaluate(() => {
      const pan = document.getElementById('ovPanel');
      const knoepfe = [...pan.querySelectorAll('button')];
      return {rollt: pan.scrollHeight > pan.clientHeight + 2,
              knoepfe: knoepfe.length,
              drin: knoepfe.every(b => b.getBoundingClientRect().bottom <= innerHeight + 1)};
    });
    if(m.rollt || !m.drin || m.knoepfe !== 2) ueber.push(`Blatt ${i}: ${JSON.stringify(m)}`);
    await page.evaluate(n => szeneTafel(n), i);
    await page.waitForTimeout(150);
  }
  pruef('kein Introblatt laeuft auf dem Telefon ueber', ueber, []);
  pruef('nach dem letzten Blatt steht der Empfang',
        await page.evaluate(() => document.getElementById('overlay').style.display), 'none');
  pruef('und die Szene laeuft weiter', await page.evaluate(() => szeneAktiv), 'empfang');
  await ctx.close();
}

await browser.close();
console.log(zeilen.join('\n'));
if(laut.length){ console.log('\nKonsole:'); for(const l of laut) console.log('  ' + l); }
console.log(`\n${zeilen.length - fehl} von ${zeilen.length} Pruefungen bestanden.`);
process.exit(fehl || laut.length ? 1 : 0);
