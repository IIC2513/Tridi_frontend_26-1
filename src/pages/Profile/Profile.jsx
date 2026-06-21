import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useParams } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import ProfileImage from "../../components/ProfileImage/ProfileImage";
import StatusMessage from "../../components/StatusMessage/StatusMessage";
import { getUserByName, putUserChanges } from "../../api/users";
import UploadModelModal from "../../components/UploadModelModal/UploadModelModal";
import EditProfileForm from "../../components/EditProfileForm/EditProfileForm";
import RequestSellerModal from "../../components/RequestSellerModal/RequestSellerModal";
import { getUsers } from "../../api/users";
import PWAModelsSection from "../../PWA/PWAModelsSection";
import "./Profile.css";

export default function Profile() {
    const { isAuthenticated, user, updateUser  } = useAuth();
    const { username } = useParams();
    const [loading, setLoading] = useState(true);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [requestOpen, setRequestOpen] = useState(false);
    const [status, setStatus] = useState(null);
    const apiUrl = import.meta.env.VITE_API_URL;
    const [isOpenEdit, setIsOpenEdit] = useState(false);

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
                    const fetchedUser = await getUserByName(username);
                    setProfile(fetchedUser);
                } catch (error) {
                    setProfile(null);
                    handleShowMessage("error", "The profile could not be loaded.");
                } finally {
                    setLoading(false);
                }
            }
            loadUser();
        }
    }, [username, isAuthenticated]);

    const handleShowMessage = (variant, message) => {
        setStatus({ variant, message });
    };

    const handleCloseMessage = () => {
        setStatus(null);
    };

    function equalProfile() {
        return isAuthenticated && username === user.username;
    }

    function canUpload() {
        return equalProfile() && profile?.seller === true;
    }

    const handleSubmit = async (payload) => {
        try {
            const updatedUser = await putUserChanges(profile.id, payload);
            setProfile(updatedUser);
            handleCloseEdit();
            handleShowMessage("success", "Profile updated successfully.");

            if (payload.username && payload.username !== username) {
                updateUser({ username: updatedUser.username });
                navigate(`/users/${updatedUser.username}`, { replace: true });
            } else if (payload.image) {
                updateUser({ image: updatedUser.image });
            }
        } catch (error) {
            handleShowMessage(
                "error",
                error.response?.data?.error || "An error occurred while updating the profile."
            );
        }
    };

    const handleCloseEdit = () => {
      if (setIsOpenEdit){
        setIsOpenEdit(false);
      }
      setIsOpenEdit(!isOpenEdit);
    };

    function reputationLevel(profile) {
        if (profile.reputation == 0){
            return ("Newcomer");
        }
        if (profile.reputation == 1){
            return ("Trusted");
        }
        if (profile.reputation == 2){
            return ("Expert");
        }
        if (profile.reputation == 3){
            return ("Master Creator");
        }
    }

    const handleCards = () => {
        navigate('/my-cards');
    };

    return (
        <>
            <Navbar></Navbar>
            {status && (
                <StatusMessage
                    variant={status.variant}
                    message={status.message}
                    onDismiss={handleCloseMessage}
                />
            )}
            {isOpenEdit ? (
                <EditProfileForm 
                    handleClose={handleCloseEdit}
                    handleSubmit={handleSubmit}
                    initialValues={profile}>
                </EditProfileForm>
            ) : null}
            {loading ? (
                <p className="userEmpty">Loading {username}'s Profile...</p>
            ) : !profile ? (
                <p className="userEmpty">User not found.</p>
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
                                            src={`${profile.image}`}
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
                                <div className="profile-buttons">
                                    <button className="BtnEdit" onClick={handleCloseEdit}>Edit
                                        <svg className="svgEdit" viewBox="0 0 512 512">
                                            <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                                        </svg>
                                    </button>
                                    <button className="BtnPayment" onClick={handleCards}>Payment Center
                                        <svg className="svgEdit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M527.9 32H48.1C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48.1 48h479.8c26.6 0 48.1-21.5 48.1-48V80c0-26.5-21.5-48-48.1-48zM54.1 80h467.8c3.3 0 6 2.7 6 6v42H48.1V86c0-3.3 2.7-6 6-6zm467.8 352H54.1c-3.3 0-6-2.7-6-6V256h479.8v170c0 3.3-2.7 6-6 6zM192 332v40c0 6.6-5.4 12-12 12h-72c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12zm192 0v40c0 6.6-5.4 12-12 12H236c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h136c6.6 0 12 5.4 12 12z"/></svg>
                                    </button>
                                </div>
                            ) : null}
                            {canUpload() ? (
                                <button className="BtnUpload" onClick={() => setUploadOpen(true)}>
                                    Upload Model
                                </button>
                            ) : (
                                equalProfile() && (
                                    <button className="BtnUpload" onClick={() => setRequestOpen(true)}>
                                        Request to be a Seller
                                    </button>
                                )
                            )}
                        </div>
                        <div className="ValueInfo">
                            <h2 className="NameValue">Reputation:</h2>
                            <p className="Value">{reputationLevel(profile)}</p>
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
                    <RequestSellerModal
                        open={requestOpen}
                        onClose={() => setRequestOpen(false)}
                        onSubmitted={() => {
                            setRequestOpen(false);
                            setStatus({
                                variant: "success",
                                message: "Your seller request was sent. An admin will review it.",
                            });
                        }}
                    />
                    <div className="profilePwaSection">
                        {equalProfile() ? (
                            <PWAModelsSection showHeader={false} autoSync={true} />
                        ) : (
                            <PWAModelsSection showHeader={false} userId={profile.id} />
                        )}
                    </div>
                </main>
            )}
            <Footer />
        </>
    );
}