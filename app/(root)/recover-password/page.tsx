"use server";
import "../../globals.css";
import nodemailer from "nodemailer";
const { google } = require('googleapis');
interface RecoveryResult {
  success: boolean;
}


export default async function recover(email: any, OTP: any): Promise<RecoveryResult> {
  const oauth2Client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    "http://localhost"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN
  });

  // Get the access token
  const { token } = await oauth2Client.getAccessToken()

  // Define the nodemailer transporter using local environment variables.
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: token
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
    If you did not send this request, please ignore and delete this message.
    
    
    You can use the following One Time Code to reset your password: ${OTP}
    
    Follow this link to reset your password: https://getkindr.com/reset-password
    

    Your One Time Code is only valid for 15 minutes, to get a new one visit https://getkindr.com/forgot-password.
    

    KINDR Support Team
    
    Email: hello@getkindr.com        Phone: (604) 123-4567
    `
  }

  // Send the email and return a promise indicating success or failure.
  return new Promise<RecoveryResult>((resolve, reject) => {
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        sendEmail(mailOptions)
      } else {
        // If there is no error, resolve the promise.
        resolve({ success: true });
      }
    });
  });

}

async function sendEmail(mailOptions: any) {
  // Define OAuth2 client.
  const oauth2Client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    "http://localhost"
  );

  // Get a new refresh token and save it to ENV.
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: process.env.OAUTH_CLIENT_ID,
      client_secret: process.env.OAUTH_CLIENT_SECRET,
      refresh_token: process.env.OAUTH_REFRESH_TOKEN,
      grant_type: 'refresh_token'
    })
  });

  // Get the response data and save the new refresh token.
  const responseData = await response.json();
  process.env.OAUTH_REFRESH_TOKEN = responseData.refresh_token;

  // Get updated token values
  oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN
  });

  // Get the access token
  const { token } = await oauth2Client.getAccessToken()

  // Define the nodemailer transporter using updated environment variables.
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: token
    }
  });

  // Try to send the email again and return the promise.
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