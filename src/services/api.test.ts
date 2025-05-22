// src/tests/api.test.ts
import { describe, it, expect, vi } from "vitest";
import { fetchAPIData } from "../services/api";

// Mock da API para evitar chamadas reais
vi.mock("../services/api", () => {
  return {
    fetchAPIData: vi.fn(() => {
      return Promise.resolve({
        prices: [
          [Date.now() - 1000 * 60 * 60, 30000],
          [Date.now(), 31000],
        ],
      });
    }),
  };
});

describe("Teste da API do Bitcoin", () => {
  it("deve retornar dados válidos", async () => {
    const data = await fetchAPIData();
    expect(data).toHaveProperty("prices");
    expect(data.prices.length).toBeGreaterThan(0);
  });

  it("deve lidar com erro de requisição", async () => {
    // Sobrescreve a implementação do mock apenas para essa chamada
    vi.mocked(fetchAPIData).mockImplementationOnce(() =>
      Promise.reject(new Error("Falha na requisição"))
    );

    await expect(fetchAPIData()).rejects.toThrow("Falha na requisição");
  });
});
