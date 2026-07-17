import virtuebyteLogo from "../assets/icons/virtuebyte-logo.svg";
import hdfcLogo from "../assets/icons/hdfc-logo.svg";
import axisLogo from "../assets/icons/axis-logo.svg";

const INSTITUTION_LOGOS = {
  VB: virtuebyteLogo,
  HDFC: hdfcLogo,
  AXIS: axisLogo,
};

export function getInstitutionLogo(institutionName) {
  if (!institutionName) return null;
  return INSTITUTION_LOGOS[institutionName.toUpperCase()] || null;
}
