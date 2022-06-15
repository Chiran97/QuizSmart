var express = require('express');
var router = express.Router();
var dbConnection = require('../config/config');


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

exports.addOptionsByQuestionId = async (req) => {     //  create Options
    try {

        var checkQuestionOptions = "SELECT * from questionoptons WHERE questionId = '" + req.body.questionId + "'";
        const checkQuestionOptionsQuery = await promisifyConQuery(checkQuestionOptions);
        console.log("check Question Options query ----> ", checkQuestionOptionsQuery);

        if (checkQuestionOptionsQuery.result.length != 0) {

            return ({ success: false, message: 'Question Options Already Exists!' });

        } else {

            var questionOptions = "INSERT INTO questionoptons (questionOption1, questionOption2, questionOption3, questionOption4, questionId) VALUES ('" +
            req.body.questionOption1 +
            "','" +
            req.body.questionOption2 +
            "','" +
            req.body.questionOption3 +
            "','" +
            req.body.questionOption4 +
            "','" +
            req.body.questionId +
             "')"

            const questionOptionsQuery = await promisifyConQuery(questionOptions);
            console.log("Question Opion query ----> ", questionOptionsQuery);

            if (!questionOptionsQuery.success) {
                return ({ success: false, message: "Question Options are not inserted!!" });
            } else {
                return ({ success: true, message: "Question Options are inserted!!" });
            }

        }

    } catch (error) {

        console.log("Add Question Options controller error ----> ", error);

    }
}