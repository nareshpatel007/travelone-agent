"use client"

import { useState } from "react";
import StepFirstVisit from "./common/StepFirstVisit";
import StepTravelTime from "./common/StepTravelTime";
import StepThemes from "./common/StepThemes";
import StepRegions from "./common/StepRegions";
import StepDays from "./common/StepDays";
import StepMeals from "./common/StepMeals";
import StepTransfer from "./common/StepTransfer";
import StepGuide from "./common/StepGuide";
import StepSummary from "./common/StepSummary";
import { CheckCircle, ListCheck, Loader2, MoveLeft, MoveRight, X } from "lucide-react";
import StepCountries from "./common/StepCountries";
import ChoosePytFlow from "./common/ChoosePytFlow";
import StepDestinations from "./common/StepDestinations";
import StepCustomPrompt from "./common/StepCustomPrompt";
import CountDownStep from "./common/CountDownStep";
import StepCitiesActivities from "./common/StepCitiesActivities";

// Define interface
interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
}

// Define form data
const defaultFormData = {
    choose_flow: "",
    destination: "",
    country: [],
    first_time_visit: "",
    season_name: "",
    travel_month: "",
    themes_options: [],
    cities_options: [],
    selected_cities: [],
    cities_activities: [],
    day_option: "7 - 10 Days (The Essential Experience)",
    meal_preferences: [],
    transportation: "",
    guide: "",
    custom_prompt: "",
    is_show_history_btn: false
};

export function CommonPlanTripModal({ open, onOpenChange }: Props) {
    // Define state
    const [step, setStep] = useState(0);
    const [planYourTripForm, setPlanYourTripForm] = useState<any>(defaultFormData);
    const [errors, setErrors] = useState<string>("");
    const [formLoader, setFormLoader] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [importToken, setImportToken] = useState("");

    // Handle close
    const handleClose = () => {
        setStep(0);
        setErrors("");
        setPlanYourTripForm(defaultFormData);
        setIsSubmitted(false);
        setImportToken("");
        onOpenChange(false);
    }

    // Validate step
    const validateStep = () => {
        // Define error
        let newErrors = "";

        // Get current step
        const steps = getFormSteps(planYourTripForm, true);
        const activeStep = steps[step];
        const flow = planYourTripForm.choose_flow;

        // Validate step
        switch (activeStep) {
            case "choose_flow":
                if (!flow) {
                    newErrors = "Please select an option.";
                }
                break;

            case "destinations":
                if (flow === "i_have_destination" && !planYourTripForm.destination) {
                    newErrors = "Please select a destination.";
                }
                break;

            case "countries":
                if (
                    flow === "i_have_destination" &&
                    (!Array.isArray(planYourTripForm.country) ||
                        planYourTripForm.country.length === 0)
                ) {
                    newErrors = "Please select at least one country.";
                }
                break;

            case "first_visit":
                if (
                    flow === "i_have_destination" &&
                    !planYourTripForm.first_time_visit
                ) {
                    newErrors = "Please select an option.";
                }
                break;

            case "travel_time":
                if (!planYourTripForm.season_name) {
                    newErrors = "Please select your travel season.";
                }
                break;

            case "themes_single":
                if (
                    !Array.isArray(planYourTripForm.themes_options) ||
                    planYourTripForm.themes_options.length === 0
                ) {
                    newErrors = "Please select at least one theme.";
                }
                break;

            case "regions":
                if (
                    flow === "i_have_destination" &&
                    !Array.isArray(planYourTripForm.selected_cities) ||
                    planYourTripForm.selected_cities.length === 0
                ) {
                    newErrors = "Please select at least one city.";
                }
                break;

            case "days":
                if (!planYourTripForm.day_option) {
                    newErrors = "Please select trip duration.";
                }
                break;
        }

        // Set errors
        setErrors(newErrors);

        // Return response
        return newErrors === "";
    };

    // Handle submit plan your trip
    const handlSubmitPlanYourTrip = async () => {
        // Validate step
        if (!validateStep()) return;

        try {
            // Update state
            setFormLoader(true);

            // Make API request
            const response = await fetch("/api/import/generate_tour", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    agent_id: 1,
                    data: planYourTripForm
                })
            });

            // Get json parse
            const data = await response.json();

            // Check status
            if (data.status) {
                // Update state
                setIsSubmitted(true);
                setImportToken(data?.data?.token);
            } else {
                // Update state
                setErrors(data?.message || "Unable to process your request. Please try again.");
            }
        } catch (error) {
            // Set error
            setErrors("Unable to process your request. Please try again.");
        } finally {
            // Update state
            setFormLoader(false);
        }
    };

    // Handle prev step
    const handlePreviousStep = () => {
        // Clear error
        setErrors("");

        // Update state
        if (step > 0) setStep(step - 1);
    };

    // Handle next step
    const handleNextStep = async () => {
        // Validate step
        if (!validateStep()) return;

        // Update state
        setErrors("");
        setStep(step + 1);
    };

    // Get next/prev active steps
    const getFormSteps = (form: any, isReturnKey = false) => {
        // Get remaining keys
        const stepKeys = [
            "choose_flow",
            "destinations",
            "countries",
            "first_visit",
            "travel_time",
            "regions",
            "cities_activities",
            "themes_single",
            "days",
            "meals",
            "transfer",
            "guide",
            "custom_prompt",
            "summary",
        ];

        // If return key
        if (isReturnKey) return stepKeys;

        // COMPONENT MAP (order must match keys)
        const componentMap: Record<string, any> = {
            choose_flow: ChoosePytFlow,
            destinations: StepDestinations,
            countries: StepCountries,
            first_visit: StepFirstVisit,
            travel_time: StepTravelTime,
            themes_single: StepThemes,
            regions: StepRegions,
            cities_activities: StepCitiesActivities,
            days: StepDays,
            meals: StepMeals,
            transfer: StepTransfer,
            guide: StepGuide,
            custom_prompt: StepCustomPrompt,
            summary: StepSummary,
        };

        // Return response
        return stepKeys.map((key) => componentMap[key]);
    };

    // Handle jump to step
    const jumpToStep = (stepKey: any) => {
        const steps = getFormSteps(planYourTripForm, true);
        const index = steps.indexOf(stepKey);
        if (index !== -1) {
            setStep(index);
        }
    };

    // Get current step
    const stepsValue = getFormSteps(planYourTripForm);
    const stepsKey = getFormSteps(planYourTripForm, true);
    const CurrentStep = stepsValue[step];
    const CurrentStepKey = stepsKey[step];

    // Define button basic class
    const btnBase = "flex items-center justify-center gap-2 w-full md:w-auto " + "px-4 md:px-8 py-2 md:py-2.5 rounded-sm font-medium border cursor-pointer transition " + "disabled:opacity-50 disabled:cursor-not-allowed";

    // If not open
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
            <div className="relative w-full h-full bg-[#FFF6E5] overflow-auto">
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 z-10 p-2 rounded-full bg-[#FFC765] hover:bg-black hover:text-white cursor-pointer transition"
                >
                    <X className="h-5 w-5" />
                </button>
                <div className="min-h-full flex items-start justify-center px-4 py-16">
                    {!isSubmitted && <div className="w-full max-w-4xl space-y-5">
                        {/* Screen Step */}
                        {CurrentStep && (
                            <CurrentStep
                                planYourTripForm={planYourTripForm}
                                setPlanYourTripForm={setPlanYourTripForm}
                                jumpToStep={jumpToStep}
                            />
                        )}

                        {/* Error */}
                        {errors && (
                            <div className="text-center">
                                <p className="text-red-600 text-sm md:text-base">{errors}</p>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex flex-row items-stretch md:items-center justify-center gap-2 md:gap-3 w-full">
                            {/* START */}
                            {step === 0 && !formLoader && (
                                <button
                                    disabled={formLoader}
                                    onClick={handleNextStep}
                                    className={`${btnBase} bg-black text-white border-black hover:bg-white hover:text-black`}
                                >
                                    {formLoader && <Loader2 className="w-5 h-5 animate-spin" />}
                                    Start <MoveRight className="h-4 w-4" />
                                </button>
                            )}

                            {/* PREVIOUS */}
                            {step > 0 && (
                                <button
                                    onClick={handlePreviousStep}
                                    disabled={formLoader}
                                    className={`${btnBase} bg-white text-black border-black hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    <MoveLeft className="h-4 w-4" />
                                    Previous
                                </button>
                            )}

                            {/* NEXT */}
                            {step > 0 && !formLoader && CurrentStepKey !== "summary" && (
                                <button
                                    disabled={formLoader}
                                    onClick={() => handleNextStep()}
                                    className={`${btnBase} bg-black text-white border-black hover:bg-white hover:text-black`}
                                >
                                    Next <MoveRight className="h-4 w-4" />
                                </button>
                            )}

                            {/* SKIP */}
                            {!formLoader && ["meals", "transfer", "guide", "custom_prompt"].includes(CurrentStepKey) && (
                                <button
                                    onClick={() => {
                                        setStep(step + 1);
                                        setErrors("");
                                    }}
                                    className={`${btnBase} bg-white text-black border-black hover:bg-black hover:text-white`}
                                >
                                    Skip <MoveRight className="h-4 w-4" />
                                </button>
                            )}

                            {/* VIEW SUMMARY */}
                            {!formLoader && planYourTripForm?.is_show_history_btn && CurrentStepKey !== "summary" && (
                                <button
                                    onClick={() => jumpToStep("summary")}
                                    className={`${btnBase} hidden md:flex bg-black text-white border-black hover:bg-white hover:text-black`}
                                >
                                    <ListCheck className="h-4 w-4" />
                                    View Summary
                                </button>
                            )}

                            {/* SUBMIT */}
                            {CurrentStepKey === "summary" && (
                                <button
                                    disabled={formLoader}
                                    onClick={handlSubmitPlanYourTrip}
                                    className={`${btnBase} bg-black text-white border-black hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {formLoader ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <CheckCircle className="h-5 w-5" />
                                    )}
                                    Submit
                                </button>
                            )}
                        </div>

                        {/* VIEW SUMMARY FOR MOBILE */}
                        {!formLoader && <div className="flex md:hidden flex-row w-full">
                            {planYourTripForm?.is_show_history_btn && !["summary"].includes(CurrentStepKey) && (
                                <button
                                    onClick={() => jumpToStep("summary")}
                                    className={`${btnBase} bg-black text-white border-black hover:bg-white hover:text-black`}
                                >
                                    <ListCheck className="h-4 w-4" />
                                    View Summary
                                </button>
                            )}
                        </div>}
                    </div>}

                    {/* Countdown Step */}
                    {isSubmitted && <CountDownStep
                        isSubmitted={isSubmitted}
                        token={importToken}
                    />}
                </div>
            </div>
        </div>
    )
}
