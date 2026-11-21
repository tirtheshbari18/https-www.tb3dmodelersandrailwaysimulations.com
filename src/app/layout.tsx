import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AntiPiracyModal from "@/components/AntiPiracyModal";
import { CartProvider } from "@/lib/cartContext";

export const metadata: Metadata = {
  title: "TB PRO | Indian Railways • LHB Coaches • MSTS • Open Rails",
  description:
    "Experience Indian Railways like never before with TB PRO. Official home of authentic Indian Railways LHB Coaches, Vistadome, Sleeper, Chair Car, WAP-7 electric locomotives, and 3D Route assets for Open Rails & MSTS.",
  keywords: [
    "TB PRO",
    "Indian Railways",
    "LHB Coaches",
    "Open Rails Train Simulator",
    "MSTS",
    "Microsoft Train Simulator",
    "Indian Railways 3D Models",
    "LHB Vistadome",
    "Shatabdi Express Addons",
    "Rajdhani Express MSTS",
    "Train Simulator Addons",
    "WAP-7 Locomotive",
    "Trainboards"
  ],
  authors: [{ name: "TB PRO" }],
  creator: "TB PRO",
  publisher: "TB PRO Railway Simulations",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://tb3dmodelersandrailwaysimulations.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tb3dmodelersandrailwaysimulations.com",
    title: "TB PRO | Indian Railways • LHB Coaches • MSTS • Open Rails",
    description: "High-precision Indian Railways 3D rolling stock & route assets for Open Rails & MSTS by TB PRO.",
    siteName: "TB PRO",
    images: [
      {
        url: "/assets/tbpro/hero_lhb_train.jpg",
        width: 1200,
        height: 630,
        alt: "TB PRO Indian Railways LHB Train Simulation",
      },
    ],
  },
  icons: {
    icon: "/assets/tbpro/tbpro_logo.svg",
    shortcut: "/assets/tbpro/tbpro_logo.svg",
    apple: "/assets/tbpro/tbpro_logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#F4F7FB] text-[#172033] antialiased font-josefin selection:bg-[#00B8D9] selection:text-[#101D35]">
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
