import Sidebar from "../common/Sidebar";
import Header from "../common/Header";

export default function MainLayout({
  menuItems,
  institutions,
  session,
  selectedInstitutionId,
  onInstitutionChange,
  activeMenu,
  showSidebar,
  expandedMenu,
  onToggleSidebar,
  onMenuSelect,
  onSubmenuSelect,
  onCloseSidebar,
  onLogout,
  children,
}) {
  return (
    <div className="app-shell">
      <Sidebar
        menuItems={menuItems}
        activeMenu={activeMenu}
        showSidebar={showSidebar}
        expandedMenu={expandedMenu}
        onMenuSelect={onMenuSelect}
        onSubmenuSelect={onSubmenuSelect}
      />

      <div className={showSidebar ? "backdrop visible" : "backdrop"} onClick={onCloseSidebar} />

      <main className="main-panel">
        <Header
          activeMenu={activeMenu}
          institutions={institutions}
          session={session}
          selectedInstitutionId={selectedInstitutionId}
          onInstitutionChange={onInstitutionChange}
          onToggleSidebar={onToggleSidebar}
          onLogout={onLogout}
        />

        <section className="page-content">{children}</section>
      </main>
    </div>
  );
}
