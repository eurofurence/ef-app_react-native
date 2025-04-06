import { nativeApplicationVersion, nativeBuildVersion } from 'expo-application'
import { ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { useTranslation } from 'react-i18next'
import { router } from 'expo-router'
import { Sound } from 'expo-av/build/Audio/Sound'
import React, { useCallback } from 'react'
import { Alert, Linking, Platform, StyleSheet } from 'react-native'
import { Row } from '@/components/generic/containers/Row'
import { Image } from '@/components/generic/atoms/Image'
import { Col } from '@/components/generic/containers/Col'
import { Label } from '@/components/generic/atoms/Label'
import { Header } from '@/components/generic/containers/Header'
import { Floater } from '@/components/generic/containers/Floater'
import { Section } from '@/components/generic/atoms/Section'
import { Button } from '@/components/generic/containers/Button'
import { MarkdownContent } from '@/components/generic/atoms/MarkdownContent'
import { useTheme } from '@/hooks/themes/useTheme'
import { useCache } from '@/context/data/Cache'
import { appStyles } from '@/components/AppStyles'
import { useMultiTap } from '@/hooks/util/useMultiTap'
import { conName } from '@/configuration'

const extraThanksMarkdown = `
# Tooling

We use React-Native and Expo to make this experience possible.

Firebase provides us with cloud messaging and analytics.

And Sentry helps us out with exception tracing.

# People

## App Team Alumni

- [Luchs](https://github.com/Pinselohrkater) (IT vice director & app team lead)
- [Shez](https://github.com/ShezHsky) (iOS app developer)
- Zefiro (IT director)

## Other Special People

- Akulatraxas
- Aragon Tigerseye
- Atkelar
- Cairyn
- Carenath Stormwind
- IceTiger
- Jul
- Liam
- NordicFuzzCon (Catch'em all)
- Pattarchus
- Snow-wolf
- StreifiGreif
- [Wane](https://github.com/pavelsinkevich)
- Xil

## English Translations

- Fenrikur
- Luchs
- Pazuzu
- Requinard

## German Translations

- Fenrikur
- Luchs
- Pazuzu
- Requinard

## Dutch Translations

- Pazuzu
- Requinard

## Italian Translations

- Siepnir

## Polish Translations

- Lemurr

## Danish Translations

- Wovaka

# Disclaimer

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`

type CreditProps = {
    url: string;
    name: string;
    role: string;
    onEasterEgg?: () => void;
};

const Credit = ({ url, name, role, onEasterEgg }: CreditProps) => {
    return (
        <TouchableOpacity onPress={() => router.navigate({
            pathname: '/images/web', params: { url, title: name },
        })} onLongPress={onEasterEgg} delayLongPress={2000}>
            <Row type="center" style={{ marginVertical: 5 }}>
                <Image
                    source={url}
                    style={{
                        borderRadius: 100,
                        width: 60,
                        height: 60,
                    }}
                    cachePolicy="memory-disk"
                />

                <Col style={{ flex: 1, marginLeft: 10 }}>
                    <Label type="h2">{name}</Label>
                    <Label>{role}</Label>
                </Col>
            </Row>
        </TouchableOpacity>
    )
}

export default function AboutScreen() {
    const { t } = useTranslation('About')
    const { getValue, setValue } = useCache()
    const { setTheme } = useTheme()

    const settings = getValue('settings')

    // Load static assets.
    const requinardEgg = useCallback(async () => {
        const { sound } = await Sound.createAsync(require('@/assets/runtime/cheese.webm'))
        await sound.playAsync()
        setTheme('requinard')
    }, [setTheme])

    const pazuzuEgg = useCallback(async () => {
        const { sound } = await Sound.createAsync(require('@/assets/runtime/sheesh.webm'))
        await sound.playAsync()
        setTheme('pazuzu')
    }, [setTheme])

    const toggleDevMenu = useMultiTap(10, useCallback(() => {
        const setDevMenu = (enabled: boolean) =>
            setValue('settings', {
                ...settings,
                devMenu: enabled,
            })

        if (Platform.OS === 'web') {
            // On web, toggle with window confirm as we don't have Alert functionality.
            if (window.confirm(settings.devMenu ? 'Turn dev menu off?' : 'Turn dev menu on?')) {
                setDevMenu(!settings.devMenu)
            }
        } else {
            // Show alert for toggling.
            Alert.alert(t('developer_settings_alert.title'), t('developer_settings_alert.body'), [
                {
                    text: t('developer_settings_alert.cancel'),
                    onPress: () => undefined,
                    style: 'cancel',
                },
                {
                    text: t('developer_settings_alert.disable'),
                    onPress: () => setDevMenu(false),
                    style: 'default',
                },
                {
                    text: t('developer_settings_alert.enable'),
                    onPress: () => setDevMenu(true),
                    style: 'destructive',
                },
            ])
        }
    }, [setValue, settings, t]))

    return (
        <ScrollView style={StyleSheet.absoluteFill} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
            <Header>{t('header')}</Header>
            <Floater contentStyle={appStyles.trailer}>
                <TouchableWithoutFeedback style={{ cursor: 'auto' }} onPress={toggleDevMenu}>
                    <Col style={styles.marginAround} type="center">
                        <Label type="h1" mb={10}>{conName} App</Label>
                        <Row gap={5}>
                            <Label type="caption">Version</Label>
                            <Label type="caption" color="important">{nativeApplicationVersion || 'Not defined'}</Label>
                        </Row>
                        <Row gap={5}>
                            <Label type="caption">Build number</Label>
                            <Label type="caption" color="important">{nativeBuildVersion || 'Not defined'}</Label>
                        </Row>
                    </Col>
                </TouchableWithoutFeedback>

                <Row style={styles.marginAround} gap={16}>
                    <Button
                        containerStyle={styles.flex}
                        onPress={() => Linking.openURL('https://t.me/+lAYTadnRKdY2NDBk')}
                        icon="help">
                        {t('app_details.get_help')}
                    </Button>
                    <Button
                        containerStyle={styles.flex}
                        onPress={() => Linking.openURL('https://github.com/eurofurence/ef-app_react-native/issues')}
                        icon="bug">
                        {t('app_details.report_bug')}
                    </Button>
                </Row>


                <Section title={t('developed_by')} icon="code-json" />
                <Credit
                    url="https://avatars.githubusercontent.com/u/3359222"
                    name="Fenrikur"
                    role="App Team Director and getting us to move our butts in gear" />
                <Credit
                    url="https://avatars.githubusercontent.com/u/5929561"
                    name="Pazuzu"
                    role="React Development"
                    onEasterEgg={pazuzuEgg} />
                <Credit
                    url="https://avatars.githubusercontent.com/u/5537850"
                    name="Requinard"
                    role="React Development support"
                    onEasterEgg={requinardEgg} />
                <Credit
                    url="https://avatars.githubusercontent.com/u/76539710"
                    name="Meta"
                    role="Backend Development" />
                <Credit
                    url="https://avatars.githubusercontent.com/u/1616683"
                    name="Rain"
                    role="Backend Development" />
                <Credit
                    url="https://avatars.githubusercontent.com/u/29598855"
                    name="Maakinoh"
                    role="Backend Development" />
                <MarkdownContent>{extraThanksMarkdown}</MarkdownContent>
            </Floater>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    marginAround: {
        marginTop: 20,
        marginBottom: 20,
    },
    flex: {
        flex: 1,
    },
})
