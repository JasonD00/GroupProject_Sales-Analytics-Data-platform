/*
  Unit tests for AuthContext
  Covers the login/logout states and the hasFeatures() tier comparison logic
*/

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';

function TestComponent() {
  const { user, token, login, logout, hasFeature } = useAuth();

  return (
    <div>
      <button
        onClick={() =>
          login({ username: 'josh', tier: 'ENTERPRISE', token: 'mock-token-123' })
        }
      >
        Login as Enterprise
      </button>
      <button
        onClick={() =>
          login({ username: 'growthuser', tier: 'GROWTH', token: 'mock-token-456' })
        }
      >
        Login as Growth
      </button>
      <button onClick={logout}>Logout</button>

      <span data-testid="username">{user?.username || 'none'}</span>
      <span data-testid="tier">{user?.tier || 'none'}</span>
      <span data-testid="token">{token || 'none'}</span>
      <span data-testid="hasGrowth">{hasFeature('Growth') ? 'yes' : 'no'}</span>
      <span data-testid="hasPro">{hasFeature('Pro') ? 'yes' : 'no'}</span>
      <span data-testid="hasEnterprise">{hasFeature('Enterprise') ? 'yes' : 'no'}</span>
    </div>
  );
}

function renderWithAuth() {
  return render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
}

describe('AuthContext', () => {

  it('has no user and no token before logging in', () => {
    renderWithAuth();
    expect(screen.getByTestId('username').textContent).toBe('none');
    expect(screen.getByTestId('token').textContent).toBe('none');
  });

  it('hasFeature returns false for every tier when not logged in', () => {
    renderWithAuth();
    expect(screen.getByTestId('hasGrowth').textContent).toBe('no');
    expect(screen.getByTestId('hasPro').textContent).toBe('no');
    expect(screen.getByTestId('hasEnterprise').textContent).toBe('no');
  });

  it('stores username, tier and token after login', () => {
    renderWithAuth();
    fireEvent.click(screen.getByText('Login as Enterprise'));

    expect(screen.getByTestId('username').textContent).toBe('josh');
    expect(screen.getByTestId('tier').textContent).toBe('ENTERPRISE');
    expect(screen.getByTestId('token').textContent).toBe('mock-token-123');
  });

  it('an Enterprise user has access to Growth, Pro and Enterprise features', () => {
    renderWithAuth();
    fireEvent.click(screen.getByText('Login as Enterprise'));

    expect(screen.getByTestId('hasGrowth').textContent).toBe('yes');
    expect(screen.getByTestId('hasPro').textContent).toBe('yes');
    expect(screen.getByTestId('hasEnterprise').textContent).toBe('yes');
  });

  it('a Growth user only has access to Growth features', () => {
    renderWithAuth();
    fireEvent.click(screen.getByText('Login as Growth'));

    expect(screen.getByTestId('hasGrowth').textContent).toBe('yes');
    expect(screen.getByTestId('hasPro').textContent).toBe('no');
    expect(screen.getByTestId('hasEnterprise').textContent).toBe('no');
  });

  it('clears user and token on logout', () => {
    renderWithAuth();
    fireEvent.click(screen.getByText('Login as Enterprise'));
    expect(screen.getByTestId('username').textContent).toBe('josh');

    fireEvent.click(screen.getByText('Logout'));
    expect(screen.getByTestId('username').textContent).toBe('none');
    expect(screen.getByTestId('token').textContent).toBe('none');
  });

});