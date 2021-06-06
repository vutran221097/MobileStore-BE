const db = require("../models");
const Phone = db.phone;

// Create and Save a new Phone
exports.create = (req, res) => {
    // Validate request
    // if (!req.body.name) {
    //     res.status(400).send({ message: "Content can not be empty!" });
    //     return;
    // }

    // Create a Phone
    const phone = new Phone({
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        guarantee: req.body.guarantee,
        details: req.body.details,
        color: req.body.color,
        price: req.body.price,
        countView: req.body.countView  
    });

    // Save Phone in the database
    phone
        .save(phone)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Phone."
            });
        });
};



// Retrieve all Phone from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};

    Phone.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving phones."
            });
        });
};

// Find a single Phone with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Phone.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Phone with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Phone with id=" + id });
        });
};

// Update a Phone by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Phone.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Phone with id=${id}. Maybe Phone was not found!`
                });
            } else res.send({ message: "Phone was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Phone with id=" + id
            });
        });
};

// Delete a Phone with the specified id in the request
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
// Delete all Phones from the database.
exports.deleteAll = (req, res) => {
    Phone.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Phones were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Phones."
            });
        });
};
