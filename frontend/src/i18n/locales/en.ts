export default {
  common: {
    nav: {
      features: 'Features',
      useCases: 'Use Cases',
      faq: 'FAQ',
      podcast: 'Podcast',
    },
    footer: {
      tagline: 'AI chapters for every story.',
      productHeading: 'Product',
      youtubeChapters: 'YouTube Chapters',
      podcastChapters: 'Podcast Chapters',
      legalHeading: 'Legal',
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
      title: 'AI YouTube Chapter Generator — Free Timestamps in Seconds',
      description:
        'Upload your video or audio and get AI-generated YouTube chapters instantly. No URL needed — works before you publish. Free, no signup.',
    },
    hero: {
      badge: 'AI-Powered · Fast · Accurate',
      title: 'AI YouTube Chapter Generator — Get Timestamps in Seconds',
      subtitle:
        'No YouTube URL needed. Upload your video or audio and get clean, SEO-ready chapters before you even publish — works with private videos, drafts, and podcast audio.',
      microcopy: 'Free to use · No signup required · MP4, MOV, MP3, WAV and more · Files up to 500 MB',
    },
    howItWorks: {
      title: 'How to Generate YouTube Chapters with AI',
      steps: [
        {
          title: 'Upload your file',
          description:
            'Drag and drop your video or audio file. No need to publish to YouTube first — the tool works with raw files, private videos, and drafts.',
        },
        {
          title: 'AI analyzes your content',
          description:
            'Our AI transcribes your audio, detects topic changes, and identifies the natural sections of your video — then writes a clear, descriptive title for each one.',
        },
        {
          title: 'Copy and paste',
          description:
            "Copy the generated chapters in YouTube's exact required format (starting at 0:00) and paste them into your video description. Done.",
        },
      ],
    },
    differentiator: {
      title: 'Generate Chapters Before You Publish',
      intro:
        'Most chapter generators need a public YouTube URL — which means your video already has to be live. ChapterGen works differently: you upload the file itself.',
      bullets: [
        {
          title: 'Unpublished videos',
          description:
            'Generate your chapters while the video is still a draft, so your description is perfect from minute one.',
        },
        {
          title: 'Private and unlisted videos',
          description: 'No public URL required, ever.',
        },
        {
          title: 'Audio-only content',
          description: 'Podcasts, interviews, and voice recordings work just as well as video.',
        },
        {
          title: 'Any language',
          description: 'Whisper auto-detects — works with 90+ languages.',
        },
      ],
    },
    seoBenefits: {
      title: 'Why YouTube Chapters Boost Your Views',
      intro:
        "Chapters aren't just convenient for viewers — they're one of the most underused SEO levers on YouTube:",
      bullets: [
        {
          title: 'Key Moments in Google Search',
          description:
            'Videos with chapters can appear in Google results with clickable sections, taking up more space on the results page.',
        },
        {
          title: 'Higher engagement',
          description:
            'Large-scale analyses of YouTube videos show that videos with chapters get significantly better like and comment ratios.',
        },
        {
          title: 'Better retention',
          description:
            "Viewers who can jump to what they need are more likely to stay, rewatch, and return — all signals YouTube's algorithm rewards.",
        },
        {
          title: 'Searchable metadata',
          description:
            'Every chapter title is text YouTube can index. Descriptive, keyword-rich titles help your video rank for more searches.',
        },
      ],
    },
    comparison: {
      title: "Better Than YouTube's Automatic Chapters",
      intro:
        "YouTube can auto-generate chapters — so why use a dedicated tool? Because YouTube's automatic chapters are inconsistent: they often cut mid-sentence, miss topic transitions, and produce generic titles like \"Section 1\" that carry zero SEO value.",
      outro:
        "With ChapterGen you get chapters based on what's actually said in your video, with descriptive titles you can edit and optimize with your own keywords — then simply disable YouTube's auto-chapters in YouTube Studio and paste yours in.",
      colYoutube: 'YouTube auto-chapters',
      colChaptergen: 'ChapterGen',
      rows: [
        { feature: 'Descriptive, SEO-ready titles', youtube: 'Generic', chaptergen: 'Based on real content' },
        { feature: 'Editable before publishing', youtube: 'no', chaptergen: 'yes' },
        { feature: 'Works on unpublished videos', youtube: 'no', chaptergen: 'yes' },
        { feature: 'Works with audio / podcasts', youtube: 'no', chaptergen: 'yes' },
      ],
    },
    useCases: {
      title: 'Built for Every Kind of Long-Form Content',
      items: [
        {
          title: 'Tutorials & how-tos',
          description:
            'Let viewers jump straight to the step they need — and come back to your video as a reference.',
        },
        {
          title: 'Podcasts & interviews',
          description: 'One chapter per question or topic.',
          link: '/podcast-chapters',
          linkLabel: 'Podcast chapter generator →',
        },
        {
          title: 'Webinars & courses',
          description: 'Turn a 2-hour recording into a navigable lesson.',
        },
        {
          title: 'Product reviews & vlogs',
          description: 'Highlight each product or moment so nobody scrolls away.',
        },
      ],
    },
    faq: {
      title: 'Frequently Asked Questions',
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
          answer: 'Yes — ChapterGen is free to use with no signup required.',
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
    schema: {
      softwareDescription:
        'AI-powered YouTube chapter generator. Upload video or audio and get SEO-ready timestamps instantly.',
      howToName: 'How to Generate YouTube Chapters with AI',
    },
  },
  podcast: {
    meta: {
      title: 'AI Podcast Chapter Generator — Timestamps from Your Audio',
      description:
        'Upload your podcast episode and get AI-generated chapters with timestamps. Works with MP3, WAV, and episodes of any length. Free to try.',
    },
    hero: {
      badge: 'Audio-first · Any length · Free',
      title: 'AI Podcast Chapter Generator — Upload Your Audio, Get Timestamped Chapters',
      subtitle:
        'Drop in your episode file — MP3, WAV, M4A — and get clean chapters with descriptive titles in minutes. Built for interviews, solo shows, and episodes of any length.',
      microcopy: 'Free to use · No signup required · MP3, WAV, M4A and more · Files up to 500 MB',
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
      titleVideo: 'Drag and drop a video or audio file, or click to browse',
      titleAudio: 'Drag and drop your audio file, or click to browse',
      hintVideo: 'MP4, MOV, WebM, MP3, WAV, M4A — up to 500 MB',
      hintAudio: 'MP3, WAV, M4A, AAC, OGG, FLAC — up to 500 MB',
      button: 'Generate Chapters',
    },
    chapterTool: {
      rating: '4.9',
      ratingSuffix: '12,000+ creators',
      filesDeleted: 'Files auto-deleted after processing',
      noSignup: 'No signup required',
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
    },
  },
}
