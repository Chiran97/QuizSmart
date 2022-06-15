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

exports.createStream = async (req) => {     //  create Stream

    try {

        var checkStreams = "SELECT * from stream WHERE name = '" + req.body.name + "'";
        const checkStreamQuery = await promisifyConQuery(checkStreams);
        console.log("check Stream query ----> ", checkStreamQuery);

        if (checkStreamQuery.result.length != 0) {

            return ({ success: false, message: 'Stream Already Exists!' });

        } else {

            var streamName = (req.body.name).toUpperCase();
            var stream = "INSERT INTO stream (name) VALUES ('" + streamName + "')"
            const streamQuery = await promisifyConQuery(stream);
            console.log("Stream query ----> ", streamQuery);

            if (!streamQuery.success) {
                return ({ success: false, message: "Stream is not inserted!!" });
            } else {
                return ({ success: true, message: "Stream is inserted!!" });
            }

        }

    } catch (error) {

        console.log("create Stream controller error ----> ", error);

    }
};

exports.getAllStreams = async (req) => {     //  get all Streams

    try {

        var allStreams = "SELECT * from stream ORDER BY name ASC";
        const allStreamsQuery = await promisifyConQuery(allStreams);
        console.log("all Streams query ----> ", allStreamsQuery);

        if (!allStreamsQuery.success) {
            return ({ success: false, message: "all Streams are not got!!" });
        } else {
            return ({ success: true, message: "all Streams are got!!", result: allStreamsQuery.result });
        }

    } catch (error) {

        console.log("get all Streams controller error ----> ", error);

    }
};

exports.getActiveStreams = async (req) => {     //  get active Streams

    try {

        var activeStreams = "SELECT * from stream WHERE status = 1";
        const activeStreamsQuery = await promisifyConQuery(activeStreams);
        console.log("all Streams query ----> ", activeStreamsQuery);

        if (!activeStreamsQuery.success) {
            return ({ success: false, message: "active Streams are not got!!" });
        } else {
            return ({ success: true, message: "active Streams are got!!", result: activeStreamsQuery.result });
        }

    } catch (error) {

        console.log("get active Streams controller error ----> ", error);

    }
};

exports.updateStream = async (req) => {  //  update Stream
    try {

        var checkStreams = "SELECT * from Stream WHERE name = '" + req.body.name + "'";
        const checkStreamQuery = await promisifyConQuery(checkStreams);
        console.log("check Stream query ----> ", checkStreamQuery);

        if (checkStreamQuery.result.length != 0) {

            return ({ success: false, message: 'Stream Already Exists!' });

        } else {
            var streamName = (req.body.name).toUpperCase();
            var stream = "UPDATE Stream SET name='" + streamName + "' WHERE id ='" + req.params.id + "'";


            const updateStreamQuery = await promisifyConQuery(stream);

            if (!updateStreamQuery.success) {
                return ({ success: false, message: "Stream is not updated!!" });
            } else {
                return ({ success: true, message: "Stream is updated!!" });
            }
        }

    } catch (error) {
        console.log("update Stream controller error ----> ", error);
    }

};

exports.getStreamById = async (req) => {    //  get Stream by id
    try {

        var sql = "SELECT * from stream WHERE id = '" + req.params.id + "'";

        const sqlQuery = await promisifyConQuery(sql);

        if (sqlQuery == null) {
            return ({ success: false, message: 'stream is not got!!' });
        }
        return ({ success: true, message: 'stream is got!!', stream: sqlQuery });

    } catch (error) {
        console.log("get stream By Id controller error ----> ", error);
    }
};

exports.changeStatusInStream = async (req) => { //  change status in Stream
    try {

        var checkStreamQuery = "SELECT * from stream WHERE id = '" + req.params.id + "'";

        const stream = await promisifyConQuery(checkStreamQuery);

        if (stream == null) {

            return ({ success: false, message: 'stream is not got!!' });

        } else {

            if (stream.result[0].status === 0) {

                var changeStatus = "UPDATE stream SET status = 1 WHERE id ='" + req.params.id + "'";
                const changedStream = await promisifyConQuery(changeStatus);

                if (!changedStream.success) {

                    return ({ success: false, message: "stream is not updated to enabled mode!!" });

                } else {

                    return ({ success: true, message: "stream is updated to enabled mode!!" });

                }

            } else {

                var changeStatus = "UPDATE stream SET status = 0 WHERE id ='" + req.params.id + "'";
                const changedStream = await promisifyConQuery(changeStatus);

                if (!changedStream.success) {

                    return ({ success: false, message: "stream is not updated to disbaled mode!!" });

                } else {

                    return ({ success: true, message: "stream is updated to disbaled mode!!" });

                }
            }
        }

    } catch (error) {
        console.log("change status in stream controller error ----> ", error);
    }
};