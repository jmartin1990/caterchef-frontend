// src/app/contacto/page.tsx
"use client";

import { useState, SyntheticEvent } from "react";
import Link from "next/link"; // Asegura la importación nativa de Next.js para una navegación SPA óptima

export default function ContactoPage() {
  const [cargando, setCargando] = useState(false);

  // Control independiente para las casillas de verificación legal (RGPD)
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false);
  const [aceptaComerciales, setAceptaComerciales] = useState(false);

  // DTO del formulario con tracking opcional de tickets
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    numero_pedido: "",
    tipo_evento: "Particular / Privado",
    mensaje: "",
  });

  const manejarSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Freno de seguridad obligatorio si no se acepta la privacidad
    if (!aceptaPrivacidad) {
      alert(
        "Por favor, debe aceptar la Política de Privacidad corporativa para procesar su solicitud.",
      );
      return;
    }

    setCargando(true);

    // --- MODO AUDITORÍA TFG: Simulación interactiva de recepción de leads ---
    setTimeout(() => {
      alert(
        `✨ ¡Formulario Procesado! Lead indexado con éxito. Gracias por contactar con CaterChef Fusión, ${formData.nombre}.`,
      );

      // Limpieza completa del formulario incluyendo los nuevos campos
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        numero_pedido: "",
        tipo_evento: "Particular / Privado",
        mensaje: "",
      });
      setAceptaPrivacidad(false);
      setAceptaComerciales(false);
      setCargando(false);
    }, 1000);
  };

  return (
    <div className="min-h-[75vh] bg-slate-50 font-sans text-slate-800 py-16 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Bloque Informativo de Atención al Cliente (Estilo E-Commerce de Autor) */}
        <section className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm mb-12 animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-4">
            ¿Cómo podemos ayudarte?
          </h2>
          <p className="text-slate-600 leading-relaxed font-light text-sm md:text-base">
            Consulta nuestras{" "}
            <Link
              href="/preguntas"
              className="font-bold text-amber-600 hover:underline"
            >
              Preguntas Frecuentes
            </Link>
            . Si no encuentras la respuesta que buscas, puedes ponerte en
            contacto con nosotros escribiendo un email a{" "}
            <a
              href="mailto:atencionalcliente@caterchef.com"
              className="font-bold text-amber-600 hover:underline"
            >
              atencionalcliente@caterchef.com
            </a>
            , llamándonos al teléfono{" "}
            <a
              href="tel:+34914356621"
              className="font-mono font-bold text-slate-900 hover:text-amber-600 transition-colors"
            >
              91 435 66 21
            </a>{" "}
            o bien a través de nuestro chat interactivo. Nuestro horario de
            atención al cliente es de lunes a jueves de 8:00 a 17:30h y viernes
            de 8:00 a 14h.
          </p>
          <p className="text-slate-600 leading-relaxed font-light text-sm md:text-base mt-4">
            Si lo prefieres, también puedes enviarnos un mensaje con tus
            preguntas o comentarios a través de nuestro formulario de contacto.
            El campo de &quot;número de pedido&quot; no es obligatorio, pero si
            tu consulta está relacionada con un pedido o contratación de chef
            privado, te agradeceríamos que nos lo indicaras para agilizar la
            identificación de tu expediente.
          </p>
        </section>

        {/* Cabecera Estilo Atelier Gastronómico */}
        <header className="mb-16 text-center md:text-left">
          <span className="text-amber-600 font-bold tracking-[0.2em] uppercase text-xs mb-3 block">
            Atención Exclusiva
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Diseñemos tu Próxima Experiencia
          </h1>
        </header>

        {/* Bloque Central Bifurcado */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Columna Izquierda: Formulario Interactivo */}
          <div className="lg:col-span-3 bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200">
            <form onSubmit={manejarSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Carlos Mendoza"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50 text-sm font-medium transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50 text-sm font-medium transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                    Teléfono de Contacto *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej: +34 600 000 000"
                    value={formData.telefono}
                    onChange={(e) =>
                      setFormData({ ...formData, telefono: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50 text-sm font-medium transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                    Número de Pedido / Contratación (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: #eaf6566 o Código Chef"
                    value={formData.numero_pedido}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        numero_pedido: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50 text-sm font-medium transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Tipo de Evento
                </label>
                <select
                  value={formData.tipo_evento}
                  onChange={(e) =>
                    setFormData({ ...formData, tipo_evento: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-amber-500 bg-white text-sm font-bold text-slate-700 transition-all cursor-pointer"
                >
                  <option>Particular / Privado</option>
                  <option>Corporativo / Empresa</option>
                  <option>Diplomático / Gala</option>
                  <option>Boda / Celebración Boutique</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Detalles del Servicio o Preferencias Alérgenas *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Por favor, indícanos el número aproximado de comensales, fecha deseada o cualquier restricción culinaria..."
                  value={formData.mensaje}
                  onChange={(e) =>
                    setFormData({ ...formData, mensaje: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50 text-sm font-medium transition-all resize-none leading-relaxed"
                />
              </div>

              {/* Casillas de Compliance Legal */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="privacidad_contacto"
                    required
                    checked={aceptaPrivacidad}
                    onChange={(e) => setAceptaPrivacidad(e.target.checked)}
                    className="mt-1 accent-amber-500 h-4 w-4 cursor-pointer shadow-sm"
                  />
                  <label
                    htmlFor="privacidad_contacto"
                    className="text-xs text-slate-600 select-none cursor-pointer leading-snug"
                  >
                    <span className="text-red-600 font-bold">*</span> He leído y
                    acepto la{" "}
                    <Link
                      href="/privacidad"
                      target="_blank"
                      className="text-amber-600 font-bold underline hover:text-amber-700"
                    >
                      Política de Privacidad
                    </Link>
                    .
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="comercial_contacto"
                    checked={aceptaComerciales}
                    onChange={(e) => setAceptaComerciales(e.target.checked)}
                    className="mt-1 accent-amber-500 h-4 w-4 cursor-pointer shadow-sm"
                  />
                  <label
                    htmlFor="comercial_contacto"
                    className="text-xs text-slate-500 select-none cursor-pointer leading-snug"
                  >
                    [Opcional] Acepto el envío de comunicaciones comerciales y
                    newsletters de alta cocina.
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-slate-800 transition-all shadow-md uppercase tracking-wider text-xs cursor-pointer disabled:opacity-50"
              >
                {cargando
                  ? "Despachando solicitud..."
                  : "Enviar Mensaje Informativo"}
              </button>

              {/* Párrafo Legal */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-[10px] text-slate-500 leading-relaxed">
                El responsable del tratamiento es{" "}
                <span className="font-bold text-slate-700">
                  CATERCHEF FUSIÓN S.L.
                </span>{" "}
                La finalidad de la recogida de datos es la de poder atender sus
                cuestiones, sin ceder sus datos a terceros. Tiene derecho a
                saber qué información tenemos sobre usted, corregirla o
                eliminarla tal y como se explica en nuestra Política de
                Privacidad.
              </div>
            </form>
          </div>

          {/* Columna Derecha: Canales Corporativos */}
          <div className="lg:col-span-2 space-y-6 h-full flex flex-col justify-between">
            {/* Acceso Directo a WhatsApp Business */}
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl flex items-center gap-4 shadow-sm animate-fade-in">
              <div className="bg-emerald-500 text-white text-3xl w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-sm select-none">
                💬
              </div>
              <div>
                <h4 className="font-bold text-emerald-950 text-sm">
                  Canal WhatsApp Business
                </h4>
                <p className="text-xs text-emerald-800 font-medium mt-0.5">
                  Asesoría de menús y catering instantáneo.
                </p>
                <a
                  href="https://wa.me/34613510777"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono font-black text-emerald-600 block mt-1 hover:underline"
                >
                  +34 613 51 07 77
                </a>
              </div>
            </div>

            {/* Bloque de Coordenadas Físicas de Marca */}
            <div className="bg-slate-950 text-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-900 relative overflow-hidden flex-grow flex flex-col justify-center">
              <div className="absolute top-0 right-0 p-8 text-7xl opacity-10 pointer-events-none select-none font-black">
                C.F
              </div>

              {/* --- MODIFICADO: Cambiado el string 'Oficinas Centrales' por la variable unificada de marca --- */}
              <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-[10px] mb-6 block">
                Otras formas de contacto
              </span>

              <div className="space-y-6 text-sm font-light">
                <div className="flex items-start gap-4">
                  <span className="text-xl">📍</span>
                  <div>
                    <h4 className="font-bold text-slate-200">
                      Zonas de Cobertura Principal
                    </h4>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      Comunidad de Madrid &amp; Toledo centro.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="text-xl">📞</span>
                  <div>
                    <h4 className="font-bold text-slate-200">
                      Línea de Reservas Directa
                    </h4>
                    {/* --- MODIFICADO: Añadido tag 'a' clicable nativo y sincronizado al número oficial --- */}
                    <a
                      href="tel:+34914356621"
                      className="text-slate-400 text-xs mt-1 font-mono hover:text-amber-500 transition-colors block"
                    >
                      91 435 66 21
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="text-xl">✉️</span>
                  <div>
                    <h4 className="font-bold text-slate-200">
                      Atención Institucional
                    </h4>
                    {/* --- MODIFICADO: Añadido tag 'a' con trigger 'mailto:' apuntando al correo unificado --- */}
                    <a
                      href="mailto:atencionalcliente@caterchef.com"
                      className="text-slate-400 text-xs mt-1 font-mono hover:text-amber-500 transition-colors block truncate max-w-[200px] sm:max-w-none"
                    >
                      atencionalcliente@caterchef.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Canales de Redes Sociales Corporativas */}
              <div className="border-t border-slate-800 mt-8 pt-6">
                {/* --- MODIFICADO: Cambiado el encabezado por 'Redes sociales' --- */}
                <h4 className="font-bold text-amber-500 uppercase tracking-wider text-[11px] mb-4">
                  Redes sociales
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {/* Instagram */}
                  <a
                    href="#"
                    className="flex items-center gap-2.5 p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:text-white hover:border-pink-500/40 transition-all text-xs font-bold text-slate-400"
                  >
                    <svg
                      className="w-4 h-4 fill-current text-pink-500"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                    Instagram
                  </a>

                  {/* TikTok */}
                  <a
                    href="#"
                    className="flex items-center gap-2.5 p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:text-white hover:border-cyan-400/40 transition-all text-xs font-bold text-slate-400"
                  >
                    {/* --- CORREGIDO: Inyectado el path inline SVG genuino y oficial de la marca TikTok --- */}
                    <svg
                      className="w-4 h-4 fill-current text-cyan-400"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.29 0h3.2a6.71 6.71 0 0 0 5.48 5.48v3.25a9.92 9.92 0 0 1-5.48-1.95v7.45a6.77 6.77 0 1 1-11.13-5.24l.07.06v3.42a3.49 3.49 0 1 0 4.31 3.42V0z" />
                    </svg>
                    TikTok
                  </a>

                  {/* YouTube */}
                  <a
                    href="#"
                    className="flex items-center gap-2.5 p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:text-white hover:border-red-500/40 transition-all text-xs font-bold text-slate-400"
                  >
                    <svg
                      className="w-4 h-4 fill-current text-red-500"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    YouTube
                  </a>

                  {/* X (Twitter) */}
                  <a
                    href="#"
                    className="flex items-center gap-2.5 p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:text-white hover:border-slate-400/40 transition-all text-xs font-bold text-slate-400"
                  >
                    <svg
                      className="w-4 h-4 fill-current text-slate-200"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Twitter
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="#"
                    className="flex items-center gap-2.5 p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:text-white hover:border-blue-500/40 transition-all text-xs font-bold text-slate-400"
                  >
                    <svg
                      className="w-4 h-4 fill-current text-blue-500"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>

                  {/* Facebook */}
                  <a
                    href="#"
                    className="flex items-center gap-2.5 p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:text-white hover:border-blue-600/40 transition-all text-xs font-bold text-slate-400"
                  >
                    <svg
                      className="w-4 h-4 fill-current text-blue-600"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
