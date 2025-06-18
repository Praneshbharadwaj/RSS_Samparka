"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Search() {
    const [query, setQuery] = useState("");
    const [matches, setMatches] = useState<any[]>([]);
    const [showDialog, setShowDialog] = useState(false);
    const router = useRouter();

    const fetchResults = async (searchTerm: string) => {
        try {
            const res = await axios.get(`/api/search?name=${searchTerm}`);
            const data = res.data;
            setMatches(data);

            if (searchTerm.trim() !== "" && data.length === 0) {
                setShowDialog(true); // open modal
            }
        } catch (err) {
            console.error("Search error:", err);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (query.trim()) fetchResults(query);
            else setMatches([]);
        }, 300);
        return () => clearTimeout(timeout);
    }, [query]);

    const handleSearchClick = () => {
        if (query.trim()) fetchResults(query);
    };

    return (
        <>
            <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#ea580c", marginBottom: "1rem" }}>
                Search Users
            </h1>

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                <input
                    type="text"
                    placeholder="Enter name…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{
                        border: "1px solid #ccc",
                        padding: "0.5rem",
                        width: "100%",
                    }}
                />
                <button
                    onClick={handleSearchClick}
                    style={{
                        backgroundColor: "#ea580c",
                        color: "white",
                        padding: "0.5rem 1rem",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Search
                </button>
            </div>

            {matches.length > 0 && (
                <table
                    style={{
                        width: "100%",
                        backgroundColor: "white",
                        borderCollapse: "collapse",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                        borderRadius: "4px",
                        overflow: "hidden",
                    }}
                >
                    <thead style={{ backgroundColor: "#fed7aa" }}>
                        <tr>
                            {["Sl No", "Name", "Organisation 1", "Phone 1"].map((h) => (
                                <th
                                    key={h}
                                    style={{
                                        padding: "0.75rem",
                                        border: "1px solid #ddd",
                                        textAlign: "left",
                                    }}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {matches.map((u) => (
                            <tr
                                key={u.slNo}
                                onClick={() => router.push(`/user/${u.slNo}`)}
                                style={{
                                    cursor: "pointer",
                                    transition: "background 0.2s",
                                }}
                                onMouseEnter={(e) =>
                                    ((e.currentTarget.style.backgroundColor = "#fff7ed"))
                                }
                                onMouseLeave={(e) =>
                                    ((e.currentTarget.style.backgroundColor = "white"))
                                }
                            >
                                <td style={{ border: "1px solid #ddd", padding: "0.75rem" }}>{u.slNo}</td>
                                <td style={{ border: "1px solid #ddd", padding: "0.75rem" }}>{u.Name}</td>
                                <td style={{ border: "1px solid #ddd", padding: "0.75rem" }}>{u["Organisation 1"]}</td>
                                <td style={{ border: "1px solid #ddd", padding: "0.75rem" }}>{u["Phone 1"]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* MODAL DIALOG */}
            {showDialog && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0,0,0,0.4)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 999,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            padding: "2rem",
                            borderRadius: "8px",
                            maxWidth: "400px",
                            textAlign: "center",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                        }}
                    >
                        <p style={{ marginBottom: "1rem", fontWeight: "bold" }}>
                            No users found. Create new user "{query}"?
                        </p>
                        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
                            <button
                                onClick={() => router.push("/user/create")}
                                style={{
                                    backgroundColor: "#ea580c",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    padding: "0.5rem 1rem",
                                    cursor: "pointer",
                                }}
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => setShowDialog(false)}
                                style={{
                                    backgroundColor: "#e5e5e5",
                                    border: "none",
                                    borderRadius: "4px",
                                    padding: "0.5rem 1rem",
                                    cursor: "pointer",
                                }}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
