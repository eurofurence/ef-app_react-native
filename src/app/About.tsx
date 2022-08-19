import { nativeApplicationVersion } from "expo-application";
import Constants from "expo-constants";
import { runtimeVersion } from "expo-updates";
import { capitalize } from "lodash";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Image, Linking, Platform, ScrollView } from "react-native";
// @ts-expect-error untyped module
import Markdown from "react-native-easy-markdown";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Label } from "../components/Atoms/Label";
import { Section } from "../components/Atoms/Section";
import { Button } from "../components/Containers/Button";
import { Col } from "../components/Containers/Col";
import { Floater } from "../components/Containers/Floater";
import { Header } from "../components/Containers/Header";
import { Row } from "../components/Containers/Row";
import { useAppSelector } from "../store";
import { appStyles } from "./AppStyles";

const extraThanksMarkdown = `
# Tooling

We use React-Native and Expo to make this experience possible.

Firebase provides us with cloud messaging and analytics.

And Sentry helps us out with exception tracing.

# People

## Program Management

- Zefiro

## Other Special People

- Akulatraxas
- Aragon Tigerseye
- Atkelar
- Cairyn
- Carenath Stormwind
- Jul
- Liam
- NordicFuzzCon (Catch'em all)
- Pattarchus
- Snow-wolf
- StreifiGreif
- Xil
- IceTiger

## English Translations

- Luchs
- Pazuzu
- Requinard

## German Translations

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

export const Credit: FC<{ uri: string; name: string; role: string; onPress?: () => void }> = ({ uri, name, role, onPress }) => (
    <TouchableOpacity disabled={onPress === undefined} onPress={onPress}>
        <Row type={"center"} style={{ marginVertical: 5 }}>
            <Image
                source={{ uri, height: 60, width: 60 }}
                style={{
                    borderRadius: 100,
                }}
            />

            <Col style={{ flex: 1, marginLeft: 10 }}>
                <Label type={"h2"}>{name}</Label>
                <Label>
                    {role}
                    {}
                </Label>
            </Col>
        </Row>
    </TouchableOpacity>
);

export const AboutScreen = () => {
    const { t } = useTranslation("About");
    const safe = useSafeAreaInsets();
    const showHelpButtons = useAppSelector((state) => state.settingsSlice.showDevMenu ?? false);
    return (
        <ScrollView style={[appStyles.abs, safe]} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
            <Header>{t("header")}</Header>
            <Floater contentStyle={appStyles.trailer}>
                <Section title={t("app_details.title")} subtitle={runtimeVersion ? runtimeVersion : undefined} icon={"cellphone"} />

                {!showHelpButtons && (
                    <>
                        <Button style={{ marginVertical: 10 }} onPress={() => Linking.openURL("https://t.me/+lAYTadnRKdY2NDBk")} icon={"help"}>
                            {t("app_details.get_help")}
                        </Button>
                        <Button style={{ marginVertical: 10 }} onPress={() => Linking.openURL("https://github.com/eurofurence/ef-app_react-native/issues")} icon={"bug"}>
                            {t("app_details.report_bug")}
                        </Button>
                    </>
                )}

                <Section title={t("developed_by")} icon={"code-json"} />
                <Credit uri={"https://avatars.githubusercontent.com/u/13329381"} name={"Luchs"} role={"Project management and getting us to move our butts in gear"} />
                <Credit uri={"https://avatars.githubusercontent.com/u/5929561"} name={"Pazuzu"} role={"React Development and UI design"} />
                <Credit uri={"https://avatars.githubusercontent.com/u/5537850"} name={"Requinard"} role={"React Development and app mechanics"} />
                <Credit uri={"https://avatars.githubusercontent.com/u/12624320"} name={"Shez"} role={"iOS Development"} />
                <Credit uri={"https://avatars.githubusercontent.com/u/3359222"} name={"Fenrikur"} role={"iOS Development"} />
                <Markdown>{extraThanksMarkdown}</Markdown>
            </Floater>
        </ScrollView>
    );
};
