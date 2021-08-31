require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const authRoute = require("./routes/auth");
const expenseRoute = require("./routes/expense");

const dbURI = process.env.DB_HOST;
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/expense", expenseRoute);

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
