const logoUrl =
  "https://f003.backblazeb2.com/file/combattix-media/Asset+2+1.png";
const backgroundUrl =
  "https://f003.backblazeb2.com/file/combattix-media/Wave+SVG.png";
const facebookUrl =
  "https://f003.backblazeb2.com/file/combattix-media/facebookicon.png";
const youtubeUrl =
  "https://f003.backblazeb2.com/file/combattix-media/youtubeicon.png";
const twitterUrl =
  "https://f003.backblazeb2.com/file/combattix-media/twittericon.png";
const tiktokUrl =
  "https://f003.backblazeb2.com/file/combattix-media/tittokicon.png";
const instagramUrl =
  "https://f003.backblazeb2.com/file/combattix-media/instagrsamicon.png";
const combatLogoUrl =
  "https://f003.backblazeb2.com/file/combattix-media/logocombat.png";

export const emailTemplates = {
  verificationEmail: (user, verificationCode) => `
  <div style="background: url('${backgroundUrl}') no-repeat center center; 
            background-size: cover; 
            padding: 40px; 
            font-family: 'Poppins', Arial, sans-serif; 
            max-width: 800px; 
            margin: auto; 
            color: #404040; 
            border-radius: 10px;">

  <style>
    @media screen and (max-width: 600px) {
      .email-container {
        padding: 20px !important; /* Override padding for mobile */
      }
    }
  </style>

  <div class="email-container" style="padding: 50px 150px; border-radius: 10px; font-family: 'Poppins', Arial, sans-serif;">
    
    <div style="text-align: center;">
      <img src="${logoUrl}" alt="Combat Tix Logo" style="width: 150px; margin-bottom: 30px;">
    </div>

    <p style="font-weight: 400;">Hi ${user.firstName || "User"},</p>
    <p style="font-weight: 400;">Welcome to Combat Tix!</p>
    <p style="font-weight: 400; margin-top: 24px;">
      You’re on your way to selling tickets, growing your audience, and managing event sales seamlessly.
    </p>

    <p style="font-weight: 400; margin-top: 24px;">
      To activate your account, please verify your email by entering the following code on the verification page:
    </p>

    <div style="display: flex; justify-content: center; align-items: center; font-size: 16px; font-weight: bold; gap: 10px; margin-top: 15px;">
      ${verificationCode
        .split("")
        .map(
          (digit) =>
            `<span style="background: #fff; 
                          padding: 15px 20px;
                          margin: 10px;
                          border-radius: 12px; 
                          display: inline-block;
                          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                          font-family: 'Poppins', sans-serif;
                          color: #E40000;
                          text-align: center;">
              ${digit}
            </span>`
        )
        .join("")}
    </div>

    <p style="margin-top: 24px; font-weight: 400;">
      This code will expire in 10 minutes. If you didn’t sign up, please ignore this email.
    </p>
    <p style="font-weight: 400;">Best,<br>The Combat Tix Team</p>

    <hr style="margin: 20px 0; border: none; border-top: 1px solid #D9D9D9;">

    <div style="text-align: center;">
      <img src="${combatLogoUrl}" alt="Combat Tix Logo" style="width: 32px; margin-bottom: 24px; margin-top: 88px;">
    </div>

    <p style="text-align: center; font-size: 14px; color: #595959; font-weight: 300; max-width: 440px; margin: 0 auto;">
      Need help? Contact our support team at 
      <a href="mailto:${
        process.env.SUPPORT_EMAIL
      }" style="color: #ff3b30; text-decoration: none;">
        ${process.env.SUPPORT_EMAIL}
      </a>.
    </p>

    <p style="text-align: center; font-size: 14px; color: #595959; font-weight: 300; margin-top: 24px;">Follow us on:</p>

    <div style="text-align: center; margin-top: 20px;">
      <a href="#"><img src="${facebookUrl}" alt="Facebook" style="width: 16px; margin: 0 15px;"></a>
      <a href="#"><img src="${twitterUrl}" alt="Twitter" style="width: 16px; margin: 0 15px;"></a>
      <a href="#"><img src="${instagramUrl}" alt="Instagram" style="width: 16px; margin: 0 15px;"></a>
      <a href="#"><img src="${youtubeUrl}" alt="YouTube" style="width: 16px; margin: 0 15px;"></a>
      <a href="#"><img src="${tiktokUrl}" alt="TikTok" style="width: 16px; margin: 0 15px;"></a>
    </div>

    <div style="max-width: 500px; text-align: center; margin: 20px auto;">
      <p style="text-align: center; font-size: 14px; color: #404040; font-weight: 7 00; margin-top: 10px;">
        <strong>Combat Tix Ltd</strong>
      </p>
      <p style="text-align: center; font-size: 14px; color: #404040; font-weight: 300; margin-top: 10px;">
        Registered Address: 128 City Road, London, United Kingdom, EC1V 2NX 
        <strong>Company No: 16222156</strong>
      </p>
    </div>

    <hr style="margin: 20px 0; border: none; border-top: 1px solid #D9D9D9;">

    <div style="max-width: 500px; text-align: center; margin: 48px auto;">
      <p style="font-size: 14px; color: #404040; font-weight: 300;">
        This is an automated email—please do not reply. If you need assistance, contact our support team.
      </p>
      <p style="text-align: center; font-size: 14px; font-weight: 600; margin-top: 10px;">
        <a href="#" style="color: #ff3b30; text-decoration: none;">Privacy Policy</a> | 
        <a href="#" style="color: #ff3b30; text-decoration: none;">Terms of Service</a> | 
        <a href="#" style="color: #ff3b30; text-decoration: none;">Help Centre</a>
      </p>
    </div>
  </div>
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
   <div style="background: url('${backgroundUrl}') no-repeat center center; 
            background-size: cover; 
            padding: 40px; 
            font-family: 'Poppins', Arial, sans-serif; 
            max-width: 800px; 
            margin: auto; 
            color: #404040; 
            border-radius: 10px;">

  <style>
    @media screen and (max-width: 600px) {
      .email-container {
        padding: 20px !important; /* Override padding for mobile */
      }
    }
  </style>

  <div class="email-container" style="padding: 50px 150px; border-radius: 10px; font-family: 'Poppins', Arial, sans-serif;">
    
    <div style="text-align: center;">
      <img src="${logoUrl}" alt="Combat Tix Logo" style="width: 150px; margin-bottom: 30px;">
    </div>

    <p style="font-weight: 400;">Hi ${user.firstName || "User"},</p>
    <p style="font-weight: 400;">Your email has been successfully verified! You’re now ready to complete your profile and explore upcoming events. </p>
    <p style="font-weight: 500; margin-top: 24px;">
      <strong>Next Step: Complete Your Profile</strong>
    </p>

    <div style=" margin-top: 24px;">
        <a href="${process.env.FRONTEND_URL}/complete-profile" 
           style="background: linear-gradient(to bottom, #FD0000, #E40000); 
                  padding: 14px 30px; 
                  border-radius: 30px; 
                  color: white; 
                  text-decoration: none; 
                  font-weight: bold; 
                  font-size: 16px; 
                  display: inline-block;">
          Complete my Profile
        </a>
      </div>

    <p style="margin-top: 24px; font-weight: 400;">
      For security reasons, this link will expire in 10 minutes. If you didn’t request a password reset, please ignore this email.    </p>
    <p style="font-weight: 400;">Best,<br>The Combat Tix Team</p>

    <hr style="margin: 20px 0; border: none; border-top: 1px solid #D9D9D9;">

    <div style="text-align: center;">
      <img src="${combatLogoUrl}" alt="Combat Tix Logo" style="width: 32px; margin-bottom: 24px; margin-top: 88px;">
    </div>

    <p style="text-align: center; font-size: 14px; color: #595959; font-weight: 300; max-width: 440px; margin: 0 auto;">
      Need help? Contact our support team at 
      <a href="mailto:${
        process.env.SUPPORT_EMAIL
      }" style="color: #ff3b30; text-decoration: none;">
        ${process.env.SUPPORT_EMAIL}
      </a>.
    </p>

    <p style="text-align: center; font-size: 14px; color: #595959; font-weight: 300; margin-top: 24px;">Follow us on:</p>

    <div style="text-align: center; margin-top: 20px;">
      <a href="#"><img src="${facebookUrl}" alt="Facebook" style="width: 16px; margin: 0 15px;"></a>
      <a href="#"><img src="${twitterUrl}" alt="Twitter" style="width: 16px; margin: 0 15px;"></a>
      <a href="#"><img src="${instagramUrl}" alt="Instagram" style="width: 16px; margin: 0 15px;"></a>
      <a href="#"><img src="${youtubeUrl}" alt="YouTube" style="width: 16px; margin: 0 15px;"></a>
      <a href="#"><img src="${tiktokUrl}" alt="TikTok" style="width: 16px; margin: 0 15px;"></a>
    </div>

    <div style="max-width: 500px; text-align: center; margin: 20px auto;">
      <p style="text-align: center; font-size: 14px; color: #404040; font-weight: 7 00; margin-top: 10px;">
        <strong>Combat Tix Ltd</strong>
      </p>
      <p style="text-align: center; font-size: 14px; color: #404040; font-weight: 300; margin-top: 10px;">
        Registered Address: 128 City Road, London, United Kingdom, EC1V 2NX 
        <strong>Company No: 16222156</strong>
      </p>
    </div>

    <hr style="margin: 20px 0; border: none; border-top: 1px solid #D9D9D9;">

    <div style="max-width: 500px; text-align: center; margin: 48px auto;">
      <p style="font-size: 14px; color: #404040; font-weight: 300;">
        This is an automated email—please do not reply. If you need assistance, contact our support team.
      </p>
      <p style="text-align: center; font-size: 14px; font-weight: 600; margin-top: 10px;">
        <a href="#" style="color: #ff3b30; text-decoration: none;">Privacy Policy</a> | 
        <a href="#" style="color: #ff3b30; text-decoration: none;">Terms of Service</a> | 
        <a href="#" style="color: #ff3b30; text-decoration: none;">Help Centre</a>
      </p>
    </div>
  </div>
</div>
   
  `,

  passwordReset: (user, resetCode) => `
    <div style="background: url('${backgroundUrl}') no-repeat center center; 
            background-size: cover; 
            padding: 40px; 
            font-family: 'Poppins', Arial, sans-serif; 
            max-width: 800px; 
            margin: auto; 
            color: #404040; 
            border-radius: 10px;">

  <style>
    @media screen and (max-width: 600px) {
      .email-container {
        padding: 20px !important; /* Override padding for mobile */
      }
    }
  </style>

  <div class="email-container" style="padding: 50px 150px; border-radius: 10px; font-family: 'Poppins', Arial, sans-serif;">
    
    <div style="text-align: center;">
      <img src="${logoUrl}" alt="Combat Tix Logo" style="width: 150px; margin-bottom: 30px;">
    </div>

    <p style="font-weight: 400;">Hi ${user.firstName || "User"},</p>
    <p style="font-weight: 400;">We received a request to reset the password for your Combat Tix account. </p>
    <p style="font-weight: 400; margin-top: 24px;">
      Click the button below to set a new password: 
    </p>

    <div style=" margin-top: 24px;">
        <a href="${resetCode}" 
           style="background: linear-gradient(to bottom, #FD0000, #E40000); 
                  padding: 14px 30px; 
                  border-radius: 30px; 
                  color: white; 
                  text-decoration: none; 
                  font-weight: bold; 
                  font-size: 16px; 
                  display: inline-block;">
          Reset Password
        </a>
      </div>

    <p style="margin-top: 24px; font-weight: 400;">
      For security reasons, this link will expire in 10 minutes. If you didn’t request a password reset, please ignore this email.    </p>
    <p style="font-weight: 400;">Best,<br>The Combat Tix Team</p>

    <hr style="margin: 20px 0; border: none; border-top: 1px solid #D9D9D9;">

    <div style="text-align: center;">
      <img src="${combatLogoUrl}" alt="Combat Tix Logo" style="width: 32px; margin-bottom: 24px; margin-top: 88px;">
    </div>

    <p style="text-align: center; font-size: 14px; color: #595959; font-weight: 300; max-width: 440px; margin: 0 auto;">
      Need help? Contact our support team at 
      <a href="mailto:${
        process.env.SUPPORT_EMAIL
      }" style="color: #ff3b30; text-decoration: none;">
        ${process.env.SUPPORT_EMAIL}
      </a>.
    </p>

    <p style="text-align: center; font-size: 14px; color: #595959; font-weight: 300; margin-top: 24px;">Follow us on:</p>

    <div style="text-align: center; margin-top: 20px;">
      <a href="#"><img src="${facebookUrl}" alt="Facebook" style="width: 16px; margin: 0 15px;"></a>
      <a href="#"><img src="${twitterUrl}" alt="Twitter" style="width: 16px; margin: 0 15px;"></a>
      <a href="#"><img src="${instagramUrl}" alt="Instagram" style="width: 16px; margin: 0 15px;"></a>
      <a href="#"><img src="${youtubeUrl}" alt="YouTube" style="width: 16px; margin: 0 15px;"></a>
      <a href="#"><img src="${tiktokUrl}" alt="TikTok" style="width: 16px; margin: 0 15px;"></a>
    </div>

    <div style="max-width: 500px; text-align: center; margin: 20px auto;">
      <p style="text-align: center; font-size: 14px; color: #404040; font-weight: 7 00; margin-top: 10px;">
        <strong>Combat Tix Ltd</strong>
      </p>
      <p style="text-align: center; font-size: 14px; color: #404040; font-weight: 300; margin-top: 10px;">
        Registered Address: 128 City Road, London, United Kingdom, EC1V 2NX 
        <strong>Company No: 16222156</strong>
      </p>
    </div>

    <hr style="margin: 20px 0; border: none; border-top: 1px solid #D9D9D9;">

    <div style="max-width: 500px; text-align: center; margin: 48px auto;">
      <p style="font-size: 14px; color: #404040; font-weight: 300;">
        This is an automated email—please do not reply. If you need assistance, contact our support team.
      </p>
      <p style="text-align: center; font-size: 14px; font-weight: 600; margin-top: 10px;">
        <a href="#" style="color: #ff3b30; text-decoration: none;">Privacy Policy</a> | 
        <a href="#" style="color: #ff3b30; text-decoration: none;">Terms of Service</a> | 
        <a href="#" style="color: #ff3b30; text-decoration: none;">Help Centre</a>
      </p>
    </div>
  </div>
</div>
  `,

  passwordResetSuccess: (user) => `
    <div style="background: url('${backgroundUrl}') no-repeat center center; 
            background-size: cover; 
            padding: 40px; 
            font-family: 'Poppins', Arial, sans-serif; 
            max-width: 800px; 
            margin: auto; 
            color: #404040; 
            border-radius: 10px;">

  <style>
    @media screen and (max-width: 600px) {
      .email-container {
        padding: 20px !important; /* Override padding for mobile */
      }
    }
  </style>

  <div class="email-container" style="padding: 50px 150px; border-radius: 10px; font-family: 'Poppins', Arial, sans-serif;">
    
    <div style="text-align: center;">
      <img src="${logoUrl}" alt="Combat Tix Logo" style="width: 150px; margin-bottom: 30px;">
    </div>

    <p style="font-weight: 400;">Hi ${user.firstName || "User"},</p>
    <p style="font-weight: 400;">Your Combat Tix password has been successfully reset. You can now log in with your new password. </p>
    <p style="font-weight: 500; margin-top: 24px;"><strong>For security reasons, we recommend that you:  </strong>
  </p>

 <ul style="list-style: none; padding: 0; margin-top: 16px;">
        <li style="display: flex; align-items: center; margin-bottom: 8px;">
          <img src="https://f003.backblazeb2.com/file/combattix-media/password.png" 
               alt="Strong Password" 
               style="width: 20px; height: 20px; margin-right: 10px;">
          Use a strong and unique password.
        </li>
        <li style="display: flex; align-items: center; margin-bottom: 8px;">
          <img src="https://f003.backblazeb2.com/file/combattix-media/teenyicons_password-outline.png" 
               alt="Do not share password" 
               style="width: 20px; height: 20px; margin-right: 10px;">
          Never share your password with anyone.
        </li>
        <li style="display: flex; align-items: center; margin-bottom: 8px;">
          <img src="https://f003.backblazeb2.com/file/combattix-media/mdi_email-lock-outline.png" 
               alt="Phishing Warning" 
               style="width: 20px; height: 20px; margin-right: 10px;">
          Be cautious of phishing emails—Combat Tix will never ask for your password via email.
        </li>
      </ul>

    <p style="font-weight: 400;">Best,<br>The Combat Tix Team</p>

    <hr style="margin: 20px 0; border: none; border-top: 1px solid #D9D9D9;">

    <div style="text-align: center;">
      <img src="${combatLogoUrl}" alt="Combat Tix Logo" style="width: 32px; margin-bottom: 24px; margin-top: 88px;">
    </div>

    <p style="text-align: center; font-size: 14px; color: #595959; font-weight: 300; max-width: 440px; margin: 0 auto;">
      Need help? Contact our support team at 
      <a href="mailto:${
        process.env.SUPPORT_EMAIL
      }" style="color: #ff3b30; text-decoration: none;">
        ${process.env.SUPPORT_EMAIL}
      </a>.
    </p>

    <p style="text-align: center; font-size: 14px; color: #595959; font-weight: 300; margin-top: 24px;">Follow us on:</p>

    <div style="text-align: center; margin-top: 20px;">
      <a href="#"><img src="${facebookUrl}" alt="Facebook" style="width: 16px; margin: 0 15px;"></a>
      <a href="#"><img src="${twitterUrl}" alt="Twitter" style="width: 16px; margin: 0 15px;"></a>
      <a href="#"><img src="${instagramUrl}" alt="Instagram" style="width: 16px; margin: 0 15px;"></a>
      <a href="#"><img src="${youtubeUrl}" alt="YouTube" style="width: 16px; margin: 0 15px;"></a>
      <a href="#"><img src="${tiktokUrl}" alt="TikTok" style="width: 16px; margin: 0 15px;"></a>
    </div>

    <div style="max-width: 500px; text-align: center; margin: 20px auto;">
      <p style="text-align: center; font-size: 14px; color: #404040; font-weight: 7 00; margin-top: 10px;">
        <strong>Combat Tix Ltd</strong>
      </p>
      <p style="text-align: center; font-size: 14px; color: #404040; font-weight: 300; margin-top: 10px;">
        Registered Address: 128 City Road, London, United Kingdom, EC1V 2NX 
        <strong>Company No: 16222156</strong>
      </p>
    </div>

    <hr style="margin: 20px 0; border: none; border-top: 1px solid #D9D9D9;">

    <div style="max-width: 500px; text-align: center; margin: 48px auto;">
      <p style="font-size: 14px; color: #404040; font-weight: 300;">
        This is an automated email—please do not reply. If you need assistance, contact our support team.
      </p>
      <p style="text-align: center; font-size: 14px; font-weight: 600; margin-top: 10px;">
        <a href="#" style="color: #ff3b30; text-decoration: none;">Privacy Policy</a> | 
        <a href="#" style="color: #ff3b30; text-decoration: none;">Terms of Service</a> | 
        <a href="#" style="color: #ff3b30; text-decoration: none;">Help Centre</a>
      </p>
    </div>
  </div>
</div>
  `,
};
