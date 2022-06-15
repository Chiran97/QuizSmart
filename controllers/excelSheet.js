var excelToJson = require('convert-excel-to-json');
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

exports.postExcelSheet = async (req) => {

    try {

        console.log("files", req.files);
        let file = req.files.files;
        console.log("file", file);
        let filename = req.files.files.name;
        console.log(filename);
        console.log('file mime', file.mimetype);

        var rowSuccessCount = 0;

        if (file.mimetype !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && file.mimetype !== "application/vnd.ms-excel") {

            return ({ success: false, message: "File type is not valid" });

        }
        else {

            var checkPaper = "SELECT * from paper WHERE name = '" + req.body.name + "' AND subjectId = '" + req.body.subjectId + "' AND paperTypeId = '" + req.body.paperTypeId + "' AND languageId = '" + req.body.languageId + "'";
            const checkPaperQuery = await promisifyConQuery(checkPaper);
            console.log("check Language query ----> ", checkPaperQuery);

            if (checkPaperQuery.result.length != 0) {
                return ({ success: false, message: 'Paper Name Already Exists!' });

            } else {

                var paperName = (req.body.name).toUpperCase();
                console.log(req.body);
                var paper = "INSERT INTO paper (name, subjectId, paperTypeId, languageId, priority, status, paperTime) VALUES ('" + paperName + "', '" + req.body.subjectId + "', '" + req.body.paperTypeId + "', '" + req.body.languageId + "', '" + req.body.priority + "','" + req.body.status + "','" + req.body.paperTime + "')"
                const paperQuery = await promisifyConQuery(paper);
                console.log("paper query ----> ", paperQuery);

                if (!paperQuery.success) {

                    return ({ success: false, message: "Paper is not inserted!!" });

                } else {

                    var checkPaperId = "SELECT id from paper WHERE name = '" + req.body.name + "' AND subjectId = '" + req.body.subjectId + "' AND paperTypeId = '" + req.body.paperTypeId + "' AND languageId = '" + req.body.languageId + "'";
                    const checkPaperIdQuery = await promisifyConQuery(checkPaperId);
                    console.log("check Paper Id query ----> ", checkPaperIdQuery);


                    file.mv('/' + filename, async (err) => {

                        if (err) {

                            var deletePaperById = "DELETE from paper WHERE id = '" + checkPaperIdQuery.result[0].id + "'";
                            const deletePaperIdQuery = await promisifyConQuery(deletePaperById);
                            console.log("check Paper Id query ----> ", deletePaperIdQuery);
                            console.log(err)
                            return ({ success: false, message: "Rows are not successfully inserted!!" });

                        } else {

                            let result = excelToJson({
                                sourceFile: '/' + filename,
                                // header: { rows: 1 },
                                columnToKey: { A: 'question', B: 'correctAnswer', C: 'answer1', D: 'answer2', E: 'answer3', F: 'answer4', G: 'answer5', H: 'imageurl', I: 'questionNumber' },
                                sheet: ['Sheet1']
                            });

                            if (result.Sheet1[0].question === 'question' &&
                                result.Sheet1[0].correctAnswer === 'correctAnswer' &&
                                result.Sheet1[0].answer1 === 'answer1' &&
                                result.Sheet1[0].answer2 === 'answer2' &&
                                result.Sheet1[0].answer3 === 'answer3' &&
                                result.Sheet1[0].answer4 === 'answer4' &&
                                result.Sheet1[0].answer5 === 'answer5' &&
                                result.Sheet1[0].imageurl === 'imageurl' &&
                                result.Sheet1[0].questionNumber === 'questionNumber') {

                                for (var i = 1; i < result.Sheet1.length; i++) {

                                    console.log("Latest paper id = ", checkPaperIdQuery.result[0].id);
                                    var paperId = checkPaperIdQuery.result[0].id;
                                    var sql = "INSERT INTO question (question, correctAnswer, answer1, answer2, answer3, answer4, answer5, paperId, imageurl, questionNumber) VALUES ('" +
                                        result.Sheet1[i].question +
                                        "','" +
                                        result.Sheet1[i].correctAnswer +
                                        "','" +
                                        result.Sheet1[i].answer1 +
                                        "','" +
                                        result.Sheet1[i].answer2 +
                                        "','" +
                                        result.Sheet1[i].answer3 +
                                        "','" +
                                        result.Sheet1[i].answer4 +
                                        "','" +
                                        result.Sheet1[i].answer5 +
                                        "','" +
                                        paperId +
                                        "','" +
                                        result.Sheet1[i].imageurl +
                                        "','" +
                                        result.Sheet1[i].questionNumber +
                                        "')";

                                    const excelQuery = await promisifyConQuery(sql);

                                    console.log(excelQuery);

                                    if (!excelQuery.success) {

                                        console.log("excelQuery is not success");

                                    } else {
                                        rowSuccessCount++;
                                        console.log("excelQuery is success");

                                    }

                                    console.log(result.Sheet1[i])
                                }
                                console.log('asdfgtyuiop[]\][poigfdsasdfgh');
                                return ({ success: true, message: "successfully" });

                            }
                            else {
                                var deletePaperById = "DELETE from paper WHERE id = '" + checkPaperIdQuery.result[0].id + "'";
                                const deletePaperIdQuery = await promisifyConQuery(deletePaperById);
                                console.log("check Paper Id query ----> ", deletePaperIdQuery);
                                return ({ success: false, message: "columns are not matched!!" });

                            }
                        }
                    })
                    return ({ success: true, message: "all rows are inserted!!" });
                }
            }
        }
    }
    catch (error) {
        console.log("excelSheet controller error ----> ", error);
    }
}