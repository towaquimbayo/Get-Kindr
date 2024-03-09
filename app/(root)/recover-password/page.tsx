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

  const data = {
    email: email,
    expiration_date: new Date(new Date().getTime() + 15 * 60 * 1000).toISOString(),
  }

  const res = await fetch('/api/one-time-pass/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  let success = false;
  let OTP = "";

  if (res.ok) {
    const json = await res.json();
    success = json.success;
    OTP = json.one_time_pass;
  } else {
    return new Promise<RecoveryResult>((resolve, reject) => {
      reject();
    });
  }
  

  let mailOptions = {
    from: "coppertalon777@gmail.com",
    to: email,
    subject: 'Nodemailer Setup Test',
    text: 'This is a test email from Nodemailer. Your one time pass is: ' + OTP + '. It will expire in 15 minutes.'
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
