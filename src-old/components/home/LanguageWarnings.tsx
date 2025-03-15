import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "../../store";
import { hideLanguageWarnings } from "../../store/auxiliary/slice";
import { Label } from "../generic/atoms/Label";
import { Badge } from "../generic/containers/Badge";

export type LanguageWarningsProps = {
    /**
     * The padding used by the parent horizontally.
     */
    parentPad?: number;
};

export const LanguageWarnings: FC<LanguageWarningsProps> = ({ parentPad = 0 }) => {
    const { t } = useTranslation("Home");
    const notice = t("content_untranslated");
    const warningsHidden = useAppSelector((state) => state.auxiliary.languageWarningsHidden);
    const dispatch = useAppDispatch();

    if (warningsHidden) {
        return null;
    }
    if (notice === "") {
        return null;
    }

    return (
        <Badge unpad={parentPad} badgeColor="background" textColor="text" textType="para" icon="translate">
            {notice}
            <Label variant="bold" color="secondary" onPress={() => dispatch(hideLanguageWarnings())}>
                {" " + t("warnings.hide")}
            </Label>
        </Badge>
    );
};
