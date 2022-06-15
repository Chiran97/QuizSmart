var express = require('express');
var router = express.Router();
var subjectController = require('../controllers/subjectController');

router.get('/getSubjectsByStreamId/:streamId', (req, res) => {    //  get Subjects by Stream Id
    try {
        subjectController.getSubjectsByStreamId(req).then(result => {
            console.log("subjects----->", result);
            res.status(200).send({ success: result.success, message: result.message, subjects: result.subjects });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get subjects By stream Id route error ----> ", error)
    }
});

router.get('/getSubjectById/:id', (req, res) => {    //  get Subject by id
    try {
        subjectController.getSubjectById(req).then(result => {
            console.log(result);
            res.status(200).send({ success: result.success, message: result.message, subject: result.subject[0] });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get Subject By Id route error ----> ", error)
    }
});

router.get('/getActiveSubjects', (req, res) => {     //  get active Subjects
    try {
        subjectController.getActiveSubjects(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message, subjects: result.result });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get active Subjects route error ----> ", error)
    }
});

module.exports = router;