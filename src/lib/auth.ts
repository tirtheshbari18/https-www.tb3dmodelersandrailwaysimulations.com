import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "vg-railway-sim-secret-key-fallback-2025";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}

export async function getUserFromRequest(req: NextRequest) {
  // Check cookie first
  let token = req.cookies.get("vg_auth_token")?.value;

  // Check Authorization header fallback
  if (!token) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded || !decoded.userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        country: true,
        state: true,
        createdAt: true,
      },
    });

    if (!user || user.status === "SUSPENDED") {
      return null;
    }

    return user;
  } catch (e) {
    return null;
  }
}
