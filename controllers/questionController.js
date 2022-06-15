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

}

const getImgUrl = (req) => {
    return new Promise((resolve, reject) => {
        console.log('req, buff', req);
        buf = Buffer.from(req[0].data);

        var dataS3 = {
            Key: req[1] + '/' + req[2] + '/' + req[3] + req[0].name.replace(/ /g, ""),
            Body: buf,
            ACL: 'public-read',
            ContentEncoding: 'base64',
            ContentType: req[0].mimetype
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


exports.getQuestionsByPaperId = async (req) => { // get Questions By Paper Id
    try {

        var sql = "SELECT * from question WHERE paperId = '" + req.params.paperId + "' ORDER BY questionNumber ASC";

        const sqlQuery = await promisifyConQuery(sql);

        if (sqlQuery == null) {
            return ({ success: false, message: 'questions are not got!!' });
        }

        console.log(sqlQuery);

        return ({ success: true, message: 'questions are got!!', questions: sqlQuery });

    } catch (error) {
        console.log("get Questions By Paper Id controller error ----> ", error);
    }
};


exports.getQuestionsByPaperIdNew = async (req) => { // get Questions By Paper Id
    try {

        var sql = "SELECT q.id, q.questionText, q.questionImageUrl, q.correctAnswer, q.questionNumber, q.paperId, q.questionTypeId, a.ans1Text, a.ans1ImgUrl, a.ans2Text, a.ans2ImgUrl, a.ans3Text, a.ans3ImgUrl, a.ans4Text, a.ans4ImgUrl, a.ans5Text, a.ans5ImgUrl, o.questionOption1, o.questionOption2, o.questionOption3, o.questionOption4 FROM questionnew as q left join questionoptons as o on o.questionId = q.id left join answer as a on a.questionId = q.id WHERE q.paperId = '" + req.params.paperId + "' ORDER BY questionNumber ASC";

        const sqlQuery = await promisifyConQuery(sql);

        if (sqlQuery == null) {
            return ({ success: false, message: 'questions are not got!!' });
        }

        console.log(sqlQuery);

        return ({ success: true, message: 'questions are got!!', questions: sqlQuery });

    } catch (error) {
        console.log("get Questions By Paper Id New controller error ----> ", error);
    }
};

exports.addQuestionsByPaperId = async (req) => { // add Questions By Paper Id
    try {
        var checkQuestion = "SELECT * from questionnew WHERE paperId = '" + req.body.paperId + "' AND questionNumber = '" + req.body.questionNumber + "'";
        const checkQuestionQuery = await promisifyConQuery(checkQuestion);
        console.log("check question query ----> ", checkQuestionQuery);

        if (checkQuestionQuery.result.length != 0) {

            return ({ success: false, message: 'Question Number Already Exists!' });

        }
        else {

            var questionImageUrl = null;
            var questionText = null;

            if (req.files == null) {

                questionImageUrl = null;
                console.log("null image");

            } else {

                var questionImg = req.files.questionImage;

                if (questionImg.mimetype === 'image/jpeg' || questionImg.mimetype === 'image/jpg' || questionImg.mimetype === 'image/png') {

                    console.log('not nul image123');
                    var quesImg = 'quesImg';
                    var details = [questionImg, req.body.paperId, req.body.questionNumber, quesImg];
                    const questionImgUrl = await getImgUrl(details);
                    questionImageUrl = questionImgUrl.result;
                    console.log("img url received", questionImageUrl);

                } else {

                    return ({ success: false, message: "questionImg mimetype" });

                }

            }

            if (req.body.questionText != null) {

                questionText = req.body.questionText;

            } else {

                questionText = null;
                
            }

            var addQuestionQuery = "INSERT INTO questionnew (questionText, questionImageUrl, correctAnswer, paperId, questionNumber, questionTypeId) VALUES ('" +
            req.body.questionText +
            "','" +
            questionImageUrl +
            "','" +
            req.body.correctAnswer +
            "','" +
            req.body.paperId +
            "','" +
            req.body.questionNumber +
            "','" +
            req.body.questionTypeId +
            "')";

            

            // if (addQuestionQuery != "") {
            //     return ({ success: true, message: "question is successfully added" });
           
           
            if (addQuestionQuery != "") {
                // return ({ success: true, message: "question is successfully added" });

                const questionQuery = await promisifyConQuery(addQuestionQuery);
                console.log("Question query ----> ", questionQuery);

                if (!questionQuery.success) {
                    return ({ success: false, message: "Question is not inserted!!" });
                } else {
                    var checkQuestion = "SELECT * from questionnew WHERE paperId = '" + req.body.paperId + "' AND questionNumber = '" + req.body.questionNumber + "'";
                    const checkQuestionQuery = await promisifyConQuery(checkQuestion);
                    console.log("check question query ----> ", checkQuestionQuery);
                    return ({ success: true, message: "Question is inserted!!", question:checkQuestionQuery.result});
                }

            } else {

                return ({ success: false, message: "question is not added" });

            }
        }
    }
    catch (error) {

        console.log("create question controller error ----> ", error);

    }
};

exports.addAnswersByQuestionId = async (req) => { // add Answers By QuestionId
    try {

        var checkAnswer = "SELECT * from answer WHERE questionId = '" + req.body.questionId + "'";
        const checkAnswerQuery = await promisifyConQuery(checkAnswer);
        console.log("check answer query ----> ", checkAnswerQuery);

        if (checkAnswerQuery.result.length != 0) {

            return ({ success: false, message: 'Answer Already Exists!' });

        }
        else {

            // console.log('request', req.body);

            // var ans1ImageUrl = null;
            // var ans2ImageUrl = null;
            // var ans3ImageUrl = null;
            // var ans4ImageUrl = null;
            // var ans5ImageUrl = null;

            // if(req.files == null){

            //     console.log("null image");

            // } else {

            //     if((req.files.ans1Img != null) && (req.files.ans1Img.mimetype === 'image/jpeg' || req.files.ans1Img.mimetype === 'image/jpg' || req.files.ans1Img.mimetype === 'image/png')){

            //         console.log('not nul ans1 image123');
            //         var ans1 = 'ans1Img';
            //         var ans1Img = req.files.ans1Img;
            //         var details = [ans1Img, req.body.paperId, req.body.questionId, ans1];
            //         const ans1ImgUrl = await getQuestionImgUrl(details);
            //         console.log("img url received", ans1ImgUrl.result);
            //         ans1ImageUrl = ans1ImgUrl.result

            //     }  if((req.files.ans2Img != null) && (req.files.ans2Img.mimetype === 'image/jpeg' || req.files.ans2Img.mimetype === 'image/jpg' || req.files.ans2Img.mimetype === 'image/png')){
            //         console.log('not nul ans2 image123');
            //         var ans2 = 'ans2Img';
            //         var ans2Img = req.files.ans2Img;
            //         var details = [ans2Img, req.body.paperId, req.body.questionId, ans2];
            //         const ans2ImgUrl = await getQuestionImgUrl(details);
            //         console.log("img url received", ans2ImgUrl.result);
            //         ans2IamgeUrl = ans2ImgUrl.result;

            //     }  if((req.files.ans3Img != null) && (req.files.ans3Img.mimetype === 'image/jpeg' || req.files.ans3Img.mimetype === 'image/jpg' || req.files.ans3Img.mimetype === 'image/png')){
            //         console.log('not nul ans3 image123');
            //         var ans3 = 'ans3Img';
            //         var ans3Img = req.files.ans3Img;
            //         var details = [ans3Img, req.body.paperId, req.body.questionId, ans3];
            //         const ans3ImgUrl = await getQuestionImgUrl(details);
            //         console.log("img url received", ans3ImgUrl.result);
            //         ans3ImageUrl = ans3ImgUrl.result;

            //     }  if((req.files.ans4Img != null) && (req.files.ans4Img.mimetype === 'image/jpeg' || req.files.ans4Img.mimetype === 'image/jpg' || req.files.ans4Img.mimetype === 'image/png')){
            //         console.log('not nul ans4 image123');
            //         var ans4 = 'ans4Img';
            //         var ans4Img = req.files.ans4Img;
            //         var details = [ans4Img, req.body.paperId, req.body.questionId, ans4];
            //         const ans4ImgUrl = await getQuestionImgUrl(details);
            //         console.log("img url received", ans4ImgUrl.result);
            //         ans4ImageUrl = ans4ImgUrl.result;

            //     } if((req.files.ans5Img != null) && (req.files.ans5Img.mimetype === 'image/jpeg' || req.files.ans5Img.mimetype === 'image/jpg' || req.files.ans5Img.mimetype === 'image/png')){
            //         console.log('not nul ans5 image123');
            //         var ans5 = 'ans5Img';
            //         var ans5Img = req.files.ans5Img;
            //         var details = [ans5Img, req.body.paperId, req.body.questionId, ans5];
            //         const ans5ImgUrl = await getQuestionImgUrl(details);
            //         console.log("img url received", ans5ImgUrl.result);
            //         ans5ImageUrl = ans5ImgUrl.result
            //     }
        console.log('request', req.body);
        var ans1ImageUrl = null;
        var ans2ImageUrl = null;
        var ans3ImageUrl = null;
        var ans4ImageUrl = null;
        var ans5ImageUrl = null;
        var ans1Text = null;
        var ans2Text = null;
        var ans3Text = null;
        var ans4Text = null;
        var ans5Text = null;

        if (req.files == null) {

            ans1ImageUrl = null;
            ans2ImageUrl = null;
            ans3ImageUrl = null;
            ans4ImageUrl = null;
            ans5ImageUrl = null;
            console.log("null image");

        } else {

            if ((req.files.ans1Img != null) && (req.files.ans1Img.mimetype === 'image/jpeg' || req.files.ans1Img.mimetype === 'image/jpg' || req.files.ans1Img.mimetype === 'image/png')) {

                console.log('not nul ans1 image123');
                var ans1 = 'ans1Img';
                var ans1Img = req.files.ans1Img;
                var details = [ans1Img, req.body.paperId, req.body.questionId, ans1];
                const ans1ImgUrl = await getImgUrl(details);
                console.log("img url received", ans1ImgUrl.result);
                ans1ImageUrl = ans1ImgUrl.result;

            } else if (req.files.ans1Img == null) {

                ans1ImageUrl = null;

            } else {

                return ({ success: false, message: "ans1Img mimetype" });

            }
            if ((req.files.ans2Img != null) && (req.files.ans2Img.mimetype === 'image/jpeg' || req.files.ans2Img.mimetype === 'image/jpg' || req.files.ans2Img.mimetype === 'image/png')) {

                console.log('not nul ans2 image123');
                var ans2 = 'ans2Img';
                var ans2Img = req.files.ans2Img;
                var details = [ans2Img, req.body.paperId, req.body.questionId, ans2];
                const ans2ImgUrl = await getImgUrl(details);
                console.log("img url received", ans2ImgUrl.result);
                ans2ImageUrl = ans2ImgUrl.result;

            } else if (req.files.ans2Img == null) {

                ans2ImageUrl = null;

            } else {

                return ({ success: false, message: "ans2Img mimetype" });

            } if ((req.files.ans3Img != null) && (req.files.ans3Img.mimetype === 'image/jpeg' || req.files.ans3Img.mimetype === 'image/jpg' || req.files.ans3Img.mimetype === 'image/png')) {

                console.log('not nul ans3 image123');
                var ans3 = 'ans3Img';
                var ans3Img = req.files.ans3Img;
                var details = [ans3Img, req.body.paperId, req.body.questionId, ans3];
                const ans3ImgUrl = await getImgUrl(details);
                console.log("img url received", ans3ImgUrl.result);
                ans3ImageUrl = ans3ImgUrl.result

            } else if (req.files.ans3Img == null) {

                ans3ImageUrl = null;

            } else {

                return ({ success: false, message: "ans3Img mimetype" });

            } if ((req.files.ans4Img != null) && (req.files.ans4Img.mimetype === 'image/jpeg' || req.files.ans4Img.mimetype === 'image/jpg' || req.files.ans4Img.mimetype === 'image/png')) {

                console.log('not nul ans4 image123');
                var ans4 = 'ans4Img';
                var ans4Img = req.files.ans4Img;
                var details = [ans4Img, req.body.paperId, req.body.questionId, ans4];
                const ans4ImgUrl = await getImgUrl(details);
                console.log("img url received", ans4ImgUrl.result);
                ans4ImageUrl = ans4ImgUrl.result;

            } else if (req.files.ans4Img == null) {

                ans4ImageUrl = null;

            } else {

                return ({ success: false, message: "ans4Img mimetype" });

            } if ((req.files.ans5Img != null) && (req.files.ans5Img.mimetype === 'image/jpeg' || req.files.ans5Img.mimetype === 'image/jpg' || req.files.ans5Img.mimetype === 'image/png')) {

                console.log('not nul ans5 image123');
                var ans5 = 'ans5Img';
                var ans5Img = req.files.ans5Img;
                var details = [ans5Img, req.body.paperId, req.body.questionId, ans5];
                const ans5ImgUrl = await getImgUrl(details);
                console.log("img url received", ans5ImgUrl.result);
                ans5ImageUrl = ans5ImgUrl.result;

            } else if (req.files.ans5Img == null) {

                ans5ImageUrl = null;

            } else {

                return ({ success: false, message: "ans5Img mimetype" });

            }
        }

        if (req.body.ans1Text != null) {

            ans1Text = req.body.ans1Text;

        }
        if (req.body.ans2Text != null) {

            ans2Text = req.body.ans2Text;

        }
        if (req.body.ans3Text != null) {

            ans3Text = req.body.ans3Text;

        }
        if (req.body.ans4Text != null) {

            ans4Text = req.body.ans4Text;

        }
        if (req.body.ans5Text != null) {

            ans5Text = req.body.ans5Text;

        }


        var addAnswersQuery = "INSERT INTO answer (ans1Text, ans1ImgUrl, ans2Text, ans2ImgUrl, ans3Text, ans3ImgUrl, ans4Text, ans4ImgUrl, ans5Text, ans5ImgUrl, questionId) VALUES ('" +
            ans1Text +
            "','" +
            ans1ImageUrl +
            "','" +
            ans2Text +
            "','" +
            ans2ImageUrl +
            "','" +
            ans3Text +
            "','" +
            ans3ImageUrl +
            "','" +
            ans4Text +
            "','" +
            ans4ImageUrl +
            "','" +
            ans5Text +
            "','" +
            ans5ImageUrl +
            "','" +
            req.body.questionId +
            "')";

            if (addAnswersQuery != "") {

                const answerQuery = await promisifyConQuery(addAnswersQuery);
                console.log(answerQuery);

                if (!answerQuery.success) {

                    return ({ success: false, message: "answers are not added" });

                } else {

                    return ({ success: true, message: "answers are successfully added" });

                }

            } else {

                return ({ success: false, message: "answers are not added" });

            }
        }
    }
    catch (error) {

        console.log("add Answers By QuestionId controller error ----> ", error);

    }
};

exports.addQuestionsOptions = async (req) => { // add Question Options
    try {
        console.log('request', req.body);

        var addOptionsQuery = "";

        if (req.body.questionType == 2) {

            addOptionsQuery = "INSERT INTO questionoptons (questionOption1, questionOption2, questionId) VALUES ('" +
                req.body.questionOption1 +
                "','" +
                req.body.questionOption2 +
                "','" +
                req.body.questionId +
                "')";

        } else if (req.body.questionType == 3) {

            addOptionsQuery = "INSERT INTO questionoptons (questionOption1, questionOption2, questionOption3, questionId) VALUES ('" +
                req.body.questionOption1 +
                "','" +
                req.body.questionOption2 +
                "','" +
                req.body.questionOption3 +
                "','" +
                req.body.questionId +
                "')";

        } else if (req.body.questionType == 4) {

            addOptionsQuery = "INSERT INTO questionoptons (questionOption1, questionOption2, questionOption3, questionOption4, questionId) VALUES ('" +
                req.body.questionOption1 +
                "','" +
                req.body.questionOption2 +
                "','" +
                req.body.questionOption3 +
                "','" +
                req.body.questionOption4 +
                "','" +
                req.body.questionId +
                "')";
        }

        if (addOptionsQuery != "") {

            const optionsQuery = await promisifyConQuery(addOptionsQuery);
            console.log(optionsQuery);

            if (!optionsQuery.success) {

                return ({ success: false, message: "Options are not added" });

            } else {

                return ({ success: true, message: "Options are successfully added" });

            }

        } else {

            return ({ success: false, message: "Options are not added" });

        }
    }
    catch (error) {

        console.log("add Question Options controller error ----> ", error);

    }
};
