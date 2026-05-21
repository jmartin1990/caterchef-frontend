// src/app/perfil/compras/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function MisCompras() {
  const { token } = useAuth();
  const [tabActiva, setTabActiva] = useState<"catering" | "chef">("catering");
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [reservas, setReservas] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;

    // Cargar Pedidos de Catering
    fetch("http://127.0.0.1:8000/api/pedidos/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPedidos(data));

    // Cargar Reservas de Chef
    fetch("http://127.0.0.1:8000/api/reservas/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setReservas(data));
  }, [token]);

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-black text-slate-900 mb-8">Mis compras</h1>

      {/* Menú de Pestañas */}
      <div className="flex border-b border-slate-200 mb-8 gap-8">
        <button
          onClick={() => setTabActiva("catering")}
          className={`pb-4 font-bold transition-all ${tabActiva === "catering" ? "border-b-2 border-amber-500 text-amber-600" : "text-slate-400 hover:text-slate-600"}`}
        >
          Catering Fusión
        </button>
        <button
          onClick={() => setTabActiva("chef")}
          className={`pb-4 font-bold transition-all ${tabActiva === "chef" ? "border-b-2 border-amber-500 text-amber-600" : "text-slate-400 hover:text-slate-600"}`}
        >
          Chef a Domicilio
        </button>
      </div>

      {/* TAB CATERING */}
      {tabActiva === "catering" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pedidos.length === 0 ? (
            <p className="text-slate-400 col-span-full">
              No tienes pedidos de catering.
            </p>
          ) : (
            pedidos.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md uppercase tracking-wider">
                      {p.estado === "pendiente_pago"
                        ? "EN PROCESO"
                        : "COMPLETADO"}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-2">
                      {p.tipo_servicio}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Ticket #{p.id} • {Number(p.total).toFixed(2)} €
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mt-4 flex-1 text-sm">
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-400">Entrega</span>
                    <span className="text-slate-700 font-medium text-right max-w-[150px] truncate">
                      {p.direccion_calle}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-400">Zona</span>
                    <span className="text-slate-700 font-medium">
                      {p.distrito} ({p.ciudad})
                    </span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-slate-400">Fecha</span>
                    <span className="text-slate-700 font-medium">
                      {new Date(p.fecha_servicio).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button className="text-amber-600 font-bold text-sm hover:text-amber-700 transition-colors flex items-center gap-1">
                    Ver recibo <span>→</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CHEF PRIVADO */}
      {tabActiva === "chef" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservas.length === 0 ? (
            <p className="text-slate-400 col-span-full">
              No has solicitado ningún Chef.
            </p>
          ) : (
            reservas.map((r) => (
              <div
                key={r.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="mb-4">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-wider">
                    SOLICITUD ENVIADA
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">
                    Chef: {r.tipo_chef}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Solicitado el{" "}
                    {new Date(r.fecha_solicitud).toLocaleDateString("es-ES")}
                  </p>
                </div>

                <div className="space-y-2 mt-4 flex-1 text-sm">
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-400">Personas</span>
                    <span className="text-slate-700 font-medium">
                      {r.comensales} personas
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-400">Ocasión</span>
                    <span className="text-slate-700 font-medium">
                      {r.tipo_evento}
                    </span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-slate-400">Fecha del Evento</span>
                    <span className="text-slate-700 font-medium">
                      {new Date(r.fecha).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
