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

  // Al cargar la web, miramos si ya teníamos un token guardado (persistencia de sesión)
  useEffect(() => {
    const tokenGuardado = localStorage.getItem("token_caterchef");
    if (tokenGuardado) {
      setToken(tokenGuardado);
    }
  }, []);

  // Función para guardar el token cuando nos lo da el Backend
  const iniciarSesion = (nuevoToken: string) => {
    localStorage.setItem("token_caterchef", nuevoToken);
    setToken(nuevoToken);
  };

  // Función para borrar el token (Logout)
  const cerrarSesion = () => {
    localStorage.removeItem("token_caterchef");
    setToken(null);
  };

  // Variable derivada: Si hay token, está logueado. Si no, no.
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
