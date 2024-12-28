// @dada78641/nyabby <https://github.com/msikma/nyabby>
// © MIT license

import {fetchFeed} from './feed.ts'
import {filter, category} from './filters.ts'
import {processFeedChannel} from './process.ts'
import type {NyaaSearch, FeedChannel} from './types.ts'

const NYAA_BASE_URL = 'https://nyaa.si'
const CACHE_TIME = 180_000

export class Nyabby {
  public baseUrl
  private cacheAge
  private cacheMap = new Map<string, {time: Date, channel: FeedChannel}>()

  constructor(baseUrl?: string, cacheAge?: number) {
    this.baseUrl = baseUrl || NYAA_BASE_URL
    this.cacheAge = cacheAge || CACHE_TIME
  }

  /**
   * Runs a search on Nyaa and returns the result.
   */
  async runSearch(search: NyaaSearch): Promise<FeedChannel> {
    const url = this.createFeedUrl(search)
    if (this.isCached(url)) {
      const cachedChannel = this.getFromCache(url)
      return processFeedChannel(cachedChannel, search)
    }
    const channel = await fetchFeed(url)
    this.saveToCache(url, channel)
    return processFeedChannel(channel, search)
  }

  /**
   * Saves a feed response to the cache.
   */
  private saveToCache(url: URL, channel: FeedChannel) {
    const urlKey = String(url)
    this.cacheMap.set(urlKey, {time: new Date(), channel})
  }

  /**
   * Retrieves a feed response from cache.
   */
  private getFromCache(url: URL): FeedChannel {
    const urlKey = String(url)
    const cache = this.cacheMap.get(urlKey)
    if (cache === undefined) {
      throw new Error(`Invalid cache: ${urlKey}`)
    }
    return cache.channel
  }

  /**
   * Checks whether an item is in the cache and not stale.
   */
  private isCached(url: URL): boolean {
    const urlKey = String(url)
    const cache = this.cacheMap.get(urlKey)
    if (cache === undefined) {
      return false
    }
    // Check if the item is older than the cache age.
    const isStale = Date.now() - Number(cache.time) > this.cacheAge
    if (!isStale) {
      return true
    }
    this.cacheMap.delete(urlKey)
    return false
  }

  /**
   * Checks that a search object is valid.
   */
  private validateSearch(search: NyaaSearch) {
    if (search.query == null || search.query === '') {
      throw new Error(`Search query not set`)
    }
    if (search.filter) {
      const filterItem = filter.bySlug(search.filter)
      if (filterItem == null) {
        throw new Error(`Invalid filter: ${search.filter}`)
      }
    }
    if (search.category) {
      const categoryItem = category.bySlug(search.category)
      if (categoryItem == null) {
        throw new Error(`Invalid category: ${search.category}`)
      }
    }
    if (search.maxDate && search.maxDate instanceof Date !== true) {
      throw new Error(`Search maxDate must be a Date`)
    }
    if (search.minDate && search.minDate instanceof Date !== true) {
      throw new Error(`Search minDate must be a Date`)
    }
    if (search.maxAge && Number.isNaN(search.maxAge)) {
      throw new Error(`Search maxAge must be a number`)
    }
    if (search.minAge && Number.isNaN(search.minAge)) {
      throw new Error(`Search minAge must be a number`)
    }
  }

  /**
   * Creates a url from which we can fetch an rss feed.
   */
  createFeedUrl(search: NyaaSearch): URL {
    this.validateSearch(search)

    const url = new URL(`${this.baseUrl}`)
    url.searchParams.set('page', 'rss')
    url.searchParams.set('q', `${search.query}`)
    if (search.filter) {
      const filterRow = filter.bySlug(search.filter)!
      url.searchParams.set(filter.param(), `${filterRow[0]}`)
    }
    if (search.category) {
      const categoryRow = category.bySlug(search.category)!
      url.searchParams.set(category.param(), `${categoryRow[0]}`)
    }
    return url
  }
}
