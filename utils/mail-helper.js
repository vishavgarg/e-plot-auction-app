const { sendEmailSync } = require("./send-mail");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { DOMAIN } = process.env;
const mailHelper = {
  AuthMail: (email, token) => {
    let url = path.join(__dirname, `../html/email-confirmation.html`);
    let html = fs.readFileSync(url, "utf8");
    html = html.replace("{URL}", `${DOMAIN}/signin?token=${token}`);

    sendEmailSync({
      to: email,
      subject: "Email verification",
      html: html,
    });
  },
  PaymentSuccess: (email, data) => {
    let url = path.join(__dirname, `../html/payment-successfull.html`);
    let html = fs.readFileSync(url, "utf8");
    html = html.replace("{DATA}", data);

    sendEmailSync({
      to: email,
      subject: "Payment successfull",
      html: html,
    });
  },
};

module.exports = mailHelper;
