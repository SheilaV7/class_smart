import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { Navigation } from "../../../src/components/users/Navigation";
import '@testing-library/jest-dom';

// Mocker de useNavigate
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    useNavigate: () => jest.fn(),
  };
});

describe('Navigation component', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );
  });

  test('renders links', () => {
    expect(screen.getByTestId('link-products')).toBeInTheDocument();
    expect(screen.getByTestId('link-users')).toBeInTheDocument();
    expect(screen.getByTestId('link-categorias')).toBeInTheDocument();
    expect(screen.getByTestId('link-pedidos')).toBeInTheDocument();
    expect(screen.getByTestId('link-dashboard')).toBeInTheDocument();
  });

  test('opens and closes search modal', () => {
    fireEvent.click(screen.getByTestId('search-icon'));
    expect(screen.getByTestId('search-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('cancel-button'));
    expect(screen.queryByTestId('search-modal')).not.toBeInTheDocument();
  });

  test('select dropdown for search criteria', () => {
    fireEvent.click(screen.getByTestId('search-icon'));
    const select = screen.getByTestId('search-select');
    expect(select.value).toBe('username');
    fireEvent.change(select, { target: { value: 'email' } });
    expect(select.value).toBe('email');
  });

  test('opens floating menu and create user', () => {
    fireEvent.click(screen.getByTestId('menu-button'));
    expect(screen.getByTestId('menu-create-user')).toBeInTheDocument();
  });

  test('opens permission dropdown and selects item', () => {
    fireEvent.click(screen.getByTestId('menu-button'));
    fireEvent.click(screen.getByTestId('menu-permissions'));
    expect(screen.getByTestId('filter-clients')).toBeInTheDocument();
  });

  test('logout button works', () => {
    const spy = jest.spyOn(Storage.prototype, 'removeItem');
    fireEvent.click(screen.getByTestId('logout-button'));
    expect(spy).toHaveBeenCalledWith('authToken');
  });
});
