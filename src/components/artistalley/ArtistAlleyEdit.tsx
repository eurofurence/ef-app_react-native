import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { useToast } from "../../context/ToastContext";
import { useArtistAlleyPostTableRegistrationRequestMutation } from "../../store/eurofurence/service";
import { Label } from "../generic/atoms/Label";
import { Button } from "../generic/containers/Button";
import { ManagedImagePicker } from "../generic/forms/ManagedImagePicker";
import { ManagedTextInput } from "../generic/forms/ManagedTextInput";
import { artistAlleySchema, ArtistAlleySchema } from "./ArtistAlleyForm.schema";

export type ArtistAlleyEditProps = {
    prefill: ArtistAlleySchema;
    mode: "change" | "new";
    onDismiss: () => void;
};
export const ArtistAlleyEdit = ({ prefill, mode, onDismiss }: ArtistAlleyEditProps) => {
    // Get current registration. Create submit mutation.
    const [submitRegistration, submitResult] = useArtistAlleyPostTableRegistrationRequestMutation();

    // Use toast function.
    const toast = useToast();

    // Get translation functions.
    const { t } = useTranslation("ArtistAlley");
    const { t: tErrors } = useTranslation("ArtistAlley", { keyPrefix: "errors" });

    // Make an error translator. This accounts for named errors.
    const errorTranslator = useCallback(
        (name: string, type: string) =>
            tErrors(`${name}_${type}`, {
                defaultValue: tErrors(type),
            }),
        [tErrors],
    );

    // Compute disabled and disabled status text.
    const disabled = submitResult.isLoading;

    // Make a form with the given scheme and sensible defaults.
    const form = useForm<ArtistAlleySchema>({
        resolver: zodResolver(artistAlleySchema),
        disabled,
        mode: "onChange",
        defaultValues: prefill,
    });

    // Submit the data. On success, notify and dismiss the form, otherwise mark error.
    const doSubmit = useCallback(
        (data: ArtistAlleySchema) => {
            toast("notice", t("submit_in_progress"));
            submitRegistration(data).then((result) => {
                if ("error" in result) {
                    toast("error", t("submit_failed"), 6000);
                } else {
                    toast("info", t("submit_succeeded"), 6000);
                    onDismiss();
                }
            });
        },
        [submitRegistration, toast, t, onDismiss],
    );

    return (
        <FormProvider {...form}>
            <Label type="compact" mt={20} mb={40}>
                {t(mode === "change" ? "explanation_edit_change" : "explanation_edit_new")}
            </Label>

            <ManagedTextInput<ArtistAlleySchema> name="displayName" label={t("display_name_label")} errorTranslator={errorTranslator} placeholder={t("display_name_placeholder")} />
            <ManagedTextInput<ArtistAlleySchema>
                name="websiteUrl"
                label={t("website_url_label")}
                errorTranslator={errorTranslator}
                placeholder={t("website_url_placeholder")}
                inputMode="url"
                keyboardType="url"
            />
            <ManagedTextInput<ArtistAlleySchema>
                name="shortDescription"
                label={t("short_description_label")}
                errorTranslator={errorTranslator}
                placeholder={t("short_description_placeholder")}
                multiline
                numberOfLines={8}
            />
            <ManagedTextInput<ArtistAlleySchema>
                name="location"
                label={t("location_label")}
                errorTranslator={errorTranslator}
                placeholder={t("location_placeholder")}
                inputMode="numeric"
                keyboardType="numeric"
            />
            <ManagedTextInput<ArtistAlleySchema>
                name="telegramHandle"
                label={t("telegram_handle_label")}
                errorTranslator={errorTranslator}
                placeholder={t("telegram_handle_placeholder")}
            />

            <ManagedImagePicker<ArtistAlleySchema>
                name="imageUri"
                label={t("submission_image_label")}
                errorTranslator={errorTranslator}
                placeholder={t("submission_image_placeholder")}
            />

            <Button style={styles.button} onPress={form.handleSubmit(doSubmit)} disabled={disabled}>
                {t(mode === "change" ? "update" : "submit")}
            </Button>

            {mode === "new" ? null : (
                <Button style={styles.button} onPress={onDismiss} outline>
                    {t("dismiss")}
                </Button>
            )}
        </FormProvider>
    );
};

const styles = StyleSheet.create({
    locked: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        width: "100%",
        borderBottomColor: "black",
        borderBottomWidth: 1,
        paddingVertical: 8,
        marginBottom: 16,
    },
    star: {
        marginTop: 16,
        marginBottom: 8,
        marginLeft: "auto",
        marginRight: "auto",
    },
    button: {
        marginTop: 20,
    },
});
