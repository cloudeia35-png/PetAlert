/* ======================================================================
   Cámara y vistas: modos (aérea, primera persona, tercera persona, vitrina), enfoques y acercamientos.
   ====================================================================== */
import * as THREE from 'three';
import { rt } from '../core/runtime.js';
import { SHAKE, damp } from '../core/utils.js';
import { player } from './player.js';
import { Q } from './quake.js';
import { avatar } from '../three/actors.js';
import { camera, hallLight, houseScene, showScene, world } from '../three/engine.js';
import { FOCUS, S } from '../three/showcase.js';

const orbit={theta:.8,r:16.5,h:10,tx:0,ty:1,tz:0,speed:.09,amp:.3,sx:0,sy:0};
export const cam={goal:new THREE.Vector3(),tgt:new THREE.Vector3(0,1,0),cur:new THREE.Vector3(0,1,0),key:'pets',d:10,sx:0,sy:0,follow:null,offY:0,rate:4};
export const warp={v:0,t:0};

const _gt=new THREE.Vector3();

export function updateCamera(dt){
  const k=Q.k*SHAKE;
  if(rt.mode==='fp'){
    const eye=1.55-(player.covering?.6:0)+(player.moving?Math.sin(player.bob)*.035:0);
    camera.position.set(player.pos.x,eye,player.pos.z); camera.rotation.set(player.pitch,player.yaw,0);
  }else if(rt.mode==='tp'){
    const t=new THREE.Vector3(player.pos.x*.75,.9,player.pos.z*.75);
    cam.cur.lerp(t,1-Math.exp(-5*dt));
    camera.position.set(cam.cur.x+9,cam.cur.y+9.2,cam.cur.z+9); camera.lookAt(cam.cur);
  }else if(rt.mode==='orbit'){
    const th=orbit.theta+Math.sin(rt.time*orbit.speed)*orbit.amp;
    camera.position.set(orbit.tx+Math.cos(th)*orbit.r,orbit.h,orbit.tz+Math.sin(th)*orbit.r);
    camera.lookAt(orbit.tx,orbit.ty,orbit.tz); camera.translateX(-orbit.sx); camera.translateY(-orbit.sy);
  }else{
    const gt=cam.follow?cam.follow.getWorldPosition(_gt):_gt.fromArray(cam.goalT);
    cam.tgt.lerp(gt,1-Math.exp(-4*dt)); cam.d=damp(cam.d,cam.goalD,cam.rate||4,dt); const d=cam.d;
    camera.position.set(cam.tgt.x,cam.tgt.y+d*.14,cam.tgt.z+d); camera.lookAt(cam.tgt);
    const wide=innerWidth>820; cam.sx=damp(cam.sx,cam.follow&&wide?d*.2:0,4,dt); cam.sy=damp(cam.sy,cam.follow?(wide?0:d*.17):(cam.offY?cam.offY*d:0),2.5,dt); camera.translateX(cam.sx); camera.translateY(-cam.sy);
    const f=FOCUS[cam.key]||{sway:.3}; if(S[cam.grp]) S[cam.grp].rotation.y=damp(S[cam.grp].rotation.y,rt.showRot+Math.sin(rt.time*.6)*f.sway*(cam.follow?0:1),10,dt);
  }
  if(k>.001){ camera.position.x+=(Math.random()-.5)*.16*k; camera.position.y+=(Math.random()-.5)*.12*k; camera.position.z+=(Math.random()-.5)*.16*k; camera.rotateZ((Math.random()-.5)*.025*k); }
}

export function setMode(m){
  rt.mode=m; rt.scene=(m==='show')?showScene:houseScene;
  const aerial=(m==='orbit'||m==='tp'), fp=m==='fp';
  world.walls.front.visible=!aerial; world.walls.right.visible=!aerial; world.ceil.visible=fp;
  world.hallOn=fp; world.hall.visible=fp; world.plug.visible=!fp; hallLight.intensity=fp?.45:0;
  avatar.visible=(m==='tp'); camera.fov=fp?68:(m==='show'?36:34); camera.updateProjectionMatrix();
  if(m==='tp'){ cam.cur.set(player.pos.x*.75,.9,player.pos.z*.75); }
}

export function setOrbit(o){ Object.assign(orbit,{theta:.8,r:16.5,h:10,tx:0,ty:1,tz:0,speed:.09,amp:.3,sx:0,sy:0},o||{}); }

export function showFocus(grp,key){
  Object.keys(S).forEach(k=>S[k].visible=(k===grp)); const f=FOCUS[key||grp]; cam.key=key||grp; cam.grp=grp; cam.goalT=f.t; cam.goalD=f.d; cam.follow=null; cam.offY=0; cam.rate=4; rt.showRot=0;
  const s=S[grp]; ['dog','cat'].forEach(n=>{ if(s[n]&&s[n].userData&&s[n].userData.type){ s[n].userData.hop=0; } });
}

export function zoomTo(anchor,d,rot){
  if(!anchor){ const f=FOCUS[cam.key]; cam.follow=null; cam.goalD=f.d; rt.showRot=0; return; }
  cam.follow=anchor; cam.goalD=d||3.6; rt.showRot=rot||0;
}
