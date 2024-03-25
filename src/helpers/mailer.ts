import User from "@/models/userModel";
import nodemailer from "nodemailer";
import bcryptjs from 'bcryptjs'

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {

    // creating verification token using bcryptjs
    const hashToken = await bcryptjs.hash(userId.toString(), 10)
    if(emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {verifyToken: hashToken, verifyTokenExpiry: Date.now() + 3600000})
    } else if(emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {forgotPasswordToken: hashToken, forgotPasswordTokenExpiry: Date.now() + 3600000})
    }

    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
      }
    });

    const userOptions = {
      from: "anna@mail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href= "${process.env.DOMAIN}/verifyemail?token=${hashToken}">here</a> to ${emailType === "VERIFY"? "verify your email" : "reset your password"} or copy and paste this link in your browser</p> ${process.env.DOMAIN}/verifyemail?token=${hashToken}`,
    };

    return await transport.sendMail(userOptions);
  } catch (ex: any) {
    throw new Error(ex.message);
  }
};
