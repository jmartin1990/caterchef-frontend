// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// --- CONFIGURACIÓN MÁSTER DEL CARRUSEL HERO (TFG: Arquitectura de Datos de Interfaz) ---
const SLIDES_HERO = [
  {
    id: 1,
    titulo: "La Carta Fusión Gourmet",
    descripcion:
      "Explora una propuesta gastronómica única que fusiona las raíces tradicionales españolas con la explosión de sabor de la cocina peruana contemporánea.",
    botonTexto: "Ver la Carta",
    ruta: "/carta",
    // --- ACTUALIZADO: Inyección del recurso local optimizado para mejorar el LCP (Largest Contentful Paint) ---
    imagenUrl: "/images/mesa-banquete-fusion.png",
  },
  {
    id: 2,
    titulo: "Nuestros Chefs Ejecutivos",
    descripcion:
      "Lleve la experiencia de un restaurante de alta cocina a la comodidad de su hogar con chefs profesionales dedicados en exclusiva a su velada.",
    botonTexto: "Conoce a los Chefs",
    ruta: "/chefs",
    imagenUrl:
      "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 3,
    titulo: "Eventos & Catering Privados",
    descripcion:
      "Diseñamos menús sofisticados y coordinamos el servicio completo para bodas boutique, celebraciones corporativas y cenas de alta dirección.",
    botonTexto: "Reservar Evento Privado",
    ruta: "/reservas",
    imagenUrl:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop",
  },
];

export default function HomePage() {
  // --- CONTROLADORES REACTIVOS PARA LA TRANSICIÓN DE SLIDES (TFG: UX Interactiva) ---
  const [slideActual, setSlideActual] = useState(0);
  const router = useRouter();

  // Rotación automática del carrusel cada 6 segundos (Margen ideal de lectura comercial)
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideActual((prev) => (prev + 1) % SLIDES_HERO.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      {/* --- HERO SECTION CON CARRUSEL DINÁMICO MULTIMEDIA --- */}
      <section className="relative h-[75vh] md:h-[85vh] w-full overflow-hidden bg-slate-900 group">
        {SLIDES_HERO.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === slideActual ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Overlay oscuro para garantizar la accesibilidad y legibilidad del texto */}
            <div className="absolute inset-0 bg-black/50 z-10" />

            {/* Renderizado de fondo con micro-animación de zoom fluido (Ken Burns Effect) */}
            <img
              src={slide.imagenUrl}
              alt={slide.titulo}
              className="w-full h-full object-cover transition-transform duration-6000 ease-linear"
              loading={index === 0 ? "eager" : "lazy"}
            />

            {/* Contenedor Textual Absoluto Centrado */}
            <div className="absolute inset-0 z-20 flex items-center px-6 md:px-16 max-w-7xl mx-auto">
              <div className="max-w-2xl text-white space-y-4 md:space-y-6 animate-fade-in">
                <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs block">
                  Experiencia Exclusiva CaterChef
                </span>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-white drop-shadow-xs">
                  {slide.titulo}
                </h2>
                <p className="text-sm md:text-lg font-light text-slate-200 leading-relaxed max-w-xl">
                  {slide.descripcion}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => router.push(slide.ruta)}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs md:text-sm px-7 py-4 rounded-xl uppercase tracking-wider transition-all shadow-md hover:shadow-amber-500/20 transform hover:-translate-y-0.5 cursor-pointer inline-block"
                  >
                    {slide.botonTexto} →
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* --- NAVEGACIÓN MANUAL POR FLECHAS LATERALES SEMITRANSPARENTES (TFG: Control Ergonómico UX) --- */}
        {/* Flecha Izquierda: Retroceder slide */}
        <button
          type="button"
          onClick={() =>
            setSlideActual((prev) =>
              prev === 0 ? SLIDES_HERO.length - 1 : prev - 1,
            )
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 p-3 rounded-full transition-all duration-300 transform hover:scale-105 cursor-pointer hidden md:flex items-center justify-center outline-none select-none"
          aria-label="Anterior diapositiva"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        {/* Flecha Derecha: Avanzar slide */}
        <button
          type="button"
          onClick={() =>
            setSlideActual((prev) => (prev + 1) % SLIDES_HERO.length)
          }
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 p-3 rounded-full transition-all duration-300 transform hover:scale-105 cursor-pointer hidden md:flex items-center justify-center outline-none select-none"
          aria-label="Siguiente diapositiva"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>

        {/* CONTROLES NATIVOS: Indicadores de posición de las diapositivas (Dots UI) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
          {SLIDES_HERO.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSlideActual(index)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                index === slideActual
                  ? "w-8 bg-amber-500"
                  : "w-2 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Visualizar slide número ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. EL CONCEPTO (Filosofía de la marca) */}
      <section className="py-24 px-6 md:px-10 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-sm font-bold text-amber-600 uppercase tracking-[0.2em] mb-3">
              Nuestra Filosofía
            </h2>
            <h3 className="text-4xl font-black text-slate-900 mb-6 leading-tight">
              Gastronomía que cuenta <br /> una historia a dos continentes.
            </h3>
            <p className="text-slate-600 mb-6 text-lg leading-relaxed font-light">
              En CaterChef Fusión no hacemos simple comida a domicilio;
              diseñamos experiencias gastronómicas de autor. Seleccionamos los
              ingredientes más puros de los Andes y del Pacífico peruano, y los
              fusionamos con el producto de proximidad y las técnicas
              vanguardistas de la gastronomía española.
            </p>
            <p className="text-slate-600 mb-8 text-lg leading-relaxed font-light">
              El resultado es una propuesta elegante, sorprendente y diseñada
              estrictamente a la medida para cada anfitrión que busca la
              excelencia organizativa.
            </p>
            <Link
              href="/chefs"
              className="text-amber-600 font-bold border-b-2 border-amber-600 pb-1 hover:text-amber-700 hover:border-amber-700 transition-colors"
            >
              Conoce a nuestros Chefs Ejecutivos →
            </Link>
          </div>
          <div className="relative h-96 md:h-132 rounded-3xl overflow-hidden shadow-xl border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80&w=1950"
              alt="Detalle de emplatado gourmet"
              className="w-full h-full object-cover animate-fade-in"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* 3. SERVICIOS (Tarjetas de Experiencia Interactiva) */}
      <section className="py-24 px-6 md:px-10 bg-slate-950 text-white rounded-t-[2.5rem]">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-sm font-bold text-amber-500 uppercase tracking-[0.2em] mb-3">
            Experiencias CaterChef
          </h2>
          <h3 className="text-4xl font-black text-white tracking-tight">
            Servicios de Firma Premium
          </h3>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tarjeta 1 - Corporativo */}
          <div
            className="group cursor-pointer"
            onClick={() => router.push("/reservas")}
          >
            <div className="relative h-80 rounded-2xl overflow-hidden mb-6 border border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=2069"
                alt="Catering Corporativo de alta dirección"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
            </div>
            <h4 className="text-2xl font-bold mb-3 text-slate-100 group-hover:text-amber-400 transition-colors">
              Catering Corporativo
            </h4>
            <p className="text-slate-400 font-light leading-relaxed mb-4 text-xs md:text-sm">
              Elevamos las reuniones de su empresa con menús ejecutivos
              adaptados, coffee breaks de autor y cócteles premium diseñados
              para dejar una huella corporativa impecable.
            </p>
            <span className="text-amber-500 font-bold text-xs uppercase tracking-wider group-hover:underline">
              Solicitar Dossier →
            </span>
          </div>

          {/* Tarjeta 2 - Chef Privado */}
          <div
            className="group cursor-pointer"
            onClick={() => router.push("/chefs")}
          >
            <div className="relative h-80 rounded-2xl overflow-hidden mb-6 border border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=1977"
                alt="Chef Privado elaborando menú gourmet"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
            </div>
            <h4 className="text-2xl font-bold mb-3 text-slate-100 group-hover:text-amber-400 transition-colors">
              Chef Privado en Casa
            </h4>
            <p className="text-slate-400 font-light leading-relaxed mb-4 text-xs md:text-sm">
              Trasladamos la alta cocina a su comedor privado. Nuestro equipo se
              encarga de la compra, elaboración, maridaje y limpieza completa
              para que usted solo disfrute de ejercer de anfitrión.
            </p>
            <span className="text-amber-500 font-bold text-xs uppercase tracking-wider group-hover:underline">
              Conocer Disponibilidad →
            </span>
          </div>

          {/* Tarjeta 3 - Celebraciones Especiales */}
          <div
            className="group cursor-pointer"
            onClick={() => router.push("/reservas")}
          >
            <div className="relative h-80 rounded-2xl overflow-hidden mb-6 border border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1974"
                alt="Estaciones Gastronómicas de showcooking en vivo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
            </div>
            <h4 className="text-2xl font-bold mb-3 text-slate-100 group-hover:text-amber-400 transition-colors">
              Celebraciones Especiales
            </h4>
            <p className="text-slate-400 font-light leading-relaxed mb-4 text-xs md:text-sm">
              Bodas boutique y galas personalizadas. Diseñamos estaciones de
              ceviche en vivo, corners de showcooking vanguardista y barras de
              coctelería premium con pisco sour artesanal.
            </p>
            <span className="text-amber-500 font-bold text-xs uppercase tracking-wider group-hover:underline">
              Planificar Evento →
            </span>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION FINAL */}
      <section className="py-24 bg-amber-50 text-center px-6 rounded-b-[2.5rem]">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            ¿Listo para deleitar a sus comensales?
          </h2>
          <p className="text-sm md:text-base text-slate-600 font-light max-w-xl mx-auto leading-relaxed">
            Descubra por qué somos la opción predilecta para las firmas
            corporativas, delegaciones internacionales y las cenas privadas más
            selectas de Madrid y Toledo.
          </p>
          <div className="pt-2">
            <Link
              href="/carta"
              className="bg-slate-900 text-white font-bold px-10 py-4 rounded-xl hover:bg-slate-800 transition-all shadow-md uppercase tracking-wider text-xs inline-block"
            >
              Explorar la Carta Gourmet Ahora
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
