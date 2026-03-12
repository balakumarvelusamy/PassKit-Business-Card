"use client";

import { PassData } from "../app/(app)/page";

export default function PassPreview({ data, qrCodeUrl }: { data: PassData, qrCodeUrl?: string | null }) {
    // A Pass looks like a solid colored card with a rounded top, 
    // an icon in the top left, header in top right, 
    // a prominent strip image in the middle, and barcode at bottom.

    return (
        <div className="preview-container">
            <div
                className="pass-card border border-gray-200"
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

                <div className="pass-secondary-fields" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', padding: '0 1rem' }}>
                    {(data.field1name || data.field1value) && (
                        <div className="field-group" style={{ textAlign: 'left', flex: 1, overflow: 'hidden', paddingRight: '0.5rem' }}>
                            <span className="f-label" style={{ whiteSpace: 'pre-wrap' }}>{data.field1name?.toUpperCase() || 'FIELD 1'}</span>
                            <span className="f-value sm" style={{ fontSize: '0.7rem', wordBreak: 'break-word', display: 'block', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>{data.field1value}</span>
                        </div>
                    )}

                    {(data.field2name || data.field2value) && (
                        <div className="field-group" style={{ textAlign: 'right', flex: 1, overflow: 'hidden', paddingLeft: '0.5rem' }}>
                            <span className="f-label" style={{ whiteSpace: 'pre-wrap' }}>{data.field2name?.toUpperCase() || 'FIELD 2'}</span>
                            <span className="f-value sm" style={{ fontSize: '0.7rem', wordBreak: 'break-word', display: 'block', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>{data.field2value}</span>
                        </div>
                    )}
                </div>

                <div className="pass-barcode-area">
                    <div className="pass-qr-placeholder">
                        {qrCodeUrl ? (
                            <img src={qrCodeUrl} alt="QR Code" style={{ width: 120, height: 120, padding: 4, backgroundColor: 'white', borderRadius: 4 }} />
                        ) : (
                            <div className="qr-fake"></div>
                        )}
                        <span className="qr-text">Scan & Save</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
