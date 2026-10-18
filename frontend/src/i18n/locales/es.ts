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
        'Sube un video o audio y obtén capítulos de YouTube con marcas de tiempo y títulos optimizados para SEO. Sin URL pública — funciona antes de publicar. 2 videos gratis, sin contraseña.',
    },
    hero: {
      badge: 'Funciona con videos privados y sin publicar',
      title: 'Capítulos de YouTube con IA, listos antes de publicar',
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
          name: 'Gratis',
          price: '$0',
          features: ['2 videos', 'Hasta 20 minutos cada uno', 'Solo confirma tu email'],
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
      title: 'Generador de Capítulos de Podcast con IA — Marcas de Tiempo desde tu Audio',
      description:
        'Sube tu episodio de podcast y obtén capítulos con marcas de tiempo generados con IA. Funciona con MP3, WAV y episodios de cualquier duración. Gratis para probar.',
    },
    hero: {
      badge: 'Enfocado en audio · Cualquier duración · Gratis',
      title: 'Generador de Capítulos de Podcast con IA — Sube tu Audio y Obtén Capítulos con Marcas de Tiempo',
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
        'Prueba 2 videos gratis y compra créditos cuando necesites más. Sin suscripción. Starter $5 por 5 videos, Creator $12 por 15. Cada video incluye capítulos, transcripción y subtítulos.',
    },
    eyebrow: 'Precios',
    title: 'Pagas por video. Sin suscripción.',
    subtitle: 'Empieza con 2 videos gratis. Compra créditos solo cuando necesites más; no vencen.',
    bestValue: 'Mejor valor',
    oneTime: 'pago único',
    unit: '{n} videos · {price} por video',
    buy: 'Comprar {name}',
    plans: {
      free: {
        name: 'Gratis',
        unit: '2 videos para probarlo',
        cta: 'Empezar gratis',
        features: [
          '2 videos, de hasta 20 minutos cada uno',
          'Capítulos, transcripción y subtítulos',
          '2 mejoras de títulos con IA por video',
          'Sin tarjeta, solo confirma tu email',
        ],
      },
      starter: {
        features: [
          '5 videos de cualquier duración, hasta 500 MB',
          'Capítulos, transcripción y subtítulos',
          'Mejoras de títulos con IA ilimitadas',
          'Descargas: .txt, .docx, SRT, VTT, .zip',
          'Los créditos no vencen',
        ],
      },
      creator: {
        features: [
          '15 videos de cualquier duración, hasta 500 MB',
          'Capítulos, transcripción y subtítulos',
          'Mejoras de títulos con IA ilimitadas',
          'Descargas: .txt, .docx, SRT, VTT, .zip',
          'Los créditos no vencen',
        ],
      },
    },
    packs: {
      starter: { name: 'Starter' },
      creator: { name: 'Creator' },
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
    subtitle: 'Escribinos y te respondemos al email de la cuenta.',
    email: 'Email',
    subject: 'Asunto',
    subjectPlaceholder: '¿En qué te podemos ayudar?',
    message: 'Mensaje',
    messagePlaceholder: 'Cuéntanos qué necesitas…',
    submit: 'Enviar',
    sending: 'Enviando…',
    sent: 'Listo — recibimos tu mensaje y te respondemos por email.',
    sendError: 'No se pudo enviar el mensaje. Intenta de nuevo.',
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
      freeLeft: 'No te quedan videos gratis | Te queda 1 video gratis | Te quedan {n} videos gratis',
      creditsLeft: 'No te quedan créditos | Te queda 1 crédito | Te quedan {n} créditos',
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
      failure: {
        no_speech: {
          title: 'No detectamos voz',
          body: 'No escuchamos a nadie hablando en este archivo. Revisa que tenga pista de voz e intenta de nuevo.',
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
        title: 'Video a Texto — Transcribe Video y Audio con IA',
        description:
          'Transcribe cualquier video o audio a texto: MP4, MOV, MP3, WAV y más, en más de 90 idiomas. Con marcas de tiempo, buscador y exportación a .docx. Sin URL pública. 2 videos gratis.',
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
        title: 'Generador de Subtítulos — Crea Subtítulos SRT y VTT desde tu Video con IA',
        description:
          'Genera subtítulos SRT y VTT desde cualquier video o audio. Líneas de largo legible, más de 90 idiomas, listos para YouTube, Vimeo, Premiere y CapCut. 2 videos gratis.',
      },
      hero: {
        badge: 'SRT y VTT, listos para subir',
        title: 'Genera subtítulos desde tu video con IA',
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
