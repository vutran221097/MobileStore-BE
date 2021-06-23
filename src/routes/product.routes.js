const {
    authJwt
} = require("../middlewares");
const ProductController = require("../controllers/product.controller.js");
const router = require("express").Router();
const path = require('path');
const multer = require("multer");
const {
    v4: uuidv4
} = require('uuid');

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
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

    router.post("/", [authJwt.verifyToken, authJwt.isAdmin], upload.single("image"), ProductController.create);
    router.post("/", [authJwt.verifyToken, authJwt.isModerator], upload.single("image"), ProductController.create);

    router.get("/allPhone/", ProductController.findAllPhone);
    router.get("/", ProductController.findAllAndPagination);
    router.get("/:id", ProductController.findOne);

    router.get("/category/:category", ProductController.findCategory);

    router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], upload.single('image'), ProductController.update);
    router.put("/:id", [authJwt.verifyToken, authJwt.isModerator], upload.single('image'), ProductController.update);

    router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], ProductController.delete);
    router.delete("/:id", [authJwt.verifyToken, authJwt.isModerator], ProductController.delete);

    router.delete("/", [authJwt.verifyToken, authJwt.isAdmin], ProductController.deleteAll);
    router.delete("/", [authJwt.verifyToken, authJwt.isModerator], ProductController.deleteAll);

    app.use('/products', router);

};