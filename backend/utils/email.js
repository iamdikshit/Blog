import nodemailer from "nodemailer";
import config from "../configuration.js";

class Email {
  constructor(user, url) {
    (this.to = user.email),
      (this.name = user.name),
      (this.url = url),
      (this.from = `Dikshit Bhardwaj ${config.MAIL_FROM}`);
  }

  newTransporter() {
    return nodemailer.createTransport({
      host: config.MAIL_HOST,
      port: config.MAIL_PORT,

      auth: {
        user: config.MAIL_USERNAME,
        pass: config.MAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    try {
      const mailOption = {
        from: this.from,
        to: this.to,
        subject,
        text: template,
      };
      await this.newTransporter().sendMail(mailOption);
    } catch (error) {
      console.log(error);
    }
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the Blog Family!");
  }
  async sendActivation() {
    const template = `Hi! please click on the link to activate your email \n 
    ${this.url}
    `;
    await this.send(template, "Activate email!");
  }

  async sendResetPassword() {
    const template = `Click on the link to reset your password.\n ${this.url}`;
    await this.send(template, "Reset Password");
  }
}

export default Email;
