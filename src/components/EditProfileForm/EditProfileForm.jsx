import { useState, useEffect } from "react";
import "./EditProfileForm.css";

export default function EditProfileForm({
  handleClose,
  handleSubmit,
  initialValues = null,
}) {

  const [formData, setFormData] = useState({ username: "", password: "", image: "" });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setFormData({
        username: initialValues.username ?? "",
        password: "",
        image: initialValues.image ?? ""
      });
    }
  }, [initialValues]);

  const onSubmit = async (e) => {
    e.preventDefault();

    const payload = {};

    if (formData.username.trim()) {
      payload.username = formData.username;
    }

    if (formData.password.trim()) {
      payload.password = formData.password;
    }

    if (formData.image.trim()) {
      payload.image = formData.image;
    }

    await handleSubmit(payload);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  return (
    <div className="ModalBlackArea" onClick={handleClose}>
      <form onSubmit={onSubmit} onClick={(e) => e.stopPropagation()}>
        <div className="main-container">
          <div className="card-box">
            <div className="right-panel">
              <div className="form-wrapper">
                <div className="form-header-group">
                  <div className="form-title">Edit Profile</div>
                  <div className="form-desc">
                    Click outside the form to close it.
                  </div>
                </div>

                <div className="divider-text"></div>

                <div className="row-inputs">
                  <div className="input-box">
                    <div className="input-label-row">
                    <label className="input-label">Image URL</label>
                    {formData.image && (
                        <button
                        type="button"
                        className="clear-button"
                        onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                        aria-label="Clear image URL"
                        >
                        ✕
                        </button>
                    )}
                    </div>
                    <input
                      className="input-field"
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="Add a valid Image Url"
                    />
                  </div>
                </div>

                <div className="row-inputs">
                  <div className="input-box">
                    <label className="input-label">Username</label>
                    <input
                      className="input-field"
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Enter your new username"
                    />
                  </div>
                </div>

                <div className="input-box">
                  <label className="input-label">Password</label>
                  <div className="password-wrapper">
                    <input
                      className="input-field"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      className="eye-icon"
                      onClick={() => setShowPassword(prev => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" width="20" fill="none" stroke="#666" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="20" fill="none" stroke="#666" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="hint-text">Leave blank if you want to keep the current value.</div>

                <button type="submit" className="submit-button">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                  </svg>
                  <p>Save Changes</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}