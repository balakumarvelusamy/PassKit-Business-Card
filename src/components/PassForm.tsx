"use client";

import { PassData } from "../app/(app)/page";
import { X } from "lucide-react";

type ChangeEventLike = React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } };

function ClearableInput({ 
    label, 
    name, 
    value, 
    onChange, 
    placeholder, 
    required 
}: { 
    label: React.ReactNode;
    name: string; 
    value: string; 
    onChange: (e: ChangeEventLike) => void;
    placeholder?: string;
    required?: boolean;
}) {
    return (
        <div className="input-group">
            <label>{label}</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input 
                    type="text" 
                    name={name} 
                    value={value} 
                    onChange={onChange as any} 
                    placeholder={placeholder} 
                    required={required} 
                    style={{ width: "100%", paddingRight: "2.5rem" }} 
                />
                {value && (
                    <button
                        type="button"
                        onClick={() => onChange({ target: { name, value: "" } })}
                        style={{
                            position: "absolute",
                            right: "8px",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--foreground-muted, #888)",
                        }}
                        aria-label={`Clear ${name}`}
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}

export default function PassForm({ data, onChange }: { data: PassData; onChange: (data: PassData) => void }) {
    const handleChange = (e: ChangeEventLike) => {
        const { name, value } = e.target;
        onChange({ ...data, [name]: value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                onChange({ ...data, [name]: event.target?.result as string });
            };
            reader.readAsDataURL(files[0]);
        }
    };

    return (
        <div className="form-card">
            <div className="form-section">
                <h3>Header Information</h3>
                <div className="input-row">
                    <div className="input-group">
                        <label>Icon Image</label>
                        <input type="file" name="icon" accept="image/*" onChange={handleImageChange} />
                    </div>
                </div>
                <div className="input-row">
                    <ClearableInput 
                        label={<>Organisation Name <span style={{ color: "var(--theme-color, #ff3b30)" }}>*</span></>} 
                        name="title" 
                        value={data.title} 
                        onChange={handleChange} 
                        placeholder="e.g. Acme Corp" 
                        required 
                    />
                </div>
                
                <ClearableInput 
                    label="Header Field" 
                    name="name" 
                    value={data.name} 
                    onChange={handleChange} 
                    placeholder="e.g. John Doe" 
                />
                
                <ClearableInput 
                    label="Header Value" 
                    name="profession" 
                    value={data.profession} 
                    onChange={handleChange} 
                    placeholder="e.g. Developer" 
                />
                
                <div className="input-row">
                    <div className="input-group">
                        <label>Theme Color</label>
                        <input type="color" name="themeColor" value={data.themeColor} onChange={handleChange as any} className="color-picker" />
                    </div>
                    <div className="input-group">
                        <label>Strip Image</label>
                        <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h3>Main Fields</h3>
                <div className="input-row">
                    <ClearableInput label="Field 1 Name" name="field1name" value={data.field1name} onChange={handleChange} placeholder="Email" />
                    <ClearableInput label="Field 1 Value" name="field1value" value={data.field1value} onChange={handleChange} placeholder="info@example.com" />
                </div>
                <div className="input-row">
                    <ClearableInput label="Field 2 Name" name="field2name" value={data.field2name} onChange={handleChange} placeholder="Website" />
                    <ClearableInput label="Field 2 Value" name="field2value" value={data.field2value} onChange={handleChange} placeholder="www.example.com" />
                </div>
            </div>
        </div>
    );
}
