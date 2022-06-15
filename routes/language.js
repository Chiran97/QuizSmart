var express = require('express');
var router = express.Router();
var languageController = require('../controllers/languageController');

router.post('/createLanguage', (req, res) => {  //  create Language
    try {
        languageController.createLanguage(req).then(result => {
            console.log(result)
            res.status(200).send({ success: result.success, message: result.message });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("create Language route error ----> ", error)
    }
});

router.get('/getAllLanguages', (req, res) => {     //  get all Languages
    try {
        languageController.getAllLanguages(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message, languages: result.result });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get All Languages route error ----> ", error)
    }
});

router.post('/updateLanguage/:id', (req, res) => {  //  update Language
    try {
        languageController.updateLanguage(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("update Language route error ----> ", error)
    }
});

router.get('/getLanguageById/:id', (req, res) => {  //  get Language by id
    try {
        languageController.getLanguageById(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message, language: result.language.result[0] });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get Language By Id route error ----> ", error)
    }
});

router.get('/changeStatusInLanguage/:id', (req, res) => {   //  change status in Language
    try {
        languageController.changeStatusInLanguage(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("change status in Language route error ----> ", error)
    }
});

module.exports = router;