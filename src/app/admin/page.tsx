// src/app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Definimos la estructura de los pedidos que viene de Neon DB
interface Pedido {
  id: number;
  usuario_id: number | null;
  tipo_servicio: string;
  fecha_servicio: string;
  estado: string;
  total: number;
  ciudad: string;
  distrito: string;
  direccion_calle: string;
  telefono: string;
  notas_cliente: string;
  creado_en: string;
}

export default function AdminDashboard() {
  // Extraemos el token del contexto global de autenticación
  const { token } = useAuth();
  const router = useRouter();

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorAcceso, setErrorAcceso] = useState<string | null>(null);

  useEffect(() => {
    // Control contra condiciones de carrera
    if (token === undefined) return;

    // Si el token es null tras la lectura, bloqueamos inmediatamente
    if (!token) {
      setErrorAcceso("Debes iniciar sesión para acceder al panel.");
      setCargando(false);
      return;
    }

    const obtenerPedidosAdmin = async () => {
      setErrorAcceso(null);
      try {
        const respuesta = await fetch(
          "http://127.0.0.1:8000/api/admin/pedidos",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (respuesta.status === 403) {
          setErrorAcceso(
            "⛔ Acceso Denegado. Esta cuenta no tiene privilegios de Administrador.",
          );
        } else if (respuesta.ok) {
          const datos = await respuesta.json();
          setPedidos(datos);
        } else {
          setErrorAcceso("Error de comunicación con el servidor.");
        }
      } catch (err) {
        setErrorAcceso("Fallo crítico al conectar con la base de datos.");
      } finally {
        setCargando(false);
      }
    };

    obtenerPedidosAdmin();
  }, [token]);

  // --- NUEVO: FUNCIÓN PARA MUTAR EL ESTADO DEL PEDIDO (TFG: Fase 2) ---
  // Esta función se comunica con el endpoint PUT que creamos en el backend
  const cambiarEstado = async (pedidoId: number, nuevoEstado: string) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/admin/pedidos/${pedidoId}/estado`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // Enviamos el payload exigido por EstadoPedidoUpdate en FastAPI
          body: JSON.stringify({ estado: nuevoEstado }),
        },
      );

      if (res.ok) {
        // Actualización optimista: cambiamos el estado en el array local de React
        // para que la interfaz se actualice al instante sin hacer otra petición GET
        setPedidos(
          pedidos.map((p) =>
            p.id === pedidoId ? { ...p, estado: nuevoEstado } : p,
          ),
        );
      } else {
        alert("Error al actualizar el estado en la base de datos.");
      }
    } catch (error) {
      alert("Error de conexión al intentar actualizar el pedido.");
    }
  };

  // --- NUEVO: HELPER VISUAL PARA LOS ESTADOS ---
  // Devuelve clases de Tailwind dinámicas basadas en la fase del pedido
  const getColorEstado = (estado: string) => {
    switch (estado) {
      case "pendiente_pago":
        return "bg-red-100 text-red-700 border-red-200";
      case "en_preparacion":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "en_reparto":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "completado":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  // Cálculos de métricas para el Dashboard
  const ingresosTotales = pedidos.reduce((sum, p) => sum + Number(p.total), 0);
  const pedidosPendientes = pedidos.filter(
    (p) => p.estado === "pendiente_pago",
  ).length;

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-xl font-semibold text-slate-400 animate-pulse">
          Verificando credenciales de seguridad...
        </p>
      </div>
    );
  }

  if (errorAcceso) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full border-t-8 border-red-500">
          <span className="text-6xl mb-4 block">🛡️</span>
          <h1 className="text-2xl font-black text-slate-900 mb-2">
            Área Restringida
          </h1>
          <p className="text-slate-500 mb-6">{errorAcceso}</p>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors"
          >
            ← Volver a la Tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Panel de Control
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Gestión centralizada de pedidos CaterChef Fusión
            </p>
          </div>
          <Link
            href="/"
            className="bg-white text-slate-700 font-bold px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors shadow-sm text-sm"
          >
            ← Volver a la web pública
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-blue-100 p-4 rounded-xl text-blue-600 text-2xl">
              📦
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                Total Pedidos
              </p>
              <p className="text-3xl font-black text-slate-900">
                {pedidos.length}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-emerald-100 p-4 rounded-xl text-emerald-600 text-2xl">
              💶
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                Ingresos Brutos
              </p>
              <p className="text-3xl font-black text-slate-900">
                {ingresosTotales.toFixed(2)}€
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-amber-100 p-4 rounded-xl text-amber-600 text-2xl">
              ⏳
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                Pendientes de Pago
              </p>
              <p className="text-3xl font-black text-slate-900">
                {pedidosPendientes}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">
              Historial de Operaciones
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4 font-bold">Ticket</th>
                  <th className="px-6 py-4 font-bold">Fecha de Evento</th>
                  <th className="px-6 py-4 font-bold">Logística (Destino)</th>
                  <th className="px-6 py-4 font-bold">Contacto</th>
                  <th className="px-6 py-4 font-bold text-right">Total</th>
                  {/* --- MODIFICADO: Nueva columna para gestionar estados --- */}
                  <th className="px-6 py-4 font-bold text-center">
                    Estado / Operativa
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {pedidos.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-slate-400 font-medium"
                    >
                      Aún no hay pedidos registrados en la base de datos.
                    </td>
                  </tr>
                ) : (
                  pedidos.map((pedido) => (
                    <tr
                      key={pedido.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-black text-slate-900">
                          #{pedido.id}
                        </span>
                        {pedido.usuario_id ? (
                          <span className="block text-xs font-bold text-emerald-600 mt-1">
                            Registrado
                          </span>
                        ) : (
                          <span className="block text-xs font-bold text-slate-400 mt-1">
                            Invitado
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {new Date(pedido.fecha_servicio).toLocaleString(
                          "es-ES",
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          },
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">
                          {pedido.ciudad}{" "}
                          <span className="font-normal text-slate-500">
                            ({pedido.distrito})
                          </span>
                        </p>
                        <p className="text-slate-500 text-xs mt-0.5 truncate max-w-50">
                          {pedido.direccion_calle}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        📞 {pedido.telefono}
                      </td>
                      <td className="px-6 py-4 font-black text-slate-900 text-right text-lg">
                        {Number(pedido.total).toFixed(2)}€
                      </td>
                      {/* --- NUEVO: Celda interactiva con selector de estados --- */}
                      <td className="px-6 py-4 text-center">
                        <select
                          value={pedido.estado}
                          onChange={(e) =>
                            cambiarEstado(pedido.id, e.target.value)
                          }
                          className={`border outline-none text-xs font-bold rounded-lg block w-full p-2.5 cursor-pointer appearance-none text-center ${getColorEstado(pedido.estado)} hover:opacity-80 transition-opacity`}
                        >
                          <option value="pendiente_pago">
                            Pendiente / Recibido
                          </option>
                          <option value="en_preparacion">
                            👨‍🍳 En Preparación
                          </option>
                          <option value="en_reparto">🛵 En Reparto</option>
                          <option value="completado">✅ Completado</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
