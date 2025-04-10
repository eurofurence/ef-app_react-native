import { StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { SettingContainer } from './SettingContainer'
import { ThemeName } from '@/context/Theme'
import { useTheme } from '@/hooks/themes/useTheme'
import { ChoiceButtons } from '@/components/generic/atoms/ChoiceButtons'
import { Col } from '@/components/generic/containers/Col'
import { Label } from '@/components/generic/atoms/Label'

type ThemeChoice = ThemeName | 'system';

const usableThemes: ThemeChoice[] = ['light', 'medium', 'dark', 'system']

export const ThemePicker = () => {
    const { t } = useTranslation('Settings', { keyPrefix: 'theme' })
    const { theme, setTheme } = useTheme()

    return (
        <SettingContainer>
            <Col type="stretch">
                <Label variant="bold">{t('title')}</Label>
                <Label variant="narrow">{t('description')}</Label>
                <ChoiceButtons
                    style={styles.selector}
                    choices={usableThemes}
                    choice={theme === undefined ? 'system' : theme}
                    setChoice={choice => setTheme(choice === 'system' ? undefined : choice)}
                    getLabel={(choice) => t(choice)}
                />
            </Col>
        </SettingContainer>
    )
}

const styles = StyleSheet.create({
    selector: {
        marginTop: 16,
    },
})
