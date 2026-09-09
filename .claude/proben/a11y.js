(() => {
  const teile = c => (c.match(/[\d.]+/g)||[255,255,255,1]).map(Number);
  const bgOf = (el) => { // Halbtransparente Schichten sauber übereinanderlegen
    let e=el, stapel=[];
    while(e){ const c=getComputedStyle(e).backgroundColor; const t=teile(c);
      const a=t.length>3?t[3]:1; if(a>0) stapel.push([t[0],t[1],t[2],a]); if(a>=1) break; e=e.parentElement; }
    if(!stapel.length) return 'rgb(255, 255, 255)';
    let [r,g,b]=stapel[stapel.length-1].slice(0,3);
    for(let i=stapel.length-2;i>=0;i--){ const [R,G,B,A]=stapel[i];
      r=A*R+(1-A)*r; g=A*G+(1-A)*g; b=A*B+(1-A)*b; }
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`; };
  const lum = (c) => { const [r,g,b]=teile(c).slice(0,3).map(v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)}); return 0.2126*r+0.7152*g+0.0722*b; };
  const kontrast = (a,b) => { const l1=lum(a),l2=lum(b); return +(((Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05))).toFixed(2); };

  const ueberschriften=[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h=>h.tagName);
  let letzte=0, spruenge=[];
  ueberschriften.forEach(t=>{const n=+t[1]; if(letzte && n>letzte+1) spruenge.push(t); letzte=n;});
  const bilder=[...document.images];
  const felder=[...document.querySelectorAll('input,textarea,select')].filter(f=>f.type!=='hidden');
  const klickbar=[...document.querySelectorAll('a,button,input[type=submit],[role=button]')];
  // Links mitten im Fließtext sind von der Mindestgröße ausgenommen (WCAG 2.5.8)
  const imFliesstext = e => { const p=e.closest('p,li,figcaption'); return !!p && p.textContent.trim().length > e.textContent.trim().length + 12; };
  const zuKlein=klickbar.filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && (r.height<40||r.width<40) && !imFliesstext(e);})
    .map(e=>(e.textContent||e.value||e.tagName).trim().slice(0,26)+' '+Math.round(e.getBoundingClientRect().width)+'x'+Math.round(e.getBoundingClientRect().height));
  const proben=[...document.querySelectorAll('p,li,h1,h2,h3,figcaption,.label,.leise,a,button,span,strong')].filter(e=>e.offsetParent && e.textContent.trim().length>2).slice(0,500);
  const schwach=[];
  proben.forEach(e=>{ const cs=getComputedStyle(e); const k=kontrast(cs.color,bgOf(e));
    const px=parseFloat(cs.fontSize); const fett=parseInt(cs.fontWeight)>=700;
    const grenze=(px>=24||(px>=18.66&&fett))?3:4.5;
    if(k<grenze) schwach.push({t:e.textContent.trim().slice(0,34),k,px:+px.toFixed(1),grenze});
  });
  return { lang:document.documentElement.lang, titel:document.title.length,
    ebenenspruenge:spruenge, bilder:bilder.length,
    ohneAlt:bilder.filter(i=>!i.getAttribute('alt')).length,
    felder:felder.length, ohneLabel:felder.filter(f=>!f.labels?.length && !f.getAttribute('aria-label') && !f.getAttribute('aria-hidden')).length,
    zuKleinGesamt:zuKlein.length, zuKleineZiele:zuKlein.slice(0,6),
    kontrastGesamt:schwach.length, schwacherKontrast:schwach.slice(0,6),
    landmarks:{main:!!document.querySelector('main'),header:!!document.querySelector('header'),footer:!!document.querySelector('footer'),nav:!!document.querySelector('nav')},
    skipLink:!!document.querySelector('.skip') };
})()
