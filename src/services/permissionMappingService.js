import { DEFAULT_INSTITUTIONS } from "../utils/constants";
import { getRolesForPermissionMapping } from "./roleService";

const PERMISSION_FLAGS = [
  { key: "add", flag: "ADD_FLAG", label: "Add" },
  { key: "modify", flag: "MODIF_FLAG", label: "Modify" },
  { key: "delete", flag: "DELETE_FLAG", label: "Delete" },
  { key: "query", flag: "QUERY_FLAG", label: "Query" },
  { key: "checker", flag: "CHECKER_FLAG", label: "Checker" },
  { key: "authorizer", flag: "AUTHORIZER_FLAG", label: "Authorizer" },
];

function getInstitutionName(institutions, institutionId) {
  const institution = institutions.find(
    (item) =>
      item.INSTITUTION_ID === institutionId || item.institutionId === institutionId
  );

  return institution?.INSTITUTION_NAME || institution?.name || institutionId;
}

export function getRoleKey(roleId, institutionId) {
  return `${roleId}-${institutionId}`;
}

export function buildPermissionRows(screens = []) {
  const childScreens = screens
    .filter((screen) => screen.SCREEN_ID !== screen.PARENT_ID)
    .sort((a, b) => Number(a.DISPLAY_ORDER) - Number(b.DISPLAY_ORDER));

  return childScreens.flatMap((screen) =>
    PERMISSION_FLAGS.map(({ key, label }) => ({
      id: `${screen.SCREEN_ID}-${key}`,
      screenId: screen.SCREEN_ID,
      permissionKey: key,
      label: `${screen.SCREEN_NAME} - ${label}`,
    }))
  );
}

export function buildPermissionMapping(permissions = [], roles = [], screens = []) {
  const rows = buildPermissionRows(screens);
  const mapping = {};

  roles.forEach((role) => {
    const roleKey = getRoleKey(role.id, role.institutionId);
    mapping[roleKey] = Object.fromEntries(rows.map((row) => [row.id, false]));
  });

  permissions.forEach((permission) => {
    const roleId = permission.ROLE_ID || permission.roleId;
    const institutionId = permission.INSTITUTION_ID || permission.institutionId;
    const roleKey = getRoleKey(roleId, institutionId);

    if (!mapping[roleKey]) {
      return;
    }

    PERMISSION_FLAGS.forEach(({ key, flag }) => {
      const rowId = `${permission.SCREEN_ID}-${key}`;
      if (Object.prototype.hasOwnProperty.call(mapping[roleKey], rowId)) {
        mapping[roleKey][rowId] = permission[flag] === "Y";
      }
    });
  });

  return { rows, mapping };
}

export function formatRoleColumnLabel(role, institutions) {
  const institutionName = getInstitutionName(institutions, role.institutionId);
  return `${role.name} (${institutionName})`;
}

export async function loadPermissionMappingData(session) {
  const institutions = session?.Insttutions || session?.Institutions || DEFAULT_INSTITUTIONS;
  const permissions =
    session?.allAppScreenPermission || session?.appScreenPermission || [];
  const screens = session?.appScreen || [];
  const roles = await getRolesForPermissionMapping(session);

  const { rows, mapping } = buildPermissionMapping(permissions, roles, screens);

  return {
    roles,
    rows,
    mapping,
    institutions,
  };
}
