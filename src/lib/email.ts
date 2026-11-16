
import { Resend } from "resend";

type PasswordResetEmailProps = {
  to: string;
  url: string;
};

export async function sendPasswordResetEmail({
  to,
  url,
}: PasswordResetEmailProps) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    throw new Error("Resend email configuration is missing.");
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject: "Reset Your Travel Agency System Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">
        <h2>Password Reset Request</h2>

        <p>We received a request to reset your password.</p>

        <p>Click the button below to create a new password:</p>

        <a
          href="${url}"
          style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px;"
        >
          Reset Password
        </a>

        <p>If you did not request this, you can safely ignore this email.</p>

        <p>This is an automated email. Please do not reply.</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
}
