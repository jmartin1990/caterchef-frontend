"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ANUNCIOS = [
  "🚚 Entrega en 24/48 horas (laborables de lunes a viernes)",
  "✨ Envíos por 4,90€ a Madrid y Toledo. ¡GRATIS en compras superiores a 80€!",
];

export default function AnnouncementBar() {
  const [indiceActual, setIndiceActual] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Cambia de slide de texto cada 4 segundos (tiempo óptimo de lectura)
    const intervalo = setInterval(() => {
      setIndiceActual((prev) => (prev + 1) % ANUNCIOS.length);
    }, 4000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div
      onClick={() => router.push("/envios-y-devoluciones")}
      className="bg-slate-900 text-white text-center py-2 px-4 text-xs font-semibold tracking-wide cursor-pointer hover:bg-amber-600 transition-colors duration-300 select-none overflow-hidden relative h-8 flex items-center justify-center"
    >
      <div key={indiceActual} className="animate-fade-in truncate">
        {ANUNCIOS[indiceActual]}
      </div>
    </div>
  );
}
