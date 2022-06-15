var dbConnection = require('../config/config');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/authConfig');
require('dotenv').config();
const mysql = require('mysql');
var generator = require('generate-password');
var nodemailer = require('nodemailer');
const AWS = require("aws-sdk");

AWS.config.update({
    accessKeyId: process.env.accessKeyIdIam,
    secretAccessKey: process.env.secretAccessKeyIam,
    region: process.env.region
});

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

exports.userSignUp = async (req) => {     //  User sign up

    try {

        console.log(req)

        const password = await authConfig.generateHash(req.body.password);
        const email = authConfig.emailValidation(req.body.email);

        console.log('password ---> ', password);
        console.log('email ---> ', email);
        if (!email.success) {

            return ({ success: false, message: 'Please enter a valid email address.' });

        } else {

            var checkEmail = "SELECT email from user WHERE email = '" + req.body.email + "'";
            const checkUserQuery = await promisifyConQuery(checkEmail);
            console.log(checkUserQuery.result);

            if (checkUserQuery.result.length != 0) {

                return ({ success: false, message: 'The provided email address already exists.' });

            } else {

                if (req.body.userTypeId == 1) {

                    var user = "INSERT INTO user (firstName, lastName, email, password, alYear, userTypeId, districtId) VALUES ('" + req.body.firstName + "','" + req.body.lastName + "', '" + req.body.email + "', '" + password.bcryptPassword + "', '" + req.body.alYear + "', '" + req.body.userTypeId + "', '" + req.body.districtId + "')"
                    const userQuery = await promisifyConQuery(user);
                    console.log("student Query ----> ", userQuery);

                    if (!userQuery.success) {

                        return ({ success: false, message: "District or A/L Year is required" });

                    } else {

                        const jwtUser = {
                            "firstName": req.body.firstName,
                            "lastName": req.body.lastName,
                            "email": req.body.email,
                            "userTypeId": req.body.userTypeId,
                            "alYear": req.body.alYear,
                            "districtId": req.body.districtId
                        }

                        let token = jwt.sign(jwtUser, process.env.SECRETKEY);
                        return ({ success: true, message: "student is successfully inserted!!", token: token });

                    }
                } else {

                    var user = "INSERT INTO user (firstName, lastName, email, password, userTypeId) VALUES ('" + req.body.firstName + "','" + req.body.lastName + "', '" + req.body.email + "', '" + password.bcryptPassword + "', '" + req.body.userTypeId + "')"
                    const userQuery = await promisifyConQuery(user);
                    console.log("admin Query ----> ", userQuery);

                    if (!userQuery.success) {

                        return ({ success: false, message: "admin is not successfully inserted!!" });

                    } else {

                        const jwtUser = {
                            "firstName": req.body.firstName,
                            "lastName": req.body.lastName,
                            "email": req.body.email,
                            "userTypeId": req.body.userTypeId
                        }

                        let token = jwt.sign(jwtUser, process.env.SECRETKEY);
                        return ({ success: true, message: "admin is successfully inserted!!", token: token });

                    }
                }

            }

        }

    } catch (error) {

        console.log("register controller error =====> ", error);

    }
}

exports.userSignIn = async (req) => {     //  User sign in

    try {

        const email = req.body.email;
        const password = req.body.password;

        let sql = 'SELECT * FROM user WHERE email = ' + mysql.escape(email);

        const userQuery = await promisifyConQuery(sql);
        console.log(userQuery.result);
        if (userQuery.result.length != 0) {
            console.log("hit here");

            let userPW = userQuery.result[0].password;
            console.log(password);
            console.log("aaaaaaaaaaaaa");
            console.log(userPW);

            const verifyPass = authConfig.verifyPassword(password, userPW);
            console.log(verifyPass);
            if (verifyPass.success) {
                console.log("hit here here");

                if (userQuery.result[0].userTypeId == 1) {

                    const jwtUser = {
                        "firstName": userQuery.result[0].firstName,
                        "lastName": userQuery.result[0].lastName,
                        "email": userQuery.result[0].email,
                        "userTypeId": userQuery.result[0].userTypeId,
                        "alYear": userQuery.result[0].alYear,
                        "districtId": userQuery.result[0].districtId
                    }

                    console.log(jwtUser);

                    let token = jwt.sign(jwtUser, process.env.SECRETKEY);
                    return ({ success: true, message: "user is successfully sign in!!", token: token, userTypeId: userQuery.result[0].userTypeId });

                } else {
                    console.log("hit here here here");


                    const jwtUser = {
                        "firstName": userQuery.result[0].firstName,
                        "lastName": userQuery.result[0].lastName,
                        "email": userQuery.result[0].email,
                        "userTypeId": userQuery.result[0].userTypeId
                    }

                    let token = jwt.sign(jwtUser, process.env.SECRETKEY);
                    return ({ success: true, message: "admin is successfully sign in!!", token: token, userTypeId: userQuery.result[0].userTypeId });

                }

            } else {
                console.log("hit here here here here");

                return ({ success: false, message: "Please enter the correct password." });

            }
        } else {

            return ({ success: false, message: "The provided email address does not exist." });

        }
    } catch (error) {

        console.log("User sign in controller error ----> ", error);

    }
};

exports.forgotPassword = async (req) => {  //  forgot Password
    try {

        var checkUsers = "SELECT * from user WHERE email = '" + req.body.email + "'";
        const checkUsersQuery = await promisifyConQuery(checkUsers);
        console.log("check user query ----> ", checkUsersQuery);

        if (checkUsersQuery.result.length != 0) {
            console.log(checkUsersQuery.result.length);
            var password = generator.generate({
                length: 6,
                numbers: true,
                uppercase: false,
                excludeSimilarCharacters: true,
            });

            var email = req.body.email;
            const passwordNew = await authConfig.generateHash(password);
            var user = "UPDATE user SET password='" + passwordNew.bcryptPassword + "' WHERE email ='" + req.body.email + "'";

            const updateUserPasswordQuery = await promisifyConQuery(user);

            if (!updateUserPasswordQuery.success) {

                return ({ success: false, message: "user password is not updated." });

            } else {

                let transporter = nodemailer.createTransport({
                    SES: new AWS.SES({
                        apiVersion: '2010-12-01'
                    })
                });

                let mail = {
                    from: process.env.userAccount,
                    to: email,
                    subject: 'Reset Password',
                    html: `<html><body><p> Dear ${checkUsersQuery.result[0].firstName}, </p>\n<p>Use this password ''<b>${password}</b>'' to log into your MyMcq account. You can reset this password when you log in to your account.</p><p>Thank You.<br> Best Regards,<br>Team MyMcq.</p></body></html>`
                };

                transporter.sendMail(mail)
                    .then(function (info) {
                        console.log("mail");
                    })
                    .catch(function (error) {
                        console.log("no mail");
                    });
                return ({ success: true, message: "email is sent!!" });
            }
        } else {
            return ({ success: false, message: "The provided email address does not exist." });
        }

    } catch (error) {
        console.log("forgot Password controller error ----> ", error);
    }

};
