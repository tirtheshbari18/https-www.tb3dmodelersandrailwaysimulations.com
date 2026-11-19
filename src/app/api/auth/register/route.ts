import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { verifyCaptcha } from "@/lib/captcha";
import { sendAdminNewUserAlert } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      address2,
      city,
      state,
      postalCode,
      country,
      password,
      confirmPassword,
      termsAccepted,
      privacyAccepted,
      eulaAccepted,
      captchaToken,
      captchaAnswer,
    } = body;

    // 1. Validate CAPTCHA
    const captchaCheck = await verifyCaptcha(captchaToken, captchaAnswer);
    if (!captchaCheck.valid) {
      return NextResponse.json(
        { error: captchaCheck.error || "Invalid CAPTCHA answer" },
        { status: 400 }
      );
    }

    // 2. Validate mandatory fields
    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "First and last name are required" },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { error: "Mobile phone number is required" },
        { status: 400 }
      );
    }

    if (!address || !city || !state || !postalCode) {
      return NextResponse.json(
        { error: "Full postal address (address, city, state, postal code) is required" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
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

    if (!termsAccepted || !privacyAccepted || !eulaAccepted) {
      return NextResponse.json(
        { error: "You must accept the Terms & Conditions, Privacy Policy, and EULA to register" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 3. Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists" },
        { status: 400 }
      );
    }

    // 4. Hash password
    const passwordHash = await hashPassword(password);
    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    // 5. Create user with PENDING_APPROVAL status
    const user = await prisma.user.create({
      data: {
        name: fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        passwordHash,
        phone: phone.trim(),
        address: address.trim(),
        address2: address2 ? address2.trim() : null,
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: country || "India",
        role: "USER",
        status: "PENDING_APPROVAL",
        isVerified: false,
      },
    });

    // 6. Notify admin via email
    try {
      await sendAdminNewUserAlert({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        country: user.country,
        createdAt: user.createdAt,
      });
    } catch (e) {
      console.error("Failed to send admin new user alert email:", e);
    }

    return NextResponse.json({
      success: true,
      status: "PENDING_APPROVAL",
      message:
        "Registration successful! Your account is currently pending administrator approval. You will be notified by email once your account has been reviewed and approved.",
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to complete registration" },
      { status: 500 }
    );
  }
}
