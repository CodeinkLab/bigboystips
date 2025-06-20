import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/shared/Navbar";
import "./globals.css";
import Footer from "./components/shared/Footer";
import { DialogProvider } from "./components/shared/dialog";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BigBoysTips - Expert Sports Predictions",
  description: "Get expert sports predictions and analysis to improve your betting success rate.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        
        <DialogProvider>
          <AuthProvider>
            <Navbar />
            <main>
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </DialogProvider>
      </body>
    </html>
  );
}
