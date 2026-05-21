// src/components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 pt-16 pb-8 font-sans">
      <div className="max-w-6xl mx-auto px-10 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div>
          <Link
            href="/"
            className="text-3xl font-black text-white tracking-tight block mb-4"
          >
            CaterChef<span className="text-amber-500">.</span>
          </Link>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            Alta gastronomía a domicilio. Fusionando la herencia culinaria
            peruana con la vanguardia española.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">
            Experiencias
          </h4>
          <ul className="space-y-3 text-sm font-medium text-slate-400">
            <li>
              <Link href="/" className="hover:text-amber-500 transition-colors">
                Menú Fusión
              </Link>
            </li>
            <li>
              <Link
                href="/chefs"
                className="hover:text-amber-500 transition-colors"
              >
                Nuestros Chefs
              </Link>
            </li>
            <li>
              <Link
                href="/reservas"
                className="hover:text-amber-500 transition-colors"
              >
                Eventos Corporativos
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">
            Soporte
          </h4>
          <ul className="space-y-3 text-sm font-medium text-slate-400">
            <li>
              <Link
                href="/perfil/cuenta"
                className="hover:text-amber-500 transition-colors"
              >
                Área de Cliente
              </Link>
            </li>
            <li>
              <Link
                href="/privacidad"
                className="hover:text-amber-500 transition-colors"
              >
                Política de Privacidad
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-amber-500 transition-colors">
                Términos y Condiciones
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">
            Contacto
          </h4>
          <ul className="space-y-3 text-sm font-medium text-slate-400">
            <li className="flex items-center gap-2">
              📍 <span className="text-slate-300">Madrid & Toledo</span>
            </li>
            <li className="flex items-center gap-2">
              📞 <span className="text-slate-300">+34 900 123 456</span>
            </li>
            <li className="flex items-center gap-2">
              ✉️ <span className="text-slate-300">reservas@caterchef.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-10 pt-8 border-t border-slate-800 text-center flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-slate-600 font-medium">
          © {new Date().getFullYear()} CaterChef Fusión. Proyecto TFG DAW - Juan
          Campos.
        </p>
        <div className="flex gap-4">
          <span className="text-slate-600 text-xs font-bold bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            100% Pago Seguro
          </span>
          <span className="text-slate-600 text-xs font-bold bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            RGPD Compliant
          </span>
        </div>
      </div>
    </footer>
  );
}
