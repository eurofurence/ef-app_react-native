import React from 'react'
import { Picker } from '@react-native-picker/picker'
import { captureException } from '@sentry/react-native'
import { orderBy } from 'lodash'
import { useTranslation } from 'react-i18next'
import { SettingContainer } from './SettingContainer'
import { useThemeColorValue } from '@/hooks/themes/useThemeHooks'
import { Translation } from '@/i18n'
import { Label } from '@/components/generic/atoms/Label'
import { useCache } from '@/context/data/Cache'

/**
 * Element of languages that the picker displays.
 */
type Language = {
    /**
     * Language code, must be one of our translations.
     */
    code: Translation;

    /**
     * Display name with flag code.
     */
    name: string;
};

/**
 * List of language codes and display names.
 */
const languages = orderBy(
    [
        { code: 'en', name: '🇬🇧 English' },
        { code: 'de', name: '🇩🇪 Deutsch' },
        { code: 'nl', name: '🇳🇱 Nederlands' },
        { code: 'it', name: '🇮🇹 Italiano' },
        { code: 'pl', name: '🇵🇱 Polski' },
        { code: 'da', name: '🇩🇰 Dansk' },
    ] as Language[],
    (value) => value.code,
    'asc',
)

/**
 * This component controls the language by directly injecting into the i18n
 * instance and changing the language there.
 */
export const LanguagePicker = () => {
    const { t, i18n } = useTranslation('Settings')
    const textColor = useThemeColorValue('text')
    const { getValue, setValue } = useCache()
    const settings = getValue('settings')

    const handleLanguageChange = async (language: string) => {
        try {
            await i18n.changeLanguage(language)
            setValue('settings', {
                ...settings,
                language,
            })
        } catch (error) {
            captureException(error)
        }
    }

    return (
        <SettingContainer>
            <Label variant="bold">{t('changeLanguage')}</Label>
            <Label variant="narrow">{t('currentLanguage')}</Label>
            <Picker<string>
                selectedValue={settings.language ?? i18n.language}
                style={{ color: textColor }}
                dropdownIconColor={textColor}
                prompt={t('changeLanguage')}
                onValueChange={handleLanguageChange}
            >
                {languages.map((it) => (
                    <Picker.Item
                        label={it.name}
                        value={it.code}
                        key={it.code}
                        color={textColor}
                    />
                ))}
            </Picker>
        </SettingContainer>
    )
}
