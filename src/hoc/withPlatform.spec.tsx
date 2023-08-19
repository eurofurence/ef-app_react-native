import { Text } from "react-native";

import { withPlatform } from "./withPlatform";
import { render } from "../testUtils";

const TestComponent = (props: any) => <Text testID={"withPlatformComponent"}>I am some text</Text>;
describe("withPlatform", function () {
    beforeEach(() => {
        jest.mock("react-native/Libraries/Utilities/Platform", () => ({
            OS: "web",
        }));
    });

    afterEach(() => {
        jest.unmock("react-native/Libraries/Utilities/Platform");
    });

    it("renders on the current platform", async () => {
        const Wrapped = withPlatform(TestComponent, ["web"]);
        const screen = render(<Wrapped />);

        expect(screen.getByTestId("withPlatformComponent")).toBeTruthy();
    });

    it("does not render on a different platform", async () => {
        const Wrapped = withPlatform(TestComponent, ["android"]);
        const screen = render(<Wrapped />);

        expect(screen.queryByTestId("withPlatformComponent")).toBeFalsy();
    });
});
