const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };
  console.log(
    process.env.SMTP_HOST,
process.env.SMTP_PORT,
process.env.SMTP_SERVICE,
process.env.SMTP_MAIL,
process.env.SMTP_PASSWORD,
  )
  await transporter.sendMail(mailOptions);
}
  catch (e) {
    // throw new Error(e)
    console.log(e)
  }
};

module.exports = sendEmail;