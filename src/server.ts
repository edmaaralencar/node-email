import "express-async-errors";
import express from "express";
import EtherealMailProvider from "./providers/EmailProvider/EtherealMailProvider";
import { resolve } from "path";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  return res.json("Hello World!");
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const mailProvider = new EtherealMailProvider();

  const templatePath = resolve(__dirname, "views", "forgotPassword.hbs");

  const variables = {
    name: "Edmar",
    link: `url/token`,
  };

  await mailProvider.sendMail({
    to: email,
    subject: "Recuperação de senha",
    variables,
    file: templatePath,
  });
});

app.listen(5000, () => {
  console.log(`Server running on port 5000.`);
});
