// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Definimos la estructura del perfil para el tipado estricto de TypeScript
interface PerfilNav {
  nombre: string;
  apellidos: string;
  rol: string;
}

export default function Navbar() {
  // Extraemos la sesión del contexto global
  const { token, cerrarSesion } = useAuth();
  const router = useRouter();

  // Control del perfil y visibilidad del desplegable en escritorio
  const [perfil, setPerfil] = useState<PerfilNav | null>(null);
  const [mostrarMenu, setMostrarMenu] = useState(false);

  // Control de apertura de la cortina móvil (TFG: Responsividad UI)
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  // Sincroniza los datos del usuario autenticado (TFG: Consumo RBAC)
  useEffect(() => {
    if (token) {
      fetch("http://127.0.0.1:8000/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setPerfil(data);
        })
        .catch((err) =>
          console.error("Error al recuperar sesión en Navbar:", err),
        );
    } else {
      setPerfil(null);
    }
  }, [token]);

  // Manejador atómico para destruir la sesión local y redirigir de forma segura
  const manejarCierreSesion = () => {
    setMostrarMenu(false);
    setMenuMovilAbierto(false); // Asegura el cierre del panel móvil al desloguearse
    cerrarSesion();
    router.push("/");
  };

  return (
    <nav className="border-b border-slate-100 sticky top-0 z-50 font-sans shadow-sm backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex justify-between items-center">
        {/* Isotipo Culinario */}
        <Link
          href="/"
          className="text-2xl font-black text-slate-900 tracking-tight transition-transform hover:scale-[1.02]"
          onClick={() => setMenuMovilAbierto(false)} // Cierra el menú móvil si se pulsa el logo
        >
          CaterChef<span className="text-amber-500">.</span>
        </Link>

        {/* --- ENLACES NAVEGACIÓN ESCRITORIO --- */}
        <div className="hidden md:flex gap-8 text-sm font-bold text-slate-600">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            Inicio
          </Link>
          <Link
            href="/carta"
            className="hover:text-amber-600 transition-colors"
          >
            La Carta
          </Link>
          <Link
            href="/chefs"
            className="hover:text-amber-600 transition-colors"
          >
            Nuestros Chefs
          </Link>
          <Link
            href="/reservas"
            className="hover:text-amber-600 transition-colors"
          >
            Eventos Privados
          </Link>
          <Link
            href="/contacto"
            className="hover:text-amber-600 transition-colors"
          >
            Contacto
          </Link>
        </div>

        {/* --- ACCIONES DINÁMICAS ESCRITORIO --- */}
        <div className="hidden md:flex items-center gap-4 text-sm relative">
          {token && perfil ? (
            <div className="relative">
              {/* Avatar Circular con Iniciales Dinámicas (UX Premium) */}
              <button
                onClick={() => setMostrarMenu(!mostrarMenu)}
                className="w-10 h-10 bg-amber-500 hover:bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-sm uppercase tracking-wider shadow-sm transition-all outline-none ring-2 ring-transparent focus:ring-amber-200 cursor-pointer"
              >
                {perfil.nombre.charAt(0)}
                {perfil.apellidos ? perfil.apellidos.charAt(0) : ""}
              </button>

              {/* Menú Desplegable con Discriminación Operativa (RBAC) */}
              {mostrarMenu && (
                <div className="absolute right-0 top-full mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 animate-fade-in">
                  {/* Información de Identidad */}
                  <div className="px-4 py-3 border-b border-slate-50 mb-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Cuenta Activa
                    </p>
                    <p className="text-sm font-black text-slate-800 truncate">
                      {perfil.nombre} {perfil.apellidos}
                    </p>
                  </div>

                  {/* RUTA PROTEGIDA: Solo visible para Administradores */}
                  {perfil.rol === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setMostrarMenu(false)}
                      className="block px-4 py-2.5 text-sm font-bold text-amber-600 hover:bg-amber-50 transition-colors"
                    >
                      ⚙️ Panel de Control
                    </Link>
                  )}

                  {/* Rutas Comunes para todos los Clientes Autenticados */}
                  <Link
                    href="/perfil/compras"
                    onClick={() => setMostrarMenu(false)}
                    className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium"
                  >
                    📦 Mis Compras
                  </Link>

                  <Link
                    href="/perfil/cuenta"
                    onClick={() => setMostrarMenu(false)}
                    className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium"
                  >
                    👤 Configurar Cuenta
                  </Link>

                  {/* Cierre de Sesión */}
                  <div className="border-t border-slate-50 mt-1 pt-1">
                    <button
                      onClick={manejarCierreSesion}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-bold transition-colors cursor-pointer"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-slate-900 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>

        {/* --- BOTÓN HAMBURGUESA INTERACTIVO (Sólo visible en móviles/tablets 'md:hidden') --- */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
            className="text-slate-900 focus:outline-none p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Alternar navegación móvil"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {menuMovilAbierto ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* --- DESPLEGABLE VERTICAL MÓVIL CENTRADO (TFG: Arquitectura Adaptable y Fluida) --- */}
      {/* --- MODIFICADO: Añadidas las clases 'flex flex-col items-center text-center' para centrar todo el ecosistema móvil --- */}
      {menuMovilAbierto && (
        <div className="md:hidden bg-white/95 border-t border-slate-100 backdrop-blur-lg animate-fade-in px-6 py-6 space-y-6 shadow-xl flex flex-col items-center text-center">
          {/* Listado Vertical de Enlaces Públicos Completamente Centrados */}
          <div className="flex flex-col gap-4 text-base font-bold text-slate-700 w-full items-center">
            <Link
              href="/"
              onClick={() => setMenuMovilAbierto(false)}
              className="hover:text-amber-600 py-1 transition-colors block w-full text-center"
            >
              Inicio
            </Link>
            <Link
              href="/carta"
              onClick={() => setMenuMovilAbierto(false)}
              className="hover:text-amber-600 py-1 transition-colors block w-full text-center"
            >
              La Carta
            </Link>
            <Link
              href="/chefs"
              onClick={() => setMenuMovilAbierto(false)}
              className="hover:text-amber-600 py-1 transition-colors block w-full text-center"
            >
              Nuestros Chefs
            </Link>
            <Link
              href="/reservas"
              onClick={() => setMenuMovilAbierto(false)}
              className="hover:text-amber-600 py-1 transition-colors block w-full text-center"
            >
              Eventos Privados
            </Link>
            <Link
              href="/contacto"
              onClick={() => setMenuMovilAbierto(false)}
              className="hover:text-amber-600 py-1 transition-colors block w-full text-center"
            >
              Contacto
            </Link>
          </div>

          {/* Bloque de Gestión de Sesión Integrado y Centrado para Móviles */}
          <div className="border-t border-slate-100 pt-5 w-full max-w-xs flex flex-col items-center justify-center">
            {token && perfil ? (
              <div className="space-y-4 w-full flex flex-col items-center">
                {/* Identificación del perfil activo */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 w-full text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                    Sesión Iniciada como
                  </p>
                  <p className="text-sm font-black text-slate-800 truncate mt-1">
                    {perfil.nombre} {perfil.apellidos}
                  </p>
                </div>
                {/* Enlaces protegidos móviles según Rol Centrados */}
                {/* --- MODIFICADO: Forzamos alineación central y eliminamos clases de margen flotante --- */}
                <div className="flex flex-col gap-3.5 text-sm font-bold items-center w-full text-center">
                  {perfil.rol === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setMenuMovilAbierto(false)}
                      className="text-amber-600 block w-full text-center hover:underline"
                    >
                      ⚙️ Centro de Control (Admin)
                    </Link>
                  )}
                  <Link
                    href="/perfil/compras"
                    onClick={() => setMenuMovilAbierto(false)}
                    className="text-slate-600 block w-full text-center hover:underline"
                  >
                    📦 Mis Compras
                  </Link>
                  <Link
                    href="/perfil/cuenta"
                    onClick={() => setMenuMovilAbierto(false)}
                    className="text-slate-600 block w-full text-center hover:underline"
                  >
                    👤 Mi Cuenta
                  </Link>
                  <button
                    onClick={manejarCierreSesion}
                    className="text-center text-red-500 font-bold mt-2 cursor-pointer block w-full hover:underline outline-none"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            ) : (
              // CTA Completo para usuarios invitados en movilidad centrado
              <Link
                href="/login"
                onClick={() => setMenuMovilAbierto(false)}
                className="block text-center bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-md uppercase tracking-wider text-xs w-full"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
