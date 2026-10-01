/* ======================================================================
   Estado compartido de ejecución. Las variables que cambian durante la
   experiencia y que usan varios módulos viven aquí (rt.mode, rt.cur, ...).
   ====================================================================== */
export const rt={
  scene:null,            // escena activa que se dibuja
  mode:'orbit',          // 'orbit' | 'fp' | 'tp' | 'show'
  cur:null,              // id del paso actual
  curTick:null,          // función por cuadro del paso actual
  curExit:null,          // limpieza al salir del paso
  interact:null,         // punto interactivo activo {x,z,r,label,fn}
  stepData:{},           // datos temporales del paso (observadores, etc.)
  tipState:null,         // tarjeta junto al objeto
  bgOverride:null,       // fondo forzado ('dawn' en el final)
  showRot:0,             // giro de la vitrina
  time:0,                // reloj global en segundos
  coverHeld:false,       // botón Cubrirme presionado
  lastBanner:'#',       // último aviso mostrado (evita repintar)
  onQuakePhase:function(){} // se asigna en la interfaz
};
