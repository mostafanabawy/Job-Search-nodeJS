import nodemailer from "nodemailer";
import "dotenv/config"


const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: process.env.NODE_PORT,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: process.env.NODE_USER,
    pass: process.env.NODE_PASS,
  },
});

// async..await is not allowed in global scope, must use a wrapper
export default async function main({html, subject, email, otp}) {
  // send mail with defined transport object
  console.log(email);
  const info = await transporter.sendMail({
    from: '"Job Search App" <mostafanabawy979@gmail.com>', // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    html: html
  });

}

export const emails = {
    resetPassword: {
        subject: "Reset Password",
        html: (otp, name) => `<div>hello, ${name}</div><div>to reset password, please use this reset code:<h1>${otp}</h1></div>`
    },
    confirmEmail: {
        subject: "Confirm Email",
        html: (otp, name) => `<div>hello, ${name}</div><div>to confirm your email, please use this code:<h1>${otp}</h1></div>`
    }
}


