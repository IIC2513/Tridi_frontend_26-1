import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/Button/Button";
import UserCard from "../../components/UserCard/UserCard";
import StatusMessage from "../../components/StatusMessage/StatusMessage";
import { useAuth } from "../../context/useAuth";
import { getPendingRequests, updateRequestStatus } from "../../api/requests";
import "./Admin.css";

export default function Admin() {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    const [actingId, setActingId] = useState(null);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        } else if (user?.role !== "admin") {
            navigate("/");
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        if (isAuthenticated && user?.role === "admin") {
            async function load() {
                try {
                    setLoading(true);
                    const pending = await getPendingRequests();
                    setRequests(pending);
                } finally {
                    setLoading(false);
                }
            }
            load();
        }
    }, [isAuthenticated, user]);

    async function resolve(requestId, nextStatus) {
        setActingId(requestId);
        try {
            await updateRequestStatus(requestId, nextStatus);
            setRequests((prev) => prev.filter((r) => r.id !== requestId));
            setStatus({
                variant: "success",
                message: `Request ${nextStatus === "approved" ? "approved" : "rejected"}.`,
            });
        } catch (e) {
            setStatus({
                variant: "error",
                message: e?.response?.data?.error || e.message || "Action failed.",
            });
        } finally {
            setActingId(null);
        }
    }

    return (
        <>
            <Navbar />
            <main className="adminPage">
                <h1 className="adminTitle">Admin Panel</h1>
                <hr className="hrAdmin" />
                <h2 className="adminSubtitle">Pending seller applications</h2>

                {loading ? (
                    <p className="adminEmpty">Loading requests...</p>
                ) : requests.length === 0 ? (
                    <p className="adminEmpty">No pending requests.</p>
                ) : (
                    <ul className="adminList">
                        {requests.map((r) => (
                            <UserCard
                                key={r.id}
                                user={r.user}
                                badge={r.type}
                                actions={
                                    <>
                                        <Button
                                            onClick={() => resolve(r.id, "rejected")}
                                            disabled={actingId === r.id}
                                            bgColor="#1a1a1a"
                                            hoverBgColor="#242424"
                                            textColor="#cfcfcf"
                                        >
                                            Reject
                                        </Button>
                                        <Button
                                            onClick={() => resolve(r.id, "approved")}
                                            disabled={actingId === r.id}
                                            bgColor="#d96e3a"
                                            hoverBgColor="#c25f2f"
                                            textColor="#ffffff"
                                        >
                                            {actingId === r.id ? "Working..." : "Approve"}
                                        </Button>
                                    </>
                                }
                            >
                                <p className="adminComment">
                                    {r.content ? r.content : <em>No message provided.</em>}
                                </p>
                            </UserCard>
                        ))}
                    </ul>
                )}
            </main>

            {status && (
                <div className="adminToast">
                    <StatusMessage
                        variant={status.variant}
                        message={status.message}
                        onDismiss={() => setStatus(null)}
                    />
                </div>
            )}
            <Footer />
        </>
    );
}