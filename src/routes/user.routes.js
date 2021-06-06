const {
  authJwt
} = require("../middlewares");
const UserController = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.get(
    "/users",
    [authJwt.verifyToken, authJwt.isAdmin],
    UserController.findAll,
    UserController.create,
    UserController.deleteAll
  );

  app.get(
    "/users/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    UserController.findOne,
    UserController.update,
    UserController.delete
  )
};