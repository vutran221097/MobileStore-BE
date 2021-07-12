const db = require("../models");
const Product = db.product;
const fs = require('fs')
const {
    promisify
} = require('util')

const unlinkAsync = promisify(fs.unlink)

exports.create = (req, res) => {

    const product = new Product({
        name: req.body.name,
        image: req.file.filename,
        category: req.body.category,
        description: req.body.description,
        guarantee: req.body.guarantee,
        color: req.body.color,
        price: req.body.price,
        available: req.body.available,
    });

    product
        .save(product)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the product."
            });
        });
};


exports.findAllAndPagination = async (req, res) => {
    try {
        let condition = {};
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 8;
        const skip = (page - 1) * pageSize;
        const category = req.query.category
        const sortByPrice = parseInt(req.query.sortByPrice)
        const sortByDate = parseInt(req.query.sortByDate)

        if (req.query.category) {
            condition = {
                category: category
            }
        }

        if(req.query.sortByDate){
            sort = {
                createdAt:sortByDate
            }
        } else {
            sort = {
                price:sortByPrice
            }
        }

        let query = Product.find(
            condition
        )
        const total = await Product.find(
            condition
        ).countDocuments();

        let allProduct = Product.find({}).sort({
            createdAt: -1
        })

        const pages = Math.ceil(total / pageSize);

        query = query.skip(skip).limit(pageSize).sort(sort)
        const result = await query;
        const products = await allProduct;

        res.status(200).json({
            status: 'success',
            count: result.length,
            page,
            pages,
            products: result,
            allProduct: products
        })
    } catch (error) {
        console.log(error)
    }
};



exports.findOne = (req, res) => {
    const id = req.params.id;

    Product.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({
                    message: "Not found Product with id " + id
                });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({
                    message: "Error retrieving Product with id=" + id
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

    Product.findByIdAndUpdate(id, req.body)
        .then(data => {
            unlinkAsync(req.file.filename)
            data.image = req.file.filename || data.image,

                data
                .save()
                .then(() => res.send("The Product is update succesfully!"))
                .catch(err => res.status(400).send(`Error: ${err}`));
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Product with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;
    Product.findByIdAndRemove(id, req.body)
        .then(data => {
            unlinkAsync(`./uploads/${data.image}`)
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Product with id=${id}. Maybe Product was not found!`
                });
            } else {
                res.send({
                    message: "Product was deleted successfully!"
                });

            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Product with id=" + id
            });

        });
};

exports.deleteAll = (req, res) => {
    Product.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Products were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all Products."
            });
        });
};