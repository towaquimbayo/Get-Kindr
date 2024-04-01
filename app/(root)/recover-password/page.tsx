"use server";
import "../../globals.css";
import nodemailer from "nodemailer";

interface RecoveryResult {
  success: boolean;
}

export default async function recover(email: any, OTP: any): Promise<RecoveryResult> {
  // Define the nodemailer transporter using local environment variables.
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
  });

  // Format the email sender, subject, and the text in email being sent.
  let mailOptions = {
    from: "devteam.kindr@gmail.com",
    to: email,
    subject: 'Reset your KINDR password',
    text:
    `
    Hello from KINDR.
    
    We received a request to reset your password for https://getkindr.com.
    If you did not send this request, please ignore and delete this messsage.
    
    
    You can use the following One Time Code to reset your password: ${OTP}
    
    Follow this link to reset your password: https://getkindr.com/reset-password
    

    Your One Time Code is only valid for 15 minutes, to get a new one visit https://getkindr.com/forgot-password.
    

    KINDR Support Team
    
    Email: support@getkindr.com        Phone: (604) 123-4567
    `
  }

  // Send the email and return a promise indicating success or failure.
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
