const db = require("../models");
const Phone = db.phone;

exports.create = (req, res) => {

    const phone = new Phone({
        name: req.body.name,
        image: req.file.filename,
        category: req.body.category,
        description: req.body.description,
        guarantee: req.body.guarantee,
        color: req.body.color,
        price: req.body.price,
        available: req.body.available,
    });

    phone
        .save(phone)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Phone."
            });
        });
};


exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? {
        name: {
            $regex: new RegExp(name),
            $options: "i"
        }
    } : {};

    Phone.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving phones."
            });
        });
};


exports.findOne = (req, res) => {
    const id = req.params.id;

    Phone.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({
                    message: "Not found Phone with id " + id
                });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({
                    message: "Error retrieving Phone with id=" + id
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

    Phone.findByIdAndUpdate(id, req.body, {
            useFindAndModify: false

        })
        .then(data => {
            data.image = req.file.filename || data.image,

            data 
                .save()
                .then(() => res.json("The phone is update succesfully!"))
                .catch(err => res.status(400).json(`Error: ${err}`));
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Phone with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Phone.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Phone with id=${id}. Maybe Phone was not found!`
                });
            } else {
                res.send({
                    message: "Phone was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Phone with id=" + id
            });
        });
};

exports.deleteAll = (req, res) => {
    Phone.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Phones were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all Phones."
            });
        });
};