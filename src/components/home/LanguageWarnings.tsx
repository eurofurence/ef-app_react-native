import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Label } from "../generic/atoms/Label";
import { Badge } from "../generic/containers/Badge";
import { useWarningState } from "@/hooks/warnings/useWarningState";

export type LanguageWarningsProps = {
    /**
     * The padding used by the parent horizontally.
     */
    parentPad?: number;
};

export const LanguageWarnings: FC<LanguageWarningsProps> = ({ parentPad = 0 }) => {
    const { t } = useTranslation("Home");
    const notice = t("content_untranslated");
    const { isHidden, hideWarning } = useWarningState("languageWarningsHidden");

    if (isHidden) {
        return null;
    }
    if (notice === "") {
        return null;
    }

    return (
        <Badge unpad={parentPad} badgeColor="background" textColor="text" textType="para" icon="translate">
            {notice}
            <Label variant="bold" color="secondary" onPress={hideWarning}>
                {" " + t("warnings.hide")}
            </Label>
        </Badge>
    );
};
