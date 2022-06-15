const bcrypt = require('bcryptjs');

exports.generateHash = async (password) => {
    try {

        const bcryptPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

        return ({ success: true, message: 'password is encoded', bcryptPassword: bcryptPassword });

    } catch (error) {

        console.log('generateHash ----> ', error);

    }

};

exports.emailValidation = (email) => {
    try {

        var regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var emailValidorNot = regExp.test(String(email).toLowerCase());

        if (emailValidorNot === false) {

            return ({ success: false, message: 'email is not valid' });

        } else {

            return ({ success: true, message: 'email is valid' });

        }
    } catch (error) {

        console.log('email Validation ----> ', error);

    }
};

exports.verifyPassword = (inputPassword, encryptedPassword) => {
    try {

        var compare = bcrypt.compareSync(inputPassword, encryptedPassword);

        if (compare === false) {

            return ({ success: false, message: 'verify Password is not succesful' });

        } else {

            return ({ success: true, message: 'verify Password is succesful' });

        }

    } catch (error) {

        console.log('verify Password ----> ', error);

    }
};