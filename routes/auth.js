var express = require('express');
var router = express.Router();
var authController = require('../controllers/authController');

router.post('/signUp', (req, res) => {  //  User sign Up
    try {
        authController.userSignUp(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message, token: result.token });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("sign up route error ----> ", error)
    }
});

router.post('/signIn', (req, res) => {  //  User sign in
    try {
        console.log(req.body);
        authController.userSignIn(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message, token: result.token, userTypeId: result.userTypeId });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("sign in route error ----> ", error)
    }
});

router.post('/forgotPassword', (req, res) => {  //  forgot Password
    try {
        authController.forgotPassword(req).then(result => {
            console.log(result);
            res.status(200).send({ success: result.success, message: result.message });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("forgot Password route error ----> ", error)
    }
});

module.exports = router;