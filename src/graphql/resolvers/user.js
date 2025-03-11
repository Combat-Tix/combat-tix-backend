import User from "../../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import { GraphQLError } from "graphql";
import { emailTemplates } from "../../template/emailTemplates.js";
import rateLimit from "express-rate-limit";

// Rate limiter for password reset
const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 requests per windowMs
  message: "Too many password reset requests. Please try again later.",
});

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const twilioClient = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// Generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "30min" }
  );
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await User.findByIdAndUpdate(userId, { refreshToken });
};

const verificationCodes = new Map();
const resetCodes = new Map();

export const resolvers = {
  Mutation: {
    async registerUser(_, args) {
      try {
        const { email, password, role, ...profileData } = args;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new GraphQLError("Email already in use.", {
            extensions: { code: "BAD_USER_INPUT", http: { status: 400 } },
          });
        }

        // Create the user (password will be hashed by the pre-save hook)
        const user = new User({
          ...profileData,
          email,
          password, // Pass the plain text password here
          role,
          emailIsVerified: false,
        });

        await user.save(); // This will trigger the pre-save hook to hash the password

        // Generate a 4-digit verification code
        const verificationCode = Math.floor(
          1000 + Math.random() * 9000
        ).toString();
        const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes from now

        // Store OTP with expiry time
        verificationCodes.set(email, {
          code: verificationCode,
          expiresAt: expiryTime,
        });

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user);
        await storeRefreshToken(user.id, refreshToken);

        // Send the verification email
        const msg = {
          to: email,
          from: process.env.SENDGRID_SENDER_EMAIL,
          subject: "Welcome to Combat Tix – Confirm Your Email",
          html: emailTemplates.verificationEmail(user, verificationCode),
        };
        await sgMail.send(msg);

        return {
          message: "User registered. Please verify your email.",
          accessToken,
          refreshToken,
        };
      } catch (error) {
        console.error("Registration error:", error);
        throw new GraphQLError("Registration failed.", {
          extensions: { code: "INTERNAL_SERVER_ERROR", http: { status: 500 } },
        });
      }
    },

    async verifyEmail(_, { email, code }) {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new GraphQLError("User not found.", {
            extensions: { code: "BAD_USER_INPUT", http: { status: 404 } },
          });
        }

        if (user.emailIsVerified) {
          throw new GraphQLError("Email is already verified.", {
            extensions: { code: "BAD_USER_INPUT", http: { status: 400 } },
          });
        }

        const storedData = verificationCodes.get(email);
        if (!storedData) {
          throw new GraphQLError(
            "No verification code found. Request a new one.",
            {
              extensions: { code: "BAD_USER_INPUT", http: { status: 400 } },
            }
          );
        }

        const { code: storedCode, expiresAt } = storedData;

        // Check if the OTP has expired
        if (Date.now() > expiresAt) {
          verificationCodes.delete(email); // Remove expired OTP
          throw new GraphQLError(
            "Verification code has expired. Request a new one.",
            {
              extensions: { code: "BAD_USER_INPUT", http: { status: 400 } },
            }
          );
        }

        if (storedCode !== code) {
          throw new GraphQLError("Invalid verification code.", {
            extensions: { code: "BAD_USER_INPUT", http: { status: 400 } },
          });
        }

        // Mark email as verified
        user.emailIsVerified = true;
        await user.save();

        // Remove used verification code
        verificationCodes.delete(email);

        const msg = {
          to: email,
          from: process.env.SENDGRID_SENDER_EMAIL,
          subject: "Your Combat Tix Email is Verified!",
          html: emailTemplates.emailVerified(user),
        };
        await sgMail.send(msg);

        return { message: "Email verified successfully." };
      } catch (error) {
        console.error("Email verification error:", error);
        throw new GraphQLError(error.message, {
          extensions: { code: "INTERNAL_SERVER_ERROR", http: { status: 500 } },
        });
      }
    },

    async resendVerificationCode(_, { email }) {
      try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
          throw new GraphQLError("User not found.", {
            extensions: { code: "BAD_USER_INPUT", http: { status: 404 } },
          });
        }

        // Check if email is already verified
        if (user.emailIsVerified) {
          throw new GraphQLError("Email is already verified.", {
            extensions: { code: "BAD_USER_INPUT", http: { status: 400 } },
          });
        }

        // Generate a new OTP
        const newVerificationCode = Math.floor(
          1000 + Math.random() * 9000
        ).toString();
        const newExpiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes from now

        // Store new OTP and expiry
        verificationCodes.set(email, {
          code: newVerificationCode,
          expiresAt: newExpiryTime,
        });

        // Send the new OTP via email
        const msg = {
          to: email,
          from: process.env.SENDGRID_SENDER_EMAIL,
          subject: "New Verification Code – Combat Tix",
          html: emailTemplates.verificationEmail(user, newVerificationCode),
        };
        await sgMail.send(msg);

        return {
          message: "A new verification code has been sent to your email.",
        };
      } catch (error) {
        console.error("Resend OTP error:", error);
        throw new GraphQLError("Failed to resend verification code.", {
          extensions: { code: "INTERNAL_SERVER_ERROR", http: { status: 500 } },
        });
      }
    },

    async loginUser(_, { email, password }, { res }) {
      const user = await User.findOne({ email });
      if (!user) {
        throw new GraphQLError("User not found.", {
          extensions: { code: "BAD_USER_INPUT", http: { status: 400 } },
        });
      }

      if (!user.emailIsVerified) {
        throw new GraphQLError("Email not verified.", {
          extensions: { code: "UNAUTHORIZED", http: { status: 401 } },
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new GraphQLError("Invalid credentials.", {
          extensions: { code: "UNAUTHORIZED", http: { status: 401 } },
        });
      }

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(user);
      await storeRefreshToken(user.id, refreshToken);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure in production
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return { accessToken, refreshToken, user };
    },

    async refreshToken(_, __, { req, res }) {
      try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
          throw new GraphQLError("No refresh token provided", {
            extensions: { code: "UNAUTHORIZED" },
          });
        }

        // Verify the refresh token
        const decoded = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET
        );
        const user = await User.findById(decoded.id);

        if (!user || user.blacklistedTokens.includes(refreshToken)) {
          throw new GraphQLError("Invalid or expired refresh token", {
            extensions: { code: "UNAUTHORIZED" },
          });
        }

        // Generate new tokens
        const { accessToken, refreshToken: newRefreshToken } =
          generateTokens(user);

        // Update stored refresh token
        user.refreshToken = newRefreshToken;
        await user.save();

        // Update refresh token cookie
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { accessToken, user };
      } catch (error) {
        throw new GraphQLError("Failed to refresh token", {
          extensions: { code: "UNAUTHORIZED" },
        });
      }
    },

    async logout(_, __, { req, res }) {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new GraphQLError("No refresh token provided", {
          extensions: { code: "UNAUTHORIZED" },
        });
      }

      // Find user and blacklist the refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.id);

      if (user) {
        user.blacklistedTokens.push(refreshToken);
        await user.save();
      }

      // Clear refresh token cookie
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      return { message: "Logged out successfully" };
    },

    async updateUserProfile(_, args, { user }) {
      if (!user) {
        throw new GraphQLError("Not authenticated.", {
          extensions: { code: "UNAUTHORIZED", http: { status: 401 } },
        });
      }

      const updatedUser = await User.findByIdAndUpdate(user.id, args, {
        new: true,
      });

      // Send the profile completion email
      const msg = {
        to: updatedUser.email,
        from: process.env.SENDGRID_SENDER_EMAIL,
        subject: `Welcome to Combat Tix, ${updatedUser.firstName}!`,
        html: `
          <p>Hi ${updatedUser.firstName},</p>
          <p>Congratulations! You’ve successfully set up your <strong>Combat Tix</strong> account.</p>
          <p>🎟 <strong>You can now:</strong></p>
          <ul>
            <li>Easily manage all your tickets in one place</li>
            <li>Discover and book the hottest combat events</li>
            <li>Support your favorite fighters</li>
          </ul>
          <p>Click below to explore upcoming events and get started!</p>
          <p><a href="${process.env.FRONTEND_URL}/events">Explore Events</a></p>
          <p>Thank you for joining us—see you at the fights! 💥</p>
          <p>Best,<br>The <strong>Combat Tix</strong> Team</p>
        `,
      };
      await sgMail.send(msg);

      return updatedUser;
    },

    async requestPasswordReset(_, { email, phoneNumber }, { req }) {
      const user = await User.findOne({ $or: [{ email }, { phoneNumber }] });
      if (!user) {
        throw new GraphQLError("User not found.", {
          extensions: { code: "BAD_USER_INPUT", http: { status: 400 } },
        });
      }

      if (email) {
        // Generate a JWT token for the magic link
        const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "15m",
        });

        // Send the magic link via email
        const magicLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        const msg = {
          to: email,
          from: process.env.SENDGRID_SENDER_EMAIL,
          subject: "Password Reset Request - Combat Tix",
          html: emailTemplates.passwordResetMagicLink(user, magicLink),
        };
        await sgMail.send(msg);

        return { message: "Password reset magic link sent successfully." };
      }

      if (phoneNumber) {
        // Generate a 4-digit OTP
        const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
        resetCodes.set(phoneNumber, resetCode);

        // Send the OTP via SMS
        await twilioClient.messages.create({
          body: `Your Combat Tix password reset code is: ${resetCode}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phoneNumber,
        });

        return { message: "Password reset OTP sent successfully." };
      }

      throw new GraphQLError(
        "Please provide either an email or phone number.",
        {
          extensions: { code: "BAD_USER_INPUT", http: { status: 400 } },
        }
      );
    },

    async resetPassword(_, { email, phoneNumber, code, newPassword, token }) {
      if (token) {
        // Handle magic link reset
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await User.findById(decoded.id);

          if (!user) {
            throw new GraphQLError("Invalid or expired token.", {
              extensions: { code: "BAD_USER_INPUT", http: { status: 400 } },
            });
          }

          const hashedPassword = await bcrypt.hash(newPassword, 10);
          await User.findByIdAndUpdate(user.id, { password: hashedPassword });

          // Send the password reset confirmation email
          const msg = {
            to: user.email,
            from: process.env.SENDGRID_SENDER_EMAIL,
            subject: "Password Reset Successful - Combat Tix",
            html: emailTemplates.passwordResetSuccess(user),
          };
          await sgMail.send(msg);

          return { message: "Password reset successfully." };
        } catch (error) {
          throw new GraphQLError("Invalid or expired token.", {
            extensions: { code: "BAD_USER_INPUT", http: { status: 400 } },
          });
        }
      } else if (phoneNumber && code) {
        // Handle SMS OTP reset
        if (resetCodes.get(phoneNumber) !== code) {
          throw new GraphQLError("Invalid or expired reset code.", {
            extensions: { code: "BAD_USER_INPUT", http: { status: 400 } },
          });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findOneAndUpdate(
          { phoneNumber },
          { password: hashedPassword }
        );
        resetCodes.delete(phoneNumber);

        return { message: "Password reset successfully." };
      } else {
        throw new GraphQLError("Invalid reset method.", {
          extensions: { code: "BAD_USER_INPUT", http: { status: 400 } },
        });
      }
    },
  },
};
