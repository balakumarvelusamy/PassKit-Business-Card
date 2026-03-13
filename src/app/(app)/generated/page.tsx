"use client";

import React, { useEffect, useState } from "react";
import "../home.css";

interface Pass {
    key: string;
    lastModified: string;
    size: number;
    url: string;
}

export default function GeneratedPassPage() {
    const [passes, setPasses] = useState<Pass[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [count, setCount] = useState(0);
    const [maxPasses, setMaxPasses] = useState(10);
    const [deleting, setDeleting] = useState<string | null>(null);

    const fetchPasses = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/passes");
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to fetch passes");

            setPasses(data.passes || []);
            setCount(data.count || 0);
            setMaxPasses(data.max || 10);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPasses();
    }, []);

    const handleDelete = async (key: string) => {
        if (!confirm("Are you sure you want to delete this pass?")) return;

        setDeleting(key);
        try {
            const res = await fetch("/api/passes", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to delete pass");

            // Refresh list
            fetchPasses();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            alert(`Error deleting pass: ${msg}`);
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="home-container">


            <div className="pass-workspace" style={{ justifyContent: "center" }}>
                <div className="workspace-column form-panel" style={{ maxWidth: "800px", padding: "0.5rem", backgroundColor: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>

                    <h2 style={{ marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        Your Passes
                        <button onClick={fetchPasses} disabled={loading} title="Refresh Passes" style={{ padding: "0.5rem", borderRadius: "8px", background: "var(--primary)", color: "#000", border: "none", cursor: loading ? "not-allowed" : "pointer", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" style={loading ? { animation: "spin 1s linear infinite" } : undefined}>
                                <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                            </svg>
                        </button>
                    </h2>
                    <span className="text-center text-sm-600 font-italic mt-2">
                        You have generated {count} out of {maxPasses} allowed passes.
                    </span>
                    {count >= maxPasses && (
                        <div className="alert error" style={{ marginTop: "1rem" }}>
                            You have reached the maximum limit of passes. Please delete an older pass to create a new one.
                        </div>
                    )}
                    {error && <div className="alert error" style={{ marginBottom: "1rem" }}>{error}</div>}

                    {loading && passes.length === 0 ? (
                        <p style={{ color: "var(--foreground-muted)", textAlign: "center", padding: "2rem 0" }}>Loading your passes...</p>
                    ) : passes.length === 0 ? (
                        <p style={{ color: "var(--foreground-muted)", textAlign: "center", padding: "2rem 0" }}>You haven't generated any passes yet.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {passes.map((pass) => (
                                <div key={pass.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", background: "var(--background)", borderRadius: "12px", border: "1px solid var(--border)", flexWrap: "wrap", gap: "1rem" }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                                        <span style={{ fontWeight: 600, fontSize: "0.95rem", wordBreak: "break-all" }}>
                                            {pass.key.split('/').pop()}
                                        </span>
                                        <span style={{ color: "var(--foreground-muted)", fontSize: "0.80rem" }}>
                                            Saved: {new Date(pass.lastModified).toLocaleString()}
                                        </span>
                                    </div>
                                    <div style={{ display: "flex", gap: "0.75rem" }}>
                                        <a href={`/api/download?url=${encodeURIComponent(pass.url)}`} rel="noopener noreferrer" title="Download Pass" style={{ padding: "0.5rem", background: "var(--foreground)", color: "var(--background)", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>
                                        </a>
                                        <button
                                            onClick={() => handleDelete(pass.key)}
                                            disabled={deleting === pass.key}
                                            title="Delete Pass"
                                            style={{ padding: "0.5rem", background: "rgba(255, 59, 48, 0.1)", color: "#ff3b30", border: "1px solid rgba(255, 59, 48, 0.2)", borderRadius: "8px", fontWeight: 600, fontSize: "0.85rem", cursor: deleting === pass.key ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {deleting === pass.key ? (
                                                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" style={{ animation: "spin 1s linear infinite" }}><path d="M21 12a9 9 0 11-6.219-8.56"></path></svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/></svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
