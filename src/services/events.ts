import { useCallback } from 'react'
import { captureException } from '@sentry/react-native'
import { useToast } from '@/context/ToastContext'
import { FeedbackSchema } from '@/components/feedback/FeedbackForm.schema'
import { getAccessToken } from '@/context/AuthContext'

interface SubmitFeedbackParams extends FeedbackSchema {
    eventId: string;
}

export function useSubmitEventFeedback() {
    const toast = useToast()

    const execute = useCallback(async (params: SubmitFeedbackParams) => {
        try {
            const accessToken = await getAccessToken()
            if (!accessToken) {
                throw new Error('No access token available')
            }

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/Events/${params.eventId}/Feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    rating: params.rating,
                    message: params.message,
                }),
            })

            if (!response.ok) {
                throw new Error(`Failed to submit feedback: ${response.statusText}`)
            }

            toast('info', 'Feedback submitted successfully')
        } catch (error) {
            console.error('Failed to submit feedback:', error)
            captureException(error)
            toast('error', 'Failed to submit feedback')
            throw error
        }
    }, [toast])

    return {
        execute,
        isLoading: false,
    }
}
