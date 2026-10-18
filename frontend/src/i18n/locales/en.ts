export default {
  common: {
    nav: {
      tryFree: 'Try it free',
      homeLabel: 'ChapterGen home',
      mainLabel: 'Main navigation',
      mobileLabel: 'Mobile navigation',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      product: 'Product',
      tryFreeShort: 'Try free',
      tryFreeMobile: 'Generate chapters free',
      productMenu: {
        youtube: {
          title: 'YouTube chapter generator',
          description: 'Timestamps from any video file, before you publish.',
        },
        podcast: {
          title: 'Podcast chapter generator',
          description: 'Chapters from audio for YouTube, Spotify and show notes.',
        },
        transcript: {
          title: 'Video to text',
          description: 'Transcribe any video or audio file, with timestamps.',
        },
        subtitles: {
          title: 'Subtitle generator',
          description: 'SRT and VTT subtitles with readable lines.',
        },
      },
      useCases: 'Use cases',
      faq: 'FAQ',
      podcast: 'Podcasts',
      pricing: 'Pricing',
      login: 'Log in',
      dashboard: 'Dashboard',
      myChapters: 'My Chapters',
      buyCredits: 'Buy Credits',
      settings: 'Settings',
      billing: 'Billing',
      support: 'Support',
      accountMenu: 'Account menu',
      logout: 'Log out',
      credits: '{count} credits',
    },
    footer: {
      tagline: 'AI YouTube chapter generator for videos and podcasts. Upload the file, get timestamps in YouTube format.',
      productHeading: 'Product',
      youtubeChapters: 'YouTube Chapters',
      podcastChapters: 'Podcast Chapters',
      videoToText: 'Video to Text',
      subtitleGenerator: 'Subtitle Generator',
      companyHeading: 'Company',
      about: 'About',
      privacy: 'Privacy',
      terms: 'Terms',
      contact: 'Contact',
      languageHeading: 'Language',
      rights: 'All rights reserved.',
    },
    language: {
      label: 'Language',
      en: 'English',
      es: 'Español',
    },
  },
  home: {
    meta: {
      title: "AI YouTube Chapter Generator — Free Timestamps {'|'} ChapterGen",
      description:
        'Upload a video or audio file and get YouTube chapters with timestamps and SEO-ready titles, even before publishing. Try 2 videos free, no credit card.',
    },
    hero: {
      badge: 'Works on private and unpublished videos',
      title: 'AI YouTube Chapter Generator — Get Timestamps in Seconds',
      subtitle:
        "Upload a video or audio file and get clean, SEO-ready timestamps in YouTube's exact format. No public URL needed.",
    },
    audience: {
      label: 'Built for long-form creators',
      items: ['Tutorials', 'Podcasts', 'Interviews', 'Webinars & courses', 'Reviews & vlogs'],
    },
    showcase: {
      eyebrow: 'What you get',
      title: 'Chapters you can paste straight into YouTube',
      intro: 'Every chapter comes from the real audio, with a title that describes what is actually said.',
      bullets: [
        "Starts at 0:00 and follows YouTube's chapter rules",
        'Descriptive titles you can edit or refine with AI',
        'One click to copy into your description',
      ],
      preview: {
        fileName: 'episode-42-final.mp4',
        duration: '48:12',
        label: 'Example output',
        copy: 'Copy for YouTube',
        refine: 'Refine titles',
        activeIndex: 3,
        chapters: [
          { time: '0:00', title: 'Intro: why chapters matter' },
          { time: '1:42', title: 'Setting up the recording' },
          { time: '6:15', title: 'Editing the rough cut' },
          { time: '14:08', title: 'Color grading on a budget' },
          { time: '22:37', title: 'Exporting for YouTube' },
          { time: '31:50', title: 'Q&A and wrap-up' },
        ],
      },
    },
    howItWorks: {
      eyebrow: 'How it works',
      title: 'How to generate YouTube chapters with AI',
      intro:
        'No need to upload to YouTube first. ChapterGen works with drafts, private videos and plain audio files.',
      steps: [
        {
          title: 'Upload your file',
          description:
            'Drag in a video or audio file. Raw exports, drafts, private recordings and podcast audio all work.',
        },
        {
          title: 'AI finds the topics',
          description:
            'We transcribe the audio, detect where the topic changes and write a clear, descriptive title for each section.',
        },
        {
          title: 'Copy and paste',
          description:
            "Paste the list into your description in YouTube Studio. It's already in YouTube's required format, starting at 0:00.",
        },
      ],
    },
    why: {
      eyebrow: 'Why ChapterGen',
      title: "Better than YouTube's automatic chapters",
      intro:
        'YouTube\'s auto-chapters often cut mid-sentence, miss topic transitions and produce generic titles like "Section 1". ChapterGen follows what is actually said, and you can edit every chapter before the video goes live.',
      outro:
        "Tip: turn off automatic chapters in YouTube Studio (Advanced settings → Allow automatic chapters) so YouTube doesn't replace yours.",
      colYoutube: 'YouTube auto',
      colChaptergen: 'ChapterGen',
      yes: 'Yes',
      no: 'No',
      bullets: [
        {
          title: 'Unpublished videos',
          description: 'Your description is ready from minute one.',
        },
        {
          title: 'Private & unlisted',
          description: 'You never need a public URL.',
        },
        {
          title: 'Audio only',
          description: 'Podcasts, interviews and voice recordings.',
        },
        {
          title: 'Any language',
          description: 'Detected automatically, 90+ languages supported.',
        },
      ],
      rows: [
        { feature: 'Chapter titles', youtube: 'Generic', chaptergen: 'From your content' },
        { feature: 'Edit before publishing', youtube: 'no', chaptergen: 'yes' },
        { feature: 'Unpublished videos', youtube: 'no', chaptergen: 'yes' },
        { feature: 'Audio & podcasts', youtube: 'no', chaptergen: 'yes' },
        { feature: 'Your own keywords', youtube: 'no', chaptergen: 'yes' },
      ],
    },
    seoBenefits: {
      eyebrow: 'Why chapters',
      title: 'One of the most underused SEO levers on YouTube',
      intro: "Chapters aren't just convenient for viewers. They help your video get found and watched.",
      bullets: [
        {
          title: 'Key Moments in Google',
          description:
            'Videos with chapters can show clickable sections in Google results and take up more space on the page.',
        },
        {
          title: 'Higher engagement',
          description:
            'Large-scale analyses of YouTube videos show that videos with chapters get better like and comment ratios.',
        },
        {
          title: 'Better retention',
          description:
            'Viewers who can jump to what they need stay longer, rewatch and come back — signals the algorithm rewards.',
        },
        {
          title: 'Searchable metadata',
          description:
            'Every chapter title is text YouTube indexes, so descriptive titles help your video rank for more searches.',
        },
      ],
    },
    useCases: {
      eyebrow: 'Use cases',
      title: 'Built for every kind of long-form content',
      items: [
        {
          title: 'Tutorials & how-tos',
          description:
            'Let viewers jump straight to the step they need, and come back to your video as a reference.',
        },
        {
          title: 'Podcasts & interviews',
          description: 'One chapter per question or topic, from the audio file alone.',
          link: '/podcast-chapters',
          linkLabel: 'Podcast chapter generator →',
        },
        {
          title: 'Webinars & courses',
          description: 'Turn a two-hour recording into a lesson people can navigate.',
        },
        {
          title: 'Reviews & vlogs',
          description: 'Highlight each product or moment so nobody scrolls away.',
        },
      ],
    },
    pricing: {
      eyebrow: 'Pricing',
      title: 'Pay per video. No subscription.',
      plans: [
        {
          name: 'Starter',
          price: '$5',
          unit: '5 videos',
          features: ['$1.00 per video', 'Any length, up to 500 MB', 'Chapters, transcript and subtitles'],
          cta: 'Buy Starter',
        },
        {
          name: 'Creator',
          price: '$12',
          unit: '15 videos',
          badge: 'Most popular',
          features: ['$0.80 per video', 'Any length, up to 500 MB', 'Chapters, transcript and subtitles'],
          cta: 'Buy Creator',
          featured: true,
        },
        {
          name: 'Studio',
          price: '$35',
          unit: '60 videos',
          badge: 'Best value',
          features: ['$0.58 per video', 'Any length, up to 500 MB', 'Chapters, transcript and subtitles'],
          cta: 'Buy Studio',
        },
      ],
      trial: '2 videos free to try it · no credit card',
      trialCta: 'Start free',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Questions, answered',
      aside: 'Something else?',
      contact: 'Email us',
      items: [
        {
          question: 'How do I add chapters to a YouTube video?',
          answer:
            'Copy the generated chapter list and paste it into your video description in YouTube Studio. YouTube automatically detects the format and turns it into clickable chapters on the progress bar.',
        },
        {
          question: "Why aren't my chapters showing up on YouTube?",
          answer:
            'YouTube has three strict rules: the first timestamp must be exactly 0:00, you need at least 3 chapters, and each chapter must be at least 10 seconds long. ChapterGen formats everything correctly by default, so this never happens with our output.',
        },
        {
          question: 'Can ChatGPT or Claude generate YouTube chapters from my video?',
          answer:
            "Not reliably. Chat assistants can't listen to a long video file: uploads are rejected or too large, and without a real transcript the timestamps they return are guesses. ChapterGen transcribes the audio first, so every timestamp matches what is actually said.",
        },
        {
          question: 'Do I need a YouTube URL to use this?',
          answer:
            "No — that's the whole point. You upload the video or audio file directly, so it works with unpublished, private, and unlisted videos.",
        },
        {
          question: 'Can I generate chapters from audio only?',
          answer:
            'Yes. MP3, WAV, M4A and other audio formats are fully supported. Perfect for podcasts.',
        },
        {
          question: 'What file formats and sizes are supported?',
          answer:
            'MP4, MOV, AVI, WebM, MKV, MP3, WAV, M4A, AAC, OGG, and FLAC — up to 500 MB per file.',
        },
        {
          question: 'Is it free?',
          answer:
            'You get 2 videos free (up to 20 minutes each) when you confirm your email. No password, no card. After that, buy a credit pack — Starter is $5 for 5 videos, Creator is $12 for 15. No subscription.',
        },
        {
          question: 'Can I edit the chapters before using them?',
          answer: 'Yes — every title and timestamp is editable before you copy the final result.',
        },
        {
          question: 'Does it work in languages other than English?',
          answer:
            'Yes. Our AI uses Whisper, which auto-detects language and works with 90+ languages.',
        },
      ],
    },
    finalCta: {
      title: 'Your next upload deserves chapters.',
      subtitle: 'Try it on 2 videos for free. No password, no card.',
      cta: 'Generate chapters',
    },
    schema: {
      softwareDescription:
        'AI YouTube chapter generator. Upload a video or audio file and get SEO-ready timestamps in YouTube format, even before the video is published.',
      howToName: 'How to Generate YouTube Chapters with AI',
    },
  },
  podcast: {
    meta: {
      title: "AI Podcast Chapter Generator — Free Timestamps {'|'} ChapterGen",
      description:
        'Upload your episode and get timestamped chapters for YouTube, Spotify and show notes. MP3, WAV, M4A, any length. Try 2 episodes free, no credit card.',
    },
    hero: {
      badge: 'Audio-first · Any length · Free',
      title: 'AI podcast chapter generator for your audio files',
      subtitle:
        'Drop in your episode file — MP3, WAV, M4A — and get clean chapters with descriptive titles in minutes. Built for interviews, solo shows, and episodes of any length.',
    },
    platforms: {
      title: 'One Episode, Chapters for Every Platform',
      intro: 'Generate once, use everywhere your podcast lives:',
      items: [
        {
          title: 'YouTube',
          description: 'Paste into your video description for clickable chapters.',
        },
        {
          title: 'Spotify',
          description: 'Spotify supports episode chapters — use the same timestamps.',
        },
        {
          title: 'Apple Podcasts',
          description: 'Add chapters via your hosting platform or publishing tools.',
        },
        {
          title: 'Show notes',
          description:
            'Your chapter list doubles as a ready-made episode outline for your website and newsletter.',
        },
      ],
    },
    showcase: {
      eyebrow: 'What you get',
      title: 'One chapter per topic, from the audio alone',
      intro: 'Upload the episode file and get a timestamped outline you can use on YouTube, Spotify and in your show notes.',
      bullets: [
        'Works with MP3, WAV, M4A and long episodes',
        "Titles that name the topic or the guest's insight",
        'Reuse the list as your show notes',
      ],
      preview: {
        fileName: 'ep-87-interview.mp3',
        duration: '1:12:40',
        label: 'Example output',
        copy: 'Copy chapters',
        refine: 'Refine titles',
        activeIndex: 2,
        chapters: [
          { time: '0:00', title: 'Cold open and guest intro' },
          { time: '4:35', title: 'How the company started' },
          { time: '18:20', title: 'The first 1,000 customers' },
          { time: '37:05', title: 'Hiring the first team' },
          { time: '52:48', title: 'Mistakes worth avoiding' },
          { time: '1:05:10', title: 'Rapid-fire questions' },
        ],
      },
    },
    useCases: {
      title: 'Made for How Podcasters Actually Work',
      items: [
        {
          title: 'Interviews',
          description:
            'One chapter per question or topic, so listeners can jump to the guest insight they came for.',
        },
        {
          title: 'Solo episodes',
          description: 'Turn your talking points into a navigable structure.',
        },
        {
          title: 'Panels & roundtables',
          description: 'Mark each speaker segment or discussion topic.',
        },
        {
          title: 'Long episodes',
          description: '2-hour, 3-hour episodes? No problem — long-form is exactly what chapters are for.',
        },
      ],
    },
    why: {
      title: 'Chapters Turn Listeners into Subscribers',
      description:
        'Podcast listeners increasingly sample before they commit. Chapters let a new listener jump straight to the segment that hooked them from a clip or recommendation — and a listener who finds value fast is a listener who subscribes. On YouTube specifically, chapters also make your episodes searchable and eligible for Key Moments in Google.',
    },
    faq: {
      title: 'Podcast Chapters — FAQ',
      items: [
        {
          question: 'Can I generate chapters from audio only, without video?',
          answer: "Yes — audio files are fully supported. That's what this page is for.",
        },
        {
          question: "What's the maximum episode length?",
          answer:
            'There is no duration limit — only a 500 MB file size cap. Long-form episodes are fully supported.',
        },
        {
          question: 'How do I add chapters to Spotify?',
          answer:
            'Spotify reads chapters embedded in your episode or added through Spotify for Creators. Generate your timestamps here, then add them in your hosting dashboard.',
        },
        {
          question: 'Do chapters work in Apple Podcasts?',
          answer:
            'Yes — Apple Podcasts supports chapters added through your podcast host or tools that embed chapter markers.',
        },
        {
          question: 'Can I use the chapters as show notes?',
          answer:
            'Absolutely — the timestamped outline works as the skeleton of your show notes. Just add links and a summary.',
        },
        {
          question: 'What audio formats do you support?',
          answer: 'MP3, WAV, M4A, AAC, OGG, FLAC, and OPUS — up to 500 MB per file.',
        },
      ],
    },
    crossLink: 'Also works with video → YouTube Chapter Generator',
  },
  tool: {
    uploader: {
      titleVideo: 'Drop your video or audio here',
      titleAudio: 'Drop your episode audio here',
      titleVideoCompact: 'Drop a video or audio, or click to browse',
      titleAudioCompact: 'Drop an audio file, or click to browse',
      hintVideo: 'MP4, MOV, WebM, MP3, WAV, M4A — up to 500 MB',
      hintAudio: 'MP3, WAV, M4A, AAC, OGG, FLAC — up to 500 MB',
      button: 'Generate chapters',
    },
    chapterTool: {
      filesDeleted: 'Files deleted after processing',
      noSignup: '2 free videos, no card needed',
      languages: '90+ languages',
      uploading: 'Uploading file and starting processing…',
      uploadProgress: 'Uploading file… {percent}%',
      uploadChunk: 'Part {current} of {total}',
      uploadRetry: 'Retrying part {current}…',
      uploadFailed: 'Could not upload the file. Please try again.',
      unknownError: 'Unknown error',
      tryAgain: 'Try again',
    },
    processing: {
      headingUploading: 'Uploading file…',
      headingExtracting: 'Extracting audio…',
      headingTranscribing: 'Transcribing audio…',
      headingGenerating: 'Generating chapters…',
      headingRegenerating: 'Refining chapters…',
      headingFallback: 'Processing…',
      subtitleUploading: 'Sending your file to the server',
      subtitleExtracting: 'Preparing audio for transcription',
      subtitleTranscribing: 'listening for topic shifts',
      subtitleGenerating: 'Analyzing transcript structure',
      subtitleRegenerating: 'Applying your refinements',
      stageUploaded: 'Uploaded',
      stageTranscribing: 'Transcribing',
      stageGenerating: 'Generating chapters',
    },
    result: {
      heading: 'Generated timestamps',
      chapters: 'no chapters | {count} chapter | {count} chapters',
      editHint: 'tap any field to edit',
      chapterTimeAria: 'Chapter {n} timestamp',
      chapterTitleAria: 'Chapter {n} title',
      copy: 'Copy',
      copied: 'Copied',
      refine: 'Refine',
      downloadChapters: 'Chapters',
      downloadTranscript: 'Transcript',
      downloadChaptersTitle: 'Download chapters',
      downloadTranscriptTitle: 'Download transcript',
      preview: 'Preview raw text',
    },
    refine: {
      title: 'Refine chapters',
      close: 'Close',
      whatToChange: 'What to change',
      titlesAndCuts: 'Titles and cuts',
      titlesOnly: 'Titles only',
      cutsOnly: 'Cuts only',
      granularity: 'Granularity',
      moreDetailed: 'More detailed',
      balanced: 'Balanced',
      moreGrouped: 'More grouped',
      contentType: 'Content type',
      ctAuto: 'Automatic',
      ctTutorial: 'Tutorial / how-to',
      ctPodcast: 'Podcast / interview',
      ctWebinar: 'Webinar / course',
      ctReview: 'Review / vlog',
      titleStyle: 'Title style',
      tsDescriptive: 'Descriptive',
      tsShort: 'Short (≤40 chars)',
      tsSeo: 'SEO / keywords',
      tsQuestion: 'Question format',
      chapterCount: 'Chapter count',
      automatic: 'Automatic',
      fixedCount: 'Fixed count',
      chaptersLabel: 'Chapters:',
      cancel: 'Cancel',
      submit: 'Refine',
    },
    job: {
      back: '← Back to generator',
      ready: 'Your chapters are ready',
      done: 'Done',
      wentWrong: 'Something went wrong',
      tryAgain: 'Try again',
      errorAudioTooLarge:
        'This file is too long to transcribe (over ~25 MB of audio even after compression). Try a shorter file or split it into parts.',
      errorFreeDuration:
        'Free videos are limited to 20 minutes. Buy credits to process longer files.',
      errorCredits:
        'This file needs more credits than you have left. Buy a pack to continue.',
    },
  },
  pricing: {
    meta: {
      title: 'Pricing — ChapterGen credit packs',
      description:
        'Try 2 videos free, then buy credits when you need more. No subscription. Starter $5 for 5 videos, Creator $12 for 15, Studio $35 for 60. Each video includes chapters, a transcript and subtitles.',
    },
    eyebrow: 'Pricing',
    title: 'Pay per video. No subscription.',
    subtitle: 'Credits never expire. Every video includes chapters, a transcript and subtitles.',
    trial: {
      title: 'Start with a free trial',
      details: '2 videos free · up to 20 minutes each · no credit card',
      cta: 'Start free',
    },
    mostPopular: 'Most popular',
    bestValue: 'Best value',
    save: 'Save {percent}%',
    oneTime: 'one-time',
    unit: '{n} videos · {price} per video',
    buy: 'Buy {name}',
    paidFeatures: [
      '{n} videos of any length, up to 500 MB',
      'Chapters, transcript and subtitles',
      'Unlimited AI title refinements',
      'Downloads: .txt, .docx, SRT, VTT, .zip',
      'Credits never expire',
    ],
    packs: {
      starter: { name: 'Starter' },
      creator: { name: 'Creator' },
      studio: { name: 'Studio' },
    },
    included: {
      title: 'Every video includes',
      chapters: {
        title: 'Chapters',
        description: 'YouTube-ready timestamps with descriptive titles, editable and checked against YouTube’s rules.',
      },
      transcript: {
        title: 'Transcript',
        description: 'The full text with timestamps, searchable and grouped by chapter. Download as .txt or .docx.',
      },
      subtitles: {
        title: 'Subtitles',
        description: 'SRT and VTT files with readable line lengths, ready for YouTube, Vimeo and video editors.',
      },
    },
    faq: {
      title: 'Pricing questions',
      items: [
        {
          question: 'What counts as one video?',
          answer: 'One uploaded file, of any length up to 500 MB. It uses one credit and gives you chapters, a transcript and subtitles.',
        },
        {
          question: 'Do credits expire?',
          answer: 'No. Buy once and use them whenever you want.',
        },
        {
          question: 'Is there a subscription?',
          answer: 'No. Each pack is a one-time payment, processed securely by Stripe.',
        },
        {
          question: 'What if a video fails?',
          answer: 'If processing fails, the credit goes back to your account automatically.',
        },
      ],
    },
    loadError: 'Could not load pricing.',
    checkoutError: 'Could not start checkout. Try again.',
  },
  paywall: {
    title: 'Keep generating chapters',
    lead: 'Buy once, use them anytime.',
    bulletChapters: 'Chapters ready to paste in YouTube',
    bulletTranscript: 'Full transcript (.txt, .docx)',
    bulletSubtitles: 'Subtitles (SRT, VTT)',
    bulletExpire: '1 credit = 1 video. Credits never expire',
    bulletSize: 'Files up to 500 MB, video or audio',
    oneTime: 'One-time payment. No subscription.',
    choose: 'Choose your pack',
    creditsLabel: '{count} credits',
    perCredit: '{price} each',
    savePercent: 'Save {percent}%',
    continue: 'Continue — {price}',
    summary: '{count} credits · {price} each · one-time',
    ssl: 'Encrypted SSL payment · Processed by Stripe',
    redirecting: 'Redirecting…',
    close: 'Close',
    loadError: 'Could not load packs.',
    checkoutError: 'Could not start checkout. Try again.',
    reasonLabel: {
      free_limit: 'Free limit reached',
      credits: 'Not enough credits',
      refine: 'Refine limit reached',
      free_duration: '20-minute free limit',
      buy: 'Buy credits',
      verify: 'Confirm your email',
    },
    reason: {
      free_limit: 'You already used your 2 free videos. Buy credits to keep generating chapters.',
      credits: 'You have no credits left. Load a pack to generate more chapters.',
      refine: 'Free videos include 2 refines. Buy credits for unlimited refine.',
      free_duration: 'Free videos are limited to 20 minutes. Credits remove that cap.',
      buy: 'Buy once, use them anytime.',
      verify: 'Confirm your email to start processing videos.',
    },
  },
  login: {
    metaTitle: 'Log in — ChapterGen',
    title: 'Log in',
    subtitle: 'Enter the email you used at checkout. We will send a sign-in link — no password.',
    email: 'Email',
    placeholder: "you{'@'}example.com",
    submit: 'Send link',
    sending: 'Sending…',
    sent: 'If there is an account for that email, we sent a sign-in link. Check your inbox.',
    sendError: 'Could not send the link. Try again.',
    invalidLink: 'That link is invalid or expired. Request a new one.',
  },
  dashboard: {
    metaTitle: 'Dashboard — ChapterGen',
    title: 'My Chapters',
    subtitle: 'Generate new chapters or open one you already made.',
    loading: 'Loading…',
    loadError: 'Could not load your account.',
    logout: 'Log out',
    credits: 'Credits remaining',
    creditsWord: 'credits',
    buyMore: 'Buy more credits',
    newChapters: 'New chapters',
    history: 'History',
    fileCountOne: '1 file',
    fileCount: '{count} files',
    noHistory: 'No chapters yet.',
    open: 'Open',
    chaptersCount: '{count} chapters',
    status: {
      pending: 'Pending',
      extracting: 'Extracting audio',
      transcribing: 'Transcribing',
      generating: 'Generating',
      regenerating: 'Refining',
      completed: 'Completed',
      failed: 'Failed',
    },
  },
  settings: {
    metaTitle: 'Settings — ChapterGen',
    title: 'Settings',
    subtitle: 'Your account details. Contact us if something needs to change.',
    email: 'Email',
    language: 'Language',
    credits: 'Credits',
    google: 'Google',
    googleConnected: 'Connected',
    googleNotConnected: 'Not connected',
    createdAt: 'Member since',
    lastLogin: 'Last login',
    never: 'Never',
  },
  billing: {
    metaTitle: 'Billing — ChapterGen',
    title: 'Billing',
    subtitle: 'Purchases on this account.',
    payments: 'Payments',
    noPayments: 'No purchases yet.',
  },
  support: {
    title: 'Support',
    subtitle: 'Send us a message and we will reply to your account email.',
    email: 'Email',
    subject: 'Subject',
    subjectPlaceholder: 'How can we help?',
    message: 'Message',
    messagePlaceholder: 'Tell us what you need…',
    submit: 'Send',
    sending: 'Sending…',
    sent: 'Thanks — we got your message and will reply by email.',
    sendError: 'Could not send the message. Try again.',
    close: 'Close',
  },
  pages: {
    updated: 'Last updated: {date}',
    contactLead: 'Questions? Write to',
    about: {
      meta: {
        title: 'About ChapterGen — Why We Built an AI YouTube Chapter Generator',
        description:
          'ChapterGen turns a video or audio file into YouTube chapters. It started when ChatGPT and Claude could not process a long video. Here is why and how it works.',
      },
      eyebrow: 'About',
      title: 'Built because the obvious shortcut did not work',
      intro:
        'ChapterGen is a small, independent tool that turns a video or audio file into YouTube chapters with accurate timestamps and descriptive titles.',
      sections: [
        {
          heading: 'Why ChapterGen exists',
          paragraphs: [
            'I wanted chapters for a long video before publishing it. My first try was the obvious one: upload the file to ChatGPT and Claude and ask for timestamps.',
            'It did not work. The video file was too large to upload, the assistants could not actually listen to the audio, and when I pasted partial text the timestamps that came back were invented. Getting usable chapters still meant transcribing the video, splitting it by topic and checking every timestamp by hand.',
            'So I built a tool that does exactly that, end to end, from the file itself.',
          ],
        },
        {
          heading: 'How it works',
          paragraphs: [
            "ChapterGen extracts the audio from your file and transcribes it with OpenAI's Whisper speech-recognition model, so every timestamp comes from the real audio. A language model then finds where the topic changes and writes a descriptive title for each section.",
            "The output follows YouTube's chapter rules: it starts at 0:00, has at least three chapters, and no chapter is shorter than 10 seconds. You can edit every title before you copy it.",
          ],
        },
        {
          heading: 'What makes it different',
          paragraphs: [
            'Most chapter tools need a public YouTube URL. ChapterGen works from the file, so you can add chapters to drafts, private and unlisted videos, and audio-only podcasts before anything is published.',
            'It supports 90+ languages, files up to 500 MB, and you can try it on 2 videos for free with just your email.',
          ],
        },
        {
          heading: 'Your files',
          paragraphs: [
            'Uploaded files are deleted from our servers after processing. We keep the transcript and the chapters so you can come back to them. The privacy policy explains the details.',
          ],
        },
      ],
      signature: 'Mauricio, founder of ChapterGen',
    },
    privacy: {
      meta: {
        title: 'Privacy Policy — ChapterGen',
        description: 'How ChapterGen handles the files you upload, your account data and payments.',
      },
      eyebrow: 'Legal',
      title: 'Privacy policy',
      updatedDate: 'October 18, 2026',
      intro:
        'This policy explains what ChapterGen collects when you use chaptergen.com, why, and what you can do about it. We collect as little as we can to run the service.',
      sections: [
        {
          heading: 'Files you upload',
          paragraphs: [
            'Video and audio files are uploaded to our server only to extract the audio and generate chapters. The original file is deleted after processing. The extracted audio is kept for 24 hours so you can transcribe it again in another language, then deleted. Incomplete uploads are removed automatically.',
          ],
        },
        {
          heading: 'Transcripts and chapters',
          paragraphs: [
            'We store the transcript, the generated chapters and basic file details (name, size, duration and language) so you can view, edit and copy your results later. They are linked to your account, or to an anonymous ID stored in your browser if you did not sign in.',
          ],
        },
        {
          heading: 'Account and payments',
          paragraphs: [
            'If you sign in, we store your email address to send you sign-in links and to keep your credits. There are no passwords.',
            'Payments are processed by Stripe. We never see or store your card details; we keep a record of each purchase (pack, amount and date).',
          ],
        },
        {
          heading: 'Service providers',
          paragraphs: [
            "Audio is sent to OpenAI's API for transcription, and the transcript is sent to OpenAI to generate chapter titles. Under OpenAI's API terms, this data is not used to train their models.",
            'We also use Stripe (payments), Resend (sign-in emails), Google Analytics and Mixpanel (anonymous usage analytics), and our hosting provider.',
          ],
        },
        {
          heading: 'Cookies and local storage',
          paragraphs: [
            'We use a session cookie to keep you signed in, and browser storage to remember your language and anonymous ID. Analytics tools set their own cookies to measure visits.',
          ],
        },
        {
          heading: 'Your choices',
          paragraphs: [
            'You can ask us to export or delete your account, transcripts and chapters at any time by email. We reply within 30 days.',
          ],
        },
      ],
    },
    terms: {
      meta: {
        title: 'Terms of Service — ChapterGen',
        description: 'The terms for using ChapterGen, the AI YouTube chapter generator.',
      },
      eyebrow: 'Legal',
      title: 'Terms of service',
      updatedDate: 'October 17, 2026',
      intro: 'By using chaptergen.com you agree to these terms. They are short on purpose.',
      sections: [
        {
          heading: 'The service',
          paragraphs: [
            'ChapterGen generates chapter timestamps and titles from video and audio files you upload. Results are produced by AI and may contain mistakes, so review them before publishing.',
          ],
        },
        {
          heading: 'Your content',
          paragraphs: [
            'You keep all rights to the files you upload and to the chapters generated from them. You confirm that you have the right to upload the content and that it does not break the law.',
          ],
        },
        {
          heading: 'Free use and credits',
          paragraphs: [
            'Every visitor can process 2 videos for free, up to 20 minutes each. Paid credits are sold in packs; one credit processes one video. Credits do not expire.',
            'If a video fails to process because of a problem on our side, email us and we will restore the credit. The same goes for any problem with a purchase, including a refund when appropriate.',
          ],
        },
        {
          heading: 'Acceptable use',
          paragraphs: [
            'Do not use ChapterGen to process content you do not have rights to, to overload the service, or to attempt to access other users’ data.',
          ],
        },
        {
          heading: 'Liability',
          paragraphs: [
            'ChapterGen is provided as is. To the extent allowed by law, our total liability is limited to the amount you paid us in the last 12 months.',
          ],
        },
        {
          heading: 'Changes',
          paragraphs: [
            'We may update these terms. The date at the top shows the latest version; continued use means you accept the changes.',
          ],
        },
      ],
    },
    notFound: {
      meta: {
        title: 'Page not found — ChapterGen',
      },
      code: '404',
      title: 'This page skipped a chapter',
      description: "The page you are looking for doesn't exist or has moved.",
      home: 'Go to the chapter generator',
      podcast: 'Podcast chapters',
      pricing: 'Pricing',
    },
  },
  app: {
    common: {
      close: 'Close',
      copy: 'Copy',
      copied: 'Copied',
      loadError: 'Could not load this page. Try again.',
      skip: 'Skip to content',
    },
    nav: {
      label: 'App',
      newVideo: 'New video',
      library: 'Library',
      billing: 'Billing',
      settings: 'Settings',
      support: 'Support',
      buyCredits: 'Buy credits',
      openMenu: 'Open menu',
      openLibrary: 'Open library',
    },
    account: {
      menu: 'Account menu',
      logout: 'Log out',
    },
    credits: {
      freeLeft: '{left} of {total} free videos left',
      count: '{n} credits | {n} credit | {n} credits',
    },
    dates: {
      today: 'Today, {time}',
      yesterday: 'Yesterday',
    },
    status: {
      ready: 'Ready',
      processing: 'Processing',
      failed: 'Failed',
      refunded: 'credit returned',
    },
    outputs: {
      chapters: { title: 'Chapters', description: 'Ready to paste in YouTube' },
      transcript: { title: 'Transcript', description: 'Copy, search or download .docx' },
      subtitles: { title: 'Subtitles', description: 'SRT and VTT files' },
    },
    audioLanguage: {
      label: 'Audio language',
      auto: 'Auto-detect',
    },
    upload: {
      dropTitle: 'Drop your video or audio here',
      dropRowTitle: 'Drop a video or audio file to start',
      formats: 'MP4, MOV, WebM, MP3, WAV, M4A · up to 500 MB',
      formatsCredit: 'MP4, MOV, WebM, MP3, WAV, M4A · up to 500 MB · 1 credit per video',
      choose: 'Choose file',
      uploading: 'Uploading · {percent}%',
      uploaded: 'Uploaded',
      startingTitle: 'Starting your video',
      startingLead: 'Finishing the upload. You will see the progress in a moment.',
      failed: 'The upload failed. Check your connection and try again.',
      failedTitle: 'The upload did not finish',
      failedLead: 'Nothing was charged. Try again with the same file.',
    },
    gate: {
      emailTitle: 'Where should we send your chapters?',
      emailLead: 'Your 2 free videos are linked to your email. We will send a 6-digit code to confirm it. Your file keeps uploading meanwhile.',
      emailLabel: 'Email',
      emailPlaceholder: "you{'@'}example.com",
      sendCode: 'Send code',
      sending: 'Sending…',
      noPassword: 'No password. No spam.',
      codeTitle: 'Check your inbox',
      codeLead: 'We sent a code to {email}. Processing starts as soon as you confirm.',
      codeLabel: 'Verification code',
      digit: 'Digit {n}',
      confirm: 'Confirm and generate',
      verifying: 'Checking…',
      changeEmail: 'Change email',
      resend: 'Resend code',
      resendIn: 'Resend in {s}s',
      errors: {
        generic: 'Something went wrong. Try again.',
        invalid_email: 'Enter a valid email address.',
        disposable_email: 'Please use a permanent email address, not a temporary inbox.',
        rate_limited: 'Too many codes requested. Wait a minute and try again.',
        email_failed: 'We could not send the email. Try again in a moment.',
        invalid: 'That code is not right. Check the latest email we sent.',
        invalid_code: 'Enter the 6-digit code.',
        expired: 'That code has expired. Request a new one.',
        too_many_attempts: 'Too many attempts. Request a new code.',
      },
    },
    login: {
      metaTitle: 'Log in — ChapterGen',
      title: 'Log in to ChapterGen',
      lead: 'Enter your email and we will send you a 6-digit code. No password needed.',
      confirm: 'Log in',
      checking: 'Checking your session…',
      invalidLink: 'That sign-in link has expired. Enter your email to get a code.',
      noAccount: 'New here?',
      tryFree: 'Try 2 videos free',
    },
    newVideo: {
      metaTitle: 'New video — ChapterGen',
      firstTitle: 'Let’s do your first video',
      title: 'Upload a new video',
      explainer: 'One credit gives you chapters, a transcript and subtitles',
      oneCredit: '1 credit = 1 video',
      chapter1: 'Intro',
      chapter2: 'The setup',
      chapter3: 'Results',
      subLine1: 'Welcome back,',
      subLine2: 'let’s get started.',
    },
    library: {
      metaTitle: 'Library — ChapterGen',
      subtitle: 'No videos yet | 1 video · chapters, transcript and subtitles | {n} videos · chapters, transcripts and subtitles for each',
      filterLabel: 'Filter videos',
      filters: { all: 'All', ready: 'Ready', processing: 'Processing', failed: 'Failed' },
      search: 'Search videos',
      noMatches: 'No videos match this filter.',
      purchased: 'Payment received. {n} credits were added to your account.',
      columns: {
        name: 'Name',
        duration: 'Duration',
        language: 'Language',
        created: 'Created',
        status: 'Status',
      },
    },
    processing: {
      steps: {
        upload: 'Upload',
        extracting: 'Extract audio',
        transcribing: 'Transcribe',
        generating: 'Write chapters',
      },
      state: { done: 'Done', active: 'In progress', todo: 'Pending' },
      done: 'Done',
      inProgress: 'In progress…',
      languageDetected: '{language} detected',
      emailNote: 'You can leave this page. We will email {email} when it is ready.',
      youGet: 'What you will get',
    },
    video: {
      processed: 'processed {when}',
      downloadAll: 'Download all (.zip)',
      notFoundTitle: 'Video not found',
      notFoundBody: 'It may belong to another account, or the link is wrong.',
      backToLibrary: 'Back to library',
      uploadAnother: 'Upload another file',
      creditReturned: 'The credit for this video was returned to your account.',
      wrongLanguage: 'Wrong language?',
      retranscribing: 'Transcribing again in {language}…',
      retranscribeFailed: 'We could not transcribe it again: {error} Your previous result is still here.',
      retranscribe: {
        title: 'Transcribe again in another language',
        lead: 'Pick the language spoken in the video. We replace the transcript, chapters and subtitles.',
        language: 'Language spoken in the video',
        choose: 'Choose a language',
        free: 'Free, once per video.',
        submit: 'Transcribe again',
        cancel: 'Cancel',
      },
      failure: {
        no_speech: {
          title: 'No speech detected',
          body: 'We could not hear anyone talking in this file. Check that it has a voice track and try again.',
        },
        no_audio: {
          title: 'This file has no audio',
          body: 'The file only contains video, so there is nothing to transcribe. Downloads from YouTube are often split into video and audio; upload a file that includes sound.',
        },
        audio_too_large: {
          title: 'This file is too long to process',
          body: 'The audio is too large for transcription. Try splitting it into shorter parts.',
        },
        duration_over_free_limit: {
          title: 'Longer than 20 minutes',
          body: 'Free videos can be up to 20 minutes. Buy credits to process videos of any length.',
        },
        insufficient_credits: {
          title: 'Not enough credits',
          body: 'This video needs a credit and your balance is empty.',
        },
        generic: {
          title: 'Something went wrong',
          body: 'We could not finish processing this file. Try uploading it again, or contact us if it keeps failing.',
        },
      },
    },
    tabs: {
      label: 'Results',
      chapters: 'Chapters',
      transcript: 'Transcript',
      subtitles: 'Subtitles',
      words: '{n} words',
    },
    chapters: {
      editHint: 'Click any time or title to edit · changes save automatically',
      saving: 'Saving…',
      saved: 'Saved',
      saveError: 'Could not save. Check the times (for example 1:05).',
      refine: 'Refine with AI',
      copy: 'Copy for YouTube',
      refining: 'Rewriting chapters…',
      refinesLeft: 'No AI refinements left on this free video | 1 AI refinement left on this free video | {n} AI refinements left on this free video',
      timeLabel: 'Chapter {n} time',
      titleLabel: 'Chapter {n} title',
      remove: 'Remove chapter {n}',
      add: 'Add chapter',
      checkTitle: 'YouTube check',
      rules: {
        zero: 'Starts at 0:00',
        count: '{n} chapters (minimum 3)',
        length: 'Every chapter is 10 seconds or longer',
        order: 'Times go in order',
      },
      previewTitle: 'Description preview',
      pasteHelp: 'Paste it in YouTube Studio → Details → Description. Turn off automatic chapters so YouTube keeps yours.',
      downloadTxt: 'Download .txt',
    },
    transcript: {
      search: 'Search transcript',
      copy: 'Copy text',
      matches: 'No matches | 1 match | {n} matches',
      noMatches: 'Nothing matches your search.',
      display: 'Display',
      groupByChapter: 'Group by chapter',
      showTimestamps: 'Show timestamps',
      words: '{n} words',
      reuseTitle: 'Reuse it',
      reuseBody: 'Turn the transcript into a blog post, show notes or a newsletter. Download it as .docx to edit in Google Docs or Word.',
    },
    subtitles: {
      format: 'Subtitle format',
      download: 'Download .{ext}',
      settings: 'Subtitle settings',
      maxChars: 'Max characters per line',
      maxLines: 'Max lines per caption',
      settingsHelp: '42 characters and 2 lines is the usual standard for YouTube and TV.',
      youtubeTitle: 'Add them to YouTube',
      youtubeHelp: 'YouTube Studio → Subtitles → Add language → Upload file → With timing. Also works in Vimeo, Premiere Pro and CapCut.',
    },
    billing: {
      metaTitle: 'Billing — ChapterGen',
      history: 'Purchase history',
      noPayments: 'No purchases yet.',
      date: 'Date',
      description: 'Pack',
      credits: 'Credits',
      amount: 'Amount',
      refunded: 'refunded',
    },
    settings: {
      metaTitle: 'Settings — ChapterGen',
      account: 'Account',
      email: 'Email',
      memberSince: 'Member since',
      signIn: 'Sign-in',
      signInValue: 'Code sent to your email. No password.',
      language: 'Language',
      languageHelp: 'Used for the app and for the emails we send you.',
      session: 'Session',
      deleteTitle: 'Delete account and data',
      deleteHelp: 'We delete your account, transcripts and chapters within 30 days. Unused credits are lost.',
      deleteCta: 'Request deletion',
      deleteSubject: 'Delete my ChapterGen account',
      deleteBody: 'Please delete my ChapterGen account ({email}) and all its data.',
    },
  },
  landings: {
    transcript: {
      meta: {
        title: "Video to Text: Transcribe Video & Audio with AI {'|'} ChapterGen",
        description:
          'Transcribe any video or audio file to text in 90+ languages, with timestamps, search and .docx export. No YouTube link needed. Try 2 videos free.',
      },
      hero: {
        badge: 'Works on private and unpublished files',
        title: 'Transcribe video to text, straight from the file',
        subtitle:
          'Upload a video or audio file and get the full transcript with timestamps, ready to copy or download as .txt or .docx. Chapters and subtitles come with it.',
      },
      showcase: {
        eyebrow: 'What you get',
        title: 'A transcript you can actually read',
        intro: 'Every word comes from the real audio, split into paragraphs and grouped under chapter headings.',
        bullets: [
          'Timestamps on every line, or plain paragraphs',
          'Search the whole transcript in a second',
          'Download as .txt or .docx for Google Docs and Word',
        ],
      },
      sample: {
        fileName: 'interview-maria.mp4',
        label: 'Example transcript',
        lines: [
          ['0:00', 'Thanks for having me. I started the company almost by accident, five years ago.'],
          ['0:07', 'We were a team of three, working from a kitchen table, and our first product failed.'],
          ['0:14', 'What saved us was talking to customers every single week, even when it hurt.'],
          ['0:21', 'That habit is still the most important thing we do today.'],
        ],
      },
      howItWorks: {
        eyebrow: 'How it works',
        title: 'How to transcribe a video to text',
        intro: 'No YouTube link and no install. It works with files on your computer.',
        steps: [
          {
            title: 'Upload your file',
            description: 'MP4, MOV, WebM, MKV, MP3, WAV, M4A and more, up to 500 MB.',
          },
          {
            title: 'AI transcribes it',
            description:
              'We transcribe the audio with OpenAI Whisper. The language is detected automatically, with 90+ supported.',
          },
          {
            title: 'Copy or download',
            description: 'Copy the text, search it, or download it as .txt or .docx. Chapters and subtitles are included.',
          },
        ],
      },
      useCases: {
        eyebrow: 'Use cases',
        title: 'What people transcribe',
        items: [
          { title: 'Interviews', description: 'Quote your guests word for word and find any answer by searching.' },
          { title: 'Podcasts', description: 'Turn each episode into show notes, a blog post or a newsletter.' },
          { title: 'Lectures & courses', description: 'Give students a readable, searchable version of every class.' },
          { title: 'Meetings & webinars', description: 'Keep a written record of what was said, with timestamps.' },
        ],
      },
      faq: {
        title: 'Transcription — FAQ',
        items: [
          {
            question: 'How do I convert a video to text?',
            answer:
              'Upload the video file to ChapterGen. We extract the audio, transcribe it and give you the full text with timestamps. You can copy it or download it as .txt or .docx.',
          },
          {
            question: 'Which languages are supported?',
            answer: 'More than 90, detected automatically, including English, Spanish, Portuguese, French and German.',
          },
          {
            question: 'Can I transcribe a private or unpublished YouTube video?',
            answer: 'Yes. You upload the file itself, so the video never needs to be public.',
          },
          {
            question: 'Does it work with audio files?',
            answer: 'Yes: MP3, WAV, M4A, AAC, OGG and FLAC work the same as video.',
          },
          {
            question: 'How much does it cost?',
            answer:
              'Your first 2 videos are free (up to 20 minutes each) after confirming your email. Then credit packs start at $5 for 5 videos, with no subscription. Each credit includes the transcript, chapters and subtitles.',
          },
          {
            question: 'What happens to my file?',
            answer: 'The file is deleted from our servers after processing. The transcript stays in your library so you can come back to it.',
          },
        ],
      },
      finalCta: {
        title: 'Turn your next video into text.',
        subtitle: 'Try it free on 2 videos. Chapters and subtitles included.',
        cta: 'Transcribe a file',
      },
    },
    subtitles: {
      meta: {
        title: "AI Subtitle Generator — SRT & VTT from Video {'|'} ChapterGen",
        description:
          'Generate SRT and VTT subtitles from any video or audio file, with readable lines, ready for YouTube, Premiere and CapCut. Try 2 videos free.',
      },
      hero: {
        badge: 'SRT and VTT, ready to upload',
        title: 'AI subtitle generator for SRT and VTT files',
        subtitle:
          'Upload a video or audio file and download SRT or VTT subtitles with readable line lengths. Chapters and the full transcript come with it.',
      },
      showcase: {
        eyebrow: 'What you get',
        title: 'Subtitles that are easy to read',
        intro: 'Timing comes from the real audio, and every caption is split into short, balanced lines.',
        bullets: [
          'SRT or VTT, downloaded in one click',
          'Choose characters per line and lines per caption',
          'Works in YouTube, Vimeo, Premiere Pro and CapCut',
        ],
      },
      sample: {
        fileName: 'tutorial-color-grading.srt',
        label: 'Example SRT',
        lines: [
          ['1', '00:00:00,000 --> 00:00:03,200', 'Welcome back. Today we are\ngrading this clip from scratch.'],
          ['2', '00:00:03,200 --> 00:00:06,450', 'First, set the white balance\nbefore touching any color.'],
          ['3', '00:00:06,450 --> 00:00:09,900', 'Then bring the shadows down\njust a little.'],
        ],
      },
      howItWorks: {
        eyebrow: 'How it works',
        title: 'How to generate subtitles for a video',
        intro: 'Works with the file on your computer, before or after you publish.',
        steps: [
          {
            title: 'Upload your video',
            description: 'MP4, MOV, WebM, MKV or audio files, up to 500 MB.',
          },
          {
            title: 'AI writes the captions',
            description:
              'We transcribe the audio and split it into captions with the line length you choose (42 characters and 2 lines by default).',
          },
          {
            title: 'Download SRT or VTT',
            description: 'Upload the file to YouTube Studio, Vimeo or your editor. Timing is already set.',
          },
        ],
      },
      useCases: {
        eyebrow: 'Use cases',
        title: 'Where subtitles help',
        items: [
          { title: 'YouTube videos', description: 'Upload an SRT with timing so viewers can watch with the sound off.' },
          { title: 'Social clips', description: 'Burn captions in CapCut or Premiere for Reels, Shorts and TikTok.' },
          { title: 'Courses', description: 'Make every lesson accessible and easier to follow.' },
          { title: 'Translations', description: 'Start from an accurate SRT and translate it, instead of typing from zero.' },
        ],
      },
      faq: {
        title: 'Subtitles — FAQ',
        items: [
          {
            question: 'How do I add subtitles to a YouTube video?',
            answer:
              'Download the SRT, then go to YouTube Studio → Subtitles → Add language → Upload file → With timing, and pick the file.',
          },
          {
            question: 'What is the difference between SRT and VTT?',
            answer:
              'Both store captions with timings. SRT is the most widely supported format; VTT is the web standard used by HTML5 players. YouTube accepts both.',
          },
          {
            question: 'Can I change the line length?',
            answer: 'Yes. Choose the maximum characters per line and lines per caption, and the preview updates before you download.',
          },
          {
            question: 'Which languages are supported?',
            answer: 'More than 90, detected automatically. The subtitles are in the language spoken in the video.',
          },
          {
            question: 'How much does it cost?',
            answer:
              'Your first 2 videos are free (up to 20 minutes each) after confirming your email. Then credit packs start at $5 for 5 videos. Each credit includes subtitles, the transcript and chapters.',
          },
        ],
      },
      finalCta: {
        title: 'Subtitles for your next video, in minutes.',
        subtitle: 'Try it free on 2 videos. Transcript and chapters included.',
        cta: 'Generate subtitles',
      },
    },
  },
}
