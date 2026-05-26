// src/app/perfil/layout.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PerfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, estaLogueado, cerrarSesion } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [perfilUsuario, setPerfilUsuario] = useState<{
    nombre: string;
    apellidos: string;
  } | null>(null);

  // Control de apertura del desplegable vertical móvil
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Sincronización con el servidor de la extranet
  useEffect(() => {
    if (token === undefined) return;
    if (!token) {
      router.push("/");
      return;
    }
    fetch("http://127.0.0.1:8000/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setPerfilUsuario(data);
      });
  }, [token, router]);

  if (!estaLogueado || !perfilUsuario)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans text-amber-600 font-bold animate-pulse">
        Cargando tu área privada...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* --- CABECERA MÓVIL/TABLET: CORRECCIÓN DE POSICIÓN STICKY --- */}
      {/* Cambiado 'top-16' a 'top-20' (80px) para sincronizarse perfectamente con la 
        altura real del Navbar principal de CaterChef y evitar que se pise o recorte al hacer scroll.
      */}
      <div className="w-full bg-white border-b border-slate-200 md:hidden flex flex-col shadow-sm sticky top-20 z-30">
        {/* Barra Superior */}
        <div className="flex items-center h-16 px-6 justify-between">
          <div className="flex items-center gap-4">
            {/* Hamburguesa con diseño asimétrico */}
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="p-2 -ml-2 text-slate-700 hover:text-amber-600 focus:outline-none transition-colors flex items-center justify-center"
              aria-label="Abrir menú"
            >
              {menuAbierto ? (
                <svg
                  className="w-5 h-5 text-slate-800"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-slate-800"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" d="M4 6h16M4 12h10M4 18h14" />
                </svg>
              )}
            </button>

            {/* Identificador de página */}
            {!menuAbierto && (
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider block truncate">
                {pathname === "/perfil/compras" && "📋 Mis compras"}
                {pathname === "/perfil/cuenta" && "👤 Mi cuenta"}
                {pathname === "/perfil/password" && "🔑 Contraseña"}
              </span>
            )}
          </div>

          {/* Botón salir superior móvil con SVG Vectorial Limpio */}
          {!menuAbierto && (
            <button
              onClick={() => {
                cerrarSesion();
                router.push("/");
              }}
              className="text-slate-400 hover:text-red-600 transition-colors p-2 flex items-center justify-center"
              title="Salir"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5m0 0l-5-5m5 5H9"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Desplegable vertical móvil */}
        {menuAbierto && (
          <nav className="px-6 py-4 space-y-2 bg-white border-t border-slate-100 flex flex-col shadow-inner">
            <Link
              href="/perfil/compras"
              onClick={() => setMenuAbierto(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                pathname === "/perfil/compras"
                  ? "bg-amber-50 text-amber-700"
                  : "text-slate-600 bg-slate-50"
              }`}
            >
              📋 Mis compras
            </Link>
            <Link
              href="/perfil/cuenta"
              onClick={() => setMenuAbierto(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                pathname === "/perfil/cuenta"
                  ? "bg-amber-50 text-amber-700"
                  : "text-slate-600 bg-slate-50"
              }`}
            >
              👤 Mi cuenta
            </Link>
            <Link
              href="/perfil/password"
              onClick={() => setMenuAbierto(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                pathname === "/perfil/password"
                  ? "bg-amber-50 text-amber-700"
                  : "text-slate-600 bg-slate-50"
              }`}
            >
              🔑 Contraseña
            </Link>

            <div className="pt-4 border-t border-slate-100 mt-2 flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setMenuAbierto(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-400 hover:text-amber-600 transition-colors"
              >
                <span>←</span> Volver a la web
              </Link>

              <button
                onClick={() => {
                  setMenuAbierto(false);
                  cerrarSesion();
                  router.push("/");
                }}
                className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl font-bold text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5m0 0l-5-5m5 5H9"
                  />
                </svg>
                <span>Salir de la cuenta</span>
              </button>
            </div>
          </nav>
        )}
      </div>

      {/* --- SIDEBAR ESCRITORIO CLÁSICO --- */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col pt-8 pb-4">
        <nav className="flex-1 px-4 space-y-2">
          <Link
            href="/perfil/compras"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${pathname === "/perfil/compras" ? "bg-amber-50 text-amber-700" : "text-slate-600 hover:bg-slate-50"}`}
          >
            📋 Mis compras
          </Link>
          <Link
            href="/perfil/cuenta"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${pathname === "/perfil/cuenta" ? "bg-amber-50 text-amber-700" : "text-slate-600 hover:bg-slate-50"}`}
          >
            👤 Mi cuenta
          </Link>
          <Link
            href="/perfil/password"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${pathname === "/perfil/password" ? "bg-amber-50 text-amber-700" : "text-slate-600 hover:bg-slate-50"}`}
          >
            🔑 Cambiar contraseña
          </Link>

          <div className="pt-8">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-slate-400 hover:text-amber-600 transition-colors"
            >
              <span>←</span> Volver a la web
            </Link>
          </div>
        </nav>

        <div className="px-4 border-t border-slate-100 pt-4 mt-auto">
          <button
            onClick={() => {
              cerrarSesion();
              router.push("/");
            }}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <svg
              className="w-4 h-4 text-slate-500 group-hover:text-red-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5m0 0l-5-5m5 5H9"
              />
            </svg>
            <span>Salir</span>
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col w-full overflow-hidden">
        <div className="p-5 sm:p-8 md:pt-8 md:pb-12 md:px-12 max-w-5xl w-full mx-auto md:mx-0">
          {children}
        </div>
      </main>
    </div>
  );
}
