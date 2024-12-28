// @dada78641/nyabby <https://github.com/msikma/nyabby>
// © MIT license

// Types used for the lookup tables.
export type id = string
export type slug = string
export type name = string
export type idSlugName = [id, slug, name]

// A single search query object.
export interface NyaaSearch {
  query: string
  filter: string | null
  category: string | null
  minSeeders: number | null
  maxDate: Date | null
  maxAge: number | null
  minDate: Date | null
  minAge: number | null
}

// A parsed RSS feed channel object.
export interface FeedChannel {
  title: string
  description: string
  link: string
  items: FeedItem[]
}

// A parsed RSS feed item.
export interface FeedItem {
  title: string
  link: string
  guid: string
  date: Date | null
  seeders: number
  leechers: number
  downloads: number
  infoHash: string
  categorySlug: string | null
  size: string
  comments: number
  isTrusted: boolean
  isRemake: boolean
  description: string
}

// XML parsing types.
export interface RawFeedResult {
  rss: {
    channel: RawFeedChannel
  }
}
export interface RawFeedChannel {
  title: string
  description: string
  link: string
  item: RawFeedItem[]
}
export interface RawFeedItem {
  title: string
  link: string
  guid: {
    '_': string
    '$': {
      isPermalink: 'true' | 'false'
    }
  }
  pubDate: string
  'nyaa:seeders': string
  'nyaa:leechers': string
  'nyaa:downloads': string
  'nyaa:infoHash': string
  'nyaa:categoryId': string
  'nyaa:category': string
  'nyaa:size': string
  'nyaa:comments': string
  'nyaa:trusted': string
  'nyaa:remake': string
  description: string
}
