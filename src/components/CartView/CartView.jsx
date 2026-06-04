import { useEffect , useState} from "react";
import { useNavigate } from "react-router-dom";
import "./CartView.css";

export default function CartView({
  cartItems,
  handleCloseCart,
  removeCart
}) {
  
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="cartBackground" onClick={handleCloseCart}>
        <div className="cartBase" onClick={(e) => e.stopPropagation()}>
            <div className="cartTittle">Cart Summary
                <button className="cartCloseButton" onClick={handleCloseCart}>✕</button>
            </div>
            <div className="cartContainer">
                <div className="summaryContainer">
                    <div className="itemsContainer">
                        <div className="productContainer">
                            {cartItems.map((item) => (
                                <div className="cartItem" key={item.id}>
                                    <div className="cartItemInfo">
                                        <h3>{item.name}</h3>
                                        <p>By {item.artist}</p>
                                        <span>${item.price.toFixed(2)}</span>
                                    </div>

                                    <button
                                        className="removeButton"
                                        onClick={() => removeCart(item.id)}>
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <hr className="hrCart"/>
                    <div className="pricesContainer">
                        <div className="totalContainer">TOTAL: ${total.toFixed(2)}</div>
                    </div>
                </div>
            </div>
            <div className="cartFooter">
                <div className="payButtonContainer">
                    <button className="payButton">Confirm Purchase</button>
                </div>
            </div>
        </div>
    </div>
  );
}
