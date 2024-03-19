"use server";
import "../../globals.css";
import nodemailer from "nodemailer";

interface RecoveryResult {
  success: boolean;
}

export default async function recover(email: any, OTP: any): Promise<RecoveryResult> {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
  });

  let mailOptions = {
    from: "coppertalon777@gmail.com",
    to: email,
    subject: 'Nodemailer Setup Test',
    text: 'This is a test email from Nodemailer. Your one time pass is: ' + OTP + '. It will expire in 15 minutes. Use the link to reset your password: http://localhost:3000/reset-password'
  }

  return new Promise<RecoveryResult>((resolve, reject) => {
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        resolve({ success: false });
      } else {
        resolve({ success: true });
      }
    });
  });

}
