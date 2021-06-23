const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
// db.url = dbConfig.url;

db.product=require("./product.model")
db.news=require("./news.model")
db.user = require("./user.model");
db.role = require("./role.model");
db.ROLES = ["admin", "moderator"];

module.exports = db;