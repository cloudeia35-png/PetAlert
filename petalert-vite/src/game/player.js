/* ======================================================================
   Jugador: movimiento en primera y tercera persona, colisiones y reinicio de posición.
   ====================================================================== */
import * as THREE from 'three';
import { rt } from '../core/runtime.js';
import { angDiff, clamp, damp } from '../core/utils.js';
import { Q } from './quake.js';
import { avatar } from '../three/actors.js';
import { world } from '../three/engine.js';

export const player={pos:new THREE.Vector3(0,0,3.5),yaw:0,pitch:0,moving:false,covering:false,walked:0,face:0,bob:0};
export const keys=new Set(), js={x:0,y:0};

const PLUG_BOX={x0:-7.3,x1:-7.0,z0:-.5,z1:1.5};

function collide(p){
  const R=.35; p.x=clamp(p.x,world.hallOn?-13:-6.6,6.6); p.z=clamp(p.z,-4.6,4.6);
  const hit=b=>{
    const cx=clamp(p.x,b.x0,b.x1), cz=clamp(p.z,b.z0,b.z1), dx=p.x-cx, dz=p.z-cz, d2=dx*dx+dz*dz;
    if(d2<R*R){
      if(d2>1e-6){ const d=Math.sqrt(d2); p.x=cx+dx/d*R; p.z=cz+dz/d*R; }
      else { const l=p.x-b.x0,r=b.x1-p.x,t=p.z-b.z0,bt=b.z1-p.z,m=Math.min(l,r,t,bt); if(m===l)p.x=b.x0-R; else if(m===r)p.x=b.x1+R; else if(m===t)p.z=b.z0-R; else p.z=b.z1+R; }
    }
  };
  world.colliders.forEach(hit); if(!world.hallOn)hit(PLUG_BOX);
}

export function resetPlayer(x,z,yaw){ player.locked=false; player.pos.set(x,0,z); player.yaw=yaw||0; player.pitch=0; player.walked=0; player.face=Math.PI*.75; }

export function updatePlayer(dt){
  if(rt.mode!=='fp'&&rt.mode!=='tp')return;
  const K=c=>keys.has(c);
  let fwd=(K('KeyW')||K('ArrowUp')?1:0)-(K('KeyS')||K('ArrowDown')?1:0)-js.y;
  let str=(K('KeyD')?1:0)-(K('KeyA')?1:0)+js.x;
  if(rt.mode==='tp')str+=(K('ArrowRight')?1:0)-(K('ArrowLeft')?1:0); else player.yaw+=((K('ArrowLeft')?1:0)-(K('ArrowRight')?1:0))*dt*1.9;
  if(player.locked){ fwd=0; str=0; }
  const len=Math.hypot(fwd,str); if(len>1){fwd/=len;str/=len;}
  const strong=Q.active&&Q.phase==='strong';
  player.covering=(rt.coverHeld||K('Space')||K('KeyC'))&&rt.mode==='tp';
  let sp=rt.mode==='fp'?3.1:3.5; if(strong)sp*=player.covering?0:.3; else if(player.covering)sp*=.5; else if(Q.active)sp*=.88;
  let dx,dz;
  if(rt.mode==='fp'){ dx=-Math.sin(player.yaw)*fwd+Math.cos(player.yaw)*str; dz=-Math.cos(player.yaw)*fwd-Math.sin(player.yaw)*str; }
  else { dx=(-fwd+str)*.7071; dz=(-fwd-str)*.7071; }
  player.moving=len>.06&&sp>0;
  if(player.moving){ const ox=player.pos.x,oz=player.pos.z; player.pos.x+=dx*sp*dt; player.pos.z+=dz*sp*dt; collide(player.pos); player.walked+=Math.hypot(player.pos.x-ox,player.pos.z-oz); player.bob+=dt*(rt.mode==='fp'?9:12);
    if(rt.mode==='tp'&&(Math.abs(dx)+Math.abs(dz))>.01) player.face+=angDiff(player.face,Math.atan2(dx,dz))*Math.min(1,dt*12); }
  if(rt.mode==='tp'){
    avatar.position.set(player.pos.x,0,player.pos.z); avatar.rotation.y=player.face;
    const sw=player.moving?Math.sin(player.bob)*.7:0, u=avatar.userData; u.legL.rotation.x=sw; u.legR.rotation.x=-sw; u.armL.rotation.x=-sw*.8; u.armR.rotation.x=sw*.8;
    avatar.scale.y=damp(avatar.scale.y,player.covering?.62:1,14,dt);
  }
}
