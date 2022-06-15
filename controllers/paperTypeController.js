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

exports.createPaperType = async (req) => {     //  create Paper Type

    try {

        var checkPaperTypes = "SELECT * from papertype WHERE name = '" + req.body.name + "'";
        const checkPaperTypeQuery = await promisifyConQuery(checkPaperTypes);
        console.log("check Paper Type query ----> ", checkPaperTypeQuery);

        if (checkPaperTypeQuery.result.length != 0) {

            return ({ success: false, message: 'Paper Type Already Exists!' });

        } else {

            var paperTypeName = (req.body.name).toUpperCase();
            var paperType = "INSERT INTO papertype (name) VALUES ('" + paperTypeName + "')"
            const paperTypeQuery = await promisifyConQuery(paperType);
            console.log("Paper Type query ----> ", paperTypeQuery);

            if (!paperTypeQuery.success) {
                return ({ success: false, message: "Paper Type is not inserted!!" });
            } else {
                return ({ success: true, message: "Paper Type is inserted!!" });
            }

        }

    } catch (error) {

        console.log("create Paper Type controller error ----> ", error);

    }
}

exports.getAllPaperTypes = async (req) => {     //  get all Paper Types

    try {

        var allPaperTypes = "SELECT * from papertype ORDER BY name ASC";
        const allPaperTypesQuery = await promisifyConQuery(allPaperTypes);
        console.log("all Paper Types query ----> ", allPaperTypesQuery);

        if (!allPaperTypesQuery.success) {
            return ({ success: false, message: "all Paper Types are not got!!" });
        } else {
            return ({ success: true, message: "all Paper Types are got!!", result: allPaperTypesQuery.result });
        }

    } catch (error) {

        console.log("get all Paper Types controller error ----> ", error);

    }
}

exports.getActivePaperTypes = async (req) => {     //  get active Paper Types

    try {

        var activePaperType = "SELECT * from papertype WHERE status = 1";
        const activePaperTypesQuery = await promisifyConQuery(activePaperType);
        console.log("all Paper Type query ----> ", activePaperTypesQuery);

        if (!activePaperTypesQuery.success) {
            return ({ success: false, message: "active Paper Types are not got!!" });
        } else {
            return ({ success: true, message: "active Paper Types are got!!", result: activePaperTypesQuery.result });
        }

    } catch (error) {

        console.log("get active Paper Types controller error ----> ", error);

    }
};

exports.updatePaperType = async (req) => {  //  update Paper Type
    try {

        var checkPaperTypes = "SELECT * from papertype WHERE name = '" + req.body.name + "'";
        const checkPaperTypeQuery = await promisifyConQuery(checkPaperTypes);
        console.log("check Paper Type query ----> ", checkPaperTypeQuery);

        if (checkPaperTypeQuery.result.length != 0) {

            return ({ success: false, message: 'Paper Type Already Exists!' });

        } else {
            var paperTypeName = (req.body.name).toUpperCase();
            var paperType = "UPDATE papertype SET name='" + paperTypeName + "' WHERE id ='" + req.params.id + "'";


            const updatePaperTypeQuery = await promisifyConQuery(paperType);

            if (!updatePaperTypeQuery.success) {
                return ({ success: false, message: "Paper Type is not updated!!" });
            } else {
                return ({ success: true, message: "Paper Type is updated!!" });
            }
        }

    } catch (error) {
        console.log("update Paper Type controller error ----> ", error);
    }

};

exports.getPaperTypeById = async (req) => { //  get Paper type by id
    try {

        var sql = "SELECT * from papertype WHERE id = '" + req.params.id + "'";

        const sqlQuery = await promisifyConQuery(sql);

        if (sqlQuery == null) {
            return ({ success: false, message: 'paper type is not got!!' });
        }
        return ({ success: true, message: 'paper type is got!!', paperType: sqlQuery });

    } catch (error) {
        console.log("get Paper Type By Id controller error ----> ", error);
    }
};

exports.changeStatusInPaperType = async (req) => {  //  change status in Paper type
    try {

        var checkPaperTypeQuery = "SELECT * from papertype WHERE id = '" + req.params.id + "'";

        const paperType = await promisifyConQuery(checkPaperTypeQuery);

        if (paperType == null) {

            return ({ success: false, message: 'paper type is not got!!' });

        } else {

            if (paperType.result[0].status === 0) {

                var changeStatus = "UPDATE papertype SET status = 1 WHERE id ='" + req.params.id + "'";
                const changedPaperType = await promisifyConQuery(changeStatus);

                if (!changedPaperType.success) {

                    return ({ success: false, message: "Paper type is not updated to enabled mode!!" });

                } else {

                    return ({ success: true, message: "Paper type is updated to enabled mode!!" });

                }

            } else {

                var changeStatus = "UPDATE papertype SET status = 0 WHERE id ='" + req.params.id + "'";
                const changedPaperType = await promisifyConQuery(changeStatus);

                if (!changedPaperType.success) {

                    return ({ success: false, message: "Paper type is not updated to disbaled mode!!" });

                } else {

                    return ({ success: true, message: "Paper type is updated to disbaled mode!!" });

                }
            }
        }

    } catch (error) {
        console.log("change status in Paper type controller error ----> ", error);
    }

};


exports.getPaperTypesBySubjectId = async (req) => {    // get PaperTypes By Subject Id
    try {

        var sql = "SELECT * from papertype WHERE id IN (SELECT paperTypeId from subject_papertype WHERE subjectId = '" + req.params.subjectId + "') AND status = 1 ";

        const sqlQuery = await promisifyConQuery(sql);

        if (sqlQuery == null) {
            return ({ success: false, message: 'papertype is not got!!' });
        }
        return ({ success: true, message: 'papertype is got!!', papertypes: sqlQuery.result });

    } catch (error) {

        console.log("get PaperTypes By Subject Id controller error ----> ", error);
    }
};