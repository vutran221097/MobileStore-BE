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


exports.findAllAndPagination = async (req, res) => {
    try {
        let query = News.find().sort({
            createdAt: -1
        });

        let allNews = News.find().sort({
            createdAt: -1
        });

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 8;
        const skip = (page - 1) * pageSize;
        const total = await News.countDocuments();

        const pages = Math.ceil(total / pageSize);
        query = query.skip(skip).limit(pageSize);

        const result = await query;
        const newss = await allNews;

        res.status(200).json({
            status: 'success',
            count: result.length,
            page,
            pages,
            news: result,
            allNews:newss
        })
    } catch (error) {
        console.log(error)
    }
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