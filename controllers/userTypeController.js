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

exports.createUserType = async (req) => {     //  create User Type

    try {

        var checkUserTypes = "SELECT * from usertype WHERE name = '" + req.body.name + "'";
        const checkUserTypeQuery = await promisifyConQuery(checkUserTypes);
        console.log("check User type query ----> ", checkUserTypeQuery);

        if (checkUserTypeQuery.result.length != 0) {

            return ({ success: false, message: 'User type Already Exists!' });

        } else {

            var userType = "INSERT INTO usertype (name) VALUES ('" + req.body.name + "')"
            const userTypeQuery = await promisifyConQuery(userType);
            console.log("User type query ----> ", userTypeQuery);

            if (!userTypeQuery.success) {
                return ({ success: false, message: "User type is not inserted!!" });
            } else {
                return ({ success: true, message: "User type is inserted!!" });
            }

        }

    } catch (error) {

        console.log("create User type controller error ----> ", error);

    }
};

exports.getAllUserTypes = async (req) => {     //  get all User types

    try {

        var allUserTypes = "SELECT * from usertype ORDER BY name ASC";
        const allUserTypesQuery = await promisifyConQuery(allUserTypes);
        console.log("all User types query ----> ", allUserTypesQuery);

        if (!allUserTypesQuery.success) {
            return ({ success: false, message: "all User types are not got!!" });
        } else {
            return ({ success: true, message: "all User types are got!!", result: allUserTypesQuery.result });
        }

    } catch (error) {

        console.log("get all User types controller error ----> ", error);

    }
};

exports.updateUserType = async (req) => {  //  update User type
    try {

        var checkUserTypes = "SELECT * from usertype WHERE name = '" + req.body.name + "'";
        const checkUserTypeQuery = await promisifyConQuery(checkUserTypes);
        console.log("check User type query ----> ", checkUserTypeQuery);

        if (checkUserTypeQuery.result.length != 0) {

            return ({ success: false, message: 'User type Already Exists!' });

        } else {
            
            var userType = "UPDATE usertype SET name='" + req.body.name + "' WHERE id ='" + req.params.id + "'";


            const updateUserTypeQuery = await promisifyConQuery(userType);

            if (!updateUserTypeQuery.success) {
                return ({ success: false, message: "User type is not updated!!" });
            } else {
                return ({ success: true, message: "User type is updated!!" });
            }
        }

    } catch (error) {
        console.log("update User type controller error ----> ", error);
    }

};

exports.getUserTypeById = async (req) => {    //  get User type by id
    try {

        var sql = "SELECT * from usertype WHERE id = '" + req.params.id + "'";

        const sqlQuery = await promisifyConQuery(sql);

        if (sqlQuery == null) {
            return ({ success: false, message: 'User type is not got!!' });
        }
        return ({ success: true, message: 'User type is got!!', userType: sqlQuery });

    } catch (error) {
        console.log("get User type By Id controller error ----> ", error);
    }
};

exports.changeStatusInUserType = async (req) => { //  change status in User type
    try {

        var checkUserTypeQuery = "SELECT * from usertype WHERE id = '" + req.params.id + "'";

        const userType = await promisifyConQuery(checkUserTypeQuery);

        if (userType == null) {

            return ({ success: false, message: 'User type is not got!!' });

        } else {

            if (userType.result[0].status === 0) {

                var changeStatus = "UPDATE usertype SET status = 1 WHERE id ='" + req.params.id + "'";
                const changedUserType = await promisifyConQuery(changeStatus);

                if (!changedUserType.success) {

                    return ({ success: false, message: "User type is not updated to enabled mode!!" });

                } else {

                    return ({ success: true, message: "User type is updated to enabled mode!!" });

                }

            } else {

                var changeStatus = "UPDATE usertype SET status = 0 WHERE id ='" + req.params.id + "'";
                const changedUserType = await promisifyConQuery(changeStatus);

                if (!changedUserType.success) {

                    return ({ success: false, message: "User type is not updated to disbaled mode!!" });

                } else {

                    return ({ success: true, message: "User type is updated to disbaled mode!!" });

                }
            }
        }

    } catch (error) {
        console.log("change status in User type controller error ----> ", error);
    }
};