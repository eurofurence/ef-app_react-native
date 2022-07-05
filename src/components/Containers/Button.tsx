import Ionicons from '@expo/vector-icons/Ionicons'
import {FC, ReactNode, useMemo} from 'react'
import {StyleProp, StyleSheet, Text, ViewStyle} from 'react-native'
import {TouchableOpacity} from 'react-native-gesture-handler'

import {useTheme} from '../../context/Theme'
import {IconiconsNames} from '../../types/Ionicons'
import {Label} from '../Atoms/Label'

/**
 * Arguments to the button.
 */
export interface ButtonProps {
    /**
     * The style for the view arranging the button's layout.
     */
    containerStyle?: StyleProp<ViewStyle>

    /**
     * The style for the view arranging the button's content.
     */
    style?: StyleProp<ViewStyle>

    /**
     * True if outline button instead of filled button.
     */
    outline?: boolean

    /**
     * If given, displayed as the button's icon.
     */
    icon?: IconiconsNames

    /**
     * The text of the button.
     */
    children?: string

    /**
     * If given, invoked on button press.
     */
    onPress?: () => void
}

export const Button: FC<ButtonProps> = ({containerStyle, style, outline, icon, children, onPress}) => {
    // Computed styles.
    const theme = useTheme()
    const base = useMemo(() => (outline ? styles.outlineContent : styles.fillContent), [outline])
    const fill = useMemo(() => ({backgroundColor: outline ? theme.background : theme.inverted}), [outline, theme])

    return (
        <TouchableOpacity containerStyle={containerStyle} style={[base, fill, style]} onPress={onPress}>
            {!icon ? null : (
                <Ionicons
                    style={styles.icon}
                    name={icon}
                    size={24}
                    color={outline ? theme.important : theme.invImportant}
                />
            )}

            {!children ? null : (
                <Label style={styles.text} color={outline ? 'important' : 'invImportant'}>
                    {children}
                </Label>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    fillContent: {
        height: 44,
        borderRadius: 16,
        padding: 10,
        backgroundColor: 'black',
        justifyContent: 'center'
    },
    outlineContent: {
        borderRadius: 16,
        padding: 8,
        borderColor: 'black',
        borderWidth: 2,
        justifyContent: 'center'
    },
    icon: {},
    text: {
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    outlineText: {
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        textAlignVertical: 'center'
    }
})
