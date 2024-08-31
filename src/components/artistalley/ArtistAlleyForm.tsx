import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { artistAlleySchema, ArtistAlleySchema } from "./ArtistAlleyForm.schema";
import { useAuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useArtistAlleyOwnTableRegistrationQuery, useArtistAlleyPostTableRegistrationRequestMutation } from "../../store/eurofurence/service";
import { Label } from "../generic/atoms/Label";
import { Button } from "../generic/containers/Button";
import { ManagedImagePicker } from "../generic/forms/ManagedImagePicker";
import { ManagedTextInput } from "../generic/forms/ManagedTextInput";

export const ArtistAlleyForm = () => {
    // Get login data. Claims for name, user for roles.
    const { loggedIn, claims, user } = useAuthContext();

    // Get current registration.
    const { data, isSuccess, isFetching } = useArtistAlleyOwnTableRegistrationQuery(undefined, {
        skip: !loggedIn,
    });

    // Create submit mutation.
    const [submitRegistration, submitResult] = useArtistAlleyPostTableRegistrationRequestMutation();

    // Use toast function.
    const toast = useToast();

    // Get translation functions.
    const { t } = useTranslation("ArtistAlley");
    const { t: tErrors } = useTranslation("ArtistAlley", { keyPrefix: "errors" });
    const { t: tStatus } = useTranslation("ArtistAlley", { keyPrefix: "status" });

    // Make an error translator. This accounts for named errors.
    const errorTranslator = useCallback(
        (name: string, type: string) =>
            tErrors(`${name}_${type}`, {
                defaultValue: tErrors(type),
            }),
        [tErrors],
    );

    // Get roles for preemptive RBAC.
    const attending = Boolean(user?.Roles?.includes("Attendee"));
    const checkedIn = Boolean(user?.Roles?.includes("AttendeeCheckedIn"));

    // Compute disabled and disabled status text.
    const disabled = !loggedIn || !attending || !checkedIn || submitResult.isLoading || isFetching;
    const disabledReason = (!loggedIn && t("disabled_not_logged_in")) || (!attending && t("disabled_not_attending")) || (!checkedIn && t("disabled_not_checked_in"));

    // Make a form with the given scheme and sensible defaults.
    const form = useForm<ArtistAlleySchema>({
        resolver: zodResolver(artistAlleySchema),
        disabled: false,
        mode: "onChange",
        defaultValues: {
            displayName: data?.DisplayName ?? (claims?.name as string),
            websiteUrl: data?.WebsiteUrl,
            shortDescription: data?.ShortDescription,
            location: data?.Location,
            telegramHandle: data?.TelegramHandle,
            imageUri: data?.Image?.Url,
        },
    });

    // Update from existing data if present.
    useEffect(() => {
        if (isSuccess && data) {
            form.setValue("displayName", data.DisplayName);
            form.setValue("websiteUrl", data.WebsiteUrl);
            form.setValue("shortDescription", data.ShortDescription);
            form.setValue("location", data.Location);
            form.setValue("telegramHandle", data.TelegramHandle);
            form.setValue("imageUri", data.Image?.Url);
        }
    }, [isSuccess, data, form]);

    // If success or error is detected from submission, toast.
    useEffect(() => {
        if (submitResult.isSuccess) toast("info", t("submit_succeeded"), 6000);
        else if (submitResult.isError) toast("error", t("submit_failed"), 6000);
    }, [t, toast, submitResult.isSuccess, submitResult.isError]);

    // If starting to submit, toast.
    useEffect(() => {
        if (submitResult.isLoading) toast("notice", t("submit_in_progress"));
    }, [t, toast, submitResult.isLoading]);

    return (
        <FormProvider {...form}>
            <View style={styles.container}>
                <Label type="para" mb={20}>
                    {t("explanation")}

                    {disabledReason && (
                        <Label color="important" variant="bold">
                            {" " + disabledReason}
                        </Label>
                    )}
                </Label>

                <Label type="lead" color="important" mb={20}>
                    {!data?.State ? t("no_submission") : tStatus(data.State)}
                </Label>

                <ManagedTextInput<ArtistAlleySchema>
                    name="displayName"
                    label={t("display_name_label")}
                    errorTranslator={errorTranslator}
                    placeholder={t("display_name_placeholder")}
                />
                <ManagedTextInput<ArtistAlleySchema>
                    name="websiteUrl"
                    label={t("website_url_label")}
                    errorTranslator={errorTranslator}
                    placeholder={t("website_url_placeholder")}
                    inputMode="url"
                />
                <ManagedTextInput<ArtistAlleySchema>
                    name="shortDescription"
                    label={t("short_description_label")}
                    errorTranslator={errorTranslator}
                    placeholder={t("short_description_placeholder")}
                    multiline
                    numberOfLines={8}
                />
                <ManagedTextInput<ArtistAlleySchema> name="location" label={t("location_label")} errorTranslator={errorTranslator} placeholder={t("location_placeholder")} />
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

                <Button style={styles.button} onPress={form.handleSubmit(submitRegistration)} disabled={disabled}>
                    {data ? t("update") : t("submit")}
                </Button>
            </View>
        </FormProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: 100,
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
        marginTop: 30,
    },
});
