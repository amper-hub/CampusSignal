function getToken() {
  return localStorage.getItem("token");
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
}

function logout() {
  clearSession();
  window.location.href = "/ui/login.html";
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = "/ui/login.html";
    return false;
  }
  return true;
}

function requireAdmin() {
  const user = getUser();
  const role = localStorage.getItem("role") || user?.role;
  if (role !== "admin") {
    window.location.href = "/ui/home.html";
    return false;
  }
  return true;
}

function statusLabel(rawStatus) {
  const value = (rawStatus || "").toLowerCase();
  if (value === "open") {
    return "pending";
  }
  return value || "pending";
}
