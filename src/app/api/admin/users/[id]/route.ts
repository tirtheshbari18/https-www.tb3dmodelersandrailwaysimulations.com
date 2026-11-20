import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest, isAdminRole, isSuperAdminRole } from "@/lib/auth";
import { sendUserApprovedEmail, sendUserRejectedEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getUserFromRequest(req);
    if (!admin || !isAdminRole(admin.role)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();
    const { action, reason, role: newRole } = body;

    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let updatedUser;

    switch (action) {
      case "setRole":
        if (!isSuperAdminRole(admin.role)) {
          return NextResponse.json(
            { error: "Only Super Administrators can assign or change user roles." },
            { status: 403 }
          );
        }
        if (!newRole || !["SUPER_ADMIN", "ADMIN", "USER"].includes(newRole)) {
          return NextResponse.json(
            { error: "Invalid role specified. Supported: SUPER_ADMIN, ADMIN, USER" },
            { status: 400 }
          );
        }
        updatedUser = await prisma.user.update({
          where: { id },
          data: { role: newRole },
        });

        try {
          await prisma.auditLog.create({
            data: {
              userId: admin.id,
              action: "ROLE_CHANGED",
              entity: "USER",
              entityId: targetUser.id,
              details: `Super Admin ${admin.email} changed role of ${targetUser.email} to ${newRole}.`,
            },
          });
        } catch (e) {}
        break;

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
          await prisma.auditLog.create({
            data: {
              userId: admin.id,
              action: "USER_APPROVED",
              entity: "USER",
              entityId: targetUser.id,
              details: `Approved user ${targetUser.email}.`,
            },
          });
        } catch (e) {}

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
          await prisma.auditLog.create({
            data: {
              userId: admin.id,
              action: "USER_REJECTED",
              entity: "USER",
              entityId: targetUser.id,
              details: `Rejected user ${targetUser.email}: ${reason || "No reason specified"}.`,
            },
          });
        } catch (e) {}

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

        try {
          await prisma.auditLog.create({
            data: {
              userId: admin.id,
              action: "USER_SUSPENDED",
              entity: "USER",
              entityId: targetUser.id,
              details: `Suspended user ${targetUser.email}.`,
            },
          });
        } catch (e) {}
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

        try {
          await prisma.auditLog.create({
            data: {
              userId: admin.id,
              action: "USER_REACTIVATED",
              entity: "USER",
              entityId: targetUser.id,
              details: `Reactivated user ${targetUser.email}.`,
            },
          });
        } catch (e) {}
        break;

      default:
        return NextResponse.json(
          { error: "Invalid action. Supported: approve, reject, suspend, reactivate, setRole" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `User status/role successfully updated to ${updatedUser.status} (${updatedUser.role})`,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        status: updatedUser.status,
        role: updatedUser.role,
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
    if (!admin || !isAdminRole(admin.role)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { id } = params;

    // Prevent deleting the main admin account
    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (targetUser.email === "admin@vg3dmodelers.com") {
      return NextResponse.json(
        { error: "Cannot delete the primary administrator account" },
        { status: 400 }
      );
    }

    if (targetUser.role === "SUPER_ADMIN" && !isSuperAdminRole(admin.role)) {
      return NextResponse.json(
        { error: "Only a Super Administrator can delete an admin account." },
        { status: 403 }
      );
    }

    await prisma.user.delete({ where: { id } });

    try {
      await prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: "USER_DELETED",
          entity: "USER",
          entityId: id,
          details: `Deleted user ${targetUser.email} (${targetUser.role}).`,
        },
      });
    } catch (e) {}

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
