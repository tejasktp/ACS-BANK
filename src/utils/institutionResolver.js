const INSTITUTION_RESOLVERS = [
  { keyword: "hdfc", id: "I0001", name: "HDFC", roleId: "Admin", usrId: "HDFCAdmin" },
  { keyword: "axis", id: "I0002", name: "AXIS", roleId: "Admin", usrId: "AXISAdmin" },
];

const DEFAULT_INSTITUTION = {
  id: "I0000",
  name: "VB",
  roleId: "ProcessorAdmin",
  usrId: "ProcessorAdmin",
};

function normalize(email = "") {
  return email.toLowerCase().trim();
}

function resolveRole(email = "") {
  const normalizedEmail = normalize(email);

  if (normalizedEmail.includes("superadmin")) {
    return "SuperAdmin";
  }

  if (normalizedEmail.includes("processor")) {
    return "ProcessorAdmin";
  }

  return "Admin";
}

export function resolveUsrIdFromEmail(email = "") {
  const normalizedEmail = normalize(email);

  if (normalizedEmail.includes("superadmin")) {
    return "SuperAdmin";
  }

  if (normalizedEmail.includes("processor")) {
    return "ProcessorAdmin";
  }

  const mappedInstitution = INSTITUTION_RESOLVERS.find(({ keyword }) =>
    normalizedEmail.includes(keyword)
  );

  if (mappedInstitution?.usrId) {
    return mappedInstitution.usrId;
  }

  return DEFAULT_INSTITUTION.usrId;
}

export function getInstitutionFromEmail(email = "") {
  const normalizedEmail = normalize(email);
  const mappedInstitution = INSTITUTION_RESOLVERS.find(({ keyword }) =>
    normalizedEmail.includes(keyword)
  );

  if (mappedInstitution) {
    return {
      ...mappedInstitution,
      roleId: resolveRole(normalizedEmail),
      usrId: resolveUsrIdFromEmail(normalizedEmail),
    };
  }

  return {
    ...DEFAULT_INSTITUTION,
    roleId: resolveRole(normalizedEmail),
    usrId: resolveUsrIdFromEmail(normalizedEmail),
  };
}

export function filterInstitutionsForUser(email = "", institutions = []) {
  if (!Array.isArray(institutions) || institutions.length === 0) {
    return [];
  }

  const resolvedRole = resolveRole(email);

  if (resolvedRole === "SuperAdmin" || resolvedRole === "ProcessorAdmin") {
    return institutions;
  }

  const institutionFromEmail = getInstitutionFromEmail(email);
  const institutionId = institutionFromEmail?.id;

  if (!institutionId) {
    return institutions;
  }

  return institutions.filter(
    (institution) =>
      institution?.INSTITUTION_ID === institutionId ||
      institution?.institutionId === institutionId
  );
}

export function adaptPermissionsForUser(
  email = "",
  permissions = [],
  institutionId = "I0000",
  roleId = ""
) {
  if (!Array.isArray(permissions) || permissions.length === 0) {
    return [];
  }

  const resolvedInstitutionId = institutionId || getInstitutionFromEmail(email).id;
  const resolvedRoleId = roleId || resolveRole(email);

  const scopedPermissions = permissions.filter((permission) => {
    const permissionInstitutionId =
      permission?.INSTITUTION_ID || permission?.institutionId;
    const permissionRoleId = permission?.ROLE_ID || permission?.roleId;

    const institutionMatches =
      !permissionInstitutionId || permissionInstitutionId === resolvedInstitutionId;
    const roleMatches = !permissionRoleId || permissionRoleId === resolvedRoleId;

    return institutionMatches && roleMatches;
  });

  return scopedPermissions.length > 0 ? scopedPermissions : permissions;
}
