import { DEFAULT_INSTITUTIONS, MENU_ICONS } from "./constants";

const SCREEN_NAME_MAP = {
  "Maker Checker": "Maker-Checker",
  "Institution Instrument": "Institution Account Range",
};

export function normalizeScreenName(name) {
  return SCREEN_NAME_MAP[name] || name;
}

function getPermissionMap(permissions, roleId, institutionId) {
  const map = new Map();

  (permissions || []).forEach((permission) => {
    if (permission.ROLE_ID !== roleId || permission.INSTITUTION_ID !== institutionId) {
      return;
    }

    if (permission.QUERY_FLAG !== "Y") {
      return;
    }

    map.set(permission.SCREEN_ID, permission);
  });

  return map;
}

function toPermissionFlags(permission) {
  if (!permission) {
    return null;
  }

  return {
    add: permission.ADD_FLAG === "Y",
    modify: permission.MODIF_FLAG === "Y",
    delete: permission.DELETE_FLAG === "Y",
    query: permission.QUERY_FLAG === "Y",
    checker: permission.CHECKER_FLAG === "Y",
    authorizer: permission.AUTHORIZER_FLAG === "Y",
  };
}

function toMenuItem(screen, permission) {
  return {
    label: normalizeScreenName(screen.SCREEN_NAME),
    screenId: screen.SCREEN_ID,
    screenDesc: screen.SCREEN_DESC,
    permissions: toPermissionFlags(permission),
  };
}

export function findMenuItem(menuItems, label) {
  for (const item of menuItems || []) {
    if (item.label === label) {
      return item;
    }

    const child = item.children?.find((subItem) => subItem.label === label);
    if (child) {
      return child;
    }
  }

  return null;
}

export function getScreenPermission(session, institutionId, screenId) {
  if (!session || !screenId) {
    return null;
  }

  const permissionMap = getPermissionMap(
    session.appScreenPermission || [],
    session.roleId,
    institutionId || session.institutionId
  );

  return toPermissionFlags(permissionMap.get(screenId));
}

export function buildMenuItems(session, institutionId) {
  if (!session) {
    return [{ label: "Dashboard", icon: MENU_ICONS.Dashboard }];
  }

  const appScreens = session.appScreen || [];
  const permissions = session.appScreenPermission || [];
  const roleId = session.roleId;
  const activeInstitutionId = institutionId || session.institutionId;
  const permissionMap = getPermissionMap(permissions, roleId, activeInstitutionId);

  const parents = appScreens
    .filter((screen) => screen.SCREEN_ID === screen.PARENT_ID)
    .sort((a, b) => Number(a.DISPLAY_ORDER) - Number(b.DISPLAY_ORDER));

  const dynamicItems = parents
    .map((parent) => {
      const children = appScreens
        .filter(
          (screen) =>
            screen.PARENT_ID === parent.SCREEN_ID && screen.SCREEN_ID !== parent.SCREEN_ID
        )
        .filter((screen) => permissionMap.has(screen.SCREEN_ID))
        .sort((a, b) => Number(a.DISPLAY_ORDER) - Number(b.DISPLAY_ORDER))
        .map((screen) => toMenuItem(screen, permissionMap.get(screen.SCREEN_ID)));

      const parentAllowed = permissionMap.has(parent.SCREEN_ID);

      if (!parentAllowed && children.length === 0) {
        return null;
      }

      const label = normalizeScreenName(parent.SCREEN_NAME);

      return {
        ...toMenuItem(parent, permissionMap.get(parent.SCREEN_ID)),
        label,
        icon: MENU_ICONS[label] || MENU_ICONS[parent.SCREEN_NAME],
        children: children.length > 0 ? children : undefined,
      };
    })
    .filter(Boolean);

  return [{ label: "Dashboard", icon: MENU_ICONS.Dashboard }, ...dynamicItems];
}

export function getInstitutions(session) {
  const institutions = session?.Insttutions || session?.Institutions || [];
  return institutions.length > 0 ? institutions : DEFAULT_INSTITUTIONS;
}

export function getTransactionData(session) {
  return session?.transactionData?.[0] || null;
}
