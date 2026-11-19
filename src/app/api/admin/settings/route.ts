import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest, isAdminRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let settings = await prisma.websiteSetting.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await prisma.websiteSetting.create({
        data: { id: "default" },
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !isAdminRole(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();

    const updated = await prisma.websiteSetting.upsert({
      where: { id: "default" },
      update: {
        siteName: body.siteName,
        tagline: body.tagline,
        founderName: body.founderName,
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
        whatsappNumber: body.whatsappNumber,
        currencySymbol: body.currencySymbol,
        currencyCode: body.currencyCode,
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        disclaimerText: body.disclaimerText,
        termsContent: body.termsContent,
        privacyContent: body.privacyContent,
        eulaContent: body.eulaContent,
        refundContent: body.refundContent,
        ...(body.sliderInterval !== undefined && { sliderInterval: parseInt(body.sliderInterval, 10) }),
      },
      create: {
        id: "default",
        siteName: body.siteName,
        tagline: body.tagline,
        founderName: body.founderName,
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
        whatsappNumber: body.whatsappNumber,
        currencySymbol: body.currencySymbol,
        currencyCode: body.currencyCode,
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        disclaimerText: body.disclaimerText,
        termsContent: body.termsContent,
        privacyContent: body.privacyContent,
        eulaContent: body.eulaContent,
        refundContent: body.refundContent,
        ...(body.sliderInterval !== undefined && { sliderInterval: parseInt(body.sliderInterval, 10) }),
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
