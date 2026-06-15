import { createFileRoute } from "@tanstack/react-router";

const TEST_USERS = [
  { email: "demo@paisa.app", password: "Demo1234!", name: "Demo User" },
  { email: "asha@paisa.app", password: "Demo1234!", name: "Asha Kumar" },
  { email: "rahul@paisa.app", password: "Demo1234!", name: "Rahul Sharma" },
];

export const Route = createFileRoute("/api/public/seed-test-users")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = request.headers.get("x-seed-token");
        const expected = process.env.SEED_TOKEN;
        if (!expected || token !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const results: Array<{ email: string; status: string; id?: string }> = [];

        for (const u of TEST_USERS) {
          const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: u.email,
            password: u.password,
            email_confirm: true,
            user_metadata: { name: u.name },
          });
          if (error) {
            results.push({ email: u.email, status: `error: ${error.message}` });
          } else {
            results.push({ email: u.email, status: "created", id: data.user?.id });
          }
        }

        return Response.json({
          users: results,
          credentials: TEST_USERS.map(({ email, password }) => ({ email, password })),
        });
      },
    },
  },
});
