import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER as string,
    pass: process.env.EMAIL_PASS as string,
  }
});
export async function enviarEmail(destinatario: string, assunto: string, mensagem: string): Promise<void> {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject: assunto,
    html: mensagem,
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log("E-mail enviado com sucesso!");
  } catch (erro) {
    console.error("Erro ao enviar e-mail:", erro);
  }
}

