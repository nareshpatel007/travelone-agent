"use client";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import QuestionHeading from "./questionHeading";

interface Props {
    planYourTripForm: any;
    setPlanYourTripForm: React.Dispatch<React.SetStateAction<any>>;
}

export default function ChoosePytFlow({
    planYourTripForm,
    setPlanYourTripForm,
}: Props) {
    const [selected, setSelected] = useState<string | null>(null);

    // Restore selection when coming back to this step
    useEffect(() => {
        if (planYourTripForm?.choose_flow) {
            setSelected(planYourTripForm.choose_flow);
        }
    }, [planYourTripForm?.choose_flow]);

    const handleChange = (value: string) => {
        // Prevent reselect / deselect
        if (selected === value) return;

        // Update state
        setSelected(value);
        setPlanYourTripForm((prev: any) => ({
            ...prev,
            choose_flow: value,
            destination: "",
            country: [],
            first_time_visit: "",
            season_name: "",
            travel_month: "",
            trip_design: "",
            themes_priority_1: [],
            themes_priority_2: [],
            cities_options: [],
            selected_cities: [],
        }));
    };

    return (
        <div className="space-y-3 md:space-y-5">
            <QuestionHeading
                title="Do you have a destination in mind, or should we recommend one?"
            />
            <div className="max-h-[55vh] md:max-h-[60vh] overflow-y-auto space-y-2 md:space-y-3">
                <Option
                    text="I have a destination"
                    subText="I want to see the iconic highlights."
                    value="i_have_destination"
                    selected={selected}
                    onChange={handleChange}
                />

                <Option
                    text="Suggest a destination for me"
                    subText="I want to discover hidden gems."
                    value="suggest_destination"
                    selected={selected}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
}

function Option({
    text,
    subText,
    value,
    selected,
    onChange,
}: any) {
    const isActive = selected === value;

    return (
        <label
            onClick={() => onChange(value)}
            className={`flex items-center justify-between border px-5 py-4 rounded-sm cursor-pointer transition bg-white ${isActive ? "border-black" : "border-black/30"}`}
        >
            <div className="grid gap-1 text-sm md:text-base text-black">
                <span>{text}</span>
                <span>{subText}</span>
            </div>
            <div className="w-6 h-6 flex items-center justify-center">
                {isActive && <Check className="h-5 w-5 font-semibold text-black" />}
            </div>
            <input
                type="radio"
                checked={isActive}
                onChange={() => onChange(value)}
                className="hidden"
            />
        </label>
    );
}