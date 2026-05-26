// src/app/carta/page.tsx
"use client";

import { useEffect, useState, SyntheticEvent, Suspense } from "react";
import { useSearchParams } from "next/navigation"; // --- CONSUMO DE QUERY PARAMS ---
import Link from "next/link";
// --- CONSUMO DEL CONTEXTO DE SEGURIDAD (TFG: Control de Sesión Global) ---
import { useAuth } from "@/context/AuthContext";
// --- CONSUMO DEL ESTADO REACTIVO DEL CARRITO GLOBAL (TFG: Persistencia Unificada) ---
import { useCart, Plato } from "@/context/CartContext";

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

// Horarios de entrega estándar
const HORAS_DISPONIBLES = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

function CartaContent() {
  const searchParams = useSearchParams(); // Captura los parámetros de la URL para el Mini-Cart del Navbar

  // ESTADOS BASE DEL CATÁLOGO
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [cargando, setCargando] = useState(true);

  // --- ESTADOS PARA EL SISTEMA DE DOBLE FILTRADO INTERACTIVO ---
  const [filtroCocina, setFiltroCocina] = useState<
    "fusion" | "peruana" | "espanola"
  >("fusion");
  const [categoriaActiva, setCategoriaActiva] = useState<string>("Todas");

  // --- ESTADO DE CONTROL DE VOLUMEN (Max 30 por unidad) ---
  const [cantidadesPrevia, setCantidadesPrevia] = useState<
    Record<number, number>
  >({});

  // ESTADOS GESTIÓN DE AVISOS DE STOCK
  const [platoParaAviso, setPlatoParaAviso] = useState<Plato | null>(null);
  const [emailAviso, setEmailAviso] = useState("");

  // --- INYECCIÓN DE OPERACIONES DEL CONTEXTO DEL CARRITO GLOBAL ---
  const {
    carrito,
    agregarAlCarrito,
    quitarDelCarrito,
    incrementarCantidad,
    decrementarCantidad,
    vaciarCarrito,
    totalItems,
    totalPrecioBase,
  } = useCart();

  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [pasoCarrito, setPasoCarrito] = useState<1 | 2>(1);

  // Extraemos la reactividad global y el Token directamente del AuthContext
  const { token, estaLogueado, iniciarSesion } = useAuth();

  const [mostrarModalAuth, setMostrarModalAuth] = useState(false);
  const [platoPendiente, setPlatoPendiente] = useState<Plato | null>(null);
  const [vistaAuth, setVistaAuth] = useState<
    "login" | "registro" | "recuperar"
  >("registro");
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false);
  const [authFormData, setAuthFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    password: "",
    telefono: "",
  });

  // --- ESTADOS COMPLEMENTARIOS PERFIL ---
  const [perfilUsuario, setPerfilUsuario] = useState<{
    nombre: string;
    apellidos: string;
    rol: string;
    es_primera_compra: boolean;
  } | null>(null);

  // --- ESTADO PARA BLOQUEO DE HORAS (Prevención de Concurrencia de Pedidos) ---
  const [horasOcupadas, setHorasOcupadas] = useState<string[]>([]);

  // --- DTO DE ENVÍO EXTENDIDO CON SOPORTE PARA INVITADOS (TFG: Normalización Estructurada) ---
  const [pedidoFormData, setPedidoFormData] = useState({
    tipo_servicio: "Catering Completo",
    fecha_servicio_dia: "",
    fecha_servicio_hora: HORAS_DISPONIBLES[0],
    direccion_calle: "",
    ciudad: "Madrid",
    provincia: "Madrid",
    distrito: ZONAS_REPARTO["Madrid"][0],
    codigo_postal: "",
    telefono: "",
    notas_cliente: "",
    nombre_invitado: "",
    apellidos_invitado: "",
    email_invitado: "",
  });

  // --- CÁLCULO DE MARGEN DE 24 HORAS PARA PREPARACIÓN (TFG: Logística) ---
  const fechaActual = new Date();
  fechaActual.setDate(fechaActual.getDate() + 1); // Sumamos 1 día (24h) de margen obligatorio
  const fechaMinimaPermitida = fechaActual.toISOString().split("T")[0];

  // --- EFECTO: Abre el carrito si detecta ?openCart=true en la URL ---
  useEffect(() => {
    const shouldOpen = searchParams.get("openCart");
    if (shouldOpen === "true") {
      setMostrarCarrito(true);
      setPasoCarrito(1);
    }
  }, [searchParams]);

  // --- EFECTO: CARGAR PERFIL ACTIVO CON LOCALHOST (Previene errores de CORS) ---
  useEffect(() => {
    if (token) {
      fetch("http://localhost:8000/api/me", {
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

  // --- EFECTO: SINCRONIZACIÓN REACTIVA DE DISTRITOS ---
  useEffect(() => {
    const ciudadActual = pedidoFormData.ciudad;
    setPedidoFormData((prev) => ({
      ...prev,
      provincia: ciudadActual,
      distrito: ZONAS_REPARTO[ciudadActual][0],
    }));
  }, [pedidoFormData.ciudad]);

  // --- EFECTO: CONSULTA DE HORARIOS OCUPADOS AL SELECCIONAR UNA FECHA ---
  useEffect(() => {
    if (pedidoFormData.fecha_servicio_dia) {
      fetch(
        `http://localhost:8000/api/horarios-ocupados?fecha=${pedidoFormData.fecha_servicio_dia}`,
      )
        .then((res) => (res.ok ? res.json() : { horas_ocupadas: [] }))
        .then((data) => {
          const ocupadas = data.horas_ocupadas || [];
          setHorasOcupadas(ocupadas);

          if (ocupadas.includes(pedidoFormData.fecha_servicio_hora)) {
            const primeraLibre = HORAS_DISPONIBLES.find(
              (h) => !ocupadas.includes(h),
            );
            if (primeraLibre) {
              setPedidoFormData((prev) => ({
                ...prev,
                fecha_servicio_hora: primeraLibre,
              }));
            }
          }
        })
        .catch(() => setHorasOcupadas([]));
    }
  }, [pedidoFormData.fecha_servicio_dia, pedidoFormData.fecha_servicio_hora]);

  // --- EFECTO: CONTROL DE CESTA VACÍA ---
  useEffect(() => {
    if (carrito.length === 0) {
      setMostrarCarrito(false);
      setPasoCarrito(1);
    }
  }, [carrito.length]);

  // --- EFECTO: CARGA INICIAL DESDE FASTAPI CON LOCALHOST ---
  useEffect(() => {
    const obtenerPlatos = async () => {
      try {
        const respuesta = await fetch("http://localhost:8000/api/platos");
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

  // --- EVALUACIÓN DEL DOBLE FILTRO EN CALIENTE ---
  const platosFiltrados = platos.filter((plato) => {
    let cumpleCocina = false;
    if (filtroCocina === "fusion")
      cumpleCocina = plato.id >= 1 && plato.id <= 6;
    if (filtroCocina === "peruana")
      cumpleCocina = plato.id >= 7 && plato.id <= 12;
    if (filtroCocina === "espanola")
      cumpleCocina = plato.id >= 13 && plato.id <= 18;

    const cumpleCategoria =
      categoriaActiva === "Todas" || plato.categoria === categoriaActiva;
    return cumpleCocina && cumpleCategoria;
  });

  const categoriasDisponibles = [
    "Todas",
    ...new Set(
      platos
        .filter((p) => {
          if (filtroCocina === "fusion") return p.id >= 1 && p.id <= 6;
          if (filtroCocina === "peruana") return p.id >= 7 && p.id <= 12;
          return p.id >= 13 && p.id <= 18;
        })
        .map((p) => p.categoria),
    ),
  ];

  const incrementarCantidadPrevia = (platoId: number) => {
    setCantidadesPrevia((prev) => ({
      ...prev,
      [platoId]: Math.min((prev[platoId] || 1) + 1, 30),
    }));
  };

  const decrementarCantidadPrevia = (platoId: number) => {
    setCantidadesPrevia((prev) => ({
      ...prev,
      [platoId]: Math.max((prev[platoId] || 1) - 1, 1),
    }));
  };

  // Interceptor al hacer click en "Añadir Cesta"
  const intentarAgregarAlCarrito = (e: SyntheticEvent, plato: Plato) => {
    e.preventDefault();
    const cantidadACargar = cantidadesPrevia[plato.id] || 1;
    if (estaLogueado) {
      agregarAlCarrito(plato, cantidadACargar);
    } else {
      setPlatoPendiente(plato);
      setMostrarModalAuth(true);
    }
  };

  const continuarComoInvitado = () => {
    if (platoPendiente) {
      const cantidadACargar = cantidadesPrevia[platoPendiente.id] || 1;
      agregarAlCarrito(platoPendiente, cantidadACargar);
      setMostrarCarrito(true);
      setPasoCarrito(1);
    }
    setMostrarModalAuth(false);
    setPlatoPendiente(null);
  };

  const manejarSubmitAuth = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (vistaAuth === "recuperar") {
      try {
        const respuesta = await fetch(
          "http://localhost:8000/api/recuperar-password",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: authFormData.email }),
          },
        );
        if (respuesta.ok) {
          alert("🔑 Enlace de recuperación enviado correctamente.");
          setVistaAuth("login");
        }
      } catch (error) {
        alert("Fallo de comunicación de seguridad.");
      }
      return;
    }

    if (vistaAuth === "registro" && !aceptaPrivacidad) {
      alert("Debes aceptar la Política de Privacidad.");
      return;
    }

    try {
      if (vistaAuth === "registro") {
        const respuesta = await fetch("http://localhost:8000/api/registro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...authFormData,
            acepta_privacidad: aceptaPrivacidad,
          }),
        });

        if (respuesta.ok) {
          const datos = await respuesta.json();
          iniciarSesion(datos.access_token);
          alert("¡Perfil creado! Disfruta de tu 5% de descuento.");
          if (platoPendiente) {
            const cantidadACargar = cantidadesPrevia[platoPendiente.id] || 1;
            agregarAlCarrito(platoPendiente, cantidadACargar);
          }
          setMostrarModalAuth(false);
          setPlatoPendiente(null);
          setMostrarCarrito(true);
          setPasoCarrito(1);
        }
      } else {
        const params = new URLSearchParams();
        params.append("username", authFormData.email);
        params.append("password", authFormData.password);

        const respuesta = await fetch("http://localhost:8000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params,
        });

        if (respuesta.ok) {
          const datos = await respuesta.json();
          iniciarSesion(datos.access_token);
          alert("Sesión iniciada.");
          if (platoPendiente) {
            const cantidadACargar = cantidadesPrevia[platoPendiente.id] || 1;
            agregarAlCarrito(platoPendiente, cantidadACargar);
          }
          setMostrarModalAuth(false);
          setPlatoPendiente(null);
          setMostrarCarrito(true);
          setPasoCarrito(1);
        } else {
          alert("Credenciales incorrectas.");
        }
      }
    } catch (error) {
      alert("Error en la conexión con el servidor.");
    }
  };

  const manejarSubmitPedido = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dateObjeto = new Date(pedidoFormData.fecha_servicio_dia);
    if (dateObjeto.getDay() === 0 || dateObjeto.getDay() === 6) {
      alert(
        "📅 Entregas disponibles únicamente de Lunes a Viernes laborables.",
      );
      return;
    }

    const itemsPayload = carrito.map((item) => ({
      plato_id: item.plato.id,
      amount: item.cantidad,
      precio_unitario: item.plato.precio,
    }));

    const datetimeFusionado = `${pedidoFormData.fecha_servicio_dia}T${pedidoFormData.fecha_servicio_hora}:00`;

    const payload = {
      items: itemsPayload,
      total: totalPrecioFinal,
      tipo_servicio: pedidoFormData.tipo_servicio,
      fecha_servicio: datetimeFusionado,
      direccion_calle: pedidoFormData.direccion_calle,
      provincia: pedidoFormData.provincia,
      ciudad: pedidoFormData.ciudad,
      distrito: pedidoFormData.distrito,
      telefono: pedidoFormData.telefono,
      codigo_postal: pedidoFormData.codigo_postal,
      notes_cliente: pedidoFormData.notas_cliente,
      nombre_invitado: !estaLogueado ? pedidoFormData.nombre_invitado : null,
      apellidos_invitado: !estaLogueado
        ? pedidoFormData.apellidos_invitado
        : null,
      email_invitado: !estaLogueado ? pedidoFormData.email_invitado : null,
    };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const respuesta = await fetch("http://localhost:8000/api/pedidos", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
      });

      if (respuesta.ok) {
        const resultado = await respuesta.json();
        alert(`¡Pedido procesado con éxito! Ticket: #${resultado.pedido_id}.`);
        vaciarCarrito();
        setMostrarCarrito(false);
        setPasoCarrito(1);
        setPedidoFormData({
          tipo_servicio: "Catering Completo",
          fecha_servicio_dia: "",
          fecha_servicio_hora: HORAS_DISPONIBLES[0],
          direccion_calle: "",
          ciudad: "Madrid",
          provincia: "Madrid",
          distrito: ZONAS_REPARTO["Madrid"][0],
          codigo_postal: "",
          telefono: "",
          notas_cliente: "",
          nombre_invitado: "",
          apellidos_invitado: "",
          email_invitado: "",
        });
      }
    } catch (error) {
      alert("Error crítico al procesar la compra.");
    }
  };

  // --- CÓMPUTOS DERIVADOS ---
  const aplicaDescuento = estaLogueado && perfilUsuario?.es_primera_compra;
  const descuentoFidelidad = aplicaDescuento ? totalPrecioBase * 0.05 : 0;
  const subtotalConDescuento = totalPrecioBase - descuentoFidelidad;
  const costoEnvio =
    totalPrecioBase === 0 ? 0 : totalPrecioBase >= 80 ? 0 : 4.9;
  const totalPrecioFinal =
    totalPrecioBase === 0 ? 0 : subtotalConDescuento + costoEnvio;

  const ComponenteListaCarritoEditable = () => (
    <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
      {carrito.map((item) => (
        <div
          key={item.plato.id}
          className="flex justify-between items-center border-b border-slate-100 pb-3"
        >
          <div className="w-2/5">
            <h4 className="font-bold text-slate-800 text-xs truncate">
              {item.plato.nombre}
            </h4>
            <p className="text-[10px] text-slate-400 font-mono">
              {Number(item.plato.precio).toFixed(2)}€/ud
            </p>
          </div>
          <div className="flex items-center border border-slate-200 rounded-lg bg-white p-0.5 font-mono">
            <button
              type="button"
              onClick={() => decrementarCantidad(item.plato.id)}
              className="px-2 text-xs font-black text-slate-400 hover:text-red-500 cursor-pointer"
            >
              -
            </button>
            <span className="px-1.5 text-xs font-black text-slate-700 w-5 text-center">
              {item.cantidad}
            </span>
            <button
              type="button"
              onClick={() => incrementarCantidad(item.plato.id)}
              className="px-2 text-xs font-black text-slate-400 hover:text-emerald-500 cursor-pointer"
            >
              +
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-black text-slate-900 font-mono text-xs">
              {(item.plato.precio * item.cantidad).toFixed(2)}€
            </span>
            <button
              type="button"
              onClick={() => quitarDelCarrito(item.plato.id)}
              className="text-red-400 hover:text-red-600 text-xs bg-red-50 p-1 rounded-md"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const manejarEnvioAviso = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!platoParaAviso) return;
    try {
      const respuesta = await fetch("http://localhost:8000/api/lista-espera", {
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
    <main className="min-h-screen p-6 md:p-10 bg-slate-50 text-slate-800 font-sans relative pb-32">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center flex flex-col items-center border-b border-slate-200 pb-8">
          <span className="text-amber-600 font-bold tracking-[0.2em] uppercase text-xs mb-2 block">
            Menú Gastronómico
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Nuestra Carta Gourmet
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Conectado en tiempo real con FastAPI y Neon DB
          </p>
        </header>

        {/* CONTROLES DE FILTRADO */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs mb-10 space-y-6 animate-fade-in">
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              1. Selecciona el estilo de cocina
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => {
                  setFiltroCocina("fusion");
                  setCategoriaActiva("Todas");
                }}
                className={`px-5 py-3.5 rounded-xl text-xs font-black tracking-wider uppercase border cursor-pointer ${filtroCocina === "fusion" ? "bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-200" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
              >
                🤝 Alta Cocina Fusión (Perú/España)
              </button>
              <button
                type="button"
                onClick={() => {
                  setFiltroCocina("peruana");
                  setCategoriaActiva("Todas");
                }}
                className={`px-5 py-3.5 rounded-xl text-xs font-black tracking-wider uppercase border cursor-pointer ${filtroCocina === "peruana" ? "bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-200" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
              >
                🇵🇪 Tradicional Peruana 100%
              </button>
              <button
                type="button"
                onClick={() => {
                  setFiltroCocina("espanola");
                  setCategoriaActiva("Todas");
                }}
                className={`px-5 py-3.5 rounded-xl text-xs font-black tracking-wider uppercase border cursor-pointer ${filtroCocina === "espanola" ? "bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-200" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
              >
                🇪🇸 Tradicional Española 100%
              </button>
            </div>
          </div>
          <div className="pt-5 border-t border-slate-100">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              2. Filtra por categoría de menú
            </span>
            <div className="flex flex-wrap gap-2">
              {categoriasDisponibles.map((categoria) => (
                <button
                  key={categoria}
                  type="button"
                  onClick={() => setCategoriaActiva(categoria)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold border cursor-pointer ${categoriaActiva === categoria ? "bg-amber-500 text-white border-amber-500 font-black shadow-sm" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"}`}
                >
                  {categoria === "Todas"
                    ? "🍽️ Mostrar todo"
                    : categoria === "Entrante"
                      ? "🥗 Entrantes"
                      : categoria === "Principal"
                        ? "🥩 Principales"
                        : "🍰 Postres"}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* TARJETAS DE PRODUCTOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {platosFiltrados.length === 0 ? (
            <div className="col-span-full bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
              <span className="text-4xl block mb-2">🍃</span>
              <p className="text-slate-400 font-medium">
                No hay platos disponibles en este momento.
              </p>
            </div>
          ) : (
            platosFiltrados.map((plato) => (
              <div
                key={plato.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  {plato.imagen_url && (
                    <div className="w-full h-44 rounded-xl overflow-hidden mb-4 relative border border-slate-100 bg-slate-100">
                      {/* --- MODIFICADO: Estructura adaptativa para soportar URLs relativas o externas --- */}
                      <img
                        src={
                          plato.imagen_url.startsWith("http")
                            ? plato.imagen_url
                            : `/images/${plato.imagen_url}`
                        }
                        alt={plato.nombre}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                    {plato.categoria}
                  </span>
                  <h2 className="text-xl font-bold mt-4 mb-2 text-slate-800 tracking-tight leading-tight">
                    {plato.nombre}
                  </h2>
                  <p className="text-slate-500 text-xs font-light mb-4 line-clamp-3 leading-relaxed">
                    {plato.descripcion}
                  </p>
                  <p className="text-[11px] text-slate-400 mb-6 font-semibold bg-slate-50 inline-block px-2.5 py-1 rounded border border-slate-100">
                    ⚠️ Alérgenos: {plato.alergenos || "Ninguno"}
                  </p>
                </div>
                <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 mt-auto">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-black text-slate-900 font-mono">
                      {Number(plato.precio).toFixed(2)}€
                    </span>
                    {plato.disponible && (
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1 font-mono">
                        <button
                          type="button"
                          onClick={() => decrementarCantidadPrevia(plato.id)}
                          className="px-2.5 py-0.5 font-bold text-slate-400 hover:text-red-500 text-sm"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-black text-slate-700 w-6 text-center">
                          {cantidadesPrevia[plato.id] || 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => incrementarCantidadPrevia(plato.id)}
                          className="px-2.5 py-0.5 font-bold text-slate-400 hover:text-emerald-500 text-sm"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => intentarAgregarAlCarrito(e, plato)}
                    className="w-full bg-slate-900 text-white font-bold text-xs py-2.5 rounded-xl hover:bg-amber-500 transition-all uppercase tracking-wider cursor-pointer"
                  >
                    Añadir Cesta
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* TRIGGER DEL CARRITO */}
      {totalItems > 0 && (
        <button
          type="button"
          onClick={() => setMostrarCarrito(true)}
          className="fixed bottom-8 right-8 z-30 bg-amber-500 hover:bg-amber-600 text-white px-6 py-4 rounded-full shadow-2xl font-bold text-lg flex items-center gap-3 transition-transform hover:scale-105 cursor-pointer"
        >
          <span>🛒 Tu Pedido ({totalItems})</span>
          <span className="bg-white/20 px-3 py-1 rounded-full font-mono">
            {totalPrecioFinal.toFixed(2)}€
          </span>
        </button>
      )}

      {/* --- MODAL DEL CARRITO MULTIPASO --- */}
      {mostrarCarrito && (
        <div className="fixed inset-0 bg-black/60 flex items-start md:items-center justify-center p-4 z-60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-full sm:max-w-lg md:max-w-2xl w-full shadow-2xl mt-20 mb-6 md:my-8 flex flex-col relative animate-fade-in">
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-100">
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                {pasoCarrito === 1 ? "Tu Pedido" : "Datos de Entrega"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setMostrarCarrito(false);
                  setPasoCarrito(1);
                }}
                className="text-slate-400 hover:text-slate-800 text-3xl font-light cursor-pointer p-1"
              >
                &times;
              </button>
            </div>

            <div className="overflow-y-auto pr-1 mb-2 flex-1 space-y-6 max-h-[60vh] md:max-h-[55vh]">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Resumen del pedido actual
                </span>
                <ComponenteListaCarritoEditable />
              </div>

              {pasoCarrito === 1 ? (
                /* PASO 1: TU PEDIDO */
                <div className="pt-2 space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                    <span>Subtotal comida</span>
                    <span className="font-mono">
                      {totalPrecioBase.toFixed(2)}€
                    </span>
                  </div>
                  {aplicaDescuento && (
                    <div className="flex justify-between items-center text-xs text-emerald-600 font-bold">
                      <span>Descuento Fidelidad (5%)</span>
                      <span className="font-mono">
                        -{descuentoFidelidad.toFixed(2)}€
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col border-b border-slate-100 pb-2">
                    <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                      <span>Gastos de envío</span>
                      <span className="font-mono">
                        {costoEnvio === 0
                          ? "GRATIS"
                          : `${costoEnvio.toFixed(2)}€`}
                      </span>
                    </div>
                    {costoEnvio > 0 && (
                      <p className="text-[10px] text-amber-600 font-semibold mt-0.5 text-right animate-pulse">
                        💡 ¡Añade {(80 - totalPrecioBase).toFixed(2)}€ más para
                        conseguir envío GRATIS!
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-2 mb-4">
                    <span className="text-sm md:text-base font-bold text-slate-700">
                      Total a Pagar
                    </span>
                    <span className="text-2xl md:text-3xl font-black text-amber-600 font-mono">
                      {totalPrecioFinal.toFixed(2)}€
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPasoCarrito(2)}
                    className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 text-xs md:text-sm uppercase tracking-wider cursor-pointer"
                  >
                    Siguiente: Datos de Envío →
                  </button>
                </div>
              ) : (
                /* PASO 2: DATOS DE ENTREGA */
                <form onSubmit={manejarSubmitPedido} className="space-y-4 pt-2">
                  {/* --- NUEVO: RESUMEN DE PEDIDO FINANCIERO (VISIBLE EN PASO 2) --- */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs text-slate-600 mb-6">
                    <div className="flex justify-between">
                      <span>Subtotal comida</span>
                      <span className="font-mono">
                        {totalPrecioBase.toFixed(2)}€
                      </span>
                    </div>
                    {aplicaDescuento && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Descuento Fidelidad (5%)</span>
                        <span className="font-mono">
                          -{descuentoFidelidad.toFixed(2)}€
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Gastos de envío</span>
                      <span className="font-mono">
                        {costoEnvio === 0
                          ? "GRATIS"
                          : `${costoEnvio.toFixed(2)}€`}
                      </span>
                    </div>
                    {costoEnvio > 0 && (
                      <p className="text-[10px] text-amber-600 font-semibold text-right animate-pulse">
                        💡 ¡Añade {(80 - totalPrecioBase).toFixed(2)}€ más para
                        conseguir envío GRATIS!
                      </p>
                    )}
                    <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-slate-900 text-sm">
                      <span>Total a Pagar</span>
                      <span className="text-amber-600">
                        {totalPrecioFinal.toFixed(2)}€
                      </span>
                    </div>
                  </div>

                  {!estaLogueado && (
                    <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 space-y-3 mb-2 animate-fade-in">
                      <span className="block text-[10px] font-black text-amber-800 uppercase tracking-wider">
                        👤 Información de Contacto (Pedido como Invitado)
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                            Nombre
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Tu nombre"
                            value={pedidoFormData.nombre_invitado}
                            onChange={(e) =>
                              setPedidoFormData({
                                ...pedidoFormData,
                                nombre_invitado: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs outline-none h-10 focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                            Apellidos
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Tus apellidos"
                            value={pedidoFormData.apellidos_invitado}
                            onChange={(e) =>
                              setPedidoFormData({
                                ...pedidoFormData,
                                apellidos_invitado: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs outline-none h-10 focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                          Correo Electrónico de Confirmación
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="ejemplo@correo.com"
                          value={pedidoFormData.email_invitado}
                          onChange={(e) =>
                            setPedidoFormData({
                              ...pedidoFormData,
                              email_invitado: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs outline-none h-10 focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] md:text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
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
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 bg-white text-xs font-medium outline-none h-10"
                      >
                        <option>Catering Completo</option>
                        <option>Sólo Comida (Entrega)</option>
                        <option>Cóctel / Evento Corporativo</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] md:text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                          Día de Entrega
                        </label>
                        <input
                          type="date"
                          required
                          min={fechaMinimaPermitida}
                          value={pedidoFormData.fecha_servicio_dia}
                          onChange={(e) =>
                            setPedidoFormData({
                              ...pedidoFormData,
                              fecha_servicio_dia: e.target.value,
                            })
                          }
                          className="w-full px-2.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-xs font-medium outline-none bg-white h-10"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] md:text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                          Franja Horaria
                        </label>
                        <select
                          required
                          value={pedidoFormData.fecha_servicio_hora}
                          onChange={(e) =>
                            setPedidoFormData({
                              ...pedidoFormData,
                              fecha_servicio_hora: e.target.value,
                            })
                          }
                          className="w-full px-2.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 bg-white text-xs font-medium outline-none h-10"
                        >
                          {HORAS_DISPONIBLES.map((bloque) => {
                            const estaOcupada = horasOcupadas.includes(bloque);
                            return (
                              <option
                                key={bloque}
                                value={bloque}
                                disabled={estaOcupada}
                              >
                                {bloque} h {estaOcupada ? "(Ocupado)" : ""}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] md:text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
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
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium h-10"
                      >
                        <option value="Madrid">Madrid (21 Distritos)</option>
                        <option value="Toledo">Toledo (5 Distritos)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                        Zona de Cobertura
                      </label>
                      <select
                        value={pedidoFormData.distrito}
                        onChange={(e) =>
                          setPedidoFormData({
                            ...pedidoFormData,
                            distrito: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium h-10"
                      >
                        {ZONAS_REPARTO[pedidoFormData.ciudad].map((barrio) => (
                          <option key={barrio} value={barrio}>
                            {barrio}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] md:text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                        Dirección de Entrega
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Calle, número, portal, portal, piso"
                        value={pedidoFormData.direccion_calle}
                        onChange={(e) =>
                          setPedidoFormData({
                            ...pedidoFormData,
                            direccion_calle: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs h-10"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: 28013"
                        value={pedidoFormData.codigo_postal}
                        onChange={(e) =>
                          setPedidoFormData((prev) => ({
                            ...prev,
                            codigo_postal: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs h-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] md:text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                      Teléfono de Contacto Urgente
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
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs h-10"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] md:text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                      Notas especiales o Alérgenos (Opcional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Especificaciones particulares para cocina..."
                      value={pedidoFormData.notas_cliente}
                      onChange={(e) =>
                        setPedidoFormData({
                          ...pedidoFormData,
                          notas_cliente: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs resize-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex gap-4">
                    <button
                      type="button"
                      onClick={() => setPasoCarrito(1)}
                      className="w-1/3 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 text-xs cursor-pointer h-11"
                    >
                      ← Volver
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 bg-amber-500 text-white font-black py-3 rounded-xl hover:bg-amber-600 text-xs uppercase tracking-wider cursor-pointer h-11"
                    >
                      Confirmar ({totalPrecioFinal.toFixed(2)}€)
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- POP-UP COMERCIAL DE AUTENTICACIÓN --- */}
      {mostrarModalAuth && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative border-t-8 border-amber-500">
            <button
              type="button"
              onClick={() => {
                setMostrarModalAuth(false);
                setPlatoPendiente(null);
              }}
              className="absolute top-4 right-5 text-slate-400 hover:text-slate-800 text-3xl font-light cursor-pointer"
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
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {vistaAuth === "registro" && "Activa tu 5% Directo"}
                {vistaAuth === "login" && "Ingresar a CaterChef"}
                {vistaAuth === "recuperar" && "Recuperar Contraseña"}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {vistaAuth === "registro" &&
                  "Registrarse para obtener el descuento del 5% Directo en tu primer pedido. Identifícate para guardar tu historial y aplicar ventajas."}
                {vistaAuth === "login" &&
                  "Introduce tus credenciales para acceder a tu perfil."}
                {vistaAuth === "recuperar" &&
                  "Introduce tu email para restablecer tu contraseña."}
              </p>
            </div>

            {vistaAuth !== "recuperar" && (
              <div className="flex border-b border-slate-200 mb-6 text-sm">
                <button
                  type="button"
                  onClick={() => setVistaAuth("registro")}
                  className={`flex-1 pb-3 font-bold cursor-pointer ${vistaAuth === "registro" ? "border-b-2 border-amber-500 text-amber-600" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Soy Nuevo
                </button>
                <button
                  type="button"
                  onClick={() => setVistaAuth("login")}
                  className={`flex-1 pb-3 font-bold cursor-pointer ${vistaAuth === "login" ? "border-b-2 border-amber-500 text-amber-600" : "text-slate-400 hover:text-slate-600"}`}
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
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs outline-none"
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
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs outline-none"
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs outline-none"
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
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs outline-none"
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs outline-none"
                  />
                  {vistaAuth === "login" && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => setVistaAuth("recuperar")}
                        className="text-[11px] text-slate-400 hover:text-amber-600 underline font-medium cursor-pointer"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                  )}
                </>
              )}
              {vistaAuth === "registro" && (
                <div className="flex items-start gap-2 pt-1">
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
                    className="text-[11px] text-slate-400 leading-snug cursor-pointer select-none"
                  >
                    He leído y acepto la{" "}
                    <Link
                      href="/privacidad"
                      target="_blank"
                      className="text-amber-600 font-bold underline"
                    >
                      Política de Privacidad
                    </Link>
                    .
                  </label>
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 text-xs uppercase tracking-wider cursor-pointer"
              >
                {vistaAuth === "registro" && "Crear Perfil y Aplicar Descuento"}
                {vistaAuth === "login" && "Entrar a mi Perfil"}
                {vistaAuth === "recuperar" && "Enviar Instrucciones"}
              </button>
            </form>
            <button
              type="button"
              onClick={continuarComoInvitado}
              className="w-full text-slate-400 font-bold py-2 mt-2 hover:text-amber-600 text-xs cursor-pointer tracking-wide text-center"
            >
              Seguir comprando sin registrarse →
            </button>
          </div>
        </div>
      )}

      {platoParaAviso && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-2 tracking-tight text-slate-900">
              ¿Te avisamos?
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Déjanos tu email y te notificaremos cuando{" "}
              <strong className="text-slate-800">
                "{platoParaAviso.nombre}"
              </strong>{" "}
              vuelva.
            </p>
            <form onSubmit={manejarEnvioAviso}>
              <input
                type="email"
                required
                placeholder="tu@email.com"
                value={emailAviso}
                onChange={(e) => setEmailAviso(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 mb-4 text-xs"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPlatoParaAviso(null)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
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

// --- FINAL DEL ARCHIVO: EL WRAPPER QUE SOLUCIONA EL ERROR DE SUSPENSE ---
export default function CartaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Cargando...
        </div>
      }
    >
      <CartaContent />
    </Suspense>
  );
}
