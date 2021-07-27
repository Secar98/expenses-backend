const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const authRoute = require("./routes/auth");
const indexRoute = require("./routes/index");

const dbURI = process.env.DB_HOST;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", indexRoute);
app.use("/api/auth", authRoute);

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((error) => console.log(error));

app.listen(5000, () => {
  console.log("Server started: 5000");
});
