'use client'

import { CheckCircle, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

// Define Props
interface Props {
    tourId: string;
    cancellationPayment: any;
    paymentScheduleList: any;
    importantNotes: any;
    termsConditions: any;
    whatIsincluded: any;
    whatIsNotincluded: any;
    faqsList: any;
    isRefundable: boolean;
}

// Define tabs
const TABS = [
    { key: "inclusions", value: "Inclusions" },
    { key: "exclusions", value: "Exclusions" },
    { key: "notes", value: "Important Notes" },
    { key: "terms", value: "Terms & Conditions" },
    { key: "payment", value: "Payment Schedule" },
    { key: "cancellation", value: "Cancellation Policy" },
    { key: "faqs", value: "FAQs" },
];

export default function TermsList({
    tourId,
    cancellationPayment,
    paymentScheduleList,
    importantNotes,
    termsConditions,
    whatIsincluded,
    whatIsNotincluded,
    faqsList,
    isRefundable
}: Props) {
    // Define state
    const [activeTab, setActiveTab] = useState("inclusions");
    const [terms, setTerms] = useState<string[]>(termsConditions || []);
    const [notes, setNotes] = useState<string[]>(importantNotes || []);
    const [inclusions, setInclusions] = useState<string[]>(whatIsincluded || []);
    const [exclusions, setExclusions] = useState<string[]>(whatIsNotincluded || []);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [message, setMessage] = useState<any>(null);
    const [paymentSchedule, setPaymentSchedule] = useState(paymentScheduleList || [{ percentage: 50, days: 0 }]);
    const [cancellationType, setCancellationType] = useState<boolean>(isRefundable || true);
    const [cancellationRules, setCancellationRules] = useState(cancellationPayment || []);
    const [faqs, setFaqs] = useState([{ id: Date.now(), question: "", answer: "" }]);

    // FAQs update
    useEffect(() => {
        // Filter array
        const filterFaqs = faqsList.map((f: any, id: number) => ({
            id: id,
            question: f[0],
            answer: f[1]
        }));

        // Update state
        setFaqs(filterFaqs);
    }, [faqsList]);

    // Handle list change
    const handleListChange = (
        setter: any,
        list: string[],
        index: number,
        value: string
    ) => {
        const updated = [...list];
        updated[index] = value;
        setter(updated);
    };

    // Add List Items
    const addListItem = (setter: any, list: string[]) => {
        setter([...list, ""]);
    };

    // Remove List Items
    const removeListItem = (setter: any, list: string[], index: number) => {
        setter(list.filter((_, i) => i !== index));
    };

    // Update Schedule
    const updateSchedule = (
        setter: any,
        list: any[],
        index: number,
        field: string,
        value: number
    ) => {
        const updated = [...list];
        updated[index][field] = value;
        setter(updated);
    };

    // Add Schedule
    const addScheduleRow = (setter: any, list: any[]) => {
        setter([...list, { percentage: 0, days: 0 }]);
    };

    // Remove Schedule
    const removeScheduleRow = (setter: any, list: any[], index: number) => {
        setter(list.filter((_, i) => i !== index));
    };

    // Add FAQ
    const addFaq = () => {
        setFaqs([...faqs, { id: Date.now(), question: "", answer: "" }]);
    };

    // Update FAQ
    const updateFaq = (id: number, field: string, value: string) => {
        setFaqs(faqs.map((f: any) => f.id === id ? { ...f, [field]: value } : f));
    };

    // Remove FAQ
    const removeFaq = (id: number) => {
        setFaqs(faqs.filter((f: any) => f.id !== id));
    };

    // Handle update
    const handleUpdate = async () => {
        try {
            // Update state
            setMessage(null);
            setIsFormLoading(true);

            // Make API call
            const response = await fetch("/api/tours/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    tour_id: tourId,
                    action: "terms",
                    data: {
                        inclusions,
                        exclusions,
                        notes,
                        terms,
                        payment_schedule: paymentSchedule,
                        cancellation_policy: cancellationRules,
                        faqs: faqs.map((f: any) => [f.question, f.answer]),
                        is_refundable: cancellationType
                    }
                }),
            });

            // Convert to json
            const data = await response.json();

            // Check response
            if (data.status) {
                setMessage({ type: "success", text: "Terms updated successfully." });
            } else {
                setMessage({ type: "error", text: data.message || "Unable to process your request. Please try again." });
            }

            // Auto hide error
            setTimeout(() => { setMessage(null); }, 5000);
        } catch (error) {
            // Update state
            setMessage({ type: "error", text: "Unable to process your request. Please try again." });
        } finally {
            // Update state
            setIsFormLoading(false);
        }
    };

    return (
        <div className="py-6 space-y-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-semibold text-black">
                        Policies & Payment Setup
                    </h1>
                    <div className="flex items-center gap-4">
                        {/* Message */}
                        {message && (
                            <div
                                className={`px-4 py-2 rounded text-sm font-medium transition-all duration-300 ${message.type === "success"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-600"
                                    }`}
                            >
                                {message.text}
                            </div>
                        )}

                        {/* Save Button */}
                        <button
                            onClick={handleUpdate}
                            disabled={isFormLoading}
                            className="flex items-center gap-2 border-1 border-black bg-black text-white px-4 py-1.5 rounded-sm text-sm font-medium cursor-pointer hover:bg-amber-300 hover:text-black disabled:cursor-not-allowed disabled:bg-black/50"
                        >
                            {isFormLoading && <Loader2 className="animate-spin w-4 h-4" />}
                            {!isFormLoading && <CheckCircle className='w-4 h-4' />}
                            Save Changes
                        </button>
                    </div>
                </div>
                <div className="flex gap-6">
                    <div className="w-64 bg-white rounded shadow-sm p-4 space-y-2">
                        {TABS.map(tab => (
                            <div
                                key={tab?.key}
                                onClick={() => setActiveTab(tab?.key)}
                                className={`cursor-pointer px-4 py-2.5 rounded capitalize text-base font-medium ${activeTab === tab?.key ? "bg-black text-white" : "hover:bg-gray-100"}`}
                            >
                                {tab?.value}
                            </div>
                        ))}
                    </div>
                    <div className="flex-1 bg-white rounded shadow-sm p-5 space-y-3">
                        {/* TERMS / INCLUSIONS / EXCLUSIONS */}
                        {["terms", "inclusions", "exclusions", "notes"].includes(activeTab) && (
                            <>
                                <h2 className="text-lg font-semibold capitalize">
                                    {activeTab == "terms" ? "Terms & Conditions" : activeTab}
                                </h2>

                                {(activeTab === "terms" ? terms : activeTab === "inclusions" ? inclusions : activeTab === "notes" ? notes : exclusions).map((item: string, index: number) => (
                                    <div key={index} className="flex gap-3">
                                        <input
                                            value={item}
                                            onChange={(e) =>
                                                handleListChange(
                                                    activeTab === "terms" ? setTerms :
                                                        activeTab === "inclusions" ? setInclusions :
                                                            setExclusions,
                                                    activeTab === "terms" ? terms :
                                                        activeTab === "inclusions" ? inclusions :
                                                            exclusions,
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            placeholder={`Item ${index + 1}`}
                                            className="flex-1 px-4 py-2 border text-base rounded focus:ring-1 focus:ring-black outline-none"
                                        />

                                        <button
                                            onClick={() =>
                                                removeListItem(
                                                    activeTab === "terms" ? setTerms :
                                                        activeTab === "inclusions" ? setInclusions :
                                                            setExclusions,
                                                    activeTab === "terms" ? terms :
                                                        activeTab === "inclusions" ? inclusions :
                                                            exclusions,
                                                    index
                                                )
                                            }
                                        >
                                            <Trash2 size={16} className="text-red-500 hover:text-red-600 cursor-pointer" />
                                        </button>
                                    </div>
                                ))}

                                <button
                                    onClick={() =>
                                        addListItem(
                                            activeTab === "terms" ? setTerms :
                                                activeTab === "inclusions" ? setInclusions :
                                                    activeTab === "notes" ? setNotes :
                                                        setExclusions,
                                            activeTab === "terms" ? terms :
                                                activeTab === "inclusions" ? inclusions :
                                                    activeTab === "notes" ? notes :
                                                        exclusions
                                        )
                                    }
                                    className="mt-5 flex items-center gap-2 bg-[#FFF9EE] text-black border border-black px-4 py-1 rounded text-sm cursor-pointer font-medium hover:bg-black hover:text-white"
                                >
                                    <Plus size={16} /> Add Item
                                </button>
                            </>
                        )}

                        {/* PAYMENT SCHEDULE */}
                        {activeTab === "payment" && (
                            <>
                                <h2 className="text-lg font-semibold">Payment Schedule</h2>

                                {paymentSchedule.map((item: any, index: number) => (
                                    <div key={index} className="flex gap-4 items-center">
                                        <input
                                            type="number"
                                            value={item.percentage}
                                            onChange={(e) =>
                                                updateSchedule(
                                                    setPaymentSchedule,
                                                    paymentSchedule,
                                                    index,
                                                    "percentage",
                                                    Number(e.target.value)
                                                )
                                            }
                                            className="w-32 border rounded-xl px-3 py-2"
                                        />
                                        <span>%</span>

                                        <span>Due</span>

                                        <input
                                            type="number"
                                            value={item.days}
                                            onChange={(e) =>
                                                updateSchedule(
                                                    setPaymentSchedule,
                                                    paymentSchedule,
                                                    index,
                                                    "days",
                                                    Number(e.target.value)
                                                )
                                            }
                                            className="w-32 border rounded-xl px-3 py-2"
                                        />

                                        <span>{index === 0 ? "at the booking" : "days before departure"}</span>

                                        <button
                                            onClick={() =>
                                                removeScheduleRow(setPaymentSchedule, paymentSchedule, index)
                                            }
                                        >
                                            <Trash2 size={16} className="text-red-500 hover:text-red-600 cursor-pointer" />
                                        </button>
                                    </div>
                                ))}

                                <button
                                    onClick={() => addScheduleRow(setPaymentSchedule, paymentSchedule)}
                                    className="mt-5 flex items-center gap-2 bg-[#FFF9EE] text-black border border-black px-4 py-1 rounded text-sm cursor-pointer font-medium hover:bg-black hover:text-white"
                                >
                                    <Plus size={16} /> Add Payment Rule
                                </button>
                            </>
                        )}

                        {/* CANCELLATION */}
                        {activeTab === "cancellation" && (
                            <div className="space-y-5">
                                <h2 className="text-lg font-semibold">Cancellation Policy (% low to high)</h2>

                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            checked={cancellationType}
                                            onChange={() => setCancellationType(true)}
                                        />
                                        Refundable
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            checked={!cancellationType}
                                            onChange={() => setCancellationType(false)}
                                        />
                                        Non-refundable
                                    </label>
                                </div>

                                {cancellationType && (
                                    <>
                                        {cancellationRules.map((item: any, index: number) => (
                                            <div key={index} className="flex gap-4 items-center">
                                                <input
                                                    type="text"
                                                    value={item.percentage}
                                                    onChange={(e) =>
                                                        updateSchedule(
                                                            setCancellationRules,
                                                            cancellationRules,
                                                            index,
                                                            "percentage",
                                                            Number(e.target.value)
                                                        )
                                                    }
                                                    className="w-32 border rounded-xl px-3 py-2"
                                                />
                                                <span>% of the total price</span>

                                                <input
                                                    type="text"
                                                    value={item.days}
                                                    onChange={(e) =>
                                                        updateSchedule(
                                                            setCancellationRules,
                                                            cancellationRules,
                                                            index,
                                                            "days",
                                                            Number(e.target.value)
                                                        )
                                                    }
                                                    className="w-32 border rounded-xl px-3 py-2"
                                                />
                                                <span>days before departure</span>

                                                <button
                                                    onClick={() =>
                                                        removeScheduleRow(
                                                            setCancellationRules,
                                                            cancellationRules,
                                                            index
                                                        )
                                                    }
                                                >
                                                    <Trash2 size={16} className="text-red-500 hover:text-red-600 cursor-pointer" />
                                                </button>
                                            </div>
                                        ))}

                                        <button
                                            onClick={() =>
                                                addScheduleRow(setCancellationRules, cancellationRules)
                                            }
                                            className="mt-5 flex items-center gap-2 bg-[#FFF9EE] text-black border border-black px-4 py-1 rounded text-sm cursor-pointer font-medium hover:bg-black hover:text-white"
                                        >
                                            <Plus size={16} /> Add Cancellation Rule
                                        </button>
                                    </>
                                )}
                            </div>
                        )}

                        {/* FAQ */}
                        {activeTab === "faqs" && (
                            <>
                                <h2 className="text-lg font-semibold">FAQs</h2>
                                {faqs.map((faq: any) => (
                                    <div key={faq.id} className="border rounded p-4 space-y-3">
                                        <div className="flex items-center gap-4">
                                            <input
                                                placeholder="Question"
                                                value={faq.question}
                                                onChange={(e) => updateFaq(faq.id, "question", e.target.value)}
                                                className="w-full flex-1 px-4 py-2 border text-base rounded focus:ring-1 focus:ring-black outline-none"
                                            />
                                            <button onClick={() => removeFaq(faq.id)}>
                                                <Trash2 size={16} className="text-red-500 hover:text-red-600 cursor-pointer" />
                                            </button>
                                        </div>
                                        <textarea
                                            placeholder="Answer"
                                            value={faq.answer}
                                            onChange={(e) => updateFaq(faq.id, "answer", e.target.value)}
                                            className="w-full flex-1 px-4 py-2 border text-base rounded focus:ring-1 focus:ring-black outline-none"
                                            rows={4}
                                        />
                                    </div>
                                ))}

                                <button
                                    onClick={addFaq}
                                    className="mt-5 flex items-center gap-2 bg-[#FFF9EE] text-black border border-black px-4 py-1 rounded text-sm cursor-pointer font-medium hover:bg-black hover:text-white"
                                >
                                    <Plus size={16} /> Add FAQ
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}