const nodemailer=require("nodemailer")
 const receiveEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    //from: process.env.SMTP_MAIL,
    from:options.email,
    to: process.env.SMTP_MAIL,
    subject: options.message,
    //name:options.senderName
    //html:options.senderName
    html:
    `<div >
    <p>Name:</p>
    <p>${options.senderName}</p>
    </div>
    
    <div >
    <p>Message:</p>
    <p>${options.message}</p>
    </div>
    
    
    <p>mail:
    <p>${options.email}
    </div>`
    // text: options.message,
  };
  await transporter.sendMail(mailOptions);
};

module.exports={receiveEmail}