import virtuebyteLogo from "../../assets/icons/virtuebyte-logo.png";

export default function Sidebar({
  menuItems,
  activeMenu,
  showSidebar,
  expandedMenu,
  onMenuSelect,
  onSubmenuSelect,
}) {
  const renderSubmenuItems = (items) =>
    items.map((subItem, index) => (
      <button
        key={subItem.screenId || subItem.label}
        className={subItem.label === activeMenu ? "nav-item active submenu-item" : "nav-item submenu-item"}
        onClick={() => onSubmenuSelect(subItem)}
      >
        <span className="submenu-serial">{index + 1}.</span>
        <span>{subItem.label}</span>
      </button>
    ));

  return (
    <aside className={showSidebar ? "sidebar mobile-open" : "sidebar"}>
      <div className="brand">
        <img src={virtuebyteLogo} alt="virtuebyte logo" className="brand-logo" />
        <p>Account Control System</p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.label}>
            <button
              className={item.label === activeMenu ? "nav-item active" : "nav-item"}
              onClick={() => onMenuSelect(item)}
            >
              {item.children?.length > 0 && (
                <span className={expandedMenu === item.label ? "submenu-arrow open" : "submenu-arrow"}>
                  &gt;
                </span>
              )}
              {item.icon && <img src={item.icon} alt={item.label} className="nav-icon" />}
              <span>{item.label}</span>
            </button>

            {item.children?.length > 0 && expandedMenu === item.label && (
              <div className="submenu-list open">{renderSubmenuItems(item.children)}</div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
