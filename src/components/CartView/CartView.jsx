import { useEffect , useState} from "react";
import { useNavigate } from "react-router-dom";
import "./CartView.css";
import { useCart } from "../../context/CartContext";

export default function CartView({
  handleCloseCart,
  removeCart
}) {
  
  const {cartItems, subtotal, removeFromCart} = useCart();
  const navigate = useNavigate();

  function itemsTotal(){
    if (cartItems.length > 0){
        return true;
    }
    return false;
  }


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
                                        onClick={() => removeFromCart(item.id)}>
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <hr className="hrCart"/>
                    <div className="pricesContainer">
                        <div className="totalContainer">TOTAL: ${subtotal.toFixed(2)}</div>
                    </div>
                </div>
            </div>
            <div className="cartFooter">
                {itemsTotal() ? 
                    <div className="payButtonContainer">
                        <button className="payButton" onClick={() => navigate("/my-cards")}>Confirm Purchase</button>
                    </div> : null
                }
            </div>
        </div>
    </div>
  );
}
