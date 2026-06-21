import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect, useRef } from "react";
import { useCards } from "../../context/CardContext";
import "./CardForm.css";

function formatCardNumber(value) {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    const groups = digits.match(/.{1,4}/g);
    return groups ? groups.join(" ") : "";
}

function formatExpiry(value) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
        return digits.slice(0, 2) + "/" + digits.slice(2);
    }
    return digits;
}

export default function CardForm() {
    const { addCard } = useCards();
    const [number, setNumber] = useState("");
    const [expDate, setExpDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [error, setError] = useState(null);

    const rawNumber = number.replace(/\s/g, "");
    const numberInvalid = number !== "" && !/^\d{16}$/.test(rawNumber);
    const expInvalid = expDate !== "" && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expDate);
    const cvvInvalid = cvv !== "" && !/^\d{3}$/.test(cvv);

    function validateCard(number, expiry, cvv) {
        const rawNumber = number.replace(/\s/g, "");
        if (!/^\d{16}$/.test(rawNumber)) {
            return "Card number must contain 16 digits.";
        }
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
            return "Expiry date must be in MM/YY format.";
        }
        if (!/^\d{3}$/.test(cvv)) {
            return "CVV must contain 3 digits.";
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
        const rawNumber = number.replace(/\s/g, "");
        await addCard({ number: rawNumber, expMonth: Number(month), expYear: Number(`20${year}`) });
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
                    {numberInvalid && (
                        <span className="input_error">Card number must be 16 digits.</span>
                    )}
                    <input
                        className={`input_field${numberInvalid ? " input_field--error" : ""}`}
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={number}
                        onChange={(e) => setNumber(formatCardNumber(e.target.value))}
                    />
                </div>
                <div className="input_container">
                    <label className="input_label">
                        Expiry Date
                    </label>
                    {(expInvalid || cvvInvalid) && (
                        <span className="input_error">
                            {expInvalid ? "Use MM/YY format." : "CVV must be 3 digits."}
                        </span>
                    )}
                    <div className="split">
                        <input
                            className={`input_field${expInvalid ? " input_field--error" : ""}`}
                            type="text"
                            placeholder="08/30"
                            value={expDate}
                            onChange={(e) => setExpDate(formatExpiry(e.target.value))}
                        />
                        <input
                            className={`input_field${cvvInvalid ? " input_field--error" : ""}`}
                            type="text"
                            inputMode="numeric"
                            placeholder="CVV"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
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