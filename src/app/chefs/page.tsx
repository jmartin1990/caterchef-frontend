// src/app/chefs/page.tsx
import Link from "next/link";

export default function ChefsPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* 1. SECCIÓN HERO: Encabezado Editorial */}
      <section className="pt-20 pb-16 px-6 md:px-10 max-w-6xl mx-auto text-center animate-fade-in">
        <span className="text-amber-600 font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
          Nuestra Esencia
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
          Los Rostros detrás de la <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-500 to-orange-600">
            Alta Cocina Fusión
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-slate-600 leading-relaxed font-light md:text-lg">
          En CaterChef Fusión creemos que cada plato cuenta una historia.
          Nuestro equipo culinario une la biodiversidad de los Andes y el
          Pacífico peruano con la técnica y tradición de la vanguardia española.
        </p>
      </section>

      {/* 2. PERFILES DE LOS CHEFS (Layout Alternado) */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pb-20 space-y-24">
        {/* Chef 1: El Alma Peruana (Imagen a la izquierda) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative h-100 lg:h-150 rounded-3xl overflow-hidden shadow-xl">
            {/* --- MODIFICADO: URL de la foto de Valeria Quispe actualizada por el enlace provisto --- */}
            <img
              src="https://estaticos-cdn.prensaiberica.es/clip/ceb2d871-0fbc-4625-a318-11f5f69fff7d_alta-libre-aspect-ratio_default_0.jpg"
              alt="Chef Valeria Quispe preparando un plato"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            {/* Etiqueta flotante */}
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 shadow-lg">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                Especialidad: Cebiches y Tiraditos
              </span>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                Valeria Quispe
              </h2>
              <h3 className="text-amber-600 font-bold tracking-wider uppercase text-sm mt-2">
                Chef Ejecutiva / Herencia Peruana
              </h3>
            </div>
            <p className="text-slate-600 leading-relaxed font-light">
              Nacida en Arequipa y formada en las cocinas más exigentes de Lima,
              Valeria trae consigo el respeto absoluto por el producto
              autóctono. Su dominio de los ajíes, cítricos y técnicas de cocción
              ancestrales aporta la chispa vibrante y el alma latinoamericana a
              nuestro menú.
            </p>
            <p className="text-slate-600 leading-relaxed font-light">
              <span className="font-bold text-slate-800">
                "La cocina es memoria."
              </span>{" "}
              Para Valeria, cada evento es una oportunidad de transportar a los
              comensales a los mercados bulliciosos de Perú, logrando un
              equilibrio perfecto entre acidez, picante y frescura.
            </p>
            {/* Firma decorativa */}
            <div className="pt-4">
              <span className="font-serif italic text-2xl text-slate-400">
                V. Quispe
              </span>
            </div>
          </div>
        </div>

        {/* Chef 2: La Vanguardia Española (Imagen a la derecha) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center flex-col-reverse lg:flex-row">
          <div className="space-y-6 order-2 lg:order-1">
            <div>
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                Alejandro Rivera
              </h2>
              <h3 className="text-amber-600 font-bold tracking-wider uppercase text-sm mt-2">
                Jefe de Cocina / Vanguardia Española
              </h3>
            </div>
            <p className="text-slate-600 leading-relaxed font-light">
              Con más de 10 años de experiencia en restaurantes con Estrella
              Michelin en Madrid y San Sebastián, Alejandro es un perfeccionista
              de las texturas y los emplatados. Su profundo conocimiento de los
              fondos, salsas y la dieta mediterránea proporciona la base sólida
              sobre la que construimos nuestra propuesta.
            </p>
            <p className="text-slate-600 leading-relaxed font-light">
              Su visión aporta el refinement técnico europeo: esferificaciones,
              cocciones a baja temperatura y un tratamiento magistral de las
              carnes ibéricas y los pescados del Cantábrico, integrándose de
              forma impecable con los sabores andinos.
            </p>
            <div className="pt-4">
              <span className="font-serif italic text-2xl text-slate-400">
                A. Rivera
              </span>
            </div>
          </div>
          <div className="relative h-100 lg:h-150 rounded-3xl overflow-hidden shadow-xl order-1 lg:order-2">
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1000&auto=format&fit=crop"
              alt="Chef Alejandro Rivera emplatando"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 shadow-lg">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                Especialidad: Carnes y Fondos
              </span>
            </div>
          </div>
        </div>

        {/* --- NUEVO BLOQUE AGREGO: Chef 3 - Franklin Manrique (Imagen a la izquierda para mantener la alternancia) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative h-100 lg:h-150 rounded-3xl overflow-hidden shadow-xl">
            <img
              src="/chefs/franklin.jpeg"
              alt="Chef Franklin Manrique elaborando cocina fusión"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 shadow-lg">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                Especialidad: Innovación y Maridaje Fusión
              </span>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                Franklin Manrique
              </h2>
              <h3 className="text-amber-600 font-bold tracking-wider uppercase text-sm mt-2">
                Chef de Alta Gastronomía / Innovación Fusión
              </h3>
            </div>
            <p className="text-slate-600 leading-relaxed font-light">
              Con una destacada trayectoria internacional en alta cocina y tras
              llevar varios años residiendo y trabajando en los entornos
              gastronómicos más exigentes de Madrid, Franklin es el puente
              perfecto en nuestra propuesta. Su cocina destaca por adaptar las
              recetas tradicionales criollas e ingredientes andinos a las
              costumbres y materias primas de la península ibérica.
            </p>
            <p className="text-slate-600 leading-relaxed font-light">
              <span className="font-bold text-slate-800">
                "La fusión es equilibrio y respeto."
              </span>{" "}
              Especializado en diseñar experiencias privadas exclusivas a
              medida, Franklin logra combinar los matices intensos de la
              culinaria peruana con el producto local madrileño, asegurando una
              vivencia gourmet inolvidable en cada servicio a domicilio.
            </p>
            <div className="pt-4">
              <span className="font-serif italic text-2xl text-slate-400">
                F. Manrique
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MANIFIESTO CULINARIO (Cita Destacada) */}
      <section className="bg-slate-950 text-white py-24 px-6 md:px-10 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none font-serif">
          &quot;
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <p className="text-2xl md:text-4xl font-light italic leading-snug mb-8">
            No servimos comida, diseñamos momentos. La unión de dos culturas en
            un solo plato es la forma más honesta de compartir el world con
            nuestros clientes.
          </p>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* 4. CALL TO ACTION (Reserva de Chef a Domicilio) */}
      <section className="py-20 px-6 md:px-10 bg-white">
        <div className="max-w-4xl mx-auto bg-amber-50 rounded-3xl border border-amber-100 p-10 md:p-16 text-center shadow-sm">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
            ¿Quieres a nuestros chefs en tu cocina?
          </h2>
          <p className="text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto">
            Disfruta de la experiencia CaterChef Fusión en la intimidad de tu
            hogar o evento corporativo. Diseñamos un menú degustación a medida
            para ti y tus invitados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/reservas"
              className="bg-slate-900 text-white font-black py-4 px-8 rounded-xl hover:bg-slate-800 transition-all shadow-md uppercase tracking-wider text-xs"
            >
              Consultar Disponibilidad
            </Link>
            <Link
              href="/carta"
              className="bg-white text-slate-900 font-black py-4 px-8 rounded-xl border-2 border-slate-200 hover:border-slate-900 transition-all uppercase tracking-wider text-xs"
            >
              Ver Carta Fusión
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
