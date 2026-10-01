/* ======================================================================
   Navegación entre pasos: fundidos, go(), reinicio y transición de reinicio.
   ====================================================================== */
import { rt } from '../core/runtime.js';
import { audio } from '../core/audio.js';
import { $ } from '../core/utils.js';
import { warp } from '../game/camera.js';
import { resetBooks } from '../game/effects.js';
import { player } from '../game/player.js';
import { Q, quakeStop } from '../game/quake.js';
import { STEPS } from './steps.js';
import { cat, dog } from '../three/actors.js';
import { hideUI, setProgress, state, updateBanner } from '../ui/hud.js';

function cleanupStep(){ if(rt.curExit){ rt.curExit(); rt.curExit=null; } if(rt.stepData.io){ rt.stepData.io.disconnect(); rt.stepData.io=null; } rt.curTick=null; rt.onQuakePhase=function(){}; rt.stepData={}; }

export function fadeGo(id,params){ const f=$('#fade'); f.classList.add('on'); setTimeout(()=>{ go(id,params); requestAnimationFrame(()=>setTimeout(()=>f.classList.remove('on'),250)); },800); }

export function go(id,params){
  cleanupStep(); hideUI(); player.locked=false; rt.bgOverride=null; const S_=STEPS[id]; if(!S_)return;
  rt.cur=id; rt.lastBanner='#'; $('#hud').hidden=(id==='home'&&false);
  const inDuring=S_.stage===2&&id!=='quakeIntro'&&id!=='sizeIntro'&&id!=='sizePick'&&id!=='sizeInfo';
  if(!inDuring&&Q.active)quakeStop();
  audio.setMood(S_.stage===2?(inDuring?'tense':'calm'):S_.stage===3?'hope':'calm');
  setProgress(S_.stage,S_.w||0); const back=$('#backBtn'); back.hidden=!S_.prev; back.dataset.to=S_.prev||'';
  S_.enter(params||{});
  updateBanner();
}

function restart(){ quakeStop(); resetBooks(); state.done.clear(); state.sizes.clear(); state.greeted=false; dog.visible=cat.visible=true; go('home'); }

let wiping=false;

export function restartWipe(btn){ /* ondas sísmicas desde el botón, iris azul con el logo y apertura desde el centro */
  if(wiping)return; wiping=true; const w=$('#wipe'), r=btn.getBoundingClientRect();
  w.style.setProperty('--x',(r.left+r.width/2)+'px'); w.style.setProperty('--y',(r.top+r.height/2)+'px');
  w.className='on'; void w.offsetWidth; w.classList.add('go'); audio.whoosh(); warp.t=1;
  setTimeout(()=>w.classList.add('hold'),1000);
  setTimeout(()=>{ restart(); warp.t=0; },1750);
  setTimeout(()=>{ w.classList.remove('go','hold'); w.classList.add('open'); },2600);
  setTimeout(()=>{ w.className=''; wiping=false; },3900);
}
