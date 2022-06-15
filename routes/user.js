var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');

router.post('/verifyPassword/:id', (req, res) => {  //  verify Password
    try {
        userController.verifyPassword(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("verify Password route error ----> ", error)
    }
});

router.post('/editProfile/:id', (req, res) => {  //  edit Profile
    try {
        userController.editProfile(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("edit Profile route error ----> ", error)
    }
});

router.post('/searchUser', (req, res) => {  //  search User
    try {
        userController.searchUser(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message, result: result.result });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("search User route error ----> ", error)
    }
});

router.post('/searchActiveUsers', (req, res) => {  //  search Active Users
    try {
        userController.searchActiveUsers(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message, activeUsers: result.result });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("search active User route error ----> ", error)
    }
});

router.get('/getAllStudents', (req, res) => {     //  get all Students
    try {
        userController.getAllStudents(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message, students: result.result });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get All Students route error ----> ", error)
    }
});

router.get('/changeStatusInUser/:id', (req, res) => {  //  change status in User
    try {
        userController.changeStatusInUser(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("change status in User route error ----> ", error)
    }
});

router.get('/getUserByEmail/:email', (req, res) => {    //  get User by Email
    try {
        userController.getUserByEmail(req).then(result => {
            console.log(result);
            res.status(200).send({ success: result.success, message: result.message, user: result.user[0] });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get User By Email route error ----> ", error)
    }
});

router.get('/getUserById/:id', (req, res) => {    //  get User by Id
    try {
        userController.getUserById(req).then(result => {
            console.log(result);
            res.status(200).send({ success: result.success, message: result.message, user: result.user[0] });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("get User By Email route error ----> ", error)
    }
});

router.get('/userCount', (req, res) => {  //  User Count
    try {
        userController.userCount(req).then(result => {
            res.status(200).send({ success: result.success, message: result.message, studentCount: result.result });
        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("User count route error ----> ", error)
    }
});

router.post('/editProfilePicture/:id', (req, res) => {  //  edit Profile
    try {
        // singleUploadImg(req, res, function (err, some) {
        //     if (err) {
        //         res.status(404).send({ success: false, message: err });
        //     }
        //     else {
        //         var imageUrl = req.file.location;
        //         console.log('imageurllocation', req.file);
        //         userController.editProfilePicture(req, imageUrl).then(result => {
        //             console.log('lengthr', result.previousUrl.length);

        //             res.status(200).send({ success: result.success, message: result.message });

                    // if (result.previousUrl.length > 0) {
                    //     upload.deleteImage(result.previousUrl);
                    // }
        //         }).catch(err => {
        //             res.status(500).send(err);
        //         })
        //     }
        // });
        console.log('reqqqqq', req.files);
        userController.editProfilePicture(req).then(result => {
            console.log(result)
            res.status(200).send({ success: result.success, message: result.message, previousUrl: result.previousUrl });

            if (result.previousUrl.length > 0 && result.previousUrl != 'https://mymcqbucketversion1.s3.ap-south-1.amazonaws.com/profilePictures/person.jpg') {
                console.log('delete yhe prevous');
                userController.deleteImage(result.previousUrl);
                console.log('deleted');            }

        }).catch(err => {
            res.status(500).send(err);
        }
        )
    } catch (error) {
        console.log("profile picture update route error ----> ", error);
    }
});

module.exports = router;