import { useState } from "react";

const emptyForm = {
  id: "",
  name: "",
  countryCode: "IN",
  status: "ACTIVE",
};

function formatDateTime(date = new Date()) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export default function InstitutionForm({ onCancel, onSave }) {
  const [form, setForm] = useState(emptyForm);

  const canSubmit = form.id.trim() && form.name.trim() && form.countryCode.trim();

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    const now = formatDateTime();
    onSave({
      id: form.id.trim().toUpperCase(),
      name: form.name.trim(),
      countryCode: form.countryCode.trim().toUpperCase(),
      status: form.status,
      createdAt: now,
      updatedAt: now,
    });
    setForm(emptyForm);
  };

  return (
    <form className="password-form" onSubmit={handleSubmit}>
      <h3>Add Institution</h3>
      <p className="page-description">Enter institution details to add a new record.</p>

      <div className="form-field">
        <label htmlFor="institution-id">Institution ID</label>
        <input
          id="institution-id"
          type="text"
          className="filter-input"
          placeholder="e.g. HDFC01"
          value={form.id}
          onChange={handleChange("id")}
        />
      </div>

      <div className="form-field">
        <label htmlFor="institution-name">Institution Name</label>
        <input
          id="institution-name"
          type="text"
          className="filter-input"
          placeholder="e.g. HDFC Bank Limited"
          value={form.name}
          onChange={handleChange("name")}
        />
      </div>

      <div className="form-field">
        <label htmlFor="country-code">Country Code</label>
        <input
          id="country-code"
          type="text"
          className="filter-input"
          placeholder="e.g. IN"
          value={form.countryCode}
          onChange={handleChange("countryCode")}
        />
      </div>

      <div className="form-field">
        <label htmlFor="institution-status">Status</label>
        <select
          id="institution-status"
          className="filter-select"
          value={form.status}
          onChange={handleChange("status")}
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>

      <div className="pagination-controls">
        <button type="button" className="secondary-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="primary-button" disabled={!canSubmit}>
          Save Institution
        </button>
      </div>
    </form>
  );
}
