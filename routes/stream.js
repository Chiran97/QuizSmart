var express = require('express');
var router = express.Router();
var streamController = require('../controllers/streamController');

router.post('/createStream', (req, res) => {  //  create Stream
    try {
        streamController.createStream(req).then(result => {
            console.log(result)
            res.status(200).send({ success: result.success, message: result.message });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("create Stream route error ----> ", error)
    }
});

router.get('/getAllStreams', (req, res) => {     //  get all Streams
    try {
        streamController.getAllStreams(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message, streams: result.result });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get All Streams route error ----> ", error)
    }
});

router.get('/getActiveStreams', (req, res) => {     //  get active Streams
    try {
        streamController.getActiveStreams(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message, streams: result.result });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get active Streams route error ----> ", error)
    }
});

router.post('/updateStream/:id', (req, res) => {  //  update Stream
    try {
        streamController.updateStream(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("update Stream route error ----> ", error)
    }
});

router.get('/getStreamById/:id', (req, res) => {    //  get Stream by id
    try {
        streamController.getStreamById(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message, stream: result.stream.result[0] });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get stream By Id route error ----> ", error)
    }
});

router.get('/changeStatusInStream/:id', (req, res) => { //  change status in Stream
    try {
        streamController.changeStatusInStream(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("change status in Stream route error ----> ", error)
    }
});

module.exports = router;