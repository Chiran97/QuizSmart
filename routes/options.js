var express = require('express');
var router = express.Router();
var optionsController = require('../controllers/optionsController.js');

router.post('/addOptionsByQuestionId', (req, res) => {  //  Add Options
    try {
        optionsController.addOptionsByQuestionId(req).then(result => {
            console.log(result)
            res.status(200).send({ success: result.success, message: result.message });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("Add Options route error ----> ", error)
    }
});

router.get('/getOptionsByQuetionId/:id', (req, res) => {     //  get Options
    try {
        console.log('received1');
        optionsController.getOptionsByQuetionId(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message, options: result.result });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get Options By Question Id route error ----> ", error)
    }
});

router.post('/updateOptions/:id', (req, res) => {  //  update Options
    try {
        optionsController.updateOptions(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("update Question Type route error ----> ", error)
    }
});

module.exports = router;