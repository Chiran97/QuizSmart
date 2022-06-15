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

var s3Bucket = new AWS.S3( { params: {Bucket: process.env.bucketName} });


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

}

exports.getActivePapersBySubjectIdAndPaperTypeId = async (req) => {     //  get Active Papers By SubjectId And PaperTypeId

    try {

        var activePaper = "SELECT * from paper WHERE subjectId = '" + req.params.subjectId + "' AND paperTypeId = '" + req.params.paperTypeId + "' AND status = 1 ORDER BY priority DESC";
        const activePapersQuery = await promisifyConQuery(activePaper);
        console.log("all Pape query ----> ", activePapersQuery);

        if (!activePapersQuery.success) {
            return ({ success: false, message: "active Papers are not got!!" });
        } else {
            return ({ success: true, message: "active Papers are got!!", result: activePapersQuery.result });
        }

    } catch (error) {

        console.log("get active Paper Types controller error ----> ", error);

    }
};

exports.getPaperById = async (req) => { //  get Paper  by id
    try {

        var sql = "SELECT * from paper WHERE id = '" + req.params.id + "'";

        const sqlQuery = await promisifyConQuery(sql);

        if (sqlQuery == null) {
            return ({ success: false, message: 'paper is not got!!' });
        }
        return ({ success: true, message: 'paper is got!!', paper: sqlQuery });

    } catch (error) {
        console.log("get Paper By Id controller error ----> ", error);
    }
};

exports.addPaper = async (req) => { // add Paper
    try {
        console.log('paper', req.files)
        console.log('data', req.body)
        var checkPaper = "SELECT * from paper WHERE name = '" + req.body.name + "' and subjectId = '" + req.body.subjectId + "' and paperTypeId = '" + req.body.paperTypeId + "'";
        const checkPaperQuery = await promisifyConQuery(checkPaper);
        console.log("check paper query ----> ", checkPaperQuery);

        if (checkPaperQuery.result.length != 0) {

            return ({ success: false, message: 'Paper is Already Exists!'});

        }
        else {

            var markingSchemeUrl;
            var answerSheetUrl;
            var answerSheetStatus = new Boolean(false);

            if(req.files == null){
                // answerSheetStatus == false;
                markingSchemeUrl = null;
                answerSheetUrl = null;
                console.log("null image");

            } else {

                var answerSheet = req.files.file;
                var answerSheetStatusInt;
                if(answerSheet.mimetype === 'application/pdf'){
                    answerSheetStatus = Boolean(true);
                    if(answerSheetStatus){
                        answerSheetStatusInt = 1
                    }else {
                        answerSheetStatusInt = 0
                    }
                    console.log('not nul answer sheet');
                    var marking_scheme = 'marking_scheme';
                    var details = [answerSheet, req.body.name, marking_scheme];
                    const answerSheetUrl = await getMarkingSchemeUrl(details);
                    markingSchemeUrl = answerSheetUrl.result;
                    console.log("img url received", markingSchemeUrl);

                } else {
                }
            }

            var addPaperQuery = "INSERT INTO paper (name, subjectId, paperTypeId, languageId, paperTime, answerSheet, answerSheetStatus) VALUES ('" +
            req.body.name +
            "','" +
            req.body.subjectId +
            "','" +
            req.body.paperTypeId +
            "','" +
            req.body.languageId +
            "','" +
            req.body.paperTime +
            "','" +
            markingSchemeUrl +
            "','" +
            answerSheetStatusInt +
            "')";

            const paperQuery = await promisifyConQuery(addPaperQuery);
            console.log("Stream query ----> ", paperQuery);

            if (!paperQuery.success) {
                return ({ success: false, message: "Paper is not inserted!!" });
            } else {
                var checkPaper = "SELECT * from paper WHERE name = '" + req.body.name + "' and subjectId = '" + req.body.subjectId + "' and paperTypeId = '" + req.body.paperTypeId + "'";
                const checkPaperQuery = await promisifyConQuery(checkPaper);
                console.log("check question query ----> ", checkPaperQuery);
                return ({ success: true, message: "Paper is inserted!!", paper:checkPaperQuery.result });
            }
        }
    }
    catch (error) {

        console.log("create paper controller error ----> ", error);

    }
};

const getMarkingSchemeUrl = (req) => {
    return new Promise((resolve, reject) => {
    console.log('req, buff', req);
    buf = Buffer.from(req[0].data);

    var dataS3 = {
        Key: req[2] +'/' + req[1] +'/' + req[0].name.replace(/ /g, ""), 
        Body: buf,
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: req[0].mimetype
    };

    s3Bucket.upload(dataS3, function(err, data){
        if (err) { 
        console.log(err);
        console.log('Error uploading data: ', data); 
        resolve({success: false, result: data});
        } else {
        console.log('successfully uploaded the image!', data.Location);
        resolve({success: true, result: data.Location});
        }
    });
});
}

//Test equation add function
// exports.createEquation = async (req) => {     //  create Stream

//     try {
//             var equation = "INSERT INTO equation (name) VALUES ('" + req.body.name + "')"
//             const equationQuery = await promisifyConQuery(equation);
//             console.log("Stream query ----> ", equationQuery);

//             if (!equationQuery.success) {
//                 return ({ success: false, message: "Equation is not inserted!!" });
//             } else {
//                 return ({ success: true, message: "Equation is inserted!!" });
//             }

//     } catch (error) {

//         console.log("create Stream controller error ----> ", error);

//     }
// };

// exports.getAllEquations = async (req) => {     //  get all Streams

//     try {

//         var allEquations = "SELECT * from equation ORDER BY name ASC";
//         const allEquationsQuery = await promisifyConQuery(allEquations);
//         console.log("all Streams query ----> ", allEquationsQuery);

//         if (!allEquationsQuery.success) {
//             return ({ success: false, message: "all Equations are not got!!" });
//         } else {
//             return ({ success: true, message: "all Equations are got!!", result: allEquationsQuery.result });
//         }

//     } catch (error) {

//         console.log("get all Streams controller error ----> ", error);

//     }
// };
