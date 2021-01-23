const AWS = require('aws-sdk');
const putFn = ((film, cb) => cb(null, film));
const films = { Items : [{ name: 'Los 101 Dalmatas', year: '1957'},{ name: 'El Rey Leon', year: '1998'}]};
const scanFn = ((_, cb) => cb(null, films));
AWS.DynamoDB.DocumentClient = jest.fn().mockReturnValue({ put: putFn, scan: scanFn});
module.exports = AWS;