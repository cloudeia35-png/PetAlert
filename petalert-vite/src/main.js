/* ======================================================================
   Punto de entrada: carga estilos, construye el mundo y arranca el bucle principal.
   ====================================================================== */
import './styles/main.css';
import { rt } from './core/runtime.js';
import { $, damp } from './core/utils.js';
import { animPets } from './game/animate.js';
import { updateCamera, warp } from './game/camera.js';
import { buildDebris, pulseAnim, updateBooks, updateDebris, updateWorldFX } from './game/effects.js';
import { updateInteract } from './game/interact.js';
import { keys, updatePlayer } from './game/player.js';
import { updateQuake } from './game/quake.js';
import { resize } from './input.js';
import { go } from './steps/flow.js';
import { buildActors } from './three/actors.js';
import { camera, renderer } from './three/engine.js';
import { buildHouse } from './three/house.js';
import { buildShowcase, sizesLayout } from './three/showcase.js';
import { buildSeismo, updateBanner, updateHS, updateSeismo, updateTip } from './ui/hud.js';

let last=performance.now();

function frame(now){
  const dt=Math.min(.05,(now-last)/1000); last=now; rt.time+=dt;
  updatePlayer(dt); if(rt.curTick)rt.curTick(dt); updateQuake(dt); updateBooks(dt); updateDebris(dt); updateWorldFX(dt); pulseAnim(dt); animPets(dt); updateCamera(dt); warp.v=damp(warp.v,warp.t,3,dt); { const bf=rt.mode==='fp'?68:(rt.mode==='show'?36:34), ff=bf+warp.v*26; if(Math.abs(camera.fov-ff)>.02){ camera.fov=ff; camera.updateProjectionMatrix(); } } updateSeismo(dt);
  updateInteract(); updateBanner();
  const cbtn=$('#coverBtn'); if(!cbtn.hidden)cbtn.classList.toggle('held',rt.coverHeld||keys.has('Space')||keys.has('KeyC'));
  renderer.render(rt.scene,camera); updateHS(); updateTip();
  requestAnimationFrame(frame);
}

/* Arranque: construye el mundo por partes para mostrar la barra de carga */
const tick=()=>new Promise(r=>setTimeout(r,60));

(async function boot(){
  const bar=$('#loadBar'), msg=$('#loaderMsg'); resize(); buildSeismo();
  try{
    bar.style.width='15%'; await tick(); buildHouse(); buildDebris();
    bar.style.width='45%'; msg.textContent='Acomodando a las mascotas…'; await tick(); buildActors();
    bar.style.width='75%'; msg.textContent='Guardando el kit de emergencia…'; await tick(); buildShowcase(); sizesLayout(null);
    bar.style.width='100%'; msg.textContent='Todo listo'; await new Promise(r=>setTimeout(r,500));
  }catch(err){ msg.textContent='Ocurrió un error al preparar la escena. Recarga la página.'; console.error(err); return; }
  requestAnimationFrame(frame);
  go('home'); $('#loader').classList.add('out'); setTimeout(()=>{ $('#loader').hidden=true; },800);
})();
