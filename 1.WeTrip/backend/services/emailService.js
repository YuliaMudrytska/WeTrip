const nodemailer = require("nodemailer");

// Simulación (para desarrollo)
const simularEnvioCorreo = async (correos, asunto, mensaje) => {
  return {
    ok: true,
    modo: "simulado",
    enviadosA: correos,
    asunto,
    mensaje
  };
};

// Envío real
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
      modo: "real",
      msg: "Error al enviar correo",
      error: error.message
    };
  }
};


const enviarCorreoPropuesta = async (correos, link, destino) => {
  const asunto = `WeTrip - Nueva propuesta de viaje a ${destino}`;

  const mensaje = `
Se ha creado una propuesta de viaje a ${destino}.

Puedes ver los planes y votar en el siguiente enlace:

${link}

Selecciona el plan que prefieras para continuar con la reserva.

— WeTrip
`;

  // envío real para despliegue
  const usarEnvioReal = false;

  if (usarEnvioReal) {
    return await enviarCorreoReal(correos, asunto, mensaje);
  } else {
    console.log("📩 SIMULACIÓN EMAIL:");
    console.log("Correos:", correos);
    console.log("Link:", link);

    return await simularEnvioCorreo(correos, asunto, mensaje);
  }
};

module.exports = {
  simularEnvioCorreo,
  enviarCorreoReal,
  enviarCorreoPropuesta
};