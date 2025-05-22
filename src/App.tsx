import { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { fetchAPIData } from "./services/api";
import { BuyOrSell } from "./components/buy_sell";
import TradeSimulator from "./components/trade_simulator";

function App() {
  const [chartData, setChartData] = useState<{ time: string[]; prices: number[] }>({
    time: [],
    prices: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchAPIData();

      const timeLabels = res.prices
        .slice(-100)
        .map((d: number[]) => {
          const date = new Date(d[0]);
          return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
        });

      const priceValues = res.prices.slice(-100).map((d: number[]) => d[1]);

      setChartData({ time: timeLabels, prices: priceValues });
    };
    const intervalId = setInterval(() => {
      fetchData();
    }, 1000 * 60);

    fetchData(); // Initial fetch

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <LineChart
        data-testid="line-chart"
        height={300}
        xAxis={[{ data: chartData.time, scaleType: "point", label: "Time" }]}
        series={[{ data: chartData.prices, label: "BTC Price (USD)" }]}
      />
      <BuyOrSell />
      <TradeSimulator /> {/* Adicionado para exibir o simulador de trade */}
    </>
  );
}

export default App;
