import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const myMailOptions = {
      from: `"Portfolio Notification" <${process.env.GMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL,
      subject: `New Message from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    const thankYouMailOptions = {
      from: `"Neel Bhatt" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Thanks for reaching out, ${name}!`,
      text: `Hi ${name},\n\nThank you for reaching out. I've received your message and will get back to you soon.`,
    };

    // REMOVE 'await' here to send the response immediately
    // This runs the email sending process in the background
    transporter.sendMail(myMailOptions).catch(err => console.error("Admin Email Error:", err));
    transporter.sendMail(thankYouMailOptions).catch(err => console.error("User Email Error:", err));

    // Send immediate success to the frontend
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Route Error:", error);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}