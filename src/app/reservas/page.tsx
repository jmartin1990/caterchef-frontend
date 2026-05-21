// src/app/reservas/page.tsx
"use client";

import { useState, SyntheticEvent } from "react";
import Link from "next/link";

export default function ReservasPage() {
  // Estado inicial del formulario.
  // Nota: Mantenemos el formato CamelCase aquí para que sea compatible con los inputs de React.
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    fecha: "",
    tipoEvento: "Cena Romántica (Privado)",
    tipoChef: "Fusión (Perú/España)",
    comensales: "2",
  });

  // Manejador del envío del formulario.
  // Usamos SyntheticEvent<HTMLFormElement> como el tipo de evento más compatible y profesional.
  const manejarEnvio = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // --- CORRECCIÓN CRÍTICA: Contrato de API (Mapeo) ---
      // Aquí traducimos los campos del formulario al formato 'snake_case' que espera tu FastAPI.
      // Esto elimina el error 422 (Unprocessable Content) que recibimos antes.
      const payload = {
        nombre: formData.nombre,
        email: formData.email,
        fecha: formData.fecha,
        tipo_evento: formData.tipoEvento, // Backend espera: tipo_evento
        tipo_chef: formData.tipoChef, // Backend espera: tipo_chef
        comensales: parseInt(formData.comensales, 10), // Conversión necesaria para la BBDD
      };

      const respuesta = await fetch("http://127.0.0.1:8000/api/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (respuesta.ok) {
        alert(
          "¡Solicitud enviada con éxito! Nos pondremos en contacto pronto.",
        );
        // Reseteamos el estado a los valores iniciales tras un envío exitoso.
        setFormData({
          nombre: "",
          email: "",
          fecha: "",
          tipoEvento: "Cena Romántica (Privado)",
          tipoChef: "Fusión (Perú/España)",
          comensales: "2",
        });
      } else {
        alert("Hubo un error al guardar la reserva. Verifica el backend.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <main className="min-h-screen p-10 bg-slate-50 text-slate-800 font-sans">
      <div className="max-w-4xl mx-auto">
        <nav className="mb-8">
          <Link
            href="/"
            className="text-amber-600 font-bold hover:text-amber-700 flex items-center gap-2"
          >
            ← Volver a la Carta
          </Link>
        </nav>

        <header className="mb-12 border-b border-slate-200 pb-8">
          <h1 className="text-5xl font-black mb-4 text-slate-900 tracking-tight">
            Experiencia Chef Privado
          </h1>
          <p className="text-xl text-slate-600">
            Llevamos la alta cocina directamente a tu mesa.
          </p>
        </header>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <form onSubmit={manejarEnvio} className="space-y-6">
            {/* Datos Personales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            {/* Detalles Evento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Fecha del evento
                </label>
                <input
                  type="date"
                  required
                  value={formData.fecha}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Tipo de evento
                </label>
                <select
                  value={formData.tipoEvento}
                  onChange={(e) =>
                    setFormData({ ...formData, tipoEvento: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                >
                  <option>Cena Romántica (Privado)</option>
                  <option>Reunión Familiar / Amigos</option>
                  <option>Catering para Empresa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Comensales
                </label>
                <input
                  type="number"
                  min="2"
                  max="100"
                  required
                  value={formData.comensales}
                  onChange={(e) =>
                    setFormData({ ...formData, comensales: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            {/* Selección de Chef */}
            <div className="pt-4">
              <label className="block text-lg font-black text-slate-900 mb-4">
                ¿Qué experiencia culinaria buscas?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  "Tradicional Peruano",
                  "Tradicional Español",
                  "Fusión (Perú/España)",
                ].map((especialidad) => (
                  <label
                    key={especialidad}
                    className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center text-center transition-all ${
                      formData.tipoChef === especialidad
                        ? "border-amber-500 bg-amber-50"
                        : "border-slate-200 hover:border-amber-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipoChef"
                      value={especialidad}
                      checked={formData.tipoChef === especialidad}
                      onChange={(e) =>
                        setFormData({ ...formData, tipoChef: e.target.value })
                      }
                      className="sr-only"
                    />
                    <span className="text-2xl mb-2">
                      {especialidad === "Tradicional Peruano"
                        ? "🇵🇪"
                        : especialidad === "Tradicional Español"
                          ? "🇪🇸"
                          : "🤝"}
                    </span>
                    <span className="font-bold text-slate-800">
                      {especialidad}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Botón */}
            <div className="pt-8">
              <button
                type="submit"
                className="w-full bg-slate-900 text-white font-black text-xl py-4 rounded-xl hover:bg-slate-800 transition shadow-xl"
              >
                Solicitar Presupuesto
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
