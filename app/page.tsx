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
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            color: "#ea580c",
            marginBottom: "0.5rem",
          }}
        >
          All Users
        </h1>
        <Link href="/user/create">
          <button
            style={{
              backgroundColor: "#ea580c",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            Create New
          </button>
        </Link>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            backgroundColor: "#ffffff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            borderCollapse: "collapse",
            minWidth: "500px",
          }}
        >
          <thead style={{ backgroundColor: "#fed7aa" }}>
            <tr>
              {["Sl No", "Name", "Organisation 1", "Phone 1"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "0.75rem",
                    border: "1px solid #ccc",
                    textAlign: "left",
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
                <td style={{ padding: "0.75rem", border: "1px solid #ccc" }}>
                  {u.slNo}
                </td>
                <td style={{ padding: "0.75rem", border: "1px solid #ccc" }}>
                  {u.Name}
                </td>
                <td style={{ padding: "0.75rem", border: "1px solid #ccc" }}>
                  {u["Organisation 1"]}
                </td>
                <td style={{ padding: "0.75rem", border: "1px solid #ccc" }}>
                  {u["Phone 1"]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
