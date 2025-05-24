import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TradeSimulator from "./trade_simulator";
import { vi } from "vitest";

// Mock da função fetchCurrentPrice
vi.mock("../services/api", () => ({
  fetchCurrentPrice: vi.fn(() =>
    Promise.resolve({
      market_data: {
        current_price: {
          usd: 50000,
        },
      },
    })
  ),
}));

describe("Teste de Interface do componente TradeSimulator", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("exibe carregamento inicial e depois o preço do BTC", async () => {
    render(<TradeSimulator />);
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/preço BTC/i)).toBeInTheDocument();
      expect(screen.getByText(/\$50000/i)).toBeInTheDocument();
    });
  });

  it("executa uma operação de venda válida", async () => {
    render(<TradeSimulator />);
    await waitFor(() => screen.getByText(/preço BTC/i));

    const input = screen.getByPlaceholderText(/valor/i);
    fireEvent.change(input, { target: { value: "0.5" } });

    fireEvent.click(screen.getByText(/vender/i));

    expect(screen.getByTestId("saldo-btc")).toHaveTextContent("BTC: 0.5000");
    expect(screen.getByTestId("saldo-usd")).toHaveTextContent("USD: $25000.00");
  });

  it("executa uma operação de compra válida", async () => {
    localStorage.setItem(
      "tradeBalances",
      JSON.stringify({ btc: 1, usd: 10000 })
    );

    render(<TradeSimulator />);
    await waitFor(() => screen.getByText(/preço BTC/i));

    const input = screen.getByPlaceholderText(/valor/i);
    fireEvent.change(input, { target: { value: "5000" } });

    fireEvent.click(screen.getByText(/comprar/i));

    expect(screen.getByTestId("saldo-usd")).toHaveTextContent("USD: $5000.00");

    // Checa que BTC aumentou (diferente de 1.0000)
    const btcText = screen.getByTestId("saldo-btc").textContent;
    expect(btcText).not.toBe("BTC: 1.0000");
  });
 

  it("exibe mensagem de erro ao tentar vender mais BTC do que possui", async () => {
    render(<TradeSimulator />);
    await waitFor(() => screen.getByText(/preço BTC/i));

    const input = screen.getByPlaceholderText(/valor/i);
    fireEvent.change(input, { target: { value: "2" } });

    // Mock do alert
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    fireEvent.click(screen.getByText(/vender/i));
    expect(alertMock).toHaveBeenCalledWith("Saldo insuficiente de BTC.");
  });

  it("exibe mensagem de erro ao tentar comprar com USD insuficiente", async () => {
    render(<TradeSimulator />);
    await waitFor(() => screen.getByText(/preço BTC/i));

    const input = screen.getByPlaceholderText(/valor/i);
    fireEvent.change(input, { target: { value: "1000" } });

    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    fireEvent.click(screen.getByText(/comprar/i));
    expect(alertMock).toHaveBeenCalledWith("Saldo insuficiente em USD.");
  });
});
