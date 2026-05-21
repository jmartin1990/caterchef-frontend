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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        Cargando tu área privada...
      </div>
    );

  const iniciales =
    `${perfilUsuario.nombre.charAt(0)}${perfilUsuario.apellidos ? perfilUsuario.apellidos.charAt(0) : ""}`.toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* SIDEBAR IZQUIERDO */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col pt-8 pb-4 sticky top-0 md:h-screen z-10">
        <div className="px-8 mb-10">
          <Link
            href="/"
            className="text-2xl font-black text-slate-900 tracking-tight hover:text-amber-600 transition-colors"
          >
            CaterChef.
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {/* ... tus enlaces existentes ... */}
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

          {/* --- NUEVO: ENLACE DE RETORNO RÁPIDO --- */}
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
            🚪 Salir
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col">
        {/* CABECERA TOP (Avatar) */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-end px-10 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-700">
              {perfilUsuario.nombre}
            </span>
            <div className="w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold shadow-sm">
              {iniciales}
            </div>
          </div>
        </header>

        {/* PÁGINAS DINÁMICAS (Aquí se inyectan las compras o formularios) */}
        <div className="p-6 md:p-12 max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
