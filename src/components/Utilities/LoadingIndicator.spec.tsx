import { render, screen } from "../../testUtils";
import { LoadingIndicator } from "./LoadingIndicator";

describe("LoadingIndicator", function () {
    it("renders", async () => {
        render(<LoadingIndicator />);

        expect(screen.getByTestId("loadingindicator")).toBeTruthy();
    });
});
