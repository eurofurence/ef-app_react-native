import { captureException } from '@sentry/react-native'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { Label } from '../generic/atoms/Label'
import { Button } from '../generic/containers/Button'
import { useAuthContext } from '@/context/auth/Auth'

export type ArtistsAlleyUnauthorizedProps = {
  loggedIn: boolean
  attending: boolean
  checkedIn: boolean
}

export const ArtistsAlleyUnauthorized = ({ loggedIn, attending, checkedIn }: ArtistsAlleyUnauthorizedProps) => {
  // Get translation function.
  const { t } = useTranslation('ArtistsAlley')
  const { login } = useAuthContext()

  const disabledReason = (!loggedIn && t('unauthorized_not_logged_in')) || (!attending && t('unauthorized_not_attending')) || (!checkedIn && t('unauthorized_not_checked_in'))

  return (
    <View style={styles.container}>
      <Label type="compact" className="mt-5">
        {t('explanation_unauthorized')}

        {disabledReason && (
          <Label color="important" variant="bold">
            {' ' + disabledReason}
          </Label>
        )}
      </Label>
      {loggedIn ? null : (
        <Button style={styles.button} iconRight="login" onPress={() => login().catch(captureException)}>
          {t('log_in_now')}
        </Button>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },
  button: {
    marginTop: 20,
  },
})
