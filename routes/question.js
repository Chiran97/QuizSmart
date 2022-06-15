var express = require('express');
var router = express.Router();
var questionController = require('../controllers/questionController');

router.get('/getQuestionsByPaperId/:paperId', (req, res) => { // get Questions By Paper Id
    try {
        questionController.getQuestionsByPaperIdNew(req).then(result => {
            console.log(result)
            res.status(200).send({ success: result.success, message: result.message, questions: result.questions });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get Questions By Paper Id route error ----> ", error)
    }
});

router.get('/getQuestionsByPaperIdNew/:paperId', (req, res) => { // get Questions By Paper Id New
    try {
        questionController.getQuestionsByPaperIdNew(req).then(result => {
            console.log(result)
            res.status(200).send({ success: result.success, message: result.message, questions: result.questions });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get Questions By Paper Id route error ----> ", error)
    }
});

router.post('/addQuestion', (req, res) => { // get Questions By Paper Id
    try {
        console.log('reqqqqq', req.body);
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

router.post('/addNewQuestion', (req, res) => { // add new questions By Paper Id
    try {
        console.log(req.files);
        console.log(req.body);
        questionController.addQuestionsByPaperId(req).then(result => {
            console.log(result)
            res.status(200).send({ success: result.success, message: result.message, question: result.question });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("add Question By Paper Id route error ----> ", error)
    }
});

router.post('/addAnswersByQuestionId', (req, res) => { // add Answers By Question Id
    try {
        console.log(req.files);
        questionController.addAnswersByQuestionId(req).then(result => {
            console.log(result)
            res.status(200).send({ success: result.success, message: result.message, questions: result.questions });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("add Answers By Question Id route error ----> ", error)
    }
});

router.post('/addQuestionsOptions', (req, res) => { // add Questions Options
    try {
        console.log(req.files);
        questionController.addQuestionsOptions(req).then(result => {
            console.log(result)
            res.status(200).send({ success: result.success, message: result.message, questions: result.questions });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("add Questions Options route error ----> ", error)
    }
});

module.exports = router;