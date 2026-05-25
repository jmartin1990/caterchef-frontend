// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// --- ACTUALIZADO: IMPORTACIONES DE ESTRUCTURA GLOBAL (TFG: Patrón de Layouts y Composición) ---
// Importamos el AuthProvider, el Navbar y el Footer para definir el marco envolvente persistente de la app.
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar"; // <-- NUEVO: Importación del componente de navegación interactiva
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
        {/* --- PROVEEDOR DE ESTADO GLOBAL (JWT) --- */}
        <AuthProvider>
          {/* --- NUEVO: NAVBAR GLOBAL --- */}
          {/* Al posicionarse aquí, la barra de navegación superior estará presente en todas las rutas 
              y tendrá acceso inmediato al estado de autenticación (useAuth) */}
          <Navbar />

          {/* --- NUEVO: CONTENEDOR DE ENRUTAMIENTO DINÁMICO --- */}
          {/* Envolvemos {children} en una etiqueta semántica 'main' con 'flex-grow'. 
              Esto asegura que si una vista (ej. Login) tiene poco contenido, el Footer no flote, 
              sino que sea empujado hacia la parte inferior de la pantalla de forma profesional. */}
          <main className="flex-grow">{children}</main>

          {/* --- FOOTER GLOBAL --- */}
          {/* Se mantiene persistente abajo del todo en la jerarquía del DOM */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
