var express = require('express');
var router = express.Router();
var excelSheetController = require('../controllers/excelSheet');

router.post('/postExcelSheet', (req, res) => {
    try {
        excelSheetController.postExcelSheet(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message });
        }).catch(err => {
            console.log('error -->', err);
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("postExcelSheet route error ====> ", error)
    }
});


module.exports = router;