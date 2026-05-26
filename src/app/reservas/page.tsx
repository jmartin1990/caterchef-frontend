// src/app/reservas/page.tsx
"use client";

import { useState, SyntheticEvent } from "react";
import Link from "next/link";

export default function ReservasPage() {
  // --- NUEVO: ESTADO DE CONTROL DE CARGA PARA INTERFAZ ---
  const [cargando, setCargando] = useState(false);

  // Estado inicial del formulario.
  // Nota: Sincronizamos el valor por defecto de 'tipoChef' con la nueva nomenclatura con nombre de chef.
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    fecha: "",
    tipoEvento: "Cena Romántica (Privado)",
    tipoChef: "Fusión (Perú/España) - Chef Franklin", // Valor base actualizado
    comensales: "2",
  });

  // ESTRUCTURA DE TARIFAS Y DATOS DE CHEFS DE CONTROL
  // Estructura de metadatos estáticos para el cálculo dinámico de costes en el cliente
  const experienciasCulinarias = [
    {
      id: "Tradicional Peruano - Chef Carlos",
      titulo: "Tradicional Peruano",
      chef: "Chef Carlos",
      banderas: "🇵🇪",
      precioBajo: { min: 50, max: 60 }, // Tarifas para 1-5 comensales
      precioAlto: { min: 40, max: 50 }, // Tarifas para 6 o más comensales
    },
    {
      id: "Tradicional Español - Chef Laura",
      titulo: "Tradicional Español",
      chef: "Chef Laura",
      banderas: "🇪🇸",
      precioBajo: { min: 40, max: 50 }, // Tarifas para 1-5 comensales
      precioAlto: { min: 30, max: 40 }, // Tarifas para 6 o más comensales
    },
    {
      id: "Fusión (Perú/España) - Chef Franklin",
      titulo: "Fusión (Perú/España)",
      chef: "Chef Franklin",
      banderas: "🇵🇪 🇪🇸", // 👈 MODIFICADO: Dos banderas juntas para la fusión
      precioBajo: { min: 55, max: 65 }, // Tarifas para 1-5 comensales
      precioAlto: { min: 45, max: 55 }, // Tarifas para 6 o más comensales
    },
  ];

  // CÁLCULO DINÁMICO DE RANGO DE PRECIO EN CALIENTE ---
  const numComensales = parseInt(formData.comensales, 10) || 1;
  const experienciaSeleccionada = experienciasCulinarias.find(
    (exp) => exp.id === formData.tipoChef,
  );

  let rangoPrecioActual = "";
  if (experienciaSeleccionada) {
    if (numComensales <= 5) {
      rangoPrecioActual = `${experienciaSeleccionada.precioBajo.min}€ - ${experienciaSeleccionada.precioBajo.max}€`;
    } else {
      rangoPrecioActual = `${experienciaSeleccionada.precioAlto.min}€ - ${experienciaSeleccionada.precioAlto.max}€`;
    }
  }

  // Manejador del envío del formulario.
  const manejarEnvio = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCargando(true);

    try {
      // --- CORRECCIÓN CRÍTICA: Contrato de API (Mapeo) ---
      // Enviamos el valor completo de 'tipoChef' (Ej: "Fusión (Perú/España) - Chef Franklin")
      // de forma transparente hacia la columna 'tipo_chef' en Neon DB.
      const payload = {
        nombre: formData.nombre,
        email: formData.email,
        fecha: formData.fecha,
        tipo_evento: formData.tipoEvento,
        tipo_chef: formData.tipoChef,
        comensales: parseInt(formData.comensales, 10),
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
          tipoChef: "Fusión (Perú/España) - Chef Franklin",
          comensales: "2",
        });
      } else {
        alert("Hubo un error al guardar la reserva. Verifica el backend.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
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
                  min="1"
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
              {/* --- ACTUALIZADO: Cabecera con indicación de precio estimado dinámico por persona --- */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
                <label className="block text-lg font-black text-slate-900">
                  ¿Qué experiencia culinaria buscas?
                </label>
                <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl self-start">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Est. por persona:
                  </span>
                  <span className="font-black text-amber-800 text-sm">
                    {rangoPrecioActual}
                  </span>
                </div>
              </div>

              {/* --- ACTUALIZADO: Mapeo de tarjetas de chef dinámicas --- */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {experienciasCulinarias.map((exp) => (
                  <label
                    key={exp.id}
                    className={`cursor-pointer border-2 rounded-2xl p-5 flex flex-col items-center text-center transition-all ${
                      formData.tipoChef === exp.id
                        ? "border-amber-500 bg-amber-50/60 shadow-sm transform scale-[1.01]"
                        : "border-slate-200 hover:border-amber-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipoChef"
                      value={exp.id}
                      checked={formData.tipoChef === exp.id}
                      onChange={(e) =>
                        setFormData({ ...formData, tipoChef: e.target.value })
                      }
                      className="sr-only"
                    />
                    <span className="text-3xl mb-3 tracking-wider">
                      {exp.banderas}
                    </span>
                    <span className="font-black text-slate-900 text-sm mb-1 leading-tight">
                      {exp.titulo}
                    </span>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full mt-1 mb-3">
                      👨‍🍳 {exp.chef}
                    </span>
                    {/* Tarifa base informativa por tarjeta */}
                    <span className="text-[11px] font-bold text-slate-400 mt-auto">
                      Tarifa base:{" "}
                      {numComensales <= 5
                        ? `${exp.precioBajo.min}-${exp.precioBajo.max}€`
                        : `${exp.precioAlto.min}-${exp.precioAlto.max}€`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Botón */}
            <div className="pt-8">
              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-slate-900 text-white font-black text-xl py-4 rounded-xl hover:bg-slate-800 transition shadow-xl cursor-pointer disabled:opacity-50 uppercase tracking-wider"
              >
                {cargando ? "Procesando solicitud..." : "Solicitar Presupuesto"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
