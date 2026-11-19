import crypto from "crypto";
import { prisma } from "./prisma";

interface CaptchaResult {
  token: string;
  svg: string;
  expiresAt: Date;
}

// Helper to generate random string excluding confusing characters
function generateCode(length = 5): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += chars[randomBytes[i] % chars.length];
  }
  return result;
}

// Generate SVG markup for the CAPTCHA
function createCaptchaSvg(text: string): string {
  const width = 180;
  const height = 50;

  // Background gradient and noise elements
  const lines: string[] = [];
  for (let i = 0; i < 6; i++) {
    const x1 = Math.floor(Math.random() * width);
    const y1 = Math.floor(Math.random() * height);
    const x2 = Math.floor(Math.random() * width);
    const y2 = Math.floor(Math.random() * height);
    const stroke = i % 2 === 0 ? "#0B2852" : "#A7D2F7";
    lines.push(
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="1.5" stroke-opacity="0.35" />`
    );
  }

  // Random dots
  const dots: string[] = [];
  for (let i = 0; i < 25; i++) {
    const cx = Math.floor(Math.random() * width);
    const cy = Math.floor(Math.random() * height);
    const r = (Math.random() * 2 + 1).toFixed(1);
    dots.push(
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#0B2852" fill-opacity="0.25" />`
    );
  }

  // Letters with slight rotation and displacement
  const chars = text.split("");
  const charElements = chars.map((ch, idx) => {
    const x = 25 + idx * 28;
    const y = 33 + (Math.random() * 8 - 4);
    const rot = Math.floor(Math.random() * 24 - 12);
    const colors = ["#0B2852", "#101C32", "#1e3a8a", "#0f172a"];
    const color = colors[idx % colors.length];
    return `<text x="${x}" y="${y}" fill="${color}" font-family="'Josefin Sans', 'Trebuchet MS', sans-serif" font-size="26" font-weight="700" transform="rotate(${rot} ${x} ${y})" letter-spacing="3">${ch}</text>`;
  });

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 8px; border: 1px solid #cbd5e1; user-select: none;">
      <defs>
        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e2e8f0" stroke-width="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      ${lines.join("\n")}
      ${dots.join("\n")}
      ${charElements.join("\n")}
    </svg>
  `.trim();
}

/**
 * Generate a new CAPTCHA challenge and store it in database
 */
export async function generateCaptcha(): Promise<CaptchaResult> {
  const code = generateCode(5);
  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.captchaChallenge.create({
    data: {
      token,
      answer: code.toUpperCase(),
      expiresAt,
    },
  });

  const svg = createCaptchaSvg(code);

  return {
    token,
    svg,
    expiresAt,
  };
}

/**
 * Verify a user's answer against the stored CAPTCHA challenge
 */
export async function verifyCaptcha(
  token: string | undefined | null,
  answer: string | undefined | null
): Promise<{ valid: boolean; error?: string }> {
  if (!token || !answer) {
    return { valid: false, error: "CAPTCHA response is required" };
  }

  const challenge = await prisma.captchaChallenge.findUnique({
    where: { token },
  });

  if (!challenge) {
    return { valid: false, error: "Invalid CAPTCHA session. Please refresh the code." };
  }

  // Delete from DB immediately to prevent replay attacks
  await prisma.captchaChallenge.delete({
    where: { token },
  }).catch(() => {});

  if (new Date() > challenge.expiresAt) {
    return { valid: false, error: "CAPTCHA expired. Please request a new code." };
  }

  const isMatch =
    challenge.answer.trim().toUpperCase() === answer.trim().toUpperCase();

  if (!isMatch) {
    return { valid: false, error: "Incorrect CAPTCHA answer. Please try again." };
  }

  return { valid: true };
}
