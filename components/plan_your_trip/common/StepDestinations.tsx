"use client";

import QuestionHeading from "./questionHeading";

interface Props {
    planYourTripForm: any;
    setPlanYourTripForm: React.Dispatch<React.SetStateAction<any>>;
}

// Define destination list
const destinationList = [
    "Asia",
    "Africa",
    "Europe",
    "North America"
];

export default function StepDestinations({
    planYourTripForm,
    setPlanYourTripForm,
}: Props) {
    return (
        <>
            <div className="space-y-3 md:space-y-5">
                <QuestionHeading
                    title="Where do you want to go next?"
                />
                <div className="max-h-[55vh] md:max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {destinationList.map((item: string, index: number) => (
                            <button
                                key={index}
                                onClick={() => setPlanYourTripForm({
                                    ...planYourTripForm,
                                    destination: item,
                                    country: [],
                                    first_time_visit: "",
                                    season_name: "",
                                    travel_month: "",
                                    trip_design: "",
                                    themes_priority_1: [],
                                    themes_priority_2: [],
                                    cities_options: [],
                                    selected_cities: [],
                                })}
                                className={`flex items-center gap-3 px-4 py-3 rounded-sm text-black border-1 transition-all cursor-pointer ${planYourTripForm.destination === item ? "border-black bg-white" : "border-black/30 bg-white hover:border-black/50"}`}
                            >
                                <span className={`flex items-center justify-center w-7 h-7 text-sm font-medium rounded border border-black/30 ${planYourTripForm.destination === item ? "bg-black border-black text-white" : "bg-white text-black"}`}>
                                    {index + 1}
                                </span>
                                <span className="text-sm font-medium text-gray-800">{item}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}