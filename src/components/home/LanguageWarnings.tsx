import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Label } from '../generic/atoms/Label'
import { useWarningState } from '@/hooks/data/useWarningState'
import { View } from 'react-native'
import { Icon } from '@/components/generic/atoms/Icon'
import { useThemeColorValue } from '@/hooks/themes/useThemeHooks'

export type LanguageWarningsProps = {
  /**
   * The padding used by the parent horizontally.
   */
  parentPad?: number
}

export const LanguageWarnings: FC<LanguageWarningsProps> = ({ parentPad = 0 }) => {
  const { t } = useTranslation('Home')
  const iconColor = useThemeColorValue('important')
  const notice = t('content_untranslated')
  const { isHidden, hideWarning } = useWarningState('languageWarningsHidden')

  if (isHidden || notice === '') return null

  return (
    <>
      <View className="pt-8 pb-4 self-stretch">
        <View className="self-stretch flex-row items-center">
          <Icon color={iconColor} name="translate" size={24} />
          <Label className="ml-2 flex-1" type="h2" color="important" ellipsizeMode="tail">
            {t('warnings.language')}
          </Label>
          <Label className="leading-8" type="compact" variant="bold" color="secondary" onPress={hideWarning}>
            {t('warnings.hide')}
          </Label>
        </View>
      </View>

      <Label type="para">{notice}</Label>
    </>
  )
}
