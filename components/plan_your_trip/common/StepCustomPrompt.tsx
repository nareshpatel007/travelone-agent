"use client";

import QuestionHeading from "./questionHeading";
import { Textarea } from "@/components/ui/textarea";

interface Props {
    planYourTripForm: any;
    setPlanYourTripForm: React.Dispatch<React.SetStateAction<any>>;
}

export default function StepCustomPrompt({
    planYourTripForm,
    setPlanYourTripForm,
}: Props) {
    // Handle change
    const handleChange = (value: string) => {
        setPlanYourTripForm((prev: any) => ({
            ...prev,
            custom_prompt: value,
        }));
    };

    return (
        <div className="space-y-3 md:space-y-5">
            <QuestionHeading
                title="Write a special prompt or instruction for your trip?"
                subtitle="Suggestions for places to visit, accommodations, includes things to do and more"
            />
            <div className="max-h-[55vh] md:max-h-[60vh] overflow-y-auto space-y-2 md:space-y-3">
                <Textarea
                    defaultValue={planYourTripForm?.custom_prompt || ""}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder="Write your prompt here..."
                    className="bg-white p-4 rounded-sm text-sm md:text-base min-h-[250px]"
                />
            </div>
        </div>
    );
}