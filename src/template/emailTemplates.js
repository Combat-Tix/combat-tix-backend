const logoUrl =
  "https://f003.backblazeb2.com/file/combattix-media/Asset+2+1.png";

export const emailTemplates = {
  verificationEmail: (user, verificationCode) => `
    <div style="">
      <img src="${logoUrl}" alt="Combat Tix Logo" style="width: 150px; margin-bottom: 20px;">
      <p>Hi ${user.firstName || "User"},</p>
      <p>Welcome to <strong>Combat Tix</strong>! You're just one step away from accessing your tickets and event dashboard.</p>
      <p>To get started, please verify your email by entering the following code on the verification page:</p>
      <p><strong>${verificationCode}</strong></p>
      <p>This code will expire in <strong>10 minutes</strong>. If you didn’t create an account, you can ignore this email.</p>
      <p>Need help? Contact us at <a href="mailto:${
        process.env.SUPPORT_EMAIL
      }">${process.env.SUPPORT_EMAIL}</a>.</p>
      <p>Best,<br>The <strong>Combat Tix</strong> Team</p>
    </div>
  `,

  resendVerificationEmail: (user, verificationCode) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.5;">
    <h2 style="color: #333;">Hello ${user.firstName || "User"},</h2>
    <p>You requested a new verification code. Use the code below to verify your email:</p>
    <h3 style="color: #007BFF;">${verificationCode}</h3>
    <p>This code will expire in 10 minutes.</p>
    <p>If you didn't request this, you can ignore this email.</p>
    <p>Thanks,<br>Combat Tix Team</p>
  </div>
`,

  emailVerified: (user) => `
    <div style="">
      <img src="${logoUrl}" alt="Combat Tix Logo" style="width: 150px; margin-bottom: 20px;">
      <p>Hi ${user.firstName || "User"},</p>
      <p>Your email has been successfully verified! You’re now ready to complete your profile and explore upcoming events.</p>
      <p>👉 <strong>Next Step:</strong> <a href="${
        process.env.FRONTEND_URL
      }/complete-profile">Complete Your Profile</a></p>
      <p>If you need assistance, our support team is here to help at <a href="mailto:${
        process.env.SUPPORT_EMAIL
      }">${process.env.SUPPORT_EMAIL}</a>.</p>
      <p>Best,<br>The <strong>Combat Tix</strong> Team</p>
    </div>
  `,

  passwordReset: (user, resetCode) => `
    <div style="">
      <img src="${logoUrl}" alt="Combat Tix Logo" style="width: 150px; margin-bottom: 20px;">
      <p>Hi ${user.firstName || "User"},</p>
      <p>We received a request to reset your password for your <strong>Combat Tix</strong> account. Enter the following code to reset your password:</p>
      <p><strong>${resetCode}</strong></p>
      <p>For security reasons, this code will expire in <strong>10 minutes</strong>. If you didn’t request a password reset, please ignore this email.</p>
      <p>Need help? Contact our support team at <a href="mailto:${
        process.env.SUPPORT_EMAIL
      }">${process.env.SUPPORT_EMAIL}</a>.</p>
      <p>Best,<br>The <strong>Combat Tix</strong> Team</p>
    </div>
  `,

  passwordResetSuccess: (user) => `
    <div style="">
      <img src="${logoUrl}" alt="Combat Tix Logo" style="width: 150px; margin-bottom: 20px;">
      <p>Hi ${user.firstName || "User"},</p>
      <p>Your <strong>Combat Tix</strong> password has been successfully reset. You can now log in with your new password.</p>
      <p>For security reasons, we recommend that you:</p>
      <ul style="text-align: left; display: inline-block;">
        <li>Use a strong and unique password.</li>
        <li>Never share your password with anyone.</li>
        <li>Enable two-factor authentication (if available) for extra security.</li>
      </ul>
      <p>If you didn’t reset your password, please contact us immediately at <a href="mailto:${
        process.env.SUPPORT_EMAIL
      }">${process.env.SUPPORT_EMAIL}</a>.</p>
      <p>Best,<br>The <strong>Combat Tix</strong> Team</p>
    </div>
  `,
};
