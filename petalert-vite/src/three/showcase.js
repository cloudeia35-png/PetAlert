/* ======================================================================
   Escenas de vitrina: kit, rastreo, tamaños, primeros planos, mochila y final.
   ====================================================================== */
import * as THREE from 'three';
import { rnd } from '../core/utils.js';
import { placePet } from './actors.js';
import { showScene } from './engine.js';
import { PAL, RB, anchor, at, blob, cyl, kitItem, makeBackpack, makeCat, makeDog, sph } from './models.js';

/* Escenas de vitrina (kit, mascotas, tamaños, primeros planos) */
export const S={}, FOCUS={};

export function buildShowcase(){
  const disc=new THREE.Mesh(new THREE.CylinderGeometry(4.2,4.4,.16,48),new THREE.MeshStandardMaterial({color:'#f6faff',roughness:.9})); disc.position.y=-.08; disc.receiveShadow=true; showScene.add(disc);
  const ring=new THREE.Mesh(new THREE.RingGeometry(3.5,3.62,48),new THREE.MeshBasicMaterial({color:'#6fd6f0',transparent:true,opacity:.7,side:THREE.DoubleSide})); ring.rotation.x=-Math.PI/2; ring.position.y=.01; showScene.add(ring);
  const grp=k=>{ const g=new THREE.Group(); g.visible=false; showScene.add(g); S[k]=g; return g; };
  // pets
  let g=grp('pets'); g.dog=makeDog(PAL.cacao); g.cat=makeCat(PAL.nube); g.add(g.dog,g.cat); placePet(g.dog,-1.3,0,0,.35,1.5); placePet(g.cat,1.4,0,0,-.35,1.65);
  g.add(at(blob(1.2),-1.3,0,0),at(blob(1.1),1.4,0,0));
  // kit
  g=grp('kit'); const bag=makeBackpack(); g.add(bag,at(blob(1.2),0,0,0)); g.items=[];
  [['water',-2.1,1.7],['food',2.1,1.7],['aid',-2.2,.3],['leash',1.9,.3],['doc',0,2.6],['toy',0,.35]].forEach((d,i)=>{
    const it=kitItem(d[0]); const z=d[0]==='toy'?1.5:.2; it.position.set(d[1],d[2],z); it.userData={base:new THREE.Vector3(d[1],d[2],z),ph:i*1.3,sel:false}; if(d[0]==='doc')it.scale.setScalar(1.15); g.add(it);
    it.userData.anchor=anchor(it,0,0,0); g.items.push(it); });
  // bolso para el libro
  g=grp('bag'); const bg=makeBackpack(); bg.scale.setScalar(1.25); g.add(bg,at(blob(1.6),0,0,0));
  // perro con collar
  g=grp('track'); g.dog=makeDog(PAL.cacao); g.add(g.dog,at(blob(1.6),0,0,0)); placePet(g.dog,0,0,0,.25,2.1);
  // tamaños
  g=grp('sizes'); g.large=makeDog(PAL.husky); g.medium=makeDog(PAL.cacao); g.cat=makeCat(PAL.nube); g.add(g.large,g.medium,g.cat); g.shadow=blob(1.3); g.add(g.shadow);
  g.baseS={large:1.4,medium:1.0,cat:1.3};
  // primeros planos
  g=grp('cHide'); g.dog=makeDog(PAL.cacao); g.add(g.dog); placePet(g.dog,0,0,0,-.2,2); g.dog.scale.y=1.5;
  g.add(at(RB(5.4,.3,3.4,.1,'#e6c199'),0,2.75,-.3)); [-2.4,2.4].forEach(x=>g.add(at(cyl(.14,.14,2.75,'#c48b5a',10),x,1.37,-.9)));
  g=grp('cStill'); g.dog=makeDog(PAL.cacao); g.add(g.dog,at(blob(1.6),0,0,0)); placePet(g.dog,0,0,0,.15,2.1);
  g=grp('cCat'); g.cat=makeCat(PAL.nube); g.add(g.cat); placePet(g.cat,0,0,.3,-Math.PI/2,2.4); g.add(at(RB(.2,4.6,3.4,.05,'#c48b5a'),-2.2,2.3,0)); g.add(at(sph(.14,'#ffc24d'),-2.05,2.1,1.2));
  g=grp('fin'); g.dog=makeDog(PAL.cacao); g.cat=makeCat(PAL.nube); g.add(g.dog,g.cat); placePet(g.dog,-1.25,0,.3,.55,1.7); placePet(g.cat,1.3,0,.5,-.55,1.9); g.add(at(blob(1.9),-1.25,0,.3),at(blob(1.6),1.3,0,.5));
  const gc=document.createElement('canvas'); gc.width=gc.height=256; const gx=gc.getContext('2d'), gr=gx.createRadialGradient(128,128,0,128,128,128);
  gr.addColorStop(0,'rgba(255,214,140,.95)'); gr.addColorStop(.35,'rgba(255,170,120,.4)'); gr.addColorStop(1,'rgba(255,170,120,0)'); gx.fillStyle=gr; gx.fillRect(0,0,256,256);
  const glow=new THREE.Mesh(new THREE.PlaneGeometry(14,14),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(gc),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending})); glow.position.set(0,2,-3); g.add(glow);
  const mn=130, mp=new Float32Array(mn*3); for(let i=0;i<mn;i++){ mp[i*3]=rnd(-5.5,5.5); mp[i*3+1]=rnd(-.2,6); mp[i*3+2]=rnd(-3,2.5); }
  const mg=new THREE.BufferGeometry(); mg.setAttribute('position',new THREE.BufferAttribute(mp,3));
  g.motes=new THREE.Points(mg,new THREE.PointsMaterial({color:'#ffd27a',size:.16,transparent:true,opacity:.9,depthWrite:false,blending:THREE.AdditiveBlending})); g.motes.frustumCulled=false; g.add(g.motes);
  const fl=new THREE.PointLight('#ffcf7a',1.1,16); fl.position.set(0,3.5,3.5); g.add(fl);
  FOCUS.fin={t:[0,1.35,0],d:8.6,sway:.22};
  FOCUS.pets={t:[0,1.0,0],d:7.6,sway:.35}; FOCUS.kit={t:[0,1.15,0],d:9.6,sway:.28}; FOCUS.bag={t:[0,3.6,0],d:9.5,sway:.25};
  FOCUS.track={t:[0,1.35,0],d:7.4,sway:.4}; FOCUS.sizes={t:[0,1.0,0],d:11.2,sway:.15}; FOCUS.one={t:[0,1.2,0],d:7.6,sway:.35};
  FOCUS.cHide={t:[0,1.15,0],d:8.2,sway:.12}; FOCUS.cStill={t:[0,1.3,0],d:7.6,sway:.25}; FOCUS.cCat={t:[0,1.2,0],d:8,sway:.1};
  FOCUS.quiz={t:[0,-.9,0],d:8.4,sway:.3}; FOCUS.far={t:[0,.9,0],d:8.4,sway:.4};
}

export function sizesLayout(sel){
  const g=S.sizes, pos={large:-2.6,medium:0,cat:2.6};
  ['large','medium','cat'].forEach(k=>{ const p=g[k], u=p.userData, s=g.baseS[k]; const one=sel===k;
    p.visible=!sel||one; const x=one?0:pos[k], sc=one?s*1.45:s; placePet(p,x,0,0,one?.3:(k==='large'?.5:k==='cat'?-.5:0),sc); });
  g.shadow.position.x=sel?0:0; g.shadow.scale.setScalar(sel?1.4:3.2);
}
