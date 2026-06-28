import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RentWise AI - Smart Rental Marketplace",
  description: "AI-driven protected rental marketplace with verification and trust scoring",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        {children}
      </body>
    </html>
  );
}
