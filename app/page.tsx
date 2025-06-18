"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    void axios.get("/api/all").then((r) => setUsers(r.data));
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#ea580c",
            marginBottom: "0.5rem",
          }}
        >
          All Users
        </h1>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/user/create">
            <button
              style={{
                backgroundColor: "#ea580c",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              + Create New
            </button>
          </Link>
          <Link href="/search">
            <button
              style={{
                backgroundColor: "#ea580c",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              🔍 Search
            </button>
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            minWidth: "600px",
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
                    fontWeight: "bold",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.slNo || u._id}
                style={{
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onClick={() => (window.location.href = `/user/${u.slNo}`)}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#fff7ed")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "white")
                }
              >
                <td style={{ padding: "0.75rem", border: "1px solid #eee" }}>
                  {u.slNo}
                </td>
                <td style={{ padding: "0.75rem", border: "1px solid #eee" }}>
                  {u.Name}
                </td>
                <td style={{ padding: "0.75rem", border: "1px solid #eee" }}>
                  {u["Organisation 1"]}
                </td>
                <td style={{ padding: "0.75rem", border: "1px solid #eee" }}>
                  {u["Phone 1"]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
