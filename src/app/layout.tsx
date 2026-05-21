// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// --- NUEVO: IMPORTACIÓN DEL PROVEEDOR DE CONTEXTO (TFG: Inyección de Estado Global) ---
// Importamos el AuthProvider para que toda la aplicación tenga acceso al estado del JWT.
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Puedes aprovechar para personalizar los metadatos de tu proyecto aquí mismo
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
      lang="es" // Cambiado a español para adaptarlo a tu público de Madrid
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* --- NUEVO: ENVOLTORIO DE AUTENTICACIÓN (TFG: Patrón Provider) --- */}
        {/* Al envolver {children} dentro de AuthProvider, cualquier página o componente 
            interno de la app (como la carta o las reservas) podrá usar el hook 'useAuth()' */}
        <AuthProvider>{children}</AuthProvider>
        {/* ------------------------------------------------------------------- */}
      </body>
    </html>
  );
}
