"use client";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import QuestionHeading from "./questionHeading";

interface Props {
    planYourTripForm: any;
    setPlanYourTripForm: React.Dispatch<React.SetStateAction<any>>;
}

export default function StepCommunicationMethod({
    planYourTripForm,
    setPlanYourTripForm,
}: Props) {
    // Define state
    const [selected, setSelected] = useState<string | null>(null);

    // Restore selection when coming back to this step
    useEffect(() => {
        if (planYourTripForm?.communication_method) {
            setSelected(planYourTripForm.communication_method);
        }
    }, [planYourTripForm?.communication_method]);

    // Handle change
    const handleChange = (value: string) => {
        // Prevent reselect / deselect
        if (selected === value) return;

        // Update state
        setSelected(value);
        setPlanYourTripForm((prev: any) => ({
            ...prev,
            communication_method: value,
            best_day: (value !== "Call always") ? "" : prev.best_day,
            best_time: (value !== "Call always") ? "" : prev.best_time,
        }));
    };

    return (
        <div className="space-y-3 md:space-y-5">
            <QuestionHeading
                title="What is your preferred method of communication?"
            />
            <div className="max-h-[55vh] md:max-h-[60vh] overflow-y-auto space-y-1 md:space-y-3">
                <Option
                    text="Text me"
                    value="Text me"
                    selected={selected}
                    onChange={handleChange}
                />

                <Option
                    text="WhatsApp"
                    value="WhatsApp"
                    selected={selected}
                    onChange={handleChange}
                />

                <Option
                    text="Email is fine"
                    value="Email is fine"
                    selected={selected}
                    onChange={handleChange}
                />

                <Option
                    text="Call always"
                    value="Call always"
                    selected={selected}
                    onChange={handleChange}
                />
            </div>

            {planYourTripForm?.communication_method === "Call always" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="block text-sm md:text-base text-black">Best Day to Call You</label>
                        <select
                            className="w-full rounded-sm border text-sm md:text-base border-black px-4 py-2 bg-white"
                            onChange={(e) => setPlanYourTripForm({ ...planYourTripForm, best_day: e.target.value })}
                        >
                            <option>Select option</option>
                            <option value="Weekdays">Weekdays</option>
                            <option value="Weekends">Weekends</option>
                            <option value="Call me now">Call me now</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm md:text-base text-black">Best Time to Call You</label>
                        <select
                            className="w-full rounded-sm border text-sm md:text-base border-black px-4 py-2 bg-white"
                            onChange={(e) => setPlanYourTripForm({ ...planYourTripForm, best_time: e.target.value })}
                        >
                            <option>Select option</option>
                            <option value="Morning - 9 am to 12 pm">Morning - 9 am to 12 pm</option>
                            <option value="Afternoon - 12 pm to 3 pm">Afternoon - 12 pm to 3 pm</option>
                            <option value="Afternoon - 3 pm to 6 pm">Afternoon - 3 pm to 6 pm</option>
                            <option value="Evening - 6 pm to 9 pm">Evening - 6 pm to 9 pm</option>
                        </select>
                    </div>
                </div>
            )}
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
                {subText && <span>{subText}</span>}
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