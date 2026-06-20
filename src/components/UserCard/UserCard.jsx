import ProfileImage from "../ProfileImage/ProfileImage";
import "./UserCard.css";

function resolveImage(image, apiUrl) {
    if (!image) return null;
    if (/^https?:\/\//.test(image)) return image;
    return `${apiUrl}${image}`;
}

export default function UserCard({ user, badge, onClick, children, actions }) {
    const apiUrl = import.meta.env.VITE_API_URL;
    const clickable = typeof onClick === "function";
    const image = resolveImage(user?.image, apiUrl);

    function handleKeyDown(e) {
        if (!clickable) return;
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick(e);
        }
    }

    return (
        <li
            className={`userCard${clickable ? " userCardClickable" : ""}`}
            onClick={clickable ? onClick : undefined}
            onKeyDown={handleKeyDown}
            role={clickable ? "button" : undefined}
            tabIndex={clickable ? 0 : undefined}
        >
            <div className="userCardUser">
                <div className="userCardAvatarSlot">
                    {image ? (
                        <img src={image} alt={user?.username || "user"} className="userCardAvatar" />
                    ) : (
                        <ProfileImage name={user?.username || "?"} />
                    )}
                </div>
                <div className="userCardMeta">
                    <span className="userCardUsername">{user?.username || "Unknown"}</span>
                    {badge ? <span className="userCardBadge">{badge}</span> : null}
                </div>
            </div>

            {children}

            {actions ? <div className="userCardActions">{actions}</div> : null}
        </li>
    );
}