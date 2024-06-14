import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { feedbackSchema, FeedbackSchema } from "./FeedbackForm.schema";
import { useAppNavigation, useAppRoute } from "../../hooks/nav/useAppNavigation";
import { useTheme } from "../../hooks/themes/useThemeHooks";
import { useAppSelector } from "../../store";
import { eventsSelector } from "../../store/eurofurence.selectors";
import { useSubmitEventFeedbackMutation } from "../../store/eurofurence.service";
import { Label } from "../generic/atoms/Label";
import { Button } from "../generic/containers/Button";
import { ManagedRating } from "../generic/forms/ManagedRating";
import { ManagedTextInput } from "../generic/forms/ManagedTextInput";

export const FeedbackForm = () => {
    const theme = useTheme();
    const navigation = useAppNavigation("EventFeedback");
    const [submitFeedback, feedbackResult] = useSubmitEventFeedbackMutation();
    const { t } = useTranslation("EventFeedback");
    const form = useForm<FeedbackSchema>({
        resolver: zodResolver(feedbackSchema),
        defaultValues: {
            rating: undefined,
            message: undefined,
        },
    });

    const { params } = useAppRoute("EventFeedback");
    const event = useAppSelector((state) => eventsSelector.selectById(state, params.id));

    const submit = useCallback((data: FeedbackSchema) => {
        submitFeedback({
            ...data,
            eventId: event!.Id,
        });
    }, []);

    useEffect(() => {
        if (feedbackResult.isSuccess) {
            navigation.goBack();
        }
    }, [feedbackResult]);

    return (
        <FormProvider {...form}>
            <Label variant={"narrow"}>{t("explanation", { eventTitle: event?.Title, interpolation: { escapeValue: false } })}</Label>

            <ManagedRating<FeedbackSchema>
                name={"rating"}
                label={t("rating_title")}
                minRating={1}
                enableHalfStar={false}
                color={theme.secondary}
                style={styles.star}
                starSize={52}
            />

            <ManagedTextInput<FeedbackSchema> name={"message"} label={t("message_title")} placeholder={t("message_placeholder")} numberOfLines={8} multiline />

            <Button onPress={form.handleSubmit(submit)} disabled={feedbackResult.isLoading}>
                {t("submit")}
            </Button>

            {feedbackResult.isError && (
                <Label style={styles.error} mt={16}>
                    {t("submit_failed")}
                </Label>
            )}
            {feedbackResult.isLoading && <Label mt={16}>{t("submit_in_progress")}</Label>}
        </FormProvider>
    );
};

const styles = StyleSheet.create({
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
    error: {
        fontSize: 10,
        color: "#a01010",
    },
});
