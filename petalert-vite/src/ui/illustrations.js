/* ======================================================================
   Ilustraciones SVG de primeros auxilios (perros y gatos) y de evacuación.
   ====================================================================== */


export const ILL=(function(){
  const SKIN='#f6c9a6', SKS='#d99a72', BLU='#4a8bdd', BLD='#3a73c2', CO='#ff7a66', INK='#14305e', HON='#ffc24d', MINT='#9cc9cc';
  const PC={dog:{fur:'#d9a066',light:'#fff0d9',ear:'#a86a3a',nose:'#3b2a25'},cat:{fur:'#f4bb52',light:'#fff1cf',ear:'#e39a2f',nose:'#f08a7e'}};
  const svg=(label,body)=>'<svg viewBox="0 0 240 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+label+'"><rect width="240" height="150" rx="16" fill="#e4f1ff"/><ellipse cx="120" cy="136" rx="116" ry="18" fill="#cfe3fb"/>'+body+'</svg>';
  const arr=(x1,y1,x2,y2,c,w)=>{ c=c||CO; w=w||3; const a=Math.atan2(y2-y1,x2-x1), h=8, f=n=>n.toFixed(1);
    return '<path d="M'+x1+' '+y1+'L'+x2+' '+y2+'" stroke="'+c+'" stroke-width="'+w+'" stroke-linecap="round" fill="none"/><path d="M'+f(x2-h*Math.cos(a-.5))+' '+f(y2-h*Math.sin(a-.5))+'L'+x2+' '+y2+'L'+f(x2-h*Math.cos(a+.5))+' '+f(y2-h*Math.sin(a+.5))+'" stroke="'+c+'" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'; };
  /* brazo con manga: el punto (x,y) es el centro de la palma y rot orienta los dedos (0 = a la derecha, 90 = hacia abajo) */
  const arm=(x,y,rot,sl)=>'<g transform="translate('+x+' '+y+') rotate('+(rot||0)+')">'+
    '<rect x="-84" y="-15" width="52" height="30" rx="9" fill="'+(sl||BLU)+'"/><rect x="-38" y="-15" width="8" height="30" rx="3" fill="'+BLD+'"/>'+
    '<rect x="-30" y="-9" width="18" height="18" fill="'+SKIN+'"/>'+
    '<rect x="-16" y="-12" width="30" height="24" rx="10" fill="'+SKIN+'" stroke="'+SKS+'" stroke-width="1.5"/>'+
    [-10,-3.5,3,9.5].map(function(fy,i){ return '<rect x="6" y="'+fy+'" width="'+(22-Math.abs(i-1.5)*2)+'" height="6" rx="3" fill="'+SKIN+'" stroke="'+SKS+'" stroke-width="1.3"/>'; }).join('')+
    '<ellipse cx="-4" cy="-13" rx="9" ry="4.6" transform="rotate(-18 -4 -13)" fill="'+SKIN+'" stroke="'+SKS+'" stroke-width="1.3"/></g>';
  const gauze=(x,y,w,h,r)=>'<g transform="translate('+x+' '+y+') rotate('+(r||0)+')"><rect x="'+(-w/2)+'" y="'+(-h/2)+'" width="'+w+'" height="'+h+'" rx="4" fill="#fff" stroke="#c9d5e8" stroke-width="1.5"/><rect x="'+(-w/2+4)+'" y="'+(-h/2+4)+'" width="'+(w-8)+'" height="'+(h-8)+'" rx="2" fill="#ffe3df"/><circle cx="0" cy="0" r="'+(Math.min(w,h)/5)+'" fill="'+CO+'" opacity=".75"/></g>';
  const drop=(x,y,s)=>'<path transform="translate('+x+' '+y+') scale('+(s||1)+')" d="M0-7C3-2 5 1 5 3.500a5 5 0 0 1-10 0C-5 1-3-2 0-7z" fill="#e5483a"/>';
  const rings=(x,y)=>[8,15,22].map(function(r,i){ return '<path d="M'+(x-r*.7)+' '+(y-r*.7)+'A'+r+' '+r+' 0 0 1 '+(x+r*.7)+' '+(y-r*.7)+'" stroke="'+CO+'" stroke-width="3" fill="none" stroke-linecap="round" opacity="'+(1-i*.25)+'"/>'; }).join('');

  /* Perro tumbado de lado, cabeza a la derecha (ocupa ~190 × 62) */
  const dogLying=(x,y,sc,eyes)=>{ const p=PC.dog; return '<g transform="translate('+x+' '+y+') scale('+sc+')">'+
    '<ellipse cx="100" cy="82" rx="94" ry="6" fill="#14305e" opacity=".1"/>'+
    '<path d="M28 44Q8 40 6 20" stroke="'+p.fur+'" stroke-width="10" stroke-linecap="round" fill="none"/>'+
    '<rect x="30" y="54" width="14" height="27" rx="7" fill="'+p.ear+'"/><rect x="118" y="58" width="13" height="24" rx="6.500" fill="'+p.ear+'"/>'+
    '<ellipse cx="88" cy="50" rx="64" ry="30" fill="'+p.fur+'"/><ellipse cx="92" cy="66" rx="46" ry="13" fill="'+p.light+'" opacity=".9"/>'+
    '<rect x="46" y="58" width="15" height="24" rx="7.500" fill="'+p.fur+'"/><rect x="102" y="60" width="14" height="22" rx="7" fill="'+p.fur+'"/>'+
    '<ellipse cx="53" cy="80" rx="9" ry="4" fill="'+p.light+'"/><ellipse cx="109" cy="80" rx="8.500" ry="4" fill="'+p.light+'"/>'+
    '<circle cx="158" cy="44" r="23" fill="'+p.fur+'"/><ellipse cx="177" cy="52" rx="14" ry="10" fill="'+p.light+'"/><circle cx="188" cy="48" r="4.500" fill="'+p.nose+'"/>'+
    '<ellipse cx="146" cy="30" rx="8" ry="16" transform="rotate(22 146 30)" fill="'+p.ear+'"/>'+
    (eyes==='open'?'<circle cx="166" cy="40" r="3" fill="'+INK+'"/>':'<path d="M160 41q4 3.500 8 0" stroke="'+INK+'" stroke-width="2.200" fill="none" stroke-linecap="round"/>')+
    '<path d="M132 44a24 24 0 0 0 5 18" stroke="'+CO+'" stroke-width="5" fill="none" stroke-linecap="round"/></g>'; };
  /* Gato tumbado de lado, cabeza a la derecha (ocupa ~172 × 56) */
  const catLying=(x,y,sc,eyes)=>{ const p=PC.cat; return '<g transform="translate('+x+' '+y+') scale('+sc+')">'+
    '<ellipse cx="92" cy="78" rx="84" ry="5.500" fill="#14305e" opacity=".1"/>'+
    '<path d="M42 58Q14 66 10 42Q8 30 20 30" stroke="'+p.fur+'" stroke-width="9" stroke-linecap="round" fill="none"/>'+
    '<rect x="38" y="52" width="13" height="25" rx="6.500" fill="'+p.ear+'"/><rect x="112" y="56" width="12" height="22" rx="6" fill="'+p.ear+'"/>'+
    '<ellipse cx="86" cy="50" rx="52" ry="25" fill="'+p.fur+'"/><ellipse cx="90" cy="63" rx="38" ry="11" fill="'+p.light+'" opacity=".9"/>'+
    '<rect x="54" y="56" width="13" height="21" rx="6.500" fill="'+p.fur+'"/><rect x="100" y="58" width="12" height="19" rx="6" fill="'+p.fur+'"/>'+
    '<circle cx="146" cy="44" r="21" fill="'+p.fur+'"/><path d="M130 32L133 10L148 26Z" fill="'+p.fur+'"/><path d="M148 26L162 10L164 36Z" fill="'+p.fur+'"/><path d="M134 27L135 17L142 25Z" fill="#f7a8a0"/>'+
    '<ellipse cx="154" cy="53" rx="10" ry="7.500" fill="'+p.light+'"/><path d="M151 49h7l-3.500 4z" fill="'+p.nose+'"/>'+
    (eyes==='open'?'<circle cx="141" cy="42" r="2.800" fill="#2f8f6d"/><circle cx="156" cy="41" r="2.800" fill="#2f8f6d"/>':'<path d="M137 43q4 3.500 8 0M152 42q4 3.500 8 0" stroke="'+INK+'" stroke-width="2" fill="none" stroke-linecap="round"/>')+
    '<path d="M162 50l14-3M162 54l14 1" stroke="'+INK+'" stroke-width="1.200" stroke-linecap="round" opacity=".55"/></g>'; };

  const I={};
  /* ---- PERROS ---- */
  I.dogMuzzle=()=>{ const p=PC.dog; return svg('Bozal de emergencia con una tira de tela',
    '<ellipse cx="128" cy="130" rx="70" ry="7" fill="#14305e" opacity=".1"/>'+
    '<ellipse cx="72" cy="52" rx="16" ry="34" transform="rotate(14 72 52)" fill="'+p.ear+'"/><circle cx="102" cy="74" r="46" fill="'+p.fur+'"/>'+
    '<ellipse cx="146" cy="92" rx="38" ry="25" fill="'+p.light+'"/><circle cx="176" cy="84" r="7" fill="'+p.nose+'"/>'+
    '<circle cx="118" cy="62" r="4.500" fill="'+INK+'"/><path d="M110 51q9-6 17-1" stroke="'+p.ear+'" stroke-width="3" fill="none" stroke-linecap="round"/>'+
    '<path d="M128 78Q104 56 78 62" stroke="'+CO+'" stroke-width="8" fill="none" stroke-linecap="round"/>'+
    '<rect x="126" y="76" width="34" height="34" rx="10" fill="'+CO+'"/><path d="M130 88h26M130 98h26" stroke="#fff" stroke-width="2" opacity=".55" stroke-linecap="round"/>'+
    '<circle cx="76" cy="63" r="8" fill="#e8604c"/><path d="M72 68l-10 16M79 69l4 17" stroke="'+CO+'" stroke-width="6" stroke-linecap="round"/>'+
    arr(204,44,178,66,INK,3)+arm(212,24,150,BLU)); };
  I.dogCheck=()=>svg('Revisar respiración y pulso en el pecho del perro',
    dogLying(22,50,.95)+rings(146,52)+arm(132,78,90)+arr(190,40,190,26,CO,3)+arr(198,26,198,40,CO,3));
  I.dogBleed=()=>svg('Presionar una herida con gasa limpia',
    dogLying(22,52,.95)+gauze(123,110,26,20,-8)+drop(105,124,.9)+drop(146,126,.8)+arm(124,96,90)+arr(172,60,172,84,CO,3));
  I.dogCPR=()=>svg('Compresiones sobre el pecho con las manos apiladas',
    dogLying(20,56,.95)+arm(126,84,90,BLU)+arm(130,74,90,'#6aa5f0')+arr(184,46,184,62,CO,3)+arr(194,62,194,46,CO,3)+
    '<circle cx="58" cy="30" r="3.500" fill="'+CO+'"/><circle cx="72" cy="30" r="3.500" fill="'+CO+'" opacity=".7"/><circle cx="86" cy="30" r="3.500" fill="'+CO+'" opacity=".45"/>');
  I.dogStretcher=()=>{ const p=PC.dog; return svg('Trasladar a un perro herido sobre una manta',
    '<ellipse cx="120" cy="132" rx="84" ry="8" fill="#14305e" opacity=".12"/>'+
    '<g transform="translate(0 -14)"><path d="M28 92L212 92L226 112L14 112Z" fill="'+MINT+'"/><path d="M28 92L212 92L226 112L14 112Z" fill="none" stroke="#7fb0b3" stroke-width="2"/><path d="M50 94L44 110M90 94L86 110M130 94L128 110M170 94L172 110M208 94L212 110" stroke="#7fb0b3" stroke-width="2" opacity=".6"/>'+
    dogLying(28,34,.86,'closed').replace('<ellipse cx="100" cy="82" rx="94" ry="6" fill="#14305e" opacity=".1"/>','')+'</g>'+
    arm(14,96,-20)+'<g transform="translate(240 0) scale(-1 1)">'+arm(14,96,-20)+'</g>'+arr(120,60,120,40,CO,3)); };

  /* ---- GATOS ---- */
  I.catTowel=()=>{ const p=PC.cat; return svg('Envolver al gato en una toalla dejando la cabeza libre',
    '<ellipse cx="124" cy="128" rx="78" ry="7" fill="#14305e" opacity=".1"/>'+
    '<rect x="42" y="58" width="120" height="64" rx="32" fill="#fff"/><path d="M62 58v64M92 58v64M122 58v64" stroke="'+MINT+'" stroke-width="9" opacity=".85"/>'+
    '<rect x="42" y="58" width="120" height="64" rx="32" fill="none" stroke="#c9d5e8" stroke-width="2"/>'+
    '<circle cx="170" cy="86" r="26" fill="'+p.fur+'"/><path d="M152 72L154 46L172 64Z" fill="'+p.fur+'"/><path d="M172 64L190 48L192 76Z" fill="'+p.fur+'"/><path d="M156 66L157 54L166 64Z" fill="#f7a8a0"/>'+
    '<ellipse cx="180" cy="97" rx="12" ry="9" fill="'+p.light+'"/><path d="M176 92h8l-4 4.500z" fill="'+p.nose+'"/>'+
    '<circle cx="163" cy="82" r="3.200" fill="#2f8f6d"/><circle cx="180" cy="81" r="3.200" fill="#2f8f6d"/>'+
    arm(100,52,90)+arr(206,50,196,66,INK,3)); };
  I.catBreath=()=>svg('Observar cuántas veces respira el gato por minuto',
    catLying(24,54,1)+arr(96,44,96,30,CO,3)+arr(106,30,106,44,CO,3)+arr(116,44,116,30,CO,3)+
    '<g transform="translate(196 34)"><circle r="19" fill="#fff" stroke="'+INK+'" stroke-width="3"/><path d="M0-11V0l7 5" stroke="'+CO+'" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="-4" y="-27" width="8" height="5" rx="2" fill="'+INK+'"/></g>');
  I.catBleed=()=>svg('Presionar una herida de la pata con gasa',
    catLying(22,54,1)+gauze(122,116,22,18,-6)+drop(104,122,.8)+drop(142,124,.7)+arm(122,98,90)+arr(170,64,170,86,CO,3));
  I.catCPR=()=>svg('Compresiones con una sola mano rodeando el pecho',
    catLying(22,56,1)+'<ellipse cx="112" cy="80" rx="15" ry="4.500" fill="'+SKIN+'" stroke="'+SKS+'" stroke-width="1.300"/><ellipse cx="104" cy="82" rx="10" ry="4" fill="'+SKIN+'" stroke="'+SKS+'" stroke-width="1.300"/>'+
    arm(112,72,90)+arr(170,50,170,66,CO,3)+arr(180,66,180,50,CO,3));
  I.catCarrier=()=>{ const p=PC.cat; return svg('Llevar al gato en una transportadora cubierta con una toalla',
    '<ellipse cx="120" cy="132" rx="82" ry="7" fill="#14305e" opacity=".12"/>'+
    '<path d="M92 58Q92 32 120 32Q148 32 148 58" stroke="'+INK+'" stroke-width="7" fill="none" stroke-linecap="round"/>'+
    '<rect x="50" y="56" width="140" height="72" rx="14" fill="'+BLU+'"/><rect x="118" y="66" width="62" height="54" rx="8" fill="#14305e" opacity=".9"/>'+
    '<circle cx="138" cy="90" r="6" fill="'+p.fur+'"/><circle cx="160" cy="90" r="6" fill="'+p.fur+'"/><circle cx="138" cy="90" r="2.500" fill="#2f8f6d"/><circle cx="160" cy="90" r="2.500" fill="#2f8f6d"/><path d="M143 100h12" stroke="'+p.light+'" stroke-width="3" stroke-linecap="round"/>'+
    [126,138,150,162,174].map(function(x){ return '<path d="M'+x+' 66V120" stroke="#dfe8f7" stroke-width="2.500"/>'; }).join('')+
    '<path d="M44 58Q80 46 116 60Q124 88 118 104Q86 110 52 100Z" fill="#fff" stroke="#c9d5e8" stroke-width="2"/><path d="M62 62v36M84 58v42M104 62v36" stroke="'+MINT+'" stroke-width="7" opacity=".85"/>'+
    arm(120,24,90)); };

  /* ---- EVACUACIÓN ---- */
  I.evac=()=>{ const d=PC.dog; return svg('Salir con las mascotas por la ruta segura hacia el punto de encuentro',
    '<rect x="8" y="46" width="52" height="58" rx="6" fill="#fff"/><path d="M4 50L34 22L64 50Z" fill="'+CO+'"/><rect x="26" y="70" width="16" height="34" rx="3" fill="'+HON+'"/>'+
    '<path d="M50 118Q120 96 178 112" stroke="'+BLU+'" stroke-width="5" stroke-dasharray="2 9" stroke-linecap="round" fill="none"/>'+
    '<g transform="translate(76 76)"><circle cx="14" cy="8" r="9" fill="'+SKIN+'"/><path d="M14 18v28M14 26l-11 14M14 26l14 12M14 46l-8 20M14 46l10 20" stroke="'+BLU+'" stroke-width="6" stroke-linecap="round" fill="none"/></g>'+
    '<path d="M104 104Q118 108 132 116" stroke="'+CO+'" stroke-width="3" fill="none"/>'+
    '<g transform="translate(118 96) scale(.34)"><ellipse cx="60" cy="78" rx="52" ry="30" fill="'+d.fur+'"/><rect x="24" y="90" width="14" height="34" rx="7" fill="'+d.ear+'"/><rect x="84" y="90" width="14" height="34" rx="7" fill="'+d.ear+'"/><circle cx="118" cy="42" r="26" fill="'+d.fur+'"/><ellipse cx="136" cy="50" rx="15" ry="11" fill="'+d.light+'"/><circle cx="148" cy="46" r="5" fill="'+d.nose+'"/><ellipse cx="106" cy="26" rx="9" ry="18" fill="'+d.ear+'"/></g>'+
    '<g transform="translate(180 62)"><rect x="0" y="0" width="5" height="52" fill="'+INK+'"/><path d="M5 0h40l-10 12 10 12H5z" fill="#2fbf71"/><circle cx="2.500" cy="54" r="7" fill="'+INK+'"/></g>'+
    '<g transform="translate(60 84)"><rect x="0" y="0" width="22" height="16" rx="4" fill="'+BLU+'"/><path d="M4 0Q11-9 18 0" stroke="'+INK+'" stroke-width="2.500" fill="none"/></g>'); };
  return I;
})();
