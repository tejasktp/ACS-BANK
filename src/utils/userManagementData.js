export const roles = [
  { name: "Admin", description: "Full system access", status: "Active" },
  { name: "Manager", description: "Manage users and reports", status: "Active" },
  { name: "Operator", description: "Day-to-day operations", status: "Active" },
  { name: "Auditor", description: "Read-only audit access", status: "Active" },
];

export const permissions = [
  "Create User",
  "Edit User",
  "Delete User",
  "Approve Requests",
  "Manage Roles",
  "View Reports",
  "Manage Institutions",
  "System Config",
  "Block Cards",
  "Audit Logs",
  "Batch Execution",
  "Change Password",
];

export const rolePermissions = {
  Admin: permissions.reduce((acc, p) => ({ ...acc, [p]: true }), {}),
  Manager: {
    "Create User": true,
    "Edit User": true,
    "Delete User": false,
    "Approve Requests": true,
    "Manage Roles": false,
    "View Reports": true,
    "Manage Institutions": true,
    "System Config": false,
    "Block Cards": true,
    "Audit Logs": true,
    "Batch Execution": false,
    "Change Password": true,
  },
  Operator: {
    "Create User": false,
    "Edit User": true,
    "Delete User": false,
    "Approve Requests": false,
    "Manage Roles": false,
    "View Reports": true,
    "Manage Institutions": false,
    "System Config": false,
    "Block Cards": true,
    "Audit Logs": false,
    "Batch Execution": true,
    "Change Password": true,
  },
  Auditor: {
    "Create User": false,
    "Edit User": false,
    "Delete User": false,
    "Approve Requests": false,
    "Manage Roles": false,
    "View Reports": true,
    "Manage Institutions": false,
    "System Config": false,
    "Block Cards": false,
    "Audit Logs": true,
    "Batch Execution": false,
    "Change Password": true,
  },
};

export const users = [
  { id: "U001", name: "Rahul Sharma", email: "rahul.sharma@bank.com", role: "Operator", status: "Active" },
  { id: "U002", name: "Neha Singh", email: "neha.singh@bank.com", role: "Manager", status: "Active" },
  { id: "U003", name: "Amit Patel", email: "amit.patel@bank.com", role: "Auditor", status: "Locked" },
  { id: "U004", name: "Priya Gupta", email: "priya.gupta@bank.com", role: "Admin", status: "Active" },
  { id: "U005", name: "Vikram Desai", email: "vikram.desai@bank.com", role: "Operator", status: "Pending" },
  { id: "U006", name: "Sneha Reddy", email: "sneha.reddy@bank.com", role: "Manager", status: "Active" },
  { id: "U007", name: "Karan Mehta", email: "karan.mehta@bank.com", role: "Operator", status: "Active" },
  { id: "U008", name: "Anita Joshi", email: "anita.joshi@bank.com", role: "Auditor", status: "Active" },
];

export const passwordHistory = [
  { user: "Rahul Sharma", changedOn: "12 Jun 2026, 10:30 AM" },
  { user: "Neha Singh", changedOn: "10 Jun 2026, 03:15 PM" },
  { user: "Amit Patel", changedOn: "08 Jun 2026, 09:45 AM" },
  { user: "Priya Gupta", changedOn: "05 Jun 2026, 11:20 AM" },
  { user: "Vikram Desai", changedOn: "01 Jun 2026, 02:00 PM" },
];
