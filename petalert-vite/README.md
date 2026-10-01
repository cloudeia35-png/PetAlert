# PetAlert

Experiencia 3D interactiva para aprender cómo actuar con perros y gatos **antes, durante y después de un sismo**.
Hecha con [three.js](https://threejs.org/) y [Vite](https://vitejs.dev/), en JavaScript puro (sin frameworks).

## Cómo ejecutarla

Necesitas [Node.js](https://nodejs.org/) 18 o superior.

```bash
npm install        # instala three.js y Vite
npm run dev        # servidor de desarrollo (http://localhost:5173)
npm run build      # genera la versión final en /dist
npm run preview    # prueba la versión final localmente
```

La carpeta `dist/` se puede publicar tal cual (Netlify, GitHub Pages, Vercel…): `base: './'` permite usarla en cualquier ruta.
Se usa **three.js r128** (versión fijada en `package.json`) porque la escena fue ajustada a su iluminación; si actualizas three.js, revisa luces y materiales.

## Estructura

```
petalert/
├─ index.html              Estructura de la página (HUD, paneles, cargador)
├─ package.json            Dependencias y scripts
├─ vite.config.js          Configuración de Vite
└─ src/
   ├─ main.js              Punto de entrada: arranque y bucle principal
   ├─ input.js             Teclado, joystick táctil, arrastre y botones de sonido/música
   ├─ core/
   │  ├─ utils.js          Utilidades ($, clamp, lerp, damp, rnd…)
   │  ├─ runtime.js        Estado compartido (rt.mode, rt.cur, rt.time…)
   │  └─ audio.js          Efectos, música generativa y alarma (WebAudio, sin archivos)
   ├─ data/
   │  └─ content.js        ★ TODOS LOS TEXTOS (títulos, guías, pregunta final, cierre)
   ├─ three/
   │  ├─ engine.js         Renderizador, escenas, cámara y luces
   │  ├─ models.js         Perro, gata, avatar, mochila y objetos del kit
   │  ├─ house.js          Sala, muebles, puerta y pasillo de entrada
   │  ├─ actors.js         Cacao, Nube y avatar: colocación y caminata
   │  └─ showcase.js       Vitrinas: kit, rastreo, tamaños, primeros planos, final
   ├─ game/
   │  ├─ player.js         Movimiento y colisiones
   │  ├─ camera.js         Modos de vista, enfoques y acercamientos
   │  ├─ quake.js          Fases del sismo, alarma y tiempo por misión
   │  ├─ effects.js        Libros y escombros que caen, luces, polvo
   │  ├─ catAI.js          Comportamiento de la gata en su misión
   │  ├─ interact.js       Interacción con la tecla E
   │  └─ animate.js        Animación de mascotas por cuadro
   ├─ ui/
   │  ├─ hud.js            Sismógrafo, paneles, puntos interactivos, avisos, temporizador
   │  ├─ widgets.js        Pasos reutilizables (descubrir elementos, texto)
   │  └─ illustrations.js  Ilustraciones SVG de primeros auxilios y evacuación
   ├─ steps/
   │  ├─ steps.js          Recorrido: Inicio → Antes → Durante → Después → Cierre
   │  └─ flow.js           go(), fundidos y transición de reinicio
   └─ styles/              CSS dividido por secciones (se carga desde main.css)
```

## Qué editar

| Quiero cambiar…                          | Archivo / valor                                             |
|------------------------------------------|-------------------------------------------------------------|
| Textos, preguntas y recomendaciones      | `src/data/content.js`                                       |
| Tiempo para encontrar cada mascota       | `MISSION_TIME` en `src/game/quake.js` (20 s)                |
| Que el reloj corra al cubrirse           | `FREEZE_WHILE_COVERING` en `src/game/quake.js`              |
| Intensidad de la luz de la casa          | `hemi`, `sun`, `lampLight` en `src/three/engine.js` y `updateWorldFX` en `src/game/effects.js` |
| Música por etapa (acordes, tempo)        | `MOODS` en `src/core/audio.js`                              |
| Colores y tipografías                    | `src/styles/tokens.css`                                     |
| Ilustraciones de primeros auxilios       | `src/ui/illustrations.js`                                   |
| Orden y lógica de los pasos              | `src/steps/steps.js`                                        |

## Controles

`W A S D` / flechas para moverte · arrastrar para mirar · `E` para interactuar · `Espacio` (o el botón *Cubrirme*) para cubrirte durante las sacudidas fuertes. En celulares hay joystick táctil.

## Notas

- El estado que cambia mientras se juega y que usan varios módulos vive en `src/core/runtime.js` (`rt`), por ejemplo `rt.mode` (vista actual) o `rt.cur` (paso actual).
- El sonido empieza después del primer clic (restricción de los navegadores).
- Las fuentes se cargan desde Google Fonts; sin conexión se usa una tipografía del sistema.
- Las cifras de primeros auxilios son nociones básicas y deben revisarse con un veterinario antes de publicar.

## Publicar en GitHub Pages

1. Crea un repositorio y sube **esta carpeta** (sin `node_modules` ni `dist`; el `.gitignore` ya los excluye).
2. En el repositorio: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Cada `git push` a la rama `main` ejecuta `.github/workflows/deploy.yml`, que instala, compila y publica la página en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

Alternativa sin Actions: ejecuta `npm run build` y sube el contenido de `dist/` a la rama `gh-pages` (o a la carpeta `/docs`).
