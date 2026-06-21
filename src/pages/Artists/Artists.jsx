import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import UserCard from "../../components/UserCard/UserCard";
import { getUsers } from "../../api/users";
import "./Artists.css";

export default function Artists() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const users = await getUsers();
                setArtists(users.filter((u) => u.seller === true));
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return (
        <>
            <Navbar />
            <main className="artistsPage">
                <h1 className="artistsTitle">Artists</h1>
                <hr className="hrArtists" />
                <h2 className="artistsSubtitle">Sellers on Tridi</h2>

                {loading ? (
                    <p className="artistsEmpty">Loading artists...</p>
                ) : artists.length === 0 ? (
                    <p className="artistsEmpty">No artists yet.</p>
                ) : (
                    <ul className="artistsList">
                        {artists.map((a) => (
                            <UserCard
                                key={a.id}
                                user={a}
                                badge={a.role === "admin" ? "Admin" : "Seller"}
                                onClick={() => navigate(`/users/${a.username}`)}
                            >
                                <div className="artistStats">
                                    <span className="artistStat">
                                        <strong>{a.c_sales ?? 0}</strong> sales
                                    </span>
                                </div>
                            </UserCard>
                        ))}
                    </ul>
                )}
            </main>
            <Footer />
        </>
    );
}