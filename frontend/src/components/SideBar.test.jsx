/*
  Sidebar.test.jsx
  -----------------
  Unit tests for Sidebar — covers the core tier-based access
  control logic that determines which nav items each subscription
  tier can see. This is central to the app's access-control system.
*/

import { describe, it, expect } from 'vitest';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import Sidebar from '../components/Sidebar';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';

// Small helper component that lets us log a user in before
// Sidebar renders, since Sidebar reads user from AuthContext.
//
// IMPORTANT: login() must be called inside a useEffect, not directly
// in the render body. Calling it during render triggers a state
// update on every render, causing an infinite re-render loop that
// hangs the test.
function LoggedInSidebar({ tier, username }) {
  const { login } = useAuth();

  useEffect(() => {
    login({ username, tier, token: 'mock-token' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Sidebar
      activeNav="overview"
      setActiveNav={() => {}}
      sidebarOpen={true}
      setSidebarOpen={() => {}}
    />
  );
}

function renderSidebarAsTier(tier, username = 'testuser') {
  return render(
    <ThemeProvider>
      <AuthProvider>
        <LoggedInSidebar tier={tier} username={username} />
      </AuthProvider>
    </ThemeProvider>
  );
}

function renderSidebarLoggedOut() {
  return render(
    <ThemeProvider>
      <AuthProvider>
        <Sidebar
          activeNav="overview"
          setActiveNav={() => {}}
          sidebarOpen={true}
          setSidebarOpen={() => {}}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

describe('Sidebar - tier-based access control', () => {

  it('only shows Overview when no user is logged in', () => {
    renderSidebarLoggedOut();

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.queryByText('Sales')).not.toBeInTheDocument();
    expect(screen.queryByText('Customers')).not.toBeInTheDocument();
    expect(screen.queryByText('Products')).not.toBeInTheDocument();
  });

  it('GROWTH tier only sees Overview, Customers and Settings', () => {
    renderSidebarAsTier('GROWTH');

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Customers')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();

    // Should NOT see Pro+ or Enterprise-only pages
    expect(screen.queryByText('Sales')).not.toBeInTheDocument();
    expect(screen.queryByText('Territory')).not.toBeInTheDocument();
    expect(screen.queryByText('Invoices')).not.toBeInTheDocument();
    expect(screen.queryByText('Products')).not.toBeInTheDocument();
    expect(screen.queryByText('Summaries')).not.toBeInTheDocument();
    expect(screen.queryByText('Data Export')).not.toBeInTheDocument();
  });

  it('PRO tier sees Growth pages plus Sales, Products, Territory and Data Export', () => {
    renderSidebarAsTier('PRO');

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Customers')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Sales')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Territory')).toBeInTheDocument();
    expect(screen.getByText('Data Export')).toBeInTheDocument();

    // Invoices and Summaries remain Enterprise-only
    expect(screen.queryByText('Invoices')).not.toBeInTheDocument();
    expect(screen.queryByText('Summaries')).not.toBeInTheDocument();
  });

  it('ENTERPRISE tier sees every nav item including Products, Invoices and Summaries', () => {
    renderSidebarAsTier('ENTERPRISE');

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Customers')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Sales')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Territory')).toBeInTheDocument();
    expect(screen.getByText('Invoices')).toBeInTheDocument();
    expect(screen.getByText('Summaries')).toBeInTheDocument();
    expect(screen.getByText('Data Export')).toBeInTheDocument();
  });

  it('shows the correct tier badge label for a logged in Enterprise user', () => {
    renderSidebarAsTier('ENTERPRISE', 'josh');

    expect(screen.getByText('Enterprise Plan')).toBeInTheDocument();
    expect(screen.getByText('josh')).toBeInTheDocument();
  });

  it('shows the correct tier badge label for a logged in Growth user', () => {
    renderSidebarAsTier('GROWTH', 'growthuser');

    expect(screen.getByText('Growth Plan')).toBeInTheDocument();
    expect(screen.getByText('growthuser')).toBeInTheDocument();
  });

});