import { Link } from "react-router-dom"
import  { useState } from 'react';
import { ChevronDown, Search, Plus, LogOut } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import React from "react";
import { NavLink } from 'react-router-dom'


export function Navigation() {
  const [searchCriteria, setSearchCriteria] = useState('username');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isPermissionDropdownOpen, setIsPermissionDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const togglePermissionDropdown = (e) => {
    e.stopPropagation();
    setIsPermissionDropdownOpen(!isPermissionDropdownOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    setIsPermissionDropdownOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/users/' + searchCriteria + '/' + searchTerm);
  };

  return (
    <nav className="text-white p-4" style={{ backgroundColor: "#0FA0CC" }} data-testid="navigation-bar">
      <div className="container mx-auto flex justify-between items-center">

        <Link to="/products" className="text-xl font-bold hover:scale-110" data-testid="link-products">
          Productos
        </Link>

        <NavLink to="/users" className="text-xl font-bold hover:scale-110" data-testid="link-users">
          Usuarios
        </NavLink>

        <Link to="/categorias" className="text-xl font-bold hover:scale-110" data-testid="link-categorias">
          Categorias
        </Link>

        <Link to="/pedidos" className="text-xl font-bold hover:scale-110" data-testid="link-pedidos">
          Pedidos
        </Link>

        <Link to="/dashboard" className="text-xl font-bold hover:scale-110" data-testid="link-dashboard">
          Dashboard
        </Link>

        {/* Ícono de búsqueda */}
        <div className="relative flex items-center space-x-4">
          <div
            className="cursor-pointer"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            data-testid="search-icon"
          >
            <Search size={24} />
          </div>

          {/* Modal de búsqueda */}
          {isSearchOpen && (
            <div className="fixed inset-0 left-[-20px] bg-black bg-opacity-50 z-50 flex items-center justify-center" data-testid="search-modal">
              <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    type="text"
                    placeholder={`Buscar usuario por ${searchCriteria}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border rounded-l-lg focus:outline-none text-black"
                    data-testid="search-input"
                  />
                  <button
                    type="submit"
                    className="bg-[#0FA0CC] text-white px-4 py-2 rounded-r-lg hover:bg-[#0c88ad]"
                    data-testid="search-button"
                  >
                    <Search size={20} />
                  </button>
                </form>

                <select
                  className="w-full px-4 py-2 border rounded-lg mt-3 text-black"
                  name="busqueda"
                  onChange={(e) => setSearchCriteria(e.target.value)}
                  data-testid="search-select"
                >
                  <option value="username">Nombre</option>
                  <option value="email">Email</option>
                </select>

                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="mt-4 w-full bg-[#0FA0CC] py-2 rounded-lg hover:bg-red-600"
                  data-testid="cancel-button"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Botón de cerrar sesión */}
      <div className="fixed bottom-4 left-4">
        <button
          className="text-white p-2 rounded-full shadow-lg"
          style={{ backgroundColor: "#0FA0CC" }}
          onClick={() => {
            localStorage.removeItem('authToken');
            navigate('/client');
          }}
          data-testid="logout-button"
        >
          <LogOut size={24} />
        </button>
      </div>

      {/* Botón de menú flotante */}
      <div className="fixed bottom-4 right-4">
        <div className="relative">
          <button
            className="text-white p-4 rounded-full shadow-lg"
            style={{ backgroundColor: "#0FA0CC" }}
            onClick={toggleUserDropdown}
            data-testid="menu-button"
          >
            <Plus size={24} />
          </button>

          {isUserDropdownOpen && (
            <div className="absolute bottom-full right-0 mb-2 bg-white text-black shadow-lg rounded-md w-48 z-10">
              <ul className="py-2">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    navigate('/client');
                    setIsUserDropdownOpen(false);
                  }}
                  data-testid="menu-client"
                >
                  Ir a Seccion del Cliente
                </li>

                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    navigate('/users-create');
                    setIsUserDropdownOpen(false);
                  }}
                  data-testid="menu-create-user"
                >
                  Crear usuario
                </li>

                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer relative"
                  onClick={togglePermissionDropdown}
                  data-testid="menu-permissions"
                >
                  <div className="flex items-center justify-between">
                    Ver por Permisos <ChevronDown size={16} />
                  </div>

                  {isPermissionDropdownOpen && (
                    <div className="absolute bottom-0 right-full bg-white text-black shadow-lg rounded-md w-48 z-20">
                      <ul className="py-2">
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/users');
                            setIsUserDropdownOpen(false);
                          }}
                          data-testid="filter-all"
                        >
                          Ver Todo
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/users/is_staff/false');
                            setIsUserDropdownOpen(false);
                          }}
                          data-testid="filter-clients"
                        >
                          Clientes
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/users/is_staff/true');
                            setIsUserDropdownOpen(false);
                          }}
                          data-testid="filter-employees"
                        >
                          Empleados
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/users/is_superuser/true');
                            setIsUserDropdownOpen(false);
                          }}
                          data-testid="filter-superusers"
                        >
                          Super Usuarios
                        </li>
                      </ul>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
