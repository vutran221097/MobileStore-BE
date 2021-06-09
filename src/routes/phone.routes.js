const {
  authJwt
} = require("../middlewares");
var router = require("express").Router();
const PhoneController = require("../controllers/phone.controller.js");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  const multer = require("multer");
  const {
    v4: uuidv4
  } = require('uuid');
  let path = require('path');

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
      const image = uuidv4() + '-' + Date.now() + path.extname(file.originalname)
      cb(null, image);
    }
  })

  const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }

  let upload = multer({
    storage: storage,
    limits: 1024 * 1024 * 5,
    fileFilter: fileFilter,
  });

  router.post("/",[authJwt.verifyToken, authJwt.isModerator], upload.single("image"), PhoneController.create);

  router.get("/", PhoneController.findAll);

  router.get("/:id", PhoneController.findOne);

  router.put("/:id", [authJwt.verifyToken, authJwt.isModerator], upload.single('image'), PhoneController.update);

  router.delete("/:id", [authJwt.verifyToken, authJwt.isModerator], PhoneController.delete);

  router.delete("/", [authJwt.verifyToken, authJwt.isModerator], PhoneController.deleteAll);

  app.use('/phones', router);

};