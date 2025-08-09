import { parseISO, ParseISOOptions } from 'date-fns/parseISO'

/**
 * Checks if the argument specifies a timezone.
 * @param argument The argument to check.
 */
function hasTimeZoneSpecifier(argument: unknown) {
  // Guard type.
  if (typeof argument !== 'string') return false

  // Find ISO time separator, we later check for timezone offsets and this lets
  // us skip 'minus' symbols in the date part. If no time separator is
  // found, cannot have time zone specifier.
  const timeSeparator = argument.indexOf('T')
  if (timeSeparator < 0) return false

  return (
    // Positive time zone adjustment.
    argument.indexOf('+', timeSeparator) > 0 ||
    // Negative time zone adjustment.
    argument.indexOf('-', timeSeparator) > 0 ||
    // Zulu time.
    argument.indexOf('Z', timeSeparator) > 0
  )
}

/**
 * Parses an ISO date, applies default time zone assumption if no timezone is specified.
 * @param argument The argument to parse.
 * @param options Any options.
 */
export function parseDefaultISO<DateType extends Date, ResultDate extends Date = DateType>(argument: string, options?: ParseISOOptions<ResultDate>): ResultDate {
  return hasTimeZoneSpecifier(argument) ? parseISO(argument, options) : parseISO<DateType, ResultDate>(argument + 'Z', options)
}
