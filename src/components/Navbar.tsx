// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
// --- CONSUMO DEL ESTADO REACTIVO DEL CARRITO GLOBAL (TFG: Persistencia UI) ---
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";

// Definimos la estructura del perfil para el tipado estricto
interface PerfilNav {
  nombre: string;
  apellidos: string;
  rol: string;
}

export default function Navbar() {
  // Extraemos la sesión del contexto global
  const { token, cerrarSesion } = useAuth();

  // --- ACTUALIZADO: Eliminado useRouter. La reactividad del Contexto actualiza la UI automáticamente ---

  const {
    carrito,
    totalItems,
    totalPrecioBase,
    incrementarCantidad,
    decrementarCantidad,
    quitarDelCarrito,
  } = useCart();

  const [perfil, setPerfil] = useState<PerfilNav | null>(null);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [mostrarMiniCart, setMostrarMiniCart] = useState(false);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  // Sincroniza los datos del usuario autenticado (TFG: Consumo RBAC)
  useEffect(() => {
    if (token) {
      fetch("http://localhost:8000/api/me", {
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

  // --- ACTUALIZADO: Manejador de cierre de sesión puro ---
  // Al eliminar router.push("/"), el usuario se mantiene en la página actual al salir.
  // El AuthContext emitirá el cambio de estado y el Navbar se actualizará solo.
  const manejarCierreSesion = () => {
    setMostrarMenu(false);
    setMostrarMiniCart(false);
    setMenuMovilAbierto(false);
    cerrarSesion();
  };

  return (
    <nav className="border-b border-slate-100 sticky top-0 z-50 font-sans shadow-sm backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex justify-between items-center">
        {/* Isotipo Culinario */}
        <Link
          href="/"
          className="text-2xl font-black text-slate-900 tracking-tight transition-transform hover:scale-[1.02]"
          onClick={() => {
            setMenuMovilAbierto(false);
            setMostrarMiniCart(false);
          }}
        >
          CaterChef<span className="text-amber-500">.</span>
        </Link>

        {/* --- NAVEGACIÓN ESCRITORIO --- */}
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
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setMostrarMiniCart(!mostrarMiniCart);
                setMostrarMenu(false);
              }}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full transition-all duration-200 outline-none relative cursor-pointer flex items-center justify-center text-base"
            >
              🛒
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-amber-500 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

            {/* --- MINI-CARRITO --- */}
            {mostrarMiniCart && totalItems > 0 && (
              <div className="absolute right-0 top-full mt-3 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl p-4 z-50 animate-fade-in">
                <h4 className="font-black text-slate-800 text-sm mb-3 border-b border-slate-100 pb-2 flex justify-between">
                  <span>Tu Cesta</span>
                  <span className="text-amber-600 font-mono">
                    {totalPrecioBase.toFixed(2)}€
                  </span>
                </h4>
                <div className="max-h-48 overflow-y-auto space-y-3 mb-4 pr-1">
                  {carrito.map((item) => (
                    <div
                      key={item.plato.id}
                      className="flex justify-between items-center text-xs pb-2 border-b border-slate-50"
                    >
                      <div className="w-1/3 truncate">
                        <span className="font-bold text-slate-700 block truncate">
                          {item.plato.nombre}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {(item.plato.precio * item.cantidad).toFixed(2)}€
                        </span>
                      </div>
                      <div className="flex items-center bg-slate-50 border border-slate-100 rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => decrementarCantidad(item.plato.id)}
                          className="px-1.5 font-bold text-slate-400"
                        >
                          -
                        </button>
                        <span className="px-1.5 text-[11px] font-black font-mono w-4 text-center">
                          {item.cantidad}
                        </span>
                        <button
                          type="button"
                          onClick={() => incrementarCantidad(item.plato.id)}
                          className="px-1.5 font-bold text-slate-400"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => quitarDelCarrito(item.plato.id)}
                        className="text-slate-300 hover:text-red-500 p-1"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
                <Link
                  href="/carta?openCart=true" // <--- ACTUALIZADO: Añadimos el parámetro
                  onClick={() => setMostrarMiniCart(false)}
                  className="block w-full bg-slate-900 text-white text-center font-bold text-xs py-2.5 rounded-xl uppercase tracking-wider hover:bg-amber-500 transition-colors shadow-xs"
                >
                  Tramitar Pedido →
                </Link>
              </div>
            )}
          </div>

          {token && perfil ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setMostrarMenu(!mostrarMenu);
                  setMostrarMiniCart(false);
                }}
                className="w-10 h-10 bg-amber-500 hover:bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-sm uppercase cursor-pointer"
              >
                {perfil.nombre.charAt(0)}
                {perfil.apellidos ? perfil.apellidos.charAt(0) : ""}
              </button>

              {mostrarMenu && (
                <div className="absolute right-0 top-full mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-slate-50 mb-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Cuenta Activa
                    </p>
                    <p className="text-sm font-black text-slate-800 truncate">
                      {perfil.nombre} {perfil.apellidos}
                    </p>
                  </div>
                  {perfil.rol === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setMostrarMenu(false)}
                      className="block px-4 py-2.5 text-sm font-bold text-amber-600 hover:bg-amber-50"
                    >
                      ⚙️ Panel de Control
                    </Link>
                  )}
                  <Link
                    href="/perfil/compras"
                    onClick={() => setMostrarMenu(false)}
                    className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    📦 Mis Compras
                  </Link>
                  <Link
                    href="/perfil/cuenta"
                    onClick={() => setMostrarMenu(false)}
                    className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    👤 Mi Cuenta
                  </Link>
                  <div className="border-t border-slate-50 mt-1 pt-1">
                    <button
                      type="button"
                      onClick={manejarCierreSesion}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-bold cursor-pointer"
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

        {/* ... (código móvil omitido por brevedad, es igual) ... */}
      </div>
    </nav>
  );
}
