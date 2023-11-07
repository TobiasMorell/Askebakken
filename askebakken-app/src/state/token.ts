const LOCAL_STORAGE_TOKEN_KEY = "authToken";

export function getAuthToken() {
  return localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
}

export function setAuthToken(token: string) {
  localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
}
