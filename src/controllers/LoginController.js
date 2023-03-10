const user = require("../models/user");
const dotenv = require("dotenv/config");

const jwt = require("jsonwebtoken");
const argon2 = require("argon2");

async function passwordIsValid(hashedPassword, plainPassword) {
  if (!hashedPassword || !plainPassword) {
    throw new Error("Erro na verificação das senhas.");
  }

  const passIsValid = await argon2.verify(hashedPassword, plainPassword);

  return passIsValid;
}

module.exports = {
  async tryLogin(req, res, next) {
    const body = req.body;

    if (!body) {
      return res.status(400).send("Corpo da requisição precisa ser preenchido");
    }

    const userData = await user.findOne({
      where: {
        username: body.username,
      },
    });

    if (
      !userData ||
      !(await passwordIsValid(userData.password, body.password))
    ) {
      return res.status(401).send("Não foi possível realizar o login");
    }

    const token = jwt.sign(
      {
        id: userData.id,
        name: userData.name,
        slack_chat_id: userData.slack_chat_id,
      },
      process.env.JWT_SECRET
    );

    return res.send({
      name: userData.name,
      token: token,
    });
  },
};
