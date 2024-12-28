// @dada78641/nyabby <https://github.com/msikma/nyabby>
// © MIT license

import {createLookupTable} from './util/index.ts'
import type {idSlugName} from './types.ts'

const filterEntries: idSlugName[] = [
  ['0', 'no_filter', 'No filter'],
  ['1', 'no_remakes', 'No remakes'],
  ['2', 'trusted_only', 'Trusted only'],
]

const categoryEntries: idSlugName[] = [
  ['0_0', 'all_categories', 'All categories'],
  ['1_0', 'anime', 'Anime'],
  ['1_1', 'anime_amv', 'Anime - AMV'],
  ['1_2', 'anime_english', 'Anime - English'],
  ['1_3', 'anime_non_english', 'Anime - Non-English'],
  ['1_4', 'anime_raw', 'Anime - Raw'],
  ['2_0', 'audio', 'Audio'],
  ['2_1', 'audio_lossless', 'Audio - Lossless'],
  ['2_2', 'audio_lossy', 'Audio - Lossy'],
  ['3_0', 'literature', 'Literature'],
  ['3_1', 'literature_english', 'Literature - English'],
  ['3_2', 'literature_non_english', 'Literature - Non-English'],
  ['3_3', 'literature_raw', 'Literature - Raw'],
  ['4_0', 'live_action', 'Live Action'],
  ['4_1', 'live_action_english', 'Live Action - English'],
  ['4_2', 'live_action_idol_pv', 'Live Action - Idol/PV'],
  ['4_3', 'live_action_non_english', 'Live Action - Non-English'],
  ['4_4', 'live_action_raw', 'Live Action - Raw'],
  ['5_0', 'pictures', 'Pictures'],
  ['5_1', 'pictures_graphics', 'Pictures - Graphics'],
  ['5_2', 'pictures_photos', 'Pictures - Photos'],
  ['6_0', 'software', 'Software'],
  ['6_1', 'software_apps', 'Software - Apps'],
  ['6_2', 'software_games', 'Software - Games'],
]

// Lookup tables for filters and categories.
export const filter = createLookupTable('f', filterEntries)
export const category = createLookupTable('c', categoryEntries)
