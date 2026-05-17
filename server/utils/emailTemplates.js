const getOtpTemplate = (otp) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
  <div style="text-align: center; margin-bottom: 20px;">
    <h2 style="color: #1e3a8a; margin: 0;">Career Grid</h2>
  </div>
  <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
    <h3 style="color: #333333; margin-top: 0;">Verify Your Email Address</h3>
    <p style="color: #555555; font-size: 16px; line-height: 1.5;">
      Thank you for registering with Career Grid. To complete your registration and verify your email address, please use the following One-Time Password (OTP):
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="display: inline-block; font-size: 32px; font-weight: bold; color: #1e3a8a; letter-spacing: 5px; padding: 15px 30px; background-color: #f0f4f8; border-radius: 8px; border: 2px dashed #1e3a8a;">
        ${otp}
      </span>
    </div>
    <p style="color: #555555; font-size: 14px; line-height: 1.5;">
      This OTP is valid for <strong>10 minutes</strong>. If you did not request this verification, please ignore this email.
    </p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888888; font-size: 12px;">
    <p>&copy; ${new Date().getFullYear()} Career Grid. All rights reserved.</p>
  </div>
</div>
`;

const getJobseekerWelcomeTemplate = (name) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
  <div style="text-align: center; margin-bottom: 20px;">
    <h2 style="color: #1e3a8a; margin: 0;">Career Grid</h2>
  </div>
  <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
    <h3 style="color: #333333; margin-top: 0;">Welcome, ${name}! 🎉</h3>
    <p style="color: #555555; font-size: 16px; line-height: 1.5;">
      Your account has been successfully verified. We are thrilled to have you join our platform.
    </p>
    <p style="color: #555555; font-size: 16px; line-height: 1.5;">
      You can now start applying for jobs, building your professional profile, and taking the next big step in your career.
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/jobs" style="display: inline-block; padding: 12px 24px; background-color: #1e3a8a; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 5px;">
        Explore Jobs Now
      </a>
    </div>
    <p style="color: #555555; font-size: 14px; line-height: 1.5;">
      Best Regards,<br/>
      <strong>The Career Grid Team</strong>
    </p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888888; font-size: 12px;">
    <p>&copy; ${new Date().getFullYear()} Career Grid. All rights reserved.</p>
  </div>
</div>
`;

const getOrgWelcomeTemplate = (name) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
  <div style="text-align: center; margin-bottom: 20px;">
    <h2 style="color: #1e3a8a; margin: 0;">Career Grid</h2>
  </div>
  <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
    <h3 style="color: #333333; margin-top: 0;">Account Approved! ✅</h3>
    <p style="color: #555555; font-size: 16px; line-height: 1.5;">
      Hi ${name},
    </p>
    <p style="color: #555555; font-size: 16px; line-height: 1.5;">
      Great news! Your organisation account on Career Grid has been reviewed and approved by our admin team.
    </p>
    <p style="color: #555555; font-size: 16px; line-height: 1.5;">
      You can now log in to your dashboard to start posting job opportunities and discovering top talent.
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #1e3a8a; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 5px;">
        Go to Dashboard
      </a>
    </div>
    <p style="color: #555555; font-size: 14px; line-height: 1.5;">
      Best Regards,<br/>
      <strong>The Career Grid Team</strong>
    </p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888888; font-size: 12px;">
    <p>&copy; ${new Date().getFullYear()} Career Grid. All rights reserved.</p>
  </div>
</div>
`;

module.exports = {
  getOtpTemplate,
  getJobseekerWelcomeTemplate,
  getOrgWelcomeTemplate
};
