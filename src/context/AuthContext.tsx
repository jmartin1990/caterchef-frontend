// src/context/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// TFG: Definimos la estructura de nuestro "Contexto Global"
interface AuthContextType {
  token: string | null;
  estaLogueado: boolean;
  iniciarSesion: (nuevoToken: string) => void;
  cerrarSesion: () => void;
}

// Creamos el contexto vacío inicialmente
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Este es el "Envoltorio" que pondremos alrededor de toda la app
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  // --- ACTUALIZADO: Validación activa de "Token Fantasma" (Seguridad TFG) ---
  // Al cargar la web, miramos si hay token y verificamos su validez con FastAPI
  useEffect(() => {
    const tokenGuardado = localStorage.getItem("token_caterchef");

    if (tokenGuardado) {
      // Hacemos una petición silenciosa para validar la firma del JWT
      fetch("http://localhost:8000/api/me", {
        headers: { Authorization: `Bearer ${tokenGuardado}` },
      })
        .then((res) => {
          if (res.ok) {
            // El servidor confirma que el token está vivo
            setToken(tokenGuardado);
          } else {
            // El token ha caducado o es inválido (Error 401 Unauthorized)
            console.warn(
              "🛡️ Sesión caducada o inválida: Limpiando token fantasma.",
            );
            localStorage.removeItem("token_caterchef");
            setToken(null);
          }
        })
        .catch((err) => {
          // Si el backend está apagado, mantenemos el token por tolerancia a fallos de red
          console.error("Error de red al validar la sesión:", err);
          setToken(tokenGuardado);
        });
    }
  }, []);

  // Función para guardar el token cuando nos lo da el Backend
  const iniciarSesion = (nuevoToken: string) => {
    localStorage.setItem("token_caterchef", nuevoToken);
    setToken(nuevoToken);
  };

  // Función para borrar el token (Logout manual o programado)
  const cerrarSesion = () => {
    localStorage.removeItem("token_caterchef");
    setToken(null);
  };

  // Variable derivada: Si el estado de React tiene token, es una sesión válida comprobada
  const estaLogueado = !!token;

  return (
    <AuthContext.Provider
      value={{ token, estaLogueado, iniciarSesion, cerrarSesion }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto fácilmente en cualquier componente
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
