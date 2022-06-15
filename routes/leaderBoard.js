var express = require('express');
var router = express.Router();
var leaderBoardController = require('../controllers/leaderBoardController');

router.post('/addMarks/:subject', (req, res) => {  //  change Marks
    try {
        leaderBoardController.addMarks(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("change Marks route error ----> ", error)
    }
});

router.get('/leaderBoard/:alYear/:subject/:districtId', (req, res) => { // leaderBoard
    try {
        leaderBoardController.leaderBoard(req).then(result => {
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

router.get('/islandRank/:userId/:alYear/:subject', (req, res) => { // islandRank
    try {
        leaderBoardController.islandRank(req).then(result => {
            console.log(result);
            res.status(200).send({ success: result.success, message: result.message, islandRank: result.islandRank, points: result.points });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("islandRank route error ----> ", error)
    }
});


router.get('/districtRank/:userId/:alYear/:subject/:districtId', (req, res) => { // districtRank
    try {
        leaderBoardController.districtRank(req).then(result => {
            console.log(result);
            res.status(200).send({ success: result.success, message: result.message, districtRank: result.districtRank, points: result.points });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("districtRank route error ----> ", error)
    }
});


module.exports = router;