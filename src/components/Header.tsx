"use client";

import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
            router.refresh();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <header className="app-header">
            <div className="header-content">
                <h1 className="header-title">Pass Kit Generator</h1>
                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </div>
        </header>
    );
}
