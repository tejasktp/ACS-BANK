import { useEffect, useState } from "react";
import InstitutionACSURLForm from "../../components/form/InstitutionACSURLForm";
import { getInstitutionAcsUrls } from "../../services/institutionService";

function formatChallengeUrl(url) {
  return url.length > 32 ? `${url.slice(0, 28)}...` : url;
}

function getAcsUrlKey(acsUrl) {
  return `${acsUrl.institutionId}-${acsUrl.channel}-${acsUrl.network}`;
}

export default function InstitutionACSURL({
  screenPermissions,
  session,
  selectedInstitutionId,
}) {
  const [acsUrls, setAcsUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const total = acsUrls.length;

  useEffect(() => {
    let isMounted = true;

    async function loadAcsUrls() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getInstitutionAcsUrls(session, selectedInstitutionId);

        if (isMounted) {
          setAcsUrls(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setAcsUrls([]);
          setError(loadError.message || "Failed to load institution ACS URLs.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (session) {
      loadAcsUrls();
    } else {
      setAcsUrls([]);
      setError(null);
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [session, selectedInstitutionId]);

  const handleSaveAcsUrl = (acsUrl) => {
    setAcsUrls((current) => [...current, acsUrl]);
    setShowAddForm(false);
  };

  return (
    <div className="user-management-page">
      <div className="page-header">
        <div>
          <h2>Institution ACS URL</h2>
          <p className="page-description">
            Manage institution ACS challenge URLs and channel mappings
          </p>
        </div>
      </div>

      {showAddForm && (
        <div className="table-card">
          <InstitutionACSURLForm
            defaultInstitutionId={selectedInstitutionId || session?.institutionId || ""}
            onCancel={() => setShowAddForm(false)}
            onSave={handleSaveAcsUrl}
          />
        </div>
      )}

      <div className={`table-card${showAddForm ? " permissions-card" : ""}`}>
        <div className="table-card-header">
          <div>
            <h3>Institution ACS URL</h3>
          </div>
          <div className="pagination-controls">
            {screenPermissions?.add && (
              <button
                type="button"
                className="primary-button"
                onClick={() => setShowAddForm(true)}
              >
                Add ACS URL
              </button>
            )}
            <button type="button" className="secondary-button">
              Export
            </button>
          </div>
        </div>

        <div className="table-scroll">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Institution ID</th>
                <th>Channel</th>
                <th>Network</th>
                <th>Challenge URL</th>
                <th>Created By</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8}>Loading institution ACS URLs...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8}>{error}</td>
                </tr>
              ) : acsUrls.length === 0 ? (
                <tr>
                  <td colSpan={8}>No institution ACS URLs found.</td>
                </tr>
              ) : (
                acsUrls.map((acsUrl) => (
                  <tr key={getAcsUrlKey(acsUrl)}>
                    <td>{acsUrl.institutionId}</td>
                    <td>{acsUrl.channel}</td>
                    <td>{acsUrl.network}</td>
                    <td>
                      <a
                        href={acsUrl.challengeUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "#0f3d8f" }}
                      >
                        {formatChallengeUrl(acsUrl.challengeUrl)}
                      </a>
                    </td>
                    <td>{acsUrl.createdBy}</td>
                    <td>{acsUrl.createdAt}</td>
                    <td>{acsUrl.updatedAt}</td>
                    <td />
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-bar">
          <span className="pagination-info">
            Showing 1 to {total} of {total} institution ACS URLs
          </span>
          <div className="pagination-controls">
            <button type="button" className="page-btn">
              Previous
            </button>
            <button type="button" className="page-btn">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
