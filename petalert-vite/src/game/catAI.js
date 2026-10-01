/* ======================================================================
   Comportamiento de la gata durante la misión de escape.
   ====================================================================== */
import { audio } from '../core/audio.js';
import { lerp, rnd } from '../core/utils.js';
import { player } from './player.js';
import { CAT_SPOTS, cat, petState, placePet } from '../three/actors.js';

/* Gata que huye entre tres escondites */
export const catAI={spot:1,flees:0,dash:null,cornered:false,
  reset(){ this.flees=0; this.cornered=false; this.dash=null; this.spot=Math.random()<.5?1:2; const s=CAT_SPOTS[this.spot]; placePet(cat,s[0],s[1],s[2],rnd(0,6),.6); },
  update(dt){
    const u=cat.userData;
    if(this.dash){ const d=this.dash; d.t+=dt/d.dur; const k=Math.min(1,d.t);
      u.base.x=lerp(d.a[0],d.b[0],k); u.base.z=lerp(d.a[2],d.b[2],k); u.base.y=lerp(d.a[1],d.b[1],k)+Math.sin(k*Math.PI)*.6; cat.position.copy(u.base);
      cat.rotation.y=Math.atan2(d.b[0]-d.a[0],d.b[2]-d.a[2]); if(k>=1){ this.dash=null; this.spot=d.to; if(this.cornered){ cat.rotation.y=-Math.PI/2; petState(cat,{wag:.2,shiver:.7,eyes:1.4}); } } return; }
    if(this.cornered)return;
    const dist=Math.hypot(player.pos.x-u.base.x,player.pos.z-u.base.z);
    if(dist<2.2&&!player.covering){
      let to; if(this.flees===0)to=(this.spot===1)?2:1; else { to=0; this.cornered=true; }
      this.flees++; const a=CAT_SPOTS[this.spot], b=CAT_SPOTS[to]; this.dash={a:a,b:b,t:0,to:to,dur:Math.hypot(b[0]-a[0],b[2]-a[2])/7}; audio.meow();
    }
  }
};
