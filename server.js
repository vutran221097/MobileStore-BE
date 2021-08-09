const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const db = require("./src/models");
const Role = db.role;
// const User = db.user;
require('dotenv').config();

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
      });
      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
      });
    }
  });

  // new User({
  //   username: "admin",
  //   email: "admin@gmail.com",
  //   password: "mobilestore",
  // })
}

db.mongoose
  .connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("Connected to the MongoDB!");
    initial();
  })
  .catch(err => {
    console.log("Cannot connect to the MongoDB!", err);
    process.exit();
  });



app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json({
  limit: '5mb'
}));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '5mb'
}));

app.get("/", (req, res) => {
  res.send("Back End chạy thành công")
});

//routes
require('./src/routes/product.routes')(app);
require('./src/routes/auth.routes')(app);
require('./src/routes/user.routes')(app);
require('./src/routes/news.routes')(app);
require('./src/routes/order.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});