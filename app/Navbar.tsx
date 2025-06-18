"use client";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import ExcelUploader from "@/ExcelActions";

export default function Navbar() {
    const [loading, setLoading] = useState(false);

    const handleBulkPrefill = async () => {
        setLoading(true);
        try {
            await axios.post("/api/prefill-autocomplete");
            alert("Autocomplete values prefetched successfully!");
        } catch {
            alert("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <nav style={{
            backgroundColor: "#ea580c",
            color: "white",
        }}>
            <div style={{
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "0.5rem 1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
            }}>
                <Link
                    href="/"
                    style={{
                        fontSize: "1.125rem",
                        fontWeight: 600,
                        textDecoration: "none",
                        color: "white",
                        whiteSpace: "nowrap",
                    }}
                >
                    Samparka Records
                </Link>

                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                }}>
                    <button
                        onClick={handleBulkPrefill}
                        disabled={loading}
                        style={{
                            backgroundColor: loading ? "#d1d5db" : "#ffffff",
                            color: loading ? "#6b7280" : "#ea580c",
                            border: "none",
                            borderRadius: "0.25rem",
                            padding: "0.375rem 0.75rem",
                            cursor: loading ? "not-allowed" : "pointer",
                            fontWeight: 500,
                            fontSize: "0.875rem",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {loading ? "Processing..." : "Bulk Prefill"}
                    </button>

                    <div style={{ fontSize: "0.875rem" }}>
                        <ExcelUploader />
                    </div>
                </div>
            </div>
        </nav>
    );
}