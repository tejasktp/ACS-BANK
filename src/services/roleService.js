import { API_BASE_URL, DEFAULT_INSTITUTIONS } from "../utils/constants";

const DEFAULT_ROLE_IDS = ["SuperAdmin", "ProcessorAdmin", "Admin"];

function getInstitutions(session) {
  const institutions = session?.Insttutions || session?.Institutions || [];
  return institutions.length > 0 ? institutions : DEFAULT_INSTITUTIONS;
}

export function getRoleInstitutionPairs(session) {
  const institutions = getInstitutions(session);
  const sessionRoleId = session?.roleId;

  if (sessionRoleId === "ProcessorAdmin" || sessionRoleId === "SuperAdmin") {
    return institutions.flatMap((institution) => {
      const institutionId = institution.INSTITUTION_ID || institution.institutionId;
      const queries = [{ roleId: "Admin", institutionId }];

      if (institutionId === "I0000") {
        queries.unshift({ roleId: "ProcessorAdmin", institutionId });
      }

      return queries;
    });
  }

  const permissions =
    session?.allAppScreenPermission || session?.appScreenPermission || [];
  const pairs = new Map();

  permissions.forEach((permission) => {
    const roleId = permission.ROLE_ID || permission.roleId;
    const institutionId = permission.INSTITUTION_ID || permission.institutionId;

    if (roleId && institutionId) {
      pairs.set(`${roleId}-${institutionId}`, { roleId, institutionId });
    }
  });

  if (pairs.size > 0) {
    return [...pairs.values()];
  }

  return [
    {
      roleId: sessionRoleId || "Admin",
      institutionId: session?.institutionId || "I0000",
    },
  ];
}

export function mapRoleFromApi(role) {
  return {
    id: role.ROLE_ID,
    name: role.ROLE_NAME || role.ROLE_ID,
    description: `Max login: ${role.ROLE_MAX_LOGIN_CNT ?? "-"}, Grace days: ${role.ROLE_GRACE_DAYS ?? "-"}`,
    status: role.ROLE_STATUS === "1" ? "Active" : "Inactive",
    institutionId: role.INSTITUTION_ID,
    expiryDate: role.ROLE_EXP_DT,
    maxLoginCount: role.ROLE_MAX_LOGIN_CNT,
    graceDays: role.ROLE_GRACE_DAYS,
  };
}

function getRoleIdsForInstitution(session, institutionId) {
  const permissions = session?.appScreenPermission || [];
  const roleIds = [
    ...new Set(
      permissions
        .filter(
          (permission) =>
            (permission.INSTITUTION_ID || permission.institutionId) === institutionId
        )
        .map((permission) => permission.ROLE_ID || permission.roleId)
        .filter(Boolean)
    ),
  ];

  if (roleIds.length > 0) {
    return roleIds;
  }

  if (session?.roleId) {
    return [session.roleId];
  }

  return DEFAULT_ROLE_IDS;
}

async function fetchRole(institutionId, roleId) {
  const params = new URLSearchParams({
    ROLE_ID: roleId,
    INSTITUTION_ID: institutionId,
  });

  const response = await fetch(`${API_BASE_URL}/getAppRoles?${params}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch roles (${response.status})`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function getRolesForPermissionMapping(session) {
  const pairs = getRoleInstitutionPairs(session);
  const results = await Promise.all(
    pairs.map(({ roleId, institutionId }) => fetchRole(institutionId, roleId))
  );

  const rolesByKey = new Map();

  results.flat().forEach((role) => {
    const key = `${role.ROLE_ID}-${role.INSTITUTION_ID}`;
    rolesByKey.set(key, role);
  });

  return [...rolesByKey.values()].map(mapRoleFromApi);
}

export async function getRoles(session, institutionId) {
  const activeInstitutionId =
    institutionId || session?.institutionId || "I0000";
  const roleIds = getRoleIdsForInstitution(session, activeInstitutionId);
  const results = await Promise.all(
    roleIds.map((roleId) => fetchRole(activeInstitutionId, roleId))
  );

  const rolesById = new Map();

  results.flat().forEach((role) => {
    const key = `${role.ROLE_ID}-${role.INSTITUTION_ID}`;
    rolesById.set(key, role);
  });

  return [...rolesById.values()].map(mapRoleFromApi);
}
