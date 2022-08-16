import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StarRating from "react-native-star-rating-widget";
import { z } from "zod";

import { Label } from "../../components/Atoms/Label";
import { Button } from "../../components/Containers/Button";
import { Col } from "../../components/Containers/Col";
import { Floater } from "../../components/Containers/Floater";
import { Header } from "../../components/Containers/Header";
import { useTheme } from "../../context/Theme";
import { useAppNavigation, useAppRoute } from "../../hooks/useAppNavigation";
import { useAppSelector } from "../../store";
import { eventsSelector } from "../../store/eurofurence.selectors";
import { useSubmitEventFeedbackMutation } from "../../store/eurofurence.service";

const feedbackForm = z.object({
    rating: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().min(1).max(5)),
    message: z.string().optional(),
});

type FeedbackForm = z.infer<typeof feedbackForm>;

export const FeedbackScreen = () => {
    const theme = useTheme();
    const navigation = useAppNavigation("EventFeedback");
    const [submitFeedback, feedbackResult] = useSubmitEventFeedbackMutation();
    const { t } = useTranslation("EventFeedback");
    const { control, handleSubmit } = useForm<FeedbackForm>({
        resolver: zodResolver(feedbackForm),
        defaultValues: {
            rating: undefined,
            message: undefined,
        },
    });

    const safe = useSafeAreaInsets();
    const { params } = useAppRoute("EventFeedback");
    const event = useAppSelector((state) => eventsSelector.selectById(state, params.id));

    const submit = useCallback((data: FeedbackForm) => {
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
        <ScrollView style={safe} stickyHeaderIndices={[0]}>
            <Header>{t("header", { eventTitle: event?.Title })}</Header>
            <Floater containerStyle={{ marginTop: 10 }}>
                <Label variant={"narrow"}>{t("explanation", { eventTitle: event?.Title })}</Label>

                <Controller
                    control={control}
                    name={"rating"}
                    rules={{
                        required: true,
                    }}
                    render={({ field, fieldState }) => (
                        <Col type={"stretch"}>
                            <Label variant={"bold"} mt={16}>
                                {t("rating_title")}
                            </Label>
                            <StarRating
                                rating={field.value}
                                onChange={field.onChange}
                                minRating={1}
                                enableHalfStar={false}
                                color={theme.secondary}
                                style={styles.star}
                                starSize={52}
                            />
                            {fieldState.error && <Label style={styles.error}>{fieldState.error.message}</Label>}
                        </Col>
                    )}
                />
                <Controller
                    control={control}
                    name={"message"}
                    rules={{
                        required: false,
                    }}
                    render={({ field }) => (
                        <>
                            <Label variant={"bold"} mt={16}>
                                {t("message_title")}
                            </Label>
                            <TextInput {...field} style={styles.input} onChangeText={field.onChange} placeholder={t("message_placeholder")} numberOfLines={8} multiline />
                        </>
                    )}
                />

                <Button onPress={handleSubmit(submit)} disabled={feedbackResult.isLoading}>
                    {t("submit")}
                </Button>

                {feedbackResult.isError && (
                    <Label style={styles.error} mt={16}>
                        {t("submit_failed")}
                    </Label>
                )}
                {feedbackResult.isLoading && <Label mt={16}>{t("submit_in_progress")}</Label>}
            </Floater>
        </ScrollView>
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
