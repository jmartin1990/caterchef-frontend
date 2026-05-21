// src/app/perfil/cuenta/page.tsx
"use client";

import { useEffect, useState, SyntheticEvent } from "react";
import { useAuth } from "@/context/AuthContext";

export default function MiCuenta() {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
  });
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (token) {
      fetch("http://127.0.0.1:8000/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) =>
          setFormData({
            nombre: data.nombre,
            apellidos: data.apellidos || "",
            email: data.email || "cargando...",
            telefono: data.telefono || "",
          }),
        );
    }
  }, [token]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          telefono: formData.telefono,
        }),
      });
      if (res.ok) alert("¡Perfil actualizado con éxito!");
      else alert("Error al actualizar el perfil");
    } catch (error) {
      alert("Fallo de conexión.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-3xl">
      <h1 className="text-3xl font-black text-slate-900 mb-8">Mi cuenta</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm"
      >
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
          Perfil Personal
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Apellidos
            </label>
            <input
              type="text"
              value={formData.apellidos}
              onChange={(e) =>
                setFormData({ ...formData, apellidos: e.target.value })
              }
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Email{" "}
              <span className="text-slate-400 font-normal">(No editable)</span>
            </label>
            <input
              type="email"
              disabled
              value={formData.email}
              className="w-full border border-slate-100 bg-slate-50 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              required
              value={formData.telefono}
              onChange={(e) =>
                setFormData({ ...formData, telefono: e.target.value })
              }
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <button
            type="submit"
            disabled={guardando}
            className="bg-amber-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-amber-700 transition-colors shadow-md disabled:bg-slate-300"
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
