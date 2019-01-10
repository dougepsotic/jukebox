// JukeboxGetSongs
// Copyright 2018 Epsotic LLC
'use strict';

exports.handler = (event, context, callback) => {
    var AWS = require("aws-sdk");
    AWS.config.update({
      region: "us-east-1"
    });
    var docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
        TableName : "CKSongs",
    	KeyConditionExpression: "Display = :displayYes",
        ExpressionAttributeValues: {
            ":displayYes": "Y"
        }
    };
    
    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,POST',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        },
    });

    docClient.query(params, done);

};