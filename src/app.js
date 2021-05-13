const express = require('express');
require('./db/db')
const phoneList = require('./models/phone')

const app = express();
const port = process.env.PORT || 4000;

// app.get("/", async (req, res) => {
//     res.send("Hello")
// })

app.use(express.json())

//get request
app.get("/phones", async (req, res) => {
    try {
        const getPhones = await phoneList.find({})
        //const getPhones = await phoneList.find({}).sort({"price":1});           //sort
        res.send(getPhones)
    } catch (e) {
        res.status(400).send(e);
    }
})

//get request an item
app.get("/phones/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const getPhone = await phoneList.findById(_id)
        res.send(getPhone)
    } catch (e) {
        res.status(400).send(e);
    }
})

//update an item
app.patch("/phones/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const getPhone = await phoneList.findByIdAndUpdate(_id,req.body,{
            new:true
        })
        res.send(getPhone)
    } catch (e) {
        res.status(500).send(e);
    }
})

//delete an item
app.delete("/phones/:id", async (req, res) => {
    try {
        const getPhone = await phoneList.findByIdAndDelete(req.params.id)
        res.send(getPhone)
    } catch (e) {
        res.status(500).send(e);
    }
})

//post request
app.post("/phones", async (req, res) => {
    try {
        const addingPhone = new phoneList(req.body)
        console.log(req.body)
        const insertPhone = await addingPhone.save()
        res.status(201).send(insertPhone)
    } catch (e) {
        res.status(400).send(e);
    }
})

app.listen(port, () => {
    console.log(`Connect success at port ${port}`);
})