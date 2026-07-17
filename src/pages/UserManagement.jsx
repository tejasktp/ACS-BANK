import { useState } from "react";
import UserForm from "../components/form/UserForm";

const cards = [
  { title: "Roles", description: "Define system roles", value: "12 roles" },
  { title: "Users", description: "Manage user accounts", value: "425 users" },
  { title: "Change Password", description: "Reset user passwords", value: "24 requests" },
  { title: "Role Permission Mapping", description: "Assign permissions to roles", value: "8 mappings" },
];

const initialUserList = [
  { name: "Neha Singh", role: "Manager", status: "Active" },
  { name: "Rahul Sharma", role: "Operator", status: "Pending" },
  { name: "Priya Gupta", role: "Admin", status: "Active" },
  { name: "Amit Patel", role: "Auditor", status: "Locked" },
];

export default function UserManagement({ onNavigate }) {
  const [userList, setUserList] = useState(initialUserList);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSaveUser = (user) => {
    setUserList((current) => [...current, user]);
    setShowAddForm(false);
  };

  return (
    <div className="user-management-page">
      <div className="page-header">
        <div>
          <p className="small-label">USER MANAGEMENT</p>
          <h2>Manage users, roles & permissions</h2>
          <p className="page-description">Easily review user statuses and role assignments in one panel.</p>
        </div>
        <button type="button" className="primary-button" onClick={() => setShowAddForm(true)}>
          Add user
        </button>
      </div>

      {showAddForm && (
        <div className="table-card">
          <UserForm
            onCancel={() => setShowAddForm(false)}
            onSave={handleSaveUser}
          />
        </div>
      )}

      <div className="management-grid">
        {cards.map((card) => (
          <button
            key={card.title}
            type="button"
            className="management-card management-card-link"
            onClick={() => onNavigate?.(card.title)}
          >
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <div className="management-value">{card.value}</div>
          </button>
        ))}
      </div>

      <div className={`table-card${showAddForm ? " permissions-card" : ""}`}>
        <div className="table-card-header">
          <div>
            <h3>Users overview</h3>
            <p>Review the latest user account status and actions.</p>
          </div>
          <button className="secondary-button">Refresh</button>
        </div>

        <div className="table-scroll">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user) => (
                <tr key={user.name}>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className={`status-badge ${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
