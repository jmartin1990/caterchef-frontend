import React from "react";
import { render, screen } from "@testing-library/react";
import Page from "../app/page";

// --- MOCK DEL ROUTER DE NEXT.JS ---
// Esto engaña al componente para que crea que está dentro de un router válido
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

describe("Pruebas Unitarias del Frontend - CaterChef Fusión", () => {
  it("Debería renderizar la página de inicio correctamente sin colapsar", () => {
    // Usamos renderizado básico
    const { container } = render(<Page />);

    // Verificamos que al menos se monta un div contenedor principal
    const elementoPrincipal =
      container.querySelector("main") || container.querySelector("div");

    expect(elementoPrincipal).toBeInTheDocument();
  });
});
