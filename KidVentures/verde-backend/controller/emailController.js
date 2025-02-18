const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../model/user.model");

async function sendEmailAlta(req, res) {
  const { toEmail, nameUser } = req.body;
  console.log("Enviando email...");
  try {
    // Configuración del transporte SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    // Configuración del correo
    message =
      "Para poder completar la creación de su cuenta, haga click en el boton de abajo.";
    url = "http://localhost:5173/email/confirm-user/";
    const token = generarTokenVerificacion(toEmail);
    const verificationLink = url + token;
    // console.log("Enlace de verificación:", verificationLink);
    const mailOptions = {
      from: `"Kidventures" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: "Creación de cuenta",
      text: message,
      html: `<h1>Hola ${nameUser}:</h1><p>${message}</p><a href="${verificationLink}">Confirmar cuenta</a>`,
    };

    // Enviar el correo
    const result = await transporter.sendMail(mailOptions);
    // console.log("Correo enviado", result);
    console.log("Correo enviado");

    res.status(200).json({
      message:
        "Para poder completar la creación de la cuenta, hemos enviado un correo a la dirección introducida, revisa su bandeja",
    });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res
      .status(500)
      .json({ message: "Error al enviar el correo", error: error.message });
  }
}

function generarTokenVerificacion(email) {
  const secret = process.env.EMAIL_SECRET;
  const token = jwt.sign({ email }, secret, { expiresIn: "1h" });
  return token;
}

async function confirmUser(req, res) {
  const { token } = req.body;
  const secret = process.env.EMAIL_SECRET;
  try {
    const decoded = jwt.verify(token, secret);
    const email = decoded.email;

    const user = await User.findOneAndUpdate(
      { email },
      { is_active: true },
      { new: true }
    );
    if (!user) {
      // Si no encuentra al usuario
      return res
        .status(404)
        .json({ message: "Error al no encontrar el usuario" });
    }
    res.status(200).json({ message: "Cuenta confirmada correctamente" });
    console.log(`Cuenta ${email} confirmada y activada`);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Si el token ha caducado
      console.log(
        "El token ha expirado. Solicita un nuevo enlace de confirmación."
      );
      res.status(400).json({
        message:
          "El token ha expirado. Solicita un nuevo enlace de confirmación",
      });
    } else {
      // Si el token es inválido por alguna otra razón
      console.log("Token inválido.");
      res.status(400).json({ message: "Token inválido" });
    }
  }
}

module.exports = {
  confirmUser,
  sendEmailAlta,
};
