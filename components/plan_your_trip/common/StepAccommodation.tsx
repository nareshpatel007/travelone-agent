"use client";
import { Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import QuestionHeading from "./questionHeading";

// Common questions
const COMMON_ACCOMMODATION_OPTIONS = [
    {
        text: "Budgeted 4 Star",
        subText: "Boutique Hotels (Curated comfort)",
        value: "Budgeted 4 Star",
    },
    {
        text: "Premium 4-Star",
        subText: "Boutique Hotels (Curated comfort)",
        value: "Premium 4-Star",
    },
    {
        text: "Luxury 5-Star",
        subText: "International Hotels (Ultimate service)",
        value: "Luxury 5-Star",
    },
    {
        text: "I will manage accommodation myself",
        subText: "",
        value: "Self Managed",
    },
];

// Country-specific
const COUNTRY_ACCOMMODATION_OPTIONS: Record<string, any[]> = {
    Japan: [
        {
            text: "Authentic Five-Star",
            subText: "Ryokans (Traditional stays with private in-room Onsens)",
            value: "Authentic Five-Star Ryokans",
        },
    ],
};

interface Props {
    planYourTripForm: any;
    setPlanYourTripForm: React.Dispatch<React.SetStateAction<any>>;
}

export default function StepAccommodation({
    planYourTripForm,
    setPlanYourTripForm,
}: Props) {
    // Define state
    const [selected, setSelected] = useState<string | null>(null);

    // Active country (supports multi-country → first one)
    const activeCountry = Array.isArray(planYourTripForm.country)
        ? planYourTripForm.country[0]
        : planYourTripForm.country;

    // 🔥 Build options dynamically
    const options = useMemo(() => {
        const countrySpecific = planYourTripForm.choose_flow === "i_have_destination" && COUNTRY_ACCOMMODATION_OPTIONS[activeCountry] || [];
        return [
            ...COMMON_ACCOMMODATION_OPTIONS.slice(0, 3),
            ...countrySpecific,
            COMMON_ACCOMMODATION_OPTIONS[3],
        ];
    }, [activeCountry]);

    // Restore selection
    useEffect(() => {
        if (planYourTripForm?.accommodation) {
            setSelected(planYourTripForm.accommodation);
        }
    }, [planYourTripForm?.accommodation]);

    const handleChange = (value: string) => {
        setSelected(value);
        setPlanYourTripForm((prev: any) => ({
            ...prev,
            accommodation: value,
        }));
    };

    return (
        <div className="space-y-3 md:space-y-5">
            <QuestionHeading title="What kind of accommodation do you prefer?" />

            <div className="max-h-[55vh] md:max-h-[60vh] overflow-y-auto space-y-1 md:space-y-3">
                {options.map((opt) => (
                    <Option
                        key={opt.value}
                        text={opt.text}
                        subText={opt.subText}
                        value={opt.value}
                        selected={selected}
                        onChange={handleChange}
                    />
                ))}
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
            className={`flex items-center justify-between border px-5 py-4 rounded-sm cursor-pointer transition bg-white ${
                isActive ? "border-black" : "border-black/30"
            }`}
        >
            <div className="grid gap-1 text-sm md:text-base text-black">
                <span>{text}</span>
                {subText && <span>{subText}</span>}
            </div>
            <div className="w-6 h-6 flex items-center justify-center">
                {isActive && <Check className="h-5 w-5 text-black" />}
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