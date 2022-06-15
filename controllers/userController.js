var dbConnection = require('../config/config');
const authConfig = require('../config/authConfig');
var AWS = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
require('dotenv').config();

var s3Bucket = new AWS.S3({ params: { Bucket: process.env.bucketName } });

AWS.config.update({
    accessKeyId: process.env.accessKeyIdIam,
    secretAccessKey: process.env.secretAccessKeyIam,
    region: process.env.region
});

const promisifyConQuery = (sql) => {

    return new Promise((resolve, reject) => {

        dbConnection.query(sql, function (err, result, fields) {

            if (err) {

                console.log("promisifyConQuery: not successful ---> ", err)
                resolve({ success: false, message: "not successful" });

            } else {

                console.log("promisifyConQuery: successful");
                resolve({ success: true, message: "successful", result: result });

            }
        })

    });

};

exports.verifyPassword = async (req) => { // verify Password

    try {

        let sql = "SELECT * FROM user WHERE id = '" + req.params.id + "'";

        const currentUser = await promisifyConQuery(sql);
        console.log(currentUser);

        const verifyPass = authConfig.verifyPassword(req.body.verifyPassword, currentUser.result[0].password);

        if (verifyPass.success) {

            return ({ success: true, message: "verifyPassword!!" });

        } else {

            return ({ success: false, message: "not verifyPassword!!" });

        }

    } catch (error) {

        console.log("verify Password controller error ----> ", error);

    }

};

exports.editProfile = async (req) => { // edit Profile
    try {

        let sql = "SELECT * FROM user WHERE id = '" + req.params.id + "'";

        const currentUser = await promisifyConQuery(sql);
        console.log(currentUser);

        if (!currentUser.success) {

            return ({ success: false, message: "not get this user!!" });

        } else {

            let firstName = currentUser.result[0].firstName;
            let lastName = currentUser.result[0].lastName;
            let email = currentUser.result[0].email;
            let alYear = currentUser.result[0].alYear;
            let districtId = currentUser.result[0].districtId;
            let password = currentUser.result[0].password;

            var updatedQuery = "";

            if (firstName != req.body.firstName) {

                updatedQuery = "UPDATE user SET firstName='" + req.body.firstName + "' WHERE id ='" + req.params.id + "'";

            } else if (lastName != req.body.lastName) {

                updatedQuery = "UPDATE user SET lastName='" + req.body.lastName + "' WHERE id ='" + req.params.id + "'";

            } else if (email != req.body.email) {

                var checkEmail = "SELECT email from user WHERE email = '" + req.body.email + "'";
                const checkUserQuery = await promisifyConQuery(checkEmail);

                if (checkUserQuery.result.length != 0) {

                    return ({ success: false, message: 'Email Already Exists!' });

                } else {

                    updatedQuery = "UPDATE user SET email='" + req.body.email + "' WHERE id ='" + req.params.id + "'";

                }


            } else if (alYear != req.body.alYear) {

                updatedQuery = "UPDATE user SET alYear='" + req.body.alYear + "' WHERE id ='" + req.params.id + "'";

            } else if (districtId != req.body.districtId) {

                updatedQuery = "UPDATE user SET districtId='" + req.body.districtId + "' WHERE id ='" + req.params.id + "'";

            } else if (req.body.password != '') {

                const verifyPass = authConfig.verifyPassword(req.body.password, password);

                console.log(verifyPass);

                if (verifyPass.success) {

                    updatedQuery = "";

                } else {

                    const newPassword = await authConfig.generateHash(req.body.password);

                    updatedQuery = "UPDATE user SET password='" + newPassword.bcryptPassword + "' WHERE id ='" + req.params.id + "'";

                }

            } else {

                updatedQuery = "";

            }

            if (updatedQuery == "") {

                return ({ success: false, message: "not new password" });

            } else {

                const updatedQueryRes = await promisifyConQuery(updatedQuery);

                if (!updatedQueryRes.success) {

                    return ({ success: false, message: "not successfully updated!!" });

                } else {

                    return ({ success: true, message: "successfully updated!!" });

                }

            }


        }

    } catch (error) {

        console.log("edit Profile controller error ----> ", error);

    }
};

exports.searchUser = async (req) => {  //  search User
    try {

        if (req.body.searchString === '') {

            if (req.body.district === '') {

                var searchQuery = "SELECT * from user WHERE (userTypeId = 1) ";

            } else {

                var searchQuery = "SELECT * from user WHERE (userTypeId = 1) AND (districtId IN (SELECT id FROM district WHERE name= '" + req.body.district + "'))";

            }

        } else {

            var searchString = req.body.searchString;

            var wordArr = searchString.split(" ");

            var stringOfIN = "";

            for (var i = 0; i < wordArr.length; i++) {

                var temp = "";
                var temp2 = "";

                if (i === 1 || ((i === 0) && wordArr.length === 1)) {

                    var symbol1 = "'";

                } else {

                    var symbol1 = "";

                }

                temp = symbol1.concat(stringOfIN)
                temp2 = temp.concat(wordArr[i]);

                if (i === (wordArr.length) - 1) {

                    var symbol2 = "'";

                } else {

                    var symbol2 = "','";

                }

                stringOfIN = temp2.concat(symbol2);

            }

            console.log(stringOfIN);

            console.log(wordArr);

            if (req.body.district === '') {

                var searchQuery = "SELECT * from user WHERE (userTypeId = 1) AND ((firstName IN (" + stringOfIN + ")) OR (lastName IN (" + stringOfIN + ")) OR (alYear IN (" + stringOfIN + ")) OR (email IN (" + stringOfIN + ")))";

            } else {

                var searchQuery = "SELECT * from user WHERE (userTypeId = 1) AND (districtId IN (SELECT id FROM district WHERE name= '" + req.body.district + "')) AND ((firstName IN (" + stringOfIN + ")) OR (lastName IN (" + stringOfIN + ")) OR (alYear IN (" + stringOfIN + ")) OR (email IN (" + stringOfIN + ")))";

            }

        }

        if (searchQuery === '') {

            return ({ success: false, message: "no search" });

        } else {

            console.log("search query ---> ", searchQuery);

            const users = await promisifyConQuery(searchQuery);
            console.log("users query ----> ", users);

            if (!users.success) {

                return ({ success: false, message: "no search value" });

            } else {

                return ({ success: true, message: "users are got!!", result: users });

            }

        }

    } catch (error) {

        console.log("search User controller error ----> ", error);

    }

};


exports.searchActiveUsers = async (req) => {  //  search Active Users
    try {

        var searchString = req.body.searchString;

        var wordArr = searchString.split(" ");

        var stringOfIN = "";

        for (var i = 0; i < wordArr.length; i++) {

            var temp = "";
            var temp2 = "";

            if (i === 1 || ((i === 0) && wordArr.length === 1)) {

                var symbol1 = "'";

            } else {

                var symbol1 = "";

            }

            temp = symbol1.concat(stringOfIN)
            temp2 = temp.concat(wordArr[i]);

            if (i === (wordArr.length) - 1) {

                var symbol2 = "'";

            } else {

                var symbol2 = "','";

            }

            stringOfIN = temp2.concat(symbol2);

        }

        console.log(stringOfIN);

        console.log(wordArr);


        var searchQuery = "SELECT * from user WHERE (status = 1) AND (userTypeId = 1) AND ((firstName IN (" + stringOfIN + ")) OR (lastName IN (" + stringOfIN + ")) OR (alYear IN (" + stringOfIN + ")) OR (email IN (" + stringOfIN + ")))";



        if (searchQuery === '') {

            return ({ success: false, message: "no search" });

        } else {

            console.log("search query ---> ", searchQuery);

            const activeUsers = await promisifyConQuery(searchQuery);
            console.log("users query ----> ", activeUsers);

            if (!activeUsers.success) {

                return ({ success: false, message: "no search value" });

            } else {

                return ({ success: true, message: "active users are got!!", result: activeUsers });

            }

        }

    } catch (error) {

        console.log("search User controller error ----> ", error);

    }

};

exports.getAllStudents = async (req) => {     //  get all Students

    try {

        var allStudents = "SELECT * from user WHERE (userTypeId = 1)";
        const allStudentsQuery = await promisifyConQuery(allStudents);
        console.log("all Students query ----> ", allStudentsQuery);

        if (!allStudentsQuery.success) {
            return ({ success: false, message: "all Students are not got!!" });
        } else {
            return ({ success: true, message: "all Students are got!!", result: allStudentsQuery.result });
        }

    } catch (error) {

        console.log("get all Students controller error ----> ", error);

    }
}

exports.changeStatusInUser = async (req) => {  //  change status in User
    try {

        var checkUserQuery = "SELECT * from user WHERE id = '" + req.params.id + "'";

        const user = await promisifyConQuery(checkUserQuery);

        if (user === null) {

            return ({ success: false, message: 'user is not got!!' });

        } else {

            if (user.result[0].status === 0) {

                var changeStatus = "UPDATE user SET status = 1 WHERE id ='" + req.params.id + "'";
                const changedUser = await promisifyConQuery(changeStatus);

                if (!changedUser.success) {

                    return ({ success: false, message: "User is not updated to Active mode!!" });

                } else {

                    return ({ success: true, message: "User is updated to Active mode!!" });

                }

            } else {

                var changeStatus = "UPDATE user SET status = 0 WHERE id ='" + req.params.id + "'";
                const changedUser = await promisifyConQuery(changeStatus);

                if (!changedUser.success) {

                    return ({ success: false, message: "User is not updated to Inactive mode!!" });

                } else {

                    return ({ success: true, message: "User is updated to Inactive mode!!" });

                }
            }
        }

    } catch (error) {
        console.log("change status in User controller error ----> ", error);
    }
};

exports.getUserByEmail = async (req) => {    //  get User by email
    try {

        var sql = "SELECT * from user WHERE email = '" + req.params.email + "'";

        const sqlQuery = await promisifyConQuery(sql);

        if (sqlQuery == null) {
            return ({ success: false, message: 'user is not got!!' });
        }
        return ({ success: true, message: 'user is got!!', user: sqlQuery.result });

    } catch (error) {
        console.log("get User By email controller error ----> ", error);
    }
};

exports.getUserById = async (req) => {    //  get User by id
    try {

        var sql = "SELECT * from user WHERE id = '" + req.params.id + "'";

        const sqlQuery = await promisifyConQuery(sql);

        if (sqlQuery == null) {
            return ({ success: false, message: 'user is not got!!' });
        }
        return ({ success: true, message: 'user is got!!', user: sqlQuery.result });

    } catch (error) {
        console.log("get User By id controller error ----> ", error);
    }
};

exports.userCount = async (req) => {     //  User count

    try {

        var studentCount = "SELECT COUNT(id) AS studentCount from user WHERE (userTypeId = 1)";
        const count = await promisifyConQuery(studentCount);
        console.log("Student count query ----> ", count);

        if (!count.success) {
            return ({ success: false, message: "all Students count are not got!!" });
        } else {
            return ({ success: true, message: "all Students count are got!!", result: count.result[0].studentCount });
        }

    } catch (error) {

        console.log("User count controller error ----> ", error);

    }
}

exports.editProfilePicture = async (req) => { // edit Profile
    try {

        let sql = "SELECT * FROM user WHERE id = '" + req.params.id + "'";

        const currentUser = await promisifyConQuery(sql);
        console.log(currentUser);

        if (!currentUser.success) {

            return ({ success: false, message: "not get this user!!" });

        } else {

            if ((req.files.image != null) && (req.files.image.mimetype === 'image/jpeg' || req.files.image.mimetype === 'image/jpg' || req.files.image.mimetype === 'image/png' || req.files.image.mimetype === 'application/octet-stream')) {

                console.log('not nul image');
                console.log("user details", req.files);
                var image = req.files.image;

                const profilePictureImgUrl = await getProfileImgUrl(image);

                console.log("img url received", profilePictureImgUrl.result);

                let location = profilePictureImgUrl.result;
                let profileImageUrl = currentUser.result[0].profileImageUrl;
                console.log('url', profileImageUrl);

                var updatedQuery = "";

                updatedQuery = "UPDATE user SET profileImageUrl='" + location + "' WHERE id ='" + req.params.id + "'";

                const updatedQueryRes = await promisifyConQuery(updatedQuery);

                if (!updatedQueryRes.success) {

                    return ({ success: false, message: "Url is not successfully updated!!" });

                } else {

                    return ({ success: true, message: "Url is successfully updated!!", previousUrl: profileImageUrl });

                }

            } else {

                return ({ success: false, message: "Image is null or image type is not compatible!" });

            }
        }

    } catch (error) {

        console.log("edit Profile picture controller error ----> ", error);

    }
};

const getProfileImgUrl = (req) => {
    return new Promise((resolve, reject) => {
        console.log('req, buff', req);
        buf = Buffer.from(req.data);

        var dataS3 = {
            Key: 'profilePictures' + '/' + Date.now().toString() + '-' + req.name.replace(/ /g, ""),
            Body: buf,
            ACL: 'public-read',
            ContentEncoding: 'base64',
            ContentType: req.mimetype
        };

        s3Bucket.upload(dataS3, function (err, data) {
            if (err) {
                console.log(err);
                console.log('Error uploading data: ', data);
                resolve({ success: false, result: data });
            } else {
                console.log('successfully uploaded the image!', data.Location);
                resolve({ success: true, result: data.Location });
            }
        });
    });
}

exports.deleteImage = async (req) => {
    var item = req.split(".com/");
    console.log('spli', item[1]);
    // var item = req;
    var params = { Bucket: process.env.bucketName, Key: item[1] };
    console.log('params', params);
    s3Bucket.deleteObject(params, function (err, data) {
        if (err) {
            console.log('Error occured while deleting');
        } else {
            console.log('Successfully deleted');
        }
    });
}

// exports.uploadS3 = multer({
//     storage: multerS3({
//       s3: s3Bucket,
//       acl: 'public-read',
//       bucket: bucketName,
//       contentType: multerS3.AUTO_CONTENT_TYPE,
//       metadata: (req, file, cb) => {
//           if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
//             console.log('file', file);
//             cb(null, {fieldName: file.fieldname})
//           } else {
//               cb("File type is not compatible");
//           }   
//       },
//       key: (req, file, cb) => {
//         cb(null, Date.now().toString() + '-' + file.originalname.replace(/ /g, ""))
//       }
//     })
//   });

//   exports.deleteImage = async(req) => {
//    var item =  req.split(".com/");
//    console.log('spli',item[1]);
//     // var item = req;
//     var params = { Bucket: bucketName, Key: item[1] };
//     console.log('params', params);
//     s3Bucket.deleteObject(params, function (err, data) {
//         if (err) { 
//             console.log('Error occured while deleting');
//         } else {
//           console.log('Successfully deleted');
//         }
//     });
// }