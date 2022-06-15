var express = require('express');
var router = express.Router();
var questionController = require('../controllers/newQuestionController');


router.post('/addNewQuestion', (req, res) => { // add new questions By Paper Id
    try {
        questionController.addQuestionsByPaperId(req).then(result => {
            console.log(result)
            res.status(200).send({ success: result.success, message: result.message, questions: result.questions });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("add Question By Paper Id route error ----> ", error)
    }
});

module.exports = router;