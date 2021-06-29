const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: {
      type: String,
      unique: true
    },
    email: {
      type: String,
      unique: true
    },
    password: String,
    roles: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }, ],
    myrole: String
  }, {
    timestamps: true
  })
);

module.exports = User;