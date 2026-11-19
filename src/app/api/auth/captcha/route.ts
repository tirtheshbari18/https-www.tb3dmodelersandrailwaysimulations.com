import { NextResponse } from "next/server";
import { generateCaptcha } from "@/lib/captcha";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const captcha = await generateCaptcha();
    return NextResponse.json({
      token: captcha.token,
      svg: captcha.svg,
      expiresAt: captcha.expiresAt.toISOString(),
    });
  } catch (error: any) {
    console.error("Captcha generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate CAPTCHA" },
      { status: 500 }
    );
  }
}
