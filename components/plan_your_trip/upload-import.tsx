"use client"

import { useEffect, useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import CountDownStep from "./common/CountDownStep";
import QuestionHeading from "./common/questionHeading";

// Define interface
interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function UploadImportModal({ open, onOpenChange }: Props) {
    // Define state
    const [uploadFile, setUploadFile] = useState<any>(null);
    const [customPrompt, setCustomPrompt] = useState<string>("");
    const [errors, setErrors] = useState<string>("");
    const [formLoader, setFormLoader] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [importToken, setImportToken] = useState("");

    // Handle close
    const handleClose = () => {
        setErrors("");
        setUploadFile(null);
        setCustomPrompt("");
        onOpenChange(false);
    }

    // Handle submit plan your trip
    const handlSubmitUpload = async () => {
        // Validate step
        if (!uploadFile) {
            setErrors("Please upload a valid file to import.");
            return;
        }

        try {
            // Update state
            setErrors("");
            setFormLoader(true);

            // Define value
            let uploadFilePath = "";

            // If upload path empty
            if (uploadFilePath === "") {
                // Define form data
                const formData = new FormData();
                formData.append("file", uploadFile);
                formData.append("folder", "chatgpt_import");

                // API call for upload file
                const imagekitResponse = await fetch("/api/imagekit/upload", {
                    method: "POST",
                    body: formData
                });

                // Convert to json
                const imagekitData = await imagekitResponse.json();

                // Check status
                if (imagekitData.url) {
                    uploadFilePath = imagekitData?.url;
                }
            }

            // Validation for path
            if (!uploadFilePath) {
                setErrors("Upload failed. Please try again.");
                return;
            }

            // Make API request
            const response = await fetch("/api/import/upload_file", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    agent_id: 1,
                    file_path: uploadFilePath,
                    custom_prompt: customPrompt
                })
            });

            // Get json parse
            const data = await response.json();

            // Check status
            if (data.status) {
                // Update state
                setIsSubmitted(true);
                setImportToken(data?.data?.token);
            } else {
                // Update state
                setErrors(data?.message || "Unable to process your request. Please try again.");
            }
        } catch (error) {
            // Set error
            setErrors("Unable to process your request. Please try again.");
        } finally {
            // Update state
            setFormLoader(false);
        }
    };

    // If not open
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
            <div className="relative w-full h-full bg-[#FFF6E5] overflow-auto">
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 z-10 p-2 rounded-full bg-[#FFC765] hover:bg-black hover:text-white cursor-pointer transition"
                >
                    <X className="h-5 w-5" />
                </button>
                <div className="min-h-full flex items-start justify-center px-4 py-16">
                    {!isSubmitted && <div className="w-full max-w-4xl space-y-5">
                        <div className="space-y-3 md:space-y-5">
                            <QuestionHeading
                                title="Upload your file to continue import"
                            />
                            <div className="space-y-7">
                                <div className="space-y-1">
                                    <label className="block text-sm md:text-base font-medium">Choose File</label>
                                    <input
                                        type="file"
                                        onChange={(e) => setUploadFile(e.target.files?.[0])}
                                        className="block w-full cursor-pointer border border-black/50 bg-white px-4 py-2 text-sm md:text-base rounded-sm"
                                    />
                                    <p className="text-sm text-gray-700">Supported formats: .pdf, .jpg, .jpeg, .png, .doc, .docx, .txt (less than 4 MB)</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm md:text-base font-medium">
                                        Write a special prompt or instruction for your trip? (Optional)
                                    </label>
                                    <textarea
                                        defaultValue={customPrompt || ""}
                                        onChange={(e) => setCustomPrompt(e.target.value)}
                                        placeholder="Write your custom prompt here..."
                                        className="bg-white w-full p-4 rounded-sm text-sm md:text-base min-h-[250px] ring-1 ring-black/50"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Error */}
                        {errors && (
                            <div className="text-center">
                                <p className="text-red-600 text-sm md:text-base">{errors}</p>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex flex-row items-stretch md:items-center justify-center gap-2 md:gap-3 w-full">
                            <button
                                disabled={formLoader}
                                onClick={handlSubmitUpload}
                                className="flex items-center justify-center gap-2 w-full md:w-auto px-4 md:px-8 py-2 rounded-sm font-medium border cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed bg-black text-white border-black hover:bg-white hover:text-black"
                            >
                                {formLoader ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Upload className="h-5 w-5" />
                                )}
                                Start Import
                            </button>
                        </div>
                    </div>}

                    {/* Countdown Step */}
                    {isSubmitted && <CountDownStep
                        isSubmitted={isSubmitted}
                        token={importToken}
                    />}
                </div>
            </div>
        </div>
    )
}
