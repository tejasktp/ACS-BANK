import { useEffect, useState } from "react";
import RoleForm from "../../components/form/RoleForm";
import { getRoles } from "../../services/roleService";
import {
  permissions,
  rolePermissions as initialRolePermissions,
} from "../../utils/userManagementData";

function ActionButtons() {
  return (
    <div className="action-buttons">
      <button type="button" className="action-btn" title="Edit">✎</button>
      <button type="button" className="action-btn" title="Delete">🗑</button>
      <button type="button" className="action-btn" title="View">👁</button>
    </div>
  );
}

export default function Roles({ session, selectedInstitutionId }) {
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rolePermissions, setRolePermissions] = useState(initialRolePermissions);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadRoles() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getRoles(session, selectedInstitutionId);

        if (isMounted) {
          setRoles(data);
          setSelectedRole((current) => {
            if (current && data.some((role) => role.name === current)) {
              return current;
            }
            return data[0]?.name ?? null;
          });
        }
      } catch (loadError) {
        if (isMounted) {
          setRoles([]);
          setSelectedRole(null);
          setError(loadError.message || "Failed to load roles.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (session) {
      loadRoles();
    } else {
      setRoles([]);
      setSelectedRole(null);
      setError(null);
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [session, selectedInstitutionId]);

  const handleSaveRole = (role) => {
    setRoles((current) => [...current, role]);
    setRolePermissions((current) => ({
      ...current,
      [role.name]: permissions.reduce((acc, permission) => ({ ...acc, [permission]: false }), {}),
    }));
    setSelectedRole(role.name);
    setShowAddForm(false);
  };

  return (
    <div className="user-management-page">
      <div className="page-header">
        <div>
          <p className="small-label">USER MANAGEMENT / ROLES</p>
          <h2>Manage system roles and their permissions</h2>
          <p className="page-description">
            Define roles, review status, and configure permissions for each role.
          </p>
        </div>
        <button type="button" className="primary-button" onClick={() => setShowAddForm(true)}>
          + Add Role
        </button>
      </div>

      {showAddForm && (
        <div className="table-card">
          <RoleForm
            existingNames={roles.map((role) => role.name)}
            onCancel={() => setShowAddForm(false)}
            onSave={handleSaveRole}
          />
        </div>
      )}

      <div className={`table-card${showAddForm ? " permissions-card" : ""}`}>
        <div className="table-scroll">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Role Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4}>Loading roles...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4}>{error}</td>
                </tr>
              ) : roles.length === 0 ? (
                <tr>
                  <td colSpan={4}>No roles found.</td>
                </tr>
              ) : (
                roles.map((role) => (
                  <tr
                    key={`${role.id}-${role.institutionId}`}
                    className={selectedRole === role.name ? "selected-row" : ""}
                    onClick={() => setSelectedRole(role.name)}
                  >
                    <td>{role.name}</td>
                    <td>{role.description}</td>
                    <td>
                      <span className={`status-badge ${role.status.toLowerCase()}`}>
                        {role.status}
                      </span>
                    </td>
                    <td>
                      <ActionButtons />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="table-card permissions-card">
        <div className="table-card-header">
          <div>
            <h3>Role Permissions ({selectedRole ?? "—"})</h3>
            <p>Permissions granted to the selected role.</p>
          </div>
        </div>
        <div className="permissions-grid">
          {permissions.map((permission) => {
            const granted = selectedRole ? rolePermissions[selectedRole]?.[permission] : false;
            return (
              <label key={permission} className={`permission-item ${granted ? "granted" : ""}`}>
                <input type="checkbox" checked={granted} readOnly />
                <span>{permission}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
