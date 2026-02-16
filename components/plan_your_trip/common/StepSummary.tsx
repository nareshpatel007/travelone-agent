"use client";

import { Check, X } from "lucide-react";
import QuestionHeading from "./questionHeading";
import { useEffect } from "react";

// Define the summary configuration
let SUMMARY_CONFIG = [
    {
        label: "Destination flow",
        stepKey: "choose_flow",
        shouldShow: () => true,
        isAnswered: (form: any) => !!form.choose_flow,
    },
    {
        label: "Destination",
        stepKey: "destinations",
        shouldShow: (form: any) => form.choose_flow === "i_have_destination",
        isAnswered: (form: any) => !!form.destination,
    },
    {
        label: "Countries",
        stepKey: "countries",
        shouldShow: (form: any) => form.choose_flow === "i_have_destination",
        isAnswered: (form: any) => Array.isArray(form.country) && form.country.length > 0,
    },
    {
        label: "First time visiting",
        stepKey: "first_visit",
        shouldShow: (form: any) => form.choose_flow === "i_have_destination",
        isAnswered: (form: any) => !!form.first_time_visit,
    },
    {
        label: "Travel season",
        stepKey: "travel_time",
        shouldShow: () => true,
        isAnswered: (form: any) => !!form.season_name,
    },
    {
        label: "Themes",
        stepKey: "themes_single",
        shouldShow: () => true,
        isAnswered: (form: any) => Array.isArray(form.themes_options) && form.themes_options.length > 0,
    },
    {
        label: "Selected cities",
        stepKey: "regions",
        shouldShow: (form: any) => form.choose_flow === "i_have_destination",
        isAnswered: (form: any) => Array.isArray(form.selected_cities) && form.selected_cities.length > 0,
    },
    {
        label: "Trip duration",
        stepKey: "days",
        shouldShow: () => true,
        isAnswered: (form: any) => !!form.day_option,
    },
    {
        label: "Budget",
        stepKey: "budget",
        shouldShow: () => true,
        isAnswered: (form: any) => !!form.budget,
    },
    {
        label: "Travelers",
        stepKey: "travelers",
        shouldShow: () => true,
        isAnswered: (form: any) => !!form.prefer_travel_type,
    },
    {
        label: "Accommodation",
        stepKey: "accommodation",
        shouldShow: () => true,
        isAnswered: (form: any) => !!form.accommodation,
    },
    {
        label: "Meals",
        stepKey: "meals",
        shouldShow: () => true,
        isAnswered: (form: any) => Array.isArray(form.meal_preferences) && form.meal_preferences.length > 0,
    },
    {
        label: "Transfers",
        stepKey: "transfer",
        shouldShow: () => true,
        isAnswered: (form: any) => !!form.transportation,
    },
    {
        label: "Guide",
        stepKey: "guide",
        shouldShow: () => true,
        isAnswered: (form: any) => !!form.guide,
    },
    {
        label: "Custom Prompt",
        stepKey: "custom_prompt",
        shouldShow: () => true,
        isAnswered: (form: any) => !!form.custom_prompt,
    },
];

interface Props {
    planYourTripForm: any;
    setPlanYourTripForm: React.Dispatch<React.SetStateAction<any>>;
    jumpToStep: (stepKey: any) => void;
    isLandingPage?: boolean;
}

export default function StepSummary({
    planYourTripForm,
    setPlanYourTripForm,
    jumpToStep,
    isLandingPage = false,
}: Props) {

    // If landing page remove countries and destination from list, remove item key
    if (isLandingPage) {
        // If stepKey == "choose_flow" remove
        SUMMARY_CONFIG = SUMMARY_CONFIG.filter((item) => item.stepKey !== "choose_flow");
        // If stepKey == "destinations" remove
        SUMMARY_CONFIG = SUMMARY_CONFIG.filter((item) => item.stepKey !== "destinations");
        // If stepKey == "countries" remove
        SUMMARY_CONFIG = SUMMARY_CONFIG.filter((item) => item.stepKey !== "countries");
    }

    // Filter out items that should not be shown
    const visibleItems = SUMMARY_CONFIG.filter((item) =>
        item.shouldShow(planYourTripForm)
    );

    useEffect(() => {
        setPlanYourTripForm((prev: any) => ({
            ...prev,
            is_show_history_btn: true,
        }));
    }, []);

    return (
        <div className="space-y-5">
            <QuestionHeading title="Your Preference Summary" />

            <div className="border border-black rounded-sm p-5 bg-white/60 max-h-[55vh] md:max-h-[60vh] overflow-y-auto space-y-3">
                {visibleItems.map((item, index) => {
                    const answered = item.isAnswered(planYourTripForm);

                    return (
                        <div
                            key={item.stepKey}
                            onClick={() => jumpToStep(item.stepKey)}
                            className="flex items-center justify-between border-b pb-2 cursor-pointer hover:underline"
                        >
                            <span className="text-sm md:text-base text-black">
                                Preference {index + 1}: {item.label}
                            </span>

                            {answered ? (
                                <div className="flex items-center gap-2 text-green-700">
                                    <Check className="h-5 w-5" />
                                    <span>Completed</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-orange-500">
                                    <X className="h-5 w-5" />
                                    <span>Skip</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}