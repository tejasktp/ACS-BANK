import { useEffect, useState } from "react";
import InstitutionForm from "../../components/form/InstitutionForm";
import { getInstitutions } from "../../services/institutionService";

function mapFormToInstitution(institution) {
  return {
    institutionId: institution.id,
    institutionName: institution.name,
    isoCountryCode: institution.countryCode,
    status: institution.status,
    createdAt: institution.createdAt,
    updatedAt: institution.updatedAt,
    createdBy: "SYSTEM",
    updatedBy: "SYSTEM",
  };
}

export default function Institution({
  screenPermissions,
  session,
  selectedInstitutionId,
}) {
  const [institutions, setInstitutions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const total = institutions.length;

  useEffect(() => {
    let isMounted = true;

    async function loadInstitutions() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getInstitutions(session, selectedInstitutionId);

        if (isMounted) {
          setInstitutions(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setInstitutions([]);
          setError(loadError.message || "Failed to load institutions.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (session) {
      loadInstitutions();
    } else {
      setInstitutions([]);
      setError(null);
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [session, selectedInstitutionId]);

  const handleSaveInstitution = (institution) => {
    setInstitutions((current) => [...current, mapFormToInstitution(institution)]);
    setShowAddForm(false);
  };

  return (
    <div className="user-management-page">
      <div className="page-header">
        <div>
          <h2>Institution</h2>
          <p className="page-description">Manage institutions in the system</p>
        </div>
      </div>

      {showAddForm && (
        <div className="table-card">
          <InstitutionForm
            onCancel={() => setShowAddForm(false)}
            onSave={handleSaveInstitution}
          />
        </div>
      )}

      <div className={`table-card${showAddForm ? " permissions-card" : ""}`}>
        <div className="table-card-header">
          <div>
            <h3>Institution</h3>
          </div>
          <div className="pagination-controls">
            {screenPermissions?.add && (
              <button
                type="button"
                className="primary-button"
                onClick={() => setShowAddForm(true)}
              >
                Add Institution
              </button>
            )}
            <button type="button" className="secondary-button">Export</button>
          </div>
        </div>

        <div className="table-scroll">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Institution ID</th>
                <th>Institution Name</th>
                <th>Country Code</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7}>Loading institutions...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7}>{error}</td>
                </tr>
              ) : institutions.length === 0 ? (
                <tr>
                  <td colSpan={7}>No institutions found.</td>
                </tr>
              ) : (
                institutions.map((institution) => (
                  <tr key={institution.institutionId}>
                    <td>{institution.institutionId}</td>
                    <td>{institution.institutionName}</td>
                    <td>{institution.isoCountryCode}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          institution.status === "ACTIVE" ? "active" : "pending"
                        }`}
                      >
                        {institution.status}
                      </span>
                    </td>
                    <td>{institution.createdAt}</td>
                    <td>{institution.updatedAt}</td>
                    <td />
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-bar">
          <span className="pagination-info">
            Showing 1 to {total} of {total} institutions
          </span>
          <div className="pagination-controls">
            <button type="button" className="page-btn">Previous</button>
            <button type="button" className="page-btn">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
