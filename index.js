require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/url.route");

const { DB_URL, PORT } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

const start = async () => {
  try {
    await mongoose.connect(DB_URL);

    app.listen(PORT, () => console.log("Сервер запущен на порту", PORT));
  } catch (e) {
    console.log(e.message);
  }
};

start();

module.exports = app;
