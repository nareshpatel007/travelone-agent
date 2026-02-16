"use client";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import QuestionHeading from "./questionHeading";

interface Props {
    planYourTripForm: any;
    setPlanYourTripForm: React.Dispatch<React.SetStateAction<any>>;
}

export default function StepBudget({
    planYourTripForm,
    setPlanYourTripForm,
}: Props) {
    // Define state
    const [selected, setSelected] = useState<string | null>(null);

    // Restore selection when coming back to this step
    useEffect(() => {
        if (planYourTripForm?.budget) {
            setSelected(planYourTripForm.budget);
        }
    }, [planYourTripForm?.budget]);

    const handleChange = (value: string) => {
        setSelected(value);
        setPlanYourTripForm((prev: any) => ({
            ...prev,
            budget: value,
        }));
    };

    return (
        <div className="space-y-3 md:space-y-5">
            <QuestionHeading title="What is your target price range per person for this journey?" subtitle="Excluding international flights" />
            <div className="space-y-1 md:space-y-3">
                <Option
                    number="1"
                    text="$3000 - $5000 USD"
                    subText="(Affordable Private Experience)"
                    value="$3000 - $5000 USD (Affordable Private Experience)"
                    selected={selected}
                    onChange={handleChange}
                />

                <Option
                    number="2"
                    text="$5,000 – $7,500 USD"
                    subText="(Premium Private Experience)"
                    value="$5,000 – $7,500 USD (Premium Private Experience)"
                    selected={selected}
                    onChange={handleChange}
                />

                <Option
                    number="3"
                    text="$7,500 – $12,000 USD"
                    subText="(Luxury Stays & Signature Experiences)"
                    value="$7,500 – $12,000 USD (Luxury Stays & Signature Experiences)"
                    selected={selected}
                    onChange={handleChange}
                />

                <Option
                    number="4"
                    text="$12,000+ USD"
                    subText="(Ultra-Luxury & Exclusive Access)"
                    value="$12,000+ USD (Ultra-Luxury & Exclusive Access)"
                    selected={selected}
                    onChange={handleChange}
                />

                <Option
                    number="5"
                    text="I’d like to discuss this during my consultation"
                    subText=""
                    value="I’d like to discuss this during my consultation"
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
            className={`flex items-center justify-between border px-5 py-3 rounded-sm cursor-pointer transition bg-white ${isActive ? "border-black" : "border-black/30"}`}
        >
            <div className="grid gap-1 text-sm md:text-base text-black">
                <span>{text}</span>
                {subText && <span>{subText}</span>}
            </div>
            <div className="w-6 h-6 flex items-center justify-center">
                {isActive && <Check className="h-5 w-5 font-semibold text-black" />}
            </div>
            <input
                type="radio"
                name="budget"
                checked={isActive}
                onChange={() => onChange(value)}
                className="hidden"
            />
        </label>
    );
}
