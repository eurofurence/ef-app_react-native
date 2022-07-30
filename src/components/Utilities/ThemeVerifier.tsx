import { Text, View } from "react-native";

import { useTheme } from "../../context/Theme";
import { Label } from "../Atoms/Label";

export const ThemeVerifier = () => {
    const theme = useTheme();

    return (
        <View>
            {/* Theme verifier. */}
            <View style={{ marginTop: 30, flexDirection: "row", flexWrap: "wrap" }}>
                {Object.entries(theme).map(([name, color]) => (
                    <Text key={name} style={{ width: 150, height: 50, backgroundColor: color, padding: 15 }}>
                        {name}
                    </Text>
                ))}
            </View>
            {/* Label style verifier. */}
            <View style={{ backgroundColor: theme.background, alignSelf: "stretch", padding: 30 }}>
                <Label type="h1">Heading 1</Label>
                <Label type="h2">Heading 2</Label>
                <Label type="h3">Heading 3</Label>
                <Label type="h4">Heading 4</Label>
                <Label type="regular">Regular</Label>
                <Label type="regular" color="important">
                    Important regular
                </Label>
            </View>
        </View>
    );
};
