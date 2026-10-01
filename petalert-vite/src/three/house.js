/* ======================================================================
   Construcción de la casa: sala, muebles, puerta, pasillo de entrada y efectos de ambiente.
   ====================================================================== */
import * as THREE from 'three';
import { rnd } from '../core/utils.js';
import { houseScene, lampLight, world } from './engine.js';
import { RB, at, cyl, makeBackpack, mat, mesh, sph } from './models.js';

function woodTex(){
  const cv=document.createElement('canvas'); cv.width=256; cv.height=256; const x=cv.getContext('2d');
  x.fillStyle='#e8d2ae'; x.fillRect(0,0,256,256);
  for(let i=0;i<8;i++){ x.fillStyle=i%2?'#e2caa3':'#ecd8b6'; x.fillRect(0,i*32,256,32); x.fillStyle='rgba(120,80,40,.22)'; x.fillRect(0,i*32,256,2); x.fillRect((i*83)%256,i*32,2,32); }
  const t=new THREE.CanvasTexture(cv); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(5,3.6); return t;
}

export function buildHouse(){
  const R=world.root, box=(x0,x1,z0,z1)=>world.colliders.push({x0:x0,x1:x1,z0:z0,z1:z1});
  // Suelo
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(14,10),new THREE.MeshStandardMaterial({map:woodTex(),roughness:.9})); floor.rotation.x=-Math.PI/2; floor.receiveShadow=true; R.add(floor);
  // Paredes (las dos cercanas a la cámara se ocultan en vista aérea)
  const wm=mat('#d6e4ff'), wm2=mat('#c8dbfc');
  const wall=(w,h,d,x,y,z,m)=>{ const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m); b.position.set(x,y,z); b.receiveShadow=true; R.add(b); return b; };
  wall(14.6,3,.3,0,1.5,-5.15,wm); wall(.3,3,4.8,-7.15,1.5,-2.9,wm2); wall(.3,3,3.8,-7.15,1.5,3.4,wm2); wall(.3,.7,2,-7.15,2.65,.5,wm2);
  world.walls.front=wall(14.6,3,.3,0,1.5,5.15,wm); world.walls.right=wall(.3,3,10.6,7.15,1.5,0,wm2);
  wall(14,.14,.06,0,.07,-4.98,mat('#ffffff')); wall(.06,.14,4.5,-6.98,.07,-2.75,mat('#ffffff')); wall(.06,.14,3.5,-6.98,.07,3.25,mat('#ffffff'));
  world.ceil=new THREE.Mesh(new THREE.PlaneGeometry(14.6,10.6),new THREE.MeshStandardMaterial({color:'#f4f8ff',side:THREE.DoubleSide})); world.ceil.rotation.x=Math.PI/2; world.ceil.position.y=3; R.add(world.ceil);
  // Ventana
  R.add(at(new THREE.Mesh(new THREE.PlaneGeometry(2.2,1.5),new THREE.MeshBasicMaterial({color:'#bfe6ff'})),2.2,1.75,-4.99));
  R.add(at(RB(2.4,.1,.12,.03,'#ffffff'),2.2,2.55,-4.95)); R.add(at(RB(2.4,.1,.12,.03,'#ffffff'),2.2,.95,-4.95)); R.add(at(RB(.1,1.7,.12,.03,'#ffffff'),1.05,1.75,-4.95)); R.add(at(RB(.1,1.7,.12,.03,'#ffffff'),3.35,1.75,-4.95)); R.add(at(RB(.06,1.6,.1,.02,'#ffffff'),2.2,1.75,-4.95));
  // Puerta (pared izquierda): marco fijo; el tapón cerrado solo se ve fuera de la primera persona
  R.add(at(RB(.34,2.3,.1,.02,'#c48b5a'),-7.15,1.15,-.5)); R.add(at(RB(.34,2.3,.1,.02,'#c48b5a'),-7.15,1.15,1.5)); R.add(at(RB(.34,.1,2.1,.02,'#c48b5a'),-7.15,2.32,.5));
  const plug=world.plug=new THREE.Group(); R.add(plug);
  const pw=new THREE.Mesh(new THREE.BoxGeometry(.3,2.3,2.0),wm2); pw.position.set(-7.15,1.15,.5); pw.receiveShadow=true; plug.add(pw);
  plug.add(at(RB(.12,2.3,1.2,.04,'#c48b5a'),-6.97,1.15,.5)); plug.add(at(sph(.06,'#ffc24d'),-6.88,1.1,.05));
  box(-7.3,-7.0,-5.3,-.5); box(-7.3,-7.0,1.5,5.3);
  // Alfombra
  R.add(at(RB(4.4,.04,3,.3,'#a9d9f2'),-.6,.02,1.8)); R.add(at(RB(3.6,.045,2.2,.3,'#c9e9fa'),-.6,.025,1.8));
  // Sofá
  const sofa=new THREE.Group(); sofa.position.set(-4,0,-4.2); R.add(sofa);
  sofa.add(at(RB(3.2,.45,1.3,.12,'#4f86dc'),0,.3,0)); sofa.add(at(RB(3.2,.85,.36,.14,'#4a7fd0'),0,.78,-.5));
  [-1,1].forEach(s=>{ sofa.add(at(RB(.36,.7,1.3,.14,'#4a7fd0'),s*1.42,.55,0)); sofa.add(at(RB(1.2,.22,1.0,.09,'#79a6ee'),s*.62,.64,.06)); });
  const pil=at(RB(.5,.45,.18,.08,'#ff8a6f'),1.0,.98,-.2); pil.rotation.z=.25; pil.rotation.y=-.3; sofa.add(pil);
  box(-5.6,-2.4,-4.85,-3.55);
  // Librero con libros que caen
  const sh=new THREE.Group(); sh.position.set(-.8,0,-4.75); R.add(sh);
  sh.add(at(RB(1.6,.08,.45,.02,'#c48b5a'),0,.04,0)); sh.add(at(RB(1.6,.08,.45,.02,'#c48b5a'),0,2.2,0));
  [-.76,.76].forEach(x=>sh.add(at(RB(.08,2.2,.45,.02,'#c48b5a'),x,1.1,0))); sh.add(at(RB(1.6,2.2,.04,.01,'#b57b4b'),0,1.1,-.2));
  [.8,1.5].forEach(y=>sh.add(at(RB(1.6,.06,.45,.02,'#c48b5a'),0,y,0)));
  const bcol=['#ff7a66','#ffc24d','#6fd6f0','#4a8bdd','#9cc9cc','#ff8a6f','#c9dbff'];
  [.86,1.56,2.26].slice(0,2).forEach((y,r)=>{ for(let i=0;i<5;i++){
    const b=RB(.13,.42+((i+r)%3)*.05,.3,.03,bcol[(i*2+r)%7]); const px=-.55+i*.26, py=y-.02+.21; b.position.set(px,py,0); sh.add(b);
    const wp=new THREE.Vector3(); world.books.push({m:b,home:b.position.clone(),homeRot:b.rotation.clone(),parent:sh,delay:(r*5+i)*.1,state:0,v:new THREE.Vector3(),rv:new THREE.Vector3()}); } });
  box(-1.6,0,-5,-4.5);
  // Cómoda del kit y cuadro
  R.add(at(RB(2,.9,.7,.06,'#dcae7d'),5,.45,-4.6)); R.add(at(RB(.94,.7,.02,.01,'#c48b5a'),4.5,.47,-4.24)); R.add(at(RB(.94,.7,.02,.01,'#c48b5a'),5.5,.47,-4.24));
  box(4,6,-5,-4.2);
  const kitBag=makeBackpack(); kitBag.scale.setScalar(.36); kitBag.position.set(5,.9,-4.55); kitBag.rotation.y=.12; R.add(kitBag); world.kitBag=kitBag;
  const pic=new THREE.Group(); pic.position.set(5,2.35,-4.95); pic.add(at(RB(.95,.72,.06,.03,'#ffffff'),0,-.4,0)); pic.add(at(new THREE.Mesh(new THREE.PlaneGeometry(.78,.55),new THREE.MeshBasicMaterial({color:'#9fd0f2'})),0,-.4,.04)); R.add(pic); world.pics.push(pic);
  const pic2=new THREE.Group(); pic2.position.set(-6.94,2.3,-2.4); pic2.rotation.y=Math.PI/2; pic2.add(at(RB(.9,.7,.06,.03,'#ffffff'),0,-.4,0)); pic2.add(at(new THREE.Mesh(new THREE.PlaneGeometry(.74,.54),new THREE.MeshBasicMaterial({color:'#ffd9a0'})),0,-.4,.04)); R.add(pic2); world.pics.push(pic2);
  // Mesa y sillas
  const tb=new THREE.Group(); tb.position.set(3.2,0,1.8); R.add(tb);
  tb.add(at(RB(2.3,.12,1.3,.05,'#e6c199'),0,.85,0)); [[-1,-.5],[1,-.5],[-1,.5],[1,.5]].forEach(p=>tb.add(at(cyl(.06,.06,.85,'#c48b5a',10),p[0]*1.0,.42,p[1]*.52)));
  box(2.05,4.35,1.15,2.45);
  [2.6,3.8].forEach(x=>{ const ch=new THREE.Group(); ch.position.set(x,0,.65); ch.add(at(RB(.6,.1,.6,.04,'#79a6ee'),0,.5,0)); ch.add(at(RB(.6,.6,.08,.04,'#79a6ee'),0,.85,-.26)); [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(p=>ch.add(at(cyl(.035,.035,.5,'#c48b5a',8),p[0]*.24,.25,p[1]*.24))); R.add(ch); box(x-.3,x+.3,.35,.95); });
  // Cama
  const bed=new THREE.Group(); bed.position.set(-5.6,0,3.7); R.add(bed);
  bed.add(at(RB(2.8,.35,2.2,.08,'#c48b5a'),0,.18,0)); bed.add(at(RB(2.7,.3,2.1,.1,'#f1f6ff'),0,.5,0)); bed.add(at(RB(1.5,.34,2.14,.1,'#9cc9cc'),.6,.52,0)); bed.add(at(RB(.6,.2,.9,.08,'#ffffff'),-1.05,.72,0)); bed.add(at(RB(.1,1.0,2.2,.04,'#b57b4b'),-1.4,.6,0));
  box(-7,-4.2,2.6,4.8);
  // Planta
  const pl=new THREE.Group(); pl.position.set(6.2,0,-4.2); R.add(pl); pl.add(at(cyl(.3,.24,.5,'#ff8a6f',16),0,.25,0)); [[0,.9,0,.42],[-.2,.7,.1,.3],[.22,.75,-.1,.3],[.05,1.15,.05,.28]].forEach(p=>pl.add(at(sph(p[3],'#7cc8a0',1,1.2,1),p[0],p[1],p[2]))); world.plant=pl; box(5.8,6.6,-4.6,-3.8);
  // Lámpara de pie
  const lp=new THREE.Group(); lp.position.set(-6.4,0,-4.4); R.add(lp); lp.add(at(cyl(.22,.26,.06,'#14305e',16),0,.03,0)); lp.add(at(cyl(.03,.03,1.5,'#14305e',8),0,.78,0));
  const shade=at(mesh(new THREE.CylinderGeometry(.22,.36,.42,20,1,true),'#fff2d0',{emissive:'#ffd9a0',emissiveIntensity:.5,side:THREE.DoubleSide}),0,1.65,0); lp.add(shade); world.shade=shade; lampLight.position.set(-6.4,1.6,-4.4);
  box(-6.7,-6.1,-4.7,-4.1);
  // Pasillo de entrada (detrás de la puerta izquierda; solo se muestra en primera persona)
  const H=world.hall=new THREE.Group(); H.visible=false; R.add(H);
  const hw=(w,h,d,x,y,z,m)=>{ const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m); b.position.set(x,y,z); b.receiveShadow=true; H.add(b); return b; };
  const hTex=woodTex(); hTex.repeat.set(2.4,1);
  const hf=new THREE.Mesh(new THREE.PlaneGeometry(6.3,2.6),new THREE.MeshStandardMaterial({map:hTex,roughness:.9})); hf.rotation.x=-Math.PI/2; hf.position.set(-10.15,.005,.5); hf.receiveShadow=true; H.add(hf);
  const hc=new THREE.Mesh(new THREE.PlaneGeometry(6.3,3.2),new THREE.MeshStandardMaterial({color:'#f4f8ff',side:THREE.DoubleSide})); hc.rotation.x=Math.PI/2; hc.position.set(-10.3,3,.5); H.add(hc);
  hw(6.3,3,.3,-10.3,1.5,-.95,wm); hw(6.3,3,.3,-10.3,1.5,1.95,wm); hw(.3,3,3.2,-13.45,1.5,.5,wm2);
  hw(6,.14,.06,-10.3,.07,-.78,mat('#ffffff')); hw(6,.14,.06,-10.3,.07,1.78,mat('#ffffff')); hw(.06,.14,2.6,-13.28,.07,.5,mat('#ffffff'));
  H.add(at(mesh(new THREE.CylinderGeometry(.34,.34,.05,24),'#fff2d0',{emissive:'#ffd9a0',emissiveIntensity:.8}),-10.3,2.96,.5));
  // Puerta de la calle y felpudo
  H.add(at(RB(.12,2.3,1.2,.04,'#e8917a'),-13.27,1.15,.5)); H.add(at(sph(.06,'#ffc24d'),-13.16,1.1,.05)); H.add(at(RB(1.3,.03,.9,.02,'#4a7fd0'),-12.4,.03,.5));
  // Consola con lámpara, planta y cuadro
  H.add(at(RB(1.5,.08,.42,.03,'#e6c199'),-9.4,.78,-.55)); H.add(at(RB(1.4,.3,.38,.03,'#dcae7d'),-9.4,.6,-.55));
  [-1,1].forEach(sx=>[-1,1].forEach(sz=>H.add(at(cyl(.03,.03,.76,'#c48b5a',8),-9.4+sx*.68,.38,-.55+sz*.16))));
  H.add(at(cyl(.05,.07,.3,'#14305e',10),-9.9,.97,-.55)); H.add(at(mesh(new THREE.CylinderGeometry(.11,.16,.2,16,1,true),'#fff2d0',{emissive:'#ffd9a0',emissiveIntensity:.5,side:THREE.DoubleSide}),-9.9,1.22,-.55));
  H.add(at(cyl(.1,.08,.16,'#ff8a6f',12),-8.85,.9,-.55)); H.add(at(sph(.14,'#7cc8a0',1,1.2,1),-8.85,1.08,-.55));
  H.add(at(RB(.9,.7,.05,.03,'#ffffff'),-9.4,1.75,-.77)); H.add(at(new THREE.Mesh(new THREE.PlaneGeometry(.74,.54),new THREE.MeshBasicMaterial({color:'#9fd0f2'})),-9.4,1.75,-.74));
  // Colgador con correas y banca con zapatos
  H.add(at(RB(.9,.08,.06,.02,'#c48b5a'),-11.5,1.55,-.76)); H.add(at(mesh(new THREE.TorusGeometry(.13,.03,8,18),'#ff7a66'),-11.75,1.35,-.72)); H.add(at(mesh(new THREE.TorusGeometry(.1,.03,8,18),'#14305e'),-11.3,1.38,-.72));
  H.add(at(RB(1.3,.42,.42,.06,'#79a6ee'),-11.8,.21,1.55)); H.add(at(RB(.14,.1,.3,.04,'#ff8a6f'),-12.1,.47,1.55)); H.add(at(RB(.14,.1,.3,.04,'#ff8a6f'),-11.92,.47,1.55));
  box(-13.6,-7.3,-1.1,-.8); box(-13.6,-7.3,1.8,2.1); box(-13.6,-13.3,-1.1,2.1); box(-10.15,-8.65,-.8,-.34); box(-12.45,-11.15,1.3,1.8);
  // Polvo
  const n=140, pos=new Float32Array(n*3); for(let i=0;i<n;i++){ pos[i*3]=rnd(-6.5,6.5); pos[i*3+1]=rnd(0,3); pos[i*3+2]=rnd(-4.5,4.5); }
  const dg=new THREE.BufferGeometry(); dg.setAttribute('position',new THREE.BufferAttribute(pos,3));
  world.dust=new THREE.Points(dg,new THREE.PointsMaterial({color:'#ffffff',size:.07,transparent:true,opacity:0,depthWrite:false})); world.dust.frustumCulled=false; R.add(world.dust);
  // Marca de destino
  const b=new THREE.Group(); const cone=mesh(new THREE.ConeGeometry(.22,.5,4),'#ff7a66',{emissive:'#ff7a66',emissiveIntensity:.35}); cone.rotation.x=Math.PI; cone.castShadow=false; b.add(cone);
  const ring=new THREE.Mesh(new THREE.RingGeometry(.5,.62,32),new THREE.MeshBasicMaterial({color:'#ff7a66',transparent:true,opacity:.8,side:THREE.DoubleSide})); ring.rotation.x=-Math.PI/2; b.add(ring); b.userData={cone:cone,ring:ring};
  b.visible=false; houseScene.add(b); world.beacon=b;
}
