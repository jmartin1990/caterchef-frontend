// src/app/privacidad/page.tsx
"use client";

import Link from "next/link";

export default function PoliticaPrivacidad() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 font-sans p-8 md:p-16">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
        {/* Encabezado */}
        <header className="border-b border-slate-100 pb-6 mb-8">
          <Link
            href="/"
            className="text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1 mb-4"
          >
            ← Volver a la Carta Fusión
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Política de Privacidad y Protección de Datos
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-2">
            Última actualización: Mayo de 2026 | Cumplimiento Normativo RGPD
          </p>
        </header>

        {/* Cuerpo del Documento Legal */}
        <div className="space-y-6 text-sm md:text-base text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              1. Responsable del Tratamiento
            </h2>
            <p>
              En virtud de lo dispuesto en el Reglamento General de Protección
              de Datos (RGPD), se informa al usuario de que los datos personales
              facilitados a través de la plataforma{" "}
              <strong>CaterChef Fusión</strong> serán incorporados a los
              sistemas de información automatizados del responsable del proyecto
              con fines organizativos y de gestión del servicio de catering y
              chef privado.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              2. Finalidad de la Recogida de Datos
            </h2>
            <p>
              Los datos solicitados en nuestros formularios se tratan con las
              siguientes finalidades perimetrales:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Gestión de Perfiles:</strong> Almacenar credenciales
                seguras cifradas mediante algoritmos de hash hash (Bcrypt) para
                acceso recurrente.
              </li>
              <li>
                <strong>Logística de Pedidos:</strong> Procesar las direcciones,
                distritos, ciudades (Madrid/Toledo) y números de teléfono móvil
                necesarios para la entrega física de los platos o la asistencia
                del Chef.
              </li>
              <li>
                <strong>Listas de Espera:</strong> Enviar alertas automatizadas
                por correo electrónico cuando los platos de cocina fusión
                vuelvan a estar disponibles.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              3. Legitimación y Conservación
            </h2>
            <p>
              La base legal para el tratamiento de sus datos es el{" "}
              <strong>consentimiento expreso</strong> del usuario al marcar la
              casilla de aceptación en nuestro formulario de registro. Los datos
              se conservarán en nuestra base de datos relacional de Neon
              mientras la cuenta permanezca activa o hasta que el interesado
              ejerza su derecho de supresión.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              4. Medidas de Seguridad de los Datos
            </h2>
            <p>
              Garantizamos la seguridad perimetral de la información mediante el
              uso de protocolos seguros de transmisión de datos a través de la
              red (HTTPS), el control estricto de acceso a la API de FastAPI
              mediante tokens firmados electrónicamente (JWT Bearer tokens), y
              la persistencia aislada de las entidades relacionales en la nube.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              5. Derechos ARCO
            </h2>
            <p>
              Los usuarios pueden ejercer en cualquier momento sus derechos de
              acceso, rectificación, cancelación, oposición, limitación del
              tratamiento y portabilidad de los datos dirigiéndose al
              administrador del sistema o eliminando su perfil desde la interfaz
              del cliente.
            </p>
          </section>

          {/* Nota Técnica del TFG */}
          <blockquote className="bg-amber-50/60 border-l-4 border-amber-500 rounded-r-xl p-4 mt-8 text-xs text-amber-800 font-medium">
            📌 <strong>Nota informativa académica (TFG):</strong> Esta página
            cumple con los requisitos del módulo de despliegue y desarrollo web
            del ciclo de DAW, simulando la declaración legal requerida para un
            entorno de producción real auditado.
          </blockquote>
        </div>

        {/* Pie de página */}
        <footer className="border-t border-slate-100 pt-6 mt-8 text-center">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            CaterChef Fusión © 2026 - Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </main>
  );
}
