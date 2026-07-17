import React, { useMemo, useState } from "react";
import "./styles/global.css";
import LoginForm from "./components/form/LoginForm";
import { useAuth } from "./hooks/useAuth";
import MainLayout from "./components/layout/MainLayout";
import ScreenPermissionPanel from "./components/common/ScreenPermissionPanel";
import { findMenuItem } from "./utils/menuBuilder";
import { renderPage } from "./router";

function App() {
  const {
    isLoggedIn,
    session,
    menuItems,
    institutions,
    transactionData,
    selectedInstitutionId,
    email,
    password,
    setEmail,
    setPassword,
    isLoading,
    handleLogin,
    handleLogout,
    handleInstitutionChange,
  } = useAuth();

  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const activeMenuItem = useMemo(
    () => findMenuItem(menuItems, activeMenu),
    [menuItems, activeMenu]
  );
  const screenPermissions = activeMenuItem?.permissions ?? null;

  const handleMenuSelect = (item) => {
    setActiveMenu(item.label);

    if (item.children?.length) {
      setExpandedMenu((prev) => (prev === item.label ? null : item.label));
    } else {
      setExpandedMenu(null);
    }

    setShowSidebar(false);
  };

  const handleSubmenuSelect = (item) => {
    setActiveMenu(item.label);
    setShowSidebar(false);
  };

  const handleToggleSidebar = () => {
    setShowSidebar((current) => !current);
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onSubmit={handleLogin}
          isLoading={isLoading}
        />
      </div>
    );
  }

  return (
    <MainLayout
      menuItems={menuItems}
      institutions={institutions}
      session={session}
      selectedInstitutionId={selectedInstitutionId}
      onInstitutionChange={handleInstitutionChange}
      activeMenu={activeMenu}
      showSidebar={showSidebar}
      expandedMenu={expandedMenu}
      onToggleSidebar={handleToggleSidebar}
      onCloseSidebar={handleCloseSidebar}
      onMenuSelect={handleMenuSelect}
      onSubmenuSelect={handleSubmenuSelect}
      onLogout={handleLogout}
    >
      <>
        {renderPage(
          activeMenu,
          transactionData,
          setActiveMenu,
          screenPermissions,
          session,
          selectedInstitutionId
        )}
        <ScreenPermissionPanel
          screenLabel={activeMenu}
          screenId={activeMenuItem?.screenId}
          permissions={screenPermissions}
        />
      </>
    </MainLayout>
  );
}

export default App;
