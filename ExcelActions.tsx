"use client";
import { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { Upload, Download, ChevronDown } from "lucide-react";

export default function ExcelUploader() {
    const [uploading, setUploading] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (evt) => {
            const arrayBuffer = evt.target?.result as ArrayBuffer;
            const workbook = XLSX.read(arrayBuffer, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const parsedData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

            setUploading(true);
            try {
                await axios.post("/api/upload-excel", { data: parsedData });
                alert("Excel data uploaded successfully!");
            } catch (err) {
                console.error("Upload failed:", err);
                alert("Failed to upload Excel data.");
            } finally {
                setUploading(false);
                setShowDropdown(false);
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const handleDownload = async () => {
        try {
            setDownloading(true);
            const res = await fetch("/api/export-excel");
            if (!res.ok) throw new Error("Download failed");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "mongo_data.xlsx";
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (err) {
            console.error("Export error:", err);
            alert("Failed to download Excel data.");
        } finally {
            setDownloading(false);
            setShowDropdown(false);
        }
    };

    return (
        <div className="dropdown-container" ref={dropdownRef}>
            <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="dropdown-toggle"
            >
                Excel Actions
                <ChevronDown className="icon-chevron" />
            </button>

            {showDropdown && (
                <div className="dropdown-menu">
                    <label
                        className={`dropdown-item upload-label ${uploading ? "disabled" : ""}`}
                    >
                        <div className={`icon-wrapper ${uploading ? "loading" : ""}`}>
                            <Upload className="icon" />
                            {uploading && <div className="spinner" />}
                        </div>
                        {uploading ? "Uploading..." : "Upload Excel"}
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileUpload}
                            disabled={uploading}
                            className="hidden-input"
                        />
                    </label>

                    <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className={`dropdown-item download-button ${downloading ? "disabled" : ""}`}
                    >
                        <div className={`icon-wrapper ${downloading ? "loading" : ""}`}>
                            <Download className="icon" />
                            {downloading && <div className="spinner" />}
                        </div>
                        {downloading ? "Downloading..." : "Download Excel"}
                    </button>
                </div>
            )}

            <style>{`
                .dropdown-container {
                    position: relative;
                    display: inline-block;
                    text-align: left;
                    font-family: Arial, sans-serif;
                }

                .dropdown-toggle {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    background-color: white;
                    color: #ea580c; /* orange-600 */
                    border-radius: 6px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    border: none;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                    font-weight: 600;
                    font-size: 14px;
                }

                .dropdown-toggle:hover {
                    background-color: #fed7aa; /* orange-100 */
                }

                .icon-chevron {
                    width: 16px;
                    height: 16px;
                }

                .dropdown-menu {
                    position: absolute;
                    left: 0;
                    margin-top: 8px;
                    width: 208px;
                    background-color: white;
                    border: 1px solid #e5e7eb; /* gray-200 */
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    z-index: 10;
                    overflow: hidden;
                    font-size: 14px;
                }

                .dropdown-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 16px;
                    width: 100%;
                    background-color: #fef3c7; /* default background */
                    color: #92400e; /* default text (orange-700) */
                    cursor: pointer;
                    border: none;
                    font-weight: 500;
                    text-align: left;
                    transition: background-color 0.2s ease;
                    user-select: none;
                    position: relative;
                }

                .upload-label {
                    border-bottom: 1px solid #fde68a; /* light orange border */
                    border-radius: 8px 8px 0 0;
                }

                .download-button {
                    border-radius: 0 0 8px 8px;
                    background-color: #d1fae5; /* green-100 */
                    color: #065f46; /* green-700 */
                }

                .upload-label:hover:not(.disabled) {
                    background-color: #fcd34d; /* orange-300 */
                }

                .download-button:hover:not(.disabled) {
                    background-color: #6ee7b7; /* green-300 */
                }

                .disabled {
                    background-color: #fcd9b3 !important; /* orange-200 for upload */
                    color: #78350f !important; /* orange-900 */
                    cursor: not-allowed;
                }

                .download-button.disabled {
                    background-color: #a7f3d0 !important; /* green-200 */
                    color: #134e4a !important; /* green-900 */
                }

                .icon {
                    width: 16px;
                    height: 16px;
                    flex-shrink: 0;
                    transition: opacity 0.3s ease;
                }

                .icon-wrapper.loading .icon {
                    opacity: 0.3;
                }

                .spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid #999;
                    border-top: 2px solid transparent;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-left: -20px; /* overlap icon area */
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .hidden-input {
                    display: none;
                }
            `}</style>
        </div>
    );
}
