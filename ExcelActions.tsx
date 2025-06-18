"use client";
import { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

export default function ExcelUploader() {
    const [uploading, setUploading] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
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
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="px-3 py-1.5 bg-white text-orange-600 rounded text-sm font-medium hover:bg-orange-50 transition-colors whitespace-nowrap"
            >
                Excel Actions
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="p-2">
                        <label className="flex flex-col gap-1">
                            <span className="text-xs text-gray-500 px-2">Upload Excel</span>
                            <div className="relative">
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    accept=".xlsx,.xls"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                />
                                <div className="px-3 py-2 text-sm text-gray-700 bg-gray-50 rounded border border-gray-300 hover:bg-gray-100 cursor-pointer">
                                    {uploading ? "Uploading..." : "Choose File"}
                                </div>
                            </div>
                        </label>
                    </div>
                    <div className="border-t border-gray-200"></div>
                    <div className="p-2">
                        <button
                            onClick={handleDownload}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-orange-50 rounded"
                            disabled={downloading}
                        >
                            {downloading ? "Downloading..." : "Download Excel"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}