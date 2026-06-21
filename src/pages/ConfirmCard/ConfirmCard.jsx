import { useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useCards } from "../../context/CardContext";
import CardView from "../../components/CardView/CardView";
import CardForm from "../../components/CardForm/CardForm";
import { usePurchases } from "../../context/PurchaseContext";
import { useCart } from "../../context/CartContext";
import "./ConfirmCard.css";

export default function ConfirmCard() {
    const { isAuthenticated } = useAuth();
    const { cards, loading } = useCards();
    const navigate = useNavigate();
    const { createPurchase } = usePurchases();
    const { clearCart } = useCart();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/catalogue");
        }
    }, [isAuthenticated, navigate]);

    async function handleSelectCard() {
        try {
            if (cartItems.length == 0) {
                navigate("/my-purchases");
                return;
            }
            await createPurchase();
            clearCart();
            navigate("/my-purchases");
        } catch (error) {
            console.error(error);
        }
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <p className="userEmpty">Loading Payment Cards...</p>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="profilePage">
                <h1 className="profileTitle">Payment Method</h1>
                <h2 className="profileSubtitle">To proceed with your pending purchases, please select your payment method.</h2>
                <hr className="hrProfile" />
                <div className="profileInfo">
                    <CardForm />
                    <div>
                        {cards.length === 0 ? (
                            <p>No cards saved yet.</p>
                        ) : (
                            cards.map((card) => (
                                <CardView
                                    key={card.id}
                                    card={card}
                                    onSelect={handleSelectCard}
                                />
                            ))
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}