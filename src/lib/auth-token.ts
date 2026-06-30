const ACCESS_TOKEN_KEY = "propertyflow_access_token";
const REFRESH_TOKEN_KEY = "propertyflow_refresh_token";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function saveAccessToken(token: string) {
  if (canUseStorage()) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
}

export function saveRefreshToken(token: string) {
  if (canUseStorage()) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
}

export function saveTokens(access: string, refresh: string) {
  saveAccessToken(access);
  saveRefreshToken(refresh);
}

export function getAccessToken() {
  if (!canUseStorage()) {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  if (!canUseStorage()) {
    return null;
  }

  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearTokens() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}
