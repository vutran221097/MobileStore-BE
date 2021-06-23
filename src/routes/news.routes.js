const {
    authJwt
} = require("../middlewares");
const NewsController = require("../controllers/news.controller.js");
const router = require("express").Router();
const path = require('path');
const multer = require("multer");
const {
    v4: uuidv4
} = require('uuid');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/news/');
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

    router.get("/", NewsController.findAll);
    router.get("/:id", NewsController.findOne);

    router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], NewsController.update);
    router.put("/:id", [authJwt.verifyToken, authJwt.isModerator], NewsController.update);

    router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], NewsController.delete);
    router.delete("/:id", [authJwt.verifyToken, authJwt.isModerator], NewsController.delete);

    router.delete("/", [authJwt.verifyToken, authJwt.isAdmin], NewsController.deleteAll);
    router.delete("/", [authJwt.verifyToken, authJwt.isModerator], NewsController.deleteAll);

    router.post('/image', upload.single('image'), NewsController.uploadImage);

    app.use('/news', router);

};