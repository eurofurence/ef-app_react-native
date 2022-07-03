import { screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { render } from "../testUtils";
import { withPlatform } from "./withPlatform";

const TestComponent = (props: any) => <Text testID={"withPlatformComponent"}>I am some text</Text>;
describe("withPlatform", function () {
    beforeAll(() => {
        jest.mock("react-native/Libraries/Utilities/Platform", () => ({
            OS: "web",
        }));
    });

    it("renders on the current platform", () => {
        const Wrapped = withPlatform(TestComponent, ["web"]);
        render(<Wrapped />);

        expect(screen.getByTestId("withPlatformComponent")).toBeTruthy();
    });

    it("does not render on a different platform", () => {
        const Wrapped = withPlatform(TestComponent, ["android"]);
        render(<Wrapped />);

        expect(screen.queryByTestId("withPlatformComponent")).toBeFalsy();
    });
});
