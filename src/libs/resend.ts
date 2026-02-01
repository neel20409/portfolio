import { Resend } from 'resend';

// Only initialize if the key exists to prevent build errors
export const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;