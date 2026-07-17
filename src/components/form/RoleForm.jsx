import { useState } from "react";

const emptyForm = {
  name: "",
  description: "",
  status: "Active",
};

export default function RoleForm({ onCancel, onSave, existingNames = [] }) {
  const [form, setForm] = useState(emptyForm);
  const [nameError, setNameError] = useState("");

  const trimmedName = form.name.trim();
  const trimmedDescription = form.description.trim();

  const isDuplicateName = existingNames.some(
    (name) => name.toLowerCase() === trimmedName.toLowerCase()
  );

  const canSubmit = trimmedName && trimmedDescription && !isDuplicateName;

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    if (field === "name") {
      setNameError("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isDuplicateName) {
      setNameError("A role with this name already exists.");
      return;
    }

    if (!canSubmit) {
      return;
    }

    onSave({
      name: trimmedName,
      description: trimmedDescription,
      status: form.status,
    });
    setForm(emptyForm);
    setNameError("");
  };

  return (
    <form className="password-form" onSubmit={handleSubmit}>
      <h3>Add Role</h3>
      <p className="page-description">Enter role details. All fields are required.</p>

      <div className="form-field">
        <label htmlFor="role-name">Role Name *</label>
        <input
          id="role-name"
          type="text"
          className="filter-input"
          placeholder="e.g. Supervisor"
          value={form.name}
          onChange={handleChange("name")}
          required
        />
        {nameError && <p className="form-error">{nameError}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="role-description">Description *</label>
        <input
          id="role-description"
          type="text"
          className="filter-input"
          placeholder="e.g. Oversees daily operations"
          value={form.description}
          onChange={handleChange("description")}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="role-status">Status *</label>
        <select
          id="role-status"
          className="filter-select"
          value={form.status}
          onChange={handleChange("status")}
          required
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="pagination-controls">
        <button type="button" className="secondary-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="primary-button" disabled={!canSubmit}>
          Save Role
        </button>
      </div>
    </form>
  );
}
