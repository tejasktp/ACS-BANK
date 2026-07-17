import { useEffect, useMemo, useState } from "react";
import UserForm from "../../components/form/UserForm";
import { getUsers } from "../../services/userService";

const PAGE_SIZE = 2;

function ActionButtons({ status, screenPermissions }) {
  return (
    <div className="action-buttons">
      {screenPermissions?.modify && (
        <button type="button" className="action-btn" title="Edit">✎</button>
      )}
      {screenPermissions?.modify && (
        <button type="button" className="action-btn" title={status === "Locked" ? "Unlock" : "Lock"}>
          {status === "Locked" ? "🔓" : "🔒"}
        </button>
      )}
      {screenPermissions?.delete && (
        <button type="button" className="action-btn" title="Delete">🗑</button>
      )}
    </div>
  );
}

export default function Users({ screenPermissions, session, selectedInstitutionId }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(1);
  const [appliedSearch, setAppliedSearch] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getUsers(session, selectedInstitutionId);

        if (isMounted) {
          setUsers(data);
          setPage(1);
        }
      } catch (loadError) {
        if (isMounted) {
          setUsers([]);
          setError(loadError.message || "Failed to load users.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (session) {
      loadUsers();
    } else {
      setUsers([]);
      setError(null);
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [session, selectedInstitutionId]);

  const roleOptions = useMemo(() => {
    return [...new Set(users.map((user) => user.role).filter(Boolean))].sort();
  }, [users]);

  const handleSaveUser = (user) => {
    const nextId = `U${String(users.length + 1).padStart(3, "0")}`;
    setUsers((current) => [...current, { id: nextId, ...user }]);
    setShowAddForm(false);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        !appliedSearch ||
        user.name.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        user.id.toLowerCase().includes(appliedSearch.toLowerCase());
      const matchesRole = roleFilter === "All Roles" || user.role === roleFilter;
      const matchesStatus = statusFilter === "All Status" || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, appliedSearch, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageUsers = filteredUsers.slice(startIndex, startIndex + PAGE_SIZE);

  const handleSearch = () => {
    setAppliedSearch(search);
    setPage(1);
  };

  return (
    <div className="user-management-page">
      <div className="page-header">
        <div>
          <p className="small-label">USER MANAGEMENT / USERS</p>
          <h2>Manage system users</h2>
          <p className="page-description">
            Search, filter, and manage user accounts across all roles.
          </p>
        </div>
        {screenPermissions?.add && (
          <button type="button" className="primary-button" onClick={() => setShowAddForm(true)}>
            + Add User
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="table-card">
          <UserForm
            onCancel={() => setShowAddForm(false)}
            onSave={handleSaveUser}
          />
        </div>
      )}

      <div className={`table-card${showAddForm ? " permissions-card" : ""}`}>
        <div className="filter-bar">
          <input
            type="text"
            className="filter-input"
            placeholder="Search by name, email or user id..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <select
            className="filter-select"
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          >
            <option>All Roles</option>
            {roleOptions.map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Locked</option>
          </select>
          <button type="button" className="primary-button" onClick={handleSearch}>
            Search
          </button>
        </div>

        <div className="table-scroll">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6}>Loading users...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6}>{error}</td>
                </tr>
              ) : pageUsers.length === 0 ? (
                <tr>
                  <td colSpan={6}>No users found.</td>
                </tr>
              ) : (
                pageUsers.map((user) => (
                  <tr key={user.email}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span className={`status-badge ${user.status.toLowerCase()}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <ActionButtons status={user.status} screenPermissions={screenPermissions} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-bar">
          <span className="pagination-info">
            Showing {filteredUsers.length === 0 ? 0 : startIndex + 1} to{" "}
            {Math.min(startIndex + PAGE_SIZE, filteredUsers.length)} of {filteredUsers.length} entries
          </span>
          <div className="pagination-controls">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                className={pageNum === currentPage ? "page-btn active" : "page-btn"}
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </button>
            ))}
            <select
              className="filter-select page-size-select"
              value={PAGE_SIZE}
              readOnly
            >
              <option>{PAGE_SIZE} / page</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
