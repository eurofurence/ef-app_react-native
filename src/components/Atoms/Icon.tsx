import FontAwesome5Icon from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcon from "@expo/vector-icons/MaterialCommunityIcons";
import { IconProps } from "@expo/vector-icons/build/createIconSet";
import FontAwesomeGlyphs from "@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/FontAwesome5Free.json";
import MaterialCommunityGlyphs from "@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json";
import { FC, memo } from "react";

type FontAwesomeNames = keyof typeof FontAwesomeGlyphs;
type MaterialCommunityNames = keyof typeof MaterialCommunityGlyphs;
export type IconNames = FontAwesomeNames | MaterialCommunityNames;

export const Icon: FC<IconProps<IconNames>> = memo(({ name, color, ...rest }) => {
    if (name in MaterialCommunityGlyphs) return <MaterialCommunityIcon name={name as MaterialCommunityNames} color={color} {...rest} />;
    else return <FontAwesome5Icon name={name as FontAwesomeNames} color={color} {...rest} />;
});

export default Icon;
