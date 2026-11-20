import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, createToken, hashPassword } from "@/lib/auth";
import { checkLoginRateLimit, recordFailedLogin, resetLoginAttempts } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const { email, password, humanVerificationToken } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
    const rateLimitKey = `${normalizedEmail}:${ip}`;

    // Rate Limiting & Account Lockout Protection (bypass for standard demo accounts with correct password)
    const isStandardPassenger =
      normalizedEmail === "passenger@vg3dmodelers.com" && password === "Passenger@2025";
    const isStandardDemo =
      normalizedEmail === "demo@trainsim.com" && password === "Passenger@2025";
    const isStandardAdmin =
      normalizedEmail === "admin@vg3dmodelers.com" && password === "Admin@VG3D#2025";

    if (isStandardPassenger || isStandardDemo || isStandardAdmin) {
      resetLoginAttempts(rateLimitKey);
    } else {
      const rateCheck = checkLoginRateLimit(rateLimitKey);
      if (!rateCheck.allowed) {
        return NextResponse.json(
          {
            error: `Account temporarily locked due to repeated failed login attempts. Please wait ${rateCheck.waitMinutes} minute(s) before trying again.`,
          },
          { status: 429 }
        );
      }
    }

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          { username: normalizedEmail }
        ]
      },
    });

    // Auto-provision standard accounts if not yet in database
    if (!user) {
      if (isStandardPassenger) {
        const passwordHash = await hashPassword("Passenger@2025");
        user = await prisma.user.create({
          data: {
            name: "Passenger Member",
            username: "passenger",
            firstName: "Passenger",
            lastName: "Member",
            email: "passenger@vg3dmodelers.com",
            passwordHash,
            role: "USER",
            status: "APPROVED",
            phone: "+91 98765 43210",
            country: "India",
            state: "Maharashtra",
            city: "Mumbai",
            address: "VG Railway Simulations Station Road",
            postalCode: "400001",
            isVerified: true,
            approvedAt: new Date(),
          },
        });
      } else if (isStandardDemo) {
        const passwordHash = await hashPassword("Passenger@2025");
        user = await prisma.user.create({
          data: {
            name: "Tirthesh Bari",
            username: "tirthesh",
            firstName: "Tirthesh",
            lastName: "Bari",
            email: "demo@trainsim.com",
            passwordHash,
            role: "USER",
            status: "APPROVED",
            phone: "+91 98765 01234",
            country: "India",
            state: "Maharashtra",
            isVerified: true,
            approvedAt: new Date(),
          },
        });
      } else if (isStandardAdmin) {
        const passwordHash = await hashPassword("Admin@VG3D#2025");
        user = await prisma.user.create({
          data: {
            name: "Varun Ganesh (Admin)",
            username: "vgadmin",
            firstName: "Varun",
            lastName: "Ganesh",
            email: "admin@vg3dmodelers.com",
            passwordHash,
            role: "SUPER_ADMIN",
            status: "APPROVED",
            phone: "+91 98401 23456",
            country: "India",
            state: "Tamil Nadu",
            isVerified: true,
            approvedAt: new Date(),
          },
        });
      }
    } else {
      // Ensure standard accounts have valid hash and APPROVED status
      if (isStandardPassenger) {
        const isMatch = await comparePassword(password, user.passwordHash);
        if (!isMatch || user.status !== "APPROVED") {
          const passwordHash = await hashPassword("Passenger@2025");
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              passwordHash,
              status: "APPROVED",
              isVerified: true,
              approvedAt: new Date(),
            },
          });
        }
      } else if (isStandardAdmin) {
        const isMatch = await comparePassword(password, user.passwordHash);
        if (!isMatch || user.status !== "APPROVED") {
          const passwordHash = await hashPassword("Admin@VG3D#2025");
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              passwordHash,
              status: "APPROVED",
              role: "SUPER_ADMIN",
              isVerified: true,
              approvedAt: new Date(),
            },
          });
        }
      }
    }

    if (!user) {
      const failInfo = recordFailedLogin(rateLimitKey);
      return NextResponse.json(
        {
          error: failInfo.locked
            ? "Too many failed attempts. Account temporarily locked for 15 minutes."
            : `Invalid email/username or password. (${failInfo.attemptsRemaining} attempt(s) remaining before temporary lockout)`,
        },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      const failInfo = recordFailedLogin(rateLimitKey);
      return NextResponse.json(
        {
          error: failInfo.locked
            ? "Too many failed attempts. Account temporarily locked for 15 minutes."
            : `Invalid email/username or password. (${failInfo.attemptsRemaining} attempt(s) remaining before temporary lockout)`,
        },
        { status: 401 }
      );
    }

    // Login succeeded: reset rate limit attempts
    resetLoginAttempts(rateLimitKey);

    // Check Account Status
    if (user.status === "PENDING_APPROVAL") {
      return NextResponse.json(
        {
          error: "Please ask for approval from VG. Your account has not been approved yet.",
          accountStatus: "PENDING_APPROVAL",
        },
        { status: 403 }
      );
    }

    if (user.status === "REJECTED") {
      return NextResponse.json(
        {
          error: user.rejectionReason
            ? `Your account was rejected: ${user.rejectionReason}`
            : "Your account application has been rejected by the administrator.",
          accountStatus: "REJECTED",
        },
        { status: 403 }
      );
    }

    if (user.status === "SUSPENDED") {
      return NextResponse.json(
        {
          error: "Your account has been suspended. Please contact customer support.",
          accountStatus: "SUSPENDED",
        },
        { status: 403 }
      );
    }

    // Account is APPROVED
    const token = createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const userResponse = {
      id: user.id,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
      phone: user.phone,
      country: user.country,
      state: user.state,
    };

    const response = NextResponse.json({
      message: "Login successful",
      user: userResponse,
      token,
    });

    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "USER_LOGIN",
          entity: "AUTH",
          entityId: user.id,
          details: `User ${user.email} (${user.role}) logged in successfully.`,
          ipAddress: ip,
        },
      });
    } catch (e) {
      // ignore
    }

    const isSecure = process.env.NODE_ENV === "production" && !req.url.includes("localhost");

    response.cookies.set({
      name: "vg_auth_token",
      value: token,
      httpOnly: true,
      secure: isSecure,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to log in" },
      { status: 500 }
    );
  }
}
