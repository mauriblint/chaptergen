export const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'https://chaptergen.com'
export const BRAND_NAME = 'ChapterGen'

export interface FAQItem {
  question: string
  answer: string
}

export interface StepItem {
  title: string
  description: string
}

export interface UseCaseItem {
  title: string
  description: string
  link?: string
  linkLabel?: string
}

export const homeMeta = {
  title: 'AI YouTube Chapter Generator — Free Timestamps in Seconds',
  description:
    'Upload your video or audio and get AI-generated YouTube chapters instantly. No URL needed — works before you publish. Free, no signup.',
  canonical: '/',
}

export const homeHero = {
  badge: 'AI-Powered · Fast · Accurate',
  title: 'AI YouTube Chapter Generator — Upload Your Video, Get Timestamps in Seconds',
  subtitle:
    'No YouTube URL needed. Upload your video or audio file and get clean, SEO-ready chapters before you even publish. Works with private videos, unpublished drafts, and podcast audio.',
  microcopy: 'Free to use · No signup required · MP4, MOV, MP3, WAV and more · Files up to 500 MB',
}

export const howItWorks = {
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
  ] as StepItem[],
}

export const differentiator = {
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
}

export const seoBenefits = {
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
}

export const comparison = {
  title: "Better Than YouTube's Automatic Chapters",
  intro:
    "YouTube can auto-generate chapters — so why use a dedicated tool? Because YouTube's automatic chapters are inconsistent: they often cut mid-sentence, miss topic transitions, and produce generic titles like \"Section 1\" that carry zero SEO value.",
  outro:
    "With ChapterGen you get chapters based on what's actually said in your video, with descriptive titles you can edit and optimize with your own keywords — then simply disable YouTube's auto-chapters in YouTube Studio and paste yours in.",
  rows: [
    { feature: 'Descriptive, SEO-ready titles', youtube: 'Generic', chaptergen: 'Based on real content' },
    { feature: 'Editable before publishing', youtube: false, chaptergen: true },
    { feature: 'Works on unpublished videos', youtube: false, chaptergen: true },
    { feature: 'Works with audio / podcasts', youtube: false, chaptergen: true },
  ],
}

export const useCases = {
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
  ] as UseCaseItem[],
}

export const homeFaq: FAQItem[] = [
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
]
