// JukeboxAddRequests
// Copyright 2018 Epsotic LLC
'use strict';

exports.handler = (event, context, callback) => {
    var AWS = require("aws-sdk");
    AWS.config.update({
      region: "us-east-1"
    });
    var docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
        TableName: "CKSongs",
        UpdateExpression: "SET Requests = Requests + :inc",
        ExpressionAttributeValues: {
            ":inc": 1
        },
        ReturnValues: "UPDATED_NEW"
    };
    
    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify({"Message": res}),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,POST',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        },
    });

    if (event.body !== null && event.body !== undefined) {
        var bodyJson = JSON.parse(event.body);
        bodyJson.Items.forEach(function(song) {
            params.Key = { "Display": "Y", "Title": song.Title };
            docClient.update(params, function(err, data) {
                if (err) {
                    console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                }
            });
        });
        done(null,"Success");
    } else {
        done(null,"Empty Request");
    }
};