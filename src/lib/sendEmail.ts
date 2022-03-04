import nodemailer from 'nodemailer';

export async function sendEmail(to: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'mds43vi6nviwucqv@ethereal.email', // generated ethereal user
      pass: 'xJsQzVAuFYKqx5xUR9', // generated ethereal password
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Admin 👻" <admin@reddit-clone.com>', // sender address
    to, // list of receivers
    subject: 'Change password', // Subject line
    html,
  });

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}
