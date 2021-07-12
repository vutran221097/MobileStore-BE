const db = require("../models");
const User = db.user;
const Role = db.role;
const bcrypt = require("bcryptjs");
exports.create = async (req, res) => {
    // Create a user
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
    });

    user.save((err, user) => {
        if (err) {
            res.status(500).send({
                message: err
            });
            return;
        }
        if (req.body.roles) {
            Role.find({
                    name: {
                        $in: req.body.roles
                    }
                },
                (err, roles) => {
                    if (err) {
                        res.status(500).send({
                            message: err
                        });
                        return;
                    }

                    user.roles = roles.map(role => role._id)
                    user.myrole = roles[0].name.toUpperCase()

                    user.save(err => {
                        if (err) {
                            res.status(500).send({
                                message: err
                            });
                            return;
                        }

                        res.send(user);
                    });

                }
            );
        }
    });
};

exports.findAll = (req, res) => {
    const limit = parseInt(req.query.limit); // Make sure to parse the limit to number
    const skip = parseInt(req.query.skip)
    User.find().sort({
            createdAt: -1
        }).limit(limit).skip(skip)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
        });


};

exports.findOne = (req, res) => {
    const id = req.params.id;
    User.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({
                    message: "Not found User with id " + id
                });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({
                    message: "Error retrieving user with id=" + id
                });
        });
};

exports.changePassword = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password)
        User.findByIdAndUpdate(id, req.body)
        .then(data => {
            data.save().then(() => res.send(data))
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating user with id=" + id
            });
        });
    }
}


exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    const id = req.params.id;

    if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password)
    }

    User.findByIdAndUpdate(id, req.body)
        .then((data) => {
            if (req.body.myrole) {
                data.save((err) => {
                    if (err) {
                        res.status(500).send({
                            message: err
                        });
                        return;
                    }

                    Role.find({
                        name: {
                            $in: req.body.myrole
                        }
                    }, (err, roles) => {
                        if (err) {
                            res.status(500).send({
                                message: err
                            });
                            return;
                        }
                        data.roles = roles.map(role => role._id)
                        data.myrole = roles[0].name.toUpperCase()

                        data.save(err => {
                            if (err) {
                                res.status(500).send({
                                    message: err
                                });
                                return;
                            }
                            res.send(data);
                        });
                    })

                })
            } else {
                data.save().then(() => res.send(data))
                    .catch(err => {
                        res.status(500).send({
                            message: "Error updating user with id=" + id
                        });
                    });
            }

        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    User.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete user with id=${id}. Maybe user was not found!`
                });
            } else {
                res.send({
                    message: "user was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete user with id=" + id
            });
        });
};

exports.deleteAll = (req, res) => {
    User.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} users were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all users."
            });
        });
};