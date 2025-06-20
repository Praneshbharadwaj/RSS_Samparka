"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import Autocomplete from "@/components/Autocomplete";
import toast from "react-hot-toast";

export default function EditUser() {
    const router = useRouter();
    const params = useParams();
    const slNo = Number(params?.slNo || 0);
    const [form, setForm] = useState<any>({ slNo });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slNo > 0) {
            axios.get(`/api/user?sl=${slNo}`).then(res => {
                setForm(res.data);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [slNo]);

    const fields = [
        { key: "Title", useAutocomplete: true },
        { key: "Name", useAutocomplete: false },
        { key: "Group", useAutocomplete: true },
        { key: "Organisation 1", useAutocomplete: true },
        { key: "Designation 1", useAutocomplete: true },
        { key: "Organisation 2", useAutocomplete: true },
        { key: "Designation 2", useAutocomplete: true },
        { key: "Phone 1", useAutocomplete: false },
        { key: "Phone 2", useAutocomplete: false },
        { key: "email ID", useAutocomplete: false },
        { key: "Category", useAutocomplete: true },
        { key: "Area", useAutocomplete: true },
        { key: "Nagara", useAutocomplete: true },
        { key: "St Coordinator", useAutocomplete: true },
        { key: "Re-assigned (Patti Hanchike)", useAutocomplete: true },
        { key: "Additional Info 1", useAutocomplete: false, isTextarea: true }
    ];

    for (let i = 1; i <= 5; i++) {
        fields.push(
            { key: `Visit ${i} Date`, useAutocomplete: false },
            { key: `Visit ${i} Discussed Points`, useAutocomplete: false, isTextarea: true }
        );
    }

    const handleChange = (name: string, value: string) =>
        setForm((prev: any) => ({ ...prev, [name]: value }));

    const handleSave = () => {
        const updatedForm = { ...form, slNo };
        axios.post("/api/save", updatedForm)
            .then(() => {
                toast.success(slNo > 0 ? "User updated successfully!" : "User created successfully!");
                router.push("/");
            })
            .catch(() => {
                toast.error("Failed to save user.");
            });
    };

    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "3rem" }}>
                <div className="spinner" />
                <p>Loading user data...</p>

                <style jsx>{`
                    .spinner {
                        margin: auto;
                        border: 4px solid #f3f3f3;
                        border-top: 4px solid #ea580c;
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        animation: spin 1s linear infinite;
                    }

                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#ea580c", marginBottom: "1rem" }}>
                {slNo > 0 ? `Edit User #${slNo}` : "Create User"}
            </h1>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1.5rem"
            }}>
                {fields.map(({ key, useAutocomplete, isTextarea }, idx) => (
                    <div key={idx}>
                        {useAutocomplete ? (
                            <Autocomplete
                                label={key}
                                name={key}
                                value={form[key] || ""}
                                onChange={handleChange}
                            />
                        ) : isTextarea ? (
                            <>
                                <label style={{ display: "block", fontWeight: 600, marginBottom: "0.25rem" }}>
                                    {key}
                                </label>
                                <textarea
                                    name={key}
                                    value={form[key] || ""}
                                    onChange={(e) => handleChange(key, e.target.value)}
                                    rows={4}
                                    style={{
                                        width: "100%", padding: "0.5rem",
                                        border: "1px solid #ccc", borderRadius: "4px"
                                    }}
                                />
                            </>
                        ) : (
                            <>
                                <label style={{ display: "block", fontWeight: 600, marginBottom: "0.25rem" }}>
                                    {key}
                                </label>
                                <input
                                    name={key}
                                    value={form[key] || ""}
                                    onChange={(e) => handleChange(key, e.target.value)}
                                    type={key.includes("Date") ? "date" : "text"}
                                    style={{
                                        width: "100%", padding: "0.5rem",
                                        border: "1px solid #ccc", borderRadius: "4px"
                                    }}
                                />
                            </>
                        )}
                    </div>
                ))}
            </div>

            <button
                onClick={handleSave}
                style={{
                    backgroundColor: "#ea580c", color: "white",
                    padding: "0.5rem 1rem", border: "none",
                    borderRadius: "4px", marginTop: "1rem", cursor: "pointer"
                }}
            >
                {slNo > 0 ? "Update" : "Create"}
            </button>
        </div>
    );
}
