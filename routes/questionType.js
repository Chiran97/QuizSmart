var express = require('express');
var router = express.Router();
var questionTypeController = require('../controllers/questionTypeController');

router.post('/createQuestionType', (req, res) => {  //  create Paper Type
    try {
        questionTypeController.createQuestionType(req).then(result => {
            console.log(result)
            res.status(200).send({ success: result.success, message: result.message });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("create Question Type route error ----> ", error)
    }
});

router.get('/getAllQuestionTypes', (req, res) => {     //  get all Paper Types
    try {
        console.log('received1');
        questionTypeController.getAllQuestionTypes(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message, questionTypes: result.result });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get All Question Types route error ----> ", error)
    }
});

router.post('/updateQuestionType/:id', (req, res) => {  //  update Paper Type
    try {
        questionTypeController.updateQuetionType(req).then(result => {
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