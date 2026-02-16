"use client";

import { useEffect, useState } from "react";
import QuestionHeading from "./questionHeading";

// Traveler config
const travelerConfig = [
    ["Adults", "Ages 12 or above", "adults"],
    ["Child", "Ages 8-12", "child_8_12"],
    ["Child", "Ages 3-7", "child_3_7"],
    ["Infant", "Ages 0-2", "infant"],
];

interface Props {
    planYourTripForm: any;
    setPlanYourTripForm: React.Dispatch<React.SetStateAction<any>>;
}

export default function StepTravelers({
    planYourTripForm,
    setPlanYourTripForm,
}: Props) {
    const [activeTab, setActiveTab] = useState<"solo" | "family" | "group">("family");

    const [womenOnly, setWomenOnly] = useState({
        solo: false,
        family: false,
        group: false,
    });

    const [soloCount, setSoloCount] = useState({
        adults: 1,
    });

    const [familyCount, setFamilyCount] = useState({
        adults: 2,
        child_8_12: 0,
        child_3_7: 0,
        infant: 0,
    });

    const [groupCount, setGroupCount] = useState({
        adults: 2,
        child_8_12: 0,
        child_3_7: 0,
        infant: 0,
    });

    // Restore state once
    useEffect(() => {
        if (planYourTripForm?.prefer_travel_type) {
            setActiveTab(planYourTripForm.prefer_travel_type);
        }

        if (planYourTripForm?.solo) {
            setSoloCount({
                adults: planYourTripForm.solo.adults || 1,
            });
            setWomenOnly((p) => ({ ...p, solo: !!planYourTripForm.solo.is_women_only }));
        }

        if (planYourTripForm?.family_friends) {
            setFamilyCount(planYourTripForm.family_friends);
            setWomenOnly((p) => ({ ...p, family: !!planYourTripForm.family_friends.is_women_only }));
        }

        if (planYourTripForm?.groups) {
            setGroupCount(planYourTripForm.groups);
            setWomenOnly((p) => ({ ...p, group: !!planYourTripForm.groups.is_women_only }));
        }
    }, []);

    // Update count
    const updateCount = (
        type: "solo" | "family" | "group",
        key: string,
        value: number
    ) => {
        const updater =
            type === "solo"
                ? setSoloCount
                : type === "family"
                    ? setFamilyCount
                    : setGroupCount;

        updater((prev: any) => {
            const updated = {
                ...prev,
                [key]: Math.max(type === "solo" ? 1 : 0, value),
            };

            setPlanYourTripForm((form: any) => {
                if (type === "solo") {
                    return {
                        ...form,
                        prefer_travel_type: "solo",
                        solo: {
                            ...updated,
                            is_women_only: womenOnly.solo,
                        },
                    };
                }

                if (type === "family") {
                    return {
                        ...form,
                        prefer_travel_type: "family",
                        family_friends: {
                            ...updated,
                            is_women_only: womenOnly.family,
                        },
                    };
                }

                return {
                    ...form,
                    prefer_travel_type: "group",
                    groups: {
                        ...updated,
                        is_women_only: womenOnly.group,
                    },
                };
            });

            return updated;
        });
    };

    const handleWomenOnlyChange = (checked: boolean) => {
        setWomenOnly((prev) => ({
            ...prev,
            [activeTab]: checked,
        }));

        setPlanYourTripForm((form: any) => {
            if (activeTab === "solo") {
                return {
                    ...form,
                    prefer_travel_type: "solo",
                    solo: {
                        ...soloCount,
                        is_women_only: checked,
                    },
                };
            }

            if (activeTab === "family") {
                return {
                    ...form,
                    prefer_travel_type: "family",
                    family_friends: {
                        ...familyCount,
                        is_women_only: checked,
                    },
                };
            }

            return {
                ...form,
                prefer_travel_type: "group",
                groups: {
                    ...groupCount,
                    is_women_only: checked,
                },
            };
        });
    };

    const activeData: any = activeTab === "solo" ? soloCount : activeTab === "family" ? familyCount : groupCount;

    return (
        <div className="space-y-5">
            <QuestionHeading title="Who's traveling and how many of you?" />

            <div className="max-h-[55vh] md:max-h-[60vh] overflow-y-auto space-y-3">
                {/* Tabs */}
                <div className="grid grid-cols-3 gap-3 mb-3 text-center">
                    <Tab label="Solo" active={activeTab === "solo"} onClick={() => setActiveTab("solo")} />
                    <Tab label="Family" active={activeTab === "family"} onClick={() => setActiveTab("family")} />
                    <Tab label="Small Group" active={activeTab === "group"} onClick={() => setActiveTab("group")} />
                </div>

                {/* Counters */}
                <div className="space-y-3">
                    {(activeTab === "solo"
                        ? [["Adults", "Ages 12 or above", "adults"]]
                        : travelerConfig
                    ).map(([title, subtitle, key]: any) => (
                        <div
                            key={key}
                            className="flex justify-between items-center bg-white border border-black/30 px-4 py-2.5 rounded-sm"
                        >
                            <div>
                                <p className="text-sm md:text-base font-medium">{title}</p>
                                <p className="text-sm md:text-base text-gray-600">{subtitle}</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() =>
                                        updateCount(activeTab, key, activeData[key] - 1)
                                    }
                                    className="w-7 h-7 border rounded-full hover:bg-black cursor-pointer hover:text-white"
                                >
                                    −
                                </button>

                                <span className="w-4 text-sm md:text-base text-center">
                                    {activeData[key]}
                                </span>

                                <button
                                    onClick={() =>
                                        updateCount(activeTab, key, activeData[key] + 1)
                                    }
                                    className="w-7 h-7 border rounded-full hover:bg-black cur cursor-pointer hover:text-white"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Women only */}
                <div className="flex items-center gap-2 mt-4">
                    <input
                        type="checkbox"
                        checked={womenOnly[activeTab]}
                        onChange={(e) => handleWomenOnlyChange(e.target.checked)}
                    />
                    <span className="text-sm md:text-base">Women only</span>
                </div>
            </div>
        </div>
    );
}

function Tab({ label, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`py-2.5 rounded-sm border transition text-sm md:text-base cursor-pointer ${active ? "bg-black text-white" : "bg-white text-black border-black/30"}`}
        >
            {label}
        </button>
    );
}