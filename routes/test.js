var express = require('express');
var router = express.Router();
var dbCnnection = require('../config/config');

router.get("/", (req, res) => {
    dbCnnection.query("Select * From test", (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
})

module.exports = router;