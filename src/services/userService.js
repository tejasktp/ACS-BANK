import { API_BASE_URL } from "../utils/constants";
import { resolveUsrIdFromEmail } from "../utils/institutionResolver";

function resolveUsrId(session) {
  if (session?.usrId) {
    return session.usrId;
  }

  if (session?.USR_ID) {
    return session.USR_ID;
  }

  return resolveUsrIdFromEmail(session?.userName);
}

export function mapUserFromApi(user) {
  return {
    id: user.USR_ID,
    name: user.USR_NAME,
    email: user.USR_EMAIL_ID,
    role: user.ROLE_TYPE,
    status:
      user.USR_STATUS === "1"
        ? "Active"
        : user.USR_STATUS === "0"
          ? "Locked"
          : "Pending",
  };
}

export async function getUsers(session, institutionId) {
  const usrId = resolveUsrId(session);
  const activeInstitutionId = institutionId || session?.institutionId || "I0000";

  const params = new URLSearchParams({
    USR_ID: usrId,
    INSTITUTION_ID: activeInstitutionId,
  });

  const response = await fetch(`${API_BASE_URL}/getAppUser?${params}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch users (${response.status})`);
  }

  const data = await response.json();
  const users = Array.isArray(data) ? data : [];

  return users.map(mapUserFromApi);
}
