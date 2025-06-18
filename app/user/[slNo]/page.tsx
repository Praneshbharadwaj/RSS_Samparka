"use client";
// ... (imports stay the same)
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import Autocomplete from "@/components/Autocomplete";

export default function EditUser() {
    const router = useRouter();
    const params = useParams();
    const slNo = Number(params?.slNo || 0);
    const [form, setForm] = useState<any>({ slNo });
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [secretKey, setSecretKey] = useState("");

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
        axios.post("/api/save", updatedForm).then(() => router.push("/"));
    };

    const handleDelete = async () => {
        try {
            const res = await axios.post("/api/delete", { slNo, secretKey });
            alert("User deleted successfully.");
            router.push("/");
        } catch (err: any) {
            alert(err?.response?.data?.error || "Delete failed.");
        }
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

            <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                <button
                    onClick={handleSave}
                    style={{
                        backgroundColor: "#ea580c", color: "white",
                        padding: "0.5rem 1rem", border: "none",
                        borderRadius: "4px", cursor: "pointer"
                    }}
                >
                    {slNo > 0 ? "Update" : "Create"}
                </button>

                {slNo > 0 && (
                    <button
                        onClick={() => setShowDialog(true)}
                        style={{
                            backgroundColor: "#dc2626", color: "white",
                            padding: "0.5rem 1rem", border: "none",
                            borderRadius: "4px", cursor: "pointer"
                        }}
                    >
                        Delete
                    </button>
                )}
            </div>

            {showDialog && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.3)", display: "flex", justifyContent: "center", alignItems: "center"
                }}>
                    <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "8px", maxWidth: "400px", width: "100%" }}>
                        <h2 style={{ marginBottom: "1rem" }}>Enter Secret Key to Delete</h2>
                        <input
                            type="password"
                            placeholder="6-digit secret key"
                            value={secretKey}
                            onChange={(e) => setSecretKey(e.target.value)}
                            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", marginBottom: "1rem" }}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <button onClick={() => setShowDialog(false)} style={{ padding: "0.5rem 1rem" }}>Cancel</button>
                            <button
                                onClick={handleDelete}
                                style={{
                                    backgroundColor: "#dc2626", color: "white",
                                    padding: "0.5rem 1rem", border: "none", borderRadius: "4px"
                                }}
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
