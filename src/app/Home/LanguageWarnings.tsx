import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { BadgeInvPad } from "../../components/Containers/BadgeInvPad";
import { useTheme } from "../../context/Theme";

export type LanguageWarningsProps = {
    /**
     * The padding used by the parent horizontally.
     */
    parentPad?: number;
};

export const LanguageWarnings: FC<LanguageWarningsProps> = ({ parentPad = 0 }) => {
    const { t } = useTranslation("Home");
    const theme = useTheme();
    const notice = useMemo(() => t("content_untranslated"), [t]);

    if (notice === "") {
        return null;
    }

    return (
        <BadgeInvPad padding={parentPad} badgeColor={theme.background} textColor={theme.text} textType="para" icon="translate">
            {notice}
        </BadgeInvPad>
    );
};
