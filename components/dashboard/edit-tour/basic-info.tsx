'use client'

import { set } from "date-fns";
import { CheckCircle, Loader2, Plus, PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

// Define destinations
const destinations = [
    { id: 42, name: "Asia", image: "https://ik.imagekit.io/288weifiq/uploads/temp/img_temp_6352999f8e9031-28975195-99666318.png" },
    // { id: 46, name: "Africa", image: "https://ik.imagekit.io/288weifiq/destination/img_destination_64c2862026f257-08081692-45008691.png" },
    { id: 35, name: "Europe", image: "https://ik.imagekit.io/288weifiq/destination/img_destination_64c28d8db3bd21-15021459-74046607.png" },
    { id: 40, name: "Latin America", image: "https://ik.imagekit.io/288weifiq/destination/img_destination_64c8030545ec73-04420323-16145431.png" },
    // { id: 44, name: "Middle East", image: "https://ik.imagekit.io/288weifiq/destination/img_destination_64c8037c87f057-00271065-75188789.png" },
    { id: 38, name: "US & Canada", image: "https://ik.imagekit.io/288weifiq/destination/img_destination_64c802d5083bf6-73864480-33247609.png" },
];

// Define country types
interface Country {
    id: number;
    name: string;
}

// Define city types
interface City {
    id: number;
    name: string;
}

// Define row types
interface Row {
    id: number;
    country_id: number | null;
    city_id: number | null;
    nights: number;
    available_cities: City[];
}

// Define props
interface Props {
    tourId: string;
    destination: number | null;
    tourTitle: string;
    cityNights: any;
    setRecommandItinerary: any;
}

export default function BasicInfo({ tourId, tourTitle, destination, cityNights, setRecommandItinerary }: Props) {
    // Define state
    const [title, setTitle] = useState(tourTitle || "");
    const [destinationId, setDestinationId] = useState<number | null>(destination || null);
    const [countries, setCountries] = useState<Country[]>([]);
    const [rows, setRows] = useState<Row[]>(cityNights || []);
    const [loadingCountries, setLoadingCountries] = useState(false);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [message, setMessage] = useState<any>(null);

    // Set Destination
    useEffect(() => {
        if (destination) {
            setDestinationId(destination);
        }
    }, [destination]);

    // Set city nights
    useEffect(() => {
        if (cityNights) {
            setRows(cityNights);
        }
    }, [cityNights]);

    // Fetch Countries When Destination Changes
    useEffect(() => {
        if (!destinationId) return;
        const fetchCountries = async () => {
            // Update state
            setLoadingCountries(true);

            // API Call
            const response = await fetch(`/api/tours/location/countries`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    destination_id: destinationId
                })
            });

            // Convert to json
            const data = await response.json();

            // Check response
            if (data.status) {
                // Update state
                setCountries(data?.data || []);
                setRows(cityNights || []);
            }

            // Update state
            setLoadingCountries(false);
        };
        fetchCountries();
    }, [destinationId]);

    // Fetch Cities When Country Changes
    const fetchCities = async (country_id: number, rowId: number) => {
        // API Call
        const response = await fetch(`/api/tours/location/cities`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                country_id: country_id
            })
        });

        // Convert to json
        const data = await response.json();

        // Check response
        if (data.status) {
            setRows(rows => rows.map(r => r.id === rowId ? { ...r, available_cities: data?.data || [], city_id: null } : r));
        }
    };

    // Add Row
    const addRow = () => {
        // Get last country
        const lastCountry = rows.length > 0 ? rows[rows.length - 1].country_id : null;

        // Create new row
        const newRow: Row = {
            id: Date.now(),
            country_id: lastCountry,
            city_id: null,
            nights: 0,
            available_cities: []
        };

        // Update state
        setRows([...rows, newRow]);

        // Auto fetch cities if country exists
        if (lastCountry) {
            fetchCities(lastCountry, newRow.id);
        }
    };

    // Update Row Field
    const updateRow = (rowId: number, field: keyof Row, value: any) => {
        setRows(rows =>
            rows.map(r =>
                r.id === rowId ? { ...r, [field]: value } : r
            )
        );

        if (field === "country_id") {
            fetchCities(value, rowId);
        }
    };

    // Remove Row
    const removeRow = (rowId: number) => {
        setRows(rows.filter(r => r.id !== rowId));
    };

    // Calculate Total Nights
    const totalNights = rows.reduce((sum, r) => sum + r.nights, 0);

    // Handle Update
    const handleUpdate = async () => {
        // Validate
        if (!title) {
            setMessage({ type: "error", text: "Please enter a title." });
            return;
        } else if (!destinationId) {
            setMessage({ type: "error", text: "Please select a destination." });
            return;
        } else if (rows.length === 0) {
            setMessage({ type: "error", text: "Please add at least one row." });
            return;
        }

        try {
            // Update state
            setMessage(null);
            setIsFormLoading(true);

            // Filter data
            const updatedRows = rows.map(r => ({
                country_id: r.country_id,
                city_id: r.city_id,
                nights: r.nights
            }));

            // Make API call
            const response = await fetch("/api/tours/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tour_id: tourId,
                    action: "basic_info",
                    data: {
                        tour_title: title,
                        destination_id: destinationId,
                        cities_night: updatedRows,
                        total_nights: totalNights
                    }
                })
            });

            // Convert to json
            const data = await response.json();

            // Check response
            if (data.status) {
                setRecommandItinerary(totalNights + 1);
                setMessage({
                    type: "success",
                    text: "Updated successfully!"
                });
            } else {
                setMessage({
                    type: "error",
                    text: data.message
                });
            }

            // Auto close error
            setTimeout(() => { setMessage(null); }, 5000)
        } catch (error) {
            // Handle error
            setMessage({
                type: "error",
                text: "Something went wrong. Please try again."
            })
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
                        Tour Basic Information
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

                {/* TITLE */}
                <div className="flex flex-col bg-white p-6 rounded shadow-sm space-y-2">
                    <label className="text-md font-semibold text-black">Tour Title</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        placeholder="Enter tour title"
                        className="w-full px-4 py-2 text-base border rounded focus:ring-1 focus:ring-black focus:outline-none"
                    />
                </div>

                {/* DESTINATION CARDS */}
                <div className="flex flex-col bg-white p-6 rounded shadow-sm space-y-3">
                    <label className="text-md font-semibold text-black">Choose Destination</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {destinations.map(dest => (
                            <div
                                key={dest.id}
                                onClick={() => setDestinationId(dest.id)}
                                className={`cursor-pointer rounded overflow-hidden border transition-all duration-200 ${destinationId === dest.id ? "border-black bg-[#FFF9EE] shadow-md" : "border-gray-200 hover:border-black"}`}
                            >
                                <div className="p-3 text-center text-base font-medium">
                                    {dest.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ROWS SECTION */}
                {destinationId && (
                    <div className="flex flex-col bg-white p-6 rounded shadow-sm space-y-6">
                        <div className="flex justify-between">
                            <label className="text-md font-semibold text-black">
                                City & Night Distribution ({totalNights} Night{`${totalNights > 1 ? "s" : ""}`} - {totalNights + 1} Day{`${totalNights + 1 > 1 ? "s" : ""}`} - {rows.length} {`${rows.length > 1 ? "Citie" : "City"}`})
                            </label>
                            <div className="flex items-center gap-4">
                                {!loadingCountries && <button
                                    onClick={addRow}
                                    className="flex items-center gap-2 bg-[#FFF9EE] text-black border border-black px-4 py-1 rounded text-sm cursor-pointer font-medium hover:bg-black hover:text-white"
                                >
                                    <Plus size={16} /> Add City
                                </button>}
                            </div>
                        </div>

                        {/* No rows */}
                        {loadingCountries && (
                            <div className="flex flex-col items-center justify-center gap-4">
                                <Loader2 className="w-7 h-7 animate-spin" />
                                <p className="text-sm text-black/80">
                                    Loading countries...
                                </p>
                            </div>
                        )}

                        {/* No rows */}
                        {!loadingCountries && rows.length === 0 && (
                            <div className="flex flex-col items-center justify-center gap-4">
                                <PlusCircle className="w-7 h-7" />
                                <p className="text-sm text-black/80">
                                    No cities added. Click "+ Add City" to add one.
                                </p>
                            </div>
                        )}

                        {/* ROWS */}
                        {!loadingCountries && rows.map(row => (
                            <div key={row.id} className="grid grid-cols-[30%_30%_30%_10%] gap-4 items-center">
                                <div>
                                    <select
                                        value={row.country_id || ""}
                                        onChange={(e) =>
                                            updateRow(row.id, "country_id", Number(e.target.value))
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 text-base rounded"
                                    >
                                        <option value="">Select Country</option>
                                        {countries.map(c => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <select
                                        value={row.city_id || ""}
                                        onChange={(e) =>
                                            updateRow(row.id, "city_id", Number(e.target.value))
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 text-base rounded"
                                    >
                                        <option value="">Select City</option>
                                        {row.available_cities?.map(city => (
                                            <option key={city.id} value={city.id}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <select
                                        value={row.nights}
                                        onChange={(e) =>
                                            updateRow(row.id, "nights", Number(e.target.value))
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 text-base rounded"
                                    >
                                        {Array.from({ length: 15 }, (_, i) => (
                                            <option key={i} value={i}>
                                                {i} {`${i <= 1 ? "night" : "nights"}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <button onClick={() => removeRow(row.id)}>
                                        <Trash2 size={16} className="text-red-500 hover:text-red-600 cursor-pointer" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}