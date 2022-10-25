import nodemailer from "nodemailer";
import fs from "fs";
import handlebars from "handlebars";

type TemplateVariable = {
  [key: string]: string | number;
};

type SendMail = {
  to: string;
  subject: string;
  variables: TemplateVariable;
  file: string;
};

export default class EtherealMailProvider {
  public parseEmailTemplate(file: string, variables: TemplateVariable) {
    const templateFileContent = fs.readFileSync(file).toString("utf-8");
    const templateParse = handlebars.compile(templateFileContent);
    const templateHTML = templateParse(variables);

    return templateHTML;
  }

  async sendMail({ to, subject, variables, file }: SendMail) {
    const account = await nodemailer.createTestAccount();

    const templateHTML = this.parseEmailTemplate(file, variables);

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });

    const message = await transporter.sendMail({
      to,
      from: "Email <noreplay@email.com.br>",
      subject,
      html: templateHTML,
    });

    console.log("Message sent: %s", message.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
  }
}
