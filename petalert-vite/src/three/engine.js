/* ======================================================================
   Motor 3D: renderizador, escenas, cámara, luces y contenedor del mundo.
   ====================================================================== */
import * as THREE from 'three';
import { rt } from '../core/runtime.js';
import { $, coarse } from '../core/utils.js';

export const canvas=$('#gl');
export const renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.setClearColor(0x000000,0);

export const houseScene=new THREE.Scene(), showScene=new THREE.Scene();
export const camera=new THREE.PerspectiveCamera(40,1,.1,120);
camera.rotation.order='YXZ';
Object.assign(rt,{scene:houseScene});

export const hemi=new THREE.HemisphereLight('#eaf3ff','#e6d3b8',.62), sun=new THREE.DirectionalLight('#ffffff',.56), lampLight=new THREE.PointLight('#ffd9a0',.5,7), hallLight=new THREE.PointLight('#ffd9a0',0,9);
hallLight.position.set(-10.2,2.4,.5);
houseScene.add(hemi,sun,lampLight,hallLight,sun.target);
sun.position.set(7,14,8);
sun.castShadow=true;
sun.shadow.mapSize.set(coarse?1024:2048,coarse?1024:2048);
Object.assign(sun.shadow.camera,{left:-11,right:11,top:11,bottom:-11,near:1,far:40});
sun.shadow.bias=-.0006;
showScene.add(new THREE.HemisphereLight('#ffffff','#bcd4ff',.8));
const showSun=new THREE.DirectionalLight('#ffffff',.62);
showSun.position.set(3,7,6);
showScene.add(showSun);
export const cDay=new THREE.Color('#eaf3ff'), cDusk=new THREE.Color('#7f9ccc'), sunDay=new THREE.Color('#ffffff'), sunDusk=new THREE.Color('#9fbfff');

export const world={walls:{},books:[],pics:[],colliders:[],plant:null,shade:null,dust:null,beacon:null,ceil:null,root:new THREE.Group()};
houseScene.add(world.root);
