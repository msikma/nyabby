// @dada78641/nyabby <https://github.com/msikma/nyabby>
// © MIT license

import xml2js from 'xml2js'
import {category} from './filters.ts'
import type {RawFeedResult, RawFeedChannel, FeedChannel, FeedItem} from './types.ts'

/**
 * Returns whether an unknown object is a valid RSS feed parsed by xml2js.
 */
function isRawFeedResult(res: any): res is RawFeedResult {
  if (!res?.rss || !res?.rss?.channel) {
    return false
  }
  return true
}

/**
 * Returns an RSS feed channel if it exists inside of a given unknown object.
 */
function getRawFeedChannel(res: any): RawFeedChannel {
  if (!isRawFeedResult(res)) {
    throw new Error('Not a raw rss feed result')
  }
  return res.rss.channel
}

/**
 * Converts a "Yes" or "No" string to a boolean.
 */
function booleanFromString(value: string): boolean {
  if (value.trim().toLowerCase() === 'yes') {
    return true
  }
  return false
}

/**
 * Parses a raw channel response to a typed channel object.
 */
function parseChannel(rawChannel: RawFeedChannel): FeedChannel {
  const items: FeedItem[] = []
  for (const rawItem of rawChannel.item) {
    const categoryObj = category.byId(rawItem['nyaa:categoryId'])
    items.push({
      title: rawItem.title,
      description: rawItem.description,
      link: rawItem.link,
      guid: rawItem.guid._,
      date: rawItem.pubDate !== '' ? new Date(rawItem.pubDate) : null,
      seeders: Number(rawItem['nyaa:seeders']),
      leechers: Number(rawItem['nyaa:leechers']),
      downloads: Number(rawItem['nyaa:downloads']),
      infoHash: rawItem['nyaa:infoHash'],
      categorySlug: categoryObj ? categoryObj[1] : null,
      size: rawItem['nyaa:size'],
      comments: Number(rawItem['nyaa:comments']),
      isTrusted: booleanFromString(rawItem['nyaa:trusted']),
      isRemake: booleanFromString(rawItem['nyaa:remake']),
    })
  }
  return {
    title: rawChannel.title,
    description: rawChannel.description,
    link: rawChannel.link,
    items,
  }
}

/**
 * Returns whether a given content type is appropriate for a parsable feed.
 */
function isFeedContentType(contentType: string): boolean {
  if (!contentType.includes('xml') && !contentType.includes('rss') && !contentType.includes('atom')) {
    return false
  }
  return true
}

/**
 * Fetches a feed by URL.
 * 
 * Uses a timeout, after which the function will throw if the request did not complete yet.
 */
export async function fetchFeedText(url: string, fetchTimeout: number = 10_000): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), fetchTimeout)

  try {
    const res = await fetch(url, {signal: controller.signal})
    const contentType = res.headers.get('Content-Type') || ''
    if (!res.ok) {
      throw new Error(`Failed to fetch feed. Status: ${res.status} ${res.statusText}`)
    }
    if (!isFeedContentType(contentType)) {
      throw new Error(`Unexpected content type: ${contentType}`)
    }
    return await res.text()
  }
  catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(`Fetch request timed out after ${(fetchTimeout / 1000).toFixed(1)} seconds`)
      }
      throw error
    }
    throw new Error('An unknown error occurred')
  }
  finally {
    clearTimeout(timeout)
  }
}

/**
 * Parses an RSS feed from an XML string.
 */
export async function parseFeed(xml: string): Promise<FeedChannel> {
  const parsed = await xml2js.parseStringPromise(xml, {
    trim: true,
    async: true,
    explicitCharkey: false,
    explicitArray: false,
  })
  const rawChannel = getRawFeedChannel(parsed)
  return parseChannel(rawChannel)
}

/**
 * Requests a feed URL and returns its parsed contents.
 */
export async function fetchFeed(url: URL): Promise<FeedChannel> {
  const xml = await fetchFeedText(String(url))
  return parseFeed(xml)
}
