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


exports.getPastExamsByTeacherId = async (req) => {    //  get Past Exams By TeacherId
    try {

        var sql = "SELECT b.paperId, p.name, b.startTime, b.endTime, p.paperTime, p.subjectId, b.description FROM sample_first_app.timeBasedPaper as b left join sample_first_app.paper as p on b.paperId = p.id left join sample_first_app.Teacher as t on p.teacherId = t.id WHERE t.userId = '" + req.params.teacherId + "' and b.endTime < CONVERT_TZ(NOW(),'+00:00','+05:30') and p.status = 1 and p.paperTypeId = 4";

        const sqlQuery = await promisifyConQuery(sql);

        if (sqlQuery == null) {
            return ({ success: false, message: 'papers is not got!!' });
        }
        console.log(sqlQuery);
        return ({ success: true, message: 'papers is got!!', papers: sqlQuery.result });

    } catch (error) {
        console.log("get Past Exams By TeacherId controller error ----> ", error);
    }
};

exports.getCurrentExamsByTeacherId = async (req) => {    //  get Current Exams By TeacherId
    try {

        var sql = "SELECT  b.paperId, p.name, b.startTime, b.endTime, p.paperTime, p.subjectId, b.description FROM sample_first_app.timeBasedPaper as b left join sample_first_app.paper as p on b.paperId = p.id left join sample_first_app.Teacher as t on p.teacherId = t.id WHERE t.userId = '" + req.params.teacherId + "' and b.endTime > CONVERT_TZ(NOW(),'+00:00','+05:30') and b.startTime < CONVERT_TZ(NOW(),'+00:00','+05:31') and p.status = 1 and p.paperTypeId = 4";

        const sqlQuery = await promisifyConQuery(sql);

        if (sqlQuery == null) {
            return ({ success: false, message: 'papers is not got!!' });
        }
        return ({ success: true, message: 'papers is got!!', papers: sqlQuery.result });

    } catch (error) {
        console.log("get Current Exams By TeacherId controller error ----> ", error);
    }
};

exports.getFutureExamsByTeacherId = async (req) => {    //  get Future Exams By TeacherId
    try {

        var sql = "SELECT b.paperId, p.name, b.startTime, b.endTime, p.paperTime, p.subjectId, b.description FROM sample_first_app.timeBasedPaper as b left join sample_first_app.paper as p on b.paperId = p.id left join sample_first_app.Teacher as t on p.teacherId = t.id WHERE t.userId = '" + req.params.teacherId + "' and b.startTime > CONVERT_TZ(NOW(),'+00:00','+05:30') and p.status = 1 and p.paperTypeId = 4";

        const sqlQuery = await promisifyConQuery(sql);

        if (sqlQuery == null) {
            return ({ success: false, message: 'papers is not got!!' });
        }
        return ({ success: true, message: 'papers is got!!', papers: sqlQuery.result });

    } catch (error) {
        console.log("get Future Exams By TeacherId controller error ----> ", error);
    }
};

exports.getExamTime = async (req) => {    //  get Exam Time
    try {

        var sql = "SELECT b.startTime, b.endTime, p.paperTime, CONVERT_TZ(NOW(),'+00:00','+05:30') as nowTime, SUBTIME(TIME(b.endTime), TIME(CONVERT_TZ(NOW(),'+00:00','+05:30'))) as examTime FROM timeBasedPaper as b left join paper as p on b.paperId = p.id left join Teacher as t on p.teacherId = t.id WHERE p.id = '" + req.params.paperId + "' and p.status = 1 and p.paperTypeId = 4";

        const sqlQuery = await promisifyConQuery(sql);

        if (sqlQuery == null) {
            return ({ success: false, message: 'examTime is not got!!' });
        }
        console.log(sqlQuery.result[0].examTime);
        var input = sqlQuery.result[0].examTime;
        var parts = input.split(':');
        console.log(parts[1]*60);
        var time = parseInt(parts[0]*3600) + parseInt(parts[1]*60) + parseInt(parts[2]);
        console.log(time);

        if(time < sqlQuery.result[0].paperTime * 60){
            return ({ success: true, message: 'examTime is got!!', examTime: time });
        } else {
            return ({ success: true, message: 'examTime is got!!', examTime: sqlQuery.result[0].paperTime * 60 });
        }

    } catch (error) {
        console.log("get Exam Time controller error ----> ", error);
    }
};

exports.getAvailableExams = async (req) => {    //  get Available Exams
    try {

        var sql = "SELECT t.id, b.paperId, p.name, b.startTime, b.endTime, p.paperTime, p.subjectId, b.description FROM timeBasedPaper as b left join paper as p on b.paperId = p.id left join Teacher as t on p.teacherId = t.id WHERE b.endTime > CONVERT_TZ(NOW(),'+00:00','+05:30') and b.startTime < CONVERT_TZ(NOW(),'+00:00','+05:31') and p.status = 1 and p.paperTypeId = 4";

        const sqlQuery = await promisifyConQuery(sql);

        if (sqlQuery == null) {
            return ({ success: false, message: 'papers is not got!!' });
        }
        return ({ success: true, message: 'papers is got!!', papers: sqlQuery.result });

    } catch (error) {
        console.log("get Available Exams controller error ----> ", error);
    }
};

exports.editTimeBasedPaper = async (req) => { // edit TimeBased paper
    try {

        let sql = "SELECT * FROM timeBasedPaper WHERE paperId = '" + req.params.paperId + "'";

        const currentTimeBasedPaper = await promisifyConQuery(sql);
        console.log(currentTimeBasedPaper);

        if (!currentTimeBasedPaper.success) {

            return ({ success: false, message: "Unable to get this paper!!" });

        } else {

            console.log('cucrrent paper',currentTimeBasedPaper.result[0].startTime)
            let startTime = currentTimeBasedPaper.result[0].startTime;
            let endTime = currentTimeBasedPaper.result[0].endTime;
            let description = currentTimeBasedPaper.result[0].description;

            var updatedQuery = "";
            let startTimeInput = new Date(req.body.startTime)
            let endTimeInput = new Date(req.body.endTime)
            
            if (startTime.getTime() !== startTimeInput.getTime()) {
                console.log('start new time',startTimeInput);
                updatedQuery = "UPDATE timeBasedPaper SET startTime='" + req.body.startTime + "' WHERE paperId ='" + req.params.paperId + "'";

            } else if (endTime.getTime() !== endTimeInput.getTime()) {

                updatedQuery = "UPDATE timeBasedPaper SET endTime='" + req.body.endTime + "' WHERE paperId ='" + req.params.paperId + "'";

            } else if (description != req.body.description) {

                updatedQuery = "UPDATE timeBasedPaper SET description='" + req.body.description + "' WHERE paperId ='" + req.params.paperId + "'";

            } else {

                updatedQuery = "";

            }

            if (updatedQuery == "") {

                return ({ success: false, message: "Nothing to update" });

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

        console.log("edit TimeBasedPaper controller error ----> ", error);

    }
};


