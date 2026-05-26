// src/app/login/page.tsx
"use client";

import { useState, SyntheticEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { iniciarSesion } = useAuth();
  const router = useRouter();

  // Ampliamos los estados de vista para soportar la recuperación de credenciales
  const [vista, setVista] = useState<"login" | "registro" | "recuperar">(
    "login",
  );
  const [cargando, setCargando] = useState(false);
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    telefono: "",
    email: "",
    password: "",
  });

  const manejarSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCargando(true);

    try {
      // --- NUEVO: FLUJO DE RECUPERACIÓN DE CONTRASEÑA
      if (vista === "recuperar") {
        const respuesta = await fetch(
          "http://127.0.0.1:8000/api/recuperar-password",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formData.email }),
          },
        );

        if (respuesta.ok) {
          alert(
            "🔑 [Auditoría TFG / Servidor SMTP]: Correo verificado. Revisa la consola de tu backend para auditar el token temporal.",
          );
          setVista("login"); // Redirección interna amigable tras éxito
        } else {
          const error = await respuesta.json();
          alert(`Error: ${error.detail}`);
        }
        setCargando(false);
        return; // Intercepta el flujo para que no ejecute el registro/login inferior
      }

      if (vista === "registro") {
        if (!aceptaPrivacidad) {
          alert("Debes aceptar la Política de Privacidad.");
          setCargando(false);
          return;
        }

        const respuesta = await fetch("http://127.0.0.1:8000/api/registro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            acepta_privacidad: aceptaPrivacidad,
          }),
        });

        if (respuesta.ok) {
          const datos = await respuesta.json();
          iniciarSesion(datos.access_token);
          alert("¡Cuenta creada! Se ha aplicado tu 5% de descuento.");
          router.back(); // Esto te devolverá a la página donde estabas antes del login
        } else {
          const error = await respuesta.json();
          alert(`Error: ${error.detail}`);
        }
      } else {
        // Flujo de Login (OAuth2 de FastAPI)
        const params = new URLSearchParams();
        params.append("username", formData.email);
        params.append("password", formData.password);

        const respuesta = await fetch("http://127.0.0.1:8000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params,
        });

        if (respuesta.ok) {
          const datos = await respuesta.json();
          iniciarSesion(datos.access_token);
          router.back(); // Esto te devolverá a la página donde estabas antes del login
        } else {
          alert("Credenciales incorrectas.");
        }
      }
    } catch (error) {
      alert("Error de conexión con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-20 font-sans">
      <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-xl border border-slate-100 relative">
        {/* Botón de escape rápido para volver al escaparate principal */}
        <Link
          href="/"
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 text-2xl font-light transition-colors"
        >
          &times;
        </Link>

        <div className="text-center mb-8">
          <Link
            href="/"
            className="text-3xl font-black text-slate-900 tracking-tight block mb-2"
          >
            CaterChef<span className="text-amber-500">.</span>
          </Link>

          {/* --- NUEVO: Títulos adaptativos y Bloque Persuasivo de Marketing Requerido --- */}
          {vista === "login" && (
            <p className="text-slate-500 font-medium">
              Accede a tu área privada
            </p>
          )}
          {vista === "recuperar" && (
            <p className="text-slate-500 font-medium">
              Introduce tu email para restablecer la contraseña
            </p>
          )}

          {vista === "registro" && (
            <div className="mt-4 p-4 bg-amber-50/60 rounded-2xl border border-amber-100/70 animate-fade-in">
              <span className="text-4xl mb-2 block">🎁</span>
              <h3 className="text-lg font-black text-slate-900 leading-tight">
                Activa tu 5% Directo
                <br />
                en tu primer pedido
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 font-medium leading-relaxed">
                Identifícate para guardar tu historial y aplicar ventajas.
              </p>
            </div>
          )}
        </div>

        {/* Pestañas de Navegación: Se ocultan si el cliente está recuperando contraseña */}
        {vista !== "recuperar" && (
          <div className="flex border-b border-slate-200 mb-8">
            <button
              type="button"
              onClick={() => setVista("login")}
              className={`flex-1 pb-3 font-bold transition-colors ${vista === "login" ? "border-b-2 border-amber-500 text-amber-600" : "text-slate-400 hover:text-slate-600"}`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => setVista("registro")}
              className={`flex-1 pb-3 font-bold transition-colors ${vista === "registro" ? "border-b-2 border-amber-500 text-amber-600" : "text-slate-400 hover:text-slate-600"}`}
            >
              Registrarse
            </button>
          </div>
        )}

        {/* Formulario Dinámico */}
        <form onSubmit={manejarSubmit} className="space-y-4">
          {vista === "registro" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nombre"
                  required
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
                />
                <input
                  type="text"
                  placeholder="Apellidos"
                  value={formData.apellidos}
                  onChange={(e) =>
                    setFormData({ ...formData, apellidos: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
                />
              </div>
              <input
                type="tel"
                placeholder="Teléfono móvil"
                required
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({ ...formData, telefono: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
              />
            </>
          )}

          <input
            type="email"
            placeholder="Correo electrónico"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
          />

          {/* El campo password desaparece por completo en la vista de recuperación */}
          {vista !== "recuperar" && (
            <div>
              <input
                type="password"
                placeholder="Contraseña"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
              />

              {/* --- Enlace interactivo "¿Olvidaste tu contraseña?" (UX Gourmet) --- */}
              {vista === "login" && (
                <div className="text-right mt-2.5">
                  <button
                    type="button"
                    onClick={() => setVista("recuperar")}
                    className="text-xs text-slate-400 hover:text-amber-600 underline font-bold transition-colors outline-none cursor-pointer"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}
            </div>
          )}

          {vista === "registro" && (
            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="privacidad"
                required
                checked={aceptaPrivacidad}
                onChange={(e) => setAceptaPrivacidad(e.target.checked)}
                className="mt-1 accent-amber-500 cursor-pointer"
              />
              <label
                htmlFor="privacidad"
                className="text-xs text-slate-500 leading-snug select-none cursor-pointer"
              >
                Acepto la{" "}
                <Link
                  href="/privacidad"
                  className="text-amber-600 font-bold underline hover:text-amber-700"
                >
                  Política de Privacidad
                </Link>
                .
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-slate-900 text-white font-black py-3.5 rounded-xl hover:bg-slate-800 shadow-md mt-6 transition-all disabled:opacity-50 uppercase tracking-wider text-xs cursor-pointer"
          >
            {cargando
              ? "Procesando..."
              : vista === "login"
                ? "Entrar"
                : vista === "registro"
                  ? "Crear Cuenta"
                  : "Enviar Instrucciones"}
          </button>

          {/* --- NUEVO: Botón de retorno para romper la vista de recuperación --- */}
          {vista === "recuperar" && (
            <button
              type="button"
              onClick={() => setVista("login")}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-900 font-bold underline mt-4 block transition-colors outline-none cursor-pointer"
            >
              ← Volver al inicio de sesión
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
