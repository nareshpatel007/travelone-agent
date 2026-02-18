"use client";

import { useEffect, useState } from "react";
import QuestionHeading from "./questionHeading";
import { Minus, Plus } from "lucide-react";

interface Props {
    planYourTripForm: any;
    setPlanYourTripForm: React.Dispatch<React.SetStateAction<any>>;
}

export default function StepCitiesActivities({
    planYourTripForm,
    setPlanYourTripForm,
}: Props) {
    // Define state
    const [citiesActivities, setCitiesActivities] = useState<Record<string, number>>({});

    // Initialize Default Cities Activities
    useEffect(() => {
        // Get selected cities and existing activities
        const selectedCities = planYourTripForm?.selected_cities || [];
        const existingActivities = planYourTripForm?.cities_activities;

        // If empty → generate default
        if (
            selectedCities.length > 0 &&
            (!existingActivities || Object.keys(existingActivities).length === 0)
        ) {
            // Generate default activities with 1 activity per city
            const defaultActivities: Record<string, number> = {};

            // Loop through selected cities and set default activities
            selectedCities.forEach((city: string) => {
                defaultActivities[city] = 2;
            });

            // Update state and form
            setCitiesActivities(defaultActivities);

            // Update form with default activities
            setPlanYourTripForm((prev: any) => ({
                ...prev,
                cities_activities: defaultActivities,
            }));
        } else if (existingActivities) {
            // If existing activities exist, ensure they are in sync with selected cities
            setCitiesActivities(existingActivities);
        }
    }, [planYourTripForm?.selected_cities]);

    // Update Count
    const updateCount = (city: string, value: number) => {
        // Prevent negative values
        if (value < 0) return;

        // Update state
        const updated = {
            ...citiesActivities,
            [city]: value,
        };

        // Update state
        setCitiesActivities(updated);

        // Update form
        setPlanYourTripForm((prev: any) => ({
            ...prev,
            cities_activities: updated,
        }));
    };

    return (
        <div className="space-y-6">
            <QuestionHeading title="How many activities would you like in each city?" />
            <div className="max-h-[60vh] overflow-y-auto space-y-4">
                {Object.entries(citiesActivities).map(([city, count]) => (
                    <div
                        key={city}
                        className="flex justify-between items-center bg-white shadow-sm border border-black/10 px-5 py-4 rounded-lg transition"
                    >
                        <p className="text-lg font-semibold capitalize">{city}</p>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => updateCount(city, count - 1)}
                                className="p-1.5 border border-black bg-white rounded-full text-sm text-black hover:bg-black hover:text-white transition cursor-pointer hover:bg-black hover:text-white"
                            >
                                <Minus className="w-4 h-4" />
                            </button>

                            <span className="text-lg font-medium w-6 text-center">
                                {count}
                            </span>

                            <button
                                onClick={() => updateCount(city, count + 1)}
                                className="p-1.5 border border-black bg-white rounded-full text-sm text-black hover:bg-black hover:text-white transition cursor-pointer hover:bg-black hover:text-white"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}