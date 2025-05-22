import { memo } from "react";
import XiJimping from "/xi_jimping.jpg";
import Trump from "/trump.jpg";

export const BuyOrSell = memo(() => {
  const buy = Math.random() > 0.5;
  return (
    <>
      {buy ? (
        <>
          <h2>xi jimping deseja fazer negociações, compre bitcoin agora!</h2>
          <img width={200} src={XiJimping} alt="foto do xi jimpings" />
        </>
      ) : (
        <>
          <h2>trump vai aumentar as tarifas, venda bitcoin agora!</h2>
          <img width={200} src={Trump} alt="foto do xi jimpings" />
        </>
      )}
    </>
  );
});
