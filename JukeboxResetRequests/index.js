// JukeboxResetRequests
// Copyright 2018 Epsotic LLC
'use strict';

exports.handler = (event, context, callback) => {
    var AWS = require("aws-sdk");
    var table = "CKSongs";
    AWS.config.update({
      region: "us-east-1"
    });
    var docClient = new AWS.DynamoDB.DocumentClient();

    var paramsScan = {
        TableName : table,
    	FilterExpression: "Requests >= :requestsValue",
        ExpressionAttributeValues: {
            ":requestsValue": 1
        }
    };
    
    var responseSuccess = JSON.stringify({ "Message": "Success" });

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : res,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,POST',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        },
    });

    var paramsUpdate = {
        TableName : table,
        UpdateExpression : "set Requests = :r",
        ExpressionAttributeValues :{
            ":r":0
        }
    };

    docClient.scan(paramsScan, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            done(err);
        }
        else
        {
            data.Items.forEach(function(song) {
                paramsUpdate.Key = { "Display": "Y", "Title": song.Title };
                docClient.update(paramsUpdate, function(err, data) {
                    if (err) {
                        console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                    }
                });
            });
            done(null,responseSuccess);
        }
    });
};