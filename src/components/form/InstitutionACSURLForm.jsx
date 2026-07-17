import { useState } from "react";

const emptyForm = {
  institutionId: "",
  channel: "APP",
  network: "01",
  challengeUrl: "",
  createdBy: "",
};

function formatDateTime(date = new Date()) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export default function InstitutionACSURLForm({
  defaultInstitutionId = "",
  onCancel,
  onSave,
}) {
  const [form, setForm] = useState({
    ...emptyForm,
    institutionId: defaultInstitutionId,
  });

  const canSubmit =
    form.institutionId.trim() &&
    form.channel.trim() &&
    form.network.trim() &&
    form.challengeUrl.trim() &&
    form.createdBy.trim();

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    const institutionId = form.institutionId.trim().toUpperCase();
    const channel = form.channel.trim().toUpperCase();
    const now = formatDateTime();

    const network = form.network.trim();

    onSave({
      institutionId,
      channel,
      network,
      challengeUrl: form.challengeUrl.trim(),
      createdBy: form.createdBy.trim(),
      createdAt: now,
      updatedAt: now,
    });
    setForm(emptyForm);
  };

  return (
    <form className="password-form" onSubmit={handleSubmit}>
      <h3>Add ACS URL</h3>
      <p className="page-description">
        Enter ACS URL details to add a new record.
      </p>

      <div className="form-field">
        <label htmlFor="acs-institution-id">Institution ID</label>
        <input
          id="acs-institution-id"
          type="text"
          className="filter-input"
          placeholder="e.g. I0000"
          value={form.institutionId}
          onChange={handleChange("institutionId")}
        />
      </div>

      <div className="form-field">
        <label htmlFor="acs-channel">Channel</label>
        <select
          id="acs-channel"
          className="filter-select"
          value={form.channel}
          onChange={handleChange("channel")}
        >
          <option value="APP">APP</option>
          <option value="BRW">BRW</option>
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="acs-network">Network</label>
        <input
          id="acs-network"
          type="text"
          className="filter-input"
          placeholder="e.g. 01"
          value={form.network}
          onChange={handleChange("network")}
        />
      </div>

      <div className="form-field">
        <label htmlFor="acs-challenge-url">Challenge URL</label>
        <input
          id="acs-challenge-url"
          type="url"
          className="filter-input"
          placeholder="e.g. https://auth.hdfc.com/challenge"
          value={form.challengeUrl}
          onChange={handleChange("challengeUrl")}
        />
      </div>

      <div className="form-field">
        <label htmlFor="acs-created-by">Created By</label>
        <input
          id="acs-created-by"
          type="email"
          className="filter-input"
          placeholder="e.g. admin@hdfc.com"
          value={form.createdBy}
          onChange={handleChange("createdBy")}
        />
      </div>

      <div className="pagination-controls">
        <button type="button" className="secondary-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="primary-button" disabled={!canSubmit}>
          Save ACS URL
        </button>
      </div>
    </form>
  );
}
