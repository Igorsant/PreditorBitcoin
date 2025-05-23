import { act, render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import App from './App';
import '../tests/setup.ts';
import { vi } from 'vitest';

vi.mock("./services/api", () => {
  return {
    fetchAPIData: vi.fn(() => {
      return Promise.resolve({
        prices: [
          [Date.now() - 1000 * 60 * 60, 30000],
          [Date.now(), 31000],
        ],
      });
    }),
    fetchCurrentPrice: vi.fn(() => {
      return Promise.resolve({
        market_data: { current_price: { usd: 31000 } }
      });
    }),
  };
});

describe("App", () => {
  it("renders without crashing", async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });
});