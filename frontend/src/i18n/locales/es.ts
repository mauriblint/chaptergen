export default {
  common: {
    nav: {
      tryFree: 'Probar gratis',
      homeLabel: 'Inicio de ChapterGen',
      mainLabel: 'Navegación principal',
      mobileLabel: 'Navegación móvil',
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
      product: 'Producto',
      tryFreeShort: 'Probar',
      tryFreeMobile: 'Generar capítulos gratis',
      productMenu: {
        youtube: {
          title: 'Generador de capítulos de YouTube',
          description: 'Marcas de tiempo desde cualquier video, antes de publicar.',
        },
        podcast: {
          title: 'Generador de capítulos de podcast',
          description: 'Capítulos desde el audio para YouTube, Spotify y notas del episodio.',
        },
        transcript: {
          title: 'Video a texto',
          description: 'Transcribe cualquier video o audio, con marcas de tiempo.',
        },
        subtitles: {
          title: 'Generador de subtítulos',
          description: 'Subtítulos SRT y VTT con líneas fáciles de leer.',
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
      videoToText: 'Video a Texto',
      subtitleGenerator: 'Generador de Subtítulos',
      guidesHeading: 'Guías',
      guideAddChapters: 'Agregar capítulos a YouTube',
      guideChatgpt: 'ChatGPT y capítulos de YouTube',
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
      title: "Generador de capítulos de YouTube con IA {'|'} ChapterGen",
      description:
        'Sube un video o audio y obtén capítulos de YouTube con marcas de tiempo y títulos optimizados, incluso antes de publicar. 2 videos gratis, sin tarjeta.',
    },
    hero: {
      badge: 'Funciona con videos privados y sin publicar',
      title: 'Generador de capítulos de YouTube con IA',
      subtitle:
        'Sube un video o audio y obtén marcas de tiempo limpias y optimizadas para SEO, en el formato exacto de YouTube. Sin URL pública.',
    },
    audience: {
      label: 'Hecho para contenido largo',
      items: ['Tutoriales', 'Podcasts', 'Entrevistas', 'Webinars y cursos', 'Reseñas y vlogs'],
    },
    showcase: {
      eyebrow: 'Lo que obtienes',
      title: 'Capítulos listos para pegar en YouTube',
      intro: 'Cada capítulo sale del audio real, con un título que describe lo que realmente se dice.',
      bullets: [
        'Empieza en 0:00 y cumple las reglas de capítulos de YouTube',
        'Títulos descriptivos que puedes editar o mejorar con IA',
        'Un clic para copiarlos en tu descripción',
      ],
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
      plans: [
        {
          name: 'Starter',
          price: '$5',
          unit: '5 videos',
          features: ['$1,00 por video', 'Cualquier duración, hasta 500 MB', 'Capítulos, transcripción y subtítulos'],
          cta: 'Comprar Starter',
        },
        {
          name: 'Creator',
          price: '$12',
          unit: '15 videos',
          badge: 'Más elegido',
          features: ['$0,80 por video', 'Cualquier duración, hasta 500 MB', 'Capítulos, transcripción y subtítulos'],
          cta: 'Comprar Creator',
          featured: true,
        },
        {
          name: 'Studio',
          price: '$35',
          unit: '60 videos',
          badge: 'Mejor valor',
          features: ['$0,58 por video', 'Cualquier duración, hasta 500 MB', 'Capítulos, transcripción y subtítulos'],
          cta: 'Comprar Studio',
        },
      ],
      trial: '2 videos gratis para probar · sin tarjeta',
      trialCta: 'Empezar gratis',
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
            'Tienes 2 videos gratis (hasta 20 minutos cada uno) al confirmar tu email. Sin contraseña ni tarjeta. Después, compras un paquete de créditos — Starter cuesta $5 por 5 videos y Creator $12 por 15. Sin suscripción.',
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
      subtitle: 'Pruébalo gratis con 2 videos. Sin contraseña ni tarjeta.',
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
      title: "Generador de capítulos para podcast con IA {'|'} ChapterGen",
      description:
        'Sube tu episodio y obtén capítulos con marcas de tiempo para YouTube, Spotify y tus notas. MP3, WAV, M4A, cualquier duración. 2 videos gratis.',
    },
    hero: {
      badge: 'Enfocado en audio · Cualquier duración · Gratis',
      title: 'Generador de capítulos para podcast desde tu audio',
      subtitle:
        'Suelta el archivo de tu episodio — MP3, WAV, M4A — y obtén capítulos limpios con títulos descriptivos en minutos. Hecho para entrevistas, episodios en solitario y episodios de cualquier duración.',
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
    showcase: {
      eyebrow: 'Lo que obtienes',
      title: 'Un capítulo por tema, solo con el audio',
      intro: 'Sube el archivo del episodio y obtén un índice con marcas de tiempo para YouTube, Spotify y tus notas del episodio.',
      bullets: [
        'Funciona con MP3, WAV, M4A y episodios largos',
        'Títulos que nombran el tema o la idea del invitado',
        'Reutiliza la lista como notas del episodio',
      ],
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
      button: 'Generar capítulos',
    },
    chapterTool: {
      filesDeleted: 'Archivos eliminados tras procesarlos',
      noSignup: '2 videos gratis, sin tarjeta',
      languages: 'Más de 90 idiomas',
      uploading: 'Subiendo el archivo e iniciando el procesamiento…',
      uploadProgress: 'Subiendo archivo… {percent}%',
      uploadChunk: 'Parte {current} de {total}',
      uploadRetry: 'Reintentando parte {current}…',
      uploadFailed: 'No se pudo subir el archivo. Intenta de nuevo.',
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
        'Este archivo es demasiado largo para transcribir (más de ~25 MB de audio incluso tras comprimir). Prueba con un archivo más corto o divídelo en partes.',
      errorFreeDuration:
        'Los videos gratis tienen un límite de 20 minutos. Compra créditos para archivos más largos.',
      errorCredits:
        'Este archivo necesita más créditos de los que te quedan. Compra un paquete para seguir.',
    },
  },
  pricing: {
    meta: {
      title: 'Precios — Paquetes de créditos de ChapterGen',
      description:
        'Prueba 2 videos gratis y compra créditos cuando necesites más. Sin suscripción. Starter $5 por 5 videos, Creator $12 por 15, Studio $35 por 60. Cada video incluye capítulos, transcripción y subtítulos.',
    },
    eyebrow: 'Precios',
    title: 'Pagas por video. Sin suscripción.',
    subtitle: 'Los créditos no vencen. Cada video incluye capítulos, transcripción y subtítulos.',
    trial: {
      title: 'Empieza con una prueba gratis',
      details: '2 videos gratis · hasta 20 minutos cada uno · sin tarjeta',
      cta: 'Empezar gratis',
    },
    mostPopular: 'Más elegido',
    bestValue: 'Mejor valor',
    save: 'Ahorras {percent}%',
    oneTime: 'pago único',
    unit: '{n} videos · {price} por video',
    buy: 'Comprar {name}',
    paidFeatures: [
      '{n} videos de cualquier duración, hasta 500 MB',
      'Capítulos, transcripción y subtítulos',
      'Mejoras de títulos con IA ilimitadas',
      'Descargas: .txt, .docx, SRT, VTT, .zip',
      'Los créditos no vencen',
    ],
    packs: {
      starter: { name: 'Starter' },
      creator: { name: 'Creator' },
      studio: { name: 'Studio' },
    },
    included: {
      title: 'Cada video incluye',
      chapters: {
        title: 'Capítulos',
        description: 'Marcas de tiempo listas para YouTube con títulos descriptivos, editables y verificadas con las reglas de YouTube.',
      },
      transcript: {
        title: 'Transcripción',
        description: 'El texto completo con marcas de tiempo, con buscador y agrupado por capítulo. Descárgala en .txt o .docx.',
      },
      subtitles: {
        title: 'Subtítulos',
        description: 'Archivos SRT y VTT con líneas fáciles de leer, listos para YouTube, Vimeo y editores de video.',
      },
    },
    faq: {
      title: 'Preguntas sobre precios',
      items: [
        {
          question: '¿Qué cuenta como un video?',
          answer: 'Un archivo subido, de cualquier duración hasta 500 MB. Usa un crédito y te da capítulos, transcripción y subtítulos.',
        },
        {
          question: '¿Los créditos vencen?',
          answer: 'No. Compras una vez y los usas cuando quieras.',
        },
        {
          question: '¿Hay suscripción?',
          answer: 'No. Cada paquete es un pago único, procesado de forma segura por Stripe.',
        },
        {
          question: '¿Qué pasa si un video falla?',
          answer: 'Si el procesamiento falla, el crédito vuelve a tu cuenta automáticamente.',
        },
      ],
    },
    loadError: 'No se pudieron cargar los precios.',
    checkoutError: 'No se pudo iniciar el pago. Intenta de nuevo.',
  },
  paywall: {
    title: 'Sigue generando capítulos',
    lead: 'Compra una vez, úsalos cuando quieras.',
    bulletChapters: 'Capítulos listos para pegar en YouTube',
    bulletTranscript: 'Transcripción completa (.txt, .docx)',
    bulletSubtitles: 'Subtítulos (SRT, VTT)',
    bulletExpire: '1 crédito = 1 video. Los créditos no vencen',
    bulletSize: 'Archivos de hasta 500 MB, video o audio',
    oneTime: 'Pago único. Sin suscripción.',
    choose: 'Elige tu paquete',
    creditsLabel: '{count} créditos',
    perCredit: '{price} c/u',
    savePercent: 'Ahorrás {percent}%',
    continue: 'Continuar — {price}',
    summary: '{count} créditos · {price} c/u · pago único',
    ssl: 'Pago cifrado SSL · Procesado por Stripe',
    redirecting: 'Redirigiendo…',
    close: 'Cerrar',
    loadError: 'No se pudieron cargar los packs.',
    checkoutError: 'No se pudo iniciar el pago. Intenta de nuevo.',
    reasonLabel: {
      free_limit: 'Límite gratis alcanzado',
      credits: 'Créditos insuficientes',
      refine: 'Límite de refine',
      free_duration: 'Tope de 20 min gratis',
      buy: 'Comprar créditos',
      verify: 'Confirma tu email',
    },
    reason: {
      free_limit: 'Ya usaste tus 2 videos gratis. Compra créditos para seguir generando capítulos.',
      credits: 'No te quedan créditos. Carga un paquete para generar más capítulos.',
      refine: 'Los videos gratis incluyen 2 refines. Compra créditos para refinar sin límite.',
      free_duration: 'Los videos gratis tienen un tope de 20 minutos. Con créditos no hay ese límite.',
      buy: 'Compra una vez, úsalos cuando quieras.',
      verify: 'Confirma tu email para empezar a procesar videos.',
    },
  },
  login: {
    metaTitle: 'Entrar — ChapterGen',
    title: 'Entrar',
    subtitle: 'Poné el email con el que pagaste. Te mandamos un enlace de acceso — sin contraseña.',
    email: 'Email',
    placeholder: "tu{'@'}email.com",
    submit: 'Enviar enlace',
    sending: 'Enviando…',
    sent: 'Si hay una cuenta con ese email, te mandamos un enlace. Revisa tu bandeja.',
    sendError: 'No se pudo enviar el enlace. Intenta de nuevo.',
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
    lead: 'Respuestas a las preguntas más comunes. Si la tuya no está, escríbenos abajo.',
    metaTitle: 'Soporte — ChapterGen',
    search: 'Busca en las preguntas',
    noResults: 'Ninguna pregunta coincide. Escríbenos abajo y te ayudamos.',
    writeToUs: 'Escríbenos',
    groups: [
      {
        title: 'Cómo funciona',
        items: [
          {
            question: '¿Qué obtengo con cada video?',
            answer:
              'Capítulos listos para pegar en YouTube, la transcripción completa con marcas de tiempo y subtítulos en SRT y VTT. Puedes descargar todo en .docx o en un solo .zip.',
          },
          {
            question: '¿Qué archivos puedo subir?',
            answer:
              'Video o audio: MP4, MOV, WebM, MKV, MP3, WAV, M4A, AAC, OGG y FLAC, de hasta 500 MB por archivo. Si un video pesa más, sube solo su audio en MP3 o M4A: pesa mucho menos y el resultado es el mismo.',
          },
          {
            question: '¿Cuánto tarda?',
            answer:
              'Normalmente uno o dos minutos para un video de 10 a 20 minutos, algunos más para los largos. Puedes cerrar la página: te avisamos por email cuando esté listo.',
          },
          {
            question: '¿Qué idiomas soporta?',
            answer:
              'Más de 90. Por defecto el idioma se detecta del audio. Si lo sabes, elígelo en "Idioma del audio" al subir: ayuda con clips cortos y videos con música.',
          },
        ],
      },
      {
        title: 'Créditos y pagos',
        items: [
          {
            question: '¿Qué es un crédito?',
            answer:
              'Un crédito procesa un video, sin importar su duración. Incluye capítulos, transcripción y subtítulos. Los créditos vienen en packs, con un pago único y sin suscripción.',
          },
          {
            question: '¿Cómo funciona la prueba gratis?',
            answer: 'Una cuenta nueva recibe 2 videos gratis de hasta 20 minutos cada uno, sin tarjeta.',
          },
          {
            question: '¿Los créditos vencen?',
            answer: 'No. Úsalos cuando quieras.',
          },
          {
            question: '¿Qué pasa si un video falla?',
            answer:
              'El crédito vuelve a tu cuenta automáticamente. La página del video te dice qué salió mal y cómo solucionarlo.',
          },
        ],
      },
      {
        title: 'Resultados',
        items: [
          {
            question: '¿Puedo editar los capítulos?',
            answer:
              'Sí. Cambia los títulos o los tiempos en la pestaña Capítulos y se guardan mientras escribes. También puedes pedirle a la IA que los mejore: solo los títulos, los cortes o ambos. Los videos gratis incluyen 2 mejoras y los pagos no tienen límite.',
          },
          {
            question: '¿Cómo agrego los capítulos a YouTube?',
            answer:
              'Cópialos desde la pestaña Capítulos y pégalos en la descripción del video en YouTube Studio. YouTube pide que el primero empiece en 0:00, que haya al menos 3 y que cada uno dure al menos 10 segundos; nosotros lo revisamos por ti.',
          },
          {
            question: '¿Cómo obtengo los subtítulos?',
            answer:
              'En la pestaña Subtítulos elige SRT o VTT, ajusta los caracteres por línea si quieres y descárgalos. Los dos formatos se pueden subir a YouTube y a la mayoría de los editores.',
          },
          {
            question: 'La transcripción salió en otro idioma',
            answer:
              'En la página del video haz clic en "¿Idioma incorrecto?", junto a la duración, y elige el correcto. Es gratis, una vez por video, dentro de las 24 horas. Para evitarlo, elige el idioma del audio al subir.',
          },
        ],
      },
      {
        title: 'Problemas comunes',
        items: [
          {
            question: 'Dice que mi archivo no tiene audio',
            answer:
              'El archivo tiene solo imagen. Pasa mucho con videos descargados de YouTube: muchos descargadores guardan la imagen y el sonido por separado. Descarga el audio (MP3 o M4A) y súbelo. No se usa ningún crédito.',
          },
          {
            question: 'Dice que no se detectó voz',
            answer:
              'No escuchamos a nadie hablando, por ejemplo en música o grabaciones en silencio. Revisa que el archivo tenga pista de voz. El crédito se devuelve.',
          },
          {
            question: 'No me llegó el código o el email',
            answer:
              'Revisa spam y promociones. Los códigos vencen a los 10 minutos, así que pide uno nuevo si tardó. Fíjate que la dirección esté bien escrita.',
          },
        ],
      },
      {
        title: 'Privacidad',
        items: [
          {
            question: '¿Qué pasa con mis archivos?',
            answer:
              'El archivo subido se elimina apenas termina el proceso. El audio extraído se guarda 24 horas para que puedas transcribirlo de nuevo en otro idioma y luego se elimina. Guardamos la transcripción y los capítulos para que puedas volver a verlos.',
          },
          {
            question: '¿Cómo elimino mi cuenta?',
            answer: 'En Ajustes, usa "Borrar cuenta y datos". Eliminamos tu cuenta, transcripciones y capítulos en un plazo de 30 días.',
          },
        ],
      },
    ],
    contact: {
      title: '¿Necesitas más ayuda?',
      lead: 'Escríbenos y te respondemos lo antes posible, normalmente durante el día. La respuesta llega a {email}.',
      video: '¿Sobre qué video es?',
      noVideo: 'No es sobre un video',
    },
    subject: 'Asunto',
    subjectPlaceholder: '¿En qué te ayudamos?',
    message: 'Mensaje',
    messagePlaceholder: 'Cuéntanos qué necesitas…',
    submit: 'Enviar mensaje',
    sending: 'Enviando…',
    sent: 'Gracias, recibimos tu mensaje. Te responderemos por email, normalmente durante el día.',
    sendAnother: 'Enviar otro mensaje',
    sendError: 'No pudimos enviar el mensaje. Intenta de nuevo.',
  },
  guides: {
    updated: 'Actualizado el {date}',
    shortAnswer: 'Respuesta corta',
    faqTitle: 'Preguntas',
    related: 'Guía relacionada',
    chatgpt: {
      meta: {
        title: "¿ChatGPT puede hacer capítulos de YouTube? {'|'} ChapterGen",
        description:
          'ChatGPT y Claude tienen problemas con videos largos y suelen devolver marcas de tiempo que no coinciden con el video. Por qué pasa, qué funciona y cómo obtener capítulos exactos.',
      },
      eyebrow: 'Guía',
      title: '¿ChatGPT puede hacer los capítulos de YouTube de tu video?',
      updatedDate: '19 de octubre de 2026',
      intro:
        'Es lo primero que prueba casi todo creador: subir el video a ChatGPT o Claude y pedirle las marcas de tiempo. Yo también lo intenté con un video largo que quería publicar, y por eso existe ChapterGen. Esto es lo que pasa, por qué las marcas de tiempo salen mal y qué funciona.',
      answer:
        'No de forma confiable, sobre todo con videos largos. Los asistentes escriben buenos títulos a partir de texto, pero primero necesitan una transcripción con marcas de tiempo reales. Sin ella, los tiempos que devuelven suelen ser estimaciones que no coinciden con el video. La solución es transcribir el audio primero y armar los capítulos a partir de esa transcripción.',
      sections: [
        {
          heading: 'Qué pasa cuando subes un video a ChatGPT o Claude',
          paragraphs: [
            'El resultado depende del asistente, del plan y del archivo, y cambia con el tiempo. Con clips cortos a veces funciona. Con videos largos falla, y justamente los videos largos son los que necesitan capítulos.',
          ],
          bullets: [
            'La subida falla o se rechaza porque el archivo es demasiado grande.',
            'El asistente no puede procesar la pista de audio, así que no tiene de dónde sacar los capítulos.',
            'Responde igual, con una lista prolija de capítulos cuyos tiempos parecen correctos pero no coinciden con lo que se dice en ese momento.',
            'La lista no cumple las reglas de YouTube: no empieza en 0:00 o tiene capítulos de menos de 10 segundos, y YouTube la ignora.',
          ],
        },
        {
          heading: 'Por qué las marcas de tiempo salen mal',
          paragraphs: [
            'Una marca de tiempo tiene que salir del audio: el segundo exacto en el que empieza un tema. Un modelo de lenguaje predice texto; no lleva el reloj de la grabación. Si nunca recibió una transcripción con tiempos, cualquier marca que escriba es una estimación.',
            'En un video de 10 minutos la estimación puede acercarse. En una entrevista de una hora los errores chicos se acumulan, y un capítulo que dice 23:10 puede empezar en el 26:40. Quien hace clic llega a otro lugar, y eso es peor que no tener capítulos.',
          ],
        },
        {
          heading: 'Lo que funciona: primero la transcripción, después los capítulos',
          paragraphs: ['Los capítulos exactos siempre siguen el mismo orden, ya sea a mano, con un asistente o con una herramienta:'],
          steps: [
            'Transcribir el audio con un modelo de reconocimiento de voz que devuelva tiempos para cada fragmento, como Whisper.',
            'Agrupar la transcripción en secciones donde cambia el tema.',
            'Escribir un título corto y descriptivo para cada sección.',
            'Revisar las reglas de YouTube: el primer capítulo en 0:00, al menos tres capítulos y cada uno de 10 segundos o más.',
            'Pegar la lista en la descripción del video en YouTube Studio.',
          ],
          after: [
            'También funciona con ChatGPT o Claude si pegas una transcripción que ya tiene marcas de tiempo y les pides que la agrupen. El límite es cuánto texto puedes pegar de una vez y revisar cada tiempo de la respuesta.',
          ],
        },
        {
          heading: 'Cómo lo hace ChapterGen',
          paragraphs: [
            'ChapterGen hace esos cinco pasos a partir del archivo. Extrae el audio, lo transcribe con Whisper para que cada marca de tiempo salga de la grabación real, detecta dónde cambia el tema y escribe un título para cada capítulo. La lista empieza en 0:00 y cumple las reglas de YouTube, y puedes editar cada título antes de copiarla.',
            'Funciona con borradores, videos privados y no listados, y podcasts de solo audio, porque nunca necesita un link de YouTube. Cada video también trae la transcripción completa y subtítulos en SRT y VTT. Puedes probarlo gratis con 2 videos.',
          ],
        },
        {
          heading: 'Cuándo un asistente sigue siendo la herramienta indicada',
          paragraphs: [
            'Los asistentes son muy buenos para la parte de redacción. Cuando ya tienes capítulos con los tiempos correctos, pídele a ChatGPT o Claude que acorte los títulos, los haga más buscables o los adapte a tu tono. Deja los tiempos como están y cambia solo las palabras.',
          ],
        },
      ],
      cta: {
        title: 'Capítulos a partir del audio real',
        body: 'Sube un video o audio y obtén capítulos de YouTube con marcas de tiempo exactas, además de la transcripción y los subtítulos.',
        button: 'Probar gratis',
      },
      faq: [
        {
          question: '¿Claude puede hacer capítulos de YouTube a partir de un video?',
          answer:
            'Claude tiene la misma limitación que ChatGPT: arma buenos capítulos a partir de una transcripción con tiempos, pero no puede tomar un video largo de forma confiable y devolver marcas que coincidan. Dale una transcripción con marcas de tiempo o usa una herramienta que transcriba el audio primero.',
        },
        {
          question: '¿Y Gemini u otros asistentes?',
          answer:
            'Algunos asistentes pueden procesar ciertos videos, y siguen mejorando. Aplica el mismo control: abre el video en algunas de las marcas de tiempo antes de publicar. Los errores aparecen sobre todo en videos largos.',
        },
        {
          question: '¿Puedo usar ChatGPT con una transcripción de ChapterGen?',
          answer:
            'Sí. Descarga la transcripción con marcas de tiempo desde ChapterGen y pégala en ChatGPT para reescribir títulos, escribir la descripción o convertirla en un artículo.',
        },
        {
          question: '¿El video tiene que estar en YouTube?',
          answer:
            'No. ChapterGen trabaja con el archivo, así que puedes tener los capítulos listos antes de publicar, o para videos privados y no listados.',
        },
      ],
    },
    addChapters: {
      meta: {
        title: "Cómo agregar capítulos a un video de YouTube {'|'} ChapterGen",
        description:
          'Agrega capítulos a un video de YouTube desde YouTube Studio: el formato exacto de las marcas de tiempo, las reglas de YouTube, por qué no aparecen y cómo generarlos desde el archivo.',
      },
      eyebrow: 'Guía',
      title: 'Cómo agregar capítulos a un video de YouTube',
      updatedDate: '19 de octubre de 2026',
      intro:
        'Los capítulos dividen el video en secciones con nombre sobre la barra de progreso, para que cada persona salte a la parte que le interesa. Para agregarlos alcanza con una lista de marcas de tiempo en la descripción. Este es el formato exacto, las reglas que revisa YouTube y qué hacer si no aparecen.',
      answer:
        'En YouTube Studio, abre el video, pega en la descripción una lista de marcas de tiempo con títulos y guarda. La lista tiene que empezar en 0:00, tener al menos tres capítulos en orden y cada capítulo debe durar al menos 10 segundos. YouTube la convierte en capítulos sobre la barra de progreso.',
      sections: [
        {
          heading: 'Paso a paso en YouTube Studio',
          steps: [
            'Entra a YouTube Studio y abre Contenido en el menú de la izquierda.',
            'Haz clic en el video al que quieres agregarle capítulos.',
            'En la descripción, agrega tu lista de marcas de tiempo, un capítulo por línea.',
            'Haz clic en Guardar. Los capítulos pueden tardar unos minutos en aparecer.',
          ],
          after: [
            'Puedes agregar o cambiar los capítulos cuando quieras, antes o después de publicar. Alcanza con editar la descripción.',
          ],
        },
        {
          heading: 'El formato que necesita YouTube',
          paragraphs: ['Cada línea empieza con una marca de tiempo seguida del título del capítulo:'],
          example: '0:00 Introducción\n1:24 Por qué importan los capítulos\n4:10 Cómo preparar el proyecto\n9:45 Errores comunes\n14:30 Cierre',
          bullets: [
            'La primera marca de tiempo tiene que ser 0:00.',
            'Al menos tres marcas de tiempo, en orden ascendente.',
            'Cada capítulo tiene que durar al menos 10 segundos.',
            'En videos de más de una hora, incluye las horas: 1:02:15.',
            'La lista puede ir en cualquier parte de la descripción, pero con una marca por línea.',
          ],
        },
        {
          heading: 'Por qué no aparecen tus capítulos',
          paragraphs: ['Si guardaste la descripción y no hay capítulos, revisa esto en orden:'],
          bullets: [
            'La primera marca no es 0:00, o hay un error de tipeo como 0.00 o faltan los dos puntos.',
            'Hay menos de tres marcas, o algún capítulo dura menos de 10 segundos.',
            'Las marcas no están en orden ascendente.',
            'El canal tiene un strike activo: YouTube desactiva los capítulos mientras dure.',
            'YouTube considera que el contenido no es apto para todo público.',
            'El cambio es reciente. Espera unos minutos y vuelve a cargar el video.',
          ],
        },
        {
          heading: 'Capítulos automáticos o propios',
          paragraphs: [
            'YouTube puede crear capítulos por su cuenta. La opción se llama "Permitir capítulos automáticos", viene activada por defecto en los videos nuevos y puedes desactivarla en cada video, en Mostrar más, o para todos en Configuración, Valores predeterminados de subida.',
            'No todos los videos reciben capítulos automáticos, y los títulos suelen ser genéricos. Los capítulos que agregas en la descripción reemplazan a los automáticos, así que tú decides dónde empieza cada sección y cómo se llama.',
          ],
        },
        {
          heading: 'Cómo escribir títulos de capítulos que sirvan',
          bullets: [
            'Di qué pasa en la sección: "Cómo configurar el micrófono" es mejor que "Parte 2".',
            'Usa las palabras que la gente busca. Los títulos de los capítulos son texto que YouTube y Google pueden leer.',
            'Hazlos cortos, de unos 40 caracteres, para que entren en la barra de progreso.',
            'Apunta a un capítulo por cada cambio real de tema, normalmente cada pocos minutos.',
          ],
        },
        {
          heading: 'Genera la lista a partir de tu archivo',
          paragraphs: [
            'Escribir los capítulos a mano implica ver el video entero y anotar cada cambio de tema. ChapterGen lo hace desde el archivo: transcribe el audio, detecta dónde cambia el tema y escribe la lista en el formato de arriba, lista para pegar. Funciona antes de publicar y con videos privados, y cada video también trae la transcripción y los subtítulos.',
          ],
        },
      ],
      cta: {
        title: 'Tus capítulos listos para pegar',
        body: 'Sube un video o audio y obtén la lista de marcas de tiempo en el formato de YouTube, empezando en 0:00.',
        button: 'Probar gratis',
      },
      faq: [
        {
          question: '¿Los capítulos ayudan al posicionamiento?',
          answer:
            'Los títulos de los capítulos son texto en tu descripción que YouTube y Google pueden leer, y Google puede mostrarlos como momentos clave en los resultados de búsqueda. Los títulos descriptivos le dan al video más formas de ser encontrado.',
        },
        {
          question: '¿Puedo agregar capítulos a un video ya publicado?',
          answer: 'Sí. Edita la descripción en YouTube Studio, agrega la lista y guarda. Funciona con cualquier video, nuevo o viejo.',
        },
        {
          question: '¿Puedo agregar capítulos antes de publicar?',
          answer:
            'Sí. Agrega la lista en la descripción de un borrador, un video privado o uno programado. Con ChapterGen puedes generarla desde el archivo antes de subirlo a YouTube.',
        },
        {
          question: '¿Cuántos capítulos debería tener un video?',
          answer:
            'YouTube pide al menos tres y no fija un máximo. Lo que mejor funciona es un capítulo por tema, que suele ser uno cada pocos minutos. Demasiados capítulos cortos se vuelven difíciles de usar.',
        },
      ],
    },
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
            'Funciona en más de 90 idiomas, con archivos de hasta 500 MB, y puedes probarlo gratis con 2 videos solo con tu email.',
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
      updatedDate: '18 de octubre de 2026',
      intro:
        'Esta política explica qué datos recopila ChapterGen cuando usas chaptergen.com, para qué, y qué puedes hacer al respecto. Recopilamos lo mínimo necesario para que el servicio funcione.',
      sections: [
        {
          heading: 'Archivos que subes',
          paragraphs: [
            'Los archivos de video y audio se suben a nuestro servidor solo para extraer el audio y generar los capítulos. El archivo original se elimina después de procesarlo. El audio extraído se guarda 24 horas para que puedas transcribirlo de nuevo en otro idioma y luego se elimina. Las subidas incompletas se borran automáticamente.',
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
  app: {
    common: {
      close: 'Cerrar',
      copy: 'Copiar',
      copied: 'Copiado',
      loadError: 'No pudimos cargar esta página. Intenta de nuevo.',
      skip: 'Ir al contenido',
    },
    nav: {
      label: 'Aplicación',
      newVideo: 'Nuevo video',
      library: 'Biblioteca',
      billing: 'Facturación',
      settings: 'Ajustes',
      support: 'Soporte',
      buyCredits: 'Comprar créditos',
      openMenu: 'Abrir menú',
      openLibrary: 'Abrir biblioteca',
    },
    account: {
      menu: 'Menú de cuenta',
      logout: 'Cerrar sesión',
    },
    credits: {
      freeLeft: 'Te quedan {left} de {total} videos gratis',
      count: '{n} créditos | {n} crédito | {n} créditos',
    },
    dates: {
      today: 'Hoy, {time}',
      yesterday: 'Ayer',
    },
    status: {
      ready: 'Listo',
      processing: 'Procesando',
      failed: 'Falló',
      refunded: 'crédito devuelto',
    },
    outputs: {
      chapters: { title: 'Capítulos', description: 'Listos para pegar en YouTube' },
      transcript: { title: 'Transcripción', description: 'Copia, busca o descarga en .docx' },
      subtitles: { title: 'Subtítulos', description: 'Archivos SRT y VTT' },
    },
    audioLanguage: {
      label: 'Idioma del audio',
      auto: 'Detectar automáticamente',
    },
    upload: {
      dropTitle: 'Suelta aquí tu video o audio',
      dropRowTitle: 'Suelta un video o audio para empezar',
      formats: 'MP4, MOV, WebM, MP3, WAV, M4A · hasta 500 MB',
      formatsCredit: 'MP4, MOV, WebM, MP3, WAV, M4A · hasta 500 MB · 1 crédito por video',
      choose: 'Elegir archivo',
      uploading: 'Subiendo · {percent}%',
      uploaded: 'Subido',
      startingTitle: 'Iniciando tu video',
      startingLead: 'Terminando la subida. En un momento verás el progreso.',
      failed: 'La subida falló. Revisa tu conexión e intenta de nuevo.',
      failedTitle: 'La subida no terminó',
      failedLead: 'No se cobró nada. Intenta de nuevo con el mismo archivo.',
    },
    gate: {
      emailTitle: '¿A dónde te enviamos tus capítulos?',
      emailLead: 'Tus 2 videos gratis quedan asociados a tu email. Te enviamos un código de 6 dígitos para confirmarlo. Mientras tanto, tu archivo sigue subiendo.',
      emailLabel: 'Email',
      emailPlaceholder: "tu{'@'}email.com",
      sendCode: 'Enviar código',
      sending: 'Enviando…',
      noPassword: 'Sin contraseña. Sin spam.',
      codeTitle: 'Revisa tu correo',
      codeLead: 'Enviamos un código a {email}. El procesamiento empieza apenas lo confirmes.',
      codeLabel: 'Código de verificación',
      digit: 'Dígito {n}',
      confirm: 'Confirmar y generar',
      verifying: 'Verificando…',
      changeEmail: 'Cambiar email',
      resend: 'Reenviar código',
      resendIn: 'Reenviar en {s} s',
      errors: {
        generic: 'Algo salió mal. Intenta de nuevo.',
        invalid_email: 'Ingresa un email válido.',
        disposable_email: 'Usa un email permanente, no una casilla temporal.',
        rate_limited: 'Pediste demasiados códigos. Espera un minuto e intenta de nuevo.',
        email_failed: 'No pudimos enviar el correo. Intenta de nuevo en un momento.',
        invalid: 'Ese código no es correcto. Revisa el último correo que te enviamos.',
        invalid_code: 'Ingresa el código de 6 dígitos.',
        expired: 'Ese código venció. Pide uno nuevo.',
        too_many_attempts: 'Demasiados intentos. Pide un código nuevo.',
      },
    },
    login: {
      metaTitle: 'Iniciar sesión — ChapterGen',
      title: 'Inicia sesión en ChapterGen',
      lead: 'Ingresa tu email y te enviamos un código de 6 dígitos. No hace falta contraseña.',
      confirm: 'Iniciar sesión',
      checking: 'Revisando tu sesión…',
      invalidLink: 'Ese enlace de acceso venció. Ingresa tu email para recibir un código.',
      noAccount: '¿Eres nuevo?',
      tryFree: 'Prueba 2 videos gratis',
    },
    newVideo: {
      metaTitle: 'Nuevo video — ChapterGen',
      firstTitle: 'Hagamos tu primer video',
      title: 'Sube un video nuevo',
      explainer: 'Un crédito te da capítulos, transcripción y subtítulos',
      oneCredit: '1 crédito = 1 video',
      chapter1: 'Intro',
      chapter2: 'Preparación',
      chapter3: 'Resultados',
      subLine1: 'Hola de nuevo,',
      subLine2: 'empecemos.',
    },
    library: {
      metaTitle: 'Biblioteca — ChapterGen',
      subtitle: 'Todavía no hay videos | 1 video · capítulos, transcripción y subtítulos | {n} videos · capítulos, transcripción y subtítulos de cada uno',
      filterLabel: 'Filtrar videos',
      filters: { all: 'Todos', ready: 'Listos', processing: 'En proceso', failed: 'Fallidos' },
      search: 'Buscar videos',
      noMatches: 'Ningún video coincide con este filtro.',
      purchased: 'Pago recibido. Sumamos {n} créditos a tu cuenta.',
      columns: {
        name: 'Nombre',
        duration: 'Duración',
        language: 'Idioma',
        created: 'Creado',
        status: 'Estado',
      },
    },
    processing: {
      steps: {
        upload: 'Subida',
        extracting: 'Extraer audio',
        transcribing: 'Transcribir',
        generating: 'Escribir capítulos',
      },
      state: { done: 'Listo', active: 'En curso', todo: 'Pendiente' },
      done: 'Listo',
      inProgress: 'En curso…',
      languageDetected: 'Idioma: {language}',
      emailNote: 'Puedes salir de esta página. Te avisamos a {email} cuando esté listo.',
      youGet: 'Lo que vas a recibir',
    },
    video: {
      processed: 'procesado {when}',
      downloadAll: 'Descargar todo (.zip)',
      notFoundTitle: 'No encontramos este video',
      notFoundBody: 'Puede pertenecer a otra cuenta, o el enlace no es correcto.',
      backToLibrary: 'Volver a la biblioteca',
      uploadAnother: 'Subir otro archivo',
      creditReturned: 'El crédito de este video volvió a tu cuenta.',
      wrongLanguage: '¿Idioma incorrecto?',
      retranscribing: 'Transcribiendo de nuevo en {language}…',
      retranscribeFailed: 'No pudimos transcribirlo de nuevo: {error} Tu resultado anterior sigue aquí.',
      retranscribe: {
        title: 'Transcribir de nuevo en otro idioma',
        lead: 'Elige el idioma que se habla en el video. Reemplazamos la transcripción, los capítulos y los subtítulos.',
        language: 'Idioma que se habla en el video',
        choose: 'Elige un idioma',
        free: 'Gratis, una vez por video.',
        submit: 'Transcribir de nuevo',
        cancel: 'Cancelar',
      },
      failure: {
        no_speech: {
          title: 'No detectamos voz',
          body: 'No escuchamos a nadie hablando en este archivo. Revisa que tenga pista de voz e intenta de nuevo.',
        },
        no_audio: {
          title: 'El archivo no tiene audio',
          body: 'El archivo solo tiene imagen, así que no hay nada que transcribir. Las descargas de YouTube suelen venir separadas en video y audio; sube un archivo que incluya sonido.',
        },
        audio_too_large: {
          title: 'El archivo es demasiado largo',
          body: 'El audio es demasiado pesado para transcribirlo. Prueba dividirlo en partes más cortas.',
        },
        duration_over_free_limit: {
          title: 'Dura más de 20 minutos',
          body: 'Los videos gratis pueden durar hasta 20 minutos. Compra créditos para procesar videos de cualquier duración.',
        },
        insufficient_credits: {
          title: 'No tienes créditos suficientes',
          body: 'Este video necesita un crédito y tu saldo está vacío.',
        },
        generic: {
          title: 'Algo salió mal',
          body: 'No pudimos terminar de procesar este archivo. Prueba subirlo de nuevo, o escríbenos si sigue fallando.',
        },
      },
    },
    tabs: {
      label: 'Resultados',
      chapters: 'Capítulos',
      transcript: 'Transcripción',
      subtitles: 'Subtítulos',
      words: '{n} palabras',
    },
    chapters: {
      editHint: 'Haz clic en un tiempo o título para editarlo · los cambios se guardan solos',
      saving: 'Guardando…',
      saved: 'Guardado',
      saveError: 'No se pudo guardar. Revisa los tiempos (por ejemplo 1:05).',
      refine: 'Mejorar con IA',
      copy: 'Copiar para YouTube',
      refining: 'Reescribiendo capítulos…',
      refinesLeft: 'No te quedan mejoras con IA en este video gratis | Te queda 1 mejora con IA en este video gratis | Te quedan {n} mejoras con IA en este video gratis',
      timeLabel: 'Tiempo del capítulo {n}',
      titleLabel: 'Título del capítulo {n}',
      remove: 'Quitar capítulo {n}',
      add: 'Agregar capítulo',
      checkTitle: 'Chequeo de YouTube',
      rules: {
        zero: 'Empieza en 0:00',
        count: '{n} capítulos (mínimo 3)',
        length: 'Cada capítulo dura 10 segundos o más',
        order: 'Los tiempos están en orden',
      },
      previewTitle: 'Vista previa de la descripción',
      pasteHelp: 'Pégalo en YouTube Studio → Detalles → Descripción. Desactiva los capítulos automáticos para que YouTube mantenga los tuyos.',
      downloadTxt: 'Descargar .txt',
    },
    transcript: {
      search: 'Buscar en la transcripción',
      copy: 'Copiar texto',
      matches: 'Sin coincidencias | 1 coincidencia | {n} coincidencias',
      noMatches: 'Nada coincide con tu búsqueda.',
      display: 'Visualización',
      groupByChapter: 'Agrupar por capítulo',
      showTimestamps: 'Mostrar tiempos',
      words: '{n} palabras',
      reuseTitle: 'Reutilízala',
      reuseBody: 'Convierte la transcripción en un post, notas del episodio o un newsletter. Descárgala en .docx para editarla en Google Docs o Word.',
    },
    subtitles: {
      format: 'Formato de subtítulos',
      download: 'Descargar .{ext}',
      settings: 'Ajustes de subtítulos',
      maxChars: 'Máximo de caracteres por línea',
      maxLines: 'Máximo de líneas por subtítulo',
      settingsHelp: '42 caracteres y 2 líneas es el estándar habitual para YouTube y TV.',
      youtubeTitle: 'Súbelos a YouTube',
      youtubeHelp: 'YouTube Studio → Subtítulos → Agregar idioma → Subir archivo → Con tiempos. También funciona en Vimeo, Premiere Pro y CapCut.',
    },
    billing: {
      metaTitle: 'Facturación — ChapterGen',
      history: 'Historial de compras',
      noPayments: 'Todavía no hay compras.',
      date: 'Fecha',
      description: 'Paquete',
      credits: 'Créditos',
      amount: 'Importe',
      refunded: 'reembolsado',
    },
    settings: {
      metaTitle: 'Ajustes — ChapterGen',
      account: 'Cuenta',
      email: 'Email',
      memberSince: 'Miembro desde',
      signIn: 'Inicio de sesión',
      signInValue: 'Código enviado a tu email. Sin contraseña.',
      language: 'Idioma',
      languageHelp: 'Se usa en la aplicación y en los correos que te enviamos.',
      session: 'Sesión',
      deleteTitle: 'Borrar cuenta y datos',
      deleteHelp: 'Borramos tu cuenta, transcripciones y capítulos en un plazo de 30 días. Los créditos sin usar se pierden.',
      deleteCta: 'Pedir el borrado',
      deleteSubject: 'Borrar mi cuenta de ChapterGen',
      deleteBody: 'Por favor borren mi cuenta de ChapterGen ({email}) y todos sus datos.',
    },
  },
  landings: {
    transcript: {
      meta: {
        title: "Video a texto: transcribe video y audio con IA {'|'} ChapterGen",
        description:
          'Transcribe cualquier video o audio a texto en más de 90 idiomas, con marcas de tiempo, buscador y .docx. Sin enlace de YouTube. 2 videos gratis.',
      },
      hero: {
        badge: 'Funciona con archivos privados y sin publicar',
        title: 'Transcribe video a texto, directo desde el archivo',
        subtitle:
          'Sube un video o audio y obtén la transcripción completa con marcas de tiempo, lista para copiar o descargar en .txt o .docx. Incluye capítulos y subtítulos.',
      },
      showcase: {
        eyebrow: 'Lo que obtienes',
        title: 'Una transcripción que se lee bien',
        intro: 'Cada palabra sale del audio real, dividida en párrafos y agrupada bajo títulos de capítulo.',
        bullets: [
          'Marcas de tiempo en cada línea, o párrafos limpios',
          'Busca en toda la transcripción en un segundo',
          'Descárgala en .txt o .docx para Google Docs y Word',
        ],
      },
      sample: {
        fileName: 'entrevista-maria.mp4',
        label: 'Ejemplo de transcripción',
        lines: [
          ['0:00', 'Gracias por invitarme. Empecé la empresa casi por accidente, hace cinco años.'],
          ['0:07', 'Éramos tres personas trabajando en una mesa de cocina, y nuestro primer producto fracasó.'],
          ['0:14', 'Lo que nos salvó fue hablar con clientes todas las semanas, aunque doliera.'],
          ['0:21', 'Ese hábito sigue siendo lo más importante que hacemos hoy.'],
        ],
      },
      howItWorks: {
        eyebrow: 'Cómo funciona',
        title: 'Cómo transcribir un video a texto',
        intro: 'Sin enlace de YouTube y sin instalar nada. Funciona con archivos de tu computadora.',
        steps: [
          {
            title: 'Sube tu archivo',
            description: 'MP4, MOV, WebM, MKV, MP3, WAV, M4A y más, hasta 500 MB.',
          },
          {
            title: 'La IA lo transcribe',
            description:
              'Transcribimos el audio con Whisper de OpenAI. El idioma se detecta solo, entre más de 90.',
          },
          {
            title: 'Copia o descarga',
            description: 'Copia el texto, búscalo o descárgalo en .txt o .docx. Incluye capítulos y subtítulos.',
          },
        ],
      },
      useCases: {
        eyebrow: 'Casos de uso',
        title: 'Qué transcribe la gente',
        items: [
          { title: 'Entrevistas', description: 'Cita a tus invitados palabra por palabra y encuentra cualquier respuesta con el buscador.' },
          { title: 'Podcasts', description: 'Convierte cada episodio en notas, un post o un newsletter.' },
          { title: 'Clases y cursos', description: 'Dales a tus alumnos una versión legible y buscable de cada clase.' },
          { title: 'Reuniones y webinars', description: 'Guarda un registro escrito de lo que se dijo, con marcas de tiempo.' },
        ],
      },
      faq: {
        title: 'Transcripción — Preguntas frecuentes',
        items: [
          {
            question: '¿Cómo paso un video a texto?',
            answer:
              'Sube el archivo de video a ChapterGen. Extraemos el audio, lo transcribimos y te damos el texto completo con marcas de tiempo. Puedes copiarlo o descargarlo en .txt o .docx.',
          },
          {
            question: '¿Qué idiomas admite?',
            answer: 'Más de 90, detectados automáticamente, entre ellos español, inglés, portugués, francés y alemán.',
          },
          {
            question: '¿Puedo transcribir un video de YouTube privado o sin publicar?',
            answer: 'Sí. Subes el archivo, así que el video nunca necesita ser público.',
          },
          {
            question: '¿Funciona con archivos de audio?',
            answer: 'Sí: MP3, WAV, M4A, AAC, OGG y FLAC funcionan igual que un video.',
          },
          {
            question: '¿Cuánto cuesta?',
            answer:
              'Tus primeros 2 videos son gratis (hasta 20 minutos cada uno) al confirmar tu email. Después, los paquetes de créditos empiezan en $5 por 5 videos, sin suscripción. Cada crédito incluye transcripción, capítulos y subtítulos.',
          },
          {
            question: '¿Qué pasa con mi archivo?',
            answer: 'El archivo se elimina de nuestros servidores después de procesarlo. La transcripción queda en tu biblioteca para que vuelvas cuando quieras.',
          },
        ],
      },
      finalCta: {
        title: 'Convierte tu próximo video en texto.',
        subtitle: 'Pruébalo gratis con 2 videos. Incluye capítulos y subtítulos.',
        cta: 'Transcribir un archivo',
      },
    },
    subtitles: {
      meta: {
        title: "Generador de subtítulos con IA: SRT y VTT {'|'} ChapterGen",
        description:
          'Genera subtítulos SRT y VTT desde cualquier video o audio, con líneas legibles, listos para YouTube, Premiere y CapCut. 2 videos gratis.',
      },
      hero: {
        badge: 'SRT y VTT, listos para subir',
        title: 'Generador de subtítulos SRT y VTT con IA',
        subtitle:
          'Sube un video o audio y descarga subtítulos SRT o VTT con líneas fáciles de leer. Incluye capítulos y la transcripción completa.',
      },
      showcase: {
        eyebrow: 'Lo que obtienes',
        title: 'Subtítulos fáciles de leer',
        intro: 'Los tiempos salen del audio real, y cada subtítulo se divide en líneas cortas y parejas.',
        bullets: [
          'SRT o VTT, en un clic',
          'Elige caracteres por línea y líneas por subtítulo',
          'Funcionan en YouTube, Vimeo, Premiere Pro y CapCut',
        ],
      },
      sample: {
        fileName: 'tutorial-color.srt',
        label: 'Ejemplo de SRT',
        lines: [
          ['1', '00:00:00,000 --> 00:00:03,200', 'Bienvenidos. Hoy vamos a corregir\nel color de este clip desde cero.'],
          ['2', '00:00:03,200 --> 00:00:06,450', 'Primero, ajusta el balance de blancos\nantes de tocar cualquier color.'],
          ['3', '00:00:06,450 --> 00:00:09,900', 'Después, baja un poco\nlas sombras.'],
        ],
      },
      howItWorks: {
        eyebrow: 'Cómo funciona',
        title: 'Cómo generar subtítulos para un video',
        intro: 'Funciona con el archivo de tu computadora, antes o después de publicar.',
        steps: [
          {
            title: 'Sube tu video',
            description: 'MP4, MOV, WebM, MKV o archivos de audio, hasta 500 MB.',
          },
          {
            title: 'La IA escribe los subtítulos',
            description:
              'Transcribimos el audio y lo dividimos en subtítulos con el largo de línea que elijas (42 caracteres y 2 líneas por defecto).',
          },
          {
            title: 'Descarga SRT o VTT',
            description: 'Súbelo a YouTube Studio, Vimeo o tu editor. Los tiempos ya están puestos.',
          },
        ],
      },
      useCases: {
        eyebrow: 'Casos de uso',
        title: 'Dónde ayudan los subtítulos',
        items: [
          { title: 'Videos de YouTube', description: 'Sube un SRT con tiempos para que se pueda ver sin sonido.' },
          { title: 'Clips para redes', description: 'Quema los subtítulos en CapCut o Premiere para Reels, Shorts y TikTok.' },
          { title: 'Cursos', description: 'Haz cada clase más accesible y fácil de seguir.' },
          { title: 'Traducciones', description: 'Parte de un SRT preciso y tradúcelo, en lugar de escribir desde cero.' },
        ],
      },
      faq: {
        title: 'Subtítulos — Preguntas frecuentes',
        items: [
          {
            question: '¿Cómo agrego subtítulos a un video de YouTube?',
            answer:
              'Descarga el SRT y ve a YouTube Studio → Subtítulos → Agregar idioma → Subir archivo → Con tiempos, y elige el archivo.',
          },
          {
            question: '¿Qué diferencia hay entre SRT y VTT?',
            answer:
              'Los dos guardan subtítulos con sus tiempos. SRT es el formato más compatible; VTT es el estándar web que usan los reproductores HTML5. YouTube acepta ambos.',
          },
          {
            question: '¿Puedo cambiar el largo de las líneas?',
            answer: 'Sí. Elige el máximo de caracteres por línea y de líneas por subtítulo, y la vista previa se actualiza antes de descargar.',
          },
          {
            question: '¿Qué idiomas admite?',
            answer: 'Más de 90, detectados automáticamente. Los subtítulos salen en el idioma que se habla en el video.',
          },
          {
            question: '¿Cuánto cuesta?',
            answer:
              'Tus primeros 2 videos son gratis (hasta 20 minutos cada uno) al confirmar tu email. Después, los paquetes de créditos empiezan en $5 por 5 videos. Cada crédito incluye subtítulos, transcripción y capítulos.',
          },
        ],
      },
      finalCta: {
        title: 'Subtítulos para tu próximo video, en minutos.',
        subtitle: 'Pruébalo gratis con 2 videos. Incluye transcripción y capítulos.',
        cta: 'Generar subtítulos',
      },
    },
  },
}
