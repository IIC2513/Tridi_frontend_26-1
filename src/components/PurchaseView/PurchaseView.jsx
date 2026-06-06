import { useEffect , useState} from "react";
import { useNavigate } from "react-router-dom";
import "./PurchaseView.css";

export default function PurchaseView({
    purchase,
    handlePay
}) {

  return (
    <div className="cardPurchase" onClick={handlePay}>
        <div className="text">
            <div className="title">Purchase #{purchase.id}</div>
            <div className="subtitle">Total: ${purchase.total.toFixed(2)}</div>
        </div>
    </div>
  );
}
