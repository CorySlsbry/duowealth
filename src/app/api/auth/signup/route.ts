/**
 * Server-side Signup Endpoint
 * POST /api/auth/signup
 *
 * Creates a Supabase auth user, then creates a couple + couple_member
 * binding so the new user has a couple to scope their data to.
 * Subscription state is created later by the Stripe webhook against the
 * `subscriptions` table.
 */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json();

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 1. Create auth user with auto-confirmed email
    const { data: authData, error: authError } =
      await (supabase.auth as any).admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      });

    if (authError) {
      if (authError.message.includes("already been registered")) {
        return NextResponse.json(
          { error: "An account with this email already exists. Please sign in." },
          { status: 409 }
        );
      }
      console.error("Auth create error:", authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData?.user) {
      return NextResponse.json(
        { error: "Failed to create user account" },
        { status: 500 }
      );
    }

    const userId = authData.user.id;

    // 2. Create the couple shell
    const { data: couple, error: coupleErr } = await (supabase as any)
      .from("couples")
      .insert({ name: `${fullName}'s couple` })
      .select("id")
      .single();

    if (coupleErr || !couple?.id) {
      // Rollback: delete the auth user since couple creation failed
      await (supabase.auth as any).admin.deleteUser(userId);
      console.error("Couple create error:", coupleErr);
      return NextResponse.json(
        { error: "Failed to create couple workspace: " + coupleErr?.message },
        { status: 500 }
      );
    }

    // 3. Bind the user as the primary couple member
    const { error: memberErr } = await (supabase as any)
      .from("couple_members")
      .insert({
        couple_id: couple.id,
        user_id: userId,
        role: "primary",
      });

    if (memberErr) {
      // Rollback: delete couple + auth user
      await (supabase as any).from("couples").delete().eq("id", couple.id);
      await (supabase.auth as any).admin.deleteUser(userId);
      console.error("Couple member create error:", memberErr);
      return NextResponse.json(
        { error: "Failed to bind couple member: " + memberErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: { id: userId, email: authData.user.email },
      couple: { id: couple.id },
    });
  } catch (err) {
    console.error("Unexpected signup error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
