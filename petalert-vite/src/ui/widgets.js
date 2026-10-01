/* ======================================================================
   Plantillas de pasos reutilizables: descubrir elementos con acercamiento y pasos de texto.
   ====================================================================== */
import { rt } from '../core/runtime.js';
import { audio } from '../core/audio.js';
import { $ } from '../core/utils.js';
import { zoomTo } from '../game/camera.js';
import { addHS, icon, panel } from './hud.js';

export function discoverStep(o){
  const seen=new Set(), hs=[], n=o.items.length;
  const p=panel({title:o.title,text:o.text,html:'<p class="count"></p>',actions:[{label:'Continuar',fn:o.next,disabled:true}]});
  const cnt=$('.count',p), btn=$('.btn',p), tip=$('#tip');
  const upd=()=>{ cnt.textContent=seen.size+' de '+n+' descubiertos · toca un punto para acercarte'; btn.disabled=seen.size<n; };
  const out=()=>{ rt.tipState=null; tip.hidden=true; p.hidden=false; $('#hotspots').style.visibility=''; hs.forEach(x=>x.classList.remove('on')); zoomTo(null); if(o.onPick)o.onPick(-1); upd(); };
  const pick=i=>{
    const it=o.items[i]; seen.add(i); hs.forEach((x,j)=>x.classList.toggle('on',i===j)); hs[i].classList.add('seen'); if(o.onPick)o.onPick(i);
    zoomTo(it.anchor,o.zoom,it.rot); p.hidden=true; $('#hotspots').style.visibility='hidden';
    tip.innerHTML='<div class="num">'+(i+1)+' de '+n+'</div><div class="ttl"><span class="ico">'+icon(it.icon)+'</span><h3>'+it.title+'</h3></div><p>'+it.text+'</p><div class="row"><button class="btn ghost" data-a="all">Ver todos</button><button class="btn" data-a="next">Siguiente</button></div>';
    tip.hidden=false; rt.tipState={anchor:it.anchor};
    $('[data-a=all]',tip).addEventListener('click',()=>{ audio.blip(); out(); });
    $('[data-a=next]',tip).addEventListener('click',()=>{ audio.blip(); pick((i+1)%n); });
    audio.ding(); upd();
  };
  o.items.forEach((it,i)=>hs.push(addHS({anchor:it.anchor,aria:it.title,onClick:()=>pick(i)})));
  upd();
}

export function textStep(text,cta,next,extra){ panel({text:text,cls:'center'+(extra||''),actions:[{label:cta||'Continuar',fn:next}]}); }
