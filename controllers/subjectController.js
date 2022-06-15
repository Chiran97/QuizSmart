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

};

exports.getActiveSubjects = async (req) => {     //  get active Subjects

    try {

        var activeSubjects = "SELECT * from subject WHERE status = 1";
        const activeSubjectsQuery = await promisifyConQuery(activeSubjects);
        console.log("all Subjects query ----> ", activeSubjectsQuery);

        if (!activeSubjectsQuery.success) {
            return ({ success: false, message: "active Subjects are not got!!" });
        } else {
            return ({ success: true, message: "active Subjects are got!!", result: activeSubjectsQuery.result });
        }

    } catch (error) {

        console.log("get active Subjects controller error ----> ", error);

    }
};

exports.getSubjectsByStreamId = async (req) => {    //  get subjects by stream id
    try {

        var sql = "SELECT * from subject WHERE id IN (SELECT subjectId from subject_stream WHERE streamId = '" + req.params.streamId + "') AND status = 1 ";

        const sqlQuery = await promisifyConQuery(sql);

        if (sqlQuery == null) {
            return ({ success: false, message: 'subject is not got!!' });
        }
        return ({ success: true, message: 'stream is got!!', subjects: sqlQuery.result });

    } catch (error) {
        console.log("get subjects By stream id controller error ----> ", error);
    }
};

exports.getSubjectById = async (req) => {    //  get Subject by id
    try {

        var sql = "SELECT * from subject WHERE id = '" + req.params.id + "'";

        const sqlQuery = await promisifyConQuery(sql);

        if (sqlQuery == null) {
            return ({ success: false, message: 'subject is not got!!' });
        }
        return ({ success: true, message: 'subject is got!!', subject: sqlQuery.result });

    } catch (error) {
        console.log("get subject By Id controller error ----> ", error);
    }
};