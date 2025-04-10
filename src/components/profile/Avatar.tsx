import { useAuthContext } from '@/context/AuthContext'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { Image } from '@/components/generic/atoms/Image'

export const Avatar = ({ size = 32 }: { size?: number }) => {
    const { claims } = useAuthContext()
    const avatarBackground = useThemeBackground('primary')

    return <Image
        style={[avatarBackground, { width: size, height: size, borderRadius: size / 2 }]}
        source={claims?.avatar ?? require('@/assets/static/ych.png')}
        contentFit="contain"
        placeholder={require('@/assets/static/ych.png')}
        transition={60}
        cachePolicy="memory"
        priority="high"
    />
}
