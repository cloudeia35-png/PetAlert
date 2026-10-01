/* ======================================================================
   Actores: Cacao, Nube y el avatar; colocación, caminata y estados de las mascotas.
   ====================================================================== */
import { houseScene } from './engine.js';
import { PAL, catIcon, makeAvatar, makeCat, makeDog } from './models.js';

/* Mascotas y protagonista en la casa */
export let dog,cat,avatar,catSprites=[];
export const CAT_SPOTS=[[-6.2,0,.5],[-5.4,.65,3.5],[4.3,.9,-4.6]];

export function placePet(p,x,y,z,ry,s){ const u=p.userData; u.path=null; u.walking=false; u.pop=null; u.ty=null; u.faceTo=null; u.sc=s||1; u.base.set(x,y,z); p.position.set(x,y,z); p.rotation.y=ry||0; p.scale.setScalar(s||1); p.scale.y=(s||1); }

export function popPet(p){ const u=p.userData; p.visible=true; u.pop=0; u.hop=1; p.scale.setScalar(.001); }

export function walkPet(p,wps,speed){ const u=p.userData; u.path=wps.map(w=>Object.assign({},w)); u.speed=speed||3.4; u.walking=true; u.faceTo=null; }

export function petState(p,o){ const u=p.userData; u.wag=o.wag!=null?o.wag:1; u.shiver=o.shiver||0; u.eyes.forEach(e=>e.scale.setScalar(o.eyes||1)); }

export function buildActors(){
  dog=makeDog(PAL.cacao); cat=makeCat(PAL.nube); avatar=makeAvatar(); avatar.visible=false;
  houseScene.add(dog,cat,avatar);
  CAT_SPOTS.forEach(s=>{ const i=catIcon(); i.position.set(s[0],s[1]+1.4,s[2]); i.visible=false; houseScene.add(i); catSprites.push(i); });
}
