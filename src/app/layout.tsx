import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pass Kit Generator",
  description: "Generate a custom digital business card.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
