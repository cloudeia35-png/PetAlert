/* ======================================================================
   Entradas: teclado, joystick táctil, arrastre de cámara, botones de sonido y música.
   ====================================================================== */
import { rt } from './core/runtime.js';
import { audio } from './core/audio.js';
import { $, clamp } from './core/utils.js';
import { doInteract } from './game/interact.js';
import { js, keys, player } from './game/player.js';
import { go } from './steps/flow.js';
import { STEPS } from './steps/steps.js';
import { camera, canvas, renderer } from './three/engine.js';

addEventListener('keydown',e=>{
  if(e.repeat&&(e.code==='KeyE'||e.code==='Enter'))return;
  keys.add(e.code); if((rt.mode==='fp'||rt.mode==='tp')&&['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].indexOf(e.code)>=0)e.preventDefault();
  if(e.code==='KeyE'||(e.code==='Enter'&&document.activeElement===document.body))doInteract();
});

addEventListener('keyup',e=>keys.delete(e.code));
addEventListener('blur',()=>keys.clear());
$('#prompt .btn').addEventListener('click',doInteract);
$('#backBtn').addEventListener('click',()=>{ const to=$('#backBtn').dataset.to; if(to){ audio.blip(); go(to); } });
$('#soundBtn').addEventListener('click',()=>{ audio.init(); const on=audio.toggle(); setSoundIcon(on); });

function setSoundIcon(on){ $('#soundBtn').innerHTML=on?'<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.500 8.500a5 5 0 0 1 0 7M19 6a8.500 8.500 0 0 1 0 12"/></svg>':'<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>'; }

setSoundIcon(true);
$('#musicBtn').addEventListener('click',()=>{ audio.init(); const on=audio.toggleMusic(); setMusicIcon(on); });

function setMusicIcon(on){ const b=$('#musicBtn'); b.setAttribute('aria-pressed',on); b.innerHTML='<svg viewBox="0 0 24 24"><path d="M9 18V6l10-2v12"/><circle cx="6.500" cy="18" r="2.500"/><circle cx="16.500" cy="16" r="2.500"/>'+(on?'':'<path d="M3 3l18 18"/>')+'</svg>'; }

setMusicIcon(true);
document.addEventListener('visibilitychange',()=>{ const c=audio.ctx; if(!c)return; if(document.hidden)c.suspend(); else if(audio.on)c.resume(); });
$('#startBtn').addEventListener('click',()=>{ audio.init(); audio.blip(); go('pets'); });

/* Cubrirse (mantener presionado) */
const cb=$('#coverBtn');
['pointerdown'].forEach(t=>cb.addEventListener(t,e=>{ e.preventDefault(); rt.coverHeld=true; cb.classList.add('held'); }));
['pointerup','pointercancel','pointerleave'].forEach(t=>cb.addEventListener(t,()=>{ rt.coverHeld=false; cb.classList.remove('held'); }));

/* Joystick táctil */
(function(){ const st=$('#stick'), kn=$('i',st); let id=null;
  const mv=e=>{ const r=st.getBoundingClientRect(), x=(e.clientX-r.left-r.width/2)/(r.width/2), y=(e.clientY-r.top-r.height/2)/(r.height/2), l=Math.hypot(x,y)||1, k=Math.min(1,l); js.x=x/l*k; js.y=y/l*k; kn.style.transform='translate('+js.x*36+'px,'+js.y*36+'px)'; };
  st.addEventListener('pointerdown',e=>{ id=e.pointerId; st.setPointerCapture(id); mv(e); });
  st.addEventListener('pointermove',e=>{ if(e.pointerId===id)mv(e); });
  const end=e=>{ if(e.pointerId===id){ id=null; js.x=js.y=0; kn.style.transform=''; } };
  st.addEventListener('pointerup',end); st.addEventListener('pointercancel',end); })();

/* Arrastrar para mirar (primera persona) o girar la vitrina */
(function(){ let drag=null;
  canvas.addEventListener('pointerdown',e=>{ drag={x:e.clientX,y:e.clientY,id:e.pointerId}; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove',e=>{ if(!drag||e.pointerId!==drag.id)return; const dx=e.clientX-drag.x, dy=e.clientY-drag.y; drag.x=e.clientX; drag.y=e.clientY;
    if(rt.mode==='fp'){ player.yaw-=dx*.005; player.pitch=clamp(player.pitch-dy*.004,-.9,.9); } else if(rt.mode==='show'){ rt.showRot+=dx*.01; } });
  const end=()=>{ drag=null; }; canvas.addEventListener('pointerup',end); canvas.addEventListener('pointercancel',end); })();

export function resize(){ const w=innerWidth,h=innerHeight; renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix(); }

addEventListener('resize',()=>{ resize(); if(rt.cur==='home')STEPS.home.enter(); });
