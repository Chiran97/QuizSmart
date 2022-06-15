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

exports.addMarks = async (req) => { // add Marks
    try {

        var checkMarksQuery = "SELECT * from " + req.params.subject + " WHERE userId = '" + req.body.userId + "' and alYear = '" + req.body.alYear + "'";
        const mark = await promisifyConQuery(checkMarksQuery);

        console.log(mark.result);

        if (mark.result.length === 0) {

            var marks = "INSERT INTO " + req.params.subject + " (userId, firstName, lastName, email, alYear, profileImageUrl, districtId, marks) VALUES ('" + req.body.userId + "','" + req.body.firstName + "','" + req.body.lastName + "','" + req.body.email + "','" + req.body.alYear + "','" + req.body.profileImageUrl + "','" + req.body.districtId + "','" + req.body.marks + "')";
            const marksQuery = await promisifyConQuery(marks);

            if (!marksQuery.success) {
                return ({ success: false, message: "marks are not inserted!!" });
            } else {
                return ({ success: true, message: "marks are inserted!!" });
            }

        } else {

            newMark = parseInt(req.body.marks) + parseInt(mark.result[0].marks);

            var changeMarks = "UPDATE " + req.params.subject + " SET marks = '" + newMark + "' WHERE userId = '" + req.body.userId + "' and alYear = '" + req.body.alYear + "'";
            const marksQuery = await promisifyConQuery(changeMarks);

            if (!marksQuery.success) {

                return ({ success: false, message: "Marks is not updated to Active mode!!" });

            } else {

                return ({ success: true, message: "Marks is updated to Active mode!!" });

            }
        }
    } catch (error) {

        console.log("add Marks controller error ----> ", error);

    }
};


exports.leaderBoard = async (req) => { // leaderBoard
    try {
        if (req.params.districtId == 0) {
            var leaderBoardQuery = "select s.userId, u.districtId, u.firstName, u.lastName, u.email, u.profileImageUrl, u.alYear, s.marks from " + req.params.subject + " as s INNER JOIN user as u ON s.userId=u.id where s.alYear = '" + req.params.alYear + "' and s.marks > 0 ORDER BY s.marks DESC";
            const leaderBoard = await promisifyConQuery(leaderBoardQuery);

            if (leaderBoard.result.length == 0) {

                return ({ success: false, message: 'sumfilterSubject is not got!!' });

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
                        if (i != 0) {
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

                return ({ success: true, message: 'sumfilterSubject is got!!', leaderBoard: leaders });

            }

        } else {
            var leaderBoardQuery = "select s.userId, u.districtId, u.firstName, u.lastName, u.email, u.profileImageUrl, u.alYear, s.marks from " + req.params.subject + " as s INNER JOIN user as u ON s.userId=u.id where u.districtId = '" + req.params.districtId + "' and s.alYear = '" + req.params.alYear + "' and s.marks > 0 ORDER BY s.marks DESC";
            const leaderBoard = await promisifyConQuery(leaderBoardQuery);

            if (leaderBoard.result.length == 0) {

                return ({ success: false, message: 'sumfilterSubject&district is not got!!' });

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
                        if (i != 0) {
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

                return ({ success: true, message: 'sumfilterSubject&district is got!!', leaderBoard: leaders });

            }

        }


    } catch (error) {

        console.log("leaderBoard controller error ----> ", error);

    }
};

exports.islandRank = async (req) => { // island Rank
    try {
        var leaderBoardQuery = "select userId, marks from " + req.params.subject + " where alYear = '" + req.params.alYear + "' and marks > 0 ORDER BY marks DESC";
        const leaderBoard = await promisifyConQuery(leaderBoardQuery);
        console.log(leaderBoard);
        if (leaderBoard.result.length == 0) {
            return ({ success: false, message: 'islandRank is not got!!' });

        } else {
            var place = 1;
            var previousMark = 0;
            for (var i = 0; i < leaderBoard.result.length; i++) {
                console.log(i);
                console.log(leaderBoard.result[i]);
                if (i == 0) {
                    previousMark = leaderBoard.result[0].marks
                }
                if (previousMark > leaderBoard.result[i].marks) {
                    console.log(i);
                    place = place + 1;
                    previousMark = leaderBoard.result[i].marks;
                    if (req.params.userId == leaderBoard.result[i].userId) {
                        return ({ success: true, message: 'islandRank is got!!', islandRank: place, points: leaderBoard.result[i].marks });
                    }
                } else if (previousMark = leaderBoard.result[i].marks) {
                    if (req.params.userId == leaderBoard.result[i].userId) {
                        return ({ success: true, message: 'islandRank is got!!', islandRank: place, points: leaderBoard.result[i].marks });
                    }
                }
            }
            console.log('aaaaaa')
            return ({ success: false, message: 'islandRank is not got!!' });
        }


    } catch (error) {

        console.log("islandRank controller error ----> ", error);

    }
};

exports.districtRank = async (req) => { // district Rank
    try {
        var leaderBoardQuery = "select userId, marks from " + req.params.subject + " where alYear = '" + req.params.alYear + "' and districtId = '" + req.params.districtId + "' and marks > 0 ORDER BY marks DESC";
        const leaderBoard = await promisifyConQuery(leaderBoardQuery);

        if (leaderBoard.result.length == 0) {

            return ({ success: false, message: 'districtRank is not got!!' });

        } else {
            var place = 1;
            var previousMark = 0;
            for (var i = 0; i < leaderBoard.result.length; i++) {
                console.log(i);
                console.log(leaderBoard.result[i]);
                if (i == 0) {
                    previousMark = leaderBoard.result[0].marks
                }
                if (previousMark > leaderBoard.result[i].marks) {
                    console.log(i);
                    place = place + 1;
                    previousMark = leaderBoard.result[i].marks;
                    if (req.params.userId == leaderBoard.result[i].userId) {
                        return ({ success: true, message: 'districtRank is got!!', districtRank: place, points: leaderBoard.result[i].marks });
                    }
                } else if (previousMark = leaderBoard.result[i].marks) {
                    if (req.params.userId == leaderBoard.result[i].userId) {
                        return ({ success: true, message: 'districtRank is got!!', districtRank: place, points: leaderBoard.result[i].marks });
                    }
                }
            }

            return ({ success: false, message: 'districtRank is not got!!' });

        }


    } catch (error) {

        console.log("districtRank controller error ----> ", error);

    }
};