"use client";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import QuestionHeading from "./questionHeading";

interface Props {
    planYourTripForm: any;
    setPlanYourTripForm: React.Dispatch<React.SetStateAction<any>>;
}

export default function StepGuide({
    planYourTripForm,
    setPlanYourTripForm,
}: Props) {
    const [selected, setSelected] = useState<string | null>(null);

    // ✅ Restore selection when coming back to this step
    useEffect(() => {
        if (planYourTripForm?.guide) {
            setSelected(planYourTripForm.guide);
        }
    }, [planYourTripForm?.guide]);

    const handleChange = (value: string) => {
        setSelected(value);

        setPlanYourTripForm((prev: any) => ({
            ...prev,
            guide: value,
        }));
    };

    return (
        <div className="space-y-3 md:space-y-5">
            <QuestionHeading title="Select your preferred guide style" />
            <div className="max-h-[55vh] md:max-h-[60vh] overflow-y-auto space-y-2 md:space-y-3">
                <Option
                    text="The Specialist"
                    subText="(Academic, deep historical knowledge)"
                    value="The Specialist (Academic, deep historical knowledge)"
                    selected={selected}
                    onChange={handleChange}
                />

                <Option
                    text="The Local Insider"
                    subText="(Casual, lifestyle-focused, hidden spots)"
                    value="The Local Insider (Casual, lifestyle-focused, hidden spots)"
                    selected={selected}
                    onChange={handleChange}
                />

                <Option
                    text="Maximum Independence"
                    subText="(Private transport only, self-guided exploration)"
                    value="Maximum Independence (Private transport only, self-guided exploration)"
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
