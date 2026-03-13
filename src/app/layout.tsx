import type { Metadata } from "next";
import config from "../config.json";
import "./globals.css";

export const metadata: Metadata = {
  title: config.title,
  description: "Generate a custom digital business card.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
