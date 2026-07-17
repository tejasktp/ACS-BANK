const PERMISSION_LABELS = [
  { key: "add", label: "Add" },
  { key: "modify", label: "Modify" },
  { key: "delete", label: "Delete" },
  { key: "query", label: "Query" },
  { key: "checker", label: "Checker" },
  { key: "authorizer", label: "Authorizer" },
];

export default function ScreenPermissionPanel({ screenLabel, screenId, permissions }) {
  if (!permissions || !screenId) {
    return null;
  }

  return (
    <div className="table-card permissions-card screen-permission-panel">
      <div className="table-card-header">
        <div>
          <h3>Screen Permissions</h3>
          <p>
            {screenLabel} (Screen ID: {screenId})
          </p>
        </div>
      </div>
      <div className="permissions-grid">
        {PERMISSION_LABELS.map(({ key, label }) => {
          const granted = permissions[key];
          return (
            <div key={key} className={`permission-item ${granted ? "granted" : ""}`}>
              <input type="checkbox" checked={granted} readOnly />
              <span>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
