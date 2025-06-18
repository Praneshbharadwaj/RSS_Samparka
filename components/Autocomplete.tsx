"use client";
import { useState, useEffect } from "react";
import axios from "axios";

interface Props {
    label: string;
    name: string;
    value: string;
    onChange: (name: string, value: string) => void;
}

export default function Autocomplete({ label, name, value, onChange }: Props) {
    const [inputValue, setInputValue] = useState(value);
    const [options, setOptions] = useState<string[]>([]);
    const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
        axios.get(`/api/autocomplete?field=${name}`).then(res => {
            setOptions(res.data.options || []);
            setFilteredOptions(res.data.options || []);
        });
    }, [name]);

    useEffect(() => {
        if (inputValue === "") setFilteredOptions(options);
        else {
            setFilteredOptions(options.filter(opt =>
                opt.toLowerCase().includes(inputValue.toLowerCase())
            ));
        }
    }, [inputValue, options]);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleSelect = (val: string) => {
        setInputValue(val);
        setShowOptions(false);
        onChange(name, val);
    };

    const handleBlur = () => {
        setShowOptions(false);

        // Save new option to autocomplete_store
        if (inputValue && !options.includes(inputValue)) {
            axios.post("/api/autocomplete", { field: name, value: inputValue }).then(() => {
                setOptions(prev => [...prev, inputValue]);
            });
        }
    };


    return (
        <div style={{ position: "relative" }}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: "0.25rem" }}>
                {label}
            </label>
            <input
                name={name}
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    onChange(name, e.target.value);
                    setShowOptions(true);
                }}
                onFocus={() => {
                    setFilteredOptions(options); // 👈 show all on focus
                    setShowOptions(true);
                }}
                onBlur={handleBlur}
                style={{
                    width: "100%", padding: "0.5rem",
                    border: "1px solid #ccc", borderRadius: "4px"
                }}
            />
            {showOptions && filteredOptions.length > 0 && (
                <ul style={{
                    position: "absolute", background: "white",
                    border: "1px solid #ccc", borderRadius: "4px",
                    listStyle: "none", padding: "0.5rem",
                    marginTop: "0.25rem", width: "100%",
                    maxHeight: "150px", overflowY: "auto", zIndex: 10
                }}>
                    {filteredOptions.map((option, idx) => (
                        <li key={idx}
                            onMouseDown={() => handleSelect(option)}
                            style={{
                                padding: "0.25rem 0.5rem",
                                cursor: "pointer",
                                backgroundColor: option === value ? "#eee" : "white"
                            }}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
