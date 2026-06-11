import {
  keepPreviousData,
  type UseQueryResult,
  useQuery,
} from '@tanstack/react-query'
import axios, { type GenericAbortSignal } from 'axios'

import { registrationDatesUrl } from '@/configuration'
import { parseDefaultISO } from '@/util/parseDefaultISO'

interface RegistrationDates {
  'reg-start': string
  'reg-end': string
  'con-start': string
  'con-end': string
}

interface ParsedRegistrationDates {
  startDate: Date
  endDate: Date
  conStart: Date
  conEnd: Date
}

function parseDate(value: string, name: string): Date {
  const parsed = parseDefaultISO(value)
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid ${name} date format received from server`)
  }
  return parsed
}

/**
 * Gets the registration and convention dates from the public dates endpoint.
 * @param signal An abort signal.
 */
export async function getRegistrationDates(
  signal?: GenericAbortSignal
): Promise<ParsedRegistrationDates> {
  const response = await axios.get(registrationDatesUrl, {
    signal: signal,
  })

  const data: RegistrationDates = response.data

  return {
    startDate: parseDate(data['reg-start'], 'reg-start'),
    endDate: parseDate(data['reg-end'], 'reg-end'),
    conStart: parseDate(data['con-start'], 'con-start'),
    conEnd: parseDate(data['con-end'], 'con-end'),
  }
}

/**
 * Uses a query for `getRegistrationDates`.
 */
export function useRegistrationDatesQuery(): UseQueryResult<ParsedRegistrationDates | null> {
  return useQuery({
    queryKey: ['registration-dates'],
    queryFn: (context) => getRegistrationDates(context.signal),
    placeholderData: (data) => keepPreviousData(data),
  })
}
