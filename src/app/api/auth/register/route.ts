import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { sendAdminNewUserAlert } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      fullName: reqFullName,
      firstName: reqFirstName,
      lastName: reqLastName,
      username,
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
      isRobotVerified,
      humanVerificationToken,
      captchaToken,
      captchaAnswer,
    } = body;

    // 1. Human verification check (1-click checkbox or captcha token)
    const isHumanValid =
      isRobotVerified === true ||
      (typeof humanVerificationToken === "string" && humanVerificationToken.length > 0) ||
      (typeof captchaToken === "string" && captchaToken.length > 0);

    if (!isHumanValid) {
      return NextResponse.json(
        { error: "Please complete the human verification checkbox ('I am not a robot')." },
        { status: 400 }
      );
    }

    // 2. Validate Full Name
    const combinedName = (name || reqFullName || `${reqFirstName || ""} ${reqLastName || ""}`).trim();
    if (!combinedName) {
      return NextResponse.json(
        { error: "Full name is required." },
        { status: 400 }
      );
    }

    const nameParts = combinedName.split(" ").filter(Boolean);
    const firstName = reqFirstName?.trim() || nameParts[0] || combinedName;
    const lastName = reqLastName?.trim() || (nameParts.length > 1 ? nameParts.slice(1).join(" ") : "");

    // 3. Validate Username
    if (!username || typeof username !== "string" || username.trim().length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters long." },
        { status: 400 }
      );
    }

    const normalizedUsername = username.trim().toLowerCase();
    const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
    if (!usernameRegex.test(normalizedUsername)) {
      return NextResponse.json(
        { error: "Username can only contain letters, numbers, underscores, dots, and hyphens." },
        { status: 400 }
      );
    }

    // 4. Validate Email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Valid email address is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // 5. Validate Password
    if (!password) {
      return NextResponse.json(
        { error: "Password is required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match." },
        { status: 400 }
      );
    }

    // 6. Check for existing Email and Username
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please log in instead." },
        { status: 400 }
      );
    }

    const existingUserByUsername = await prisma.user.findFirst({
      where: { username: normalizedUsername },
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        { error: "This username is already taken. Please choose another username." },
        { status: 400 }
      );
    }

    // 7. Hash password
    const passwordHash = await hashPassword(password);

    // 8. Create user in database with PENDING_APPROVAL status
    const user = await prisma.user.create({
      data: {
        name: combinedName,
        username: normalizedUsername,
        firstName,
        lastName: lastName || null,
        email: normalizedEmail,
        passwordHash,
        phone: phone ? phone.trim() : null,
        address: address ? address.trim() : null,
        address2: address2 ? address2.trim() : null,
        city: city ? city.trim() : null,
        state: state ? state.trim() : null,
        postalCode: postalCode ? postalCode.trim() : null,
        country: country || "India",
        role: "USER",
        status: "PENDING_APPROVAL",
        isVerified: false,
      },
    });

    // 9. Send email notification to administrator (tirtheshbari18@gmail.com)
    try {
      await sendAdminNewUserAlert({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        city: user.city,
        country: user.country,
        createdAt: user.createdAt,
      });
    } catch (emailErr) {
      console.error("Failed to send admin alert email:", emailErr);
    }

    return NextResponse.json({
      success: true,
      status: "PENDING_APPROVAL",
      registrationId: user.id,
      message:
        "Your account registration was successful. Your account is pending administrator approval. Please wait for approval before logging in.",
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to complete registration" },
      { status: 500 }
    );
  }
}
