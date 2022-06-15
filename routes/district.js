var express = require('express');
var router = express.Router();
var districtController = require('../controllers/districtController');

router.post('/createDistrict', (req, res) => {  //  create District
    try {
        districtController.createDistrict(req).then(result => {
            console.log(result)
            res.status(200).send({ success: result.success, message: result.message });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("create District route error ----> ", error)
    }
});

router.get('/getAllDistricts', (req, res) => {     //  get all Districts
    try {
        districtController.getAllDistricts(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message, districts: result.result });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get All Districts route error ----> ", error)
    }
});

router.get('/getActiveDistricts', (req, res) => {     //  get active Districts
    try {
        districtController.getActiveDistricts(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message, districts: result.result });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get active Districts route error ----> ", error)
    }
});

router.post('/updateDistrict/:id', (req, res) => {  //  update district
    try {
        districtController.updateDistrict(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("update District route error ----> ", error)
    }
});

router.get('/getDistrictById/:id', (req, res) => {  //  get district by id
    try {
        districtController.getDistrictById(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message, district: result.district.result[0] });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get District By Id route error ----> ", error)
    }
});

router.get('/changeStatusInDistrict/:id', (req, res) => {   //  change status in District
    try {
        districtController.changeStatusInDistrict(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("change status in District route error ----> ", error)
    }
});

module.exports = router;