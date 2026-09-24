import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { initializeUserBoard } from "../init-user-board";
import connectDB from "../db";

const mongooseInstance = await connectDB();
const client = mongooseInstance.connection.getClient();
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined),
  trustedOrigins: [
    "http://localhost:3000",
    process.env.BETTER_AUTH_URL || "",
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "",
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
    "https://*.vercel.app",
  ].filter(Boolean),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (user.id) {
            try {
              await initializeUserBoard(user.id);
            } catch (err) {
              console.error("Failed to initialize user board on signup:", err);
            }
          }
        },
      },
    },
  },
});

export async function getSession() {
  const result = await auth.api.getSession({
    headers: await headers(),
  });

  return result;
}

export async function signOut() {
  const result = await auth.api.signOut({
    headers: await headers(),
  });

  if (result.success) {
    redirect("/sign-in");
  }
}
