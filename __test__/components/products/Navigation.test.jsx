// tests/components/products/Navigation.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Navigation } from "../../../src/components/products/Navigation.jsx";
import { BrowserRouter } from "react-router-dom";
import * as categoriesApi from "../../../src/api/categories.api";
import '@testing-library/jest-dom';

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

jest.mock("../../../src/api/categories.api", () => ({
  getAllCategories: jest.fn(),
}));

describe("Navigation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renderiza correctamente y muestra los enlaces", async () => {
    categoriesApi.getAllCategories.mockResolvedValue({
      data: [{ id: 1, nombre_categoria: "Ropa" }]
    });

    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );

    expect(screen.getByText("Productos")).toBeInTheDocument();
    expect(screen.getByText("Usuarios")).toBeInTheDocument();
    expect(screen.getByText("Categorias")).toBeInTheDocument();
    expect(screen.getByText("Pedidos")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();

    await waitFor(() => {
      expect(categoriesApi.getAllCategories).toHaveBeenCalled();
    });
  });

  test("abre y cierra la búsqueda", () => {
    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );

    const searchIcon = screen.getByTestId("search-icon");
    fireEvent.click(searchIcon);

    expect(screen.getByPlaceholderText("Buscar producto por nombre")).toBeInTheDocument();

    const cancelar = screen.getByTestId("cancelar-busqueda");
    fireEvent.click(cancelar);

    expect(screen.queryByPlaceholderText("Buscar producto por nombre")).not.toBeInTheDocument();
  });

  test("realiza búsqueda y navega", () => {
    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );

    const searchIcon = screen.getByTestId("search-icon");
    fireEvent.click(searchIcon);

    const input = screen.getByPlaceholderText("Buscar producto por nombre");
    fireEvent.change(input, { target: { value: "zapatillas" } });

    const form = input.closest("form");
    fireEvent.submit(form);

    expect(mockedNavigate).toHaveBeenCalledWith("/products/nombre/zapatillas");
  });

  test("navega al crear producto desde el botón flotante", async () => {
    categoriesApi.getAllCategories.mockResolvedValue({
      data: [{ id: 1, nombre_categoria: "Accesorios" }]
    });

    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );

    const fab = screen.getByTestId("fab-button");
    fireEvent.click(fab);

    const crearProducto = await screen.findByText("Crear Producto");
    fireEvent.click(crearProducto);

    expect(mockedNavigate).toHaveBeenCalledWith("/product-create");
  });

  test("muestra y usa las categorías en el submenú", async () => {
    categoriesApi.getAllCategories.mockResolvedValue({
      data: [{ id: 2, nombre_categoria: "Tecnología" }]
    });

    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );

    const fab = screen.getByTestId("fab-button");
    fireEvent.click(fab);

    const verPorCategoria = await screen.findByText("Ver por categoría");
    fireEvent.click(verPorCategoria);

    const categoriaItem = await screen.findByText("Tecnología");
    fireEvent.click(categoriaItem);

    expect(mockedNavigate).toHaveBeenCalledWith("/products/categoria_id/2");
  });

  test("cerrar sesión limpia el token y redirige", () => {
    localStorage.setItem("authToken", "abc123");

    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );

    const logoutButton = screen.getByTestId("logout-button");
    fireEvent.click(logoutButton);

    expect(localStorage.getItem("authToken")).toBe(null);
    expect(mockedNavigate).toHaveBeenCalledWith("/login");
  });
});
