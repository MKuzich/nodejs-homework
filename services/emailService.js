const nodemailer = require("nodemailer");
require("dotenv").config();

const { MAIL, MAIL_PASSWORD, PORT } = process.env;
const BASE_URL = `http://localhost:${PORT}`;

const config = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: MAIL,
    pass: MAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

const sendEmail = async (email, verifyToken) => {
  const verifyLink = `${BASE_URL}/users/verify/${verifyToken}`;
  const emailOptions = {
    to: email,
    from: MAIL,
    subject: "Confirm your email",
    html: `<h4>Click on this link to confirm registration ${verifyLink}</h4>`,
  };
  try {
    await transporter.sendMail(emailOptions);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = sendEmail;
