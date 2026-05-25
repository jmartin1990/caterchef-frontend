// src/app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-slate-50 font-sans text-slate-800">
      {/* 1. HERO SECTION (Pantalla Completa) */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Imagen de fondo inmersiva */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=2070"
            alt="Alta cocina peruana"
            className="w-full h-full object-cover"
          />
          {/* Overlay oscuro para que el texto sea legible */}
          <div className="absolute inset-0 bg-slate-950/60"></div>
        </div>

        {/* Contenido Hero */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto animate-fade-in">
          <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-sm mb-4 block">
            Alta Cocina a Domicilio
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
            La Esencia del Perú,
            <br />
            <span className="font-light italic text-slate-200">
              con Vanguardia Española
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 font-light max-w-2xl mx-auto">
            Eventos corporativos, diplomáticos y experiencias de chef privado.
            Elevamos tus momentos con gastronomía de autor y un protocolo
            impecable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/carta"
              className="bg-amber-600 text-white font-bold px-8 py-4 rounded-full hover:bg-amber-700 transition-all shadow-lg hover:shadow-amber-500/25 uppercase tracking-wider text-sm"
            >
              Ver Menú Fusión
            </Link>
            <Link
              href="/reservas"
              className="bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold px-8 py-4 rounded-full hover:bg-white hover:text-slate-900 transition-all uppercase tracking-wider text-sm"
            >
              Solicitar Presupuesto
            </Link>
          </div>
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
              diseñamos experiencias. Seleccionamos los ingredientes más puros
              de los Andes y del Pacífico peruano, y los trabajamos con las
              técnicas más refinadas de la cocina contemporánea europea.
            </p>
            <p className="text-slate-600 mb-8 text-lg leading-relaxed font-light">
              El resultado es una propuesta elegante, sorprendente y diseñada a
              medida para cada anfitrión que busca la excelencia.
            </p>
            <Link
              href="/chefs"
              className="text-amber-600 font-bold border-b-2 border-amber-600 pb-1 hover:text-amber-700 hover:border-amber-700 transition-colors"
            >
              Conoce a nuestros Chefs Ejecutivos →
            </Link>
          </div>
          <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80&w=1950"
              alt="Detalle de emplatado"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 3. SERVICIOS (Tarjetas de Experiencia) */}
      <section className="py-24 px-6 md:px-10 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-sm font-bold text-amber-500 uppercase tracking-[0.2em] mb-3">
            Experiencias CaterChef
          </h2>
          <h3 className="text-4xl font-black text-white">Servicios de Firma</h3>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tarjeta 1 */}
          <div className="group cursor-pointer">
            <div className="relative h-80 rounded-2xl overflow-hidden mb-6">
              <img
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=2069"
                alt="Catering Corporativo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
            </div>
            <h4 className="text-2xl font-bold mb-3">Catering Corporativo</h4>
            <p className="text-slate-400 font-light leading-relaxed mb-4">
              Elevamos las reuniones de su empresa con menús adaptados, coffee
              breaks de autor y cócteles premium para directivos.
            </p>
            <Link
              href="/reservas"
              className="text-amber-500 font-semibold text-sm uppercase tracking-wider group-hover:text-amber-400 transition-colors"
            >
              Solicitar Dossier
            </Link>
          </div>

          {/* Tarjeta 2 */}
          <div className="group cursor-pointer">
            <div className="relative h-80 rounded-2xl overflow-hidden mb-6">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=1977"
                alt="Chef Privado"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
            </div>
            <h4 className="text-2xl font-bold mb-3">Chef Privado en Casa</h4>
            <p className="text-slate-400 font-light leading-relaxed mb-4">
              Llevamos el restaurante a su comedor. Nuestro equipo cocina, sirve
              y recoge, para que usted solo se preocupe de disfrutar con sus
              invitados.
            </p>
            <Link
              href="/reservas"
              className="text-amber-500 font-semibold text-sm uppercase tracking-wider group-hover:text-amber-400 transition-colors"
            >
              Reservar Fecha
            </Link>
          </div>

          {/* Tarjeta 3 */}
          <div className="group cursor-pointer">
            <div className="relative h-80 rounded-2xl overflow-hidden mb-6">
              <img
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1974"
                alt="Eventos Sociales"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
            </div>
            <h4 className="text-2xl font-bold mb-3">
              Celebraciones Especiales
            </h4>
            <p className="text-slate-400 font-light leading-relaxed mb-4">
              Bodas boutique, aniversarios y galas. Estaciones de ceviche en
              vivo, showcooking y barras de coctelería pisco sour.
            </p>
            <Link
              href="/reservas"
              className="text-amber-500 font-semibold text-sm uppercase tracking-wider group-hover:text-amber-400 transition-colors"
            >
              Planificar Evento
            </Link>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION FINAL */}
      <section className="py-24 bg-amber-50 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black text-slate-900 mb-6">
            ¿Listo para cautivar a sus invitados?
          </h2>
          <p className="text-lg text-slate-600 mb-10 font-light">
            Descubra por qué somos la opción preferida para la alta dirección y
            los eventos más exclusivos de Madrid y Toledo.
          </p>
          <Link
            href="/carta"
            className="bg-slate-900 text-white font-bold px-10 py-4 rounded-full hover:bg-slate-800 transition-all shadow-xl hover:shadow-slate-900/20 uppercase tracking-wider text-sm inline-block"
          >
            Explorar la Carta Ahora
          </Link>
        </div>
      </section>
    </div>
  );
}
