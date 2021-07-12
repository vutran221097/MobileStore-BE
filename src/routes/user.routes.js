const {
  authJwt
} = require("../middlewares");
const UserController = require("../controllers/user.controller");
const router = require("express").Router();

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.post("/", [authJwt.verifyToken, authJwt.isAdmin],  UserController.create);

  router.get("/", [authJwt.verifyToken, authJwt.isAdmin], UserController.findAll);

  router.get("/:id", [authJwt.verifyToken, authJwt.isAdmin], UserController.findOne);

  router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], UserController.update);

  router.put("/changepassword/:id", UserController.changePassword);

  router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], UserController.delete);

  router.delete("/", [authJwt.verifyToken, authJwt.isAdmin], UserController.deleteAll);

  app.use('/users', router);
};