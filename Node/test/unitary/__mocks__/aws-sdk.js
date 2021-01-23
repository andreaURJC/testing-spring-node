const AWS = require('aws-sdk');
const putFn = ((film, cb) => cb(null, film));
AWS.DynamoDB.DocumentClient = jest.fn().mockReturnValue({ put: putFn});
module.exports = AWS;