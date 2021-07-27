const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const authRoute = require("./routes/auth");

const dbURI = process.env.DB_HOST;
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/auth", authRoute);

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((error) => console.log(error));

app.listen(PORT, () => {
  console.log(`Server started: ${PORT}`);
});
