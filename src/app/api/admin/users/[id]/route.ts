import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { sendUserApprovedEmail, sendUserRejectedEmail } from "@/lib/email";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getUserFromRequest(req);
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();
    const { action, reason } = body;

    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let updatedUser;

    switch (action) {
      case "approve":
        updatedUser = await prisma.user.update({
          where: { id },
          data: {
            status: "APPROVED",
            isVerified: true,
            approvedAt: new Date(),
            approvedBy: admin.email,
            rejectedAt: null,
            rejectionReason: null,
            suspendedAt: null,
          },
        });

        try {
          await sendUserApprovedEmail({
            name: targetUser.name,
            email: targetUser.email,
          });
        } catch (e) {
          console.error("Failed to send user approved email:", e);
        }
        break;

      case "reject":
        updatedUser = await prisma.user.update({
          where: { id },
          data: {
            status: "REJECTED",
            rejectedAt: new Date(),
            rejectionReason: reason || "Account application requirements not met.",
            suspendedAt: null,
          },
        });

        try {
          await sendUserRejectedEmail(
            {
              name: targetUser.name,
              email: targetUser.email,
            },
            reason
          );
        } catch (e) {
          console.error("Failed to send user rejection email:", e);
        }
        break;

      case "suspend":
        updatedUser = await prisma.user.update({
          where: { id },
          data: {
            status: "SUSPENDED",
            suspendedAt: new Date(),
          },
        });
        break;

      case "reactivate":
        updatedUser = await prisma.user.update({
          where: { id },
          data: {
            status: "APPROVED",
            suspendedAt: null,
            approvedAt: new Date(),
            approvedBy: admin.email,
          },
        });
        break;

      default:
        return NextResponse.json(
          { error: "Invalid action. Supported: approve, reject, suspend, reactivate" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `User status successfully updated to ${updatedUser.status}`,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        status: updatedUser.status,
      },
    });
  } catch (error: any) {
    console.error("Admin user action error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update user status" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getUserFromRequest(req);
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { id } = params;

    // Prevent deleting the main admin account
    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (targetUser.role === "ADMIN" && targetUser.email === "admin@vg3dmodelers.com") {
      return NextResponse.json(
        { error: "Cannot delete the primary administrator account" },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
