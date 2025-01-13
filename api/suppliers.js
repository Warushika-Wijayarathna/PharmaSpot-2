const express = require("express");
const bodyParser = require("body-parser");
const Datastore = require("@seald-io/nedb");
const app = express();
const path = require("path");

const dbPath = path.join(process.env.APPDATA, process.env.APPNAME, "server", "databases", "suppliers.db");

app.use(bodyParser.json());

module.exports = app;

let suppliersDB = new Datastore({
    filename: dbPath,
    autoload: true,
});

suppliersDB.ensureIndex({ fieldName: "_id", unique: true });

/**
 * GET endpoint: Get all suppliers.
 *
 * @param {Object} req request object.
 * @param {Object} res response object.
 * @returns {void}
 */
app.get("/suppliers", (req, res) => {
    suppliersDB.find({}, (err, docs) => {
        if (err) {
            res.status(500).json({
                error: "Internal Server Error",
                message: "An unexpected error occurred while retrieving suppliers.",
            });
        } else {
            res.json(docs);
        }
    });
});

/**
 * POST endpoint: Create a new supplier.
 *
 * @param {Object} req request object with supplier data in the body.
 * @param {Object} res response object.
 * @returns {void}
 */
app.post("/suppliers", (req, res) => {
    console.log(req.body);
    const supplier = req.body;
    suppliersDB.insert(supplier, (err, newDoc) => {
        if (err) {
            res.status(500).json({
                error: "Internal Server Error",
                message: "An unexpected error occurred while adding the supplier.",
            });
        } else {
            res.status(201).json(newDoc);
        }
    });
});

/**
 * PUT endpoint: Update a supplier by ID.
 *
 * @param {Object} req request object with supplier data in the body.
 * @param {Object} res response object.
 * @returns {void}
 */
app.put("/suppliers/:id", (req, res) => {
    const id = req.params.id;
    const supplier = req.body;
    suppliersDB.update({ _id: id }, supplier, {}, (err, numReplaced) => {
        if (err) {
            res.status(500).json({
                error: "Internal Server Error",
                message: "An unexpected error occurred while updating the supplier.",
            });
        } else if (numReplaced === 0) {
            res.status(404).json({
                error: "Not Found",
                message: `Supplier with ID ${id} not found.`,
            });
        } else {
            res.status(200).json({
                message: `Supplier with ID ${id} successfully updated.`,
            });
        }
    });
});

/**
 * DELETE endpoint: Delete a supplier by ID.
 *
 * @param {Object} req request object with supplier ID as a parameter.
 * @param {Object} res response object.
 * @returns {void}
 */
app.delete("/suppliers/:id", (req, res) => {
    const id = req.params.id;
    suppliersDB.remove({ _id: id }, {}, (err, numRemoved) => {
        if (err) {
            res.status(500).json({
                error: "Internal Server Error",
                message: "An unexpected error occurred while deleting the supplier.",
            });
        } else if (numRemoved === 0) {
            res.status(404).json({
                error: "Not Found",
                message: `Supplier with ID ${id} not found.`,
            });
        } else {
            res.status(200).json({
                message: `Supplier with ID ${id} successfully deleted.`,
            });
        }
    });
});


