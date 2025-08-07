const nodemailer = require("nodemailer");

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  const data = JSON.parse(event.body);
  const { name, email, message } = data;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "rashidnzri@gmail.com",
      pass: "rtgm hzxb ykor yczn", // ← رمز app password جیمیل اینجا بذار
    },
  });

  try {
    await transporter.sendMail({
      from: email,
      to: "rashidnzri@gmail.com",
      subject: `Message from ${name}`,
      text: message,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
