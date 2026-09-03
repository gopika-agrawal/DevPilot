export class ApiError extends Error {
  constructor(status, message) {
    super(message);

    this.name = "ApiError";
    this.status = status;
  }
}


/*
 * Base URL of the Spring Boot backend.
 *
 * Vite environment variables must start with VITE_.
 *
 * If VITE_API_BASE_URL is not defined,
 * we use the local Spring Boot server.
 */
export function getApiBaseUrl() {
  return (
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8080"
  );
}


/*
 * GitHub OAuth login URL
 */
export function getGithubLoginUrl() {
  return `${getApiBaseUrl()}/oauth2/authorization/github`;
}


/*
 * Convert an error response from the backend
 * into a readable message.
 */
async function parseError(res) {
  try {
    const data = await res.json();

    return (
      data.message ||
      data.error ||
      res.statusText ||
      "Request failed"
    );
  } catch {
    return res.statusText || "Request failed";
  }
}


/*
 * Common fetch function used by all API calls.
 */
export async function apiFetch(path, init = {}) {
  const res = await fetch(
    `${getApiBaseUrl()}${path}`,
    {
      ...init,

      // Important for GitHub/session cookies
      credentials: "include",

      headers: {
        "Content-Type": "application/json",
        ...(init.headers || {}),
      },
    }
  );

  if (!res.ok) {
    throw new ApiError(
      res.status,
      await parseError(res)
    );
  }

  // 204 = No Content
  if (res.status === 204) {
    return undefined;
  }

  return res.json();
}


/*
 * API methods used by DevPilot.
 */
export const api = {

  // -------------------------
  // Authentication
  // -------------------------

  me: () =>
    apiFetch("/api/auth/me"),

  logout: () =>
    apiFetch("/api/auth/logout", {
      method: "POST",
    }),


  // -------------------------
  // Repositories
  // -------------------------

  listRepos: (refresh = true) =>
    apiFetch(`/api/repos?refresh=${refresh}`),

  getRepo: (id) =>
    apiFetch(`/api/repos/${id}`),

  startIndex: (id) =>
    apiFetch(`/api/repos/${id}/index`, {
      method: "POST",
    }),

  indexStatus: (id) =>
    apiFetch(`/api/repos/${id}/status`),


  // -------------------------
  // Chat
  // -------------------------

  createSession: (repositoryId, title) =>
    apiFetch("/api/chat/sessions", {
      method: "POST",

      body: JSON.stringify({
        repositoryId,
        title,
      }),
    }),

  listSessions: (repositoryId) =>
    apiFetch(
      `/api/chat/sessions?repositoryId=${encodeURIComponent(
        repositoryId
      )}`
    ),

  getMessages: (sessionId) =>
    apiFetch(
      `/api/chat/sessions/${sessionId}`
    ),
};