import { useEffect, useRef, useState } from "react";
import { getInstitutionLogo } from "../../utils/institutionLogos";

function InstitutionLogo({ name, className = "header-bank-logo" }) {
  const logo = getInstitutionLogo(name);

  if (!logo) return null;

  return <img src={logo} alt="" className={className} aria-hidden="true" />;
}

export default function Header({
  activeMenu,
  institutions,
  session,
  selectedInstitutionId,
  onInstitutionChange,
  onToggleSidebar,
  onLogout,
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [bankOpen, setBankOpen] = useState(false);
  const menuRef = useRef(null);

  const selectedInstitution =
    institutions.find((institution) => institution.INSTITUTION_ID === selectedInstitutionId) ||
    institutions[0];

  const isMultiBankUser =
    session?.roleId === "SuperAdmin" || session?.roleId === "ProcessorAdmin";
  const visibleInstitutions = isMultiBankUser
    ? institutions
    : selectedInstitution
      ? [selectedInstitution]
      : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setProfileOpen(false);
        setBankOpen(false);
      }
    };

    if (profileOpen || bankOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen, bankOpen]);

  const handleLogout = () => {
    setProfileOpen(false);
    onLogout();
  };

  const handleBankSelect = (institution, event) => {
    event?.stopPropagation();
    event?.preventDefault();
    onInstitutionChange(institution.INSTITUTION_ID);
    setBankOpen(false);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-button" onClick={onToggleSidebar} aria-label="Toggle menu">
          ☰
        </button>
        <div>
          <h1>{activeMenu}</h1>
        </div>
      </div>

      <div className="header-profile-menu" ref={menuRef}>
        <div className="header-profile">
          {institutions.length > 0 && (
            <div className="header-bank-selector">
              <button
                type="button"
                className="header-bank-brand"
                onClick={() => {
                  setBankOpen((open) => !open);
                  setProfileOpen(false);
                }}
                aria-expanded={bankOpen}
                aria-haspopup="listbox"
              >
                <InstitutionLogo name={selectedInstitution?.INSTITUTION_NAME} />
                <span className="header-bank-name">{selectedInstitution?.INSTITUTION_NAME}</span>
                <span className={`header-bank-caret${bankOpen ? " open" : ""}`} aria-hidden="true">
                  ▾
                </span>
              </button>

              {bankOpen && (
                <div
                  className="bank-dropdown"
                  role="listbox"
                  aria-label="Select institution"
                  onMouseDown={(event) => event.stopPropagation()}
                >
                  {visibleInstitutions.map((institution) => (
                    <button
                      key={institution.INSTITUTION_ID}
                      type="button"
                      className={`bank-dropdown-item${
                        selectedInstitutionId === institution.INSTITUTION_ID ? " active" : ""
                      }`}
                      role="option"
                      aria-selected={selectedInstitutionId === institution.INSTITUTION_ID}
                      onClick={(event) => handleBankSelect(institution, event)}
                    >
                      <InstitutionLogo name={institution.INSTITUTION_NAME} />
                      <span>{institution.INSTITUTION_NAME}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            className="header-profile-trigger"
            onClick={() => {
              setProfileOpen((open) => !open);
              setBankOpen(false);
            }}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
          >
            <div className="header-profile-info">
              <div className="profile-name">{session?.userName || "Admin User"}</div>
              <div className="profile-role">{session?.roleId || "User"}</div>
            </div>
          </button>
        </div>

        {profileOpen && (
          <div className="profile-dropdown" role="menu">
            <button className="profile-dropdown-item" onClick={handleLogout} type="button" role="menuitem">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
