/* ======================================================================
   Audio: efectos y música generativa sintetizados con WebAudio (sin archivos de sonido).
   ====================================================================== */


export const audio={
  ctx:null,on:true,master:null,rumbleG:null,noiseBuf:null,
  init(){
    if(this.ctx){ if(this.ctx.state==='suspended')this.ctx.resume(); return; }
    try{
      const AC=window.AudioContext||window.webkitAudioContext; if(!AC)return;
      const c=this.ctx=new AC();
      this.master=c.createGain(); this.master.gain.value=this.on?1:0; this.master.connect(c.destination);
      const len=c.sampleRate*2, buf=c.createBuffer(1,len,c.sampleRate), d=buf.getChannelData(0); let last=0;
      for(let i=0;i<len;i++){ last=(last+.02*(Math.random()*2-1))/1.02; d[i]=last*3.5; }
      this.noiseBuf=buf;
      const src=c.createBufferSource(); src.buffer=buf; src.loop=true;
      const lp=c.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=150;
      this.rumbleG=c.createGain(); this.rumbleG.gain.value=0;
      const mod=c.createGain(); mod.gain.value=.75;
      const lfo=c.createOscillator(); lfo.frequency.value=6.5; const lg=c.createGain(); lg.gain.value=.25; lfo.connect(lg); lg.connect(mod.gain); lfo.start();
      src.connect(lp); lp.connect(this.rumbleG); this.rumbleG.connect(mod); mod.connect(this.master); src.start();
      this.musicInit();
    }catch(e){ this.ctx=null; }
  },

  /* ---- Música generativa (sintetizada, sin archivos) ---- */
  musicOn:true,duckV:1,mood:'calm',mTimer:null,mNext:0,mStep:0,mBar:0,mBus:null,mIn:null,mLast:3,
  MOODS:{
    calm:{bpm:78,vol:1,pad:'sine',p:.55,pulse:0,scale:[72,74,76,79,81,84,86],
      ch:[[48,[60,64,67,71]],[45,[57,60,64,67]],[41,[57,60,65,69]],[43,[59,62,67,69]]]},
    tense:{bpm:120,vol:.9,pad:'sawtooth',p:.2,pulse:2,riser:1,scale:[81,82,84,87,88],
      ch:[[33,[57,60,63,66]],[34,[58,61,64,67]],[32,[56,59,62,65]],[40,[56,59,62,65]]]},
    hope:{bpm:56,vol:.85,pad:'sine',p:.24,pulse:0,scale:[66,69,71,74,76,78],
      ch:[[38,[62,66,69,73]],[35,[59,62,66,69]],[43,[55,59,62,66]],[45,[57,61,64,69]]]},
    close:{bpm:64,vol:.9,pad:'sine',p:.4,pulse:0,scale:[72,74,76,79,81,84],
      ch:[[48,[60,64,67,71]],[41,[57,60,65,69]],[45,[57,60,64,67]],[43,[59,62,67,69]]]}
  },
  mtof(m){ return 440*Math.pow(2,(m-69)/12); },
  musicInit(){
    const c=this.ctx; this.mIn=c.createGain(); this.mBus=c.createGain();
    this.mBus.gain.value=this.musicOn?.5*this.duckV:0; this.mBus.connect(this.master);
    const len=Math.floor(c.sampleRate*2), ir=c.createBuffer(2,len,c.sampleRate);
    for(let ch=0;ch<2;ch++){ const d=ir.getChannelData(ch); for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6); }
    const cv=c.createConvolver(); cv.buffer=ir; const wet=c.createGain(); wet.gain.value=.55;
    this.mIn.connect(this.mBus); this.mIn.connect(cv); cv.connect(wet); wet.connect(this.mBus);
    this.mNext=c.currentTime+.15; this.mStep=0; this.mBar=0;
    clearInterval(this.mTimer); this.mTimer=setInterval(()=>this.musicTick(),90);
  },
  setMood(m){ if(this.MOODS[m]&&m!==this.mood){ this.mood=m; this.mBar=0; this.mStep=0; if(this.ctx)this.mNext=Math.max(this.mNext,this.ctx.currentTime+.1); } },
  duck(v){ this.duckV=v; if(this.mBus)this.mBus.gain.setTargetAtTime(this.musicOn?.5*v:0,this.ctx.currentTime,.4); },
  toggleMusic(){ this.musicOn=!this.musicOn; if(this.mBus)this.mBus.gain.setTargetAtTime(this.musicOn?.5*this.duckV:0,this.ctx.currentTime,.15); return this.musicOn; },
  musicTick(){
    const c=this.ctx; if(!c||c.state!=='running')return;
    if(this.mNext<c.currentTime-.5)this.mNext=c.currentTime+.05;
    while(this.mNext<c.currentTime+.5){ this.musicStep(this.mNext); const M=this.MOODS[this.mood]; this.mNext+=60/M.bpm/2; this.mStep=(this.mStep+1)%8; if(this.mStep===0)this.mBar++; }
  },
  musicStep(t){
    const M=this.MOODS[this.mood], eighth=60/M.bpm/2, barDur=eighth*8, s=this.mStep, ch=M.ch[this.mBar%M.ch.length];
    if(s===0){
      this.mNote(ch[0]+0,t,barDur*.95,'sine',.16*M.vol,.05,barDur*.4);
      ch[1].forEach((n,i)=>{ [-5,5].forEach(dt=>this.mNote(n,t+i*.03,barDur*1.15,M.pad,.045*M.vol,barDur*.35,barDur*.5,dt)); });
    }
    if(M.pulse===2){ const f=this.mtof(ch[0]); if(s%4===0)this.mThump(f,t,.42*M.vol); else if(s%4===1)this.mThump(f,t+eighth*.35,.26*M.vol);
      if(s===0){ this.mNote(ch[0]+12,t,barDur*.95,'sawtooth',.03*M.vol,barDur*.5,barDur*.3); if(this.mBar%4===3)this.mRiser(t,barDur); } }
    else if(M.pulse&&s%2===0){ const f=this.mtof(ch[0]); this.mThump(f,t,.32*M.vol); }
    if(Math.random()<M.p){
      let i=this.mLast+Math.floor(Math.random()*3)-1; i=Math.max(0,Math.min(M.scale.length-1,i)); this.mLast=i;
      const n=M.scale[i]; this.mNote(n,t,eighth*5,'triangle',.07*M.vol,.008,eighth*4.5);
      this.mNote(n+12,t,eighth*2.5,'sine',.02*M.vol,.005,eighth*2);
    }
  },
  mNote(m,t,dur,type,vol,att,rel,detune){
    const c=this.ctx,o=c.createOscillator(),g=c.createGain(); o.type=type; o.frequency.value=this.mtof(m); if(detune)o.detune.value=detune;
    g.gain.setValueAtTime(.0001,t); g.gain.linearRampToValueAtTime(vol,t+Math.max(.005,att));
    g.gain.setTargetAtTime(.0001,t+Math.max(att+.01,dur-rel),Math.max(.05,rel*.35));
    if(type==='sawtooth'){ const lp=c.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=650; o.connect(lp); lp.connect(g); } else o.connect(g);
    g.connect(this.mIn); o.start(t); o.stop(t+dur+rel*.6+.2);
  },
  mRiser(t,dur){
    const c=this.ctx,s=c.createBufferSource(); s.buffer=this.noiseBuf; const f=c.createBiquadFilter(); f.type='bandpass'; f.Q.value=2.5;
    f.frequency.setValueAtTime(350,t); f.frequency.exponentialRampToValueAtTime(4200,t+dur); const g=c.createGain();
    g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.09,t+dur*.95); g.gain.exponentialRampToValueAtTime(.0001,t+dur+.05);
    s.connect(f); f.connect(g); g.connect(this.mIn); s.start(t,Math.random()); s.stop(t+dur+.1);
  },
  swell(){ /* impacto del final: ascenso de ruido y gran acorde luminoso */
    if(!this.ctx||!this.mIn)return; const c=this.ctx,t=c.currentTime+.05; this.mRiser(t,1.8);
    [48,55,60,64,67,72,76].forEach((n,i)=>this.mNote(n,t+1.8+i*.04,5,'triangle',.07,.05,3.6));
    this.tone(60,30,1.4,'sine',.3,1.8);
  },
  whoosh(){ /* transición de reinicio */
    if(!this.ctx)return; const c=this.ctx,t=c.currentTime,s=c.createBufferSource(); s.buffer=this.noiseBuf; const f=c.createBiquadFilter(); f.type='bandpass'; f.Q.value=1.4;
    f.frequency.setValueAtTime(250,t); f.frequency.exponentialRampToValueAtTime(5000,t+1.2); const g=c.createGain(); g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.32,t+1); g.gain.exponentialRampToValueAtTime(.0001,t+1.7);
    s.connect(f); f.connect(g); g.connect(this.master); s.start(t,Math.random()); s.stop(t+1.8);
    this.tone(220,880,1.2,'sine',.09); [523,659,784,1047].forEach((n,i)=>this.tone(n,n*1.005,.9,'triangle',.06,1.3+i*.07));
  },
  mThump(f,t,vol){
    const c=this.ctx,o=c.createOscillator(),g=c.createGain(); o.type='sine'; o.frequency.setValueAtTime(f*2,t); o.frequency.exponentialRampToValueAtTime(f,t+.12);
    g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+.02); g.gain.exponentialRampToValueAtTime(.0001,t+.5);
    o.connect(g); g.connect(this.mIn); o.start(t); o.stop(t+.6);
  },
  rumble(v){ if(this.ctx)this.rumbleG.gain.setTargetAtTime(v,this.ctx.currentTime,.25); },
  tone(f0,f1,dur,type,vol,delay){
    if(!this.ctx)return; const c=this.ctx,t=c.currentTime+(delay||0),o=c.createOscillator(),g=c.createGain();
    o.type=type||'sine'; o.frequency.setValueAtTime(f0,t); o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);
    g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(vol||.1,t+.02); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t+dur+.05);
  },
  noise(dur,freq,vol){
    if(!this.ctx)return; const c=this.ctx,t=c.currentTime,s=c.createBufferSource(); s.buffer=this.noiseBuf;
    const f=c.createBiquadFilter(); f.type='bandpass'; f.frequency.value=freq; const g=c.createGain();
    g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    s.connect(f); f.connect(g); g.connect(this.master); s.start(t,Math.random()); s.stop(t+dur+.05);
  },
  blip(){ this.tone(620,860,.09,'sine',.07); },
  ding(){ this.tone(880,1320,.25,'triangle',.09); },
  ok(){ [523,659,784].forEach((f,i)=>this.tone(f,f*1.01,.3,'triangle',.09,i*.09)); },
  no(){ this.tone(230,160,.25,'sawtooth',.05); },
  crash(){ this.noise(.4,700,.3); this.tone(90,40,.4,'sine',.25); },
  creak(){ this.tone(180,120,.5,'sawtooth',.03); },
  alarmSet(v){ /* sirena de alerta sísmica: dos tonos alternados */
    if(!this.ctx)return; const c=this.ctx;
    if(!this.alG){ const o=c.createOscillator(); o.type='square'; o.frequency.value=980; const lf=c.createOscillator(); lf.type='square'; lf.frequency.value=2.2; const lg=c.createGain(); lg.gain.value=190; lf.connect(lg); lg.connect(o.frequency);
      const lp=c.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=2400; this.alG=c.createGain(); this.alG.gain.value=0; o.connect(lp); lp.connect(this.alG); this.alG.connect(this.master); o.start(); lf.start(); }
    this.alG.gain.setTargetAtTime(v,c.currentTime,.08);
  },
  thud(){ this.noise(.14,420,.09); this.tone(130,60,.16,'sine',.1); },
  whimper(){ this.tone(700,420,.4,'sine',.09); this.tone(650,380,.45,'sine',.08,.5); },
  meow(){ this.tone(500,900,.25,'triangle',.09); this.tone(900,550,.35,'triangle',.09,.22); },
  bark(){ this.tone(320,180,.12,'sawtooth',.07); this.tone(320,180,.12,'sawtooth',.07,.18); },
  toggle(){ this.on=!this.on; if(this.master)this.master.gain.setTargetAtTime(this.on?1:0,this.ctx.currentTime,.05); return this.on; }
};
