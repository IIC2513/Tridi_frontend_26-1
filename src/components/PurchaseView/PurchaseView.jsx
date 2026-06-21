import { useState } from "react";
import "./PurchaseView.css";

function lineItems(purchase) {
  const raw = purchase.items ?? purchase.PurchaseItems ?? [];
  return raw.map((item, index) => ({
    key: item.id ?? index,
    name: item.name ?? item.ModelTridi?.name ?? "Untitled model",
    price: Number(item.price ?? item.unitPrice ?? 0),
  }));
}

export default function PurchaseView({ purchase, handlePay }) {
  const [confirming, setConfirming] = useState(false);
  const items = lineItems(purchase);
  const total = Number(purchase.total);

  function confirmPay(event) {
    event.stopPropagation();
    setConfirming(false);
    handlePay?.();
  }

  function cancel(event) {
    event.stopPropagation();
    setConfirming(false);
  }

  return (
    <div className="cardPurchase" onClick={() => setConfirming(true)}>
      <span className="purchaseEyebrow">Order</span>
      <div className="purchaseId">Purchase #{purchase.id}</div>
      <div className="purchaseRule" />
      <div className="purchaseLines">
        {items.length === 0 ? (
          <span className="purchaseEmpty">No items</span>
        ) : (
          items.map((item) => (
            <div className="purchaseLine" key={item.key}>
              <span className="purchaseLineName">{item.name}</span>
              <span className="purchaseLinePrice">${item.price.toFixed(2)}</span>
            </div>
          ))
        )}
      </div>
      <div className="purchaseFooter">
        <div className="purchaseRule" />
        <div className="purchaseTotalRow">
          <span className="purchaseTotalLabel">Total</span>
          <span className="purchaseTotal">${total.toFixed(2)}</span>
        </div>
      </div>
      <span className="purchaseArrow">↗</span>
      {confirming && (
        <div className="purchaseConfirm" onClick={(e) => e.stopPropagation()}>
          <div>
            <div className="purchaseConfirmTitle">Confirm payment</div>
            <div className="purchaseConfirmAmount">${total.toFixed(2)}</div>
          </div>
          <div className="purchaseConfirmActions">
            <button className="purchaseConfirmBtn" onClick={confirmPay}>Confirm Payment</button>
            <button className="purchaseCancelBtn" onClick={cancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}