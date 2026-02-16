"use client";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import QuestionHeading from "./questionHeading";

interface Props {
    planYourTripForm: any;
    setPlanYourTripForm: React.Dispatch<React.SetStateAction<any>>;
}

export default function StepFirstVisit({
    planYourTripForm,
    setPlanYourTripForm,
}: Props) {
    const [selected, setSelected] = useState<string | null>(null);

    // Restore selection when coming back to this step
    useEffect(() => {
        if (planYourTripForm?.first_time_visit) {
            setSelected(planYourTripForm.first_time_visit);
        }
    }, [planYourTripForm?.first_time_visit]);

    const handleChange = (value: string) => {
        // Prevent reselect / deselect
        if (selected === value) return;

        setSelected(value);

        setPlanYourTripForm((prev: any) => ({
            ...prev,
            first_time_visit: value,
        }));
    };

    return (
        <div className="space-y-3 md:space-y-5">
            <QuestionHeading
                title={`Is this your first time visiting ${planYourTripForm?.country.join(", ")}?`}
            />
            <div className="max-h-[55vh] md:max-h-[60vh] overflow-y-auto space-y-2 md:space-y-3">
                <Option
                    text="Yes,"
                    subText="I want to see the iconic highlights."
                    value="Yes, I want to see the iconic highlights."
                    selected={selected}
                    onChange={handleChange}
                />

                <Option
                    text="No,"
                    subText="I’ve been before and want to discover hidden gems."
                    value="No, I’ve been before and want to discover hidden gems."
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