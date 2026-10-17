/**
 * Nellai Nexus - Direct Brevo Email & WhatsApp Integration
 * Client-side direct dispatcher designed for static hosting (Cloudflare Pages)
 */
async function sendNellaiEnquiry(payload) {
  const apiKey = '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';
  // Use verified sender in Brevo to ensure 100% inbox delivery
  const senderEmail = 'nellainexus@gmail.com';
  const senderName = 'Nellai Nexus';
  const receivers = [
    { email: 'nellainexus@gmail.com', name: 'Nellai Nexus' }
  ];

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
      <div style="background: #16215c; color: #ffffff; padding: 20px; border-bottom: 4px solid #d81b60;">
        <h2 style="margin: 0; font-size: 22px; letter-spacing: 1px;">NELLAI NEXUS</h2>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #f472b6;">New Event Enquiry Received</p>
      </div>
      <div style="padding: 24px;">
        <p style="font-size: 14px; color: #334155; margin-top: 0;">A customer has submitted an event enquiry on <strong>nellainexus.in</strong>.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 18px 0; font-size: 13px;">
          <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; width: 35%;">Ref ID:</td><td style="padding: 10px; color: #d81b60; font-weight: bold; font-family: monospace;">${payload.refId}</td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Name:</td><td style="padding: 10px; font-weight: bold;">${payload.name}</td></tr>
          <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Phone:</td><td style="padding: 10px;"><a href="tel:${payload.phone}" style="color: #2563eb; font-weight: bold; text-decoration: none;">${payload.phone}</a></td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Service:</td><td style="padding: 10px; font-weight: bold;">${payload.service}</td></tr>
          <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Date:</td><td style="padding: 10px;">${payload.date}</td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Venue:</td><td style="padding: 10px;">${payload.venue}</td></tr>
          <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold;">Count:</td><td style="padding: 10px;">${payload.guests || 'N/A'}</td></tr>
          <tr><td style="padding: 10px; font-weight: bold;">Notes:</td><td style="padding: 10px;">${payload.notes || 'None'}</td></tr>
        </table>
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://wa.me/91${payload.phone}" style="background: #059669; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-size: 13px; font-weight: bold; display: inline-block;">Chat with Customer on WhatsApp</a>
        </div>
      </div>
      <div style="background: #f1f5f9; padding: 14px 24px; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
        196, SM Plaza, Tiruchendur Road, Samathanapuram, Palayamkottai - 627002. | Call: +91 96262 72817
      </div>
    </div>
  `;

  try {
    // Direct Brevo REST API dispatch with verified sender
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: receivers,
        replyTo: { email: senderEmail, name: payload.name },
        subject: `New Event Enquiry [${payload.refId}]: ${payload.service} - ${payload.name}`,
        htmlContent: htmlBody
      })
    });

    const resData = await response.json();
    console.log('Brevo Mail Dispatch:', resData);
    return resData;
  } catch (err) {
    console.log('Brevo direct notice:', err);
  }
}
