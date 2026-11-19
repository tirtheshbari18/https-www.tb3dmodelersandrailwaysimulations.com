import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AntiPiracyModal from "@/components/AntiPiracyModal";
import { CartProvider } from "@/lib/cartContext";

export const metadata: Metadata = {
  title: "VG-3D Modelers & Railway Simulations | Varun Ganesh",
  description:
    "Official website of VG-3D Modelers & Railway Simulations. Home of authentic VG LHB Coaches, Vistadome, Sleeper, Chaircar, and 3D Route assets for Open Rails & MSTS.",
  keywords: [
    "VG-3D Modelers",
    "Varun Ganesh",
    "Railway Simulations",
    "Open Rails Train Simulator",
    "MSTS",
    "VG LHB Coaches",
    "Indian Railways 3D Models",
    "LHB Vistadome",
    "Shatabdi Express Addons",
    "Rajdhani Express MSTS",
    "Train Simulator Addons"
  ],
  authors: [{ name: "Varun Ganesh" }],
  creator: "Varun Ganesh",
  publisher: "VG-3D Modelers & Railway Simulations",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://vg3dmodelersandrailwaysimulations.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vg3dmodelersandrailwaysimulations.com",
    title: "VG-3D Modelers & Railway Simulations",
    description: "High-precision 3D rolling stock & route assets for Open Rails & MSTS by Varun Ganesh.",
    siteName: "VG-3D Modelers & Railway Simulations",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-white text-[#101C32] antialiased font-josefin">
        <CartProvider>
          <AntiPiracyModal />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <CartDrawer />
          <WhatsAppButton />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
