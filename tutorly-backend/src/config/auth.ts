import { betterAuth } from "better-auth";
import { prisma } from "./db";
import config from "./env";
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

interface VerificationUser {
  id: string;
  email: string;
}

export const auth = betterAuth({

  database: prisma,

  auth: {
    emailPassword: true,
    emailVerification: {
      enabled: true,
      sendVerificationEmail: async (user: VerificationUser, token: string) => {
        try {
          const verificationUrl = `${config.APP_URL}/verify-email?token=${token}`
          const info = await transporter.sendMail({
            from: `"Tutorly" <${config.EMAIL_USER}>`,
            to: user.email,
            subject: "Please verify your email!",
            html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .header {
      background-color: #0f172a;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }

    .header h1 {
      margin: 0;
      font-size: 22px;
    }

    .content {
      padding: 30px;
      color: #334155;
      line-height: 1.6;
    }

    .content h2 {
      margin-top: 0;
      font-size: 20px;
      color: #0f172a;
    }

    .button-wrapper {
      text-align: center;
      margin: 30px 0;
    }

    .verify-button {
      background-color: #2563eb;
      color: #ffffff !important;
      padding: 14px 28px;
      text-decoration: none;
      font-weight: bold;
      border-radius: 6px;
      display: inline-block;
    }

    .verify-button:hover {
      background-color: #1d4ed8;
    }

    .footer {
      background-color: #f1f5f9;
      padding: 20px;
      text-align: center;
      font-size: 13px;
      color: #64748b;
    }

    .link {
      word-break: break-all;
      font-size: 13px;
      color: #2563eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>Prisma Blog</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <h2>Verify Your Email Address</h2>
      <p>
        Hello ${user.email} <br /><br />
        Thank you for registering on <strong>Prisma Blog</strong>.
        Please confirm your email address to activate your account.
      </p>

      <div class="button-wrapper">
        <a href="${verificationUrl}" class="verify-button">
          Verify Email
        </a>
      </div>

      <p>
        If the button doesn’t work, copy and paste the link below into your browser:
      </p>

      <p class="link">
        ${verificationUrl}
      </p>

      <p>
        This verification link will expire soon for security reasons.
        If you did not create an account, you can safely ignore this email.
      </p>

      <p>
        Regards, <br />
        <strong>Prisma Blog Team</strong>
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      © 2025 Prisma Blog. All rights reserved.
    </div>
  </div>
</body>
</html>
`
          });

          console.log(`Send verification email to ${user.email} with token ${token}`, info.messageId);
        } catch (err) {
          console.error(err)
          throw err;
        }


      },
    },
  },


  extendUser: {
    fields: {
      role: {
        type: "enum",
        values: ["ADMIN", "TUTOR", "STUDENT"],
        default: "STUDENT",
      },
      phone: {
        type: "string",
        optional: true,
      },
      status: {
        type: "enum",
        values: ["ACTIVE", "BANNED", "PENDING"],
        default: "ACTIVE",
      },
    },
  },

  cookies: {
    name: "tutorly_session",
    secure: true,
    httpOnly: true,
    sameSite: "lax",
  },


  security: {
    trustedOrigins: [config.APP_URL, config.FRONTEND_URL],
  },
});