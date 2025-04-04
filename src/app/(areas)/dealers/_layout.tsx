import type { ParamListBase, TabNavigationState } from '@react-navigation/native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import type {
    MaterialTopTabNavigationOptions,
    MaterialTopTabNavigationEventMap,
} from '@react-navigation/material-top-tabs'
import { router, UnknownOutputParams, useGlobalSearchParams, usePathname, withLayoutContext } from 'expo-router'
import { TabBar } from 'react-native-tab-view'
import * as React from 'react'
import { StyleSheet, useWindowDimensions, View } from 'react-native'
import { TabLabel } from '@/components/generic/atoms/TabLabel'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { Search } from '@/components/generic/atoms/Search'
import { IconNames } from '@/components/generic/atoms/Icon'

const { Navigator } = createMaterialTopTabNavigator()

/**
 * Customized screen options for unified icon rendering handling.
 */
type TabViewOptions = MaterialTopTabNavigationOptions & { icon?: IconNames };

/**
 * Customized tab view for this layout.
 */
const MaterialTopTabs = withLayoutContext<
    TabViewOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
>(Navigator)

/**
 * Utility to match `useLocalSearchParams` for child routes.
 * @param path
 */
function useRelativeSearchParams<TParams extends UnknownOutputParams = UnknownOutputParams>(path: string): TParams {
    const pathname = usePathname()
    const params = useGlobalSearchParams<TParams>()
    if (pathname.startsWith(path))
        return params as TParams
    else
        return {} as TParams
}


export const dealersRoutePrefix = '/dealers/'

function setFilter(value: string) {
    router.setParams({ query: value })
}

export default function DealersLayout() {
    const { query } = useRelativeSearchParams<{ query?: string }>(dealersRoutePrefix)

    const layout = useWindowDimensions()

    const backgroundSurface = useThemeBackground('surface')
    const backgroundBackground = useThemeBackground('background')
    const backgroundSecondary = useThemeBackground('secondary')

    return <MaterialTopTabs
        initialRouteName="all"
        style={StyleSheet.absoluteFill}
        screenOptions={{ sceneStyle: backgroundSurface }}
        tabBar={props =>
            <View>
                <TabBar
                    {...props}
                    key="tabbar"
                    navigationState={{ routes: props.state.routes, index: props.state.index }}
                    renderLabel={({ focused, route }) => {
                        const options = props.descriptors[route.key].options as TabViewOptions
                        return <TabLabel focused={focused} icon={options.icon} title={options.title} />
                    }}
                    style={backgroundBackground}
                    indicatorStyle={backgroundSecondary}
                    onTabPress={(props) => {
                        // Replace tab press handling with immediate router navigation.
                        router.replace({
                            pathname: (dealersRoutePrefix + props.route.name) as string,
                            params: {},
                        })
                        props.preventDefault()
                    }}
                    tabStyle={{ width: layout.width / props.state.routes.length }}
                />
                <Search style={styles.search} filter={query || ''} setFilter={setFilter} />
            </View>}>
        <MaterialTopTabs.Screen name="personal" options={{ title: 'Faves', icon: 'calendar-heart' }} />
        <MaterialTopTabs.Screen name="all" options={{ title: 'All' }} />
        <MaterialTopTabs.Screen name="regular" options={{ title: 'Regular' }} />
        <MaterialTopTabs.Screen name="ad" options={{ title: 'AD' }} />
        <MaterialTopTabs.Screen name="az" options={{ title: 'A-Z', icon: 'order-alphabetical-ascending' }} />
    </MaterialTopTabs>
}

const styles = StyleSheet.create({
    search: {
        marginVertical: 10,
    },
})
