import { prisma } from "@/lib/db";
import type { UserRole } from "@prisma/client";

/** Returns the User delegate when available; null when prisma.user is missing (e.g. client out of sync). */
function getUserDelegate() {
  const d = prisma.user;
  return d && typeof d.findUnique === "function" ? d : null;
}

export async function findUserByEmail(email: string) {
  const user = getUserDelegate();
  if (!user) return null;
  try {
    return user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
  } catch {
    return null;
  }
}

export async function createUser(data: {
  fullName: string;
  email: string;
  passwordHash: string;
  role?: UserRole;
}) {
  const user = getUserDelegate();
  if (!user) throw new Error("User data layer unavailable");
  return user.create({
    data: {
      ...data,
      email: data.email.trim().toLowerCase(),
      role: data.role ?? "CUSTOMER",
    },
  });
}

export async function findUserById(id: string) {
  const user = getUserDelegate();
  if (!user) return null;
  try {
    return user.findUnique({
      where: { id },
    });
  } catch {
    return null;
  }
}
