import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactPayload {
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  service_interest: string;
  goals: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const payload: ContactPayload = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: dbError } = await supabase
      .from("contact_submissions")
      .insert([
        {
          first_name: payload.first_name,
          last_name: payload.last_name,
          email: payload.email,
          company: payload.company,
          service_interest: payload.service_interest,
          goals: payload.goals,
        },
      ]);

    if (dbError) {
      return new Response(
        JSON.stringify({ success: false, error: "Failed to save submission" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      const emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <h2 style="border-bottom: 2px solid #c9a227; padding-bottom: 12px; color: #1a1a1a;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; width: 140px;">Name</td><td style="padding: 8px 0; font-weight: 500;">${payload.first_name} ${payload.last_name}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${payload.email}" style="color: #c9a227;">${payload.email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Company</td><td style="padding: 8px 0;">${payload.company}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Interest</td><td style="padding: 8px 0;">${payload.service_interest}</td></tr>
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #f8f7f4; border-radius: 8px;">
            <p style="margin: 0 0 4px; color: #666; font-size: 13px;">Goals</p>
            <p style="margin: 0; line-height: 1.6;">${payload.goals}</p>
          </div>
        </div>
      `;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Attrakt <notifications@attrakt.io>",
          to: ["ben@timesthree.io"],
          subject: `New enquiry from ${payload.first_name} ${payload.last_name} — ${payload.company}`,
          html: emailHtml,
          reply_to: payload.email,
        }),
      });
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: "Invalid request" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
