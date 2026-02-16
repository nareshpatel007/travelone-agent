"use client";

import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import QuestionHeading from "./questionHeading";

interface Props {
    planYourTripForm: any;
    setPlanYourTripForm: React.Dispatch<React.SetStateAction<any>>;
}

export default function StepThemes({
    planYourTripForm,
    setPlanYourTripForm,
}: Props) {
    const themes = [
        "Historical & Heritage Sites",
        "Adventure & Outdoor Activities",
        "Nature & Scenic Experiences",
        "Food & Culinary Experiences",
        "Cruises & Water Journeys",
        "Seasonal & Holiday Trips",
        "Luxury & Romantic Getaways",
        "Spiritual & Religious Journeys",
        "Eco & Sustainable Travel",
        "Nightlife & Festivals",
        "Local Culture & Traditions",
        "Sports & Active Travel",
    ];

    const [selected, setSelected] = useState<string[]>([]);

    useEffect(() => {
        if (Array.isArray(planYourTripForm?.themes_priority_1)) {
            setSelected(planYourTripForm.themes_priority_1);
        }
    }, [planYourTripForm?.themes_priority_1]);

    const toggleTheme = (theme: string) => {
        setSelected((prev) => {
            const updated = prev.includes(theme)
                ? prev.filter((t) => t !== theme)
                : [...prev, theme];

            setPlanYourTripForm((form: any) => ({
                ...form,
                themes_priority_1: updated,
            }));

            return updated;
        });
    };

    const removeTheme = (theme: string) => {
        setSelected((prev) => {
            const updated = prev.filter((t) => t !== theme);

            setPlanYourTripForm((form: any) => ({
                ...form,
                themes_priority_1: updated,
            }));

            return updated;
        });
    };

    return (
        <div className="space-y-3 md:space-y-5">
            <QuestionHeading title="What kind of experiences do you want to add in the first itinerary?" />

            <div className="max-h-[55vh] md:max-h-[60vh] overflow-y-auto space-y-1 md:space-y-3">
                {selected.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap no-scrollbar pb-1">
                        {selected.map((theme) => (
                            <span
                                key={theme}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-black text-white rounded-sm"
                            >
                                {theme}
                                <button
                                    onClick={() => removeTheme(theme)}
                                    className="ml-1 hover:text-gray-300 cursor-pointer"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                {themes.map((theme, i) => (
                    <ThemeItem
                        key={theme}
                        index={i}
                        theme={theme}
                        isActive={selected.includes(theme)}
                        onToggle={toggleTheme}
                    />
                ))}
            </div>
        </div>
    );
}

function ThemeItem({
    theme,
    index,
    isActive,
    onToggle,
}: any) {
    return (
        <label
            onClick={() => onToggle(theme)}
            className={`flex items-center justify-between border px-5 py-3 rounded-sm cursor-pointer transition bg-white ${isActive ? "border-black" : "border-black/30"
                }`}
        >
            <div className="grid gap-1 text-sm md:text-base text-black">
                <span>{theme}</span>
            </div>
            <div className="w-6 h-6 flex items-center justify-center">
                {isActive && <Check className="h-5 w-5 text-black" />}
            </div>
            <input
                type="checkbox"
                checked={isActive}
                onChange={() => onToggle(theme)}
                className="hidden"
            />
        </label>
    );
}