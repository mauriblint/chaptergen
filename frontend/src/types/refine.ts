export type RefineMode = 'both' | 'titles' | 'segments'
export type Granularity = 'detailed' | 'balanced' | 'grouped'
export type ContentType = 'auto' | 'tutorial' | 'podcast' | 'webinar' | 'review'
export type TitleStyle = 'descriptive' | 'short' | 'seo' | 'question'

export interface RefineOptions {
  mode: RefineMode
  granularity: Granularity
  contentType: ContentType
  titleStyle: TitleStyle
  autoMode: boolean
  chapterCount?: number
  instructions?: string
}

export interface RefineRequest extends RefineOptions {
  existingChapters?: { time: string; title: string }[]
}
