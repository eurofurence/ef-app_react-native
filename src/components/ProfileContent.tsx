import { captureException } from '@sentry/react-native'
import { type FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, useWindowDimensions, View } from 'react-native'
import { SvgXml } from 'react-native-svg'

import { authSettingsUrl, conName } from '@/configuration'
import { auth } from '@/data/clients/auth'
import { inRole } from '@/data/clients/auth.utils'
import type { EfClaims } from '@/data/types/EfClaims'
import type { EfUser } from '@/data/types/EfUser'
import { useUserDatamatrix } from '@/hooks/api/users/useUserDatamatrix'
import type { UserDetails } from '@/hooks/api/users/useUsersSelf'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { Image } from './generic/atoms/Image'
import { Label } from './generic/atoms/Label'
import { Section } from './generic/atoms/Section'
import { Badge } from './generic/containers/Badge'
import { Button } from './generic/containers/Button'

/**
 * User role pill.
 * @param role The role name.
 * @constructor
 */
const UserRole: FC<{ role: string }> = ({ role }) => {
  const bg = useThemeBackground('primary')
  const text = useMemo(() => {
    return role.replaceAll(/[A-Z]/g, (s) => ` ${s}`)
  }, [role])

  return (
    <View style={[bg, styles.pill]}>
      <Label type='minor' variant='middle' color='white'>
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
const UserRegistration: FC<{ id: string; status: string }> = ({
  id,
  status,
}) => {
  const { t } = useTranslation('Profile')
  const { t: tStatus } = useTranslation('Profile', {
    keyPrefix: 'status_names',
  })
  const bg = useThemeBackground('secondary')
  return (
    <View style={[bg, styles.pill]}>
      <Label variant='bold' color='white'>
        {t('registration_nr')} {id} | {tStatus(status)}
      </Label>
    </View>
  )
}

export type ProfileContentProps = {
  claims: EfClaims
  user: EfUser
  parentPad?: number
}

/**
 * User profile page.
 * @param claims The IDP user claims.
 * @param user The backend user info.
 * @param parentPad The padding that the parent will apply.
 * @constructor
 */
export const ProfileContent: FC<ProfileContentProps> = ({
  claims,
  user,
  parentPad = 0,
}) => {
  const { t } = useTranslation('Profile')
  const { t: a11y } = useTranslation('Profile')
  const avatarBackground = useThemeBackground('primary')

  const { data: datamatrix } = useUserDatamatrix()
  const { width: windowWidth } = useWindowDimensions()
  const datamatrixSize = Math.min(windowWidth * 0.8, 300)

  // The API returns an SVG with fixed pixel dimensions but no viewBox - do you like it?
  const scalableDatamatrix = useMemo(() => {
    if (!datamatrix) return null
    if (/viewBox=/.test(datamatrix)) return datamatrix
    const width = datamatrix.match(/width="(\d+(?:\.\d+)?)/)?.[1]
    const height = datamatrix.match(/height="(\d+(?:\.\d+)?)/)?.[1]
    if (!width || !height) return datamatrix
    return datamatrix
      .replace(/(\s)width="[^"]*"/, '$1')
      .replace(/(\s)height="[^"]*"/, '$1')
      .replace(/<svg/, `<svg viewBox="0 0 ${width} ${height}"`)
  }, [datamatrix])

  const isAttendee = inRole(user, 'Attendee')
  const isCheckedIn = inRole(user, 'AttendeeCheckedIn')
  const roleComplex = Boolean(
    user.Roles.find(
      (role) => role !== 'Attendee' && role !== 'AttendeeCheckedIn'
    )
  )
  return (
    <>
      {isCheckedIn ? (
        <Badge unpad={parentPad} badgeColor='primary' textColor='invText'>
          {t('roles_simple_checked_in')}
        </Badge>
      ) : isAttendee ? (
        <Badge unpad={parentPad} badgeColor='warning' textColor='invText'>
          {t('roles_simple_attendee')}
        </Badge>
      ) : null}
      <View style={styles.avatarContainer}>
        <Image
          style={[avatarBackground, styles.avatarCircle]}
          source={claims.avatar ?? require('@/assets/static/ych.png')}
          contentFit='contain'
          placeholder={require('@/assets/static/ych.png')}
          transition={60}
          cachePolicy='memory-disk'
          priority='high'
          accessibilityLabel={a11y('accessibility.user_avatar', {
            name: claims.name as string,
          })}
          accessibilityHint={a11y('accessibility.avatar_hint')}
        />
      </View>

      <Label type='h1' variant='middle'>
        {claims.name as string}
      </Label>

      <Label type='caption' variant='middle' className='mb-5'>
        {claims.email as string}
      </Label>

      <View style={styles.registrations}>
        {user.Registrations.map((r) => (
          <UserRegistration key={r.Id} id={r.Id} status={r.Status} />
        ))}
      </View>

      <Label className='mt-5' type='para'>
        {t('login_description', { conName })}
      </Label>

      <Button
        style={styles.idpButton}
        outline
        icon='web'
        onPress={() => Linking.openURL(authSettingsUrl).catch(captureException)}
        accessibilityLabel={a11y('accessibility.idp_settings_button')}
        accessibilityHint={a11y('accessibility.idp_settings_button_hint')}
        accessibilityRole='button'
      >
        {t('idp_settings')}
      </Button>

      {datamatrix && (
        <>
          <Section
            icon='barcode-scan'
            title={t('badge_code')}
            subtitle={t('badge_code_subtitle')}
          />
          <View
            style={[
              styles.datamatrixContainer,
              { width: datamatrixSize, height: datamatrixSize },
            ]}
          >
            <SvgXml
              xml={scalableDatamatrix}
              width='100%'
              height='100%'
              preserveAspectRatio='xMidYMid meet'
            />
          </View>
        </>
      )}

      {roleComplex && (
        <>
          <Section
            icon='account-group'
            title={t('roles')}
            subtitle={t('roles_subtitle', { conName })}
          />
          <View style={styles.roles}>
            {user.Roles.filter(
              (value, index, array) => array.indexOf(value) === index
            ).map((r) => (
              <UserRole key={r} role={r} />
            ))}
          </View>
        </>
      )}

      <Button
        style={styles.logoutButton}
        icon='logout'
        onPress={() => auth.logout().catch(captureException)}
        accessibilityLabel={a11y('accessibility.logout_button')}
        accessibilityHint={a11y('accessibility.logout_button_hint')}
        accessibilityRole='button'
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
  datamatrixContainer: {
    alignSelf: 'center',
    marginVertical: 20,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  logoutButton: {
    marginTop: 20,
  },
  pill: {
    padding: 10,
    borderRadius: 10,
  },
})
