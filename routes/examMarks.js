var express = require('express');
var router = express.Router();
var examMarksController = require('../controllers/examMarksController');

router.post('/changeExamMarks', (req, res) => {  //  change Exam Marks
    try {
        examMarksController.changeExamMarks(req).then(result => {
            console.log(result);
            res.status(200).send({ success: result.success, message: result.message });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("change Exam Marks route error ----> ", error)
    }
});

router.get('/getExamMarksByPaperIdandUserId/:paperId/:userId', (req, res) => { // get Exam marks By PaperId and UserId
    try {
        examMarksController.getExamMarksByPaperIdandUserId(req).then(result => {
            console.log(result)
            res.status(200).send({ success: result.success, message: result.message, examMarks: result.examMarks });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get exam marks By PaperId and UserId route error ----> ", error)
    }
});

router.get('/getExamLeaderboardByPaperId/:paperId', (req, res) => { // get Exam Leaderboard By PaperId
    try {
        examMarksController.getExamLeaderboardByPaperId(req).then(result => {
            console.log(result)
            res.status(200).send({ success: result.success, message: result.message, examMarks: result.examMarks });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get Exam Leaderboard By PaperId route error ----> ", error)
    }
});

module.exports = router;