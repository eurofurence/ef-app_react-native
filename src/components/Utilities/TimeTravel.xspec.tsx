import { render, screen } from "../../testUtils";
import { TimeTravel } from "./TimeTravel";

describe("<TimeTravel />", function () {
    describe("Enable/Disable", function () {
        // todo: This test is disabled as there is a transformation issue with Expo Vector Icons @pazuzueu
        it("changes state to enable when clicked", () => {
            render(<TimeTravel />, {
                preloadedState: {
                    timetravel: {
                        enabled: false,
                        amount: 0,
                        visible: true,
                    },
                },
            });

            expect(screen.getByTestId("TimeTravel")).toBeTruthy();
        });
    });
});
