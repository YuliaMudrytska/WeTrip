const nodemailer = require("nodemailer");

const simularEnvioCorreo = async (correos, asunto, mensaje) => {
  return {
    ok: true,
    modo: "simulado",
    enviadosA: correos,
    asunto,
    mensaje
  };
};

const enviarCorreoReal = async (correos, asunto, mensaje) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: correos.join(", "),
      subject: asunto,
      text: mensaje
    };

    const info = await transporter.sendMail(mailOptions);

    return {
      ok: true,
      modo: "real",
      enviadosA: correos,
      info
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      msg: "Error al enviar correo",
      error: error.message
    };
  }
};

module.exports = {
  simularEnvioCorreo,
  enviarCorreoReal
};