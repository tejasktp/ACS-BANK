import { API_BASE_URL, DEFAULT_INSTITUTIONS } from "../utils/constants";
import {
  adaptPermissionsForUser,
  filterInstitutionsForUser,
  getInstitutionFromEmail,
  resolveUsrIdFromEmail,
} from "../utils/institutionResolver";

function resolveRoleId(email, data) {
  if (data.roleId || data.ROLE_ID) {
    return data.roleId || data.ROLE_ID;
  }

  const normalizedEmail = email.toLowerCase();
  const institutionFromEmail = getInstitutionFromEmail(email);

  if (institutionFromEmail) {
    return institutionFromEmail.roleId;
  }

  if (normalizedEmail.includes("superadmin")) {
    return "SuperAdmin";
  }

  if (normalizedEmail.includes("processor")) {
    return "ProcessorAdmin";
  }

  return "Admin";
}

function resolveInstitutionId(email, data) {
  const institutionFromEmail = getInstitutionFromEmail(email);

  if (institutionFromEmail) {
    return institutionFromEmail.id;
  }

  const institutions = resolveInstitutions(data);

  return (
    data.institutionId ||
    data.INSTITUTION_ID ||
    institutions[0]?.INSTITUTION_ID ||
    "I0000"
  );
}

function resolveUsrId(email, data) {
  return data.usrId || data.USR_ID || resolveUsrIdFromEmail(email);
}

function resolveInstitutions(data) {
  const institutions = data.Insttutions || data.Institutions || [];
  return institutions.length > 0 ? institutions : DEFAULT_INSTITUTIONS;
}

function buildSession(email, data) {
  const institutions = resolveInstitutions(data);
  const roleId = resolveRoleId(email, data);
  const institutionId = resolveInstitutionId(email, data);
  const allAppScreenPermission = data.appScreenPermission || [];

  return {
    ...data,
    userName: data.userName || data.user_name || email,
    usrId: resolveUsrId(email, data),
    roleId,
    institutionId,
    appScreen: data.appScreen || [],
    allAppScreenPermission,
    appScreenPermission: adaptPermissionsForUser(
      email,
      allAppScreenPermission,
      institutionId,
      roleId
    ),
    Insttutions: filterInstitutionsForUser(email, institutions),
    transactionData: data.transactionData || [],
  };
}

export async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error("Invalid Email or Password");
  }

  return buildSession(email, data);
}
