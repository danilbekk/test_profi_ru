const mongoose = require("mongoose");

const urlSchema = mongoose.Schema({
  url: { type: String, required: true, unique: true },
  slug: { type: String, minLength: 3, maxLength: 60 },
  counter: { type: Number, default: 0 },
});

const Url = mongoose.model("Url", urlSchema);

module.exports = Url;
