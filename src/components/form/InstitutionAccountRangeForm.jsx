import { useState } from "react";

const emptyForm = {
  description: "",
  cardRangeFrom: "",
  cardRangeTo: "",
  attempts: "3",
  status: "ACTIVE",
};

export default function InstitutionAccountRangeForm({ onCancel, onSave }) {
  const [form, setForm] = useState(emptyForm);

  const canSubmit =
    form.description.trim() &&
    form.cardRangeFrom.trim() &&
    form.cardRangeTo.trim() &&
    form.attempts.trim();

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    onSave({
      description: form.description.trim(),
      cardRange: `${form.cardRangeFrom.trim()}.. - ${form.cardRangeTo.trim()}..`,
      attempts: Number(form.attempts),
      status: form.status,
    });
    setForm(emptyForm);
  };

  return (
    <form className="password-form" onSubmit={handleSubmit}>
      <h3>Add Account Range</h3>
      <p className="page-description">
        Enter account range details to add a new record.
      </p>

      <div className="form-field">
        <label htmlFor="range-description">Description</label>
        <input
          id="range-description"
          type="text"
          className="filter-input"
          placeholder="e.g. Challenge Test Range"
          value={form.description}
          onChange={handleChange("description")}
        />
      </div>

      <div className="form-field">
        <label htmlFor="range-from">Card Range From</label>
        <input
          id="range-from"
          type="text"
          className="filter-input"
          placeholder="e.g. 4100"
          value={form.cardRangeFrom}
          onChange={handleChange("cardRangeFrom")}
        />
      </div>

      <div className="form-field">
        <label htmlFor="range-to">Card Range To</label>
        <input
          id="range-to"
          type="text"
          className="filter-input"
          placeholder="e.g. 4199"
          value={form.cardRangeTo}
          onChange={handleChange("cardRangeTo")}
        />
      </div>

      <div className="form-field">
        <label htmlFor="range-attempts">Attempts</label>
        <input
          id="range-attempts"
          type="number"
          min="1"
          className="filter-input"
          value={form.attempts}
          onChange={handleChange("attempts")}
        />
      </div>

      <div className="form-field">
        <label htmlFor="range-status">Status</label>
        <select
          id="range-status"
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
          Save Range
        </button>
      </div>
    </form>
  );
}
