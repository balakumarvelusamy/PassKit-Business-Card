"use client";

import { PassData } from "../app/(app)/page";

export default function PassForm({ data, onChange }: { data: PassData; onChange: (data: PassData) => void }) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

                    <div className="input-group">
                        <label>Organisation Name <span style={{ color: "var(--theme-color, #ff3b30)" }}>*</span></label>
                        <input type="text" name="title" value={data.title} onChange={handleChange} placeholder="e.g. Acme Corp" required />
                    </div>
                </div>
                <div className="input-group">
                    <label>Header Field</label>
                    <input type="text" name="name" value={data.name} onChange={handleChange} placeholder="e.g. John Doe" />
                </div>
                <div className="input-group">
                    <label>Header Value</label>
                    <input type="text" name="profession" value={data.profession} onChange={handleChange} placeholder="e.g. Developer" />
                </div>
                <div className="input-row">
                    <div className="input-group">
                        <label>Theme Color</label>
                        <input type="color" name="themeColor" value={data.themeColor} onChange={handleChange} className="color-picker" />
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
                    <div className="input-group">
                        <label>Field 1 Name</label>
                        <input type="text" name="field1name" value={data.field1name} onChange={handleChange} placeholder="Email" />
                    </div>
                    <div className="input-group">
                        <label>Field 1 Value</label>
                        <input type="text" name="field1value" value={data.field1value} onChange={handleChange} placeholder="info@example.com" />
                    </div>
                </div>
                <div className="input-row">
                    <div className="input-group">
                        <label>Field 2 Name</label>
                        <input type="text" name="field2name" value={data.field2name} onChange={handleChange} placeholder="Website" />
                    </div>
                    <div className="input-group">
                        <label>Field 2 Value</label>
                        <input type="text" name="field2value" value={data.field2value} onChange={handleChange} placeholder="www.example.com" />
                    </div>
                </div>
            </div>
        </div>
    );
}
