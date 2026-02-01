import { resend } from '@/libs/resend';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!resend) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    const data = await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>', // Resend provides this for testing
      to: [process.env.CONTACT_EMAIL as string],
      subject: `New Message from ${name}`,
      replyTo: email,
      text: message,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}