"use client";

import { PassData } from "../app/(app)/page";

export default function PassPreview({ data }: { data: PassData }) {
    // A Pass looks like a solid colored card with a rounded top, 
    // an icon in the top left, header in top right, 
    // a prominent strip image in the middle, and barcode at bottom.

    return (
        <div className="preview-container">
            <div
                className="pass-card"
                style={{ backgroundColor: data.themeColor || "#677b5a" }}
            >
                <div className="pass-header">
                    <div className="pass-logo-area">
                        {data.icon ? (
                            <img src={data.icon} alt="Icon" className="pass-logo" />
                        ) : (
                            <div className="pass-logo-placeholder"></div>
                        )}
                        <span className="pass-title">{data.title}</span>
                    </div>
                    <div className="pass-header-fields">
                        <span className="hf-label">{data.name.toUpperCase()}</span>
                        <span className="hf-value">{data.profession}</span>
                    </div>
                </div>

                <div className="pass-strip">
                    {data.image ? (
                        <img src={data.image} alt="Strip Image" className="pass-strip-img" />
                    ) : (
                        <div className="pass-strip-placeholder">
                            <span className="strip-text">Main Image Here</span>
                        </div>
                    )}
                </div>

                <div className="pass-primary-fields">
                    <div className="field-group">
                        <span className="f-label">{data.field1name}</span>
                        <span className="f-value">{data.field1value}</span>
                    </div>
                    <div className="field-group align-right">
                        <span className="f-label">{data.field2name}</span>
                        <span className="f-value">{data.field2value}</span>
                    </div>
                </div>

                <div className="pass-secondary-fields">
                    {data.email && (
                        <div className="field-group">
                            <span className="f-label">EMAIL</span>
                            <span className="f-value sm">{data.email}</span>
                        </div>
                    )}
                    {data.website && (
                        <div className="field-group">
                            <span className="f-label">WEBSITE</span>
                            <span className="f-value sm">{data.website}</span>
                        </div>
                    )}
                </div>

                <div className="pass-barcode-area">
                    <div className="pass-qr-placeholder">
                        <div className="qr-fake"></div>
                        <span className="qr-text">Scan & Save</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
