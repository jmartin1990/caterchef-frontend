import Link from "next/link";

export const metadata = {
  title: "Envíos y Devoluciones | CaterChef Fusión",
};

export default function EnviosDevolucionesPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
        <h1 className="text-4xl font-black text-slate-900 mb-8 pb-4 border-b border-slate-100">
          Envíos y Devoluciones
        </h1>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-amber-600 mb-4">ENVÍOS</h2>
          <p className="text-slate-600 mb-4 leading-relaxed">
            Entrega en <strong>24/48 h de lunes a viernes laborables</strong>.
            El tiempo de entrega para los pedidos que contienen frío es de
            24/48h laborables de lunes a jueves. Los pedidos que se realicen el
            jueves a partir de las 14:00 h, serán enviados el lunes.
          </p>

          <h3 className="font-bold text-slate-800 mt-6 mb-2">
            Áreas de Cobertura y Tarifas:
          </h3>
          <ul className="list-disc pl-5 text-slate-600 space-y-2 mb-4">
            <li>
              <strong>Madrid (21 distritos):</strong> Arganzuela, Barajas,
              Carabanchel, Centro, Chamartín, Chamberí, Ciudad Lineal,
              Fuencarral-El Pardo, Hortaleza, Latina, Moncloa-Aravaca,
              Moratalaz, Puente de Vallecas, Retiro, Salamanca, San
              Blas-Canillejas, Tetuán, Usera, Vicálvaro, Villa de Vallecas,
              Villaverde.
            </li>
            <li>
              <strong>Toledo (5 distritos):</strong> Casco Histórico, Santa
              María de Benquerencia (Polígono), Santa Bárbara, Azucaica,
              Distrito Norte (Buenavista / Vistahermosa).
            </li>
          </ul>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between">
            <span className="font-semibold text-amber-800">
              Coste estándar de envío:
            </span>
            <span className="font-black text-xl text-amber-600">4,90€</span>
          </div>
          <p className="text-sm font-bold text-emerald-600 mt-3 text-right">
            ✨ Envíos GRATIS en pedidos superiores a 80€
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-amber-600 mb-4">
            DEVOLUCIONES
          </h2>
          <p className="text-slate-600 mb-4 leading-relaxed">
            Para solicitar una devolución deberá comunicarlo en el correo
            electrónico:{" "}
            <a
              href="mailto:atencionalcliente@caterchef.com"
              className="font-bold text-slate-900 hover:text-amber-600 underline"
            >
              atencionalcliente@caterchef.com
            </a>
            .
          </p>
          <p className="text-slate-600 leading-relaxed">
            Los productos de alimentación{" "}
            <strong>
              sólo es posible su devolución por causas defectuosas
            </strong>{" "}
            y nunca por motivos comerciales. Una vez recibamos el paquete con su
            embalaje original y comprobemos la causa defectuosa, CaterChef hará
            la devolución íntegra del importe mediante el mismo método de pago
            con el que se realizó el pedido.
          </p>
        </section>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-sm font-bold text-slate-400 hover:text-slate-800 transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
