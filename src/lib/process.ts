// @dada78641/nyabby <https://github.com/msikma/nyabby>
// © MIT license

import orderBy from 'lodash.orderby'
import {category, filter} from './filters.ts'
import type {NyaaSearch, FeedChannel, FeedItem} from './types.ts'

/**
 * Returns whether a given feed item matches a search query.
 * 
 * This removes items that don't match, for example, the maxAge or minSeeders arguments.
 */
function matchesSearch(item: FeedItem, search: NyaaSearch): boolean {
  const age = item.date != null ? Date.now() - Number(item.date) : null
  const filterObj = filter.bySlug(search.filter || '')
  const categoryObj = category.bySlug(search.category || '')
  if (filterObj?.[1] === 'no_remakes' && item.isRemake) {
    return false
  }
  if (filterObj?.[1] === 'trusted_only' && !item.isTrusted) {
    return false
  }
  if (categoryObj && item.categorySlug !== categoryObj[1]) {
    return false
  }
  if (search.minSeeders && item.seeders < search.minSeeders) {
    return false
  }
  if (search.maxDate && item.date && item.date > search.maxDate) {
    return false
  }
  if (search.minDate && item.date && item.date < search.minDate) {
    return false
  }
  if (search.maxAge && age !== null && age > search.maxAge) {
    return false
  }
  if (search.minAge && age !== null && age < search.minAge) {
    return false
  }
  return true
}

/**
 * Removes items from a channel that do not match our search filters.
 */
export function processFeedChannel(channel: FeedChannel, search: NyaaSearch): FeedChannel {
  const filteredItems: FeedItem[] = []
  for (const item of channel.items) {
    if (!matchesSearch(item, search)) {
      continue
    }
    filteredItems.push(item)
  }
  return {
    ...channel,
    items: orderBy(filteredItems, 'date', 'desc'),
  }
}
