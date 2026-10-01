/* ======================================================================
   Pasos del recorrido: Inicio, Antes, Durante, Después y Cierre.
   ====================================================================== */
import { rt } from '../core/runtime.js';
import { audio } from '../core/audio.js';
import { $, $$, coarse, shuffle } from '../core/utils.js';
import { CONTENT } from '../data/content.js';
import { cam, setMode, setOrbit, showFocus } from '../game/camera.js';
import { catAI } from '../game/catAI.js';
import { dropBooks, resetBooks } from '../game/effects.js';
import { player, resetPlayer } from '../game/player.js';
import { FREEZE_WHILE_COVERING, MISSION_TIME, Q, isStrong, quakeStart } from '../game/quake.js';
import { fadeGo, go, restartWipe } from './flow.js';
import { avatar, cat, catSprites, dog, petState, placePet, popPet, walkPet } from '../three/actors.js';
import { S, sizesLayout } from '../three/showcase.js';
import { PETSVG, addHS, clearHS, icon, objective, panel, screen, setBG, setBeacon, setInteract, setTimer, showHint, showTimer, state } from '../ui/hud.js';
import { ILL } from '../ui/illustrations.js';
import { discoverStep, textStep } from '../ui/widgets.js';

export const STEPS={
  home:{stage:0,w:0,enter(){
    setMode('orbit'); setBG('day'); setOrbit({r:17,h:10.5,theta:.85,sx:innerWidth>900?4.6:0,sy:innerWidth>900?0:-3.4});
    placePet(dog,-4,.75,-4.05,.1,.62); dog.visible=true; petState(dog,{}); placePet(cat,-5.4,.65,3.6,.6,.6); cat.visible=true; petState(cat,{});
    $('#home').classList.add('active'); $('#hud').hidden=false;
  }},
  pets:{stage:0,w:.35,prev:'home',enter(){
    setMode('show'); setBG('show'); showFocus('pets');
    panel({title:CONTENT.pets.title,text:CONTENT.pets.text,actions:[{label:'Continuar',fn:()=>go('intro')}]});
    const g=S.pets;
    addHS({cls:'pill',label:'Cacao',anchor:g.dog.userData.anchors.head,onClick:()=>{ g.dog.userData.hop=1; audio.bark(); }});
    addHS({cls:'pill',label:'Nube',anchor:g.cat.userData.anchors.head,onClick:()=>{ g.cat.userData.hop=1; audio.meow(); }});
  }},
  intro:{stage:0,w:.7,prev:'pets',enter(){
    state.greeted=false; dog.visible=cat.visible=true;
    setMode('orbit'); setOrbit({r:18,h:11}); resetPlayer(0,3.5,0); placePet(dog,-4,.75,-4.05,.1,.62); placePet(cat,-5.4,.65,3.6,.6,.6); petState(dog,{}); petState(cat,{});
    textStep(CONTENT.intro.text,'Continuar',()=>fadeGo('walk'));
  }},
  walk:{stage:1,w:.05,prev:'intro',enter(){
    setMode('fp'); resetBooks(); const c=CONTENT.walk; let phase=0, t=0, sq=0;
    const goKit=()=>{ phase=2; objective(c.b.t,c.b.s); setBeacon(5,-4.6,2.05); audio.ding(); setInteract({x:5,z:-3.9,r:2.3,label:c.open,fn:()=>go('kit')}); };
    petState(dog,{}); petState(cat,{});
    if(state.greeted){ /* al volver del kit se empieza dentro de la sala */
      resetPlayer(0,3.5,0); placePet(dog,-4,.75,-4.05,.1,.62); placePet(cat,-5.4,.65,3.6,.6,.6); dog.visible=cat.visible=true;
      phase=1; objective(c.a.t,c.a.s); showHint('fp'); if(coarse)$('#stick').hidden=false;
      rt.curTick=()=>{ if(phase===1&&player.walked>4)goKit(); }; return;
    }
    /* primera vez: empieza en el pasillo, las mascotas aparecen a saludar y luego se van a sus lugares */
    state.greeted=true; resetPlayer(-12.3,.5,-Math.PI/2); player.locked=true;
    placePet(dog,-10.3,0,-.05,-1.35,.62); placePet(cat,-10.5,0,1.15,-1.8,.6); dog.visible=cat.visible=false;
    objective(c.greet.t,c.greet.s);
    rt.curTick=dt=>{ t+=dt;
      if(sq===0&&t>.8){ sq=1; popPet(dog); audio.bark(); }
      else if(sq===1&&t>1.4){ sq=2; popPet(cat); audio.meow(); }
      else if(sq===2&&t>2.1){ sq=3;
        addHS({cls:'pill',label:'Cacao',anchor:dog.userData.anchors.head,onClick:()=>{ dog.userData.hop=1; audio.bark(); }});
        addHS({cls:'pill',label:'Nube',anchor:cat.userData.anchors.head,onClick:()=>{ cat.userData.hop=1; audio.meow(); }}); }
      else if(sq===3&&t>3.9){ sq=4; clearHS();
        walkPet(dog,[{x:-8.3,z:.4},{x:-6.2,z:.5},{x:-4.4,z:-2.5},{x:-4,z:-4.05,y:.75,ry:.1}],3.4);
        walkPet(cat,[{x:-8.3,z:.9},{x:-6.1,z:1},{x:-3.7,z:2.3},{x:-3.9,z:3.5},{x:-5.4,z:3.6,y:.65,ry:.6}],3.9);
        player.locked=false; objective(c.hall.t,c.hall.s); setBeacon(-7.6,.5,1.9); showHint('fp'); if(coarse)$('#stick').hidden=false; audio.blip(); }
      else if(sq===4&&player.walked>4.2){ sq=5; goKit(); }
    };
  }},
  kit:{stage:1,w:.4,prev:'walk',enter(){
    setMode('show'); showFocus('kit'); const g=S.kit, C=CONTENT.kit;
    discoverStep({title:C.title,text:C.text,zoom:3.6,items:C.items.map((it,i)=>Object.assign({anchor:g.items[i].userData.anchor},it)),next:()=>go('petwalk'),
      onPick:i=>{ g.items.forEach((x,j)=>x.userData.sel=(i===j)); }});
    g.items.forEach(x=>x.userData.sel=false);
  }},
  petwalk:{stage:1,w:.6,prev:'kit',enter(){
    setMode('fp'); resetPlayer(4.2,-2.4,Math.PI*.5+.2); const c=CONTENT.petwalk;
    placePet(dog,-4,.75,-4.05,.1,.62); petState(dog,{}); dog.visible=true; cat.visible=true; showHint('fp'); if(coarse)$('#stick').hidden=false;
    objective(c.t,c.s); setBeacon(-4,-4.05,2.1); setInteract({x:-4,z:-4.05,r:2.6,label:c.open,fn:()=>go('track')}); audio.bark();
  }},
  track:{stage:1,w:.8,prev:'petwalk',enter(){
    setMode('show'); showFocus('track'); const a=S.track.dog.userData.anchors, C=CONTENT.track; petState(S.track.dog,{});
    discoverStep({title:C.title,text:C.text,zoom:2.8,items:[a.tag,a.gps,a.chip].map((x,i)=>Object.assign({anchor:x,rot:[0,-1,Math.PI*.9][i]},C.items[i])),next:()=>go('antesEnd')});
  }},
  antesEnd:{stage:1,w:.95,prev:'track',enter(){
    setMode('orbit'); setOrbit({r:18,h:11}); placePet(dog,-4,.75,-4.05,.1,.62); textStep(CONTENT.antesEnd.text,CONTENT.antesEnd.cta,()=>go('quakeIntro'));
  }},
  quakeIntro:{stage:2,w:.04,prev:'antesEnd',enter(){
    setMode('orbit'); setOrbit({r:18,h:11}); resetBooks(); resetPlayer(0,3.5,0); state.done.clear();
    panel({text:CONTENT.quakeIntro.text,cls:'center shaky',actions:[{label:CONTENT.quakeIntro.cta,fn:()=>{ audio.init(); quakeStart(); go('hub'); }}]});
  }},
  hub:{stage:2,w:.3,prev:'quakeIntro',enter(){
    setMode('orbit'); setOrbit({r:19,h:12,sy:innerWidth>720?2.6:3.6,amp:.12}); const C=CONTENT.hub;
    placePet(dog,-4,.75,-4.05,.1,.62); petState(dog,{wag:0,shiver:.6,eyes:1.25}); dog.visible=true; cat.visible=true; placePet(cat,-5.4,.65,3.6,.6,.6); petState(cat,{wag:0,shiver:.6,eyes:1.25});
    if(!Q.active)quakeStart();
    const d=screen('<div id="hub" class="active"><div class="wrap card"><h2>'+C.title+'</h2><p class="sub">'+C.sub+'</p><div class="cards">'+
      C.cards.map(c=>'<div class="exp">'+PETSVG[c.pet]+'<div class="txt"><h3>'+c.t+'</h3><p>'+c.d+'</p></div><button class="btn" data-k="'+c.k+'">'+C.cta+'</button>'+(state.done.has(c.k)?'<span class="badge">'+C.done+'</span>':'')+'</div>').join('')+
      '</div><div class="foot"><button class="btn" id="hubNext" '+(state.done.size<3?'hidden':'')+'>'+C.next+'</button></div></div></div>');
    $$('.exp .btn',d).forEach(b=>b.addEventListener('click',()=>{ if(isStrong())return; audio.blip(); go('mission',{k:b.dataset.k}); }));
    $('#hubNext',d).addEventListener('click',()=>{ audio.blip(); go('sizeIntro'); });
    rt.stepData.lockHub=()=>{ const h=$('#hub'); if(h){ h.classList.toggle('locked',isStrong()); } };
    rt.onQuakePhase=()=>{ rt.stepData.lockHub&&rt.stepData.lockHub(); }; rt.stepData.lockHub(); $('#hub').classList.toggle('locked',isStrong());
    if(coarse||true)$('#coverBtn').hidden=false;
  }},
  mission:{stage:2,w:.5,prev:'hub',enter(p){
    const k=p.k, C=CONTENT.mission[k], LIMIT=MISSION_TIME; setMode('tp'); resetPlayer(k==='cat'?0:-1,3.2,0); avatar.scale.y=1; $('#coverBtn').hidden=false; showHint('tp'); if(coarse)$('#stick').hidden=false;
    if(p.retry){ resetBooks(); dropBooks(6); }
    objective(C.obj.t,C.obj.s); let t=0, hint=false, left=LIMIT, over=false, extra=null;
    const finish=()=>{ over=true; go('close_'+k); };
    const fail=()=>{ over=true; player.locked=true; setInteract(null); setBeacon(null); objective(null); showTimer(false); $('#coverBtn').hidden=true; audio.no(); audio.whimper();
      const F=CONTENT.mission.fail; panel({title:F.t,text:F.s,cls:'center',actions:[{label:F.cta,fn:()=>go('mission',{k:k,retry:true})}]}); };
    showTimer(true); setTimer(left,LIMIT);
    if(k==='hide'){ cat.visible=false; dog.visible=true; placePet(dog,3.2,0,1.8,Math.PI/2,.62); dog.scale.y=.5; petState(dog,{wag:0,shiver:.8,eyes:1.3});
      setInteract({x:3.2,z:1.8,r:2.7,label:C.open,fn:finish}); extra=dt=>{ t+=dt; if(t>4&&!hint){ hint=true; audio.whimper(); } }; }
    else if(k==='still'){ cat.visible=false; dog.visible=true; placePet(dog,-4,.75,-4.05,.1,.62); petState(dog,{wag:0,shiver:.35,eyes:1.35}); setBeacon(-4,-4.05,2.1);
      setInteract({x:-4,z:-4.05,r:2.6,label:C.open,fn:finish}); }
    else{ dog.visible=false; cat.visible=true; catSprites.forEach(s=>s.visible=true); catAI.reset(); petState(cat,{wag:1,shiver:.5,eyes:1.4});
      extra=dt=>{ catAI.update(dt); if(catAI.cornered&&!catAI.dash){ setInteract({x:cat.userData.base.x,z:cat.userData.base.z,r:2.3,label:C.open,fn:finish}); } else setInteract(null); }; }
    rt.curTick=dt=>{ if(over)return; if(extra)extra(dt); if(over)return;
      if(!(FREEZE_WHILE_COVERING&&isStrong()&&player.covering))left-=dt;
      setTimer(left,LIMIT); if(left<=0)fail(); };
  }},
  sizeIntro:{stage:2,w:.85,prev:'hub',enter(){
    setMode('orbit'); setOrbit({r:18,h:11}); placePet(dog,-4,.75,-4.05,.1,.62); petState(dog,{}); textStep(CONTENT.sizeIntro.text,'Continuar',()=>go('sizePick'));
  }},
  sizePick:{stage:2,w:.92,prev:'sizeIntro',enter(){
    setMode('show'); showFocus('sizes'); sizesLayout(null); const g=S.sizes, C=CONTENT.sizes;
    panel({title:CONTENT.sizePick.title,cls:'top'});
    ['large','medium','cat'].forEach(k=>addHS({cls:'pill',label:C[k].name,anchor:g[k].userData.anchors.head,onClick:()=>go('sizeInfo',{key:k})}));
  }},
  sizeInfo:{stage:2,w:.97,prev:'sizePick',enter(p){
    const k=p.key, C=CONTENT.sizes[k]; state.sizes.add(k); setMode('show'); showFocus('sizes','one'); sizesLayout(k); const pet=S.sizes[k];
    panel({title:C.name,text:C.text,actions:[{label:'Ver otro tamaño',ghost:true,fn:()=>go('sizePick')},{label:'Siguiente',fn:()=>go('despIntro')}]});
    const co=$('#callouts'); co.hidden=false; co.innerHTML=C.items.map((it,i)=>'<div class="callout card" data-i="'+i+'"><span class="n">'+(i+1)+'</span><div><h3>'+it.t+'</h3><p>'+it.d+'</p></div></div>').join('');
    const dots=[]; const on=i=>{ dots.forEach((d,j)=>d.classList.toggle('on',i===j)); $$('.callout',co).forEach((c,j)=>c.classList.toggle('on',i===j)); audio.ding(); };
    C.items.forEach((it,i)=>{ dots.push(addHS({anchor:pet.userData.anchors[it.a],num:i+1,aria:it.t,onClick:()=>on(i)})); });
    $$('.callout',co).forEach((c,i)=>c.addEventListener('click',()=>on(i))); on(0);
  }},
  despIntro:{stage:3,w:.05,prev:'sizeInfo',enter(){
    setMode('orbit'); setOrbit({r:18,h:11}); placePet(dog,-4,.75,-4.05,.1,.62); petState(dog,{}); cat.visible=dog.visible=true; placePet(cat,-5.4,.65,3.6,.6,.6); petState(cat,{});
    textStep(CONTENT.despIntro.text,'Continuar',()=>go('guide'));
  }},
  guide:{stage:3,w:.4,prev:'despIntro',enter(){
    setMode('show'); showFocus('bag'); const G=CONTENT.guide, n=G.tabs.length, got=new Set();
    const fa=(st,i)=>'<div class="fa"><figure>'+ILL[st.ill]()+'<span class="n">'+(i+1)+'</span></figure><div><h3>'+st.t+'</h3><p>'+st.d+'</p></div></div>';
    const pane=(T,i)=>'<section class="gpane" role="tabpanel" data-t="'+T.id+'" '+(i?'hidden':'')+'><h2>'+T.title+'</h2><p class="gintro">'+T.intro+'</p>'+
      (T.steps?'<div class="gnote">'+icon('shield')+'<span>'+G.note+'</span></div>'+T.steps.map(fa).join(''):
        '<div class="evill">'+ILL[T.ill]()+'</div><ul>'+T.items.map(it=>'<li><div class="ico">'+icon(it.i)+'</div><div><h3>'+it.t+'</h3><p>'+it.d+'</p></div></li>').join('')+'</ul>')+
      '<p class="end">Fin de la sección</p></section>';
    const d=screen('<div class="gbook card"><div class="gtabs" role="tablist">'+G.tabs.map((T,i)=>'<button class="gtab" role="tab" data-i="'+i+'"><span class="d"></span>'+T.label+'</button>').join('')+'</div><div class="gscroll">'+G.tabs.map(pane).join('')+'</div></div>'+
      '<div class="guide"><div class="avatar"><svg viewBox="0 0 64 64"><circle cx="32" cy="40" r="22" fill="#ff8a6f"/><circle cx="32" cy="26" r="12" fill="#f2c9a5"/><path d="M19 24a13 12 0 0 1 26 0c-6-5-20-5-26 0z" fill="#5a3a2a"/></svg></div><p class="card" id="gMsg">'+G.hint+'</p></div><div class="bookfoot"><button class="btn" id="gNext" disabled>Continuar</button></div>');
    const tabs=$$('.gtab',d), panes=$$('.gpane',d), sc=$('.gscroll',d);
    const show=i=>{ tabs.forEach((b,j)=>{ b.classList.toggle('on',i===j); b.setAttribute('aria-selected',i===j); }); panes.forEach((p,j)=>{ p.hidden=(i!==j); }); sc.scrollTop=0; };
    tabs.forEach((b,i)=>b.addEventListener('click',()=>{ audio.blip(); show(i); })); show(0);
    const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting&&!e.target.dataset.seen){ e.target.dataset.seen=1; e.target.classList.add('ok');
      const id=e.target.closest('.gpane').dataset.t; tabs[G.tabs.findIndex(x=>x.id===id)].classList.add('done'); got.add(id); audio.ding();
      if(got.size>=n){ $('#gNext',d).disabled=false; $('#gMsg',d).textContent=G.done; } } }),{threshold:.9});
    $$('.gpane .end',d).forEach(x=>io.observe(x)); rt.stepData.io=io;
    $('#gNext',d).addEventListener('click',()=>{ audio.blip(); go('quiz'); });
  }},
  quiz:{stage:3,w:.8,prev:'guide',enter(){
    setMode('show'); showFocus('pets','quiz'); const Qz=CONTENT.quiz, L=['a','b','c'], order=shuffle([0,1,2]);
    const d=screen('<div class="quiz"><div class="qcard card"><h2>'+Qz.q+'</h2><p>'+Qz.hint+'</p></div><div class="flips">'+
      order.map((oi,i)=>{ const o=Qz.opts[oi]; return '<button class="flip" data-ok="'+(o.ok?1:0)+'" aria-label="Opción '+L[i]+'"><span class="face front"><b>'+L[i]+'</b><span>'+o.text+'</span></span><span class="face back '+(o.ok?'ok':'no')+'"><strong>'+(o.ok?Qz.good:Qz.bad)+'</strong><span>'+o.fb+'</span></span></button>'; }).join('')+
      '</div><div class="quizfoot"><button class="btn" id="qNext" disabled>'+Qz.cta+'</button><small id="qMsg">'+Qz.wait+'</small></div></div>');
    $$('.flip',d).forEach(f=>f.addEventListener('click',()=>{ if(f.classList.contains('flipped'))return; f.classList.add('flipped');
      if(f.dataset.ok==='1'){ audio.ok(); $('#qNext',d).disabled=false; $('#qMsg',d).textContent=''; S.pets.cat.userData.hop=1; } else { audio.no(); } }));
    $('#qNext',d).addEventListener('click',()=>{ audio.blip(); go('close'); });
  }},
  close:{stage:4,w:.6,prev:'quiz',enter(){
    setMode('show'); showFocus('fin'); rt.bgOverride='dawn'; cam.d=17; cam.rate=1.1; cam.offY=-.26; const C=CONTENT.close, F=S.fin;
    petState(F.dog,{}); petState(F.cat,{}); const chk='<svg viewBox="0 0 24 24"><path d="M5 12l4.5 4.5L19 7"/></svg>';
    const d=screen('<div class="fin"><span class="kick">'+C.kicker+'</span><div class="words">'+C.words.map(w=>'<span class="w">'+w+'</span>').join('')+'</div><p class="line">'+C.text+'</p><ul class="chips">'+C.chips.map(c=>'<li>'+chk+c+'</li>').join('')+'</ul><button class="btn big cta" id="finBtn">'+C.cta+'</button></div>');
    $('#finBtn',d).addEventListener('click',()=>{ audio.blip(); go('about'); });
    const fl=$('#flash'); fl.classList.remove('on'); void fl.offsetWidth; fl.classList.add('on'); audio.swell();
    let t=0,b1=0,b2=0,hp=0; rt.curTick=dt=>{ t+=dt; if(!b1&&t>1.6){ b1=1; F.dog.userData.hop=1; audio.bark(); } if(!b2&&t>2.8){ b2=1; F.cat.userData.hop=1; audio.meow(); }
      if(t>6){ hp+=dt; if(hp>3){ hp=0; (Math.random()<.5?F.dog:F.cat).userData.hop=1; } } };
  }},
  about:{stage:4,w:.9,prev:'close',enter(){
    setMode('show'); showFocus('fin'); rt.bgOverride='dawn'; cam.offY=-.26; const A=CONTENT.about;
    const d=screen('<div class="about dawn card"><div class="logo-c">'+icon('paw')+'</div><h2>'+A.title+'</h2><p>'+A.text+'</p><button class="btn" id="restart">'+A.cta+'</button></div>');
    $('#restart',d).addEventListener('click',e=>{ audio.blip(); restartWipe(e.currentTarget); });
    let t=0,hp=0; rt.curTick=dt=>{ t+=dt; hp+=dt; if(hp>3){ hp=0; (Math.random()<.5?S.fin.dog:S.fin.cat).userData.hop=1; } };
  }}
};

/* Primeros planos de las misiones del Durante (regresan al hub) */
['hide','still','cat'].forEach(k=>{
  STEPS['close_'+k]={stage:2,w:.6,prev:'hub',enter(){
    const C=CONTENT.mission[k], grp={hide:'cHide',still:'cStill',cat:'cCat'}[k]; setMode('show'); showFocus(grp);
    const pet=S[grp].dog||S[grp].cat; state.done.add(k);
    if(k==='hide'){ petState(pet,{wag:0,shiver:.9,eyes:1.35}); audio.whimper(); }
    else if(k==='still'){ petState(pet,{wag:0,shiver:.4,eyes:1.4}); audio.whimper(); }
    else{ petState(pet,{wag:.4,shiver:.3,eyes:1.4}); audio.meow(); }
    panel({title:C.title,text:C.text,actions:[{label:'Regresar',fn:()=>go('hub')}]});
  }};
});
