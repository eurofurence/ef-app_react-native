import { Picker } from '@react-native-picker/picker'
import { captureException } from '@sentry/react-native'
import { orderBy } from 'lodash'
import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, Platform } from 'react-native'

import { Label } from '@/components/generic/atoms/Label'
import { useCache } from '@/context/data/Cache'
import { useThemeColorValue } from '@/hooks/themes/useThemeHooks'
import { Translation } from '@/i18n'

import { Button } from '../generic/containers/Button'

import { SettingContainer } from './SettingContainer'

/**
 * Element of languages that the picker displays.
 */
type Language = {
  /**
   * Language code, must be one of our translations.
   */
  code: Translation

  /**
   * Display name with flag code.
   */
  name: string
}

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
  ] as Language[],
  (value) => value.code,
  'asc'
)

/**
 * This component controls the language by directly injecting into the i18n
 * instance and changing the language there.
 */
export const LanguagePicker = () => {
  const { t, i18n } = useTranslation('Settings')
  const textColor = useThemeColorValue('text')
  const { data, setValue } = useCache()
  const settings = data.settings
  const [showPicker, setShowPicker] = useState(false)
  const [renderPicker, setRenderPicker] = useState(false)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(0)).current

  const currentLanguage = settings.language ?? i18n.language
  const currentLanguageData = languages.find((lang) => lang.code === currentLanguage) || languages[0]

  // Animation for the picker for opening and closing.
  useEffect(() => {
    if (showPicker) {
      setRenderPicker(true)
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start(() => {
        setRenderPicker(false)
      })
    }
  }, [showPicker, fadeAnim, slideAnim])

  const handleLanguageChange = async (language: string) => {
    try {
      await i18n.changeLanguage(language)
      setValue('settings', (current) => ({
        ...current,
        language,
      }))
    } catch (error) {
      captureException(error)
    }
  }

  return (
    <SettingContainer>
      <Label variant="bold">{t('changeLanguage')}</Label>
      <Label variant="narrow" className="mb-2">
        {t('currentLanguage')}
      </Label>

      {!showPicker ? (
        <Button onPress={() => setShowPicker(true)}>{currentLanguageData.name}</Button>
      ) : (
        renderPicker && (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            }}
          >
            <Picker<string>
              selectedValue={currentLanguage}
              style={{ color: textColor }}
              dropdownIconColor={textColor}
              prompt={t('changeLanguage')}
              onValueChange={handleLanguageChange}
            >
              {languages.map((it) => (
                <Picker.Item label={it.name} value={it.code} key={it.code} color={textColor} />
              ))}
            </Picker>
            <Button onPress={() => setShowPicker(false)}>Close</Button>
          </Animated.View>
        )
      )}
    </SettingContainer>
  )
}
