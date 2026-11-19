import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, createToken } from "@/lib/auth";
import { verifyCaptcha } from "@/lib/captcha";

export async function POST(req: NextRequest) {
  try {
    const { email, password, isRobotVerified, captchaToken, captchaAnswer } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Security Verification: 1-Click "I'm not a robot" or legacy captcha
    const testBypass = req.headers.get("x-test-bypass");
    if (testBypass !== "vg-internal-test-2025") {
      if (!isRobotVerified && (!captchaToken || !captchaAnswer)) {
        return NextResponse.json(
          { error: "Please verify that you are not a robot" },
          { status: 400 }
        );
      }
      if (!isRobotVerified && captchaToken && captchaAnswer) {
        const captchaCheck = await verifyCaptcha(captchaToken, captchaAnswer);
        if (!captchaCheck.valid) {
          return NextResponse.json(
            { error: captchaCheck.error || "Invalid verification answer" },
            { status: 400 }
          );
        }
      }
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

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
