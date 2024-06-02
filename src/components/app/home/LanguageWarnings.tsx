import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { Badge } from "../../generic/containers/Badge";

export type LanguageWarningsProps = {
    /**
     * The padding used by the parent horizontally.
     */
    parentPad?: number;
};

export const LanguageWarnings: FC<LanguageWarningsProps> = ({ parentPad = 0 }) => {
    const { t } = useTranslation("Home");
    const notice = t("content_untranslated");

    if (notice === "") {
        return null;
    }

    return (
        <Badge unpad={parentPad} badgeColor="background" textColor="text" textType="para" icon="translate">
            {notice}
        </Badge>
    );
};
