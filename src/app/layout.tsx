// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// --- ACTUALIZADO: IMPORTACIONES DE ESTRUCTURA GLOBAL (TFG: Patrón de Layouts y Composición) ---
import { AuthProvider } from "@/context/AuthContext";
// NUEVO: Importación del proveedor de estado global del carrito
import { CartProvider } from "@/context/CartContext";
// 👈 NUEVO: Importación de la barra de anuncios superior interactiva
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    "Plataforma de gestión de catering y experiences de chef privado",
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
        {/* --- PROVEEDOR DE ESTADO GLOBAL (JWT) --- */}
        <AuthProvider>
          {/* --- NUEVO: PROVEEDOR DEL CARRITO GLOBAL (TFG: Anidamiento Jerárquico de Estados) --- */}
          <CartProvider>
            {/* 👈 NUEVO: BARRA DE ANUNCIOS SUPERIOR --- */}
            {/* Se posiciona arriba del todo del DOM dentro del body para que sea el primer elemento 
                visual visible y cliqueable de la interfaz en cualquier ruta. */}
            <AnnouncementBar />

            {/* --- NAVBAR GLOBAL --- */}
            {/* Posicionado de forma que consuma de manera reactiva tanto las credenciales (useAuth) 
                como el contador dinámico de artículos (useCart) */}
            <Navbar />

            {/* --- CONTENEDOR DE ENRUTAMIENTO DINÁMICO --- */}
            {/* Envolvemos {children} en una etiqueta semántica 'main' con 'flex-grow'. 
                Esto asegura que si una vista tiene poco contenido, el Footer no flote, 
                sino que sea empujado hacia la parte inferior de la pantalla de forma profesional. */}
            <main className="grow">{children}</main>

            {/* --- FOOTER GLOBAL --- */}
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
