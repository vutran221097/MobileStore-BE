const mongoose = require("mongoose");

const News = mongoose.model(
    "News",
    mongoose.Schema({
        title: {
            type: String
        },
        body: {
            type: String,
            required: true,
        }
    }, {
        timestamps: true
    })
);


module.exports = News