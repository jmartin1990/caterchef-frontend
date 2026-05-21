// src/app/perfil/password/page.tsx
"use client";

import { useState, SyntheticEvent } from "react";
import { useAuth } from "@/context/AuthContext";

export default function CambiarPassword() {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    actual: "",
    nueva: "",
    repetida: "",
  });

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (formData.nueva !== formData.repetida) {
      alert("Las contraseñas nuevas no coinciden.");
      return;
    }
    if (formData.nueva.length < 6) {
      alert("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/me/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password_actual: formData.actual,
          password_nueva: formData.nueva,
        }),
      });

      if (res.ok) {
        alert("¡Contraseña modificada correctamente!");
        setFormData({ actual: "", nueva: "", repetida: "" });
      } else {
        const error = await res.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      alert("Fallo de conexión con el servidor de seguridad.");
    }
  };

  return (
    <div className="animate-fade-in max-w-3xl">
      <h1 className="text-3xl font-black text-slate-900 mb-8">
        Cambiar contraseña
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm"
      >
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
          Seguridad de la cuenta
        </h2>

        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Contraseña actual
          </label>
          <input
            type="password"
            required
            value={formData.actual}
            onChange={(e) =>
              setFormData({ ...formData, actual: e.target.value })
            }
            className="w-full md:w-1/2 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Nueva contraseña
            </label>
            <input
              type="password"
              required
              value={formData.nueva}
              onChange={(e) =>
                setFormData({ ...formData, nueva: e.target.value })
              }
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Repita nueva contraseña
            </label>
            <input
              type="password"
              required
              value={formData.repetida}
              onChange={(e) =>
                setFormData({ ...formData, repetida: e.target.value })
              }
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <button
            type="submit"
            className="bg-amber-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-amber-700 transition-colors shadow-md"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}
