import { useMemo, useState } from "react";
import { makerCheckerModules as initialModules } from "../../utils/makerCheckerData";

export default function EnableDisable() {
  const [modules, setModules] = useState(initialModules);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [appliedSearch, setAppliedSearch] = useState("");

  const filteredModules = useMemo(() => {
    return modules.filter((item) => {
      const query = appliedSearch.toLowerCase();
      const matchesSearch =
        !query ||
        item.module.toLowerCase().includes(query) ||
        item.operation.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "All Status" ||
        (statusFilter === "Enabled" && item.enabled) ||
        (statusFilter === "Disabled" && !item.enabled);
      return matchesSearch && matchesStatus;
    });
  }, [modules, appliedSearch, statusFilter]);

  const enabledCount = modules.filter((item) => item.enabled).length;
  const disabledCount = modules.length - enabledCount;

  const toggleModule = (id) => {
    setModules((current) =>
      current.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const handleSearch = () => {
    setAppliedSearch(search);
  };

  const handleSave = () => {
    // Module state is already updated as toggles change.
  };

  const handleReset = () => {
    setModules(initialModules);
    setSearch("");
    setAppliedSearch("");
    setStatusFilter("All Status");
  };

  const handleSaveClick = () => {
    if (window.confirm("Are you sure you want to save the maker-checker settings?")) {
      handleSave();
    }
  };

  const handleResetClick = () => {
    if (window.confirm("Are you sure you want to reset all maker-checker settings?")) {
      handleReset();
    }
  };

  return (
    <div className="user-management-page">
      <div className="page-header">
        <div>
          <p className="small-label">MAKER-CHECKER / ENABLE / DISABLE</p>
          <h2>Enable / Disable Maker-Checker</h2>
          <p className="page-description">
            Configure which modules and operations require maker-checker approval before changes take effect.
          </p>
        </div>
      </div>

      <div className="management-grid">
        <div className="management-card">
          <h3>Total Modules</h3>
          <p>Operations configured for maker-checker</p>
          <div className="management-value">{modules.length}</div>
        </div>
        <div className="management-card">
          <h3>Enabled</h3>
          <p>Operations requiring approval</p>
          <div className="management-value">{enabledCount}</div>
        </div>
        <div className="management-card">
          <h3>Disabled</h3>
          <p>Operations without approval flow</p>
          <div className="management-value">{disabledCount}</div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div>
            <h3>Module Configuration</h3>
            <p>Enable or disable maker-checker workflow for each operation.</p>
          </div>
          <div className="mapping-actions">
            <button type="button" className="primary-button" onClick={handleSaveClick}>
              Save Changes
            </button>
            <button type="button" className="secondary-button" onClick={handleResetClick}>
              Reset
            </button>
          </div>
        </div>

        <div className="filter-bar">
          <input
            type="text"
            className="filter-input"
            placeholder="Search by module, operation or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>Enabled</option>
            <option>Disabled</option>
          </select>
          <button type="button" className="primary-button" onClick={handleSearch}>
            Search
          </button>
        </div>

        <div className="table-scroll">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Module ID</th>
                <th>Module</th>
                <th>Operation</th>
                <th>Description</th>
                <th>Status</th>
                <th>Last Modified</th>
                <th>Modified By</th>
                <th>Enable / Disable</th>
              </tr>
            </thead>
            <tbody>
              {filteredModules.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.module}</td>
                  <td>{item.operation}</td>
                  <td>{item.description}</td>
                  <td>
                    <span className={`status-badge ${item.enabled ? "active" : "locked"}`}>
                      {item.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </td>
                  <td>{item.lastModified}</td>
                  <td>{item.modifiedBy}</td>
                  <td>
                    <label className={`permission-item ${item.enabled ? "granted" : ""}`}>
                      <input
                        type="checkbox"
                        checked={item.enabled}
                        onChange={() => toggleModule(item.id)}
                      />
                      <span>{item.enabled ? "Enabled" : "Disabled"}</span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-bar">
          <span className="pagination-info">
            Showing {filteredModules.length} of {modules.length} operations
          </span>
        </div>

        <p className="mapping-note">
          Note: Enabled operations require a checker to approve changes submitted by a maker.
        </p>
      </div>
    </div>
  );
}
