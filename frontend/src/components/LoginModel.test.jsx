/*
  Unit tests for LoginModel — covers form validation for both
  the Sign In and Create Account tabs, and switching between them.
*/

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginModel from '../components/LoginModel';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';

function renderLoginModel() {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <LoginModel />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

describe('LoginModel', () => {

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('renders in Sign In mode by default', () => {
    renderLoginModel();
    expect(screen.getByText('Sign In', { selector: 'h2' })).toBeInTheDocument();
  });

  it('shows an error when trying to sign in with an empty username', () => {
    renderLoginModel();
    const signInButtons = screen.getAllByText('Sign In');
    fireEvent.click(signInButtons[signInButtons.length - 1]);

    expect(screen.getByText('Please enter your username')).toBeInTheDocument();
  });

  it('shows an error when username is filled but password is empty', () => {
    renderLoginModel();

    const usernameInput = screen.getByPlaceholderText('Enter your username');
    fireEvent.change(usernameInput, { target: { value: 'josh' } });

    const signInButtons = screen.getAllByText('Sign In');
    fireEvent.click(signInButtons[signInButtons.length - 1]);

    expect(screen.getByText('Please enter your password')).toBeInTheDocument();
  });

  it('switches to Create Account mode when the tab is clicked', () => {
    renderLoginModel();
    fireEvent.click(screen.getByText('Create Account', { selector: 'button' }));

    expect(screen.getByText('Create Account', { selector: 'h2' })).toBeInTheDocument();
    expect(screen.getByText('Subscription Plan')).toBeInTheDocument();
  });

  it('defaults to the Growth tier when creating an account', () => {
    renderLoginModel();
    const tabButtons = screen.getAllByText('Create Account');
    fireEvent.click(tabButtons[0]);

    const growthOption = screen.getByText('Growth');
    expect(growthOption).toBeInTheDocument();
  });

  it('shows a password length error when creating an account with a short password', () => {
    renderLoginModel();

    const tabButtons = screen.getAllByText('Create Account');
    fireEvent.click(tabButtons[0]);

    fireEvent.change(screen.getByPlaceholderText('Enter your username'), {
      target: { value: 'newuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('At least 6 characters'), {
      target: { value: '123' },
    });

    const allCreateAccountEls = screen.getAllByText('Create Account');
    fireEvent.click(allCreateAccountEls[allCreateAccountEls.length - 1]);

    expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
  });

  it('calls the login API with correct credentials on submit', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        username: 'josh',
        tier: 'ENTERPRISE',
        token: 'mock-token',
      }),
    });

    renderLoginModel();

    fireEvent.change(screen.getByPlaceholderText('Enter your username'), {
      target: { value: 'josh' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'Admin123!' },
    });

    const signInButtons = screen.getAllByText('Sign In');
    fireEvent.click(signInButtons[signInButtons.length - 1]);

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ username: 'josh', password: 'Admin123!' }),
      })
    );
  });

});