import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { CartProvider } from "@/context/CartContext";
import CartModal from "@/components/CartModal";

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  title: "DecoEstilos - Diseño y Fabricación a Medida",
  description: "Tu destino para encontrar los mejores productos de decoración y diseño para tu hogar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css" />
        <link rel="icon" href="https://i.imgur.com/nKN165j.png" />
      </head>
      <body className={`${poppins.variable} font-sans pt-16`}>
                    <CartProvider>
                      <Suspense fallback={null}>
                        <Header />
                      </Suspense>
                      <main id="main-content">
                        {children}
                      </main>
                      <Footer />
                      <CartModal />
                      <WhatsAppButton />
                    </CartProvider>      </body>
    </html>
  );
}