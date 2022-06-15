var express = require('express');
var router = express.Router();
var teacherController = require('../controllers/teacherController');

router.post('/createTeacher', (req, res) => {  //  create Teacher
    try {
        teacherController.createTeacher(req).then(result => {
            console.log(result)
            res.status(200).send({ success: result.success, message: result.message });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("create Teacher route error ----> ", error);
    }
});

router.get('/getTeacherById/:id', (req, res) => {    //  get Teacher by id
    try {
        teacherController.getTeacherById(req).then(result => {
            console.log(result);
            res.status(200).send({ success: result.success, message: result.message, teacher: result.teacher.result[0] });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get Teacher By Id route error ----> ", error)
    }
});

router.get('/getAllDatailsTeacherByPaperId/:paperId', (req, res) => {    //  get All Datails Teacher By paperId
    try {
        teacherController.getAllDatailsTeacherByPaperId(req).then(result => {
            console.log(result);
            res.status(200).send({ success: result.success, message: result.message, teacher: result.teacher.result[0] });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get All Datails Teacher By paperId route error ----> ", error)
    }
});

router.get('/getTeacherByUserId/:userId', (req, res) => {    //  get Teacher by userid
    try {
        teacherController.getTeacherByUserId(req).then(result => {
            console.log(result);
            res.status(200).send({ success: result.success, message: result.message, teacher: result.teacher.result[0] });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get Teacher By userid route error ----> ", error)
    }
});

router.get('/getAllTeachers', (req, res) => {    //  get All Teachers
    try {
        teacherController.getAllActiveTeachers(req).then(result => {
            console.log(result);
            res.status(200).send({ success: result.success, message: result.message, teachers: result.teachers.result });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get All Teachers route error ----> ", error)
    }
});

router.post('/searchActiveTeachers', (req, res) => {  //  search Active Teachers
    try {
        teacherController.searchActiveTeachers(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message, activeTeachers: result.result.result });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("search Active Teachers route error ----> ", error)
    }
});

router.post('/editPromoImage/:id', (req, res) => {  //  edit Profile
    try {
        console.log('req ', req.files);
        teacherController.editPromoImage(req).then(result => {
            console.log(result)
            res.status(200).send({ success: result.success, message: result.message, previousUrl: result.previousUrl });

            if (result.previousUrl.length > 0) {
                console.log('delete the previous image');
                teacherController.deleteImage(result.previousUrl);
                console.log('deleted');            }

        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("Promo Image update route error ----> ", error);
    }
});

router.post('/editTeacherDetails/:id', (req, res) => {  //  edit Teacher Details
    try {
        teacherController.editTeacherDetails(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("edit Teacher Details route error ----> ", error)
    }
});

module.exports = router;