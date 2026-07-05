import type { FAQItem, UseCaseItem } from './home'

export const podcastMeta = {
  title: 'AI Podcast Chapter Generator — Timestamps from Your Audio',
  description:
    'Upload your podcast episode and get AI-generated chapters with timestamps. Works with MP3, WAV, and episodes of any length. Free to try.',
  canonical: '/podcast-chapters',
}

export const podcastHero = {
  badge: 'Audio-first · Any length · Free',
  title: 'AI Podcast Chapter Generator — Upload Your Audio, Get Timestamped Chapters',
  subtitle:
    'Drop in your episode file — MP3, WAV, M4A — and get clean chapters with descriptive titles in minutes. Built for interviews, solo shows, and episodes of any length.',
  microcopy: 'Free to use · No signup required · MP3, WAV, M4A and more · Files up to 500 MB',
}

export const podcastPlatforms = {
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
}

export const podcastUseCases = {
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
  ] as UseCaseItem[],
}

export const podcastWhy = {
  title: 'Chapters Turn Listeners into Subscribers',
  description:
    'Podcast listeners increasingly sample before they commit. Chapters let a new listener jump straight to the segment that hooked them from a clip or recommendation — and a listener who finds value fast is a listener who subscribes. On YouTube specifically, chapters also make your episodes searchable and eligible for Key Moments in Google.',
}

export const podcastFaq: FAQItem[] = [
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
]
