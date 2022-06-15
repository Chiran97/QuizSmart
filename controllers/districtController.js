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

exports.createDistrict = async (req) => {     //  create District

    try {

        var checkDistricts = "SELECT * from district WHERE name = '" + req.body.name + "'";
        const checkDistrictQuery = await promisifyConQuery(checkDistricts);
        console.log("check district query ----> ", checkDistrictQuery);

        if (checkDistrictQuery.result.length != 0) {

            return ({ success: false, message: 'District Already Exists!' });

        } else {

            var districtNonUpper = req.body.name
            var districtName = districtNonUpper.toUpperCase()
            var district = "INSERT INTO district (name) VALUES ('" + districtName + "')"
            const districtQuery = await promisifyConQuery(district);
            console.log("district query ----> ", districtQuery);

            if (!districtQuery.success) {
                return ({ success: false, message: "district is not inserted!!" });
            } else {
                return ({ success: true, message: "district is inserted!!" });
            }

        }

    } catch (error) {

        console.log("create District controller error ----> ", error);

    }
}

exports.getAllDistricts = async (req) => {     //  get all Districts

    try {

        var allDistricts = "SELECT * from district ORDER BY name ASC";
        const allDistrictsQuery = await promisifyConQuery(allDistricts);
        console.log("all districts query ----> ", allDistrictsQuery);

        if (!allDistrictsQuery.success) {
            return ({ success: false, message: "all districts are not got!!" });
        } else {
            return ({ success: true, message: "all districts are got!!", result: allDistrictsQuery.result });
        }

    } catch (error) {

        console.log("create District controller error ----> ", error);

    }
}

exports.getActiveDistricts = async (req) => {     //  get active Districts

    try {

        var activeDistricts = "SELECT * from district WHERE status = 1";
        const activeDistrictsQuery = await promisifyConQuery(activeDistricts);
        console.log("all Districts query ----> ", activeDistrictsQuery);

        if (!activeDistrictsQuery.success) {
            return ({ success: false, message: "active Districts are not got!!" });
        } else {
            return ({ success: true, message: "active Districts are got!!", result: activeDistrictsQuery.result });
        }

    } catch (error) {

        console.log("get active Districts controller error ----> ", error);

    }
};

exports.updateDistrict = async (req) => {  //  update district
    try {

        var checkDistricts = "SELECT * from district WHERE name = '" + req.body.name + "'";
        const checkDistrictQuery = await promisifyConQuery(checkDistricts);
        console.log("check district query ----> ", checkDistrictQuery);

        if (checkDistrictQuery.result.length != 0) {

            return ({ success: false, message: 'District Already Exists!' });

        } else {

            var districtName = (req.body.name).toUpperCase();
            var district = "UPDATE district SET name='" + districtName + "' WHERE id ='" + req.params.id + "'";

            const updateDistrictQuery = await promisifyConQuery(district);

            if (!updateDistrictQuery.success) {
                return ({ success: false, message: "district is not updated!!" });
            } else {
                return ({ success: true, message: "district is updated!!" });
            }
        }

    } catch (error) {
        console.log("update District controller error ----> ", error);
    }

};

exports.getDistrictById = async (req) => {  //  get District by Id
    try {

        var getDistrictByIdQuery = "SELECT * from district WHERE id = '" + req.params.id + "'";

        const district = await promisifyConQuery(getDistrictByIdQuery);

        if (district == null) {
            return ({ success: false, message: 'district is not got!!' });
        }
        console.log(district);
        return ({ success: true, message: 'district is got!!', district: district });

    } catch (error) {
        console.log("get District By Id controller error ----> ", error);
    }
};

exports.changeStatusInDistrict = async (req) => {   //  change status in District
    try {

        var checkDistrictQuery = "SELECT * from district WHERE id = '" + req.params.id + "'";

        const district = await promisifyConQuery(checkDistrictQuery);

        if (district == null) {

            return ({ success: false, message: 'district is not got!!' });

        } else {

            if (district.result[0].status === 0) {

                var changeStatus = "UPDATE district SET status = 1 WHERE id ='" + req.params.id + "'";
                const changedDistrict = await promisifyConQuery(changeStatus);

                if (!changedDistrict.success) {

                    return ({ success: false, message: "district is not updated to enabled mode!!" });

                } else {

                    return ({ success: true, message: "district is updated to enabled mode!!" });

                }

            } else {

                var changeStatus = "UPDATE district SET status = 0 WHERE id ='" + req.params.id + "'";
                const changedDistrict = await promisifyConQuery(changeStatus);

                if (!changedDistrict.success) {

                    return ({ success: false, message: "district is not updated to disbaled mode!!" });

                } else {

                    return ({ success: true, message: "district is updated to disbaled mode!!" });

                }
            }
        }

    } catch (error) {
        console.log("change status in District controller error ----> ", error);
    }
};