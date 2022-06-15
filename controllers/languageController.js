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

exports.createLanguage = async (req) => {     //  create Language

    try {

        var checkLanguages = "SELECT * from language WHERE name = '" + req.body.name + "'";
        const checkLanguageQuery = await promisifyConQuery(checkLanguages);
        console.log("check Language query ----> ", checkLanguageQuery);

        if (checkLanguageQuery.result.length != 0) {

            return ({ success: false, message: 'Language Already Exists!' });

        } else {

            var languageName = (req.body.name).toUpperCase();
            var language = "INSERT INTO language (name) VALUES ('" + languageName + "')"
            const languageQuery = await promisifyConQuery(language);
            console.log("language query ----> ", languageQuery);

            if (!languageQuery.success) {
                return ({ success: false, message: "Language is not inserted!!" });
            } else {
                return ({ success: true, message: "Language is inserted!!" });
            }

        }

    } catch (error) {

        console.log("create Language controller error ----> ", error);

    }
}

exports.getAllLanguages = async (req) => {     //  get all Languages

    try {

        var allLanguages = "SELECT * from language ORDER BY name ASC";
        const allLanguagesQuery = await promisifyConQuery(allLanguages);
        console.log("all Languages query ----> ", allLanguagesQuery);

        if (!allLanguagesQuery.success) {
            return ({ success: false, message: "all Languages are not got!!" });
        } else {
            return ({ success: true, message: "all Languages are got!!", result: allLanguagesQuery.result });
        }

    } catch (error) {

        console.log("create Language controller error ----> ", error);

    }
}

exports.updateLanguage = async (req) => {  //  update Language
    try {

        var checkLanguages = "SELECT * from language WHERE name = '" + req.body.name + "'";
        const checkLanguageQuery = await promisifyConQuery(checkLanguages);
        console.log("check Language query ----> ", checkLanguageQuery);

        if (checkLanguageQuery.result.length != 0) {

            return ({ success: false, message: 'Language Already Exists!' });

        } else {

            var languageName = (req.body.name).toUpperCase();
            var language = "UPDATE language SET name='" + languageName + "' WHERE id ='" + req.params.id + "'";

            const updateLanguageQuery = await promisifyConQuery(language);

            if (!updateLanguageQuery.success) {
                return ({ success: false, message: "Language is not updated!!" });
            } else {
                return ({ success: true, message: "Language is updated!!" });
            }
        }

    } catch (error) {
        console.log("update Language controller error ----> ", error);
    }

};

exports.getLanguageById = async (req) => {  //  get Language by Id
    try {

        var getLanguageByIdQuery = "SELECT * from language WHERE id = '" + req.params.id + "'";

        const language = await promisifyConQuery(getLanguageByIdQuery);

        if (language == null) {
            return ({ success: false, message: 'Language is not got!!' });
        }
        return ({ success: true, message: 'Language is got!!', language: language });

    } catch (error) {
        console.log("get Language By Id controller error ----> ", error);
    }
};

exports.changeStatusInLanguage = async (req) => {   //  change status in Language
    try {

        var checkLanguageQuery = "SELECT * from language WHERE id = '" + req.params.id + "'";

        const language = await promisifyConQuery(checkLanguageQuery);

        if (language == null) {

            return ({ success: false, message: 'Language is not got!!' });

        } else {

            if (language.result[0].status === 0) {

                var changeStatus = "UPDATE language SET status = 1 WHERE id ='" + req.params.id + "'";
                const changedLanguage = await promisifyConQuery(changeStatus);

                if (!changedLanguage.success) {

                    return ({ success: false, message: "Language is not updated to enabled mode!!" });

                } else {

                    return ({ success: true, message: "Language is updated to enabled mode!!" });

                }

            } else {

                var changeStatus = "UPDATE language SET status = 0 WHERE id ='" + req.params.id + "'";
                const changedLanguage = await promisifyConQuery(changeStatus);

                if (!changedLanguage.success) {

                    return ({ success: false, message: "Language is not updated to disbaled mode!!" });

                } else {

                    return ({ success: true, message: "Language is updated to disbaled mode!!" });

                }
            }
        }

    } catch (error) {
        console.log("change status in Language controller error ----> ", error);
    }
};