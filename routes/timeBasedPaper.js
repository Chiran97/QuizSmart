var express = require('express');
var router = express.Router();
var timeBasedPaperController = require('../controllers/timeBasedPaperController');

router.get('/getPastExamsByTeacherId/:teacherId', (req, res) => {    //  get Past Exams By TeacherId
    try {
        timeBasedPaperController.getPastExamsByTeacherId(req).then(result => {
            console.log(result);
            res.status(200).send({ success: result.success, message: result.message, papers: result.papers });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get Past Exams By TeacherId route error ----> ", error)
    }
});

router.get('/getCurrentExamsByTeacherId/:teacherId', (req, res) => {    //  get Current Exams By TeacherId
    try {
        timeBasedPaperController.getCurrentExamsByTeacherId(req).then(result => {
            console.log(result);
            res.status(200).send({ success: result.success, message: result.message, papers: result.papers });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get Current Exams By TeacherId route error ----> ", error)
    }
});

router.get('/getFutureExamsByTeacherId/:teacherId', (req, res) => {    //  get Future Exams By TeacherId
    try {
        timeBasedPaperController.getFutureExamsByTeacherId(req).then(result => {
            console.log(result);
            res.status(200).send({ success: result.success, message: result.message, papers: result.papers });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get Future Exams By TeacherId route error ----> ", error)
    }
});

router.get('/getExamTime/:paperId', (req, res) => {    //  get Exam Time
    try {
        timeBasedPaperController.getExamTime(req).then(result => {
            console.log(result);
            res.status(200).send({ success: result.success, message: result.message, examTime: result.examTime });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get Exam Time route error ----> ", error)
    }
});

router.get('/getAvailableExams', (req, res) => {    //  get Available Exams
    try {
        timeBasedPaperController.getAvailableExams(req).then(result => {
            console.log(result);
            res.status(200).send({ success: result.success, message: result.message, papers: result.papers });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get Available Exams route error ----> ", error)
    }
});

router.post('/editTimeBasedPaper/:paperId', (req, res) => {  //  edit Profile
    try {
        timeBasedPaperController.editTimeBasedPaper(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("edit Profile route error ----> ", error)
    }
});

module.exports = router;