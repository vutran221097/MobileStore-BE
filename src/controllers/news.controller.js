const db = require("../models");
const News = db.news;


exports.create = (req, res) => {

    const news = new News({
        title: req.body.title,
        body: req.body.body,
    });

    news
        .save(news)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the News."
            });
        });
};

exports.uploadImage = async (req, res, next) => {
    try {
        return res.status(200).json({
            file: req.file.path,
        })

    } catch (error) {
        console.log(error);
        next(error);
    }

}

exports.findAll = (req, res) => {
    const limit = parseInt(req.query.limit); // Make sure to parse the limit to number
    const skip = parseInt(req.query.skip)
    News.find({}).sort({
            createdAt: -1
        }).limit(limit).skip(skip)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Newss."
            });
        });
};

exports.findCategory = (req, res) => {
    category_search = req.params.category;
    News.aggregate(
            [{
                $match: {
                    category: category_search,
                }
            }]
        )
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Newss."
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    News.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({
                    message: "Not found News with id " + id
                });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({
                    message: "Error retrieving News with id=" + id
                });
        });
};

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    News.findByIdAndUpdate(id, req.body)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update New with id=${id}. Maybe New was not found!`
                });
            } else res.send({
                message: "New was updated successfully."
            });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating New with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;
    News.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete News with id=${id}. Maybe News was not found!`
                });
            } else {
                res.send({
                    message: "News was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete News with id=" + id
            });
        });
};

exports.deleteAll = (req, res) => {
    News.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Newss were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all Newss."
            });
        });
};