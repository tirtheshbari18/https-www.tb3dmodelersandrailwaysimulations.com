import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { token, email, password, confirmPassword } = await req.json();

    if (!token || !email) {
      return NextResponse.json(
        { error: "Invalid or missing password reset token" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: "New password is required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (
      !user ||
      !user.passwordResetTokenHash ||
      user.passwordResetTokenHash !== tokenHash
    ) {
      return NextResponse.json(
        { error: "Invalid password reset token. Please request a new link." },
        { status: 400 }
      );
    }

    if (user.passwordResetUsedAt) {
      return NextResponse.json(
        { error: "This password reset token has already been used. Please request a new link." },
        { status: 400 }
      );
    }

    if (!user.passwordResetExpiresAt || new Date() > user.passwordResetExpiresAt) {
      return NextResponse.json(
        { error: "This password reset token has expired. Please request a new link." },
        { status: 400 }
      );
    }

    // Hash new password and mark token used
    const newPasswordHash = await hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        passwordResetUsedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Your password has been reset successfully. You can now log in with your new password.",
    });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
