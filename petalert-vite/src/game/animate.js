/* ======================================================================
   Animación de mascotas y objetos de vitrina en cada cuadro.
   ====================================================================== */
import { rt } from '../core/runtime.js';
import { angDiff, damp } from '../core/utils.js';
import { PETS } from '../three/models.js';
import { S } from '../three/showcase.js';

/* Animación de mascotas y objetos de vitrina */
export function animPets(dt){
  PETS.forEach(p=>{ const u=p.userData;
    if(u.path&&u.path.length){ const w=u.path[0]; u.ty=w.y||0; const dx=w.x-u.base.x, dz=w.z-u.base.z, d=Math.hypot(dx,dz), st=u.speed*dt;
      if(d<=st){ u.base.x=w.x; u.base.z=w.z; u.path.shift(); if(!u.path.length){ u.walking=false; u.faceTo=(w.ry!=null)?w.ry:null; } }
      else{ u.base.x+=dx/d*st; u.base.z+=dz/d*st; p.rotation.y+=angDiff(p.rotation.y,Math.atan2(dx,dz))*Math.min(1,dt*10); } }
    else if(u.faceTo!=null){ p.rotation.y+=angDiff(p.rotation.y,u.faceTo)*Math.min(1,dt*8); }
    if(u.ty!=null)u.base.y=damp(u.base.y,u.ty,7,dt);
    if(u.pop!=null){ u.pop=Math.min(1,u.pop+dt*2.4); const e=u.pop-1, k=1+2.70158*e*e*e+1.70158*e*e, sc=(u.sc||1)*Math.max(.001,k); p.scale.set(sc,sc,sc); if(u.pop>=1)u.pop=null; }
    if(u.type==='dog'&&u.tail)u.tail.rotation.z=Math.sin(rt.time*9+u.ph)*.5*u.wag; else if(u.tail)u.tail.rotation.y=Math.sin(rt.time*3+u.ph)*.35*u.wag;
    if(u.head&&!(u.shiver>.3)){ u.head.rotation.y=Math.sin(rt.time*.8+u.ph)*.25; u.head.rotation.z=Math.sin(rt.time*1.3+u.ph)*.05; }
    else if(u.head){ u.head.rotation.y=Math.sin(rt.time*2+u.ph)*.12; u.head.rotation.z=0; }
    p.position.x=u.base.x+(u.shiver?Math.sin(rt.time*55+u.ph)*.012*u.shiver*p.scale.x:0); p.position.z=u.base.z;
    const wb=u.walking?Math.abs(Math.sin(rt.time*13+u.ph))*.07*p.scale.x:0;
    if(u.hop>0){ u.hop=Math.max(0,u.hop-dt*2.2); p.position.y=u.base.y+wb+Math.sin((1-u.hop)*Math.PI)*.35*p.scale.x; } else p.position.y=u.base.y+wb;
  });
  if(S.fin&&S.fin.visible){ const a=S.fin.motes.geometry.attributes.position; for(let i=0;i<a.count;i++){ let y=a.getY(i)+dt*(.28+(i%5)*.09); if(y>6)y=-.2; a.setY(i,y); a.setX(i,a.getX(i)+Math.sin(rt.time*.8+i)*.002); } a.needsUpdate=true; }
  if(S.kit&&S.kit.visible)S.kit.items.forEach(it=>{ const u=it.userData; it.position.y=u.base.y+Math.sin(rt.time*1.6+u.ph)*.08; it.rotation.y+=dt*.6; const s=damp(it.scale.x,u.sel?1.35:(it.children.length&&u.base.y===2.6?1.15:1),8,dt); it.scale.setScalar(s); });
}
