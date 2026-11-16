
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

const authSecret = process.env.BETTER_AUTH_SECRET;
const authUrl = process.env.BETTER_AUTH_URL;

if (!authSecret) {
  throw new Error("BETTER_AUTH_SECRET is not configured");
}

if (!authUrl) {
  throw new Error("BETTER_AUTH_URL is not configured");
}

export const auth = betterAuth({
  secret: authSecret,
  baseURL: authUrl,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    revokeSessionsOnPasswordReset: true,

    sendResetPassword: async ({ user, url }) => {
      void sendPasswordResetEmail({
        to: user.email,
        url,
      }).catch((error) => {
        console.error("Password reset email failed:", error);
      });
    },
  },
});
