/* ======================================================================
   Interfaz: HUD, indicador sismógrafo, paneles, puntos interactivos, tarjeta flotante, temporizador y avisos.
   ====================================================================== */
import * as THREE from 'three';
import { rt } from '../core/runtime.js';
import { audio } from '../core/audio.js';
import { $, $$, clamp, coarse, damp, el } from '../core/utils.js';
import { CONTENT } from '../data/content.js';
import { cam } from '../game/camera.js';
import { player } from '../game/player.js';
import { Q } from '../game/quake.js';
import { STEPS } from '../steps/steps.js';
import { catSprites } from '../three/actors.js';
import { camera, world } from '../three/engine.js';

const HS=[];
export const state={done:new Set(),sizes:new Set(),greeted:false};

const ICONS={
  cross:'<path d="M12 5v14M5 12h14"/>',drop:'<path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z"/>',eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  paw:'<circle cx="7" cy="10" r="2"/><circle cx="17" cy="10" r="2"/><circle cx="10.5" cy="5.5" r="2"/><circle cx="13.5" cy="5.5" r="2"/><path d="M12 12c-3 0-6 3-6 6 0 2 2 2 3 1.5s2-.7 3-.7 2 .2 3 .7 3 .5 3-1.5c0-3-3-6-6-6z"/>',
  door:'<path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17M4 21h16"/><circle cx="14.5" cy="12" r=".8"/>',phone:'<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  pin:'<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',kit:'<rect x="3" y="7" width="18" height="13" rx="3"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M12 10.5v6M9 13.5h6"/>',
  shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/>',pulse:'<path d="M3 12h4l2-5 4 10 2-5h6"/>',heart:'<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.500-7 10-7 10z"/>',
  doc:'<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>',hand:'<path d="M8 12V6a1.500 1.500 0 0 1 3 0v5m0-6a1.500 1.500 0 0 1 3 0v6m0-4a1.500 1.500 0 0 1 3 0v7a6 6 0 0 1-6 6h-1a5 5 0 0 1-4-2l-3-4a1.500 1.500 0 0 1 2.500-1.500L8 15"/>',
  no:'<circle cx="12" cy="12" r="9"/><path d="M6 18L18 6"/>'
};

export const icon=n=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+ICONS[n]+'</svg>';

export const PETSVG={
  dog:'<svg class="pet" viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="14" cy="30" rx="8" ry="15" fill="#a86a3a" transform="rotate(12 14 30)"/><ellipse cx="50" cy="30" rx="8" ry="15" fill="#a86a3a" transform="rotate(-12 50 30)"/><circle cx="32" cy="32" r="20" fill="#d9a066"/><ellipse cx="32" cy="40" rx="10" ry="8" fill="#fff0d9"/><circle cx="25" cy="29" r="2.600" fill="#1c2233"/><circle cx="39" cy="29" r="2.600" fill="#1c2233"/><ellipse cx="32" cy="37" rx="3.400" ry="2.400" fill="#3b2a25"/></svg>',
  cat:'<svg class="pet" viewBox="0 0 64 64" aria-hidden="true"><polygon points="12,26 14,4 30,16" fill="#f4bb52"/><polygon points="52,26 50,4 34,16" fill="#f4bb52"/><circle cx="32" cy="35" r="21" fill="#f4bb52"/><ellipse cx="32" cy="42" rx="9" ry="7" fill="#fff1cf"/><circle cx="24" cy="32" r="3" fill="#2f8f6d"/><circle cx="40" cy="32" r="3" fill="#2f8f6d"/><ellipse cx="32" cy="38" rx="2.500" ry="1.800" fill="#ff9aa8"/></svg>'
};

export function setBG(name){ $$('#bg i').forEach(i=>i.classList.toggle('on',i.dataset.bg===name)); }

export function updateTip(){
  const el=$('#tip'); if(!rt.tipState||el.hidden)return;
  const w=innerWidth,h=innerHeight;
  if(w<=820){ el.classList.add('dock'); el.style.transform=''; return; }
  el.classList.remove('dock');
  _v.setFromMatrixPosition(rt.tipState.anchor.matrixWorld).project(camera);
  const px=(_v.x*.5+.5)*w, py=(-_v.y*.5+.5)*h, tw=el.offsetWidth, th=el.offsetHeight, gap=Math.max(80,h*.15);
  let x=px+gap, left=false; if(x+tw>w-16){ x=px-gap-tw; left=true; }
  x=clamp(x,16,w-tw-16); const y=clamp(py-th/2,96,Math.max(96,h-th-16));
  el.classList.toggle('left',left); el.style.setProperty('--ay',clamp(py-y,18,th-18)+'px'); el.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px)';
}

export function showTimer(on){ $('#timer').hidden=!on; }

export function setTimer(left,total){ const t=$('#timer'); t.querySelector('b').textContent=Math.max(0,Math.ceil(left)); t.querySelector('u').style.transform='scaleX('+clamp(left/total,0,1)+')'; t.classList.toggle('low',left<=6); }

export function objective(t,s){ const o=$('#objective'); if(!t){ o.hidden=true; return; } $('strong',o).textContent=t; $('small',o).textContent=s||''; $('small',o).hidden=!s; o.hidden=false; }

export function setBeacon(x,z,y){ const b=world.beacon; if(x==null){ b.visible=false; return; } b.position.set(x,0,z); b.visible=true; b.userData.baseY=(y==null?1.2:y); }

export function setInteract(o){ rt.interact=o; }

export function clearHS(){ HS.forEach(h=>h.b.remove()); HS.length=0; }

export function addHS(o){
  const b=el('button','hs '+(o.cls||'dot')); b.type='button'; b.setAttribute('aria-label',o.aria||o.label||('Punto '+(o.num||'')));
  b.innerHTML=(o.cls==='pill')?'<span>'+o.label+'</span>':'<i></i>'+(o.num?'<b>'+o.num+'</b>':'');
  b.addEventListener('click',e=>{ e.stopPropagation(); if(o.onClick)o.onClick(b); });
  $('#hotspots').appendChild(b); HS.push({b:b,anchor:o.anchor}); return b;
}

const _v=new THREE.Vector3();

export function updateHS(){
  const w=innerWidth,h=innerHeight;
  HS.forEach(o=>{ _v.setFromMatrixPosition(o.anchor.matrixWorld).project(camera); const vis=_v.z<1;
    o.b.style.display=vis?'':'none'; if(vis)o.b.style.transform='translate('+((_v.x*.5+.5)*w).toFixed(1)+'px,'+((-_v.y*.5+.5)*h).toFixed(1)+'px) translate(-50%,-50%)'; });
}

export function panel(o){
  const p=$('#panel'); p.className='card '+(o.cls||''); p.hidden=false;
  p.innerHTML=(o.title?'<h2>'+o.title+'</h2>':'')+(o.text?'<p>'+o.text+'</p>':'')+(o.html||'')+((o.actions&&o.actions.length)?'<div class="actions"></div>':'');
  const box=$('.actions',p);
  (o.actions||[]).forEach(a=>{ const b=el('button','btn'+(a.ghost?' ghost':'')); b.textContent=a.label; b.disabled=!!a.disabled; b.addEventListener('click',()=>{ audio.blip(); a.fn(); }); box.appendChild(b); a.el=b; });
  return p;
}

export function screen(html){ const d=$('#dyn'); d.innerHTML=html; d.classList.add('active'); return d; }

export function showHint(kind){
  const h=$('#hint'); if(!kind||coarse){ h.hidden=true; return; }
  h.innerHTML=(kind==='fp'?'<span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> moverte</span><span><kbd>←</kbd><kbd>→</kbd> o arrastra para mirar</span>':'<span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> moverte</span><span><kbd>Espacio</kbd> cubrirte</span>')+'<span><kbd>E</kbd> interactuar</span>';
  h.hidden=false;
}

export function hideUI(){
  $('#panel').hidden=true; $('#dyn').classList.remove('active'); $('#dyn').innerHTML=''; $('#home').classList.remove('active'); $('#callouts').hidden=true; $('#callouts').innerHTML='';
  $('#tip').hidden=true; rt.tipState=null; cam.follow=null; $('#hotspots').style.visibility=''; $('#timer').hidden=true;
  clearHS(); objective(null); setBeacon(null); setInteract(null); showHint(null); $('#prompt').hidden=true; $('#stick').hidden=true; $('#coverBtn').hidden=true; $('#quakeBanner').hidden=true;
  catSprites.forEach(s=>s.visible=false);
}

/* Progreso: sismograma que se calma o se agita según la etapa */
const seis={len:1,p:0,tp:0};

export function buildSeismo(){
  let a=1831; const r=()=>{ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return((t^t>>>14)>>>0)/4294967296; };
  const W=460,mid=20,N=170, amp=[1,2.5,17,9,.8]; let d='M0 '+mid;
  for(let i=1;i<=N;i++){ const f=i/N, seg=Math.min(4,Math.floor(f*5)), loc=f*5-seg; let A=amp[seg];
    if(seg===2)A=17*(1-.25*loc); if(seg===3)A=10*(1-loc*.85);
    d+=' L'+(f*W).toFixed(1)+' '+(mid+(r()-.5)*2*A).toFixed(1); }
  $('#sBase').setAttribute('d',d); $('#sFill').setAttribute('d',d);
  seis.len=$('#sFill').getTotalLength(); $('#sFill').style.strokeDasharray=seis.len; $('#sFill').style.strokeDashoffset=seis.len;
}

export function updateSeismo(dt){
  seis.p=damp(seis.p,seis.tp,3,dt); const L=seis.len;
  $('#sFill').style.strokeDashoffset=L*(1-seis.p); const pt=$('#sFill').getPointAtLength(L*clamp(seis.p,.001,1)); $('#sDot').setAttribute('cx',pt.x); $('#sDot').setAttribute('cy',pt.y);
}

export function setProgress(stage,w){
  seis.tp=(stage+w)/5; $$('#stages span').forEach((s,i)=>s.classList.toggle('on',i===stage));
  $('#seismo').setAttribute('aria-label','Progreso: etapa '+['Inicio','Antes','Durante','Después','Cierre'][stage]);
}

/* Banner del sismo y bloqueo del hub */
function bannerKey(){ if(!Q.active)return ''; if(Q.phase==='strong')return player.covering?'cover':'strong'; return (Q.t<7)?(Q.safe>1.5?'good':(Q.waves>0?'late':'')):''; }

export function updateBanner(){
  const inDur=rt.cur&&STEPS[rt.cur]&&STEPS[rt.cur].stage===2&&rt.mode!=='show'&&rt.cur!=='quakeIntro';
  const k=inDur?bannerKey():''; if(k===rt.lastBanner)return; rt.lastBanner=k;
  const b=$('#quakeBanner'); if(!k){ b.hidden=true; return; }
  const c=CONTENT.banner[k]; b.hidden=false; b.className=(k==='strong'?'strong':(k==='cover'||k==='good')?'safe':'calm'); b.innerHTML='<h3>'+c.t+'</h3><p>'+c.s+'</p>';
}
