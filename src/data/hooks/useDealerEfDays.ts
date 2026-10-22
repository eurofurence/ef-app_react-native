import { useLiveQuery } from '@tanstack/react-db'
import { daysCollection } from '@/data/collections/content/Days'
import { isDayOfWeek } from '@/data/utils/isDayOfWeek'

export function useDealerEfDays(
  thursday: boolean | undefined,
  friday: boolean | undefined,
  saturday: boolean | undefined
) {
  const { data: days } = useLiveQuery(
    {
      id: 'dealer-days',
      query: (q) =>
        q
          .from({ day: daysCollection })
          .fn.where(
            ({ day }) =>
              (thursday && isDayOfWeek(day.Date, 4)) ||
              (friday && isDayOfWeek(day.Date, 5)) ||
              (saturday && isDayOfWeek(day.Date, 6))
          ),
    },
    [thursday, friday, saturday]
  )
  return days
}
