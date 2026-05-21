// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// --- NUEVO: IMPORTACIONES DE ESTRUCTURA GLOBAL (TFG: Patrón de Layouts) ---
import { AuthProvider } from "@/context/AuthContext";
import Footer from "@/components/Footer"; // Importamos el footer que acabamos de crear

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CaterChef Fusión",
  description:
    "Plataforma de gestión de catering y experiencias de chef privado",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* --- PROVEEDOR DE ESTADO GLOBAL --- */}
        <AuthProvider>
          {/* El contenido de cada página (la carta, los chefs, etc.) */}
          {children}

          {/* --- NUEVO: FOOTER GLOBAL --- */}
          {/* Al estar fuera de {children} pero dentro de AuthProvider, 
              se renderiza en todas las rutas de forma persistente. */}
          <Footer />
          {/* ----------------------------------------------------------- */}
        </AuthProvider>
      </body>
    </html>
  );
}
