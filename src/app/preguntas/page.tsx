// src/app/faqs/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

interface FAQItem {
  id: number;
  pregunta: string;
  respuesta: React.ReactNode;
}

export default function FAQsPage() {
  // Estado para controlar qué acordeón está expandido (null si todos están cerrados)
  const [abiertoId, setAbiertoId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setAbiertoId(abiertoId === id ? null : id);
  };

  const listaFAQs: FAQItem[] = [
    {
      id: 1,
      pregunta: "Cómo comprar",
      respuesta: (
        <div className="space-y-3">
          <p>
            Comprar en nuestra plataforma online es muy sencillo: sólo tienes
            que elegir un plato de firma o dósier, incorporarlo a la cesta
            pulsando sobre el botón de añadir y tramitar el pedido empleando el
            medio de pago que tú elijas.
          </p>
          <p>
            Nuestra web está dividida en dos grandes líneas operativas
            independientes:
          </p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>
              <strong className="text-slate-900">La Carta Fusión:</strong>{" "}
              Platos gourmet preparados al momento y enviados listos para
              consumir o con sencillas instrucciones de regeneración térmica.
            </li>
            <li>
              <strong className="text-slate-900">
                Servicio de Chef Privado y Eventos:
              </strong>{" "}
              Contrataciones exclusivas a medida donde nuestro equipo se
              desplaza físicamente a tu domicilio o finca corporativa.
            </li>
          </ol>
        </div>
      ),
    },
    {
      id: 2,
      pregunta: "Cómo pagar",
      respuesta: (
        <div className="space-y-3">
          <p>
            Podrás abonar el importe seguro de tus pedidos a través de los
            siguientes métodos homologados:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Tarjetas de débito o crédito{" "}
              <strong className="text-slate-900">
                VISA, Mastercard y American Express
              </strong>{" "}
              sin recargo adicional.
            </li>
            <li>
              Pasarelas express integradas:{" "}
              <strong className="text-slate-900">Google Pay y Apple Pay</strong>
              .
            </li>
            <li>
              Transferencia bancaria instantánea mediante{" "}
              <strong className="text-slate-900">Bizum</strong>.
            </li>
            <li>
              Financiación flexible con{" "}
              <strong className="text-slate-900">Klarna</strong> (disponible
              para contrataciones superiores a 100€).
            </li>
          </ul>
          <p className="text-xs text-amber-600 font-semibold animate-pulse">
            💡 Nota UX: Al utilizar métodos express, comprueba que la dirección
            de entrega guardada en dicha cuenta externa coincide con el lugar
            del evento.
          </p>
        </div>
      ),
    },
    {
      id: 3,
      pregunta: "Gastos de envío",
      respuesta: (
        <div className="space-y-2">
          <p>
            Nuestra base operativa distribuye de forma diaria e integral en toda
            la Comunidad de Madrid y Toledo centro:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong className="text-slate-900">Tarifa Plana Base:</strong>{" "}
              4.90€ para pedidos inferiores al umbral de fidelización.
            </li>
            <li>
              <strong className="text-slate-900">Envío Gratuito:</strong>{" "}
              Aplicable de forma automática en el checkout para todos aquellos
              pedidos que alcancen o superen los{" "}
              <strong className="text-amber-600">80.00€</strong> de base.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 4,
      pregunta: "Plazos de entrega",
      respuesta: (
        <div className="space-y-3">
          <p>
            <strong className="text-slate-900">1. Pedidos de Carta:</strong> Al
            tramitar tu carrito multi-paso, tendrás un selector obligatorio de
            fecha y hora. Repartimos en franjas programadas para garantizar la
            cadena de frío y frescura de los alimentos.
          </p>
          <p>
            <strong className="text-slate-900">2. Logística de Eventos:</strong>{" "}
            En servicios de Chef Privado, el equipo culinario llegará a la
            localización acordada con un mínimo de 2 horas de antelación
            respecto a la hora fijada para el servicio.
          </p>
        </div>
      ),
    },
    {
      id: 5,
      pregunta: "Facturación",
      respuesta: (
        <p>
          Puedes descargar la factura fiscalizada de tu pedido accediendo a tu
          área privada en{" "}
          <Link
            href="/perfil/cuenta"
            className="font-bold text-amber-600 underline"
          >
            Mi Cuenta
          </Link>
          . Si necesitas modificar los datos fiscales corporativos (Razón Social
          o CIF/NIF), escríbenos a{" "}
          <a
            href="mailto:atencionalcliente@caterchef.com"
            className="font-bold underline"
          >
            atencionalcliente@caterchef.com
          </a>{" "}
          adjuntando el código de ticket.
        </p>
      ),
    },
    {
      id: 6,
      pregunta: "Devoluciones",
      respuesta: (
        <div className="space-y-2">
          <p>
            Debido a la naturaleza perecedera de nuestros productos alimenticios
            elaborados al momento,{" "}
            <strong className="text-slate-900">
              no se admiten devoluciones por motivos comerciales
            </strong>{" "}
            una vez el pedido ha salido de nuestras cocinas.
          </p>
          <p>
            En caso de incidencias de transporte o rotura de packaging, dispones
            de un plazo de 24 horas desde la recepción para comunicarlo a{" "}
            <a
              href="mailto:catering@caterchef.com"
              className="font-bold text-red-500 underline"
            >
              catering@caterchef.com
            </a>{" "}
            adjuntando imágenes del estado del lote para tramitar el reembolso
            íntegro inmediato.
          </p>
        </div>
      ),
    },
    {
      id: 7,
      pregunta: "Suscripción a la newsletter",
      respuesta: (
        <p>
          Al registrarte en nuestra plataforma web o activar la casilla de
          envíos comerciales, recibirás un{" "}
          <strong className="text-emerald-600">
            cupón del 5% de descuento directo
          </strong>{" "}
          aplicable de manera inmediata sobre tu primer pedido online de la
          carta fusión.
        </p>
      ),
    },
    {
      id: 8,
      pregunta: "Pedidos para empresas",
      respuesta: (
        <p>
          Somos especialistas en alta cocina corporativa, coffees diplomáticos y
          recepciones de embajadas. Disponemos de dósieres llave en mano
          parametrizables. Puedes solicitar un presupuesto formal escribiendo
          directamente a nuestro departamento ejecutivo en{" "}
          <a
            href="mailto:regalosgourmet@caterchef.com"
            className="font-bold text-amber-600 hover:underline"
          >
            regalosgourmet@caterchef.com
          </a>{" "}
          o llamando al teléfono móvil corporativo.
        </p>
      ),
    },
    {
      id: 9,
      pregunta: "Política de precios por región o provincia",
      respuesta: (
        <p>
          Los precios reflejados en el catálogo digital están vinculados a los
          costes logísticos y de aprovisionamiento en origen (Mercamadrid y
          proveedores directos del Perú). El precio final garantizado y
          vinculante será estrictamente el desglosado en el último paso del DOM
          de pagos del carrito.
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-[75vh] bg-slate-50 font-sans text-slate-800 py-16 px-6 md:px-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <span className="text-amber-600 font-bold tracking-[0.2em] uppercase text-xs mb-3 block">
            Soporte al Anfitrión
          </span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Preguntas Frecuentes
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Todo lo que necesitas saber sobre nuestra logística, métodos de pago
            y normativa RGPD.
          </p>
        </header>

        {/* Estructura de Acordeones */}
        <div className="space-y-4">
          {listaFAQs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-5 text-left font-bold text-slate-800 hover:text-amber-600 flex justify-between items-center transition-colors outline-none cursor-pointer"
              >
                <span>{faq.pregunta}</span>
                <span
                  className={`text-xl font-light transform transition-transform duration-300 ${abiertoId === faq.id ? "rotate-45 text-amber-600" : "text-slate-400"}`}
                >
                  ＋
                </span>
              </button>

              {/* Contenido colapsable condicional */}
              {abiertoId === faq.id && (
                <div className="px-6 pb-6 pt-1 text-sm text-slate-600 border-t border-slate-50 leading-relaxed animate-fade-in bg-slate-50/30">
                  {faq.respuesta}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
