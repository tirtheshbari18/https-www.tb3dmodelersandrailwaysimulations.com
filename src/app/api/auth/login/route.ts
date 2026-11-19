import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, createToken } from "@/lib/auth";
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

    if (!humanVerificationToken) {
      return NextResponse.json(
        { error: "Please verify that you are not a robot before submitting." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
    const rateLimitKey = `${normalizedEmail}:${ip}`;

    // Rate Limiting & Account Lockout Protection
    const rateCheck = checkLoginRateLimit(rateLimitKey);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Account temporarily locked due to repeated failed login attempts. Please wait ${rateCheck.waitMinutes} minute(s) before trying again.`,
        },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      const failInfo = recordFailedLogin(rateLimitKey);
      return NextResponse.json(
        {
          error: failInfo.locked
            ? "Too many failed attempts. Account temporarily locked for 15 minutes."
            : `Invalid email or password. (${failInfo.attemptsRemaining} attempt(s) remaining before temporary lockout)`,
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
            : `Invalid email or password. (${failInfo.attemptsRemaining} attempt(s) remaining before temporary lockout)`,
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
          error: "Your account is pending administrator approval. You will receive an email once approved.",
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
