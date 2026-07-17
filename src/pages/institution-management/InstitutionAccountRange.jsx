import { useEffect, useMemo, useState } from "react";
import InstitutionAccountRangeForm from "../../components/form/InstitutionAccountRangeForm";
import { getInstitutionAccountRanges } from "../../services/institutionService";
import { getInstitutions } from "../../utils/menuBuilder";
import { getInstitutionLogo } from "../../utils/institutionLogos";

const accountRangeFields = [
  { key: "institutionId", label: "institutionId" },
  { key: "institutionAccountId", label: "institutionAccountId" },
  { key: "institutionAccountStartRange", label: "institutionAccountStartRange" },
  { key: "institutionAccountEndRange", label: "institutionAccountEndRange" },
  { key: "institutionAccountDesc", label: "institutionAccountDesc" },
  { key: "attemptAllowed", label: "attemptAllowed" },
  { key: "blockOnExceedAttempt", label: "blockOnExceedAttempt" },
  { key: "status", label: "status" },
  { key: "cardType", label: "cardType" },
  { key: "riskFlag", label: "riskFlag" },
  { key: "network", label: "network" },
  { key: "createdAt", label: "createdAt" },
  { key: "createdBy", label: "createdBy" },
  { key: "updatedAt", label: "updatedAt" },
  { key: "updatedBy", label: "updatedBy" },
];

function formatCardBinRange(ranges) {
  if (!ranges.length) {
    return "—";
  }

  const prefixes = ranges
    .map((range) => range.institutionAccountStartRange?.slice(0, 2))
    .filter(Boolean);

  if (!prefixes.length) {
    return "—";
  }

  const uniquePrefixes = [...new Set(prefixes)].sort();
  const first = uniquePrefixes[0];
  const last = uniquePrefixes[uniquePrefixes.length - 1];

  return first === last ? `${first}xx` : `${first}xx - ${last}xx`;
}

export default function InstitutionAccountRange({
  screenPermissions,
  session,
  selectedInstitutionId,
}) {
  const [accountRanges, setAccountRanges] = useState([]);
  const [selectedRangeId, setSelectedRangeId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const activeInstitutionId =
    selectedInstitutionId || session?.institutionId || "I0000";
  const institutions = getInstitutions(session);
  const activeInstitution =
    institutions.find((institution) => institution.INSTITUTION_ID === activeInstitutionId) ||
    institutions[0];
  const activeInstitutionLogo = getInstitutionLogo(activeInstitution?.INSTITUTION_NAME);

  useEffect(() => {
    let isMounted = true;

    async function loadAccountRanges() {
      setIsLoading(true);
      setError(null);
      setSelectedRangeId(null);

      try {
        const data = await getInstitutionAccountRanges(session, activeInstitutionId);

        if (isMounted) {
          setAccountRanges(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setAccountRanges([]);
          setError(loadError.message || "Failed to load institution account ranges.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (session) {
      loadAccountRanges();
    } else {
      setAccountRanges([]);
      setError(null);
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [session, activeInstitutionId]);

  const summaryStats = useMemo(() => {
    const activeCount = accountRanges.filter((range) => range.status === "ACTIVE").length;
    const institutionCount = new Set(
      accountRanges.map((range) => range.institutionId).filter(Boolean)
    ).size;

    return [
      { label: "Total Ranges", value: String(accountRanges.length) },
      { label: "Active Ranges", value: String(activeCount) },
      { label: "Card Bin Ranges", value: formatCardBinRange(accountRanges) },
      { label: "Institutions", value: String(institutionCount) },
    ];
  }, [accountRanges]);

  const selectedRange = accountRanges.find(
    (range) => range.institutionAccountId === selectedRangeId
  );

  const handleSaveAccountRange = (range) => {
    const institutionAccountId = `ACC${String(accountRanges.length + 1).padStart(5, "0")}`;
    const [startPrefix, endPrefix] = range.cardRange
      .split(" - ")
      .map((value) => value.replace(/\.\./g, "").trim());
    const timestamp = new Date().toISOString().slice(0, 19);

    setAccountRanges((current) => [
      ...current,
      {
        institutionId: activeInstitutionId,
        institutionAccountId,
        institutionAccountStartRange: `${startPrefix}${"0".repeat(Math.max(0, 16 - startPrefix.length))}`,
        institutionAccountEndRange: `${endPrefix}${"9".repeat(Math.max(0, 16 - endPrefix.length))}`,
        institutionAccountDesc: range.description,
        attemptAllowed: range.attempts,
        blockOnExceedAttempt: 0,
        status: range.status,
        cardType: "DEBIT",
        riskFlag: 3,
        network: "01",
        createdAt: timestamp,
        createdBy: "SYSTEM",
        updatedAt: timestamp,
        updatedBy: "SYSTEM",
      },
    ]);
    setShowAddForm(false);
  };

  const renderFieldValue = (range, fieldKey) => {
    if (fieldKey === "status") {
      return (
        <span
          className={`status-badge ${
            range.status === "ACTIVE" ? "active" : "pending"
          }`}
        >
          {range.status}
        </span>
      );
    }

    return range[fieldKey];
  };

  return (
    <div className="user-management-page">
      <div className="page-header">
        <div>
          <p className="small-label">INSTITUTION MANAGEMENT</p>
          <h2>Institution Account Range</h2>
          <p className="page-description">
            Manage and configure account ranges for institutions. Click on any
            account to view detailed information.
          </p>
        </div>
        {activeInstitution && (
          <div className="header-profile" style={{ flexShrink: 0 }}>
            <div className="header-bank-brand" style={{ cursor: "default" }}>
              {activeInstitutionLogo && (
                <img
                  src={activeInstitutionLogo}
                  alt=""
                  className="header-bank-logo"
                  aria-hidden="true"
                />
              )}
              <span className="header-bank-name">{activeInstitution.INSTITUTION_NAME}</span>
            </div>
          </div>
        )}
      </div>

      <div className="management-grid">
        {summaryStats.map((stat) => (
          <div key={stat.label} className="summary-card">
            <div className="summary-label">{stat.label}</div>
            <div className="summary-value">{stat.value}</div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="table-card">
          <InstitutionAccountRangeForm
            onCancel={() => setShowAddForm(false)}
            onSave={handleSaveAccountRange}
          />
        </div>
      )}

      <div className={`table-card${showAddForm ? " permissions-card" : ""}`}>
        <div className="table-card-header">
          <div>
            <h3>Account Ranges Overview</h3>
            <p>Review the latest account ranges and their configurations.</p>
          </div>
          <div className="pagination-controls">
            {screenPermissions?.add && (
              <button
                type="button"
                className="primary-button"
                onClick={() => setShowAddForm(true)}
              >
                + Add Range
              </button>
            )}
          </div>
        </div>

        <div className="table-scroll">
          <table className="transaction-table">
            <thead>
              <tr>
                {accountRangeFields.map((field) => (
                  <th key={field.key}>{field.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={accountRangeFields.length}>Loading account ranges...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={accountRangeFields.length}>{error}</td>
                </tr>
              ) : accountRanges.length === 0 ? (
                <tr>
                  <td colSpan={accountRangeFields.length}>No account ranges found.</td>
                </tr>
              ) : (
                accountRanges.map((range) => (
                  <tr
                    key={range.institutionAccountId}
                    className={
                      selectedRangeId === range.institutionAccountId
                        ? "selected-row"
                        : ""
                    }
                    onClick={() =>
                      setSelectedRangeId(range.institutionAccountId)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {accountRangeFields.map((field) => (
                      <td key={field.key}>{renderFieldValue(range, field.key)}</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRange && (
        <div className="table-card permissions-card">
          <div className="table-card-header">
            <div>
              <h3>
                Account Range Details ({selectedRange.institutionAccountId})
              </h3>
              <p>Detailed information for the selected account range.</p>
            </div>
          </div>
          <div className="permissions-grid">
            {accountRangeFields.map((field) => (
              <div key={field.key} className="permission-item granted">
                <span>
                  <strong>{field.label}:</strong>{" "}
                  {renderFieldValue(selectedRange, field.key)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
