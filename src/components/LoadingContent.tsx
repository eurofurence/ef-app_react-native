import { ActivityIndicator, View } from 'react-native'

import { Label } from '@/components/generic/atoms/Label'

export type LoadingContentProps = {
  message: string
}

/**
 * Placeholder for a record that is not in the cache yet. Distinct from
 * NotFoundContent, which asserts the record does not exist.
 */
export function LoadingContent({ message }: LoadingContentProps) {
  return (
    <View className='items-center pt-[20vh]'>
      <ActivityIndicator accessibilityLabel={message} />
      <Label className='mt-5' type='regular' accessibilityRole='text'>
        {message}
      </Label>
    </View>
  )
}
