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
    // --- MODIFICADO: CONTROL CONTRA CONDICIONES DE CARRERA (TFG: Seguridad e Hidratación) ---
    // Si el token es exactamente 'undefined', significa que AuthContext aún está leyendo LocalStorage.
    // Detenemos la ejecución temporalmente hasta que cambie a string o null.
    if (token === undefined) return;

    // Si el token es null tras la lectura, bloqueamos inmediatamente por falta de sesión
    if (!token) {
      setErrorAcceso("Debes iniciar sesión para acceder al panel.");
      setCargando(false);
      return;
    }

    const obtenerPedidosAdmin = async () => {
      setErrorAcceso(null); // Limpiamos errores previos antes del intento de fetch
      try {
        const respuesta = await fetch(
          "http://127.0.0.1:8000/api/admin/pedidos",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Inyección segura del token JWT
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
  }, [token]); // Sincronizado exclusivamente con la mutación del Token

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

  // Pantalla de bloqueo si un usuario normal intenta entrar
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
        {/* Cabecera del Dashboard */}
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

        {/* Tarjetas de Métricas Rápidas */}
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

        {/* Tabla de Datos Principal */}
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
                  <th className="px-6 py-4 font-bold">Tipo Servicio</th>
                  <th className="px-6 py-4 font-bold text-right">Total</th>
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
                      <td className="px-6 py-4">
                        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                          {pedido.tipo_servicio}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black text-slate-900 text-right text-lg">
                        {Number(pedido.total).toFixed(2)}€
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
