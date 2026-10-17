export default {
  common: {
    nav: {
      howItWorks: 'Cómo funciona',
      tryFree: 'Probar gratis',
      homeLabel: 'Inicio de ChapterGen',
      mainLabel: 'Navegación principal',
      mobileLabel: 'Navegación móvil',
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
      product: 'Producto',
      tryFreeShort: 'Probar',
      tryFreeMobile: 'Generar capítulos gratis',
      promo: '2 videos gratis, sin registro',
      promoCta: 'Probar ahora →',
      productMenu: {
        youtube: {
          title: 'Generador de capítulos de YouTube',
          description: 'Marcas de tiempo desde cualquier video, antes de publicar.',
        },
        podcast: {
          title: 'Generador de capítulos de podcast',
          description: 'Capítulos desde el audio para YouTube, Spotify y notas del episodio.',
        },
        how: {
          title: 'Cómo funciona',
          description: 'Subes, transcribimos, copias. Tres pasos.',
        },
        about: {
          title: 'Acerca de ChapterGen',
          description: 'Por qué lo creamos y cómo tratamos tus archivos.',
        },
      },
      useCases: 'Casos de uso',
      faq: 'Preguntas',
      podcast: 'Podcasts',
      pricing: 'Precios',
      login: 'Entrar',
      dashboard: 'Dashboard',
      myChapters: 'Mis Capítulos',
      buyCredits: 'Comprar Créditos',
      settings: 'Ajustes',
      billing: 'Facturación',
      support: 'Soporte',
      accountMenu: 'Menú de cuenta',
      logout: 'Salir',
      credits: '{count} créditos',
    },
    footer: {
      tagline: 'Generador de capítulos de YouTube con IA para videos y podcasts. Sube el archivo y obtén marcas de tiempo en formato YouTube.',
      productHeading: 'Producto',
      youtubeChapters: 'Capítulos de YouTube',
      podcastChapters: 'Capítulos de Podcast',
      companyHeading: 'Empresa',
      about: 'Acerca de',
      privacy: 'Privacidad',
      terms: 'Términos',
      contact: 'Contacto',
      languageHeading: 'Idioma',
      rights: 'Todos los derechos reservados.',
    },
    language: {
      label: 'Idioma',
      en: 'English',
      es: 'Español',
    },
  },
  home: {
    meta: {
      title: 'Generador de Capítulos de YouTube con IA — Marcas de Tiempo desde tu Archivo',
      description:
        'Sube un video o audio y obtén capítulos de YouTube con marcas de tiempo y títulos optimizados para SEO. Sin URL pública — funciona antes de publicar. 2 videos gratis, sin registro.',
    },
    hero: {
      badge: 'Funciona con videos privados y sin publicar',
      title: 'Capítulos de YouTube con IA, listos antes de publicar',
      subtitle:
        'Sube un video o audio y obtén marcas de tiempo limpias y optimizadas para SEO, en el formato exacto de YouTube. Sin URL pública.',
      preview: {
        fileName: 'episodio-42-final.mp4',
        duration: '48:12',
        label: 'Ejemplo de resultado',
        copy: 'Copiar para YouTube',
        refine: 'Mejorar títulos',
        activeIndex: 3,
        chapters: [
          { time: '0:00', title: 'Intro: por qué importan los capítulos' },
          { time: '1:42', title: 'Preparar la grabación' },
          { time: '6:15', title: 'Editar el primer corte' },
          { time: '14:08', title: 'Corrección de color con poco presupuesto' },
          { time: '22:37', title: 'Exportar para YouTube' },
          { time: '31:50', title: 'Preguntas y cierre' },
        ],
      },
    },
    audience: {
      label: 'Hecho para contenido largo',
      items: ['Tutoriales', 'Podcasts', 'Entrevistas', 'Webinars y cursos', 'Reseñas y vlogs'],
    },
    howItWorks: {
      eyebrow: 'Cómo funciona',
      title: 'Cómo generar capítulos de YouTube con IA',
      intro:
        'No necesitas subir el video a YouTube primero. ChapterGen funciona con borradores, videos privados y archivos de audio.',
      steps: [
        {
          title: 'Sube tu archivo',
          description:
            'Arrastra un video o audio. Exportaciones sin editar, borradores, grabaciones privadas y audio de podcast funcionan igual.',
        },
        {
          title: 'La IA detecta los temas',
          description:
            'Transcribimos el audio, detectamos dónde cambia el tema y escribimos un título claro y descriptivo para cada sección.',
        },
        {
          title: 'Copia y pega',
          description:
            'Pega la lista en la descripción desde YouTube Studio. Ya está en el formato que exige YouTube, empezando en 0:00.',
        },
      ],
    },
    why: {
      eyebrow: 'Por qué ChapterGen',
      title: 'Mejor que los capítulos automáticos de YouTube',
      intro:
        'Los capítulos automáticos de YouTube suelen cortar a mitad de frase, se saltan cambios de tema y generan títulos genéricos como "Sección 1". ChapterGen sigue lo que realmente se dice, y puedes editar cada capítulo antes de que el video salga.',
      outro:
        'Consejo: desactiva los capítulos automáticos en YouTube Studio (Configuración avanzada → Permitir capítulos automáticos) para que YouTube no reemplace los tuyos.',
      colYoutube: 'YouTube automático',
      colChaptergen: 'ChapterGen',
      yes: 'Sí',
      no: 'No',
      bullets: [
        {
          title: 'Videos sin publicar',
          description: 'Tu descripción está lista desde el primer minuto.',
        },
        {
          title: 'Privados y ocultos',
          description: 'Nunca necesitas una URL pública.',
        },
        {
          title: 'Solo audio',
          description: 'Podcasts, entrevistas y grabaciones de voz.',
        },
        {
          title: 'Cualquier idioma',
          description: 'Detección automática, más de 90 idiomas.',
        },
      ],
      rows: [
        { feature: 'Títulos de capítulos', youtube: 'Genéricos', chaptergen: 'Según tu contenido' },
        { feature: 'Editar antes de publicar', youtube: 'no', chaptergen: 'yes' },
        { feature: 'Videos sin publicar', youtube: 'no', chaptergen: 'yes' },
        { feature: 'Audio y podcasts', youtube: 'no', chaptergen: 'yes' },
        { feature: 'Tus propias palabras clave', youtube: 'no', chaptergen: 'yes' },
      ],
    },
    seoBenefits: {
      eyebrow: 'Por qué capítulos',
      title: 'Una de las palancas de SEO más desaprovechadas en YouTube',
      intro: 'Los capítulos no solo son cómodos para quien mira. Ayudan a que tu video se encuentre y se vea.',
      bullets: [
        {
          title: 'Momentos clave en Google',
          description:
            'Los videos con capítulos pueden mostrar secciones clicables en los resultados de Google y ocupar más espacio en la página.',
        },
        {
          title: 'Más interacción',
          description:
            'Análisis a gran escala de videos de YouTube muestran que los videos con capítulos tienen mejores ratios de "me gusta" y comentarios.',
        },
        {
          title: 'Mejor retención',
          description:
            'Quien puede saltar a lo que necesita se queda más, vuelve a ver y regresa — señales que el algoritmo premia.',
        },
        {
          title: 'Metadatos indexables',
          description:
            'Cada título de capítulo es texto que YouTube indexa, así que los títulos descriptivos ayudan a posicionar tu video en más búsquedas.',
        },
      ],
    },
    useCases: {
      eyebrow: 'Casos de uso',
      title: 'Hecho para todo tipo de contenido largo',
      items: [
        {
          title: 'Tutoriales y guías',
          description:
            'Permite que la gente salte directo al paso que necesita y vuelva a tu video como referencia.',
        },
        {
          title: 'Podcasts y entrevistas',
          description: 'Un capítulo por pregunta o tema, solo con el archivo de audio.',
          link: '/es/capitulos-podcast',
          linkLabel: 'Generador de capítulos para podcast →',
        },
        {
          title: 'Webinars y cursos',
          description: 'Convierte una grabación de dos horas en una clase fácil de navegar.',
        },
        {
          title: 'Reseñas y vlogs',
          description: 'Destaca cada producto o momento para que nadie se vaya.',
        },
      ],
    },
    pricing: {
      eyebrow: 'Precios',
      title: 'Pagas por video. Sin suscripción.',
      subtitle: 'Los créditos no vencen. Un crédito = un video.',
      plans: [
        {
          name: 'Gratis',
          price: '$0',
          features: ['2 videos', 'Hasta 20 minutos cada uno', 'Sin registro'],
          cta: 'Empezar gratis',
        },
        {
          name: 'Starter',
          price: '$5',
          unit: '5 videos',
          features: ['$1,00 por video', 'Cualquier duración, hasta 500 MB', 'Mejoras de títulos ilimitadas'],
          cta: 'Comprar Starter',
        },
        {
          name: 'Creator',
          price: '$12',
          unit: '15 videos',
          badge: 'Mejor valor',
          features: ['$0,80 por video', 'Cualquier duración, hasta 500 MB', 'Mejoras de títulos ilimitadas'],
          cta: 'Comprar Creator',
          featured: true,
        },
      ],
    },
    faq: {
      eyebrow: 'Preguntas frecuentes',
      title: 'Preguntas y respuestas',
      aside: '¿Tienes otra duda?',
      contact: 'Escríbenos',
      items: [
        {
          question: '¿Cómo agrego capítulos a un video de YouTube?',
          answer:
            'Copia la lista de capítulos generada y pégala en la descripción de tu video desde YouTube Studio. YouTube detecta el formato automáticamente y la convierte en capítulos clicables en la barra de progreso.',
        },
        {
          question: '¿Por qué no aparecen mis capítulos en YouTube?',
          answer:
            'YouTube tiene tres reglas estrictas: la primera marca de tiempo debe ser exactamente 0:00, necesitas al menos 3 capítulos y cada uno debe durar al menos 10 segundos. ChapterGen respeta todo esto por defecto, así que con nuestro resultado nunca pasa.',
        },
        {
          question: '¿ChatGPT o Claude pueden generar capítulos de YouTube a partir de mi video?',
          answer:
            'No de forma confiable. Los asistentes de chat no pueden escuchar un archivo de video largo: la subida se rechaza o es demasiado pesada, y sin una transcripción real las marcas de tiempo que devuelven son suposiciones. ChapterGen transcribe el audio primero, así que cada marca de tiempo coincide con lo que realmente se dice.',
        },
        {
          question: '¿Necesito una URL de YouTube para usarlo?',
          answer:
            'No — esa es justamente la idea. Subes el archivo de video o audio directamente, así que funciona con videos sin publicar, privados y ocultos.',
        },
        {
          question: '¿Puedo generar capítulos solo con audio?',
          answer:
            'Sí. MP3, WAV, M4A y otros formatos de audio son totalmente compatibles. Ideal para podcasts.',
        },
        {
          question: '¿Qué formatos y tamaños de archivo se admiten?',
          answer:
            'MP4, MOV, AVI, WebM, MKV, MP3, WAV, M4A, AAC, OGG y FLAC — hasta 500 MB por archivo.',
        },
        {
          question: '¿Es gratis?',
          answer:
            'Tienes 2 videos gratis (hasta 20 minutos cada uno) sin registro. Después, compras un paquete de créditos — Starter cuesta $5 por 5 videos y Creator $12 por 15. Sin suscripción.',
        },
        {
          question: '¿Puedo editar los capítulos antes de usarlos?',
          answer: 'Sí — cada título y marca de tiempo se puede editar antes de copiar el resultado final.',
        },
        {
          question: '¿Funciona en otros idiomas además del inglés?',
          answer:
            'Sí. Nuestra IA usa Whisper, que detecta el idioma automáticamente y funciona con más de 90 idiomas.',
        },
      ],
    },
    finalCta: {
      title: 'Tu próximo video merece capítulos.',
      subtitle: 'Pruébalo gratis con 2 videos. Sin crear cuenta.',
      cta: 'Generar capítulos',
    },
    schema: {
      softwareDescription:
        'Generador de capítulos de YouTube con IA. Sube un video o audio y obtén marcas de tiempo optimizadas para SEO en formato YouTube, incluso antes de publicar el video.',
      howToName: 'Cómo generar capítulos de YouTube con IA',
    },
  },
  podcast: {
    meta: {
      title: 'Generador de Capítulos de Podcast con IA — Marcas de Tiempo desde tu Audio',
      description:
        'Sube tu episodio de podcast y obtén capítulos con marcas de tiempo generados con IA. Funciona con MP3, WAV y episodios de cualquier duración. Gratis para probar.',
    },
    hero: {
      badge: 'Enfocado en audio · Cualquier duración · Gratis',
      title: 'Generador de Capítulos de Podcast con IA — Sube tu Audio y Obtén Capítulos con Marcas de Tiempo',
      subtitle:
        'Suelta el archivo de tu episodio — MP3, WAV, M4A — y obtén capítulos limpios con títulos descriptivos en minutos. Hecho para entrevistas, episodios en solitario y episodios de cualquier duración.',
      preview: {
        fileName: 'ep-87-entrevista.mp3',
        duration: '1:12:40',
        label: 'Ejemplo de resultado',
        copy: 'Copiar capítulos',
        refine: 'Mejorar títulos',
        activeIndex: 2,
        chapters: [
          { time: '0:00', title: 'Apertura y presentación del invitado' },
          { time: '4:35', title: 'Cómo empezó la empresa' },
          { time: '18:20', title: 'Los primeros 1.000 clientes' },
          { time: '37:05', title: 'Contratar al primer equipo' },
          { time: '52:48', title: 'Errores que conviene evitar' },
          { time: '1:05:10', title: 'Preguntas rápidas' },
        ],
      },
    },
    platforms: {
      title: 'Un Episodio, Capítulos para Cada Plataforma',
      intro: 'Genera una vez y úsalos en todas partes donde vive tu podcast:',
      items: [
        {
          title: 'YouTube',
          description: 'Pégalos en la descripción de tu video para tener capítulos clicables.',
        },
        {
          title: 'Spotify',
          description: 'Spotify admite capítulos de episodios — usa las mismas marcas de tiempo.',
        },
        {
          title: 'Apple Podcasts',
          description: 'Agrega capítulos a través de tu plataforma de hosting o herramientas de publicación.',
        },
        {
          title: 'Notas del episodio',
          description:
            'Tu lista de capítulos también sirve como un esquema listo del episodio para tu sitio web y newsletter.',
        },
      ],
    },
    useCases: {
      title: 'Hecho para Cómo Trabajan Realmente los Podcasters',
      items: [
        {
          title: 'Entrevistas',
          description:
            'Un capítulo por pregunta o tema, para que los oyentes salten a la idea del invitado que vinieron a buscar.',
        },
        {
          title: 'Episodios en solitario',
          description: 'Convierte tus puntos de conversación en una estructura navegable.',
        },
        {
          title: 'Paneles y mesas redondas',
          description: 'Marca cada segmento de orador o tema de discusión.',
        },
        {
          title: 'Episodios largos',
          description: '¿Episodios de 2 o 3 horas? Sin problema — el formato largo es justo para lo que sirven los capítulos.',
        },
      ],
    },
    why: {
      title: 'Los Capítulos Convierten Oyentes en Suscriptores',
      description:
        'Los oyentes de podcast cada vez prueban más antes de comprometerse. Los capítulos permiten que un nuevo oyente salte directo al segmento que lo enganchó desde un clip o una recomendación — y un oyente que encuentra valor rápido es un oyente que se suscribe. En YouTube en particular, los capítulos también hacen que tus episodios sean buscables y elegibles para los Momentos clave de Google.',
    },
    faq: {
      title: 'Capítulos de Podcast — Preguntas Frecuentes',
      items: [
        {
          question: '¿Puedo generar capítulos solo desde audio, sin video?',
          answer: 'Sí — los archivos de audio son totalmente compatibles. Para eso es esta página.',
        },
        {
          question: '¿Cuál es la duración máxima de un episodio?',
          answer:
            'No hay límite de duración — solo un tope de 500 MB de tamaño de archivo. Los episodios largos son totalmente compatibles.',
        },
        {
          question: '¿Cómo agrego capítulos a Spotify?',
          answer:
            'Spotify lee los capítulos incrustados en tu episodio o añadidos a través de Spotify for Creators. Genera tus marcas de tiempo aquí y luego agrégalas en el panel de tu plataforma de hosting.',
        },
        {
          question: '¿Los capítulos funcionan en Apple Podcasts?',
          answer:
            'Sí — Apple Podcasts admite capítulos añadidos a través de tu plataforma de hosting o herramientas que incrustan marcadores de capítulo.',
        },
        {
          question: '¿Puedo usar los capítulos como notas del episodio?',
          answer:
            'Por supuesto — el esquema con marcas de tiempo funciona como el esqueleto de tus notas del episodio. Solo agrega enlaces y un resumen.',
        },
        {
          question: '¿Qué formatos de audio admiten?',
          answer: 'MP3, WAV, M4A, AAC, OGG, FLAC y OPUS — hasta 500 MB por archivo.',
        },
      ],
    },
    crossLink: 'También funciona con video → Generador de Capítulos de YouTube',
  },
  tool: {
    uploader: {
      titleVideo: 'Suelta aquí tu video o audio',
      titleAudio: 'Suelta aquí el audio de tu episodio',
      titleVideoCompact: 'Arrastra un video o audio, o haz clic para buscar',
      titleAudioCompact: 'Arrastra un audio, o haz clic para buscar',
      hintVideo: 'MP4, MOV, WebM, MP3, WAV, M4A — hasta 500 MB',
      hintAudio: 'MP3, WAV, M4A, AAC, OGG, FLAC — hasta 500 MB',
      button: 'Generar Capítulos',
    },
    chapterTool: {
      filesDeleted: 'Archivos eliminados tras procesarlos',
      noSignup: '2 videos gratis, sin registro',
      languages: 'Más de 90 idiomas',
      uploading: 'Subiendo el archivo e iniciando el procesamiento…',
      uploadProgress: 'Subiendo archivo… {percent}%',
      uploadChunk: 'Parte {current} de {total}',
      uploadRetry: 'Reintentando parte {current}…',
      uploadFailed: 'No se pudo subir el archivo. Intentá de nuevo.',
      unknownError: 'Error desconocido',
      tryAgain: 'Intentar de nuevo',
    },
    processing: {
      headingUploading: 'Subiendo el archivo…',
      headingExtracting: 'Extrayendo el audio…',
      headingTranscribing: 'Transcribiendo el audio…',
      headingGenerating: 'Generando capítulos…',
      headingRegenerating: 'Refinando capítulos…',
      headingFallback: 'Procesando…',
      subtitleUploading: 'Enviando tu archivo al servidor',
      subtitleExtracting: 'Preparando el audio para la transcripción',
      subtitleTranscribing: 'detectando cambios de tema',
      subtitleGenerating: 'Analizando la estructura de la transcripción',
      subtitleRegenerating: 'Aplicando tus ajustes',
      stageUploaded: 'Subido',
      stageTranscribing: 'Transcribiendo',
      stageGenerating: 'Generando capítulos',
    },
    result: {
      heading: 'Marcas de tiempo generadas',
      chapters: 'sin capítulos | {count} capítulo | {count} capítulos',
      editHint: 'toca cualquier campo para editar',
      chapterTimeAria: 'Marca de tiempo del capítulo {n}',
      chapterTitleAria: 'Título del capítulo {n}',
      copy: 'Copiar',
      copied: 'Copiado',
      refine: 'Refinar',
      downloadChapters: 'Capítulos',
      downloadTranscript: 'Transcripción',
      downloadChaptersTitle: 'Descargar capítulos',
      downloadTranscriptTitle: 'Descargar transcripción',
      preview: 'Ver texto sin formato',
    },
    refine: {
      title: 'Refinar capítulos',
      close: 'Cerrar',
      whatToChange: 'Qué cambiar',
      titlesAndCuts: 'Títulos y cortes',
      titlesOnly: 'Solo títulos',
      cutsOnly: 'Solo cortes',
      granularity: 'Granularidad',
      moreDetailed: 'Más detallado',
      balanced: 'Equilibrado',
      moreGrouped: 'Más agrupado',
      contentType: 'Tipo de contenido',
      ctAuto: 'Automático',
      ctTutorial: 'Tutorial / guía',
      ctPodcast: 'Podcast / entrevista',
      ctWebinar: 'Webinar / curso',
      ctReview: 'Reseña / vlog',
      titleStyle: 'Estilo de título',
      tsDescriptive: 'Descriptivo',
      tsShort: 'Corto (≤40 caracteres)',
      tsSeo: 'SEO / palabras clave',
      tsQuestion: 'Formato de pregunta',
      chapterCount: 'Cantidad de capítulos',
      automatic: 'Automático',
      fixedCount: 'Cantidad fija',
      chaptersLabel: 'Capítulos:',
      cancel: 'Cancelar',
      submit: 'Refinar',
    },
    job: {
      back: '← Volver al generador',
      ready: 'Tus capítulos están listos',
      done: 'Listo',
      wentWrong: 'Algo salió mal',
      tryAgain: 'Intentar de nuevo',
      errorAudioTooLarge:
        'Este archivo es demasiado largo para transcribir (más de ~25 MB de audio incluso tras comprimir). Probá con un archivo más corto o dividilo en partes.',
      errorFreeDuration:
        'Los videos gratis tienen un límite de 20 minutos. Comprá créditos para archivos más largos.',
      errorCredits:
        'Este archivo necesita más créditos de los que te quedan. Comprá un pack para seguir.',
    },
  },
  pricing: {
    meta: {
      title: 'Precios — Packs de créditos de ChapterGen',
      description:
        'Probá 2 videos gratis y comprá créditos cuando necesites más. Sin suscripción. Starter $5 / 5 videos, Creator $12 / 15 videos.',
    },
    title: 'Packs de créditos simples',
    subtitle:
      'Dos videos gratis para probar el flujo. Pagás solo cuando necesitás más — los créditos no vencen.',
    free: {
      name: 'Gratis',
      jobs: '2 videos',
      minutes: 'Hasta 20 minutos cada uno',
      signup: 'Sin registro',
    },
    packs: {
      starter: {
        name: 'Starter',
        blurb: 'Para un lote corto de subidas.',
      },
      creator: {
        name: 'Creator',
        blurb: 'Mejor valor si publicás todas las semanas.',
      },
    },
    credits: '{count} videos',
    minuteRule: '1 crédito = 1 video. Los créditos no vencen',
    refineIncluded: 'Refine ilimitado en videos pagos',
    buy: 'Comprar créditos',
    loadError: 'No se pudieron cargar los precios.',
    checkoutError: 'No se pudo iniciar el pago. Probá de nuevo.',
  },
  paywall: {
    title: 'Seguí generando capítulos',
    lead: 'Cargá créditos una vez y usalos cuando quieras.',
    bulletExpire: '1 crédito = 1 video. Los créditos no vencen',
    bulletSize: 'Archivos de hasta 500 MB, video o audio',
    bulletPrivate: 'Funciona con videos privados o sin publicar',
    oneTime: 'Pago único. Sin suscripción ni cargos recurrentes.',
    choose: 'Elegí tu paquete',
    creditsLabel: '{count} créditos',
    perCredit: '{price} c/u',
    savePercent: 'Ahorrás {percent}%',
    continue: 'Continuar — {price}',
    summary: '{count} créditos · {price} c/u · pago único',
    ssl: 'Pago cifrado SSL · Procesado por Stripe',
    redirecting: 'Redirigiendo…',
    close: 'Cerrar',
    loadError: 'No se pudieron cargar los packs.',
    checkoutError: 'No se pudo iniciar el pago. Probá de nuevo.',
    reasonLabel: {
      free_limit: 'Límite gratis alcanzado',
      credits: 'Créditos insuficientes',
      refine: 'Límite de refine',
      free_duration: 'Tope de 20 min gratis',
      buy: 'Comprar créditos',
    },
    reason: {
      free_limit: 'Ya usaste tus 2 videos gratis. Comprá créditos para seguir generando capítulos.',
      credits: 'No te quedan créditos. Cargá un pack para generar más capítulos.',
      refine: 'Los videos gratis incluyen 2 refines. Comprá créditos para refinar sin límite.',
      free_duration: 'Los videos gratis tienen un tope de 20 minutos. Con créditos no hay ese límite.',
      buy: 'Cargá créditos una vez y usalos cuando quieras.',
    },
  },
  login: {
    metaTitle: 'Entrar — ChapterGen',
    title: 'Entrar',
    subtitle: 'Poné el email con el que pagaste. Te mandamos un enlace de acceso — sin contraseña.',
    email: 'Email',
    placeholder: "vos{'@'}email.com",
    submit: 'Enviar enlace',
    sending: 'Enviando…',
    sent: 'Si hay una cuenta con ese email, te mandamos un enlace. Revisá tu bandeja.',
    sendError: 'No se pudo enviar el enlace. Probá de nuevo.',
    invalidLink: 'Ese enlace es inválido o venció. Pedí uno nuevo.',
  },
  dashboard: {
    metaTitle: 'Dashboard — ChapterGen',
    title: 'Mis Capítulos',
    subtitle: 'Generá capítulos nuevos o abrí uno que ya hiciste.',
    loading: 'Cargando…',
    loadError: 'No se pudo cargar tu cuenta.',
    logout: 'Salir',
    credits: 'Créditos restantes',
    creditsWord: 'créditos',
    buyMore: 'Comprar más créditos',
    newChapters: 'Nuevos capítulos',
    history: 'Historial',
    fileCountOne: '1 archivo',
    fileCount: '{count} archivos',
    noHistory: 'Todavía no hay capítulos.',
    open: 'Abrir',
    chaptersCount: '{count} capítulos',
    status: {
      pending: 'Pendiente',
      extracting: 'Extrayendo audio',
      transcribing: 'Transcribiendo',
      generating: 'Generando',
      regenerating: 'Refinando',
      completed: 'Completado',
      failed: 'Falló',
    },
  },
  settings: {
    metaTitle: 'Ajustes — ChapterGen',
    title: 'Ajustes',
    subtitle: 'Datos de tu cuenta. Escribinos si hay que cambiar algo.',
    email: 'Email',
    language: 'Idioma',
    credits: 'Créditos',
    google: 'Google',
    googleConnected: 'Conectado',
    googleNotConnected: 'No conectado',
    createdAt: 'Miembro desde',
    lastLogin: 'Último acceso',
    never: 'Nunca',
  },
  billing: {
    metaTitle: 'Facturación — ChapterGen',
    title: 'Facturación',
    subtitle: 'Compras de esta cuenta.',
    payments: 'Pagos',
    noPayments: 'Todavía no hay compras.',
  },
  support: {
    title: 'Soporte',
    subtitle: 'Escribinos y te respondemos al email de la cuenta.',
    email: 'Email',
    subject: 'Asunto',
    subjectPlaceholder: '¿En qué te podemos ayudar?',
    message: 'Mensaje',
    messagePlaceholder: 'Contanos qué necesitás…',
    submit: 'Enviar',
    sending: 'Enviando…',
    sent: 'Listo — recibimos tu mensaje y te respondemos por email.',
    sendError: 'No se pudo enviar el mensaje. Probá de nuevo.',
    close: 'Cerrar',
  },
  pages: {
    updated: 'Última actualización: {date}',
    contactLead: '¿Preguntas? Escribe a',
    about: {
      meta: {
        title: 'Acerca de ChapterGen — Por qué creamos un generador de capítulos de YouTube con IA',
        description:
          'ChapterGen convierte un archivo de video o audio en capítulos de YouTube. Nació cuando ChatGPT y Claude no pudieron procesar un video largo. Te contamos por qué y cómo funciona.',
      },
      eyebrow: 'Acerca de',
      title: 'Nació porque el atajo obvio no funcionó',
      intro:
        'ChapterGen es una herramienta pequeña e independiente que convierte un archivo de video o audio en capítulos de YouTube con marcas de tiempo precisas y títulos descriptivos.',
      sections: [
        {
          heading: 'Por qué existe ChapterGen',
          paragraphs: [
            'Quería capítulos para un video largo antes de publicarlo. Lo primero que probé fue lo obvio: subir el archivo a ChatGPT y a Claude y pedirles las marcas de tiempo.',
            'No funcionó. El archivo era demasiado pesado para subirlo, los asistentes no podían escuchar el audio y, cuando pegaba parte del texto, las marcas de tiempo que devolvían eran inventadas. Conseguir capítulos útiles seguía implicando transcribir el video, dividirlo por temas y revisar cada marca de tiempo a mano.',
            'Así que construí una herramienta que hace exactamente eso, de principio a fin, a partir del archivo.',
          ],
        },
        {
          heading: 'Cómo funciona',
          paragraphs: [
            'ChapterGen extrae el audio de tu archivo y lo transcribe con Whisper, el modelo de reconocimiento de voz de OpenAI, así que cada marca de tiempo sale del audio real. Después, un modelo de lenguaje detecta dónde cambia el tema y escribe un título descriptivo para cada sección.',
            'El resultado cumple las reglas de capítulos de YouTube: empieza en 0:00, tiene al menos tres capítulos y ninguno dura menos de 10 segundos. Puedes editar cada título antes de copiarlo.',
          ],
        },
        {
          heading: 'Qué lo hace distinto',
          paragraphs: [
            'La mayoría de las herramientas de capítulos necesitan una URL pública de YouTube. ChapterGen trabaja con el archivo, así que puedes agregar capítulos a borradores, videos privados u ocultos y podcasts de solo audio antes de publicar nada.',
            'Funciona en más de 90 idiomas, con archivos de hasta 500 MB, y puedes probarlo gratis con 2 videos sin crear cuenta.',
          ],
        },
        {
          heading: 'Tus archivos',
          paragraphs: [
            'Los archivos que subes se eliminan de nuestros servidores después de procesarlos. Guardamos la transcripción y los capítulos para que puedas volver a ellos. La política de privacidad explica los detalles.',
          ],
        },
      ],
      signature: 'Mauricio, fundador de ChapterGen',
    },
    privacy: {
      meta: {
        title: 'Política de privacidad — ChapterGen',
        description: 'Cómo ChapterGen maneja los archivos que subes, los datos de tu cuenta y los pagos.',
      },
      eyebrow: 'Legal',
      title: 'Política de privacidad',
      updatedDate: '17 de octubre de 2026',
      intro:
        'Esta política explica qué datos recopila ChapterGen cuando usas chaptergen.com, para qué, y qué puedes hacer al respecto. Recopilamos lo mínimo necesario para que el servicio funcione.',
      sections: [
        {
          heading: 'Archivos que subes',
          paragraphs: [
            'Los archivos de video y audio se suben a nuestro servidor solo para extraer el audio y generar los capítulos. El archivo original y el audio extraído se eliminan después de procesarlos. Las subidas incompletas se borran automáticamente.',
          ],
        },
        {
          heading: 'Transcripciones y capítulos',
          paragraphs: [
            'Guardamos la transcripción, los capítulos generados y datos básicos del archivo (nombre, tamaño, duración e idioma) para que puedas ver, editar y copiar tus resultados más tarde. Quedan asociados a tu cuenta o, si no iniciaste sesión, a un identificador anónimo guardado en tu navegador.',
          ],
        },
        {
          heading: 'Cuenta y pagos',
          paragraphs: [
            'Si inicias sesión, guardamos tu correo electrónico para enviarte enlaces de acceso y mantener tus créditos. No usamos contraseñas.',
            'Los pagos los procesa Stripe. Nunca vemos ni guardamos los datos de tu tarjeta; conservamos un registro de cada compra (paquete, importe y fecha).',
          ],
        },
        {
          heading: 'Proveedores de servicio',
          paragraphs: [
            'El audio se envía a la API de OpenAI para transcribirlo, y la transcripción se envía a OpenAI para generar los títulos de los capítulos. Según los términos de la API de OpenAI, estos datos no se usan para entrenar sus modelos.',
            'También usamos Stripe (pagos), Resend (correos de acceso), Google Analytics y Mixpanel (analítica de uso anónima) y nuestro proveedor de hosting.',
          ],
        },
        {
          heading: 'Cookies y almacenamiento local',
          paragraphs: [
            'Usamos una cookie de sesión para mantenerte conectado y el almacenamiento del navegador para recordar tu idioma y tu identificador anónimo. Las herramientas de analítica usan sus propias cookies para medir las visitas.',
          ],
        },
        {
          heading: 'Tus opciones',
          paragraphs: [
            'Puedes pedirnos por correo que exportemos o eliminemos tu cuenta, tus transcripciones y tus capítulos en cualquier momento. Respondemos en un plazo de 30 días.',
          ],
        },
      ],
    },
    terms: {
      meta: {
        title: 'Términos del servicio — ChapterGen',
        description: 'Los términos de uso de ChapterGen, el generador de capítulos de YouTube con IA.',
      },
      eyebrow: 'Legal',
      title: 'Términos del servicio',
      updatedDate: '17 de octubre de 2026',
      intro: 'Al usar chaptergen.com aceptas estos términos. Son cortos a propósito.',
      sections: [
        {
          heading: 'El servicio',
          paragraphs: [
            'ChapterGen genera marcas de tiempo y títulos de capítulos a partir de los archivos de video y audio que subes. Los resultados los produce una IA y pueden tener errores, así que revísalos antes de publicar.',
          ],
        },
        {
          heading: 'Tu contenido',
          paragraphs: [
            'Conservas todos los derechos sobre los archivos que subes y sobre los capítulos generados a partir de ellos. Confirmas que tienes derecho a subir ese contenido y que no infringe la ley.',
          ],
        },
        {
          heading: 'Uso gratuito y créditos',
          paragraphs: [
            'Cualquier visitante puede procesar 2 videos gratis, de hasta 20 minutos cada uno. Los créditos de pago se venden en paquetes; un crédito procesa un video. Los créditos no vencen.',
            'Si un video no se procesa por un problema de nuestro lado, escríbenos y te devolvemos el crédito. Lo mismo vale para cualquier problema con una compra, incluido un reembolso cuando corresponda.',
          ],
        },
        {
          heading: 'Uso aceptable',
          paragraphs: [
            'No uses ChapterGen para procesar contenido sobre el que no tienes derechos, para sobrecargar el servicio ni para intentar acceder a datos de otras personas.',
          ],
        },
        {
          heading: 'Responsabilidad',
          paragraphs: [
            'ChapterGen se ofrece tal cual. En la medida en que lo permita la ley, nuestra responsabilidad total se limita a lo que nos pagaste en los últimos 12 meses.',
          ],
        },
        {
          heading: 'Cambios',
          paragraphs: [
            'Podemos actualizar estos términos. La fecha de arriba indica la última versión; seguir usando el servicio significa que aceptas los cambios.',
          ],
        },
      ],
    },
    notFound: {
      meta: {
        title: 'Página no encontrada — ChapterGen',
      },
      code: '404',
      title: 'Esta página se saltó un capítulo',
      description: 'La página que buscas no existe o cambió de lugar.',
      home: 'Ir al generador de capítulos',
      podcast: 'Capítulos de podcast',
      pricing: 'Precios',
    },
  },
}
