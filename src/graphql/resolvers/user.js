import User from "../../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import postmark from "postmark";
import dotenv from "dotenv";
import { GraphQLError } from "graphql";
import { emailTemplates } from "../../template/emailTemplates.js";
import rateLimit from "express-rate-limit";

dotenv.config();

export const getPostMarkClient = () => {
  return new postmark.ServerClient(process.env.POSTMARK_API_KEY);
};

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

        const user = new User({
          ...profileData,
          email,
          password,
          role,
          emailIsVerified: false,
        });

        await user.save();

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
          from: process.env.POSTMARK_SENDER_EMAIL,
          subject: "Welcome to Combat Tix – Confirm Your Email",
          HtmlBody: emailTemplates.verificationEmail(user, verificationCode),
        };

        const postmarkClient = getPostMarkClient();
        await postmarkClient.sendEmail(msg);

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
          from: process.env.POSTMARK_SENDER_EMAIL,
          subject: "Your Combat Tix Email is Verified!",
          HtmlBody: emailTemplates.emailVerified(user),
        };
        const postmarkClient = getPostMarkClient();

        await postmarkClient.sendEmail(msg);

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
          from: process.env.POSTMARK_SENDER_EMAIL,
          subject: "New Verification Code – Combat Tix",
          HtmlBody: emailTemplates.verificationEmail(user, newVerificationCode),
        };
        const postmarkClient = getPostMarkClient();
        await postmarkClient.sendEmail(msg);

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
        from: process.env.POSTMARK_SENDER_EMAIL,
        subject: `Welcome to Combat Tix, ${updatedUser.firstName}!`,
        HtmlBody: `
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
      const postmarkClient = getPostMarkClient();
      await postmarkClient.sendEmail(msg);

      return updatedUser;
    },

    async requestPasswordReset(_, { email }, { req }) {
      const user = await User.findOne({ email });
      if (!user) {
        throw new GraphQLError("User not found.", {
          extensions: { code: "BAD_USER_INPUT", http: { status: 400 } },
        });
      }

      // Generate a JWT token for the magic link
      const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "15m",
      });

      // Send the magic link via email
      const magicLink = `${process.env.FRONTEND_URL}/reset-password?email=${email}&token=${resetToken}`;
      const msg = {
        to: email,
        from: process.env.POSTMARK_SENDER_EMAIL,
        subject: "Password Reset Request - Combat Tix",
        HtmlBody: emailTemplates.passwordReset(user, magicLink),
      };
      try {
        await postmarkClient.sendEmail(msg);
      } catch (error) {
        console.error("SendGrid Error:", error);
        throw new GraphQLError("Failed to send password reset email.", {
          extensions: { code: "INTERNAL_SERVER_ERROR", http: { status: 500 } },
        });
      }

      return { message: "Password reset magic link sent successfully." };
    },

    async resetPassword(_, { email, newPassword, confirmPassword, token }) {
      if (!email || !token || !newPassword || !confirmPassword) {
        throw new GraphQLError(
          "Email, token, newPassword, and confirmPassword are required.",
          {
            extensions: { code: "BAD_USER_INPUT", http: { status: 400 } },
          }
        );
      }

      // Check if newPassword and confirmPassword match
      if (newPassword !== confirmPassword) {
        throw new GraphQLError(
          "New password and confirm password do not match.",
          {
            extensions: { code: "BAD_USER_INPUT", http: { status: 400 } },
          }
        );
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.email !== email) {
          throw new GraphQLError("Invalid or expired token.", {
            extensions: { code: "BAD_USER_INPUT", http: { status: 400 } },
          });
        }

        // Hash the new password and update the user
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(user.id, { password: hashedPassword });

        // Send the password reset confirmation email
        const msg = {
          to: user.email,
          from: process.env.POSTMARK_SENDER_EMAIL,
          subject: "Password Reset Successful - Combat Tix",
          HtmlBody: emailTemplates.passwordResetSuccess(user),
        };
        const postmarkClient = getPostMarkClient();

        await postmarkClient.sendEmail(msg);

        return { message: "Password reset successfully." };
      } catch (error) {
        throw new GraphQLError("Invalid or expired token.", {
          extensions: { code: "BAD_USER_INPUT", http: { status: 400 } },
        });
      }
    },
  },
};
