import { captureException } from '@sentry/react-native'
import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, View } from 'react-native'
import { Image } from './generic/atoms/Image'
import { Label } from './generic/atoms/Label'
import { Section } from './generic/atoms/Section'
import { Badge } from './generic/containers/Badge'
import { Button } from './generic/containers/Button'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { useAuthContext } from '@/context/auth/Auth'
import { authSettingsUrl, conName } from '@/configuration'
import { UserDetails } from '@/context/auth/User'
import { Claims } from '@/context/auth/Auth'
import { appStyles } from '@/components/AppStyles'

/**
 * User role pill.
 * @param role The role name.
 * @constructor
 */
const UserRole: FC<{ role: string }> = ({ role }) => {
  const bg = useThemeBackground('primary')
  const text = useMemo(() => {
    return role.replaceAll(/[A-Z]/g, (s) => ' ' + s)
  }, [role])

  return (
    <View style={[bg, styles.pill]}>
      <Label type="minor" variant="middle" color="white">
        {text}
      </Label>
    </View>
  )
}

/**
 * User registration pill. Usually only one is displayed.
 * @param id The user's ID.
 * @param status The registration status, e.g., paid.
 * @constructor
 */
const UserRegistration: FC<{ id: string; status: string }> = ({ id, status }) => {
  const { t } = useTranslation('Profile')
  const { t: tStatus } = useTranslation('Profile', { keyPrefix: 'status_names' })
  const bg = useThemeBackground('secondary')
  return (
    <View style={[bg, styles.pill]}>
      <Label variant="bold" color="white">
        {t('registration_nr')} {id} | {tStatus(status)}
      </Label>
    </View>
  )
}

export type ProfileContentProps = {
  claims: Claims
  user: UserDetails
  parentPad?: number
}

/**
 * User profile page.
 * @param claims The IDP user claims.
 * @param user The backend user info.
 * @param parentPad The padding that the parent will apply.
 * @constructor
 */
export const ProfileContent: FC<ProfileContentProps> = ({ claims, user, parentPad = 0 }) => {
  const { t } = useTranslation('Profile')
  const { t: a11y } = useTranslation('Profile')
  const avatarBackground = useThemeBackground('primary')
  const { logout } = useAuthContext()

  const isAttendee = user.RoleMap.Attendee
  const isCheckedIn = user.RoleMap.AttendeeCheckedIn
  const roleComplex = Boolean(user.Roles.find((role) => role !== 'Attendee' && role !== 'AttendeeCheckedIn'))
  return (
    <>
      {isCheckedIn ? (
        <Badge unpad={parentPad} badgeColor="primary" textColor="invText">
          {t('roles_simple_checked_in')}
        </Badge>
      ) : isAttendee ? (
        <Badge unpad={parentPad} badgeColor="warning" textColor="invText">
          {t('roles_simple_attendee')}
        </Badge>
      ) : null}
      <View style={styles.avatarContainer}>
        <Image
          style={[avatarBackground, styles.avatarCircle]}
          source={claims.avatar ?? require('@/assets/static/ych.png')}
          contentFit="contain"
          placeholder={require('@/assets/static/ych.png')}
          transition={60}
          cachePolicy="memory"
          priority="high"
          accessibilityLabel={a11y('accessibility.user_avatar', { name: claims.name as string })}
          accessibilityHint={a11y('accessibility.avatar_hint')}
        />
      </View>

      <Label type="h1" variant="middle">
        {claims.name as string}
      </Label>

      <Label type="caption" variant="middle" className="mb-5">
        {claims.email as string}
      </Label>

      <View style={styles.registrations}>
        {user.Registrations.map((r) => (
          <UserRegistration key={r.Id} id={r.Id} status={r.Status} />
        ))}
      </View>

      <Label className="mt-5" type="para">
        {t('login_description', { conName })}
      </Label>

      <Button
        style={styles.idpButton}
        outline
        icon="web"
        onPress={() => Linking.openURL(authSettingsUrl).catch(captureException)}
        accessibilityLabel={a11y('accessibility.idp_settings_button')}
        accessibilityHint={a11y('accessibility.idp_settings_button_hint')}
        accessibilityRole="button"
      >
        {t('idp_settings')}
      </Button>

      {roleComplex && (
        <>
          <Section icon="account-group" title={t('roles')} subtitle={t('roles_subtitle', { conName })} />
          <View style={styles.roles}>
            {user.Roles.filter((value, index, array) => array.indexOf(value) === index).map((r) => (
              <UserRole key={r} role={r} />
            ))}
          </View>
        </>
      )}

      <Button
        style={styles.logoutButton}
        icon="logout"
        onPress={() => logout().catch(captureException)}
        accessibilityLabel={a11y('accessibility.logout_button')}
        accessibilityHint={a11y('accessibility.logout_button_hint')}
        accessibilityRole="button"
      >
        {t('logout')}
      </Button>
    </>
  )
}

const styles = StyleSheet.create({
  avatarContainer: {
    margin: 25,
    alignSelf: 'center',
  },
  avatarCircle: {
    width: 200,
    height: 200,
    aspectRatio: 1,
    borderRadius: 100,
  },
  registrations: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  idpButton: {
    marginTop: 20,
  },
  roles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  logoutButton: {
    marginTop: 20,
  },
  pill: {
    padding: 10,
    borderRadius: 10,
  },
})
