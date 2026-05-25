// src/components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 pt-16 pb-8 font-sans">
      {/* Rejilla Principal de Canales y Navegación Corporativa */}
      <div className="max-w-6xl mx-auto px-10 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Columna 1: Branding y Manifiesto */}
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

        {/* Columna 2: Líneas de Negocio Gourmet */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">
            Experiencias
          </h4>
          <ul className="space-y-3 text-sm font-medium text-slate-400">
            <li>
              <Link
                href="/carta"
                className="hover:text-amber-500 transition-colors"
              >
                La Carta Fusión
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
                Eventos Privados
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 3: Centro de Ayuda y Soporte Legal */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">
            Soporte
          </h4>
          <ul className="space-y-3 text-sm font-medium text-slate-400">
            <li>
              <Link
                href="/preguntas"
                className="hover:text-amber-500 transition-colors"
              >
                Preguntas frecuentes
              </Link>
            </li>
            <li>
              <Link
                href="/contacto"
                className="hover:text-amber-500 transition-colors"
              >
                Contáctanos
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
          </ul>
        </div>

        {/* Columna 4: Canales Directos Unificados */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">
            Contacto
          </h4>
          <ul className="space-y-3 text-sm font-medium text-slate-400">
            <li className="flex items-center gap-2">
              📍{" "}
              <span className="text-slate-300">Madrid &amp; Toledo centro</span>
            </li>
            <li className="flex items-center gap-2">
              📞{" "}
              <a
                href="tel:+34914356621"
                className="text-slate-300 font-mono hover:text-amber-500 transition-colors"
              >
                91 435 66 21
              </a>
            </li>
            <li className="flex items-center gap-2">
              ✉️{" "}
              <a
                href="mailto:atencionalcliente@caterchef.com"
                className="text-slate-300 font-mono hover:text-amber-500 transition-colors block truncate max-w-[190px] xl:max-w-none"
              >
                atencionalcliente@caterchef.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* --- BLOQUE DE COMPLIANCE: Redes Sociales Reales + Pasarela de Pagos de Alta Fidelidad --- */}
      <div className="max-w-6xl mx-auto px-10 mb-10 border-t border-slate-900 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Subcolumna Izquierda: Redes con logos en blanco puro con el hover exacto var(--color-amber-600) */}
        <div>
          <h5 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-4">
            SÍGUENOS EN
          </h5>
          <div className="flex flex-wrap gap-3">
            {/* Instagram */}
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-slate-900 hover:bg-[var(--color-amber-600)] text-white flex items-center justify-center transition-colors shadow-inner"
              aria-label="Instagram"
            >
              <svg
                className="w-5 h-5 fill-current text-white"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>

            {/* TikTok */}
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-slate-900 hover:bg-[var(--color-amber-600)] flex items-center justify-center transition-colors shadow-inner"
              aria-label="TikTok"
            >
              <svg
                className="w-5 h-5 fill-current text-white"
                viewBox="0 0 24 24"
              >
                <path d="M12.29 0h3.2a6.71 6.71 0 0 0 5.48 5.48v3.25a9.92 9.92 0 0 1-5.48-1.95v7.45a6.77 6.77 0 1 1-11.13-5.24l.07.06v3.42a3.49 3.49 0 1 0 4.31 3.42V0z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-slate-900 hover:bg-[var(--color-amber-600)] text-white flex items-center justify-center transition-colors shadow-inner"
              aria-label="YouTube"
            >
              <svg
                className="w-5 h-5 fill-current text-white"
                viewBox="0 0 24 24"
              >
                <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            {/* Twitter / X */}
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-slate-900 hover:bg-[var(--color-amber-600)] flex items-center justify-center transition-colors shadow-inner"
              aria-label="Twitter"
            >
              <svg
                className="w-4 h-4 fill-current text-white"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-slate-900 hover:bg-[var(--color-amber-600)] flex items-center justify-center transition-colors shadow-inner"
              aria-label="LinkedIn"
            >
              <svg
                className="w-4 h-4 fill-current text-white"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-slate-900 hover:bg-[var(--color-amber-600)] flex items-center justify-center transition-colors shadow-inner"
              aria-label="Facebook"
            >
              <svg
                className="w-5 h-5 fill-current text-white"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Subcolumna Derecha: Pasarelas de Pago Oficiales Actualizadas por CDN */}
        <div className="md:text-right mt-6 md:mt-0">
          <h5 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-4 md:text-right">
            Pago seguro
          </h5>
          <div className="flex flex-wrap md:justify-end gap-3 items-center">
            {/* 1. VISA EN PRIMER LUGAR (Imagen oficial de la CDN de Visa) */}
            <div
              className="h-7 w-12 bg-white rounded flex items-center justify-center px-1 shadow-sm select-none overflow-hidden"
              title="Visa"
            >
              <img
                src="https://cdn.visa.com/v2/assets/images/logos/visa/blue/logo.png"
                alt="Visa"
                className="h-2.5 w-auto object-contain"
              />
            </div>

            {/* --- ACTUALIZADO: 2. BIZUM ORIGINAL (Cargado directamente desde su CDN de accesibilidad oficial) --- */}
            <div
              className="h-7 w-12 bg-white rounded flex items-center justify-center px-1 shadow-sm select-none overflow-hidden"
              title="Bizum"
            >
              <img
                src="https://bizum.com/es/wp-content/uploads/2024/06/bizum-website-accessibility-logo.png"
                alt="Bizum"
                className="h-3.5 w-auto object-contain"
              />
            </div>

            {/* --- ACTUALIZADO: 3. AMERICAN EXPRESS ORIGINAL (Cargado desde la CDN oficial de American Express Blue Box) --- */}
            <div
              className="h-7 w-12 bg-white rounded flex items-center justify-center px-0.0 shadow-sm select-none overflow-hidden"
              title="American Express"
            >
              <img
                src="https://www.aexp-static.com/cdaas/one/statics/axp-static-assets/1.8.0/package/dist/img/logos/dls-logo-bluebox-solid.svg"
                alt="American Express"
                className="h-12 w-auto object-contain"
              />
            </div>

            {/* 3. APPLE PAY - ACTUALIZADO: Caja blanca con ribete marcado y espaciado idéntico a la captura */}
            <div
              className="h-7 w-12 bg-white rounded border border-slate-950 flex items-center justify-center gap-0.5 shadow-sm select-none"
              title="Apple Pay"
            >
              <svg
                viewBox="0 0 384 512"
                className="h-3 w-auto text-black fill-current"
              >
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 24 184.8 8 273.6c-17.7 54.4-4.8 116.5 24.5 168.1 19.3 33.6 42.1 63.8 77.1 61.5 33.7-2.1 48-21.7 89.2-21.7 41.2 0 54 21.7 89.2 21.3 35.8-.4 55.4-27.8 74.3-55.6 22-31.4 30.6-60.5 31.4-62.1-1.3-.5-45.6-17.4-45.6-67.6zM245.9 85.3C263.1 64.9 271.7 40.5 268 16c-21.2 1-47.5 14.8-65.7 34.9-15.6 17.5-26 43.1-21.3 66.8 23.9 1.8 47.9-12.8 64.9-32.4z" />
              </svg>
              <span className="text-[11px] font-sans font-bold text-black tracking-tight pt-0.5">
                Pay
              </span>
            </div>

            {/* 4. G PAY - ACTUALIZADO: Ribete gris y texto "G Pay" con la tipografía e isotipo oficial */}
            <div
              className="h-7 w-12 bg-white rounded border border-slate-800 flex items-center justify-center gap-1 shadow-sm select-none"
              title="Google Pay"
            >
              <svg viewBox="0 0 48 48" className="h-3 w-3">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              <span className="text-[11px] font-medium text-[#5f6368] font-sans tracking-tight pt-0.5">
                Pay
              </span>
            </div>

            {/* 6. MAESTRO (Estructura elíptica original restaurada) */}
            <div
              className="h-7 w-12 bg-white rounded flex items-center justify-center relative shadow-sm overflow-hidden select-none"
              title="Maestro"
            >
              <div className="w-5 h-5 rounded-full bg-[#00A2E8] absolute left-2 opacity-90"></div>
              <div className="w-5 h-5 rounded-full bg-[#FF5F00] absolute right-2 opacity-90"></div>
            </div>

            {/* 7. MASTERCARD (Estructura elíptica original restaurada) */}
            <div
              className="h-7 w-12 bg-white rounded flex items-center justify-center relative shadow-sm overflow-hidden select-none"
              title="Mastercard"
            >
              <div className="w-5 h-5 rounded-full bg-[#EB001B] absolute left-2 opacity-90"></div>
              <div className="w-5 h-5 rounded-full bg-[#F79E1B] absolute right-2 opacity-90"></div>
            </div>

            {/* 8. PAYPAL */}
            <div
              className="h-7 w-12 bg-white rounded flex items-center justify-center shadow-sm select-none"
              title="PayPal"
            >
              <span className="text-[9px] font-sans font-black italic text-[#003087]">
                Pay<span className="text-[#0079C1]">Pal</span>
              </span>
            </div>

            {/* --- SE MANTIENE ELIMINADA SHOP PAY Y UNION PAY --- */}
          </div>
        </div>
      </div>

      {/* Franja Inferior de Autoría Legal */}
      <div className="max-w-6xl mx-auto px-10 pt-8 border-t border-slate-800 text-center flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-slate-600 font-medium">
          © {new Date().getFullYear()} CaterChef Fusión. Proyecto TFG DAW - Juan
          Campos.
        </p>
        <div className="flex gap-4">
          <span className="text-slate-600 text-xs font-bold bg-slate-900 px-3 py-1 rounded-full border border-slate-800 select-none">
            🔒 Entorno SSL Verificado
          </span>
          <span className="text-slate-600 text-xs font-bold bg-slate-900 px-3 py-1 rounded-full border border-slate-800 select-none">
            RGPD Compliant
          </span>
        </div>
      </div>
    </footer>
  );
}
