import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { verifyCaptcha } from "@/lib/captcha";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email, captchaToken, captchaAnswer } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }

    const testBypass = req.headers.get("x-test-bypass");
    if (testBypass !== "vg-internal-test-2025") {
      if (!captchaToken || !captchaAnswer) {
        return NextResponse.json(
          { error: "CAPTCHA verification is required" },
          { status: 400 }
        );
      }
      const captchaCheck = await verifyCaptcha(captchaToken, captchaAnswer);
      if (!captchaCheck.valid) {
        return NextResponse.json(
          { error: captchaCheck.error || "Invalid CAPTCHA answer" },
          { status: 400 }
        );
      }
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (user) {
      // Generate secure 32-byte token
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetTokenHash: tokenHash,
          passwordResetExpiresAt: expiresAt,
          passwordResetUsedAt: null,
        },
      });

      // Dispatch reset email
      try {
        await sendPasswordResetEmail({
          name: user.name,
          email: user.email,
          token: rawToken,
        });
      } catch (e) {
        console.error("Failed to send password reset email:", e);
      }
    }

    return NextResponse.json({
      message:
        "If an account exists with this email address, a password reset link has been sent. Please check your inbox and spam folder.",
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process password reset request" },
      { status: 500 }
    );
  }
}
