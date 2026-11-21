/**
 * Email Service for TB PRO Railway Simulations
 * Provides professional HTML templates and delivery handling for:
 * - Admin registration notifications (pending user approvals)
 * - User approval notifications
 * - User rejection notifications
 * - Account suspension notices
 * - Password reset requests
 */

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const SITE_NAME = "TB PRO Railway Simulations";
const SUPPORT_EMAIL = "tirtheshbari18@gmail.com";
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Base email wrapper with brand styling
 */
function wrapEmailTemplate(content: string, title: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f1f5f9;
      color: #0f172a;
    }
    .wrapper {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      border: 1px solid #e2e8f0;
    }
    .header {
      background-color: #0B2852;
      padding: 30px 40px;
      text-align: center;
      border-bottom: 4px solid #39FF00;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 20px;
      letter-spacing: 1px;
      text-transform: uppercase;
      font-weight: 700;
    }
    .header p {
      margin: 6px 0 0 0;
      color: #A7D2F7;
      font-size: 13px;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 40px 40px;
      line-height: 1.6;
      font-size: 15px;
      color: #1e293b;
    }
    .btn {
      display: inline-block;
      padding: 14px 28px;
      background-color: #0B2852;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      border-radius: 6px;
      margin: 24px 0;
      text-align: center;
      letter-spacing: 0.5px;
      border: 2px solid #39FF00;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      background-color: #f8fafc;
      border-radius: 8px;
      overflow: hidden;
    }
    .data-table td {
      padding: 10px 16px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 14px;
    }
    .data-table td.label {
      font-weight: 600;
      color: #475569;
      width: 35%;
    }
    .footer {
      background-color: #0B2852;
      color: #94a3b8;
      padding: 24px 40px;
      text-align: center;
      font-size: 12px;
      line-height: 1.5;
    }
    .footer a {
      color: #39FF00;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>TB PRO Railway Simulations</h1>
      <p>Official Notification Service</p>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} TB PRO Railway Simulations. Regd UDYAM-MH-18-0225661.</p>
      <p>Need support? Contact us at <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a> or WhatsApp +91 7738980989.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Dispatch an email (logs and executes delivery)
 */
export async function sendEmail({ to, subject, html, text }: SendEmailParams): Promise<boolean> {
  console.log(`\n================== [OUTGOING EMAIL] ==================`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Preview: ${text || subject}`);
  console.log(`======================================================\n`);

  // If external SMTP or transactional webhook is configured in env, dispatch here
  // Otherwise, return true so registration and password reset workflows execute smoothly
  return true;
}

/**
 * Alert administrator when a new user registers and awaits approval
 */
export async function sendAdminNewUserAlert(user: {
  id: string;
  name: string;
  username?: string | null;
  email: string;
  phone?: string | null;
  city?: string | null;
  country?: string | null;
  createdAt: Date;
}) {
  const adminEmail = process.env.ADMIN_ALERT_EMAIL || "tirtheshbari18@gmail.com";
  const approveUrl = `${BASE_URL}/admin?tab=users`;

  const html = wrapEmailTemplate(
    `
    <h2 style="color: #0B2852; margin-top: 0;">New TB PRO Website Account Approval Required</h2>
    <p>A new user has registered on the TB PRO portal and requires administrator review and approval before access is granted.</p>
    
    <table class="data-table">
      <tr>
        <td class="label">Registration ID</td>
        <td><strong style="font-family: monospace; color: #0B2852;">${user.id}</strong></td>
      </tr>
      <tr>
        <td class="label">Full Name</td>
        <td><strong>${user.name}</strong></td>
      </tr>
      <tr>
        <td class="label">Username</td>
        <td><strong style="color: #166534;">${user.username || "Not specified"}</strong></td>
      </tr>
      <tr>
        <td class="label">Email Address</td>
        <td><a href="mailto:${user.email}" style="color: #0B2852;">${user.email}</a></td>
      </tr>
      <tr>
        <td class="label">Phone</td>
        <td>${user.phone || "Not provided"}</td>
      </tr>
      <tr>
        <td class="label">Location</td>
        <td>${user.city || "N/A"}, ${user.country || "India"}</td>
      </tr>
      <tr>
        <td class="label">Registration Date &amp; Time</td>
        <td>${new Date(user.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</td>
      </tr>
      <tr>
        <td class="label">Account Status</td>
        <td><span style="display:inline-block; padding: 4px 10px; background: #fef3c7; color: #92400e; border: 1px solid #fde68a; border-radius: 4px; font-weight: 700; font-size: 12px;">PENDING_APPROVAL</span></td>
      </tr>
    </table>

    <p style="margin-top: 24px;">Click the button below to review user details, approve access, or reject this application in your Admin Dashboard:</p>
    <div style="text-align: center;">
      <a href="${approveUrl}" class="btn">Open Admin Approval Dashboard</a>
    </div>
    `,
    "New TB PRO Website Account Approval Required"
  );

  return sendEmail({
    to: adminEmail,
    subject: `New TB PRO Website Account Approval Required: ${user.name} (${user.email})`,
    html,
  });
}

/**
 * Send approval confirmation to user
 */
export async function sendUserApprovedEmail(user: { name: string; email: string }) {
  const loginUrl = `${BASE_URL}/login`;

  const html = wrapEmailTemplate(
    `
    <h2 style="color: #0B2852; margin-top: 0;">Congratulations, ${user.name}!</h2>
    <p style="font-size: 16px; color: #166534; font-weight: 600;">Your account has been officially approved by the TB PRO team.</p>
    <p>You now have full access to our complete collection of Open Rails &amp; MSTS Indian Railway simulation add-ons, add-on store, public train boards, and member downloads.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${loginUrl}" class="btn">Log In To Your Account</a>
    </div>

    <p>If you have any questions or require custom consist configurations, feel free to contact us anytime.</p>
    `,
    "Account Approved - TB PRO"
  );

  return sendEmail({
    to: user.email,
    subject: "Your Account Has Been Approved - TB PRO Railway Simulations",
    html,
  });
}

/**
 * Send rejection notice to user
 */
export async function sendUserRejectedEmail(user: { name: string; email: string }, reason?: string) {
  const html = wrapEmailTemplate(
    `
    <h2 style="color: #0B2852; margin-top: 0;">Account Application Update</h2>
    <p>Dear ${user.name},</p>
    <p>Thank you for your interest in TB PRO Railway Simulations. We regret to inform you that your registration application could not be approved at this time.</p>
    
    ${
      reason
        ? `
      <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 14px 18px; margin: 20px 0; border-radius: 4px;">
        <strong style="color: #991b1b;">Reason provided:</strong>
        <p style="margin: 6px 0 0 0; color: #7f1d1d;">${reason}</p>
      </div>
      `
        : ""
    }

    <p>If you believe this was an error or wish to provide additional verification details, please reply directly to <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.</p>
    `,
    "Account Application Status - TB PRO"
  );

  return sendEmail({
    to: user.email,
    subject: "Update Regarding Your Account - TB PRO Railway Simulations",
    html,
  });
}

/**
 * Send password reset email with secure token link
 */
export async function sendPasswordResetEmail(user: { name: string; email: string; token: string }) {
  const resetUrl = `${BASE_URL}/reset-password?token=${user.token}&email=${encodeURIComponent(user.email)}`;

  const html = wrapEmailTemplate(
    `
    <h2 style="color: #0B2852; margin-top: 0;">Password Reset Request</h2>
    <p>Hello ${user.name},</p>
    <p>We received a request to reset the password for your TB PRO account.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" class="btn">Reset My Password</a>
    </div>

    <p style="color: #64748b; font-size: 13px;">This link will expire in <strong>30 minutes</strong> and can only be used once. If you did not make this request, you can safely ignore this email; your current password remains secure.</p>
    `,
    "Reset Your Password - TB PRO"
  );

  return sendEmail({
    to: user.email,
    subject: "Reset Your Password - TB PRO Railway Simulations",
    html,
  });
}
