import { Tabs } from 'expo-router'
import React, { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Icon, IconNames } from '@/components/generic/atoms/Icon'
import { Tabs as CustomTabs, TabsRef } from '@/components/generic/containers/Tabs'
import { MainMenu } from '@/components/mainmenu/MainMenu'
import { Toast } from '@/components/Toast'
import { useCache } from '@/context/data/Cache'
import { useToastMessages } from '@/context/ui/ToastContext'

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'

export const unstable_settings = {
  initialRouteName: 'index',
}

function getIconNameFromTabBarIcon(
  tabBarIcon: ((props: { focused: boolean; color: string; size: number }) => React.ReactNode) | undefined,
  isFocused: boolean,
  activeTintColor?: string,
  inactiveTintColor?: string
): IconNames {
  if (!tabBarIcon) return 'home'
  const element = tabBarIcon({
    focused: isFocused,
    color: isFocused ? (activeTintColor ?? '#000') : (inactiveTintColor ?? '#999'),
    size: 24,
  })
  if (React.isValidElement<{ name: IconNames }>(element) && element.props.name) {
    return element.props.name
  }
  return 'home'
}

function AreasTabBar(props: BottomTabBarProps) {
  const tabs = useRef<TabsRef>(null)
  const { t } = useTranslation('Menu')
  const toastMessages = useToastMessages(5)
  const { isSynchronizing } = useCache()
  const { bottom } = useSafeAreaInsets()

  const tabEntries = useMemo(
    () =>
      props.state.routes.map((route, i) => {
        const { options } = props.descriptors[route.key]
        const isFocused = props.state.index === i

        return {
          active: props.state.index === i,
          // TODO: Better integration.
          style: options.tabBarItemStyle,
          icon: getIconNameFromTabBarIcon(options.tabBarIcon, isFocused, options.tabBarActiveTintColor, options.tabBarInactiveTintColor),
          text: options.title ?? route.name,
          onPress: () => {
            const event = props.navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              props.navigation.navigate(route.name)
            }
            tabs.current?.close()
          },
          indicate: typeof options.tabBarBadge === 'boolean' || typeof options.tabBarBadge === 'number' ? options.tabBarBadge : undefined,
        }
      }),
    [props.descriptors, props.navigation, props.state.index, props.state.routes]
  )

  return (
    <CustomTabs
      padding={bottom - 10}
      ref={tabs}
      tabs={tabEntries}
      textMore={t('more')}
      textLess={t('less')}
      activity={isSynchronizing}
      notice={
        !toastMessages.length ? null : (
          <View>
            {[...toastMessages].reverse().map((toast) => (
              <Toast key={toast.id} {...toast} loose={false} />
            ))}
          </View>
        )
      }
    >
      <MainMenu tabs={tabs} />
    </CustomTabs>
  )
}

export default function TabsLayout() {
  const { t } = useTranslation('Menu')

  return (
    <View style={styles.container}>
      <Tabs initialRouteName="index" screenOptions={{ headerShown: false }} tabBar={(props) => <AreasTabBar {...props} />}>
        <Tabs.Screen
          name="index"
          options={{
            title: t('home'),
            tabBarIcon: ({ color, size }) => <Icon name="home" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="schedule"
          options={{
            title: t('events'),
            tabBarIcon: ({ color, size }) => <Icon name="calendar" size={size} color={color} />,
            href: 'schedule',
          }}
        />
        <Tabs.Screen
          name="dealers"
          options={{
            title: t('dealers'),
            tabBarIcon: ({ color, size }) => <Icon name="cart-outline" size={size} color={color} />,
            href: 'dealers',
          }}
        />
      </Tabs>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
})
