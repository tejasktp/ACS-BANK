import { useState } from "react";

const emptyForm = {
  name: "",
  email: "",
  role: "Admin",
  status: "Active",
  password: "",
};

export default function UserForm({ onCancel, onSave }) {
  const [form, setForm] = useState(emptyForm);

  const canSubmit =
    form.name.trim() &&
    form.email.trim() &&
    form.password.trim() &&
    form.password.length >= 8;

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    onSave({
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      status: form.status,
    });
    setForm(emptyForm);
  };

  return (
    <form className="password-form" onSubmit={handleSubmit}>
      <h3>Add User</h3>
      <p className="page-description">Enter user details to create a new account.</p>

      <div className="form-field">
        <label htmlFor="user-name">Full Name</label>
        <input
          id="user-name"
          type="text"
          className="filter-input"
          placeholder="e.g. Rahul Sharma"
          value={form.name}
          onChange={handleChange("name")}
        />
      </div>

      <div className="form-field">
        <label htmlFor="user-email">Email</label>
        <input
          id="user-email"
          type="email"
          className="filter-input"
          placeholder="e.g. rahul.sharma@bank.com"
          value={form.email}
          onChange={handleChange("email")}
        />
      </div>

      <div className="form-field">
        <label htmlFor="user-role">Role</label>
        <select
          id="user-role"
          className="filter-select"
          value={form.role}
          disabled
        >
          <option value="Admin">Admin</option>
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="user-status">Status</label>
        <select
          id="user-status"
          className="filter-select"
          value={form.status}
          onChange={handleChange("status")}
        >
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Locked">Locked</option>
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="user-password">Password</label>
        <input
          id="user-password"
          type="password"
          className="filter-input"
          placeholder="Minimum 8 characters"
          value={form.password}
          onChange={handleChange("password")}
        />
      </div>

      <div className="pagination-controls">
        <button type="button" className="secondary-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="primary-button" disabled={!canSubmit}>
          Save User
        </button>
      </div>
    </form>
  );
}
