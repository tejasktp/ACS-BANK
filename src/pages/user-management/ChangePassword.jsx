import { useMemo, useState } from "react";
import { passwordHistory } from "../../utils/userManagementData";

const passwordRules = [
  { label: "Minimum 8 characters", test: (p) => p.length >= 8 },
  { label: "At least one uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "At least one lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "At least one number", test: (p) => /\d/.test(p) },
  { label: "At least one special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function PasswordField({ label, value, onChange, show, onToggle }) {
  return (
    <div className="form-field">
      <label>{label}</label>
      <div className="password-input-wrap">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
        <button type="button" className="toggle-password" onClick={onToggle}>
          {show ? "🙈" : "👁"}
        </button>
      </div>
    </div>
  );
}

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const allRulesMet = useMemo(
    () => passwordRules.every((rule) => rule.test(newPassword)),
    [newPassword]
  );

  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const canSubmit = currentPassword && allRulesMet && passwordsMatch;

  return (
    <div className="user-management-page">
      <div className="page-header">
        <div>
          <p className="small-label">USER MANAGEMENT / CHANGE PASSWORD</p>
          <h2>Change password</h2>
          <p className="page-description">
            Update your password and review recent password change history.
          </p>
        </div>
      </div>

      <div className="two-column-grid">
        <div className="table-card">
          <h3>Change Password</h3>
          <form
            className="password-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (canSubmit) {
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }
            }}
          >
            <PasswordField
              label="Current Password"
              value={currentPassword}
              onChange={setCurrentPassword}
              show={showCurrent}
              onToggle={() => setShowCurrent((v) => !v)}
            />
            <PasswordField
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              show={showNew}
              onToggle={() => setShowNew((v) => !v)}
            />
            <PasswordField
              label="Confirm New Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              show={showConfirm}
              onToggle={() => setShowConfirm((v) => !v)}
            />

            <div className="password-policy">
              <p className="policy-title">Password Policy</p>
              <ul>
                {passwordRules.map((rule) => {
                  const met = rule.test(newPassword);
                  return (
                    <li key={rule.label} className={met ? "met" : ""}>
                      <span className="policy-check">{met ? "✓" : "○"}</span>
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
            </div>

            <button type="submit" className="primary-button full-width" disabled={!canSubmit}>
              Change Password
            </button>
          </form>
        </div>

        <div className="table-card">
          <h3>Password Change History</h3>
          <div className="table-scroll">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Changed On</th>
                </tr>
              </thead>
              <tbody>
                {passwordHistory.map((entry) => (
                  <tr key={entry.user + entry.changedOn}>
                    <td>{entry.user}</td>
                    <td>{entry.changedOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" className="secondary-button full-width history-reset-btn">
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}
