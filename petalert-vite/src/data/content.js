/* ======================================================================
   CONTENIDO: todos los textos de la experiencia. Edita aquí títulos, descripciones, preguntas y mensajes.
   ====================================================================== */


export const CONTENT={
  pets:{title:'Ellos te acompañarán',text:'Estas son las dos mascotas que te acompañarán: Cacao, un perro juguetón, y Nube, una gata curiosa. Toca sus nombres para saludarlos.'},
  intro:{text:'Un sismo puede ocurrir en cualquier momento y saber qué hacer antes, durante y después puede marcar la diferencia. En este simulacro interactivo podrás poner a prueba tus decisiones y aprender cómo actuar de manera segura ante una emergencia.'},
  walk:{
    a:{t:'Camina por la casa',s:'Explora el espacio con calma.'},
    b:{t:'Acércate al kit de emergencia',s:'Sigue la marca coral.'},
    open:'Abrir el kit',
    greet:{t:'¡Bienvenido a casa!',s:'Cacao y Nube vienen a saludarte.'},
    hall:{t:'Entra a la casa',s:'Sigue a Cacao y a Nube.'}
  },
  kit:{title:'El kit de emergencia',text:'Conoce los elementos básicos para tus mascotas. Toca cada punto para descubrir para qué sirve.',
    items:[
      {icon:'drop',title:'Agua potable',text:'Reserva agua para al menos 3 días. Calcula unos 50 ml por kilo de peso al día, y más si hace calor.'},
      {icon:'kit',title:'Alimento y platos',text:'Comida para 3 a 5 días en un envase hermético y con fecha de vencimiento. Renuévala cada seis meses.'},
      {icon:'cross',title:'Botiquín veterinario',text:'Gasas, vendas, suero fisiológico, antiséptico, guantes y el teléfono de tu veterinario. Suma sus medicinas habituales si las usa.'},
      {icon:'paw',title:'Correa y arnés',text:'Un arnés bien ajustado sujeta mejor que un collar cuando hay pánico. Añade una correa resistente.'},
      {icon:'doc',title:'Documentos y foto',text:'Copia del carné de vacunas, historial médico y una foto reciente donde salgas con tu mascota.'},
      {icon:'heart',title:'Manta y juguete',text:'Una manta con su olor y su juguete favorito la calman en un lugar desconocido.'}
    ]},
  petwalk:{t:'Acércate a tu mascota',s:'Cacao descansa en el sofá.',open:'Saludar a Cacao'},
  track:{title:'Que siempre puedan encontrarla',text:'Conoce cómo funciona el rastreo de tus mascotas. Toca cada elemento del collar.',
    items:[
      {icon:'phone',title:'Placa de identificación',text:'Lleva su nombre y dos teléfonos de contacto. Es lo primero que verá quien la encuentre.'},
      {icon:'pin',title:'Rastreador GPS o Bluetooth',text:'Muestra su ubicación en tu celular. Revisa la batería cada semana y comprueba que haya cobertura en tu zona.'},
      {icon:'shield',title:'Microchip',text:'Es del tamaño de un grano de arroz y va bajo la piel. No tiene GPS: un veterinario lo lee y te identifica como dueño, así que mantén tus datos al día.'}
    ]},
  antesEnd:{text:'Durante el Antes conocimos cómo prepararnos para un sismo: desde organizar nuestro kit de emergencia hasta conocer herramientas de rastreo y ubicación que pueden ser útiles en una situación de riesgo.',cta:'Siguiente momento'},
  quakeIntro:{text:'El movimiento comienza y todo cambia en cuestión de segundos. Mantén la calma, protege tu cuerpo y presta atención a lo que ocurre a tu alrededor.',cta:'Continuar simulacro'},
  banner:{
    strong:{t:'¡Sismo! Agáchate, cúbrete y sujétate',s:'Mantén presionado “Cubrirme” (barra espaciadora).'},
    cover:{t:'Muy bien. Sujétate y espera',s:'Sigue cubierto hasta que el movimiento pare.'},
    good:{t:'Te cubriste a tiempo',s:'El temblor sigue: avanza con cuidado hacia tu mascota.'},
    late:{t:'El temblor continúa',s:'Cúbrete de inmediato cuando se intensifique: agáchate, cúbrete y sujétate.'}
  },
  hub:{title:'Tienes tres experiencias por descubrir',sub:'Cubre tu cuerpo primero. El temblor no se detiene: ve por cada mascota entre una sacudida y otra. Tendrás 20 segundos.',
    cards:[
      {k:'hide',pet:'dog',t:'Un perro que se esconde',d:'Encuentra a Cacao y descubre por qué busca refugio.'},
      {k:'still',pet:'dog',t:'Un perro que se queda quieto',d:'Acércate a Cacao y observa su reacción.'},
      {k:'cat',pet:'cat',t:'Una gata que intenta escapar',d:'Persigue a Nube con calma y aprende a acercarte.'}
    ],cta:'Explorar',done:'Vista',next:'Continuar'},
  mission:{
    fail:{t:'No pudiste salir a tiempo',s:'El sismo continúa y se acabó el tiempo. Mantén la calma, cúbrete cuando se intensifique y vuelve a intentarlo desde el inicio.',cta:'Intentar de nuevo'},
    hide:{obj:{t:'Busca a tu mascota',s:'Cacao no está en su lugar de siempre. Mira debajo de los muebles.'},open:'Mirar debajo de la mesa',
      title:'Cacao se esconde',text:'Muchos perros buscan un rincón oscuro y cerrado cuando sienten el temblor: es su forma de sentirse a salvo. No lo saques a la fuerza ni te expongas a objetos que caen. Cuando pare el movimiento, háblale con voz suave y acércate despacio.'},
    still:{obj:{t:'Acércate a tu mascota',s:'Cacao está en el sofá.'},open:'Acercarme a Cacao',
      title:'Cacao se queda quieto',text:'Algunos animales se paralizan por el miedo: no responden, tiemblan o jadean. No es desobediencia. Quédate a su lado, háblale con calma y espera a que termine el movimiento antes de moverlo.'},
    cat:{obj:{t:'Busca a tu mascota',s:'Nube puede estar en cualquiera de los tres lugares marcados.'},open:'Calmar a Nube',
      title:'Nube intenta escapar',text:'Los gatos suelen correr hacia las salidas o esconderse en sitios altos y estrechos. No la persigas: mantén puertas y ventanas cerradas y, cuando pase el temblor, usa una toalla y la transportadora para protegerla.'}
  },
  sizeIntro:{text:'No todas las mascotas pueden ser evacuadas de la misma manera. Su tamaño y características influyen en cómo debemos sujetarlas, transportarlas y mantenerlas seguras durante un sismo.'},
  sizePick:{title:'Escoge el tamaño de tu mascota'},
  sizes:{
    large:{name:'Perro grande',text:'Más de 25 kg. Su fuerza y su peso cambian la forma de moverlo.',items:[
      {a:'neck',t:'Arnés y correa corta',d:'Un arnés de pecho resistente es la forma más segura de guiarlo si se asusta.'},
      {a:'back',t:'No lo cargues solo',d:'Pide ayuda a otra persona o usa una manta firme como camilla si está herido.'},
      {a:'paws',t:'Cuida sus patas',d:'Tras un sismo puede haber vidrios y escombros. Revisa sus almohadillas.'},
      {a:'rear',t:'Planea el traslado',d:'No cabe en cualquier transportadora. Ten definido en qué lo llevarás y a dónde.'}]},
    medium:{name:'Perro mediano',text:'Entre 10 y 25 kg. Se puede cargar por trayectos cortos.',items:[
      {a:'neck',t:'Arnés con manija',d:'Te deja una mano libre y un agarre firme para guiarlo.'},
      {a:'back',t:'Cárgalo con apoyo',d:'Sostén pecho y patas traseras al mismo tiempo. Nunca lo jales de las patas.'},
      {a:'rear',t:'Transportadora grande',d:'Una plegable, con una manta con su olor, lo hace sentir seguro.'},
      {a:'paws',t:'Practica la salida',d:'Ensaya salir con correa y transportadora para que no le sea extraño.'}]},
    cat:{name:'Gato',text:'Pequeño, ágil y muy asustadizo bajo estrés.',items:[
      {a:'neck',t:'Arnés ajustable',d:'Un gato asustado se escapa de collares flojos. Suma una placa con tu teléfono.'},
      {a:'back',t:'Toalla o manta',d:'Sirve para sujetarlo con suavidad y para cubrir la transportadora y calmarlo.'},
      {a:'paws',t:'No lo saques a la fuerza',d:'Suelen esconderse en lugares estrechos. Espera a que pare el movimiento y háblale bajito.'},
      {a:'rear',t:'Transportadora rígida',d:'Con cierre seguro y ventilación. Déjala abierta en casa para que la conozca.'}]}
  },
  despIntro:{text:'Una vez termina el sismo, conoceremos nociones básicas de primeros auxilios y algunas recomendaciones para responder ante evacuaciones.'},
  guide:{
    note:'Son nociones básicas: no reemplazan a un veterinario. Llama a uno en cuanto puedas.',
    hint:'Recorre las tres secciones: perros, gatos y evacuación. Desliza cada una hasta el final.',done:'Listo. Continúa cuando quieras.',
    tabs:[
      {id:'dog',label:'Perros',title:'Primeros auxilios para perros',intro:'Antes de tocarlo, mira que no haya vidrios, cables ni escombros. Un perro asustado o con dolor puede morder, incluso a quien más quiere.',
        steps:[
          {ill:'dogMuzzle',t:'Protégete con un bozal de emergencia',d:'Con una tira de tela o una venda, da una vuelta al hocico, cruza por debajo y amarra detrás de las orejas. No lo uses si vomita, tose o le cuesta respirar.'},
          {ill:'dogCheck',t:'Revisa su respiración',d:'Apoya la mano en un costado del pecho, detrás del codo. En reposo respira entre 10 y 30 veces por minuto. Si jadea con esfuerzo, tiene las encías pálidas o azuladas, es una urgencia.'},
          {ill:'dogBleed',t:'Controla el sangrado',d:'Presiona con una gasa o tela limpia directamente sobre la herida, sin levantarla para mirar. Si se empapa, pon otra encima. Después venda sin apretar de más y ve al veterinario.'},
          {ill:'dogCPR',t:'Si no respira ni tiene pulso: compresiones',d:'Acuéstalo sobre su costado. Apoya las manos, una sobre otra, en la parte más ancha del pecho y comprime de 100 a 120 veces por minuto. Pide a alguien que llame al veterinario mientras tanto.'},
          {ill:'dogStretcher',t:'Trasládalo sobre una manta',d:'Si tiene una posible fractura o no puede caminar, deslízalo sobre una manta o tabla y levántenlo entre dos personas, con el cuerpo recto y la cabeza a la altura del cuerpo.'}]},
      {id:'cat',label:'Gatos',title:'Primeros auxilios para gatos',intro:'Un gato herido se esconde y ataca por miedo. Muévete despacio, háblale bajito y evita agarrarlo por el cuello.',
        steps:[
          {ill:'catTowel',t:'Envuélvela en una toalla',d:'Cubre su cuerpo con una toalla, dejando la cabeza libre, y sujeta con suavidad. Esto la calma, protege tus manos y te deja revisarla.'},
          {ill:'catBreath',t:'Cuenta su respiración',d:'Observa su pecho durante 30 segundos y multiplica por dos. En reposo suele estar entre 20 y 30 por minuto. Respirar con la boca abierta en un gato es una urgencia.'},
          {ill:'catBleed',t:'Controla el sangrado',d:'Presiona con una gasa limpia sobre la herida de la pata o la almohadilla, sin quitarla. Mantén la presión y busca atención veterinaria. No uses torniquetes.'},
          {ill:'catCPR',t:'Si no respira ni tiene pulso: una mano',d:'Rodea su pecho con una mano, el pulgar de un lado y los dedos del otro, y comprime de 100 a 120 veces por minuto mientras alguien llama al veterinario.'},
          {ill:'catCarrier',t:'Llévala en su transportadora',d:'Cúbrela con una toalla para reducir el estrés y mantenla nivelada al cargarla. Nunca la lleves suelta en brazos si estás afuera.'}]},
      {id:'evac',label:'Evacuación',title:'Recomendaciones para evacuar',intro:'Evacuar con tus mascotas se practica antes. Si el edificio está dañado o hay riesgo de réplicas, salir con calma y con el equipo listo marca la diferencia.',
        ill:'evac',items:[
          {i:'eye',t:'Espera a que pare y revisa la ruta',d:'Comprueba si hay olor a gas, cables sueltos, vidrios y grietas nuevas. Cierra la llave del gas si puedes hacerlo con seguridad.'},
          {i:'door',t:'Evacúa con ellos, nunca los dejes atrás',d:'No pienses que volverán solos o que se las arreglarán. Un animal abandonado puede lesionarse, huir o quedar atrapado.'},
          {i:'paw',t:'Cada uno con su equipo',d:'Perros con arnés y correa corta; gatos en transportadora rígida cubierta con una toalla. Aunque sea muy obediente, un animal asustado puede escapar.'},
          {i:'kit',t:'Lleva tu kit y un plan para cargar',d:'Agua, comida, documentos, medicinas y su manta. Lo ideal es una persona por mascota para que siempre tengas una mano libre.'},
          {i:'door',t:'Por las escaleras, nunca en ascensor',d:'Aléjate de fachadas, ventanales, postes y cables. Ve despacio: un animal nervioso puede tirar de la correa o saltar de tus brazos.'},
          {i:'pin',t:'Punto de encuentro y refugio',d:'Define con anticipación un lugar seguro y adónde ir después. No todos los refugios aceptan mascotas: identifica familiares, hoteles o albergues que sí.'},
          {i:'phone',t:'Si se pierde',d:'Busca cerca, avisa a vecinos y refugios, comparte su foto reciente y revisa su rastreador. Mantén actualizados la placa y el microchip.'}]}
    ]},
  quiz:{q:'Acaba de pasar un sismo fuerte y estás en casa con Cacao, tu perro mediano, y con Nube, tu gata, que sigue escondida y bufando. Hay grietas nuevas en una pared, vidrios rotos en el piso y avisan de posibles réplicas. Debes salir del edificio ahora. ¿Cuál es la mejor forma de evacuar con tus dos mascotas?',hint:'Toca una tarjeta para darle la vuelta y ver la respuesta.',
    opts:[
      {text:'Reviso la ruta y cierro el gas. Le pongo a Cacao el arnés con la correa corta, cubro a Nube con una toalla para llevarla en su transportadora, tomo el kit y bajo por las escaleras hasta el punto de encuentro.',ok:true,fb:'Verificas la ruta, controlas a cada mascota con el equipo adecuado, llevas tu kit y usas las escaleras, nunca el ascensor. Ir al punto de encuentro ya definido evita que se separen o se pierdan.'},
      {text:'Salgo corriendo con Nube en brazos y le abro la puerta a Cacao para que me siga solo: los perros son rápidos y me alcanzan en la calle.',ok:false,fb:'Un animal asustado puede huir del ruido, cruzar la calle o perderse entre la gente. Sin arnés ni correa, y con la gata suelta en brazos, aumenta el riesgo de arañazos, caídas y de perderlos.'},
      {text:'Les dejo agua y comida abierta y salgo primero a revisar la calle: regreso por ellos cuando todo esté tranquilo.',ok:false,fb:'Dejarlos atrás es un riesgo enorme: pueden herirse con una réplica o quedar atrapados, y quizás no puedas volver. Evacuar con tus mascotas es parte del plan.'}
    ],good:'Correcto',bad:'Esta no es la mejor opción',cta:'Continuar',wait:'Sigue probando hasta encontrar la respuesta correcta.'},
  close:{words:['Conocer','Actuar','Cuidar'],kicker:'Simulacro completado',text:'Estar preparados puede marcar la diferencia. Conocer, actuar y cuidar también es una forma de proteger.',
    chips:['Kit de emergencia','Identificación y rastreo','Cubrirte durante el sismo','Primeros auxilios','Evacuar con ellos'],cta:'Finalizar'},
  about:{title:'Conoce un poco sobre nosotros',text:'PetAlert es una experiencia interactiva para enseñar a quienes viven con perros y gatos cómo actuar antes, durante y después de un sismo. Está pensada para practicar con calma, antes de que ocurra una emergencia.',cta:'Reiniciar experiencia'}
};
