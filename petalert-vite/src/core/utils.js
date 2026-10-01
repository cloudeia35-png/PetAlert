/* ======================================================================
   Utilidades generales: selectores DOM, matemáticas, aleatorios y detección de preferencias del dispositivo.
   ====================================================================== */


/* =====================================================================
   PETALERT · LÓGICA
   0. Utilidades   1. Contenido (textos editables)   2. Audio
   3. Modelos 3D   4. Casa y mundo   5. Jugador   6. Sismo
   7. Interfaz     8. Pasos del recorrido   9. Bucle principal
   ===================================================================== */
export const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.prototype.slice.call(r.querySelectorAll(s));
export const clamp=(v,a,b)=>Math.min(b,Math.max(a,v)), lerp=(a,b,t)=>a+(b-a)*t, damp=(a,b,l,dt)=>a+(b-a)*(1-Math.exp(-l*dt));
export const rnd=(a,b)=>a+Math.random()*(b-a);
export const el=(tag,cls,html)=>{const e=document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e;};
export const angDiff=(a,b)=>{let d=b-a; while(d>Math.PI)d-=2*Math.PI; while(d<-Math.PI)d+=2*Math.PI; return d;};
export const shuffle=a=>{a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a;};
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
export const coarse=matchMedia('(pointer: coarse)').matches;
export const SHAKE=reduceMotion?.3:1;
