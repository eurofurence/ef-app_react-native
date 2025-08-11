import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { Image } from '@/components/generic/atoms/Image'
import { useTranslation } from 'react-i18next'
import { useUserContext } from '@/context/auth/User'

export const Avatar = ({ size = 32 }: { size?: number }) => {
  const { claims } = useUserContext()
  const avatarBackground = useThemeBackground('primary')
  const { t } = useTranslation('Profile')

  const hasCustomAvatar = claims?.avatar && claims.avatar !== require('@/assets/static/ych.png')
  const userName = claims?.name || claims?.username || 'User'

  return (
    <Image
      style={[avatarBackground, { width: size, height: size, borderRadius: size / 2 }]}
      source={claims?.avatar ?? require('@/assets/static/ych.png')}
      contentFit="contain"
      placeholder={require('@/assets/static/ych.png')}
      transition={60}
      cachePolicy="memory-disk"
      priority="high"
      accessibilityRole="image"
      accessibilityLabel={hasCustomAvatar ? t('accessibility.user_avatar', { name: userName }) : t('accessibility.default_avatar')}
      accessibilityHint={t('accessibility.avatar_hint')}
    />
  )
}
