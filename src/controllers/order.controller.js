const db = require("../models");
const Order = db.order;


exports.create = (req, res) => {

    const order = new Order({
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        cart: req.body.cart,
        payMethod: req.body.payMethod,
        totalPrice:req.body.totalPrice,
        status: req.body.status
    });

    order
        .save(order)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the order."
            });
        });
};


exports.findAllAndPagination = async (req, res) => {
    try {
        let query = Order.find().sort({
            createdAt: -1
        });

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 8;
        const skip = (page - 1) * pageSize;
        const total = await Order.countDocuments();

        const pages = Math.ceil(total / pageSize);
        query = query.skip(skip).limit(pageSize);

        const result = await query;

        res.status(200).json({
            status: 'success',
            count: result.length,
            page,
            pages,
            order: result
        })
    } catch (error) {
        console.log(error)
    }
};

exports.findByPhoneNum = (req, res) => {
    phoneNum_search = parseInt(req.params.phone);
    Order.aggregate(
            [{
                $match: {
                    phone: phoneNum_search,
                }
            }]
        )
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving order."
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Order.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({
                    message: "Not found order with id " + id
                });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({
                    message: "Error retrieving order with id=" + id
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

    Order.findByIdAndUpdate(id, req.body)
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
    Order.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete order with id=${id}. Maybe order was not found!`
                });
            } else {
                res.send({
                    message: "order was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete order with id=" + id
            });
        });
};

exports.deleteAll = (req, res) => {
    Order.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} orders were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all orders."
            });
        });
};