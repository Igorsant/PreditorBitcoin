import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchAPIData } from "./api";

const mockedResponse = {
  prices: [
    [Date.now() - 1000 * 60 * 60, 30000],
    [Date.now(), 31000],
  ],
};

// Configura o mock do fetch antes de cada teste
beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockedResponse),
    })
  ) as any;
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("Teste da API do Bitcoin", () => {
  it("deve retornar dados válidos", async () => {
    const data = await fetchAPIData();
    
expect(data).toHaveProperty("prices");
    expect(data.prices.length).toBeGreaterThan(0);
    expect(data.prices).toEqual(mockedResponse.prices);
  });

  it("deve lidar com erro de requisição", async () => {
    (global.fetch as any).mockImplementationOnce(() =>
      Promise.reject(new Error("Falha na requisição"))
    );
    
    await expect(fetchAPIData()).rejects.toThrow("Falha na requisição");
  });
});

