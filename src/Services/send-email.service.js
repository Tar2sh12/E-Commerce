import nodemailer from "nodemailer";
export const sendEmailService = async ({
  to = "",
  subject = "",
  textMessage = "",
  htmlMessage = "",
} = {}) => {
  // 1 - configure the transporter
  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 587, // 465 - 25
    secure: false, //true for 465 , false for other ports
    auth: {
      user: "mohamad1tarek1@gmail.com",
      pass: "hbsdhwjjwcoiugga",
    },
    service: "gmail",
    tls: {
      rejectUnauthorized: false,
    },

  });

  //2-message configuration
  const info = await transporter.sendMail({
    from: "Hamsolah <mohamad1tarek1@gmail.com>",
    to,
    subject,
    text: textMessage,
    html:htmlMessage,
  });
  return info
};
