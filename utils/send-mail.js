const nodemailer = require("nodemailer");
require("dotenv").config();
const { MAILER_EMAIL, MAILER_PASS } = process.env;

const emailFrom = `e-Plot-Auction <${MAILER_EMAIL}>`;
const smtpOptions = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: MAILER_EMAIL,
    pass: MAILER_PASS,
  },
};

async function sendEmail({ to, subject, html, from = emailFrom }) {
  const transporter = nodemailer.createTransport(smtpOptions);
  await transporter.sendMail({ from, to, subject, html });
}

function sendEmailSync({ to, subject, html, from = emailFrom }) {
  const transporter = nodemailer.createTransport(smtpOptions);
  transporter.sendMail({ from, to, subject, html });
}

module.exports = { sendEmail, sendEmailSync };
