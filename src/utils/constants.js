import dashboardIcon from "../assets/icons/dashboard.svg";
import userMgmtIcon from "../assets/icons/user-mgmt.svg";
import institutionIcon from "../assets/icons/institution.svg";
import settingsIcon from "../assets/icons/settings.svg";
import lockIcon from "../assets/icons/lock.svg";
import rangesIcon from "../assets/icons/ranges.svg";

export const MENU_ICONS = {
  Dashboard: dashboardIcon,
  "User Management": userMgmtIcon,
  "Maker-Checker": userMgmtIcon,
  "Maker Checker": userMgmtIcon,
  "Institution Management": institutionIcon,
  "System Management": settingsIcon,
  "Card Management": lockIcon,
  Reports: rangesIcon,
  Batch: settingsIcon,
};

export const API_BASE_URL = "http://localhost:8080/api";

export const DEFAULT_INSTITUTIONS = [
  { INSTITUTION_ID: "I0000", INSTITUTION_NAME: "VB" },
  { INSTITUTION_ID: "I0001", INSTITUTION_NAME: "HDFC" },
  { INSTITUTION_ID: "I0002", INSTITUTION_NAME: "AXIS" },
];

export const STORAGE_KEYS = {
  LOGGED_IN: "bankacs_logged_in",
  AUTH_TOKEN: "bankacs_auth_token",
  SESSION: "bankacs_session",
  SELECTED_INSTITUTION: "bankacs_selected_institution",
};
