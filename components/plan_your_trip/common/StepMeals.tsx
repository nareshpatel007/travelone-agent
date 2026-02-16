"use client";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import QuestionHeading from "./questionHeading";

interface Props {
    planYourTripForm: any;
    setPlanYourTripForm: React.Dispatch<React.SetStateAction<any>>;
}

export default function StepMeals({
    planYourTripForm,
    setPlanYourTripForm,
}: Props) {
    // Define meals
    const meals = [
        "Michelin & Fine Dining",
        "Local Gems & Markets",
        "Cultural & Farm-to-Table",
        "A Balanced Mix",
        "Flexible (Decide on the go)",
        "I will manage meals on my own",
    ];

    const [selected, setSelected] = useState<string[]>([]);

    // ✅ Restore previously selected meals
    useEffect(() => {
        if (Array.isArray(planYourTripForm?.meal_preferences)) {
            setSelected(planYourTripForm.meal_preferences);
        }
    }, [planYourTripForm?.meal_preferences]);

    const toggleMeal = (meal: string) => {
        setSelected((prev) => {
            const updated = prev.includes(meal)
                ? prev.filter((m) => m !== meal)
                : [...prev, meal];

            // ✅ Save to parent state
            setPlanYourTripForm((form: any) => ({
                ...form,
                meal_preferences: updated,
            }));

            return updated;
        });
    };

    return (
        <div className="space-y-3 md:space-y-5">
            <QuestionHeading
                title="How would you like to dine?"
                subtitle="Select your preferences"
            />
            <div className="max-h-[55vh] md:max-h-[60vh] overflow-y-auto space-y-1 md:space-y-3">
                {meals.map((meal, i) => {
                    const isActive = selected.includes(meal);

                    return (
                        <label
                            key={i}
                            onClick={() => toggleMeal(meal)}
                            className={`flex items-center justify-between border px-5 py-4 rounded-sm cursor-pointer transition bg-white ${isActive ? "border-black" : "border-black/30"}`}
                        >
                            <div className="grid gap-1 text-sm md:text-base text-black">
                                <span>{meal}</span>
                            </div>
                            <div className="w-6 h-6 flex items-center justify-center">
                                {isActive && <Check className="h-5 w-5 font-semibold text-black" />}
                            </div>
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={() => toggleMeal(meal)}
                                className="hidden"
                            />
                        </label>
                    );
                })}
            </div>
        </div>
    );
}