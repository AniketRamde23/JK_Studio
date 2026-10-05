import { SlotRequest } from './db/types';

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  sentAt: string;
  status: 'SENT' | 'SIMULATED';
}

const emailLogs: EmailLog[] = [];

export function getEmailLogs(): EmailLog[] {
  return [...emailLogs].reverse();
}

/**
 * Sends an email notification to the studio owner when a new slot request is submitted.
 * Uses Resend API if RESEND_API_KEY is provided in environment variables,
 * otherwise logs the formatted notification cleanly and records it in emailLogs.
 */
export async function sendSlotRequestNotificationEmail(request: SlotRequest): Promise<{ success: boolean; mode: 'LIVE' | 'SIMULATED'; logId: string }> {
  const recipientEmail = process.env.STUDIO_NOTIFICATION_EMAIL || 'contact@actorjk.com';
  const subject = `📸 New Slot Request — ${request.eventName}`;
  
  const textContent = `
========================================
📸 NEW PHOTOGRAPHY BOOKING REQUEST
========================================

New Slot Request

Event: ${request.eventName}
Date: ${request.date}
Time: ${request.time}

Customer Name: ${request.customerName}
Phone: ${request.phone}
${request.notes ? `Notes: ${request.notes}\n` : ''}
Submitted: ${new Date(request.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' })}

Please contact the customer to discuss the requirements and pricing.
========================================
`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #0c0d0e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ece8e1;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #141619; border: 1px solid #2a2d32; border-radius: 12px; overflow: hidden;">
    <!-- Header -->
    <tr>
      <td style="padding: 28px 32px; background: linear-gradient(135deg, #1b1c20 0%, #111215 100%); border-bottom: 1px solid #2a2d32;">
        <span style="display: inline-block; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #c6a85e; font-weight: 600; margin-bottom: 6px;">JK STUDIO · NEW ENQUIRY</span>
        <h1 style="margin: 0; font-size: 24px; font-weight: 500; color: #f5f2eb; letter-spacing: -0.02em;">📸 New Slot Request</h1>
      </td>
    </tr>
    <!-- Content -->
    <tr>
      <td style="padding: 32px;">
        <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.5; color: #9da3af;">
          A visitor has just requested a booking slot for an upcoming event. Please review and call them directly to discuss requirements and pricing.
        </p>

        <!-- Details Card -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0b0d; border: 1px solid #23262b; border-radius: 8px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 14px 20px; border-bottom: 1px solid #1a1c20; width: 35%; font-size: 13px; color: #717784; text-transform: uppercase; letter-spacing: 0.05em;">Function / Event</td>
            <td style="padding: 14px 20px; border-bottom: 1px solid #1a1c20; font-size: 15px; color: #f5f2eb; font-weight: 600;">${request.eventName}</td>
          </tr>
          <tr>
            <td style="padding: 14px 20px; border-bottom: 1px solid #1a1c20; font-size: 13px; color: #717784; text-transform: uppercase; letter-spacing: 0.05em;">Date</td>
            <td style="padding: 14px 20px; border-bottom: 1px solid #1a1c20; font-size: 15px; color: #c6a85e; font-weight: 600;">${request.date}</td>
          </tr>
          <tr>
            <td style="padding: 14px 20px; border-bottom: 1px solid #1a1c20; font-size: 13px; color: #717784; text-transform: uppercase; letter-spacing: 0.05em;">Preferred Time</td>
            <td style="padding: 14px 20px; border-bottom: 1px solid #1a1c20; font-size: 15px; color: #f5f2eb;">${request.time}</td>
          </tr>
          <tr>
            <td style="padding: 14px 20px; border-bottom: 1px solid #1a1c20; font-size: 13px; color: #717784; text-transform: uppercase; letter-spacing: 0.05em;">Customer Name</td>
            <td style="padding: 14px 20px; border-bottom: 1px solid #1a1c20; font-size: 15px; color: #f5f2eb; font-weight: 500;">${request.customerName}</td>
          </tr>
          <tr>
            <td style="padding: 14px 20px; ${request.notes ? 'border-bottom: 1px solid #1a1c20;' : ''} font-size: 13px; color: #717784; text-transform: uppercase; letter-spacing: 0.05em;">Phone Number</td>
            <td style="padding: 14px 20px; ${request.notes ? 'border-bottom: 1px solid #1a1c20;' : ''} font-size: 16px; color: #4ade80; font-weight: 600; font-family: monospace;">
              <a href="tel:${request.phone.replace(/[^0-9+]/g, '')}" style="color: #4ade80; text-decoration: none;">${request.phone}</a>
            </td>
          </tr>
          ${request.notes ? `
          <tr>
            <td style="padding: 14px 20px; font-size: 13px; color: #717784; text-transform: uppercase; letter-spacing: 0.05em;">Notes</td>
            <td style="padding: 14px 20px; font-size: 14px; color: #d1d5db;">${request.notes}</td>
          </tr>
          ` : ''}
        </table>

        <!-- Quick Action Buttons -->
        <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
          <tr>
            <td style="border-radius: 6px; background-color: #25d366;">
              <a href="https://wa.me/${request.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${request.customerName}, thanks for your slot request for ${request.eventName} on ${request.date} with Kashinath Jale (JK Studio)!`)}" target="_blank" style="padding: 12px 20px; border-radius: 6px; font-size: 14px; color: #ffffff; text-decoration: none; font-weight: 600; display: inline-block;">
                💬 Message on WhatsApp
              </a>
            </td>
            <td style="width: 12px;"></td>
            <td style="border-radius: 6px; background-color: #c6a85e;">
              <a href="tel:${request.phone.replace(/[^0-9+]/g, '')}" style="padding: 12px 20px; border-radius: 6px; font-size: 14px; color: #000000; text-decoration: none; font-weight: 600; display: inline-block;">
                📞 Call Client
              </a>
            </td>
          </tr>
        </table>

        <p style="margin: 0; font-size: 12px; color: #64748b;">
          Submitted at: ${new Date(request.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  const logId = `email_${Date.now()}`;

  // Check if Resend API key is present
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'JK Studio <onboarding@resend.dev>',
          to: recipientEmail,
          subject,
          text: textContent,
          html: htmlContent,
        }),
      });

      if (res.ok) {
        emailLogs.push({
          id: logId,
          to: recipientEmail,
          subject,
          text: textContent,
          html: htmlContent,
          sentAt: new Date().toISOString(),
          status: 'SENT',
        });
        console.log(`[Email] Live email sent successfully to ${recipientEmail}`);
        return { success: true, mode: 'LIVE', logId };
      }
    } catch (err) {
      console.error('[Email] Failed to send via Resend, falling back to simulated log:', err);
    }
  }

  // Simulated email logging (development / default fallback)
  emailLogs.push({
    id: logId,
    to: recipientEmail,
    subject,
    text: textContent,
    html: htmlContent,
    sentAt: new Date().toISOString(),
    status: 'SIMULATED',
  });

  console.log(textContent);
  return { success: true, mode: 'SIMULATED', logId };
}
