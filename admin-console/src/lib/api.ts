const API_URL = "/api";

const TOKEN_KEY = "aspire.admin.token";
const USER_KEY = "aspire.admin.user";

export type AdminUser = {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
  permissions: string[];
};

export type ApiError = { message: string; status: number };

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AdminUser | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as AdminUser) : null;
}

export function storeSession(token: string, user: AdminUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function can(permission: string): boolean {
  return getUser()?.permissions.includes(permission) ?? false;
}

/** Fetch wrapper that unwraps the { status, data, message } envelope. */
export async function api<T = unknown>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/v1${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 401) {
    clearSession();
    if (!window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }
  }

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      json?.error ??
      json?.message ??
      (json?.errors ? JSON.stringify(json.errors) : `Request failed (${res.status})`);
    throw { message, status: res.status } as ApiError;
  }
  return (json.data ?? json) as T;
}

export const inr = (value: string | number | null | undefined) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));

export const fmtDate = (value: string | Date | null | undefined) =>
  value ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value)) : "—";

export const fmtDateTime = (value: string | Date | null | undefined) =>
  value
    ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(
        new Date(value),
      )
    : "—";
