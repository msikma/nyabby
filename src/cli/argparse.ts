// @dada78641/nyabby <https://github.com/msikma/nyabby>
// © MIT license

import {ArgumentParser} from 'argparse'
import type {NyaaSearch} from '../lib/types.ts'

// Raw parsed CLI arguments.
export interface ParsedArguments {
  search: string
  filter?: string
  category?: string
  minSeeders?: string
  maxDate?: string
  minDate?: string
  maxAge?: string
  minAge?: string
  baseUrl?: string
  help?: boolean
  version?: boolean
}

/**
 * Extended ArgumentParser to silence missing positional arguments.
 * 
 * This allows us to be a bit more flexible and use a custom error message.
 * It's required to do this because ArgumentParser.exit_on_error does not apply
 * to positional arguments.
 * 
 * See <https://github.com/nodeca/argparse/issues/155>.
 */
export class QuietArgumentParser extends ArgumentParser {
  error(message: string) {
    if (message.includes('the following arguments are required')) {
      return
    }
    return super.error(message)
  }
}

/**
 * Converts parsed CLI arguments to valid arguments for Nyabby().
 */
export function fromCliArgs(args: ParsedArguments): NyaaSearch {
  return {
    query: args.search,
    filter: args.filter || null,
    category: args.category || null,
    minSeeders: args.minSeeders ? Number(args.minSeeders) : null,
    maxDate: args.maxDate ? new Date(args.maxDate) : null,
    minDate: args.minDate ? new Date(args.minDate) : null,
    maxAge: args.maxAge ? Number(args.maxAge) : null,
    minAge: args.maxAge ? Number(args.minAge) : null,
  }
}
