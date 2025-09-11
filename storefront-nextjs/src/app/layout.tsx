import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <Header />
        <main id="main-content" className="mt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}