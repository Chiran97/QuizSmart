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

exports.changeExamMarks = async (req) => {  //  change exam marks
    try {

        var checkMarksQuery = "SELECT * from examMarks WHERE userId = '" + req.body.userId + "' and paperId = '" + req.body.paperId + "'";

        const mark = await promisifyConQuery(checkMarksQuery);

        if (mark.result.length === 0) {

            var marks = "INSERT INTO examMarks (marks, userId, paperId, questionCount) VALUES ('" + req.body.marks + "','" + req.body.userId + "','" + req.body.paperId + "','" + req.body.questionCount + "')";
            const marksQuery = await promisifyConQuery(marks);
            console.log("marks query ----> ", marksQuery);

            if (!marksQuery.success) {
                return ({ success: false, message: "examMarks are not inserted!!" });
            } else {
                return ({ success: true, message: "examMarks are inserted!!" });
            }

        } else {

            if (mark.result[0].marks < req.body.marks) {

                var changeMarks = "UPDATE examMarks SET marks = '" + req.body.marks + "', attempt = '" + (mark.result[0].attempt + 1 ) + "' WHERE userId = '" + req.body.userId + "' and paperId = '" + req.body.paperId + "'";
                console.log(changeMarks);
                const marksQuery = await promisifyConQuery(changeMarks);

                if (!marksQuery.success) {

                    return ({ success: false, message: "examMarks is not updated to Active mode!!" });

                } else {

                    return ({ success: true, message: "examMarks is updated to Active mode!!" });

                }

            } else {
                console.log(mark.result[0].attempt + 1);
                var changeMarks = "UPDATE examMarks SET attempt = '" + (mark.result[0].attempt + 1 ) + "' WHERE userId = '" + req.body.userId + "' and paperId = '" + req.body.paperId + "'";
                console.log(changeMarks);
                const marksQuery = await promisifyConQuery(changeMarks);

                if (!marksQuery.success) {

                    return ({ success: false, message: "examMarks is not updated to Active mode!!" });

                } else {

                    return ({ success: true, message: "examMarks is updated to Active mode!!" });

                }

            }

        }

    } catch (error) {

        console.log("change Exam marks controller error ----> ", error);

    }
};

exports.getExamMarksByPaperIdandUserId = async (req) => { // get examMarks By PaperId and UserId
    try {

        var sql = "SELECT * from examMarks WHERE paperId = '" + req.params.paperId + "' and userId = '" + req.params.userId + "'";

        const sqlQuery = await promisifyConQuery(sql);

        if (sqlQuery == null) {
            return ({ success: false, message: 'examMarks is not got!!' });
        }

        console.log(sqlQuery);

        return ({ success: true, message: 'examMarks is got!!', examMarks: sqlQuery.result });

    } catch (error) {

        console.log("get examMarks By PaperId and UserId controller error ----> ", error);

    }
};

exports.getExamLeaderboardByPaperId = async (req) => { // get Exam Leaderboard By PaperId
    try {

        var sql = "SELECT * from examMarks INNER JOIN user ON examMarks.userId=user.id WHERE paperId = '" + req.params.paperId + "'ORDER BY marks DESC";

        const leaderBoard = await promisifyConQuery(sql);

        if (leaderBoard == null) {
            return ({ success: false, message: 'examMarks is not got!!' });
        } else {
            var place = 1;
            var previousMark = 0;
            var sameplace = 1;
            leaders = [];
            for (var i = 0; i < leaderBoard.result.length; i++) {
                console.log(i);
                console.log(leaderBoard.result[i]);
                if (i == 0) {
                    previousMark = leaderBoard.result[i].marks
                }
                if (previousMark > leaderBoard.result[i].marks) {
                    console.log(i);
                    place = place + sameplace;
                    previousMark = leaderBoard.result[i].marks;
                    leader = {
                        "userId": leaderBoard.result[i].userId,
                        "districtId": leaderBoard.result[i].districtId,
                        "firstName": leaderBoard.result[i].firstName,
                        "lastName": leaderBoard.result[i].lastName,
                        "email": leaderBoard.result[i].email,
                        "marks": leaderBoard.result[i].marks,
                        "profileImage": leaderBoard.result[i].profileImageUrl,
                        "alYear": leaderBoard.result[i].alYear,
                        "place": place
                    }
                } else if (previousMark = leaderBoard.result[i].marks) {
                    if(i != 0){
                        sameplace = sameplace + 1;
                    }
                    leader = {
                        "userId": leaderBoard.result[i].userId,
                        "districtId": leaderBoard.result[i].districtId,
                        "firstName": leaderBoard.result[i].firstName,
                        "lastName": leaderBoard.result[i].lastName,
                        "email": leaderBoard.result[i].email,
                        "marks": leaderBoard.result[i].marks,
                        "profileImage": leaderBoard.result[i].profileImageUrl,
                        "alYear": leaderBoard.result[i].alYear,
                        "place": place
                    }
                }
                leaders.push(leader);
            }
        }

        console.log(leaders);

        return ({ success: true, message: 'examMarks is got!!', examMarks: leaders });

    } catch (error) {

        console.log("get Exam Leaderboard By PaperId controller error ----> ", error);

    }
};