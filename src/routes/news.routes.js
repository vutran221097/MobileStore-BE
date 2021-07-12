const {
    authJwt
} = require("../middlewares");
const NewsController = require("../controllers/news.controller.js");
const router = require("express").Router();

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    router.post("/", [authJwt.verifyToken, authJwt.isAdmin], NewsController.create);
    router.post("/", [authJwt.verifyToken, authJwt.isModerator], NewsController.create);

    router.get("/", NewsController.findAllAndPagination);
    router.get("/:id", NewsController.findOne);

    router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], NewsController.update);
    router.put("/:id", [authJwt.verifyToken, authJwt.isModerator], NewsController.update);

    router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], NewsController.delete);
    router.delete("/:id", [authJwt.verifyToken, authJwt.isModerator], NewsController.delete);

    router.delete("/", [authJwt.verifyToken, authJwt.isAdmin], NewsController.deleteAll);
    router.delete("/", [authJwt.verifyToken, authJwt.isModerator], NewsController.deleteAll);

    app.use('/news', router);

};