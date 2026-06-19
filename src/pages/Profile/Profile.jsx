import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useParams } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import ProfileImage from "../../components/ProfileImage/ProfileImage";
import StatusMessage from "../../components/StatusMessage/StatusMessage";
import { getUsers } from "../../api/users";
import PWAModelsSection from "../../PWA/PWAModelsSection";
import "./Profile.css";

export default function Profile() {
    const { isAuthenticated, user, logout } = useAuth();
    const { username } = useParams();
    const [loading, setLoading] = useState(true);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [status, setStatus] = useState(null);
    const apiUrl = import.meta.env.VITE_API_URL;

    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading && !isAuthenticated) {
            navigate("/login");
        }
    }, [loading, isAuthenticated, navigate]);

    useEffect(() => {
        if (isAuthenticated) {
            async function loadUser() {
                try {
                    setLoading(true);
                    const users = await getUsers();
                    const profileUser = users.find((u) => u.username === username);
                    setProfile(profileUser);
                } finally {
                    setLoading(false);
                }
            }
            loadUser();
        }
    }, [username]);

    function equalProfile() {
        if (isAuthenticated && username === user.username) {
            return true;
        }
        return false;
    }

    function canUpload() {
        return equalProfile() && profile?.seller === true;
    }

    return (
        <>
            <Navbar></Navbar>
            {loading ? (
                <p className="userEmpty">Loading {username}'s Profile...</p>
            ) : (
                <main className="profilePage">
                    {equalProfile() ? (
                        <h1 className="profileTitle">My Profile</h1>
                    ) : (
                        <h1 className="profileTitle">{username}'s Profile</h1>
                    )}
                    <hr className="hrProfile" />
                    <div className="profileInfo">
                        <div className="profileHeader">
                            <div className="cardProfile">
                                <span className="glass"></span>
                                <div className="contentImage">
                                    {profile.image ? (
                                        <img
                                            src={`${apiUrl}${profile.image}`}
                                            alt={profile.username}
                                            className="profileAvatar"
                                        />
                                    ) : (
                                        <ProfileImage name={profile.username} />
                                    )}
                                </div>
                            </div>
                            <h2 className="profileUsername">{profile.username}</h2>
                            {equalProfile() ? (
                                <button className="BtnEdit">Edit
                                    <svg className="svgEdit" viewBox="0 0 512 512">
                                        <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                                    </svg>
                                </button>
                            ) : null}
                            {canUpload() ? (
                                <button className="BtnUpload" onClick={() => setUploadOpen(true)}>
                                    Upload Model
                                </button>
                            ) : null}
                        </div>
                        <div className="ValueInfo">
                            <h2 className="NameValue">Reputation:</h2>
                            <p className="Value">{profile.reputation}</p>
                            <h2 className="NameValue">Number of Purchases:</h2>
                            <p className="Value">{profile.c_purchases}</p>
                            <h2 className="NameValue">Number of Sales:</h2>
                            <p className="Value">{profile.c_sales}</p>
                        </div>
                    </div>
                    <UploadModelModal
                        open={uploadOpen}
                        onClose={() => setUploadOpen(false)}
                        onUploaded={(created) => {
                            setUploadOpen(false);
                            setStatus({
                                variant: "success",
                                message: `"${created.name}" was uploaded successfully.`,
                            });
                        }}
                    />
                </main>
            )}
            {status && (
                <div className="profileToast">
                    <StatusMessage
                        variant={status.variant}
                        message={status.message}
                        onDismiss={() => setStatus(null)}
                    />
                </div>
                <div className="ValueInfo">
                    <h2 className="NameValue">
                        Reputation:
                    </h2>
                    <p className="Value">
                        {profile.reputation}
                    </p>
                    <h2 className="NameValue">
                        Number of Purchases:
                    </h2>
                    <p className="Value">
                        {profile.c_purchases}
                    </p>
                    <h2 className="NameValue">
                        Number of Sales:
                    </h2>
                    <p className="Value">
                        {profile.c_sales}
                    </p>
                </div>
            </div>
          {equalProfile() && (
            <div className="profilePwaSection">
              <PWAModelsSection showHeader={false} autoSync={true} />
            </div>
          )}
        </main>
        }
        <Footer>
        </Footer>
        </>
    );
}