const AWS = require('aws-sdk');
const putFn = ((film, cb) => cb(null, film));
const films = { items : [{ name: 'Film 1', year: '1957'},{ name: 'Film 3', year: '1998'}]};
const scanFn = ((_, cb) => cb(null, films));
AWS.DynamoDB.DocumentClient = jest.fn().mockReturnValue({ put: putFn, scan: scanFn});
module.exports = AWS;