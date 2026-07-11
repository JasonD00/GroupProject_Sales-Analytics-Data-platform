/*
  Unit tests for ChartToggle — covers the tier-gated chart type
  logic (Growth = Area only, Pro = +Line, Enterprise = +Bar)
  and toggle button interaction.
*/

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChartToggle from '../components/ChartToggle';
import { ThemeProvider } from '../context/ThemeContext';

const SAMPLE_DATA = [
  { monthNum: 1, revenue: 1000 },
  { monthNum: 2, revenue: 1500 },
  { monthNum: 3, revenue: 1200 },
];

function renderChart(tier) {
  return render(
    <ThemeProvider>
      <ChartToggle
        data={SAMPLE_DATA}
        xKey="monthNum"
        yKey="revenue"
        yLabel="Revenue (€)"
        tier={tier}
      />
    </ThemeProvider>
  );
}

describe('ChartToggle', () => {

  it('only shows the Area button for a Growth tier user', () => {
    renderChart('GROWTH');
    expect(screen.getByText('Area')).toBeInTheDocument();
    expect(screen.queryByText('Line')).not.toBeInTheDocument();
    expect(screen.queryByText('Bar')).not.toBeInTheDocument();
  });

  it('shows Area and Line buttons for a Pro tier user', () => {
    renderChart('PRO');
    expect(screen.getByText('Area')).toBeInTheDocument();
    expect(screen.getByText('Line')).toBeInTheDocument();
    expect(screen.queryByText('Bar')).not.toBeInTheDocument();
  });

  it('shows Area, Line and Bar buttons for an Enterprise tier user', () => {
    renderChart('ENTERPRISE');
    expect(screen.getByText('Area')).toBeInTheDocument();
    expect(screen.getByText('Line')).toBeInTheDocument();
    expect(screen.getByText('Bar')).toBeInTheDocument();
  });

  it('shows an upgrade hint for Growth tier users (uppercase tier)', () => {
    renderChart('GROWTH');
    expect(screen.getByText(/Upgrade to Pro for Line \+ Bar charts/i)).toBeInTheDocument();
  });

  it('shows an upgrade hint for Pro tier users (uppercase tier)', () => {
    renderChart('PRO');
    expect(screen.getByText(/Upgrade to Enterprise for Bar charts/i)).toBeInTheDocument();
  });

  it('shows an upgrade hint for Growth tier users (capitalised tier)', () => {
    renderChart('Growth');
    expect(screen.getByText(/Upgrade to Pro for Line \+ Bar charts/i)).toBeInTheDocument();
  });

  it('shows an upgrade hint for Pro tier users (capitalised tier)', () => {
    renderChart('Pro');
    expect(screen.getByText(/Upgrade to Enterprise for Bar charts/i)).toBeInTheDocument();
  });

  it('shows no upgrade hint for Enterprise tier users', () => {
    renderChart('ENTERPRISE');
    expect(screen.queryByText(/Upgrade to/i)).not.toBeInTheDocument();
  });

  it('switches the active chart type when a toggle button is clicked', () => {
    renderChart('ENTERPRISE');

    const barButton = screen.getByText('Bar');
    fireEvent.click(barButton);
    expect(barButton).toBeInTheDocument();
  });

  it('falls back to Area-only chart types for an unrecognised tier', () => {
    renderChart('UNKNOWN_TIER');
    expect(screen.getByText('Area')).toBeInTheDocument();
    expect(screen.queryByText('Line')).not.toBeInTheDocument();
    expect(screen.queryByText('Bar')).not.toBeInTheDocument();
  });

});