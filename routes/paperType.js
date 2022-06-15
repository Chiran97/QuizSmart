var express = require('express');
var router = express.Router();
var paperTypeController = require('../controllers/paperTypeController');

router.post('/createPaperType', (req, res) => {  //  create Paper Type
    try {
        paperTypeController.createPaperType(req).then(result => {
            console.log(result)
            res.status(200).send({ success: result.success, message: result.message });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("create Paper Type route error ----> ", error)
    }
});

router.get('/getAllPaperTypes', (req, res) => {     //  get all Paper Types
    try {
        paperTypeController.getAllPaperTypes(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message, paperTypes: result.result });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get All Paper Types route error ----> ", error)
    }
});

router.get('/getActivePaperTypes', (req, res) => {     //  get active Paper Types
    try {
        paperTypeController.getActivePaperTypes(req).then(result => {
            console.log(result);
            res.status(200).send({ success: result.success, message: result.message, paperTypes: result.result });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get active Paper Types route error ----> ", error)
    }
});

router.post('/updatePaperType/:id', (req, res) => {  //  update Paper Type
    try {
        paperTypeController.updatePaperType(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("update Paper Type route error ----> ", error)
    }
});

router.get('/getPaperTypeById/:id', (req, res) => { //  get Paper type by id
    try {
        paperTypeController.getPaperTypeById(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message, paperType: result.paperType.result[0] });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get Paper type By Id route error ----> ", error)
    }
});

router.get('/changeStatusInPaperType/:id', (req, res) => {  //  change status in Paper type
    try {
        paperTypeController.changeStatusInPaperType(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("change status in Paper Type route error ----> ", error)
    }
});

router.get('/getPaperTypesBySubjectId/:subjectId', (req, res) => {    //  get PaperTypes By Subject Id
    try {
        paperTypeController.getPaperTypesBySubjectId(req).then(result => {
            console.log("subjects----->", result);
            res.status(200).send({ success: result.success, message: result.message, papertypes: result.papertypes });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get PaperTypes By Subject Id route error ----> ", error)
    }
});

module.exports = router;