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

exports.changeMarks = async (req) => {  //  change marks
    try {

        var checkMarksQuery = "SELECT * from marks WHERE userId = '" + req.body.userId + "' and paperId = '" + req.body.paperId + "'";

        const mark = await promisifyConQuery(checkMarksQuery);

        if (mark.result.length === 0) {

            var marks = "INSERT INTO marks (marks, userId, paperId, questionCount) VALUES ('" + req.body.marks + "','" + req.body.userId + "','" + req.body.paperId + "','" + req.body.questionCount + "')";
            const marksQuery = await promisifyConQuery(marks);
            console.log("marks query ----> ", marksQuery);

            if (!marksQuery.success) {
                return ({ success: false, message: "marks are not inserted!!" });
            } else {
                return ({ success: true, message: "marks are inserted!!" });
            }

        } else {

            if (mark.result[0].marks < req.body.marks) {

                var changeMarks = "UPDATE marks SET marks = '" + req.body.marks + "', attempt = '" + (mark.result[0].attempt + 1 ) + "' WHERE userId = '" + req.body.userId + "' and paperId = '" + req.body.paperId + "'";
                console.log(changeMarks);
                const marksQuery = await promisifyConQuery(changeMarks);

                if (!marksQuery.success) {

                    return ({ success: false, message: "Marks is not updated to Active mode!!" });

                } else {

                    return ({ success: true, message: "Marks is updated to Active mode!!" });

                }

            } else {
                console.log(mark.result[0].attempt + 1);
                var changeMarks = "UPDATE marks SET attempt = '" + (mark.result[0].attempt + 1 ) + "' WHERE userId = '" + req.body.userId + "' and paperId = '" + req.body.paperId + "'";
                console.log(changeMarks);
                const marksQuery = await promisifyConQuery(changeMarks);

                if (!marksQuery.success) {

                    return ({ success: false, message: "Marks is not updated to Active mode!!" });

                } else {

                    return ({ success: true, message: "Marks is updated to Active mode!!" });

                }

            }

        }

    } catch (error) {

        console.log("change marks controller error ----> ", error);

    }
};


exports.getmarksByPaperIdandUserId = async (req) => { // get marks By PaperId and UserId
    try {

        var sql = "SELECT * from marks WHERE paperId = '" + req.params.paperId + "' and userId = '" + req.params.userId + "'";

        const sqlQuery = await promisifyConQuery(sql);

        if (sqlQuery == null) {
            return ({ success: false, message: 'marks is not got!!' });
        }

        console.log(sqlQuery);

        return ({ success: true, message: 'marks is got!!', marks: sqlQuery.result });

    } catch (error) {

        console.log("get marks By PaperId and UserId controller error ----> ", error);

    }
};


exports.leaderBoard = async (req) => { // leaderBoard
    try {

        console.log('aaaa', req.params.alYear);

        var leaderBoardArray = [];
        var leaderBoard = [];

        var userCountSql = "select distinct userId from marks";

        const sqlQuery = await promisifyConQuery(userCountSql);

        if (sqlQuery == null) {

            return ({ success: false, message: 'marks is not got!!' });

        } else {

            var filterSubject = "";
            var filterDistrict = "";

            if (req.params.districtId != 0 && req.params.subjectId != 0) {
                var filterSubject = "select id from paper where subjectId = '" + req.params.subjectId + "'";
                const sumfilterSubject = await promisifyConQuery(filterSubject);

                if (sumfilterSubject.result.length == 0) {

                    return ({ success: false, message: 'sumfilterSubject is not got!!' });

                } else {

                    var filterDistrict = "select id from user where districtId = '" + req.params.districtId + "' and alYear = '" + req.params.alYear + "'";

                    const sumfilterDistrict = await promisifyConQuery(filterDistrict);

                    if (sumfilterDistrict.result.length == 0) {

                        return ({ success: false, message: 'sumfilterDistrict is not got!!' });

                    }
                    else {

                        var districtUsers = [];

                        var a;
                        for (a = 0; a < sumfilterDistrict.result.length; a++) {
                            districtUsers.push(sumfilterDistrict.result[a].id);
                        }

                        console.log(sumfilterDistrict.result)

                        var i;
                        for (i = 0; i < sumfilterDistrict.result.length; i++) {

                            sumMarks = "SELECT SUM(marks) as sum from marks where userId = '" + sumfilterDistrict.result[i].id + "' and userId IN (" + districtUsers + ") and paperId IN (" + filterSubject + ")";
                            const sumMarksSqlQuery = await promisifyConQuery(sumMarks);

                            if (sumMarksSqlQuery.result.length == 0) {

                                return ({ success: false, message: 'sumMarksSqlQuery is not got!!' });

                            } else {

                                leaderBoardArray.push([sumfilterDistrict.result[i].id, sumMarksSqlQuery.result[0].sum]);

                            }

                        }

                    }
                }

            } else if (req.params.districtId != 0) {
                var filterDistrict = "select id from user where districtId = '" + req.params.districtId + "' and alYear = '" + req.params.alYear + "'";

                const sumfilterDistrict = await promisifyConQuery(filterDistrict);
                if (sumfilterDistrict.result.length == 0) {

                    return ({ success: false, message: 'sumfilterDistrict is not got!!' });

                }
                else {

                    var districtUsers = [];

                    var a;
                    for (a = 0; a < sumfilterDistrict.result.length; a++) {
                        districtUsers.push(sumfilterDistrict.result[a].id);
                    }

                    console.log(sumfilterDistrict.result)

                    var i;
                    for (i = 0; i < sumfilterDistrict.result.length; i++) {

                        sumMarks = "SELECT SUM(marks) as sum from marks where userId = '" + sumfilterDistrict.result[i].id + "' and userId IN (" + districtUsers + ")";
                        const sumMarksSqlQuery = await promisifyConQuery(sumMarks);

                        if (sumMarksSqlQuery.result.length == 0) {

                            return ({ success: false, message: 'sumMarksSqlQuery is not got!!' });

                        } else {

                            leaderBoardArray.push([sumfilterDistrict.result[i].id, sumMarksSqlQuery.result[0].sum]);

                        }

                    }

                }

            } else if (req.params.subjectId != 0) {

                var filterSubject = "select id from paper where subjectId = '" + req.params.subjectId + "'";
                const sumfilterSubject = await promisifyConQuery(filterSubject);

                if (sumfilterSubject.result.length == 0) {

                    return ({ success: false, message: 'sumfilterSubject is not got!!' });

                } else {
                    var i;
                    for (i = 0; i < sqlQuery.result.length; i++) {

                        sumMarks = "SELECT SUM(marks) as sum from marks where userId = '" + sqlQuery.result[i].userId + "' and paperId IN (" + filterSubject + ")";
                        const sumMarksSqlQuery = await promisifyConQuery(sumMarks);

                        if (sumMarksSqlQuery.result.length == 0) {

                            return ({ success: false, message: 'sumMarksSqlQuery is not got!!' });

                        } else {

                            leaderBoardArray.push([sqlQuery.result[i].userId, sumMarksSqlQuery.result[0].sum]);

                        }

                    }

                }

            } else {

                var i;
                for (i = 0; i < sqlQuery.result.length; i++) {

                    var sumMarks = "SELECT SUM(marks) as sum from marks where userId = '" + sqlQuery.result[i].userId + "'";
                    const sumMarksSqlQuery = await promisifyConQuery(sumMarks);

                    if (sumMarksSqlQuery == null) {

                        return ({ success: false, message: 'sumMarksSqlQuery is not got!!' });

                    } else {

                        leaderBoardArray.push([sqlQuery.result[i].userId, sumMarksSqlQuery.result[0].sum]);

                    }

                }

            }

            leaderBoardArray.sort(function (a, b) {
                return b[1] - a[1]
            });

            var j;
            for (j = 0; j < leaderBoardArray.length; j++) {
                userSql = "SELECT * from user where id = '" + leaderBoardArray[j][0] + "'";

                const userSqlQuery = await promisifyConQuery(userSql);

                if (userSqlQuery == null) {

                    return ({ success: false, message: 'user is not got!!' });

                } else {

                    if (leaderBoardArray[j][1] == null) {
                        marksWithUser = {
                            "email": userSqlQuery.result[0].email,
                            "name": userSqlQuery.result[0].firstName + " " + userSqlQuery.result[0].lastName,
                            "profileImageUrl": userSqlQuery.result[0].profileImageUrl,
                            "alYear": userSqlQuery.result[0].alYear,
                            "points": 0
                        }
                    } else {
                        marksWithUser = {
                            "email": userSqlQuery.result[0].email,
                            "name": userSqlQuery.result[0].firstName + " " + userSqlQuery.result[0].lastName,
                            "profileImageUrl": userSqlQuery.result[0].profileImageUrl,
                            "alYear": userSqlQuery.result[0].alYear,
                            "points": leaderBoardArray[j][1]
                        }
                    }
                    if (userSqlQuery.result[0].alYear == req.params.alYear) {
                        leaderBoard.push(marksWithUser);
                    }

                }

            }

            return ({ success: true, message: 'leaderBoard is got!!', leaderBoard: leaderBoard });

        }

    } catch (error) {

        console.log("leaderBoard controller error ----> ", error);

    }
};

exports.getLeaderboardByPaperId = async (req) => { // get Leaderboard By PaperId
    try {

        var sql = "SELECT * from marks INNER JOIN user ON marks.userId=user.id WHERE paperId = '" + req.params.paperId + "' and alYear = '" + req.params.alYear + "'ORDER BY marks DESC";

        const sqlQuery = await promisifyConQuery(sql);

        if (sqlQuery == null) {
            return ({ success: false, message: 'marks is not got!!' });
        }

        console.log(sqlQuery);

        return ({ success: true, message: 'marks is got!!', marks: sqlQuery.result });

    } catch (error) {

        console.log("get Leaderboard By PaperId controller error ----> ", error);

    }
};