"use client";

import { Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import QuestionHeading from "./questionHeading";

// Default seasons for countries
const DEFAULT_SEASON_MONTHS: Record<string, string[]> = {
    "Winter 2026": ["December", "January", "February"],
    "Spring 2026": ["March", "April"],
    "Summer 2026": ["May", "June", "July", "August"],
    "Autumn 2026": ["September", "October", "November"],
};

// Seasons for countries
const COUNTRY_SEASONS: any = {
    Japan: {
        "Spring (Cherry Blossoms)": ["March", "April"],
        "Autumn (Maple Leaves)": ["May", "June", "July", "August"],
        "Winter (Snow & Ski)": ["September", "October", "November"],
        "Summer (Festivals)": ["December", "January", "February"],
    },
    "South Korea": {
        "Spring (Cherry Blossoms)": ["March", "April"],
        "Autumn (Fall Colors)": ["May", "June", "July", "August"],
        "Winter (Snow & Ski)": ["September", "October", "November"],
        "Summer (Festivals)": ["December", "January", "February"],
    },
    Vietnam: {
        "Dry Season (Best Weather)": ["May", "June", "July", "August"],
        "Wet Season (Green Landscapes)": ["December", "January", "February"],
    },
    Indonesia: {
        "Dry Season (Best Beaches)": ["May", "June", "July", "August"],
        "Wet Season (Lush Nature)": ["December", "January", "February"],
    },
    Thailand: {
        "Cool Season (Best Time)": ["May", "June", "July", "August"],
        "Hot Season": ["December", "January", "February"],
        "Rainy Season": ["March", "April", "May"],
    },
    India: {
        "Winter (Best Weather)": ["December", "January", "February"],
        "Summer": ["May", "June", "July", "August"],
        "Monsoon": ["March", "April", "May"],
    },
    Kenya: {
        "Dry Season (Wildlife Safari)": ["May", "June", "July", "August"],
        "Green Season (Great Migration)": ["December", "January", "February"],
    },
    Norway: {
        "Summer (Midnight Sun)": ["May", "June", "July", "August"],
        "Winter (Northern Lights)": ["December", "January", "February"],
    },
    Iceland: {
        "Summer (Midnight Sun)": ["May", "June", "July", "August"],
        "Winter (Northern Lights)": ["December", "January", "February"],
    },
    Switzerland: {
        "Summer (Scenic Alps)": ["May", "June", "July", "August"],
        "Winter (Snow & Ski)": ["December", "January", "February"],
    },
    Sweden: {
        "Summer": ["May", "June", "July", "August"],
        "Winter (Northern Lights)": ["December", "January", "February"],
    },
    Finland: {
        "Summer": ["May", "June", "July", "August"],
        "Winter (Aurora & Snow)": ["December", "January", "February"],
    },
    Canada: {
        "Summer": ["May", "June", "July", "August"],
        "Autumn (Fall Colors)": ["September", "October", "November"],
        "Winter (Snow)": ["December", "January", "February"],
    },
};

interface Props {
    planYourTripForm: any;
    setPlanYourTripForm: React.Dispatch<React.SetStateAction<any>>;
}

export default function StepTravelTime({
    planYourTripForm,
    setPlanYourTripForm,
}: Props) {
    // Define state
    const [selected, setSelected] = useState<string | null>(null);
    const [month, setMonth] = useState<string>("");

    // Use first selected country (if multi-country)
    const activeCountry = Array.isArray(planYourTripForm.country) ? planYourTripForm.country[0] : planYourTripForm.country;

    // Get options
    const options = useMemo(() => {
        // Get country seasons
        const countrySeasons = activeCountry != "" ? COUNTRY_SEASONS[activeCountry] : [];

        // If country has seasons → use them
        if (countrySeasons) {
            return Object.keys(countrySeasons);
        } else {
            return Object.keys(DEFAULT_SEASON_MONTHS);
        }
    }, [activeCountry]);

    // Restore values
    useEffect(() => {
        if (planYourTripForm?.season_name) {
            setSelected(planYourTripForm.season_name);
        }
        if (planYourTripForm?.travel_month) {
            setMonth(planYourTripForm.travel_month);
        }
    }, [planYourTripForm]);

    // Reset season if country changes
    useEffect(() => {
        if (!selected && options.length > 0) {
            setSelected(options[0]);
            setPlanYourTripForm((prev: any) => ({
                ...prev,
                season_name: options[0],
            }));
        }
    }, [options]);

    const handleChange = (value: string) => {
        setSelected(value);
        setPlanYourTripForm((prev: any) => ({
            ...prev,
            season_name: value,
        }));
    };

    const handleMonthChange = (value: string) => {
        setMonth(value);
        setPlanYourTripForm((prev: any) => ({
            ...prev,
            travel_month: value,
        }));
    };

    const monthMap: Record<string, string[]> = {
        Spring: ["March", "April"],
        Summer: ["May", "June", "July", "August"],
        Autumn: ["September", "October", "November"],
        Winter: ["December", "January", "February"],
    };

    const allMonths = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];

    // Get months and season
    const seasonKey = selected?.split(" ")[0] || "";
    const monthsToShow =
        DEFAULT_SEASON_MONTHS[selected as keyof typeof DEFAULT_SEASON_MONTHS] ||
        monthMap[seasonKey] ||
        allMonths;

    return (
        <div className="space-y-3 md:space-y-5">
            <QuestionHeading
                title="When do you plan to travel?"
                subtitle={`You have selected ${planYourTripForm.country.length > 2 ? planYourTripForm.country.join(", ") : planYourTripForm.country.join(" and ")} as your travel destination.`}
            />

            <div className="max-h-[55vh] md:max-h-[60vh] overflow-y-auto space-y-5 md:space-y-8">
                <div className="space-y-2 md:space-y-3">
                    {options.map((item, i) => (
                        <Option
                            key={i}
                            text={item}
                            value={item}
                            selected={selected}
                            onChange={handleChange}
                        />
                    ))}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm md:text-base text-black">
                        Choose your travel month (optional)
                    </label>
                    <select
                        value={month}
                        onChange={(e) => handleMonthChange(e.target.value)}
                        className="w-full rounded-sm border text-sm md:text-base border-black px-4 py-2 bg-white"
                    >
                        <option value="">Select month</option>
                        {monthsToShow.map((m) => (
                            <option key={m} value={m}>
                                {m}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

function Option({ text, value, selected, onChange }: any) {
    const isActive = selected === value;

    return (
        <label
            onClick={() => onChange(value)}
            className={`flex items-center justify-between border px-5 py-3 rounded-sm cursor-pointer bg-white transition
            ${isActive ? "border-black" : "border-black/30"}`}
        >
            <span className="text-sm md:text-base">{text}</span>
            {isActive && <Check className="h-5 w-5 text-black" />}
            <input type="radio" checked={isActive} readOnly className="hidden" />
        </label>
    );
}
