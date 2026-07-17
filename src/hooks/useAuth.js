import { useState, useEffect, useMemo } from "react";
import { login as authLogin } from "../services/authService";
import { STORAGE_KEYS } from "../utils/constants";
import { getInitialStorageItem, setStorageItem, removeStorageItem } from "../utils/helpers";
import { buildMenuItems, getInstitutions, getTransactionData } from "../utils/menuBuilder";

function loadSession() {
  try {
    const raw = getInitialStorageItem(STORAGE_KEYS.SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return getInitialStorageItem(STORAGE_KEYS.LOGGED_IN) === "true";
  });
  const [session, setSession] = useState(loadSession);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState(() => {
    return (
      getInitialStorageItem(STORAGE_KEYS.SELECTED_INSTITUTION) ||
      loadSession()?.institutionId ||
      "I0000"
    );
  });

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.LOGGED_IN, isLoggedIn ? "true" : "false");
  }, [isLoggedIn]);

  useEffect(() => {
    if (session) {
      setStorageItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    } else {
      removeStorageItem(STORAGE_KEYS.SESSION);
    }
  }, [session]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.SELECTED_INSTITUTION, selectedInstitutionId);
  }, [selectedInstitutionId]);

  const menuItems = useMemo(
    () => buildMenuItems(session, selectedInstitutionId),
    [session, selectedInstitutionId]
  );

  const institutions = useMemo(() => getInstitutions(session), [session]);
  const transactionData = useMemo(() => getTransactionData(session), [session]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const data = await authLogin(email, password);
      const token = data.token || data.accessToken || data.jwt;

      if (token) {
        setStorageItem(STORAGE_KEYS.AUTH_TOKEN, token);
      }

      setSession(data);
      setSelectedInstitutionId(data.institutionId);
      setStorageItem(STORAGE_KEYS.LOGGED_IN, "true");
      setIsLoggedIn(true);
      setEmail("");
      setPassword("");
    } catch (error) {
      alert(error.message || "Invalid Email or Password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSession(null);
    setStorageItem(STORAGE_KEYS.LOGGED_IN, "false");
    removeStorageItem(STORAGE_KEYS.AUTH_TOKEN);
    removeStorageItem(STORAGE_KEYS.SESSION);
    removeStorageItem(STORAGE_KEYS.SELECTED_INSTITUTION);
  };

  const handleInstitutionChange = (institutionId) => {
    setSelectedInstitutionId(institutionId);
  };

  return {
    isLoggedIn,
    session,
    menuItems,
    institutions,
    transactionData,
    selectedInstitutionId,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleLogin,
    handleLogout,
    handleInstitutionChange,
  };
}
