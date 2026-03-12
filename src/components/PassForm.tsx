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
                <h3>Basic Information</h3>
                <div className="input-group">
                    <label>Name</label>
                    <input type="text" name="name" value={data.name} onChange={handleChange} placeholder="e.g. John Doe" />
                </div>
                <div className="input-group">
                    <label>Profession</label>
                    <input type="text" name="profession" value={data.profession} onChange={handleChange} placeholder="e.g. Developer" />
                </div>
                <div className="input-row">
                    <div className="input-group">
                        <label>Theme Color</label>
                        <input type="color" name="themeColor" value={data.themeColor} onChange={handleChange} className="color-picker" />
                    </div>
                    <div className="input-group">
                        <label>Icon Image</label>
                        <input type="file" name="icon" accept="image/*" onChange={handleImageChange} />
                    </div>
                </div>
                <div className="input-group">
                    <label>Main Background / Strip Image</label>
                    <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
                </div>
            </div>

            <div className="form-section">
                <h3>Main Fields</h3>
                <div className="input-row">
                    <div className="input-group">
                        <label>Field 1 Name</label>
                        <input type="text" name="field1name" value={data.field1name} onChange={handleChange} placeholder="CONTACT" />
                    </div>
                    <div className="input-group">
                        <label>Field 1 Value</label>
                        <input type="text" name="field1value" value={data.field1value} onChange={handleChange} placeholder="+123456789" />
                    </div>
                </div>
                <div className="input-row">
                    <div className="input-group">
                        <label>Field 2 Name</label>
                        <input type="text" name="field2name" value={data.field2name} onChange={handleChange} placeholder="NAME" />
                    </div>
                    <div className="input-group">
                        <label>Field 2 Value</label>
                        <input type="text" name="field2value" value={data.field2value} onChange={handleChange} placeholder="John Doe" />
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h3>Additional Contacts</h3>
                <div className="input-row">
                    <div className="input-group">
                        <label>Email</label>
                        <input type="text" name="email" value={data.email} onChange={handleChange} placeholder="email@example.com" />
                    </div>
                    <div className="input-group">
                        <label>Website</label>
                        <input type="text" name="website" value={data.website} onChange={handleChange} placeholder="example.com" />
                    </div>
                </div>
                <div className="input-row">
                    <div className="input-group">
                        <label>Instagram</label>
                        <input type="text" name="instagram" value={data.instagram} onChange={handleChange} placeholder="@username" />
                    </div>
                    <div className="input-group">
                        <label>Pinterest</label>
                        <input type="text" name="pinterest" value={data.pinterest} onChange={handleChange} placeholder="username" />
                    </div>
                </div>
            </div>
        </div>
    );
}
