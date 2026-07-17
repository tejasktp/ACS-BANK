const institutions = [
  { id: "HDFC01", name: "HDFC Bank Limited", status: "ACTIVE" },
  { id: "ICIC02", name: "ICICI Bank Limited", status: "ACTIVE" },
  { id: "AXIS03", name: "Axis Bank Limited", status: "INACTIVE" },
  { id: "KOTAK04", name: "Kotak Mahindra Bank", status: "ACTIVE" },
];

export default function InstitutionMgmt() {
  return (
    <div className="user-management-page">
      <div className="page-header">
        <div>
          <h2>Institution Management</h2>
          <p className="page-description">Institution status overview</p>
        </div>
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <h3>Status</h3>
        </div>

        <div className="table-scroll">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Institution Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {institutions.map((institution) => (
                <tr key={institution.id}>
                  <td>{institution.name}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        institution.status === "ACTIVE" ? "active" : "pending"
                      }`}
                    >
                      {institution.status}
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
