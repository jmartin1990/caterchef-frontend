// src/app/page.tsx
// 1. "use client" le dice a Next.js que este componente interactúa en tiempo real con el usuario en el navegador.
"use client";

import { useEffect, useState, SyntheticEvent } from "react";
import Link from "next/link";
// --- CONSUMO DEL CONTEXTO DE SEGURIDAD (TFG: Control de Sesión Global) ---
import { useAuth } from "@/context/AuthContext";

// 2. INTERFACES TYPESCRIPT: Estructura exacta de las entidades mapeadas con Neon.
interface Plato {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  alergenos: string;
  disponible: boolean;
}

interface ItemCarrito {
  plato: Plato;
  cantidad: number;
}

// --- MAPEO DE DISTRITOS DE REPARTO OFICIALES DE LA EMPRESA (TFG: Reglas de Negocio Dinámicas) ---
const ZONAS_REPARTO: Record<string, string[]> = {
  Madrid: [
    "Arganzuela",
    "Barajas",
    "Carabanchel",
    "Centro",
    "Chamartín",
    "Chamberí",
    "Ciudad Lineal",
    "Fuencarral-El Pardo",
    "Hortaleza",
    "Latina",
    "Moncloa-Aravaca",
    "Moratalaz",
    "Puente de Vallecas",
    "Retiro",
    "Salamanca",
    "San Blas-Canillejas",
    "Tetuán",
    "Usera",
    "Vicálvaro",
    "Villa de Vallecas",
    "Villaverde",
  ],
  Toledo: [
    "Casco Histórico",
    "Santa María de Benquerencia (Polígono)",
    "Santa Bárbara",
    "Azucaica",
    "Distrito Norte (Buenavista / Vistahermosa)",
  ],
};

export default function Home() {
  // 3. ESTADOS BASE
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [cargando, setCargando] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState<string>("Todas");

  // ESTADOS AVISOS
  const [platoParaAviso, setPlatoParaAviso] = useState<Plato | null>(null);
  const [emailAviso, setEmailAviso] = useState("");

  // ESTADOS GESTIÓN DEL CARRITO
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [pasoCarrito, setPasoCarrito] = useState<1 | 2>(1); // 1: Desglose, 2: Formulario de Envío

  // Control de hidratación para LocalStorage
  const [estaMontado, setEstaMontado] = useState(false);

  // Extraemos la reactividad global y el Token directamente del AuthContext
  const { token, estaLogueado, iniciarSesion, cerrarSesion } = useAuth();

  const [mostrarModalAuth, setMostrarModalAuth] = useState(false);
  const [platoPendiente, setPlatoPendiente] = useState<Plato | null>(null);
  const [vistaAuth, setVistaAuth] = useState<
    "login" | "registro" | "recuperar"
  >("registro");
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false); // Checkbox de protección de datos
  const [authFormData, setAuthFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    password: "",
    telefono: "", // Guardado en base de datos al registrarse
  });

  // --- NUEVOS ESTADOS COMPLEMENTARIOS (TFG: Control de Roles y Flujo Multiusuario) ---
  const [perfilUsuario, setPerfilUsuario] = useState<{
    nombre: string;
    apellidos: string;
    rol: string;
    es_primera_compra: boolean;
  } | null>(null);
  const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);

  // --- ESTADO DEL FORMULARIO DE PEDIDOS (TFG: DTO de Envío Relacional Unificado) ---
  const [pedidoFormData, setPedidoFormData] = useState({
    tipo_servicio: "Catering Completo",
    fecha_servicio: "",
    direccion_calle: "",
    ciudad: "Madrid", // Inicializado por defecto en Madrid
    provincia: "Madrid", // Se mantendrá siempre idéntica a la ciudad para el backend
    distrito: ZONAS_REPARTO["Madrid"][0], // Toma el primer distrito disponible dinámicamente
    codigo_postal: "",
    telefono: "", // Teléfono para el repartidor en este pedido específico
    notas_cliente: "",
  });

  // --- EFECTO REACTIVO PARA CARGAR LA INFORMACIÓN COMPLETA DEL PERFIL ---
  useEffect(() => {
    if (token) {
      fetch("http://127.0.0.1:8000/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setPerfilUsuario(data);
        })
        .catch((err) =>
          console.error("Error al cargar la sesión activa:", err),
        );
    } else {
      setPerfilUsuario(null);
    }
  }, [token]);

  // --- EFECTO DE SINCRONIZACIÓN REACTIVA DE DISTRITOS ---
  useEffect(() => {
    const ciudadActual = pedidoFormData.ciudad;
    setPedidoFormData((prev) => ({
      ...prev,
      provincia: ciudadActual, // Garantiza consistencia en las restricciones CHECK de Neon
      distrito: ZONAS_REPARTO[ciudadActual][0], // Reinicia al primer barrio de la nueva lista
    }));
  }, [pedidoFormData.ciudad]);

  // --- PERSISTENCIA LOCAL DEL CARRITO (TFG: Tolerancia a fallos por refresco F5) ---
  useEffect(() => {
    const carritoGuardado = localStorage.getItem("carrito_caterchef");
    if (carritoGuardado) {
      try {
        setCarrito(JSON.parse(carritoGuardado));
      } catch (e) {
        console.error("Error al recuperar el carrito desde localStorage", e);
      }
    }
    setEstaMontado(true); // Control de renderizado del lado del cliente finalizado
  }, []);

  useEffect(() => {
    if (estaMontado) {
      localStorage.setItem("carrito_caterchef", JSON.stringify(carrito));
    }
  }, [carrito, estaMontado]);

  // --- FUNCIÓN DE CIERRE DE SESIÓN SEGURO (TFG: Limpieza de Caché y Privacidad de Sesión) ---
  const manejarCerrarSesion = () => {
    cerrarSesion(); // Borra el token JWT del proveedor global de React
    setCarrito([]); // Destruye el carrito en memoria para evitar filtraciones visuales
    localStorage.removeItem("carrito_caterchef"); // Limpia el disco del navegador por privacidad
    setPasoCarrito(1); // Devuelve el wizard al paso inicial
    setPerfilUsuario(null);
    alert("Sesión cerrada. El carrito local se ha eliminado por seguridad.");
  };

  // 4. EL CONECTOR (useEffect): Carga inicial desde FastAPI
  useEffect(() => {
    const obtenerPlatos = async () => {
      try {
        const respuesta = await fetch("http://127.0.0.1:8000/api/platos");
        const datos = await respuesta.json();
        setPlatos(datos);
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerPlatos();
  }, []);

  const categoriesUnicas = [
    "Todas",
    ...new Set(platos.map((plato) => plato.categoria)),
  ];
  const platosMostrados =
    categoriaActiva === "Todas"
      ? platos
      : platos.filter((plato) => plato.categoria === categoriaActiva);

  // INTERCEPTOR CONTROLADOR DE COMPRA
  const intentarAgregarAlCarrito = (plato: Plato) => {
    if (estaLogueado) {
      agregarAlCarrito(plato);
    } else {
      setPlatoPendiente(plato);
      setMostrarModalAuth(true); // Incitación comercial al registro
    }
  };

  const continuarComoInvitado = () => {
    if (mostrarCarrito) {
      setPasoCarrito(2);
    } else if (platoPendiente) {
      agregarAlCarrito(platoPendiente);
    }
    setMostrarModalAuth(false);
    setPlatoPendiente(null);
  };

  // MANEJADOR DE AUTENTICACIÓN ASÍNCRONA
  const manejarSubmitAuth = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    // --- FLUJO: PROCESAR SOLICITUD DE RESTABLECIMIENTO ---
    if (vistaAuth === "recuperar") {
      try {
        const respuesta = await fetch(
          "http://127.0.0.1:8000/api/recuperar-password",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: authFormData.email }),
          },
        );

        if (respuesta.ok) {
          alert(
            "🔑 [Modo TFG / Auditoría SMTP]: Correo electrónico verificado en Neon DB. Se ha enviado un token temporal a su bandeja de entrada.",
          );
          setVistaAuth("login"); // Redirige al login para reintentar la entrada
        } else {
          const err = await respuesta.json();
          alert(`Error: ${err.detail}`);
        }
      } catch (error) {
        alert("Fallo al conectar con el protocolo de seguridad.");
      }
      return;
    }

    // Verificación obligatoria de ciberseguridad / normativa de datos en registro
    if (vistaAuth === "registro" && !aceptaPrivacidad) {
      alert(
        "Debes aceptar la Política de Privacidad para registrar tu cuenta.",
      );
      return;
    }

    try {
      if (vistaAuth === "registro") {
        const respuesta = await fetch("http://127.0.0.1:8000/api/registro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // --- MODIFICADO: Sincroniza la conformidad legal explícita con los campos mapeados de Neon ---
          body: JSON.stringify({
            ...authFormData,
            acepta_privacidad: aceptaPrivacidad,
          }),
        });

        if (respuesta.ok) {
          const datos = await respuesta.json();
          iniciarSesion(datos.access_token);
          alert("¡Perfil creado con éxito! Disfruta de tu 5% de descuento.");
          if (platoPendiente) agregarAlCarrito(platoPendiente);
          setMostrarModalAuth(false);
          setPlatoPendiente(null);
          if (mostrarCarrito) setPasoCarrito(2);
        } else {
          const error = await respuesta.json();
          alert(`Error en el registro: ${error.detail || "Datos inválidos."}`);
        }
      } else {
        const params = new URLSearchParams();
        params.append("username", authFormData.email);
        params.append("password", authFormData.password);

        const respuesta = await fetch("http://127.0.0.1:8000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params,
        });

        if (respuesta.ok) {
          const datos = await respuesta.json();
          iniciarSesion(datos.access_token);
          alert("¡Sesión iniciada correctamente!");
          if (platoPendiente) agregarAlCarrito(platoPendiente);
          setMostrarModalAuth(false);
          setPlatoPendiente(null);
          if (mostrarCarrito) setPasoCarrito(2);
        } else {
          alert("Credenciales incorrectas o cuenta inactiva.");
        }
      }
    } catch (error) {
      console.error("Error en la autenticación:", error);
      alert("No se pudo establecer comunicación segura con el servidor.");
    }
  };

  // --- MASTER ENVIAR CHECKOUT REAL ---
  const manejarSubmitPedido = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const itemsPayload = carrito.map((item) => ({
      plato_id: item.plato.id,
      amount: item.cantidad,
      precio_unitario: item.plato.precio,
    }));

    const payload = {
      ...pedidoFormData,
      total: totalPrecioFinal,
      items: itemsPayload,
    };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const respuesta = await fetch("http://127.0.0.1:8000/api/pedidos", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
      });

      if (respuesta.ok) {
        const resultado = await respuesta.json();
        alert(
          `¡Pedido procesado con éxito! Código de ticket: #${resultado.pedido_id}.`,
        );

        setCarrito([]);
        setMostrarCarrito(false);
        setPasoCarrito(1);
        localStorage.removeItem("carrito_caterchef");

        // Refrescamos los datos del perfil para recalcular si sigue aplicando el descuento
        if (token) {
          const resMe = await fetch("http://127.0.0.1:8000/api/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (resMe.ok) {
            const dataMe = await resMe.json();
            setPerfilUsuario(dataMe);
          }
        }

        setPedidoFormData({
          tipo_servicio: "Catering Completo",
          fecha_servicio: "",
          direccion_calle: "",
          ciudad: "Madrid",
          provincia: "Madrid",
          distrito: ZONAS_REPARTO["Madrid"][0],
          codigo_postal: "",
          telefono: "",
          notas_cliente: "", // Sincronizado correctamente
        });
      } else {
        const errorData = await respuesta.json();
        alert(`Fallo en la transacción: ${errorData.detail}`);
      }
    } catch (error) {
      alert("Error crítico de comunicación con el servidor.");
    }
  };

  // OPERACIONES DEL CARRITO
  const agregarAlCarrito = (plato: Plato) => {
    setCarrito((carritoActual) => {
      const itemExistente = carritoActual.find(
        (item) => item.plato.id === plato.id,
      );
      if (itemExistente) {
        return carritoActual.map((item) =>
          item.plato.id === plato.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }
      return [...carritoActual, { plato, cantidad: 1 }];
    });
  };

  const quitarDelCarrito = (idPlato: number) => {
    setCarrito((carritoActual) => {
      const nuevoCarrito = carritoActual.filter(
        (item) => item.plato.id !== idPlato,
      );
      if (nuevoCarrito.length === 0) setPasoCarrito(1);
      return nuevoCarrito;
    });
  };

  // --- CÓMPUTOS DERIVADOS CON LÓGICA DE COSTES DE ENVÍO Y DESCUENTO LIMITADO (TFG: Inteligencia de Negocio) ---
  const totalPrecioBase = carrito.reduce(
    (total, item) => total + item.plato.precio * item.cantidad,
    0,
  );
  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);

  // El descuento del 5% se condiciona estrictamente a que el usuario esté logueado Y sea su primera compra real
  const aplicaDescuento = estaLogueado && perfilUsuario?.es_primera_compra;
  const descuentoFidelidad = aplicaDescuento ? totalPrecioBase * 0.05 : 0;
  const subtotalConDescuento = totalPrecioBase - descuentoFidelidad;

  // El coste de envío base es 4.90€. Si se alcanzan o superan los 80€, el envío pasa a ser gratuito
  const costoEnvio = totalPrecioBase >= 80 ? 0 : 4.9;
  const totalPrecioFinal = subtotalConDescuento + costoEnvio;

  const manejarEnvioAviso = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!platoParaAviso) return;
    try {
      const respuesta = await fetch("http://127.0.0.1:8000/api/lista-espera", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plato_id: platoParaAviso.id,
          email_usuario: emailAviso,
        }),
      });
      if (respuesta.ok) {
        alert("¡Anotado! Te avisaremos en cuanto vuelva a estar disponible.");
        setPlatoParaAviso(null);
        setEmailAviso("");
      }
    } catch (error) {
      console.error("Error al enviar el aviso:", error);
    }
  };

  if (cargando)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-semibold text-amber-600 animate-pulse">
          Encendiendo los fogones de CaterChef Fusión...
        </p>
      </div>
    );

  return (
    <main className="min-h-screen p-10 bg-slate-50 text-slate-800 font-sans relative pb-32">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center relative flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-6 flex-wrap gap-4">
            {/* --- MODIFICADO: MENÚ DESPLEGABLE DE AVATAR VINCULADO CON ENRUTAMIENTO A LA EXTRANET COMPLETA (TFG) --- */}
            <div className="text-left flex items-center gap-4 relative">
              {estaLogueado && perfilUsuario ? (
                <div className="relative">
                  <button
                    onClick={() => setMostrarMenuUsuario(!mostrarMenuUsuario)}
                    className="flex items-center gap-3 bg-white border border-slate-200 pl-2 pr-4 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all outline-none"
                  >
                    <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm uppercase tracking-wider">
                      {perfilUsuario.nombre.charAt(0)}
                      {perfilUsuario.apellidos
                        ? perfilUsuario.apellidos.charAt(0)
                        : ""}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-xs font-bold text-slate-800 leading-none">
                        Mi Cuenta ▾
                      </span>
                      {perfilUsuario.es_primera_compra && (
                        <span className="text-[10px] text-emerald-600 font-bold leading-none mt-1">
                          🎁 5% Activado
                        </span>
                      )}
                    </div>
                  </button>

                  {mostrarMenuUsuario && (
                    <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 animate-fade-in">
                      <div className="px-4 py-2 border-b border-slate-50 mb-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Usuario
                        </p>
                        <p className="text-sm font-black text-slate-800 truncate">
                          {perfilUsuario.nombre} {perfilUsuario.apellidos}
                        </p>
                      </div>

                      {/* --- NUEVO: Enrutamiento seguro hacia el Historial de pedidos y chef privado (Extranet) --- */}
                      <Link
                        href="/perfil/compras"
                        onClick={() => setMostrarMenuUsuario(false)}
                        className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-amber-600 transition-colors font-medium"
                      >
                        📋 Mis compras
                      </Link>

                      {/* --- NUEVO: Enrutamiento al formulario de edición de datos personales (Extranet) --- */}
                      <Link
                        href="/perfil/cuenta"
                        onClick={() => setMostrarMenuUsuario(false)}
                        className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-amber-600 transition-colors font-medium"
                      >
                        👤 Mi cuenta
                      </Link>

                      {perfilUsuario.rol === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setMostrarMenuUsuario(false)}
                          className="block px-4 py-2 text-sm font-bold text-amber-600 hover:bg-amber-50 transition-colors border-t border-slate-50 mt-1"
                        >
                          ⚙️ Panel Admin
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setMostrarMenuUsuario(false);
                          manejarCerrarSesion();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 font-bold transition-colors border-t border-slate-50 mt-1"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setVistaAuth("login");
                    setMostrarModalAuth(true);
                  }}
                  className="text-sm font-bold text-amber-700 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200 shadow-sm hover:bg-amber-100 transition"
                >
                  Iniciar Sesión
                </button>
              )}
            </div>

            <Link
              href="/reservas"
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-md flex items-center gap-2"
            >
              👨‍🍳 Solicitar Chef Privado
            </Link>
          </div>

          <h1 className="text-5xl font-black mb-4 text-slate-900 tracking-tight">
            Nuestra Carta Fusión
          </h1>
          <p className="text-lg text-slate-500 font-medium mb-8">
            Conectado en tiempo real con FastAPI y Neon DB
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categoriesUnicas.map((categoria) => (
              <button
                key={categoria}
                onClick={() => setCategoriaActiva(categoria)}
                className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 ${categoriaActiva === categoria ? "bg-slate-900 text-white shadow-md scale-105" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900"}`}
              >
                {categoria}
              </button>
            ))}
          </div>
        </header>

        {/* LISTADO DE PLATOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {platosMostrados.map((plato) => (
            <div
              key={plato.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                  {plato.categoria}
                </span>
                <h2 className="text-2xl font-bold mt-5 mb-3 text-slate-800 leading-tight">
                  {plato.nombre}
                </h2>
                <p className="text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                  {plato.descripcion}
                </p>
                <p className="text-sm text-slate-400 mb-6 font-medium bg-slate-50 inline-block px-2 py-1 rounded">
                  Alérgenos: {plato.alergenos}
                </p>
              </div>

              <div className="flex justify-between items-center pt-5 border-t border-slate-100 mt-auto">
                <span className="text-3xl font-black text-slate-900">
                  {plato.precio}€
                </span>
                {plato.disponible ? (
                  <button
                    onClick={() => intentarAgregarAlCarrito(plato)}
                    className="bg-slate-900 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-800 active:scale-95 transition-all shadow-md"
                  >
                    Añadir +
                  </button>
                ) : (
                  <button
                    onClick={() => setPlatoParaAviso(plato)}
                    className="bg-orange-100 text-orange-700 font-bold px-5 py-2.5 rounded-xl hover:bg-orange-200 transition-colors shadow-sm ring-1 ring-orange-300"
                  >
                    ¡Avísame!
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {totalItems > 0 && (
        <button
          onClick={() => setMostrarCarrito(true)}
          className="fixed bottom-8 right-8 z-30 bg-amber-500 hover:bg-amber-600 text-white px-6 py-4 rounded-full shadow-2xl font-bold text-lg flex items-center gap-3 transition-transform hover:scale-105"
        >
          <span>🛒 Tu Pedido ({totalItems})</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">
            {totalPrecioFinal.toFixed(2)}€
          </span>
        </button>
      )}

      {/* --- MODAL DE CARRITO MULTIPASO --- */}
      {mostrarCarrito && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl max-h-[90vh] flex flex-col animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-black text-slate-900">
                {pasoCarrito === 1 ? "Tu Pedido" : "Datos de Entrega"}
              </h3>
              <button
                onClick={() => {
                  setMostrarCarrito(false);
                  setPasoCarrito(1);
                }}
                className="text-slate-400 hover:text-slate-800 text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            {pasoCarrito === 1 ? (
              <>
                <div className="overflow-y-auto pr-2 mb-6 space-y-4 flex-1">
                  {carrito.map((item) => (
                    <div
                      key={item.plato.id}
                      className="flex justify-between items-center border-b border-slate-100 pb-4"
                    >
                      <div>
                        <h4 className="font-bold text-slate-800">
                          {item.plato.nombre}
                        </h4>
                        <p className="text-sm text-slate-500">
                          Cantidad: {item.cantidad} x {item.plato.precio}€
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-black text-lg text-slate-900">
                          {(item.plato.precio * item.cantidad).toFixed(2)}€
                        </span>
                        <button
                          onClick={() => quitarDelCarrito(item.plato.id)}
                          className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-slate-900 pt-4 space-y-2">
                  <div className="flex justify-between items-center text-sm text-slate-600 font-medium">
                    <span>Subtotal comida</span>
                    <span>{totalPrecioBase.toFixed(2)}€</span>
                  </div>

                  {aplicaDescuento && (
                    <div className="flex justify-between items-center text-sm text-emerald-600 font-bold">
                      <span>Descuento Fidelidad (5%)</span>
                      <span>-{descuentoFidelidad.toFixed(2)}€</span>
                    </div>
                  )}

                  <div className="flex flex-col border-b border-slate-100 pb-2">
                    <div className="flex justify-between items-center text-sm text-slate-600 font-medium">
                      <span>Gastos de envío</span>
                      <span>
                        {costoEnvio === 0
                          ? "GRATIS"
                          : `${costoEnvio.toFixed(2)}€`}
                      </span>
                    </div>
                    {costoEnvio > 0 && (
                      <p className="text-[11px] text-amber-600 font-semibold mt-0.5 text-right animate-pulse">
                        💡 ¡Añade {(80 - totalPrecioBase).toFixed(2)}€ más para
                        conseguir envío GRATIS!
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-2 mb-4">
                    <span className="text-xl font-medium text-slate-600">
                      Total a Pagar
                    </span>
                    <span className="text-4xl font-black text-amber-600">
                      {totalPrecioFinal.toFixed(2)}€
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (!estaLogueado) {
                        setVistaAuth("login");
                        setMostrarModalAuth(true);
                      } else {
                        setPasoCarrito(2);
                      }
                    }}
                    className="w-full bg-slate-900 text-white font-bold text-xl py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
                  >
                    Siguiente: Datos de Envío →
                  </button>
                </div>
              </>
            ) : (
              <form
                onSubmit={manejarSubmitPedido}
                className="space-y-4 overflow-y-auto flex-1 pr-2"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Tipo de Servicio
                    </label>
                    <select
                      value={pedidoFormData.tipo_servicio}
                      onChange={(e) =>
                        setPedidoFormData({
                          ...pedidoFormData,
                          tipo_servicio: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-amber-500 bg-white text-sm font-medium"
                    >
                      <option>Catering Completo</option>
                      <option>Sólo Comida (Entrega)</option>
                      <option>Cóctel / Evento Corporativo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Fecha y Hora del Evento
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={pedidoFormData.fecha_servicio}
                      onChange={(e) =>
                        setPedidoFormData({
                          ...pedidoFormData,
                          fecha_servicio: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Ciudad de Entrega
                    </label>
                    <select
                      value={pedidoFormData.ciudad}
                      onChange={(e) =>
                        setPedidoFormData({
                          ...pedidoFormData,
                          ciudad: e.target.value,
                          provincia: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-amber-500 bg-white text-sm font-medium"
                    >
                      <option value="Madrid">Madrid (21 Distritos)</option>
                      <option value="Toledo">Toledo (5 Distritos)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Distrito / Zona de Cobertura
                    </label>
                    <select
                      value={pedidoFormData.distrito}
                      onChange={(e) =>
                        setPedidoFormData({
                          ...pedidoFormData,
                          distrito: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-amber-500 bg-white text-sm font-medium"
                    >
                      {ZONAS_REPARTO[pedidoFormData.ciudad].map((barrio) => (
                        <option key={barrio} value={barrio}>
                          {barrio}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Dirección de Entrega (Calle, número, portal, piso)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Calle Gran Vía, 12, 4ºB"
                      value={pedidoFormData.direccion_calle}
                      onChange={(e) =>
                        setPedidoFormData({
                          ...pedidoFormData,
                          direccion_calle: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Código Postal
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: 28013"
                      value={pedidoFormData.codigo_postal}
                      //  Código Corregido con la sintaxis de propagación correcta
                      onChange={(e) =>
                        setPedidoFormData((prev) => ({
                          ...prev,
                          codigo_postal: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Teléfono Móvil de Contacto Urgente
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej: 612345678"
                    value={pedidoFormData.telefono}
                    onChange={(e) =>
                      setPedidoFormData({
                        ...pedidoFormData,
                        telefono: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Notas especiales o Alérgenos (Opcional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ej: Dos invitados son celíacos..."
                    value={pedidoFormData.notas_cliente}
                    onChange={(e) =>
                      setPedidoFormData({
                        ...pedidoFormData,
                        notas_cliente: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-amber-500 text-sm resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setPasoCarrito(1)}
                    className="w-1/3 bg-slate-100 text-slate-600 font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-colors text-sm"
                  >
                    ← Volver
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 bg-amber-500 text-white font-black py-3.5 rounded-xl hover:bg-amber-600 transition-colors shadow-md text-sm uppercase tracking-wider"
                  >
                    Confirmar ({totalPrecioFinal.toFixed(2)}€)
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL DE ACCESO --- */}
      {mostrarModalAuth && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative border-t-8 border-amber-500">
            <button
              onClick={continuarComoInvitado}
              className="absolute top-4 right-5 text-slate-400 hover:text-slate-800 text-3xl font-light"
            >
              &times;
            </button>
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">
                {vistaAuth === "registro"
                  ? "🎁"
                  : vistaAuth === "login"
                    ? "🔑"
                    : "🔒"}
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                {vistaAuth === "registro" && "Activa tu 5% Directo"}
                {vistaAuth === "login" && "Ingresar a CaterChef"}
                {vistaAuth === "recuperar" && "Recuperar Contraseña"}
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                {vistaAuth === "registro" &&
                  "Identifícate para guardar tu historial y aplicar ventajas."}
                {vistaAuth === "login" &&
                  "Introduce tus credenciales para acceder a tu perfil."}
                {vistaAuth === "recuperar" &&
                  "Introduce tu email para restablecer la contraseña de tu cuenta."}
              </p>
            </div>

            {vistaAuth !== "recuperar" && (
              <div className="flex border-b border-slate-200 mb-6">
                <button
                  type="button"
                  onClick={() => setVistaAuth("registro")}
                  className={`flex-1 pb-3 font-bold transition-colors ${vistaAuth === "registro" ? "border-b-2 border-amber-500 text-amber-600" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Soy Nuevo
                </button>
                <button
                  type="button"
                  onClick={() => setVistaAuth("login")}
                  className={`flex-1 pb-3 font-bold transition-colors ${vistaAuth === "login" ? "border-b-2 border-amber-500 text-amber-600" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Ya tengo cuenta
                </button>
              </div>
            )}

            <form onSubmit={manejarSubmitAuth} className="space-y-4">
              {vistaAuth === "registro" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Nombre"
                      required
                      value={authFormData.nombre}
                      onChange={(e) =>
                        setAuthFormData({
                          ...authFormData,
                          nombre: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Apellidos"
                      value={authFormData.apellidos}
                      onChange={(e) =>
                        setAuthFormData({
                          ...authFormData,
                          apellidos: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder="Número de Teléfono Móvil"
                    required
                    value={authFormData.telefono}
                    onChange={(e) =>
                      setAuthFormData({
                        ...authFormData,
                        telefono: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </>
              )}

              <input
                type="email"
                placeholder="Correo electrónico"
                required
                value={authFormData.email}
                onChange={(e) =>
                  setAuthFormData({ ...authFormData, email: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />

              {vistaAuth !== "recuperar" && (
                <>
                  <input
                    type="password"
                    placeholder="Contraseña (Mín. 6)"
                    required
                    minLength={6}
                    value={authFormData.password}
                    onChange={(e) =>
                      setAuthFormData({
                        ...authFormData,
                        password: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                  {vistaAuth === "login" && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => setVistaAuth("recuperar")}
                        className="text-xs text-slate-400 hover:text-amber-600 underline font-medium transition-colors"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                  )}
                </>
              )}

              {vistaAuth === "registro" && (
                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="privacidad"
                    required
                    checked={aceptaPrivacidad}
                    onChange={(e) => setAceptaPrivacidad(e.target.checked)}
                    className="mt-1 accent-amber-500 shadow-sm"
                  />
                  <label
                    htmlFor="privacidad"
                    className="text-xs text-slate-500 leading-snug select-none"
                  >
                    He leído y acepto la{" "}
                    <Link
                      href="/privacidad"
                      target="_blank"
                      className="text-amber-600 font-bold underline hover:text-amber-700 transition-colors"
                    >
                      Política de Privacidad
                    </Link>
                    .
                  </label>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 shadow-md mt-4 transition-all"
              >
                {vistaAuth === "registro" && "Crear Perfil y Aplicar Descuento"}
                {vistaAuth === "login" && "Entrar a mi Perfil"}
                {vistaAuth === "recuperar" &&
                  "Enviar Instrucciones Secundarias"}
              </button>

              {vistaAuth === "recuperar" && (
                <button
                  type="button"
                  onClick={() => setVistaAuth("login")}
                  className="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-bold underline mt-2 block transition-colors"
                >
                  ← Volver al inicio de sesión
                </button>
              )}
            </form>
            <button
              onClick={continuarComoInvitado}
              className="w-full text-slate-500 font-semibold py-3 mt-2 hover:text-slate-800 transition-colors text-sm"
            >
              {mostrarCarrito
                ? "Continuar con el Pedido (Como Invitado) →"
                : "Seguir como Invitado"}
            </button>
          </div>
        </div>
      )}

      {/* MODAL AVISOS */}
      {platoParaAviso && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-2">¿Te avisamos?</h3>
            <p className="text-slate-600 mb-6">
              Déjanos tu email y te enviaremos una notificación cuando el plato{" "}
              <strong className="text-slate-900">
                "{platoParaAviso.nombre}"
              </strong>{" "}
              vuelva a nuestra cocina.
            </p>
            <form onSubmit={manejarEnvioAviso}>
              <input
                type="email"
                required
                placeholder="tu@email.com"
                value={emailAviso}
                onChange={(e) => setEmailAviso(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPlatoParaAviso(null)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors shadow-md"
                >
                  Confirmar Aviso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
