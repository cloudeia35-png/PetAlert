/* ======================================================================
   Sismo: fases de sacudida fuerte y temblor continuo, alarma y estado de cubrirse.
   ====================================================================== */
import { rt } from '../core/runtime.js';
import { audio } from '../core/audio.js';
import { $, damp, rnd } from '../core/utils.js';
import { DEB, dropBooks } from './effects.js';
import { player } from './player.js';

export const MISSION_TIME=20, FREEZE_WHILE_COVERING=true;

/* segundos por mascota; el reloj se detiene mientras te cubres en una sacudida fuerte */
export const Q={active:false,phase:'off',t:0,dur:0,k:0,target:0,safe:0,waves:0};

export function quakeStart(){ Q.active=true; Q.waves=0; startStrong(7); audio.alarmSet(.1); }

export function quakeStop(){ Q.active=false; Q.phase='off'; Q.target=0; audio.rumble(0); audio.duck(1); audio.alarmSet(0); DEB.forEach(d=>{ d.st=0; d.m.visible=false; }); rt.onQuakePhase(); }

function startStrong(dur){ Q.phase='strong'; Q.t=0; Q.dur=dur; Q.target=1; Q.safe=0; Q.waves++; audio.rumble(.9); audio.duck(.2); audio.crash(); dropBooks(Q.waves===1?99:2); rt.onQuakePhase(); }

function startCalm(){ Q.phase='calm'; Q.t=0; Q.dur=8+rnd(0,4); Q.target=.5; audio.rumble(.3); audio.duck(.55); rt.onQuakePhase(); }

/* 'calm' = temblor que sigue, sin la sacudida más fuerte */
export function updateQuake(dt){
  const paused=rt.mode==='show';
  if(Q.active&&!paused){
    Q.t+=dt;
    if(Q.phase==='strong'){ if(player.covering)Q.safe+=dt; if(Math.random()<dt*.6)audio.creak(); if(Q.t>Q.dur)startCalm(); }
    else if(Q.phase==='calm'&&Q.t>Q.dur)startStrong(3.5);
  }
  const tgt=(Q.active&&!paused)?Q.target:0;
  Q.k=damp(Q.k,tgt,3,dt); if(Q.k<.002)Q.k=0;
  if(paused&&Q.active)audio.rumble(0);
  else if(Q.active&&Q.phase==='strong')audio.rumble(.9);
  else if(Q.active&&Q.phase==='calm')audio.rumble(.3);
  const al=(Q.active&&!paused)?(Q.phase==='strong'?.1:.04):0; if(al!==updateQuake.al){ updateQuake.al=al; audio.alarmSet(al); }
  const tg=$('#alarmTag'); if(tg)tg.hidden=!(Q.active&&!paused&&rt.mode!=='orbit'||Q.active&&rt.mode==='orbit'&&rt.cur==='hub');
}

export function isStrong(){ return Q.active&&Q.phase==='strong'; }
