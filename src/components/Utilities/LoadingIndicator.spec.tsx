import { render, screen } from "@testing-library/react-native";

import { LoadingIndicator } from "./LoadingIndicator";

describe("LoadingIndicator", function () {
    it("renders", () => {
        render(<LoadingIndicator />);

        expect(screen.getByTestId("loadingindicator")).toBeTruthy();
    });
});
