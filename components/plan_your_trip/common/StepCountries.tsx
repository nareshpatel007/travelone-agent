"use client";

import QuestionHeading from "./questionHeading";

interface Props {
    planYourTripForm: any;
    setPlanYourTripForm: React.Dispatch<React.SetStateAction<any>>;
}

const countriesList: any = {
    Asia: ["Japan", "South Korea", "Vietnam", "Indonesia", "Thailand", "India"],
    Africa: ["Kenya"],
    Europe: [
        "Italy",
        "Spain",
        "Portugal",
        "Greece",
        "France",
        "Norway",
        "Iceland",
        "Denmark",
        "Switzerland",
        "Sweden",
        "Finland",
    ],
    "North America": ["Canada", "USA"],
};

export default function StepCountries({
    planYourTripForm,
    setPlanYourTripForm,
}: Props) {
    const selectedCountries: string[] = planYourTripForm.country || [];

    const toggleCountry = (country: string) => {
        setPlanYourTripForm((prev: any) => ({
            ...prev,
            country: selectedCountries.includes(country) ? selectedCountries.filter((c) => c !== country) : [...selectedCountries, country],
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
                title={`Which countries in ${planYourTripForm.destination} are you interested in exploring?`}
            />

            <div className="max-h-[55vh] md:max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {countriesList[planYourTripForm.destination]?.map(
                        (item: string, index: number) => {
                            const isSelected = selectedCountries.includes(item);
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => toggleCountry(item)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-sm border transition-all cursor-pointer
                                    ${isSelected ? "border-black bg-white" : "border-black/30 bg-white hover:border-black/50"}`}
                                >
                                    <span
                                        className={`flex items-center justify-center w-7 h-7 text-sm font-medium rounded border
                                        ${isSelected
                                                ? "bg-black border-black text-white"
                                                : "bg-white border-black/30 text-black"
                                            }`}
                                    >
                                        {index + 1}
                                    </span>

                                    <span className="text-sm font-medium text-gray-800">
                                        {item}
                                    </span>
                                </button>
                            );
                        }
                    )}
                </div>
            </div>
        </div>
    );
}
