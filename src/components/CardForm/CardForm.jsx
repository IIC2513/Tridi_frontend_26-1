import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect, useRef } from "react";
import { useCards } from "../../context/CardContext";
import "./CardForm.css";

export default function CardForm() {
  
  const { addCard } = useCards();
  const [number, setNumber] = useState("");
  const [expDate, setExpDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState(null);

  function validateCard(number, expiry, cvv) {
    if (!/^\d{13,19}$/.test(number)) {
        return "Card number must contain between 13 and 19 digits.";
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
        return "Expiry date must be in MM/YY format.";
    }
    if (!/^\d{3,4}$/.test(cvv)) {
        return "CVV must contain 3 or 4 digits.";
    }

    const [month, year] = expiry.split("/");
    const expMonth = Number(month);
    const expYear = 2000 + Number(year);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (
        expYear < currentYear ||
        (expYear === currentYear && expMonth < currentMonth)
    ) {
        return "Card has expired.";
    }

    return null;
 }

  async function handleSubmit(e) {
    e.preventDefault();

    const Validationerror = validateCard(number, expDate, cvv);
    if (Validationerror) {
        setError(Validationerror);
        return;
    }

    const [month, year] = expDate.split("/");
    await addCard({number, expMonth: Number(month), expYear: Number(`20${year}`)});
    setNumber("");
    setExpDate("");
    setCvv("");
  }

  return (
        <form className="form" onSubmit={handleSubmit}>
            <div className="separator">
                <hr className="line" />
                    <p>New Card</p>
                <hr className="line" />
            </div>
            <div className="credit-card-info--form">
                <div className="input_container">
                <label className="input_label">
                    Card Number
                </label>
                <input
                    className="input_field"
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                />
                </div>
                <div className="input_container">
                    <label className="input_label">
                        Expiry Date
                    </label>
                    <div className="split">
                        <input
                            className="input_field"
                            type="text"
                            placeholder="08/30"
                            value={expDate}
                            onChange={(e) => setExpDate(e.target.value)}
                        />
                        <input
                            className="input_field"
                            type="number"
                            placeholder="CVV"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <button type="submit" className="purchase--btn">
                Add Card
            </button>
        </form>
  );
}