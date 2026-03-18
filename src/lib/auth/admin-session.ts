import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export interface AdminSession {
  isAdmin: true;
  username: string;
  loginAt: number;
}

const MIN_PASSWORD_LENGTH = 32;
const FALLBACK_SECRET = "dev-fallback-min-32-characters-long!!!";

const rawSecret = process.env.SESSION_SECRET?.trim() ?? "";
const SESSION_SECRET =
  rawSecret.length >= MIN_PASSWORD_LENGTH ? rawSecret : FALLBACK_SECRET;

const SESSION_OPTIONS = {
  password: SESSION_SECRET,
  cookieName: "madilik_admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 24 hours
    sameSite: "lax" as const,
  },
};

export async function getAdminSession() {
  const cookieStore = await cookies();
  return getIronSession<Partial<AdminSession>>(cookieStore, SESSION_OPTIONS);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getAdminSession();
  if (!session.isAdmin || !session.username) return false;
  const maxAge = 60 * 60 * 24 * 7; // 7 days
  const loginAt = session.loginAt ?? 0;
  if (Date.now() - loginAt > maxAge * 1000) {
    session.isAdmin = undefined;
    session.username = undefined;
    session.loginAt = undefined;
    await session.save();
    return false;
  }
  return true;
}
