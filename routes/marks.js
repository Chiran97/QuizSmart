var express = require('express');
var router = express.Router();
var marksController = require('../controllers/marksController');

router.post('/updateMarks', (req, res) => {  //  change Marks
    try {
        marksController.changeMarks(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("change Marks route error ----> ", error)
    }
});


router.get('/getmarksByPaperIdandUserId/:paperId/:userId', (req, res) => { // get marks By PaperId and UserId
    try {
        marksController.getmarksByPaperIdandUserId(req).then(result => {
            console.log(result)
            res.status(200).send({ success: result.success, message: result.message, marks: result.marks });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get marks By PaperId and UserId route error ----> ", error)
    }
});

router.get('/leaderBoard/:alYear/:subjectId/:districtId', (req, res) => { // leaderBoard
    try {
        marksController.leaderBoard(req).then(result => {
            console.log(result);
            res.status(200).send({ success: result.success, message: result.message, leaderBoard: result.leaderBoard });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("leaderBoard route error ----> ", error)
    }
});

router.get('/getLeaderboardByPaperId/:paperId/:alYear', (req, res) => { // get Leaderboard By PaperId
    try {
        marksController.getLeaderboardByPaperId(req).then(result => {
            console.log(result)
            res.status(200).send({ success: result.success, message: result.message, marks: result.marks });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get Leaderboard By PaperId route error ----> ", error)
    }
});

module.exports = router;