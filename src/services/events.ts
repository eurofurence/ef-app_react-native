import { useCallback } from 'react'
import { useToast } from '@/context/ToastContext'
import { captureException } from '@sentry/react-native'
import { FeedbackSchema } from '@/components/feedback/FeedbackForm.schema'
import { getAccessToken } from '@/context/AuthContext'
import { apiBase } from '@/configuration'

export function useSubmitEventFeedback() {
    const toast = useToast()

    const execute = useCallback(async (params: FeedbackSchema) => {
        try {
            const accessToken = await getAccessToken()
            if (!accessToken) {
                throw new Error('No access token available')
            }

            const response = await fetch(`${apiBase}/EventFeedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    EventId: params.eventId,
                    Rating: params.rating,
                    Message: params.message,
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
