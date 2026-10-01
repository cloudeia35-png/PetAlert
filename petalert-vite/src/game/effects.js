/* ======================================================================
   Efectos del sismo: libros y escombros que caen, luces, polvo y animaciones del ambiente.
   ====================================================================== */
import * as THREE from 'three';
import { rt } from '../core/runtime.js';
import { audio } from '../core/audio.js';
import { $, SHAKE, clamp, lerp, rnd } from '../core/utils.js';
import { Q } from './quake.js';
import { cDay, cDusk, hemi, lampLight, sun, sunDay, sunDusk, world } from '../three/engine.js';
import { mesh } from '../three/models.js';
import { setBG } from '../ui/hud.js';

export const DEB=[];

export function buildDebris(){
  const geos=[new THREE.BoxGeometry(.22,.12,.18),new THREE.BoxGeometry(.14,.14,.14),new THREE.BoxGeometry(.3,.06,.2)], cols=['#f4f8ff','#c9d5e8','#ffc24d','#ff8a6f','#9cc9cc'];
  for(let i=0;i<16;i++){ const m=mesh(geos[i%3],cols[i%5]); m.visible=false; world.root.add(m); DEB.push({m:m,st:0,t:0,h:.07,v:new THREE.Vector3(),rv:new THREE.Vector3()}); }
}

export function updateDebris(dt){ /* mientras dure el sismo siguen cayendo pedazos y objetos */
  if(Q.active&&rt.mode!=='show'&&Q.k>.25&&Math.random()<dt*(Q.phase==='strong'?2.6:1.1)){
    const d=DEB.find(x=>x.st===0); if(d){ d.st=1; d.t=0; d.m.visible=true; d.m.scale.setScalar(1); d.m.position.set(rnd(-6,6),3.2,rnd(-4.2,4.2)); d.v.set(rnd(-.4,.4),0,rnd(-.4,.4)); d.rv.set(rnd(-6,6),rnd(-4,4),rnd(-6,6)); }
  }
  DEB.forEach(d=>{ if(!d.st)return; const m=d.m;
    if(d.st===1){ d.v.y-=9.8*dt; m.position.addScaledVector(d.v,dt); m.rotation.x+=d.rv.x*dt; m.rotation.y+=d.rv.y*dt; m.rotation.z+=d.rv.z*dt;
      if(m.position.y<d.h){ m.position.y=d.h; if(Math.abs(d.v.y)>2.2){ d.v.y*=-.28; d.v.x*=.5; d.v.z*=.5; d.rv.multiplyScalar(.4); if(Math.random()<.4)audio.thud(); } else { d.st=2; d.t=0; d.v.set(0,0,0); } } }
    else if(d.st===2){ d.t+=dt; if(d.t>2){ const k=1-(d.t-2)/.5; m.scale.setScalar(Math.max(.001,k)); if(k<=0){ d.st=0; m.visible=false; } } }
  });
}

export function dropBooks(n){ let c=0; world.books.forEach(b=>{ if(b.state===0&&c<n){ b.state=1; b.t=-b.delay; c++; } }); }

export function resetBooks(){ world.books.forEach(b=>{ b.state=0; b.m.position.copy(b.home); b.m.rotation.copy(b.homeRot); if(b.m.parent!==b.parent)b.parent.add(b.m); }); }

export function updateBooks(dt){
  world.books.forEach(b=>{
    if(b.state===1){ b.t+=dt; if(b.t>0){ b.state=2;
      const w=new THREE.Vector3(); b.m.getWorldPosition(w); b.parent.remove(b.m); b.m.position.copy(w); world.root.add(b.m);
      b.v.set(rnd(-.6,.6),rnd(.3,1),rnd(.8,2)); b.rv.set(rnd(-5,5),rnd(-3,3),rnd(-5,5)); audio.crash(); } }
    else if(b.state===2){ b.v.y-=9.8*dt; b.m.position.addScaledVector(b.v,dt); b.m.rotation.x+=b.rv.x*dt; b.m.rotation.z+=b.rv.z*dt;
      if(b.m.position.y<.08){ b.m.position.y=.08; b.state=3; b.m.rotation.set(Math.PI/2,rnd(0,6),rnd(-.4,.4)); } }
  });
}

export function updateWorldFX(dt){
  const k=Q.k*SHAKE, ks=Q.k;
  world.root.position.set((Math.random()-.5)*.06*k,0,(Math.random()-.5)*.06*k);
  world.pics.forEach((p,i)=>{ p.rotation.z=Math.sin(rt.time*7+i*2)*.22*ks; });
  world.plant.rotation.z=Math.sin(rt.time*11)*.06*ks; world.shade.rotation.z=Math.sin(rt.time*8)*.16*ks;
  const fl=ks>.3?(.55+.45*Math.abs(Math.sin(rt.time*23)*Math.sin(rt.time*7.3))):1;
  hemi.color.copy(cDay).lerp(cDusk,ks); hemi.intensity=lerp(.62,.38,ks)*fl; sun.color.copy(sunDay).lerp(sunDusk,ks); sun.intensity=lerp(.56,.24,ks)*fl; lampLight.intensity=.5*(ks>.3?fl:1);
  world.dust.material.opacity=clamp(ks*1.3,0,.7); world.dust.visible=ks>.02;
  if(world.dust.visible){ const a=world.dust.geometry.attributes.position; for(let i=0;i<a.count;i++){ let y=a.getY(i)-dt*(.3+(i%5)*.15); if(y<0)y=3; a.setY(i,y); } a.needsUpdate=true; }
  // fondo
  const wantDusk=(rt.mode!=='show')&&(Q.k>.2||(Q.active&&Q.phase==='calm'));
  setBG(rt.bgOverride||(rt.mode==='show'?'show':(wantDusk?'dusk':'day')));
  $('#fx').classList.toggle('quake',Q.k>.35);
}

export function pulseAnim(dt){
  const b=world.beacon; if(b.visible){ b.userData.cone.position.y=(b.userData.baseY==null?1.2:b.userData.baseY)+Math.sin(rt.time*3)*.15; b.userData.ring.scale.setScalar(1+Math.sin(rt.time*3)*.12); }
}
