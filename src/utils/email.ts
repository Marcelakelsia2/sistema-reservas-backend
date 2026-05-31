import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function enviarEmail(
  destino: string,
  assunto: string,
  mensagem: string
) {
  await transporter.sendMail({
    from: "Sistema Reservas <no-reply@sistema.com>",
    to: destino,
    subject: assunto,
    text: mensagem,
  });
}