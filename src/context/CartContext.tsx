"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface Plato {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  alergenos: string;
  disponible: boolean;
  imagen_url?: string;
}

export interface ItemCarrito {
  plato: Plato;
  cantidad: number;
}

interface CartContextType {
  carrito: ItemCarrito[];
  agregarAlCarrito: (plato: Plato, cantidad: number) => void;
  quitarDelCarrito: (idPlato: number) => void;
  incrementarCantidad: (idPlato: number) => void;
  decrementarCantidad: (idPlato: number) => void;
  vaciarCarrito: () => void;
  totalItems: number;
  totalPrecioBase: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [estaMontado, setEstaMontado] = useState(false);

  useEffect(() => {
    const carritoGuardado = localStorage.getItem("carrito_caterchef");
    if (carritoGuardado) setCarrito(JSON.parse(carritoGuardado));
    setEstaMontado(true);
  }, []);

  useEffect(() => {
    if (estaMontado)
      localStorage.setItem("carrito_caterchef", JSON.stringify(carrito));
  }, [carrito, estaMontado]);

  const agregarAlCarrito = (plato: Plato, unidades: number = 1) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.plato.id === plato.id);
      if (existe) {
        return prev.map((item) =>
          item.plato.id === plato.id
            ? { ...item, cantidad: Math.min(item.cantidad + unidades, 30) }
            : item,
        );
      }
      return [...prev, { plato, cantidad: unidades }];
    });
  };

  const quitarDelCarrito = (idPlato: number) => {
    setCarrito((prev) => prev.filter((item) => item.plato.id !== idPlato));
  };

  const incrementarCantidad = (idPlato: number) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item.plato.id === idPlato
          ? { ...item, cantidad: Math.min(item.cantidad + 1, 30) }
          : item,
      ),
    );
  };

  const decrementarCantidad = (idPlato: number) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item.plato.id === idPlato
          ? { ...item, cantidad: Math.max(item.cantidad - 1, 1) }
          : item,
      ),
    );
  };

  const vaciarCarrito = () => setCarrito([]);

  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
  const totalPrecioBase = carrito.reduce(
    (total, item) => total + item.plato.precio * item.cantidad,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        quitarDelCarrito,
        incrementarCantidad,
        decrementarCantidad,
        vaciarCarrito,
        totalItems,
        totalPrecioBase,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart debe usarse dentro de un CartProvider");
  return context;
};
