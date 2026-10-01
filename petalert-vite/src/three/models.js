/* ======================================================================
   Modelos 3D procedurales: perro, gata, avatar, mochila, objetos del kit y materiales.
   ====================================================================== */
import * as THREE from 'three';

export const PAL={
  cacao:{fur:'#d9a066',light:'#fff0d9',ear:'#a86a3a',nose:'#3b2a25'},
  husky:{fur:'#9fb0cc',light:'#ffffff',ear:'#5f6f8f',nose:'#2a2f3d'},
  nube:{fur:'#f4bb52',light:'#fff1cf',ear:'#e39a2f'}
};

const MC={};

export function mat(c,o){ const k=c+(o?JSON.stringify(o):''); return MC[k]||(MC[k]=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.78,metalness:0},o||{}))); }

export function mesh(geo,c,o){ const m=new THREE.Mesh(geo,(c&&c.isMaterial)?c:mat(c,o)); m.castShadow=true; m.receiveShadow=true; return m; }

export function sph(r,c,sx,sy,sz,o){ const m=mesh(new THREE.SphereGeometry(r,20,14),c,o); m.scale.set(sx||1,sy||1,sz||1); return m; }

export function cyl(rt,rb,h,c,seg){ return mesh(new THREE.CylinderGeometry(rt,rb,h,seg||16),c); }

export function at(m,x,y,z){ m.position.set(x,y,z); return m; }

export function RB(w,h,d,r,c,o){ /* caja con bordes redondeados */
  const b=Math.max(.004,Math.min(r,w*.45,h*.45,d*.45)), sw=w-2*b, sh=h-2*b, rr=Math.min(sw,sh)*.18, x=-sw/2, y=-sh/2, s=new THREE.Shape();
  s.moveTo(x+rr,y); s.lineTo(x+sw-rr,y); s.quadraticCurveTo(x+sw,y,x+sw,y+rr); s.lineTo(x+sw,y+sh-rr); s.quadraticCurveTo(x+sw,y+sh,x+sw-rr,y+sh);
  s.lineTo(x+rr,y+sh); s.quadraticCurveTo(x,y+sh,x,y+sh-rr); s.lineTo(x,y+rr); s.quadraticCurveTo(x,y,x+rr,y);
  const dep=Math.max(.002,d-2*b), g=new THREE.ExtrudeGeometry(s,{depth:dep,bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelSegments:3,curveSegments:5});
  g.translate(0,0,-dep/2); return mesh(g,c,o);
}

export function anchor(g,x,y,z){ const o=new THREE.Object3D(); o.position.set(x,y,z); g.add(o); return o; }

export const PETS=[];

export function makeDog(p){
  const g=new THREE.Group(), u=g.userData; u.type='dog'; u.base=new THREE.Vector3(); u.wag=1; u.shiver=0; u.hop=0; u.ph=Math.random()*6;
  g.add(at(sph(.42,p.fur,.9,1.15,.95),0,.5,-.05));
  g.add(at(sph(.3,p.light,.95,1.1,.8),0,.6,.14));
  [-1,1].forEach(s=>{
    g.add(at(sph(.27,p.fur,1,1,1.05),s*.27,.27,-.17));
    g.add(at(cyl(.085,.085,.55,p.fur,12),s*.15,.3,.24));
    g.add(at(sph(.11,p.light,1,.7,1.3),s*.15,.06,.3));
  });
  const head=new THREE.Group(); head.position.set(0,1.02,.12); g.add(head); u.head=head;
  head.add(sph(.3,p.fur));
  head.add(at(sph(.15,p.light,1,.8,1.25),0,-.08,.27));
  head.add(at(sph(.055,p.nose,1.2,.85,1),0,-.02,.42));
  head.add(at(sph(.05,'#ff8f9e',.8,.3,1),0,-.15,.36));
  u.eyes=[];
  [-1,1].forEach(s=>{
    const e=at(sph(.05,'#1c2233'),s*.11,.07,.26); e.add(at(sph(.016,'#ffffff'),.015,.02,.04)); head.add(e); u.eyes.push(e);
    const er=at(sph(1,p.ear,.09,.2,.14),s*.25,.06,-.02); er.rotation.z=-s*.35; head.add(er);
  });
  const collar=at(mesh(new THREE.TorusGeometry(.2,.035,10,24),'#ff7a66'),0,.86,.14); collar.rotation.x=Math.PI/2; g.add(collar);
  const tag=at(cyl(.06,.06,.02,'#ffc24d',16),0,.74,.36); tag.rotation.x=Math.PI/2; g.add(tag);
  g.add(at(RB(.12,.09,.06,.02,'#4a8bdd'),.21,.85,.06));
  const tail=new THREE.Group(); tail.position.set(0,.14,-.38); const tm=cyl(.045,.06,.5,p.fur,10); tm.position.set(0,.2,-.1); tm.rotation.x=-.5; tail.add(tm); g.add(tail); u.tail=tail;
  u.anchors={neck:anchor(g,0,.86,.3),back:anchor(g,0,.95,-.3),paws:anchor(g,0,.12,.42),rear:anchor(g,0,.35,-.55),head:anchor(g,0,1.55,.1),tag:anchor(g,0,.74,.42),gps:anchor(g,.24,.86,.08),chip:anchor(g,0,1.0,-.15)};
  PETS.push(g); return g;
}

export function makeCat(p){
  const g=new THREE.Group(), u=g.userData; u.type='cat'; u.base=new THREE.Vector3(); u.wag=1; u.shiver=0; u.hop=0; u.ph=Math.random()*6;
  const glow={emissive:p.fur,emissiveIntensity:.12};
  g.add(at(sph(.3,p.fur,.95,1.15,.95,glow),0,.38,-.03));
  g.add(at(sph(.22,p.light,.9,1,.8),0,.4,.14));
  [-1,1].forEach(s=>{
    g.add(at(sph(.2,p.fur,1,1,1.05,glow),s*.2,.2,-.16));
    g.add(at(cyl(.055,.055,.36,p.fur,10),s*.11,.2,.2));
    g.add(at(sph(.075,p.light,1,.7,1.3),s*.11,.05,.25));
  });
  const head=new THREE.Group(); head.position.set(0,.86,.1); g.add(head); u.head=head;
  head.add(sph(.25,p.fur,1.1,.95,1,glow));
  head.add(at(sph(.09,p.light,1.2,.8,1),0,-.07,.2));
  head.add(at(sph(.03,'#ff9aa8'),0,-.02,.28));
  u.eyes=[];
  [-1,1].forEach(s=>{
    const ear=at(mesh(new THREE.ConeGeometry(.1,.2,4),p.fur),s*.15,.22,0); ear.rotation.z=-s*.25; head.add(ear);
    const inner=at(mesh(new THREE.ConeGeometry(.055,.13,4),'#ffb3a6'),s*.15,.21,.03); inner.rotation.z=-s*.25; head.add(inner);
    const e=at(sph(.055,'#2f8f6d'),s*.1,.05,.2); e.add(at(sph(.026,'#10151f',.6,1.3,.6),0,0,.04)); head.add(e); u.eyes.push(e);
  });
  const tail=new THREE.Group();
  const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,.16,-.28),new THREE.Vector3(0,.1,-.55),new THREE.Vector3(0,.28,-.72),new THREE.Vector3(0,.55,-.62),new THREE.Vector3(0,.72,-.45)]);
  tail.add(mesh(new THREE.TubeGeometry(curve,20,.05,8,false),p.fur)); g.add(tail); u.tail=tail;
  u.anchors={neck:anchor(g,0,.66,.22),back:anchor(g,0,.62,-.25),paws:anchor(g,0,.1,.3),rear:anchor(g,0,.35,-.45),head:anchor(g,0,1.22,.1)};
  PETS.push(g); return g;
}

export function makeAvatar(){
  const g=new THREE.Group(), skin='#f2c9a5', hood='#ff8a6f', pants='#2b4c8c';
  const u=g.userData;
  [-1,1].forEach(s=>{
    const leg=new THREE.Group(); leg.position.set(s*.11,.55,0); leg.add(at(cyl(.085,.09,.5,pants,12),0,-.25,0)); leg.add(at(sph(.1,'#ffffff',1,.6,1.4),0,-.52,.04)); g.add(leg); (s<0?u.legL=leg:u.legR=leg);
    const arm=new THREE.Group(); arm.position.set(s*.27,1.03,0); arm.add(at(cyl(.06,.06,.42,hood,10),0,-.19,0)); arm.add(at(sph(.065,skin),0,-.42,0)); g.add(arm); (s<0?u.armL=arm:u.armR=arm);
  });
  g.add(at(cyl(.2,.22,.5,hood,16),0,.82,0));
  g.add(at(sph(.21,hood,1,.55,.85),0,1.06,0));
  g.add(at(sph(.2,skin),0,1.32,0));
  g.add(at(sph(.215,'#5a3a2a',1,.75,1.02),0,1.38,-.03));
  [-1,1].forEach(s=>g.add(at(sph(.024,'#1c2233'),s*.075,1.33,.18)));
  g.add(at(RB(.3,.4,.15,.05,'#ffc24d'),0,.86,-.25));
  return g;
}

export function makeBackpack(){
  const g=new THREE.Group(), c='#4a8bdd';
  const body=at(cyl(.62,.62,1.35,c,28),0,.75,0); body.scale.z=.62; g.add(body);
  g.add(at(sph(.62,c,1,.62,.62),0,1.42,0));
  g.add(at(sph(.62,c,1,.35,.62),0,.1,0));
  const pocket=at(cyl(.45,.45,.7,'#6aa5f0',24),0,.5,.33); pocket.scale.z=.4; g.add(pocket);
  const patch=at(cyl(.24,.24,.04,'#ffffff',24),0,1.02,.4); patch.rotation.x=Math.PI/2; g.add(patch);
  g.add(at(RB(.3,.08,.03,.01,'#ff7a66'),0,1.02,.43)); g.add(at(RB(.08,.3,.03,.01,'#ff7a66'),0,1.02,.43));
  const h=at(mesh(new THREE.TorusGeometry(.16,.04,8,16,Math.PI),'#14305e'),0,1.78,0); g.add(h);
  return g;
}

export function kitItem(kind){
  const g=new THREE.Group();
  if(kind==='water'){
    g.add(at(mesh(new THREE.CylinderGeometry(.17,.17,.6,20),'#cdeeff',{transparent:true,opacity:.85}),0,0,0));
    g.add(at(cyl(.155,.155,.42,'#6fd6f0',20),0,-.08,0)); g.add(at(cyl(.1,.1,.08,'#dff5ff',16),0,.34,0)); g.add(at(cyl(.09,.09,.1,'#ff7a66',16),0,.42,0));
  }else if(kind==='food'){
    g.add(RB(.6,.75,.24,.08,'#ffc24d')); g.add(at(RB(.38,.32,.02,.02,'#ffffff'),0,.05,.13));
    g.add(at(sph(.07,'#8a5a33',1,.9,.4),0,.02,.15)); [-1,0,1].forEach(i=>g.add(at(sph(.03,'#8a5a33',1,1,.4),i*.07,.11+(i===0?.03:0),.15)));
  }else if(kind==='aid'){
    g.add(RB(.78,.56,.3,.08,'#ffffff')); g.add(at(RB(.3,.08,.03,.01,'#ff7a66'),0,0,.16)); g.add(at(RB(.08,.3,.03,.01,'#ff7a66'),0,0,.16));
    g.add(at(mesh(new THREE.TorusGeometry(.14,.03,8,14,Math.PI),'#14305e'),0,.28,0));
  }else if(kind==='leash'){
    g.add(mesh(new THREE.TorusGeometry(.28,.05,10,24),'#ff7a66')); g.add(at(mesh(new THREE.TorusGeometry(.13,.04,10,20),'#ff7a66'),.5,0,0));
    g.add(at(cyl(.025,.025,.3,'#14305e',8),.29,0,0)).children[2].rotation.z=Math.PI/2;
  }else if(kind==='doc'){
    g.add(RB(.66,.82,.06,.03,'#9cc9cc')); g.add(at(RB(.52,.66,.02,.01,'#ffffff'),0,.05,.05));
    [.2,.08,-.04].forEach(y=>g.add(at(RB(.34,.03,.01,.005,'#c9dbff'),0,y,.07)));
  }else{
    const bone=cyl(.055,.055,.5,'#fff0d9',12); bone.rotation.z=Math.PI/2; g.add(bone);
    [[-.25,.06],[-.25,-.06],[.25,.06],[.25,-.06]].forEach(p=>g.add(at(sph(.075,'#fff0d9'),p[0],p[1],0)));
    g.add(at(sph(.16,'#ff7a66'),.05,-.32,.1));
  }
  return g;
}

export function blob(r){ /* sombra suave falsa */
  const cv=document.createElement('canvas'); cv.width=cv.height=64; const x=cv.getContext('2d'), gr=x.createRadialGradient(32,32,0,32,32,32);
  gr.addColorStop(0,'rgba(20,48,94,.35)'); gr.addColorStop(1,'rgba(20,48,94,0)'); x.fillStyle=gr; x.fillRect(0,0,64,64);
  const m=new THREE.Mesh(new THREE.PlaneGeometry(r*2,r*2),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),transparent:true,depthWrite:false}));
  m.rotation.x=-Math.PI/2; m.position.y=.02; return m;
}

export function catIcon(){
  const cv=document.createElement('canvas'); cv.width=cv.height=128; const x=cv.getContext('2d');
  x.fillStyle='rgba(255,255,255,.95)'; x.strokeStyle='#ff7a66'; x.lineWidth=8; x.beginPath(); x.arc(64,70,38,0,7); x.fill(); x.stroke();
  [[28,44,34,12,52,34],[100,44,94,12,76,34]].forEach(t=>{ x.beginPath(); x.moveTo(t[0],t[1]); x.lineTo(t[2],t[3]); x.lineTo(t[4],t[5]); x.closePath(); x.fill(); x.stroke(); });
  x.fillStyle='#14305e'; x.beginPath(); x.arc(50,68,5,0,7); x.arc(78,68,5,0,7); x.fill();
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),transparent:true,depthTest:false})); s.scale.set(.9,.9,1); s.renderOrder=10; return s;
}
