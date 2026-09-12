import pb from '@/lib/pocketbaseClient';

export const generateCertificate = async (enrollment) => {
  try {
    const workshop = enrollment.expand?.workshop_id;
    const user = enrollment.expand?.user_id;
    const partner = workshop?.expand?.partner_id;

    if (!workshop || !user || !partner) {
      throw new Error('Missing required data for certificate generation');
    }

    const certificateCode = `GRC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const certificateData = {
      user_id: user.id,
      workshop_id: workshop.id,
      partner_id: partner.id,
      certificate_code: certificateCode,
      verified_count: 0
    };

    const certificate = await pb.collection('certificates').create(certificateData, { $autoCancel: false });

    return { success: true, certificate };
  } catch (error) {
    console.error('Certificate generation error:', error);
    return { success: false, error: error.message };
  }
};

export const generateCertificateHTML = (certificate) => {
  const workshop = certificate.expand?.workshop_id;
  const user = certificate.expand?.user_id;
  const partner = certificate.expand?.partner_id;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Certificate of Completion</title>
      <style>
        body {
          font-family: 'Georgia', serif;
          max-width: 800px;
          margin: 40px auto;
          padding: 40px;
          border: 8px double #1e40af;
          background: linear-gradient(to bottom, #ffffff, #f8fafc);
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        .logos {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 40px;
          margin-bottom: 30px;
        }
        .title {
          font-size: 36px;
          color: #1e40af;
          margin: 20px 0;
          font-weight: bold;
        }
        .subtitle {
          font-size: 18px;
          color: #64748b;
          margin-bottom: 40px;
        }
        .content {
          text-align: center;
          line-height: 2;
        }
        .recipient {
          font-size: 32px;
          font-weight: bold;
          color: #0f172a;
          margin: 20px 0;
          border-bottom: 2px solid #1e40af;
          display: inline-block;
          padding-bottom: 5px;
        }
        .workshop-title {
          font-size: 24px;
          color: #1e40af;
          margin: 20px 0;
          font-style: italic;
        }
        .footer {
          margin-top: 60px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .signature {
          text-align: center;
        }
        .signature-line {
          border-top: 2px solid #0f172a;
          width: 200px;
          margin: 10px auto;
        }
        .code {
          text-align: center;
          margin-top: 40px;
          font-size: 12px;
          color: #64748b;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logos">
          <div style="font-size: 48px; color: #1e40af;">🎓</div>
          <div style="font-size: 48px; color: #1e40af;">🏛️</div>
        </div>
        <div class="title">Certificate of Completion</div>
        <div class="subtitle">Global Research Centre</div>
      </div>
      
      <div class="content">
        <p>This is to certify that</p>
        <div class="recipient">${user?.name || 'Participant'}</div>
        <p>has successfully completed the workshop</p>
        <div class="workshop-title">${workshop?.title || 'Workshop'}</div>
        <p>in collaboration with</p>
        <p style="font-size: 20px; font-weight: bold; color: #0f172a;">${partner?.name || 'Partner University'}</p>
        <p style="margin-top: 30px;">Awarded on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      
      <div class="footer">
        <div class="signature">
          <div class="signature-line"></div>
          <p style="margin: 5px 0; font-weight: bold;">Director</p>
          <p style="margin: 0; font-size: 14px; color: #64748b;">Global Research Centre</p>
        </div>
        <div class="signature">
          <div class="signature-line"></div>
          <p style="margin: 5px 0; font-weight: bold;">Partner Representative</p>
          <p style="margin: 0; font-size: 14px; color: #64748b;">${partner?.name || 'Partner University'}</p>
        </div>
      </div>
      
      <div class="code">
        <p>Certificate Code: <strong>${certificate?.certificate_code}</strong></p>
        <p>Verify at: grc.com/verify-certificate</p>
      </div>
    </body>
    </html>
  `;

  return html;
};