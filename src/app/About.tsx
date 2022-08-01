import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import { capitalize } from "lodash";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Image, Platform, ScrollView } from "react-native";
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
import { appStyles } from "./AppStyles";

const extraThanksMarkdown = `**Program Management:**
- Zefiro

**Special Thanks:**
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

**Made with**
- React-Native

**Disclaimer**
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
    return (
        <ScrollView style={[appStyles.abs, safe]} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
            <Header>{t("header")}</Header>
            <Floater contentStyle={appStyles.trailer}>
                <Section
                    title={t("app_details.title")}
                    subtitle={`${capitalize(Platform.OS)} ${Constants.manifest?.version} ${Platform.OS === "android" ? Constants.manifest?.android?.versionCode : ""}`}
                    icon={"cellphone"}
                />

                <Button style={{ marginVertical: 10 }} onPress={() => WebBrowser.openBrowserAsync("https://t.me/+lAYTadnRKdY2NDBk")} icon={"help"}>
                    {t("app_details.get_help")}
                </Button>
                <Button style={{ marginVertical: 10 }} onPress={() => WebBrowser.openBrowserAsync("https://github.com/eurofurence/ef-app_react-native/issues")} icon={"bug"}>
                    {t("app_details.report_bug")}
                </Button>
                <Section title={t("developed_by")} icon={"code-json"} />
                <Credit uri={"https://avatars.githubusercontent.com/u/13329381"} name={"Luchs"} role={"Project management and getting us to move our butts in gear"} />
                <Credit uri={"https://avatars.githubusercontent.com/u/5929561"} name={"Pazuzu"} role={"React Development and UI design"} />
                <Credit uri={"https://avatars.githubusercontent.com/u/5537850"} name={"Requinard"} role={"React Development and app mechanics"} />
                <Credit uri={"https://avatars.githubusercontent.com/u/12624320"} name={"Shez"} role={"iOS Development"} />
                <Section title={t("extra_thanks")} icon={"heart-outline"} />
                <Markdown>{extraThanksMarkdown}</Markdown>
            </Floater>
        </ScrollView>
    );
};
