export function getInitialStorageItem(key, fallback = "") {
  return typeof window !== "undefined" ? localStorage.getItem(key) || fallback : fallback;
}

export function setStorageItem(key, value) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
}

export function removeStorageItem(key) {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
}
