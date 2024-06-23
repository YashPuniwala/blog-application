import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'yashpuniwala@gmail.com',
      pass: 'jgmd irkb wylk nfgn',
    },
  });

  const mailOptions = {
    from: 'yashpuniwala@gmail.com',
    to: options.email,
    subject: options.subject,
    text: options.body,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;