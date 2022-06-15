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

exports.createQuestionType = async (req) => {     //  create Quetion Type

    try {

        var checkQuestionTypes = "SELECT * from questionType WHERE name = '" + req.body.name + "'";
        const checkQuestionTypeQuery = await promisifyConQuery(checkQuestionTypes);
        console.log("check Question Type query ----> ", checkQuestionTypeQuery);

        if (checkQuestionTypeQuery.result.length != 0) {

            return ({ success: false, message: 'Question Type Already Exists!' });

        } else {

            // var paperTypeName = (req.body.name).toUpperCase();
            var questionType = "INSERT INTO questionType (name) VALUES ('" + req.body.name + "')"
            const questionTypeQuery = await promisifyConQuery(questionType);
            console.log("Question Type query ----> ", questionTypeQuery);

            if (!questionTypeQuery.success) {
                return ({ success: false, message: "Question Type is not inserted!!" });
            } else {
                return ({ success: true, message: "Question Type is inserted!!" });
            }

        }

    } catch (error) {

        console.log("Create Question Type controller error ----> ", error);

    }
}

exports.getAllQuestionTypes = async (req) => {     //  get all Question Types

    try {

        var allQuestionTypes = "SELECT * from questionType ORDER BY name ASC";
        const allQuestionTypesQuery = await promisifyConQuery(allQuestionTypes);
        console.log("all Paper Types query ----> ", allQuestionTypesQuery);

        if (!allQuestionTypesQuery.success) {
            return ({ success: false, message: "all Question Types are not got!!" });
        } else {
            return ({ success: true, message: "all Question Types are got!!", result: allQuestionTypesQuery.result });
        }

    } catch (error) {

        console.log("get all Question Types controller error ----> ", error);

    }
}

exports.updateQuetionType = async (req) => {  //  update Question Type
    try {

        var checkQuestionTypes = "SELECT * from questionType WHERE name = '" + req.body.name + "'";
        const checkQuestionTypeQuery = await promisifyConQuery(checkQuestionTypes);
        console.log("check Question Type query ----> ", checkQuestionTypeQuery);

        if (checkQuestionTypeQuery.result.length != 0) {

            return ({ success: false, message: 'Question Type Already Exists!' });

        } else {
            // var paperTypeName = (req.body.name).toUpperCase();
            var questonType = "UPDATE questionType SET name='" + req.body.name + "' WHERE id ='" + req.params.id + "'";


            const updateQuestionTypeQuery = await promisifyConQuery(questonType);

            if (!updateQuestionTypeQuery.success) {
                return ({ success: false, message: "Question Type is not updated!!" });
            } else {
                return ({ success: true, message: "Question Type is updated!!" });
            }
        }

    } catch (error) {
        console.log("update Question Type controller error ----> ", error);
    }

};
