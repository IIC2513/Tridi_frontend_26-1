import { useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import PurchaseView from "../../components/PurchaseView/PurchaseView";
import "./PurchasesPage.css";
import { usePurchases } from "../../context/PurchaseContext";
import { useStatus } from "../../context/StatusContext";

export default function PurchasesPage() {
    const { isAuthenticated } = useAuth();
    const { purchases, loading, error, refreshPurchases, updateStatus } = usePurchases();
    const { showStatus } = useStatus();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/catalogue");
            return;
        }
        refreshPurchases();
    }, [isAuthenticated, navigate, refreshPurchases]);

    const pendingPurchases = purchases.filter((purchase) => purchase.status === "pending");

    async function handlePay(purchaseId) {
        try {
            await updateStatus(purchaseId, "paid");
            showStatus({
                variant: "success",
                title: "Purchase completed",
                message: "Your purchase was paid successfully.",
            });
        } catch (error) {
            console.error(error);
            showStatus({ variant: "error", message: "Couldn't complete the purchase." });
        }
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <p className="userEmpty">Loading Purchases...</p>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <main className="profilePage">
                    <h1 className="profileTitle">Pending Purchases</h1>
                    <hr className="hrProfile" />
                    <div className="profileInfo">
                        <p className="errorMessage">Failed to load purchases: {error}</p>
                        <button onClick={refreshPurchases} className="BtnUpload" style={{ marginTop: "1rem" }}>
                            Retry
                        </button>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    const handleCards = () => {
        navigate('/my-cards');
    };

    return (
        <>
            <Navbar />
            <main className="profilePage">
                <h1 className="profileTitle">Pending Purchases</h1>
                <hr className="hrProfile" />
                <div className="pendingHeaderActions">
                    <button onClick={handleCards} className="BtnUpload">
                        Change Payment Method
                    </button>
                </div>
                <div className="profileInfo">
                    {pendingPurchases.length === 0 ? (
                        <p>No pending purchases.</p>
                    ) : (
                        pendingPurchases.map((purchase) => (
                            <PurchaseView
                                key={purchase.id}
                                purchase={purchase}
                                handlePay={() => handlePay(purchase.id)}
                            />
                        ))
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}