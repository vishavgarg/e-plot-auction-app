const express = require("express");
const app = express();
const routes = require("./routes");
const { DOMAIN } = process.env;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", DOMAIN);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers,access-token, X-Requested-With",
    "Set-Cookie"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use("/", routes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
