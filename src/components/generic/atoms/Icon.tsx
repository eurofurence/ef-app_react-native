import MaterialCommunityIcon from '@expo/vector-icons/MaterialCommunityIcons'
import { Platform } from 'react-native'

export type IconNames = keyof typeof MaterialCommunityIcon.glyphMap

export const Icon = MaterialCommunityIcon

export const platformShareIcon: IconNames = Platform.OS === 'ios' ? 'export-variant' : 'share'
