var express = require('express');
var router = express.Router();
var paperController = require('../controllers/paperController');

router.get('/getActivePapersBySubjectIdAndPaperTypeId/:subjectId/:paperTypeId', (req, res) => {     //  get Active Papers By SubjectId And PaperTypeId
    try {
        paperController.getActivePapersBySubjectIdAndPaperTypeId(req).then(result => {
            console.log(result);
            res.status(200).send({ success: result.success, message: result.message, papers: result.result });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get active Papers route error ----> ", error)
    }
});

router.get('/getPaperById/:id', (req, res) => { //  get Paper by id
    try {
        paperController.getPaperById(req).then(result => {
            console.log(result)
            res.status(200).send({ success: result.success, message: result.message, paper: result.paper.result[0] });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get Paper By Id route error ----> ", error)
    }
});

router.post('/addPaper', (req, res) => { //  get Paper by id
    try {
        console.log(req.files);
        console.log(req.body);
        paperController.addPaper(req).then(result => {
            console.log(result)
            res.status(200).send({ success: result.success, message: result.message, paper: result.paper});
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("add Paper route error ----> ", error)
    }
});

// router.post('/addEquation', (req, res) => { //  get Paper by id
//     try {
//         console.log(req.files);
//         console.log(req.body);
//         paperController.createEquation(req).then(result => {
//             console.log(result)
//             res.status(200).send({ success: result.success, message: result.message});
//         }).catch(err => {
//             res.status(500).send(err);
//         }
//         )
//     } catch (error) {
//         console.log("add Paper route error ----> ", error)
//     }
// });

// router.get('/getEquation', (req, res) => { //  get Paper by id
//     try {
//         paperController.getAllEquations(req).then(result => {
//             res.status(200).send({ success: result.success, message: result.message, equations: result.result });
//         }).catch(err => {
//             res.status(500).send(err);
//         }
//         )
//     } catch (error) {
//         console.log("get All Streams route error ----> ", error)
//     }
// });


module.exports = router;