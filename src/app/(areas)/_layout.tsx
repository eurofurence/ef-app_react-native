import { Tabs } from "expo-router";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import { Toast } from "@/components/Toast";
import { Icon, IconNames } from "@/components/generic/atoms/Icon";
import { useToastMessages } from "@/context/ToastContext";
import { useDataCache } from "@/context/DataCacheProvider";
import { Tabs as CustomTabs, TabsRef } from "@/components/generic/containers/Tabs";
import { MainMenu } from "@/components/mainmenu/MainMenu";

function getIconNameFromTabBarIcon(
    tabBarIcon: ((props: { focused: boolean; color: string; size: number }) => React.ReactNode) | undefined,
    isFocused: boolean,
    activeTintColor?: string,
    inactiveTintColor?: string
): IconNames {
    if (!tabBarIcon) return 'home';
    const element = tabBarIcon({
        focused: isFocused,
        color: isFocused ? (activeTintColor ?? '#000') : (inactiveTintColor ?? '#999'),
        size: 24
    });
    if (React.isValidElement(element) && element.props.name) {
        return element.props.name;
    }
    return 'home';
}

function AreasTabBar(props: BottomTabBarProps) {
    const tabs = useRef<TabsRef>(null);
    const { t } = useTranslation("Menu");
    const toastMessages = useToastMessages(5);
    const { isSynchronizing } = useDataCache();

    return (
        <CustomTabs
            ref={tabs}
            tabs={props.state.routes.map((route, i) => {
                const { options } = props.descriptors[route.key];
                const isFocused = props.state.index === i;

                return {
                    active: props.state.index === i,
                    icon: getIconNameFromTabBarIcon(
                        options.tabBarIcon,
                        isFocused,
                        options.tabBarActiveTintColor,
                        options.tabBarInactiveTintColor
                    ),
                    text: options.title ?? route.name,
                    onPress: () => {
                        const event = props.navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            props.navigation.navigate(route.name);
                        }
                        tabs.current?.close();
                    },
                    indicate: typeof options.tabBarBadge === 'boolean' || typeof options.tabBarBadge === 'number' 
                        ? options.tabBarBadge 
                        : undefined,
                };
            })}
            textMore={t("more")}
            textLess={t("less")}
            activity={isSynchronizing}
            notice={!toastMessages.length ? null : (
                <View style={styles.toasts}>
                    {[...toastMessages].reverse().map((toast) => (
                        <Toast key={toast.id} {...toast} loose={false} />
                    ))}
                </View>
            )}
        >
            <MainMenu tabs={tabs} />
        </CustomTabs>
    );
}

export default function TabsLayout() {
    const { t } = useTranslation("Menu");

    return (
        <View style={styles.container}>
            <Tabs
                screenOptions={{
                    headerShown: false,
                }}
                tabBar={props => <AreasTabBar {...props} />}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: t("home"),
                        tabBarIcon: ({ color, size }) => <Icon name="home" size={size} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="events"
                    options={{
                        title: t("events"),
                        tabBarIcon: ({ color, size }) => <Icon name="calendar" size={size} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="dealers"
                    options={{
                        title: t("dealers"),
                        tabBarIcon: ({ color, size }) => <Icon name="cart-outline" size={size} color={color} />,
                    }}
                />
            </Tabs>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    toasts: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    activity: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#007AFF', // You might want to use your theme color here
    }
});
