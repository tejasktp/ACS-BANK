import { useEffect, useState } from "react";
import {
  formatRoleColumnLabel,
  getRoleKey,
  loadPermissionMappingData,
} from "../../services/permissionMappingService";

export default function RolePermissionMapping({ session }) {
  const [roles, setRoles] = useState([]);
  const [rows, setRows] = useState([]);
  const [mapping, setMapping] = useState({});
  const [institutions, setInstitutions] = useState([]);
  const [initialMapping, setInitialMapping] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMapping() {
      if (!session) {
        if (isMounted) {
          setRoles([]);
          setRows([]);
          setMapping({});
          setInitialMapping({});
          setInstitutions([]);
          setError(null);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await loadPermissionMappingData(session);

        if (isMounted) {
          setRoles(data.roles);
          setRows(data.rows);
          setMapping(data.mapping);
          setInitialMapping(structuredClone(data.mapping));
          setInstitutions(data.institutions);
        }
      } catch (loadError) {
        if (isMounted) {
          setRoles([]);
          setRows([]);
          setMapping({});
          setInitialMapping({});
          setInstitutions([]);
          setError(loadError.message || "Failed to load role permission mapping.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMapping();

    return () => {
      isMounted = false;
    };
  }, [session]);

  const togglePermission = (rowId, roleKey) => {
    setMapping((prev) => ({
      ...prev,
      [roleKey]: {
        ...prev[roleKey],
        [rowId]: !prev[roleKey]?.[rowId],
      },
    }));
  };

  const handleReset = () => {
    setMapping(structuredClone(initialMapping));
  };

  const handleSave = () => {
    // Mapping state is already updated as checkboxes change.
  };

  const handleSaveClick = () => {
    if (window.confirm("Are you sure you want to save the permission mappings")) {
      handleSave();
    }
  };

  const handleResetClick = () => {
    if (window.confirm("Are you sure you want to reset all permission mappings")) {
      handleReset();
    }
  };

  return (
    <div className="user-management-page">
      <div className="page-header">
        <div>
          <p className="small-label">USER MANAGEMENT / ROLE PERMISSION MAPPING</p>
          <h2>Role permission mapping</h2>
          <p className="page-description">
            Assign and review permissions across all system roles.
          </p>
        </div>
      </div>

      <div className="table-card">
        <div className="mapping-controls">
          <div className="mapping-actions">
            <button type="button" className="primary-button" onClick={handleSaveClick}>
              Save Mapping
            </button>
            <button type="button" className="secondary-button" onClick={handleResetClick}>
              Reset Mapping
            </button>
          </div>
        </div>

        <div className="table-scroll">
          <table className="transaction-table permission-matrix">
            <thead>
              <tr>
                <th>Permission</th>
                {roles.map((role) => {
                  const roleKey = getRoleKey(role.id, role.institutionId);
                  return (
                    <th key={roleKey}>{formatRoleColumnLabel(role, institutions)}</th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={Math.max(roles.length + 1, 2)}>Loading role permission mapping...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={Math.max(roles.length + 1, 2)}>{error}</td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={Math.max(roles.length + 1, 2)}>No permissions found.</td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.label}</td>
                    {roles.map((role) => {
                      const roleKey = getRoleKey(role.id, role.institutionId);
                      const granted = mapping[roleKey]?.[row.id];
                      return (
                        <td key={roleKey} className="matrix-cell">
                          <label className={`matrix-checkbox ${granted ? "granted" : ""}`}>
                            <input
                              type="checkbox"
                              checked={Boolean(granted)}
                              onChange={() => togglePermission(row.id, roleKey)}
                            />
                          </label>
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="mapping-note">Note: Permissions marked in blue are granted.</p>
      </div>
    </div>
  );
}
