import { useState } from "react";
import bankLogo from "../../assets/icons/virtuebyte-logo.svg";

export default function LoginForm({ email, setEmail, password, setPassword, onSubmit, isLoading }) {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleOpenForgotPassword = (event) => {
    event.preventDefault();
    setShowForgotPassword(true);
  };

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false);
    setResetEmail("");
  };

  const handleSendResetLink = (event) => {
    event.preventDefault();
    if (!resetEmail.trim()) {
      return;
    }
    handleCloseForgotPassword();
  };

  return (
    <>
      <form className="login-box" onSubmit={onSubmit}>
        <div className="login-brand">
          <img src={bankLogo} alt="Bank Logo" className="login-logo" />
          <h2>Bank Admin Portal</h2>
        </div>

        <label>Username</label>
        <input
          type="email"
          placeholder="Email ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "LOGGING IN..." : "LOGIN"}
        </button>

        <p
          className="forgot-password-text"
          onClick={isLoading ? undefined : handleOpenForgotPassword}
        >
          Forgot Password?
        </p>
      </form>

      {showForgotPassword && (
        <div className="forgot-password-overlay" onClick={handleCloseForgotPassword}>
          <div className="forgot-password-modal" onClick={(event) => event.stopPropagation()}>
            <h3>Forgot Password</h3>
            <p>Enter your registered email address to receive a password reset link.</p>

            <label htmlFor="reset-email">Email</label>
            <input
              id="reset-email"
              type="email"
              placeholder="Enter your registered email"
              value={resetEmail}
              onChange={(event) => setResetEmail(event.target.value)}
            />

            <div className="forgot-password-actions">
              <button type="button" className="reset-link-button" onClick={handleSendResetLink}>
                Send Reset Link
              </button>
              <button type="button" className="close-button" onClick={handleCloseForgotPassword}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
