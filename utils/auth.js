const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const { JWT_SECRET } = process.env;

const generateUserToken = (user) => {
  let data = {
    id: user.id,
    email: user.uuid,
  };
  let token = jwt.sign(data, JWT_SECRET);
  return token;
};

const decodeToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

function reverseJwtToken(token) {
  return jwt.decode(token, JWT_SECRET);
}

async function hashAsync(password) {
  return await bcrypt.hash(password, 10);
}

async function compareAsync(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

module.exports = {
  hashAsync,
  compareAsync,
  reverseJwtToken,
  generateUserToken,
  decodeToken
};
