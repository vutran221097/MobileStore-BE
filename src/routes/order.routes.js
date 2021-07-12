const {
    authJwt
} = require("../middlewares");
const OrderController = require("../controllers/order.controller.js");
const router = require("express").Router();

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    router.post("/", OrderController.create);
    router.get("/", OrderController.findAllAndPagination);

    router.get("/:id", OrderController.findOne);
    router.get("/phone/:phone", OrderController.findByPhoneNum);

    router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], OrderController.update);
    router.put("/:id", [authJwt.verifyToken, authJwt.isModerator], OrderController.update);

    router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], OrderController.delete);
    router.delete("/:id", [authJwt.verifyToken, authJwt.isModerator], OrderController.delete);

    router.delete("/", [authJwt.verifyToken, authJwt.isAdmin], OrderController.deleteAll);
    router.delete("/", [authJwt.verifyToken, authJwt.isModerator], OrderController.deleteAll);

    app.use('/order', router);

};