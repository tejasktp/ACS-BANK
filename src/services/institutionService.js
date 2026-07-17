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

export async function getInstitutions(session, institutionId) {
  const usrId = resolveUsrId(session);
  const activeInstitutionId = institutionId || session?.institutionId || "I0000";

  const params = new URLSearchParams({
    USR_ID: usrId,
    INSTITUTION_ID: activeInstitutionId,
  });

  const response = await fetch(`${API_BASE_URL}/getInstitution?${params}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch institutions (${response.status})`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function getInstitutionAcsUrls(session, institutionId) {
  const usrId = resolveUsrId(session);
  const activeInstitutionId = institutionId || session?.institutionId || "I0000";

  const params = new URLSearchParams({
    USR_ID: usrId,
    INSTITUTION_ID: activeInstitutionId,
  });

  const response = await fetch(`${API_BASE_URL}/getInstitutionAcsUrl?${params}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch institution ACS URLs (${response.status})`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function getInstitutionAccountRanges(session, institutionId) {
  const usrId = resolveUsrId(session);
  const activeInstitutionId = institutionId || session?.institutionId || "I0000";

  const params = new URLSearchParams({
    USR_ID: usrId,
    INSTITUTION_ID: activeInstitutionId,
  });

  const response = await fetch(`${API_BASE_URL}/getInstitutionAccountRange?${params}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch institution account ranges (${response.status})`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}
