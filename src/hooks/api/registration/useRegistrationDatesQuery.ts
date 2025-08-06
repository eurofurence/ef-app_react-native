import { keepPreviousData, useQuery, UseQueryResult } from '@tanstack/react-query'
import axios, { GenericAbortSignal } from 'axios'
import { parseISO } from 'date-fns'
import { registrationDatesUrl } from '@/configuration'

interface RegistrationDates {
  'reg-start': string
  'reg-end': string
  'con-start': string
  'con-end': string
}

interface ParsedRegistrationDates {
  startDate: Date
  endDate: Date
}

/**
 * Gets the registration dates from the public dates endpoint.
 * @param signal An abort signal.
 */
export async function getRegistrationDates(signal?: GenericAbortSignal): Promise<ParsedRegistrationDates> {
  const response = await axios.get(registrationDatesUrl, {
    signal: signal,
  })

  const data: RegistrationDates = response.data

  const parsedStartDate = parseISO(data['reg-start'])
  const parsedEndDate = parseISO(data['reg-end'])

  if (isNaN(parsedStartDate.getTime())) {
    throw new Error('Invalid start date format received from server')
  }

  if (isNaN(parsedEndDate.getTime())) {
    throw new Error('Invalid end date format received from server')
  }

  return {
    startDate: parsedStartDate,
    endDate: parsedEndDate,
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
