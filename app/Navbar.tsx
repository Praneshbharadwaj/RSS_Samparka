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
        <>
            <nav className="navbar">
                <div className="navbar-inner">
                    <Link href="/" className="navbar-logo">
                        Samparka Records
                    </Link>

                    <div className="navbar-actions">
                        <button
                            onClick={handleBulkPrefill}
                            disabled={loading}
                            className={`btn ${loading ? "btn-disabled" : "btn-primary"}`}
                        >
                            {loading ? "Processing..." : "Bulk Prefill"}
                        </button>

                        <div className="excel-uploader-wrapper">
                            <ExcelUploader />
                        </div>
                    </div>
                </div>
            </nav>

            <style>{`
                .navbar {
                    background-color: #ea580c;
                    color: white;
                    padding: 0.5rem 1rem;
                    font-family: Arial, sans-serif;
                }

                .navbar-inner {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                    flex-wrap: wrap;
                }

                .navbar-logo {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: white;
                    text-decoration: none;
                    white-space: nowrap;
                    flex-shrink: 0;
                }

                .navbar-actions {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    flex-wrap: wrap;
                    width: auto;
                }

                .btn {
                    border: none;
                    border-radius: 0.25rem;
                    padding: 0.375rem 0.75rem;
                    font-weight: 500;
                    font-size: 0.875rem;
                    cursor: pointer;
                    white-space: nowrap;
                    min-width: 110px;
                    text-align: center;
                }

                .btn-primary {
                    background-color: white;
                    color: #ea580c;
                }

                .btn-primary:hover:not(:disabled) {
                    background-color: #fcd34d; /* lighter orange on hover */
                }

                .btn-disabled {
                    background-color: #d1d5db;
                    color: #6b7280;
                    cursor: not-allowed;
                }

                .excel-uploader-wrapper {
                    min-width: 150px;
                }

                /* Responsive: On small screens stack elements */
                @media (max-width: 600px) {
                    .navbar-inner {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .navbar-actions {
                        width: 100%;
                        justify-content: space-between;
                        gap: 0.5rem;
                    }
                    .btn {
                        flex-grow: 1;
                        min-width: unset;
                    }
                    .excel-uploader-wrapper {
                        flex-grow: 1;
                        min-width: unset;
                    }
                }
            `}</style>
        </>
    );
}
