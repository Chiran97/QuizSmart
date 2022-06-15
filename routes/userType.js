var express = require('express');
var router = express.Router();
var userTypeController = require('../controllers/userTypeController');

router.post('/createUserType', (req, res) => {  //  create User type
    try {
        userTypeController.createUserType(req).then(result => {
            console.log(result)
            res.status(200).send({ success: result.success, message: result.message });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("create User type route error ----> ", error)
    }
});

router.get('/getAllUserTypes', (req, res) => {     //  get all User types
    try {
        userTypeController.getAllUserTypes(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message, userTypes: result.result });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get All User types route error ----> ", error)
    }
});

router.post('/updateUserType/:id', (req, res) => {  //  update User type
    try {
        userTypeController.updateUserType(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("update User type route error ----> ", error)
    }
});

router.get('/getUserTypeById/:id', (req, res) => {  //  get User type by id
    try {
        userTypeController.getUserTypeById(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message, userType: result.userType.result[0] });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get User type By Id route error ----> ", error)
    }
});

router.get('/changeStatusInUserType/:id', (req, res) => {   //  change status in User type
    try {
        userTypeController.changeStatusInUserType(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("change status in User type route error ----> ", error)
    }
});

module.exports = router;