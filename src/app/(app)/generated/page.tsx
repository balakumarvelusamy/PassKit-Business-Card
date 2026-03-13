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
                <div className="workspace-column form-panel" style={{ maxWidth: "800px", padding: "2rem", backgroundColor: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>

                    <h2 style={{ marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        Your Passes
                        <button onClick={fetchPasses} disabled={loading} style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", borderRadius: "8px", background: "var(--primary)", color: "#000", border: "none", cursor: "pointer", fontWeight: 600 }}>
                            {loading ? "Refreshing..." : "Refresh"}
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
                                        <a href={pass.url} target="_blank" rel="noopener noreferrer" style={{ padding: "0.5rem 1rem", background: "var(--foreground)", color: "var(--background)", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "0.85rem", display: "flex", alignItems: "center" }}>
                                            Download
                                        </a>
                                        <button
                                            onClick={() => handleDelete(pass.key)}
                                            disabled={deleting === pass.key}
                                            style={{ padding: "0.5rem 1rem", background: "rgba(255, 59, 48, 0.1)", color: "#ff3b30", border: "1px solid rgba(255, 59, 48, 0.2)", borderRadius: "8px", fontWeight: 600, fontSize: "0.85rem", cursor: deleting === pass.key ? "not-allowed" : "pointer" }}>
                                            {deleting === pass.key ? "Deleting..." : "Delete"}
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
