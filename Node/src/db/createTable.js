const AWS = require('aws-sdk');

// Create table (if not exist)

const createTable = async (tableName) => {
    
    // Create client at function level to have right config
    const dynamobDB = new AWS.DynamoDB();
    
    return dynamobDB.createTable({
        TableName: tableName,
        AttributeDefinitions: [
            {
                AttributeName: 'id',
                AttributeType: 'N'
            },
        ],
        KeySchema: [
            {
                AttributeName: 'id',
                KeyType: 'HASH'
            },
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        },
    }).promise().catch((reason) => {
        if (reason.message != "Cannot create preexisting table") {
            console.error(reason.message)
        }
    })
}

// const deleteTable = async (params) => {
//     dynamodb.deleteTable(params, function (err, data) {
//         if (err) {
//             console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
//         } else {
//             console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
//         }
//     });

// }

module.exports = createTable 