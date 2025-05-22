// src/components/trade_simulator.tsx
import React, { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { fetchAPIData } from "../services/api";

const TradeSimulator: React.FC = () => {
  // Inicializa os saldos a partir do localStorage (lazy initialization)
  const [btc, setBtc] = useState<number>(() => {
    const saved = localStorage.getItem("tradeBalances");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.btc ?? 1;
      } catch (e) {
        console.error("Erro ao carregar BTC do localStorage:", e);
      }
    }
    return 1;
  });

  const [usd, setUsd] = useState<number>(() => {
    const saved = localStorage.getItem("tradeBalances");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.usd ?? 0;
      } catch (e) {
        console.error("Erro ao carregar USD do localStorage:", e);
      }
    }
    return 0;
  });

  const [amount, setAmount] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string>("");
  const [action, setAction] = useState<string>("");

  // Sempre que btc ou usd mudarem, salva os novos valores no localStorage
  useEffect(() => {
    localStorage.setItem("tradeBalances", JSON.stringify({ btc, usd }));
  }, [btc, usd]);

  // Busca o preço atual da API assim que o componente monta
  useEffect(() => {
    fetchAPIData()
      .then((data) => {
        if (data.prices && data.prices.length > 0) {
          const latestPrice = data.prices[data.prices.length - 1][1];
          setPrice(latestPrice);
        } else {
          setErr("Dados inválidos da API.");
        }
      })
      .catch(() => setErr("Erro ao buscar o preço."))
      .finally(() => setLoading(false));
  }, []);

  const sell = () => {
    if (amount <= 0) return alert("Informe um valor válido.");
    if (amount > btc) return alert("Saldo insuficiente de BTC.");
    if (price <= 0) return alert("Preço indisponível.");
    setBtc((prev) => prev - amount);
    setUsd((prev) => prev + amount * price);
    setAmount(0);
    setAction("Vender");
  };

  const buy = () => {
    if (amount <= 0) return alert("Informe um valor válido.");
    if (amount > usd) return alert("Saldo insuficiente em USD.");
    if (price <= 0) return alert("Preço indisponível.");
    setUsd((prev) => prev - amount);
    setBtc((prev) => prev + amount / price);
    setAmount(0);
    setAction("Comprar");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: window.innerHeight / 2 +40,
        right: window.innerWidth / 2,
        zIndex: 1000,
        padding: "1rem",
        border: "1px solid #ddd",
        borderRadius: "5px",
        width: "300px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
      }}
    >
       <h1 style={{ marginBottom: ".5rem", fontSize: "1.2rem" }}>
        Simulador de Trade
      </h1>
      {loading ? (
        <p>Carregando...</p>
      ) : err ? (
        <p style={{ color: "red" }}>{err}</p>
      ) : (
        <p style={{ marginBottom: ".5rem" }}>
          <strong>Preço BTC:</strong> ${price}
        </p>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: ".5rem",
        }}
      >
        <div>
          <p style={{ margin: 0 }}>
            <strong>BTC:</strong> {btc.toFixed(4)}
          </p>
          <p style={{ margin: 0 }}>
            <strong>USD:</strong> ${usd.toFixed(2)}
          </p>
        </div>
        {action && (
          <div
            style={{
              fontSize: "0.9rem",
              color: "#555",
              fontStyle: "italic",
              alignSelf: "center",
            }}
          >
            {action}
          </div>
        )}
      </div>
      <input
        type="number"
        value={amount}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setAmount(parseFloat(e.target.value))
        }
        placeholder="Valor"
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
      />
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={sell} style={{ flex: 1, padding: "0.5rem" }}>
          Vender
        </button>
        <button onClick={buy} style={{ flex: 1, padding: "0.5rem" }}>
          Comprar
        </button>
      </div>
    </div>
  );
};

export default TradeSimulator;