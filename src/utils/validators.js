export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isRequired(value) {
  return value !== null && value !== undefined && String(value).trim() !== "";
}
