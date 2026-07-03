import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inbraak op Supersysteem",
  description: "Voer de override-code in en stop de supercomputer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}