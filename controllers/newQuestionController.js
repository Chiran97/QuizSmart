var express = require('express');
var router = express.Router();
var dbConnection = require('../config/config');

var AWS = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
require('dotenv').config();


AWS.config.update({
    accessKeyId: process.env.accessKeyIdIam,
    secretAccessKey: process.env.secretAccessKeyIam,
    region: process.env.region
  });

var s3Bucket = new AWS.S3( { params: {Bucket: process.env.bucketName} });

var bucketName = process.env.bucketName;

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

exports.addQuestionsByPaperId = async (req) => { // add Questions By Paper Id
    try {
        console.log('dataaaa', req.body);
        var checkQuestion = "SELECT * from question1 WHERE paperId = '" + req.body.paperId + "' AND questionNumber = '" + req.body.questionNo + "'";
        const checkQuestionQuery = await promisifyConQuery(checkQuestion);
        console.log("check question query ----> ", checkQuestionQuery);

        if (checkQuestionQuery.result.length != 0) {

            return ({ success: false, message: 'Question Number Already Exists!' });

        }
        else {

            buf = Buffer.from(req.files.questionImage.data);
            // buf = '';
            var dataS3 = {
                Key: req.body.questionNo +'/' + req.body.paperId + '/' + req.files.questionImage.name.replace(/ /g, ""), 
                Body: buf,
                ACL: 'public-read',
                ContentEncoding: 'base64',
                ContentType: 'image/jpeg'
              };
 
              s3Bucket.upload(dataS3, function(err, data){
                if (err) { 
                  console.log(err);
                  console.log('Error uploading data: ', data); 
                } else {
                  console.log('successfully uploaded the image!', data.Location);
                }
            });
            console.log('request', buf);

            var addQuestionQuery = "INSERT INTO question1 (questionText, questionImageUrl, correctAnswerpaperId, questionNumber, questionTypeId) VALUES ('" +
            req.body.questionText +
            "','" +
            req.body.questionImgUrl +
            "','" +
            req.body.correctAnswer +
            "','" +
            req.body.paperId +
            "','" +
            req.body.questionNumber +
            "','" +
            req.body.questionTypeId +
            "')";
        }
    }
    catch (error) {

        console.log("create question controller error ----> ", error);

    }
};
