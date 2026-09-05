import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/shell";

export const metadata: Metadata = {
  title: "School Management Portal",
  description: "Unified school management platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}