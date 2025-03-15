import { nativeApplicationVersion, nativeBuildVersion } from "expo-application";
import { Sound } from "expo-av/build/Audio/Sound";
import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Linking, StyleSheet } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

import { appStyles } from "../components/AppStyles";
import { Image } from "../components/generic/atoms/Image";
import { Label } from "../components/generic/atoms/Label";
import { MarkdownContent } from "../components/generic/atoms/MarkdownContent";
import { Section } from "../components/generic/atoms/Section";
import { Button } from "../components/generic/containers/Button";
import { Col } from "../components/generic/containers/Col";
import { Floater } from "../components/generic/containers/Floater";
import { Header } from "../components/generic/containers/Header";
import { Row } from "../components/generic/containers/Row";
import { useAppNavigation } from "../hooks/nav/useAppNavigation";
import { useAppDispatch, useAppSelector } from "../store";
import { setTheme } from "../store/settings/slice";

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

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`;

export type CreditProps = {
    url: string;
    name: string;
    role: string;
    onEasterEgg?: () => void;
};

export const Credit: FC<CreditProps> = ({ url, name, role, onEasterEgg }) => {
    const navigation = useAppNavigation("Areas");

    return (
        <TouchableOpacity onPress={() => navigation.navigate("Viewer", { url, title: name })} onLongPress={onEasterEgg} delayLongPress={2000}>
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
    );
};

export const About = () => {
    const { t } = useTranslation("About");
    const showHelpButtons = useAppSelector((state) => state.settingsSlice.showDevMenu ?? false);
    const dispatch = useAppDispatch();

    // Load static assets.
    const requinardEgg = useCallback(async () => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { sound } = await Sound.createAsync(require("../../assets/runtime/cheese.webm"));
        await sound.playAsync();
        dispatch(setTheme("requinard"));
    }, [dispatch]);

    const pazuzuEgg = useCallback(async () => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { sound } = await Sound.createAsync(require("../../assets/runtime/sheesh.webm"));
        await sound.playAsync();
        dispatch(setTheme("pazuzu"));
    }, [dispatch]);
    return (
        <ScrollView style={StyleSheet.absoluteFill} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
            <Header>{t("header")}</Header>
            <Floater contentStyle={appStyles.trailer}>
                <Section title={t("app_details.title")} subtitle={`${nativeApplicationVersion} - ${nativeBuildVersion}`} icon="cellphone" />

                {!showHelpButtons && (
                    <>
                        <Button containerStyle={{ marginVertical: 10 }} onPress={() => Linking.openURL("https://t.me/+lAYTadnRKdY2NDBk")} icon="help">
                            {t("app_details.get_help")}
                        </Button>
                        <Button containerStyle={{ marginVertical: 10 }} onPress={() => Linking.openURL("https://github.com/eurofurence/ef-app_react-native/issues")} icon="bug">
                            {t("app_details.report_bug")}
                        </Button>
                    </>
                )}

                <Section title={t("developed_by")} icon="code-json" />
                <Credit url="https://avatars.githubusercontent.com/u/3359222" name="Fenrikur" role="App Team Director and getting us to move our butts in gear" />
                <Credit url="https://avatars.githubusercontent.com/u/5929561" name="Pazuzu" role="React Development" onEasterEgg={pazuzuEgg} />
                <Credit url="https://avatars.githubusercontent.com/u/5537850" name="Requinard" role="React Development support" onEasterEgg={requinardEgg} />
                <Credit url="https://avatars.githubusercontent.com/u/76539710" name="Meta" role="Backend Development" />
                <Credit url="https://avatars.githubusercontent.com/u/1616683" name="Rain" role="Backend Development" />
                <Credit url="https://avatars.githubusercontent.com/u/29598855" name="Maakinoh" role="Backend Development" />
                <MarkdownContent>{extraThanksMarkdown}</MarkdownContent>
            </Floater>
        </ScrollView>
    );
};
