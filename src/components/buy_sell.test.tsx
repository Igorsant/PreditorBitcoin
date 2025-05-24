import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { BuyOrSell } from "./buy_sell";

describe("Teste de Interface do componente BuyOrSell", () => {
  // Após cada teste, restaura a implementação original do Math.random
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("exibe a mensagem e imagem de compra quando Math.random() > 0.5", () => {
    // Força o Math.random() a retornar 0.7 para que a lógica do componente defina como 'compra'
    vi.spyOn(Math, "random").mockReturnValue(0.7);
    render(<BuyOrSell />);

    // Verifica se o heading com a mensagem de compra é exibido
    expect(
      screen.getByRole("heading", {
        name: /xi jimping deseja fazer negociações, compre bitcoin agora!/i,
      })
    ).toBeInTheDocument();

    // Verifica se a imagem com o alt correto está sendo exibida
    expect(
      screen.getByRole("img", { name: /foto do xi jimpings/i })
    ).toBeInTheDocument();
  });

  it("exibe a mensagem e imagem de venda quando Math.random() <= 0.5", () => {
    // Força o Math.random() a retornar 0.3 para que a lógica do componente defina como 'venda'
    vi.spyOn(Math, "random").mockReturnValue(0.3);
    render(<BuyOrSell />);

    // Verifica se o heading com a mensagem de venda é exibido
    expect(
      screen.getByRole("heading", {
        name: /trump vai aumentar as tarifas, venda bitcoin agora!/i,
      })
    ).toBeInTheDocument();

    // Verifica se a imagem é exibida
    expect(screen.getByRole("img")).toBeInTheDocument();
  });
});

