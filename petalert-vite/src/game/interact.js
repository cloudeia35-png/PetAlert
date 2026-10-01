/* ======================================================================
   Interacción con puntos del mundo (tecla E y botón).
   ====================================================================== */
import { rt } from '../core/runtime.js';
import { audio } from '../core/audio.js';
import { $ } from '../core/utils.js';
import { player } from './player.js';
import { isStrong } from './quake.js';

export function updateInteract(){
  const pr=$('#prompt'); let show=false;
  if(rt.interact&&(rt.mode==='fp'||rt.mode==='tp')){ const d=Math.hypot(player.pos.x-rt.interact.x,player.pos.z-rt.interact.z);
    if(d<rt.interact.r){ if(isStrong()){ show=false; } else show=true; } }
  if(show){ $('span',pr).textContent=rt.interact.label; pr.hidden=false; } else pr.hidden=true;
  return show;
}

export function doInteract(){ if(updateInteract()&&rt.interact){ audio.blip(); const f=rt.interact.fn; rt.interact=null; f(); } }
