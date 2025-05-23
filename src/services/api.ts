const API_KEY=import.meta.env.VITE_API_KEY;
export const fetchAPIData = async () => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=USD&days=1&precision=1",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        x_cg_demo_api_key: API_KEY,
      },
    }
  );
  return await response.json();
};

export const fetchCurrentPrice = async () => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/coins/bitcoin",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        x_cg_demo_api_key: API_KEY,
      },
    }
  );
  const data = await response.json();
  return data;
}