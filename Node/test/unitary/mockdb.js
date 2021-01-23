
function putFn(aws) {
    const putFn = ((film, cb) => cb(null, film));
    aws.DynamoDB.DocumentClient = jest.fn().mockReturnValue({ put: putFn });
}
 function putFnError(aws) {
    const putFn = ((film, cb) => cb(new Error(), null));
    aws.DynamoDB.DocumentClient = jest.fn().mockReturnValue({ put: putFn });
}
function scanFn(aws) {
    const films = { Items: [{ name: 'Los 101 Dalmatas', year: '1957' }, { name: 'El Rey Leon', year: '1998' }] };
    const scanFn = ((_, cb) => cb(null, films));
    aws.DynamoDB.DocumentClient = jest.fn().mockReturnValue({ scan: scanFn });
}

module.exports = {putFn, putFnError, scanFn}