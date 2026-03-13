"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import config from "../config.json";

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
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img src="/passkitapp.jpg" width="40" height="40" alt="PassKit Logo" style={{ borderRadius: "8px" }} />
                    <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
                        <h1 className="header-title" style={{ margin: 0, cursor: "pointer" }}>{config.title}</h1>
                    </Link>
                </div>

                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </div>
        </header>
    );
}
