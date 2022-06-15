var express = require('express');
var router = express.Router();
var dbConnection = require('../config/config');

var AWS = require('aws-sdk');
require('dotenv').config();


AWS.config.update({
    accessKeyId: process.env.accessKeyIdIam,
    secretAccessKey: process.env.secretAccessKeyIam,
    region: process.env.region
});

var s3Bucket = new AWS.S3({ params: { Bucket: process.env.bucketName } });

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

const getImgUrl = (req) => {
    return new Promise((resolve, reject) => {
        console.log('req, buff', req);
        buf = Buffer.from(req[0].data);

        var dataS3 = {
            Key: 'teacherPromotionImages' + '/' + Date.now().toString() + '-' + req[1].replace(/ /g, ""),
            Body: buf,
            ACL: 'public-read',
            ContentEncoding: 'base64',
            ContentType: req[0].mimetype
        };

        s3Bucket.upload(dataS3, function (err, data) {
            if (err) {
                console.log(err);
                console.log('Error uploading promotion data: ', data);
                resolve({ success: false, result: data });
            } else {
                console.log('successfully uploaded the image!', data.Location);
                resolve({ success: true, result: data.Location });
            }
        });
    });
}

exports.createTeacher = async (req) => {     //  create Teacher

    try {
        var checkTeachers = "SELECT * from Teacher WHERE email = '" + req.body.email + "'";
        const checkTeacherQuery = await promisifyConQuery(checkTeachers);
        console.log("check Teacher query ----> ", checkTeacherQuery);

        if (checkTeacherQuery.result.length != 0) {

            return ({ success: false, message: 'Teacher Already Exists!' });

        } else {

            var promotionImageUrl = null;

            if (req.files == null) {

                promotioImageUrl = null;
                console.log("null image");

            } else {

                var promotionImage = req.files.promotionImage;

                if (promotionImage.mimetype === 'image/jpeg' || promotionImage.mimetype === 'image/jpg' || promotionImage.mimetype === 'image/png') {

                    console.log('not nul image123');
                    var promotionImg = 'promotionImg';
                    var details = [promotionImage, req.body.fullName, promotionImg];
                    const promotionImgUrl = await getImgUrl(details);
                    promotionImageUrl = promotionImgUrl.result;
                    console.log("img url received", promotionImageUrl);

                } else {

                    return ({ success: false, message: "questionImg mimetype" });
                }
            }
            var addTeacherQuery = "INSERT INTO Teacher (fullName, qualification, contactNumber,userTypeId, email, profileImageUrl) VALUES ('" +
                req.body.fullName +
                "','" +
                req.body.qualification +
                "','" +
                req.body.contactNumber +
                "','" +
                "1" +
                "','" +
                req.body.email +
                "','" +
                promotionImageUrl +
                "')";


            if (addTeacherQuery != "") {

                const teacherQuery = await promisifyConQuery(addTeacherQuery);
                console.log("Teacher query ----> ", teacherQuery);

                if (!teacherQuery.success) {
                    return ({ success: false, message: "Teacher Details are not inserted!!" });
                } else {
                    return ({ success: true, message: "Teacher Deatils are inserted!!" });
                }

            } else {

                return ({ success: false, message: "Teacher is not added" });
            }
        }
    } catch (error) {
        console.log("create Stream controller error ----> ", error);
    }
};

exports.getTeacherById = async (req) => {    //  get Teacher by id
    try {
        console.log(req.params.id);
        var sql = "SELECT * from Teacher WHERE id = '" + req.params.id + "' and status = 1";

        const sqlQuery = await promisifyConQuery(sql);

        if (sqlQuery == null) {
            return ({ success: false, message: 'Teacher is not got!!' });
        }
        return ({ success: true, message: 'Teacher is got!!', teacher: sqlQuery });

    } catch (error) {
        console.log("get Teacher By Id controller error ----> ", error);
    }
};

exports.getAllDatailsTeacherByPaperId = async (req) => {    //  get All Datails Teacher By Id
    try {
        console.log(req.params.paperId);
        
        var sql = "SELECT * from Teacher left join user on Teacher.userId = user.id left join paper on Teacher.id = paper.teacherId WHERE paper.id = '" + req.params.paperId + "' and Teacher.status = 1";

        const sqlQuery = await promisifyConQuery(sql);

        if (sqlQuery == null) {
            return ({ success: false, message: 'Teacher is not got!!' });
        }
        return ({ success: true, message: 'Teacher is got!!', teacher: sqlQuery });

    } catch (error) {
        console.log("get All Datails Teacher By Id controller error ----> ", error);
    }
};

exports.getTeacherByUserId = async (req) => {    //  get Teacher by userid
    try {
        var sql = "SELECT * from Teacher left join user on Teacher.userId = user.id WHERE userId = '" + req.params.userId + "' and user.status = 1";

        const sqlQuery = await promisifyConQuery(sql);

        if (sqlQuery == null) {
            return ({ success: false, message: 'Teacher is not got!!' });
        }
        return ({ success: true, message: 'Teacher is got!!', teacher: sqlQuery });

    } catch (error) {
        console.log("get Teacher By userid controller error ----> ", error);
    }
};

exports.getAllActiveTeachers = async (req) => {    //  get All Teachers
    try {
        var sql = "SELECT * from Teacher WHERE status = 1";

        const sqlQuery = await promisifyConQuery(sql);

        if (sqlQuery == null) {
            return ({ success: false, message: 'Teachers is not got!!' });
        }
        return ({ success: true, message: 'Teachers is got!!', teachers: sqlQuery });

    } catch (error) {
        console.log("get All Teachers controller error ----> ", error);
    }
};

exports.searchActiveTeachers = async (req) => {  //  search Active Teachers
    try {

        var searchString = req.body.searchString;

        searchString = '\'' + searchString + '%\''

        var searchQuery = "SELECT Teacher.id, Teacher.fullName, Teacher.qualification, Teacher.contactNumber, Teacher.email, Teacher.promoImageUrl, Teacher.userId, Teacher.subjectId, user.profileImageUrl from Teacher left join subject on subject.id = Teacher.subjectId left join user on Teacher.userId = user.id WHERE (Teacher.status = 1) AND ((Teacher.fullName LIKE " + searchString + ") OR (Teacher.qualification LIKE " + searchString + ") OR (subject.name LIKE " + searchString + "))";

        if (searchQuery === '') {

            return ({ success: false, message: "no search" });

        } else {

            console.log("search query ---> ", searchQuery);

            const activeTeachers = await promisifyConQuery(searchQuery);
            console.log("users query ----> ", activeTeachers);

            if (!activeTeachers.success) {

                return ({ success: false, message: "no search value" });

            } else {

                return ({ success: true, message: "active users are got!!", result: activeTeachers });

            }

        }

    } catch (error) {

        console.log("search User controller error ----> ", error);

    }

};

exports.deleteImage = async (req) => {
    var item = req.split(".com/");
    console.log('spli', item[1]);
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

exports.editPromoImage = async (req) => { // edit Profile
    try {

        console.log(req.params.id);
        let sql = "SELECT * FROM Teacher WHERE userId = '" + req.params.id + "'";

        const currentTeacher = await promisifyConQuery(sql);
        console.log(currentTeacher.result[0]);

        if (!currentTeacher.success) {

            return ({ success: false, message: "not get this teacher!!" });

        } else {

            if ((req.files.image != null) && (req.files.image.mimetype === 'image/jpeg' || req.files.image.mimetype === 'image/jpg' || req.files.image.mimetype === 'image/png' || req.files.image.mimetype === 'application/octet-stream')) {

                console.log('not null image');
                console.log("user details", req.files);
                var image = req.files.image;

                var details = [image, currentTeacher.result[0].fullName];

                const promoImgUrl = await getImgUrl(details);

                console.log("img url received", promoImgUrl.result);

                let location = promoImgUrl.result;
                let promoImageUrl = currentTeacher.result[0].promoImageUrl;
                console.log('url', promoImageUrl);

                var updatedQuery = "";

                updatedQuery = "UPDATE Teacher SET promoImageUrl='" + location + "' WHERE userId ='" + req.params.id + "'";

                const updatedQueryRes = await promisifyConQuery(updatedQuery);

                if (!updatedQueryRes.success) {

                    return ({ success: false, message: "Url is not successfully updated!!" });

                } else {

                    return ({ success: true, message: "Url is successfully updated!!", previousUrl: promoImageUrl });

                }

            } else {

                return ({ success: false, message: "Image is null or image type is not compatible!" });

            }
        }

    } catch (error) {

        console.log("edit Promo Image controller error ----> ", error);

    }
};


exports.editTeacherDetails = async (req) => { // edit teacher details
    try {

        console.log(req.params.id);
        let sql = "SELECT * FROM Teacher WHERE userId = '" + req.params.id + "'";

        const currentUser = await promisifyConQuery(sql);
        console.log(currentUser);

        if (!currentUser.success) {

            return ({ success: false, message: "not get this user!!" });

        } else {

            let fullName = currentUser.result[0].fullName;
            let qualification = currentUser.result[0].qualification;
            let contactNumber = currentUser.result[0].contactNumber;

            var updatedQuery = "";

            if (fullName != req.body.fullName) {

                updatedQuery = "UPDATE Teacher SET fullName='" + req.body.fullName + "' WHERE userId ='" + req.params.id + "'";

            } else if (qualification != req.body.qualification) {

                updatedQuery = "UPDATE Teacher SET qualification='" + req.body.qualification + "' WHERE userId ='" + req.params.id + "'";

            } else if (contactNumber != req.body.contactNumber) {

                updatedQuery = "UPDATE Teacher SET contactNumber='" + req.body.contactNumber + "' WHERE userId ='" + req.params.id + "'";

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

        console.log("edit teacher details controller error ----> ", error);

    }
};