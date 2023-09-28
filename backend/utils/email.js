import nodemailer from "nodemailer";

class Email {
  constructor(user, url) {
    (this.to = user.email),
      (this.name = user.name),
      (this.url = url),
      (this.from = `Dikshit Bhardwaj ${process.env.MAIL_FROM}`);
  }

  newTransporter() {
    return nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,

      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
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
}

export default Email;
