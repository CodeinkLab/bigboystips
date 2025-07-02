import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/shared/Navbar";
import "./globals.css";
import Footer from "./components/shared/Footer";
import { DialogProvider } from "./components/shared/dialog";
import { Playfair_Display, Manrope, Plus_Jakarta_Sans, Roboto_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ContentProvider } from "./contexts/ContentContext";
import ProgressBar from "./components/shared/progressbar";


const fancySerif = Plus_Jakarta_Sans({
  variable: "--font-fancy-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const fancyMono = Geist_Mono({
  variable: "--font-fancy-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
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
      <body className={`${fancySerif.variable} ${fancyMono.variable} antialiased bg-white`}>
        <Toaster />
        <ProgressBar/>
          <AuthProvider>
            <ContentProvider>
              <DialogProvider>
                <Navbar />
                <main>
                  {children}
                </main>
                <Footer />
              </DialogProvider>
            </ContentProvider>
          </AuthProvider>
      </body>
    </html>
  );
}
