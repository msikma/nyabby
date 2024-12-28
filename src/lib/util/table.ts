// @dada78641/nyabby <https://github.com/msikma/nyabby>
// © MIT license

import type {idSlugName} from '../types.ts'

// Table indexing helper.
const keyToIndex: {[key: string]: number} = {id: 0, slug: 1, name: 2}

// Lookup tables are used for getting filter values.
export interface LookupTable {
  byId: (id: string) => idSlugName | undefined
  bySlug: (slug: string) => idSlugName | undefined
  param: () => string
  entries: () => idSlugName[]
}

/**
 * Creates a Map from a list of BwData based items by a given key.
 */
function mapByKey(data: idSlugName[], key: string): Map<string, idSlugName> {
  const index = keyToIndex[key]
  return new Map(data.map(item => [item[index], item]))
}

/**
 * Creates a lookup table for id/slug/name entries.
 */
export function createLookupTable(arg: string, data: idSlugName[]): LookupTable {
  const mapId = mapByKey(data, 'id')
  const mapSlug = mapByKey(data, 'slug')
  
  return {
    byId: (id: string) => mapId.get(id),
    bySlug: (slug: string) => mapSlug.get(slug),
    param: () => arg,
    entries: () => data
  }
}
