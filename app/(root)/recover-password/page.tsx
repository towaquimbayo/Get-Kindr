"use server";
import "../../globals.css";
import nodemailer from "nodemailer";

interface RecoveryResult {
  success: boolean;
}

export default async function Recovery(email: string) {

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
    text: 'Testing password reset email'
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
